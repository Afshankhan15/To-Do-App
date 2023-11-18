import "./CreateTask.css"; // Import CSS file for styling
import { useState } from "react"; // Import to manage state within functional components
import axios from "axios"; // Import Axios for making HTTP requests to server
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes

const CreateTask = () => {
  const navigate = useNavigate();

  // useState hook to manage the state of 'task' object
  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [taskList, setTaskList] = useState([]); // State to store fetched tasks List

  // Function to handle changes in input fields and Create the 'task' state accordingly
  const handleChange = (e) => {
    // Destructure 'name' and 'value' from the input element
    const { name, value } = e.target;
    // Create the 'task' state with the new value corresponding to the changed input field
    setTask({ ...task, [name]: value });
  };

  // Function to Create Task
  const createTask = async () => {
    // Get Task details
    const { title, description, due_date } = task;

    // Retrieves the token from the local storage
    const token = localStorage.getItem("token");

    // If token is missing, show the alert message
    if (!token) {
      alert("Please Login to Create New Tasks");
      // setTimeout is added to delay the redirect to the login page after showing the alert message
      setTimeout(() => {
        navigate("/login"); // Redirect to the login page
      }, 1000); // Adjust the delay as needed (e.g., 1000 milliseconds -> 1 second)

      return; // Return to prevent further execution of the code
    }

    // Validate Title and Description
    if (!title || !description) {
      // Check if either title or description is missing
      if (!title && description) {
        alert("Title is required");
      } else if (title && !description) {
        alert("Description is required");
      } else {
        alert("Both title and description are required");
      }
      return; // Return to prevent further execution if title or description is missing
    }
    // Check if due_date is not provided
    else if (!due_date) alert("Please Enter Due Date");
    // Proceed if all validations are successful
    else {
      // Get the Current date in the format of yyyy-mm-dd
      const today = new Date().toISOString().split("T")[0];

      // Check if due_date is less than today's date
      if (due_date < today) {
        alert("Please do not select past dates");
        return; // Return to prevent further execution if due_date is in the past
      }

      // If all validations pass, proceed to create the task
      try {
        // Axios is used to make an HTTP POST request to a server endpoint (api/v1/createTask)
        const response = await axios.post(
          "http://localhost:4000/api/v1/createTask",
          task, // Include the task details
          {
            headers: {
              "x-access-token": token, // Include the token in the request headers for authorization
            },
          }
        );

        // Check if the task was created successfully
        if (response.data.message === "Tasks Created Successfully") {
          alert(response.data.message);

          // Redirect to the dash page after a 1-second delay
          setTimeout(() => {
            navigate("/dash");
          }, 1000);
          // Clear input fields after successful creation
          setTask({ title: "", description: "", due_date: "" });
        }
      } catch (error) {
        // error : user already registered or any other error
        // Handle errors during task creation
        alert("Error during Task Creation: " + error.response.data.message);
      }
    }
  };

  return (
    <div className="CreatePage">
      {/* textfield and CreateButton exist inside Createcontainer */}
      <div className="Createcontainer">
        {/* Ensure All Task List in browser conslole*/}
        {console.log("All Task: ", taskList)}

        {/* textfield block element */}
        <div className="textfield">
          <input
            className="inputfield"
            type="text"
            name="title"
            value={task.title}
            placeholder="Title *"
            onChange={handleChange} // Calls the handleChange function when the input value changes
            required // Indicates that the input is required and must be filled out
          />
          <textarea
            className="inputfield"
            type="text"
            name="description"
            value={task.description}
            placeholder="Add Description *"
            onChange={handleChange}
            rows={5}
            required
          />
          <input
            className="inputfield"
            id="dateInput"
            type="date"
            name="due_date"
            value={task.due_date}
            placeholder="Due Date *"
            onChange={handleChange}
            required
          />
        </div>

        {/* CreateButton block element */}
        <div className="CreateButton">
          <button onClick={createTask} className="addTask">
            Create New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
