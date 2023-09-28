export type Command = {
  command: string;
};

export type Data = {
  partition: number;
  zone: string;
  value: string;
};

export type Checksum = {
  value: string;
};

export type Event = {
  command: Command;
  data: Data;
  length: number;
};

export type Payload = {
  command: Command;
  data: Data;
  checksum: Checksum;
};
