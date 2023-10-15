import {
  calculateChecksum,
  getPayload,
  parseChecksum,
  parseCommand,
  parseData,
  parsePartition,
  parseZone,
  validate,
} from "../tpi";

test("parseCommand should return the parsed command", () => {
  const input = "500AB";
  const expected = "500";

  const actual = parseCommand(input);

  expect(actual).toEqual(expected);
});

test("parseCommand should return an empty command with invalid input", () => {
  const input = "50";
  const expected = "";

  const actual = parseCommand(input);

  expect(actual).toEqual(expected);
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
  const input = "5A";
  const expected = { value: "", zone: "", partition: 0 };

  const actual = parseData(input);

  expect(actual).toEqual(expected);
});

test("parsePartition should return the partition with valid input", () => {
  const value = "3889";
  const expected = 3;

  const actual = parsePartition(value);

  expect(actual).toEqual(expected);
});

test("parsePartition should return 0 with invalid input", () => {
  const actual = parsePartition("");

  expect(actual).toEqual(0);
});

test("parseZone should return the zone with valid input", () => {
  const value = "005";
  const expected = "005";

  const actual = parseZone(value);

  expect(actual).toEqual(expected);
});

test("parseZone should return an empty string with invalid input", () => {
  const value = "10";
  const actual = parseZone(value);
  expect(actual).toEqual("");
});

test("getPayload should return a payload from the given input", () => {
  const input = "500abc53";
  const expected = {
    command: "500",
    data: { value: "abc", partition: 0, zone: "" },
    checksum: "53",
  };

  const actual = getPayload(input);

  expect(actual).toEqual(expected);
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
