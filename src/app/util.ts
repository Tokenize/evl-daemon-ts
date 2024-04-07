import config from "./config/config";
import { PARTITION_COMMANDS, PARTITION_ZONE_COMMANDS, ZONE_COMMANDS } from "./tpi";
import { Command, CommandPriority, Payload } from "./types";

export function payloadToString(payload: Payload): string {
  const command = commandName(payload.command);
  let friendly: string;

  if (ZONE_COMMANDS.includes(payload.command)) {
    const zone = zoneName(payload.data.zone);

    friendly = `${command}, Zone: ${zone}`;
  } else if (PARTITION_ZONE_COMMANDS.includes(payload.command)) {
    const zone = zoneName(payload.data.zone);
    const partition = partitionName(payload.data.partition);

    friendly = `${command}, Partition: ${partition}, Zone: ${zone}`;
  } else if (PARTITION_COMMANDS.includes(payload.command)) {
    const partition = partitionName(payload.data.partition);

    friendly = `${command}, Partition: ${partition}`;
  } else {
    friendly = `${command}`;
  }

  return friendly;
}

export function commandName(command: Command): string {
  return config.commands[command] ?? command;
}

export function commandPriority(command: Command): CommandPriority {
  return config.priorities[command] ?? CommandPriority.Low;
}

export function zoneName(zone: string): string {
  return config.zones[zone] ?? zone;
}

export function partitionName(partition: number): string {
  return config.partitions[partition] ?? partition.toString(10);
}
