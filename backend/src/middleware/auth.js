import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";


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

    try {
        const {email, id, username} = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {email, id, username};

        return next();
    } catch (err) {
        if ("TokenExpiredError" === err.name) {
            return res.status(StatusCodes.UNAUTHORIZED)
                .json({error: "Authentication Failed: Token has expired"});
        }

        return res.status(StatusCodes.FORBIDDEN)
            .json({error: "Authentication Failed: Token is corrupted"});
    }
};

export default authHandler;
