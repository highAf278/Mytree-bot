// ============================================================
// 🌳 DISCORD TREE BOT
// Grow • Water • Catch Sparkles • Customize • Shop
// ============================================================
//
// ENVIRONMENT VARIABLES:
//
// BOT_TOKEN   = Discord Bot Token
// CLIENT_ID   = Discord Application ID
// GUILD_ID    = Discord Server ID
// PUBLIC_KEY  = Discord Application Public Key
//
// CLOUDFLARE KV:
//
// Create a KV namespace and bind it as:
//
// TREE_DATA
//
// ============================================================

const EXP_PER_WATER = 10;
const SPARKLE_CHANCE = 0.18;
const SPARKLE_EXPIRY = 5 * 60 * 1000;

// ------------------------------------------------------------
// TREE STAGES
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// SHOP
// ------------------------------------------------------------

const SHOP = {

  fertilizer: [
    {
      id: "basic_fertilizer",
      name: "Basic Fertilizer",
      price: 100,
      bonus: 25,
      description: "+25 EXP"
    },
    {
      id: "super_fertilizer",
      name: "Super Fertilizer",
      price: 350,
      bonus: 100,
      description: "+100 EXP"
    },
    {
      id: "royal_fertilizer",
      name: "Royal Fertilizer",
      price: 750,
      bonus: 300,
      description: "+300 EXP"
    }
  ],

  backgrounds: [
    {
      id: "pink_sky",
      name: "Pink Sky",
      price: 500,
      emoji: "🌸"
    },
    {
      id: "moonlit",
      name: "Moonlit Night",
      price: 750,
      emoji: "🌙"
    },
    {
      id: "enchanted_forest",
      name: "Enchanted Forest",
      price: 1000,
      emoji: "🧚"
    },
    {
      id: "winter_wonderland",
      name: "Winter Wonderland",
      price: 1250,
      emoji: "❄️"
    },
    {
      id: "sunset_lake",
      name: "Sunset Lake",
      price: 1500,
      emoji: "🌅"
    }
  ],

  tree_types: [
    {
      id: "cherry",
      name: "Cherry Blossom",
      price: 1000,
      emoji: "🌸"
    },
    {
      id: "willow",
      name: "Moon Willow",
      price: 1500,
      emoji: "🌿"
    },
    {
      id: "rainbow",
      name: "Rainbow Tree",
      price: 2500,
      emoji: "🌈"
    },
    {
      id: "moonlight",
      name: "Moonlight Tree",
      price: 3000,
      emoji: "🌙"
    }
  ],

  decorations: [
    {
      id: "pink_bench",
      name: "Pink Bench",
      price: 500,
      emoji: "🩷"
    },
    {
      id: "mushroom",
      name: "Mushroom",
      price: 400,
      emoji: "🍄"
    },
    {
      id: "birdhouse",
      name: "Birdhouse",
      price: 600,
      emoji: "🏠"
    },
    {
      id: "lantern",
      name: "Fairy Lantern",
      price: 800,
      emoji: "🏮"
    },
    {
      id: "butterfly",
      name: "Butterfly",
      price: 750,
      emoji: "🦋"
    },
    {
      id: "cat",
      name: "Garden Cat",
      price: 1200,
      emoji: "🐱"
    },
    {
      id: "fountain",
      name: "Fairy Fountain",
      price: 1800,
      emoji: "⛲"
    }
  ],

  effects: [
    {
      id: "sparkles",
      name: "Sparkles",
      price: 1000,
      emoji: "✨"
    },
    {
      id: "hearts",
      name: "Floating Hearts",
      price: 1250,
      emoji: "💖"
    },
    {
      id: "butterflies",
      name: "Butterfly Effect",
      price: 1500,
      emoji: "🦋"
    },
    {
      id: "stardust",
      name: "Stardust",
      price: 2000,
      emoji: "🌟"
    }
  ],

  cosmetics: [
    {
      id: "crown",
      name: "Tiny Crown",
      price: 2000,
      emoji: "👑"
    },
    {
      id: "heart_lights",
      name: "Heart Lights",
      price: 1750,
      emoji: "💕"
    },
    {
      id: "moon_charm",
      name: "Moon Charm",
      price: 2200,
      emoji: "🌙"
    },
    {
      id: "flower_crown",
      name: "Flower Crown",
      price: 2500,
      emoji: "🌺"
    }
  ]
};

// ------------------------------------------------------------
// DEFAULT PLAYER
// ------------------------------------------------------------

function defaultPlayer(userId, username) {

  return {
    id: userId,

    username: username || "Tree Owner",

    name: "My Tree",

    level: 1,

    exp: 0,

    currency: 0,

    waterCount: 0,

    fertilizer: 0,

    inventory: {
      backgrounds: [],
      tree_types: [],
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

    sparkle: null,

    createdAt: Date.now(),

    lastWatered: null
  };
}

// ------------------------------------------------------------
// LEVEL SYSTEM
// ------------------------------------------------------------

function expNeeded(level) {

  return Math.floor(
    100 + ((level - 1) * 75)
  );
}

function getTreeStage(level) {

  let current = TREE_STAGES[0];

  for (const stage of TREE_STAGES) {

    if (level >= stage.level) {
      current = stage;
    }
  }

  return current;
}

function addExp(player, amount) {

  player.exp += amount;

  let leveledUp = false;

  while (player.exp >= expNeeded(player.level)) {

    player.exp -= expNeeded(player.level);

    player.level++;

    leveledUp = true;
  }

  return leveledUp;
}

// ------------------------------------------------------------
// KV STORAGE
// ------------------------------------------------------------

async function getPlayer(env, userId, username) {

  const key = `player:${userId}`;

  const stored = await env.TREE_DATA.get(key);

  if (!stored) {

    const player = defaultPlayer(userId, username);

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

// ------------------------------------------------------------
// IMAGE URL
// ------------------------------------------------------------
//
// Put the generated tree images in:
//
// assets/
//   tree_seedling.png
//   tree_young.png
//   tree_growing.png
//   tree_mature.png
//   tree_enchanted.png
//   tree_legendary.png
//
// Then set ASSET_BASE_URL to the public URL for that folder.
//
// Example:
//
// https://your-domain.com/assets
//
// ------------------------------------------------------------

function getTreeImage(env, player) {

  const stage = getTreeStage(player.level);

  const base = env.ASSET_BASE_URL || "";

  if (!base) {
    return null;
  }

  return `${base}/${stage.image}`;
}

// ------------------------------------------------------------
// DISCORD API
// ------------------------------------------------------------

const DISCORD_API = "https://discord.com/api/v10";

async function discordRequest(env, endpoint, options = {}) {

  return fetch(
    `${DISCORD_API}${endpoint}`,
    {
      ...options,
      headers: {
        "Authorization": `Bot ${env.BOT_TOKEN}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );
}

// ------------------------------------------------------------
// REGISTER SLASH COMMANDS
// ------------------------------------------------------------

async function registerCommands(env) {

  const commands = [

    {
      name: "tree",
      description: "View your tree"
    },

    {
      name: "water",
      description: "Water your tree and gain EXP"
    },

    {
      name: "catch",
      description: "Catch a sparkle for currency"
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
      name: "rename",
      description: "Rename your tree",

      options: [
        {
          name: "name",
          description: "New tree name",
          type: 3,
          required: true,
          max_length: 50
        }
      ]
    },

    {
      name: "inventory",
      description: "View your tree inventory"
    },

    {
      name: "leaderboard",
      description: "View the server tree leaderboard"
    }

  ];

  let endpoint;

  if (env.GUILD_ID) {

    endpoint =
      `/applications/${env.CLIENT_ID}/guilds/${env.GUILD_ID}/commands`;

  } else {

    endpoint =
      `/applications/${env.CLIENT_ID}/commands`;
  }

  const response = await discordRequest(
    env,
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(commands)
    }
  );

  return response.ok;
}

// ------------------------------------------------------------
// EMBED HELPERS
// ------------------------------------------------------------

function treeEmbed(env, player) {

  const stage = getTreeStage(player.level);

  const needed = expNeeded(player.level);

  const percentage =
    Math.min(
      100,
      Math.floor((player.exp / needed) * 100)
    );

  const barLength = 12;

  const filled =
    Math.floor(
      (percentage / 100) * barLength
    );

  const bar =
    "▰".repeat(filled) +
    "▱".repeat(barLength - filled);

  const embed = {

    title: `🌳 ${player.name}`,

    description:
      `**${stage.name}**\n\n` +
      `✨ Level **${player.level}**\n` +
      `${bar} ${percentage}%\n` +
      `⭐ ${player.exp} / ${needed} EXP\n\n` +

      `💧 Watered **${player.waterCount}** times\n` +
      `💎 Sparkles **${player.currency}**\n\n` +

      `🌸 Background: **${prettyName(
        player.equipped.background
      )}**\n` +

      `🌳 Tree: **${prettyName(
        player.equipped.tree_type
      )}**\n` +

      `🪴 Decoration: **${prettyName(
        player.equipped.decoration
      )}**\n` +

      `✨ Effect: **${prettyName(
        player.equipped.effect
      )}**\n\n` +

      `*Keep watering to help your tree grow!* 💕`,

    color: 0xff9edb,

    footer: {
      text: "🌸 Grow • Collect • Customize • Make it yours"
    }
  };

  const image = getTreeImage(env, player);

  if (image) {

    embed.image = {
      url: image
    };
  }

  return embed;
}

function prettyName(id) {

  if (!id) {
    return "None";
  }

  for (const category of Object.values(SHOP)) {

    const item = category.find(x => x.id === id);

    if (item) {
      return item.name;
    }
  }

  return id
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ------------------------------------------------------------
// TREE BUTTONS
// ------------------------------------------------------------

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
          style: 2,
          label: "✨ Catch",
          custom_id: "catch"
        },

        {
          type: 2,
          style: 3,
          label: "🛍️ Shop",
          custom_id: "shop"
        },

        {
          type: 2,
          style: 2,
          label: "🎨 Customize",
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

// ------------------------------------------------------------
// SHOP MENU
// ------------------------------------------------------------

function shopEmbed() {

  return {

    title: "🛍️ Tree Shop",

    description:
      "Spend your ✨ sparkles on things for your tree!\n\n" +

      "🌱 **Fertilizer** — Grow faster\n" +
      "🌸 **Backgrounds** — Change your world\n" +
      "🌳 **Tree Types** — Change your tree\n" +
      "🪴 **Decorations** — Decorate your garden\n" +
      "✨ **Effects** — Add magical effects\n" +
      "💖 **Cosmetics** — Cute extras\n\n" +

      "*More items can be added anytime!* 💕",

    color: 0xff9edb
  };
}

function shopButtons() {

  return [

    {
      type: 1,

      components: [

        button("🌱 Fertilizer", "shop:fertilizer", 1),
        button("🌸 Backgrounds", "shop:backgrounds", 1),
        button("🌳 Trees", "shop:tree_types", 1)
      ]
    },

    {
      type: 1,

      components: [

        button("🪴 Decorations", "shop:decorations", 1),
        button("✨ Effects", "shop:effects", 1),
        button("💖 Cosmetics", "shop:cosmetics", 1)
      ]
    }

  ];
}

function button(label, id, style = 2) {

  return {
    type: 2,
    style,
    label,
    custom_id: id
  };
}

// ------------------------------------------------------------
// SHOP CATEGORY
// ------------------------------------------------------------

function shopCategoryEmbed(category) {

  const items = SHOP[category];

  return {

    title:
      `🛍️ ${prettyName(category)}`,

    description:
      items.map((item, index) => {

        return (
          `**${index + 1}. ${item.emoji || "🌸"} ${item.name}**\n` +
          `💎 ${item.price} sparkles\n` +
          `${item.description || ""}`
        );

      }).join("\n\n"),

    color: 0xff9edb
  };
}

function shopCategoryButtons(category) {

  const items = SHOP[category];

  const rows = [];

  for (let i = 0; i < items.length; i += 3) {

    const row = {

      type: 1,

      components: items
        .slice(i, i + 3)
        .map(item =>
          button(
            `${item.emoji || "🌸"} ${item.name}`,
            `buy:${category}:${item.id}`,
            1
          )
        )
    };

    rows.push(row);
  }

  rows.push({

    type: 1,

    components: [
      button("⬅️ Back", "shop", 2)
    ]
  });

  return rows;
}

// ------------------------------------------------------------
// CUSTOMIZATION
// ------------------------------------------------------------

function customizeEmbed(player) {

  return {

    title: "🎨 Customize Your Tree",

    description:

      `**Current setup:**\n\n` +

      `🌸 Background: ${prettyName(
        player.equipped.background
      )}\n` +

      `🌳 Tree Type: ${prettyName(
        player.equipped.tree_type
      )}\n` +

      `🪴 Decoration: ${prettyName(
        player.equipped.decoration
      )}\n` +

      `✨ Effect: ${prettyName(
        player.equipped.effect
      )}\n` +

      `💖 Cosmetic: ${prettyName(
        player.equipped.cosmetic
      )}\n\n` +

      `Choose what you want to change!`,

    color: 0xff9edb
  };
}

function customizeButtons() {

  return [

    {
      type: 1,

      components: [

        button("🌸 Background", "custom:backgrounds"),
        button("🌳 Tree Type", "custom:tree_types")
      ]
    },

    {
      type: 1,

      components: [

        button("🪴 Decoration", "custom:decorations"),
        button("✨ Effect", "custom:effects"),
        button("💖 Cosmetic", "custom:cosmetics")
      ]
    },

    {
      type: 1,

      components: [
        button("🌳 Back to Tree", "tree")
      ]
    }

  ];
}

// ------------------------------------------------------------
// INVENTORY
// ------------------------------------------------------------

function inventoryEmbed(player) {

  const lines = [];

  for (const category of Object.keys(player.inventory)) {

    const items = player.inventory[category];

    if (!items.length) {

      lines.push(
        `**${prettyName(category)}:** None`
      );

    } else {

      lines.push(
        `**${prettyName(category)}:**\n` +
        items.map(id => `• ${prettyName(id)}`).join("\n")
      );
    }
  }

  return {

    title: "🎒 Your Tree Inventory",

    description:
      `💎 **Sparkles:** ${player.currency}\n\n` +
      lines.join("\n\n"),

    color: 0xff9edb
  };
}

// ------------------------------------------------------------
// RANDOM SPARKLE
// ------------------------------------------------------------

function maybeSpawnSparkle(player) {

  if (player.sparkle) {

    if (
      Date.now() - player.sparkle.spawnedAt <
      SPARKLE_EXPIRY
    ) {

      return false;
    }

    player.sparkle = null;
  }

  if (Math.random() > SPARKLE_CHANCE) {
    return false;
  }

  const types = [

    {
      type: "Pink Star",
      emoji: "💖",
      amount: 15
    },

    {
      type: "Rainbow Sparkle",
      emoji: "🌈",
      amount: 25
    },

    {
      type: "Moon Sparkle",
      emoji: "🌙",
      amount: 35
    },

    {
      type: "Rare Star",
      emoji: "🌟",
      amount: 75
    }

  ];

  const sparkle =
    types[
      Math.floor(
        Math.random() * types.length
      )
    ];

  player.sparkle = {

    ...sparkle,

    spawnedAt: Date.now()
  };

  return true;
}

// ------------------------------------------------------------
// INTERACTION RESPONSE
// ------------------------------------------------------------

async function respond(env, interaction, data) {

  return fetch(
    `${DISCORD_API}/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        type: 4,

        data
      })
    }
  );
}

async function updateMessage(env, interaction, data) {

  return fetch(
    `${DISCORD_API}/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );
}

// ------------------------------------------------------------
// HANDLE WATER
// ------------------------------------------------------------

async function water(env, interaction, edit = false) {

  const user = interaction.member?.user ||
               interaction.user;

  const player =
    await getPlayer(
      env,
      user.id,
      user.username
    );

  const leveledUp =
    addExp(
      player,
      EXP_PER_WATER
    );

  player.waterCount++;

  player.lastWatered = Date.now();

  const sparkleSpawned =
    maybeSpawnSparkle(player);

  await savePlayer(env, player);

  const stage =
    getTreeStage(player.level);

  let message =
    `💧 **${player.name}** was watered!\n\n` +
    `⭐ +${EXP_PER_WATER} EXP\n` +
    `🌳 Level ${player.level} — ${stage.name}`;

  if (leveledUp) {

    message +=
      `\n\n🎉 **LEVEL UP!**\n` +
      `Your tree reached level **${player.level}**!`;
  }

  if (sparkleSpawned) {

    message +=
      `\n\n✨ **A SPARKLE APPEARED!**\n` +
      `Use **/catch** to catch it before it disappears!`;
  }

  const data = {

    content: message,

    embeds: [
      treeEmbed(env, player)
    ],

    components: treeButtons()
  };

  if (edit) {

    return updateMessage(
      env,
      interaction,
      data
    );
  }

  return respond(
    env,
    interaction,
    data
  );
}

// ------------------------------------------------------------
// HANDLE CATCH
// ------------------------------------------------------------

async function catchSparkle(env, interaction) {

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

    return respond(
      env,
      interaction,
      {
        content:
          "✨ There aren't any sparkles to catch right now!\n" +
          "Keep watering your tree. 🌳💕",

        flags: 64
      }
    );
  }

  if (
    Date.now() - player.sparkle.spawnedAt >
    SPARKLE_EXPIRY
  ) {

    player.sparkle = null;

    await savePlayer(env, player);

    return respond(
      env,
      interaction,
      {
        content:
          "💨 That sparkle disappeared! Keep watering to find another one.",

        flags: 64
      }
    );
  }

  const sparkle =
    player.sparkle;

  player.currency +=
    sparkle.amount;

  player.sparkle = null;

  await savePlayer(env, player);

  return respond(
    env,
    interaction,
    {

      content:
        `${sparkle.emoji} **You caught a ${sparkle.type}!**\n\n` +
        `💎 +${sparkle.amount} sparkles\n` +
        `💎 You now have **${player.currency}** sparkles!`,

      embeds: [
        treeEmbed(env, player)
      ],

      components: treeButtons()
    }
  );
}

// ------------------------------------------------------------
// BUY ITEM
// ------------------------------------------------------------

async function buyItem(
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

    return respond(
      env,
      interaction,
      {
        content:
          "❌ I couldn't find that item.",

        flags: 64
      }
    );
  }

  if (player.currency < item.price) {

    return respond(
      env,
      interaction,
      {
        content:
          `💎 You need **${item.price}** sparkles.\n` +
          `You only have **${player.currency}**.`,

        flags: 64
      }
    );
  }

  // Fertilizer is consumed immediately.
  if (category === "fertilizer") {

    player.currency -= item.price;

    const gained =
      addExp(
        player,
        item.bonus
      );

    await savePlayer(env, player);

    return respond(
      env,
      interaction,
      {

        content:
          `🌱 You used **${item.name}**!\n\n` +
          `⭐ +${item.bonus} EXP\n` +
          (gained
            ? `🎉 Your tree leveled up to **${player.level}**!`
            : ""),

        embeds: [
          treeEmbed(env, player)
        ],

        components: treeButtons()
      }
    );
  }

  // Don't buy duplicates.
  if (
    player.inventory[category]?.includes(itemId)
  ) {

    return respond(
      env,
      interaction,
      {
        content:
          `💕 You already own **${item.name}**!`,

        flags: 64
      }
    );
  }

  player.currency -= item.price;

  if (!player.inventory[category]) {
    player.inventory[category] = [];
  }

  player.inventory[category].push(itemId);

  await savePlayer(env, player);

  return respond(
    env,
    interaction,
    {

      content:
        `🎉 **Purchased!**\n\n` +
        `${item.emoji || "🌸"} ${item.name}\n` +
        `💎 -${item.price} sparkles\n` +
        `💎 Remaining: **${player.currency}**`,

      embeds: [
        treeEmbed(env, player)
      ],

      components: treeButtons()
    }
  );
}

// ------------------------------------------------------------
// CUSTOMIZATION CATEGORY
// ------------------------------------------------------------

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

  const choices = [];

  for (const itemId of owned) {

    const item =
      SHOP[category].find(
        x => x.id === itemId
      );

    if (item) {

      choices.push({
        label: item.name,
        value: item.id,
        description:
          `Equip ${item.name}`
      });
    }
  }

  if (!choices.length) {

    return respond(
      env,
      interaction,
      {

        content:
          `💕 You don't own any ${prettyName(category)} yet.\n\n` +
          `Visit **/shop** to get some!`,

        flags: 64
      }
    );
  }

  const select = {

    type: 1,

    components: [

      {
        type: 3,

        custom_id:
          `equip:${category}`,

        placeholder:
          `Choose a ${prettyName(category)}...`,

        options:
          choices.slice(0, 25)
      }

    ]
  };

  return respond(
    env,
    interaction,
    {

      embeds: [
        {
          title:
            `🎨 Choose ${prettyName(category)}`,

          description:
            "Select something from your collection to equip it.",

          color: 0xff9edb
        }
      ],

      components: [
        select,

        {
          type: 1,

          components: [
            button(
              "⬅️ Back",
              "customize"
            )
          ]
        }
      ]
    }
  );
}

// ------------------------------------------------------------
// EQUIP
// ------------------------------------------------------------

async function equipItem(
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
    !player.inventory[category]?.includes(itemId)
  ) {

    return respond(
      env,
      interaction,
      {
        content:
          "❌ You don't own that item.",

        flags: 64
      }
    );
  }

  const equipMap = {

    backgrounds: "background",

    tree_types: "tree_type",

    decorations: "decoration",

    effects: "effect",

    cosmetics: "cosmetic"
  };

  player.equipped[
    equipMap[category]
  ] = itemId;

  await savePlayer(env, player);

  return respond(
    env,
    interaction,
    {

      content:
        `✨ Equipped **${prettyName(itemId)}**!`,

      embeds: [
        treeEmbed(env, player)
      ],

      components: treeButtons()
    }
  );
}

// ------------------------------------------------------------
// LEADERBOARD
// ------------------------------------------------------------

async function leaderboard(env, interaction) {

  const list =
    await env.TREE_DATA.list({
      prefix: "player:",
      limit: 100
    });

  const players = [];

  for (const key of list.keys) {

    const stored =
      await env.TREE_DATA.get(key.name);

    if (!stored) continue;

    try {

      players.push(
        JSON.parse(stored)
      );

    } catch {}
  }

  players.sort(
    (a, b) =>
      (b.level - a.level) ||
      (b.exp - a.exp) ||
      (b.currency - a.currency)
  );

  const top =
    players.slice(0, 10);

  let description = "";

  if (!top.length) {

    description =
      "Nobody has grown a tree yet! 🌱";

  } else {

    description =
      top.map((player, index) => {

        const medal =
          ["🥇", "🥈", "🥉"][index] ||
          `**${index + 1}.**`;

        return (
          `${medal} **${player.name}** — ` +
          `Level ${player.level} 🌳 ` +
          `• ${player.currency} 💎`
        );

      }).join("\n");
  }

  return respond(
    env,
    interaction,
    {

      embeds: [
        {
          title:
            "🏆 Tree Leaderboard",

          description,

          color: 0xff9edb
        }
      ],

      components: [
        {
          type: 1,

          components: [
            button(
              "🌳 My Tree",
              "tree"
            )
          ]
        }
      ]
    }
  );
}

// ------------------------------------------------------------
// HANDLE COMMANDS
// ------------------------------------------------------------

async function handleCommand(
  env,
  interaction
) {

  const command =
    interaction.data.name;

  const user =
    interaction.member?.user ||
    interaction.user;

  if (command === "tree") {

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return respond(
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

    return respond(
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

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return respond(
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

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    return respond(
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
              button(
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

    const option =
      interaction.data.options?.find(
        x => x.name === "name"
      );

    const newName =
      option?.value?.trim();

    if (!newName) {

      return respond(
        env,
        interaction,
        {
          content:
            "❌ Please give your tree a name.",
          flags: 64
        }
      );
    }

    const player =
      await getPlayer(
        env,
        user.id,
        user.username
      );

    player.name = newName;

    await savePlayer(
      env,
      player
    );

    return respond(
      env,
      interaction,
      {

        content:
          `🌸 Your tree is now named **${newName}**!`,

        embeds: [
          treeEmbed(env, player)
        ],

        components:
          treeButtons()
      }
    );
  }

  return respond(
    env,
    interaction,
    {
      content:
        "❓ I don't know that command.",
      flags: 64
    }
  );
}

// ------------------------------------------------------------
// HANDLE BUTTONS
// ------------------------------------------------------------

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

    return updateMessage(
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

    return updateMessage(
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

    return updateMessage(
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

    return updateMessage(
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
              button(
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

    return updateMessage(
      env,
      interaction,
      {

        embeds: [
          shopCategoryEmbed(category)
        ],

        components:
          shopCategoryButtons(category)
      }
    );
  }

  if (id.startsWith("buy:")) {

    const [, category, itemId] =
      id.split(":");

    return buyItem(
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

  return null;
}

// ------------------------------------------------------------
// HANDLE SELECT MENUS
// ------------------------------------------------------------

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

    return equipItem(
      env,
      interaction,
      category,
      itemId
    );
  }

  return null;
}

// ------------------------------------------------------------
// DISCORD SIGNATURE VERIFICATION
// ------------------------------------------------------------

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
        hex.substr(i * 2, 2),
        16
      );
  }

  return bytes;
}

async function verifyDiscordRequest(
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

    const publicKey =
      await crypto.subtle.importKey(
        "raw",
        hexToBytes(
          env.PUBLIC_KEY
        ),
        {
          name: "Ed25519"
        },
        false,
        ["verify"]
      );

    return crypto.subtle.verify(
      {
        name: "Ed25519"
      },
      publicKey,
      hexToBytes(signature),
      message
    );

  } catch {

    return false;
  }
}

// ------------------------------------------------------------
// MAIN WORKER
// ------------------------------------------------------------

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    // --------------------------------------------------------
    // HEALTH CHECK
    // --------------------------------------------------------

    if (
      request.method === "GET"
    ) {

      if (
        url.pathname === "/"
      ) {

        return new Response(
          "🌳 Discord Tree Bot is online! ✨",
          {
            headers: {
              "content-type":
                "text/plain;charset=UTF-8"
            }
          }
        );
      }

      // ------------------------------------------------------
      // REGISTER COMMANDS
      //
      // Open:
      //
      // https://YOUR-WORKER.workers.dev/register
      //
      // ------------------------------------------------------

      if (
        url.pathname === "/register"
      ) {

        const success =
          await registerCommands(env);

        return new Response(
          success
            ? "🌳 Slash commands registered!"
            : "❌ Failed to register slash commands.",
          {
            status:
              success ? 200 : 500
          }
        );
      }
    }

    // --------------------------------------------------------
    // DISCORD INTERACTIONS
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

    const body =
      await request.text();

    const valid =
      await verifyDiscordRequest(
        request,
        env,
        body
      );

    if (!valid) {

      return new Response(
        "Invalid request signature.",
        {
          status: 401
        }
      );
    }

    const interaction =
      JSON.parse(body);

    // Discord endpoint verification
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

    // Slash commands
    if (
      interaction.type === 2
    ) {

      return handleCommand(
        env,
        interaction
      );
    }

    // Buttons
    if (
      interaction.type === 3 &&
      interaction.data.component_type === 2
    ) {

      return handleButton(
        env,
        interaction
      );
    }

    // Select menus
    if (
      interaction.type === 3 &&
      interaction.data.component_type === 3
    ) {

      return handleSelect(
        env,
        interaction
      );
    }

    return new Response(
      JSON.stringify({
        type: 4,

        data: {
          content:
            "✨ Something magical happened!"
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
};
