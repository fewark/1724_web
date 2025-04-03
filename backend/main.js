import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import errorHandler from "./src/middleware/error.js";
import requestLoggingHandler from "./src/middleware/requestLogging.js";
import authRouter from "./src/routes/auth.js";
import chatRouter from "./src/routes/chat.js";
import fileRouter from "./src/routes/file.js";
import messageRouter from "./src/routes/message.js";
import userRouter from "./src/routes/user.js";
import { setupSocket } from "./src/socket.js";

dotenv.config({
    override: true,
    path: [
        ".env",
        ".env.local",
    ],
});

/**
 * @typedef {object} EnvVars
 * @property {string} DATABASE_URL
 * @property {string} JWT_SECRET
 * @property {string} PORT
 */

/**
 * Parses the environment variables and throws an error if any required
 *
 * @return {EnvVars} The parsed environment variables.
 * @throws {Error} If any required environment variables are missing.
 */
const parseEnv = () => {
    const {
        DATABASE_URL,
        JWT_SECRET,
        PORT,
    } = process.env;
    const requiredEnv = {
        DATABASE_URL,
        JWT_SECRET,
        PORT,
    };

    Object.entries(requiredEnv).forEach(([key, value]) => {
        if ("undefined" === typeof value) {
            throw new Error(`${key} is required in the environment variables`);
        }
    });

    return {
        ...requiredEnv,
    };
};

let app;

/**
 * Initializes the Express app.
 */
const initExpressApp = () => {
    app = express();

    // Middleware
    app.use(express.json());
    app.use(requestLoggingHandler);

    // Basic route
    app.get("/", (req, res) => {
        res.send("Welcome to the Chat App API!");
    });

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/file", fileRouter);
    app.use("/api/message", messageRouter);
    app.use("/api/user", userRouter);

    // Error handling
    app.use(errorHandler);
};

const main = () => {
    const envVars = parseEnv();
    initExpressApp();

    // Create an HTTP server from the Express app.
    const httpServer = createServer(app);

    // Setup Socket.IO for real-time chat functionality.
    setupSocket(httpServer);

    // Start the server.
    httpServer.listen(envVars.PORT, () => {
        console.log(`Server is running on port ${envVars.PORT}`);
    });
};

main();

export default app;