import api from "./index";


/**
 * Sends a login request with the user's email and password.
 *
 * @param {string} email
 * @param {string} password
 * @return {Promise<null|string>}
 */
const reqUserLogin = async (email, password) => {
    try {
        const res = await api.post("/login", {email, password}, {
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

        const res = await api.post("/register", payload, {skipAuth: true});
        const {token} = res.data;
        sessionStorage.setItem("token", token);

        return null;
    } catch (err) {
        return err.response?.data?.error || `Register failed: ${err.message}`;
    }
};

export {
    reqUserLogin, reqUserRegister,
};
