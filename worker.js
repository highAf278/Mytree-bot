```javascript
import puppeteer from "@cloudflare/puppeteer";

const EXP_PER_WATER = 10;
const SPARKLE_CHANCE = 0.50;
const SPARKLE_LIFETIME = 5 * 60 * 1000;
const WATER_COOLDOWN = 60 * 60 * 1000;

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

const BACKGROUND_IMAGE = "IMG_7251.jpeg";

const TREE_STAGES = [
  { level: 1, name: "Seedling", image: "IMG_7244.png" },
  { level: 5, name: "Young Tree", image: "IMG_7244.png" },
  { level: 10, name: "Growing Tree", image: "IMG_7244.png" },
  { level: 20, name: "Mature Tree", image: "IMG_7244.png" },
  { level: 35, name: "Enchanted Tree", image: "IMG_7244.png" },
  { level: 50, name: "Legendary Tree", image: "IMG_7244.png" }
];

/*
===========================================================
LEVEL-UP REWARDS
===========================================================
*/

const LEVEL_REWARDS = {
  5: {
    sparkles: 50,
    message: "🌱 Your tree has grown into a **Young Tree**!"
  },

  10: {
    sparkles: 100,
    message: "🌸 Your tree has become a **Growing Tree**!"
  },

  20: {
    sparkles: 200,
    message: "🌳 Your tree has become a **Mature Tree**!"
  },

  35: {
    sparkles: 350,
    message: "✨ Your tree has become an **Enchanted Tree**!"
  },

  50: {
    sparkles: 500,
    message: "👑 Your tree has become a **Legendary Tree**!"
  }
};

/*
===========================================================
WEREWIVES CHAOS EVENTS
===========================================================
*/

const WEREWIVES_EVENTS = [
  {
    chance: 0.08,
    message:
      "🐺💗 **WEREWIVES CHAOS!** The Werewives stormed into the garden and started decorating everything with glitter!",
    exp: 5
  },

  {
    chance: 0.07,
    message:
      "🐺✨ **WEREWIVES CHAOS!** A Werewife climbed your tree and shook glitter everywhere!",
    sparkles: 15
  },

  {
    chance: 0.06,
    message:
      "🐺🌸 **WEREWIVES CHAOS!** The Werewives declared your tree officially fabulous. You received a chaos blessing!",
    exp: 10
  },

  {
    chance: 0.05,
    message:
      "🐺💅 **WEREWIVES CHAOS!** The Werewives stole some of your fertilizer and left glitter in its place.",
    sparkles: 10
  },

  {
    chance: 0.04,
    message:
      "🐺🌙 **WEREWIVES CHAOS!** Something howled in the garden... the Werewives have arrived.",
    exp: 15,
    sparkles: 10
  },

  {
    chance: 0.03,
    message:
      "🐺💖 **RARE WEREWIVES CHAOS!** The Werewives threw a full moon garden party!",
    exp: 25,
    sparkles: 30
  }
];

function getRandomWerewivesEvent() {
  const roll = Math.random();

  let total = 0;

  for (const event of WEREWIVES_EVENTS) {
    total += event.chance;

    if (roll < total) {
      return event;
    }
  }

  return null;
}

/*
===========================================================
GENERAL HELPERS
===========================================================
*/

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

function getStage(level) {
  let stage = TREE_STAGES[0];

  for (const s of TREE_STAGES) {
    if (level >= s.level) {
      stage = s;
    }
  }

  return stage;
}

function newPlayer() {
  return {
    name: "My Tree",

    level: 1,
    exp: 0,

    sparkles: 0,

    lastWater: 0,
    lastDaily: 0,

    sparkle: null,

    claimedLevelRewards: [],

    inventory: {
      backgrounds: ["pink_sky"],
      tree_types: ["cherry"],
      decorations: [],
      effects: [],
      cosmetics: [],
      fertilizer: []
    },

    equipped: {
      background: "pink_sky",
      tree_type: "cherry",
      decoration: null,
      effect: null,
      cosmetic: null
    }
  };
}

async function getPlayer(env, userId) {
  const data = await env.TREE_DATA.get(userId, "json");

  if (!data) {
    const player = newPlayer();

    await env.TREE_DATA.put(
      userId,
      JSON.stringify(player)
    );

    return player;
  }

  /*
  Make older player data compatible with the
  new reward system.
  */

  if (!playerHasProperty(data, "claimedLevelRewards")) {
    data.claimedLevelRewards = [];
  }

  if (!data.inventory) {
    data.inventory = newPlayer().inventory;
  }

  if (!data.equipped) {
    data.equipped = newPlayer().equipped;
  }

  return data;
}

function playerHasProperty(player, property) {
  return Object.prototype.hasOwnProperty.call(
    player,
    property
  );
}

async function savePlayer(env, userId, player) {
  await env.TREE_DATA.put(
    userId,
    JSON.stringify(player)
  );
}

/*
===========================================================
XP / LEVEL SYSTEM
===========================================================
*/

function addExp(player, amount) {
  player.exp += amount;

  let leveledUp = false;
  const levelsGained = [];

  let needed = player.level * 50;

  while (player.exp >= needed) {
    player.exp -= needed;

    player.level++;

    leveledUp = true;
    levelsGained.push(player.level);

    needed = player.level * 50;
  }

  return {
    leveledUp,
    levelsGained
  };
}

function giveLevelRewards(player, levelsGained) {
  const rewards = [];

  for (const level of levelsGained) {
    if (player.claimedLevelRewards.includes(level)) {
      continue;
    }

    const reward = LEVEL_REWARDS[level];

    if (!reward) {
      continue;
    }

    player.sparkles += reward.sparkles;

    player.claimedLevelRewards.push(level);

    rewards.push({
      level,
      sparkles: reward.sparkles,
      message: reward.message
    });
  }

  return rewards;
}

/*
===========================================================
SPARKLES
===========================================================
*/

function sparkleInfo() {
  const choices = [
    {
      name: "Pink Sparkle",
      emoji: "💖",
      reward: 15
    },

    {
      name: "Rainbow Sparkle",
      emoji: "🌈",
      reward: 25
    },

    {
      name: "Moon Sparkle",
      emoji: "🌙",
      reward: 35
    },

    {
      name: "Rare Star",
      emoji: "🌟",
      reward: 75
    }
  ];

  return choices[
    Math.floor(Math.random() * choices.length)
  ];
}

/*
===========================================================
TREE IMAGE
===========================================================
*/

async function renderTree(env, player) {
  const stage = getStage(player.level);

  const browser = await puppeteer.launch(env.BROWSER);

  const page = await browser.newPage();

  const backgroundUrl =
    `${R2_BASE}${BACKGROUND_IMAGE}`;

  const treeUrl =
    `${R2_BASE}${stage.image}`;

  let sparkleMessage = "";

  if (player.sparkle) {
    const remaining =
      SPARKLE_LIFETIME -
      (Date.now() - player.sparkle.spawnedAt);

    if (remaining > 0) {
      sparkleMessage =
        `✨ ${escapeHtml(player.sparkle.name)} is waiting! Use /catch! ✨`;
    }
  }

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

html,
body {

  margin: 0;
  padding: 0;

  width: 1024px;
  height: 1024px;

  overflow: hidden;

  background: #ffc7e8;

}

.scene {

  position: relative;

  width: 1024px;
  height: 1024px;

  overflow: hidden;

}

.background {

  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

}

.tree {

  position: absolute;

  left: 50%;

  bottom: 90px;

  transform: translateX(-50%);

  width: 78%;
  height: 72%;

  object-fit: contain;

  object-position: center bottom;

}

.title {

  position: absolute;

  top: 35px;

  left: 0;

  width: 100%;

  text-align: center;

  font-family: Arial, sans-serif;

  font-size: 42px;

  font-weight: bold;

  color: white;

  text-shadow:

    0 3px 8px rgba(0,0,0,.35),

    0 0 12px rgba(255,255,255,.7);

}

.level {

  position: absolute;

  top: 100px;

  left: 50%;

  transform: translateX(-50%);

  padding: 10px 18px;

  border-radius: 20px;

  background: rgba(255,255,255,.78);

  font-family: Arial, sans-serif;

  font-size: 24px;

  font-weight: bold;

  color: #8b4770;

}

.sparkle-message {

  position: absolute;

  bottom: 25px;

  left: 50%;

  transform: translateX(-50%);

  width: 90%;

  text-align: center;

  font-family: Arial, sans-serif;

  font-size: 30px;

  font-weight: bold;

  color: white;

  text-shadow:

    0 3px 8px rgba(0,0,0,.45),

    0 0 12px rgba(255,255,255,.8);

}

</style>

</head>

<body>

<div class="scene">

  <img
    class="background"
    src="${backgroundUrl}"
  >

  <img
    class="tree"
    src="${treeUrl}"
  >

  <div class="title">
    ${escapeHtml(player.name)}
  </div>

  <div class="level">
    🌸 Level ${player.level} • ${stage.name}
  </div>

  <div class="sparkle-message">
    ${sparkleMessage}
  </div>

</div>

</body>

</html>
`;

  await page.setContent(
    html,
    {
      waitUntil: "networkidle0"
    }
  );

  await page.evaluate(async () => {

    const images =
      Array.from(document.images);

    await Promise.all(
      images.map(img => {

        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise(resolve => {

          img.onload = resolve;
          img.onerror = resolve;

        });

      })
    );

  });

  const screenshot =
    await page.screenshot({
      type: "png"
    });

  await browser.close();

  return screenshot;
}

/*
===========================================================
SPARKLE CATCH IMAGE
===========================================================
*/

async function renderSparkleCatch(env, player) {

  const stage =
    getStage(player.level);

  const browser =
    await puppeteer.launch(env.BROWSER);

  const page =
    await browser.newPage();

  const backgroundUrl =
    `${R2_BASE}${BACKGROUND_IMAGE}`;

  const treeUrl =
    `${R2_BASE}${stage.image}`;

  const sparkle =
    player.sparkle || {
      emoji: "✨",
      name: "Sparkle",
      reward: 15
    };

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

html,
body {

  margin: 0;
  padding: 0;

  width: 1024px;
  height: 1024px;

  overflow: hidden;

}

.scene {

  position: relative;

  width: 1024px;
  height: 1024px;

  overflow: hidden;

}

.background {

  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

}

.tree {

  position: absolute;

  left: 50%;

  bottom: 90px;

  transform: translateX(-50%);

  width: 78%;
  height: 72%;

  object-fit: contain;

  object-position: center bottom;

}

.sparkle {

  position: absolute;

  font-size: 65px;

  text-shadow:
    0 0 20px white;

}

.s1 {
  left: 18%;
  top: 18%;
}

.s2 {
  left: 34%;
  top: 8%;
}

.s3 {
  left: 57%;
  top: 16%;
}

.s4 {
  left: 76%;
  top: 28%;
}

.caught {

  position: absolute;

  left: 50%;
  top: 42%;

  transform:
    translate(-50%, -50%);

  font-size: 115px;

  text-shadow:

    0 0 15px white,

    0 0 35px white,

    0 0 60px #ffb7e5;

  animation:
    pulse .8s infinite alternate;

}

.message {

  position: absolute;

  bottom: 30px;

  width: 100%;

  text-align: center;

  font-family: Arial, sans-serif;

  font-size: 38px;

  font-weight: bold;

  color: white;

  text-shadow:
    0 3px 8px rgba(0,0,0,.4);

}

@keyframes pulse {

  from {

    transform:
      translate(-50%, -50%)
      scale(.9);

  }

  to {

    transform:
      translate(-50%, -50%)
      scale(1.1);

  }

}

</style>

</head>

<body>

<div class="scene">

  <img
    class="background"
    src="${backgroundUrl}"
  >

  <img
    class="tree"
    src="${treeUrl}"
  >

  <div class="sparkle s1">
    ✨
  </div>

  <div class="sparkle s2">
    ${sparkle.emoji}
  </div>

  <div class="sparkle s3">
    ✨
  </div>

  <div class="sparkle s4">
    💫
  </div>

  <div class="caught">
    ${sparkle.emoji}
  </div>

  <div class="message">

    ✨
    ${escapeHtml(sparkle.name)}
    caught! +${sparkle.reward}
    ✨

  </div>

</div>

</body>

</html>
`;

  await page.setContent(
    html,
    {
      waitUntil: "networkidle0"
    }
  );

  await page.evaluate(async () => {

    const images =
      Array.from(document.images);

    await Promise.all(
      images.map(img => {

        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise(resolve => {

          img.onload = resolve;
          img.onerror = resolve;

        });

      })
    );

  });

  const screenshot =
    await page.screenshot({
      type: "png"
    });

  await browser.close();

  return screenshot;
}

/*
===========================================================
DISCORD BUTTONS
===========================================================
*/

function treeButtons() {

  return [
    {
      type: 1,

      components: [

        {
          type: 2,
          style: 1,
          label: "Water",
          emoji: {
            name: "💧"
          },
          custom_id: "tree_water"
        },

        {
          type: 2,
          style: 2,
          label: "Catch",
          emoji: {
            name: "✨"
          },
          custom_id: "tree_catch"
        },

        {
          type: 2,
          style: 3,
          label: "Daily",
          emoji: {
            name: "🎁"
          },
          custom_id: "tree_daily"
        }

      ]
    },

    {
      type: 1,

      components: [

        {
          type: 2,
          style: 2,
          label: "Inventory",
          emoji: {
            name: "🎒"
          },
          custom_id: "tree_inventory"
        },

        {
          type: 2,
          style: 2,
          label: "Shop",
          emoji: {
            name: "🛍️"
          },
          custom_id: "tree_shop"
        }

      ]
    }
  ];
}

/*
===========================================================
DISCORD REQUESTS
===========================================================
*/

async function discordRequest(
  env,
  endpoint,
  body
) {

  return fetch(
    `https://discord.com/api/v10${endpoint}`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bot ${env.BOT_TOKEN}`,

        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(body)
    }
  );
}

async function respond(
  interaction,
  env,
  content,
  ephemeral = false,
  components = []
) {

  const flags =
    ephemeral ? 64 : 0;

  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        type: 4,

        data: {

          content,

          flags,

          components

        }

      })

    }
  );
}

async function respondWithImage(
  interaction,
  env,
  image,
  content = "",
  components = []
) {

  const form =
    new FormData();

  form.append(
    "payload_json",

    JSON.stringify({

      content,

      components,

      attachments: [

        {
          id: 0,
          filename: "tree.png"
        }

      ]

    })
  );

  form.append(
    "files[0]",

    new File(
      [image],
      "tree.png",
      {
        type: "image/png"
      }
    )
  );

  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      body: form

    }
  );
}

function commandName(interaction) {
  return interaction.data?.name;
}

function componentId(interaction) {
  return interaction.data?.custom_id;
}

/*
===========================================================
TREE
===========================================================
*/

async function handleTree(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  const image =
    await renderTree(env, player);

  return respondWithImage(
    interaction,
    env,
    image,

    `🌸 **${player.name}**\n` +
    `Level **${player.level}** • ` +
    `${getStage(player.level).name}\n` +
    `💖 Sparkles: **${player.sparkles}**`,

    treeButtons()
  );
}

/*
===========================================================
WATER
===========================================================
*/

async function handleWater(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  const now =
    Date.now();

  if (
    player.lastWater &&
    now - player.lastWater <
      WATER_COOLDOWN
  ) {

    const remaining =
      WATER_COOLDOWN -
      (now - player.lastWater);

    const minutes =
      Math.ceil(
        remaining / 60000
      );

    return respond(
      interaction,
      env,

      `💧 Your tree has already been watered!\n` +
      `Come back in about **${minutes} minute${minutes === 1 ? "" : "s"}**.`,

      true
    );

  }

  player.lastWater = now;

  const xpResult =
    addExp(
      player,
      EXP_PER_WATER
    );

  let message =
    `💧 You watered **${player.name}**!\n` +
    `✨ +${EXP_PER_WATER} XP`;

  /*
  LEVEL REWARDS
  */

  const levelRewards =
    giveLevelRewards(
      player,
      xpResult.levelsGained
    );

  if (levelRewards.length) {

    for (const reward of levelRewards) {

      message +=
        `\n\n🎉 **LEVEL UP!** ` +
        `Level **${reward.level}**!` +

        `\n🎁 ${reward.message}` +

        `\n💖 Level reward: **+${reward.sparkles} sparkles**`;

    }

  }

  /*
  SPARKLE SPAWN
  */

  if (
    Math.random() <
    SPARKLE_CHANCE
  ) {

    const sparkle =
      sparkleInfo();

    player.sparkle = {

      ...sparkle,

      spawnedAt: now

    };

    message +=

      `\n\n✨ A **${sparkle.name}** appeared!` +

      `\nQuick — hit **Catch**!`;

  }

  /*
  WEREWIVES CHAOS
  */

  const chaos =
    getRandomWerewivesEvent();

  if (chaos) {

    message +=
      `\n\n${chaos.message}`;

    if (chaos.exp) {

      const chaosXP =
        addExp(
          player,
          chaos.exp
        );

      message +=
        `\n✨ Werewives chaos gave you **+${chaos.exp} XP**!`;

      const chaosRewards =
        giveLevelRewards(
          player,
          chaosXP.levelsGained
        );

      for (
        const reward
        of chaosRewards
      ) {

        message +=
          `\n🎉 **LEVEL ${reward.level}!** ` +
          `🎁 +${reward.sparkles} sparkles`;

      }

    }

    if (chaos.sparkles) {

      player.sparkles +=
        chaos.sparkles;

      message +=
        `\n💖 Werewives gift: **+${chaos.sparkles} sparkles!**`;

    }

  }

  await savePlayer(
    env,
    userId,
    player
  );

  return respond(
    interaction,
    env,
    message
  );
}

/*
===========================================================
CATCH
===========================================================
*/

async function handleCatch(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  if (!player.sparkle) {

    return respond(
      interaction,
      env,
      "✨ There isn't a sparkle to catch right now!"
    );

  }

  const now =
    Date.now();

  if (
    now -
    player.sparkle.spawnedAt >
    SPARKLE_LIFETIME
  ) {

    player.sparkle = null;

    await savePlayer(
      env,
      userId,
      player
    );

    return respond(
      interaction,
      env,
      "💨 The sparkle disappeared before you could catch it!"
    );

  }

  const sparkle =
    player.sparkle;

  player.sparkles +=
    sparkle.reward;

  player.sparkle = null;

  await savePlayer(
    env,
    userId,
    player
  );

  const image =
    await renderSparkleCatch(
      env,
      player
    );

  return respondWithImage(
    interaction,
    env,
    image,

    `✨ **${sparkle.name} caught!** ` +
    `+${sparkle.reward} sparkles!\n` +

    `💖 You now have **${player.sparkles} sparkles**.`,

    treeButtons()
  );
}

/*
===========================================================
DAILY
===========================================================
*/

async function handleDaily(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  const now =
    Date.now();

  const DAY =
    24 * 60 * 60 * 1000;

  if (
    player.lastDaily &&
    now - player.lastDaily <
      DAY
  ) {

    const remaining =
      DAY -
      (now - player.lastDaily);

    const hours =
      Math.ceil(
        remaining / 3600000
      );

    return respond(
      interaction,
      env,

      `🌸 You already collected your daily reward!\n` +
      `Come back in about **${hours} hour${hours === 1 ? "" : "s"}**.`,

      true
    );

  }

  player.lastDaily =
    now;

  player.sparkles +=
    25;

  await savePlayer(
    env,
    userId,
    player
  );

  return respond(
    interaction,
    env,

    `🎁 **Daily reward!**\n` +
    `You received **25 sparkles**! 💖\n\n` +
    `💖 You now have **${player.sparkles} sparkles**.`,

    false
  );
}

/*
===========================================================
INVENTORY
===========================================================
*/

async function handleInventory(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  return respond(
    interaction,
    env,

    `🎒 **${player.name}'s Inventory**\n\n` +

    `🌸 Backgrounds: ` +
    `${player.inventory.backgrounds.join(", ")}\n` +

    `🌳 Tree Types: ` +
    `${player.inventory.tree_types.join(", ")}\n` +

    `✨ Decorations: ` +
    `${player.inventory.decorations.length || "None"}\n` +

    `💫 Effects: ` +
    `${player.inventory.effects.length || "None"}\n` +

    `🎀 Cosmetics: ` +
    `${player.inventory.cosmetics.length || "None"}\n\n` +

    `💖 Sparkles: **${player.sparkles}**`

  );

}

/*
===========================================================
SHOP
===========================================================
*/

async function handleShop(
  interaction,
  env
) {

  return respond(
    interaction,
    env,

    `🛍️ **My Tree Shop**\n\n` +

    `💗 More items are coming soon!\n\n` +

    `Your sparkles can eventually be used for:\n` +

    `🌸 Backgrounds\n` +
    `🌳 Tree types\n` +
    `✨ Decorations\n` +
    `💫 Effects\n` +
    `🎀 Cosmetics`

  );

}

/*
===========================================================
CUSTOMIZE
===========================================================
*/

async function handleCustomize(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  return respond(
    interaction,
    env,

    `🎀 **Customize ${player.name}**\n\n` +

    `🌸 Background: **${player.equipped.background}**\n` +

    `🌳 Tree: **${player.equipped.tree_type}**\n\n` +

    `More customization options coming soon!`

  );

}

/*
===========================================================
LEADERBOARD
===========================================================
*/

async function handleLeaderboard(
  interaction,
  env
) {

  return respond(
    interaction,
    env,

    `🏆 **My Tree Leaderboard**\n\n` +

    `Leaderboard tracking is coming soon! 🌸`

  );

}

/*
===========================================================
RENAME
===========================================================
*/

async function handleRename(
  interaction,
  env
) {

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const newName =
    interaction.data?.options?.find(
      option =>
        option.name === "name"
    )?.value;

  if (!newName) {

    return respond(
      interaction,
      env,
      "🌸 Please provide a name for your tree."
    );

  }

  const player =
    await getPlayer(
      env,
      userId
    );

  player.name =
    String(newName)
      .slice(0, 50);

  await savePlayer(
    env,
    userId,
    player
  );

  return respond(
    interaction,
    env,

    `🌸 Your tree is now named **${player.name}**!`

  );

}

/*
===========================================================
COMMAND REGISTRATION
===========================================================
*/

async function registerCommands(env) {

  const commands = [

    {
      name: "tree",
      description:
        "View your tree"
    },

    {
      name: "water",
      description:
        "Water your tree"
    },

    {
      name: "catch",
      description:
        "Catch an appearing sparkle"
    },

    {
      name: "daily",
      description:
        "Collect your daily sparkle reward"
    },

    {
      name: "shop",
      description:
        "Visit the My Tree shop"
    },

    {
      name: "customize",
      description:
        "Customize your tree"
    },

    {
      name: "inventory",
      description:
        "View your inventory"
    },

    {
      name: "leaderboard",
      description:
        "View the tree leaderboard"
    },

    {
      name: "rename",

      description:
        "Rename your tree",

      options: [

        {
          name: "name",

          description:
            "Your new tree name",

          type: 3,

          required: true

        }

      ]

    }

  ];

  const response =
    await fetch(

      `https://discord.com/api/v10/applications/${env.CLIENT_ID}/commands`,

      {

        method: "PUT",

        headers: {

          Authorization:
            `Bot ${env.BOT_TOKEN}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(commands)

      }

    );

  return response;

}

/*
===========================================================
DISCORD VERIFICATION
===========================================================
*/

async function verifyDiscordRequest(
  request,
  env
) {

  const signature =
    request.headers.get(
      "X-Signature-Ed25519"
    );

  const timestamp =
    request.headers.get(
      "X-Signature-Timestamp"
    );

  if (
    !signature ||
    !timestamp
  ) {

    return false;

  }

  const body =
    await request.clone().text();

  const encoder =
    new TextEncoder();

  const publicKey =
    await crypto.subtle.importKey(

      "raw",

      hexToBytes(
        env.PUBLIC_KEY
      ),

      {
        name: "Ed25519",
        namedCurve: "Ed25519"
      },

      false,

      ["verify"]

    );

  return crypto.subtle.verify(

    "Ed25519",

    publicKey,

    hexToBytes(signature),

    encoder.encode(
      timestamp + body
    )

  );

}

function hexToBytes(hex) {

  const bytes =
    new Uint8Array(
      hex.length / 2
    );

  for (
    let i = 0;
    i < bytes.length;
    i++
  ) {

    bytes[i] =
      parseInt(
        hex.slice(
          i * 2,
          i * 2 + 2
        ),
        16
      );

  }

  return bytes;

}

function escapeHtml(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}

/*
===========================================================
BUTTON INTERACTIONS
===========================================================
*/

async function handleComponent(
  interaction,
  env
) {

  const id =
    componentId(interaction);

  switch (id) {

    case "tree_water":
      return handleWater(
        interaction,
        env
      );

    case "tree_catch":
      return handleCatch(
        interaction,
        env
      );

    case "tree_daily":
      return handleDaily(
        interaction,
        env
      );

    case "tree_inventory":
      return handleInventory(
        interaction,
        env
      );

    case "tree_shop":
      return handleShop(
        interaction,
        env
      );

    default:

      return respond(
        interaction,
        env,
        "🌸 Unknown button."
      );

  }

}

/*
===========================================================
WORKER
===========================================================
*/

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(request.url);

    /*
    HOME
    */

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return new Response(
        "My Tree bot is alive 🌸",
        {
          status: 200
        }
      );

    }

    /*
    COMMAND REGISTRATION
    */

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {

      const result =
        await registerCommands(env);

      const text =
        await result.text();

      return new Response(

        result.ok

          ? "Commands registered successfully! 🌸"

          : `Registration failed:\n${text}`,

        {
          status:
            result.ok
              ? 200
              : 500
        }

      );

    }

    /*
    DISCORD INTERACTIONS
    */

    if (
      request.method === "POST" &&
      url.pathname === "/interactions"
    ) {

      const valid =
        await verifyDiscordRequest(
          request,
          env
        );

      if (!valid) {

        return new Response(
          "Invalid request signature",
          {
            status: 401
          }
        );

      }

      const interaction =
        await request.json();

      /*
      PING
      */

      if (
        interaction.type === 1
      ) {

        return json({
          type: 1
        });

      }

      /*
      BUTTONS
      */

      if (
        interaction.type === 3
      ) {

        try {

          return await handleComponent(
            interaction,
            env
          );

        } catch (error) {

          console.error(error);

          return respond(
            interaction,
            env,

            `❌ Something went wrong.\n` +
            `\`${error.message || error}\``,

            true
          );

        }

      }

      /*
      SLASH COMMANDS
      */

      if (
        interaction.type !== 2
      ) {

        return json({
          type: 1
        });

      }

      const command =
        commandName(interaction);

      try {

        switch (command) {

          case "tree":

            return await handleTree(
              interaction,
              env
            );

          case "water":

            return await handleWater(
              interaction,
              env
            );

          case "catch":

            return await handleCatch(
              interaction,
              env
            );

          case "daily":

            return await handleDaily(
              interaction,
              env
            );

          case "shop":

            return await handleShop(
              interaction,
              env
            );

          case "customize":

            return await handleCustomize(
              interaction,
              env
            );

          case "inventory":

            return await handleInventory(
              interaction,
              env
            );

          case "leaderboard":

            return await handleLeaderboard(
              interaction,
              env
            );

          case "rename":

            return await handleRename(
              interaction,
              env
            );

          default:

            return respond(
              interaction,
              env,
              "🌸 Unknown command."
            );

        }

      } catch (error) {

        console.error(error);

        return respond(

          interaction,
          env,

          `❌ Something went wrong while growing your tree.\n` +
          `\`${error.message || error}\``,

          true

        );

      }

    }

    return new Response(
      "Not found",
      {
        status: 404
      }
    );

  }

};
```
