import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("Connected to MongoDB.");
    })
    .catch((error) => {
      console.log(`Error: ${error.message}`);
    }); // Handle error
};

export default connectDB;
