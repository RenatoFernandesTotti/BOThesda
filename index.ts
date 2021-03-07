import { Client, Message } from "discord.js";
import { createLogger, format, Logger, transports } from "winston";
import { config } from "dotenv";
import { Player } from "discord-player";
declare global {
  var BOT: Client;
  var LOGGER: Logger;
  var PLAYER: Player;
}

globalThis.BOT = new Client();
globalThis.LOGGER = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(format.simple(), format.prettyPrint()),
    }),
  ],
});

globalThis.PLAYER = new Player(BOT, {
  ytdlRequestOptions: {
    filter: "audioonly",
    quality: "highestaudio",
  },
});

import * as commands from "./commands";

config();

BOT.on("ready", () => {
  LOGGER.info(`Logged in as ${BOT.user.tag}!`);
});

BOT.on("message", async (msg: Message) => {
  try {
    LOGGER.info({
      origin: msg.guild.name,
      requester: msg.author.username,
      request: msg.content,
    });
    if (!process.env.BOT_PREFIX) {
      LOGGER.warn("Please set the BOT_PREFIX in .env");
      return;
    }
    if (msg.author === BOT.user) return;
    if (!msg.content.startsWith(process.env.BOT_PREFIX)) return;

    // remove prefix and put command to lowercase
    const args = msg.content.replace(process.env.BOT_PREFIX, "").split(/ +/);
    const commandString = args.shift()?.toLowerCase();

    commands.default[commandString]?.execute(msg, args);
  } catch (error) {
    LOGGER.error(error);
  }
});

BOT.login(process.env.BOT_TOKEN);
