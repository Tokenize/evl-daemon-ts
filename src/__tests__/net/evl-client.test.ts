const loggerMock = jest.mock("../../app/logging/logger");

import { Logger } from "../../app/logging/logger.js";
import { EvlClient, EvlEvent } from "../../app/net/evl-client.js";
import { EvlConnectionEvent, EvlSocketConnection } from "../../app/net/evl-connection.js";
import { LOGIN_REQUEST_PASSWORD, makeLoginPacket } from "../../app/tpi.js";
import { Command, Payload } from "../../app/types.js";

let evlConnection: EvlSocketConnection;
let evlClient: EvlClient;
let connectMock: jest.SpyInstance;
let sendMock: jest.SpyInstance;

const logger = new Logger();

beforeAll(() => {
  evlConnection = new EvlSocketConnection("localhost", 4025, logger);

  evlClient = new EvlClient(evlConnection, "password", logger);

  connectMock = jest
    .spyOn(EvlSocketConnection.prototype, "connect")
    .mockImplementation(() => void 0);

  sendMock = jest.spyOn(EvlSocketConnection.prototype, "send").mockImplementation(() => void 0);

  loggerMock.clearAllMocks();
});

beforeEach(() => {
  jest.mock("../../app/net/evl-connection").resetAllMocks();
});

describe("connect", () => {
  test("attempts to connect if not already connected", () => {
    const getConnectedMock = jest
      .spyOn(EvlSocketConnection.prototype, "connected", "get")
      .mockImplementation(() => false);

    evlClient.connect();

    expect(getConnectedMock).toHaveBeenCalled();

    expect(connectMock).toHaveBeenCalled();
  });

  test("doesn't attempt to connect if already connected", () => {
    const getConnectedMock = jest
      .spyOn(EvlSocketConnection.prototype, "connected", "get")
      .mockImplementation(() => true);

    evlClient.connect();

    expect(getConnectedMock).toHaveBeenCalled();

    expect(connectMock).toHaveBeenCalledTimes(0);
  });
});

describe("send", () => {
  test("should throw error if not connected", () => {
    const getConnectedMock = jest
      .spyOn(EvlSocketConnection.prototype, "connected", "get")
      .mockImplementation(() => false);

    expect(() => {
      evlClient.send("test");
    }).toThrow();

    expect(getConnectedMock).toHaveBeenCalled();
  });

  test("should send given data if connected", () => {
    jest.spyOn(EvlSocketConnection.prototype, "connected", "get").mockImplementation(() => true);

    evlClient.send("data");

    expect(sendMock).toHaveBeenLastCalledWith<string[]>("data");
  });
});

test("should send login credentials when login event received", () => {
  const loginPayload = {
    command: Command.LOGIN,
    data: { value: LOGIN_REQUEST_PASSWORD },
  } as Payload;

  const loginPacket = makeLoginPacket("password");

  jest.spyOn(EvlSocketConnection.prototype, "connected", "get").mockImplementation(() => true);

  evlConnection.emit(EvlConnectionEvent.Data, loginPayload);

  expect(sendMock).toHaveBeenLastCalledWith<string[]>(loginPacket);
});

test("should emit disconnect event when disconnected", () => {
  const disconnectEventMock = jest.fn();

  evlClient.addListener(EvlEvent.DisconnectedEvent, disconnectEventMock);

  evlConnection.emit(EvlConnectionEvent.Disconnected);

  expect(disconnectEventMock).toHaveBeenCalled();
});

test("should emit data event when data is received", () => {
  const dataEventMock = jest.fn();
  const dataPayload = {
    command: "123" as Command,
    checksum: "123",
    data: { value: "123" },
  } as Payload;

  evlClient.addListener(EvlEvent.CommandEvent, dataEventMock);

  evlConnection.emit(EvlConnectionEvent.Data, dataPayload);

  expect(dataEventMock).toHaveBeenCalled();
});
