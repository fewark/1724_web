import api from "./index.js";
import axios from "axios";

/**
 * Get a presigned URL for file upload
 * @param {string} roomId - ID of the chatroom
 * @param {string} userId - ID of the user
 * @param {string} filename - Original filename
 * @returns {Promise<{presignedUrl: string, fileUrl: string}|string>} - Presigned URL for upload or error message
 */
export const getUploadPresignedUrl = async (roomId, userId, filename) => {
  try {
    const response = await api.post(
      `/file/upload/${roomId}`,
      { userId: userId, filename: filename },
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
 * @param {string} fileId - ID of the file
 * @returns {Promise<{presignedUrl: string}|string>} - Presigned URL for download or error message
 */
export const getDownloadPresignedUrl = async (fileId) => {
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
 * @param {string} presignedUrl - The presigned URL for upload
 * @param {File} file - The file object to upload
 * @returns {Promise<void|string>} - Void or error message
 */
export const uploadFileToStorage = async (presignedUrl, file) => {
  try {
    // Use axios directly for external URL, not the api instance
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      }
    });
    return null;
  } catch (error) {
    console.error("Error uploading file:", error);
    return `Failed to upload file: ${error.message}`;
  }
};