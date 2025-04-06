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
 * @typedef {object} JoinChatroomResp
 * @property {string} roomId
 */
/**
 * Sends a request to join an existing chatroom.
 *
 * @param {string} name
 * @return {Promise<string | JoinChatroomResp>} If successful, return the response data object;
 * If failed, return an error message.
 */
const reqJoinChatroom = async (name) => {
    try {
        const res = await api.put("/chatroom", {name});

        return res.data;
    } catch (err) {
        return err.response?.data?.error || `Join chatroom failed: ${err.message}`;
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
 * Gets the list of chatroom the user is in.
 *
 * @return {Promise<string | object[]>} If successful, return the response data object;
 */
const reqGetChatroomList = async () => {
    try {
        const res = await api.get("/chatroom");

        return res.data;
    } catch (err) {
        return err.response?.data?.error || `Get chatroom list failed: ${err.message}`;
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

/**
 * Sends a file message to a chatroom.
 *
 * @param {import('socket.io-client').Socket} socket
 * @param {string} roomId
 * @param {object} fileInfo
 * @param {string} fileInfo.filename Original filename
 * @param {string} fileInfo.fileUrl URL for the file
 * @param {string} fileInfo.presignedUrl Temporary upload URL
 * @param {string} fileInfo.fileType MIME type of the file
 * @return {null}
 */
const reqSendFileMessage = (socket, roomId, fileInfo) => {
    // Create a special file message format
    const fileMessage = JSON.stringify({
        fileId: fileInfo.fileId,
        fileType: fileInfo.fileType,
        fileUrl: fileInfo.fileUrl,
        filename: fileInfo.filename,
        presignedUrl: fileInfo.presignedUrl,
        type: "file",
    });

    socket.emit("sendMessage", {roomId: roomId, message: fileMessage});

    return null;
};

export {
    reqCreateChatroom,
    reqGetChatroomInfo,
    reqGetChatroomList,
    reqJoinChatroom,
    reqSendFileMessage,
    reqSendMessage,
};
