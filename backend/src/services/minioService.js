import { Client } from 'minio';
import fs from 'fs';
import path from 'path';

// Initialize the MinIO client with environment variables or defaults
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

// Log connection parameters without exposing secrets
console.log(`MinIO client initialized with endpoint: ${process.env.MINIO_ENDPOINT || 'localhost'}, port: ${process.env.MINIO_PORT || '9000'}, useSSL: ${process.env.MINIO_USE_SSL === 'true'}`);

// Create a bucket if it doesn't exist
const ensureBucketExists = async (bucketName) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created successfully`);
    }
    return true;
  } catch (err) {
    console.error('Error ensuring bucket exists:', err);
    throw err;
  }
};

// Upload a file from local path
const uploadFile = async (bucketName, filePath, objectName = null) => {
  try {
    // If no objectName is provided, use the basename of the file
    if (!objectName) {
      objectName = path.basename(filePath);
    }

    await ensureBucketExists(bucketName);
    
    // Upload the file
    const etag = await minioClient.fPutObject(bucketName, objectName, filePath);
    console.log(`File uploaded successfully to ${bucketName}/${objectName}`);
    
    // Generate a URL to access the file
    const url = await minioClient.presignedGetObject(bucketName, objectName, 24*60*60); // 24 hour expiry
    
    return {
      etag,
      objectName,
      bucket: bucketName,
      url
    };
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

// Upload a buffer/stream directly
const uploadBuffer = async (bucketName, buffer, objectName, contentType = 'application/octet-stream') => {
  try {
    await ensureBucketExists(bucketName);
    
    // Upload the buffer
    const etag = await minioClient.putObject(bucketName, objectName, buffer, contentType);
    console.log(`Buffer uploaded successfully to ${bucketName}/${objectName}`);
    
    // Generate a URL to access the file
    const url = await minioClient.presignedGetObject(bucketName, objectName, 24*60*60); // 24 hour expiry
    
    return {
      etag,
      objectName,
      bucket: bucketName,
      url
    };
  } catch (err) {
    console.error('Error uploading buffer:', err);
    throw err;
  }
};

// Get file as a stream
const getFileStream = async (bucketName, objectName) => {
  try {
    // Check if the object exists
    await minioClient.statObject(bucketName, objectName);
    
    // Get the file stream
    const stream = await minioClient.getObject(bucketName, objectName);
    return stream;
  } catch (err) {
    console.error(`Error getting file stream for ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// Get file as a buffer
const getFileBuffer = async (bucketName, objectName) => {
  try {
    const stream = await getFileStream(bucketName, objectName);
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  } catch (err) {
    console.error(`Error getting file buffer for ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// Download file to local path
const downloadFile = async (bucketName, objectName, filePath) => {
  try {
    await minioClient.fGetObject(bucketName, objectName, filePath);
    console.log(`File downloaded successfully from ${bucketName}/${objectName} to ${filePath}`);
    return filePath;
  } catch (err) {
    console.error(`Error downloading file ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// Get file metadata
const getFileMetadata = async (bucketName, objectName) => {
  try {
    const stat = await minioClient.statObject(bucketName, objectName);
    return stat;
  } catch (err) {
    console.error(`Error getting metadata for ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// Generate a presigned URL for downloading a file
const getPresignedGetUrl = async (bucketName, objectName, expirySeconds = 24 * 60 * 60) => {
  try {
    const url = await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);
    return url;
  } catch (err) {
    console.error(`Error generating presigned URL for ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// Generate a presigned URL for uploading a file
const getPresignedPutUrl = async (bucketName, objectName, expirySeconds = 60 * 60) => {
  try {
    await ensureBucketExists(bucketName);
    
    const url = await minioClient.presignedPutObject(bucketName, objectName, expirySeconds);
    return url;
  } catch (err) {
    console.error(`Error generating upload URL for ${bucketName}/${objectName}:`, err);
    throw err;
  }
};

// List all files in a bucket
const listFiles = async (bucketName, prefix = '', recursive = true) => {
  try {
    await ensureBucketExists(bucketName);
    
    const stream = minioClient.listObjects(bucketName, prefix, recursive);
    const files = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        files.push(obj);
      });
      
      stream.on('end', () => {
        resolve(files);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (err) {
    console.error('Error listing files:', err);
    throw err;
  }
};

// Delete a file
const deleteFile = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    console.log(`File ${objectName} deleted from ${bucketName}`);
    return true;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

// Check if a file exists
const fileExists = async (bucketName, objectName) => {
  try {
    await minioClient.statObject(bucketName, objectName);
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }
    throw err;
  }
};

// Export all functions
export {
  minioClient,
  uploadFile,
  uploadBuffer,
  getFileStream,
  getFileBuffer,
  downloadFile,
  getFileMetadata,
  getPresignedGetUrl,
  getPresignedPutUrl,
  listFiles,
  deleteFile,
  fileExists,
  ensureBucketExists
};