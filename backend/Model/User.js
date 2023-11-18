// Import necessary libraries
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // npm i bcrypt -> to install it

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email --> should be unique in DB
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password using bcrypt before saving it in the database (during registration)
userSchema.pre("save", async function (next) {
  // Check if the password field is modified before hashing
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt and hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error); // Pass any error that occurs to the next middleware
  }
});

// Create a User model using the defined schema
usermodel = new mongoose.model("usermodel", userSchema);

// Export the User model for use in other parts of the application
module.exports = usermodel;
