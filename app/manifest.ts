import type { MetadataRoute } from "next";
import { SITE_NAME, defaultDescription } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Adamass",
    description: defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#050B16",
    theme_color: "#050B16",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
