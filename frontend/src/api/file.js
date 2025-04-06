import axios from "axios";

import api from "./index.js";


/**
 * Get a presigned URL for file upload
 *
 * @param {string} roomId ID of the chatroom
 * @param {string} userId ID of the uploading user
 * @param {string} filename Original filename
 * @return {Promise<{presignedUrl: string, fileUrl: string}|string>} - URL for upload message
 */
const getUploadPresignedUrl = async (roomId, userId, filename) => {
    try {
        const response = await api.post(
            `/file/upload/${roomId}`,
            {userId: userId, filename: filename},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error getting upload URL:", error);

        return error.response?.data?.error || `Failed to get upload URL: ${error.message}`;
    }
};

/**
 * Get a fresh presigned URL for file download
 *
 * @param {string} fileId Assigned ID of the file
 * @return {Promise<{presignedUrl: string}|string>} - URL for download message
 */
const getDownloadPresignedUrl = async (fileId) => {
    try {
        const response = await api.get(`/file/id/${fileId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting download URL:", error);

        return error.response?.data?.error || `Failed to get download URL: ${error.message}`;
    }
};

/**
 * Upload a file to MinIO using the presigned URL
 *
 * @param {string} presignedUrl The presigned URL for upload
 * @param {File} file The file object to upload
 * @return {Promise<void|string>} - Void or error message
 */
const uploadFileToStorage = async (presignedUrl, file) => {
    try {
    // Use axios directly for external URL, not the api instance
        await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
        });

        return null;
    } catch (error) {
        console.error("Error uploading file:", error);

        return `Failed to upload file: ${error.message}`;
    }
};

export {
    getDownloadPresignedUrl,
    getUploadPresignedUrl,
    uploadFileToStorage,
};
