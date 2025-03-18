const express = require("express");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const requestLogger = require("./src/middleware/requestLogging");
const errorHandler = require("./src/middleware/errorHandler");
const userRouter = require("./src/routes/userRoutes");
const chatRoomRouter = require("./src/routes/chatRoomRoutes");
const fileRouter = require("./src/routes/fileRoutes");
const messageRouter = require("./src/routes/messageRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Chat App API!');
  });

// Routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoomRouter);
app.use("/api/message", messageRouter)
app.use("/api/file", fileRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
