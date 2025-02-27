require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");

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
    encrypt: false, // Ustaw na true jeśli korzystasz z Azure SQL
    trustServerCertificate: true, // Wymagane dla lokalnego MSSQL
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

// Endpoint do zapisu postaci
app.post("/save-character", async (req, res) => {
  const { hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu } = req.body;
  if (!name || !clan) {
    return res.status(400).json({ message: "⚠️ Wprowadź nazwę postaci i klan!" });
  }

  try {
    const result = await sql.query(`
      INSERT INTO characters (hp, chakra, name, clan, strength, agility, intelligence, chakraControl, ninJutsu, genJutsu, taiJutsu)
      VALUES (${hp}, ${chakra},'${name}', '${clan}', ${strength}, ${agility}, ${intelligence}, ${chakraControl}, ${ninJutsu}, ${genJutsu}, ${taiJutsu})
      `);

    res.status(201).json({ message: "✅ Postać zapisana!" });
  } catch (error) {
    console.error("❌ Błąd podczas zapisywania postaci:", error);
    res.status(500).json({ message: "❌ Błąd zapisu do bazy danych." });
  }
});

// Uruchomienie serwera
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
