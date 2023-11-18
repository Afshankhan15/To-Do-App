// Import necessary modules
const express = require("express");
const router = express.Router();

// Import Task controller
const TaskController = require('../Controller/Tasks.controller');

// Import JWT authentication middleware
const JWTauthMiddleware = require('../Middleware/checkAuth.middleware')

// Route to fetch all created tasks using JWT authentication
router.get("/api/v1/getTasks", JWTauthMiddleware, TaskController.GetTasks);

// Route to create a new task using JWT authentication
router.post("/api/v1/createTask", JWTauthMiddleware, TaskController.CreateTasks);

// Route to delete a task using JWT authentication
router.post("/api/v1/deleteTask", JWTauthMiddleware, TaskController.DeleteTask)

// Route to update a task by ID using JWT authentication
router.post("/api/v1/UpdateTask/:id", JWTauthMiddleware, TaskController.UpdateTask)

module.exports = router; // Export the router for use in the application