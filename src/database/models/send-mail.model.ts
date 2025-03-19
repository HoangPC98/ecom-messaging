import mongoose, { Model, Schema } from "mongoose";
import { SendStatus } from "../../enums/common.enum";

export type SendMailDocument = {
  typeNo: number;
  from?: string;
  to: string;
  body: string;
  sendStatus?: SendStatus;
};

const sendMailSchema = new Schema(
  {
    typeNo: {
      type: Schema.Types.Number,
      required: false,
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
    }
  },
  {
    collection: 'mail',
    timestamps: true,
  },
);

const SendMailModel: Model<SendMailDocument> = mongoose.model<SendMailDocument>('mail', sendMailSchema);

export { SendMailModel }


