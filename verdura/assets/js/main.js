(() => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Seasonal demo chips
  document.querySelectorAll("[data-season-switch]").forEach((root) => {
    const chips = root.querySelectorAll(".season-chip");
    const title = root.querySelector("[data-season-title]");
    const copy = root.querySelector("[data-season-copy]");
    const data = {
      spring: {
        title: "Spring greens & early roots",
        copy: "Asparagus, peas, spring onions, and baby leafy mixes ready for chilled export.",
      },
      summer: {
        title: "Peak summer harvest",
        copy: "Tomatoes, peppers, cucumbers, and courgettes in volume for retail and foodservice.",
      },
      autumn: {
        title: "Autumn storage crops",
        copy: "Pumpkins, squash, carrots, and brassicas built for longer cold-chain runs.",
      },
      winter: {
        title: "Winter greenhouse lines",
        copy: "Controlled-environment leafy greens and specialty herbs for year-round supply.",
      },
    };
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const key = chip.dataset.season;
        if (data[key] && title && copy) {
          title.textContent = data[key].title;
          copy.textContent = data[key].copy;
        }
      });
    });
  });

  // Simple contact form feedback
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.textContent = "Request received";
        btn.disabled = true;
      }
      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.textContent = original;
          btn.disabled = false;
        }
      }, 1800);
    });
  });
})();
