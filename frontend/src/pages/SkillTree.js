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
        const response = await axios.get(`http://localhost:5000/api/characters/${characterId}/skill-tree`, {
          headers: { Authorization: token },
        });
        setSkills(response.data);
      } catch (error) {
        console.error("❌ Błąd pobierania drzewka umiejętności:", error);
      }
    };

    fetchSkillTree();
  }, [characterId]);

  useEffect(() => {
    const fetchSkillTree = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/characters/${characterId}/skill-tree`, {
          headers: { Authorization: token },
        });
        setSkills(response.data);
      } catch (error) {
        console.error("❌ Błąd pobierania drzewka umiejętności:", error);
      }
    };

    fetchSkillTree();
  }, [characterId]);

  const unlockSkill = async (skillId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/characters/${characterId}/unlock-skill`,
        { skillId },
        { headers: { Authorization: token } }
      );

      setMessage(response.data.message);
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, unlocked: true } : skill
        )
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Błąd odblokowywania.");
    }
  };

  return (
    <div className="skill-tree">
      <h2>Drzewko Umiejętności</h2>
      {message && <p>{message}</p>}
      <div className="tree-container">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`skill ${skill.unlocked ? "unlocked" : "locked"}`}
            onClick={() => !skill.unlocked && unlockSkill(skill.id)}
          >
            {skill.name}
            {skill.prerequisite && <span className="arrow">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
