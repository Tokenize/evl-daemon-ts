import convict = require("convict");
import { EvlConfig, Schema } from "./schema";

const config = convict<EvlConfig>(Schema);

config.loadFile("./evl-daemon.json");

config.validate();

export default config.getProperties();
