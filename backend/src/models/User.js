import prisma from "./index.js";


/**
 *
 * @param userId
 */
const getChatroomListForUser = async (userId) => {
    const userWithRooms = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            memberOf: {
                include: {
                    messages: {
                        take: 1,
                        orderBy: {createdAt: "desc"},
                        select: {
                            content: true,
                        },
                    },
                },
            },
        },
    });

    return userWithRooms.memberOf;
};

export {getChatroomListForUser};
