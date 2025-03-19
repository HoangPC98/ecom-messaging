import mongoose from "mongoose";

export const initMongoConnection = async () => {
  const mongoURI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017';
  try {
    // const mongoConnection = await MongoClient.connect(mongoURI);
    mongoose.connect(mongoURI)
      .then(() => {
        console.log('--> Connect to Mongo Messaging DB successfully');
      })
      .catch(()=>{
        console.log('--> ERROR when connect to mongoDB...')
      })

  } catch (error) {
    console.error(error)
  }
}