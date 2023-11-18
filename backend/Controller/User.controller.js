// Import User Model
const user = require("../Model/User");

// Bcrypt used to hash password stored in MongoDb Atlas DataBase
const bcrypt = require("bcrypt");

// npm install jsonwebtoken : used for User authentication and authorization
const jwt = require("jsonwebtoken");

// Import dotenv for environment variables
const dotenv = require("dotenv");

dotenv.config({ path: "../Config/config.env" });

//import Error.js from Utils
const handleErrorResponse = require("../Utils/Error");

// import Success.js from Utils
const handleSuccessResponse = require("../Utils/Success");

// Use environment variable for secret key
const secret_key = process.env.JWT_SECRET;

// Controller function to handle user registration
exports.RegisterUser = async (req, res) => {
  // Log the request body to console for debugging purpose
  console.log(req.body);

  // Destructure user details (name, email, password) from the request body
  const { name, email, password } = req.body;
  try {
    // Check if a user exists with the provided email address
    const UserExist = await user.findOne({ email });

    // If the user already exists, return an error response to the client
    if (UserExist) {
      // status(400) indicates a client error, often due to bad req
      return handleErrorResponse(res, 400, "User already registered", null);
    }
    // If the user is new, store their details in the MongoDB Atlas database
    else {
      const NewUser = await user.create({ name, email, password }); // User Details

      // Return a success response with status code 201 and the newly created user details
      return handleSuccessResponse(
        res,
        201,
        "Successfully Registered",
        NewUser
      ); // send newuser to client just to test
    }
  } catch (error) {
    // Handle any server errors by sending a 500 status code with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};

// Controller function to handle user login
exports.LoginUser = async (req, res) => {
  // Log the request body to the console for debugging purposes
  console.log(req.body);

  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Find a user with the provided email in the database
    const Existinguser = await user.findOne({ email });

    // If the user exists in the database
    if (Existinguser) {
      // Compare the provided password with the hashed password stored in the database using bcrypt
      const Matchtpswd = await bcrypt.compare(password, Existinguser.password);

      // If the passwords match
      if (Matchtpswd) {
        // JWT [step-1] -->server create token  ---> token is created using User email, user id and secret key and sends to user
        // [when you decode JWT it will give you same email, same id and iat]
        // Generate a JSON Web Token (JWT) containing user details (email, id) signed with a secret key
        const token = jwt.sign(
          {
            email: Existinguser.email,
            id: Existinguser._id,
          },
          secret_key
        );

        // Prepare an object containing the logged-in user details and the generated token
        const obj = {
          LoginUser: Existinguser,
          userToken: token,
        };

        // Return a success response with status code 200 and the user details along with the generated token
        return handleSuccessResponse(res, 200, "Login Successfully", obj);
      } else {
        // Return an error response with status code 401 if the password doesn't match
        return handleErrorResponse(res, 401, "Password didn't match", null); // 401 -> Unauthorized credentials from user side
      }
    } else {
      // Return an error response with status code 400 if the user is not registered
      return handleErrorResponse(res, 400, "User not registered", null);
    }
  } catch (error) {
    // Handle any server errors by sending a 500 status code along with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};
