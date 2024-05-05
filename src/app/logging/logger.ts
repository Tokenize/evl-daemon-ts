export enum LogPriority {
  Error,
  Warning,
  Info,
  Debug,
  Trace,
}

export type LogMessageParameter = string | undefined | null;

export class Logger {
  constructor(protected priority: LogPriority) {}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(priority: LogPriority, message: string, ...params: LogMessageParameter[]): void {
    return;
  }
}
