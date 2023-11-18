// Express is a framework for Node.js that simplifies building web applications and APIs
const express = require("express");

// cors provied secure communication b/w server and browser & control/manage access permission for resources
const cors = require("cors");
// body parser to parse request payload into json object
const bodyParser = require("body-parser");

// Add dotenv for environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/config.env" });

// Import the connectToDatabase function from the database configuration file
const connectToDatabase = require("./Config/database");

// import Routes of User
const UserApi = require("./Route/User.route");

// import Routes of Tasks
const TaskApi = require("./Route/Tasks.route");

const app = express(); // Create an instance of the Express application

// Use middleware to handle JSON requests
app.use(express.json()); // if you want to use json
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON data in the request body

const PORT = process.env.PORT || 4000; // Use environment variable for port

// Call the connectToDatabase function to establish the database connection
connectToDatabase();

// ROUTE --> API For User Register/LOGIN
app.use("/", UserApi);

// Route ----> API to Create/ADD Tasks
app.use("/", TaskApi);

// Define a simple GET route for the root path ('/')
app.get("/", (req, res) => {
  res.send("Server is working Afshan"); // Send a simple response to the client when accessing the root path
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is working on port http://localhost:${PORT}`);
});
