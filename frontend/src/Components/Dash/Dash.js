import "./Dash.css"; // Import CSS file for styling
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode"; // Import to decode the User Details
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes
import axios from "axios"; // Import Axios for making HTTP requests to server

const Dash = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState([]); // State to store fetched tasks

  // Function to GET/FETCH all the Tasks
  const getTasks = async () => {
    try {
      //  Retrieves the authentication token stored in the browser's local storage.
      const token = localStorage.getItem("token");

      // if token present
      if (token) {
        // Axios is used to make an HTTP GET request to a server endpoint (api/v1/getTasks)
        const response = await axios.get(
          "http://localhost:4000/api/v1/getTasks",
          {
            headers: {
              "x-access-token": token, // Include the token in the request headers
            },
          }
        );

        // Check if the token is valid and tasks were successfully fetched
        if (response.data.message === "Token Valid") {
          setResult(response.data.UserData); // Set fetched tasks to the 'result' state
        }
      }
    } catch (error) {
      // Handle errors that occur during the fetching of tasks
      console.error("Error in Getting tasks:", error);
      alert("Error: " + error.response.data.message); // Display an error message if fetching tasks fails
    }
  };

  // UseEffect that runs when the component mounts or when its dependencies change
  useEffect(() => {
    // Retrieves the token from the local storage
    const token = localStorage.getItem("token");

    // Check if token is not present, indicating that the user is not authenticated
    if (!token) {
      setTimeout(() => {
        alert("Please Login to create task");
        navigate("/login"); // redirect to '/login' page after 2 sec delay
      }, 2000);
      return;
    }
    // If the token is present, indicating that the user is authenticated
    else {
      // Decodes the token to extract information about the user like --> {{email, id and iat}}
      const user = jwtDecode(token);

      // Checks if the user object could not be decoded which means the token is invalid or corrupted.
      if (!user) {
        localStorage.removeItem("token"); // Remove the invalid token
        navigate("/login"); // Redirect to login page due to an invalid token
      }
      // If both the token is present and the user object is decoded successfully,
      // it means the user is authenticated and the token is valid, then execute getTasks function
      else {
        getTasks(); // Call the async function to fetch ALL Tasks
      }
    }
  }, [navigate]); // The effect will re-run if the 'navigate' function changes

  // Function to Create Task
  const addTask = async () => {
    try {
      // Using the 'navigate' function from React Router to redirect to the '/create' page
      navigate("/create"); // when [[Create New Task]] button is clicked then it will redirect to the '/create' page
    } catch (error) {
      // Handle errors, if any, during navigation
      console.error("Error while navigating:", error.message);
    }
  };

  // Function To Delete the Task
  const deleteTask = async (id) => {
    // Display a confirmation dialog to confirm the deletion
    const confirmation = window.confirm("Are you sure to delete this task?");

    // If user cancels the deletion, exit the function
    if (!confirmation) {
      return;
    }

    // Retrieves the token from the local storage
    const token = localStorage.getItem("token");

    try {
      // Axios is used to make an HTTP POST request to a server endpoint (api/v1/deleteTask)
      const response = await axios.post(
        "http://localhost:4000/api/v1/deleteTask",
        { id }, // Include the task ID in the request body
        {
          headers: {
            "x-access-token": token, // Include the token in the request headers
          },
        }
      );
      // check if Task Deleted successfully
      if (response.data.message === "Task Deleted successfully") {
        setResult(response.data.UserData.ALLTask); // Update the result with the remaining Tasks after deletion
        alert(response.data.message); // Display success message
      }
    } catch (error) {
      // Handle errors that occur during the deletion process
      alert("Error: " + error.response.data.message); // Display an error message if deletion fails
    }
  };

  // Function to Update Task Details
  const updateTask = async (task) => {
    try {
      // Navigate to the update route with task ID and pass the task details as state using React Router's navigate function.
      navigate(`/update/${task._id}`, { state: { task } });
    } catch (error) {
      // Handle errors, if any, during navigation or task update
      console.error("Error while updating task:", error.message);
    }
  };

  // Function to Log Out User
  const LogoutUser = () => {
    // Retrieves the token from the local storage
    const token = localStorage.getItem("token");

    // if token is missing
    if (!token) {
      alert("Please Login First");

      // Redirect to the login page after 2 sec delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return; // return to prevent further execution
    }

    // else --> if token exist and user wants to logout

    // Remove the token from localStorage
    localStorage.removeItem("token");

    alert("Logged out successfully");

    // Redirect to the login page after 2 sec delay
    setTimeout(() => {
      navigate("/login");
    }, 2000);
    return; // return to prevent further execution
  };

  return (
    <div className="ListPage">
      {/* just to check all task list in browser console  */}
      {/* {console.log("ALL TASK LIST: ", result)}  */}

      {/* section 1 */}
      <div className="AddTask">
        <div className="header-h1">
          {" "}
          <h1 className="header1">To-Do App</h1>
        </div>
        <div className="header-btn">
          {" "}
          <button onClick={addTask} className="addtaskbtn">
            Create New Task
          </button>
          <button onClick={LogoutUser} className="logoutbtn">
            Logout
          </button>
        </div>
      </div>

      {/* section - 2 */}
      <div className="middle">
        <div className="middle-child">All Created Task</div>
      </div>

      {/* section - 3 */}
      <div className="ListTask">
        {/* Check if there are tasks in the 'result' array */}
        {result.length > 0 ? (
          // If there are tasks, map through each task in the 'result' array
          result.map((task, index) => (
            <div key={index} className="ListSequence">
              <div className="TaskContent">
                <div className="content-first">
                  <h1 style={{ color: "green" }}>
                    Title: <span style={{ color: "black" }}>{task.title}</span>
                  </h1>
                  <h2 style={{ color: "red" }}>
                    Description:{" "}
                    <span style={{ color: "black" }}>{task.description}</span>
                  </h2>
                  <h2 style={{ color: "blue" }}>
                    Due Date:{" "}
                    <span style={{ color: "grey" }}>{task.dueDate}</span>{" "}
                  </h2>
                  <h2 style={{ color: "purple" }}>
                    Status: <span style={{ color: "red" }}>{task.status}</span>{" "}
                  </h2>
                </div>
                <div className="content-btn">
                  <button onClick={() => updateTask(task)} className="editbtn">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="deletebtn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // If there are no tasks available
          <h1 className="noTask">No task created yet!</h1>
        )}
      </div>
    </div>
  );
};

export default Dash;
