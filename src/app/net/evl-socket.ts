import EventEmitter from "events";
import { Socket, createConnection } from "net";

export enum EvlSocketEvent {
  Connected = "CONNECTED",
  Data = "DATA",
  Disconnected = "DISCONNECTED",
}

export class EvlSocket extends EventEmitter {
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

  connect() {
    if (this._connected) {
      return;
    }

    this._socket = createConnection(this._port, this._ip, () => {
      console.log("Connected!");
      this._connected = true;

      this.emit(EvlSocketEvent.Connected);
    })
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

  private handleDataEvent(data: Buffer): void {
    this.emit(EvlSocketEvent.Data, data);
  }

  private handleCloseEvent(hadError: boolean): void {
    this._connected = false;
    this.emit(EvlSocketEvent.Disconnected, hadError);
  }
}
