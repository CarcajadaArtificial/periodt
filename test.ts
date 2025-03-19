import { logGrid, periodt } from "./mod.ts";

// deno-fmt-ignore
const characters = ["A","B","B","B","B","C","C","D","D","H","H","H","H","X","K","L","T","T","N","P","P","P","P","R","S","I","I","I","I","I","I","I","I","I","I","I","I"]

logGrid(periodt(characters), characters.length);
