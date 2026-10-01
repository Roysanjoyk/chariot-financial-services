'use strict';

/* ============================================================
   CHARIOT FINANCIAL SERVICES — script.js
   Vanilla JavaScript. No dependencies. Progressive enhancement.
   ============================================================ */

(function () {

    /* ------------------------------------------------------------
       UTILITIES
       ------------------------------------------------------------ */

    const prefersReducedMotion = () =>
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    /* ------------------------------------------------------------
       1. MOBILE NAVIGATION
       ------------------------------------------------------------ */

    function initMobileNavigation() {
        const toggle = $('.menu-toggle') || $('.header__hamburger');
        const nav = $('.site-nav') || $('.header__nav');
        if (!toggle || !nav) return;

        const navLinks = $$('.nav-link, .header__nav a', nav);
        const body = document.body;

        const setOpen = (open) => {
            nav.classList.toggle('open', open);
            body.classList.toggle('nav-open', open);
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            body.style.overflow = open ? 'hidden' : '';
        };

        const isOpen = () => nav.classList.contains('open');

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            setOpen(!isOpen());
        });

        // Close on nav link click
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (isOpen()) setOpen(false);
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) {
                setOpen(false);
                toggle.focus();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!isOpen()) return;
            if (nav.contains(e.target) || toggle.contains(e.target)) return;
            setOpen(false);
        });

        // Reset on resize to desktop
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && isOpen()) {
                    setOpen(false);
                }
            }, 150);
        });
    }

    /* ------------------------------------------------------------
       2. DROPDOWN NAVIGATION
       ------------------------------------------------------------ */

    function initDropdowns() {
        const dropdownItems = $$('.has-dropdown');
        if (!dropdownItems.length) return;

        const closeAll = (except = null) => {
            dropdownItems.forEach((item) => {
                if (item === except) return;
                const toggle = $('.dropdown-toggle', item);
                const menu = $('.dropdown-menu', item);
                if (!toggle || !menu) return;
                item.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                menu.hidden = true;
            });
        };

        dropdownItems.forEach((item) => {
            const toggle = $('.dropdown-toggle', item);
            const menu = $('.dropdown-menu', item);
            if (!toggle || !menu) return;

            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-haspopup', 'true');

            // Ensure menu starts hidden
            if (!menu.hasAttribute('hidden')) {
                menu.hidden = true;
            }

            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const willOpen = !item.classList.contains('open');
                closeAll(item);
                item.classList.toggle('open', willOpen);
                toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                menu.hidden = !willOpen;
            });

            // Keyboard: allow arrow-down to enter menu
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!item.classList.contains('open')) {
                        toggle.click();
                    }
                    const firstLink = menu.querySelector('a, button');
                    if (firstLink) firstLink.focus();
                }
            });
        });

        // Escape closes dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const anyOpen = dropdownItems.some((i) => i.classList.contains('open'));
            if (anyOpen) {
                closeAll();
                const openToggle = dropdownItems
                    .map((i) => $('.dropdown-toggle', i))
                    .find((t) => t && t.getAttribute('aria-expanded') === 'true');
                if (openToggle) openToggle.focus();
            }
        });

        // Outside click closes dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.has-dropdown')) {
                closeAll();
            }
        });
    }

    /* ------------------------------------------------------------
       3. SMOOTH SCROLLING
       ------------------------------------------------------------ */

    function getHeaderOffset() {
        const header = $('.site-header') || $('.header');
        if (!header) return 0;
        const rect = header.getBoundingClientRect();
        // Only count it if it is actually sticky/fixed or taking space at the top
        return rect.height || 0;
    }

    function smoothScrollTo(targetY) {
        const headerOffset = getHeaderOffset();
        const top = Math.max(0, targetY - headerOffset - 8);

        if (prefersReducedMotion()) {
            window.scrollTo(0, top);
            return;
        }

        window.scrollTo({ top, behavior: 'smooth' });
    }

    function initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;

            // Only same-page anchors
            if (link.getAttribute('target') === '_blank') return;

            const id = href.slice(1);
            let target = null;
            try {
                target = document.getElementById(id);
            } catch (err) {
                target = null;
            }
            if (!target) return;

            e.preventDefault();

            const rect = target.getBoundingClientRect();
            const targetY = window.pageYOffset + rect.top;

            smoothScrollTo(targetY);

            // Update URL hash without jumping
            if (history.replaceState) {
                history.replaceState(null, '', '#' + id);
            }

            // Move focus for accessibility
            const focusTarget = target.matches('a, button, input, select, textarea, [tabindex]')
                ? target
                : target.querySelector('a, button, input, select, textarea, [tabindex]');
            if (focusTarget) {
                focusTarget.focus({ preventScroll: true });
            }
        });
    }

    /* ------------------------------------------------------------
       4. HEADER SCROLL BEHAVIOUR
       ------------------------------------------------------------ */

    function initHeaderScroll() {
        const header = $('.site-header') || $('.header');
        if (!header) return;

        const threshold = 20;
        let ticking = false;
        let lastState = null;

        const update = () => {
            const scrolled = window.pageYOffset > threshold;
            if (scrolled !== lastState) {
                header.classList.toggle('scrolled', scrolled);
                header.classList.toggle('header--scrolled', scrolled);
                lastState = scrolled;
            }
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();
    }

    /* ------------------------------------------------------------
       5. REVEAL ON SCROLL ANIMATIONS
       ------------------------------------------------------------ */

    function initRevealAnimations() {
        const selectors = '.reveal, .reveal-up, .reveal-left, .reveal-right, .fade-in';
        const elements = $$(selectors);
        if (!elements.length) return;

        // If reduced motion or no IntersectionObserver: just show everything.
        if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('is-visible', 'visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    el.classList.add('is-visible', 'visible');
                    observer.unobserve(el);
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.12,
            }
        );

        elements.forEach((el) => {
            // Skip if already visible (above the fold)
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                el.classList.add('is-visible', 'visible');
                return;
            }
            observer.observe(el);
        });
    }

    /* ------------------------------------------------------------
       6. ACTIVE NAVIGATION
       ------------------------------------------------------------ */

    function initActiveNavigation() {
        const navLinks = $$('.nav-link, .header__nav a[href^="#"]');
        if (!navLinks.length) return;
        if (!('IntersectionObserver' in window)) return;

        // Build map: id -> link(s)
        const linkMap = new Map();
        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#') || href.length < 2) return;
            const id = href.slice(1);
            if (!linkMap.has(id)) linkMap.set(id, []);
            linkMap.get(id).push(link);
        });

        if (!linkMap.size) return;

        const sections = Array.from(linkMap.keys())
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (!sections.length) return;

        const clearActive = () => {
            navLinks.forEach((l) => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
        };

        const setActive = (id) => {
            clearActive();
            const links = linkMap.get(id);
            if (!links) return;
            links.forEach((l) => {
                l.classList.add('active');
                l.setAttribute('aria-current', 'true');
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                // Pick the most visible intersecting section
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length) {
                    setActive(visible[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: '-45% 0px -45% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    /* ------------------------------------------------------------
       7. CONTACT FORM VALIDATION
       ------------------------------------------------------------ */

    function initContactForm() {
        const form = $('#contactForm') || $('.contact__form');
        if (!form) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const getErrorEl = (field) => {
            const id = field.id;
            if (!id) return null;
            return document.getElementById(id + '-error');
        };

        const showError = (field, message) => {
            field.setAttribute('aria-invalid', 'true');
            const err = getErrorEl(field);
            if (err) {
                err.textContent = message;
                err.hidden = false;
            }
        };

        const clearError = (field) => {
            field.removeAttribute('aria-invalid');
            const err = getErrorEl(field);
            if (err) {
                err.textContent = '';
                err.hidden = true;
            }
        };

        const validateField = (field) => {
            const name = (field.name || '').toLowerCase();
            const value = (field.value || '').trim();

            // Name
            if (name === 'name' || field.id === 'name') {
                if (!value) {
                    showError(field, 'Please enter your name.');
                    return false;
                }
                clearError(field);
                return true;
            }

            // Email
            if (name === 'email' || field.type === 'email' || field.id === 'email') {
                if (!value) {
                    showError(field, 'Please enter your email address.');
                    return false;
                }
                if (!emailRegex.test(value)) {
                    showError(field, 'Please enter a valid email address.');
                    return false;
                }
                clearError(field);
                return true;
            }

            // Message
            if (name === 'message' || field.id === 'message') {
                if (!value) {
                    showError(field, 'Please enter a message.');
                    return false;
                }
                clearError(field);
                return true;
            }

            return true;
        };

        // Clear on input
        form.addEventListener(
            'input',
            (e) => {
                const field = e.target;
                if (!field || !field.matches('input, textarea, select')) return;
                if (field.getAttribute('aria-invalid') === 'true') {
                    validateField(field);
                }
            },
            { passive: true }
        );

        form.addEventListener('submit', (e) => {
            const requiredFields = $$(
                'input[name="name"], input#name, input[name="email"], input[type="email"], input#email, textarea[name="message"], textarea#message',
                form
            );

            let firstInvalid = null;

            requiredFields.forEach((field) => {
                const valid = validateField(field);
                if (!valid && !firstInvalid) firstInvalid = field;
            });

            if (firstInvalid) {
                e.preventDefault();
                firstInvalid.focus();
                return;
            }

            // If the form has no real action, prevent default to avoid a page reload.
            const action = form.getAttribute('action') || '';
            if (!action || action === '#') {
                e.preventDefault();
                // Do not falsely claim success. Provide an accessible notice
                // that the form is not yet connected to a live endpoint.
                let notice = $('#contactFormNotice');
                if (!notice) {
                    notice = document.createElement('p');
                    notice.id = 'contactFormNotice';
                    notice.setAttribute('role', 'status');
                    notice.setAttribute('aria-live', 'polite');
                    notice.style.marginTop = '1rem';
                    notice.style.fontSize = '0.9rem';
                    notice.style.color = 'rgba(248, 246, 241, 0.75)';
                    form.appendChild(notice);
                }
                notice.textContent =
                    'Your message is ready to send, but this form is not yet connected to a live endpoint. Please call 07497 528077 or email info@chariotfinancialservices.com.';
            }
        });
    }

    /* ------------------------------------------------------------
       8. BACK TO TOP
       ------------------------------------------------------------ */

    function initBackToTop() {
        const btn = $('.back-to-top');
        if (!btn) return;

        const threshold = 500;
        let ticking = false;
        let visible = false;

        const update = () => {
            const show = window.pageYOffset > threshold;
            if (show !== visible) {
                btn.classList.toggle('is-visible', show);
                btn.classList.toggle('visible', show);
                visible = show;
            }
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo(0);
        });
    }

    /* ------------------------------------------------------------
       9. FOOTER YEAR
       ------------------------------------------------------------ */

    function initCurrentYear() {
        const els = $$('.current-year');
        if (!els.length) return;
        const year = String(new Date().getFullYear());
        els.forEach((el) => {
            el.textContent = year;
        });
    }

    /* ------------------------------------------------------------
       10. INIT
       ------------------------------------------------------------ */

    function init() {
        const safe = (fn) => {
            try {
                fn();
            } catch (err) {
                // Optional component failed — do not break the rest of the page.
                if (window.console && console.warn) {
                    console.warn('Chariot: optional init step failed:', err);
                }
            }
        };

        safe(initCurrentYear);
        safe(initMobileNavigation);
        safe(initDropdowns);
        safe(initSmoothScrolling);
        safe(initHeaderScroll);
        safe(initRevealAnimations);
        safe(initActiveNavigation);
        safe(initContactForm);
        safe(initBackToTop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
