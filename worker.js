// ============================================================
// 🌳 PUBLIC DISCORD TREE BOT
// Grow • Water • Catch Sparkles • Customize • Shop
// ============================================================
//
// ENVIRONMENT VARIABLES / SECRETS:
//
// BOT_TOKEN   = Discord Bot Token
// CLIENT_ID   = Discord Application ID
// PUBLIC_KEY  = Discord Application Public Key
//
// CLOUDFLARE KV binding:
// TREE_DATA
//
// OPTIONAL:
// ASSET_BASE_URL = URL where your tree images will eventually live
//
// ============================================================

const EXP_PER_WATER = 10;
const WATER_COOLDOWN = 60 * 60 * 1000; // 1 hour
const SPARKLE_CHANCE = 0.20;
const SPARKLE_LIFETIME = 5 * 60 * 1000;

// ============================================================
// 🌳 TREE GROWTH STAGES
// ============================================================

const TREE_STAGES = [
  {
    level: 1,
    name: "Seedling",
    image: "tree_seedling.png"
  },
  {
    level: 5,
    name: "Young Tree",
    image: "tree_young.png"
  },
  {
    level: 10,
    name: "Growing Tree",
    image: "tree_growing.png"
  },
  {
    level: 20,
    name: "Mature Tree",
    image: "tree_mature.png"
  },
  {
    level: 35,
    name: "Enchanted Tree",
    image: "tree_enchanted.png"
  },
  {
    level: 50,
    name: "Legendary Tree",
    image: "tree_legendary.png"
  }
];

// ============================================================
// 🛍️ SHOP
// ============================================================

const SHOP = {

  fertilizer: [

    {
      id: "basic_fertilizer",
      name: "Basic Fertilizer",
      emoji: "🌱",
      price: 100,
      exp: 25,
      description: "+25 EXP"
    },

    {
      id: "super_fertilizer",
      name: "Super Fertilizer",
      emoji: "🌿",
      price: 350,
      exp: 100,
      description: "+100 EXP"
    },

    {
      id: "royal_fertilizer",
      name: "Royal Fertilizer",
      emoji: "👑",
      price: 750,
      exp: 300,
      description: "+300 EXP"
    }

  ],

  backgrounds: [

    {
      id: "pink_sky",
      name: "Pink Sky",
      emoji: "🌸",
      price: 500
    },

    {
      id: "moonlit",
      name: "Moonlit Night",
      emoji: "🌙",
      price: 750
    },

    {
      id: "enchanted_forest",
      name: "Enchanted Forest",
      emoji: "🧚",
      price: 1000
    },

    {
      id: "winter_wonderland",
      name: "Winter Wonderland",
      emoji: "❄️",
      price: 1250
    },

    {
      id: "sunset_lake",
      name: "Sunset Lake",
      emoji: "🌅",
      price: 1500
    },

    {
      id: "candy_land",
      name: "Candy Land",
      emoji: "🍭",
      price: 2000
    }

  ],

  tree_types: [

    {
      id: "cherry",
      name: "Cherry Blossom",
      emoji: "🌸",
      price: 1000
    },

    {
      id: "willow",
      name: "Moon Willow",
      emoji: "🌿",
      price: 1500
    },

    {
      id: "rainbow",
      name: "Rainbow Tree",
      emoji: "🌈",
      price: 2500
    },

    {
      id: "moonlight",
      name: "Moonlight Tree",
      emoji: "🌙",
      price: 3000
    },

    {
      id: "crystal",
      name: "Crystal Tree",
      emoji: "💎",
      price: 4000
    }

  ],

  decorations: [

    {
      id: "pink_bench",
      name: "Pink Bench",
      emoji: "🩷",
      price: 500
    },

    {
      id: "mushroom",
      name: "Cute Mushroom",
      emoji: "🍄",
      price: 400
    },

    {
      id: "birdhouse",
      name: "Birdhouse",
      emoji: "🏠",
      price: 600
    },

    {
      id: "fairy_lantern",
      name: "Fairy Lantern",
      emoji: "🏮",
      price: 800
    },

    {
      id: "butterfly",
      name: "Butterfly",
      emoji: "🦋",
      price: 750
    },

    {
      id: "garden_cat",
      name: "Garden Cat",
      emoji: "🐱",
      price: 1200
    },

    {
      id: "fountain",
      name: "Fairy Fountain",
      emoji: "⛲",
      price: 1800
    },

    {
      id: "fairy_house",
      name: "Fairy House",
      emoji: "🏡",
      price: 2500
    }

  ],

  effects: [

    {
      id: "sparkles",
      name: "Sparkles",
      emoji: "✨",
      price: 1000
    },

    {
      id: "floating_hearts",
      name: "Floating Hearts",
      emoji: "💖",
      price: 1250
    },

    {
      id: "butterfly_effect",
      name: "Butterfly Effect",
      emoji: "🦋",
      price: 1500
    },

    {
      id: "stardust",
      name: "Stardust",
      emoji: "🌟",
      price: 2000
    },

    {
      id: "rainbow_glow",
      name: "Rainbow Glow",
      emoji: "🌈",
      price: 3000
    }

  ],

  cosmetics: [

    {
      id: "tiny_crown",
      name: "Tiny Crown",
      emoji: "👑",
      price: 2000
    },

    {
      id: "heart_lights",
      name: "Heart Lights",
      emoji: "💕",
      price: 1750
    },

    {
      id: "moon_charm",
      name: "Moon Charm",
      emoji: "🌙",
      price: 2200
    },

    {
      id: "flower_crown",
      name: "Flower Crown",
      emoji: "🌺",
      price: 2500
    },

    {
      id: "fairy_wings",
      name: "Fairy Wings",
      emoji: "🧚",
      price: 3500
    }

  ]

};

// ============================================================
// 👤 DEFAULT PLAYER
// ============================================================

function newPlayer(id, username) {

  return {

    id,

    username,

    name: "My Tree",

    level: 1,

    exp: 0,

    sparkles: 0,

    waterCount: 0,
lastWatered: 0,

sparkle: null,

    inventory: {

      backgrounds: [
        "pink_sky"
      ],

      tree_types: [
        "cherry"
      ],

      decorations: [],

      effects: [],

      cosmetics: []

    },

    equipped: {

      background: "pink_sky",

      tree_type: "cherry",

      decoration: null,

      effect: null,

      cosmetic: null

    },

    createdAt: Date.now()

  };

}

// ============================================================
// 💾 PLAYER STORAGE
// ============================================================

async function getPlayer(env, id, username) {

  const key = `player:${id}`;

  const stored = await env.TREE_DATA.get(key);

  if (!stored) {

    const player = newPlayer(id, username);

    await savePlayer(env, player);

    return player;

  }

  const player = JSON.parse(stored);

  player.username = username || player.username;

  return player;

}

async function savePlayer(env, player) {

  await env.TREE_DATA.put(
    `player:${player.id}`,
    JSON.stringify(player)
  );

}

// ============================================================
// ⭐ EXPERIENCE
// ============================================================

function expRequired(level) {

  return 100 + ((level - 1) * 75);

}

function addExp(player, amount) {

  let leveledUp = false;

  player.exp += amount;

  while (player.exp >= expRequired(player.level)) {

    player.exp -= expRequired(player.level);

    player.level++;

    leveledUp = true;

  }

  return leveledUp;

}

function getStage(level) {

  let stage = TREE_STAGES[0];

  for (const item of TREE_STAGES) {

    if (level >= item.level) {

      stage = item;

    }

  }

  return stage;

}

// ============================================================
// 🖼️ TREE IMAGE
// ============================================================

function treeImage(env, player) {

  const stage = getStage(player.level);

  if (!env.ASSET_BASE_URL) {

    return null;

  }

  return `${env.ASSET_BASE_URL}/${stage.image}`;

}

// ============================================================
// ✨ RANDOM SPARKLE
// ============================================================

function spawnSparkle(player) {

  if (player.sparkle) {

    if (
      Date.now() - player.sparkle.time <
      SPARKLE_LIFETIME
    ) {

      return false;

    }

    player.sparkle = null;

  }

  if (Math.random() > SPARKLE_CHANCE) {

    return false;

  }

  const sparkles = [

    {
      name: "Pink Sparkle",
      emoji: "💖",
      amount: 15
    },

    {
      name: "Rainbow Sparkle",
      emoji: "🌈",
      amount: 25
    },

    {
      name: "Moon Sparkle",
      emoji: "🌙",
      amount: 35
    },

    {
      name: "Rare Star",
      emoji: "🌟",
      amount: 75
    }

  ];

  const sparkle =
    sparkles[
      Math.floor(
        Math.random() * sparkles.length
      )
    ];

  player.sparkle = {

    ...sparkle,

    time: Date.now()

  };

  return true;

}

// ============================================================
// 🌳 TREE EMBED
// ============================================================

function treeEmbed(env, player) {

  const stage = getStage(player.level);

  const needed = expRequired(player.level);

  const percent = Math.floor(
    (player.exp / needed) * 100
  );

  const filled = Math.floor(percent / 10);

  const bar =
    "▰".repeat(filled) +
    "▱".repeat(10 - filled);

  const embed = {

    title:
      `🌳 ${player.name}`,

    description:

      `**${stage.name}**\n\n` +

      `✨ Level **${player.level}**\n` +

      `${bar} ${percent}%\n` +

      `⭐ ${player.exp} / ${needed} EXP\n\n` +

      `💧 Watered **${player.waterCount}** times\n` +

      `💎 Sparkles: **${player.sparkles}**\n\n` +

      `🌸 Background: **${pretty(player.equipped.background)}**\n` +

      `🌳 Tree: **${pretty(player.equipped.tree_type)}**\n` +

      `🪴 Decoration: **${pretty(player.equipped.decoration)}**\n` +

      `✨ Effect: **${pretty(player.equipped.effect)}**\n` +

      `💖 Cosmetic: **${pretty(player.equipped.cosmetic)}**`,

    color: 0xff9edb,

    footer: {

      text:
        "✨ Grow • Collect • Customize • Make it yours ✨"

    }

  };

  const image = treeImage(env, player);

  if (image) {

    embed.image = {
      url: image
    };

  }

  return embed;

}

// ============================================================
// 🔤 ITEM NAME
// ============================================================

function pretty(id) {

  if (!id) {

    return "None";

  }

  for (const category of Object.values(SHOP)) {

    const item = category.find(
      x => x.id === id
    );

    if (item) {

      return item.name;

    }

  }

  return id
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      c => c.toUpperCase()
    );

}

// ============================================================
// 🔘 BUTTON
// ============================================================

function btn(label, id, style = 2) {

  return {

    type: 2,

    style,

    label,

    custom_id: id

  };

}

// ============================================================
// 🌳 TREE BUTTONS
// ============================================================

function treeButtons() {

  return [

    {

      type: 1,

      components: [

        btn("💧 Water", "water", 1),

        btn("✨ Catch", "catch", 1),

        btn("🛍️ Shop", "shop", 3),

        btn("🎨 Customize", "customize", 2)

      ]

    },

    {

      type: 1,

      components: [

        btn("🎒 Inventory", "inventory"),

        btn("🏆 Leaderboard", "leaderboard")

      ]

    }

  ];

}

// ============================================================
// 🛍️ SHOP
// ============================================================

function shopButtons() {

  return [

    {

      type: 1,

      components: [

        btn("🌱 Fertilizer", "shop:fertilizer", 1),

        btn("🌸 Backgrounds", "shop:backgrounds", 1),

        btn("🌳 Trees", "shop:tree_types", 1)

      ]

    },

    {

      type: 1,

      components: [

        btn("🪴 Decorations", "shop:decorations", 1),

        btn("✨ Effects", "shop:effects", 1),

        btn("💖 Cosmetics", "shop:cosmetics", 1)

      ]

    },

    {

      type: 1,

      components: [

        btn("🌳 Back to Tree", "tree")

      ]

    }

  ];

}

function shopEmbed() {

  return {

    title:
      "🛍️ Tree Shop",

    description:

      "Spend your 💎 **sparkles** on goodies for your tree!\n\n" +

      "🌱 **Fertilizer**\n" +
      "Grow your tree faster.\n\n" +

      "🌸 **Backgrounds**\n" +
      "Change the world around your tree.\n\n" +

      "🌳 **Tree Types**\n" +
      "Unlock different tree styles.\n\n" +

      "🪴 **Decorations**\n" +
      "Add cute things to your garden.\n\n" +

      "✨ **Effects**\n" +
      "Make your tree magical.\n\n" +

      "💖 **Cosmetics**\n" +
      "Give your tree extra personality!",

    color: 0xff9edb

  };

}

// ============================================================
// 🛒 SHOP CATEGORY
// ============================================================

function shopCategory(category) {

  const items = SHOP[category] || [];

  return {

    title:
      `🛍️ ${pretty(category)}`,

    description:

      items.map(

        (item, i) =>

          `**${i + 1}. ${item.emoji} ${item.name}**\n` +

          `💎 ${item.price} sparkles` +

          (
            item.description
              ? `\n${item.description}`
              : ""
          )

      ).join("\n\n"),

    color: 0xff9edb

  };

}

function shopCategoryButtons(category) {

  const items = SHOP[category] || [];

  const rows = [];

  for (
    let i = 0;
    i < items.length;
    i += 3
  ) {

    rows.push({

      type: 1,

      components:
        items
          .slice(i, i + 3)
          .map(
            item =>
              btn(
                `${item.emoji} ${item.name}`,
                `buy:${category}:${item.id}`,
                1
              )
          )

    });

  }

  rows.push({

    type: 1,

    components: [

      btn(
        "⬅️ Shop",
        "shop"
      )

    ]

  });

  return rows;

}

// ============================================================
// 🎨 CUSTOMIZATION
// ============================================================

function customizeEmbed(player) {

  return {

    title:
      "🎨 Customize Your Tree",

    description:

      `🌸 Background: **${pretty(player.equipped.background)}**\n` +

      `🌳 Tree Type: **${pretty(player.equipped.tree_type)}**\n` +

      `🪴 Decoration: **${pretty(player.equipped.decoration)}**\n` +

      `✨ Effect: **${pretty(player.equipped.effect)}**\n` +

      `💖 Cosmetic: **${pretty(player.equipped.cosmetic)}**\n\n` +

      "Choose what you want to customize!",

    color: 0xff9edb

  };

}

function customizeButtons() {

  return [

    {

      type: 1,

      components: [

        btn(
          "🌸 Background",
          "custom:backgrounds"
        ),

        btn(
          "🌳 Tree",
          "custom:tree_types"
        )

      ]

    },

    {

      type: 1,

      components: [

        btn(
          "🪴 Decoration",
          "custom:decorations"
        ),

        btn(
          "✨ Effect",
          "custom:effects"
        ),

        btn(
          "💖 Cosmetic",
          "custom:cosmetics"
        )

      ]

    },

    {

      type: 1,

      components: [

        btn(
          "🌳 Back",
          "tree"
        )

      ]

    }

  ];

}

// ============================================================
// 🎒 INVENTORY
// ============================================================

function inventoryEmbed(player) {

  let text =
    `💎 **Sparkles:** ${player.sparkles}\n\n`;

  for (const category of Object.keys(player.inventory)) {

    const items = player.inventory[category];

    text +=
      `**${pretty(category)}**\n`;

    if (!items.length) {

      text +=
        "Nothing yet.\n\n";

    } else {

      text +=
        items
          .map(
            x =>
              `• ${pretty(x)}`
          )
          .join("\n") +
        "\n\n";

    }

  }

  return {

    title:
      "🎒 Your Inventory",

    description:
      text,

    color: 0xff9edb

  };

}

// ============================================================
// 💧 WATER
// ============================================================

async function water(
  env,
  interaction,
  edit = false
) {

  const user =
    interaction.member?.user ||
    interaction.user;

const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

// Check watering cooldown
const now = Date.now();

if (
  player.lastWatered &&
  now - player.lastWatered < WATER_COOLDOWN
) {

  const remaining =
    WATER_COOLDOWN -
    (now - player.lastWatered);

  const minutes =
    Math.ceil(
      remaining / 60000
    );

  return updateOriginal(
    env,
    interaction,
    {

      content:
        `💧 **${player.name}** has already been watered!\n\n` +
        `⏰ You can water your tree again in **${minutes} minute${minutes === 1 ? "" : "s"}**. 🌸`,

      embeds: [
        treeEmbed(env, player)
      ],

      components:
        treeButtons()

    }
  );

}

const leveled =
  addExp(
    player,
    EXP_PER_WATER
  );

player.lastWatered = now;

  player.waterCount++;

  const sparkle =
    spawnSparkle(player);

  await savePlayer(
    env,
    player
  );

  let message =
    `💧 **${player.name}** has been watered!\n\n` +
    `⭐ +${EXP_PER_WATER} EXP`;

  if (leveled) {

    message +=
      `\n\n🎉 **LEVEL UP!**\n` +
      `Your tree is now **Level ${player.level}**! 🌳`;

  }

  if (sparkle) {

    message +=
      `\n\n✨ **A SPARKLE APPEARED!**\n` +
      `Quick! Use **/catch** to collect it!`;

  }

  const data = {

    content: message,

    embeds: [
      treeEmbed(env, player)
    ],

    components:
      treeButtons()

  };

  return updateOriginal(
    env,
    interaction,
    data
  );

}

// ============================================================
// ✨ CATCH
// ============================================================

async function catchSparkle(
  env,
  interaction
) {

  const user =
    interaction.member?.user ||
    interaction.user;

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  if (!player.sparkle) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          "✨ No sparkle is waiting for you right now!\n" +
          "Keep watering your tree. 🌳",

        embeds: [],
        components: treeButtons()

      }
    );

  }

  if (
    Date.now() -
    player.sparkle.time >
    SPARKLE_LIFETIME
  ) {

    player.sparkle = null;

    await savePlayer(
      env,
      player
    );

    return updateOriginal(
      env,
      interaction,
      {

        content:
          "💨 The sparkle disappeared!\n" +
          "Keep watering to find another one.",

        embeds: [],
        components: treeButtons()

      }
    );

  }

  const sparkle =
    player.sparkle;

  player.sparkles +=
    sparkle.amount;

  player.sparkle = null;

  await savePlayer(
    env,
    player
  );

  return updateOriginal(
    env,
    interaction,
    {

      content:

        `${sparkle.emoji} **You caught a ${sparkle.name}!**\n\n` +

        `💎 +${sparkle.amount} sparkles\n` +

        `💎 Balance: **${player.sparkles}**`,

      embeds: [
        treeEmbed(env, player)
      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 🛒 BUY
// ============================================================

async function buy(
  env,
  interaction,
  category,
  itemId
) {

  const user =
    interaction.member?.user ||
    interaction.user;

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  const item =
    SHOP[category]?.find(
      x => x.id === itemId
    );

  if (!item) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          "❌ Item not found.",

        embeds: [],
        components: treeButtons()

      }
    );

  }

  if (category === "fertilizer") {

    if (
      player.sparkles <
      item.price
    ) {

      return updateOriginal(
        env,
        interaction,
        {

          content:
            `💎 You need ${item.price} sparkles.`,

          embeds: [],
          components: treeButtons()

        }
      );

    }

    player.sparkles -=
      item.price;

    const leveled =
      addExp(
        player,
        item.exp
      );

    await savePlayer(
      env,
      player
    );

    return updateOriginal(
      env,
      interaction,
      {

        content:

          `🌱 You used **${item.name}**!\n\n` +

          `⭐ +${item.exp} EXP\n` +

          (
            leveled
              ? `🎉 Level Up! You're now Level ${player.level}!`
              : ""
          ),

        embeds: [
          treeEmbed(env, player)
        ],

        components:
          treeButtons()

      }
    );

  }

  if (
    player.inventory[category]
      .includes(itemId)
  ) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          `💕 You already own **${item.name}**!`,

        embeds: [],
        components: treeButtons()

      }
    );

  }

  if (
    player.sparkles <
    item.price
  ) {

    return updateOriginal(
      env,
      interaction,
      {

        content:

          `💎 You need **${item.price}** sparkles.\n` +

          `You have **${player.sparkles}**.`,

        embeds: [],
        components: treeButtons()

      }
    );

  }

  player.sparkles -=
    item.price;

  player.inventory[category]
    .push(itemId);

  await savePlayer(
    env,
    player
  );

  return updateOriginal(
    env,
    interaction,
    {

      content:

        `🎉 **Purchased!**\n\n` +

        `${item.emoji} ${item.name}\n` +

        `💎 -${item.price} sparkles\n` +

        `💎 Balance: ${player.sparkles}`,

      embeds: [
        treeEmbed(env, player)
      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 🎨 CUSTOMIZE CATEGORY
// ============================================================

async function customizeCategory(
  env,
  interaction,
  category
) {

  const user =
    interaction.member?.user ||
    interaction.user;

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  const owned =
    player.inventory[category] || [];

  if (!owned.length) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          `💕 You don't own anything in this category yet!\n\n` +
          `Visit **/shop** to unlock some.`,

        embeds: [],
        components: treeButtons()

      }
    );

  }

  const options =
    owned
      .map(id => {

        const item =
          SHOP[category].find(
            x => x.id === id
          );

        return {

          label:
            item?.name || id,

          value:
            id,

          description:
            `Equip ${item?.name || id}`

        };

      })
      .slice(0, 25);

  return updateOriginal(
    env,
    interaction,
    {

      embeds: [

        {

          title:
            `🎨 Choose ${pretty(category)}`,

          description:
            "Choose an item to equip.",

          color: 0xff9edb

        }

      ],

      components: [

        {

          type: 1,

          components: [

            {

              type: 3,

              custom_id:
                `equip:${category}`,

              placeholder:
                "Choose an item...",

              options

            }

          ]

        },

        {

          type: 1,

          components: [

            btn(
              "⬅️ Back",
              "customize"
            )

          ]

        }

      ]

    }
  );

}

// ============================================================
// ✨ EQUIP
// ============================================================

async function equip(
  env,
  interaction,
  category,
  itemId
) {

  const user =
    interaction.member?.user ||
    interaction.user;

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  if (
    !player.inventory[category] ||
    !player.inventory[category].includes(itemId)
  ) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          "❌ You don't own that item.",

        embeds: [],
        components: treeButtons()

      }
    );

  }

  const slots = {

    backgrounds:
      "background",

    tree_types:
      "tree_type",

    decorations:
      "decoration",

    effects:
      "effect",

    cosmetics:
      "cosmetic"

  };

  player.equipped[
    slots[category]
  ] = itemId;

  await savePlayer(
    env,
    player
  );

  return updateOriginal(
    env,
    interaction,
    {

      content:
        `✨ Equipped **${pretty(itemId)}**!`,

      embeds: [
        treeEmbed(env, player)
      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 🏆 LEADERBOARD
// ============================================================

async function leaderboard(
  env,
  interaction
) {

  const result =
    await env.TREE_DATA.list({
      prefix: "player:",
      limit: 100
    });

  const players = [];

  for (
    const key of result.keys
  ) {

    const stored =
      await env.TREE_DATA.get(
        key.name
      );

    if (!stored) continue;

    try {

      players.push(
        JSON.parse(stored)
      );

    } catch {}

  }

  players.sort(
    (a, b) =>
      b.level - a.level ||
      b.exp - a.exp
  );

  const top =
    players.slice(0, 10);

  let description = "";

  if (!top.length) {

    description =
      "No trees have been grown yet! 🌱";

  } else {

    description =
      top
        .map(
          (p, i) => {

            const medal =
              ["🥇", "🥈", "🥉"][i] ||
              `**${i + 1}.**`;

            return (
              `${medal} **${p.name}** — ` +
              `Level ${p.level} 🌳`
            );

          }
        )
        .join("\n");

  }

  return updateOriginal(
    env,
    interaction,
    {

      embeds: [

        {

          title:
            "🏆 Tree Leaderboard",

          description,

          color:
            0xff9edb

        }

      ],

      components: [

        {

          type: 1,

          components: [

            btn(
              "🌳 My Tree",
              "tree"
            )

          ]

        }

      ]

    }
  );

}

// ============================================================
// ✏️ RENAME
// ============================================================

async function renameTree(
  env,
  interaction
) {

  const user =
    interaction.member?.user ||
    interaction.user;

  const option =
    interaction.data.options?.find(
      x => x.name === "name"
    );

  const name =
    String(option?.value || "")
      .trim()
      .slice(0, 50);

  if (!name) {

    return updateOriginal(
      env,
      interaction,
      {

        content:
          "❌ Please give your tree a name.",

        embeds: [],
        components: treeButtons()

      }
    );

  }

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  player.name = name;

  await savePlayer(
    env,
    player
  );

  return updateOriginal(
    env,
    interaction,
    {

      content:
        `🌸 Your tree is now called **${name}**!`,

      embeds: [
        treeEmbed(env, player)
      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 📋 SLASH COMMAND REGISTRATION
// ============================================================

async function registerCommands(env) {

  const commands = [

    {
      name: "tree",
      description: "View your tree"
    },

    {
      name: "water",
      description: "Water your tree and earn EXP"
    },

    {
      name: "catch",
      description: "Catch a sparkle if one is available"
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
      name: "rename",
      description: "Rename your tree",

      options: [

        {
          name: "name",
          description: "The new name for your tree",
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

          "Authorization":
            `Bot ${env.BOT_TOKEN}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(commands)

      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      "Discord command registration failed:",
      errorText
    );

    return {
      success: false,
      error: errorText
    };

  }

  return {
    success: true
  };

}

// ============================================================
// 🔐 DISCORD SIGNATURE VERIFICATION
// ============================================================

function hexBytes(hex) {

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

async function verifyRequest(
  request,
  env,
  body
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

  try {

    const message =
      new TextEncoder().encode(
        timestamp + body
      );

    const key =
      await crypto.subtle.importKey(

        "raw",

        hexBytes(
          env.PUBLIC_KEY
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

      hexBytes(signature),

      message

    );

  } catch (error) {

    console.error(
      "Signature verification error:",
      error
    );

    return false;

  }

}

// ============================================================
// 📡 DISCORD ORIGINAL MESSAGE UPDATE
// ============================================================

async function updateOriginal(
  env,
  interaction,
  data
) {

  const response =
    await fetch(

      `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,

      {

        method: "PATCH",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(data)

      }

    );

  return response;

}

// ============================================================
// 🎮 HANDLE SLASH COMMANDS
// ============================================================

async function handleCommand(
  env,
  interaction
) {

  const command =
    interaction.data.name;

  if (command === "tree") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          treeEmbed(env, player)
        ],

        components:
          treeButtons()

      }
    );

  }

  if (command === "water") {

    return water(
      env,
      interaction
    );

  }

  if (command === "catch") {

    return catchSparkle(
      env,
      interaction
    );

  }

  if (command === "shop") {

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          shopEmbed()
        ],

        components:
          shopButtons()

      }
    );

  }

  if (command === "customize") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          customizeEmbed(player)
        ],

        components:
          customizeButtons()

      }
    );

  }

  if (command === "inventory") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          inventoryEmbed(player)
        ],

        components: [

          {

            type: 1,

            components: [

              btn(
                "🌳 My Tree",
                "tree"
              )

            ]

          }

        ]

      }
    );

  }

  if (command === "leaderboard") {

    return leaderboard(
      env,
      interaction
    );

  }

  if (command === "rename") {

    return renameTree(
      env,
      interaction
    );

  }

  return updateOriginal(
    env,
    interaction,
    {

      content:
        "❌ Unknown command.",

      embeds: [],
      components: []

    }
  );

}

// ============================================================
// 🔘 HANDLE BUTTONS
// ============================================================

async function handleButton(
  env,
  interaction
) {

  const id =
    interaction.data.custom_id;

  if (id === "tree") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [
          treeEmbed(env, player)
        ],

        components:
          treeButtons()

      }
    );

  }

  if (id === "water") {

    return water(
      env,
      interaction,
      true
    );

  }

  if (id === "catch") {

    return catchSparkle(
      env,
      interaction
    );

  }

  if (id === "shop") {

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          shopEmbed()
        ],

        components:
          shopButtons()

      }
    );

  }

  if (id === "customize") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          customizeEmbed(player)
        ],

        components:
          customizeButtons()

      }
    );

  }

  if (id === "inventory") {

    const user =
      interaction.member?.user ||
      interaction.user;

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          inventoryEmbed(player)
        ],

        components: [

          {

            type: 1,

            components: [

              btn(
                "🌳 My Tree",
                "tree"
              )

            ]

          }

        ]

      }
    );

  }

  if (id === "leaderboard") {

    return leaderboard(
      env,
      interaction
    );

  }

  if (id.startsWith("shop:")) {

    const category =
      id.split(":")[1];

    return updateOriginal(
      env,
      interaction,
      {

        embeds: [
          shopCategory(category)
        ],

        components:
          shopCategoryButtons(category)

      }
    );

  }

  if (id.startsWith("buy:")) {

    const [
      ,
      category,
      itemId
    ] =
      id.split(":");

    return buy(
      env,
      interaction,
      category,
      itemId
    );

  }

  if (id.startsWith("custom:")) {

    const category =
      id.split(":")[1];

    return customizeCategory(
      env,
      interaction,
      category
    );

  }

  return updateOriginal(
    env,
    interaction,
    {

      content:
        "❌ Unknown button.",

      embeds: [],
      components: treeButtons()

    }
  );

}

// ============================================================
// 📋 SELECT MENUS
// ============================================================

async function handleSelect(
  env,
  interaction
) {

  const id =
    interaction.data.custom_id;

  if (id.startsWith("equip:")) {

    const category =
      id.split(":")[1];

    const itemId =
      interaction.data.values[0];

    return equip(
      env,
      interaction,
      category,
      itemId
    );

  }

  return updateOriginal(
    env,
    interaction,
    {

      content:
        "❌ Unknown selection.",

      embeds: [],
      components: treeButtons()

    }
  );

}

// ============================================================
// 🚀 WORKER
// ============================================================

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(request.url);

    // --------------------------------------------------------
    // HEALTH CHECK
    // --------------------------------------------------------

    if (
      request.method === "GET" &&
      url.pathname === "/"
    ) {

      return new Response(
        "🌳 Tree Bot is alive! ✨",
        {

          headers: {

            "Content-Type":
              "text/plain; charset=utf-8"

          }

        }
      );

    }

    // --------------------------------------------------------
    // GLOBAL COMMAND REGISTRATION
    // --------------------------------------------------------

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {

      try {

        const result =
          await registerCommands(env);

        if (!result.success) {

          return new Response(

            `❌ Command registration failed.\n\n${result.error}`,

            {

              status: 500,

              headers: {

                "Content-Type":
                  "text/plain; charset=utf-8"

              }

            }

          );

        }

        return new Response(
          "🌳 Global slash commands registered!",
          {

            status: 200,

            headers: {

              "Content-Type":
                "text/plain; charset=utf-8"

            }

          }
        );

      } catch (error) {

        return new Response(

          `❌ Registration crashed.\n\n${error.stack || error.message || error}`,

          {

            status: 500,

            headers: {

              "Content-Type":
                "text/plain; charset=utf-8"

            }

          }

        );

      }

    }

    // --------------------------------------------------------
    // ONLY DISCORD POST REQUESTS CONTINUE BELOW
    // --------------------------------------------------------

    if (
      request.method !== "POST"
    ) {

      return new Response(
        "Not Found",
        {
          status: 404
        }
      );

    }

    // --------------------------------------------------------
    // READ DISCORD REQUEST
    // --------------------------------------------------------

    const body =
      await request.text();

    // --------------------------------------------------------
    // VERIFY DISCORD SIGNATURE
    // --------------------------------------------------------

    const valid =
      await verifyRequest(
        request,
        env,
        body
      );

    if (!valid) {

      return new Response(
        "Invalid signature.",
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
        "Invalid JSON.",
        {
          status: 400
        }
      );

    }

    // --------------------------------------------------------
    // DISCORD PING / ENDPOINT VERIFICATION
    // --------------------------------------------------------

    if (
      interaction.type === 1
    ) {

      return new Response(

        JSON.stringify({
          type: 1
        }),

        {

          status: 200,

          headers: {

            "Content-Type":
              "application/json"

          }

        }

      );

    }

    // --------------------------------------------------------
    // 🚨 IMPORTANT:
    // ACKNOWLEDGE DISCORD IMMEDIATELY
    // --------------------------------------------------------
    //
    // This is the part that fixes:
    //
    // "This application did not respond"
    //
    // Discord requires an interaction acknowledgement
    // within a few seconds.
    //
    // We acknowledge BEFORE touching KV or doing other work.
    // --------------------------------------------------------

    if (
      interaction.type === 2
    ) {

      try {

        const acknowledge =
          await fetch(

            `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  type: 5

                })

            }

          );

        if (!acknowledge.ok) {

          console.error(
            "Discord acknowledgement failed:",
            await acknowledge.text()
          );

          return new Response(
            "Discord acknowledgement failed.",
            {
              status: 500
            }
          );

        }

      } catch (error) {

        console.error(
          "Discord acknowledgement error:",
          error
        );

        return new Response(
          "Discord acknowledgement failed.",
          {
            status: 500
          }
        );

      }

      // Now that Discord has acknowledged the command,
      // safely perform the slower work.

      try {

        return await handleCommand(
          env,
          interaction
        );

      } catch (error) {

        console.error(
          "Command error:",
          error
        );

        return updateOriginal(
          env,
          interaction,
          {

            content:
              "❌ Something went wrong while growing your tree. 🌳",

            embeds: [],
            components: treeButtons()

          }
        );

      }

    }

    // --------------------------------------------------------
    // BUTTONS / SELECT MENUS
    // --------------------------------------------------------

    if (
      interaction.type === 3
    ) {

      try {

        // Type 6 immediately acknowledges a component
        // interaction while keeping the current message.

        const acknowledge =
          await fetch(

            `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  type: 6

                })

            }

          );

        if (!acknowledge.ok) {

          console.error(
            "Component acknowledgement failed:",
            await acknowledge.text()
          );

          return new Response(
            "Component acknowledgement failed.",
            {
              status: 500
            }
          );

        }

      } catch (error) {

        console.error(
          "Component acknowledgement error:",
          error
        );

        return new Response(
          "Component acknowledgement failed.",
          {
            status: 500
          }
        );

      }

      try {

        if (
          interaction.data.component_type === 2
        ) {

          return await handleButton(
            env,
            interaction
          );

        }

        if (
          interaction.data.component_type === 3
        ) {

          return await handleSelect(
            env,
            interaction
          );

        }

      } catch (error) {

        console.error(
          "Component error:",
          error
        );

        return updateOriginal(
          env,
          interaction,
          {

            content:
              "❌ Something went wrong. 🌳",

            embeds: [],
            components: treeButtons()

          }
        );

      }

    }

    // --------------------------------------------------------
    // FALLBACK
    // --------------------------------------------------------

    return new Response(
      JSON.stringify({
        type: 4,

        data: {

          content:
            "✨ Something magical happened!"

        }

      }),

      {

        status: 200,

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    );

  }

};
