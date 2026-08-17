import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ink";

type Shared = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonProps = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkProps = Shared &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export default function UiButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const classes = ["ui-button", `ui-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <a className={classes} href={href} {...linkRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonProps;
  return (
    <button className={classes} type={buttonRest.type ?? "button"} {...buttonRest}>
      {children}
    </button>
  );
}
