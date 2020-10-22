import {Message} from 'discord.js';
import pallete from 'lib/colorPallete';

module.exports = {
  name: 'help',
  description: 'Show this message',
  execute: async function(msg:Message) {
    let message='\`\`\`css\n';
    global.BOT.commands.forEach((command)=>{
      message+=` ${command.name} : ${command.description}\n`;
    });
    message+='\`\`\`';
    global.BOT.speak({
      title: 'Commands',
      message: message,
      color: pallete.info,
      channel: msg.channel,
    });
  },
};
