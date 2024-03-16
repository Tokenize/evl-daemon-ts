import convict from "convict";
export interface EvlConfig {
  ip: string;
  port: number;
  password: string;
  zones: { [zone: string]: string };
  partitions: { [partition: string]: string };
}

type EvlConfigSchema = convict.Schema<EvlConfig>;

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
};
