const HERO_IMAGES = [
  "assets/images/house1.jpeg",
  "assets/images/house2.jpg",
  "assets/images/house3.jpg",
  "assets/images/house4.jpg"
];

const App = (() => {
  const state = {
    heroIndex: 0,
    heroInterval: null,
    calendarDate: new Date(),
    checkIn: null,
    checkOut: null,
    renderCalendar: null
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
    calendarMonth: document.getElementById("calendar-month"),
    calendarDays: document.getElementById("calendar-days"),
    prevMonth: document.getElementById("prev-month"),
    nextMonth: document.getElementById("next-month"),
    arrivalDate: document.getElementById("arrival-date"),
    departureDate: document.getElementById("departure-date"),
    bookingForm: document.getElementById("booking-form"),
    bookingFeedback: document.getElementById("booking-feedback"),
    reservationModal: document.getElementById("reservation-modal"),
    closeModal: document.getElementById("close-modal"),
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
    initCalendar();
    initBookingForm();
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

  const initCalendar = () => {
    const isSameDay = (d1, d2) =>
      d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    const normalizeDate = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = normalizeDate(new Date());

    const formatDate = date =>
      new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(date);

    const renderCalendar = () => {
      const year = state.calendarDate.getFullYear();
      const month = state.calendarDate.getMonth();

      const monthLabel = new Intl.DateTimeFormat("pt-PT", {
        month: "long",
        year: "numeric"
      }).format(new Date(year, month, 1));

      els.calendarMonth.textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
      els.calendarDays.innerHTML = "";

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const dayOffset = (firstDay.getDay() + 6) % 7;
      const totalDays = lastDay.getDate();

      for (let i = 0; i < dayOffset; i += 1) {
        const empty = document.createElement("span");
        empty.className = "empty-day";
        els.calendarDays.appendChild(empty);
      }

      for (let day = 1; day <= totalDays; day += 1) {
        const date = new Date(year, month, day);
        const dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.className = "day";
        dayButton.textContent = String(day);
        dayButton.setAttribute("role", "gridcell");
        dayButton.setAttribute("aria-label", formatDate(date));

        const isPast = normalizeDate(date) < today;
        if (isPast) {
          dayButton.classList.add("disabled");
          dayButton.disabled = true;
        }

        const inRange = state.checkIn && state.checkOut && date > state.checkIn && date < state.checkOut;
        if (inRange) {
          dayButton.classList.add("in-range");
        }

        if (isSameDay(date, state.checkIn) || isSameDay(date, state.checkOut)) {
          dayButton.classList.add("selected");
          dayButton.classList.add("range-edge");
        }

        dayButton.addEventListener("click", () => selectDate(date));
        els.calendarDays.appendChild(dayButton);
      }
    };

    const selectDate = date => {
      if (!state.checkIn || (state.checkIn && state.checkOut)) {
        state.checkIn = date;
        state.checkOut = null;
      } else if (date < state.checkIn) {
        state.checkOut = state.checkIn;
        state.checkIn = date;
      } else if (isSameDay(date, state.checkIn)) {
        state.checkOut = null;
      } else {
        state.checkOut = date;
      }

      els.arrivalDate.value = state.checkIn ? formatDate(state.checkIn) : "";
      els.departureDate.value = state.checkOut ? formatDate(state.checkOut) : "";
      renderCalendar();
    };

    els.prevMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      renderCalendar();
    });

    els.nextMonth.addEventListener("click", () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      renderCalendar();
    });

    state.renderCalendar = renderCalendar;
    renderCalendar();
  };

  const initBookingForm = () => {
    const openModal = () => {
      els.reservationModal.classList.add("open");
      els.reservationModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      els.reservationModal.classList.remove("open");
      els.reservationModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    els.closeModal.addEventListener("click", closeModal);
    els.reservationModal.addEventListener("click", event => {
      if (event.target === els.reservationModal) {
        closeModal();
      }
    });

    els.bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      const guests = els.bookingForm.guests.value;

      if (!state.checkIn || !state.checkOut) {
        els.bookingFeedback.textContent = "Selecione data de chegada e partida para continuar.";
        return;
      }

      if (!guests) {
        els.bookingFeedback.textContent = "Selecione o numero de hospedes.";
        return;
      }

      els.bookingFeedback.textContent = "";
      openModal();
      els.bookingForm.reset();
      state.checkIn = null;
      state.checkOut = null;
      els.arrivalDate.value = "";
      els.departureDate.value = "";
      if (typeof state.renderCalendar === "function") {
        state.renderCalendar();
      }
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
        els.reservationModal.classList.remove("open");
        els.reservationModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
