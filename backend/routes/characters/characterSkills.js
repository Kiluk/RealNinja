const express = require("express");
const { sql } = require("../../config/db");
const authenticateToken = require("../../middleware/auth");

const router = express.Router();

// Pobieranie drzewka umiejętności
router.get("/:id/skill-tree", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Pobranie statystyk postaci
    const charRequest = new sql.Request();
    charRequest.input("id", sql.Int, id);
    const charResult = await charRequest.query(`
      SELECT clan, ninjutsu, taijutsu, genjutsu FROM characters WHERE id = @id
    `);

    if (!charResult.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona." });
    }

    const { clan, ninjutsu, taijutsu, genjutsu } = charResult.recordset[0];

    // Pobranie umiejętności dostępnych dla klanu
    const skillRequest = new sql.Request();
    skillRequest.input("clan", sql.VarChar, clan);
    const skillResult = await skillRequest.query(`
      SELECT id, name, description, prerequisite_id, required_ninjutsu, required_taijutsu, required_genjutsu 
      FROM skills WHERE clan = @clan
    `);

    // Pobranie odblokowanych umiejętności
    const unlockedRequest = new sql.Request();
    unlockedRequest.input("character_id", sql.Int, id);
    const unlockedResult = await unlockedRequest.query(`
      SELECT skill_id FROM character_skills WHERE character_id = @character_id AND unlocked = 1
    `);
    const unlockedSkills = unlockedResult.recordset.map(row => row.skill_id);

    // Tworzymy drzewko umiejętności
    const skillTree = skillResult.recordset.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      prerequisite: skill.prerequisite_id,
      requiredNinjutsu: skill.required_ninjutsu,
      requiredTaijutsu: skill.required_taijutsu,
      requiredGenjutsu: skill.required_genjutsu,
      unlocked: unlockedSkills.includes(skill.id),
      canUnlock: ninjutsu >= skill.required_ninjutsu &&
                 taijutsu >= skill.required_taijutsu &&
                 genjutsu >= skill.required_genjutsu
    }));

    res.status(200).json(skillTree);
  } catch (error) {
    console.error("❌ Błąd pobierania drzewka umiejętności:", error);
    res.status(500).json({ message: "❌ Błąd pobierania danych drzewka umiejętności." });
  }
});

// Odblokowanie umiejętności
router.put("/:id/unlock-skill", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({ message: "⚠️ Nie podano ID umiejętności." });
    }

    // Pobranie wymagań umiejętności
    const skillRequest = new sql.Request();
    skillRequest.input("skill_id", sql.Int, skillId);
    const skillResult = await skillRequest.query(`
      SELECT prerequisite_id, required_ninjutsu, required_taijutsu, required_genjutsu 
      FROM skills WHERE id = @skill_id
    `);

    if (!skillResult.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Umiejętność nie istnieje." });
    }

    const { prerequisite_id, required_ninjutsu, required_taijutsu, required_genjutsu } = skillResult.recordset[0];

    // Pobranie statystyk postaci
    const charRequest = new sql.Request();
    charRequest.input("character_id", sql.Int, id);
    const charResult = await charRequest.query(`
      SELECT ninjutsu, taijutsu, genjutsu FROM characters WHERE id = @character_id
    `);

    if (!charResult.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona." });
    }

    const { ninjutsu, taijutsu, genjutsu } = charResult.recordset[0];

    // Sprawdzamy wymagane poziomy umiejętności
    if (ninjutsu < required_ninjutsu || taijutsu < required_taijutsu || genjutsu < required_genjutsu) {
      return res.status(400).json({ message: "⚠️ Nie spełniasz wymagań tej umiejętności!" });
    }

    // Odblokowanie umiejętności
    const unlockRequest = new sql.Request();
    unlockRequest.input("character_id", sql.Int, id);
    unlockRequest.input("skill_id", sql.Int, skillId);
    await unlockRequest.query(`
      INSERT INTO character_skills (character_id, skill_id, unlocked) 
      VALUES (@character_id, @skill_id, 1)
    `);

    res.status(200).json({ message: "✅ Umiejętność odblokowana!" });
  } catch (error) {
    console.error("❌ Błąd odblokowywania umiejętności:", error);
    res.status(500).json({ message: "❌ Błąd odblokowywania umiejętności." });
  }
});

module.exports = router;
