// Import the jsonwebtoken module for JWT operations
const jwt = require("jsonwebtoken");

// Retrieve the secret key from the environment variable
const secret_key = process.env.JWT_SECRET;

// Middleware function to verify if the JWT token is valid or not
const authenticateJWT = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers["x-access-token"];

  // Handle the case where the token is missing
  if (!token) {
    return handleErrorResponse(res, 401, "Unauthorized - Missing token", null);
  }

  let decode; // Define a variable to store the decoded token

  try {
    decode = jwt.verify(token, secret_key); // Verify and store the decoded token
  } catch (err) {
    return handleErrorResponse(res, 401, "Unauthorized - Invalid token", null);
  }

  // If the token is valid and the user is authorized, proceed

  req.user = decode; // Attach decoded user information to the request object
  next(); // Continue to the next middleware or route handler
};

module.exports = authenticateJWT; // Export the authenticateJWT middleware for use in other parts of the application
