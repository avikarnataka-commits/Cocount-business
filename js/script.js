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
function updateHeroBackground() {
  if (!heroSection) return;
  const width = window.innerWidth;
  let image = SITE_CONFIG.heroImages.desktop;
  if (width <= 600) {
    image = SITE_CONFIG.heroImages.mobile;
  } else if (width <= 1100) {
    image = SITE_CONFIG.heroImages.tablet;
  }
  heroSection.style.backgroundImage = `url('${image}')`;
}
updateHeroBackground();
window.addEventListener('resize', updateHeroBackground);

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

// Product details modal with image slider
const productModalOverlay = document.getElementById('productModalOverlay');
const productModalClose = document.getElementById('productModalClose');
const productModalTitle = document.getElementById('productModalTitle');
const productModalDesc = document.getElementById('productModalDesc');
const productModalFeatures = document.getElementById('productModalFeatures');
const productSliderTrack = document.getElementById('productSliderTrack');
const sliderDots = document.getElementById('sliderDots');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderCaption = document.getElementById('sliderCaption');
const sliderCaptionTitle = document.getElementById('sliderCaptionTitle');
const sliderCaptionText = document.getElementById('sliderCaptionText');

let currentSlide = 0;
let slideCount = 0;
let currentCaptionTitles = [];
let currentCaptions = [];
let currentRichDescs = [];

function goToSlide(index) {
  if (slideCount === 0) return;
  currentSlide = (index + slideCount) % slideCount;
  productSliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  sliderDots.querySelectorAll('button').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  if (currentCaptions[currentSlide]) {
    sliderCaption.classList.remove('empty');
    sliderCaptionTitle.textContent = currentCaptionTitles[currentSlide] || '';
    sliderCaptionText.textContent = currentCaptions[currentSlide];
  } else {
    sliderCaption.classList.add('empty');
  }

  if (currentRichDescs[currentSlide]) {
    productModalDesc.innerHTML = currentRichDescs[currentSlide];
  }
}

function openProductModal(card) {
  const title = card.querySelector('h3').textContent;
  const desc = card.querySelector('p').textContent;
  const richDesc = card.querySelector(':scope > .rich-desc');
  const richDescSlideEls = card.querySelectorAll('.rich-desc-slides .rich-desc-slide');
  const features = card.querySelectorAll('ul li');
  const iconClass = card.querySelector('.product-icon i').className;
  const imagesAttr = card.dataset.images;
  const images = imagesAttr ? imagesAttr.split('|') : [];
  currentCaptionTitles = card.dataset.captionTitles ? card.dataset.captionTitles.split('~~~') : [];
  currentCaptions = card.dataset.captions ? card.dataset.captions.split('~~~') : [];

  const slides = images.length ? images : [null];
  slideCount = slides.length;

  const richDescsHtml = richDescSlideEls.length
    ? Array.from(richDescSlideEls).map((el) => el.innerHTML)
    : [richDesc ? richDesc.innerHTML : `<p>${desc}</p>`];
  currentRichDescs = slides.map((_, i) => richDescsHtml[i] || richDescsHtml[richDescsHtml.length - 1]);

  productModalTitle.textContent = title;
  productModalFeatures.innerHTML = '';
  features.forEach((li) => {
    productModalFeatures.insertAdjacentHTML('beforeend', li.outerHTML);
  });

  productSliderTrack.innerHTML = '';
  sliderDots.innerHTML = '';

  slides.forEach((src, i) => {
    if (src) {
      productSliderTrack.insertAdjacentHTML('beforeend', `<img src="${src}" alt="${title} - image ${i + 1}">`);
    } else {
      productSliderTrack.insertAdjacentHTML('beforeend', `<div class="slide-icon"><i class="${iconClass}"></i></div>`);
    }
  });

  const showControls = slideCount > 1;
  sliderPrev.style.display = showControls ? 'flex' : 'none';
  sliderNext.style.display = showControls ? 'flex' : 'none';

  if (showControls) {
    slides.forEach((_, i) => {
      sliderDots.insertAdjacentHTML('beforeend', `<button type="button" aria-label="Go to image ${i + 1}"></button>`);
    });
    sliderDots.querySelectorAll('button').forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
  }

  goToSlide(0);

  productModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  productModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.product-card [data-open-product]').forEach((btn) => {
  btn.addEventListener('click', () => {
    openProductModal(btn.closest('.product-card'));
  });
});

sliderPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
sliderNext.addEventListener('click', () => goToSlide(currentSlide + 1));
productModalClose.addEventListener('click', closeProductModal);
productModalOverlay.addEventListener('click', (e) => {
  if (e.target === productModalOverlay) closeProductModal();
});
document.addEventListener('keydown', (e) => {
  if (!productModalOverlay.classList.contains('open')) return;
  if (e.key === 'Escape') closeProductModal();
  if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

