import { ImageResponse } from "next/og";
import AdamassImageLogo from "@/components/AdamassImageLogo";

export const alt = "Adamass AB, boutique IT and software consultancy in Malmö";
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
          justifyContent: "space-between",
          padding: "76px 84px 72px",
          background: "#050B16",
        }}
      >
        <AdamassImageLogo size={72} variant="reversed" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              maxWidth: 780,
              color: "#FFFFFF",
              fontFamily: "sans-serif",
              fontSize: 64,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
            }}
          >
            Senior delivery. Fixed accountability.
          </div>
          <div
            style={{
              color: "#4D94FF",
              fontFamily: "ui-monospace, monospace",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
            }}
          >
            Malmö · Since 2019
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
