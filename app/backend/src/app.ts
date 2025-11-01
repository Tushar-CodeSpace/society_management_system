import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import pino from "pino";
import authRouter from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/errors.middleware";

const app = express();

const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

app.use(pinoHttp({ logger }));
app.use(helmet());

app.use(
    cors({
        origin: (process.env.CORS_ORIGIN || "")
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean),
        credentials: true
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        limit: 100,
        standardHeaders: "draft-7",
        legacyHeaders: false
    })
);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// auth + profile
app.use("/", authRouter);

// 404 + error
app.use(notFound);
app.use(errorHandler);

export default app;
