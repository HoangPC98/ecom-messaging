import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
import { SmsServive } from "./sms/send-sms.service";

class RmqConsumerService {
  private sendSMSQueue = 'QUEUE_SEND_SMS';
  private sendEmailQueue = 'QUEUE_SEND_MAIL';
  private pushNotificationQueue = 'QUEUE_PUSH_NOTIF';
  // private connection!: Connection;
  private channel!: Channel;
  public readonly DIRECT_EXCH = 'direct_exchange';
  public readonly RK_SMS_01 = 'rk_sms_01'
  private readonly smsService: SmsServive;

  constructor() {
    this.init();
    this.smsService = new SmsServive();
  }

  async init() {
    // Establish connection to RabbitMQ server
    const connection = await amqp.connect(config.msgBrokerURI);
    this.channel = await connection.createChannel();
    this.channel.assertExchange(this.DIRECT_EXCH, 'direct', {
      durable: false
    });
    // this.consumeQueueSMS();
    this.consumeRkeySMS();
    // this.consumeEmail();
    this.consumeNotification();
  }

  // async consumeQueueBName(queueName: string) {
  //   await this.channel.assertQueue(this.sendSMSQueue, { durable: true });
  //   this.channel.consume(this.sendSMSQueue, async (msg) => {
  //     if (msg) {
  //       console.log(`Consume Msg from Queue: ${this.sendEmailQueue}`, msg?.content.toString())
  //       // Acknowledge the processed message
  //       this.channel.ack(msg);
  //     }
  //   })
  // }

  async assertQueues(queues: string[]) {
    await Promise.all(queues.map(queue => {
      this.channel.assertQueue(queue, { durable: true })
    }))
    console.log(`--> Assert Queue... \n + ${queues.join('\n + ')}`)

  }

  async consumeQueues(queues: string[]){
    await Promise.all(queues.map(queue=>{
      this.channel.consume(queue, async (msg)=>{
        if (msg) {
          console.log(`Consume Msg from Queue: ${queue}`, msg?.content.toString())
          // this.channel.ack(msg);
        }
      })
    }))
  }

  async consumeRkeySMS() {
    await this.channel.assertQueue(this.sendSMSQueue, { durable: true });
    this.channel.bindQueue(this.sendSMSQueue, this.DIRECT_EXCH, this.RK_SMS_01);
    this.channel.consume(this.sendSMSQueue, async (msg) => {
      if (msg) {
        let content =  JSON.parse(msg.content.toString())
        console.log(`Consume Msg from Queue: ${this.sendSMSQueue}`, msg?.content.toString())
        // Acknowledge the processed message
        this.channel.ack(msg);
        await this.smsService.consumeMsg(content)
      }
    })
  }

  async consumeQueueSMS() {
    await this.channel.assertQueue(this.sendSMSQueue, { durable: true });
    this.channel.consume(this.sendSMSQueue, async (msg) => {
      if (msg) {
        let content =  JSON.parse(msg.content.toString())
        console.log(`Consume Msg from Queue: ${this.sendSMSQueue}`, msg?.content.toString())
        // Acknowledge the processed message
        this.channel.ack(msg);
        await this.smsService.consumeMsg(content)
      }
    })
  }

  async consumeEmail() {
    // await this.channel.assertQueue(this.sendEmailQueue, { durable: true });
    this.channel.consume(this.sendEmailQueue, async (msg) => {
      if (msg) {
        console.log('QUEUE_EMAIL...', msg?.content.toString())
        this.channel.ack(msg);
      }
    })
  }

  async consumeNotification() {
    await this.channel.assertQueue(this.pushNotificationQueue, { durable: true });
    this.channel.consume(this.pushNotificationQueue, async (msg) => {
      if (msg) {
        console.log('QUEUE_NOTIFICATION...', msg?.content.toString())
        this.channel.ack(msg);
      }
    })
  }

  async consumeNotificationByKey() {
    await this.channel.assertQueue('', { durable: true });
    await this.channel.bindQueue('', '1234', 'hoangpc'),
      this.channel.consume('', async (msg) => {
        if (msg) {
          console.log('QUEUE_NONE...', msg?.content.toString().toString())
          this.channel.ack(msg);
        }
      })
  }
}

export const rmqConsumerService = new RmqConsumerService();