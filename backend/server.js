const express = require("express");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const characterRoutes = require("./routes/characterRoutes");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { setupBoardSocket } = require("./socket/boardSocket");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

setupBoardSocket(io);

server.listen(5000, () => console.log("Serwer działa na porcie 5000"));
