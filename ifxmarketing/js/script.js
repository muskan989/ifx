/* ==========================================================================
   IFX Marketing — shared behaviour
   Vanilla JS, no dependencies. Progressive enhancement: all content stays
   readable with JavaScript disabled.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.IFX_CONFIG || {};
  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- */
  /* Helpers                                                          */
  /* ---------------------------------------------------------------- */
  function waNumber() {
    return String((cfg.whatsapp && cfg.whatsapp.digits) || "").replace(/[^\d]/g, "");
  }

  function waLink(message) {
    var text = message || (cfg.messages && cfg.messages.general) || "Hello IFX Marketing.";
    return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(text);
  }

  /* ---------------------------------------------------------------- */
  /* 1. Configuration injection                                      */
  /* ---------------------------------------------------------------- */
  function applyConfig() {
    $$("[data-ifx-wa]").forEach(function (el) {
      var key = el.getAttribute("data-ifx-wa") || "general";
      var msg = (cfg.messages && cfg.messages[key]) || null;
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    $$("[data-ifx-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (cfg.email || ""));
      if (el.getAttribute("data-ifx-email") === "text") el.textContent = cfg.email || "";
    });

    $$("[data-ifx-phone]").forEach(function (el) {
      el.textContent = (cfg.whatsapp && cfg.whatsapp.display) || "";
    });

    $$("[data-ifx-instagram]").forEach(function (el) { el.setAttribute("href", cfg.instagram || "#"); });
    $$("[data-ifx-brand]").forEach(function (el) { el.textContent = cfg.brandName || "IFX Marketing"; });

    // Advertising-spend claim. Neutral wording is hard-coded in the HTML and is
    // only replaced when adSpend.verified === true in config.js.
    var spend = cfg.adSpend || {};
    if (spend.verified === true) {
      $$("[data-ifx-adspend-value]").forEach(function (el) { el.textContent = spend.value || ""; });
      $$("[data-ifx-adspend-label]").forEach(function (el) { el.textContent = spend.label || ""; });
      $$("[data-ifx-adspend-note]").forEach(function (el) { el.textContent = spend.note || ""; });
    }

    var year = String(new Date().getFullYear());
    $$("[data-ifx-year]").forEach(function (el) { el.textContent = year; });
  }

  /* ---------------------------------------------------------------- */
  /* 2. Sticky header                                                  */
  /* ---------------------------------------------------------------- */
  function initStickyHeader() {
    var header = $("#site-header");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------- */
  /* 3. Mobile navigation                                             */
  /* ---------------------------------------------------------------- */
  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#primary-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      if (!open) {
        $$(".nav-drop-toggle", nav).forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
          var m = document.getElementById(b.getAttribute("aria-controls"));
          if (m) m.classList.remove("is-open");
        });
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------- */
  /* 4. Services dropdown                                             */
  /* ---------------------------------------------------------------- */
  function initDropdowns() {
    var buttons = $$(".nav-drop-toggle");
    if (!buttons.length) return;

    function menuFor(btn) { return document.getElementById(btn.getAttribute("aria-controls")); }

    function setOpen(btn, open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var menu = menuFor(btn);
      if (menu) menu.classList.toggle("is-open", open);
    }

    function closeOthers(except) {
      buttons.forEach(function (b) { if (b !== except) setOpen(b, false); });
    }

    buttons.forEach(function (btn) {
      var wrap = btn.parentNode;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = btn.getAttribute("aria-expanded") !== "true";
        closeOthers(btn);
        setOpen(btn, willOpen);
      });

      wrap.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
          setOpen(btn, false);
          btn.focus();
        }
      });

      wrap.addEventListener("focusout", function (e) {
        if (!wrap.contains(e.relatedTarget)) setOpen(btn, false);
      });
    });

    document.addEventListener("click", function (e) {
      buttons.forEach(function (btn) {
        if (!btn.parentNode.contains(e.target)) closeOthers(null);
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* 5. Scroll reveal                                                 */
  /* ---------------------------------------------------------------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
        window.setTimeout(function () { el.classList.add("is-in"); }, Math.min(delay, 320));
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- */
  /* 6. Enquiry forms -> WhatsApp                                     */
  /* ---------------------------------------------------------------- */
  function initForms() {
    var forms = $$("form[data-ifx-form]");
    if (!forms.length) return;

    var NAME_RE = /^[A-Za-z\u00C0-\u024F\u0900-\u097F\u0600-\u06FF' .\-]{2,60}$/;
    var PHONE_RE = /^\+?[\d\s().\-]{7,24}$/;

    forms.forEach(function (form) {
      var status = $(".form-status", form);

      function showStatus(type, title, body) {
        if (!status) return;
        status.className = "form-status is-visible " + type;
        status.textContent = "";
        var strong = document.createElement("strong");
        strong.textContent = title;
        var span = document.createElement("span");
        span.textContent = body;
        status.appendChild(strong);
        status.appendChild(span);
      }

      function resetStatus() {
        if (!status) return;
        status.className = "form-status";
        status.textContent = "";
      }

      function markError(field, message) {
        if (!field) return;
        var wrap = field.closest(".field");
        if (wrap) {
          wrap.classList.add("has-error");
          var err = $(".error-msg", wrap);
          if (err) err.textContent = message;
        }
        field.setAttribute("aria-invalid", "true");
      }

      function clearErrors() {
        $$(".field.has-error", form).forEach(function (f) { f.classList.remove("has-error"); });
        $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
        resetStatus();
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearErrors();

        var f = form.elements;
        var honey = form.elements.company_website;

        // Honeypot: silently refuse, no success message.
        if (honey && String(honey.value || "").trim() !== "") {
          showStatus("error", "Could not prepare the message",
            "Please contact us directly on WhatsApp or by email instead.");
          return;
        }

        var fullName = (form.elements.fullName && form.elements.fullName.value || "").trim().replace(/\s+/g, " ");
        var phone = (form.elements.phone && form.elements.phone.value || "").trim();
        var businessType = form.elements.businessType ? form.elements.businessType.value : "";
        var budget = form.elements.budget ? form.elements.budget.value : "";
        var consentEl = form.elements.consent;
        var digits = phone.replace(/[^\d]/g, "");
        var firstInvalid = null;

        if (fullName.length < 2 || !NAME_RE.test(fullName)) {
          markError(form.elements.fullName, "Please enter your full name (2–60 letters, no numbers).");
          firstInvalid = firstInvalid || form.elements.fullName;
        }
        if (!phone || !PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15) {
          markError(form.elements.phone, "Enter a valid number with country code, e.g. +91 98765 43210.");
          firstInvalid = firstInvalid || form.elements.phone;
        }
        if (!businessType) {
          markError(form.elements.businessType, "Please select your business type.");
          firstInvalid = firstInvalid || form.elements.businessType;
        }
        if (!budget) {
          markError(form.elements.budget, "Please select your monthly advertising budget.");
          firstInvalid = firstInvalid || form.elements.budget;
        }
        if (consentEl && !consentEl.checked) {
          markError(consentEl, "Please confirm you agree to be contacted about this enquiry.");
          firstInvalid = firstInvalid || consentEl;
        }

        if (firstInvalid) {
          showStatus("error", "Please check the highlighted fields",
            "A few details are missing or need correcting before your WhatsApp message can be prepared.");
          if (firstInvalid.focus) firstInvalid.focus();
          return;
        }

        var message = [
          "Hello IFX Marketing,",
          "",
          "I would like to discuss your fintech performance marketing services.",
          "",
          "Name: " + fullName,
          "Phone: " + phone,
          "Business Type: " + businessType,
          "Monthly Advertising Budget: " + budget,
          "",
          "Please contact me regarding your services."
        ].join("\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");

        var url = waLink(message);
        var win = null;
        try { win = window.open(url, "_blank", "noopener,noreferrer"); } catch (err) { win = null; }

        if (!win) {
          showStatus("error", "WhatsApp could not open automatically",
            "Your browser blocked the new tab. Use the link below to open WhatsApp with your details, or tap the floating WhatsApp button.");
          if (status) {
            var a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "Open WhatsApp with my details";
            a.style.cssText = "display:inline-block;margin-top:8px;font-weight:600";
            status.appendChild(a);
          }
          return;
        }

        showStatus("success", "WhatsApp is opening in a new tab",
          "Your details are pre-filled in the message. Nothing has been sent yet — review the message and press Send in WhatsApp to deliver it to IFX Marketing.");
        form.reset();
      });

      $$("input, select, textarea", form).forEach(function (el) {
        el.addEventListener("input", function () {
          var wrap = el.closest(".field");
          if (wrap && wrap.classList.contains("has-error")) {
            wrap.classList.remove("has-error");
            el.removeAttribute("aria-invalid");
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* 7. Boot                                                          */
  /* ---------------------------------------------------------------- */
  function init() {
    applyConfig();
    initStickyHeader();
    initNav();
    initDropdowns();
    initReveal();
    initForms();
    document.documentElement.classList.remove("no-js");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
