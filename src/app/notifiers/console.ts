import { CommandPriority, Settings, SystemEvent } from "../types.js";
import { commandPriority, payloadToString } from "../util.js";
import { Notifier } from "./notifier.js";

export default class Console implements Notifier {
  private _priority: CommandPriority;
  private _settings: Settings = {};
  private _enabled = true;
  private _name;

  get priority(): CommandPriority {
    return this._priority;
  }

  get settings(): Settings {
    return this._settings;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get name(): string {
    return this._name;
  }

  constructor(name: string, priority?: CommandPriority) {
    this._name = name;
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
