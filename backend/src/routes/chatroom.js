import express from "express";
import {StatusCodes} from "http-status-codes";

import {CHATROOM_ERROR_TYPE} from "../errors.js";
import authHandler, {getUserFromToken} from "../middleware/auth.js";
import {
    createChatroom,
    getChatroomInfo,
    joinChatroom,
} from "../models/Chatroom.js";
import {
    getChatroomMessages,
    saveMessage,
} from "../models/Message.js";


const router = express.Router();

const FETCH_CHATROOM_MESSAGES_LIMIT = 20;

/**
 * Chatroom route.
 *
 * @param {import("socket.io").Server} io Socket.IO server instance.
 * @return {import("express").Router} Express router instance.
 */
// eslint-disable-next-line max-lines-per-function
const createChatroomRouter = (io) => {
    io.on(
        "connection",

        /**
         * Handles socket connection events.
         *
         * @param {import("socket.io").Socket} socket
         */
        (socket) => {
            const userFromToken = getUserFromToken(socket.handshake.auth.token);
            if (null === userFromToken) {
                socket.disconnect();

                return;
            }
            console.log("New client connected:", userFromToken.username);

            socket.on("disconnect", () => {
                console.log("Client disconnected:", userFromToken.username);
            });

            socket.on("subscribe", async ({roomId, earlierThan}) => {
                console.log("Client subscribed to room:", roomId);
                socket.join(roomId);

                const historicalMessages = await getChatroomMessages(
                    roomId,
                    FETCH_CHATROOM_MESSAGES_LIMIT,
                    earlierThan
                );

                historicalMessages.forEach(({createdAt, content, user}) => {
                    io.to(roomId).emit("message", {
                        senderId: user.id,
                        senderUsername: user.username,
                        message: content,
                        createdAt: createdAt,
                    });
                });
            });

            socket.on("getMoreMessages", async ({roomId, earlierThan}) => {
                console.log("Client requested more messages for room:", roomId);
                const historicalMessages = await getChatroomMessages(
                    roomId,
                    FETCH_CHATROOM_MESSAGES_LIMIT,
                    earlierThan
                );

                historicalMessages.reverse().forEach(({createdAt, content, user}) => {
                    io.to(roomId).emit("prependMessage", {
                        senderId: user.id,
                        senderUsername: user.username,
                        message: content,
                        createdAt: createdAt,
                    });
                });
            });

            socket.on("sendMessage", async ({roomId, message}) => {
                await saveMessage(roomId, userFromToken.id, message);
                io.to(roomId).emit("message", {
                    senderId: userFromToken.id,
                    senderUsername: userFromToken.username,
                    message: message,
                    createdAt: new Date().valueOf(),
                });
            });
        }
    );

    // GET /api/chat/:roomId
    router.get("/:roomId", async (req, res) => {
        // eslint-disable-next-line no-warning-comments
        // FIXME: check if user is a member of the chatroom
        const chatroom = await getChatroomInfo(req.params.roomId);
        if (null === chatroom) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Chatroom not found",
            });
        }

        return res.json(chatroom);
    });

    router.post("/", authHandler, async (req, res) => {
        const {name} = req.body;

        const createRoomResp = await createChatroom(name, req.user.id);
        if (createRoomResp === CHATROOM_ERROR_TYPE.CHATROOM_NAME_ALREADY_EXISTS) {
            return res.status(StatusCodes.CONFLICT).json({
                error: createRoomResp,
            });
        }

        return res.json({
            roomId: createRoomResp.id,
        });
    });

    router.put("/", authHandler, async (req, res) => {
        const {name} = req.body;

        const createRoomResp = await joinChatroom(name, req.user.id);
        if (createRoomResp === CHATROOM_ERROR_TYPE.CHATROOM_NOT_FOUND) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: createRoomResp,
            });
        }
        if (createRoomResp === CHATROOM_ERROR_TYPE.USER_ALREADY_IN_CHATROOM) {
            return res.status(StatusCodes.CONFLICT).json({
                error: createRoomResp,
            });
        }

        return res.json({
            roomId: createRoomResp.id,
        });
    });

    return router;
};

export default createChatroomRouter;
