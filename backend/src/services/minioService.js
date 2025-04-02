const Minio = require('minio');

// Initialize the MinIO client
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT, // e.g., 'play.min.io'
    port: process.env.MINIO_PORT, // Default MinIO port
    useSSL: false, // Set to true if using HTTPS
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

module.exports = minioClient;