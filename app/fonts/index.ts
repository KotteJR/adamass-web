import localFont from "next/font/local";

// The site's face: Sphere Sans by Studio Sphere (SIL Open Font License 1.1, see
// sphere-sans/OFL.txt), set the way studiosphere.co sets it: the text cut for
// everything, headlines included.
//
// Sphere Sans draws one step heavier than the face the site was designed in, so
// each CSS weight takes the cut one step lighter and strokes stay as thick as
// before: 400 is Light, 500 (font-medium) is Regular, 600 is Medium. Only the
// cuts the site uses are shipped.

export const sphereSans = localFont({
  variable: "--font-sphere-sans",
  src: [
    { path: "./sphere-sans/SphereSans-Light.woff2", weight: "400", style: "normal" },
    { path: "./sphere-sans/SphereSans-Regular.woff2", weight: "500", style: "normal" },
    { path: "./sphere-sans/SphereSans-Medium.woff2", weight: "600", style: "normal" },
  ],
});
