// ============================================================
// Site Configuration
// Single source of truth for contact details, links, and images.
// Update values here and they'll apply everywhere via script.js.
// ============================================================
const SITE_CONFIG = {
  phone: '+917204868557',
  phoneDisplay: '+91 72048 68557',
  email: 'exports@naturesnestglobal.com',
  whatsappNumber: '917204868557',
  whatsappMessage: "Hi, I'm interested in your products and would like a quote.",
  formsubmitEndpoint: 'https://formsubmit.co/ajax/exports@naturesnestglobal.com',
  logoImage: 'images/logo.jpeg',
  heroImage: 'images/herobanner.jpeg',
};

SITE_CONFIG.whatsappLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
