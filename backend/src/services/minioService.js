import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

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

// Default bucket name for chat files
export const DEFAULT_BUCKET = 'chatui';

/**
 * Ensure that a bucket exists, create it if it doesn't
 * @param {string} bucketName - The name of the bucket
 * @returns {Promise<void>}
 */
export const ensureBucketExists = async (bucketName) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Creating bucket: ${bucketName}`);
      await minioClient.makeBucket(bucketName);
      // Set bucket policy to allow read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`Bucket ${bucketName} created successfully`);
    }
  } catch (err) {
    console.error(`Error ensuring bucket exists: ${err.message}`);
    throw err;
  }
};

/**
 * Generate a file path based on the current date and a random UUID
 * Format: /year/month/day/hour/random-uuid
 * @returns {string} The generated file path
 */
export const generateFilePath = (originalFilename) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');

  // Generate a UUID for uniqueness
  const uuid = uuidv4();
  
  // Build the path - using only the UUID, not appending extension
  return `${year}/${month}/${day}/${hour}/${uuid}`;
};

/**
 * Generate a presigned URL for uploading a file
 * @param {string} originalFilename - Original filename from the client
 * @param {number} expirySeconds - URL expiry time in seconds (default: 600)
 * @returns {Object} Object containing presignedUrl, fileUrl, and objectName
 */
export const generatePresignedUploadUrl = async (originalFilename, expirySeconds = 600) => {
  try {
    // Ensure the default bucket exists
    await ensureBucketExists(DEFAULT_BUCKET);
    
    // Generate a path for the file
    const objectName = generateFilePath(originalFilename);
    
    // Generate a presigned URL for PUT operation
    const presignedUrl = await minioClient.presignedPutObject(
      DEFAULT_BUCKET,
      objectName,
      expirySeconds
    );
    
    // Return the presigned URL and the file URL for storage
    return {
      presignedUrl,
      fileUrl: `/${DEFAULT_BUCKET}/${objectName}`,
      objectName
    };
  } catch (err) {
    console.error(`Error generating presigned upload URL: ${err.message}`);
    throw err;
  }
};

/**
 * Generate a presigned URL for downloading/viewing a file
 * @param {string} bucket - Bucket name
 * @param {string} objectName - Object name in the bucket
 * @param {number} expirySeconds - URL expiry time in seconds (default: 3600)
 * @returns {Promise<string>} Presigned URL
 */
export const getPresignedUrl = async (bucket, objectName, expirySeconds = 3600) => {
  try {
    return await minioClient.presignedGetObject(bucket, objectName, expirySeconds);
  } catch (err) {
    console.error(`Error generating presigned URL for ${bucket}/${objectName}: ${err.message}`);
    throw err;
  }
};

/**
 * Check if a file exists in the bucket
 * @param {string} bucket - Bucket name
 * @param {string} objectName - Object name in the bucket
 * @returns {Promise<boolean>} Whether the file exists
 */
export const fileExists = async (bucket, objectName) => {
  try {
    await minioClient.statObject(bucket, objectName);
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }
    throw err;
  }
};

/**
 * Get file metadata
 * @param {string} bucket - Bucket name
 * @param {string} objectName - Object name in the bucket
 * @returns {Promise<Object>} File metadata
 */
export const getFileMetadata = async (bucket, objectName) => {
  try {
    return await minioClient.statObject(bucket, objectName);
  } catch (err) {
    console.error(`Error getting file metadata for ${bucket}/${objectName}: ${err.message}`);
    throw err;
  }
};

/**
 * Delete a file
 * @param {string} bucket - Bucket name
 * @param {string} objectName - Object name in the bucket
 * @returns {Promise<void>}
 */
export const deleteFile = async (bucket, objectName) => {
  try {
    await minioClient.removeObject(bucket, objectName);
  } catch (err) {
    console.error(`Error deleting file ${bucket}/${objectName}: ${err.message}`);
    throw err;
  }
};

/**
 * Test the connection to the MinIO server
 * @returns {Promise<Object>} List of buckets
 */
export const testConnection = async () => {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('Connected to MinIO server successfully');
    console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    return buckets;
  } catch (err) {
    console.error('Failed to connect to MinIO server:', err);
    throw err;
  }
};

// Test the MinIO connection on module load
(async () => {
  try {
    // Only ensure the default bucket exists
    await ensureBucketExists(DEFAULT_BUCKET);
    await testConnection();
    console.log(`Using only the default bucket: ${DEFAULT_BUCKET}`);
  } catch (err) {
    console.error('MinIO connection test failed:', err);
  }
})();