type Crumb = { label: string; href?: string };

/** Where this page sits: Home / Services / GenAI development. Mono, quiet, the last one not a link. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 type-label text-mute">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <a href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-slate">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
