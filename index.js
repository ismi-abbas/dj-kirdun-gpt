require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const logger = require("./logger.js");

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
    logger.error(error);
  }
})();

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  logger.info(`Interaction received: ${interaction}`);
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  if (interaction.commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
    logger.info(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  }

  if (interaction.commandName === "test") {
    await interaction.reply("Testing the server!");
  }

  if (interaction.commandName === "ask") {
    await interaction.reply("Ask the GPT-4!");
  }
});

client.login(TOKEN);
