# Logo

The Adamass lockup (`[adamass]` with a superscript AB) and the mark (`[a]` on a blue tile), drawn from the brand files.

The component draws the letters in `currentColor` and the AB and tile in `blue`, so it follows the theme. The second row of the preview shows the original files from the Logos assets on their intended grounds.

**Props**: `variant` (`"lockup"` default, or `"mark"`), `size` (height in px; lockup default 18, mark default 40), `className`.

- Use the lockup in the nav (17px tall) and footer; use the mark for favicons, avatars and anywhere under 120px wide.
- Minimum size: lockup 14px tall, mark 20px.
- Clear space: half the lockup's height on every side; a quarter of the tile for the mark.
- Do not recolour the letters blue, outline them, or set "Adamass" in Geist as a substitute.
- The files still use the previous blue `#0066FF`. The component uses the token `blue`. Pick one before launch.
