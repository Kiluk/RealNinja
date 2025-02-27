import React, { useState } from "react";
import "./CharacterCreation.css";
import axios from "axios"

const CharacterCreation = () => {
  const [characterName, setCharacterName] = useState("");
  const [clan, setClan] = useState("");
  const [message, setMessage] = useState("");


  const [stats, setStats] = useState({
    hp: 20,
    chakra: 10,
    strength: 5,
    agility: 5,
    intelligence: 5,
    chakraControl: 4,
    ninJutsu: 1,
    genJutsu: 1,
    taiJutsu: 1,
  });

  const handleStatChange = (stat, amount) => {
    setStats((prevStats) => ({
      ...prevStats,
      [stat]: Math.max(0, prevStats[stat] + amount), // Zapobiega wartościom ujemnym
    }));
  };

  const saveCharacter = async () => {
    if (!characterName || !clan) {
      setMessage("⚠️ Wprowadź nazwę postaci i wybierz klan!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/save-character", {
        hp: stats.hp,
        chakra: stats.chakra,
        name: characterName,
        clan,
        strength: stats.strength,
        agility: stats.agility,
        chakraControl: stats.chakraControl,
        intelligence: stats.intelligence,
        ninJutsu: stats.ninJutsu,
        genJutsu: stats.genJutsu,
        taiJutsu: stats.taiJutsu,
      });

      setMessage("✅ Postać została zapisana!");
      console.log(response.data);
    } catch (error) {
      setMessage("❌ Błąd podczas zapisywania postaci.");
      console.error("Error saving character:", error);
    }
  };


  return (
    <><div className="character-creation">
      <h1>Kreacja Postaci</h1>

      <div className="input-group">
        <label>Nazwa postaci:</label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Wpisz nazwę" />
      </div>

      <div className="input-group">
        <label>Wybierz klan:</label>
        <select value={clan} onChange={(e) => setClan(e.target.value)}>
          <option value="">-- Wybierz klan --</option>
          <option value="Uchiha">Uchiha</option>
          <option value="Senju">Senju</option>
          <option value="Hyuga">Hyuga</option>
          <option value="Nara">Nara</option>
          <option value="Akimichi">Akimichi</option>
        </select>
      </div>

      <div className="stats-container">
        {Object.keys(stats).map((stat) => (
          <div key={stat} className="stat">
            <span>{stat.toUpperCase()}</span>
            <button onClick={() => handleStatChange(stat, -1)}>-</button>
            <span className="stat-value">{stats[stat]}</span>
            <button onClick={() => handleStatChange(stat, 1)}>+</button>
          </div>
        ))}
      </div>
      <button onClick={saveCharacter} className="save-btn">
        Zapisz Postać
      </button>
      {message && <p className="message">{message}</p>}
    </div>
    <div className="summary">
        <h2>Podsumowanie</h2>
        <p><strong>Nazwa:</strong> {characterName || "Brak"}</p>
        <p><strong>Klan:</strong> {clan || "Nie wybrano"}</p>
        <p><strong>Statystyki:</strong> HP {stats.hp}, Chakra {stats.chakra}</p>
        <p> Siła {stats.strength}, Zręczność {stats.agility}, Inteligencja {stats.intelligence}, Kontrola Chakry {stats.chakraControl}</p>
        <p>Genjutsu {stats.genJutsu}. Taijutsu {stats.taiJutsu}, Ninjutsu {stats.ninJutsu}</p>

      </div></>
    
  );
};

export default CharacterCreation;
