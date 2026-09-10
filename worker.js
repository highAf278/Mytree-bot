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

/* =========================================================
   BIRTHDAY EVENT
========================================================= */

const BIRTHDAY_EVENT_DATE = "2026-09-10";
const BIRTHDAY_START_HOUR = 16;
const BIRTHDAY_END_HOUR = 19;

const BIRTHDAY_PIN = "LOVE";

const STONED_TREE_IMAGE = "IMG_7283.png";
const STONED_BALLOON_IMAGE = "IMG_7277.png";
const STONED_BACKGROUND = "IMG_7275.jpeg";

const STONED_GIFT_SPARKLES = 300;

const GIFT_HUNT_MIN_INTERVAL = 8 * 60 * 1000;
const GIFT_HUNT_MAX_INTERVAL = 12 * 60 * 1000;
const GIFT_HUNT_DURATION = 3 * 60 * 60 * 1000;

/* =========================================================
   ASSETS
========================================================= */

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

const NORMAL_BACKGROUND = "IMG_7251.jpeg";
const HALLOWEEN_BACKGROUND = "IMG_7254.jpeg";
const CANDYLAND_BACKGROUND = "IMG_7261.jpeg";

const TREE_IMAGE = "IMG_7259.png";
const COTTON_CANDY_TREE = "IMG_7263.png";

const PUMPKIN_CAT_IMAGE = "IMG_7272.png";
const PANDA_DECORATION_IMAGE = "IMG_7287.png";
const CAT_DECORATION_IMAGE = "IMG_7288.png";

/* =========================================================
   SHOP PRICES
========================================================= */

const HALLOWEEN_PRICE = 150;
const CANDYLAND_PRICE = 500;
const COTTON_CANDY_PRICE = 1000;

const PUMPKIN_CAT_PRICE = 250;
const PANDA_DECORATION_PRICE = 3000;
const CAT_DECORATION_PRICE = 1500;

/* =========================================================
   TREE SIZING
========================================================= */

const TREE_TOP_POSITION = 72;

/* =========================================================
   TREE STAGES
========================================================= */

const TREE_STAGES = [
  {
    level: 1,
    image: TREE_IMAGE
  },
  {
    level: 5,
    image: TREE_IMAGE
  },
  {
    level: 10,
    image: TREE_IMAGE
  },
  {
    level: 20,
    image: TREE_IMAGE
  },
  {
    level: 35,
    image: TREE_IMAGE
  },
  {
    level: 50,
    image: TREE_IMAGE
  }
];

/* =========================================================
   CHAOS EVENTS
========================================================= */

const CHAOS_EVENT_CHANCE = 0.35;

const WEREWIVES_EVENTS = [
  {
    message:
      "🧀 **WEREWIVES CHAOS EVENT!**\n\nThe cheese has escaped. Everyone is now legally required to respect the cheese.",
    amount: 25
  },
  {
    message:
      "🦝 **RACCOON ATTACK!**\n\nA raccoon broke into the sparkle vault. Everyone gets compensation.",
    amount: 30
  },
  {
    message:
      "🐺 **WEREWIFE HOWL!**\n\nThe entire server has collectively howled at the moon.",
    amount: 35
  },
  {
    message:
      "💅 **GIRLBOSS EMERGENCY!**\n\nEveryone has been promoted to CEO of absolutely nothing.",
    amount: 40
  },
  {
    message:
      "✨ **SPARKLE STORM!**\n\nThe sky is raining sparkles! Everyone gets some.",
    amount: 50
  },
  {
    message:
      "🦝 **THE RACCOON KNOWS SOMETHING.**\n\nNobody knows what. Everyone gets sparkles anyway.",
    amount: 20
  },
  {
    message:
      "🍝 **SPAGHETTI INCIDENT!**\n\nThe server has temporarily been covered in spaghetti.",
    amount: 30
  },
  {
    message:
      "👁️ **THE CHEESE IS WATCHING.**\n\nYou cannot escape the cheese.",
    amount: 25
  },
  {
    message:
      "🎀 **KAWAII EMERGENCY!**\n\nEverything is suddenly 87% cuter.",
    amount: 35
  },
  {
    message:
      "💥 **WEREWIVES CHAOS!**\n\nNobody knows what happened. Nobody is asking questions.",
    amount: 45
  },
  {
    message:
      "🌙 **MOONLIGHT BONUS!**\n\nThe moon has blessed the server.",
    amount: 40
  },
  {
    message:
      "🍓 **STRAWBERRY INCIDENT!**\n\nThere are strawberries everywhere.",
    amount: 30
  },
  {
    message:
      "🧙 **SUSPICIOUS WITCH ACTIVITY!**\n\nA witch has been spotted near the sparkle supply.",
    amount: 35
  },
  {
    message:
      "🐸 **FROG CONVENTION!**\n\nThe frogs have taken over. Please remain calm.",
    amount: 25
  },
  {
    message:
      "🎪 **ABSOLUTE CIRCUS!**\n\nThe server has become legally classified as a circus.",
    amount: 45
  },
  {
    message:
      "🧁 **CUPCAKE EMERGENCY!**\n\nThere are cupcakes where there absolutely should not be cupcakes.",
    amount: 30
  },
  {
    message:
      "💖 **LOVE BOMB!**\n\nThe server has been attacked by an unreasonable amount of affection.",
    amount: 40
  },
  {
    message:
      "🐀 **TINY MENACE EVENT!**\n\nSomething small and suspicious has entered the server.",
    amount: 25
  },
  {
    message:
      "🌈 **RAINBOW EXPLOSION!**\n\nReality has become aggressively colorful.",
    amount: 50
  },
  {
    message:
      "🪩 **DISCO EMERGENCY!**\n\nEveryone is now obligated to sparkle.",
    amount: 35
  },
  {
    message:
      "🥔 **POTATO INCIDENT!**\n\nNobody knows why there are potatoes everywhere.",
    amount: 20
  },
  {
    message:
      "🐈 **THE CATS HAVE UNIONIZED.**\n\nNegotiations are not going well.",
    amount: 30
  },
  {
    message:
      "🔥 **CHAOS HAS ENTERED THE CHAT.**\n\nPlease accept these sparkles as emotional compensation.",
    amount: 50
  },
  {
    message:
      "🌸 **MAGICAL TREE EVENT!**\n\nThe trees have decided everyone deserves sparkles.",
    amount: 40
  },
  {
    message:
      "👑 **ROYAL WEREWIFE DECREE!**\n\nEveryone has been awarded emergency sparkle funding.",
    amount: 45
  },
  {
    message:
      "🧀🦝 **CHEESE RACCOON ALLIANCE!**\n\nThis is probably bad.",
    amount: 55
  },
  {
    message:
      "🐺💖 **WEREWIFE PACK BONUS!**\n\nThe pack has blessed the server.",
    amount: 50
  }
];

/* =========================================================
   DAILY RIDDLES
========================================================= */

const DAILY_RIDDLES = [
  {
    question: "What has keys but can't open locks?",
    answers: ["piano"]
  },
  {
    question: "What has hands but cannot clap?",
    answers: ["clock"]
  },
  {
    question: "What gets wetter the more it dries?",
    answers: ["towel"]
  },
  {
    question: "What has one eye but cannot see?",
    answers: ["needle"]
  },
  {
    question: "What has a neck but no head?",
    answers: ["bottle"]
  },
  {
    question: "What can travel around the world while staying in one corner?",
    answers: ["stamp"]
  },
  {
    question: "What has many teeth but cannot bite?",
    answers: ["comb"]
  },
  {
    question: "What goes up but never comes down?",
    answers: ["age"]
  },
  {
    question: "What has words but never speaks?",
    answers: ["book"]
  },
  {
    question: "What is full of holes but still holds water?",
    answers: ["sponge"]
  }
];

/* =========================================================
   BIRTHDAY GIFT HUNT
========================================================= */

const GIFT_HUNT_PRIZES = [
  25,
  35,
  50,
  60,
  75,
  85,
  100,
  125,
  150,
  175,
  200,
  225,
  250,
  300
];

const GIFT_HUNT_PRANKS = [
  "😂 The present contained absolutely nothing. Happy birthday!",
  "🧦 You opened the box and found one extremely suspicious sock.",
  "🥔 Congratulations. You received a potato.",
  "🧀 The cheese took the present back.",
  "🦝 A raccoon was inside the box. It has escaped.",
  "💨 The box was empty. The wind stole it.",
  "🐸 A frog looked at you and immediately left.",
  "✨ You received emotional support instead of sparkles."
];

/* =========================================================
   GENERAL HELPERS
========================================================= */

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function xpNeeded(level) {
  return level * 50;
}

function getTreeHeight(player) {
  return Math.max(1, player.level);
}

function getTreeStage(player) {
  let stage = TREE_STAGES[0];

  for (const candidate of TREE_STAGES) {
    if (player.level >= candidate.level) {
      stage = candidate;
    }
  }

  return stage;
}

/* =========================================================
   DEFAULT PLAYER
========================================================= */

function defaultPlayer() {
  return {
    userId: "",
    username: "",
    displayName: "",
    treeName: "Cherry Blossom",
    level: 1,
    exp: 0,
    sparkles: 0,
    lastWater: 0,

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
    },

    dailyRiddleDay: "",
    dailyRiddleSolved: false,
    dailyRiddleWins: 0,

    birthdayUnlocked: false,
    birthdayGiftClaimed: false
  };
}

/* =========================================================
   PLAYER DATABASE
========================================================= */

async function getPlayer(env, userId) {
  const raw = await env.TREE_DATA.get(userId);

  if (!raw) {
    const player = defaultPlayer();
    player.userId = userId;
    return player;
  }

  try {
    return repairPlayer(JSON.parse(raw), userId);
  } catch {
    const player = defaultPlayer();
    player.userId = userId;
    return player;
  }
}

function repairPlayer(player, userId) {
  const base = defaultPlayer();

  const repaired = {
    ...base,
    ...player,
    userId: userId || player.userId || "",
    inventory: Array.isArray(player.inventory)
      ? player.inventory
      : [...base.inventory],
    claimedLevelRewards:
      Array.isArray(player.claimedLevelRewards)
        ? player.claimedLevelRewards
        : [],
    sparklesOnTree:
      Array.isArray(player.sparklesOnTree)
        ? player.sparklesOnTree
        : [],
    equipped: {
      ...base.equipped,
      ...(player.equipped || {})
    }
  };

  if (
    !repaired.inventory.includes(
      "pink_sky_background"
    )
  ) {
    repaired.inventory.push(
      "pink_sky_background"
    );
  }

  return repaired;
}

async function savePlayer(env, userId, player) {
  await env.TREE_DATA.put(
    userId,
    JSON.stringify(player)
  );
}

function updatePlayerIdentity(player, interaction) {
  const user =
    interaction.member?.user ||
    interaction.user;

  if (!user) return;

  player.userId = user.id;
  player.username = user.username || "";

  player.displayName =
    interaction.member?.nick ||
    user.global_name ||
    user.username ||
    "Werewife";
}

/* =========================================================
   SPARKLES
========================================================= */

function cleanExpiredSparkles(player) {
  const now = Date.now();

  player.sparklesOnTree =
    player.sparklesOnTree.filter(
      sparkle =>
        now - sparkle.createdAt <
        SPARKLE_LIFETIME
    );
}

function maybeSpawnSparkles(player) {
  if (Math.random() > SPARKLE_CHANCE) {
    return;
  }

  cleanExpiredSparkles(player);

  const available =
    MAX_ACTIVE_SPARKLES -
    player.sparklesOnTree.length;

  if (available <= 0) return;

  const amount = Math.min(
    randomInt(
      MIN_SPARKLES_PER_SPAWN,
      MAX_SPARKLES_PER_SPAWN
    ),
    available
  );

  const types = [
    {
      emoji: "💖",
      value: 10,
      name: "Pink Sparkle"
    },
    {
      emoji: "🌈",
      value: 20,
      name: "Rainbow Sparkle"
    },
    {
      emoji: "🌙",
      value: 30,
      name: "Moon Sparkle"
    },
    {
      emoji: "⭐",
      value: 50,
      name: "Rare Star"
    }
  ];

  for (let i = 0; i < amount; i++) {
    const type = randomItem(types);

    player.sparklesOnTree.push({
      id:
        Date.now().toString(36) +
        Math.random()
          .toString(36)
          .slice(2),
      emoji: type.emoji,
      value: type.value,
      name: type.name,
      createdAt: Date.now(),
      x: randomInt(20, 80),
      y: randomInt(20, 75)
    });
  }
}

/* =========================================================
   BACKGROUND / TREE / DECORATION
========================================================= */

function getBackground(player) {
  switch (player.equipped?.theme) {
    case "halloween":
      return HALLOWEEN_BACKGROUND;

    case "candyland":
      return CANDYLAND_BACKGROUND;

    case "stoned_birthday":
      return STONED_BACKGROUND_IMAGE;

    default:
      return NORMAL_BACKGROUND;
  }
}

function getTreeImage(player) {
  switch (player.equipped?.tree) {
    case "cotton_candy":
      return COTTON_CANDY_TREE;

    case "stoned_birthday":
      return STONED_TREE_IMAGE;

    case "cherry":
    default:
      return getTreeStage(player).image;
  }
}

function getDecorationImage(player) {
  switch (player.equipped?.decoration) {
    case "pumpkin_cat":
      return PUMPKIN_CAT_IMAGE;

    case "stoned_balloon":
      return STONED_BALLOON_IMAGE;

    case "panda":
      return PANDA_DECORATION_IMAGE;

    case "cat":
      return CAT_DECORATION_IMAGE;

    default:
      return null;
  }
}

/* =========================================================
   TREE RENDER
========================================================= */

async function renderTree(env, player) {
  const browser = await puppeteer.launch(
    env.BROWSER
  );

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1
    });

    const background =
      R2_BASE + getBackground(player);

    const tree =
      R2_BASE + getTreeImage(player);

    const decorationImage =
      getDecorationImage(player);

    const decoration =
      decorationImage
        ? R2_BASE + decorationImage
        : null;

    cleanExpiredSparkles(player);

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

    const decorationHtml =
      decoration
        ? `
          <img
            class="decoration"
            src="${decoration}"
          />
        `
        : "";

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
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .scene {
            position: relative;
            width: 1024px;
            height: 1024px;
            overflow: hidden;
            background-image:
              url("${background}");
            background-size: cover;
            background-position: center;
          }

          .tree {
            position: absolute;
            left: 50%;
            top: ${TREE_TOP_POSITION}%;
            width: 52%;
            height: 52%;
            transform:
              translate(-50%, -50%);
            object-fit: contain;
            object-position: center;
          }

          .decoration {
            position: absolute;
            left: 8%;
            top: 72%;
            width: 36%;
            height: 36%;
            transform:
              translateY(-50%);
            object-fit: contain;
            object-position: center;
          }

          .sparkle {
            position: absolute;
            transform:
              translate(-50%, -50%);
            font-size: 42px;
            filter:
              drop-shadow(
                0 0 8px
                rgba(255,255,255,0.9)
              );
            z-index: 20;
          }

          .topPanel {
            position: absolute;
            top: 22px;
            left: 50%;
            transform:
              translateX(-50%);
            width: 88%;
            padding: 18px 24px;
            border-radius: 28px;
            background:
              rgba(255,255,255,0.86);
            box-shadow:
              0 8px 30px
              rgba(0,0,0,0.18);
            text-align: center;
            z-index: 30;
          }

          .name {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 7px;
          }

          .stats {
            font-size: 23px;
            font-weight: 700;
          }

          .message {
            margin-top: 9px;
            font-size: 18px;
            font-weight: 600;
          }
        </style>
      </head>

      <body>
        <div class="scene">

          <div class="topPanel">
            <div class="name">
              🌸 ${escapeHtml(
                player.treeName
              )}
            </div>

            <div class="stats">
              🌳 Height:
              ${getTreeHeight(player)} ft
              &nbsp; • &nbsp;
              ⭐ Level:
              ${player.level}
              &nbsp; • &nbsp;
              ✨ ${player.sparkles}
            </div>

            ${
              player.sceneMessage
                ? `
                  <div class="message">
                    ${escapeHtml(
                      player.sceneMessage
                    )}
                  </div>
                `
                : ""
            }
          </div>

          ${sparkleHtml}

          ${decorationHtml}

          <img
            class="tree"
            src="${tree}"
          />

        </div>
      </body>
      </html>
    `;

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    await page.evaluate(async () => {
      const images =
        Array.from(
          document.images
        );

      await Promise.all(
        images.map(
          image =>
            image.complete
              ? Promise.resolve()
              : new Promise(resolve => {
                  image.onload = resolve;
                  image.onerror = resolve;
                })
        )
      );
    });

    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );

    return await page.screenshot({
      type: "png"
    });
  } finally {
    await browser.close();
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   TREE TEXT
========================================================= */

function buildTreeText(player) {
  cleanExpiredSparkles(player);

  const nextXp =
    xpNeeded(player.level);

  return (
    `🌸 **${player.treeName}**\n\n` +
    `🌳 **Height: ${getTreeHeight(player)} ft**\n` +
    `⭐ **Level: ${player.level}**\n` +
    `✨ **Sparkles: ${player.sparkles}**\n` +
    `💫 **EXP: ${player.exp}/${nextXp}**\n\n` +
    `💧 Water your tree to gain EXP!\n` +
    `✨ Catch sparkles before they disappear!`
  );
}

/* =========================================================
   TREE BUTTONS
========================================================= */

function treeButtons() {
  return [
    {
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
          label: "🧩 Daily Riddle",
          custom_id: "daily_riddle"
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
    },
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label: "🎒 Inventory",
          custom_id: "inventory"
        },
        {
          type: 2,
          style: 2,
          label: "🏆 Leaderboard",
          custom_id: "leaderboard"
        }
      ]
    }
  ];
}

/* =========================================================
   DISCORD RESPONSE HELPERS
========================================================= */

async function acknowledge(env, interaction) {
  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: 5,
        data: {
          flags: 64
        }
      })
    }
  );
}

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
        "Content-Type": "application/json"
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

async function sendTree(
  env,
  interaction,
  player
) {
  const image =
    await renderTree(env, player);

  const form = new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      content:
        buildTreeText(player),
      components:
        treeButtons(),
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
    new Blob(
      [image],
      {
        type: "image/png"
      }
    ),
    "tree.png"
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
   SHOP
========================================================= */

function shopButtons() {
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: "🌌 Backgrounds",
          custom_id: "shop_backgrounds"
        },
        {
          type: 2,
          style: 1,
          label: "🌳 Trees",
          custom_id: "shop_trees"
        },
        {
          type: 2,
          style: 1,
          label: "🎀 Decorations",
          custom_id: "shop_decorations"
        }
      ]
    },
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label: "🎃 Limited Shop",
          custom_id: "limited_shop"
        },
        {
          type: 2,
          style: 2,
          label: "🌳 Back to Tree",
          custom_id: "tree"
        }
      ]
    }
  ];
}

async function handleShop(
  env,
  interaction
) {
  return sendText(
    env,
    interaction,
    `🛍️ **WEREWIVES TREE SHOP**\n\n` +
      `✨ Spend your sparkles on backgrounds, trees, and decorations!`,
    shopButtons()
  );
}

function shopCategoryButtons(category) {
  if (category === "backgrounds") {
    return [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: "🌸 Pink Sky",
            custom_id:
              "buy_pink_sky"
          },
          {
            type: 2,
            style: 1,
            label: `🍬 Candy Land — ${CANDYLAND_PRICE} ✨`,
            custom_id:
              "buy_candyland"
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: `🎃 Halloween — ${HALLOWEEN_PRICE} ✨`,
            custom_id:
              "buy_halloween"
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: "🛍️ Back to Shop",
            custom_id: "shop"
          }
        ]
      }
    ];
  }

  if (category === "trees") {
    return [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: "🌸 Cherry Blossom",
            custom_id:
              "buy_cherry_tree"
          },
          {
            type: 2,
            style: 1,
            label: `🍭 Cotton Candy — ${COTTON_CANDY_PRICE} ✨`,
            custom_id:
              "buy_cotton_candy"
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: "🛍️ Back to Shop",
            custom_id: "shop"
          }
        ]
      }
    ];
  }

  if (category === "decorations") {
    return [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            label: `🐼 Panda — ${PANDA_DECORATION_PRICE} ✨`,
            custom_id:
              "buy_panda"
          },
          {
            type: 2,
            style: 1,
            label: `🐱 Cat — ${CAT_DECORATION_PRICE} ✨`,
            custom_id:
              "buy_cat"
          }
        ]
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: "🛍️ Back to Shop",
            custom_id: "shop"
          }
        ]
      }
    ];
  }

  return [];
}

async function handleShopCategory(
  env,
  interaction,
  category
) {
  if (category === "backgrounds") {
    return sendText(
      env,
      interaction,
      `🌌 **BACKGROUND SHOP**\n\n` +
        `🌸 Pink Sky — Free\n` +
        `🍬 Candy Land — ${CANDYLAND_PRICE} ✨\n` +
        `🎃 Halloween — ${HALLOWEEN_PRICE} ✨`,
      shopCategoryButtons(
        "backgrounds"
      )
    );
  }

  if (category === "trees") {
    return sendText(
      env,
      interaction,
      `🌳 **TREE SHOP**\n\n` +
        `🌸 Cherry Blossom — Free\n` +
        `🍭 Cotton Candy — ${COTTON_CANDY_PRICE} ✨`,
      shopCategoryButtons("trees")
    );
  }

  return sendText(
    env,
    interaction,
    `🎀 **DECORATION SHOP**\n\n` +
      `🐼 Panda — ${PANDA_DECORATION_PRICE} ✨\n` +
      `🐱 Cat — ${CAT_DECORATION_PRICE} ✨\n\n` +
      `Decorations appear beside your tree!`,
    shopCategoryButtons(
      "decorations"
    )
  );
}

/* =========================================================
   LIMITED SHOP
========================================================= */

function limitedShopButtons() {
  return [
    {
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
          style: 1,
          label: "✨ Special",
          custom_id:
            "limited_special"
        },
        {
          type: 2,
          style: 1,
          label: "🎁 Holidays",
          custom_id:
            "limited_holidays"
        }
      ]
    },
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label: "🛍️ Back to Shop",
          custom_id: "shop"
        }
      ]
    }
  ];
}

async function handleLimitedShop(
  env,
  interaction
) {
  return sendText(
    env,
    interaction,
    `🎃 **LIMITED SHOP**\n\n` +
      `Seasonal and special items appear here!`,
    limitedShopButtons()
  );
}

async function handleLimitedCategory(
  env,
  interaction,
  category
) {
  if (category === "halloween") {
    return sendText(
      env,
      interaction,
      `🎃 **HALLOWEEN SHOP**\n\n` +
        `🎃 Halloween Background — ${HALLOWEEN_PRICE} ✨\n` +
        `🐱 Pumpkin Cat Decoration — ${PUMPKIN_CAT_PRICE} ✨`,
      [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: `🎃 Buy Background — ${HALLOWEEN_PRICE} ✨`,
              custom_id:
                "buy_halloween"
            },
            {
              type: 2,
              style: 1,
              label: `🐱 Buy Pumpkin Cat — ${PUMPKIN_CAT_PRICE} ✨`,
              custom_id:
                "buy_pumpkin_cat"
            }
          ]
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: "Back",
              custom_id:
                "limited_shop"
            }
          ]
        }
      ]
    );
  }

  if (category === "special") {
    return sendText(
      env,
      interaction,
      `✨ **SPECIAL SHOP**\n\n` +
        `More special items are coming soon!`,
      [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: "Back",
              custom_id:
                "limited_shop"
            }
          ]
        }
      ]
    );
  }

  return sendText(
    env,
    interaction,
    `🎁 **HOLIDAY SHOP**\n\n` +
      `Holiday items are coming soon!`,
    [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: "Back",
            custom_id:
              "limited_shop"
          }
        ]
      }
    ]
  );
}

/* =========================================================
   BUY ITEMS
========================================================= */

async function buyItem(
  env,
  interaction,
  userId,
  itemId,
  price,
  name
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    player.inventory.includes(
      itemId
    )
  ) {
    return sendText(
      env,
      interaction,
      `💖 You already own **${name}**!`
    );
  }

  if (player.sparkles < price) {
    return sendText(
      env,
      interaction,
      `❌ You need **${price} ✨** to buy ${name}.\n\n` +
        `You currently have **${player.sparkles} ✨**.`
    );
  }

  player.sparkles -= price;
  player.inventory.push(itemId);

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎉 **PURCHASE COMPLETE!**\n\n` +
      `You bought **${name}** for **${price} ✨**!\n\n` +
      `✨ Remaining sparkles: **${player.sparkles}**`
  );
}

async function buyHalloween(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "halloween_background",
    HALLOWEEN_PRICE,
    "🎃 Halloween Background"
  );
}

async function buyCandyland(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "candyland_background",
    CANDYLAND_PRICE,
    "🍬 Candy Land Background"
  );
}

async function buyCottonCandy(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "cotton_candy_tree",
    COTTON_CANDY_PRICE,
    "🍭 Cotton Candy Tree"
  );
}

async function buyPumpkinCat(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "pumpkin_cat_decoration",
    PUMPKIN_CAT_PRICE,
    "🐱 Pumpkin Cat Decoration"
  );
}

async function buyPanda(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "panda_decoration",
    PANDA_DECORATION_PRICE,
    "🐼 Panda Decoration"
  );
}

async function buyCat(
  env,
  interaction,
  userId
) {
  return buyItem(
    env,
    interaction,
    userId,
    "cat_decoration",
    CAT_DECORATION_PRICE,
    "🐱 Cat Decoration"
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

  updatePlayerIdentity(
    player,
    interaction
  );

  const now = Date.now();

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
      `💧 Your tree is already watered!\n\n` +
        `⏰ Come back in about **${minutes} minutes**.`
    );
  }

  player.lastWater = now;
  player.exp += EXP_PER_WATER;

  let levelUps = 0;

  while (
    player.exp >=
    xpNeeded(player.level)
  ) {
    player.exp -=
      xpNeeded(player.level);

    player.level++;
    levelUps++;
  }

  cleanExpiredSparkles(player);
  maybeSpawnSparkles(player);

  player.sceneMessage =
    levelUps > 0
      ? `🎉 Your tree grew! +${levelUps} level!`
      : "💧 Your tree feels refreshed!";

  await savePlayer(
    env,
    userId,
    player
  );

  const chaos =
    await maybeChaosEvent(
      env,
      interaction.guild_id
    );

  let text =
    `💧 **TREE WATERED!**\n\n` +
    `🌱 +${EXP_PER_WATER} EXP\n` +
    `⭐ Level: **${player.level}**\n` +
    `🌳 Height: **${getTreeHeight(player)} ft**`;

  if (levelUps > 0) {
    text +=
      `\n\n🎉 **LEVEL UP!**`;
  }

  if (
    player.sparklesOnTree.length > 0
  ) {
    text +=
      `\n✨ Sparkles are appearing on your tree!`;
  }

  if (chaos) {
    text +=
      `\n\n💥 A Werewives chaos event just happened!`;
  }

  return sendText(
    env,
    interaction,
    text
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

  updatePlayerIdentity(
    player,
    interaction
  );

  cleanExpiredSparkles(player);

  if (
    !player.sparklesOnTree.length
  ) {
    await savePlayer(
      env,
      userId,
      player
    );

    return sendText(
      env,
      interaction,
      `✨ There aren't any sparkles to catch right now!\n\n` +
        `💧 Water your tree and keep watching!`
    );
  }

  const sparkle =
    randomItem(
      player.sparklesOnTree
    );

  player.sparklesOnTree =
    player.sparklesOnTree.filter(
      item =>
        item.id !== sparkle.id
    );

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
    `✨ **SPARKLE CAUGHT!**\n\n` +
      `${sparkle.emoji} ${sparkle.name}\n` +
      `💖 **+${sparkle.value} sparkles!**\n\n` +
      `✨ You now have **${player.sparkles} ✨**`
  );
}

/* =========================================================
   CHAOS EVENTS
========================================================= */

async function maybeChaosEvent(
  env,
  guildId
) {
  if (!guildId) {
    return false;
  }

  if (
    Math.random() >
    CHAOS_EVENT_CHANCE
  ) {
    return false;
  }

  const state =
    await getGuildState(
      env,
      guildId
    );

  if (
    !state.announcementChannelId
  ) {
    return false;
  }

  const event =
    randomItem(
      WEREWIVES_EVENTS
    );

  const playerIds =
    await listAllPlayerKeys(
      env
    );

  let rewarded = 0;

  for (
    const playerId of playerIds
  ) {
    try {
      const player =
        await getPlayer(
          env,
          playerId
        );

      player.sparkles +=
        event.amount;

      await savePlayer(
        env,
        playerId,
        player
      );

      rewarded++;
    } catch (error) {
      console.error(
        "Chaos reward failed:",
        error
      );
    }
  }

  const message =
    `${event.message}\n\n` +
    `✨ **Everyone gets +${event.amount} sparkles!**\n` +
    `🎉 ${rewarded} players rewarded!`;

  try {
    await sendChannelMessage(
      env,
      state.announcementChannelId,
      message
    );
  } catch (error) {
    console.error(
      "Chaos announcement failed:",
      error
    );
  }

  return true;
}

/* =========================================================
   DAILY RIDDLE
========================================================= */

function getEasternDateParts(date) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    );

  const parts =
    formatter.formatToParts(date);

  const result = {};

  for (const part of parts) {
    result[part.type] =
      part.value;
  }

  return result;
}

function getEasternDateKey() {
  const parts =
    getEasternDateParts(
      new Date()
    );

  return (
    `${parts.year}-${parts.month}-${parts.day}`
  );
}

function getDailyRiddle() {
  const dateKey =
    getEasternDateKey();

  const numeric =
    Number(
      dateKey.replaceAll("-", "")
    );

  return {
    ...DAILY_RIDDLES[
      numeric %
        DAILY_RIDDLES.length
    ],
    day: dateKey
  };
}

function normalizeAnswer(answer) {
  return String(
    answer || ""
  )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s]/g,
      ""
    );
}

async function handleDailyRiddle(
  env,
  interaction,
  userId,
  answer
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  const riddle =
    getDailyRiddle();

  if (
    player.dailyRiddleDay !==
    riddle.day
  ) {
    player.dailyRiddleDay =
      riddle.day;

    player.dailyRiddleSolved =
      false;

    await savePlayer(
      env,
      userId,
      player
    );
  }

  if (
    player.dailyRiddleSolved
  ) {
    return sendText(
      env,
      interaction,
      `🧩 **Today's riddle is already solved!**\n\n` +
        `✨ You already collected today's reward.\n` +
        `Come back tomorrow for another one!`
    );
  }

  if (!answer) {
    return sendText(
      env,
      interaction,
      `🧩 **DAILY RIDDLE**\n\n` +
        `❓ ${riddle.question}\n\n` +
        `Use **/daily-riddle answer:** followed by your answer.\n\n` +
        `💖 Today's reward starts at **${
          100 +
          player.dailyRiddleWins * 5
        } sparkles!**`
    );
  }

  const normalized =
    normalizeAnswer(answer);

  const correct =
    riddle.answers.some(
      correctAnswer =>
        normalized ===
        normalizeAnswer(
          correctAnswer
        )
    );

  if (!correct) {
    return sendText(
      env,
      interaction,
      `❌ **Not quite!**\n\n` +
        `Try again! 🧩`
    );
  }

  const reward =
    100 +
    player.dailyRiddleWins * 5;

  player.sparkles += reward;
  player.dailyRiddleSolved =
    true;
  player.dailyRiddleWins++;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎉 **CORRECT!** 🎉\n\n` +
      `🧩 ${riddle.question}\n` +
      `💖 **+${reward} sparkles!**\n\n` +
      `✨ You now have **${player.sparkles} ✨**\n\n` +
      `🔥 Your next daily reward will be **${
        reward + 5
      } sparkles!**`
  );
}

/* =========================================================
   INVENTORY
========================================================= */

function inventoryName(id) {
  const names = {
    pink_sky_background:
      "🌸 Pink Sky Background",

    halloween_background:
      "🎃 Halloween Background",

    candyland_background:
      "🍬 Candy Land Background",

    cotton_candy_tree:
      "🍭 Cotton Candy Tree",

    pumpkin_cat_decoration:
      "🐱 Pumpkin Cat Decoration",

    panda_decoration:
      "🐼 Panda Decoration",

    cat_decoration:
      "🐱 Cat Decoration",

    stoned_birthday_tree:
      "🎂 Stoned Birthday Tree",

    stoned_balloon_decoration:
      "🎈 Stoned Birthday Balloon",

    stoned_birthday_background:
      "🎂 Stoned Birthday Background"
  };

  return (
    names[id] || id
  );
}

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

  updatePlayerIdentity(
    player,
    interaction
  );

  const items =
    player.inventory
      .map(inventoryName)
      .join("\n");

  return sendText(
    env,
    interaction,
    `🎒 **YOUR INVENTORY**\n\n` +
      `${items || "Nothing yet!"}\n\n` +
      `✨ Sparkles: **${player.sparkles}**`
  );
}

/* =========================================================
   CUSTOMIZE
========================================================= */

function customizeCategoryButtons() {
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: "🌌 Backgrounds",
          custom_id:
            "customize_backgrounds"
        },
        {
          type: 2,
          style: 1,
          label: "🌳 Trees",
          custom_id:
            "customize_trees"
        },
        {
          type: 2,
          style: 1,
          label: "🎀 Decorations",
          custom_id:
            "customize_decorations"
        }
      ]
    },
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label: "🌳 Back to Tree",
          custom_id: "tree"
        }
      ]
    }
  ];
}

async function handleCustomize(
  env,
  interaction,
  userId
) {
  return sendText(
    env,
    interaction,
    `🎀 **CUSTOMIZE YOUR TREE**\n\n` +
      `Choose what you want to change!`,
    customizeCategoryButtons()
  );
}

async function handleCustomizeCategory(
  env,
  interaction,
  userId,
  category
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    category ===
    "backgrounds"
  ) {
    const buttons = [];

    if (
      player.inventory.includes(
        "pink_sky_background"
      )
    ) {
      buttons.push({
        type: 2,
        style:
          player.equipped.theme ===
          "cherry"
            ? 3
            : 2,
        label: "🌸 Pink Sky",
        custom_id:
          "equip_theme_cherry"
      });
    }

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
            : 2,
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
        style:
          player.equipped.theme ===
          "candyland"
            ? 3
            : 2,
        label: "🍬 Candy Land",
        custom_id:
          "equip_theme_candyland"
      });
    }

    if (
      player.inventory.includes(
        "stoned_birthday_background"
      )
    ) {
      buttons.push({
        type: 2,
        style:
          player.equipped.theme ===
          "stoned_birthday"
            ? 3
            : 2,
        label:
          "🎂 Stoned Birthday",
        custom_id:
          "equip_theme_stoned_birthday"
      });
    }

    return sendText(
      env,
      interaction,
      `🌌 **YOUR BACKGROUNDS**`,
      [
        {
          type: 1,
          components:
            buttons.slice(0, 5)
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: "Back",
              custom_id:
                "customize"
            }
          ]
        }
      ]
    );
  }

  if (
    category === "trees"
  ) {
    const buttons = [];

    if (
      player.inventory.includes(
        "pink_sky_background"
      )
    ) {
      buttons.push({
        type: 2,
        style:
          player.equipped.tree ===
          "cherry"
            ? 3
            : 2,
        label: "🌸 Cherry Blossom",
        custom_id:
          "equip_tree_cherry"
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
            : 2,
        label:
          "🍭 Cotton Candy",
        custom_id:
          "equip_tree_cotton_candy"
      });
    }

    if (
      player.inventory.includes(
        "stoned_birthday_tree"
      )
    ) {
      buttons.push({
        type: 2,
        style:
          player.equipped.tree ===
          "stoned_birthday"
            ? 3
            : 2,
        label:
          "🎂 Stoned Birthday",
        custom_id:
          "equip_tree_stoned_birthday"
      });
    }

    return sendText(
      env,
      interaction,
      `🌳 **YOUR TREES**`,
      [
        {
          type: 1,
          components:
            buttons.slice(0, 5)
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: "Back",
              custom_id:
                "customize"
            }
          ]
        }
      ]
    );
  }

  const buttons = [];

  if (
    player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style:
        player.equipped.decoration ===
        "pumpkin_cat"
          ? 3
          : 2,
      label: "🐱 Pumpkin Cat",
      custom_id:
        "equip_decoration_pumpkin_cat"
    });
  }

  if (
    player.inventory.includes(
      "panda_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style:
        player.equipped.decoration ===
        "panda"
          ? 3
          : 2,
      label: "🐼 Panda",
      custom_id:
        "equip_decoration_panda"
    });
  }

  if (
    player.inventory.includes(
      "cat_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style:
        player.equipped.decoration ===
        "cat"
          ? 3
          : 2,
      label: "🐱 Cat",
      custom_id:
        "equip_decoration_cat"
    });
  }

  if (
    player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style:
        player.equipped.decoration ===
        "stoned_balloon"
          ? 3
          : 2,
      label:
        "🎈 Stoned Balloon",
      custom_id:
        "equip_decoration_stoned_balloon"
    });
  }

  buttons.push({
    type: 2,
    style: 2,
    label: "❌ Remove",
    custom_id:
      "unequip_decoration"
  });

  return sendText(
    env,
    interaction,
    `🎀 **YOUR DECORATIONS**`,
    [
      {
        type: 1,
        components:
          buttons.slice(0, 5)
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 2,
            label: "Back",
            custom_id:
              "customize"
          }
        ]
      }
    ]
  );
}

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

  const required = {
    cherry:
      "pink_sky_background",
    halloween:
      "halloween_background",
    candyland:
      "candyland_background",
    stoned_birthday:
      "stoned_birthday_background"
  }[theme];

  if (
    !player.inventory.includes(
      required
    )
  ) {
    return sendText(
      env,
      interaction,
      `❌ You don't own that background yet!`
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
    `🌌 **Background equipped!** ✨`
  );
}

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

  const required = {
    cherry:
      "pink_sky_background",
    cotton_candy:
      "cotton_candy_tree",
    stoned_birthday:
      "stoned_birthday_tree"
  }[tree];

  if (
    !player.inventory.includes(
      required
    )
  ) {
    return sendText(
      env,
      interaction,
      `❌ You don't own that tree yet!`
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
    `🌳 **Tree equipped!** 🌸`
  );
}

async function equipDecoration(
  env,
  interaction,
  userId,
  decoration
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  const required = {
    pumpkin_cat:
      "pumpkin_cat_decoration",
    panda:
      "panda_decoration",
    cat:
      "cat_decoration",
    stoned_balloon:
      "stoned_balloon_decoration"
  }[decoration];

  if (
    !player.inventory.includes(
      required
    )
  ) {
    return sendText(
      env,
      interaction,
      `❌ You don't own that decoration yet!`
    );
  }

  player.equipped.decoration =
    decoration;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎀 **Decoration equipped!** ✨`
  );
}

async function unequipDecoration(
  env,
  interaction,
  userId
) {
  const player =
    await getPlayer(
      env,
      userId
    );

  player.equipped.decoration =
    null;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `❌ Decoration removed from your tree.`
  );
}

/* =========================================================
   RENAME
========================================================= */

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

  const clean =
    String(name || "")
      .trim()
      .slice(0, 32);

  if (!clean) {
    return sendText(
      env,
      interaction,
      `❌ Please provide a name.`
    );
  }

  player.treeName =
    clean;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🌸 Your tree is now named **${clean}**!`
  );
}

/* =========================================================
   LEADERBOARD
========================================================= */

async function listAllPlayerKeys(
  env
) {
  const keys = [];
  let cursor;

  while (true) {
    const result =
      await env.TREE_DATA.list(
        cursor
          ? { cursor }
          : undefined
      );

    for (
      const key of result.keys
    ) {
      if (
        /^\d{15,25}$/.test(
          key.name
        )
      ) {
        keys.push(
          key.name
        );
      }
    }

    if (
      result.list_complete
    ) {
      break;
    }

    cursor =
      result.cursor;

    if (!cursor) {
      break;
    }
  }

  return keys;
}

async function handleLeaderboard(
  env,
  interaction
) {
  const keys =
    await listAllPlayerKeys(
      env
    );

  const players = [];

  for (
    const key of keys
  ) {
    try {
      const player =
        await getPlayer(
          env,
          key
        );

      players.push(player);
    } catch {}
  }

  players.sort(
    (a, b) =>
      b.sparkles - a.sparkles ||
      b.level - a.level ||
      getTreeHeight(b) -
        getTreeHeight(a)
  );

  const top =
    players.slice(0, 10);

  if (!top.length) {
    return sendText(
      env,
      interaction,
      `🏆 **TREE LEADERBOARD**\n\nNo players yet!`
    );
  }

  let text =
    `🏆 **WEREWIVES TREE LEADERBOARD**\n\n`;

  top.forEach(
    (player, index) => {
      const medal =
        [
          "🥇",
          "🥈",
          "🥉"
        ][index] ||
        `**${index + 1}.**`;

      text +=
        `${medal} **${
          player.displayName ||
          player.username ||
          "Werewife"
        }** — ` +
        `✨ ${player.sparkles} • ` +
        `⭐ Lv. ${player.level} • ` +
        `🌳 ${getTreeHeight(player)} ft\n`;
    }
  );

  return sendText(
    env,
    interaction,
    text
  );
}

/* =========================================================
   GIVE SPARKLES
========================================================= */

async function handleGiveSparkles(
  env,
  interaction,
  target,
  amount
) {
  const caller =
    interaction.member?.user?.id ||
    interaction.user?.id;

  if (
    caller !== env.OWNER_ID
  ) {
    return sendText(
      env,
      interaction,
      `❌ Owner only.`
    );
  }

  const numericAmount =
    Number(amount);

  if (
    !target ||
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    return sendText(
      env,
      interaction,
      `❌ Invalid user or amount.`
    );
  }

  const player =
    await getPlayer(
      env,
      target
    );

  player.sparkles +=
    Math.floor(
      numericAmount
    );

  await savePlayer(
    env,
    target,
    player
  );

  return sendText(
    env,
    interaction,
    `✨ Gave **${Math.floor(
      numericAmount
    )} sparkles** to <@${target}>!`
  );
}

/* =========================================================
   BIRTHDAY GIFT
========================================================= */

function birthdayGiftButtons() {
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: "🎁 Open Birthday Present",
          custom_id:
            "open_birthday_gift"
        }
      ]
    }
  ];
}

async function handleBirthday(
  env,
  interaction,
  userId,
  pin
) {
  if (
    String(pin || "")
      .trim()
      .toUpperCase() !==
    BIRTHDAY_PIN
  ) {
    return sendText(
      env,
      interaction,
      `❌ **Wrong PIN.**`
    );
  }

  const player =
    await getPlayer(
      env,
      userId
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  player.birthdayUnlocked =
    true;

  if (
    !player.inventory.includes(
      "stoned_birthday_tree"
    )
  ) {
    player.inventory.push(
      "stoned_birthday_tree"
    );
  }

  if (
    !player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    player.inventory.push(
      "stoned_balloon_decoration"
    );
  }

  if (
    !player.inventory.includes(
      "stoned_birthday_background"
    )
  ) {
    player.inventory.push(
      "stoned_birthday_background"
    );
  }

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎂🎉 **HAPPY BIRTHDAY, STONED!** 🎉🎂\n\n` +
      `🔓 Birthday items unlocked!\n\n` +
      `🌳 Stoned Birthday Tree\n` +
      `🎈 Stoned Birthday Balloon\n` +
      `🎂 Stoned Birthday Background\n\n` +
      `🎁 You also have a special present waiting!`,
    birthdayGiftButtons()
  );
}

async function openBirthdayGift(
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
    !player.birthdayUnlocked
  ) {
    return sendText(
      env,
      interaction,
      `❌ You haven't unlocked the birthday gift yet!`
    );
  }

  if (
    player.birthdayGiftClaimed
  ) {
    return sendText(
      env,
      interaction,
      `🎁 You already opened your birthday present! 💖`
    );
  }

  player.birthdayGiftClaimed =
    true;

  player.sparkles +=
    STONED_GIFT_SPARKLES;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎉🎁 **BIRTHDAY PRESENT OPENED!** 🎁🎉\n\n` +
      `✨ **+${STONED_GIFT_SPARKLES} sparkles!**\n\n` +
      `💖 You now have **${player.sparkles} ✨**`
  );
}

/* =========================================================
   GUILD STATE
========================================================= */

function guildStateKey(
  guildId
) {
  return `guild:${guildId}`;
}

async function getGuildState(
  env,
  guildId
) {
  const raw =
    await env.TREE_DATA.get(
      guildStateKey(guildId)
    );

  const base = {
    guildId,
    announcementChannelId:
      null,
    announcementChannelName:
      null,
    knownChannels: [],
    hunt: {
      active: false,
      startAt: 0,
      endAt: 0,
      nextGiftAt: 0,
      giftNumber: 0,
      currentGift: null
    }
  };

  if (!raw) {
    return base;
  }

  try {
    const parsed =
      JSON.parse(raw);

    return {
      ...base,
      ...parsed,
      hunt: {
        ...base.hunt,
        ...(parsed.hunt || {})
      }
    };
  } catch {
    return base;
  }
}

async function saveGuildState(
  env,
  guildId,
  state
) {
  await env.TREE_DATA.put(
    guildStateKey(guildId),
    JSON.stringify(state)
  );
}

async function rememberGuild(
  env,
  interaction
) {
  const guildId =
    interaction.guild_id;

  if (!guildId) {
    return;
  }

  const state =
    await getGuildState(
      env,
      guildId
    );

  await saveGuildState(
    env,
    guildId,
    state
  );
}

/* =========================================================
   DISCORD BOT REQUEST
========================================================= */

async function discordBotRequest(
  env,
  path,
  options = {}
) {
  const headers = new Headers(
    options.headers || {}
  );

  headers.set(
    "Authorization",
    `Bot ${env.BOT_TOKEN}`
  );

  return fetch(
    `https://discord.com/api/v10${path}`,
    {
      ...options,
      headers
    }
  );
}

/* =========================================================
   GET SERVER CHANNELS
========================================================= */

async function getGuildTextChannels(
  env,
  guildId
) {
  const response =
    await discordBotRequest(
      env,
      `/guilds/${guildId}/channels`,
      {
        method: "GET"
      }
    );

  if (!response.ok) {
    console.error(
      "Could not get guild channels:",
      response.status
    );

    return [];
  }

  const channels =
    await response.json();

  return channels.filter(
    channel =>
      channel.type === 0
  );
}

/* =========================================================
   /ANNOUNCEMENTS
========================================================= */

function hasAnnouncementPermission(
  interaction
) {
  const permissions =
    interaction.member?.permissions;

  if (!permissions) {
    return false;
  }

  try {
    const bits =
      BigInt(permissions);

    const ADMINISTRATOR =
      8n;

    const MANAGE_GUILD =
      32n;

    return (
      (bits &
        ADMINISTRATOR) !==
        0n ||
      (bits &
        MANAGE_GUILD) !==
        0n
    );
  } catch {
    return false;
  }
}

async function handleAnnouncements(
  env,
  interaction,
  channelId
) {
  if (
    !interaction.guild_id
  ) {
    return sendText(
      env,
      interaction,
      `❌ This command can only be used inside a server.`
    );
  }

  if (
    !hasAnnouncementPermission(
      interaction
    )
  ) {
    return sendText(
      env,
      interaction,
      `❌ You need **Manage Server** permission to choose the announcement channel.`
    );
  }

  const channels =
    await getGuildTextChannels(
      env,
      interaction.guild_id
    );

  const channel =
    channels.find(
      item =>
        item.id === channelId
    );

  if (!channel) {
    return sendText(
      env,
      interaction,
      `❌ I couldn't find that text channel. Make sure I can see it.`
    );
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  state.announcementChannelId =
    channel.id;

  state.announcementChannelName =
    channel.name;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

  return sendText(
    env,
    interaction,
    `📢 **Announcement channel set!**\n\n` +
      `Werewives chaos events and birthday hunt announcements will use <#${channel.id}>. 🎉`
  );
}

/* =========================================================
   CHANNEL MESSAGE
========================================================= */

async function sendChannelMessage(
  env,
  channelId,
  content,
  components = []
) {
  return discordBotRequest(
    env,
    `/channels/${channelId}/messages`,
    {
      method: "POST",
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
   HUNT GIFT BUTTON
========================================================= */

function huntGiftButton(
  giftId
) {
  return [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label:
            "🎁 Claim Present!",
          custom_id:
            `hunt_gift:${giftId}`
        }
      ]
    }
  ];
}

/* =========================================================
   CREATE HUNT GIFT
========================================================= */

function createHuntGift() {
  const isPrank =
    Math.random() < 0.25;

  const id =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2);

  if (isPrank) {
    return {
      id,
      type: "prank",
      amount: 0,
      message:
        randomItem(
          GIFT_HUNT_PRANKS
        ),
      claimed: false
    };
  }

  return {
    id,
    type: "sparkles",
    amount:
      randomItem(
        GIFT_HUNT_PRIZES
      ),
    message:
      `🎁 **BIRTHDAY GIFT FOUND!** 🎁\n\n` +
      `Someone hid a birthday present in the server!\n\n` +
      `🏃💨 **FIRST PERSON TO CLAIM IT GETS IT!**`,
    claimed: false
  };
}

/* =========================================================
   CLAIM HUNT GIFT
========================================================= */

async function claimHuntGift(
  env,
  interaction,
  userId,
  giftId
) {
  const guildId =
    interaction.guild_id;

  if (!guildId) {
    return sendText(
      env,
      interaction,
      `❌ Gift Hunt presents can only be claimed inside the server.`
    );
  }

  const state =
    await getGuildState(
      env,
      guildId
    );

  const gift =
    state.hunt?.currentGift;

  if (
    !state.hunt?.active
  ) {
    return sendText(
      env,
      interaction,
      `🎁 The Birthday Gift Hunt isn't active right now!`
    );
  }

  if (
    Date.now() >=
    state.hunt.endAt
  ) {
    return sendText(
      env,
      interaction,
      `⏰ The Birthday Gift Hunt has ended!`
    );
  }

  if (
    !gift ||
    gift.id !== giftId
  ) {
    return sendText(
      env,
      interaction,
      `🎁 That present has already disappeared!`
    );
  }

  if (gift.claimed) {
    return sendText(
      env,
      interaction,
      `🎁 Too late! Someone already grabbed this present!`
    );
  }

  gift.claimed = true;
  gift.claimedBy = userId;
  gift.claimedAt = Date.now();

  state.hunt.currentGift =
    gift;

  await saveGuildState(
    env,
    guildId,
    state
  );

  if (
    gift.type === "prank"
  ) {
    return sendText(
      env,
      interaction,
      `${gift.message}\n\n` +
        `🎁 **You got pranked!** 😂`
    );
  }

  const player =
    await getPlayer(
      env,
      userId
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  player.sparkles +=
    gift.amount;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,
    `🎉 **YOU GOT IT FIRST!** 🎉\n\n` +
      `🎁 Birthday present claimed!\n\n` +
      `💖 **+${gift.amount} sparkles!**\n` +
      `✨ You now have **${player.sparkles} ✨**`
  );
}

/* =========================================================
   BIRTHDAY HUNT ANNOUNCEMENT
========================================================= */

async function announceBirthdayHunt(
  env,
  guildId,
  channels
) {
  const announcement =
    `🎂🎉 **STONED'S BIRTHDAY GIFT HUNT IS LIVE!!!** 🎉🎂\n\n` +
    `🎁 Presents are going to be hidden around the server for the next **3 HOURS**!\n\n` +
    `🏃💨 Watch the channels because presents will appear throughout the event.\n` +
    `🥇 **FIRST PERSON TO CLICK THE CLAIM BUTTON WINS!**\n\n` +
    `💖 Some presents contain sparkles...\n` +
    `😂 Some are completely ridiculous.\n` +
    `👀 You never know what you're going to find.\n\n` +
    `⏰ **Gift Hunt: 4:00 PM – 7:00 PM Eastern**\n\n` +
    `🎂 HAPPY BIRTHDAY, STONED! 💖🎁`;

  for (
    const channel of channels
  ) {
    try {
      await sendChannelMessage(
        env,
        channel.id,
        announcement
      );
    } catch (error) {
      console.error(
        "Birthday announcement failed:",
        error
      );
    }
  }
}

/* =========================================================
   GET HUNT CHANNELS
========================================================= */

async function getHuntChannels(
  env,
  guildId
) {
  const state =
    await getGuildState(
      env,
      guildId
    );

  if (
    state.announcementChannelId
  ) {
    const response =
      await discordBotRequest(
        env,
        `/channels/${state.announcementChannelId}`,
        {
          method: "GET"
        }
      );

    if (response.ok) {
      const channel =
        await response.json();

      if (
        channel.type === 0
      ) {
        return [channel];
      }
    }
  }

  return getGuildTextChannels(
    env,
    guildId
  );
}

/* =========================================================
   RELEASE HUNT GIFT
========================================================= */

async function releaseHuntGift(
  env,
  guildId,
  channels,
  state
) {
  if (!channels.length) {
    return;
  }

  const channel =
    randomItem(channels);

  const gift =
    createHuntGift();

  state.hunt.giftNumber =
    (state.hunt.giftNumber || 0) +
    1;

  state.hunt.currentGift =
    gift;

  const content =
    gift.type === "prank"
      ? `🎁 **A MYSTERY PRESENT HAS APPEARED!**\n\n` +
        `👀 First person to open it gets to discover what's inside...`
      : gift.message;

  const response =
    await sendChannelMessage(
      env,
      channel.id,
      content,
      huntGiftButton(
        gift.id
      )
    );

  if (!response.ok) {
    console.error(
      "Could not send hunt gift:",
      response.status
    );

    return;
  }

  state.hunt.nextGiftAt =
    Date.now() +
    randomInt(
      GIFT_HUNT_MIN_INTERVAL,
      GIFT_HUNT_MAX_INTERVAL
    );

  await saveGuildState(
    env,
    guildId,
    state
  );
}

/* =========================================================
   GET KNOWN GUILDS
========================================================= */

async function getKnownGuildIds(
  env
) {
  const guildIds = [];
  let cursor;

  while (true) {
    const result =
      await env.TREE_DATA.list(
        cursor
          ? { cursor }
          : undefined
      );

    for (
      const key of result.keys
    ) {
      if (
        key.name.startsWith(
          "guild:"
        )
      ) {
        guildIds.push(
          key.name.slice(6)
        );
      }
    }

    if (
      result.list_complete
    ) {
      break;
    }

    cursor =
      result.cursor;

    if (!cursor) {
      break;
    }
  }

  return guildIds;
}

/* =========================================================
   BIRTHDAY EVENT SCHEDULER
========================================================= */

async function processBirthdayEvent(
  env
) {
  const now =
    new Date();

  const eastern =
    getEasternDateParts(
      now
    );

  const dateKey =
    `${eastern.year}-${eastern.month}-${eastern.day}`;

  if (
    dateKey !==
    BIRTHDAY_EVENT_DATE
  ) {
    return;
  }

  const hour =
    Number(eastern.hour);

  const minute =
    Number(eastern.minute);

  const currentMinutes =
    hour * 60 + minute;

  const startMinutes =
    BIRTHDAY_START_HOUR * 60;

  const endMinutes =
    BIRTHDAY_END_HOUR * 60;

  const guildIds =
    await getKnownGuildIds(
      env
    );

  /* -------------------------------------------------------
     START HUNT
  ------------------------------------------------------- */

  if (
    currentMinutes >=
      startMinutes &&
    currentMinutes <
      endMinutes
  ) {
    for (
      const guildId of guildIds
    ) {
      const state =
        await getGuildState(
          env,
          guildId
        );

      if (
        !state.hunt.active
      ) {
        const channels =
          await getHuntChannels(
            env,
            guildId
          );

        if (!channels.length) {
          continue;
        }

        const minutesUntilEnd =
          endMinutes -
          currentMinutes;

        state.hunt = {
          active: true,
          startAt:
            now.getTime(),
          endAt:
            now.getTime() +
            minutesUntilEnd *
              60 *
              1000,
          nextGiftAt:
            now.getTime() +
            randomInt(
              2 * 60 * 1000,
              5 * 60 * 1000
            ),
          giftNumber: 0,
          currentGift: null
        };

        await saveGuildState(
          env,
          guildId,
          state
        );

        await announceBirthdayHunt(
          env,
          guildId,
          channels
        );
      }
    }
  }

  /* -------------------------------------------------------
     RELEASE GIFTS / END HUNT
  ------------------------------------------------------- */

  for (
    const guildId of guildIds
  ) {
    const state =
      await getGuildState(
        env,
        guildId
      );

    if (
      !state.hunt?.active
    ) {
      continue;
    }

    if (
      Date.now() >=
      state.hunt.endAt
    ) {
      state.hunt.active =
        false;

      state.hunt.currentGift =
        null;

      await saveGuildState(
        env,
        guildId,
        state
      );

      if (
        state.announcementChannelId
      ) {
        try {
          await sendChannelMessage(
            env,
            state.announcementChannelId,
            `🎂 **STONED'S BIRTHDAY GIFT HUNT HAS ENDED!** 🎂\n\n` +
              `🎁 Thanks for playing!\n` +
              `💖 Hope everyone had fun! ✨`
          );
        } catch {}
      }

      continue;
    }

    if (
      Date.now() >=
      state.hunt.nextGiftAt
    ) {
      const channels =
        await getHuntChannels(
          env,
          guildId
        );

      await releaseHuntGift(
        env,
        guildId,
        channels,
        state
      );
    }
  }
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

  const acknowledged =
    await acknowledge(
      env,
      interaction
    );

  if (
    !acknowledged.ok
  ) {
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

  updatePlayerIdentity(
    player,
    interaction
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

  await rememberGuild(
    env,
    interaction
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
          components:
            treeButtons()
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

  await rememberGuild(
    env,
    interaction
  );

  if (
    customId?.startsWith(
      "hunt_gift:"
    )
  ) {
    return claimHuntGift(
      env,
      interaction,
      userId,
      customId.slice(
        "hunt_gift:".length
      )
    );
  }

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

    case "daily_riddle":
      return handleDailyRiddle(
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

    case "shop_decorations":
      return handleShopCategory(
        env,
        interaction,
        "decorations"
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

    case "buy_pumpkin_cat":
      return buyPumpkinCat(
        env,
        interaction,
        userId
      );

    case "buy_panda":
      return buyPanda(
        env,
        interaction,
        userId
      );

    case "buy_cat":
      return buyCat(
        env,
        interaction,
        userId
      );

    case "buy_cherry_tree":
      return sendText(
        env,
        interaction,
        `🌸 You already have the Cherry Blossom tree!`
      );

    case "buy_pink_sky":
      return sendText(
        env,
        interaction,
        `🌸 You already have the Pink Sky background!`
      );

    case "customize":
      return handleCustomize(
        env,
        interaction,
        userId
      );

    case "customize_backgrounds":
      return handleCustomizeCategory(
        env,
        interaction,
        userId,
        "backgrounds"
      );

    case "customize_trees":
      return handleCustomizeCategory(
        env,
        interaction,
        userId,
        "trees"
      );

    case "customize_decorations":
      return handleCustomizeCategory(
        env,
        interaction,
        userId,
        "decorations"
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

    case "equip_theme_stoned_birthday":
      return equipTheme(
        env,
        interaction,
        userId,
        "stoned_birthday"
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

    case "equip_tree_stoned_birthday":
      return equipTree(
        env,
        interaction,
        userId,
        "stoned_birthday"
      );

    case "equip_decoration_pumpkin_cat":
      return equipDecoration(
        env,
        interaction,
        userId,
        "pumpkin_cat"
      );

    case "equip_decoration_panda":
      return equipDecoration(
        env,
        interaction,
        userId,
        "panda"
      );

    case "equip_decoration_cat":
      return equipDecoration(
        env,
        interaction,
        userId,
        "cat"
      );

    case "equip_decoration_stoned_balloon":
      return equipDecoration(
        env,
        interaction,
        userId,
        "stoned_balloon"
      );

    case "unequip_decoration":
      return unequipDecoration(
        env,
        interaction,
        userId
      );

    case "open_birthday_gift":
      return openBirthdayGift(
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

    default:
      return sendText(
        env,
        interaction,
        `❌ Unknown button.`
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

  await rememberGuild(
    env,
    interaction
  );

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

    case "daily-riddle": {
      const answer =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "answer"
        )?.value;

      return handleDailyRiddle(
        env,
        interaction,
        userId,
        answer
      );
    }

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

    case "birthday": {
      const pin =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "pin"
        )?.value;

      return handleBirthday(
        env,
        interaction,
        userId,
        pin
      );
    }

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

    case "announcements": {
      const channelId =
        interaction.data?.options?.find(
          option =>
            option.name ===
            "channel"
        )?.value;

      return handleAnnouncements(
        env,
        interaction,
        channelId
      );
    }

    default:
      return sendText(
        env,
        interaction,
        `❌ Unknown command.`
      );
  }
}

/* =========================================================
   SIGNATURE VERIFICATION
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
    name: "daily-riddle",
    description:
      "Solve today's riddle for sparkles",
    options: [
      {
        type: 3,
        name: "answer",
        description:
          "Your answer to today's riddle",
        required: false
      }
    ]
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
    name: "birthday",
    description:
      "Unlock a special birthday gift",
    options: [
      {
        type: 3,
        name: "pin",
        description:
          "Enter the birthday PIN",
        required: true
      }
    ]
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
    name: "give-sparkles",
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
  },
  {
    name: "announcements",
    description:
      "Choose the server channel for Werewives announcements",
    options: [
      {
        type: 7,
        name: "channel",
        description:
          "Channel where chaos and event announcements should appear",
        required: true,
        channel_types: [0]
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
          Authorization:
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

    /* -----------------------------------------------------
       HEALTH CHECK
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       COMMAND REGISTRATION
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       DISCORD INTERACTIONS
    ----------------------------------------------------- */

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
          JSON.parse(body);
      } catch {
        return new Response(
          "Invalid JSON",
          {
            status: 400
          }
        );
      }

      /* ---------------------------------------------------
         PING
      --------------------------------------------------- */

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

      /* ---------------------------------------------------
         SLASH COMMAND
      --------------------------------------------------- */

      if (
        interaction.type === 2
      ) {
        return handleCommand(
          env,
          interaction
        );
      }

      /* ---------------------------------------------------
         BUTTON / COMPONENT
      --------------------------------------------------- */

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
  },

  /* =======================================================
     CLOUDFLARE CRON
  ======================================================= */

  async scheduled(
    event,
    env,
    ctx
  ) {
    ctx.waitUntil(
      processBirthdayEvent(
        env
      )
    );
  }
};p
