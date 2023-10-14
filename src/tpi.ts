import { Command } from "./types";

export const COMMAND_LENGTH = 3;

export const CHECKSUM_LENGTH = 2;

export function parseCommand(input: string): Command {
  let command = "";

  if (input.length >= COMMAND_LENGTH + CHECKSUM_LENGTH) {
    command = input.substring(0, COMMAND_LENGTH);
  }

  return { command: command };
}
