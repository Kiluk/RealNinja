import React, { useState } from "react";
import "./Login.css"; // Stylizacja popupu

function LogInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Przycisk otwierający popup */}
      <button onClick={() => setIsOpen(true)} className="login-btn">
        Log in
      </button>

      {/* Popup logowania */}
      {isOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Zaloguj się</h2>
            <input type="text" placeholder="Login" className="input-field" />
            <input type="password" placeholder="Hasło" className="input-field" />
            
            <button className="submit-btn">Zaloguj</button>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogInButton;
