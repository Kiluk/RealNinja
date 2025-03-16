const express = require("express");
const { sql } = require("../../config/db");
const authenticateToken = require("../../middleware/auth");

const router = express.Router();

// Pobranie wszystkich postaci użytkownika
router.get("/", authenticateToken, async (req, res) => {
  try {
    const request = new sql.Request();
    request.input("user_id", sql.Int, req.user.id);
    const result = await request.query(`
      SELECT id, name, clan
      FROM characters WHERE user_id = @user_id
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Błąd pobierania postaci:", error);
    res.status(500).json({ message: "❌ Wystąpił problem podczas pobierania postaci." });
  }
});

// Tworzenie nowej postaci
router.post("/save-character", authenticateToken, async (req, res) => {
  try {
    const { name, clan, hp, chakra, vigor, intelligence, speed, chakraControl, ninJutsu, taiJutsu, genJutsu } = req.body;

    if (!name || !clan) {
      return res.status(400).json({ message: "⚠️ Wprowadź nazwę i klan postaci!" });
    }

    const request = new sql.Request();
    console.log(req.body);
    request.input("user_id", sql.Int, req.user.id);
    request.input("name", sql.VarChar, name);
    request.input("clan", sql.VarChar, clan);
    request.input("hp", sql.Int, hp);
    request.input("chakra", sql.Int, chakra);
    request.input("vigor", sql.Int, vigor);
    request.input("speed", sql.Int, speed);
    request.input("intelligence", sql.Int, intelligence);
    request.input("chakraControl", sql.Int, chakraControl);
    request.input("ninJutsu", sql.Int, ninJutsu);
    request.input("taiJutsu", sql.Int, taiJutsu);
    request.input("genJutsu", sql.Int, genJutsu);

    await request.query(`
      INSERT INTO characters (user_id, name, clan, hp, chakra, vigor, speed, intelligence, chakraControl, ninJutsu, taiJutsu, genJutsu)
      VALUES (@user_id, @name, @clan, @hp, @chakra, @vigor, @intelligence, @speed, @chakraControl, @ninJutsu, @taiJutsu, @genJutsu)
    `);

    res.status(201).json({ message: "✅ Postać została utworzona!" });
  } catch (error) {
    console.error("❌ Błąd tworzenia postaci:", error);
    res.status(500).json({ message: "❌ Nie udało się stworzyć postaci." });
  }
});

// Usuwanie postaci
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input("id", sql.Int, id);
    request.input("user_id", sql.Int, req.user.id);

    // Sprawdzenie, czy postać należy do użytkownika
    const checkResult = await request.query(`
      SELECT id FROM characters WHERE id = @id AND user_id = @user_id
    `);

    if (!checkResult.recordset[0]) {
      return res.status(404).json({ message: "⚠️ Postać nie została znaleziona lub nie należy do Ciebie." });
    }

    // Usunięcie postaci
    await request.query(`DELETE FROM characters WHERE id = @id AND user_id = @user_id`);

    res.status(200).json({ message: "✅ Postać została usunięta." });
  } catch (error) {
    console.error("❌ Błąd usuwania postaci:", error);
    res.status(500).json({ message: "❌ Wystąpił problem podczas usuwania postaci." });
  }
});

module.exports = router;
