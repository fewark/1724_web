import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { 
  uploadFile, 
  uploadBuffer, 
  getFileStream, 
  getPresignedGetUrl,
  fileExists, 
  getFileMetadata,
  downloadFile,
  deleteFile,
  listFiles
} from '../services/minioService.js';

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

// Default bucket name
export const DEFAULT_BUCKET = 'chat-uploads';

/**
 * Upload a file
 * 
 * This function handles the uploading of a file to a specified bucket in MinIO.
 * 
 * Usage:
 * - Send a POST request to the endpoint with the file included in the form-data under the key 'file'.
 * - Optionally, you can specify the bucket name, folder, and custom filename in the request body.
 * 
 * Example:
 * {
 *   "bucket": "my-bucket",
 *   "folder": "my-folder",
 *   "filename": "custom-name.txt"
 * }
 */
export const uploadFileHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    
    // Optional customization from request
    const bucket = req.body.bucket || DEFAULT_BUCKET;
    const folder = req.body.folder || '';
    const customFilename = req.body.filename;
    
    // Generate a unique filename if not provided
    const filename = customFilename || 
      `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Create object name with folder if provided
    const objectName = folder 
      ? `${folder.replace(/\/$/, '')}/${filename}`
      : filename;
    
    // Upload the file directly from buffer
    const result = await uploadBuffer(bucket, buffer, objectName, mimetype);
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        name: filename,
        originalName: originalname,
        path: objectName,
        url: result.url,
        type: mimetype,
        bucket: bucket
      }
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload file', details: err.message });
  }
};

/**
 * List files in a bucket
 * 
 * This function retrieves a list of files from a specified bucket in MinIO.
 * 
 * Usage:
 * - Send a GET request to the endpoint with the bucket name as a URL parameter.
 * - Optionally, you can specify a prefix query parameter to filter the results.
 * 
 * Example:
 * GET /api/file/list/my-bucket?prefix=my-folder/
 */
export const listFilesHandler = async (req, res) => {
  try {
    const { bucket } = req.params;
    const prefix = req.query.prefix || '';
    
    // List files in the bucket
    const files = await listFiles(bucket, prefix);
    
    // Transform files for response
    const transformedFiles = await Promise.all(files.map(async (file) => {
      // Get a presigned URL for each file
      const url = await getPresignedGetUrl(bucket, file.name, 3600); // 1 hour expiry
      
      return {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        url
      };
    }));
    
    res.json(transformedFiles);
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).json({ error: 'Failed to list files', details: err.message });
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
    const { bucket, filename } = req.params;
    
    // Check if file exists
    const exists = await fileExists(bucket, filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file metadata
    const metadata = await getFileMetadata(bucket, filename);
    
    // Set headers
    res.setHeader('Content-Type', metadata.metaData['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Length', metadata.size);
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filename)}"`);
    
    // Stream the file directly to response
    const fileStream = await getFileStream(bucket, filename);
    fileStream.pipe(res);
    
  } catch (err) {
    console.error('Error streaming file:', err);
    res.status(500).json({ error: 'Failed to stream file', details: err.message });
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
 * Download a file to server and send it to client
 * 
 * This function downloads a file to a temporary location on the server and then sends it to the client.
 * 
 * Usage:
 * - Send a GET request to the endpoint with the bucket name and filename as URL parameters.
 * 
 * Example:
 * GET /api/file/download/my-bucket/my-file.txt
 */
export const downloadFileHandler = async (req, res) => {
  try {
    const { bucket, filename } = req.params;
    const tempFilePath = path.join(tempDir, path.basename(filename));
    
    // Check if file exists
    const exists = await fileExists(bucket, filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Download the file to a temporary location
    await downloadFile(bucket, filename, tempFilePath);
    
    // Send the file
    res.download(tempFilePath, path.basename(filename), async (err) => {
      // Clean up the temporary file after sending
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkErr) {
        console.error('Error deleting temporary file:', unlinkErr);
      }
      
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ error: 'Failed to download file', details: err.message });
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
    const { bucket, filename } = req.params;
    
    // Check if file exists
    const exists = await fileExists(bucket, filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete the file
    await deleteFile(bucket, filename);
    
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Failed to delete file', details: err.message });
  }
};