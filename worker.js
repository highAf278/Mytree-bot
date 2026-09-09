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

/*
  ONE-TIME STONED BIRTHDAY EVENT

  Tomorrow from the current date:
  September 10, 2026

  4:00 PM Eastern -> 7:00 PM Eastern

  The Worker cron runs every minute and checks
  Eastern time before starting/continuing the event.
*/

const BIRTHDAY_EVENT_DATE = "2026-09-10";
const BIRTHDAY_START_HOUR = 16;
const BIRTHDAY_END_HOUR = 19;

const BIRTHDAY_PIN = "LOVE";

const STONED_TREE_IMAGE = "IMG_7283.png";
const STONED_BALLOON_IMAGE = "IMG_7277.png";
const STONED_BACKGROUND = "IMG_7275.jpeg";

const STONED_GIFT_SPARKLES = 300;

/*
  Gift hunt timing.

  A gift is released roughly every 8–12 minutes,
  with some random variation so people cannot
  predict exactly when the next one appears.

  3 hours = plenty of gifts without flooding chat.
*/

const GIFT_HUNT_MIN_INTERVAL = 8 * 60 * 1000;
const GIFT_HUNT_MAX_INTERVAL = 12 * 60 * 1000;

const GIFT_HUNT_DURATION = 3 * 60 * 60 * 1000;

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

/* =========================================================
   DECORATIONS
========================================================= */

const PUMPKIN_CAT_IMAGE = "IMG_7272.png";
const PUMPKIN_CAT_PRICE = 250;

/* =========================================================
   R2
========================================================= */

const R2_BASE =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

/* =========================================================
   TREE POSITION
========================================================= */

/*
  Tree is centered and moved far down.

  The tree remains fully inside the 1024x1024 image.
*/

const TREE_TOP_POSITION = 78;

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

const WEREWIVES_EVENTS = [
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
   DAILY RIDDLES
========================================================= */

const DAILY_RIDDLES = [
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I have keys but open no locks.\n" +
      "I have space but no room.\n" +
      "You can enter, but you cannot go inside.\n\n" +
      "What am I?",
    answers: ["keyboard"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "The more you take away from me,\n" +
      "the bigger I become.\n\n" +
      "What am I?",
    answers: ["hole"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I have hands but cannot clap.\n\n" +
      "What am I?",
    answers: ["clock"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I get wetter the more I dry.\n\n" +
      "What am I?",
    answers: ["towel"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I have one eye but cannot see.\n\n" +
      "What am I?",
    answers: ["needle"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I can travel around the world while staying in one corner.\n\n" +
      "What am I?",
    answers: ["stamp"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "I have a neck but no head.\n\n" +
      "What am I?",
    answers: ["bottle"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "What has many teeth but cannot bite?",
    answers: ["comb"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "What has words but never speaks?",
    answers: ["book"]
  },
  {
    riddle:
      "🧩 **DAILY RIDDLE**\n\n" +
      "What goes up but never comes down?",
    answers: ["age"]
  }
];

/* =========================================================
   BIRTHDAY GIFT HUNT PRIZES
========================================================= */

const GIFT_HUNT_PRIZES = [
  25,
  25,
  50,
  50,
  75,
  75,
  100,
  100,
  125,
  150,
  150,
  200,
  250,
  300
];

const GIFT_HUNT_PRANKS = [
  "😂 **PRANK GIFT!**\n\nYou opened it...\n\n🎁 It was just an aggressively folded napkin.\n\n✨ **0 sparkles.**",

  "🧦 **PRANK GIFT!**\n\n🎁 Congratulations! You won...\n\n**ONE MYSTERIOUS SOCK.**\n\nIt has no mate.",

  "🧀 **PRANK GIFT!**\n\nThe cheese was inside.\n\nThe cheese has escaped.\n\nYou received **0 ✨**.",

  "🦝 **PRANK GIFT!**\n\nA raccoon immediately stole the present.\n\nYou got nothing.\n\nThe raccoon seems pleased.",

  "🎁 **PRANK GIFT!**\n\nYou found an empty box.\n\nThere is a note inside:\n\n*\"lol.\"*",

  "💀 **PRANK GIFT!**\n\nYou found a coupon for **one free high five**.\n\nUnfortunately, the coupon expired 4 seconds ago.",

  "🎃 **PRANK GIFT!**\n\nA pumpkin stared at you.\n\nYou stared back.\n\nNobody won.",

  "🐺 **PRANK GIFT!**\n\nThe werewolf pack investigated the present.\n\nThey found absolutely nothing."
];

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
   PLAYER REPAIR
========================================================= */

function repairPlayer(player) {
  const fresh = defaultPlayer();

  if (!player || typeof player !== "object") {
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

  repaired.level =
    Math.max(
      1,
      Number(repaired.level) || 1
    );

  repaired.exp =
    Math.max(
      0,
      Number(repaired.exp) || 0
    );

  repaired.sparkles =
    Math.max(
      0,
      Number(repaired.sparkles) || 0
    );

  repaired.lastWater =
    Number(repaired.lastWater) || 0;

  if (!Array.isArray(repaired.sparklesOnTree)) {
    repaired.sparklesOnTree = [];
  }

  if (!Array.isArray(repaired.inventory)) {
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

  if (!Array.isArray(repaired.claimedLevelRewards)) {
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
    repaired.equipped.theme !== "candyland" &&
    repaired.equipped.theme !== "stoned_birthday"
  ) {
    repaired.equipped.theme = "cherry";
  }

  if (
    repaired.equipped.tree !== "cherry" &&
    repaired.equipped.tree !== "cotton_candy" &&
    repaired.equipped.tree !== "stoned_birthday"
  ) {
    repaired.equipped.tree = "cherry";
  }

  if (
    repaired.equipped.decoration !== null &&
    repaired.equipped.decoration !== "pumpkin_cat" &&
    repaired.equipped.decoration !== "stoned_balloon"
  ) {
    repaired.equipped.decoration = null;
  }

  repaired.userId =
    repaired.userId || "";

  repaired.username =
    repaired.username || "";

  repaired.displayName =
    repaired.displayName || "";

  repaired.dailyRiddleDay =
    repaired.dailyRiddleDay || "";

  repaired.dailyRiddleSolved =
    Boolean(repaired.dailyRiddleSolved);

  repaired.dailyRiddleWins =
    Math.max(
      0,
      Number(repaired.dailyRiddleWins) || 0
    );

  repaired.birthdayUnlocked =
    Boolean(repaired.birthdayUnlocked);

  repaired.birthdayGiftClaimed =
    Boolean(repaired.birthdayGiftClaimed);

  return repaired;
}

/* =========================================================
   DATABASE
========================================================= */

async function getPlayer(env, userId) {
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
   IDENTITY
========================================================= */

function updatePlayerIdentity(
  player,
  interaction
) {
  const user =
    interaction.member?.user ||
    interaction.user;

  if (!user) {
    return;
  }

  player.userId =
    user.id ||
    player.userId ||
    "";

  player.username =
    user.username ||
    player.username ||
    "";

  player.displayName =
    interaction.member?.nick ||
    user.global_name ||
    user.username ||
    player.displayName ||
    "Werewife";
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
      LEVEL_REWARDS[player.level]
    ) {
      const reward =
        LEVEL_REWARDS[player.level];

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
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}

function randomItem(
  array
) {
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
  const now =
    Date.now();

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

    x: randomInt(30, 70),
    y: randomInt(55, 84),

    emoji: type.emoji,
    name: type.name,
    value: type.value,

    createdAt:
      Date.now()
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
   CHAOS
========================================================= */

function maybeChaosEvent(
  player
) {
  if (
    Math.random() >
    0.20
  ) {
    return null;
  }

  const event =
    randomItem(
      WEREWIVES_EVENTS
    );

  const amount =
    Number(event.amount) ||
    0;

  const before =
    player.sparkles;

  player.sparkles =
    Math.max(
      0,
      player.sparkles +
        amount
    );

  const actualChange =
    player.sparkles -
    before;

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

  if (
    theme ===
    "stoned_birthday"
  ) {
    return (
      R2_BASE +
      STONED_BACKGROUND
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
    tree ===
    "cotton_candy"
  ) {
    return (
      R2_BASE +
      COTTON_CANDY_TREE
    );
  }

  if (
    tree ===
    "stoned_birthday"
  ) {
    return (
      R2_BASE +
      STONED_TREE_IMAGE
    );
  }

  return (
    R2_BASE +
    TREE_IMAGE
  );
}

/* =========================================================
   DECORATION
========================================================= */

function getDecorationImage(
  player
) {
  const decoration =
    player.equipped?.decoration;

  if (
    decoration ===
    "pumpkin_cat"
  ) {
    return (
      R2_BASE +
      PUMPKIN_CAT_IMAGE
    );
  }

  if (
    decoration ===
    "stoned_balloon"
  ) {
    return (
      R2_BASE +
      STONED_BALLOON_IMAGE
    );
  }

  return null;
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
      getBackground(
        player
      );

    const treeUrl =
      getTreeImage(
        player
      );

    const decorationUrl =
      getDecorationImage(
        player
      );

    const decorationHtml =
      decorationUrl
        ? `
          <img
            class="decoration"
            src="${decorationUrl}"
          />
        `
        : "";

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

          /*
            TREE

            Centered horizontally.
            Farther down the scene.
            Large enough to be the main focus.
            Still fully inside the image.
          */

          .tree {
            position: absolute;

            left: 50%;
            top: ${TREE_TOP_POSITION}%;

            transform:
              translate(-50%, -50%);

            width: 36%;
            height: 36%;

            object-fit: contain;

            z-index: 5;
          }

          /*
            DECORATION

            Much larger than before.

            It is intentionally placed
            well to the LEFT of the tree,
            but not against the edge.

            It is about half the tree width,
            making it noticeably smaller
            than the tree while still
            looking like a major decoration.
          */

          .decoration {
            position: absolute;

            left: 23%;
            top: 80%;

            transform:
              translate(-50%, -50%);

            width: 28%;
            height: 28%;

            object-fit: contain;

            z-index: 6;
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

          ${decorationHtml}

          ${sparkleHtml}

        </div>
      </body>
      </html>
    `;

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
   TREE HEIGHT
========================================================= */

function getTreeHeight(
  player
) {
  return Math.max(
    1,
    Number(player.level) || 1
  );
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

  const height =
    getTreeHeight(
      player
    );

  return (
    `🌸 **${player.treeName}**\n\n` +
    `🌱 Level: **${player.level}**\n` +
    `🌳 Height: **${height} ft**\n` +
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
        label: "🧩 Daily Riddle",
        custom_id:
          "daily_riddle"
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
        custom_id:
          "customize"
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
   SEND TREE
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
        type:
          "image/png"
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
          filename:
            "tree.png"
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
   SHOP
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
        custom_id:
          "tree"
      }
    ]
  };
}

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
        custom_id:
          "shop"
      }
    ]
  };
}

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
        custom_id:
          "shop"
      }
    ]
  };
}

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

function limitedHalloweenButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 4,
        label:
          `🎃 Halloween — ${HALLOWEEN_PRICE} ✨`,
        custom_id:
          "buy_halloween"
      },
      {
        type: 2,
        style: 1,
        label:
          `🐱 Pumpkin Cat — ${PUMPKIN_CAT_PRICE} ✨`,
        custom_id:
          "buy_pumpkin_cat"
      },
      {
        type: 2,
        style: 2,
        label:
          "⬅️ Limited Shop",
        custom_id:
          "limited_shop"
      }
    ]
  };
}

function limitedSpecialButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label:
          "⭐ Coming Soon",
        custom_id:
          "limited_coming_soon"
      },
      {
        type: 2,
        style: 2,
        label:
          "⬅️ Limited Shop",
        custom_id:
          "limited_shop"
      }
    ]
  };
}

function limitedHolidayButtons() {
  return {
    type: 1,

    components: [
      {
        type: 2,
        style: 2,
        label:
          "🎁 Coming Soon",
        custom_id:
          "limited_coming_soon"
      },
      {
        type: 2,
        style: 2,
        label:
          "⬅️ Limited Shop",
        custom_id:
          "limited_shop"
      }
    ]
  };
}

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
    category ===
    "backgrounds"
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
    category ===
    "halloween"
  ) {
    return sendText(
      env,
      interaction,

      `🎃 **HALLOWEEN LIMITED SHOP**\n\n` +
      `👻 Spooky season has arrived!\n\n` +
      `🎃 Halloween Background — **${HALLOWEEN_PRICE} ✨**\n` +
      `🐱 Pumpkin Cat Decoration — **${PUMPKIN_CAT_PRICE} ✨**\n\n` +
      `⏳ *Limited-time items*`,

      [
        limitedHalloweenButtons()
      ]
    );
  }

  if (
    category ===
    "special"
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

  updatePlayerIdentity(
    player,
    interaction
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

  updatePlayerIdentity(
    player,
    interaction
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

  updatePlayerIdentity(
    player,
    interaction
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
   BUY PUMPKIN CAT
========================================================= */

async function buyPumpkinCat(
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

  if (
    player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    return sendText(
      env,
      interaction,
      "🐱 You already own the Pumpkin Cat decoration!"
    );
  }

  if (
    player.sparkles <
    PUMPKIN_CAT_PRICE
  ) {
    return sendText(
      env,
      interaction,

      `❌ You need **${PUMPKIN_CAT_PRICE} ✨** to buy this.\n` +
      `You have **${player.sparkles} ✨**.`
    );
  }

  player.sparkles -=
    PUMPKIN_CAT_PRICE;

  player.inventory.push(
    "pumpkin_cat_decoration"
  );

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    "🐱🎃 **Pumpkin Cat purchased!**\n\n" +
    "Use `/customize` → **Decorations** to equip it!"
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

  const now =
    Date.now();

  if (
    now -
      player.lastWater <
    WATER_COOLDOWN
  ) {
    const remaining =
      WATER_COOLDOWN -
      (now -
        player.lastWater);

    const minutes =
      Math.ceil(
        remaining /
          60000
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

  updatePlayerIdentity(
    player,
    interaction
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
   DAILY RIDDLE HELPERS
========================================================= */

function getEasternDateParts(
  date = new Date()
) {
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
    formatter.formatToParts(
      date
    );

  const result = {};

  for (
    const part of parts
  ) {
    if (
      part.type !==
      "literal"
    ) {
      result[part.type] =
        part.value;
    }
  }

  return result;
}

function getEasternDateKey(
  date = new Date()
) {
  const parts =
    getEasternDateParts(
      date
    );

  return (
    `${parts.year}-${parts.month}-${parts.day}`
  );
}

function getDailyRiddle(
  dateKey
) {
  let total = 0;

  for (
    let i = 0;
    i < dateKey.length;
    i++
  ) {
    total =
      (total * 31 +
        dateKey.charCodeAt(i)) %
      DAILY_RIDDLES.length;
  }

  return DAILY_RIDDLES[
    total
  ];
}

function normalizeAnswer(
  answer
) {
  return String(
    answer || ""
  )
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9 ]/g,
      ""
    )
    .replace(
      /\s+/g,
      " "
    );
}

/* =========================================================
   DAILY RIDDLE
========================================================= */

async function handleDailyRiddle(
  env,
  interaction,
  userId,
  suppliedAnswer
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

  const dateKey =
    getEasternDateKey();

  if (
    player.dailyRiddleDay !==
    dateKey
  ) {
    player.dailyRiddleDay =
      dateKey;

    player.dailyRiddleSolved =
      false;
  }

  const riddle =
    getDailyRiddle(
      dateKey
    );

  if (
    player.dailyRiddleSolved
  ) {
    await savePlayer(
      env,
      userId,
      player
    );

    return sendText(
      env,
      interaction,

      `🧩 **Today's riddle is already solved!**\n\n` +
      `🎉 You already claimed today's reward.\n` +
      `✨ Come back tomorrow for a new riddle!`
    );
  }

  if (
    suppliedAnswer ===
    undefined ||
    suppliedAnswer ===
    null ||
    String(
      suppliedAnswer
    ).trim() === ""
  ) {
    await savePlayer(
      env,
      userId,
      player
    );

    return sendText(
      env,
      interaction,

      `${riddle.riddle}\n\n` +
      `💡 Submit your answer with:\n` +
      `**/daily-riddle answer:YOUR ANSWER**\n\n` +
      `💖 The first correct answer is worth **100 ✨**!\n` +
      `✨ Every future correct daily riddle increases your reward by **5 ✨**.`
    );
  }

  const answer =
    normalizeAnswer(
      suppliedAnswer
    );

  const correct =
    riddle.answers.some(
      possible =>
        normalizeAnswer(
          possible
        ) === answer
    );

  if (!correct) {
    await savePlayer(
      env,
      userId,
      player
    );

    return sendText(
      env,
      interaction,

      `❌ **Not quite!**\n\n` +
      `🧩 The riddle is still waiting for you.\n` +
      `Try another answer with **/daily-riddle**.`
    );
  }

  const reward =
    100 +
    player.dailyRiddleWins *
      5;

  player.sparkles +=
    reward;

  player.dailyRiddleWins++;

  player.dailyRiddleSolved =
    true;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🎉🎉 **CORRECT!** 🎉🎉\n\n` +
    `🧩 You solved today's riddle!\n\n` +
    `💖 **+${reward} sparkles!**\n` +
    `✨ You now have **${player.sparkles} ✨**\n\n` +
    `🔥 Your next correct daily riddle will be worth **${100 + player.dailyRiddleWins * 5} ✨**!`
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

  updatePlayerIdentity(
    player,
    interaction
  );

  await savePlayer(
    env,
    userId,
    player
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

  if (
    player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    items.push(
      "🐱🎃 Pumpkin Cat Decoration"
    );
  }

  if (
    player.inventory.includes(
      "stoned_birthday_tree"
    )
  ) {
    items.push(
      "🌳🎂 Stoned's Birthday Tree"
    );
  }

  if (
    player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    items.push(
      "🎈 Stoned's Balloon Decoration"
    );
  }

  if (
    player.inventory.includes(
      "stoned_birthday_background"
    )
  ) {
    items.push(
      "🎂 Stoned's Birthday Background"
    );
  }

  return sendText(
    env,
    interaction,

    `🎒 **Your Inventory**\n\n` +
    (
      items.length
        ? items.join(
            "\n"
          )
        : "Nothing yet!"
    ) +
    `\n\n💖 Sparkles: **${player.sparkles} ✨**`
  );
}

/* =========================================================
   CUSTOMIZE MAIN CATEGORIES
========================================================= */

function customizeCategoryButtons() {
  return [
    {
      type: 1,

      components: [
        {
          type: 2,
          style: 2,
          label:
            "🌌 Backgrounds",
          custom_id:
            "customize_backgrounds"
        },
        {
          type: 2,
          style: 2,
          label:
            "🌳 Trees",
          custom_id:
            "customize_trees"
        },
        {
          type: 2,
          style: 1,
          label:
            "🎀 Decorations",
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
          label:
            "🌳 Back to Tree",
          custom_id:
            "tree"
        }
      ]
    }
  ];
}

/* =========================================================
   CUSTOMIZE BACKGROUNDS
========================================================= */

function customizeBackgroundButtons(
  player
) {
  const buttons = [
    {
      type: 2,
      style: 1,
      label:
        "🌸 Pink Sky",
      custom_id:
        "equip_theme_cherry"
    }
  ];

  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
      label:
        "🎃 Halloween",
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
      label:
        "🍭 Candy Land",
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
      style: 1,
      label:
        "🎂 Stoned's Birthday",
      custom_id:
        "equip_theme_stoned_birthday"
    });
  }

  return [
    {
      type: 1,
      components:
        buttons.slice(
          0,
          5
        )
    },

    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label:
            "⬅️ Categories",
          custom_id:
            "customize"
        }
      ]
    }
  ];
}

/* =========================================================
   CUSTOMIZE TREES
========================================================= */

function customizeTreeButtons(
  player
) {
  const buttons = [
    {
      type: 2,
      style: 1,
      label:
        "🌸 Cherry Tree",
      custom_id:
        "equip_tree_cherry"
    }
  ];

  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
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
      style: 1,
      label:
        "🎂 Stoned's Tree",
      custom_id:
        "equip_tree_stoned_birthday"
    });
  }

  return [
    {
      type: 1,
      components:
        buttons.slice(
          0,
          5
        )
    },

    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label:
            "⬅️ Categories",
          custom_id:
            "customize"
        }
      ]
    }
  ];
}

/* =========================================================
   CUSTOMIZE DECORATIONS
========================================================= */

function customizeDecorationButtons(
  player
) {
  const buttons = [];

  if (
    player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
      label:
        "🐱🎃 Pumpkin Cat",
      custom_id:
        "equip_decoration_pumpkin_cat"
    });
  }

  if (
    player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    buttons.push({
      type: 2,
      style: 1,
      label:
        "🎈 Stoned's Balloon",
      custom_id:
        "equip_decoration_stoned_balloon"
    });
  }

  buttons.push({
    type: 2,
    style: 2,
    label:
      "❌ Remove Decoration",
    custom_id:
      "unequip_decoration"
  });

  return [
    {
      type: 1,
      components:
        buttons.slice(
          0,
          5
        )
    },

    {
      type: 1,
      components: [
        {
          type: 2,
          style: 2,
          label:
            "⬅️ Categories",
          custom_id:
            "customize"
        }
      ]
    }
  ];
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

  updatePlayerIdentity(
    player,
    interaction
  );

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🎀 **Customize Your Tree**\n\n` +
    `Choose a category!\n\n` +
    `🌌 Backgrounds\n` +
    `🌳 Trees\n` +
    `🎀 Decorations`,

    customizeCategoryButtons()
  );
}

/* =========================================================
   CUSTOMIZE CATEGORY
========================================================= */

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
    return sendText(
      env,
      interaction,

      `🌌 **CUSTOMIZE — BACKGROUNDS**\n\n` +
      `Choose your background:`,

      customizeBackgroundButtons(
        player
      )
    );
  }

  if (
    category ===
    "trees"
  ) {
    return sendText(
      env,
      interaction,

      `🌳 **CUSTOMIZE — TREES**\n\n` +
      `Choose your tree:`,

      customizeTreeButtons(
        player
      )
    );
  }

  return sendText(
    env,
    interaction,

    `🎀 **CUSTOMIZE — DECORATIONS**\n\n` +
    `Choose your decoration:`,

    customizeDecorationButtons(
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

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    theme ===
    "halloween" &&
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
    theme ===
    "candyland" &&
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

  if (
    theme ===
    "stoned_birthday" &&
    !player.inventory.includes(
      "stoned_birthday_background"
    )
  ) {
    return sendText(
      env,
      interaction,
      "❌ You don't own Stoned's Birthday background yet!"
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

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    tree ===
    "cotton_candy" &&
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

  if (
    tree ===
    "stoned_birthday" &&
    !player.inventory.includes(
      "stoned_birthday_tree"
    )
  ) {
    return sendText(
      env,
      interaction,
      "❌ You don't own Stoned's Birthday Tree yet!"
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
   EQUIP DECORATION
========================================================= */

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

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    decoration ===
    "pumpkin_cat" &&
    !player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    return sendText(
      env,
      interaction,
      "❌ You don't own Pumpkin Cat yet!"
    );
  }

  if (
    decoration ===
    "stoned_balloon" &&
    !player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    return sendText(
      env,
      interaction,
      "❌ You don't own Stoned's Balloon yet!"
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

    `🎀 Decoration equipped!`
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

  updatePlayerIdentity(
    player,
    interaction
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
    "🎀 Decoration removed!"
  );
}

/* =========================================================
   RENAME
========================================================= */

async function handleRename(
  env,
  interaction
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

  updatePlayerIdentity(
    player,
    interaction
  );

  const cleanName =
    String(
      name || ""
    )
      .trim()
      .slice(
        0,
        40
      );

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

async function listAllPlayerKeys(
  env
) {
  const keys = [];

  let cursor =
    undefined;

  while (true) {
    const options =
      cursor
        ? {
            cursor
          }
        : undefined;

    const result =
      await env.TREE_DATA.list(
        options
      );

    for (
      const key of
      result.keys
    ) {
      /*
        Player keys are Discord user IDs.

        Ignore anything else that may
        eventually be stored in KV.
      */

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
    const raw =
      await env.TREE_DATA.get(
        key
      );

    if (!raw) {
      continue;
    }

    try {
      const player =
        repairPlayer(
          JSON.parse(raw)
        );

      players.push({
        ...player,
        userId:
          player.userId ||
          key
      });
    } catch {
      // Ignore broken records.
    }
  }

  players.sort(
    (a, b) => {
      if (
        b.sparkles !==
        a.sparkles
      ) {
        return (
          b.sparkles -
          a.sparkles
        );
      }

      if (
        b.level !==
        a.level
      ) {
        return (
          b.level -
          a.level
        );
      }

      return (
        getTreeHeight(b) -
        getTreeHeight(a)
      );
    }
  );

  const top =
    players.slice(
      0,
      10
    );

  if (!top.length) {
    return sendText(
      env,
      interaction,

      "🏆 **Werewives Tree Leaderboard**\n\n" +
      "Nobody has a tree yet! 🌸"
    );
  }

  const lines =
    top.map(
      (
        player,
        index
      ) => {
        const name =
          player.displayName ||
          player.username ||
          player.treeName ||
          "Werewife";

        return (
          `**${index + 1}.** ${name}\n` +
          `🌱 Level ${player.level} • 🌳 ${getTreeHeight(player)} ft • 💖 ${player.sparkles} ✨`
        );
      }
    );

  return sendText(
    env,
    interaction,

    `🏆 **WEREWIVES TREE LEADERBOARD**\n\n` +
    lines.join(
      "\n\n"
    )
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
    callerId !==
    env.OWNER_ID
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
    !Number.isFinite(
      number
    ) ||
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
    Math.floor(
      number
    );

  await savePlayer(
    env,
    targetId,
    player
  );

  return sendText(
    env,
    interaction,

    `✨ Gave **${Math.floor(
      number
    )} sparkles**!`
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
          label:
            "🎁 Open Birthday Present",
          custom_id:
            "open_birthday_gift"
        }
      ]
    }
  ];
}

/* =========================================================
   /BIRTHDAY
========================================================= */

async function handleBirthday(
  env,
  interaction,
  userId,
  pin
) {
  const suppliedPin =
    String(
      pin || ""
    )
      .trim()
      .toUpperCase();

  if (
    suppliedPin !==
    BIRTHDAY_PIN
  ) {
    return sendText(
      env,
      interaction,

      "🎂 **Birthday Gift Locked!**\n\n" +
      "🔐 That's not the right PIN."
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

  /*
    PIN ONLY unlocks these items.
  */

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

  player.birthdayUnlocked =
    true;

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    env,
    interaction,

    `🎂🎉 **HAPPY BIRTHDAY, STONED!** 🎉🎂\n\n` +
    `💖 Your secret birthday gift has been unlocked!\n\n` +
    `🌳 **Stoned's Birthday Tree**\n` +
    `🎈 **Stoned's Balloon Decoration**\n` +
    `🎂 **Stoned's Birthday Background**\n\n` +
    `Everything has been added to your inventory. ✨\n\n` +
    `🎁 There's also a special present waiting for you...`,

    birthdayGiftButtons()
  );
}

/* =========================================================
   OPEN BIRTHDAY GIFT
========================================================= */

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

  updatePlayerIdentity(
    player,
    interaction
  );

  if (
    !player.birthdayUnlocked
  ) {
    return sendText(
      env,
      interaction,

      "🔐 You need to unlock the birthday gift first!"
    );
  }

  if (
    player.birthdayGiftClaimed
  ) {
    return sendText(
      env,
      interaction,

      "🎁 You already opened your birthday present! 💖"
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

    `🎂💖 **HAPPY BIRTHDAY, STONED!!!** 💖🎂\n\n` +
    `🎁 You opened your special birthday present!\n\n` +
    `✨ **+${STONED_GIFT_SPARKLES} SPARKLES!** ✨\n\n` +
    `💖 You now have **${player.sparkles} ✨**\n\n` +
    `🌸 Hope your birthday is absolutely magical! 🎉`
  );
}

/* =========================================================
   BIRTHDAY HUNT STORAGE
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
      guildStateKey(
        guildId
      )
    );

  if (!raw) {
    return {
      guildId,
      knownChannels: [],
      hunt: {
        active: false,
        startAt: 0,
        endAt: 0,
        nextGiftAt: 0,
        giftNumber: 0
      }
    };
  }

  try {
    return JSON.parse(
      raw
    );
  } catch {
    return {
      guildId,
      knownChannels: [],
      hunt: {
        active: false,
        startAt: 0,
        endAt: 0,
        nextGiftAt: 0,
        giftNumber: 0
      }
    };
  }
}

async function saveGuildState(
  env,
  guildId,
  state
) {
  await env.TREE_DATA.put(
    guildStateKey(
      guildId
    ),
    JSON.stringify(
      state
    )
  );
}

/* =========================================================
   REGISTER GUILD
========================================================= */

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

  state.guildId =
    guildId;

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
  return fetch(
    `https://discord.com/api/v10${path}`,
    {
      ...options,

      headers: {
        Authorization:
          `Bot ${env.BOT_TOKEN}`,

        ...(options.headers ||
          {})
      }
    }
  );
}

/* =========================================================
   GET GUILD CHANNELS
========================================================= */

async function getGuildTextChannels(
  env,
  guildId
) {
  const response =
    await discordBotRequest(
      env,
      `/guilds/${guildId}/channels`
    );

  if (!response.ok) {
    console.error(
      "Unable to get guild channels:",
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
   SEND CHANNEL MESSAGE
========================================================= */

async function sendChannelMessage(
  env,
  channelId,
  content,
  components = []
) {
  const response =
    await discordBotRequest(
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

  return response;
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
    Math.random() <
    0.25;

  if (isPrank) {
    return {
      id:
        Date.now().toString(36) +
        Math.random()
          .toString(36)
          .slice(2),

      type:
        "prank",

      amount: 0,

      message:
        randomItem(
          GIFT_HUNT_PRANKS
        ),

      claimed: false
    };
  }

  return {
    id:
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .slice(2),

    type:
      "sparkles",

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
      "❌ Gift Hunt presents can only be claimed inside the server."
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
      "🎁 The Birthday Gift Hunt isn't active right now!"
    );
  }

  if (
    Date.now() >=
    state.hunt.endAt
  ) {
    return sendText(
      env,
      interaction,
      "⏰ The Birthday Gift Hunt has ended!"
    );
  }

  if (
    !gift ||
    gift.id !==
      giftId
  ) {
    return sendText(
      env,
      interaction,
      "🎁 That present has already disappeared!"
    );
  }

  /*
    Mark it claimed immediately in KV.

    This makes the first successful
    interaction the winner.
  */

  if (
    gift.claimed
  ) {
    return sendText(
      env,
      interaction,
      "🎁 Too late! Someone already grabbed this present!"
    );
  }

  gift.claimed =
    true;

  gift.claimedBy =
    userId;

  gift.claimedAt =
    Date.now();

  state.hunt.currentGift =
    gift;

  await saveGuildState(
    env,
    guildId,
    state
  );

  if (
    gift.type ===
    "prank"
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

  /*
    Announce in the available text channels.
  */

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
        "Announcement failed:",
        error
      );
    }
  }
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
  if (
    !channels.length
  ) {
    return;
  }

  const channel =
    randomItem(
      channels
    );

  const gift =
    createHuntGift();

  state.hunt.giftNumber =
    (state.hunt.giftNumber ||
      0) + 1;

  state.hunt.currentGift =
    gift;

  /*
    IMPORTANT:
    The present message itself is what
    people race to claim.
  */

  const response =
    await sendChannelMessage(
      env,
      channel.id,

      gift.type ===
        "prank"
        ? `🎁 **A MYSTERY PRESENT HAS APPEARED!**\n\n` +
          `👀 First person to open it gets to discover what's inside...`
        : gift.message,

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

  /*
    Next present appears randomly
    8–12 minutes later.
  */

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
  const keys = [];

  let cursor =
    undefined;

  while (true) {
    const result =
      await env.TREE_DATA.list(
        cursor
          ? { cursor }
          : undefined
      );

    for (
      const key of
      result.keys
    ) {
      if (
        key.name.startsWith(
          "guild:"
        )
      ) {
        keys.push(
          key.name.slice(
            6
          )
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

  /*
    Only operate on the specific
    birthday date.
  */

  if (
    dateKey !==
    BIRTHDAY_EVENT_DATE
  ) {
    return;
  }

  const hour =
    Number(
      eastern.hour
    );

  const minute =
    Number(
      eastern.minute
    );

  const currentMinutes =
    hour * 60 +
    minute;

  const startMinutes =
    BIRTHDAY_START_HOUR *
    60;

  const endMinutes =
    BIRTHDAY_END_HOUR *
    60;

  const guildIds =
    await getKnownGuildIds(
      env
    );

  /*
    4 PM:
    Start the event.
  */

  if (
    currentMinutes >=
      startMinutes &&
    currentMinutes <
      endMinutes
  ) {
    for (
      const guildId of
      guildIds
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
          await getGuildTextChannels(
            env,
            guildId
          );

        if (
          !channels.length
        ) {
          continue;
        }

        state.hunt = {
          active: true,

          startAt:
            now.getTime(),

          endAt:
            now.getTime() +
            GIFT_HUNT_DURATION,

          nextGiftAt:
            now.getTime() +
            randomInt(
              2 * 60 * 1000,
              5 * 60 * 1000
            ),

          giftNumber: 0,

          currentGift:
            null
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

  /*
    Release gifts throughout the event.
  */

  for (
    const guildId of
    guildIds
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

      continue;
    }

    if (
      Date.now() >=
      state.hunt.nextGiftAt
    ) {
      const channels =
        await getGuildTextChannels(
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

  switch (
    customId
  ) {
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

    case "buy_pumpkin_cat":
      return buyPumpkinCat(
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

  await rememberGuild(
    env,
    interaction
  );

  switch (
    command
  ) {
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

    default:
      return sendText(
        env,
        interaction,
        "❌ Unknown command."
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
          name:
            "Ed25519"
        },

        false,

        [
          "verify"
        ]
      );

    return await crypto.subtle.verify(
      {
        name:
          "Ed25519"
      },

      key,

      hexToUint8Array(
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
    name:
      "daily-riddle",

    description:
      "Solve today's riddle for sparkles",

    options: [
      {
        type: 3,

        name:
          "answer",

        description:
          "Your answer to today's riddle",

        required:
          false
      }
    ]
  },

  {
    name:
      "shop",

    description:
      "Open the tree shop"
  },

  {
    name:
      "customize",

    description:
      "Customize your tree"
  },

  {
    name:
      "inventory",

    description:
      "View your inventory"
  },

  {
    name:
      "leaderboard",

    description:
      "View the tree leaderboard"
  },

  {
    name:
      "birthday",

    description:
      "Unlock a special birthday gift",

    options: [
      {
        type: 3,

        name:
          "pin",

        description:
          "Enter the birthday PIN",

        required:
          true
      }
    ]
  },

  {
    name:
      "rename",

    description:
      "Rename your tree",

    options: [
      {
        type: 3,

        name:
          "name",

        description:
          "Your tree's new name",

        required:
          true
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

        name:
          "user",

        description:
          "User receiving sparkles",

        required:
          true
      },

      {
        type: 4,

        name:
          "amount",

        description:
          "Amount of sparkles",

        required:
          true
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

    if (
      request.method ===
        "GET" &&
      url.pathname ===
        "/"
    ) {
      return new Response(
        "🌸 Werewives Tree Bot is alive! ✨",
        {
          status: 200
        }
      );
    }

    if (
      request.method ===
        "GET" &&
      url.pathname ===
        "/register"
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

    if (
      request.method ===
        "POST" &&
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

      if (
        interaction.type ===
        1
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

      if (
        interaction.type ===
        2
      ) {
        return handleCommand(
          env,
          interaction
        );
      }

      if (
        interaction.type ===
        3
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
};
