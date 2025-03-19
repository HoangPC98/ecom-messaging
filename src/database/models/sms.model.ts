import mongoose, { Model, Schema } from "mongoose";
import { SendStatus } from "../../enums/common.enum";

export type SmsDocument = {
  from?: string;
  to: string;
  body: string;
  isComplete?: boolean;
  sendStatus?: SendStatus;
};

const smsSchema = new Schema(
  {
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
    isComplete: {
      type: Schema.Types.Boolean,
      required: true,
    },
    sendStatus: {
      type: Schema.Types.String,
      require: false,
    }
  },
  {
    collection: 'sms',
    timestamps: true,
  },
);

const SmsModel: Model<SmsDocument> = mongoose.model<SmsDocument>('sms', smsSchema);

const saveNewSms = async (value: SmsDocument) => new SmsModel(value);

const getListSavedMsg = async () => SmsModel.find()

export { SmsModel, saveNewSms, getListSavedMsg }


