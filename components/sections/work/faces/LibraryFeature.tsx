import { CheckIcon } from "lucide-react";
import type { CardFeature } from "@/content/work";
import { cn } from "@/lib/utils";

type LibraryFeatureProps = Pick<Extract<CardFeature, { kind: "library" }>, "sentence" | "controls">;

/** A marked phrase in a policy, tied to the one control in the library it matches. */
export function LibraryFeature({ sentence, controls }: LibraryFeatureProps) {
  return (
    <>
      <p className="absolute top-[226px] right-[84px] left-[84px] text-[27px] leading-[1.42] tracking-[-0.015em] text-white/72">
        {sentence.before}
        <span className="text-white underline decoration-2 underline-offset-[7px]">{sentence.marked}</span>
        {sentence.after}
      </p>
      <span className="absolute top-[360px] left-[236px] h-[62px] w-0.5 bg-white" />
      <ul className="absolute top-[422px] right-[84px] left-[84px] flex flex-col gap-3">
        {controls.map((control, i) => (
          <li
            key={control.code}
            className={cn(
              "flex h-14 items-center gap-4 rounded-[10px] px-[18px]",
              i === 0 ? "bg-white text-[#111214]" : "border-[1.5px] border-white/30 text-white/62",
            )}
          >
            <span className={cn("font-mono text-[15px] tracking-[0.04em]", i === 0 && "text-[#2f5b8c]")}>{control.code}</span>
            <span className="text-[19px] font-medium">{control.name}</span>
            {i === 0 ? <CheckIcon className="ml-auto size-5 text-[#2f5b8c]" strokeWidth={2.4} /> : null}
          </li>
        ))}
      </ul>
    </>
  );
}
