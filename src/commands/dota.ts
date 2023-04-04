import { SlashCommandBuilder } from 'discord.js'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dota')
    .setDescription('Give dota 2 heroes suggestion!'),
  async execute(interaction) {
    await interaction.reply('Dota 2 heroes suggestion!')
  }
}
