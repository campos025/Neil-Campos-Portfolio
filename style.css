/* ==========================================================================
   NEIL MARVIN CAMPOS — PORTFOLIO SCRIPT
   Vanilla JS only. Handles:
     1. Sticky navbar shadow on scroll
     2. Mobile hamburger menu
     3. Active nav-link highlighting while scrolling (IntersectionObserver)
     4. Smooth scroll + closing mobile menu on link click
     5. Scroll-reveal fade-in animations (IntersectionObserver)
     6. Back-to-top button
     7. Footer year
     8. Project filter tabs
     9. Project lightbox modal
     10. Auto website screenshot previews
     11. Dark mode toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Shared element references ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const backToTopBtn = document.getElementById('back-to-top');
  const fadeEls = document.querySelectorAll('.fade-in');
  const yearEl = document.getElementById('year');

  /* ---------- 1. Sticky navbar shadow ---------- */
  const NAV_SCROLL_THRESHOLD = 12;

  function updateNavbarState() {
    if (window.scrollY > NAV_SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* ---------- 2. Mobile hamburger menu ---------- */
  function closeMobileMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
  }

  function toggleMobileMenu() {
    const isOpen = hamburger.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('is-open', isOpen);
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  /* Close the mobile menu whenever a link inside it is clicked */
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close mobile menu on window resize back to desktop width */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMobileMenu();
  });

  /* ---------- 3. Active nav-link highlighting while scrolling ---------- */
  const navLinkMap = new Map();
  navLinks.forEach((link) => {
    const key = link.dataset.nav;
    if (!navLinkMap.has(key)) navLinkMap.set(key, []);
    navLinkMap.get(key).push(link);
  });

  function setActiveLink(id) {
    navLinks.forEach((link) => link.classList.remove('is-active'));
    const matches = navLinkMap.get(id);
    if (matches) matches.forEach((link) => link.classList.add('is-active'));
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      // Pick the entry that is most visible / closest to the top band
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        // Prefer the section nearest the top of the viewport
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveLink(topMost.target.id);
      }
    },
    {
      // Treats a band in the upper-middle of the viewport as the "active" zone
      rootMargin: `-${document.getElementById('navbar').offsetHeight + 10}px 0px -55% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* Hero section maps to the "home" nav item */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink('home');
        });
      },
      { rootMargin: `-${navbar.offsetHeight + 10}px 0px -55% 0px`, threshold: 0 }
    );
    heroObserver.observe(heroSection);
  }

  /* ---------- 4. Smooth scroll for same-page anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update the URL hash without an extra jump
      history.pushState(null, '', targetId);
    });
  });

  /* ---------- 5. Scroll-reveal fade-in animations ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  fadeEls.forEach((el, index) => {
    // Small staggered delay for elements revealed together
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
    revealObserver.observe(el);
  });

  /* ---------- 6. Back-to-top button ---------- */
  const BACK_TO_TOP_THRESHOLD = 480;

  function updateBackToTopVisibility() {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > BACK_TO_TOP_THRESHOLD);
  }
  updateBackToTopVisibility();
  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 7. Footer year ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 8. Project filter tabs ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Toggle active state on the filter buttons
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      // Show only the cards matching the selected category
      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  /* ---------- 9. Project lightbox modal ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxThumb = document.getElementById('lightbox-thumb');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxLink = document.getElementById('lightbox-link');
  let lastFocusedCard = null;

  function openLightbox(card) {
    lastFocusedCard = card;
    lightboxTitle.textContent = card.dataset.title || 'Project';
    lightboxDesc.textContent = card.dataset.desc || '';

    const thumb = card.dataset.thumb;
    if (thumb) {
      lightboxThumb.src = thumb;
      lightboxThumb.alt = card.dataset.title || '';
      lightboxThumb.classList.remove('is-hidden');
    } else {
      lightboxThumb.classList.add('is-hidden');
    }

    const link = card.dataset.link;
    if (link) {
      lightboxLink.href = link;
      lightboxLink.classList.remove('is-hidden');
    } else {
      lightboxLink.classList.add('is-hidden');
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    lightbox.querySelector('.lightbox__close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
  });

  lightbox.querySelectorAll('[data-close-lightbox]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  /* ---------- 10. Auto website screenshot previews ----------
     For any "web" category card with a real data-link filled in, replace its
     thumbnail with a live screenshot instead of the manually-placed image.
     Uses WordPress's free mShots service — no API key required. If the
     screenshot ever fails to load, the card quietly falls back to its
     original manual placeholder image. */
  const AUTO_PREVIEW_WIDTH = 640;
  const AUTO_PREVIEW_HEIGHT = 400;

  function buildAutoPreviewUrl(siteUrl) {
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(siteUrl)}?w=${AUTO_PREVIEW_WIDTH}&h=${AUTO_PREVIEW_HEIGHT}`;
  }

  document.querySelectorAll('.project-card[data-category="web"]').forEach((card) => {
    const siteUrl = card.dataset.link;
    if (!siteUrl) return; // no live link yet — keep the manual placeholder image

    const img = card.querySelector('.project-card__thumb');
    if (!img) return;

    const fallbackSrc = img.getAttribute('src');
    const previewUrl = buildAutoPreviewUrl(siteUrl);

    // If the live screenshot fails to load, revert to the manual placeholder
    img.addEventListener('error', () => { img.src = fallbackSrc; }, { once: true });

    img.src = previewUrl;
    card.dataset.thumb = previewUrl; // keeps the lightbox in sync with the live screenshot
  });

  /* ---------- 11. Dark mode toggle ---------- */
  const THEME_STORAGE_KEY = 'nc-portfolio-theme';
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function setThemeToggleState(theme) {
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  // The inline script in <head> already set data-theme before paint —
  // just sync the button's state to match on load.
  setThemeToggleState(root.getAttribute('data-theme') || 'light');

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    setThemeToggleState(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {
      /* localStorage unavailable — theme just won't persist across visits */
    }
  });
});