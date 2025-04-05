import api from "./index";


/**
 * Retrieves the saved token from session storage.
 *
 * @return {string|null} The saved token or null if not found.
 */
const getSavedToken = () => sessionStorage.getItem("token");

/**
 * Sends a login request with the user's email and password.
 *
 * @param {string} email
 * @param {string} password
 * @return {Promise<null|string>}
 */
const reqUserLogin = async (email, password) => {
    try {
        const res = await api.post("/auth/login", {email, password}, {
            skipAuth: true,
        });

        const {token} = res.data;
        sessionStorage.setItem("token", token);

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

        const res = await api.post("/auth/register", payload, {skipAuth: true});
        const {token} = res.data;
        sessionStorage.setItem("token", token);

        return null;
    } catch (err) {
        return err.response?.data?.error || `Register failed: ${err.message}`;
    }
};

export {
    getSavedToken,
    reqUserLogin,
    reqUserRegister,
};
