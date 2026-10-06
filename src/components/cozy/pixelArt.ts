// Tiny pixel-art engine for the stickers.
// Sprites are drawn as silhouettes (one char = one pixel); the outline and the
// bottom/right shading are added automatically so every sprite looks consistent.

export const PALETTE: Record<string, string> = {
  k: "#3a2b1a", // outline ink
  w: "#fffaf0", // highlight / cream
  o: "#ef8a3c", // orange
  O: "#c8622a",
  y: "#f8c75a", // yellow
  Y: "#d99a2b",
  r: "#e2553f", // red
  R: "#a93a2c",
  b: "#a5692f", // brown
  B: "#6e4220",
  n: "#dc8f3e", // acorn amber
  N: "#b0652a",
  c: "#f3e4c8", // beige
  C: "#d6bd94",
  a: "#e0ad52", // brass
  A: "#ad7d2d",
  u: "#6f9bd6", // floppy blue
  U: "#4a73ad",
  s: "#c9cfd6", // steel
  S: "#9aa3ad",
  g: "#93ad52", // moss
  G: "#64792f",
};

// base colour -> shade used on the bottom/right edge
const SHADE: Record<string, string> = { o: "O", y: "Y", r: "R", b: "B", n: "N", c: "C", a: "A", u: "U", s: "S", g: "G" };

type SpriteSource = {
  rows: string[];
  outline?: boolean; // add a 1px ink outline around the silhouette (default true)
  shade?: boolean; // darken bottom/right edge pixels (default true)
};

const SOURCES = {
  leaf: {
    rows: [
      ".......o.......",
      "......ooo......",
      "..o..ooOoo..o..",
      "..oo.ooOoo.oo..",
      "o.oooooOooooo.o",
      "ooOoooOOOoooOoo",
      ".ooOooOOOooOoo.",
      "..oooOoOoOooo..",
      ".ooooooOooooooo",
      "ooooooooooooooo",
      "...ooooOoooo...",
      ".....ooOoo.....",
      ".......B.......",
      ".......B.......",
    ],
  },
  acorn: {
    rows: [
      ".....BB.....",
      "......B.....",
      "..bbbbbbbb..",
      ".bBbBbBbBbb.",
      "bBbBbBbBbBbb",
      "bbbbbbbbbbbb",
      ".nwnnnnnnnn.",
      ".nwnnnnnnnn.",
      ".nnnnnnnnnn.",
      "..nnnnnnnn..",
      "...nnnnnn...",
      "....nnnn....",
      ".....nn.....",
    ],
  },
  mushroom: {
    rows: [
      "....oooooo....",
      "..oowwoooooo..",
      ".ooowwoooowwo.",
      "owwooooooowwoo",
      "owwoooowwooooo",
      "ooooooowwooooo",
      ".CCCCCCCCCCCC.",
      "....cwcccc....",
      "....cwcccc....",
      "....cccccc....",
      "...cccccccc...",
    ],
  },
  mug: {
    rows: [
      "cBBBBBBBc...",
      "ccccccccccc.",
      "cwccccccc.c.",
      "cwcrcrccc.c.",
      "cwcrrrccc.c.",
      "ccccrcccccc.",
      "ccccccccc...",
      "ccccccccc...",
      ".ccccccc....",
    ],
  },
  star: {
    rows: [
      "......y......",
      ".....yyy.....",
      ".....ywy.....",
      "yyyyyywyyyyyy",
      ".yyyyyyyyyyy.",
      "..yyyyyyyyy..",
      "...yyyyyyy...",
      "..yyyyyyyyy..",
      "..yyyy.yyyy..",
      ".yyy.....yyy.",
      ".yy.......yy.",
    ],
  },
  heart: {
    rows: [
      ".rrr...rrr.",
      "rwwrr.rrrrr",
      "rwrrrrrrrrr",
      "rrrrrrrrrrr",
      ".rrrrrrrrr.",
      "..rrrrrrr..",
      "...rrrrr...",
      "....rrr....",
      ".....r.....",
    ],
  },
  gear: {
    rows: [
      "......aa......",
      "..aa..aa..aa..",
      "..aaaaaaaaaa..",
      "...aaaaaaaa...",
      "..aaaaaaaaaa..",
      "..aaaa..aaaa..",
      "aaaaa....aaaaa",
      "aaaaa....aaaaa",
      "..aaaa..aaaa..",
      "..aaaaaaaaaa..",
      "...aaaaaaaa...",
      "..aaaaaaaaaa..",
      "..aa..aa..aa..",
      "......aa......",
    ],
  },
  floppy: {
    rows: [
      "uuusssssuuu.",
      "uuusSssssuuu",
      "uuusSssssuuu",
      "uuusssssssuu",
      "uuuuuuuuuuuu",
      "uwwwwwwwwwwu",
      "uwooooooowwu",
      "uwwwwwwwwwwu",
      "uwoooowwwwwu",
      "uwwwwwwwwwwu",
      "uuuuuuuuuuuu",
    ],
  },
  cursor: {
    outline: false,
    shade: false,
    rows: [
      "k...........",
      "kk..........",
      "kwk.........",
      "kwwk........",
      "kwwwk.......",
      "kwwwwk......",
      "kwwwwwk.....",
      "kwwwwwwk....",
      "kwwwwwwwk...",
      "kwwwwwwwwk..",
      "kwwwwwkkkkk.",
      "kwwkwwk.....",
      "kwk.kwwk....",
      "kk..kwwk....",
      "k....kwwk...",
      ".....kwwk...",
      "......kk....",
    ],
  },
} satisfies Record<string, SpriteSource>;

export type SpriteName = keyof typeof SOURCES;

export type Sprite = {
  width: number;
  height: number;
  // horizontal runs of same-coloured pixels, merged to keep the SVG small
  runs: { x: number; y: number; w: number; fill: string }[];
};

function build({ rows, outline = true, shade = true }: SpriteSource): Sprite {
  const pad = outline ? 1 : 0;
  const height = rows.length + pad * 2;
  const width = Math.max(...rows.map((r) => r.length)) + pad * 2;
  const grid: string[][] = Array.from({ length: height }, () => Array(width).fill("."));

  rows.forEach((row, y) => [...row].forEach((ch, x) => (grid[y + pad][x + pad] = ch)));

  const filled = (x: number, y: number) =>
    y >= 0 && y < height && x >= 0 && x < width && grid[y][x] !== "." && grid[y][x] !== "k";

  if (shade) {
    const snapshot = grid.map((r) => [...r]);
    const solid = (x: number, y: number) =>
      y >= 0 && y < height && x >= 0 && x < width && snapshot[y][x] !== ".";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const ch = snapshot[y][x];
        if (SHADE[ch] && (!solid(x, y + 1) || !solid(x + 1, y))) grid[y][x] = SHADE[ch];
      }
    }
  }

  if (outline) {
    const edge: [number, number][] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] !== ".") continue;
        if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) edge.push([x, y]);
      }
    }
    edge.forEach(([x, y]) => (grid[y][x] = "k"));
  }

  const runs: Sprite["runs"] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < width) {
      const ch = row[x];
      if (ch === ".") {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < width && row[end] === ch) end++;
      runs.push({ x, y, w: end - x, fill: PALETTE[ch] ?? PALETTE.k });
      x = end;
    }
  });

  return { width, height, runs };
}

export const SPRITES = Object.fromEntries(
  Object.entries(SOURCES).map(([name, source]) => [name, build(source)]),
) as Record<SpriteName, Sprite>;
