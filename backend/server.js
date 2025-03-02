require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
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

// **Register API**
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sql.query(`
          INSERT INTO users (username, email, password)
          VALUES ('${username}', '${email}', '${hashedPassword}')
      `);

      res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
      console.error("❌ Error registering user:", error);
      res.status(500).json({ message: "❌ Registration failed" });
  }
});

// **Login API**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
      const user = await sql.query(`
          SELECT * FROM users WHERE email = '${email}'
      `);

      if (!user.recordset[0]) {
          return res.status(401).json({ message: "❌ Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.recordset[0].password);
      if (!validPassword) {
          return res.status(401).json({ message: "❌ Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.recordset[0].id }, "secretkey", { expiresIn: "1h" });

      res.status(200).json({ message: "✅ Login successful!", token });
  } catch (error) {
      console.error("❌ Error logging in:", error);
      res.status(500).json({ message: "❌ Login failed" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
      const verified = jwt.verify(token, "secretkey");
      req.user = verified;
      next();
  } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
  }
};

// Example of a protected route:
app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "✅ Access granted!", user: req.user });
});

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
