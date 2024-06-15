"""
IF YOU GONNA SKID JUST DO IT I DON'T GIVE A FUCK ABOUT YOUR SHIT

   Please do keep in mind that Nodejs is better then Python 

   Initialization
   pip install nextcord requests

"""


import nextcord
import requests
from nextcord.ext import commands
from nextcord import Interaction, ButtonStyle
from nextcord.ui import Button, View

intents = nextcord.Intents.default()
bot = commands.Bot(command_prefix='!', intents=intents)

TOKEN = "ur bot token"

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')

class TinyurlModal(nextcord.ui.Modal):
    def __init__(self):
        super().__init__(title="URL Shortener")

        self.url_input = nextcord.ui.TextInput(
            label="กรุณาใส่ลิ้งค์ที่จะย่อ",
            placeholder="กรอกลิงค์ตรงนี้",
            required=True
        )
        self.add_item(self.url_input)

    async def callback(self, interaction: nextcord.Interaction):
        url = self.url_input.value

        try:
            embed = nextcord.Embed(title="Processing Request", color=0xffea00)
            embed.add_field(name="Status", value="> ```Shortening...```")
            message = await interaction.response.send_message(embed=embed, ephemeral=True)

            response = requests.get(f'http://tinyurl.com/api-create.php?url={url}')
            shortened_url = response.text

            embed = nextcord.Embed(
                title="__ทำการย่อ ลิงค์สำเร็จ__",
                description=f"{shortened_url}",
                color=0x00FF00
            )

            await message.edit(embed=embed)
        except Exception as e:
            print(e)
            await interaction.response.send_message("> ```เกิดข้อผิดพลาดจาก API```", ephemeral=True)

class TinyurlView(View):
    @nextcord.ui.button(label="Shorten URL", style=ButtonStyle.blurple)
    async def button_callback(self, button: Button, interaction: Interaction):
        await interaction.response.send_modal(TinyurlModal())

@bot.slash_command(name="shorten_menu", description="Tiny URL Generator")
async def tinyurl_gen(interaction: Interaction):
    embed = nextcord.Embed(
        title="ระบบย่อลิงค์ | Shorten Url",
        description="```กดปุ่มด้านล่างแล้วใส่ลิงค์เพื่อทำการย่อลิงค์ที่ต้องการ```",
        color=0xf8f5f5
    )
    await interaction.response.send_message(embed=embed, view=TinyurlView())

bot.run(TOKEN)
