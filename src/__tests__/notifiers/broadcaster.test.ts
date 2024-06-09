import { Broadcaster } from "../../app/notifiers/broadcaster.js";
import { Command } from "../../app/types.js";

describe("Broadcaster", () => {
  it("should add a notifier", () => {
    const notifier = { priority: 0, notify: jest.fn() };
    const broadcaster = new Broadcaster();

    broadcaster.addNotifier(notifier);
    expect(broadcaster.count).toBe(1);
  });

  it("should remove a notifier", () => {
    const notifier = { priority: 0, notify: jest.fn() };
    const broadcaster = new Broadcaster();

    broadcaster.addNotifier(notifier);
    broadcaster.removeNotifier(notifier);
    expect(broadcaster.count).toBe(0);
  });

  it("should notify all notifiers", () => {
    const notifier1 = { priority: 0, notify: jest.fn() };
    const notifier2 = { priority: 1, notify: jest.fn() };
    const broadcaster = new Broadcaster();
    broadcaster.addNotifier(notifier1);
    broadcaster.addNotifier(notifier2);

    broadcaster.notify({ command: Command.SOFTWARE_DISCONNECT, data: true, checksum: "0" });

    expect(notifier1.notify).toHaveBeenCalledTimes(1);
    expect(notifier2.notify).toHaveBeenCalledTimes(1);
  });

  it("should notify all notifiers of a disconnect", () => {
    const notifier1 = { priority: 0, notify: jest.fn() };
    const notifier2 = { priority: 1, notify: jest.fn() };
    const broadcaster = new Broadcaster();
    broadcaster.addNotifier(notifier1);
    broadcaster.addNotifier(notifier2);

    broadcaster.disconnect(true);

    expect(notifier1.notify).toHaveBeenCalledTimes(1);
    expect(notifier2.notify).toHaveBeenCalledTimes(1);
  });
});
