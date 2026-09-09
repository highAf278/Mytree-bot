import puppeteer from "@cloudflare/puppeteer";

/* =========================================================
   SETTINGS
========================================================= */

const EXP_PER_WATER = 10;

const SPARKLE_CHANCE = 0.50;
const SPARKLE_LIFETIME = 5 * 60 * 1000;

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
const COTTON_CANDY_PRICE = 1000;

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

/* =========================================================
   TREE POSITION
========================================================= */

/*
  Move the tree vertically here.

  Higher number = farther DOWN.

  Current:
  55%

  Previously:
  37%
*/

const TREE_TOP_POSITION = 55;

/* =========================================================
   TREE STAGES
========================================================= */

const TREE_STAGES = [
  { level: 1, image: TREE_IMAGE },
  { level: 5, image: TREE_IMAGE },
  { level: 10, image: TREE_IMAGE },
  { level: 20, image: TREE_IMAGE },
  { level: 35, image: TREE_IMAGE },
  { level: 50, image: TREE_IMAGE }
];

/* =========================================================
   LEVEL REWARDS
========================================================= */

const LEVEL_REWARDS = {
  5: 25,
  10: 50,
  20: 100,
  35: 150,
  50: 250
};

/* =========================================================
   WEREWIVES CHAOS EVENTS
========================================================= */

/*
  EVERY CHAOS EVENT ONLY GIVES OR TAKES SPARKLES.

  type:
    "everyone" = everyone gets affected
    "random"   = one random player gets affected

  amount:
    positive = gives sparkles
    negative = takes sparkles
*/

const WEREWIVES_EVENTS = [

  /* =======================================================
     🧀 CHEESE EVENTS
  ======================================================= */

  {
    type: "random",
    amount: 100,
    message:
      "🧀 **THE CHEESE KNOWS EVERYTHING.**\n\n" +
      "The cheese has selected its champion.\n" +
      "*The cheese will not explain itself.*"
  },

  {
    type: "everyone",
    amount: 15,
    message:
      "🚨🧀 **CHEESE EMERGENCY!**\n\n" +
      "The cheese has escaped!\n" +
      "Nobody actually helped."
  },

  {
    type: "random",
    amount: -25,
    message:
      "🧀 **THE CHEESE TAX IS DUE.**\n\n" +
      "The cheese demands tribute."
  },

  {
    type: "everyone",
    amount: 5,
    message:
      "🔮🧀 **THE CHEESE HAS SPOKEN.**\n\n" +
      "Nobody understands the prophecy."
  },

  {
    type: "random",
    amount: -15,
    message:
      "🧀 **FORBIDDEN CHEESE.**\n\n" +
      "Someone looked behind the couch.\n" +
      "They found the cheese."
  },

  {
    type: "everyone",
    amount: -10,
    message:
      "🧀 **THE CHEESE IS ANGRY.**\n\n" +
      "Nobody knows what happened.\n" +
      "The cheese refuses to elaborate."
  },

  /* =======================================================
     🦝 RACCOON EVENTS
  ======================================================= */

  {
    type: "random",
    amount: 75,
    message:
      "🦝 **THE RACCOON COUNCIL HAS CHOSEN.**\n\n" +
      "One Werewife has been blessed by the raccoons."
  },

  {
    type: "random",
    amount: -30,
    message:
      "🦝 **RACCOON ROBBERY!**\n\n" +
      "A raccoon has stolen someone's sparkles.\n" +
      "Nobody saw anything."
  },

  {
    type: "everyone",
    amount: 10,
    message:
      "🦝 **RACCOON PARADE!**\n\n" +
      "The raccoons are celebrating.\n" +
      "You have been invited."
  },

  {
    type: "everyone",
    amount: -10,
    message:
      "🦝 **THE RACCOONS HAVE DISCOVERED THE SPARKLE VAULT.**\n\n" +
      "This is not good."
  },

  {
    type: "random",
    amount: 50,
    message:
      "🦝 **MYSTERIOUS RACCOON DONATION.**\n\n" +
      "A raccoon dropped a suspicious bag of sparkles."
  },

  /* =======================================================
     🐺 WEREWOLF EVENTS
  ======================================================= */

  {
    type: "everyone",
    amount: 20,
    message:
      "🐺 **WEREWOLF PACK MEETING!**\n\n" +
      "The meeting accomplished absolutely nothing."
  },

  {
    type: "random",
    amount: 80,
    message:
      "🐺 **THE ALPHA HAS CHOSEN A FAVORITE.**\n\n" +
      "One Werewife has received the pack's blessing."
  },

  {
    type: "random",
    amount: -40,
    message:
      "🐺 **WEREWOLF TAX!**\n\n" +
      "The pack requires payment."
  },

  {
    type: "everyone",
    amount: -15,
    message:
      "🌕 **FULL MOON CHAOS!**\n\n" +
      "Nobody is behaving normally tonight."
  },

  {
    type: "random",
    amount: 60,
    message:
      "🐺 **LONE WOLF LUCK!**\n\n" +
      "One lucky Werewife has been spotted by the pack."
  },

  /* =======================================================
     💅 WEREWIVES EVENTS
  ======================================================= */

  {
    type: "random",
    amount: 50,
    message:
      "💅 **WIFE PRIVILEGE ACTIVATED.**\n\n" +
      "Someone has been chosen."
  },

  {
    type: "everyone",
    amount: 10,
    message:
      "💅 **WEREWIVES CHAOS HOUR!**\n\n" +
      "The server has officially lost control."
  },

  {
    type: "random",
    amount: -20,
    message:
      "🚨 **GIRL, WHAT HAPPENED?!**\n\n" +
      "Nobody knows.\n" +
      "Someone is paying for it."
  },

  {
    type: "everyone",
    amount: 15,
    message:
      "✨ **THE TREE HAS BEEN BLESSED.**\n\n" +
      "The Werewives have decided everyone deserves sparkles."
  },

  {
    type: "everyone",
    amount: -5,
    message:
      "🧍 **THE SILENCE.**\n\n" +
      "Something happened.\n" +
      "Nobody is talking about it."
  },

  {
    type: "random",
    amount: 100,
    message:
      "👑 **WEREWIFE ROYALTY!**\n\n" +
      "One random member has been crowned."
  },

  /* =======================================================
     🎃 HALLOWEEN CHAOS
  ======================================================= */

  {
    type: "everyone",
    amount: 13,
    message:
      "🎃 **JACK-O'-CHAOS!**\n\n" +
      "The pumpkins have escaped."
  },

  {
    type: "everyone",
    amount: -13,
    message:
      "🎃 **PUMPKIN HEIST!**\n\n" +
      "The pumpkins have stolen the sparkles."
  },

  {
    type: "random",
    amount: 75,
    message:
      "🧙 **WITCH'S BLESSING!**\n\n" +
      "A mysterious witch has chosen a favorite."
  },

  {
    type: "everyone",
    amount: 20,
    message:
      "👻 **GHOSTLY DONATION!**\n\n" +
      "A ghost has decided to be unusually generous."
  },

  {
    type: "random",
    amount: -15,
    message:
      "🕷️ **SPIDER INCIDENT!**\n\n" +
      "There is a spider.\n" +
      "Nobody is handling this well."
  }
];

/* =========================================================
   SPARKLE TYPES
========================================================= */

const SPARKLE_TYPES = [
  {
    name: "Pink Sparkle",
    emoji: "💖",
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
    emoji: "🌟",
    value: 50
  }
];

/* =========================================================
   DEFAULT PLAYER
========================================================= */

function defaultPlayer() {
  return {
    treeName: "Cherry Blossom",

    level: 1,

    exp: 0,

    sparkles: 0,

    lastWater: 0,

    lastDaily: 0,

    sparklesOnTree: [],

    sceneMessage: "",

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
  const fresh = defaultPlayer();

  if (
    !player ||
    typeof player !== "object"
  ) {
    return fresh;
  }

  const repaired = {
    ...fresh,
    ...player
  };

  if (
    repaired.sparkles == null &&
    repaired.sparkle != null
  ) {
    repaired.sparkles =
      Number(repaired.sparkle) || 0;
  }

  repaired.level = Math.max(
    1,
    Number(repaired.level) || 1
  );

  repaired.exp = Math.max(
    0,
    Number(repaired.exp) || 0
  );

  repaired.sparkles = Math.max(
    0,
    Number(repaired.sparkles) || 0
  );

  repaired.lastWater =
    Number(repaired.lastWater) || 0;

  repaired.lastDaily =
    Number(repaired.lastDaily) || 0;

  if (
    !Array.isArray(
      repaired.sparklesOnTree
    )
  ) {
    repaired.sparklesOnTree = [];
  }

  if (
    !Array.isArray(
      repaired.inventory
    )
  ) {
    repaired.inventory = [];
  }

  if (
    !repaired.inventory.includes(
      "pink_sky_background"
    )
  ) {
    repaired.inventory.push(
      "pink_sky_background"
    );
  }

  if (
    !Array.isArray(
      repaired.claimedLevelRewards
    )
  ) {
    repaired.claimedLevelRewards = [];
  }

  if (
    !repaired.equipped ||
    typeof repaired.equipped !== "object"
  ) {
    repaired.equipped = {
      decoration: null,
      theme: "cherry",
      tree: "cherry"
    };
  }

  if (
    repaired.equipped.theme !== "cherry" &&
    repaired.equipped.theme !== "halloween" &&
    repaired.equipped.theme !== "candyland"
  ) {
    repaired.equipped.theme = "cherry";
  }

  if (
    repaired.equipped.tree !== "cherry" &&
    repaired.equipped.tree !== "cotton_candy"
  ) {
    repaired.equipped.tree = "cherry";
  }

  return repaired;
}

/* =========================================================
   DATABASE HELPERS
========================================================= */

async function getPlayer(
  env,
  userId
) {
  const raw =
    await env.TREE_DATA.get(userId);

  if (!raw) {
    return defaultPlayer();
  }

  try {
    return repairPlayer(
      JSON.parse(raw)
    );
  } catch {
    return defaultPlayer();
  }
}

async function savePlayer(
  env,
  userId,
  player
) {
  await env.TREE_DATA.put(
    userId,
    JSON.stringify(
      repairPlayer(player)
    )
  );
}

/* =========================================================
   XP
========================================================= */

function xpNeeded(level) {
  return level * 50;
}

function addExp(
  player,
  amount
) {
  const rewardMessages = [];

  player.exp += amount;

  while (
    player.exp >=
    xpNeeded(player.level)
  ) {
    player.exp -=
      xpNeeded(player.level);

    player.level++;

    if (
      LEVEL_REWARDS[
        player.level
      ]
    ) {
      const reward =
        LEVEL_REWARDS[
          player.level
        ];

      if (
        !player.claimedLevelRewards.includes(
          player.level
        )
      ) {
        player.sparkles +=
          reward;

        player.claimedLevelRewards.push(
          player.level
        );

        rewardMessages.push(
          `🎉 Level ${player.level}! You received 💖 ${reward} sparkles!`
        );
      }
    }
  }

  return rewardMessages;
}

/* =========================================================
   RANDOM HELPERS
========================================================= */

function randomInt(
  min,
  max
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

function randomItem(array) {
  return array[
    Math.floor(
      Math.random() *
        array.length
    )
  ];
}

/* =========================================================
   SPARKLES
========================================================= */

function cleanExpiredSparkles(
  player
) {
  const now = Date.now();

  player.sparklesOnTree =
    player.sparklesOnTree.filter(
      sparkle =>
        now -
          sparkle.createdAt <
        SPARKLE_LIFETIME
    );
}

function createSparkle() {
  const type =
    randomItem(
      SPARKLE_TYPES
    );

  return {
    id:
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .slice(2),

    x: randomInt(12, 88),

    y: randomInt(15, 72),

    emoji: type.emoji,

    name: type.name,

    value: type.value,

    createdAt: Date.now()
  };
}

function maybeSpawnSparkles(
  player
) {
  cleanExpiredSparkles(
    player
  );

  if (
    Math.random() >
    SPARKLE_CHANCE
  ) {
    return;
  }

  const amount =
    randomInt(
      MIN_SPARKLES_PER_SPAWN,
      MAX_SPARKLES_PER_SPAWN
    );

  for (
    let i = 0;
    i < amount;
    i++
  ) {
    if (
      player.sparklesOnTree.length >=
      MAX_ACTIVE_SPARKLES
    ) {
      break;
    }

    player.sparklesOnTree.push(
      createSparkle()
    );
  }
}

/* =========================================================
   CHAOS EVENT
========================================================= */

function maybeChaosEvent(
  player
) {
  if (
    Math.random() > 0.20
  ) {
    return null;
  }

  const event =
    randomItem(
      WEREWIVES_EVENTS
    );

  /*
    The current interaction only has
    the player who triggered the event.

    So random events affect that player,
    while everyone-events currently affect
    the triggering player.

    This keeps the system safe without
    requiring a separate member database
    or Discord server-member lookup.
  */

  const amount =
    Number(event.amount) || 0;

  const before =
    player.sparkles;

  player.sparkles =
    Math.max(
      0,
      player.sparkles + amount
    );

  const actualChange =
    player.sparkles - before;

  if (
    actualChange > 0
  ) {
    return (
      `${event.message}\n\n` +
      `💖 **+${actualChange} sparkles!**\n` +
      `✨ You now have **${player.sparkles} ✨**`
    );
  }

  if (
    actualChange < 0
  ) {
    return (
      `${event.message}\n\n` +
      `💔 **${Math.abs(actualChange)} sparkles lost!**\n` +
      `✨ You now have **${player.sparkles} ✨**`
    );
  }

  return (
    `${event.message}\n\n` +
    `✨ No sparkles were lost because you had none to take.`
  );
}

/* =========================================================
   BACKGROUND
========================================================= */

function getBackground(
  player
) {
  const theme =
    player.equipped?.theme ||
    "cherry";

  if (
    theme === "halloween"
  ) {
    return (
      R2_BASE +
      HALLOWEEN_BACKGROUND
    );
  }

  if (
    theme === "candyland"
  ) {
    return (
      R2_BASE +
      CANDYLAND_BACKGROUND
    );
  }

  return (
    R2_BASE +
    NORMAL_BACKGROUND
  );
}

/* =========================================================
   TREE IMAGE
========================================================= */

function getTreeImage(
  player
) {
  const tree =
    player.equipped?.tree ||
    "cherry";

  if (
    tree === "cotton_candy"
  ) {
    return (
      R2_BASE +
      COTTON_CANDY_TREE
    );
  }

  return (
    R2_BASE +
    TREE_IMAGE
  );
}

/* =========================================================
   RENDER TREE
========================================================= */

async function renderTree(
  env,
  player
) {
  cleanExpiredSparkles(
    player
  );

  const browser =
    await puppeteer.launch(
      env.BROWSER
    );

  try {
    const page =
      await browser.newPage();

    const backgroundUrl =
      getBackground(player);

    const treeUrl =
      getTreeImage(player);

    const sparkleHtml =
      player.sparklesOnTree
        .map(
          sparkle => `
            <div
              class="sparkle"
              style="
                left:${sparkle.x}%;
                top:${sparkle.y}%;
              "
            >
              ${sparkle.emoji}
            </div>
          `
        )
        .join("");

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

            left: 44%;

            top: ${TREE_TOP_POSITION}%;

            transform:
              translate(-50%, -50%);

            width: 30%;
            height: 30%;

            object-fit: contain;

            z-index: 5;
          }

          .sparkle {
            position: absolute;

            transform:
              translate(-50%, -50%);

            font-size: 78px;

            z-index: 20;

            animation:
              sparkleFloat 1.5s infinite alternate,
              sparklePulse 1s infinite;

            filter:
              drop-shadow(
                0 0 10px
                rgba(255,255,255,1)
              )

              drop-shadow(
                0 0 22px
                rgba(255,180,255,1)
              )

              drop-shadow(
                0 0 35px
                rgba(255,255,255,0.9)
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

            0%,
            100% {
              opacity: 0.9;
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

          ${sparkleHtml}

        </div>

      </body>

      </html>
    `;

    /*
      IMPORTANT:
      Do NOT use networkidle0.
      It can wait indefinitely on external
      image/network requests.
    */

    await page.setContent(
      html,
      {
        waitUntil:
          "domcontentloaded"
      }
    );

    await page.setViewport({
      width: 1024,
      height: 1024
    });

    try {
      await page.waitForFunction(
        () =>
          Array.from(
            document.images
          ).every(
            image =>
              image.complete
          ),
        {
          timeout: 5000
        }
      );
    } catch {
      console.log(
        "Image loading timed out; continuing render."
      );
    }

    return await page.screenshot({
      type: "png"
    });

  } finally {
    await browser.close();
  }
}

/* =========================================================
   TREE TEXT
========================================================= */

function buildTreeText(
  player
) {
  cleanExpiredSparkles(
    player
  );

  const needed =
    xpNeeded(
      player.level
    );

  return (
    `🌸 **${player.treeName}**\n\n` +
    `🌱 Level: **${player.level}**\n` +
    `✨ EXP: **${player.exp}/${needed}**\n` +
    `💖 Sparkles: **${player.sparkles}**\n\n` +
    `✨ Sparkles on tree: **${player.sparklesOnTree.length}**`
  );
}

/* =========================================================
   TREE BUTTONS
========================================================= */

function treeButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 1,
        label: "💧 Water",
        custom_id: "water"
      },

      {
        type: 2,
        style: 1,
        label: "✨ Catch Sparkle",
        custom_id: "catch"
      },

      {
        type: 2,
        style: 2,
        label: "🎁 Daily",
        custom_id: "daily"
      },

      {
        type: 2,
        style: 2,
        label: "🛍️ Shop",
        custom_id: "shop"
      },

      {
        type: 2,
        style: 2,
        label: "🎀 Customize",
        custom_id: "customize"
      }
    ]
  };
}

/* =========================================================
   DISCORD ACKNOWLEDGEMENT
========================================================= */

async function acknowledge(
  env,
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

/* =========================================================
   SEND TREE AFTER DEFER
========================================================= */

async function sendTree(
  env,
  interaction,
  player
) {
  const image =
    await renderTree(
      env,
      player
    );

  const file =
    new File(
      [image],
      "tree.png",
      {
        type: "image/png"
      }
    );

  const form =
    new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      content:
        buildTreeText(
          player
        ),

      components: [
        treeButtons()
      ],

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
    file
  );

  return fetch(
    `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",

      body: form
    }
  );
}

/* =========================================================
   SEND TEXT
========================================================= */

async function sendText(
  env,
  interaction,
  content,
  components = []
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
        type: 4,

        data: {
          content,

          components
        }
      })
    }
  );
}

/* =========================================================
   REGULAR SHOP BUTTONS
========================================================= */

function shopCategoryButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label: "🌌 Backgrounds",
        custom_id:
          "shop_backgrounds"
      },

      {
        type: 2,
        style: 2,
        label: "🌳 Trees",
        custom_id:
          "shop_trees"
      },

      {
        type: 2,
        style: 1,
        label: "⏳ Limited Shop",
        custom_id:
          "limited_shop"
      },

      {
        type: 2,
        style: 4,
        label: "❌ Close",
        custom_id: "tree"
      }
    ]
  };
}

/* =========================================================
   REGULAR BACKGROUND SHOP
========================================================= */

function backgroundShopButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 1,

        label:
          `🍭 Candy Land — ${CANDYLAND_PRICE} ✨`,

        custom_id:
          "buy_candyland"
      },

      {
        type: 2,
        style: 2,

        label: "⬅️ Back",

        custom_id: "shop"
      }
    ]
  };
}

/* =========================================================
   TREE SHOP BUTTONS
========================================================= */

function treeShopButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 1,

        label:
          `🍭 Cotton Candy Tree — ${COTTON_CANDY_PRICE} ✨`,

        custom_id:
          "buy_cotton_candy"
      },

      {
        type: 2,
        style: 2,

        label: "⬅️ Back",

        custom_id: "shop"
      }
    ]
  };
}

/* =========================================================
   LIMITED SHOP MAIN BUTTONS
========================================================= */

function limitedShopButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 1,
        label: "🎃 Halloween",
        custom_id:
          "limited_halloween"
      },

      {
        type: 2,
        style: 2,
        label: "⭐ Special Sets",
        custom_id:
          "limited_special"
      },

      {
        type: 2,
        style: 2,
        label: "🎁 Holiday Items",
        custom_id:
          "limited_holidays"
      },

      {
        type: 2,
        style: 2,
        label: "⬅️ Regular Shop",
        custom_id:
          "shop"
      }
    ]
  };
}

/* =========================================================
   LIMITED HALLOWEEN BUTTONS
========================================================= */

function limitedHalloweenButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 4,

        label:
          `🎃 Halloween Background — ${HALLOWEEN_PRICE} ✨`,

        custom_id:
          "buy_halloween"
      },

      {
        type: 2,
        style: 2,

        label: "⬅️ Limited Shop",

        custom_id:
          "limited_shop"
      }
    ]
  };
}

/* =========================================================
   LIMITED SPECIAL SET BUTTONS
========================================================= */

function limitedSpecialButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label: "⭐ Coming Soon",
        custom_id:
          "limited_coming_soon"
      },

      {
        type: 2,
        style: 2,
        label: "⬅️ Limited Shop",
        custom_id:
          "limited_shop"
      }
    ]
  };
}

/* =========================================================
   LIMITED HOLIDAY BUTTONS
========================================================= */

function limitedHolidayButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label: "🎁 Coming Soon",
        custom_id:
          "limited_coming_soon"
      },

      {
        type: 2,
        style: 2,
        label: "⬅️ Limited Shop",
        custom_id:
          "limited_shop"
      }
    ]
  };
}

/* =========================================================
   SHOP
========================================================= */

async function handleShop(
  env,
  interaction
) {
  return sendText(
    env,
    interaction,

    `🛍️ **Werewives Tree Shop**\n\n` +
    `Choose a category!\n\n` +
    `⏳ Limited items are found in the Limited Shop!`,

    [
      shopCategoryButtons()
    ]
  );
}

async function handleShopCategory(
  env,
  interaction,
  category
) {
  if (
    category === "backgrounds"
  ) {
    return sendText(
      env,
      interaction,

      `🌌 **Background Shop**\n\n` +
      `🍭 Candy Land Background — **${CANDYLAND_PRICE} ✨**\n\n` +
      `🎃 Halloween has moved to the **Limited Shop!**`,

      [
        backgroundShopButtons()
      ]
    );
  }

  return sendText(
    env,
    interaction,

    `🌳 **Tree Shop**\n\n` +
    `🍭 Cotton Candy Tree — **${COTTON_CANDY_PRICE} ✨**`,

    [
      treeShopButtons()
    ]
  );
}

/* =========================================================
   LIMITED SHOP
========================================================= */

async function handleLimitedShop(
  env,
  interaction
) {
  return sendText(
    env,
    interaction,

    `⏳ **WEREWIVES LIMITED SHOP**\n\n` +
    `Special items, holiday collections, and limited-time sets live here! ✨\n\n` +
    `🎃 Halloween\n` +
    `⭐ Special Sets\n` +
    `🎁 Holiday Items`,

    [
      limitedShopButtons()
    ]
  );
}

async function handleLimitedCategory(
  env,
  interaction,
  category
) {
  if (
    category === "halloween"
  ) {
    return sendText(
      env,
      interaction,

      `🎃 **HALLOWEEN LIMITED SHOP**\n\n` +
      `👻 Spooky season has arrived!\n\n` +
      `🎃 Halloween Background — **${HALLOWEEN_PRICE} ✨**\n\n` +
      `⏳ *Limited-time item*`,

      [
        limitedHalloweenButtons()
      ]
    );
  }

  if (
    category === "special"
  ) {
    return sendText(
      env,
      interaction,

      `⭐ **SPECIAL SETS**\n\n` +
      `Exclusive themed sets will appear here!\n\n` +
      `✨ **Coming soon...**`,

      [
        limitedSpecialButtons()
      ]
    );
  }

  return sendText(
    env,
    interaction,

    `🎁 **HOLIDAY ITEMS**\n\n` +
    `Seasonal holiday collections will appear here!\n\n` +
    `✨ **Coming soon...**`,

    [
      limitedHolidayButtons()
    ]
  );
}

/* =========================================================
   BUY HALLOWEEN
========================================================= */

async function buyHalloween(
  env,
  interaction,
  userId
) {
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
      env,
      interaction,

      "🎃 You already own the Halloween background!"
    );
  }

  if (
    player.sparkles <
    HALLOWEEN_PRICE
  ) {
    return sendText(
      env,
      interaction,

      `❌ You need **${HALLOWEEN_PRICE} ✨** to buy this.\n` +
      `You have **${player.sparkles} ✨**.`
    );
  }

  player.sparkles -=
    HALLOWEEN_PRICE;

  player.inventory.push(
    "halloween_background"
  );

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    "🎃 **Halloween background purchased!**\n\n" +
    "Use `/customize` to equip it!"
  );
}

/* =========================================================
   BUY CANDY LAND
========================================================= */

async function buyCandyland(
  env,
  interaction,
  userId
) {
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
      env,
      interaction,

      "🍭 You already own the Candy Land background!"
    );
  }

  if (
    player.sparkles <
    CANDYLAND_PRICE
  ) {
    return sendText(
      env,
      interaction,

      `❌ You need **${CANDYLAND_PRICE} ✨** to buy this.\n` +
      `You have **${player.sparkles} ✨**.`
    );
  }

  player.sparkles -=
    CANDYLAND_PRICE;

  player.inventory.push(
    "candyland_background"
  );

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    "🍭 **Candy Land background purchased!**\n\n" +
    "Use `/customize` to equip it!"
  );
}

/* =========================================================
   BUY COTTON CANDY TREE
========================================================= */

async function buyCottonCandy(
  env,
  interaction,
  userId
) {
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
      env,
      interaction,

      "🍭 You already own the Cotton Candy Tree!"
    );
  }

  if (
    player.sparkles <
    COTTON_CANDY_PRICE
  ) {
    return sendText(
      env,
      interaction,

      `❌ You need **${COTTON_CANDY_PRICE} ✨** to buy this.\n` +
      `You have **${player.sparkles} ✨**.`
    );
  }

  player.sparkles -=
    COTTON_CANDY_PRICE;

  player.inventory.push(
    "cotton_candy_tree"
  );

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    "🍭 **Cotton Candy Tree purchased!**\n\n" +
    "Use `/customize` to equip it!"
  );
}

/* =========================================================
   WATER
========================================================= */

async function handleWater(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  const now =
    Date.now();

  if (
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

    return sendText(
      env,
      interaction,

      `💧 Your tree has already been watered!\n` +
      `Try again in about **${minutes} minutes**.`
    );
  }

  player.lastWater =
    now;

  const rewardMessages =
    addExp(
      player,
      EXP_PER_WATER
    );

  maybeSpawnSparkles(
    player
  );

  const chaos =
    maybeChaosEvent(
      player
    );

  await savePlayer(
    env,
    userId,
    player
  );

  let message =
    `💧 You watered **${player.treeName}**!\n` +
    `✨ +${EXP_PER_WATER} EXP`;

  if (
    player.sparklesOnTree.length
  ) {
    message +=
      `\n✨ Sparkles appeared around your tree!`;
  }

  if (
    rewardMessages.length
  ) {
    message +=
      "\n\n" +
      rewardMessages.join(
        "\n"
      );
  }

  if (chaos) {
    message +=
      "\n\n" +
      chaos;
  }

  return sendText(
    env,
    interaction,
    message
  );
}

/* =========================================================
   CATCH SPARKLE
========================================================= */

async function handleCatch(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  cleanExpiredSparkles(
    player
  );

  if (
    player.sparklesOnTree.length ===
    0
  ) {
    await savePlayer(
      env,
      userId,
      player
    );

    return sendText(
      env,
      interaction,

      "✨ There aren't any sparkles to catch right now!"
    );
  }

  const index =
    randomInt(
      0,
      player.sparklesOnTree.length -
        1
    );

  const sparkle =
    player.sparklesOnTree.splice(
      index,
      1
    )[0];

  player.sparkles +=
    sparkle.value;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `${sparkle.emoji} You caught a **${sparkle.name}**!\n\n` +
    `💖 +${sparkle.value} sparkles!\n` +
    `✨ You now have **${player.sparkles} ✨**`
  );
}

/* =========================================================
   DAILY
========================================================= */

async function handleDaily(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  const now =
    Date.now();

  if (
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

    return sendText(
      env,
      interaction,

      `🎁 You already claimed your daily reward!\n` +
      `Come back in about **${hours} hours**.`
    );
  }

  player.lastDaily =
    now;

  const reward =
    randomInt(25, 75);

  player.sparkles +=
    reward;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🎁 **Daily reward!**\n\n` +
    `💖 You received **${reward} sparkles!**\n` +
    `✨ Total: **${player.sparkles} ✨**`
  );
}

/* =========================================================
   INVENTORY
========================================================= */

async function handleInventory(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  const items = [];

  if (
    player.inventory.includes(
      "pink_sky_background"
    )
  ) {
    items.push(
      "🌸 Pink Sky Background"
    );
  }

  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    items.push(
      "🎃 Halloween Background"
    );
  }

  if (
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    items.push(
      "🍭 Candy Land Background"
    );
  }

  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    items.push(
      "🍭 Cotton Candy Tree"
    );
  }

  return sendText(
    env,
    interaction,

    `🎒 **Your Inventory**\n\n` +

    (
      items.length
        ? items.join("\n")
        : "Nothing yet!"
    ) +

    `\n\n💖 Sparkles: **${player.sparkles} ✨**`
  );
}

/* =========================================================
   CUSTOMIZE BUTTONS
========================================================= */

function customizeButtons(
  player
) {
  const buttons = [];

  buttons.push({
    type: 2,
    style: 1,
    label: "🌸 Pink Sky",
    custom_id:
      "equip_theme_cherry"
  });

  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
      label: "🎃 Halloween",
      custom_id:
        "equip_theme_halloween"
    });
  }

  if (
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
      label: "🍭 Candy Land",
      custom_id:
        "equip_theme_candyland"
    });
  }

  const rows = [
    {
      type: 1,
      components: buttons
    }
  ];

  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    rows.push({
      type: 1,

      components: [
        {
          type: 2,
          style: 1,
          label:
            "🍭 Cotton Candy Tree",
          custom_id:
            "equip_tree_cotton_candy"
        },

        {
          type: 2,
          style: 2,
          label:
            "🌸 Cherry Tree",
          custom_id:
            "equip_tree_cherry"
        }
      ]
    });
  }

  rows.push({
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label:
          "🌳 Back to Tree",
        custom_id: "tree"
      }
    ]
  });

  return rows;
}

/* =========================================================
   CUSTOMIZE
========================================================= */

async function handleCustomize(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  return sendText(
    env,
    interaction,

    `🎀 **Customize Your Tree**\n\n` +
    `Current background: **${player.equipped.theme}**\n` +
    `Current tree: **${player.equipped.tree}**`,

    customizeButtons(
      player
    )
  );
}

/* =========================================================
   EQUIP THEME
========================================================= */

async function equipTheme(
  env,
  interaction,
  userId,
  theme
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  if (
    theme === "halloween" &&
    !player.inventory.includes(
      "halloween_background"
    )
  ) {
    return sendText(
      env,
      interaction,

      "❌ You don't own the Halloween background yet!"
    );
  }

  if (
    theme === "candyland" &&
    !player.inventory.includes(
      "candyland_background"
    )
  ) {
    return sendText(
      env,
      interaction,

      "❌ You don't own the Candy Land background yet!"
    );
  }

  player.equipped.theme =
    theme;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `✨ Background changed to **${theme}**!`
  );
}

/* =========================================================
   EQUIP TREE
========================================================= */

async function equipTree(
  env,
  interaction,
  userId,
  tree
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  if (
    tree === "cotton_candy" &&
    !player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    return sendText(
      env,
      interaction,

      "❌ You don't own the Cotton Candy Tree yet!"
    );
  }

  player.equipped.tree =
    tree;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🌳 Tree changed to **${tree}**!`
  );
}

/* =========================================================
   RENAME
========================================================= */

async function handleRename(
  env,
  interaction,
  userId
) {
  return sendText(
    env,
    interaction,

    "🌸 To rename your tree, use the `/rename` command followed by the new name."
  );
}

async function renameTree(
  env,
  interaction,
  userId,
  name
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  const cleanName =
    String(name || "")
      .trim()
      .slice(0, 40);

  if (!cleanName) {
    return sendText(
      env,
      interaction,

      "❌ Please provide a name."
    );
  }

  player.treeName =
    cleanName;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🌸 Your tree is now named **${cleanName}**!`
  );
}

/* =========================================================
   LEADERBOARD
========================================================= */

async function handleLeaderboard(
  env,
  interaction
) {
  return sendText(
    env,
    interaction,

    "🏆 **Werewives Tree Leaderboard**\n\n" +
    "Leaderboard tracking is coming soon! ✨"
  );
}

/* =========================================================
   GIVE SPARKLES
   OWNER ONLY
========================================================= */

async function handleGiveSparkles(
  env,
  interaction,
  targetId,
  amount
) {
  const callerId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  if (
    callerId !== env.OWNER_ID
  ) {
    return sendText(
      env,
      interaction,

      "❌ Only the bot owner can use this command."
    );
  }

  const number =
    Number(amount);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return sendText(
      env,
      interaction,

      "❌ Please enter a valid positive amount."
    );
  }

  const player =
    await getPlayer(
      env,
      targetId
    );

  player.sparkles +=
    Math.floor(number);

  await savePlayer(
    env,
    targetId,
    player
  );

  return sendText(
    env,
    interaction,

    `✨ Gave **${Math.floor(number)} sparkles**!`
  );
}

/* =========================================================
   TREE COMMAND
========================================================= */

async function handleTree(
  env,
  interaction
) {
  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  /*
    IMPORTANT:
    Acknowledge immediately before
    doing KV/Puppeteer work.
  */

  const acknowledged =
    await acknowledge(
      env,
      interaction
    );

  if (!acknowledged.ok) {
    console.error(
      "Discord acknowledgement failed:",
      acknowledged.status
    );

    return acknowledged;
  }

  const player =
    await getPlayer(
      env,
      userId
    );

  cleanExpiredSparkles(
    player
  );

  maybeSpawnSparkles(
    player
  );

  await savePlayer(
    env,
    userId,
    player
  );

  try {
    return await sendTree(
      env,
      interaction,
      player
    );

  } catch (error) {
    console.error(
      "TREE RENDER ERROR:",
      error
    );

    return fetch(
      `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          content:
            "🌸 Your tree is alive, but I couldn't render the picture right now. Try again! ✨",

          components: [
            treeButtons()
          ]
        })
      }
    );
  }
}

/* =========================================================
   COMPONENT ROUTER
========================================================= */

async function handleComponent(
  env,
  interaction
) {
  const customId =
    interaction.data?.custom_id;

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  switch (customId) {

    case "tree":
      return handleTree(
        env,
        interaction
      );

    case "water":
      return handleWater(
        env,
        interaction,
        userId
      );

    case "catch":
      return handleCatch(
        env,
        interaction,
        userId
      );

    case "daily":
      return handleDaily(
        env,
        interaction,
        userId
      );

    case "shop":
      return handleShop(
        env,
        interaction
      );

    case "shop_backgrounds":
      return handleShopCategory(
        env,
        interaction,
        "backgrounds"
      );

    case "shop_trees":
      return handleShopCategory(
        env,
        interaction,
        "trees"
      );

    case "limited_shop":
      return handleLimitedShop(
        env,
        interaction
      );

    case "limited_halloween":
      return handleLimitedCategory(
        env,
        interaction,
        "halloween"
      );

    case "limited_special":
      return handleLimitedCategory(
        env,
        interaction,
        "special"
      );

    case "limited_holidays":
      return handleLimitedCategory(
        env,
        interaction,
        "holidays"
      );

    case "limited_coming_soon":
      return sendText(
        env,
        interaction,

        "✨ **Coming soon!**\n\n" +
        "We're cooking up something chaotic. 🧀🦝🐺"
      );

    case "buy_halloween":
      return buyHalloween(
        env,
        interaction,
        userId
      );

    case "buy_candyland":
      return buyCandyland(
        env,
        interaction,
        userId
      );

    case "buy_cotton_candy":
      return buyCottonCandy(
        env,
        interaction,
        userId
      );

    case "customize":
      return handleCustomize(
        env,
        interaction,
        userId
      );

    case "equip_theme_cherry":
      return equipTheme(
        env,
        interaction,
        userId,
        "cherry"
      );

    case "equip_theme_halloween":
      return equipTheme(
        env,
        interaction,
        userId,
        "halloween"
      );

    case "equip_theme_candyland":
      return equipTheme(
        env,
        interaction,
        userId,
        "candyland"
      );

    case "equip_tree_cherry":
      return equipTree(
        env,
        interaction,
        userId,
        "cherry"
      );

    case "equip_tree_cotton_candy":
      return equipTree(
        env,
        interaction,
        userId,
        "cotton_candy"
      );

    default:
      return sendText(
        env,
        interaction,

        "❌ Unknown button."
      );
  }
}

/* =========================================================
   COMMAND ROUTER
========================================================= */

async function handleCommand(
  env,
  interaction
) {
  const command =
    interaction.data?.name;

  const userId =
    interaction.member?.user?.id ||
    interaction.user?.id;

  switch (command) {

    case "tree":
      return handleTree(
        env,
        interaction
      );

    case "water":
      return handleWater(
        env,
        interaction,
        userId
      );

    case "catch":
      return handleCatch(
        env,
        interaction,
        userId
      );

    case "daily":
      return handleDaily(
        env,
        interaction,
        userId
      );

    case "shop":
      return handleShop(
        env,
        interaction
      );

    case "customize":
      return handleCustomize(
        env,
        interaction,
        userId
      );

    case "inventory":
      return handleInventory(
        env,
        interaction,
        userId
      );

    case "leaderboard":
      return handleLeaderboard(
        env,
        interaction
      );

    case "rename": {
      const name =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "name"
        )?.value;

      return renameTree(
        env,
        interaction,
        userId,
        name
      );
    }

    case "give-sparkles": {
      const target =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "user"
        )?.value;

      const amount =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "amount"
        )?.value;

      return handleGiveSparkles(
        env,
        interaction,
        target,
        amount
      );
    }

    default:
      return sendText(
        env,
        interaction,

        "❌ Unknown command."
      );
  }
}

/* =========================================================
   DISCORD SIGNATURE VERIFICATION
========================================================= */

function hexToUint8Array(
  hex
) {
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

async function verifySignature(
  request,
  body,
  publicKey
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

  try {
    const key =
      await crypto.subtle.importKey(
        "raw",

        hexToUint8Array(
          publicKey
        ),

        {
          name: "Ed25519"
        },

        false,

        ["verify"]
      );

    return await crypto.subtle.verify(
      {
        name: "Ed25519"
      },

      key,

      hexToUint8Array(
        signature
      ),

      new TextEncoder().encode(
        timestamp + body
      )
    );

  } catch {
    return false;
  }
}

/* =========================================================
   COMMAND REGISTRATION
========================================================= */

const COMMANDS = [

  {
    name: "tree",

    description:
      "View your magical tree"
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
      "Claim your daily sparkles"
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
        type: 3,

        name: "name",

        description:
          "Your tree's new name",

        required: true
      }
    ]
  },

  {
    name:
      "give-sparkles",

    description:
      "Give a user sparkles",

    options: [
      {
        type: 6,

        name: "user",

        description:
          "User receiving sparkles",

        required: true
      },

      {
        type: 4,

        name: "amount",

        description:
          "Amount of sparkles",

        required: true
      }
    ]
  }
];

/* =========================================================
   REGISTER COMMANDS
========================================================= */

async function registerCommands(
  env
) {
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
            COMMANDS
          )
      }
    );

  return response;
}

/* =========================================================
   MAIN WORKER
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

    /* -----------------------------------------
       HOME
    ----------------------------------------- */

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return new Response(
        "🌸 Werewives Tree Bot is alive! ✨",
        {
          status: 200
        }
      );
    }

    /* -----------------------------------------
       REGISTER
    ----------------------------------------- */

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {

      const response =
        await registerCommands(
          env
        );

      const text =
        await response.text();

      return new Response(
        text,

        {
          status:
            response.status,

          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    /* -----------------------------------------
       DISCORD INTERACTIONS
    ----------------------------------------- */

    if (
      request.method === "POST" &&
      url.pathname ===
        "/interactions"
    ) {

      const body =
        await request.text();

      const valid =
        await verifySignature(
          request,
          body,
          env.PUBLIC_KEY
        );

      if (!valid) {

        return new Response(
          "Invalid signature",

          {
            status: 401
          }
        );
      }

      let interaction;

      try {

        interaction =
          JSON.parse(
            body
          );

      } catch {

        return new Response(
          "Invalid JSON",

          {
            status: 400
          }
        );
      }

      /* ---------------------------------------
         PING
      --------------------------------------- */

      if (
        interaction.type === 1
      ) {

        return new Response(
          JSON.stringify({
            type: 1
          }),

          {
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );
      }

      /* ---------------------------------------
         SLASH COMMAND
      --------------------------------------- */

      if (
        interaction.type === 2
      ) {

        return handleCommand(
          env,
          interaction
        );
      }

      /* ---------------------------------------
         BUTTON
      --------------------------------------- */

      if (
        interaction.type === 3
      ) {

        return handleComponent(
          env,
          interaction
        );
      }

      return new Response(

        JSON.stringify({
          type: 4,

          data: {
            content:
              "❌ Unsupported interaction."
          }
        }),

        {
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    return new Response(
      "Not found",

      {
        status: 404
      }
    );
  }
};
