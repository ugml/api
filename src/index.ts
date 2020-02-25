import * as http from "http";
import App from "./App";
import Container from "./ioc/container";
import ILogger from "./interfaces/ILogger";
import SimpleLogger from "./common/SimpleLogger";

const createContainer = require("./ioc/createContainer");

const container: Container = createContainer();

const logger: ILogger = new SimpleLogger();

const port = process.env.PORT || 3000;

const app = new App(container, logger);

app.express.set("port", port);

const server = http.createServer(app.express);

server.on("error", function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      this.logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      this.logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  this.logger.info(`Listening on ${bind}`);
});

server.listen(port);
