import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero } from "@/content/home";
import { site } from "@/content/site";

export const alt = `${site.shortName}: ${hero.headline.lead} ${hero.headline.rest}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Local assets don't depend on the request: read once, at module scope.
// Literal paths keep the file tracing to these two files.
const [logoBytes, paintingBytes] = await Promise.all([
  readFile(join(process.cwd(), "public/brand/adamass-lockup-primary.svg")),
  readFile(join(process.cwd(), "assets/og/painting.jpg")),
]);
const logo = `data:image/svg+xml;base64,${logoBytes.toString("base64")}`;
const painting = `data:image/jpeg;base64,${paintingBytes.toString("base64")}`;

/** The share card: lockup, the two-line hero headline, the painting band. */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 64px 0" }}>
          <img src={logo} width={224} height={40} alt="" />
          <div style={{ fontSize: 22, color: "#6b7079" }}>{site.url.replace("https://", "")}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "58px 64px 0",
            fontSize: 60,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
          }}
        >
          <div style={{ color: "#8a8f98" }}>{hero.headline.lead}</div>
          <div style={{ color: "#111214" }}>{hero.headline.rest}</div>
        </div>
        <div style={{ display: "flex", marginTop: "auto", height: 220, background: "#6f8fb3" }}>
          <img src={painting} width={1200} height={220} style={{ objectFit: "cover" }} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
