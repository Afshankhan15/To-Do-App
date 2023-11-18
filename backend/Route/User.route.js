// Import necessary modules
const express = require("express");
const router = express.Router();

// Import User controller
const UserController = require("../Controller/User.controller");

// Route to handle user registration
router.post("/register", UserController.RegisterUser);

// Route to handle user login
router.post("/login", UserController.LoginUser);

module.exports = router; // Export the router for use in the application
