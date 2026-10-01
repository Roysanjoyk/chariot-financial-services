You are a senior front-end developer specialising in premium professional-services websites.

Create the complete production-ready `script.js` for the Chariot Financial Services Ltd website.

The existing files are:

index.html
style.css

This JavaScript must work with those files.

==================================================
BUSINESS
==================================================

Chariot Financial Services Ltd

Tagline:
Clarity. Control. Confidence.

Positioning:
ACCA-led accounting, tax and finance support for GP locums, professionals and growing businesses.

Location:
Peterborough-based. Supporting clients across the UK.

Telephone:
07497 528077

Email:
info@chariotfinancialservices.com

Website:
https://chariotfinancialservices.com/

==================================================
TECHNOLOGY
==================================================

Use ONLY:

Vanilla JavaScript

No:
- React
- Vue
- Angular
- jQuery
- Bootstrap
- external JS libraries
- npm packages
- build tools

The website is hosted on GitHub Pages.

The script must work as a normal static JavaScript file.

==================================================
CORE PRINCIPLE
==================================================

JavaScript should enhance the website, not control the website.

The website must remain usable if JavaScript is unavailable.

Do not hide essential content using JavaScript.

Do not create fake functionality.

Do not create:
- fake booking systems
- fake form submissions
- fake notifications
- fake testimonials
- popups
- countdowns
- unnecessary carousels

==================================================
1. INITIALISATION
==================================================

Use:

document.addEventListener("DOMContentLoaded", ...)

Create a main initialisation function:

init()

Call separate functions such as:

initMobileNavigation()
initDropdowns()
initSmoothScrolling()
initHeaderScroll()
initRevealAnimations()
initContactForm()
initActiveNavigation()
initBackToTop()
initCurrentYear()

Each function must safely handle missing elements.

There must be no console errors if optional elements are absent.

==================================================
2. MOBILE NAVIGATION
==================================================

Expected hooks:

.menu-toggle
.site-nav
.site-header
.nav-link

The menu button must:

- open the mobile navigation
- close the mobile navigation
- update `aria-expanded`
- support Escape
- close when a navigation link is clicked
- close when clicking outside the menu
- prevent background scrolling while open where appropriate

Use a class:

.nav-open

on the body or another suitable parent.

Do not assume the exact HTML beyond the hooks listed above.

==================================================
3. DROPDOWN NAVIGATION
==================================================

Expected hooks:

.has-dropdown
.dropdown-toggle
.dropdown-menu

Likely dropdowns:

Services
Who We Help

Requirements:

Desktop:
- clicking the dropdown toggle opens/closes the dropdown
- keyboard accessible
- Escape closes it
- clicking elsewhere closes it

Mobile:
- dropdown behaves as an accordion

Only one dropdown should normally be open at a time.

Update:

aria-expanded

correctly.

Do not rely exclusively on hover.

==================================================
4. SMOOTH SCROLLING
==================================================

For internal links such as:

#services
#who-we-help
#about
#contact

implement smooth scrolling.

Account for a sticky header.

Do not interfere with:
- external URLs
- mailto:
- tel:
- normal links
- links without hash targets

Respect:

prefers-reduced-motion: reduce

==================================================
5. HEADER SCROLL STATE
==================================================

Expected hook:

.site-header

When the user scrolls slightly down, add:

.scrolled

When returning to the top, remove it.

Use an efficient scroll implementation.

Prefer:

requestAnimationFrame

Do not run expensive calculations on every scroll event.

Do not create unnecessary header-hide/show behaviour unless it materially improves the existing design.

==================================================
6. REVEAL ANIMATIONS
==================================================

Expected hook:

.reveal

JavaScript should add:

.is-visible

using IntersectionObserver.

Requirements:
- subtle
- once only
- no repeated animation
- graceful fallback if IntersectionObserver is unavailable
- respect reduced motion

If reduced motion is enabled, immediately reveal all `.reveal` elements.

==================================================
7. ACTIVE NAVIGATION
==================================================

Expected hook:

.nav-link

Use IntersectionObserver where practical to identify which major page section is visible.

Potential sections:

#services
#who-we-help
#about
#contact

Only add an active state if the relevant navigation element actually exists.

Use:

.active

Do not interfere with external links.

==================================================
8. CONTACT FORM
==================================================

Expected hook:

.contact-form

If a contact form exists, provide lightweight client-side validation.

Potential fields:

name
email
phone
message

Requirements:
- validate required fields
- validate email reasonably
- set aria-invalid when invalid
- provide accessible error messaging
- focus the first invalid field
- do NOT submit personal data anywhere through JavaScript
- do NOT create a fake successful submission message
- allow native form submission if a real form action exists

If there is no form, do nothing.

==================================================
9. BACK TO TOP
==================================================

Expected hook:

.back-to-top

If present:

- hide near the top
- show after scrolling
- smooth scroll to top
- respect reduced motion

If the element doesn't exist, do nothing.

==================================================
10. CURRENT YEAR
==================================================

Expected hook:

.current-year

Populate it with:

new Date().getFullYear()

This supports:

© [year] Chariot Financial Services Ltd

==================================================
11. PHONE AND EMAIL
==================================================

Do not dynamically rewrite the telephone or email.

The HTML should contain:

tel:+447497528077

and:

mailto:info@chariotfinancialservices.com

JavaScript should not intercept these links.

==================================================
12. ACCESSIBILITY
==================================================

Support:

- keyboard navigation
- Escape
- Enter/Space where needed
- aria-expanded
- aria-controls
- aria-invalid
- visible focus
- reduced motion

Do not create keyboard traps.

When a mobile navigation closes, restore focus to the menu button where appropriate.

When a dropdown closes, maintain sensible focus behaviour.

==================================================
13. PERFORMANCE
==================================================

Keep the JavaScript extremely lightweight.

Use:
- event delegation where appropriate
- IntersectionObserver
- requestAnimationFrame where needed
- cached DOM references

Avoid:
- polling
- setInterval
- unnecessary DOM manipulation
- large loops on scroll
- repeated layout calculations

==================================================
14. CODE QUALITY
==================================================

Use:

"use strict";

Use modern JavaScript.

Prefer:

const
let
arrow functions
querySelector
querySelectorAll
classList
addEventListener

Do not expose unnecessary globals.

Do not use:

eval()
document.write()
inline event handlers

==================================================
15. ERROR RESILIENCE
==================================================

Every optional component must fail gracefully.

For example:

If there is no contact form:
navigation must still work.

If there is no dropdown:
scroll animations must still work.

If IntersectionObserver is unavailable:
content must remain visible.

There must be no:

Cannot read properties of null

errors.

==================================================
16. CHARIOT INTERACTION STYLE
==================================================

The website is intended to feel:

Premium
Calm
Professional
Editorial
Restrained
Trustworthy

Therefore avoid:

- bouncing animations
- aggressive transitions
- excessive parallax
- spinning elements
- flashy effects
- popups
- auto-playing content

Interactions should support:

Clarity.
Control.
Confidence.

==================================================
EXPECTED HTML HOOKS
==================================================

The HTML may contain:

.menu-toggle
.site-nav
.site-header
.nav-link
.has-dropdown
.dropdown-toggle
.dropdown-menu
.reveal
.back-to-top
.current-year
.contact-form

Use feature detection.

Do not assume every hook exists.

==================================================
OUTPUT
==================================================

Return ONLY the complete contents of:

script.js

inside one JavaScript code block.

After the code block, provide a very short section called:

Expected HTML hooks

List only the hooks actually required by the JavaScript.
