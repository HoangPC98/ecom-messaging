import mongoose from "mongoose";
import  config from "../../config/config";

export const initMongoConnection = async () => {
  const mongoURI = config.mongoConnectURI || 'mongodb://localhost:27017';
  try {
    // const mongoConnection = await MongoClient.connect(mongoURI);
    mongoose.connect(mongoURI)
      .then(() => {
        console.log('--> Connect to Mongo Messaging DB successfully');
      })
      .catch(()=>{
        console.log('--> ERROR when connect to mongoDB...');
      })
  } catch (error) {
    console.error(error)
  }
}