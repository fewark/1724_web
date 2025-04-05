import {CHATROOM_ERROR_TYPE} from "../errors.js";
import prisma from "./index.js";


/**
 * Creates a new chatroom.
 *
 * @param {string} name
 * @param {string} createdBy Creator's user ID
 * @return {Promise<CHATROOM_ERROR_TYPE|import('@prisma/client').Chatroom>} If successful,
 * return the created chatroom; if failed, return an error type.
 */
const createChatroom = async (name, createdBy) => {
    try {
        return await prisma.chatroom.create({
            data: {
                name: name,
                createdBy: createdBy,
                members: {
                    // This ensures creator is also a member
                    connect: {id: createdBy},
                },
            },
        });
    } catch (e) {
        if ("P2002" === e.code) {
            return CHATROOM_ERROR_TYPE.CHATROOM_NAME_ALREADY_EXISTS;
        }
        throw e;
    }
};

/**
 * Retrieves a chatroom by its ID.
 *
 * @param {string} roomId
 * @return {Promise<import('@prisma/client').Chatroom>} The chatroom object.
 */
const getChatroomInfo = async (roomId) => {
    return await prisma.chatroom.findUnique({
        where: {id: Number(roomId)},
        include: {
            members: {
                select: {
                    id: true,
                    username: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
};


export {
    createChatroom,
    getChatroomInfo,
};
