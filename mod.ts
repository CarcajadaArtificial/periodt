//   ___         _         _ _
//  | _ \___ _ _(_)___  __| | |_
//  |  _/ -_) '_| / _ \/ _` |  _|
//  |_| \___|_| |_\___/\__,_|\__|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Grid, Position } from "@ktc/tilelib-2d";

/**
 * Displays a "periodic table"–like layout of characters,
 * using a grid system that implements GridBase and uses Position objects.
 *
 * @param {string[]} chars - An array of characters to be arranged in the grid.
 * @returns {Grid<string>} A grid representing the arranged characters.
 */
export function periodt(chars: string[]): string[][] {
  const sortedGroups = sortAndGroupChars(chars);
  const randomizedChars = shuffleGroups(sortedGroups);
  const cols = Math.round(Math.sqrt(randomizedChars.length * 5));
  const rows = Math.round(cols / 3);
  const layout = buildLayout(rows, cols);
  const grid = fillGrid(randomizedChars, layout, cols, rows);
  const arrayGrid = compressGrid(grid.grid());
  return arrayGrid;
}

function compressGrid(grid: string[][]): string[][] {
  let lowestCount = Infinity;
  for (const row of grid) {
    let count = 0;
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === " ") {
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
 * Sorts and groups characters into arrays based on their values.
 *
 * @param {string[]} chars - An array of characters to be sorted and grouped.
 * @returns {string[][]} An array of groups, where each group contains identical characters.
 */
function sortAndGroupChars(chars: string[]): string[][] {
  const sortedChars: string[] = chars.slice().sort();
  const groups: string[][] = [];
  let currentGroup: string[] = [];
  if (sortedChars.length > 0) {
    currentGroup.push(sortedChars[0]);
  }
  for (let i = 1; i < sortedChars.length; i++) {
    if (sortedChars[i] === sortedChars[i - 1]) {
      currentGroup.push(sortedChars[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sortedChars[i]];
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups;
}

/**
 * Shuffles the groups of characters randomly.
 *
 * @param {string[][]} groups - An array of groups of characters to be shuffled.
 * @returns {string[]} A flat array of shuffled characters.
 */
function shuffleGroups(groups: string[][]): string[] {
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  return groups.flat();
}

/**
 * Builds the layout for the grid based on the number of rows and columns.
 *
 * @param {number} numRows - The number of rows in the grid.
 * @param {number} totalCols - The total number of columns in the grid.
 * @returns {boolean[][]} A 2D array representing the layout of the grid.
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
 * @param {number} totalCols - The total number of columns in the grid.
 * @param {number} leftCount - The number of filled cells on the left side.
 * @param {number} rightCount - The number of filled cells on the right side.
 * @returns {boolean[]} An array representing the row layout.
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
 * Fills the grid with randomized characters based on the layout.
 *
 * @param {string[]} randomizedChars - An array of characters to fill the grid.
 * @param {boolean[][]} layout - The layout of the grid indicating where to place characters.
 * @param {number} totalCols - The total number of columns in the grid.
 * @param {number} numRows - The total number of rows in the grid.
 * @returns {Grid<string>} The filled grid with characters.
 */
function fillGrid(
  randomizedChars: string[],
  layout: boolean[][],
  totalCols: number,
  numRows: number,
): Grid<string> {
  const grid: Grid<string> = new Grid<string>(totalCols, numRows, () => " ");
  let pointer = 0;
  for (let c = 0; c < totalCols; c++) {
    for (let r = 0; r < numRows; r++) {
      if (layout[r][c]) {
        const pos = new Position(c, r);
        grid.set(
          pos,
          pointer < randomizedChars.length ? randomizedChars[pointer++] : " ",
        );
      }
    }
  }
  return grid;
}

/**
 * Logs the contents of the grid to the console.
 *
 * @param {Grid<string>} grid - The grid to be logged.
 */
export function logGrid(grid: string[][], originalCount: number): void {
  let characterCount = 0;

  console.log(grid);

  for (const row of grid) {
    let rowStr = "";
    for (const char of row) {
      rowStr += char.padEnd(3, " ");
      if (char !== " ") characterCount++;
    }
    console.log(rowStr);
  }

  console.log(characterCount === originalCount);
}
