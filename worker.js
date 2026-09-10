import puppeteer from "@cloudflare/puppeteer";

/* =========================================================
   WEREWIVES TREE BOT - CLEAN REPLACEMENT
   Existing bindings only:
   TREE_DATA
   BROWSER
   CLIENT_ID
   BOT_TOKEN
   PUBLIC_KEY
   OWNER_ID
========================================================= */

const EXP_PER_WATER = 10;

const SPARKLE_CHANCE = 0.50;
const SPARKLE_LIFETIME = 5 * 60 * 1000;

const MIN_SPARKLES_PER_SPAWN = 2;
const MAX_SPARKLES_PER_SPAWN = 4;
const MAX_ACTIVE_SPARKLES = 5;

const WATER_COOLDOWN = 60 * 60 * 1000;

const CHAOS_CHANCE = 0.35;

const BIRTHDAY_PIN = "LOVE";
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
  cat: "IMG_7288.png"
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
    message: "🧀 THE CHEESE COUNCIL HAS ARRIVED! Everyone gets a cheese bonus!"
  },
  {
    type: "everyone",
    min: 5,
    max: 30,
    message: "🦝 RACCOON TAX! The raccoons have blessed everybody with sparkles!"
  },
  {
    type: "everyone",
    min: 10,
    max: 40,
    message: "🐺 WEREWIFE MOON! Everyone's tree just got a little more powerful!"
  },
  {
    type: "everyone",
    min: 5,
    max: 25,
    message: "✨ SPARKLE STORM! Sparkles are raining over every tree!"
  },
  {
    type: "player",
    min: 10,
    max: 60,
    message: "🌸 A mysterious fairy found your tree and left you some sparkles!"
  },
  {
    type: "player",
    min: -30,
    max: -5,
    message: "🦝 A raccoon stole some of your sparkles!"
  },
  {
    type: "player",
    min: 5,
    max: 35,
    message: "💅 WEREWIFE ENERGY! Your tree received a surprise sparkle boost!"
  },
  {
    type: "player",
    min: -20,
    max: 20,
    message: "🎲 CHAOS DICE! Your sparkle balance has been randomly altered!"
  }
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
    inventory: ["pink_sky_background"],
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
   KV HELPERS
========================================================= */

async function getPlayer(env, userId) {
  const raw = await env.TREE_DATA.get(userId);

  if (!raw) {
    const player = defaultPlayer();
    player.userId = userId;
    return player;
  }

  try {
    const player = JSON.parse(raw);

    return {
      ...defaultPlayer(),
      ...player,
      userId: player.userId || userId,
      inventory: Array.isArray(player.inventory)
        ? player.inventory
        : ["pink_sky_background"],
      claimedLevelRewards: Array.isArray(player.claimedLevelRewards)
        ? player.claimedLevelRewards
        : [],
      sparklesOnTree: Array.isArray(player.sparklesOnTree)
        ? player.sparklesOnTree
        : [],
      equipped: {
        ...defaultPlayer().equipped,
        ...(player.equipped || {})
      }
    };
  } catch {
    const player = defaultPlayer();
    player.userId = userId;
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
  return interaction.member?.user || interaction.user || null;
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
      hunt: null
    };
  }

  const raw = await env.TREE_DATA.get(`guild:${guildId}`);

  if (!raw) {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null
    };
  }

  try {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      ...JSON.parse(raw)
    };
  } catch {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null
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

  const state = await getGuildState(env, guildId);

  if (!state.createdAt) {
    state.createdAt = Date.now();
    await saveGuildState(env, guildId, state);
  }
}

/* =========================================================
   LEVELS / XP
========================================================= */

function xpNeeded(level) {
  return level * 50;
}

function getTreeHeight(player) {
  return Math.max(1, Number(player.level) || 1);
}

function applyLevelUps(player) {
  let leveled = false;

  while (player.exp >= xpNeeded(player.level)) {
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
  const rewardLevels = [5, 10, 20, 35, 50];
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

function getEasternDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

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

function easternDateKey(date = new Date()) {
  const p = getEasternDateParts(date);

  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(
    p.day
  ).padStart(2, "0")}`;
}

function isBirthdayDate(date = new Date()) {
  const p = getEasternDateParts(date);

  return p.year === 2026 && p.month === 9 && p.day === 10;
}

function isBirthdayHuntTime(date = new Date()) {
  const p = getEasternDateParts(date);

  if (!isBirthdayDate(date)) return false;

  const minutes = p.hour * 60 + p.minute;

  return minutes >= 16 * 60 && minutes < 19 * 60;
}

/* =========================================================
   DISCORD API
========================================================= */

async function discordRequest(env, path, options = {}) {
  const headers = new Headers(options.headers || {});

  headers.set(
    "Authorization",
    `Bot ${env.BOT_TOKEN}`
  );

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(
    `https://discord.com/api/v10${path}`,
    {
      ...options,
      headers
    }
  );
}

async function sendChannelMessage(env, channelId, content, components = []) {
  if (!channelId) return null;

  const response = await discordRequest(
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
    return null;
  }

  return response.json();
}

async function getGuildTextChannels(env, guildId) {
  const response = await discordRequest(
    env,
    `/guilds/${guildId}/channels`
  );

  if (!response.ok) return [];

  const channels = await response.json();

  return channels.filter(
    channel =>
      channel.type === 0 &&
      !channel.is_thread
  );
}

/* =========================================================
   INTERACTION RESPONSES
========================================================= */

async function acknowledge(env, interaction) {
  await fetch(
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

async function sendText(env, interaction, content, components = []) {
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

async function sendTree(env, interaction, player) {
  const image = await renderTree(env, player);

  const form = new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      content: player.sceneMessage || "",
      attachments: [
        {
          id: 0,
          filename: "tree.png"
        }
      ],
      components: treeButtons()
    })
  );

  form.append(
    "files[0]",
    new Blob([image], { type: "image/png" }),
    "tree.png"
  );

  await fetch(
    `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",
      body: form
    }
  );
}

/* =========================================================
   BUTTON HELPERS
========================================================= */

function button(label, customId, style = 2, disabled = false) {
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

function treeButtons() {
  return [
    row(
      button("💧 Water", "water", 1),
      button("✨ Catch Sparkles", "catch", 3),
      button("🧩 Daily Riddle", "daily_riddle", 2)
    ),
    row(
      button("🛍️ Shop", "shop", 2),
      button("🎨 Customize", "customize", 2),
      button("🏆 Leaderboard", "leaderboard", 2)
    )
  ];
}

/* =========================================================
   IMAGE RENDERING
========================================================= */

function imageUrl(filename) {
  return `${BASE_URL}${filename}`;
}

function getBackgroundImage(player) {
  switch (player.equipped?.theme) {
    case "halloween":
      return IMAGES.halloween;

    case "candyland":
      return IMAGES.candyland;

    case "stoned_birthday":
      return IMAGES.stonedBackground;

    default:
      return IMAGES.pinkSky;
  }
}

function getTreeImage(player) {
  switch (player.equipped?.tree) {
    case "cotton_candy":
      return IMAGES.cottonCandyTree;

    case "stoned_birthday":
      return IMAGES.stonedTree;

    case "cherry":
    default:
      return IMAGES.cherryTree;
  }
}

function getDecorationImage(player) {
  switch (player.equipped?.decoration) {
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

async function renderTree(env, player) {
  const browser = await puppeteer.launch(env.BROWSER);

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1
    });

    const background = imageUrl(
      getBackgroundImage(player)
    );

    const tree = imageUrl(
      getTreeImage(player)
    );

    const decorationFile =
      getDecorationImage(player);

    const decoration = decorationFile
      ? imageUrl(decorationFile)
      : "";

    const sparkleHTML = (
      player.sparklesOnTree || []
    )
      .map(sparkle => {
        const left = Number(sparkle.x) || 50;
        const top = Number(sparkle.y) || 50;

        return `
          <div
            style="
              position:absolute;
              left:${left}%;
              top:${top}%;
              transform:translate(-50%,-50%);
              font-size:34px;
              z-index:5;
              filter:drop-shadow(0 0 8px white);
            "
          >${sparkle.emoji}</div>
        `;
      })
      .join("");

    const decorationHTML = decoration
      ? `
        <img
          src="${decoration}"
          style="
            position:absolute;
            left:20%;
            top:78%;
            transform:translate(-50%,-50%);
            width:24%;
            height:24%;
            object-fit:contain;
            z-index:4;
          "
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
            box-sizing:border-box;
          }

          html,
          body {
            margin:0;
            padding:0;
            width:1024px;
            height:1024px;
            overflow:hidden;
            background:#ffd9ef;
            font-family:Arial,sans-serif;
          }

          #scene {
            position:relative;
            width:1024px;
            height:1024px;
            overflow:hidden;
          }

          #background {
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            object-fit:cover;
          }

          #tree {
            position:absolute;
            left:50%;
            top:76%;
            transform:translate(-50%,-50%);
            width:54%;
            height:54%;
            object-fit:contain;
            z-index:3;
          }

          .title {
            position:absolute;
            top:30px;
            left:50%;
            transform:translateX(-50%);
            z-index:10;
            padding:12px 25px;
            border-radius:20px;
            background:rgba(255,255,255,.82);
            font-size:30px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 4px 18px rgba(0,0,0,.15);
          }

          .stats {
            position:absolute;
            left:50%;
            bottom:28px;
            transform:translateX(-50%);
            z-index:10;
            padding:12px 24px;
            border-radius:18px;
            background:rgba(255,255,255,.86);
            font-size:22px;
            white-space:nowrap;
            box-shadow:0 4px 18px rgba(0,0,0,.15);
          }
        </style>
      </head>

      <body>
        <div id="scene">
          <img id="background" src="${background}">
          <div class="title">
            🌳 ${escapeHTML(player.treeName)}
          </div>

          <img id="tree" src="${tree}">

          ${decorationHTML}

          ${sparkleHTML}

          <div class="stats">
            🌳 Height: ${getTreeHeight(player)} ft
            &nbsp; • &nbsp;
            ⭐ ${player.sparkles} sparkles
            &nbsp; • &nbsp;
            ⭐ Level ${player.level}
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    await page.evaluate(async () => {
      const images = Array.from(
        document.images
      );

      await Promise.all(
        images.map(
          image =>
            new Promise(resolve => {
              if (image.complete) {
                resolve();
              } else {
                image.onload = resolve;
                image.onerror = resolve;
              }
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

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   SPARKLES
========================================================= */

function cleanSparkles(player) {
  const now = Date.now();

  player.sparklesOnTree =
    (player.sparklesOnTree || []).filter(
      sparkle =>
        now - Number(sparkle.createdAt) <
        SPARKLE_LIFETIME
    );
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomSparkle() {
  const roll = Math.random();

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

function maybeSpawnSparkles(player) {
  if (Math.random() > SPARKLE_CHANCE) {
    return 0;
  }

  const amount = randomInt(
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
    const sparkle = randomSparkle();

    player.sparklesOnTree.push({
      id: crypto.randomUUID(),
      emoji: sparkle.emoji,
      value: sparkle.value,
      x: randomInt(25, 75),
      y: randomInt(25, 70),
      createdAt: Date.now()
    });

    spawned++;
  }

  return spawned;
}

/* =========================================================
   CHAOS EVENTS
========================================================= */

async function maybeChaosEvent(
  env,
  interaction,
  player
) {
  if (Math.random() > CHAOS_CHANCE) {
    return "";
  }

  const event =
    CHAOS_EVENTS[
      randomInt(0, CHAOS_EVENTS.length - 1)
    ];

  const amount = randomInt(
    event.min,
    event.max
  );

  if (event.type === "everyone") {
    const keys = await listAllPlayerKeys(env);

    for (const key of keys) {
      const other = await getPlayer(env, key);

      other.sparkles = Math.max(
        0,
        other.sparkles + amount
      );

      await savePlayer(env, other);
    }

    const text = `${event.message} **+${amount} sparkles** to everyone!`;

    await announceChaos(
      env,
      interaction.guild_id,
      text
    );

    return text;
  }

  player.sparkles = Math.max(
    0,
    player.sparkles + amount
  );

  const amountText =
    amount >= 0
      ? `+${amount}`
      : `${amount}`;

  const text =
    `${event.message} **${amountText} sparkles**`;

  await announceChaos(
    env,
    interaction.guild_id,
    `${getDisplayName(player)} — ${text}`
  );

  return text;
}

function getDisplayName(player) {
  return player.displayName ||
    player.username ||
    "A Werewife";
}

async function announceChaos(
  env,
  guildId,
  message
) {
  if (!guildId) return;

  const state =
    await getGuildState(env, guildId);

  if (state.announcementChannelId) {
    await sendChannelMessage(
      env,
      state.announcementChannelId,
      `💥 **WEREWIVES CHAOS EVENT!**\n${message}`
    );
  }
}

/* =========================================================
   PLAYER KEY LIST
========================================================= */

async function listAllPlayerKeys(env) {
  const keys = [];
  let cursor;

  do {
    const result = await env.TREE_DATA.list({
      cursor
    });

    for (const key of result.keys) {
      if (/^\d{15,25}$/.test(key.name)) {
        keys.push(key.name);
      }
    }

    cursor = result.list_complete
      ? undefined
      : result.cursor;
  } while (cursor);

  return keys;
}

/* =========================================================
   WATER
========================================================= */

async function handleWater(env, interaction) {
  await acknowledge(env, interaction);

  const user = getUserFromInteraction(
    interaction
  );

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  updatePlayerIdentity(
    player,
    interaction
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

    const minutes = Math.ceil(
      remaining / 60000
    );

    player.sceneMessage =
      `💧 Your tree needs a little time to absorb that water! Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;

    await savePlayer(env, player);
    await sendTree(env, interaction, player);
    return;
  }

  player.lastWater = now;
  player.exp += EXP_PER_WATER;

  const oldLevel = player.level;

  applyLevelUps(player);

  const levelReward =
    claimAvailableLevelRewards(player);

  cleanSparkles(player);

  const spawned =
    maybeSpawnSparkles(player);

  const chaosMessage =
    await maybeChaosEvent(
      env,
      interaction,
      player
    );

  const parts = [
    `💧 You watered your tree! +${EXP_PER_WATER} EXP.`
  ];

  if (player.level > oldLevel) {
    parts.push(
      `🎉 Your tree reached **Level ${player.level}**!`
    );
  }

  if (levelReward > 0) {
    parts.push(
      `🎁 Level rewards: +${levelReward} sparkles!`
    );
  }

  if (spawned > 0) {
    parts.push(
      `✨ ${spawned} sparkles appeared on your tree!`
    );
  }

  if (chaosMessage) {
    parts.push(chaosMessage);
  }

  player.sceneMessage = parts.join("\n");

  await savePlayer(env, player);

  await sendTree(
    env,
    interaction,
    player
  );
}

/* =========================================================
   CATCH SPARKLES
========================================================= */

async function handleCatch(env, interaction) {
  await acknowledge(env, interaction);

  const user =
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  updatePlayerIdentity(
    player,
    interaction
  );

  cleanSparkles(player);

  if (!player.sparklesOnTree.length) {
    player.sceneMessage =
      "✨ There aren't any sparkles on your tree right now!";

    await savePlayer(env, player);
    await sendTree(env, interaction, player);
    return;
  }

  let total = 0;

  for (const sparkle of player.sparklesOnTree) {
    total += Number(sparkle.value) || 0;
  }

  player.sparkles += total;
  player.sparklesOnTree = [];

  player.sceneMessage =
    `✨ You caught all the sparkles! **+${total} sparkles!**`;

  await savePlayer(env, player);

  await sendTree(
    env,
    interaction,
    player
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
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  updatePlayerIdentity(
    player,
    interaction
  );

  const today =
    easternDateKey();

  if (player.dailyRiddleDay !== today) {
    player.dailyRiddleDay = today;
    player.dailyRiddleSolved = false;
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

    await savePlayer(env, player);
    return;
  }

  if (player.dailyRiddleSolved) {
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

  if (normalized !== riddle.answer) {
    await sendText(
      env,
      interaction,
      "❌ Nope! That's not the answer. Try again!"
    );
    return;
  }

  const reward =
    100 +
    player.dailyRiddleWins * 5;

  player.sparkles += reward;
  player.dailyRiddleSolved = true;
  player.dailyRiddleWins++;

  player.sceneMessage =
    `🧩 Correct! You earned **${reward} sparkles!**`;

  await savePlayer(env, player);

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

  for (let i = 0; i < value.length; i++) {
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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const owned =
    player.inventory.includes(
      "candyland_background"
    );

  await sendText(
    env,
    interaction,
    `🌌 **Backgrounds**\n\n🍬 **Candy Land** — 500 sparkles\n${owned ? "✅ Owned" : ""}`,
    [
      row(
        button(
          owned
            ? "🍬 Candy Land Owned"
            : "🍬 Buy Candy Land — 500",
          "buy_candyland",
          owned ? 2 : 1,
          owned
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

async function showTreeShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const owned =
    player.inventory.includes(
      "cotton_candy_tree"
    );

  await sendText(
    env,
    interaction,
    `🌳 **Trees**\n\n🍭 **Cotton Candy Tree** — 1000 sparkles\n${owned ? "✅ Owned" : ""}`,
    [
      row(
        button(
          owned
            ? "🍭 Cotton Candy Owned"
            : "🍭 Buy Cotton Candy — 1000",
          "buy_cotton_candy",
          owned ? 2 : 1,
          owned
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

async function showDecorationShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

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

async function showLimitedShop(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const halloweenOwned =
    player.inventory.includes(
      "halloween_background"
    );

  const pumpkinOwned =
    player.inventory.includes(
      "pumpkin_cat_decoration"
    );

  await sendText(
    env,
    interaction,
    `🎃 **Limited Halloween Shop**\n\n🎃 Halloween Background — 150 sparkles\n${halloweenOwned ? "✅ Owned" : ""}\n\n🐈 Pumpkin Cat — 250 sparkles\n${pumpkinOwned ? "✅ Owned" : ""}`,
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
          "⬅️ Back",
          "shop",
          2
        )
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
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

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

  if (player.inventory.includes(itemId)) {
    await sendText(
      env,
      interaction,
      `✅ You already own ${item.name}!`
    );
    return;
  }

  if (player.sparkles < item.price) {
    await sendText(
      env,
      interaction,
      `❌ You need **${item.price} sparkles**, but you only have **${player.sparkles}**.`
    );
    return;
  }

  player.sparkles -= item.price;
  player.inventory.push(itemId);

  await savePlayer(env, player);

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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const buttons = [];

  buttons.push(
    button(
      "💖 Pink Sky",
      "equip_theme_cherry",
      player.equipped.theme === "cherry"
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
        player.equipped.theme === "halloween"
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
        player.equipped.theme === "candyland"
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

  const rows = [];

  for (
    let i = 0;
    i < buttons.length;
    i += 5
  ) {
    rows.push(
      row(...buttons.slice(i, i + 5))
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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const buttons = [
    button(
      "🌸 Cherry",
      "equip_tree_cherry",
      player.equipped.tree === "cherry"
        ? 3
        : 2
    )
  ];

  if (
    player.inventory.includes(
      "cotton_candy_tree"
    )
  ) {
    buttons.push(
      button(
        "🍭 Cotton Candy",
        "equip_tree_cotton_candy",
        player.equipped.tree === "cotton_candy"
          ? 3
          : 2
      )
    );
  }

  if (
    player.inventory.includes(
      "stoned_birthday_tree"
    )
  ) {
    buttons.push(
      button(
        "🎂 Birthday",
        "equip_tree_stoned_birthday",
        player.equipped.tree ===
          "stoned_birthday"
          ? 3
          : 2
      )
    );
  }

  await sendText(
    env,
    interaction,
    "🌳 **Tree Customization**",
    [
      row(...buttons),
      row(
        button(
          "⬅️ Back",
          "customize",
          2
        )
      )
    ]
  );
}

async function showCustomDecorations(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

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
      player.equipped.decoration === null
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
      row(...buttons.slice(i, i + 5))
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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

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

  player.equipped.theme = theme;

  await savePlayer(env, player);

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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  const allowed = {
    cherry: true,
    cotton_candy:
      player.inventory.includes(
        "cotton_candy_tree"
      ),
    stoned_birthday:
      player.inventory.includes(
        "stoned_birthday_tree"
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

  player.equipped.tree = tree;

  await savePlayer(env, player);

  await sendText(
    env,
    interaction,
    "🌳 Tree equipped!"
  );
}

async function equipDecoration(
  env,
  interaction,
  decoration
) {
  const user =
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

  if (decoration === null) {
    player.equipped.decoration = null;
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

  await savePlayer(env, player);

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
    await listAllPlayerKeys(env);

  const players = [];

  for (const key of keys) {
    const player =
      await getPlayer(env, key);

    players.push(player);
  }

  players.sort((a, b) => {
    const sparkleDifference =
      b.sparkles - a.sparkles;

    if (sparkleDifference !== 0) {
      return sparkleDifference;
    }

    const levelDifference =
      b.level - a.level;

    if (levelDifference !== 0) {
      return levelDifference;
    }

    return (
      getTreeHeight(b) -
      getTreeHeight(a)
    );
  });

  const top = players.slice(0, 10);

  if (!top.length) {
    await sendText(
      env,
      interaction,
      "🏆 Nobody is on the leaderboard yet!"
    );
    return;
  }

  const lines = top.map(
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
    getUserFromInteraction(interaction);

  const player =
    await getPlayer(env, user.id);

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
      "🐱 Cat Decoration"
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
    `🎒 **Your Inventory**\n\n${items.length ? items.map(x => `• ${x}`).join("\n") : "Empty!"}\n\n⭐ Sparkles: **${player.sparkles}**`,
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

async function handleBirthday(
  env,
  interaction,
  pin = ""
) {
  const user =
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  if (
    String(pin).trim().toUpperCase() !==
    BIRTHDAY_PIN
  ) {
    await sendText(
      env,
      interaction,
      "🎂 **Werewives Birthday Event**\n\nThe birthday surprise is locked! 🔐\n\nUse the correct PIN to unlock the birthday items."
    );
    return;
  }

  player.birthdayUnlocked = true;

  const birthdayItems = [
    "stoned_birthday_tree",
    "stoned_balloon_decoration",
    "stoned_birthday_background"
  ];

  for (const item of birthdayItems) {
    if (!player.inventory.includes(item)) {
      player.inventory.push(item);
    }
  }

  await savePlayer(env, player);

  await sendText(
    env,
    interaction,
    "🎂💖 **HAPPY WEREWIVES BIRTHDAY!** 💖🎂\n\n🔓 The birthday collection has been unlocked!\n\n🌳 Birthday Tree\n🎈 Stoned Balloon\n🎂 Birthday Background\n\nAnd there's a **3-hour Birthday Gift Hunt** starting at **4 PM Eastern** on September 10th! 🎁",
    [
      row(
        button(
          "🎁 Open Birthday Gift",
          "open_birthday_gift",
          1
        )
      ),
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

async function openBirthdayGift(
  env,
  interaction
) {
  const user =
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  if (!player.birthdayUnlocked) {
    await sendText(
      env,
      interaction,
      "🎁 You need to unlock the birthday event first!"
    );
    return;
  }

  if (player.birthdayGiftClaimed) {
    await sendText(
      env,
      interaction,
      "🎁 You already opened your birthday present! 💖"
    );
    return;
  }

  player.birthdayGiftClaimed = true;
  player.sparkles +=
    STONED_GIFT_SPARKLES;

  await savePlayer(env, player);

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
    Math.random() < 0.25;

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
    amount: randomInt(25, 150),
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
    await getGuildState(env, guildId);

  const hunt = state.hunt;

  if (
    !hunt ||
    !hunt.active ||
    !hunt.currentGift ||
    hunt.currentGift.id !== giftId
  ) {
    await sendText(
      env,
      interaction,
      "🎁 That present has already been claimed!"
    );
    return;
  }

  if (Date.now() >= hunt.endAt) {
    hunt.active = false;
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

  if (hunt.currentGift.claimed) {
    await sendText(
      env,
      interaction,
      "🎁 Too late! Someone else got it!"
    );
    return;
  }

  hunt.currentGift.claimed = true;
  hunt.currentGift.claimedBy =
    getUserFromInteraction(
      interaction
    )?.id || "";

  const gift = hunt.currentGift;

  await saveGuildState(
    env,
    guildId,
    state
  );

  const user =
    getUserFromInteraction(interaction);

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
    await getPlayer(env, user.id);

  updatePlayerIdentity(
    player,
    interaction
  );

  player.sparkles +=
    gift.amount;

  await savePlayer(env, player);

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
    await getGuildState(env, guildId);

  const message =
    "🎂🎉 **THE WEREWIVES BIRTHDAY GIFT HUNT HAS BEGUN!** 🎉🎂\n\nFor the next **3 hours**, surprise presents will randomly appear around the server! 🎁\n\nWhen you see one, hit **🎁 Claim Present!**\n\nSome presents contain sparkles...\nSome may be pranks. 👀🦝";

  if (state.announcementChannelId) {
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

  for (const channel of channels) {
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
    await getGuildState(env, guildId);

  if (
    !state.hunt ||
    !state.hunt.active
  ) {
    return;
  }

  let channels = [];

  if (state.announcementChannelId) {
    channels = [
      {
        id: state.announcementChannelId
      }
    ];
  } else {
    channels =
      await getGuildTextChannels(
        env,
        guildId
      );
  }

  if (!channels.length) return;

  const channel =
    channels[
      randomInt(
        0,
        channels.length - 1
      )
    ];

  const gift =
    createHuntGift();

  state.hunt.currentGift = gift;

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
    huntGiftButton(gift.id)
  );

  state.hunt.nextGiftAt =
    Date.now() +
    randomInt(
      8 * 60 * 1000,
      12 * 60 * 1000
    );

  await saveGuildState(
    env,
    guildId,
    state
  );
}

async function getKnownGuildIds(env) {
  const guildIds = [];
  let cursor;

  do {
    const result =
      await env.TREE_DATA.list({
        cursor,
        prefix: "guild:"
      });

    for (const key of result.keys) {
      guildIds.push(
        key.name.substring(6)
      );
    }

    cursor = result.list_complete
      ? undefined
      : result.cursor;
  } while (cursor);

  return guildIds;
}

async function processBirthdayEvent(env) {
  const now = new Date();

  if (!isBirthdayDate(now)) {
    return;
  }

  const p =
    getEasternDateParts(now);

  const currentMinutes =
    p.hour * 60 + p.minute;

  const startMinutes =
    16 * 60;

  const endMinutes =
    19 * 60;

  if (
    currentMinutes < startMinutes ||
    currentMinutes >= endMinutes
  ) {
    return;
  }

  const guildIds =
    await getKnownGuildIds(env);

  for (const guildId of guildIds) {
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
        ((endMinutes - currentMinutes) *
          60 *
          1000);

      state.hunt = {
        active: true,
        startedAt: Date.now(),
        endAt,
        nextGiftAt:
          Date.now() +
          randomInt(
            2 * 60 * 1000,
            5 * 60 * 1000
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
      currentState.hunt.active = false;

      await saveGuildState(
        env,
        guildId,
        currentState
      );

      if (
        currentState.announcementChannelId
      ) {
        await sendChannelMessage(
          env,
          currentState.announcementChannelId,
          "🎂💖 **The Werewives Birthday Gift Hunt has ended!**\n\nThank you for playing! ✨🦝"
        );
      }

      continue;
    }

    if (
      Date.now() >=
        currentState.hunt.nextGiftAt &&
      !currentState.hunt.currentGift
    ) {
      await releaseHuntGift(
        env,
        guildId
      );
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
    member?.permissions || "0";

  let isAdmin = false;

  try {
    isAdmin =
      (BigInt(permissions) & 40n) !==
      0n;
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
  await acknowledge(env, interaction);

  const user =
    getUserFromInteraction(interaction);

  if (!user) return;

  const player =
    await getPlayer(env, user.id);

  updatePlayerIdentity(
    player,
    interaction
  );

  cleanSparkles(player);

  await rememberGuild(
    env,
    interaction.guild_id
  );

  player.sceneMessage = "";

  await savePlayer(env, player);

  try {
    await sendTree(
      env,
      interaction,
      player
    );
  } catch (error) {
    await editOriginalResponse(
      env,
      interaction,
      {
        content:
          `🌳 Your tree is alive, but I couldn't render the picture right now.\n\nError: ${error.message}`,
        components: treeButtons()
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

  if (id === "water") {
    await handleWater(
      env,
      interaction
    );
    return;
  }

  if (id === "catch") {
    await handleCatch(
      env,
      interaction
    );
    return;
  }

  if (id === "daily_riddle") {
    await handleDailyRiddle(
      env,
      interaction
    );
    return;
  }

  if (id === "tree" || id === "back_tree") {
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

  if (id === "shop_backgrounds") {
    await showBackgroundShop(
      env,
      interaction
    );
    return;
  }

  if (id === "shop_trees") {
    await showTreeShop(
      env,
      interaction
    );
    return;
  }

  if (id === "shop_decorations") {
    await showDecorationShop(
      env,
      interaction
    );
    return;
  }

  if (id === "shop_limited") {
    await showLimitedShop(
      env,
      interaction
    );
    return;
  }

  if (id === "shop_special") {
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
      "cat_decoration"
  };

  if (buyMap[id]) {
    await buyItem(
      env,
      interaction,
      buyMap[id]
    );
    return;
  }

  if (id === "customize") {
    await showCustomize(
      env,
      interaction
    );
    return;
  }

  if (id === "custom_backgrounds") {
    await showCustomBackgrounds(
      env,
      interaction
    );
    return;
  }

  if (id === "custom_trees") {
    await showCustomTrees(
      env,
      interaction
    );
    return;
  }

  if (id === "custom_decorations") {
    await showCustomDecorations(
      env,
      interaction
    );
    return;
  }

  if (id.startsWith("equip_theme_")) {
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

  if (id.startsWith("equip_tree_")) {
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

  if (id === "leaderboard") {
    await showLeaderboard(
      env,
      interaction
    );
    return;
  }

  if (id === "open_birthday_gift") {
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
        "claim_hunt_gift:".length
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

async function handleCommand(
  env,
  interaction
) {
  const name =
    interaction.data?.name;

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

  if (name === "daily-riddle") {
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

  if (name === "shop") {
    await showShop(
      env,
      interaction
    );
    return;
  }

  if (name === "customize") {
    await showCustomize(
      env,
      interaction
    );
    return;
  }

  if (name === "inventory") {
    await showInventory(
      env,
      interaction
    );
    return;
  }

  if (name === "leaderboard") {
    await showLeaderboard(
      env,
      interaction
    );
    return;
  }

  if (name === "birthday") {
    await handleBirthday(
      env,
      interaction,
      getOption(
        interaction,
        "pin"
      )
    );
    return;
  }

  if (name === "announcements") {
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

  if (name === "rename") {
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

    const newName =
      getOption(
        interaction,
        "name"
      );

    if (
      !newName ||
      String(newName).length > 40
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

  if (name === "give-sparkles") {
    const user =
      getUserFromInteraction(
        interaction
      );

    if (!user) return;

    if (
      user.id !== env.OWNER_ID
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
      !Number.isFinite(amount) ||
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
    name: "tree",
    description: "View your tree"
  },

  {
    name: "water",
    description: "Water your tree"
  },

  {
    name: "catch",
    description: "Catch sparkles from your tree"
  },

  {
    name: "daily-riddle",
    description: "Get or answer today's riddle",
    options: [
      {
        type: 3,
        name: "answer",
        description: "Your answer",
        required: false
      }
    ]
  },

  {
    name: "shop",
    description: "Open the tree shop"
  },

  {
    name: "customize",
    description: "Customize your tree"
  },

  {
    name: "inventory",
    description: "View your inventory"
  },

  {
    name: "leaderboard",
    description: "View the tree leaderboard"
  },

  {
    name: "birthday",
    description: "Unlock the Werewives birthday event",
    options: [
      {
        type: 3,
        name: "pin",
        description: "Birthday PIN",
        required: false
      }
    ]
  },

  {
    name: "announcements",
    description: "Set the Werewives announcement channel",
    options: [
      {
        type: 7,
        name: "channel",
        description: "Channel for chaos and event announcements",
        required: true,
        channel_types: [0]
      }
    ]
  },

  {
    name: "rename",
    description: "Rename your tree",
    options: [
      {
        type: 3,
        name: "name",
        description: "New tree name",
        required: true,
        max_length: 40
      }
    ]
  },

  {
    name: "give-sparkles",
    description: "Give a user sparkles",
    options: [
      {
        type: 6,
        name: "user",
        description: "User receiving sparkles",
        required: true
      },
      {
        type: 4,
        name: "amount",
        description: "Amount of sparkles",
        required: true,
        min_value: 1
      }
    ]
  }
];

/* =========================================================
   REGISTER COMMANDS
========================================================= */

async function registerCommands(env) {
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

function hexToUint8Array(hex) {
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
        hex.substr(i * 2, 2),
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
    await request.clone().text();

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
  async fetch(request, env) {
    const url =
      new URL(request.url);

    if (
      request.method === "GET" &&
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

    if (
      request.method !== "POST" ||
      url.pathname !== "/interactions"
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

    if (interaction.type === 1) {
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
        await sendText(
          env,
          interaction,
          `❌ Something went wrong: ${error.message}`
        );
      } catch {}

      return new Response(
        "OK",
        {
          status: 200
        }
      );
    }
  },

  async scheduled(
    event,
    env,
    ctx
  ) {
    ctx.waitUntil(
      processBirthdayEvent(env)
    );
  }
};
