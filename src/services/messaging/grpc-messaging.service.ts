import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { MessageModel } from 'src/database/models/message.model';

import { getReceiverSocketId, io } from 'src/libs/socket';

// Load proto file
const protoPath = path.join(process.cwd(), '../ecom-protos-grpc/messaging/messaging.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const messagingProto = protoDescriptor.Messaging as any;

// Implement the service methods
const clientConnect = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
  try {
    const { userId } = call.request;
    // Here you would typically handle the client connection
    // For now, we'll just return a mock connection ID
    const connectionId = Math.floor(Math.random() * 1000);
    callback(null, { connectionId });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Error connecting client'
    });
  }
};

const sendMessage = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
  try {
    const { senderId, receiverId, text } = call.request;

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: undefined
    });

    await newMessage.save();

    // Emit socket event if receiver is connected
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    callback(null, { success: true, message: newMessage });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Error sending message'
    });
  }
};

// Create and start the gRPC server
export function startGrpcServer() {
  const server = new grpc.Server();
  
  server.addService(messagingProto.MessagingService.service, {
    clientConnect,
    sendMessage
  });

  server.bindAsync('0.0.0.0:9001', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Error starting gRPC server:', error);
      return;
    }
    server.start();
    console.log(`gRPC server running on port ${port}`);
  });
} 