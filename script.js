/* =========================================================
   CHARIOT FINANCIAL SERVICES — script.js
   Website interactions + GA4 consent-based analytics
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const GA4_MEASUREMENT_ID = "G-6GVKWZF6YZ";

const CONSENT_STORAGE_KEY = "chariot_analytics_consent";

const CONTACT_EMAIL = "info@chariotfinancialservices.com";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  setCurrentYear();

  initSmoothScrolling();

  initMobileNavigation();

  initContactForm();

  initAnalyticsConsent();

  initAnalyticsEvents();

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function setCurrentYear() {

  const yearElement = document.getElementById("current-year");

  if (!yearElement) {
    return;
  }

  yearElement.textContent = new Date().getFullYear();

}


/* =========================================================
   SMOOTH SCROLLING
   ========================================================= */

function initSmoothScrolling() {

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  anchorLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId) {
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

      /*
       * Close the mobile navigation after selecting
       * a navigation item.
       */
      closeMobileNavigation();

    });

  });

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

  const toggle = document.querySelector(".nav-toggle");

  const navigation = document.querySelector(".site-nav");

  if (!toggle || !navigation) {
    return;
  }


  toggle.addEventListener("click", () => {

    const isOpen =
      navigation.classList.contains("is-open");

    if (isOpen) {

      closeMobileNavigation();

    } else {

      openMobileNavigation();

    }

  });


  /*
   * Close navigation when clicking a navigation link.
   */
  navigation
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener("click", () => {

        closeMobileNavigation();

      });

    });


  /*
   * Close navigation when clicking outside it.
   */
  document.addEventListener("click", (event) => {

    if (!navigation.classList.contains("is-open")) {
      return;
    }

    const clickedInsideNavigation =
      navigation.contains(event.target);

    const clickedToggle =
      toggle.contains(event.target);

    if (!clickedInsideNavigation && !clickedToggle) {

      closeMobileNavigation();

    }

  });


  /*
   * Close navigation with Escape.
   */
  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
      return;
    }

    closeMobileNavigation();

  });


  /*
   * Reset mobile navigation when returning to desktop.
   */
  window.addEventListener("resize", () => {

    if (window.innerWidth > 850) {

      closeMobileNavigation();

    }

  });

}


function openMobileNavigation() {

  const toggle = document.querySelector(".nav-toggle");

  const navigation = document.querySelector(".site-nav");

  if (!toggle || !navigation) {
    return;
  }

  navigation.classList.add("is-open");

  toggle.setAttribute("aria-expanded", "true");

  toggle.setAttribute(
    "aria-label",
    "Close navigation"
  );

  toggle.innerHTML = '<span aria-hidden="true">×</span>';

}


function closeMobileNavigation() {

  const toggle = document.querySelector(".nav-toggle");

  const navigation = document.querySelector(".site-nav");

  if (!toggle || !navigation) {
    return;
  }

  navigation.classList.remove("is-open");

  toggle.setAttribute("aria-expanded", "false");

  toggle.setAttribute(
    "aria-label",
    "Open navigation"
  );

  toggle.innerHTML = '<span aria-hidden="true">☰</span>';

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function initContactForm() {

  const form = document.getElementById("contact-form");

  if (!form) {
    return;
  }


  form.addEventListener("submit", (event) => {

    event.preventDefault();


    const name =
      document.getElementById("name")?.value.trim() || "";

    const email =
      document.getElementById("email")?.value.trim() || "";

    const phone =
      document.getElementById("phone")?.value.trim() || "";

    const message =
      document.getElementById("message")?.value.trim() || "";

    const consent =
      document.getElementById("contact-consent");


    /*
     * Basic validation.
     */

    if (!name) {

      alert("Please enter your name.");

      document.getElementById("name")?.focus();

      return;

    }


    if (!email || !isValidEmail(email)) {

      alert("Please enter a valid email address.");

      document.getElementById("email")?.focus();

      return;

    }


    if (!message) {

      alert("Please tell us how we can help.");

      document.getElementById("message")?.focus();

      return;

    }


    if (consent && !consent.checked) {

      alert(
        "Please confirm that you consent to us using the information provided to respond to your enquiry."
      );

      consent.focus();

      return;

    }


    /*
     * Track lead generation where analytics consent
     * has been granted.
     */

    if (
      hasAnalyticsConsent() &&
      typeof window.gtag === "function"
    ) {

      window.gtag(
        "event",
        "generate_lead",
        {
          event_category: "contact",
          event_label: "contact_form",
          value: 1
        }
      );

    }


    /*
     * Construct the email.
     */

    const subject =
      `Website enquiry from ${name}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      "",
      "Enquiry:",
      message
    ].join("\n");


    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;


    /*
     * Open the visitor's default email application.
     */

    window.location.href = mailto;

  });

}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   ANALYTICS CONSENT
   ========================================================= */

function initAnalyticsConsent() {

  const banner =
    document.querySelector(
      ".cookie-banner, #cookie-banner, #cookie-consent, [data-cookie-banner]"
    );


  const savedConsent =
    getAnalyticsConsent();


  /*
   * Always establish Google's default consent state
   * before loading analytics.
   */

  updateGoogleConsent(
    savedConsent === "accepted"
      ? "granted"
      : "denied"
  );


  /*
   * Returning visitor who previously accepted.
   */

  if (savedConsent === "accepted") {

    hideConsentBanner();

    loadGoogleAnalytics();

    return;

  }


  /*
   * Returning visitor who previously declined.
   */

  if (savedConsent === "declined") {

    hideConsentBanner();

    return;

  }


  /*
   * New visitor.
   */

  if (!banner) {
    return;
  }


  showConsentBanner();


  /*
   * Accept analytics.
   */

  const acceptButton =
    banner.querySelector(
      ".cookie-banner-accept, [data-consent-accept], [data-action='accept']"
    );


  /*
   * Decline analytics.
   */

  const declineButton =
    banner.querySelector(
      "[data-consent-decline], [data-action='decline']"
    );


  if (acceptButton) {

    acceptButton.addEventListener(
      "click",
      acceptAnalytics
    );

  }


  if (declineButton) {

    declineButton.addEventListener(
      "click",
      declineAnalytics
    );

  }

}


function acceptAnalytics() {

  saveAnalyticsConsent("accepted");

  updateGoogleConsent("granted");

  hideConsentBanner();

  loadGoogleAnalytics();

}


function declineAnalytics() {

  saveAnalyticsConsent("declined");

  updateGoogleConsent("denied");

  hideConsentBanner();

}


/* =========================================================
   COOKIE BANNER
   ========================================================= */

function showConsentBanner() {

  const banner =
    document.querySelector(
      ".cookie-banner, #cookie-banner, #cookie-consent, [data-cookie-banner]"
    );

  if (!banner) {
    return;
  }

  banner.hidden = false;

  banner.removeAttribute("hidden");

  banner.style.display = "block";

  banner.style.visibility = "visible";

  banner.style.opacity = "1";

}


function hideConsentBanner() {

  const banner =
    document.querySelector(
      ".cookie-banner, #cookie-banner, #cookie-consent, [data-cookie-banner]"
    );

  if (!banner) {
    return;
  }

  banner.hidden = true;

  banner.setAttribute("hidden", "");

  banner.style.display = "none";

}


/* =========================================================
   LOCAL STORAGE — CONSENT
   ========================================================= */

function getAnalyticsConsent() {

  try {

    return localStorage.getItem(
      CONSENT_STORAGE_KEY
    );

  } catch (error) {

    console.warn(
      "Chariot Analytics: Unable to read consent storage.",
      error
    );

    return null;

  }

}


function saveAnalyticsConsent(value) {

  try {

    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      value
    );

  } catch (error) {

    console.warn(
      "Chariot Analytics: Unable to save consent.",
      error
    );

  }

}


/* =========================================================
   GOOGLE CONSENT MODE
   ========================================================= */

function updateGoogleConsent(status) {

  /*
   * Create the dataLayer if it does not already exist.
   */

  window.dataLayer =
    window.dataLayer || [];


  /*
   * Define a temporary gtag function if necessary.
   */

  window.gtag =
    window.gtag ||
    function () {

      window.dataLayer.push(
        arguments
      );

    };


  /*
   * Default/updated consent state.
   */

  window.gtag(
    "consent",
    "update",
    {
      analytics_storage: status,

      /*
       * Advertising-related storage remains denied.
       * Chariot does not use advertising cookies through
       * this implementation.
       */

      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    }
  );

}


/* =========================================================
   LOAD GOOGLE ANALYTICS
   ========================================================= */

function loadGoogleAnalytics() {

  /*
   * Prevent duplicate loading.
   */

  if (
    document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
    )
  ) {

    return;

  }


  /*
   * Establish dataLayer.
   */

  window.dataLayer =
    window.dataLayer || [];


  /*
   * Establish gtag.
   */

  window.gtag =
    window.gtag ||
    function () {

      window.dataLayer.push(
        arguments
      );

    };


  /*
   * Google Analytics configuration.
   */

  window.gtag(
    "js",
    new Date()
  );


  window.gtag(
    "config",
    GA4_MEASUREMENT_ID,
    {
      anonymize_ip: true,
      send_page_view: true
    }
  );


  /*
   * Load Google's gtag library.
   */

  const script =
    document.createElement("script");


  script.async = true;


  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;


  script.onload = () => {

    console.info(
      "Chariot Analytics: Google Analytics 4 loaded successfully."
    );

  };


  script.onerror = () => {

    console.warn(
      "Chariot Analytics: Google Analytics 4 could not be loaded."
    );

  };


  document.head.appendChild(script);

}


/* =========================================================
   ANALYTICS EVENT TRACKING
   ========================================================= */

function initAnalyticsEvents() {

  /*
   * Event elements use:
   *
   * data-event="phone_click"
   * data-event="email_click"
   * data-event="book_consultation"
   */

  const trackedElements =
    document.querySelectorAll(
      "[data-event]"
    );


  trackedElements.forEach((element) => {

    element.addEventListener(
      "click",
      () => {

        const eventName =
          element.getAttribute("data-event");


        if (
          !eventName ||
          !hasAnalyticsConsent() ||
          typeof window.gtag !== "function"
        ) {

          return;

        }


        window.gtag(
          "event",
          eventName,
          {
            event_category: "engagement",
            event_label:
              element.textContent.trim()
          }
        );

      }
    );

  });

}


/* =========================================================
   ANALYTICS CONSENT CHECK
   ========================================================= */

function hasAnalyticsConsent() {

  return (
    getAnalyticsConsent() === "accepted"
  );

}


/* =========================================================
   ANALYTICS DIAGNOSTIC
   =========================================================

   In the browser console run:

       chariotAnalyticsStatus()

   It will report the current GA4 setup and consent state.
   ========================================================= */

window.chariotAnalyticsStatus = function () {

  const banner =
    document.querySelector(
      ".cookie-banner, #cookie-banner, #cookie-consent, [data-cookie-banner]"
    );


  const googleScript =
    document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
    );


  const status = {

    measurementId:
      GA4_MEASUREMENT_ID,

    consent:
      getAnalyticsConsent(),

    bannerFound:
      Boolean(banner),

    bannerHidden:
      banner
        ? banner.hidden
        : null,

    gtagLoaded:
      typeof window.gtag === "function",

    dataLayerFound:
      Array.isArray(window.dataLayer),

    googleScriptLoaded:
      Boolean(googleScript)

  };


  console.table(status);

  return status;

};


/* =========================================================
   END
   ========================================================= */
