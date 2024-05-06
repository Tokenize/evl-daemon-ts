import winston from "winston";

export enum LogLevel {
  Error,
  Warning,
  Info,
  Debug,
  Trace,
}

export type LogDestinationType = "console" | "file";

export type LogMessageParameter = string | undefined | null;

export type LogDestination = {
  type: LogDestinationType;
  name: string;
  level: LogLevel;
  format: string;
  settings: Record<string, string | number>;
};

export class Logger {
  private _logger: winston.Logger;

  constructor(level: LogLevel = LogLevel.Info) {
    this._logger = winston.createLogger({
      level: this.translateLogLevel(level),
      format: winston.format.simple(),
    });
  }

  public addDestinations(destinations: LogDestination[]): void {
    destinations.forEach((destination) => {
      const transport = this.createTransport(destination);

      if (transport) {
        this._logger.add(transport);
      }
    });
  }

  private createTransport(destination: LogDestination): winston.transport | null {
    switch (destination.type) {
      case "console":
        return new winston.transports.Console({
          level: this.translateLogLevel(destination.level),
          format: winston.format.simple(),
        });
      default:
        return null;
    }
  }

  private translateLogLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.Error:
        return "error";
      case LogLevel.Warning:
        return "warn";
      case LogLevel.Info:
        return "info";
      case LogLevel.Debug:
        return "debug";
      case LogLevel.Trace:
        return "silly";
      default:
        return "info";
    }
  }

  public logError(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogLevel.Error, message, ...params);
  }

  public logWarning(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogLevel.Warning, message, ...params);
  }

  public logInfo(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogLevel.Info, message, ...params);
  }

  public logDebug(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogLevel.Debug, message, ...params);
  }

  public logTrace(message: string, ...params: LogMessageParameter[]): void {
    this.log(LogLevel.Trace, message, ...params);
  }

  public log(level: LogLevel, message: string, ...params: LogMessageParameter[]): void {
    const translatedLevel = this.translateLogLevel(level);

    this._logger.log(translatedLevel, message, ...params);
  }
}
