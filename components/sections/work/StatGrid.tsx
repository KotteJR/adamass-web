import type { Stat } from "@/content/work";

/** Three figures in a row, each with its line under it. */
export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <dt className="order-last text-[13px] leading-[1.4] text-slate">{stat.label}</dt>
          <dd className="text-[22px] leading-[1.1] font-medium tracking-[-0.02em] sm:text-[26px]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
