import type { StackGroup } from "@/content/work";
import { PanelLabel } from "./PanelLabel";

/** What it is built with, by group. */
export function StackPanel({ stack }: { stack: StackGroup[] }) {
  return (
    <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
      {stack.map((group) => (
        <div key={group.name} className="flex flex-col gap-2.5">
          <PanelLabel>{group.name}</PanelLabel>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li
                key={item}
                className="inline-flex h-[26px] items-center rounded-md bg-soft px-[9px] text-[12.5px] whitespace-nowrap text-[#2a2d33]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
