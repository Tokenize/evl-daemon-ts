import {
  calculateChecksum,
  getPayload,
  makeLoginPacket,
  PACKET_TERMINATOR,
  parseChecksum,
  parseCommand,
  parseData,
  parsePartition,
  parseZone,
  validate,
} from "../app/tpi";
import { Command } from "../app/types";

test("parseCommand should return the parsed command", () => {
  const input = "500AB";
  const expected = "500";

  const actual = parseCommand(input);

  expect(actual).toEqual(expected);
});

test("parseCommand should throw an error with invalid input", () => {
  const input = "50";

  expect(() => {
    parseCommand(input);
  }).toThrow();
});

test("parseChecksum should return the parsed checksum", () => {
  const input = "505AB";
  const expected = "AB";

  const actual = parseChecksum(input);

  expect(actual).toEqual(expected);
});

test("parseChecksum should return an empty checksum on invalid input", () => {
  const input = "5A";
  const expected = "";

  const actual = parseChecksum(input);

  expect(actual).toEqual(expected);
});

test("parseData should return empty data with invalid input", () => {
  const input = "500AB";
  const expected = { value: "", zone: "", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set the correct zone for a zone command", () => {
  const input = "605053AB";
  const expected = { value: "", zone: "053", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set an empty zone for a non-zone command", () => {
  const input = "6200000AB";
  const expected = { value: "0000", zone: "", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set the correct partition for a partition command", () => {
  const input = "6507AB";
  const expected = { value: "", zone: "", partition: 7 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set partition to 0 with non-partition command", () => {
  const input = "616ABCDEF12AB";
  const expected = { value: "ABCDEF12", zone: "", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set partition and zone for a partition and zone command", () => {
  const input = "6011064AB";
  const expected = { value: "", zone: "064", partition: 1 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parseData should set correct value for a non-zone or partition command", () => {
  const input = "500501AB";
  const expected = { value: "501", zone: "", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parsePartition should return the partition with valid input", () => {
  const value = "3889";
  const expected = 3;

  const actual = parsePartition(value);

  expect(actual).toEqual(expected);
});

test("parsePartition should return 0 with empty input", () => {
  const actual = parsePartition("");

  expect(actual).toEqual(0);
});

test("parsePartition should return 0 with invalid partition number", () => {
  const value = "ZB";
  const expected = 0;

  const actual = parsePartition(value);

  expect(actual).toEqual(expected);
});

test("parseZone should return the zone with valid input", () => {
  const value = "005";
  const expected = "005";

  const actual = parseZone(value);

  expect(actual).toEqual(expected);
});

test("parseZone should return an empty string with empty string as input", () => {
  const value = "";
  const actual = parseZone(value);
  expect(actual).toEqual("");
});

test("parseZone should return an empty string with an invalid length string", () => {
  const value = "5A";
  const actual = parseZone(value);
  expect(actual).toEqual("");
});

test("getPayload should return a payload from the given input", () => {
  const input = "005user54";
  const expected = {
    command: "005",
    data: { value: "user", partition: 0, zone: "" },
    checksum: "54",
  };

  const actual = getPayload(input);

  expect(actual).toEqual(expected);
});

test("getPayload should throw an error with invalid input", () => {
  const input = "123abc";

  expect(() => {
    getPayload(input);
  }).toThrow();
});

test("validate should return true with a valid checksum", () => {
  const actual = validate("005user54");

  expect(actual).toBeTruthy();
});

test("validate should return false with an invalid checksum", () => {
  const actual = validate("005userAB");

  expect(actual).toBeFalsy();
});

test("validate should return false with invalid input", () => {
  const actual = validate("AB");

  expect(actual).toBeFalsy();
});

test("calculateChecksum should return the correct checksum", () => {
  const value = "6543";
  const expected = "D2";

  const actual = calculateChecksum(value);

  expect(actual).toEqual(expected);
});

test("calculateChecksum should add a leading zero", () => {
  const value = "5108A";
  const expected = "0F";

  const actual = calculateChecksum(value);

  expect(actual).toEqual(expected);
});

test("calculateChecksum should truncate to 8 bits", () => {
  const value = "005123456";
  const expected = "CA";

  const actual = calculateChecksum(value);

  expect(actual).toEqual(expected);
});

test("makeLoginPacket should return a valid login packet", () => {
  const password = "uncr@ck@bl3!";

  const command = `${Command.NETWORK_LOGIN}${password}`;
  const checksum = calculateChecksum(command);
  const expected = `${command}${checksum}${PACKET_TERMINATOR}`;

  const actual = makeLoginPacket(password);

  expect(actual).toEqual(expected);
});
