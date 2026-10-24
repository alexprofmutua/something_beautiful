/**
 * ARCHIVED — Interactive chess play (drag-and-drop)
 * Not used on the live site. To restore:
 *   1. Copy the HTML block from chess-interactive-play.html into chess.html
 *   2. Link chess-interactive-play.css in chess.html
 *   3. Merge initPlayBoard() from this file into chess.js (or load this after chess.js)
 *
 * Requires: chess.js, cm-chessboard, DOM ids play-board, chess-status, move-list, reset-btn, flip-btn
 */

document.addEventListener("DOMContentLoaded", () => {
  initPlayBoard();
});

let game;
let playBoard;

function initPlayBoard() {
  const boardEl = document.getElementById("play-board");
  const resetBtn = document.getElementById("reset-btn");
  const flipBtn = document.getElementById("flip-btn");

  if (!boardEl) return;

  game = new Chess();
  playBoard = new Chessboard(boardEl, {
    position: "start",
    orientation: "w",
    moveInput: {
      enabled: true,
      onMove: handlePlayerMove,
    },
  });

  resetBtn?.addEventListener("click", resetGame);
  flipBtn?.addEventListener("click", flipBoard);
  updateStatus();
}

function handlePlayerMove(from, to) {
  if (game.game_over()) return false;

  const move = game.move({ from, to, promotion: "q" });
  if (!move) return false;

  updateStatus();
  return true;
}

function updateStatus() {
  const statusEl = document.getElementById("chess-status");
  const movesEl = document.getElementById("move-list");

  if (!statusEl) return;

  let message = "";
  const turn = game.turn() === "w" ? "White" : "Black";

  if (game.in_checkmate()) {
    message = `Checkmate! ${turn === "White" ? "Black" : "White"} wins.`;
    playBoard.disableMoveInput();
  } else if (game.in_draw()) {
    if (game.in_stalemate()) message = "Draw by stalemate.";
    else if (game.in_threefold_repetition()) message = "Draw by threefold repetition.";
    else if (game.insufficient_material()) message = "Draw — insufficient material.";
    else message = "Draw.";
    playBoard.disableMoveInput();
  } else if (game.in_check()) {
    message = `${turn} to move — check!`;
  } else {
    message = `${turn} to move`;
  }

  statusEl.textContent = message;
  renderMoveList(movesEl);
}

function renderMoveList(container) {
  if (!container) return;

  const history = game.history();
  if (history.length === 0) {
    container.innerHTML = "<p class='move-list-empty'>No moves yet. Drag a piece to start.</p>";
    return;
  }

  let html = "<ol class='move-pairs'>";
  for (let i = 0; i < history.length; i += 2) {
    const num = i / 2 + 1;
    const white = history[i] ?? "";
    const black = history[i + 1] ?? "";
    html += `<li><span class="move-num">${num}.</span> <span class="move-w">${white}</span> <span class="move-b">${black}</span></li>`;
  }
  html += "</ol>";
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

function resetGame() {
  game.reset();
  playBoard.setPosition("start", false);
  playBoard.enableMoveInput();
  playBoard.setOrientation("w");
  updateStatus();
}

function flipBoard() {
  const current = playBoard.getOrientation();
  playBoard.setOrientation(current === "w" ? "b" : "w");
}
