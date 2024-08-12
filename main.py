import nextcord
import requests
from nextcord.ext import commands
from nextcord import Interaction, ButtonStyle
from nextcord.ui import Button, View

intents = nextcord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

TOKEN = "your_bot_token_here"

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')

class TinyurlModal(nextcord.ui.Modal):
    def __init__(self):
        super().__init__(title="URL Shortener")
        self.url_input = nextcord.ui.TextInput(
            label="Enter URL to shorten",
            placeholder="Paste your URL here",
            required=True,
            style=nextcord.TextInputStyle.long
        )
        self.add_item(self.url_input)

    async def callback(self, interaction: nextcord.Interaction):
        url = self.url_input.value

        try:
            embed = nextcord.Embed(title="Processing Request", color=0xffea00)
            embed.add_field(name="Status", value="Shortening...")
            message = await interaction.response.send_message(embed=embed, ephemeral=True)

            response = requests.get(f'http://tinyurl.com/api-create.php?url={url}')
            response.raise_for_status()
            shortened_url = response.text

            embed = nextcord.Embed(
                title="URL Shortened Successfully",
                description=f"Shortened URL: {shortened_url}",
                color=0x00FF00
            )
            await message.edit(embed=embed)
        except requests.RequestException:
            await interaction.response.send_message("An error occurred while trying to shorten the URL.", ephemeral=True)
        except Exception as e:
            print(f"Unexpected error: {e}")
            await interaction.response.send_message("An unexpected error occurred.", ephemeral=True)

class TinyurlView(View):
    @nextcord.ui.button(label="Shorten URL", style=ButtonStyle.blurple)
    async def button_callback(self, button: Button, interaction: Interaction):
        await interaction.response.send_modal(TinyurlModal())

@bot.slash_command(name="shorten_menu", description="Generate a Tiny URL")
async def tinyurl_gen(interaction: Interaction):
    embed = nextcord.Embed(
        title="URL Shortener",
        description="Click the button below to shorten a URL.",
        color=0xf8f5f5
    )
    await interaction.response.send_message(embed=embed, view=TinyurlView())

bot.run(TOKEN)
