// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  };

module.exports = errorHandler;