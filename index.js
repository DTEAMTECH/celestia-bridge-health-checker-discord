require("dotenv").config();

const { REST, Routes } = require("discord.js");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("checknode")
    .setDescription("Check the health of a Celestia node")
    .addStringOption((option) =>
      option.setName("ip").setDescription("Node IP address").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("port")
        .setDescription("Node port number")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("Your Bridge Node auth token")
        .setRequired(true)
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started registering application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error("Failed to register commands:", error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "checknode") return;

  if (interaction.channelId !== CHANNEL_ID) {
    return interaction.reply({
      content: "❌ This command can only be used in the designated channel.",
      ephemeral: true,
    });
  }

  const ip = interaction.options.getString("ip", true);
  const port = interaction.options.getInteger("port", true);
  const tokenArg = interaction.options.getString("token", true);

  await interaction.deferReply({ ephemeral: true });

  try {
    const { data } = await axios.post(
      "https://celestia-bridge-checker.dteam.tech/proxy",
      { ip, port, token: tokenArg }
    );

    const result = data.data;
    let statusMessage = `🟢 **Good response.** ${data.message}`;
    let color = Colors.Green;

    if (/error/i.test(statusMessage)) {
      color = Colors.Red;
      statusMessage =
        "🔴 **Bad response.** Please check your IP, port, token and try again.";
    } else if (/warning/i.test(statusMessage)) {
      color = Colors.Yellow;
      statusMessage = statusMessage.replace(
        /warning:/gi,
        "\n\n🟡 **Warning:**"
      );
    }

    const embed = new EmbedBuilder()
      .setTitle("Node Status")
      .addFields(
        { name: "Status:", value: statusMessage },
        { name: "Chain ID:", value: result.header.chain_id, inline: true },
        { name: "Height:", value: result.header.height, inline: true }
      )
      .setColor(color)
      .setThumbnail(
        "https://raw.githubusercontent.com/DTEAMTECH/contributions/refs/heads/main/celestia/images/bridge_health_checker.png"
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error("Proxy request failed:", err);

    const errorEmbed = new EmbedBuilder()
      .setTitle("Node Status")
      .setDescription(
        "🔴 **Bad response.** Please check your IP, port, token and try again.\n\n" +
          "[How to use it?](https://github.com/DTEAMTECH/celestia-bridge-health-checker-discord)"
      )
      .setColor(Colors.Red)
      .setThumbnail(
        "https://raw.githubusercontent.com/DTEAMTECH/contributions/refs/heads/main/celestia/images/bridge_health_checker.png"
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
});

client.login(TOKEN);
