import { MessageEmbed } from "discord.js";
import CommandModule from "../interfaces/commandModule";
import { createEmbedQueue } from "../lib/createEmbedMessage";
import {
  createEmbedPlayMusic,
  createEmbedAddMusic,
} from "../lib/createEmbedMessage";

PLAYER.on("trackStart", (message, track) => {
  message.channel.send(createEmbedPlayMusic(message, track));
});

PLAYER.on("trackAdd", (message, queue, track) => {
  message.channel.send(createEmbedAddMusic(message, track));
  if (queue.tracks.length > 0) {
    message.channel.send(createEmbedQueue(message, queue, track));
  }
});

export default {
  play: {
    description: "wip",
    async execute(msg, args) {
      const musicQuery = args.join(" ");
      PLAYER.play(msg, musicQuery, true).catch((err) => {});
    },
  },
  pause: {
    description: "wip",
    execute(msg) {
      PLAYER.pause(msg);
    },
  },
  stop: {
    description: "wip",
    execute(msg) {
      PLAYER.stop(msg);
    },
  },
  skip: {
    description: "wip",
    execute(msg) {
      PLAYER.skip(msg);
    },
  },
} as CommandModule;
