import { serializeJsonLd } from "@/lib/json-ld";

/** A page's own structured data, beside the site-wide graph in the layout. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
