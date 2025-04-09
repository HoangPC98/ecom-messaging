import logger from "pino";
const childLogger = logger({
  name: "ecom-messaging",
  level: process.env.LOG_LEVEL || "info",
});

export class Logger {
  private static instance: Logger;
  private logger: any;

  private constructor() {
    this.logger = logger({
      name: "ecom-messaging",
      level: process.env.LOG_LEVEL || "info",
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true, // Enable colors
          translateTime: 'SYS:standard', // Format timestamp
          ignore: 'pid,hostname', // Ignore unnecessary fields
        },
      },
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
  public fatal(message: string, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }
}