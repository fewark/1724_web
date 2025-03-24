/**
 * Logs the request method and path to the console.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @return {void}
 */
const requestLoggingHandler = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

    return next();
};

export default requestLoggingHandler;
