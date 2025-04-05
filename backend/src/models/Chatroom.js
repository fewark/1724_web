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
 * Adds a user to an existing chatroom.
 *
 * @param {number} roomName
 * @param {number} userId
 * @return {Promise<CHATROOM_ERROR_TYPE | import('@prisma/client').Chatroom>} If successful,
 * returns the updated chatroom; otherwise, returns an error type.
 */
const joinChatroom = async (roomName, userId) => {
    // Check if chatroom exists
    const chatroom = await prisma.chatroom.findUnique({
        where: {name: roomName},
        include: {members: true},
    });

    if (!chatroom) {
        return CHATROOM_ERROR_TYPE.CHATROOM_NOT_FOUND;
    }

    // Check if user is already a member
    const isAlreadyMember = chatroom.members.some((member) => member.id === userId);
    if (isAlreadyMember) {
        return CHATROOM_ERROR_TYPE.USER_ALREADY_IN_CHATROOM;
    }

    // Add user to chatroom
    return await prisma.chatroom.update({
        where: {name: roomName},
        data: {
            members: {
                connect: {id: userId},
            },
        },
        include: {members: true},
    });
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
    joinChatroom,
};
