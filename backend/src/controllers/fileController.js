import {PrismaClient} from "@prisma/client";
import fs from "fs/promises";
import multer from "multer";
import path, {dirname} from "path";
import {fileURLToPath} from "url";

import {
    deleteFile,
    fileExists,
    generatePresignedUploadUrl,
    getFileMetadata,
    getPresignedUrl,
} from "../services/minioService.js";


// Constants
const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * KILOBYTE;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * MEGABYTE;
const DEFAULT_EXPIRY_SECONDS = 3600;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_SUCCESS = 200;
const HTTP_SERVER_ERROR = 500;
const OCTET_STREAM = "application/octet-stream";

// Get directory paths
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const multerConfig = {
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
};

// For temp file storage if needed
const tempDir = path.join(currentDir, "../../temp");

// Create temp directory if it doesn't exist
try {
    await fs.mkdir(tempDir, {recursive: true});
} catch (err) {
    console.error("Error creating temp directory:", err);
}

// Initialize Prisma client
const prisma = new PrismaClient();


const generateUploadUrl = async (req, res) => {
    try {
        const {roomId} = req.params;
        const {userId} = req.body;

        if (!roomId) {
            return res.status(HTTP_BAD_REQUEST).json({error: "Room ID is required"});
        }

        if (!userId) {
            return res.status(HTTP_BAD_REQUEST).json({error: "User ID is required"});
        }

        const chatroom = await prisma.chatroom.findUnique({
            where: {id: Number(roomId)},
        });

        if (!chatroom) {
            return res.status(HTTP_NOT_FOUND).json({error: "Chatroom not found"});
        }

        const {filename} = req.body;

        if (!filename) {
            return res.status(HTTP_BAD_REQUEST).json({error: "Filename is required"});
        }

        const uploadResult = await generatePresignedUploadUrl(filename);

        await prisma.file.create({
            data: {
                userId: Number(userId),
                chatroomId: Number(roomId),
                fileUrl: uploadResult.fileUrl,
            },
        });

        return res.status(HTTP_SUCCESS).json({presignedUrl: uploadResult.presignedUrl});
    } catch (err) {
        console.error("Error generating upload URL:", err);

        return res.status(HTTP_SERVER_ERROR).json({
            error: "Failed to generate upload URL",
            details: err.message,
        });
    }
};


const getFile = async (req, res) => {
    try {
        const {fileId} = req.params;

        const file = await prisma.file.findUnique({
            where: {id: Number(fileId)},
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        if (!file) {
            return res.status(HTTP_NOT_FOUND).json({error: "File not found"});
        }

        const [, bucket,
            ...objectParts] = file.fileUrl.split("/");
        const objectName = objectParts.join("/");

        const exists = await fileExists(bucket, objectName);

        if (!exists) {
            await prisma.file.update({
                where: {id: Number(fileId)},
                data: {fileUrl: null},
            });

            return res.status(HTTP_NOT_FOUND).json({
                error: "File not found in storage",
                details: "The file record exists but the actual file is missing",
            });
        }

        const metadata = await getFileMetadata(bucket, objectName);
        const presignedUrl = await getPresignedUrl(bucket, objectName);

        return res.status(HTTP_SUCCESS).json({
            chatroomId: file.chatroomId,
            contentType: metadata.metaData["content-type"] || OCTET_STREAM,
            expiresIn: DEFAULT_EXPIRY_SECONDS,
            fileUrl: file.fileUrl,
            id: file.id,
            presignedUrl: presignedUrl,
            size: metadata.size,
            uploadedAt: file.createdAt,
            uploadedBy: file.user.username,
            userId: file.userId,
        });
    } catch (err) {
        console.error("Error getting file:", err);

        return res.status(HTTP_SERVER_ERROR).json({
            error: "Failed to get file",
            details: err.message,
        });
    }
};

const getFileLink = async (req, res) => {
    try {
        const {bucket, filename} = req.params;
        const expirySeconds = Number(req.query.expiry) || DEFAULT_EXPIRY_SECONDS;

        const exists = await fileExists(bucket, filename);
        if (!exists) {
            return res.status(HTTP_NOT_FOUND).json({error: "File not found"});
        }

        const url = await getPresignedUrl(bucket, filename, expirySeconds);
        const metadata = await getFileMetadata(bucket, filename);

        return res.json({
            contentType: metadata.metaData["content-type"] || OCTET_STREAM,
            expiresIn: expirySeconds,
            filename: path.basename(filename),
            size: metadata.size,
            url: url,
        });
    } catch (err) {
        console.error("Error generating download link:", err);

        return res.status(HTTP_SERVER_ERROR).json({
            error: "Failed to generate download link",
            details: err.message,
        });
    }
};


const deleteFileHandler = async (req, res) => {
    try {
        const {fileId} = req.params;
        const {userId} = req.body;

        const file = await prisma.file.findUnique({
            where: {id: Number(fileId)},
        });

        if (!file) {
            return res.status(HTTP_NOT_FOUND).json({error: "File not found"});
        }

        if (file.userId !== Number(userId)) {
            return res.status(HTTP_UNAUTHORIZED).json({
                error: "You do not have permission to delete this file",
            });
        }

        const [, bucket,
            ...objectParts] = file.fileUrl.split("/");
        const objectName = objectParts.join("/");

        try {
            await deleteFile(bucket, objectName);
        } catch (storageErr) {
            console.error("Error deleting file from storage:", storageErr);
        }

        await prisma.file.delete({
            where: {id: Number(fileId)},
        });

        return res.status(HTTP_SUCCESS).json({message: "File deleted successfully"});
    } catch (err) {
        console.error("Error deleting file:", err);

        return res.status(HTTP_SERVER_ERROR).json({
            error: "Failed to delete file",
            details: err.message,
        });
    }
};


const listChatroomFiles = async (req, res) => {
    try {
        const {roomId} = req.params;

        const chatroom = await prisma.chatroom.findUnique({
            where: {id: Number(roomId)},
        });

        if (!chatroom) {
            return res.status(HTTP_NOT_FOUND).json({error: "Chatroom not found"});
        }

        const files = await prisma.file.findMany({
            where: {chatroomId: Number(roomId)},
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedFiles = files.map((file) => ({
            fileUrl: file.fileUrl,
            id: file.id,
            uploadedAt: file.createdAt,
            uploadedBy: file.user.username,
            userId: file.userId,
        }));

        return res.status(HTTP_SUCCESS).json(formattedFiles);
    } catch (err) {
        console.error("Error listing files:", err);

        return res.status(HTTP_SERVER_ERROR).json({
            error: "Failed to list files",
            details: err.message,
        });
    }
};

export {
    deleteFileHandler,
    generateUploadUrl as generateUploadUrlHandler,
    getFile as getFileHandler,
    getFileLink as getFileLinkHandler,
    listChatroomFiles as listChatroomFilesHandler,
    multerConfig as upload,
};