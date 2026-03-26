import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
              width: 14,
              height: 2,
              background: "#0066ff",
              marginBottom: 1,
            }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: 17,
              fontWeight: 700,
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
              lineHeight: 1,
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
