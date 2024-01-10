import { EvlClient } from "./net/evl-client";
import { EvlSocketConnection } from "./net/evl-connection";
import config from "./config/config";

console.log("Welcome to EvlDaemon.");

const port = config.port;
const ip = config.ip;
const password = config.password;

const evlConnection = new EvlSocketConnection(ip, port, password);
const evlClient = new EvlClient(evlConnection);

evlClient.addListener("event", (event: string) => {
  console.log(`Event: ${event}`);
});
evlClient.connect();
