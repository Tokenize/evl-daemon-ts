import { EvlClient } from "./net/evl-client";
import { EvlSocketConnection } from "./net/evl-connection";
import config from "./config/config";
import { Payload } from "./types";

console.log("Welcome to EvlDaemon.");

const port = config.port;
const ip = config.ip;
const password = config.password;

const evlConnection = new EvlSocketConnection(ip, port);
const evlClient = new EvlClient(evlConnection, password);

evlClient.addListener("event", (event: Payload) => {
  console.log(`Event: ${event.command}`);
});
evlClient.connect();
