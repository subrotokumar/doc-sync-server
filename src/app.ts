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
import rateLimit from "express-rate-limit";
import promClient from "prom-client"
import { ApiError } from "./utils/ApiError";

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

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

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(requestIp.mw());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
        return req.clientIp ?? ""
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(
            options.statusCode || 500,
            `There are too many requests. You are only allowed ${options.max
            } requests per ${options.windowMs / 60000} minutes`
        );
    },
});

app.use(limiter);
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

// * Prom client setup

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", promClient.register.contentType)
    const metrics = await promClient.register.metrics();
    res.send(metrics)
})

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