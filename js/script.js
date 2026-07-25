// Apply centralized site configuration (see js/config.js) to every element
// that references it, so contact details / links / images only ever need
// to be updated in one place.
document.querySelectorAll('[data-cfg="whatsapp-link"]').forEach((el) => {
  el.href = SITE_CONFIG.whatsappLink;
});
document.querySelectorAll('[data-cfg="tel-link"]').forEach((el) => {
  el.href = `tel:${SITE_CONFIG.phone}`;
});
document.querySelectorAll('[data-cfg="tel-text"]').forEach((el) => {
  el.textContent = SITE_CONFIG.phoneDisplay;
});
document.querySelectorAll('[data-cfg="email-link"]').forEach((el) => {
  el.href = `mailto:${SITE_CONFIG.email}`;
});
document.querySelectorAll('[data-cfg="email-text"]').forEach((el) => {
  el.textContent = SITE_CONFIG.email;
});
document.querySelectorAll('[data-cfg="logo-src"]').forEach((el) => {
  el.src = SITE_CONFIG.logoImage;
});
document.querySelectorAll('[data-cfg="form-action"]').forEach((el) => {
  el.action = SITE_CONFIG.formsubmitEndpoint;
});
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.style.backgroundImage = `url('${SITE_CONFIG.heroImage}')`;
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Toggle dropdown on mobile tap
document.querySelectorAll('.has-dropdown > a').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 860) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.main-nav a:not(.has-dropdown > a)').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav > ul > li > a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Quote form submit handler - sends data to exports@naturesnestglobal.com via FormSubmit
const quoteForm = document.getElementById('quoteForm');
const quoteFormStatus = document.getElementById('quoteFormStatus');

quoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';
  quoteFormStatus.textContent = '';
  quoteFormStatus.className = 'form-status';

  try {
    const response = await fetch(quoteForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(quoteForm),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === 'false')) {
      throw new Error((data && data.message) || 'Request failed');
    }

    quoteFormStatus.textContent = 'Thank you for your inquiry! Our export team will get back to you within 24 hours.';
    quoteFormStatus.classList.add('success');
    quoteForm.reset();
  } catch (err) {
    console.error('Quote form submission error:', err);
    quoteFormStatus.textContent = `Sorry, something went wrong sending your request. Please email us directly at ${SITE_CONFIG.email}.`;
    quoteFormStatus.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});
