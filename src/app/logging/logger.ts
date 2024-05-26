import winston from "winston";

export enum LogLevel {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export type LogDestinationType = "console" | "file";

export type LogMessageParameter = string | undefined | null;

export type LogDestination = {
  type: LogDestinationType;
  name: string;
  level: LogLevel;
  format: string;
  settings: Record<string, string | number> | null;
};

export class Logger {
  private _logger: winston.Logger;

  private _destinations: Map<LogDestination, winston.transport> = new Map();

  private readonly _levelMap: Map<LogLevel, string> = new Map([
    [LogLevel.Error, "error"],
    [LogLevel.Warning, "warn"],
    [LogLevel.Info, "info"],
    [LogLevel.Debug, "debug"],
    [LogLevel.Trace, "silly"],
  ]);

  constructor(level: LogLevel = LogLevel.Info) {
    this._logger = winston.createLogger({
      level: this.mapLogLevel(level),
      format: winston.format.simple(),
    });
  }

  public get count(): number {
    return this._destinations.size;
  }

  public addDestinations(destinations: LogDestination[]): void {
    destinations.forEach((destination) => {
      this.validateDestination(destination);

      const transport = this.createTransport(destination);

      if (transport) {
        this._destinations.set(destination, transport);
        this._logger.add(transport);
      }
    });
  }

  private validateDestination(destination: LogDestination): void {
    if (!destination.name) {
      throw new Error("Destination name is required");
    }

    if (!destination.format) {
      throw new Error("Destination format is required");
    }

    if (this.mapLogLevel(destination.level) == null) {
      throw new Error("Invalid log level");
    }
  }

  private createTransport(destination: LogDestination): winston.transport | null {
    switch (destination.type) {
      case "console":
        return new winston.transports.Console({
          level: this.mapLogLevel(destination.level),
          format: winston.format.simple(),
        });
      default:
        return null;
    }
  }

  private mapLogLevel(level: LogLevel): string | undefined {
    return this._levelMap.get(level);
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
    const translatedLevel = this.mapLogLevel(level) ?? "info";

    this._logger.log(translatedLevel, message, ...params);
  }
}
