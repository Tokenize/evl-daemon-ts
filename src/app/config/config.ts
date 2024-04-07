import convict from "convict";
import { CommandNames, CommandPriorities } from "./commands";
import { EvlConfig, Schema } from "./schema";
import { existsSync } from "fs";

const config = convict<EvlConfig>(Schema);

config.set("commands", CommandNames);
config.set("priorities", CommandPriorities);

if (existsSync("./evl-daemon.json")) {
  config.loadFile("./evl-daemon.json");
}

config.validate();

export default config.getProperties();
