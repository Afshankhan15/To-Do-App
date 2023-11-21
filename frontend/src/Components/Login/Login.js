import React from "react";
import "./Login.css"; // Import CSS file for styling
import Navbar from "../Navbar/Navbar"; // Import Navbar
import { useState } from "react"; // Import to manage state within functional components
import axios from "axios"; // Import Axios for making HTTP requests to server
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes
import { Link } from "react-router-dom"; // Import for navigation between routes

const Login = () => {
  // Hook from React Router for navigation between routes
  const navigate = useNavigate();

  // State to manage User LOGIN Data
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Function to handle changes in input fields While LOGIN
  const handleChange = (e) => {
    // Destructure 'name' and 'value' from the input element
    const { name, value } = e.target;
    // LOGIN with the value corresponding to the changed input field
    setUser({ ...user, [name]: value });
  };

  // Email validation
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // Function to LOGIN USER
  const LoginData = async () => {
    // Destructure email and password from the user object
    const { email, password } = user;

    // Check if both email and password are provided
    if (email && password) {
      // Validate email format
      if (validateEmail(email)) {
        // Validate password length
        if (password.length >= 6 && password.length <= 25) {
          try {
            // AXIOS used to make HTTP POST request to a local server endpoint {/login}
            const response = await axios.post(
              "http://localhost:4000/login",
              user // // Include User Details in the request body
            );

            // Upon successful login, obtain the user token from the server's response
            if (response.data.UserData.userToken) {
              // Store the received token in the user's local storage
              localStorage.setItem("token", response.data.UserData.userToken);

              // Display a success message for the logged-in user
              alert(
                `${response.data.UserData.LoginUser.name} Login Successfully`
              );

              // Redirect to the '/dash' To-Do App page after a delay of 2 seconds
              setTimeout(() => {
                navigate("/dash");
              }, 2000);
            }
          } catch (error) {
            // error : user already registered or any other error
            // Handle login errors and display an error message
            alert("Error during Login: " + error.response.data.message);
          }
        } else {
          alert("Password must be between 6 and 25 characters");
        }
      } else {
        alert("Email must be in the format 'user@domain.com");
      }
    } else {
      alert("Please Enter both Email and Password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          {/* section - 1 */}
          <div className="h1">Login</div>

          {/* section - 2 */}
          <div className="input">
            <input
              className="inputval"
              type="email"
              name="email"
              value={user.email}
              placeholder="Email *"
              onChange={handleChange} // Calls the handleChange function when the input value changes
              required // Indicates that the input is required and must be filled out
            />
            <input
              className="inputval"
              type="password"
              name="password"
              value={user.password}
              placeholder="Password *"
              onChange={handleChange}
              required
            />

            <button onClick={LoginData} className="loginbtn">
              Login
            </button>
            <Link to={"/"} className="linkcss2">
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
