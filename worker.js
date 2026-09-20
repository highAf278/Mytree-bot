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
  halloween: "IMG_7389.png",
  candyland: "IMG_7396.png",
  cherryTree: "IMG_7259.png",
  cottonCandyTree: "IMG_7395.png",
  pumpkinCat: "IMG_7272.png",
  stonedTree: "IMG_7283.png",
  stonedBalloon: "IMG_7277.png",
  stonedBackground: "IMG_7275.jpeg",
  panda: "IMG_7401.png",
  cat: "IMG_7399.png",
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
  halloweenTree: "IMG_7387.png",
  purrPrincess: "IMG_7315.png",
  kittyTree: "IMG_7314.png",
  cozyCat: "IMG_7317.png",
  greenGlowTree: "IMG_7327.png",
  greenGlowBackground: "IMG_7324.png",
  greenGlowEffect: "IMG_7325.png",
  raccoonCourtTree: "IMG_7440.png",
  raccoonCourtStinkEffect: "IMG_7441.png",
  candyEffect: "IMG_7397.png",
  halloweenEffect: "IMG_7390.png",
  raccoonThief: "IMG_7402.png",
  frankFrog: "IMG_7403.png",
  duckHatBoots: "IMG_7405.png",
  cheddarFalls: "IMG_7404.png",
  suggestionBox: "IMG_7406.png",
  prismFlutterTree: "IMG_7363.png",
  prismFlutterBackground: "IMG_7362.png",
  prismFlutterEffect: "IMG_7361.png",
  lavenderTwilightTree: "IMG_7366.png",
  lavenderTwilightBackground: "IMG_7367.png",
  lavenderTwilightEffect: "IMG_7368.png",
  worldOfFlagsTree: "IMG_7376.png",
  worldOfFlagsBackground: "IMG_7370.png",
  worldOfFlagsEffect: "IMG_7371.png",
  oceanOpalTree: "IMG_7377.png",
  oceanOpalBackground: "IMG_7378.png",
  oceanOpalEffect: "IMG_7379.png",
  werewivesTree: "IMG_7382.png",
  werewivesBackground: "IMG_7381.png",
  werewivesEffect: "IMG_7383.png",
  goldenPickleTree: "IMG_7421.png",
  goldenPickleBackground: "IMG_7422.png",
  goldenPickleEffect: "IMG_7423.png",
  midnightRiderTree: "IMG_7424.png",
  midnightRiderBackground: "IMG_7425.png",
  midnightRiderEffect: "IMG_7426.png",
  birthdayTree: "IMG_7494.png",
  birthdayBackground: "IMG_7500.png",
  birthdayEffect: "IMG_7497.png",
  birthdayDecoration: "IMG_7499.png",
  eggwardDecoration: "IMG_7663.png",
  hedgyDecoration: "IMG_7666.png"
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
  },
  prism_flutter_tree: {
    name: "🌈🦋 Prism Flutter Tree",
    price: 25000,
    type: "tree",
    value: "prism_flutter",
    limited: true
  },
  prism_flutter_background: {
    name: "🌈🦋 Prism Flutter Background",
    price: 15000,
    type: "background",
    value: "prism_flutter",
    limited: true
  },
  prism_flutter_effect: {
    name: "🌈🦋 Prism Flutter Effect",
    price: 10000,
    type: "effect",
    value: "prism_flutter",
    limited: true
  },
  lavender_twilight_tree: {
    name: "💜🌙 Lavender Twilight Tree",
    price: 15000,
    type: "tree",
    value: "lavender_twilight",
    limited: true
  },
  lavender_twilight_background: {
    name: "💜🌙 Lavender Twilight Background",
    price: 10000,
    type: "background",
    value: "lavender_twilight",
    limited: true
  },
  lavender_twilight_effect: {
    name: "💜🌙 Lavender Twilight Effect",
    price: 10000,
    type: "effect",
    value: "lavender_twilight",
    limited: true
  },
  world_of_flags_tree: {
    name: "🌎🏳️ World of Flags Tree",
    price: 20000,
    type: "tree",
    value: "world_of_flags",
    limited: true
  },
  world_of_flags_background: {
    name: "🌎🏳️ World of Flags Background",
    price: 10000,
    type: "background",
    value: "world_of_flags",
    limited: true
  },
  world_of_flags_effect: {
    name: "🌎🏳️ World of Flags Effect",
    price: 10000,
    type: "effect",
    value: "world_of_flags",
    limited: true
  },
  ocean_opal_tree: {
    name: "🩵🌊 Ocean Opal Tree",
    price: 20000,
    type: "tree",
    value: "ocean_opal",
    limited: true
  },
  ocean_opal_background: {
    name: "🩵🌊 Ocean Opal Background",
    price: 15000,
    type: "background",
    value: "ocean_opal",
    limited: true
  },
  ocean_opal_effect: {
    name: "🩵🌊 Ocean Opal Effect",
    price: 10000,
    type: "effect",
    value: "ocean_opal",
    limited: true
  },
  candy_effect: {
    name: "🍭 Candy Rush Effect",
    price: 1000,
    type: "effect",
    value: "candy_rush"
  },
  raccoon_thief_decoration: {
    name: "🦝 Raccoon Thief",
    price: 4000,
    type: "decoration",
    value: "raccoon_thief"
  },
  frank_frog_decoration: {
    name: "🐸 Frank the Frog",
    price: 4000,
    type: "decoration",
    value: "frank_frog"
  },
  duck_hat_boots_decoration: {
    name: "🦆 Duck With Hat & Boots",
    price: 4500,
    type: "decoration",
    value: "duck_hat_boots"
  },
  cheddar_falls_decoration: {
    name: "🧀 Cheddar Falls",
    price: 5000,
    type: "decoration",
    value: "cheddar_falls"
  },
  halloween_effect: {
    name: "👻 Halloween Effect",
    price: 10000,
    type: "effect",
    value: "halloween",
    limited: true
  },
  werewives_tree: {
    name: "🐺🌙 Werewives Tree",
    price: 0,
    type: "tree",
    value: "werewives",
    freeOnly: true
  },
  werewives_background: {
    name: "🐺🌙 Werewives Background",
    price: 0,
    type: "background",
    value: "werewives",
    freeOnly: true
  },
  werewives_effect: {
    name: "🐺🌙 Werewives Effect",
    price: 0,
    type: "effect",
    value: "werewives",
    freeOnly: true
  },
  golden_pickle_tree: { name: "🥒✨ Golden Pickle Tree", price: 0, type: "tree", value: "golden_pickle", freeOnly: true },
  golden_pickle_background: { name: "🥒💛 Golden Pickle Background", price: 0, type: "background", value: "golden_pickle", freeOnly: true },
  golden_pickle_effect: { name: "🥒✨ Golden Pickle Effect", price: 0, type: "effect", value: "golden_pickle", freeOnly: true },
  midnight_rider_tree: { name: "🏍️🌙 Midnight Rider Tree", price: 0, type: "tree", value: "midnight_rider", freeOnly: true },
  midnight_rider_background: { name: "🏍️🌙 Midnight Rider Background", price: 0, type: "background", value: "midnight_rider", freeOnly: true },
  midnight_rider_effect: { name: "🏍️✨ Midnight Rider Effect", price: 0, type: "effect", value: "midnight_rider", freeOnly: true },
  petal_storm_animated_effect: { name: "🌸 Petal Storm", price: 20000, type: "effect", value: "petal_storm_animated" },
  butterfly_garden_animated_effect: { name: "🦋 Butterfly Garden", price: 30000, type: "effect", value: "butterfly_garden_animated" },
  rainbow_trail_animated_effect: { name: "🌈 Rainbow Trail", price: 40000, type: "effect", value: "rainbow_trail_animated" },
  ember_glow_animated_effect: { name: "🔥 Ember Glow", price: 50000, type: "effect", value: "ember_glow_animated" },
  meteor_shower_animated_effect: { name: "☄️ Meteor Shower", price: 60000, type: "effect", value: "meteor_shower_animated" },
  cosmic_rift_animated_effect: { name: "🌌 Cosmic Rift", price: 70000, type: "effect", value: "cosmic_rift_animated" },
  fairy_flight_animated_effect: { name: "🧚 Fairy Flight", price: 80000, type: "effect", value: "fairy_flight_animated" },
  crystal_aura_animated_effect: { name: "🔮 Crystal Aura", price: 90000, type: "effect", value: "crystal_aura_animated" },
  starfall_animated_effect: { name: "⭐ Starfall", price: 100000, type: "effect", value: "starfall_animated" },
  unicorn_sparkle_animated_effect: { name: "🦄 Unicorn Sparkle", price: 125000, type: "effect", value: "unicorn_sparkle_animated" },
  snowfall_animated_effect: { name: "❄️ Snowfall", price: 75000, type: "effect", value: "snowfall_animated" },
  flower_bloom_animated_effect: { name: "🌸 Flower Bloom", price: 85000, type: "effect", value: "flower_bloom_animated" },
  bubble_pop_animated_effect: { name: "🫧 Bubble Pop", price: 95000, type: "effect", value: "bubble_pop_animated" },
  candy_storm_animated_effect: { name: "🍬 Candy Storm", price: 110000, type: "effect", value: "candy_storm_animated" },
  kitty_parade_animated_effect: { name: "🐱 Kitty Parade", price: 120000, type: "effect", value: "kitty_parade_animated" },
  electric_storm_animated_effect: { name: "⚡ Electric Storm", price: 135000, type: "effect", value: "electric_storm_animated" },
  experimental_effect_animated_effect: { name: "🧪 Experimental Effect", price: 200000, type: "effect", value: "experimental_effect_animated" }
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
    birthdayMonth: 10,
    birthdayDay: 3,
    birthdayCandies: 0,
    birthdayGiftSends: 0,
    birthdayCollection: [],
    birthdayGifts: [],
    birthdayWishUsedDate: "",
    birthdayTricksterLast: 0,
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
    unlockedNameEffects: [],
    equippedNameEffect: "",
    pickleJailUntil: 0,
    pickleJailPreviousTitle: "",
    pickleJailFinePaid: false,
    pickleJailInteractionCount: 0,
    timeoutCornerUntil: 0,
    profileColor: "#ffd9ef",
    raccoonCourtTreeUntil: 0,
    raccoonCourtPreviousTree: "",
    raccoonCourtStinkEffectUntil: 0,
    raccoonCourtPreviousEffect: null,
    courtGameTimeoutUntil: 0,
    courtFortuneBanUntil: 0,
    courtRaccoonBanUntil: 0,
    courtRecycleBanUntil: 0,
    courtRiddleBanUntil: 0,
    courtUtilityLockUntil: 0,
    courtProbationUntil: 0,
    courtWatchUntil: 0,
    courtCriminalRecordUntil: 0,
    courtPreviousTitle: "",
    courtShameCornerUntil: 0,
    courtRaccoonTitleUntil: 0,
    courtRaccoonPreviousTitle: "",
    courtWatchLastAt: 0,
    courtPublicShameUntil: 0,
    courtPublicShameLastAt: 0,
    courtLastFiledAt: 0,
    courtLastTargetedDay: "",
    courtTrashReleaseUntil: 0,
    courtTrashReleaseNextAt: 0,
    courtTrashReleaseChannelId: "",
    courtSpoonInvestigationUntil: 0,
    courtSpoonInvestigationLastAt: 0,
    courtTreeConfiscationUntil: 0,
    courtCases: 0,
    courtGuilty: 0,
    courtNotGuilty: 0,
    surpriseAlertClaimed: false,
    freeGiftClaimed: false,
    freeGoldenPickleClaimed: false,
    freeMidnightRiderClaimed: false,
    freeBeansClaimed: false,
    freeEggwardClaimed: false,
    freeHedgyClaimed: false,
    shopPurchases: 0,
    treeChecks: 0,
    catItemBought: false,
    achievements: [],
    pastelRating: 0,
    pastelLevel: 0,
    pastelWins: 0,
    pastelLosses: 0,
    pastelQuits: 0,
    pastelGamesPlayed: 0,
    pastelSparklesEarned: 0,
    chaosIslandWins: 0,
    heistWins: 0,
    battleWins: 0,
    battleSparklesEarned: 0,
    battleLosses: 0,
    battleStreak: 0,
    battleBestStreak: 0,
    battleLowHpWins: 0,
    experimentGames: 0,
    experimentCompleted: 0,
    experimentSuccesses: 0,
    experimentXP: 0,
    seenNewsIds: []
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
      // The TREE_DATA key is the authoritative owner ID. Never trust a
      // userId stored inside the JSON record, because a stale/corrupted
      // record must never be allowed to migrate into another account.
      userId: String(userId),
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
          ? [...new Set(player.titles)]
          : [],
      unlockedNameEffects:
        Array.isArray(player.unlockedNameEffects)
          ? [...new Set(player.unlockedNameEffects)]
          : [],
      sparklesOnTree:
        Array.isArray(player.sparklesOnTree)
          ? player.sparklesOnTree
          : [],
      birthdayCollection: Array.isArray(player.birthdayCollection) ? player.birthdayCollection : [],
      birthdayGifts: Array.isArray(player.birthdayGifts) ? player.birthdayGifts : [],
      equipped: {
        ...defaultPlayer().equipped,
        ...(player.equipped || {})
      }
    };

    const candyDate = easternDateKey();
    if (merged.birthdayCandyDate && merged.birthdayCandyDate !== candyDate) { merged.birthdayCandies = 0; merged.birthdayGiftSends = 0; merged.birthdayCandyDate = candyDate; }
    if (!merged.birthdayCandyDate && Number(merged.birthdayCandies||0) > 0) merged.birthdayCandyDate = candyDate;

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


/* =========================================================
   TITLES + NAME EFFECTS + PROFILE CARDS
========================================================= */

const NAME_EFFECTS = {
  rainbow: { name: "🌈 Rainbow", requirement: "Own 10 or more shop items." },
  starlight: { name: "✨ Starlight", requirement: "Reach 50,000 sparkles." },
  petals: { name: "🌸 Petals", requirement: "Own 4 or more trees." },
  inferno: { name: "🔥 Inferno", requirement: "Win Chaos Island." },
  green_glow: { name: "💚 Green Glow", requirement: "Own the Green Glow Tree." },
  candy_rush: { name: "🍭 Candy Rush", requirement: "Win Color Chaos." },
  cosmic: { name: "🌌 Cosmic", requirement: "Grow your tree to 5 ft." },
  firework: { name: "🎆 Firework", requirement: "Win 10 Chaos Island games." },
  royal_blood: { name: "🩸 Royal Blood", requirement: "Win 25 Chaos Island games." },
  enchanted: { name: "🪄 Enchanted", requirement: "Complete 10 Solo Missions." },
  royal_purple: { name: "👑 Royal Purple", requirement: "Reach Color Chaos Level 25." },
  butterflies: { name: "🦋 Butterflies", requirement: "Complete 5 different Limited Shop sets." },
  shadow: { name: "🖤 Shadow", requirement: "Win 50 Heist games." },
  frostbite: { name: "❄️ Frostbite", requirement: "Win 25 Color Chaos games." },
  golden: { name: "💛✨ Golden", requirement: "Reach 100,000 sparkles." },
  spooky: { name: "👻 Spooky", requirement: "Own the complete Halloween set." }
};

function unlockOwnedTitle(player, id) {
  if (!Array.isArray(player.titles)) player.titles = [];
  if (!player.titles.includes(id) && SOLO_TITLES[id]) {
    player.titles.push(id);
    return true;
  }
  return false;
}

function unlockNameEffects(player) {
  if (!Array.isArray(player.unlockedNameEffects)) player.unlockedNameEffects = [];
  const owned = Array.isArray(player.inventory) ? player.inventory : [];
  const shopOwned = owned.filter(id => Boolean(SHOP_ITEMS[id])).length;
  const treeIds = new Set([
    "cherry", "cotton_candy_tree", "stoned_birthday_tree", "shadow_tree",
    "full_cherry_tree", "pine_tree", "red_tree", "soul_tree", "kitty_tree",
    "halloween_tree", "green_glow_tree", "prism_flutter_tree", "lavender_twilight_tree",
    "world_of_flags_tree", "ocean_opal_tree", "werewives_tree"
  ]);
  const treeCount = owned.filter(id => treeIds.has(id)).length + (owned.includes("cherry") ? 0 : 1);
  const limitedSets = [
    ["cats", ["purr_princess_effect", "kitty_tree", "cozy_cat_background"]],
    ["green_glow", ["green_glow_tree", "green_glow_background", "green_glow_effect"]],
    ["prism_flutter", ["prism_flutter_tree", "prism_flutter_background", "prism_flutter_effect"]],
    ["lavender_twilight", ["lavender_twilight_tree", "lavender_twilight_background", "lavender_twilight_effect"]],
    ["world_of_flags", ["world_of_flags_tree", "world_of_flags_background", "world_of_flags_effect"]],
    ["ocean_opal", ["ocean_opal_tree", "ocean_opal_background", "ocean_opal_effect"]],
    ["halloween", ["halloween_tree", "halloween_background", "halloween_effect"]]
  ];
  const completedLimitedSets = limitedSets.filter(([,ids]) => ids.every(id => owned.includes(id))).length;
  const halloweenComplete = ["halloween_tree", "halloween_background", "halloween_effect"].every(id => owned.includes(id));
  const checks = {
    rainbow: shopOwned >= 10,
    starlight: Number(player.sparkles || 0) >= 50000,
    petals: treeCount >= 4,
    inferno: Number(player.chaosIslandWins || 0) > 0,
    green_glow: owned.includes("green_glow_tree"),
    candy_rush: Number(player.pastelWins || 0) > 0,
    cosmic: Number(getTreeHeight(player) || 0) >= 5,
    firework: Number(player.chaosIslandWins || 0) >= 10,
    royal_blood: Number(player.chaosIslandWins || 0) >= 25,
    enchanted: Number(player.soloRuns || 0) >= 10,
    royal_purple: Number(player.pastelLevel || 0) >= 25,
    butterflies: completedLimitedSets >= 5,
    shadow: Number(player.heistWins || 0) >= 50,
    frostbite: Number(player.pastelWins || 0) >= 25,
    golden: Number(player.sparkles || 0) >= 100000,
    spooky: halloweenComplete
  };
  for (const [id, ok] of Object.entries(checks)) if (ok && !player.unlockedNameEffects.includes(id)) player.unlockedNameEffects.push(id);
  if (checks.firework) unlockOwnedTitle(player, "firework_fiend");
  if (checks.royal_blood) unlockOwnedTitle(player, "royal_blood");
  if (checks.enchanted) unlockOwnedTitle(player, "enchanted_one");
  if (checks.royal_purple) unlockOwnedTitle(player, "royal_purple");
  if (checks.butterflies) unlockOwnedTitle(player, "butterfly_keeper");
  if (checks.shadow) unlockOwnedTitle(player, "shadow_walker");
  if (checks.frostbite) unlockOwnedTitle(player, "frostbite");
  if (checks.golden) unlockOwnedTitle(player, "golden_legend");
  if (checks.spooky) unlockOwnedTitle(player, "haunted");
  if (player.equippedNameEffect && !player.unlockedNameEffects.includes(player.equippedNameEffect)) player.equippedNameEffect = "";
}

function nameEffectText(effectId, titleText, phase = 0) {
  const text = String(titleText || "").trim();
  if (!text) return `<span class="titlePlain">No Title</span>`;
  const safe = escapeHTML(text);
  if (effectId === "rainbow") {
    const chars = [...text].map((ch, i) => {
      const hue = Math.round(((phase + i / Math.max(1, text.length)) % 1) * 360);
      return `<span style="color:hsl(${hue},90%,70%);text-shadow:0 0 1px rgba(255,255,255,.95),0 0 3px rgba(255,120,220,.35)">${ch === " " ? "&nbsp;" : escapeHTML(ch)}</span>`;
    }).join("");
    return `<span class="effect-rainbow">${chars}</span>`;
  }
  if (effectId === "candy_rush") {
    const hues=[330,205,275,48];
    const chars=[...text].map((ch,i)=>`<span style="color:hsl(${hues[i%4]},90%,75%);text-shadow:0 0 1px rgba(255,255,255,.95),0 0 3px rgba(255,160,220,.35)">${ch === " " ? "&nbsp;" : escapeHTML(ch)}</span>`).join("");
    return `<span class="effect-candy_rush">${chars}</span>`;
  }
  if (effectId === "petals") return `<span class="effect-petals"><span class="petalGlow">${safe}</span></span>`;
  if (effectId === "cosmic") return `<span class="effect-cosmic"><span class="cosmicGlow">${safe}</span></span>`;
  if (effectId === "green_glow") return `<span class="effect-green_glow"><span class="greenGlowText">${safe}</span></span>`;
  const configs={
    starlight:{colors:["#ffffff","#c9d7ff"],shadow:"0 0 6px #fff,0 0 18px rgba(170,195,255,.95)"},
    inferno:{colors:["#ffd36a","#ff8b32","#ff3b22"],shadow:"0 0 8px #ff8b32,0 0 20px rgba(255,60,0,.9)"},
    firework:{colors:["#ff7ac8","#7ddcff","#ffe56b","#c79cff"],shadow:"0 0 6px #fff,0 0 18px rgba(255,180,240,.9)"},
    royal_blood:{colors:["#ff4a5f","#a40022","#ffd36b"],shadow:"0 0 7px #ff2948,0 0 20px rgba(150,0,35,.9)"},
    enchanted:{colors:["#ff9be8","#c28cff","#8e7cff","#ffd4ff"],shadow:"0 0 7px #fff,0 0 19px rgba(190,120,255,.9)"},
    royal_purple:{colors:["#d9a7ff","#8e4dff","#f5d77a"],shadow:"0 0 7px #fff,0 0 20px rgba(125,60,255,.9)"},
    butterflies:{colors:["#ffb7ee","#9fe7ff","#d8b5ff","#fff"],shadow:"0 0 6px #fff,0 0 17px rgba(190,170,255,.85)"},
    shadow:{colors:["#eeeeee","#777777","#222222"],shadow:"0 0 3px #fff,0 0 12px rgba(0,0,0,.95)"},
    frostbite:{colors:["#ffffff","#b9efff","#72cfff","#dff9ff"],shadow:"0 0 7px #fff,0 0 21px rgba(80,205,255,.95)"},
    golden:{colors:["#fff7b0","#ffd95a","#fff2a0","#d99a16"],shadow:"0 0 4px #fff,0 0 10px #ffe477,0 0 22px rgba(255,190,35,.95),0 0 34px rgba(255,220,100,.7)"},
    spooky:{colors:["#ffffff","#d49cff","#ff9b45","#9d6bff"],shadow:"0 0 5px #fff,0 0 17px rgba(150,80,255,.9)"}
  };
  const cfg=configs[effectId]||{colors:["#ffffff"],shadow:"0 0 12px rgba(255,255,255,.65)"};
  const chars=[...text].map((ch,i)=>{
    const x=(phase+i/Math.max(1,text.length))%1;
    const idx=Math.floor(x*cfg.colors.length)%cfg.colors.length;
    let color=cfg.colors[idx],shadow=cfg.shadow;
    if(effectId==="golden"){
      const shimmer=Math.sin((phase+i/Math.max(1,text.length))*Math.PI*2);
      color=shimmer>.35?"#ffffff":(shimmer<-.35?"#e7ad27":"#ffe56b");
      shadow=`${cfg.shadow},0 0 ${Math.round(8+(shimmer+1)*5)}px rgba(255,255,255,.9)`;
    }
    return `<span style="color:${color};text-shadow:${shadow}">${ch === " " ? "&nbsp;" : escapeHTML(ch)}</span>`;
  }).join("");
  return `<span class="effect-${escapeHTML(effectId)}">${chars}</span>`;
}
function profileCardHTML(player, phase = 0) {
  const bg = /^#[0-9a-fA-F]{6}$/.test(player.profileColor || "") ? player.profileColor : "#ffd9ef";
  const titleId = player.equippedTitle && SOLO_TITLES[player.equippedTitle] ? player.equippedTitle : "";
  const title = titleId ? SOLO_TITLES[titleId].name : "No Title";
  const effectId = player.equippedNameEffect && NAME_EFFECTS[player.equippedNameEffect] ? player.equippedNameEffect : "";
  const effect = effectId ? NAME_EFFECTS[effectId].name : "No Name Effect";
  const tree = imageUrl(getTreeImage(player));
  const decor = getDecorationImage(player);
  const decorUrl = decor ? imageUrl(decor) : "";
  const titleMarkup = nameEffectText(effectId, title, phase);
  const particleMap = {
    rainbow:["✦","✧","·","★"], starlight:["✦","✧","★","·"], petals:["✦","·","✧","✦"],
    inferno:["✦","·","✦","·"], green_glow:["✦","·","✦","·"], candy_rush:["✦","·","✧","✦"], cosmic:["✦","✧","·","★"],
    firework:["✦","·","✧","★"], royal_blood:["✦","·","★","✦"], enchanted:["✧","✦","·","★"],
    royal_purple:["✦","·","✧","★"], butterflies:["✧","·","✦","✧"], shadow:["·","✦","·","★"],
    frostbite:["✧","·","✦","✧"], golden:["✦","·","★","✦"], spooky:["✦","·","✧","★"]
  };
  const particleSet=particleMap[effectId]||[];
  const particles=particleSet.length?particleSet.map((symbol,i)=>`<span class="particle p${i}" style="left:${18+i*24}%;top:${18+(i%2)*58}%">${symbol}</span>`).join(""):"";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;background:#222;font-family:Arial,sans-serif}#card{width:800px;height:500px;background:${bg};border:8px solid rgba(255,255,255,.9);border-radius:34px;overflow:hidden;position:relative;color:#2a2030;box-shadow:0 12px 40px rgba(0,0,0,.28)}
    .wash{position:absolute;inset:0;background:transparent}.tree{position:absolute;left:2%;bottom:-4%;width:350px;height:430px;object-fit:contain;filter:drop-shadow(0 10px 10px rgba(0,0,0,.15))}.decor{position:absolute;left:21%;bottom:9%;width:125px;height:125px;object-fit:contain}.panel{position:absolute;left:330px;right:24px;top:24px;bottom:24px;background:color-mix(in srgb, ${bg} 86%, white 14%);border-radius:25px;padding:24px}.name{font-size:32px;font-weight:900}.subtitle{font-size:17px;opacity:.72;margin-top:4px}.titleBox{margin-top:26px;background:color-mix(in srgb, ${bg} 72%, white 28%);border-radius:20px;padding:20px 14px;text-align:center;min-height:92px}.title{font-size:34px;font-weight:900;letter-spacing:.4px}.effect{font-size:15px;margin-top:10px;font-weight:700}.stats{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:18px}.badge{margin-top:18px;font-size:14px;opacity:.8}
    .effect-petals,.effect-cosmic,.effect-green_glow{display:inline-block;position:relative;line-height:1.05;min-width:10px}.petalGlow{color:#f58bc6;text-shadow:0 0 1px #fff,0 0 3px rgba(255,135,205,.45)}.petalAccent{position:absolute;font-size:20px;line-height:1}.petalA{left:-22px;top:-7px}.petalB{right:-22px;bottom:-8px}.cosmicGlow{color:#7a86ef;text-shadow:0 0 1px #fff,0 0 3px rgba(120,125,255,.45)}.cosmicOrbit{position:absolute;left:-10px;right:-10px;top:48%;height:20px;border:1px solid rgba(120,140,255,.75);border-radius:50%;transform:rotate(-7deg);box-shadow:0 0 3px rgba(120,150,255,.55);pointer-events:none}.cosmicSpark{position:absolute;color:#9ba7ff;font-size:15px;text-shadow:0 0 7px #fff}.cs1{left:-22px;top:2px}.cs2{right:-18px;top:10px}.cs3{right:-10px;bottom:-8px}.greenGlowText{color:#54dc63;text-shadow:0 0 1px #fff,0 0 3px rgba(80,255,100,.45)}.greenHeart{position:absolute;font-size:22px;line-height:1;filter:drop-shadow(0 0 5px rgba(60,255,80,.8))}.gh1{left:-27px;top:-8px}.gh2{right:-27px;bottom:-8px}.greenSpark{position:absolute;color:#58e86a;font-size:15px;text-shadow:0 0 7px #fff}.gs1{left:-17px;bottom:-5px}.gs2{right:-16px;top:-8px}.effect-firework,.effect-royal_blood,.effect-enchanted,.effect-royal_purple,.effect-butterflies,.effect-shadow,.effect-frostbite,.effect-golden,.effect-spooky{display:inline-block;position:relative;line-height:1.05;min-width:10px}.effect-golden{filter:drop-shadow(0 0 5px rgba(255,210,70,.65))}.effect-shadow{filter:drop-shadow(0 0 4px rgba(0,0,0,.9))}.particle{position:absolute;font-size:15px;font-family:Arial,sans-serif;font-weight:700;z-index:3;filter:drop-shadow(0 0 3px rgba(255,255,255,.65));pointer-events:none;opacity:.9}.p0{animation:floatA 2.8s ease-in-out infinite}.p1{animation:floatB 3.2s ease-in-out infinite .25s}.p2{animation:floatA 3.5s ease-in-out infinite .5s}.p3{animation:floatB 2.9s ease-in-out infinite .75s}@keyframes floatA{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-7px) rotate(4deg)}}@keyframes floatB{0%,100%{transform:translateY(0) rotate(4deg)}50%{transform:translateY(7px) rotate(-4deg)}}
  </style></head><body><div id="card"><div class="wash"></div><img class="tree" src="${tree}">${decorUrl?`<img class="decor" src="${decorUrl}">`:""}<div class="panel"><div class="name">${escapeHTML(player.displayName || player.username || "Werewife")}</div><div class="subtitle">Werewives Profile ✨</div><div class="titleBox"><div class="title">${titleMarkup}</div><div class="effect">✨ ${escapeHTML(effect)}</div></div><div class="stats"><div>🌳 Level <b>${Number(player.level||1)}</b></div><div>✨ ${Number(player.sparkles||0).toLocaleString()}</div><div>📏 ${Number(getTreeHeight(player)||0)} ft</div><div>🏆 ${Number(player.soloWins||0)} Solo Wins</div></div><div class="badge">🏷️ ${player.titles?.length||0} titles owned</div></div>${particles}</div></body></html>`;
}

async function renderAnimatedProfile(env, player) {
  let browser;
  try {
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({width:800,height:500,deviceScaleFactor:1});
    await page.setContent(profileCardHTML(player,0),{waitUntil:"load"});
    await page.evaluate(async()=>{await Promise.all(Array.from(document.images).map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r;})))});
    const frames=[];
    const frameCount=8;
    for(let i=0;i<frameCount;i++){
      const phase=i/frameCount;
      await page.evaluate((html)=>{document.open();document.write(html);document.close();}, profileCardHTML(player,phase));
      await page.evaluate(async()=>{await Promise.all(Array.from(document.images).map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r;})))});
      frames.push(await page.screenshot({type:"png"}));
    }
    return await encodePNGFramesToGIF(frames,800,500,12);
  } finally { if(browser) await browser.close().catch(()=>{}); }
}

async function decodePNG(pngBytes) {
  const b=pngBytes instanceof Uint8Array?pngBytes:new Uint8Array(pngBytes); const sig=[137,80,78,71,13,10,26,10]; for(let i=0;i<8;i++)if(b[i]!==sig[i])throw new Error("Invalid PNG");
  let pos=8,w=0,h=0,ct=0,bd=0,parts=[];
  while(pos<b.length){const len=(b[pos]<<24|b[pos+1]<<16|b[pos+2]<<8|b[pos+3])>>>0;const type=String.fromCharCode(...b.slice(pos+4,pos+8));const data=b.slice(pos+8,pos+8+len);pos+=12+len;if(type==="IHDR"){w=(data[0]<<24|data[1]<<16|data[2]<<8|data[3])>>>0;h=(data[4]<<24|data[5]<<16|data[6]<<8|data[7])>>>0;bd=data[8];ct=data[9];}else if(type==="IDAT")parts.push(data);else if(type==="IEND")break;}
  if(bd!==8||(ct!==6&&ct!==2))throw new Error("Unsupported PNG format");
  const compressed=new Uint8Array(parts.reduce((a,x)=>a+x.length,0));let off=0;for(const x of parts){compressed.set(x,off);off+=x.length;}
  let raw;try{raw=new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer());}catch{raw=new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());}
  const bpp=ct===6?4:3,stride=w*bpp,out=new Uint8Array(w*h*4);let rp=0,prev=new Uint8Array(stride);
  for(let y=0;y<h;y++){const filter=raw[rp++];const row=raw.slice(rp,rp+stride);rp+=stride;for(let x=0;x<stride;x++){const left=x>=bpp?row[x-bpp]:0,up=prev[x]||0,ul=x>=bpp?(prev[x-bpp]||0):0;let v=row[x];if(filter===1)v=(v+left)&255;else if(filter===2)v=(v+up)&255;else if(filter===3)v=(v+Math.floor((left+up)/2))&255;else if(filter===4){const p=left+up-ul,pa=Math.abs(p-left),pb=Math.abs(p-up),pc=Math.abs(p-ul);v=(v+(pa<=pb&&pa<=pc?left:pb<=pc?up:ul))&255;}row[x]=v;}for(let x=0;x<w;x++){const q=y*w+x,o=x*bpp;out[q*4]=row[o];out[q*4+1]=row[o+1];out[q*4+2]=row[o+2];out[q*4+3]=ct===6?row[o+3]:255;}prev=row;}
  return {width:w,height:h,data:out};
}

function gifPalette(){const p=[];for(let r=0;r<6;r++)for(let g=0;g<6;g++)for(let b=0;b<6;b++)p.push([r*51,g*51,b*51]);for(let i=0;i<40;i++){const v=Math.round(i*255/39);p.push([v,v,v]);}return p;}
function nearestPaletteIndex(r,g,b,p){
  const rr=Math.max(0,Math.min(5,Math.round(r/51)));
  const gg=Math.max(0,Math.min(5,Math.round(g/51)));
  const bb=Math.max(0,Math.min(5,Math.round(b/51)));
  return rr*36+gg*6+bb;
}
function gifLZW(indices){
  const clear=256,end=257,codeSize=9,blockSize=240;
  const codes=[];
  for(let start=0;start<indices.length;start+=blockSize){
    codes.push(clear);
    const endAt=Math.min(indices.length,start+blockSize);
    for(let i=start;i<endAt;i++) codes.push(indices[i]);
  }
  codes.push(end);
  const bytes=[];
  let cur=0,bits=0;
  for(const code of codes){
    cur|=(code<<bits);
    bits+=codeSize;
    while(bits>=8){
      bytes.push(cur&255);
      cur>>=8;
      bits-=8;
    }
  }
  if(bits>0) bytes.push(cur&255);
  return bytes;
}
function u16(n){return [n&255,(n>>8)&255];}
async function encodePNGFramesToGIF(pngFrames,width,height,delayCs=10){
  const palette=gifPalette(),out=[];
  const push=(...xs)=>out.push(...xs);

  push(...new TextEncoder().encode("GIF89a"));
  push(...u16(width),...u16(height),0xF7,0,0);
  for(const c of palette) push(...c);

  push(
    0x21,0xFF,0x0B,
    ...new TextEncoder().encode("NETSCAPE2.0"),
    0x03,0x01,0x00,0x00,0x00
  );

  for(const png of pngFrames){
    const f=await decodePNG(png);
    const idx=new Uint8Array(width*height);

    for(let i=0;i<idx.length;i++){
      idx[i]=nearestPaletteIndex(
        f.data[i*4],
        f.data[i*4+1],
        f.data[i*4+2],
        palette
      );
    }

    push(
      0x21,0xF9,0x04,0x00,
      ...u16(delayCs),
      0x00,0x00,
      0x2C,
      ...u16(0),...u16(0),
      ...u16(width),...u16(height),
      0x00,0x08
    );

    const lzw=gifLZW(idx);
    for(let i=0;i<lzw.length;i+=255){
      const chunk=lzw.slice(i,i+255);
      push(chunk.length,...chunk);
    }
    push(0);
  }

  push(0x3B);
  return new Uint8Array(out);
}

function gifSubBlocks(bytes){const out=[];for(let i=0;i<bytes.length;i+=255){const chunk=bytes.slice(i,i+255);out.push(chunk.length,...chunk);}out.push(0);return out;}
function gifGraphicControl(out,delayCs,disposal=0,transparent=false,transparentIndex=255){
  out.push(0x21,0xF9,0x04,(disposal<<2)|(transparent?1:0),...u16(delayCs),transparent?transparentIndex:0,0);
}
function gifImage(out,x,y,width,height,indices){
  out.push(0x2C,...u16(x),...u16(y),...u16(width),...u16(height),0x00,0x08,...gifSubBlocks(gifLZW(indices)));
}
async function encodeStaticPlusTransparentGIF(staticPng,overlayPngs,width,height,delayCs=12){
  const palette=gifPalette(),out=[];const push=(...xs)=>out.push(...xs);
  push(...new TextEncoder().encode("GIF89a"));
  push(...u16(width),...u16(height),0xF7,0,0);
  for(const c of palette)push(...c);
  push(0x21,0xFF,0x0B,...new TextEncoder().encode("NETSCAPE2.0"),0x03,0x01,0x00,0x00,0x00);

  const base=await decodePNG(staticPng);
  const baseIdx=new Uint8Array(width*height);
  for(let i=0;i<baseIdx.length;i++)baseIdx[i]=nearestPaletteIndex(base.data[i*4],base.data[i*4+1],base.data[i*4+2],palette);
  gifGraphicControl(out,delayCs,0,false);
  gifImage(out,0,0,width,height,baseIdx);

  for(const png of overlayPngs){
    const f=await decodePNG(png);
    const idx=new Uint8Array(width*height);
    idx.fill(255);
    for(let i=0;i<idx.length;i++){
      const a=f.data[i*4+3];
      if(a>20) idx[i]=nearestPaletteIndex(f.data[i*4],f.data[i*4+1],f.data[i*4+2],palette);
    }
    // Disposal 3 restores the static frame after each confetti overlay, so
    // confetti from the previous frame never gets left behind. Transparent
    // pixels expose the static tree underneath.
    gifGraphicControl(out,delayCs,3,true,255);
    gifImage(out,0,0,width,height,idx);
  }
  push(0x3B);
  return new Uint8Array(out);
}

async function renderProfileDirectAnimated(env,player){
  const frames=[];
  const frameCount=8;
  for(let i=0;i<frameCount;i++) frames.push(await renderProfileDirectFrame(env,player,i/frameCount));
  return await encodePNGFramesToGIF(frames,800,500,12);
}
async function renderProfileDirect(env,player){
  return await renderProfileDirectFrame(env,player,0);
}

async function editOriginalResponseWithFile(env, interaction, content, filename, bytes, contentType = "image/gif") {
  const form = new FormData();
  form.append("payload_json", JSON.stringify({ content, attachments: [{ id: 0, filename }] }));
  form.append("files[0]", new Blob([bytes], { type: contentType }), filename);
  return fetch(
    `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,
    { method: "PATCH", body: form }
  );
}

async function handleProfile(env, interaction) {
  const user=getUserFromInteraction(interaction); if(!user)return;
  const targetId=getOption(interaction,"user")||user.id;
  const player=await getPlayer(env,targetId);
  if(targetId===user.id) updatePlayerIdentity(player,interaction);
  if(targetId===user.id) await savePlayer(env,player,user.id);
  const title=player.equippedTitle&&SOLO_TITLES[player.equippedTitle]?SOLO_TITLES[player.equippedTitle].name:"No Title";
  const effect=player.equippedNameEffect&&NAME_EFFECTS[player.equippedNameEffect]?NAME_EFFECTS[player.equippedNameEffect].name:"None";
  try{
    // Direct Worker-side GIF rendering: no Browser Rendering/WebSocket dependency.
    const gif=await renderProfileDirectAnimated(env,player);
    const response=await editOriginalResponseWithFile(
      env,interaction,
      `🌸 **${escapeHTML(player.displayName||player.username||"Werewife")}**'s Profile\n🏷️ ${escapeHTML(title)}\n✨ Name Effect: ${escapeHTML(effect)}`,
      "werewives-profile.gif",gif,"image/gif"
    );
    if(!response.ok)throw new Error(`Profile upload failed: ${response.status} ${await response.text()}`);
  }catch(error){
    console.error("Profile animated direct render failed",error);
    try{
      const png=await renderProfileDirect(env,player);
      const response=await editOriginalResponseWithFile(
        env,interaction,
        `🌸 **${escapeHTML(player.displayName||player.username||"Werewife")}**'s Profile\n🏷️ ${escapeHTML(title)}\n✨ Name Effect: ${escapeHTML(effect)}`,
        "werewives-profile.png",png,"image/png"
      );
      if(!response.ok)throw new Error(`Profile fallback upload failed: ${response.status} ${await response.text()}`);
    }catch(fallbackError){
      console.error("Profile direct fallback failed",fallbackError);
      await editOriginalResponse(env,interaction,{content:`🌸 **${player.displayName||player.username||"Werewife"}**'s Profile\n\n🏷️ ${title}\n✨ Name Effect: ${effect}\n🎨 Background: ${player.profileColor||"#ffd9ef"}`});
    }
  }
}
async function handleProfileColor(env,interaction,value){const user=getUserFromInteraction(interaction);if(!user)return;const player=await getPlayer(env,user.id);await refreshPunishmentState(env,player);if(Number(player.raccoonCourtTreeUntil||0)>Date.now())return sendText(env,interaction,`💩🌳 Your Stink Tree sentence is active for **${punishmentTimeText(player.raccoonCourtTreeUntil)}** more. Panel customization is locked.`);const v=String(value||"").trim();if(v.toLowerCase()==="reset"){player.profileColor="#ffd9ef";await savePlayer(env,player);return sendText(env,interaction,"🎨 Profile background reset to the default color. 💗");}if(!/^#[0-9a-fA-F]{6}$/.test(v))return sendText(env,interaction,"❌ Use a 6-digit HEX color like `#FFB6E6`, or use `reset`.");player.profileColor=v.toUpperCase();await savePlayer(env,player);await sendText(env,interaction,`🎨 Your profile background is now **${player.profileColor}**!`);}

async function handleNameEffectEquip(env,interaction,effectId){
  const user=getUserFromInteraction(interaction);
  if(!user)return;
  const player=await getPlayer(env,user.id);
  if(effectId==="none"){
    player.equippedNameEffect="";
    await savePlayer(env,player);
    const response=await editOriginalResponse(env,interaction,titleEditData(await buildTitlesResponseData(env,interaction,"effects",0)));
    if(!response.ok) console.error("Name effect unequip menu refresh failed:",response.status,await response.text());
    return;
  }
  if(!NAME_EFFECTS[effectId]||!player.unlockedNameEffects.includes(effectId))return sendText(env,interaction,"🔒 You haven't unlocked that Name Effect yet.");
  player.equippedNameEffect=effectId;
  await savePlayer(env,player);
  const response=await editOriginalResponse(env,interaction,titleEditData(await buildTitlesResponseData(env,interaction,"effects",0)));
  if(!response.ok) console.error("Name effect menu refresh failed:",response.status,await response.text());
}

/* =========================================================
   PRIVATE SURPRISE ALERT — LOVA

   Each player gets this one-time surprise on their next normal bot
   interaction. It is sent as an ephemeral follow-up so nobody else
   in the server can see it. The correct choice is NO KILL.
========================================================= */

function surpriseAlertComponents() {
  return [
    row(
      button("🔪 KILL", "surprise_alert:kill", 4),
      button("🕊️ NO KILL", "surprise_alert:no_kill", 3)
    )
  ];
}

async function showSurpriseAlert(env, interaction) {
  const content = [
    "🚨 **ALERT** 🚨",
    "",
    "**LOVA HAS BEEN VOTED TO THE STAND.**",
    "",
    "🔪 **KILL** or 🕊️ **NO KILL?**",
    "",
    "Choose carefully... 👀"
  ].join("\n");
  await sendEphemeralFollowup(env, interaction, content, surpriseAlertComponents());
}

async function maybeShowSurpriseAlert(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return false;
  // Alert choices themselves must never spawn another alert.
  const customId = String(interaction.data?.custom_id || "");
  if (customId.startsWith("surprise_alert:")) return false;

  // Keep this surprise one-time per player, including players who already
  // existed before this feature was added. Missing means not yet claimed.
  const player = await getPlayer(env, user.id);
  if (player.surpriseAlertClaimed) return false;

  // Claim before sending so two near-simultaneous interactions cannot create
  // duplicate alerts. The normal interaction handler runs afterward.
  player.surpriseAlertClaimed = true;
  await savePlayer(env, player);
  await showSurpriseAlert(env, interaction);
  return true;
}

async function handleSurpriseAlertChoice(env, interaction, choice) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);

  if (choice === "kill") {
    await savePlayer(env, player);
    await sendText(
      env,
      interaction,
      "🚨 **LOVA IS INNOCENT, you lose NAB!** 😭💀",
      []
    );
    return;
  }

  if (choice === "no_kill") {
    player.sparkles = Number(player.sparkles || 0) + 1000;
    await savePlayer(env, player);
    await sendText(
      env,
      interaction,
      "🚨 **LOVA IS INNOCENT!** 🕊️\n\nYOU DIDN'T KILL HER! 😭💖\n\n🎉 **+1,000 sparkles!** ✨",
      []
    );
  }
}


function punishmentTimeText(until) {
  const remaining = Math.max(0, Number(until || 0) - Date.now());
  const totalMinutes = Math.ceil(remaining / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"}${minutes > 0 ? ` and ${minutes} minute${minutes === 1 ? "" : "s"}` : ""}`;
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function activePunishment(player) {
  const now = Date.now();
  if (Number(player.pickleJailUntil || 0) > now) return "pickle";
  if (Number(player.timeoutCornerUntil || 0) > now) return "corner";
  if (Number(player.courtGameTimeoutUntil || 0) > now) return "court_game";
  if (Number(player.courtShameCornerUntil || 0) > now) return "court_shame_corner";
  return "";
}

async function refreshPunishmentState(env, player) {
  const now = Date.now();
  let changed = false;
  if (Number(player.pickleJailUntil || 0) > 0 && Number(player.pickleJailUntil || 0) <= now) {
    player.equippedTitle = player.pickleJailPreviousTitle || "";
    player.pickleJailUntil = 0;
    player.pickleJailPreviousTitle = "";
    player.pickleJailFinePaid = false;
    player.pickleJailInteractionCount = 0;
    changed = true;
  }
  if (Number(player.timeoutCornerUntil || 0) > 0 && Number(player.timeoutCornerUntil || 0) <= now) {
    player.timeoutCornerUntil = 0;
    changed = true;
  }
  if (Number(player.raccoonCourtTreeUntil || 0) > 0 && Number(player.raccoonCourtTreeUntil || 0) <= now) {
    player.equipped = player.equipped || {};
    player.equipped.tree = player.raccoonCourtPreviousTree || "cherry";
    player.raccoonCourtTreeUntil = 0;
    player.raccoonCourtPreviousTree = "";
    changed = true;
  }
  if (Number(player.raccoonCourtStinkEffectUntil || 0) > 0 && Number(player.raccoonCourtStinkEffectUntil || 0) <= now) {
    player.equipped = player.equipped || {};
    player.equipped.effect = player.raccoonCourtPreviousEffect ?? null;
    player.raccoonCourtStinkEffectUntil = 0;
    player.raccoonCourtPreviousEffect = null;
    changed = true;
  }
  if (Number(player.courtTrashReleaseUntil || 0) > 0 && Number(player.courtTrashReleaseUntil || 0) <= now) {
    player.courtTrashReleaseUntil = 0; player.courtTrashReleaseNextAt = 0; player.courtTrashReleaseChannelId = ""; changed = true;
  }
  const timerFields = [
    "courtGameTimeoutUntil", "courtFortuneBanUntil", "courtRaccoonBanUntil",
    "courtRecycleBanUntil", "courtRiddleBanUntil", "courtUtilityLockUntil",
    "courtProbationUntil", "courtWatchUntil", "courtCriminalRecordUntil",
    "courtShameCornerUntil", "courtRaccoonTitleUntil", "courtPublicShameUntil",
    "courtSpoonInvestigationUntil", "courtTreeConfiscationUntil"
  ];
  for (const field of timerFields) {
    if (Number(player[field] || 0) > 0 && Number(player[field] || 0) <= now) {
      player[field] = 0;
      changed = true;
    }
  }
  if (!Number(player.courtCriminalRecordUntil || 0) && player.courtPreviousTitle && !Number(player.pickleJailUntil || 0)) {
    player.equippedTitle = player.courtPreviousTitle;
    player.courtPreviousTitle = "";
    changed = true;
  }
  if (!Number(player.courtRaccoonTitleUntil || 0) && player.courtRaccoonPreviousTitle) {
    if (!Number(player.pickleJailUntil || 0) && !Number(player.courtCriminalRecordUntil || 0)) player.equippedTitle = player.courtRaccoonPreviousTitle;
    player.courtRaccoonPreviousTitle = "";
    changed = true;
  }
  if (changed) await savePlayer(env, player, player.userId);
  return activePunishment(player);
}

function punishmentBlockedText(player, punishment) {
  if (punishment === "pickle") {
    return `🥒 **PICKLE JAIL!**\n\nYou are locked up for **${punishmentTimeText(player.pickleJailUntil)}** more.\n\n🎮 Games are still allowed.\n🚫 You cannot use **/fortune**, **/daily-riddle**, or **/recycle** while jailed.\n🥒 **THE PICKLES KNOW WHAT YOU DID🥒**`;
  }
  if (punishment === "corner") {
    return `🪑 **CORNER TIME!**\n\nGo sit in the corner for **${punishmentTimeText(player.timeoutCornerUntil)}** more. 😭\n\n🚫 Games are off-limits until your sentence is over.`;
  }
  if (punishment === "court_game") {
    return `⚖️🦝 **RACCOON COURT GAME TIMEOUT!**\n\nYou are banned from games for **${punishmentTimeText(player.courtGameTimeoutUntil)}** more.\n\nThe court has confiscated your fun. 😭`;
  }
  if (punishment === "court_shame_corner") {
    return `🪑🦝 **SHAME CORNER!**\n\nYou are sentenced to the corner for **${punishmentTimeText(player.courtShameCornerUntil)}** more.\n\n🚫 No games until the raccoons say so.\n📢 Your dignity is not covered by insurance.`;
  }
  return "";
}
async function requireOwner(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user || user.id !== env.OWNER_ID) {
    await sendText(env, interaction, "❌ Nice try. These punishment commands belong to the Werewives owner. 😭");
    return false;
  }
  return true;
}


async function sendUserDM(env, userId, content) {
  try {
    const dm = await discordRequest(env, "/users/@me/channels", {
      method: "POST",
      body: JSON.stringify({ recipients: [userId] })
    });
    if (!dm.ok) throw new Error(`DM channel ${dm.status}`);
    const channel = await dm.json();
    const message = await discordRequest(env, `/channels/${channel.id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content })
    });
    if (!message.ok) throw new Error(`DM message ${message.status}`);
    return true;
  } catch (error) {
    console.error("Raccoon Court DM failed:", error);
    return false;
  }
}

function courtCharge() {
  const charges = [
    "First-degree tomfoolery", "Unauthorized shenanigans", "Suspicious sparkle activity",
    "Aggravated raccoon misconduct", "Crimes against the tree", "Excessive menace behavior",
    "Unlicensed chaos", "Disturbing the Werewives peace", "Possession of suspicious sparkles",
    "Failure to respect the pickle authority", "Reckless button pressing", "Conspiracy to cause nonsense"
  ];
  return charges[randomInt(0, charges.length - 1)];
}

const COURT_JUDGES = [
  { name:"🥒 Judge Pickles", lines:[
    "Judge Pickles has reviewed the evidence. Unfortunately, the evidence smells suspicious.",
    "Order in the trash can! Judge Pickles is ready to judge.",
    "The raccoons have consulted the pickle. The pickle has concerns.",
    "Judge Pickles has entered the courtroom and immediately distrusted everyone.",
    "The pickle has been presented with the facts. The pickle is unimpressed."
  ]},
  { name:"🧇 Judge Waffles", lines:[
    "Judge Waffles has arrived. Please remain calm and do not eat the evidence.",
    "After careful consideration... Judge Waffles would like a waffle.",
    "The Court is now in session. Breakfast will be served after the verdict.",
    "Judge Waffles has reviewed the case and would like to remind everyone that waffles are innocent.",
    "The evidence has been stacked. Much like waffles. Judge Waffles approves."
  ]},
  { name:"💩 Judge Stinky", lines:[
    "Judge Stinky has entered the courtroom. Unfortunately, so has the smell.",
    "The evidence has been sniffed. This is already looking bad.",
    "Order! ORDER! Somebody open a window!",
    "Judge Stinky has requested that the defendant stop pretending not to smell the problem.",
    "The Court has detected suspicious odors. The defendant is somehow involved."
  ]},
  { name:"☢️🦝 Judge Rabid Raccoon", lines:[
    "RABID RACCOON COURT IS NOW IN SESSION. EVERYONE PANIC.",
    "The defendant has been examined. Judge Rabid Raccoon has decided to become louder.",
    "SILENCE IN THE COURTROOM! THE RACCOON IS RABID!",
    "Judge Rabid Raccoon has reviewed the case and is now aggressively pointing at the defendant.",
    "THE COURT WILL NOW PROCEED WITH MAXIMUM RACCOON ENERGY."
  ]},
  { name:"🪨 Judge Stoney", lines:[
    "Judge Stoney has reached a verdict... eventually.",
    "Please wait while Judge Stoney thinks about this.",
    "The Court has considered the evidence. Judge Stoney is still considering the evidence.",
    "Judge Stoney has reviewed the case. There will now be a brief period of absolutely nothing.",
    "After deep consideration, Judge Stoney has decided that this case is... interesting."
  ]}
];
function courtRandomJudge(){ return COURT_JUDGES[randomInt(0,COURT_JUDGES.length-1)]; }
function courtDayKey(){ const d=new Date(); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`; }

const COURT_PUNISHMENTS = [
  { id:"fine", name:"💸 Raccoon Tax Audit" },
  { id:"extortion", name:"🦝💰 Raccoon Extortion Fee" },
  { id:"game", name:"🚫 Game Time-Out" },
  { id:"fortune", name:"🔮 Fortune Ban" },
  { id:"raccoon", name:"🦝 Raccoon Ban" },
  { id:"recycle", name:"♻️ Recycling Suspension" },
  { id:"riddle", name:"🧩 Riddle Suspension" },
  { id:"utility", name:"🔒 Utility Lockdown" },
  { id:"pickle", name:"🥒 Pickle Probation" },
  { id:"watch", name:"👀 Raccoon Surveillance" },
  { id:"record", name:"🏷️ Criminal Record" },
  { id:"shame_corner", name:"🪑 Shame Corner" },
  { id:"stink_tree", name:"💩🌳 The Stink Tree" },
  { id:"appointed_raccoon", name:"🦝 Court-Appointed Raccoon" },
  { id:"public_shame", name:"📢🦝 Public Shame" },
  { id:"trash_release", name:"🗑️ Trash Can Release" },
  { id:"spoon_investigation", name:"🥄 Spoon Investigation" },
  { id:"tree_confiscation", name:"🌳 Tree Confiscation" }
];

const COURT_MESSAGES = {
  fine:["The raccoons audited your pockets and found them suspiciously taxable.","Your sparkle finances have been reviewed by creatures with zero accounting licenses.","The court has decided your wallet looks guilty.","Congratulations! You have been selected for an extremely unnecessary sparkle audit."],
  extortion:["A raccoon has politely demanded a totally legal-looking protection fee.","Your sparkles are now paying rent to the raccoon mafia.","The raccoons call it a fee. Everyone else calls it robbery with paperwork.","You have been billed for existing in a raccoon-controlled economy."],
  game:["Your gaming privileges have been confiscated by Judge Raccoon.","Go stare at the game buttons from a safe legal distance.","The court has temporarily revoked your right to press Play.","Your controller has been declared emotionally unavailable to you."],
  fortune:["The Fortune Tree refuses to predict your future until you learn your lesson.","Your fortune has been placed on administrative leave.","The crystal ball has seen enough.","No fortunes for you. The tree has unionized against your nonsense."],
  raccoon:["Your raccoon has been suspended from criminal activity.","The raccoon union has filed a restraining order against your nonsense.","Your tiny crime department is officially closed.","Your raccoon has been sent home with a strongly worded note."],
  recycle:["The recycling bin looked at you and locked itself.","Your sparkle recycling license has been shredded.","No recycling until the raccoons stop judging your decisions.","The recycling machine has entered witness protection."],
  riddle:["The riddle committee has decided you have had enough brain privileges for now.","Your daily riddle has been confiscated for suspicious intelligence activity.","The riddle goblins have slammed the file shut.","Your brain has been placed on a temporary paperwork delay."],
  utility:["The court has put your useful buttons on vacation.","Several of your favorite commands have been placed in raccoon timeout.","Your utility privileges have been sealed with an unnecessarily official sticker.","The raccoons have unplugged your fun, metaphorically."],
  pickle:["You are now on probation under the authority of the Pickle Department.","The pickles have agreed to release you eventually. They did not say when.","You have been placed under extremely crunchy supervision.","Probation has been granted. Dignity has not."],
  watch:["Court Watch has been activated. The raccoons are absolutely side-eyeing you.","A suspiciously tiny courtroom camera is now watching your nonsense.","Judge Raccoon has appointed several invisible spies.","Every button you press is now being judged by raccoons."],
  record:["Your criminal record now has a suspicious amount of raccoon paperwork.","Your file has been stamped: EXTREMELY SUSPECT.","Congratulations on your temporary entry into the Werewives criminal archives.","The clerk has written 'probably did it' in your file."],
  shame_corner:["The court has reserved you a premium seat in the Shame Corner.","Please report to the corner and think about what you have done. Or don't. The raccoons don't care.","Your sentence includes one corner and approximately zero dignity.","The Shame Corner has been prepared. It is judging you already."],
  stink_tree:["Your tree has been reassigned to the Department of Bad Smells.","The raccoons have selected a tree that perfectly matches your legal situation.","Your cosmetics have been replaced by consequences.","Welcome to the Stink Tree era. Please enjoy the fumes responsibly."],
  appointed_raccoon:["The court has assigned you a raccoon supervisor.","You are now under professional raccoon management.","Your new legal guardian is a raccoon with a clipboard.","A raccoon has been appointed to supervise your future nonsense."],
  public_shame:["The court has sentenced you to six hours of public embarrassment.","Your crimes have been upgraded to a community announcement.","The raccoons have decided everyone deserves to know you are being silly.","Your dignity has been placed on a six-hour public trial."],
  trash_release:["The trash can has reviewed your finances and would like another payment.","The raccoons found Sparkles in your pockets. This is unfortunate for you.","Payment accepted. Freedom denied.","The trash can is hungry again.","Raccoon Finance has processed another completely unnecessary fee."],
  spoon_investigation:["We know you have the spoon.","The spoon was last seen near you. Explain.","Stop pretending you do not have the spoon.","The Court remains convinced you are hiding the spoon.","THE SPOON. WHERE IS IT?"],
  tree_confiscation:["The Court has seized your tree pending further raccoon review.","Your tree has been placed into legal custody.","The raccoons have confiscated the tree. Do not attempt to negotiate.","The Court has determined that your tree is currently evidence.","Your tree has been escorted away by extremely suspicious raccoons."]
};

function courtRandomMessage(id) { const a=COURT_MESSAGES[id]||[]; return a[randomInt(0, Math.max(0,a.length-1))] || "The raccoons have spoken."; }
function courtUntil(minutes){ return Date.now()+minutes*60000; }

function applyCourtPunishment(target, id) {
  const now=Date.now();
  target.equipped=target.equipped||{};
  let detail="";
  if(id==="fine"){
    const requested=randomInt(100,5000), actual=Math.min(requested,Math.max(0,Number(target.sparkles||0)));
    target.sparkles=Math.max(0,Number(target.sparkles||0)-actual);
    detail=`💸 **Sparkle Fine:** ${actual.toLocaleString()} sparkles confiscated.`;
  } else if(id==="extortion"){
    const pct=randomInt(10,25), actual=Math.min(Math.floor(Number(target.sparkles||0)*pct/100),Math.max(0,Number(target.sparkles||0)));
    target.sparkles=Math.max(0,Number(target.sparkles||0)-actual);
    detail=`🦝💰 **Extortion Fee:** ${actual.toLocaleString()} sparkles (${pct}% of your balance) confiscated.`;
  } else if(id==="game"){
    target.courtGameTimeoutUntil=Math.max(Number(target.courtGameTimeoutUntil||0),courtUntil(randomInt(30,360)));
    detail=`🚫 **Game Time-Out:** ${punishmentTimeText(target.courtGameTimeoutUntil)}.`;
  } else if(id==="fortune"){
    target.courtFortuneBanUntil=Math.max(Number(target.courtFortuneBanUntil||0),courtUntil(randomInt(1,8)*60));
    detail=`🔮 **Fortune Ban:** ${punishmentTimeText(target.courtFortuneBanUntil)}.`;
  } else if(id==="raccoon"){
    target.courtRaccoonBanUntil=Math.max(Number(target.courtRaccoonBanUntil||0),courtUntil(randomInt(1,8)*60));
    detail=`🦝 **Raccoon Ban:** ${punishmentTimeText(target.courtRaccoonBanUntil)}.`;
  } else if(id==="recycle"){
    target.courtRecycleBanUntil=Math.max(Number(target.courtRecycleBanUntil||0),courtUntil(randomInt(1,8)*60));
    detail=`♻️ **Recycling Suspension:** ${punishmentTimeText(target.courtRecycleBanUntil)}.`;
  } else if(id==="riddle"){
    target.courtRiddleBanUntil=Math.max(Number(target.courtRiddleBanUntil||0),courtUntil(randomInt(1,8)*60));
    detail=`🧩 **Riddle Suspension:** ${punishmentTimeText(target.courtRiddleBanUntil)}.`;
  } else if(id==="utility"){
    target.courtUtilityLockUntil=Math.max(Number(target.courtUtilityLockUntil||0),courtUntil(randomInt(2,8)*60));
    detail=`🔒 **Utility Lockdown:** ${punishmentTimeText(target.courtUtilityLockUntil)}. Fortune, raccoon, recycle and riddle are disabled.`;
  } else if(id==="pickle"){
    target.courtProbationUntil=Math.max(Number(target.courtProbationUntil||0),courtUntil(randomInt(4,12)*60));
    detail=`🥒 **Pickle Probation:** ${punishmentTimeText(target.courtProbationUntil)}. Games remain allowed, but utility commands are restricted.`;
  } else if(id==="watch"){
    target.courtWatchUntil=Math.max(Number(target.courtWatchUntil||0),courtUntil(randomInt(2,8)*60));
    detail=`👀 **Raccoon Surveillance:** ${punishmentTimeText(target.courtWatchUntil)}.`;
  } else if(id==="record"){
    if(!Number(target.courtCriminalRecordUntil||0)) target.courtPreviousTitle=target.equippedTitle||"";
    target.courtCriminalRecordUntil=Math.max(Number(target.courtCriminalRecordUntil||0),courtUntil(randomInt(4,12)*60));
    target.equippedTitle="criminal";
    detail=`🏷️ **Criminal Record:** Criminal title locked for ${punishmentTimeText(target.courtCriminalRecordUntil)}.`;
  } else if(id==="shame_corner"){
    target.courtShameCornerUntil=Math.max(Number(target.courtShameCornerUntil||0),courtUntil(randomInt(1,4)*60));
    detail=`🪑 **Shame Corner:** ${punishmentTimeText(target.courtShameCornerUntil)}. No games.`;
  } else if(id==="stink_tree"){
    if(!Number(target.raccoonCourtTreeUntil||0)) target.raccoonCourtPreviousTree=target.equipped.tree||"cherry";
    if(!Number(target.raccoonCourtStinkEffectUntil||0)) target.raccoonCourtPreviousEffect=target.equipped.effect??null;
    const until=courtUntil(24*60);
    target.raccoonCourtTreeUntil=until;
    target.raccoonCourtStinkEffectUntil=until;
    target.equipped.tree="raccoon_court";
    target.equipped.effect="raccoon_court_stink";
    detail=`💩🌳 **The Stink Tree:** exactly **24 hours**. ALL customization is locked until the sentence ends.`;
  } else if(id==="appointed_raccoon"){
    if(!Number(target.courtRaccoonTitleUntil||0)) target.courtRaccoonPreviousTitle=target.equippedTitle||"";
    target.courtRaccoonTitleUntil=Math.max(Number(target.courtRaccoonTitleUntil||0),courtUntil(randomInt(4,12)*60));
    target.equippedTitle="court_raccoon";
    detail=`🦝 **Court-Appointed Raccoon:** ${punishmentTimeText(target.courtRaccoonTitleUntil)}. Title changes are restricted.`;
  } else if(id==="public_shame"){
    target.courtPublicShameUntil=Math.max(Number(target.courtPublicShameUntil||0),courtUntil(6*60));
    target.courtPublicShameLastAt=0;
    detail=`📢🦝 **Public Shame:** exactly **6 hours**. Public shaming can appear at most once every **20 minutes**.`;
  } else if(id==="trash_release"){
    target.courtTrashReleaseUntil=Math.max(Number(target.courtTrashReleaseUntil||0),courtUntil(6*60));
    target.courtTrashReleaseNextAt=now+30*60000;
    detail=`🗑️ **Trash Can Release:** 6 hours. Every 30 minutes the raccoons collect a random Sparkle fee. If you cannot afford the full fee, they take whatever you have.`;
  } else if(id==="spoon_investigation"){
    target.courtSpoonInvestigationUntil=Math.max(Number(target.courtSpoonInvestigationUntil||0),courtUntil(10*60));
    target.courtSpoonInvestigationLastAt=0;
    detail=`🥄 **Spoon Investigation:** 10 hours. The bot will randomly insist that you have the missing spoon.`;
  } else if(id==="tree_confiscation"){
    target.courtTreeConfiscationUntil=Math.max(Number(target.courtTreeConfiscationUntil||0),courtUntil(6*60));
    detail=`🌳 **Tree Confiscation:** ${punishmentTimeText(target.courtTreeConfiscationUntil)}. Your tree is temporarily unavailable until the Court returns it.`;
  }
  return detail;
}

async function getCourtLeaderboard(env) {
  const rows=[];
  for(const userId of await listAllPlayerKeys(env)){
    try{
      const player=await getPlayer(env,userId);
      const cases=Number(player.courtCases||0);
      const guilty=Number(player.courtGuilty||0);
      const notGuilty=Number(player.courtNotGuilty||0);
      if(cases>0||guilty>0||notGuilty>0)rows.push({userId,displayName:player.displayName||player.username||"Werewife",cases,guilty,notGuilty});
    }catch(error){console.error(`Court leaderboard player read failed for ${userId}:`,error);}
  }
  rows.sort((a,b)=>b.guilty-a.guilty||b.cases-a.cases||b.notGuilty-a.notGuilty||String(a.displayName).localeCompare(String(b.displayName)));
  return rows;
}

async function handleCourtLeaderboard(env, interaction) {
  const rows=await getCourtLeaderboard(env);
  if(!rows.length)return sendText(env,interaction,"🦝⚖️ **RACCOON COURT LEADERBOARD**\n\nNo one has been to Court yet. The raccoons are waiting. 👀");
  const topGuilty=rows[0].guilty;
  let championText="";
  if(topGuilty>0){
    const leaders=rows.filter(r=>r.guilty===topGuilty);
    championText=`\n🏆 **Current Court Champion:** ${leaders.slice(0,5).map(r=>`<@${r.userId}>`).join(", ")}\n🦝 **Title:** *the Raccoons' Favorite Criminal*\n`;
    for(const leader of leaders){
      try{
        const player=await getPlayer(env,leader.userId);
        if(!Array.isArray(player.titles))player.titles=[];
        if(!player.titles.includes("court_favorite")){player.titles.push("court_favorite");await savePlayer(env,player);}
      }catch(error){console.error(`Court champion title update failed for ${leader.userId}:`,error);}
    }
  }
  const lines=rows.slice(0,10).map((r,i)=>`${i+1}. <@${r.userId}> — **${r.cases} cases** • 🔴 ${r.guilty} guilty • 🟢 ${r.notGuilty} not guilty`);
  return sendText(env,interaction,`🦝⚖️ **RACCOON COURT LEADERBOARD**\n\n${lines.join("\n")}${championText}\n📊 Ranked by **guilty verdicts**, then total cases.\n🦝 The raccoons are keeping score.`);
}

async function handleCourt(env, interaction) {
  const user=getUserFromInteraction(interaction); if(!user)return;
  const targetId=getOption(interaction,"user");
  if(!targetId)return sendText(env,interaction,"🦝⚖️ The Raccoon Court needs a defendant.");
  if(String(targetId)===String(user.id))return sendText(env,interaction,"🦝⚖️ You cannot put yourself on trial. The raccoons have standards. Barely.");
  const now=Date.now();
  const accuser=await getPlayer(env,user.id); await refreshPunishmentState(env,accuser);
  const sixHours=6*60*60000;
  if(Number(accuser.courtLastFiledAt||0)>0 && now-Number(accuser.courtLastFiledAt)<sixHours)return sendText(env,interaction,`⏳🦝 **COURT IS CLOSED FOR YOU.**\n\nYou must wait **${punishmentTimeText(Number(accuser.courtLastFiledAt)+sixHours)}** before filing another case.`);
  const target=await getPlayer(env,targetId); await refreshPunishmentState(env,target);
  const day=courtDayKey();
  if(String(target.courtLastTargetedDay||"")===day)return sendText(env,interaction,"🚫🦝 **THIS DEFENDANT HAS ALREADY BEEN TO COURT TODAY.**\n\nThe raccoons will not hear another case against them until tomorrow.");
  accuser.courtLastFiledAt=now; target.courtLastTargetedDay=day;
  const caseNumber=`RAC-${randomInt(100000,999999)}`; const charge=courtCharge();
  const judge=courtRandomJudge(); const judgeLine=judge.lines[randomInt(0,judge.lines.length-1)];
  const guilty=randomInt(1,100)<=55;
  target.courtCases=Number(target.courtCases||0)+1;
  target.courtGuilty=Number(target.courtGuilty||0)+(guilty?1:0);
  target.courtNotGuilty=Number(target.courtNotGuilty||0)+(guilty?0:1);
  let punishment="",punishmentName="";
  if(guilty){const chosen=COURT_PUNISHMENTS[randomInt(0,COURT_PUNISHMENTS.length-1)];punishmentName=chosen.name;if(chosen.id==="trash_release")target.courtTrashReleaseChannelId=String((await getGuildState(env,interaction.guild_id))?.announcementChannelId||interaction.channel_id||"");punishment=applyCourtPunishment(target,chosen.id)+`\n\n📜 ${courtRandomMessage(chosen.id)}`;}
  await savePlayer(env,accuser,user.id); await savePlayer(env,target,targetId);
  if(guilty && Number(target.courtGuilty||0)>0){
    try{
      const rows=await getCourtLeaderboard(env);
      const highest=rows.length?rows[0].guilty:0;
      if(Number(target.courtGuilty||0)>=highest){
        if(!Array.isArray(target.titles))target.titles=[];
        if(!target.titles.includes("court_favorite")){target.titles.push("court_favorite");await savePlayer(env,target,targetId);}
      }
    }catch(error){console.error("Court champion title update failed:",error);}
  }
  const verdict=guilty?"🔴 **GUILTY**":"🟢 **NOT GUILTY**";
  const innocentLine=`🦝 ${judge.name} has released you. ${judgeLine}`;
  const full=guilty?`🦝⚖️ **THE RACCOON COURT**\n\n👨‍⚖️ **Presiding Judge:** ${judge.name}\n🗯️ *${judgeLine}*\n\n📁 **Case:** ${caseNumber}\n👤 **Defendant:** <@${targetId}>\n📜 **Charge:** ${charge}\n\n**VERDICT:** ${verdict}\n\n🔨 **SENTENCE:**\n**${punishmentName}**\n${punishment}\n\n🦝 The court has spoken. Do not argue with the raccoons.`:`🦝⚖️ **THE RACCOON COURT**\n\n👨‍⚖️ **Presiding Judge:** ${judge.name}\n🗯️ *${judgeLine}*\n\n📁 **Case:** ${caseNumber}\n👤 **Defendant:** <@${targetId}>\n📜 **Charge:** ${charge}\n\n**VERDICT:** ${verdict}\n\n${innocentLine}\n\n**CASE CLOSED.**`;
  await sendUserDM(env,targetId,full);
  const guildState=interaction.guild_id?await getGuildState(env,interaction.guild_id):null; const announcementChannelId=guildState?.announcementChannelId||null;
  if(announcementChannelId){
    let avatarUrl="https://cdn.discordapp.com/embed/avatars/0.png";
    try{const userResponse=await discordRequest(env,`/users/${targetId}`);if(userResponse.ok){const discordUser=await userResponse.json();if(discordUser.avatar){const extension=String(discordUser.avatar).startsWith("a_")?"gif":"png";avatarUrl=`https://cdn.discordapp.com/avatars/${targetId}/${discordUser.avatar}.${extension}?size=128`;}else if(discordUser.id){const discriminator=Number(BigInt(discordUser.id)>>22n)%6;avatarUrl=`https://cdn.discordapp.com/embed/avatars/${discriminator}.png`;}}}catch(avatarError){console.error("Court avatar lookup failed:",avatarError);}
    const publicEmbed={title:"🦝⚖️ THE RACCOON COURT",description:guilty?`**${verdict}**\n\n🔨 **SENTENCE:**\n**${punishmentName}**\n${punishment}`:`**${verdict}**\n\n${innocentLine}\n\n**CASE CLOSED.**`,color:guilty?0xD94A4A:0x4CAF50,fields:[{name:"👨‍⚖️ Judge",value:judge.name,inline:true},{name:"📁 Case",value:`**${caseNumber}**`,inline:true},{name:"👤 Defendant",value:`<@${targetId}>`,inline:true},{name:"📜 Charge",value:charge,inline:false}],author:{name:`${target.displayName||target.username||"Werewife"} — Court Defendant`,icon_url:avatarUrl},thumbnail:{url:avatarUrl},footer:{text:`Raccoon Court • ${judge.name} has spoken. 🦝⚖️`},timestamp:new Date().toISOString()};
    await sendChannelMessage(env,announcementChannelId,"🦝⚖️ **Raccoon Court Case Filed**",[],{embeds:[publicEmbed]});
  }
  await sendText(env,interaction,`🦝⚖️ Court case **${caseNumber}** completed for <@${targetId}>.`);
}

async function handlePickleJail(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const targetId = getOption(interaction, "user");
  const duration = Number(getOption(interaction, "duration") || 0);
  if (!targetId || !duration || duration < 1 || duration > 10080) {
    return sendText(env, interaction, "🥒 Pickle Jail needs a player and a duration from **1–10080 minutes**.");
  }
  const target = await getPlayer(env, targetId);
  await refreshPunishmentState(env, target);
  const now = Date.now();
  if (!target.pickleJailUntil || target.pickleJailUntil <= now) {
    target.pickleJailPreviousTitle = target.equippedTitle || "";
  }
  target.pickleJailUntil = now + duration * 60000;
  target.pickleJailFinePaid = true;
  target.pickleJailInteractionCount = 0;
  target.equippedTitle = "criminal";
  const requestedFine = randomInt(100, 2000);
  const actualFine = Math.min(requestedFine, Math.max(0, Number(target.sparkles || 0)));
  target.sparkles = Math.max(0, Number(target.sparkles || 0) - actualFine);
  await savePlayer(env,target,targetId);
  const fineText = actualFine === requestedFine ? `${actualFine.toLocaleString()} sparkles` : `${actualFine.toLocaleString()} sparkles (they didn't have enough for the full fine 😭)`;
  await sendText(env, interaction, `🥒 **PICKLE JAIL SENTENCE!**\n\n<@${targetId}> has been locked up for **${punishmentTimeText(target.pickleJailUntil)}**.\n\n💸 **Guard Fine:** ${fineText}\n\n🚨 The guards searched their pockets and confiscated the sparkles.\n🥒 **THE PICKLES KNOW WHAT YOU DID🥒**`);
}

async function handleCornerTimeout(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const targetId = getOption(interaction, "user");
  const duration = Number(getOption(interaction, "duration") || 0);
  if (!targetId || !duration || duration < 1 || duration > 10080) {
    return sendText(env, interaction, "🪑 Corner Time needs a player and a duration from **1–10080 minutes**.");
  }
  const target = await getPlayer(env, targetId);
  await refreshPunishmentState(env, target);
  target.timeoutCornerUntil = Date.now() + duration * 60000;
  await savePlayer(env,target,targetId);
  await sendText(env, interaction, `🪑 **CORNER TIME!**\n\n<@${targetId}> has been sentenced to the corner for **${punishmentTimeText(target.timeoutCornerUntil)}**. 😭\n\n🚫 No games until the sentence is over.\n\nPlease sit there quietly and reconsider your life choices.`);
}

function gamePunishmentMessage(punishment) {
  if (punishment === "pickle") return "🥒 **THE PICKLES KNOW WHAT YOU DID🥒** 🚨";
  if (punishment === "corner") return "🪑 **CORNER TIME!** You are supposed to be sitting in the corner, not playing games. 😭";
  if (punishment === "court_game") return "⚖️🦝 **THE RACCOON COURT HAS CONFISCATED YOUR GAMING PRIVILEGES.** 🚨";
  if (punishment === "court_shame_corner") return "🪑🦝 **SHAME CORNER.** The court said no games for you. 😭";
  return "";
}

async function maybePickleJailReminder(env, interaction, player) {
  if (!player || !interaction?.channel_id) return;
  const until = Number(player.pickleJailUntil || 0);
  if (until <= Date.now()) return;
  player.pickleJailInteractionCount = Number(player.pickleJailInteractionCount || 0) + 1;
  if (player.pickleJailInteractionCount >= 15) {
    player.pickleJailInteractionCount = 0;
    await savePlayer(env, player, player.userId);
    await sendChannelMessage(env, interaction.channel_id, gamePunishmentMessage("pickle"));
    return;
  }
  await savePlayer(env, player, player.userId);
}

async function checkGamePunishment(env, interaction) {
  const user=getUserFromInteraction(interaction); if(!user)return "";
  const player=await getPlayer(env,user.id); const punishment=await refreshPunishmentState(env,player);
  if(punishment==="pickle") { await maybePickleJailReminder(env,interaction,player); return ""; }
  if(["corner","court_game","court_shame_corner"].includes(punishment)) { await sendText(env,interaction,punishmentBlockedText(player,punishment)); return punishment; }
  return "";
}

const PUBLIC_SHAME_MESSAGES = [
  "📢🦝 COURT NOTICE: this player has been sentenced to public embarrassment. Please act normal. They clearly cannot.",
  "🦝⚖️ The court has requested that everyone politely point at this defendant and whisper: 'suspicious.'",
  "🚨 RACCOON COURT BULLETIN: <@USER> has been caught committing an alarming amount of nonsense.",
  "📢 <@USER> has been placed on the Court's Very Silly List. Please do not let them near the buttons.",
  "🦝 The raccoons would like everyone to know that <@USER> is currently under public legal scrutiny for tomfoolery.",
  "⚖️ PUBLIC SHAME UPDATE: <@USER> has once again appeared before the court of terrible decisions.",
  "🚨 <@USER> has been observed interacting with the bot despite the court's extremely judgmental presence.",
  "🦝⚖️ Attention everyone: <@USER> has been legally classified as 'a problem' for the next several hours.",
  "📢 The court has no further comment regarding <@USER>'s questionable button-pressing career.",
  "🦝 PUBLIC SERVICE ANNOUNCEMENT: if <@USER> says they are innocent, the raccoons recommend laughing politely.",
  "⚖️ <@USER> has entered the courtroom. Unfortunately, the courtroom has entered them right back into public shame.",
  "🚨 The Raccoon Court would like to remind everyone that <@USER> made choices. Many choices."
];

const COURT_WATCH_MESSAGES = [
  "👀🦝 **COURT WATCH:** <@USER> has been spotted interacting with the bot. The raccoons have taken notes.",
  "⚖️👀 Judge Raccoon has observed <@USER> pressing another button. Suspicious.",
  "🚨🦝 COURT WATCH ALERT: <@USER> has been detected doing suspicious Werewives activities.",
  "👀 The invisible raccoon surveillance team has logged <@USER>'s latest activity.",
  "🦝📋 The court clerk has added another line to <@USER>'s very suspicious file."
];
async function maybeCourtWatch(env,interaction){
  const user=getUserFromInteraction(interaction); if(!user||!interaction.guild_id||!interaction.channel_id)return;
  const player=await getPlayer(env,user.id); await refreshPunishmentState(env,player);
  if(Number(player.courtWatchUntil||0)<=Date.now())return;
  const now=Date.now(); if(Number(player.courtWatchLastAt||0) && now-Number(player.courtWatchLastAt)<30*60000)return;
  player.courtWatchLastAt=now; await savePlayer(env,player,user.id);
  const msg=COURT_WATCH_MESSAGES[randomInt(0,COURT_WATCH_MESSAGES.length-1)].replaceAll("<@USER>",`<@${user.id}>`);
  await sendChannelMessage(env,interaction.channel_id,msg);
}

async function maybePublicShame(env,interaction){
  const user=getUserFromInteraction(interaction); if(!user||!interaction.guild_id||!interaction.channel_id)return;
  const player=await getPlayer(env,user.id); await refreshPunishmentState(env,player);
  if(Number(player.courtPublicShameUntil||0)<=Date.now())return;
  const now=Date.now();
  if(Number(player.courtPublicShameLastAt||0) && now-Number(player.courtPublicShameLastAt)<20*60000)return;
  player.courtPublicShameLastAt=now; await savePlayer(env,player,user.id);
  const msg=PUBLIC_SHAME_MESSAGES[randomInt(0,PUBLIC_SHAME_MESSAGES.length-1)].replaceAll("<@USER>",`<@${user.id}>`);
  await sendChannelMessage(env,interaction.channel_id,msg);
}

async function maybeSpoonInvestigation(env,interaction){
  const user=getUserFromInteraction(interaction); if(!user||!interaction.guild_id||!interaction.channel_id)return;
  const player=await getPlayer(env,user.id); await refreshPunishmentState(env,player);
  if(Number(player.courtSpoonInvestigationUntil||0)<=Date.now())return;
  const now=Date.now(); if(Number(player.courtSpoonInvestigationLastAt||0) && now-Number(player.courtSpoonInvestigationLastAt)<30*60000)return;
  if(Math.random()>0.45)return;
  player.courtSpoonInvestigationLastAt=now; await savePlayer(env,player,user.id);
  const msg=COURT_MESSAGES.spoon_investigation[randomInt(0,COURT_MESSAGES.spoon_investigation.length-1)];
  await sendChannelMessage(env,interaction.channel_id,`🥄🦝 **SPOON INVESTIGATION:** <@${user.id}> — ${msg}`);
}

async function buildTitlesResponseData(env, interaction, section="home", page=0) {
  const user=getUserFromInteraction(interaction); if(!user) throw new Error("Could not determine your Discord account.");
  const player=await getPlayer(env,user.id); updatePlayerIdentity(player,interaction); unlockNameEffects(player);
  const owned=player.titles.filter(id=>SOLO_TITLES[id]);
  const effectIds=player.unlockedNameEffects.filter(id=>NAME_EFFECTS[id]);
  const rows=[];
  const equippedTitle=player.equippedTitle&&SOLO_TITLES[player.equippedTitle]?SOLO_TITLES[player.equippedTitle].name:"None";
  const equippedEffect=player.equippedNameEffect&&NAME_EFFECTS[player.equippedNameEffect]?NAME_EFFECTS[player.equippedNameEffect].name:"None";
  if(section==="home"){
    rows.push(row(button("🏆 My Titles", "title:list", 2), button("✨ Name Effects", "nameeffect:list", 2)));
    rows.push(row(button("❌ Unequip Title", "title:unequip", 4), button("✨ Unequip Effect", "nameeffect:equip:none", 4)));
    return {embeds:[{title:"🏷️ TITLES & NAME EFFECTS",description:`⭐ **Equipped Title:** ${equippedTitle}\n✨ **Equipped Name Effect:** ${equippedEffect}\n\nChoose a category below. Your collections are separated so the menu stays clean and easy to use.`}],components:rows,flags:64};
  }
  const list=section==="titles"?owned:effectIds;
  const size=5, pageCount=Math.max(1,Math.ceil(list.length/size)); page=Math.max(0,Math.min(Number(page)||0,pageCount-1));
  const slice=list.slice(page*size,page*size+size);
  if (slice.length) rows.push(row(...slice.map(id=>button(
    section==="titles"
      ? (player.equippedTitle===id?`⭐ ${SOLO_TITLES[id].name}`:`🏷️ ${SOLO_TITLES[id].name}`)
      : (player.equippedNameEffect===id?`⭐ ${NAME_EFFECTS[id].name}`:NAME_EFFECTS[id].name),
    section==="titles"?`title:equip:${id}`:`nameeffect:equip:${id}`,
    player.equippedTitle===id||player.equippedNameEffect===id?3:2
  ))));
  if(pageCount>1) {
    const pagePrefix = section === "titles" ? "title" : "nameeffect";
    rows.push(row(
      button("⬅️ Previous",`${pagePrefix}:page:${page-1}`,2,page===0),
      button(`Page ${page+1}/${pageCount}`,`${pagePrefix}:page:current`,2,true),
      button("Next ➡️",`${pagePrefix}:page:${page+1}`,2,page===pageCount-1)
    ));
  }
  rows.push(row(button("⬅️ Back", "title:home", 2)));
  const description=section==="titles"
    ? `🏆 **MY TITLES**\n\n⭐ Equipped: **${equippedTitle}**\n\n${slice.length?slice.map(id=>`${player.equippedTitle===id?"⭐":"🏷️"} **${SOLO_TITLES[id].name}** — ${SOLO_TITLES[id].description}`).join("\n"):"No titles unlocked yet."}`
    : `✨ **NAME EFFECTS**\n\n⭐ Equipped: **${equippedEffect}**\n\n${slice.length?slice.map(id=>`${player.equippedNameEffect===id?"⭐":"✨"} **${NAME_EFFECTS[id].name}** — ${NAME_EFFECTS[id].requirement}`).join("\n"):"No Name Effects unlocked yet."}`;
  return {embeds:[{title:section==="titles"?"🏆 MY TITLES":"✨ NAME EFFECTS",description:description.slice(0,4090)}],components:rows,flags:64};
}

async function handleTitlesMenu(env, interaction) {
  const data=await buildTitlesResponseData(env,interaction,"home",0);
  if(interaction.__deferred) await editOriginalResponse(env,interaction,data); else await fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:4,data})});
}

async function savePlayer(env, player, ownerId = null) {
  updateAchievements(player);
  unlockNameEffects(player);
  if (Array.isArray(player.inventory) && player.inventory.filter(id => id !== "pink_sky_background").length >= 10) unlockOwnedTitle(player, "collector");
  if (Number(player.birthdayCandies || 0) > 0) player.birthdayCandyDate = easternDateKey();

  // Never let an object's stale userId decide which KV record gets written.
  // When an explicit ownerId is supplied, it wins; otherwise the player must
  // already have a valid ID. The saved object's userId is synchronized with
  // the actual KV key so identity cannot drift between the two.
  const key = ownerId != null ? String(ownerId) : String(player.userId || "").trim();
  if (!key) throw new Error("Cannot save player without an owner ID");
  player.userId = key;
  await env.TREE_DATA.put(key, JSON.stringify(player));
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
      nextChaosAt: 0,
      birthday: null
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
      nextChaosAt: 0,
      birthday: null
    };
  }

  try {
    return {
      announcementChannelId: null,
      announcementChannelName: "",
      hunt: null,
      island: null,
      nextChaosAt: 0,
      birthday: null,
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
    Chaos Events are now handled inside Chaos Island instead of as a
    separate recurring hourly event system. Existing timer fields are
    left in guild state for backwards compatibility.
  */
  if (state.chaosScheduleVersion !== CHAOS_SCHEDULE_VERSION) {
    state.chaosScheduleVersion = CHAOS_SCHEDULE_VERSION;
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

function isBirthdayDate(date = new Date(), month = 10, day = 3) {
  const p = getEasternDateParts(date);
  return p.month === Number(month) && p.day === Number(day);
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
  components = [],
  extraData = {}
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
          components,
          ...extraData
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

async function deferInteraction(
  env,
  interaction,
  options = {}
) {
  if (interaction.__deferred || interaction.__acknowledged) return true;

  const isUpdate = Boolean(options.update);
  const ephemeral = Boolean(options.ephemeral) && !isUpdate;
  const responseType = isUpdate ? 6 : 5;
  const data = ephemeral ? { flags: 64 } : {};

  const response = await fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: responseType, data })
    }
  );

  if (!response.ok) {
    console.error("Interaction defer failed:", response.status, await response.text());
    return false;
  }

  interaction.__deferred = true;
  interaction.__deferredUpdate = isUpdate;
  interaction.__deferredEphemeral = ephemeral;
  return true;
}

async function acknowledge(
  env,
  interaction
) {
  if (interaction.__deferred || interaction.__acknowledged) return true;

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
  const response = interaction.__deferred
    ? await editOriginalResponse(env, interaction, {
        content,
        components
      })
    : await fetch(
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

async function sendEphemeralFollowup(
  env,
  interaction,
  content,
  components = []
) {
  const response = await fetch(
    `https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, components, flags: 64 }) }
  );
  if (!response.ok) console.error("Ephemeral followup failed:", response.status, await response.text());
  return response;
}

async function sendPublicText(
  env,
  interaction,
  content,
  components = []
) {
  const response = interaction.__deferred
    ? await editOriginalResponse(env, interaction, { content, components })
    : await fetch(
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
  const rendered =
    await renderTree(
      env,
      player
    );
  const image = rendered.bytes;
  const imageFilename = rendered.animated ? `tree-${Date.now()}.gif` : "tree.png";
  const imageType = rendered.animated ? "image/gif" : "image/png";

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
          filename: imageFilename
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
        type: imageType
      }
    ),
    imageFilename
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

    case "prism_flutter":
      return IMAGES.prismFlutterBackground;

    case "lavender_twilight":
      return IMAGES.lavenderTwilightBackground;

    case "world_of_flags":
      return IMAGES.worldOfFlagsBackground;

    case "ocean_opal":
      return IMAGES.oceanOpalBackground;

    case "werewives":
      return IMAGES.werewivesBackground;

    case "golden_pickle":
      return IMAGES.goldenPickleBackground;

    case "midnight_rider":
      return IMAGES.midnightRiderBackground;

    case "birthday":
      return IMAGES.birthdayBackground;

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

    case "prism_flutter":
      return IMAGES.prismFlutterTree;

    case "lavender_twilight":
      return IMAGES.lavenderTwilightTree;

    case "world_of_flags":
      return IMAGES.worldOfFlagsTree;

    case "ocean_opal":
      return IMAGES.oceanOpalTree;

    case "werewives":
      return IMAGES.werewivesTree;

    case "golden_pickle":
      return IMAGES.goldenPickleTree;

    case "midnight_rider":
      return IMAGES.midnightRiderTree;

    case "birthday":
      return IMAGES.birthdayTree;

    case "stoned_birthday":
      return IMAGES.stonedTree;

    case "raccoon_court":
      return IMAGES.raccoonCourtTree;

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

    case "raccoon_thief":
      return IMAGES.raccoonThief;

    case "frank_frog":
      return IMAGES.frankFrog;

    case "duck_hat_boots":
      return IMAGES.duckHatBoots;

    case "cheddar_falls":
      return IMAGES.cheddarFalls;

    case "birthday":
      return IMAGES.birthdayDecoration;

    case "eggward":
      return IMAGES.eggwardDecoration;

    case "hedgy":
      return IMAGES.hedgyDecoration;

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

    case "candy_rush":
      return IMAGES.candyEffect;

    case "halloween":
      return IMAGES.halloweenEffect;

    case "prism_flutter":
      return IMAGES.prismFlutterEffect;

    case "lavender_twilight":
      return IMAGES.lavenderTwilightEffect;

    case "world_of_flags":
      return IMAGES.worldOfFlagsEffect;

    case "ocean_opal":
      return IMAGES.oceanOpalEffect;

    case "werewives":
      return IMAGES.werewivesEffect;

    case "golden_pickle":
      return IMAGES.goldenPickleEffect;

    case "midnight_rider":
      return IMAGES.midnightRiderEffect;

    case "birthday":
      return IMAGES.birthdayEffect;

    case "raccoon_court_stink":
      return IMAGES.raccoonCourtStinkEffect;

    default:
      return null;
  }
}

function pngChunk(type, data) {
  const bytes = new Uint8Array(data);
  const typeBytes = new TextEncoder().encode(type);
  const out = new Uint8Array(12 + bytes.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, bytes.length);
  out.set(typeBytes, 4);
  out.set(bytes, 8);
  view.setUint32(8 + bytes.length, pngCrc32(new Uint8Array([...typeBytes, ...bytes])));
  return out;
}

function pngCrc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngAdler32(bytes) {
  let a = 1, b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}


function treeFallbackBackground(player) {
  switch (player.equipped?.theme) {
    case "halloween": return "#24111f";
    case "candyland": return "#ffd8f2";
    case "magic_mushroom": return "#43224f";
    case "field_day": return "#9fd89b";
    case "red_forest": return "#3b1218";
    case "cozy_cat": return "#f3d7c2";
    case "green_glow": return "#102c18";
    case "prism_flutter": return "#d9d2ff";
    case "lavender_twilight": return "#665080";
    case "world_of_flags": return "#dfe8f5";
    case "ocean_opal": return "#7fcbd1";
    case "werewives": return "#f2bfdc";
    case "golden_pickle": return "#d7bd62";
    case "midnight_rider": return "#171827";
    case "birthday": return "#24162d";
    case "stoned_birthday": return "#f7c6dd";
    default: return "#ffd9ef";
  }
}

function solidRGBA(width, height, hex) {
  const value = parseInt(String(hex).replace(/^#/, ""), 16) >>> 0;
  const r = (value >> 16) & 255, g = (value >> 8) & 255, b = value & 255;
  const out = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4; out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = 255;
  }
  return { width, height, data: out };
}

function alphaComposite(dst, src, dx, dy, opacity = 1) {
  const sw = src.width, sh = src.height, dw = dst.width, dh = dst.height;
  const x0 = Math.max(0, Math.floor(dx)), y0 = Math.max(0, Math.floor(dy));
  const x1 = Math.min(dw, Math.ceil(dx + sw)), y1 = Math.min(dh, Math.ceil(dy + sh));
  for (let y = y0; y < y1; y++) {
    const sy = y - dy;
    if (sy < 0 || sy >= sh) continue;
    for (let x = x0; x < x1; x++) {
      const sx = x - dx;
      if (sx < 0 || sx >= sw) continue;
      const si = (Math.floor(sy) * sw + Math.floor(sx)) * 4;
      const di = (y * dw + x) * 4;
      const sa = (src.data[si + 3] / 255) * opacity;
      if (sa <= 0) continue;
      const da = dst.data[di + 3] / 255;
      const oa = sa + da * (1 - sa);
      if (oa <= 0) continue;
      dst.data[di] = Math.round((src.data[si] * sa + dst.data[di] * da * (1 - sa)) / oa);
      dst.data[di + 1] = Math.round((src.data[si + 1] * sa + dst.data[di + 1] * da * (1 - sa)) / oa);
      dst.data[di + 2] = Math.round((src.data[si + 2] * sa + dst.data[di + 2] * da * (1 - sa)) / oa);
      dst.data[di + 3] = Math.round(oa * 255);
    }
  }
}

function resizeRGBA(src, width, height) {
  const out = new Uint8Array(width * height * 4);
  const xScale = src.width / width, yScale = src.height / height;
  for (let y = 0; y < height; y++) {
    const sy = Math.min(src.height - 1, Math.floor(y * yScale));
    for (let x = 0; x < width; x++) {
      const sx = Math.min(src.width - 1, Math.floor(x * xScale));
      const si = (sy * src.width + sx) * 4, di = (y * width + x) * 4;
      out[di] = src.data[si]; out[di + 1] = src.data[si + 1]; out[di + 2] = src.data[si + 2]; out[di + 3] = src.data[si + 3];
    }
  }
  return { width, height, data: out };
}

function containRGBA(src, boxWidth, boxHeight) {
  const scale = Math.min(boxWidth / src.width, boxHeight / src.height);
  const w = Math.max(1, Math.round(src.width * scale)), h = Math.max(1, Math.round(src.height * scale));
  return resizeRGBA(src, w, h);
}

function coverRGBA(src, width, height) {
  const scale = Math.max(width / src.width, height / src.height);
  const w = Math.max(1, Math.ceil(src.width * scale)), h = Math.max(1, Math.ceil(src.height * scale));
  const resized = resizeRGBA(src, w, h);
  const out = new Uint8Array(width * height * 4);
  const ox = Math.max(0, Math.floor((w - width) / 2)), oy = Math.max(0, Math.floor((h - height) / 2));
  for (let y = 0; y < height; y++) {
    const sy = Math.min(h - 1, y + oy);
    for (let x = 0; x < width; x++) {
      const sx = Math.min(w - 1, x + ox), si = (sy * w + sx) * 4, di = (y * width + x) * 4;
      out[di] = resized.data[si]; out[di + 1] = resized.data[si + 1]; out[di + 2] = resized.data[si + 2]; out[di + 3] = resized.data[si + 3];
    }
  }
  return { width, height, data: out };
}

function rgbaToRgbPng(frame) {
  const width = frame.width, height = frame.height;
  const raw = new Uint8Array(height * (1 + width * 3));
  let p = 0;
  for (let y = 0; y < height; y++) {
    raw[p++] = 0;
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      raw[p++] = frame.data[o]; raw[p++] = frame.data[o + 1]; raw[p++] = frame.data[o + 2];
    }
  }
  const blocks = [];
  for (let offset = 0; offset < raw.length;) {
    const len = Math.min(65535, raw.length - offset), final = offset + len >= raw.length;
    const block = new Uint8Array(5 + len);
    block[0] = final ? 1 : 0; block[1] = len & 255; block[2] = (len >> 8) & 255;
    const nlen = (~len) & 0xffff; block[3] = nlen & 255; block[4] = (nlen >> 8) & 255;
    block.set(raw.subarray(offset, offset + len), 5); blocks.push(block); offset += len;
  }
  const zlibLength = 2 + blocks.reduce((n, x) => n + x.length, 0) + 4;
  const zlib = new Uint8Array(zlibLength); zlib[0] = 0x78; zlib[1] = 0x01;
  let z = 2; for (const block of blocks) { zlib.set(block, z); z += block.length; }
  const adler = pngAdler32(raw); zlib[z++] = adler >>> 24; zlib[z++] = adler >>> 16; zlib[z++] = adler >>> 8; zlib[z] = adler;
  const ihdr = new Uint8Array(13), view = new DataView(ihdr.buffer);
  view.setUint32(0, width); view.setUint32(4, height); ihdr[8] = 8; ihdr[9] = 2;
  const sig = new Uint8Array([137,80,78,71,13,10,26,10]);
  const a = pngChunk("IHDR", ihdr), b = pngChunk("IDAT", zlib), c = pngChunk("IEND", new Uint8Array());
  const out = new Uint8Array(sig.length + a.length + b.length + c.length);
  out.set(sig,0); out.set(a,sig.length); out.set(b,sig.length+a.length); out.set(c,sig.length+a.length+b.length);
  return out;
}

async function getPngAsset(env, filename) {
  if (!filename) return null;

  // TREE_DATA stores player/game state; the artwork lives in the public R2 bucket.
  // Fetch the same public R2 asset URL used by the original image pipeline.
  const url = imageUrl(filename);
  const response = await fetch(url, {
    cf: { cacheEverything: true, cacheTtl: 86400 }
  });

  if (!response.ok) {
    throw new Error(`R2 asset fetch failed: ${filename} (HTTP ${response.status})`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  try {
    return await decodePNG(bytes);
  } catch {
    throw new Error(`Tree image pipeline only supports PNG layers directly: ${filename}`);
  }
}

function drawSparkle(frame, cx, cy, kind) {
  const colors = kind === "rainbow" ? [255,79,216] : kind === "moon" ? [157,220,255] : kind === "star" ? [255,242,122] : [255,182,232];
  const radius = 24;
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
    const dist = Math.sqrt(dx*dx + dy*dy); if (dist > radius) continue;
    const px = cx + dx, py = cy + dy; if (px < 0 || py < 0 || px >= frame.width || py >= frame.height) continue;
    const cross = Math.max(Math.abs(dx), Math.abs(dy)) < 4 || (Math.abs(dx) < 4 && Math.abs(dy) < 20) || (Math.abs(dy) < 4 && Math.abs(dx) < 20);
    if (!cross) continue;
    const alpha = Math.max(0, 1 - dist / radius);
    const o = (py * frame.width + px) * 4, sa = alpha * 0.95, da = frame.data[o+3] / 255, oa = sa + da*(1-sa);
    frame.data[o] = Math.round((255*sa + frame.data[o]*da*(1-sa))/oa);
    frame.data[o+1] = Math.round((255*sa + frame.data[o+1]*da*(1-sa))/oa);
    frame.data[o+2] = Math.round((255*sa + frame.data[o+2]*da*(1-sa))/oa);
    frame.data[o+3] = Math.round(oa*255);
  }
  for (let d = -10; d <= 10; d++) {
    for (const [x,y] of [[cx+d,cy],[cx,cy+d]]) {
      if (x<0||y<0||x>=frame.width||y>=frame.height) continue;
      const o=(y*frame.width+x)*4; frame.data[o]=colors[0]; frame.data[o+1]=colors[1]; frame.data[o+2]=colors[2]; frame.data[o+3]=255;
    }
  }
}

const BITMAP_FONT = {"A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"], "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"], "C": ["01111", "10000", "10000", "10000", "10000", "10000", "01111"], "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"], "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"], "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"], "G": ["01111", "10000", "10000", "10111", "10001", "10001", "01111"], "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"], "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"], "J": ["00111", "00010", "00010", "00010", "10010", "10010", "01100"], "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"], "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"], "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"], "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"], "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"], "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"], "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"], "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"], "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"], "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"], "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"], "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"], "W": ["10001", "10001", "10001", "10101", "10101", "11011", "10001"], "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"], "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"], "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"], "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"], "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"], "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"], "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"], "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"], "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"], "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"], "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"], "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"], "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"], ":": ["00000", "00100", "00100", "00000", "00100", "00100", "00000"], "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"], ".": ["00000", "00000", "00000", "00000", "00000", "00110", "00110"], "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"], "#": ["01010", "11111", "01010", "01010", "11111", "01010", "01010"], "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"], "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"]};

function profileSafeText(value){
  const s=String(value??"").normalize("NFKD").replace(/[^A-Za-z0-9 ._!?#:\/-]+/g,"");
  return s.trim() || "WEREWIFE";
}
function hexRgb(hex){
  const n=parseInt(String(hex||"#ffd9ef").replace(/^#/ , ""),16)>>>0;
  return [(n>>16)&255,(n>>8)&255,n&255];
}
function profileFill(frame,x,y,w,h,r,g,b,a=255){
  const x0=Math.max(0,Math.floor(x)),y0=Math.max(0,Math.floor(y)),x1=Math.min(frame.width,Math.ceil(x+w)),y1=Math.min(frame.height,Math.ceil(y+h));
  for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const o=(yy*frame.width+xx)*4;frame.data[o]=r;frame.data[o+1]=g;frame.data[o+2]=b;frame.data[o+3]=a;}
}
function profileBlendFill(frame,x,y,w,h,r,g,b,a=255){
  const x0=Math.max(0,Math.floor(x)),y0=Math.max(0,Math.floor(y)),x1=Math.min(frame.width,Math.ceil(x+w)),y1=Math.min(frame.height,Math.ceil(y+h));
  const sa=a/255;
  for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const o=(yy*frame.width+xx)*4;frame.data[o]=Math.round(r*sa+frame.data[o]*(1-sa));frame.data[o+1]=Math.round(g*sa+frame.data[o+1]*(1-sa));frame.data[o+2]=Math.round(b*sa+frame.data[o+2]*(1-sa));frame.data[o+3]=255;}
}
function drawBitmapText(frame,text,x,y,scale=3,rgb=[42,32,48],maxWidth=null){
  let str=profileSafeText(text).toUpperCase();
  const glyphW=5*scale, gap=scale;
  if(maxWidth){const maxChars=Math.max(1,Math.floor((maxWidth+gap)/(glyphW+gap)));if(str.length>maxChars)str=str.slice(0,maxChars-1)+"?";}
  let px=Math.round(x);
  for(const ch of str){if(ch===" "){px+=3*scale;continue;}const rows=BITMAP_FONT[ch]||BITMAP_FONT["?"];for(let ry=0;ry<7;ry++){const row=rows[ry];for(let rx=0;rx<5;rx++)if(row[rx]==="1")profileFill(frame,px+rx*scale,y+ry*scale,scale,scale,rgb[0],rgb[1],rgb[2],255);}px+=(5*scale+gap);}
  return px;
}
function profileTextWidth(text,scale=3){let n=0;for(const ch of profileSafeText(text).toUpperCase())n+=ch===" "?3*scale:6*scale;return Math.max(0,n-scale);}
function profileEffectColor(id){
  const map={starlight:[255,255,255],inferno:[255,139,50],firework:[255,122,200],royal_blood:[255,74,95],enchanted:[194,140,255],royal_purple:[142,77,255],butterflies:[255,183,238],shadow:[238,238,238],frostbite:[114,207,255],golden:[255,217,90],spooky:[212,156,255],petals:[245,139,198],cosmic:[122,134,239],green_glow:[84,220,99],candy_rush:[255,105,180]};return map[id]||[42,32,48];
}
function profileEffectColors(id){
  return {
    rainbow:[[255,95,190],[255,185,80],[255,240,90],[90,225,170],[95,190,255],[175,120,255]],
    starlight:[[255,255,255],[205,220,255],[150,190,255]],
    petals:[[255,150,210],[245,105,180],[255,195,230],[215,120,245]],
    inferno:[[255,245,120],[255,170,55],[255,75,35],[210,35,25]],
    green_glow:[[210,255,210],[100,245,115],[45,210,80],[170,255,120]],
    candy_rush:[[255,105,180],[120,205,255],[190,125,255],[255,220,90]],
    cosmic:[[185,155,255],[115,130,255],[80,220,255],[205,110,255]],
    firework:[[255,120,200],[100,220,255],[255,225,90],[195,145,255]],
    royal_blood:[[255,80,100],[190,20,50],[255,210,100]],
    enchanted:[[255,170,235],[195,135,255],[130,115,255],[255,220,255]],
    royal_purple:[[235,185,255],[150,80,255],[255,215,120]],
    butterflies:[[255,185,240],[155,235,255],[215,165,255],[255,255,255]],
    shadow:[[245,245,245],[145,145,155],[65,65,75]],
    frostbite:[[255,255,255],[190,240,255],[105,210,255],[220,250,255]],
    golden:[[255,255,230],[255,220,85],[255,245,150],[220,165,35]],
    spooky:[[255,255,255],[215,165,255],[255,160,90],[155,110,255]]
  }[id] || [profileEffectColor(id)];
}
function profileEffectColorAt(id,index,phase){
  const colors=profileEffectColors(id);
  /* Name effects no longer sweep their colors across the title. Each effect has
     a stable palette; only the actual effect shapes animate. */
  return colors[index%colors.length];
}
function profilePixelLine(frame,x0,y0,x1,y1,w,r,g,b,a=255){
  x0=Math.round(x0); y0=Math.round(y0); x1=Math.round(x1); y1=Math.round(y1);
  const dx=Math.abs(x1-x0), sx=x0<x1?1:-1, dy=-Math.abs(y1-y0), sy=y0<y1?1:-1;
  let err=dx+dy;
  while(true){profileFill(frame,x0-Math.floor(w/2),y0-Math.floor(w/2),w,w,r,g,b,a);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}
}
function profileDiamond(frame,x,y,s,c,a=255){
  for(let yy=-s;yy<=s;yy++){const half=s-Math.abs(yy);profileFill(frame,x-half,y+yy,half*2+1,1,c[0],c[1],c[2],a);}
}
function profileStar(frame,x,y,s,c,a=255){
  profileFill(frame,x-s,y,2*s+1,1,c[0],c[1],c[2],a);profileFill(frame,x,y-s,1,2*s+1,c[0],c[1],c[2],a);
  if(s>2){profilePixelLine(frame,x-s+1,y-s+1,x+s-1,y+s-1,1,...c,a);profilePixelLine(frame,x+s-1,y-s+1,x-s+1,y+s-1,1,...c,a);}
  profileFill(frame,x,y,2,2,255,255,255,Math.min(255,a));
}
function profilePetal(frame,x,y,s,c,flip=1){
  // Small, clearly leaf/petal-shaped form: tapered top/bottom with a curved belly.
  const w=Math.max(3,Math.round(s*0.72));
  const h=Math.max(5,Math.round(s*1.35));
  for(let row=-h;row<=h;row++){
    const yy=row/h;
    const width=Math.max(1,Math.round(w*(1-Math.min(0.9,Math.abs(yy)*0.72))));
    const xx=x+Math.round(Math.sin(yy*Math.PI)*flip*1.5);
    profileFill(frame,xx-width,y+row,width*2+1,1,c[0],c[1],c[2],235);
  }
  profilePixelLine(frame,x,y-h+1,x+flip*Math.max(1,Math.round(w*0.7)),y+h-1,1,255,225,245,150);
}
function profileButterfly(frame,x,y,s,c){
  // Four rounded wing lobes + body + tiny antennae, so it reads as a butterfly.
  const wing=Math.max(3,s);
  profilePetal(frame,x-wing-1,y-wing/2,wing,c,-1);
  profilePetal(frame,x-wing-1,y+wing/2,wing,c,-1);
  profilePetal(frame,x+wing+1,y-wing/2,wing,c,1);
  profilePetal(frame,x+wing+1,y+wing/2,wing,c,1);
  profileFill(frame,x-1,y-wing,3,wing*2+2,55,40,65,255);
  profilePixelLine(frame,x,y-wing,x-3,y-wing-3,1,55,40,65,230);
  profilePixelLine(frame,x+1,y-wing,x+4,y-wing-3,1,55,40,65,230);
  profileFill(frame,x-1,y-1,3,3,255,255,255,220);
}
function profileCandy(frame,x,y,s,c,alt){
  // Plump wrapped candy with unmistakable pinched/twisted ends.
  const w=Math.max(7,Math.round(s*1.65));
  const h=Math.max(5,Math.round(s*0.9));
  const dark=[Math.max(0,c[0]-55),Math.max(0,c[1]-55),Math.max(0,c[2]-55)];
  // wrapper tails
  for(let row=-h;row<=h;row++){
    const pinch=Math.max(1,Math.round((h-Math.abs(row))*0.72)+1);
    profileFill(frame,x-w-pinch,y+row,pinch,1,dark[0],dark[1],dark[2],245);
    profileFill(frame,x+w,y+row,pinch,1,dark[0],dark[1],dark[2],245);
  }
  // plump center
  for(let row=-h;row<=h;row++){
    const curve=Math.max(3,Math.round(w-(Math.abs(row)*0.8)));
    profileFill(frame,x-curve,y+row,curve*2+1,1,c[0],c[1],c[2],255);
  }
  // wrapper crinkles
  profilePixelLine(frame,x-w-2,y-h,x-w+1,y,1,255,255,255,150);
  profilePixelLine(frame,x+w+2,y-h,x+w-1,y,1,255,255,255,150);
  // glossy stripe
  if(alt) profileFill(frame,x-Math.max(1,Math.round(w*0.42)),y-h+1,2,h*2,255,255,255,185);
  else profilePixelLine(frame,x-w+2,y-1,x+w-2,y-1,2,255,255,255,165);
}
function profileFlower(frame,x,y,s,c,phase=0){
  const r=Math.max(2,Math.round(s*0.72));
  const petalColors=[c,[255,210,235],[255,240,120]];
  for(let i=0;i<5;i++){
    const a=(Math.PI*2*i)/5 + Math.sin(phase*Math.PI*2)*0.08;
    const px=Math.round(x+Math.cos(a)*r*0.72), py=Math.round(y+Math.sin(a)*r*0.72);
    profilePetal(frame,px,py,Math.max(3,Math.round(s*0.62)),petalColors[i%petalColors.length],i%2?-1:1);
  }
  profileFill(frame,x-2,y-2,5,5,255,205,65,245);
  profileFill(frame,x-1,y-1,3,3,255,245,145,255);
}
function profilePumpkin(frame,x,y,s,c,phase=0){
  const w=Math.max(5,Math.round(s*1.25)), h=Math.max(4,Math.round(s*0.9));
  const orange=c||[245,125,25];
  for(let row=-h;row<=h;row++){
    const q=Math.abs(row)/Math.max(1,h);
    const half=Math.max(2,Math.round(w*(1-0.34*q)));
    profileFill(frame,x-half,y+row,half*2+1,1,orange[0],orange[1],orange[2],245);
  }
  // pumpkin ribs
  profilePixelLine(frame,x-3,y-h+1,x-4,y+h-1,1,190,75,15,180);
  profilePixelLine(frame,x+3,y-h+1,x+4,y+h-1,1,190,75,15,180);
  profileFill(frame,x-2,y-h-2,5,3,90,150,55,245);
  // tiny carved face
  profileFill(frame,x-3,y-1,2,2,55,30,20,235); profileFill(frame,x+2,y-1,2,2,55,30,20,235);
  profileFill(frame,x-2,y+3,5,1,55,30,20,220);
}
function profileGhost(frame,x,y,s,c){
  const w=Math.max(4,s), h=Math.max(6,Math.round(s*1.45));
  // rounded head/body with a three-lobed sheet at the bottom
  for(let row=-h;row<=h;row++){
    const t=(row+h)/(2*h);
    const half=Math.max(2,Math.round(w*(0.72+0.28*Math.cos((t-0.5)*Math.PI))));
    profileFill(frame,x-half,y+row,half*2+1,1,c[0],c[1],c[2],225);
  }
  for(let i=-1;i<=1;i++) profileFill(frame,x+i*w/2,y+h-1,Math.max(2,Math.round(w/2)),2,c[0],c[1],c[2],225);
  profileFill(frame,x-Math.max(1,Math.round(w*0.38)),y-2,2,2,45,35,55,255);
  profileFill(frame,x+Math.max(1,Math.round(w*0.22)),y-2,2,2,45,35,55,255);
  profileFill(frame,x-1,y+2,2,2,45,35,55,220);
}
function profileSnowflake(frame,x,y,s,c){
  const a=235;
  profilePixelLine(frame,x-s,y,x+s,y,1,...c,a);
  profilePixelLine(frame,x,y-s,x,y+s,1,...c,a);
  profilePixelLine(frame,x-s+1,y-s+1,x+s-1,y+s-1,1,...c,a);
  profilePixelLine(frame,x+s-1,y-s+1,x-s+1,y+s-1,1,...c,a);
  // branch tips make the snowflake read as a snowflake rather than a plus sign
  for(const [dx,dy] of [[-s+1,-s+1],[s-1,s-1],[-s+1,s-1],[s-1,-s+1]]){
    profileFill(frame,x+dx,y+dy,2,2,255,255,255,210);
  }
  profileFill(frame,x-1,y-1,3,3,255,255,255,245);
}
function profileFlame(frame,x,y,s,c){
  const outer=c, inner=[255,225,75];
  const h=Math.max(6,s+2);
  for(let row=-h;row<=h;row++){
    const t=(row+h)/(2*h);
    const half=Math.max(1,Math.round((1-Math.abs(t-0.52))*s*0.9));
    const sway=Math.round(Math.sin(t*Math.PI*2)*1.5);
    profileFill(frame,x+sway-half,y+row,half*2+1,1,outer[0],outer[1],outer[2],235);
  }
  for(let row=-Math.round(h*0.45);row<=Math.round(h*0.75);row++){
    const half=Math.max(1,Math.round((1-Math.abs(row/(h*1.4)))*Math.max(2,s*0.45)));
    profileFill(frame,x-half,y+row,half*2+1,1,inner[0],inner[1],inner[2],245);
  }
}
function profileFirework(frame,x,y,s,c){
  const burst=Math.max(3,s);
  for(let i=0;i<8;i++){
    const a=(Math.PI*2*i)/8;
    const ex=Math.round(x+Math.cos(a)*burst);
    const ey=Math.round(y+Math.sin(a)*burst);
    profilePixelLine(frame,x,y,ex,ey,1,...c,220);
    profileDiamond(frame,ex,ey,1,c,235);
  }
  profileFill(frame,x-1,y-1,3,3,255,255,255,255);
}
function profileDrop(frame,x,y,s,c){
  const h=Math.max(5,s+1);
  for(let row=-h;row<=h;row++){
    const t=(row+h)/(2*h);
    const half=Math.max(1,Math.round((1-t)*s*0.85 + 1));
    profileFill(frame,x-half,y+row,half*2+1,1,c[0],c[1],c[2],235);
  }
  profileFill(frame,x-1,y-h+1,2,2,255,170,180,180);
}
function profileWisp(frame,x,y,len,c,phase,flip=1){
  const pts=16; let px=x,py=y;
  for(let i=0;i<pts;i++){
    const t=i/(pts-1);
    const nx=x+flip*t*len;
    const ny=y+Math.sin((phase+t*1.2)*Math.PI*2)*5 + Math.sin(t*Math.PI)*8;
    profilePixelLine(frame,px,py,nx,ny,Math.max(1,Math.round(2-t)),c[0],c[1],c[2],Math.round(180-95*t));
    px=nx; py=ny;
  }
}
function profileCoin(frame,x,y,s,c){
  const r=Math.max(3,s);
  profileFill(frame,x-r,y-r,r*2+1,r*2+1,c[0],c[1],c[2],245);
  profileFill(frame,x-r+2,y-r+2,r*2-3,r*2-3,255,236,120,235);
  profileFill(frame,x-1,y-r+2,2,r*2-3,190,130,25,220);
  profilePixelLine(frame,x-r+2,y-r+2,x+r-2,y+r-2,1,255,255,255,130);
}
function profileCrown(frame,x,y,s,c){
  const w=Math.max(8,s*2+4);
  profileFill(frame,x-w,y,w*2+1,2,c[0],c[1],c[2],240);
  profileFill(frame,x-w+2,y-5,w*2-3,5,c[0],c[1],c[2],240);
  for(const dx of [-w+2,-2,w-2]) profileDiamond(frame,x+dx,y-7,2,c,240);
  profileFill(frame,x-1,y-4,2,4,255,245,150,220);
}
function drawAnimatedProfileTitle(frame,text,x,y,scale,effectId,phase,maxWidth=null){
  const str=profileSafeText(text).toUpperCase();
  let drawScale=scale;
  if(maxWidth){while(drawScale>1&&profileTextWidth(str,drawScale)>maxWidth)drawScale--;}
  const gap=drawScale;
  const colors=profileEffectColors(effectId);
  const t=phase*Math.PI*2;
  let px=Math.round(x),charIndex=0;

  /* The title itself is animated, but NEVER with the old left-to-right color
     sweep. Each Name Effect gets a different, small motion/color behavior so
     the title stays readable while still feeling alive. */
  let baseY=Math.round(y);
  if(effectId==="rainbow") baseY+=Math.round(Math.sin(t)*1.5);
  else if(effectId==="candy_rush") baseY+=Math.round(Math.sin(t*2)*1.5);
  else if(effectId==="petals") baseY+=Math.round(Math.sin(t)*1.2);
  else if(effectId==="butterflies") baseY+=Math.round(Math.sin(t*1.5)*1.2);
  else if(effectId==="inferno") baseY+=Math.round(Math.sin(t*2.5)*1.5);
  else if(effectId==="starlight") baseY+=Math.round(Math.sin(t*0.8)*1);
  else if(effectId==="cosmic") baseY+=Math.round(Math.sin(t*1.2)*1.5);
  else if(effectId==="firework") baseY+=Math.round(Math.sin(t*2)*1);
  else if(effectId==="royal_blood") baseY+=Math.round(Math.sin(t*1.1)*1);
  else if(effectId==="enchanted") baseY+=Math.round(Math.sin(t*1.4)*1.2);
  else if(effectId==="royal_purple") baseY+=Math.round(Math.sin(t)*1);
  else if(effectId==="shadow") baseY+=Math.round(Math.sin(t*0.7)*1.5);
  else if(effectId==="frostbite") baseY+=Math.round(Math.sin(t)*1);
  else if(effectId==="golden") baseY+=Math.round(Math.sin(t*1.3)*1);
  else if(effectId==="spooky") baseY+=Math.round(Math.sin(t*1.7)*1.5);

  for(const ch of str){
    if(ch===" "){px+=3*drawScale;charIndex++;continue;}
    let color=colors[charIndex%Math.max(1,colors.length)] || [42,32,48];
    let yy=baseY;
    let xx=px;
    let bright=1;

    if(effectId==="rainbow"){
      /* Rainbow keeps its recognizable per-letter rainbow, while a soft pulse
         makes the word visibly animate without sweeping colors across it. */
      const pulse=0.82+0.18*(0.5+0.5*Math.sin(t+charIndex*0.22));
      color=color.map(v=>Math.round(v*pulse));
      yy+=Math.round(Math.sin(t*1.5+charIndex*0.45));
    } else if(effectId==="candy_rush"){
      yy+=Math.round(Math.sin(t*2+charIndex*0.8)*2);
      xx+=Math.round(Math.sin(t+charIndex*0.55));
    } else if(effectId==="petals"){
      yy+=Math.round(Math.sin(t+charIndex*0.35));
      color=charIndex%2?[235,85,170]:[255,135,205];
    } else if(effectId==="butterflies"){
      yy+=Math.round(Math.sin(t*1.6+charIndex*0.55));
      xx+=Math.round(Math.sin(t*1.2+charIndex*0.3));
    } else if(effectId==="inferno"){
      yy+=Math.round(Math.sin(t*3+charIndex*0.7));
      color=(Math.sin(t*2+charIndex)>0)?[255,165,45]:[255,85,35];
    } else if(effectId==="starlight"){
      const tw=0.65+0.35*(0.5+0.5*Math.sin(t*2+charIndex*1.3));
      color=[Math.round(75+120*tw),Math.round(90+125*tw),Math.round(145+110*tw)];
    } else if(effectId==="green_glow"){
      const pulse=0.75+0.25*(0.5+0.5*Math.sin(t*1.3+charIndex*0.25));
      color=[Math.round(45*pulse),Math.round(205*pulse+30),Math.round(80*pulse)];
      yy+=Math.round(Math.sin(t+charIndex*0.3));
    } else if(effectId==="cosmic"){
      yy+=Math.round(Math.sin(t*1.3+charIndex*0.5));
      color=colors[(charIndex+Math.round(Math.sin(t)*0.5))%colors.length];
    } else if(effectId==="firework"){
      const flash=(Math.sin(t*3+charIndex*0.45)>0.72)?1.15:0.9;
      color=color.map(v=>Math.min(255,Math.round(v*flash)));
      yy+=Math.round(Math.sin(t*2+charIndex*0.3));
    } else if(effectId==="royal_blood"){
      yy+=Math.round(Math.sin(t*1.1+charIndex*0.25));
      color=(charIndex%3===0)?[255,80,100]:[190,20,50];
    } else if(effectId==="enchanted"){
      yy+=Math.round(Math.sin(t*1.5+charIndex*0.4));
      color=colors[charIndex%colors.length];
    } else if(effectId==="royal_purple"){
      const pulse=0.8+0.2*(0.5+0.5*Math.sin(t+charIndex*0.2));
      color=[Math.min(255,Math.round(150*pulse)),Math.min(255,Math.round(80*pulse)),Math.min(255,Math.round(255*pulse))];
    } else if(effectId==="shadow"){
      yy+=Math.round(Math.sin(t*0.8+charIndex*0.5));
      xx+=Math.round(Math.sin(t*0.5+charIndex*0.2));
      color=charIndex%2?[180,180,190]:[75,75,85];
    } else if(effectId==="frostbite"){
      const shimmer=(Math.sin(t*2.2+charIndex*0.7)>0.65);
      color=shimmer?[255,255,255]:[55,165,220];
      yy+=Math.round(Math.sin(t+charIndex*0.25));
    } else if(effectId==="golden"){
      const glint=(Math.sin(t*2+charIndex*0.9)>0.72);
      color=glint?[255,255,225]:[210,150,20];
      yy+=Math.round(Math.sin(t*1.2+charIndex*0.25));
    } else if(effectId==="spooky"){
      yy+=Math.round(Math.sin(t*2+charIndex*0.8)*1.5);
      xx+=Math.round(Math.sin(t+charIndex*0.35));
      color=(Math.sin(t*1.5+charIndex)>0)?[180,105,235]:[115,65,175];
    }

    const rows=BITMAP_FONT[ch]||BITMAP_FONT["?"];
    for(let ry=0;ry<7;ry++){
      const row=rows[ry];
      for(let rx=0;rx<5;rx++){
        if(row[rx]==="1") profileFill(frame,xx+rx*drawScale,yy+ry*drawScale,drawScale,drawScale,color[0],color[1],color[2],255);
      }
    }
    px+=5*drawScale+gap;
    charIndex++;
  }
}
function profileRainbowBand(frame,x,y,radius,thickness,c,phase,side=1){
  /* Pixel-friendly rainbow arc. The arc itself stays recognizable instead of
     becoming a row of colored blocks. */
  const steps=34;
  const start=side>0?Math.PI*1.05:Math.PI*0.05;
  const end=side>0?Math.PI*1.95:Math.PI*0.95;
  for(let band=0;band<6;band++){
    const rr=radius-band*thickness*0.95;
    const col=profileEffectColors("rainbow")[band];
    for(let i=0;i<steps;i++){
      const t=i/(steps-1);
      const a=start+(end-start)*t + Math.sin((phase+t)*Math.PI*2)*0.012;
      const px=Math.round(x+Math.cos(a)*rr);
      const py=Math.round(y+Math.sin(a)*rr);
      profileFill(frame,px,py,Math.max(2,thickness),Math.max(2,thickness),col[0],col[1],col[2],245);
    }
  }
}
function drawProfileEffectParticles(frame,effectId,phase){
  if(!effectId)return;
  const pal=profileEffectColors(effectId), p=phase*Math.PI*2;
  // Keep particles around the title, but make each effect unmistakable.
  switch(effectId){
    case "rainbow": {
      profileRainbowBand(frame,382,170,45,3,pal[0],phase,1);
      profileRainbowBand(frame,724,170,45,3,pal[0],phase,-1);
      profileStar(frame,360,136,3,[255,255,255],220); profileStar(frame,744,136,3,[255,255,255],220); break;
    }
    case "starlight": {
      const pts=[[350,132,0],[385,224,.13],[425,138,.27],[470,231,.41],[520,132,.55],[570,226,.69],[620,140,.82],[690,224,.95],[735,132,.38]];
      pts.forEach(([x,y,o],i)=>{
        const tw=0.45+0.55*(0.5+0.5*Math.sin(p*2.4+o*11));
        const xx=x+Math.round(Math.sin(p*0.45+o*8)*3), yy=y+Math.round(Math.cos(p*0.6+o*7)*3);
        profileStar(frame,xx,yy,2+(i%3),pal[i%pal.length],Math.round(125+130*tw));
        if(i%2===0) profileStar(frame,xx+5,yy-4,1,pal[(i+1)%pal.length],Math.round(100+120*tw));
      });
      break;
    }
    case "petals": {
      const pts=[[350,136,0],[385,226,.12],[430,145,.25],[480,232,.38],[530,137,.51],[580,228,.64],[630,145,.77],[690,231,.89],[735,140,.31]];
      pts.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.75+o*9)*10, yy=y+((phase+o)%1)*20;
        profilePetal(frame,Math.round(xx),Math.round(yy),5+(i%3),pal[i%pal.length],i%2?-1:1);
      });
      // Two recognizable little flowers among the drifting petals.
      profileFlower(frame,405,143,8,[245,105,190],phase*0.7);
      profileFlower(frame,690,222,8,[255,145,200],phase*0.7+0.4);
      break;
    }
    case "inferno": {
      const pts=[[360,232,0],[744,232,.2],[366,140,.45],[734,140,.68]];
      pts.forEach(([x,y,o],i)=>{const xx=x+Math.sin(p*1.2+o*7)*4, yy=y-Math.abs(Math.sin(p+o*7))*11;profileFlame(frame,Math.round(xx),Math.round(yy),5+(i%2),pal[i%pal.length]);}); break;
    }
    case "green_glow": {
      const pts=[[350,138,0],[382,220,.11],[420,150,.22],[465,230,.33],[515,140,.45],[560,225,.57],[610,148,.68],[660,228,.79],[710,140,.9],[744,218,.98]];
      pts.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.9+o*9)*8, yy=y+Math.cos(p*0.7+o*8)*7;
        profileWisp(frame,Math.round(xx),Math.round(yy),16+(i%3)*5,pal[i%pal.length],phase+o,i%2?1:-1);
        if(i%2===0) profileStar(frame,Math.round(xx+4),Math.round(yy-5),2,pal[(i+1)%pal.length],185);
      });
      break;
    }
    case "candy_rush": {
      const pts=[[360,140,0],[744,140,.22],[356,230,.45],[744,230,.68],[700,137,.82]];
      pts.forEach(([x,y,o],i)=>{const xx=x+Math.sin(p*0.8+o*7)*8, yy=y+Math.cos(p*0.65+o*7)*5;profileCandy(frame,Math.round(xx),Math.round(yy),7+(i%2),pal[i%pal.length],i%2===0);}); break;
    }
    case "cosmic": {
      const pts=[[350,138,0],[390,225,.12],[430,145,.24],[475,230,.36],[520,136,.48],[565,226,.6],[615,145,.72],[665,230,.84],[735,140,.96]];
      pts.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.55+o*8)*9, yy=y+Math.cos(p*0.7+o*7)*7;
        profileStar(frame,Math.round(xx),Math.round(yy),2+(i%3),pal[i%pal.length],190+Math.round(55*Math.sin(p*1.5+o*6)**2));
        if(i%2===0) profileWisp(frame,Math.round(xx-8),Math.round(yy+4),18,pal[(i+1)%pal.length],phase+o,1);
      });
      profileWisp(frame,355,215,48,pal[1],phase,1);
      profileWisp(frame,745,145,48,pal[2],phase+0.35,-1);
      break;
    }
    case "firework": {
      const pts=[[360,140,0],[744,142,.28],[360,230,.55],[744,230,.78]];
      pts.forEach(([x,y,o],i)=>{const burst=3+Math.round(5*(0.5+0.5*Math.sin(p+o*6)));profileFirework(frame,x,y,burst,pal[i%pal.length]);}); break;
    }
    case "royal_blood": {
      const pts=[[360,143,0],[744,143,.22],[360,228,.47],[744,228,.7]];
      pts.forEach(([x,y,o],i)=>{const yy=y+Math.sin(p+o*6)*4;profileDrop(frame,x,Math.round(yy),5+(i%2),pal[i%pal.length]);}); break;
    }
    case "enchanted": {
      const pts=[[360,141,0],[744,142,.2],[357,228,.45],[744,228,.7]];
      pts.forEach(([x,y,o],i)=>{const xx=x+Math.sin(p+o*6)*6,yy=y+Math.cos(p+o*6)*5;profileStar(frame,Math.round(xx),Math.round(yy),3+(i%2),pal[i%pal.length],225);profileDiamond(frame,Math.round(xx+8),Math.round(yy+2),2,pal[(i+1)%pal.length],190);}); break;
    }
    case "royal_purple": {
      profileCrown(frame,360,143,5,pal[2]); profileCrown(frame,744,143,5,pal[2]);
      profileStar(frame,360,230,4,pal[1],220); profileStar(frame,744,230,4,pal[1],220); break;
    }
    case "butterflies": {
      const pts=[[360,143,0],[744,143,.24],[358,226,.5],[742,226,.76]];
      pts.forEach(([x,y,o],i)=>{const xx=x+Math.sin(p+o*6)*8,yy=y+Math.cos(p*0.8+o*6)*6;profileButterfly(frame,Math.round(xx),Math.round(yy),5+(i%2),pal[i%pal.length]);}); break;
    }
    case "shadow": {
      profileWisp(frame,355,150,42,pal[1],phase,1); profileWisp(frame,744,220,42,pal[2],phase,-1);
      profileWisp(frame,360,225,28,pal[1],phase+0.4,1); break;
    }
    case "frostbite": {
      const pts=[[360,142,0],[744,142,.22],[358,228,.48],[742,228,.7]];
      pts.forEach(([x,y,o],i)=>{const yy=y+Math.sin(p+o*6)*4;profileSnowflake(frame,x,Math.round(yy),5+(i%2),pal[i%pal.length]);}); break;
    }
    case "golden": {
      const pts=[[350,137,0],[390,226,.12],[430,145,.24],[475,231,.36],[520,137,.48],[565,226,.6],[615,145,.72],[665,230,.84],[735,138,.96]];
      pts.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.65+o*8)*7, yy=y+Math.cos(p*0.55+o*7)*6;
        if(i%3===0) profileCoin(frame,Math.round(xx),Math.round(yy),5+(i%2),[245,185,45]);
        else profileStar(frame,Math.round(xx),Math.round(yy),2+(i%2),[255,215,70],220);
        if(i%2===0) profileDiamond(frame,Math.round(xx+5),Math.round(yy-4),2,[255,245,170],180);
      });
      break;
    }
    case "spooky": {
      const ghosts=[[350,142,0],[430,225,.22],[520,138,.45],[610,228,.68],[735,142,.9]];
      ghosts.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.8+o*8)*7, yy=y+Math.cos(p*0.65+o*7)*6;
        profileGhost(frame,Math.round(xx),Math.round(yy),5+(i%2),i%2?[205,155,255]:[235,235,255]);
      });
      const pumpkins=[[390,140,.1],[480,226,.3],[570,142,.52],[675,225,.76]];
      pumpkins.forEach(([x,y,o],i)=>{
        const xx=x+Math.sin(p*0.6+o*8)*5, yy=y+Math.cos(p*0.55+o*7)*5;
        profilePumpkin(frame,Math.round(xx),Math.round(yy),5+(i%2),[245,125+(i%2)*20,25],phase+o);
      });
      break;
    }
    default: profileStar(frame,360,142,3,pal[0],210); profileStar(frame,744,228,3,pal[0],210); break;
  }
}

async function renderProfileDirectFrame(env,player,phase=0){
  const width=800,height=500;
  const bg=/^#[0-9a-fA-F]{6}$/.test(player.profileColor||"")?player.profileColor:"#ffd9ef";
  const [br,bgG,bb]=hexRgb(bg);
  const scene=solidRGBA(width,height,bg);
  /* Soft panel on the right, matching the original profile-card composition. */
  profileBlendFill(scene,318,18,458,464,255,255,255,205);
  profileBlendFill(scene,330,30,434,440,br,bgG,bb,55);
  profileFill(scene,330,30,434,4,255,255,255,150);
  profileFill(scene,330,466,434,4,255,255,255,150);
  profileFill(scene,318,18,4,464,255,255,255,180);
  profileFill(scene,772,18,4,464,255,255,255,180);

  const treeFile=getTreeImage(player);
  const tree=await getPngAsset(env,treeFile);
  const treeLayer=containRGBA(tree,350,430);
  alphaComposite(scene,treeLayer,10,65);

  const decorFile=getDecorationImage(player);
  if(decorFile){
    try{const decor=await getPngAsset(env,decorFile);const dl=containRGBA(decor,135,135);alphaComposite(scene,dl,165,320);}catch(error){console.warn("Profile decoration skipped",error?.message||error);}
  }
  const effectId=player.equippedNameEffect&&NAME_EFFECTS[player.equippedNameEffect]?player.equippedNameEffect:"";
  const titleId=player.equippedTitle&&SOLO_TITLES[player.equippedTitle]?player.equippedTitle:"";
  const title=titleId?SOLO_TITLES[titleId].name:"No Title";
  const effect=effectId?NAME_EFFECTS[effectId].name:"No Name Effect";
  const ink=[42,32,48], accent=profileEffectColor(effectId);

  /* Card labels and values are drawn with a tiny embedded bitmap font so this path
     needs no browser, websocket, font service, or external renderer. */
  drawBitmapText(scene,profileSafeText(player.displayName||player.username||"Werewife"),350,48,4,ink,390);
  drawBitmapText(scene,"WEREWIVES PROFILE",350,86,2,[100,88,110],390);
  profileBlendFill(scene,350,118,394,105,br,bgG,bb,70);
  drawBitmapText(scene,"TITLE",372,132,2,[110,96,120],350);
  /* Draw particles first so they never erase or cover title letters. */
  drawProfileEffectParticles(scene,effectId,phase);
  drawAnimatedProfileTitle(scene,title,372,158,3,effectId,phase,345);
  drawBitmapText(scene,"NAME EFFECT",372,190,2,[110,96,120],350);
  drawBitmapText(scene,effect,372,212,2,accent,350);

  profileBlendFill(scene,350,250,394,155,255,255,255,100);
  drawBitmapText(scene,"LEVEL",372,268,2,[110,96,120],165);
  drawBitmapText(scene,String(Number(player.level||1)),372,290,3,ink,165);
  drawBitmapText(scene,"SPARKLES",545,268,2,[110,96,120],165);
  drawBitmapText(scene,Number(player.sparkles||0).toLocaleString(),545,290,3,ink,170);
  drawBitmapText(scene,"TREE HEIGHT",372,335,2,[110,96,120],165);
  drawBitmapText(scene,String(Number(getTreeHeight(player)||0))+" FT",372,357,3,ink,165);
  drawBitmapText(scene,"SOLO WINS",545,335,2,[110,96,120],165);
  drawBitmapText(scene,String(Number(player.soloWins||0)),545,357,3,ink,170);
  drawBitmapText(scene,String(Number(player.titles?.length||0))+" TITLES OWNED",350,435,2,[100,88,110],390);
  return rgbaToRgbPng(scene);
}


function drawBirthdayConfetti(frame, phase=0) {
  const pieces = [
    [0.10,0.18,255,115,190,12,34],[0.19,0.30,255,210,90,10,28],
    [0.28,0.16,170,130,255,12,32],[0.38,0.26,255,205,90,11,30],
    [0.48,0.14,255,235,120,10,34],[0.58,0.29,175,135,255,12,30],
    [0.68,0.18,255,125,190,11,33],[0.78,0.31,255,220,100,10,29],
    [0.88,0.16,170,135,255,12,31],[0.14,0.58,255,115,190,11,31],
    [0.27,0.66,255,220,100,10,30],[0.41,0.57,175,135,255,12,33],
    [0.56,0.68,255,205,90,10,29],[0.70,0.59,255,235,120,11,32],
    [0.84,0.66,170,130,255,12,30]
  ];
  for (let i=0;i<pieces.length;i++) {
    const [baseX,baseY,r,g,b,w,h] = pieces[i];
    const x = baseX + Math.sin((phase*Math.PI*2)+(i*0.9))*0.018;
    const y = ((baseY + phase*0.20 + (i%3)*0.015) % 1.12) - 0.06;
    const px=x*frame.width, py=y*frame.height;
    profileFill(frame, px, py, w, h, r,g,b,255);
    profileFill(frame, px+Math.round(w*0.45), py-6, Math.max(2,Math.round(w*0.18)), 12, 255,255,255,230);
  }
}


function drawBirthdayCupcakeChaos(frame, phase=0) {
  const items = [
    [0.13,0.18,0],[0.29,0.31,1],[0.47,0.15,2],[0.66,0.27,3],[0.84,0.16,4],
    [0.20,0.63,5],[0.40,0.55,6],[0.61,0.68,7],[0.80,0.58,8]
  ];
  const frosting=[[255,156,213],[255,207,232],[198,151,255],[255,239,139],[157,232,255]];
  for(let i=0;i<items.length;i++){
    const [bx,by,kind]=items[i];
    const x=(bx+Math.sin(phase*Math.PI*2+i)*0.018)*frame.width;
    const y=((by+phase*0.10+(i%3)*0.012)%1.05-0.025)*frame.height;
    const w=42,h=34,c=frosting[kind%frosting.length];
    profileFill(frame,x,y,w,h,255,255,255,235);
    profileFill(frame,x+5,y+8,w-10,h-8,c[0],c[1],c[2],255);
    profileFill(frame,x+9,y+2,w-18,8,c[0],c[1],c[2],255);
    const spr=[255,90,170,255,230,80,200,150][i%8];
    profileFill(frame,x+10,y+13,5,3,255,255,255,255);
    profileFill(frame,x+25,y+19,5,3,255,255,255,255);
    profileFill(frame,x+16,y+27,5,3,spr,255,255,255);
  }
}

function drawBirthdayRaccoonParty(frame, phase=0) {
  const raccoons=[[0.10,0.20],[0.34,0.33],[0.58,0.18],[0.82,0.32],[0.22,0.68],[0.48,0.57],[0.73,0.68]];
  for(let i=0;i<raccoons.length;i++){
    const [bx,by]=raccoons[i], x=(bx+Math.sin(phase*Math.PI*2+i)*0.012)*frame.width;
    const y=((by+phase*0.06+(i%2)*0.01)%1.08-0.04)*frame.height;
    // tiny pixel raccoon: ears, head, mask, eyes, body, tail
    profileFill(frame,x+8,y,10,10,70,70,78,255); profileFill(frame,x+28,y,10,10,70,70,78,255);
    profileFill(frame,x,y+8,46,30,112,112,120,255);
    profileFill(frame,x+5,y+14,36,16,55,55,62,255);
    profileFill(frame,x+11,y+17,7,7,255,255,255,255); profileFill(frame,x+28,y+17,7,7,255,255,255,255);
    profileFill(frame,x+14,y+19,3,3,20,20,25,255); profileFill(frame,x+31,y+19,3,3,20,20,25,255);
    profileFill(frame,x+18,y+27,10,5,30,30,35,255);
    profileFill(frame,x+6,y+38,34,24,150,120,130,255);
    profileFill(frame,x+39,y+45,18,8,112,112,120,255);
    // party hat
    profileFill(frame,x+15,y-12,16,4,255,105,190,255); profileFill(frame,x+19,y-18,8,7,255,105,190,255);
    profileFill(frame,x+22,y-21,3,3,255,235,90,255);
  }
  for(let i=0;i<8;i++){const x=(0.08+i*0.12)*frame.width,y=(0.48+Math.sin(phase*6+i)*0.08)*frame.height;profileFill(frame,x,y,7,7,255,220,90,255);}
}

function drawBirthdayBalloonFloat(frame, phase=0) {
  const balloons=[
    [0.12,0.82,255,120,170],[0.25,0.58,255,190,80],[0.40,0.88,150,220,255],[0.56,0.64,190,140,255],
    [0.72,0.84,255,120,170],[0.86,0.58,255,210,80],[0.32,0.30,170,255,190],[0.68,0.27,190,160,255]
  ];
  for(let i=0;i<balloons.length;i++){
    const [bx,by,r,g,b]=balloons[i], x=(bx+Math.sin(phase*6+i)*0.025)*frame.width;
    const y=((by-phase*0.13+(i%2)*0.03)%1.15-0.08)*frame.height;
    const cx=Math.round(x),cy=Math.round(y),rad=25;
    for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){
      if((dx*dx)/(rad*rad)+(dy*dy)/(rad*rad)>1)continue;
      const px=cx+dx,py=cy+dy;if(px<0||py<0||px>=frame.width||py>=frame.height)continue;
      profileFill(frame,px,py,1,1,r,g,b,255);
    }
    profileFill(frame,cx-4,cy+rad-1,8,8,r,g,b,255);
    for(let t=0;t<90;t++){const sy=cy+rad+7+t;if(sy>=frame.height)break;const sway=Math.round(Math.sin(t/13+phase*7+i)*5);profileFill(frame,cx+sway,sy,2,1,255,255,255,150);}
  }
}

function drawBirthdayPumpkinSparkle(frame, phase=0) {
  const pumpkins=[[0.13,0.22],[0.32,0.34],[0.51,0.18],[0.70,0.31],[0.88,0.20],[0.23,0.67],[0.47,0.58],[0.73,0.68]];
  for(let i=0;i<pumpkins.length;i++){
    const [bx,by]=pumpkins[i],x=(bx+Math.sin(phase*5+i)*0.012)*frame.width,y=((by+phase*0.08)%1.08-0.04)*frame.height;
    profileFill(frame,x+8,y,34,28,255,139,45,255); profileFill(frame,x+3,y+8,44,18,255,139,45,255);
    profileFill(frame,x+20,y-5,10,7,75,150,65,255);
    profileFill(frame,x+13,y+15,6,5,35,35,40,255); profileFill(frame,x+28,y+15,6,5,35,35,40,255); profileFill(frame,x+20,y+22,9,4,35,35,40,255);
    const glow=phase*8+i;
    for(let j=0;j<3;j++){
      const sx=x+55+Math.sin(glow+j*2)*12,sy=y+8+j*16+Math.cos(glow+j)*8;
      drawSparkle(frame,Math.round(sx),Math.round(sy),'star');
    }
  }
}

function effectPixelBlend(frame,x,y,r,g,b,a=255){
  x=Math.round(x); y=Math.round(y);
  if(x<0||y<0||x>=frame.width||y>=frame.height)return;
  const o=(y*frame.width+x)*4, sa=Math.max(0,Math.min(255,a))/255;
  frame.data[o]=Math.round(r*sa+frame.data[o]*(1-sa));
  frame.data[o+1]=Math.round(g*sa+frame.data[o+1]*(1-sa));
  frame.data[o+2]=Math.round(b*sa+frame.data[o+2]*(1-sa));
  frame.data[o+3]=255;
}

// Smooth filled ellipse with optional rotation. Used by the organic animated effects
// so petals, wings, and the cosmic rift are rounded shapes instead of square sprites.
// Helpers used by the finalized organic animated effects.
// effectDisc renders a smooth circular glow rather than a square particle.
function effectDisc(frame,cx,cy,radius,rgb,a=220){
  cx=Math.round(cx); cy=Math.round(cy); radius=Math.max(1,Math.round(radius));
  const r2=radius*radius;
  const left=Math.max(0,cx-radius-1), right=Math.min(frame.width-1,cx+radius+1);
  const top=Math.max(0,cy-radius-1), bottom=Math.min(frame.height-1,cy+radius+1);
  for(let y=top;y<=bottom;y++) for(let x=left;x<=right;x++){
    const dx=x-cx,dy=y-cy,d2=dx*dx+dy*dy;
    if(d2>r2) continue;
    const edge=1-Math.sqrt(d2)/radius;
    const alpha=Math.round(a*(0.30+0.70*edge));
    effectPixelBlend(frame,x,y,rgb[0],rgb[1],rgb[2],alpha);
  }
}

// Draws a smooth anti-aliased-ish ribbon through a list of [x,y] points.
// The segment interpolation keeps curved effects continuous instead of dotted.
function effectRibbonPath(frame,points,width,rgb,a=200){
  if(!Array.isArray(points)||points.length<2) return;
  width=Math.max(1,Number(width)||1);
  const step=Math.max(1,width*0.35);
  for(let i=0;i<points.length-1;i++){
    const x0=Number(points[i][0]), y0=Number(points[i][1]);
    const x1=Number(points[i+1][0]), y1=Number(points[i+1][1]);
    const dist=Math.hypot(x1-x0,y1-y0);
    const count=Math.max(1,Math.ceil(dist/step));
    for(let j=0;j<=count;j++){
      const t=j/count, x=x0+(x1-x0)*t, y=y0+(y1-y0)*t;
      effectDisc(frame,x,y,width*0.52,rgb,a);
    }
  }
}

function drawRotatedEllipse(frame,cx,cy,rx,ry,angle,rgb,a=220){
  const ca=Math.cos(angle),sa=Math.sin(angle),pad=2;
  const left=Math.floor(cx-Math.sqrt(rx*rx*ca*ca+ry*ry*sa*sa)-pad);
  const right=Math.ceil(cx+Math.sqrt(rx*rx*ca*ca+ry*ry*sa*sa)+pad);
  const top=Math.floor(cy-Math.sqrt(rx*rx*sa*sa+ry*ry*ca*ca)-pad);
  const bottom=Math.ceil(cy+Math.sqrt(rx*rx*sa*sa+ry*ry*ca*ca)+pad);
  for(let y=top;y<=bottom;y++){
    for(let x=left;x<=right;x++){
      const dx=x-cx,dy=y-cy;
      const lx=dx*ca+dy*sa, ly=-dx*sa+dy*ca;
      const q=(lx*lx)/(rx*rx)+(ly*ly)/(ry*ry);
      if(q<=1){
        const edge=Math.max(0,Math.min(1,(1-q)*4));
        effectPixelBlend(frame,x,y,rgb[0],rgb[1],rgb[2],Math.round(a*(0.55+0.45*edge)));
      }
    }
  }
}

function drawOrganicPetal(frame,cx,cy,size,angle,rgb,alpha=225){
  // Rounded petal body + pointed tip + soft highlight + central vein.
  const ca=Math.cos(angle),sa=Math.sin(angle);
  drawRotatedEllipse(frame,cx,cy,size*0.62,size*0.36,angle,rgb,alpha);
  const tipX=cx+ca*size*0.58, tipY=cy+sa*size*0.58;
  drawRotatedEllipse(frame,tipX,tipY,size*0.27,size*0.18,angle,rgb,alpha-10);
  drawRotatedEllipse(frame,cx-ca*size*0.13,cy-sa*size*0.13,size*0.18,size*0.10,angle,[255,245,250],125);
  const vein=[];
  for(let i=0;i<8;i++){
    const t=i/7, d=(t-0.5)*size*0.85;
    vein.push([cx+ca*d,cy+sa*d]);
  }
  effectRibbonPath(frame,vein,1.8,[255,125,180],105);
}

function drawAnimatedPetalStorm(frame, phase=0) {
  const petals=[
    [0.07,0.10,25,0.2,0],[0.19,0.28,31,-0.7,1],[0.33,0.06,23,0.9,2],[0.48,0.25,34,-0.2,3],
    [0.63,0.09,26,0.6,4],[0.79,0.31,32,-0.9,5],[0.94,0.08,24,0.4,6],[0.11,0.58,29,-0.5,7],
    [0.30,0.72,25,0.8,8],[0.53,0.63,33,-0.4,9],[0.72,0.57,27,0.7,10],[0.90,0.73,30,-0.8,11],
    [0.42,0.48,22,0.1,12],[0.84,0.46,23,0.9,13]
  ];
  const colors=[[255,153,198],[255,184,215],[248,125,180],[255,211,228],[235,105,169]];
  for(let i=0;i<petals.length;i++){
    const [bx,by,size,baseAngle,seed]=petals[i];
    const t=(phase*0.72+i*0.071)%1;
    const x=(bx+Math.sin(t*Math.PI*2+seed)*0.055+Math.sin(phase*4+seed)*0.012)*frame.width;
    const y=((by+t*0.72)%1.12-0.07)*frame.height;
    const angle=baseAngle+Math.sin(phase*Math.PI*2*1.7+seed)*0.75+t*1.8;
    const scale=0.78+0.22*Math.sin(phase*Math.PI*2+seed*1.7)**2;
    drawOrganicPetal(frame,x,y,size*scale,angle,colors[seed%colors.length],220);
  }
  for(let i=0;i<16;i++){
    const t=(phase*1.1+i/16)%1;
    const x=(0.04+t*0.92)*frame.width;
    const y=(0.08+((i%5)*0.17)+Math.sin(t*8+i)*0.025)*frame.height;
    drawSparkle(frame,Math.round(x),Math.round(y),'star');
  }
}

function drawButterfly(frame,cx,cy,size,angle,wingColor,phase,seed){
  const flap=0.78+0.22*Math.sin(phase*Math.PI*2*5+seed);
  const ca=Math.cos(angle),sa=Math.sin(angle);
  function pos(dx,dy){return [cx+dx*ca-dy*sa,cy+dx*sa+dy*ca];}
  const upperY=-size*0.48*flap, lowerY=size*0.36*flap;
  for(const [dx,dy,rx,ry,alpha] of [
    [-size*0.46,upperY,size*0.42,size*0.58,225],[size*0.46,upperY,size*0.42,size*0.58,225],
    [-size*0.40,lowerY,size*0.34,size*0.46,205],[size*0.40,lowerY,size*0.34,size*0.46,205]
  ]){
    const [x,y]=pos(dx,dy);
    drawRotatedEllipse(frame,x,y,rx,ry,angle+(dx<0?-0.18:0.18),wingColor,alpha);
    const [hx,hy]=pos(dx*0.72,dy*0.78);
    drawRotatedEllipse(frame,hx,hy,rx*0.28,ry*0.25,angle,[255,240,250],105);
  }
  const [bx,by]=pos(0,0);
  drawRotatedEllipse(frame,bx,by,size*0.12,size*0.62,angle,[75,42,70],245);
  drawRotatedEllipse(frame,bx,by-size*0.05,size*0.08,size*0.20,angle,[255,220,105],180);
  const ant=[];
  for(let j=0;j<7;j++){
    const t=j/6, [x1,y1]=pos(0,-size*0.45), [x2,y2]=pos((j-3)*size*0.045,-size*(0.82+0.12*Math.sin(t*Math.PI)));
    ant.push([x1+(x2-x1)*t,y1+(y2-y1)*t]);
  }
  effectRibbonPath(frame,ant,1.4,[65,35,65],210);
  const [sx,sy]=pos(0,-size*0.92);
  drawSparkle(frame,Math.round(sx),Math.round(sy),'star');
}

function drawAnimatedButterflyGarden(frame, phase=0) {
  const butterflies=[
    [0.13,0.20,30,-0.22,0],[0.34,0.46,27,0.48,1],[0.55,0.18,34,-0.42,2],
    [0.78,0.38,29,0.30,3],[0.88,0.67,24,-0.55,4],[0.23,0.74,32,0.18,5]
  ];
  const colors=[[255,139,202],[171,126,255],[103,208,255],[255,207,82],[176,239,190]];
  for(let i=0;i<butterflies.length;i++){
    const [bx,by,size,angle,seed]=butterflies[i],t=phase*Math.PI*2+i*1.25;
    const x=(bx+Math.sin(t*1.15)*0.055)*frame.width;
    const y=(by+Math.cos(t*1.35)*0.065)*frame.height;
    drawButterfly(frame,x,y,size,angle+Math.sin(t)*0.22,colors[seed%colors.length],phase,seed);
  }
  // A few tiny drifting butterflies farther in the background.
  for(let i=0;i<4;i++){
    const t=phase*Math.PI*2+i*1.7,x=(0.08+i*0.27+Math.sin(t)*0.035)*frame.width,y=(0.30+i*0.12+Math.cos(t*1.2)*0.04)*frame.height;
    drawButterfly(frame,x,y,15,Math.sin(t)*0.5,colors[(i+2)%colors.length],phase,i+10);
  }
}

function drawAnimatedRainbowTrail(frame, phase=0) {
  const rainbow=[[255,45,75],[255,130,35],[255,225,45],[75,220,105],[65,190,255],[105,105,255],[205,80,245]];
  const paths=[];
  for(let p=0;p<3;p++){
    const pts=[];
    for(let i=0;i<34;i++){
      const t=i/33;
      let x=(0.02+t*0.96)*frame.width;
      let y=(0.18+p*0.28 + 0.09*Math.sin(t*Math.PI*2.0 + phase*Math.PI*2 + p*1.5))*frame.height;
      if(p===1){ y=(0.67-0.32*Math.sin(t*Math.PI) + 0.035*Math.sin(t*8+phase*5))*frame.height; }
      if(p===2){
        const a=Math.PI*0.15+t*Math.PI*1.45+phase*Math.PI*2;
        x=(0.78+0.20*Math.cos(a))*frame.width;
        y=(0.52+0.34*Math.sin(a))*frame.height;
      }
      pts.push([x,y]);
    }
    paths.push(pts);
  }
  for(let p=0;p<paths.length;p++){
    const pts=paths[p];
    for(let band=0;band<rainbow.length;band++){
      const shifted=pts.map(([x,y])=>[x,y+(band-3)*8]);
      effectRibbonPath(frame,shifted,15,rainbow[band],195);
    }
  }
  for(let i=0;i<24;i++){
    const t=(i/24+phase*0.9)%1;
    const x=(0.03+t*0.94)*frame.width;
    const y=(0.18+0.09*Math.sin(t*Math.PI*2+phase*Math.PI*2))*frame.height;
    drawSparkle(frame,Math.round(x),Math.round(y),'rainbow');
  }
}

// Ember Glow: unmistakable little red flames with pointed tongues, hot centers, and drifting embers.
function drawAnimatedEmberGlow(frame, phase=0) {
  const spots=[[0.12,0.92,0.75],[0.22,0.84,0.58],[0.31,0.94,0.82],[0.41,0.80,0.62],[0.52,0.91,0.76],[0.63,0.82,0.64],[0.74,0.94,0.80],[0.84,0.83,0.60],[0.91,0.94,0.70],[0.18,0.63,0.48],[0.35,0.58,0.42],[0.69,0.60,0.45],[0.82,0.52,0.40]];
  function flame(cx,baseY,scale,seed){
    const w=34*scale,h=66*scale;
    const sway=Math.sin(seed*2.3+phase*Math.PI*4)*7*scale;
    const x=cx+sway, top=baseY-h;
    const rows=9;
    for(let r=0;r<rows;r++){
      const t=r/(rows-1);
      const shape=Math.sin(Math.PI*t)*0.86 + 0.14;
      const ww=Math.max(3,w*shape*(0.72+0.28*Math.sin(seed+r*0.9+phase*7)));
      const yy=top+t*h;
      const xx=x-ww/2 + Math.sin(seed+r*0.7+phase*6)*3;
      profileBlendFill(frame,Math.round(xx),Math.round(yy),Math.round(ww),Math.ceil(h/rows)+1,150,18,30,235);
    }
    const innerW=w*0.62, innerH=h*0.64;
    for(let r=0;r<6;r++){
      const t=r/5, ww=Math.max(3,innerW*(0.18+0.82*Math.sin(Math.PI*t/2)));
      const yy=baseY-innerH+t*innerH;
      profileBlendFill(frame,Math.round(x-ww/2),Math.round(yy),Math.round(ww),Math.ceil(innerH/6)+1,235,45,35,245);
    }
    effectDisc(frame,x,baseY-innerH*0.28,Math.max(2,Math.round(w*0.16)),[255,185,55],250);
  }
  for(let i=0;i<spots.length;i++){
    const [bx,by,sc]=spots[i];
    const drift=(phase*0.95+i*0.13)%1;
    const y=((by-drift*0.28+1.08)%1.08)*frame.height;
    flame(bx*frame.width,y,sc, i+drift*4);
  }
  for(let i=0;i<28;i++){
    const t=(phase*1.2+i/28)%1;
    const x=(0.06+((i*37)%88)/100+Math.sin(t*8+i)*0.012)*frame.width;
    const y=(0.92-t*0.78)*frame.height;
    const size=2+(i%3);
    effectDisc(frame,x,y,size,[205,35,38],220);
    if(i%7===0) drawSparkle(frame,Math.round(x+6),Math.round(y-7),'star');
  }
}

// Meteor Shower: large, unmistakable meteors with long tapered fiery tails streaking across the sky.
function drawAnimatedMeteorShower(frame, phase=0) {
  const meteors=[
    [0.00,0.04,0.38,0.42,0],[0.18,-0.02,0.56,0.36,1],[0.44,0.02,0.82,0.48,2],
    [0.74,-0.04,1.02,0.34,3],[0.92,0.12,0.60,0.54,4],[0.05,0.34,0.46,0.78,5],
    [0.52,0.20,0.90,0.68,6],[0.80,0.34,0.98,0.88,7]
  ];
  const tailColors=[[255,55,25],[255,95,25],[255,150,40],[255,205,95],[255,235,175]];
  for(let i=0;i<meteors.length;i++){
    const [sx,sy,ex,ey,seed]=meteors[i];
    const t=(phase*0.95+i*0.16)%1;
    const x=(sx+(ex-sx)*t)*frame.width, y=(sy+(ey-sy)*t)*frame.height;
    const dx=(ex-sx)*frame.width,dy=(ey-sy)*frame.height;
    const len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len;
    for(let k=12;k>=1;k--){
      const d=k*12;
      const tx=x-ux*d,ty=y-uy*d;
      const radius=2.5+(12-k)*0.55;
      effectDisc(frame,tx,ty,radius,tailColors[k%tailColors.length],Math.max(35,210-k*13));
    }
    const head=15+(seed%3)*4;
    effectDisc(frame,x,y,head/2,[255,80,25],255);
    effectDisc(frame,x-ux*2,y-uy*2,head*0.31,[255,225,125],255);
    effectDisc(frame,x-ux*3,y-uy*3,head*0.16,[255,255,245],255);
    drawSparkle(frame,Math.round(x),Math.round(y),'star');
    if(t>0.84){
      const burst=(t-0.84)/0.16;
      for(let j=0;j<7;j++){
        const a=j*Math.PI*2/7+seed*0.5, r=10+burst*34;
        effectDisc(frame,x+Math.cos(a)*r,y+Math.sin(a)*r,2.5,[255,170,70],210);
      }
    }
  }
}

function drawAnimatedCosmicRift(frame, phase=0) {
  const cx=0.50*frame.width, cy=0.47*frame.height;
  const pulse=0.94+0.06*Math.sin(phase*Math.PI*2);
  // Deep, organic rift opening: a smooth dark ellipse with a luminous rim.
  drawRotatedEllipse(frame,cx,cy,190*pulse,72*pulse,0.10,[24,10,45],185);
  for(let ring=0;ring<5;ring++){
    const rx=205+ring*15, ry=82+ring*7;
    const pts=[];
    for(let i=0;i<64;i++){
      const a=i/64*Math.PI*2+phase*Math.PI*(0.7+ring*0.08);
      pts.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);
    }
    const c=ring%3===0?[190,90,255]:ring%3===1?[91,181,255]:[110,245,220];
    effectRibbonPath(frame,pts,ring===0?12:7,c,Math.max(65,170-ring*20));
  }

  // Continuous spiral arms, giving the effect a real swirling cosmic-rift shape.
  const spiralColors=[[224,112,255],[118,194,255],[94,244,226],[190,118,255]];
  for(let arm=0;arm<3;arm++){
    const pts=[];
    for(let i=0;i<58;i++){
      const t=i/57;
      const a=t*Math.PI*3.2+phase*Math.PI*2+arm*Math.PI*2/3;
      const radius=24+t*210;
      const x=cx+Math.cos(a)*radius;
      const y=cy+Math.sin(a)*radius*0.36;
      pts.push([x,y]);
    }
    effectRibbonPath(frame,pts,6,spiralColors[arm],170);
    effectRibbonPath(frame,pts,2.2,[245,220,255],175);
  }

  // Floating cosmic dust follows the spiral instead of appearing as square particles.
  for(let i=0;i<28;i++){
    const t=(phase*0.65+i/28)%1;
    const a=t*Math.PI*3.2+(i%3)*Math.PI*2/3;
    const radius=55+t*205;
    const x=cx+Math.cos(a)*radius;
    const y=cy+Math.sin(a)*radius*0.36;
    effectDisc(frame,x,y,2+(i%3),[205,160,255],145);
    if(i%5===0)drawSparkle(frame,Math.round(x),Math.round(y),'star');
  }

  // Bright center flare where the rift opens.
  effectDisc(frame,cx,cy,24,[118,72,210],90);
  effectDisc(frame,cx,cy,10,[235,215,255],175);
  drawSparkle(frame,Math.round(cx),Math.round(cy),'star');
}

function drawBeansBurst(frame, phase=0) {
  // A private gift effect for Beans: real bean-shaped sprites fall from above,
  // then pop into bright sparkle bursts. Everything is rendered directly into
  // the animated GIF so it does not need Browser Rendering or an external asset.
  const beans = [
    [0.10, 0.00, 0.86, 0], [0.25, 0.20, 0.72, 1], [0.42, 0.05, 0.92, 2],
    [0.58, 0.28, 0.70, 3], [0.75, 0.08, 0.88, 4], [0.90, 0.24, 0.74, 5],
    [0.18, 0.40, 0.82, 6], [0.37, 0.34, 0.76, 7], [0.63, 0.43, 0.80, 8],
    [0.82, 0.36, 0.74, 9]
  ];
  const beanColors = [
    [190, 82, 105], [226, 118, 145], [164, 72, 96], [245, 145, 164], [142, 64, 88]
  ];

  function drawBean(frame, cx, cy, scale, rgb, tilt=0) {
    const [r,g,b] = rgb;
    const w = Math.max(18, Math.round(54*scale));
    const h = Math.max(12, Math.round(34*scale));
    const x = Math.round(cx - w/2), y = Math.round(cy - h/2);
    const rows = [
      [0.24,0.46],[0.10,0.78],[0.02,0.92],[0.00,1.00],[0.08,0.90],[0.20,0.70],[0.34,0.48]
    ];
    for(let i=0;i<rows.length;i++){
      const [off,width]=rows[i];
      const yy=y+Math.round(i*h/rows.length);
      const ww=Math.round(w*width), xx=x+Math.round((w-ww)/2 + Math.sin(tilt+i*0.7)*scale*2);
      profileFill(frame,xx,yy,ww,Math.max(2,Math.ceil(h/rows.length)+1),r,g,b,255);
    }
    // Inner curve/notch makes the silhouette read as a kidney bean rather than a capsule.
    profileFill(frame,x+Math.round(w*0.43),y+Math.round(h*0.26),Math.round(w*0.30),Math.round(h*0.24),Math.max(80,r-65),Math.max(35,g-35),Math.max(50,b-35),255);
    profileFill(frame,x+Math.round(w*0.18),y+Math.round(h*0.22),Math.max(3,Math.round(w*0.18)),Math.max(2,Math.round(h*0.10)),255,210,220,220);
  }

  for(let i=0;i<beans.length;i++){
    const [bx,startY,impactY,seed]=beans[i];
    const local=(phase*1.35 + i*0.087)%1;
    const fallEnd=0.64;
    const impactProgress=local<fallEnd ? 0 : (local-fallEnd)/(1-fallEnd);
    let y;
    let scale=1;
    if(local<fallEnd){
      const t=local/fallEnd;
      y=(startY + (impactY-startY)*t)*frame.height;
      y += Math.sin(t*Math.PI*4+seed)*10;
    } else {
      y=impactY*frame.height;
      scale=Math.max(0.18,1-impactProgress*0.82);
    }
    const x=(bx + Math.sin(seed*2.3+local*Math.PI*2)*0.018)*frame.width;
    if(local<fallEnd){
      drawBean(frame,x,y,scale,beanColors[seed%beanColors.length],seed+local*4);
      // Tiny glitter trail behind the falling bean.
      for(let t=1;t<=3;t++){
        const ty=y-18*t;
        if(ty>0) drawSparkle(frame,Math.round(x+Math.sin(seed+t)*8),Math.round(ty),'star');
      }
    } else {
      if(impactProgress<0.20) drawBean(frame,x,y,scale,beanColors[seed%beanColors.length],seed);
      const burst=Math.min(1,impactProgress/0.72);
      const count=8;
      for(let j=0;j<count;j++){
        const ang=(Math.PI*2*j/count)+(seed*0.41);
        const radius=(18+burst*82)*(1+0.12*Math.sin(seed+j));
        const sx=x+Math.cos(ang)*radius;
        const sy=y+Math.sin(ang)*radius;
        drawSparkle(frame,Math.round(sx),Math.round(sy),'star');
        if(j%2===0){
          const px=sx+Math.cos(ang+1.2)*12, py=sy+Math.sin(ang+1.2)*12;
          profileFill(frame,Math.round(px),Math.round(py),5,5,255,190,235,255);
        }
      }
      drawSparkle(frame,Math.round(x),Math.round(y),'star');
    }
  }
}



function effectTriangle(frame,a,b,c,rgb,alpha=230){
  const minX=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))-1), maxX=Math.min(frame.width-1,Math.ceil(Math.max(a[0],b[0],c[0]))+1);
  const minY=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))-1), maxY=Math.min(frame.height-1,Math.ceil(Math.max(a[1],b[1],c[1]))+1);
  const edge=(p,q,r)=> (p[0]-r[0])*(q[1]-r[1])-(p[1]-r[1])*(q[0]-r[0]);
  const area=edge(a,b,c); if(Math.abs(area)<0.01)return;
  for(let y=minY;y<=maxY;y++) for(let x=minX;x<=maxX;x++){
    const p=[x+0.5,y+0.5];
    const w1=edge(b,c,p)/area,w2=edge(c,a,p)/area,w3=edge(a,b,p)/area;
    if(w1>=0&&w2>=0&&w3>=0) effectPixelBlend(frame,x,y,rgb[0],rgb[1],rgb[2],alpha);
  }
}
function effectPolygon(frame,points,rgb,alpha=230){
  if(!Array.isArray(points)||points.length<3) return;
  for(let i=1;i<points.length-1;i++) effectTriangle(frame,points[0],points[i],points[i+1],rgb,alpha);
}

function effectStar5(frame,cx,cy,rOuter,rInner,rgb,alpha=230,rotation=-Math.PI/2){
  const pts=[];
  for(let i=0;i<10;i++){const r=i%2?rInner:rOuter,a=rotation+i*Math.PI/5;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
  for(let i=1;i<pts.length-1;i++) effectTriangle(frame,pts[0],pts[i],pts[i+1],rgb,alpha);
}

function drawAnimatedFairyFlight(frame, phase=0) {
  // Tiny storybook fairies with a strong person silhouette:
  // round head, hair, bell-shaped dress, tucked wings, separated legs,
  // little feet, and a very obvious magic wand.
  const fairies=[
    [.15,.25,54,0],[.38,.46,50,1],[.64,.22,56,2],[.84,.45,52,3],[.69,.75,48,4]
  ];
  const dresses=[[255,150,215],[185,145,255],[115,205,255],[255,190,125],[135,230,180]];
  const hair=[[120,70,145],[75,55,110],[90,80,150],[135,75,80],[70,120,105]];
  const skin=[255,226,220], outline=[55,40,78], white=[255,250,255];

  for(const [bx,by,size,seed] of fairies){
    const t=phase*Math.PI*2+seed*1.33;
    const x=(bx+Math.sin(t*1.05)*.035)*frame.width;
    const y=(by+Math.cos(t*1.12)*.045)*frame.height;
    const c=dresses[seed%dresses.length], hc=hair[seed%hair.length];
    const flap=Math.sin(phase*Math.PI*8+seed)*.10;

    // Wings are smaller and clearly behind the shoulders.
    drawRotatedEllipse(frame,x-size*.30,y-size*.02,size*.17,size*.31,-.32+flap,[175,225,255],185);
    drawRotatedEllipse(frame,x+size*.30,y-size*.02,size*.17,size*.31,.32-flap,[220,185,255],185);
    drawRotatedEllipse(frame,x-size*.29,y-size*.03,size*.115,size*.25,-.32+flap,[220,245,255],170);
    drawRotatedEllipse(frame,x+size*.29,y-size*.03,size*.115,size*.25,.32-flap,[245,220,255],170);

    // Neck + torso under the dress so it reads as a person, not a triangle.
    effectRibbonPath(frame,[[x,y-size*.19],[x,y+size*.12]],size*.12,skin,250);
    effectTriangle(frame,[x-size*.20,y-size*.02],[x+size*.20,y-size*.02],[x+size*.43,y+size*.62],outline,250);
    effectTriangle(frame,[x-size*.16,y+size*.00],[x+size*.16,y+size*.00],[x+size*.33,y+size*.54],c,250);

    // Head and hair.
    effectDisc(frame,x,y-size*.40,size*.29,outline,250);
    effectDisc(frame,x,y-size*.41,size*.235,skin,250);
    drawRotatedEllipse(frame,x,y-size*.53,size*.25,size*.17,0,hc,245);
    effectTriangle(frame,[x-size*.18,y-size*.36],[x-size*.30,y-size*.54],[x-size*.08,y-size*.46],hc,240);
    effectTriangle(frame,[x+size*.18,y-size*.36],[x+size*.30,y-size*.54],[x+size*.08,y-size*.46],hc,240);

    // Simple face.
    effectDisc(frame,x-size*.08,y-size*.42,size*.034,outline,250);
    effectDisc(frame,x+size*.08,y-size*.42,size*.034,outline,250);
    effectRibbonPath(frame,[[x-size*.035,y-size*.31],[x,y-size*.28],[x+size*.035,y-size*.31]],size*.018,[150,70,110],230);

    // Arms, one reaching toward the wand.
    effectRibbonPath(frame,[[x-size*.13,y-size*.01],[x-size*.40,y+size*.03],[x-size*.53,y-size*.18]],size*.065,outline,245);
    effectRibbonPath(frame,[[x+size*.13,y-size*.01],[x+size*.38,y-size*.15],[x+size*.62,y-size*.43]],size*.065,outline,245);
    effectRibbonPath(frame,[[x-size*.13,y-size*.01],[x-size*.39,y+size*.03],[x-size*.51,y-size*.17]],size*.034,skin,245);
    effectRibbonPath(frame,[[x+size*.13,y-size*.01],[x+size*.38,y-size*.15],[x+size*.61,y-size*.42]],size*.034,skin,245);

    // Legs extend below the dress with a visible gap between them.
    effectRibbonPath(frame,[[x-size*.09,y+size*.48],[x-size*.16,y+size*.83]],size*.075,outline,245);
    effectRibbonPath(frame,[[x+size*.09,y+size*.48],[x+size*.16,y+size*.83]],size*.075,outline,245);
    effectRibbonPath(frame,[[x-size*.09,y+size*.48],[x-size*.16,y+size*.81]],size*.042,skin,245);
    effectRibbonPath(frame,[[x+size*.09,y+size*.48],[x+size*.16,y+size*.81]],size*.042,skin,245);
    effectDisc(frame,x-size*.20,y+size*.86,size*.085,c,240);
    effectDisc(frame,x+size*.20,y+size*.86,size*.085,c,240);

    // Oversized wand + star.
    effectRibbonPath(frame,[[x+size*.51,y-size*.39],[x+size*.83,y-size*.65]],size*.038,white,250);
    effectStar5(frame,x+size*.90,y-size*.70,size*.18,size*.075,[255,235,105],250);
    drawSparkle(frame,Math.round(x+size*1.04),Math.round(y-size*.83),'star');

    // Glitter trail.
    for(let k=0;k<6;k++){
      const gx=x-size*(.68+k*.20)+Math.sin(t+k)*size*.06;
      const gy=y+size*(.10-k*.15)+Math.cos(t*1.4+k)*size*.08;
      drawSparkle(frame,Math.round(gx),Math.round(gy),k%2?'dot':'star');
    }
  }
}

function drawAnimatedCrystalAura(frame, phase=0) {
  // Gemstone silhouettes are outlined first, then divided into visible facets.
  // This keeps them readable after the GIF palette reduction.
  const cx=frame.width*.5,cy=frame.height*.47;
  const crystals=[
    [0,-190,58,[150,220,255],0],[150,-90,52,[215,155,255],1],[150,90,56,[145,240,205],2],
    [0,185,54,[205,160,255],3],[-150,90,56,[165,210,255],4],[-150,-90,52,[235,175,255],5]
  ];
  const outline=[55,50,95];
  for(const [ox,oy,size,c,seed] of crystals){
    const a=phase*Math.PI*2*.35+seed*.7;
    const x=cx+ox*Math.cos(phase*Math.PI*2*.22)-oy*Math.sin(phase*Math.PI*2*.22)*.08;
    const y=cy+oy+Math.sin(a)*14;
    const pts=[
      [x,y-size*1.10],[x+size*.55,y-size*.52],[x+size*.48,y+size*.55],
      [x,y+size*.92],[x-size*.48,y+size*.55],[x-size*.55,y-size*.52]
    ];
    effectPolygon(frame,pts,outline,235);
    const inner=[
      [x,y-size*.94],[x+size*.45,y-size*.43],[x+size*.39,y+size*.47],
      [x,y+size*.78],[x-size*.39,y+size*.47],[x-size*.45,y-size*.43]
    ];
    effectPolygon(frame,inner,c,245);
    // Strong triangular facets.
    effectTriangle(frame,[x,y-size*.94],[x+size*.45,y-size*.43],[x,y+size*.02],[235,250,255],210);
    effectTriangle(frame,[x,y-size*.94],[x,y+size*.02],[x-size*.45,y-size*.43],[185,230,255],175);
    effectTriangle(frame,[x,y+size*.02],[x+size*.39,y+size*.47],[x,y+size*.78],[110,175,235],150);
    effectTriangle(frame,[x,y+size*.02],[x,y+size*.78],[x-size*.39,y+size*.47],[150,120,205],145);
    effectDisc(frame,x-size*.05,y-size*.48,size*.075,[255,255,255],220);
  }
  // A few tiny loose crystal shards orbit the aura.
  for(let i=0;i<8;i++){
    const a=phase*Math.PI*2+i*Math.PI/4;
    const r=255+18*Math.sin(i*2.1);
    const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*.62;
    effectTriangle(frame,[x,y-13],[x+9,y+5],[x-9,y+5],[190,225,255],190);
  }
}

function drawAnimatedStarfall(frame, phase=0) {
  const stars=[
    [.08,.02,14,0],[.22,.20,18,1],[.37,.06,11,2],[.52,.28,16,3],[.68,.10,13,4],
    [.82,.24,19,5],[.92,.04,12,6],[.14,.55,13,7],[.43,.66,17,8],[.73,.56,14,9]
  ];
  for(const [bx,by,r,seed] of stars){
    const t=(phase*.55+seed*.11)%1;
    const x=(bx+Math.sin(t*6+seed)*.018)*frame.width;
    const y=((by+t*.62)%1.08)*frame.height;
    const pulse=.8+.2*Math.sin(phase*Math.PI*4+seed);
    effectStar5(frame,x,y,r*pulse,r*.42,[255,240,125],240);
    effectDisc(frame,x,y,r*.16,[255,255,255],220);
  }
}

function drawUnicornShape(frame,x,y,size,mane,phase,seed){
  const body=[250,244,255];
  const bob=Math.sin(phase*Math.PI*2+seed)*3;
  y+=bob;
  drawRotatedEllipse(frame,x,y,size*1.45,size*.58,0,body,250);
  for(const lx of [-.9,-.45,.35,.82]){
    const swing=Math.sin(phase*Math.PI*2*1.5+seed+lx)*size*.12;
    effectRibbonPath(frame,[[x+lx*size,y+size*.35],[x+(lx+.03)*size+swing,y+size*1.18]],size*.10,body,250);
  }
  effectRibbonPath(frame,[[x+size*.8,y],[x+size*1.05,y-size*.9],[x+size*1.55,y-size*.95]],size*.34,body,250);
  drawRotatedEllipse(frame,x+size*1.42,y-size*.95,size*.62,size*.48,0,body,250);
  drawRotatedEllipse(frame,x+size*1.86,y-size*.88,size*.32,size*.25,0,body,250);
  // Integrated mane hugs the neck; it is short and layered, never a detached blob.
  for(let k=0;k<3;k++){
    const pts=[];
    for(let j=0;j<7;j++){
      const t=j/6;
      pts.push([
        x+size*(1.03-t*.55)+Math.sin(t*Math.PI+phase*2+seed+k)*size*.035,
        y-size*(.98-t*.62)-k*size*.045
      ]);
    }
    effectRibbonPath(frame,pts,size*(.13-.018*k),mane,220);
  }
  effectRibbonPath(frame,[[x-size*1.32,y-size*.05],[x-size*1.9,y-size*.15],[x-size*2.25,y+size*.18]],size*.18,mane,215);
  // horn, ear, eye
  effectRibbonPath(frame,[[x+size*1.60,y-size*1.27],[x+size*1.72,y-size*1.72]],size*.07,[255,225,145],250);
  effectRibbonPath(frame,[[x+size*1.25,y-size*1.30],[x+size*1.18,y-size*1.60],[x+size*1.38,y-size*1.38]],size*.10,body,250);
  effectDisc(frame,x+size*1.99,y-size*.98,size*.055,[65,45,90],255);
  drawSparkle(frame,Math.round(x+size*1.72),Math.round(y-size*1.75),'star');
}

function drawAnimatedUnicornSparkle(frame, phase=0) {
  // Rainbow trail stays independent of the unicorns.
  const rainbow=[[255,105,170],[255,170,75],[255,230,90],[100,225,165],[100,180,255],[185,125,255]];
  for(let band=0;band<rainbow.length;band++){
    const pts=[];
    for(let i=0;i<45;i++){
      const t=i/44;
      pts.push([
        (.02+t*.96)*frame.width,
        (.70+.10*Math.sin(t*Math.PI*2.4+phase*Math.PI*2)+(band-2.5)*.025)*frame.height
      ]);
    }
    effectRibbonPath(frame,pts,7,rainbow[band],170);
  }
  const us=[[.24,.32,20,0],[.72,.52,18,1],[.43,.76,15,2]];
  const manes=[[225,175,245],[255,190,220],[190,210,255]];
  for(let i=0;i<us.length;i++){
    const [bx,by,size,seed]=us[i];
    const t=phase*Math.PI*2+seed*2;
    const x=(bx+Math.sin(t)*.035)*frame.width;
    const y=(by+Math.cos(t*1.1)*.035)*frame.height;
    drawUnicornShape(frame,x,y,size,manes[i],phase,seed);
  }
  for(let i=0;i<20;i++){
    const t=(i/20+phase*.85)%1;
    const x=(.04+t*.92)*frame.width;
    const y=(.70+.10*Math.sin(t*Math.PI*2.4+phase*Math.PI*2))*frame.height;
    drawSparkle(frame,Math.round(x),Math.round(y),'rainbow');
  }
}

function drawAnimatedSnowfall(frame, phase=0) {
  for(let i=0;i<30;i++){
    const t=(phase*.55+i/30)%1;
    const x=(.02+((i*43)%96)/100+.025*Math.sin(phase*6+i))*frame.width;
    const y=((t*1.05)-.04)*frame.height;
    const size=2+(i%6)*1.5;
    effectDisc(frame,x,y,size,[245,252,255],185);
    if(size>7){
      effectRibbonPath(frame,[[x-size,y],[x+size,y],[x,y-size],[x,y+size]],1.4,[255,255,255],170);
    }
  }
}

function drawAnimatedFlowerBloom(frame, phase=0) {
  const flowers=[[.16,.76,18,0],[.36,.61,22,1],[.58,.74,19,2],[.79,.57,24,3],[.88,.80,15,4]];
  const cols=[[255,150,205],[255,205,225],[205,175,255],[170,220,255],[255,220,130]];
  for(let i=0;i<flowers.length;i++){
    const [x0,y0,size,seed]=flowers[i];
    const cycle=(phase+i*.17)%1;
    const bloom=Math.max(0,Math.sin(cycle*Math.PI));
    const x=x0*frame.width, y=y0*frame.height-(cycle*.08)*frame.height;
    const petals=5;
    for(let p=0;p<petals;p++){
      const a=p*Math.PI*2/petals-.5;
      drawRotatedEllipse(frame,x+Math.cos(a)*size*bloom,y+Math.sin(a)*size*bloom,size*.55*bloom,size*.30*bloom,a,cols[seed%cols.length],220);
    }
    effectDisc(frame,x,y,Math.max(2,size*.25*bloom),[255,220,100],230);
    if(bloom>.75) drawSparkle(frame,Math.round(x),Math.round(y-size), 'star');
  }
}

function drawAnimatedBubblePop(frame, phase=0) {
  const bubbles=[[.13,.84,14,0],[.30,.68,20,1],[.51,.88,11,2],[.67,.61,17,3],[.86,.78,23,4],[.43,.48,13,5]];
  for(let i=0;i<bubbles.length;i++){
    const [bx,by,size,seed]=bubbles[i],t=(phase*.62+i*.17)%1;
    const x=bx*frame.width+Math.sin(t*7+seed)*12;
    const y=(by-t*.58)*frame.height;
    const pop=t>.78 ? (t-.78)/.22 : 0;
    if(pop<1){
      drawRotatedEllipse(frame,x,y,size*(1+pop*.8),size*(1+pop*.8),0,[190,235,255],150);
      drawRotatedEllipse(frame,x-size*.25,y-size*.25,size*.25,size*.16,-.5,[255,255,255],150);
    } else {
      const r=size*(.7+(pop-1)*1.6);
      for(let j=0;j<8;j++){
        const a=j*Math.PI/4;
        effectDisc(frame,x+Math.cos(a)*r,y+Math.sin(a)*r,2.5,[180,230,255],180);
      }
      drawSparkle(frame,Math.round(x),Math.round(y),'star');
    }
  }
}

function drawAnimatedCandyStorm(frame, phase=0) {
  // Classic wrapped candies: chunky centers, wide twisted/crinkled wrappers,
  // strong shine, and a few unmistakable lollipops.
  const pieces=[
    [.10,.10,58,0,0],[.31,.18,54,1,1],[.53,.08,60,2,0],[.77,.17,56,3,0],
    [.91,.39,52,4,1],[.18,.49,56,5,0],[.43,.62,60,6,1],[.72,.54,55,7,0],
    [.89,.78,58,8,0],[.28,.83,53,9,1],[.58,.88,56,10,0]
  ];
  const cols=[[255,90,165],[255,205,55],[75,190,255],[180,105,250],[90,225,165],[255,145,105]];
  const white=[255,252,255], outline=[70,42,88];

  for(const [bx,by,size,seed,type] of pieces){
    const t=(phase*.40+seed*.071)%1;
    const x=(bx+Math.sin(t*5.4+seed)*.035)*frame.width;
    const y=((by+t*.72)%1.16-.07)*frame.height;
    const c=cols[seed%cols.length];

    if(type===1){
      // Round lollipop head with a clearly separated stick.
      effectRibbonPath(frame,[[x,y-size*.02],[x+size*.04,y+size*.98]],size*.075,outline,245);
      effectRibbonPath(frame,[[x,y],[x+size*.04,y+size*.96]],size*.040,white,245);
      effectDisc(frame,x,y-size*.40,size*.66,outline,245);
      effectDisc(frame,x,y-size*.40,size*.55,c,250);
      effectRibbonPath(frame,[[x-size*.30,y-size*.57],[x-size*.10,y-size*.68],[x+size*.17,y-size*.56],[x+size*.29,y-size*.38]],size*.065,white,230);
      effectRibbonPath(frame,[[x-size*.25,y-size*.25],[x-size*.03,y-size*.17],[x+size*.22,y-size*.27]],size*.040,white,205);
      effectDisc(frame,x-size*.18,y-size*.57,size*.09,white,245);
    } else {
      // Rounder/plumper candy center.
      const tilt=Math.sin(phase*Math.PI*2+seed)*.13;
      drawRotatedEllipse(frame,x,y,size*.78,size*.54,tilt,outline,245);
      drawRotatedEllipse(frame,x,y,size*.65,size*.42,tilt,c,250);

      // Wide twisted wrapper ends: several overlapping folds make the
      // pinched/crinkled shape obvious even after GIF palette reduction.
      for(const side of [-1,1]){
        const s=side;
        effectTriangle(frame,[x+s*size*.52,y-size*.25],[x+s*size*.96,y-size*.45],[x+s*size*.84,y-size*.04],c,245);
        effectTriangle(frame,[x+s*size*.84,y-size*.04],[x+s*size*1.10,y+size*.10],[x+s*size*.92,y+size*.32],c,245);
        effectTriangle(frame,[x+s*size*.52,y+size*.23],[x+s*size*.94,y+size*.34],[x+s*size*.78,y+size*.48],c,245);

        // Bright crinkle folds.
        effectRibbonPath(frame,[[x+s*size*.58,y-size*.22],[x+s*size*.77,y-size*.34],[x+s*size*.96,y-size*.19]],size*.050,white,225);
        effectRibbonPath(frame,[[x+s*size*.60,y-.0],[x+s*size*.82,y+size*.10],[x+s*size*1.00,y+size*.24]],size*.043,white,215);
        effectRibbonPath(frame,[[x+s*size*.67,y+size*.28],[x+s*size*.82,y+size*.37]],size*.035,white,195);
      }

      // Strong candy shine + center stripe.
      effectRibbonPath(frame,[[x-size*.27,y-size*.27],[x-size*.07,y-size*.36],[x+size*.24,y-size*.22]],size*.085,white,240);
      effectRibbonPath(frame,[[x-size*.20,y+size*.19],[x+size*.20,y+size*.13]],size*.040,white,195);
      effectDisc(frame,x-size*.25,y-size*.17,size*.095,white,245);
    }
  }
}

function drawAnimatedKittyParade(frame, phase=0) {
  // Chibi kitten parade: oversized head, round seated body, tiny paws,
  // fluffy tail, and the proven cute face. Built from bold simple shapes
  // so the Discord GIF palette keeps the cats readable.
  const cats=[
    [.08,.73,58,0],[.33,.69,62,1],[.63,.73,60,2],[.91,.64,56,3]
  ];
  const cols=[[248,218,232],[205,190,245],[235,238,250],[250,225,190]];
  const outline=[52,42,66], eye=[45,35,52];

  for(const [bx,by,size,seed] of cats){
    const t=(phase*.24+seed*.23)%1;
    const bob=Math.sin(t*6+seed)*.012;
    const x=((bx+t*.24)%1.18-.09)*frame.width;
    const y=(by+bob)*frame.height;
    const c=cols[seed%cols.length];
    const sway=Math.sin(t*6+seed)*size*.025;
    const headY=y-size*.29;
    const bodyY=y+size*.18;

    // Thick fluffy tail behind the kitten, curled upward like a real cat tail.
    const side=(seed%2===0)?-1:1;
    effectRibbonPath(frame,[
      [x+side*size*.18,bodyY+size*.15],
      [x+side*size*.38,bodyY+size*.25],
      [x+side*size*.52,bodyY+size*.12],
      [x+side*size*.55,bodyY-size*.05],
      [x+side*size*.43,bodyY-size*.18],
      [x+side*size*.30,bodyY-size*.20]
    ],size*.13,outline,245);
    effectRibbonPath(frame,[
      [x+side*size*.18,bodyY+size*.14],
      [x+side*size*.36,bodyY+size*.22],
      [x+side*size*.47,bodyY+size*.10],
      [x+side*size*.49,bodyY-size*.04],
      [x+side*size*.40,bodyY-size*.14]
    ],size*.075,c,250);

    // Round seated body. This is deliberately circular rather than UFO-shaped.
    effectDisc(frame,x+sway,bodyY,size*.34,outline,250);
    effectDisc(frame,x+sway,bodyY,size*.275,c,252);

    // Little white chest bib/tuft.
    effectDisc(frame,x+sway,bodyY-size*.035,size*.13,[255,250,252],220);

    // Big round head overlaps the body slightly for a true chibi-kitten silhouette.
    effectDisc(frame,x+sway,headY,size*.40,outline,250);
    effectDisc(frame,x+sway,headY,size*.325,c,252);

    // Ears.
    effectTriangle(frame,
      [x-size*.29+sway,headY-size*.20],
      [x-size*.23+sway,headY-size*.53],
      [x-size*.035+sway,headY-size*.30],outline,250);
    effectTriangle(frame,
      [x+size*.035+sway,headY-size*.30],
      [x+size*.23+sway,headY-size*.53],
      [x+size*.29+sway,headY-size*.20],outline,250);
    effectTriangle(frame,
      [x-size*.22+sway,headY-size*.25],
      [x-size*.19+sway,headY-size*.43],
      [x-size*.075+sway,headY-size*.31],[245,155,190],235);
    effectTriangle(frame,
      [x+size*.075+sway,headY-size*.31],
      [x+size*.19+sway,headY-size*.43],
      [x+size*.22+sway,headY-size*.25],[245,155,190],235);

    // KEEP THE CURRENT PROVEN FACE.
    effectDisc(frame,x-size*.115+sway,headY-size*.035,size*.052,eye,255);
    effectDisc(frame,x+size*.115+sway,headY-size*.035,size*.052,eye,255);
    effectDisc(frame,x-size*.095+sway,headY-size*.055,size*.016,[255,255,255],255);
    effectDisc(frame,x+size*.135+sway,headY-size*.055,size*.016,[255,255,255],255);
    effectTriangle(frame,
      [x-size*.05+sway,headY+size*.065],
      [x+sway,headY+size*.115],
      [x+size*.05+sway,headY+size*.065],[235,115,165],250);
    effectRibbonPath(frame,[
      [x+sway,headY+size*.115],[x+sway,headY+size*.165],[x-size*.05+sway,headY+size*.18]
    ],size*.018,eye,230);
    effectRibbonPath(frame,[
      [x+sway,headY+size*.115],[x+sway,headY+size*.165],[x+size*.05+sway,headY+size*.18]
    ],size*.018,eye,230);

    // Tiny front paws tucked against the round body.
    drawRotatedEllipse(frame,
      x-size*.15+sway,bodyY+size*.055,size*.10,size*.16,-0.12,outline,245);
    drawRotatedEllipse(frame,
      x+size*.15+sway,bodyY+size*.055,size*.10,size*.16,0.12,outline,245);
    drawRotatedEllipse(frame,
      x-size*.15+sway,bodyY+size*.055,size*.065,size*.115,-0.12,c,252);
    drawRotatedEllipse(frame,
      x+size*.15+sway,bodyY+size*.055,size*.065,size*.115,0.12,c,252);

    // Round hind feet peeking out at the bottom instead of dangling legs.
    effectDisc(frame,x-size*.18+sway,bodyY+size*.25,size*.12,outline,248);
    effectDisc(frame,x+size*.18+sway,bodyY+size*.25,size*.12,outline,248);
    effectDisc(frame,x-size*.18+sway,bodyY+size*.25,size*.078,c,252);
    effectDisc(frame,x+size*.18+sway,bodyY+size*.25,size*.078,c,252);

    // Collar and tiny bell.
    effectRibbonPath(frame,[
      [x-size*.23+sway,bodyY-size*.09],
      [x+sway,bodyY-size*.015],
      [x+size*.23+sway,bodyY-size*.09]
    ],size*.040,[255,205,95],238);
    effectDisc(frame,x+sway,bodyY+size*.005,size*.045,[255,220,105],245);

    // Short whiskers.
    effectRibbonPath(frame,[
      [x-size*.27+sway,headY+size*.08],[x-size*.49+sway,headY+size*.02]
    ],size*.015,eye,215);
    effectRibbonPath(frame,[
      [x-size*.27+sway,headY+size*.14],[x-size*.49+sway,headY+size*.16]
    ],size*.015,eye,215);
    effectRibbonPath(frame,[
      [x+size*.27+sway,headY+size*.08],[x+size*.49+sway,headY+size*.02]
    ],size*.015,eye,215);
    effectRibbonPath(frame,[
      [x+size*.27+sway,headY+size*.14],[x+size*.49+sway,headY+size*.16]
    ],size*.015,eye,215);

    if(seed%2===0){
      drawSparkle(frame,Math.round(x-side*size*.56),Math.round(headY-size*.30),'star');
    }
  }
}

function drawAnimatedElectricStorm(frame, phase=0) {
  // Full thunderstorm treatment: tall branching strikes fall from the sky,
  // flash brightly, and briefly illuminate the area around the tree.
  // The bolts are built from short connected segments rather than one long
  // smooth ribbon, which keeps the jagged lightning silhouette intact after
  // the GIF palette reduction.
  const strikes=[
    {x:.18,top:.02,bottom:.48,lean:-.04,seed:0},
    {x:.42,top:.00,bottom:.36,lean:.03,seed:1},
    {x:.63,top:.04,bottom:.54,lean:-.025,seed:2},
    {x:.82,top:.01,bottom:.42,lean:.045,seed:3},
    {x:.30,top:.16,bottom:.66,lean:.02,seed:4}
  ];

  const wave=phase*Math.PI*2;

  for(const strike of strikes){
    // Each strike has its own brief flash window so the storm feels random,
    // but remains readable rather than flickering constantly.
    const pulse=Math.sin(wave*2.35+strike.seed*2.17);
    const active=pulse>0.12;
    if(!active) continue;

    const x0=strike.x*frame.width;
    const y0=strike.top*frame.height;
    const yEnd=strike.bottom*frame.height;
    const total=yEnd-y0;

    // Slight horizontal movement between flashes.
    const sway=Math.sin(wave*.7+strike.seed)*12;

    // Build a jagged main strike from the sky downward.
    const pts=[];
    const segments=7;
    for(let i=0;i<=segments;i++){
      const t=i/segments;
      const y=y0+total*t;
      const zig=(i===0||i===segments)
        ? 0
        : ((i%2===0?1:-1)*(24+(strike.seed%3)*5));
      const curve=strike.lean*frame.width*t;
      pts.push([x0+sway+curve+zig,y]);
    }

    // Wide electric aura, dark blue outer glow, bright blue body, white core.
    effectRibbonPath(frame,pts,18,[25,55,120],170);
    effectRibbonPath(frame,pts,11,[70,155,255],225);
    effectRibbonPath(frame,pts,5,[175,230,255],245);
    effectRibbonPath(frame,pts,2.2,[255,255,255],255);

    // Two short natural branches splitting away from the main strike.
    const branchA=pts[2], branchB=pts[4];
    const forkA=[
      branchA,
      [branchA[0]-34,branchA[1]+22],
      [branchA[0]-58,branchA[1]+12],
      [branchA[0]-76,branchA[1]+30]
    ];
    const forkB=[
      branchB,
      [branchB[0]+32,branchB[1]+18],
      [branchB[0]+55,branchB[1]+5],
      [branchB[0]+72,branchB[1]+24]
    ];

    for(const fork of [forkA,forkB]){
      effectRibbonPath(frame,fork,9,[35,90,175],185);
      effectRibbonPath(frame,fork,4,[115,205,255],235);
      effectRibbonPath(frame,fork,1.8,[255,255,255],245);
    }

    // Hot impact point at the end of the strike.
    const impact=pts[pts.length-1];
    effectDisc(frame,impact[0],impact[1],20,[115,205,255],90);
    effectDisc(frame,impact[0],impact[1],9,[255,255,255],220);

    // Small electrical fragments around the strike.
    for(let k=0;k<4;k++){
      const t=((k*.23+phase*.55+strike.seed*.11)%1);
      const idx=Math.min(segments-1,Math.floor(t*segments));
      const p=pts[idx];
      const dx=(k%2===0?1:-1)*(9+k*5);
      const dy=8+(k%3)*7;
      effectRibbonPath(frame,[
        [p[0],p[1]],
        [p[0]+dx,p[1]+dy],
        [p[0]+dx*.55,p[1]+dy+9]
      ],2.5,[170,225,255],190);
    }
  }

  // A brief whole-scene lightning flash makes the strikes feel powerful.
  const globalFlash=Math.pow(Math.max(0,Math.sin(wave*2.35+.9)),12);
  if(globalFlash>.15){
    effectDisc(
      frame,
      frame.width*.5,
      frame.height*.36,
      105+globalFlash*70,
      [210,235,255],
      Math.round(globalFlash*55)
    );
  }
}
function drawAnimatedExperimentalEffect(frame, phase=0) {
  // The intended gimmick: the experiment actually transforms into OTHER
  // finalized effects. Each form gets three full frames, so the change is
  // visible instead of flickering every frame.
  const forms=[
    drawAnimatedCosmicRift,
    drawAnimatedStarfall,
    drawAnimatedRainbowTrail,
    drawAnimatedMeteorShower
  ];
  const stage=Math.min(forms.length-1,Math.floor(phase*forms.length));
  const local=(phase*forms.length)%1;
  // A brief white/purple "test chamber" flash at the start of each mutation.
  if(local<.12){
    const cx=frame.width*.5,cy=frame.height*.46;
    effectDisc(frame,cx,cy,42,[235,215,255],90);
    effectStar5(frame,cx,cy,64,27,[255,255,255],150);
  }
  forms[stage](frame,local);
  // Label-like experimental sparks around the active form.
  for(let i=0;i<4;i++){
    const a=local*Math.PI*2+i*Math.PI/2;
    const r=230+18*Math.sin(i+stage);
    effectDisc(frame,frame.width*.5+Math.cos(a)*r,frame.height*.46+Math.sin(a)*r*.58,5,[205,170,255],180);
  }
}

async function renderTreeDirectFallback(env, player) {
  const width = 1024, height = 1024;
  // Start with a safe color, then replace it with the player's ACTUAL
  // equipped background asset whenever the Worker can decode that image.
  // The previous fallback used only a flat color, which is why /tree showed
  // a plain pink screen instead of the equipped Werewives background.
  const scene = solidRGBA(width, height, treeFallbackBackground(player));

  try {
    const background = await getPngAsset(env, getBackgroundImage(player));
    const layer = coverRGBA(background, width, height);
    alphaComposite(scene, layer, 0, 0);
  } catch (error) {
    console.warn("Direct tree fallback background skipped; using fallback color:", error?.message || error);
  }

  // This fallback deliberately uses only PNG layers that the Worker can decode
  // itself. It exists so /tree can NEVER be held hostage by Browser Rendering.
  try {
    const tree = await getPngAsset(env, getTreeImage(player));
    const layer = containRGBA(tree, 922, 922);
    alphaComposite(scene, layer, Math.round((width - layer.width) / 2), 184);
  } catch (error) {
    console.error("Direct tree fallback tree layer failed:", error);
  }

  const decorationFile = getDecorationImage(player);
  if (decorationFile) {
    try {
      const decoration = await getPngAsset(env, decorationFile);
      const size = player.equipped?.decoration === "stoned_balloon" ? 330 : 280;
      const layer = containRGBA(decoration, size, size);
      alphaComposite(scene, layer, Math.round(width * 0.22 - layer.width / 2), Math.round(height * 0.84 - layer.height / 2));
    } catch (error) {
      console.warn("Direct tree fallback decoration skipped:", error?.message || error);
    }
  }

  const effectFile = getEffectImage(player);
  if (effectFile) {
    try {
      const effect = await getPngAsset(env, effectFile);
      const layer = coverRGBA(effect, width, height);
      alphaComposite(scene, layer, 0, 0, player.equipped?.effect === "raccoon_court_stink" ? 0.90 : 0.42);
    } catch (error) {
      console.warn("Direct tree fallback effect skipped:", error?.message || error);
    }
  }

  // Draw the active sparkles directly so they still appear when Browser
  // Rendering is unavailable.
  for (const sparkle of (player.sparklesOnTree || [])) {
    const x = Math.round((Number(sparkle.x) || 50) / 100 * width);
    const y = Math.round((Number(sparkle.y) || 50) / 100 * height);
    drawSparkle(scene, x, y, String(sparkle.kind || "pink"));
  }

  const birthdayAnimatedEffect = player.equipped?.effect;
  const animatedShopEffect = birthdayAnimatedEffect;
  const animatedEffectDrawers = {
    petal_storm_animated: drawAnimatedPetalStorm,
    butterfly_garden_animated: drawAnimatedButterflyGarden,
    rainbow_trail_animated: drawAnimatedRainbowTrail,
    ember_glow_animated: drawAnimatedEmberGlow,
    meteor_shower_animated: drawAnimatedMeteorShower,
    cosmic_rift_animated: drawAnimatedCosmicRift,
    fairy_flight_animated: drawAnimatedFairyFlight,
    crystal_aura_animated: drawAnimatedCrystalAura,
    starfall_animated: drawAnimatedStarfall,
    unicorn_sparkle_animated: drawAnimatedUnicornSparkle,
    snowfall_animated: drawAnimatedSnowfall,
    flower_bloom_animated: drawAnimatedFlowerBloom,
    bubble_pop_animated: drawAnimatedBubblePop,
    candy_storm_animated: drawAnimatedCandyStorm,
    kitty_parade_animated: drawAnimatedKittyParade,
    electric_storm_animated: drawAnimatedElectricStorm,
    experimental_effect_animated: drawAnimatedExperimentalEffect
  };
  if (animatedEffectDrawers[animatedShopEffect]) {
    const frames=[]; const frameCount=12; const baseData=scene.data.slice();
    for(let i=0;i<frameCount;i++){
      const frame={width,height,data:new Uint8Array(baseData)}; const phase=i/frameCount;
      animatedEffectDrawers[animatedShopEffect](frame,phase);
      frames.push(rgbaToRgbPng(frame));
    }
    return { bytes: await encodePNGFramesToGIF(frames,width,height,8), animated:true };
  }
  if (birthdayAnimatedEffect === "beans") {
    const frames=[];
    const frameCount=12;
    const baseData=scene.data.slice();
    for(let i=0;i<frameCount;i++){
      const frame={width,height,data:new Uint8Array(baseData)};
      drawBeansBurst(frame,i/frameCount);
      frames.push(rgbaToRgbPng(frame));
    }
    return {
      bytes: await encodePNGFramesToGIF(frames,width,height,7),
      animated: true
    };
  }
  if (birthdayAnimatedEffect === "birthday_cupcake_chaos" || birthdayAnimatedEffect === "birthday_raccoon_party" || birthdayAnimatedEffect === "birthday_balloon_float" || birthdayAnimatedEffect === "birthday_pumpkin_sparkle") {
    const frames=[]; const frameCount=8; const baseData=scene.data.slice();
    for(let i=0;i<frameCount;i++){
      const frame={width,height,data:new Uint8Array(baseData)};
      const phase=i/frameCount;
      if(birthdayAnimatedEffect==="birthday_cupcake_chaos") drawBirthdayCupcakeChaos(frame,phase);
      else if(birthdayAnimatedEffect==="birthday_raccoon_party") drawBirthdayRaccoonParty(frame,phase);
      else if(birthdayAnimatedEffect==="birthday_balloon_float") drawBirthdayBalloonFloat(frame,phase);
      else drawBirthdayPumpkinSparkle(frame,phase);
      frames.push(rgbaToRgbPng(frame));
    }
    return { bytes: await encodePNGFramesToGIF(frames,width,height,10), animated:true };
  }

  if (player.equipped?.effect === "birthday_confetti") {
    // IMPORTANT: Confetti no longer depends on Cloudflare Browser Rendering.
    // Browser launch has been timing out, so build the animation directly from
    // the already-rasterized scene. This keeps /tree responsive and gives us a
    // real multi-frame GIF even when Browser Rendering is unavailable.
    const frames=[];
    const frameCount=8;
    const baseData=scene.data.slice();
    for(let i=0;i<frameCount;i++){
      const frame={width,height,data:new Uint8Array(baseData)};
      drawBirthdayConfetti(frame,i/frameCount);
      frames.push(rgbaToRgbPng(frame));
    }
    return {
      bytes: await encodePNGFramesToGIF(frames,width,height,10),
      animated: true
    };
  }

  return { bytes: rgbaToRgbPng(scene), animated: false };
}

async function renderTree(env, player) {
  // Birthday Confetti is rendered as a real animated GIF: one static full-quality
  // tree frame plus transparent confetti-only overlay frames. This avoids
  // re-encoding the entire tree artwork for every animation frame.
  const wantsAnimatedConfetti = player.equipped?.effect === "birthday_confetti";
  const fallback = async (reason) => {
    console.warn("Tree Browser Rendering unavailable; using direct fallback:", reason?.message || reason || "timeout");
    return await renderTreeDirectFallback(env, player);
  };

  // Browser Rendering is currently timing out in this environment. Confetti
  // does not need a browser anymore: the direct raster pipeline below can
  // produce the full animated GIF without launching a browser at all.
  if (wantsAnimatedConfetti) {
    console.log("🎊 Birthday Confetti: using direct animated renderer (no Browser Rendering)");
    return await renderTreeDirectFallback(env, player);
  }

  // Keep ordinary /tree requests out of Cloudflare Browser Rendering too.
  // The browser path can leave non-animated users sitting on Discord's
  // "MyTree is thinking..." state while the render waits or hangs. The direct
  // renderer is already capable of producing the normal tree response without
  // a browser, so use it for every tree request.
  return await renderTreeDirectFallback(env, player);

  try {
    console.log("🎊 Birthday Confetti: launching Browser Rendering...");
    const browser = await Promise.race([
      puppeteer.launch(env.BROWSER),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Browser Rendering launch timed out after 30000ms")), 30000))
    ]);
    console.log("🎊 Birthday Confetti: Browser Rendering launched successfully");

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });

      const background = imageUrl(getBackgroundImage(player));
      const tree = imageUrl(getTreeImage(player));
      const decorationFile = getDecorationImage(player);
      const decoration = decorationFile ? imageUrl(decorationFile) : "";
      const effectFile = getEffectImage(player);
      const effect = effectFile ? imageUrl(effectFile) : "";

      const sparkleHTML = (player.sparklesOnTree || []).map(sparkle => {
        const left = Number(sparkle.x) || 50;
        const top = Number(sparkle.y) || 50;
        const kind = escapeHTML(sparkle.kind || "pink");
        const symbol = kind === "rainbow" ? "✦" : kind === "moon" ? "✧" : kind === "star" ? "★" : "✦";
        const glow = kind === "rainbow" ? "#ff4fd8" : kind === "moon" ? "#9ddcff" : kind === "star" ? "#fff27a" : "#ffb6e8";
        return `<div style="position:absolute;left:${left}%;top:${top}%;transform:translate(-50%,-50%);font-family:Arial,Helvetica,sans-serif;font-size:76px;font-weight:900;line-height:1;color:#ffffff;z-index:20;opacity:1;-webkit-text-stroke:2px ${glow};filter:drop-shadow(0 0 7px #ffffff) drop-shadow(0 0 18px ${glow}) drop-shadow(0 0 34px ${glow});text-shadow:0 0 8px #ffffff,0 0 20px ${glow},0 0 40px ${glow};user-select:none" title="${escapeHTML(sparkle.name || "Sparkle")} — ${Number(sparkle.value) || 0} sparkles">${symbol}</div>`;
      }).join("");

      let decorationHTML = "";
      if (decoration) {
        const isBalloon = player.equipped?.decoration === "stoned_balloon";
        const decorationSize = isBalloon ? "330px" : "280px";
        decorationHTML = `<img src="${decoration}" style="position:absolute;left:22%;top:84%;transform:translate(-50%,-50%);width:${decorationSize};height:${decorationSize};object-fit:contain;z-index:4">`;
      }

      let effectHTML = "";
      if (effect) {
        effectHTML = `<img src="${effect}" style="position:absolute;left:-5%;top:-5%;width:110%;height:110%;object-fit:contain;opacity:${player.equipped?.effect === "raccoon_court_stink" ? "0.90" : "0.42"};mix-blend-mode:${player.equipped?.effect === "raccoon_court_stink" ? "normal" : "screen"};z-index:2;pointer-events:none">`;
      }

      const confettiHTML = (phase = 0) => wantsAnimatedConfetti
        ? Array.from({length:72},(_,i)=>{
            const x = (i * 47 + 7) % 96;
            const y = ((i * 31 + 3 + phase * 38) % 112) - 12;
            const sway = Math.sin((phase * Math.PI * 2) + i * 0.73) * 2.2;
            const rotate = (i * 29 + phase * 180) % 360;
            const width = 8 + (i % 4) * 2;
            const height = 15 + (i % 5) * 3;
            const colors = ["#ff73bd","#ffd166","#9d8cff","#ff9a3c","#ffffff"];
            const c = colors[i % colors.length];
            return `<span style="position:absolute;left:${x+sway}%;top:${y}%;width:${width}px;height:${height}px;background:${c};border-radius:3px;z-index:12;transform:rotate(${rotate}deg);box-shadow:0 0 8px rgba(255,255,255,.75),0 0 12px ${c};pointer-events:none"></span>`;
          }).join("")
        : "";

      const staticHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}html,body{margin:0;padding:0;width:1024px;height:1024px;overflow:hidden;background:#ffd9ef}#scene{position:relative;width:1024px;height:1024px;overflow:hidden}#background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}#tree{position:absolute;left:50%;top:63%;transform:translate(-50%,-50%);width:90%;height:90%;object-fit:contain;z-index:4}</style></head><body><div id="scene"><img id="background" src="${background}"><img id="tree" src="${tree}">${decorationHTML}${effectHTML}${sparkleHTML}</div></body></html>`;
      const overlayHTML = (phase = 0) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}html,body{margin:0;padding:0;width:1024px;height:1024px;overflow:hidden;background:transparent}#scene{position:relative;width:1024px;height:1024px;overflow:hidden;background:transparent}</style></head><body><div id="scene">${confettiHTML(phase)}</div></body></html>`;

      await page.setContent(staticHTML, { waitUntil: "domcontentloaded", timeout: 8000 });
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.race([
          Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }))),
          new Promise(resolve => setTimeout(resolve, 5000))
        ]);
      });

      const waitForImages = async () => {
        await page.evaluate(async () => {
          const images = Array.from(document.images);
          await Promise.race([
            Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }))),
            new Promise(resolve => setTimeout(resolve, 5000))
          ]);
        });
      };
      await waitForImages();

      if (wantsAnimatedConfetti) {
        // CONFETTI ANIMATION V3:
        // Do not use transparent overlay frames. Render the COMPLETE scene for
        // every frame and encode those complete PNG frames into a conventional
        // animated GIF. This removes the transparency/disposal layer entirely
        // and matches the GIF pipeline already used by the working profile GIF.
        const frames = [];
        const frameCount = 6;

        for (let i = 0; i < frameCount; i++) {
          const phase = i / frameCount;
          const frameHTML = staticHTML.replace(
            "</div></body></html>",
            `${confettiHTML(phase)}</div></body></html>`
          );

          await page.setContent(frameHTML, {
            waitUntil: "domcontentloaded",
            timeout: 8000
          });
          await waitForImages();

          frames.push(await page.screenshot({ type: "png" }));
        }

        return {
          bytes: await encodePNGFramesToGIF(frames, 1024, 1024, 12),
          animated: true
        };
      }

      return { bytes: await page.screenshot({ type: "png" }), animated: false };
    } finally {
      try { await browser.close(); } catch (error) { console.error("Tree browser close error:", error); }
    }
  } catch (error) {
    return fallback(error);
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
      If sparkles appeared, render the image so they are actually
      visible on the tree. Otherwise update only the message to
      avoid an unnecessary Browser Rendering call.
    */
    if (spawned > 0) {
      await sendTree(env, interaction, player);
    } else {
      await updateTreeMessage(env, interaction, player);
    }
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

async function courtRestriction(env, interaction, field, label) {
  const user=getUserFromInteraction(interaction); if(!user)return false;
  const player=await getPlayer(env,user.id); await refreshPunishmentState(env,player);
  const until=Math.max(Number(player[field]||0), Number(player.courtUtilityLockUntil||0), Number(player.courtProbationUntil||0));
  if(until>Date.now()) { await sendText(env,interaction,`⚖️🦝 **RACCOON COURT:** ${label} is suspended for **${punishmentTimeText(until)}** more.`); return true; }
  return false;
}

async function handleRecycle(
  env,
  interaction,
  amountInput
) {
  if (await courtRestriction(env,interaction,"courtRecycleBanUntil","recycling")) return;
  if (await courtRestriction(env,interaction,"courtUtilityLockUntil","recycling")) return;
  const punishmentUser = getUserFromInteraction(interaction);
  if (punishmentUser) {
    const punishmentPlayer = await getPlayer(env, punishmentUser.id);
    if (await refreshPunishmentState(env, punishmentPlayer) === "pickle") {
      await sendText(env, interaction, punishmentBlockedText(punishmentPlayer, "pickle"));
      return;
    }
  }

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
  if (await courtRestriction(env,interaction,"courtRiddleBanUntil","daily riddles")) return;
  if (await courtRestriction(env,interaction,"courtUtilityLockUntil","daily riddles")) return;
  const punishmentUser = getUserFromInteraction(interaction);
  if (punishmentUser) {
    const punishmentPlayer = await getPlayer(env, punishmentUser.id);
    if (await refreshPunishmentState(env, punishmentPlayer) === "pickle") {
      await sendText(env, interaction, punishmentBlockedText(punishmentPlayer, "pickle"));
      return;
    }
  }

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
  await showRegularShop(env, interaction);
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
async function showDecorationShop(env, interaction) {
  const user=getUserFromInteraction(interaction); const player=await getPlayer(env,user.id);
  const items=[
    ["panda_decoration","🐼 Panda","buy_panda"], ["cat_decoration","🐱 Cat","buy_cat"],
    ["raccoon_thief_decoration","🦝 Raccoon Thief","buy_raccoon_thief"],
    ["frank_frog_decoration","🐸 Frank the Frog","buy_frank_frog"],
    ["duck_hat_boots_decoration","🦆 Duck With Hat & Boots","buy_duck_hat_boots"],
    ["cheddar_falls_decoration","🧀 Cheddar Falls","buy_cheddar_falls"]
  ];
  const buttons=items.map(([id,label,buy])=>{const owned=player.inventory.includes(id);return button(owned?`${label} Owned`:`${label} — ${SHOP_ITEMS[id].price}`,buy,owned?2:1,owned);});
  const rows=[];for(let i=0;i<buttons.length;i+=3)rows.push(row(...buttons.slice(i,i+3)));rows.push(row(button("⬅️ Back","shop",2)));await sendText(env,interaction,"🎀 **Decoration Shop**\n\nChoose a decoration. ✨",rows);
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
    ["hearts_effect", "💕 Hearts", "buy_hearts"],
    ["halloween_effect", "👻 Halloween Effect", "buy_halloween_effect"]
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
      row(button("🎞️ Animated Effects", "shop_animated_effects", 1)),
      row(button("⬅️ Back", "shop", 2))
    ]
  );
}

async function showAnimatedEffectShop(env, interaction, page = 1) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);
  const items = [
    ["petal_storm_animated_effect", "🌸 Petal Storm", "buy_petal_storm_animated"],
    ["butterfly_garden_animated_effect", "🦋 Butterfly Garden", "buy_butterfly_garden_animated"],
    ["rainbow_trail_animated_effect", "🌈 Rainbow Trail", "buy_rainbow_trail_animated"],
    ["ember_glow_animated_effect", "🔥 Ember Glow", "buy_ember_glow_animated"],
    ["meteor_shower_animated_effect", "☄️ Meteor Shower", "buy_meteor_shower_animated"],
    ["cosmic_rift_animated_effect", "🌌 Cosmic Rift", "buy_cosmic_rift_animated"],
    ["fairy_flight_animated_effect", "🧚 Fairy Flight", "buy_fairy_flight_animated"],
    ["crystal_aura_animated_effect", "🔮 Crystal Aura", "buy_crystal_aura_animated"],
    ["starfall_animated_effect", "⭐ Starfall", "buy_starfall_animated"],
    ["unicorn_sparkle_animated_effect", "🦄 Unicorn Sparkle", "buy_unicorn_sparkle_animated"],
    ["snowfall_animated_effect", "❄️ Snowfall", "buy_snowfall_animated"],
    ["flower_bloom_animated_effect", "🌸 Flower Bloom", "buy_flower_bloom_animated"],
    ["bubble_pop_animated_effect", "🫧 Bubble Pop", "buy_bubble_pop_animated"],
    ["candy_storm_animated_effect", "🍬 Candy Storm", "buy_candy_storm_animated"],
    ["kitty_parade_animated_effect", "🐱 Kitty Parade", "buy_kitty_parade_animated"],
    ["electric_storm_animated_effect", "⚡ Electric Storm", "buy_electric_storm_animated"],
    ["experimental_effect_animated_effect", "🧪 Experimental Effect", "buy_experimental_effect_animated"]
  ];

  const totalPages = 3;
  const safePage = Math.max(1, Math.min(totalPages, Number(page) || 1));
  const pageSize = 6;
  const pageItems = items.slice((safePage - 1) * pageSize, safePage * pageSize);
  const buttons = pageItems.map(([itemId, label, buttonId]) => {
    const owned = player.inventory.includes(itemId);
    return button(
      owned ? `${label} Owned` : `${label} — ${SHOP_ITEMS[itemId].price}`,
      buttonId,
      owned ? 2 : 1,
      owned
    );
  });

  const rows = [];
  for (let i = 0; i < buttons.length; i += 3) {
    rows.push(row(...buttons.slice(i, i + 3)));
  }

  const nav = [];
  if (safePage > 1) nav.push(button("⬅️ Previous", `shop_animated_effects:${safePage - 1}`, 2));
  nav.push(button(`📄 Page ${safePage}/${totalPages}`, "shop_animated_effects:current", 2, true));
  if (safePage < totalPages) nav.push(button("Next ➡️", `shop_animated_effects:${safePage + 1}`, 1));
  rows.push(row(...nav));
  rows.push(row(button("⬅️ Back to Effects", "shop_effects", 2)));

  await sendText(
    env,
    interaction,
    `🎞️ **ANIMATED EFFECTS — PAGE ${safePage}/${totalPages}**\n\nChoose an animated effect to purchase. ✨\n\n🌸 Petals • 🦋 Butterflies • 🌈 Rainbows • 🔥 Fire • ☄️ Meteors • 🌌 Cosmic • 🧚 Fairies • 🔮 Crystals • ⭐ Stars • 🦄 Unicorns • ❄️ Snow • 🌷 Blooms • 🫧 Bubbles • 🍬 Candy • 🐱 Kitties • ⚡ Electricity • 🧪 Experimental`,
    rows
  );
}

const REGULAR_SHOP_SETS = [
  {
    id: "candyland",
    label: "🍭 Candyland Bundle",
    description: "Dreamy pastel candy set",
    items: [
      ["cotton_candy_tree", "🍭 Cotton Candy Tree", "buy_cotton_candy"],
      ["candyland_background", "🍬 Candyland Background", "buy_candyland"],
      ["candy_effect", "🍭 Candy Effect", "buy_candy_effect"]
    ]
  }
];

async function showRegularShop(env, interaction) {
  await deferInteraction(env, interaction, { update: true });
  const buttons = REGULAR_SHOP_SETS.map(set => button(set.label, `regular_set:${set.id}`, 1));
  const rows=[]; for(let i=0;i<buttons.length;i+=2) rows.push(row(...buttons.slice(i,i+2)));
  rows.push(row(button("🌌 Backgrounds","shop_backgrounds",2),button("🌳 Trees","shop_trees",2)));
  rows.push(row(button("🎀 Decorations","shop_decorations",2),button("✨ Effects","shop_effects",2),button("🎞️ Animated","shop_animated_effects",1)));
  rows.push(row(button("🎁 Limited / Holiday","shop_limited",1),button("⬅️ Back","back_tree",2)));
  await sendText(env,interaction,"🛍️ **REGULAR SHOP**\n\n🍭 **Candyland** is the only full bundle in the Regular Shop. Forest and nature cosmetics are sold in their proper individual categories. Candyland items are bundle-only here. ✨",rows);
}

async function showRegularSet(env,interaction,setId){
  await deferInteraction(env,interaction,{update:true});
  const set=REGULAR_SHOP_SETS.find(x=>x.id===setId); if(!set)return sendText(env,interaction,"❌ That regular bundle doesn't exist.");
  const user=getUserFromInteraction(interaction); const player=await getPlayer(env,user.id);
  const buttons=set.items.map(([itemId,label,buyId])=>{const owned=player.inventory.includes(itemId);const item=SHOP_ITEMS[itemId];return button(owned?`${label} Owned`:`${label} — ${item?.price||0}`,buyId,owned?2:1,owned);});
  const rows=[];for(let i=0;i<buttons.length;i+=3)rows.push(row(...buttons.slice(i,i+3)));rows.push(row(button("⬅️ Back to Regular Shop","shop",2)));
  await sendText(env,interaction,`🛍️ **${set.label}**\n\n${set.description}\n\nChoose an item to purchase. ✨`,rows);
}

const LIMITED_SHOP_SETS = [
  {
    id: "cats",
    label: "🐱 Cat Bundle",
    description: "Special limited cat items",
    items: [
      ["purr_princess_effect", "👑 Purr Princess", "buy_purr_princess"],
      ["kitty_tree", "🐱 Kitty Tree", "buy_kitty_tree"],
      ["cozy_cat_background", "🐱 Cozy Cat", "buy_cozy_cat"]
    ]
  },
  {
    id: "green_glow",
    label: "💚 Green Glow",
    description: "Limited glowing forest set",
    items: [
      ["green_glow_tree", "💚 Green Glow Tree", "buy_green_glow_tree"],
      ["green_glow_background", "💚 Green Glow Background", "buy_green_glow_background"],
      ["green_glow_effect", "💚 Green Glow Effect", "buy_green_glow_effect"]
    ]
  },
  {
    id: "prism_flutter",
    label: "🌈🦋 Prism Flutter",
    description: "Rainbow butterfly fantasy set",
    items: [
      ["prism_flutter_tree", "🌈🦋 Prism Flutter Tree", "buy_prism_flutter_tree"],
      ["prism_flutter_background", "🌈🦋 Prism Flutter Background", "buy_prism_flutter_background"],
      ["prism_flutter_effect", "🌈🦋 Prism Flutter Effect", "buy_prism_flutter_effect"]
    ]
  },
  {
    id: "lavender_twilight",
    label: "💜🌙 Lavender Twilight",
    description: "Dreamy purple moonlit set",
    items: [
      ["lavender_twilight_tree", "💜🌙 Lavender Twilight Tree", "buy_lavender_twilight_tree"],
      ["lavender_twilight_background", "💜🌙 Lavender Twilight Background", "buy_lavender_twilight_background"],
      ["lavender_twilight_effect", "💜🌙 Lavender Twilight Effect", "buy_lavender_twilight_effect"]
    ]
  },
  {
    id: "world_of_flags",
    label: "🌎🏳️ World of Flags",
    description: "International unity set",
    items: [
      ["world_of_flags_tree", "🌎🏳️ World of Flags Tree", "buy_world_of_flags_tree"],
      ["world_of_flags_background", "🌎🏳️ World of Flags Background", "buy_world_of_flags_background"],
      ["world_of_flags_effect", "🌎🏳️ World of Flags Effect", "buy_world_of_flags_effect"]
    ]
  },
  {
    id: "ocean_opal",
    label: "🩵🌊 Ocean Opal",
    description: "Pastel underwater pearl set",
    items: [
      ["ocean_opal_tree", "🩵🌊 Ocean Opal Tree", "buy_ocean_opal_tree"],
      ["ocean_opal_background", "🩵🌊 Ocean Opal Background", "buy_ocean_opal_background"],
      ["ocean_opal_effect", "🫧 Ocean Opal Effect", "buy_ocean_opal_effect"]
    ]
  },
  {
    id: "halloween",
    label: "🎃 Halloween",
    description: "Holiday limited items",
    items: [
      ["halloween_background", "🎃 Halloween Background", "buy_halloween"],
      ["halloween_tree", "🎃 Halloween Tree", "buy_halloween_tree"],
      ["halloween_effect", "👻 Halloween Effect", "buy_halloween_effect"]
    ]
  }
];

async function showLimitedShop(env, interaction) {
  await deferInteraction(env, interaction, { update: true });
  const buttons = LIMITED_SHOP_SETS.map(set =>
    button(set.label, `limited_set:${set.id}`, 1)
  );
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(row(...buttons.slice(i, i + 2)));
  }
  rows.push(row(button("⬅️ Back", "shop", 2)));
  await sendText(
    env,
    interaction,
    "🎁 **LIMITED SHOP**\n\nChoose a set to see its individual Tree, Background, and Effect items. ✨",
    rows
  );
}

async function showLimitedSet(env, interaction, setId) {
  await deferInteraction(env, interaction, { update: true });
  const set = LIMITED_SHOP_SETS.find(x => x.id === setId);
  if (!set) {
    await sendText(env, interaction, "❌ That limited set doesn't exist.");
    return;
  }
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);
  const buttons = set.items.map(([itemId, label, buttonId]) => {
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
  for (let i = 0; i < buttons.length; i += 3) rows.push(row(...buttons.slice(i, i + 3)));
  rows.push(row(button("⬅️ Back to Limited Shop", "shop_limited", 2)));
  await sendText(
    env,
    interaction,
    `🎁 **${set.label}**\n\n${set.description}\n\nChoose an item to purchase. ✨`,
    rows
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
  /* Acknowledge immediately before KV/player work. */
  await deferInteraction(env, interaction, { update: true });
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
  const u=getUserFromInteraction(interaction); if(u){const p=await getPlayer(env,u.id); await refreshPunishmentState(env,p); if(Number(p.raccoonCourtTreeUntil||0)>Date.now() || Number(p.raccoonCourtStinkEffectUntil||0)>Date.now()) return sendText(env,interaction,`💩🌳 **THE STINK TREE SENTENCE IS ACTIVE!**

All customization is locked for **${punishmentTimeText(Math.max(Number(p.raccoonCourtTreeUntil||0),Number(p.raccoonCourtStinkEffectUntil||0)))}** more.`); }
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
    ["green_glow_background", "💚 Green Glow", "green_glow"],
    ["prism_flutter_background", "🌈🦋 Prism Flutter", "prism_flutter"],
    ["lavender_twilight_background", "💜🌙 Lavender Twilight", "lavender_twilight"],
    ["world_of_flags_background", "🌎🏳️ World of Flags", "world_of_flags"],
    ["ocean_opal_background", "🩵🌊 Ocean Opal", "ocean_opal"],
    ["werewives_background", "🐺🌙 Werewives", "werewives"],
    ["golden_pickle_background", "🥒💛 Golden Pickle", "golden_pickle"],
    ["midnight_rider_background", "🏍️🌙 Midnight Rider", "midnight_rider"]
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
  interaction,
  page = 0
) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);

  const items = [
    ["cherry", "🌸 Cherry", null],
    ["cotton_candy", "🍭 Cotton Candy", "cotton_candy_tree"],
    ["stoned_birthday", "🎂 Birthday", "stoned_birthday_tree"],
    ["birthday", "🦇🎂 Spooky Birthday", "birthday_tree"],
    ["shadow", "🌑 Shadow", "shadow_tree"],
    ["full_cherry", "🌸 Full Cherry", "full_cherry_tree"],
    ["pine", "🌲 Pine", "pine_tree"],
    ["red", "❤️ Red", "red_tree"],
    ["soul", "💙 Soul", "soul_tree"],
    ["kitty_tree", "🐱 Kitty Tree", "kitty_tree"],
    ["halloween_tree", "🎃 Halloween", "halloween_tree"],
    ["green_glow", "💚 Green Glow", "green_glow_tree"],
    ["prism_flutter", "🌈🦋 Prism Flutter", "prism_flutter_tree"],
    ["lavender_twilight", "💜🌙 Lavender Twilight", "lavender_twilight_tree"],
    ["world_of_flags", "🌎🏳️ World of Flags", "world_of_flags_tree"],
    ["ocean_opal", "🩵🌊 Ocean Opal", "ocean_opal_tree"],
    ["werewives", "🐺🌙 Werewives", "werewives_tree"],
    ["golden_pickle", "🥒✨ Golden Pickle", "golden_pickle_tree"],
    ["midnight_rider", "🏍️🌙 Midnight Rider", "midnight_rider_tree"]
  ];

  const ownedItems = items.filter(([value, label, inventoryId]) =>
    !inventoryId || player.inventory.includes(inventoryId)
  );

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(ownedItems.length / pageSize));
  page = Math.max(0, Math.min(Number(page) || 0, pageCount - 1));

  const pageItems = ownedItems.slice(page * pageSize, page * pageSize + pageSize);
  const buttons = pageItems.map(([value, label]) =>
    button(
      label,
      `equip_tree_${value}`,
      player.equipped.tree === value ? 3 : 2
    )
  );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(row(...buttons.slice(i, i + 5)));
  }

  if (pageCount > 1) {
    rows.push(
      row(
        button("⬅️ Previous", `custom_trees_page_${page - 1}`, 2, page === 0),
        button(`Page ${page + 1}/${pageCount}`, "custom_trees_page_current", 2, true),
        button("Next ➡️", `custom_trees_page_${page + 1}`, 2, page === pageCount - 1)
      )
    );
  }

  rows.push(row(button("⬅️ Back", "customize", 2)));

  await sendText(
    env,
    interaction,
    `🌳 **Tree Customization**\n\nChoose your tree. ${pageCount > 1 ? `Page **${page + 1}/${pageCount}**` : ""}`,
    rows
  );
}

async function showCustomEffects(
  env,
  interaction,
  page = 0
) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);

  const buttons = [];

  if (player.inventory.includes("butterflies_effect")) buttons.push(button("🦋 Butterflies", "equip_effect_butterflies", player.equipped.effect === "butterflies" ? 3 : 2));
  if (player.inventory.includes("hearts_effect")) buttons.push(button("💕 Hearts", "equip_effect_hearts", player.equipped.effect === "hearts" ? 3 : 2));
  if (player.inventory.includes("green_glow_effect")) buttons.push(button("💚 Green Glow", "equip_effect_green_glow", player.equipped.effect === "green_glow" ? 3 : 2));
  if (player.inventory.includes("prism_flutter_effect")) buttons.push(button("🌈🦋 Prism Flutter", "equip_effect_prism_flutter", player.equipped.effect === "prism_flutter" ? 3 : 2));
  if (player.inventory.includes("lavender_twilight_effect")) buttons.push(button("💜🌙 Lavender Twilight", "equip_effect_lavender_twilight", player.equipped.effect === "lavender_twilight" ? 3 : 2));
  if (player.inventory.includes("world_of_flags_effect")) buttons.push(button("🌎🏳️ World of Flags", "equip_effect_world_of_flags", player.equipped.effect === "world_of_flags" ? 3 : 2));
  if (player.inventory.includes("ocean_opal_effect")) buttons.push(button("🩵🌊 Ocean Opal", "equip_effect_ocean_opal", player.equipped.effect === "ocean_opal" ? 3 : 2));
  if (player.inventory.includes("werewives_effect")) buttons.push(button("🐺🌙 Werewives", "equip_effect_werewives", player.equipped.effect === "werewives" ? 3 : 2));
  if (player.inventory.includes("golden_pickle_effect")) buttons.push(button("🥒✨ Golden Pickle", "equip_effect_golden_pickle", player.equipped.effect === "golden_pickle" ? 3 : 2));
  if (player.inventory.includes("midnight_rider_effect")) buttons.push(button("🏍️🌙 Midnight Rider", "equip_effect_midnight_rider", player.equipped.effect === "midnight_rider" ? 3 : 2));
  if (player.inventory.includes("purr_princess_effect")) buttons.push(button("👑 Purr Princess", "equip_effect_purr_princess", player.equipped.effect === "purr_princess" ? 3 : 2));
  if (player.inventory.includes("candy_effect")) buttons.push(button("🍭 Candy Rush", "equip_effect_candy_rush", player.equipped.effect === "candy_rush" ? 3 : 2));
  if (player.inventory.includes("birthday_effect")) buttons.push(button("🦇🎂 Spooky Birthday", "equip_effect_birthday", player.equipped.effect === "birthday" ? 3 : 2));
  if (player.inventory.includes("birthday_confetti")) buttons.push(button("🎊 Animated Confetti", "equip_effect_birthday_confetti", player.equipped.effect === "birthday_confetti" ? 3 : 2));
  if (player.inventory.includes("birthday_cupcake_chaos_effect")) buttons.push(button("🧁 Cupcake Chaos", "equip_effect_birthday_cupcake_chaos", player.equipped.effect === "birthday_cupcake_chaos" ? 3 : 2));
  if (player.inventory.includes("birthday_raccoon_party_effect")) buttons.push(button("🦝 Raccoon Party", "equip_effect_birthday_raccoon_party", player.equipped.effect === "birthday_raccoon_party" ? 3 : 2));
  if (player.inventory.includes("birthday_balloon_float_effect")) buttons.push(button("🎈 Balloon Float", "equip_effect_birthday_balloon_float", player.equipped.effect === "birthday_balloon_float" ? 3 : 2));
  if (player.inventory.includes("birthday_pumpkin_sparkle_effect")) buttons.push(button("🎃 Pumpkin Sparkle", "equip_effect_birthday_pumpkin_sparkle", player.equipped.effect === "birthday_pumpkin_sparkle" ? 3 : 2));
  if (player.inventory.includes("petal_storm_animated_effect")) buttons.push(button("🌸 Petal Storm", "equip_effect_petal_storm_animated", player.equipped.effect === "petal_storm_animated" ? 3 : 2));
  if (player.inventory.includes("butterfly_garden_animated_effect")) buttons.push(button("🦋 Butterfly Garden", "equip_effect_butterfly_garden_animated", player.equipped.effect === "butterfly_garden_animated" ? 3 : 2));
  if (player.inventory.includes("rainbow_trail_animated_effect")) buttons.push(button("🌈 Rainbow Trail", "equip_effect_rainbow_trail_animated", player.equipped.effect === "rainbow_trail_animated" ? 3 : 2));
  if (player.inventory.includes("ember_glow_animated_effect")) buttons.push(button("🔥 Ember Glow", "equip_effect_ember_glow_animated", player.equipped.effect === "ember_glow_animated" ? 3 : 2));
  if (player.inventory.includes("meteor_shower_animated_effect")) buttons.push(button("☄️ Meteor Shower", "equip_effect_meteor_shower_animated", player.equipped.effect === "meteor_shower_animated" ? 3 : 2));
  if (player.inventory.includes("cosmic_rift_animated_effect")) buttons.push(button("🌌 Cosmic Rift", "equip_effect_cosmic_rift_animated", player.equipped.effect === "cosmic_rift_animated" ? 3 : 2));
  if (player.inventory.includes("fairy_flight_animated_effect")) buttons.push(button("🧚 Fairy Flight", "equip_effect_fairy_flight_animated", player.equipped.effect === "fairy_flight_animated" ? 3 : 2));
  if (player.inventory.includes("crystal_aura_animated_effect")) buttons.push(button("🔮 Crystal Aura", "equip_effect_crystal_aura_animated", player.equipped.effect === "crystal_aura_animated" ? 3 : 2));
  if (player.inventory.includes("starfall_animated_effect")) buttons.push(button("⭐ Starfall", "equip_effect_starfall_animated", player.equipped.effect === "starfall_animated" ? 3 : 2));
  if (player.inventory.includes("unicorn_sparkle_animated_effect")) buttons.push(button("🦄 Unicorn Sparkle", "equip_effect_unicorn_sparkle_animated", player.equipped.effect === "unicorn_sparkle_animated" ? 3 : 2));
  if (player.inventory.includes("snowfall_animated_effect")) buttons.push(button("❄️ Snowfall", "equip_effect_snowfall_animated", player.equipped.effect === "snowfall_animated" ? 3 : 2));
  if (player.inventory.includes("flower_bloom_animated_effect")) buttons.push(button("🌸 Flower Bloom", "equip_effect_flower_bloom_animated", player.equipped.effect === "flower_bloom_animated" ? 3 : 2));
  if (player.inventory.includes("bubble_pop_animated_effect")) buttons.push(button("🫧 Bubble Pop", "equip_effect_bubble_pop_animated", player.equipped.effect === "bubble_pop_animated" ? 3 : 2));
  if (player.inventory.includes("candy_storm_animated_effect")) buttons.push(button("🍬 Candy Storm", "equip_effect_candy_storm_animated", player.equipped.effect === "candy_storm_animated" ? 3 : 2));
  if (player.inventory.includes("kitty_parade_animated_effect")) buttons.push(button("🐱 Kitty Parade", "equip_effect_kitty_parade_animated", player.equipped.effect === "kitty_parade_animated" ? 3 : 2));
  if (player.inventory.includes("electric_storm_animated_effect")) buttons.push(button("⚡ Electric Storm", "equip_effect_electric_storm_animated", player.equipped.effect === "electric_storm_animated" ? 3 : 2));
  if (player.inventory.includes("experimental_effect_animated_effect")) buttons.push(button("🧪 Experimental Effect", "equip_effect_experimental_effect_animated", player.equipped.effect === "experimental_effect_animated" ? 3 : 2));
  if (player.inventory.includes("beans_effect")) buttons.push(button("🫘💥 Bean Burst", "equip_effect_beans", player.equipped.effect === "beans" ? 3 : 2));
  if (player.inventory.includes("halloween_effect")) buttons.push(button("👻 Halloween", "equip_effect_halloween", player.equipped.effect === "halloween" ? 3 : 2));

  buttons.push(button("❌ Remove", "equip_effect_none", player.equipped.effect === null ? 3 : 2));

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(buttons.length / pageSize));
  page = Math.max(0, Math.min(Number(page) || 0, pageCount - 1));
  const pageButtons = buttons.slice(page * pageSize, page * pageSize + pageSize);

  const rows = [];
  for (let i = 0; i < pageButtons.length; i += 5) {
    rows.push(row(...pageButtons.slice(i, i + 5)));
  }

  if (pageCount > 1) {
    rows.push(
      row(
        button("⬅️ Previous", `custom_effects_page_${page - 1}`, 2, page === 0),
        button(`📄 Page ${page + 1}/${pageCount}`, "custom_effects_page_current", 2, true),
        button("Next ➡️", `custom_effects_page_${page + 1}`, 2, page === pageCount - 1)
      )
    );
  }

  rows.push(row(button("⬅️ Back", "customize", 2)));

  await sendText(
    env,
    interaction,
    `✨ **Effect Customization**\n\nEffects are layered on top of your tree.${pageCount > 1 ? `\n\n📄 Page **${page + 1}/${pageCount}**` : ""}`,
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

  if (player.inventory.includes("birthday_decoration")) buttons.push(button("🎁 Spooky Birthday", "equip_decoration_birthday", player.equipped.decoration === "birthday" ? 3 : 2));

  const newDecorations = [
    ["raccoon_thief_decoration", "🦝 Raccoon Thief", "raccoon_thief"],
    ["frank_frog_decoration", "🐸 Frank the Frog", "frank_frog"],
    ["duck_hat_boots_decoration", "🦆 Duck With Hat & Boots", "duck_hat_boots"],
    ["cheddar_falls_decoration", "🧀 Cheddar Falls", "cheddar_falls"],
    ["eggward_decoration", "🥚 Eggward", "eggward"],
    ["hedgy_decoration", "🦔 Hedgy", "hedgy"]
  ];
  for (const [itemId,label,value] of newDecorations) {
    if (player.inventory.includes(itemId)) buttons.push(button(label, `equip_decoration_${value}`, player.equipped.decoration === value ? 3 : 2));
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
  const u=getUserFromInteraction(interaction); if(u){const p=await getPlayer(env,u.id); await refreshPunishmentState(env,p); if(Number(p.raccoonCourtTreeUntil||0)>Date.now()) return sendText(env,interaction,`💩🌳 Your Stink Tree sentence is active for **${punishmentTimeText(p.raccoonCourtTreeUntil)}** more. Customization is locked.`); }
  await deferInteraction(env, interaction, { update: true });
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
      ),

    prism_flutter:
      player.inventory.includes(
        "prism_flutter_background"
      ),

    lavender_twilight:
      player.inventory.includes(
        "lavender_twilight_background"
      ),

    world_of_flags:
      player.inventory.includes(
        "world_of_flags_background"
      ),

    ocean_opal:
      player.inventory.includes(
        "ocean_opal_background"
      ),

    werewives:
      player.inventory.includes(
        "werewives_background"
      ),

    golden_pickle:
      player.inventory.includes(
        "golden_pickle_background"
      ),

    midnight_rider:
      player.inventory.includes(
        "midnight_rider_background"
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
  const u=getUserFromInteraction(interaction); if(u){const p=await getPlayer(env,u.id); await refreshPunishmentState(env,p); if(Number(p.raccoonCourtTreeUntil||0)>Date.now()) return sendText(env,interaction,`💩🌳 Your Stink Tree sentence is active for **${punishmentTimeText(p.raccoonCourtTreeUntil)}** more. Customization is locked.`); }
  await deferInteraction(env, interaction, { update: true });
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
      ),

    prism_flutter:
      player.inventory.includes(
        "prism_flutter_tree"
      ),

    lavender_twilight:
      player.inventory.includes(
        "lavender_twilight_tree"
      ),

    world_of_flags:
      player.inventory.includes(
        "world_of_flags_tree"
      ),

    ocean_opal:
      player.inventory.includes(
        "ocean_opal_tree"
      ),

    werewives:
      player.inventory.includes(
        "werewives_tree"
      ),

    golden_pickle:
      player.inventory.includes(
        "golden_pickle_tree"
      ),

    midnight_rider:
      player.inventory.includes(
        "midnight_rider_tree"
      ),

    birthday: player.inventory.includes("birthday_tree")
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
  const u=getUserFromInteraction(interaction); if(u){const p=await getPlayer(env,u.id); await refreshPunishmentState(env,p); if(Number(p.raccoonCourtStinkEffectUntil||0)>Date.now()) return sendText(env,interaction,`💩🌳 Your Stink Tree sentence is active for **${punishmentTimeText(p.raccoonCourtStinkEffectUntil)}** more. Customization is locked.`); }
  await deferInteraction(env, interaction, { update: true });
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
      green_glow: "green_glow_effect",
      candy_rush: "candy_effect",
      halloween: "halloween_effect",
      prism_flutter: "prism_flutter_effect",
      lavender_twilight: "lavender_twilight_effect",
      world_of_flags: "world_of_flags_effect",
      ocean_opal: "ocean_opal_effect",
      werewives: "werewives_effect",
      golden_pickle: "golden_pickle_effect",
      midnight_rider: "midnight_rider_effect",
      birthday: "birthday_effect",
      birthday_confetti: "birthday_confetti",
      birthday_cupcake_chaos: "birthday_cupcake_chaos_effect",
      birthday_raccoon_party: "birthday_raccoon_party_effect",
      birthday_balloon_float: "birthday_balloon_float_effect",
      birthday_pumpkin_sparkle: "birthday_pumpkin_sparkle_effect",
      petal_storm_animated: "petal_storm_animated_effect",
      butterfly_garden_animated: "butterfly_garden_animated_effect",
      rainbow_trail_animated: "rainbow_trail_animated_effect",
      ember_glow_animated: "ember_glow_animated_effect",
      meteor_shower_animated: "meteor_shower_animated_effect",
      cosmic_rift_animated: "cosmic_rift_animated_effect",
      fairy_flight_animated: "fairy_flight_animated_effect",
      crystal_aura_animated: "crystal_aura_animated_effect",
      starfall_animated: "starfall_animated_effect",
      unicorn_sparkle_animated: "unicorn_sparkle_animated_effect",
      snowfall_animated: "snowfall_animated_effect",
      flower_bloom_animated: "flower_bloom_animated_effect",
      bubble_pop_animated: "bubble_pop_animated_effect",
      candy_storm_animated: "candy_storm_animated_effect",
      kitty_parade_animated: "kitty_parade_animated_effect",
      electric_storm_animated: "electric_storm_animated_effect",
      experimental_effect_animated: "experimental_effect_animated_effect",
      beans: "beans_effect"
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
  const u=getUserFromInteraction(interaction); if(u){const p=await getPlayer(env,u.id); await refreshPunishmentState(env,p); if(Number(p.raccoonCourtTreeUntil||0)>Date.now() || Number(p.raccoonCourtStinkEffectUntil||0)>Date.now()) return sendText(env,interaction,`💩🌳 Your Stink Tree sentence is active for **${punishmentTimeText(Math.max(Number(p.raccoonCourtTreeUntil||0),Number(p.raccoonCourtStinkEffectUntil||0)))}** more. Customization is locked.`); }
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
        "cat_decoration",

      raccoon_thief:
        "raccoon_thief_decoration",

      frank_frog:
        "frank_frog_decoration",

      duck_hat_boots:
        "duck_hat_boots_decoration",

      cheddar_falls:
        "cheddar_falls_decoration",

      eggward:
        "eggward_decoration",

      hedgy:
        "hedgy_decoration"
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

const INVENTORY_NAMES = {
  pink_sky_background: "💖 Pink Sky Background",
  candyland_background: "🍬 Candy Land Background",
  halloween_background: "🎃 Halloween Background",
  cotton_candy_tree: "🍭 Cotton Candy Tree",
  pumpkin_cat_decoration: "🎃 Pumpkin Cat",
  stoned_birthday_tree: "🎂 Birthday Tree",
  stoned_balloon_decoration: "🎈 Birthday Balloon",
  stoned_birthday_background: "🎂 Birthday Background",
  panda_decoration: "🐼 Panda Decoration",
  cat_decoration: "🐱 Cat Decoration",
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
  halloween_tree: "🎃🌳 Halloween Tree",
  purr_princess_effect: "👑 Purr Princess Effect",
  kitty_tree: "🐱 Kitty Tree",
  cozy_cat_background: "🐱 Cozy Cat Background",
  green_glow_tree: "💚 Green Glow Tree",
  green_glow_background: "💚 Green Glow Background",
  green_glow_effect: "💚 Green Glow Effect",
  prism_flutter_tree: "🌈🦋 Prism Flutter Tree",
  prism_flutter_background: "🌈🦋 Prism Flutter Background",
  prism_flutter_effect: "🌈🦋 Prism Flutter Effect",
  lavender_twilight_tree: "💜🌙 Lavender Twilight Tree",
  lavender_twilight_background: "💜🌙 Lavender Twilight Background",
  lavender_twilight_effect: "💜🌙 Lavender Twilight Effect",
  world_of_flags_tree: "🌎🏳️ World of Flags Tree",
  world_of_flags_background: "🌎🏳️ World of Flags Background",
  world_of_flags_effect: "🌎🏳️ World of Flags Effect",
  ocean_opal_tree: "🩵🌊 Ocean Opal Tree",
  ocean_opal_background: "🩵🌊 Ocean Opal Background",
  ocean_opal_effect: "🫧 Ocean Opal Effect",
  werewives_tree: "🐺🌙 Werewives Tree",
  werewives_background: "🐺🌙 Werewives Background",
  werewives_effect: "🐺🌙 Werewives Effect",
  golden_pickle_tree: "🥒✨ Golden Pickle Tree",
  golden_pickle_background: "🥒💛 Golden Pickle Background",
  golden_pickle_effect: "🥒✨ Golden Pickle Effect",
  midnight_rider_tree: "🏍️🌙 Midnight Rider Tree",
  midnight_rider_background: "🏍️🌙 Midnight Rider Background",
  midnight_rider_effect: "🏍️✨ Midnight Rider Effect",
  birthday_tree: "🌳 Spooky Birthday Tree",
  birthday_background: "🌌 Spooky Birthday Background",
  birthday_effect: "✨ Spooky Birthday Effect",
  birthday_decoration: "🎁 Spooky Birthday Decoration",
  eggward_decoration: "🥚 Eggward Decoration",
  hedgy_decoration: "🦔 Hedgy Decoration",
  birthday_confetti: "🎊 Animated Confetti Effect",
  birthday_cupcake_chaos_effect: "🧁 Cupcake Chaos Effect",
  birthday_raccoon_party_effect: "🦝 Raccoon Party Effect",
  birthday_balloon_float_effect: "🎈 Balloon Float Effect",
  birthday_pumpkin_sparkle_effect: "🎃 Pumpkin Sparkle Effect",
  petal_storm_animated_effect: "🌸 Petal Storm",
  butterfly_garden_animated_effect: "🦋 Butterfly Garden",
  rainbow_trail_animated_effect: "🌈 Rainbow Trail",
  ember_glow_animated_effect: "🔥 Ember Glow",
  meteor_shower_animated_effect: "☄️ Meteor Shower",
  cosmic_rift_animated_effect: "🌌 Cosmic Rift",
  fairy_flight_animated_effect: "🧚 Fairy Flight",
  crystal_aura_animated_effect: "🔮 Crystal Aura",
  starfall_animated_effect: "⭐ Starfall",
  unicorn_sparkle_animated_effect: "🦄 Unicorn Sparkle",
  snowfall_animated_effect: "❄️ Snowfall",
  flower_bloom_animated_effect: "🌸 Flower Bloom",
  bubble_pop_animated_effect: "🫧 Bubble Pop",
  candy_storm_animated_effect: "🍬 Candy Storm",
  kitty_parade_animated_effect: "🐱 Kitty Parade",
  electric_storm_animated_effect: "⚡ Electric Storm",
  experimental_effect_animated_effect: "🧪 Experimental Effect",
  beans_effect: "🫘💥 Bean Burst Effect"
};

const INVENTORY_CATEGORIES = [
  ["trees", "🌳 Trees"],
  ["backgrounds", "🖼️ Backgrounds"],
  ["effects", "✨ Effects"],
  ["decorations", "🎀 Decorations"],
  ["gifts", "🎁 Gift Sets"]
];

const INVENTORY_CATEGORY_IDS = {
  trees: ["cherry", "cotton_candy_tree", "stoned_birthday_tree", "birthday_tree", "shadow_tree", "full_cherry_tree", "pine_tree", "red_tree", "soul_tree", "kitty_tree", "halloween_tree", "green_glow_tree", "prism_flutter_tree", "lavender_twilight_tree", "world_of_flags_tree", "ocean_opal_tree", "werewives_tree", "golden_pickle_tree", "midnight_rider_tree"],
  backgrounds: ["pink_sky_background", "candyland_background", "halloween_background", "stoned_birthday_background", "birthday_background", "magic_mushroom_background", "field_day_background", "red_forest_background", "cozy_cat_background", "green_glow_background", "prism_flutter_background", "lavender_twilight_background", "world_of_flags_background", "ocean_opal_background", "werewives_background", "golden_pickle_background", "midnight_rider_background"],
  effects: ["butterflies_effect", "hearts_effect", "purr_princess_effect", "green_glow_effect", "candy_effect", "halloween_effect", "prism_flutter_effect", "lavender_twilight_effect", "world_of_flags_effect", "ocean_opal_effect", "werewives_effect", "golden_pickle_effect", "midnight_rider_effect", "birthday_effect", "birthday_confetti", "birthday_cupcake_chaos_effect", "birthday_raccoon_party_effect", "birthday_balloon_float_effect", "birthday_pumpkin_sparkle_effect", "petal_storm_animated_effect", "butterfly_garden_animated_effect", "rainbow_trail_animated_effect", "ember_glow_animated_effect", "meteor_shower_animated_effect", "cosmic_rift_animated_effect", "fairy_flight_animated_effect", "crystal_aura_animated_effect", "starfall_animated_effect", "unicorn_sparkle_animated_effect", "snowfall_animated_effect", "flower_bloom_animated_effect", "bubble_pop_animated_effect", "candy_storm_animated_effect", "kitty_parade_animated_effect", "electric_storm_animated_effect", "experimental_effect_animated_effect", "beans_effect"],
  decorations: ["pumpkin_cat_decoration", "panda_decoration", "cat_decoration", "raccoon_thief_decoration", "frank_frog_decoration", "duck_hat_boots_decoration", "cheddar_falls_decoration", "stoned_balloon_decoration", "birthday_decoration", "eggward_decoration", "hedgy_decoration"],
  gifts: ["werewives_tree", "werewives_background", "werewives_effect", "golden_pickle_tree", "golden_pickle_background", "golden_pickle_effect", "midnight_rider_tree", "midnight_rider_background", "midnight_rider_effect"]
};

async function showInventory(env, interaction) {
  const buttons = INVENTORY_CATEGORIES.map(([id, label]) => button(label, `inventory:${id}:0`, 2));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(row(...buttons.slice(i, i + 2)));
  rows.push(row(button("🌳 Back to Tree", "back_tree", 2)));
  await sendText(
    env,
    interaction,
    "🎒 **YOUR INVENTORY**\n\nChoose a category to browse your owned items. The inventory is organized into sections so we can keep adding more without turning it into a giant list. ✨",
    rows
  );
}

async function showInventoryCategory(env, interaction, category, page = 0) {
  const user = getUserFromInteraction(interaction);
  const player = await getPlayer(env, user.id);
  const ids = INVENTORY_CATEGORY_IDS[category];
  const categoryLabel = INVENTORY_CATEGORIES.find(x => x[0] === category)?.[1] || "🎒 Inventory";
  if (!ids) {
    await sendText(env, interaction, "❌ That inventory category doesn't exist.");
    return;
  }
  const owned = ids.filter(id => id === "cherry" || player.inventory.includes(id));
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(owned.length / pageSize));
  page = Math.max(0, Math.min(Number(page) || 0, pageCount - 1));
  const pageItems = owned.slice(page * pageSize, page * pageSize + pageSize);
  const lines = pageItems.map(id => {
    const label = id === "cherry" ? "🌸 Cherry Tree" : (INVENTORY_NAMES[id] || SHOP_ITEMS[id]?.name || id);
    return `• ${label} — ID: \`${id}\``;
  });
  const rows = [];
  if (pageCount > 1) {
    rows.push(row(
      button("⬅️ Previous", `inventory:${category}:${page - 1}`, 2, page === 0),
      button(`Page ${page + 1}/${pageCount}`, "inventory:current:0", 2, true),
      button("Next ➡️", `inventory:${category}:${page + 1}`, 2, page === pageCount - 1)
    ));
  }
  rows.push(row(button("🎒 Categories", "inventory", 2), button("🎨 Customize", "customize", 2)));
  await sendText(
    env,
    interaction,
    `🎒 **${categoryLabel}**\n\n${lines.length ? lines.join("\n") : "Nothing owned in this category yet."}\n\n⭐ Sparkles: **${player.sparkles}**${pageCount > 1 ? `\n📖 Page **${page + 1}/${pageCount}**` : ""}`,
    rows
  );
}

/* =========================================================
   BIRTHDAY EVENT — SPOOKY BIRTHDAY SYSTEM
========================================================= */

const BIRTHDAY_SHOP_ITEMS = {
  birthday_tree: { name: "🌳 Spooky Birthday Tree", price: 1000, type: "tree", value: "birthday" },
  birthday_background: { name: "🌌 Spooky Birthday Background", price: 2000, type: "background", value: "birthday" },
  birthday_effect: { name: "✨ Spooky Birthday Effect", price: 1000, type: "effect", value: "birthday" },
  birthday_decoration: { name: "🎁 Spooky Birthday Decoration", price: 1000, type: "decoration", value: "birthday" },
  birthday_confetti: { name: "🎊 Animated Confetti Effect", price: 2000, type: "effect", value: "birthday_confetti" },
  birthday_cupcake_chaos_effect: { name: "🧁 Cupcake Chaos", price: 2000, type: "effect", value: "birthday_cupcake_chaos" },
  birthday_raccoon_party_effect: { name: "🦝 Raccoon Party", price: 5000, type: "effect", value: "birthday_raccoon_party" },
  birthday_balloon_float_effect: { name: "🎈 Balloon Float", price: 2000, type: "effect", value: "birthday_balloon_float" },
  birthday_pumpkin_sparkle_effect: { name: "🎃 Pumpkin Sparkle", price: 2000, type: "effect", value: "birthday_pumpkin_sparkle" },
  birthday_sparkles: { name: "💰 20,000 Sparkles", price: 2000, type: "sparkles", value: 20000 }
};

const BIRTHDAY_GIFTS = {
  creepy_present: { name: "🎀 Creepy Little Present", rarity: "Common", price: "1000 Sparkles", reward: { sparkles: 1000 }, sender: [50, 75] },
  ghost_box: { name: "👻 Ghostly Gift Box", rarity: "Uncommon", price: "150 Birthday Candies", reward: { candies: 150 }, sender: [75, 100] },
  pumpkin_treasure: { name: "🎃 Pumpkin Treasure", rarity: "Rare", price: "5000 Sparkles", reward: { sparkles: 5000, candies: 250 }, sender: [100, 125] },
  midnight_keepsake: { name: "🦇 Midnight Keepsake", rarity: "Epic", price: "Exclusive collectible", reward: { collectible: "midnight_keepsake" }, sender: [125, 150] },
  moonlit_relic: { name: "🌙 Moonlit Birthday Relic", rarity: "Legendary", price: "Exclusive collectible", reward: { collectible: "moonlit_relic" }, sender: [150, 150] }
};

const BIRTHDAY_HUNT_EMOJIS = [
  ["🕷️", "Spider", 10], ["🕸️", "Spider Web", 15], ["🦇", "Bat", 20], ["👻", "Ghost", 25], ["🕯️", "Candle", 30],
  ["🎃", "Pumpkin", 40], ["🧙", "Witch", 50], ["🪦", "Gravestone", 60], ["🖤", "Black Heart", 75], ["🌙", "Crescent Moon", 75],
  ["🎂", "Cake", 50], ["🎁", "Present", 60], ["🎀", "Bow", 75], ["🧁", "Cupcake", 80],
  ["🧛", "Vampire", 100], ["🧟", "Zombie", 125], ["🧿", "Spooky Eye", 150], ["🦇✨", "Glitter Bat", 200], ["🎃✨", "Enchanted Pumpkin", 250]
];

const BIRTHDAY_SERVER_SQUARES = ["pumpkin_appears", "ghost_appears", "bat_swarm", "boo_cannon"];
const BIRTHDAY_BINGO_PERSONAL = [
  ["birthday_cake", "🎂 Claim a Cake from Fright Hunt"],
  ["birthday_bow", "🎀 Claim a Bow from Fright Hunt"],
  ["candle_lit", "🕯️ Claim a Candle from Fright Hunt"],
  ["earn_candy", "✨ Earn Birthday Candies"],
  ["send_gift", "🎁 Send a birthday gift"],
  ["trickster", "🦝 Use Birthday Trickster"],
  ["cupcake", "🧁 Complete Wicked Cupcake Tower"],
  ["bakery", "🦇 Complete Batty Cake Bakery"],
  ["roulette", "🎃 Play Pumpkin Roulette"],
  ["curse", "👻 Complete The Birthday Curse"],
  ["wish", "🌙 Perform Birthday Wish Ritual"],
  ["hundred_candy", "🎟️ Reach 100+ Birthday Candies"],
  ["say_name", "🎂 Mention a birthday person's name"],
  ["black_heart", "🖤 Use a black-heart item"],
  ["decoration", "🎀 Use a birthday decoration"],
  ["birthday_shop", "🛍️ Purchase a Birthday Shop item"],
  ["birthday_cosmetic", "🎃 Own a Birthday cosmetic"],
  ["secret_recipe", "✨ Discover the secret cupcake recipe"],
  ["receive_sparkles", "💰 Receive Sparkles from a birthday activity"],
  ["boss_win", "🎂 Defeat the Cursed Birthday Cake"]
];

const BIRTHDAY_SURPRISES = [
  ["bat", "🦇 **BAT ATTACK!** A swarm of bats has invaded your Bingo board!"],
  ["ghost", "👻 **GHOSTLY MARK!** A ghost marked one of your squares for you!"],
  ["pumpkin", "🎃 **PUMPKIN LUCK!** You found a spooky Candy bonus!"],
  ["candle", "🕯️ **CANDLE CURSE!** A candle temporarily covers one unfinished square."],
  ["sparkle", "✨ **SPARKLE BURST!** The birthday magic dropped some Sparkles!"],
  ["blessing", "🎀 **BIRTHDAY BLESSING!** A random Bingo square was marked!"],
  ["midnight", "🌙 **MIDNIGHT MOMENT!** Several squares were mysteriously marked!" ]
];

const BIRTHDAY_STORIES = [
  { length: "short", reward: 150, prompts: ["adjective", "spooky noun", "food", "verb", "place"], text: "At midnight, the birthday person opened the door and found a [adjective] [spooky noun] holding a plate of [food]. It whispered, 'We must [verb] to the [place] before the candles wake up!'" },
  { length: "short", reward: 150, prompts: ["adjective", "animal", "verb", "cake topping", "sound"], text: "The birthday person entered the kitchen and saw an [adjective] [animal] trying to [verb] the birthday cake. Its only clue was a [cake topping] and one mysterious '[sound].'" },
  { length: "medium", reward: 250, prompts: ["spooky adjective", "noun", "verb", "food", "place", "adjective", "monster"], text: "The birthday party began normally, until a [spooky adjective] [noun] rolled through the room. The birthday person had to [verb] past a tray of [food], escape to the [place], and confront an [adjective] [monster] guarding the candles." },
  { length: "medium", reward: 250, prompts: ["verb", "adjective", "spooky noun", "dessert", "place", "animal", "sound"], text: "A cursed invitation told the birthday person to [verb] into a [adjective] hallway. A [spooky noun] was waiting beside a mountain of [dessert]. Somewhere in the [place], a [animal] screamed '[sound]!'" },
  { length: "medium", reward: 250, prompts: ["color", "spooky noun", "verb", "food", "adjective", "place", "object"], text: "The candles suddenly glowed [color] and summoned a [spooky noun]. The birthday person had to [verb] while carrying [food], reach the [adjective] [place], and find the enchanted [object]." },
  { length: "long", reward: 400, prompts: ["adjective", "spooky creature", "verb", "food", "place", "color", "object", "sound", "verb", "adjective"], text: "On the strangest birthday ever, an [adjective] [spooky creature] appeared behind the cake. It demanded that the birthday person [verb] through a hallway filled with [food]. At the [place], the walls turned [color], revealing a hidden [object]. A distant '[sound]' echoed as the creature tried to [verb] the birthday candles, but the birthday person made one final [adjective] move." },
  { length: "long", reward: 400, prompts: ["spooky adjective", "noun", "animal", "verb", "dessert", "place", "monster", "color", "sound", "verb"], text: "The birthday person woke to a [spooky adjective] [noun] beside the bed and a [animal] wearing a tiny party hat. They had to [verb] past a river of [dessert] and enter the [place], where a [monster] guarded a [color] birthday candle. After hearing '[sound]' from the attic, they chose to [verb] into the final room." },
  { length: "long", reward: 400, prompts: ["adjective", "spooky noun", "verb", "food", "place", "animal", "object", "sound", "color", "verb"], text: "Every birthday candle vanished except one. The [adjective] [spooky noun] holding it demanded the birthday person [verb] across a table covered in [food]. The trail led to the [place], where a [animal] protected a mysterious [object]. A '[sound]' came from behind the door, the room flashed [color], and the birthday person had to [verb] before the final candle went out." }
];

function birthdayTodayKey(date = new Date()) { return easternDateKey(date); }
function birthdayEventActive(state, date = new Date()) { return Boolean(state?.birthday?.active && state.birthday.activeDate === birthdayTodayKey(date)); }
function birthdayMentionList(ids) { return ids.map(id => `<@${id}>`).join(", "); }

async function getBirthdayPeopleForGuild(env, guildId) {
  const members = await getGuildMembers(env, guildId);
  const people = [];
  for (const member of members) {
    const p = await getPlayer(env, member.id);
    updatePlayerIdentity(p, { member: { user: { id: member.id, username: member.username, global_name: member.displayName } } });
    if (p.birthdayMonth && p.birthdayDay && isBirthdayDate(new Date(), p.birthdayMonth, p.birthdayDay)) people.push(p);
  }
  return people;
}

function birthdayPersonId(state, userId) { return Array.isArray(state?.birthday?.birthdayIds) && state.birthday.birthdayIds.includes(userId); }
function birthdayName(state) { return state?.birthday?.birthdayNames?.length ? state.birthday.birthdayNames.join(", ") : "the birthday Werewife"; }

async function ensureBirthdayEvent(env, guildId) {
  const state = await getGuildState(env, guildId);
  let people = await getBirthdayPeopleForGuild(env, guildId);
  const key = birthdayTodayKey();

  // TEST/RECOVERY SAFETY: /birthday-set for today's date records the user
  // directly in guild state. This prevents the birthday party from vanishing
  // when Discord member lookup or an older player record cannot be re-read.
  const manualIds = Array.isArray(state.birthday?.manualTestBirthdayIds)
    ? state.birthday.manualTestBirthdayIds
    : [];
  if (!people.length && state.birthday?.activeDate === key && state.birthday?.active && manualIds.length) {
    people = [];
    for (const id of manualIds) {
      const p = await getPlayer(env, id);
      if (p?.userId) people.push(p);
    }
  }

  if (!people.length) {
    if (state.birthday?.activeDate === key) { state.birthday.active = false; await saveGuildState(env, guildId, state); }
    return { state, people: [] };
  }
  if (!state.birthday || state.birthday.activeDate !== key) {
    state.birthday = {
      active: true, activeDate: key, birthdayIds: people.map(p => p.userId), birthdayNames: people.map(p => p.displayName || p.username || "Werewife"),
      announced: false, nextFrightHuntAt: Date.now(), huntItems: [], serverEvents: {}, bingoBoards: {}, games: {}, lastTheme: "spooky"
    };
  } else {
    state.birthday.active = true;
    state.birthday.birthdayIds = people.map(p => p.userId);
    state.birthday.birthdayNames = people.map(p => p.displayName || p.username || "Werewife");
  }

  // IMPORTANT: persist the birthday activation/registry before returning.
  // Without this save, /birthday can see the birthday in memory once, but
  // every button press reloads the old state and says there is no birthday.
  await saveGuildState(env, guildId, state);
  return { state, people };
}

function birthdayMainText(state, people) {
  if (!people.length) return "🌙🕯️ **The candles remain unlit...** 🕯️🌙\n\nNo birthday has awakened today! 👻\nThe pumpkins are waiting, the cake is lonely, and the bats have nowhere to party. 🦇🎂\n\nCome back another day... **someone's spooky birthday may be waiting.** 🎃✨";
  return `🦇🎀 **SHHHH... SOMETHING WICKEDLY WONDERFUL IS HAPPENING...** 🎀🦇\n\n🎂✨ **It's ${birthdayMentionList(people.map(p=>p.userId))}'s birthday!** ✨🎂\n\nThe moon is shining, the pumpkins are glowing, and the birthday candles have mysteriously lit themselves... 👀🕯️\n\n🎃 **THE BIRTHDAY PARTY HAS BEGUN!** 🎃\n\n🦇 Midnight Birthday Shop — **UNLOCKED**\n🎮 Birthday Games — **UNLOCKED**\n🎃 Birthday Fright Hunt — **UNLOCKED**\n🎁 Cursed Birthday Gifts — **UNLOCKED**\n\n🎟️ Grab your Birthday Candies and join the celebration!\nJust remember... **something is always watching the cake.** 👻🎂`;
}

function birthdayMenuComponents(active) {
  if (!active) return [];
  return [
    row(button("🛍️ Midnight Shop", "birthday:shop:0", 1), button("🎃 Fright Hunt", "birthday:hunt", 1), button("🎂 Bingo", "birthday:bingo", 1)),
    row(button("🎃 Roulette", "birthday:roulette", 1), button("🧁 Cupcake Tower", "birthday:cupcake", 1), button("📖 Birthday Curse", "birthday:curse", 1)),
    row(button("🦇 Cake Bakery", "birthday:bakery", 1), button("⚔️ Boss Battle", "birthday:boss", 1), button("🕯️ Wish Ritual", "birthday:wish", 1)),
    row(button("💥 Boo Cannon", "birthday:cannon", 1), button("🦝 Trickster", "birthday:trickster", 1), button("🎁 Gifts", "birthday:gifts", 1), button("✨ Collection", "birthday:collection", 1))
  ];
}

async function handleBirthdayCommand(env, interaction) {
  const guildId = interaction.guild_id;
  const user = getUserFromInteraction(interaction);
  if (!guildId || !user) return sendText(env, interaction, "❌ Birthday features can only be used inside a server.");
  const { state, people } = await ensureBirthdayEvent(env, guildId);
  if (!people.length) return sendText(env, interaction, birthdayMainText(state, people), birthdayMenuComponents(false));
  return sendText(env, interaction, birthdayMainText(state, people), birthdayMenuComponents(true));
}

async function handleBirthdayGamesCommand(env, interaction) {
  const guildId = interaction.guild_id;
  const user = getUserFromInteraction(interaction);
  if (!guildId || !user) return sendText(env, interaction, "❌ Birthday features can only be used inside a server.");
  const sub = interaction.data?.options?.find(o=>o.type===1)?.name || "";
  const { state, people } = await ensureBirthdayEvent(env, guildId);
  if (!people.length) return sendText(env, interaction, birthdayMainText(state, people), birthdayMenuComponents(false));
  if (sub === "hunt") return handleBirthdayHunt(env, interaction);
  if (sub === "bingo") return startBirthdayBingo(env, interaction);
  if (sub === "roulette") return startBirthdayRoulette(env, interaction);
  if (sub === "curse") { const ans=getOption(interaction,"answer"); return ans ? birthdayCurseAnswer(env,interaction,ans) : startBirthdayCurse(env, interaction); }
  if (sub === "cupcake") return startBirthdayCupcake(env, interaction);
  if (sub === "bakery") return startBirthdayBakery(env, interaction);
  if (sub === "boss") return startBirthdayBoss(env, interaction);
  return sendText(env, interaction, "🎮 Choose a Birthday Game from the menu.");
}

async function handleBirthdaySet(env, interaction) {
  const user = getUserFromInteraction(interaction); if (!user) return;

  // Players may choose their birthday exactly once. Only the bot owner can
  // change an already-saved birthday, and the owner may target another player
  // with the optional `user` argument.
  const requestedUserId = getOption(interaction, "user") || user.id;
  const isOwner = user.id === env.OWNER_ID;

  if (requestedUserId !== user.id && !isOwner) {
    return sendText(env, interaction, "❌ You can only set your own birthday. If you need your birthday changed, please ask the Werewives bot owner. 👑🎂");
  }

  const targetPlayer = await getPlayer(env, requestedUserId);
  if (requestedUserId === user.id) updatePlayerIdentity(targetPlayer, interaction);

  if (targetPlayer.birthdayUnlocked && !isOwner) {
    return sendText(env, interaction, "🔒 **Your birthday is already locked in!** 🎂💗\n\nYou can only set your birthday once. If you need to correct or change it, please ask the Werewives bot owner for approval. 👑");
  }

  const month = Number(getOption(interaction, "month"));
  const day = Number(getOption(interaction, "day"));
  if (!Number.isInteger(month)||month<1||month>12||!Number.isInteger(day)||day<1||day>31) {
    return sendText(env,interaction,"❌ Use a valid month (1–12) and day (1–31).");
  }
  const maxDays = new Date(Date.UTC(2028, month, 0)).getUTCDate();
  if(day>maxDays) return sendText(env,interaction,"❌ That date does not exist.");

  const previousBirthday = targetPlayer.birthdayUnlocked
    ? `${Number(targetPlayer.birthdayMonth)}/${Number(targetPlayer.birthdayDay)}`
    : null;

  targetPlayer.birthdayMonth=month;
  targetPlayer.birthdayDay=day;
  targetPlayer.birthdayUnlocked=true;
  // If the saved date is TODAY, immediately seed the guild birthday registry.
  // This makes the party activation survive the next /birthday/button request.
  if (interaction.guild_id && isBirthdayDate(new Date(), month, day)) {
    const guildId=interaction.guild_id;
    const state=await getGuildState(env,guildId);
    const key=birthdayTodayKey();
    const targetName=targetPlayer.displayName||targetPlayer.username||"Werewife";
    if(!state.birthday || state.birthday.activeDate!==key){
      state.birthday={active:true,activeDate:key,birthdayIds:[requestedUserId],birthdayNames:[targetName],announced:false,nextFrightHuntAt:Date.now(),huntItems:[],serverEvents:{},bingoBoards:{},games:{},lastTheme:"spooky",manualTestBirthdayIds:[requestedUserId]};
    }else{
      state.birthday.active=true;
      state.birthday.birthdayIds=Array.from(new Set([...(state.birthday.birthdayIds||[]),requestedUserId]));
      state.birthday.birthdayNames=Array.from(new Set([...(state.birthday.birthdayNames||[]),targetName]));
      state.birthday.manualTestBirthdayIds=Array.from(new Set([...(state.birthday.manualTestBirthdayIds||[]),requestedUserId]));
    }
    await saveGuildState(env,guildId,state);
  }

  if (isOwner && previousBirthday) {
    return sendText(env,interaction,`👑 **Birthday updated!**\n\n<@${requestedUserId}>'s birthday was changed from **${previousBirthday}** to **${month}/${day}**. 🎂💗`);
  }

  await sendText(env,interaction,`🎂 **Birthday saved and locked!**\n\nYour birthday is set to **${month}/${day}**. 💗🎃\n\nYou can only set your birthday once. If you ever need it changed, please ask the Werewives bot owner for approval. 👑\n\nOn that calendar date, your Birthday Party will automatically unlock for the whole day.`);
}

function birthdayShopComponents(page=0) {
  // Discord allows a maximum of five action rows per message. The Birthday
  // Shop now has ten items, so keep the shop paginated instead of generating
  // six rows and leaving the interaction stuck on the loading message.
  const ids=Object.keys(BIRTHDAY_SHOP_ITEMS);
  const pageSize=5;
  const pageCount=Math.max(1,Math.ceil(ids.length/pageSize));
  const current=Math.min(Math.max(Number(page)||0,0),pageCount-1);
  const visible=ids.slice(current*pageSize,(current+1)*pageSize);
  const rows=[];
  for(let i=0;i<visible.length;i+=3){
    rows.push(row(...visible.slice(i,i+3).map(id=>
      button(`${BIRTHDAY_SHOP_ITEMS[id].name} — ${BIRTHDAY_SHOP_ITEMS[id].price} 🍬`,`birthday:buy:${id}`,1)
    )));
  }
  const nav=[];
  if(current>0) nav.push(button("⬅️ Previous",`birthday:shop:${current-1}`,2));
  nav.push(button(`🎂 Menu${pageCount>1?` • ${current+1}/${pageCount}`:""}`,"birthday:home",2));
  if(current<pageCount-1) nav.push(button("Next ➡️",`birthday:shop:${current+1}`,2));
  rows.push(row(...nav));
  return rows;
}

async function showBirthdayShop(env, interaction, page=0) {
  // The shop button has already acknowledged the interaction. Do NOT run the
  // full birthday-member scan here unless the saved birthday state is missing.
  // ensureBirthdayEvent() scans every guild member and can take long enough to
  // leave the loading message stuck. The active birthday state already contains
  // the verified birthday IDs for this event.
  const state=await getGuildState(env,interaction.guild_id);
  let people=[];
  const today=birthdayTodayKey();
  if(state?.birthday?.active && state.birthday.activeDate===today && Array.isArray(state.birthday.birthdayIds) && state.birthday.birthdayIds.length){
    people=state.birthday.birthdayIds.map(id=>({userId:id}));
  }else{
    const ensured=await ensureBirthdayEvent(env,interaction.guild_id);
    people=ensured.people||[];
  }
  if(!people.length) return sendText(env,interaction,"🔒 The Midnight Birthday Shop is closed. No birthday is active today.");
  const user=getUserFromInteraction(interaction); const p=await getPlayer(env,user.id); const owned=p.inventory||[];
  const ids=Object.keys(BIRTHDAY_SHOP_ITEMS); const lines=ids.map(id=>{const x=BIRTHDAY_SHOP_ITEMS[id];return `• ${x.name} — **${x.price.toLocaleString()} Birthday Candies**${owned.includes(id)?" — ✅ Owned":""}`;});
  return sendText(env,interaction,`🦇🛍️ **MIDNIGHT BIRTHDAY SHOP**\n\n🎟️ Your Birthday Candies: **${Number(p.birthdayCandies||0).toLocaleString()}**\n\n${lines.join("\n")}\n\nBirthday Shop items are exclusive to the birthday event and do not appear in the normal shop.`,birthdayShopComponents(page));
}

async function buyBirthdayItem(env,interaction,itemId){
  const {people}=await ensureBirthdayEvent(env,interaction.guild_id); if(!people.length)return sendText(env,interaction,"🔒 The Midnight Birthday Shop is closed.");
  const item=BIRTHDAY_SHOP_ITEMS[itemId]; if(!item)return sendText(env,interaction,"❌ That birthday item does not exist.");
  const user=getUserFromInteraction(interaction); const p=await getPlayer(env,user.id); if((p.inventory||[]).includes(itemId))return sendText(env,interaction,"🎀 You already own that birthday item!");
  if(Number(p.birthdayCandies||0)<item.price)return sendText(env,interaction,`❌ You need **${item.price.toLocaleString()} Birthday Candies**.`);
  p.birthdayCandies-=item.price;
  if(item.type==="sparkles") p.sparkles+=item.value; else { p.inventory=p.inventory||[]; p.inventory.push(itemId); }
  await savePlayer(env,p);
  await markBingoAction(env,interaction.guild_id,user.id,"birthday_shop");
  if(item.type!=="sparkles") await markBingoAction(env,interaction.guild_id,user.id,"birthday_cosmetic");
  if(item.type==="decoration") await markBingoAction(env,interaction.guild_id,user.id,"decoration");
  if(item.type==="sparkles") await markBingoAction(env,interaction.guild_id,user.id,"receive_sparkles");
  return sendText(env,interaction,`🎉 **PURCHASED!**\n\n${item.name}\n🎟️ Spent **${item.price.toLocaleString()} Birthday Candies**.\n🎟️ Remaining: **${p.birthdayCandies.toLocaleString()}**`);
}

function birthdayGiftCostOK(p,id){ const g=BIRTHDAY_GIFTS[id]; if(!g)return false; if(id==="creepy_present"||id==="pumpkin_treasure") return Number(p.sparkles||0)>=Number(g.reward.sparkles||0); if(id==="ghost_box") return Number(p.birthdayCandies||0)>=150; return true; }
async function showBirthdayCollection(env,interaction){const p=await getPlayer(env,getUserFromInteraction(interaction).id);const c=Array.isArray(p.birthdayCollection)?p.birthdayCollection:[];const names={midnight_keepsake:"🦇 Midnight Keepsake",moonlit_relic:"🌙 Moonlit Birthday Relic",cursed_birthday_cake:"🦇🎂 Cursed Birthday Cake",midnight_heart_cupcake:"🖤🧁 Midnight Heart Cupcake"};return sendText(env,interaction,`🎂✨ **BIRTHDAY COLLECTION**\n\n${c.length?c.map(x=>`• ${names[x]||x}`).join("\n"):"Your collection is empty... for now. 👀"}`,[row(button("🎂 Birthday Menu","birthday:home",2))]);}

async function showBirthdayGifts(env,interaction){const p=await getPlayer(env,getUserFromInteraction(interaction).id);const gifts=Array.isArray(p.birthdayGifts)?p.birthdayGifts:[];if(!gifts.length)return sendText(env,interaction,"🎁 **CURSED BIRTHDAY GIFTS**\n\nYou have no unopened birthday gifts.", [row(button("🎂 Birthday Menu","birthday:home",2))]);return sendText(env,interaction,`🎁 **YOUR UNOPENED BIRTHDAY GIFTS**\n\n${gifts.map((g,i)=>`${i+1}. ${BIRTHDAY_GIFTS[g.type]?.name||g.type} — ${BIRTHDAY_GIFTS[g.type]?.rarity||"Gift"}`).join("\n")}`,[...gifts.map(g=>row(button(`🎁 Open ${BIRTHDAY_GIFTS[g.type]?.name||g.type}`,`birthday:open:${g.id}`,1))),row(button("🎂 Birthday Menu","birthday:home",2))]);}
async function openBirthdayGift(env,interaction,id){const uid=getUserFromInteraction(interaction).id;const p=await getPlayer(env,uid);const gifts=Array.isArray(p.birthdayGifts)?p.birthdayGifts:[];const idx=gifts.findIndex(g=>g.id===id);if(idx<0)return sendText(env,interaction,"🎁 That gift is already opened or doesn't exist.");const g=gifts[idx];const def=BIRTHDAY_GIFTS[g.type];if(!def)return sendText(env,interaction,"🎁 That gift is corrupted.");gifts.splice(idx,1);let msg=`🎁✨ **${def.name} OPENED!**\n\n`;if(def.reward.sparkles){p.sparkles+=def.reward.sparkles;msg+=`💰 **+${def.reward.sparkles.toLocaleString()} Sparkles**\n`;}if(def.reward.candies){p.birthdayCandies+=def.reward.candies;msg+=`🎟️ **+${def.reward.candies} Birthday Candies**\n`;}if(def.reward.collectible){p.birthdayCollection=Array.isArray(p.birthdayCollection)?p.birthdayCollection:[];p.birthdayCollection.push(def.reward.collectible);msg+=`✨ **Permanent collectible added to your Birthday Collection!**`;}p.birthdayGifts=gifts;await savePlayer(env,p);if(def.reward.sparkles)await markBingoAction(env,interaction.guild_id,uid,"receive_sparkles");return sendText(env,interaction,msg);}

async function handleBirthdayGift(env,interaction){
  const {people}=await ensureBirthdayEvent(env,interaction.guild_id); if(!people.length)return sendText(env,interaction,"🔒 Birthday gifting is closed.");
  const user=getUserFromInteraction(interaction); const target=getOption(interaction,"user"); const type=getOption(interaction,"gift_type");
  if(!target||!type)return sendText(env,interaction,"❌ Choose the birthday person and a gift type.");
  if(!people.some(p=>p.userId===target))return sendText(env,interaction,"🎂 Gifts can only be sent to today's birthday person.");
  if(target===user.id)return sendText(env,interaction,"🎁 You can't send yourself a birthday gift.");
  const sender=await getPlayer(env,user.id); if(Number(sender.birthdayGiftSends||0)>=2)return sendText(env,interaction,"🎁 You've already sent your maximum of **2 birthday gifts** today.");
  const gift=BIRTHDAY_GIFTS[type]; if(!gift)return sendText(env,interaction,"❌ Unknown birthday gift.");
  if(!birthdayGiftCostOK(sender,type))return sendText(env,interaction,"❌ You don't have enough Sparkles or Birthday Candies for that gift.");
  const recipient=await getPlayer(env,target);
  if(type==="creepy_present"||type==="pumpkin_treasure") sender.sparkles-=gift.reward.sparkles;
  if(type==="ghost_box") sender.birthdayCandies-=150;
  recipient.birthdayGifts=Array.isArray(recipient.birthdayGifts)?recipient.birthdayGifts:[]; recipient.birthdayGifts.push({id:crypto.randomUUID(),type});
  sender.birthdayGiftSends=(sender.birthdayGiftSends||0)+1; const senderCandy=randomInt(gift.sender[0],gift.sender[1]); sender.birthdayCandies+=senderCandy;
  await savePlayer(env,sender,user.id); await savePlayer(env,recipient,target);
  await markBingoAction(env,interaction.guild_id,sender.userId,"send_gift");
  await sendText(env,interaction,`🎁 **GIFT SENT!**\n\nYou sent ${gift.name} to <@${target}>.\n🎟️ You earned **${senderCandy} Birthday Candies** for gifting.\n🎁 Gifts sent: **${sender.birthdayGiftSends}/2**`);
  await sendUserDM(env,target,`🎂🎁 **A birthday gift arrived!**\n\n<@${user.id}> sent you **${gift.name}** (${gift.rarity}). ✨`);
}

function birthdayGiftMenuText(){return `🎁 **CURSED BIRTHDAY GIFTS**\n\n1. 🎀 Creepy Little Present — Common — 1,000 Sparkles\n2. 👻 Ghostly Gift Box — Uncommon — 150 Birthday Candies\n3. 🎃 Pumpkin Treasure — Rare — 5,000 Sparkles + 250 Birthday Candies\n4. 🦇 Midnight Keepsake — Epic — random exclusive birthday collectible\n5. 🌙 Moonlit Birthday Relic — Legendary — random permanent birthday-exclusive collectible\n\nUse \`/birthday gift\` to send one to today's birthday person. Each player may send **2 total gifts** per event.`}

function birthdayHuntComponents(items){
  return items.map(x=>row(button(`${x.emoji} +${x.reward} 🍬`,`birthday:claim:${x.id}`,1)));
}

function birthdayHuntShuffle(list){
  const arr=[...list];
  for(let i=arr.length-1;i>0;i--){
    const j=randomInt(0,i);
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

async function birthdayHuntMessageExists(env,channelId,messageId){
  if(!channelId||!messageId)return false;
  try{
    const response=await discordRequest(env,`/channels/${channelId}/messages/${messageId}`);
    return response.ok;
  }catch(error){
    console.error("Birthday Fright Hunt message check failed:",error);
    return false;
  }
}

async function getBirthdayHuntCandidates(env,guildId,lastChannelId=null){
  const channels=await getGuildTextChannels(env,guildId);
  const state=await getGuildState(env,guildId);
  const announcementId=state?.announcementChannelId||null;
  const history=Array.isArray(state?.birthday?.huntChannelHistory)
    ? state.birthday.huntChannelHistory.filter(Boolean)
    : [];

  const ids=[...new Set(channels.map(c=>c?.id).filter(Boolean))];

  // Fright Hunt should NOT use the normal announcement channel when another
  // channel is available. That was the reason hunts kept landing in #general.
  let eligible=ids.filter(id=>id!==announcementId);

  // Prefer channels that have not hosted a recent hunt.
  const unseen=eligible.filter(id=>!history.includes(id));
  if(unseen.length) eligible=unseen;

  // Never immediately reuse the previous Hunt channel when another option exists.
  const fresh=eligible.filter(id=>id!==lastChannelId);
  if(fresh.length) eligible=fresh;

  // If every non-announcement channel has recently been used, reset the
  // rotation pool but still avoid the immediately previous channel.
  if(!eligible.length){
    const fallback=ids.filter(id=>id!==announcementId&&id!==lastChannelId);
    if(fallback.length) eligible=fallback;
    else {
      // Only use the announcement channel if it is literally the only
      // channel available to the bot.
      eligible=ids.filter(id=>id===announcementId);
    }
  }

  return birthdayHuntShuffle(eligible);
}

async function spawnBirthdayHunt(env,guildId,preferredChannelId=null){
  const state=await getGuildState(env,guildId);
  if(!birthdayEventActive(state)||state.birthday.huntItems?.some(x=>!x.claimed))return false;

  const count=randomInt(2,4);
  const items=[];
  for(let i=0;i<count;i++){
    const e=BIRTHDAY_HUNT_EMOJIS[randomInt(0,BIRTHDAY_HUNT_EMOJIS.length-1)];
    items.push({id:crypto.randomUUID(),emoji:e[0],name:e[1],reward:e[2],claimed:false});
  }

  const lastChannelId=state.birthday.lastHuntChannelId||null;
  let candidates=await getBirthdayHuntCandidates(env,guildId,lastChannelId);

  // If there are multiple eligible channels, the previous channel is
  // intentionally excluded. The preferred interaction channel is only used
  // as a last-resort fallback when no other channel can accept the hunt.
  if(!candidates.length && preferredChannelId)candidates=[preferredChannelId];
  if(!candidates.length)return false;

  let posted=null;
  for(const channelId of candidates){
    const message=await sendChannelMessage(
      env,
      channelId,
      `🎃🦇 **BIRTHDAY FRIGHT HUNT!**\n\nSpooky birthday treasures have appeared! Claim one before another Werewife does! 👀✨`,
      birthdayHuntComponents(items)
    );
    if(message?.id){
      posted={channelId,messageId:message.id};
      break;
    }
  }

  if(!posted){
    console.error("Birthday Fright Hunt could not post to any eligible channel.");
    return false;
  }

  state.birthday.huntItems=items;
  state.birthday.nextFrightHuntAt=Date.now()+30*60*1000;
  state.birthday.lastHuntChannelId=posted.channelId;
  state.birthday.lastHuntMessageId=posted.messageId;
  state.birthday.huntChannelHistory=Array.isArray(state.birthday.huntChannelHistory)
    ? state.birthday.huntChannelHistory
    : [];
  state.birthday.huntChannelHistory=state.birthday.huntChannelHistory.filter(id=>id!==posted.channelId);
  state.birthday.huntChannelHistory.push(posted.channelId);
  // Keep a short rotation history so the Hunt does not repeatedly return
  // to the same channel.
  if(state.birthday.huntChannelHistory.length>20)
    state.birthday.huntChannelHistory=state.birthday.huntChannelHistory.slice(-20);
  await saveGuildState(env,guildId,state);
  return true;
}

async function handleBirthdayHunt(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 The Birthday Fright Hunt is closed.");

  let items=(state.birthday.huntItems||[]).filter(x=>!x.claimed);
  let channelId=state.birthday.lastHuntChannelId||null;
  let messageId=state.birthday.lastHuntMessageId||null;

  // If there are saved treasures, make absolutely sure the actual hunt
  // message in Discord contains the claim buttons. A previous version could
  // remember a channel/message but leave only the navigation response visible.
  if(items.length&&channelId&&messageId){
    const exists=await birthdayHuntMessageExists(env,channelId,messageId);
    if(exists){
      const repaired=await discordRequest(
        env,
        `/channels/${channelId}/messages/${messageId}`,
        {
          method:"PATCH",
          body:JSON.stringify({
            content:`🎃🦇 **BIRTHDAY FRIGHT HUNT!**\n\nThe spooky birthday treasures have appeared! Claim one before another Werewife does! 👀✨`,
            components:birthdayHuntComponents(items)
          })
        }
      );
      if(!repaired.ok){
        console.error("Birthday Fright Hunt message repair failed:",repaired.status,await repaired.text());
      }
    }else{
      channelId=null;
      messageId=null;
      state.birthday.lastHuntChannelId=null;
      state.birthday.lastHuntMessageId=null;
      await saveGuildState(env,interaction.guild_id,state);
    }
  }

  // If the saved hunt message is missing, repost the SAME unclaimed
  // treasures into a different channel. Never silently create a new empty
  // hunt when treasures already exist.
  if(items.length&&!channelId){
    const previousChannel=state.birthday.lastHuntChannelId||null;
    const candidates=await getBirthdayHuntCandidates(env,interaction.guild_id,previousChannel);
    let posted=null;
    for(const candidate of candidates){
      const message=await sendChannelMessage(
        env,
        candidate,
        `🎃🦇 **BIRTHDAY FRIGHT HUNT!**\n\nThe spooky birthday treasures are here! Claim one before another Werewife does! 👀✨`,
        birthdayHuntComponents(items)
      );
      if(message?.id){posted={channelId:candidate,messageId:message.id};break;}
    }
    if(posted){
      state.birthday.lastHuntChannelId=posted.channelId;
      state.birthday.lastHuntMessageId=posted.messageId;
      await saveGuildState(env,interaction.guild_id,state);
      channelId=posted.channelId;
      messageId=posted.messageId;
    }
  }

  if(!items.length){
    const spawned=await spawnBirthdayHunt(env,interaction.guild_id,interaction.channel_id);
    const refreshed=await getGuildState(env,interaction.guild_id);
    items=(refreshed.birthday?.huntItems||[]).filter(x=>!x.claimed);
    channelId=refreshed.birthday?.lastHuntChannelId||null;
    messageId=refreshed.birthday?.lastHuntMessageId||null;
    if(spawned&&items.length&&channelId){
      // The actual treasure message was posted by spawnBirthdayHunt.
      // Send only a locator response here.
      return sendText(
        env,
        interaction,
        `🎃🦇 **A NEW FRIGHT HUNT HAS APPEARED!**\n\nThe spooky treasures are hiding in <#${channelId}>!\n\n🏃 Go there and claim them before another Werewife gets there first! 👀`,
        [row(button("🎂 Birthday Menu","birthday:home",2))]
      );
    }
  }

  if(!items.length)return sendText(env,interaction,"🎃 I couldn't place the Fright Hunt in a channel right now. Please try the Hunt button again!");
  if(!channelId)return sendText(env,interaction,"🎃 I couldn't confirm a hunt channel yet. Try Hunt once more.");

  return sendText(
    env,
    interaction,
    `🎃 **BIRTHDAY FRIGHT HUNT**\n\nThe current hunt is happening in <#${channelId}>!\n\n🏃 Go there and claim the treasures before another Werewife does! 👀`,
    [row(button("🎂 Birthday Menu","birthday:home",2))]
  );
}

async function claimBirthdayHunt(env,interaction,id){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🎃 The Birthday Fright Hunt is over.");
  const item=(state.birthday.huntItems||[]).find(x=>x.id===id);
  if(!item||item.claimed)return sendText(env,interaction,"👻 Too late! Someone already claimed that spooky find.");
  item.claimed=true;
  const p=await getPlayer(env,getUserFromInteraction(interaction).id);
  p.birthdayCandies+=item.reward;
  const sparkleReward=randomInt(25,100);
  p.sparkles=Number(p.sparkles||0)+sparkleReward;
  await markBingoAction(env,interaction.guild_id,p.userId,"receive_sparkles");
  await savePlayer(env,p);

  const remaining=(state.birthday.huntItems||[]).filter(x=>!x.claimed);
  if(state.birthday.lastHuntChannelId&&state.birthday.lastHuntMessageId){
    const huntResponse=await discordRequest(
      env,
      `/channels/${state.birthday.lastHuntChannelId}/messages/${state.birthday.lastHuntMessageId}`,
      {
        method:"PATCH",
        body:JSON.stringify({
          content:remaining.length
            ? `🎃🦇 **BIRTHDAY FRIGHT HUNT!**\n\nThe spooky birthday treasures are still here! Claim one before another Werewife does! 👀✨`
            : `🎃🦇 **BIRTHDAY FRIGHT HUNT COMPLETE!**\n\nAll of the spooky birthday treasures have been claimed! 🎉🎂`,
          components:remaining.length ? birthdayHuntComponents(remaining) : []
        })
      }
    );
    if(!huntResponse.ok)console.error("Birthday Fright Hunt live update failed:",huntResponse.status,await huntResponse.text());
  }
  await saveGuildState(env,interaction.guild_id,state);
  const huntMarks={"🎂":"birthday_cake","🎀":"birthday_bow","🕯️":"candle_lit","🖤":"black_heart"};
  const huntAction=huntMarks[item.emoji];
  if(huntAction)await markBingoAction(env,interaction.guild_id,p.userId,huntAction);
  if(p.birthdayCandies>=100) await markBingoAction(env,interaction.guild_id,p.userId,"hundred_candy");
  return sendText(env,interaction,`🎃✨ **YOU FOUND IT!**\n\n${item.emoji} ${item.name}\n🎟️ **+${item.reward} Birthday Candies!**`);
}

function bingoBoard(){
  const pool=[
    ...BIRTHDAY_BINGO_PERSONAL.map(x=>({id:x[0],label:x[1],server:false})),
    ...BIRTHDAY_SERVER_SQUARES.map(id=>({
      id,
      label:{pumpkin_appears:"🎃 A Pumpkin Appears",ghost_appears:"👻 A Ghost Appears",bat_swarm:"🦇 A Bat Swarm Appears",boo_cannon:"💥🎃 The Birthday Boo Cannon Is Fired"}[id],
      server:true
    }))
  ];
  const shuffled=pool.sort(()=>Math.random()-.5);
  const cells=shuffled.slice(0,24);
  cells.splice(12,0,{id:"free",label:"🕯️ Birthday Candle",server:false,marked:true});
  return cells;
}
function birthdayBingoCanonicalLabels(){
  const labels={};
  for(const [id,label] of BIRTHDAY_BINGO_PERSONAL)labels[id]=label;
  labels.pumpkin_appears="🎃 A Pumpkin Appears";
  labels.ghost_appears="👻 A Ghost Appears";
  labels.bat_swarm="🦇 A Bat Swarm Appears";
  labels.boo_cannon="💥🎃 The Birthday Boo Cannon Is Fired";
  labels.free="🕯️ Birthday Candle";
  return labels;
}
function migrateBirthdayBingoBoard(b){
  if(!b||!Array.isArray(b.cells))return false;
  const labels=birthdayBingoCanonicalLabels();
  const legacy={bat_item:"birthday_shop",game_win:"boss_win"};
  const valid=new Set([...Object.keys(labels)].filter(id=>id!=="free"));
  const used=new Set();
  let changed=false;
  for(const cell of b.cells){
    if(cell.id==="free"){
      if(cell.label!==labels.free){cell.label=labels.free;changed=true;}
      cell.marked=true;
      continue;
    }
    let nextId=legacy[cell.id]||cell.id;
    if(!valid.has(nextId)||used.has(nextId)){
      nextId=[...valid].find(id=>!used.has(id));
    }
    if(nextId&&cell.id!==nextId){cell.id=nextId;changed=true;}
    if(nextId&&cell.label!==labels[nextId]){cell.label=labels[nextId];changed=true;}
    if(nextId)used.add(nextId);
  }
  return changed;
}
function bingoText(b){
  migrateBirthdayBingoBoard(b);
  const lines=[];
  for(let r=0;r<5;r++)lines.push(b.cells.slice(r*5,r*5+5).map(c=>c.marked?`🟩 ${c.label}`:`⬜ ${c.label}`).join("\n"));
  return `🎂🎃 **HALLOWEEN BIRTHDAY BINGO**\n\n${lines.join("\n────────────\n")}\n\n🏆 1 line: 50 🍬 | 2: 100 🍬 | 3: 150 🍬 | 4: 200 🍬 | Full board: +500 🍬`;
}
function bingoButtons(b){
  return [row(button("🔄 Refresh Board","birthday:bingo:refresh",2),button("🎂 Birthday Menu","birthday:home",2))];
}
function bingoWinLines(cells){
  const lines=[];
  for(let r=0;r<5;r++)lines.push([0,1,2,3,4].map(i=>r*5+i));
  for(let c=0;c<5;c++)lines.push([0,1,2,3,4].map(i=>i*5+c));
  lines.push([0,6,12,18,24],[4,8,12,16,20]);
  return lines.filter(ix=>ix.every(i=>cells[i].marked)).length;
}
function birthdayBingoHistoryFor(player,date){
  const sameDate=player.birthdayBingoHistoryDate===date;
  if(!sameDate){
    player.birthdayBingoHistoryDate=date;
    player.birthdayBingoHistory=[];
  }
  if(!Array.isArray(player.birthdayBingoHistory))player.birthdayBingoHistory=[];
  return player.birthdayBingoHistory;
}
async function recordBirthdayBingoHistory(env,userId,date,action){
  const p=await getPlayer(env,userId);
  const h=birthdayBingoHistoryFor(p,date);
  if(!h.includes(action)){h.push(action);await savePlayer(env,p);}
}
async function updateBirthdayBingoMessage(env,guildId,userId){
  try{
    const state=await getGuildState(env,guildId);
    const b=state.birthday?.bingoBoards?.[userId];
    if(!b?.messageId||!b?.channelId)return false;
    const response=await discordRequest(env,`/channels/${b.channelId}/messages/${b.messageId}`,{
      method:"PATCH",
      body:JSON.stringify({content:bingoText(b),components:bingoButtons(b)})
    });
    if(!response.ok){console.error("Birthday Bingo board update failed:",response.status,await response.text());return false;}
    return true;
  }catch(error){console.error("Birthday Bingo board update error:",error);return false;}
}
async function saveBirthdayBingoMessageRef(env,interaction,userId){
  try{
    if(!interaction?.guild_id||!interaction?.channel_id||!interaction?.token)return;
    const response=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`);
    if(!response.ok)return;
    const data=await response.json();
    if(!data?.id)return;
    const state=await getGuildState(env,interaction.guild_id);
    const b=state.birthday?.bingoBoards?.[userId];
    if(!b)return;
    b.messageId=data.id;b.channelId=interaction.channel_id;
    await saveGuildState(env,interaction.guild_id,state);
  }catch(error){console.error("Birthday Bingo message ref failed:",error);}
}
async function syncBirthdayBingoProgress(env,guildId,userId){
  const state=await getGuildState(env,guildId);
  const b=state.birthday?.bingoBoards?.[userId];
  if(!b)return;
  const date=state.birthday?.activeDate||birthdayTodayKey();
  const p=await getPlayer(env,userId);
  const actions=new Set(birthdayBingoHistoryFor(p,date));

  // Backfill accomplishments from current saved state.
  if(Number(p.birthdayCandies||0)>0)actions.add("earn_candy");
  if(Number(p.birthdayCandies||0)>=100)actions.add("hundred_candy");
  if(Number(p.birthdayGiftSends||0)>0)actions.add("send_gift");
  if(p.birthdayWishUsedDate===date)actions.add("wish");
  if(p.birthdayTricksterLast)actions.add("trickster");

  const collection=Array.isArray(p.birthdayCollection)?p.birthdayCollection:[];
  if(collection.includes("midnight_heart_cupcake"))actions.add("secret_recipe");
  if(collection.includes("cursed_birthday_cake"))actions.add("boss_win");

  const inv=Array.isArray(p.inventory)?p.inventory:[];
  if(inv.some(id=>Object.prototype.hasOwnProperty.call(BIRTHDAY_SHOP_ITEMS,id)))actions.add("birthday_shop");

  for(const id of inv){
    const lower=String(id||"").toLowerCase();
    const item=BIRTHDAY_SHOP_ITEMS[id];
    if(item){
      if(item.type!=="sparkles")actions.add("birthday_cosmetic");
      if(item.type==="decoration")actions.add("decoration");
    }
    if((lower.includes("birthday")||lower.includes("halloween"))&&!lower.includes("sparkles"))actions.add("birthday_cosmetic");
    if(lower.includes("heart")&&!lower.includes("effect"))actions.add("black_heart");
    if(lower.includes("decoration"))actions.add("decoration");
  }

  const games=state.birthday?.games||{};
  const curse=games.curse;
  if(curse&&curse.active===false&&Array.isArray(curse.answers)&&curse.answers.some(a=>a.userId===userId))actions.add("curse");
  const cupcakes=games.cupcakes?.[userId];
  if(cupcakes&&cupcakes.active===false&&Array.isArray(cupcakes.choices)&&cupcakes.choices.length){
    actions.add("cupcake");
    if(cupcakes.choices.some(c=>String(c).toLowerCase().includes("heart")))actions.add("black_heart");
  }
  const bakery=games.bakery;
  if(bakery&&bakery.active===false&&bakery.userId===userId&&Array.isArray(bakery.choices)&&bakery.choices.length)actions.add("bakery");
  const roulette=games.roulette;
  if(roulette&&roulette.active===false&&Array.isArray(roulette.players)&&roulette.players.some(x=>x.id===userId))actions.add("roulette");
  const boss=games.boss;
  if(boss&&boss.active===false&&Array.isArray(boss.players)&&boss.players.includes(userId)&&collection.includes("cursed_birthday_cake"))actions.add("boss_win");

  for(const action of BIRTHDAY_SERVER_SQUARES)if(state.birthday?.serverEvents?.[action])actions.add(action);

  for(const item of state.birthday?.huntItems||[]){
    if(!item.claimed)continue;
    const owner=item.claimedBy||item.userId||item.claimantId;
    if(owner&&String(owner)!==String(userId))continue;
    const huntMarks={"🎂":"birthday_cake","🎀":"birthday_bow","🕯️":"candle_lit","🖤":"black_heart"};
    if(huntMarks[item.emoji])actions.add(huntMarks[item.emoji]);
  }

  for(const action of actions){
    const cell=b.cells.find(c=>c.id===action&&!c.marked);
    if(cell)cell.marked=true;
  }
  const free=b.cells.find(c=>c.id==="free");if(free)free.marked=true;
  await applyBirthdayBingoReward(env,userId,b);
  await savePlayer(env,p);
  await saveGuildState(env,guildId,state);
}
async function startBirthdayBingo(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Bingo is closed.");
  const uid=getUserFromInteraction(interaction).id;
  state.birthday.bingoBoards=state.birthday.bingoBoards||{};
  if(!state.birthday.bingoBoards[uid]){
    state.birthday.bingoBoards[uid]={cells:bingoBoard(),linesPaid:0,fullPaid:false};
    await saveGuildState(env,interaction.guild_id,state);
  }else if(migrateBirthdayBingoBoard(state.birthday.bingoBoards[uid])){
    await saveGuildState(env,interaction.guild_id,state);
  }
  await syncBirthdayBingoProgress(env,interaction.guild_id,uid);
  const refreshed=await getGuildState(env,interaction.guild_id);
  const b=refreshed.birthday.bingoBoards[uid];
  const response=await sendText(env,interaction,bingoText(b),bingoButtons(b));
  // Save the actual Discord message id before returning so later
  // accomplishments can reliably update this exact Bingo board.
  await saveBirthdayBingoMessageRef(env,interaction,uid);
  return response;
}
async function applyBirthdayBingoReward(env,userId,b){
  const lines=bingoWinLines(b.cells);
  const paid=Number(b.linesPaid||0);
  if(lines<=paid)return;
  const newlyPaid=Math.min(lines,4)-paid;
  if(newlyPaid>0){
    const p=await getPlayer(env,userId);
    p.birthdayCandies=(Number(p.birthdayCandies)||0)+newlyPaid*50;
    await savePlayer(env,p);
  }
  b.linesPaid=lines;
  if(lines===5&&!b.fullPaid){
    const p=await getPlayer(env,userId);
    p.birthdayCandies=(Number(p.birthdayCandies)||0)+500;
    b.fullPaid=true;
    await savePlayer(env,p);
  }
}
async function markBirthdayServerSquare(env,guildId,action){
  const state=await getGuildState(env,guildId);
  if(!birthdayEventActive(state))return;
  state.birthday.serverEvents=state.birthday.serverEvents||{};
  state.birthday.serverEvents[action]=true;
  for(const [uid,b] of Object.entries(state.birthday.bingoBoards||{})){
    const cell=b.cells.find(c=>c.server&&c.id===action&&!c.marked);
    if(cell)cell.marked=true;
    await applyBirthdayBingoReward(env,uid,b);
  }
  await saveGuildState(env,guildId,state);
  for(const uid of Object.keys(state.birthday.bingoBoards||{}))await updateBirthdayBingoMessage(env,guildId,uid);
}
async function markBingoAction(env,guildId,userId,action){
  try{
    const state=await getGuildState(env,guildId);
    await recordBirthdayBingoHistory(env,userId,state.birthday?.activeDate||birthdayTodayKey(),action);
  }catch(error){console.error("Birthday Bingo history record failed:",error);}
  const state=await getGuildState(env,guildId);
  const b=state.birthday?.bingoBoards?.[userId];
  if(!b)return;
  const cell=b.cells.find(c=>c.id===action&&!c.marked);
  if(cell)cell.marked=true;
  await applyBirthdayBingoReward(env,userId,b);
  await saveGuildState(env,guildId,state);
  await updateBirthdayBingoMessage(env,guildId,userId);
}
async function startBirthdayRoulette(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Pumpkin Roulette is closed.");
  const user=getUserFromInteraction(interaction);
  if(!user)return sendText(env,interaction,"❌ Could not identify the player.");
  state.birthday.games=state.birthday.games||{};
  const rouletteGame=state.birthday.games.roulette;
  if(rouletteGame?.active){
    if(rouletteGame.status==="lobby")return sendPublicText(env,interaction,rouletteLobbyText(rouletteGame),rouletteLobbyButtons(rouletteGame));
    return sendText(env,interaction,rouletteText(rouletteGame),rouletteButtons(rouletteGame));
  }
  const game={
    active:true,
    status:"lobby",
    hostId:user.id,
    players:[{id:user.id,username:user.username||"",displayName:user.global_name||user.username||"Player",alive:true}],
    pumpkins:[],
    cursed:0,
    count:0,
    round:0
  };
  state.birthday.games.roulette=game;
  await saveGuildState(env,interaction.guild_id,state);
  return sendPublicText(env,interaction,rouletteLobbyText(game),rouletteLobbyButtons(game));
}
function rouletteLobbyText(g){
  const players=Array.isArray(g.players)?g.players:[];
  const names=players.map((p,i)=>`${i+1}. <@${p.id}>`).join("\n");
  return `🎃💀 **PUMPKIN ROULETTE LOBBY**\n\n👑 Host: <@${g.hostId}>\n👥 Players: **${players.length}/10**\n\n${names||"No players yet."}\n\n${players.length>=2?"✨ Enough players! The host can start the game.":"⏳ Waiting for players to join... At least **2 players** are required."}`;
}
function rouletteLobbyButtons(g){
  const players=Array.isArray(g.players)?g.players:[];
  const full=players.length>=10;
  const canStart=players.length>=2;
  return [
    row(button("👥 Join Roulette","birthday:roulettejoin",3,full),button("▶️ Start Roulette","birthday:roulettestart",1,!canStart),button("🚪 Leave","birthday:rouletteleave",2))
  ];
}
async function birthdayRouletteJoin(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Pumpkin Roulette is closed.");
  const g=state.birthday?.games?.roulette;
  const user=getUserFromInteraction(interaction);
  if(!g?.active||g.status!=="lobby")return sendText(env,interaction,"🎃 There is no open Roulette lobby right now.");
  if(!user)return sendText(env,interaction,"❌ Could not identify the player.");
  g.players=Array.isArray(g.players)?g.players:[];
  if(g.players.some(p=>p.id===user.id)){
    await deferInteraction(env,interaction,{update:true});
    return editOriginalResponse(env,interaction,{content:rouletteLobbyText(g),components:rouletteLobbyButtons(g)});
  }
  if(g.players.length>=10)return sendText(env,interaction,"🎃 This Roulette lobby is full (10/10).");
  g.players.push({id:user.id,username:user.username||"",displayName:user.global_name||user.username||"Player",alive:true});
  await saveGuildState(env,interaction.guild_id,state);
  if(!await deferInteraction(env,interaction,{update:true}))return;
  return editOriginalResponse(env,interaction,{content:rouletteLobbyText(g),components:rouletteLobbyButtons(g)});
}
async function birthdayRouletteLeave(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  const g=state.birthday?.games?.roulette;
  const user=getUserFromInteraction(interaction);
  if(!g?.active||g.status!=="lobby")return sendText(env,interaction,"🎃 There is no open Roulette lobby right now.");
  if(!user)return sendText(env,interaction,"❌ Could not identify the player.");
  g.players=Array.isArray(g.players)?g.players:[];
  const index=g.players.findIndex(p=>p.id===user.id);
  if(index<0)return sendText(env,interaction,"❌ You're not in this Roulette lobby.");
  g.players.splice(index,1);
  if(g.players.length===0){
    state.birthday.games.roulette=null;
    await saveGuildState(env,interaction.guild_id,state);
    if(!await deferInteraction(env,interaction,{update:true}))return;
    return editOriginalResponse(env,interaction,{content:"🎃 The Pumpkin Roulette lobby was closed because everyone left.",components:[]});
  }
  if(g.hostId===user.id)g.hostId=g.players[0].id;
  await saveGuildState(env,interaction.guild_id,state);
  if(!await deferInteraction(env,interaction,{update:true}))return;
  return editOriginalResponse(env,interaction,{content:rouletteLobbyText(g),components:rouletteLobbyButtons(g)});
}
async function birthdayRouletteStart(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  const g=state.birthday?.games?.roulette;
  const user=getUserFromInteraction(interaction);
  if(!g?.active||g.status!=="lobby")return sendText(env,interaction,"🎃 There is no Roulette lobby waiting to start.");
  if(!user)return sendText(env,interaction,"❌ Could not identify the player.");
  if(g.hostId!==user.id)return sendText(env,interaction,"👑 Only the Roulette host can start the game.");
  g.players=Array.isArray(g.players)?g.players:[];
  if(g.players.length<2)return sendText(env,interaction,"🎃 Pumpkin Roulette needs at least 2 players to start.");
  const ids=g.players.slice(0,10).map(p=>p.id);
  const count=ids.length===2?4:ids.length===3?5:ids.length===4?6:ids.length===5?7:ids.length+2;
  const cursed=ids.length<=3?1:ids.length<=5?2:3;
  g.status="active";
  g.players=ids.map(id=>({id,alive:true}));
  g.count=count;
  g.cursed=cursed;
  g.pumpkins=[];
  g.round=0;
  g.turnIndex=0;
  g.turnId=g.players[0]?.id||null;
  reshuffleRoulette(g);
  await saveGuildState(env,interaction.guild_id,state);
  if(!await deferInteraction(env,interaction,{update:true}))return;
  return editOriginalResponse(env,interaction,{content:rouletteText(g),components:rouletteButtons(g)});
}
function reshuffleRoulette(g){const arr=Array.from({length:g.count},(_,i)=>({id:i,cursed:i<g.cursed})).sort(()=>Math.random()-.5);g.pumpkins=arr;}
function rouletteText(g){
  const alive=g.players.filter(p=>p.alive);
  let turnId=g.turnId;
  if(!turnId||!alive.some(p=>p.id===turnId))turnId=alive[0]?.id||null;
  return `🎃💀 **PUMPKIN ROULETTE**\n\n👥 Survivors: **${alive.length}**\n🎃 Pumpkins: **${g.count}**\n💀 Cursed: **${g.cursed}**\n🔄 Round: **${Number(g.round||0)+1}**\n\n${turnId?`🎯 **Turn:** <@${turnId}>`:"🏆 No turns remaining."}\n\nChoose a pumpkin. The pumpkins reshuffle after EVERY pick! 👀🎃`;
}
function rouletteButtons(g){const safe=g.pumpkins.map((p,i)=>button(`🎃 Pumpkin ${i+1}`,`birthday:roulettepick:${i}`,1));const rows=[];for(let i=0;i<safe.length;i+=5)rows.push(row(...safe.slice(i,i+5)));return rows;}
async function birthdayRoulettePick(env,interaction,index){
  const state=await getGuildState(env,interaction.guild_id);
  const g=state.birthday?.games?.roulette;
  const user=getUserFromInteraction(interaction);
  const uid=user?.id;
  if(!g?.active)return sendText(env,interaction,"🎃 That Roulette game is over.");
  if(!uid)return sendText(env,interaction,"❌ Could not identify the player.");

  g.players=Array.isArray(g.players)?g.players:[];
  const alive=g.players.filter(p=>p.alive);
  if(alive.length<=1){
    g.active=false;
    const winner=alive[0];
    await saveGuildState(env,interaction.guild_id,state);
    return sendText(env,interaction,winner?`🏆🎃 **PUMPKIN ROULETTE OVER!**\n\nLast survivor: <@${winner.id}>\n🎟️ Winner reward: **500 Birthday Candies** + **🎃 Pumpkin's Favorite**.`:"🏆🎃 Pumpkin Roulette is over. Nobody survived.");
  }

  // Turn-based protection: only the player shown as the current turn may pick.
  // Older active games may not have turnId yet, so safely initialize it.
  if(!g.turnId||!alive.some(p=>p.id===g.turnId)){
    g.turnIndex=0;
    g.turnId=alive[0].id;
  }
  if(uid!==g.turnId){
    return sendEphemeralFollowup(env,interaction,`⏳ It's <@${g.turnId}>'s turn! Please wait for your turn. 🎃`);
  }

  const pl=g.players.find(p=>p.id===uid&&p.alive);
  if(!pl)return sendEphemeralFollowup(env,interaction,"❌ You're not an active player in this Roulette game.");
  const pumpkin=g.pumpkins[Number(index)];
  if(!pumpkin)return sendEphemeralFollowup(env,interaction,"❌ That pumpkin doesn't exist.");

  g.round=Number(g.round||0)+1;
  const aliveBefore=g.players.filter(p=>p.alive);
  const currentPos=aliveBefore.findIndex(p=>p.id===uid);

  if(pumpkin.cursed){
    pl.alive=false;
    await markBingoAction(env,interaction.guild_id,uid,"roulette");

    const survivors=g.players.filter(p=>p.alive);
    if(survivors.length<=1){
      g.active=false;
      g.turnId=null;
      await saveGuildState(env,interaction.guild_id,state);
      const winner=survivors[0];
      if(winner){
        const wp=await getPlayer(env,winner.id);
        wp.birthdayCandies+=500;
        wp.titles=Array.isArray(wp.titles)?wp.titles:[];
        if(!wp.titles.includes("pumpkins_favorite"))wp.titles.push("pumpkins_favorite");
        await savePlayer(env,wp,winner.id);
      }
      return sendText(env,interaction,`💀🎃 **CURSED PUMPKIN!** <@${uid}> is eliminated!\n\n🏆 **Last survivor:** ${winner?`<@${winner.id}>`:"Nobody"}\n🎟️ Winner reward: **500 Birthday Candies** + **🎃 Pumpkin's Favorite**.`);
    }

    const nextIndex=currentPos>=0?(currentPos%survivors.length):0;
    g.turnId=survivors[nextIndex]?.id||survivors[0].id;
    g.turnIndex=g.players.findIndex(p=>p.id===g.turnId);
    reshuffleRoulette(g);
    await saveGuildState(env,interaction.guild_id,state);
    return sendText(env,interaction,`💀🎃 **CURSED PUMPKIN!** <@${uid}> is eliminated!\n\n${rouletteText(g)}`,rouletteButtons(g));
  }

  const effects=[
    ["✨ Sparkle Burst",randomInt(20,100)],
    ["🎟️ Birthday Candy bonus",randomInt(10,50)],
    ["🦇 Bat swarm animation",0],
    ["👻 Ghost message",0],
    ["🎃 Pumpkin wiggle",0],
    ["🕯️ Candle glow",0],
    ["🍬 Candy shower",randomInt(10,75)]
  ];
  const e=effects[randomInt(0,effects.length-1)];
  const p=await getPlayer(env,uid);
  if(e[0].includes("Sparkle"))p.sparkles+=e[1];
  else if(e[1])p.birthdayCandies+=e[1];
  await savePlayer(env,p);
  await markBingoAction(env,interaction.guild_id,uid,"roulette");
  if(e[0].includes("Sparkle"))await markBingoAction(env,interaction.guild_id,uid,"receive_sparkles");

  const survivors=g.players.filter(p=>p.alive);
  const currentAliveIndex=survivors.findIndex(p=>p.id===uid);
  const nextIndex=(currentAliveIndex+1)%survivors.length;
  g.turnId=survivors[nextIndex]?.id||survivors[0].id;
  g.turnIndex=g.players.findIndex(p=>p.id===g.turnId);
  reshuffleRoulette(g);
  await saveGuildState(env,interaction.guild_id,state);

  return sendText(env,interaction,`${e[0]}!${e[1]&&e[0].includes("Sparkle")?` You gained **${e[1]} Sparkles**.`:e[1]?` You gained **${e[1]} Birthday Candies**.`:""}\n\nYou survived this round!\n\n${rouletteText(g)}`,rouletteButtons(g));
}
function randomWordPrompt(prompt){const pools={"adjective":["sparkly","creepy","pink","mysterious","ridiculous"],"spooky noun":["ghost","bat","tombstone","cauldron","candle"],"food":["pizza","cupcake","cake","spaghetti","donut"],"verb":["dance","sprint","hide","wiggle","scream"],"place":["castle","graveyard","kitchen","forest","attic"],"cake topping":["sprinkles","strawberry","bat candy","bow"],"animal":["raccoon","cat","bat","frog","owl"],"sound":["BOOM","squeak","whooo","BANG"],"dessert":["cupcakes","candy","cake","cookies"],"color":["pink","purple","orange","black"],"object":["key","mirror","candle","present"],"monster":["vampire","zombie","witch","cake monster"]};return pools[prompt]||["spooky","birthday","cake"]}
function birthdayCurseInputButton(){
  return [row(button("✏️ Enter Answer","birthday:curseinput",1))];
}
async function showBirthdayCurseModal(env,interaction){
  return fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      type:9,
      data:{
        custom_id:"birthday:cursemodal",
        title:"The Birthday Curse",
        components:[
          {
            type:1,
            components:[
              {type:4,custom_id:"answer",label:"Your answer",style:1,placeholder:"Type one word...",required:true,max_length:60}
            ]
          }
        ]
      }
    })
  });
}
async function startBirthdayCurse(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 The Birthday Curse is closed.");
  state.birthday.games=state.birthday.games||{};
  const existing=state.birthday.games.curse;
  if(existing?.active&&existing.story?.prompts?.length){
    const index=Math.min(Number(existing.index||0),existing.story.prompts.length-1);
    return sendText(env,interaction,`👻 **The Birthday Curse is already running!**\n\nGive me a **${existing.story.prompts[index]}**.`,birthdayCurseInputButton());
  }
  const story=BIRTHDAY_STORIES[randomInt(0,BIRTHDAY_STORIES.length-1)];
  state.birthday.games.curse={active:true,story,answers:[],index:0};
  await saveGuildState(env,interaction.guild_id,state);
  return sendText(env,interaction,`📖👻 **THE BIRTHDAY CURSE**\n\nThe birthday person is **${birthdayName(state)}**.\n\n🏃 First appropriate answer wins each slot!\n\nUse the button below to enter your answer for **${story.prompts[0]}**.`,birthdayCurseInputButton());
}
function getModalTextInput(interaction,customId){
  for(const r of interaction.data?.components||[])for(const c of r.components||[])if(c.custom_id===customId)return c.value||"";
  return "";
}
async function birthdayCurseAnswer(env,interaction,answer){const state=await getGuildState(env,interaction.guild_id);const g=state.birthday?.games?.curse;if(!g?.active)return sendText(env,interaction,"📖 The Birthday Curse isn't active.");if(!answer)return sendText(env,interaction,"❌ Give me a word.");const prompt=g.story.prompts[g.index];const cleaned=String(answer).trim().slice(0,60);g.answers.push({prompt,word:cleaned,userId:getUserFromInteraction(interaction).id});g.index++;if(g.index<g.story.prompts.length){await saveGuildState(env,interaction.guild_id,state);return sendText(env,interaction,`👻 **SLOT FILLED!**\n\nNext: give me a **${g.story.prompts[g.index]}**.`,birthdayCurseInputButton());}let text=g.story.text;for(const a of g.answers)text=text.replace(`[${a.prompt}]`,a.word);const contributors=new Set(g.answers.map(a=>a.userId));for(const uid of contributors){const p=await getPlayer(env,uid);p.birthdayCandies+=25;await savePlayer(env,p);}const birthdayIds=Array.isArray(state.birthday?.birthdayIds)?state.birthday.birthdayIds.filter(Boolean):[];for(const uid of birthdayIds){const p=await getPlayer(env,uid);p.birthdayCandies+=g.story.reward;await savePlayer(env,p);}g.active=false;await saveGuildState(env,interaction.guild_id,state);await markBingoAction(env,interaction.guild_id,getUserFromInteraction(interaction).id,"curse");const birthdayMentions=birthdayIds.length?birthdayMentionList(birthdayIds):birthdayName(state);if(birthdayIds.length){text=text.replace(/\bthe birthday person\b/gi,birthdayMentions).replace(/\bbirthday person\b/gi,birthdayMentions);}return sendText(env,interaction,`👻🎂 **THE BIRTHDAY CURSE IS COMPLETE!**\n\n${text}\n\n🎂 ${birthdayMentions} — **${g.story.reward} Birthday Candies** birthday reward!\n🎟️ Every player whose word was used also receives **+25 Birthday Candies**.`);}

const BIRTHDAY_CUPCAKE_INGREDIENTS = [
  ["🍫 Black Velvet","cake"],["🍰 Vanilla Mooncake","cake"],["🧁 Strawberry Cake","cake"],["🎃 Pumpkin Spice Cake","cake"],["🍒 Cherry Night Cake","cake"],["💗 Pink Velvet","cake"],
  ["🖤 Black Velvet Frosting","frosting"],["💗 Strawberry Frosting","frosting"],["🎃 Pumpkin Frosting","frosting"],["👻 Ghost Vanilla Frosting","frosting"],["🍫 Midnight Chocolate Frosting","frosting"],["🫐 Blackberry Frosting","frosting"],
  ["🍓 Strawberry Jam","filling"],["🍒 Cherry Filling","filling"],["🫐 Blackberry Jam","filling"],["🍫 Chocolate Cream","filling"],["🎃 Pumpkin Cream","filling"],["🍬 Cotton Candy Filling","filling"],
  ["🎀 Pink Bow","topping"],["🦇 Chocolate Bat","topping"],["👻 Ghost Marshmallow","topping"],["🎃 Mini Pumpkin","topping"],["🍓 Strawberry","topping"],["🍒 Cherry","topping"],["🕷️ Tiny Spider","topping"],["🕯️ Birthday Candle","topping"],["🖤 Black Heart Sprinkles","topping"],["✨ Glitter Sugar","topping"],["🌙 Crescent Candy","topping"],["💗 Sugar Hearts","topping"],
  ["🧪 Witch's Sugar","special"],["🖤 Black Magic Frosting","special"],["👻 Ghost Dust","special"],["🦇 Bat Wing Candy","special"],["🎃 Enchanted Pumpkin Syrup","special"],["🌹 Midnight Rose","special"],["💜 Witchberry Sauce","special"],["✨ Stardust Sugar","special"],["🕸️ Spiderweb Caramel","special"]
];
const BIRTHDAY_SECRET_RECIPES = [{need:["🖤 Black Velvet Frosting","💗 Strawberry Frosting","🖤 Black Heart Sprinkles","🎀 Pink Bow"],name:"Midnight Heart Cupcake",reward:300}];
async function startBirthdayCupcake(env,interaction){
  const state=await getGuildState(env,interaction.guild_id); if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Wicked Cupcake Tower is closed.");
  const uid=getUserFromInteraction(interaction).id; state.birthday.games=state.birthday.games||{}; state.birthday.games.cupcakes=state.birthday.games.cupcakes||{};
  if(state.birthday.games.cupcakes[uid]?.active)return birthdayCupcakeView(env,interaction);
  state.birthday.games.cupcakes[uid]={active:true,choices:[],outcomes:[],steps:0,stability:100,createdAt:Date.now()}; await saveGuildState(env,interaction.guild_id,state); return birthdayCupcakeView(env,interaction);
}
function cupcakeButtons(used=[]){const usedSet=new Set(Array.isArray(used)?used:[]);const available=BIRTHDAY_CUPCAKE_INGREDIENTS.filter(x=>!usedSet.has(x[0]));const missingRecipe=BIRTHDAY_SECRET_RECIPES.flatMap(r=>r.need).filter(n=>!usedSet.has(n));const guaranteed=available.filter(x=>BIRTHDAY_SECRET_RECIPES.some(r=>r.need.includes(x[0])&&missingRecipe.includes(x[0])));const pool=available.filter(x=>!guaranteed.includes(x));const shuffledPool=[...pool].sort(()=>Math.random()-.5);const shuffled=[...guaranteed.sort(()=>Math.random()-.5),...shuffledPool].slice(0,10).sort(()=>Math.random()-.5);const rows=[row(...shuffled.slice(0,5).map(x=>button(x[0],`birthday:cupcakepick:${encodeURIComponent(x[0])}`,1))),row(...shuffled.slice(5,10).map(x=>button(x[0],`birthday:cupcakepick:${encodeURIComponent(x[0])}`,1)))].filter(r=>r.components.length);rows.push(row(button("⏭️ Skip Layer","birthday:cupcakeskip",2)));return rows;}
async function birthdayCupcakeView(env,interaction){const state=await getGuildState(env,interaction.guild_id);const uid=getUserFromInteraction(interaction).id;const g=state.birthday?.games?.cupcakes?.[uid];if(!g?.active)return sendText(env,interaction,"🧁 Your cupcake tower is not active.");return sendText(env,interaction,`🧁 **WICKED CUPCAKE TOWER**\n\n🎂 Layers: **${g.choices.length}**\n💗 Stability: **${g.stability}%**\n\nPick an ingredient. Its outcome is hidden until you choose it. The available choices reshuffle every turn.\n\n🎲 Secret recipes exist.\n\nChoose your next ingredient:`,cupcakeButtons(g.choices));}
async function birthdayCupcakeSkip(env,interaction){const state=await getGuildState(env,interaction.guild_id);const uid=getUserFromInteraction(interaction).id;const g=state.birthday?.games?.cupcakes?.[uid];if(!g?.active)return sendText(env,interaction,"🧁 Your cupcake tower is not active.");return sendText(env,interaction,`⏭️ **LAYER SKIPPED!**\n\n🧁 Layers: **${g.choices.length}** | Stability: **${g.stability}%**\n\nNo ingredient was used, no stability was changed, and the layer count did not increase. The choices have been reshuffled.`,cupcakeButtons(g.choices));}
async function birthdayCupcakePick(env,interaction,encoded){const state=await getGuildState(env,interaction.guild_id);const uid=getUserFromInteraction(interaction).id;const g=state.birthday?.games?.cupcakes?.[uid];if(!g?.active)return sendText(env,interaction,"🧁 Your cupcake tower is not active.");const ingredient=decodeURIComponent(encoded);if(String(ingredient).toLowerCase().includes("heart"))await markBingoAction(env,interaction.guild_id,uid,"black_heart");const info=BIRTHDAY_CUPCAKE_INGREDIENTS.find(x=>x[0]===ingredient);if(!info)return sendText(env,interaction,"❌ That ingredient disappeared into the pantry.");if(g.choices.includes(ingredient))return sendText(env,interaction,"🧁 You already used that ingredient in this tower.");g.choices.push(ingredient);g.steps++;const outcomes=["🎟️ Candy Bonus","💰 Sparkle Bonus","✨ Perfect Layer","🎂 Birthday Boost","🖤 Dark Magic","👻 Ghostly Surprise","🦇 Batty Bonus","🎀 Cute Combo","🌟 Rare Recipe","💥 Tower Wobble","🕸️ Sticky Mess","🎃 Pumpkin Luck","🧁 Perfect Cupcake","👻 Ghost Took It!","🖤 Cursed Layer","🌙 Midnight Magic"];const outcome=outcomes[randomInt(0,outcomes.length-1)];g.outcomes.push(outcome);if(["💥 Tower Wobble","🕸️ Sticky Mess","🖤 Cursed Layer","👻 Ghost Took It!"].includes(outcome))g.stability-=randomInt(10,28);else g.stability=Math.min(100,g.stability+randomInt(0,8));const matched=BIRTHDAY_SECRET_RECIPES.find(r=>r.need.length===g.choices.length&&r.need.every(n=>g.choices.includes(n)));if(matched){g.active=false;const p=await getPlayer(env,uid);p.birthdayCandies+=matched.reward;p.birthdayCollection=Array.isArray(p.birthdayCollection)?p.birthdayCollection:[];if(!p.birthdayCollection.includes("midnight_heart_cupcake"))p.birthdayCollection.push("midnight_heart_cupcake");await savePlayer(env,p);await saveGuildState(env,interaction.guild_id,state);await markBingoAction(env,interaction.guild_id,uid,"cupcake");await markBingoAction(env,interaction.guild_id,uid,"secret_recipe"); return sendText(env,interaction,`🌟🧁 **SECRET RECIPE DISCOVERED!**\n\n🖤 **${matched.name}**\n🎟️ **+${matched.reward} Birthday Candies!**\n✨ A permanent birthday collectible was added to your Birthday Collection.`);}if(g.stability<=0||g.steps>=8){g.active=false;const reward=randomInt(100,250);const p=await getPlayer(env,uid);p.birthdayCandies+=reward;await savePlayer(env,p);await saveGuildState(env,interaction.guild_id,state);await markBingoAction(env,interaction.guild_id,uid,"cupcake");return sendText(env,interaction,`🧁💥 **THE TOWER ${g.stability<=0?"WOBBLED INTO OBLIVION":"IS COMPLETE"}!**\n\nLast outcome: ${outcome}\n🎟️ You earned **${reward} Birthday Candies**.`);}await saveGuildState(env,interaction.guild_id,state);return sendText(env,interaction,`${outcome}!\n\n🧁 Layers: **${g.choices.length}** | Stability: **${g.stability}%**\n\nThe tower continues...`,cupcakeButtons(g.choices));}

const BIRTHDAY_CAKE_ASSETS = {
  bases: {"Black Velvet":"IMG_7540.png","Vanilla Mooncake":"IMG_7535.png","Strawberry":"IMG_7541.png","Pumpkin Spice":"IMG_7542.png","Cherry Night":"IMG_7543.png"},
  frostings: {"Black Velvet":"IMG_7545.png","Strawberry":"IMG_7550.png","Pumpkin":"IMG_7574.png","Ghost Vanilla":"IMG_7547.png","Purple":"IMG_7548.png","Red":"IMG_7549.png"},
  fillings: {"Strawberry Jam":"IMG_7551.png","Cherry Filling":"IMG_7552.png","Blackberry Jam":"IMG_7554.png","Chocolate Cream":"IMG_7555.png","Caramel Apple Filling":"IMG_7556.png"},
  toppings: {"Pink Bow":"IMG_7557.png","Ghost Marshmallow":"IMG_7558.png","Mini Pumpkin":"IMG_7559.png","Birthday Candles":"IMG_7560.png","Halloween Heart Sprinkles":"IMG_7561.png","Birthday Cake Sprinkles":"IMG_7562.png"},
  decorations: {"Glitter":"IMG_7563.png","Black Sprinkles":"IMG_7564.png","Pumpkin Decorations":"IMG_7565.png","Spiderweb Caramel":"IMG_7566.png","Birthday Confetti Decorations":"IMG_7567.png"},
  effects: {"Sparkle Aura":"IMG_7568.png","Moonlight Glow":"IMG_7569.png","Bat Swirl":"IMG_7570.png","Rainbow Birthday Glow":"IMG_7571.png","Pumpkin Smoke":"IMG_7572.png"}
};

async function renderBirthdayCake(env,name,choices){
  // Birthday cake rendering is intentionally done with the Worker's direct PNG
  // pipeline. Browser Rendering can hang/rate-limit, which previously made the
  // final Step 6 button appear to do nothing. The six cake assets are already
  // PNG layers, so they can be fetched from R2 and composited directly.
  const width=1000,height=760;
  const c=Array.isArray(choices)?choices:[];
  const base=c[0]||"Black Velvet", frosting=c[1]||"Strawberry", filling=c[2]||"Strawberry Jam", topping=c[3]||"Pink Bow", decor=c[4]||"Glitter", special=c[5]||"Sparkle Aura";
  const scene=solidRGBA(width,height,"#24162d");

  const layers=[
    [BIRTHDAY_CAKE_ASSETS.bases[base]||BIRTHDAY_CAKE_ASSETS.bases["Black Velvet"],760,620,120,70],
    [BIRTHDAY_CAKE_ASSETS.fillings[filling]||BIRTHDAY_CAKE_ASSETS.fillings["Strawberry Jam"],760,620,120,70],
    [BIRTHDAY_CAKE_ASSETS.frostings[frosting]||BIRTHDAY_CAKE_ASSETS.frostings["Strawberry"],760,620,120,70],
    [BIRTHDAY_CAKE_ASSETS.toppings[topping]||BIRTHDAY_CAKE_ASSETS.toppings["Pink Bow"],760,620,120,70],
    [BIRTHDAY_CAKE_ASSETS.decorations[decor]||BIRTHDAY_CAKE_ASSETS.decorations["Glitter"],760,620,120,70],
    [BIRTHDAY_CAKE_ASSETS.effects[special]||BIRTHDAY_CAKE_ASSETS.effects["Sparkle Aura"],760,620,120,70]
  ];

  for(const [filename,bw,bh,dx,dy] of layers){
    const asset=await getPngAsset(env,filename);
    const layer=containRGBA(asset,bw,bh);
    alphaComposite(scene,layer,dx+Math.round((bw-layer.width)/2),dy+Math.round((bh-layer.height)/2));
  }

  return rgbaToRgbPng(scene);
}

const BIRTHDAY_BAKERY_MENUS=[
  {name:"cake base",options:[["🖤 Black Velvet","Black Velvet"],["🌙 Vanilla Mooncake","Vanilla Mooncake"],["🍓 Strawberry","Strawberry"],["🎃 Pumpkin Spice","Pumpkin Spice"],["🍒 Cherry Night","Cherry Night"]]},
  {name:"frosting",options:[["🖤 Black Velvet Frosting","Black Velvet"],["💗 Strawberry Frosting","Strawberry"],["🎃 Pumpkin Frosting","Pumpkin"],["👻 Ghost Vanilla Frosting","Ghost Vanilla"],["💜 Purple Frosting","Purple"],["❤️ Red Frosting","Red"]]},
  {name:"filling",options:[["🍓 Strawberry Jam","Strawberry Jam"],["🍒 Cherry Filling","Cherry Filling"],["🫐 Blackberry Jam","Blackberry Jam"],["🍫 Chocolate Cream","Chocolate Cream"],["🍎 Caramel Apple Filling","Caramel Apple Filling"]]},
  {name:"topping",options:[["🎀 Pink Bow","Pink Bow"],["👻 Ghost Marshmallow","Ghost Marshmallow"],["🎃 Mini Pumpkin","Mini Pumpkin"],["🕯️ Birthday Candles","Birthday Candles"],["🖤💗 Halloween Heart Sprinkles","Halloween Heart Sprinkles"],["🎂✨ Birthday Cake Sprinkles","Birthday Cake Sprinkles"]]},
  {name:"decorations",options:[["✨ Glitter","Glitter"],["🖤 Black Sprinkles","Black Sprinkles"],["🎃 Pumpkin Decorations","Pumpkin Decorations"],["🕸️ Spiderweb Caramel","Spiderweb Caramel"],["🎉 Birthday Confetti Decorations","Birthday Confetti Decorations"]]},
  {name:"special effect",options:[["✨ Sparkle Aura","Sparkle Aura"],["🌙 Moonlight Glow","Moonlight Glow"],["🦇 Bat Swirl","Bat Swirl"],["🌈 Rainbow Birthday Glow","Rainbow Birthday Glow"],["🎃 Pumpkin Smoke","Pumpkin Smoke"]]}
];
function birthdayBakeryChoiceButtons(menu){
  const options=Array.isArray(menu?.options)?menu.options:[];
  const rows=[];
  for(let i=0;i<options.length;i+=5)rows.push(row(...options.slice(i,i+5).map(x=>button(x[0],`birthday:cakechoice:${encodeURIComponent(x[1])}`,1))));
  return rows.length?rows:[row(button("🎂 Birthday Menu","birthday:home",2))];
}
async function startBirthdayBakery(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Batty Cake Bakery is closed.");
  const people=state.birthday.birthdayIds||[];
  const uid=getUserFromInteraction(interaction).id;
  state.birthday.games=state.birthday.games||{};
  state.birthday.games.bakery={active:true,status:"choosing",userId:uid,recipient:people[0],step:0,choices:[]};
  await saveGuildState(env,interaction.guild_id,state);
  const menu=BIRTHDAY_BAKERY_MENUS[0];
  return sendText(env,interaction,`🦇🎂 **BATTY CAKE BAKERY**\n\nYou're designing a birthday cake for **${birthdayName(state)}**!\n\nChoose a **${menu.name}**:`,birthdayBakeryChoiceButtons(menu));
}
async function birthdayCakeChoice(env,interaction,value){
  const state=await getGuildState(env,interaction.guild_id);
  const uid=getUserFromInteraction(interaction).id;
  const g=state.birthday?.games?.bakery;
  if(!g?.active)return sendText(env,interaction,"🦇 The bakery session is closed.");
  const choice=decodeURIComponent(value);
  g.choices=Array.isArray(g.choices)?g.choices:[];
  g.choices.push(choice);
  g.step=Number(g.step||0)+1;

  if(g.step<BIRTHDAY_BAKERY_MENUS.length){
    await saveGuildState(env,interaction.guild_id,state);
    const menu=BIRTHDAY_BAKERY_MENUS[g.step];
    return sendText(env,interaction,`🎂 **Cake design step ${g.step+1}/${BIRTHDAY_BAKERY_MENUS.length}**\n\nChoose a **${menu.name}**:`,birthdayBakeryChoiceButtons(menu));
  }

  g.status="finalizing";
  // A cake render can take longer than Discord's interaction acknowledgement window.
  // Acknowledge the button immediately, then render and edit the original response.
  await deferInteraction(env,interaction,{update:true});
  const p=await getPlayer(env,uid);
  const bakeryReward=randomInt(100,250);
  p.birthdayCandies=(Number(p.birthdayCandies)||0)+bakeryReward;
  await savePlayer(env,p);
  await saveGuildState(env,interaction.guild_id,state);
  await markBingoAction(env,interaction.guild_id,uid,"bakery");
  await markBingoAction(env,interaction.guild_id,uid,"earn_candy");
  if(p.birthdayCandies>=100)await markBingoAction(env,interaction.guild_id,uid,"hundred_candy");

  let bytes;
  try{bytes=await renderBirthdayCake(env,birthdayName(state),g.choices);}
  catch(error){
    console.error("Birthday cake render failed:",error);
    g.active=false;g.status="completed";await saveGuildState(env,interaction.guild_id,state);
    return editOriginalResponse(env,interaction,{content:`🦇🎂 **BATTY CAKE BAKERY COMPLETE!**\n\n🎂 Cake for **${birthdayName(state)}**\n✨ Design: ${g.choices.join(" • ")}\n\n🎟️ You earned **${bakeryReward} Birthday Candies**!\n\n⚠️ The cake image renderer failed, but your cake design and reward were saved.`,components:[row(button("🎂 Birthday Menu","birthday:home",2))]});
  }

  const responseContent=`🦇🎂 **BATTY CAKE BAKERY COMPLETE!**\n\n🎂 Cake for **${birthdayName(state)}**\n✨ Design: ${g.choices.join(" • ")}\n\n🧁 The bakery declares it: **${["Sweet","Spooktacular","Wickedly Delicious","Birthday Royalty"][randomInt(0,3)]}!**\n🎟️ You earned **${bakeryReward} Birthday Candies**!\n\n🖼️ **Your finished cake is attached below!**`;
  const form=new FormData();
  form.append("payload_json",JSON.stringify({content:responseContent,attachments:[{id:0,filename:"birthday-cake.png"}],components:[row(button("🎂 Birthday Menu","birthday:home",2))]}));
  form.append("files[0]",new Blob([bytes],{type:"image/png"}),"birthday-cake.png");
  const response=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,{method:"PATCH",body:form});
  g.active=false;g.status="completed";g.completedAt=Date.now();await saveGuildState(env,interaction.guild_id,state);
  if(!response.ok){
    console.error("Birthday cake attachment failed:",response.status,await response.text());
    return sendText(env,interaction,responseContent+"\n\n⚠️ The cake image could not be attached, but your design and reward were saved.",[row(button("🎂 Birthday Menu","birthday:home",2))]);
  }
  return response;
}
async function handleBirthdayNameBingo(env,interaction){
  const state=await getGuildState(env,interaction.guild_id);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 The Birthday Party is not active today.");
  const uid=getUserFromInteraction(interaction).id;
  const target=getOption(interaction,"user");
  const birthdayIds=state.birthday?.birthdayIds||[];
  if(target&&(!birthdayIds.includes(target)))return sendText(env,interaction,"❌ That user is not today's birthday person.");
  await markBingoAction(env,interaction.guild_id,uid,"say_name");
  const name=target?`<@${target}>`:birthdayName(state);
  return sendText(env,interaction,`🎂✨ **Birthday shoutout!**\n\n${name} has been wished a spooky happy birthday!\n\n🎂 Your **Mention the birthday person's name** Bingo square has been checked if it is on your board.`);
}

async function birthdayWish(env,interaction){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Wish Ritual is closed.");const uid=getUserFromInteraction(interaction).id;if(!birthdayPersonId(state,uid))return sendText(env,interaction,"🕯️ Only the birthday person can perform the Birthday Wish Ritual.");const p=await getPlayer(env,uid);if(p.birthdayWishUsedDate===state.birthday.activeDate)return sendText(env,interaction,"🕯️ You've already performed your Birthday Wish Ritual today.");const roll=Math.random();let msg,reward;if(roll<0.05){p.sparkles+=10000;p.birthdayCandies+=500;msg="🌙✨ **JACKPOT!** 10,000 Sparkles + 500 Birthday Candies!";reward="jackpot";}else{const r=Math.floor(Math.random()*3);if(r===0){p.sparkles+=3000;msg="💰 **3,000 Sparkles!**";}else if(r===1){p.birthdayCandies+=300;msg="🎟️ **300 Birthday Candies!**";}else{p.sparkles+=3000;p.birthdayCandies+=300;msg="💰🎟️ **3,000 Sparkles + 300 Birthday Candies!**";}reward="normal";}p.birthdayWishUsedDate=state.birthday.activeDate;await savePlayer(env,p);await markBingoAction(env,interaction.guild_id,uid,"wish");if(msg.includes("Sparkles"))await markBingoAction(env,interaction.guild_id,uid,"receive_sparkles");return sendText(env,interaction,`🕯️🌙 **BIRTHDAY WISH RITUAL**\n\nThe candle flickers... moonlight gathers... ✨\n\n${msg}`);}

async function birthdayCannon(env,interaction){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Boo Cannon is closed.");const uid=getUserFromInteraction(interaction).id;if(!birthdayPersonId(state,uid))return sendText(env,interaction,"💥 Only the birthday person can fire the Birthday Boo Cannon.");if(state.birthday.cannon?.active)return sendText(env,interaction,"💥 Your Birthday Boo Cannon is already firing!");state.birthday.cannon={active:true,userId:uid,endAt:Date.now()+60000,total:0,shots:0};await saveGuildState(env,interaction.guild_id,state);await markBirthdayServerSquare(env,interaction.guild_id,"boo_cannon");return sendText(env,interaction,`💥🎃 **BIRTHDAY BOO CANNON!**\n\nYou have **60 seconds**! Press the button as many times as possible.\n\nEvery successful shot awards **1–10 Birthday Candies**.`,[row(button("💥 FIRE!","birthday:firecannon",1),button("🎂 Birthday Menu","birthday:home",2))]);}
async function fireBirthdayCannon(env,interaction){const state=await getGuildState(env,interaction.guild_id);const c=state.birthday?.cannon;const uid=getUserFromInteraction(interaction).id;if(!c?.active||c.userId!==uid)return sendText(env,interaction,"💥 The cannon isn't active for you.");if(Date.now()>=c.endAt){c.active=false;await saveGuildState(env,interaction.guild_id,state);return sendText(env,interaction,`💥🎃 **TIME'S UP!**\n\nYou fired **${c.shots} shots** and earned **${c.total} Birthday Candies!**`);}const amount=randomInt(1,10);c.shots++;c.total+=amount;const p=await getPlayer(env,uid);p.birthdayCandies+=amount;await savePlayer(env,p);await saveGuildState(env,interaction.guild_id,state);return sendText(env,interaction,`💥🎃 **BOOM! +${amount} Birthday Candies!**\n\n🎟️ Session total: **${c.total}**\n⏱️ Keep firing!`,[row(button("💥 FIRE AGAIN!","birthday:firecannon",1))]);}

function birthdayTricksterComponents(){return [{type:1,components:[{type:5,custom_id:"birthday:trickstertarget",placeholder:"🦝 Choose a player to prank...",min_values:1,max_values:1}]}];}

async function birthdayTrickster(env,interaction,targetOverride=null){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Trickster is closed.");const uid=getUserFromInteraction(interaction).id;const p=await getPlayer(env,uid);const now=Date.now();if(p.birthdayTricksterLast&&now-p.birthdayTricksterLast<3*60*60*1000)return sendText(env,interaction,`🦝 Trickster cooldown: **${Math.ceil((3*60*60*1000-(now-p.birthdayTricksterLast))/60000)} minutes** remaining.`);const target=targetOverride||getOption(interaction,"user")||interaction.data?.values?.[0];if(!target)return sendText(env,interaction,"🦝 **Birthday Trickster**\n\nChoose another player to prank!",birthdayTricksterComponents());if(target===uid)return sendText(env,interaction,"🦝 You can't trick yourself! Choose another player.",birthdayTricksterComponents());const tp=await getPlayer(env,target);p.birthdayTricksterLast=now;const outcomes=["candy","tax","bonk","bat","present","sparkle","web"];const out=outcomes[randomInt(0,outcomes.length-1)];const protectedSteal=["candy","tax","sparkle"].includes(out)&&birthdayPersonId(state,target);if(protectedSteal){p.birthdayCandies=Math.max(0,Number(p.birthdayCandies||0)-100);await savePlayer(env,p);await markBingoAction(env,interaction.guild_id,uid,"trickster");return sendText(env,interaction,"🚨🎂 **BIRTHDAY PROTECTION ACTIVATED!**\n\nYou targeted the birthday person with a stealing effect. Your attempt is wasted and you lose **100 Birthday Candies**. Their birthday rewards remain untouched.");}let msg="";if(out==="candy"){const a=randomInt(50,150);const a2=Math.min(a,Number(tp.birthdayCandies||0));tp.birthdayCandies-=a2;p.birthdayCandies+=a2;msg=`🎟️ Candy Heist! You stole **${a2} Birthday Candies**.`;}else if(out==="tax"){const a=randomInt(25,75);const a2=Math.min(a,Number(tp.birthdayCandies||0));tp.birthdayCandies-=a2;p.birthdayCandies+=a2;msg=`👻 Ghostly Tax! **${a2} Candies** transferred.`;}else if(out==="sparkle"){const a=randomInt(100,500);const a2=Math.min(a,Number(tp.sparkles||0));tp.sparkles-=a2;p.sparkles+=a2;msg=`✨ Sparkle Snatch! You stole **${a2} Sparkles**.`;}else if(out==="bat"){p.birthdayCandies+=50;msg="🦇 Bat Ambush! The target gets bats and you gain **50 Birthday Candies**.";}else if(out==="present"){p.birthdayCandies+=randomInt(10,30);msg="🎁 Present Swipe! A tiny gift mysteriously ended up in your pockets.";}else if(out==="web"){msg="🕸️ Webbed! The target has been covered in a temporary silly status.";}else{msg="🎃 Pumpkin Bonk! Harmless spooky birthday mischief!";}await savePlayer(env,p);await savePlayer(env,tp);await markBingoAction(env,interaction.guild_id,uid,"trickster");return sendText(env,interaction,`🦝🎂 **BIRTHDAY TRICKSTER!**\n\n${msg}`);}

function birthdayBossLobbyText(g){return `🦇🎂 **CURSED BIRTHDAY CAKE BOSS BATTLE LOBBY**\n\n👑 Host: <@${g.host}>\n👥 Players: **${g.players.length}/10**\n\n${g.players.length?g.players.map((id,i)=>`${i+1}. <@${id}>`).join("\n"):"No players yet."}\n\n🎂 Gather your party, then the host can start the battle!`}
function birthdayBossLobbyButtons(g){return [row(button("👥 Join Boss Battle","birthday:bossjoin",1,g.players.length>=10),button("▶️ Start Boss Battle","birthday:bossstart",1,g.players.length<2)),row(button("🚪 Leave Lobby","birthday:bossleave",2))];}
function birthdayBossText(g){const current=g.turn||g.players[Number(g.turnIndex)||0];return `🦇🎂⚔️ **CURSED BIRTHDAY CAKE BOSS BATTLE**\n\n🎂 Boss: **${g.bossName}**\n❤️ HP: **${g.hp}/${g.maxHp}**\n\n👥 Players: **${g.players.length}**\n👉 **Current Turn:** <@${current}>\n🔢 Round: **${g.round}**\n🎲 This battle was randomly generated. Boss attacks, events, weaknesses, and outcomes change every battle.\n\nChoose your action!`}
function birthdayBossButtons(g){return [row(button("⚔️ Attack","birthday:bossaction:attack",1),button("🛡️ Defend","birthday:bossaction:defend",1),button("🎀 Decorate","birthday:bossaction:decorate",1)),row(button("🕯️ Light Candle","birthday:bossaction:candle",1),button("🍰 Feed Cake","birthday:bossaction:feed",1),button("🦇 Bat Attack","birthday:bossaction:bat",1))];}
function createBirthdayBossGame(lobby){const bosses=[["Cursed Birthday Cake",500],["Haunted Pink Cake",650],["Midnight Monster Cake",800],["Pumpkin Doom Cake",700],["Batty Birthday Cake",900]];const b=bosses[randomInt(0,bosses.length-1)];const maxHp=b[1]+randomInt(-50,100);return {active:true,bossName:b[0],maxHp,hp:maxHp,players:[...lobby.players],round:0,turnIndex:0,turn:lobby.players[0],weakness:["attack","defend","decorate","candle","feed","bat"][randomInt(0,5)],lastEvent:""};}
async function startBirthdayBoss(env,interaction){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Boss Battle is closed.");state.birthday.games=state.birthday.games||{};const uid=getUserFromInteraction(interaction).id;const g=state.birthday.games.boss;if(g?.active)return sendPublicText(env,interaction,birthdayBossText(g),birthdayBossButtons(g));let lobby=state.birthday.games.bossLobby;if(lobby?.active)return sendPublicText(env,interaction,birthdayBossLobbyText(lobby),birthdayBossLobbyButtons(lobby));lobby={active:true,host:uid,players:[uid]};state.birthday.games.bossLobby=lobby;await saveGuildState(env,interaction.guild_id,state);return sendPublicText(env,interaction,birthdayBossLobbyText(lobby),birthdayBossLobbyButtons(lobby));}
async function birthdayBossJoin(env,interaction){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Boss Battle is closed.");const lobby=state.birthday?.games?.bossLobby;const uid=getUserFromInteraction(interaction).id;if(!lobby?.active)return sendText(env,interaction,"🎂 There is no Boss Battle lobby open right now.");if(lobby.players.includes(uid))return sendText(env,interaction,"🎂 You're already in the Boss Battle lobby!");if(lobby.players.length>=10)return sendText(env,interaction,"🎂 The Boss Battle lobby is full (10 players max).");lobby.players.push(uid);await saveGuildState(env,interaction.guild_id,state);await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:birthdayBossLobbyText(lobby),components:birthdayBossLobbyButtons(lobby)});}
async function birthdayBossLeave(env,interaction){const state=await getGuildState(env,interaction.guild_id);const lobby=state.birthday?.games?.bossLobby;const uid=getUserFromInteraction(interaction).id;if(!lobby?.active)return sendText(env,interaction,"🎂 There is no Boss Battle lobby open right now.");if(!lobby.players.includes(uid))return sendText(env,interaction,"❌ You're not in this Boss Battle lobby.");lobby.players=lobby.players.filter(id=>id!==uid);if(!lobby.players.length){delete state.birthday.games.bossLobby;await saveGuildState(env,interaction.guild_id,state);await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:"🎂 The Boss Battle lobby closed because everyone left.",components:[]});}if(lobby.host===uid)lobby.host=lobby.players[0];await saveGuildState(env,interaction.guild_id,state);await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:birthdayBossLobbyText(lobby),components:birthdayBossLobbyButtons(lobby)});}
async function birthdayBossStart(env,interaction){const state=await getGuildState(env,interaction.guild_id);if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 Birthday Boss Battle is closed.");const lobby=state.birthday?.games?.bossLobby;const uid=getUserFromInteraction(interaction).id;if(!lobby?.active)return sendText(env,interaction,"🎂 There is no Boss Battle lobby open right now.");if(lobby.host!==uid)return sendText(env,interaction,"👑 Only the lobby host can start the Boss Battle.");if(lobby.players.length<2)return sendText(env,interaction,"🎂 You need at least 2 players to start the Boss Battle.");const g=createBirthdayBossGame(lobby);state.birthday.games.boss=g;delete state.birthday.games.bossLobby;await saveGuildState(env,interaction.guild_id,state);await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:birthdayBossText(g),components:birthdayBossButtons(g)});}
async function birthdayBossAction(env,interaction,action){const state=await getGuildState(env,interaction.guild_id);const g=state.birthday?.games?.boss;const uid=getUserFromInteraction(interaction).id;if(!g?.active)return sendText(env,interaction,"🎂 The Boss Battle is over.");if(!g.players.includes(uid))return sendText(env,interaction,"❌ You're not a player in this Boss Battle.");const current=g.turn||g.players[Number(g.turnIndex)||0];if(current!==uid)return sendText(env,interaction,`⏳ It's <@${current}>'s turn! Wait for them to make their move.`);let damage=0,msg="";if(action===g.weakness){damage=randomInt(45,110);msg="✨ **WEAKNESS HIT!**";}else if(action==="attack"){damage=randomInt(15,65);msg="⚔️ Direct hit!";}else if(action==="defend"){damage=randomInt(5,35);msg="🛡️ Defensive counter!";}else if(action==="decorate"){damage=randomInt(10,50);msg="🎀 The cake hates the decorations!";}else if(action==="candle"){damage=randomInt(20,70);msg="🕯️ The candles flare with birthday magic!";}else if(action==="feed"){damage=randomInt(5,40);msg="🍰 Feeding the boss somehow made it weaker.";}else{damage=randomInt(25,85);msg="🦇 BATS ATTACK!";}g.hp=Math.max(0,g.hp-damage);g.round++;const events=["👻 Ghost phase!","🎃 Pumpkin explosion!","🦇 Bat swarm!","🕯️ Candle curse!","✨ Birthday sparkle surge!","🎂 The cake changes form!"];g.lastEvent=events[randomInt(0,events.length-1)];if(g.hp<=0){g.active=false;const participants=[...new Set(g.players)];for(const id of participants){const p=await getPlayer(env,id);p.birthdayCandies+=randomInt(100,300);await savePlayer(env,p);}const fin=await getPlayer(env,uid);fin.birthdayCollection=Array.isArray(fin.birthdayCollection)?fin.birthdayCollection:[];fin.birthdayCollection.push("cursed_birthday_cake");await savePlayer(env,fin);await saveGuildState(env,interaction.guild_id,state);await markBingoAction(env,interaction.guild_id,uid,"boss_win");await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:`🎂💥 **THE CURSED BIRTHDAY CAKE HAS BEEN DEFEATED!**\n\n${msg}\n${g.lastEvent}\n\n🏆 Every participant earned **100–300 Birthday Candies**.\n🦇 <@${uid}> dealt the final blow and received the permanent **Cursed Birthday Cake** collectible!`,components:[]});}g.turnIndex=(Number(g.turnIndex)||0)+1;if(g.turnIndex>=g.players.length)g.turnIndex=0;g.turn=g.players[g.turnIndex];await saveGuildState(env,interaction.guild_id,state);await deferInteraction(env,interaction,{update:true});return editOriginalResponse(env,interaction,{content:`${msg}\n${g.lastEvent}\n\n${birthdayBossText(g)}`,components:birthdayBossButtons(g)});}

async function forceBirthdayServerEvent(env,interaction){
  if(!(await requireOwner(env,interaction)))return;
  const action=getOption(interaction,"event");
  const labels={
    pumpkin_appears:"🎃 **A Pumpkin Appears!** 🎃",
    ghost_appears:"👻 **A Ghost Appears!** 👻",
    bat_swarm:"🦇 **A Bat Swarm Appears!** 🦇"
  };
  if(!labels[action])return sendText(env,interaction,"❌ Choose **pumpkin**, **ghost**, or **bats**.");
  const guildId=interaction.guild_id;
  if(!guildId)return sendText(env,interaction,"❌ Birthday server events can only be forced inside a server.");
  const state=await getGuildState(env,guildId);
  if(!birthdayEventActive(state))return sendText(env,interaction,"🔒 The Birthday Party is not active.");
  await markBirthdayServerSquare(env,guildId,action);
  const latest=await getGuildState(env,guildId);
  const channel=latest.announcementChannelId||(await getGuildTextChannels(env,guildId))[0]?.id;
  if(channel)await sendChannelMessage(env,channel,labels[action]);
  return sendText(env,interaction,`🧪 **Birthday server event forced:** ${action}\n\nThe event announcement was sent and the matching server Bingo square was marked.`);
}

async function processBirthdayEvent(env){const guildIds=await getKnownGuildIds(env);for(const guildId of guildIds){try{const {state,people}=await ensureBirthdayEvent(env,guildId);const key=birthdayTodayKey();if(!people.length){if(state.birthday?.activeDate===key&&state.birthday.active){state.birthday.active=false;state.birthday.huntItems=[];state.birthday.games={};await saveGuildState(env,guildId,state);}continue;}if(!state.birthday.announced){const channel=state.announcementChannelId||(await getGuildTextChannels(env,guildId))[0]?.id;if(channel)await sendChannelMessage(env,channel,birthdayMainText(state,people),birthdayMenuComponents(true));state.birthday.announced=true;await saveGuildState(env,guildId,state);}if(!state.birthday.nextFrightHuntAt||Date.now()>=state.birthday.nextFrightHuntAt)await spawnBirthdayHunt(env,guildId);if(!state.birthday.serverEvents.pumpkin_appears&&Math.random()<0.12){state.birthday.serverEvents.pumpkin_appears=true;await markBirthdayServerSquare(env,guildId,"pumpkin_appears");const channel=state.announcementChannelId||(await getGuildTextChannels(env,guildId))[0]?.id;if(channel)await sendChannelMessage(env,channel,"🎃 **A Pumpkin Appears!** 🎃");}if(!state.birthday.serverEvents.ghost_appears&&Math.random()<0.12){state.birthday.serverEvents.ghost_appears=true;await markBirthdayServerSquare(env,guildId,"ghost_appears");const channel=state.announcementChannelId||(await getGuildTextChannels(env,guildId))[0]?.id;if(channel)await sendChannelMessage(env,channel,"👻 **A Ghost Appears!** 👻");}if(!state.birthday.serverEvents.bat_swarm&&Math.random()<0.12){state.birthday.serverEvents.bat_swarm=true;await markBirthdayServerSquare(env,guildId,"bat_swarm");const channel=state.announcementChannelId||(await getGuildTextChannels(env,guildId))[0]?.id;if(channel)await sendChannelMessage(env,channel,"🦇 **A Bat Swarm Appears!** 🦇");}await saveGuildState(env,guildId,state);}catch(error){console.error(`Birthday event processing failed for guild ${guildId}:`,error);}}}

async function expireBirthdayEventState(env){const key=birthdayTodayKey();for(const guildId of await getKnownGuildIds(env)){const state=await getGuildState(env,guildId);if(state.birthday?.active&&state.birthday.activeDate!==key){state.birthday.active=false;state.birthday.huntItems=[];state.birthday.games={};state.birthday.bingoBoards={};await saveGuildState(env,guildId,state);}}}

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

  await refreshPunishmentState(env, player);
  if (Number(player.courtTreeConfiscationUntil || 0) > Date.now()) {
    return sendText(env, interaction, `🌳❌ **YOUR TREE HAS BEEN CONFISCATED BY THE COURTS.**\n\nThe raccoons have taken custody of your tree for **${punishmentTimeText(player.courtTreeConfiscationUntil)}** more.\n\n🦝 Please do not attempt to negotiate with the Court.`);
  }

  cleanSparkles(
    player
  );

  if (!player.sparklesOnTree.length) {
    maybeSpawnSparkles(player);
  }

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
   THE EXPERIMENT — REUSABLE CHAOTIC EXPERIMENT ENGINE
   20 experiments, partial evidence, secret roles, one-use powers,
   public shared results, and deliberately imperfect information.
========================================================= */
const EXPERIMENT_MIN_PLAYERS = 3;
const EXPERIMENT_MAX_PLAYERS = 10;
const EXPERIMENT_XP_WIN = 100;
const EXPERIMENT_XP_LOSS = 50;
const EXPERIMENT_XP_TIE = 25;

const EXPERIMENT_CATALOG = [
  {id:"001",name:"Three Doors",emoji:"🚪",theme:"A sealed chamber contains three doors. One is safe."},
  {id:"002",name:"The Saboteur",emoji:"🕵️",theme:"Someone has a secret objective, but the group still has to identify the correct choice."},
  {id:"003",name:"Missing Memory",emoji:"🧠",theme:"Fragments of a missing memory point toward one correct reconstruction."},
  {id:"004",name:"Countdown",emoji:"⏳",theme:"A countdown is running and the group must choose the correct emergency protocol."},
  {id:"005",name:"The Liar",emoji:"🤥",theme:"A strange collection of statements hides one answer the evidence supports."},
  {id:"006",name:"Split Decision",emoji:"⚖️",theme:"Different players receive different pieces of evidence and must combine them."},
  {id:"007",name:"Impossible Choice",emoji:"🌀",theme:"Three tempting outcomes conceal one option supported by the evidence."},
  {id:"008",name:"The Locked Room",emoji:"🔐",theme:"A locked room has three possible release mechanisms."},
  {id:"009",name:"The Signal",emoji:"📡",theme:"A mysterious signal contains a pattern that points to one channel."},
  {id:"010",name:"The Auction",emoji:"💰",theme:"Three mysterious lots are offered; evidence identifies the genuine objective."},
  {id:"011",name:"The Witnesses",emoji:"👁️",theme:"Witness fragments must be compared to find the supported conclusion."},
  {id:"012",name:"The Maze",emoji:"🗺️",theme:"Three routes through a shifting maze are possible; clues eliminate the bad routes."},
  {id:"013",name:"The Code",emoji:"🔢",theme:"Three code keys are displayed; private hints narrow down the valid key."},
  {id:"014",name:"The Disappearance",emoji:"🔎",theme:"Evidence from a strange disappearance points to one location."},
  {id:"015",name:"The Infection",emoji:"🧪",theme:"A lab alarm reports three containment protocols; evidence identifies the correct one."},
  {id:"016",name:"The Switchboard",emoji:"☎️",theme:"Three lines are ringing. Private signals identify which line should be answered."},
  {id:"017",name:"The Impostor Experiment",emoji:"🎭",theme:"Someone may be hiding information, while the group must still solve the evidence puzzle."},
  {id:"018",name:"The Time Loop",emoji:"🔄",theme:"Three timeline branches exist; fragments reveal which branch is stable."},
  {id:"019",name:"The Paradox",emoji:"♾️",theme:"A bizarre logic puzzle presents three resolutions; evidence eliminates two."},
  {id:"020",name:"The Final Experiment",emoji:"👁️",theme:"A multi-stage laboratory test asks the group to trust evidence without knowing the whole protocol."}
];

const EXPERIMENT_TWISTS = [
  {id:"redacted",name:"📄 REDACTED FILE",text:"One word in everyone's public briefing has been blacked out. Your private clue is still intact."},
  {id:"alarm",name:"🚨 FALSE ALARM",text:"The facility briefly announces an emergency. The rules have NOT changed, but someone may panic."},
  {id:"echo",name:"📡 ECHO SIGNAL",text:"A mysterious signal repeats one of the answer labels. It is atmospheric noise, not a clue."},
  {id:"clock",name:"⏰ FROZEN CLOCK",text:"The countdown display has frozen. There is no automatic timeout; discussion continues."},
  {id:"observer",name:"👁️ THE OBSERVER",text:"One randomly selected player is secretly watched. They receive no extra answer information."},
  {id:"swap",name:"🔀 FILE MIX-UP",text:"Two players receive differently worded versions of their true clues. The underlying information remains consistent."},
  {id:"glitch",name:"💻 SYSTEM GLITCH",text:"The public display briefly flickers with nonsense symbols. Ignore them."},
  {id:"second_signal",name:"✨ SECOND SIGNAL",text:"The system reveals a tiny extra hint: one randomly chosen dangerous option is definitely unsafe."},
  {id:"temptation",name:"💎 TEMPTATION",text:"One player privately receives a bonus offer: if the group succeeds, they receive an extra reward."},
  {id:"silence",name:"🤫 SILENCE PROTOCOL",text:"For dramatic reasons, one player's clue is unusually short. It is still truthful."}
];

const EXPERIMENT_FLAVORS = [
  "The fluorescent lights flicker as the chamber wakes up.",
  "A printer spits out a fresh evidence packet with nobody's name on it.",
  "Somewhere behind the wall, a machine starts humming.",
  "The intercom whispers a number and then goes silent.",
  "A monitor displays a countdown that immediately disappears.",
  "A locked drawer clicks once from inside the room.",
  "The experimenter's notes contain a coffee stain over the most important sentence.",
  "A warning light turns on for exactly three seconds.",
  "A speaker announces: 'Participants are encouraged to trust evidence, not vibes.'",
  "The room goes completely quiet. Then one tiny green light turns on."
];

const EXPERIMENT_DOOR_COLORS = ["rose","aqua","violet","gold","mint","coral"];
const EXPERIMENT_DOOR_SHAPES = ["moon","star","diamond","heart","bolt","flower"];
const EXPERIMENT_ROLE_DEFS = [
  {id:"analyst",label:"🧠 Analyst",text:"You can inspect one door and receive a cautious system reading."},
  {id:"skeptic",label:"🧐 Skeptic",text:"You can audit another player's clue and learn whether it is consistent with the hidden truth."},
  {id:"archivist",label:"📚 Archivist",text:"You can request a second evidence fragment that rules out one dangerous door."},
  {id:"observer",label:"👁️ Observer",text:"You can secretly check whether one random other player is the Saboteur."},
  {id:"wildcard",label:"🎲 Wildcard",text:"You can discard your clue and receive a fresh clue of a different type."},
  {id:"cipher",label:"🔐 Cipher",text:"You can decode a hidden attribute of the safe door."},
  {id:"oracle",label:"🔮 Oracle",text:"You can ask for a deliberately uncertain prediction about the safe door."},
  {id:"interrogator",label:"🗣️ Interrogator",text:"You can obtain a private summary of one other player's evidence."},
  {id:"forensic",label:"🔎 Forensic",text:"You can compare two doors and learn whether one of them is the safe door."},
  {id:"guardian",label:"🛡️ Guardian",text:"You can reserve a tie-break door. If the final vote ties, your reserved door decides the outcome."},
  {id:"trickster",label:"🃏 Trickster",text:"You can inject one clearly marked false system signal into the public display to cause chaos."},
  {id:"saboteur",label:"🕵️ Saboteur",text:"Your clue is corrupted. You can also inject one false public signal without revealing yourself."}
];

function experimentGameId() { return `exp-${Date.now()}-${Math.random().toString(36).slice(2,9)}`; }
function experimentPlayers(game) { return Object.values(game?.players || {}); }
function experimentDef(game) { return EXPERIMENT_CATALOG.find(x=>x.id===game?.experimentId) || EXPERIMENT_CATALOG[0]; }
function experimentDoorLabel(door) { return door === "A" ? "🚪 A" : door === "B" ? "🚪 B" : "🚪 C"; }
function experimentRandomChoice() { return ["A","B","C"][randomInt(0,2)]; }
function experimentOtherPlayers(game,userId){ return experimentPlayers(game).filter(p=>p.id!==userId); }
function experimentRoleDef(roleId){ return EXPERIMENT_ROLE_DEFS.find(r=>r.id===roleId)||EXPERIMENT_ROLE_DEFS[0]; }

function experimentDoorLine(game,door){
  const d=game.doors?.[door]||{};
  return `${experimentDoorLabel(door)} — ${d.color||"unknown"} • ${d.shape||"unknown"} • number ${d.number??"?"}`;
}
function experimentDoorSummary(game){ return ["A","B","C"].map(d=>experimentDoorLine(game,d)).join("\n"); }
function experimentLobbyText(game) {
  const def=experimentDef(game), players=experimentPlayers(game);
  return [`🧪 **THE EXPERIMENT — ${def.emoji} EXPERIMENT ${def.id}: ${def.name.toUpperCase()}**`,"",def.theme,"",`👑 Host: <@${game.hostId}>`,`👥 Players: **${players.length}/${EXPERIMENT_MAX_PLAYERS}**`,"",players.length?players.map((p,i)=>`${i+1}. <@${p.id}>`).join("\n"):"Nobody has joined yet.","",players.length>=EXPERIMENT_MIN_PLAYERS?"✨ Enough players! The host can start the experiment.":`⏳ Need at least **${EXPERIMENT_MIN_PLAYERS} players** to begin.`,"","🎲 The exact scenario, evidence, wording, roles, twist, and answer will be randomized when the experiment starts.","🔐 Nobody gets the whole picture. Trust is optional.","🛑 The host or bot owner can end this lobby if everyone falls asleep."] .join("\n");
}
function experimentLobbyComponents(game) {
  const rows=[row(button("🧪 Join Experiment",`experiment:join:${game.id}`,1),button("🚪 Leave",`experiment:leave:${game.id}`,2),button("👁️ Status",`experiment:status:${game.id}`,3))];
  if(game.hostId) rows.push(row(button("▶️ Start Experiment",`experiment:start:${game.id}`,1)));
  rows.push(row(button("🛑 End Experiment",`experiment:end:${game.id}`,4)));
  return rows;
}
function experimentActionComponents(game) {
  return [
    row(button("🅰️ Option A",`experiment:vote:${game.id}:A`,1),button("🅱️ Option B",`experiment:vote:${game.id}:B`,1),button("©️ Option C",`experiment:vote:${game.id}:C`,1)),
    row(button("🔐 View My Clue",`experiment:clue:${game.id}`,2),button("🎭 Use Role Power",`experiment:role:${game.id}`,1)),
    row(button("🛑 End Experiment",`experiment:end:${game.id}`,4))
  ];
}
function experimentChoiceCounts(game) { const counts={A:0,B:0,C:0}; for(const p of experimentPlayers(game)){if(p.vote&&counts[p.vote]!==undefined)counts[p.vote]++;} return counts; }

function experimentBuildDoors(safeDoor){
  const colors=shuffleArray([...EXPERIMENT_DOOR_COLORS]).slice(0,3),shapes=shuffleArray([...EXPERIMENT_DOOR_SHAPES]).slice(0,3),nums=shuffleArray([1,2,3,4,5,6,7,8,9]).slice(0,3);
  const doors={}; ["A","B","C"].forEach((d,i)=>doors[d]={color:colors[i],shape:shapes[i],number:nums[i]});
  return doors;
}
function experimentTruthClue(game){
  const safe=game.safeDoor,d=game.doors[safe],otherDoors=["A","B","C"].filter(x=>x!==safe),type=randomInt(0,7);
  if(type===0)return `My file says the safe door has the **${d.color}** signal.`;
  if(type===1)return `The safe door carries the **${d.shape}** symbol.`;
  if(type===2)return `The safe door's number is **${d.number%2===0?"even":"odd"}**.`;
  if(type===3)return `The safe door's number is **${d.number>=5?"5 or higher":"below 5"}**.`;
  if(type===4){const bad=otherDoors[randomInt(0,1)];return `I can rule out **Option ${bad}**.`;}
  if(type===5){const bad=otherDoors[randomInt(0,1)];return `The **${game.doors[bad].color}** signal is a false lead.`;}
  if(type===6){const bad=otherDoors[randomInt(0,1)];return `The **${game.doors[bad].shape}** symbol does not belong to the safe door.`;}
  const candidates=shuffleArray([safe,...otherDoors]).slice(0,2); return `The safe door is one of **${candidates[0]} or ${candidates[1]}**.`;
}
function experimentSaboteurClue(game){
  const bad=["A","B","C"].filter(d=>d!==game.safeDoor),fake=bad[randomInt(0,bad.length-1)],d=game.doors[fake];
  return `CORRUPTED FILE: The **${d.color}** signal points to the safe door.`;
}
function experimentAssignRoles(game){
  const players=shuffleArray(experimentPlayers(game));
  const saboteur=EXPERIMENT_ROLE_DEFS.find(r=>r.id==="saboteur");
  const others=shuffleArray(EXPERIMENT_ROLE_DEFS.filter(r=>r.id!=="saboteur"));
  const defs=shuffleArray([saboteur,...others.slice(0,Math.max(0,players.length-1))]);
  players.forEach((p,i)=>{p.secret={...defs[i]};p.powerUsed=false;p.roleResult="";});
  game.saboteurId=players.find(p=>p.secret.id==="saboteur")?.id||null;
}
function experimentApplyTwist(game) {
  const twist=EXPERIMENT_TWISTS[randomInt(0,EXPERIMENT_TWISTS.length-1)]; game.twist={...twist};
  const players=experimentPlayers(game);
  if(twist.id==="second_signal"){const dangerous=["A","B","C"].filter(d=>d!==game.safeDoor);game.extraHint=dangerous[randomInt(0,dangerous.length-1)];}
  if(twist.id==="temptation"&&players.length){const target=players[randomInt(0,players.length-1)];target.bonusOffer=true;}
  if(twist.id==="observer"&&players.length){const target=players[randomInt(0,players.length-1)];target.watched=true;}
}
function experimentStartText(game) {
  const def=experimentDef(game),players=experimentPlayers(game);
  return [`🧪 **EXPERIMENT ${def.id} — ${def.emoji} ${def.name.toUpperCase()} HAS BEGUN**`,"",def.theme,"",`✨ ${game.flavor}`,"",`🌀 **TWIST: ${game.twist.name}**`,game.twist.text,game.extraHint?`\n📡 **EXTRA SIGNAL:** One dangerous option is confirmed unsafe: **${game.extraHint}**.`:"","","🚪 **THE THREE OPTIONS**",experimentDoorSummary(game),"","🔐 **PRIVATE INFORMATION**","Everyone receives a partial clue and one unique role. Some information may be misleading.","","💬 **DISCUSS**","Share what you choose. You do not have to reveal your clue.","",`👥 Players: **${players.length}**`,`🎲 Scenario seed: **${game.scenarioTag}**`,`🧪 Experiment: **${def.name}**`,"","When everyone is ready, lock a private choice. The majority decides the door. Role powers can change what you know—or what everyone sees."].join("\n");
}
function experimentPublicText(game,extra="") {
  const def=experimentDef(game),counts=experimentChoiceCounts(game),players=experimentPlayers(game),voted=players.filter(p=>p.vote).length;
  return [`🧪 **THE EXPERIMENT — ${def.emoji} ${def.name.toUpperCase()}**`,"",def.theme,"",`🌀 **Twist:** ${game.twist?.name||"Unknown"}`,"🔐 Partial clues and secret role powers are active. Combine information carefully.","","🚪 **OPTIONS**",experimentDoorSummary(game),"",`🗳️ Votes locked: **${voted}/${players.length}**`,`🅰️ A: **${counts.A}** • 🅱️ B: **${counts.B}** • ©️ C: **${counts.C}**`,game.publicSignal?`\n📢 **SYSTEM SIGNAL:** ${game.publicSignal}`:"",extra||"⏳ Discussion is open. Lock your choice when ready."].join("\n");
}
function experimentOutcomeText(game,chosenDoor) {
  const def=experimentDef(game),counts=experimentChoiceCounts(game),players=experimentPlayers(game),safe=game.safeDoor;
  const max=Math.max(counts.A,counts.B,counts.C),leaders=["A","B","C"].filter(d=>counts[d]===max);let finalDoor=chosenDoor;
  if(leaders.length>1&&game.tieBreaker&&leaders.includes(game.tieBreaker))finalDoor=game.tieBreaker;
  const tie=leaders.length>1&&!game.tieBreaker,correct=finalDoor===safe;
  let headline,body,reward;
  if(tie){headline="⚠️ THE EXPERIMENT REJECTED THE DECISION";body="The group tied, and no Guardian tie-break was reserved. The protocol refuses to open a tied choice.";reward=`✨ Every participant earns **${EXPERIMENT_XP_TIE} Experiment XP** for completing the experiment.`;}
  else if(correct){headline="🟢 THE EXPERIMENT SUCCEEDED";body=`The group chose ${experimentDoorLabel(finalDoor)} — and the hidden answer was ${experimentDoorLabel(safe)}.`;reward=`✨ Every participant earns **${EXPERIMENT_XP_WIN} Experiment XP** and **100 Sparkles**.`;}
  else{headline="🔴 THE EXPERIMENT FAILED";body=`The group chose ${experimentDoorLabel(finalDoor)}, but the hidden answer was ${experimentDoorLabel(safe)}.`;reward=`✨ Every participant earns **${EXPERIMENT_XP_LOSS} Experiment XP** for surviving the experiment.`;}
  const individual=players.map(p=>`• <@${p.id}> — ${p.vote?experimentDoorLabel(p.vote):"No vote"}`).join("\n");
  const secrets=players.map(p=>`• <@${p.id}> — ${p.secret?.label||"Participant"}${p.bonusOffer?" 💎":""}`).join("\n");
  return [`🧪 **EXPERIMENT ${def.id} — ${def.name.toUpperCase()} RESULTS**`,"",`**${headline}**`,"",body,"",`🌀 **TWIST:** ${game.twist?.name||"None"}`,game.twist?.text||"",game.tieBreaker?`🛡️ **GUARDIAN TIE-BREAK:** ${experimentDoorLabel(game.tieBreaker)}`:"","","🗳️ **FINAL VOTE**",`🅰️ A: **${counts.A}** • 🅱️ B: **${counts.B}** • ©️ C: **${counts.C}**`,"",`🔎 **THE ANSWER WAS ${experimentDoorLabel(safe)}**`,"", "👥 **PLAYER CHOICES**",individual,"","🎭 **ROLES REVEALED**",secrets,"",reward].join("\n");
}
async function experimentPrivateClue(env,interaction,gameId){
  if(!interaction.guild_id)return sendEphemeralFollowup(env,interaction,"❌ The Experiment can only be played inside a server.");
  const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Experiment is no longer active.");
  const p=user&&game.players?.[user.id]; if(!p)return sendEphemeralFollowup(env,interaction,"❌ You are not a player in this Experiment.");
  return sendEphemeralFollowup(env,interaction,`🔐 **YOUR PRIVATE EXPERIMENT FILE**\n\n🧩 **Clue:** ${p.clue}\n\n🎭 **Role:** ${p.secret?.label||"Participant"}\n${p.secret?.text||"Use your evidence carefully."}${p.bonusOffer?"\n\n💎 **PRIVATE BONUS:** If the group succeeds, you receive an extra 50 Sparkles.":""}${p.roleResult?`\n\n📌 **ROLE INTEL:** ${p.roleResult}`:""}\n\n🤫 This information is private. Share only what you choose to share.`);
}
async function experimentSendClues(env,game){for(const p of experimentPlayers(game)){p.dmDelivered=await sendUserDM(env,p.id,`🧪 **THE EXPERIMENT — YOUR PRIVATE FILE**\n\n**${experimentDef(game).name}**\n\n🔐 **Clue:** ${p.clue}\n\n🎭 **Role:** ${p.secret?.label||"Participant"}\n${p.secret?.text||"Use your evidence carefully."}${p.bonusOffer?"\n\n💎 **PRIVATE BONUS:** If the group succeeds, you receive an extra 50 Sparkles.":""}\n\n🤫 Keep this private unless you decide to share it.`);}}
async function experimentRewardPlayers(env,game,outcome){const players=experimentPlayers(game),xp=outcome==="success"?EXPERIMENT_XP_WIN:outcome==="tie"?EXPERIMENT_XP_TIE:EXPERIMENT_XP_LOSS;for(const p of players){const player=await getPlayer(env,p.id);player.experimentGames=Number(player.experimentGames||0)+1;player.experimentCompleted=Number(player.experimentCompleted||0)+1;player.experimentXP=Number(player.experimentXP||0)+xp;if(outcome==="success")player.experimentSuccesses=Number(player.experimentSuccesses||0)+1;if(outcome==="success")player.sparkles=Number(player.sparkles||0)+100;if(outcome==="success"&&p.bonusOffer)player.sparkles=Number(player.sparkles||0)+50;await savePlayer(env,player,p.id);}}
async function experimentEditPublic(env,game,data){
  if(!game?.messageId||!game?.channelId){
    console.error("experimentEditPublic: missing public message reference",{messageId:game?.messageId||null,channelId:game?.channelId||null,gameId:game?.id||null});
    return false;
  }
  const r=await fetch(`https://discord.com/api/v10/channels/${game.channelId}/messages/${game.messageId}`,{method:"PATCH",headers:{"Authorization":`Bot ${env.BOT_TOKEN}`,"Content-Type":"application/json"},body:JSON.stringify(data)});
  if(!r.ok)console.error("experimentEditPublic failed",r.status,await r.text());
  return r.ok;
}

async function experimentCaptureOriginalMessage(env,interaction,game){
  try{
    // Webhook-token endpoints are authenticated by the application token in the URL.
    // Do not add the bot Authorization header here; doing so can make the original-message
    // lookup fail, leaving messageId empty and causing every later public update to miss.
    const r=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`);
    if(!r.ok){console.error("experimentCaptureOriginalMessage failed",r.status,await r.text());return false;}
    const m=await r.json();
    if(!m?.id){console.error("experimentCaptureOriginalMessage: original response had no message id");return false;}
    game.messageId=String(m.id);
    game.channelId=String(interaction.channel_id||m.channel_id||"");
    return true;
  }catch(e){console.error("experimentCaptureOriginalMessage",e);return false;}
}

async function experimentSendPublicInitial(env,interaction,content,components){return fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:4,data:{content,components}})});}
async function experimentFinish(env,interaction,game,chosenDoor){const state=await getGuildState(env,interaction.guild_id),latest=state.experiment;if(!latest||latest.id!==game.id)return;const counts=experimentChoiceCounts(latest),max=Math.max(counts.A,counts.B,counts.C),leaders=["A","B","C"].filter(d=>counts[d]===max),resolved=leaders.length===1?leaders[0]:leaders[0];latest.status="finished";latest.chosenDoor=chosenDoor;latest.finishedAt=Date.now();latest.outcome=leaders.length>1&&!latest.tieBreaker?"tie":(resolved===latest.safeDoor?"success":"failure");await experimentRewardPlayers(env,latest,latest.outcome);const result=experimentOutcomeText(latest,chosenDoor);state.experiment=null;await saveGuildState(env,interaction.guild_id,state);await experimentEditPublic(env,latest,{content:result,components:[]});return sendEphemeralFollowup(env,interaction,"🧪 The shared Experiment board has been updated for everyone. Your vote was locked.");}
async function experimentRolePowerMenu(env,interaction,gameId){const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Experiment is no longer active.");const p=user&&game.players?.[user.id];if(!p)return sendEphemeralFollowup(env,interaction,"❌ You are not a player in this Experiment.");if(p.powerUsed)return sendEphemeralFollowup(env,interaction,"🎭 Your role power has already been used this Experiment.");const r=p.secret?.id;if(r==="guardian")return sendEphemeralFollowup(env,interaction,"🛡️ **Guardian Power**\nChoose the door you want to reserve as the tie-break.",[row(button("A",`experiment:rolepick:${game.id}:guardian:A`,1),button("B",`experiment:rolepick:${game.id}:guardian:B`,1),button("C",`experiment:rolepick:${game.id}:guardian:C`,1))]);if(r==="analyst")return sendEphemeralFollowup(env,interaction,"🧠 **Analyst Power**\nChoose one door to inspect.",[row(button("Inspect A",`experiment:rolepick:${game.id}:analyst:A`,1),button("Inspect B",`experiment:rolepick:${game.id}:analyst:B`,1),button("Inspect C",`experiment:rolepick:${game.id}:analyst:C`,1))]);return handleExperimentRolePower(env,interaction,gameId,null);}
async function handleExperimentRolePower(env,interaction,gameId,pick){const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Experiment is no longer active.");const p=user&&game.players?.[user.id];if(!p)return sendEphemeralFollowup(env,interaction,"❌ You are not a player in this Experiment.");if(p.powerUsed)return sendEphemeralFollowup(env,interaction,"🎭 Your role power has already been used.");const role=p.secret?.id,others=experimentOtherPlayers(game,user.id);let msg="";
  if(role==="analyst"){const door=pick||experimentRandomChoice();const safe=door===game.safeDoor;msg=`You inspected ${experimentDoorLabel(door)}. System confidence: **${safe?"PROMISING":"RISKY"}**. This is a cautious reading, not a guarantee.`;}
  else if(role==="skeptic"){if(!others.length)return sendEphemeralFollowup(env,interaction,"❌ No other player is available to audit.");const t=others[randomInt(0,others.length-1)];const truthful=!t.secret||t.secret.id!=="saboteur";msg=`You audited <@${t.id}>. Their current clue is **${truthful?"consistent":"corrupted"}** with the hidden experiment data.`;}
  else if(role==="archivist"){const bad=["A","B","C"].filter(d=>d!==game.safeDoor)[randomInt(0,1)];msg=`📚 Archive fragment: **Option ${bad} is definitely unsafe.** Keep this private if you want the group to stay uncertain.`;}
  else if(role==="observer"){if(!others.length)return sendEphemeralFollowup(env,interaction,"❌ No other player is available to observe.");const t=others[randomInt(0,others.length-1)];msg=`You observed <@${t.id}>. Saboteur check: **${t.id===game.saboteurId?"YES — they are the Saboteur.":"NO — they are not the Saboteur."}**`}
  else if(role==="wildcard"){p.clue=experimentTruthClue(game);msg=`🎲 Your clue was rerolled. **New private clue:** ${p.clue}`;}
  else if(role==="cipher"){const d=game.doors[game.safeDoor];msg=`🔐 Decoded attribute: the safe door has the **${d.shape}** symbol.`;}
  else if(role==="oracle"){const prediction=Math.random()<0.60?game.safeDoor:["A","B","C"].filter(d=>d!==game.safeDoor)[randomInt(0,1)];msg=`🔮 Oracle prediction: **${experimentDoorLabel(prediction)}** is most likely safe. Confidence is intentionally uncertain (**60%** system reliability).`}
  else if(role==="interrogator"){if(!others.length)return sendEphemeralFollowup(env,interaction,"❌ No other player is available to interrogate.");const t=others[randomInt(0,others.length-1)];msg=`🗣️ Evidence summary for <@${t.id}>: their clue references **${t.clue.match(/\*\*(.*?)\*\*/)?.[1]||"a hidden attribute"}**. You do not receive their full file.`;}
  else if(role==="forensic"){const pair=shuffleArray(["A","B","C"]).slice(0,2),containsSafe=pair.includes(game.safeDoor);msg=`🔎 Forensic comparison: among ${experimentDoorLabel(pair[0])} and ${experimentDoorLabel(pair[1])}, **${containsSafe?"exactly one is the safe door":"neither is the safe door"}**.`;}
  else if(role==="guardian"){const door=pick||experimentRandomChoice();game.tieBreaker=door;msg=`🛡️ You reserved ${experimentDoorLabel(door)} as your tie-break. If the final vote ties, this door will be used.`;}
  else if(role==="trickster"||role==="saboteur"){const bad=["A","B","C"].filter(d=>d!==game.safeDoor)[randomInt(0,1)];game.publicSignal=`⚠️ A corrupted signal claims **${experimentDoorLabel(bad)}** looks safe. Do NOT treat this as verified evidence.`;msg=`🃏 You injected a false public signal pointing toward ${experimentDoorLabel(bad)}. Nobody is told who caused it.`;}
  else msg="Your role power produced no usable signal.";
  p.powerUsed=true;p.roleResult=msg;await saveGuildState(env,interaction.guild_id,state);if(game.messageId)await experimentEditPublic(env,game,{content:experimentPublicText(game),components:experimentActionComponents(game)});return sendEphemeralFollowup(env,interaction,`🎭 **${p.secret?.label||"Role Power"}**\n\n${msg}`);}

async function handleExperimentCreate(env,interaction){if(await checkGamePunishment(env,interaction))return;if(!interaction.guild_id)return sendText(env,interaction,"❌ The Experiment can only be played inside a server.");const user=getUserFromInteraction(interaction);if(!user)return;const state=await getGuildState(env,interaction.guild_id);if(state.experiment&&state.experiment.status!=="finished")return sendText(env,interaction,"🧪 There is already an active Experiment in this server. End the old lobby/game first, or use its 🛑 End Experiment button.");const player=await getPlayer(env,user.id);updatePlayerIdentity(player,interaction);await savePlayer(env,player,user.id);const game={id:experimentGameId(),hostId:user.id,status:"lobby",createdAt:Date.now(),experimentId:EXPERIMENT_CATALOG[randomInt(0,EXPERIMENT_CATALOG.length-1)].id,channelId:interaction.channel_id,messageId:null,players:{[user.id]:{id:user.id,username:user.username||"",displayName:getDisplayName(player),vote:null,clue:"",dmDelivered:false}}};state.experiment=game;await saveGuildState(env,interaction.guild_id,state);const response=await sendText(env,interaction,experimentLobbyText(game),experimentLobbyComponents(game));if(!response.ok){console.error("experiment create response failed",response.status);return response;}const captured=await experimentCaptureOriginalMessage(env,interaction,game);if(!captured)console.error("Experiment lobby created but public message ID could not be captured; future lobby updates may fail.");await saveGuildState(env,interaction.guild_id,state);return response;}
async function handleExperimentJoin(env,interaction,gameId){if(await checkGamePunishment(env,interaction))return;const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId||game.status!=="lobby")return sendText(env,interaction,"❌ That Experiment lobby is no longer open.");if(!user)return;if(game.players?.[user.id])return sendText(env,interaction,"🧪 You're already in this Experiment!");if(experimentPlayers(game).length>=EXPERIMENT_MAX_PLAYERS)return sendText(env,interaction,"❌ This Experiment is full (10 players max).");const player=await getPlayer(env,user.id);updatePlayerIdentity(player,interaction);await savePlayer(env,player,user.id);game.players[user.id]={id:user.id,username:user.username||"",displayName:getDisplayName(player),vote:null,clue:"",dmDelivered:false};await saveGuildState(env,interaction.guild_id,state);await experimentEditPublic(env,game,{content:experimentLobbyText(game),components:experimentLobbyComponents(game)});return sendEphemeralFollowup(env,interaction,"🧪 You joined the Experiment lobby!");}
async function handleExperimentEnd(env,interaction,gameId){const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId)return sendText(env,interaction,"❌ That Experiment no longer exists.");if(!user|| (user.id!==game.hostId && user.id!==env.OWNER_ID))return sendText(env,interaction,"❌ Only the Experiment host or bot owner can end this Experiment.");state.experiment=null;await saveGuildState(env,interaction.guild_id,state);const wasLobby=game.status==="lobby";await experimentEditPublic(env,game,{content:wasLobby?"🧹 The Experiment lobby was ended. You can now create a new Experiment.":"🛑 The active Experiment was ended. No Experiment rewards were issued.",components:[]});return sendEphemeralFollowup(env,interaction,wasLobby?"🧹 Abandoned Experiment lobby cleared.":"🛑 Experiment ended. No rewards were issued.");}
async function handleExperimentLeave(env,interaction,gameId){const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId)return sendText(env,interaction,"❌ That Experiment no longer exists.");if(!user||!game.players?.[user.id])return sendText(env,interaction,"❌ You're not in this Experiment.");if(game.status!=="lobby")return sendText(env,interaction,"❌ The Experiment has already started; you cannot leave during the experiment.");delete game.players[user.id];const remaining=experimentPlayers(game);if(!remaining.length){state.experiment=null;await saveGuildState(env,interaction.guild_id,state);await experimentEditPublic(env,game,{content:"🧪 The Experiment lobby closed because everyone left.",components:[]});return sendEphemeralFollowup(env,interaction,"🧹 Lobby closed.");}if(game.hostId===user.id)game.hostId=remaining[0].id;await saveGuildState(env,interaction.guild_id,state);await experimentEditPublic(env,game,{content:experimentLobbyText(game),components:experimentLobbyComponents(game)});return sendEphemeralFollowup(env,interaction,"🚪 You left the Experiment lobby.");}
async function handleExperimentStart(env,interaction,gameId){if(await checkGamePunishment(env,interaction))return;const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId||game.status!=="lobby")return sendText(env,interaction,"❌ That Experiment lobby is no longer available.");if(!user||user.id!==game.hostId)return sendText(env,interaction,"❌ Only the Experiment host can start it.");const players=experimentPlayers(game);if(players.length<EXPERIMENT_MIN_PLAYERS)return sendText(env,interaction,`❌ You need at least **${EXPERIMENT_MIN_PLAYERS} players** to start.`);game.safeDoor=experimentRandomChoice();game.doors=experimentBuildDoors(game.safeDoor);game.scenarioTag=Math.random().toString(36).slice(2,8).toUpperCase();game.flavor=EXPERIMENT_FLAVORS[randomInt(0,EXPERIMENT_FLAVORS.length-1)];players.forEach(p=>{p.clue=experimentTruthClue(game);p.vote=null;p.dmDelivered=false;p.bonusOffer=false;p.powerUsed=false;p.roleResult="";});experimentAssignRoles(game);const sab=game.players[game.saboteurId];if(sab)sab.clue=experimentSaboteurClue(game);experimentApplyTwist(game);game.status="playing";game.phase="discussion";game.startedAt=Date.now();await saveGuildState(env,interaction.guild_id,state);await experimentSendClues(env,game);await saveGuildState(env,interaction.guild_id,state);await experimentEditPublic(env,game,{content:experimentStartText(game),components:experimentActionComponents(game)});return sendEphemeralFollowup(env,interaction,"🧪 The Experiment has started. Your private file has been sent.");}
async function handleExperimentVote(env,interaction,gameId,door){if(await checkGamePunishment(env,interaction))return;const state=await getGuildState(env,interaction.guild_id),game=state.experiment,user=getUserFromInteraction(interaction);if(!game||game.id!==gameId||game.status!=="playing")return sendText(env,interaction,"❌ That Experiment is no longer accepting votes.");if(!user||!game.players?.[user.id])return sendText(env,interaction,"❌ You are not a player in this Experiment.");if(!["A","B","C"].includes(door))return sendText(env,interaction,"❌ Invalid option.");if(game.players[user.id].vote)return sendEphemeralFollowup(env,interaction,`🔒 Your choice is already locked on **Option ${game.players[user.id].vote}**.`);game.players[user.id].vote=door;game.players[user.id].votedAt=Date.now();const total=experimentPlayers(game).length,voted=experimentPlayers(game).filter(p=>p.vote).length;await saveGuildState(env,interaction.guild_id,state);if(voted>=total){const counts=experimentChoiceCounts(game),max=Math.max(counts.A,counts.B,counts.C),leaders=["A","B","C"].filter(d=>counts[d]===max),chosen=leaders[0];return experimentFinish(env,interaction,game,chosen);}await experimentEditPublic(env,game,{content:experimentPublicText(game,`🗳️ **${voted}/${total}** votes locked.`),components:experimentActionComponents(game)});return sendEphemeralFollowup(env,interaction,`🔒 **Choice locked:** ${experimentDoorLabel(door)}\n\nYour choice is private. **${voted}/${total}** players have voted.`);}
async function handleExperimentStatus(env,interaction,gameId){const state=await getGuildState(env,interaction.guild_id),game=state.experiment;if(!game||game.id!==gameId)return sendText(env,interaction,"❌ That Experiment no longer exists.");if(game.status==="lobby")return sendEphemeralFollowup(env,interaction,experimentLobbyText(game),experimentLobbyComponents(game));const counts=experimentChoiceCounts(game),voted=experimentPlayers(game).filter(p=>p.vote).length;return sendEphemeralFollowup(env,interaction,experimentPublicText(game,`🗳️ **${voted}/${experimentPlayers(game).length}** votes locked.`),experimentActionComponents(game));}
async function handleExperimentCommand(env,interaction){const sub=interaction.data?.options?.find(o=>o.type===1)?.name||"create";if(sub==="create")return handleExperimentCreate(env,interaction);const state=await getGuildState(env,interaction.guild_id),game=state.experiment;if(sub==="status"){if(!game)return sendText(env,interaction,"🧪 There is no active Experiment right now. Use `/experiment create` to start one.");return handleExperimentStatus(env,interaction,game.id);}if(sub==="leave"){if(!game)return sendText(env,interaction,"🧪 There is no active Experiment right now.");return handleExperimentLeave(env,interaction,game.id);}if(sub==="end"){if(!game)return sendText(env,interaction,"🧪 There is no active Experiment right now.");return handleExperimentEnd(env,interaction,game.id);}if(sub==="start"){if(!game)return sendText(env,interaction,"🧪 There is no Experiment lobby right now.");return handleExperimentStart(env,interaction,game.id);}if(sub==="join"){if(!game)return sendText(env,interaction,"🧪 There is no Experiment lobby right now.");return handleExperimentJoin(env,interaction,game.id);}return handleExperimentCreate(env,interaction);}

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

  if (interaction.type === 3 && id.startsWith("news:ok:")) return handleNewsComponent(env, interaction, id.split(":")[2]);

  if(interaction.type===3&&id==="birthday:curseinput")return showBirthdayCurseModal(env,interaction);
  if(interaction.type===5&&id==="birthday:cursemodal"){
    const answer=getModalTextInput(interaction,"answer");
    return birthdayCurseAnswer(env,interaction,answer);
  }

  if (id.startsWith("birthday:")) {
    const parts=id.split(":"); const action=parts[1];
    if(action==="home") return handleBirthdayCommand(env,interaction);
    if(action==="set") return handleBirthdaySet(env,interaction);
    if(action==="shop") return showBirthdayShop(env,interaction,Number(parts[2]||0));
    if(action==="buy") return buyBirthdayItem(env,interaction,parts[2]);
    if(action==="hunt") return handleBirthdayHunt(env,interaction);
    if(action==="claim") return claimBirthdayHunt(env,interaction,parts[2]);
    if(action==="bingo") return startBirthdayBingo(env,interaction);
    if(action==="roulette") return startBirthdayRoulette(env,interaction);
    if(action==="roulettejoin") return birthdayRouletteJoin(env,interaction);
    if(action==="roulettestart") return birthdayRouletteStart(env,interaction);
    if(action==="rouletteleave") return birthdayRouletteLeave(env,interaction);
    if(action==="roulettepick") return birthdayRoulettePick(env,interaction,parts[2]);
    if(action==="curse") return startBirthdayCurse(env,interaction);
    if(action==="cupcake") return startBirthdayCupcake(env,interaction);
    if(action==="cupcakepick") return birthdayCupcakePick(env,interaction,parts.slice(2).join(":"));
    if(action==="cupcakeskip") return birthdayCupcakeSkip(env,interaction);
    if(action==="bakery") return startBirthdayBakery(env,interaction);
    if(action==="cakechoice") return birthdayCakeChoice(env,interaction,parts.slice(2).join(":"));
    if(action==="wish") return birthdayWish(env,interaction);
    if(action==="cannon") return birthdayCannon(env,interaction);
    if(action==="firecannon") return fireBirthdayCannon(env,interaction);
    if(action==="trickster") return birthdayTrickster(env,interaction);
    if(action==="trickstertarget") return birthdayTrickster(env,interaction,interaction.data?.values?.[0]);
    if(action==="collection") return showBirthdayCollection(env,interaction);
    if(action==="gifts") return showBirthdayGifts(env,interaction);
    if(action==="open") return openBirthdayGift(env,interaction,parts.slice(2).join(":"));
    if(action==="boss") return startBirthdayBoss(env,interaction);
    if(action==="bossjoin") return birthdayBossJoin(env,interaction);
    if(action==="bossstart") return birthdayBossStart(env,interaction);
    if(action==="bossleave") return birthdayBossLeave(env,interaction);
    if(action==="bossaction") return birthdayBossAction(env,interaction,parts[2]);
    return;
  }

  if (id.startsWith("surprise_alert:")) {
    const choice = id.split(":")[1];
    if (choice === "kill" || choice === "no_kill") {
      await handleSurpriseAlertChoice(env, interaction, choice);
    }
    return;
  }

  if (id.startsWith("experiment:")) {
    const parts=id.split(":");
    const action=parts[1];
    const gameId=parts[2];
    if(action==="join") { await handleExperimentJoin(env,interaction,gameId); return; }
    if(action==="leave") { await handleExperimentLeave(env,interaction,gameId); return; }
    if(action==="end") { await handleExperimentEnd(env,interaction,gameId); return; }
    if(action==="start") { await handleExperimentStart(env,interaction,gameId); return; }
    if(action==="status") { await handleExperimentStatus(env,interaction,gameId); return; }
    if(action==="clue") { await experimentPrivateClue(env,interaction,gameId); return; }
    if(action==="role") { await experimentRolePowerMenu(env,interaction,gameId); return; }
    if(action==="rolepick") { await handleExperimentRolePower(env,interaction,gameId,parts[3]); return; }
    if(action==="vote") { await handleExperimentVote(env,interaction,gameId,parts[3]); return; }
    return;
  }

  if (id.startsWith("battle:")) {
    const parts=id.split(":"); const action=parts[1]; const gameId=parts[2];
    if(action==="attack"||action==="defend"||action==="special") { await handleBattleAction(env,interaction,action,gameId); return; }
    if(action==="items") { await handleBattleItems(env,interaction,gameId); return; }
    if(action==="forfeit") { await handleBattleForfeit(env,interaction,gameId); return; }
    if(action==="back") { const game=await getBattleGame(env,interaction.guild_id,gameId); if(game) await sendText(env,interaction,battleText(game),battleComponents(game)); return; }
    return;
  }

  if (id.startsWith("battleitem:")) {
    const parts=id.split(":"); await useBattleItem(env,interaction,parts[1],parts[2]); return;
  }

  if (id.startsWith("bshop:")) {
    const parts=id.split(":"); if(parts[1]==="buy") await handleBattleShopBuy(env,interaction,parts[2]); return;
  }

  if (id.startsWith("pastel:")) {
    const parts=id.split(":"); const action=parts[1];
    if(action==="palette") { await handlePastelPalette(env,interaction,parts[2]||"menu",parts[3]||""); return; }
    if(action==="mode") { await handlePastelMode(env,interaction,parts[2]); return; }
    if(action==="resume") { await handlePastelResume(env,interaction,parts[2]); return; }
    if(action==="refresh") { await handlePastelRefresh(env,interaction,parts[2]); return; }
    if(action==="join") { await handlePastelJoin(env,interaction,parts[2]); return; }
    if(action==="cancel") { await handlePastelCancel(env,interaction,parts[2]); return; }
    if(action==="choose") { await handlePastelChoose(env,interaction,parts[2],parts[3]); return; }
    if(action==="quit") { await handlePastelQuit(env,interaction,parts[2]); return; }
    if(action==="endvote") { await handlePastelEndVote(env,interaction,parts[2]); return; }
    if(action==="rules") { await handlePastelRules(env,interaction); return; }
    return;
  }

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
    if (action === "battle") { await sendText(env,interaction,"🌳⚔️ **Tree Battle**\n\nUse `/battle @player` to challenge another tree."); return; }
    if (action === "colorchaos") { await handlePastelStart(env,interaction); return; }
    if (action === "experiment") {
      const state = await getGuildState(env, interaction.guild_id);
      if (state.experiment) return handleExperimentStatus(env, interaction, state.experiment.id);
      return handleExperimentCreate(env, interaction);
    }
    return;
  }

  if (id.startsWith("solo:")) {
    const parts = id.split(":");
    if (parts[1] === "start") { await handleSoloStart(env, interaction); return; }
    if (parts[1] === "choice") { await handleSoloChoice(env, interaction, parts[2]); return; }
    if (parts[1] === "abort") { await handleSoloAbort(env, interaction); return; }
    return;
  }

  if (id === "delete:confirm") { await handleDeleteConfirm(env,interaction); return; }
  if (id === "delete:cancel") { await handleDeleteCancel(env,interaction); return; }

  if (id.startsWith("nameeffect:")) {
    const parts=id.split(":");
    if(parts[1]==="list"){await handleNameEffectList(env,interaction); return;}
    if(parts[1]==="equip"){await handleNameEffectEquip(env,interaction,parts[2]);return;}
    if(parts[1]==="page"){const page=Number(parts[2]||0);const data=await buildTitlesResponseData(env,interaction,"effects",page);await editOriginalResponse(env,interaction,titleEditData(data));return;}
  }

  if (id.startsWith("regular_set:")) {
    await showRegularSet(env,interaction,id.slice("regular_set:".length)); return;
  }

  if (id.startsWith("title:")) {
    const parts = id.split(":");
    if (parts[1] === "list") { await handleTitleList(env, interaction); return; }
    if (parts[1] === "home") { const data=await buildTitlesResponseData(env,interaction,"home",0); await editOriginalResponse(env,interaction,data); return; }
    if (parts[1] === "page") { const data=await buildTitlesResponseData(env,interaction,"titles",Number(parts[2]||0)); await editOriginalResponse(env,interaction,titleEditData(data)); return; }
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

  if (id === "inventory") {
    await showInventory(env, interaction);
    return;
  }

  if (id.startsWith("inventory:")) {
    const parts = id.split(":");
    const category = parts[1];
    const page = Number(parts[2] || 0);
    await showInventoryCategory(env, interaction, category, page);
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

  if (id === "shop_animated_effects") {
    await showAnimatedEffectShop(env, interaction, 1);
    return;
  }

  if (id.startsWith("shop_animated_effects:")) {
    const pagePart = id.slice("shop_animated_effects:".length);
    if (pagePart !== "current") {
      const page = Number(pagePart);
      if (Number.isInteger(page) && page >= 1 && page <= 3) {
        await showAnimatedEffectShop(env, interaction, page);
        return;
      }
    }
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

  // Limited Shop set navigation. The set buttons are generated with
  // custom IDs like `limited_set:ocean_opal`, so route every set through
  // the same handler instead of falling through to "Unknown button".
  if (id.startsWith("limited_set:")) {
    const setId = id.slice("limited_set:".length);
    await showLimitedSet(env, interaction, setId);
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

    buy_petal_storm_animated:
      "petal_storm_animated_effect",

    buy_butterfly_garden_animated:
      "butterfly_garden_animated_effect",

    buy_rainbow_trail_animated:
      "rainbow_trail_animated_effect",

    buy_ember_glow_animated:
      "ember_glow_animated_effect",

    buy_meteor_shower_animated:
      "meteor_shower_animated_effect",

    buy_cosmic_rift_animated:
      "cosmic_rift_animated_effect",

    buy_fairy_flight_animated:
      "fairy_flight_animated_effect",

    buy_crystal_aura_animated:
      "crystal_aura_animated_effect",

    buy_starfall_animated:
      "starfall_animated_effect",

    buy_unicorn_sparkle_animated:
      "unicorn_sparkle_animated_effect",

    buy_snowfall_animated:
      "snowfall_animated_effect",

    buy_flower_bloom_animated:
      "flower_bloom_animated_effect",

    buy_bubble_pop_animated:
      "bubble_pop_animated_effect",

    buy_candy_storm_animated:
      "candy_storm_animated_effect",

    buy_kitty_parade_animated:
      "kitty_parade_animated_effect",

    buy_electric_storm_animated:
      "electric_storm_animated_effect",

    buy_experimental_effect_animated:
      "experimental_effect_animated_effect",

    buy_candy_effect:
      "candy_effect",

    buy_halloween_effect:
      "halloween_effect",

    buy_raccoon_thief:
      "raccoon_thief_decoration",

    buy_frank_frog:
      "frank_frog_decoration",

    buy_duck_hat_boots:
      "duck_hat_boots_decoration",

    buy_cheddar_falls:
      "cheddar_falls_decoration",

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
      "green_glow_effect",

    buy_prism_flutter_tree:
      "prism_flutter_tree",

    buy_prism_flutter_background:
      "prism_flutter_background",

    buy_prism_flutter_effect:
      "prism_flutter_effect",

    buy_lavender_twilight_tree:
      "lavender_twilight_tree",

    buy_lavender_twilight_background:
      "lavender_twilight_background",

    buy_lavender_twilight_effect:
      "lavender_twilight_effect",

    buy_world_of_flags_tree:
      "world_of_flags_tree",

    buy_world_of_flags_background:
      "world_of_flags_background",

    buy_world_of_flags_effect:
      "world_of_flags_effect",

    buy_ocean_opal_tree:
      "ocean_opal_tree",

    buy_ocean_opal_background:
      "ocean_opal_background",

    buy_ocean_opal_effect:
      "ocean_opal_effect"
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

  if (id.startsWith("custom_trees_page_")) {
    const pageText = id.replace("custom_trees_page_", "");
    if (pageText !== "current") {
      await showCustomTrees(env, interaction, Number(pageText));
    }
    return;
  }

  if (
    id === "custom_trees"
  ) {
    await showCustomTrees(
      env,
      interaction,
      0
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

  if (id.startsWith("custom_effects_page_")) {
    const pageText = id.replace("custom_effects_page_", "");
    if (pageText !== "current") {
      await showCustomEffects(env, interaction, Number(pageText));
    }
    return;
  }

  if (
    id === "custom_effects"
  ) {
    await showCustomEffects(
      env,
      interaction,
      0
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

async function islandPublicUpdate(env, interaction, content, components=[], game=null) {
  /* Prefer the saved public channel message. This lets scheduled timers update the
     real island message even though there is no button interaction token available. */
  if (game?.channelId && game?.messageId) {
    let response=await discordRequest(env,`/channels/${game.channelId}/messages/${game.messageId}`,{
      method:"PATCH",
      body:JSON.stringify({content,components})
    });
    if (response.ok) return response;

    /* If the old message was deleted, recreate it instead of leaving the island
       stuck with a dead/missing board. */
    console.error("Chaos Island saved message update failed:", response.status, await response.text());
    if (response.status===404) {
      const created=await sendChannelMessage(env,game.channelId,content,components);
      if (created?.id) {
        game.messageId=created.id;
        try { await islandSave(env,game); } catch(error) { console.error("Chaos Island message-id save failed:",error); }
        return new Response(null,{status:200});
      }
    }
    return response;
  }

  /* Compatibility fallback for older island games that have no saved message ID. */
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
  if (await checkGamePunishment(env, interaction)) return;

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
  const player=await getPlayer(env, user.id);
  const game={
    id:`island-${Date.now()}-${user.id}`,
    guildId:interaction.guild_id,
    channelId:interaction.channel_id,
    messageId:null,
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
  if (await checkGamePunishment(env, interaction)) return;
  if (!interaction.guild_id) return sendText(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env, interaction.guild_id);
  const game=state.island;
  if (!game || game.status !== "lobby") return sendText(env, interaction, "❌ There isn't an open Chaos Island lobby right now.");
  const user=getUserFromInteraction(interaction);
  const player=await getPlayer(env, user.id);
  if (game.players[user.id]) return sendText(env, interaction, "🏝️ You're already on the island!", islandLobbyComponents(game));
  if (Object.keys(game.players).length >= ISLAND_MAX_PLAYERS) return sendText(env, interaction, "❌ The island is full! 10 players maximum.");
  game.players[user.id]={id:user.id,username:user.username,displayName:user.global_name || user.username,hearts:3,alive:true,choice:null,points:0,sparklesEarned:0,equippedTitle:player.equippedTitle || ""};
  const joiningPunishment = await refreshPunishmentState(env, player);
  
  await islandSave(env, game);
  await acknowledge(env, interaction);
  await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game), game);
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
    await islandPublicUpdate(env, interaction, "🏝️ **CHAOS ISLAND LOBBY CLOSED**\n\nEveryone left the island.", [], game);
    return;
  }
  await islandSave(env, game);
  await acknowledge(env, interaction);
  await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game), game);
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
    await islandPublicUpdate(env, interaction, islandLobbyText(game), islandLobbyComponents(game), game);
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
  /* Fetch the public interaction response so future button presses and scheduled
     timers can edit the same channel message reliably. */
  try {
    const original=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,{headers:{Authorization:`Bot ${env.BOT_TOKEN}`}});
    if (original.ok) {
      const data=await original.json();
      if (data?.id) { game.messageId=data.id; await islandSave(env,game); }
    }
  } catch(error) { console.error("Chaos Island message ID capture failed:",error); }
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
      if (winners.some(w=>w.id===p.id)) { player.chaosIslandWins = Number(player.chaosIslandWins || 0) + 1; if (!player.titles.includes("island_champion")) player.titles.push("island_champion"); }
      await savePlayer(env,player);
    }
    const finalLines=Object.values(game.players).sort((a,b)=>Number(b.points||0)-Number(a.points||0)).map(p=>`• <@${p.id}> — ${p.alive?"❤️ Survived":"💀 Eliminated"} — **${p.points} pts** — **${p.finalReward || 0} ✨ earned**`).join("\n");
    const winnerText=winners.map(w=>`🏆 <@${w.id}> — **${maxPoints} points**`).join("\n");
    const content=`🏝️ **CHAOS ISLAND IS OVER!**\n\n${resultLines.join("\n\n")}\n\n🏆 **WINNER${winners.length===1?"":"S"}**\n${winnerText}\n\n🎁 Survivors received **${ISLAND_SURVIVOR_REWARD} ✨**.\n🏆 Winners received an extra **${ISLAND_WINNER_REWARD} ✨**.\n\n📊 **FINAL STANDINGS**\n${finalLines}\n\n🦝 The island has been returned to the raccoons.`;
    const state=await getGuildState(env,game.guildId);
    if (state.island?.id===game.id) { state.island=null; await saveGuildState(env,game.guildId,state); }
    if (interaction) await islandPublicUpdate(env,interaction,content,[],game);
    return;
  }
  game.round++;
  const scenario=islandPickScenario(game);
  game.phaseEndsAt=Date.now()+ISLAND_ROUND_TIMEOUT;
  await islandSave(env,game);
  if (interaction) await islandPublicUpdate(env,interaction,`${resultLines.join("\n\n")}\n\n${islandGameText(game,scenario,game.currentVersion)}`,islandChoiceRows(game,scenario),game);
}

async function handleIslandChoice(env, interaction, choiceIndex) {
  /* Acknowledge the button immediately. Cloudflare/KV work can otherwise make Discord
     mark the interaction as failed before the island can update its message. */
  await deferInteraction(env, interaction, {update:true});
  if (!interaction.guild_id) return sendEphemeralFollowup(env, interaction, "❌ Chaos Island is server-only.");
  const state=await getGuildState(env,interaction.guild_id);
  const game=state.island;
  if (!game || game.status!=="playing") return sendEphemeralFollowup(env,interaction,"❌ There isn't an active Chaos Island round.");
  /* Self-heal if the scheduled trigger was delayed or not configured: any island
     interaction after the round deadline resolves the expired round first. */
  if (Number(game.phaseEndsAt||0)>0 && Date.now()>=Number(game.phaseEndsAt||0)) {
    await resolveChaosIslandRound(env,game,null,true);
    const refreshed=await getGuildState(env,interaction.guild_id);
    const current=refreshed.island;
    if (!current || current.status!=="playing") return sendEphemeralFollowup(env,interaction,"🏝️ That Chaos Island round just ended. Start a new game to keep playing!");
    return sendEphemeralFollowup(env,interaction,"⏰ That Chaos Island round timed out, so the island resolved it automatically. The next round is ready!");
  }
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
    await resolveChaosIslandRound(env,game,interaction,false);
    return;
  }
  await islandSave(env,game);
  const scenario=getIslandCurrentScenario(game);
  await islandPublicUpdate(env,interaction,islandGameText(game,scenario,game.currentVersion),islandChoiceRows(game,scenario),game);
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
      if (game.status!=="ended" && refreshed.island?.id===game.id) {
        refreshed.island=game;
        await saveGuildState(env,guildId,refreshed);
        const currentScenario=getIslandCurrentScenario(game);
        if (currentScenario) await islandPublicUpdate(env,null,islandGameText(game,currentScenario,game.currentVersion),islandChoiceRows(game,currentScenario),game);
      }
    } catch(error) { console.error(`Chaos Island timer failed for guild ${guildId}:`,error); }
  }
}

/* =========================================================
   SOLO MISSION
   SINGLE-PLAYER CHAOTIC STRATEGY GAME
========================================================= */

const SOLO_MISSION_ROUNDS = 10;
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
  },

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

  {
    title: "The Locked Bakery",
    prompt: "🥐 A bakery is closed, but a note on the door says: 'ONE PERSON MAY ENTER. PLEASE DO NOT ASK WHY.'",
    choices: [
      { label: "🥐 Knock politely", cash: 250, heat: -5, score: 350, message: "🥐 The baker opens the door and gives you a mystery pastry." },
      { label: "🔐 Inspect the lock", cash: 450, heat: 20, score: 550, risky: true, message: "🔐 You notice a hidden delivery hatch and collect an abandoned tip jar." },
      { label: "🍰 Leave a nice note", cash: 100, heat: -15, score: 220, message: "🍰 The baker later finds your note and sends you a thank-you box." },
      { label: "🦝 Send the raccoon", cash: 650, heat: 35, score: 750, risky: true, message: "🦝 The raccoon returns carrying an entire cake. Nobody asks questions." }
    ]
  },
  {
    title: "The Four-Way Elevator",
    prompt: "🛗 An elevator has four buttons: UP, DOWN, SECRET, and 'ABSOLUTELY NOT.'",
    choices: [
      { label: "⬆️ UP", cash: 350, heat: 5, score: 450, message: "⬆️ You arrive at a rooftop lounge with a generous tip jar." },
      { label: "⬇️ DOWN", cash: 200, heat: -10, score: 300, message: "⬇️ You find a forgotten storage room full of coupons." },
      { label: "✨ SECRET", cash: 850, heat: 30, score: 950, risky: true, message: "✨ The secret floor contains a tiny sparkle vault." },
      { label: "🚫 ABSOLUTELY NOT", cash: 500, heat: 45, health: -1, score: 700, risky: true, message: "🚫 Naturally, you pressed it. The elevator plays a dramatic fanfare." }
    ]
  },
  {
    title: "The Mystery Package Counter",
    prompt: "📦 A counter holds four unclaimed packages. Each has a completely different warning label.",
    choices: [
      { label: "🎁 'Probably Fine'", cash: 300, heat: 0, score: 400, message: "🎁 It contains a surprisingly valuable gift card." },
      { label: "👀 'Open Carefully'", cash: 550, heat: 20, score: 650, risky: true, message: "👀 Inside is a stack of rare collectibles." },
      { label: "🧼 'Definitely Soap'", cash: 150, heat: -10, score: 250, message: "🧼 It is, in fact, soap. Fancy soap." },
      { label: "☁️ 'Do Not Shake'", cash: 900, heat: 50, health: -1, score: 1050, risky: true, message: "☁️ You shook it. A cloud of glitter followed you home." }
    ]
  },
  {
    title: "The Tiny Museum",
    prompt: "🏛️ A museum displays one priceless object: a spoon wearing a crown.",
    choices: [
      { label: "🔎 Study the exhibit", cash: 250, heat: -5, score: 400, message: "🔎 You spot a hidden compartment in the display." },
      { label: "👑 Compliment the spoon", cash: 350, heat: 0, score: 450, message: "👑 The curator appreciates your respect for royalty." },
      { label: "📸 Take a picture", cash: 100, heat: -10, score: 220, message: "📸 The picture goes viral and earns a small payout." },
      { label: "🦝 Ask the raccoon to steal it", cash: 1000, heat: 60, health: -1, score: 1200, risky: true, message: "🦝 The raccoon refuses the spoon but steals the gift shop register." }
    ]
  },
  {
    title: "The Suspicious Picnic",
    prompt: "🧺 A perfect picnic is set up in a park with no owner anywhere nearby.",
    choices: [
      { label: "🍓 Eat one snack", cash: 100, heat: 0, score: 200, message: "🍓 One snack later, you find a thank-you envelope under the basket." },
      { label: "🕵️ Search the basket", cash: 500, heat: 25, score: 650, risky: true, message: "🕵️ A hidden envelope contains a generous reward." },
      { label: "🧺 Guard it", cash: 250, heat: -15, score: 350, message: "🧺 The owner returns and tips you for being trustworthy." },
      { label: "🦝 Invite raccoons", cash: 700, heat: 40, score: 800, risky: true, message: "🦝 The picnic becomes a raccoon banquet. You somehow get paid." }
    ]
  },
  {
    title: "The Broken Fortune Teller",
    prompt: "🔮 A fortune teller machine gives you four possible fortunes, but it is clearly malfunctioning.",
    choices: [
      { label: "🍀 Pick lucky", cash: 450, heat: 0, score: 550, message: "🍀 The machine spits out a lucky coin." },
      { label: "👑 Pick rich", cash: 800, heat: 20, score: 850, message: "👑 A hidden drawer opens with a stack of old coins." },
      { label: "🌪️ Pick chaos", cash: 1100, heat: 50, health: -1, score: 1300, risky: true, message: "🌪️ The machine rains coupons and sparkles everywhere." },
      { label: "🤖 Unplug it", cash: 200, heat: -20, score: 300, message: "🤖 You discover someone left a reward envelope behind it." }
    ]
  },
  {
    title: "The Rooftop Garden",
    prompt: "🌿 A rooftop garden has a sign: 'Take ONE flower. Please choose wisely.'",
    choices: [
      { label: "🌷 Pink flower", cash: 200, heat: -5, score: 300, message: "🌷 The flower leads you to a hidden donation box." },
      { label: "🌹 Rare flower", cash: 650, heat: 20, score: 750, risky: true, message: "🌹 The rare flower comes with a reward from the gardener." },
      { label: "🌱 Tiny sprout", cash: 100, heat: -15, health: 1, score: 250, message: "🌱 You take the sprout and somehow feel refreshed." },
      { label: "🦝 Let the raccoon choose", cash: 800, heat: 30, score: 900, risky: true, message: "🦝 The raccoon chooses a flower AND finds a stash underneath it." }
    ]
  },
  {
    title: "The Fake Treasure Chest",
    prompt: "🧰 A treasure chest sits in an alley with a sign reading: 'Definitely Real Treasure.'",
    choices: [
      { label: "🔑 Find the key", cash: 300, heat: 0, score: 450, message: "🔑 The key is hidden nearby. Inside: actual coins." },
      { label: "💥 Force it open", cash: 750, heat: 35, health: -1, score: 900, risky: true, message: "💥 The chest opens. The lock was more dramatic than necessary." },
      { label: "👀 Look underneath", cash: 450, heat: 5, score: 600, message: "👀 You find the real treasure taped underneath." },
      { label: "🚶 Ignore it", cash: 150, heat: -20, score: 250, message: "🚶 You leave it alone and find a reward around the corner." }
    ]
  },
  {
    title: "The Midnight Diner",
    prompt: "🌙 A diner offers one mysterious special. The menu simply says: 'TRUST US.'",
    choices: [
      { label: "🍜 Order the special", cash: 350, heat: 0, score: 450, message: "🍜 Delicious. Also, a coupon falls out of the bowl." },
      { label: "🥞 Order pancakes", cash: 150, heat: -5, score: 250, message: "🥞 Safe, fluffy, and surprisingly profitable." },
      { label: "🕵️ Inspect the kitchen", cash: 500, heat: 25, score: 650, risky: true, message: "🕵️ You discover the diner has a secret catering business." },
      { label: "🦝 Let the raccoon order", cash: 750, heat: 35, score: 850, risky: true, message: "🦝 The raccoon orders twelve meals and somehow gets a loyalty bonus." }
    ]
  },
  {
    title: "The Lost Trophy",
    prompt: "🏆 You find a trophy labeled 'World's Most Questionable Decision.' It has a cash prize attached.",
    choices: [
      { label: "🏆 Claim it", cash: 400, heat: 5, score: 500, message: "🏆 Apparently the trophy was looking for you." },
      { label: "🔎 Find its owner", cash: 250, heat: -15, score: 400, message: "🔎 The owner rewards your honesty." },
      { label: "🎭 Enter the contest", cash: 700, heat: 30, score: 900, risky: true, message: "🎭 You make one questionable decision and win the contest." },
      { label: "🦝 Give it to raccoons", cash: 850, heat: 20, score: 950, message: "🦝 The raccoons immediately declare themselves champions." }
    ]
  },
  {
    title: "The Secret Garden Gate",
    prompt: "🌙 A tiny gate appears between two buildings. It has no handle and glows softly.",
    choices: [
      { label: "🌸 Knock three times", cash: 300, heat: -5, score: 450, message: "🌸 The gate opens and gives you a flower-shaped coin." },
      { label: "✨ Touch the glow", cash: 700, heat: 25, score: 850, risky: true, message: "✨ The gate opens to a hidden sparkle garden." },
      { label: "🧠 Study the symbols", cash: 450, heat: 0, score: 650, message: "🧠 You decode the symbols and find the safe entrance." },
      { label: "🚪 Walk away", cash: 100, heat: -20, score: 200, message: "🚪 You leave. The gate follows you three blocks. Eventually it pays you to stop." }
    ]
  },
  {
    title: "The Raccoon Talent Show",
    prompt: "🎤 A raccoon talent show is underway. The prize is a suspiciously large bag of sparkles.",
    choices: [
      { label: "🎤 Perform", cash: 600, heat: 10, score: 800, message: "🎤 The crowd loves your performance." },
      { label: "👏 Be the audience", cash: 200, heat: -5, score: 350, message: "👏 You clap at exactly the right moments and get paid." },
      { label: "🕺 Dance battle", cash: 900, heat: 35, score: 1100, risky: true, message: "🕺 You accidentally become the raccoon dance champion." },
      { label: "🦝 Coach a raccoon", cash: 750, heat: 15, score: 950, message: "🦝 Your raccoon wins first place and shares the prize." }
    ]
  },
  {
    title: "The Clock Shop",
    prompt: "⏰ Every clock in the shop shows a different time. One has a tiny envelope taped to it.",
    choices: [
      { label: "🕰️ Follow the oldest clock", cash: 350, heat: 0, score: 500, message: "🕰️ The oldest clock points to a hidden drawer." },
      { label: "✉️ Take the envelope", cash: 600, heat: 20, score: 750, risky: true, message: "✉️ The envelope contains a generous mystery reward." },
      { label: "🧠 Find the matching times", cash: 450, heat: -5, score: 650, message: "🧠 The matching clocks reveal a secret compartment." },
      { label: "🦝 Ask the raccoon", cash: 800, heat: 25, score: 900, message: "🦝 The raccoon somehow knows the correct clock immediately." }
    ]
  },
  {
    title: "The Giant Vending Wall",
    prompt: "🎁 A wall of 20 vending slots offers prizes. One slot says 'NOTHING.'",
    choices: [
      { label: "🎁 Pick randomly", cash: 350, heat: 5, score: 450, message: "🎁 You get a decent mystery prize." },
      { label: "🔎 Inspect the labels", cash: 500, heat: 0, score: 650, message: "🔎 You spot a hidden premium slot." },
      { label: "💎 Pick the fanciest", cash: 900, heat: 30, score: 1050, risky: true, message: "💎 The fanciest slot actually contains something valuable." },
      { label: "🦝 Let a raccoon choose", cash: 1100, heat: 40, score: 1250, risky: true, message: "🦝 The raccoon chooses a slot with absurdly good loot." }
    ]
  },
  {
    title: "The Wrong Delivery",
    prompt: "📬 A courier hands you a box and says, 'This definitely belongs to someone else.'",
    choices: [
      { label: "📦 Return it", cash: 250, heat: -20, score: 350, message: "📦 The courier rewards your honesty." },
      { label: "🔎 Check the label", cash: 350, heat: 0, score: 500, message: "🔎 You discover it actually belongs to you." },
      { label: "👀 Peek inside", cash: 650, heat: 25, score: 800, risky: true, message: "👀 You find a reward coupon and immediately reseal the box." },
      { label: "🦝 Give it to the raccoon", cash: 850, heat: 35, score: 950, risky: true, message: "🦝 The raccoon returns with the correct package and a tip." }
    ]
  },
  {
    title: "The Glitter Fountain",
    prompt: "⛲ A fountain sprays tiny sparkles instead of water. A sign says: 'MAKE A WISH.'",
    choices: [
      { label: "🌟 Make a tiny wish", cash: 250, heat: -5, score: 350, message: "🌟 Your tiny wish gets a tiny reward." },
      { label: "💰 Make a money wish", cash: 700, heat: 20, score: 800, message: "💰 A pouch appears beside the fountain." },
      { label: "✨ Grab the sparkles", cash: 950, heat: 45, health: -1, score: 1100, risky: true, message: "✨ You scoop up a fortune before the fountain notices." },
      { label: "🦝 Let the raccoon wish", cash: 800, heat: 10, score: 900, message: "🦝 The raccoon wishes for snacks and gets paid instead." }
    ]
  },
  {
    title: "The Puzzle Room",
    prompt: "🧩 A room has four doors marked SUN, MOON, STAR, and CHEESE. A sign says: 'Only one is boring.'",
    choices: [
      { label: "☀️ SUN", cash: 350, heat: 0, score: 500, message: "☀️ The sun door opens to a bright reward room." },
      { label: "🌙 MOON", cash: 500, heat: -5, score: 650, message: "🌙 The moon door reveals a hidden stash." },
      { label: "⭐ STAR", cash: 750, heat: 15, score: 850, message: "⭐ The star door leads to a rare prize." },
      { label: "🧀 CHEESE", cash: 1000, heat: 35, score: 1150, risky: true, message: "🧀 Obviously the cheese door was the correct one." }
    ]
  },
  {
    title: "The Empty Theater",
    prompt: "🎭 A theater is completely empty except for one spotlight and a suitcase of prizes.",
    choices: [
      { label: "🎤 Take the stage", cash: 450, heat: 5, score: 600, message: "🎤 The empty theater gives you a standing ovation anyway." },
      { label: "🧳 Take the suitcase", cash: 850, heat: 35, score: 950, risky: true, message: "🧳 The suitcase is legitimately full of prizes." },
      { label: "🔎 Search the seats", cash: 300, heat: 0, score: 450, message: "🔎 You find a forgotten envelope under a seat." },
      { label: "🦝 Send a raccoon on stage", cash: 700, heat: 20, score: 850, message: "🦝 The raccoon receives a standing ovation and a paycheck." }
    ]
  },
  {
    title: "The Suspicious Weather Report",
    prompt: "🌦️ A weather machine offers four forecasts: SUN, RAIN, GLITTER, and PICKLES.",
    choices: [
      { label: "☀️ SUN", cash: 250, heat: -5, score: 350, message: "☀️ A sunny day reveals coins on the ground." },
      { label: "🌧️ RAIN", cash: 400, heat: 0, score: 500, message: "🌧️ The rain washes a valuable token toward you." },
      { label: "✨ GLITTER", cash: 800, heat: 30, score: 950, risky: true, message: "✨ Glitter falls from the sky and sticks to everything." },
      { label: "🥒 PICKLES", cash: 1000, heat: 45, health: -1, score: 1200, risky: true, message: "🥒 Nobody knows why pickles started falling. You profit somehow." }
    ]
  },
  {
    title: "The Secret Library",
    prompt: "📚 A library has one forbidden shelf labeled: 'Books That Know Things.'",
    choices: [
      { label: "📖 Read a safe book", cash: 250, heat: -5, score: 400, message: "📖 The book reveals a useful shortcut." },
      { label: "🔮 Read the forbidden book", cash: 700, heat: 30, score: 900, risky: true, message: "🔮 The book reveals where a hidden reward is buried." },
      { label: "🧠 Search the catalog", cash: 400, heat: 0, score: 600, message: "🧠 The catalog contains a clue to a secret drawer." },
      { label: "🦝 Send a raccoon librarian", cash: 850, heat: 20, score: 1000, message: "🦝 The raccoon finds the rarest book and negotiates a reward." }
    ]
  },
  {
    title: "The Giant Plush Machine",
    prompt: "🧸 A giant claw machine contains one enormous plushie with a suspiciously heavy pocket.",
    choices: [
      { label: "🪙 Try once", cash: 300, heat: 0, score: 400, message: "🪙 You win a small plush and a coin inside it." },
      { label: "🎯 Aim carefully", cash: 550, heat: 5, score: 700, message: "🎯 Perfect grab. The plush has a hidden reward." },
      { label: "💸 Keep trying", cash: 800, heat: 25, score: 850, risky: true, message: "💸 You empty the machine but finally get the giant plush." },
      { label: "🦝 Give the controls to raccoon", cash: 950, heat: 35, score: 1100, risky: true, message: "🦝 The raccoon gets the giant plush on the first try." }
    ]
  },
  {
    title: "The Moonlight Market",
    prompt: "🌙 A secret market appears for ten minutes and accepts only strange trades.",
    choices: [
      { label: "🪙 Trade a coin", cash: 300, heat: 0, score: 400, message: "🪙 The vendor gives you a useful little charm." },
      { label: "✨ Trade your luck", cash: 750, heat: 25, score: 900, risky: true, message: "✨ You receive a huge reward and immediately regret the wording." },
      { label: "🧀 Trade cheese", cash: 450, heat: -5, score: 600, message: "🧀 Cheese is apparently a respected currency." },
      { label: "🦝 Trade a raccoon", cash: 1000, heat: 45, score: 1200, risky: true, message: "🦝 The raccoon negotiates its own contract and somehow you get paid." }
    ]
  },
  {
    title: "The Impossible Parking Spot",
    prompt: "🚗 You find a parking spot with a sign reading: 'PARK HERE FOR A SURPRISE.'",
    choices: [
      { label: "🅿️ Park normally", cash: 250, heat: 0, score: 350, message: "🅿️ A parking attendant hands you a reward." },
      { label: "🔎 Inspect the sign", cash: 450, heat: -5, score: 600, message: "🔎 The sign hides a coupon for a big prize." },
      { label: "🎉 Park dramatically", cash: 700, heat: 25, score: 850, risky: true, message: "🎉 The dramatic entrance wins a ridiculous parking contest." },
      { label: "🦝 Let the raccoon park", cash: 900, heat: 35, score: 1050, risky: true, message: "🦝 The raccoon parks perfectly and collects your reward." }
    ]
  },
  {
    title: "The Haunted Gift Shop",
    prompt: "👻 A gift shop is open after hours. Every item has a tiny price tag and a tiny ghost attached.",
    choices: [
      { label: "🕯️ Buy a candle", cash: 200, heat: -5, score: 300, message: "🕯️ The ghost approves of your purchase." },
      { label: "👻 Buy the haunted box", cash: 650, heat: 25, score: 800, risky: true, message: "👻 The box contains a valuable surprise." },
      { label: "🔎 Inspect the shelves", cash: 400, heat: 0, score: 550, message: "🔎 You find an old reward envelope." },
      { label: "🦝 Send raccoon shopping", cash: 850, heat: 30, score: 1000, risky: true, message: "🦝 The raccoon returns with the most expensive item and a discount." }
    ]
  },
  {
    title: "The Riddle Kiosk",
    prompt: "🧠 A kiosk asks one question: 'What gets bigger the more you take away?'",
    choices: [
      { label: "🕳️ A hole", cash: 500, heat: 0, score: 700, message: "🧠 Correct! The kiosk rewards your brain." },
      { label: "🧀 Cheese", cash: 250, heat: 5, score: 350, message: "🧀 Wrong, but the kiosk respects the cheese answer." },
      { label: "💰 Ask for a hint", cash: 350, heat: -5, score: 500, message: "💰 The hint costs nothing and the kiosk gives you a reward." },
      { label: "🦝 Ask the raccoon", cash: 800, heat: 20, score: 900, message: "🦝 The raccoon somehow gets it immediately." }
    ]
  },
  {
    title: "The Endless Staircase",
    prompt: "🪜 A staircase has a sign: 'The prize is at the top. Probably.'",
    choices: [
      { label: "🪜 Climb steadily", cash: 350, heat: 0, score: 500, message: "🪜 You reach the top and find a modest prize." },
      { label: "🏃 Sprint upward", cash: 650, heat: 30, health: -1, score: 800, risky: true, message: "🏃 You reach the top before the staircase can change its mind." },
      { label: "🔎 Search the stairs", cash: 500, heat: -5, score: 650, message: "🔎 You find hidden coins along the way." },
      { label: "🦝 Send raccoon first", cash: 900, heat: 25, score: 1050, message: "🦝 The raccoon reaches the top and rolls the prize back down." }
    ]
  },
  {
    title: "The Mystery Parade",
    prompt: "🎈 A parade passes by and nobody knows what it is celebrating. One float is throwing prizes.",
    choices: [
      { label: "🎈 Join the parade", cash: 450, heat: 5, score: 600, message: "🎈 You are handed a prize for participating." },
      { label: "🎁 Catch prizes", cash: 700, heat: 20, score: 850, message: "🎁 You catch several prize bags." },
      { label: "🕵️ Find the organizer", cash: 550, heat: 0, score: 700, message: "🕵️ The organizer gives you a special prize." },
      { label: "🦝 Put raccoon on a float", cash: 1000, heat: 35, score: 1200, risky: true, message: "🦝 The raccoon becomes the unexpected parade star." }
    ]
  },
  {
    title: "The Four Mysterious Doors",
    prompt: "🚪 Four doors stand in a hallway: COZY, RICH, WEIRD, and RACCOON.",
    choices: [
      { label: "🛋️ COZY", cash: 300, heat: -10, score: 400, message: "🛋️ You find a cozy room and a thank-you envelope." },
      { label: "💰 RICH", cash: 900, heat: 30, score: 1000, risky: true, message: "💰 The rich door opens to a glittering reward room." },
      { label: "🌀 WEIRD", cash: 750, heat: 40, health: -1, score: 1000, risky: true, message: "🌀 Weird is an understatement. You leave with a valuable souvenir." },
      { label: "🦝 RACCOON", cash: 1100, heat: 45, score: 1250, risky: true, message: "🦝 The door opens into a raccoon office. They hand you a bonus." }
    ]
  },
  {
    title: "The Last Cookie",
    prompt: "🍪 One cookie remains on a plate. Beside it is a note: 'The choice is yours.'",
    choices: [
      { label: "🍪 Eat it", cash: 200, heat: 0, score: 300, message: "🍪 Delicious. The cookie contains a tiny reward." },
      { label: "🤝 Share it", cash: 350, heat: -10, score: 500, message: "🤝 Sharing somehow unlocks a bigger reward." },
      { label: "🔎 Inspect it", cash: 450, heat: 5, score: 650, message: "🔎 You find a prize hidden under the plate." },
      { label: "🦝 Give it to raccoon", cash: 800, heat: 15, score: 900, message: "🦝 The raccoon gives you its entire snack budget in return." }
    ]
  },
  {
    title: "The Glitter Hotel",
    prompt: "🏨 A hotel offers you four rooms. The room numbers are 101, 202, 303, and 404.",
    choices: [
      { label: "🛏️ Room 101", cash: 300, heat: -5, score: 400, message: "🛏️ A welcome basket contains a small reward." },
      { label: "🛎️ Room 202", cash: 500, heat: 5, score: 650, message: "🛎️ You discover a hidden hotel loyalty bonus." },
      { label: "✨ Room 303", cash: 800, heat: 25, score: 950, risky: true, message: "✨ The room is made entirely of glitter and contains a treasure chest." },
      { label: "🦝 Room 404", cash: 1000, heat: 40, health: -1, score: 1200, risky: true, message: "🦝 Room 404 is a raccoon conference. They pay you to leave." }
    ]
  },
  {
    title: "The Unclaimed Crown",
    prompt: "👑 A jeweled crown sits on a velvet cushion with a sign: 'TRY ME.'",
    choices: [
      { label: "👑 Try it", cash: 550, heat: 10, score: 700, message: "👑 The crown declares you honorary royalty and pays you." },
      { label: "🔎 Inspect it", cash: 400, heat: 0, score: 600, message: "🔎 You find a hidden prize beneath the cushion." },
      { label: "🙅 Leave it", cash: 250, heat: -15, score: 350, message: "🙅 You resist temptation and find a reward nearby." },
      { label: "🦝 Put it on the raccoon", cash: 1000, heat: 35, score: 1200, risky: true, message: "🦝 The raccoon becomes king and grants you a royal payout." }
    ]
  },
  {
    title: "The Strange Train Station",
    prompt: "🚉 A train arrives with no destination listed. The conductor offers four tickets.",
    choices: [
      { label: "🎟️ Local ticket", cash: 300, heat: -5, score: 400, message: "🎟️ You take a short ride and receive a station reward." },
      { label: "🌙 Midnight ticket", cash: 600, heat: 20, score: 750, risky: true, message: "🌙 The midnight train leads to a hidden market." },
      { label: "⭐ First-class ticket", cash: 850, heat: 30, score: 950, risky: true, message: "⭐ First class includes a surprise prize." },
      { label: "🦝 Give ticket to raccoon", cash: 950, heat: 40, health: -1, score: 1100, risky: true, message: "🦝 The raccoon returns with luggage full of mystery rewards." }
    ]
  }
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
  survivor: { name: "the Mission Survivor", description: "Complete your first Solo Mission." },
  battle_champion: { name: "the Tree Battle Champion", description: "Win your first Tree Battle." },
  battle_brawler: { name: "the Branch Brawler", description: "Win 5 Tree Battles." },
  battle_streak: { name: "the Bark Streak", description: "Win 3 Tree Battles in a row." },
  battle_master: { name: "the Battle Master", description: "Win 10 Tree Battles." },
  battle_legend: { name: "the Tree Battle Legend", description: "Win 25 Tree Battles." },
  battle_clutch: { name: "the One-HP Menace", description: "Win a Tree Battle while at 20 HP or less." },
  ten_level_survivor: { name: "the Story Survivor", description: "Complete all 10 Solo Mission levels." },
  story_master: { name: "the Story Master", description: "Finish a Solo Mission with 8,000+ score." },
  island_champion: { name: "the Island Champion", description: "Win Chaos Island." },
  pastel_winner: { name: "the Color Chaos Menace", description: "Win Color Chaos." },
  collector: { name: "the Collector", description: "Own 10 shop items." },
  firework_fiend: { name: "the Firework Fiend", description: "Win 10 Chaos Island games." },
  royal_blood: { name: "Royal Blood", description: "Win 25 Chaos Island games." },
  enchanted_one: { name: "the Enchanted One", description: "Complete 10 Solo Missions." },
  royal_purple: { name: "Royal Purple", description: "Reach Color Chaos Level 25." },
  butterfly_keeper: { name: "the Butterfly Keeper", description: "Complete 5 different Limited Shop sets." },
  shadow_walker: { name: "the Shadow Walker", description: "Win 50 Heist games." },
  frostbite: { name: "Frostbite", description: "Win 25 Color Chaos games." },
  golden_legend: { name: "the Golden Legend", description: "Reach 100,000 sparkles." },
  haunted: { name: "the Haunted", description: "Own the complete Halloween set." },
  criminal: { name: "the Criminal", description: "Currently serving a Pickle Jail sentence. 🥒" },
  court_raccoon: { name: "the Court-Appointed Raccoon", description: "Temporarily assigned by Judge Raccoon. 🦝⚖️" },
  court_favorite: { name: "the Raccoons' Favorite Criminal", description: "Earned by holding the highest number of guilty Raccoon Court verdicts. 🦝⚖️" }
};

const SOLO_STORY_LEVELS = [
  ["Level 1 — The Invitation", "A suspicious invitation pulls you into the first job."],
  ["Level 2 — The Hidden Route", "The easy route disappears and a stranger route opens."],
  ["Level 3 — The Raccoon Deal", "The raccoons know something. They want something in return."],
  ["Level 4 — The Locked Room", "A sealed room contains the next clue and several terrible ideas."],
  ["Level 5 — The Double Cross", "Someone may be helping you. Someone may absolutely not be."],
  ["Level 6 — The Glitter Trap", "The mission gets louder, shinier, and much more dangerous."],
  ["Level 7 — The Escape", "Everything goes wrong at approximately the same time."],
  ["Level 8 — The Final Heist", "The real objective finally comes into view."],
  ["Level 9 — The Last Choice", "One final decision determines what kind of legend you become."],
  ["Level 10 — The Ending", "Your choices catch up with you. The ending is yours." ]
];

function soloEnding(game) {
  if (game.health <= 0) return "💀 You survived the story only in the form of a very dramatic cautionary tale.";
  if (game.highestHeat >= 90 && game.cash >= 2500) return "👑 THE CHAOTIC TYCOON — You escaped rich, notorious, and absolutely unrepentant.";
  if (game.heat <= 10 && game.health === SOLO_START_HEALTH) return "🕶️ THE GHOST — Nobody can prove you were ever there.";
  if (game.riskyChoices >= 6) return "🔥 THE CHAOS LEGEND — You made terrible choices with astonishing confidence.";
  if (game.cash >= 4000) return "💰 THE GREAT GETAWAY — You left with a ridiculous fortune.";
  return "🌳 THE UNEXPECTED HERO — Somehow, your questionable decisions saved the day.";
}

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
    `🕵️ **SOLO MISSION — LEVEL ${game.round}/${game.maxRounds}**`,
    `📖 **${SOLO_STORY_LEVELS[Math.max(0, Math.min(SOLO_STORY_LEVELS.length - 1, game.round - 1))]?.[0] || "Story Level"}**`,
    `_${SOLO_STORY_LEVELS[Math.max(0, Math.min(SOLO_STORY_LEVELS.length - 1, game.round - 1))]?.[1] || "The story continues..."}_`,
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
  const newlyUnlocked = [];
  const unlock = id => {
    if (!player.titles.includes(id)) {
      player.titles.push(id);
      newlyUnlocked.push(id);
    }
  };
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
  if (mission.round >= 10 && mission.finalScore >= 3500) unlock("ten_level_survivor");
  if (mission.finalScore >= 8000) unlock("story_master");
  return newlyUnlocked;
}

async function handleGamesMenu(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  const player = await getPlayer(env, user.id);
  updatePlayerIdentity(player, interaction);
  await savePlayer(env, player);
  await sendText(env, interaction, `🎮 **WEREWIVES GAMES**\n\n👤 **${soloPlayerName(player)}**\n\n🕵️ **Solo Mission** — single-player strategic chaos\n🏝️ **Chaos Island** — multiplayer survival chaos\n💰 **Heist Game** — multiplayer social deduction\n🧪 **The Experiment** — secret clues + group decisions\n🌳⚔️ **Tree Battle** — battle another tree\n🌈 **Color Chaos** — pastel territory chaos\n\n🌳 The Tree is separate — use **/tree**.`, [
    row(button("🏝️ Chaos Island", "games:island", 1), button("💰 Heist Game", "games:heist", 2)),
    row(button("🧪 The Experiment", "games:experiment", 1), button("🕵️ Solo Mission", "games:solo", 3)),
    row(button("🌳⚔️ Tree Battle", "games:battle", 1), button("🌈 Color Chaos", "games:colorchaos", 3)),
    row(button("🏆 Solo Leaderboard", "games:solo_leaderboard", 2))
  ]);
}

async function handleSoloStart(env, interaction) {
  if (await checkGamePunishment(env, interaction)) return;

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
  const newlyUnlockedTitles = unlockSoloTitles(player, { ...game, finalScore });
  player.soloMission = null;
  await savePlayer(env, player);
  if (!aborted) await updateSoloLeaderboard(env, player, finalScore);
  const titleText = newlyUnlockedTitles.length ? `\n🏷️ **NEW titles unlocked:** ${newlyUnlockedTitles.map(id => `**${SOLO_TITLES[id]?.name || id}**`).join(", ")}` : "";
  const content = aborted
    ? `🛑 **SOLO MISSION ABORTED**\n\nYour run score was **${finalScore}**. No sparkles awarded.\n\nYou can try again anytime. 🕵️`
    : `🏁 **SOLO MISSION COMPLETE!**\n\n${soloEnding(game)}\n\n👤 **${soloPlayerName(player)}**\n🏆 **Final Score:** ${finalScore}\n💰 **Final Stash:** ${game.cash}\n❤️ **Health:** ${game.health}/3\n🚨 **Highest Heat:** ${game.highestHeat}/100\n✨ **Sparkles Earned:** +${reward}${titleText}\n\n🏆 Check **/solo-leaderboard** to see where you rank!`;
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

function titleEditData(data){const {flags,...rest}=data||{};return rest;}
async function handleTitleList(env,interaction){ const data=await buildTitlesResponseData(env,interaction,"titles",0); return interaction.__deferred?editOriginalResponse(env,interaction,titleEditData(data)):sendText(env,interaction,"🏆 **MY TITLES**",data.components); }
async function handleNameEffectList(env,interaction){ const data=await buildTitlesResponseData(env,interaction,"effects",0); return interaction.__deferred?editOriginalResponse(env,interaction,titleEditData(data)):sendText(env,interaction,"✨ **NAME EFFECTS**",data.components); }
async function handleTitleEquip(env,interaction,titleId){
  const user=getUserFromInteraction(interaction); if(!user)return;
  const punishmentPlayer=await getPlayer(env,user.id); await refreshPunishmentState(env,punishmentPlayer);
  if(Number(punishmentPlayer.pickleJailUntil||0)>Date.now()) return sendText(env,interaction,"🥒 You are in Pickle Jail. Your **Criminal** title is not optional. 😭");
  if(Number(punishmentPlayer.courtCriminalRecordUntil||0)>Date.now()) return sendText(env,interaction,"⚖️ Your **Criminal Record** punishment has locked your title. 😭");
  if(Number(punishmentPlayer.courtRaccoonTitleUntil||0)>Date.now()) return sendText(env,interaction,"🦝 The court-appointed raccoon chose your title. You cannot change it yet. 😭");
  const player=punishmentPlayer; updatePlayerIdentity(player,interaction);
  if(!player.titles.includes(titleId)||!SOLO_TITLES[titleId])return sendText(env,interaction,"🔒 You haven't unlocked that title yet.");
  player.equippedTitle=titleId; await savePlayer(env,player);
  const response=await editOriginalResponse(env,interaction,titleEditData(await buildTitlesResponseData(env,interaction,"titles",0)));
  if(!response.ok) console.error("Title menu refresh failed:",response.status,await response.text());
}
async function handleTitleUnequip(env,interaction){
  const user=getUserFromInteraction(interaction); if(!user)return; const player=await getPlayer(env,user.id); await refreshPunishmentState(env,player);
  if(Number(player.pickleJailUntil||0)>Date.now()||Number(player.courtCriminalRecordUntil||0)>Date.now()||Number(player.courtRaccoonTitleUntil||0)>Date.now())return sendText(env,interaction,"⚖️ Your current court sentence does not allow you to change your title. 😭");
  player.equippedTitle=""; await savePlayer(env,player);
  const response=await editOriginalResponse(env,interaction,titleEditData(await buildTitlesResponseData(env,interaction,"titles",0)));
  if(!response.ok) console.error("Title unequip menu refresh failed:",response.status,await response.text());
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
const HEIST_NIGHT_DURATION = 60 * 1000;
const HEIST_VOTE_DURATION = 3 * 60 * 1000;
const HEIST_STARTING_VAULT = 10000;
const HEIST_STEAL_MIN = 500;
const HEIST_STEAL_MAX = 1500;
const HEIST_WIN_REWARD = 500;
const BATTLE_WIN_REWARD = 500;
const PASTEL_WIN_XP = 100;

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

  jimothy_jester: {
    name: "🤡 Jimothy Jester",
    team: "jester",
    description:
      "You win if you get voted out OR die. The Detective sees you as suspicious, so make everyone wonder whether you're the Thief.",
    action: null,
    actionLabel: "🤡 Cause Suspicion"
  },

  raccoon_reaper: {
    name: "🦝☠️ Raccoon Reaper",
    team: "neutral",
    description:
      "Once per game, choose one living player. If you choose the Thief, the Thief is eliminated and the Good Team wins. If you choose anyone who is NOT the Thief, the Reaper dies instead.",
    action: "reap",
    actionLabel: "☠️ Reap"
  },

  sleeper: {
    name: "😴 The Sleepwalker",
    team: "hunters",
    description:
      "Put one living player to sleep for the night. Their normal night action is blocked. You are the one who may use the special daytime Sleepwalker action while they sleep.",
    action: "sleep",
    actionLabel: "😴 Put to Sleep"
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
  "jimothy_jester",
  "raccoon_reaper",
  "sleeper",
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
    reveal: "🔮 Reveal",
    reap: "☠️ Reap",
    sleep: "😴 Put to Sleep"
  };

  return names[action] || action;
}

function heistRolesForCount(count) {
  if (count < HEIST_MIN_PLAYERS || count > HEIST_MAX_PLAYERS) {
    return [];
  }

  /*
    Curated tiny-game setups intentionally avoid stacking too much
    information on the Hunters. Jimothy adds uncertainty because the
    Detective reads the Jester as suspicious.
  */
  if (count === 3) {
    const setups = [
      ["thief", "detective", "jimothy_jester"],
      ["thief", "guard", "jimothy_jester"],
      ["thief", "detective", "sleeper"]
    ];
    return shuffleArray(setups[randomInt(0, setups.length - 1)]);
  }

  if (count === 4) {
    const setups = [
      ["thief", "detective", "guard", "jimothy_jester"],
      ["thief", "detective", "sleeper", "jimothy_jester"],
      ["thief", "guard", "sleeper", "jimothy_jester"]
    ];
    return shuffleArray(setups[randomInt(0, setups.length - 1)]);
  }

  if (count === 5) {
    const setups = [
      ["thief", "detective", "guard", "jimothy_jester", "raccoon_reaper"],
      ["thief", "detective", "sleeper", "jimothy_jester", "raccoon_reaper"],
      ["thief", "guard", "sleeper", "jimothy_jester", "raccoon_reaper"]
    ];
    return shuffleArray(setups[randomInt(0, setups.length - 1)]);
  }

  const roles = ["thief", "detective", "rabid_raccoon"];
  if (count >= 6) roles.push("guard");

  const needed = count - roles.length;
  const optional = shuffleArray(HEIST_OPTIONAL_ROLES);
  for (let i = 0; i < needed; i++) roles.push(optional[i]);
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

    if (role === "thief" && Number(player.loot || 0) > 0 && !player.runUsed) {
      buttons.push(
        button(
          "🏃 Run (40%)",
          `heist:action:${game.id}:run`,
          4
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
    "reveal",
    "reap",
    "sleep"
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
  // Channel locking is permanently disabled. Heists never change
  // channel permissions, including during Night phases.
  return false;
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
    player.cannotVote = false;
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

  if (player.asleep && action !== "sleep") return false;

  if (action === "reap" && player.role === "raccoon_reaper" && player.reaperUsed) return false;
  if (action === "run" && player.role === "thief" && !player.runUsed && Number(player.loot || 0) > 0) return true;

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

  if (action === "run") {
    if (game.status !== "night" || player.role !== "thief" || player.runUsed || Number(player.loot || 0) <= 0) {
      await heistSendPrivate(env, interaction, "❌ You can't Run right now.");
      return;
    }
    player.runUsed = true;
    if (Math.random() < 0.40) {
      player.alive = false;
      game.thiefEscaped = true;
      game.thiefEscapeLoot = Number(player.loot || 0);
      game.endedReason = "🏃 THIEF ESCAPED";
      await heistSendPrivate(env, interaction, `🏃 **YOU GOT AWAY!** You escaped with **${Number(player.loot || 0)} ✨** stolen loot.`);
      await finishHeist(env, game, "🏃 **THE THIEF RAN!** The Thief escaped the vault with all stolen loot.");
      return;
    }
    const dropped = Math.min(Number(player.loot || 0), Math.max(1, Math.floor(Number(player.loot || 0) * 0.35)));
    player.loot = Math.max(0, Number(player.loot || 0) - dropped);
    game.vault += dropped;
    game.totalStolen = Math.max(0, Number(game.totalStolen || 0) - dropped);
    await heistSendPrivate(env, interaction, `💥 **YOU FAILED TO RUN!** You dropped **${dropped} ✨** back into the vault. Your remaining stolen loot is **${Number(player.loot || 0)} ✨**.`);
    player.submitted = true;
    player.currentAction = "run";
    game.nightActions[userId] = { action: "run", targetId: null, submittedAt: Date.now() };
    const runState = await getGuildState(env, game.guildId);
    runState.heist = game;
    await saveGuildState(env, game.guildId, runState);
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
  content,
  components = []
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
            content,
            components
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

function heistDaytimeButton(game, player) {
  return player?.role === "sleeper" && player.daytimeActionReady && game.status === "voting"
    ? [row(button("☀️ Daytime Nudge", `heist:dayaction:${game.id}:nudge`, 1))]
    : [];
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
      `☀️ **DAWN — YOUR SECRET HEIST RESULT**\n\n${result}\n\nYour result is private. Do not reveal it unless you want to.`,
      heistDaytimeButton(game, player)
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

    if (Math.random() < 0.20) {
      actor.guardFailed = true;
      game.nightResults[userId] = "🥱 **YOU FELL ASLEEP AT YOUR POST!** You couldn't guard your target tonight.";
      publicEvents.push("🥱 **THE GUARD FELL ASLEEP AT THEIR POST.** Security was not as secure as advertised.");
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
    Sleepwalker: a sleeping target loses their normal night action.
    The Sleepwalker gets a private notice that their daytime action is
    available after dawn.
  */
  const sleeping = new Set();
  for (const [userId, action] of Object.entries(actions)) {
    const actor = heistPlayer(game, userId);
    if (!actor?.alive || actor.role !== "sleeper" || action.action !== "sleep" || canceled.has(userId)) continue;
    const target = heistPlayer(game, action.targetId);
    if (!target?.alive || target.id === userId) continue;
    sleeping.add(target.id);
    target.asleep = true;
    actor.daytimeActionReady = true;
    game.nightResults[userId] = `😴 **SLEEP SUCCESS!** ${heistDisplayName(target)} was sent to sleep. Their normal night action was blocked. You may use your special daytime action.`;
  }

  for (const userId of sleeping) {
    delete actions[userId];
  }

  /* Raccoon Reaper: once per game, choose one living player.
     If the target is the Thief, the Thief dies and the Good Team wins.
     If the target is anyone else, the Reaper dies instead. Protection does not change this gamble. */
  let reaperGoodWin = false;
  for (const [userId, action] of Object.entries(actions)) {
    const actor = heistPlayer(game, userId);
    if (!actor?.alive || actor.role !== "raccoon_reaper" || action.action !== "reap" || canceled.has(userId) || actor.reaperUsed) continue;
    actor.reaperUsed = true;
    const target = heistPlayer(game, action.targetId);
    if (!target?.alive || target.id === userId) {
      game.nightResults[userId] = "☠️ **THE REAPER MISSED.** No valid target was chosen.";
      continue;
    }
    if (target.role === "thief") {
      target.alive = false;
      reaperGoodWin = true;
      game.nightResults[userId] = `☠️ **REAPER STRIKE!** ${heistDisplayName(target)} was the Thief! The Thief has been caught!`;
      publicEvents.push("☠️ **THE REAPER FOUND THE THIEF.** The Good Team has won!");
    } else {
      actor.alive = false;
      game.nightResults[userId] = `☠️ **REAPER SACRIFICE!** ${heistDisplayName(target)} was not the Thief. The Reaper has been eliminated.`;
      publicEvents.push("☠️ **THE REAPER MADE THE WRONG CHOICE.** The Reaper has been eliminated.");
    }
  }

  if (reaperGoodWin) {
    await finishHeist(env, game, "THIEF HAS BEEN CAUGHT BY THE RACCOON REAPER");
    return;
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

  if (heistAlivePlayers(game).length <= 1) {
    const remaining = heistAlivePlayers(game)[0];
    await finishHeist(env, game, remaining ? `☠️ **THE REAPER LEFT ONLY ONE PLAYER STANDING.** ${heistDisplayName(remaining)} survives.` : "No players remain after the night.");
    return;
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
    } else if (heistPlayerCount(game) === 3) {
      /*
        Three-player games are intentionally noisy. The Detective gets a
        clue, not a guaranteed solve, so one investigation cannot instantly
        identify the Thief by elimination.
      */
      const trulySuspicious = target.role === "thief" || target.role === "jimothy_jester" || framed.has(target.id);
      const reportedSuspicious = Math.random() < 0.65 ? trulySuspicious : !trulySuspicious;
      result = reportedSuspicious
        ? "🚨 **SUSPICIOUS CLUE — BUT NOT CERTAIN.** The evidence points toward this player, but the tiny crew has too much overlap and the clue may be misleading."
        : "🟢 **QUIET CLUE — BUT NOT CERTAIN.** Nothing suspicious showed up, but the evidence is unreliable in a three-player heist.";
    } else if (
      target.role === "thief" ||
      target.role === "jimothy_jester" ||
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

  for (const p of Object.values(game.players)) {
    p.asleep = false;
  }

  game.status = "voting";
  game.phaseEndsAt =
    Date.now() +
    HEIST_VOTE_DURATION;
  game.votes = {};

  await sendHeistPrivateResults(
    env,
    game
  );


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
    if (game.thiefEscaped || thief.alive) {
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

    if (
      player.role === "jimothy_jester" &&
      !player.alive
    ) {
      winners.push(
        `${heistDisplayName(player)} — 🤡 Jimothy Jester`
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

  const prizePool = game.thiefEscaped
    ? 0
    : Math.max(0, Number(game.reserve || 0) + Number(game.totalStolen || 0));

  const escapedLoot = game.thiefEscaped
    ? Number(game.thiefEscapeLoot || thief?.loot || 0)
    : 0;

  const winnerReward =
    winnerPlayers.length
      ? HEIST_WIN_REWARD +
        escapedLoot +
        Math.floor(prizePool / winnerPlayers.length)
      : 0;

  if (winnerReward > 0) {
    for (const winner of winnerPlayers) {
      const winnerPlayer = await getPlayer(env, winner.id);
      winnerPlayer.heistWins = Number(winnerPlayer.heistWins || 0) + 1;
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
  if (await checkGamePunishment(env, interaction)) return;

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
    reaperUsed: false,
    asleep: false,
    daytimeActionReady: false,
    lastAction: null,
    lastPrivateResult: ""
  };

  state.heist = game;

  const joiningPlayer = await getPlayer(env, user.id);
  const joiningPunishment = await refreshPunishmentState(env, joiningPlayer);
  

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
  if (await checkGamePunishment(env, interaction)) return;

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

  if (voter?.cannotVote) {
    await sendText(env,interaction,"😴 Your vote was silenced for this round.");
    return;
  }

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

async function handleHeistDayAction(env, interaction, gameId, action) {
  if (!interaction.guild_id) return sendText(env,interaction,"❌ Heists only work inside a server.");
  const state=await getGuildState(env,interaction.guild_id); const game=state.heist; const user=getUserFromInteraction(interaction);
  const player=game?.players?.[user?.id];
  if(!game||game.id!==gameId||game.status!=="voting") return sendText(env,interaction,"❌ The daytime action is no longer available.");
  if(!player||player.role!=="sleeper"||!player.daytimeActionReady) return sendText(env,interaction,"❌ You don't have a daytime action ready.");
  if(action!=="nudge") return sendText(env,interaction,"❌ Unknown daytime action.");
  const targets=heistAlivePlayers(game).filter(p=>p.id!==user.id);
  if(!targets.length) return sendText(env,interaction,"❌ There is nobody to nudge.");
  await sendText(env,interaction,"☀️ **DAYTIME NUDGE**\n\nChoose one living player. Their vote will be silenced this round.",heistDayTargetButtons(game,user.id));
}

function heistDayTargetButtons(game,userId){
  const targets=heistAlivePlayers(game).filter(p=>p.id!==userId); const rows=[];
  for(let i=0;i<targets.length;i+=5) rows.push(row(...targets.slice(i,i+5).map(p=>button(`☀️ ${heistDisplayName(p).slice(0,70)}`,`heist:daytarget:${game.id}:nudge:${p.id}`,2))));
  rows.push(row(button("❌ Cancel","heist:cancelday:"+game.id,2))); return rows;
}

async function handleHeistDayTarget(env, interaction, gameId, action, targetId) {
  const state=await getGuildState(env,interaction.guild_id); const game=state.heist; const user=getUserFromInteraction(interaction); const player=game?.players?.[user?.id]; const target=game?.players?.[targetId];
  if(!game||game.id!==gameId||game.status!=="voting") return sendText(env,interaction,"❌ Voting is over.");
  if(!player||player.role!=="sleeper"||!player.daytimeActionReady) return sendText(env,interaction,"❌ Your daytime action is no longer available.");
  if(action!=="nudge"||!target?.alive||target.id===user.id) return sendText(env,interaction,"❌ Invalid daytime target.");
  target.cannotVote=true; player.daytimeActionReady=false;
  game.publicEvents=(game.publicEvents||[]).concat(`☀️ **SOMEONE'S VOTE WAS SILENCED.** The daytime got a little sleepier.`).slice(-12);
  state.heist=game; await saveGuildState(env,game.guildId,state);
  await sendText(env,interaction,`☀️ **DAYTIME NUDGE SUCCESSFUL.** ${heistDisplayName(target)} cannot vote this round.`);
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

  if (actionType === "dayaction") {
    await handleHeistDayAction(env,interaction,gameId,parts[3]); return true;
  }

  if (actionType === "daytarget") {
    await handleHeistDayTarget(env,interaction,gameId,parts[3],parts[4]); return true;
  }

  if (actionType === "cancelday") {
    const p=heistPlayer(game,user.id); if(p) p.daytimeActionReady=false; state.heist=game; await saveGuildState(env,guildId,state); await sendText(env,interaction,"❌ Daytime action cancelled."); return true;
  }

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
   PLAYER ITEM GIFTING / DELETE / SUGGEST / HELP
========================================================= */

function resolveInventoryItemId(player, raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (!value || value === "cherry" || value === "cherry tree") return null;
  const ids = Object.keys(SHOP_ITEMS);
  const direct = ids.find(id => id.toLowerCase() === value && player.inventory.includes(id));
  if (direct) return direct;
  const byName = ids.find(id => player.inventory.includes(id) && String(SHOP_ITEMS[id].name).toLowerCase() === value);
  if (byName) return byName;
  const partial = ids.find(id => player.inventory.includes(id) && (id.toLowerCase().includes(value) || String(SHOP_ITEMS[id].name).toLowerCase().includes(value)));
  return partial || null;
}

async function handlePresentItem(env, interaction, targetId, rawItem) {
  const user=getUserFromInteraction(interaction);
  if(!user||!interaction.guild_id)return sendText(env,interaction,"❌ `/present` can only be used inside a server.");
  if(!targetId||targetId===user.id)return sendText(env,interaction,"❌ Choose another player to receive the item.");
  const sender=await getPlayer(env,user.id); const receiver=await getPlayer(env,targetId);
  const itemId=resolveInventoryItemId(sender,rawItem);
  if(!itemId)return sendText(env,interaction,"❌ You don't own that item. Use `/inventory` to see your owned items and their IDs.");
  if(!Array.isArray(receiver.inventory))receiver.inventory=[];
  if(receiver.inventory.includes(itemId))return sendText(env,interaction,`❌ <@${targetId}> already owns **${SHOP_ITEMS[itemId].name}**.`);
  sender.inventory=sender.inventory.filter(id=>id!==itemId); receiver.inventory.push(itemId);
  if(sender.equipped?.tree && SHOP_ITEMS[itemId]?.type==="tree" && SHOP_ITEMS[itemId].value===sender.equipped.tree) sender.equipped.tree="cherry";
  if(sender.equipped?.theme && SHOP_ITEMS[itemId]?.type==="background" && SHOP_ITEMS[itemId].value===sender.equipped.theme) sender.equipped.theme="cherry";
  if(sender.equipped?.effect && SHOP_ITEMS[itemId]?.type==="effect" && SHOP_ITEMS[itemId].value===sender.equipped.effect) sender.equipped.effect=null;
  if(sender.equipped?.decoration && SHOP_ITEMS[itemId]?.type==="decoration" && SHOP_ITEMS[itemId].value===sender.equipped.decoration) sender.equipped.decoration=null;
  await savePlayer(env,sender,user.id);await savePlayer(env,receiver,targetId);
  await sendText(env,interaction,`🎁 You gifted **${SHOP_ITEMS[itemId].name}** to <@${targetId}>! 💖`);
  await sendUserDM(env,targetId,`🎁 **You received a Werewives gift!**\n\n<@${user.id}> gifted you **${SHOP_ITEMS[itemId].name}**. ✨`);
}

async function handleDeleteItem(env,interaction,rawItem){
  const user=getUserFromInteraction(interaction);if(!user)return;
  const player=await getPlayer(env,user.id);const itemId=resolveInventoryItemId(player,rawItem);
  if(!itemId)return sendText(env,interaction,"❌ You don't own that item. Use `/inventory` to see your items.");
  player.pendingDeleteItem=itemId;await savePlayer(env,player);
  await sendText(env,interaction,`⚠️ **Delete ${SHOP_ITEMS[itemId].name}?**\n\nThis removes it from your inventory. If you later want it again, you may need to earn or buy it again.\n\nAre you sure?`,[row(button("🗑️ Yes, Delete","delete:confirm",4),button("❌ Cancel","delete:cancel",2))]);
}

async function handleDeleteConfirm(env,interaction){const user=getUserFromInteraction(interaction);if(!user)return;const player=await getPlayer(env,user.id);const itemId=player.pendingDeleteItem;delete player.pendingDeleteItem;if(!itemId||!player.inventory.includes(itemId))return sendText(env,interaction,"❌ That item is no longer in your inventory.");player.inventory=player.inventory.filter(id=>id!==itemId);const item=SHOP_ITEMS[itemId];if(item?.type==="tree"&&item.value===player.equipped?.tree)player.equipped.tree="cherry";if(item?.type==="background"&&item.value===player.equipped?.theme)player.equipped.theme="cherry";if(item?.type==="effect"&&item.value===player.equipped?.effect)player.equipped.effect=null;if(item?.type==="decoration"&&item.value===player.equipped?.decoration)player.equipped.decoration=null;await savePlayer(env,player);await sendText(env,interaction,`🗑️ Deleted **${item?.name||itemId}** from your inventory.`);}
async function handleDeleteCancel(env,interaction){const user=getUserFromInteraction(interaction);if(!user)return;const player=await getPlayer(env,user.id);delete player.pendingDeleteItem;await savePlayer(env,player);await sendText(env,interaction,"💗 Delete cancelled. Your item is safe.");}

async function sendOwnerSuggestion(env,interaction,message){
  const user=getUserFromInteraction(interaction);const channel=interaction.channel_id||"DM";const guild=interaction.guild_id?`Server ID: ${interaction.guild_id}`:"Direct Message";
  const text=`💡 **WEREWIVES SUGGESTION / BUG REPORT**\n\nFrom: ${user?.username||"Unknown"} (<@${user?.id||""}>)\n${guild}\nChannel ID: ${channel}\n\n${String(message||"").trim()}`;
  let dmChannel=null;try{const r=await discordRequest(env,"/users/@me/channels",{method:"POST",body:JSON.stringify({recipients:[env.OWNER_ID]})});if(!r.ok)throw new Error(`DM channel ${r.status}`);dmChannel=await r.json();const box=await fetch(imageUrl(IMAGES.suggestionBox));const blob=await box.blob();const form=new FormData();form.append("content",text);form.append("files[0]",blob,"suggestion-box.png");const mr=await discordRequest(env,`/channels/${dmChannel.id}/messages`,{method:"POST",body:form});if(!mr.ok)throw new Error(`DM message ${mr.status}`);return true;}catch(error){console.error("Suggestion DM failed",error);return false;}
}
async function handleSuggestion(env,interaction,message){const ok=await sendOwnerSuggestion(env,interaction,message);await sendText(env,interaction,ok?"💡 **Suggestion sent!** Thank you for helping make Werewives better. 💖":"❌ I couldn't send that suggestion right now. Please try again later.");}

function helpText(){return [
  "🆘 **WEREWIVES HELP**",
  "",
  "🌳 **TREE**",
  "`/tree` `/water` `/catch` `/sparkle` `/fortune` `/rename`",
  "`/shop` `/inventory` `/customize`",
  "",
  "🔮 **WEREWIVES FUN**",
  "`/oracle` • `/curse @player` • `/lore @player` • `/timeline @player`",
  "",
  "🎮 **GAMES**",
  "`/games` — Main games menu",
  "`/solo start|status|leaderboard|end`",
  "`/island create|join|start|settings|status|rules|end`",
  "`/heist create|join|start|status|leave|end` • `/roles`",
  "`/battle @player` • `/battleshop` • `/battle-end`",
  "`/experiment create|join|start|status|leave|end`",
  "",
  "🌈 **COLOR CHAOS**",
  "`/colorchaos create` — Start a match",
  "`/colorchaos leaderboard` • `/colorchaos end`",
  "🔄 Refresh • 🎨 Color Key • 📖 Rules • 🚪 Quit • 🛑 End Game",
  "`/blame` — Nudge the current player",
  "",
  "🎂 **BIRTHDAY PARTY**",
  "`/birthday` • `/birthday-games` • `/birthday-shop`",
  "`/birthday-gift` • `/birthday-gifts` • `/birthday-collection`",
  "`/birthday-wish` • `/birthday-cannon` • `/birthday-trickster @player`",
  "`/birthday-name` • `/birthday-set`",
  "",
  "🏷️ **PROFILE & COSMETICS**",
  "`/titles` • `/profile` • `/panel color #HEX`",
  "`/present @player item` • `/delete item` • `/achievements`",
  "",
  "✨ **SPARKLES & COMMUNITY**",
  "`/gift @player amount` • `/recycle amount`",
  "`/daily-riddle` • `/free` • `/raccoon @player`",
  "`/suggest` — Send a suggestion or bug report privately",
  "",
  "🎞️ **ANIMATED EFFECTS**",
  "Animated Effects include Fairy Flight, Crystal Aura, Starfall, Unicorn Sparkle, Snowfall, Flower Bloom, Bubble Pop, Candy Storm, Kitty Parade, Electric Storm, Experimental Effect, and more.",
  "",
  "💗 Owner/admin-only commands are intentionally not listed here."
].join("\n");}
/* =========================================================
   WEREWIVES MINI-FUN COMMANDS
   Oracle • Curse • Lore • Timeline
   Purely silly/social. No gameplay, balances, or player data changes.
========================================================= */

const ORACLE_RESPONSES = [
  '🔮 The future contains a suspiciously convenient snack.',
  "🔮 You will soon hear 'wait, what?' and nobody will explain.",
  '🔮 A tiny victory approaches. Celebrate it dramatically.',
  '🔮 Your destiny contains glitter. An irresponsible amount.',
  '🔮 The moon has reviewed your plans. It has concerns.',
  '🔮 You will make an excellent decision immediately after a questionable one.',
  '🔮 A mysterious opportunity approaches. It is probably a button.',
  '🔮 Something you thought was lost will reappear somewhere obvious.',
  '🔮 You will become emotionally invested in something completely ridiculous.',
  '🔮 A raccoon has selected you for reasons known only to the raccoon.',
  "🔮 Your next adventure begins with 'Okay, this should be fine.'",
  '🔮 You will soon win an argument you never actually have.',
  '🔮 The stars recommend choosing the option that makes the better story.',
  '🔮 A small problem will solve itself after you stop staring at it.',
  '🔮 You are destined to open an app and forget why.',
  '🔮 Someone will underestimate you today. Let them.',
  '🔮 The future smells faintly like popcorn.',
  '🔮 A random thought will become your entire personality for seven minutes.',
  '🔮 Something pink will improve your day. The Oracle refuses to elaborate.',
  '🔮 You will witness nonsense and decide it is somehow your problem.',
  '🔮 A suspiciously good idea is approaching. Investigate carefully.',
  "🔮 You will say 'I'm just checking one thing' and immediately get distracted.",
  '🔮 Your luck today is shaped like a slightly crooked star.',
  '🔮 A completely ordinary moment will somehow become a story.',
  '🔮 Your next tiny inconvenience will be defeated by stubbornness.',
  '🔮 A door will open. It may be metaphorical. It may just be a door.',
  '🔮 You will soon discover you were right about something extremely unimportant.',
  '🔮 The Oracle predicts one dramatic sigh.',
  '🔮 A mysterious little treat is spiritually approaching you.',
  '🔮 Your future is bright, sparkly, and mildly chaotic.',
  '🔮 Fate has assigned you a side quest. The reward is bragging rights.',
  '🔮 You will encounter an object and wonder why anyone owns it.',
  '🔮 A notification will appear. It will probably be less exciting than hoped.',
  '🔮 The next thing that makes you laugh will be completely unexpected.',
  '🔮 Your brain is about to produce one wildly unnecessary fact.',
  "🔮 Someone will say 'hear me out.' The Oracle advises listening.",
  '🔮 You are entering a period of extremely specific luck.',
  '🔮 A tiny mystery will appear and you will absolutely investigate it.',
  '🔮 The universe has prepared a mildly inconvenient coincidence.',
  '🔮 You will find something useful exactly when you stop looking for it.',
  '🔮 A raccoon somewhere thinks you have potential.',
  '🔮 You will have a surprisingly satisfying little win.',
  '🔮 The future has been located. It is doing something suspicious over there.',
  '🔮 Your destiny is currently buffering. Please try again later.',
  '🔮 The stars have no useful information, but they are very confident.',
  "🔮 Something mildly magical is about to happen. Don't ask for science.",
];

const CURSE_RESPONSES = [
  '🪄 **CURSE OF THE DRAMATIC ENTRANCE** — Everything feels 12% more cinematic.',
  '🪄 **CURSE OF THE MISSING WORD** — The perfect word arrives three seconds late.',
  '🪄 **CURSE OF THE EXTRA STEP** — Every simple task gains one unnecessary step.',
  '🪄 **CURSE OF THE SUSPICIOUS SPOON** — Spoons are now mildly questionable.',
  '🪄 **CURSE OF THE RACCOON COUNCIL** — Invisible raccoons are judging your decisions.',
  "🪄 **CURSE OF THE PHANTOM NOTIFICATION** — You will check for a notification that isn't there.",
  '🪄 **CURSE OF THE PICKLE** — Somewhere nearby, a pickle is disappointed in you.',
  '🪄 **CURSE OF THE DRAMATIC PAUSE** — Every decision deserves a theatrical pause.',
  '🪄 **CURSE OF THE ALMOST REMEMBERED THING** — You know you forgot something. Not what.',
  '🪄 **CURSE OF THE TINY BOSS MUSIC** — Ordinary tasks now feel extremely important.',
  '🪄 **CURSE OF THE MYSTERIOUS CRUMB** — One crumb will demand an explanation.',
  '🪄 **CURSE OF THE SIDE QUEST** — You may become distracted by something unrelated.',
  '🪄 **CURSE OF THE UNNECESSARY GOOGLE** — Curiosity has chosen a useless topic.',
  '🪄 **CURSE OF THE WOBBLY VIBE** — Everything is fine, but slightly crooked.',
  '🪄 **CURSE OF NUMBER 37** — The number 37 is now suspiciously important.',
  '🪄 **CURSE OF THE LOST TRAIN OF THOUGHT** — Your thought has left without you.',
  '🪄 **CURSE OF THE RANDOM SONG** — One song may become inexplicably stuck in your head.',
  '🪄 **CURSE OF THE MYSTERIOUS BUTTON** — You will become curious about a button that does nothing.',
  "🪄 **CURSE OF THE UNFINISHED SENTENCE** — A thought may end with '...actually, never mind.'",
  '🪄 **CURSE OF THE OVERTHINKING RACCOON** — Somewhere, a raccoon is thinking very hard about your choices.',
  '🪄 **CURSE OF THE ONE SOCK** — The matching sock has vanished into another dimension.',
  '🪄 **CURSE OF THE FAKE CONFIDENCE** — You will confidently enter a room and forget why.',
  '🪄 **CURSE OF THE RANDOM FACT** — An unnecessary fact will arrive at the worst time.',
  '🪄 **CURSE OF THE TINY VICTORY LAP** — A mundane accomplishment must receive championship energy.',
  '🪄 **CURSE OF THE ORANGE PEEL** — You may briefly consider whether an orange is a hat.',
  '🪄 **CURSE OF THE GREAT SIGH** — One situation deserves a legendary sigh.',
  '🪄 **CURSE OF THE SUSPICIOUS SILENCE** — Quiet now feels like somebody is plotting.',
  '🪄 **CURSE OF THE ALMOST TEXT** — The perfect joke arrives after the conversation moves on.',
  '🪄 **CURSE OF THE BACKUP PLAN** — Your brain invents a plan for something needing no plan.',
  '🪄 **CURSE OF THE TINY DETOUR** — Your next simple plan gains a pointless side quest.',
  "🪄 **CURSE OF THE MYSTERY NOISE** — A random noise will be declared 'probably fine.'",
  '🪄 **CURSE OF THE POCKET ROCK** — You now spiritually own one tiny rock.',
  '🪄 **CURSE OF THE RACCOON DIPLOMAT** — Your invisible ambassador has filed a complaint.',
  '🪄 **CURSE OF THE VERY IMPORTANT NAPKIN** — One ordinary object becomes weirdly important.',
  '🪄 **CURSE OF THE DOUBLE CHECK** — You will check something twice despite already checking.',
  '🪄 **CURSE OF THE DRAMATIC WINDOW LOOK** — One ordinary moment deserves a movie scene.',
  '🪄 **CURSE OF THE TINY CONFUSION** — You will briefly forget something you definitely know.',
  '🪄 **CURSE OF THE UNNECESSARY CELEBRATION** — One mundane success must be celebrated wildly.',
  '🪄 **CURSE OF THE SNEAKY SNACK** — A snack will become 40% more appealing.',
  '🪄 **CURSE OF THE WRONG NAME** — Your brain may rename an object incorrectly.',
  '🪄 **CURSE OF THE CHAOTIC AUTOCORRECT** — Your imagination has temporary autocorrect privileges.',
  '🪄 **CURSE OF THE INVISIBLE AUDIENCE** — Every mundane action deserves applause.',
  '🪄 **CURSE OF THE RARE RACCOON** — A very specific raccoon has heard your name.',
  '🪄 **CURSE OF THE ONE-MINUTE PHILOSOPHER** — You will briefly ponder a question nobody asked.',
  '🪄 **CURSE OF THE TINY GLITCH** — Reality has experienced harmless buffering.',
  '🪄 **CURSE OF THE PINK CLOUD** — A normal thought gets lightly dusted with glitter.',
  '🪄 **CURSE OF THE ROLLING CHAIR** — Somewhere, a chair has just rolled away dramatically.',
];

const LORE_RESPONSES = [
  '📜 It is written that {u} once entered a room, forgot why, and left with a different mission.',
  '📜 Ancient records claim {u} was offered infinite wisdom and asked for snacks instead.',
  '📜 The oldest tree remembers {u} staring at a loading screen and somehow winning.',
  '📜 Legend says {u} can sense when someone opens the fridge without taking anything.',
  "📜 The archives contain a document titled 'The Incident Involving {u} and One Suspicious Spoon.'",
  '📜 It is rumored that {u} once defeated a raccoon in an argument. The raccoon appealed.',
  '📜 {u} has honorary membership in an imaginary raccoon kingdom.',
  "📜 A secret map marks one location: 'Probably where {u} left that thing.'",
  '📜 The moon remembers {u}. The moon refuses to explain why.',
  "📜 One prophecy describes {u} as 'the person who should not press that button.'",
  '📜 Werewives historians still debate why {u} was once followed by three ducks.',
  '📜 {u} once found a mysterious object and immediately decided it belonged to them.',
  '📜 The garden gnomes reportedly recognize {u} on sight.',
  '📜 A historian wrote that {u} can turn a simple plan into a side quest.',
  '📜 The trees whisper that {u} has excellent dramatic timing.',
  "📜 A raccoon once described {u} as 'surprisingly trustworthy.' It was investigated.",
  "📜 The forbidden library has a shelf labeled 'Things {u} Probably Shouldn't Know.'",
  '📜 {u} once walked into a room with a plan and walked out with a snack.',
  '📜 Werewives folklore claims {u} can accidentally turn Tuesday into an event.',
  "📜 An ancient inscription reads: '{u} was here. Nobody knows why.'",
  '📜 The Council once considered naming a constellation after {u}. They got distracted.',
  '📜 Legend says {u} has an invisible raccoon assigned to them. Its job is classified.',
  "📜 One scroll predicts {u} will someday say 'okay, hear me out' before chaos.",
  '📜 A mysterious historian called {u} a recurring plot device.',
  '📜 It is whispered that {u} once made a tree proud. The tree still talks about it.',
  "📜 An old diary contains one sentence about {u}: 'They knew too much about pickles.'",
  "📜 The archives say {u} has never met a normal situation they couldn't make stranger.",
  '📜 A tiny ceremonial bell rings whenever {u} makes a questionable decision.',
  '📜 The ancient records say {u} was definitely involved. Nobody knows in what.',
  '📜 A forgotten cookbook has a page dedicated to {u}. It is just a drawing of a pickle.',
  "📜 Somewhere beneath the server is a plaque commemorating 'The {u} Situation.'",
  '📜 {u} once asked a raccoon for directions. The raccoon charged an acorn.',
  '📜 A classified drawing of {u} looks suspiciously like a potato.',
  '📜 The trees claim {u} has excellent taste in chaos.',
  '📜 One prophecy says {u} will discover the true purpose of a useless button.',
  '📜 {u} can apparently detect a suspiciously quiet group chat from several rooms away.',
  '📜 The garden has a secret path named after {u}. It leads nowhere useful.',
  '📜 A raccoon historian insists {u} invented a new kind of nonsense.',
  '📜 The oldest surviving Werewives meme allegedly featured {u}. Nobody has the original.',
  "📜 {u} has been classified as 'Important For Reasons We Will Not Explain.'",
  "📜 Legend says {u} once looked directly at nonsense and said, 'Sure.'",
  '📜 Somewhere, a tiny bell rings whenever someone mentions {u} and pickles together.',
  "📜 The lore keepers describe {u} as 'chaotic, but workable.'",
  '📜 Ancient records say {u} once won an argument against a mirror.',
  "📜 A secret file says: '{u}. Enough said.'",
];

const TIMELINE_RESPONSES = [
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a professional raccoon consultant.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} runs a bakery where every pastry is shaped like a tree.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} invented a Wi-Fi spoon.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is mayor of a town full of garden gnomes.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a detective whose only clue is a warm waffle.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is ambassador to the Moon.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} sells invisible furniture and is wildly successful.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} can tell when a fridge has nothing new inside.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} uses a portal exclusively to avoid stairs.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} won a staring contest against a statue and became famous.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} guards a magical library of raccoon books.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} founded a religion dedicated to the sacred potato.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a professional nap consultant.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} discovered that plants gossip and started taking notes.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is the only person who understands ducks.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} owns a castle but keeps losing the carriage.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} hunts treasure and keeps finding spoons.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} runs a detective agency for missing snacks.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a wizard whose only spell is making toast.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} invented a machine that detects raccoon theft.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a fashion designer famous for unnecessary capes.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} opened a five-star hotel for ghosts.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} captains a spaceship powered by glitter.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} discovered the ancient civilization of Extremely Tiny Chairs.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is world champion at a sport nobody has heard of.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} owns a greenhouse where every plant has an attitude.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} became a detective because their cat knew more than police.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} rules a kingdom where Tuesdays are illegal.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} found a hidden dimension behind a vending machine.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a professional cloud critic.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} opened a museum for things found behind furniture.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} trains raccoons for dramatic entrances.',
  "🕰️ **ALTERNATE TIMELINE #{n}** — {u} is the world's first licensed button presser.",
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} lives in a treehouse with suspiciously advanced security.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is a time traveler who fixes tiny inconveniences.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} founded a school for avoiding unnecessary drama.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} invented glitter soup and somehow became famous.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} guards a door that leads to another door.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} runs a newspaper reporting only oddly specific good news.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} protects treasure they have never seen.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} is best friends with a ghost named Gary.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} invented teleportation to skip one boring meeting.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} proved scientifically that raccoons have opinions.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} owns a bookstore where books choose customers.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} advises a kingdom of judgmental cats.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} discovered a secret island and forgot the map.',
  "🕰️ **ALTERNATE TIMELINE #{n}** — {u} solved 'Who Ate The Last Cookie?' and became a legend.",
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} became famous after a raccoon photobomb.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} invented a self-watering tree that gives advice.',
  '🕰️ **ALTERNATE TIMELINE #{n}** — {u} owns a spaceship, three capes, and no idea how it works.',
  "🕰️ **ALTERNATE TIMELINE #{n}** — {u} is the guardian of the server's imaginary moon.",
];

function funTargetId(interaction){return getOption(interaction,"user")||getUserFromInteraction(interaction)?.id||"";}
function funTargetMention(interaction){const id=funTargetId(interaction);return id?`<@${id}>`:"you";}
function randomFunResponse(list){return list[randomInt(0,list.length-1)];}
async function handleOracle(env,interaction){const target=funTargetMention(interaction);await sendText(env,interaction,`🔮 **THE WEREWIVES ORACLE**\n\n${target}, ${randomFunResponse(ORACLE_RESPONSES).replace(/^🔮\s*/,"")}`);}
async function handleCurse(env,interaction){const target=funTargetMention(interaction);await sendText(env,interaction,`${randomFunResponse(CURSE_RESPONSES)}\n\n🎯 Target: ${target}\n✨ *Harmless Werewives nonsense — no actual player effect is applied.*`);}
async function handleLore(env,interaction){const target=funTargetMention(interaction);await sendText(env,interaction,randomFunResponse(LORE_RESPONSES).replaceAll("{u}",target));}
async function handleTimeline(env,interaction){const target=funTargetMention(interaction);await sendText(env,interaction,randomFunResponse(TIMELINE_RESPONSES).replaceAll("{u}",target).replaceAll("{n}",String(randomInt(12,999))));}
async function handleHelp(env,interaction){await sendText(env,interaction,helpText());}

/* =========================================================
   COMMAND ROUTER
========================================================= */

function getOption(
  interaction,
  name
) {
  const options = interaction.data?.options || [];
  // Discord puts options for slash-command subcommands inside the
  // subcommand option. Pickle Jail uses /pickle jail, so search both
  // the top level and nested subcommand options.
  for (const option of options) {
    if (option.name === name && option.value !== undefined) return option.value;
    if (Array.isArray(option.options)) {
      const nested = option.options.find(child => child.name === name);
      if (nested?.value !== undefined) return nested.value;
    }
  }
  return null;
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
  if (await courtRestriction(env,interaction,"courtFortuneBanUntil","fortune")) return;
  if (await courtRestriction(env,interaction,"courtUtilityLockUntil","fortune")) return;
  const punishmentUser = getUserFromInteraction(interaction);
  if (punishmentUser) {
    const punishmentPlayer = await getPlayer(env, punishmentUser.id);
    if (await refreshPunishmentState(env, punishmentPlayer) === "pickle") {
      await sendText(env, interaction, punishmentBlockedText(punishmentPlayer, "pickle"));
      return;
    }
  }

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
  if (await courtRestriction(env,interaction,"courtRaccoonBanUntil","raccoon crime")) return;
  if (await courtRestriction(env,interaction,"courtUtilityLockUntil","raccoon crime")) return;
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
  { id: "cat_person", name: "🐱 Cat Person", description: "Buy your first cat item.", reward: 100, hidden: true, progress: p => p.catItemBought ? 1 : 0, goal: 1 },
  { id: "battle_first", name: "⚔️ Branch Brawl", description: "Win your first Tree Battle.", reward: 100, progress: p => Number(p.battleWins || 0), goal: 1 },
  { id: "battle_5", name: "🌳 Bark Bruiser", description: "Win 5 Tree Battles.", reward: 200, progress: p => Number(p.battleWins || 0), goal: 5 },
  { id: "battle_10", name: "⚔️ Forest Fighter", description: "Win 10 Tree Battles.", reward: 400, progress: p => Number(p.battleWins || 0), goal: 10 },
  { id: "battle_streak_3", name: "🔥 Hot Roots", description: "Reach a 3-battle Tree Battle win streak.", reward: 300, progress: p => Number(p.battleBestStreak || 0), goal: 3 },
  { id: "battle_clutch", name: "💗 Last Leaf Standing", description: "Win a Tree Battle while at 20 HP or less.", reward: 500, progress: p => Number(p.battleLowHpWins || 0), goal: 1 }
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

async function handleFree(env, interaction, guess) {
  const normalized=String(guess||"").trim().toLowerCase();
  const user=getUserFromInteraction(interaction); if(!user)return;

  // PRIVATE GIFT CODE: BEANS. No hint is ever shown for this code.
  if(normalized==="beans"){
    const player=await getPlayer(env,user.id); updatePlayerIdentity(player,interaction); player.inventory=Array.isArray(player.inventory)?player.inventory:[];
    if(player.freeBeansClaimed){await sendText(env,interaction,"🫘💥 You already claimed the FREE **Bean Burst Effect**! ✨");return;}
    if(!player.inventory.includes("beans_effect"))player.inventory.push("beans_effect");
    player.freeBeansClaimed=true;
    await savePlayer(env,player);
    await sendText(env,interaction,"🫘💥 **BEAN BURST UNLOCKED!**\n\nYou entered the secret code and received the FREE **Bean Burst Effect**!\n\n🫘 Beans fall from the sky...\n💥 Then they explode into sparkles! ✨\n\nEnjoy your extremely bean-y gift. 😭🫘✨");
    return;
  }

  // FREE GIFT CODE: EGGWARD. Unlocks the Eggward decoration.
  if(normalized==="eggward"){
    const player=await getPlayer(env,user.id); updatePlayerIdentity(player,interaction); player.inventory=Array.isArray(player.inventory)?player.inventory:[];
    if(player.freeEggwardClaimed){await sendText(env,interaction,"🥚 You already claimed the FREE **Eggward Decoration**! ✨");return;}
    if(!player.inventory.includes("eggward_decoration"))player.inventory.push("eggward_decoration");
    player.freeEggwardClaimed=true;
    await savePlayer(env,player);
    await sendText(env,interaction,"🥚👁️ **EGGWARD UNLOCKED!**\n\nYou entered the secret code and received the FREE **Eggward Decoration**!\n\n🥚 Eggward is ready to stare into everyone's soul from your tree. 😭✨");
    return;
  }

  // FREE GIFT CODE: HEDGY. Unlocks the Hedgy decoration.
  if(normalized==="hedgy"){
    const player=await getPlayer(env,user.id); updatePlayerIdentity(player,interaction); player.inventory=Array.isArray(player.inventory)?player.inventory:[];
    if(player.freeHedgyClaimed){await sendText(env,interaction,"🦔 You already claimed the FREE **Hedgy Decoration**! ✨");return;}
    if(!player.inventory.includes("hedgy_decoration"))player.inventory.push("hedgy_decoration");
    player.freeHedgyClaimed=true;
    await savePlayer(env,player);
    await sendText(env,interaction,"🦔🌸 **HEDGY UNLOCKED!**\n\nYou entered the secret code and received the FREE **Hedgy Decoration**!\n\n🦔💗 Your adorable little Hedgy is ready for tree duty! ✨");
    return;
  }

  if(normalized!=="tanner"&&normalized!=="bob"){
    await sendText(env,interaction,"🎁 **FREE GIFT**\n\n❌ Nope! That code isn't active. 😈");
    return;
  }

  const player=await getPlayer(env,user.id); updatePlayerIdentity(player,interaction); player.inventory=Array.isArray(player.inventory)?player.inventory:[];
  const isTanner=normalized==="tanner";
  const claimKey=isTanner?"freeGoldenPickleClaimed":"freeMidnightRiderClaimed";
  if(player[claimKey]){await sendText(env,interaction,`🎁 You already claimed the FREE **${isTanner?"Golden Pickle":"Midnight Rider"}** gift! 💗`);return;}
  const giftIds=isTanner?["golden_pickle_tree","golden_pickle_background","golden_pickle_effect"]:["midnight_rider_tree","midnight_rider_background","midnight_rider_effect"];
  for(const id of giftIds)if(!player.inventory.includes(id))player.inventory.push(id);
  player[claimKey]=true;
  /* Keep the old flag for backwards compatibility, but do not use it to block the other code. */
  player.freeGiftClaimed=true;
  await savePlayer(env,player);
  if(isTanner)await sendText(env,interaction,"🥒✨ **GOLDEN PICKLE UNLOCKED!**\n\nYou guessed **TANNER** and received the FREE **Golden Pickle Set**!\n\n🌳 Golden Pickle Tree\n🖼️ Golden Pickle Background\n✨ Golden Pickle Effect\n\n✨ **You are golden pickle hoe ✨**");
  else await sendText(env,interaction,"🏍️🌙 **MIDNIGHT RIDER UNLOCKED!**\n\nYou guessed **BOB** and received the FREE **Midnight Rider Set**!\n\n🌳 Midnight Rider Tree\n🖼️ Midnight Rider Background\n✨ Midnight Rider Effect");
}
async function handleBlame(env, interaction) {
  if (!interaction.guild_id) {
    await sendText(env, interaction, "❌ `/blame` can only be used inside a server.");
    return;
  }
  const state = await getGuildState(env, interaction.guild_id);
  const game = await findPastelGameForUser(env,interaction.guild_id,getUserFromInteraction(interaction)?.id);
  if (!game || game.status !== "playing") {
    await sendText(env, interaction, "🌈 There isn't an active Color Chaos game to blame anyone in. 😭");
    return;
  }
  const current = pastelFindOwned(game, game.turnId);
  if (!current?.alive) {
    await sendText(env, interaction, "🌈 The current player is already out. The game needs a moment to advance. 😭");
    return;
  }
  await sendText(
    env,
    interaction,
    `🚨 **BLAME ALERT!**\n\n<@${game.turnId}> IT'S YOUR TURN! 🌈🎨\n\nThe Color Chaos board is waiting on you. Move before the 2-minute AFK timeout gets you! ⏰😂`,
    undefined
  );
}

async function handleIslandEnd(env,interaction){
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Chaos Island is server-only.");
  const state=await getGuildState(env,interaction.guild_id);const game=state.island;const user=getUserFromInteraction(interaction);
  if(!game)return sendText(env,interaction,"❌ There is no active Chaos Island game.");
  if(!user||(user.id!==game.hostId&&user.id!==env.OWNER_ID))return sendText(env,interaction,"❌ Only the Chaos Island host or bot owner can end the game.");
  state.island=null;await saveGuildState(env,interaction.guild_id,state);await sendText(env,interaction,"🛑 Chaos Island ended and its saved game state was cleared.");
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
  if (subcommand === "end") return handleIslandEnd(env, interaction);
  await handleIslandRules(env, interaction);
}


/* =========================================================
   OWNER NEWS + BLACKLIST CONTROLS
========================================================= */

const NEWS_STATE_KEY = "system:news";
const BLACKLIST_STATE_KEY = "system:blacklist";
const MAX_STORED_NEWS = 100;

async function getNewsState(env) {
  try {
    const raw = await env.TREE_DATA.get(NEWS_STATE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return {
      nextId: Math.max(1, Number(data.nextId || 1)),
      announcements: Array.isArray(data.announcements) ? data.announcements : []
    };
  } catch (error) {
    console.error("News state read failed:", error);
    return { nextId: 1, announcements: [] };
  }
}

async function saveNewsState(env, state) {
  await env.TREE_DATA.put(NEWS_STATE_KEY, JSON.stringify({
    nextId: Math.max(1, Number(state.nextId || 1)),
    announcements: Array.isArray(state.announcements) ? state.announcements.slice(-MAX_STORED_NEWS) : []
  }));
}

async function getBlacklistState(env) {
  try {
    const raw = await env.TREE_DATA.get(BLACKLIST_STATE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch (error) {
    console.error("Blacklist state read failed:", error);
    return {};
  }
}

async function saveBlacklistState(env, state) {
  await env.TREE_DATA.put(BLACKLIST_STATE_KEY, JSON.stringify(state || {}));
}

async function isUserBlacklisted(env, userId) {
  if (!userId) return false;
  const state = await getBlacklistState(env);
  return Boolean(state[String(userId)]);
}

function newsAnnouncementComponents(newsId) {
  return [{
    type: 1,
    components: [{
      type: 2,
      style: 1,
      label: "OK 💗",
      custom_id: `news:ok:${newsId}`
    }]
  }];
}

async function handleNewsCommand(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const message = String(getOption(interaction, "message") || "").trim();
  if (!message) return sendText(env, interaction, "❌ Please include the announcement text.");

  const state = await getNewsState(env);
  const id = Number(state.nextId || 1);
  state.nextId = id + 1;
  state.announcements.push({ id, message, createdAt: Date.now() });
  await saveNewsState(env, state);

  return sendText(env, interaction, `📢 **News #${id} published!**\n\nEvery player will see it privately the next time they interact with the bot, once each. 💗`);
}

async function maybeShowNews(env, interaction) {
  const user = getUserFromInteraction(interaction);
  if (!user || user.id === env.OWNER_ID) return;
  if (await isUserBlacklisted(env, user.id)) return;

  try {
    const state = await getNewsState(env);
    if (!state.announcements.length) return;
    const player = await getPlayer(env, String(user.id));
    const seen = new Set(Array.isArray(player.seenNewsIds) ? player.seenNewsIds.map(Number) : []);
    const unseen = state.announcements
      .filter(item => item && Number.isFinite(Number(item.id)) && !seen.has(Number(item.id)))
      .sort((a, b) => Number(a.id) - Number(b.id));
    if (!unseen.length) return;
    const news = unseen[0];
    await sendEphemeralFollowup(env, interaction, `📰 **Werewives News #${news.id}**\n\n${String(news.message)}`, newsAnnouncementComponents(news.id));
  } catch (error) {
    console.error("News popup failed:", error);
  }
}

async function handleNewsComponent(env, interaction, newsId) {
  const user = getUserFromInteraction(interaction);
  if (!user) return;
  if (await isUserBlacklisted(env, user.id)) {
    return sendEphemeralFollowup(env, interaction, "🚫 You currently cannot use the Werewives bot.");
  }
  const id = Number(newsId);
  if (!Number.isFinite(id)) return;
  const player = await getPlayer(env, String(user.id));
  const seen = Array.isArray(player.seenNewsIds) ? player.seenNewsIds.map(Number) : [];
  if (!seen.includes(id)) seen.push(id);
  player.seenNewsIds = [...new Set(seen)].sort((a, b) => a - b).slice(-MAX_STORED_NEWS);
  await savePlayer(env, player, String(user.id));
  return editOriginalResponse(env, interaction, { content: `📰 **News #${id} acknowledged!** 💗`, components: [] });
}

async function handleBlacklistCommand(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const targetId = String(getOption(interaction, "user") || "").trim();
  const reason = String(getOption(interaction, "reason") || "No reason provided.").trim();
  if (!targetId) return sendText(env, interaction, "❌ Please choose a user to blacklist.");
  if (targetId === String(env.OWNER_ID)) return sendText(env, interaction, "❌ You cannot blacklist the bot owner.");
  const state = await getBlacklistState(env);
  const existing = state[targetId];
  state[targetId] = { reason: reason.slice(0, 500), blacklistedAt: existing?.blacklistedAt || Date.now(), updatedAt: Date.now() };
  await saveBlacklistState(env, state);
  return sendText(env, interaction, `🚫 **Blacklisted <@${targetId}>.**\nReason: ${state[targetId].reason}`);
}

async function handleUnblacklistCommand(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const targetId = String(getOption(interaction, "user") || "").trim();
  if (!targetId) return sendText(env, interaction, "❌ Please choose a user to unblacklist.");
  const state = await getBlacklistState(env);
  if (!state[targetId]) return sendText(env, interaction, `ℹ️ <@${targetId}> is not currently blacklisted.`);
  delete state[targetId];
  await saveBlacklistState(env, state);
  return sendText(env, interaction, `🔓 **Unblacklisted <@${targetId}>.** Their existing player data was not changed.`);
}

async function handleBlacklistList(env, interaction) {
  if (!(await requireOwner(env, interaction))) return;
  const state = await getBlacklistState(env);
  const entries = Object.entries(state);
  if (!entries.length) return sendText(env, interaction, "📋 **Blacklist is empty.**");
  const lines = [];
  let total = `🚫 **Blacklisted Players (${entries.length})**\n\n`;
  for (const [id, info] of entries) {
    const line = `• <@${id}> — ${String(info?.reason || "No reason provided.")}`;
    if ((total + line + "\n").length > 1900) {
      lines.push(`• …and ${entries.length - lines.length} more.`);
      break;
    }
    lines.push(line);
    total += line + "\n";
  }
  return sendText(env, interaction, `🚫 **Blacklisted Players (${entries.length})**\n\n${lines.join("\n")}`);
}

async function handleCommand(
  env,
  interaction
) {
  const name =
    interaction.data?.name;

  if (name === "news") { await handleNewsCommand(env, interaction); return; }
  if (name === "blacklist") { await handleBlacklistCommand(env, interaction); return; }
  if (name === "unblacklist") { await handleUnblacklistCommand(env, interaction); return; }
  if (name === "blacklist-list") { await handleBlacklistList(env, interaction); return; }

  if (name === "birthday") { await handleBirthdayCommand(env, interaction); return; }
  if (name === "birthday-games") { await handleBirthdayGamesCommand(env, interaction); return; }
  if (name === "birthday-set") { await handleBirthdaySet(env, interaction); return; }
  if (name === "birthday-shop") { await ensureBirthdayEvent(env, interaction.guild_id); await showBirthdayShop(env, interaction); return; }
  if (name === "birthday-gift") { await ensureBirthdayEvent(env, interaction.guild_id); await handleBirthdayGift(env, interaction); return; }
  if (name === "birthday-gifts") { await ensureBirthdayEvent(env, interaction.guild_id); await showBirthdayGifts(env, interaction); return; }
  if (name === "birthday-collection") { await ensureBirthdayEvent(env, interaction.guild_id); await showBirthdayCollection(env, interaction); return; }
  if (name === "birthday-wish") { await ensureBirthdayEvent(env, interaction.guild_id); await birthdayWish(env, interaction); return; }
  if (name === "birthday-cannon") { await ensureBirthdayEvent(env, interaction.guild_id); await birthdayCannon(env, interaction); return; }
  if (name === "birthday-trickster") { await ensureBirthdayEvent(env, interaction.guild_id); await birthdayTrickster(env, interaction); return; }
  if (name === "birthday-name") { await ensureBirthdayEvent(env, interaction.guild_id); await handleBirthdayNameBingo(env, interaction); return; }
  if (name === "birthday-force") { await forceBirthdayServerEvent(env, interaction); return; }

  if (name === "games") {
    await handleGamesMenu(env, interaction);
    return;
  }

  if (name === "experiment") {
    await handleExperimentCommand(env, interaction);
    return;
  }

  if (name === "solo") {
    const subcommand = interaction.data?.options?.find(option => option.type === 1)?.name || "start";
    if (subcommand === "leaderboard") await handleSoloLeaderboard(env, interaction);
    else if (subcommand === "status") await handleSoloStatus(env, interaction);
    else if (subcommand === "end") await handleSoloAbort(env, interaction);
    else if (subcommand === "start") await handleSoloStart(env, interaction);
    else await handleSoloStart(env, interaction);
    return;
  }

  if (name === "titles") {
    await handleTitlesMenu(env, interaction);
    return;
  }

  if (name === "pickle") {
    const sub = interaction.data?.options?.find(option => option.type === 1)?.name;
    if (sub === "jail") await handlePickleJail(env, interaction);
    return;
  }

  if (name === "timeout") {
    const sub = interaction.data?.options?.find(option => option.type === 1)?.name;
    if (sub === "corner") await handleCornerTimeout(env, interaction);
    return;
  }
  if (name === "court") { await handleCourt(env, interaction); return; }
  if (name === "court-leaderboard") { await handleCourtLeaderboard(env, interaction); return; }

  if (name === "profile") { await handleProfile(env, interaction); return; }
  if (name === "panel") { const sub = interaction.data?.options?.find(option => option.type === 1)?.name; if (sub === "color") await handleProfileColor(env, interaction, (interaction.data?.options?.find(option => option.type === 1)?.options?.find(option => option.name === "hex")?.value ?? null)); return; }
  if (name === "present") { await handlePresentItem(env, interaction, getOption(interaction,"user"), getOption(interaction,"item")); return; }
  if (name === "delete") { await handleDeleteItem(env, interaction, getOption(interaction,"item")); return; }
  if (name === "suggest") { await handleSuggestion(env, interaction, getOption(interaction,"message")); return; }
  if (name === "help") { await handleHelp(env, interaction); return; }
  if (name === "oracle") { await handleOracle(env, interaction); return; }
  if (name === "curse") { await handleCurse(env, interaction); return; }
  if (name === "lore") { await handleLore(env, interaction); return; }
  if (name === "timeline") { await handleTimeline(env, interaction); return; }

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

  if (name === "battle") {
    await handleBattleStart(env, interaction);
    return;
  }

  if (name === "battleshop") {
    await handleBattleShop(env, interaction);
    return;
  }

  if (name === "battle-end") {
    await handleBattleEnd(env, interaction);
    return;
  }

  if (name === "color") {
    const sub = interaction.data?.options?.find(o => o.type === 1)?.name;
    if (sub === "checker") { await handleColorChecker(env, interaction); return; }
    return;
  }

  if (name === "colorchaos") {
    const sub = interaction.data?.options?.find(o => o.type === 1)?.name || "create";
    if (sub === "create") { await handlePastelStart(env, interaction); return; }
    if (sub === "end") { await handlePastelEndCommand(env, interaction); return; }
    if (sub === "leaderboard") { await handlePastelLeaderboard(env, interaction); return; }
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

  if (name === "free") {
    await handleFree(env, interaction, getOption(interaction, "guess"));
    return;
  }

  if (name === "blame") {
    await handleBlame(env, interaction);
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
   TREE BATTLE
   Uses only the equipped tree image: no background, decoration,
   or effect is included in battle artwork.
========================================================= */

const BATTLE_MOVES = {
  attack: [
    ["🌿 Branch Slap", 12, "slapped your tree with a branch!"],
    ["🌰 Acorn Bonk", 10, "launched an acorn directly at the forehead!"],
    ["🌱 Root Trip", 11, "tripped the opponent with a sneaky root!"],
    ["🍃 Leaf Cannon", 13, "fired a compressed leaf cannon!"],
    ["🐦 Bird Assault", 14, "called in an extremely aggressive bird!"],
    ["☀️ Photosynthesis Beam", 16, "weaponized photosynthesis!"],
    ["👊 Trunk Punch", 15, "threw a very wooden punch!"],
    ["🥜 Nut Toss", 9, "threw a handful of nuts with questionable accuracy!"],
    ["🍃 Leaf Shuriken", 14, "sent razor-sharp leaves spinning!"],
    ["🪵 Log Launcher", 17, "launched a log with absolutely no safety inspection!"],
    ["🌿 Vine Whip", 13, "whipped the opponent with a vine!"],
    ["🐿️ Squirrel Hitman", 18, "hired a squirrel to handle the problem!"],
    ["🌪️ Leaf Tornado", 16, "created a tiny but furious leaf tornado!"],
    ["☀️ Solar Smackdown", 20, "charged up under the sun and bonked with solar power!"],
    ["🍎 Fruit Fling", 12, "flung fruit with suspicious confidence!"],
    ["🐦 Bird Bonk", 11, "bonked the opponent with a bird-assisted attack!"],
    ["🌎 Rootquake", 19, "shook the ground with a rootquake!"],
    ["🌲 Forest Fury", 21, "unleashed the fury of the entire forest!"],
    ["🪓 Fake Axe Attack", 8, "pretended to be an axe and caused emotional damage!"],
    ["✨ Sparkle Blast", 18, "fired a ridiculous blast of sparkles!"]
  ],
  defense: [
    ["🛡️ Bark Armor", 10, "hardened its bark and reduced incoming damage."],
    ["🌳 Hide Behind a Bush", 9, "disappeared behind a suspiciously convenient bush."],
    ["🏰 Root Fortress", 12, "built a fortress of roots around itself."],
    ["🌳 I Am Literally Just a Tree", 8, "stood there so confidently that the attack barely worked."],
    ["🍃 Leaf Shield", 10, "formed a swirling leaf shield."],
    ["🪵 Maximum Bark", 13, "activated MAXIMUM BARK."],
    ["🧥 Leaf Cloak", 9, "wrapped itself in a dramatic leaf cloak."],
    ["🪵 Log Shield", 11, "blocked with a conveniently nearby log."],
    ["🌿 Vine Barrier", 12, "raised a tangled vine barrier."],
    ["🌱 Root Lock", 10, "anchored itself to the ground."],
    ["☂️ Umbrella Branches", 9, "deployed umbrella-shaped branches."],
    ["🍃 Tree Camouflage", 11, "became even more tree-like somehow."],
    ["🏠 Birdhouse Fortress", 12, "hid behind an entire birdhouse fortress."],
    ["🍄 Mushroom Wall", 10, "summoned a wall of mushrooms."],
    ["🏰 Bark Fortress", 14, "turned its bark into a tiny castle."],
    ["✨ Sparkle Shield", 12, "raised a sparkling shield."],
    ["😴 Nap Defense", 8, "took a nap and somehow reduced the damage."],
    ["🦝 Raccoon Bodyguard", 13, "hired a raccoon bodyguard."],
    ["🌈 Rainbow Barrier", 14, "raised a rainbow barrier."],
    ["💅 Dramatic Pose", 7, "hit a dramatic pose and confused the attacker."]
  ]
};

const BATTLE_COSMETIC_ABILITIES = {
  cotton_candy: { startHp: 10 },
  cherry: { regen: 8 },
  full_cherry: { startHp: 5, regen: 5 },
  shadow: { attackBonus: 3 },
  pine: { defenseBonus: 0.08 },
  red: { attackBonus: 5 },
  soul: { fatalSave: true },
  halloween_tree: { scareChance: 0.25 },
  kitty_tree: { counterChance: 0.25, counterDamage: 8 },
  green_glow: { specialBonus: 5 },
  stoned_birthday: { regen: 3 }
};

const BATTLE_EFFECT_ABILITIES = {
  hearts: { healOnAttack: 5 },
  butterflies: { dodgeChance: 0.15 },
  purr_princess: { confuseChance: 0.20, specialMove: "Royal Purr" },
  green_glow: { specialBonus: 4, specialMove: "Toxic Glow" },
  prism_flutter: { specialMove: "Prism Flurry" },
  lavender_twilight: { specialMove: "Moonlight Lullaby" },
  world_of_flags: { specialMove: "Global Rally" },
  ocean_opal: { specialMove: "Bubble Burst" },
  werewives: { specialMove: "Werewolf Howl" },
  halloween: { specialMove: "Spook" },
  candy_rush: { specialMove: "Candy Rush" }
};

const BATTLE_DECORATION_ABILITIES = {
  pumpkin_cat: { healOnDefend: 6 },
  panda: { damageReduction: 0.10 },
  cat: { dodgeChance: 0.12 },
  stoned_balloon: { dodgeChance: 0.08 }
};

const BATTLE_BACKGROUND_ABILITIES = {
  candyland: { startHp: 10 },
  halloween: { scareChance: 0.15 },
  magic_mushroom: { randomEffect: true },
  field_day: { defenseBonus: 0.05 },
  red_forest: { attackBonus: 4 },
  cozy_cat: { regen: 5 },
  green_glow: { specialBonus: 3 },
  stoned_birthday: { startHp: 5 }
};

const BATTLE_SHOP_ITEMS = {
  mystery_juice: { name: "🧃 Mystery Juice", price: 20000, description: "Randomly heals 10–30 HP or adds 8–15 attack damage on your next hit." },
  mega_acorn: { name: "🌰 Mega Acorn", price: 35000, description: "Your next attack deals +20 damage." },
  suspicious_mushroom: { name: "🍄 Suspicious Mushroom", price: 50000, description: "Randomly grants +20 HP, +15 attack, or +25% dodge for the battle." },
  emergency_bark: { name: "🪵 Emergency Bark", price: 60000, description: "Instantly heals 25 HP." },
  raccoon_contract: { name: "🦝 Raccoon Contract", price: 90000, description: "Summon a raccoon to deal 18 damage and reduce the opponent's next attack by 5." },
  thunder_acorn: { name: "⚡ Thunder Acorn", price: 125000, description: "Deal 28 damage and stun the opponent's next action." },
  sparkle_armor: { name: "✨ Sparkle Armor", price: 150000, description: "Reduce incoming damage by 25% for the rest of the battle." },
  inferno_root: { name: "🔥 Inferno Root", price: 200000, description: "Deal 35 damage, but take 5 recoil damage." },
  royal_root_crown: { name: "👑 Royal Root Crown", price: 250000, description: "Heal 10 HP and gain +5 attack for the rest of the battle." },
  cosmic_seed: { name: "🌌 Cosmic Seed", price: 300000, description: "Fully charge your Special move and heal 15 HP." },
  chaos_potion: { name: "🌀 Chaos Potion", price: 400000, description: "Randomly heal, damage, or swap 10 HP between the trees." },
  second_chance_seed: { name: "🌱 Second Chance Seed", price: 500000, description: "If you would be defeated, survive once at 1 HP." },
  forbidden_acorn: { name: "☠️ Forbidden Acorn", price: 650000, description: "Deal 45 damage, but reduce your own max HP by 10." },
  world_tree_seed: { name: "🌳 World Tree Seed", price: 800000, description: "Heal 35 HP and permanently gain +3 defense." },
  rainbow_heart: { name: "🌈 Rainbow Heart", price: 900000, description: "Heal 20 HP, gain 20% dodge, and charge your Special." },
  ultimate_tree_relic: { name: "💎 Ultimate Tree Relic", price: 1000000, description: "Heal 40 HP and make your next attack guaranteed to hit for +25 damage." }
};

function battleShopItems(player) {
  if (!player.battleShop) player.battleShop = {};
  return player.battleShop;
}

function getBattleAbility(player) {
  const tree = BATTLE_COSMETIC_ABILITIES[player.equipped?.tree] || {};
  const effect = BATTLE_EFFECT_ABILITIES[player.equipped?.effect] || {};
  const background = BATTLE_BACKGROUND_ABILITIES[player.equipped?.theme] || {};
  const decoration = BATTLE_DECORATION_ABILITIES[player.equipped?.decoration] || {};
  return {
    startHp: Number(tree.startHp || 0) + Number(background.startHp || 0),
    regen: Number(tree.regen || 0) + Number(background.regen || 0),
    attackBonus: Number(tree.attackBonus || 0) + Number(background.attackBonus || 0),
    defenseBonus: Number(tree.defenseBonus || 0) + Number(background.defenseBonus || 0),
    dodgeChance: Number(effect.dodgeChance || 0) + Number(decoration.dodgeChance || 0),
    healOnAttack: Number(effect.healOnAttack || 0),
    healOnDefend: Number(decoration.healOnDefend || 0),
    damageReduction: Number(decoration.damageReduction || 0),
    scareChance: Number(tree.scareChance || 0) + Number(background.scareChance || 0),
    counterChance: Number(tree.counterChance || 0),
    counterDamage: Number(tree.counterDamage || 0),
    fatalSave: Boolean(tree.fatalSave),
    confuseChance: Number(effect.confuseChance || 0),
    specialBonus: Number(tree.specialBonus || 0) + Number(effect.specialBonus || 0) + Number(background.specialBonus || 0),
    randomEffect: Boolean(background.randomEffect),
    specialMove: effect.specialMove || ""
  };
}

function battleMaxHp(player) {
  return 100 + Math.max(0, Number(player.level || 1) - 1) * 6 + getBattleAbility(player).startHp;
}

function battleNewPlayerState(player) {
  const maxHp = battleMaxHp(player);
  return {
    userId: player.userId,
    name: getDisplayName(player),
    treeImage: getTreeImage(player),
    level: Number(player.level || 1),
    maxHp,
    hp: maxHp,
    special: 0,
    defending: false,
    stunned: false,
    confused: false,
    soulUsed: false,
    secondChanceUsed: false,
    battleItems: {},
    nextAttackBonus: 0,
    defenseBonus: 0,
    dodgeBonus: 0,
    guaranteedNextHit: false,
    cosmeticAbility: getBattleAbility(player)
  };
}


/* =========================================================
   MULTI-GAME STORAGE
   Color Chaos and Tree Battle each get their own KV record so
   multiple matches can run in the same server without overwriting
   one another. Legacy single-game records are still readable.
========================================================= */
function pastelGameKey(guildId,gameId){return `pastel-game:${guildId}:${gameId}`;}
function battleGameKey(guildId,gameId){return `tree-battle:${guildId}:${gameId}`;}

async function getPastelGame(env,guildId,gameId){
  if(!guildId||!gameId)return null;
  const raw=await env.TREE_DATA.get(pastelGameKey(guildId,gameId));
  if(raw){try{return JSON.parse(raw);}catch(error){console.error("Color Chaos game parse failed:",error);}}
  const state=await getGuildState(env,guildId);
  if(state.pastel?.id===gameId)return state.pastel;
  return null;
}

async function listPastelGames(env,guildId){
  const games=[];const seen=new Set();let cursor;
  do{
    const result=await env.TREE_DATA.list({prefix:`pastel-game:${guildId}:`,cursor});
    for(const key of result.keys){
      const raw=await env.TREE_DATA.get(key.name);
      if(!raw)continue;
      try{const game=JSON.parse(raw);if(game?.id&&!seen.has(game.id)){seen.add(game.id);games.push(game);}}catch(error){console.error("Color Chaos game list parse failed:",error);}
    }
    cursor=result.list_complete?undefined:result.cursor;
  }while(cursor);
  const state=await getGuildState(env,guildId);
  if(state.pastel?.id&&!seen.has(state.pastel.id)){seen.add(state.pastel.id);games.push(state.pastel);}
  return games;
}

async function savePastelGame(env,game){
  if(!game?.guildId||!game?.id)return false;
  const existing=await getPastelGame(env,game.guildId,game.id);
  if(existing?.status==="lobby"&&game.status==="lobby")game.players={...(existing.players||{}),...(game.players||{})};
  await env.TREE_DATA.put(pastelGameKey(game.guildId,game.id),JSON.stringify(game));
  const state=await getGuildState(env,game.guildId);
  if(state.pastel?.id===game.id){state.pastel=null;await saveGuildState(env,game.guildId,state);}
  return true;
}

async function deletePastelGame(env,game){
  if(!game?.guildId||!game?.id)return;
  await env.TREE_DATA.delete(pastelGameKey(game.guildId,game.id));
  const state=await getGuildState(env,game.guildId);
  if(state.pastel?.id===game.id){state.pastel=null;await saveGuildState(env,game.guildId,state);}
}

async function findPastelGameForUser(env,guildId,userId){
  const games=await listPastelGames(env,guildId);
  return games.find(g=>g?.status!=="ended"&&g.players?.[userId]?.alive!==false&&g.players?.[userId])||null;
}

async function getBattleGame(env,guildId,gameId){
  if(!guildId||!gameId)return null;
  const raw=await env.TREE_DATA.get(battleGameKey(guildId,gameId));
  if(raw){try{return JSON.parse(raw);}catch(error){console.error("Tree Battle game parse failed:",error);}}
  const state=await getGuildState(env,guildId);
  if(state.battle?.id===gameId)return state.battle;
  return null;
}

async function listBattleGames(env,guildId){
  const games=[];const seen=new Set();let cursor;
  do{
    const result=await env.TREE_DATA.list({prefix:`tree-battle:${guildId}:`,cursor});
    for(const key of result.keys){
      const raw=await env.TREE_DATA.get(key.name);
      if(!raw)continue;
      try{const game=JSON.parse(raw);if(game?.id&&!seen.has(game.id)){seen.add(game.id);games.push(game);}}catch(error){console.error("Tree Battle game list parse failed:",error);}
    }
    cursor=result.list_complete?undefined:result.cursor;
  }while(cursor);
  const state=await getGuildState(env,guildId);
  if(state.battle?.id&&!seen.has(state.battle.id)){seen.add(state.battle.id);games.push(state.battle);}
  return games;
}

async function saveBattleGame(env,game){
  if(!game?.guildId||!game?.id)return false;
  await env.TREE_DATA.put(battleGameKey(game.guildId,game.id),JSON.stringify(game));
  const state=await getGuildState(env,game.guildId);
  if(state.battle?.id===game.id){state.battle=null;await saveGuildState(env,game.guildId,state);}
  return true;
}

async function deleteBattleGame(env,game){
  if(!game?.guildId||!game?.id)return;
  await env.TREE_DATA.delete(battleGameKey(game.guildId,game.id));
  const state=await getGuildState(env,game.guildId);
  if(state.battle?.id===game.id){state.battle=null;await saveGuildState(env,game.guildId,state);}
}

async function findBattleForUser(env,guildId,userId){
  const games=await listBattleGames(env,guildId);
  return games.find(g=>g?.status==="playing"&&g.players?.[userId])||null;
}

function makeBattleGame(guildId, challenger, opponent) {
  return {
    id: `battle-${Date.now()}-${randomInt(1000,9999)}`,
    guildId,
    status: "playing",
    turn: challenger.userId,
    round: 1,
    createdAt: Date.now(),
    players: {
      [challenger.userId]: battleNewPlayerState(challenger),
      [opponent.userId]: battleNewPlayerState(opponent)
    },
    log: ["🌳⚔️ **TREE BATTLE BEGINS!** The trees are already judging each other."],
    shopItemsUsed: []
  };
}

function battleOpponent(game, userId) {
  return Object.values(game.players).find(p => p.userId !== userId) || null;
}

function battlePlayer(game, userId) {
  return game.players?.[userId] || null;
}

function battleComponents(game) {
  const current = battlePlayer(game, game.turn);
  const disabled = !current || current.hp <= 0 || game.status !== "playing";
  return [
    row(
      button("🌿 ATTACK", `battle:attack:${game.id}`, 1, disabled),
      button("🛡️ DEFEND", `battle:defend:${game.id}`, 3, disabled),
      button("✨ SPECIAL", `battle:special:${game.id}`, 2, disabled)
    ),
    row(
      button("🎒 ITEM MOVES", `battle:items:${game.id}`, 2, disabled),
      button("🚪 Forfeit", `battle:forfeit:${game.id}`, 4, disabled)
    )
  ];
}

function battleText(game) {
  const ps = Object.values(game.players);
  const a = ps[0], b = ps[1];
  const turnName = battlePlayer(game, game.turn)?.name || "Nobody";
  return [
    `🌳⚔️ **TREE BATTLE** — Round ${game.round}`,
    "",
    `🌳 **${a.name}** — Lvl ${a.level} — ❤️ **${Math.max(0,a.hp)}/${a.maxHp} HP**`,
    `🌳 **${b.name}** — Lvl ${b.level} — ❤️ **${Math.max(0,b.hp)}/${b.maxHp} HP**`,
    "",
    `🎯 **${turnName}'s turn**`,
    "",
    (game.log || []).slice(-5).join("\n")
  ].join("\n");
}

async function renderBattleImage(env, game) {
  let browser;
  try {
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 700, deviceScaleFactor: 1});
    const ps = Object.values(game.players);
    const left = imageUrl(ps[0].treeImage);
    const right = imageUrl(ps[1].treeImage);
    const html = `<!doctype html><html><head><meta charset="UTF-8"><style>
      *{box-sizing:border-box}body{margin:0;background:#fff;overflow:hidden;font-family:Arial,sans-serif}
      #battle{width:1200px;height:700px;display:flex;align-items:center;justify-content:space-around;position:relative}
      .tree{width:42%;height:600px;object-fit:contain}.vs{font-size:90px;font-weight:900;z-index:5}
    </style></head><body><div id="battle"><img class="tree" src="${left}"><div class="vs">VS</div><img class="tree" src="${right}"></div></body></html>`;
    await page.setContent(html,{waitUntil:"load"});
    await page.evaluate(async()=>Promise.all(Array.from(document.images).map(img=>new Promise(r=>{if(img.complete)r();else{img.onload=r;img.onerror=r}}))));
    return await page.screenshot({type:"png"});
  } catch (error) {
    const message = error?.message || String(error);
    if (message.includes("429") || message.toLowerCase().includes("rate limit")) throw new Error("Cloudflare Browser Rendering is rate-limited right now. Please wait a little before rendering another battle.");
    throw error;
  } finally { if (browser) try { await browser.close(); } catch {} }
}

async function sendBattleMessage(env, interaction, game) {
  const image = await renderBattleImage(env, game);
  const form = new FormData();
  form.append("payload_json", JSON.stringify({content:battleText(game),attachments:[{id:0,filename:"battle.png"}],components:battleComponents(game)}));
  form.append("files[0]", new Blob([image],{type:"image/png"}),"battle.png");
  const response=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${interaction.token}/messages/@original`,{method:"PATCH",body:form});
  if(!response.ok){
    const detail=await response.text();
    console.error("Battle message update failed:",response.status,detail);
    throw new Error(`Battle message update failed (${response.status})`);
  }
  return response;
}

async function handleBattleStart(env, interaction) {
  if (await checkGamePunishment(env, interaction)) return;

  const user = getUserFromInteraction(interaction);
  if (!user) return;
  if (!interaction.guild_id) return sendText(env,interaction,"❌ Tree Battle can only be played inside a server.");
  const target = getOption(interaction,"user");
  if (!target || target === user.id) return sendText(env,interaction,"❌ Choose another player to battle.");
  const activeBattles=await listBattleGames(env,interaction.guild_id);
  if(activeBattles.some(g=>g.status==="playing"&&(g.players?.[user.id]||g.players?.[target])))return sendText(env,interaction,"❌ One of those players is already in an active Tree Battle.");
  const state = await getGuildState(env,interaction.guild_id);
  const challenger = await getPlayer(env,user.id); updatePlayerIdentity(challenger,interaction); await savePlayer(env,challenger);
  const opponent = await getPlayer(env,target);
  if (!opponent.userId) opponent.userId = target;
  if (!opponent.displayName) opponent.displayName = "Werewife";
  const game = makeBattleGame(interaction.guild_id,challenger,opponent);
  for (const bp of Object.values(game.players)) {
    if (bp.cosmeticAbility?.randomEffect) {
      const roll = randomInt(1,3);
      if (roll === 1) { bp.hp = Math.min(bp.maxHp, bp.hp + 15); bp.battleStartEffect = "🍄 Magic Mushroom: +15 starting HP"; }
      else if (roll === 2) { bp.nextAttackBonus += 10; bp.battleStartEffect = "🍄 Magic Mushroom: next attack +10 damage"; }
      else { bp.dodgeBonus += 0.15; bp.battleStartEffect = "🍄 Magic Mushroom: +15% dodge"; }
      game.log.push(`🍄 **${bp.name}** triggered ${bp.battleStartEffect}.`);
    }
  }
  game.interactionToken = interaction.token;
  await saveBattleGame(env,game);
  try { await sendBattleMessage(env,interaction,game); } catch(error) { await editOriginalResponse(env,interaction,{content:`🌳⚔️ Battle started, but I couldn't render the battle image.\n\n${error?.message||"Unknown error"}`,components:battleComponents(game)}); }
}

function battleApplyDamage(target, amount) {
  let damage = Math.max(0, Math.floor(amount));
  if (target.defending) damage = Math.max(1, Math.floor(damage * 0.45));
  if (Number(target.cosmeticAbility?.damageReduction || 0) > 0) damage = Math.max(1, Math.floor(damage * Math.max(0.25, 1 - Number(target.cosmeticAbility.damageReduction))));
  if (Number(target.defenseBonus || 0) > 0) damage = Math.max(1, Math.floor(damage * Math.max(0.25, 1 - Number(target.defenseBonus))));
  if (target.cosmeticAbility?.dodgeChance && Math.random() < target.cosmeticAbility.dodgeChance + Number(target.dodgeBonus || 0)) return {damage:0,dodged:true};
  if (target.hp - damage <= 0) {
    if (target.cosmeticAbility?.fatalSave && !target.soulUsed) { target.soulUsed=true; target.hp=1; return {damage:0,saved:true}; }
    if (target.secondChanceReady && !target.secondChanceUsed) { target.secondChanceUsed=true; target.hp=1; return {damage:0,saved:true}; }
  }
  target.hp = Math.max(0,target.hp-damage);
  return {damage};
}

async function finishBattle(env, game, winnerId, loserId, reason) {
  game.status="ended";
  const winner = battlePlayer(game,winnerId), loser = battlePlayer(game,loserId);
  game.log.push(reason);
  const winnerPlayer = await getPlayer(env,winnerId);
  const loserPlayer = await getPlayer(env,loserId);
  winnerPlayer.battleWins = Number(winnerPlayer.battleWins||0)+1;
  winnerPlayer.battleStreak = Number(winnerPlayer.battleStreak||0)+1;
  winnerPlayer.battleBestStreak = Math.max(Number(winnerPlayer.battleBestStreak||0), Number(winnerPlayer.battleStreak||0));
  if (Number(winner?.hp||0) <= 20) winnerPlayer.battleLowHpWins = Number(winnerPlayer.battleLowHpWins||0)+1;
  if (!Array.isArray(winnerPlayer.titles)) winnerPlayer.titles=[];
  const newlyUnlockedBattleTitles=[]; const unlockBattleTitle=id=>{if(!winnerPlayer.titles.includes(id)){winnerPlayer.titles.push(id);newlyUnlockedBattleTitles.push(id);}};
  unlockBattleTitle("battle_champion");
  if(winnerPlayer.battleWins>=5)unlockBattleTitle("battle_brawler");
  if(winnerPlayer.battleBestStreak>=3)unlockBattleTitle("battle_streak");
  if(winnerPlayer.battleWins>=10)unlockBattleTitle("battle_master");
  if(winnerPlayer.battleWins>=25)unlockBattleTitle("battle_legend");
  if(Number(winner?.hp||0)<=20)unlockBattleTitle("battle_clutch");
  loserPlayer.battleLosses = Number(loserPlayer.battleLosses||0)+1;
  loserPlayer.battleStreak = 0;
  winnerPlayer.sparkles = Number(winnerPlayer.sparkles || 0) + BATTLE_WIN_REWARD;
  winnerPlayer.battleSparklesEarned = Number(winnerPlayer.battleSparklesEarned || 0) + BATTLE_WIN_REWARD;
  game.log.push(`✨ **${winner?.name || "Winner"}** banked **+${BATTLE_WIN_REWARD} sparkles** for winning the Tree Battle!`);
  if (newlyUnlockedBattleTitles.length) game.log.push(`🏷️ **New title unlocked:** ${newlyUnlockedBattleTitles.map(id => SOLO_TITLES[id]?.name || id).join(", ")}`);
  await savePlayer(env,winnerPlayer,winner.id); await savePlayer(env,loserPlayer,loser.id);
  await deleteBattleGame(env,game);
  await sendBattleMessage(env,{token:game.interactionToken},game).catch(()=>null);
}

async function handleBattleAction(env, interaction, action, gameId) {
  const state = await getGuildState(env,interaction.guild_id);
  const game = await getBattleGame(env,interaction.guild_id,gameId);
  const user = getUserFromInteraction(interaction);
  if (!game || game.id !== gameId || game.status !== "playing") return sendEphemeralFollowup(env,interaction,"❌ That Tree Battle is over or no longer exists.");
  if (!user || !game.players[user.id]) return sendEphemeralFollowup(env,interaction,"❌ You aren't in this Tree Battle.");
  if (game.turn !== user.id) return sendEphemeralFollowup(env,interaction,"⏳ It isn't your turn. The battle buttons stay available for the player whose turn it is.");
  game.interactionToken = interaction.token;
  const me = battlePlayer(game,user.id), foe = battleOpponent(game,user.id);
  if (Number(me.stunnedTurns||0)>0) { me.stunnedTurns=Math.max(0,Number(me.stunnedTurns)-1); game.turn=foe.userId; game.log.push(`😵 **${me.name}** is stunned and lost this turn!`); await saveBattleGame(env,game); return sendBattleMessage(env,interaction,game); }
  if (me.stunned) { me.stunned=false; game.turn=foe.userId; game.log.push(`😵 **${me.name}** was stunned and lost their turn!`); await saveBattleGame(env,game); return sendBattleMessage(env,interaction,game); }
  if (me.confused && Math.random()<0.5) { me.confused=false; game.log.push(`🤪 **${me.name}** got confused and did absolutely nothing.`); game.turn=foe.userId; await saveBattleGame(env,game); return sendBattleMessage(env,interaction,game); }
  me.defending = false;
  const ability = me.cosmeticAbility || {};
  if (action === "attack") {
    const move = BATTLE_MOVES.attack[randomInt(0,BATTLE_MOVES.attack.length-1)];
    let damage = move[1] + Number(ability.attackBonus||0) + Number(me.nextAttackBonus||0);
    if (foe.cosmeticAbility?.scareChance && Math.random() < foe.cosmeticAbility.scareChance) { damage = Math.max(1, Math.floor(damage * 0.55)); game.log.push(`🎃 **${foe.name}** scared the attacker! Damage was reduced.`); }
    if (me.guaranteedNextHit) me.guaranteedNextHit=false;
    const savedDodge = foe.cosmeticAbility?.dodgeChance;
    if (me.guaranteedNextHit && foe.cosmeticAbility) foe.cosmeticAbility.dodgeChance = 0;
    const result = battleApplyDamage(foe,damage);
    if (foe.cosmeticAbility && savedDodge !== undefined) foe.cosmeticAbility.dodgeChance = savedDodge;
    me.nextAttackBonus=0;
    me.special=Math.min(100,me.special+25);
    if (ability.healOnAttack) me.hp=Math.min(me.maxHp,me.hp+ability.healOnAttack);
    if (result.dodged) game.log.push(`🦋 **${me.name}** used **${move[0]}**, but **${foe.name}** dodged!`);
    else game.log.push(`🌿 **${me.name}** ${move[2]} **${foe.name}** took **${result.damage} damage**.`);
    if (result.saved) game.log.push(`💎 **${foe.name}** survived at **1 HP**!`);
    if (ability.confuseChance && Math.random() < ability.confuseChance) { foe.confused = true; game.log.push(`👑 **${foe.name}** is confused by the battle effect!`); }
    if (foe.hp<=0) { await finishBattle(env,game,me.userId,foe.userId,`🏆 **${me.name} WINS!** The opponent's tree has been defeated.`); return; }
    if (ability.counterChance && Math.random()<ability.counterChance && foe.hp>0) { const c=battleApplyDamage(me,ability.counterDamage||8); game.log.push(`🐱 **${foe.name}** counterattacked for **${c.damage} damage**!`); if(me.hp<=0){await finishBattle(env,game,foe.userId,me.userId,`🏆 **${foe.name} WINS!** The counterattack finished the battle.`);return;} }
  } else if (action === "defend") {
    const move=BATTLE_MOVES.defense[randomInt(0,BATTLE_MOVES.defense.length-1)];
    me.defending=true; me.special=Math.min(100,me.special+15); if(ability.healOnDefend) me.hp=Math.min(me.maxHp,me.hp+ability.healOnDefend); game.log.push(`🛡️ **${me.name}** used **${move[0]}** — ${move[2]}${ability.healOnDefend?` (+${ability.healOnDefend} HP)`:""}`);
  } else if (action === "special") {
    if (me.special<100) return sendEphemeralFollowup(env,interaction,`❌ Your Special is only **${me.special}%** charged.`);
    me.special=0;
    const specialName=ability.specialMove || "Tree Cataclysm";
    let damage=30+Number(ability.specialBonus||0)+randomInt(-4,8);
    if(specialName==="Bubble Burst") damage=34;
    if(specialName==="Spook") damage=24;
    if(specialName==="Prism Flurry") damage=38;
    if(specialName==="Moonlight Lullaby") damage=28;
    if(specialName==="Global Rally") damage=31;
    if(specialName==="Werewolf Howl") damage=36;
    if(specialName==="Toxic Glow") damage=33;
    if(specialName==="Candy Rush") damage=32;
    if(specialName==="Royal Purr") damage=29;
    const result=battleApplyDamage(foe,damage);
    if(specialName==="Bubble Burst") foe.stunnedTurns=Math.max(Number(foe.stunnedTurns||0),1);
    if(specialName==="Spook") foe.stunnedTurns=Math.max(Number(foe.stunnedTurns||0),2);
    if(specialName==="Moonlight Lullaby") foe.stunnedTurns=Math.max(Number(foe.stunnedTurns||0),1);
    if(specialName==="Prism Flurry") me.dodgeBonus=Math.max(Number(me.dodgeBonus||0),0.25);
    if(specialName==="Toxic Glow") me.hp=Math.min(me.maxHp,me.hp+12);
    if(specialName==="Werewolf Howl") foe.confused=true;
    if(specialName==="Global Rally") me.hp=Math.min(me.maxHp,me.hp+10);
    if(specialName==="Candy Rush") me.hp=Math.min(me.maxHp,me.hp+8);
    if(specialName==="Royal Purr") foe.confused=true;
    me.hp=Math.min(me.maxHp,me.hp+Number(ability.regen||0));
    game.log.push(`✨ **${me.name}** unleashed **${specialName}** for **${result.damage} damage**!`);
    if(foe.hp<=0){await finishBattle(env,game,me.userId,foe.userId,`🏆 **${me.name} WINS!** Their **${specialName}** ended the battle.`);return;}
  } else return sendEphemeralFollowup(env,interaction,"❌ Invalid battle action.");
  game.round++;
  game.turn=foe.userId;
  await saveBattleGame(env,game);
  try { await sendBattleMessage(env,interaction,game); } catch(error) { await editOriginalResponse(env,interaction,{content:`${battleText(game)}\n\n⚠️ Battle image couldn't be refreshed: ${error?.message||"Unknown error"}`,components:battleComponents(game)}); }
}

async function handleBattleForfeit(env, interaction, gameId) {
  const state=await getGuildState(env,interaction.guild_id); const game=await getBattleGame(env,interaction.guild_id,gameId); const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||!user||!game.players[user.id]) return sendEphemeralFollowup(env,interaction,"❌ That battle is no longer active.");
  const foe=battleOpponent(game,user.id); if(!foe) return sendEphemeralFollowup(env,interaction,"❌ Battle opponent not found.");
  game.interactionToken = interaction.token;
  await finishBattle(env,game,foe.userId,user.id,`🚪 **${battlePlayer(game,user.id).name} forfeited!** The other tree wins.`);
}

async function handleBattleItems(env, interaction, gameId) {
  const state=await getGuildState(env,interaction.guild_id); const game=await getBattleGame(env,interaction.guild_id,gameId); const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing") return sendEphemeralFollowup(env,interaction,"❌ That battle is no longer active.");
  if(game.turn!==user.id) return sendEphemeralFollowup(env,interaction,"⏳ It isn't your turn. The battle buttons stay available for the player whose turn it is.");
  const player=await getPlayer(env,user.id); const owned=battleShopItems(player);
  const ownedIds=Object.entries(owned).filter(([id,count])=>Number(count)>0).map(([id])=>id);
  if(!ownedIds.length) return sendEphemeralFollowup(env,interaction,"🎒 You don't have any Tree Battle items. Use `/battleshop` to shop.");
  const rows=[]; for(let i=0;i<ownedIds.length;i+=5) rows.push(row(...ownedIds.slice(i,i+5).map(id=>button(`${BATTLE_SHOP_ITEMS[id]?.name||id}`.slice(0,80),`battleitem:${game.id}:${id}`,2))));
  rows.push(row(button("⬅️ Back",`battle:back:${game.id}`,2)));
  await sendText(env,interaction,"🎒 **YOUR TREE BATTLE ITEMS**\n\nChoose an item to use:",rows);
}

async function useBattleItem(env,interaction,gameId,itemId) {
  const state=await getGuildState(env,interaction.guild_id); const game=await getBattleGame(env,interaction.guild_id,gameId); const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing") return sendEphemeralFollowup(env,interaction,"❌ Battle is no longer active.");
  if(game.turn!==user.id) return sendEphemeralFollowup(env,interaction,"⏳ It isn't your turn. The battle buttons stay available for the player whose turn it is.");
  const def=BATTLE_SHOP_ITEMS[itemId]; if(!def) return sendEphemeralFollowup(env,interaction,"❌ Unknown battle item.");
  const player=await getPlayer(env,user.id); const inv=battleShopItems(player); if(Number(inv[itemId]||0)<=0) return sendEphemeralFollowup(env,interaction,"❌ You don't own that item.");
  inv[itemId]--; await savePlayer(env,player);
  const me=battlePlayer(game,user.id), foe=battleOpponent(game,user.id);
  let msg="";
  if(itemId==="mystery_juice"){if(Math.random()<0.5){const h=randomInt(10,30);me.hp=Math.min(me.maxHp,me.hp+h);msg=`🧃 Mystery Juice healed **${h} HP**!`;}else{const d=randomInt(8,15);me.nextAttackBonus+=d;msg=`🧃 Mystery Juice gave your next attack **+${d} damage**!`;}}
  if(itemId==="mega_acorn"){me.nextAttackBonus+=20;msg="🌰 Your next attack gets **+20 damage**!";}
  if(itemId==="suspicious_mushroom"){const r=randomInt(1,3);if(r===1){me.hp=Math.min(me.maxHp,me.hp+20);msg="🍄 The mushroom gave you **+20 HP**!";}else if(r===2){me.nextAttackBonus+=15;msg="🍄 The mushroom gave your next attack **+15 damage**!";}else{me.dodgeBonus+=0.25;msg="🍄 The mushroom gave you **+25% dodge**!";}}
  if(itemId==="emergency_bark"){me.hp=Math.min(me.maxHp,me.hp+25);msg="🪵 Emergency Bark healed **25 HP**!";}
  if(itemId==="raccoon_contract"){const r=battleApplyDamage(foe,18);foe.nextAttackBonus=Math.max(-5,Number(foe.nextAttackBonus||0)-5);msg=`🦝 Raccoon Contract dealt **${r.damage} damage** and weakened the next attack!`;}
  if(itemId==="thunder_acorn"){const r=battleApplyDamage(foe,28);foe.stunned=true;msg=`⚡ Thunder Acorn dealt **${r.damage} damage** and stunned the opponent!`;}
  if(itemId==="sparkle_armor"){me.defenseBonus+=0.25;msg="✨ Sparkle Armor activated! Incoming damage is reduced.";}
  if(itemId==="inferno_root"){const r=battleApplyDamage(foe,35);me.hp=Math.max(1,me.hp-5);msg=`🔥 Inferno Root dealt **${r.damage} damage** with 5 recoil damage!`;}
  if(itemId==="royal_root_crown"){me.hp=Math.min(me.maxHp,me.hp+10);me.nextAttackBonus+=5;msg="👑 Royal Root Crown healed **10 HP** and gave **+5 attack**!";}
  if(itemId==="cosmic_seed"){me.hp=Math.min(me.maxHp,me.hp+15);me.special=100;msg="🌌 Cosmic Seed healed **15 HP** and fully charged Special!";}
  if(itemId==="chaos_potion"){const r=randomInt(1,3);if(r===1){me.hp=Math.min(me.maxHp,me.hp+30);msg="🌀 Chaos Potion healed **30 HP**!";}else if(r===2){const d=25;const hit=battleApplyDamage(foe,d);msg=`🌀 Chaos Potion blasted the opponent for **${hit.damage} damage**!`;}else{const transfer=Math.min(10,Math.max(0,foe.hp));foe.hp=Math.max(1,foe.hp-transfer);me.hp=Math.min(me.maxHp,me.hp+transfer);msg=`🌀 Chaos Potion swapped **${transfer} HP**!`;}}
  if(itemId==="second_chance_seed"){me.secondChanceReady=true;msg="🌱 Second Chance Seed is ready. You can survive one defeat at 1 HP.";}
  if(itemId==="forbidden_acorn"){const r=battleApplyDamage(foe,45);me.maxHp=Math.max(1,me.maxHp-10);me.hp=Math.min(me.hp,me.maxHp);msg=`☠️ Forbidden Acorn dealt **${r.damage} damage**, but reduced your max HP by 10.`;}
  if(itemId==="world_tree_seed"){me.hp=Math.min(me.maxHp,me.hp+35);me.defenseBonus+=0.10;msg="🌳 World Tree Seed healed **35 HP** and added +10% defense.";}
  if(itemId==="rainbow_heart"){me.hp=Math.min(me.maxHp,me.hp+20);me.dodgeBonus+=0.20;me.special=100;msg="🌈 Rainbow Heart healed **20 HP**, added dodge, and charged Special!";}
  if(itemId==="ultimate_tree_relic"){me.hp=Math.min(me.maxHp,me.hp+40);me.guaranteedNextHit=true;me.nextAttackBonus+=25;msg="💎 Ultimate Tree Relic healed **40 HP** and supercharged your next attack!";}
  game.log.push(`${msg}`); if(foe.hp<=0){await finishBattle(env,game,me.userId,foe.userId,`🏆 **${me.name} WINS!** A battle item finished the fight.`);return;}
  game.turn=foe.userId; game.round++; await saveBattleGame(env,game);
  try{await sendBattleMessage(env,interaction,game);}catch(error){await editOriginalResponse(env,interaction,{content:`${battleText(game)}\n\n⚠️ ${error?.message||"Battle image error"}`,components:battleComponents(game)});}
}

async function handleBattleEnd(env,interaction){
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Tree Battle is server-only.");
  const user=getUserFromInteraction(interaction);
  let game=await findBattleForUser(env,interaction.guild_id,user?.id);
  if(!game&&user?.id===env.OWNER_ID){
    const active=(await listBattleGames(env,interaction.guild_id)).filter(g=>g.status==="playing");
    if(active.length===1)game=active[0];
    else if(active.length>1)return sendText(env,interaction,"❌ Multiple Tree Battles are active. Use the **Forfeit**/battle controls on the specific battle you want to manage.");
  }
  if(!game||game.status!=="playing")return sendText(env,interaction,"❌ There is no active Tree Battle involving you.");
  if(!user||(!game.players?.[user.id]&&user.id!==env.OWNER_ID))return sendText(env,interaction,"❌ Only a battle participant or the bot owner can end this battle.");
  await deleteBattleGame(env,game);
  if(game.interactionToken)await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${game.interactionToken}/messages/@original`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"🛑 **TREE BATTLE ENDED**\n\nThe battle was manually ended. No winner was recorded.",components:[]})}).catch(()=>null);
  await sendText(env,interaction,"🛑 Tree Battle ended and its saved state was cleared.");
}
async function handleBattleShop(env,interaction){
  const user=getUserFromInteraction(interaction); if(!user)return;
  const player=await getPlayer(env,user.id); const lines=Object.entries(BATTLE_SHOP_ITEMS).map(([id,x])=>`**${x.name}** — 💰 ${x.price.toLocaleString()} ✨\n${x.description}`).join("\n\n");
  const rows=[]; const ids=Object.keys(BATTLE_SHOP_ITEMS); for(let i=0;i<ids.length;i+=2) rows.push(row(...ids.slice(i,i+2).map(id=>button(`Buy ${BATTLE_SHOP_ITEMS[id].name}`.slice(0,80),`bshop:buy:${id}`,2))));
  await sendText(env,interaction,`⚔️ **TREE BATTLE SHOP**\n\n${lines}\n\nUse your sparkles to buy battle-only items.`,rows);
}

async function handleBattleShopBuy(env,interaction,itemId){
  const def=BATTLE_SHOP_ITEMS[itemId]; const user=getUserFromInteraction(interaction); if(!def||!user)return;
  const player=await getPlayer(env,user.id); if(Number(player.sparkles||0)<def.price)return sendText(env,interaction,"❌ You don't have enough sparkles for that item.");
  player.sparkles-=def.price; const inv=battleShopItems(player); inv[itemId]=Number(inv[itemId]||0)+1; await savePlayer(env,player); await sendText(env,interaction,`🛍️ Bought **${def.name}** for **${def.price.toLocaleString()} ✨**! You now own **${inv[itemId]}**.`);
}

/* COLOR CHAOS UPDATE 2026-09: Refresh, HEX checker, 5P Star, palette expansion, stability hardening, Name Effect cleanup */
/* =========================================================
   COLOR CHAOS
   1v1 = 32x32 square. 3P = 20-row triangular board with exactly
   400 cells (1+3+5+...+39). 4P = 32x32 square.
========================================================= */

function colorCheckerPng(hex){
  const safe=String(hex||"").toUpperCase();
  const width=900,height=520;
  const frame=solidRGBA(width,height,safe);
  const border=24;
  for(let y=border;y<height-border;y++){
    for(const x of [border,width-border-1]){
      const o=(y*width+x)*4;
      frame.data[o]=255; frame.data[o+1]=255; frame.data[o+2]=255;
    }
  }
  for(let x=border;x<width-border;x++){
    for(const y of [border,height-border-1]){
      const o=(y*width+x)*4;
      frame.data[o]=255; frame.data[o+1]=255; frame.data[o+2]=255;
    }
  }
  return rgbaToRgbPng(frame);
}
const COLOR_CHAOS_PALETTES = {
  pastel_dreams: {
    name:"Pastel Dreams", icon:"🌈", powerCell:"💗",
    colors:[
      {id:"cotton_candy_kiss",name:"Supr Pink",hex:"#d982b1",label:"🩷"},
      {id:"marine_blue",name:"Marine Blue",hex:"#9fc7e8",label:"💙"},
      {id:"lemon_meringue",name:"Yellow Bean",hex:"#f7e6a6",label:"💛"},
      {id:"sage_sauce",name:"Sage Sauce",hex:"#b8d6bd",label:"💚"},
      {id:"lavender_lullaby",name:"Purple Stone",hex:"#d7b9f2",label:"💜"},
      {id:"savvy_cocoa",name:"Savvy Cocoa",hex:"#b89b8a",label:"🤎"},
      {id:"coral_crush",name:"Coral Coal",hex:"#f2a9a9",label:"❤️"},
      {id:"devu_dew",name:"Devu Dew",hex:"#86b3a5",label:"🩵"}
    ],
    heartColor:"#ef9fbd", wildColor:"#FFFFFF", boardColor:"#3b1834"
  },
  haunted_harvest: {
    name:"Haunted Harvest", icon:"🎃", powerCell:"🎃",
    colors:[
      {id:"pumpkin",name:"Pumpkin",hex:"#8f3d18",label:"🎃"},
      {id:"midnight",name:"Midnight",hex:"#17171b",label:"🌑"},
      {id:"haunted_purple",name:"Haunted Purple",hex:"#3f205c",label:"💜"},
      {id:"frankengreen",name:"Frankengreen",hex:"#254d2b",label:"🧟"},
      {id:"blood_red",name:"Blood Red",hex:"#5c1616",label:"🩸"},
      {id:"graveyard_gray",name:"Graveyard Gray",hex:"#3e4147",label:"🪦"},
      {id:"witchy_teal",name:"Witchy Teal",hex:"#17454a",label:"🧪"},
      {id:"bone_beige",name:"Bone Beige",hex:"#75674f",label:"🦴"}
    ],
    heartColor:"#5a3218", wildColor:"#FFFFFF", boardColor:"#100f12"
  },
  teddy_bear: {
    name:"Teddy Bear", icon:"🧸", powerCell:"🎀",
    colors:[
      {id:"vanilla_bean",name:"Vanilla Bean",hex:"#F5E6C8",label:"🤍"},
      {id:"teddy_blush",name:"Teddy Blush",hex:"#D98F9A",label:"🌸"},
      {id:"toasty_tan",name:"Toasty Tan",hex:"#B8875A",label:"🥨"},
      {id:"teddy_fur",name:"Teddy Fur",hex:"#955D35",label:"🧸"},
      {id:"chestnut_cozy",name:"Chestnut Cozy",hex:"#693C28",label:"🌰"},
      {id:"cocoa_bear",name:"Cocoa Bear",hex:"#3D251B",label:"🍫"},
      {id:"berry_blush",name:"Berry Blush",hex:"#B85C78",label:"🌸"},
      {id:"honey_gold",name:"Honey Gold",hex:"#D9B44A",label:"🌼"}
    ],
    heartColor:"#D98F9A", wildColor:"#FFFFFF", boardColor:"#2A1D19"
  },
  candy_shop: {
    name:"Candy Shop", icon:"🍬", powerCell:"🍬",
    colors:[
      {id:"sour_apple",name:"Sour Apple",hex:"#7ED957",label:"💚"},
      {id:"lemon_drop",name:"Lemon Drop",hex:"#FFE066",label:"💛"},
      {id:"peach_fizz",name:"Peach Fizz",hex:"#FFB38A",label:"🍑"},
      {id:"bubblegum",name:"Bubblegum",hex:"#FF6FA7",label:"💗"},
      {id:"blue_raspberry",name:"Blue Raspberry",hex:"#4FD1FF",label:"🩵"},
      {id:"grape_pop",name:"Grape Pop",hex:"#B36BFF",label:"💜"},
      {id:"blueberry_blast",name:"Blueberry Blast",hex:"#3157B7",label:"🫐"},
      {id:"cherry_twist",name:"Cherry Twist",hex:"#E83E52",label:"🍒"}
    ],
    heartColor:"#FFB7D7", wildColor:"#FFFFFF", boardColor:"#FFF0F8"
  },
  strawberry_galaxy: {
    name:"Strawberry Galaxy", icon:"🍓", powerCell:"🍓",
    colors:[
      {id:"berry_rose",name:"Berry Rose",hex:"#E08AA8",label:"🌹"},
      {id:"strawberry",name:"Strawberry",hex:"#FF6B8B",label:"🍓"},
      {id:"cosmic_pink",name:"Cosmic Pink",hex:"#D83FA3",label:"💖"},
      {id:"cosmic_purple",name:"Cosmic Purple",hex:"#A05BCB",label:"💜"},
      {id:"galaxy_blue",name:"Galaxy Blue",hex:"#4B7ED9",label:"💙"},
      {id:"midnight",name:"Midnight",hex:"#1B1E3F",label:"🌌"},
      {id:"solar_orange",name:"Solar Orange",hex:"#F28C28",label:"🟠"},
      {id:"starlight_mint",name:"Starlight Mint",hex:"#63C9B8",label:"🟢"}
    ],
    heartColor:"#D83FA3", wildColor:"#FFFFFF", boardColor:"#11152E"
  },
  enchanted_garden: {
    name:"Enchanted Garden", icon:"🌿", powerCell:"🌼",
    colors:[
      {id:"spring_leaf",name:"Spring Leaf",hex:"#8BCB70",label:"🍃"},
      {id:"meadow_green",name:"Meadow Green",hex:"#5FAF70",label:"🌱"},
      {id:"forest_moss",name:"Forest Moss",hex:"#2E6B3F",label:"🌲"},
      {id:"buttercup",name:"Buttercup",hex:"#F4D76B",label:"🌼"},
      {id:"sky_blossom",name:"Sky Blossom",hex:"#7FB8E9",label:"🩵"},
      {id:"twilight_purple",name:"Twilight Purple",hex:"#5B3FA6",label:"💜"},
      {id:"sunset_orange",name:"Sunset Orange",hex:"#F4A259",label:"🍊"},
      {id:"garden_red",name:"Garden Red",hex:"#E04B5A",label:"🌺"}
    ],
    heartColor:"#F4D76B", wildColor:"#FFFFFF", boardColor:"#163B2A"
  }
};
const PASTEL_CLASSIC_COLOR_COUNT=6;
function pastelPalette(game){return COLOR_CHAOS_PALETTES[game?.palette]||COLOR_CHAOS_PALETTES.pastel_dreams;}
function pastelColors(game){return pastelPalette(game).colors;}
function pastelColorCount(game){const palette=pastelPalette(game);return Math.min(game?.needed>=4?8:PASTEL_CLASSIC_COLOR_COUNT,palette.colors.length);}
function pastelColorsForGame(game){return pastelColors(game).slice(0,pastelColorCount(game));}
const PASTEL_HEART_COLOR="#ef9fbd";
const PASTEL_WILD_COLOR="#fffaf2";
const PASTEL_REGEN={1:5,3:7,4:10,5:12};

function pastelRatingLevel(rating){return Math.max(0,Math.floor(Math.max(0,Number(rating||0))/100));}
function pastelStats(player){
  const rating=Math.max(0,Number(player.pastelRating||0));
  player.pastelLevel=pastelRatingLevel(rating);
  return {rating,level:player.pastelLevel,wins:Number(player.pastelWins||0),losses:Number(player.pastelLosses||0),quits:Number(player.pastelQuits||0),gamesPlayed:Number(player.pastelGamesPlayed||0)};
}
function pastelHasPlayed(player){
  return Number(player?.pastelGamesPlayed||0)>0||Number(player?.pastelWins||0)>0||Number(player?.pastelLosses||0)>0||Number(player?.pastelQuits||0)>0;
}
function pastelCornerName(game,p){
  if(game.mode==='triangle') return Number(p.slot)===0?'Top Point':Number(p.slot)===1?'Bottom Left':'Bottom Right';
  if(game.mode==='star') return ['Top Point','Upper Right Point','Lower Right Point','Lower Left Point','Upper Left Point'][Number(p.slot)]||'Star Point';
  if(game.needed===2) return Number(p.slot)===0?'Top Left':'Bottom Right';
  return Number(p.slot)===0?'Top Left':Number(p.slot)===1?'Top Right':Number(p.slot)===2?'Bottom Left':'Bottom Right';
}
function pastelPlayerAssignments(game){
  return pastelStartingPlayers(game).map(p=>{
    const colorIndex=Number.isInteger(Number(p.selectedColor))?Number(p.selectedColor):Number(p.slot)%pastelColorCount(game);
    const color=pastelColors(game)[colorIndex]||pastelColors(game)[Number(p.slot)%pastelColorCount(game)];
    return `• ${color.label} **${color.name}** — <@${p.id}> — 📍 **${pastelCornerName(game,p)}**`;
  }).join("\n");
}
function pastelNeighbors(board,r,c,mode){
  const h=board.length; const out=[];
  if(mode==="triangle"){
    const width=board[r]?.length||0;
    if(c>0)out.push([r,c-1]);
    if(c<width-1)out.push([r,c+1]);
    /* IMPORTANT: triangle cells that only touch at a corner are NOT neighbors.
       With the centered 1,3,5...39 layout, each cell shares an edge with only
       one cell in the row above and one in the row below. */
    if(r>0)out.push([r-1,c-1]);
    if(r<h-1)out.push([r+1,c+1]);
  }else{
    const w=board[0]?.length||0;
    if(r>0)out.push([r-1,c]);if(r<h-1)out.push([r+1,c]);if(c>0)out.push([r,c-1]);if(c<w-1)out.push([r,c+1]);
  }
  const seen=new Set();
  return out.filter(([rr,cc])=>board[rr]&&board[rr][cc]&&(!seen.has(`${rr},${cc}`)&&(seen.add(`${rr},${cc}`),true)));
}
function pastelCellCount(mode){return mode==="triangle"?400:mode==="star"?476:1024;}
function pastelPointInPolygon(x,y,points){
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const xi=points[i][0],yi=points[i][1],xj=points[j][0],yj=points[j][1];
    if(((yi>y)!=(yj>y))&&x<((xj-xi)*(y-yi))/(yj-yi)+xi)inside=!inside;
  }
  return inside;
}
function pastelStarMask(r,c){
  const center=20.5,outer=20,inner=8,points=[];
  for(let i=0;i<10;i++){
    const angle=-Math.PI/2+i*Math.PI/5;
    const radius=i%2===0?outer:inner;
    points.push([center+radius*Math.cos(angle),center+radius*Math.sin(angle)]);
  }
  return pastelPointInPolygon(c+0.5,r+0.5,points);
}
function pastelGenerateBoard(mode,players,palette="pastel_dreams"){
  const board=[];
  const rows=mode==="triangle"?20:mode==="star"?41:32;
  const width=mode==="triangle"?null:mode==="star"?41:32;
  const colorCount=Math.min(players.length>=4?8:PASTEL_CLASSIC_COLOR_COUNT,pastelPalette({palette,needed:players.length}).colors.length);
  for(let r=0;r<rows;r++){
    const rowWidth=width||2*r+1;
    board.push(Array.from({length:rowWidth},(_,c)=>{
      const blocked=mode==="star"&&!pastelStarMask(r,c);
      return {color:randomInt(0,colorCount-1),owner:blocked?"blackout":null,heart:false,wild:false,blocked};
    }));
  }
  /* Seed fair starting points and give each player one safe starting cell. */
  const starts=mode==="triangle"
    ? [[1,0],[18,0],[18,36]]
    : mode==="star"
      ? [[1,20],[14,38],[35,31],[35,9],[14,2]]
      : players.length<=2
        ? [[0,0],[31,31]]
        : [[0,0],[0,31],[31,0],[31,31]];
  players.forEach((p,i)=>{
    const slot=Number.isInteger(Number(p.slot))?Number(p.slot):i;
    const [r,c]=starts[slot]||starts[i]||starts[0];
    if(board[r]?.[c]&&!board[r][c].blocked){
      board[r][c].owner=p.id;board[r][c].color=slot%colorCount;board[r][c].start=true;board[r][c].heart=false;board[r][c].wild=false;
    }
  });
  /* Every board gets at least 2 visible Power Cells, with a chance for more. */
  let hearts=2+randomInt(0,4),attempts=0;
  while(hearts>0&&attempts<20000){
    attempts++;const r=randomInt(0,board.length-1),c=randomInt(0,board[r].length-1),cell=board[r][c];
    if(cell.blocked||cell.owner||cell.heart)continue;
    cell.heart=true;cell.wild=false;hearts--;
  }
  let visibleHearts=0;
  for(const row of board)for(const cell of row)if(cell.heart&&!cell.owner)visibleHearts++;
  if(visibleHearts<2){for(let r=0;r<board.length&&visibleHearts<2;r++)for(let c=0;c<board[r].length&&visibleHearts<2;c++){const cell=board[r][c];if(cell.blocked||cell.owner||cell.heart)continue;cell.heart=true;cell.wild=false;visibleHearts++;}}
  return board;
}
function pastelStartingPlayers(game){return Object.values(game.players||{}).sort((a,b)=>a.slot-b.slot);}
function pastelFindOwned(game,userId){return Object.values(game.players).find(p=>p.id===userId)||null;}
function pastelClaimedCells(game,userId){let n=0;for(const row of game.board)for(const c of row)if(c.owner===userId)n++;return n;}
function pastelTerritoryTotal(game){let n=0;for(const row of game.board)for(const c of row)if(c.owner&&c.owner!=="blackout")n++;return n;}
function pastelAdjacentColors(game,player){
  const colors=new Set();
  for(let r=0;r<game.board.length;r++)for(let c=0;c<game.board[r].length;c++){
    const cell=game.board[r][c];
    if(cell.owner!==player.id)continue;
    for(const [rr,cc] of pastelNeighbors(game.board,r,c,game.mode)){
      const n=game.board[rr][cc];
      if(n.owner===player.id||n.owner==='blackout')continue;
      if(n.owner===null||n.wild)colors.add(n.color);
    }
  }
  return [...colors];
}
function pastelOpponentColors(game,player){
  const colors=new Set();
  for(const p of pastelStartingPlayers(game)){
    if(p.id===player.id||p.alive===false)continue;
    const color=Number(p.selectedColor);
    if(Number.isInteger(color)&&pastelColors(game)[color]&&color<pastelColorCount(game))colors.add(color);
  }
  return colors;
}
function pastelAvailableColors(game,player){
  const blocked=pastelOpponentColors(game,player);
  const own=Number(player?.selectedColor);
  const heartColors=new Set();
  for(let r=0;r<game.board.length;r++)for(let c=0;c<game.board[r].length;c++){
    const cell=game.board[r][c];
    if(cell.owner!==player.id)continue;
    for(const [rr,cc] of pastelNeighbors(game.board,r,c,game.mode)){
      const n=game.board[rr]?.[cc];
      if(n?.owner===null&&n.heart)heartColors.add(Number(n.color));
    }
  }
  return pastelColorsForGame(game).map((_,i)=>i).filter(i=>i!==own&&(!blocked.has(i)||heartColors.has(i)));
}
function pastelFlood(game,player,color){
  const board=game.board;
  const seen=new Set();
  const queue=[];
  let capturedHearts=0;

  /* Start from every cell already owned by this player. */
  for(let r=0;r<board.length;r++)for(let c=0;c<board[r].length;c++){
    if(board[r][c].owner===player.id)queue.push([r,c]);
  }

  while(queue.length){
    const [r,c]=queue.shift();
    const key=`${r},${c}`;
    if(seen.has(key))continue;
    seen.add(key);
    const cell=board[r][c];

    for(const [rr,cc] of pastelNeighbors(board,r,c,game.mode)){
      const n=board[rr][cc];
      const nk=`${rr},${cc}`;
      if(seen.has(nk))continue;

      /* HARD RULE: NEVER capture, recolor, or traverse another player's territory. */
      if(n.owner && n.owner!==player.id && n.owner!=='blackout')continue;
      if(n.owner==='blackout')continue;

      const blockedColor=pastelOpponentColors(game,player).has(color);
      /* A Power Cell is special: if it is directly reachable, it can be claimed
         even when its underlying color belongs to another player's current color.
         Normal cells still obey the no-opponent-color rule. */
      const capturable = n.owner===null && (
        n.heart || (!blockedColor && (n.color===color || n.wild))
      );
      if(!capturable)continue;

      if(n.heart)capturedHearts++;
      n.owner=player.id;
      n.color=color;
      n.wild=false;
      n.heart=false;
      queue.push([rr,cc]);
    }
  }

  return {capturedHearts};
}
function pastelValidColor(game,player,color){return pastelAdjacentColors(game,player).includes(color);}function pastelColorCanCapture(game,player,color){
  const board=game.board||[];
  const seen=new Set();
  const queue=[];
  for(let r=0;r<board.length;r++)for(let c=0;c<board[r].length;c++){
    if(board[r][c]?.owner===player.id)queue.push([r,c]);
  }
  while(queue.length){
    const [r,c]=queue.shift();
    for(const [rr,cc] of pastelNeighbors(board,r,c,game.mode)){
      const cell=board[rr]?.[cc]; if(!cell)continue;
      if(cell.owner && cell.owner!==player.id)continue;
      if(cell.owner==="blackout")continue;
      if(cell.owner===player.id)continue;
      const key=`${rr},${cc}`; if(seen.has(key))continue;
      const matches=cell.wild||cell.color===color;
      if(!matches)continue;
      seen.add(key);
      return true;
    }
  }
  return false;
}
function pastelPlayerHasLegalMove(game,player){
  if(!player?.alive)return false;
  return pastelAvailableColors(game,player).some(color=>pastelColorCanCapture(game,player,color));
}
function pastelPlayersWithLegalMoves(game){
  return pastelStartingPlayers(game).filter(p=>pastelPlayerHasLegalMove(game,p));
}
function pastelAnyLegalMoves(game){
  return pastelPlayersWithLegalMoves(game).length>0;
}
async function pastelPublishEndMessage(env,game,content){
  const oldMessageId=game?.publicMessageId||"";
  if(!game?.channelId)return false;
  const payload={content,components:[],attachments:[]};
  if(oldMessageId){
    const updated=await discordRequest(env,`/channels/${game.channelId}/messages/${oldMessageId}`,{
      method:"PATCH",
      body:JSON.stringify(payload)
    });
    if(updated.ok)return true;
    if(updated.status!==404)console.error("Color Chaos end message update failed:",updated.status,await updated.text());
  }
  try{
    const created=await sendChannelMessage(env,game.channelId,content,[]);
    if(created?.id&&oldMessageId&&created.id!==oldMessageId){
      const removed=await discordRequest(env,`/channels/${game.channelId}/messages/${oldMessageId}`,{method:"DELETE"});
      if(!removed.ok&&removed.status!==404)console.error("Old Color Chaos end message could not be removed:",removed.status,await removed.text());
    }
    return Boolean(created?.id);
  }catch(error){
    console.error("Color Chaos end message publish failed:",error);
    return false;
  }
}
async function pastelFinishNoMoves(env,game,reason="🏁 No legal moves remained for the active players."){
  const winner=pastelWinner(game);
  if(!winner)return false;
  const results=await pastelFinish(env,game,winner.id,reason);
  await pastelPublishEndMessage(env,game,`🏁 **COLOR CHAOS OVER!**\n\n${reason}\n🏆 <@${winner.id}> wins with the largest territory!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,winner.id)}`);
  return true;
}

function pastelBoardTextLegend(game){return pastelColors(game).map(c=>`${c.label} ${c.name}`).join(" • ");}
function pastelRenderCell(game,cell){if(cell.owner&&cell.heart)return pastelPalette(game).powerCell;if(cell.heart)return pastelPalette(game).powerCell;if(cell.wild)return "⬜";return pastelColors(game)[cell.color]?.label||"⬜";}
function pastelAscii(game){
  return game.board.map((cells,r)=>{const prefix=game.mode==="triangle"?" ".repeat(19-r):"";return prefix+cells.map(cell=>pastelRenderCell(game,cell)).join("")}).join("\n");
}
function pastelGameText(game){
  const players=pastelStartingPlayers(game);
  const lines=players.map(p=>{
    const cells=pastelClaimedCells(game,p.id);
    const starting=Number(p.startingCells||1);
    const progress=Math.max(0,cells-starting);
    const progressMax=Math.max(1,pastelCellCount(game.mode)-starting);
    const pct=Math.min(100,Math.round(progress/progressMax*100));
    const colorIndex=Number.isInteger(Number(p.selectedColor))?Number(p.selectedColor):Number(p.slot)%pastelColorCount(game);
    const color=pastelColors(game)[colorIndex]||pastelColors(game)[Number(p.slot)%pastelColorCount(game)];
    return `• **${pct}%** — <@${p.id}> — ${color.label} **${color.name}**`;
  }).join("\n");
  const remaining=Math.max(0,Number(game.refreshEvery||0)-Number(game.turnsSinceRefresh||0));
  const reshuffleLabel=remaining===1?"1 turn":`${remaining} turns`;
  const turnLine=game.turnId?`🎯 **WHO'S TURN:** <@${game.turnId}>`:`🎯 **WHO'S TURN:** —`;
  return [`🌈 **COLOR CHAOS — ${game.modeLabel}**`,`${pastelPalette(game).icon} **${pastelPalette(game).name}**`,turnLine,``,lines,``,`🔄 **Reshuffle in: ${reshuffleLabel}**`].join("\n");
}
function pastelEndVoteCount(game){
  const active=Object.values(game.players||{}).filter(p=>p.alive!==false);
  const votes=Object.keys(game.endVotes||{}).filter(id=>active.some(p=>p.id===id)).length;
  return {votes,total:active.length};
}
function pastelColorKeyOrder(game){
  return pastelColorsForGame(game).map((color,index)=>({color,index,brightness:(()=>{
    const hex=String(color.hex||"#000000").replace("#","");
    const r=parseInt(hex.slice(0,2),16)||0, g=parseInt(hex.slice(2,4),16)||0, b=parseInt(hex.slice(4,6),16)||0;
    // Perceived brightness: weighted to match how bright a color actually looks to the eye.
    return Math.sqrt(0.299*r*r+0.587*g*g+0.114*b*b);
  })()})).sort((a,b)=>b.brightness-a.brightness);
}
function pastelColorKeyText(game){
  const ordered=pastelColorKeyOrder(game);
  const lines=ordered.map((entry,i)=>`${i+1}. ${entry.color.label} **${entry.color.name}** — \`${entry.color.hex.toUpperCase()}\``);
  return [
    `🎨 **COLOR KEY — LIGHTEST → DARKEST**`,
    ``,
    `${pastelPalette(game).icon} **${pastelPalette(game).name}**`,
    ``,
    ...lines,
    ``,
    `🌼 **Power Cell:** ${pastelPalette(game).powerCell}`,
    `⬜ **Wild Block:** special block — it takes the color you capture when connected.`
  ].join("\n");
}
function pastelChoiceComponents(game){
  const p=pastelFindOwned(game,game.turnId);if(!p)return[];
  const colors=pastelAvailableColors(game,p);const rows=[];
  const buttons=colors.map(i=>button(`${pastelColors(game)[i].label} ${pastelColors(game)[i].name}`.slice(0,80),`pastel:choose:${game.id}:${i}`,2));
  for(let i=0;i<buttons.length;i+=2)rows.push(row(...buttons.slice(i,i+2)));
  const vote=pastelEndVoteCount(game);
  rows.push(row(button("🎨 Color Key",`pastel:colorkey:${game.id}`,2),button("📖 Rules",`pastel:rules:${game.id}`,2),button("🔄 Refresh",`pastel:refresh:${game.id}`,2)));
  rows.push(row(button("🚪 Quit Game",`pastel:quit:${game.id}`,4),button(`🛑 End Game (${vote.votes}/${vote.total})`,`pastel:endvote:${game.id}`,4)));
  return rows;
}
function pastelLobbyComponents(game){
  const vote=pastelEndVoteCount(game);
  /* Discord component rows are shared by everyone viewing the public message,
     so Palette cannot literally be hidden per-user. The component is host-only
     by enforcement in handlePastelPalette; non-host clicks are rejected. */
  return [row(button("💗 Join Game",`pastel:join:${game.id}`,1)),row(button("🎨 Palette",`pastel:palette:menu:${game.id}`,2),button("📖 How to Play","pastel:rules:menu",2)),row(button("🚪 Cancel",`pastel:cancel:${game.id}`,4)),row(button(`🛑 End Game (${vote.votes}/${vote.total})`,`pastel:endvote:${game.id}`,4))];
}
function colorChaosPaletteComponents(selected="pastel_dreams"){
  const items=[
    ["pastel_dreams","🌈 Pastel Dreams",1],
    ["haunted_harvest","🎃 Haunted Harvest",3],
    ["teddy_bear","🧸 Teddy Bear",2],
    ["candy_shop","🍬 Candy Shop",1],
    ["strawberry_galaxy","🍓 Strawberry Galaxy",2],
    ["enchanted_garden","🌿 Enchanted Garden",3]
  ];
  const rows=[];
  for(let i=0;i<items.length;i+=3){
    rows.push(row(...items.slice(i,i+3).map(([id,label,style])=>button(`${selected===id?"✅ ":""}${label}`,`pastel:palette:${id}`,style))));
  }
  rows.push(row(button("⬅️ Back to Create","pastel:palette:back",2)));
  return rows;
}
function pastelModeComponents(selectedPalette="pastel_dreams"){return [row(button("💗 1v1",`pastel:mode:1`,1),button("🌸 3 Player",`pastel:mode:3`,2),button("🌈 4 Player",`pastel:mode:4`,3),button("⭐ 5 Player",`pastel:mode:5`,2)),row(button("📖 How to Play","pastel:rules:menu",2),button(`🎨 ${COLOR_CHAOS_PALETTES[selectedPalette]?.name||"Pastel Dreams"}`,"pastel:palette:menu",2))];}
function pastelModeInfo(mode){return mode===1?{mode:"square",modeLabel:"1v1",needed:2}:mode===3?{mode:"triangle",modeLabel:"3 Player Triangle",needed:3}:mode===4?{mode:"square24",modeLabel:"4 Player",needed:4}:{mode:"star",modeLabel:"5 Player Star",needed:5};}
function pastelLobbyText(game){return [`🌈 **COLOR CHAOS — ${game.modeLabel}**`,`${pastelPalette(game).icon} **${pastelPalette(game).name}**`,``,`👑 Host: <@${game.hostId}>`,`👥 Players: **${Object.keys(game.players).length}/${game.needed}**`,``,Object.values(game.players).map(p=>`• <@${p.id}>`).join("\n"),"",Object.keys(game.players).length>=game.needed?"✨ Everyone is here! The game will start now.":"⏳ Waiting for players to join...",`🛑 **End Game votes:** ${pastelEndVoteCount(game).votes}/${pastelEndVoteCount(game).total} (everyone must agree)`,"",`🔺 3 Player mode uses a **large 20-row triangular board with 400 cells**.
⭐ 5 Player mode uses a **large star-shaped board with 476 playable cells**.`,`${pastelPalette(game).powerCell} Power Cells grant an immediate extra turn • ⬜ Wild Blocks expand with your color.`].join("\n");}
function pastelRulesText(){const paletteLines=Object.values(COLOR_CHAOS_PALETTES).map(p=>`${p.icon} **${p.name}:** ${p.colors.map(c=>c.label+" "+c.name).join(" • ")} • ${p.powerCell} Power Cells`).join("\n");return [`🌈 **COLOR CHAOS — HOW TO PLAY**`,``,`🎨 Choose a color touching your current territory. Your connected territory expands into that color.`,`✨ Absorb a Power Cell for an **immediate extra turn**.`,`⬜ Wild Blocks automatically become the color you just captured when connected.`,`🔄 Board regeneration: **1v1 every 5 turns • 3P every 7 • 4P every 10 • 5P every 12**.`,`🏆 Biggest territory wins, unless someone reaches a mathematically unbeatable lead.`,`🚪 Quitting counts as a **loss** and increments your **Rage Quit** count.`,``,`🛑 **End Game:** every active player must agree. The bot owner can force-end immediately.`,``,`🎨 **PALETTES**`,paletteLines].join("\n");}
function pastelGameIsUnbeatable(game){const total=pastelCellCount(game.mode);const alive=Object.values(game.players).filter(p=>p.alive);if(alive.length<=1)return true;const leader=Math.max(...alive.map(p=>pastelClaimedCells(game,p.id)));const others=total-leader;return leader>others;}
function pastelWinner(game){return pastelStartingPlayers(game).filter(p=>p.alive).sort((a,b)=>pastelClaimedCells(game,b.id)-pastelClaimedCells(game,a.id))[0]||null;}
function pastelRegenerate(game){
  const oldBoard=game.board||[];
  const newBoard=pastelGenerateBoard(game.mode,pastelStartingPlayers(game),game.palette);

  /* HARD REFRESH RULE: preserve every existing owned/blackout cell at the exact
     same coordinate. Only cells that were truly unclaimed may be randomized. */
  for(let r=0;r<oldBoard.length;r++)for(let c=0;c<oldBoard[r].length;c++){
    const old=oldBoard[r][c];
    const cell=newBoard[r]?.[c];
    if(!old||!cell)continue;
    if(old.owner){
      cell.owner=old.owner;
      cell.color=old.owner==='blackout'?0:Number(old.color);
      cell.start=old.owner==='blackout'?false:!!old.start;
      cell.heart=false;
      cell.wild=false;
    }else{
      cell.owner=null;
      cell.color=randomInt(0,pastelColorCount(game)-1);
      cell.start=false;
      cell.heart=false;
      cell.wild=Math.random()<0.075;
    }
  }

  /* Only unclaimed cells receive fresh Hearts/Wild Blocks. */
  /* Every refreshed board gets at least 2 visible Heart Power Cells, with a chance for more. */
  let hearts=2+randomInt(0,4);
  let attempts=0;
  while(hearts>0&&attempts<10000){
    attempts++;
    const r=randomInt(0,newBoard.length-1);
    const c=randomInt(0,newBoard[r].length-1);
    const cell=newBoard[r][c];
    if(cell.owner||cell.heart||cell.wild)continue;
    cell.heart=true;
    cell.wild=false;
    hearts--;
  }
  game.board=newBoard;
  game.turnsSinceRefresh=0;
  game.refreshCount=Number(game.refreshCount||0)+1;
  const visibleHearts=newBoard.reduce((n,row)=>n+row.filter(cell=>cell.heart&&!cell.owner).length,0);
  game.lastRefresh=`🔄 **THE PASTEL BOARD REFRESHED!** Territories, colors, and blacked-out areas were preserved. ${pastelPalette(game).powerCell} **${visibleHearts} Power Cells spawned!**`;
}

async function pastelSave(env,game){
  return await savePastelGame(env,game);
}
function boardFill(frame,x,y,w,h,r,g,b,a=255){
  const x0=Math.max(0,Math.floor(x)),y0=Math.max(0,Math.floor(y)),x1=Math.min(frame.width,Math.ceil(x+w)),y1=Math.min(frame.height,Math.ceil(y+h));
  const sa=a/255;
  for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const o=(yy*frame.width+xx)*4;frame.data[o]=Math.round(r*sa+frame.data[o]*(1-sa));frame.data[o+1]=Math.round(g*sa+frame.data[o+1]*(1-sa));frame.data[o+2]=Math.round(b*sa+frame.data[o+2]*(1-sa));frame.data[o+3]=255;}
}
function boardLine(frame,x1,y1,x2,y2,r,g,b,a=255,width=3){
  const dx=x2-x1,dy=y2-y1,steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy)))),rad=Math.max(1,Math.ceil(width/2));
  for(let i=0;i<=steps;i++){const x=x1+dx*i/steps,y=y1+dy*i/steps;boardFill(frame,x-rad,y-rad,rad*2+1,rad*2+1,r,g,b,a);}
}
function boardCircle(frame,cx,cy,r,rgb,fill=true){
  const [rr,gg,bb]=rgb;
  for(let y=Math.floor(cy-r-1);y<=Math.ceil(cy+r+1);y++)for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++){const d=Math.hypot(x-cx,y-cy);if((fill&&d<=r)||(!fill&&d>=r-2&&d<=r+2))boardFill(frame,x,y,1,1,rr,gg,bb,255);}
}
async function renderPastelBoardBrowser(env,game){
  let browser;
  try{
    browser=await puppeteer.launch(env.BROWSER);
    const page=await browser.newPage();
    await page.setViewport({width:1040,height:1040,deviceScaleFactor:1});
    const size=game.mode==="triangle"?20:game.mode==="star"?22:30;
    const squareCells=32;
    const boardW=game.mode==="triangle"?39*size:squareCells*size;
    const boardH=game.mode==="triangle"?20*size:squareCells*size;
    const cellX=(r,c)=>game.mode==="triangle"?(19-r+c)*size:c*size;
    const sameOwner=(r,c,owner)=>!!(game.board[r]?.[c]&&game.board[r][c].owner===owner);
    const edgeSegments=[];
    const rects=[];
    const heartMarks=[];

    for(let r=0;r<game.board.length;r++){
      for(let c=0;c<game.board[r].length;c++){
        const cell=game.board[r][c];
        const x=cellX(r,c),y=r*size;
        let fill=pastelColors(game)[cell.color]?.hex||"#ffffff";
        if(cell.blocked)fill=pastelPalette(game).boardColor;
        else if(cell.owner==="blackout")fill="#202020";
        else if(cell.wild)fill=pastelPalette(game).wildColor;
        else if(cell.heart)fill=pastelPalette(game).heartColor;
        rects.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`);
        if(cell.heart&&!cell.owner){
          const cx=x+size/2,cy=y+size/2,rr=Math.max(10,Math.round(size*0.46));
          const symbol=pastelPalette(game).powerCell;
          const isDark=game.palette==="haunted_harvest"||game.palette==="strawberry_galaxy";
          heartMarks.push(`<circle cx="${cx}" cy="${cy}" r="${rr+5}" fill="${isDark?"#17131a":"#fff3f8"}" stroke="${pastelPalette(game).heartColor}" stroke-width="3"/><text x="${cx}" y="${y+size*0.79}" text-anchor="middle" font-family="Noto Color Emoji,Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="${Math.round(size*1.22)}" font-weight="900">${symbol}</text>`);
        }

        if(cell.blocked)continue;
        const owner=cell.owner;
        if(!owner)continue;
        const border=owner==="blackout"?"#fff":"#000";
        const edges=game.mode==="triangle"
          ? [[r-1,c-1,"top"],[r,c+1,"right"],[r+1,c+1,"bottom"],[r,c-1,"left"]]
          : [[r-1,c,"top"],[r,c+1,"right"],[r+1,c,"bottom"],[r,c-1,"left"]];
        for(const [rr,cc,side] of edges){
          if(sameOwner(rr,cc,owner))continue;
          if(side==="top")edgeSegments.push(`<line x1="${x}" y1="${y}" x2="${x+size}" y2="${y}" stroke="${border}" stroke-width="4" stroke-linecap="square"/>`);
          else if(side==="right")edgeSegments.push(`<line x1="${x+size}" y1="${y}" x2="${x+size}" y2="${y+size}" stroke="${border}" stroke-width="4" stroke-linecap="square"/>`);
          else if(side==="bottom")edgeSegments.push(`<line x1="${x}" y1="${y+size}" x2="${x+size}" y2="${y+size}" stroke="${border}" stroke-width="4" stroke-linecap="square"/>`);
          else edgeSegments.push(`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+size}" stroke="${border}" stroke-width="4" stroke-linecap="square"/>`);
        }
      }
    }

    /* Deduplicate identical boundary segments so the outline is one clean line,
       not stacked lines where two territory cells meet. */
    const seenEdges=new Set(),uniqueEdges=[];
    for(const seg of edgeSegments){
      const m=seg.match(/x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)" stroke="([^"]+)"/);
      if(!m){uniqueEdges.push(seg);continue;}
      const nums=[Number(m[1]),Number(m[2]),Number(m[3]),Number(m[4])];
      const key=`${Math.min(nums[0],nums[2])},${Math.min(nums[1],nums[3])},${Math.max(nums[0],nums[2])},${Math.max(nums[1],nums[3])},${m[5]}`;
      if(seenEdges.has(key))continue;seenEdges.add(key);uniqueEdges.push(seg);
    }

    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boardW} ${boardH}" width="${boardW}" height="${boardH}"><rect x="0" y="0" width="${boardW}" height="${boardH}" fill="${pastelPalette(game).boardColor}"/>${rects.join("")}${heartMarks.join("")}${uniqueEdges.join("")}</svg>`;
    const html=`<!doctype html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}html,body{margin:0;background:${pastelPalette(game).boardColor};overflow:hidden}.wrap{width:1040px;height:1040px;display:flex;align-items:center;justify-content:center}.board{width:${boardW}px;height:${boardH}px;background:${pastelPalette(game).boardColor};overflow:hidden}.board>svg{display:block;width:${boardW}px;height:${boardH}px}</style></head><body><div class="wrap"><div class="board">${svg}</div></div></body></html>`;
    await page.setContent(html,{waitUntil:"load"});
    return await page.screenshot({type:"png"});
  }catch(error){
    const m=error?.message||String(error);
    if(m.includes("429")||m.toLowerCase().includes("rate limit"))throw new Error("Cloudflare Browser Rendering is rate-limited right now. Please wait a little before rendering another Color Chaos board.");
    throw error;
  }finally{if(browser)try{await browser.close();}catch{}}
}

async function renderPastelBoard(env,game){
  /* Color Chaos is a pixel board. Rasterize it directly in the Worker so turns
     and Refresh never wait on Browser Rendering. */
  return renderPastelBoardDirectFallback(env,game);
}

function drawPastelPowerCellIcon(frame,cx,cy,cell,palette){
  const scale=Math.max(2,Math.floor(cell/10));
  const px=Math.max(1,Math.floor(scale*0.78));
  const outline=[20,16,24];
  const configs={
    pastel_dreams:{main:[255,105,170],light:[255,215,235],dark:[190,45,105],pattern:["01100110","11111111","11111111","01111110","00111100","00011000"]},
    haunted_harvest:{main:[245,120,28],light:[255,185,55],dark:[125,48,18],pattern:["0011100","0111110","1111111","1111111","1111111","0111110","0011100","0001000"]},
    teddy_bear:{main:[245,165,185],light:[255,215,225],dark:[150,85,105],pattern:["00110011","01111110","11111111","01111110","00111100","01100110","11111111"]},
    candy_shop:{main:[255,105,175],light:[255,220,245],dark:[190,45,125],pattern:["00111100","01111110","11111111","11111111","01111110","00111100"]},
    strawberry_galaxy:{main:[235,65,95],light:[255,150,165],dark:[145,25,55],pattern:["0011100","0111110","1111111","1111111","1111111","0111110","0011100","0001000"]},
    enchanted_garden:{main:[245,210,65],light:[255,245,155],dark:[165,125,25],pattern:["0011100","0111110","1111111","1111111","0111110","0011100","0001000"]}
  };
  const cfg=configs[palette]||configs.pastel_dreams;
  const pat=cfg.pattern,w=pat[0].length,h=pat.length;
  const ox=Math.round(cx-(w*px)/2),oy=Math.round(cy-(h*px)/2);
  for(let r=0;r<h;r++)for(let c=0;c<w;c++)if(pat[r][c]==="1")boardFill(frame,ox+c*px-1,oy+r*px-1,px+2,px+2,outline[0],outline[1],outline[2],255);
  for(let r=0;r<h;r++)for(let c=0;c<w;c++)if(pat[r][c]==="1"){
    const edge=r===0||c===0||r===h-1||c===w-1||pat[r-1]?.[c]!=="1"||pat[r+1]?.[c]!=="1"||pat[r]?.[c-1]!=="1"||pat[r]?.[c+1]!=="1";
    const col=edge?cfg.dark:cfg.main;
    boardFill(frame,ox+c*px,oy+r*px,px,px,col[0],col[1],col[2],255);
  }
  const hi=cfg.light;
  boardFill(frame,ox+px,oy+px,Math.max(1,px),Math.max(1,px),hi[0],hi[1],hi[2],255);
}

async function renderPastelBoardDirectFallback(env,game){
  const width=1040,height=1040;
  const bg=hexRgb(pastelPalette(game).boardColor||"#fff4fb");
  const frame=solidRGBA(width,height,bg);
  const rows=game.board?.length||0;
  const mode=game.mode;
  const maxCols=Math.max(1,...(game.board||[]).map(r=>r.length));
  const cell=Math.max(1,Math.floor(Math.min(30,Math.min((width-80)/maxCols,(height-80)/Math.max(1,rows)))));
  const boardW=maxCols*cell,boardH=rows*cell,ox=Math.round((width-boardW)/2),oy=Math.round((height-boardH)/2);
  const colors=pastelColors(game),edgeSeen=new Set();
  const sameOwner=(r,c,owner)=>!!(game.board?.[r]?.[c]&&game.board[r][c].owner===owner);
  for(let r=0;r<rows;r++)for(let c=0;c<(game.board[r]?.length||0);c++){
    const cellData=game.board[r][c];
    const rowOffset=mode==="triangle"?Math.floor((maxCols-(game.board[r]?.length||0))/2):0;
    const x=ox+(c+rowOffset)*cell,y=oy+r*cell;
    let fill=hexRgb(colors[cellData.color]?.hex||"#ffffff");
    if(cellData.owner==="blackout")fill=[32,32,32];else if(cellData.wild)fill=hexRgb(pastelPalette(game).wildColor);else if(cellData.heart)fill=hexRgb(pastelPalette(game).heartColor);
    boardFill(frame,x,y,cell,cell,fill[0],fill[1],fill[2],255);
    if(cellData.heart&&!cellData.owner){
      drawPastelPowerCellIcon(frame,Math.round(x+cell/2),Math.round(y+cell/2),cell,game.palette);
    }
    const owner=cellData.owner;if(!owner)continue;
    const border=owner==="blackout"?[255,255,255]:[0,0,0];
    const neighbors=mode==="triangle"?[[r-1,c-1,"top"],[r,c+1,"right"],[r+1,c+1,"bottom"],[r,c-1,"left"]]:[[r-1,c,"top"],[r,c+1,"right"],[r+1,c,"bottom"],[r,c-1,"left"]];
    for(const [rr,cc,side] of neighbors){
      if(sameOwner(rr,cc,owner))continue;
      let x1=x,y1=y,x2=x+cell,y2=y+cell;
      if(side==="top"){x2=x+cell;y2=y;}else if(side==="right"){x1=x+cell;y1=y;x2=x+cell;y2=y+cell;}else if(side==="bottom"){x1=x;y1=y+cell;x2=x+cell;y2=y+cell;}else{x1=x;y1=y;x2=x;y2=y+cell;}
      const key=[Math.min(x1,x2),Math.min(y1,y2),Math.max(x1,x2),Math.max(y1,y2),border.join(",")].join(":");if(edgeSeen.has(key))continue;edgeSeen.add(key);boardLine(frame,x1,y1,x2,y2,border[0],border[1],border[2],255,3);
    }
  }
  return rgbaToRgbPng(frame);
}

async function getPastelPublicMessageId(env,game,interaction){
  if(game?.publicMessageId)return game.publicMessageId;
  const token=interaction?.token||game?.interactionToken;
  if(!token)return "";
  try{
    const response=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${token}/messages/@original`);
    if(!response.ok)return "";
    const data=await response.json();
    if(data?.id){game.publicMessageId=data.id;return data.id;}
  }catch(error){console.error("Pastel public message lookup failed:",error);}
  return "";
}

async function pastelPublicUpdate(env,interaction,content,components=[],game=null){
  /* Color Chaos stores its public message as publicMessageId.
     Do NOT use islandPublicUpdate here; that helper belongs to Chaos Island
     and looks for game.messageId. */
  if(game?.channelId){
    let messageId=game.publicMessageId||"";
    if(!messageId) messageId=await getPastelPublicMessageId(env,game,interaction);
    if(messageId){
      const response=await discordRequest(env,`/channels/${game.channelId}/messages/${messageId}`,{
        method:"PATCH",
        body:JSON.stringify({content,components})
      });
      if(response.ok)return response;
      console.error("Color Chaos public message update failed:",response.status,await response.text());
      if(response.status===404){
        try{
          const created=await sendChannelMessage(env,game.channelId,content,components);
          if(created?.id){
            game.publicMessageId=created.id;
            await pastelSave(env,game);
            return new Response(null,{status:200});
          }
        }catch(error){console.error("Color Chaos public message recreation failed:",error);}
      }
      return response;
    }
  }
  if(interaction?.type===3&&!interaction.__deferred&&!interaction.__acknowledged)
    await acknowledge(env,interaction);
  const response=await editOriginalResponse(env,interaction,{content,components});
  if(!response.ok)console.error("Color Chaos fallback public update failed:",response.status,await response.text());
  return response;
}

async function sendPastelBoard(env,interaction,game){
  game.interactionToken=interaction?.token||game.interactionToken;
  const image=await renderPastelBoard(env,game);
  const components=pastelChoiceComponents(game);
  const payload={content:`${pastelGameText(game)}${game.lastRefresh?`\\n\\n${game.lastRefresh}`:""}`,attachments:[{id:0,filename:"color-chaos.png"}],components};
  const makeForm=()=>{const form=new FormData();form.append("payload_json",JSON.stringify(payload));form.append("files[0]",new Blob([image],{type:"image/png"}),"color-chaos.png");return form;};

  /*
     COLOR CHAOS BOARD REFRESH BEHAVIOR:
     Every board refresh creates the new board message FIRST, then removes
     the previous board message. This keeps the board at the bottom of the
     channel so it cannot get buried while everyone is chatting.
     The new message ID is saved immediately so the next refresh knows which
     board to replace.
  */
  const oldMessageId=game.publicMessageId||"";
  if(!game.channelId)throw new Error("Color Chaos channel is missing.");

  const created=await discordRequest(env,`/channels/${game.channelId}/messages`,{
    method:"POST",
    body:makeForm()
  });

  if(!created.ok){
    const status=created.status;
    const detail=await created.text();
    console.error("Color Chaos board send failed:",status,detail);
    throw new Error(`Color Chaos board send failed (${status})`);
  }

  let newMessageId="";
  try{
    const data=await created.json();
    newMessageId=data?.id||"";
  }catch(error){
    console.error("Color Chaos board response JSON failed:",error);
  }

  if(!newMessageId)throw new Error("Color Chaos board was sent but Discord did not return a message ID.");

  game.publicMessageId=newMessageId;
  await pastelSave(env,game);

  if(oldMessageId&&oldMessageId!==newMessageId){
    const removed=await discordRequest(env,`/channels/${game.channelId}/messages/${oldMessageId}`,{
      method:"DELETE"
    });
    if(!removed.ok&&removed.status!==404){
      console.error("Old Color Chaos board could not be removed:",removed.status,await removed.text());
    }
  }

  return created;
}
async function handlePastelEndCommand(env,interaction){
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Color Chaos is server-only.");
  const user=getUserFromInteraction(interaction);
  const game=await findPastelGameForUser(env,interaction.guild_id,user?.id);
  if(!game||game.status==="ended")return sendText(env,interaction,"❌ There is no active Color Chaos game.");
  if(user?.id===env.OWNER_ID){await pastelForceEnd(env,game,interaction,"👑 The Werewives bot owner force-ended Color Chaos.");return sendText(env,interaction,"👑 Color Chaos was force-ended and its saved state was cleared.");}
  if(!user||!game.players?.[user.id]||game.players[user.id].alive===false)return sendText(env,interaction,"❌ Only an active player can request to end Color Chaos.");
  const vote=pastelEndVoteCount(game);
  await sendText(env,interaction,`🛑 **End Color Chaos?**\n\nEveryone currently playing must agree before the game is ended.\n\nCurrent agreement: **${vote.votes}/${vote.total}**`,[row(button("🛑 I Agree — End Game",`pastel:endvote:${game.id}`,4))]);
}
async function handleColorChecker(env,interaction){
  const raw=String(getOption(interaction,"hex")||"").trim();
  const cleaned=raw.replace(/^#/,'');
  if(!/^[0-9A-Fa-f]{6}$/.test(cleaned)){
    return sendText(env,interaction,"❌ Please enter a valid 6-digit HEX color, like `#7A4FA3`.");
  }
  const hex="#"+cleaned.toUpperCase();
  const bytes=colorCheckerPng(hex);
  const response=await editOriginalResponseWithFile(env,interaction,`🎨 **Color Checker:** \`${hex}\``,"color-checker.png",bytes,"image/png");
  if(!response.ok)console.error("Color Checker response failed:",response.status,await response.text());
}

async function handlePastelStart(env,interaction){
  if (await checkGamePunishment(env, interaction)) return;
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Color Chaos is server-only.");
  const user=getUserFromInteraction(interaction);if(!user)return;
  const games=await listPastelGames(env,interaction.guild_id);
  const active=games.find(g=>g.status!=="ended"&&g.players?.[user.id]);
  if(active){
    return sendText(env,interaction,`🌈 **YOU ALREADY HAVE A COLOR CHAOS GAME**\n\nYou're already in a Color Chaos game. Restore your current game below.`,[row(button("🔄 Restore Game Controls",`pastel:resume:${active.id}`,1)),row(button("📖 How to Play","pastel:rules:menu",2)),row(button("🎨 Palette",`pastel:palette:menu:${active.id}`,2))]);
  }
  const state=await getGuildState(env,interaction.guild_id);const selected=state.colorChaosPalette||"pastel_dreams";
  await sendText(env,interaction,`🌈 **COLOR CHAOS**\n\n🎨 Palette: **${COLOR_CHAOS_PALETTES[selected]?.name||"Pastel Dreams"}**\n\nChoose your game mode!`,pastelModeComponents(selected));
}
async function handlePastelPalette(env,interaction,palette,gameId=""){
  if(!interaction.guild_id)return sendEphemeralFollowup(env,interaction,"❌ Color Chaos is server-only.");
  const state=await getGuildState(env,interaction.guild_id),active=gameId?await getPastelGame(env,interaction.guild_id,gameId):null;
  if(gameId){
    if(!active||active.id!==gameId)return sendEphemeralFollowup(env,interaction,"❌ That Color Chaos game no longer exists.");
    const user=getUserFromInteraction(interaction);
    if(!user||user.id!==active.hostId)return sendEphemeralFollowup(env,interaction,"❌ Only the Color Chaos host can change the palette.");
    if(active.status!=="lobby")return sendEphemeralFollowup(env,interaction,"❌ The Color Chaos palette can only be changed before the game starts.");
  }
  if(palette==="menu"){
    const selected=gameId?(active?.palette||"pastel_dreams"):(state?.colorChaosPalette||"pastel_dreams");
    return sendText(env,interaction,`🎨 **COLOR CHAOS PALETTE**\n\nChoose your palette!`,colorChaosPaletteComponents(selected,gameId));
  }
  if(palette==="back"){
    const selected=gameId?(active?.palette||"pastel_dreams"):(state?.colorChaosPalette||"pastel_dreams");
    if(gameId)return sendText(env,interaction,pastelLobbyText(active),pastelLobbyComponents(active));
    return sendText(env,interaction,`🌈 **COLOR CHAOS**\n\n🎨 Palette: **${COLOR_CHAOS_PALETTES[selected]?.name||"Pastel Dreams"}**\n\nChoose your game mode!`,pastelModeComponents(selected));
  }
  if(!COLOR_CHAOS_PALETTES[palette])return sendEphemeralFollowup(env,interaction,"❌ That palette does not exist.");
  if(gameId){active.palette=palette;await pastelSave(env,active);return sendText(env,interaction,pastelLobbyText(active),pastelLobbyComponents(active));}
  state.colorChaosPalette=palette;await saveGuildState(env,interaction.guild_id,state);
  await sendText(env,interaction,`🎨 **COLOR CHAOS PALETTE**\n\n${COLOR_CHAOS_PALETTES[palette].icon} **${COLOR_CHAOS_PALETTES[palette].name}** selected!\n\nChoose your game mode!`,pastelModeComponents(palette));
}
async function handlePastelRefresh(env,interaction,gameId){
  await deferInteraction(env,interaction,{update:true});
  if(!interaction.guild_id)return sendEphemeralFollowup(env,interaction,"❌ Color Chaos is server-only.");
  const state=await getGuildState(env,interaction.guild_id);const game=await getPastelGame(env,interaction.guild_id,gameId);const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Color Chaos game is no longer active.");
  if(!user||!game.players?.[user.id]||game.players[user.id].alive===false)return sendEphemeralFollowup(env,interaction,"❌ Only an active Color Chaos player can refresh the game.");
  try{
    const response=await sendPastelBoard(env,interaction,game);
    if(!response?.ok)throw new Error(`Board refresh failed (${response?.status||"unknown"})`);
  }catch(error){
    console.error("Pastel Refresh failed:",error);
    try{await pastelPublicUpdate(env,interaction,`${pastelGameText(game)}\n\n⚠️ The board could not refresh, but the saved game is still active.`,pastelChoiceComponents(game),game);}catch{}
    await sendEphemeralFollowup(env,interaction,"⚠️ The board could not refresh, but your Color Chaos game is still active.");
  }
}

async function handlePastelResume(env,interaction,gameId){
  if(!interaction.guild_id)return sendEphemeralFollowup(env,interaction,"❌ Color Chaos is server-only.");
  await deferInteraction(env,interaction,{update:true});
  const state=await getGuildState(env,interaction.guild_id),game=await getPastelGame(env,interaction.guild_id,gameId),user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status==="ended")return sendEphemeralFollowup(env,interaction,"❌ There is no active Color Chaos game to restore.");
  if(!user||user.id!==game.hostId)return sendEphemeralFollowup(env,interaction,"❌ Only the Color Chaos host can restore the game.");
  if(game.status==="lobby"){
    const response=await pastelPublicUpdate(env,interaction,pastelLobbyText(game),pastelLobbyComponents(game),game);
    if(!response?.ok)await sendEphemeralFollowup(env,interaction,"⚠️ I couldn't restore the Color Chaos lobby message yet.");
    return;
  }
  try{
    const response=await sendPastelBoard(env,interaction,game);
    if(!response?.ok)throw new Error(`Board restore failed (${response?.status||"unknown"})`);
    await pastelSave(env,game);
  }catch(error){
    console.error("Color Chaos restore failed:",error);
    await sendEphemeralFollowup(env,interaction,"⚠️ The board could not be restored, but the saved game is still active.");
  }
}
async function handlePastelMode(env,interaction,mode){
  if(await checkGamePunishment(env,interaction))return;
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Color Chaos is server-only.");
  await deferInteraction(env,interaction,{update:true});
  const user=getUserFromInteraction(interaction);if(!user)return;
  const games=await listPastelGames(env,interaction.guild_id);
  const existing=games.find(g=>g.status!=="ended"&&g.players?.[user.id]);
  if(existing)return sendEphemeralFollowup(env,interaction,"❌ You're already in an active Color Chaos game. Finish or leave that game before starting another.");
  const state=await getGuildState(env,interaction.guild_id);
  const selected=state.colorChaosPalette||"pastel_dreams";
  const info=pastelModeInfo(Number(mode));const palette=COLOR_CHAOS_PALETTES[selected]?selected:"pastel_dreams";
  const player=await getPlayer(env,user.id);updatePlayerIdentity(player,interaction);await savePlayer(env,player);
  const game={id:`pastel-${Date.now()}-${randomInt(1000,9999)}`,guildId:interaction.guild_id,channelId:interaction.channel_id,hostId:user.id,status:"lobby",interactionToken:interaction.token,publicMessageId:"",mode:info.mode,modeLabel:info.modeLabel,needed:info.needed,palette,round:0,turnId:user.id,turnStartedAt:Date.now(),turnsSinceRefresh:0,refreshEvery:PASTEL_REGEN[Number(mode)],refreshCount:0,endVotes:{},players:{[user.id]:{id:user.id,username:user.username,displayName:getDisplayName(player),slot:0,alive:true,choiceLocked:false,pendingPastelTurns:0}},board:null,createdAt:Date.now(),lastRefresh:""};
  await pastelSave(env,game);
  const response=await sendPublicText(env,interaction,pastelLobbyText(game),pastelLobbyComponents(game));
  if(!response?.ok)return sendEphemeralFollowup(env,interaction,"⚠️ I couldn't create the Color Chaos lobby yet. Please try again.");
  const messageId=await getPastelPublicMessageId(env,game,interaction);if(messageId)game.publicMessageId=messageId;
  await pastelSave(env,game);
}
async function pastelStartGame(env,game,interaction){
  const players=pastelStartingPlayers(game);
  game.status="playing";game.round=1;game.turnId=players[0].id;game.turnStartedAt=Date.now();game.endVotes={};game.interactionToken=interaction.token;game.board=pastelGenerateBoard(game.mode,players,game.palette);
  let startHearts=0;for(const row of game.board)for(const cell of row)if(cell.heart&&!cell.owner)startHearts++;
  if(startHearts<2){for(let r=0;r<game.board.length&&startHearts<2;r++)for(let c=0;c<game.board[r].length&&startHearts<2;c++){const cell=game.board[r][c];if(cell.owner||cell.heart)continue;cell.heart=true;cell.wild=false;startHearts++;}}
  game.turnsSinceRefresh=0;game.lastRefresh="";
  for(const p of players){p.startingCells=1;p.pendingPastelTurns=0;p.selectedColor=Number(p.slot)%pastelColorCount(game);if(!game.statsRecorded){const pp=await getPlayer(env,p.id);pp.pastelGamesPlayed=Number(pp.pastelGamesPlayed||0)+1;await savePlayer(env,pp);}}
  game.statsRecorded=true;
  try{
    const boardResponse=await sendPastelBoard(env,interaction,game);
    if(!boardResponse?.ok)throw new Error(`Public Color Chaos board update failed: ${boardResponse?.status||"unknown"}`);
    await pastelSave(env,game);await sendPastelTurnMessage(env,game,game.turnId);
  }catch(error){
    console.error("Color Chaos start failed:",error);
    game.status="lobby";game.round=0;game.board=null;game.turnId=game.hostId;game.turnStartedAt=Date.now();game.lastRefresh="";
    await pastelSave(env,game);
    const response=await pastelPublicUpdate(env,interaction,`${pastelLobbyText(game)}\n\n⚠️ **The game board could not start yet.** The lobby is still safe — press Join Game again after the bot finishes recovering.`,pastelLobbyComponents(game),game);
    if(!response?.ok)console.error("Color Chaos lobby recovery failed:",response?.status);
  }
}

async function handlePastelJoin(env,interaction,gameId){
  if(await checkGamePunishment(env,interaction))return;
  if(!interaction.guild_id)return sendText(env,interaction,"❌ Color Chaos is server-only.");
  await deferInteraction(env,interaction,{update:true});
  const user=getUserFromInteraction(interaction);if(!user)return sendEphemeralFollowup(env,interaction,"❌ Player not found.");
  const existingGame=await findPastelGameForUser(env,interaction.guild_id,user.id);
  if(existingGame&&existingGame.id!==gameId)return sendEphemeralFollowup(env,interaction,"❌ You're already in another active Color Chaos game.");
  const player=await getPlayer(env,user.id);updatePlayerIdentity(player,interaction);await savePlayer(env,player);
  let game=null;
  for(let attempt=0;attempt<3;attempt++){
    const current=await getPastelGame(env,interaction.guild_id,gameId);
    if(!current||current.id!==gameId||current.status!=="lobby")return sendEphemeralFollowup(env,interaction,"❌ That Color Chaos lobby is no longer open.");
    const count=Object.keys(current.players||{}).length;
    if(current.players?.[user.id]){
      if(count>=current.needed){game=current;break;}
      return sendEphemeralFollowup(env,interaction,"🌈 You're already in this Color Chaos lobby!");
    }
    if(count>=current.needed)return sendEphemeralFollowup(env,interaction,"❌ This Color Chaos lobby is full.");
    const next={...current,players:{...(current.players||{})}};
    next.players[user.id]={id:user.id,username:user.username,displayName:getDisplayName(player),slot:count,alive:true,choiceLocked:false,pendingPastelTurns:0};next.interactionToken=interaction.token;
    const saved=await pastelSave(env,next);if(!saved)continue;
    const verify=await getPastelGame(env,interaction.guild_id,gameId);
    if(verify?.id===gameId&&verify.status==="lobby"&&verify.players?.[user.id]){game=verify;break;}
  }
  if(!game)return sendEphemeralFollowup(env,interaction,"⚠️ Color Chaos is busy updating the lobby. Please press Join Game once more in a moment.");
  if(Object.keys(game.players||{}).length>=game.needed){await pastelStartGame(env,game,interaction);return;}
  await pastelPublicUpdate(env,interaction,pastelLobbyText(game),pastelLobbyComponents(game),game);
}

async function handlePastelCancel(env,interaction,gameId){
  const state=await getGuildState(env,interaction.guild_id);
  const game=await getPastelGame(env,interaction.guild_id,gameId);
  const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId)return sendText(env,interaction,"❌ That Color Chaos game no longer exists.");
  if(game.status!=="lobby")return sendText(env,interaction,"❌ The game has already started. Use Quit Game instead.");
  if(!user||user.id!==game.hostId)return sendText(env,interaction,"❌ Only the Color Chaos host can use this lobby button.");
  await deletePastelGame(env,game);
  await sendText(env,interaction,"🚪 Color Chaos lobby cancelled.");
}
function pastelResultsText(results,winnerId){
  const lines=results.map(result=>{
    const delta=result.delta>0?`+${result.delta}`:`${result.delta}`;
    let levelLine=`⭐ **Lv. ${result.afterLevel}**`;
    if(result.afterLevel>result.beforeLevel){
      levelLine=`⭐ **Lv. ${result.beforeLevel} → ${result.afterLevel}** ⬆️ **LEVEL UP!**`;
    }else if(result.afterLevel<result.beforeLevel){
      levelLine=`⭐ **Lv. ${result.beforeLevel} → ${result.afterLevel}** ⬇️ **LEVEL DOWN!**`;
    }else{
      levelLine+=` — level unchanged`;
    }
    return `${result.id===winnerId?"🏆":"💥"} <@${result.id}>\n   🌈 **${delta} Color Chaos rating**\n   ${levelLine}`;
  }).join("\n\n");
  return `🎨 **COLOR CHAOS RESULTS**\n\n${lines}`;
}

async function pastelFinish(env,game,winnerId,reason){
  game.status="ended"; game.winnerId=winnerId; game.endReason=reason; game.endedAt=Date.now();
  /*
     Clear the guild's active Color Chaos slot BEFORE doing player reward work.
     Finishing a game can take several KV/player writes; leaving the old game
     in state.pastel during that work can let a near-simultaneous request see
     it as active and block the next game.
  */
  await deletePastelGame(env,game);

  const snapshots={};
  for(const p of pastelStartingPlayers(game)){
    const player=await getPlayer(env,p.id);
    const beforeRating=Object.prototype.hasOwnProperty.call(p,"resultBeforeRating")
      ?Number(p.resultBeforeRating)
      :Number(player.pastelRating||0);
    const beforeLevel=Object.prototype.hasOwnProperty.call(p,"resultBeforeLevel")
      ?Number(p.resultBeforeLevel)
      :pastelRatingLevel(beforeRating);
    snapshots[p.id]={beforeRating,beforeLevel};
  }

  const results=[];
  for(const p of pastelStartingPlayers(game)){
    const player=await getPlayer(env,p.id);
    let delta=0;
    if(p.id===winnerId){
      player.pastelWins=Number(player.pastelWins||0)+1;
      player.pastelRating=Number(player.pastelRating||0)+100;
      player.exp=Number(player.exp||0)+PASTEL_WIN_XP;
      if(!player.titles.includes("pastel_winner"))player.titles.push("pastel_winner");
      const leveledUp=applyLevelUps(player);
      player.pastelLastXpEarned=PASTEL_WIN_XP;
      player.pastelLastLeveledUp=leveledUp;
      delta=100;
    }else if(!p.lossRecorded){
      player.pastelLosses=Number(player.pastelLosses||0)+1;
      player.pastelRating=Math.max(0,Number(player.pastelRating||0)-50);
      delta=-50;
    }else{
      delta=-50;
    }
    player.pastelLevel=pastelRatingLevel(player.pastelRating);
    await savePlayer(env,player,p.id);
    results.push({
      id:p.id,
      delta,
      beforeRating:snapshots[p.id].beforeRating,
      beforeLevel:snapshots[p.id].beforeLevel,
      afterRating:Number(player.pastelRating||0),
      afterLevel:Number(player.pastelLevel||0)
    });
  }
  return results;
}
async function sendPastelTurnMessage(env,game,turnId){
  const payload={content:`🌈 **COLOR CHAOS** — <@${turnId}> **it's your turn!**`,allowed_mentions:{users:[turnId]}};
  let response;
  if(game.turnMessageId){
    response=await discordRequest(env,`/channels/${game.channelId}/messages/${game.turnMessageId}`,{
      method:"PATCH",
      body:JSON.stringify(payload)
    });
    if(response.ok)return true;
    const status=response.status;
    const detail=await response.text();
    console.error("Pastel turn ping edit failed:",status,detail);
    /* If the old ping was deleted, create one replacement and remember it. */
    if(status!==404)return false;
  }
  response=await discordRequest(env,`/channels/${game.channelId}/messages`,{
    method:"POST",
    body:JSON.stringify(payload)
  });
  if(!response.ok){console.error("Pastel turn ping failed:",response.status,await response.text());return false;}
  try{const data=await response.json();if(data?.id)game.turnMessageId=data.id;}catch{}
  await pastelSave(env,game);
  return true;
}
async function handlePastelChoose(env,interaction,gameId,colorIndex){
  /* Acknowledge immediately so board/state work cannot hit Discord's interaction timeout. */
  await deferInteraction(env,interaction,{update:true});
  const state=await getGuildState(env,interaction.guild_id);const game=await getPastelGame(env,interaction.guild_id,gameId);const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Color Chaos game is over or missing.");
  if(game.turnId!==user.id)return sendEphemeralFollowup(env,interaction,"⏳ It isn't your turn.");
  const player=pastelFindOwned(game,user.id);if(!player?.alive)return sendEphemeralFollowup(env,interaction,"💀 You're out of the game.");
  const color=Number(colorIndex);const blocked=pastelOpponentColors(game,player);const own=Number(player.selectedColor);
  if(!Number.isInteger(color)||!pastelColors(game)[color]||blocked.has(color)||color===own)return sendEphemeralFollowup(env,interaction,"❌ You must choose a new color that is not currently owned by another player.");
  const before=pastelClaimedCells(game,user.id);player.selectedColor=color;
  for(const row of game.board)for(const cell of row)if(cell.owner===player.id)cell.color=color;
  const flood=pastelFlood(game,player,color);
  let extraHeartCaptures=Number(flood.capturedHearts||0);
  /* Power Cells are neutral pickups: once a player's territory reaches one,
     capture every connected Power Cell regardless of that cell's displayed color.
     Repeat so touching Power Cells chain together in the same move. */
  let heartChanged=true;
  while(heartChanged){
    heartChanged=false;
    for(let r=0;r<game.board.length;r++)for(let c=0;c<game.board[r].length;c++){
      const cell=game.board[r][c];
      if(!cell||cell.owner||!cell.heart)continue;
      const adjacent=pastelNeighbors(game.board,r,c,game.mode).some(([rr,cc])=>game.board[rr]?.[cc]?.owner===player.id);
      if(!adjacent)continue;
      cell.owner=player.id;
      cell.color=color;
      cell.wild=false;
      cell.heart=false;
      extraHeartCaptures++;
      heartChanged=true;
    }
  }
  flood.capturedHearts=extraHeartCaptures;
  for(const row of game.board)for(const cell of row)if(cell.owner===player.id)cell.color=color;
  const after=pastelClaimedCells(game,user.id);
  const gained=after-before;
  const heartsCaptured=Number(flood.capturedHearts||0);
  player.pendingPastelTurns=Number(player.pendingPastelTurns||0)+heartsCaptured;
  const extra=Number(player.pendingPastelTurns||0)>0;
  game.round++;game.turnsSinceRefresh++;
  game.lastMove=`🎨 <@${user.id}> chose **${pastelColors(game)[color].name}** and gained **${gained} cells**.${heartsCaptured?` ${pastelPalette(game).powerCell} **${heartsCaptured} POWER CELL${heartsCaptured===1?"":"S"} CAPTURED — EXTRA TURN${heartsCaptured===1?"":"S"} STACKED!**`:""}`;
  if(pastelGameIsUnbeatable(game)){
    const w=pastelWinner(game);
    const results=await pastelFinish(env,game,w.id,"🏆 An unbeatable territory lead was reached!");
    await pastelPublishEndMessage(env,game,`${game.lastMove}\n\n🏆 **COLOR CHAOS OVER!** <@${w.id}> wins!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,w.id)}`);
    return;
  }
  const alive=Object.values(game.players).filter(p=>p.alive);
  if(alive.length<=1){
    const w=alive[0];
    if(w){
      const results=await pastelFinish(env,game,w.id,"🏆 Only one player remained.");
      await pastelPublishEndMessage(env,game,`🏆 **COLOR CHAOS OVER!** <@${w.id}> wins!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,w.id)}`);
    }
    return;
  }
  const legalPlayers=pastelPlayersWithLegalMoves(game);
  if(legalPlayers.length===0){
    await pastelFinishNoMoves(env,game);
    return;
  }
  if(legalPlayers.length===1){
    const w=pastelWinner(game);
    if(w){
      const results=await pastelFinish(env,game,w.id,"🏁 Only one active player had a legal move remaining.");
      await pastelPublishEndMessage(env,game,`${game.lastMove}\n\n🏁 **COLOR CHAOS OVER!** <@${w.id}> wins — no other active player had a legal move remaining!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,w.id)}`);
    }
    return;
  }
  if(game.turnsSinceRefresh>=game.refreshEvery)pastelRegenerate(game);
  if(extra){
    player.pendingPastelTurns=Math.max(0,Number(player.pendingPastelTurns||0)-1);
    game.turnId=user.id;
  }else{
    const currentIndex=pastelStartingPlayers(game).findIndex(p=>p.id===user.id);
    let nextIndex=currentIndex;
    for(let i=0;i<pastelStartingPlayers(game).length;i++){
      nextIndex=(nextIndex+1)%pastelStartingPlayers(game).length;
      const n=pastelStartingPlayers(game)[nextIndex];
      if(n?.alive){game.turnId=n.id;break;}
    }
  }
  game.turnStartedAt=Date.now();
  await pastelSave(env,game);
  /* Commit the new turn before doing any image work, so the AFK timer sees the
     new turn immediately even if Discord is slow to upload the board. */
  await sendPastelTurnMessage(env,game,game.turnId).catch(error=>console.error("Pastel turn ping error:",error));
  try{
    await sendPastelBoard(env,interaction,game);
  }catch(error){
    console.error("Pastel same-message board refresh error:",error);
    try{await pastelPublicUpdate(env,interaction,`${pastelGameText(game)}\n\n${game.lastMove}\n\n⚠️ The board could not refresh, but the game controls are still active.`,pastelChoiceComponents(game),game);}catch{}
  }
}
async function handlePastelQuit(env,interaction,gameId){
  const state=await getGuildState(env,interaction.guild_id); const game=await getPastelGame(env,interaction.guild_id,gameId); const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status!=="playing")return sendEphemeralFollowup(env,interaction,"❌ That Color Chaos game is over or missing.");
  const quitter=pastelFindOwned(game,user.id); if(!quitter?.alive)return sendEphemeralFollowup(env,interaction,"❌ You're already out of this game.");
  quitter.alive=false; quitter.lossRecorded=true;
  const player=await getPlayer(env,user.id);
  quitter.resultBeforeRating=Number(player.pastelRating||0);
  quitter.resultBeforeLevel=pastelRatingLevel(player.pastelRating);
  player.pastelLosses=Number(player.pastelLosses||0)+1;
  player.pastelQuits=Number(player.pastelQuits||0)+1;
  player.pastelRating=Math.max(0,Number(player.pastelRating||0)-50);
  player.pastelLevel=pastelRatingLevel(player.pastelRating);
  await savePlayer(env,player);
  if(game.mode==="square"&&game.needed===2){
    const foe=pastelStartingPlayers(game).find(p=>p.alive);
    const results=await pastelFinishRemaining(env,game,foe?.id,user.id,"🚪 A player rage quit. The opponent wins automatically!");
    await pastelPublishEndMessage(env,game,`🚪 <@${user.id}> quit. It counts as a loss, and the opponent wins.\n\n${pastelResultsText(results,foe?.id)}`);
    return sendText(env,interaction,`🚪 You quit. It counts as a loss, and your opponent wins.\n\n${pastelResultsText(results,foe?.id)}`);
  }
  for(const row of game.board)for(const c of row)if(c.owner===user.id){c.owner="blackout";c.color=0;c.heart=false;c.wild=false;c.start=false;}
  const alive=Object.values(game.players).filter(p=>p.alive);
  if(alive.length<=1){
    const w=alive[0];
    if(w){
      const results=await pastelFinishRemaining(env,game,w.id,user.id,"🚪 A player rage quit. The remaining player wins!");
      await pastelPublishEndMessage(env,game,`🚪 <@${user.id}> quit. Their territory was blacked out and the remaining player wins!\n\n${pastelResultsText(results,w.id)}`);
      return sendText(env,interaction,`🚪 You quit. Your territory is blacked out and the remaining player wins!\n\n${pastelResultsText(results,w.id)}`);
    }
    return sendText(env,interaction,`🚪 You quit. Your territory is blacked out.`);
  }
  if(game.turnId===user.id){game.turnId=alive[0].id;game.turnStartedAt=Date.now();}
  game.lastMove=`🚪 **<@${user.id}> rage quit!** Their territory is now blacked out. The game continues with **${alive.length} players**.`;
  const legalPlayersAfterQuit=pastelPlayersWithLegalMoves(game);
  if(legalPlayersAfterQuit.length===0){
    await pastelFinishNoMoves(env,game,"🏁 No legal moves remained after a player rage quit.");
    return;
  }
  if(legalPlayersAfterQuit.length===1){
    const w=pastelWinner(game);
    if(w){
      const results=await pastelFinishRemaining(env,game,w.id,user.id,"🏁 Only one active player had a legal move remaining after a rage quit.");
      await pastelPublishEndMessage(env,game,`${game.lastMove}\n\n🏁 **COLOR CHAOS OVER!** <@${w.id}> wins — no other active player had a legal move remaining!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,w.id)}`);
    }
    return;
  }
  await pastelSave(env,game);
  try{await sendPastelBoard(env,interaction,game);await sendPastelTurnMessage(env,game,game.turnId);}catch(error){await editOriginalResponse(env,interaction,{content:`${pastelGameText(game)}\n\n${game.lastMove}\n\n⚠️ ${error?.message||"Board image error"}`,components:pastelChoiceComponents(game)});}
}
async function pastelFinishRemaining(env,game,winnerId,loserId,reason){
  game.status="ended";game.winnerId=winnerId;game.endReason=reason;game.endedAt=Date.now();
  /*
     Release the active-game slot immediately. Reward/stat writes happen after
     this so a new Color Chaos game cannot be blocked by the old finished game.
  */
  await deletePastelGame(env,game);

  const snapshots={};
  for(const p of pastelStartingPlayers(game)){
    const player=await getPlayer(env,p.id);
    const beforeRating=Object.prototype.hasOwnProperty.call(p,"resultBeforeRating")
      ?Number(p.resultBeforeRating)
      :Number(player.pastelRating||0);
    const beforeLevel=Object.prototype.hasOwnProperty.call(p,"resultBeforeLevel")
      ?Number(p.resultBeforeLevel)
      :pastelRatingLevel(beforeRating);
    snapshots[p.id]={beforeRating,beforeLevel};
  }

  const results=[];
  for(const p of pastelStartingPlayers(game)){
    const player=await getPlayer(env,p.id);
    let delta=0;
    if(p.id===winnerId){
      player.pastelWins=Number(player.pastelWins||0)+1;
      player.pastelRating=Number(player.pastelRating||0)+100;
      player.exp=Number(player.exp||0)+PASTEL_WIN_XP;
      if(!player.titles.includes("pastel_winner"))player.titles.push("pastel_winner");
      const leveledUp=applyLevelUps(player);
      player.pastelLastXpEarned=PASTEL_WIN_XP;
      player.pastelLastLeveledUp=leveledUp;
      delta=100;
    }else if(!p.lossRecorded){
      player.pastelLosses=Number(player.pastelLosses||0)+1;
      player.pastelRating=Math.max(0,Number(player.pastelRating||0)-50);
      delta=-50;
    }else{
      delta=-50;
    }
    player.pastelLevel=pastelRatingLevel(player.pastelRating);
    await savePlayer(env,player,p.id);
    results.push({
      id:p.id,
      delta,
      beforeRating:snapshots[p.id].beforeRating,
      beforeLevel:snapshots[p.id].beforeLevel,
      afterRating:Number(player.pastelRating||0),
      afterLevel:Number(player.pastelLevel||0)
    });
  }
  return results;
}
async function pastelDisablePublicMessage(env,game,interaction,content){
  const token=game?.interactionToken||interaction?.token;if(!token)return false;
  const response=await fetch(`https://discord.com/api/v10/webhooks/${env.CLIENT_ID}/${token}/messages/@original`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({content,components:[]})});
  if(!response.ok)console.error("Pastel end message update failed:",response.status,await response.text());
  return response.ok;
}
async function pastelForceEnd(env,game,interaction,reason="🛑 Color Chaos was ended."){
  game.status="ended";game.endReason=reason;game.endedAt=Date.now();
  await deletePastelGame(env,game);
  await pastelPublishEndMessage(env,game,`${reason}\n\n🌈 **COLOR CHAOS CLOSED**\nNo winner was recorded and the saved game has been cleared.`).catch(()=>null);
}
async function handlePastelEndVote(env,interaction,gameId){
  if(!interaction.guild_id)return sendEphemeralFollowup(env,interaction,"❌ Color Chaos is server-only.");
  const state=await getGuildState(env,interaction.guild_id);const game=await getPastelGame(env,interaction.guild_id,gameId);const user=getUserFromInteraction(interaction);
  if(!game||game.id!==gameId||game.status==="ended")return sendEphemeralFollowup(env,interaction,"❌ There is no active Color Chaos game to end.");
  if(!user)return sendEphemeralFollowup(env,interaction,"❌ Player not found.");
  if(user.id===env.OWNER_ID){await pastelForceEnd(env,game,interaction,"👑 The Werewives bot owner force-ended Color Chaos.");return;}
  if(!game.players?.[user.id]||game.players[user.id].alive===false)return sendEphemeralFollowup(env,interaction,"❌ Only an active Color Chaos player can vote to end the game.");
  game.endVotes=game.endVotes||{};
  if(game.endVotes[user.id])return sendEphemeralFollowup(env,interaction,"🛑 You already voted to end this game. Waiting for everyone else.");
  game.endVotes[user.id]=true;const vote=pastelEndVoteCount(game);
  if(vote.votes>=vote.total&&vote.total>0){await pastelForceEnd(env,game,interaction,"🛑 **Everyone agreed to end Color Chaos.**");return;}
  await pastelSave(env,game);
  if(game.status==="lobby")await pastelPublicUpdate(env,interaction,pastelLobbyText(game),pastelLobbyComponents(game),game);
  else {try{await sendPastelBoard(env,interaction,game);}catch(error){await editOriginalResponse(env,interaction,{content:`${pastelGameText(game)}\n\n🛑 <@${user.id}> voted to end the game. **${vote.votes}/${vote.total}** players have agreed.\n\n⚠️ ${error?.message||"Board image error"}`,components:pastelChoiceComponents(game)});}}
}
async function handlePastelLeaderboard(env,interaction){const keys=await listAllPlayerKeys(env);const players=[];for(const key of keys){const p=await getPlayer(env,key);if(!pastelHasPlayed(p))continue;pastelStats(p);players.push(p);}players.sort((a,b)=>{const r=Number(b.pastelRating||0)-Number(a.pastelRating||0);if(r)return r;const w=Number(b.pastelWins||0)-Number(a.pastelWins||0);if(w)return w;return Number(a.pastelQuits||0)-Number(b.pastelQuits||0);});const top=players.slice(0,10);if(!top.length)return sendText(env,interaction,"🌈 Nobody has played Color Chaos yet!");const lines=top.map((p,i)=>`**${i+1}.** ${getDisplayName(p)} — Level **${pastelStats(p).level}** • 🏆 **${Number(p.pastelWins||0)} Wins** • 💀 **${Number(p.pastelLosses||0)} Losses** • 🚪 **${Number(p.pastelQuits||0)} Quits**`);await sendText(env,interaction,`🌈 **COLOR CHAOS LEADERBOARD**\n\n${lines.join("\n")}`);}
async function handlePastelRules(env,interaction){await sendEphemeralFollowup(env,interaction,pastelRulesText());}

/* =========================================================
   DISCORD COMMAND DEFINITIONS
========================================================= */

const COMMANDS = [
  {
    name: "birthday",
    description: "Open the Birthday Party hub"
  },
  {
    name: "birthday-games",
    description: "Open Birthday Games",
    options: [
      { type: 1, name: "hunt", description: "Birthday Fright Hunt" },
      { type: 1, name: "bingo", description: "Halloween Birthday Bingo" },
      { type: 1, name: "roulette", description: "Pumpkin Roulette" },
      { type: 1, name: "curse", description: "The Birthday Curse", options: [{ type: 3, name: "answer", description: "Answer the current Birthday Curse word prompt", required: false, max_length: 60 }] },
      { type: 1, name: "cupcake", description: "Wicked Cupcake Tower" },
      { type: 1, name: "bakery", description: "Batty Cake Bakery" },
      { type: 1, name: "boss", description: "Fight the Cursed Birthday Cake" }
    ]
  },
  {
    name: "birthday-shop",
    description: "Open the Midnight Birthday Shop"
  },
  {
    name: "birthday-gift",
    description: "Send a birthday gift",
    options: [
      { type: 6, name: "user", description: "Today's birthday person", required: true },
      { type: 3, name: "gift_type", description: "Gift type", required: true, choices: [
        { name: "🎀 Creepy Little Present", value: "creepy_present" },
        { name: "👻 Ghostly Gift Box", value: "ghost_box" },
        { name: "🎃 Pumpkin Treasure", value: "pumpkin_treasure" },
        { name: "🦇 Midnight Keepsake", value: "midnight_keepsake" },
        { name: "🌙 Moonlit Birthday Relic", value: "moonlit_relic" }
      ] }
    ]
  },
  { name: "birthday-gifts", description: "Open your unopened birthday gifts" },
  { name: "birthday-collection", description: "View your permanent Birthday Collection" },
  { name: "birthday-wish", description: "Perform the Birthday Wish Ritual" },
  { name: "birthday-cannon", description: "Fire the Birthday Boo Cannon" },
  {
    name: "birthday-trickster",
    description: "Use Birthday Trickster",
    options: [{ type: 6, name: "user", description: "Player to target", required: true }]
  },
  {
    name: "birthday-name",
    description: "Record a birthday person's name for Bingo",
    options: [{ type: 6, name: "user", description: "Today's birthday person", required: false }]
  },
  {
    name: "birthday-force",
    description: "Owner-only Birthday server event test",
    options: [{
      type: 3,
      name: "event",
      description: "Server event to force",
      required: true,
      choices: [
        { name: "🎃 Pumpkin Appears", value: "pumpkin_appears" },
        { name: "👻 Ghost Appears", value: "ghost_appears" },
        { name: "🦇 Bat Swarm Appears", value: "bat_swarm" }
      ]
    }]
  },
  {
    name: "birthday-set",
    description: "Set your birthday month and day",
    options: [
      { type: 4, name: "month", description: "Birthday month (1–12)", required: true, min_value: 1, max_value: 12 },
      { type: 4, name: "day", description: "Birthday day (1–31)", required: true, min_value: 1, max_value: 31 },
      { type: 6, name: "user", description: "Owner-only: player whose birthday is being set/changed", required: false }
    ]
  },
  {
    name: "games",
    description: "Open the Werewives games menu"
  },
  {
    name: "experiment",
    description: "Play The Experiment — social puzzle chaos",
    options: [
      { type: 1, name: "create", description: "Create a randomized Experiment lobby" },
      { type: 1, name: "join", description: "Join the active Experiment lobby" },
      { type: 1, name: "leave", description: "Leave the active Experiment lobby" },
      { type: 1, name: "start", description: "Start the Experiment (host only)" },
      { type: 1, name: "end", description: "End the active Experiment (host or owner)" },
      { type: 1, name: "status", description: "View the active Experiment" }
    ]
  },

  {
    name: "solo",
    description: "Play Solo Mission",
    options: [
      { type: 1, name: "start", description: "Start a Solo Mission" },
      { type: 1, name: "status", description: "View your current Solo Mission" },
      { type: 1, name: "leaderboard", description: "View the Solo Mission leaderboard" },
      { type: 1, name: "end", description: "End your current Solo Mission" }
    ]
  },

  {
    name: "titles",
    description: "View owned titles, unlockable titles, and Name Effects"
  },

  {
    name: "news",
    description: "Owner-only one-time player news popup",
    default_member_permissions: "8",
    options: [{ type: 3, name: "message", description: "Announcement players should see", required: true, max_length: 2000 }]
  },

  {
    name: "blacklist",
    description: "Owner-only: blacklist a player from using the bot",
    default_member_permissions: "8",
    options: [
      { type: 6, name: "user", description: "Player to blacklist", required: true },
      { type: 3, name: "reason", description: "Optional reason", required: false, max_length: 500 }
    ]
  },

  {
    name: "unblacklist",
    description: "Owner-only: restore a player's bot access",
    default_member_permissions: "8",
    options: [{ type: 6, name: "user", description: "Player to unblacklist", required: true }]
  },

  {
    name: "blacklist-list",
    description: "Owner-only: view currently blacklisted players",
    default_member_permissions: "8"
  },

  {
    name: "pickle",
    description: "Owner-only punishment commands",
    default_member_permissions: "8",
    options: [
      {
        type: 1,
        name: "jail",
        description: "Lock a player in Pickle Jail",
        options: [
          { type: 6, name: "user", description: "Player to jail", required: true },
          { type: 4, name: "duration", description: "Sentence length in minutes (1–10080)", required: true, min_value: 1, max_value: 10080 }
        ]
      }
    ]
  },

  {
    name: "timeout",
    description: "Owner-only punishment commands",
    default_member_permissions: "8",
    options: [
      {
        type: 1,
        name: "corner",
        description: "Send a player to the corner",
        options: [
          { type: 6, name: "user", description: "Player to send to the corner", required: true },
          { type: 4, name: "duration", description: "Sentence length in minutes (1–10080)", required: true, min_value: 1, max_value: 10080 }
        ]
      }
    ]
  },

  {
    name: "court",
    description: "Send a player before the Raccoon Court",
    options: [{ type: 6, name: "user", description: "Player to put on trial", required: true }]
  },

  {
    name: "court-leaderboard",
    description: "View the Raccoon Court leaderboard"
  },

  {
    name: "profile",
    description: "View a Werewives player profile",
    options: [{ type: 6, name: "user", description: "Player whose profile to view", required: false }]
  },

  {
    name: "panel",
    description: "Customize your profile panel",
    options: [
      {
        type: 1,
        name: "color",
        description: "Set your profile panel HEX color",
        options: [{ type: 3, name: "hex", description: "HEX color like #FFB6E6, or reset", required: true, max_length: 7 }]
      }
    ]
  },

  {
    name: "present",
    description: "Gift an item you own to another player",
    options: [
      { type: 6, name: "user", description: "Player receiving the item", required: true },
      { type: 3, name: "item", description: "Inventory item ID (shown in /inventory)", required: true, max_length: 80 }
    ]
  },

  {
    name: "delete",
    description: "Delete an unwanted cosmetic from your inventory",
    options: [{ type: 3, name: "item", description: "Inventory item ID to delete", required: true, max_length: 80 }]
  },

  {
    name: "suggest",
    description: "Send a suggestion or bug report privately to the bot owner",
    options: [{ type: 3, name: "message", description: "Your suggestion or bug report", required: true, max_length: 1000 }]
  },

  {
    name: "help",
    description: "See player commands and what they do"
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
      { type: 1, name: "rules", description: "View Chaos Island rules" },
      { type: 1, name: "end", description: "End the current Chaos Island game (host or owner)" }
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
    name: "battle",
    description: "Challenge another player's tree to a Tree Battle",
    options: [
      { type: 6, name: "user", description: "Player to battle", required: true }
    ]
  },

  {
    name: "battleshop",
    description: "Open the Tree Battle item shop"
  },

  {
    name: "battle-end",
    description: "End the active Tree Battle (participant or owner)"
  },

  {
    name: "colorchaos",
    description: "Play Color Chaos",
    options: [
      { type: 1, name: "create", description: "Create a Color Chaos game" },
      { type: 1, name: "end", description: "Request to end the active Color Chaos game" },
      { type: 1, name: "leaderboard", description: "View the Color Chaos leaderboard" }
    ]
  },

  {
    name: "color",
    description: "Color utilities",
    options: [
      {
        type: 1,
        name: "checker",
        description: "Generate an image swatch for a HEX color",
        options: [
          { type: 3, name: "hex", description: "HEX color like #FFB6E6", required: true, max_length: 7 }
        ]
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

  { name: "oracle", description: "Ask the Werewives Oracle for a strange prediction", options: [{ type: 6, name: "user", description: "Optional player", required: false }] },
  { name: "curse", description: "Give someone a harmless silly curse", options: [{ type: 6, name: "user", description: "Player to curse", required: true }] },
  { name: "lore", description: "Reveal a strange piece of Werewives lore", options: [{ type: 6, name: "user", description: "Optional player", required: false }] },
  { name: "timeline", description: "Peek at a ridiculous alternate timeline", options: [{ type: 6, name: "user", description: "Optional player", required: false }] },

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
    name: "free",
    description: "Enter a secret code to unlock a free Werewives gift",
    options: [
      { type: 3, name: "guess", description: "Your secret gift code", required: true }
    ]
  },

  {
    name: "blame",
    description: "Ping the current Color Chaos player who needs to move"
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

async function processPastelTimers(env){
  const guildIds=await getKnownGuildIds(env);
  const now=Date.now();
  for(const guildId of guildIds){
    try{
      const games=await listPastelGames(env,guildId);
      for(let game of games){
        if(!game||game.status!=="playing")continue;
      if(!Number(game.turnStartedAt)){game.turnStartedAt=now;await pastelSave(env,game);continue;}
      if(now-Number(game.turnStartedAt)<=2*60*1000)continue;
      const snapshotTurnId=game.turnId;
      const snapshotTurnStartedAt=Number(game.turnStartedAt);
      /* A scheduled timer can overlap a player's button click. Re-read KV immediately
         before applying an AFK loss so an older timer can never overwrite a newer move. */
      const latestGame=await getPastelGame(env,guildId,game.id);
      if(!latestGame||latestGame.id!==game.id||latestGame.status!=="playing")continue;
      if(latestGame.turnId!==snapshotTurnId||Number(latestGame.turnStartedAt)!==snapshotTurnStartedAt)continue;
      const current=pastelFindOwned(latestGame,latestGame.turnId);
      if(!current?.alive)continue;
      game=latestGame;
      current.alive=false;
      current.lossRecorded=true;
      current.afkForfeited=true;
      for(const row of game.board||[])for(const cell of row){if(cell.owner===current.id){cell.owner="blackout";cell.color=0;cell.heart=false;cell.wild=false;cell.start=false;}}
      const player=await getPlayer(env,current.id);
      current.resultBeforeRating=Number(player.pastelRating||0);
      current.resultBeforeLevel=pastelRatingLevel(player.pastelRating);
      player.pastelLosses=Number(player.pastelLosses||0)+1;
      player.pastelRating=Math.max(0,Number(player.pastelRating||0)-50);
      player.pastelLevel=pastelRatingLevel(player.pastelRating);
      await savePlayer(env,player,current.id);
      const alive=Object.values(game.players||{}).filter(p=>p.alive);
      if(alive.length<=1){
        const winner=alive[0];
        if(winner){
          const results=await pastelFinish(env,game,winner.id,`⏰ <@${current.id}> was AFK for more than 2 minutes and forfeited.`);
          await pastelPublishEndMessage(env,game,`⏰ **AFK TIMEOUT!** <@${current.id}> was inactive for more than **2 minutes** and forfeited.\n\n🏆 <@${winner.id}> wins Color Chaos!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,winner.id)}`).catch(()=>null);
        }
        continue;
      }
      game.turnId=alive[0].id;
      game.turnStartedAt=now;
      game.lastMove=`⏰ **<@${current.id}> timed out!** They were AFK for more than 2 minutes and forfeited. Their territory is blacked out.`;
      const legalPlayersAfterAFK=pastelPlayersWithLegalMoves(game);
      if(legalPlayersAfterAFK.length===0){
        await pastelFinishNoMoves(env,game,"🏁 No legal moves remained after an AFK forfeit.");
        continue;
      }
      if(legalPlayersAfterAFK.length===1){
        const winner=pastelWinner(game);
        if(winner){
          const results=await pastelFinish(env,game,winner.id,"🏁 Only one active player had a legal move remaining after an AFK forfeit.");
          await pastelPublishEndMessage(env,game,`${game.lastMove}\n\n🏁 **COLOR CHAOS OVER!** <@${winner.id}> wins — no other active player had a legal move remaining!\n✨ **+${PASTEL_WIN_XP} EXP earned!**\n\n${pastelResultsText(results,winner.id)}`);
        }
        continue;
      }
      await pastelSave(env,game);
      await sendPastelBoard(env,{token:game.interactionToken},game).catch(error=>console.error("Pastel AFK board update failed:",error));
      await sendPastelTurnMessage(env,game,game.turnId).catch(error=>console.error("Pastel AFK turn ping failed:",error));
      }
    }catch(error){console.error(`Pastel timer failed for guild ${guildId}:`,error);}
  }
}

async function processCourtTrashRelease(env){
    const now=Date.now(); const keys=await listAllPlayerKeys(env);
    for(const userId of keys){
      try{
        const player=await getPlayer(env,userId); const until=Number(player.courtTrashReleaseUntil||0);
        if(until<=0)continue;
        if(until<=now){player.courtTrashReleaseUntil=0;player.courtTrashReleaseNextAt=0;player.courtTrashReleaseChannelId="";await savePlayer(env,player,userId);continue;}
        if(Number(player.courtTrashReleaseNextAt||0)>now)continue;
        const requested=randomInt(100,2000),balance=Math.max(0,Number(player.sparkles||0)),actual=Math.min(requested,balance);
        player.sparkles=Math.max(0,balance-actual); player.courtTrashReleaseNextAt=now+30*60000; await savePlayer(env,player,userId);
        const messages=["The trash can is hungry again.","Payment accepted. Freedom denied.","The raccoons found your Sparkles. This is unfortunate for you.","Raccoon Finance has processed another completely unnecessary fee.","The trash can has reviewed your finances and would like another payment.","Your Sparkles have been legally converted into trash-can property.","The raccoons have returned for their regularly scheduled nonsense fee.","Judge Pickles says you still owe the trash can."];
        const channelId=String(player.courtTrashReleaseChannelId||"");
        if(channelId)await sendChannelMessage(env,channelId,`🗑️🦝 **TRASH CAN RELEASE FEE**\n\n<@${player.userId}> ${messages[randomInt(0,messages.length-1)]}\n\n💰 **${actual.toLocaleString()} Sparkles confiscated.**${actual<requested?`\n\n😭 They only had **${actual.toLocaleString()}**, so the raccoons took all of it.`:""}`);
      }catch(error){console.error(`Trash Release processing failed for ${userId}:`,error);}
    }
  }


export default {
  async fetch(
    request,
    env,
    ctx
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

    /*
      IMPORTANT: Discord only gives us about 3 seconds to acknowledge an
      interaction. Do NOT make a KV/Discord API call before returning the
      acknowledgement. We return the acknowledgement directly from this
      Worker request, then continue the game work in waitUntil().

      This is especially important for Heist and Chaos Island because their
      handlers do several KV reads/writes and Discord message updates.
    */
    const isHelpCommand = interaction.type === 2 && interaction.data?.name === "help";
    if (isHelpCommand) {
      return new Response(JSON.stringify({
        type: 4,
        data: { content: helpText() }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const isNewsCommand = interaction.type === 2 && interaction.data?.name === "news";
    const isBlacklistCommand = interaction.type === 2 && (interaction.data?.name === "blacklist" || interaction.data?.name === "unblacklist" || interaction.data?.name === "blacklist-list");

    const isExperimentCommand =
      interaction.type === 2 && interaction.data?.name === "experiment";
    const isHeistCommand =
      interaction.type === 2 && interaction.data?.name === "heist";
    const isIslandCommand =
      interaction.type === 2 && interaction.data?.name === "island";
    const isBattleCommand =
      interaction.type === 2 && (interaction.data?.name === "battle" || interaction.data?.name === "battleshop" || interaction.data?.name === "battle-end");
    const isSoloCommand =
      interaction.type === 2 && interaction.data?.name === "solo";
    const isPastelCommand =
      interaction.type === 2 && interaction.data?.name === "colorchaos";
    const isColorCommand =
      interaction.type === 2 && interaction.data?.name === "color";
    const isFreeCommand =
      interaction.type === 2 && interaction.data?.name === "free";
    const isBlameCommand =
      interaction.type === 2 && interaction.data?.name === "blame";
    const isProfileCommand =
      interaction.type === 2 && interaction.data?.name === "profile";
    // /tree performs KV work and Browser Rendering, so it must be acknowledged
    // immediately just like the other long-running commands.
    const isTreeCommand =
      interaction.type === 2 && interaction.data?.name === "tree";
    const isTitlesCommand =
      interaction.type === 2 && interaction.data?.name === "titles";
    const isBirthdayCommand = interaction.type === 2 && interaction.data?.name === "birthday";
    const isPunishmentCommand =
      interaction.type === 2 && (interaction.data?.name === "pickle" || interaction.data?.name === "timeout");
    const isCourtCommand =
      interaction.type === 2 && (interaction.data?.name === "court" || interaction.data?.name === "court-leaderboard");
    const customId = String(interaction.data?.custom_id || "");
    const isNewsComponent = interaction.type === 3 && customId.startsWith("news:ok:");
    const isExperimentComponent = interaction.type === 3 && customId.startsWith("experiment:");
    const isHeistComponent = interaction.type === 3 && customId.startsWith("heist:");
    const isIslandComponent = interaction.type === 3 && customId.startsWith("island:");
    const isBattleComponent = interaction.type === 3 && (customId.startsWith("battle:") || customId.startsWith("battleitem:") || customId.startsWith("bshop:"));
    const isPastelComponent = interaction.type === 3 && customId.startsWith("pastel:");
    const isSurpriseAlertComponent = interaction.type === 3 && customId.startsWith("surprise_alert:");
    const isTitlesComponent = interaction.type === 3 && (customId.startsWith("title:") || customId.startsWith("nameeffect:"));
    const isBirthdayComponent = interaction.type === 3 && customId.startsWith("birthday:");
    const isBirthdayModal = interaction.type === 5 && customId === "birthday:cursemodal";
    // Tree buttons can involve KV reads and optional Browser Rendering.
    // Acknowledge them immediately so Discord never leaves the button
    // spinning on "Bot is thinking..." while the tree action finishes.
    const isTreeComponent = interaction.type === 3 && customId.startsWith("tree:");
    // Shop buttons can involve KV reads/writes before the response is ready.
    // Acknowledge them immediately so Discord never hits the 3-second timeout.
    const isShopComponent =
      interaction.type === 3 &&
      (
        customId === "shop" ||
        customId === "shop_backgrounds" ||
        customId === "shop_trees" ||
        customId === "shop_decorations" ||
        customId === "shop_effects" ||
        customId === "shop_animated_effects" ||
        customId.startsWith("shop_animated_effects:") ||
        customId === "shop_limited" ||
        customId === "shop_limited_halloween" ||
        customId === "shop_special" ||
        customId === "back_tree" ||
        customId === "customize" ||
        customId === "inventory" ||
        customId.startsWith("buy_") ||
        customId.startsWith("limited_set:") ||
        customId.startsWith("inventory:")
      );

    const isCustomizeComponent =
      interaction.type === 3 &&
      (
        customId === "customize" ||
        customId === "custom_effects" ||
        customId.startsWith("custom_effects_page_") ||
        customId.startsWith("equip_")
      );

    const relevant = interaction.type === 2 || interaction.type === 3 || interaction.type === 5;

    // Color Key is a private, player-only response. It never edits the public game board.
    if (isPastelComponent && /^pastel:colorkey:[^:]+$/.test(customId)) {
      try {
        const gameId=customId.split(":")[2];
        const state=await getGuildState(env,interaction.guild_id);
        const game=await getPastelGame(env,interaction.guild_id,gameId);
        const user=getUserFromInteraction(interaction);
        if (!game || game.id!==gameId || game.status!=="playing") {
          return new Response(JSON.stringify({type:4,data:{content:"❌ That Color Chaos game is no longer active.",flags:64}}),{status:200,headers:{"Content-Type":"application/json"}});
        }
        if (!user || !game.players?.[user.id] || game.players[user.id].alive===false) {
          return new Response(JSON.stringify({type:4,data:{content:"❌ Only an active Color Chaos player can view the Color Key.",flags:64}}),{status:200,headers:{"Content-Type":"application/json"}});
        }
        return new Response(JSON.stringify({type:4,data:{content:pastelColorKeyText(game),flags:64}}),{status:200,headers:{"Content-Type":"application/json"}});
      } catch(error) {
        console.error("Color Key response error:",error);
        return new Response(JSON.stringify({type:4,data:{content:`❌ Couldn't load the Color Key: ${error?.message||"Unknown error"}`,flags:64}}),{status:200,headers:{"Content-Type":"application/json"}});
      }
    }

    // Titles must return the actual menu in the initial Discord response.
    // Waiting on waitUntil() after sending a placeholder can leave some Discord
    // clients stuck on the loading message forever. Build the small menu here.
    if (isTitlesCommand) {
      try {
        const data = await buildTitlesResponseData(env, interaction);
        return new Response(JSON.stringify({ type: 4, data }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Titles initial response error:", error);
        return new Response(JSON.stringify({
          type: 4,
          data: { content: `❌ Couldn't load Titles & Name Effects: ${error?.message || "Unknown error"}`, flags: 64 }
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Birthday Shop buttons use an immediate type-4 response instead of a
    // type-6 update ACK. This gives Discord a complete initial interaction
    // response immediately, then the real shop is edited into that response
    // after the KV reads finish. This avoids both the 3-second timeout and the
    // blank/no-op behavior caused by the previous type-6 path.
    if (interaction.type === 3 && /^birthday:shop(?::\d+)?$/.test(customId)) {
      const ack = await fetch(
        `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: 4,
            data: { content: "🦇🛍️ Loading the Midnight Birthday Shop..." }
          })
        }
      );
      if (!ack.ok) {
        console.error("Birthday Shop initial response failed:", ack.status, await ack.text());
        return new Response("OK", { status: 200 });
      }
      // The type-4 response above creates @original, which can safely be
      // edited by sendText/editOriginalResponse after the KV work completes.
      interaction.__deferred = true;
      interaction.__deferredUpdate = false;
      interaction.__deferredEphemeral = false;
      const page = Number(customId.split(":")[2] || 0);
      ctx.waitUntil((async () => {
        try {
          await showBirthdayShop(env, interaction, page);
        } catch (error) {
          console.error("Birthday Shop button error:", error);
          try {
            await editOriginalResponse(env, interaction, {
              content: `❌ Couldn't open the Birthday Shop: ${error?.message || "Unknown error"}`,
              components: []
            });
          } catch (editError) {
            console.error("Could not send Birthday Shop error:", editError);
          }
        }
      })());
      return new Response("OK", { status: 200 });
    }

    // Birthday Curse's Enter Answer button must open a Discord modal (type 9)
    // directly. Do NOT send the normal deferred type-5 acknowledgement first,
    // because Discord only allows the modal callback as the initial response.
    // Deferring first can make the button appear to do nothing until it is
    // clicked repeatedly.
    if (interaction.type === 3 && customId === "birthday:curseinput") {
      return showBirthdayCurseModal(env, interaction);
    }

    if (relevant) {
      let update = false;
      let ephemeral = false;

      if (isNewsCommand || isBlacklistCommand) {
        ephemeral = true;
      } else if (isBattleCommand) {
        ephemeral = interaction.data?.name === "battleshop" || interaction.data?.name === "battle-end";
      } else if (isSoloCommand) {
        const sub = interaction.data?.options?.find(option => option.type === 1)?.name || "start";
        ephemeral = ["status", "end", "leaderboard"].includes(sub);
      } else if (isColorCommand) {
        ephemeral = true;
      } else if (isExperimentCommand) {
        const sub = interaction.data?.options?.find(option => option.type === 1)?.name || "create";
        ephemeral = sub === "end";
      } else if (isPastelCommand) {
        // Color Chaos lobbies must be public so other players can actually see
        // and join them. Only the end-game command remains private.
        const sub = interaction.data?.options?.find(option => option.type === 1)?.name || "create";
        ephemeral = ["end", "leaderboard"].includes(sub);
      } else if (isCourtCommand) {
        // Raccoon Court is a public community feature.
        ephemeral = false;
      } else if (isFreeCommand || isTitlesCommand || isPunishmentCommand) {
        // FREE guesses and the Titles menu are private.
        ephemeral = true;
      } else if (isHeistCommand) {
        const sub = interaction.data?.options?.find(option => option.type === 1)?.name || "status";
        ephemeral = ["join", "leave", "start", "status", "end"].includes(sub);
      } else if (isIslandCommand) {
        const sub = interaction.data?.options?.find(option => option.type === 1)?.name || "status";
        ephemeral = ["rules", "status"].includes(sub);
      } else if (isExperimentComponent) {
        const action = String(interaction.data.custom_id).split(":")[1];
        if (action === "vote" || action === "clue" || action === "status") ephemeral = true;
        else update = true;
      } else if (isHeistComponent) {
        ephemeral = true;
      } else if (isIslandComponent) {
        const action = String(interaction.data.custom_id).split(":")[1];
        update = ["join", "leave", "rounds", "back", "start", "choice"].includes(action);
      } else if (isBattleComponent) {
        update = true;
      } else if (isPastelComponent) {
        update = true;
      } else if (isBirthdayComponent) {
        update = true;
      } else if (isTitlesComponent) {
        update = true;
      } else if (isNewsComponent) {
        update = true;
        ephemeral = true;
      } else if (isSurpriseAlertComponent) {
        // The alert is an ephemeral follow-up message. Updating the
        // component interaction edits that private alert in place.
        update = true;
        ephemeral = true;
      } else if (isTreeComponent) {
        // Tree actions should update the existing /tree message rather than
        // showing a long-running ephemeral "Bot is thinking..." state.
        update = true;
      } else if (isCustomizeComponent) {
        // Customize menus and equip actions can perform KV reads/writes.
        // Acknowledge immediately so Discord does not leave the button
        // spinning on "Bot is thinking..." while the menu is rebuilt.
        update = true;
            } else if (isShopComponent) {
        // Shop handlers edit the existing shop message after KV work.
        // A type-6 update ACK removes the Discord "Bot is thinking..."
        // state immediately and avoids leaving the button interaction
        // spinning while the shop is being rebuilt.
        update = true;
      }

      const responseType = update ? 6 : 5;
      const responseData = ephemeral && !update ? { flags: 64 } : {};

      // Mark the interaction as already acknowledged so the handlers edit
      // the deferred response instead of trying to acknowledge it a second time.
      interaction.__deferred = true;
      interaction.__deferredUpdate = update;
      interaction.__deferredEphemeral = ephemeral;

      ctx.waitUntil((async () => {
        try {
          const user = getUserFromInteraction(interaction);
          const isNewsAcknowledgement = isNewsComponent;
          const blacklisted = user && user.id !== env.OWNER_ID ? await isUserBlacklisted(env, String(user.id)) : false;
          if (blacklisted && !isNewsAcknowledgement) {
            if (interaction.type === 3) await sendEphemeralFollowup(env, interaction, "🚫 **Access Restricted**\n\nYou currently cannot use the Werewives bot. If you believe this was a mistake, contact the bot owner.");
            else await sendText(env, interaction, "🚫 **Access Restricted**\n\nYou currently cannot use the Werewives bot. If you believe this was a mistake, contact the bot owner.");
            return;
          }
          if (!isPunishmentCommand && !isNewsAcknowledgement) await maybeShowSurpriseAlert(env, interaction);
          await maybeCourtWatch(env, interaction);
          await maybePublicShame(env, interaction);
          await maybeSpoonInvestigation(env, interaction);
          if (interaction.type === 2) {
            await handleCommand(env, interaction);
          } else {
            await handleComponent(env, interaction);
          }
          if (!isNewsAcknowledgement) await maybeShowNews(env, interaction);
        } catch (error) {
          console.error("Interaction error:", error);
          try {
            await editOriginalResponse(env, interaction, {
              content: `❌ Something went wrong: ${error?.message || "Unknown error"}`
            });
          } catch (editError) {
            console.error("Could not send interaction error message:", editError);
          }
        }
      })());

      return new Response(
        JSON.stringify({ type: responseType, data: responseData }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    try {
      if (interaction.type === 2) {
        await handleCommand(env, interaction);
      } else if (interaction.type === 3) {
        await handleComponent(env, interaction);
      }
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Interaction error:", error);
      return new Response("OK", { status: 200 });
    }
  },


 /* =======================================================
   SCHEDULED TASKS

   Cloudflare cron should be configured separately
   in Cloudflare Worker Settings → Triggers → Cron Triggers.

   Every scheduled pass checks:
   - Raccoon Heist timers
   - Chaos Island round timers

   Standalone hourly Chaos Events are disabled; Chaos Island is now
   the main home for chaos gameplay.
======================================================= */

  async scheduled(
    event,
    env,
    ctx
  ) {
    ctx.waitUntil(
      Promise.all([
        processHeistTimers(
          env
        ),
        processChaosIslandTimers(
          env
        ),
        processPastelTimers(
          env
        ),
        processCourtTrashRelease(env),
        processBirthdayEvent(env),
        expireBirthdayEventState(env)
      ])
    );
  }
};
