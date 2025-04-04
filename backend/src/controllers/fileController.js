import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { 
  fileExists, 
  getFileMetadata,
  deleteFile,
  generatePresignedUploadUrl,
  getPresignedUrl,
  DEFAULT_BUCKET
} from '../services/minioService.js';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// For temp file storage if needed
const tempDir = path.join(__dirname, '../../temp');
// Create temp directory if it doesn't exist
try {
  await fs.mkdir(tempDir, { recursive: true });
} catch (err) {
  console.error('Error creating temp directory:', err);
}

// Initialize Prisma client
const prisma = new PrismaClient();


/**
 * Generate a presigned URL for file upload and create a database record
 * POST /api/file/upload/:roomId
 */
export const generateUploadUrlHandler = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the request or from auth middleware
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
      where: { id: parseInt(roomId) }
    });
    
    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }
    
    // Get filename from request
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }
    
    // Generate presigned URL for upload
    const { presignedUrl, fileUrl, objectName } = await generatePresignedUploadUrl(filename);
    
    // Create a database record for the file
    const file = await prisma.file.create({
      data: {
        userId: parseInt(userId),
        chatroomId: parseInt(roomId),
        fileUrl: fileUrl,
      }
    });
    
    // Return the presigned URL and file information
    res.status(200).json({
      id: file.id,
      presignedUrl,
      fileUrl,
      objectName,
      bucket: DEFAULT_BUCKET,
      expiresIn: 600, // 10 minutes in seconds
      uploadMethod: 'PUT' // Let frontend know to use PUT method for upload
    });
  } catch (err) {
    console.error('Error generating upload URL:', err);
    res.status(500).json({ 
      error: 'Failed to generate upload URL', 
      details: err.message 
    });
  }
};

/**
 * Download a file directly
 * 
 * This function streams a file directly to the client from a specified bucket in MinIO.
 * 
 * Usage:
 * - Send a GET request to the endpoint with the bucket name and filename as URL parameters.
 * 
 * Example:
 * GET /api/file/my-bucket/my-file.txt
 */
export const getFileHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Get file from database
    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Extract object name from fileUrl (format: /bucket/objectName)
    const urlParts = file.fileUrl.split('/');
    const bucket = urlParts[1];
    const objectName = urlParts.slice(2).join('/');
    
    // Check if file exists in storage
    const exists = await fileExists(bucket, objectName);
    
    if (!exists) {
      // Update database record to mark file as deleted/unavailable
      await prisma.file.update({
        where: { id: parseInt(fileId) },
        data: { fileUrl: null }
      });
      
      return res.status(404).json({ 
        error: 'File not found in storage', 
        details: 'The file record exists but the actual file is missing' 
      });
    }
    
    // Get file metadata
    const metadata = await getFileMetadata(bucket, objectName);
    
    // Generate a presigned URL for accessing the file
    const presignedUrl = await getPresignedUrl(bucket, objectName);
    
    // Return file information with presigned URL
    res.status(200).json({
      id: file.id,
      userId: file.userId,
      chatroomId: file.chatroomId,
      fileUrl: file.fileUrl,
      presignedUrl,
      uploadedBy: file.user.username,
      uploadedAt: file.createdAt,
      size: metadata.size,
      contentType: metadata.metaData['content-type'] || 'application/octet-stream',
      expiresIn: 3600 // 1 hour in seconds
    });
  } catch (err) {
    console.error('Error getting file:', err);
    res.status(500).json({ 
      error: 'Failed to get file', 
      details: err.message 
    });
  }
};

/**
 * Get a download link for a file
 * 
 * This function generates a presigned URL for a file, allowing temporary access to it.
 * 
 * Usage:
 * - Send a GET request to the endpoint with the bucket name and filename as URL parameters.
 * - Optionally, specify an expiry time in seconds as a query parameter.
 * 
 * Example:
 * GET /api/file/link/my-bucket/my-file.txt?expiry=3600
 */
export const getFileLinkHandler = async (req, res) => {
  try {
    const { bucket, filename } = req.params;
    const expirySeconds = parseInt(req.query.expiry || '3600', 10); // Default: 1 hour
    
    // Check if file exists
    const exists = await fileExists(bucket, filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate a presigned URL
    const url = await getPresignedGetUrl(bucket, filename, expirySeconds);
    
    // Get file metadata
    const metadata = await getFileMetadata(bucket, filename);
    
    res.json({
      url,
      filename: path.basename(filename),
      contentType: metadata.metaData['content-type'] || 'application/octet-stream',
      size: metadata.size,
      expiresIn: expirySeconds
    });
  } catch (err) {
    console.error('Error generating download link:', err);
    res.status(500).json({ error: 'Failed to generate download link', details: err.message });
  }
};

/**
 * Delete a file
 * 
 * This function deletes a specified file from a bucket in MinIO.
 * 
 * Usage:
 * - Send a DELETE request to the endpoint with the bucket name and filename as URL parameters.
 * 
 * Example:
 * DELETE /api/file/my-bucket/my-file.txt
 */
export const deleteFileHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the request or from auth middleware
    
    // Get file from database
    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) }
    });
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if user is the owner of the file
    if (file.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'You do not have permission to delete this file' });
    }
    
    // Extract object name from fileUrl (format: /bucket/objectName)
    const urlParts = file.fileUrl.split('/');
    const bucket = urlParts[1];
    const objectName = urlParts.slice(2).join('/');
    
    // Delete file from storage
    try {
      await deleteFile(bucket, objectName);
    } catch (storageErr) {
      console.error('Error deleting file from storage:', storageErr);
      // Continue even if file doesn't exist in storage
    }
    
    // Delete file record from database
    await prisma.file.delete({
      where: { id: parseInt(fileId) }
    });
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ 
      error: 'Failed to delete file', 
      details: err.message 
    });
  }
};

/**
 * List files in a chatroom
 * GET /api/file/room/:roomId
 */
export const listChatroomFilesHandler = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Check if the chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
      where: { id: parseInt(roomId) }
    });
    
    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }
    
    // Get files from database
    const files = await prisma.file.findMany({
      where: { chatroomId: parseInt(roomId) },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format response
    const formattedFiles = files.map(file => ({
      id: file.id,
      userId: file.userId,
      uploadedBy: file.user.username,
      fileUrl: file.fileUrl,
      uploadedAt: file.createdAt
    }));
    
    res.status(200).json(formattedFiles);
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).json({ 
      error: 'Failed to list files', 
      details: err.message 
    });
  }
};