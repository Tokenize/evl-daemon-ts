import winston from "winston";
import { Payload } from "../types.js";

export enum LogLevel {
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export type LogDestinationType = "console" | "file";

export interface KnownLogParameters {
  payload: Payload;
  error: boolean | Error;
}

export type LogParameters = Partial<KnownLogParameters> & Record<string, unknown>;

export interface LogDestination {
  type: LogDestinationType;
  name: string;
  level: LogLevel;
  format?: string;
  settings?: Record<string, string | number>;
}

export type LogDestinations = Map<LogDestination, winston.transport>;

export const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss:SSS";

export const JSON_FORMAT = winston.format.combine(
  winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
  winston.format.json(),
);

export const SIMPLE_FORMAT = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: TIMESTAMP_FORMAT }),
  winston.format.printf((info) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `[${info.timestamp}] ${info.level}: ${info.message}, ${JSON.stringify(info)}`;
  }),
);

export class Logger {
  private _logger: winston.Logger;

  private _destinations: LogDestinations = new Map();

  private readonly _levelMap = new Map<LogLevel, string>([
    [LogLevel.Error, "error"],
    [LogLevel.Warning, "warn"],
    [LogLevel.Info, "info"],
    [LogLevel.Debug, "debug"],
    [LogLevel.Trace, "silly"],
  ]);

  private readonly _formatMap = new Map<string, winston.Logform.Format>([
    ["json", JSON_FORMAT],
    ["simple", SIMPLE_FORMAT],
  ]);

  constructor(level: LogLevel = LogLevel.Info) {
    this._logger = winston.createLogger({
      level: this.mapLogLevel(level),
      format: winston.format.simple(),
    });
  }

  public get destinations(): LogDestinations {
    return this._destinations;
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

    if (this.mapLogLevel(destination.level) == null) {
      throw new Error("Invalid log level");
    }
  }

  private createTransport(destination: LogDestination): winston.transport | null {
    switch (destination.type) {
      case "console":
        return this.createConsoleTransport(destination);
      case "file":
        return this.createFileTransport(destination);
      default:
        return null;
    }
  }

  private createConsoleTransport(
    destination: LogDestination,
  ): winston.transports.ConsoleTransportInstance {
    return new winston.transports.Console({
      level: this.mapLogLevel(destination.level),
      format: this.mapFormat(destination.format),
    });
  }

  private createFileTransport(
    destination: LogDestination,
  ): winston.transports.FileTransportInstance | null {
    if (!destination.settings) {
      throw new Error("File destination requires settings");
    }

    const filename = destination.settings.filename as string;

    if (!filename) {
      throw new Error("File destination requires filename");
    }

    return new winston.transports.File({
      filename,
      level: this.mapLogLevel(destination.level),
      format: this.mapFormat(destination.format),
    });
  }

  private mapFormat(format: string | null | undefined): winston.Logform.Format {
    if (!format) {
      return SIMPLE_FORMAT;
    }

    return this._formatMap.get(format) ?? SIMPLE_FORMAT;
  }

  private mapLogLevel(level: LogLevel): string | undefined {
    return this._levelMap.get(level);
  }

  public logError(message: string, params?: LogParameters): void {
    this.log(LogLevel.Error, message, params);
  }

  public logWarning(message: string, params?: LogParameters): void {
    this.log(LogLevel.Warning, message, params);
  }

  public logInfo(message: string, params?: LogParameters): void {
    this.log(LogLevel.Info, message, params);
  }

  public logDebug(message: string, params?: LogParameters): void {
    this.log(LogLevel.Debug, message, params);
  }

  public logTrace(message: string, params?: LogParameters): void {
    this.log(LogLevel.Trace, message, params);
  }

  public log(level: LogLevel, message: string, params?: LogParameters): void {
    const translatedLevel = this.mapLogLevel(level) ?? "info";

    if (params) {
      this._logger.log(translatedLevel, message, params);
      return;
    } else {
      this._logger.log(translatedLevel, message);
    }
  }
}
