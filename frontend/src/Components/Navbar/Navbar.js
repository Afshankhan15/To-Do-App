import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="Navbar">
        <ul className="Navbar-links">
          <li>
            <Link to="/">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dash">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
