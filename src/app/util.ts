import config from "./config/config.js";
import { PARTITION_COMMANDS, PARTITION_ZONE_COMMANDS, ZONE_COMMANDS } from "./tpi.js";
import { Command, CommandPriority, Payload, SystemEvent } from "./types.js";

export function payloadToString(payload: Payload | SystemEvent): string {
  const command = commandName(payload.command);
  let friendly: string;

  if (typeof payload.data === "boolean") {
    return `${command}, Value: ${payload.data ? "true" : "false"}`;
  }

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
    friendly = command;
  }

  return friendly;
}

export function commandName(command: Command): string {
  return config.commands[command] ?? command.toString();
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
