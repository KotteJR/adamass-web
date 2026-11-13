import { llmsIndex } from "@/lib/llms";

/** The site in short, as Markdown for AI assistants (llmstxt.org). Built with the site. */
export function GET() {
  return new Response(llmsIndex(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
