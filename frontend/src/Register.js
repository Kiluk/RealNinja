import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("⚠️ Wszystkie pola są wymagane!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });

      setMessage("✅ Konto zostało utworzone!");
      console.log(response.data);

      // Clear form fields after successful registration
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ Błąd podczas rejestracji");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Podaj nazwę użytkownika"
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Podaj email"
          />
        </div>

        <div className="input-group">
          <label>Hasło:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Podaj hasło"
          />
        </div>

        <button type="submit" className="register-btn">Zarejestruj</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
