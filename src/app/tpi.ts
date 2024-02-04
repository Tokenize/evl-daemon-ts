import { Checksum, Command, Data, Payload } from "./types";

export const COMMAND_LENGTH = 3;

export const CHECKSUM_LENGTH = 2;

export const PARTITION_COMMANDS: Command[] = [
  "650",
  "651",
  "652",
  "653",
  "654",
  "655",
  "656",
  "657",
  "658",
  "659",
  "660",
  "663",
  "664",
  "670",
  "671",
  "672",
  "673",
  "674",
  "700",
  "701",
  "702",
  "750",
  "751",
  "840",
  "841",
  "912",
];

export const ZONE_COMMANDS: Command[] = ["605", "606", "609", "610"];

export const PARTITION_ZONE_COMMANDS: Command[] = ["601", "602", "603", "604"];

export const LOGIN_REQUEST_COMMAND: Command = "505";

export const LOGIN_RESPONSE_COMMAND: Command = "005";

export const LOGIN_REQUEST_PASSWORD: string = "3";

export const LOGIN_REQUEST_TIMEOUT: string = "2";

export const LOGIN_REQUEST_SUCCESS: string = "1";

export const LOGIN_REQUEST_FAIL: string = "0";

export const PACKET_TERMINATOR: string = "\r\n";

export function validate(input: string): boolean {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return false;
  }

  const checksum = parseChecksum(input);

  const value = input.substring(0, input.length - CHECKSUM_LENGTH);
  const calculated = calculateChecksum(value);

  return checksum == calculated;
}

export function makeLoginPacket(password: string): string {
  const value = `${LOGIN_RESPONSE_COMMAND}${password}`;

  const checksum = calculateChecksum(value);

  return `${value}${checksum}${PACKET_TERMINATOR}`;
}

export function calculateChecksum(value: string): string {
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += value.charCodeAt(i);
  }

  sum &= 255;

  return sum.toString(16).padStart(2, "0").toUpperCase();
}

export function getPayload(input: string): Payload {
  if (!validate(input)) {
    throw Error("Incoming data is not valid and can't be parsed");
  }

  const command = parseCommand(input);
  const checksum = parseChecksum(input);
  const data = parseData(input);

  return { command, data, checksum };
}

export function parseCommand(input: string): Command {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return "";
  }

  return input.substring(0, COMMAND_LENGTH);
}

export function parseData(input: string): Data {
  let command = "";
  let value = "";
  let zone = "";
  let partition = 0;

  if (input.length <= COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return { value, zone, partition };
  }

  command = parseCommand(input);

  value = input.substring(COMMAND_LENGTH, input.length - CHECKSUM_LENGTH);

  if (PARTITION_COMMANDS.includes(command)) {
    partition = parsePartition(value);
    value = value.substring(1);
  } else if (ZONE_COMMANDS.includes(command)) {
    zone = parseZone(value);
    value = value.substring(3);
  } else if (PARTITION_ZONE_COMMANDS.includes(command)) {
    partition = parsePartition(value);
    zone = parseZone(value.substring(1, 4));
    value = value.substring(4);
  }

  return { value, zone, partition };
}

export function parsePartition(value: string): number {
  if (value.length <= 0) {
    return 0;
  }

  const parsed = parseInt(value.charAt(0));

  return isNaN(parsed) ? 0 : parsed;
}

export function parseZone(value: string): string {
  if (value.length < 3) {
    return "";
  }
  return value.substring(0, 3);
}

export function parseChecksum(input: string): Checksum {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return "";
  }

  return input.substring(input.length - 2);
}
