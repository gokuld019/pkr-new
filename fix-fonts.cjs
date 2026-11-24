const fs = require("fs");
const path = require("path");

const src = path.join(process.cwd(), "src");
const fontsFile = path.join(src, "lib", "fonts.js");

fs.mkdirSync(path.dirname(fontsFile), { recursive: true });
fs.writeFileSync(
  fontsFile,
  `import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

export const figtree = localFont({
  src: "../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  display: "swap",
  variable: "--font-figtree",
});

export const geist = GeistSans;
`
);

const map = { Figtree: "figtree", Geist: "geist" };

function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (p.endsWith(".js") && p !== fontsFile) fix(p);
  }
}

function fix(file) {
  let code = fs.readFileSync(file, "utf8");
  const imp = code.match(/import\s*\{\s*(\w+)\s*\}\s*from\s*['"]next\/font\/google['"];?/);
  if (!imp) return;
  const font = imp[1];
  const key = map[font];
  if (!key) return console.log("SKIPPED (unknown font):", file);

  const cfg = new RegExp(`(?:const|let)\\s+(\\w+)\\s*=\\s*${font}\\(\\{[\\s\\S]*?\\}\\)\\s*;?`);
  const m = code.match(cfg);
  if (!m) return console.log("SKIPPED (config not found):", file);

  let rel = path.relative(path.dirname(file), fontsFile.replace(/\.js$/, "")).split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;

  code = code.replace(cfg, "");
  code = code.replace(imp[0], `import { ${key} as ${m[1]} } from "${rel}";`);
  fs.writeFileSync(file, code);
  console.log("fixed:", file);
}

walk(src);