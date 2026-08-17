import type { AnchorHTMLAttributes, ReactNode } from "react";

type UiLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">;

export default function UiLink({
  href,
  children,
  className = "",
  ...rest
}: UiLinkProps) {
  return (
    <a className={["ui-link", className].filter(Boolean).join(" ")} href={href} {...rest}>
      {children}
      <i aria-hidden>↗</i>
    </a>
  );
}
