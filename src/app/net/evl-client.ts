import EventEmitter from "events";
import { EvlSocket, EvlSocketEvent } from "./evl-socket";

export class EvlClient extends EventEmitter {
  private _socket: EvlSocket;

  constructor(host: string, port: number) {
    super();
    this._socket = new EvlSocket(host, port);

    this.addSocketListeners();
  }

  public connect() {
    if (this._socket.connected) {
      return;
    }

    this._socket.connect();
  }

  public send(data: string) {
    if (!this._socket.connected) {
      this._socket.send(data);
    }
  }

  private addSocketListeners() {
    this._socket.addListener(EvlSocketEvent.Data, (data: string) =>
      this.handleDataEvent(data),
    );

    this._socket.addListener(EvlSocketEvent.Disconnected, (hadError: boolean) =>
      this.handleCloseEvent(hadError),
    );
  }

  private handleDataEvent(data: string) {
    console.log(`Received: ${data}`);

    this.emit("event", data);
  }

  private handleCloseEvent(hadError: boolean) {
    console.log(`Disconnected! (${hadError})...`);
  }
}
