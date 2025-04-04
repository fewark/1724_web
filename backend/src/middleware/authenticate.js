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
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "Missing or invalid token"});
    }

    // const token = authHeader.split(" ")[1];
    const [, token] = authHeader.split(" ");

    try {
        const {email, id, username} = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {email, id, username};

        return next();
    } catch (err) {
        console.log("Unable to decode JWT payload:", err);

        return res.status(StatusCodes.FORBIDDEN)
            .json({error: "Token is invalid or expired"});
    }
};

export default authHandler;
