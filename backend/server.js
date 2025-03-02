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

// **API do rejestracji**
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

// **API do logowania**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email i hasło są wymagane!" });
  }

  try {
    const result = await sql.query(
      `SELECT * FROM users WHERE email = @email`,
      { email }
    );

    if (!result.recordset[0]) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "❌ Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({ message: "✅ Zalogowano!", token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("❌ Błąd logowania:", error);
    res.status(500).json({ message: "❌ Logowanie nie powiodło się" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
