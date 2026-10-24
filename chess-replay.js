import { Chess } from './lib/chess.js';

export function readReplayHeaders(pgn) {
  const game = new Chess();
  try {
    game.loadPgn(pgn, { strict: false });
  } catch {
    // Recorded headers remain useful even when the move sequence is invalid.
  }
  return { ...game.header() };
}

// Build the entire legal timeline before displaying any part of a recorded game.
export function parseReplay(pgn) {
  if (typeof pgn !== 'string' || !pgn.trim()) throw new Error('This game has no PGN data.');
  const game = new Chess();
  game.loadPgn(pgn.trim(), { strict: false });
  const moves = game.history({ verbose: true });
  if (!moves.length) throw new Error('This PGN contains no recorded moves.');
  const headers = game.header();
  return {
    headers,
    moves: moves.map(move => ({
      san: move.san,
      from: move.from,
      to: move.to,
      color: move.color,
      number: Number(move.before.split(' ')[5]),
    })),
    positions: [moves[0].before, ...moves.map(move => move.after)],
    orientation: headers.Black?.toLowerCase() === 'nezhprodigy' ? 'b' : 'w',
  };
}
