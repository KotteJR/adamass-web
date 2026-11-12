import type { Person } from "@/content/site";
import { cn } from "@/lib/utils";

type PersonLinkProps = {
  person: Person;
  /** Show the address under the role. */
  showEmail?: boolean;
  className?: string;
};

/** A founder with initials, name and role. Mails them directly. */
export function PersonLink({ person, showEmail = false, className }: PersonLinkProps) {
  return (
    <a
      href={`mailto:${person.email}`}
      className={cn("group/person flex min-h-11 items-start gap-2.5 rounded-lg", className)}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[0.6875rem] text-white",
          person.tone === "deep" ? "bg-deep" : "bg-steel",
        )}
      >
        {person.initials}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium text-ink transition-colors group-hover/person:text-lit">
          {person.name}
        </span>
        <span className="text-xs text-slate">{person.role}</span>
        {showEmail ? (
          <span className="mt-0.5 font-mono text-[0.625rem] tracking-[0.04em] break-all text-mute">{person.email}</span>
        ) : (
          <span className="sr-only">, email {person.email}</span>
        )}
      </span>
    </a>
  );
}
