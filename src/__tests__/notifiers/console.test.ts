jest.mock("../../app/config/config.ts", () => ({
  partitions: {},
  zones: {},
  commands: CommandNames,
  priorities: CommandPriorities,
}));

import { CommandNames, CommandPriorities } from "../../app/config/commands.js";

import { Broadcaster } from "../../app/notifiers/broadcaster.js";
import Console from "../../app/notifiers/console.js";
import { Command, CommandPriority, Payload } from "../../app/types.js";

const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => void 0);

describe("console notifier", () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  it("write a message to the console", () => {
    const notifier = new Console("test");
    const broadcaster = new Broadcaster();
    broadcaster.addNotifier(notifier);

    const message: Payload = { command: Command.SOFTWARE_DISCONNECT, data: true, checksum: "0" };
    const expected = notifier.format(message);

    broadcaster.notify(message);

    expect(consoleSpy).toHaveBeenCalledWith(expected);
  });

  it("should use the default priority if none is provided", () => {
    const notifier = new Console("test");

    expect(notifier.priority).toBe(CommandPriority.Low);
  });

  it("should use the provided priority", () => {
    const priority = CommandPriority.High;
    const notifier = new Console("test", priority);

    expect(notifier.priority).toBe(priority);
  });

  it("should not notify when the priority isn't met", () => {
    const notifier = new Console("test", CommandPriority.High);
    const broadcaster = new Broadcaster();
    broadcaster.addNotifier(notifier);

    const message: Payload = {
      command: Command.LOGIN,
      data: { value: "", zone: "", partition: 1 },
      checksum: "0",
    };
    broadcaster.notify(message);

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should notify when the priority is met", () => {
    const notifier = new Console("test", CommandPriority.Low);
    const broadcaster = new Broadcaster();
    broadcaster.addNotifier(notifier);

    const message: Payload = {
      command: Command.LOGIN,
      data: { value: "", zone: "", partition: 1 },
      checksum: "0",
    };
    broadcaster.notify(message);

    expect(consoleSpy).toHaveBeenCalled();
  });
});
