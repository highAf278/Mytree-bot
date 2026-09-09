import puppeteer from "@cloudflare/puppeteer";

/* =========================
   SETTINGS
========================= */

const EXP_PER_WATER = 10;
const SPARKLE_CHANCE = 0.50;
const SPARKLE_LIFETIME = 5 * 60 * 1000;
const WATER_COOLDOWN = 60 * 60 * 1000;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

const BACKGROUND_IMAGE = "IMG_7251.jpeg";

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

/* =========================
   TREE STAGES
========================= */

const TREE_STAGES = [
  {
    level: 1,
    name: "Seedling",
    image: "IMG_7244.png"
  },
  {
    level: 5,
    name: "Young Tree",
    image: "IMG_7244.png"
  },
  {
    level: 10,
    name: "Growing Tree",
    image: "IMG_7244.png"
  },
  {
    level: 20,
    name: "Mature Tree",
    image: "IMG_7244.png"
  },
  {
    level: 35,
    name: "Enchanted Tree",
    image: "IMG_7244.png"
  },
  {
    level: 50,
    name: "Legendary Tree",
    image: "IMG_7244.png"
  }
];

/* =========================
   LEVEL REWARDS
========================= */

const LEVEL_REWARDS = {
  5: {
    sparkles: 50,
    message:
      "🌸 Your tree reached level 5! You received 50 sparkles!"
  },

  10: {
    sparkles: 100,
    message:
      "🌸 Level 10! Your tree is getting magical! +100 sparkles!"
  },

  20: {
    sparkles: 200,
    message:
      "✨ Level 20! Your tree is becoming enchanted! +200 sparkles!"
  },

  35: {
    sparkles: 350,
    message:
      "💫 Level 35! The tree is ENCHANTED! +350 sparkles!"
  },

  50: {
    sparkles: 500,
    message:
      "🌟 LEVEL 50! LEGENDARY TREE! +500 sparkles!"
  }
};

/* =========================
   WEREWIVES CHAOS
========================= */

const WEREWIVES_EVENTS = [
  {
    message:
      "🐺 A pack of werewives sprinted through the garden!",
    exp: 15,
    sparkles: 10
  },

  {
    message:
      "💅 The werewives aggressively decorated your tree!",
    exp: 20,
    sparkles: 15
  },

  {
    message:
      "🌙 The werewives howled at the moon and scared XP into your tree!",
    exp: 25,
    sparkles: 20
  },

  {
    message:
      "🌸 A werewife accidentally watered your tree with glitter!",
    exp: 30,
    sparkles: 25
  },

  {
    message:
      "💥 WEREWIFE CHAOS! Nobody knows what happened, but your tree benefited!",
    exp: 40,
    sparkles: 35
  }
];

/* =========================
   BASIC HELPERS
========================= */

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "content-type": "application/json"
      }
    }
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   PLAYER
========================= */

function newPlayer() {
  return {
    name: "My Tree",

    level: 1,
    exp: 0,

    sparkles: 0,

    lastWater: 0,
    lastDaily: 0,

    sparkle: null,

    sceneMessage:
      "🌸 Your little tree is waiting for you!",

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

function repairPlayer(player) {
  const defaults = newPlayer();

  player.name ??= defaults.name;
  player.level ??= defaults.level;
  player.exp ??= defaults.exp;
  player.sparkles ??= defaults.sparkles;
  player.lastWater ??= defaults.lastWater;
  player.lastDaily ??= defaults.lastDaily;
  player.sparkle ??= defaults.sparkle;
  player.sceneMessage ??= defaults.sceneMessage;
  player.claimedLevelRewards ??=
    defaults.claimedLevelRewards;

  player.inventory ??= {};

  player.inventory.backgrounds ??=
    defaults.inventory.backgrounds;

  player.inventory.tree_types ??=
    defaults.inventory.tree_types;

  player.inventory.decorations ??=
    defaults.inventory.decorations;

  player.inventory.effects ??=
    defaults.inventory.effects;

  player.inventory.cosmetics ??=
    defaults.inventory.cosmetics;

  player.inventory.fertilizer ??=
    defaults.inventory.fertilizer;

  player.equipped ??= {};

  player.equipped.background ??=
    defaults.equipped.background;

  player.equipped.tree_type ??=
    defaults.equipped.tree_type;

  player.equipped.decoration ??=
    defaults.equipped.decoration;

  player.equipped.effect ??=
    defaults.equipped.effect;

  player.equipped.cosmetic ??=
    defaults.equipped.cosmetic;

  return player;
}

async function getPlayer(env, userId) {
  const data =
    await env.TREE_DATA.get(
      userId,
      "json"
    );

  if (!data) {
    const player = newPlayer();

    await savePlayer(
      env,
      userId,
      player
    );

    return player;
  }

  return repairPlayer(data);
}

async function savePlayer(
  env,
  userId,
  player
) {
  await env.TREE_DATA.put(
    userId,
    JSON.stringify(player)
  );
}

/* =========================
   TREE LOGIC
========================= */

function getStage(level) {
  let stage = TREE_STAGES[0];

  for (const current of TREE_STAGES) {
    if (level >= current.level) {
      stage = current;
    }
  }

  return stage;
}

function addExp(player, amount) {
  player.exp += amount;

  const levelUps = [];

  while (
    player.exp >= player.level * 50
  ) {
    player.exp -= player.level * 50;

    player.level++;

    const reward =
      LEVEL_REWARDS[player.level];

    if (
      reward &&
      !player.claimedLevelRewards.includes(
        player.level
      )
    ) {
      player.sparkles +=
        reward.sparkles;

      player.claimedLevelRewards.push(
        player.level
      );

      levelUps.push(
        reward.message
      );
    }
  }

  return {
    leveledUp:
      levelUps.length > 0,

    levelUps
  };
}

/* =========================
   SPARKLES
========================= */

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
    Math.floor(
      Math.random() *
      choices.length
    )
  ];
}

function sparklePosition() {
  const positions = [
    {
      left: "14%",
      top: "20%"
    },

    {
      left: "28%",
      top: "12%"
    },

    {
      left: "43%",
      top: "18%"
    },

    {
      left: "58%",
      top: "10%"
    },

    {
      left: "72%",
      top: "19%"
    },

    {
      left: "82%",
      top: "30%"
    },

    {
      left: "18%",
      top: "38%"
    },

    {
      left: "76%",
      top: "42%"
    },

    {
      left: "35%",
      top: "30%"
    },

    {
      left: "63%",
      top: "34%"
    }
  ];

  return positions[
    Math.floor(
      Math.random() *
      positions.length
    )
  ];
}

function randomWerewivesEvent() {
  return WEREWIVES_EVENTS[
    Math.floor(
      Math.random() *
      WEREWIVES_EVENTS.length
    )
  ];
}

/* =========================
   TREE IMAGE
========================= */

async function renderTree(
  env,
  player,
  statusMessage = null
) {
  const stage =
    getStage(player.level);

  const browser =
    await puppeteer.launch(
      env.BROWSER
    );

  try {
    const page =
      await browser.newPage();

    const backgroundUrl =
      `${R2_BASE}${BACKGROUND_IMAGE}`;

    const treeUrl =
      `${R2_BASE}${stage.image}`;

    let activeSparkle = null;

    if (player.sparkle) {
      if (
        Date.now() -
          player.sparkle.spawnedAt <
        SPARKLE_LIFETIME
      ) {
        activeSparkle =
          player.sparkle;
      }
    }

    const sparklePos =
      activeSparkle
        ? activeSparkle.position
        : null;

    const message =
      statusMessage ||
      player.sceneMessage ||
      "";

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

  z-index: 0;
}

.tree {
  position: absolute;

  left: 50%;

  bottom: 125px;

  transform:
    translateX(-50%);

  width: 78%;
  height: 70%;

  object-fit: contain;

  object-position:
    center bottom;

  z-index: 2;
}

.title {
  position: absolute;

  top: 30px;
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

  z-index: 10;
}

.level {
  position: absolute;

  top: 90px;
  left: 30px;

  padding: 10px 18px;

  border-radius: 20px;

  background:
    rgba(255,255,255,.78);

  font-family:
    Arial, sans-serif;

  font-size: 22px;

  font-weight: bold;

  color: #8b4770;

  z-index: 10;
}

.sparkle {
  position: absolute;

  font-size: 62px;

  z-index: 8;

  text-shadow:
    0 0 10px white,
    0 0 25px white,
    0 0 40px #ffb7e5;

  animation:
    sparkleFloat
    1s ease-in-out infinite alternate,

    sparklePulse
    .7s ease-in-out infinite alternate;
}

@keyframes sparkleFloat {

  from {
    transform:
      translateY(0px)
      rotate(-5deg);
  }

  to {
    transform:
      translateY(-15px)
      rotate(5deg);
  }

}

@keyframes sparklePulse {

  from {
    filter: brightness(1);
  }

  to {
    filter: brightness(1.8);
  }

}

.messageBox {
  position: absolute;

  left: 5%;
  bottom: 25px;

  width: 90%;

  min-height: 62px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 10px 20px;

  border-radius: 22px;

  background:
    rgba(255,255,255,.88);

  font-family:
    Arial, sans-serif;

  font-size: 25px;

  font-weight: bold;

  text-align: center;

  color: #8b4770;

  box-shadow:
    0 3px 15px
    rgba(0,0,0,.18);

  z-index: 10;
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
  🌸 Level ${player.level}
  • ${escapeHtml(stage.name)}
</div>

${
  activeSparkle &&
  sparklePos
    ? `
<div
  class="sparkle"
  style="
    left:
      ${sparklePos.left};
    top:
      ${sparklePos.top};
  "
>
  ${activeSparkle.emoji}
</div>
`
    : ""
}

<div class="messageBox">
  ${escapeHtml(message)}
</div>

</div>

</body>

</html>
`;

    await page.setContent(
      html,
      {
        waitUntil:
          "networkidle0"
      }
    );

    await page.evaluate(
      async () => {
        const images =
          Array.from(
            document.images
          );

        await Promise.all(
          images.map(img => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise(
              resolve => {
                img.onload =
                  resolve;

                img.onerror =
                  resolve;
              }
            );
          })
        );
      }
    );

    return await page.screenshot({
      type: "png"
    });

  } finally {
    await browser.close();
  }
}

/* =========================
   BUTTONS
========================= */

function treeButtons(player) {
  const buttons = [];

  if (player.sparkle) {
    buttons.push({
      type: 2,
      style: 1,
      custom_id: "tree_catch",
      label:
        `Catch ${player.sparkle.name}`,
      emoji: {
        name: "🧺"
      }
    });
  } else {
    buttons.push({
      type: 2,
      style: 1,
      custom_id: "tree_water",
      label: "Water Tree",
      emoji: {
        name: "💧"
      }
    });
  }

  buttons.push({
    type: 2,
    style: 2,
    custom_id: "tree_daily",
    label: "Daily",
    emoji: {
      name: "🎁"
    }
  });

  buttons.push({
    type: 2,
    style: 2,
    custom_id: "tree_inventory",
    label: "Inventory",
    emoji: {
      name: "🎒"
    }
  });

  buttons.push({
    type: 2,
    style: 2,
    custom_id: "tree_shop",
    label: "Shop",
    emoji: {
      name: "🛍️"
    }
  });

  return {
    type: 1,
    components: buttons
  };
}

/* =========================
   DISCORD RESPONSES
========================= */

/*
  IMPORTANT:
  Discord gets an immediate acknowledgement first.
  Then we edit the original response with the tree image.
*/

async function acknowledge(
  interaction
) {
  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        type: 5
      })
    }
  );
}

async function editOriginal(
  interaction,
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

  const response =
    await fetch(
      `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
      {
        method: "PATCH",

        body: form
      }
    );

  if (!response.ok) {
    console.error(
      "Discord edit error:",
      response.status,
      await response.text()
    );
  }

  return response;
}

async function sendText(
  interaction,
  content,
  ephemeral = false
) {
  const flags =
    ephemeral ? 64 : 0;

  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        content,
        flags
      })
    }
  );
}

/* =========================
   TREE COMMAND
========================= */

async function handleTree(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  if (
    player.sparkle &&
    Date.now() -
      player.sparkle.spawnedAt >
      SPARKLE_LIFETIME
  ) {
    player.sparkle = null;

    player.sceneMessage =
      "💨 Your sparkle disappeared!";

    await savePlayer(
      env,
      userId,
      player
    );
  }

  const image =
    await renderTree(
      env,
      player
    );

  return editOriginal(
    interaction,
    image,

    `🌸 **${player.name}** • Level **${player.level}**\n` +
    `💖 Sparkles: **${player.sparkles}**`,

    [treeButtons(player)]
  );
}

/* =========================
   WATER
========================= */

async function handleWater(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  const now = Date.now();

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

    player.sceneMessage =
      `💧 You already watered your tree! You can water again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;

    await savePlayer(
      env,
      userId,
      player
    );

    const image =
      await renderTree(
        env,
        player
      );

    return editOriginal(
      interaction,
      image,
      "",
      [treeButtons(player)]
    );
  }

  player.lastWater = now;

  const levelResult =
    addExp(
      player,
      EXP_PER_WATER
    );

  let message =
    `💧 You watered ${player.name}! +${EXP_PER_WATER} XP`;

  if (
    levelResult.leveledUp
  ) {
    message +=
      `\n🌸 LEVEL UP! Level ${player.level}!`;
  }

  if (
    levelResult.levelUps.length
  ) {
    message +=
      `\n${levelResult.levelUps.join("\n")}`;
  }

  /* Werewives chaos */

  if (
    Math.random() < 0.25
  ) {
    const event =
      randomWerewivesEvent();

    message +=
      `\n\n${event.message}`;

    const chaosResult =
      addExp(
        player,
        event.exp
      );

    player.sparkles +=
      event.sparkles;

    message +=
      `\n✨ Werewives bonus: +${event.exp} XP and +${event.sparkles} sparkles!`;

    if (
      chaosResult.leveledUp
    ) {
      message +=
        `\n🌸 LEVEL UP! Level ${player.level}!`;
    }

    if (
      chaosResult.levelUps.length
    ) {
      message +=
        `\n${chaosResult.levelUps.join("\n")}`;
    }
  }

  /* Sparkle spawn */

  if (
    !player.sparkle &&
    Math.random() <
      SPARKLE_CHANCE
  ) {
    const sparkle =
      sparkleInfo();

    player.sparkle = {
      ...sparkle,

      spawnedAt: now,

      position:
        sparklePosition()
    };

    message +=
      `\n\n✨ A ${sparkle.name} appeared! Catch it!`;
  }

  player.sceneMessage =
    message;

  await savePlayer(
    env,
    userId,
    player
  );

  const image =
    await renderTree(
      env,
      player
    );

  return editOriginal(
    interaction,
    image,
    "",
    [treeButtons(player)]
  );
}

/* =========================
   CATCH
========================= */

async function handleCatch(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  if (!player.sparkle) {
    player.sceneMessage =
      "✨ There isn't a sparkle to catch right now!";

    await savePlayer(
      env,
      userId,
      player
    );

    const image =
      await renderTree(
        env,
        player
      );

    return editOriginal(
      interaction,
      image,
      "",
      [treeButtons(player)]
    );
  }

  const now = Date.now();

  if (
    now -
      player.sparkle.spawnedAt >
    SPARKLE_LIFETIME
  ) {
    player.sparkle = null;

    player.sceneMessage =
      "💨 The sparkle disappeared before you could catch it!";

    await savePlayer(
      env,
      userId,
      player
    );

    const image =
      await renderTree(
        env,
        player
      );

    return editOriginal(
      interaction,
      image,
      "",
      [treeButtons(player)]
    );
  }

  const sparkle =
    player.sparkle;

  player.sparkles +=
    sparkle.reward;

  player.sparkle = null;

  player.sceneMessage =
    `✨ ${sparkle.name} caught! +${sparkle.reward} sparkles!`;

  await savePlayer(
    env,
    userId,
    player
  );

  const image =
    await renderTree(
      env,
      player
    );

  return editOriginal(
    interaction,
    image,
    "",
    [treeButtons(player)]
  );
}

/* =========================
   DAILY
========================= */

async function handleDaily(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  const now = Date.now();

  if (
    player.lastDaily &&
    now - player.lastDaily <
      DAILY_COOLDOWN
  ) {
    const remaining =
      DAILY_COOLDOWN -
      (now - player.lastDaily);

    const hours =
      Math.ceil(
        remaining / 3600000
      );

    player.sceneMessage =
      `🎁 You already collected your daily reward! Come back in about ${hours} hour${hours === 1 ? "" : "s"}.`;
  } else {
    player.lastDaily = now;

    player.sparkles += 25;

    player.sceneMessage =
      "🎁 Daily reward! +25 sparkles!";
  }

  await savePlayer(
    env,
    userId,
    player
  );

  const image =
    await renderTree(
      env,
      player
    );

  return editOriginal(
    interaction,
    image,
    "",
    [treeButtons(player)]
  );
}

/* =========================
   INVENTORY
========================= */

async function handleInventory(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  return sendText(
    interaction,

    `🎒 **${player.name}'s Inventory**\n\n` +

    `🌸 Backgrounds: ${player.inventory.backgrounds.join(", ")}\n` +

    `🌳 Tree Types: ${player.inventory.tree_types.join(", ")}\n` +

    `✨ Sparkles: ${player.sparkles}`
  );
}

/* =========================
   SHOP
========================= */

async function handleShop(
  interaction,
  env
) {
  return sendText(
    interaction,

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

/* =========================
   CUSTOMIZE
========================= */

async function handleCustomize(
  interaction,
  env
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );

  return sendText(
    interaction,

    `🎀 **Customize ${player.name}**\n\n` +

    `🌸 Background: **${player.equipped.background}**\n` +

    `🌳 Tree: **${player.equipped.tree_type}**\n\n` +

    `More customization options coming soon!`
  );
}

/* =========================
   LEADERBOARD
========================= */

async function handleLeaderboard(
  interaction,
  env
) {
  return sendText(
    interaction,

    `🏆 **My Tree Leaderboard**\n\n` +

    `Leaderboard tracking is coming soon! 🌸`
  );
}

/* =========================
   RENAME
========================= */

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
    return sendText(
      interaction,
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

  player.sceneMessage =
    `🌸 Your tree is now named ${player.name}!`;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    interaction,

    `🌸 Your tree is now named **${player.name}**!`
  );
}

/* =========================
   COMPONENTS
========================= */

async function handleComponent(
  interaction,
  env
) {
  const customId =
    interaction.data?.custom_id;

  switch (customId) {

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
      return sendText(
        interaction,
        "🌸 Unknown button."
      );
  }
}

/* =========================
   COMMAND REGISTRATION
========================= */

async function registerCommands(
  env
) {
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

  return fetch(
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
}

/* =========================
   DISCORD SIGNATURE
========================= */

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

    hexToBytes(
      signature
    ),

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

/* =========================
   MAIN WORKER
========================= */

export default {

  async fetch(
    request,
    env
  ) {
    const url =
      new URL(request.url);

    /* Health check */

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

    /* Register commands */

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {
      const result =
        await registerCommands(
          env
        );

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

    /* Discord interactions */

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

      /* Discord Ping */

      if (
        interaction.type === 1
      ) {
        return json({
          type: 1
        });
      }

      /*
        Slash commands
      */

      if (
        interaction.type === 2
      ) {

        /*
          IMPORTANT:
          Immediately acknowledge Discord.
        */

        const ack =
          await acknowledge(
            interaction
          );

        if (!ack.ok) {
          console.error(
            "Discord acknowledgement failed:",
            ack.status,
            await ack.text()
          );

          return new Response(
            "Failed to acknowledge Discord interaction",
            {
              status: 500
            }
          );
        }

        try {

          const command =
            interaction.data?.name;

          switch (command) {

            case "tree": {
              const userId =
                interaction.member?.user?.id ||
                interaction.user?.id;

              const player =
                await getPlayer(
                  env,
                  userId
                );

              if (
                player.sparkle &&
                Date.now() -
                  player.sparkle.spawnedAt >
                  SPARKLE_LIFETIME
              ) {
                player.sparkle = null;

                player.sceneMessage =
                  "💨 Your sparkle disappeared!";

                await savePlayer(
                  env,
                  userId,
                  player
                );
              }

              const image =
                await renderTree(
                  env,
                  player
                );

              return editOriginal(
                interaction,
                image,

                `🌸 **${player.name}** • Level **${player.level}**\n` +
                `💖 Sparkles: **${player.sparkles}**`,

                [treeButtons(player)]
              );
            }

            case "water":
              return handleWater(
                interaction,
                env
              );

            case "catch":
              return handleCatch(
                interaction,
                env
              );

            case "daily":
              return handleDaily(
                interaction,
                env
              );

            case "shop":
              return handleShop(
                interaction,
                env
              );

            case "customize":
              return handleCustomize(
                interaction,
                env
              );

            case "inventory":
              return handleInventory(
                interaction,
                env
              );

            case "leaderboard":
              return handleLeaderboard(
                interaction,
                env
              );

            case "rename":
              return handleRename(
                interaction,
                env
              );

            default:
              return sendText(
                interaction,
                "🌸 Unknown command."
              );
          }

        } catch (error) {

          console.error(
            "COMMAND ERROR:",
            error
          );

          return sendText(
            interaction,

            `❌ Something went wrong while growing your tree.\n\`${error.message || error}\``,

            true
          );
        }
      }

      /*
        Button interactions
      */

      if (
        interaction.type === 3
      ) {

        const ack =
          await acknowledge(
            interaction
          );

        if (!ack.ok) {
          console.error(
            "Button acknowledgement failed:",
            ack.status,
            await ack.text()
          );

          return new Response(
            "Failed to acknowledge button",
            {
              status: 500
            }
          );
        }

        try {

          return await handleComponent(
            interaction,
            env
          );

        } catch (error) {

          console.error(
            "BUTTON ERROR:",
            error
          );

          return sendText(
            interaction,

            `❌ Button error.\n\`${error.message || error}\``,

            true
          );
        }
      }

      return json({
        type: 1
      });
    }

    return new Response(
      "Not found",
      {
        status: 404
      }
    );
  }
};
