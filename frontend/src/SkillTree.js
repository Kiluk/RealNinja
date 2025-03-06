import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillTree.css";

const SkillTree = ({ characterId }) => {
  const [skills, setSkills] = useState([]);

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

  return (
    <div className="skill-tree">
      <h2>Drzewko Umiejętności</h2>
      <div className="tree-container">
        {skills.map((skill) => (
          <div key={skill.id} className={`skill ${skill.unlocked ? "unlocked" : "locked"}`}>
            {skill.name}
            {skill.prerequisite && <span className="arrow">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
