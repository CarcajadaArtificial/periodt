# periodt

[![JSR](https://jsr.io/badges/@carcajada/periodt)](https://jsr.io/@carcajada/periodt)
[![JSR](https://jsr.io/badges/@carcajada/periodt/score)](https://jsr.io/@carcajada/periodt)

Groups entities into a shape that superficially resembles a periodic table.

## Usage

Run `deno add jsr:@carcajada/periodt` to install.

```ts
import { periodt } from "./mod.ts";

const characters =
  "AFCDABFEAFBDACFEAFCDAFBAEFDAFCBAFEDAFCBAFEADFCABFEAFEDACFBAFDCABFEAFBCAFEDAFCBAFDEABFCAFEDAFBCAFDEAF".split(
    ""
  );

periodt<string>(
  characters,
  (item) => item,
  () => "",
  false
);

// Outputs
/*
F  F                                                        D
F  F                                                  B  D  D
F  F  F  F  F                                      B  B  D  D
F  F  F  F  F  C  C  C  A  A  A  A  A  A  E  E  E  B  B  D  D
F  F  F  F  C  C  C  A  A  A  A  A  A  A  E  E  E  B  B  D  D
F  F  F  F  C  C  C  A  A  A  A  A  A  A  E  E  E  B  B  D  D
F  F  F  F  C  C  C  A  A  A  A  A  A  E  E  E  B  B  B  D
*/
```
