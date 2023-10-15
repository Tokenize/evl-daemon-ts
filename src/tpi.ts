import { Checksum, Command, Data, Payload } from "./types";

export const COMMAND_LENGTH = 3;

export const CHECKSUM_LENGTH = 2;

export function validate(input: string): boolean {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return false;
  }

  const checksum = parseChecksum(input);

  const value = input.substring(0, input.length - CHECKSUM_LENGTH);
  const calculated = calculateChecksum(value);

  return checksum == calculated;
}

export function calculateChecksum(value: string): string {
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += value.charCodeAt(i);
  }

  sum &= 255;

  return sum.toString(16).padStart(2, "0").toUpperCase();
}

export function parseCommand(input: string): Command {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return "";
  }

  return input.substring(0, COMMAND_LENGTH);
}

export function parseData(input: string): Data {
  let value = "";
  let zone = "";
  let partition = 0;

  if (input.length <= COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return { value, zone, partition };
  }

  value = input.substring(COMMAND_LENGTH, input.length - CHECKSUM_LENGTH);

  return { value, zone, partition };
}

export function parseChecksum(input: string): Checksum {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return "";
  }

  return input.substring(input.length - 2);
}
