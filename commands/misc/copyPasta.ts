import { Message } from 'discord.js';

const axios = require('axios');

export default {
  name: 'copypasta',
  description: 'Grab a top copypasta',
  async execute(msg:Message) {
    const info = (await axios.get('https://www.reddit.com/r/copypastabr/top/.json?t=week')).data.data.children;
    const index = Math.floor(Math.random() * info.length);
    const text = info[index].data.selftext;

    if (text.length <= 2048) {
      global.BOT.speak({
        channel: msg.channel,
        message: text,
      });
    } else {
      let i = 1;
      await global.BOT.speak({
        channel: msg.channel,
        message: 'Copy pasta too large, falling to safe mode',
      });

      while (text.length / i > 2048) {
        i += 1;
      }

      const pivot = Math.floor(text.length / i);
      let pointer = 0;
      for (let j = 0; j < i; j += 1) {
        // eslint-disable-next-line no-await-in-loop
        await global.BOT.speak({
          channel: msg.channel,
          message: text.substr(pointer, pivot),
        });
        pointer += pivot;
      }
    }
  },
};
