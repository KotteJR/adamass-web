/** A paragraph in the product modal's panels. */
export function PanelText({ children }: { children: string }) {
  return <p className="text-[15.5px] leading-[1.62] text-[#3d424a] dark:text-ink-2">{children}</p>;
}
