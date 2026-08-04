/* Giftora Premium — shared demo interactions */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Preloader
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) setTimeout(() => pre.classList.add('hide'), 400);
  });

  // AOS
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60 });

  // Swipers
  if (window.Swiper) {
    if ($('.hero-swiper')) {
      new Swiper('.hero-swiper', {
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
        navigation: { nextEl: '.hero-swiper .swiper-button-next', prevEl: '.hero-swiper .swiper-button-prev' },
        effect: 'fade',
        fadeEffect: { crossFade: true },
      });
    }
    if ($('.testimonial-swiper')) {
      new Swiper('.testimonial-swiper', {
        loop: true,
        autoplay: { delay: 5000 },
        pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 24,
        breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } },
      });
    }
    if ($('.brand-swiper')) {
      new Swiper('.brand-swiper', {
        loop: true,
        autoplay: { delay: 2500 },
        slidesPerView: 2,
        spaceBetween: 24,
        breakpoints: { 576: { slidesPerView: 3 }, 992: { slidesPerView: 5 } },
      });
    }
  }

  // Sticky visual polish
  const header = $('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
    const topBtn = $('#backToTop');
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#backToTop')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Ripple buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = e.clientX - rect.left - size / 2 + 'px';
    circle.style.top = e.clientY - rect.top - size / 2 + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });

  // Cart / wishlist (demo)
  const storageKey = 'giftora-cart-' + (document.body.className.match(/demo-[\w-]+/) || ['demo'])[0];
  const wishKey = storageKey + '-wish';
  let cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
  let wish = JSON.parse(localStorage.getItem(wishKey) || '[]');

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    localStorage.setItem(wishKey, JSON.stringify(wish));
    renderCart();
  };

  const money = (n) => '$' + Number(n).toFixed(0);

  function renderCart() {
    $$('[data-cart-count]').forEach((el) => { el.textContent = cart.reduce((s, i) => s + i.qty, 0); });
    $$('[data-wish-count]').forEach((el) => { el.textContent = wish.length; });
    const box = $('[data-cart-items]');
    const total = $('[data-cart-total]');
    if (!box) return;
    if (!cart.length) {
      box.innerHTML = '<p class="empty-cart">Your gift bag is empty — find something lovely.</p>';
      if (total) total.textContent = '$0';
      return;
    }
    box.innerHTML = cart.map((i, idx) => `
      <div class="cart-line">
        <div><strong>${i.name}</strong><div>${money(i.price)} × ${i.qty}</div></div>
        <button type="button" aria-label="Remove" data-remove-cart="${idx}">&times;</button>
      </div>`).join('');
    if (total) total.textContent = money(cart.reduce((s, i) => s + i.price * i.qty, 0));
  }

  function openCart(open = true) {
    $('#cartDrawer')?.classList.toggle('open', open);
    $('.cart-overlay')?.classList.toggle('open', open);
    $('#cartDrawer')?.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-toggle]')) openCart(true);
    if (e.target.closest('[data-cart-close]')) openCart(false);

    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      const card = addBtn.closest('[data-product-id], .product-detail, body');
      const name = addBtn.dataset.name || card?.dataset?.name || $('.product-title', card)?.textContent?.trim() || 'Gift Item';
      const price = Number(addBtn.dataset.price || card?.dataset?.price || 49);
      const existing = cart.find((i) => i.name === name);
      if (existing) existing.qty += 1;
      else cart.push({ name, price, qty: 1 });
      save();
      openCart(true);
    }

    const wishBtn = e.target.closest('[data-add-wish], [data-wishlist]');
    if (wishBtn && wishBtn.hasAttribute('data-add-wish')) {
      const card = wishBtn.closest('[data-product-id]');
      const name = card?.dataset?.name || 'Gift';
      if (!wish.includes(name)) wish.push(name);
      save();
      wishBtn.querySelector('i')?.classList.replace('fa-regular', 'fa-solid');
    }

    const rm = e.target.closest('[data-remove-cart]');
    if (rm) {
      cart.splice(Number(rm.dataset.removeCart), 1);
      save();
    }

    const qv = e.target.closest('[data-quick-view]');
    if (qv) {
      const card = qv.closest('[data-product-id]');
      const body = $('[data-qv-body]');
      if (card && body && window.bootstrap) {
        body.innerHTML = `
          <div class="row g-3">
            <div class="col-md-5"><img src="${card.querySelector('img')?.src || ''}" alt="" class="img-fluid rounded"></div>
            <div class="col-md-7">
              <h3>${card.dataset.name}</h3>
              <p class="price">${money(card.dataset.price)}</p>
              <p>Quick preview of this Giftora demo product. Add to bag to try the cart UI.</p>
              <button class="btn btn-primary" data-add-cart data-name="${card.dataset.name}" data-price="${card.dataset.price}">Add to Cart</button>
            </div>
          </div>`;
        new bootstrap.Modal('#quickViewModal').show();
      }
    }

    const thumb = e.target.closest('[data-thumb]');
    if (thumb) {
      const main = $('#mainProductImg');
      if (main) main.src = thumb.dataset.thumb;
    }
  });

  renderCart();

  // Countdown
  $$('[data-countdown]').forEach((el) => {
    const end = new Date(el.dataset.countdown).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const set = (sel, val) => { const n = $(sel, el); if (n) n.textContent = String(val).padStart(2, '0'); };
      set('[data-days]', d); set('[data-hours]', h); set('[data-mins]', m); set('[data-secs]', s);
    };
    tick();
    setInterval(tick, 1000);
  });

  // Newsletter / contact demo submit
  $$('[data-newsletter], [data-contact]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! This is a demo form — connect your backend or form service to go live.');
      form.reset();
    });
  });

  // Fest chips (visual only)
  $$('.fest-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      $$('.fest-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
})();
