import { Request, Response } from 'express';
import { MessageModel } from "src/database/models/message.model";
import { getReceiverSocketId, io } from "src/libs/socket";
import CacheService from 'src/services/common/cache.service';
import { ChatService } from 'src/services/messaging/chat.service';
import Chat from 'twilio/lib/rest/Chat';
// import cloudinary from "../lib/cloudinary.js";

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
  };
}

const cacheService = new CacheService();
const chatService = new ChatService(MessageModel, cacheService);

export const getUsersForSidebar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await chatService.getUsersForSidebar(loggedInUserId);

    res.status(200).json(filteredUsers);
  } catch (error: unknown) {
    console.error("Error in getUsersForSidebar: ", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error: unknown) {
    console.log("Error in getMessages controller: ", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: "Internal server error" });
  }
};

interface SendMessageBody {
  text: string;
  image?: string;
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text, image } = req.body as SendMessageBody;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // let imageUrl: string | undefined;
    // if (image) {
    //   // Upload base64 image to cloudinary
    //   const uploadResponse = await cloudinary.uploader.upload(image);
    //   imageUrl = uploadResponse.secure_url;
    // }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text,
      image: undefined, // imageUrl is commented out
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log("Sending message to receiver: ", receiverSocketId);
      console.log("newMessage", newMessage);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: unknown) {
    console.log("Error in sendMessage controller: ", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: "Internal server error" });
  }
};
