require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");

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

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  if (interaction.commandName === "server") {
    await interaction.reply(
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
