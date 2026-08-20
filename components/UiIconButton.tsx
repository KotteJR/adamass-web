import { forwardRef, type ButtonHTMLAttributes } from "react";
import { ArrowRight, CaretDown, X } from "@phosphor-icons/react";

const icons = {
  arrow: ArrowRight,
  close: X,
  down: CaretDown,
} as const;

type IconName = keyof typeof icons;
type Tone = "on-signal" | "quiet" | "ghost";

type Shared = {
  icon: IconName;
  tone?: Tone;
  className?: string;
};

type ButtonProps = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    label: string;
    decorative?: false;
  };

type MarkProps = Shared & {
  decorative: true;
  label?: never;
};

const UiIconButton = forwardRef<HTMLButtonElement, ButtonProps | MarkProps>(
  function UiIconButton(props, ref) {
    const {
      icon,
      tone = "quiet",
      className = "",
      decorative,
      ...rest
    } = props;
    const Icon = icons[icon];
    const classes = ["ui-icon-button", `ui-icon-button--${tone}`, className]
      .filter(Boolean)
      .join(" ");
    const mark = <Icon size={18} weight="bold" aria-hidden />;

    if (decorative) {
      return (
        <span className={classes} aria-hidden>
          {mark}
        </span>
      );
    }

    const { label, type, ...buttonRest } = rest as ButtonProps;

    return (
      <button
        ref={ref}
        className={classes}
        type={type ?? "button"}
        aria-label={label}
        {...buttonRest}
      >
        {mark}
      </button>
    );
  },
);

export default UiIconButton;
