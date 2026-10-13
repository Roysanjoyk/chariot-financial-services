/* =========================================================
   CHARIOT FINANCIAL SERVICES
   header.js: behaviour for the shared site header
   Mobile menu and dropdowns. Load on every page with:
   <script src="/header.js" defer></script>
   ========================================================= */

(function () {
  "use strict";

  var header = document.querySelector(".cf-header");
  if (!header) return;

  var toggle = header.querySelector("[data-cf-menu-toggle]");
  var nav = header.querySelector("[data-cf-nav]");
  if (!toggle || !nav) return;

  // Also set inline in the header snippet so there is no flash before this file loads.
  document.documentElement.classList.add("cf-js");

  var body = document.body;
  var label = toggle.querySelector(".cf-menu-btn__label");
  var subs = Array.prototype.slice.call(nav.querySelectorAll("[data-cf-sub]"));
  var desktop = window.matchMedia("(min-width: 75rem)");

  function setSub(li, open) {
    li.classList.toggle("cf-open", open);
    li.querySelector(".cf-sub-btn").setAttribute("aria-expanded", String(open));
  }

  function closeSubs(except) {
    subs.forEach(function (li) { if (li !== except) setSub(li, false); });
  }

  function setMenu(open, returnFocus) {
    body.classList.toggle("cf-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    if (!open) {
      closeSubs();
      if (returnFocus) toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true", false);
  });

  subs.forEach(function (li) {
    li.querySelector(".cf-sub-btn").addEventListener("click", function () {
      var open = !li.classList.contains("cf-open");
      closeSubs(li);
      setSub(li, open);
    });
  });

  // Choosing a link closes the dropdown and, on small screens, the menu.
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      closeSubs();
      if (!desktop.matches) setMenu(false, false);
    }
  });

  // Moving keyboard focus to a different top-level item closes an open dropdown (wide screens).
  nav.addEventListener("focusin", function (e) {
    if (desktop.matches) closeSubs(e.target.closest("[data-cf-sub]"));
  });

  // Clicking outside the header closes everything.
  document.addEventListener("click", function (e) {
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeSubs();
    if (!desktop.matches && body.classList.contains("cf-menu-open")) setMenu(false, false);
  });

  // Escape closes the dropdown (wide) or the menu (small).
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openSub = subs.filter(function (li) { return li.classList.contains("cf-open"); })[0];
    if (desktop.matches) {
      if (openSub) {
        setSub(openSub, false);
        openSub.querySelector(".cf-sub-btn").focus();
      }
    } else if (body.classList.contains("cf-menu-open")) {
      setMenu(false, true);
    }
  });

  // Reset when crossing the breakpoint.
  var onBreakpoint = function () { setMenu(false, false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
  else desktop.addListener(onBreakpoint);
})();
