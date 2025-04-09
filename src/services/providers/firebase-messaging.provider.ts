import admin from 'firebase-admin';
import serviceAccount from 'src/secrets/ecom-messaging-firebase-adminsdk.json';
import logger from 'src/utils/logger';
export class FirebaseMessagingProvider {
  private static instance: FirebaseMessagingProvider;
  private constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  public static getInstance(): FirebaseMessagingProvider {
    if (!FirebaseMessagingProvider.instance) {
      FirebaseMessagingProvider.instance = new FirebaseMessagingProvider();
    }
    return FirebaseMessagingProvider.instance;
  }

  public async sendNotification(
    token: string,
    title: string,
    body: string,
  ): Promise<string> {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    // try {
    const notificationSent = await admin.messaging().send(message);
    logger.info('Notification sent successfully');
    return notificationSent;
    // } catch (error) {
    //   console.error('Error sending notification:', error);
    // }
  }
}