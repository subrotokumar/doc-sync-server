import cors from "cors";
import cookieParse from 'cookie-parser'
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import fs from 'fs'
import requestIp from "request-ip"
import YAML from 'yaml'
import { createServer } from "http";
import { Server } from "socket.io"
import { initializeSocketIO } from "./socket";

const file = fs.readFileSync(path.resolve(__dirname, "../src/swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});
app.set("io", io)

// * Global Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(requestIp.mw());
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParse())

// * App Routes
import healthCheckRoutes from './routes/health.route'
import userRouter from './routes/auth/user.routes'
import documentRouter from './routes/document/document.routes'
import docsRouter from './routes/document/docs.routes'

// * API
app.use("/api/v1/", healthCheckRoutes)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/document", documentRouter)
app.use("/api/v1/docs", docsRouter)

initializeSocketIO(io);

// * Swagger Docs
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            docExpansion: "none",
        },
        customSiteTitle: "Docsync API Documentation",
    })
);

export { httpServer }