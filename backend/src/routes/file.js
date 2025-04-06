import express from "express";

import {
    generateUploadUrlHandler,
    getFileHandler,
    listChatroomFilesHandler,
} from "../controllers/fileController.js";


const router = express.Router();

// GET /api/file/test - Basic test route
router.get("/test", (req, res) => {
    res.send("File upload API is working");
});

// Generate presigned URL for file upload and create a record
router.post("/upload/:roomId", generateUploadUrlHandler);

// Get file details with presigned URL for viewing/downloading
router.get("/id/:fileId", getFileHandler);

// List all files in a chatroom
router.get("/room/:roomId", listChatroomFilesHandler);

export default router;
