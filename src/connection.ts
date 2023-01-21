import { EventHandler } from "./event";
import * as net from "net";

export default class Connection {
  private socket: net.Socket | null = null;
  private eventHandler: EventHandler;

  constructor(readonly host: string, readonly port: number) {
    this.eventHandler = new EventHandler();
  }

  connect(): void {
    if (this.socket == null) {
      this.socket = net
        .connect({
          port: this.port,
          host: this.host,
        })
        .on("data", (data: Buffer) => {
          this.eventHandler.handle(data.toString());
        });
    }
  }

  close(): void {
    if (this.socket && !this.socket.closed) {
      this.socket.resetAndDestroy();
      this.socket = null;
    }
  }
}
