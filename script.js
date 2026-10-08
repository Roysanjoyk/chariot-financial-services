
/* =========================================================
   CHARIOT FINANCIAL SERVICES
   Shared site JavaScript
   Mobile navigation, dropdowns, cookie consent and analytics
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     1. Configuration
     ------------------------------------------------------- */

  const CONFIG = {
    // Replace with the real Google Analytics measurement ID.
    // Leave as a placeholder until verified.
    analyticsId: "G-REPLACE-BEFORE-DEPLOYMENT",

    consentKey: "chariot_consent",
    consentVersion: 1,

    // 183 days, approximately six months.
    consentExpiryDays: 183,

    analyticsScriptTimeout: 10000
  };

  const PLACEHOLDER_ID = "G-REPLACE-BEFORE-DEPLOYMENT";

  const isValidAnalyticsId = (id) =>
    /^G-[A-Z0-9]+$/i.test(id) &&
    id !== PLACEHOLDER_ID;

  /* -------------------------------------------------------
     2. Small utilities
     ------------------------------------------------------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // The site must remain usable if storage is unavailable.
      }
    }
  };

  const setHidden = (element, hidden) => {
    if (!element) return;

    element.hidden = hidden;

    if (hidden) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  };

  /* -------------------------------------------------------
     3. Mobile navigation
     ------------------------------------------------------- */

  function initNavigation() {
    const header = $(
      ".site-header, header.site-header, .header"
    );

    const menuToggle = $(
      ".menu-toggle, .mobile-menu-toggle, .nav-toggle, " +
      "[data-menu-toggle]"
    );

    const nav = $(
      ".site-nav, .main-navigation, nav.main-nav, " +
      "[data-site-navigation]"
    );

    if (!header || !menuToggle || !nav) return;

    const isOpen = () =>
      header.classList.contains("menu-open") ||
      menuToggle.getAttribute("aria-expanded") === "true";

    const openMenu = () => {
      header.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      nav.removeAttribute("hidden");
    };

    const closeMenu = () => {
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");

      // Do not hide the desktop navigation.
      if (window.matchMedia("(max-width: 760px)").matches) {
        nav.setAttribute("hidden", "");
      }
    };

    menuToggle.setAttribute(
      "aria-expanded",
      isOpen() ? "true" : "false"
    );

    if (!menuToggle.hasAttribute("aria-controls")) {
      if (!nav.id) nav.id = "primary-navigation";
      menuToggle.setAttribute("aria-controls", nav.id);
    }

    if (
      window.matchMedia("(max-width: 760px)").matches &&
      !isOpen()
    ) {
      nav.setAttribute("hidden", "");
    }

    menuToggle.addEventListener("click", () => {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close after a visitor selects an ordinary navigation link.
    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link) return;

      const dropdownTrigger = link.matches(
        "[aria-haspopup='true'], [data-dropdown-toggle]"
      );

      if (!dropdownTrigger &&
          window.matchMedia("(max-width: 760px)").matches) {
        closeMenu();
      }
    });

    // Close when clicking outside the header.
    document.addEventListener("click", (event) => {
      if (isOpen() && !header.contains(event.target)) {
        closeMenu();
      }
    });

    // Keyboard support.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Restore the correct state when moving between breakpoints.
    let previousMobileState =
      window.matchMedia("(max-width: 760px)").matches;

    window.addEventListener("resize", () => {
      const mobileState =
        window.matchMedia("(max-width: 760px)").matches;

      if (mobileState !== previousMobileState) {
        previousMobileState = mobileState;

        if (mobileState) {
          closeMenu();
        } else {
          header.classList.remove("menu-open");
          menuToggle.setAttribute("aria-expanded", "false");
          nav.removeAttribute("hidden");
        }
      }
    });
  }

  /* -------------------------------------------------------
     4. Accessible dropdown navigation
     ------------------------------------------------------- */

  function initDropdowns() {
    const triggers = $$(
      "[data-dropdown-toggle], " +
      ".dropdown-toggle, " +
      ".has-dropdown > button, " +
      ".has-dropdown > a[aria-haspopup='true']"
    );

    triggers.forEach((trigger) => {
      const parent = trigger.closest(
        ".dropdown, .has-dropdown"
      );

      if (!parent) return;

      const submenu = $(
        ".dropdown-menu, .submenu, [data-dropdown-menu]",
        parent
      );

      if (!submenu) return;

      if (!submenu.id) {
        submenu.id =
          "dropdown-" +
          Math.random().toString(36).slice(2, 10);
      }

      trigger.setAttribute("aria-controls", submenu.id);
      trigger.setAttribute("aria-haspopup", "true");

      const initiallyOpen =
        parent.classList.contains("is-open") ||
        trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute(
        "aria-expanded",
        initiallyOpen ? "true" : "false"
      );

      const setOpen = (open) => {
        parent.classList.toggle("is-open", open);
        trigger.setAttribute(
          "aria-expanded",
          open ? "true" : "false"
        );

        // Use hidden only for click-controlled dropdowns.
        if (trigger.hasAttribute("data-dropdown-toggle")) {
          submenu.hidden = !open;
        }
      };

      if (trigger.tagName === "BUTTON" ||
          trigger.hasAttribute("data-dropdown-toggle")) {
        trigger.addEventListener("click", (event) => {
          event.preventDefault();

          const open =
            trigger.getAttribute("aria-expanded") !== "true";

          setOpen(open);
        });
      }

      parent.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.focus();
        }
      });

      // Close click-controlled menus when focus leaves them.
      parent.addEventListener("focusout", (event) => {
        if (
          trigger.hasAttribute("data-dropdown-toggle") &&
          !parent.contains(event.relatedTarget)
        ) {
          setOpen(false);
        }
      });
    });
  }

  /* -------------------------------------------------------
     5. Cookie consent storage
     ------------------------------------------------------- */

  function readConsent() {
    const raw = safeStorage.get(CONFIG.consentKey);

    if (!raw) return null;

    try {
      const consent = JSON.parse(raw);

      if (
        consent.version !== CONFIG.consentVersion ||
        typeof consent.analytics !== "boolean" ||
        typeof consent.updatedAt !== "number" ||
        typeof consent.expiresAt !== "number" ||
        Date.now() >= consent.expiresAt
      ) {
        safeStorage.remove(CONFIG.consentKey);
        return null;
      }

      return consent;
    } catch {
      safeStorage.remove(CONFIG.consentKey);
      return null;
    }
  }

  function saveConsent(analyticsAllowed) {
    const now = Date.now();

    const consent = {
      version: CONFIG.consentVersion,
      necessary: true,
      analytics: Boolean(analyticsAllowed),
      updatedAt: now,
      expiresAt:
        now +
        CONFIG.consentExpiryDays * 24 * 60 * 60 * 1000
    };

    const saved = safeStorage.set(
      CONFIG.consentKey,
      JSON.stringify(consent)
    );

    return saved ? consent : null;
  }

  /* -------------------------------------------------------
     6. Analytics management
     ------------------------------------------------------- */

  let analyticsRequested = false;
  let analyticsScriptAdded = false;

  function disableAnalytics() {
    const id = CONFIG.analyticsId;

    if (isValidAnalyticsId(id)) {
      window["ga-disable-" + id] = true;
    }

    // Remove Google Analytics cookies on common domain variants.
    // This does not remove cookies set on unrelated domains.
    const host = window.location.hostname;
    const domainParts = host.split(".");
    const domains = new Set([""]);

    for (let i = 0; i < domainParts.length - 1; i++) {
      domains.add(
        "." + domainParts.slice(i).join(".")
      );
    }

    const paths = new Set(["/"]);

    const pathSegments = window.location.pathname
      .split("/")
      .filter(Boolean);

    let currentPath = "";

    for (const segment of pathSegments) {
      currentPath += "/" + segment;
      paths.add(currentPath);
      paths.add(currentPath + "/");
    }

    const cookieNames = document.cookie
      .split(";")
      .map((item) => item.trim().split("=")[0])
      .filter((name) =>
        /^_ga($|_)/.test(name) ||
        /^_gid$/.test(name) ||
        /^_gat($|_)/.test(name)
      );

    cookieNames.forEach((name) => {
      domains.forEach((domain) => {
        paths.forEach((path) => {
          let cookie =
            name +
            "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            "; path=" + path +
            "; SameSite=Lax";

          if (domain) {
            cookie += "; domain=" + domain;
          }

          document.cookie = cookie;
        });
      });
    });
  }

  function enableAnalytics() {
    const id = CONFIG.analyticsId;

    if (!isValidAnalyticsId(id)) {
      console.warn(
        "Chariot: Google Analytics has not been configured with a valid measurement ID."
      );
      return;
    }

    if (analyticsRequested) return;

    analyticsRequested = true;

    // Ensure the global opt-out flag is cleared only after consent.
    window["ga-disable-" + id] = false;

    // The consent check happens before any Google script is injected.
    if (!readConsent()?.analytics) {
      disableAnalytics();
      return;
    }

    if (analyticsScriptAdded) return;

    analyticsScriptAdded = true;

    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = window.gtag || gtag;

    window.gtag("js", new Date());
    window.gtag("config", id, {
      anonymize_ip: true
    });

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(id);

    script.onerror = () => {
      analyticsScriptAdded = false;
      console.error(
        "Chariot: Google Analytics could not be loaded."
      );
    };

    document.head.appendChild(script);
  }

  /* -------------------------------------------------------
     7. Cookie banner and preferences
     ------------------------------------------------------- */

  function initCookieConsent() {
    const banner = $(
      "#cookie-banner, #cookie-consent, " +
      ".cookie-banner, .cookie-consent-banner"
    );

    const preferences = $(
      "#cookie-preferences, #cookie-modal, " +
      ".cookie-preferences, .cookie-modal"
    );

    const acceptButton = $(
      "#accept-cookies, [data-cookie-accept]"
    );

    const rejectButton = $(
      "#reject-cookies, [data-cookie-reject]"
    );

    const settingsButton = $(
      "#cookie-settings, [data-cookie-settings]"
    );

    const saveButton = $(
      "#save-cookie-preferences, [data-cookie-save]"
    );

    const analyticsCheckbox = $(
      "#analytics-cookies, #analytics-consent, " +
      "[name='analytics-consent']"
    );

    const closeButton = $(
      "#close-cookie-preferences, [data-cookie-close]"
    );

    const currentConsent = readConsent();

    const hideBanner = () => setHidden(banner, true);
    const showBanner = () => setHidden(banner, false);

    const closePreferences = () => {
      setHidden(preferences, true);
    };

    const openPreferences = () => {
      if (!preferences) {
        showBanner();
        return;
      }

      const consent = readConsent();

      if (analyticsCheckbox) {
        analyticsCheckbox.checked =
          Boolean(consent?.analytics);
      }

      setHidden(preferences, false);

      const firstControl = $(
        "input, button, select, textarea, a[href]",
        preferences
      );

      if (firstControl) firstControl.focus();
    };

    const applyConsent = (analyticsAllowed) => {
      const consent = saveConsent(analyticsAllowed);

      if (!consent) {
        // If consent cannot be saved, fail closed:
        // do not load analytics.
        disableAnalytics();
        hideBanner();
        closePreferences();
        console.warn(
          "Chariot: consent could not be saved; analytics remains disabled."
        );
        return;
      }

      hideBanner();
      closePreferences();

      if (analyticsAllowed) {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
    };

    if (!currentConsent) {
      showBanner();
      disableAnalytics();
    } else {
      hideBanner();

      if (currentConsent.analytics) {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
    }

    if (acceptButton) {
      acceptButton.addEventListener("click", () => {
        applyConsent(true);
      });
    }

    if (rejectButton) {
      rejectButton.addEventListener("click", () => {
        applyConsent(false);
      });
    }

    if (settingsButton) {
      settingsButton.addEventListener("click", () => {
        openPreferences();
      });
    }

    if (saveButton) {
      saveButton.addEventListener("click", () => {
        applyConsent(
          Boolean(analyticsCheckbox?.checked)
        );
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closePreferences();
      });
    }

    if (preferences) {
      preferences.addEventListener("click", (event) => {
        // Close only when the backdrop itself is clicked.
        if (event.target === preferences) {
          closePreferences();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        preferences &&
        !preferences.hidden
      ) {
        closePreferences();
      }
    });

    // Expose a small, controlled interface for a visible
    // "Cookie settings" or "Change cookie preferences" link.
    window.ChariotCookies = Object.freeze({
      openSettings: openPreferences,

      withdrawConsent() {
        safeStorage.remove(CONFIG.consentKey);
        disableAnalytics();
        showBanner();
        closePreferences();
      },

      getConsent() {
        return readConsent();
      }
    });
  }

  /* -------------------------------------------------------
     8. Footer year
     ------------------------------------------------------- */

  function initFooterYear() {
    $$("[data-current-year], #current-year").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  }

  /* -------------------------------------------------------
     9. External links
     ------------------------------------------------------- */

  function initExternalLinks() {
    $$('a[target="_blank"]').forEach((link) => {
      const rel = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute("rel", [...rel].join(" "));
    });
  }

  /* -------------------------------------------------------
     10. Initialise
     ------------------------------------------------------- */

  function init() {
    initNavigation();
    initDropdowns();
    initCookieConsent();
    initFooterYear();
    initExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
