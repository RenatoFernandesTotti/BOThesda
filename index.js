const Discord = require('discord.js');
const bot = new Discord.Client();
const commands = require('./commands')
let prefix = "&"
require('dotenv').config()

global.songQueue={
  songs:[],
  voiceChannel:null,
  voiceCon:null
}


bot.commands = new Discord.Collection();

console.log("Commands:");
Object.keys(commands).map(key => {
  console.log(key);
  bot.commands.set(commands[key].name, commands[key]);
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  //bot.commands.get(command).execute('play',args)
});

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let args = msg.content.replace(prefix,"").split(/ +/)
  let command = args.shift()

  console.log(args);
  bot.commands.get(command).execute(msg,args)
});

bot.login(process.env.AUTH_TOKEN);