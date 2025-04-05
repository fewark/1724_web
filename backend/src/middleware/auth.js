import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";


/**
 * Verifies the JWT token and extracts user information.
 *
 * @param {string} token
 * @return {{email: string, id: number, username: string}|string} If successful, returns an object
 * containing user information. If the token is invalid or expired, returns an error message.
 */
const getUserFromToken = (token) => {
    try {
        const {email, id, username} = jwt.verify(token, process.env.JWT_SECRET);

        return {email, id, username};
    } catch (err) {
        if ("TokenExpiredError" === err.name) {
            return "Authentication Failed: Token has expired";
        }

        return "Authentication Failed: Token is corrupted";
    }
};

/**
 * Decorates the request object with user data if the token is valid.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response | void}
 */
const authHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "Authentication Failed: Missing" +
                " or invalid token"});
    }

    const [, token] = authHeader.split(" ");
    const userFromToken = getUserFromToken(token);
    if ("string" === typeof userFromToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: userFromToken});
    }
    req.user = userFromToken;

    return next();
};

export {getUserFromToken};
export default authHandler;
