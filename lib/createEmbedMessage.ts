import { Queue, Track } from "discord-player";
import { MessageEmbed, Message } from "discord.js";
export function createEmbed() {}

export function createEmbedPlayMusic(message: Message, track: Track) {
  const embedMessage = new MessageEmbed();
  embedMessage.setTitle("Tocando música 🎶");
  embedMessage.setColor("#A3FF8B");
  embedMessage.setDescription(
    `Música pedida: ${track.title}\n
         Por: ${track.author}\n
         Pedida por: ${track.requestedBy}`
  );

  return embedMessage;
}
export function createEmbedAddMusic(message: Message, track: Track) {
  const embedMessage = new MessageEmbed();
  embedMessage.setTitle("Adicioando música a fila 📻");
  embedMessage.setColor("#A3FF8B");
  embedMessage.setDescription(
    `Música pedida: ${track.title}\n
       Por: ${track.author}\n
       Pedida por: ${message.author.username}`
  );

  return embedMessage;
}
export function createEmbedQueue(message: Message, queue: Queue, track: Track) {
  const queueEmbed = new MessageEmbed();
  let queueDesc = "";
  let index = 1;
  queueEmbed.setTitle("Fila");
  queueEmbed.setColor("#A3FF8B");
  //queue.tracks.shift();
  queue.tracks.forEach((track) => {
    if (index === 1) {
      index++;
      return;
    }
    queueDesc += `${index++}:${track.title}\n`;
  });
  queueEmbed.setDescription(queueDesc);
  return queueEmbed;
}
