import {
  ArrowsClockwise,
  Code,
  Key,
  ListChecks,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Stack,
  User,
  Users,
} from "@phosphor-icons/react";
import type { FilmFactIconName } from "@/lib/film";

export const filmFactIcons = {
  pin: MapPin,
  user: User,
  users: Users,
  code: Code,
  layers: Stack,
  shield: ShieldCheck,
  search: MagnifyingGlass,
  list: ListChecks,
  flow: ArrowsClockwise,
  key: Key,
} as const;

type FilmFactIconProps = {
  name: FilmFactIconName;
};

export default function FilmFactIcon({ name }: FilmFactIconProps) {
  const Icon = filmFactIcons[name];

  return <Icon size={20} weight="regular" aria-hidden />;
}
