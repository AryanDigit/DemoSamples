(() => {
  const CART_KEY = "liora_cart";
  const WISH_KEY = "liora_wishlist";
  const ORDERS_KEY = "liora_orders";

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const store = {
    getCart: () => read(CART_KEY, []),
    setCart: (items) => {
      write(CART_KEY, items);
      updateBadges();
    },
    getWish: () => read(WISH_KEY, []),
    setWish: (ids) => {
      write(WISH_KEY, ids);
      updateBadges();
    },
    getOrders: () => read(ORDERS_KEY, []),
    addOrder: (order) => {
      const orders = read(ORDERS_KEY, []);
      orders.unshift(order);
      write(ORDERS_KEY, orders);
    },
  };

  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function updateBadges() {
    const cartCount = store.getCart().reduce((n, i) => n + i.qty, 0);
    const wishCount = store.getWish().length;
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = cartCount;
      el.hidden = cartCount === 0;
    });
    document.querySelectorAll("[data-wish-count]").forEach((el) => {
      el.textContent = wishCount;
      el.hidden = wishCount === 0;
    });
  }

  function addToCart(productId, opts = {}) {
    const product = window.getProduct(productId);
    if (!product) return;
    const cart = store.getCart();
    const key = JSON.stringify({
      id: productId,
      engraving: opts.engraving || "",
      message: opts.message || "",
      wrap: !!opts.wrap,
      card: !!opts.card,
    });
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += opts.qty || 1;
    else {
      cart.push({
        key,
        id: productId,
        qty: opts.qty || 1,
        engraving: opts.engraving || "",
        message: opts.message || "",
        wrap: !!opts.wrap,
        card: !!opts.card,
        unitPrice: product.price + (opts.wrap ? 99 : 0) + (opts.card ? 49 : 0),
      });
    }
    store.setCart(cart);
    toast("Added to cart");
  }

  function toggleWish(productId) {
    const wish = store.getWish();
    const i = wish.indexOf(productId);
    if (i >= 0) wish.splice(i, 1);
    else wish.push(productId);
    store.setWish(wish);
    toast(i >= 0 ? "Removed from wishlist" : "Saved to wishlist");
    return wish.includes(productId);
  }

  function productCardHTML(p) {
    const wished = store.getWish().includes(p.id);
    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-media">
          <a href="product.html?id=${p.id}">
            <img class="primary" src="${p.images[0]}" alt="${p.name}" loading="lazy" width="600" height="750" />
            <img class="secondary" src="${p.images[1] || p.images[0]}" alt="" loading="lazy" width="600" height="750" />
          </a>
          <div class="product-actions">
            <button class="icon-btn ${wished ? "active" : ""}" type="button" data-wish="${p.id}" aria-label="Wishlist" title="Wishlist">♥</button>
            <button class="icon-btn" type="button" data-quick-add="${p.id}" aria-label="Add to cart" title="Add to cart">+</button>
          </div>
        </div>
        ${p.personalizable ? '<span class="pill">Personalizable</span>' : ""}
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="price">${window.formatINR(p.price)}${p.compareAt ? ` <s>${window.formatINR(p.compareAt)}</s>` : ""}</p>
      </article>`;
  }

  function renderProductGrid(selector, products) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = products.map(productCardHTML).join("") || `<div class="empty"><h2>No gifts found</h2><p class="muted">Try adjusting filters.</p></div>`;
  }

  function bindProductActions(root = document) {
    root.addEventListener("click", (e) => {
      const wishBtn = e.target.closest("[data-wish]");
      if (wishBtn) {
        const active = toggleWish(wishBtn.dataset.wish);
        wishBtn.classList.toggle("active", active);
      }
      const addBtn = e.target.closest("[data-quick-add]");
      if (addBtn) addToCart(addBtn.dataset.quickAdd);
    });
  }

  function initSearch() {
    const input = document.querySelector("[data-search]");
    const box = document.querySelector("[data-search-suggestions]");
    if (!input || !box) return;
    const show = (q) => {
      const query = q.trim().toLowerCase();
      if (!query) {
        box.classList.remove("open");
        box.innerHTML = "";
        return;
      }
      const hits = window.LIORA_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.occasions.some((o) => o.toLowerCase().includes(query))
      ).slice(0, 6);
      box.innerHTML = hits.length
        ? hits.map((p) => `<a href="product.html?id=${p.id}">${p.name} · ${window.formatINR(p.price)}</a>`).join("")
        : `<a href="shop.html">No matches — browse shop</a>`;
      box.classList.add("open");
    };
    input.addEventListener("input", () => show(input.value));
    input.addEventListener("focus", () => show(input.value));
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) box.classList.remove("open");
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  function initMobileNav() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const links = document.querySelector("[data-nav-links]");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  function markActiveNav() {
    const page = (location.pathname.split("/").pop() || "index.html").replace(/^\//, "") || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
    });
  }

  function cartSubtotal(items = store.getCart()) {
    return items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }

  function shippingFor(subtotal) {
    return subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  }

  // Expose API
  window.Liora = {
    store,
    toast,
    addToCart,
    toggleWish,
    productCardHTML,
    renderProductGrid,
    bindProductActions,
    cartSubtotal,
    shippingFor,
    updateBadges,
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateBadges();
    bindProductActions();
    initSearch();
    initReveal();
    initMobileNav();
    markActiveNav();
  });
})();
