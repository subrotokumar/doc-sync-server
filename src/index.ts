import { config } from "dotenv";
import { httpServer } from "./app";
import connectDB from "./db";
config()
const startServer = () => {
    httpServer.listen(process.env.PORT || 8080, () => {
        console.info(
            `📑 Visit the documentation at: http://localhost:${process.env.PORT || 8080}/docs`
        );
        console.log(`⚙️  Server is running on http://localhost:${process.env.PORT || 8080}/api/v1/`);
    });
};

const main = async () => {
    try {
        await connectDB();
        startServer();
    } catch (err) {
        console.log("Mongo db connect error: ", err);
    }
}

main()