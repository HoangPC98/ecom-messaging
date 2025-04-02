import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
// import { connectDB } from "./database";
import config from "./config/config";
import { rmqConsumerService } from "./services/queue.service";
import { initMongoConnection } from "./database/connection/mongo.connection";

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from "path";
import { clientRequest, find, findOne, getAllNews } from "./services/common/customer.service";
// connectDB();


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


function intiGrpcConnection() {
  const rpc_port = 5001;
  const packageDefinitionCustomer = protoLoader.loadSync(path.join(__dirname, '../../ecom-protos-grpc/customer/customer.proto'));
  const customerProto = grpc.loadPackageDefinition(packageDefinitionCustomer).Customer as any;
  const server = new grpc.Server();

  // server.addService(customerProto.CustomersService.service, { getAllNews: getAllNews });
  // server.addService(heroProto.HeroService.service, { findOne: findOne });

  // server.addService(customerProto.CustomersService.service, { getAllNews: clientRequest });
  server.bindAsync(
    `localhost:${rpc_port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err != null) {
        return console.error(`Error start application: ${err}`);
      }
      console.warn(`Microservice customers gRPC listening on ${port}`);
    },
  );
};

const startApp = async () => {
  await initMongoConnection();
  startRestServer();
  intiGrpcConnection();
  await initRabbitConsumer();
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