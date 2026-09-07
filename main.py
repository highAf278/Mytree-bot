import discord
from discord import app_commands
import os

intents = discord.Intents.default()

class MyTreeBot(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()

client = MyTreeBot()


@client.tree.command(name="mytree", description="View your personal tree!")
async def mytree(interaction: discord.Interaction):
    await interaction.response.send_message(
        f"🎄 **{interaction.user.display_name}'s Tree**\n\n"
        "🌲 Classic Pine\n"
        "🖼️ Default Background\n"
        "⭐ Classic Star\n\n"
        "✨ Your tree is ready to decorate!"
    )


@client.event
async def on_ready():
    print(f"Logged in as {client.user}")


client.run(os.environ["DISCORD_TOKEN"])
