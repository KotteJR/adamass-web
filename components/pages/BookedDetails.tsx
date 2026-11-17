"use client";

import { useSyncExternalStore } from "react";
import { BOOKED_KEY } from "@/components/contact/BookingPanel";
import type { PagesContent } from "@/content/pages";
import type { Lang } from "@/content/locale";

type Booked = { start?: string; end?: string; email?: string; zone?: string };

const subscribeNever = () => () => {};
const readBooked = () => {
  try {
    return sessionStorage.getItem(BOOKED_KEY) ?? "";
  } catch {
    return "";
  }
};

/** The time and address of the call just booked, from this tab's session. Generic when there is none. */
export function BookedDetails({ copy, lang }: { copy: PagesContent["booked"]; lang: Lang }) {
  const raw = useSyncExternalStore(subscribeNever, readBooked, () => "");
  let booked: Booked = {};
  try {
    booked = raw ? (JSON.parse(raw) as Booked) : {};
  } catch {
    booked = {};
  }
  const locale = lang === "sv" ? "sv-SE" : "en-GB";
  const zone = booked.zone ?? undefined;
  const when =
    booked.start && booked.end
      ? `${new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(booked.start))}–${new Intl.DateTimeFormat(locale, { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(booked.end))}`
      : null;

  return (
    <div className="flex flex-col gap-3">
      {when ? (
        <p className="text-lg text-ink">
          <span className="sr-only">{copy.when}: </span>
          {when.charAt(0).toUpperCase() + when.slice(1)}
        </p>
      ) : null}
      <p className="text-base text-slate">{booked.email ? copy.sentTo.replace("{email}", booked.email) : copy.sent}</p>
      <p className="text-base text-slate">{copy.move}</p>
    </div>
  );
}
