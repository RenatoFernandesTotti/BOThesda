import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import { Message } from 'discord.js';
import ytsr, { YoutubeVideo } from './ytsr';

import musicMetadata from '../types/musicMetadata';
import sendEmbedMessage from './sendEmbedMessage';
import BotPallete from './pallete';

async function getPlaylist(link:string, msg:Message) {
  const playlist = await ytpl(link);
  const musicFromPlaylist:musicMetadata[] = [];

  // eslint-disable-next-line no-unused-expressions
  playlist.items = playlist.items.filter((item) => (item.title !== '[Deleted video]' && item.title !== '[Private video]'));
  await sendEmbedMessage({
    color: BotPallete.info, channel: msg.channel, title: 'Playing playlist 🎶', message: `${playlist.title}`,
  });

  playlist.items.forEach((it) => {
    musicFromPlaylist.push({
      title: it.title,
      link: it.url,
    });
  });

  return musicFromPlaylist;
}

export default async (song:string, msg:Message):Promise<musicMetadata[]> => {
  const metaData:musicMetadata = {};

  if (ytdl.validateURL(song)) {
    if (song.includes('list')) {
      return getPlaylist(song, msg);
    }

    const item = await ytdl.getBasicInfo(song);
    metaData.link = song;
    metaData.title = item.videoDetails.title;

    return [metaData];
  }
  let i = 0;
  let songInfoArray:YoutubeVideo[];
  do {
    // eslint-disable-next-line no-await-in-loop
    songInfoArray = await ytsr(song);
    i += 1;
  } while (songInfoArray.length === 0 && i < 4);
  if (songInfoArray.length === 0) {
    return [];
  }

  const songInfo = songInfoArray[0];
  metaData.link = `https://www.youtube.com/watch?v=${songInfo.id}`;
  metaData.title = songInfo.title;
  return [metaData];
};
