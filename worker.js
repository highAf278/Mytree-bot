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
// ============================================================

const EXP_PER_WATER = 10;
const SPARKLE_CHANCE = 0.20;
const SPARKLE_LIFETIME = 5 * 60 * 1000;
const WATER_COOLDOWN = 60 * 60 * 1000;

// ============================================================
// ⏰ COOLDOWN TIMER
// ============================================================

function formatDuration(ms) {
  const totalSeconds = Math.max(
    0,
    Math.ceil(ms / 1000)
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

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

  const stored =
    await env.TREE_DATA.get(key);

  if (!stored) {

    const player =
      newPlayer(id, username);

    await savePlayer(
      env,
      player
    );

    return player;

  }

  const player =
    JSON.parse(stored);

  player.username =
    username || player.username;

  // Make sure older players receive
  // the new cooldown field.
  if (
    typeof player.lastWatered !== "number"
  ) {
    player.lastWatered = 0;
  }

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

  return 100 + (
    (level - 1) * 75
  );

}

function addExp(player, amount) {

  let leveledUp = false;

  player.exp += amount;

  while (
    player.exp >=
    expRequired(player.level)
  ) {

    player.exp -=
      expRequired(player.level);

    player.level++;

    leveledUp = true;

  }

  return leveledUp;

}

function getStage(level) {

  let stage =
    TREE_STAGES[0];

  for (
    const item of TREE_STAGES
  ) {

    if (
      level >= item.level
    ) {

      stage = item;

    }

  }

  return stage;

}

// ============================================================
// 🖼️ TREE IMAGE
// ============================================================

function treeImage(env, player) {

  const stage =
    getStage(player.level);

  if (
    !env.ASSET_BASE_URL
  ) {

    return null;

  }

  return (
    `${env.ASSET_BASE_URL}/${stage.image}`
  );

}

// ============================================================
// ✨ RANDOM SPARKLE
// ============================================================

function spawnSparkle(player) {

  if (player.sparkle) {

    if (
      Date.now() -
      player.sparkle.time <
      SPARKLE_LIFETIME
    ) {

      return false;

    }

    player.sparkle = null;

  }

  if (
    Math.random() >
    SPARKLE_CHANCE
  ) {

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
        Math.random() *
        sparkles.length
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

  const stage =
    getStage(player.level);

  const needed =
    expRequired(player.level);

  const percent =
    Math.floor(
      (player.exp / needed) * 100
    );

  const filled =
    Math.floor(
      percent / 10
    );

  const bar =
    "▰".repeat(filled) +
    "▱".repeat(
      10 - filled
    );

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

  const image =
    treeImage(env, player);

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

  for (
    const category of
    Object.keys(SHOP)
  ) {

    const item =
      SHOP[category].find(
        x => x.id === id
      );

    if (item) {

      return (
        `${item.emoji} ${item.name}`
      );

    }

  }

  return id;

}

// ============================================================
// 🔘 BUTTON HELPER
// ============================================================

function btn(
  label,
  customId
) {

  return {

    type: 2,

    style: 1,

    label,

    custom_id:
      customId

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

        btn(
          "💧 Water",
          "water"
        ),

        btn(
          "✨ Catch",
          "catch"
        ),

        btn(
          "🛍️ Shop",
          "shop"
        ),

        btn(
          "🎨 Customize",
          "customize"
        )

      ]

    },

    {

      type: 1,

      components: [

        btn(
          "🎒 Inventory",
          "inventory"
        ),

        btn(
          "🏆 Leaderboard",
          "leaderboard"
        )

      ]

    }

  ];

}

// ============================================================
// 🛍️ SHOP EMBED
// ============================================================

function shopEmbed() {

  return {

    title:
      "🛍️ Tree Shop",

    description:
      "Spend your sparkle currency to unlock magical items for your tree! ✨\n\n" +
      "Choose a category below.",

    color:
      0xff9edb

  };

}

// ============================================================
// 🛍️ SHOP BUTTONS
// ============================================================

function shopButtons() {

  return [

    {

      type: 1,

      components: [

        btn(
          "🌱 Fertilizer",
          "shop:fertilizer"
        ),

        btn(
          "🌸 Backgrounds",
          "shop:backgrounds"
        ),

        btn(
          "🌳 Trees",
          "shop:tree_types"
        )

      ]

    },

    {

      type: 1,

      components: [

        btn(
          "🪴 Decorations",
          "shop:decorations"
        ),

        btn(
          "✨ Effects",
          "shop:effects"
        ),

        btn(
          "💖 Cosmetics",
          "shop:cosmetics"
        )

      ]

    },

    {

      type: 1,

      components: [

        btn(
          "🌳 My Tree",
          "tree"
        )

      ]

    }

  ];

}

// ============================================================
// 🛍️ SHOP CATEGORY
// ============================================================

function shopCategory(category) {

  const items =
    SHOP[category];

  if (!items) {

    return {

      title:
        "🛍️ Shop",

      description:
        "Category not found."

    };

  }

  let description = "";

  for (
    const item of items
  ) {

    description +=
      `${item.emoji} **${item.name}** — 💎 ${item.price}\n`;

    if (item.description) {

      description +=
        `${item.description}\n`;

    }

    description += "\n";

  }

  return {

    title:
      `🛍️ ${prettyCategory(category)}`,

    description,

    color:
      0xff9edb

  };

}

function prettyCategory(category) {

  const names = {

    fertilizer:
      "Fertilizer",

    backgrounds:
      "Backgrounds",

    tree_types:
      "Tree Types",

    decorations:
      "Decorations",

    effects:
      "Effects",

    cosmetics:
      "Cosmetics"

  };

  return (
    names[category] ||
    category
  );

}

// ============================================================
// 🛍️ SHOP CATEGORY BUTTONS
// ============================================================

function shopCategoryButtons(category) {

  const items =
    SHOP[category] || [];

  const rows = [];

  let row = [];

  for (
    const item of items
  ) {

    row.push(

      btn(
        `${item.emoji} ${item.name}`,
        `buy:${category}:${item.id}`
      )

    );

    if (
      row.length === 3
    ) {

      rows.push({

        type: 1,

        components:
          row

      });

      row = [];

    }

  }

  if (
    row.length > 0
  ) {

    rows.push({

      type: 1,

      components:
        row

    });

  }

  rows.push({

    type: 1,

    components: [

      btn(
        "⬅️ Shop",
        "shop"
      ),

      btn(
        "🌳 My Tree",
        "tree"
      )

    ]

  });

  return rows;

}

// ============================================================
// 🎨 CUSTOMIZE
// ============================================================

function customizeEmbed(player) {

  return {

    title:
      "🎨 Customize Your Tree",

    description:
      "Choose what you want to customize below.\n\n" +
      `🌸 Background: **${pretty(player.equipped.background)}**\n` +
      `🌳 Tree: **${pretty(player.equipped.tree_type)}**\n` +
      `🪴 Decoration: **${pretty(player.equipped.decoration)}**\n` +
      `✨ Effect: **${pretty(player.equipped.effect)}**\n` +
      `💖 Cosmetic: **${pretty(player.equipped.cosmetic)}**`,

    color:
      0xff9edb

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
        ),

        btn(
          "🪴 Decoration",
          "custom:decorations"
        )

      ]

    },

    {

      type: 1,

      components: [

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
          "🌳 My Tree",
          "tree"
        )

      ]

    }

  ];

}

// ============================================================
// 🎨 CUSTOMIZE CATEGORY
// ============================================================

function customizeCategoryEmbed(
  player,
  category
) {

  const items =
    player.inventory[category] || [];

  let description = "";

  if (
    items.length === 0
  ) {

    description =
      "You don't own anything in this category yet. 🥺\n\n" +
      "Visit the Shop to unlock something magical! ✨";

  } else {

    description =
      "Choose an item to equip:\n\n";

    for (
      const itemId of items
    ) {

      description +=
        `${pretty(itemId)}\n`;

    }

  }

  return {

    title:
      `🎨 ${prettyCategory(category)}`,

    description,

    color:
      0xff9edb

  };

}

// ============================================================
// 🎨 SELECT MENU
// ============================================================

function selectMenu(
  customId,
  placeholder,
  options
) {

  return {

    type: 3,

    custom_id:
      customId,

    placeholder,

    options

  };

}

function customizeCategoryButtons(
  player,
  category
) {

  const items =
    player.inventory[category] || [];

  const options =
    items.map(
      itemId => {

        const item =
          findItem(itemId);

        return {

          label:
            item?.name ||
            itemId,

          value:
            itemId,

          emoji:
            item?.emoji ||
            "✨"

        };

      }
    );

  const components = [];

  if (
    options.length > 0
  ) {

    components.push({

      type: 1,

      components: [

        selectMenu(
          `equip:${category}`,
          "Choose an item...",
          options
        )

      ]

    });

  }

  components.push({

    type: 1,

    components: [

      btn(
        "⬅️ Customize",
        "customize"
      ),

      btn(
        "🌳 My Tree",
        "tree"
      )

    ]

  });

  return components;

}

// ============================================================
// 🔎 FIND ITEM
// ============================================================

function findItem(id) {

  for (
    const category of
    Object.keys(SHOP)
  ) {

    const item =
      SHOP[category].find(
        x => x.id === id
      );

    if (item) {

      return {

        ...item,

        category

      };

    }

  }

  return null;

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

  const now =
    Date.now();

  const lastWatered =
    Number(
      player.lastWatered || 0
    );

  const timeSinceWater =
    now - lastWatered;

  // ----------------------------------------------------------
  // COOLDOWN
  // ----------------------------------------------------------

  if (
    lastWatered > 0 &&
    timeSinceWater <
      WATER_COOLDOWN
  ) {

    const remaining =
      WATER_COOLDOWN -
      timeSinceWater;

    const data = {

      content:
        `💧 **${player.name}** is still soaking up the last watering! 🌸\n\n` +
        `⏰ You can water again in **${formatDuration(remaining)}**.`,

      embeds: [

        treeEmbed(
          env,
          player
        )

      ],

      components:
        treeButtons()

    };

    if (edit) {

      return updateOriginal(
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

  // ----------------------------------------------------------
  // WATER THE TREE
  // ----------------------------------------------------------

  player.lastWatered =
    now;

  const leveled =
    addExp(
      player,
      EXP_PER_WATER
    );

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

    content:
      message,

    embeds: [

      treeEmbed(
        env,
        player
      )

    ],

    components:
      treeButtons()

  };

  if (edit) {

    return updateOriginal(
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

// ============================================================
// ✨ CATCH SPARKLE
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

  if (
    !player.sparkle
  ) {

    return respond(
      env,
      interaction,
      {

        content:
          "✨ There isn't a sparkle waiting right now. Keep watering your tree! 🌸",

        embeds: [

          treeEmbed(
            env,
            player
          )

        ],

        components:
          treeButtons()

      }
    );

  }

  if (
    Date.now() -
    player.sparkle.time >
    SPARKLE_LIFETIME
  ) {

    player.sparkle =
      null;

    await savePlayer(
      env,
      player
    );

    return respond(
      env,
      interaction,
      {

        content:
          "💨 The sparkle disappeared before you caught it!",

        embeds: [

          treeEmbed(
            env,
            player
          )

        ],

        components:
          treeButtons()

      }
    );

  }

  const sparkle =
    player.sparkle;

  player.sparkles +=
    sparkle.amount;

  player.sparkle =
    null;

  await savePlayer(
    env,
    player
  );

  return respond(
    env,
    interaction,
    {

      content:
        `${sparkle.emoji} **You caught a ${sparkle.name}!**\n\n` +
        `💎 +${sparkle.amount} Sparkles!`,

      embeds: [

        treeEmbed(
          env,
          player
        )

      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 🛍️ BUY
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

    return respond(
      env,
      interaction,
      {

        content:
          "❌ That item doesn't exist.",

        embeds: [

          shopEmbed()

        ],

        components:
          shopButtons()

      }
    );

  }

  const inventory =
    player.inventory[category];

  if (
    inventory.includes(itemId)
  ) {

    return respond(
      env,
      interaction,
      {

        content:
          `${item.emoji} You already own **${item.name}**!`,

        embeds: [

          shopCategory(
            category
          )

        ],

        components:
          shopCategoryButtons(
            category
          )

      }
    );

  }

  if (
    player.sparkles <
    item.price
  ) {

    return respond(
      env,
      interaction,
      {

        content:
          `💎 You need **${item.price}** Sparkles, but you only have **${player.sparkles}**.`,

        embeds: [

          shopCategory(
            category
          )

        ],

        components:
          shopCategoryButtons(
            category
          )

      }
    );

  }

  player.sparkles -=
    item.price;

  inventory.push(
    itemId
  );

  await savePlayer(
    env,
    player
  );

  return respond(
    env,
    interaction,
    {

      content:
        `${item.emoji} **${item.name}** unlocked! ✨\n\n` +
        `💎 -${item.price} Sparkles`,

      embeds: [

        shopCategory(
          category
        )

      ],

      components:
        shopCategoryButtons(
          category
        )

    }
  );

}

// ============================================================
// 🎨 EQUIP
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

  const owned =
    player.inventory[category] ||
    [];

  if (
    !owned.includes(itemId)
  ) {

    return respond(
      env,
      interaction,
      {

        content:
          "❌ You don't own that item yet.",

        embeds: [

          treeEmbed(
            env,
            player
          )

        ],

        components:
          treeButtons()

      }
    );

  }

  player.equipped[
    category === "backgrounds"
      ? "background"
      : category === "tree_types"
        ? "tree_type"
        : category === "decorations"
          ? "decoration"
          : category === "effects"
            ? "effect"
            : "cosmetic"
  ] = itemId;

  await savePlayer(
    env,
    player
  );

  return respond(
    env,
    interaction,
    {

      content:
        `${pretty(itemId)} equipped! ✨`,

      embeds: [

        treeEmbed(
          env,
          player
        )

      ],

      components:
        treeButtons()

    }
  );

}

// ============================================================
// 🎒 INVENTORY
// ============================================================

function inventoryEmbed(player) {

  let description =
    `💎 **Sparkles:** ${player.sparkles}\n\n`;

  for (
    const category of
    Object.keys(player.inventory)
  ) {

    const items =
      player.inventory[category];

    description +=
      `**${prettyCategory(category)}**\n`;

    if (
      items.length === 0
    ) {

      description +=
        "None yet.\n\n";

    } else {

      for (
        const itemId of items
      ) {

        description +=
          `• ${pretty(itemId)}\n`;

      }

      description += "\n";

    }

  }

  return {

    title:
      "🎒 Your Tree Inventory",

    description,

    color:
      0xff9edb

  };

}

// ============================================================
// 🏆 LEADERBOARD
// ============================================================

async function leaderboard(
  env,
  interaction
) {

  // Cloudflare KV does not provide a
  // simple global leaderboard query
  // without listing keys.

  let players = [];

  const list =
    await env.TREE_DATA.list({
      prefix: "player:"
    });

  for (
    const key of list.keys
  ) {

    const stored =
      await env.TREE_DATA.get(
        key.name
      );

    if (!stored) {
      continue;
    }

    try {

      players.push(
        JSON.parse(stored)
      );

    } catch {

      // Ignore malformed entries.

    }

  }

  players.sort(
    (a, b) => {

      if (
        b.level !== a.level
      ) {

        return (
          b.level -
          a.level
        );

      }

      return (
        b.exp -
        a.exp
      );

    }
  );

  const top =
    players.slice(0, 10);

  let description = "";

  if (
    top.length === 0
  ) {

    description =
      "No trees have grown yet! 🌱";

  } else {

    top.forEach(
      (player, index) => {

        description +=
          `**${index + 1}. ${player.name}** — Level ${player.level} 🌳\n`;

      }
    );

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
// ✏️ RENAME TREE
// ============================================================

async function renameTree(
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

  const name =
    interaction.data.options?.find(
      option =>
        option.name === "name"
    )?.value;

  if (!name) {

    return respond(
      env,
      interaction,
      {

        content:
          "❌ Please provide a name for your tree."

      }
    );

  }

  const cleanName =
    String(name)
      .trim()
      .slice(0, 50);

  if (!cleanName) {

    return respond(
      env,
      interaction,
      {

        content:
          "❌ Your tree needs a name."

      }
    );

  }

  player.name =
    cleanName;

  await savePlayer(
    env,
    player
  );

  return respond(
    env,
    interaction,
    {

      content:
        `🌳 Your tree is now called **${player.name}**! ✨`,

      embeds: [

        treeEmbed(
          env,
          player
        )

      ],

      components:
        treeButtons()

    }
  );

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
    i < hex.length;
    i += 2
  ) {

    bytes[i / 2] =
      parseInt(
        hex.slice(i, i + 2),
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

    return crypto.subtle.verify(

      {
        name: "Ed25519"
      },

      key,

      hexBytes(
        signature
      ),

      message

    );

  } catch {

    return false;

  }

}

// ============================================================
// 📤 DISCORD RESPONSE
// ============================================================

async function respond(
  env,
  interaction,
  data
) {

  return fetch(

    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json"

      },

      body:
        JSON.stringify({

          type: 4,

          data

        })

    }

  );

}

// ============================================================
// 🔄 UPDATE DISCORD COMPONENT MESSAGE
// ============================================================

async function updateOriginal(
  env,
  interaction,
  data
) {

  return fetch(

    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json"

      },

      body:
        JSON.stringify({

          type: 7,

          data

        })

    }

  );

}

// ============================================================
// ⌨️ HANDLE SLASH COMMANDS
// ============================================================

async function handleCommand(
  env,
  interaction
) {

  const command =
    interaction.data.name;

  if (
    command === "tree"
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

    return respond(
      env,
      interaction,
      {

        embeds: [

          treeEmbed(
            env,
            player
          )

        ],

        components:
          treeButtons()

      }
    );

  }

  if (
    command === "water"
  ) {

    return water(
      env,
      interaction
    );

  }

  if (
    command === "catch"
  ) {

    return catchSparkle(
      env,
      interaction
    );

  }

  if (
    command === "shop"
  ) {

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

  if (
    command === "customize"
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

    return respond(
      env,
      interaction,
      {

        embeds: [

          customizeEmbed(
            player
          )

        ],

        components:
          customizeButtons()

      }
    );

  }

  if (
    command === "inventory"
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

    return respond(
      env,
      interaction,
      {

        embeds: [

          inventoryEmbed(
            player
          )

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

  if (
    command === "leaderboard"
  ) {

    return leaderboard(
      env,
      interaction
    );

  }

  if (
    command === "rename"
  ) {

    return renameTree(
      env,
      interaction
    );

  }

  return respond(
    env,
    interaction,
    {

      content:
        "❌ Unknown command."

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

  if (
    id === "tree"
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

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [

          treeEmbed(
            env,
            player
          )

        ],

        components:
          treeButtons()

      }
    );

  }

  if (
    id === "water"
  ) {

    return water(
      env,
      interaction,
      true
    );

  }

  if (
    id === "catch"
  ) {

    return catchSparkle(
      env,
      interaction
    );

  }

  if (
    id === "shop"
  ) {

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [

          shopEmbed()

        ],

        components:
          shopButtons()

      }
    );

  }

  if (
    id === "customize"
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

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [

          customizeEmbed(
            player
          )

        ],

        components:
          customizeButtons()

      }
    );

  }

  if (
    id === "inventory"
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

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [

          inventoryEmbed(
            player
          )

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

  if (
    id === "leaderboard"
  ) {

    return leaderboard(
      env,
      interaction
    );

  }

  if (
    id.startsWith("shop:")
  ) {

    const category =
      id.split(":")[1];

    return updateOriginal(
      env,
      interaction,
      {

        content: "",

        embeds: [

          shopCategory(
            category
          )

        ],

        components:
          shopCategoryButtons(
            category
          )

      }
    );

  }

  if (
    id.startsWith("buy:")
  ) {

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

  if (
    id.startsWith("custom:")
  ) {

    const category =
      id.split(":")[1];

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

          customizeCategoryEmbed(
            player,
            category
          )

        ],

        components:
          customizeCategoryButtons(
            player,
            category
          )

      }
    );

  }

  return respond(
    env,
    interaction,
    {

      content:
        "❌ Unknown button."

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

  if (
    id.startsWith("equip:")
  ) {

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

  return respond(
    env,
    interaction,
    {

      content:
        "❌ Unknown selection."

    }
  );

}

// ============================================================
// 🚀 COMMAND REGISTRATION
// ============================================================

async function registerCommands(
  env
) {

  if (
    !env.BOT_TOKEN ||
    !env.CLIENT_ID
  ) {

    return {

      success: false,

      error:
        "Missing BOT_TOKEN or CLIENT_ID secret."

    };

  }

  const commands = [

    {

      name: "tree",

      description:
        "View your tree"

    },

    {

      name: "water",

      description:
        "Water your tree and earn EXP"

    },

    {

      name: "catch",

      description:
        "Catch a sparkle"

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

          name: "name",

          description:
            "The new name for your tree",

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
          JSON.stringify(
            commands
          )

      }

    );

  if (
    !response.ok
  ) {

    const errorText =
      await response.text();

    console.error(
      "Discord command registration failed:",
      errorText
    );

    return {

      success: false,

      error:
        `HTTP ${response.status}: ${errorText}`

    };

  }

  return {

    success: true

  };

}

// ============================================================
// 🚀 CLOUDFLARE WORKER
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
              "text/plain"

          }

        }

      );

    }

    // --------------------------------------------------------
    // COMMAND REGISTRATION
    // --------------------------------------------------------

    if (
      request.method === "GET" &&
      url.pathname === "/register"
    ) {

      const result =
        await registerCommands(
          env
        );

      return new Response(

        result.success
          ? "🌳 Global slash commands registered!"
          : `❌ Command registration failed.\n\n${result.error || ""}`,

        {

          status:
            result.success
              ? 200
              : 500

        }

      );

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
    // DISCORD PING
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // SLASH COMMAND
    // --------------------------------------------------------

    if (
      interaction.type === 2
    ) {

      return handleCommand(
        env,
        interaction
      );

    }

    // --------------------------------------------------------
    // COMPONENTS
    // --------------------------------------------------------

    if (
      interaction.type === 3
    ) {

      if (
        interaction.data?.component_type === 2
      ) {

        return handleButton(
          env,
          interaction
        );

      }

      if (
        interaction.data?.component_type === 3
      ) {

        return handleSelect(
          env,
          interaction
        );

      }

    }

    return respond(
      env,
      interaction,
      {

        content:
          "✨ Something magical happened!"

      }
    );

  }

};
