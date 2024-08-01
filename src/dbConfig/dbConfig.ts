import mongoose, { connection } from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to DB");
    });

    connection.on("error", (error) => {
        console.log("Error connecting to DB");
        console.log(error);
        process.exit();
      });

  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }
};
