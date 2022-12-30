import tpi from "../tpi";

test("ParseCommand with valid input returns command", () => {
  const command = tpi.ParseCommand("510AB");

  expect(command.command).toBe("510");
});

test("ParseCommand with invalid input returns empty command", () => {
  const command = tpi.ParseCommand("510");

  expect(command.command).toBe("");
});

test("ParseChecksum with valid input returns checksum", () => {
  const checksum = tpi.ParseChecksum("510AB");

  expect(checksum.value).toBe("AB");
});

test("ParseChecksum with invalid input returns empty checksum", () => {
  const checksum = tpi.ParseChecksum("510");

  expect(checksum.value).toBe("");
});
