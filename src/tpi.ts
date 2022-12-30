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
}
