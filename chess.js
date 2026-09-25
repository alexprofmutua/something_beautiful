/**
 * Chess replay — favorite games list + auto-play
 * Loads after chess-libs-bootstrap (inline module in chess.html) sets window.ChessLibs.
 * Works when opening chess.html via file:// (needs internet for CDN piece assets).
 */
(function () {
  const ASSETS_URL = "https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.11/assets/";
  const MY_USERNAME = "nezhprodigy";

  let Chess;
  let Chessboard;
  let FEN;
  let COLOR;
  let replayBoard = null;
  let replaySession = 0;
  let selectedPgn = "";

  function boot() {
    if (!window.ChessLibs) return;
    ({ Chess, Chessboard, FEN, COLOR } = window.ChessLibs);

    initBoard();
    initGameList();
    document.getElementById("replay-btn")?.addEventListener("click", () => startReplay());
  }

  function whenLibsReady(fn) {
    if (window.ChessLibs) {
      fn();
      return;
    }
    window.addEventListener("chess-libs-ready", fn, { once: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    whenLibsReady(boot);
  });

  function initBoard() {
    const boardEl = document.getElementById("replay-board");
    if (!boardEl || !Chessboard) return;

    replayBoard = new Chessboard(boardEl, {
      position: FEN.start,
      assetsUrl: ASSETS_URL,
      style: {
        showCoordinates: true,
        animationDuration: 300,
      },
    });
  }

  function initGameList() {
    const listEl = document.getElementById("game-list");
    if (!listEl || typeof FAVORITE_GAMES === "undefined") return;

    listEl.innerHTML = "";

    FAVORITE_GAMES.forEach((game) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "game-list-item";
      btn.dataset.gameId = game.id;
      btn.innerHTML = `
      <span class="game-list-title">${game.title}</span>
      <span class="game-list-year">${game.year}</span>
      ${game.event ? `<span class="game-list-event">${game.event}</span>` : ""}
    `;
      btn.addEventListener("click", () => selectGame(game.id));
      listEl.appendChild(btn);
    });

    if (FAVORITE_GAMES.length > 0) {
      requestAnimationFrame(() => selectGame(FAVORITE_GAMES[0].id));
    }
  }

  function selectGame(gameId) {
    const game = FAVORITE_GAMES.find((g) => g.id === gameId);
    if (!game) return;

    document.querySelectorAll(".game-list-item").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.gameId === gameId);
    });

    const pgnEl = document.getElementById("pgn1");
    const titleEl = document.getElementById("replay-game-title");
    selectedPgn = game.pgn;
    if (pgnEl) pgnEl.value = game.pgn;
    if (titleEl) titleEl.textContent = `${game.title} · ${game.year}`;

    startReplay(game.pgn);
  }

  function getOrientationForPgn(pgnText) {
    const white = pgnText.match(/\[White\s+"([^"]+)"\]/i)?.[1]?.toLowerCase();
    const black = pgnText.match(/\[Black\s+"([^"]+)"\]/i)?.[1]?.toLowerCase();
    const me = MY_USERNAME.toLowerCase();

    if (black === me) return COLOR.black;
    if (white === me) return COLOR.white;
    return COLOR.white;
  }

  function extractMoves(pgnText) {
    const movetext = pgnText
      .replace(/\{[\s\S]*?\}/g, " ")
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\([^)]*\)/g, " ")
      .replace(/\d+\.\.\./g, " ")
      .replace(/\d+\./g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s(1-0|0-1|1\/2-1\/2|\*)\s*$/i, "");

    const tokens = movetext.split(" ").filter(Boolean);
    const game = new Chess();
    const moves = [];

    for (const token of tokens) {
      if (/^(1-0|0-1|1\/2-1\/2|\*)$/i.test(token)) break;

      const san = token.replace(/\$\d+/g, "").replace(/[?!]+/g, "").replace(/[+#!]+$/g, "");
      let played = game.move(san);
      if (!played) played = game.move(token);
      if (!played) return null;

      moves.push({
        from: played.from,
        to: played.to,
        promotion: played.promotion,
        san: played.san,
      });
    }

    return moves.length > 0 ? moves : null;
  }

  function getMovesFromPgn(pgnText) {
    const text = pgnText.trim();
    const game = new Chess();

    try {
      game.loadPgn(text, { strict: false });
      const history = game.history({ verbose: true });
      if (history.length > 0) {
        return history.map((m) => ({
          from: m.from,
          to: m.to,
          promotion: m.promotion,
          san: m.san,
        }));
      }
    } catch (_) {
      /* fall through */
    }

    return extractMoves(text);
  }

  function cancelReplay() {
    replaySession += 1;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runReplay(moves, statusEl, orientation = COLOR.white) {
    const session = replaySession;

    if (!replayBoard) initBoard();
    if (!replayBoard) {
      if (statusEl) statusEl.textContent = "Board failed to load. Refresh the page.";
      return;
    }

    const replayGame = new Chess();
    await replayBoard.setOrientation(orientation, false);
    await replayBoard.setPosition(FEN.start, false);
    if (session !== replaySession) return;

    if (statusEl) statusEl.textContent = "Replaying…";

    for (let i = 0; i < moves.length; i += 1) {
      if (session !== replaySession) return;

      const moveData = moves[i];
      const payload = { from: moveData.from, to: moveData.to };
      if (moveData.promotion) payload.promotion = moveData.promotion;

      const played = replayGame.move(payload);
      if (!played) {
        if (statusEl) {
          statusEl.textContent = `Stopped at move ${i + 1} — could not play ${moveData.san}.`;
        }
        return;
      }

      await replayBoard.setPosition(replayGame.fen(), true);
      if (session !== replaySession) return;

      if (statusEl) statusEl.textContent = `Move ${i + 1} of ${moves.length}`;
      await sleep(650);
    }

    if (session !== replaySession) return;
    if (statusEl) statusEl.textContent = `Replay complete — ${moves.length} moves.`;
  }

  function startReplay(pgnOverride) {
    const pgnEl = document.getElementById("pgn1");
    const statusEl = document.getElementById("replay-status");

    const pgnText = (pgnOverride ?? selectedPgn ?? pgnEl?.value ?? "").trim();
    if (!pgnText) return;

    cancelReplay();

    const moves = getMovesFromPgn(pgnText);
    if (!moves || moves.length === 0) {
      if (statusEl) {
        statusEl.textContent = moves
          ? "No moves found in that PGN."
          : "Could not read that PGN. Check the format and try again.";
      }
      return;
    }

    void runReplay(moves, statusEl, getOrientationForPgn(pgnText)).catch((err) => {
      if (statusEl) statusEl.textContent = `Replay error: ${err.message}`;
    });
  }
})();
