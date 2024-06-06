import config from "./config/config.js";
import { Logger } from "./logging/logger.js";
import { EvlClient, EvlEventNames } from "./net/evl-client.js";
import { EvlSocketConnection } from "./net/evl-connection.js";

console.log("Welcome to EvlDaemon.");

const port = config.port;
const ip = config.ip;
const password = config.password;

const logger = new Logger(config.logging.level);

logger.addDestinations(config.logging.destinations);

const evlConnection = new EvlSocketConnection(ip, port, logger);
const evlClient = new EvlClient(evlConnection, password, logger);

evlClient.addListener(EvlEventNames.DisconnectedEvent, () => {
  logger.logInfo(`Disconnected from EVL device.`);
});
evlClient.connect();
