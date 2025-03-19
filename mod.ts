//   ___         _         _ _
//  | _ \___ _ _(_)___  __| | |_
//  |  _/ -_) '_| / _ \/ _` |  _|
//  |_| \___|_| |_\___/\__,_|\__|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */
import { Grid, Position } from "@ktc/tilelib-2d";

// deno-fmt-ignore
const chars = [
  "A", "F", "C", "D", "A", "B", "F", "E", "A", "F",
  "B", "D", "A", "C", "F", "E", "A", "F", "C", "D",
  "A", "F", "B", "A", "E", "F", "D", "A", "F", "C",
  "B", "A", "F", "E", "D", "A", "F", "C", "B", "A",
  "F", "E", "A", "D", "F", "C", "A", "B", "F", "E",
  "A", "F", "E", "D", "A", "C", "F", "B", "A", "F",
  "D", "C", "A", "B", "F", "E", "A", "F", "B", "C",
  "A", "F", "E", "D", "A", "F", "C", "B", "A", "F",
  "D", "E", "A", "B", "F", "C", "A", "F", "E", "D",
  "A", "F", "B", "C", "A", "F", "D", "E", "A", "F"
];

/**
 * Adapted function that displays a “periodic table”–like layout of characters,
 * using a grid system that implements GridBase and uses Position objects.
 */
export function periodt(chars: string[]): Grid<string> {
  // 1. Sort the characters so that identical ones are together.
  const sortedChars: string[] = chars.slice().sort();

  // Group the sorted characters by letter.
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

  // Randomize the order of the groups using the Fisher-Yates shuffle.
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }

  // Flatten the randomized groups back into a single array.
  const randomizedChars: string[] = groups.flat();
  const total: number = randomizedChars.length;

  // 2. Compute grid dimensions based on total length.
  //    (Using original fractions, with minimum sizes to ensure a periodic‐table–like layout.)
  let totalCols: number = Math.floor(total / 5);
  let numRows: number = Math.floor(total / 13);
  totalCols = totalCols < 10 ? 10 : totalCols;
  numRows = numRows < 3 ? 3 : numRows;

  // 3. Build a layout (a 2D array of booleans) that marks which grid cells will hold a letter.
  //    For a U‑shaped layout we define "top region" rows specially:
  //    • Row 0: only the first 2 and last 2 cells are active.
  //    • Row 1: only the first 2 and last 4 cells are active.
  //    • Row 2: only the first 5 and last 5 cells are active.
  //    The remaining (bottom) rows are fully active.
  function getLayout(numRows: number, totalCols: number): boolean[][] {
    const layout: boolean[][] = [];
    if (numRows < 3) {
      // For very few rows, mark every cell as active.
      for (let r = 0; r < numRows; r++) {
        layout.push(Array(totalCols).fill(true));
      }
    } else {
      // Top region (first 3 rows)
      // Row 0:
      const row0: boolean[] = Array(totalCols).fill(false);
      const left0: number = Math.min(2, totalCols);
      const right0: number = Math.min(2, totalCols - left0);
      for (let c = 0; c < left0; c++) row0[c] = true;
      for (let c = totalCols - right0; c < totalCols; c++) row0[c] = true;
      layout.push(row0);

      // Row 1:
      const row1: boolean[] = Array(totalCols).fill(false);
      const left1: number = Math.min(2, totalCols);
      const right1: number = Math.min(4, totalCols - left1);
      for (let c = 0; c < left1; c++) row1[c] = true;
      for (let c = totalCols - right1; c < totalCols; c++) row1[c] = true;
      layout.push(row1);

      // Row 2:
      const row2: boolean[] = Array(totalCols).fill(false);
      const left2: number = Math.min(5, totalCols);
      const right2: number = Math.min(5, totalCols - left2);
      for (let c = 0; c < left2; c++) row2[c] = true;
      for (let c = totalCols - right2; c < totalCols; c++) row2[c] = true;
      layout.push(row2);

      // Bottom region: all remaining rows fully active.
      for (let r = 3; r < numRows; r++) {
        layout.push(Array(totalCols).fill(true));
      }
    }
    return layout;
  }

  const layout: boolean[][] = getLayout(numRows, totalCols);

  // 4. Create an empty grid (using our Grid class) and fill the active cells in column–major order.
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

  // 5. "Compress" each column's contiguous active segments.
  //    For each column, we locate each block of adjacent active cells and shift their letters upward.
  for (let c = 0; c < totalCols; c++) {
    let r = 0;
    while (r < numRows) {
      if (layout[r][c]) {
        // Found the start of an active segment.
        const segStart: number = r;
        const segLetters: string[] = [];
        while (r < numRows && layout[r][c]) {
          const pos = new Position(c, r);
          segLetters.push(grid.get(pos) || " ");
          r++;
        }
        // Rewrite the letters at the top of this segment (leaving any leftover cells blank).
        for (let i = 0; i < segLetters.length; i++) {
          grid.set(new Position(c, segStart + i), segLetters[i]);
        }
        // Fill any leftover cells in the segment with blanks.
        for (let i = segLetters.length; i < r - segStart; i++) {
          grid.set(new Position(c, segStart + i), " ");
        }
      } else {
        r++;
      }
    }
  }

  // 6. Print the grid row by row (each cell padded to 3 characters for neat alignment).
  return grid;
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

// Call the periodt function and log the grid
const gridInstance = periodt(chars);
logGrid(gridInstance); // Log the grid using the new function
