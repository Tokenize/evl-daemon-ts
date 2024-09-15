jest.mock("../../app/config/config.ts", () => ({}));

import { createNotifier, NotifierType } from "../../app/notifiers/notifier.js";
import Console from "../../app/notifiers/console.js";

describe("notifier", () => {
  it("should create a notifier", () => {
    const notifier = createNotifier({
      type: NotifierType.Console,
      name: "test",
      enabled: true,
      settings: {},
    });

    expect(notifier).toBeDefined();

    expect(notifier.name).toBe("test");

    expect(notifier instanceof Console).toBe(true);
  });

  it("should throw an error for an invalid notifier type", () => {
    expect(() =>
      createNotifier({
        type: "pigeon" as NotifierType,
        name: "test",
        enabled: true,
        settings: {},
      }),
    ).toThrow("Invalid notifier type");
  });
});
