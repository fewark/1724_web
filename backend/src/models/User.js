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
                            createdAt: true,
                            content: true,
                        },
                    },
                },
            },
        },
    });

    if (!userWithRooms) {
        return [];
    }

    return userWithRooms.memberOf.sort((a, b) => {
        const aTime = a.messages[0]?.createdAt?.valueOf() ?? 0;
        const bTime = b.messages[0]?.createdAt?.valueOf() ?? 0;
        return bTime - aTime;
    });
};

export {getChatroomListForUser};
