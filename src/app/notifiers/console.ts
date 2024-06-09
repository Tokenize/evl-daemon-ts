import { Notifier } from "./broadcaster.js";
import { CommandPriority, SystemEvent } from "../types.js";
import { commandPriority, payloadToString } from "../util.js";

export class Console implements Notifier {
  private readonly _priority: CommandPriority;

  get priority(): CommandPriority {
    return this._priority;
  }

  constructor(priority?: CommandPriority) {
    this._priority = priority ?? CommandPriority.Low;
  }

  notify(event: SystemEvent): void {
    const priority = commandPriority(event.command);

    if (priority >= this.priority) {
      console.log(this.format(event));
    }
  }

  format(event: SystemEvent): string {
    return `Command: ${event.command}, ${payloadToString(event)}`;
  }
}
