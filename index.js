const {token} = require('./config.json')

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js')
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers]});


client.once('ready', async () => {
  console.log('봇 준비 완료!')
  
  // try{
  //   await client.guilds.fetch()
  //   const guild = client.guilds.cache.get('1182541671142006795')
  //   if(guild){
  //     guild.members.fetch({ force: true })
  //     guild.members.cache.forEach(member => {
  //       console.log(member.user.username)
  //     })
  //   }else{
  //     console.log('해당 서버 없음')
  //   }
  // }catch(error){
  //   console.error('서버 정보 가져오는동안 오류 발생', error)
  // }
})

//새로운 멤버가 추가되면 캐시가 업데이트되게끔 코드 추가
client.on('guildMemberAdd', async member => {
  try{
    console.log(member.id, '업데이트')
    await member.guild.members.fetch(member.id)
  }catch(error){
    console.error('멤버 정보를 가져오는데 에러 발생', error)
  }
})

//서버에 메세지가 전송되었을때
client.on('messageCreate', async message => {
  await message.fetch()
  console.log('메세지 수신됨', message.content)

  //메세지가 봇의 메세지인지 명령어인지 확인
  // if(!message.content.startsWith('!스케쥴')) {return;}

  //명령어와 내용 분리하여 추출
  const args = message.content.slice('!'.length).trim().split(/ +/)
  const command = args[0]
  const content = args[1]

  // 멤버 목록 불러오기
  if(command === '스케쥴'){    
    try{
      const guild = message.guild
      // console.log('길드', guild)
      if(guild) {
        guild.members.cache.forEach(member => {
          //추후 여기서 아이디 배열 추가후 해당 배열 사용자만 mention하기
          // console.log('멤버', member)
          console.log('멤버유저', member.user)
          if(member.user.bot === false){ //봇 제외하고
            message.channel.send(`${member.user}`)
            
            //개인 dm 보내기
            // const user = member.user
            // try{
            //   user.send({
            //     content: `${command} 스케쥴 조정중입니다. 24시간 이내에 응답해주세요.`,
            //   })
            // }catch(error){
            //   console.error('개인 dm 오류', error)
            // }
          }
        })

        //스케쥴 알림
        message.channel.send(`${command} : ${content}`)

        //스케쥴 가능 불가능 버튼
        const yesButton = new ButtonBuilder()
          .setLabel('가능')
          .setCustomId('yes_button')
          .setStyle(ButtonStyle.Primary)
        const noButton = new ButtonBuilder()
          .setLabel('불가능')
          .setCustomId('no_button')
          .setStyle(ButtonStyle.Danger)
        const unableButton = new ButtonBuilder()
          .setLabel('불참')
          .setCustomId('unableButton')
          .setStyle(ButtonStyle.Danger)

        const buttons = new ActionRowBuilder()
          .addComponents(yesButton, noButton, unableButton)
        
        message.channel.send({content: '해당 날짜가 불가능하면 버튼을 눌러주세요', components: [buttons]})

        //버튼 클릭 대기 설정 //  i.customId === 'no_button' && 
        const filter = i => i.user.id === message.author.id
        const collector = message.channel.createMessageComponentCollector({filter, time: 24 * 60 * 60 * 1000})

        //interaction.user: 닉네임 태그, interaction.user.username: 디코친구찾을때 아이디, interaction.member.displayName: 해당 서버 설정 닉네임
        collector.on('collect', async interaction => {
          if(interaction.customId === 'yes_button'){
            await interaction.update({content: `${interaction.member.displayName} 가능`, components: []})
          }else if(interaction.customId === 'no_button'){
            await interaction.update({content: `${interaction.member.displayName} 불가능`, components: []})
          }else if(interaction.customId === 'unableButton'){
            await interaction.update({content: `${interaction.member.displayName} 이번주 참석 불가`, components: []})
          }
        })

        // collector.on('collect', async interaction => {
        //     // message.channel.send(`${interaction.user}님이 참가 할 수 없습니다.`)
        //     await interaction.update({ content: `${interaction.user}님이 참가 할 수 없습니다.`, components: []})
        // })


        collector.on('end',  async interaction => {
          await interaction.update({content: `${interaction.member.displayName} 응답없음`, components: []})
        })

        /*
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
              //버튼 클릭 대기
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
        */
      }
    }catch(error){
      console.error('멤버목록 불러오는 중 오류', error)
    }
  }

  /*
  //역할1을 가진 모든 유저 태그후 !스케쥴처럼 물어보기
  if(command === '역할1'){
    searchAllUserRoles('1182541671142006795', command)
      .then(users => {
        if(users.length > 0){
          users.forEach(user => {
            user.send(`${user}님, '${command}' (은)는 '${content}' 에 진행될 예정입니다.`).then(sentMessage => {
              //스케쥴 버튼
              const yesButton = new ButtonBuilder()
                .setLabel('가능')
                .setCustomId('yes_button')
                .setStyle(ButtonStyle.Primary)
              const noButton = new ButtonBuilder()
                .setLabel('불가능')
                .setCustomId('no_button')
                .setStyle(ButtonStyle.Secondary)
              const unableButton = new ButtonBuilder()
                .setLabel('불참')
                .setCustomId('unableButton')
                .setStyle(ButtonStyle.Danger)
      
              const buttons = new ActionRowBuilder()
                .addComponents(yesButton, noButton, unableButton)

                sentMessage.channel.send({components: [buttons]})
                
                const filter = i => i.user.id === message.author.id
                const collector = sentMessage.channel.createMessageComponentCollector({filter, time: 24 * 60 * 60 * 1000})
                
                collector.on('collect', async interaction => {
                  console.log(interaction)
                  if(interaction.customId === 'yes_button'){
                    await interaction.update({content: `${interaction.user.displayName} 가능`, components: [] })
                  }else if(interaction.customId === 'no_button'){
                    await interaction.update({content: `${interaction.user.displayName} 불가능`, components: [] })
                  }else if(interaction.customId === 'unableButton'){
                    await interaction.update({content: `${interaction.user.displayName} 이번주 참석 불가`, components: [] })
                  }
                })

                collector.on('end', async interaction => {
                  await interaction.update({content: `${interaction.member.displayName} 응답없음`, components: [] })
                })
            }).catch(error => console.error('버튼 전송 중 에러', error))
          })
        }else{
          console.log(`${command} 역할을 가진 사람은 없습니다.`)
        }
      })
      .catch(error => console.error('역할 검색 에러', error)) 
  }
  */

  //역할1을 가진 모든 유저 태그후 !스케쥴처럼 물어보기
  if(command === '역할2'){
    searchAllUserRoles('1182541671142006795', command)
      .then(users => {
        const roleId = searchRoleId('1182541671142006795', command)
        if(users.length > 0){
          users.forEach(user => {
            message.channel.send(`${user}`)
          })
          if(roleId){
            message.channel.send(`<@&${roleId}> - ${content}`)
            message.channel.send(`✅: 가능, ❌: 불가능, ⛔:불참`)
            message.channel.send(`해당되는 곳에 투표해주세요.`).then(async voteMessage => {
              await voteMessage.react('✅')
              await voteMessage.react('❌')
              await voteMessage.react('⛔')

              let voteCount = 0

              //리액션 컬렉터 설정
              const filter = (user) => !user.bot
              // const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot
              // const collector = voteMessage.createReactionCollector({filter, time: 30000})
              const collectedReactions = await waitForReactions(voteMessage, filter, {time: 10000})
              console.log('collectedReactions', collectedReactions)
              if(collectedReactions){
                const usersWhoVotedYes = collectedReactions.get('✅') ? collectedReactions.get('✅').users.cache.filter(user => !user.bot) : new Collection();
                const usersWhoVotedNo = collectedReactions.get('❌') ? collectedReactions.get('❌').users.cache.filter(user => !user.bot) : new Collection();
                const usersWhoVotedAbsent = collectedReactions.get('⛔') ? collectedReactions.get('⛔').users.cache.filter(user => !user.bot) : new Collection();
                
                message.channel.send(`투표 결과: \n✅: ${usersWhoVotedYes.size}명\n❌: ${usersWhoVotedNo.size}명\n⛔: ${usersWhoVotedAbsent.size}명`);
              }else{
                console.log('투표 종료. 아무도 투표 안함')
              }
              // // 리액션 이벤트 처리
              // collector.on('collect', (reaction, user) => {
              //   console.log('1')
              //   console.log(`${user.displayName}이 ${reaction.emoji.name}에 투표`);
              //   console.log('2')
              //   voteCount++
              //   console.log('3')
              // });

              // collector.on('end', (reaction, user) => {
              //     message.channel.send(`투표 종료. ${voteCount}명이 투표`);
              //     // if(reaction.emoji.name === '✅'){
              //     //   message.channel.send(`✅ : ${user.displayName}`)
              //     // }
              //     // if(reaction.emoji.name === '❌'){
              //     //   message.channel.send(`❌ : ${user.displayName}`)
              //     // }
              //     // if(reaction.emoji.name === '⛔'){
              //     //   message.channel.send(`⛔ : ${user.displayName}`)
              //     // }
                  
              // });
            })
          }else{
            console.log(`${command} 역할을 가진 사람은 없습니다.`)
          }


        }else{
          console.log(`${command} 역할을 가진 사람은 없습니다.`)
        }
      })
      .catch(error => console.error('역할 검색 에러', error)) 
  }
})

//해당 서버 모든 유저의 역할 가져온 후 특정 역할 반환
async function searchAllUserRoles(guildId, roleName){
  const guild = client.guilds.cache.get(guildId)
  if(!guild){
    console.log('해당 서버를 못찾음')
    return
  }

  try{
    await guild.members.fetch()
    const usersRole = []
    guild.members.cache.forEach(member => {
      // console.log('멤버', member)
      if(!member.user.bot){
        member.roles.cache.forEach(role => {
          if(role.name === roleName){
            usersRole.push(member)
          }
        })
      }
    })
    return usersRole
  }catch(error){
    console.error('역할에러', error)
    return
  }
}

//해당 역할ID 찾기
function searchRoleId(guildId, roleName){
  const guild = client.guilds.cache.get(guildId)
  const role = guild.roles.cache.find(role => role.name === roleName)

  if(role){
    return role.id
  }else{
    console.log('해당 역할을 찾을 수 없습니다.')
  }
}

//메세지 리액션 대기, 조건 만족하면 리액션 수집
async function waitForReactions(message, filter, options){
  try{
    const collected = await message.awaitReactions({filter, ...options})
    console.log('collected',collected)
    const collectedReactions = collected.reduce((acc, reaction) => {
      acc.set(reaction.emoji.name, reaction)
      return acc
    }, new Map())
    console.log('message.reactions.cache',message.reactions.cache)
    console.log('collectedReactions111',collectedReactions)
    return collectedReactions
  }catch(error){
    console.error('리액션 대기 중 오류'. error)
    return null
  }
}
client.login(token)