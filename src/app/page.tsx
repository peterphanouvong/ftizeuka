"use client";

import * as React from "react";
import { useState, useCallback, useMemo } from "react";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

type Player = "X" | "O";
type Board = (Player | null)[];
type GameStatus = "playing" | "winner" | "draw";

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  status: GameStatus;
}

const INITIAL_BOARD: Board = Array(9).fill(null);

const checkWinner = (board: Board): Player | null => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const Cell = React.memo(({ 
  value, 
  onClick, 
  index 
}: { 
  value: Player | null; 
  onClick: () => void; 
  index: number;
}) => (
  <button
    className="group relative w-24 h-24 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:border-blue-300 dark:hover:border-blue-500 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!!value}
    aria-label={`Cell ${index + 1}, ${value || 'empty'}`}
  >
    <span className={`
      absolute inset-0 flex items-center justify-center text-4xl font-bold transition-all duration-300
      ${value === 'X' ? 'text-blue-600 dark:text-blue-400' : ''}
      ${value === 'O' ? 'text-red-500 dark:text-red-400' : ''}
      ${!value ? 'group-hover:text-gray-300 dark:group-hover:text-gray-600' : ''}
      ${value ? 'scale-100' : 'scale-0 group-hover:scale-75'}
    `}>
      {value || (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          +
        </span>
      )}
    </span>
  </button>
));

Cell.displayName = 'Cell';

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    currentPlayer: "X",
    winner: null,
    status: "playing"
  });

  const { board, currentPlayer, winner, status } = gameState;

  const gameStatus = useMemo(() => {
    if (winner) return { type: "winner" as const, message: `Player ${winner} wins!` };
    if (board.every(Boolean)) return { type: "draw" as const, message: "It's a draw!" };
    return { type: "playing" as const, message: `Player ${currentPlayer}'s turn` };
  }, [winner, board, currentPlayer]);

  const handleCellClick = useCallback((index: number) => {
    if (status !== "playing" || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const newWinner = checkWinner(newBoard);
    
    setGameState({
      board: newBoard,
      currentPlayer: currentPlayer
