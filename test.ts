import { logGrid, periodt } from "./mod.ts";

const characters =
  "AFCDABFEAFBDACFEAFCDAFBAEFDAFCBAFEDFBCAFEDAFCBAFDEABFCAFEDAFBCAFDEAF"
    .split(
      "",
    );

logGrid(periodt(characters));
