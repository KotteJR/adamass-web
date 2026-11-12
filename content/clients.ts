// Client logos, shown monochrome in currentColor through a CSS mask.
// PNG sources are turned into trimmed masks by scripts/build-client-logos.mjs;
// the SVGs are used as they are.

export type ClientLogoAsset = {
  name: string;
  /** Mask image: black (or any colour) on transparent. */
  mask: string;
  /** Width / height of the artwork. */
  aspect: number;
  /** Optical correction on top of the shared sizing rule (1 = none). */
  scale?: number;
};

export const clientLogos: readonly ClientLogoAsset[] = [
  { name: "IKEA", mask: "/clients/mono/ikea.png", aspect: 2.667, scale: 0.92 },
  { name: "Nasdaq", mask: "/clients/mono/nasdaq.png", aspect: 3.514 },
  { name: "Tele2", mask: "/clients/tele2.svg", aspect: 355 / 140, scale: 0.88 },
  { name: "Thomson Reuters", mask: "/clients/mono/thomson-reuters.png", aspect: 7.138 },
  { name: "The Guardian", mask: "/clients/guardian.svg", aspect: 295 / 97 },
  { name: "Liverpool FC", mask: "/clients/mono/liverpool.png", aspect: 0.739, scale: 1.12 },
  { name: "Stabenfeldt", mask: "/clients/mono/stabenfeldt.png", aspect: 3.391 },
  { name: "Eyeradar", mask: "/clients/eyeradar.svg", aspect: 538 / 90 },
];
