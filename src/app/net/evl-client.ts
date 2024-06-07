import EventEmitter from "events";
import { Logger } from "../logging/logger.js";
import {
  LOGIN_REQUEST_FAIL,
  LOGIN_REQUEST_PASSWORD,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_TIMEOUT,
  makeLoginPacket,
} from "../tpi.js";
import { Command, Payload } from "../types.js";
import { EvlConnectionEvent, IEvlConnection } from "./evl-connection.js";

export interface IEvlClient extends EventEmitter {
  connect(): void;
  send(data: string): void;
}

export enum EvlEvent {
  CommandEvent = "COMMAND_EVENT",
  DisconnectedEvent = "DISCONNECT_EVENT",
}

export type CommandEventHandler = (payload: Payload) => void;
export type DisconnectEventHandler = (hadError: boolean) => void;

export type EvlClientEventHandler<T extends EvlEvent> = T extends EvlEvent.CommandEvent
  ? CommandEventHandler
  : DisconnectEventHandler;

export class EvlClient extends EventEmitter implements IEvlClient {
  private _connection: IEvlConnection;
  private readonly _password: string;
  private readonly _logger: Logger;

  constructor(connection: IEvlConnection, password: string, logger: Logger) {
    super();

    this._connection = connection;
    this._password = password;
    this._logger = logger;

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
      throw Error("Unable to send, connection isn't active");
    }

    this._connection.send(data);
  }

  private addEventListeners(): void {
    this._connection.addListener(EvlConnectionEvent.Data, (data: Payload) => {
      this.handleDataEvent(data);
    });

    this._connection.addListener(EvlConnectionEvent.Disconnected, (hadError: boolean) => {
      this.handleCloseEvent(hadError);
    });
  }

  public addListener(event: EvlEvent, handler: EvlClientEventHandler<EvlEvent>): this {
    super.addListener(event, handler);
    return this;
  }

  private handleDataEvent(payload: Payload): void {
    this._logger.logDebug("Received", { payload });

    if (payload.command === (Command.LOGIN as Command)) {
      this.handleLoginEvent(payload);
    }

    this.emit(EvlEvent.CommandEvent, payload);
  }

  private handleCloseEvent(error: boolean): void {
    this._logger.logInfo("Disconnected", { error });

    this.emit(EvlEvent.DisconnectedEvent, error);
  }

  private handleLoginEvent(payload: Payload): void {
    switch (payload.data.value) {
      case LOGIN_REQUEST_PASSWORD:
        this._logger.logDebug("Password requested, sending", { payload });
        this.sendLoginCredentials();
        break;
      case LOGIN_REQUEST_TIMEOUT:
        // handle timeout
        this._logger.logError("Device sent a timeout while waiting for password", { payload });
        break;
      case LOGIN_REQUEST_FAIL:
        // handle login fail
        this._logger.logError("Invalid password, unable to connect", { payload });
        break;
      case LOGIN_REQUEST_SUCCESS:
        // handle login success
        this._logger.logDebug("Password valid, logged in to device", { payload });
        break;
    }
  }

  private sendLoginCredentials(): void {
    const packet = makeLoginPacket(this._password);

    this.send(packet);
  }
}
