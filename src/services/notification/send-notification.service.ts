import { NotificationDocument, NotificationModel } from "../../database/models/notification.model";
import { SendStatus } from "../../enums/common.enum";
import { Logger } from "../common/logger";
import { FirebaseMessagingProvider } from "../providers/firebase-messaging.provider";
export class NotificationService {
  protected notifier: FirebaseMessagingProvider;
  protected logger: Logger;
  constructor() {
    this.notifier = FirebaseMessagingProvider.getInstance();
    this.logger = Logger.getInstance();
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
  ): Promise<void> {
    try {

      const sendResult = await this.notifier.sendNotification(token, title, body);
      const newNotification: NotificationDocument = {
        code: sendResult,
        from: 'system',
        to: token,
        body: body,
        sendStatus: SendStatus.SUCCESS,
        isSystem: true,
        type: 'direct'
      }
      await NotificationModel.create(newNotification);
      this.logger.info('Notification sent successfully', {
        sendResult,
        title,
        body,
      });
    } catch (error) {
      this.logger.error('Error sending notification', {
        error,
        title,
        body,
      });
    }
  }
}