import prisma from "./index.js";


/**
 * Fetches all messages from the specified chatroom.
 *
 * @param {string} roomId
 * @param {number} count Number of messages to fetch.
 * @param {number} [earlierThan] Timestamp to fetch messages before.
 * @return {Promise<import('@prisma/client').Message[]>} An array of messages.
 */
const getChatroomMessages = async (roomId, count, earlierThan) => {
    const messages = await prisma.message.findMany({
        where: {
            chatroomId: Number(roomId),
            ...(earlierThan && {
                createdAt: {
                    lt: earlierThan,
                },
            }),
        },
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
        take: count,
    });

    return messages.reverse();
};

/**
 * Saves a new message to the specified chatroom.
 *
 * @param {string} roomId
 * @param {number} senderId The ID of the user sending the message.
 * @param {string} content
 * @return {Promise<import('@prisma/client').Message>} The saved message.
 */
const saveMessage = async (roomId, senderId, content) => {
    return await prisma.message.create({
        data: {
            chatroomId: Number(roomId),
            userId: senderId,
            content: content,
        },
    });
};


export {
    getChatroomMessages,
    saveMessage,
};
