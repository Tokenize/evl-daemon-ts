import { parseCommand } from "../tpi";

test("parseCommand should return the parsed command", () => {
  const input = "500AB";
  const expected = { command: "500" };

  const actual = parseCommand(input);

  expect(actual).toEqual(expected);
});

test("parseCommand should return an empty command with invalid input", () => {
  const input = "50";
  const expected = { command: "" };

  const actual = parseCommand(input);

  expect(actual).toEqual(expected);
});
