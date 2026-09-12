import puppeteer from "@cloudflare/puppeteer";

/* =========================================================
   WEREWIVES TREE BOT
   EXISTING BINDINGS ONLY:
   TREE_DATA
   BROWSER
   CLIENT_ID
   BOT_TOKEN
   PUBLIC_KEY
   OWNER_ID
========================================================= */

const EXP_PER_WATER = 10;

const SPARKLE_CHANCE = 0.75;
const SPARKLE_LIFETIME = 20 * 60 * 1000;

const MIN_SPARKLES_PER_SPAWN = 2;
const MAX_SPARKLES_PER_SPAWN = 4;
const MAX_ACTIVE_SPARKLES = 5;

/* WATER IS NOW 30 MINUTES */
const WATER_COOLDOWN = 30 * 60 * 1000;
const RECYCLE_COOLDOWN = 5 * 60 * 60 * 1000;
const RACCOON_COOLDOWN = 3 * 60 * 60 * 1000;
const FORTUNE_COOLDOWN = 60 * 60 * 1000;

/*
  CHAOS IS NO LONGER TRIGGERED BY WATER.

  The scheduled Worker checks every 5 minutes.
  Each guild receives a chaos event every 5 minutes.
*/
const CHAOS_INTERVAL = 60 * 60 * 1000;
const CHAOS_SCHEDULE_VERSION = 5;
const STONED_GIFT_SPARKLES = 300;

const BASE_URL =
  "https://pub-c9c053d25cdd42cca1319756c46f9cfa.r2.dev/";

const IMAGES = {
  pinkSky: "IMG_7251.jpeg",
  halloween: "IMG_7254.jpeg",
  candyland: "IMG_7261.jpeg",
  cherryTree: "IMG_7259.png",
  cottonCandyTree: "IMG_7263.png",
  pumpkinCat: "IMG_7272.png",
  stonedTree: "IMG_7283.png",
  stonedBalloon: "IMG_7277.png",
  stonedBackground: "IMG_7275.jpeg",
  panda: "IMG_7287.png",
  cat: "IMG_7288.png",
  shadowTree: "IMG_7311.png",
  fullCherryTree: "IMG_7310.png",
  pineTree: "IMG_7308.png",
  redTree: "IMG_7307.png",
  soulTree: "IMG_7280.png",
  butterflies: "IMG_7306.png",
  hearts: "IMG_7305.png",
  magicMushroom: "IMG_7300.jpeg",
  fieldDay: "IMG_7299.jpeg",
  redForest: "IMG_7291.jpeg",
  halloweenTree: "IMG_7309.png",
  purrPrincess: "IMG_7315.png",
  kittyTree: "IMG_7314.png",
  cozyCat: "IMG_7317.png",
  greenGlowTree: "IMG_7327.png",
  greenGlowBackground: "IMG_7324.png",
  greenGlowEffect: "IMG_7325.png"
};

const SHOP_ITEMS = {
  candyland_background: {
    name: "🍬 Candy Land Background",
    price: 500,
    type: "background",
    value: "candyland"
  },
  cotton_candy_tree: {
    name: "🍭 Cotton Candy Tree",
    price: 1000,
    type: "tree",
    value: "cotton_candy"
  },
  halloween_background: {
    name: "🎃 Halloween Background",
    price: 150,
    type: "background",
    value: "halloween"
  },
  pumpkin_cat_decoration: {
    name: "🎃 Pumpkin Cat",
    price: 250,
    type: "decoration",
    value: "pumpkin_cat"
  },
  panda_decoration: {
    name: "🐼 Panda Decoration",
    price: 3000,
    type: "decoration",
    value: "panda"
  },
  cat_decoration: {
    name: "🐱 Cat Decoration",
    price: 1500,
    type: "decoration",
    value: "cat"
  },
  shadow_tree: {
    name: "🌑 Shadow Tree",
    price: 1000,
    type: "tree",
    value: "shadow"
  },
  full_cherry_tree: {
    name: "🌸 Full Cherry Tree",
    price: 1500,
    type: "tree",
    value: "full_cherry"
  },
  pine_tree: {
    name: "🌲 Pine Tree",
    price: 1000,
    type: "tree",
    value: "pine"
  },
  red_tree: {
    name: "❤️ Red Tree",
    price: 2000,
    type: "tree",
    value: "red"
  },
  soul_tree: {
    name: "💙 Soul Tree",
    price: 5000,
    type: "tree",
    value: "soul"
  },
  butterflies_effect: {
    name: "🦋 Butterflies",
    price: 5000,
    type: "effect",
    value: "butterflies"
  },
  hearts_effect: {
    name: "💕 Hearts",
    price: 10000,
    type: "effect",
    value: "hearts"
  },
  magic_mushroom_background: {
    name: "🍄 Magic Mushroom",
    price: 2000,
    type: "background",
    value: "magic_mushroom"
  },
  field_day_background: {
    name: "🌾 Field Day",
    price: 1000,
    type: "background",
    value: "field_day"
  },
  red_forest_background: {
    name: "🌲 Red Forest",
    price: 3000,
    type: "background",
    value: "red_forest"
  },
  halloween_tree: {
    name: "🎃 Halloween Tree",
    price: 2000,
    type: "tree",
    value: "halloween_tree",
    limited: true
  },
  purr_princess_effect: {
    name: "👑 Purr Princess",
    price: 5000,
    type: "effect",
    value: "purr_princess",
    limited: true
  },
  kitty_tree: {
    name: "🐱 Kitty Tree",
    price: 5000,
    type: "tree",
    value: "kitty_tree",
    limited: true
  },
  cozy_cat_background: {
    name: "🐱 Cozy Cat",
    price: 5000,
    type: "background",
    value: "cozy_cat",
    limited: true
  },
  green_glow_tree: {
    name: "💚 Green Glow Tree",
    price: 20000,
    type: "tree",
    value: "green_glow",
    limited: true
  },
  green_glow_background: {
    name: "💚 Green Glow Background",
    price: 10000,
    type: "background",
    value: "green_glow",
    limited: true
  },
  green_glow_effect: {
    name: "💚 Green Glow Effect",
    price: 10000,
    type: "effect",
    value: "green_glow",
    limited: true
  }
};

const RIDDLES = [
  {
    question: "What has keys but can't open locks?",
    answer: "piano"
  },
  {
    question: "What has hands but cannot clap?",
    answer: "clock"
  },
  {
    question: "What gets wetter the more it dries?",
    answer: "towel"
  },
  {
    question: "What has a neck but no head?",
    answer: "bottle"
  },
  {
    question: "What has one eye but cannot see?",
    answer: "needle"
  },
  {
    question: "What can travel around the world while staying in one corner?",
    answer: "stamp"
  },
  {
    question: "What has many teeth but cannot bite?",
    answer: "comb"
  },
  {
    question: "What belongs to you but other people use it more than you do?",
    answer: "name"
  },
  {
    question: "What comes down but never goes up?",
    answer: "rain"
  },
  {
    question: "What has words but never speaks?",
    answer: "book"
  }
];

const CHAOS_EVENTS = [
  {
    type: "everyone",
    min: 10,
    max: 50,
    message:
      "🧀 THE CHEESE COUNCIL HAS ARRIVED! Everyone gets a cheese bonus!"
  },
  {
    type: "everyone",
    min: 5,
    max: 30,
    message:
      "🦝 RACCOON TAX! The raccoons have blessed everybody with sparkles!"
  },
  {
    type: "everyone",
    min: 10,
    max: 40,
    message:
      "🐺 WEREWIFE MOON! Everyone's tree just got a little more powerful!"
  },
  {
    type: "everyone",
    min: 5,
    max: 25,
    message:
      "✨ SPARKLE STORM! Sparkles are raining over every tree!"
  },
  {
    type: "player",
    min: 10,
    max: 60,
    message:
      "🌸 A mysterious fairy found your tree and left you some sparkles!"
  },
  {
    type: "player",
    min: -30,
    max: -5,
    message:
      "🦝 A raccoon stole some of your sparkles!"
  },
  {
    type: "player",
    min: 5,
    max: 35,
    message:
      "💅 WEREWIFE ENERGY! Your tree received a surprise sparkle boost!"
  },  {
    type: "everyone",
    min: 15,
    max: 75,
    message:
      "🚨 RACCOON EMERGENCY! Nobody knows what happened, but everyone got paid!"
  },
  {
    type: "everyone",
    min: 5,
    max: 60,
    message:
      "🦝 RACCOON PARADE! The raccoons are marching through Werewives and dropping sparkles everywhere!"
  },
  {
    type: "everyone",
    min: 10,
    max: 80,
    message:
      "🧀 THE CHEESE MOON IS FULL! The cheese council has thrown sparkles at everyone!"
  },
  {
    type: "player",
    min: 20,
    max: 100,
    message:
      "🦝 A raccoon wearing a tiny business suit audited your tree and approved a suspicious bonus!"
  },
  {
    type: "player",
    min: -50,
    max: -10,
    message:
      "🧾 TAX AUDIT! Your tree has been fined for excessive sparkle possession!"
  },
  {
    type: "player",
    min: 10,
    max: 75,
    message:
      "🍝 SPAGHETTI INCIDENT! Somehow your tree has become financially involved in pasta."
  },
  {
    type: "player",
    min: -25,
    max: 60,
    message:
      "🎰 THE CHAOS SLOT MACHINE! Nobody knows whether this is a reward or a mistake."
  },

  {
    type: "player",
    min: -20,
    max: 20,
    message:
      "🎲 CHAOS DICE! Your sparkle balance has been randomly altered!"
  }
];

const TREE_PERSONALITIES = [
  {
    id: "sweet",
    name: "Sweet",
    messages: [
      "Your tree is feeling extra sweet today! 💖",
      "Your tree is happily soaking up the love! 🌸"
    ]
  },
  {
    id: "chaotic",
    name: "Chaotic",
    messages: [
      "Your tree is plotting something suspicious... 👀",
      "Your tree chose chaos today. Naturally. 🌪️"
    ]
  },
  {
    id: "sassy",
    name: "Sassy",
    messages: [
      "Your tree has opinions and it wants you to know. 💅",
      "Your tree accepted the water. Barely. 💅🌳"
    ]
  },
  {
    id: "sleepy",
    name: "Sleepy",
    messages: [
      "Your tree woke up just long enough to enjoy that water. 😴🌸",
      "Your tree would like a tiny nap now. 💤"
    ]
  },
  {
    id: "mischievous",
    name: "Mischievous",
    messages: [
      "Your tree is hiding sparkles where you least expect them. ✨👀",
      "Your tree looks innocent. It absolutely is not. 😈🌳"
    ]
  }
];

function getPersonality(player) {
  const found = TREE_PERSONALITIES.find(
    personality => personality.id === player.personality
  );
  return found || TREE_PERSONALITIES[0];
}

function assignPersonality(player) {
  if (!player.personality) {
    player.personality =
      TREE_PERSONALITIES[randomInt(0, TREE_PERSONALITIES.length - 1)].id;
    return true;
  }
  return false;
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
    personality: "sweet",
    level: 1,
    exp: 0,
    sparkles: 0,
    lastWater: 0,
    lastRecycle: 0,
    lastRaccoon: 0,
    lastFortune: 0,
    sparklesOnTree: [],
    sceneMessage: "",
    claimedLevelRewards: [],
    inventory: ["pink_sky_background"],
    equipped: {
      decoration: null,
      effect: null,
      theme: "cherry",
      tree: "cherry"
    },
    dailyRiddleDay: "",
    dailyRiddleSolved: false,
    dailyRiddleWins: 0,
    birthdayUnlocked: false,
    birthdayGiftClaimed: false,
    waterCount: 0,
    sparklesCaught: 0,
    sparkleValueCaught: 0,
    raccoonRobberies: 0,
    raccoonWins: 0,
    fortuneUses: 0,
    soloMission: null,
    soloBestScore: 0,
    soloBestStash: 0,
    soloRuns: 0,
    soloWins: 0,
    soloRiskyChoices: 0,
    soloPerfectRuns: 0,
    soloSparklesEarned: 0,
    soloHighestHeat: 0,
    titles: [],
    equippedTitle: "",
    shopPurchases: 0,
    treeChecks: 0,
    catItemBought: false,
    achievements: []
  };
}

/* =========================================================
   KV HELPERS
========================================================= */

async function getPlayer(env, userId) {
  const raw = await env.TREE_DATA.get(userId);

  if (!raw) {
    const player = defaultPlayer();
    player.userId = userId;
    player.personality =
      TREE_PERSONALITIES[randomInt(0, TREE_PERSONALITIES.length - 1)].id;
    return player;
  }

  try {
    const player = JSON.parse(raw);

    const merged = {
      ...defaultPlayer(),
      ...player,
      userId: player.userId || userId,
      inventory: Array.isArray(player.inventory)
        ? player.inventory
        : ["pink_sky_background"],
      claimedLevelRewards:
        Array.isArray(player.claimedLevelRewards)
          ? player.claimedLevelRewards
          : [],
      achievements:
        Array.isArray(player.achievements)
          ? player.achievements
          : [],
      titles:
        Array.isArray(player.titles)
          ? player.titles
          : [],
      sparklesOnTree:
        Array.isArray(player.sparklesOnTree)
          ? player.sparklesOnTree
          : [],
      equipped: {
        ...defaultPlayer().equipped,
        ...(player.equipped || {})
      }
    };

    if (!merged.personality) {
      merged.personality =
        TREE_PERSONALITIES[randomInt(0, TREE_PERSONALITIES.length - 1)].id;
      await savePlayer(env, merged);
    }

    return merged;
  } catch {
    const player = defaultPlayer();
    player.userId = userId;
    player.personality =
      TREE_PERSONALITIES[randomInt(0, TREE_PERSONALITIES.length - 1)].id;
    return player;
  }
}

async function savePlayer(env, player) {
  updateAchievements(player);
  await env.TREE_DATA.put(
    player.userId,
    JSON.stringify(player)
  );
}

function getUserFromInteraction(interaction) {
  return (
    interaction.member?.user ||
    interaction.user ||
    null
  );
}

function updatePlayerIdentity(player, interaction) {
  const user = getUserFromInteraction(interaction);

  if (!user) return;

  player.userId = user.id;
  player.username = user.username || "";

  player.displayName =
    interaction.member?.nick ||
    user.global_name ||
    user.username ||
    "Werewife";
}

async function getGuildState(env, guildId) {
  if (!guildId) {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      island: null,
      nextChaosAt: 0
    };
  }

  const raw = await env.TREE_DATA.get(
    `guild:${guildId}`
  );

  if (!raw) {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      island: null,
      nextChaosAt: 0
    };
  }

  try {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      island: null,
      nextChaosAt: 0,
      ...JSON.parse(raw)
    };
  } catch {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      island: null,
      nextChaosAt: 0
    };
  }
}

async function saveGuildState(env, guildId, state) {
  await env.TREE_DATA.put(
    `guild:${guildId}`,
    JSON.stringify(state)
  );
}

async function rememberGuild(env, guildId) {
  if (!guildId) return;

  const state =
    await getGuildState(
      env,
      guildId
    );

  let changed = false;

  if (!state.createdAt) {
    state.createdAt = Date.now();
    changed = true;
  }

  /*
    Existing guilds that don't yet have a chaos timer
    get one automatically.
  */
  if (
    state.chaosScheduleVersion !== CHAOS_SCHEDULE_VERSION
  ) {
    state.chaosScheduleVersion = CHAOS_SCHEDULE_VERSION;
    state.nextChaosAt =
      Date.now();
    changed = true;
  } else if (
    !state.nextChaosAt ||
    Number(state.nextChaosAt) <= 0
  ) {
    state.nextChaosAt =
      Date.now() +
      CHAOS_INTERVAL;
    changed = true;
  }

  if (changed) {
    await saveGuildState(
      env,
      guildId,
      state
    );
  }
}

/* =========================================================
   LEVELS / XP
========================================================= */

function xpNeeded(level) {
  return level * 50;
}

function getTreeHeight(player) {
  return Math.max(
    1,
    Number(player.level) || 1
  );
}

function applyLevelUps(player) {
  let leveled = false;

  while (
    player.exp >= xpNeeded(player.level)
  ) {
    player.exp -= xpNeeded(player.level);
    player.level++;
    leveled = true;
  }

  return leveled;
}

function getLevelReward(level) {
  const rewards = {
    5: 25,
    10: 50,
    20: 100,
    35: 150,
    50: 250
  };

  return rewards[level] || 0;
}

function claimAvailableLevelRewards(player) {
  const rewardLevels = [
    5,
    10,
    20,
    35,
    50
  ];

  let total = 0;

  for (const level of rewardLevels) {
    if (
      player.level >= level &&
      !player.claimedLevelRewards.includes(level)
    ) {
      const reward = getLevelReward(level);

      if (reward > 0) {
        player.sparkles += reward;
        total += reward;
      }

      player.claimedLevelRewards.push(level);
    }
  }

  return total;
}

/* =========================================================
   EASTERN TIME
========================================================= */

function getEasternDateParts(
  date = new Date()
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    ).formatToParts(date);

  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return {
    year: Number(result.year),
    month: Number(result.month),
    day: Number(result.day),
    hour: Number(result.hour),
    minute: Number(result.minute),
    second: Number(result.second)
  };
}

function easternDateKey(
  date = new Date()
) {
  const p = getEasternDateParts(date);

  return `${p.year}-${String(
    p.month
  ).padStart(2, "0")}-${String(
    p.day
  ).padStart(2, "0")}`;
}

function isBirthdayDate(
  date = new Date()
) {
  const p = getEasternDateParts(date);

  return (
    p.year === 2026 &&
    p.month === 9 &&
    p.day === 10
  );
}

/* =========================================================
   RANDOM HELPERS
========================================================= */

function randomInt(min, max) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

/* =========================================================
   DISCORD API
========================================================= */

async function discordRequest(
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

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  return fetch(
    `https://discord.com/api/v10${path}`,
    {
      ...options,
      headers
    }
  );
}

async function sendChannelMessage(
  env,
  channelId,
  content,
  components = []
) {
  if (!channelId) return null;

  const response =
    await discordRequest(
      env,
      `/channels/${channelId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          components
        })
      }
    );

  if (!response.ok) {
    console.error(
      "Channel message failed:",
      response.status,
      await response.text()
    );

    return null;
  }

  return response.json();
}

async function getGuildTextChannels(
  env,
  guildId
) {
  const response =
    await discordRequest(
      env,
      `/guilds/${guildId}/channels`
    );

  if (!response.ok) {
    return [];
  }

  const channels =
    await response.json();

  return channels.filter(
    channel =>
      channel.type === 0 &&
      !channel.is_thread
  );
}

/* =========================================================
   INTERACTION RESPONSES
========================================================= */

async function acknowledge(
  env,
  interaction
) {
  const response =
    await fetch(
      `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: interaction.type === 3 ? 6 : 5
        })
      }
    );

  if (!response.ok) {
    console.error(
      "Interaction acknowledge failed:",
      response.status,
      await response.text()
    );
  }
}

async function sendText(
  env,
  interaction,
  content,
  components = []
) {
  const response =
    await fetch(
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
            components,
            flags: 64
          }
        })
      }
    );

  if (!response.ok) {
    console.error(
      "sendText failed:",
      response.status,
      await response.text()
    );
  }

  return response;
}

async function sendPublicText(
  env,
  interaction,
  content,
  components = []
) {
  const response =
    await fetch(
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

  if (!response.ok) {
    console.error(
      "sendPublicText failed:",
      response.status,
      await response.text()
    );
  }

  return response;
}

async function editOriginalResponse(
  env,
  interaction,
  data
) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}

/* =========================================================
   TREE MESSAGE
========================================================= */

function formatWaterCooldown(player) {
  const now = Date.now();

  if (
    !player.lastWater ||
    now - player.lastWater >= WATER_COOLDOWN
  ) {
    return "Now! 💖";
  }

  const remaining =
    WATER_COOLDOWN -
    (now - player.lastWater);

  const totalSeconds =
    Math.ceil(remaining / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(
      `${hours} hour${hours === 1 ? "" : "s"}`
    );
  }

  if (minutes > 0) {
    parts.push(
      `${minutes} minute${minutes === 1 ? "" : "s"}`
    );
  }

  if (
    seconds > 0 &&
    hours === 0
  ) {
    parts.push(
      `${seconds} second${seconds === 1 ? "" : "s"}`
    );
  }

  return parts.join(" ");
}

function buildTreeStats(player) {
  return (
    `🌳 **${player.treeName || "Cherry Blossom"}**\n\n` +
    `🌱 **Lvl:** ${player.level}\n` +
    `✨ **Sparkles:** ${player.sparkles}\n` +
    `📏 **Height:** ${getTreeHeight(player)} ft\n` +
    `🎭 **Personality:** ${getPersonality(player).name}\n\n` +
    `💧 **Ready to be watered again in:** ${formatWaterCooldown(player)}`
  );
}

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

  const stats =
    buildTreeStats(player);

  const content =
    player.sceneMessage
      ? `${stats}\n\n${player.sceneMessage}`
      : stats;

  const form =
    new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      content,
      attachments: [
        {
          id: 0,
          filename: "tree.png"
        }
      ],
      components: treeButtons(getUserFromInteraction(interaction)?.id || "", player)
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

  const response =
    await fetch(
      `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
      {
        method: "PATCH",
        body: form
      }
    );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "sendTree failed:",
      response.status,
      errorText
    );

    throw new Error(
      `Discord tree update failed (${response.status})`
    );
  }

  return response;
}

/* =========================================================
   UPDATE TREE MESSAGE WITHOUT RENDERING
========================================================= */

async function updateTreeMessage(
  env,
  interaction,
  player
) {
  const stats =
    buildTreeStats(player);

  const content =
    player.sceneMessage
      ? `${stats}\n\n${player.sceneMessage}`
      : stats;

  const response =
    await editOriginalResponse(
      env,
      interaction,
      {
        content,
        components:
          treeButtons(getUserFromInteraction(interaction)?.id || "", player)
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    console.error(
      "updateTreeMessage failed:",
      response.status,
      text
    );

    throw new Error(
      `Discord tree message update failed (${response.status})`
    );
  }

  return response;
}

/* =========================================================
   BUTTON HELPERS
========================================================= */

function button(
  label,
  customId,
  style = 2,
  disabled = false
) {
  return {
    type: 2,
    style,
    label,
    custom_id: customId,
    disabled
  };
}

function row(...buttons) {
  return {
    type: 1,
    components: buttons
  };
}

function treeButtons(ownerId = "", player = null) {
  const prefix = ownerId ? `tree:${ownerId}:` : "tree:unknown:";

  const rows = [
    row(
      button("💧 Water", `${prefix}water`, 1),
      button("🔮 Fortune", `${prefix}fortune`, 2),
      button("✨ Balance", `${prefix}sparkle`, 3),
      button("🧩 Daily Riddle", `${prefix}daily_riddle`, 2)
    ),
    row(
      button("🛍️ Shop", `${prefix}shop`, 2),
      button("🎨 Customize", `${prefix}customize`, 2),
      button("🏆 Leaderboard", `${prefix}leaderboard`, 2)
    )
  ];

  const sparkles = Array.isArray(player?.sparklesOnTree)
    ? player.sparklesOnTree
    : [];

  if (sparkles.length) {
    for (let i = 0; i < sparkles.length; i += 5) {
      rows.push(
        row(
          ...sparkles.slice(i, i + 5).map(sparkle =>
            button(
              `${sparkle.emoji || "✨"} Catch +${Number(sparkle.value) || 0}`,
              `${prefix}catch:${sparkle.id}`,
              3
            )
          )
        )
      );
    }
  }

  return rows;
}

function treeButtonOwner(id) {
  const parts = String(id || "").split(":");
  return parts[0] === "tree" && parts.length >= 3 ? parts[1] : null;
}

function treeButtonAction(id) {
  const parts = String(id || "").split(":");
  return parts[0] === "tree" && parts.length >= 3 ? parts.slice(2).join(":") : null;
}

/* =========================================================
   IMAGE RENDERING
========================================================= */

function imageUrl(filename) {
  return `${BASE_URL}${filename}`;
}

function getBackgroundImage(player) {
  switch (
    player.equipped?.theme
  ) {
    case "halloween":
      return IMAGES.halloween;

    case "candyland":
      return IMAGES.candyland;

    case "magic_mushroom":
      return IMAGES.magicMushroom;

    case "field_day":
      return IMAGES.fieldDay;

    case "red_forest":
      return IMAGES.redForest;

    case "cozy_cat":
      return IMAGES.cozyCat;

    case "green_glow":
      return IMAGES.greenGlowBackground;

    case "stoned_birthday":
      return IMAGES.stonedBackground;

    default:
      return IMAGES.pinkSky;
  }
}

function getTreeImage(player) {
  switch (
    player.equipped?.tree
  ) {
    case "cotton_candy":
      return IMAGES.cottonCandyTree;

    case "shadow":
      return IMAGES.shadowTree;

    case "full_cherry":
      return IMAGES.fullCherryTree;

    case "pine":
      return IMAGES.pineTree;

    case "red":
      return IMAGES.redTree;

    case "soul":
      return IMAGES.soulTree;

    case "halloween_tree":
      return IMAGES.halloweenTree;

    case "kitty_tree":
      return IMAGES.kittyTree;

    case "green_glow":
      return IMAGES.greenGlowTree;

    case "stoned_birthday":
      return IMAGES.stonedTree;

    case "cherry":
    default:
      return IMAGES.cherryTree;
  }
}

function getDecorationImage(player) {
  switch (
    player.equipped?.decoration
  ) {
    case "pumpkin_cat":
      return IMAGES.pumpkinCat;

    case "stoned_balloon":
      return IMAGES.stonedBalloon;

    case "panda":
      return IMAGES.panda;

    case "cat":
      return IMAGES.cat;

    default:
      return null;
  }
}

function getEffectImage(player) {
  switch (
    player.equipped?.effect
  ) {
    case "butterflies":
      return IMAGES.butterflies;

    case "hearts":
      return IMAGES.hearts;

    case "purr_princess":
      return IMAGES.purrPrincess;

    case "green_glow":
      return IMAGES.greenGlowEffect;

    default:
      return null;
  }
}

async function renderTree(
  env,
  player
) {
  let browser;

  try {
    browser =
      await puppeteer.launch(
        env.BROWSER
      );

    const page =
      await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1
    });

    const background =
      imageUrl(
        getBackgroundImage(
          player
        )
      );

    const tree =
      imageUrl(
        getTreeImage(player)
      );

    const decorationFile =
      getDecorationImage(
        player
      );

    const decoration =
      decorationFile
        ? imageUrl(
            decorationFile
          )
        : "";

    const effectFile =
      getEffectImage(
        player
      );

    const effect =
      effectFile
        ? imageUrl(
            effectFile
          )
        : "";

    const sparkleHTML = (
      player.sparklesOnTree ||
      []
    )
      .map(sparkle => {
        const left =
          Number(sparkle.x) ||
          50;

        const top =
          Number(sparkle.y) ||
          50;

        const emoji =
          escapeHTML(
            sparkle.emoji ||
              "✨"
          );

        return `
          <div class="emoji"
            style="
              position:absolute;
              left:${left}%;
              top:${top}%;
              transform:translate(-50%,-50%);
              font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Emoji', sans-serif;
              font-size:70px;
              line-height:1;
              z-index:10;
              opacity:1;
              filter:drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 18px #ffffff) drop-shadow(0 0 34px #b8ff00) drop-shadow(0 0 52px #7cff00);
              text-shadow:0 0 10px #ffffff, 0 0 22px #ffffff, 0 0 40px #8cff00;
              animation:sparklePulse 1.2s ease-in-out infinite;
              user-select:none;
            "
          title="${escapeHTML(sparkle.name || "Sparkle")} — ${Number(sparkle.value) || 0} sparkles"
          >${emoji}</div>
        `;
      })
      .join("");

    let decorationHTML = "";

    if (
      decoration
    ) {
      const isBalloon =
        player.equipped?.decoration ===
        "stoned_balloon";

      const decorationSize =
        isBalloon
          ? "330px"
          : "280px";

      decorationHTML = `
        <img
          src="${decoration}"
          style="
            position:absolute;
            left:22%;
            top:84%;
            transform:translate(-50%,-50%);
            width:${decorationSize};
            height:${decorationSize};
            object-fit:contain;
            z-index:4;
          "
        />
      `;
    }

    let effectHTML = "";

    if (effect) {
      effectHTML = `
        <img
          src="${effect}"
          style="
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            object-fit:contain;
            z-index:5;
            pointer-events:none;
          "
        />
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

          .emoji {
            font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Emoji', sans-serif;
            font-variant-emoji: emoji;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 1024px;
            height: 1024px;
            overflow: hidden;
            background: #ffd9ef;
          }

          #scene {
            position: relative;
            width: 1024px;
            height: 1024px;
            overflow: hidden;
          }

          #background {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @keyframes sparkleFall {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
          }

          @keyframes sparklePulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.78; }
          }

          #tree {
            position: absolute;
            left: 50%;
            top: 72%;
            transform: translate(-50%, -50%);
            width: 82%;
            height: 82%;
            object-fit: contain;
            z-index: 3;
          }
        </style>
      </head>

      <body>
        <div id="scene">

          <img
            id="background"
            src="${background}"
          >

          <img
            id="tree"
            src="${tree}"
          >

          ${decorationHTML}

          ${effectHTML}

          ${sparkleHTML}

        </div>
      </body>
      </html>
    `;

    await page.setContent(
      html,
      {
        waitUntil: "load"
      }
    );

    await page.evaluate(
      async () => {
        const images =
          Array.from(
            document.images
          );

        await Promise.all(
          images.map(
            image =>
              new Promise(
                resolve => {
                  if (
                    image.complete
                  ) {
                    resolve();
                  } else {
                    image.onload =
                      resolve;

                    image.onerror =
                      resolve;
                  }
                }
              )
          )
        );
      }
    );

    return await page.screenshot(
      {
        type: "png"
      }
    );
  } catch (error) {
    const message =
      error?.message ||
      String(error);

    if (
      message.includes("429") ||
      message.toLowerCase().includes(
        "rate limit"
      )
    ) {
      throw new Error(
        "Cloudflare Browser Rendering is rate-limited right now. Please wait a little before rendering another tree."
      );
    }

    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error(
          "Browser close error:",
          closeError
        );
      }
    }
  }
}

function escapeHTML(value) {
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

/* =========================================================
   SPARKLES
========================================================= */

function cleanSparkles(player) {
  const now =
    Date.now();

  const before =
    (
      player.sparklesOnTree ||
      []
    ).length;

  player.sparklesOnTree =
    (
      player.sparklesOnTree ||
      []
    ).filter(
      sparkle => {
        const createdAt =
          Number(
            sparkle.createdAt
          ) || now;

        return (
          now - createdAt <
          SPARKLE_LIFETIME
        );
      }
    );

  const after =
    player.sparklesOnTree.length;

  return before - after;
}

function randomSparkle() {
  const roll = Math.random();

  if (roll < 0.45) {
    return {
      id: "pink",
      name: "Pink Sparkle",
      emoji: "🩷",
      value: 10
    };
  }

  if (roll < 0.72) {
    return {
      id: "rainbow",
      name: "Rainbow Sparkle",
      emoji: "🌈",
      value: 20
    };
  }

  if (roll < 0.92) {
    return {
      id: "moon",
      name: "Moon Sparkle",
      emoji: "🌙",
      value: 30
    };
  }

  return {
    id: "star",
    name: "Star Sparkle",
    emoji: "⭐",
    value: 50
  };
}

function maybeSpawnSparkles(
  player
) {
  if (
    Math.random() >
    SPARKLE_CHANCE
  ) {
    return 0;
  }

  const amount =
    randomInt(
      MIN_SPARKLES_PER_SPAWN,
      MAX_SPARKLES_PER_SPAWN
    );

  let spawned = 0;

  for (
    let i = 0;
    i < amount &&
    player.sparklesOnTree.length <
      MAX_ACTIVE_SPARKLES;
    i++
  ) {
    const sparkle =
      randomSparkle();

    player.sparklesOnTree.push(
      {
        id: crypto.randomUUID(),
        kind: sparkle.id,
        name: sparkle.name,
        emoji: sparkle.emoji,
        value: sparkle.value,
        x: randomInt(30, 70),
        y: randomInt(30, 72),
        createdAt: Date.now()
      }
    );

    spawned++;
  }

  return spawned;
}

/* =========================================================
   CHAOS EVENTS
   IMPORTANT:
   CHAOS IS RANDOMLY SCHEDULED.
   WATER DOES NOT TRIGGER CHAOS.
========================================================= */

function getDisplayName(player) {
  return (
    player.displayName ||
    player.username ||
    "A Werewife"
  );
}

async function announceChaos(
  env,
  guildId,
  message
) {
  if (!guildId) return;

  const state =
    await getGuildState(
      env,
      guildId
    );

  if (
    state.announcementChannelId
  ) {
    await sendChannelMessage(
      env,
      state.announcementChannelId,
      `💥 **WEREWIVES CHAOS EVENT!**\n${message}`
    );
    return true;
  }

  const channels =
    await getGuildTextChannels(
      env,
      guildId
    );

  if (channels.length) {
    await sendChannelMessage(
      env,
      channels[0].id,
      `💥 **WEREWIVES CHAOS EVENT!**\n${message}`
    );
    return true;
  }

  return false;
}

async function getGuildMembers(env, guildId) {
  if (!guildId) return [];

  const members = [];
  let after = "";

  for (let page = 0; page < 10; page++) {
    const query = after
      ? `?limit=1000&after=${after}`
      : "?limit=1000";

    const response = await discordRequest(
      env,
      `/guilds/${guildId}/members${query}`
    );

    if (!response.ok) {
      console.error(
        "Guild members request failed:",
        response.status,
        await response.text()
      );
      break;
    }

    const pageMembers = await response.json();
    if (!Array.isArray(pageMembers) || !pageMembers.length) break;

    for (const member of pageMembers) {
      const user = member?.user;
      if (user?.id && !user.bot) {
        members.push({
          id: user.id,
          username: user.username || "",
          displayName:
            member.nick ||
            user.global_name ||
            user.username ||
            "Werewife"
        });
      }
    }

    if (pageMembers.length < 1000) break;
    after = pageMembers[pageMembers.length - 1]?.user?.id || "";
    if (!after) break;
  }

  return members;
}

function memberMention(member) {
  return `<@${member.id}>`;
}

async function runRandomChaosEvent(
  env,
  guildId
) {
  if (!guildId) return false;

  let members = [];

  try {
    members = await getGuildMembers(env, guildId);
  } catch (error) {
    console.error(`Chaos member lookup failed for guild ${guildId}:`, error);
  }

  /*
    A member-list/API problem must never make Chaos invisible.
    If Discord does not return members, announce a guaranteed
    server-wide event anyway.
  */
  if (!members.length) {
    const event = CHAOS_EVENTS.filter(e => e.type === "everyone")[
      randomInt(0, CHAOS_EVENTS.filter(e => e.type === "everyone").length - 1)
    ];
    const amount = randomInt(event.min, event.max);
    await announceChaos(
      env,
      guildId,
      `${event.message} **+${amount} sparkles** to the Werewives! ✨`
    );
    console.log(`Chaos fallback announcement for guild ${guildId}`);
    return true;
  }

  const event = CHAOS_EVENTS[randomInt(0, CHAOS_EVENTS.length - 1)];

  const amount = randomInt(event.min, event.max);

  if (event.type === "everyone") {
    let affected = 0;

    for (const member of members) {
      const player = await getPlayer(env, member.id);
      player.userId = member.id;
      player.username = member.username;
      player.displayName = member.displayName;
      player.sparkles = Math.max(
        0,
        Number(player.sparkles || 0) + amount
      );
      await savePlayer(env, player);
      affected++;
    }

    const sample = members
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(10, members.length))
      .map(memberMention)
      .join(" ");

    const suffix =
      members.length > 10 ? " … and everyone else!" : "";

    const text =
      `${sample}${suffix}\n${event.message} **${amount >= 0 ? "+" : ""}${amount} sparkles** to everyone!`;

    await announceChaos(env, guildId, text);

    console.log(
      `Chaos event for guild ${guildId}: everyone, affected ${affected} current members`
    );

    return true;
  }

  const target =
    members[randomInt(0, members.length - 1)];

  const player = await getPlayer(env, target.id);
  player.userId = target.id;
  player.username = target.username;
  player.displayName = target.displayName;
  player.sparkles = Math.max(
    0,
    Number(player.sparkles || 0) + amount
  );

  await savePlayer(env, player);

  const amountText = amount >= 0 ? `+${amount}` : `${amount}`;
  const personality = getPersonality(player);
  const text =
    `${memberMention(target)} **${target.displayName}** — ${event.message} **${amountText} sparkles**\n🎭 ${personality.name} Tree energy detected.`;

  await announceChaos(env, guildId, text);

  console.log(
    `Chaos event for guild ${guildId}: current member ${target.id}`
  );

  return true;
}

async function processChaosEvents(
  env
) {
  const now = Date.now();
  const guildIds = await getKnownGuildIds(env);

  for (const guildId of guildIds) {
    try {
      const state = await getGuildState(env, guildId);

      if (
        state.chaosScheduleVersion !== CHAOS_SCHEDULE_VERSION ||
        !state.nextChaosAt ||
        Number(state.nextChaosAt) <= 0
      ) {
        state.chaosScheduleVersion = CHAOS_SCHEDULE_VERSION;
        state.nextChaosAt = now + CHAOS_INTERVAL;
        await saveGuildState(env, guildId, state);
        continue;
      }

      if (now < Number(state.nextChaosAt)) {
        continue;
      }

      const happened = await runRandomChaosEvent(env, guildId);

      state.chaosScheduleVersion = CHAOS_SCHEDULE_VERSION;
      state.lastChaosAt = now;
      state.nextChaosAt = now + CHAOS_INTERVAL;

      if (happened) {
        state.lastChaosEvent = easternDateKey();
      }

      await saveGuildState(env, guildId, state);
    } catch (error) {
      console.error(`Chaos processing failed for guild ${guildId}:`, error);
    }
  }
}

/* =========================================================
   PLAYER KEY LIST
========================================================= */

async function listAllPlayerKeys(
  env
) {
  const keys = [];
  let cursor;

  do {
    const result =
      await env.TREE_DATA.list({
        cursor
      });

    for (const key of result.keys) {
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

    cursor =
      result.list_complete
        ? undefined
        : result.cursor;
  } while (cursor);

  return keys;
}

/* =========================================================
   WATER
   30 MINUTE COOLDOWN
   DOES NOT TRIGGER CHAOS
========================================================= */

async function handleWater(
  env,
  interaction
) {
  await acknowledge(
    env,
    interaction
  );

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  try {
    const player =
      await getPlayer(
        env,
        user.id
      );

    updatePlayerIdentity(
      player,
      interaction
    );

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

      player.sceneMessage =
        `💧 Your tree needs a little time to absorb that water! Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;

      await savePlayer(
        env,
        player
      );

      await updateTreeMessage(
        env,
        interaction,
        player
      );

      return;
    }

    player.lastWater =
      now;
    player.waterCount =
      Number(player.waterCount || 0) + 1;

    player.exp +=
      EXP_PER_WATER;

    const oldLevel =
      player.level;

    applyLevelUps(
      player
    );

    const levelReward =
      claimAvailableLevelRewards(
        player
      );

    const cleaned =
      cleanSparkles(
        player
      );

    const spawned =
      maybeSpawnSparkles(
        player
      );

    /*
      NO CHAOS CALL HERE.
      Chaos is handled only by scheduled().
    */

    const personality = getPersonality(player);

    const parts = [
      `💧 You watered your tree! +${EXP_PER_WATER} EXP.`,
      `🎭 **${personality.name} Tree:** ${personality.messages[randomInt(0, personality.messages.length - 1)]}`
    ];

    if (
      player.level >
      oldLevel
    ) {
      parts.push(
        `🎉 Your tree reached **Level ${player.level}**!`
      );
    }

    if (
      levelReward > 0
    ) {
      parts.push(
        `🎁 Level rewards: +${levelReward} sparkles!`
      );
    }

    if (
      spawned > 0
    ) {
      parts.push(
        `✨ ${spawned} sparkles appeared on your tree!`
      );
    }

    player.sceneMessage =
      parts.join("\n");

    await savePlayer(
      env,
      player
    );

    /*
      Watering must still succeed even when Browser Rendering
      is temporarily rate-limited. The saved state is enough
      for the interaction response, so do not render here.
    */
    await updateTreeMessage(
      env,
      interaction,
      player
    );
  } catch (error) {
    console.error(
      "Water error:",
      error
    );

    const message =
      error?.message ||
      "Unknown error";

    await editOriginalResponse(
      env,
      interaction,
      {
        content:
          `❌ Water couldn't be completed.\\n\\n${message}`,
        components:
          treeButtons(getUserFromInteraction(interaction)?.id || "", player)
      }
    );
  }
}

/* =========================================================
   CATCH SPARKLES
========================================================= */

async function handleCatch(
  env,
  interaction,
  sparkleId = null
) {
  await acknowledge(
    env,
    interaction
  );

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) {
    return;
  }

  try {
    const player =
      await getPlayer(
        env,
        user.id
      );

    updatePlayerIdentity(
      player,
      interaction
    );

    cleanSparkles(player);

    const sparkles =
      Array.isArray(player.sparklesOnTree)
        ? player.sparklesOnTree
        : [];

    if (!sparkles.length) {
      player.sceneMessage =
        "✨ There aren't any sparkles on your tree right now!";

      await savePlayer(env, player);
      await updateTreeMessage(env, interaction, player);
      return;
    }

    let caughtSparkle = null;

    if (sparkleId) {
      caughtSparkle =
        sparkles.find(
          sparkle => sparkle.id === sparkleId
        );

      if (!caughtSparkle) {
        player.sceneMessage =
          "✨ That sparkle has already been caught or expired!";

        await savePlayer(env, player);
        await updateTreeMessage(env, interaction, player);
        return;
      }
    } else {
      /*
        Legacy Catch Sparkles buttons now catch only ONE sparkle,
        never the whole tree. Prefer the first active sparkle.
      */
      caughtSparkle = sparkles[0];
    }

    player.sparklesOnTree =
      sparkles.filter(
        sparkle => sparkle.id !== caughtSparkle.id
      );

    const value =
      Math.max(
        0,
        Number(caughtSparkle.value) || 0
      );

    player.sparkles += value;
    player.sparklesCaught =
      Number(player.sparklesCaught || 0) + 1;
    player.sparkleValueCaught =
      Number(player.sparkleValueCaught || 0) + value;

    player.sceneMessage =
      `✨ You caught a **${caughtSparkle.name || "Sparkle"}** ${caughtSparkle.emoji || "✨"} and earned **+${value} sparkles!**`;

    await savePlayer(env, player);
    await updateTreeMessage(env, interaction, player);

  } catch (error) {
    console.error(
      "Catch Sparkles error:",
      error
    );

    await editOriginalResponse(
      env,
      interaction,
      {
        content:
          `❌ Catch Sparkles hit an error.\n\n\`${error?.message || "Unknown error"}\``,
        components:
          treeButtons(getUserFromInteraction(interaction)?.id || "")
      }
    );
  }
}

/* =========================================================
   RECYCLE
   INPUT: 20–200 SPARKLES
   PAYOUT: RANDOM 1x–10x
========================================================= */

async function handleRecycle(
  env,
  interaction,
  amountInput
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) {
    return;
  }

  const player =
    await getPlayer(
      env,
      user.id
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  const now = Date.now();

  if (
    player.lastRecycle &&
    now - player.lastRecycle < RECYCLE_COOLDOWN
  ) {
    const remaining =
      RECYCLE_COOLDOWN -
      (now - player.lastRecycle);

    const totalMinutes =
      Math.ceil(remaining / 60000);

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    const timeText =
      hours > 0
        ? `${hours} hour${hours === 1 ? "" : "s"}${minutes > 0 ? ` and ${minutes} minute${minutes === 1 ? "" : "s"}` : ""}`
        : `${minutes} minute${minutes === 1 ? "" : "s"}`;

    await sendText(
      env,
      interaction,
      `♻️ Your Sparkle Recycler is cooling down! Try again in **${timeText}**.`
    );

    return;
  }

  const amount =
    Math.floor(
      Number(amountInput)
    );

  if (
    !Number.isFinite(amount) ||
    amount < 20 ||
    amount > 200
  ) {
    await sendText(
      env,
      interaction,
      "♻️ You can recycle between **20 and 200 sparkles** at a time."
    );

    return;
  }

  if (
    player.sparkles <
    amount
  ) {
    await sendText(
      env,
      interaction,
      `❌ You only have **${player.sparkles} sparkles**, so you can't recycle **${amount}**.`
    );

    return;
  }

  player.lastRecycle = now;

  /*
    Remove the input amount first.
  */

  player.sparkles -=
    amount;

  /*
    Random multiplier from 1x through 10x.
  */

  const multiplier =
    randomInt(
      1,
      10
    );

  const payout =
    amount *
    multiplier;

  player.sparkles +=
    payout;

  const net =
    payout -
    amount;

  player.sceneMessage =
    `♻️ You recycled **${amount} sparkles** and got **${payout} sparkles** back! (${multiplier}×)`;

  await savePlayer(
    env,
    player
  );

  const netText =
    net >= 0
      ? `+${net}`
      : `${net}`;

  await sendText(
    env,
    interaction,
    `♻️ **SPARKLE RECYCLER**\n\nYou put in **${amount} sparkles**.\n\n🎰 Multiplier: **${multiplier}×**\n✨ You got back: **${payout} sparkles**\n💰 Net change: **${netText} sparkles**\n\nYou now have **${player.sparkles} sparkles**! 💖`,
    [
      row(
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

/* =========================================================
   DAILY RIDDLE
========================================================= */

async function handleDailyRiddle(
  env,
  interaction,
  answer = ""
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  const player =
    await getPlayer(
      env,
      user.id
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  const today =
    easternDateKey();

  if (
    player.dailyRiddleDay !==
    today
  ) {
    player.dailyRiddleDay =
      today;

    player.dailyRiddleSolved =
      false;
  }

  const index =
    Math.abs(
      hashString(today)
    ) % RIDDLES.length;

  const riddle =
    RIDDLES[index];

  if (!answer) {
    await sendText(
      env,
      interaction,
      `🧩 **Daily Riddle**\n\n${riddle.question}\n\nUse \`/daily-riddle answer:your-answer\` to answer it.`,
      [
        row(
          button(
            "🌳 Back to Tree",
            "back_tree",
            2
          )
        )
      ]
    );

    await savePlayer(
      env,
      player
    );

    return;
  }

  if (
    player.dailyRiddleSolved
  ) {
    await sendText(
      env,
      interaction,
      "🧩 You've already solved today's riddle! Come back tomorrow. 💖"
    );

    return;
  }

  const normalized =
    String(answer)
      .trim()
      .toLowerCase();

  if (
    normalized !==
    riddle.answer
  ) {
    await sendText(
      env,
      interaction,
      "❌ Nope! That's not the answer. Try again!"
    );

    return;
  }

  const reward =
    100 +
    player.dailyRiddleWins *
      5;

  player.sparkles +=
    reward;

  player.dailyRiddleSolved =
    true;

  player.dailyRiddleWins++;

  player.sceneMessage =
    `🧩 Correct! You earned **${reward} sparkles!**`;

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    `🧩 **Correct!** 🎉\n\nYou earned **${reward} sparkles!**\n\nYour next correct daily riddle starts at ${reward + 5} sparkles.`,
    [
      row(
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

function hashString(value) {
  let hash = 0;

  for (
    let i = 0;
    i < value.length;
    i++
  ) {
    hash =
      (hash << 5) -
      hash +
      value.charCodeAt(i);

    hash |= 0;
  }

  return hash;
}

/* =========================================================
   SHOP
========================================================= */

async function showShop(
  env,
  interaction
) {
  await sendText(
    env,
    interaction,
    "🛍️ **Werewives Tree Shop**\n\nChoose a category:",
    [
      row(
        button(
          "🌌 Backgrounds",
          "shop_backgrounds",
          2
        ),
        button(
          "🌳 Trees",
          "shop_trees",
          2
        ),
        button(
          "🎀 Decorations",
          "shop_decorations",
          2
        ),
        button(
          "✨ Effects",
          "shop_effects",
          2
        )
      ),

      row(
        button(
          "🎃 Limited Shop",
          "shop_limited",
          1
        ),
        button(
          "🎁 Special / Holiday",
          "shop_special",
          2
        )
      ),

      row(
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

async function showBackgroundShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const items = [
    ["candyland_background", "🍬 Candy Land", "buy_candyland"],
    ["magic_mushroom_background", "🍄 Magic Mushroom", "buy_magic_mushroom"],
    ["field_day_background", "🌾 Field Day", "buy_field_day"],
    ["red_forest_background", "🌲 Red Forest", "buy_red_forest"]
  ];

  const buttons = items.map(
    ([itemId, label, buttonId]) => {
      const owned = player.inventory.includes(itemId);
      return button(
        owned
          ? `${label} Owned`
          : `${label} — ${SHOP_ITEMS[itemId].price}`,
        buttonId,
        owned ? 2 : 1,
        owned
      );
    }
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(row(...buttons.slice(i, i + 5)));
  }

  rows.push(row(button("⬅️ Back", "shop", 2)));

  await sendText(
    env,
    interaction,
    "🌌 **Backgrounds**\n\n✨ Prices are in sparkles.",
    rows
  );
}
async function showTreeShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const items = [
    ["cotton_candy_tree", "🍭 Cotton Candy", "buy_cotton_candy"],
    ["shadow_tree", "🌑 Shadow", "buy_shadow_tree"],
    ["full_cherry_tree", "🌸 Full Cherry", "buy_full_cherry_tree"],
    ["pine_tree", "🌲 Pine", "buy_pine_tree"],
    ["red_tree", "❤️ Red", "buy_red_tree"],
    ["soul_tree", "💙 Soul", "buy_soul_tree"]
  ];

  const buttons = items.map(
    ([itemId, label, buttonId]) => {
      const owned = player.inventory.includes(itemId);
      return button(
        owned
          ? `${label} Owned`
          : `${label} — ${SHOP_ITEMS[itemId].price}`,
        buttonId,
        owned ? 2 : 1,
        owned
      );
    }
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(row(...buttons.slice(i, i + 5)));
  }

  rows.push(row(button("⬅️ Back", "shop", 2)));

  await sendText(
    env,
    interaction,
    "🌳 **Trees**\n\n✨ Prices are in sparkles.",
    rows
  );
}
async function showDecorationShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const pandaOwned =
    player.inventory.includes(
      "panda_decoration"
    );

  const catOwned =
    player.inventory.includes(
      "cat_decoration"
    );

  await sendText(
    env,
    interaction,
    `🎀 **Decoration Shop**\n\n🐼 **Panda Decoration** — 3000 sparkles\n${pandaOwned ? "✅ Owned" : ""}\n\n🐱 **Cat Decoration** — 1500 sparkles\n${catOwned ? "✅ Owned" : ""}`,
    [
      row(
        button(
          pandaOwned
            ? "🐼 Panda Owned"
            : "🐼 Buy Panda — 3000",
          "buy_panda",
          pandaOwned ? 2 : 1,
          pandaOwned
        ),

        button(
          catOwned
            ? "🐱 Cat Owned"
            : "🐱 Buy Cat — 1500",
          "buy_cat",
          catOwned ? 2 : 1,
          catOwned
        )
      ),

      row(
        button(
          "⬅️ Back",
          "shop",
          2
        )
      )
    ]
  );
}

async function showEffectShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const items = [
    ["butterflies_effect", "🦋 Butterflies", "buy_butterflies"],
    ["hearts_effect", "💕 Hearts", "buy_hearts"]
  ];

  const buttons = items.map(
    ([itemId, label, buttonId]) => {
      const owned = player.inventory.includes(itemId);
      return button(
        owned
          ? `${label} Owned`
          : `${label} — ${SHOP_ITEMS[itemId].price}`,
        buttonId,
        owned ? 2 : 1,
        owned
      );
    }
  );

  await sendText(
    env,
    interaction,
    "✨ **Tree Effects**\n\nEffects are layered on top of your tree. ✨",
    [
      row(...buttons),
      row(button("⬅️ Back", "shop", 2))
    ]
  );
}

async function showLimitedShop(
  env,
  interaction
) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);

  const items = [
    ["purr_princess_effect", "👑 Purr Princess", "buy_purr_princess"],
    ["kitty_tree", "🐱 Kitty Tree", "buy_kitty_tree"],
    ["cozy_cat_background", "🐱 Cozy Cat", "buy_cozy_cat"],
    ["green_glow_tree", "💚 Green Glow Tree", "buy_green_glow_tree"],
    ["green_glow_background", "💚 Green Glow Background", "buy_green_glow_background"],
    ["green_glow_effect", "💚 Green Glow Effect", "buy_green_glow_effect"]
  ];

  const buttons = items.map(([itemId, label, buttonId]) => {
    const owned = player.inventory.includes(itemId);
    const price = SHOP_ITEMS[itemId].price;
    return button(
      owned ? `${label} Owned` : `${label} — ${price}`,
      buttonId,
      owned ? 2 : 1,
      owned
    );
  });

  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(row(...buttons.slice(i, i + 2)));
  }

  rows.push(
    row(
      button("🎃 Other Limited Items", "shop_limited_halloween", 2),
      button("⬅️ Back", "shop", 2)
    )
  );

  await sendText(
    env,
    interaction,
    "🛍️ **LIMITED SHOP**\n\n🐱 **CAT BUNDLE**\n👑 Purr Princess — 5,000 sparkles\n🐱 Kitty Tree — 5,000 sparkles\n🐱 Cozy Cat — 5,000 sparkles\n\n💚 **GREEN GLOW SET**\n🌳 Green Glow Tree — 20,000 sparkles\n🌌 Green Glow Background — 10,000 sparkles\n✨ Green Glow Effect — 10,000 sparkles",
    rows
  );
}

async function showLimitedHalloweenShop(
  env,
  interaction
) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);

  const halloweenOwned = player.inventory.includes("halloween_background");
  const pumpkinOwned = player.inventory.includes("pumpkin_cat_decoration");
  const halloweenTreeOwned = player.inventory.includes("halloween_tree");

  await sendText(
    env,
    interaction,
    `🎃 **Other Limited Items**\n\n🎃 **Halloween Background** — 150 sparkles\n${halloweenOwned ? "✅ Owned" : ""}\n\n🐈 **Pumpkin Cat** — 250 sparkles\n${pumpkinOwned ? "✅ Owned" : ""}\n\n🎃🌳 **Halloween Tree** — 2000 sparkles\n${halloweenTreeOwned ? "✅ Owned" : ""}`,
    [
      row(
        button(halloweenOwned ? "🎃 Halloween Owned" : "🎃 Buy Halloween — 150", "buy_halloween", halloweenOwned ? 2 : 1, halloweenOwned),
        button(pumpkinOwned ? "🐈 Pumpkin Cat Owned" : "🐈 Buy Pumpkin Cat — 250", "buy_pumpkin_cat", pumpkinOwned ? 2 : 1, pumpkinOwned)
      ),
      row(
        button(halloweenTreeOwned ? "🎃🌳 Halloween Tree Owned" : "🎃🌳 Buy Halloween Tree — 2000", "buy_halloween_tree", halloweenTreeOwned ? 2 : 1, halloweenTreeOwned)
      ),
      row(button("⬅️ Back to Limited Shop", "shop_limited", 2))
    ]
  );
}

async function showSpecialShop(
  env,
  interaction
) {
  await sendText(
    env,
    interaction,
    "🎁 **Special / Holiday Shop**\n\n✨ More special items are coming soon!",
    [
      row(
        button(
          "⬅️ Back",
          "shop",
          2
        )
      )
    ]
  );
}

/* =========================================================
   BUY ITEMS
========================================================= */

async function buyItem(
  env,
  interaction,
  itemId
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  const player =
    await getPlayer(
      env,
      user.id
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  const item =
    SHOP_ITEMS[itemId];

  if (!item) {
    await sendText(
      env,
      interaction,
      "❌ That item doesn't exist."
    );

    return;
  }

  if (
    player.inventory.includes(
      itemId
    )
  ) {
    await sendText(
      env,
      interaction,
      `✅ You already own ${item.name}!`
    );

    return;
  }

  if (
    player.sparkles <
    item.price
  ) {
    await sendText(
      env,
      interaction,
      `❌ You need **${item.price} sparkles**, but you only have **${player.sparkles}**.`
    );

    return;
  }

  player.sparkles -=
    item.price;

  player.inventory.push(
    itemId
  );
  player.shopPurchases =
    Number(player.shopPurchases || 0) + 1;

  if (
    itemId === "purr_princess_effect" ||
    itemId === "kitty_tree" ||
    itemId === "cozy_cat_background" ||
    itemId === "cat_decoration" ||
    itemId === "pumpkin_cat_decoration"
  ) {
    player.catItemBought = true;
  }

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    `🎉 You bought **${item.name}** for **${item.price} sparkles**!\n\nGo to **Customize** to equip it.`
  );
}

/* =========================================================
   CUSTOMIZE
========================================================= */

async function showCustomize(
  env,
  interaction
) {
  await sendText(
    env,
    interaction,
    "🎨 **Customize Your Tree**\n\nChoose what you'd like to change:",
    [
      row(
        button(
          "🌌 Backgrounds",
          "custom_backgrounds",
          2
        ),
        button(
          "🌳 Trees",
          "custom_trees",
          2
        ),
        button(
          "🎀 Decorations",
          "custom_decorations",
          2
        ),
        button(
          "✨ Effects",
          "custom_effects",
          2
        )
      ),

      row(
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

async function showCustomBackgrounds(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const buttons = [];

  buttons.push(
    button(
      "💖 Pink Sky",
      "equip_theme_cherry",
      player.equipped.theme ===
        "cherry"
        ? 3
        : 2
    )
  );

  if (
    player.inventory.includes(
      "halloween_background"
    )
  ) {
    buttons.push(
      button(
        "🎃 Halloween",
        "equip_theme_halloween",
        player.equipped.theme ===
          "halloween"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "candyland_background"
    )
  ) {
    buttons.push(
      button(
        "🍬 Candy Land",
        "equip_theme_candyland",
        player.equipped.theme ===
          "candyland"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "stoned_birthday_background"
    )
  ) {
    buttons.push(
      button(
        "🎂 Birthday",
        "equip_theme_stoned_birthday",
        player.equipped.theme ===
          "stoned_birthday"
          ? 3
          : 2
      )
    );
  }

  const extraBackgrounds = [
    ["magic_mushroom_background", "🍄 Magic Mushroom", "magic_mushroom"],
    ["field_day_background", "🌾 Field Day", "field_day"],
    ["red_forest_background", "🌲 Red Forest", "red_forest"],
    ["cozy_cat_background", "🐱 Cozy Cat", "cozy_cat"],
    ["green_glow_background", "💚 Green Glow", "green_glow"]
  ];

  for (const [itemId, label, value] of extraBackgrounds) {
    if (player.inventory.includes(itemId)) {
      buttons.push(
        button(
          label,
          `equip_theme_${value}`,
          player.equipped.theme === value ? 3 : 2
        )
      );
    }
  }

  const rows = [];

  for (
    let i = 0;
    i < buttons.length;
    i += 5
  ) {
    rows.push(
      row(
        ...buttons.slice(
          i,
          i + 5
        )
      )
    );
  }

  rows.push(
    row(
      button(
        "⬅️ Back",
        "customize",
        2
      )
    )
  );

  await sendText(
    env,
    interaction,
    "🌌 **Background Customization**",
    rows
  );
}

async function showCustomTrees(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const items = [
    ["cherry", "🌸 Cherry", null],
    ["cotton_candy", "🍭 Cotton Candy", "cotton_candy_tree"],
    ["stoned_birthday", "🎂 Birthday", "stoned_birthday_tree"],
    ["shadow", "🌑 Shadow", "shadow_tree"],
    ["full_cherry", "🌸 Full Cherry", "full_cherry_tree"],
    ["pine", "🌲 Pine", "pine_tree"],
    ["red", "❤️ Red", "red_tree"],
    ["soul", "💙 Soul", "soul_tree"],
    ["kitty_tree", "🐱 Kitty Tree", "kitty_tree"],
    ["halloween_tree", "🎃 Halloween", "halloween_tree"],
    ["green_glow", "💚 Green Glow", "green_glow"]
  ];

  const buttons = [];

  for (const [value, label, inventoryId] of items) {
    if (!inventoryId || player.inventory.includes(inventoryId)) {
      buttons.push(
        button(
          label,
          `equip_tree_${value}`,
          player.equipped.tree === value ? 3 : 2
        )
      );
    }
  }

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(row(...buttons.slice(i, i + 5)));
  }

  rows.push(row(button("⬅️ Back", "customize", 2)));

  await sendText(
    env,
    interaction,
    "🌳 **Tree Customization**",
    rows
  );
}

async function showCustomEffects(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const buttons = [];

  if (player.inventory.includes("butterflies_effect")) {
    buttons.push(
      button(
        "🦋 Butterflies",
        "equip_effect_butterflies",
        player.equipped.effect === "butterflies" ? 3 : 2
      )
    );
  }

  if (player.inventory.includes("hearts_effect")) {
    buttons.push(
      button(
        "💕 Hearts",
        "equip_effect_hearts",
        player.equipped.effect === "hearts" ? 3 : 2
      )
    );
  }

  if (player.inventory.includes("green_glow_effect")) {
    buttons.push(
      button(
        "💚 Green Glow",
        "equip_effect_green_glow",
        player.equipped.effect === "green_glow" ? 3 : 2
      )
    );
  }

  if (player.inventory.includes("purr_princess_effect")) {
    buttons.push(
      button(
        "👑 Purr Princess",
        "equip_effect_purr_princess",
        player.equipped.effect === "purr_princess" ? 3 : 2
      )
    );
  }

  buttons.push(
    button(
      "❌ Remove",
      "equip_effect_none",
      player.equipped.effect === null ? 3 : 2
    )
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(row(...buttons.slice(i, i + 5)));
  }

  rows.push(row(button("⬅️ Back", "customize", 2)));

  await sendText(
    env,
    interaction,
    "✨ **Effect Customization**\n\nEffects are layered on top of your tree.",
    rows
  );
}
async function showCustomDecorations(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const buttons = [];

  if (
    player.inventory.includes(
      "pumpkin_cat_decoration"
    )
  ) {
    buttons.push(
      button(
        "🎃 Pumpkin Cat",
        "equip_decoration_pumpkin_cat",
        player.equipped.decoration ===
          "pumpkin_cat"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "stoned_balloon_decoration"
    )
  ) {
    buttons.push(
      button(
        "🎈 Stoned Balloon",
        "equip_decoration_stoned_balloon",
        player.equipped.decoration ===
          "stoned_balloon"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "panda_decoration"
    )
  ) {
    buttons.push(
      button(
        "🐼 Panda",
        "equip_decoration_panda",
        player.equipped.decoration ===
          "panda"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "cat_decoration"
    )
  ) {
    buttons.push(
      button(
        "🐱 Cat",
        "equip_decoration_cat",
        player.equipped.decoration ===
          "cat"
          ? 3
          : 2
      )
    );
  }

  buttons.push(
    button(
      "❌ Remove",
      "equip_decoration_none",
      player.equipped.decoration ===
        null
        ? 3
        : 2
    )
  );

  const rows = [];

  for (
    let i = 0;
    i < buttons.length;
    i += 5
  ) {
    rows.push(
      row(
        ...buttons.slice(
          i,
          i + 5
        )
      )
    );
  }

  rows.push(
    row(
      button(
        "⬅️ Back",
        "customize",
        2
      )
    )
  );

  await sendText(
    env,
    interaction,
    "🎀 **Decoration Customization**",
    rows
  );
}

async function equipTheme(
  env,
  interaction,
  theme
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const allowed = {
    cherry: true,

    halloween:
      player.inventory.includes(
        "halloween_background"
      ),

    candyland:
      player.inventory.includes(
        "candyland_background"
      ),

    magic_mushroom:
      player.inventory.includes(
        "magic_mushroom_background"
      ),

    field_day:
      player.inventory.includes(
        "field_day_background"
      ),

    red_forest:
      player.inventory.includes(
        "red_forest_background"
      ),

    stoned_birthday:
      player.inventory.includes(
        "stoned_birthday_background"
      ),

    cozy_cat:
      player.inventory.includes(
        "cozy_cat_background"
      ),

    green_glow:
      player.inventory.includes(
        "green_glow_background"
      )
  };

  if (!allowed[theme]) {
    await sendText(
      env,
      interaction,
      "❌ You don't own that background."
    );

    return;
  }

  player.equipped.theme =
    theme;

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    "✨ Background equipped!"
  );
}

async function equipTree(
  env,
  interaction,
  tree
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const allowed = {
    cherry: true,

    cotton_candy:
      player.inventory.includes(
        "cotton_candy_tree"
      ),

    stoned_birthday:
      player.inventory.includes(
        "stoned_birthday_tree"
      ),

    shadow:
      player.inventory.includes(
        "shadow_tree"
      ),

    full_cherry:
      player.inventory.includes(
        "full_cherry_tree"
      ),

    pine:
      player.inventory.includes(
        "pine_tree"
      ),

    red:
      player.inventory.includes(
        "red_tree"
      ),

    soul:
      player.inventory.includes(
        "soul_tree"
      ),

    halloween_tree:
      player.inventory.includes(
        "halloween_tree"
      ),

    kitty_tree:
      player.inventory.includes(
        "kitty_tree"
      ),

    green_glow:
      player.inventory.includes(
        "green_glow_tree"
      )
  };

  if (!allowed[tree]) {
    await sendText(
      env,
      interaction,
      "❌ You don't own that tree."
    );

    return;
  }

  player.equipped.tree =
    tree;

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    "🌳 Tree equipped!"
  );
}

async function equipEffect(
  env,
  interaction,
  effect
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  if (effect === null) {
    player.equipped.effect = null;
  } else {
    const inventoryId = {
      butterflies: "butterflies_effect",
      hearts: "hearts_effect",
      purr_princess: "purr_princess_effect",
      green_glow: "green_glow_effect"
    }[effect];

    if (
      !inventoryId ||
      !player.inventory.includes(inventoryId)
    ) {
      await sendText(
        env,
        interaction,
        "❌ You don't own that effect."
      );
      return;
    }

    player.equipped.effect = effect;
  }

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    effect === null
      ? "✨ Effect removed!"
      : "✨ Effect equipped!"
  );
}

async function equipDecoration(
  env,
  interaction,
  decoration
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  if (
    decoration === null
  ) {
    player.equipped.decoration =
      null;
  } else {
    const inventoryId = {
      pumpkin_cat:
        "pumpkin_cat_decoration",

      stoned_balloon:
        "stoned_balloon_decoration",

      panda:
        "panda_decoration",

      cat:
        "cat_decoration"
    }[decoration];

    if (
      !inventoryId ||
      !player.inventory.includes(
        inventoryId
      )
    ) {
      await sendText(
        env,
        interaction,
        "❌ You don't own that decoration."
      );

      return;
    }

    player.equipped.decoration =
      decoration;
  }

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    decoration === null
      ? "🎀 Decoration removed!"
      : "🎀 Decoration equipped!"
  );
}

/* =========================================================
   LEADERBOARD
========================================================= */

async function showLeaderboard(
  env,
  interaction
) {
  const keys =
    await listAllPlayerKeys(
      env
    );

  const players = [];

  for (const key of keys) {
    const player =
      await getPlayer(
        env,
        key
      );

    players.push(
      player
    );
  }

  players.sort(
    (a, b) => {
      const sparkleDifference =
        b.sparkles -
        a.sparkles;

      if (
        sparkleDifference !==
        0
      ) {
        return sparkleDifference;
      }

      const levelDifference =
        b.level -
        a.level;

      if (
        levelDifference !==
        0
      ) {
        return levelDifference;
      }

      return (
        getTreeHeight(b) -
        getTreeHeight(a)
      );
    }
  );

  const top =
    players.slice(0, 10);

  if (!top.length) {
    await sendText(
      env,
      interaction,
      "🏆 Nobody is on the leaderboard yet!"
    );

    return;
  }

  const lines =
    top.map(
      (player, index) =>
        `**${index + 1}.** ${getDisplayName(player)} — ⭐ ${player.sparkles} sparkles • Level ${player.level} • 🌳 ${getTreeHeight(player)} ft`
    );

  await sendText(
    env,
    interaction,
    `🏆 **Werewives Tree Leaderboard**\n\n${lines.join("\n")}`,
    [
      row(
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

/* =========================================================
   INVENTORY
========================================================= */

async function showInventory(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const names = {
    pink_sky_background:
      "💖 Pink Sky Background",

    candyland_background:
      "🍬 Candy Land Background",

    halloween_background:
      "🎃 Halloween Background",

    cotton_candy_tree:
      "🍭 Cotton Candy Tree",

    pumpkin_cat_decoration:
      "🎃 Pumpkin Cat",

    stoned_birthday_tree:
      "🎂 Birthday Tree",

    stoned_balloon_decoration:
      "🎈 Birthday Balloon",

    stoned_birthday_background:
      "🎂 Birthday Background",

    panda_decoration:
      "🐼 Panda Decoration",

    cat_decoration:
      "🐱 Cat Decoration",
    shadow_tree: "🌑 Shadow Tree",
    full_cherry_tree: "🌸 Full Cherry Tree",
    pine_tree: "🌲 Pine Tree",
    red_tree: "❤️ Red Tree",
    soul_tree: "💙 Soul Tree",
    butterflies_effect: "🦋 Butterflies",
    hearts_effect: "💕 Hearts",
    magic_mushroom_background: "🍄 Magic Mushroom Background",
    field_day_background: "🌾 Field Day Background",
    red_forest_background: "🌲 Red Forest Background",
    halloween_tree: "🎃🌳 Halloween Tree"
  };

  const items =
    player.inventory.map(
      item =>
        names[item] ||
        item
    );

  await sendText(
    env,
    interaction,
    `🎒 **Your Inventory**\n\n${
      items.length
        ? items
            .map(
              x => `• ${x}`
            )
            .join("\n")
        : "Empty!"
    }\n\n⭐ Sparkles: **${player.sparkles}**`,
    [
      row(
        button(
          "🎨 Customize",
          "customize",
          2
        ),
        button(
          "🌳 Back to Tree",
          "back_tree",
          2
        )
      )
    ]
  );
}

/* =========================================================
   BIRTHDAY
========================================================= */

async function openBirthdayGift(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  const player =
    await getPlayer(
      env,
      user.id
    );

  if (
    !player.birthdayUnlocked
  ) {
    await sendText(
      env,
      interaction,
      "🎁 You need to unlock the birthday event first!"
    );

    return;
  }

  if (
    player.birthdayGiftClaimed
  ) {
    await sendText(
      env,
      interaction,
      "🎁 You already opened your birthday present! 💖"
    );

    return;
  }

  player.birthdayGiftClaimed =
    true;

  player.sparkles +=
    STONED_GIFT_SPARKLES;

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    `🎁🎉 **BIRTHDAY PRESENT OPENED!**\n\nYou received **+${STONED_GIFT_SPARKLES} sparkles!** ✨💖`
  );
}

/* =========================================================
   BIRTHDAY HUNT
========================================================= */

function huntGiftButton(id) {
  return [
    row(
      button(
        "🎁 Claim Present!",
        `claim_hunt_gift:${id}`,
        1
      )
    )
  ];
}

function createHuntGift() {
  const prank =
    Math.random() <
    0.25;

  if (prank) {
    return {
      id: crypto.randomUUID(),
      prank: true,
      amount: 0,
      claimed: false
    };
  }

  return {
    id: crypto.randomUUID(),
    prank: false,
    amount: randomInt(
      25,
      150
    ),
    claimed: false
  };
}

async function claimHuntGift(
  env,
  interaction,
  giftId
) {
  const guildId =
    interaction.guild_id;

  if (!guildId) {
    await sendText(
      env,
      interaction,
      "❌ This gift can only be claimed inside a server."
    );

    return;
  }

  const state =
    await getGuildState(
      env,
      guildId
    );

  const hunt =
    state.hunt;

  if (
    !hunt ||
    !hunt.active ||
    !hunt.currentGift ||
    hunt.currentGift.id !==
      giftId
  ) {
    await sendText(
      env,
      interaction,
      "🎁 That present has already been claimed!"
    );

    return;
  }

  if (
    Date.now() >=
    hunt.endAt
  ) {
    hunt.active =
      false;

    await saveGuildState(
      env,
      guildId,
      state
    );

    await sendText(
      env,
      interaction,
      "🎁 The birthday hunt is over!"
    );

    return;
  }

  if (
    hunt.currentGift.claimed
  ) {
    await sendText(
      env,
      interaction,
      "🎁 Too late! Someone else got it!"
    );

    return;
  }

  hunt.currentGift.claimed =
    true;

  hunt.currentGift.claimedBy =
    getUserFromInteraction(
      interaction
    )?.id || "";

  const gift =
    hunt.currentGift;

  hunt.currentGift = null;
  hunt.nextGiftAt =
    Date.now() +
    randomInt(
      1 * 60 * 1000,
      2 * 60 * 1000
    );

  await saveGuildState(
    env,
    guildId,
    state
  );

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  if (gift.prank) {
    await sendText(
      env,
      interaction,
      "🎁💀 **YOU GOT THE PRESENT!**\n\n...Oh.\n\nIt was a prank. 😭🦝"
    );

    return;
  }

  const player =
    await getPlayer(
      env,
      user.id
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  player.sparkles +=
    gift.amount;

  await savePlayer(
    env,
    player
  );

  await sendText(
    env,
    interaction,
    `🎁✨ **YOU GOT IT!**\n\nYou received **+${gift.amount} sparkles!** 💖`
  );
}

async function announceBirthdayHunt(
  env,
  guildId
) {
  const state =
    await getGuildState(
      env,
      guildId
    );

  const message =
    "🎂🎉 **THE WEREWIVES BIRTHDAY GIFT HUNT HAS BEGUN!** 🎉🎂\n\nFor the next **3 hours**, surprise presents will randomly appear around the server! 🎁\n\nWhen you see one, hit **🎁 Claim Present!**\n\nSome presents contain sparkles...\nSome may be pranks. 👀🦝";

  if (
    state.announcementChannelId
  ) {
    await sendChannelMessage(
      env,
      state.announcementChannelId,
      message
    );

    return;
  }

  const channels =
    await getGuildTextChannels(
      env,
      guildId
    );

  for (
    const channel of
      channels
  ) {
    await sendChannelMessage(
      env,
      channel.id,
      message
    );
  }
}

async function releaseHuntGift(
  env,
  guildId
) {
  const state =
    await getGuildState(
      env,
      guildId
    );

  if (
    !state.hunt ||
    !state.hunt.active
  ) {
    return;
  }

  let channels = [];

  if (
    state.announcementChannelId
  ) {
    channels = [
      {
        id:
          state.announcementChannelId
      }
    ];
  } else {
    channels =
      await getGuildTextChannels(
        env,
        guildId
      );
  }

  if (!channels.length) {
    return;
  }

  const channel =
    channels[
      randomInt(
        0,
        channels.length - 1
      )
    ];

  const gift =
    createHuntGift();

  state.hunt.currentGift =
    gift;

  await saveGuildState(
    env,
    guildId,
    state
  );

  const message =
    gift.prank
      ? "🎁 **A mystery birthday present appeared!**\n\nQUICK! Someone claim it! 👀"
      : "🎁 **A mystery birthday present appeared!**\n\nQUICK! Someone claim it before another Werewife does! 👀✨";

  await sendChannelMessage(
    env,
    channel.id,
    message,
    huntGiftButton(
      gift.id
    )
  );

  state.hunt.nextGiftAt =
    Date.now() +
    randomInt(
      1 * 60 * 1000,
      2 * 60 * 1000
    );

  await saveGuildState(
    env,
    guildId,
    state
  );
}

async function getKnownGuildIds(
  env
) {
  const guildIds = [];
  let cursor;

  do {
    const result =
      await env.TREE_DATA.list({
        cursor,
        prefix: "guild:"
      });

    for (
      const key of
        result.keys
    ) {
      guildIds.push(
        key.name.substring(6)
      );
    }

    cursor =
      result.list_complete
        ? undefined
        : result.cursor;
  } while (cursor);

  return guildIds;
}

async function processBirthdayEvent(
  env
) {
  const now =
    new Date();

  if (
    !isBirthdayDate(now)
  ) {
    return;
  }

  const p =
    getEasternDateParts(
      now
    );

  const currentMinutes =
    p.hour * 60 +
    p.minute;

  const startMinutes =
    16 * 60;

  const endMinutes =
    19 * 60;

  if (
    currentMinutes <
      startMinutes ||
    currentMinutes >=
      endMinutes
  ) {
    return;
  }

  const guildIds =
    await getKnownGuildIds(
      env
    );

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
      !state.hunt ||
      !state.hunt.active
    ) {
      const endAt =
        Date.now() +
        (
          (
            endMinutes -
            currentMinutes
          ) *
          60 *
          1000
        );

      state.hunt = {
        active: true,
        startedAt:
          Date.now(),
        endAt,
        nextGiftAt:
          Date.now() +
          randomInt(
            1 * 60 * 1000,
            2 * 60 * 1000
          ),
        currentGift: null
      };

      await saveGuildState(
        env,
        guildId,
        state
      );

      await announceBirthdayHunt(
        env,
        guildId
      );
    }

    const currentState =
      await getGuildState(
        env,
        guildId
      );

    if (
      !currentState.hunt ||
      !currentState.hunt.active
    ) {
      continue;
    }

    if (
      Date.now() >=
      currentState.hunt.endAt
    ) {
      currentState.hunt.active =
        false;

      await saveGuildState(
        env,
        guildId,
        currentState
      );

      if (
        currentState
          .announcementChannelId
      ) {
        await sendChannelMessage(
          env,
          currentState
            .announcementChannelId,
          "🎂💖 **The Werewives Birthday Gift Hunt has ended!**\n\nThank you for playing! ✨🦝"
        );
      }

      continue;
    }

    /*
      Birthday gifts should be frequent and should not get stuck
      waiting on a second timer. The scheduled Worker is the clock,
      so release one whenever this pass finds no active gift.
    */
    if (!currentState.hunt.currentGift) {
      await releaseHuntGift(env, guildId);
    }
  }
}

/* =========================================================
   ANNOUNCEMENTS COMMAND
========================================================= */

async function handleAnnouncements(
  env,
  interaction,
  channelId
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ This command can only be used inside a server."
    );

    return;
  }

  const member =
    interaction.member;

  const permissions =
    member?.permissions ||
    "0";

  let isAdmin = false;

  try {
    isAdmin =
      (
        BigInt(
          permissions
        ) & 40n
      ) !== 0n;
  } catch {
    isAdmin = false;
  }

  if (!isAdmin) {
    await sendText(
      env,
      interaction,
      "❌ You need Administrator or Manage Server permission to set the announcement channel."
    );

    return;
  }

  if (!channelId) {
    await sendText(
      env,
      interaction,
      "❌ Please choose a channel."
    );

    return;
  }

  const response =
    await discordRequest(
      env,
      `/channels/${channelId}`
    );

  if (!response.ok) {
    await sendText(
      env,
      interaction,
      "❌ I couldn't access that channel."
    );

    return;
  }

  const channel =
    await response.json();

  if (
    channel.guild_id !==
      interaction.guild_id ||
    channel.type !== 0
  ) {
    await sendText(
      env,
      interaction,
      "❌ Please choose a normal text channel from this server."
    );

    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  state.announcementChannelId =
    channel.id;

  state.announcementChannelName =
    channel.name || "";

  /*
    If the guild didn't have a chaos timer yet,
    give it one when announcements are configured.
  */

  if (
    !state.nextChaosAt ||
    Number(state.nextChaosAt) <= 0
  ) {
    state.nextChaosAt =
      Date.now() +
      CHAOS_INTERVAL;
    state.chaosScheduleVersion = CHAOS_SCHEDULE_VERSION;
  }

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

  await sendText(
    env,
    interaction,
    `📢 Announcement channel set to **#${channel.name}**!\n\nWerewives chaos events will use this channel. 💖`
  );
}

/* =========================================================
   TREE COMMAND
========================================================= */

async function handleTree(
  env,
  interaction
) {
  await acknowledge(
    env,
    interaction
  );

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  const player =
    await getPlayer(
      env,
      user.id
    );

  updatePlayerIdentity(
    player,
    interaction
  );

  cleanSparkles(
    player
  );

  await rememberGuild(
    env,
    interaction.guild_id
  );

  player.sceneMessage =
    "";
  player.treeChecks =
    Number(player.treeChecks || 0) + 1;

  await savePlayer(
    env,
    player
  );

  try {
    await sendTree(
      env,
      interaction,
      player
    );
  } catch (error) {
    console.error(
      "Tree render error:",
      error
    );

    await editOriginalResponse(
      env,
      interaction,
      {
        content:
          `🌳 Your tree is alive, but I couldn't render the picture right now.\n\n${error?.message || "Unknown error"}`,
        components:
          treeButtons(getUserFromInteraction(interaction)?.id || "", player)
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
  const id =
    interaction.data?.custom_id ||
    "";

  if (id.startsWith("island:")) {
    const parts = id.split(":");
    const action = parts[1];
    if (action === "join") { await handleIslandJoin(env, interaction); return; }
    if (action === "leave") { await handleIslandLeave(env, interaction); return; }
    if (action === "rules") { await handleIslandRules(env, interaction); return; }
    if (action === "settings") { await handleIslandSettings(env, interaction); return; }
    if (action === "rounds") { await handleIslandSettings(env, interaction, parts[2]); return; }
    if (action === "back") { const state=await getGuildState(env, interaction.guild_id); if (state.island) await sendText(env, interaction, islandLobbyText(state.island), islandLobbyComponents(state.island)); return; }
    if (action === "start") { await handleIslandStart(env, interaction); return; }
    if (action === "choice") { await handleIslandChoice(env, interaction, parts[2]); return; }
    return;
  }

  if (id.startsWith("games:")) {
    const parts = id.split(":");
    const action = parts[1];
    if (action === "menu") { await handleGamesMenu(env, interaction); return; }
    if (action === "solo") { await handleSoloStart(env, interaction); return; }
    if (action === "solo_leaderboard") { await handleSoloLeaderboard(env, interaction); return; }
    if (action === "island") { await sendText(env, interaction, [
      "🏝️ **Chaos Island**",
      "",
      "Use `/island create` to make a lobby, then `/island join` and `/island start`.",
      "",
      "⚙️ The host can choose the number of rounds from the lobby settings."
    ].join("\n")); return; }
    if (action === "heist") { await sendText(env, interaction, [
      "💰 **Raccoon Heist**",
      "",
      "Use `/heist create` to make a lobby, then `/heist join` and `/heist start`.",
      "",
      "Use `/roles` to see all available roles."
    ].join("\n")); return; }
    return;
  }

  if (id.startsWith("solo:")) {
    const parts = id.split(":");
    if (parts[1] === "start") { await handleSoloStart(env, interaction); return; }
    if (parts[1] === "choice") { await handleSoloChoice(env, interaction, parts[2]); return; }
    if (parts[1] === "abort") { await handleSoloAbort(env, interaction); return; }
    return;
  }

  if (id.startsWith("title:")) {
    const parts = id.split(":");
    if (parts[1] === "list") { await handleTitleList(env, interaction); return; }
    if (parts[1] === "equip") { await handleTitleEquip(env, interaction, parts[2]); return; }
    if (parts[1] === "unequip") { await handleTitleUnequip(env, interaction); return; }
    return;
  }

  if (id.startsWith("heist_roles:")) {
    await handleHeistRolesPage(env, interaction, id.split(":")[1]);
    return;
  }

  if (
    id.startsWith("heist:")
  ) {
    await handleHeistComponent(
      env,
      interaction
    );
    return;
  }

  if (id.startsWith("tree:")) {
    const ownerId = treeButtonOwner(id);
    const action = treeButtonAction(id);
    const user = getUserFromInteraction(interaction);

    if (!ownerId || !user || ownerId !== user.id) {
      await sendText(env, interaction, "❌ Those tree buttons belong to someone else. Use `/tree` to open your own tree.");
      return;
    }

    const actionParts = String(action || "").split(":");
    const baseAction = actionParts[0];

    if (baseAction === "water") { await handleWater(env, interaction); return; }
    if (baseAction === "catch") {
      await handleCatch(env, interaction, actionParts[1] || null);
      return;
    }
    if (baseAction === "fortune") {
      await handleFortune(env, interaction);
      return;
    }
    if (baseAction === "sparkle") {
      await handleSparkleBalance(env, interaction);
      return;
    }
    if (baseAction === "daily_riddle") { await handleDailyRiddle(env, interaction); return; }
    if (baseAction === "shop") { await showShop(env, interaction); return; }
    if (baseAction === "customize") { await showCustomize(env, interaction); return; }
    if (baseAction === "leaderboard") { await showLeaderboard(env, interaction); return; }
    return;
  }

  if (id === "water") {
    await handleWater(
      env,
      interaction
    );

    return;
  }

  if (
    id === "catch" ||
    id === "catch_sparkle"
  ) {
    await handleCatch(
      env,
      interaction
    );

    return;
  }

  if (
    id === "daily_riddle"
  ) {
    await handleDailyRiddle(
      env,
      interaction
    );

    return;
  }

  if (
    id === "tree" ||
    id === "back_tree"
  ) {
    await handleTree(
      env,
      interaction
    );

    return;
  }

  if (id === "shop") {
    await showShop(
      env,
      interaction
    );

    return;
  }

  if (
    id === "shop_backgrounds"
  ) {
    await showBackgroundShop(
      env,
      interaction
    );

    return;
  }

  if (
    id === "shop_trees"
  ) {
    await showTreeShop(
      env,
      interaction
    );

    return;
  }

  if (
    id === "shop_decorations"
  ) {
    await showDecorationShop(
      env,
      interaction
    );

    return;
  }

  if (
    id === "shop_effects"
  ) {
    await showEffectShop(
      env,
      interaction
    );

    return;
  }

  if (
    id === "shop_limited"
  ) {
    await showLimitedShop(
      env,
      interaction
    );
    return;
  }

  if (id === "shop_limited_halloween") {
    await showLimitedHalloweenShop(env, interaction);
    return;
  }

  if (
    id === "shop_special"
  ) {
    await showSpecialShop(
      env,
      interaction
    );

    return;
  }

  const buyMap = {
    buy_candyland:
      "candyland_background",

    buy_cotton_candy:
      "cotton_candy_tree",

    buy_halloween:
      "halloween_background",

    buy_pumpkin_cat:
      "pumpkin_cat_decoration",

    buy_panda:
      "panda_decoration",

    buy_cat:
      "cat_decoration",

    buy_shadow_tree:
      "shadow_tree",

    buy_full_cherry_tree:
      "full_cherry_tree",

    buy_pine_tree:
      "pine_tree",

    buy_red_tree:
      "red_tree",

    buy_soul_tree:
      "soul_tree",

    buy_butterflies:
      "butterflies_effect",

    buy_hearts:
      "hearts_effect",

    buy_magic_mushroom:
      "magic_mushroom_background",

    buy_field_day:
      "field_day_background",

    buy_red_forest:
      "red_forest_background",

    buy_halloween_tree:
      "halloween_tree",

    buy_purr_princess:
      "purr_princess_effect",

    buy_kitty_tree:
      "kitty_tree",

    buy_cozy_cat:
      "cozy_cat_background",

    buy_green_glow_tree:
      "green_glow_tree",

    buy_green_glow_background:
      "green_glow_background",

    buy_green_glow_effect:
      "green_glow_effect"
  };

  if (
    buyMap[id]
  ) {
    await buyItem(
      env,
      interaction,
      buyMap[id]
    );

    return;
  }

  if (
    id === "customize"
  ) {
    await showCustomize(
      env,
      interaction
    );

    return;
  }

  if (
    id === "custom_backgrounds"
  ) {
    await showCustomBackgrounds(
      env,
      interaction
    );

    return;
  }

  if (
    id === "custom_trees"
  ) {
    await showCustomTrees(
      env,
      interaction
    );

    return;
  }

  if (
    id === "custom_decorations"
  ) {
    await showCustomDecorations(
      env,
      interaction
    );

    return;
  }

  if (
    id === "custom_effects"
  ) {
    await showCustomEffects(
      env,
      interaction
    );

    return;
  }

  if (
    id.startsWith(
      "equip_theme_"
    )
  ) {
    await equipTheme(
      env,
      interaction,
      id.replace(
        "equip_theme_",
        ""
      )
    );

    return;
  }

  if (
    id.startsWith(
      "equip_tree_"
    )
  ) {
    await equipTree(
      env,
      interaction,
      id.replace(
        "equip_tree_",
        ""
      )
    );

    return;
  }

  if (
    id.startsWith(
      "equip_effect_"
    )
  ) {
    const value =
      id.replace(
        "equip_effect_",
        ""
      );

    await equipEffect(
      env,
      interaction,
      value === "none"
        ? null
        : value
    );

    return;
  }

  if (
    id.startsWith(
      "equip_decoration_"
    )
  ) {
    const value =
      id.replace(
        "equip_decoration_",
        ""
      );

    await equipDecoration(
      env,
      interaction,
      value === "none"
        ? null
        : value
    );

    return;
  }

  if (
    id === "leaderboard"
  ) {
    await showLeaderboard(
      env,
      interaction
    );

    return;
  }


  await sendText(
    env,
    interaction,
    "❌ Unknown button."
  );
}



/* =========================================================
   CHAOS ISLAND
   2-10 PLAYER MULTIPLAYER SURVIVAL GAME

   Each scenario has multiple fixed versions. A version is
   selected when the round starts, so the same scenario can
   have different correct choices on a later game. Within a
   single round, everyone choosing the same option receives
   the exact same outcome.
========================================================= */

const ISLAND_MIN_PLAYERS = 2;
const ISLAND_MAX_PLAYERS = 10;
const ISLAND_DEFAULT_ROUNDS = 5;
const ISLAND_ROUND_OPTIONS = [5, 10, 15, 20, 25, 30];
const ISLAND_ROUND_TIMEOUT = 90 * 1000;
const ISLAND_SURVIVE_POINTS = 100;
const ISLAND_SURVIVOR_REWARD = 300;
const ISLAND_WINNER_REWARD = 750;

const CHAOS_ISLAND_SCENARIOS = [
  {
    "id": 1,
    "title": "The Giant Wave",
    "prompt": "🌊 A ridiculous wave is racing toward the island. Pick your escape plan!",
    "versions": [
      {
        "choices": [
          {
            "label": "🌴 Climb the tree",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide in the hut",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Hide behind the rock",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏊 Swim away",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌴 Climb the tree",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏠 Hide in the hut",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Hide behind the rock",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏊 Swim away",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌴 Climb the tree",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide in the hut",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪨 Hide behind the rock",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏊 Swim away",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "Volcano Having A Day",
    "prompt": "🌋 The volcano has officially decided everyone needs to leave. Immediately.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏔️ Climb high",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Hide in the jungle",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🛶 Build a raft",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Run to the beach",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏔️ Climb high",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Hide in the jungle",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Build a raft",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Run to the beach",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏔️ Climb high",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Hide in the jungle",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Build a raft",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🏖️ Run to the beach",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "Angry Weather",
    "prompt": "⛈️ The sky is furious. Thunder is shaking coconuts out of the trees.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🌳 Climb a tree",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Hide in a cave",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Stay on the beach",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb a tree",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Hide in a cave",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏖️ Stay on the beach",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb a tree",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🕳️ Hide in a cave",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Stay on the beach",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Shark Meeting",
    "prompt": "🦈 A shark has appeared near the shore and looks like it has a calendar appointment with you.",
    "versions": [
      {
        "choices": [
          {
            "label": "🛶 Take a boat",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run inland",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦈 Swim past it",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍎 Offer it food",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🛶 Take a boat",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run inland",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦈 Swim past it",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍎 Offer it food",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🛶 Take a boat",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🏃 Run inland",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦈 Swim past it",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🍎 Offer it food",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "Coconut Avalanche",
    "prompt": "🥥 A mountain of coconuts starts rolling downhill toward camp.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏠 Hide",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌴 Climb",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Stand still",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏃 Run downhill",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🌴 Climb",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Stand still",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run downhill",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌴 Climb",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪨 Stand still",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run downhill",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "Quicksand",
    "prompt": "🕳️ You step into suspiciously squishy sand. This feels like a terrible Tuesday.",
    "versions": [
      {
        "choices": [
          {
            "label": "🪵 Stay still",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🪨 Grab a branch",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Crawl out",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🪵 Stay still",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Grab a branch",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Crawl out",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🪵 Stay still",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Grab a branch",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🕳️ Crawl out",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "title": "Tornado Beach",
    "prompt": "🌪️ A tiny tornado has arrived and is stealing everyone's flip-flops.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🩴 Save your flip-flops",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Chase the tornado",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🩴 Save your flip-flops",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏖️ Chase the tornado",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏠 Hide indoors",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🩴 Save your flip-flops",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🌳 Climb",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏖️ Chase the tornado",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "title": "Jungle Stampede",
    "prompt": "🐗 A herd of extremely offended wild boars is charging through the jungle.",
    "versions": [
      {
        "choices": [
          {
            "label": "🌳 Climb",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍎 Distract them",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌳 Climb",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍎 Distract them",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌳 Climb",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🏠 Hide",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🍎 Distract them",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "title": "Giant Crab",
    "prompt": "🦀 A crab the size of a refrigerator blocks the path. It appears to be guarding something.",
    "versions": [
      {
        "choices": [
          {
            "label": "🦀 Approach",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍪 Offer a snack",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🔍 Search around it",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🦀 Approach",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🍪 Offer a snack",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🔍 Search around it",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🦀 Approach",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🍪 Offer a snack",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🔍 Search around it",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "title": "Falling Tree",
    "prompt": "🌳 A giant tree starts falling directly toward camp.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏃 Run sideways",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏠 Hide",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪵 Push the tree back",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏃 Run sideways",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪵 Push the tree back",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏃 Run sideways",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Hide",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🪵 Push the tree back",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "title": "Mystery Fog",
    "prompt": "🌫️ Thick fog covers the island and you can barely see your own toes.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Follow the sound",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏕️ Stay at camp",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Find a cave",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Follow the sound",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏕️ Stay at camp",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🌳 Climb",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🕳️ Find a cave",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Follow the sound",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏕️ Stay at camp",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🌳 Climb",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🕳️ Find a cave",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "title": "Monkey Alarm",
    "prompt": "🐒 A troop of monkeys starts screaming and throwing fruit for reasons unknown.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍌 Hide",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🙈 Cover your head",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🐒 Wave back",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍌 Hide",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🙈 Cover your head",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🐒 Wave back",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍌 Hide",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🙈 Cover your head",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🐒 Wave back",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 13,
    "title": "Landslide",
    "prompt": "⛰️ The hillside begins sliding toward the campsite.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏔️ Climb up",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Stay put",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🛶 Take the river",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏔️ Climb up",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏠 Stay put",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Take the river",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏔️ Climb up",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Stay put",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Take the river",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "title": "Lightning Tree",
    "prompt": "⚡ The tallest tree on the island is being struck by lightning over and over.",
    "versions": [
      {
        "choices": [
          {
            "label": "🌴 Climb it",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Move away",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🪨 Hide",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "⚡ Touch the tree",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌴 Climb it",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Move away",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Hide",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "⚡ Touch the tree",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🌴 Climb it",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Move away",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪨 Hide",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "⚡ Touch the tree",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 15,
    "title": "The Ground Moves",
    "prompt": "🌎 The ground starts wobbling. Nobody likes this.",
    "versions": [
      {
        "choices": [
          {
            "label": "🏃 Run",
            "text": "💰 You escape with style and find 100 ✨ on the way.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏠 Stay inside",
            "text": "❤️ You get to high ground and survive!",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪨 Sit down",
            "text": "💔 The shelter collapses around you. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Get on the water",
            "text": "💔 The island chooses violence. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏃 Run",
            "text": "💔 You picked the obvious-looking route. Unfortunately, the island noticed. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Stay inside",
            "text": "❤️ Safe! Your questionable plan somehow works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪨 Sit down",
            "text": "💰 You survive and discover 150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🛶 Get on the water",
            "text": "💔 Absolutely not. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🏃 Run",
            "text": "💔 You make a dramatic mistake. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏠 Stay inside",
            "text": "💰 Safe and richer! +200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🪨 Sit down",
            "text": "💔 You are now having a character-building experience. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🛶 Get on the water",
            "text": "❤️ Safe! Nature has decided to spare you today.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 16,
    "title": "Three Suspicious Caves",
    "prompt": "💎 Three caves appear: one tiny, one glowing, and one with a very judgmental sign.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 17,
    "title": "Buried Chest",
    "prompt": "📦 A treasure chest is half-buried in the sand.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 18,
    "title": "Gold Coconut",
    "prompt": "🥥 One coconut is glowing gold. This cannot possibly be normal.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      }
    ]
  },
  {
    "id": 19,
    "title": "Pirate Map",
    "prompt": "🏴‍☠️ You find a pirate map with an enormous X drawn on it.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 20,
    "title": "Shiny Lagoon",
    "prompt": "✨ The lagoon is sparkling like someone dropped a jewelry store into it.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 21,
    "title": "Treasure Tree",
    "prompt": "🌳 A tree has coins growing on its branches.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 22,
    "title": "Suspicious Backpack",
    "prompt": "🎒 You find a backpack labeled 'DEFINITELY NOT TREASURE.'",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      }
    ]
  },
  {
    "id": 23,
    "title": "Statue With A Button",
    "prompt": "🗿 An ancient statue has one giant red button labeled 'DO NOT PRESS.'",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 24,
    "title": "Golden Crab",
    "prompt": "🦀 A golden crab is carrying a tiny treasure chest.",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🪙 Grab it",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🪙 Grab it",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 25,
    "title": "Message In A Bottle",
    "prompt": "🍾 A bottle washes ashore containing a note that simply says 'dig here.'",
    "versions": [
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "❤️ You wisely leave it alone. Safe, but no treasure.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 The treasure was bait. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 You find a tiny stash. +100 ✨.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💎 JACKPOT! You found 300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +500 ✨! You found the REALLY good stuff.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Walk away",
            "text": "❤️ Nothing happens. Suspicious, but safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +200 ✨! The island rewards your confidence.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 A trap! Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "✨ Investigate",
            "text": "💎 +350 ✨! Someone left a sparkle stash here.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🚶 Walk away",
            "text": "💔 It was a decoy. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🪙 Grab it",
            "text": "💰 +150 ✨ and absolutely no regrets.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Safe! You decide treasure can wait.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 26,
    "title": "Raccoon Coup",
    "prompt": "🦝 Forty-seven raccoons have surrounded your campsite and appear organized.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🏃 Run",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      }
    ]
  },
  {
    "id": 27,
    "title": "Raccoon Tax Collector",
    "prompt": "🦝 A raccoon wearing a tiny tie demands an island tax.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 28,
    "title": "Banana Disaster",
    "prompt": "🍌 A banana the size of a house falls from the sky.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🧠 Make a plan",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          }
        ]
      }
    ]
  },
  {
    "id": 29,
    "title": "Parrot Lawyer",
    "prompt": "🦜 A parrot lands nearby and announces that you are being sued.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏃 Run",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 30,
    "title": "Goose Invasion",
    "prompt": "🪿 A flock of geese marches onto the island like they own the place.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🏃 Run",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      }
    ]
  },
  {
    "id": 31,
    "title": "Coconut Cannon",
    "prompt": "🥥 Someone has apparently built a coconut cannon overnight.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 32,
    "title": "Tiny Pirate",
    "prompt": "🏴‍☠️ A three-inch pirate appears and demands your most valuable possession.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🧠 Make a plan",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          }
        ]
      }
    ]
  },
  {
    "id": 33,
    "title": "Dancing Statue",
    "prompt": "🗿 The ancient statue starts dancing whenever anyone looks at it.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🏃 Run",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🧠 Make a plan",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 34,
    "title": "Evil Sandcastle",
    "prompt": "🏰 The sandcastle you built has developed an attitude.",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🏃 Run",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      }
    ]
  },
  {
    "id": 35,
    "title": "Chicken Emergency",
    "prompt": "🐔 A chicken is running around screaming 'THE END IS NIGH!'",
    "versions": [
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💔 You have made the situation significantly worse. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Somehow your plan works.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Chaos wins. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 The chaos creature respects you. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "💰 +300 ✨! The nonsense pays off.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Nobody knows how.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💔 Disaster. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Make a plan",
            "text": "🦝 You have been promoted to Assistant Chaos Manager. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      },
      {
        "choices": [
          {
            "label": "😈 Embrace chaos",
            "text": "🦝 The raccoons approve. +400 ✨.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Please do not question it.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Trust the raccoon",
            "text": "💰 +100 ✨ and one deeply confusing memory.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🧠 Make a plan",
            "text": "💔 The plan backfires spectacularly. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 36,
    "title": "Haunted Cabin",
    "prompt": "🏚️ You find an abandoned cabin with the front door mysteriously open.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 37,
    "title": "Huge Footprints",
    "prompt": "👣 Enormous footprints appear outside camp overnight.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 38,
    "title": "Whispering Jungle",
    "prompt": "🌿 The jungle is whispering your name.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 39,
    "title": "Locked Chest",
    "prompt": "🔒 You find a locked chest that is humming quietly.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚪 Leave",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 40,
    "title": "Strange Lights",
    "prompt": "🌌 Strange lights appear over the ocean every few seconds.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 41,
    "title": "The Mirror",
    "prompt": "🪞 You discover a mirror that seems to show the island slightly differently.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 42,
    "title": "Mysterious Door",
    "prompt": "🚪 A door is standing alone in the middle of the jungle.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 43,
    "title": "Footsteps Behind You",
    "prompt": "👀 You hear footsteps behind you. When you turn around, nobody is there.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚪 Leave",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 44,
    "title": "Talking Skull",
    "prompt": "💀 A skull on the beach says, 'Choose wisely.' Then it yawns.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      }
    ]
  },
  {
    "id": 45,
    "title": "The Missing Campfire",
    "prompt": "🔥 Your campfire is gone. In its place is a neat little pile of marshmallows.",
    "versions": [
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ You decide not to investigate. Probably wise.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 Something spooky happens. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "👻 The mystery remains a mystery. You are safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "🔎 You discover a hidden stash. +250 ✨.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "❤️ Safe. The weirdness leaves you alone.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "💔 The island whispers 'wrong answer.' Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💔 You find exactly what you were afraid of. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💰 Mystery solved! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🔦 Investigate",
            "text": "👀 Nothing happens. Somehow that is the creepiest result. Safe.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚪 Leave",
            "text": "❤️ Safe! You trust your instincts.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "👀 Watch quietly",
            "text": "💎 You uncover 200 ✨.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Send the raccoon",
            "text": "💔 You should not have touched that. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 46,
    "title": "Wishing Well",
    "prompt": "✨ A mysterious wishing well appears beside your campsite.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🎲 Take a chance",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      }
    ]
  },
  {
    "id": 47,
    "title": "Golden Dice",
    "prompt": "🎲 A giant golden die falls from the sky and lands perfectly upright.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 48,
    "title": "Lucky Shell",
    "prompt": "🐚 You find a shell that feels suspiciously lucky.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 49,
    "title": "Four-Leaf Coconut",
    "prompt": "🍀 Somehow, a coconut has grown four tiny leaves.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚶 Play it safe",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 50,
    "title": "Rainbow Door",
    "prompt": "🌈 A rainbow appears and forms a doorway.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🎲 Take a chance",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      }
    ]
  },
  {
    "id": 51,
    "title": "Mystery Gift Box",
    "prompt": "🎁 A gift box appears with a tag reading 'FOR WHOEVER IS LUCKY.'",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 52,
    "title": "Coin Flip Island",
    "prompt": "🪙 A giant coin appears with 'LUCK' on one side and 'CHAOS' on the other.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 53,
    "title": "Singing Star",
    "prompt": "⭐ A star falls from the sky and starts singing badly.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🚶 Play it safe",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🎲 Take a chance",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 54,
    "title": "Lucky Umbrella",
    "prompt": "☂️ You find an umbrella that sparkles even though it isn't raining.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🎲 Take a chance",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🚶 Play it safe",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      }
    ]
  },
  {
    "id": 55,
    "title": "The Four Buttons",
    "prompt": "🔴🔵🟢🟡 Four buttons appear on a rock. One is apparently very lucky.",
    "versions": [
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "❤️ Safe! Your luck is confusing but functional.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🎲 Take a chance",
            "text": "🍀 Lucky! +300 ✨.",
            "hearts": 1,
            "sparkles": 300
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Not lucky. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +100 ✨! The universe sends pocket change.",
            "hearts": 1,
            "sparkles": 100
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "💎 JACKPOT! +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! The universe shrugs at you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💔 Your luck called in sick. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "✨ +200 ✨! The universe remembered your name.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🍀 Trust your luck",
            "text": "🍀 +150 ✨! That's suspiciously lucky.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🎲 Take a chance",
            "text": "❤️ Safe! Nothing weird happens.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🚶 Play it safe",
            "text": "💰 +350 ✨! You should probably buy a lottery ticket.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "✨ Choose the shiny thing",
            "text": "💔 Bad luck. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 56,
    "title": "Mayor Raccoon",
    "prompt": "🦝 The raccoons have elected a mayor. The mayor has summoned you to city hall, which is a tree stump.",
    "versions": [
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "🦝 The raccoons declare you cool. +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🏃 Run",
            "text": "💔 The nonsense claims a victim. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Somehow safe. Nobody understands why.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💰 +200 ✨ and a story nobody will believe.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "🦝 You have been accepted by the weirdness. +350 ✨.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Reality briefly gives up.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +250 ✨. Please don't ask where it came from.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💔 This was a terrible idea. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💔 You are personally offended by physics. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons applaud. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +400 ✨! Chaos has chosen you.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "❤️ Safe! The island is too confused to hurt you.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 57,
    "title": "Giant Sock",
    "prompt": "🧦 A gigantic sock falls from the sky and lands on the island.",
    "versions": [
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💔 The nonsense claims a victim. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Somehow safe. Nobody understands why.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +200 ✨ and a story nobody will believe.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "🦝 The raccoons declare you cool. +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "❤️ Safe! Reality briefly gives up.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 +250 ✨. Please don't ask where it came from.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 This was a terrible idea. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "🦝 You have been accepted by the weirdness. +350 ✨.",
            "hearts": 1,
            "sparkles": 350
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "🦝 The raccoons applaud. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🏃 Run",
            "text": "💰 +400 ✨! Chaos has chosen you.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Safe! The island is too confused to hurt you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💔 You are personally offended by physics. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      }
    ]
  },
  {
    "id": 58,
    "title": "Dramatic Banana",
    "prompt": "🍌 A banana rolls toward you while dramatic music somehow plays.",
    "versions": [
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "❤️ Somehow safe. Nobody understands why.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💰 +200 ✨ and a story nobody will believe.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "🦝 The raccoons declare you cool. +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💔 The nonsense claims a victim. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💰 +250 ✨. Please don't ask where it came from.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🏃 Run",
            "text": "💔 This was a terrible idea. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "🦝 You have been accepted by the weirdness. +350 ✨.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "❤️ Safe! Reality briefly gives up.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💰 +400 ✨! Chaos has chosen you.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! The island is too confused to hurt you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 You are personally offended by physics. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "🦝 The raccoons applaud. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          }
        ]
      }
    ]
  },
  {
    "id": 59,
    "title": "Disco Volcano",
    "prompt": "🪩🌋 The volcano starts flashing disco lights instead of erupting.",
    "versions": [
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💰 +200 ✨ and a story nobody will believe.",
            "hearts": 1,
            "sparkles": 200
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons declare you cool. +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💔 The nonsense claims a victim. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "❤️ Somehow safe. Nobody understands why.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💔 This was a terrible idea. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 You have been accepted by the weirdness. +350 ✨.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Safe! Reality briefly gives up.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💰 +250 ✨. Please don't ask where it came from.",
            "hearts": 1,
            "sparkles": 250
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "❤️ Safe! The island is too confused to hurt you.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "💔 You are personally offended by physics. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "🦝 The raccoons applaud. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💰 +400 ✨! Chaos has chosen you.",
            "hearts": 1,
            "sparkles": 400
          }
        ]
      }
    ]
  },
  {
    "id": 60,
    "title": "Angry Coconut",
    "prompt": "🥥 One coconut is rolling after you. It has tiny angry eyebrows.",
    "versions": [
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "🦝 The raccoons declare you cool. +500 ✨.",
            "hearts": 1,
            "sparkles": 500
          },
          {
            "label": "🏃 Run",
            "text": "💔 The nonsense claims a victim. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "❤️ Somehow safe. Nobody understands why.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💰 +200 ✨ and a story nobody will believe.",
            "hearts": 1,
            "sparkles": 200
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "🦝 You have been accepted by the weirdness. +350 ✨.",
            "hearts": 1,
            "sparkles": 350
          },
          {
            "label": "🏃 Run",
            "text": "❤️ Safe! Reality briefly gives up.",
            "hearts": 1,
            "sparkles": 0
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +250 ✨. Please don't ask where it came from.",
            "hearts": 1,
            "sparkles": 250
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "💔 This was a terrible idea. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          }
        ]
      },
      {
        "choices": [
          {
            "label": "🤡 Commit to the bit",
            "text": "💔 You are personally offended by physics. Lose 1 ❤️.",
            "hearts": -1,
            "sparkles": 0
          },
          {
            "label": "🏃 Run",
            "text": "🦝 The raccoons applaud. +150 ✨.",
            "hearts": 1,
            "sparkles": 150
          },
          {
            "label": "🦝 Ask the raccoon",
            "text": "💰 +400 ✨! Chaos has chosen you.",
            "hearts": 1,
            "sparkles": 400
          },
          {
            "label": "🧠 Pretend this is normal",
            "text": "❤️ Safe! The island is too confused to hurt you.",
            "hearts": 1,
            "sparkles": 0
          }
        ]
      }
    ]
  }
];

function chaosIslandRulesText() {
  return [
    "🏝️ **CHAOS ISLAND — HOW TO PLAY**",
    "",
    "👥 **Players:** 2–10",
    "❤️ **Starting Hearts:** 3",
    "🎮 **Game:** 5 rounds",
    "",
    "Each round gives everyone one ridiculous island scenario and **4 choices**.",
    "",
    "🔒 Pick **one** choice before the round ends.",
    "👯 **Same choice = same outcome** for everyone who picked it.",
    "",
    "🔀 The same scenario can appear again in a later game with a **different version**, so don't memorize the answers!",
    "",
    "❤️ Lose hearts when your choice says so. Reach **0 hearts** and you're eliminated.",
    "✨ Some choices earn sparkles.",
    "🏆 Survive the island and compete for the biggest final reward.",
    "",
    "🦝 **Important:** The raccoons are not qualified to provide legal, medical, or survival advice.",
    "",
    "**Good luck. The island has questionable judgment.** 🏝️💀"
  ].join("\n");
}

function islandLobbyComponents(game) {
  return [
    row(
      button("👥 Join Island", "island:join", 3),
      button("⚙️ Settings", "island:settings", 2),
      button("📖 How to Play", "island:rules", 2)
    ),
    row(
      button("🚪 Leave", "island:leave", 4),
      button("🚀 Start Game", "island:start", 1)
    )
  ];
}

function islandSettingsText(game) {
  const current = Number(game.maxRounds || ISLAND_DEFAULT_ROUNDS);
  return [
    "⚙️ **CHAOS ISLAND SETTINGS**",
    "",
    `🎮 **Rounds:** ${current}`,
    `👑 **Host:** <@${game.hostId}>`,
    "",
    "Only the host can change the number of rounds.",
    `Available: ${ISLAND_ROUND_OPTIONS.join(", ")}`
  ].join("\n");
}

function islandSettingsComponents(game) {
  const rows = [];
  for (let i = 0; i < ISLAND_ROUND_OPTIONS.length; i += 3) {
    rows.push(row(...ISLAND_ROUND_OPTIONS.slice(i, i + 3).map(n =>
      button(`${n} Rounds`, `island:rounds:${n}`, Number(game.maxRounds || ISLAND_DEFAULT_ROUNDS) === n ? 1 : 2)
    )));
  }
  rows.push(row(button("⬅️ Back to Lobby", "island:back", 2)));
  return rows;
}

function islandPlayerLines(game) {
  return Object.values(game.players || {}).map((p, i) => {
    const title = p.equippedTitle && SOLO_TITLES[p.equippedTitle]?.name ? ` ${SOLO_TITLES[p.equippedTitle].name}` : "";
    return `${i + 1}. <@${p.id}>${title} — ❤️ ${p.hearts} ${p.alive ? "" : "💀 Eliminated"}`;
  }).join("\n");
}

function islandLobbyText(game) {
  return [
    "🏝️ **CHAOS ISLAND**",
    "",
    `👥 **Players: ${Object.keys(game.players).length}/${ISLAND_MAX_PLAYERS}**`,
    `🎮 **Host:** <@${game.hostId}>`,
    `🔢 **Rounds:** ${Number(game.maxRounds || ISLAND_DEFAULT_ROUNDS)}`,
    "",
    islandPlayerLines(game) || "No players yet!",
    "",
    Object.keys(game.players).length < ISLAND_MIN_PLAYERS
      ? `⏳ Need at least **${ISLAND_MIN_PLAYERS} players** to start.`
      : "✨ Ready! The host can start the island.",
    "",
    "📖 Read the rules before you start!"
  ].join("\n");
}

function islandGameText(game, scenario, version) {
  const alive = Object.values(game.players).filter(p => p.alive);
  const chosen = Object.values(game.players).filter(p => p.alive && p.choice !== null);
  const choiceCount = Object.fromEntries(Array.from({length:4}, (_,i)=>[i,0]));
  for (const p of chosen) choiceCount[p.choice] = (choiceCount[p.choice] || 0) + 1;
  const lines = alive.map(p =>
    `• <@${p.id}> — ❤️ ${p.hearts}${p.choice !== null ? " — 🔒 Choice locked" : " — 🤔 Choosing..."}`
  ).join("\n");
  return [
    `🏝️ **CHAOS ISLAND — ROUND ${game.round}/${game.maxRounds || ISLAND_DEFAULT_ROUNDS}**`,
    "",
    `### ${scenario.title}`,
    scenario.prompt,
    "",
    `🔒 **Choices locked:** ${chosen.length}/${alive.length}`,
    "",
    lines,
    "",
    `⏳ Choose one option!`,
    `🌀 Scenario version: ${version + 1}`
  ].join("\n");
}

function islandChoiceRows(game, scenario) {
  const rows=[];
  const activeChoices = scenario.versions[game.currentVersion]?.choices || scenario.versions[0].choices;
  for (let i=0;i<activeChoices.length;i+=2) {
    const a=activeChoices[i];
    const b=activeChoices[i+1];
    rows.push(row(
      button(a.label, `island:choice:${i}`, 2),
      button(b.label, `island:choice:${i+1}`, 2)
    ));
  }
  rows.push(row(button("📖 Rules", "island:rules", 2)));
  return rows;
}

async function islandPublicUpdate(env, interaction, content, components=[]) {
  const response=await editOriginalResponse(env, interaction, {content,components});
  if (!response.ok) console.error("Chaos Island message update failed:", response.status, await response.text());
  return response;
}

function islandPickScenario(game) {
  const used=new Set(game.usedScenarioIds || []);
  let pool=CHAOS_ISLAND_SCENARIOS.filter(s=>!used.has(s.id));
  if (!pool.length) { game.usedScenarioIds=[]; pool=CHAOS_ISLAND_SCENARIOS; }
  const scenario=pool[randomInt(0,pool.length-1)];
  game.usedScenarioIds.push(scenario.id);
  const version=randomInt(0,scenario.versions.length-1);
  game.currentScenarioId=scenario.id;
  game.currentVersion=version;
  game.currentChoices={};
  for (const p of Object.values(game.players)) p.choice=null;
  return scenario;
}

function getIslandCurrentScenario(game) {
  return CHAOS_ISLAND_SCENARIOS.find(s=>s.id===game.currentScenarioId) || null;
}

function islandCurrentChoices(game) {
  const scenario=getIslandCurrentScenario(game);
  return scenario?.versions?.[game.currentVersion]?.choices || [];
}

function islandAllAliveChosen(game) {
  const alive=Object.values(game.players).filter(p=>p.alive);
  return alive.length>0 && alive.every(p=>p.choice !== null);
}

async function islandSave(env, game) {
  const state=await getGuildState(env, game.guildId);
  if (state.island?.id !== game.id) return;
  state.island=game;
  await saveGuildState(env, game.guildId, state);
}

async function handleIslandCreate(env, interaction) {
  if (!interaction.guild_id) {
    await sendText(env, interaction, "❌ Chaos Island can only be played inside a server.");
    return;
  }
  const state=await getGuildState(env, interaction.guild_id);
  if (state.island && state.island.status !== "ended") {
    await sendText(env, interaction, `❌ A Chaos Island game is already running in <#${state.island.channelId}>.`);
    return;
  }
  const user=getUserFromInteraction(interaction);
  const game={
    id:`island-${Date.now()}-${user.id}`,
    guildId:interaction.guild_id,
    channelId:interaction.channel_id,
    hostId:user.id,
    status:"lobby",
    maxRounds: ISLAND_DEFAULT_ROUNDS,
    round:0,
    currentScenarioId:null,
    currentVersion:0,
    currentChoices:{},
    usedScenarioIds:[],
    phaseEndsAt:0,
    players:{[user.id]:{id:user.id,username:user.username,displayName:user.global_name || user.username,hearts:3,alive:true,choice:null,points:0,sparklesEarned:0,equippedTitle:player.equippedTitle || ""}}
  };
  state.island=game;
  await saveGuildState(env, interaction.guild_id, state);
  await sendPublicText(env, interaction, islandLobbyText(game), islandLobbyComponents(game));
}

async function handleIslandJoin(env, interaction) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env, interaction.guild_id);
  const game=state.island;
  if (!game || game.status !== "lobby") return sendText(env, interaction, "❌ There isn't an open Chaos Island lobby right now.");
  const user=getUserFromInteraction(interaction);
  if (game.players[user.id]) return sendText(env, interaction, "🏝️ You're already on the island!", islandLobbyComponents(game));
  if (Object.keys(game.players).length >= ISLAND_MAX_PLAYERS) return sendText(env, interaction, "❌ The island is full! 10 players maximum.");
  game.players[user.id]={id:user.id,username:user.username,displayName:user.global_name || user.username,hearts:3,alive:true,choice:null,points:0,sparklesEarned:0,equippedTitle:player.equippedTitle || ""};
  await islandSave(env, game);
  await acknowledge(env, interaction);
  await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game));
}

async function handleIslandLeave(env, interaction) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env, interaction.guild_id);
  const game=state.island;
  if (!game || game.status === "ended") return sendText(env, interaction, "❌ There isn't an active Chaos Island game.");
  const user=getUserFromInteraction(interaction);
  if (!game.players[user.id]) return sendText(env, interaction, "❌ You're not in this Chaos Island game.");
  delete game.players[user.id];
  if (user.id===game.hostId) {
    const next=Object.values(game.players)[0];
    if (next) game.hostId=next.id;
  }
  if (!Object.keys(game.players).length) {
    state.island=null;
    await saveGuildState(env, interaction.guild_id, state);
    await acknowledge(env, interaction);
    await islandPublicUpdate(env, interaction, "🏝️ **CHAOS ISLAND LOBBY CLOSED**\n\nEveryone left the island.", []);
    return;
  }
  await islandSave(env, game);
  await acknowledge(env, interaction);
  await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game));
}

async function handleIslandSettings(env, interaction, rounds = null) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state = await getGuildState(env, interaction.guild_id);
  const game = state.island;
  if (!game || game.status !== "lobby") return sendText(env, interaction, "❌ There isn't an open Chaos Island lobby right now.");
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  if (user.id !== game.hostId) return sendText(env, interaction, "❌ Only the island host can change game settings.");
  if (rounds !== null) {
    const value = Number(rounds);
    if (!ISLAND_ROUND_OPTIONS.includes(value)) return sendText(env, interaction, "❌ That round count isn't available.");
    game.maxRounds = value;
    await islandSave(env, game);
    await acknowledge(env, interaction);
    await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game));
    return;
  }
  await sendText(env, interaction, islandSettingsText(game), islandSettingsComponents(game));
}

async function handleIslandRules(env, interaction) {
  await sendText(env, interaction, chaosIslandRulesText());
}

async function handleIslandStart(env, interaction) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env, interaction.guild_id);
  const game=state.island;
  const user=getUserFromInteraction(interaction);
  if (!game || game.status !== "lobby") return sendText(env, interaction, "❌ There isn't an open Chaos Island lobby.");
  if (game.hostId!==user.id) return sendText(env, interaction, "❌ Only the island host can start the game.");
  if (Object.keys(game.players).length < ISLAND_MIN_PLAYERS) return sendText(env, interaction, "❌ You need at least **2 players** to start Chaos Island.");
  game.status="playing";
  game.round=1;
  game.currentScenarioId=null;
  const scenario=islandPickScenario(game);
  game.phaseEndsAt=Date.now()+ISLAND_ROUND_TIMEOUT;
  for (const p of Object.values(game.players)) { p.hearts=3; p.alive=true; p.choice=null; p.points=0; p.sparklesEarned=0; }
  await islandSave(env, game);
  await sendPublicText(env, interaction, islandGameText(game,scenario,game.currentVersion), islandChoiceRows(game,scenario));
}

async function handleIslandStatus(env, interaction) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env, interaction.guild_id);
  const game=state.island;
  if (!game) return sendText(env, interaction, "🏝️ No Chaos Island game is active.");
  const players=Object.values(game.players);
  const lines=players.map(p=>`• <@${p.id}> — ❤️ ${p.hearts} — ${p.points} pts`).join("\n");
  await sendText(env, interaction, `🏝️ **CHAOS ISLAND — ${game.status.toUpperCase()}**\n\n${lines}`);
}

async function resolveChaosIslandRound(env, game, interaction=null, timedOut=false) {
  const choices=islandCurrentChoices(game);
  const outcomeGroups={};
  for (const p of Object.values(game.players)) {
    if (!p.alive) continue;
    const choice=p.choice === null ? null : Number(p.choice);
    const outcome=choice === null ? {label:"No choice",text:"⏰ You never chose. The island assumes you fainted. Lose 1 ❤️.",hearts:-1,sparkles:0} : choices[choice];
    if (!outcome) continue;
    const key=choice===null?"none":String(choice);
    if (!outcomeGroups[key]) outcomeGroups[key]={outcome,players:[]};
    outcomeGroups[key].players.push(p);
  }
  const resultLines=[];
  for (const [key,group] of Object.entries(outcomeGroups)) {
    const o=group.outcome;
    for (const p of group.players) {
      p.hearts=Math.max(0,Number(p.hearts||0)+Number(o.hearts||0));
      if (o.sparkles) { p.sparklesEarned+=o.sparkles; p.points+=Math.floor(o.sparkles/10); }
      if (o.hearts>0) p.points+=ISLAND_SURVIVE_POINTS;
      p.choice=null;
      if (p.hearts<=0) p.alive=false;
    }
    const names=group.players.map(p=>`<@${p.id}>`).join(", ");
    resultLines.push(`${group.outcome.text}\n👥 ${names}`);
  }
  game.lastRoundResults=resultLines;
  const alive=Object.values(game.players).filter(p=>p.alive);
  if (!alive.length || game.round>=Number(game.maxRounds || ISLAND_DEFAULT_ROUNDS)) {
    game.status="ended";
    game.phaseEndsAt=0;
    const maxPoints=Math.max(...Object.values(game.players).map(p=>Number(p.points||0)));
    const winners=Object.values(game.players).filter(p=>Number(p.points||0)===maxPoints);
    for (const p of Object.values(game.players)) {
      const player=await getPlayer(env,p.id);
      const survivorReward = p.alive ? ISLAND_SURVIVOR_REWARD : 0;
      const winnerReward = winners.some(w=>w.id===p.id) ? ISLAND_WINNER_REWARD : 0;
      p.finalReward = Number(p.sparklesEarned||0) + survivorReward + winnerReward;
      player.sparkles=Number(player.sparkles||0)+p.finalReward;
      await savePlayer(env,player);
    }
    const finalLines=Object.values(game.players).sort((a,b)=>Number(b.points||0)-Number(a.points||0)).map(p=>`• <@${p.id}> — ${p.alive?"❤️ Survived":"💀 Eliminated"} — **${p.points} pts** — **${p.finalReward || 0} ✨ earned**`).join("\n");
    const winnerText=winners.map(w=>`🏆 <@${w.id}> — **${maxPoints} points**`).join("\n");
    const content=`🏝️ **CHAOS ISLAND IS OVER!**\n\n${resultLines.join("\n\n")}\n\n🏆 **WINNER${winners.length===1?"":"S"}**\n${winnerText}\n\n🎁 Survivors received **${ISLAND_SURVIVOR_REWARD} ✨**.\n🏆 Winners received an extra **${ISLAND_WINNER_REWARD} ✨**.\n\n📊 **FINAL STANDINGS**\n${finalLines}\n\n🦝 The island has been returned to the raccoons.`;
    const state=await getGuildState(env,game.guildId);
    if (state.island?.id===game.id) { state.island=null; await saveGuildState(env,game.guildId,state); }
    if (interaction) await islandPublicUpdate(env,interaction,content,[]);
    return;
  }
  game.round++;
  const scenario=islandPickScenario(game);
  game.phaseEndsAt=Date.now()+ISLAND_ROUND_TIMEOUT;
  await islandSave(env,game);
  if (interaction) await islandPublicUpdate(env,interaction,`${resultLines.join("\n\n")}\n\n${islandGameText(game,scenario,game.currentVersion)}`,islandChoiceRows(game,scenario));
}

async function handleIslandChoice(env, interaction, choiceIndex) {
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env,interaction.guild_id);
  const game=state.island;
  if (!game || game.status!=="playing") return sendText(env,interaction,"❌ There isn't an active Chaos Island round.");
  const user=getUserFromInteraction(interaction);
  const player=game.players[user.id];
  if (!player) return sendText(env,interaction,"❌ You're not in this Chaos Island game.");
  if (!player.alive) return sendText(env,interaction,"💀 You're eliminated, but you can watch the rest of the island game.");
  if (player.choice!==null) return sendText(env,interaction,"🔒 You already locked in your choice for this round!");
  const choices=islandCurrentChoices(game);
  const index=Number(choiceIndex);
  if (!Number.isInteger(index)||!choices[index]) return sendText(env,interaction,"❌ That island choice is invalid.");
  player.choice=index;
  game.currentChoices[user.id]=index;
  if (islandAllAliveChosen(game)) {
    await acknowledge(env,interaction);
    await resolveChaosIslandRound(env,game,interaction,false);
    return;
  }
  await islandSave(env,game);
  await acknowledge(env,interaction);
  const scenario=getIslandCurrentScenario(game);
  await islandPublicUpdate(env,interaction,islandGameText(game,scenario,game.currentVersion),islandChoiceRows(game,scenario));
}

async function processChaosIslandTimers(env) {
  const guildIds=await getKnownGuildIds(env);
  for (const guildId of guildIds) {
    try {
      const state=await getGuildState(env,guildId);
      const game=state.island;
      if (!game || game.status!=="playing") continue;
      if (Date.now() < Number(game.phaseEndsAt||0)) continue;
      await resolveChaosIslandRound(env,game,null,true);
      const refreshed=await getGuildState(env,guildId);
      if (game.status!=="ended" && refreshed.island?.id===game.id) { refreshed.island=game; await saveGuildState(env,guildId,refreshed); }
    } catch(error) { console.error(`Chaos Island timer failed for guild ${guildId}:`,error); }
  }
}

/* =========================================================
   SOLO MISSION
   SINGLE-PLAYER CHAOTIC STRATEGY GAME
========================================================= */

const SOLO_MISSION_ROUNDS = 8;
const SOLO_START_CASH = 500;
const SOLO_START_HEALTH = 3;
const SOLO_START_HEAT = 0;
const SOLO_MAX_HEAT = 100;

const SOLO_SCENARIOS = [
  {
    title: "The Suspicious Briefcase",
    prompt: "💼 A briefcase is sitting unattended in the middle of the street. It is humming.",
    choices: [
      { label: "👜 Take it", cash: 350, heat: 20, score: 450, message: "💰 It contains cash. Also one very angry kazoo." },
      { label: "👀 Inspect it", cash: 100, heat: 5, score: 250, message: "🧠 You spot a hidden compartment and take the safe contents." },
      { label: "🚶 Walk away", cash: 0, heat: -5, score: 80, message: "😌 You avoid trouble. Suspiciously responsible behavior." },
      { label: "🧨 Kick it", cash: 500, heat: 35, health: -1, score: 600, risky: true, message: "💥 Terrible idea. Incredible loot. Your ankle disagrees." }
    ]
  },
  {
    title: "The Raccoon Toll Booth",
    prompt: "🦝 Three raccoons have built a toll booth and demand payment to cross.",
    choices: [
      { label: "🧀 Pay cheese", cash: -50, heat: -10, score: 180, message: "🧀 The raccoons respect the cheese economy." },
      { label: "💰 Bribe them", cash: -150, heat: -20, score: 300, message: "🦝 The raccoons accept the bribe and give you a suspicious receipt." },
      { label: "🏃 Sprint through", cash: 250, heat: 25, health: -1, score: 500, risky: true, message: "🏃 You escape with your dignity missing but your wallet fuller." },
      { label: "🤝 Join their union", cash: 400, heat: 10, score: 550, message: "🦝 You are now middle management for raccoons." }
    ]
  },
  {
    title: "The Cheese Vault",
    prompt: "🧀 You discover a vault containing an irresponsible amount of cheese and a keypad.",
    choices: [
      { label: "🔐 Crack the code", cash: 600, heat: 30, score: 700, risky: true, message: "💰 The vault opens. You definitely did not learn that code legally." },
      { label: "🧠 Study the keypad", cash: 250, heat: 5, score: 400, message: "🧠 Patience pays. Mostly in cheese." },
      { label: "🧀 Take one wheel", cash: 100, heat: 0, score: 220, message: "🧀 You take one wheel. The cheese council nods approvingly." },
      { label: "🚨 Set off the alarm", cash: 900, heat: 55, health: -1, score: 850, risky: true, message: "🚨 Somehow this works. You grab the biggest cheese and run." }
    ]
  },
  {
    title: "The Werewife Meeting",
    prompt: "🐺 You accidentally walk into a secret meeting. Everyone stops talking.",
    choices: [
      { label: "😎 Pretend you're invited", cash: 300, heat: 15, score: 450, message: "😎 Nobody questions your confidence." },
      { label: "📝 Take notes", cash: 450, heat: 25, score: 600, risky: true, message: "📝 You leave with extremely questionable intelligence." },
      { label: "🙇 Apologize and leave", cash: 0, heat: -15, score: 150, message: "🏃 You escape before anyone asks your name." },
      { label: "🍕 Offer pizza", cash: -100, heat: -25, score: 350, message: "🍕 Pizza solves diplomacy. Obviously." }
    ]
  },
  {
    title: "The Sparkle Mine",
    prompt: "✨ A glittering mine is filled with loose sparkles. A sign says: 'Probably Safe.'",
    choices: [
      { label: "⛏️ Mine aggressively", cash: 700, heat: 35, health: -1, score: 900, risky: true, message: "✨ You mine like rent is due." },
      { label: "🔎 Take the easy glitter", cash: 300, heat: 5, score: 450, message: "✨ Small haul, minimal nonsense." },
      { label: "🛡️ Gear up first", cash: -100, heat: -5, health: 1, score: 300, message: "🛡️ You prepare properly. Grossly responsible." },
      { label: "🦝 Ask a raccoon", cash: 450, heat: 10, score: 500, message: "🦝 The raccoon points at the richest tunnel and demands 10%." }
    ]
  },
  {
    title: "The Totally Legal Casino",
    prompt: "🎰 A neon casino appears. The front door says 'Definitely Not A Trap.'",
    choices: [
      { label: "🎲 Bet small", cash: 250, heat: 5, score: 350, message: "🎲 You win. The universe shrugs." },
      { label: "💰 Bet big", cash: 800, heat: 25, score: 900, risky: true, message: "💰 Somehow you hit the jackpot." },
      { label: "🧠 Count cards", cash: 600, heat: 45, score: 850, risky: true, message: "🧠 You were too good. Security noticed." },
      { label: "🚪 Leave", cash: 0, heat: -20, score: 180, message: "🚪 You refuse to be financially manipulated by a building." }
    ]
  },
  {
    title: "The Police Officer Who Is Definitely Not A Raccoon",
    prompt: "🚨 A suspiciously furry officer asks why you're carrying a briefcase full of cheese.",
    choices: [
      { label: "😇 Tell the truth", cash: -100, heat: -30, score: 250, message: "😇 Honesty works. Nobody knows why." },
      { label: "🕵️ Make up a story", cash: 200, heat: 15, score: 400, message: "🕵️ Your lie is terrible. Your confidence is excellent." },
      { label: "🧀 Offer cheese", cash: -75, heat: -40, score: 500, message: "🧀 The officer quietly accepts the cheese." },
      { label: "🏃 RUN", cash: 500, heat: 60, health: -1, score: 800, risky: true, message: "🏃 You run. This is now significantly more complicated." }
    ]
  },
  {
    title: "The Final Door",
    prompt: "🚪 You reach a giant door with four buttons: SAFE, RICH, CHAOS, and DO NOT PRESS.",
    choices: [
      { label: "🛡️ SAFE", cash: 250, heat: -20, score: 350, message: "🛡️ Boring. Effective. You survive." },
      { label: "💰 RICH", cash: 1000, heat: 35, score: 1100, message: "💰 The door opens to a vault. Beautiful." },
      { label: "🌪️ CHAOS", cash: 1300, heat: 50, health: -1, score: 1300, risky: true, message: "🌪️ Everything explodes into glitter. You somehow profit." },
      { label: "☠️ DO NOT PRESS", cash: 2000, heat: 70, health: -2, score: 1700, risky: true, message: "☠️ You pressed it. Of course you pressed it." }
    ]
  },
  {
    title: "The Mystery Button",
    prompt: "🔴 A red button appears on a pedestal. There is no explanation.",
    choices: [
      { label: "🔴 Press it", cash: 500, heat: 30, score: 650, risky: true, message: "🔴 A money cannon activates. This feels illegal." },
      { label: "🧠 Inspect it", cash: 150, heat: 0, score: 300, message: "🧠 You find a hidden coin slot and make a modest profit." },
      { label: "🚶 Ignore it", cash: 0, heat: -10, score: 120, message: "🚶 You resist the button. Character development!" },
      { label: "🦝 Let a raccoon press it", cash: 750, heat: 20, score: 800, message: "🦝 The raccoon presses it. You accept the consequences." }
    ]
  },
  {
    title: "The Escape Cart",
    prompt: "🛒 A shopping cart with an engine offers you a questionable escape route.",
    choices: [
      { label: "🏎️ Floor it", cash: 600, heat: 45, health: -1, score: 850, risky: true, message: "🏎️ You have achieved shopping-cart velocity." },
      { label: "🛞 Drive carefully", cash: 250, heat: 5, score: 400, message: "🛞 Somehow the cart has excellent handling." },
      { label: "🔧 Fix the brakes", cash: 100, heat: -10, health: 1, score: 300, message: "🔧 You improve the cart and your odds." },
      { label: "🦝 Give it to the raccoons", cash: 450, heat: 0, score: 550, message: "🦝 The raccoons take the cart. They are now faster than you." }
    ]
  }

  {
    title: "The Glitter Laundromat",
    prompt: "🫧 You discover a laundromat where every washing machine is filled with loose sparkles.",
    choices: [
      { label: "✨ Open every machine", cash: 700, heat: 35, score: 850, risky: true, message: "✨ You hit the sparkle jackpot and leave covered in glitter." },
      { label: "🧺 Check one machine", cash: 300, heat: 5, score: 450, message: "🧺 One machine pays out. The others remain suspicious." },
      { label: "🧼 Wash your clothes", cash: 0, heat: -15, score: 180, message: "🧼 You came for crime and accidentally did laundry." },
      { label: "🦝 Hire a raccoon", cash: 550, heat: 20, score: 650, message: "🦝 The raccoon handles the machines. You refuse to ask how." }
    ]
  },
  {
    title: "The Fake Treasure Map",
    prompt: "🗺️ A treasure map claims the greatest prize in Werewives is buried beneath a very normal bush.",
    choices: [
      { label: "⛏️ Dig immediately", cash: 650, heat: 25, score: 750, risky: true, message: "⛏️ You find a glitter chest. The bush was absolutely suspicious." },
      { label: "🔎 Study the map", cash: 350, heat: 5, score: 500, message: "🔎 You notice a second treasure marker and choose wisely." },
      { label: "🌳 Dig elsewhere", cash: 150, heat: 0, score: 250, message: "🌳 You find old coins and a deeply offended worm." },
      { label: "🦝 Ask the bush raccoon", cash: 500, heat: 15, score: 600, message: "🦝 The raccoon already knew where the treasure was." }
    ]
  },
  {
    title: "The Suspicious Vending Machine",
    prompt: "🥤 A vending machine offers snacks, rare loot, and one button labeled CHAOS.",
    choices: [
      { label: "🥤 Buy a snack", cash: -50, heat: -5, score: 220, message: "🥤 The snack is weirdly delicious." },
      { label: "💎 Buy the mystery item", cash: 450, heat: 15, score: 600, message: "💎 You receive a tiny bag of valuable gems." },
      { label: "🔴 PRESS CHAOS", cash: 1000, heat: 55, health: -1, score: 1200, risky: true, message: "🌪️ The vending machine becomes a money cannon." },
      { label: "🧠 Shake it", cash: 250, heat: 20, score: 400, risky: true, message: "🧠 You shake it. A coin falls out. Probably worth it." }
    ]
  },
  {
    title: "The Werewolf Delivery",
    prompt: "🐺 A sealed package arrives with instructions: 'Do NOT open before delivery.'",
    choices: [
      { label: "📦 Deliver it", cash: 350, heat: -10, score: 450, message: "📦 You deliver it without incident. Suspiciously professional." },
      { label: "👀 Peek inside", cash: 600, heat: 30, score: 750, risky: true, message: "👀 It's full of expensive jewelry. You saw nothing." },
      { label: "🧀 Replace it with cheese", cash: 500, heat: 15, score: 650, message: "🧀 The cheese substitution is somehow accepted." },
      { label: "🏃 Run away with it", cash: 900, heat: 50, health: -1, score: 1000, risky: true, message: "🏃 You have accidentally become a courier fugitive." }
    ]
  },
  {
    title: "The Glittering Bridge",
    prompt: "🌉 A magical bridge charges a different toll depending on how confident you look.",
    choices: [
      { label: "😎 Strut across", cash: 450, heat: 10, score: 550, message: "😎 Confidence wins. The bridge respects the attitude." },
      { label: "💰 Pay the toll", cash: -100, heat: -10, score: 250, message: "💰 You pay. The bridge gives you a coupon." },
      { label: "🦝 Send a raccoon first", cash: 700, heat: 20, score: 750, message: "🦝 The raccoon negotiates aggressively." },
      { label: "🏃 Sprint", cash: 550, heat: 45, health: -1, score: 850, risky: true, message: "🏃 You outrun the bridge's magical toll collectors." }
    ]
  },
  {
    title: "The Secret Arcade",
    prompt: "🕹️ A hidden arcade offers enormous prizes if you can beat three suspicious machines.",
    choices: [
      { label: "🕹️ Play normally", cash: 350, heat: 5, score: 500, message: "🕹️ You win a respectable pile of tickets." },
      { label: "⚡ Mash everything", cash: 800, heat: 35, score: 900, risky: true, message: "⚡ The machines cannot handle your button energy." },
      { label: "🧠 Find the pattern", cash: 550, heat: 0, score: 700, message: "🧠 You crack the machines like a puzzle." },
      { label: "🦝 Let the raccoon play", cash: 1000, heat: 25, score: 1100, risky: true, message: "🦝 The raccoon becomes an arcade champion." }
    ]
  },
  {
    title: "The Cheese Auction",
    prompt: "🧀 A fancy auction is selling a legendary wheel of cheese. Everyone looks extremely serious.",
    choices: [
      { label: "💰 Bid carefully", cash: 250, heat: 0, score: 450, message: "💰 You somehow leave with a profit." },
      { label: "🔥 Outbid everyone", cash: 900, heat: 30, score: 1000, risky: true, message: "🔥 You win the cheese and immediately regret the price." },
      { label: "🎭 Fake a bid", cash: 500, heat: 40, score: 850, risky: true, message: "🎭 Your fake bid causes chaos and a surprising payout." },
      { label: "🧀 Eat the sample", cash: 50, heat: -5, score: 200, message: "🧀 You contributed absolutely nothing to the auction." }
    ]
  },
  {
    title: "The Moonlight Warehouse",
    prompt: "🌙 A warehouse door opens only under moonlight. Something valuable is glowing inside.",
    choices: [
      { label: "🔦 Enter quietly", cash: 450, heat: 10, score: 600, message: "🔦 You find a neat stash and leave quietly." },
      { label: "💎 Grab the glowing crate", cash: 900, heat: 40, score: 1000, risky: true, message: "💎 The crate is worth a fortune." },
      { label: "👂 Listen first", cash: 250, heat: -5, score: 350, message: "👂 You wait for the warehouse to settle before taking a small haul." },
      { label: "🦝 Send raccoons", cash: 750, heat: 25, score: 850, message: "🦝 The raccoons return carrying things you didn't ask about." }
    ]
  },
  {
    title: "The Emergency Cheese Alarm",
    prompt: "🚨 An alarm blares: 'EMERGENCY! SOMEONE HAS STOLEN THE CHEESE.' Everyone points at you.",
    choices: [
      { label: "😇 Deny everything", cash: 200, heat: -15, score: 350, message: "😇 Your confidence is somehow convincing." },
      { label: "🧀 Confess to one cheese", cash: -50, heat: -25, score: 300, message: "🧀 You admit to a tiny cheese crime. The crowd respects it." },
      { label: "🏃 Blame the raccoons", cash: 500, heat: 35, score: 700, risky: true, message: "🦝 The raccoons are furious but you escape." },
      { label: "🎭 Become the detective", cash: 650, heat: 10, score: 800, message: "🕵️ You solve the mystery and keep the reward." }
    ]
  },
  {
    title: "The Tiny Casino Boat",
    prompt: "🚤 A tiny boat offers you one trip across a glittering lake and one very questionable game of chance.",
    choices: [
      { label: "🎲 Play safe", cash: 250, heat: 0, score: 350, message: "🎲 Safe choice. Safe profit." },
      { label: "💰 Double down", cash: 900, heat: 30, score: 1000, risky: true, message: "💰 You double down and somehow double everything." },
      { label: "🌊 Explore the lake", cash: 450, heat: 10, score: 600, message: "🌊 You find a floating chest." },
      { label: "🦝 Let the raccoon captain", cash: 800, heat: 45, health: -1, score: 950, risky: true, message: "🦝 The raccoon drives like it has nine lives." }
    ]
  },
  {
    title: "The Password Wall",
    prompt: "🔐 A wall demands a password. A sticky note says: 'Definitely not CHEESE.'",
    choices: [
      { label: "🧀 Try CHEESE", cash: 700, heat: 30, score: 850, risky: true, message: "🧀 It was cheese. Of course it was cheese." },
      { label: "🧠 Think logically", cash: 350, heat: 0, score: 550, message: "🧠 You solve the clue properly." },
      { label: "🔴 Press random buttons", cash: 500, heat: 45, health: -1, score: 750, risky: true, message: "🔴 One button opens the wall. Another definitely should not have been pressed." },
      { label: "🚪 Leave", cash: 0, heat: -20, score: 180, message: "🚪 You choose peace over password nonsense." }
    ]
  },
  {
    title: "The Raccoon Rooftop",
    prompt: "🏙️ A rooftop is covered in shiny objects guarded by a suspiciously organized raccoon crew.",
    choices: [
      { label: "🤝 Negotiate", cash: 400, heat: -5, score: 550, message: "🤝 The raccoons accept your proposal and split the loot." },
      { label: "💎 Grab the biggest shiny", cash: 850, heat: 40, score: 950, risky: true, message: "💎 You grab the biggest shiny and immediately become unpopular." },
      { label: "🦝 Join the crew", cash: 650, heat: 5, score: 800, message: "🦝 You have been promoted to assistant shiny manager." },
      { label: "🏃 Escape", cash: 300, heat: 25, health: -1, score: 650, risky: true, message: "🏃 You leave with one shiny and several raccoon complaints." }
    ]
  },
  {
    title: "The Glitter Train",
    prompt: "🚂 A mysterious train stops for exactly one minute. Every passenger is carrying treasure.",
    choices: [
      { label: "🚪 Hop aboard", cash: 600, heat: 30, score: 800, risky: true, message: "🚂 You jump aboard and discover a treasure carriage." },
      { label: "🎟️ Buy a ticket", cash: -100, heat: -10, score: 400, message: "🎟️ You travel legally. How strange." },
      { label: "🕵️ Watch passengers", cash: 300, heat: 5, score: 500, message: "🕵️ You spot a dropped wallet and return it for a reward." },
      { label: "🦝 Send a raccoon aboard", cash: 900, heat: 45, score: 1000, risky: true, message: "🦝 The raccoon returns before the train leaves with an entire suitcase." }
    ]
  },
];

const SOLO_TITLES = {
  rabid_raccoon: { name: "the Rabid Raccoon", description: "Finish a Solo Mission after making a raccoon-related choice." },
  cheese_boss: { name: "the Cheese Boss", description: "Finish a Solo Mission with at least 3,000 cash." },
  sparkle_princess: { name: "the Sparkle Princess", description: "Earn at least 1,000 sparkles from Solo Mission." },
  lucky: { name: "the Unreasonably Lucky", description: "Finish a mission with exactly 1 ❤️ remaining." },
  public_menace: { name: "the Public Menace", description: "Reach 90+ Heat and survive the mission." },
  bad_decision: { name: "the Walking Bad Decision", description: "Make 5 risky choices in one mission." },
  chaos_royalty: { name: "the Chaos Royalty", description: "Score 5,000+ in a single mission." },
  untouchable: { name: "the Untouchable", description: "Finish a mission with 10 or less Heat." },
  rich_goblin: { name: "the Rich Goblin", description: "Finish a mission with 2,000+ cash." },
  iron_will: { name: "the Iron Will", description: "Finish a mission without losing any ❤️." },
  button_goblin: { name: "the Button Goblin", description: "Press 3 or more obviously suspicious buttons/choices." },
  survivor: { name: "the Mission Survivor", description: "Complete your first Solo Mission." }
};

function soloPlayerName(player) {
  const name = player.displayName || player.username || "Werewife";
  const title = player.equippedTitle && SOLO_TITLES[player.equippedTitle]?.name;
  return title ? `${name} ${title}` : name;
}

function soloChoiceRows(game) {
  const scenario = game.currentScenario;
  const rows = [];
  for (let i = 0; i < scenario.choices.length; i += 2) {
    rows.push(row(
      button(scenario.choices[i].label, `solo:choice:${i}`, 2),
      scenario.choices[i + 1] ? button(scenario.choices[i + 1].label, `solo:choice:${i + 1}`, 2) : button("—", "solo:noop", 2, true)
    ));
  }
  rows.push(row(button("🛑 Abort Mission", "solo:abort", 4)));
  return rows;
}

function soloGameText(game) {
  return [
    `🕵️ **SOLO MISSION — ROUND ${game.round}/${game.maxRounds}**`,
    `👤 **${game.playerName}**`,
    "",
    `❤️ **Health:** ${game.health}/3`,
    `💰 **Stash:** ${game.cash}`,
    `🚨 **Heat:** ${game.heat}/100`,
    `🏆 **Score:** ${game.score}`,
    `🎲 **Risky choices:** ${game.riskyChoices}`,
    "",
    `### ${game.currentScenario.title}`,
    game.currentScenario.prompt,
    "",
    "Choose carefully. The raccoons are watching. 🦝"
  ].join("\n");
}

function soloPickScenario(game) {
  const used = new Set(game.usedScenarioIds || []);
  let pool = SOLO_SCENARIOS.filter(s => !used.has(s.title));
  if (!pool.length) { game.usedScenarioIds = []; pool = SOLO_SCENARIOS; }
  const scenario = pool[randomInt(0, pool.length - 1)];
  game.usedScenarioIds.push(scenario.title);
  game.currentScenario = scenario;
  game.currentChoice = null;
  return scenario;
}

function soloMissionMenuText(player) {
  return [
    "🕵️ **SOLO MISSION**",
    "",
    `👤 **${soloPlayerName(player)}**`,
    "",
    "A single-player strategic chaos run where every decision can help you, hurt you, or make the situation dramatically worse.",
    "",
    "💰 Manage your stash.",
    "🚨 Keep your Heat under control.",
    "❤️ Protect your health.",
    "🧠 Take risks when the payoff is worth it.",
    "🏆 Finish with the highest score you can.",
    "",
    `📊 **Your best score:** ${Number(player.soloBestScore || 0)}`,
    `🎮 **Runs completed:** ${Number(player.soloRuns || 0)}`
  ].join("\n");
}

function soloMenuComponents() {
  return [
    row(button("🕵️ Start Solo Mission", "solo:start", 1), button("🏆 Leaderboard", "games:solo_leaderboard", 2)),
    row(button("🏷️ Titles", "title:list", 3), button("🎮 Games", "games:menu", 2))
  ];
}

async function updateSoloLeaderboard(env, player, score) {
  const raw = await env.TREE_DATA.get("solo:leaderboard");
  let board = [];
  try { board = raw ? JSON.parse(raw) : []; } catch { board = []; }
  board = Array.isArray(board) ? board : [];
  const existing = board.find(x => x.userId === player.userId);
  if (existing) {
    if (score > Number(existing.score || 0)) {
      existing.score = score;
      existing.displayName = player.displayName || player.username || "Werewife";
      existing.title = player.equippedTitle || "";
    }
  } else {
    board.push({ userId: player.userId, displayName: player.displayName || player.username || "Werewife", score, title: player.equippedTitle || "" });
  }
  board.sort((a,b) => Number(b.score || 0) - Number(a.score || 0));
  board = board.slice(0, 10);
  await env.TREE_DATA.put("solo:leaderboard", JSON.stringify(board));
  return board;
}

async function getSoloLeaderboard(env) {
  const raw = await env.TREE_DATA.get("solo:leaderboard");
  try {
    const board = raw ? JSON.parse(raw) : [];
    return Array.isArray(board) ? board : [];
  } catch { return []; }
}

function unlockSoloTitles(player, mission) {
  if (!Array.isArray(player.titles)) player.titles = [];
  const unlock = id => { if (!player.titles.includes(id)) player.titles.push(id); };
  unlock("survivor");
  if (mission.raccoonChoice) unlock("rabid_raccoon");
  if (mission.cash >= 3000) unlock("cheese_boss");
  if (mission.sparklesEarned >= 1000) unlock("sparkle_princess");
  if (mission.health === 1) unlock("lucky");
  if (mission.highestHeat >= 90) unlock("public_menace");
  if (mission.riskyChoices >= 5) unlock("bad_decision");
  if (mission.finalScore >= 5000) unlock("chaos_royalty");
  if (mission.heat <= 10) unlock("untouchable");
  if (mission.cash >= 2000) unlock("rich_goblin");
  if (mission.health === SOLO_START_HEALTH) unlock("iron_will");
  if (mission.buttonChoices >= 3) unlock("button_goblin");
}

async function handleGamesMenu(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  await savePlayer(env, player);
  await sendText(env, interaction, `🎮 **WEREWIVES GAMES**\n\n👤 **${soloPlayerName(player)}**\n\n🕵️ **Solo Mission** — single-player strategic chaos\n🏝️ **Chaos Island** — multiplayer survival chaos\n💰 **Heist Game** — multiplayer social deduction\n\n🌳 The Tree is separate — use **/tree**.`, [
    row(button("🏝️ Chaos Island", "games:island", 1), button("💰 Heist Game", "games:heist", 2)),
    row(button("🕵️ Solo Mission", "games:solo", 3), button("🏆 Solo Leaderboard", "games:solo_leaderboard", 2)),
    row(button("🏷️ Titles", "title:list", 2))
  ]);
}

async function handleSoloStart(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  if (player.soloMission && player.soloMission.status === "playing") {
    await sendText(env, interaction, "❌ You already have a Solo Mission in progress. Finish it first!", soloMenuComponents());
    return;
  }
  const game = {
    id: `solo-${Date.now()}-${user.id}`,
    userId: user.id,
    playerName: soloPlayerName(player),
    status: "playing",
    round: 1,
    maxRounds: SOLO_MISSION_ROUNDS,
    health: SOLO_START_HEALTH,
    cash: SOLO_START_CASH,
    heat: SOLO_START_HEAT,
    score: 0,
    riskyChoices: 0,
    buttonChoices: 0,
    highestHeat: 0,
    sparklesEarned: 0,
    raccoonChoice: false,
    usedScenarioIds: [],
    currentScenario: null,
    currentChoice: null
  };
  soloPickScenario(game);
  player.soloMission = game;
  await savePlayer(env, player);
  await sendPublicText(env, interaction, soloGameText(game), soloChoiceRows(game));
}

async function finishSoloMission(env, interaction, player, game, aborted = false) {
  game.status = "ended";
  let finalScore = Math.max(0, Math.floor(Number(game.score || 0) + Number(game.cash || 0) * 2 + Number(game.health || 0) * 100 - Number(game.heat || 0) * 10));
  if (aborted) finalScore = Math.floor(finalScore * 0.25);
  game.finalScore = finalScore;
  player.soloRuns = Number(player.soloRuns || 0) + 1;
  if (!aborted) player.soloWins = Number(player.soloWins || 0) + 1;
  player.soloBestScore = Math.max(Number(player.soloBestScore || 0), finalScore);
  player.soloBestStash = Math.max(Number(player.soloBestStash || 0), Number(game.cash || 0));
  player.soloRiskyChoices = Math.max(Number(player.soloRiskyChoices || 0), Number(game.riskyChoices || 0));
  player.soloPerfectRuns = Number(player.soloPerfectRuns || 0) + (game.health === SOLO_START_HEALTH && !aborted ? 1 : 0);
  player.soloHighestHeat = Math.max(Number(player.soloHighestHeat || 0), Number(game.highestHeat || 0));
  const reward = aborted ? 0 : Math.min(1000, Math.max(50, Math.floor(finalScore / 20)));
  player.soloSparklesEarned = Number(player.soloSparklesEarned || 0) + reward;
  player.sparkles = Number(player.sparkles || 0) + reward;
  unlockSoloTitles(player, { ...game, finalScore });
  player.soloMission = null;
  await savePlayer(env, player);
  if (!aborted) await updateSoloLeaderboard(env, player, finalScore);
  const unlocked = player.titles.map(id => SOLO_TITLES[id]?.name).filter(Boolean);
  const titleText = unlocked.length ? `\n🏷️ **Titles unlocked:** ${unlocked.slice(-4).map(x => `**${x}**`).join(", ")}` : "";
  const content = aborted
    ? `🛑 **SOLO MISSION ABORTED**\n\nYour run score was **${finalScore}**. No sparkles awarded.\n\nYou can try again anytime. 🕵️`
    : `🏁 **SOLO MISSION COMPLETE!**\n\n👤 **${soloPlayerName(player)}**\n🏆 **Final Score:** ${finalScore}\n💰 **Final Stash:** ${game.cash}\n❤️ **Health:** ${game.health}/3\n🚨 **Highest Heat:** ${game.highestHeat}/100\n✨ **Sparkles Earned:** +${reward}${titleText}\n\n🏆 Check **/solo-leaderboard** to see where you rank!`;
  await editOriginalResponse(env, interaction, { content, components: [row(button("🕵️ Play Again", "solo:start", 1), button("🏆 Leaderboard", "games:solo_leaderboard", 2)), row(button("🏷️ Titles", "title:list", 3), button("🎮 Games", "games:menu", 2))] });
}

async function handleSoloChoice(env, interaction, choiceIndex) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  const game = player.soloMission;
  if (!game || game.status !== "playing") return sendText(env, interaction, "❌ You don't have an active Solo Mission. Use **/solo** to start one.");
  const index = Number(choiceIndex);
  const choice = game.currentScenario?.choices?.[index];
  if (!choice) return sendText(env, interaction, "❌ That Solo Mission choice is invalid.");
  game.currentChoice = index;
  if (choice.risky) game.riskyChoices = Number(game.riskyChoices || 0) + 1;
  if (String(choice.label).includes("raccoon") || String(choice.label).includes("Raccoon")) game.raccoonChoice = true;
  if (String(choice.label).includes("BUTTON") || String(choice.label).includes("button") || String(choice.label).includes("Press")) game.buttonChoices = Number(game.buttonChoices || 0) + 1;
  game.cash = Math.max(0, Number(game.cash || 0) + Number(choice.cash || 0));
  game.heat = Math.max(0, Math.min(SOLO_MAX_HEAT, Number(game.heat || 0) + Number(choice.heat || 0)));
  game.health = Math.max(0, Math.min(SOLO_START_HEALTH, Number(game.health || 0) + Number(choice.health || 0)));
  game.score += Number(choice.score || 0);
  game.highestHeat = Math.max(Number(game.highestHeat || 0), game.heat);
  game.sparklesEarned += Math.max(0, Math.floor(Number(choice.score || 0) / 4));
  const result = choice.message;
  if (game.health <= 0 || game.heat >= SOLO_MAX_HEAT || game.round >= game.maxRounds) {
    game.score += Math.max(0, game.health) * 100;
    await savePlayer(env, player);
    await acknowledge(env, interaction);
    await finishSoloMission(env, interaction, player, game, false);
    return;
  }
  game.round++;
  soloPickScenario(game);
  await savePlayer(env, player);
  await acknowledge(env, interaction);
  await editOriginalResponse(env, interaction, { content: `${result}\n\n${soloGameText(game)}`, components: soloChoiceRows(game) });
}

async function handleSoloAbort(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  const game = player.soloMission;
  if (!game || game.status !== "playing") return sendText(env, interaction, "❌ You don't have an active Solo Mission.");
  await acknowledge(env, interaction);
  await finishSoloMission(env, interaction, player, game, true);
}

async function handleSoloStatus(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  if (!player.soloMission || player.soloMission.status !== "playing") {
    await sendText(env, interaction, soloMissionMenuText(player), soloMenuComponents());
    return;
  }
  await sendText(env, interaction, soloGameText(player.soloMission), soloChoiceRows(player.soloMission));
}

async function handleSoloLeaderboard(env, interaction) {
  const board = await getSoloLeaderboard(env);
  if (!board.length) return sendText(env, interaction, "🏆 **SOLO MISSION LEADERBOARD**\n\nNo completed missions yet. Be the first! 🕵️");
  const lines = board.map((entry, i) => {
    const title = entry.title && SOLO_TITLES[entry.title]?.name ? ` ${SOLO_TITLES[entry.title].name}` : "";
    return `${i + 1}. **${entry.displayName}${title}** — **${entry.score} pts**`;
  });
  await sendText(env, interaction, `🏆 **SOLO MISSION LEADERBOARD**\n\n${lines.join("\n")}`);
}

async function handleTitleList(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  const equipped = player.equippedTitle && SOLO_TITLES[player.equippedTitle] ? SOLO_TITLES[player.equippedTitle].name : "None";
  const lines = Object.entries(SOLO_TITLES).map(([id, t]) => `${player.titles.includes(id) ? "🏆" : "🔒"} **${t.name}** — ${t.description}${player.equippedTitle === id ? " — ⭐ EQUIPPED" : ""}`);
  await sendText(env, interaction, `🏷️ **YOUR TITLES**\n\nCurrently equipped: **${equipped}**\n\n${lines.join("\n\n")}`, [
    row(...player.titles.slice(0, 5).map(id => button(`Equip ${SOLO_TITLES[id]?.name || id}`, `title:equip:${id}`, 2))),
    ...(player.titles.length > 5 ? [row(...player.titles.slice(5, 10).map(id => button(`Equip ${SOLO_TITLES[id]?.name || id}`, `title:equip:${id}`, 2)))] : []),
    row(button("❌ Unequip Title", "title:unequip", 4), button("🎮 Games", "games:menu", 2))
  ]);
}

async function handleTitleEquip(env, interaction, titleId) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  if (!player.titles.includes(titleId) || !SOLO_TITLES[titleId]) return sendText(env, interaction, "🔒 You haven't unlocked that title yet.");
  player.equippedTitle = titleId;
  await savePlayer(env, player);
  await sendText(env, interaction, `🏷️ **Title equipped!**\n\nYou are now **${soloPlayerName(player)}**. 👑`);
}

async function handleTitleUnequip(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  player.equippedTitle = "";
  await savePlayer(env, player);
  await sendText(env, interaction, "🏷️ Title unequipped. You are now title-less. 😭");
}

/* =========================================================
   RACCOON HEIST
   3-12 PLAYER DISCORD SOCIAL DEDUCTION GAME

   The game is stored inside the existing guild state so no
   additional Cloudflare binding is required.

   Night actions are private button interactions.
   The public game channel is locked during Night.
========================================================= */

const HEIST_MIN_PLAYERS = 3;
const HEIST_MAX_PLAYERS = 12;
const HEIST_NIGHT_DURATION = 30 * 1000;
const HEIST_VOTE_DURATION = 3 * 60 * 1000;
const HEIST_STARTING_VAULT = 10000;
const HEIST_STEAL_MIN = 500;
const HEIST_STEAL_MAX = 1500;
const HEIST_WIN_REWARD = 500;

const HEIST_PERMISSIONS = {
  SEND_MESSAGES: 2048n,
  SEND_MESSAGES_IN_THREADS: 274877906944n,
  CREATE_PUBLIC_THREADS: 34359738368n,
  CREATE_PRIVATE_THREADS: 68719476736n
};

const HEIST_ROLE_DEFINITIONS = {
  thief: {
    name: "🦝 The Thief",
    team: "thief",
    description:
      "Steal from the vault and survive the vote. You are the one everyone is hunting.",
    action: "steal",
    actionLabel: "💰 Steal"
  },

  detective: {
    name: "🕵️ The Detective",
    team: "hunters",
    description:
      "Investigate players and help discover who the Thief is.",
    action: "investigate",
    actionLabel: "🔎 Investigate"
  },

  guard: {
    name: "🛡️ The Guard",
    team: "hunters",
    description:
      "Protect a player or the vault from certain night actions.",
    action: "protect",
    actionLabel: "🛡️ Protect"
  },

  rabid_raccoon: {
    name: "🦝💢 The Rabid Raccoon",
    team: "rabid",
    description:
      "Bite everyone. Spread rabies to every other living player.",
    action: "bite",
    actionLabel: "🦷 BITE"
  },

  con_artist: {
    name: "🎭 The Con Artist",
    team: "neutral",
    description:
      "Plant suspicious evidence on another player and cause confusion.",
    action: "frame",
    actionLabel: "🎭 Frame"
  },

  locksmith: {
    name: "🔐 The Locksmith",
    team: "hunters",
    description:
      "Jam the vault or a player so a night action cannot work.",
    action: "jam",
    actionLabel: "🔐 Jam"
  },

  banker: {
    name: "💰 The Banker",
    team: "hunters",
    description:
      "Move part of the vault into a protected reserve.",
    action: "secure",
    actionLabel: "🏦 Secure"
  },

  undercover: {
    name: "🥸 The Undercover Raccoon",
    team: "hunters",
    description:
      "Hide your identity from investigations for the night.",
    action: "hide",
    actionLabel: "🥸 Disguise"
  },

  saboteur: {
    name: "🧨 The Saboteur",
    team: "neutral",
    description:
      "Cancel another player's night action.",
    action: "sabotage",
    actionLabel: "🧨 Sabotage"
  },

  trapper: {
    name: "🪤 The Trapper",
    team: "hunters",
    description:
      "Place a trap and learn whether your target acted during the night.",
    action: "trap",
    actionLabel: "🪤 Trap"
  },

  spy: {
    name: "🕶️ The Spy",
    team: "hunters",
    description:
      "Watch another player and learn what action they performed.",
    action: "watch",
    actionLabel: "🕶️ Watch"
  },

  cleaner: {
    name: "🧹 The Cleaner",
    team: "thief",
    description:
      "Erase useful evidence from the night's events. Help the Thief stay hidden.",
    action: "clean",
    actionLabel: "🧹 Clean"
  },

  informant: {
    name: "🐀 The Informant",
    team: "neutral",
    description:
      "Eavesdrop on a player and receive a useful clue about their activity.",
    action: "eavesdrop",
    actionLabel: "👂 Eavesdrop"
  },

  gambler: {
    name: "🎲 The Gambler",
    team: "neutral",
    description:
      "Risk your luck for heist loot. Reach 2,000 gamble points to complete your secret goal.",
    action: "gamble",
    actionLabel: "🎲 Gamble"
  },

  ringleader: {
    name: "👑 The Ringleader",
    team: "thief",
    description:
      "Help the Thief by distracting players. If the Thief wins, you win too.",
    action: "distract",
    actionLabel: "👑 Distract"
  },

  escape_artist: {
    name: "🦊 The Escape Artist",
    team: "neutral",
    description:
      "Prepare one escape. If you are voted out later, your escape can save you once.",
    action: "escape",
    actionLabel: "🦊 Prepare Escape"
  },

  cheese_goblin: {
    name: "🧀 The Cheese Goblin",
    team: "neutral",
    description:
      "Ignore the robbery. Collect three pieces of cheese before the game ends.",
    action: "scavenge",
    actionLabel: "🧀 Scavenge"
  },

  raccoon_royalty: {
    name: "🦝👑 Raccoon Royalty",
    team: "neutral",
    description:
      "Prepare royal protection. Your first vote against you can be cancelled.",
    action: "crown",
    actionLabel: "👑 Raise the Crown"
  },

  ghost: {
    name: "👻 The Ghost",
    team: "neutral",
    description:
      "If eliminated, haunt a living player and receive a clue from beyond the trash can.",
    action: "haunt",
    actionLabel: "👻 Haunt"
  },

  lookout: {
    name: "👀 The Lookout",
    team: "hunters",
    description:
      "Watch one player during the night and learn what action they performed. Built for small games.",
    action: "watch",
    actionLabel: "👀 Watch"
  },

  tracker: {
    name: "🧭 The Tracker",
    team: "hunters",
    description:
      "Follow one player and learn whether they targeted someone during the night.",
    action: "track",
    actionLabel: "🧭 Track"
  },

  oracle: {
    name: "🔮 The Oracle",
    team: "hunters",
    description:
      "Read one player's alignment and learn whether they are on the Thief, Hunter, or Neutral side.",
    action: "reveal",
    actionLabel: "🔮 Reveal"
  },

  magician: {
    name: "🪄 The Magician",
    team: "neutral",
    description:
      "Create an illusion that can make the next investigation of a player misleading.",
    action: "illusion",
    actionLabel: "🪄 Illusion"
  },

  patient_zero: {
    name: "🦠 Patient Zero",
    team: "rabid",
    description:
      "Start infected and spread rabies. Infect three living players to complete your secret goal.",
    action: "bite",
    actionLabel: "🦷 Infect"
  }
};

const HEIST_OPTIONAL_ROLES = [
  "spy",
  "locksmith",
  "con_artist",
  "saboteur",
  "trapper",
  "banker",
  "undercover",
  "cleaner",
  "informant",
  "gambler",
  "ringleader",
  "escape_artist",
  "cheese_goblin",
  "raccoon_royalty",
  "ghost",
  "magician",
  "patient_zero",
  "lookout",
  "tracker",
  "oracle"
];

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function makeHeistGame(guildId, channelId, hostId) {
  return {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 8),
    guildId,
    channelId,
    hostId,
    status: "lobby",
    round: 0,
    maxRounds: 8,
    vault: HEIST_STARTING_VAULT,
    reserve: 0,
    totalStolen: 0,
    createdAt: Date.now(),
    phaseEndsAt: 0,
    players: {},
    votes: {},
    nightActions: {},
    nightResults: {},
    publicEvents: [],
    originalPermissionOverwrites: null,
    botRoleId: null
  };
}

function heistPlayerCount(game) {
  return Object.values(game.players || {}).length;
}

function heistAlivePlayers(game) {
  return Object.values(game.players || {}).filter(
    player => player.alive
  );
}

function heistPlayer(game, userId) {
  return game.players?.[userId] || null;
}

function heistDisplayName(player) {
  const name = player?.displayName || player?.username || "Werewife";
  const title = player?.equippedTitle && SOLO_TITLES[player.equippedTitle]?.name ? ` ${SOLO_TITLES[player.equippedTitle].name}` : "";
  return `${name}${title}`;
}

function heistRole(game, userId) {
  return HEIST_ROLE_DEFINITIONS[
    game.players?.[userId]?.role
  ];
}

function heistRoleName(game, userId) {
  return (
    heistRole(game, userId)?.name ||
    "Unknown Role"
  );
}

function heistActionName(action) {
  const names = {
    steal: "💰 Steal",
    investigate: "🔎 Investigate",
    protect: "🛡️ Protect",
    bite: "🦷 Bite",
    frame: "🎭 Frame",
    jam: "🔐 Jam",
    secure: "🏦 Secure",
    hide: "🥸 Disguise",
    sabotage: "🧨 Sabotage",
    trap: "🪤 Trap",
    watch: "🕶️ Watch",
    clean: "🧹 Clean",
    eavesdrop: "👂 Eavesdrop",
    gamble: "🎲 Gamble",
    distract: "👑 Distract",
    escape: "🦊 Prepare Escape",
    scavenge: "🧀 Scavenge",
    crown: "👑 Raise the Crown",
    haunt: "👻 Haunt",
    illusion: "🪄 Illusion",
    track: "🧭 Track",
    reveal: "🔮 Reveal"
  };

  return names[action] || action;
}

function heistRolesForCount(count) {
  if (count < HEIST_MIN_PLAYERS || count > HEIST_MAX_PLAYERS) {
    return [];
  }

  /* Curated setups for tiny games keep every player useful. */
  if (count === 3) {
    const setups = [
      ["thief", "detective", "lookout"],
      ["thief", "detective", "tracker"],
      ["thief", "oracle", "lookout"],
      ["thief", "detective", "guard"]
    ];
    return shuffleArray(setups[randomInt(0, setups.length - 1)]);
  }

  if (count === 4) {
    const setups = [
      ["thief", "detective", "guard", "lookout"],
      ["thief", "detective", "tracker", "guard"],
      ["thief", "oracle", "lookout", "guard"]
    ];
    return shuffleArray(setups[randomInt(0, setups.length - 1)]);
  }

  const roles = [
    "thief",
    "detective",
    "rabid_raccoon"
  ];

  if (count >= 5) {
    roles.push("guard");
  }

  const needed = count - roles.length;
  const optional = shuffleArray(HEIST_OPTIONAL_ROLES);

  for (let i = 0; i < needed; i++) {
    roles.push(optional[i]);
  }

  return roles;
}

function heistRoleListText(game) {
  return heistAlivePlayers(game)
    .map(
      player =>
        `• ${heistDisplayName(player)} — ${
          player.alive ? "🟢 Alive" : "💀 Out"
        }`
    )
    .join("\n");
}

function heistLobbyButtons(game) {
  return [
    row(
      button(
        "🦝 Join Heist",
        `heist:lobbyjoin:${game.id}`,
        1
      ),
      button(
        "🚪 Leave",
        `heist:lobbyleave:${game.id}`,
        2
      ),
      button(
        "📋 Status",
        `heist:lobbystatus:${game.id}`,
        2
      )
    )
  ];
}

function heistNightOpenButton(game) {
  return [
    row(
      button(
        "🌙 Open My Secret Actions",
        `heist:open:${game.id}`,
        1
      )
    )
  ];
}

function heistActionButtons(game, player) {
  const buttons = [];
  const role = player.role;

  if (role === "ghost" && !player.alive) {
    buttons.push(
      button(
        "👻 Haunt",
        `heist:action:${game.id}:haunt`,
        2
      )
    );
  } else if (player.alive) {
    const definition =
      HEIST_ROLE_DEFINITIONS[role];

    if (
      definition?.action &&
      !(
        role === "ghost" &&
        definition.action === "haunt"
      )
    ) {
      buttons.push(
        button(
          definition.actionLabel,
          `heist:action:${game.id}:${definition.action}`,
          1
        )
      );
    }

    if (player.rabies && role !== "rabid_raccoon") {
      buttons.push(
        button(
          "🦷 Spread Rabies",
          `heist:action:${game.id}:bite`,
          4
        )
      );
    }

    buttons.push(
      button(
        "💤 Do Nothing",
        `heist:action:${game.id}:wait`,
        2
      )
    );
  }

  buttons.push(
    button(
      "📖 Role Info",
      `heist:roleinfo:${game.id}`,
      2
    )
  );

  const rows = [];

  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(
      row(...buttons.slice(i, i + 5))
    );
  }

  return rows;
}

function heistNeedsTarget(action) {
  return [
    "investigate",
    "protect",
    "bite",
    "frame",
    "jam",
    "sabotage",
    "trap",
    "watch",
    "eavesdrop",
    "distract",
    "haunt",
    "illusion",
    "track",
    "reveal"
  ].includes(action);
}

function heistTargetButtons(game, action, userId) {
  const targets = heistAlivePlayers(game).filter(
    player => player.id !== userId
  );

  const rows = [];

  if (
    action === "protect" ||
    action === "jam"
  ) {
    targets.unshift({
      id: "vault",
      displayName: "THE VAULT"
    });
  }

  for (let i = 0; i < targets.length; i += 5) {
    rows.push(
      row(
        ...targets
          .slice(i, i + 5)
          .map(target =>
            button(
              target.id === "vault"
                ? "💰 Vault"
                : `🎯 ${heistDisplayName(target).slice(0, 70)}`,
              `heist:target:${game.id}:${action}:${target.id}`,
              target.id === "vault" ? 1 : 2
            )
          )
      )
    );
  }

  rows.push(
    row(
      button(
        "💤 Cancel",
        `heist:cancel:${game.id}`,
        2
      )
    )
  );

  return rows;
}

function heistVoteButtons(game) {
  const players = heistAlivePlayers(game);
  const rows = [];

  for (let i = 0; i < players.length; i += 5) {
    rows.push(
      row(
        ...players.slice(i, i + 5).map(player =>
          button(
            `🗳️ ${heistDisplayName(player).slice(0, 70)}`,
            `heist:vote:${game.id}:${player.id}`,
            2
          )
        )
      )
    );
  }

  return rows;
}

async function getHeistBotRoleId(
  env,
  guildId
) {
  try {
    const meResponse =
      await discordRequest(
        env,
        "/users/@me"
      );

    if (!meResponse.ok) {
      return null;
    }

    const me =
      await meResponse.json();

    const memberResponse =
      await discordRequest(
        env,
        `/guilds/${guildId}/members/${me.id}`
      );

    if (!memberResponse.ok) {
      return null;
    }

    const member =
      await memberResponse.json();

    if (!Array.isArray(member.roles) || !member.roles.length) {
      return null;
    }

    const rolesResponse =
      await discordRequest(
        env,
        `/guilds/${guildId}/roles`
      );

    if (!rolesResponse.ok) {
      return member.roles[0];
    }

    const roles =
      await rolesResponse.json();

    const botRoles =
      roles
        .filter(role =>
          member.roles.includes(role.id)
        )
        .sort(
          (a, b) =>
            Number(b.position || 0) -
            Number(a.position || 0)
        );

    return botRoles[0]?.id || member.roles[0];
  } catch (error) {
    console.error(
      "Could not determine bot role:",
      error
    );

    return null;
  }
}

async function setHeistChannelLock(
  env,
  game,
  locked
) {
  if (
    !game?.guildId ||
    !game?.channelId
  ) {
    return false;
  }

  try {
    const channelResponse =
      await discordRequest(
        env,
        `/channels/${game.channelId}`
      );

    if (!channelResponse.ok) {
      console.error(
        "Heist channel lookup failed:",
        channelResponse.status,
        await channelResponse.text()
      );
      return false;
    }

    const channel =
      await channelResponse.json();

    if (locked) {
      if (!game.originalPermissionOverwrites) {
        const current =
          Array.isArray(channel.permission_overwrites)
            ? channel.permission_overwrites
            : [];

        const botRoleId =
          await getHeistBotRoleId(
            env,
            game.guildId
          );

        game.botRoleId =
          botRoleId || null;

        game.originalPermissionOverwrites = {
          everyone:
            current.find(
              overwrite =>
                overwrite.id === game.guildId &&
                overwrite.type === 0
            ) || null,
          bot:
            botRoleId
              ? current.find(
                  overwrite =>
                    overwrite.id === botRoleId &&
                    overwrite.type === 0
                ) || null
              : null
        };
      }

      const deny =
        (
          HEIST_PERMISSIONS.SEND_MESSAGES |
          HEIST_PERMISSIONS.SEND_MESSAGES_IN_THREADS |
          HEIST_PERMISSIONS.CREATE_PUBLIC_THREADS |
          HEIST_PERMISSIONS.CREATE_PRIVATE_THREADS
        ).toString();

      let allow =
        (
          HEIST_PERMISSIONS.SEND_MESSAGES |
          HEIST_PERMISSIONS.SEND_MESSAGES_IN_THREADS
        ).toString();

      const everyoneResponse =
        await discordRequest(
          env,
          `/channels/${game.channelId}/permissions/${game.guildId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              type: 0,
              deny,
              allow: "0"
            })
          }
        );

      if (!everyoneResponse.ok) {
        console.error(
          "Could not lock heist channel:",
          everyoneResponse.status,
          await everyoneResponse.text()
        );
        return false;
      }

      if (game.botRoleId) {
        const botResponse =
          await discordRequest(
            env,
            `/channels/${game.channelId}/permissions/${game.botRoleId}`,
            {
              method: "PUT",
              body: JSON.stringify({
                type: 0,
                deny: "0",
                allow
              })
            }
          );

        if (!botResponse.ok) {
          console.error(
            "Could not allow bot during heist lock:",
            botResponse.status,
            await botResponse.text()
          );
        }
      }

      return true;
    }

    const originals =
      game.originalPermissionOverwrites;

    if (originals?.everyone) {
      await discordRequest(
        env,
        `/channels/${game.channelId}/permissions/${game.guildId}`,
        {
          method: "PUT",
          body: JSON.stringify(
            originals.everyone
          )
        }
      );
    } else {
      await discordRequest(
        env,
        `/channels/${game.channelId}/permissions/${game.guildId}`,
        {
          method: "DELETE"
        }
      );
    }

    if (game.botRoleId) {
      if (originals?.bot) {
        await discordRequest(
          env,
          `/channels/${game.channelId}/permissions/${game.botRoleId}`,
          {
            method: "PUT",
            body: JSON.stringify(
              originals.bot
            )
          }
        );
      } else {
        await discordRequest(
          env,
          `/channels/${game.channelId}/permissions/${game.botRoleId}`,
          {
            method: "DELETE"
          }
        );
      }
    }

    return true;
  } catch (error) {
    console.error(
      "Heist channel lock error:",
      error
    );
    return false;
  }
}

async function heistSendPublic(
  env,
  game,
  content,
  components = []
) {
  return sendChannelMessage(
    env,
    game.channelId,
    content,
    components
  );
}

async function heistSendPrivate(
  env,
  interaction,
  content,
  components = []
) {
  return sendText(
    env,
    interaction,
    content,
    components
  );
}

async function startHeistNight(
  env,
  game,
  openingText = ""
) {
  game.status = "night";
  game.round += 1;
  game.phaseEndsAt =
    Date.now() +
    HEIST_NIGHT_DURATION;
  game.nightActions = {};
  game.nightResults = {};
  game.votes = {};

  for (const player of Object.values(game.players)) {
    player.submitted = false;
    player.currentAction = null;
    player.currentTarget = null;
    player.lastAction = null;
  }


  const intro =
    openingText ||
    `🌙 **NIGHT ${game.round} HAS FALLEN**\n\n` +
    `💬 The heist channel stays open — use the private buttons for secret actions.\n\n` +
    `Everyone has a secret role. Perform your action using the private buttons below.\n\n` +
    `💰 Vault: **${game.vault} ✨**\n` +
    `⏳ Night ends when everyone acts or the timer expires.`;

  await heistSendPublic(
    env,
    game,
    intro,
    heistNightOpenButton(game)
  );

  await setHeistChannelLock(env, game, true);

  const state = await getGuildState(env, game.guildId);
  state.heist = game;
  await saveGuildState(env, game.guildId, state);

  return true;
}

function heistActionAllowed(
  game,
  player,
  action
) {
  if (!player) return false;

  if (action === "wait") {
    return Boolean(
      player.alive
    );
  }

  if (
    action === "haunt" &&
    player.role === "ghost" &&
    !player.alive
  ) {
    return true;
  }

  if (!player.alive) return false;

  if (
    action === "bite" &&
    player.rabies
  ) {
    return true;
  }

  return (
    HEIST_ROLE_DEFINITIONS[player.role]?.action ===
    action
  );
}

function heistTargetAllowed(
  game,
  userId,
  targetId,
  action
) {
  if (targetId === "vault") {
    return (
      action === "protect" ||
      action === "jam"
    );
  }

  const target =
    heistPlayer(
      game,
      targetId
    );

  if (!target?.alive) return false;
  if (targetId === userId) return false;

  return heistNeedsTarget(action);
}

async function handleHeistAction(
  env,
  interaction,
  game,
  userId,
  action,
  targetId = null
) {
  const player =
    heistPlayer(
      game,
      userId
    );

  if (
    !player ||
    !heistActionAllowed(
      game,
      player,
      action
    )
  ) {
    await heistSendPrivate(
      env,
      interaction,
      "❌ That is not an action available to you."
    );
    return;
  }

  if (game.status !== "night") {
    await heistSendPrivate(
      env,
      interaction,
      "❌ It isn't Night anymore."
    );
    return;
  }

  if (
    player.submitted
  ) {
    await heistSendPrivate(
      env,
      interaction,
      "🌙 You already submitted your night action."
    );
    return;
  }

  if (
    heistNeedsTarget(action)
  ) {
    if (!targetId) {
      await heistSendPrivate(
        env,
        interaction,
        `🌙 **${heistActionName(action)}**\n\nChoose your target:`,
        heistTargetButtons(
          game,
          action,
          userId
        )
      );
      return;
    }

    if (
      !heistTargetAllowed(
        game,
        userId,
        targetId,
        action
      )
    ) {
      await heistSendPrivate(
        env,
        interaction,
        "❌ That target isn't available."
      );
      return;
    }
  }

  player.submitted = true;
  player.currentAction = action;
  player.currentTarget = targetId;
  game.nightActions[userId] = {
    action,
    targetId,
    submittedAt: Date.now()
  };

  const currentState =
    await getGuildState(
      env,
      game.guildId
    );

  currentState.heist = game;

  await saveGuildState(
    env,
    game.guildId,
    currentState
  );

  const submittedCount =
    Object.values(game.players).filter(
      p =>
        p.alive &&
        p.submitted
    ).length;

  await heistSendPrivate(
    env,
    interaction,
    `✅ **${heistActionName(action)}** submitted.\n\nYour action is secret. Results will be revealed at dawn. 🌙🦝`
  );

  if (
    submittedCount >=
    heistAlivePlayers(game).length
  ) {
    await resolveHeistNight(
      env,
      game
    );
  }
}

function heistCancelAction(
  game,
  userId
) {
  const player =
    heistPlayer(
      game,
      userId
    );

  if (!player || game.status !== "night") {
    return;
  }

  player.currentAction = null;
  player.currentTarget = null;
}

function heistActionWasSubmitted(
  game,
  userId
) {
  return Boolean(
    game.nightActions?.[userId]
  );
}

async function sendHeistDM(
  env,
  userId,
  content
) {
  try {
    const dmResponse =
      await discordRequest(
        env,
        "/users/@me/channels",
        {
          method: "POST",
          body: JSON.stringify({
            recipients: [userId]
          })
        }
      );

    if (!dmResponse.ok) {
      console.error(
        "Heist DM channel failed:",
        dmResponse.status,
        await dmResponse.text()
      );
      return false;
    }

    const dmChannel =
      await dmResponse.json();

    const messageResponse =
      await discordRequest(
        env,
        `/channels/${dmChannel.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content
          })
        }
      );

    if (!messageResponse.ok) {
      console.error(
        "Heist DM message failed:",
        messageResponse.status,
        await messageResponse.text()
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Heist DM error:",
      error
    );
    return false;
  }
}

async function sendHeistPrivateResults(
  env,
  game
) {
  for (const player of Object.values(game.players)) {
    const result =
      game.nightResults?.[player.id];

    if (!result) continue;

    player.lastPrivateResult =
      result;

    await sendHeistDM(
      env,
      player.id,
      `☀️ **DAWN — YOUR SECRET HEIST RESULT**\n\n${result}\n\nYour result is private. Do not reveal it unless you want to.`
    );
  }
}

function heistPublicReport(game) {
  const events =
    Array.isArray(game.publicEvents)
      ? game.publicEvents
      : [];

  const lines = [
    `☀️ **DAWN — ROUND ${game.round}**`,
    "",
    `💰 Vault remaining: **${game.vault} ✨**`,
    `🏦 Protected reserve: **${game.reserve} ✨**`
  ];

  if (events.length) {
    lines.push(
      "",
      ...events.slice(-12)
    );
  } else {
    lines.push(
      "",
      "🌙 Nothing obvious happened overnight..."
    );
  }

  lines.push(
    "",
    "🔓 The channel is unlocked for discussion.",
    "",
    "🗳️ When you're ready, vote for the person you think is the Thief."
  );

  return lines.join("\n");
}

function heistActionWasCanceled(
  game,
  userId,
  canceled
) {
  return canceled.has(userId);
}

async function resolveHeistNight(
  env,
  game
) {
  if (
    game.status !== "night"
  ) {
    return;
  }

  const alive =
    heistAlivePlayers(game);

  const actions =
    game.nightActions || {};

  const canceled =
    new Set();

  const publicEvents = [];

  const vaultJammed =
    Object.entries(actions).some(
      ([userId, action]) =>
        action.action === "jam" &&
        action.targetId === "vault" &&
        heistPlayer(game, userId)?.alive &&
        !canceled.has(userId)
    );

  /*
    Apply targeted interference first.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (!actor?.alive) continue;

    if (
      action.action === "sabotage" ||
      action.action === "distract"
    ) {
      const target =
        heistPlayer(
          game,
          action.targetId
        );

      if (
        target?.alive &&
        target.id !== userId
      ) {
        canceled.add(
          target.id
        );
      }
    }
  }

  const escapeArtists =
    new Set();

  for (const player of alive) {
    if (
      player.escapeReady &&
      player.role === "escape_artist"
    ) {
      escapeArtists.add(player.id);
    }
  }

  /*
    A player protected by the Guard is protected from
    targeted negative actions for this night.
  */
  const protectedPlayers =
    new Set();

  let protectedVault = false;

  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "protect" ||
      heistActionWasCanceled(
        game,
        userId,
        canceled
      )
    ) {
      continue;
    }

    if (action.targetId === "vault") {
      protectedVault = true;
    } else if (action.targetId) {
      protectedPlayers.add(
        action.targetId
      );
    }
  }

  /*
    Framing.
  */
  const framed =
    new Set();

  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      action.action === "frame" &&
      !canceled.has(userId) &&
      action.targetId
    ) {
      framed.add(
        action.targetId
      );
    }
  }

  const hidden =
    new Set();

  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      action.action === "hide" &&
      !canceled.has(userId)
    ) {
      hidden.add(userId);
    }
  }

  let evidenceCleaned = false;

  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      action.action === "clean" &&
      !canceled.has(userId)
    ) {
      evidenceCleaned = true;
    }
  }

  const illusions =
    new Set();

  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      action.action === "illusion" &&
      !canceled.has(userId) &&
      action.targetId
    ) {
      illusions.add(
        action.targetId
      );
    }
  }

  /*
    Record each player's performed action for Spy/Informant/Trap.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (!actor) continue;

    actor.lastAction =
      action.action;
  }

  /*
    Thief.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      actor.role !== "thief" ||
      action.action !== "steal" ||
      canceled.has(userId)
    ) {
      continue;
    }

    if (
      vaultJammed ||
      protectedVault
    ) {
      publicEvents.push(
        "🔐 **THE VAULT WAS TARGETED!** Security held strong and no loot was stolen."
      );
      continue;
    }

    const amount =
      Math.min(
        game.vault,
        randomInt(
          HEIST_STEAL_MIN,
          HEIST_STEAL_MAX
        )
      );

    game.vault -= amount;
    game.totalStolen += amount;
    actor.loot =
      Number(actor.loot || 0) +
      amount;

    publicEvents.push(
      `🚨 **THE VAULT WAS ROBBED!** Someone stole **${amount} ✨**.`
    );
  }

  /*
    Banker secures loot.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "secure" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const amount =
      Math.min(
        1000,
        game.vault
      );

    game.vault -= amount;
    game.reserve += amount;

    publicEvents.push(
      `🏦 **THE BANKER MOVED ${amount} ✨ INTO A PROTECTED RESERVE.**`
    );
  }

  /*
    Rabies.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "bite" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    if (
      target?.alive &&
      target.id !== userId &&
      !protectedPlayers.has(target.id) &&
      !escapeArtists.has(target.id)
    ) {
      const wasAlreadyRabid =
        Boolean(target.rabies);

      target.rabies = true;
      target.rabiesRounds =
        Number(target.rabiesRounds || 0) + 1;

      if (!wasAlreadyRabid) {
        actor.infectedCount =
          Number(actor.infectedCount || 0) + 1;
      }

      publicEvents.push(
        `🦷 **SOMEONE GOT BITTEN.** The raccoon situation is getting concerning.`
      );
    }
  }

  /*
    Detective.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "investigate" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    let result =
      "🟢 Nothing suspicious was found.";

    if (!target) {
      result =
        "❌ Your investigation found nothing.";
    } else if (evidenceCleaned) {
      result =
        "🧹 Someone cleaned the evidence. Your investigation produced no usable evidence.";
    } else if (hidden.has(target.id)) {
      result =
        "🥸 Your target's identity was concealed. You couldn't get a reliable read.";
    } else if (illusions.has(target.id)) {
      result =
        "🪄 The evidence looked strangely distorted. Your investigation was fooled.";
    } else if (
      target.role === "thief" ||
      framed.has(target.id)
    ) {
      result =
        "🚨 **SUSPICIOUS!** Your evidence points toward this player.";
    } else {
      result =
        "🟢 **NOT SUSPICIOUS.** Your evidence does not point toward the Thief.";
    }

    game.nightResults[userId] =
      `🔎 **Investigation Result**\n\n${result}\n\nTarget: **${heistDisplayName(target)}**`;
  }

  /*
    Spy.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      actor.role !== "spy" ||
      action.action !== "watch" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    if (!target) continue;

    const targetAction =
      target.lastAction;

    game.nightResults[userId] =
      targetAction
        ? `🕶️ **Spy Report**\n\n**${heistDisplayName(target)}** performed **${heistActionName(targetAction)}** tonight.`
        : `🕶️ **Spy Report**\n\n**${heistDisplayName(target)}** did not submit a visible night action.`;
  }

  /*
    Lookout / Spy distinction.
    Both use the same watch action, but each role gets its own
    clear private report.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor = heistPlayer(game, userId);
    if (!actor?.alive || action.action !== "watch" || canceled.has(userId)) continue;
    const target = heistPlayer(game, action.targetId);
    if (!target) continue;
    const targetAction = target.lastAction;
    if (actor.role === "lookout") {
      game.nightResults[userId] = targetAction
        ? `👀 **Lookout Report**\n\nYou watched **${heistDisplayName(target)}**. They performed **${heistActionName(targetAction)}** tonight.`
        : `👀 **Lookout Report**\n\nYou watched **${heistDisplayName(target)}**. They did not submit a visible night action.`;
    }
  }

  /*
    Tracker.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor = heistPlayer(game, userId);
    if (!actor?.alive || action.action !== "track" || canceled.has(userId)) continue;
    const target = heistPlayer(game, action.targetId);
    if (!target) continue;
    const targetAction = actions[target.id];
    game.nightResults[userId] = targetAction?.targetId && targetAction.targetId !== "vault"
      ? `🧭 **Tracker Report**\n\n**${heistDisplayName(target)}** acted on **${heistDisplayName(heistPlayer(game, targetAction.targetId))}**.`
      : targetAction?.targetId === "vault"
        ? `🧭 **Tracker Report**\n\n**${heistDisplayName(target)}** targeted **the Vault**.`
        : `🧭 **Tracker Report**\n\n**${heistDisplayName(target)}** did not target another player.`;
  }

  /*
    Oracle.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor = heistPlayer(game, userId);
    if (!actor?.alive || action.action !== "reveal" || canceled.has(userId)) continue;
    const target = heistPlayer(game, action.targetId);
    if (!target) continue;
    const team = HEIST_ROLE_DEFINITIONS[target.role]?.team || "neutral";
    const alignment = team === "thief" ? "🦝 THIEF" : team === "hunters" ? "🛡️ HUNTER" : team === "rabid" ? "🦷 RABID" : "🎭 NEUTRAL";
    game.nightResults[userId] = `🔮 **Oracle Reading**\n\n**${heistDisplayName(target)}** reads as **${alignment}**.`;
  }

  /*
    Trapper.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "trap" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    if (!target) continue;

    game.nightResults[userId] =
      target.lastAction
        ? `🪤 **Trap Triggered!**\n\nYour target performed an action tonight.`
        : `🪤 **Trap Report**\n\nYour target did not appear to perform an action.`;
  }

  /*
    Informant.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "eavesdrop" ||
      canceled.has(userId)
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    if (!target) continue;

    game.nightResults[userId] =
      target.lastAction
        ? `🐀 **Informant Clue**\n\nYou heard suspicious movement from **${heistDisplayName(target)}**. They definitely did something tonight.`
        : `🐀 **Informant Clue**\n\nYou heard nothing useful from **${heistDisplayName(target)}**.`;
  }

  /*
    Haunting.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor ||
      actor.role !== "ghost" ||
      actor.alive ||
      action.action !== "haunt"
    ) {
      continue;
    }

    const target =
      heistPlayer(
        game,
        action.targetId
      );

    if (!target) continue;

    game.nightResults[userId] =
      `👻 **Ghostly Whisper**\n\nYou haunted **${heistDisplayName(target)}** and sensed that they are **${target.role === "thief" ? "dangerously close to the vault." : "not the main Thief."}**`;
  }

  /*
    Gambler.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "gamble" ||
      canceled.has(userId)
    ) {
      continue;
    }

    if (
      Math.random() < 0.5
    ) {
      actor.gamblePoints =
        Number(actor.gamblePoints || 0) +
        750;

      actor.loot =
        Number(actor.loot || 0) +
        750;

      game.nightResults[userId] =
        "🎲 **YOU WON THE GAMBLE!** +750 heist loot.";
    } else {
      actor.gamblePoints =
        Math.max(
          0,
          Number(actor.gamblePoints || 0) - 300
        );

      actor.loot =
        Math.max(
          0,
          Number(actor.loot || 0) - 300
        );

      game.nightResults[userId] =
        "🎲 **YOU LOST THE GAMBLE.** -300 heist loot.";
    }
  }

  /*
    Cheese Goblin.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      !actor?.alive ||
      action.action !== "scavenge" ||
      canceled.has(userId)
    ) {
      continue;
    }

    actor.cheese =
      Number(actor.cheese || 0) + 1;

    game.nightResults[userId] =
      `🧀 **CHEESE ACQUIRED!**\n\nYou now have **${actor.cheese}/3 cheese**.`;
  }

  /*
    Escape Artist.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      actor.role === "escape_artist" &&
      action.action === "escape" &&
      !canceled.has(userId)
    ) {
      actor.escapeReady = true;
      game.nightResults[userId] =
        "🦊 **ESCAPE READY.** If the vote targets you later, your escape can save you once.";
    }
  }

  /*
    Raccoon Royalty.
  */
  for (const [userId, action] of Object.entries(actions)) {
    const actor =
      heistPlayer(game, userId);

    if (
      actor?.alive &&
      actor.role === "raccoon_royalty" &&
      action.action === "crown" &&
      !canceled.has(userId)
    ) {
      actor.voteShield = true;
      game.nightResults[userId] =
        "👑 **ROYAL PROTECTION READY.** Your first vote against you can be cancelled.";
    }
  }

  /*
    Make the public report less revealing when evidence was cleaned.
  */
  if (
    evidenceCleaned &&
    publicEvents.length
  ) {
    publicEvents.push(
      "🧹 **SOME EVIDENCE WAS CLEANED UP.** The crime scene is suspiciously spotless."
    );
  }

  if (!publicEvents.length) {
    publicEvents.push(
      "🌙 The night passed quietly... suspiciously quietly."
    );
  }

  game.publicEvents =
    publicEvents;

  await sendHeistPrivateResults(
    env,
    game
  );

  await setHeistChannelLock(env, game, false);

  game.status = "voting";
  game.phaseEndsAt =
    Date.now() +
    HEIST_VOTE_DURATION;
  game.votes = {};


  await heistSendPublic(
    env,
    game,
    heistPublicReport(game),
    heistVoteButtons(game)
  );

  const latestState =
    await getGuildState(
      env,
      game.guildId
    );

  latestState.heist = game;

  await saveGuildState(
    env,
    game.guildId,
    latestState
  );
}

async function resolveHeistVote(
  env,
  game
) {
  if (
    game.status !== "voting"
  ) {
    return;
  }

  const alive =
    heistAlivePlayers(game);

  if (!alive.length) {
    await finishHeist(
      env,
      game,
      "No players remain."
    );
    return;
  }

  const tally = {};

  for (const targetId of Object.values(game.votes || {})) {
    if (
      heistPlayer(game, targetId)?.alive
    ) {
      tally[targetId] =
        Number(tally[targetId] || 0) + 1;
    }
  }

  const ranked =
    Object.entries(tally)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  if (!ranked.length) {
    await heistSendPublic(
      env,
      game,
      "🗳️ **NO ONE VOTED.** The raccoons stare at each other awkwardly.\n\nThe heist continues."
    );

    if (
      game.round >=
      game.maxRounds
    ) {
      await finishHeist(
        env,
        game,
        "The maximum number of rounds was reached."
      );
      return;
    }

    await startHeistNight(
      env,
      game,
      "🌙 **ANOTHER NIGHT BEGINS.**\n\nNobody was accused, so the Thief remains free."
    );

    return;
  }

  const topVotes =
    ranked[0][1];

  const tied =
    ranked.filter(
      entry =>
        entry[1] === topVotes
    );

  if (tied.length > 1) {
    await heistSendPublic(
      env,
      game,
      `🗳️ **TIE!** Nobody is eliminated this round.\n\nThe top vote count was **${topVotes}**. The raccoons argue and accomplish nothing. 🦝`
    );

    if (
      game.round >=
      game.maxRounds
    ) {
      await finishHeist(
        env,
        game,
        "The maximum number of rounds was reached."
      );
      return;
    }

    await startHeistNight(
      env,
      game,
      "🌙 **THE TIE BOUGHT THE THIEF ANOTHER NIGHT.**"
    );

    return;
  }

  const targetId =
    ranked[0][0];

  const target =
    heistPlayer(
      game,
      targetId
    );

  if (!target) return;

  if (target.voteShield) {
    target.voteShield = false;

    await heistSendPublic(
      env,
      game,
      `👑 **ROYAL PROTECTION!** ${heistDisplayName(target)} was protected from the vote and survives.`
    );

    if (
      game.round >=
      game.maxRounds
    ) {
      await finishHeist(
        env,
        game,
        "The maximum number of rounds was reached."
      );
      return;
    }

    await startHeistNight(
      env,
      game,
      "🌙 **THE ROYALTY HAS SPOKEN.** The heist continues."
    );

    return;
  }

  if (
    target.role === "escape_artist" &&
    target.escapeReady
  ) {
    target.escapeReady = false;

    await heistSendPublic(
      env,
      game,
      `🦊 **ESCAPE!** ${heistDisplayName(target)} slipped away at the last second and survives the vote.`
    );

    if (
      game.round >=
      game.maxRounds
    ) {
      await finishHeist(
        env,
        game,
        "The maximum number of rounds was reached."
      );
      return;
    }

    await startHeistNight(
      env,
      game,
      "🌙 **THE ESCAPE ARTIST GOT AWAY.**"
    );

    return;
  }

  target.alive = false;

  const roleName =
    heistRoleName(
      game,
      target.id
    );

  const wasThief =
    target.role === "thief";

  const wasGhost =
    target.role === "ghost";

  const wasConArtist =
    target.role === "con_artist";

  if (wasThief) {
    await finishHeist(
      env,
      game,
      `🎯 **THE THIEF HAS BEEN CAUGHT!**\n\n${heistDisplayName(target)} was the Thief. 🦝💰`
    );
    return;
  }

  let extra = "";

  if (wasGhost) {
    extra =
      "\n\n👻 The Ghost is now free to haunt the remaining players at Night.";
  }

  if (wasConArtist) {
    extra =
      "\n\n🎭 The Con Artist's schemes have been exposed.";
  }

  await heistSendPublic(
    env,
    game,
    `🚨 **WRONG RACCOON!**\n\n${heistDisplayName(target)} was voted out.\n\nTheir role was: **${roleName}**.${extra}`
  );

  const conArtist =
    Object.values(game.players).find(
      player =>
        player.role === "con_artist" &&
        player.alive
    );

  if (
    conArtist &&
    !conArtist.conArtistWin
  ) {
    conArtist.conArtistWin =
      true;
  }

  if (
    heistAlivePlayers(game).length <= 1 ||
    game.round >= game.maxRounds
  ) {
    await finishHeist(
      env,
      game,
      game.round >= game.maxRounds
        ? "The maximum number of rounds was reached."
        : "There is nobody left to continue the investigation."
    );
    return;
  }

  await startHeistNight(
    env,
    game,
    "🌙 **THE WRONG PERSON WAS VOTED OUT.**\n\nThe real Thief is still out there..."
  );
}

function heistWinnerList(game) {
  const winners = [];

  const thiefCaught = String(game.endedReason || "").includes("THIEF HAS BEEN CAUGHT");
  if (thiefCaught) {
    for (const player of Object.values(game.players)) {
      if (player.alive && HEIST_ROLE_DEFINITIONS[player.role]?.team === "hunters") {
        winners.push(`${heistDisplayName(player)} — ${HEIST_ROLE_DEFINITIONS[player.role].name}`);
      }
    }
  }

  const thief =
    Object.values(game.players).find(
      player =>
        player.role === "thief"
    );

  if (
    !game.cancelled &&
    thief &&
    !game.endedReason?.includes(
      "THIEF HAS BEEN CAUGHT"
    )
  ) {
    if (thief.alive) {
      winners.push(
        `${heistDisplayName(thief)} — 🦝 Thief`
      );
    }
  }

  for (const player of Object.values(game.players)) {
    if (
      player.role === "ringleader" &&
      thief?.alive
    ) {
      winners.push(
        `${heistDisplayName(player)} — 👑 Ringleader`
      );
    }

    if (
      player.role === "rabid_raccoon" &&
      heistAlivePlayers(game).every(
        target =>
          target.id === player.id ||
          target.rabies
      )
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🦝💢 Rabid Raccoon`
      );
    }

    if (
      player.role === "patient_zero" &&
      Number(player.infectedCount || 0) >= 3
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🦠 Patient Zero`
      );
    }

    if (
      player.role === "cheese_goblin" &&
      Number(player.cheese || 0) >= 3
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🧀 Cheese Goblin`
      );
    }

    if (
      player.role === "gambler" &&
      Number(player.gamblePoints || 0) >= 2000
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🎲 Gambler`
      );
    }

    if (
      player.role === "con_artist" &&
      player.conArtistWin
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🎭 Con Artist`
      );
    }

    if (
      player.role === "ghost" &&
      !player.alive
    ) {
      winners.push(
        `${heistDisplayName(player)} — 👻 Ghost`
      );
    }
  }

  return [
    ...new Set(winners)
  ];
}

async function finishHeist(
  env,
  game,
  reason
) {
  if (!game || game.status === "ended") return;

  game.status = "ended";
  game.endedReason = reason || "The heist ended.";
  game.phaseEndsAt = 0;

  const thief =
    Object.values(game.players).find(
      player => player.role === "thief"
    );

  if (
    thief &&
    game.endedReason.includes("THIEF HAS BEEN CAUGHT")
  ) {
    thief.alive = false;
  }

  const winners = heistWinnerList(game);

  /*
    Winners now receive an actual sparkle payout.
    The prize is split among all winners so ties are fair.
    If nobody completed a secret goal, nobody receives a payout.
  */
  const winnerPlayers = [];
  const seenWinnerIds = new Set();

  for (const player of Object.values(game.players)) {
    const label = `${heistDisplayName(player)} — `;
    if (
      winners.some(entry => entry.startsWith(label)) &&
      !seenWinnerIds.has(player.id)
    ) {
      winnerPlayers.push(player);
      seenWinnerIds.add(player.id);
    }
  }

  const prizePool = Math.max(
    0,
    Number(game.reserve || 0) + Number(game.totalStolen || 0)
  );

  const winnerReward =
    winnerPlayers.length
      ? HEIST_WIN_REWARD +
        Math.floor(prizePool / winnerPlayers.length)
      : 0;

  if (winnerReward > 0) {
    for (const winner of winnerPlayers) {
      const winnerPlayer = await getPlayer(env, winner.id);
      winnerPlayer.sparkles =
        Number(winnerPlayer.sparkles || 0) + winnerReward;
      await savePlayer(env, winnerPlayer);
      winner.heistReward = winnerReward;
    }
  }

  const roleReveal =
    Object.values(game.players)
      .map(
        player =>
          `• ${heistDisplayName(player)} — **${
            HEIST_ROLE_DEFINITIONS[player.role]?.name ||
            player.role
          }**`
      )
      .join("\n");

  const winnerText =
    winnerPlayers.length
      ? winnerPlayers
          .map(
            player =>
              `🏆 ${heistDisplayName(player)} — **${winnerReward} ✨**`
          )
          .join("\n")
      : "No winners were recorded.";

  await heistSendPublic(
    env,
    game,
    `🏁 **RACCOON HEIST OVER!**\n\n${reason}\n\n💰 Total stolen: **${game.totalStolen} ✨**\n💰 Winner prize pool: **${prizePool} ✨**\n🎁 Guaranteed winner reward: **${HEIST_WIN_REWARD} ✨ each**\n\n🏆 **WINNERS**\n${winnerText}\n\n🎭 **ROLE REVEAL**\n${roleReveal}\n\n🦝 Thank you for committing raccoon crimes.`
  );

  await setHeistChannelLock(env, game, false);

  const latestState = await getGuildState(env, game.guildId);
  if (latestState.heist?.id === game.id) {
    latestState.heist = null;
    await saveGuildState(env, game.guildId, latestState);
  }

  game.status = "ended";
}

async function processHeistTimers(
  env
) {
  const guildIds =
    await getKnownGuildIds(env);

  for (const guildId of guildIds) {
    try {
      const state =
        await getGuildState(
          env,
          guildId
        );

      const game =
        state.heist;

      if (!game) continue;

      if (
        game.status === "night" &&
        Date.now() >=
          Number(game.phaseEndsAt || 0)
      ) {
        await resolveHeistNight(
          env,
          game
        );

        const refreshed = await getGuildState(env, guildId);
        if (refreshed.heist?.id === game.id) {
          refreshed.heist = game;
          await saveGuildState(env, guildId, refreshed);
        }
      } else if (
        game.status === "voting" &&
        Date.now() >=
          Number(game.phaseEndsAt || 0)
      ) {
        await resolveHeistVote(
          env,
          game
        );

        const refreshed = await getGuildState(env, guildId);
        if (refreshed.heist?.id === game.id) {
          refreshed.heist = game;
          await saveGuildState(env, guildId, refreshed);
        }
      }
    } catch (error) {
      console.error(
        `Heist timer failed for guild ${guildId}:`,
        error
      );
    }
  }
}

async function handleHeistCreate(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Raccoon Heist can only be played inside a server."
    );
    return;
  }

  const channelId =
    interaction.channel_id;

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  if (
    state.heist &&
    state.heist.status !== "ended"
  ) {
    await sendText(
      env,
      interaction,
      `❌ A Raccoon Heist is already running in <#${state.heist.channelId}>.`
    );
    return;
  }

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  const game =
    makeHeistGame(
      interaction.guild_id,
      channelId,
      user.id
    );

  game.players[user.id] = {
    id: user.id,
    username: user.username || "",
    displayName:
      interaction.member?.nick ||
      user.global_name ||
      user.username ||
      "Werewife",
    alive: true,
    role: null,
    submitted: false,
    loot: 0,
    rabies: false,
    cheese: 0,
    gamblePoints: 0,
    infectedCount: 0,
    escapeReady: false,
    voteShield: false,
    lastAction: null,
    lastPrivateResult: ""
  };

  state.heist = game;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

  await sendPublicText(
    env,
    interaction,
    `🦝💰 **RACCOON HEIST LOBBY CREATED!**\n\nPlayers: **1/${HEIST_MAX_PLAYERS}**\n\n${heistRoleListText(game)}\n\nThe host is **${heistDisplayName(game.players[user.id])}**.\n\nUse the buttons below or \`/heist join\` to join.`,
    heistLobbyButtons(game)
  );
}

async function handleHeistJoin(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Raccoon Heist can only be played inside a server."
    );
    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  const game =
    state.heist;

  if (
    !game ||
    game.status !== "lobby"
  ) {
    await sendText(
      env,
      interaction,
      "❌ There isn't an open Raccoon Heist lobby."
    );
    return;
  }

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) return;

  if (
    game.players[user.id]
  ) {
    await sendText(
      env,
      interaction,
      "🦝 You're already in the heist!"
    );
    return;
  }

  if (
    heistPlayerCount(game) >=
    HEIST_MAX_PLAYERS
  ) {
    await sendText(
      env,
      interaction,
      "❌ The heist is full! Maximum 12 players."
    );
    return;
  }

  game.players[user.id] = {
    id: user.id,
    username: user.username || "",
    displayName:
      interaction.member?.nick ||
      user.global_name ||
      user.username ||
      "Werewife",
    alive: true,
    role: null,
    submitted: false,
    loot: 0,
    rabies: false,
    cheese: 0,
    gamblePoints: 0,
    infectedCount: 0,
    escapeReady: false,
    voteShield: false,
    lastAction: null,
    lastPrivateResult: ""
  };

  state.heist = game;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

  await sendText(
    env,
    interaction,
    `🦝 **YOU JOINED THE HEIST!**\n\nPlayers: **${heistPlayerCount(game)}/${HEIST_MAX_PLAYERS}**`
  );

  await heistSendPublic(
    env,
    game,
    `🦝 **${heistDisplayName(game.players[user.id])} joined the heist!**\n\nPlayers: **${heistPlayerCount(game)}/${HEIST_MAX_PLAYERS}**`,
    heistLobbyButtons(game)
  );
}

async function handleHeistLeave(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Server only."
    );
    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  const game =
    state.heist;

  const user =
    getUserFromInteraction(
      interaction
    );

  if (
    !game ||
    game.status !== "lobby" ||
    !user ||
    !game.players[user.id]
  ) {
    await sendText(
      env,
      interaction,
      "❌ You aren't in an open lobby."
    );
    return;
  }

  delete game.players[user.id];

  if (
    game.hostId === user.id
  ) {
    const next =
      Object.values(game.players)[0];

    if (next) {
      game.hostId =
        next.id;
    }
  }

  if (
    heistPlayerCount(game) === 0
  ) {
    state.heist = null;
  } else {
    state.heist = game;
  }

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

  await sendText(
    env,
    interaction,
    "🚪 You left the heist lobby."
  );

  if (state.heist) {
    await heistSendPublic(
      env,
      state.heist,
      `🚪 **${user.global_name || user.username || "A player"} left the lobby.**\n\nPlayers: **${heistPlayerCount(state.heist)}/${HEIST_MAX_PLAYERS}**`,
      heistLobbyButtons(state.heist)
    );
  }
}

async function handleHeistStart(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Server only."
    );
    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  const game =
    state.heist;

  const user =
    getUserFromInteraction(
      interaction
    );

  if (
    !game ||
    game.status !== "lobby"
  ) {
    await sendText(
      env,
      interaction,
      "❌ There isn't an open lobby."
    );
    return;
  }

  if (
    !user ||
    game.hostId !== user.id
  ) {
    await sendText(
      env,
      interaction,
      "❌ Only the heist host can start the game."
    );
    return;
  }

  const count =
    heistPlayerCount(game);

  if (
    count < HEIST_MIN_PLAYERS
  ) {
    await sendText(
      env,
      interaction,
      `❌ You need at least **${HEIST_MIN_PLAYERS} players** to start.`
    );
    return;
  }

  if (
    interaction.channel_id !==
    game.channelId
  ) {
    await sendText(
      env,
      interaction,
      "❌ Start the heist in the channel where the lobby was created."
    );
    return;
  }

  const roles =
    heistRolesForCount(count);

  const players =
    shuffleArray(
      Object.values(game.players)
    );

  players.forEach(
    (player, index) => {
      player.role =
        roles[index];

      if (
        player.role === "patient_zero"
      ) {
        player.rabies = true;
      }
    }
  );

  game.status = "starting";

  /*
    Save role assignment before the first Night so a transient
    request cannot lose the secret roles.
  */
  state.heist = game;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );


  await sendText(
    env,
    interaction,
    "🦝💰 **THE HEIST IS STARTING!** Your role is secret. Check the game channel."
  );

  const roleLines =
    players
      .map(
        player =>
          `${player.id}: ${HEIST_ROLE_DEFINITIONS[player.role]?.name || player.role}`
      )
      .join("\n");

  console.log(
    `Heist ${game.id} roles for guild ${game.guildId}:\n${roleLines}`
  );

  await startHeistNight(
    env,
    game,
    `🦝💰 **RACCOON HEIST HAS BEGUN!**\n\n` +
      `👥 Players: **${count}**\n` +
      `💰 Starting vault: **${game.vault} ✨**\n\n` +
      `🌙 **NIGHT 1**\n💬 The channel stays open for everyone.\n\n` +
      `Everyone has received a secret role. Click **🌙 Open My Secret Actions** to see your private action buttons.\n\n` +
      `🚨 Find the Thief. Trust absolutely nobody.`
  );

  state.heist = game;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );
}

async function handleHeistStatus(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Server only."
    );
    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  const game =
    state.heist;

  if (!game) {
    await sendText(
      env,
      interaction,
      "🦝 There is no active Raccoon Heist."
    );
    return;
  }

  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    user
      ? heistPlayer(game, user.id)
      : null;

  let privateSection =
    "";

  if (player) {
    privateSection =
      `\n\n🔐 **YOUR SECRET ROLE**\n` +
      `**${heistRoleName(game, player.id)}**\n` +
      `${HEIST_ROLE_DEFINITIONS[player.role]?.description || ""}\n\n` +
      `💰 Your heist loot: **${Number(player.loot || 0)} ✨**\n` +
      `🧀 Cheese: **${Number(player.cheese || 0)}/3**\n` +
      `🦠 Rabies: **${player.rabies ? "YES" : "No"}**`;

    if (player.lastPrivateResult) {
      privateSection +=
        `\n\n📜 **Last Secret Result**\n${player.lastPrivateResult}`;
    }
  }

  const alive =
    heistAlivePlayers(game);

  await sendText(
    env,
    interaction,
    `🦝💰 **RACCOON HEIST STATUS**\n\n` +
      `Phase: **${game.status}**\n` +
      `Round: **${game.round}/${game.maxRounds}**\n` +
      `Players alive: **${alive.length}/${heistPlayerCount(game)}**\n` +
      `💰 Vault: **${game.vault} ✨**\n` +
      `🏦 Reserve: **${game.reserve} ✨**\n` +
      `💸 Total stolen: **${game.totalStolen} ✨**\n\n` +
      `👥 **Players**\n${heistRoleListText(game)}` +
      privateSection
  );
}

async function handleHeistEnd(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Server only."
    );
    return;
  }

  const state =
    await getGuildState(
      env,
      interaction.guild_id
    );

  const game =
    state.heist;

  const user =
    getUserFromInteraction(
      interaction
    );

  if (
    !game ||
    game.status === "ended"
  ) {
    await sendText(
      env,
      interaction,
      "❌ There is no active heist."
    );
    return;
  }

  if (
    !user ||
    (
      game.hostId !== user.id &&
      user.id !== env.OWNER_ID
    )
  ) {
    await sendText(
      env,
      interaction,
      "❌ Only the heist host or bot owner can end the game."
    );
    return;
  }

  game.cancelled = true;

  await finishHeist(
    env,
    game,
    "🛑 The heist was ended by the host."
  );

  const latestState = await getGuildState(env, interaction.guild_id);
  if (latestState.heist?.id === game.id) {
    latestState.heist = null;
    await saveGuildState(env, interaction.guild_id, latestState);
  }

  await sendText(
    env,
    interaction,
    "🛑 Heist ended."
  );
}

async function handleHeistVote(
  env,
  interaction,
  game,
  voterId,
  targetId
) {
  if (
    game.status !== "voting"
  ) {
    await sendText(
      env,
      interaction,
      "❌ It isn't voting time."
    );
    return;
  }

  const voter =
    heistPlayer(
      game,
      voterId
    );

  const target =
    heistPlayer(
      game,
      targetId
    );

  if (
    !voter?.alive ||
    !target?.alive
  ) {
    await sendText(
      env,
      interaction,
      "❌ Only living players can vote, and your target must be alive."
    );
    return;
  }

  if (
    voterId === targetId
  ) {
    await sendText(
      env,
      interaction,
      "❌ You can't vote for yourself."
    );
    return;
  }

  if (
    game.votes?.[voterId]
  ) {
    await sendText(
      env,
      interaction,
      "🗳️ You already voted."
    );
    return;
  }

  game.votes[voterId] =
    targetId;

  /* Persist the vote before checking the tally so the vote cannot be
     lost if the next interaction or timer reads KV immediately. */
  const voteState = await getGuildState(env, game.guildId);
  voteState.heist = game;
  await saveGuildState(env, game.guildId, voteState);

  const voted =
    Object.keys(game.votes).length;

  const needed =
    heistAlivePlayers(game).length;

  await sendText(
    env,
    interaction,
    `🗳️ **Vote recorded.**\n\nYou voted for **${heistDisplayName(target)}**.\n\nVotes received: **${voted}/${needed}**`
  );

  if (
    voted >= needed
  ) {
    await resolveHeistVote(
      env,
      game
    );
  }
}

async function syncHeistPhase(env, game) {
  if (!game || game.status === "ended") return;

  if (Date.now() < Number(game.phaseEndsAt || 0)) return;

  if (game.status === "night") {
    await resolveHeistNight(env, game);
    return;
  }

  if (game.status === "voting") {
    await resolveHeistVote(env, game);
  }
}

async function handleHeistComponent(
  env,
  interaction
) {
  const id =
    interaction.data?.custom_id ||
    "";

  const parts =
    id.split(":");

  if (
    parts[0] !== "heist"
  ) {
    return false;
  }

  const actionType =
    parts[1];

  const gameId =
    parts[2];

  const guildId =
    interaction.guild_id;

  if (!guildId) {
    await sendText(
      env,
      interaction,
      "❌ Heists only work inside a server."
    );
    return true;
  }

  const state =
    await getGuildState(
      env,
      guildId
    );

  let game =
    state.heist;

  if (
    !game ||
    game.id !== gameId
  ) {
    await sendText(
      env,
      interaction,
      "❌ That heist no longer exists."
    );
    return true;
  }

  const user =
    getUserFromInteraction(
      interaction
    );

  if (!user) {
    return true;
  }

  await syncHeistPhase(env, game);

  /* Refresh from KV because resolving a phase may have changed the game. */
  const refreshedState = await getGuildState(env, guildId);
  if (refreshedState.heist?.id === gameId) {
    game = refreshedState.heist;
  }

  if (
    actionType === "lobbyjoin"
  ) {
    await handleHeistJoin(
      env,
      interaction
    );
    return true;
  }

  if (
    actionType === "lobbyleave"
  ) {
    await handleHeistLeave(
      env,
      interaction
    );
    return true;
  }

  if (
    actionType === "lobbystatus"
  ) {
    await handleHeistStatus(
      env,
      interaction
    );
    return true;
  }

  const player =
    heistPlayer(
      game,
      user.id
    );

  if (
    actionType === "open"
  ) {
    if (!player) {
      await sendText(
        env,
        interaction,
        "❌ You aren't a player in this heist."
      );
      return true;
    }

    if (
      game.status !== "night"
    ) {
      await sendText(
        env,
        interaction,
        "❌ Secret night actions are not available right now."
      );
      return true;
    }

    await sendText(
      env,
      interaction,
      `🌙 **YOUR SECRET ACTIONS**\n\nRole: **${heistRoleName(game, user.id)}**\n\n${HEIST_ROLE_DEFINITIONS[player.role]?.description || ""}`,
      heistActionButtons(
        game,
        player
      )
    );

    return true;
  }

  if (actionType === "roleinfo") {
    if (!player) {
      await sendText(env, interaction, "❌ You aren't a player in this heist.");
      return true;
    }
    const definition = HEIST_ROLE_DEFINITIONS[player.role];
    await heistSendPrivate(
      env,
      interaction,
      `📖 **YOUR HEIST ROLE**\n\n${definition?.name || player.role}\n\n${definition?.description || "No role description available."}\n\n🎯 Night action: **${definition?.actionLabel || "None"}**`,
      heistActionButtons(game, player)
    );
    return true;
  }

  if (
    actionType === "cancel"
  ) {
    heistCancelAction(
      game,
      user.id
    );

    await sendText(
      env,
      interaction,
      "❌ Action selection cancelled. Your night action has not been submitted."
    );

    return true;
  }

  if (
    actionType === "action"
  ) {
    const action =
      parts[3];

    if (
      action === "wait"
    ) {
      await handleHeistAction(
        env,
        interaction,
        game,
        user.id,
        "wait"
      );

      return true;
    }

    if (
      !heistActionAllowed(
        game,
        player,
        action
      )
    ) {
      await sendText(
        env,
        interaction,
        "❌ That action isn't yours."
      );
      return true;
    }

    if (
      heistNeedsTarget(action)
    ) {
      await handleHeistAction(
        env,
        interaction,
        game,
        user.id,
        action
      );
      return true;
    }

    await handleHeistAction(
      env,
      interaction,
      game,
      user.id,
      action
    );

    return true;
  }

  if (
    actionType === "target"
  ) {
    const action =
      parts[3];

    const targetId =
      parts[4];

    await handleHeistAction(
      env,
      interaction,
      game,
      user.id,
      action,
      targetId
    );

    return true;
  }

  if (
    actionType === "vote"
  ) {
    const targetId =
      parts[3];

    await handleHeistVote(
      env,
      interaction,
      game,
      user.id,
      targetId
    );

    return true;
  }

  return true;
}

async function handleHeistRoles(env, interaction) {
  const entries = Object.values(HEIST_ROLE_DEFINITIONS);
  const pages = [];
  let current = "";

  for (const role of entries) {
    const line = `**${role.name}** — ${role.description}`;
    if ((current + "\n\n" + line).length > 1700) {
      pages.push(current);
      current = line;
    } else {
      current += (current ? "\n\n" : "") + line;
    }
  }
  if (current) pages.push(current);

  await sendText(
    env,
    interaction,
    `🦝💰 **RACCOON HEIST ROLES — 1/${pages.length}**\n\n${pages[0]}`,
    pages.length > 1
      ? [row(button("➡️ Next", "heist_roles:1", 2))]
      : [row(button("🌳 Back to Tree", "back_tree", 2))]
  );
}

async function handleHeistRolesPage(env, interaction, pageIndex) {
  const entries = Object.values(HEIST_ROLE_DEFINITIONS);
  const pages = [];
  let current = "";
  for (const role of entries) {
    const line = `**${role.name}** — ${role.description}`;
    if ((current + "\n\n" + line).length > 1700) { pages.push(current); current = line; }
    else current += (current ? "\n\n" : "") + line;
  }
  if (current) pages.push(current);

  const index = Math.max(0, Math.min(Number(pageIndex) || 0, pages.length - 1));
  const buttons = [];
  if (index > 0) buttons.push(button("⬅️ Previous", `heist_roles:${index - 1}`, 2));
  if (index < pages.length - 1) buttons.push(button("➡️ Next", `heist_roles:${index + 1}`, 2));
  await sendText(env, interaction, `🦝💰 **RACCOON HEIST ROLES — ${index + 1}/${pages.length}**\n\n${pages[index]}`, [row(...buttons)]);
}

async function handleHeistCommand(
  env,
  interaction
) {
  if (!interaction.guild_id) {
    await sendText(
      env,
      interaction,
      "❌ Raccoon Heist can only be played inside a server."
    );
    return;
  }

  const subcommand =
    interaction.data?.options?.find(
      option =>
        option.type === 1
    )?.name ||
    "status";

  if (
    subcommand === "create"
  ) {
    await handleHeistCreate(
      env,
      interaction
    );
    return;
  }

  if (
    subcommand === "join"
  ) {
    await handleHeistJoin(
      env,
      interaction
    );
    return;
  }

  if (
    subcommand === "leave"
  ) {
    await handleHeistLeave(
      env,
      interaction
    );
    return;
  }

  if (
    subcommand === "start"
  ) {
    await handleHeistStart(
      env,
      interaction
    );
    return;
  }

  if (
    subcommand === "status"
  ) {
    await handleHeistStatus(
      env,
      interaction
    );
    return;
  }

  if (
    subcommand === "end"
  ) {
    await handleHeistEnd(
      env,
      interaction
    );
    return;
  }

  await sendText(
    env,
    interaction,
    "❌ Unknown heist action."
  );
}

/* =========================================================
   COMMAND ROUTER
========================================================= */

function getOption(
  interaction,
  name
) {
  return (
    interaction.data?.options?.find(
      option =>
        option.name === name
    )?.value ?? null
  );
}

const FORTUNES = [
  ["🔮 The Fortune Tree looked into your soul... and decided you deserve **{n} sparkles**. ✨", 25, 200],
  ["🌳 The tree whispered: “Take these and don't ask questions.” **{n} sparkles!**", 50, 250],
  ["🦝 A raccoon delivered your fortune personally. **{n} sparkles!**", 10, 150],
  ["🌙 The moon is feeling generous tonight. **{n} sparkles!**", 25, 300],
  ["🌈 A rainbow appeared... unfortunately it brought **0 sparkles**. 😭", 0, 0],
  ["🍃 A leaf fell on your head. That's your fortune. **0 sparkles.**", 0, 0],
  ["💀 The tree considered giving you sparkles, then changed its mind. **0 sparkles.**", 0, 0],
  ["👀 The Fortune Tree stared at you. You stared back. Nothing happened. **0 sparkles.**", 0, 0],
  ["🐱 The tree demanded cat pictures. It gave you **{n} sparkles** anyway.", 25, 175],
  ["🤨 The tree says you should have come yesterday. **0 sparkles.**", 0, 0],
  ["✨ A suspiciously shiny leaf fell into your hands. **{n} sparkles!**", 5, 75],
  ["🎰 THE FORTUNE TREE HAS SPOKEN. **{n} sparkles!**", 100, 400],
  ["🦝 Your raccoon friend put in a good word for you. **{n} sparkles!**", 20, 125],
  ["😭 The Fortune Tree tried to pay you, but tripped. **0 sparkles.**", 0, 0],
  ["👑 The tree has chosen you. **{n} sparkles** have been bestowed upon you!", 150, 500]
];

async function handleSparkleBalance(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  await savePlayer(env, player);
  await sendText(env, interaction, `✨ **Your Sparkle Balance**\n\nYou have **${Number(player.sparkles || 0)} sparkles**. 💖`);
}

async function handleFortune(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;

  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);

  const now = Date.now();
  if (player.lastFortune && now - player.lastFortune < FORTUNE_COOLDOWN) {
    const remaining = FORTUNE_COOLDOWN - (now - player.lastFortune);
    const minutes = Math.ceil(remaining / 60000);
    await sendText(env, interaction, `🔮 The Fortune Tree is still thinking... try again in about **${minutes} minute${minutes === 1 ? "" : "s"}**. 🌳`);
    return;
  }

  player.lastFortune = now;
  player.fortuneUses = Number(player.fortuneUses || 0) + 1;

  const fortune = FORTUNES[randomInt(0, FORTUNES.length - 1)];
  const reward =
    fortune[1] === 0 && fortune[2] === 0
      ? 0
      : randomInt(fortune[1], fortune[2]);

  player.sparkles += reward;

  const message =
    reward > 0
      ? fortune[0].replace("{n}", String(reward))
      : fortune[0];

  player.sceneMessage = `🔮 **FORTUNE TREE**\n\n${message}`;
  await savePlayer(env, player);

  await sendText(
    env,
    interaction,
    `${message}\n\n${reward > 0 ? `✨ Your balance increased by **${reward} sparkles**!` : "🌳 The tree gave you absolutely nothing. 😂"}`
  );
}

async function handleRaccoon(env, interaction) {
  if (!interaction.guild_id) {
    await sendText(env, interaction, "❌ `/raccoon` can only be used inside a server.");
    return;
  }

  const user = getUserFromInteraction(interaction);
  const targetId = getOption(interaction, "user");

  if (!user || !targetId || targetId === user.id) {
    await sendText(env, interaction, "❌ Choose another player for your raccoon to rob.");
    return;
  }

  const player = await getPlayer(env, user.id);
  const target = await getPlayer(env, targetId);

  updatePlayerIdentity(player, interaction);

  const now = Date.now();
  if (player.lastRaccoon && now - player.lastRaccoon < RACCOON_COOLDOWN) {
    const remaining = RACCOON_COOLDOWN - (now - player.lastRaccoon);
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.ceil((remaining % 3600000) / 60000);
    const timeText = hours > 0
      ? `${hours} hour${hours === 1 ? "" : "s"}${minutes > 0 ? ` and ${minutes} minute${minutes === 1 ? "" : "s"}` : ""}`
      : `${minutes} minute${minutes === 1 ? "" : "s"}`;
    await sendText(env, interaction, `🦝 Your raccoon is exhausted from crime. Try again in about **${timeText}**.`);
    return;
  }

  player.lastRaccoon = now;
  player.raccoonRobberies = Number(player.raccoonRobberies || 0) + 1;

  const victimName =
    target.displayName ||
    target.username ||
    "that player";

  const available = Math.max(0, Number(target.sparkles || 0));
  const requested = randomInt(0, 300);
  const stolen = Math.min(requested, available);

  let result;

  if (stolen === 0) {
    player.secretAchievements =
      Array.isArray(player.secretAchievements) ? player.secretAchievements : [];
    player.secretAchievements.push("secret_zero");

    const zeroResponses = [
      `🦝 Your raccoon robbed **${victimName}**... but came back with **0 sparkles**. 😭`,
      `🦝 Your raccoon found the sparkle vault completely empty. **0 sparkles for you.**`,
      `🦝 Your raccoon ate the sparkles instead. **0 sparkles for you.** 💀`,
      `🦝 Your raccoon got distracted and forgot to rob anyone. **0 sparkles.**`,
      `🦝 Your raccoon demanded payment, got ignored, and came home angry. **0 sparkles.**`
    ];
    result = zeroResponses[randomInt(0, zeroResponses.length - 1)];
    if (result.includes("ate the sparkles")) {
      player.secretAchievements.push("secret_ate");
    }
  } else {
    const successResponses = [
      `🦝 Your raccoon robbed **${stolen} sparkles** from **${victimName}**!`,
      `💰 Your raccoon came back carrying **${stolen} sparkles**! Crime pays. 🦝`,
      `🦝✨ Your raccoon successfully stole **${stolen} sparkles**!`,
      `🚨 Raccoon robbery successful! **${stolen} sparkles** are now yours.`
    ];
    result = successResponses[randomInt(0, successResponses.length - 1)];
    player.sparkles += stolen;
    player.raccoonWins = Number(player.raccoonWins || 0) + 1;
    target.sparkles = Math.max(0, Number(target.sparkles || 0) - stolen);
  }

  await savePlayer(env, player);
  await savePlayer(env, target);

  await sendText(env, interaction, `${result}\n\n🕒 Your raccoon needs **3 hours** to recover before the next robbery.`);

  const dmText =
    stolen > 0
      ? `🦝 **A RACCOON ROBBED YOU!**\n\nA raccoon sent by **${player.displayName || player.username || "another Werewife"}** stole **${stolen} sparkles** from you. 😭\n\nYour remaining balance: **${target.sparkles} sparkles**.`
      : `🦝 **A RACCOON TRIED TO ROB YOU!**\n\nSomeone sent a raccoon after your sparkles, but it came back empty-handed. 😂\n\nYour balance is still **${target.sparkles} sparkles**.`;

  await sendUserDM(env, targetId, dmText);
}

async function sendUserDM(env, userId, content) {
  try {
    const response = await discordRequest(
      env,
      "/users/@me/channels",
      {
        method: "POST",
        body: JSON.stringify({ recipients: [userId] })
      }
    );

    if (!response.ok) {
      console.error("User DM channel failed:", response.status, await response.text());
      return false;
    }

    const channel = await response.json();

    const messageResponse = await discordRequest(
      env,
      `/channels/${channel.id}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content })
      }
    );

    if (!messageResponse.ok) {
      console.error("User DM message failed:", messageResponse.status, await messageResponse.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("User DM error:", error);
    return false;
  }
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

const ACHIEVEMENTS = [
  { id: "first_water", name: "💧 First Sip", description: "Water your tree 1 time.", reward: 25, progress: p => Number(p.waterCount || 0), goal: 1 },
  { id: "hydration_25", name: "💦 Hydration Station", description: "Water your tree 25 times.", reward: 50, progress: p => Number(p.waterCount || 0), goal: 25 },
  { id: "hydration_100", name: "🪣 Professional Waterer", description: "Water your tree 100 times.", reward: 100, progress: p => Number(p.waterCount || 0), goal: 100 },
  { id: "hydration_500", name: "🌊 Why Is Everything Wet?", description: "Water your tree 500 times.", reward: 250, progress: p => Number(p.waterCount || 0), goal: 500 },
  { id: "first_sparkle", name: "✨ Shiny!", description: "Catch your first sparkle.", reward: 25, progress: p => Number(p.sparklesCaught || 0), goal: 1 },
  { id: "sparkles_100", name: "💎 Sparkle Hoarder", description: "Catch 100 sparkles.", reward: 100, progress: p => Number(p.sparklesCaught || 0), goal: 100 },
  { id: "sparkles_1000", name: "💰 Little Rich", description: "Catch 1,000 sparkles.", reward: 250, progress: p => Number(p.sparkleValueCaught || 0), goal: 1000 },
  { id: "sparkles_10000", name: "💎 Sparkle Goblin", description: "Collect 10,000 sparkle value.", reward: 750, progress: p => Number(p.sparkleValueCaught || 0), goal: 10000 },
  { id: "level_5", name: "🌱 Baby Tree", description: "Reach level 5.", reward: 50, progress: p => Number(p.level || 1), goal: 5 },
  { id: "level_10", name: "🌿 Growing Up", description: "Reach level 10.", reward: 100, progress: p => Number(p.level || 1), goal: 10 },
  { id: "level_25", name: "🌳 Established", description: "Reach level 25.", reward: 250, progress: p => Number(p.level || 1), goal: 25 },
  { id: "level_50", name: "✨ Glowing", description: "Reach level 50.", reward: 500, progress: p => Number(p.level || 1), goal: 50 },
  { id: "raccoon_first", name: "🦝 Crime Pays", description: "Use /raccoon for the first time.", reward: 50, progress: p => Number(p.raccoonRobberies || 0), goal: 1 },
  { id: "raccoon_5", name: "🦝 Public Menace", description: "Successfully rob someone 5 times.", reward: 150, progress: p => Number(p.raccoonWins || 0), goal: 5 },
  { id: "fortune_first", name: "🔮 Fortune Seeker", description: "Use /fortune for the first time.", reward: 50, progress: p => Number(p.fortuneUses || 0), goal: 1 },
  { id: "shop_5", name: "🛍️ Take My Sparkles", description: "Buy 5 shop items.", reward: 150, progress: p => Number(p.shopPurchases || 0), goal: 5 },
  { id: "secret_zero", name: "🤡 Worth A Shot", description: "Get a 0-sparkle raccoon result.", reward: 100, hidden: true, progress: p => p.secretAchievements?.includes("secret_zero") ? 1 : 0, goal: 1 },
  { id: "secret_ate", name: "🍽️ He Ate Them?!", description: "Get the raccoon ate the sparkles outcome.", reward: 150, hidden: true, progress: p => p.secretAchievements?.includes("secret_ate") ? 1 : 0, goal: 1 },
  { id: "tree_obsessed", name: "🌳 Tree Obsessed", description: "Check /tree 100 times.", reward: 100, hidden: true, progress: p => Number(p.treeChecks || 0), goal: 100 },
  { id: "cat_person", name: "🐱 Cat Person", description: "Buy your first cat item.", reward: 100, hidden: true, progress: p => p.catItemBought ? 1 : 0, goal: 1 }
];

function updateAchievements(player) {
  if (!Array.isArray(player.achievements)) player.achievements = [];
  if (!Array.isArray(player.secretAchievements)) player.secretAchievements = [];

  let rewardTotal = 0;
  for (const achievement of ACHIEVEMENTS) {
    if (player.achievements.includes(achievement.id)) continue;
    const progress = Number(achievement.progress(player) || 0);
    if (progress >= achievement.goal) {
      player.achievements.push(achievement.id);
      player.sparkles = Number(player.sparkles || 0) + achievement.reward;
      rewardTotal += achievement.reward;
    }
  }
  return rewardTotal;
}

async function handleAchievements(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;

  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  updateAchievements(player);
  await savePlayer(env, player);

  if (
    player.inventory.includes("cat_decoration") ||
    player.inventory.includes("pumpkin_cat_decoration") ||
    player.inventory.includes("purr_princess_effect") ||
    player.inventory.includes("kitty_tree") ||
    player.inventory.includes("cozy_cat_background")
  ) {
    player.catItemBought = true;
  }

  const unlocked = new Set(player.achievements || []);
  const lines = ACHIEVEMENTS.map(a => {
    if (a.hidden && !unlocked.has(a.id)) {
      return "🔒 **Secret Achievement** — ???";
    }
    const progress = Math.min(a.goal, Number(a.progress(player) || 0));
    const status = unlocked.has(a.id) ? "🏆" : "⬜";
    return `${status} **${a.name}** — ${a.description}\n   Progress: **${progress}/${a.goal}** • Reward: **${a.reward} ✨**`;
  });

  await sendText(
    env,
    interaction,
    `🏆 **YOUR ACHIEVEMENTS**\n\nUnlocked: **${player.achievements.length}/${ACHIEVEMENTS.length}**\n\n${lines.join("\n\n")}`
  );
}

async function handleGift(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user || !interaction.guild_id) {
    await sendText(env, interaction, "❌ This command can only be used inside a server.");
    return;
  }

  const target = getOption(interaction, "user");
  const amount = Math.floor(Number(getOption(interaction, "amount")));

  if (!target || target === user.id || !Number.isFinite(amount) || amount < 50 || amount > 50000) {
    await sendText(env, interaction, "❌ Gifts must be **50–50,000 sparkles**, and you can't gift yourself.");
    return;
  }

  const sender = await getPlayer(env, user.id);
  if (sender.sparkles < amount) {
    await sendText(env, interaction, `❌ You only have **${sender.sparkles} sparkles**.`);
    return;
  }

  const receiver = await getPlayer(env, target);
  sender.sparkles -= amount;
  receiver.sparkles += amount;
  await savePlayer(env, sender);
  await savePlayer(env, receiver);

  await sendText(
    env,
    interaction,
    `🎁 You gifted **${amount} sparkles** to <@${target}>! ✨`
  );
}

async function handleFine(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user || !interaction.guild_id) {
    await sendText(env, interaction, "❌ This command can only be used inside a server.");
    return;
  }

  const target = getOption(interaction, "user");
  const amount = Math.floor(Number(getOption(interaction, "amount")));

  if (!target || target === user.id || !Number.isFinite(amount) || amount < 50 || amount > 50000) {
    await sendText(env, interaction, "❌ Fines must be **50–50,000 sparkles**, and you can't fine yourself.");
    return;
  }

  const targetPlayer = await getPlayer(env, target);
  const actualFine = Math.min(amount, Math.max(0, Number(targetPlayer.sparkles || 0)));

  if (actualFine <= 0) {
    await sendText(env, interaction, `❌ <@${target}> has no sparkles to fine.`);
    return;
  }

  const issuer = await getPlayer(env, user.id);
  targetPlayer.sparkles -= actualFine;
  issuer.sparkles += actualFine;
  await savePlayer(env, targetPlayer);
  await savePlayer(env, issuer);

  await sendText(
    env,
    interaction,
    `⚖️ <@${target}> was fined **${actualFine} sparkles**. The sparkles went to you. ✨`
  );
}

async function handleIslandCommand(env, interaction) {
  if (!interaction.guild_id) {
    await sendText(env, interaction, "❌ Chaos Island can only be played inside a server.");
    return;
  }
  const subcommand = interaction.data?.options?.find(option => option.type === 1)?.name || "status";
  if (subcommand === "create") return handleIslandCreate(env, interaction);
  if (subcommand === "join") return handleIslandJoin(env, interaction);
  if (subcommand === "leave") return handleIslandLeave(env, interaction);
  if (subcommand === "start") return handleIslandStart(env, interaction);
  if (subcommand === "status") return handleIslandStatus(env, interaction);
  if (subcommand === "settings") return handleIslandSettings(env, interaction);
  await handleIslandRules(env, interaction);
}

async function handleCommand(
  env,
  interaction
) {
  const name =
    interaction.data?.name;

  if (name === "games") {
    await handleGamesMenu(env, interaction);
    return;
  }

  if (name === "solo") {
    const subcommand = interaction.data?.options?.find(option => option.type === 1)?.name || "start";
    if (subcommand === "leaderboard") await handleSoloLeaderboard(env, interaction);
    else if (subcommand === "status") await handleSoloStatus(env, interaction);
    else if (subcommand === "start") await handleSoloStart(env, interaction);
    else await handleSoloStart(env, interaction);
    return;
  }

  if (name === "title") {
    await handleTitleList(env, interaction);
    return;
  }

  if (name === "island") {
    await handleIslandCommand(env, interaction);
    return;
  }

  if (name === "heist") {
    await handleHeistCommand(
      env,
      interaction
    );
    return;
  }

  if (name === "raccoon") {
    await handleRaccoon(env, interaction);
    return;
  }

  if (name === "sparkle") {
    await handleSparkleBalance(env, interaction);
    return;
  }

  if (name === "fortune") {
    await handleFortune(env, interaction);
    return;
  }

  if (name === "achievements") {
    await handleAchievements(env, interaction);
    return;
  }

  if (name === "roles") {
    await handleHeistRoles(env, interaction);
    return;
  }

  if (name === "tree") {
    await handleTree(
      env,
      interaction
    );

    return;
  }

  if (name === "water") {
    await handleWater(
      env,
      interaction
    );

    return;
  }

  if (name === "catch") {
    await handleCatch(
      env,
      interaction
    );

    return;
  }

  if (
    name === "daily-riddle"
  ) {
    await handleDailyRiddle(
      env,
      interaction,
      getOption(
        interaction,
        "answer"
      )
    );

    return;
  }

  if (name === "recycle") {
    await handleRecycle(
      env,
      interaction,
      getOption(
        interaction,
        "amount"
      )
    );

    return;
  }

  if (name === "gift") {
    await handleGift(env, interaction);
    return;
  }

  if (name === "fine") {
    await handleFine(env, interaction);
    return;
  }

  if (name === "shop") {
    await showShop(
      env,
      interaction
    );

    return;
  }

  if (
    name === "customize"
  ) {
    await showCustomize(
      env,
      interaction
    );

    return;
  }

  if (
    name === "inventory"
  ) {
    await showInventory(
      env,
      interaction
    );

    return;
  }

  if (
    name === "leaderboard"
  ) {
    await showLeaderboard(
      env,
      interaction
    );

    return;
  }

  if (
    name === "announcements"
  ) {
    await handleAnnouncements(
      env,
      interaction,
      getOption(
        interaction,
        "channel"
      )
    );

    return;
  }

  if (
    name === "rename"
  ) {
    const user =
      getUserFromInteraction(
        interaction
      );

    if (!user) return;

    const player =
      await getPlayer(
        env,
        user.id
      );

    updatePlayerIdentity(
      player,
      interaction
    );

    const newName =
      getOption(
        interaction,
        "name"
      );

    if (
      !newName ||
      String(newName).length >
        40
    ) {
      await sendText(
        env,
        interaction,
        "❌ Tree names must be between 1 and 40 characters."
      );

      return;
    }

    player.treeName =
      String(newName);

    await savePlayer(
      env,
      player
    );

    await sendText(
      env,
      interaction,
      `🌳 Your tree is now named **${player.treeName}**!`
    );

    return;
  }

  if (
    name ===
    "give-sparkles"
  ) {
    const user =
      getUserFromInteraction(
        interaction
      );

    if (!user) return;

    if (
      user.id !==
      env.OWNER_ID
    ) {
      await sendText(
        env,
        interaction,
        "❌ Owner only."
      );

      return;
    }

    const target =
      getOption(
        interaction,
        "user"
      );

    const amount =
      Number(
        getOption(
          interaction,
          "amount"
        )
      );

    if (
      !target ||
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      await sendText(
        env,
        interaction,
        "❌ Invalid user or amount."
      );

      return;
    }

    const player =
      await getPlayer(
        env,
        target
      );

    player.sparkles +=
      Math.floor(amount);

    await savePlayer(
      env,
      player
    );

    await sendText(
      env,
      interaction,
      `✨ Gave **${Math.floor(amount)} sparkles** to <@${target}>!`
    );

    return;
  }

  await sendText(
    env,
    interaction,
    "❌ Unknown command."
  );
}

/* =========================================================
   DISCORD COMMAND DEFINITIONS
========================================================= */

const COMMANDS = [
  {
    name: "games",
    description: "Open the Werewives games menu"
  },

  {
    name: "solo",
    description: "Play Solo Mission",
    options: [
      { type: 1, name: "start", description: "Start a Solo Mission" },
      { type: 1, name: "status", description: "View your current Solo Mission" },
      { type: 1, name: "leaderboard", description: "View the Solo Mission leaderboard" }
    ]
  },

  {
    name: "title",
    description: "View and equip your earned titles"
  },

  {
    name: "island",
    description: "Play Chaos Island with 2–10 players",
    options: [
      { type: 1, name: "create", description: "Create a Chaos Island lobby" },
      { type: 1, name: "join", description: "Join the current Chaos Island lobby" },
      { type: 1, name: "leave", description: "Leave the current Chaos Island game" },
      { type: 1, name: "start", description: "Start Chaos Island (host only)" },
      { type: 1, name: "settings", description: "Change Chaos Island settings (host only)" },
      { type: 1, name: "status", description: "View the current Chaos Island game" },
      { type: 1, name: "rules", description: "View Chaos Island rules" }
    ]
  },

  {
    name: "heist",
    description: "Play Raccoon Heist with 3–12 players",
    options: [
      {
        type: 1,
        name: "create",
        description: "Create a new Raccoon Heist lobby"
      },
      {
        type: 1,
        name: "join",
        description: "Join the current Raccoon Heist lobby"
      },
      {
        type: 1,
        name: "leave",
        description: "Leave the current Raccoon Heist lobby"
      },
      {
        type: 1,
        name: "start",
        description: "Start the Raccoon Heist (host only)"
      },
      {
        type: 1,
        name: "status",
        description: "View the current heist and your secret information"
      },
      {
        type: 1,
        name: "end",
        description: "End the current heist (host only)"
      }
    ]
  },

  {
    name: "roles",
    description: "View all Raccoon Heist roles and what they do"
  },

  {
    name: "raccoon",
    description: "Send a raccoon to rob another player",
    options: [
      {
        type: 6,
        name: "user",
        description: "Player your raccoon should rob",
        required: true
      }
    ]
  },

  {
    name: "sparkle",
    description: "Check your sparkle balance"
  },

  {
    name: "fortune",
    description: "Ask the Fortune Tree for a silly fortune"
  },

  {
    name: "achievements",
    description: "View your achievements"
  },

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
      "Catch sparkles from your tree"
  },

  {
    name: "daily-riddle",
    description:
      "Get or answer today's riddle",

    options: [
      {
        type: 3,
        name: "answer",
        description:
          "Your answer",
        required: false
      }
    ]
  },

  {
    name: "recycle",
    description:
      "Recycle 20-200 sparkles for a random 1x-10x payout",

    options: [
      {
        type: 4,
        name: "amount",
        description:
          "Amount of sparkles to recycle (20-200)",
        required: true,
        min_value: 20,
        max_value: 200
      }
    ]
  },

  {
    name: "gift",
    description: "Gift 50–50,000 sparkles to another member",
    options: [
      { type: 6, name: "user", description: "Member receiving the sparkles", required: true },
      { type: 4, name: "amount", description: "Amount of sparkles (50–50,000)", required: true, min_value: 50, max_value: 50000 }
    ]
  },

  {
    name: "fine",
    description: "Fine another member 50–50,000 sparkles",
    options: [
      { type: 6, name: "user", description: "Member being fined", required: true },
      { type: 4, name: "amount", description: "Amount of sparkles (50–50,000)", required: true, min_value: 50, max_value: 50000 }
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
    name: "announcements",
    description:
      "Set the Werewives announcement channel",

    options: [
      {
        type: 7,
        name: "channel",
        description:
          "Channel for chaos and event announcements",
        required: true,
        channel_types: [0]
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
          "New tree name",
        required: true,
        max_length: 40
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
        required: true,
        min_value: 1
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
    await discordRequest(
      env,
      `/applications/${env.CLIENT_ID}/commands`,
      {
        method: "PUT",
        body: JSON.stringify(
          COMMANDS
        )
      }
    );

  return response;
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
    !timestamp ||
    !env.PUBLIC_KEY
  ) {
    return false;
  }

  const body =
    await request
      .clone()
      .text();

  const message =
    new TextEncoder().encode(
      timestamp + body
    );

  const signatureBytes =
    hexToUint8Array(
      signature
    );

  const publicKeyBytes =
    hexToUint8Array(
      env.PUBLIC_KEY
    );

  try {
    const publicKey =
      await crypto.subtle.importKey(
        "raw",
        publicKeyBytes,
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
      publicKey,
      signatureBytes,
      message
    );
  } catch {
    return false;
  }
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
      url.pathname === "/"
    ) {
      return new Response(
        "Werewives Tree Bot is alive! 🌳💖",
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
      request.method !==
        "POST" ||
      url.pathname !==
        "/interactions"
    ) {
      return new Response(
        "Not found",
        {
          status: 404
        }
      );
    }

    const valid =
      await verifySignature(
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

    let interaction;

    try {
      interaction =
        await request.json();
    } catch {
      return new Response(
        "Invalid JSON",
        {
          status: 400
        }
      );
    }

    /*
      Discord PING
    */

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

    try {
      if (
        interaction.type === 2
      ) {
        await handleCommand(
          env,
          interaction
        );
      } else if (
        interaction.type === 3
      ) {
        await handleComponent(
          env,
          interaction
        );
      }

      return new Response(
        "OK",
        {
          status: 200
        }
      );
    } catch (error) {
      console.error(
        "Interaction error:",
        error
      );

      try {
        await editOriginalResponse(
          env,
          interaction,
          {
            content:
              `❌ Something went wrong: ${error?.message || "Unknown error"}`,
            components:
              treeButtons()
          }
        );
      } catch {
        try {
          await sendText(
            env,
            interaction,
            `❌ Something went wrong: ${error?.message || "Unknown error"}`
          );
        } catch {}
      }

      return new Response(
        "OK",
        {
          status: 200
        }
      );
    }
  },

 /* =======================================================
   SCHEDULED TASKS

   Cloudflare cron should be configured separately
   in Cloudflare Worker Settings → Triggers → Cron Triggers.

   Every scheduled pass checks:
   - Raccoon Heist timers
   - Chaos Island round timers
   - Chaos events (their one-hour schedule)
======================================================= */

  async scheduled(
    event,
    env,
    ctx
  ) {
    ctx.waitUntil(
      Promise.all([
        processChaosEvents(
          env
        ),
        processHeistTimers(
          env
        ),
        processChaosIslandTimers(
          env
        )
      ])
    );
  }
};
