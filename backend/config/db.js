const sql = require("mssql");

// Konfiguracja bazy danych
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

// Połączenie z bazą danych
const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Połączono z MSSQL!");
  } catch (err) {
    console.error("❌ Błąd połączenia z MSSQL:", err);
  }
};

module.exports = { connectDB, sql };
