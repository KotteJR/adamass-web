import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

/** A plain text link ending in an arrow: → for the page, ↗ for another site. */
export function ArrowLink({ href, className, children, ...props }: ArrowLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn(
        "group/arrow inline-flex items-center gap-1.5 text-md font-medium text-ink transition-colors hover:text-lit max-lg:min-h-11",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 ease-out-soft group-hover/arrow:translate-x-0.5"
      >
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}
