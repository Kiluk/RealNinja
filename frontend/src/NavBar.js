import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/register">Rejestracja</Link>
      <Link to="/login">Login</Link>
      <Link to="/charactercreation">Character Creation</Link>
    </nav>
  );
}

export default NavBar;