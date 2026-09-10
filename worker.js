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

/*
  CHAOS IS NO LONGER TRIGGERED BY WATER.

  The scheduled Worker checks every 5 minutes.
  Each guild receives a chaos event every 5 minutes.
*/
const CHAOS_INTERVAL = 5 * 60 * 1000;
const CHAOS_SCHEDULE_VERSION = 4;
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
  halloweenTree: "IMG_7309.png"
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
    birthdayGiftClaimed: false
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
      nextChaosAt: 0
    };
  }

  try {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      nextChaosAt: 0,
      ...JSON.parse(raw)
    };
  } catch {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
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
          type: 5
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
      components: treeButtons(getUserFromInteraction(interaction)?.id || "")
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
          treeButtons(getUserFromInteraction(interaction)?.id || "")
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

function treeButtons(ownerId = "") {
  const prefix = ownerId ? `tree:${ownerId}:` : "tree:unknown:";

  return [
    row(
      button("💧 Water", `${prefix}water`, 1),
      button("✨ Catch Sparkles", `${prefix}catch`, 3),
      button("🧩 Daily Riddle", `${prefix}daily_riddle`, 2)
    ),
    row(
      button("🛍️ Shop", `${prefix}shop`, 2),
      button("🎨 Customize", `${prefix}customize`, 2),
      button("🏆 Leaderboard", `${prefix}leaderboard`, 2)
    )
  ];
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
              font-size:42px;
              line-height:1;
              z-index:10;
              opacity:1;
              filter:drop-shadow(0 0 6px white) drop-shadow(0 0 14px white) drop-shadow(0 0 24px #fff);
              user-select:none;
            "
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

          #tree {
            position: absolute;
            left: 50%;
            top: 76%;
            transform: translate(-50%, -50%);
            width: 62%;
            height: 62%;
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
  const roll =
    Math.random();

  if (roll < 0.55) {
    return {
      emoji: "💖",
      value: 10
    };
  }

  if (roll < 0.80) {
    return {
      emoji: "🌈",
      value: 20
    };
  }

  if (roll < 0.95) {
    return {
      emoji: "🌙",
      value: 30
    };
  }

  return {
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
        emoji: sparkle.emoji,
        value: sparkle.value,
        x: randomInt(25, 75),
        y: randomInt(25, 70),
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
      `${event.message} **+${amount} sparkles** to the Werewives! ✨\n\n🦝 The raccoon chaos was announced even though Discord did not return the member list.`
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

      /*
        The Worker cron is the actual clock for Chaos.
        Fire one event on every scheduled pass instead of relying
        on a second timer that can drift or get stuck in KV.
      */
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
          treeButtons(getUserFromInteraction(interaction)?.id || "")
      }
    );
  }
}

/* =========================================================
   CATCH SPARKLES
========================================================= */

async function handleCatch(
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

    /*
      First remove expired sparkles.

      If there are NONE after cleaning, we DO NOT
      launch Browser Rendering anymore.

      This is an important reduction in 429 usage.
    */

    cleanSparkles(
      player
    );

    if (
      !player.sparklesOnTree ||
      !player.sparklesOnTree.length
    ) {
      player.sceneMessage =
        "✨ There aren't any sparkles on your tree right now!";

      await savePlayer(
        env,
        player
      );

      /*
        NO sendTree().
        NO Browser Rendering.
      */

      await updateTreeMessage(
        env,
        interaction,
        player
      );

      return;
    }

    let total = 0;
    let caught = 0;

    for (
      const sparkle of
        player.sparklesOnTree
    ) {
      const value =
        Number(
          sparkle.value
        );

      if (
        Number.isFinite(
          value
        ) &&
        value > 0
      ) {
        total += value;
      }

      caught++;
    }

    player.sparklesOnTree =
      [];

    player.sparkles +=
      total;

    player.sceneMessage =
      `✨ You caught **${caught} sparkles** and earned **+${total} sparkles!** 💖`;

    await savePlayer(
      env,
      player
    );

    /*
      Sparkles were actually visible and have now
      disappeared, so the image MUST be rendered.
    */

    await updateTreeMessage(
      env,
      interaction,
      player
    );

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
  const user =
    getUserFromInteraction(
      interaction
    );

  const player =
    await getPlayer(
      env,
      user.id
    );

  const halloweenOwned =
    player.inventory.includes("halloween_background");
  const pumpkinOwned =
    player.inventory.includes("pumpkin_cat_decoration");
  const halloweenTreeOwned =
    player.inventory.includes("halloween_tree");

  await sendText(
    env,
    interaction,
    `🎃 **Limited Halloween Shop**\n\n🎃 **Halloween Background** — 150 sparkles\n${halloweenOwned ? "✅ Owned" : ""}\n\n🐈 **Pumpkin Cat** — 250 sparkles\n${pumpkinOwned ? "✅ Owned" : ""}\n\n🎃🌳 **Halloween Tree** — 2000 sparkles\n${halloweenTreeOwned ? "✅ Owned" : ""}`,
    [
      row(
        button(
          halloweenOwned
            ? "🎃 Halloween Owned"
            : "🎃 Buy Halloween — 150",
          "buy_halloween",
          halloweenOwned ? 2 : 1,
          halloweenOwned
        )
      ),
      row(
        button(
          pumpkinOwned
            ? "🐈 Pumpkin Cat Owned"
            : "🐈 Buy Pumpkin Cat — 250",
          "buy_pumpkin_cat",
          pumpkinOwned ? 2 : 1,
          pumpkinOwned
        )
      ),
      row(
        button(
          halloweenTreeOwned
            ? "🎃🌳 Halloween Tree Owned"
            : "🎃🌳 Buy Halloween Tree — 2000",
          "buy_halloween_tree",
          halloweenTreeOwned ? 2 : 1,
          halloweenTreeOwned
        )
      ),
      row(
        button("⬅️ Back", "shop", 2)
      )
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
    ["red_forest_background", "🌲 Red Forest", "red_forest"]
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
    ["halloween_tree", "🎃 Halloween", "halloween_tree"]
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
      hearts: "hearts_effect"
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
    `📢 Announcement channel set to **#${channel.name}**!\n\nWerewives chaos events and birthday hunt announcements will use this channel. 💖`
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
          treeButtons(getUserFromInteraction(interaction)?.id || "")
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

    const actionMap = {
      water: "water",
      catch: "catch",
      daily_riddle: "daily_riddle",
      shop: "shop",
      customize: "customize",
      leaderboard: "leaderboard"
    };

    const mapped = actionMap[action];
    if (mapped === "water") { await handleWater(env, interaction); return; }
    if (mapped === "catch") { await handleCatch(env, interaction); return; }
    if (mapped === "daily_riddle") { await handleDailyRiddle(env, interaction); return; }
    if (mapped === "shop") { await showShop(env, interaction); return; }
    if (mapped === "customize") { await showCustomize(env, interaction); return; }
    if (mapped === "leaderboard") { await showLeaderboard(env, interaction); return; }
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
      "halloween_tree"
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

  if (
    id ===
    "open_birthday_gift"
  ) {
    await openBirthdayGift(
      env,
      interaction
    );

    return;
  }

  if (
    id.startsWith(
      "claim_hunt_gift:"
    )
  ) {
    await claimHuntGift(
      env,
      interaction,
      id.substring(
        "claim_hunt_gift:"
          .length
      )
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
  "patient_zero"
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
  return (
    player?.displayName ||
    player?.username ||
    "Werewife"
  );
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
    illusion: "🪄 Illusion"
  };

  return names[action] || action;
}

function heistRolesForCount(count) {
  if (count < HEIST_MIN_PLAYERS || count > HEIST_MAX_PLAYERS) {
    return [];
  }

  const roles = [
    "thief",
    "detective",
    "rabid_raccoon"
  ];

  if (count >= 4) {
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
    "illusion"
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

  const locked =
    await setHeistChannelLock(
      env,
      game,
      true
    );

  if (!locked) {
    return false;
  }

  const intro =
    openingText ||
    `🌙 **NIGHT ${game.round} HAS FALLEN**\n\n` +
    `🔒 The heist channel is now locked for typing.\n\n` +
    `Everyone has a secret role. Perform your action using the private buttons below.\n\n` +
    `💰 Vault: **${game.vault} ✨**\n` +
    `⏳ Night ends when everyone acts or the timer expires.`;

  await heistSendPublic(
    env,
    game,
    intro,
    heistNightOpenButton(game)
  );

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

  game.status = "voting";
  game.phaseEndsAt =
    Date.now() +
    HEIST_VOTE_DURATION;
  game.votes = {};

  const unlocked =
    await setHeistChannelLock(
      env,
      game,
      false
    );

  if (!unlocked) {
    console.error(
      "Heist channel could not be unlocked."
    );
  }

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
  game.status = "ended";
  game.endedReason =
    reason || "The heist ended.";
  game.phaseEndsAt = 0;

  await setHeistChannelLock(
    env,
    game,
    false
  );

  const thief =
    Object.values(game.players).find(
      player =>
        player.role === "thief"
    );

  if (
    thief &&
    game.endedReason.includes(
      "THIEF HAS BEEN CAUGHT"
    )
  ) {
    thief.alive = false;
  }

  const winners =
    heistWinnerList(game);

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
    winners.length
      ? winners.join("\n")
      : "No secret-role side goals were completed.";

  await heistSendPublic(
    env,
    game,
    `🏁 **RACCOON HEIST OVER!**\n\n${reason}\n\n💰 Total stolen: **${game.totalStolen} ✨**\n\n🏆 **Winners / completed secret goals:**\n${winnerText}\n\n🎭 **ROLE REVEAL**\n${roleReveal}\n\n🦝 Thank you for committing raccoon crimes.`
  );

  await saveGuildState(
    env,
    game.guildId,
    await getGuildState(
      env,
      game.guildId
    )
  );
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

        state.heist = game;

        await saveGuildState(
          env,
          guildId,
          state
        );
      } else if (
        game.status === "voting" &&
        Date.now() >=
          Number(game.phaseEndsAt || 0)
      ) {
        await resolveHeistVote(
          env,
          game
        );

        state.heist = game;

        await saveGuildState(
          env,
          guildId,
          state
        );
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

  const locked =
    await setHeistChannelLock(
      env,
      game,
      true
    );

  if (!locked) {
    game.status = "lobby";
    state.heist = game;

    await saveGuildState(
      env,
      interaction.guild_id,
      state
    );

    await sendText(
      env,
      interaction,
      "❌ I couldn't lock the game channel. Please give Tree Bot **Manage Channels** permission, then try `/heist start` again."
    );

    return;
  }

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
      `🌙 **NIGHT 1**\n🔒 The channel is now locked for typing.\n\n` +
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

  state.heist = game;

  await saveGuildState(
    env,
    interaction.guild_id,
    state
  );

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

  const game =
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

async function handleCommand(
  env,
  interaction
) {
  const name =
    interaction.data?.name;

  if (name === "heist") {
    await handleHeistCommand(
      env,
      interaction
    );
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

   Every minute we check:
   - Raccoon Heist timers (60-second Night timeout)
   - Chaos events (their own 5-minute schedule)
   - Birthday hunt
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
        processBirthdayEvent(
          env
        ),
        processHeistTimers(
          env
        )
      ])
    );
  }
};
