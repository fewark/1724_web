import express from "express";
import { 
  getFileHandler, 
  deleteFileHandler,
  generateUploadUrlHandler,
  listChatroomFilesHandler
} from "../controllers/fileController.js";

const router = express.Router();

// GET /api/file/test - Basic test route
router.get("/test", (req, res) => {
    res.send("File upload API is working");
});

// Generate presigned URL for file upload and create a record
router.post('/upload/:roomId', generateUploadUrlHandler);

// Get file details with presigned URL for viewing/downloading
router.get('/id/:fileId', getFileHandler);

// Delete file by ID
router.delete('/id/:fileId', deleteFileHandler);

// List all files in a chatroom
router.get('/room/:roomId', listChatroomFilesHandler);

export default router;
