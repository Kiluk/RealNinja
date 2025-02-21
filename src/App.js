import logo from './shinobi.jpg';
import './App.css';
import NavBar from './NavBar';

function App() {
  return (
      <div className="App">
        <header className="App-header" text="Real Ninja">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Welcome to the Shinobi World</p>
          <NavBar />
        </header>
      </div>
  );
}

export default App;
