/**
 * Enum for chatroom error types.
 *
 * @typedef {object} CHATROOM_ERROR_TYPE
 * @property {string} CHATROOM_NAME_ALREADY_EXISTS
 */
const CHATROOM_ERROR_TYPE = Object.freeze({
    CHATROOM_NAME_ALREADY_EXISTS: "The chatroom name already exists",
    CHATROOM_NOT_FOUND: "Chatroom not found",
    USER_ALREADY_IN_CHATROOM: "You are already in this chatroom",
});


export {CHATROOM_ERROR_TYPE};
