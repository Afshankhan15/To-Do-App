// export Utility function to handle errors and send success responses

const handleSuccessResponse = (res, statusCode, message, data) => {
  if (data) {
    // If data is not null
    res.status(statusCode).json({
      success: true,
      message,
      UserData: data,
    });
  } else {
    // If data is null
    res.status(statusCode).json({
      success: true,
      message,
    });
  }
};

module.exports = handleSuccessResponse; // Export the function to be used in other parts of the application
