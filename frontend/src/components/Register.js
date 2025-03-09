import React, { useState } from "react";
import "../assetes/styles/Register.css";

const RegisterPopup = ({ onClose }) => {
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
      setMessage("✅ Konto zostało utworzone!");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("❌ Błąd podczas rejestracji");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
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

        <button onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default RegisterPopup;
