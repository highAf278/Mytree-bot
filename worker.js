import puppeteer from "@cloudflare/puppeteer";

/* =========================================================
   SETTINGS
========================================================= */

const EXP_PER_WATER = 10;

const SPARKLE_CHANCE = 0.50;
const SPARKLE_LIFETIME = 5 * 60 * 1000;

/*
  MULTIPLE SPARKLES
  A successful spawn creates 2–4 sparkles.
  Up to 5 can exist at once.
*/
const MIN_SPARKLES_PER_SPAWN = 2;
const MAX_SPARKLES_PER_SPAWN = 4;
const MAX_ACTIVE_SPARKLES = 5;

const WATER_COOLDOWN = 60 * 60 * 1000;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;


/* =========================================================
   BACKGROUNDS
========================================================= */

const HALLOWEEN_BACKGROUND = "IMG_7254.jpeg";
const NORMAL_BACKGROUND = "IMG_7251.jpeg";
const CANDYLAND_BACKGROUND = "IMG_7261.jpeg";

const HALLOWEEN_PRICE = 150;
const CANDYLAND_PRICE = 500;


/* =========================================================
   TREES
========================================================= */

const TREE_IMAGE = "IMG_7259.png";
const COTTON_CANDY_TREE = "IMG_7263.png";

const COTTON_CANDY_TREE_PRICE = 1000;


/* =========================================================
   R2
========================================================= */

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";


/* =========================================================
   TREE STAGES
========================================================= */

const TREE_STAGES = {
  1: {
    name: "Baby Seedling",
    image: TREE_IMAGE
  },

  5: {
    name: "Little Cherry Tree",
    image: TREE_IMAGE
  },

  10: {
    name: "Growing Cherry Tree",
    image: TREE_IMAGE
  },

  20: {
    name: "Blooming Cherry Tree",
    image: TREE_IMAGE
  },

  35: {
    name: "Magical Cherry Tree",
    image: TREE_IMAGE
  },

  50: {
    name: "Eternal Cherry Tree",
    image: TREE_IMAGE
  }
};


/* =========================================================
   LEVEL REWARDS
========================================================= */

const LEVEL_REWARDS = {
  5: "🌸 Unlocked: Cherry Blossom decoration!",
  10: "✨ Unlocked: Sparkle Garden!",
  20: "🐺 Unlocked: Werewives event bonus!",
  35: "💖 Unlocked: Magical tree customization!",
  50: "👑 Unlocked: Eternal Tree status!"
};


/* =========================================================
   WEREWIVES CHAOS EVENTS
========================================================= */

const WEREWIVES_EVENTS = [
  {
    text:
      "🐺💅 A werewife dramatically appears and demands attention from your tree!",
    sparkles: 5
  },

  {
    text:
      "💋🐺 A werewife has blessed your tree with chaotic wife energy!",
    sparkles: 10
  },

  {
    text:
      "🌙🐺 A werewife zooms past your tree and leaves sparkles everywhere!",
    sparkles: 15
  },

  {
    text:
      "💅🌸 A werewife inspected your tree and said it needs MORE DRAMA.",
    sparkles: 5
  },

  {
    text:
      "🐺✨ A werewife accidentally made your tree sparkle!",
    sparkles: 10
  }
];


/*
  20% chance for a Werewives chaos event.
  Chaos events give SPARKLES ONLY.
*/

function maybeChaosEvent(player) {
  if (!randomChance(0.20)) {
    return null;
  }

  const event =
    WEREWIVES_EVENTS[
      random(
        0,
        WEREWIVES_EVENTS.length - 1
      )
    ];

  player.sparkles +=
    event.sparkles;

  return event;
}


/* =========================================================
   PLAYER
========================================================= */

function createPlayer() {
  return {
    treeName: "My Cherry Tree",

    level: 1,
    exp: 0,

    sparkles: 0,

    lastWater: 0,
    lastDaily: 0,

    /*
      NEW:
      Multiple sparkles are stored here.
    */
    sparklesOnTree: [],

    sceneMessage:
      "🌱 Your little tree is waiting for some love!",

    claimedLevelRewards: [],

    inventory: [
      "pink_sky_background"
    ],

    equipped: {
      decoration: null,
      theme: "cherry",
      tree: "cherry"
    }
  };
}


/* =========================================================
   PLAYER REPAIR
========================================================= */

function repairPlayer(player) {
  const fresh = createPlayer();

  if (!player || typeof player !== "object") {
    return fresh;
  }

  const repaired = {
    ...fresh,
    ...player,

    treeName:
      typeof player.treeName === "string" &&
      player.treeName.trim()
        ? player.treeName
        : fresh.treeName,

    equipped: {
      ...fresh.equipped,
      ...(player.equipped || {})
    },

    claimedLevelRewards:
      Array.isArray(player.claimedLevelRewards)
        ? player.claimedLevelRewards
        : [],

    inventory:
      Array.isArray(player.inventory)
        ? [...player.inventory]
        : [],

    sparklesOnTree:
      Array.isArray(player.sparklesOnTree)
        ? [...player.sparklesOnTree]
        : []
  };


  /*
    BACKWARD COMPATIBILITY

    If an older player still has the old
    single "sparkle" property, convert it
    into the new multiple-sparkle system.
  */

  if (
    repaired.sparklesOnTree.length === 0 &&
    player.sparkle &&
    typeof player.sparkle === "object"
  ) {
    repaired.sparklesOnTree = [
      {
        ...player.sparkle,
        id:
          String(
            player.sparkle.createdAt ||
            Date.now()
          ) +
          "_" +
          Math.random()
            .toString(36)
            .slice(2, 8)
      }
    ];
  }


  /*
    Remove the old property so the new system
    is the only one being used.
  */

  delete repaired.sparkle;


  if (
    !repaired.inventory.includes(
      "pink_sky_background"
    )
  ) {
    repaired.inventory.unshift(
      "pink_sky_background"
    );
  }


  if (
    repaired.equipped.theme !== "halloween" &&
    repaired.equipped.theme !== "candyland" &&
    repaired.equipped.theme !== "cherry"
  ) {
    repaired.equipped.theme = "cherry";
  }


  if (
    repaired.equipped.tree !== "cotton_candy" &&
    repaired.equipped.tree !== "cherry"
  ) {
    repaired.equipped.tree = "cherry";
  }


  return repaired;
}


async function getPlayer(env, userId) {
  const raw =
    await env.TREE_DATA.get(userId);

  if (!raw) {
    return createPlayer();
  }

  try {
    return repairPlayer(
      JSON.parse(raw)
    );
  } catch {
    return createPlayer();
  }
}


async function savePlayer(env, userId, player) {
  await env.TREE_DATA.put(
    userId,
    JSON.stringify(player)
  );
}


/* =========================================================
   LEVELING
========================================================= */

function xpNeeded(level) {
  return level * 50;
}


function addExp(player, amount) {
  const messages = [];

  player.exp += amount;

  while (
    player.exp >=
    xpNeeded(player.level)
  ) {
    player.exp -=
      xpNeeded(player.level);

    player.level++;

    messages.push(
      `🎉🌸 **LEVEL UP!** Your tree reached **Level ${player.level}**!`
    );

    if (
      LEVEL_REWARDS[player.level] &&
      !player.claimedLevelRewards.includes(
        player.level
      )
    ) {
      player.claimedLevelRewards.push(
        player.level
      );

      messages.push(
        LEVEL_REWARDS[player.level]
      );
    }
  }

  return messages;
}


/* =========================================================
   TREE STAGE
========================================================= */

function getStage(level) {
  let stage = TREE_STAGES[1];

  for (
    const requiredLevel of
    Object.keys(TREE_STAGES)
  ) {
    if (
      level >= Number(requiredLevel)
    ) {
      stage =
        TREE_STAGES[requiredLevel];
    }
  }

  return stage;
}


function getTreeImage(player) {
  if (
    player.equipped?.tree ===
    "cotton_candy"
  ) {
    return COTTON_CANDY_TREE;
  }

  return getStage(player.level).image;
}


/* =========================================================
   RANDOM
========================================================= */

function random(min, max) {
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}


function randomChance(chance) {
  return Math.random() < chance;
}


/* =========================================================
   SPARKLE TYPES
========================================================= */

/*
  VALUES DOUBLED:
  
  💗 Pink = 10
  🌈 Rainbow = 20
  🌙 Moon = 30
  ⭐ Rare Star = 50
*/

function sparkleInfo() {
  const types = [
    {
      name: "Pink Sparkle",
      emoji: "💗",
      value: 10
    },

    {
      name: "Rainbow Sparkle",
      emoji: "🌈",
      value: 20
    },

    {
      name: "Moon Sparkle",
      emoji: "🌙",
      value: 30
    },

    {
      name: "Rare Star",
      emoji: "⭐",
      value: 50
    }
  ];

  return types[
    random(
      0,
      types.length - 1
    )
  ];
}


/* =========================================================
   SPARKLE CLEANUP
========================================================= */

function cleanExpiredSparkles(player) {
  if (
    !Array.isArray(
      player.sparklesOnTree
    )
  ) {
    player.sparklesOnTree = [];
    return;
  }

  const now =
    Date.now();

  player.sparklesOnTree =
    player.sparklesOnTree.filter(
      sparkle => {

        if (
          !sparkle ||
          typeof sparkle !== "object"
        ) {
          return false;
        }

        const createdAt =
          Number(
            sparkle.createdAt || 0
          );

        if (!createdAt) {
          return false;
        }

        return (
          now - createdAt <=
          SPARKLE_LIFETIME
        );
      }
    );
}


/* =========================================================
   CREATE SPARKLE
========================================================= */

function createSparkle() {
  const sparkle =
    sparkleInfo();

  return {
    ...sparkle,

    id:
      Date.now().toString() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 10),

    x: random(12, 88),
    y: random(15, 72),

    createdAt:
      Date.now()
  };
}


/* =========================================================
   MULTIPLE SPARKLE SPAWNING
========================================================= */

function maybeSpawnSparkles(player) {
  cleanExpiredSparkles(player);

  if (
    player.sparklesOnTree.length >=
    MAX_ACTIVE_SPARKLES
  ) {
    return;
  }

  if (
    !randomChance(
      SPARKLE_CHANCE
    )
  ) {
    return;
  }

  const availableSlots =
    MAX_ACTIVE_SPARKLES -
    player.sparklesOnTree.length;

  const amountToSpawn =
    Math.min(
      random(
        MIN_SPARKLES_PER_SPAWN,
        MAX_SPARKLES_PER_SPAWN
      ),
      availableSlots
    );

  for (
    let i = 0;
    i < amountToSpawn;
    i++
  ) {
    player.sparklesOnTree.push(
      createSparkle()
    );
  }
}


/* =========================================================
   BACKGROUND
========================================================= */

function getBackground(player) {
  if (
    player.equipped?.theme ===
    "halloween"
  ) {
    return HALLOWEEN_BACKGROUND;
  }

  if (
    player.equipped?.theme ===
    "candyland"
  ) {
    return CANDYLAND_BACKGROUND;
  }

  return NORMAL_BACKGROUND;
}


/* =========================================================
   TREE IMAGE RENDERING
========================================================= */

async function renderTree(env, player) {
  cleanExpiredSparkles(player);

  const browser =
    await puppeteer.launch(
      env.BROWSER
    );

  const page =
    await browser.newPage();

  const backgroundUrl =
    R2_BASE +
    getBackground(player);

  const treeUrl =
    R2_BASE +
    getTreeImage(player);


  /*
    RENDER ALL ACTIVE SPARKLES
  */

  let sparkleHTML = "";

  for (
    const sparkle of
    player.sparklesOnTree
  ) {

    sparkleHTML += `
      <div
        class="sparkle"
        style="
          left:${sparkle.x}%;
          top:${sparkle.y}%;
        "
      >
        ${sparkle.emoji}
      </div>
    `;
  }


  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

* {
  box-sizing: border-box;
}

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

  background-image:
    url("${backgroundUrl}");

  background-size: cover;
  background-position: center;
}

.tree {
  position: absolute;

  /*
    TREE POSITION

    Smaller:
    58% instead of 65%

    More left:
    52% instead of 55%

    More up:
    37% instead of 40%
  */

  left: 52%;
  top: 37%;

  transform:
    translate(-50%, -50%);

  width: 58%;
  height: 58%;

  object-fit: contain;
}

.sparkle {
  position: absolute;

  transform:
    translate(-50%, -50%);

  font-size: 58px;

  z-index: 20;

  animation:
    sparkleFloat 1.5s infinite alternate,
    sparklePulse 1s infinite;

  filter:
    drop-shadow(
      0 0 12px
      rgba(255,255,255,0.95)
    );
}

@keyframes sparkleFloat {

  from {
    transform:
      translate(-50%, -50%)
      translateY(0);
  }

  to {
    transform:
      translate(-50%, -50%)
      translateY(-12px);
  }

}

@keyframes sparklePulse {

  0%, 100% {
    opacity: 0.75;
  }

  50% {
    opacity: 1;
  }

}

</style>

</head>

<body>

<div class="scene">

  <img
    class="tree"
    src="${treeUrl}"
  />

  ${sparkleHTML}

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

  const screenshot =
    await page.screenshot({
      type: "png"
    });

  await browser.close();

  return screenshot;
}


/* =========================================================
   DISCORD MESSAGE
========================================================= */

function buildTreeText(player) {
  cleanExpiredSparkles(player);

  const needed =
    xpNeeded(player.level);

  const stage =
    getStage(player.level);

  const waterReady =
    !player.lastWater ||
    Date.now() -
      player.lastWater >=
      WATER_COOLDOWN;

  const theme =
    player.equipped?.theme ===
    "halloween"
      ? "🎃 Halloween"
      : player.equipped?.theme ===
        "candyland"
        ? "🍭 Candy Land"
        : "🌸 Pink Sky";

  const tree =
    player.equipped?.tree ===
    "cotton_candy"
      ? "🍭 Cotton Candy Tree"
      : stage.name;

  let text = "";

  text +=
    `🌸 **${player.treeName}** 🌸\n\n`;

  text +=
    `🌱 **Level:** ${player.level}\n`;

  text +=
    `📊 **XP:** ${player.exp} / ${needed}\n`;

  text +=
    `✨ **Sparkles:** ${player.sparkles}\n`;

  text +=
    `🌳 **Tree:** ${tree}\n`;

  text +=
    `🎀 **Theme:** ${theme}\n`;

  text +=
    `💧 **Water:** ${
      waterReady
        ? "Ready!"
        : "Cooling down"
    }\n`;


  if (
    player.sparklesOnTree.length
  ) {
    text +=
      `\n✨ **${player.sparklesOnTree.length} sparkle${
        player.sparklesOnTree.length === 1
          ? ""
          : "s"
      } appeared! Catch them!**\n`;
  }


  if (player.sceneMessage) {
    text +=
      `\n${player.sceneMessage}`;
  }

  return text;
}


/* =========================================================
   TREE BUTTONS
========================================================= */

function treeButtons(player) {
  cleanExpiredSparkles(player);

  const rows = [];


  /*
    CATCH BUTTONS

    Discord allows up to 5 buttons per row.
    We can have up to 5 active sparkles,
    so all sparkle buttons fit in one row.
  */

  if (
    player.sparklesOnTree.length
  ) {

    const catchButtons =
      player.sparklesOnTree
        .slice(
          0,
          MAX_ACTIVE_SPARKLES
        )
        .map(
          (sparkle, index) => {

            return {
              type: 2,
              style: 1,

              custom_id:
                `tree_catch_${sparkle.id}`,

              label:
                `Catch ${sparkle.emoji} +${sparkle.value}`,

              emoji: {
                name:
                  sparkle.emoji
              }
            };
          }
        );


    rows.push({
      type: 1,
      components:
        catchButtons
    });

  } else {

    /*
      No sparkles currently active,
      so the first button is Water Tree.
    */

    rows.push({
      type: 1,

      components: [

        {
          type: 2,
          style: 1,

          custom_id:
            "tree_water",

          label:
            "Water Tree",

          emoji: {
            name: "💧"
          }
        }

      ]
    });
  }


  /*
    MAIN NAVIGATION ROW
  */

  rows.push({
    type: 1,

    components: [

      {
        type: 2,
        style: 2,

        custom_id:
          "tree_daily",

        label:
          "Daily",

        emoji: {
          name: "🎁"
        }
      },

      {
        type: 2,
        style: 2,

        custom_id:
          "tree_inventory",

        label:
          "Inventory",

        emoji: {
          name: "🎒"
        }
      },

      {
        type: 2,
        style: 2,

        custom_id:
          "tree_shop",

        label:
          "Shop",

        emoji: {
          name: "🛍️"
        }
      },

      {
        type: 2,
        style: 2,

        custom_id:
          "tree_customize",

        label:
          "Customize",

        emoji: {
          name: "🎀"
        }
      }

    ]
  });


  /*
    When sparkles exist, Water Tree gets
    its own button so it isn't removed.
  */

  if (
    player.sparklesOnTree.length
  ) {

    rows.push({
      type: 1,

      components: [

        {
          type: 2,
          style: 1,

          custom_id:
            "tree_water",

          label:
            "Water Tree",

          emoji: {
            name: "💧"
          }
        }

      ]
    });
  }


  return rows;
}


/* =========================================================
   DISCORD API
========================================================= */

async function acknowledge(interaction) {
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


async function acknowledgeButton(
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
        type: 6
      })
    }
  );
}


/* =========================================================
   SEND TREE
========================================================= */

async function sendTree(
  interaction,
  player,
  screenshot
) {
  const form =
    new FormData();

  form.append(
    "payload_json",

    JSON.stringify({
      content:
        buildTreeText(player),

      attachments: [
        {
          id: "0",
          filename:
            "tree.png"
        }
      ],

      components:
        treeButtons(player)
    })
  );

  form.append(
    "files[0]",

    new File(
      [screenshot],
      "tree.png",
      {
        type:
          "image/png"
      }
    )
  );

  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,

    {
      method: "PATCH",

      body: form
    }
  );
}


async function sendText(
  interaction,
  content,
  components = []
) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,

    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        content,
        components
      })
    }
  );
}


/* =========================================================
   SHOP CATEGORY BUTTONS
========================================================= */

function shopCategoryButtons() {
  return [
    {
      type: 1,

      components: [

        {
          type: 2,
          style: 1,

          custom_id:
            "shop_category_backgrounds",

          label:
            "Backgrounds",

          emoji: {
            name: "🌸"
          }
        },

        {
          type: 2,
          style: 1,

          custom_id:
            "shop_category_trees",

          label:
            "Trees",

          emoji: {
            name: "🌳"
          }
        },

        {
          type: 2,
          style: 1,

          custom_id:
            "shop_category_decorations",

          label:
            "Decorations",

          emoji: {
            name: "🌷"
          }
        },

        {
          type: 2,
          style: 1,

          custom_id:
            "shop_category_effects",

          label:
            "Effects",

          emoji: {
            name: "✨"
          }
        },

        {
          type: 2,
          style: 1,

          custom_id:
            "shop_category_fertilizer",

          label:
            "Fertilizer",

          emoji: {
            name: "🌱"
          }
        }

      ]
    }
  ];
}


/* =========================================================
   SHOP ITEM BUTTONS
========================================================= */

function shopItemButtons(
  player,
  category
) {
  const buttons = [];


  if (
    category ===
    "backgrounds"
  ) {

    if (
      !player.inventory.includes(
        "halloween_background"
      )
    ) {
      buttons.push({
        type: 2,
        style: 1,

        custom_id:
          "shop_buy_halloween",

        label:
          `Halloween — ${HALLOWEEN_PRICE} ✨`,

        emoji: {
          name: "🎃"
        }
      });
    }


    if (
      !player.inventory.includes(
        "candyland_background"
      )
    ) {
      buttons.push({
        type: 2,
        style: 1,

        custom_id:
          "shop_buy_candyland",

        label:
          `Candy Land — ${CANDYLAND_PRICE} ✨`,

        emoji: {
          name: "🍭"
        }
      });
    }
  }


  if (
    category ===
    "trees"
  ) {

    if (
      !player.inventory.includes(
        "cotton_candy_tree"
      )
    ) {
      buttons.push({
        type: 2,
        style: 1,

        custom_id:
          "shop_buy_cotton_candy",

        label:
          `Cotton Candy — ${COTTON_CANDY_TREE_PRICE} ✨`,

        emoji: {
          name: "🍭"
        }
      });
    }
  }


  if (
    !buttons.length
  ) {
    return [];
  }


  return [
    {
      type: 1,

      components:
        buttons
    }
  ];
}


/* =========================================================
   SHOP BACK BUTTON
========================================================= */

function shopBackButton() {
  return [
    {
      type: 1,

      components: [

        {
          type: 2,
          style: 2,

          custom_id:
            "tree_shop",

          label:
            "Back to Shop",

          emoji: {
            name: "🛍️"
          }
        }

      ]
    }
  ];
}


/* =========================================================
   TREE
========================================================= */

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

  maybeSpawnSparkles(player);

  if (
    player.sparklesOnTree.length
  ) {
    player.sceneMessage =
      `✨ ${player.sparklesOnTree.length} sparkle${
        player.sparklesOnTree.length === 1
          ? ""
          : "s"
      } appeared! Catch them!`;
  } else {
    player.sceneMessage =
      "🌱 Give your tree some love!";
  }

  await savePlayer(
    env,
    userId,
    player
  );

  const screenshot =
    await renderTree(
      env,
      player
    );

  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   WATER
========================================================= */

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

  const now =
    Date.now();


  if (
    player.lastWater &&
    now -
      player.lastWater <
      WATER_COOLDOWN
  ) {

    const remaining =
      WATER_COOLDOWN -
      (now - player.lastWater);

    const minutes =
      Math.ceil(
        remaining /
          60000
      );

    player.sceneMessage =
      `💧 Your tree is already watered! Try again in about ${minutes} minute(s).`;

    await savePlayer(
      env,
      userId,
      player
    );

    const screenshot =
      await renderTree(
        env,
        player
      );

    return sendTree(
      interaction,
      player,
      screenshot
    );
  }


  player.lastWater =
    now;


  const messages =
    addExp(
      player,
      EXP_PER_WATER
    );


  maybeSpawnSparkles(player);


  const chaosEvent =
    maybeChaosEvent(player);


  const sceneMessages = [];


  if (messages.length) {
    sceneMessages.push(
      ...messages
    );
  }


  if (chaosEvent) {
    sceneMessages.push(
      `${chaosEvent.text} +${chaosEvent.sparkles} ✨`
    );
  }


  if (!sceneMessages.length) {
    sceneMessages.push(
      `💧🌸 Your tree loved that! +${EXP_PER_WATER} XP`
    );
  }


  if (
    player.sparklesOnTree.length
  ) {
    sceneMessages.push(
      `✨ ${player.sparklesOnTree.length} sparkle${
        player.sparklesOnTree.length === 1
          ? ""
          : "s"
      } are waiting to be caught!`
    );
  }


  player.sceneMessage =
    sceneMessages.join(
      " • "
    );


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   CATCH
========================================================= */

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

  cleanExpiredSparkles(player);

  const buttonId =
    interaction.data?.custom_id || "";


  /*
    Get the unique sparkle ID from:
    tree_catch_SPARKLE_ID
  */

  const sparkleId =
    buttonId.startsWith(
      "tree_catch_"
    )
      ? buttonId.slice(
          "tree_catch_".length
        )
      : null;


  if (
    !sparkleId
  ) {
    player.sceneMessage =
      "✨ That sparkle button isn't valid anymore.";

    await savePlayer(
      env,
      userId,
      player
    );

    const screenshot =
      await renderTree(
        env,
        player
      );

    return sendTree(
      interaction,
      player,
      screenshot
    );
  }


  const sparkleIndex =
    player.sparklesOnTree.findIndex(
      sparkle =>
        String(
          sparkle.id
        ) ===
        String(
          sparkleId
        )
    );


  /*
    If the sparkle was already caught,
    only that button becomes invalid.
    Other sparkles remain untouched.
  */

  if (
    sparkleIndex === -1
  ) {

    player.sceneMessage =
      "✨ That sparkle has already been caught or expired!";

    await savePlayer(
      env,
      userId,
      player
    );

    const screenshot =
      await renderTree(
        env,
        player
      );

    return sendTree(
      interaction,
      player,
      screenshot
    );
  }


  /*
    Remove ONLY the sparkle that was clicked.
  */

  const sparkle =
    player.sparklesOnTree[
      sparkleIndex
    ];

  const sparkleValue =
    Number(
      sparkle.value
    ) || 1;


  player.sparkles +=
    sparkleValue;


  player.sparklesOnTree.splice(
    sparkleIndex,
    1
  );


  const messages =
    addExp(
      player,
      sparkleValue
    );


  player.sceneMessage =
    `${sparkle.emoji || "✨"} You caught a ${sparkle.name || "sparkle"}! +${sparkleValue} ✨`;


  if (
    player.sparklesOnTree.length
  ) {
    player.sceneMessage +=
      ` • ✨ ${player.sparklesOnTree.length} sparkle${
        player.sparklesOnTree.length === 1
          ? ""
          : "s"
      } still waiting!`;
  }


  if (messages.length) {
    player.sceneMessage +=
      " • " +
      messages.join(
        " • "
      );
  }


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   DAILY
========================================================= */

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

  const now =
    Date.now();


  if (
    player.lastDaily &&
    now -
      player.lastDaily <
      DAILY_COOLDOWN
  ) {

    const remaining =
      DAILY_COOLDOWN -
      (now - player.lastDaily);

    const hours =
      Math.ceil(
        remaining /
          3600000
      );

    return sendText(
      interaction,
      `🎁 You already claimed your daily reward! Come back in about ${hours} hour(s).`
    );
  }


  player.lastDaily =
    now;


  const xp = 25;
  const sparkleReward = 3;


  player.sparkles +=
    sparkleReward;


  const messages =
    addExp(
      player,
      xp
    );


  player.sceneMessage =
    `🎁 Daily reward! +${xp} XP and +${sparkleReward} ✨`;


  await savePlayer(
    env,
    userId,
    player
  );


  let response =
    `🎁 **Daily Reward!**\n\n`;

  response +=
    `📊 +${xp} XP\n`;

  response +=
    `✨ +${sparkleReward} sparkles\n`;


  if (messages.length) {
    response +=
      `\n${messages.join("\n")}`;
  }


  return sendText(
    interaction,
    response
  );
}


/* =========================================================
   INVENTORY
========================================================= */

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


  let text =
    `🎒 **Your Inventory**\n\n`;


  text +=
    `🌸 **Backgrounds**\n`;

  text +=
    `• 🌸 Pink Sky Background`;


  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    text +=
      `\n• 🎃 Halloween Background`;
  }


  if (
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    text +=
      `\n• 🍭 Candy Land Background`;
  }


  text +=
    `\n\n🌳 **Trees**\n`;


  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    text +=
      `• 🍭 Cotton Candy Tree`;
  } else {
    text +=
      `• Your Cherry Tree`;
  }


  text +=
    `\n\n✨ **Effects**\n`;

  text +=
    `• None yet!`;


  text +=
    `\n\n🌷 **Decorations**\n`;

  text +=
    `• None yet!`;


  text +=
    `\n\n🌱 **Fertilizer**\n`;

  text +=
    `• None yet!`;


  const theme =
    player.equipped.theme ===
    "halloween"
      ? "🎃 Halloween"
      : player.equipped.theme ===
        "candyland"
        ? "🍭 Candy Land"
        : "🌸 Pink Sky";


  const tree =
    player.equipped.tree ===
    "cotton_candy"
      ? "🍭 Cotton Candy Tree"
      : "🌸 Cherry Tree";


  text +=
    `\n\n🎀 **Equipped Background:** ${theme}`;

  text +=
    `\n🌳 **Equipped Tree:** ${tree}`;


  return sendText(
    interaction,
    text
  );
}


/* =========================================================
   SHOP
========================================================= */

async function handleShop(
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


  const text =
    `🛍️ **TREE SHOP** 🛍️\n\n` +
    `✨ You have **${player.sparkles} sparkles**.\n\n` +
    `Choose a category below! 💗`;


  return sendText(
    interaction,
    text,
    shopCategoryButtons()
  );
}


/* =========================================================
   SHOP CATEGORY
========================================================= */

async function handleShopCategory(
  interaction,
  env,
  category
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  const player =
    await getPlayer(
      env,
      userId
    );


  let text = "";


  switch (category) {

    case "backgrounds":

      text =
        `🌸 **BACKGROUNDS** 🌸\n\n` +
        `✨ You have **${player.sparkles} sparkles**.\n\n` +

        `🌸 **Pink Sky**\n` +
        `💗 Free — already owned\n\n` +

        `🎃 **Halloween Background**\n` +
        `🖤 Spooky orange & black night\n` +
        `✨ ${HALLOWEEN_PRICE} sparkles\n` +
        `${
          player.inventory.includes(
            "halloween_background"
          )
            ? "✅ OWNED"
            : "🛍️ Available to purchase"
        }\n\n` +

        `🍭 **Candy Land Background**\n` +
        `🍬 A sugary candy-filled world!\n` +
        `✨ ${CANDYLAND_PRICE} sparkles\n` +
        `${
          player.inventory.includes(
            "candyland_background"
          )
            ? "✅ OWNED"
            : "🛍️ Available to purchase"
        }`;

      break;


    case "trees":

      text =
        `🌳 **TREES** 🌳\n\n` +
        `✨ You have **${player.sparkles} sparkles**.\n\n` +

        `🌸 **Cherry Tree**\n` +
        `💗 Free — already owned\n\n` +

        `🍭🌳 **Cotton Candy Tree**\n` +
        `🍬 A magical cotton-candy tree!\n` +
        `✨ ${COTTON_CANDY_TREE_PRICE} sparkles\n` +
        `${
          player.inventory.includes(
            "cotton_candy_tree"
          )
            ? "✅ OWNED"
            : "🛍️ Available to purchase"
        }`;

      break;


    case "decorations":

      text =
        `🌷 **DECORATIONS** 🌷\n\n` +
        `✨ You have **${player.sparkles} sparkles**.\n\n` +
        `Nothing here yet! 🌸\n\n` +
        `More cute tree decorations are coming soon! 💗`;

      break;


    case "effects":

      text =
        `✨ **EFFECTS** ✨\n\n` +
        `✨ You have **${player.sparkles} sparkles**.\n\n` +
        `Nothing here yet! ✨\n\n` +
        `Magical effects are coming soon! 💫`;

      break;


    case "fertilizer":

      text =
        `🌱 **FERTILIZER** 🌱\n\n` +
        `✨ You have **${player.sparkles} sparkles**.\n\n` +
        `Nothing here yet! 🌱\n\n` +
        `Fertilizer items are coming soon! 🌸`;

      break;


    default:

      return handleShop(
        interaction,
        env
      );
  }


  return sendText(
    interaction,
    text,
    [
      ...shopItemButtons(
        player,
        category
      ),

      ...shopBackButton()
    ]
  );
}


/* =========================================================
   BUY HALLOWEEN
========================================================= */

async function handleBuyHalloween(
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
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    return sendText(
      interaction,
      `🎃 You already own the **Halloween Background**!`
    );
  }


  if (
    player.sparkles <
    HALLOWEEN_PRICE
  ) {
    return sendText(
      interaction,
      `😭 You need **${HALLOWEEN_PRICE} sparkles**, but you only have **${player.sparkles}**.`
    );
  }


  player.sparkles -=
    HALLOWEEN_PRICE;


  player.inventory.push(
    "halloween_background"
  );


  player.sceneMessage =
    `🎃 You bought the Halloween Background! Go to Customize to equip it.`;


  await savePlayer(
    env,
    userId,
    player
  );


  return sendText(
    interaction,

    `🎃 **Purchase Complete!**\n\n` +

    `You bought the **Halloween Background** for **${HALLOWEEN_PRICE} ✨**.\n\n` +

    `🌸 Your Pink Sky Background is still safely in your inventory!\n\n` +

    `🎀 Press **Customize** on your tree to equip it!`
  );
}


/* =========================================================
   BUY CANDY LAND
========================================================= */

async function handleBuyCandyland(
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
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    return sendText(
      interaction,
      `🍭 You already own the **Candy Land Background**!`
    );
  }


  if (
    player.sparkles <
    CANDYLAND_PRICE
  ) {
    return sendText(
      interaction,
      `😭 You need **${CANDYLAND_PRICE} sparkles**, but you only have **${player.sparkles}**.`
    );
  }


  player.sparkles -=
    CANDYLAND_PRICE;


  player.inventory.push(
    "candyland_background"
  );


  player.sceneMessage =
    `🍭 You bought the Candy Land Background! Go to Customize to equip it.`;


  await savePlayer(
    env,
    userId,
    player
  );


  return sendText(
    interaction,

    `🍭 **Purchase Complete!**\n\n` +

    `You bought the **Candy Land Background** for **${CANDYLAND_PRICE} ✨**.\n\n` +

    `🌸 Your Pink Sky Background is still safely in your inventory!\n\n` +

    `🎀 Press **Customize** on your tree to equip it!`
  );
}


/* =========================================================
   BUY COTTON CANDY TREE
========================================================= */

async function handleBuyCottonCandyTree(
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
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    return sendText(
      interaction,
      `🍭🌳 You already own the **Cotton Candy Tree**!`
    );
  }


  if (
    player.sparkles <
    COTTON_CANDY_TREE_PRICE
  ) {
    return sendText(
      interaction,
      `😭 You need **${COTTON_CANDY_TREE_PRICE} sparkles**, but you only have **${player.sparkles}**.`
    );
  }


  player.sparkles -=
    COTTON_CANDY_TREE_PRICE;


  player.inventory.push(
    "cotton_candy_tree"
  );


  player.sceneMessage =
    `🍭🌳 You bought the Cotton Candy Tree! Go to Customize to equip it.`;


  await savePlayer(
    env,
    userId,
    player
  );


  return sendText(
    interaction,

    `🍭🌳 **Purchase Complete!**\n\n` +

    `You bought the **Cotton Candy Tree** for **${COTTON_CANDY_TREE_PRICE} ✨**.\n\n` +

    `🌸 Your original Cherry Tree is still safely available!\n\n` +

    `🎀 Press **Customize** to equip your new tree!`
  );
}


/* =========================================================
   CUSTOMIZE BUTTONS
========================================================= */

function customizeButtons(player) {
  const buttons = [];


  buttons.push({
    type: 2,

    style:
      player.equipped.theme ===
      "cherry"
        ? 3
        : 1,

    custom_id:
      "theme_cherry",

    label:
      "Pink Sky",

    emoji: {
      name: "🌸"
    }
  });


  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    buttons.push({
      type: 2,

      style:
        player.equipped.theme ===
        "halloween"
          ? 3
          : 1,

      custom_id:
        "theme_halloween",

      label:
        "Halloween",

      emoji: {
        name: "🎃"
      }
    });
  }


  if (
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    buttons.push({
      type: 2,

      style:
        player.equipped.theme ===
        "candyland"
          ? 3
          : 1,

      custom_id:
        "theme_candyland",

      label:
        "Candy Land",

      emoji: {
        name: "🍭"
      }
    });
  }


  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    buttons.push({
      type: 2,

      style:
        player.equipped.tree ===
        "cotton_candy"
          ? 3
          : 1,

      custom_id:
        "tree_cotton_candy",

      label:
        "Cotton Candy Tree",

      emoji: {
        name: "🍭"
      }
    });
  }


  return [
    {
      type: 1,

      components:
        buttons
    }
  ];
}


/* =========================================================
   CUSTOMIZE
========================================================= */

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


  const currentTheme =
    player.equipped.theme ===
    "halloween"
      ? "🎃 Halloween"
      : player.equipped.theme ===
        "candyland"
        ? "🍭 Candy Land"
        : "🌸 Pink Sky";


  const currentTree =
    player.equipped.tree ===
    "cotton_candy"
      ? "🍭 Cotton Candy Tree"
      : "🌸 Cherry Tree";


  let text =
    `🎀 **Tree Customization**\n\n`;


  text +=
    `🎀 **Background:** ${currentTheme}\n`;

  text +=
    `🌳 **Tree:** ${currentTree}\n\n`;

  text +=
    `Choose what you want to equip below!`;


  if (
    !player.inventory.includes(
      "halloween_background"
    )
  ) {
    text +=
      `\n\n🔒 🎃 Halloween is locked — buy it in 🛍️ Shop!`;
  }


  if (
    !player.inventory.includes(
      "candyland_background"
    )
  ) {
    text +=
      `\n🔒 🍭 Candy Land is locked — buy it in 🛍️ Shop!`;
  }


  if (
    !player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    text +=
      `\n🔒 🍭🌳 Cotton Candy Tree is locked — buy it in 🛍️ Shop!`;
  }


  return sendText(
    interaction,
    text,
    customizeButtons(player)
  );
}


/* =========================================================
   EQUIP HALLOWEEN
========================================================= */

async function handleThemeHalloween(
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
    !player.inventory.includes(
      "halloween_background"
    )
  ) {
    return sendText(
      interaction,
      `🔒 You don't own the Halloween Background yet! Buy it in 🛍️ Shop.`
    );
  }


  player.equipped.theme =
    "halloween";

  player.sceneMessage =
    `🎃🖤 Halloween mode activated!`;


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   EQUIP CANDY LAND
========================================================= */

async function handleThemeCandyland(
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
    !player.inventory.includes(
      "candyland_background"
    )
  ) {
    return sendText(
      interaction,
      `🔒 You don't own the **Candy Land Background** yet! Buy it in 🛍️ Shop.`
    );
  }


  player.equipped.theme =
    "candyland";

  player.sceneMessage =
    `🍭🌈 Candy Land mode activated!`;


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   EQUIP PINK SKY
========================================================= */

async function handleThemeCherry(
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
    !player.inventory.includes(
      "pink_sky_background"
    )
  ) {
    player.inventory.push(
      "pink_sky_background"
    );
  }


  player.equipped.theme =
    "cherry";

  player.sceneMessage =
    `🌸💗 Pink Sky mode activated!`;


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   EQUIP COTTON CANDY TREE
========================================================= */

async function handleCottonCandyTree(
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
    !player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    return sendText(
      interaction,
      `🔒 You don't own the **Cotton Candy Tree** yet! Buy it in 🛍️ Shop.`
    );
  }


  player.equipped.tree =
    "cotton_candy";

  player.sceneMessage =
    `🍭🌳 Your Cotton Candy Tree is now equipped!`;


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   RENAME MODAL
========================================================= */

async function showRenameModal(
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

        type: 9,

        data: {

          custom_id:
            "rename_tree_modal",

          title:
            "🌸 Rename Your Tree",

          components: [

            {
              type: 1,

              components: [

                {
                  type: 4,

                  custom_id:
                    "tree_name",

                  label:
                    "Tree Name",

                  style: 1,

                  min_length: 1,

                  max_length: 40,

                  required: true,

                  placeholder:
                    "Give your tree a cute name 💗"
                }

              ]

            }

          ]

        }

      })
    }
  );
}


function getModalValue(
  interaction
) {
  try {
    return interaction
      .data
      .components[0]
      .components[0]
      .value;
  } catch {
    return "";
  }
}


async function handleRenameModal(
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


  let newName =
    getModalValue(
      interaction
    ).trim();


  if (!newName) {
    return sendText(
      interaction,
      "🌸 Please enter a name for your tree."
    );
  }


  newName =
    newName.slice(
      0,
      40
    );


  player.treeName =
    newName;


  player.sceneMessage =
    `💗 Your tree is now named **${newName}**!`;


  await savePlayer(
    env,
    userId,
    player
  );


  const screenshot =
    await renderTree(
      env,
      player
    );


  return sendTree(
    interaction,
    player,
    screenshot
  );
}


/* =========================================================
   LEADERBOARD
========================================================= */

async function handleLeaderboard(
  interaction,
  env
) {
  return sendText(
    interaction,
    "🏆 **Tree Leaderboard**\n\nLeaderboard tracking is coming soon! 🌸"
  );
}


/* =========================================================
   GIVE SPARKLES
========================================================= */

async function handleGiveSparkles(
  interaction,
  env
) {
  const senderId =
    interaction.member?.user?.id ||
    interaction.user?.id;


  if (
    !env.OWNER_ID ||
    senderId !== env.OWNER_ID
  ) {
    return sendText(
      interaction,
      `🚫 You don't have permission to use **/give-sparkles**.`
    );
  }


  const target =
    interaction.data?.options?.find(
      option =>
        option.name === "user"
    )?.value;


  const amount =
    interaction.data?.options?.find(
      option =>
        option.name === "amount"
    )?.value;


  const sparkleAmount =
    Number(amount);


  if (
    !target ||
    !Number.isInteger(
      sparkleAmount
    ) ||
    sparkleAmount <= 0
  ) {
    return sendText(
      interaction,
      `❌ Please provide a valid user and a positive sparkle amount.`
    );
  }


  if (
    sparkleAmount > 10000
  ) {
    return sendText(
      interaction,
      `❌ You can give at most **10,000 sparkles** at once.`
    );
  }


  const player =
    await getPlayer(
      env,
      target
    );


  player.sparkles +=
    sparkleAmount;


  player.sceneMessage =
    `✨ You received **${sparkleAmount} sparkles** from the Tree Keeper!`;


  await savePlayer(
    env,
    target,
    player
  );


  return sendText(
    interaction,

    `✨ **Sparkles Given!**\n\n` +
    `You gave <@${target}> **${sparkleAmount} ✨**.`
  );
}


/* =========================================================
   COMPONENT ROUTER
========================================================= */

async function handleComponent(
  interaction,
  env
) {
  const id =
    interaction.data.custom_id;


  if (
    id.startsWith(
      "tree_catch_"
    )
  ) {
    return handleCatch(
      interaction,
      env
    );
  }


  switch (id) {

    case "tree_water":

      return handleWater(
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


    case "tree_customize":

      return handleCustomize(
        interaction,
        env
      );


    case "shop_category_backgrounds":

      return handleShopCategory(
        interaction,
        env,
        "backgrounds"
      );


    case "shop_category_trees":

      return handleShopCategory(
        interaction,
        env,
        "trees"
      );


    case "shop_category_decorations":

      return handleShopCategory(
        interaction,
        env,
        "decorations"
      );


    case "shop_category_effects":

      return handleShopCategory(
        interaction,
        env,
        "effects"
      );


    case "shop_category_fertilizer":

      return handleShopCategory(
        interaction,
        env,
        "fertilizer"
      );


    case "shop_buy_halloween":

      return handleBuyHalloween(
        interaction,
        env
      );


    case "shop_buy_candyland":

      return handleBuyCandyland(
        interaction,
        env
      );


    case "shop_buy_cotton_candy":

      return handleBuyCottonCandyTree(
        interaction,
        env
      );


    case "theme_halloween":

      return handleThemeHalloween(
        interaction,
        env
      );


    case "theme_candyland":

      return handleThemeCandyland(
        interaction,
        env
      );


    case "theme_cherry":

      return handleThemeCherry(
        interaction,
        env
      );


    case "tree_cotton_candy":

      return handleCottonCandyTree(
        interaction,
        env
      );


    default:

      return sendText(
        interaction,
        "🌸 That button isn't connected yet!"
      );
  }
}


/* =========================================================
   SLASH COMMAND ROUTER
========================================================= */

async function handleCommand(
  interaction,
  env
) {
  const command =
    interaction.data.name;


  switch (command) {

    case "tree":

      return handleTree(
        interaction,
        env
      );


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

      return showRenameModal(
        interaction
      );


    case "give-sparkles":

      return handleGiveSparkles(
        interaction,
        env
      );


    default:

      return sendText(
        interaction,
        "🌸 Unknown command."
      );
  }
}


/* =========================================================
   COMMAND REGISTRATION
========================================================= */

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
        "Catch a sparkle"
    },

    {
      name: "daily",
      description:
        "Claim your daily reward"
    },

    {
      name: "shop",
      description:
        "Open the tree shop"
    },

    {
      name: "customize",
      description:
        "Customize your tree"
    },

    {
      name: "inventory",
      description:
        "View your tree inventory"
    },

    {
      name: "leaderboard",
      description:
        "View the tree leaderboard"
    },

    {
      name: "rename",
      description:
        "Rename your tree"
    },

    {
      name:
        "give-sparkles",

      description:
        "Give sparkles to another user",

      options: [

        {
          name:
            "user",

          description:
            "The user receiving the sparkles",

          type: 6,

          required: true
        },

        {
          name:
            "amount",

          description:
            "Amount of sparkles to give",

          type: 4,

          required: true,

          min_value: 1,

          max_value: 10000
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
          "Authorization":
            `Bot ${env.BOT_TOKEN}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            commands
          )
      }
    );


  return response;
}


/* =========================================================
   DISCORD SIGNATURE VERIFICATION
========================================================= */

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
    await request
      .clone()
      .text();


  try {

    const publicKey =
      await crypto.subtle.importKey(
        "raw",

        hexToBytes(
          env.PUBLIC_KEY
        ),

        {
          name:
            "Ed25519",

          namedCurve:
            "Ed25519"
        },

        false,

        [
          "verify"
        ]
      );


    return crypto.subtle.verify(
      "Ed25519",

      publicKey,

      hexToBytes(
        signature
      ),

      new TextEncoder().encode(
        timestamp +
          body
      )
    );

  } catch {
    return false;
  }
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
        hex.substr(
          i * 2,
          2
        ),
        16
      );
  }


  return bytes;
}


/* =========================================================
   WORKER
========================================================= */

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(
        request.url
      );


    /* -------------------------
       HEALTH CHECK
    ------------------------- */

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return new Response(
        "🌸 My Tree Bot is alive!",
        {
          status: 200
        }
      );
    }


    /* -------------------------
       REGISTER COMMANDS
    ------------------------- */

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {

      const result =
        await registerCommands(
          env
        );


      if (result.ok) {

        return new Response(
          "🎀 Commands registered successfully!",
          {
            status: 200
          }
        );
      }


      const error =
        await result.text();


      return new Response(
        `Command registration failed:\n${error}`,

        {
          status: 500
        }
      );
    }


    /* -------------------------
       INTERACTIONS
    ------------------------- */

    if (
      request.method !== "POST" ||
      url.pathname !==
        "/interactions"
    ) {

      return new Response(
        "Not Found",
        {
          status: 404
        }
      );
    }


    /* -------------------------
       VERIFY
    ------------------------- */

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


    /* -------------------------
       DISCORD PING
    ------------------------- */

    if (
      interaction.type === 1
    ) {

      return Response.json({
        type: 1
      });
    }


    /* -------------------------
       SLASH COMMAND
    ------------------------- */

    if (
      interaction.type === 2
    ) {

      if (
        interaction.data?.name ===
        "rename"
      ) {

        return showRenameModal(
          interaction
        );
      }


      await acknowledge(
        interaction
      );


      await handleCommand(
        interaction,
        env
      );


      return new Response(
        null,
        {
          status: 204
        }
      );
    }


    /* -------------------------
       BUTTON
    ------------------------- */

    if (
      interaction.type === 3
    ) {

      await acknowledgeButton(
        interaction
      );


      await handleComponent(
        interaction,
        env
      );


      return new Response(
        null,
        {
          status: 204
        }
      );
    }


    /* -------------------------
       MODAL SUBMIT
    ------------------------- */

    if (
      interaction.type === 5
    ) {

      await acknowledge(
        interaction
      );


      if (
        interaction.data?.custom_id ===
        "rename_tree_modal"
      ) {

        await handleRenameModal(
          interaction,
          env
        );
      }


      return new Response(
        null,
        {
          status: 204
        }
      );
    }


    return new Response(
      "Unknown interaction",
      {
        status: 400
      }
    );
  }
};
