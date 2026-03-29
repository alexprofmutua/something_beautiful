const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PIECES = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔"
};

const boardStates = new Map();

function fenToSquares(fen) {
  const placement = fen.split(" ")[0];
  const rows = placement.split("/");

  return rows.flatMap((row) => {
    const squares = [];

    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < Number(char); i += 1) {
          squares.push("");
        }
      } else {
        squares.push(char);
      }
    }

    return squares;
  });
}

function renderBoard(boardElement, fen) {
  if (!boardElement) {
    return;
  }

  const squares = fenToSquares(fen);
  boardElement.innerHTML = "";

  squares.forEach((piece, index) => {
    const row = Math.floor(index / 8);
    const column = index % 8;
    const square = document.createElement("div");
    const isDark = (row + column) % 2 === 0;

    square.className = `square ${isDark ? "dark" : "light"}`;

    if (column === 0) {
      square.dataset.rank = String(8 - row);
    }

    if (row === 7) {
      square.dataset.file = String.fromCharCode(97 + column);
    }

    if (piece) {
      const pieceNode = document.createElement("span");
      pieceNode.className = "piece";
      pieceNode.textContent = PIECES[piece];
      square.appendChild(pieceNode);
    }

    boardElement.appendChild(square);
  });
}

function extractMoves(pgnText) {
  return pgnText
    .replace(/\[[^\]]*\]\s*/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/;.*$/gm, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\$\d+/g, " ")
    .replace(/\d+\.(\.\.)?/g, " ")
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, " ")
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/[!?]+/g, ""))
    .filter(Boolean);
}

function buildPositions(pgnText) {
  if (typeof Chess === "undefined") {
    throw new Error("Chess library unavailable.");
  }

  const chess = new Chess();
  const moves = extractMoves(pgnText);
  const positions = [chess.fen()];

  for (const move of moves) {
    const applied = chess.move(move, { sloppy: true });

    if (!applied) {
      throw new Error(`Could not read move "${move}".`);
    }

    positions.push(chess.fen());
  }

  return positions;
}

function stopPlayback(state) {
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

function updateStatus(state, message) {
  state.status.textContent = message;
}

function resetBoard(state, message = "Back at the starting position.") {
  stopPlayback(state);
  state.currentIndex = 0;
  renderBoard(state.board, state.positions[0]);
  updateStatus(state, message);
}

function ensurePositions(state) {
  const nextSource = state.input.value.trim();

  if (state.source === nextSource) {
    return;
  }

  state.positions = buildPositions(nextSource);
  state.source = nextSource;
  state.currentIndex = 0;
  renderBoard(state.board, state.positions[0]);

  const halfMoves = state.positions.length - 1;
  const fullMoves = Math.ceil(halfMoves / 2);
  updateStatus(state, `${fullMoves} move${fullMoves === 1 ? "" : "s"} loaded.`);
}

function replay(state) {
  try {
    ensurePositions(state);
  } catch (error) {
    updateStatus(state, error.message);
    return;
  }

  stopPlayback(state);

  if (state.positions.length === 1) {
    updateStatus(state, "No moves to replay yet.");
    return;
  }

  state.currentIndex = 0;
  renderBoard(state.board, state.positions[0]);
  updateStatus(state, "Replaying...");

  function stepForward() {
    if (state.currentIndex >= state.positions.length - 1) {
      state.timer = null;
      updateStatus(state, "Replay complete.");
      return;
    }

    state.currentIndex += 1;
    renderBoard(state.board, state.positions[state.currentIndex]);
    updateStatus(state, `Move ${state.currentIndex} of ${state.positions.length - 1}.`);
    state.timer = setTimeout(stepForward, 700);
  }

  state.timer = setTimeout(stepForward, 500);
}

function step(state) {
  try {
    ensurePositions(state);
  } catch (error) {
    updateStatus(state, error.message);
    return;
  }

  stopPlayback(state);

  if (state.currentIndex >= state.positions.length - 1) {
    updateStatus(state, "You are already at the final position.");
    return;
  }

  state.currentIndex += 1;
  renderBoard(state.board, state.positions[state.currentIndex]);
  updateStatus(state, `Move ${state.currentIndex} of ${state.positions.length - 1}.`);
}

function setupBoards() {
  const boards = document.querySelectorAll(".board");

  boards.forEach((board) => {
    const boardId = board.id;
    const control = document.querySelector(`[data-board="${boardId}"]`);
    const pgnId = control?.dataset.pgn;
    const statusId = control?.dataset.status;
    const input = pgnId ? document.getElementById(pgnId) : null;
    const status = statusId ? document.getElementById(statusId) : null;

    if (!boardId || !input || !status) {
      return;
    }

    const state = {
      board,
      input,
      status,
      positions: [START_FEN],
      currentIndex: 0,
      source: "",
      timer: null
    };

    boardStates.set(boardId, state);
    renderBoard(board, state.positions[0]);

    input.addEventListener("input", () => {
      stopPlayback(state);
      state.source = "";
      updateStatus(state, "PGN updated. Replay to load it.");
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const boardId = button.dataset.board;
      const action = button.dataset.action;
      const state = boardStates.get(boardId);

      if (!state) {
        return;
      }

      if (action === "replay") {
        replay(state);
      }

      if (action === "step") {
        step(state);
      }

      if (action === "reset") {
        resetBoard(state);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupBoards);
