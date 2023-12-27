import { EvlClient } from "./net/evl-client";

console.log("Welcome to EvlDaemon.");

const evlClient = new EvlClient("localhost", 4025);
evlClient.addListener("event", (event: string) => {
  console.log(`Event: ${event}`);
});
evlClient.connect();
