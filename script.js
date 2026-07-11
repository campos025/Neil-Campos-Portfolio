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
});
