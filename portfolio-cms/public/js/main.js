(function () {
  const preloader = document.querySelector('.preloader');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  window.addEventListener('load', () => {
    if (preloader) setTimeout(() => preloader.classList.add('hide'), 350);
    document.querySelectorAll('.skill-fill').forEach((el) => {
      el.style.width = (el.dataset.value || 0) + '%';
    });
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    }));
  }

  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('[data-gsap="fade-up"]').forEach((el) => {
      gsap.from(el, {
        y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      gsap.from(heroTitle, { y: 40, opacity: 0, duration: 1.1, delay: 0.15, ease: 'power3.out' });
    }
    const heroLead = document.querySelector('.hero-lead');
    if (heroLead) {
      gsap.from(heroLead, { y: 24, opacity: 0, duration: 1, delay: 0.35, ease: 'power3.out' });
    }
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      gsap.from(heroActions, { y: 18, opacity: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' });
    }
  }

  // Counter animation for stats
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current = Math.min(target, current + step);
          el.textContent = current + suffix;
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => io.observe(el));
  }
})();
