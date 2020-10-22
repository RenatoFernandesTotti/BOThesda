import axios from 'axios';
import { Message } from 'discord.js';
import play from './play';
import queue from './queue';

export default {
  name: 'spotify',
  // eslint-disable-next-line max-len
  description: 'use the playlist ID to play it, the id can be foundif you open it in a browser and read the url',
  async execute(msg:Message, args:string[]) {
    try {
      const playlist = args.join(' ');
      const authKey = Buffer
        .from(`${process.env.CLIENT}:${process.env.CLIENTSECRET}`)
        .toString('base64');
      const token = (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${authKey}`,
          },
        })).data.access_token;

      const musics = (await axios.get(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data.items;

      const querys:Array<Array<string>> = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const element of musics) {
        const { track } = element;
        const query = [`${track.name}`, ' - ', `${track.artists[0].name}`];
        querys.push(query);
      }
      const rand = Math.floor(Math.random() * querys.length);

      const firstSong = querys.splice(rand, 1)[0];

      await play.execute(msg, firstSong, false);

      const queryPromises = querys.map(async (x) => play.execute(msg, x, false));

      await Promise.all(queryPromises);

      queue.execute(msg);
    } catch (error) {
      global.LOGGER.error(error);
    }
  },
};
