import type { ReactNode } from "react";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

type ServiceFigurePanelProps = {
  service: Service;
  index: number;
  className?: string;
  /** The animated figure. */
  children: ReactNode;
};

/**
 * A service's figure in its paper frame. Under it, once the plate is 520 px
 * wide, a quiet strip says what the service involves, in three parts, with the
 * same dot as the moments on the timeline. On narrower plates the figure has
 * the frame to itself, and the text below it carries the details.
 */
export function ServiceFigurePanel({ service, index, className, children }: ServiceFigurePanelProps) {
  return (
    <figure data-step={index} aria-label={service.title} className={cn("@container m-0", className)}>
      {/* The figure scales down to fit whatever height is left above the strip. */}
      <div className="absolute inset-x-4 top-11 bottom-11 flex items-center justify-center sm:inset-x-6 @min-[520px]:bottom-[136px] [&>*]:max-h-full [&>*]:w-full [&_svg]:max-h-full">
        {children}
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 hidden border-t border-black/[0.06] dark:border-white/[0.07] px-6 pt-5 pb-6 @min-[520px]:block">
        <ul className="grid grid-cols-3 gap-6">
          {service.entails.map((part) => (
            <li key={part.title} className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-ink">
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-lit" />
                {part.title}
              </span>
              <span className="text-[12.5px] leading-[1.45] text-pretty text-slate">{part.text}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
