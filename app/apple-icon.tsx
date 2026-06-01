import { ImageResponse } from "next/og";

// Bild-Metadaten
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Apple-Touch-Icon — wird beim Hinzufügen zum iOS-Homescreen verwendet.
 * Wir generieren es zur Build-Zeit aus Code, damit kein extra Designtool nötig ist.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#2e3d2c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 130,
          color: "#c97c5d",
          lineHeight: 1,
          paddingBottom: 12,
        }}
      >
        &amp;
      </div>
    ),
    { ...size },
  );
}
