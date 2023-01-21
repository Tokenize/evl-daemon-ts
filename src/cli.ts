import "./connection";
import Connection from "./connection";

console.log("Welcome to EvlDaemon.");

const connection: Connection = new Connection("127.0.0.1", 4025);
connection.connect();
