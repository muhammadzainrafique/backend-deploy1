
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    const errorResponse = {
      status: "error",
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    };
    if (err.name === "CastError" && err.kind === "ObjectId") {
      errorResponse.message = "Invalid ID";
    } else if (err.name === "ValidationError") {
      errorResponse.message = "Validation Error";
    } 
    else if (err.name === "UnauthorizedError") {
      errorResponse.message = "Unauthorized";
    } else{
      errorResponse.message = err.message || "Internal Server Error";
    }
  
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${errorResponse.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
    res.json(errorResponse);
  };

  module.exports = errorHandler;
  
  