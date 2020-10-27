import musicMetadata from 'types/musicMetadata';
import ytdl from 'ytdl-core';

export default async (song:string):Promise<musicMetadata | musicMetadata[]> => {
  const metaData:musicMetadata = {};

  if (ytdl.validateURL(song)) {
    if (song.includes('list')) {
      // todo implement list download
      return [];
    }

    const item = await ytdl.getBasicInfo(song);
    metaData.link = song;
    metaData.title = item.videoDetails.title;

    return metaData;
  }

  return [];
};
