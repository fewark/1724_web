import {jwtDecode} from "jwt-decode";

import api from "./index";


globalThis.tokenStorage = sessionStorage;
globalThis.user = null;


/**
 * Retrieves the saved token from storage.
 *
 * @return {string|null} The saved token or null if not found.
 */
const getSavedToken = () => localStorage.getItem("token") ?? sessionStorage.getItem("token");

/**
 * Retrieves the user information from the saved token.
 *
 * @return {object|null} The decoded user information or null if not found.
 */
const getUser = () => {
    if (globalThis.user) {
        return globalThis.user;
    }

    const token = getSavedToken();
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        globalThis.user = decoded;

        console.log("Decoded token:", decoded);

        return decoded;
    } catch (err) {
        console.error("Failed to decode token:", err);

        return null;
    }
};

/**
 * Sends a login request with the user's email and password.
 *
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember
 * @return {Promise<null|string>}
 */
const reqUserLogin = async (email, password, remember) => {
    try {
        const res = await api.post("/user/login", {email, password}, {
            skipAuth: true,
        });

        const {token} = res.data;
        if (remember) {
            globalThis.tokenStorage = localStorage;
        } else {
            localStorage.removeItem("token");
        }

        globalThis.tokenStorage.setItem("token", token);

        return null;
    } catch (err) {
        return err.response?.data?.error || `Login failed: ${err.message}`;
    }
};

/**
 * Sends a registration request with user details.
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string|null} profilePicture
 * @return {Promise<null|string>}
 */
const reqUserRegister = async (username, email, password, profilePicture) => {
    try {
        const payload = {
            username: username,
            email: email,
            password: password,
        };

        if (null !== profilePicture) {
            payload.profilePicture = profilePicture;
        }

        const res = await api.post("/user/register", payload, {skipAuth: true});
        const {token} = res.data;
        globalThis.tokenStorage.setItem("token", token);

        return null;
    } catch (err) {
        return err.response?.data?.error || `Register failed: ${err.message}`;
    }
};

/**
 * Sends a request to update the user's profile.
 *
 * @param {object} props
 * @param {string} props.username
 * @param {string} props.id
 * @return {Promise<string |null>}
 */
const reqUpdateUserProfile = async ({username, id}) => {
    try {
        const res = await api.put("/user", {username, id});
        const {token} = res.data;

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        globalThis.tokenStorage.setItem("token", token);
        globalThis.user = jwtDecode(token);

        return null;
    } catch (err) {
        return err.response?.data?.error || `Update user profile failed: ${err.message}`;
    }
};

export {
    getSavedToken,
    getUser,
    reqUpdateUserProfile,
    reqUserLogin,
    reqUserRegister,
};
