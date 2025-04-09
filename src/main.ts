import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
import config from "./config/config";
import { rmqConsumerService } from "./services/queue.service";
import { initMongoConnection } from "./database/connection/mongo.connection";
import logger from "./utils/logger";

let server: Server;
const restServer: Express = express();

async function initRabbitConsumer() {
  try {
    await rmqConsumerService.init();
    logger.info("--> RabbitMQ Consumer initialized and listening for messages.");
  } catch (err) {
    console.error("Failed to initialize RabbitMQ client:", err);
  }
};

function startRestServer() {
  restServer.use(express.json());
  restServer.use(express.urlencoded({ extended: true }));
  restServer.use(errorConverter);
  restServer.use(errorHandler);
  server = restServer.listen(config.APP_PORT, () => {
    logger.info(`--> REST Server is running on port ${config.APP_PORT}`);
  });
}


const startApp = async () => {
  await initMongoConnection();
  await initRabbitConsumer();
  startRestServer();
}

startApp();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);