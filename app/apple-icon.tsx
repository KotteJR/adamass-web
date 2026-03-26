import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 10,
              background: "#0066ff",
              marginBottom: 6,
            }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: 88,
              fontWeight: 600,
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            A
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
