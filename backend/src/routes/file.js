import express from "express";
import { 
  upload,
  uploadFileHandler, 
  listFilesHandler, 
  getFileHandler, 
  getFileLinkHandler, 
  downloadFileHandler, 
  deleteFileHandler 
} from "../controllers/fileController.js";

const router = express.Router();

// GET /api/file/test - Basic test route
router.get("/test", (req, res) => {
    res.send("this is test file route");
});

// File upload route
router.post('/upload', upload.single('file'), uploadFileHandler);

// File listing route
router.get('/list/:bucket', listFilesHandler);

// Get file link route
router.get('/link/:bucket/:filename(*)', getFileLinkHandler);

// Download file route
router.get('/download/:bucket/:filename(*)', downloadFileHandler);

// Get/stream file route (must be after other specific routes)
router.get('/:bucket/:filename(*)', getFileHandler);

// Delete file route
router.delete('/:bucket/:filename(*)', deleteFileHandler);

// router.get("/", authenticate, (req, res) => {
//     res.send("this is file route using autentication");
// });

// example cases
// router.post("/adduser", createUser);
// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);
// router.put("/update", verifyJWT, updateUser);
// router.delete("/delete", verifyJWT,  deleteUser);

export default router;
