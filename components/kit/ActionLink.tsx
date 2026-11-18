import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionVariants = cva("font-medium transition-colors", {
  variants: {
    tone: {
      ink: "bg-ink text-canvas hover:bg-graphite",
      soft: "bg-soft text-ink hover:bg-soft-2",
      white: "bg-white text-ink hover:bg-white/90",
      /** On a painting: frosted, white text. */
      glass: "bg-white/16 text-white backdrop-blur-md hover:bg-white/26",
    },
    size: {
      md: "h-11 px-5 text-[0.875rem] max-md:text-base lg:h-10 lg:px-[18px]",
      lg: "h-12 px-5 text-md md:h-11",
      wide: "h-12 w-full px-4 text-md md:h-11",
    },
    shape: {
      /** 8 px, the default button radius. */
      soft: "rounded-lg",
      /** 4 px, the hero's squarer buttons. */
      square: "rounded-xs",
    },
  },
  defaultVariants: { tone: "ink", size: "md", shape: "soft" },
});

type ActionLinkProps = Omit<ComponentProps<"a">, "href"> &
  VariantProps<typeof actionVariants> & {
    href: string;
  };

/**
 * A link that looks like a button: shadcn's Button rendered as an anchor, with
 * the Adamass tones on top. External links open in a new tab.
 */
export function ActionLink({ href, tone, size, shape, className, children, ...props }: ActionLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <Button asChild className={cn(actionVariants({ tone, size, shape }), className)}>
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    </Button>
  );
}
