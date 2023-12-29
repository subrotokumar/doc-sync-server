import cors from "cors";
import express, { urlencoded } from "express";
import { createServer } from "http";
import path from "path";
import swaggerUi from "swagger-ui-express";
import fs from 'fs'
import YAML from 'yaml'
import cookieParse from 'cookie-parser'

const file = fs.readFileSync(path.resolve(__dirname, "../src/swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const app = express()
const httpServer = createServer(app)

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParse())

//*health-check

import healthCheckRoutes from './routes/health.route'
app.use("/api/v1/", healthCheckRoutes)


import userRouter from './routes/user/user.routes'
app.use("/api/v1/user", userRouter)

import documentRouter from './routes/document/document.routes'
app.use("/api/v1/document", documentRouter)

import docsRouter from './routes/docs/docs.routes'
app.use("/api/v1/docs", docsRouter)

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            docExpansion: "none", // keep all the sections collapsed by default
        },
        customSiteTitle: "FreeAPI docs",
    })
);

export { httpServer }