import { cn } from "@/lib/utils";

/** Morrow's Quint, solved: the guesses as outlines (letters in the right place brighter), the answer in white tiles. */
export function TilesFeature({ guesses, answer }: { guesses: string[]; answer: string }) {
  const rows = [...guesses, answer];
  return (
    <div className="absolute top-[390px] left-1/2 grid w-max -translate-x-1/2 -translate-y-1/2 gap-2.5">
      {rows.map((word, row) => {
        const solved = row === rows.length - 1;
        return (
          <div key={`${row}-${word}`} className="grid grid-cols-[repeat(5,72px)] gap-2.5">
            {[...word].map((letter, column) => (
              <span
                key={column}
                className={cn(
                  "flex size-[72px] items-center justify-center rounded-[10px] text-[32px] font-semibold tracking-[-0.01em]",
                  solved && "bg-white text-[#111214]",
                  !solved && letter === answer[column] && "border-[1.5px] border-white/70 text-white/95",
                  !solved && letter !== answer[column] && "border-[1.5px] border-white/30 text-white/55",
                )}
              >
                {letter}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
