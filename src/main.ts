import express, { Express } from "express";
import { Server, createServer } from "http";
import { errorConverter, errorHandler } from "./middleware";
import config from "./config/config";
import { rmqConsumerService } from "./services/queue.service";
import { initMongoConnection } from "./database/connection/mongo.connection";
import { startGrpcServer } from "./services/messaging/grpc-messaging.service";
import { app } from "./libs/socket";
import { Server as SocketIOServer } from 'socket.io';

let server: Server;
const restServer: Express = express();
const httpServer = createServer(restServer);


const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Allow all origins for simplicity in development
    methods: ['GET', 'POST'],
  },
});

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
  restServer.get('/health', (req, res) => {
    res.status(200).send('Chat Service is healthy!');
  });
  io.on('connection', (socket) => {
    console.log('Client connected to Chat Service:', socket.id);

    // Lắng nghe sự kiện 'message'
    socket.on('message', (message: string) => {
      console.log(`[Chat Service] Received message from ${socket.id}: "${message}"`);
      // Phát lại tin nhắn đến tất cả các client đã kết nối
      io.emit('message', `[${socket.id.substring(0, 5)}] says: ${message}`);
    });

    // Lắng nghe sự kiện 'joinRoom'
    socket.on('joinRoom', (room: string) => {
      socket.join(room);
      console.log(`[Chat Service] Client ${socket.id} joined room: ${room}`);
      io.to(room).emit('roomMessage', `Client ${socket.id} has joined room: ${room}`);
    });

    // Lắng nghe sự kiện 'leaveRoom'
    socket.on('leaveRoom', (room: string) => {
      socket.leave(room);
      console.log(`[Chat Service] Client ${socket.id} left room: ${room}`);
      io.to(room).emit('roomMessage', `Client ${socket.id} has left room: ${room}`);
    });

    // Xử lý khi client ngắt kết nối
    socket.on('disconnect', () => {
      console.log('Client disconnected from Chat Service:', socket.id);
    });
  });

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