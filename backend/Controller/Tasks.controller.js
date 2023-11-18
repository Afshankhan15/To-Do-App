// Import Task model
const task = require("../Model/Tasks");

//import Error.js from Utils
const handleErrorResponse = require("../Utils/Error");

// import Success.js from Utils
const handleSuccessResponse = require("../Utils/Success");

// Controller function to retrieve tasks for a specific user
exports.GetTasks = async (req, res) => {
  // The authenticateJWT middleware verifies the token and attaches decoded user information to req.user
  const userId = req.user.id;

  try {
    // Find all tasks associated with the provided userId
    const AllUserTaks = await task.find({ userId });

    // If no tasks are found for the user
    if (!AllUserTaks) {
      // Return an error response with status code 404 and a message indicating token invalidity
      return handleErrorResponse(
        res,
        404,
        "Token is invalid. Please Log In again",
        null
      );
    }

    // Return a success response with status code 200 and the retrieved tasks
    return handleSuccessResponse(res, 200, "Token Valid", AllUserTaks);
  } catch (error) {
    // Handle any server errors by sending a 500 status code along with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};

// Controller function to create a new task for a specific user
exports.CreateTasks = async (req, res) => {
  console.log(req.body); // Log the request body for debugging purposes

  console.log("USERID: ", req.user.id); // Log the user ID retrieved from the decoded token

  // The authenticateJWT middleware verifies the token and attaches decoded user information to req.user
  const userId = req.user.id; // Use the user ID from the decoded token attached by the middleware

  // Extract task details from the request body
  const { title, description, due_date } = req.body;

  try {
    // Create a new task in the database associated with the provided user ID
    const newTask = await task.create({
      title: title,
      description: description,
      dueDate: due_date,
      status: "Not Completed", // Assuming the default status is "Not Completed"
      userId: userId, // Associate the task with the specific user by using their user ID
    });

    // Return a success response with status code 201 and the newly created task
    return handleSuccessResponse(
      res,
      201,
      "Tasks Created Successfully",
      newTask
    );
  } catch (error) {
    // Handle any server errors by sending a 500 status code along with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};

// Controller function to delete a task for a specific user
exports.DeleteTask = async (req, res) => {
  const { id } = req.body; // Receive the task ID from req.body sent by the client

  // The authenticateJWT middleware verifies the token and attaches decoded user information to req.user
  const userId = req.user.id; // Retrieve the user ID from the decoded token

  try {
    // Attempt to delete the task by its _id
    const deleteTask = await task.findByIdAndDelete(id);

    // Check if the task was not found or the user doesn't have permission to delete it
    if (!deleteTask) {
      return handleErrorResponse(
        res,
        404,
        "Task not found or you don't have permission to delete it",
        null
      );
    }

    // Fetch all tasks belonging to the userID after the deletion
    const AllUserTasks = await task.find({ userId });

    // Prepare an object containing all tasks and the deleted task for the response
    const responseObject = {
      ALLTask: AllUserTasks,
      DeletedTask: deleteTask,
    };

    // Return a success response with a status code of 200 and the updated task list and the deleted task
    return handleSuccessResponse(
      res,
      200,
      "Task Deleted successfully",
      responseObject
    );
  } catch (error) {
    console.log("error in server", error); // Log the server error for debugging purposes

    // Handle any server errors by sending a 500 status code along with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};

// Controller function to update a task for a specific user
exports.UpdateTask = async (req, res) => {
  const { id } = req.params; // Retrieve the task ID from the URL
  console.log("Update task Details", req.body); // Log the user's updated details sent to the server

  const { title, description, due_date, status } = req.body; // Retrieve updated task details from req.body

  // The authenticateJWT middleware verifies the token and attaches decoded user information to req.user
  const userId = req.user.id; // Retrieve the user ID from the decoded token

  try {
    // Check if the user with the given ID belongs to the authenticated user
    const TaskToUpdate = await task.findOne({ _id: id, userId }); // Find the task by ID and user ID

    // If the task is not found or does not belong to the user, return a 404 error
    if (!TaskToUpdate) {
      return handleErrorResponse(
        res,
        404,
        "Task not found or does not belong to the user",
        null
      );
    }

    // Update the task details (title, description, due_date, status) sent by the user to the server
    // Use a ternary operation to update the task details if provided by the user, otherwise keep the existing details
    TaskToUpdate.title = title ? title : TaskToUpdate.title;
    TaskToUpdate.description = description
      ? description
      : TaskToUpdate.description;
    TaskToUpdate.dueDate = due_date ? due_date : TaskToUpdate.dueDate;
    TaskToUpdate.status = status ? status : TaskToUpdate.status;

    // Save the updated task details
    const updatedTask = await TaskToUpdate.save();

    // Fetch all tasks belonging to the userID after the update
    const AllTaskData = await task.find({ userId });

    // Prepare an object containing all tasks and the updated task for the response
    const responseObject = {
      ALLTask: AllTaskData,
      updatedTask: updatedTask,
    };

    // Return a success response with a status code of 200 and the updated task list and the specific updated task
    return handleSuccessResponse(
      res,
      200,
      "Task Updated Successfully",
      responseObject
    );
  } catch (error) {
    console.log("Error in server", error); // Log server errors for debugging purposes

    // Handle any server errors by sending a 500 status code along with an error message
    return handleErrorResponse(res, 500, "Server Error", error);
  }
};
