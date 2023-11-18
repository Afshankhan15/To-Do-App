// Import necessary modules and components
import "./Register.css"; // Import CSS file for styling
import Navbar from "../Navbar/Navbar"; // Import Navbar Component
import { useState } from "react"; // Import to manage state within functional components
import axios from "axios"; // Import Axios for making HTTP requests to server
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes
import { Link } from "react-router-dom"; // Import for navigation between routes

// Register component definition
const Register = () => {
  // Hook from React Router for navigation between routes
  const navigate = useNavigate();

  // State to manage User Registration Data
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Function to handle changes in input fields
  const handleChange = (e) => {
    // Destructure 'name' and 'value' from the input element
    const { name, value } = e.target;
    // Register with the new value corresponding to the changed input field
    setUser({ ...user, [name]: value });
  };

  // Function to asynchronously validate user input before submitting to the server
  const validateInput = () => {
    // Destructure user object to extract name, email, and password
    const { name, email, password } = user;

    // Check if any input field is empty
    if (!name || !email || !password) {
      alert("Please enter all details."); // Alert if any input field is empty
      return; // Return false to prevent submission
    }

    // Validate Name
    if (name.length < 5 || name.length > 24 || !/^[A-Za-z\s]+$/.test(name)) {
      alert(
        "Invalid name format. Name should be 5-24 characters, and contain only letters and spaces."
      ); // Alert if name doesn't meet length or format requirements
      return false; // Return false to prevent submission
    }

    // Validate Email using a regular expression
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email format. Please use the format 'user@domain.com'."); // Alert if email format is invalid
      return false; // Return false to prevent submission
    }

    // Validate Password length
    if (password.length < 6 || password.length > 25) {
      alert("Password must be between 6 and 25 characters."); // Alert if password length is invalid
      return false; // Return false to prevent submission
    }

    return true;
  };

  // Function to REGISTER USER
  const RegisterData = async () => {
    // Validate user input before registration
    if (validateInput()) {
      try {
        // Axios is used to make an HTTP POST request to a server endpoint (/register)
        const response = await axios.post(
          "http://localhost:4000/register",
          user // Include User Details in the request body
        );

        // If registration is successful, show success message and redirect to login page
        if (response.data.message === "Successfully Registered") {
          alert("Successfully Registered");
          // Redirect to the login page after 2 sec
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        // Handle registration errors
        alert(error.response.data.message); // Display error message if registration fails
      }
    }
  };

  // JSX for the Register component UI
  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-container">
          <p className="register-h1">Register</p>
          <div className="register-input">
            <input
              className="register-inputval"
              type="text"
              name="name"
              value={user.name}
              placeholder="Name *"
              onChange={handleChange} // Calls the handleChange function when the input value changes
              required // Indicates that the input is required and must be filled out
            />
            <input
              className="register-inputval"
              type="email"
              name="email"
              value={user.email}
              placeholder="Email *"
              onChange={handleChange}
              required
            />
            <input
              className="register-inputval"
              type="password"
              name="password"
              value={user.password}
              placeholder="Password *"
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-btnflex">
            <button onClick={RegisterData} className="register-btn">
              Sign Up
            </button>
            <Link to={"/"} style={{ color: "blue" }}>
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; // Export the Register component
