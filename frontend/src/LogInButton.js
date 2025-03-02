import React, { useState } from "react";
import "./Login.css"; // Stylizacja popupu

function LogPopup({ onClose }) {
  return (
        <div className="popup">
          <div className="popup-inner">
            <h2>Zaloguj się</h2>
            <input type="text" placeholder="Login" className="input-field" />
            <input type="password" placeholder="Hasło" className="input-field" />
            <button className="submit-btn">Zaloguj</button>
            <button onClick={(onClose)}> Zamknij</button>
          </div>
        </div>
  );
}

export default LogInButton;
