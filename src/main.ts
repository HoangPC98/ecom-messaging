import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
import config from "./config/config";
import { rmqConsumerService } from "./services/queue.service";
import { initMongoConnection } from "./database/connection/mongo.connection";
import { startGrpcServer } from "./services/messaging/grpc-messaging.service";

let server: Server;
const restServer: Express = express();

async function initRabbitConsumer() {
  try {
    await rmqConsumerService.init();
    console.log("--> RabbitMQ client initialized and listening for messages.");
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
    console.log(`--> Server is running on port ${config.APP_PORT}`);
  });
}

const startApp = async () => {
  await initMongoConnection();
  await initRabbitConsumer();
  startRestServer();
  startGrpcServer();
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