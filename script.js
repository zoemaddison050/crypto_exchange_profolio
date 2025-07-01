document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".header__menu-toggle");
  const navMenu = document.querySelector(".header__menu");
  const menuItems = document.querySelectorAll(".header__menu-item a");

  function openMenu() {
    hamburger.classList.add("active");
    navMenu.classList.add("active");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
    navMenu.setAttribute("aria-hidden", "false");
    if (menuItems.length > 0) {
      menuItems[0].focus();
    }
  }

  function closeMenu(returnFocus = true) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
    navMenu.setAttribute("aria-hidden", "true");
    if (returnFocus) {
      hamburger.focus();
    }
  }

  hamburger.setAttribute("aria-controls", "main-nav-menu");
  hamburger.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("id", "main-nav-menu");
  navMenu.setAttribute("aria-hidden", "true");

  hamburger.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Remove previous handler for .header__menu-item
  // Add new handler for .header__menu-item a with delay
  document.querySelectorAll(".header__menu-item a").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        closeMenu(false);
      }, 300);
    });
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      // Check if the target element exists before scrolling
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Add fade-in animation on scroll
  // Assuming elements to fade have the class 'fade-in'
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((el) => observer.observe(el));

  // Added functionality for the testimonial carousel
  let currentSlide = 0;
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevButton = document.querySelector(".prev-slide");
  const nextButton = document.querySelector(".next-slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "flex" : "none"; // Use flex for layout
      slide.setAttribute("aria-hidden", i !== index); // Add aria-hidden for accessibility
    });
    // Update aria-label for current slide
    if (slides[index]) {
      slides[index].setAttribute(
        "aria-label",
        `Testimonial ${index + 1} of ${slides.length}`
      );
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Initialize the first slide if slides exist
  if (slides.length > 0) {
    showSlide(currentSlide);
  }

  if (prevButton) {
    prevButton.addEventListener("click", prevSlide);
  }
  if (nextButton) {
    nextButton.addEventListener("click", nextSlide);
  }

  // Ensure the top__bar element scrolls the page back to the top
  const topBar = document.querySelector(".top__bar-link");
  if (topBar) {
    topBar.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Make Home link scroll to top like the top bar
  const homeLink = document.querySelector('.header__menu-item a[href="#home"]');
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const darkModeToggle = document.getElementById("darkModeToggle");
  const resetSystemMode = document.getElementById("resetSystemMode");
  const body = document.body;
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

  // Helper to apply theme
  function applyTheme(theme) {
    body.classList.remove("dark-mode", "light-mode");
    if (theme === "dark-mode") {
      body.classList.add("dark-mode");
    } else if (theme === "light-mode") {
      body.classList.add("light-mode");
    }
  }

  // System preference listener (only active if no manual preference)
  let systemListener = null;
  function addSystemListener() {
    if (systemListener) return;
    systemListener = (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark-mode" : "light-mode");
      }
    };
    prefersDarkMode.addEventListener("change", systemListener);
  }
  function removeSystemListener() {
    if (systemListener) {
      prefersDarkMode.removeEventListener("change", systemListener);
      systemListener = null;
    }
  }

  // On load: check for saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-mode" || savedTheme === "light-mode") {
    applyTheme(savedTheme);
    removeSystemListener();
  } else {
    applyTheme(prefersDarkMode.matches ? "dark-mode" : "light-mode");
    addSystemListener();
  }

  // Toggle dark mode on button click
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = !body.classList.contains("dark-mode"); // what we're toggling to
      applyTheme(isDark ? "dark-mode" : "light-mode");
      localStorage.setItem("theme", isDark ? "dark-mode" : "light-mode");
      removeSystemListener(); // User's choice takes precedence
      if (isDark) {
        console.log("Switched to dark mode");
      } else {
        console.log("Switched to light mode");
      }
    });
  }

  // Reset to system preference on button click
  if (resetSystemMode) {
    resetSystemMode.addEventListener("click", () => {
      localStorage.removeItem("theme");
      applyTheme(prefersDarkMode.matches ? "dark-mode" : "light-mode");
      addSystemListener();
    });
  }

  // Remove custom AJAX contact form logic and restore hCaptcha integration (handled by backend or Web3Forms)
  // No custom JS for contact form needed if using hCaptcha and Web3Forms
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const resultDiv = document.getElementById("result");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading animation
    resultDiv.innerHTML = `
      <div class="form-message">
        <span class="loader"></span>
        Sending...
      </div>
    `;

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          resultDiv.innerHTML = `<div class="form-message form-success">Thank you! Your message has been sent successfully.</div>`;
          form.reset();
        } else {
          // Always show a generic error message, hiding the original error
          resultDiv.innerHTML = `<div class="form-message form-error">Oops! An error was encountered. Please try again later.</div>`;
        }
      })
      .catch(() => {
        resultDiv.innerHTML = `<div class="form-message form-error">Oops! An error was encountered. Please try again later.</div>`;
      });
  });
});
