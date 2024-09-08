require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, Colors } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const token = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    if (message.content.startsWith('!checknode')) {
        const args = message.content.split(' ').slice(1);
        if (args.length !== 3) {
            return message.reply('Usage: !checknode <ip> <port> <token>');
        }

        const [ip, port, token] = args;

        try {
            const response = await axios.post('https://celestia-bridge-checker.dteam.tech/proxy', {
                ip,
                port: parseInt(port, 10),
                token
            });

            const result = response.data.data;
            let statusMessage = `🟢 **Good response.** ${response.data.message}`;

            let color = Colors.Green;
            if (statusMessage.toLowerCase().includes('error')) {
                color = Colors.Red;
                statusMessage = `🔴 **Bad response.** Please, check your IP, port, token and try again.`;
            } else if (statusMessage.toLowerCase().includes('warning')) {
                color = Colors.Yellow;
                statusMessage = statusMessage.replace(/warning:/gi, '\n\n🟡 **Warning:**');
            }

            const embed = new EmbedBuilder()
                .setTitle('Node Status')
                .addFields(
                    { name: 'Status:', value: statusMessage },
                    { name: 'Chain ID:', value: result.header.chain_id, inline: true },
                    { name: 'Height:', value: result.header.height, inline: true }
                )
                .setColor(color)
                .setThumbnail('https://raw.githubusercontent.com/DTEAMTECH/contributions/main/celestia/utils/bridge_status_checker.png')
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            await message.delete();
        } catch (error) {
            const errorMessage = `🔴 **Bad response.** Please, check your IP, port, token and try again.`;
            const embed = new EmbedBuilder()
                .setTitle('Node Status')
                .setDescription(`${errorMessage}\n\n[How to use it?](https://github.com/DTEAMTECH/contributions/tree/main/celestia#celestia-bridge-health-checker-usage)`)
                .setColor(Colors.Red)
                .setThumbnail('https://raw.githubusercontent.com/DTEAMTECH/contributions/main/celestia/utils/bridge_status_checker.png')
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            await message.delete();
        }
    }
});

client.login(token);