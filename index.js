require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const logger = require("./logger.js");
const makeRequest = require("./gpt.js");
const commands = require("./command.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

if (!TOKEN) {
  logger.error("TOKEN is not defined in .env file");
}
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    logger.info("Started refreshing application (/) commands.");

    if (!CLIENT_ID) {
      logger.error("CLIENT_ID is not defined in .env file");
    }

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    logger.success("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error("Failed to reload application (/) commands.");
  }
})();

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  logger.info(`Interaction received: ${interaction}`);
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "clear") {
    try {
      await interaction.channel.bulkDelete(100);
    } catch (error) {
      logger.error(error);
    }
  }

  if (commandName === "ping") {
    await interaction.reply("pong!");
  }

  if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
    logger.info(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  }

  if (commandName === "test") {
    await interaction.reply("Testing the server!");
  }

  if (commandName === "ask") {
    const user = interaction.user;
    const prompt = interaction.options.getString("input");
    try {
      await interaction.deferReply();
      const response = await makeRequest(prompt);

      logger.info(`Prompt: ${prompt}\n\nResponse: ${response}`);

      interaction.editReply({
        content: `Prompt: ${prompt}\n\nResponse: ${response}`,
      });
    } catch (error) {
      logger.info(error);
    }
  }
});

client.login(TOKEN);
