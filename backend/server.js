require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  user: "sa",
  password: "UiS6zeG9WhdZI15",
  server: "localhost\\OPTIMA",
  database: "ninja_db",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Połączono z MSSQL!");
  } catch (err) {
    console.error("❌ Błąd połączenia z MSSQL:", err);
  }
};

connectDB();

// API do rejestracji
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.query(
      `INSERT INTO users (username, email, password) VALUES (@username, @email, @password)`,
      {
        username,
        email,
        password: hashedPassword,
      }
    );

    res.status(201).json({ message: "✅ Użytkownik zarejestrowany!" });
  } catch (error) {
    console.error("❌ Błąd rejestracji:", error);
    res.status(500).json({ message: "❌ Rejestracja nie powiodła się" });
  }
});

// API do logowania

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Otrzymano żądanie logowania:", username);

  if (!username || !password) {
    return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane!" });
  }

  try {
    console.log("Wysyłanie zapytania do bazy...");
    
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);

    const result = await request.query(`
      SELECT * FROM users WHERE username = @username
    `);

    console.log("Wynik zapytania SQL:", result.recordset);

    if (!result.recordset[0]) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }

    const user = result.recordset[0];
    console.log("Sprawdzanie hasła dla użytkownika:", user.username);

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({ message: "✅ Zalogowano!", token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("❌ Błąd logowania:", error);
    res.status(500).json({ message: "❌ Logowanie nie powiodło się" });
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Brak tokena, dostęp zabroniony!" });

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified; // 🛠 Przechowujemy dane użytkownika w `req.user`
    next();
  } catch (error) {
    res.status(403).json({ message: "Nieprawidłowy token!" });
  }
};

app.post("/save-character", authenticateToken, async (req, res) => {
  const { hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu } = req.body;

  if (!name || !clan) {
    return res.status(400).json({ message: "⚠️ Wprowadź nazwę postaci i klan!" });
  }

  try {
    const request = new sql.Request();
    request.input("user_id", sql.Int, req.user.id); // 🔥 Pobieramy `user_id` z tokena
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

    const result = await request.query(`
      INSERT INTO characters (user_id, hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu)
      VALUES (@user_id, @hp, @chakra, @name, @clan, @strength, @agility, @intelligence, @chakraControl, @ninJutsu, @genJutsu, @taiJutsu)
    `);

    res.status(201).json({ message: "✅ Postać zapisana!" });
  } catch (error) {
    console.error("❌ Błąd podczas zapisywania postaci:", error);
    res.status(500).json({ message: "❌ Błąd zapisu do bazy danych." });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
