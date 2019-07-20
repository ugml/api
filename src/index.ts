import * as debug from "debug";
import * as http from "http";
import { Logger } from "./common/Logger";
import App from "./App";
import Container from "./ioc/container";

const createContainer = require("./ioc/createContainer");

const container: Container = createContainer();

const app = new App(container);

debug("ts-express:server");

const port = process.env.PORT || 3000;

app.express.set("port", port);

const server = http.createServer(app.express);

server.on("error", function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  Logger.info(`Listening on ${bind}`);
  debug(`Listening on ${bind}`);
});

server.listen(port);
