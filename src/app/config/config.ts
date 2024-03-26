import convict from "convict";
import { COMMAND_NAMES } from "./commands";
import { EvlConfig, Schema } from "./schema";
import { existsSync } from "fs";

const config = convict<EvlConfig>(Schema);

config.set("commands", COMMAND_NAMES);

if (existsSync("./evl-daemon.json")) {
  config.loadFile("./evl-daemon.json");
}

config.validate();

export default config.getProperties();
