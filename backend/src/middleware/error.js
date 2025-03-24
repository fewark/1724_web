import {StatusCodes} from "http-status-codes";


/**
 * Handles errors that occur during the request/response cycle.
 *
 * @param {Error | any} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {import("express").Response}
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
    });
};

export default errorHandler;
