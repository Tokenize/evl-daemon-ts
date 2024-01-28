import EventEmitter from "events";
import { IEvlConnection, EvlConnectionEvent } from "./evl-connection";
import { Payload } from "../types";

export interface IEvlClient extends EventEmitter {
  connect(): void;
  send(data: string): void;
}

export class EvlClient extends EventEmitter implements IEvlClient {
  private _connection: IEvlConnection;

  constructor(connection: IEvlConnection) {
    super();
    this._connection = connection;

    this.addEventListeners();
  }

  public connect(): void {
    if (this._connection.connected) {
      return;
    }

    this._connection.connect();
  }

  public send(data: string): void {
    if (!this._connection.connected) {
      this._connection.send(data);
    }
  }

  private addEventListeners(): void {
    this._connection.addListener(EvlConnectionEvent.Data, (data: Payload) =>
      this.handleDataEvent(data),
    );

    this._connection.addListener(
      EvlConnectionEvent.Disconnected,
      (hadError: boolean) => this.handleCloseEvent(hadError),
    );
  }

  private handleDataEvent(data: Payload): void {
    console.log(`Received: ${data.command}`);

    this.emit("event", data);
  }

  private handleCloseEvent(hadError: boolean): void {
    console.log(`Disconnected! (${hadError})...`);

    this.emit("disconnected", hadError);
  }
}
