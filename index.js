const {token} = require('./config.json')

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js')
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages]});

client.once('ready', () => {
  console.log('봇 준비 완료!')
})


client.on('messageCreate', async message => {
  await message.fetch()
  console.log('메세지 수신됨', message.content)
  // 멤버 목록 불러오기
  if(message.content === '!멤버'){    
    try{
      const guild = message.guild
      // console.log('길드', guild)
      if(guild) {
        // console.log('길드멤버',guild.members)
        guild.members.cache.forEach(async member => {
          console.log('멤버이름들',member.user.username)
          if(member.user.username === '__moong'){
            message.channel.send({
              contents: member.user,
              //버튼
              components:[
                new ActionRowBuilder({
                  components: [
                      
                    new ButtonBuilder()
                      .setCustomId('yes')
                      .setLabel('가능')
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId('no')
                      .setLabel('불가능')
                      .setStyle(ButtonStyle.Danger)
                  ]
                })
              ]
            }).then(sentMessage => {
              //버튼 클릭 대기(24시간)
              const collector = sentMessage.createMessageComponentCollector({ filter: i => i.user.id === user.id, time: 24 * 60 * 60 * 1000})
  
              collector.on('collect', async interaction => {
                if(interaction.customId === 'yes'){
                  await interaction.update({content: `${member.user} 가능`,  components:[]})
                }else if(interaction.customId === 'no'){
                  await interaction.update({content: `${member.user} 불가능`,  components:[]})
                }
              })
              collector.on('end', () => {
                if(!user.deleted) user.send('응답시간 종료')
              })
            })


            const user = member.user
            //개인 dm 보내기
            try{
              await user.send({
                content: `멤버 스케쥴에 24시간 이내에 응답해주세요.`,
              })
            }catch(error){
              console.error('개인 dm 오류', error)
            }
          }

        })
      }
    }catch(error){
      console.error('멤버목록 불러오는 중 오류', error)
    }
  }
})



client.login(token)