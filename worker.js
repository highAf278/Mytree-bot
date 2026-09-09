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

const TREE_STAGES = {
  1: {
    name: "Baby Seedling",
    image: "IMG_7244.png"
  },
  5: {
    name: "Little Cherry Tree",
    image: "IMG_7244.png"
  },
  10: {
    name: "Growing Cherry Tree",
    image: "IMG_7244.png"
  },
  20: {
    name: "Blooming Cherry Tree",
    image: "IMG_7244.png"
  },
  35: {
    name: "Magical Cherry Tree",
    image: "IMG_7244.png"
  },
  50: {
    name: "Eternal Cherry Tree",
    image: "IMG_7244.png"
  }
};

/* =========================
   LEVEL REWARDS
========================= */

const LEVEL_REWARDS = {
  5: "🌸 Unlocked: Cherry Blossom decoration!",
  10: "✨ Unlocked: Sparkle Garden!",
  20: "🧚 Unlocked: Werewives event bonus!",
  35: "💖 Unlocked: Magical tree customization!",
  50: "👑 Unlocked: Eternal Tree status!"
};

/* =========================
   WEREWIVES EVENTS
========================= */

const WEREWIVES_EVENTS = [
  {
    text: "🐺💅 A werewife dramatically appears and demands attention from your tree!",
    xp: 5
  },
  {
    text: "💋🐺 A werewife has blessed your tree with chaotic wife energy!",
    xp: 10
  },
  {
    text: "🌙🐺 A werewife zooms past your tree and leaves sparkles everywhere!",
    xp: 15
  },
  {
    text: "💅🌸 A werewife inspected your tree and said it needs MORE DRAMA.",
    xp: 5
  },
  {
    text: "🐺✨ A werewife accidentally made your tree sparkle!",
    xp: 10
  }
];

/* =========================
   HELPERS
========================= */

function getStage(level) {
  let stage = TREE_STAGES[1];

  for (const requiredLevel of Object.keys(TREE_STAGES)) {
    if (level >= Number(requiredLevel)) {
      stage = TREE_STAGES[requiredLevel];
    }
  }

  return stage;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChance(chance) {
  return Math.random() < chance;
}

function xpNeeded(level) {
  return level * 50;
}

function xpPercent(player) {
  const needed = xpNeeded(player.level);

  if (needed <= 0) return 0;

  return Math.min(
    100,
    Math.round((player.exp / needed) * 100)
  );
}

/* =========================
   PLAYER DATA
========================= */

function createPlayer() {
  return {
    level: 1,
    exp: 0,

    sparkles: 0,

    lastWater: 0,
    lastDaily: 0,

    sparkle: null,

    sceneMessage: "🌱 Your little tree is waiting for some love!",

    claimedLevelRewards: [],

    inventory: [],

    equipped: {
      decoration: null
    }
  };
}

function repairPlayer(player) {
  const fresh = createPlayer();

  if (!player || typeof player !== "object") {
    return fresh;
  }

  return {
    ...fresh,
    ...player,

    equipped: {
      ...fresh.equipped,
      ...(player.equipped || {})
    },

    claimedLevelRewards: Array.isArray(player.claimedLevelRewards)
      ? player.claimedLevelRewards
      : [],

    inventory: Array.isArray(player.inventory)
      ? player.inventory
      : []
  };
}

async function getPlayer(env, userId) {
  const raw = await env.TREE_DATA.get(userId);

  if (!raw) {
    return createPlayer();
  }

  try {
    return repairPlayer(JSON.parse(raw));
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

/* =========================
   XP / LEVELING
========================= */

function addExp(player, amount) {
  const messages = [];

  player.exp += amount;

  while (player.exp >= xpNeeded(player.level)) {
    player.exp -= xpNeeded(player.level);
    player.level++;

    messages.push(
      `🎉🌸 LEVEL UP! Your tree reached **Level ${player.level}**!`
    );

    if (
      LEVEL_REWARDS[player.level] &&
      !player.claimedLevelRewards.includes(player.level)
    ) {
      player.claimedLevelRewards.push(player.level);

      messages.push(
        LEVEL_REWARDS[player.level]
      );
    }
  }

  return messages;
}

/* =========================
   SPARKLES
========================= */

function sparkleInfo() {
  const types = [
    {
      name: "Pink Sparkle",
      emoji: "💗",
      value: 1
    },
    {
      name: "Rainbow Sparkle",
      emoji: "🌈",
      value: 2
    },
    {
      name: "Moon Sparkle",
      emoji: "🌙",
      value: 3
    },
    {
      name: "Rare Star",
      emoji: "⭐",
      value: 5
    }
  ];

  return types[random(0, types.length - 1)];
}

function maybeSpawnSparkle(player) {
  if (player.sparkle) return;

  if (!randomChance(SPARKLE_CHANCE)) return;

  const sparkle = sparkleInfo();

  player.sparkle = {
    ...sparkle,
    x: random(15, 85),
    y: random(25, 70),
    createdAt: Date.now()
  };
}

function cleanExpiredSparkle(player) {
  if (!player.sparkle) return;

  if (
    Date.now() - player.sparkle.createdAt >
    SPARKLE_LIFETIME
  ) {
    player.sparkle = null;
  }
}

/* =========================
   IMAGE RENDERING
========================= */

async function renderTree(env, player) {
  cleanExpiredSparkle(player);

  const stage = getStage(player.level);

  const browser = await puppeteer.launch(env.BROWSER);
  const page = await browser.newPage();

  const backgroundUrl =
    R2_BASE + BACKGROUND_IMAGE;

  const treeUrl =
    R2_BASE + stage.image;

  const percent = xpPercent(player);
  const needed = xpNeeded(player.level);

  let sparkleHTML = "";

  if (player.sparkle) {
    sparkleHTML = `
      <div
        class="sparkle"
        style="
          left:${player.sparkle.x}%;
          top:${player.sparkle.y}%;
        "
      >
        ${player.sparkle.emoji}
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
  font-family: Arial, sans-serif;
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

  left: 50%;
  top: 52%;

  transform: translate(-50%, -50%);

  width: 82%;
  max-height: 72%;

  object-fit: contain;
}

.title {
  position: absolute;

  top: 28px;
  left: 50%;

  transform: translateX(-50%);

  padding: 12px 28px;

  border-radius: 30px;

  background: rgba(255,255,255,0.82);

  color: #7d5270;

  font-size: 30px;
  font-weight: bold;

  box-shadow:
    0 5px 20px rgba(0,0,0,0.15);
}

.levelBadge {
  position: absolute;

  top: 105px;
  left: 32px;

  padding: 12px 20px;

  border-radius: 20px;

  background: rgba(255,255,255,0.88);

  color: #7d5270;

  font-size: 26px;
  font-weight: bold;

  box-shadow:
    0 5px 15px rgba(0,0,0,0.12);
}

.xpContainer {
  position: absolute;

  top: 160px;
  left: 32px;

  width: 350px;
}

.xpLabel {
  margin-bottom: 6px;

  color: white;

  font-size: 20px;
  font-weight: bold;

  text-shadow:
    0 2px 5px rgba(0,0,0,0.45);
}

.xpBar {
  position: relative;

  width: 100%;
  height: 30px;

  overflow: hidden;

  border-radius: 20px;

  background: rgba(255,255,255,0.65);

  border: 3px solid rgba(255,255,255,0.9);

  box-shadow:
    0 4px 12px rgba(0,0,0,0.18);
}

.xpFill {
  height: 100%;

  width: ${percent}%;

  border-radius: 20px;

  background:
    linear-gradient(
      90deg,
      #ff9fca,
      #ffcae5,
      #f4a7ff
    );

  transition: width 0.4s ease;
}

.xpText {
  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #6f4964;

  font-size: 16px;
  font-weight: bold;
}

.messageBox {
  position: absolute;

  left: 50%;
  bottom: 40px;

  transform: translateX(-50%);

  width: 80%;

  padding: 16px 24px;

  text-align: center;

  border-radius: 25px;

  background: rgba(255,255,255,0.86);

  color: #6f4964;

  font-size: 22px;
  font-weight: bold;

  box-shadow:
    0 5px 20px rgba(0,0,0,0.15);
}

.sparkle {
  position: absolute;

  transform: translate(-50%, -50%);

  font-size: 54px;

  animation:
    sparkleFloat 1.5s infinite alternate,
    sparklePulse 1s infinite;

  filter:
    drop-shadow(0 0 10px rgba(255,255,255,0.9));

  z-index: 10;
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
    opacity: 0.8;
  }

  50% {
    opacity: 1;
  }
}

</style>
</head>

<body>

<div class="scene">

  <div class="title">
    🌸 My Cherry Tree 🌸
  </div>

  <div class="levelBadge">
    LVL ${player.level}
  </div>

  <div class="xpContainer">

    <div class="xpLabel">
      🌱 Tree Growth
    </div>

    <div class="xpBar">

      <div
        class="xpFill"
      ></div>

      <div class="xpText">
        ${player.exp} / ${needed} XP
      </div>

    </div>

  </div>

  <img
    class="tree"
    src="${treeUrl}"
  />

  ${sparkleHTML}

  <div class="messageBox">
    ${player.sceneMessage}
  </div>

</div>

</body>
</html>
`;

  await page.setContent(html, {
    waitUntil: "networkidle0"
  });

  await new Promise(resolve =>
    setTimeout(resolve, 1200)
  );

  const screenshot =
    await page.screenshot({
      type: "png"
    });

  await browser.close();

  return screenshot;
}

/* =========================
   DISCORD HELPERS
========================= */

async function acknowledge(interaction) {
  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        type: 5
      })
    }
  );
}

/*
  IMPORTANT:
  Button interactions use type 6,
  not type 5.
*/

async function acknowledgeButton(interaction) {
  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        type: 6
      })
    }
  );
}

async function editOriginal(
  interaction,
  screenshot,
  components = []
) {
  const form = new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      attachments: [
        {
          id: "0",
          filename: "tree.png"
        }
      ],
      components
    })
  );

  form.append(
    "files[0]",
    new File(
      [screenshot],
      "tree.png",
      {
        type: "image/png"
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

async function sendText(interaction, content) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        content
      })
    }
  );
}

/* =========================
   BUTTONS
========================= */

function treeButtons(player) {
  const firstButton = player.sparkle
    ? {
        type: 2,
        style: 1,
        custom_id: "tree_catch",
        label: "Catch Sparkle",
        emoji: {
          name: "✨"
        }
      }
    : {
        type: 2,
        style: 1,
        custom_id: "tree_water",
        label: "Water Tree",
        emoji: {
          name: "💧"
        }
      };

  return [
    {
      type: 1,
      components: [
        firstButton,

        {
          type: 2,
          style: 2,
          custom_id: "tree_daily",
          label: "Daily",
          emoji: {
            name: "🎁"
          }
        },

        {
          type: 2,
          style: 2,
          custom_id: "tree_inventory",
          label: "Inventory",
          emoji: {
            name: "🎒"
          }
        },

        {
          type: 2,
          style: 2,
          custom_id: "tree_shop",
          label: "Shop",
          emoji: {
            name: "🛍️"
          }
        },

        {
          type: 2,
          style: 2,
          custom_id: "tree_customize",
          label: "Customize",
          emoji: {
            name: "🎀"
          }
        }
      ]
    }
  ];
}

/* =========================
   TREE COMMAND
========================= */

async function handleTree(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player = await getPlayer(
    env,
    userId
  );

  maybeSpawnSparkle(player);

  player.sceneMessage =
    player.sparkle
      ? "✨ A sparkle appeared! Catch it!"
      : "🌱 Give your tree some love!";

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

  return editOriginal(
    interaction,
    screenshot,
    treeButtons(player)
  );
}

/* =========================
   WATER
========================= */

async function handleWater(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

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
      Math.ceil(remaining / 60000);

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

    return editOriginal(
      interaction,
      screenshot,
      treeButtons(player)
    );
  }

  player.lastWater = now;

  const messages =
    addExp(
      player,
      EXP_PER_WATER
    );

  maybeSpawnSparkle(player);

  if (messages.length) {
    player.sceneMessage =
      messages.join(" • ");
  } else if (player.sparkle) {
    player.sceneMessage =
      "💧✨ You watered your tree! A sparkle appeared!";
  } else {
    player.sceneMessage =
      `💧🌸 Your tree loved that! +${EXP_PER_WATER} XP`;
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

  return editOriginal(
    interaction,
    screenshot,
    treeButtons(player)
  );
}

/* =========================
   CATCH SPARKLE
========================= */

async function handleCatch(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  cleanExpiredSparkle(player);

  if (!player.sparkle) {
    player.sceneMessage =
      "✨ The sparkle disappeared!";

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

    return editOriginal(
      interaction,
      screenshot,
      treeButtons(player)
    );
  }

  const sparkle =
    player.sparkle;

  player.sparkles += sparkle.value;

  player.sparkle = null;

  const messages =
    addExp(
      player,
      sparkle.value
    );

  player.sceneMessage =
    `${sparkle.emoji} You caught a ${sparkle.name}! +${sparkle.value} sparkle(s)`;

  if (messages.length) {
    player.sceneMessage +=
      " • " +
      messages.join(" • ");
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

  return editOriginal(
    interaction,
    screenshot,
    treeButtons(player)
  );
}

/* =========================
   DAILY
========================= */

async function handleDaily(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

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

    return sendText(
      interaction,
      `🎁 You already claimed your daily reward! Come back in about ${hours} hour(s).`
    );
  }

  player.lastDaily = now;

  const xp = 25;
  const sparkleReward = 3;

  player.sparkles += sparkleReward;

  const messages =
    addExp(
      player,
      xp
    );

  player.sceneMessage =
    `🎁 Daily reward claimed! +${xp} XP and +${sparkleReward} sparkles!`;

  if (messages.length) {
    player.sceneMessage +=
      "\n" +
      messages.join("\n");
  }

  await savePlayer(
    env,
    userId,
    player
  );

  return sendText(
    interaction,
    `🎁 **Daily Reward!**\n\n+${xp} XP\n+${sparkleReward} ✨ sparkles!\n\n${messages.join("\n")}`
  );
}

/* =========================
   INVENTORY
========================= */

async function handleInventory(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  if (!player.inventory.length) {
    return sendText(
      interaction,
      `🎒 **Your Inventory**\n\nIt's empty for now! 🌸`
    );
  }

  return sendText(
    interaction,
    `🎒 **Your Inventory**\n\n${player.inventory
      .map(item => `• ${item}`)
      .join("\n")}`
  );
}

/* =========================
   SHOP
========================= */

async function handleShop(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  return sendText(
    interaction,
    `🛍️ **Tree Shop**\n\n✨ You have **${player.sparkles} sparkles**.\n\n🌸 More decorations coming soon!`
  );
}

/* =========================
   CUSTOMIZE
========================= */

async function handleCustomize(interaction, env) {
  const userId = interaction.member?.user?.id ||
                 interaction.user?.id;

  const player =
    await getPlayer(env, userId);

  return sendText(
    interaction,
    `🎀 **Tree Customization**\n\nYour customization menu is coming soon! 🌸\n\nCurrent tree: **${getStage(player.level).name}**`
  );
}

/* =========================
   RENAME
========================= */

async function handleRename(interaction, env) {
  return sendText(
    interaction,
    "🌸 Tree renaming is coming soon!"
  );
}

/* =========================
   LEADERBOARD
========================= */

async function handleLeaderboard(interaction, env) {
  return sendText(
    interaction,
    "🏆 **Tree Leaderboard**\n\nLeaderboard tracking is coming soon! 🌸"
  );
}

/* =========================
   COMPONENT ROUTER
========================= */

async function handleComponent(
  interaction,
  env
) {
  const id =
    interaction.data.custom_id;

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

    case "tree_customize":
      return handleCustomize(
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

/* =========================
   SLASH COMMAND ROUTER
========================= */

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

  if (!signature || !timestamp) {
    return false;
  }

  const body =
    await request.clone().text();

  const publicKey =
    await crypto.subtle.importKey(
      "raw",
      hexToBytes(env.PUBLIC_KEY),
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
    new TextEncoder().encode(
      timestamp + body
    )
  );
}

function hexToBytes(hex) {
  const bytes =
    new Uint8Array(
      hex.length / 2
    );

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] =
      parseInt(
        hex.substr(i * 2, 2),
        16
      );
  }

  return bytes;
}

/* =========================
   WORKER
========================= */

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    /* Health check */

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

    /* Register commands */

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {
      return new Response(
        "Commands are already registered.",
        {
          status: 200
        }
      );
    }

    /* Discord interactions */

    if (
      request.method !== "POST" ||
      url.pathname !== "/interactions"
    ) {
      return new Response(
        "Not Found",
        {
          status: 404
        }
      );
    }

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

    if (interaction.type === 1) {
      return Response.json({
        type: 1
      });
    }

    /* Slash command */

    if (interaction.type === 2) {

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

    /* Button interaction */

    if (interaction.type === 3) {

      /*
        THIS IS THE IMPORTANT FIX.

        Buttons use DEFERRED_UPDATE_MESSAGE
        (type 6), so the existing tree
        message can be updated correctly.
      */

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

    return new Response(
      "Unknown interaction",
      {
        status: 400
      }
    );
  }
};
