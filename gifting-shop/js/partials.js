(() => {
  const WhatsApp = "https://wa.me/919876543210?text=Hi%20Liora%2C%20I%20need%20help%20with%20a%20gift";

  function headerHTML() {
    return `
    <div class="topbar">Complimentary gift wrap on orders above ₹1,999 · Scheduled delivery available</div>
    <header class="site-header">
      <div class="container nav">
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Menu">☰</button>
        <a class="logo" href="index.html">Liora</a>
        <nav>
          <ul class="nav-links" data-nav-links>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="shop.html?occasion=Birthday">Occasions</a></li>
            <li><a href="corporate.html">Corporate</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="blog.html">Journal</a></li>
            <li><a href="contact.html">Support</a></li>
          </ul>
        </nav>
        <div class="nav-actions">
          <div class="search-wrap">
            <label class="sr-only" for="site-search">Search gifts</label>
            <input id="site-search" type="search" placeholder="Search gifts…" data-search autocomplete="off" />
            <div class="search-suggestions" data-search-suggestions></div>
          </div>
          <a class="nav-icon-wrap icon-btn" href="wishlist.html" aria-label="Wishlist">♥<span class="badge-count" data-wish-count hidden>0</span></a>
          <a class="nav-icon-wrap icon-btn" href="cart.html" aria-label="Cart">bag<span class="badge-count" data-cart-count hidden>0</span></a>
        </div>
      </div>
    </header>`;
  }

  function footerHTML() {
    return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="logo" href="index.html">Liora</a>
          <p style="margin-top:0.75rem;max-width:28ch">Curated gifts for the moments that matter — wrapped with care, delivered on time.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html">All gifts</a></li>
            <li><a href="shop.html?occasion=Weddings">Weddings</a></li>
            <li><a href="shop.html?occasion=Festive">Festive</a></li>
            <li><a href="shop.html?personalizable=1">Personalized</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">Our story</a></li>
            <li><a href="corporate.html">Corporate gifting</a></li>
            <li><a href="blog.html">Journal</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="contact.html#faq">Shipping & returns</a></li>
            <li><a href="track.html">Track order</a></li>
            <li><a href="${WhatsApp}" target="_blank" rel="noopener">WhatsApp support</a></li>
            <li><a href="mailto:hello@liora.gifts">hello@liora.gifts</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} Liora Gifts · Demo storefront</span>
        <span>Secure checkout · SSL ready · Cards, UPI, wallets, COD</span>
      </div>
    </footer>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const headerMount = document.querySelector("[data-header]");
    const footerMount = document.querySelector("[data-footer]");
    if (headerMount) headerMount.innerHTML = headerHTML();
    if (footerMount) footerMount.innerHTML = footerHTML();
  });
})();
