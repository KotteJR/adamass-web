import Link from "next/link";
import { ContactModalTrigger } from "@/components/ContactModal";

export default function Header() {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-[70] flex justify-center px-4 pt-4 md:pt-5">
      <nav
        className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-visible rounded-full border border-white/[0.12] bg-[rgba(8,8,10,0.52)] px-3 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:gap-3 sm:px-4 md:gap-5 md:px-5 md:py-2.5"
        aria-label="Main"
      >
        <Link
          href="/"
          className="flex h-8 shrink-0 -translate-y-px items-center justify-center no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:h-9 md:-translate-y-0.5"
        >
          <img
            src="/logo.svg"
            alt="Adamass"
            width={370}
            height={80}
            decoding="async"
            fetchPriority="high"
            className="block h-[14px] w-auto max-w-[min(72px,30vw)] shrink-0 object-contain object-center sm:h-[14px] sm:max-w-[min(78px,32vw)] md:h-[15px] md:max-w-[74px]"
          />
        </Link>

        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-start gap-0.5">
          {["Work", "Studio"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full px-2.5 text-[11px] font-medium leading-none text-white/70 no-underline transition-colors hover:text-white md:h-9 md:px-3 md:text-[13px]"
            >
              {item}
            </a>
          ))}
        </div>

        <ContactModalTrigger />
      </nav>
    </header>
  );
}
