import { Command } from "./command";
export default interface CommandModule {
  [key: string]: Command;
}
