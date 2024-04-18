const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('핑')
      .setDescription('퐁으로 답하기'),
  use: '!핑',
  async execute(interaction){
    await interaction.reply('퐁!')
  }
}