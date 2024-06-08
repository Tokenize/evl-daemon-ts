import config from "./config/config.js";
import { Logger } from "./logging/logger.js";
import { EvlClient, EvlEvent } from "./net/evl-client.js";
import { EvlSocketConnection } from "./net/evl-connection.js";
import { Broadcaster } from "./notifiers/broadcaster.js";
import { Console } from "./notifiers/console.js";
import { CommandPriority, Payload } from "./types.js";

console.log("Welcome to EvlDaemon.");

const port = config.port;
const ip = config.ip;
const password = config.password;

const logger = new Logger(config.logging.level);

logger.addDestinations(config.logging.destinations);

const broadcaster = new Broadcaster();

broadcaster.addNotifier(new Console(CommandPriority.Low));

const evlConnection = new EvlSocketConnection(ip, port, logger);
const evlClient = new EvlClient(evlConnection, password, logger);

evlClient.addListener(EvlEvent.DisconnectedEvent, () => {
  logger.logInfo(`Disconnected from EVL device.`);
});

const commandBroadcaster = (payload: Payload) => {
  broadcaster.notify(payload);
};

const disconnectBroadcaster = (hadError: boolean) => {
  broadcaster.disconnect(hadError);
};

evlClient.addListener(EvlEvent.CommandEvent, commandBroadcaster);
evlClient.addListener(EvlEvent.DisconnectedEvent, disconnectBroadcaster);

evlClient.connect();
