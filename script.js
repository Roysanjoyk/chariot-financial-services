/* =========================================================
   CHARIOT FINANCIAL SERVICES
   Main JavaScript
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const GA4_MEASUREMENT_ID = "G-6GVKWZF6YZ";
  const CONSENT_STORAGE_KEY = "chariot_analytics_consent";


  /* =======================================================
     DOM READY
     ======================================================= */

  document.addEventListener("DOMContentLoaded", function () {

    initialiseCurrentYear();
    initialiseSmoothScrolling();
    initialiseContactForm();
    initialiseAnalyticsConsent();
    initialiseAnalyticsEvents();

  });


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  function initialiseCurrentYear() {

    const yearElements = document.querySelectorAll("[data-current-year]");

    yearElements.forEach(function (element) {
      element.textContent = new Date().getFullYear();
    });

  }


  /* =======================================================
     SMOOTH SCROLLING
     ======================================================= */

  function initialiseSmoothScrolling() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {

      link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });

  }


  /* =======================================================
     CONTACT FORM
     ======================================================= */

  function initialiseContactForm() {

    const form = document.querySelector("#contact-form");

    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {

      event.preventDefault();

      const name = getFieldValue(form, "name");
      const email = getFieldValue(form, "email");
      const phone = getFieldValue(form, "phone");
      const service = getFieldValue(form, "service");
      const message = getFieldValue(form, "message");

      const consent = form.querySelector(
        'input[name="consent"], input[type="checkbox"]'
      );

      if (consent && !consent.checked) {
        alert("Please confirm that you consent to Chariot Financial Services using your details to respond to your enquiry.");
        return;
      }

      if (!name || !email || !message) {
        alert("Please complete your name, email address and message.");
        return;
      }

      /*
       * Track the enquiry in GA4 only if analytics consent
       * has been granted.
       */

      if (hasAnalyticsConsent() && typeof window.gtag === "function") {

        window.gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: "Contact form",
          lead_source: "website"
        });

      }

      /*
       * Prepare the email.
       *
       * This does not store the enquiry on the website.
       * It opens the visitor's email application.
       */

      const recipient = "info@chariotfinancialservices.com";

      const subject = encodeURIComponent(
        "Website enquiry - " + (service || "General enquiry")
      );

      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + (phone || "Not provided") + "\n" +
        "Service: " + (service || "Not specified") + "\n\n" +
        "Message:\n" +
        message
      );

      window.location.href =
        "mailto:" +
        recipient +
        "?subject=" +
        subject +
        "&body=" +
        body;

    });

  }


  function getFieldValue(form, name) {

    const field = form.querySelector('[name="' + name + '"]');

    if (!field) {
      return "";
    }

    return field.value.trim();

  }


  /* =======================================================
     ANALYTICS CONSENT
     ======================================================= */

  function initialiseAnalyticsConsent() {

    const banner = findConsentBanner();

    /*
     * If the banner isn't present in the HTML, do not
     * prevent the rest of the website from functioning.
     */

    const savedConsent = getSavedConsent();

    if (savedConsent === "accepted") {

      hideConsentBanner();

      updateGoogleConsent("granted");

      loadGoogleAnalytics();

      return;
    }

    if (savedConsent === "declined") {

      hideConsentBanner();

      updateGoogleConsent("denied");

      return;
    }

    /*
     * No consent has been recorded.
     *
     * Show the banner.
     */

    showConsentBanner();

    updateGoogleConsent("denied");

    if (!banner) {
      console.warn(
        "Chariot Analytics: consent banner was not found in the page."
      );
      return;
    }

    const acceptButton = findAcceptButton(banner);
    const declineButton = findDeclineButton(banner);

    if (acceptButton) {

      acceptButton.addEventListener("click", function () {

        saveConsent("accepted");

        hideConsentBanner();

        updateGoogleConsent("granted");

        loadGoogleAnalytics();

      });

    } else {

      console.warn(
        "Chariot Analytics: Accept analytics button was not found."
      );

    }


    if (declineButton) {

      declineButton.addEventListener("click", function () {

        saveConsent("declined");

        hideConsentBanner();

        updateGoogleConsent("denied");

      });

    } else {

      console.warn(
        "Chariot Analytics: Decline analytics button was not found."
      );

    }

  }


  /* =======================================================
     FIND CONSENT BANNER
     ======================================================= */

  function findConsentBanner() {

    return (
      document.querySelector(".cookie-banner") ||
      document.querySelector("#cookie-banner") ||
      document.querySelector("#cookie-consent") ||
      document.querySelector("[data-cookie-banner]")
    );

  }


  /* =======================================================
     FIND ACCEPT BUTTON
     ======================================================= */

  function findAcceptButton(banner) {

    if (!banner) {
      return null;
    }

    return (
      banner.querySelector(".cookie-banner-accept") ||
      banner.querySelector("[data-consent-accept]") ||
      banner.querySelector('[data-action="accept"]') ||
      findButtonContainingText(banner, "Accept analytics")
    );

  }


  /* =======================================================
     FIND DECLINE BUTTON
     ======================================================= */

  function findDeclineButton(banner) {

    if (!banner) {
      return null;
    }

    return (
      banner.querySelector(".cookie-banner-decline") ||
      banner.querySelector("[data-consent-decline]") ||
      banner.querySelector('[data-action="decline"]') ||
      findButtonContainingText(banner, "Decline")
    );

  }


  /* =======================================================
     FIND BUTTON BY TEXT
     ======================================================= */

  function findButtonContainingText(container, text) {

    const buttons = container.querySelectorAll("button");

    for (const button of buttons) {

      if (
        button.textContent &&
        button.textContent
          .trim()
          .toLowerCase()
          .includes(text.toLowerCase())
      ) {
        return button;
      }

    }

    return null;

  }


  /* =======================================================
     SHOW CONSENT BANNER
     ======================================================= */

  function showConsentBanner() {

    const banner = findConsentBanner();

    if (!banner) {
      return;
    }

    banner.hidden = false;

    banner.removeAttribute("hidden");

    banner.style.display = "flex";
    banner.style.visibility = "visible";
    banner.style.opacity = "1";

  }


  /* =======================================================
     HIDE CONSENT BANNER
     ======================================================= */

  function hideConsentBanner() {

    const banner = findConsentBanner();

    if (!banner) {
      return;
    }

    banner.hidden = true;

    banner.setAttribute("hidden", "");

    banner.style.display = "none";

  }


  /* =======================================================
     CONSENT STORAGE
     ======================================================= */

  function getSavedConsent() {

    try {

      return localStorage.getItem(CONSENT_STORAGE_KEY);

    } catch (error) {

      console.warn(
        "Chariot Analytics: localStorage is unavailable.",
        error
      );

      return null;

    }

  }


  function saveConsent(value) {

    try {

      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        value
      );

    } catch (error) {

      console.warn(
        "Chariot Analytics: unable to save consent.",
        error
      );

    }

  }


  function hasAnalyticsConsent() {

    return getSavedConsent() === "accepted";

  }


  /* =======================================================
     GOOGLE CONSENT MODE
     ======================================================= */

  function updateGoogleConsent(status) {

    if (typeof window.gtag !== "function") {
      /*
       * Create a temporary queue so consent commands can
       * be processed once gtag loads.
       */

      window.dataLayer = window.dataLayer || [];

      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

    }

    window.gtag("consent", "update", {

      analytics_storage: status,
      ad_storage: status === "granted" ? "denied" : "denied",
      ad_user_data: status === "granted" ? "denied" : "denied",
      ad_personalization: status === "granted" ? "denied" : "denied"

    });

  }


  /* =======================================================
     LOAD GOOGLE ANALYTICS
     ======================================================= */

  function loadGoogleAnalytics() {

    /*
     * Prevent duplicate installation.
     */

    if (
      document.querySelector(
        'script[src*="googletagmanager.com/gtag/js?id=' +
        GA4_MEASUREMENT_ID +
        '"]'
      )
    ) {
      return;
    }


    /*
     * Google dataLayer.
     */

    window.dataLayer = window.dataLayer || [];


    /*
     * gtag function.
     */

    window.gtag = window.gtag || function () {

      window.dataLayer.push(arguments);

    };


    /*
     * Google Analytics timestamp.
     */

    window.gtag(
      "js",
      new Date()
    );


    /*
     * Configure GA4.
     */

    window.gtag(
      "config",
      GA4_MEASUREMENT_ID,
      {
        anonymize_ip: true,
        send_page_view: true
      }
    );


    /*
     * Load Google's gtag.js.
     */

    const script = document.createElement("script");

    script.async = true;

    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA4_MEASUREMENT_ID);

    script.onload = function () {

      console.log(
        "Chariot Analytics: Google Analytics 4 loaded successfully."
      );

    };

    script.onerror = function () {

      console.error(
        "Chariot Analytics: Google Analytics 4 failed to load."
      );

    };

    document.head.appendChild(script);

  }


  /* =======================================================
     ANALYTICS EVENTS
     ======================================================= */

  function initialiseAnalyticsEvents() {

    /*
     * Event delegation means this works with buttons and
     * links already on the page without requiring individual
     * IDs for every CTA.
     */

    document.addEventListener("click", function (event) {

      if (!hasAnalyticsConsent()) {
        return;
      }

      if (typeof window.gtag !== "function") {
        return;
      }

      const link = event.target.closest("a");

      if (!link) {
        return;
      }


      const href = link.getAttribute("href") || "";

      const text =
        link.textContent
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase();


      /* ---------------------------------------------------
         PHONE CLICKS
         --------------------------------------------------- */

      if (href.toLowerCase().startsWith("tel:")) {

        window.gtag(
          "event",
          "phone_click",
          {
            event_category: "lead",
            event_label: "Phone",
            link_url: href
          }
        );

        return;
      }


      /* ---------------------------------------------------
         EMAIL CLICKS
         --------------------------------------------------- */

      if (href.toLowerCase().startsWith("mailto:")) {

        window.gtag(
          "event",
          "email_click",
          {
            event_category: "lead",
            event_label: "Email",
            link_url: href
          }
        );

        return;
      }


      /* ---------------------------------------------------
         CONSULTATION CTA
         --------------------------------------------------- */

      if (
        text.includes("book a consultation") ||
        text.includes("book consultation") ||
        text.includes("consultation")
      ) {

        window.gtag(
          "event",
          "book_consultation",
          {
            event_category: "lead",
            event_label: "Book a Consultation",
            link_url: href
          }
        );

      }

    });

  }


  /* =======================================================
     EXPOSE TEST FUNCTION
     ======================================================= */

  /*
   * This makes troubleshooting easier from the browser
   * console without exposing any sensitive information.
   *
   * Example:
   *
   *   chariotAnalyticsStatus()
   *
   */

  window.chariotAnalyticsStatus = function () {

    return {

      measurementId: GA4_MEASUREMENT_ID,

      consent:
        getSavedConsent(),

      bannerFound:
        !!findConsentBanner(),

      gtagLoaded:
        typeof window.gtag === "function",

      dataLayerFound:
        Array.isArray(window.dataLayer),

      googleScriptLoaded:
        !!document.querySelector(
          'script[src*="googletagmanager.com/gtag/js"]'
        )

    };

  };


})();
