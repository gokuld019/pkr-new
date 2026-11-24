import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

export const figtree = localFont({
  src: "../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  display: "swap",
  variable: "--font-figtree",
});

export const geist = GeistSans;
