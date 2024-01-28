import EventEmitter from "events";
import { Socket, createConnection } from "net";
import { getPayload } from "../tpi";

export enum EvlConnectionEvent {
  Connected = "CONNECTED",
  Data = "DATA",
  Disconnected = "DISCONNECTED",
}

export interface IEvlConnection extends EventEmitter {
  get connected(): boolean;

  connect(): void;
  disconnect(): void;
  send(data: string): void;
}

export class EvlSocketConnection
  extends EventEmitter
  implements IEvlConnection
{
  private _ip: string;
  private _port: number;
  private _connected: boolean = false;

  private _socket: Socket | null;

  get connected(): boolean {
    return this._connected;
  }

  constructor(ip: string, port: number) {
    super();

    this._ip = ip;
    this._port = port;

    this._socket = null;
  }

  public connect(): void {
    if (this._connected) {
      return;
    }

    this._socket = createConnection(this._port, this._ip, () =>
      this.handleConnectedEvent(),
    )
      .on("data", (data: Buffer) => this.handleDataEvent(data))
      .on("close", (handleError: boolean) =>
        this.handleCloseEvent(handleError),
      );
  }

  public send(data: string): void {
    if (!this._connected || !this._socket) {
      throw Error("Unable to send, not connected to device");
    }

    const buffer = Buffer.from(data, "latin1");

    const written = this._socket.write(buffer, (e?) => {
      if (e) {
        console.error(`Error while sending: ${e.message}`);
      }
    });

    if (!written) {
      throw Error("Unable to send packet to device");
    }
  }

  public disconnect(): void {
    if (this._connected || !this._socket) {
      return;
    }

    this._socket.destroySoon();
  }

  private handleConnectedEvent(): void {
    console.log("Connected!");
    this._connected = true;

    this.emit(EvlConnectionEvent.Connected);
  }

  private handleDataEvent(data: Buffer): void {
    const asciiData = data.toString("latin1");

    const packets = asciiData.split("\r\n");

    const terminator = packets.pop();

    if (terminator !== "") {
      console.error(`Received incomplete data: ${terminator}`);
    }

    packets.forEach((packet) => {
      const payload = getPayload(packet);

      this.emit(EvlConnectionEvent.Data, payload);
    });
  }

  private handleCloseEvent(hadError: boolean): void {
    this._connected = false;
    this.emit(EvlConnectionEvent.Disconnected, hadError);
  }
}
