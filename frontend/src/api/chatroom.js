import api from "./index.js";


/**
 * @typedef {object} CreateChatroomResp
 * @property {string} roomId
 */

/**
 * Sends a request to create a new chatroom.
 *
 * @param {string} name
 * @return {Promise<string | CreateChatroomResp>} If successful, return the response data object;
 * If failed, return an error message.
 */
const reqCreateChatroom = async (name) => {
    try {
        const res = await api.post("/chatroom", {name});

        return res.data;
    } catch (err) {
        return err.response?.data?.error || `Create chatroom failed: ${err.message}`;
    }
};

/**
 * Gets chatroom information.
 *
 * @param {string} roomId
 * @return {Promise<string | object>} If successful, return the response data object;
 * If failed, return an error message.
 */
const reqGetChatroomInfo = async (roomId) => {
    try {
        const res = await api.get(`/chatroom/${roomId}`);

        return res.data;
    } catch (err) {
        return err.response?.data?.error || `Get chatroom failed: ${err.message}`;
    }
};

/**
 * Sends a message to a chatroom.
 *
 * @param {import('socket.io-client').Socket} socket
 * @param {string} roomId
 * @param {string} message
 * @return {null}
 */
const reqSendMessage = (socket, roomId, message) => {
    socket.emit("sendMessage", {roomId, message});

    return null;
};

export {
    reqCreateChatroom,
    reqGetChatroomInfo,
    reqSendMessage,
};
