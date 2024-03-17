import config from "./config/config";
import { PARTITION_COMMANDS, PARTITION_ZONE_COMMANDS, ZONE_COMMANDS } from "./tpi";
import { Payload } from "./types";

export function friendly(payload: Payload): string {
  const command = config.commands[payload.command] ?? payload.command;
  let friendly: string;

  if (ZONE_COMMANDS.includes(payload.command)) {
    const zone = config.zones[payload.data.zone] ?? payload.data.zone;

    friendly = `${command}, Zone: ${zone}`;
  } else if (PARTITION_ZONE_COMMANDS.includes(payload.command)) {
    const zone = config.zones[payload.data.zone] ?? payload.data.zone;
    const partition = config.partitions[payload.data.partition] ?? payload.data.partition;

    friendly = `${command}, Partition: ${partition}, Zone: ${zone}`;
  } else if (PARTITION_COMMANDS.includes(payload.command)) {
    const partition = config.partitions[payload.data.partition] ?? payload.data.partition;

    friendly = `${command}, Partition: ${partition}`;
  } else {
    friendly = `${command}`;
  }

  return friendly;
}
