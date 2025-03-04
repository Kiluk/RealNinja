import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import Register from "./Register";
import CharacterCreation from "./CharacterCreation";
import LogInButton from "./LogInButton";
import CharacterList from "./CharacterList";
import CharacterDetails from "./CharacterDetails";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogInButton />} />
          <Route path="/register" element={<Register />} />
          <Route path="/charactercreation" element={<CharacterCreation />} />
          <Route path="/characters" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
