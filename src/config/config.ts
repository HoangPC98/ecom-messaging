import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, RABBITMQ_URI } = process.env;
const rabbitmqUri = (): string => {
    const user = process.env.RABBITMQ_DEFAULT_USER;
    const pass = process.env.RABBITMQ_DEFAULT_PASS;
    const host = process.env.RABBITMQ_HOST;
    const port = process.env.RABBITMQ_PORT;
    return `amqp://${user}:${pass}@${host}:${port}`;
};

const mongoConnectUri = (): string => {
    const user = process.env.MONGO_USERNAME;
    const pass = process.env.MONGO_PASSWORD;
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const db = process.env.MONGO_DB;
    return `mongodb://${host}:${port}/${db}`;
}

export default {
    MONGO_URI,
    APP_PORT: process.env.APP_PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURI: rabbitmqUri(),
    mongoConnectURI: mongoConnectUri(),
};