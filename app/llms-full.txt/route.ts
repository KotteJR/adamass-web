import { llmsFull } from "@/lib/llms";

/** Everything the page says, as Markdown for AI assistants. Built with the site. */
export function GET() {
  return new Response(llmsFull(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
