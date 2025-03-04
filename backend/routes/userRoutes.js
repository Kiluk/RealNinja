const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql } = require("../config/db");

const router = express.Router();

// Rejestracja użytkownika
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, hashedPassword);

    await request.query(`
      INSERT INTO users (username, email, password)
      VALUES (@username, @email, @password)
    `);

    res.status(201).json({ message: "✅ Użytkownik zarejestrowany!" });
  } catch (error) {
    console.error("❌ Błąd rejestracji:", error);
    res.status(500).json({ message: "❌ Rejestracja nie powiodła się" });
  }
});

// Logowanie użytkownika
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane!" });
  }

  try {
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    const result = await request.query(`SELECT * FROM users WHERE username = @username`);

    if (!result.recordset[0]) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }

    const user = result.recordset[0];
    
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({ message: "✅ Zalogowano!", token });
  } catch (error) {
    console.error("❌ Błąd logowania:", error);
    res.status(500).json({ message: "❌ Logowanie nie powiodło się" });
  }
});

module.exports = router;
