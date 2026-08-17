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

export type FilmFactIconName = keyof typeof filmFactIcons;

type FilmFactIconProps = {
  name: FilmFactIconName;
};

export default function FilmFactIcon({ name }: FilmFactIconProps) {
  const Icon = filmFactIcons[name];

  return <Icon size={20} weight="regular" aria-hidden />;
}
