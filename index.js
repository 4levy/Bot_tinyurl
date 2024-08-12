const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const token = "your_bot_token_here";

client.once('ready', () => {
    console.log('Started');
    client.guilds.cache.forEach(guild => {
        guild.commands.create({
            name: 'shorten_menu',
            description: 'Shorten URL'
        });
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isButton() && !interaction.isModalSubmit()) return;

    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandName === 'shorten_menu') {
            const embed = new EmbedBuilder()
                .setTitle('URL Shortener')
                .setColor(0xf8f5f5)
                .setDescription('Click the button below to shorten your URL.');

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
                .setLabel('Please enter the URL to shorten')
                .setPlaceholder('Enter the URL here')
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
                    .setTitle('URL Shortened Successfully')
                    .setDescription(shortenedUrl)
                    .setColor(0x00FF00);

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'An error occurred with the API.', ephemeral: true });
            }
        }
    }
});

client.login(token);
