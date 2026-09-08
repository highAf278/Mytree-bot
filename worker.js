// =====================================
// MyTree Bot 🌸🌲✨
// Cloudflare Worker + Discord
// =====================================

const TREE_VERSION = 4;

const XP_PER_WATER = 5;

const BASE_COOLDOWN_MINUTES = 5;

const MAX_COOLDOWN_MINUTES = 60;


// =====================================
// MAIN WORKER
// =====================================

export default {
  async fetch(request, env) {

    const url = new URL(request.url);


    // ---------------------------------
    // Register Discord commands
    // ---------------------------------

    if (
      url.pathname === "/register" &&
      request.method === "GET"
    ) {
      return await registerMyTree(env);
    }


    // ---------------------------------
    // Normal browser visit
    // ---------------------------------

    if (request.method !== "POST") {
      return new Response(
        "🌸🌲 MyTree Bot is online! 🌲🌸"
      );
    }


    // ---------------------------------
    // Discord security verification
    // ---------------------------------

    const signature =
      request.headers.get(
        "X-Signature-Ed25519"
      );

    const timestamp =
      request.headers.get(
        "X-Signature-Timestamp"
      );

    if (!signature || !timestamp) {
      return new Response(
        "Missing signature",
        { status: 401 }
      );
    }


    const body =
      await request.text();


    const valid =
      await verify(
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


    let interaction;

    try {
      interaction =
        JSON.parse(body);
    } catch {
      return new Response(
        "Invalid JSON",
        { status: 400 }
      );
    }


    // ---------------------------------
    // Discord verification ping
    // ---------------------------------

    if (interaction.type === 1) {
      return Response.json({
        type: 1
      });
    }


    // =================================
    // SLASH COMMANDS
    // =================================

    if (interaction.type === 2) {

      const command =
        interaction.data?.name;


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


      // ---------------------------------
      // /mytree
      // ---------------------------------

      if (command === "mytree") {

        const tree =
          await getTree(
            env,
            userId,
            username
          );


        return Response.json({
          type: 4,
          data:
            treeMessage(
              tree,
              username
            )
        });
      }


      // ---------------------------------
      // /water
      // ---------------------------------

      if (command === "water") {

        return await waterTree(
          env,
          userId,
          username
        );
      }


      // ---------------------------------
      // /nametree
      // ---------------------------------

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


      // ---------------------------------
      // /leaderboard
      // ---------------------------------

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


    // =================================
    // BUTTON INTERACTIONS
    // =================================

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


  // ---------------------------------
  // Create / reset tree
  // ---------------------------------

  if (
    !tree ||
    tree.version !== TREE_VERSION
  ) {

    tree = {

      version:
        TREE_VERSION,

      username:
        username ||
        "Tree Owner",

      name:
        "Little Sprout",

      growth:
        0,

      waterings:
        0,

      stage:
        "🌰 Seed",

      health:
        100,

      nextWaterAt:
        0
    };


    await saveTree(
      env,
      userId,
      tree
    );


    return tree;
  }


  // ---------------------------------
  // Keep username updated
  // ---------------------------------

  tree.username =
    username ||
    tree.username ||
    "Tree Owner";


  // ---------------------------------
  // Repair missing values
  // ---------------------------------

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
    typeof tree.health !== "number"
  ) {
    tree.health = 100;
  }


  if (
    typeof tree.nextWaterAt !== "number"
  ) {
    tree.nextWaterAt = 0;
  }


  if (!tree.name) {
    tree.name =
      "Little Sprout";
  }


  tree.stage =
    getStage(
      tree.growth
    );


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


  // ---------------------------------
  // Cooldown check
  // ---------------------------------

  if (
    tree.nextWaterAt &&
    now < tree.nextWaterAt
  ) {

    const remaining =
      tree.nextWaterAt -
      now;


    return discordMessage(
`💧🌲 **${tree.name} doesn't need water yet!**

Your tree is still soaking it in. 😂

⏳ Come back in **${formatDuration(remaining)}**

🌸 *${tree.name} is hydrated and judging you.* 🌸`
    );
  }


  // ---------------------------------
  // Give XP
  // ---------------------------------

  tree.growth +=
    XP_PER_WATER;


  tree.waterings +=
    1;


  tree.stage =
    getStage(
      tree.growth
    );


  tree.username =
    username;


  // ---------------------------------
  // Cooldown
  // ---------------------------------

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

async function buildLeaderboard(
  env
) {

  const allTrees = [];

  let cursor;


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

        allTrees.push(
          tree
        );
      }
    }


    if (result.list_complete) {
      cursor =
        undefined;
    } else {
      cursor =
        result.cursor;
    }

  } while (cursor);


  // ---------------------------------
  // Sort highest XP first
  // ---------------------------------

  allTrees.sort(
    (a, b) =>
      b.growth - a.growth
  );


  if (
    allTrees.length === 0
  ) {

    return (
      "🏆🌲 **MYTREE LEADERBOARD** 🌲🏆\n\n" +
      "Nobody has grown a tree yet! 😭🌱"
    );
  }


  const topTrees =
    allTrees.slice(0, 10);


  let message =
`🏆🌸 **MYTREE LEADERBOARD** 🌸🏆

`;


  topTrees.forEach(
    (tree, index) => {

      const medals = [
        "🥇",
        "🥈",
        "🥉"
      ];


      const medal =
        medals[index] ||
        `**${index + 1}.**`;


      message +=
`${medal} **${tree.name}**
👤 ${tree.username}
✨ ${tree.growth} XP
🌳 ${tree.stage}
💧 ${tree.waterings} waterings

`;
    }
  );


  message +=
`━━━━━━━━━━━━━━━━━━━━
🌱 Keep watering those trees! 🌱`;


  return message;
}


// =====================================
// CLEAN TREE NAME
// =====================================

function cleanName(name) {

  return name
    .replace(/[`@#*_~]/g, "")
    .trim();
}


// =====================================
// FORMAT TIME
// =====================================

function formatDuration(
  milliseconds
) {

  const totalSeconds =
    Math.ceil(
      milliseconds / 1000
    );


  const minutes =
    Math.floor(
      totalSeconds / 60
    );


  const seconds =
    totalSeconds % 60;


  if (minutes <= 0) {
    return `${seconds}s`;
  }


  if (seconds === 0) {
    return `${minutes}m`;
  }


  return `${minutes}m ${seconds}s`;
}


// =====================================
// DISCORD MESSAGE
// =====================================

function discordMessage(
  content,
  ephemeral = false
) {

  return Response.json({

    type: 4,

    data: {

      content,

      ...(ephemeral
        ? {
            flags: 64
          }
        : {})
    }
  });
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

    const key =
      await crypto.subtle.importKey(
        "raw",
        hexToUint8Array(
          publicKey
        ),
        {
          name:
            "Ed25519"
        },
        false,
        [
          "verify"
        ]
      );


    const message =
      new TextEncoder().encode(
        timestamp + body
      );


    const signatureBytes =
      hexToUint8Array(
        signature
      );


    return await crypto.subtle.verify(
      {
        name:
          "Ed25519"
      },
      key,
      signatureBytes,
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


// =====================================
// HEX → UINT8ARRAY
// =====================================

function hexToUint8Array(
  hex
) {

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


// =====================================
// REGISTER DISCORD COMMANDS
// =====================================

async function registerMyTree(
  env
) {

  const applicationId =
    env.DISCORD_APPLICATION_ID;


  const guildId =
    env.DISCORD_GUILD_ID;


  const botToken =
    env.DISCORD_BOT_TOKEN;


  if (
    !applicationId ||
    !guildId ||
    !botToken
  ) {

    return new Response(
`❌ Missing Discord environment variables.

Make sure these are configured:

DISCORD_APPLICATION_ID
DISCORD_GUILD_ID
DISCORD_BOT_TOKEN`,
      {
        status: 500
      }
    );
  }


  const commands = [

    {
      name: "mytree",

      description:
        "View your tree 🌸🌲"
    },


    {
      name: "water",

      description:
        "Water your tree 💧🌱"
    },


    {
      name: "nametree",

      description:
        "Give your tree a name 🎀🌲",

      options: [

        {
          name: "name",

          description:
            "What do you want to call your tree?",

          type: 3,

          required: true,

          max_length: 30
        }

      ]
    },


    {
      name: "leaderboard",

      description:
        "See the top MyTree owners 🏆🌲"
    }

  ];


  const response =
    await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`,
      {

        method:
          "PUT",

        headers: {

          "Authorization":
            `Bot ${botToken}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            commands
          )
      }
    );


  const result =
    await response.text();


  if (!response.ok) {

    return new Response(
`❌ Discord command registration failed.

Status: ${response.status}

${result}`,
      {
        status:
          response.status
      }
    );
  }


  return new Response(
`✅ **MyTree commands registered!** 🌸🌲

Commands:

🌱 /mytree
💧 /water
🎀 /nametree
🏆 /leaderboard

Go back to Discord and try them! 💕`,
    {
      status: 200,

      headers: {
        "Content-Type":
          "text/plain; charset=UTF-8"
      }
    }
  );
}
