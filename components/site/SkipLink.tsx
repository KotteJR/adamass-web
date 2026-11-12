/** First focusable element: jumps keyboard users past the navigation. */
export function SkipLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="fixed top-3 left-3 z-[60] -translate-y-24 inline-flex min-h-11 items-center rounded-lg bg-ink px-4 text-sm font-medium text-white transition-transform focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
