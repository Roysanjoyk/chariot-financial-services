"use strict";

/* =========================================================
   CHARIOT FINANCIAL SERVICES
   script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     01. ELEMENTS
  ======================================================= */

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const dropdownItems = document.querySelectorAll(".has-dropdown");
  const navLinks = document.querySelectorAll(".site-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.querySelector(".form-status");
  const currentYear = document.getElementById("current-year");


  /* =======================================================
     02. CURRENT YEAR
  ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     03. STICKY HEADER
  ======================================================= */

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* =======================================================
     04. MOBILE NAVIGATION
  ======================================================= */

  const closeMobileMenu = () => {
    if (!menuToggle || !siteNav) return;

    body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  const openMobileMenu = () => {
    if (!menuToggle || !siteNav) return;

    body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {

      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }

    });
  }


  /* =======================================================
     05. DROPDOWN NAVIGATION
  ======================================================= */

  const closeDropdown = (item) => {
    if (!item) return;

    const button = item.querySelector(".dropdown-toggle");
    const menu = item.querySelector(".dropdown-menu");

    item.classList.remove("is-open");

    if (button) {
      button.setAttribute("aria-expanded", "false");
    }

    if (menu) {
      menu.hidden = true;
    }
  };

  const openDropdown = (item) => {
    if (!item) return;

    const button = item.querySelector(".dropdown-toggle");
    const menu = item.querySelector(".dropdown-menu");

    item.classList.add("is-open");

    if (button) {
      button.setAttribute("aria-expanded", "true");
    }

    if (menu) {
      menu.hidden = false;
    }
  };

  dropdownItems.forEach((item) => {

    const button = item.querySelector(".dropdown-toggle");

    if (!button) return;

    button.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      const isOpen = item.classList.contains("is-open");

      dropdownItems.forEach((otherItem) => {
        if (otherItem !== item) {
          closeDropdown(otherItem);
        }
      });

      if (isOpen) {
        closeDropdown(item);
      } else {
        openDropdown(item);
      }

    });
  });


  /* =======================================================
     06. CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ======================================================= */

  document.addEventListener("click", (event) => {

    dropdownItems.forEach((item) => {

      if (!item.contains(event.target)) {
        closeDropdown(item);
      }

    });

  });


  /* =======================================================
     07. NAVIGATION LINKS
  ======================================================= */

  navLinks.forEach((link) => {

    link.addEventListener("click", () => {

      dropdownItems.forEach(closeDropdown);

      if (window.innerWidth <= 900) {
        closeMobileMenu();
      }

    });

  });


  /* =======================================================
     08. ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    dropdownItems.forEach(closeDropdown);

    closeMobileMenu();

  });


  /* =======================================================
     09. CLOSE MOBILE NAV ON RESIZE
  ======================================================= */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {
      closeMobileMenu();
    }

  });


  /* =======================================================
     10. SCROLL REVEAL
  ======================================================= */

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

  }


  /* =======================================================
     11. BACK TO TOP
  ======================================================= */

  const updateBackToTop = () => {

    if (!backToTop) return;

    if (window.scrollY > 800) {
      backToTop.hidden = false;
    } else {
      backToTop.hidden = true;
    }

  };

  updateBackToTop();

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  if (backToTop) {

    backToTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  /* =======================================================
     12. SMOOTH INTERNAL NAVIGATION
  ======================================================= */

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "smooth"
      });

      if (window.innerWidth <= 900) {
        closeMobileMenu();
      }

    });

  });


  /* =======================================================
     13. ACTIVE SECTION NAVIGATION
  ======================================================= */

  const sectionLinks = Array.from(
    document.querySelectorAll(
      '.site-nav a[href^="#"]'
    )
  );

  const sections = sectionLinks
    .map((link) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") {
        return null;
      }

      return document.querySelector(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          sectionLinks.forEach((link) => {
            link.classList.remove("is-active");
          });

          const activeLink = sectionLinks.find(
            (link) =>
              link.getAttribute("href") ===
              `#${entry.target.id}`
          );

          if (activeLink) {
            activeLink.classList.add("is-active");
          }

        });

      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* =======================================================
     14. CONTACT FORM
  ======================================================= */

  if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

      /*
       * The form currently has no connected backend.
       * Prevent a false submission and provide a clear
       * next step instead.
       */

      event.preventDefault();

      if (!formStatus) return;

      formStatus.textContent =
        "The contact form is not connected yet. Please call 07497 528077 or email info@chariotfinancialservices.com.";

      formStatus.classList.add("is-visible");

    });

  }


  /* =======================================================
     15. TELEPHONE / EMAIL TRACKING
  ======================================================= */

  const trackContactClick = (event) => {

    const link = event.currentTarget;

    if (typeof window.gtag !== "function") {
      return;
    }

    const href = link.getAttribute("href") || "";

    if (href.startsWith("tel:")) {

      window.gtag("event", "phone_click", {
        event_category: "contact",
        event_label: "Phone"
      });

    }

    if (href.startsWith("mailto:")) {

      window.gtag("event", "email_click", {
        event_category: "contact",
        event_label: "Email"
      });

    }

  };

  document
    .querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')
    .forEach((link) => {
      link.addEventListener("click", trackContactClick);
    });


  /* =======================================================
     16. JOURNAL / CTA TRACKING
  ======================================================= */

  const trackJournalClick = (event) => {

    if (typeof window.gtag !== "function") {
      return;
    }

    const link = event.currentTarget;

    window.gtag("event", "journal_click", {
      event_category: "engagement",
      event_label: link.textContent.trim()
    });

  };

  document
    .querySelectorAll('a[href^="/insights/"]')
    .forEach((link) => {
      link.addEventListener("click", trackJournalClick);
    });


  /* =======================================================
     17. FORM FIELD UX
  ======================================================= */

  const formInputs = document.querySelectorAll(
    ".contact-form input, .contact-form select, .contact-form textarea"
  );

  formInputs.forEach((field) => {

    field.addEventListener("input", () => {

      if (formStatus) {
        formStatus.classList.remove("is-visible");
      }

    });

  });


  /* =======================================================
     18. PREVENT STICKY ELEMENTS FROM HIDING ANCHORS
  ======================================================= */

  const adjustAnchorPosition = () => {

    const hash = window.location.hash;

    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);

    if (!target) return;

    window.setTimeout(() => {

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "auto"
      });

    }, 50);

  };

  adjustAnchorPosition();


  /* =======================================================
     19. IMAGE ERROR HANDLING
  ======================================================= */

  document.querySelectorAll("img").forEach((image) => {

    image.addEventListener("error", () => {

      image.classList.add("image-error");

      /*
       * Keep layout stable if an optional image fails.
       * The logo itself should still be fixed at source level.
       */

    });

  });


  /* =======================================================
     20. PAGE READY
  ======================================================= */

  document.documentElement.classList.add("js-ready");

});
