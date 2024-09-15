import { CommandPriority, Settings, SystemEvent } from "../types.js";
import Console from "./console.js";

export interface Notifier {
  priority: CommandPriority;
  settings: Settings;
  enabled: boolean;
  name: string;
  notify(event: SystemEvent): void;
}

export interface NotifierDestination {
  type: NotifierType;
  name: string;
  priority?: CommandPriority;
  settings: Settings;
  enabled: boolean;
}

export enum NotifierType {
  Console = "console",
}

export function createNotifier(destination: NotifierDestination): Notifier {
  switch (destination.type) {
    case NotifierType.Console:
      return new Console(destination.name, destination.priority);
    default:
      throw new Error("Invalid notifier type");
  }
}
