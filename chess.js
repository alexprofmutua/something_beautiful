import { parseReplay, readReplayHeaders, isPersonalPlayer, displayPlayerName } from './chess-replay.js?v=20261023-replay';
import { FAVORITE_GAMES } from './chess-games.js?v=20261023-module-data';

const replay = document.getElementById('replay');
const gameList = document.getElementById('game-list');
const moveList = document.getElementById('move-list');
const boardElement = document.getElementById('replay-board');
const status = document.getElementById('replay-status');
const error = document.getElementById('replay-error');
const title = document.getElementById('replay-game-title');
const players = document.getElementById('replay-players');
const information = document.getElementById('replay-information');
const topPlayer = document.getElementById('board-player-top');
const bottomPlayer = document.getElementById('board-player-bottom');
const playButton = document.getElementById('replay-play');
const speed = document.getElementById('replay-speed');
const actions = [...replay.querySelectorAll('[data-replay-action]')];
const gameButtons = new Map();
const gameHeaders = new Map(FAVORITE_GAMES.map(game => [game.id, readReplayHeaders(game.pgn)]));
const lastMoveMarker = { class: 'replay-last-move', slice: 'markerSquare' };
let board;
let timeline;
let headers = {};
let current = 0;
let playing = false;
let timer;
let revision = 0;
let boardFailure;
let orientation = 'w';
let flipping = false;

function pause() {
  playing = false;
  clearTimeout(timer);
  updateControls();
}

function updateControls() {
  const valid = Boolean(timeline && board && !boardFailure);
  for (const button of actions) {
    const action = button.dataset.replayAction;
    button.disabled = !valid ||
      (action === 'flip' && flipping) ||
      (['first', 'previous'].includes(action) && current === 0) ||
      (['next', 'last'].includes(action) && current === timeline?.moves.length);
    if (action === 'flip') button.setAttribute('aria-pressed', String(orientation === 'b'));
  }
  speed.disabled = !valid;
  playButton.firstElementChild.className = 'replay-icon icon-' + (playing ? 'pause' : 'play');
  const label = playing ? 'Pause replay' : 'Play replay';
  playButton.setAttribute('aria-label', label);
  playButton.title = label;
  playButton.setAttribute('aria-pressed', String(playing));
  for (const button of moveList.querySelectorAll('button')) {
    if (Number(button.dataset.ply) === current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  }
  if (valid) {
    const turn = timeline.positions[current].split(' ')[1] === 'w' ? 'White' : 'Black';
    status.textContent = (current === 0 ? 'Starting position' :
      `Position ${current} of ${timeline.moves.length} · ${timeline.moves[current - 1].san}`) +
      ` · ${turn} to move${playing ? ' · Playing' : ''}`;
  }
}

function updatePlayerLabels() {
  const white = headers.White ? 'White · ' + displayPlayerName(headers.White) : 'White';
  const black = headers.Black ? 'Black · ' + displayPlayerName(headers.Black) : 'Black';
  topPlayer.textContent = orientation === 'w' ? black : white;
  bottomPlayer.textContent = orientation === 'w' ? white : black;
  topPlayer.dataset.color = orientation === 'w' ? 'b' : 'w';
  bottomPlayer.dataset.color = orientation;
}

function fail(message) {
  timeline = undefined;
  pause();
  error.textContent = message;
  error.hidden = false;
  boardElement.hidden = true;
  topPlayer.hidden = true;
  bottomPlayer.hidden = true;
  moveList.replaceChildren();
  const note = document.createElement('p');
  note.className = 'moves-unavailable';
  note.textContent = 'Move history is unavailable for this recording.';
  moveList.append(note);
  status.textContent = '';
  delete boardElement.dataset.fen;
  delete boardElement.dataset.lastMove;
}

function keepCurrentMoveVisible() {
  const active = moveList.querySelector('[aria-current]');
  if (!active || moveList.clientHeight === 0) return;
  const item = active.getBoundingClientRect();
  const viewport = moveList.getBoundingClientRect();
  if (item.top < viewport.top || item.bottom > viewport.bottom) {
    moveList.scrollTop += item.top - viewport.top - (viewport.height - item.height) / 2;
  }
}

function setPosition(index) {
  if (!timeline || !board || boardFailure) return;
  current = Math.max(0, Math.min(timeline.moves.length, index));
  const fen = timeline.positions[current];
  const renderRevision = ++revision;
  // No queued animation: rapid stepping and game switching stay deterministic.
  Promise.resolve(board.setPosition(fen, false)).catch(cause => {
    if (revision === renderRevision) fail(`Could not display this position: ${cause.message}`);
  });
  board.removeMarkers(lastMoveMarker);
  const move = timeline.moves[current - 1];
  if (move) {
    board.addMarker(lastMoveMarker, move.from);
    board.addMarker(lastMoveMarker, move.to);
    boardElement.dataset.lastMove = move.from + '-' + move.to;
  } else delete boardElement.dataset.lastMove;
  boardElement.dataset.fen = fen;
  boardElement.setAttribute('aria-label', move ?
    `Recorded game, position after ${move.san}, last move ${move.from} to ${move.to}` :
    'Recorded game, starting position');
  updateControls();
  keepCurrentMoveVisible();
}

function schedule() {
  clearTimeout(timer);
  if (!playing || !timeline) return;
  timer = setTimeout(() => {
    if (!playing || !timeline) return;
    setPosition(current + 1);
    if (current === timeline.moves.length) pause();
    else schedule();
  }, 1000 / Number(speed.value));
}

function play() {
  if (!timeline || !board || boardFailure) return;
  if (current === timeline.moves.length) setPosition(0);
  playing = true;
  updateControls();
  schedule();
}

function renderMoves() {
  moveList.replaceChildren();
  const table = document.createElement('table');
  table.className = 'move-table';
  table.setAttribute('aria-label', 'Recorded moves by White and Black');
  const head = table.createTHead().insertRow();
  for (const label of ['Move', 'White', 'Black']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    head.append(th);
  }
  const body = table.createTBody();
  let row;
  let number;
  for (const [index, move] of timeline.moves.entries()) {
    if (number !== move.number) {
      number = move.number;
      row = body.insertRow();
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = number + '.';
      row.append(heading);
      row.insertCell();
      row.insertCell();
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.ply = String(index + 1);
    button.textContent = move.san;
    button.setAttribute('aria-label', `Go to move ${move.number}${move.color === 'w' ? '.' : '...'} ${move.san}, ${move.color === 'w' ? 'White' : 'Black'}`);
    button.addEventListener('click', () => { pause(); setPosition(index + 1); });
    row.cells[move.color === 'w' ? 1 : 2].append(button);
  }
  moveList.append(table);
}

function recorded(value) {
  return value && !/^[?.]+$/.test(value) ? value : '';
}

function renderInformation(game) {
  title.textContent = game.title;
  players.textContent = [
    headers.White ? 'White: ' + displayPlayerName(headers.White) : '',
    headers.Black ? 'Black: ' + displayPlayerName(headers.Black) : '',
  ].filter(Boolean).join(' · ');
  information.replaceChildren();
  for (const [label, value] of [
    ['Date', recorded(headers.Date) || game.year],
    ['Event', recorded(headers.Event) || game.event],
    ['Location', recorded(headers.Site) && !/^https?:/.test(headers.Site) ? headers.Site : ''],
    ['Opening', recorded(headers.Opening)],
    ['ECO', recorded(headers.ECO)],
    ['Result', recorded(headers.Result)],
  ]) {
    if (!value) continue;
    const group = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = label;
    const detail = document.createElement('dd');
    detail.textContent = value;
    group.append(term, detail);
    information.append(group);
  }
  if (/^https?:\/\//.test(headers.Site || '')) {
    const group = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = 'Source';
    const detail = document.createElement('dd');
    const link = document.createElement('a');
    link.href = headers.Site;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Original game ↗';
    detail.append(link);
    group.append(term, detail);
    information.append(group);
  }
}

function selectGame(game) {
  pause();
  revision += 1;
  timeline = undefined;
  current = 0;
  headers = gameHeaders.get(game.id);
  for (const [id, button] of gameButtons) {
    button.classList.toggle('is-active', id === game.id);
    button.setAttribute('aria-pressed', String(id === game.id));
  }
  renderInformation(game);
  error.hidden = true;
  try {
    if (boardFailure) throw boardFailure;
    timeline = parseReplay(game.pgn);
    if (!board) throw new Error('The chessboard is still loading. Please try again.');
    boardElement.hidden = false;
    topPlayer.hidden = false;
    bottomPlayer.hidden = false;
    updatePlayerLabels();
    renderMoves();
    moveList.scrollTop = 0;
    setPosition(0);
  } catch (cause) {
    fail(`This recorded game cannot be replayed. ${cause.message}`);
  }
}

for (const [label, personal] of [['My games', true], ['Historical games', false]]) {
  const games = FAVORITE_GAMES.filter(game => {
    const info = gameHeaders.get(game.id);
    return [info.White, info.Black].some(isPersonalPlayer) === personal;
  });
  if (!games.length) continue;
  const group = document.createElement('section');
  group.className = 'game-group';
  const heading = document.createElement('h4');
  heading.textContent = label + ' · ' + games.length;
  group.append(heading);
  for (const game of games) {
    const info = gameHeaders.get(game.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-list-item';
    button.dataset.gameId = game.id;
    button.setAttribute('aria-pressed', 'false');
    for (const [className, text] of [
      ['game-list-title', info.White && info.Black ? displayPlayerName(info.White) + ' v ' + displayPlayerName(info.Black) : game.title],
      ['game-list-event', [game.year, recorded(info.Opening) ? recorded(info.Event) || game.event : game.event || recorded(info.Event)].filter(Boolean).join(' · ')],
      ['game-list-opening', recorded(info.Opening)],
    ]) {
      if (!text) continue;
      const span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      button.append(span);
    }
    button.addEventListener('click', () => selectGame(game));
    gameButtons.set(game.id, button);
    group.append(button);
  }
  gameList.append(group);
}

async function flipBoard() {
  if (!board || flipping || !timeline) return;
  pause();
  flipping = true;
  updateControls();
  const next = orientation === 'w' ? 'b' : 'w';
  try {
    await board.setOrientation(next, false);
    orientation = next;
    boardElement.dataset.orientation = next;
    updatePlayerLabels();
  } catch (cause) {
    fail(`Could not flip this board: ${cause.message}`);
  } finally {
    flipping = false;
    updateControls();
  }
}

for (const button of actions) button.addEventListener('click', () => {
  const action = button.dataset.replayAction;
  if (action === 'play') { if (playing) pause(); else play(); return; }
  if (action === 'flip') { flipBoard(); return; }
  pause();
  if (action === 'restart') { setPosition(0); play(); }
  if (action === 'first') setPosition(0);
  if (action === 'previous') setPosition(current - 1);
  if (action === 'next') setPosition(current + 1);
  if (action === 'last') setPosition(timeline.moves.length);
});
replay.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey ||
      event.shiftKey || event.target.closest('select, input, textarea, summary, [contenteditable]') || !timeline) return;
  event.preventDefault();
  pause();
  setPosition(current + (event.key === 'ArrowRight' ? 1 : -1));
});
speed.addEventListener('change', schedule);
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('pagehide', pause);
updateControls();

try {
  const { Chessboard } = await import('https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.11/src/Chessboard.js');
  const { Markers } = await import('https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.11/src/extensions/markers/Markers.js');
  board = new Chessboard(boardElement, {
    assetsUrl: 'https://cdn.jsdelivr.net/npm/cm-chessboard@8.12.11/assets/',
    orientation: 'w',
    style: { cssClass: 'portfolio-board', showCoordinates: true, animationDuration: 0 },
    extensions: [{ class: Markers, props: { autoMarkers: null } }],
  });
  boardElement.dataset.orientation = 'w';
  const first = FAVORITE_GAMES[0];
  if (first) selectGame(first);
  else fail('No recorded games are available yet.');
} catch (cause) {
  boardFailure = new Error('The chessboard could not load. Check your connection and refresh.');
  fail(boardFailure.message);
}
