# Button

A pill button with four variants; `ink` is the default action and `blue` is reserved for the one primary action in view.

**Props**: `variant` (`ink` | `blue` | `quiet` | `glass`), `size` (`md` | `sm`), `href` (renders a link), `arrow` (trailing arrow), `onClick`, `disabled`, `children` (the label).

- `ink` turns blue on hover. Use it for "Start a project" in the nav and section CTAs.
- `blue` appears at most once per view: the scoper's send action, the open slot card.
- `quiet` is the secondary action beside an `ink` or `blue` one.
- `glass` only sits on photographs (the hero).
- Labels are verbs in sentence case: "Start a project", "See the work". No "Learn more", no "Click here".
