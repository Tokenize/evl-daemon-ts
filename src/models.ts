export interface Command {
  value: string;
}

export interface Checksum {
  value: string;
}

export interface Data {
  value: string;
}

export interface Event {
  command: Command;
  data: Data;
  length: number;
}

export interface Packet {
  command: Event;
  data: Data;
  checksum: Checksum;
}
