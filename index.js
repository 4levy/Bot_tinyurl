/*
IF YOU GONNA SKID JUST DO IT I DON'T GIVE A FUCK ABOUT YOUR SHIT


   Please do keep in mind that Nodejs is better then Python on discord

   Initialization
npm install discord.js@14 @discordjs/builders axios


*/



const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
    console.log('Started');
    client.guilds.cache.forEach(guild => {
        guild.commands.create({
            name: 'shorten_menu',
            description: 'shorten url'
        });
    });
});

const token = "token??~!"

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isButton() && !interaction.isModalSubmit()) return;

    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandName === 'shorten_menu') {
            const embed = new EmbedBuilder()
                .setTitle('ระบบย่อลิงค์ | Shorten Url')
                .setColor(0xf8f5f5)
                .setDescription('```กดปุ่มด้านล่างแล้วใส่ลิงค์เพื่อทำการย่อลิงค์ที่ต้องการ```');

            const button = new ButtonBuilder()
                .setCustomId('shorten_url')
                .setLabel('Shorten URL')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            await interaction.reply({ embeds: [embed], components: [row] });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'shorten_url') {
            const modal = new ModalBuilder()
                .setCustomId('urlModal')
                .setTitle('Enter URL to Shorten');

            const urlInput = new TextInputBuilder()
                .setCustomId('urlInput')
                .setLabel('กรุณาใส่ลิ้งค์ที่จะย่อ')
                .setPlaceholder('กรอกลิงค์ตรงนี้')
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(urlInput);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'urlModal') {
            const url = interaction.fields.getTextInputValue('urlInput');

            try {
                const response = await axios.get(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
                const shortenedUrl = response.data;

                const embed = new EmbedBuilder()
                    .setTitle('__ทำการย่อ ลิงค์สำเร็จ__')
                    .setDescription(`${shortenedUrl}`)
                    .setColor(0x00FF00);

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '> ```เกิดข้อผิดพลาดจาก API```', ephemeral: true });
            }
        }
    }
});

client.login(token);
