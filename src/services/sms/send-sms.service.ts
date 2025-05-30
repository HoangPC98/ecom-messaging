import twilio from 'twilio';
import { MsgSmsContent } from '../../types/send-sms.type';
import { SmsDocument, SmsModel } from '../../database/models/sms.model';
import { SendStatus } from '../../enums/common.enum';

export class SmsServive {
  private accountSid = process.env.TWILIO_ACCOUNT_SID;
  private authToken = process.env.TWILIO_AUTH_TOKEN;
  private client = twilio(this.accountSid, this.authToken);
  private systemPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  
  constructor() {

  }

  async consumeMsg(msg: MsgSmsContent) {
    const newMsg: SmsDocument = {
      code: msg.id,
      from: this.systemPhoneNumber,
      to: msg.to_number,
      body: msg.value,
      isComplete: false,
      sendStatus: SendStatus.PENDING
    }
   try {
    // sendSMS
    // const message = await this.client.messages.create(newMsg);
    // console.log('Send Msg successfully...' + message.body);

    // save new Msg into DB
    newMsg.isComplete = true;
    newMsg.sendStatus = SendStatus.SUCCESS;
    const created = await SmsModel.create(newMsg);

    // const listSavedMsg = await SmsModel.find();
    console.log('MSG SAVE...', created)
   } catch (error) {
    newMsg.sendStatus = SendStatus.FAIL;
    console.log('Error when send sms: ', error)
   }
  }

}