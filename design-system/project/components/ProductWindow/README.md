# ProductWindow

A browser window that switches between the landing pages of our own products, with a third tab, "Yours", held open for the visitor's project.

**Props**: `tabs` (`[{ name, status, mark, src, srcDark, phone, phoneDark, alt }]`), `auto` (rotate every 5.2s until someone clicks), `interval`, `yours` (set `false` to hide the open tab), `yoursHref`.

- Screenshots are real captures of the live products at 1440×900, never mockups.
- Give a dark capture (`srcDark`) where the product has a dark mode, so the window follows the theme.
- The phone appears only for products with a phone capture.
- Client work never goes in this window. It stays on the Work page as text.
