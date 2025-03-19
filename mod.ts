//   ___         _         _ _
//  | _ \___ _ _(_)___  __| | |_
//  |  _/ -_) '_| / _ \/ _` |  _|
//  |_| \___|_| |_\___/\__,_|\__|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Groups entities into a shape that superficially resembles a periodic table.
 * @module
 */
import { Grid, Position } from "@ktc/tilelib-2d";

/**
 * Adapted function that displays a “periodic table”–like layout of characters,
 * using a grid system that implements GridBase and uses Position objects.
 */
export function periodt(chars: string[]): Grid<string> {
  const sortedGroups = sortAndGroupChars(chars);
  const randomizedChars = shuffleGroups(sortedGroups);
  const { totalCols, numRows } = computeGridDimensions(randomizedChars.length);
  const layout = buildLayout(numRows, totalCols);
  const grid = fillGrid(randomizedChars, layout, totalCols, numRows);
  compressColumns(grid, layout, totalCols, numRows);
  return grid;
}

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

function shuffleGroups(groups: string[][]): string[] {
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  return groups.flat();
}

function computeGridDimensions(
  total: number,
): { totalCols: number; numRows: number } {
  let totalCols: number = Math.floor(total / 5);
  let numRows: number = Math.floor(total / 13);
  totalCols = totalCols < 10 ? 10 : totalCols;
  numRows = numRows < 3 ? 3 : numRows;
  return { totalCols, numRows };
}

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

function compressColumns(
  grid: Grid<string>,
  layout: boolean[][],
  totalCols: number,
  numRows: number,
): void {
  for (let c = 0; c < totalCols; c++) {
    let r = 0;
    while (r < numRows) {
      if (layout[r][c]) {
        const segStart: number = r;
        const segLetters: string[] = [];
        while (r < numRows && layout[r][c]) {
          const pos = new Position(c, r);
          segLetters.push(grid.get(pos) || " ");
          r++;
        }
        for (let i = 0; i < segLetters.length; i++) {
          grid.set(new Position(c, segStart + i), segLetters[i]);
        }
        for (let i = segLetters.length; i < r - segStart; i++) {
          grid.set(new Position(c, segStart + i), " ");
        }
      } else {
        r++;
      }
    }
  }
}

// New function to log the grid cells
export function logGrid(grid: Grid<string>): void {
  const numRows = grid.height;
  const totalCols = grid.width;

  for (let r = 0; r < numRows; r++) {
    let rowStr = "";
    for (let c = 0; c < totalCols; c++) {
      const pos = new Position(c, r);
      rowStr += (grid.get(pos) || " ").toString().padEnd(3, " ");
    }
    console.log(rowStr);
  }
}
