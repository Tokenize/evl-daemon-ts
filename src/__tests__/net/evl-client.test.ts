import { EvlSocketConnection } from "../../app/net/evl-connection";
import { EvlClient } from "../../app/net/evl-client";

let evlClient: EvlClient;
let connectMock: jest.SpyInstance;

beforeEach(() => {
  evlClient = new EvlClient(
    new EvlSocketConnection("localhost", 4025),
    "password",
  );

  connectMock = jest
    .spyOn(EvlSocketConnection.prototype, "connect")
    .mockImplementation(() => {});

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

    const sendMock = jest
      .spyOn(EvlSocketConnection.prototype, "send")
      .mockImplementation(() => {});

    evlClient.send("data");

    expect(sendMock).toHaveBeenLastCalledWith<string[]>("data");
  });
});

test("should emit disconnect event when disconnected", () => {});

test("should emit data event when data is received", () => {});
