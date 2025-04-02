
// example code for generating a presigned URL for file upload
exports.generatePresignedUrl = async (method, bucketName, objectName) => {
    const expires = 24 * 60 * 60; // URL expiration time in seconds (1 day)

    try {
        const presignedUrl = await minioClient.presignedUrl(method, bucketName, objectName, expires);
        return presignedUrl;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw new Error('Error generating presigned URL');
    }
};