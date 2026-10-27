IFX Marketing — icons
=====================

All interface icons used by this website are inlined as SVG directly in the HTML
(header logo mark, service icons, WhatsApp glyph, check marks, arrows and the
social icons in the footer). Nothing is fetched from an icon CDN or font library.

This folder intentionally holds no separate icon files, because every icon is
markup inside the pages and inherits CSS colour through `currentColor`.

Adding your own icons
---------------------
1. Save an SVG file here, e.g. `assets/icons/partner.svg`.
2. Use it from a page with:
   <img src="assets/icons/partner.svg" alt="Partner programme" width="24" height="24">
3. Always set width and height attributes to avoid layout shift, and give a
   meaningful alt value (or alt="" plus aria-hidden="true" when decorative).

Licensing
---------
Do not add third-party icon sets here without checking the licence permits
redistribution inside a client website. The icons in this build were drawn for
this project.
