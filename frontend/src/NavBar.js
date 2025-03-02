import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogInButton from "./LogInButton";
import RegisterPopup from "./Register";

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/charactercreation">Character Creation</Link>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button onClick={() => setShowLogin(true)}>Login</button>
            <button onClick={() => setShowRegister(true)}>Register</button>
          </>
        )}
      </div>

      {showLogin && <LogInButton onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} />}
      {showRegister && <RegisterPopup onClose={() => setShowRegister(false)} />}
    </nav>
  );
}

export default NavBar;
