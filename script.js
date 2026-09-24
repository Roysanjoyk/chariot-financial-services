document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       MOBILE NAVIGATION
       ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const isOpen = mainNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        /* Close menu after clicking a navigation link */

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", function (event) {

            if (
                mainNav.classList.contains("active") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                mainNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });


        /* Close menu when pressing Escape */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                mainNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.focus();

            }

        });

    }


    /* =========================================================
       CONTACT FORM
       ========================================================= */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name")?.value.trim() || "";

            const email =
                document.getElementById("email")?.value.trim() || "";

            const phone =
                document.getElementById("phone")?.value.trim() || "";

            const service =
                document.getElementById("service")?.value.trim() || "";

            const message =
                document.getElementById("message")?.value.trim() || "";


            /* Basic validation */

            if (!name || !email || !message) {

                alert(
                    "Please complete your name, email address and enquiry before submitting."
                );

                return;

            }


            /* Basic email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            /* Create email subject */

            const subjectText =
                "Chariot Financial Services enquiry" +
                (service ? " - " + service : "");


            /* Create email body */

            const bodyText =
                "Name: " + name + "\n" +
                "Email: " + email + "\n" +
                "Telephone: " +
                (phone || "Not provided") +
                "\n" +
                "Service: " +
                (service || "Not selected") +
                "\n\n" +
                "Enquiry:\n" +
                message;


            const subject =
                encodeURIComponent(subjectText);

            const body =
                encodeURIComponent(bodyText);


            /* Open visitor's email application */

            window.location.href =
                "mailto:info@chariotfinancialservices.com" +
                "?subject=" +
                subject +
                "&body=" +
                body;

        });

    }


    /* =========================================================
       CURRENT YEAR
       ========================================================= */

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });


    /* =========================================================
       SMOOTH SCROLLING
       ========================================================= */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });

});
