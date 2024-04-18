const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('멤버')
      .setDescription('멤버 조회'),
  async execute(interaction){
    await interaction.reply(`멤버 조회 - ${interaction.members}`)
  }
}