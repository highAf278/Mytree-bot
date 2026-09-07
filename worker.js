export default {
  async fetch(request, env) {
    // Discord sends a POST request to verify the endpoint
    if (request.method === "POST") {
      const body = await request.json();

      // Discord's initial endpoint verification
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

    return new Response("MyTree Bot is online! 🌲✨");
  }
};
