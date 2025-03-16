import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SkillTree from "./SkillTree";

const CharacterDetails = ({}) => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [showSkillTree, setShowSkillTree] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/characters/${id}/stats`, {
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
      <p>Siła: {character.vigor}</p>
      <p>Zręczność: {character.speed}</p>
      <p>Inteligencja: {character.intelligence}</p>
      <p>Kontrola Chakry: {character.chakraControl}</p>
      <p>Ninjutsu: {character.ninJutsu}</p>
      <p>Genjutsu: {character.genJutsu}</p>
      <p>Taijutsu: {character.taiJutsu}</p>

      <div>
      <h2>{character.name} - {character.clan}</h2>
      <button onClick={() => setShowSkillTree(!showSkillTree)}>
        {showSkillTree ? "Ukryj Drzewko Umiejętności" : "Pokaż Drzewko Umiejętności"}
      </button>

      {showSkillTree && <SkillTree characterId={character.id} />}
    </div>
    </div>
  );
};

export default CharacterDetails;
