import mongoose, { Model, Schema, Document } from "mongoose";
import { SendStatus } from "../../enums/common.enum";

export interface IMessage extends Document {
  code: string;
  from?: string;
  to: string;
  text: string;
  image?: string;
  sendStatus?: SendStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageInput {
  code: string;
  from?: string;
  to: string;
  text: string;
  image?: string;
  sendStatus?: SendStatus;
}

const MessageSchema = new Schema<IMessage>(
  {
    code: {
      type: Schema.Types.String,
      required: true,
    },
    from: {
      type: Schema.Types.String,
      required: false,
    },
    to: {
      type: Schema.Types.String,
      required: true,
    },
    text: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: false,
    },
    sendStatus: {
      type: Schema.Types.String,
      required: false,
    }
  },
  {
    collection: 'Message',
    timestamps: true,
  },
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

const saveNewMessage = async (value: IMessageInput): Promise<IMessage> => {
  return new MessageModel(value).save();
};

const getListSavedMsg = async (): Promise<IMessage[]> => {
  return MessageModel.find().exec();
};

export { MessageModel, saveNewMessage, getListSavedMsg };


