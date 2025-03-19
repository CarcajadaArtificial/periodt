# periodt

[![JSR](https://jsr.io/badges/@carcajada/periodt)](https://jsr.io/@carcajada/periodt)
[![JSR](https://jsr.io/badges/@carcajada/periodt/score)](https://jsr.io/@carcajada/periodt)

Groups entities into a shape that superficially resembles a periodic table.

## Usage

Run `deno add jsr:@carcajada/periodt` to install.

```ts
import { logGrid, periodt } from "./mod.ts";

const characters =
  "AFCDABFEAFBDACFEAFCDAFBAEFDAFCBAFEDAFCBAFEADFCABFEAFEDACFBAFDCABFEAFBCAFEDAFCBAFDEABFCAFEDAFBCAFDEAF".split(
    ""
  );

logGrid(periodt(characters));

// Outputs
/*
E  E                                                  B  C
E  E                                            A  B  B  C
E  E  D  D  F                                A  A  B  C  C
E  E  D  D  F  F  F  F  F  F  F  A  A  A  A  A  B  B  C  C
E  E  D  D  F  F  F  F  F  F  A  A  A  A  A  A  B  B  C  C
E  D  D  D  F  F  F  F  F  F  A  A  A  A  A  A  B  B  C  C
E  D  D  D  F  F  F  F  F  F  A  A  A  A  A  A  B  B  C  C
*/
```
