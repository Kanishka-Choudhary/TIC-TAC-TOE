let board = document.getElementById("board");
let message = document.getElementById("message");
let popup = document.getElementById("popup");
let playerScore = document.getElementById("player-score");
let aiScore = document.getElementById("ai-score");
let drawScore = document.getElementById("draw-score");

let cells = [];
let currentPlayer = "X";
let mode = "ai"; // default mode
let isGameOver = false;

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => makeMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
}

function makeMove(index) {
  if (cells[index].textContent || isGameOver) return;

  cells[index].textContent = currentPlayer;
  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} wins!`);
    updateScore(currentPlayer);
    return;
  }

  if (isDraw()) {
    endGame("It's a draw!");
    updateScore("Draw");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (mode === "ai" && currentPlayer === "O") {
    let bestMove = minimax(cells.map(c => c.textContent), "O").index;
    setTimeout(() => makeMove(bestMove), 300);
  }
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return cells.every(cell => cell.textContent);
}

function endGame(msg) {
  isGameOver = true;
  message.textContent = msg;
  popup.classList.remove("hide");
}

function restartGame() {
  isGameOver = false;
  currentPlayer = "X";
  popup.classList.add("hide");
  createBoard();
}

function updateScore(winner) {
  if (winner === "X") playerScore.textContent++;
  else if (winner === "O") aiScore.textContent++;
  else drawScore.textContent++;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(i => i !== null);

  if (checkWinMini(newBoard, "X")) return { score: -10 };
  if (checkWinMini(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    let result = minimax(newBoard, player === "O" ? "X" : "O");
    move.score = result.score;

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinMini(board, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

window.onload = createBoard;
