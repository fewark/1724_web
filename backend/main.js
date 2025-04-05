import dotenv from "dotenv";
import express from "express";

import errorHandler from "./src/middleware/error.js";
import requestLoggingHandler from "./src/middleware/requestLogging.js";
import authRouter from "./src/routes/auth.js";
import chatroomRouter from "./src/routes/chat.js";
import messageRouter from "./src/routes/message.js";
import userRouter from "./src/routes/user.js";


// import fileRouter from "./src/routes/file.js";

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

/**
 * @type {Express}
 */
let app;

/**
 * Initializes the express app.
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
    app.use("/api/chatroom", chatroomRouter);
    app.use("/api/message", messageRouter);
    app.use("/api/user", userRouter);

    // app.use("/api/file", fileRouter);

    // Error handling
    app.use(errorHandler);
};

/**
 * Starts the server.
 */
const main = () => {
    const envVars = parseEnv();
    initExpressApp();

    app.listen(envVars.PORT, () => {
        console.log(`Server is running on port ${envVars.PORT}`);
    });
};

main();

export default app;
