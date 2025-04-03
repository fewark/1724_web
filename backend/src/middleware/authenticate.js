import {StatusCodes} from "http-status-codes";
import jwt from "jsonwebtoken";


/**
 * autheticate further apis
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {void}
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "Missing or invalid token"});
    }

    // const token = authHeader.split(" ")[1];
    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // { id, username, email }
        req.userData = {
            email: decoded.email,
            userID: decoded.userID,
            userName: decoded.userName,
            createdAt: decoded.createdAt,

        // user_type: decoded.user_type,
        };

        return next();
    } catch (err) {
        console.log(err);

        return res.status(StatusCodes.FORBIDDEN).json({error: "Token is invalid or expired"});
    }
};

export default authenticate;
