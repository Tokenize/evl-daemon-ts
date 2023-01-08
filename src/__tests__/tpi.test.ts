import tpi from "../tpi";

test("ParseCommand with valid input returns command", () => {
  const command = tpi.parseCommand("510AB");

  expect(command.command).toBe("510");
});

test("ParseCommand with invalid input returns empty command", () => {
  const command = tpi.parseCommand("510");

  expect(command.command).toBe("");
});

test("ParseChecksum with valid input returns checksum", () => {
  const checksum = tpi.parseChecksum("510AB");

  expect(checksum.value).toBe("AB");
});

test("ParseChecksum with invalid input returns empty checksum", () => {
  const checksum = tpi.parseChecksum("510");

  expect(checksum.value).toBe("");
});

test("ParseData with valid input returns data", () => {
  const data = tpi.parseData("005123456AB");

  expect(data.value).toBe("123456");
});

test("ParseData with no data returns empty data object", () => {
  const data = tpi.parseData("510AB");

  expect(data.value).toBe("");
});

test("ParseData with invalid input returns empty data object", () => {
  const data = tpi.parseData("510");

  expect(data.value).toBe("");
});
