import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReplay, readReplayHeaders, isPersonalPlayer, displayPlayerName } from '../chess-replay.js';
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

test('all stored games contain legal, complete replay timelines', () => {
  assert.equal(FAVORITE_GAMES.length, 15);
  for (const game of FAVORITE_GAMES) {
    const replay = parseReplay(game.pgn);
    const engine = new Chess();
    engine.loadPgn(game.pgn, { strict: true });
    assert.equal(replay.positions.at(-1), engine.fen());
    assert.equal(replay.positions.length, replay.moves.length + 1);
  }
});

test('new Dubov games retain verified dates, opponents, complete scores, and sources', () => {
  for (const [id, black, date, plies, lastMove, mate] of [
    ['dubov-carlsen-2020', 'Carlsen, Magnus', '2020.05.16', 107, 'Rd1', false],
    ['dubov-svane-2019', 'Svane, Rasmus', '2019.10.31', 77, 'Qa2#', true],
  ]) {
    const game = FAVORITE_GAMES.find(item => item.id === id);
    const replay = parseReplay(game.pgn);
    assert.equal(replay.headers.White, 'Dubov, Daniil');
    assert.equal(replay.headers.Black, black);
    assert.equal(replay.headers.Date, date);
    assert.equal(replay.headers.Result, '1-0');
    assert.match(replay.headers.Source, /^https:\/\/theweekinchess\.com\/assets\/files\/pgn\//);
    assert.equal(replay.orientation, 'w');
    assert.equal(replay.moves.length, plies);
    assert.equal(replay.moves.at(-1).san, lastMove);
    assert.equal(position(replay).isCheckmate(), mate);
  }
  const carlsen = parseReplay(FAVORITE_GAMES.find(item => item.id === 'dubov-carlsen-2020').pgn);
  assert(carlsen.moves.some(move => move.san === 'd8=Q'));
  assert.equal(new Set(FAVORITE_GAMES.map(game => game.id)).size, FAVORITE_GAMES.length);
});

test('both Giri and Dubov wins retain the correct colors, dates, and final positions', () => {
  for (const [id, white, black, date, result, finalMove, finalFen] of [
    ['dubov-giri-2019', 'Dubov, Daniil', 'Giri, Anish', '2019.05.18', '1-0', 'Kh8',
      '5r1k/p3Np1r/n3pP2/2q1N2p/1b3Q2/3R4/3RKPPP/8 w - - 14 37'],
    ['giri-dubov-2022', 'Giri, Anish', 'Dubov, Daniil', '2022.12.28', '0-1', 'Qe6+',
      '5b1k/p6p/2B1q1p1/4P3/8/PK3P2/4P2P/R6R w - - 1 37'],
  ]) {
    const game = FAVORITE_GAMES.find(item => item.id === id);
    const replay = parseReplay(game.pgn);
    const engine = new Chess();
    engine.loadPgn(game.pgn, { strict: true });
    assert.equal(replay.headers.White, white);
    assert.equal(replay.headers.Black, black);
    assert.equal(replay.headers.Date, date);
    assert.equal(replay.headers.Result, result);
    assert.equal(replay.moves.length, 72);
    assert.equal(replay.moves.at(-1).san, finalMove);
    assert.equal(replay.positions.at(-1), finalFen);
    assert.equal(engine.fen(), finalFen);
    assert.match(replay.headers.Source, /^https:\/\/theweekinchess\.com\/assets\/files\/pgn\//);
  }
});

test('library headers preserve player colors and recorded metadata', () => {
  const headers = readReplayHeaders(FAVORITE_GAMES.find(game => game.id === 'nezhprodigy-ceaserwawa-2022').pgn);
  assert.equal(headers.White, 'ceaserwawa');
  assert.equal(headers.Black, 'nezhprodigy');
  assert.equal(headers.Opening, 'Sicilian Defense: Smith-Morra Gambit');
  assert.equal(headers.Result, '0-1');
  assert.equal(headers.Site, 'https://lichess.org/UipMbz3B');
});

test('former username identifies personal games without rewriting recorded PGN names', () => {
  const game = FAVORITE_GAMES.find(item => item.id === 'alexalginique-rbosch1977-2020');
  const replay = parseReplay(game.pgn);
  assert.equal(replay.headers.White, 'Alexalginique');
  assert.equal(replay.headers.Black, 'rbosch1977');
  assert.equal(replay.headers.GameId, 'PyDrlQtY');
  assert.equal(replay.headers.Result, '1-0');
  assert.equal(replay.moves.length, 37);
  assert.equal(replay.moves.at(-1).san, 'Rxf7+');
  assert.equal(replay.orientation, 'w');
  assert.equal(displayPlayerName(replay.headers.White), 'nezhprodigy (formerly Alexalginique)');
  assert.equal(displayPlayerName('nezhprodigy'), 'nezhprodigy');
  assert.equal(displayPlayerName('rbosch1977'), 'rbosch1977');
  assert.equal(isPersonalPlayer(' ALEXALGINIQUE '), true);
  assert.equal(isPersonalPlayer('nezhprodigy'), true);
  assert.equal(isPersonalPlayer('rbosch1977'), false);
  assert.equal(isPersonalPlayer(undefined), false);
  assert.equal(parseReplay('[White "Opponent"]\n[Black "Alexalginique"]\n\n1. e4 e5 *').orientation, 'b');
  assert.equal(FAVORITE_GAMES.filter(item => {
    const headers = readReplayHeaders(item.pgn);
    return [headers.White, headers.Black].some(isPersonalPlayer);
  }).length, 5);
});

test('Rinascita game preserves the supplied metadata and resignation position', () => {
  const game = FAVORITE_GAMES.find(item => item.id === 'nezhprodigy-rinascita-2022');
  const replay = parseReplay(game.pgn);
  assert.equal(replay.headers.White, 'nezhprodigy');
  assert.equal(replay.headers.Black, 'Rinascita');
  assert.equal(replay.headers.GameId, 'XXeIZAdD');
  assert.equal(replay.headers.Date, '2022.10.04');
  assert.equal(replay.headers.TimeControl, '300+0');
  assert.equal(replay.headers.Result, '1-0');
  assert.equal(replay.headers.WhiteElo, '1968');
  assert.equal(replay.headers.BlackElo, '2038');
  assert.equal(replay.orientation, 'w');
  assert.equal(replay.moves.length, 63);
  assert.equal(replay.moves.at(-1).san, 'Qh5');
  assert.equal(position(replay).isCheckmate(), false);
  assert.ok(game.pgn.includes('{ Black resigns. }'));
});

test('return game against Rinascita preserves Black player identity and checkmate', () => {
  const game = FAVORITE_GAMES.find(item => item.id === 'rinascita-nezhprodigy-2022');
  const replay = parseReplay(game.pgn);
  assert.equal(replay.headers.White, 'Rinascita');
  assert.equal(replay.headers.Black, 'nezhprodigy');
  assert.equal(replay.headers.GameId, 'RL4RVJtc');
  assert.equal(replay.headers.Site, 'https://lichess.org/game/RL4RVJtc');
  assert.equal(replay.headers.Date, '2022.10.04');
  assert.equal(replay.headers.TimeControl, '300+0');
  assert.equal(replay.headers.Result, '0-1');
  assert.equal(replay.headers.ECO, 'B20');
  assert.equal(replay.orientation, 'b');
  assert.equal(replay.moves.length, 58);
  assert.equal(replay.moves.at(-1).san, 'Qf4#');
  assert.equal(replay.moves.at(-1).color, 'b');
  assert.equal(position(replay).isCheckmate(), true);
  assert.ok(game.pgn.includes('{ Black wins by checkmate. }'));
});

test('annotated Evans Gambit retains its PGN while replaying only the played main line', () => {
  const game = FAVORITE_GAMES.find(item => item.id === 'alexalginique-chicot-the-jester-2020');
  const replay = parseReplay(game.pgn);
  assert.equal(replay.headers.White, 'Alexalginique');
  assert.equal(replay.headers.Black, 'chicot-the-jester');
  assert.equal(replay.headers.Site, 'https://lichess.org/game/64pvszml');
  assert.equal(replay.headers.Date, '2020.11.26');
  assert.equal(replay.headers.TimeControl, '600+1');
  assert.equal(replay.headers.ECO, 'C51');
  assert.equal(replay.moves.length, 67);
  assert.equal(replay.moves[6].san, 'b4');
  assert.equal(replay.moves.at(-1).san, 'Qxe8#');
  assert(replay.moves.some(move => move.san === 'e8=Q+'));
  assert.equal(position(replay).isCheckmate(), true);
  assert.equal(replay.orientation, 'w');
  assert.ok(game.pgn.includes('(4. d3 d6 5. O-O h6'));
  assert.ok(game.pgn.includes('Checkmate is now unavoidable. Qe5 was best.'));
  assert.ok(game.pgn.includes('{ White wins by checkmate. }'));
});

test('invalid recordings keep their metadata without exposing a partial replay', () => {
  const pgn = '[White "Invalid test fixture"]\n[Date "2000.01.01"]\n\n1. e4 e5 2. Bh6 *';
  assert.equal(readReplayHeaders(pgn).White, 'Invalid test fixture');
  assert.equal(readReplayHeaders(pgn).Date, '2000.01.01');
  assert.throws(() => parseReplay(pgn), /Invalid move/);
});

test('corrected historical recordings preserve sourced metadata and final positions', () => {
  for (const [id, date, site, plies, finalMove, finalFen] of [
    ['botvinnik-tal-1960', '1960.03.26', 'Moscow', 92, 'Kd4',
      '8/2R4p/6p1/8/3k1P2/2p3KP/8/4r3 w - - 2 47'],
    ['nezhmetdinov-chernikov-1962', '1962.??.??', 'Rostov-on-Don', 65, 'Ke2',
      '8/p6k/2Np2p1/1p6/3B1r2/8/PPP1K1PP/8 b - - 1 33'],
  ]) {
    const replay = parseReplay(FAVORITE_GAMES.find(game => game.id === id).pgn);
    assert.equal(replay.headers.Date, date);
    assert.equal(replay.headers.Site, site);
    assert.ok(replay.headers.Source.startsWith('https://'));
    assert.equal(replay.moves.length, plies);
    assert.equal(replay.moves.at(-1).san, finalMove);
    assert.equal(replay.positions.at(-1), finalFen);
  }
});

test('header display does not invent missing opening or rating metadata', () => {
  const game = FAVORITE_GAMES.find(game => game.id === 'morphy-opera-1858');
  const headers = readReplayHeaders(game.pgn);
  assert.equal(headers.Opening, undefined);
  assert.equal(headers.WhiteElo, undefined);
  assert.equal(headers.BlackElo, undefined);
  assert.equal(headers.Date, '1858');
});
