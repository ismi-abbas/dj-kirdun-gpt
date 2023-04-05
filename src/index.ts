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

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

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

client.on('interactionCreate', async (interaction) => {
  logger.info(`Interaction received: ${interaction}`)
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction

  if (commandName === 'clear') {
    try {
      await interaction.channel.bulkDelete(100)
      await interaction.reply('Cleared the channel!')
    } catch (error) {
      logger.error(error)
    }
  }

  if (commandName === 'ping') {
    await interaction.reply('pong!')
  }

  if (commandName === 'server') {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    )
    logger.info(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    )
  }

  if (commandName === 'test') {
    await interaction.reply('Testing the server!')
  }

  if (commandName === 'ask') {
    const prompt = interaction.options.getString('input')
    try {
      await interaction.reply('Fetching data from GPT-4...')
      const response = await makeRequest(prompt)

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

  if (commandName === 'select') {
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

  if (commandName === 'quote') {
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

    const answer = await makeRequest(prompt)
    embed.setDescription(quote)
    await interaction.reply({ embeds: [embed] })
  }

  if (commandName === 'github') {
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

void client.login(TOKEN)
