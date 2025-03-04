const express = require("express");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const characterRoutes = require("./routes/characterRoutes");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // 🔥 Zezwalamy na połączenia z frontendu
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);

app.listen(5000, () => console.log("Serwer działa na porcie 5000"));
