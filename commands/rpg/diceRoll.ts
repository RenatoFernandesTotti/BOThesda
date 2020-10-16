import { Message } from 'discord.js';
import rand from '../../lib/randomSeed';

interface finalMessage{
    [key:string]:{
        values:Array<number>,
        sum:number
    }
}

module.exports = {
  name: 'roll',
  description: 'Roll dice simple as that',
  async execute(msg:Message, args :string[]) {
    const finalmessage:finalMessage = {};
    let finalmessageString = '';
    let finalSum = 0;
    const sum = args.includes('+');
    const sendInDM = args.includes('p');
    const filteredArgs = args.filter((el) => el !== '+' && el !== 'p');
    filteredArgs.forEach((element) => {
      const data = element.split('d');
      if (data[0] === '') data[0] = '1';

      finalmessage[element] = { values: [], sum: 0 };

      for (let index = 0; index < Number.parseInt(data[0], 10); index += 1) {
        const randNmber = rand(1, Number.parseInt(data[1], 10) + 1);
        finalmessage[element].values.push(randNmber);
        if (sum) {
          finalmessage[element].sum += randNmber;
          finalSum += randNmber;
        }
      }
    });

    for (const key in finalmessage) {
      if (finalmessage.hasOwnProperty(key)) {
        const element = finalmessage[key];
        finalmessageString += `The ${key} rolled ${element.values} `;
        if (sum) {
          finalmessageString += `for a total of ${element.sum}`;
        }

        finalmessageString += '\n';
      }
    }
    if (sum && args.length !== 1) {
      finalmessageString += `\n\n All rolls add up to ${finalSum}`;
    }

    if (sendInDM) {
      global.BOT.speak({
        title: '🎲 rolling dices',
        channel: await msg.channel,
        message: 'Sending roll in sendInDM mode',
      });
      global.BOT.speak({
        title: '🎲 rolling dices',
        channel: await msg.author.createDM(),
        message: finalmessageString,
      });
      return;
    }
    global.BOT.speak({
      title: '🎲 rolling dices',
      channel: msg.channel,
      message: finalmessageString,
    });
  },
};
