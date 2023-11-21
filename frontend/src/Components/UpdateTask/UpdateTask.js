import "./UpdateTask.css"; // Import CSS file for styling
import { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests to server
import { useParams } from "react-router-dom"; // Import useParams to extract Task id from Dash.js page
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes
import { useLocation } from "react-router-dom"; // it Provides access to the current location object in React

const UpdateTask = () => {
  const navigate = useNavigate();

  const { id } = useParams(); // Get the 'id' from the URL {/update/${task._id}}

  const location = useLocation();
  const { state } = location; // Destructuring to get the state object from location

  // task_details is set to state.task if state exists, otherwise, it defaults to null
  const task_details = state ? state.task : null;

  // Ensure task_details is received properly
  console.log("Received Task: ", task_details);

  // useState hook to manage the state of 'task' object
  const [task, setTask] = useState({
    title: task_details ? task_details.title : "", // // Initialize title based on task_details or empty string if null
    description: task_details ? task_details.description : "", // // Initialize description based on task_details or empty string if null
    due_date: task_details ? task_details.due_date : "", // // Initialize due_date based on task_details or empty string if null
    status: task_details ? task_details.status : "", // // Initialize status based on task_details or empty string if null
  });

  // Function to handle changes in input fields and update the 'task' state accordingly
  const handleChange = (e) => {
    // Destructure 'name' and 'value' from the input element
    const { name, value } = e.target;
    // Update the 'task' state with the new value corresponding to the changed input field
    setTask({ ...task, [name]: value });
  };

  // Function to Update task details
  const updateTask = async () => {
    //  Retrieves the authentication token stored in the browser's local storage.
    const token = localStorage.getItem("token");

    const { title, description, due_date, status } = task;

    // Check if title and description are not present
    if (!title && !description) {
      alert("Please at least select title or description to update");
      return; // return back
    }

    // If everything is fine above, then execute
    try {
      // Axios is used to make an HTTP POST request to a server endpoint (/api/v1/UpdateTask/:id)
      const response = await axios.post(
        `http://localhost:4000/api/v1/UpdateTask/${id}`, // Include the id in the URL
        { title, description, due_date, status }, // Include only the new selected { title, description, due_date, & status } in the request body
        // includes header that is commonly used for authentication or authorization purposes
        {
          headers: {
            "x-access-token": token, // Set the token in the header for authorization
          },
        }
      );

      // Check if Task Updated Successfully
      if (response.data.message === "Task Updated Successfully") {
        alert(response.data.message);

        // Redirect to the '/dash' page after a 1-second delay
        setTimeout(() => {
          navigate("/dash");
        }, 1000);
      }
    } catch (error) {
      // Handle errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert("Error: " + error.response.data.message);
      } else {
        alert("Error updating task");
      }
    }
  };

  return (
    <div className="UpdatePage">
      {/* {console.log("User ID : ", id)}  */}
      {/* {console.log("Task Details Check", task_details)} */}

      {/* textfield and UpdateButton exist inside Updatecontainer */}
      <div className="Updatecontainer">
        {/* textfield block element */}
        <div className="textfield-update">
          <input
            className="inputfield-update"
            type="text"
            name="title"
            value={task.title}
            placeholder="Title *"
            onChange={handleChange} // Calls the handleChange function when the input value changes
            required // Indicates that the input is required and must be filled out
          />
          <textarea
            className="inputfield-update"
            type="text"
            name="description"
            value={task.description}
            placeholder="Add Description *"
            onChange={handleChange} // calls the handleChange function when the input value changes
            rows={5}
            required
          />
          <input
            className="inputfield-update"
            type="date"
            name="due_date"
            value={task.due_date}
            placeholder="Due Date *"
            onChange={handleChange} // / Calls the handleChange function when the input value changes
            required
          />
          <input
            className="inputfield-update"
            type="text"
            name="status"
            value={task.status}
            placeholder="Status *"
            onChange={handleChange} // Calls the handleChange function when the input value changes
            required
          />

          {/* UpdateButton */}
          <button onClick={() => updateTask(task._id)} className="UpdateTasks">
            Update New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
