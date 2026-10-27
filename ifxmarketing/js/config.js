/* ==========================================================================
   IFX Marketing — central configuration
   --------------------------------------------------------------------------
   ONE PLACE to update business details. Edit only this file when the phone
   number, email, domain, or social link changes.

   SECURITY: this file is served publicly to the browser. Never put API keys,
   passwords, SMTP credentials or private tokens here.
   ========================================================================== */

window.IFX_CONFIG = {
  /* --- Brand ------------------------------------------------------------ */
  brandName: "IFX Marketing",
  legalName: "", // No registered entity supplied. Leave empty — do not invent.
  domain: "https://ifxmarketing.com",
  tagline: "Fintech Performance Marketing Agency",
  established: 2017,

  /* --- Contact ---------------------------------------------------------- */
  email: "connect.ifx@gmail.com",

  whatsapp: {
    display: "+44 7446 345817",
    // Digits only, international format, no "+", no spaces. Used to build wa.me URLs.
    digits: "447446345817"
  },

  instagram: "https://www.instagram.com/ifx_marketing/",

  // Country supplied by the business (no street address supplied).
  location: "UAE",
  primaryMarket: "India",
  secondaryMarket: "International clients",

  /* --- Commercial terms ------------------------------------------------- */
  minAdBudgetNote: "₹1 lakh per month",
  pricingModels: ["Fixed monthly service fee", "Percentage of ad spend"],

  /* --- VERIFICATION FLAG: advertising spend claim -----------------------
     The "₹1 crore+ in Meta advertising spend" figure is NOT independently
     verified yet.
     - While adSpend.verified === false  -> the site shows neutral wording
       (the neutral text is already written into the HTML, so the pages are
       correct even with JavaScript disabled).
     - Once the figure is verified, set verified: true and the value below is
       rendered into every element carrying [data-ifx-adspend].
     Locate this claim: search the project for "adSpend" or "1 crore".
     --------------------------------------------------------------------- */
  adSpend: {
    verified: false,
    value: "₹1 crore+",
    label: "Managed in Meta advertising spend",
    neutralValue: "Meta & Google",
    neutralLabel: "Advertising platforms managed daily",
    neutralNote:
      "Hands-on experience planning, buying and optimizing Meta and Google Ads campaigns for trading and fintech businesses since 2017."
  },

  /* --- WhatsApp message templates --------------------------------------- */
  messages: {
    // Floating button: polite, general enquiry.
    float:
      "Hello IFX Marketing, I would like to discuss my fintech marketing requirements. Please share the next steps.",
    // Header / footer CTA buttons (no form data involved).
    general:
      "Hello IFX Marketing, I would like to discuss a performance marketing campaign for my business."
  },

  /* --- Analytics / tracking -------------------------------------------
     Nothing is loaded by default. If you later add Google Analytics or a
     pixel, load it only after consent and update the privacy policy.
     --------------------------------------------------------------------- */
  analytics: {
    enabled: false,
    note: "No analytics or advertising trackers are loaded by this website by default."
  }
};
