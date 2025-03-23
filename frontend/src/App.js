import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import RegisterPopup from "./components/Register";
import CharacterCreation from "./pages/CharacterCreation";
import LogInButton from "./components/LogInButton";
import CharacterList from "./pages/CharacterList";
import CharacterDetails from "./pages/CharacterDetails";
import BoardPage from "./pages/BoardPage"; // 🆕 import u góry

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogInButton />} />
          <Route path="/register" element={<RegisterPopup />} />
          <Route path="/charactercreation" element={<CharacterCreation />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
