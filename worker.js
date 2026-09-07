// =====================================
// MyTree Bot 🌸🌲✨
// =====================================

const TREE_VERSION = 3;
const XP_PER_WATER = 5;
const BASE_COOLDOWN_MINUTES = 5;
const MAX_COOLDOWN_MINUTES = 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Command registration
    if (url.pathname === "/register") {
      return await registerMyTree(env);
    }

    // Normal browser visit
    if (request.method !== "POST") {
      return new Response("MyTree Bot is online! 🌲✨");
    }

    // Discord security verification
    const signature = request.headers.get(
      "X-Signature-Ed25519"
    );

    const timestamp = request.headers.get(
      "X-Signature-Timestamp"
    );

    if (!signature || !timestamp) {
      return new Response(
        "Missing signature",
        { status: 401 }
      );
    }

    const body = await request.text();

    const valid = await verify(
      signature,
      timestamp,
      body,
      env.DISCORD_PUBLIC_KEY
    );

    if (!valid) {
      return new Response(
        "Invalid signature",
        { status: 401 }
      );
    }

    const interaction = JSON.parse(body);

    // Discord verification ping
    if (interaction.type === 1) {
      return Response.json({
        type: 1
      });
    }

    // =====================================
    // SLASH COMMANDS
    // =====================================

    if (interaction.type === 2) {
      const command =
        interaction.data?.name;

      const user =
        interaction.member?.user ||
        interaction.user;

      const userId = user?.id;

      const username =
        user?.global_name ||
        user?.username ||
        "Tree Owner";

      if (!userId) {
        return discordMessage(
          "🌲 I couldn't figure out who owns this tree! 😂"
        );
      }

      // -------------------------
      // /mytree
      // -------------------------

      if (command === "mytree") {
        const tree =
          await getTree(
            env,
            userId,
            username
          );

        return Response.json({
          type: 4,
          data: treeMessage(tree, username)
        });
      }

      // -------------------------
      // /water
      // -------------------------

      if (command === "water") {
        return await waterTree(
          env,
          userId,
          username
        );
      }

      // -------------------------
      // /nametree
      // -------------------------

      if (command === "nametree") {
        const tree =
          await getTree(
            env,
            userId,
            username
          );

        const option =
          interaction.data?.options?.find(
            option =>
              option.name === "name"
          );

        const newName =
          option?.value?.trim();

        if (!newName) {
          return discordMessage(
            "🌲 Your tree needs a name! 😂"
          );
        }

        if (newName.length > 30) {
          return discordMessage(
            "🌲 Whoa there! Tree names can only be **30 characters** long. 😂"
          );
        }

        tree.name =
          cleanName(newName);

        tree.username =
          username;

        await saveTree(
          env,
          userId,
          tree
        );

        return discordMessage(
`🎀🌲 **TREE NAMED!** 🌲🎀

Your tree is now officially called:

✨ **${tree.name}** ✨

🌱 Growth: **${tree.growth} XP**
💧 Waterings: **${tree.waterings}**

*Take good care of ${tree.name}...* 👀🌱`
        );
      }

      // -------------------------
      // /leaderboard
      // -------------------------

      if (command === "leaderboard") {
        const leaderboard =
          await buildLeaderboard(env);

        return discordMessage(
          leaderboard
        );
      }

      return discordMessage(
        "🌲 Unknown command! The tree is confused. 💀"
      );
    }

    // =====================================
    // BUTTON INTERACTIONS
    // =====================================

    if (interaction.type === 3) {
      const customId =
        interaction.data?.custom_id;

      if (customId === "water_tree") {
        const user =
          interaction.member?.user ||
          interaction.user;

        const userId =
          user?.id;

        const username =
          user?.global_name ||
          user?.username ||
          "Tree Owner";

        if (!userId) {
          return discordMessage(
            "🌲 I couldn't figure out who owns this tree! 😂"
          );
        }

        return await waterTree(
          env,
          userId,
          username
        );
      }
    }

    return new Response(
      "Unknown interaction",
      { status: 400 }
    );
  }
};


// =====================================
// GET / CREATE TREE
// =====================================

async function getTree(
  env,
  userId,
  username
) {
  let tree =
    await env.MYTREE_DATA.get(
      userId,
      "json"
    );

  // Reset old versions
  if (
    !tree ||
    tree.version !== TREE_VERSION
  ) {
    tree = {
      version: TREE_VERSION,

      username:
        username || "Tree Owner",

      name:
        "Little Sprout",

      growth: 0,

      waterings: 0,

      stage:
        "🌰 Seed",

      health: 100,

      nextWaterAt: 0
    };

    await saveTree(
      env,
      userId,
      tree
    );

    return tree;
  }

  // Keep username updated
  tree.username =
    username || tree.username;

  // Make sure old/missing values exist
  if (
    typeof tree.growth !== "number"
  ) {
    tree.growth = 0;
  }

  if (
    typeof tree.waterings !== "number"
  ) {
    tree.waterings = 0;
  }

  if (
    typeof tree.nextWaterAt !== "number"
  ) {
    tree.nextWaterAt = 0;
  }

  tree.stage =
    getStage(tree.growth);

  await saveTree(
    env,
    userId,
    tree
  );

  return tree;
}


// =====================================
// SAVE TREE
// =====================================

async function saveTree(
  env,
  userId,
  tree
) {
  await env.MYTREE_DATA.put(
    userId,
    JSON.stringify(tree)
  );
}


// =====================================
// WATER TREE
// =====================================

async function waterTree(
  env,
  userId,
  username
) {
  const tree =
    await getTree(
      env,
      userId,
      username
    );

  const now =
    Date.now();

  // Check cooldown
  if (
    tree.nextWaterAt &&
    now < tree.nextWaterAt
  ) {
    const remaining =
      tree.nextWaterAt - now;

    return discordMessage(
`💧🌲 **${tree.name} doesn't need water yet!**

Your tree is still soaking it in. 😂

⏳ Come back in **${formatDuration(remaining)}**

🌸 *${tree.name} is hydrated and judging you.* 🌸`
    );
  }

  // Give XP
  tree.growth +=
    XP_PER_WATER;

  tree.waterings +=
    1;

  tree.stage =
    getStage(tree.growth);

  tree.username =
    username;

  // Cooldown increases:
  // 5, 10, 15, 20...
  // Maximum 60 minutes
  const cooldownMinutes =
    Math.min(
      tree.waterings *
        BASE_COOLDOWN_MINUTES,
      MAX_COOLDOWN_MINUTES
    );

  tree.nextWaterAt =
    now +
    cooldownMinutes *
      60 *
      1000;

  await saveTree(
    env,
    userId,
    tree
  );

  return discordMessage(
`💦🌸 **SPLASH!** 🌸💦

**${tree.name}** got watered! 🌱

✨ **+5 XP**
🌱 Growth: **${tree.growth} XP**
💧 Waterings: **${tree.waterings}**
🌳 Stage: **${tree.stage}**

⏳ Next watering in **${cooldownMinutes} minutes**

*${tree.name} is thriving. Probably.* 😂🌲`,
    true
  );
}


// =====================================
// TREE STAGES
// =====================================

function getStage(growth) {
  if (growth >= 10000) {
    return "🌌 Cosmic Chaos Tree";
  }

  if (growth >= 5000) {
    return "👑 Legendary Tree";
  }

  if (growth >= 2500) {
    return "✨ Magical Tree";
  }

  if (growth >= 1000) {
    return "🌲 Giant Tree";
  }

  if (growth >= 500) {
    return "🌳 Big Tree";
  }

  if (growth >= 250) {
    return "🌿 Growing Tree";
  }

  if (growth >= 100) {
    return "🌱 Young Tree";
  }

  if (growth >= 50) {
    return "🌿 Little Tree";
  }

  if (growth >= 10) {
    return "🌱 Baby Sprout";
  }

  return "🌰 Seed";
}


// =====================================
// TREE DISPLAY
// =====================================

function treeMessage(
  tree,
  username
) {
  let cooldownText =
    "💧 **Ready to water!**";

  if (tree.nextWaterAt) {
    const remaining =
      tree.nextWaterAt -
      Date.now();

    if (remaining > 0) {
      cooldownText =
        `⏳ Water again in **${formatDuration(remaining)}**`;
    }
  }

  return {
    content:
`🌸🌲 **${username}'s MyTree** 🌲🌸

╭────────────────────╮
   🌱 **${tree.name}**
╰────────────────────╯

🌳 Stage: **${tree.stage}**
✨ Growth: **${tree.growth} XP**
💧 Waterings: **${tree.waterings}**
❤️ Health: **${tree.health}/100**

━━━━━━━━━━━━━━━━━━━━

${cooldownText}

🏷️ Rename it with **/nametree**
🏆 Check rankings with **/leaderboard**

🌸 *Your tree can grow forever...* 🌸`,

    components: [
      {
        type: 1,

        components: [
          {
            type: 2,
            style: 1,
            label: "💧 Water Tree",
            custom_id: "water_tree"
          }
        ]
      }
    ]
  };
}


// =====================================
// LEADERBOARD
// =====================================

async function buildLeaderboard(env) {
  const allTrees = [];

  let cursor =
    undefined;

  do {
    const result =
      await env.MYTREE_DATA.list(
        cursor
          ? { cursor }
          : {}
      );

    for (
      const key of result.keys
    ) {
      const tree =
        await env.MYTREE_DATA.get(
          key.name,
          "json"
        );

      if (
        tree &&
        tree.version === TREE_VERSION
      ) {
        allTrees.push(tree);
      }
    }

    if (result.list_complete) {
      cursor = undefined;
    } else {
      cursor = result.cursor;
    }

  } while (cursor);

  // Highest XP first
  allTrees.sort(
    (a, b) =>
      b.growth - a.growth
  );

  if (
    allTrees.length === 0
  ) {
    return (
`🏆🌸 **MYTREE LEADERBOARD** 🌸🏆

Nobody has grown a tree yet! 😭🌱

Be the first with **/mytree**!`
    );
  }

  const topTrees =
    allTrees.slice(0, 10);

  const medals = [
    "🥇",
    "🥈",
    "🥉"
  ];

  let output =
`🏆🌸 **MYTREE LEADERBOARD** 🌸🏆

`;

  topTrees.forEach(
    (tree, index) => {
      const place =
        medals[index] ||
        `**${index + 1}.**`;

      output +=
`${place} **${tree.username}** — 🌱 **${tree.name}** — **${tree.growth} XP** ${tree.stage}\n`;
    }
  );

  output +=
`
━━━━━━━━━━━━━━━━━━━━

🌳 **${allTrees.length}** tree${allTrees.length === 1 ? "" : "s"} growing!

♾️ Keep watering to climb the rankings! 💧`;

  return output;
}


// =====================================
// DISCORD MESSAGE HELPER
// =====================================

function discordMessage(
  content,
  includeButton = false
) {
  const data = {
    type: 4,

    data: {
      content
    }
  };

  if (includeButton) {
    data.data.components = [
      {
        type: 1,

        components: [
          {
            type: 2,
            style: 1,
            label: "💧 Water Tree",
            custom_id: "water_tree"
          }
        ]
      }
    ];
  }

  return Response.json(data);
}


// =====================================
// NAME CLEANING
// =====================================

function cleanName(name) {
  return name
    .replace(/@/g, "@\u200b")
    .replace(/`/g, "")
    .trim();
}


// =====================================
// TIME FORMAT
// =====================================

function formatDuration(ms) {
  const totalSeconds =
    Math.ceil(ms / 1000);

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}


// =====================================
// DISCORD COMMAND REGISTRATION
// =====================================

async function registerMyTree(env) {
  const response =
    await fetch(
      `https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/commands`,
      {
        method: "PUT",

        headers: {
          "Authorization":
            `Bot ${env.DISCORD_BOT_TOKEN}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify([
          {
            name: "mytree",

            description:
              "Check on your growing tree 🌸🌲",

            type: 1
          },

          {
            name: "water",

            description:
              "Water your tree and gain 5 XP 💧",

            type: 1
          },

          {
            name: "nametree",

            description:
              "Give your tree a name 🎀",

            type: 1,

            options: [
              {
                name: "name",

                description:
                  "What do you want to name your tree?",

                type: 3,

                required: true,

                max_length: 30
              }
            ]
          },

          {
            name: "leaderboard",

            description:
              "See the biggest and best MyTrees 🏆",

            type: 1
          }
        ])
      }
    );

  const result =
    await response.text();

  return new Response(
    result,
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


// =====================================
// DISCORD SIGNATURE VERIFICATION
// =====================================

async function verify(
  signature,
  timestamp,
  body,
  publicKey
) {
  try {
    const message =
      new TextEncoder().encode(
        timestamp + body
      );

    const signatureBytes =
      hexToBytes(signature);

    const publicKeyBytes =
      hexToBytes(publicKey);

    const key =
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
      "Ed25519",

      key,

      signatureBytes,

      message
    );

  } catch {
    return false;
  }
}


// =====================================
// HEX → BYTES
// =====================================

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
        hex.substring(
          i * 2,
          i * 2 + 2
        ),
        16
      );
  }

  return bytes;
}
