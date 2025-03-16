const express = require("express");
const { sql } = require("../../config/db");
const authenticateToken = require("../../middleware/auth");

const router = express.Router();

router.get("/:id/stats", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const result = await request.query(`
      SELECT id, name, clan, hp, chakra, vigor, speed, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu
      FROM characters WHERE id = @id
    `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Błąd pobierania statystyk postaci:", error);
    res.status(500).json({ message: "❌ Wystąpił problem podczas pobierania statystyk postaci." });
  }
});

router.put("/:id/stats", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ninjutsu, taijutsu, genjutsu } = req.body;

    const request = new sql.Request();
    request.input("id", sql.Int, id);
    request.input("ninjutsu", sql.Int, ninjutsu);
    request.input("taijutsu", sql.Int, taijutsu);
    request.input("genjutsu", sql.Int, genjutsu);

    await request.query(`
      UPDATE characters 
      SET ninjutsu = @ninjutsu, taijutsu = @taijutsu, genjutsu = @genjutsu 
      WHERE id = @id
    `);

    res.status(200).json({ message: "✅ Statystyki postaci zostały zaktualizowane!" });
  } catch (error) {
    console.error("❌ Błąd aktualizacji statystyk postaci:", error);
    res.status(500).json({ message: "❌ Nie udało się zaktualizować statystyk." });
  }
});

module.exports = router;
