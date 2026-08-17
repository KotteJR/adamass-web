import { ImageResponse } from "next/og";

export const alt = "Adamass — boutique IT and software consultancy, Malmö";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(165deg, #0a0a0a 0%, #141418 55%, #0a0a0a 100%)",
        }}
      >
        <div
          style={{
            width: 120,
            height: 8,
            background: "#0066ff",
            marginBottom: 36,
          }}
        />
        <div
          style={{
            color: "#ffffff",
            fontSize: 82,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          }}
        >
          Adamass
        </div>
        <div
          style={{
            marginTop: 28,
            color: "rgba(255,255,255,0.72)",
            fontSize: 32,
            fontWeight: 500,
            maxWidth: 900,
            lineHeight: 1.35,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          }}
        >
          Boutique IT & software consultancy · Malmö, Sweden
        </div>
        <div
          style={{
            marginTop: 20,
            color: "rgba(255,255,255,0.45)",
            fontSize: 22,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          Embedded delivery · Due diligence · Modernisation
        </div>
      </div>
    ),
    { ...size },
  );
}
