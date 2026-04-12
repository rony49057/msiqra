document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const navbar = document.querySelector(".navbar");
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryDots = document.getElementById("galleryDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const cursorGlow = document.querySelector(".cursor-glow");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  const revealItems = document.querySelectorAll(".reveal");

  const galleryImages = [
    "images/gallery-1.jpg",
    "images/gallery-2.jpg",
    "images/gallery-3.jpg",
    "images/gallery-4.jpg",
    "images/gallery-5.jpg",
    "images/gallery-6.jpg",
     "images/gallery-7.jpg",
      "images/gallery-8.jpg",
  ];

  let currentSlide = 0;
  let autoSlide;

  // Theme
  const savedTheme = localStorage.getItem("msiqra-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem(
        "msiqra-theme",
        body.classList.contains("dark") ? "dark" : "light"
      );
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.innerHTML = body.classList.contains("dark")
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  // Mobile menu
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });
  }

  // Navbar shadow on scroll
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // Active nav
  function setActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentId = section.getAttribute("id");
      }
    });

    navAnchors.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  // Cursor glow
  if (cursorGlow && window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // Contact form
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formMessage) {
        formMessage.textContent = "Message sent successfully.";
      }
      form.reset();
    });
  }

  // Gallery render
  function renderGallery() {
    if (!galleryTrack || !galleryDots) return;

    galleryTrack.innerHTML = galleryImages
      .map(
        (src, index) => `
          <div class="gallery-slide">
            <img src="${src}" alt="Gallery image ${index + 1}" data-index="${index}" />
            <div class="gallery-caption">Project Image ${index + 1}</div>
          </div>
        `
      )
      .join("");

    galleryDots.innerHTML = galleryImages
      .map(
        (_, index) =>
          `<button class="${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`
      )
      .join("");

    updateSlider();
  }

  function updateSlider() {
    if (!galleryTrack || !galleryDots) return;

    galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    const dots = galleryDots.querySelectorAll("button");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % galleryImages.length;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
    updateSlider();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(nextSlide, 3500);
  }

  function stopAutoSlide() {
    if (autoSlide) {
      clearInterval(autoSlide);
    }
  }

  if (galleryTrack && galleryDots) {
    renderGallery();
    startAutoSlide();

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
    }

    galleryDots.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;
      currentSlide = Number(btn.dataset.index);
      updateSlider();
      startAutoSlide();
    });

    galleryTrack.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      openLightbox(img.src);
    });
  }

  // Lightbox
  function openLightbox(src) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.classList.add("show");
    body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("show");
    lightboxImage.src = "";
    body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  // Pause slideshow when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });
});

// Footer year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}