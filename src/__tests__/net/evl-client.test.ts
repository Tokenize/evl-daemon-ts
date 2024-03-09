import { LogPriority, NullLogger } from "../../app/logging/logger";
import { EvlClient, EvlEventNames } from "../../app/net/evl-client";
import {
  EvlConnectionEvent,
  EvlSocketConnection,
} from "../../app/net/evl-connection";
import {
  LOGIN_REQUEST_COMMAND,
  LOGIN_REQUEST_PASSWORD,
  makeLoginPacket,
} from "../../app/tpi";
import { Payload } from "../../app/types";

let evlConnection: EvlSocketConnection;
let evlClient: EvlClient;
let connectMock: jest.SpyInstance;
let sendMock: jest.SpyInstance;

const logger = new NullLogger(LogPriority.Error);

beforeAll(() => {
  evlConnection = new EvlSocketConnection("localhost", 4025, logger);

  evlClient = new EvlClient(evlConnection, "password", logger);

  connectMock = jest
    .spyOn(EvlSocketConnection.prototype, "connect")
    .mockImplementation(() => {});

  sendMock = jest
    .spyOn(EvlSocketConnection.prototype, "send")
    .mockImplementation(() => {});
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
    jest
      .spyOn(EvlSocketConnection.prototype, "connected", "get")
      .mockImplementation(() => true);

    evlClient.send("data");

    expect(sendMock).toHaveBeenLastCalledWith<string[]>("data");
  });
});

test("should send login credentials when login event received", () => {
  const loginPayload = {
    command: LOGIN_REQUEST_COMMAND,
    data: { value: LOGIN_REQUEST_PASSWORD },
  } as Payload;

  const loginPacket = makeLoginPacket("password");

  jest
    .spyOn(EvlSocketConnection.prototype, "connected", "get")
    .mockImplementation(() => true);

  evlConnection.emit(EvlConnectionEvent.Data, loginPayload);

  expect(sendMock).toHaveBeenLastCalledWith<string[]>(loginPacket);
});

test("should emit disconnect event when disconnected", () => {
  const disconnectEventMock = jest.fn();

  evlClient.addListener(EvlEventNames.DisconnectedEvent, disconnectEventMock);

  evlConnection.emit(EvlConnectionEvent.Disconnected);

  expect(disconnectEventMock).toHaveBeenCalled();
});

test("should emit data event when data is received", () => {
  const dataEventMock = jest.fn();
  const dataPayload = {
    command: "123",
    checksum: "123",
    data: { value: "123" },
  } as Payload;

  evlClient.addListener(EvlEventNames.CommandEvent, dataEventMock);

  evlConnection.emit(EvlConnectionEvent.Data, dataPayload);

  expect(dataEventMock).toHaveBeenCalled();
});
