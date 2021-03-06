import CommandModule from "../interfaces/commandModule";
import { Message } from "discord.js";

PLAYER.on("trackStart", (message, track) =>
  message.channel.send(`Now playing ${track.title}...`)
);

export default {
  play: {
    description: "wip",
    async execute(msg, args) {
      const musicQuery = args.join(" ");
      PLAYER.play(msg, musicQuery, true);
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
