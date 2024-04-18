const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provieds information about the server.'),
    async execute(interaction){
      // console.log('인터렉션',interaction)
      console.log('길드멤버', interaction.guild.members)
    
      await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members. ${interaction.guild.members}`)
    }
}