// export Utility function to handle errors and send error responses

const handleErrorResponse = (res, statusCode, message, error) => {
  if (error && error.message) {
    // If error is not null and has a 'message' property [CATCH BLOCK]
    res.status(statusCode).json({
      success: false,
      message,
      error: error.message,
    });
  } else {
    // If error is null or doesn't have a 'message' property [TRY BLOCK]
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

module.exports = handleErrorResponse; // Export the function to be used in other parts of the application
