import { format } from "util";
import { Logger, LogMessageParameter, LogPriority } from "./logger";

export default class ConsoleLogger extends Logger {
  constructor(priority: LogPriority) {
    super(priority);
  }

  log(
    priority: LogPriority,
    message: string,
    ...params: LogMessageParameter[]
  ): void {
    if (priority > this.priority) {
      return;
    }

    const date = new Date(Date.now()).toISOString();
    const formatted = format(
      `[${LogPriority[priority]}][${date}]: ${message}`,
      ...params,
    );
    if (priority === LogPriority.Error) {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }
}
