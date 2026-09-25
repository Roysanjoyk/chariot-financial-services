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

/* =========================================================
DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

setCurrentYear();

initSmoothScrolling();

initMobileNavigation();

initAnalyticsConsent();

initAnalyticsEvents();

});

/* =========================================================
CURRENT YEAR
========================================================= */

function setCurrentYear() {

const yearElement =
document.getElementById("year");

if (!yearElement) {
return;
}

yearElement.textContent =
new Date().getFullYear();

}

/* =========================================================
SMOOTH SCROLLING
========================================================= */

function initSmoothScrolling() {

const anchorLinks =
document.querySelectorAll(
'a[href^="#"]:not([href="#"])'
);

anchorLinks.forEach((link) => {

```
link.addEventListener("click", (event) => {

  const targetId =
    link.getAttribute("href");

  if (!targetId) {
    return;
  }

  const target =
    document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  closeMobileNavigation();

});
```

});

}

/* =========================================================
MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {

const toggle =
document.querySelector(".menu-toggle");

const navigation =
document.querySelector(".primary-navigation");

if (!toggle || !navigation) {
return;
}

toggle.addEventListener("click", () => {

```
const isOpen =
  navigation.classList.contains("is-open");

if (isOpen) {

  closeMobileNavigation();

} else {

  openMobileNavigation();

}
```

});

navigation
.querySelectorAll("a")
.forEach((link) => {

```
  link.addEventListener("click", () => {

    closeMobileNavigation();

  });

});
```

document.addEventListener("click", (event) => {

```
if (!navigation.classList.contains("is-open")) {
  return;
}

const clickedInsideNavigation =
  navigation.contains(event.target);

const clickedToggle =
  toggle.contains(event.target);

if (
  !clickedInsideNavigation &&
  !clickedToggle
) {

  closeMobileNavigation();

}
```

});

document.addEventListener("keydown", (event) => {

```
if (event.key === "Escape") {

  closeMobileNavigation();

}
```

});

window.addEventListener("resize", () => {

```
if (window.innerWidth > 850) {

  closeMobileNavigation();

}
```

});

}

function openMobileNavigation() {

const toggle =
document.querySelector(".menu-toggle");

const navigation =
document.querySelector(".primary-navigation");

if (!toggle || !navigation) {
return;
}

navigation.classList.add("is-open");

toggle.setAttribute(
"aria-expanded",
"true"
);

toggle.setAttribute(
"aria-label",
"Close navigation"
);

toggle.innerHTML =
'<span aria-hidden="true">×</span>';

}

function closeMobileNavigation() {

const toggle =
document.querySelector(".menu-toggle");

const navigation =
document.querySelector(".primary-navigation");

if (!toggle || !navigation) {
return;
}

navigation.classList.remove("is-open");

toggle.setAttribute(
"aria-expanded",
"false"
);

toggle.setAttribute(
"aria-label",
"Open navigation"
);

toggle.innerHTML = `     <span></span>     <span></span>     <span></span>
  `;

}

/* =========================================================
ANALYTICS CONSENT
========================================================= */

function initAnalyticsConsent() {

const savedConsent =
getAnalyticsConsent();

/*

* Establish Google's initial consent state.
  */

updateGoogleConsent(
savedConsent === "accepted"
? "granted"
: "denied"
);

/*

* Analytics was previously accepted.
  */

if (savedConsent === "accepted") {

```
loadGoogleAnalytics();

return;
```

}

/*

* Analytics was previously declined.
  */

if (savedConsent === "declined") {

```
return;
```

}

/*

* No consent decision has been made.
*
* This version does not display a cookie banner because
* there is currently no cookie banner in index.html.
*
* Analytics therefore remains disabled until consent is
* explicitly recorded as "accepted".
  */

}

/* =========================================================
LOCAL STORAGE — CONSENT
========================================================= */

function getAnalyticsConsent() {

try {

```
return localStorage.getItem(
  CONSENT_STORAGE_KEY
);
```

} catch (error) {

```
console.warn(
  "Chariot Analytics: Unable to read consent storage.",
  error
);

return null;
```

}

}

function saveAnalyticsConsent(value) {

try {

```
localStorage.setItem(
  CONSENT_STORAGE_KEY,
  value
);
```

} catch (error) {

```
console.warn(
  "Chariot Analytics: Unable to save consent.",
  error
);
```

}

}

/* =========================================================
GOOGLE CONSENT MODE
========================================================= */

function updateGoogleConsent(status) {

window.dataLayer =
window.dataLayer || [];

window.gtag =
window.gtag ||
function () {

```
  window.dataLayer.push(
    arguments
  );

};
```

window.gtag(
"consent",
"update",
{
analytics_storage: status,
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

```
return;
```

}

window.dataLayer =
window.dataLayer || [];

window.gtag =
window.gtag ||
function () {

```
  window.dataLayer.push(
    arguments
  );

};
```

window.gtag(
"js",
new Date()
);

window.gtag(
"config",
GA4_MEASUREMENT_ID,
{
send_page_view: true
}
);

const script =
document.createElement("script");

script.async = true;

script.src =
`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;

script.onload = () => {

```
console.info(
  "Chariot Analytics: Google Analytics 4 loaded."
);
```

};

script.onerror = () => {

```
console.warn(
  "Chariot Analytics: Google Analytics 4 could not be loaded."
);
```

};

document.head.appendChild(script);

}

/* =========================================================
ANALYTICS EVENT TRACKING
========================================================= */

function initAnalyticsEvents() {

const trackedElements =
document.querySelectorAll(
"[data-event]"
);

trackedElements.forEach((element) => {

```
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


    const label =
      element.textContent.trim();


    window.gtag(
      "event",
      eventName,
      {
        event_category: "engagement",
        event_label: label
      }
    );

  }
);
```

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
====================

Open the browser console and run:

```
   chariotAnalyticsStatus()
```

========================================================= */

window.chariotAnalyticsStatus = function () {

const googleScript =
document.querySelector(
`script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
);

const status = {

```
measurementId:
  GA4_MEASUREMENT_ID,

consent:
  getAnalyticsConsent(),

gtagAvailable:
  typeof window.gtag === "function",

dataLayerFound:
  Array.isArray(window.dataLayer),

googleScriptLoaded:
  Boolean(googleScript)
```

};

console.table(status);

return status;

};

/* =========================================================
END
========================================================= */
