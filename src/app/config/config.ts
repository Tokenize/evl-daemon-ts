import convict from "convict";
import { EvlConfig, Schema } from "./schema";

export const config = convict<EvlConfig>(Schema);

config.loadFile("./evl-daemon.json");

config.validate();
