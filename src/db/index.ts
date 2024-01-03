import mongoose from "mongoose";
import { DB_NAME } from "../constant";

export let dbInstance: typeof mongoose | undefined;

const connectDB = async () => {
    const connectionUri = `${process.env.DB_URI}/${DB_NAME}`
    try {
        const connectionInstance = await mongoose.connect(connectionUri);
        dbInstance = connectionInstance;
        console.log(
            `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(connectionUri)
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
