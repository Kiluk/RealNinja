// socket/boardSocket.js

const boards = {
  room1: {
    pieces: {
      ninja1: { id: "ninja1", x: 0, y: 0 },
      samurai1: { id: "samurai1", x: 1, y: 1 },
    },
  },
};

function setupBoardSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Użytkownik połączony:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log("📤 Wysyłam stan pokoju:", boards[roomId]?.pieces);
      console.log(`➡️ ${socket.id} dołączył do ${roomId}`);
      if (!boards[roomId]) {
        // Jeśli pokój nie istnieje, utwórz nowy z pustymi pionkami
        boards[roomId] = { pieces: {} };
      }
      socket.emit("state-update", boards[roomId].pieces);
    });

    socket.on("move-piece", ({ room, id, x, y }) => {
      if (boards[room]) {
        boards[room].pieces[id] = { id, x, y }; // Nadpisujemy/aktualizujemy
        io.to(room).emit("state-update", boards[room].pieces);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Użytkownik rozłączony:", socket.id);
    });
  });
}

module.exports = { setupBoardSocket };
