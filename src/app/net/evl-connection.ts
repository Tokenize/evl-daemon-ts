import EventEmitter from "events";
import { Socket, createConnection } from "net";

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

  connect(): void {
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

  send(data: string): void {
    console.debug(`Sending: ${data}`);
  }

  disconnect(): void {
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
    this.emit(EvlConnectionEvent.Data, data);
  }

  private handleCloseEvent(hadError: boolean): void {
    this._connected = false;
    this.emit(EvlConnectionEvent.Disconnected, hadError);
  }
}