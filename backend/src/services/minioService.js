import dotenv from "dotenv";
import {Client} from "minio";
import {v4 as uuidv4} from "uuid";


// eslint-disable-next-line no-warning-comments

// Initialize the MinIO client with environment variables or defaults
const minioClient = new Client({
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000", 10),
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    useSSL: "true" === process.env.MINIO_USE_SSL,
});

// Log connection parameters without exposing secrets
console.log(
    `MinIO client initialized with endpoint: ${process.env.MINIO_ENDPOINT || "localhost"}, 
    port: ${process.env.MINIO_PORT || "9000"}, useSSL: ${"true" === process.env.MINIO_USE_SSL}`
);

// Default bucket name for chat files
const DEFAULT_BUCKET = "chatui";

/**
 * Checks if a bucket exists and creates it if not, also sets appropriate read permissions
 *
 * @param {string} bucketName Name of the bucket to check/create
 * @return {Promise<void>}
 * @throws {Error} If there's an error during bucket creation or policy setting
 */
const ensureBucketExists = async (bucketName) => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            console.log(`Creating bucket: ${bucketName}`);
            await minioClient.makeBucket(bucketName);

            // Set bucket policy to allow read access
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {AWS: ["*"]},
                        Action: ["s3:GetObject"],
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
 * Generates a hierarchical file path based on current date and random UUID
 * Format: /year/month/day/hour/random-uuid
 *
 * @return {string} The generated hierarchical file path
 */
const generateFilePath = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");

    // Generate a UUID for uniqueness
    const uuid = uuidv4();

    // Build the path - using only the UUID, not appending extension
    return `${year}/${month}/${day}/${hour}/${uuid}`;
};

/**
 * Generates a presigned URL for file upload with specified expiry time
 *
 * @param {string} originalFilename Original filename from the client
 * @param {number} [expirySeconds] URL expiry time in seconds
 * @return {Promise<object>} Object containing presignedUrl, fileUrl and objectName
 * @throws {Error} If URL generation fails
 */
const generatePresignedUploadUrl = async (originalFilename, expirySeconds = 600) => {
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
            presignedUrl: presignedUrl,
            fileUrl: `/${DEFAULT_BUCKET}/${objectName}`,
            objectName: objectName,
        };
    } catch (err) {
        console.error(`Error generating presigned upload URL: ${err.message}`);
        throw err;
    }
};

/**
 * Generates a presigned URL for file download with specified expiry time
 *
 * @param {string} bucket Name of the bucket containing the object
 * @param {string} objectName Name of the object to generate URL for
 * @param {number} [expirySeconds] URL expiry time in seconds
 * @return {Promise<string>} Presigned URL for accessing the object
 * @throws {Error} If URL generation fails
 */
const getPresignedUrl = async (bucket, objectName, expirySeconds = 3600) => {
    try {
        return await minioClient.presignedGetObject(bucket, objectName, expirySeconds);
    } catch (err) {
        console.error(`Error generating presigned URL for ${bucket}/${objectName}: ${err.message}`);
        throw err;
    }
};

/**
 * Checks if a specific file exists in the specified bucket
 *
 * @param {string} bucket Name of the bucket to check
 * @param {string} objectName Name of the object to check
 * @return {Promise<boolean>} True if file exists, false otherwise
 * @throws {Error} For any error other than "not found"
 */
const fileExists = async (bucket, objectName) => {
    try {
        await minioClient.statObject(bucket, objectName);

        return true;
    } catch (err) {
        if ("NotFound" === err.code) {
            return false;
        }
        throw err;
    }
};

/**
 * Retrieves metadata for a specific file in a bucket
 *
 * @param {string} bucket Name of the bucket containing the file
 * @param {string} objectName Name of the file to get metadata for
 * @return {Promise<object>} File metadata object
 * @throws {Error} If metadata retrieval fails
 */
const getFileMetadata = async (bucket, objectName) => {
    try {
        return await minioClient.statObject(bucket, objectName);
    } catch (err) {
        console.error(`Error getting file metadata for ${bucket}/${objectName}: ${err.message}`);
        throw err;
    }
};


/**
 * Tests the connection to MinIO server by listing available buckets
 *
 * @return {Promise<object>} List of available buckets
 * @throws {Error} If connection test fails
 */
const testConnection = async () => {
    try {
        const buckets = await minioClient.listBuckets();
        console.log("Connected to MinIO server successfully");
        console.log("Available buckets:", buckets.map((b) => b.name).join(", "));

        return buckets;
    } catch (err) {
        console.error("Failed to connect to MinIO server:", err);
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
        console.error("MinIO connection test failed:", err);
    }
})();

// Export all functions at the bottom
export {
    DEFAULT_BUCKET,
    ensureBucketExists,
    fileExists,
    generateFilePath,
    generatePresignedUploadUrl,
    getFileMetadata,
    getPresignedUrl,
    testConnection,
};
