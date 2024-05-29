import winston from "winston";
import { LogDestination, LogDestinationType, LogLevel, Logger } from "../../app/logging/logger";

const mockLog = jest.fn();
const mockAdd = jest.fn();
const mockCreateLogger = jest.fn().mockReturnValue({
  log: mockLog,
  add: mockAdd,
});

winston.createLogger = mockCreateLogger;

const consoleDestination: LogDestination = {
  type: "console",
  level: LogLevel.Info,
  name: "console",
  format: "simple",
  settings: {},
};

const consoleDestination2: LogDestination = {
  type: "console",
  level: LogLevel.Info,
  name: "console2",
  format: "simple",
  settings: {},
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("addDestinations", () => {
  test("should add a transport for each destination", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [consoleDestination];

    logger.addDestinations(destinations);

    expect(logger.count).toBe(1);
  });

  test("should not add a transport for an invalid destination", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [
      {
        type: "invalid" as unknown as LogDestinationType,
        level: LogLevel.Info,
        name: "invalid",
        format: "simple",
        settings: {},
      },
    ];

    logger.addDestinations(destinations);

    expect(logger.count).toBe(0);
  });

  test("should add a transport for each valid destination", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [consoleDestination, consoleDestination2];

    logger.addDestinations(destinations);

    expect(logger.count).toBe(2);
  });

  test("should add a transport for each valid destination and ignore invalid destinations", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [
      consoleDestination,
      {
        type: "invalid" as unknown as LogDestinationType,
        level: LogLevel.Info,
        name: "invalid",
        format: "simple",
        settings: {},
      },
      consoleDestination2,
    ];

    logger.addDestinations(destinations);

    expect(logger.count).toBe(2);
  });

  test("should throw an error if provided level is invalid", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [
      {
        ...consoleDestination,
        level: "invalid" as unknown as LogLevel,
      },
    ];

    expect(() => {
      logger.addDestinations(destinations);
    }).toThrow();
  });

  test("should throw an error if destination name is missing", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [
      {
        type: "console",
        level: LogLevel.Info,
        format: "simple",
        settings: {},
      } as unknown as LogDestination,
    ];

    expect(() => {
      logger.addDestinations(destinations);
    }).toThrow();
  });

  test("should throw an error if destination format is missing", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [
      {
        type: "console",
        level: LogLevel.Info,
        name: "console",
        settings: {},
      } as unknown as LogDestination,
    ];

    expect(() => {
      logger.addDestinations(destinations);
    }).toThrow();
  });

  test("should throw an error if destination is invalid", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [{} as unknown as LogDestination];

    expect(() => {
      logger.addDestinations(destinations);
    }).toThrow();
  });
});

describe("logging", () => {
  test("log should log a message to each destination", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [consoleDestination];

    logger.addDestinations(destinations);

    logger.log(LogLevel.Info, "Test message");

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith("info", "Test message");
  });

  test("log should log a message to each destination with metadata", () => {
    const logger = new Logger();
    const destinations: LogDestination[] = [consoleDestination];

    logger.addDestinations(destinations);

    logger.log(LogLevel.Info, "Test message", { key: "value" });

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith("info", "Test message", { key: "value" });
  });

  it.each([
    ["logInfo", "info", "Info!"],
    ["logWarning", "warn", "Warning!"],
    ["logError", "error", "Error!"],
    ["logDebug", "debug", "Debug!"],
    ["logTrace", "silly", "Trace!"],
  ])("%s should log a message at %s level", (logFn, level, message) => {
    const logger = new Logger();
    const destinations: LogDestination[] = [consoleDestination];

    logger.addDestinations(destinations);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (logger as any)[logFn](message);

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith(level, message);
  });
});
