import convict from "convict";
import { COMMAND_NAMES } from "./commands";
import { EvlConfig, Schema } from "./schema";

const config = convict<EvlConfig>(Schema);

config.set("commands", COMMAND_NAMES);

config.loadFile("./evl-daemon.json");

config.validate();

export default config.getProperties();
