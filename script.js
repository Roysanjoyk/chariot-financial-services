/* =========================================================
   CHARIOT FINANCIAL SERVICES
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const body = document.body;
    const siteHeader = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    const dropdownItems = document.querySelectorAll(".has-dropdown");
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const navLinks = document.querySelectorAll(".nav-link");
    const revealElements = document.querySelectorAll(".reveal");
    const backToTop = document.querySelector(".back-to-top");
    const currentYearElements = document.querySelectorAll(".current-year");


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const currentYear = new Date().getFullYear();

    currentYearElements.forEach((element) => {
        element.textContent = currentYear;
    });


    /* =====================================================
       STICKY HEADER
    ====================================================== */

    const updateHeader = () => {
        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 20) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const closeMobileMenu = () => {
        if (!menuToggle || !siteNav) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        siteNav.classList.remove("is-open");
        body.classList.remove("menu-open");

        closeAllDropdowns();
    };


    const openMobileMenu = () => {
        if (!menuToggle || !siteNav) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");
        siteNav.classList.add("is-open");
        body.classList.add("menu-open");
    };


    if (menuToggle && siteNav) {
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


    /* =====================================================
       DROPDOWN NAVIGATION
    ====================================================== */

    const closeDropdown = (dropdownItem) => {
        const toggle = dropdownItem.querySelector(".dropdown-toggle");
        const menu = dropdownItem.querySelector(".dropdown-menu");

        if (!toggle || !menu) {
            return;
        }

        dropdownItem.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
    };


    const openDropdown = (dropdownItem) => {
        const toggle = dropdownItem.querySelector(".dropdown-toggle");
        const menu = dropdownItem.querySelector(".dropdown-menu");

        if (!toggle || !menu) {
            return;
        }

        dropdownItems.forEach((item) => {
            if (item !== dropdownItem) {
                closeDropdown(item);
            }
        });

        dropdownItem.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        menu.hidden = false;
    };


    const closeAllDropdowns = () => {
        dropdownItems.forEach((item) => {
            closeDropdown(item);
        });
    };


    dropdownToggles.forEach((toggle) => {

        toggle.addEventListener("click", (event) => {
            event.preventDefault();

            const dropdownItem = toggle.closest(".has-dropdown");

            if (!dropdownItem) {
                return;
            }

            const isOpen =
                toggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeDropdown(dropdownItem);
            } else {
                openDropdown(dropdownItem);
            }
        });

    });


    /* =====================================================
       CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener("click", (event) => {

        const clickedInsideDropdown =
            event.target.closest(".has-dropdown");

        if (!clickedInsideDropdown) {
            closeAllDropdowns();
        }

    });


    /* =====================================================
       NAVIGATION LINKS
    ====================================================== */

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeAllDropdowns();

            if (
                window.innerWidth <= 900 &&
                siteNav &&
                siteNav.classList.contains("is-open")
            ) {
                closeMobileMenu();
            }

        });

    });


    /* =====================================================
       DROPDOWN LINKS
    ====================================================== */

    const dropdownLinks = document.querySelectorAll(
        ".dropdown-menu a"
    );

    dropdownLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeAllDropdowns();

            if (
                window.innerWidth <= 900 &&
                siteNav &&
                siteNav.classList.contains("is-open")
            ) {
                closeMobileMenu();
            }

        });

    });


    /* =====================================================
       CLOSE MOBILE MENU WHEN RESIZING TO DESKTOP
    ====================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            if (siteNav) {
                siteNav.classList.remove("is-open");
            }

            if (menuToggle) {
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );
            }

            body.classList.remove("menu-open");

            closeAllDropdowns();
        }

    });


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeAllDropdowns();

        if (
            menuToggle &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            closeMobileMenu();
            menuToggle.focus();
        }

    });


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
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


    /* =====================================================
       BACK TO TOP
    ====================================================== */

    const updateBackToTop = () => {

        if (!backToTop) {
            return;
        }

        if (window.scrollY > 700) {
            backToTop.classList.add("is-visible");
        } else {
            backToTop.classList.remove("is-visible");
        }

    };

    updateBackToTop();

    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
    ====================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerOffset =
                siteHeader
                    ? siteHeader.offsetHeight + 15
                    : 15;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            if (
                window.innerWidth <= 900 &&
                siteNav &&
                siteNav.classList.contains("is-open")
            ) {
                closeMobileMenu();
            }

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ====================================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const sectionNavLinks = document.querySelectorAll(
        '.site-nav a[href^="#"]'
    );


    if (
        "IntersectionObserver" in window &&
        sections.length > 0 &&
        sectionNavLinks.length > 0
    ) {

        const activeSections = new Map();

        const activeSectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        activeSections.set(
                            entry.target.id,
                            entry.isIntersecting
                        );

                    });

                    let activeId = null;

                    sections.forEach((section) => {

                        if (
                            activeSections.get(section.id)
                        ) {
                            activeId = section.id;
                        }

                    });

                    sectionNavLinks.forEach((link) => {

                        const href =
                            link.getAttribute("href");

                        if (
                            activeId &&
                            href === `#${activeId}`
                        ) {
                            link.classList.add("is-active");
                        } else {
                            link.classList.remove("is-active");
                        }

                    });

                },
                {
                    rootMargin:
                        "-25% 0px -60% 0px",
                    threshold: 0
                }
            );


        sections.forEach((section) => {
            activeSectionObserver.observe(section);
        });

    }


    /* =====================================================
       CONTACT LINKS
       ===================================================== */

    const telephoneLinks =
        document.querySelectorAll(
            'a[href^="tel:"]'
        );

    const emailLinks =
        document.querySelectorAll(
            'a[href^="mailto:"]'
        );


    telephoneLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (typeof window.gtag === "function") {

                window.gtag(
                    "event",
                    "phone_click",
                    {
                        event_category: "contact",
                        event_label: "Telephone"
                    }
                );

            }

        });

    });


    emailLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (typeof window.gtag === "function") {

                window.gtag(
                    "event",
                    "email_click",
                    {
                        event_category: "contact",
                        event_label: "Email"
                    }
                );

            }

        });

    });


    /* =====================================================
       CONTACT FORM SAFETY
       
       There is currently no contact form in index.html.
       This guard prevents accidental false submission
       behaviour if a form is added later without a backend.
    ====================================================== */

    const contactForm =
        document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            const action =
                contactForm.getAttribute("action");

            if (
                !action ||
                action === "#" ||
                action.trim() === ""
            ) {
                event.preventDefault();

                const existingMessage =
                    contactForm.querySelector(
                        ".form-message"
                    );

                if (existingMessage) {
                    existingMessage.textContent =
                        "Please contact Chariot Financial Services directly by telephone or email.";
                }

            }

        });

    }


    /* =====================================================
       INITIALISE DROPDOWNS
    ====================================================== */

    dropdownItems.forEach((item) => {
        closeDropdown(item);
    });


    /* =====================================================
       PAGE LOAD STATE
    ====================================================== */

    document.documentElement.classList.add("js-enabled");

});
