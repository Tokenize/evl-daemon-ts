import convict from "convict";
import { CommandNames, CommandPriorities } from "./commands.js";
import { EvlConfig, Schema } from "./schema.js";
import { existsSync } from "fs";

const config = convict<EvlConfig>(Schema);

config.set("commands", CommandNames);
config.set("priorities", CommandPriorities);

if (existsSync("./evl-daemon.json")) {
  config.loadFile("./evl-daemon.json");
} else {
  throw new Error("Configuration file not found.");
}

config.validate();

export default config.getProperties();
