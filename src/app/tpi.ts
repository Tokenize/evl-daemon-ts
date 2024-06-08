import { Command, Data, Payload } from "./types.js";

export const COMMAND_LENGTH = 3;

export const CHECKSUM_LENGTH = 2;

export const PARTITION_COMMANDS: Command[] = [
  Command.PARTITION_READY,
  Command.PARTITION_NOT_READY,
  Command.PARTITION_ARMED,
  Command.PARTITION_READY_FORCE_ARMING_ENABLED,
  Command.PARTITION_IN_ALARM,
  Command.PARTITION_DISARMED,
  Command.EXIT_DELAY_IN_PROGRESS,
  Command.ENTRY_DELAY_IN_PROGRESS,
  Command.KEYPAD_LOCK_OUT,
  Command.PARTITION_FAILED_TO_ARM,
  Command.PGM_OUTPUT_IN_PROGRESS,
  Command.CHIME_ENABLED,
  Command.CHIME_DISABLED,
  Command.INVALID_ACCESS_CODE,
  Command.FUNCTION_NOT_AVAILABLE,
  Command.FAILURE_TO_ARM,
  Command.PARTITION_IS_BUSY,
  Command.SYSTEM_ARMING_IN_PROGRESS,
  Command.USER_CLOSING,
  Command.SPECIAL_CLOSING,
  Command.PARTIAL_CLOSING,
  Command.USER_OPENING,
  Command.SPECIAL_OPENING,
  Command.TROUBLE_LED_ON,
  Command.TROUBLE_LED_OFF,
  Command.COMMAND_OUTPUT_PRESSED,
];

export const ZONE_COMMANDS: Command[] = [
  Command.ZONE_FAULT,
  Command.ZONE_FAULT_RESTORE,
  Command.ZONE_OPEN,
  Command.ZONE_RESTORED,
];

export const PARTITION_ZONE_COMMANDS: Command[] = [
  Command.ZONE_ALARM,
  Command.ZONE_ALARM_RESTORE,
  Command.ZONE_TAMPER,
  Command.ZONE_TAMPER_RESTORE,
];

export const LOGIN_REQUEST_PASSWORD = "3";

export const LOGIN_REQUEST_TIMEOUT = "2";

export const LOGIN_REQUEST_SUCCESS = "1";

export const LOGIN_REQUEST_FAIL = "0";

export const PACKET_TERMINATOR = "\r\n";

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
  const value = `${Command.NETWORK_LOGIN}${password}`;

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

  return { command, data, checksum } as Payload;
}

export function parseCommand(input: string): Command {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    throw Error("Unable to parse command - invalid input length");
  }

  return input.substring(0, COMMAND_LENGTH) as Command;
}

export function parseData(input: string): Data {
  let value = "";
  let zone = "";
  let partition = 0;

  if (input.length <= COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return { value, zone, partition };
  }

  const command = parseCommand(input);

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

export function parseChecksum(input: string): string {
  if (input.length < COMMAND_LENGTH + CHECKSUM_LENGTH) {
    return "";
  }

  return input.substring(input.length - 2);
}
