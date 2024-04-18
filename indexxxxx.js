const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')

const client = new Client({ intents:[GatewayIntentBits.Guilds]});
client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders){
  const commandsPaht = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPaht).filter(file => file.endsWith('.js'))
  for(const file of commandFiles){
    const filePath = path.join(commandsPaht, file)
    const command = require(filePath)

    // if('data' in command && 'execute' in command){
    //   client.command.set(command.data.name, command)
    // }else{
    //   console.log(`[Warning] The command at ${filePath} is missing a required 'data' or 'execute' property.`)
    // }
  }
}

const prefix = "!"
require('dotenv').config()

//ready 이벤트
client.on("ready", () => {
  console.log('ready!', client.user.tag)
})

//message 이벤트
client.on('interactionCreate', async msg => {
  // if(!interaction.isChatInputCommand()) return;

  // if(interaction.commandName === 'ping'){
  //   await interaction.reply('Pong!')
  // }
  console.log(msg)
 
})

client.login(process.env.Bot_Token)

/*
 // if(!msg.guild) return //guild 이외에서 작동하지 않게 설정
  // if(msg.author.bot) return //메세지 사용자가 봇일경우 작동 X
  // if(msg.content.indexOf(prefix) !== 0) return //prefix로 시작되지 않는 경우 작동 X

  const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  // // prefix잘라주고 공백 제거해주고 띄어쓰기를 기준으로 남아서 배열에 담아주기 첫번째 요소가 명령어 ex) (!kick Anne) => ['kick', 'Anne']

  const command = args.shift().toLowerCase()

  if(command === 'ping'){
    msg.reply(`${client.ws.ping}ms`) // 웹소켓 지연시간 알려주기
    console.log(msg.content)
  }
 */