import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/register">Rejestracja</Link>
      <button onClick={() => setShowLogin(true)}>Login</button>   {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      <Link to="/charactercreation">Character Creation</Link>
    </nav>
  );
}

export default NavBar;