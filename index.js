require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const logger = require("./logger.js");
const makeRequest = require("./gpt.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "server",
    description: "Give server name!",
  },
  {
    name: "test",
    description: "Testing the server!",
  },
  {
    name: "ask",
    description: "Ask the GPT-4!",
    options: [
      {
        name: "input",
        description: "Input to the GPT-4",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "clear",
    description: "Clear the chat!",
  },
];

if (!TOKEN) {
  logger.error("TOKEN is not defined in .env file");
}
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    logger.info("Started refreshing application (/) commands.");

    if (!CLIENT_ID) {
      logger.success("CLIENT_ID is not defined in .env file");
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
      logger.error(JSON.stringify(error));
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
    const prompt = interaction.options.getString("input");
    try {
      await interaction.deferReply("Asking GPT-4...");
      const response = await makeRequest(prompt);

      logger.info({
        message: "GPT-4 responded",
        response,
      });

      interaction.editReply({
        content: `Prompt: ${prompt}\n\nResponse: ${response}`,
      });
    } catch (error) {
      logger.error(error);
    }
  }
});

client.login(TOKEN);
