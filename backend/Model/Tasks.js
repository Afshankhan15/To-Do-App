const mongoose = require("mongoose");

// Define the schema for tasks
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: String, // or ObjectId, depending on how you store user IDs
    required: true,
  },
});

// Create a Task model using the defined schema
Taskmodel = new mongoose.model("Taskmodel", TaskSchema);

// Export the Task model for use in other parts of the application
module.exports = Taskmodel;
