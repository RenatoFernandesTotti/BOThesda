const Discord = require('discord.js');
global.bot = new Discord.Client();
const commands = require('./commands')
const say = require('./lib/sendMessage')

let prefix = "#"
require('dotenv').config()




bot.commands = new Discord.Collection();

console.log("Commands:");
Object.keys(commands).map(key => {
  console.log(key);
  bot.commands.set(commands[key].name, commands[key]);
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let args = msg.content.replace(prefix,"").split(/ +/)
  let command = args.shift().toLowerCase()

  try {
    bot.commands.get(command).execute(msg,args)
  } catch (error) {
    say({
      title:"Command not found",
      channel:msg.channel,
      color:'info'
    })
  }
});



bot.login(process.env.AUTH_TOKEN);