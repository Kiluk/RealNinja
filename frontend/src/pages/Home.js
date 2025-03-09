import React from "react";
import "../assetes/styles/App.css";
import logo from "../assetes/images/shinobi.jpg";

const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} style={{ width: "64rem", height: "32rem" }} className="App-logo" alt="Shinobi" /> 
        <h1>Welcome to the Shinobi World</h1>
        <p>Odkrywaj jedyną w swoim rodzaju grę RPG w świecie shinobi</p>
      </header>
    </div>
  );
};

export default Home;
