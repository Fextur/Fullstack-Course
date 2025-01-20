import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Cell from "./Cell";

export enum Player {
  X = "X",
  O = "O",
}

const MainPage = () => {
  const [player, setPlayer] = useState<Player>(Player.O);
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<Player | "DRAW" | null>(null);

  const updateGameStatus = (board: (Player | null)[]) => {
    console.log(board);
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameStatus(board[a]);
        return;
      }
    }
    if (board.every((cell) => cell !== null)) {
      setGameStatus("DRAW");
    }
  };

  useEffect(() => {
    updateGameStatus(board);
  }, [board]);

  const titleText = () => {
    if (gameStatus === "DRAW") {
      return "It's a Draw!";
    } else if (gameStatus) {
      return `${gameStatus} Wins!`;
    } else {
      return `${player} Turn`;
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#2e2e2e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ height: "10vh" }}>
        <Typography variant="h2">Tic Tac Toe</Typography>
      </Box>
      <Box
        sx={{
          height: "5vh",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h5">{titleText()}</Typography>
      </Box>
      <div
        style={{
          height: "50vw",
          width: "50vw",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          backgroundColor: "#333333",
          padding: "5px",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      >
        {board.map((value, index) => (
          <Cell
            value={value}
            onClick={() => {
              if (value === null && gameStatus === null) {
                setBoard((prev) =>
                  prev.map((cell, prevIndex) =>
                    index === prevIndex ? player : cell
                  )
                );
                setPlayer(player === Player.X ? Player.O : Player.X);
              }
            }}
            key={index}
          />
        ))}
      </div>
      <Button
        variant="contained"
        sx={{ width: "30vw" }}
        onClick={() => {
          setBoard(Array(9).fill(null));
          setGameStatus(null);
        }}
      >
        <Typography>Reset</Typography>
      </Button>
    </div>
  );
};

export default MainPage;
