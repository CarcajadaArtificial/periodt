import { logGrid, periodt } from "./mod.ts";

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

const gridInstance = periodt(chars);
logGrid(gridInstance);
