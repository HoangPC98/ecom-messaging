import twilio from 'twilio';
import { SystemSendSmsT } from '../../types/send-sms.type';
import { SmsDocument, SmsModel } from '../../database/models/sms.model';
import { SendStatus } from '../../enums/common.enum';

export class SmsServive {
  private accountSid = process.env.TWILIO_ACCOUNT_SID;
  private authToken = process.env.TWILIO_AUTH_TOKEN;
  private client = twilio(this.accountSid, this.authToken);
  private systemPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  
  constructor() {

  }

  async consumeMsg(msg: SystemSendSmsT) {
    const newMsg: SmsDocument = {
      body: msg.text,
      from: this.systemPhoneNumber,
      to: msg.to,
      isComplete: false,
      sendStatus: SendStatus.PENDING
    }
   try {
    
    // const message = await this.client.messages.create(newMsg);
    newMsg.isComplete = true;
    newMsg.sendStatus = SendStatus.SUCCESS;
    // await saveNewSms(newMsg);
    const created = await SmsModel.create(newMsg);
    // const listSavedMsg = await SmsModel.find();
    console.log('MSG SAVE...', created)
    // console.log('Send Msg successfully...' + message.body);
   } catch (error) {
    newMsg.sendStatus = SendStatus.FAIL;
    console.log('Error when send sms: ', error)
   }
  }

}