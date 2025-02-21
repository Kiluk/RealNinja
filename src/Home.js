import React from "react";
import "./App.css";
import logo from "./shinobi.jpg";

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Shinobi" />
        <h1>Welcome to the Shinobi World</h1>
        <p>Trenuj jak prawdziwy ninja i odkryj jego tajemnice.</p>
      </header>
    </div>
  );
};

export default Home;
