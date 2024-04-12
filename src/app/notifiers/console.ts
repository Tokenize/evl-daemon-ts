import { IEvlEventHandler } from "../net/evl-client";
import { Payload } from "../types";
import { payloadToString } from "../util";

export default class ConsoleNotifier implements IEvlEventHandler {
  constructor() {}

  on<CommandEvent>(event: CommandEvent, payload: Payload): void {
    console.log(payloadToString(payload));
  }
}
