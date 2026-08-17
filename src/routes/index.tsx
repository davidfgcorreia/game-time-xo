import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { RotateCcw, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tic Tac Toe" },
      { name: "description", content: "Play a classic game of Tic Tac Toe." },
      { property: "og:title", content: "Tic Tac Toe" },
      {
        property: "og:description",
        content: "Play a classic game of Tic Tac Toe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Player = "X" | "O" | null;
type Board = Player[];

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: Board): Player {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function Index() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const gameOver = Boolean(winner) || isDraw;
  const currentPlayer = xIsNext ? "X" : "O";

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || winner) return;

      const nextBoard = board.slice();
      nextBoard[index] = currentPlayer;
      setBoard(nextBoard);
      setXIsNext(!xIsNext);

      const nextWinner = calculateWinner(nextBoard);
      if (nextWinner) {
        setScores((prev) => ({
          ...prev,
          [nextWinner]: prev[nextWinner] + 1,
        }));
      } else if (nextBoard.every(Boolean)) {
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    },
    [board, currentPlayer, winner, xIsNext]
  );

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  let statusText: string;
  if (winner) {
    statusText = `Winner: ${winner}`;
  } else if (isDraw) {
    statusText = "It's a draw!";
  } else {
    statusText = `Next player: ${currentPlayer}`;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Tic Tac Toe
        </h1>
        <p className="text-muted-foreground">Three in a row wins the game.</p>
      </div>

      <div className="flex w-full max-w-sm items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Player X
          </span>
          <span className="text-2xl font-bold text-game-x">{scores.X}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Draws
          </span>
          <span className="text-2xl font-bold text-foreground">{scores.draws}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Player O
          </span>
          <span className="text-2xl font-bold text-game-o">{scores.O}</span>
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
        aria-live="polite"
      >
        {winner ? (
          <>
            <Trophy className="h-4 w-4 text-game-winner" aria-hidden="true" />
            <span>{statusText}</span>
          </>
        ) : (
          <>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                currentPlayer === "X" ? "bg-game-x" : "bg-game-o"
              }`}
              aria-hidden="true"
            />
            <span>{statusText}</span>
          </>
        )}
      </div>

      <div
        className="grid aspect-square w-full max-w-sm grid-cols-3 gap-3 rounded-2xl border border-border bg-game-board p-3 shadow-sm"
        role="grid"
        aria-label="Tic Tac Toe board"
      >
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={Boolean(value) || gameOver}
            className="group relative flex aspect-square items-center justify-center rounded-xl bg-game-cell shadow-sm transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
            aria-label={`Cell ${index + 1}${value ? `, ${value}` : ""}`}
            role="gridcell"
          >
            {value && <Mark player={value} />}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        New Game
      </button>
    </div>
  );
}

function Mark({ player }: { player: "X" | "O" }) {
  const isX = player === "X";

  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-16 w-16 sm:h-20 sm:w-20 ${isX ? "text-game-x" : "text-game-o"}`}
      aria-hidden="true"
    >
      {isX ? (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        >
          <path d="M25 25 L75 75">
            <animate
              attributeName="stroke-dasharray"
              from="0, 100"
              to="100, 0"
              dur="250ms"
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
          </path>
          <path d="M75 25 L25 75">
            <animate
              attributeName="stroke-dasharray"
              from="0, 100"
              to="100, 0"
              dur="250ms"
              begin="100ms"
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
          </path>
        </g>
      ) : (
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0, 251"
            to="251, 0"
            dur="350ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
          />
        </circle>
      )}
    </svg>
  );
}
