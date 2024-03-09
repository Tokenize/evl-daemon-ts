export enum LogPriority {
  Error,
  Warning,
  Info,
  Debug,
  Trace,
}

export type LogMessageParameter = string | undefined | null;

export abstract class Logger {
  protected constructor(protected priority: LogPriority) {}

  abstract log(
    priority: LogPriority,
    message: string,
    ...params: LogMessageParameter[]
  ): void;

  logError(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogPriority.Error, message, ...params);
  }

  logWarning(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogPriority.Warning, message, ...params);
  }

  logInfo(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogPriority.Info, message, ...params);
  }

  logDebug(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogPriority.Debug, message, ...params);
  }

  logTrace(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogPriority.Trace, message, ...params);
  }
}

export class NullLogger extends Logger {
  constructor(priority: LogPriority) {
    super(priority);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  log(
    priority: LogPriority,
    message: string,
    ...params: LogMessageParameter[]
  ): void {
    return;
  }

  /* eslint-enable */
}
