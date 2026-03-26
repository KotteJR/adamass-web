import type { MetadataRoute } from "next";
import { SITE_NAME, defaultDescription } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Adamass",
    description: defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
  };
}
