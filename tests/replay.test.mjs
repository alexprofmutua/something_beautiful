import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReplay, readReplayHeaders } from '../chess-replay.js';
import { Chess } from '../lib/chess.js';
import { FAVORITE_GAMES } from '../chess-games.js';

const position = replay => new Chess(replay.positions.at(-1));

test('captures are reflected in each legal position', () => {
  const replay = parseReplay('1. e4 d5 2. exd5 *');
  assert.equal(replay.positions.length, 4);
  assert.equal(position(replay).get('d5').color, 'w');
  assert.equal(position(replay).get('d7'), undefined);
  assert.equal(position(replay).get('e4'), undefined);
});

test('castling moves both the rook and the king', () => {
  const replay = parseReplay('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O *');
  const board = position(replay);
  assert.equal(board.get('g1').type, 'k');
  assert.equal(board.get('f1').type, 'r');
  assert.equal(board.get('e1'), undefined);
  assert.equal(board.get('h1'), undefined);
});

test('en passant removes the captured pawn from its original square', () => {
  const replay = parseReplay('1. e4 a6 2. e5 d5 3. exd6 *');
  assert.equal(position(replay).get('d6').color, 'w');
  assert.equal(position(replay).get('d5'), undefined);
});

test('promotion honors a recorded starting FEN', () => {
  const replay = parseReplay('[SetUp "1"]\n[FEN "7k/P7/8/8/8/8/8/7K w - - 0 1"]\n\n1. a8=Q+ *');
  assert.equal(position(replay).get('a8').type, 'q');
  assert.equal(replay.positions[0], '7k/P7/8/8/8/8/8/7K w - - 0 1');
});

test('black starting positions preserve turn, move numbers, and orientation', () => {
  const replay = parseReplay('[Black "nezhprodigy"]\n[SetUp "1"]\n[FEN "7k/8/8/8/8/8/p7/7K b - - 0 23"]\n\n23... a1=Q+ *');
  assert.equal(replay.moves[0].color, 'b');
  assert.equal(replay.moves[0].number, 23);
  assert.equal(replay.orientation, 'b');
  assert.equal(position(replay).get('a1').type, 'q');
});

test('missing, empty, and partially illegal PGNs fail rather than showing partial games', () => {
  for (const pgn of [undefined, '', '  ', '[Event "No moves"]\n\n*', '1. e4 e5 2. Ke3 *']) {
    assert.throws(() => parseReplay(pgn));
  }
});

test('stored games retain their real PGNs and known validation results', () => {
  const invalid = new Set(['botvinnik-tal-1960', 'nezhmetdinov-chernikov-1962']);
  assert.equal(FAVORITE_GAMES.length, 7);
  for (const game of FAVORITE_GAMES) {
    if (invalid.has(game.id)) assert.throws(() => parseReplay(game.pgn), /Invalid move/);
    else {
      const replay = parseReplay(game.pgn);
      const engine = new Chess();
      engine.loadPgn(game.pgn);
      assert.equal(replay.positions.at(-1), engine.fen());
      assert.equal(replay.positions.length, replay.moves.length + 1);
    }
  }
});

test('library headers preserve player colors and recorded metadata', () => {
  const headers = readReplayHeaders(FAVORITE_GAMES[0].pgn);
  assert.equal(headers.White, 'ceaserwawa');
  assert.equal(headers.Black, 'nezhprodigy');
  assert.equal(headers.Opening, 'Sicilian Defense: Smith-Morra Gambit');
  assert.equal(headers.Result, '0-1');
  assert.equal(headers.Site, 'https://lichess.org/UipMbz3B');
});

test('invalid recordings keep their metadata without exposing a partial replay', () => {
  const game = FAVORITE_GAMES.find(game => game.id === 'botvinnik-tal-1960');
  assert.equal(readReplayHeaders(game.pgn).White, 'Botvinnik, Mikhail');
  assert.equal(readReplayHeaders(game.pgn).Date, '1960.03.15');
  assert.throws(() => parseReplay(game.pgn), /Invalid move/);
});

test('header display does not invent missing opening or rating metadata', () => {
  const game = FAVORITE_GAMES.find(game => game.id === 'morphy-opera-1858');
  const headers = readReplayHeaders(game.pgn);
  assert.equal(headers.Opening, undefined);
  assert.equal(headers.WhiteElo, undefined);
  assert.equal(headers.BlackElo, undefined);
  assert.equal(headers.Date, '1858');
});
