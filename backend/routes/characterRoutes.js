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

module.exports = router;
