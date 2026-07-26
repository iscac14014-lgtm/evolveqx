const HERO_IMAGES = [
  "assets/images/house1.jpeg",
  "assets/images/house2.jpg",
  "assets/images/house3.jpg",
  "assets/images/house4.jpg"
];

const AIRBNB_LISTING_BASE_URL = "https://www.airbnb.pt/rooms/1161668466079419067";

const App = (() => {
  const state = {
    heroIndex: 0,
    heroInterval: null
  };

  const els = {
    navbar: document.querySelector(".navbar"),
    navToggle: document.querySelector(".nav-toggle"),
    navMenu: document.querySelector(".nav-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    heroSlides: document.querySelectorAll(".hero-slide"),
    heroDots: document.querySelectorAll(".dot"),
    prevArrow: document.querySelector(".carousel-arrow.prev"),
    nextArrow: document.querySelector(".carousel-arrow.next"),
    scrollTop: document.getElementById("scroll-top"),
    animatedItems: document.querySelectorAll(".animate-on-scroll"),
    lazyImages: document.querySelectorAll(".lazy-image"),
    galleryItems: document.querySelectorAll(".gallery-item"),
    lightbox: document.getElementById("lightbox"),
    lightboxImg: document.querySelector(".lightbox img"),
    lightboxClose: document.querySelector(".lightbox-close"),
    airbnbBookingForm: document.getElementById("airbnb-booking-form"),
    airbnbCheckin: document.getElementById("airbnb-checkin"),
    airbnbCheckout: document.getElementById("airbnb-checkout"),
    airbnbAdults: document.getElementById("airbnb-adults"),
    airbnbFeedback: document.getElementById("airbnb-feedback"),
    contactForm: document.getElementById("contact-form"),
    contactFeedback: document.getElementById("contact-feedback")
  };

  const init = () => {
    initLucide();
    initNavbar();
    initSmoothScroll();
    initHeroCarousel();
    initScrollAnimations();
    initLazyLoading();
    initGalleryLightbox();
    initAirbnbBooking();
    initContactForm();
    initScrollTop();
    initGlobalKeyboardShortcuts();
  };

  const initLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const initNavbar = () => {
    const toggleScrolled = () => {
      els.navbar.classList.toggle("scrolled", window.scrollY > 36);
    };

    toggleScrolled();
    window.addEventListener("scroll", toggleScrolled, { passive: true });

    els.navToggle?.addEventListener("click", () => {
      const isOpen = els.navMenu.classList.toggle("open");
      els.navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    const sections = [...document.querySelectorAll("main section, header")];
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.getAttribute("id");
          if (!id) {
            return;
          }

          els.navLinks.forEach(link => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", active);
          });
        });
      },
      { threshold: 0.55 }
    );

    sections.forEach(section => sectionObserver.observe(section));

    els.navLinks.forEach(link => {
      link.addEventListener("click", () => {
        els.navMenu.classList.remove("open");
        els.navToggle.setAttribute("aria-expanded", "false");
      });
    });
  };

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", event => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
          return;
        }

        event.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      });
    });
  };

  const initHeroCarousel = () => {
    els.heroSlides.forEach((slide, index) => {
      slide.style.backgroundImage = `url(${HERO_IMAGES[index]})`;
    });

    const updateHero = index => {
      state.heroIndex = (index + HERO_IMAGES.length) % HERO_IMAGES.length;

      els.heroSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === state.heroIndex);
      });

      els.heroDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === state.heroIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const restartAutoPlay = () => {
      clearInterval(state.heroInterval);
      state.heroInterval = setInterval(() => {
        updateHero(state.heroIndex + 1);
      }, 6000);
    };

    els.prevArrow.addEventListener("click", () => {
      updateHero(state.heroIndex - 1);
      restartAutoPlay();
    });

    els.nextArrow.addEventListener("click", () => {
      updateHero(state.heroIndex + 1);
      restartAutoPlay();
    });

    els.heroDots.forEach(dot => {
      dot.addEventListener("click", () => {
        updateHero(Number(dot.dataset.slide));
        restartAutoPlay();
      });
    });

    updateHero(0);
    restartAutoPlay();
  };

  const initScrollAnimations = () => {
    const animationObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            animationObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    els.animatedItems.forEach(item => animationObserver.observe(item));
  };

  const initLazyLoading = () => {
    const imageObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          const img = entry.target;
          const source = img.dataset.src;
          if (source) {
            img.src = source;
            img.removeAttribute("data-src");
          }

          imageObserver.unobserve(img);
        });
      },
      { rootMargin: "150px" }
    );

    els.lazyImages.forEach(image => imageObserver.observe(image));
  };

  const initGalleryLightbox = () => {
    const openLightbox = imageSrc => {
      els.lightboxImg.src = imageSrc;
      els.lightbox.classList.add("open");
      els.lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      els.lightbox.classList.remove("open");
      els.lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    els.galleryItems.forEach(item => {
      item.addEventListener("click", () => openLightbox(item.dataset.full));
    });

    els.lightboxClose.addEventListener("click", closeLightbox);
    els.lightbox.addEventListener("click", event => {
      if (event.target === els.lightbox) {
        closeLightbox();
      }
    });
  };

  const initAirbnbBooking = () => {
    if (!els.airbnbBookingForm) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    els.airbnbCheckin.min = today;
    els.airbnbCheckout.min = today;

    els.airbnbCheckin.addEventListener("change", () => {
      const checkin = els.airbnbCheckin.value;
      els.airbnbCheckout.min = checkin || today;

      if (els.airbnbCheckout.value && checkin && els.airbnbCheckout.value <= checkin) {
        els.airbnbCheckout.value = "";
      }
    });

    els.airbnbBookingForm.addEventListener("submit", event => {
      event.preventDefault();

      const checkIn = els.airbnbCheckin.value;
      const checkOut = els.airbnbCheckout.value;
      const adults = els.airbnbAdults.value || "1";

      if (!checkIn || !checkOut) {
        els.airbnbFeedback.textContent = "Selecione check-in e check-out para continuar.";
        return;
      }

      if (checkOut <= checkIn) {
        els.airbnbFeedback.textContent = "A data de check-out deve ser posterior ao check-in.";
        return;
      }

      const airbnbUrl = new URL(AIRBNB_LISTING_BASE_URL);
      airbnbUrl.searchParams.set("search_mode", "regular_search");
      airbnbUrl.searchParams.set("adults", adults);
      airbnbUrl.searchParams.set("check_in", checkIn);
      airbnbUrl.searchParams.set("check_out", checkOut);
      airbnbUrl.searchParams.set("children", "0");
      airbnbUrl.searchParams.set("infants", "0");
      airbnbUrl.searchParams.set("pets", "0");

      els.airbnbFeedback.textContent = "A abrir disponibilidade no Airbnb...";
      window.open(airbnbUrl.toString(), "_blank", "noopener,noreferrer");
    });
  };

  const initContactForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    els.contactForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = els.contactForm.name.value.trim();
      const email = els.contactForm.email.value.trim();
      const phone = els.contactForm.phone.value.trim();
      const message = els.contactForm.message.value.trim();

      if (!name || !email || !phone || !message) {
        els.contactFeedback.textContent = "Preencha todos os campos obrigatorios.";
        return;
      }

      if (!emailPattern.test(email)) {
        els.contactFeedback.textContent = "Introduza um email valido.";
        return;
      }

      els.contactFeedback.textContent = "Mensagem enviada com sucesso. Responderemos brevemente.";
      els.contactForm.reset();
    });
  };

  const initScrollTop = () => {
    const toggleButton = () => {
      els.scrollTop.classList.toggle("show", window.scrollY > 500);
    };

    toggleButton();
    window.addEventListener("scroll", toggleButton, { passive: true });

    els.scrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const initGlobalKeyboardShortcuts = () => {
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        els.lightbox.classList.remove("open");
        els.lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
