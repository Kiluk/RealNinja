import React, { useState } from "react";
import "../assetes/styles/CharacterCreation.css";
import axios from "axios";

const statDescriptions = {
  vigor: "Zwiększa punkty życia i wpływa na siłę fizyczną.",
  intelligence: "Zwiększa kontrolę chakry i skuteczność Genjutsu.",
};

const clans = {
  Uchiha: { cost: 8, multipliers: { genJutsu: 3, ninJutsu: 2, chakraControl: 1 }, description: "Mistrzowie Genjutsu i Ninjutsu." },
  Senju: { cost: 10, multipliers: { ninJutsu: 3, chakra: 2, hp: 1 }, description: "Silne ciało i ogromna kontrola chakry." },
  Hyuga: { cost: 7, multipliers: { chakraControl: 3, speed: 2, taiJutsu: 1 }, description: "Specjaliści w Taijutsu i kontroli chakry." },
  Nara: { cost: 5, multipliers: { intelligence: 3, genJutsu: 2, chakra: 1 }, description: "Inteligentni taktycy z umiejętnością manipulacji cieniem." },
  Akimichi: { cost: 3, multipliers: { hp: 3, vigor: 2, taiJutsu: 1 }, description: "Potężne ciało i specjalizacja w Taijutsu." },
};

const getStatCost = (value) => {
  return Math.floor(value / 2 + 1);
};

const CharacterCreation = () => {
  const [step, setStep] = useState(1);
  const [characterName, setCharacterName] = useState("");
  const [clan, setClan] = useState("");
  const [points, setPoints] = useState(30);
  const [stats, setStats] = useState({ vigor: 0, intelligence: 0 });
  const [finalStats, setFinalStats] = useState({});
  const [message, setMessage] = useState("");

  const handleStatChange = (stat, amount) => {
    const cost = amount > 0 ? getStatCost(stats[stat]) : getStatCost(stats[stat]-1);
    if (points - cost < 0 || stats[stat] + amount < 0) return;
    setStats((prev) => ({ ...prev, [stat]: prev[stat] + amount }));
    amount > 0 ? setPoints(points - cost) : setPoints(points + cost);
  };

  const handleClanChange = (selectedClan) => {
    if (points < clans[selectedClan].cost) return;
    setClan(selectedClan);
    setPoints(20 - clans[selectedClan].cost - stats.vigor - stats.intelligence);
  };

  const goToStep2 = () => {
    if (!characterName || !clan ) {
      setMessage("⚠️ Wybierz nazwę i klan!");
      return;
    }
    setStep(2);
    setPoints(15);
    setFinalStats({
      hp: 1,
      chakra: 1,
      speed: 1,
      chakraControl: 1,
      ninJutsu: 1,
      genJutsu: 1,
      taiJutsu: 1,
    });
  };

  const applyMultipliers = () => {
    const multipliers = clans[clan].multipliers;
    const { vigor, intelligence } = stats;
    
    return {
      vigor: stats.vigor,
      intelligence: stats.intelligence,
      hp: finalStats.hp * (vigor  + (multipliers.hp || 0))* 5,
      chakra: finalStats.chakra * (vigor  + intelligence * 10 + (multipliers.chakra || 0))* 5,
      speed: finalStats.speed *( vigor + (multipliers.speed || 0)),
      chakraControl: finalStats.chakraControl * (intelligence + (multipliers.chakraControl || 0)),
      ninJutsu: finalStats.ninJutsu * Math.floor((vigor + intelligence) / 2) + (multipliers.ninJutsu || 0),
      genJutsu: finalStats.genJutsu * (intelligence + (multipliers.genJutsu || 0)),
      taiJutsu: finalStats.taiJutsu * (vigor + (multipliers.taiJutsu || 0)),
    };
  };

  const handleFinalStatChange = (stat, amount) => {
    if (points - amount < 0 || finalStats[stat] + amount < 0) return;
    setFinalStats((prev) => ({ ...prev, [stat]: prev[stat] + amount }));
    setPoints(points - amount);
  };

  const saveCharacter = async () => {
    const newStats = applyMultipliers();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Musisz być zalogowany, aby stworzyć postać!");
        return;
      }

      await axios.post("http://localhost:5000/api/characters/save-character", {
        name: characterName,
        clan,
        ...newStats,
      }, {
        headers: { Authorization: token },
      });
      setMessage("✅ Postać została zapisana!");
    } catch (error) {
      setMessage("❌ Błąd podczas zapisywania postaci.");
    }
  };

  return (
    <div className="character-creation">
      {step === 1 ? (
        <>
          <h1>Krok 1: Wybierz podstawowe atrybuty</h1>
          <input type="text" placeholder="Nazwa postaci" value={characterName} onChange={(e) => setCharacterName(e.target.value)} />
          <select value={clan} onChange={(e) => handleClanChange(e.target.value)}>
            <option value="">-- Wybierz klan --</option>
            {Object.keys(clans).map((c) => (
              <option key={c} value={c}>{c} (Koszt: {clans[c].cost})</option>
            ))}
          </select>
          <p>{clan && clans[clan].description}</p>
          {Object.keys(stats).map((stat) => (
            <div key={stat} title={statDescriptions[stat]}>
              {stat.toUpperCase()}: {stats[stat]} 
              <button onClick={() => handleStatChange(stat, 1)}>+</button>
              <button onClick={() => handleStatChange(stat, -1)}>-</button>
            </div>
          ))}
          <p>Pozostałe punkty: {points}</p>
          <button onClick={goToStep2}>Dalej</button>
        </>
      ) : (
        <>
          <h1>Krok 2: Rozdziel statystyki</h1>
          {Object.keys(finalStats).map((stat) => (
            <div key={stat}>{stat.toUpperCase()}: {finalStats[stat]} <button onClick={() => handleFinalStatChange(stat, 1)}>+</button><button onClick={() => handleFinalStatChange(stat, -1)}>-</button></div>
          ))}
          <p>Pozostałe punkty: {points}</p>
          <button onClick={saveCharacter}>Zapisz Postać</button>
        </>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CharacterCreation;