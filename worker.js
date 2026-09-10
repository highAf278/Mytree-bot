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

const STONED_BACKGROUND_IMAGE = STONED_BACKGROUND;

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
   TREE POSITION
========================================================= */

const TREE_TOP_POSITION = 76;

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
      "🐺 **WEREWIFE HOWL!**\n\nThe server has collectively howled at the moon. Sparkles have appeared.",
    amount: 35
  },
  {
    message:
      "💅 **GIRLBOSS EMERGENCY!**\n\nEveryone has been promoted to CEO of absolutely nothing.",
    amount: 40
  },
  {
    message:
      "✨ **SPARKLE STORM!**\n\nThe sky has started raining sparkles. RUN.",
    amount: 50
  },
  {
    message:
      "🦝 **THE RACCOON KNOWS SOMETHING.**\n\nNobody knows what. Everyone gets sparkles anyway.",
    amount: 20
  },
  {
    message:
      "🍝 **SPAGHETTI INCIDENT!**\n\nThe server has been temporarily covered in spaghetti.",
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
