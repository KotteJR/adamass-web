import type { ReactNode } from "react";

type UiTagProps = {
  children: ReactNode;
  quiet?: boolean;
};

export default function UiTag({ children, quiet = false }: UiTagProps) {
  return (
    <span className={quiet ? "ui-tag ui-tag--quiet" : "ui-tag"}>{children}</span>
  );
}
