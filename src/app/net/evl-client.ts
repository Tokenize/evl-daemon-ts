import EventEmitter from "events";
import { Logger } from "../logging/logger";
import {
  COMMANDS,
  LOGIN_REQUEST_FAIL,
  LOGIN_REQUEST_PASSWORD,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_TIMEOUT,
  makeLoginPacket,
} from "../tpi";
import { Command, Payload } from "../types";
import { EvlConnectionEvent, IEvlConnection } from "./evl-connection";

export interface IEvlClient extends EventEmitter {
  connect(): void;
  send(data: string): void;
}

export enum EvlEventNames {
  CommandEvent = "COMMAND_EVENT",
  DisconnectedEvent = "DISCONNECT_EVENT",
}

export type CommandEvent = EvlEventNames.CommandEvent;
export type DisconnectEvent = EvlEventNames.DisconnectedEvent;

export type CommandEventHandler = (payload: Payload) => void;
export type DisconnectEventHandler = (hadError: boolean) => void;

export type EvlEvent = CommandEvent | DisconnectEvent;

export type EvlClientEventHandler<T extends EvlEvent> = T extends CommandEvent
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
    this._connection.addListener(EvlConnectionEvent.Data, (data: Payload) =>
      this.handleDataEvent(data),
    );

    this._connection.addListener(EvlConnectionEvent.Disconnected, (hadError: boolean) =>
      this.handleCloseEvent(hadError),
    );
  }

  public addListener(event: EvlEvent, handler: EvlClientEventHandler<EvlEvent>): this {
    super.addListener(event, handler);
    return this;
  }

  private handleDataEvent(payload: Payload): void {
    this._logger.logDebug("Received: %s", payload.command);

    if (payload.command === (COMMANDS.LOGIN as Command)) {
      this.handleLoginEvent(payload);
    }

    this.emit(EvlEventNames.CommandEvent, payload);
  }

  private handleCloseEvent(hadError: boolean): void {
    this._logger.logInfo("Disconnected! (%s)...", hadError?.toString());

    this.emit(EvlEventNames.DisconnectedEvent, hadError);
  }

  private handleLoginEvent(login: Payload): void {
    switch (login.data.value) {
      case LOGIN_REQUEST_PASSWORD:
        this._logger.logDebug("Password requested, sending");
        this.sendLoginCredentials();
        break;
      case LOGIN_REQUEST_TIMEOUT:
        // handle timeout
        this._logger.logError("Device sent a timeout while waiting for password");
        break;
      case LOGIN_REQUEST_FAIL:
        // handle login fail
        this._logger.logError("Invalid password, unable to connect");
        break;
      case LOGIN_REQUEST_SUCCESS:
        // handle login success
        this._logger.logDebug("Password valid, logged in to device");
        break;
    }
  }

  private sendLoginCredentials(): void {
    const packet = makeLoginPacket(this._password);

    this.send(packet);
  }
}
