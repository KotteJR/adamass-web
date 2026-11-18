import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

/** The three choices, in menu order. "system" follows the device (shown as Auto). */
export const themeChoices = [
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
  { value: "system", Icon: MonitorIcon },
] as const;

export type ThemeChoice = (typeof themeChoices)[number]["value"];
