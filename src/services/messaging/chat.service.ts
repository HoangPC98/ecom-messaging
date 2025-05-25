import { Request, Response } from 'express';
import { ALL_USER_BASE_INFO } from 'src/constants/index.constant';
import { MessageModel } from "src/database/models/message.model";
import { getReceiverSocketId, io } from "src/libs/socket";
import  { AuthenticatedRequest }  from 'src/interfaces/user.interface'
import CacheService from 'src/services/common/cache.service';
import { UserBaseInfo } from 'src/types/user.type';

interface SendMessageBody {
  text: string;
  image?: string;
}

export class ChatService {
  constructor(
    private readonly messageModel: typeof MessageModel,
    private readonly cacheService: CacheService
  ) { }

  async getUsersForSidebar(userId: string): Promise<UserBaseInfo[]> {
    try {
      const allUserBase = await this.cacheService.get(ALL_USER_BASE_INFO) as unknown as UserBaseInfo[];
      return allUserBase;
    } catch (error: unknown) {
      console.error("Error in getUsersForSidebar: ", error instanceof Error ? error.message : 'Unknown error');
      return []; // Ensure a return value of type UserBaseInfo[]
    }
  }
  //     console.error("Error in getUsersForSidebar: ", error instanceof Error ? error.message : 'Unknown error');
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;

      const messages = await this.messageModel.find({
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
  }

  async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const newMessage = new this.messageModel({
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
  }
}
