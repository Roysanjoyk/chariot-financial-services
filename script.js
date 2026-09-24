/* =========================================================
   CHARIOT FINANCIAL SERVICES
   Website JavaScript
   ========================================================= */


/* =========================================================
   1. MOBILE NAVIGATION
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


    /*
     * Close the mobile menu when a navigation link
     * is clicked.
     */

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

}


/* =========================================================
   2. CURRENT YEAR
   ========================================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =========================================================
   3. CONTACT FORM
   ========================================================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        /*
         * The form is not connected to an email service yet.
         * Prevent the browser from attempting to submit it.
         */

        event.preventDefault();


        /*
         * Temporary message.
         *
         * We will replace this with the real form
         * submission process once the website is live.
         */

        const existingMessage =
            contactForm.querySelector(".form-success");

        if (existingMessage) {
            existingMessage.remove();
        }


        const successMessage =
            document.createElement("div");

        successMessage.className = "form-success";

        successMessage.textContent =
            "Thank you. Your enquiry has been received.";


        successMessage.style.marginTop = "18px";
        successMessage.style.padding = "14px 16px";
        successMessage.style.background = "#eef4f0";
        successMessage.style.border = "1px solid #c9dbd0";
        successMessage.style.color = "#315f4c";
        successMessage.style.fontSize = "0.85rem";


        contactForm.appendChild(successMessage);


        /*
         * Reset the form after submission.
         */

        contactForm.reset();

    });

}


/* =========================================================
   4. HEADER SHADOW ON SCROLL
   ========================================================= */

const siteHeader =
    document.querySelector(".site-header");

if (siteHeader) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 20) {

            siteHeader.style.boxShadow =
                "0 8px 25px rgba(16, 29, 47, 0.08)";

        } else {

            siteHeader.style.boxShadow = "none";

        }

    });

}


/* =========================================================
   5. SIMPLE REVEAL ANIMATION
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".service-card, .client-item, .insight-card, .why-item"
);


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(18px)";

        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        observer.observe(element);

    });

}


/* =========================================================
   6. CONSOLE MESSAGE
   ========================================================= */

console.log(
    "Chariot Financial Services website loaded successfully."
);
