export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("MyTree Bot is online! 🌲✨");
    }

    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");

    if (!signature || !timestamp) {
      return new Response("Missing Discord signature", { status: 401 });
    }

    const body = await request.text();

    const isValid = await verifyDiscordRequest(
      signature,
      timestamp,
      body,
      env.DISCORD_PUBLIC_KEY
    );

    if (!isValid) {
      return new Response("Invalid request signature", { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Discord endpoint verification
    if (interaction.type === 1) {
      return Response.json({ type: 1 });
    }

    // Slash commands
    if (interaction.type === 2) {
      const command = interaction.data?.name;

      if (command === "tree") {
        return Response.json({
          type: 4,
          data: {
            content: "🌲✨ MyTree Bot is alive!"
          }
        });
      }

      return Response.json({
        type: 4,
        data: {
          content: `🌲 You used /${command}!`
        }
      });
    }

    return new Response("Unknown interaction", { status: 400 });
  }
};

async function verifyDiscordRequest(signature, timestamp, body, publicKey) {
  try {
    const encoder = new TextEncoder();

    const message = encoder.encode(timestamp + body);

    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);

    const key = await crypto.subtle.importKey(
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
  } catch (error) {
    return false;
  }
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}
