import React, { useState } from "react";
import "../assetes/styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogInButton({ onClose, setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      
      const response = await axios.post("http://localhost:5000/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      onClose();
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Nieprawidłowe dane logowania");
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Zaloguj się</h2>
        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin}>Zaloguj</button>
        <button onClick={onClose}> Zamknij</button>
      </div>
    </div>
  );
}

export default LogInButton;
