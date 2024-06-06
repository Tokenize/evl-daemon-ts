import convict from "convict";
import { LogDestination, LogLevel } from "../logging/logger.js";
import { Command, CommandPriority } from "../types.js";

export interface EvlConfig {
  ip: string;
  port: number;
  password: string;
  zones: Record<string, string>;
  partitions: Record<number, string>;
  commands: Partial<Record<Command, string>>;
  priorities: Partial<Record<Command, CommandPriority>>;
  logging: LoggerConfiguration;
}

export type EvlConfigSchema = convict.Schema<EvlConfig>;

export interface LoggerConfiguration {
  level: LogLevel;
  format: string;
  destinations: LogDestination[];
}

export const Schema: EvlConfigSchema = {
  ip: {
    format: String,
    default: "127.0.0.1",
    arg: "ip",
  },
  port: {
    format: "port",
    default: 4025,
    arg: "port",
  },
  password: {
    format: String,
    default: "",
    arg: "password",
    sensitive: true,
  },
  zones: {
    format: Object,
    default: {},
    arg: "zones",
  },
  partitions: {
    format: Object,
    default: {},
    arg: "partitions",
  },
  commands: {
    format: Object,
    default: null,
    arg: "commands",
  },
  priorities: {
    format: Object,
    default: null,
    arg: "priorities",
  },
  logging: {
    format: Object,
    default: null,
    arg: "logging",
  },
};
