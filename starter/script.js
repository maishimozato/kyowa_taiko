// Shared small interactions for the site.
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Performance inquiry form. Add your deployed Google Apps Script URL below.
// Until configured, the form deliberately does not pretend submissions succeeded.
const SCRIPT_URL = ""; // Paste your deployed Google Apps Script web app URL here.
const form = document.querySelector("#performance-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    const submitButton = form.querySelector('button[type="submit"]');

    // Quietly ignore obvious bot submissions.
    if (form.elements.website.value.trim()) {
      status.textContent = "Thanks — your inquiry has been received.";
      form.reset();
      return;
    }

    if (!SCRIPT_URL) {
      status.textContent = "The inquiry form is not connected yet. Please configure SCRIPT_URL in script.js before publishing the form.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    status.textContent = "Sending your inquiry…";
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      // Google Apps Script web apps can have cross-origin limitations. This uses
      // a no-cors POST; the browser cannot read the response, so success is not
      // verifiable here. See README for setup and testing guidance.
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(data).toString()
      });
      status.textContent = "Your inquiry has been sent. If you don't hear back, please contact us through Instagram.";
      form.reset();
    } catch (error) {
      status.textContent = "We couldn't send your inquiry. Please try again later or contact us through Instagram.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send inquiry";
    }
  });
}
