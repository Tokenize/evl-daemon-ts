import { Command } from "./models";

export abstract class Tpi {
  public static CommandLength = 3;
  public static ChecksumLength = 2;

  public static ParseCommand(input: string): Command {
    const command: Command = { value: "" };

    if (input.length < this.CommandLength + this.ChecksumLength) {
      // throw some kind of error
    }

    return command;
  }
}
