import mongoose from "mongoose";
import { DB_NAME } from "../constant";

export let dbInstance: typeof mongoose | undefined;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DB_URI}/${DB_NAME}`
        );
        dbInstance = connectionInstance;
        console.log(
            `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
