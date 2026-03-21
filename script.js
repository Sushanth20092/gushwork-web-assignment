/**
 * script.js — Mangalam HDPE Pipes
 * Header functionality only:
 *   1. Sticky header — slides in when scrolling DOWN past the main navbar,
 *      slides out immediately when scrolling back UP toward the top.
 *   2. Hamburger — toggles mobile drawer open/closed.
 */

/* ── 1. STICKY HEADER ──────────────────────────────────────────
   Threshold: bottom edge of #mainNavbar.

   Rules (per assignment spec):
     • Appear  → user has scrolled PAST the navbar AND is going DOWN
     • Disappear → user scrolls UP (any amount) OR is back at/near top

   Glitch fix: lastY is initialised AFTER the page loads so the
   first scroll delta is always accurate. We also guard against
   iOS rubber-band bounce (negative scrollY).
─────────────────────────────────────────────────────────────── */
(function initStickyHeader() {
  const sticky = document.getElementById('stickyHeader');
  const navbar = document.getElementById('mainNavbar');
  if (!sticky || !navbar) return;

  /* Start tracking from current position (not 0) to avoid a
     false "scrolling down" signal on the very first scroll event */
  let lastY   = window.scrollY;
  let ticking = false;

  function update() {
    const currentY  = window.scrollY < 0 ? 0 : window.scrollY; // iOS guard
    const threshold = navbar.offsetTop + navbar.offsetHeight;   // bottom of navbar
    const goingDown = currentY > lastY;

    if (currentY > threshold && goingDown) {
      /* Past the navbar and still moving down → show */
      sticky.classList.add('is-visible');
      sticky.setAttribute('aria-hidden', 'false');
    } else if (!goingDown || currentY <= threshold) {
      /* Scrolling up OR back near/at the top → hide immediately */
      sticky.classList.remove('is-visible');
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
})();


/* ── 2. HAMBURGER / MOBILE DRAWER ─────────────────────────────
   Toggles .is-open on the drawer and aria-expanded on the button.
   Clicking outside the drawer or navbar also closes it.
─────────────────────────────────────────────────────────────── */
(function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const navbar = document.getElementById('mainNavbar');
  if (!btn || !drawer) return;

  function open() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    drawer.classList.contains('is-open') ? close() : open();
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  // Close when clicking outside the navbar / drawer
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && !drawer.contains(e.target)) {
      close();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();