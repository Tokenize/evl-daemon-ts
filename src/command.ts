export interface Command {
  command: string;
  description: string;
  length: number;
}

export interface Data {
  value: string;
}

export interface Payload {
  command: Command;
  data: Data;
}
