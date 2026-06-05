export const TOWER_CELL_EVENT = {
  START: 'start',
  GATE: 'gate',
  BATTLE: 'battle',
  MERCHANT: 'merchant',
  TREASURE: 'treasure',
};

const EVENT_WEIGHTS = [
  { event: TOWER_CELL_EVENT.BATTLE, weight: 0.64 },
  { event: TOWER_CELL_EVENT.MERCHANT, weight: 0.18 },
  { event: TOWER_CELL_EVENT.TREASURE, weight: 0.18 },
];

function pickEvent(random = Math.random) {
  const roll = random();
  let cursor = 0;

  for (const entry of EVENT_WEIGHTS) {
    cursor += entry.weight;
    if (roll <= cursor) return entry.event;
  }

  return TOWER_CELL_EVENT.BATTLE;
}

export function getDoomTowerCellCount(floor) {
  return floor * 2 + 2;
}

export function createDoomTowerFloor(floor, random = Math.random) {
  const rows = floor + 1;
  const columns = 2;
  const startId = `${rows - 1}:1`;
  const gateId = '0:0';
  const cells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const id = `${row}:${column}`;
      let event = pickEvent(random);

      if (id === startId) event = TOWER_CELL_EVENT.START;
      if (id === gateId) event = TOWER_CELL_EVENT.GATE;

      cells.push({ id, row, column, event });
    }
  }

  return {
    floor,
    rows,
    columns,
    startId,
    gateId,
    currentId: startId,
    visitedIds: [startId],
    revealedIds: [startId, gateId],
    cells,
  };
}

export function getTowerCell(state, cellId) {
  return state?.cells?.find((cell) => cell.id === cellId) ?? null;
}

export function getReachableTowerCellIds(state) {
  if (!state) return [];

  const current = getTowerCell(state, state.currentId);
  if (!current) return [];

  const candidates = [
    { row: current.row - 1, column: current.column },
    { row: current.row + 1, column: current.column },
    { row: current.row, column: current.column - 1 },
    { row: current.row, column: current.column + 1 },
  ];

  return candidates
    .filter(({ row, column }) => row >= 0 && row < state.rows && column >= 0 && column < state.columns)
    .map(({ row, column }) => `${row}:${column}`)
    .filter((id) => id !== state.currentId && getTowerCell(state, id));
}

export function enterTowerCell(state, cellId) {
  const cell = getTowerCell(state, cellId);
  if (!cell) return state;

  return {
    ...state,
    currentId: cellId,
    visitedIds: Array.from(new Set([...state.visitedIds, cellId])),
    revealedIds: Array.from(new Set([...state.revealedIds, cellId])),
  };
}
