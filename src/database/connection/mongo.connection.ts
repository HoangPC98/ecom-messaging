import mongoose from "mongoose";
import  config from "src/config/config";
import logger from "src/utils/logger";
export const initMongoConnection = async () => {
  const mongoURI = config.mongoConnectURI || 'mongodb://localhost:27017';
  try {
    // const mongoConnection = await MongoClient.connect(mongoURI);
    mongoose.connect(mongoURI)
      .then(() => {
        logger.info('--> Connect to Mongo Messaging DB successfully');
      })
      .catch(()=>{
        logger.info('--> ERROR when connect to mongoDB...');
      })
  } catch (error) {
    console.error(error)
  }
}