//   ___         _         _ _
//  | _ \___ _ _(_)___  __| | |_
//  |  _/ -_) '_| / _ \/ _` |  _|
//  |_| \___|_| |_\___/\__,_|\__|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Grid, Position } from "@ktc/tilelib-2d";

/**
 * Displays a "periodic table"–like layout of items,
 * using a grid system that implements GridBase and uses Position objects.
 *
 * @param items - An array of items to be arranged in the grid.
 * @param getGroupingId - A function that returns a string grouping identifier for an item.
 * @param getDefault - A function that returns a default/filler value for empty grid cells.
 * @returns A grid (as a 2D array) representing the arranged items.
 */
export function periodt<T>(
  items: T[],
  getGroupingId: (item: T) => string,
  getDefault: () => T,
  silent: boolean = true,
  random: boolean = false,
): T[][] {
  const sortedGroups = sortAndGroupItems(items, getGroupingId);
  const orderedItems = random
    ? shuffleGroups(sortedGroups)
    : sortedGroups.flat();
  const cols = Math.round(Math.sqrt(orderedItems.length * 5));
  const rows = Math.round(cols / 3);
  const layout = buildLayout(rows, cols);
  const grid = fillGrid(orderedItems, layout, cols, rows, getDefault);
  const arrayGrid = compressGrid(grid.grid(), getDefault);
  if (!silent) logGrid(arrayGrid, items.length, getGroupingId);
  return arrayGrid;
}

/**
 * Removes trailing filler values from each row.
 *
 * @param grid - A 2D array of items.
 * @param getDefault - A function that returns the default/filler value.
 * @returns The grid with trailing filler values removed.
 */
function compressGrid<T>(grid: T[][], getDefault: () => T): T[][] {
  let lowestCount = Infinity;
  // Determine how many filler cells exist at the end of each row.
  for (const row of grid) {
    let count = 0;
    for (let i = row.length - 1; i >= 0; i--) {
      // Compare using JSON.stringify so that objects can be compared too.
      if (JSON.stringify(row[i]) === JSON.stringify(getDefault())) {
        count++;
      } else {
        break;
      }
    }
    lowestCount = Math.min(lowestCount, count);
  }
  return grid.map((row) => row.slice(0, row.length - lowestCount));
}

/**
 * Sorts and groups items into arrays based on their grouping identifier.
 *
 * @param items - An array of items to be sorted and grouped.
 * @param getGroupingId - A function that returns a grouping identifier (a string) for an item.
 * @returns An array of groups, where each group contains items with the same identifier.
 */
function sortAndGroupItems<T>(
  items: T[],
  getGroupingId: (item: T) => string,
): T[][] {
  const sortedItems = items.slice().sort((a, b) =>
    getGroupingId(a).localeCompare(getGroupingId(b))
  );
  const groups: T[][] = [];
  let currentGroup: T[] = [];
  if (sortedItems.length > 0) {
    currentGroup.push(sortedItems[0]);
  }
  for (let i = 1; i < sortedItems.length; i++) {
    if (getGroupingId(sortedItems[i]) === getGroupingId(sortedItems[i - 1])) {
      currentGroup.push(sortedItems[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sortedItems[i]];
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
}

/**
 * Shuffles the groups of items randomly.
 *
 * @param groups - An array of groups of items to be shuffled.
 * @returns A flat array of shuffled items.
 */
function shuffleGroups<T>(groups: T[][]): T[] {
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  return groups.flat();
}

/**
 * Builds the layout for the grid based on the number of rows and columns.
 *
 * @param numRows - The number of rows in the grid.
 * @param totalCols - The total number of columns in the grid.
 * @returns A 2D boolean array representing the layout of the grid.
 */
function buildLayout(numRows: number, totalCols: number): boolean[][] {
  const layout: boolean[][] = [];
  if (numRows < 3) {
    for (let r = 0; r < numRows; r++) {
      layout.push(Array(totalCols).fill(true));
    }
  } else {
    layout.push(createRowLayout(totalCols, 2, 2));
    layout.push(createRowLayout(totalCols, 2, 4));
    layout.push(createRowLayout(totalCols, 5, 5));
    for (let r = 3; r < numRows; r++) {
      layout.push(Array(totalCols).fill(true));
    }
  }
  return layout;
}

/**
 * Creates a row layout for the grid with specified counts of filled cells on the left and right.
 *
 * @param totalCols - The total number of columns in the grid.
 * @param leftCount - The number of filled cells on the left side.
 * @param rightCount - The number of filled cells on the right side.
 * @returns An array representing the row layout.
 */
function createRowLayout(
  totalCols: number,
  leftCount: number,
  rightCount: number,
): boolean[] {
  const row: boolean[] = Array(totalCols).fill(false);
  const left = Math.min(leftCount, totalCols);
  const right = Math.min(rightCount, totalCols - left);
  for (let c = 0; c < left; c++) row[c] = true;
  for (let c = totalCols - right; c < totalCols; c++) row[c] = true;
  return row;
}

/**
 * Fills the grid with items based on the layout.
 *
 * @param items - A flat array of items to fill the grid.
 * @param layout - The layout of the grid indicating where to place items.
 * @param totalCols - The total number of columns in the grid.
 * @param numRows - The total number of rows in the grid.
 * @param getDefault - A function that returns the default/filler value.
 * @returns The filled grid.
 */
function fillGrid<T>(
  items: T[],
  layout: boolean[][],
  totalCols: number,
  numRows: number,
  getDefault: () => T,
): Grid<T> {
  const grid: Grid<T> = new Grid<T>(totalCols, numRows, getDefault);
  let pointer = 0;
  for (let c = 0; c < totalCols; c++) {
    for (let r = 0; r < numRows; r++) {
      if (layout[r][c]) {
        const pos = new Position(c, r);
        grid.set(
          pos,
          pointer < items.length ? items[pointer++] : getDefault(),
        );
      }
    }
  }
  return grid;
}

/**
 * Logs the contents of the grid to the console.
 *
 * @param grid - The grid (as a 2D array) to be logged.
 * @param originalCount - The expected number of non-filler items.
 */
export function logGrid<T>(
  grid: T[][],
  originalCount: number,
  getGroupingId: (item: T) => string,
): void {
  let characterCount = 0;

  console.log(grid);

  for (const row of grid) {
    let rowStr = "";
    for (const item of row) {
      const str = getGroupingId(item);
      if (str.trim() === "") {
        rowStr += str.padEnd(str.length + 3, " ");
      } else {
        rowStr += str.padEnd(str.length + 2, " ");
        characterCount++;
      }
    }
    console.log(rowStr);
  }

  console.log(characterCount === originalCount);
}
