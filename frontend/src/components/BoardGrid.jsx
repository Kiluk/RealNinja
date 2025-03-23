// BoardGrid.jsx
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const BoardGrid = () => {
  const socketRef = useRef(null);
  const [pieces, setPieces] = useState({});
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    console.log("🔌 Łączenie z socket.io...");

    socket.on("connect", () => {
      console.log("✅ Socket połączony:", socket.id);
      socket.emit("join-room", "room1");
    });

    socket.on("state-update", (newState) => {
      console.log("Otrzymano stan planszy:", newState);
      setPieces(newState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTileClick = (x, y) => {
    if (selectedPieceId) {
      console.log(`🟡 Przemieszczam ${selectedPieceId} na (${x}, ${y})`);
      socketRef.current.emit("move-piece", {
        id: selectedPieceId,
        x,
        y,
        room: "room1",
      });
      setSelectedPieceId(null); // Odznacz po ruchu
    }
  };

  const handlePieceClick = (id) => {
    setSelectedPieceId(id);
  };

  return  (
    <div className="flex justify-center items-center mt-8">
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(30, 50px)",
          gridTemplateRows: "repeat(30, 50px)",
          border: "2px solid white",
        }}
      >
        {[...Array(900)].map((_, idx) => {
          const x = idx % 30;
          const y = Math.floor(idx / 30);
          const piece = Object.values(pieces).find(
            (p) => p.x === x && p.y === y
          );

          return (
            <div
              key={idx}
              onClick={() => handleTileClick(x, y)}
              style={{
                width: "50px",
                height: "50px",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: selectedPieceId ? "pointer" : "default",
                backgroundColor: "#2e2e3f",
              }}
            >
              {piece && (
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // Nie uruchamiaj kliknięcia pola
                    handlePieceClick(piece.id);
                  }}
                  className="text-2xl cursor-pointer"
                  title={`Kliknij, by wybrać ${piece.id}`}
                >
                  {piece.id === "ninja1" ? "🥷" : "🗡️"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardGrid;
