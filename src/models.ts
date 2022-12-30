export interface Command {
  command: string;
}

export interface Data {
  partition: number;
  zone: string;
  value: string;
}

export interface Checksum {
  value: string;
}

export interface Payload {
  command: Command;
  data: Data;
  checksum: Checksum;
}
