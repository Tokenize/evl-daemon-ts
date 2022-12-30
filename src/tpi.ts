import { Command, Data, Payload, Checksum } from "./models";

export default abstract class Tpi {
  public static COMMAND_LENGTH = 3;

  public static CHECKSUM_LENGTH = 2;

  public static ParseCommand(input: string): Command {
    let command = "";

    if (input.length >= this.COMMAND_LENGTH + this.CHECKSUM_LENGTH) {
      command = input.substring(0, this.COMMAND_LENGTH);
    }

    return { command: command };
  }

  public static ParseChecksum(input: string): Checksum {
    let checksum = "";

    if (input.length >= this.COMMAND_LENGTH + this.CHECKSUM_LENGTH) {
      checksum = input.substring(
        input.length - this.CHECKSUM_LENGTH,
        input.length
      );
    }

    return { value: checksum };
  }

  public static ParseData(input: string): Data {
    let data = "";

    if (input.length >= this.COMMAND_LENGTH + this.CHECKSUM_LENGTH) {
      data = input.substring(
        this.COMMAND_LENGTH,
        input.length - this.CHECKSUM_LENGTH
      );
    }

    return { value: data, zone: "", partition: 0 };
  }
}
