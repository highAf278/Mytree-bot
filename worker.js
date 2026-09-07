export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Discord sends a POST request when someone uses a slash command
    if (request.method === "POST") {
      const body = await request.json();

      // Discord endpoint verification
      if (body.type === 1) {
        return Response.json({
          type: 1
        });
      }

      // Handle slash commands
      if (body.type === 2) {
        const command = body.data?.name;

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
    }

    // Normal browser request
    return new Response("MyTree Bot is online! 🌲✨");
  }
};
