import { EvlClient } from "./net/evl-client";
import { EvlSocketConnection } from "./net/evl-connection";

console.log("Welcome to EvlDaemon.");

const evlConnection = new EvlSocketConnection("localhost", 4025);
const evlClient = new EvlClient(evlConnection);

evlClient.addListener("event", (event: string) => {
  console.log(`Event: ${event}`);
});
evlClient.connect();
