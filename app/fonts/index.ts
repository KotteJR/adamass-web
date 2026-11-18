import localFont from "next/font/local";

// The site's face: Sphere Sans by Studio Sphere (SIL Open Font License 1.1, see
// sphere-sans/OFL.txt). Sphere Sans sets text, Sphere Sans Display headlines.
// Only the weights the site uses are shipped.

export const sphereSans = localFont({
  variable: "--font-sphere-sans",
  src: [
    { path: "./sphere-sans/SphereSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./sphere-sans/SphereSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./sphere-sans/SphereSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
});

export const sphereSansDisplay = localFont({
  variable: "--font-sphere-sans-display",
  src: [{ path: "./sphere-sans/SphereSansDisplay-Medium.woff2", weight: "500", style: "normal" }],
});
