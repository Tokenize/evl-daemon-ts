import ConsoleLogger from "../../app/logging/console";
import { LogPriority } from "../../app/logging/logger";
import resetAllMocks = jest.resetAllMocks;

const errorMock = jest
  .spyOn(global.console, "error")
  .mockImplementation(() => {});
const logMock = jest.spyOn(global.console, "log").mockImplementation(() => {});
const logger = new ConsoleLogger(LogPriority.Debug);

beforeEach(() => {
  resetAllMocks();
});

describe("log", () => {
  test("should log error level logs to console.error", () => {
    logger.logError("error!");

    expect(errorMock).toHaveBeenCalled();
    expect(logMock).toHaveBeenCalledTimes(0);
  });

  test("should log non-error level logs to console.log", () => {
    logger.logDebug("debug!");

    expect(logMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledTimes(0);
  });

  test("should not log messages below its priority", () => {
    logger.logTrace("trace!");

    expect(logMock).toHaveBeenCalledTimes(0);
    expect(errorMock).toHaveBeenCalledTimes(0);
  });
});
