import mongoose, { Model, Schema } from "mongoose";
import { SendStatus } from "../../enums/common.enum";

export type NotificationContextDocument = {
  type: string;
  from?: string;
  to: string;
  body: string;
  sendStatus?: SendStatus;
};

const schema = new Schema(
  {
    code: {
      type: Schema.Types.String,
      require: true,
      unique: true
    },
    type: {
      type: Schema.Types.Number,
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
    body: {
      type: Schema.Types.String,
      required: true,
    },
    sendStatus: {
      type: Schema.Types.String,
      require: false,
      enum: SendStatus
    },
    isSystem: {
      type: Schema.Types.Boolean
    },
    isRead: {
      type: Schema.Types.Boolean,
      default: false
    },
    isViewed: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    collection: 'sms',
    timestamps: true,
  },
);

const NotificationContextModel: Model<NotificationContextDocument> = mongoose.model<NotificationContextDocument>('notification_context', schema);

export { NotificationContextModel }