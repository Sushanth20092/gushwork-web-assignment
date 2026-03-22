/**
 * script.js — Mangalam HDPE Pipes
 * Refactored: fluid responsive + working sticky header
 */

/* =============================================================
   1. STICKY HEADER — Step 3
      Shows when scrolled past bottom of #heroSection
      and user is scrolling DOWN.
      Hides when scrolling back UP or above threshold.
============================================================= */
(function initStickyHeader() {
  const sticky  = document.getElementById('stickyHeader');
  const hero    = document.getElementById('heroSection');
  const navbar  = document.getElementById('mainNavbar');
  if (!sticky) return;

  let lastY   = window.scrollY;
  let ticking = false;

  /* Threshold = bottom of hero section, or navbar height as fallback */
  function getThreshold() {
    if (hero)   return hero.offsetTop + hero.offsetHeight;
    if (navbar) return navbar.offsetTop + navbar.offsetHeight;
    return 300;
  }

  function update() {
    const currentY  = Math.max(0, window.scrollY);
    const threshold = getThreshold();
    const goingDown = currentY > lastY;

    if (currentY > threshold && goingDown) {
      /* Scrolled past hero and moving down — show sticky */
      sticky.classList.add('active');
      sticky.setAttribute('aria-hidden', 'false');
    } else if (!goingDown || currentY <= threshold) {
      /* Moving up or above threshold — hide sticky */
      sticky.classList.remove('active');
      sticky.setAttribute('aria-hidden', 'true');
    }

    lastY   = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  /* Also run once on load in case page is pre-scrolled */
  update();
})();


/* =============================================================
   2. HAMBURGER / MOBILE DRAWER
============================================================= */
(function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const navbar = document.getElementById('mainNavbar');
  if (!btn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  document.addEventListener('click', function (e) {
    if (navbar && !navbar.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();


/* =============================================================
   3. FAQ ACCORDION
============================================================= */
(function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  function closeItem(el) {
    el.classList.remove('faq__item--open');
    const toggle = el.querySelector('.faq__toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Expand answer');
    }
  }

  function openItem(el) {
    el.classList.add('faq__item--open');
    const toggle = el.querySelector('.faq__toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Collapse answer');
    }
  }

  items.forEach(function (item) {
    const row = item.querySelector('.faq__row');
    if (!row) return;

    row.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq__item--open');
      items.forEach(closeItem);
      if (!isOpen) openItem(item);
    });
  });

  /* Set initial aria states */
  items.forEach(function (item) {
    const toggle = item.querySelector('.faq__toggle');
    if (!toggle) return;
    const isOpen = item.classList.contains('faq__item--open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Collapse answer' : 'Expand answer');
  });
})();


/* =============================================================
   4. INDUSTRIES CAROUSEL
   Card width and gap read from CSS variables so they scale.
============================================================= */
(function initIndustriesCarousel() {
  const track   = document.getElementById('industriesTrack');
  const outer   = document.querySelector('.industries__track-outer');
  const btnPrev = document.getElementById('industriesPrev');
  const btnNext = document.getElementById('industriesNext');
  if (!track || !outer || !btnPrev || !btnNext) return;

  const cards   = track.querySelectorAll('.industry-card');
  const TOTAL   = cards.length;
  let   current = 0;

  /* Read actual rendered card width + gap dynamically */
  function getStep() {
    if (!cards[0]) return 436;
    const cardW = cards[0].getBoundingClientRect().width;
    const style = window.getComputedStyle(track);
    const gap   = parseFloat(style.gap) || 16;
    return cardW + gap;
  }

  function visibleCount() {
    const w    = outer.clientWidth;
    const step = getStep();
    if (w <= 0 || step <= 0) return 1;
    return Math.max(1, Math.min(TOTAL, Math.floor((w + (parseFloat(window.getComputedStyle(track).gap) || 16)) / step)));
  }

  function maxIndex() {
    return Math.max(0, TOTAL - visibleCount());
  }

  function updateTrack() {
    const max  = maxIndex();
    if (current > max) current = max;
    const step = getStep();
    track.style.transform  = `translateX(-${current * step}px)`;
    btnPrev.disabled       = current === 0;
    btnNext.disabled       = current >= max;
  }

  btnPrev.addEventListener('click', function () {
    if (current > 0) { current--; updateTrack(); }
  });

  btnNext.addEventListener('click', function () {
    if (current < maxIndex()) { current++; updateTrack(); }
  });

  updateTrack();

  /* Re-evaluate on resize */
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateTrack).observe(outer);
  } else {
    window.addEventListener('resize', updateTrack);
  }
})();


/* =============================================================
   5. MANUFACTURING PROCESS TABS
============================================================= */
(function initProcessTabs() {
  const steps = [
    {
      title:   'High-Grade Raw Material Selection',
      desc:    'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['PE100 grade material', 'Optimal molecular weight distribution'],
      img:     'assets/process-1.jpg'
    },
    {
      title:   'Precision Extrusion',
      desc:    'Our twin-screw extruders melt and homogenise HDPE pellets at precisely controlled temperatures to achieve consistent melt flow.',
      bullets: ['Controlled melt temperature', 'Uniform material distribution'],
      img:     'assets/process-2.jpg'
    },
    {
      title:   'Rapid Cooling System',
      desc:    'Immediate water-bath cooling locks the pipe geometry and prevents deformation as the hot extrudate exits the die.',
      bullets: ['Multi-stage water cooling', 'Dimensional stability assured'],
      img:     'assets/process-3.jpg'
    },
    {
      title:   'Vacuum Sizing',
      desc:    'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['±0.1mm diameter tolerance', 'Consistent wall thickness'],
      img:     'assets/process-4.jpg'
    },
    {
      title:   'Quality Control Inspection',
      desc:    'Every pipe passes dimensional checks, pressure testing, and visual inspection before moving to the next stage.',
      bullets: ['100% pressure tested', 'ISO 4427 compliant checks'],
      img:     'assets/process-5.jpg'
    },
    {
      title:   'Pipe Marking & Identification',
      desc:    'Continuous inkjet printing applies product identification, pressure rating, and certification marks along the pipe length.',
      bullets: ['ISO standard marking', 'Permanent UV-resistant ink'],
      img:     'assets/process-6.jpg'
    },
    {
      title:   'Precision Cutting',
      desc:    'Automated planetary cutters produce clean, square ends at exact lengths without stress or deformation to the pipe wall.',
      bullets: ['Burr-free cut ends', 'Custom lengths available'],
      img:     'assets/process-7.jpg'
    },
    {
      title:   'Packaging & Dispatch',
      desc:    'Pipes are bundled, capped, and strapped on certified pallets for safe transport anywhere in the world.',
      bullets: ['End caps fitted', 'Export-grade packaging'],
      img:     'assets/process-8.jpg'
    }
  ];

  const CHECK_ICON  = 'assets/icons/check.svg';
  const tabs        = document.querySelectorAll('.process__tab');
  const titleEl     = document.getElementById('processStepTitle');
  const descEl      = document.getElementById('processStepDesc');
  const bulletsEl   = document.getElementById('processStepBullets');
  const imgEl       = document.getElementById('processImg');
  const btnPrev     = document.getElementById('processImgPrev');
  const btnNext     = document.getElementById('processImgNext');
  if (!tabs.length || !titleEl) return;

  let currentStep = 0;

  function renderStep(index) {
    const s = steps[index];
    if (!s) return;

    titleEl.textContent = s.title;
    descEl.textContent  = s.desc;

    bulletsEl.innerHTML = '';
    s.bullets.forEach(function (text) {
      const li   = document.createElement('li');
      li.className = 'process__bullet';
      const icon = document.createElement('img');
      icon.src   = CHECK_ICON;
      icon.alt   = '';
      icon.setAttribute('aria-hidden', 'true');
      const span = document.createElement('span');
      span.textContent = text;
      li.appendChild(icon);
      li.appendChild(span);
      bulletsEl.appendChild(li);
    });

    if (imgEl) { imgEl.src = s.img; imgEl.alt = s.title; }

    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    currentStep = index;
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { renderStep(i); });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      renderStep((currentStep - 1 + steps.length) % steps.length);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      renderStep((currentStep + 1) % steps.length);
    });
  }

  renderStep(0);
})();


/* =============================================================
   6. TESTIMONIALS AUTO-SCROLL
   Card width is read dynamically so it works at any viewport.
============================================================= */
(function initTestimonialsScroll() {
  const track = document.getElementById('testimonialsTrack');
  const outer = track ? track.parentElement : null;
  if (!track || !outer) return;

  const cards    = track.querySelectorAll('.testimonial-card');
  const TOTAL    = cards.length;
  const INTERVAL = 4000;
  let   current  = 0;
  let   timer    = null;

  function getStep() {
    if (!cards[0]) return 444;
    const style = window.getComputedStyle(track);
    const gap   = parseFloat(style.gap) || 24;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function visibleCount() {
    if (!cards[0]) return 3;
    const step = getStep();
    const gap  = parseFloat(window.getComputedStyle(track).gap) || 24;
    return Math.max(1, Math.floor((outer.clientWidth + gap) / step));
  }

  function maxIndex() {
    return Math.max(0, TOTAL - visibleCount());
  }

  function goTo(index) {
    const max = maxIndex();
    if (index > max) index = 0; /* loop back */
    if (index < 0)   index = 0;
    current = index;
    track.style.transform = `translateX(-${current * getStep()}px)`;
  }

  function advance() { goTo(current + 1); }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(advance, INTERVAL);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  outer.addEventListener('mouseenter', stopTimer);
  outer.addEventListener('mouseleave', startTimer);

  startTimer();
})();


/* =============================================================
   7. CATALOGUE MODAL
============================================================= */
(function initCatalogueModal() {
  const backdrop   = document.getElementById('catalogueModalBackdrop');
  const closeBtn   = document.getElementById('catalogueModalClose');
  const submitBtn  = document.getElementById('catalogueModalSubmit');
  const trigger    = document.querySelector('.specs__download');
  const emailInput = document.getElementById('catalogueEmail');
  if (!backdrop || !trigger) return;

  function openModal() {
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (emailInput) emailInput.focus(); }, 260);
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (emailInput) emailInput.value = '';
    const phoneInput = document.getElementById('cataloguePhone');
    if (phoneInput) phoneInput.value = '';
    const textEl = backdrop.querySelector('.catalogue-modal__submit-text');
    if (textEl) textEl.textContent = 'Download Brochure';
    if (submitBtn) { submitBtn.disabled = false; submitBtn.style.background = ''; }
  }

  trigger.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) {
          emailInput.style.borderColor = '#EF4444';
          emailInput.focus();
          emailInput.addEventListener('input', function reset() {
            emailInput.style.borderColor = '';
            emailInput.removeEventListener('input', reset);
          });
        }
        return;
      }
      const textEl = submitBtn.querySelector('.catalogue-modal__submit-text');
      if (textEl) textEl.textContent = 'Sent! ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#16a34a';
      setTimeout(closeModal, 1600);
    });
  }
})();


/* =============================================================
   8. CALLBACK MODAL
============================================================= */
(function initCallbackModal() {
  const backdrop   = document.getElementById('callbackModalBackdrop');
  const closeBtn   = document.getElementById('callbackModalClose');
  const submitBtn  = document.getElementById('callbackModalSubmit');
  const emailInput = document.getElementById('callbackEmail');
  const triggers   = document.querySelectorAll('.features__cta, [data-open="callbackModal"]');
  if (!backdrop) return;

  function openModal() {
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      const first = document.getElementById('callbackFullName');
      if (first) first.focus();
    }, 260);
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    ['callbackFullName', 'callbackCompany', 'callbackEmail', 'callbackPhone'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.style.borderColor = ''; }
    });
    const textEl = backdrop.querySelector('.callback-modal__submit-text');
    if (textEl) textEl.textContent = 'Submit Form';
    if (submitBtn) { submitBtn.disabled = false; submitBtn.style.background = ''; }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) {
          emailInput.style.borderColor = '#EF4444';
          emailInput.focus();
          emailInput.addEventListener('input', function reset() {
            emailInput.style.borderColor = '';
            emailInput.removeEventListener('input', reset);
          });
        }
        return;
      }
      const textEl = submitBtn.querySelector('.callback-modal__submit-text');
      if (textEl) textEl.textContent = 'Submitted ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#16a34a';
      setTimeout(closeModal, 1600);
    });
  }
})();


/* =============================================================
   9. HERO IMAGE CAROUSEL + ZOOM
============================================================= */
(function initCarouselWithZoom() {
  const stage      = document.getElementById('carouselStage');
  const mainImg    = document.getElementById('carouselMainImg');
  const btnPrev    = document.getElementById('carouselPrev');
  const btnNext    = document.getElementById('carouselNext');
  const thumbsWrap = document.getElementById('carouselThumbs');
  const zoomPanel  = document.getElementById('carouselZoomPanel');
  if (!stage || !mainImg) return;

  const thumbBtns = thumbsWrap
    ? thumbsWrap.querySelectorAll('.carousel__thumb')
    : [];

  const images = [
    'assets/product-main.jpg',
    'assets/product-thumb-1.jpg',
    'assets/product-thumb-2.jpg',
    'assets/product-thumb-3.jpg',
    'assets/product-thumb-4.jpg',
    'assets/product-thumb-5.jpg'
  ];

  let currentIndex = 0;

  function setImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;

    mainImg.src = images[currentIndex];
    mainImg.alt = 'Product image ' + (currentIndex + 1);

    if (zoomPanel) {
      zoomPanel.style.backgroundImage = 'url(' + images[currentIndex] + ')';
    }

    thumbBtns.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === currentIndex);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      setImage(currentIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      setImage(currentIndex + 1);
    });
  }

  thumbBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { setImage(i); });
  });

  setImage(0);

  /* ── Zoom on hover ── */
  if (!zoomPanel) return;

  const ZOOM_FACTOR = 2;

  function updateZoomBgSize() {
    const stageRect = stage.getBoundingClientRect();
    const panelRect = zoomPanel.getBoundingClientRect();
    const bgW = stageRect.width  * ZOOM_FACTOR;
    const bgH = stageRect.height * ZOOM_FACTOR;
    zoomPanel.style.backgroundSize = bgW + 'px ' + bgH + 'px';
    return { stageW: stageRect.width, stageH: stageRect.height, panelW: panelRect.width, panelH: panelRect.height, bgW, bgH };
  }

  stage.addEventListener('mousemove', function (e) {
    const { stageW, stageH, panelW, panelH } = updateZoomBgSize();
    const rect   = stage.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const lensW  = panelW / ZOOM_FACTOR;
    const lensH  = panelH / ZOOM_FACTOR;
    const clampX = Math.max(lensW / 2, Math.min(mouseX, stageW - lensW / 2));
    const clampY = Math.max(lensH / 2, Math.min(mouseY, stageH - lensH / 2));
    const bgX    = -(clampX * ZOOM_FACTOR - panelW / 2);
    const bgY    = -(clampY * ZOOM_FACTOR - panelH / 2);
    zoomPanel.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
  });

  stage.addEventListener('mouseenter', function () {
    zoomPanel.style.backgroundImage = 'url(' + images[currentIndex] + ')';
    updateZoomBgSize();
    zoomPanel.classList.add('is-visible');
    zoomPanel.setAttribute('aria-hidden', 'false');
  });

  stage.addEventListener('mouseleave', function () {
    zoomPanel.classList.remove('is-visible');
    zoomPanel.setAttribute('aria-hidden', 'true');
  });
})();