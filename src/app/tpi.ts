import config from "./config/config";
import { Checksum, Command, Data, Payload } from "./types";

export const COMMAND_LENGTH = 3;

export const CHECKSUM_LENGTH = 2;

export enum COMMANDS {
  POLL = "000",
  STATUS_REPORT = "001",
  NETWORK_LOGIN = "005",
  COMMAND_ACKNOWLEDGE = "500",
  COMMAND_ERROR = "501",
  SYSTEM_ERROR = "502",
  LOGIN = "505",
  KEYPAD_LED_STATE = "510",
  KEYPAD_LED_FLASH_STATE = "511",
  ZONE_ALARM = "601",
  ZONE_ALARM_RESTORE = "602",
  ZONE_TAMPER = "603",
  ZONE_TAMPER_RESTORE = "604",
  ZONE_FAULT = "605",
  ZONE_FAULT_RESTORE = "606",
  ZONE_OPEN = "609",
  ZONE_RESTORED = "610",
  ENVISALINK_ZONE_TIMER_DUMP = "615",
  BYPASSED_ZONES_BITFIELD_DUMP = "616",
  DURESS_ALARM = "620",
  F_KEY_ALARM = "621",
  F_KEY_RESTORE = "622",
  A_KEY_ALARM = "623",
  A_KEY_RESTORE = "624",
  P_KEY_ALARM = "625",
  P_KEY_RESTORE = "626",
  SMOKE_AUX_ALARM = "631",
  SMOKE_AUX_RESTORE = "632",
  PARTITION_READY = "650",
  PARTITION_NOT_READY = "651",
  PARTITION_ARMED = "652",
  PARTITION_READY_FORCE_ARMING_ENABLED = "653",
  PARTITION_IN_ALARM = "654",
  PARTITION_DISARMED = "655",
  EXIT_DELAY_IN_PROGRESS = "656",
  ENTRY_DELAY_IN_PROGRESS = "657",
  KEYPAD_LOCK_OUT = "658",
  PARTITION_FAILED_TO_ARM = "659",
  PGM_OUTPUT_IN_PROGRESS = "660",
  CHIME_ENABLED = "663",
  CHIME_DISABLED = "664",
  INVALID_ACCESS_CODE = "670",
  FUNCTION_NOT_AVAILABLE = "671",
  FAILURE_TO_ARM = "672",
  PARTITION_IS_BUSY = "673",
  SYSTEM_ARMING_IN_PROGRESS = "674",
  SYSTEM_IN_INSTALLERS_MODE = "680",
  USER_CLOSING = "700",
  SPECIAL_CLOSING = "701",
  PARTIAL_CLOSING = "702",
  USER_OPENING = "750",
  SPECIAL_OPENING = "751",
  PANEL_BATTERY_TROUBLE = "800",
  PANEL_BATTERY_TROUBLE_RESTORE = "801",
  PANEL_AC_TROUBLE = "802",
  PANEL_AC_RESTORE = "803",
  SYSTEM_BELL_TROUBLE = "806",
  SYSTEM_BELL_TROUBLE_RESTORE = "807",
  FTC_TROUBLE = "814",
  FTC_TROUBLE_RESTORE = "815",
  BUFFER_NEAR_FULL = "816",
  GENERAL_SYSTEM_TAMPER = "829",
  GENERAL_SYSTEM_TAMPER_RESTORE = "830",
  TROUBLE_LED_ON = "840",
  TROUBLE_LED_OFF = "841",
  FIRE_TROUBLE_ALARM = "842",
  FIRE_TROUBLE_ALARM_RESTORE = "843",
  VERBOSE_TROUBLE_STATUS = "849",
  CODE_REQUIRED = "900",
  COMMAND_OUTPUT_PRESSED = "912",
  MASTER_CODE_REQUIRED = "921",
  INSTALLERS_CODE_REQUIRED = "922",
  SOFTWARE_ZONE_ALARM = "S01",
}

export const PARTITION_COMMANDS: Command[] = [
  COMMANDS.PARTITION_READY,
  COMMANDS.PARTITION_NOT_READY,
  COMMANDS.PARTITION_ARMED,
  COMMANDS.PARTITION_READY_FORCE_ARMING_ENABLED,
  COMMANDS.PARTITION_IN_ALARM,
  COMMANDS.PARTITION_DISARMED,
  COMMANDS.EXIT_DELAY_IN_PROGRESS,
  COMMANDS.ENTRY_DELAY_IN_PROGRESS,
  COMMANDS.KEYPAD_LOCK_OUT,
  COMMANDS.PARTITION_FAILED_TO_ARM,
  COMMANDS.PGM_OUTPUT_IN_PROGRESS,
  COMMANDS.CHIME_ENABLED,
  COMMANDS.CHIME_DISABLED,
  COMMANDS.INVALID_ACCESS_CODE,
  COMMANDS.FUNCTION_NOT_AVAILABLE,
  COMMANDS.FAILURE_TO_ARM,
  COMMANDS.PARTITION_IS_BUSY,
  COMMANDS.SYSTEM_ARMING_IN_PROGRESS,
  COMMANDS.USER_CLOSING,
  COMMANDS.SPECIAL_CLOSING,
  COMMANDS.PARTIAL_CLOSING,
  COMMANDS.USER_OPENING,
  COMMANDS.SPECIAL_OPENING,
  COMMANDS.TROUBLE_LED_ON,
  COMMANDS.TROUBLE_LED_OFF,
  COMMANDS.COMMAND_OUTPUT_PRESSED,
];

export const ZONE_COMMANDS: Command[] = [
  COMMANDS.ZONE_FAULT,
  COMMANDS.ZONE_FAULT_RESTORE,
  COMMANDS.ZONE_OPEN,
  COMMANDS.ZONE_RESTORED,
];

export const PARTITION_ZONE_COMMANDS: Command[] = [
  COMMANDS.ZONE_ALARM,
  COMMANDS.ZONE_ALARM_RESTORE,
  COMMANDS.ZONE_TAMPER,
  COMMANDS.ZONE_TAMPER_RESTORE,
];

export const LOGIN_REQUEST_PASSWORD: string = "3";

export const LOGIN_REQUEST_TIMEOUT: string = "2";

export const LOGIN_REQUEST_SUCCESS: string = "1";

export const LOGIN_REQUEST_FAIL: string = "0";

export const PACKET_TERMINATOR: string = "\r\n";

export function friendly(payload: Payload): string {
  const command = payload.command;
  let friendly: string;

  if (ZONE_COMMANDS.includes(payload.command)) {
    const zone = config.zones[payload.data.zone] ?? payload.data.zone;
    friendly = `${command}, Zone: ${zone}`;
  } else {
    friendly = `${command}`;
  }

  return friendly;
}

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
  const value = `${COMMANDS.NETWORK_LOGIN}${password}`;

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
