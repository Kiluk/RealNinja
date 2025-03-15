import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/characters", {
        headers: { Authorization: token },
      });
      setCharacters(response.data);
    } catch (error) {
      console.error("❌ Błąd pobierania postaci:", error);
    }
  };

  const deleteCharacter = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę postać?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/characters/${id}`, {
        headers: { Authorization: token },
      });
      setCharacters(characters.filter((char) => char.id !== id));
    } catch (error) {
      console.error("❌ Błąd podczas usuwania postaci:", error);
    }
  };

  return (
    <div>
      <h2>Twoje postacie</h2>
      {characters.length === 0 ? (
        <p>Nie masz jeszcze żadnych postaci.</p>
      ) : (
        <ul>
          {characters.map((char) => (
            <li key={char.id}>
              <Link to={`/character/${char.id}`}>{char.name} - {char.clan}</Link>
              <button onClick={() => deleteCharacter(char.id)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterList;
