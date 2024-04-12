import { COMMAND_NAMES } from "../app/config/commands";
import config from "../app/config/config";
import { Command, Data, Payload } from "../app/types";
import { commandName, partitionName, payloadToString, zoneName } from "../app/util";

describe("commandName", () => {
  test("should return command value if name not found", () => {
    const command = "999";
    const expected = command;

    const actual = commandName(command as Command);

    expect(actual).toEqual(expected);
  });

  test("should return the command name string", () => {
    const command = Command.COMMAND_ACKNOWLEDGE;
    const expected = COMMAND_NAMES[command];

    const actual = commandName(command);

    expect(actual).toEqual(expected);
  });
});

describe("partitionName", () => {
  test("should return partition value if name not found", () => {
    const partition = 999;
    const expected = partition.toString(10);

    const actual = partitionName(partition);

    expect(actual).toEqual(expected);
  });

  test("should return partition name string", () => {
    const partition = 1;
    const expected = "Partition 1";

    config.partitions[partition] = expected;

    const actual = partitionName(partition);

    expect(actual).toEqual(expected);
  });
});

describe("zoneName", () => {
  test("should return zone value if name not found", () => {
    const zone = "999";
    const expected = zone;

    const actual = zoneName(zone);

    expect(actual).toEqual(expected);
  });

  test("should return zone name string", () => {
    const zone = "001";
    const expected = "Bedroom Window";

    config.zones[zone] = expected;

    const actual = zoneName(zone);

    expect(actual).toEqual(expected);
  });
});

describe("payloadToString", () => {
  test("should only return command name for commands without zone or partition", () => {
    const command = Command.COMMAND_ACKNOWLEDGE;
    const payload = { command } as Payload;
    const expected = COMMAND_NAMES[command];

    const actual = payloadToString(payload);

    expect(actual).toEqual(expected);
  });

  test("should include zone name for zone commands", () => {
    const command = Command.ZONE_FAULT;
    const zone = "001";
    const data = { zone } as Data;
    const payload = { command, data } as Payload;

    config.zones[zone] = "Bedroom Window";

    const expected = `${commandName(command)}, Zone: ${zoneName(zone)}`;

    const actual = payloadToString(payload);

    expect(actual).toEqual(expected);
  });

  test("should include partition name for partition commands", () => {
    const command = Command.PARTITION_READY;
    const partition = 1;
    const data = { partition } as Data;
    const payload = { command, data } as Payload;

    const expected = `${commandName(command)}, Partition: ${partitionName(partition)}`;

    const actual = payloadToString(payload);

    expect(actual).toEqual(expected);
  });

  test("should include partition for partition and zone commands", () => {
    const command = Command.ZONE_ALARM;
    const zone = "001";
    const partition = 1;
    const data = { zone, partition } as Data;
    const payload = { command, data } as Payload;

    const expected = `${commandName(command)}, Partition: ${partitionName(partition)}, Zone: ${zoneName(zone)}`;

    const actual = payloadToString(payload);

    expect(actual).toEqual(expected);
  });
});
