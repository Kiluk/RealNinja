import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assetes/styles/SkillTree.css";

const SkillTree = ({ characterId }) => {
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSkillTree = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/characters/${characterId}/skill-tree`,
          {
            headers: { Authorization: token },
          }
        );

        // Tworzymy strukturę drzewa
        const skillMap = {};
        response.data.forEach(
          (skill) => (skillMap[skill.id] = { ...skill, children: [] })
        );

        const rootSkills = [];
        response.data.forEach((skill) => {
          if (skill.prerequisite) {
            if (skillMap[skill.prerequisite]) {
              skillMap[skill.prerequisite].children.push(skillMap[skill.id]);
            }
          } else {
            rootSkills.push(skillMap[skill.id]);
          }
        });

        setSkills(rootSkills);
      } catch (error) {
        console.error("❌ Błąd pobierania drzewka umiejętności:", error);
      }
    };

    fetchSkillTree();
  }, [characterId]);

  const unlockSkill = async (skill) => {
    if (!skill.canUnlock) {
      setMessage(`⚠️ Nie spełniasz wymagań do odblokowania ${skill.name}.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/characters/${characterId}/unlock-skill`,
        { skillId: skill.id },
        { headers: { Authorization: token } }
      );

      setMessage(`✅ ${skill.name} został odblokowany!`);
      setSkills((prevSkills) =>
        prevSkills.map((s) =>
          s.id === skill.id ? { ...s, unlocked: true } : s
        )
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Błąd odblokowywania.");
    }
  };

  const renderSkillTree = (skills) => {
    return (
      <div className="skill-row">
        {skills.map((skill) => {
          let skillClass = "skill-card";
          if (skill.unlocked) {
            skillClass += " unlocked"; // Zielony
          } else if (skill.canUnlock) {
            skillClass += " can-unlock"; // Niebieski
          } else {
            skillClass += " locked"; // Szary
          }

          return (
            <div key={skill.id} className="skill-container">
              {/* Główna karta umiejętności */}
              <div className={skillClass}>
                <div
                  className="skill-content"
                  onClick={() => !skill.unlocked && unlockSkill(skill)}
                >
                  <h3>{skill.name}</h3>
                  <p>{skill.description}</p>
                  <p className="skill-requirements">
                    Wymagania: Nin {skill.requiredNinjutsu} | Tai{" "}
                    {skill.requiredTaijutsu} | Gen {skill.requiredGenjutsu}
                  </p>
                </div>
              </div>

              {/* Połączenie do dzieci */}
              {skill.children.length > 0 && (
                <div className="skill-children">
                  {/* Wycentrowana linia */}
                  <div className="skill-connection"></div>
                  {/* Renderowanie dzieci */}
                  <div className="skill-subtree">
                    {renderSkillTree(skill.children)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="skill-tree">
      <h2>Drzewko Umiejętności</h2>
      {message && <p>{message}</p>}
      <div className="tree-container">{renderSkillTree(skills)}</div>
    </div>
  );
};

export default SkillTree;
