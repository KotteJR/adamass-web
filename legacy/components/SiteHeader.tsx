import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-[70] flex justify-center px-4 pt-4 md:pt-5">
      <nav
        className="pointer-events-auto header-pill flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border border-white/[0.12] bg-[rgba(8,8,10,0.52)] px-2.5 py-2 pl-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:max-w-full sm:gap-3 sm:px-3 sm:pl-4 md:gap-5 md:px-4 md:py-2.5 md:pl-5"
        aria-label="Main"
      >
        <Link
          href="/"
          className="focus-ring-inverse flex shrink-0 items-center gap-2.5 no-underline"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.12] text-[11px] font-bold tracking-tight text-white ring-1 ring-inset ring-white/15"
            aria-hidden
          >
            A
          </span>
          <span className="hidden font-sans text-[15px] font-semibold tracking-[-0.02em] text-white sm:inline">
            Adamass
          </span>
        </Link>

        <div className="hidden h-5 w-px shrink-0 bg-white/15 sm:block" aria-hidden />

        <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1 md:justify-start">
          <a
            href="#work"
            className="focus-ring-inverse shrink-0 rounded-full px-2 py-2 text-[11px] font-medium text-white/72 no-underline transition-colors hover:text-white md:px-3 md:text-[13px]"
          >
            Work
          </a>
          <a
            href="#studio"
            className="focus-ring-inverse hidden shrink-0 rounded-full px-2 py-2 text-[11px] font-medium text-white/72 no-underline transition-colors hover:text-white sm:inline md:px-3 md:text-[13px]"
          >
            Studio
          </a>
          <a
            href="#capabilities"
            className="focus-ring-inverse shrink-0 rounded-full px-2 py-2 text-[11px] font-medium text-white/72 no-underline transition-colors hover:text-white md:px-3 md:text-[13px]"
          >
            Capabilities
          </a>
          <a
            href="#engage"
            className="focus-ring-inverse hidden shrink-0 rounded-full px-2 py-2 text-[11px] font-medium text-white/72 no-underline transition-colors hover:text-white lg:inline md:px-3 md:text-[13px]"
          >
            Engage
          </a>
        </div>

        <a
          href="mailto:hello@adamass.se"
          className="focus-ring-inverse ml-auto shrink-0 rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--black)] no-underline transition-[transform,opacity] hover:opacity-95 active:scale-[0.98] md:px-5 md:py-2.5 md:text-[11px] md:tracking-[0.16em]"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
