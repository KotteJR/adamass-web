# NavPill

The site navigation: one floating glass pill with the logo, four links, a theme switch and one action.

**Props**: `links` (`[{ label, href, active }]`, four at most), `cta` (`{ label, href }`), `onToggleTheme` (shows the switch when given), `homeHref`.

- On the site it is fixed 16px from the top, hides while scrolling down and returns on any upward scroll.
- Links collapse into a menu under 640px; the CTA stays.
- One action only, and it is always "Start a project".
