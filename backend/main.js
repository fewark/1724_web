import {createServer} from "node:http";

import dotenv from "dotenv";
import express from "express";
import {Server} from "socket.io";

import errorHandler from "./src/middleware/error.js";
import requestLoggingHandler from "./src/middleware/requestLogging.js";
import createChatroomRouter from "./src/routes/chatroom.js";
import fileRouter from "./src/routes/file.js";
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
 * Initialize the Express.js app and use it to create an Express server with Socket.io support,
 * middleware, routes, and error handling.
 *
 * @return {Server} The initialized HTTP server.
 */
const initExpressServer = () => {
    app = express();
    const server = createServer(app);
    const io = new Server(server);

    // Middleware
    app.use(express.json());
    app.use(requestLoggingHandler);

    // Basic route
    app.get("/", (req, res) => {
        res.send("Welcome to the Chatroom App API!");
    });

    // Routes
    app.use("/api/chatroom", createChatroomRouter(io));
    app.use("/api/message", messageRouter);
    app.use("/api/user", userRouter);
    app.use("/api/file", fileRouter);

    // Error handling
    app.use(errorHandler);

    return server;
};

/**
 * Starts the server.
 */
const main = () => {
    const envVars = parseEnv();
    const server = initExpressServer();

    server.listen(envVars.PORT, () => {
        console.log(`Server is running on port ${envVars.PORT}`);
    });
};

main();

export default app;
