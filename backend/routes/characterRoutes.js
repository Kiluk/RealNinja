const express = require("express");
const { sql } = require("../config/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Zapisywanie postaci
router.post("/save-character", authenticateToken, async (req, res) => {
  const { hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu } = req.body;
  if (!name || !clan) {
    return res.status(400).json({ message: "⚠️ Wprowadź nazwę postaci i klan!" });
  }

  try {
    const request = new sql.Request();
    request.input("user_id", sql.Int, req.user.id);
    request.input("hp", sql.Int, hp);
    request.input("chakra", sql.Int, chakra);
    request.input("name", sql.VarChar, name);
    request.input("clan", sql.VarChar, clan);
    request.input("strength", sql.Int, strength);
    request.input("agility", sql.Int, agility);
    request.input("intelligence", sql.Int, intelligence);
    request.input("chakraControl", sql.Int, chakraControl);
    request.input("ninJutsu", sql.Int, ninJutsu);
    request.input("genJutsu", sql.Int, genJutsu);
    request.input("taiJutsu", sql.Int, taiJutsu);

    await request.query(`
      INSERT INTO characters (user_id, hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu)
      VALUES (@user_id, @hp, @chakra, @name, @clan, @strength, @agility, @intelligence, @chakraControl, @ninJutsu, @genJutsu, @taiJutsu)
    `);

    res.status(201).json({ message: "✅ Postać zapisana!" });
  } catch (error) {
    console.error("❌ Błąd podczas zapisywania postaci:", error);
    res.status(500).json({ message: "❌ Błąd zapisu do bazy danych." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const request = new sql.Request();
    request.input("user_id", sql.Int, req.user.id);
    const result = await request.query(`
      SELECT id, name, clan, hp, chakra, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu 
      FROM characters WHERE user_id = @user_id
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Błąd pobierania postaci:", error);
    res.status(500).json({ message: "❌ Błąd pobierania postaci." });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request();
    request.input("character_id", sql.Int, id);
    request.input("user_id", sql.Int, req.user.id);

    const result = await request.query(`
      SELECT * FROM characters WHERE id = @character_id AND user_id = @user_id
    `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Błąd pobierania postaci:", error);
    res.status(500).json({ message: "❌ Błąd pobierania danych postaci." });
  }
});

router.get("/:id/skill-tree", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Pobieramy klan postaci
    const charRequest = new sql.Request();
    charRequest.input("id", sql.Int, id);
    const charResult = await charRequest.query(`SELECT clan FROM characters WHERE id = @id`);

    if (!charResult.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona." });
    }

    const clan = charResult.recordset[0].clan;

    // Pobieramy wszystkie skille dla klanu postaci
    const skillRequest = new sql.Request();
    skillRequest.input("clan", sql.VarChar, clan);
    const skillResult = await skillRequest.query(`
      SELECT id, name, prerequisite_id FROM skills WHERE clan = @clan
    `);

    // Pobieramy odblokowane skille dla postaci
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
      prerequisite: skill.prerequisite_id,
      unlocked: unlockedSkills.includes(skill.id),
    }));

    res.status(200).json(skillTree);
  } catch (error) {
    console.error("❌ Błąd pobierania drzewka umiejętności:", error);
    res.status(500).json({ message: "❌ Błąd pobierania danych drzewka umiejętności." });
  }
});

module.exports = router;
