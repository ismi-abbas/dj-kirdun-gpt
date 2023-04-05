import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  bold,
  blockQuote,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js'
import logger from './logger.js'
import { makeRequest } from './gpt.js'
import commands from './command.js'
import * as dotenv from 'dotenv'
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
})

if (TOKEN === undefined) {
  logger.error('TOKEN is not defined in .env file')
}
const rest = new REST().setToken(TOKEN)

;(async () => {
  try {
    logger.info('Started refreshing application (/) commands.')

    if (CLIENT_ID === undefined) {
      logger.error('CLIENT_ID is not defined in .env file')
    }

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

    logger.success('Successfully reloaded application (/) commands.')
  } catch (error) {
    logger.error(
      `Failed to reload application (/) commands. ${JSON.stringify(error)}`
    )
  }
})().catch((error) => {
  logger.error(error)
})

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('createMessage', async (message) => {
  logger.info(`Message received: ${message}`)
  if (message.author.bot) return

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Quotes of the day')
    .setURL('https://discord.js.org/')
    .setAuthor({
      name: 'Some name',
      iconURL: 'https://i.imgur.com/AfFp7pu.png',
      url: 'https://discord.js.org'
    })
    .setDescription('Test')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      { name: 'Regular field title', value: 'Some value here' },
      { name: '\u200B', value: '\u200B' },
      { name: 'Inline field title', value: 'Some value here', inline: true },
      { name: 'Inline field title', value: 'Some value here', inline: true }
    )
    .addFields({
      name: 'Inline field title',
      value: 'Some value here',
      inline: true
    })
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({
      text: 'Some footer text here',
      iconURL: 'https://i.imgur.com/AfFp7pu.png'
    })

  message.channel.send({
    embeds: [embed]
  })
})

client.on('interactionCreate', async (interaction) => {
  logger.info(`Interaction received: ${interaction}`)
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'clear') {
    try {
      await interaction.channel.bulkDelete(100)
      await interaction.reply({
        content: 'Cleared the channel!',
        ephemeral: true
      })
    } catch (error) {
      logger.error(error)
    }
  }

  if (interaction.commandName === 'ping') {
    await interaction.reply('pong!')
  }

  if (interaction.commandName === 'server') {
    logger.info(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    )
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    )
  }

  if (interaction.commandName === 'test') {
    await interaction.reply({ content: 'Testing the server!' })
  }

  if (interaction.commandName === 'ask') {
    const prompt = interaction.options.getString('input')
    try {
      await interaction.reply('Fetching data from GPT-4...')
      const response = await makeRequest(prompt, 'ask')

      const responseFormat = `${bold('Prompt:')} ${prompt}\n\n${bold(
        'Response:'
      )} ${response}`

      await interaction.editReply({
        content: blockQuote(responseFormat)
      })
    } catch (error) {
      logger.error(error)
    }
  }

  if (interaction.commandName === 'select') {
    const btn_sel_1 = new ButtonBuilder()
      .setCustomId('english')
      .setLabel('English')
      .setStyle(ButtonStyle.Primary)

    const btn_sel_2 = new ButtonBuilder()
      .setCustomId('malay')
      .setLabel('Malay')
      .setStyle(ButtonStyle.Primary)

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      btn_sel_1,
      btn_sel_2
    )

    await interaction.reply({
      content: 'Please select a language for GPT-4',
      components: [actionRow]
    })
  }

  if (interaction.commandName === 'quote') {
    const prompt = 'Give me a motivational quote'
    let quote: string = ''

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Quotes of the day')
      .setURL('https://discord.js.org/')
      .setAuthor({
        name: 'Some name',
        iconURL: 'https://i.imgur.com/AfFp7pu.png',
        url: 'https://discord.js.org'
      })
      .setDescription(quote)
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true }
      )
      .addFields({
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
      })
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({
        text: 'Some footer text here',
        iconURL: 'https://i.imgur.com/AfFp7pu.png'
      })
    try {
      const answer = await makeRequest(prompt, 'quote')
      // embed.setDescription(answer)
      await interaction.channel.send({ embeds: [embed] })
    } catch (error) {
      console.log(error)
      logger.error(error)
    }
  }

  if (interaction.commandName === 'github') {
    const username = interaction.options.getString('username')
    await interaction.reply('Fetching data from github...')
    const data = await fetch(`https://api.github.com/users/${username}`)
    const answer = await data.json()
    logger.info(JSON.stringify(answer))
    await interaction.editReply({
      content: `Name: ${answer.name}\nUsername: ${answer.login}\nBio: ${answer.bio}\nFollowers: ${answer.followers}\nAvatar: ${answer.avatar_url}`
    })
  }
})

client.on('error', (error) => {
  logger.error({
    path: error.name,
    message: error.message,
    stack: error.stack
  })
})

void client.login(TOKEN)
