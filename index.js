const Discord = require('discord.js');
const commands = require('./commands')
const sendMessage = require('./lib/sendMessage')

global.guilds=new Map()
global.bot = new Discord.Client();

require('dotenv').config()
let prefix = process.env.PREFIX




bot.commands = new Discord.Collection();

console.log("Commands:");
Object.keys(commands).map(key => {
  console.log(key);
  bot.commands.set(commands[key].name, commands[key]);
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ activity: { name: `${prefix}help`,type:"WATCHING" }, status: 'idle' })
  bot.guilds.cache.forEach(guild => {
    //console.log(guild.systemChannel.send('test'));

  })

});

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let args = msg.content.replace(prefix, "").split(/ +/)
  let command = args.shift().toLowerCase()

  try {
    bot.commands.get(command).execute(msg, args)
  } catch (error) {
    sendMessage({
      title: "Command not found",
      channel: msg.channel,
      color: 'info'
    })
  }
});



bot.login(process.env.AUTH_TOKEN);