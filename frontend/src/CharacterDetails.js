import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/characters/${id}`, {
          headers: { Authorization: token },
        });
        setCharacter(response.data);
      } catch (error) {
        console.error("❌ Błąd pobierania szczegółów postaci:", error);
      }
    };

    fetchCharacter();
  }, [id]);

  if (!character) {
    return <p>Ładowanie postaci...</p>;
  }

  return (
    <div>
      <h2>{character.name} - {character.clan}</h2>
      <p>HP: {character.hp}</p>
      <p>Chakra: {character.chakra}</p>
      <p>Siła: {character.strength}</p>
      <p>Zręczność: {character.agility}</p>
      <p>Inteligencja: {character.intelligence}</p>
      <p>Kontrola Chakry: {character.chakraControl}</p>
      <p>Ninjutsu: {character.ninJutsu}</p>
      <p>Genjutsu: {character.genJutsu}</p>
      <p>Taijutsu: {character.taiJutsu}</p>
    </div>
  );
};

export default CharacterDetails;
