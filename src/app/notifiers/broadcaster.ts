import { Command, CommandPriority, Payload, SystemEvent } from "../types.js";

export interface Notifier {
  priority: CommandPriority;
  notify(event: SystemEvent): void;
}

export class Broadcaster {
  private readonly _notifiers: Notifier[] = [];

  get count(): number {
    return this._notifiers.length;
  }

  addNotifier(notifier: Notifier): void {
    this._notifiers.push(notifier);
  }

  removeNotifier(notifier: Notifier): void {
    const index = this._notifiers.indexOf(notifier);
    if (index > -1) {
      this._notifiers.splice(index, 1);
    }
  }

  notify(payload: Payload): void {
    for (const notifier of this._notifiers) {
      notifier.notify(payload);
    }
  }

  disconnect(hadError: boolean): void {
    for (const notifier of this._notifiers) {
      notifier.notify({ command: Command.SOFTWARE_DISCONNECT, data: hadError });
    }
  }
}
