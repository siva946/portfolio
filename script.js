let portfolioData = null;

document.addEventListener("DOMContentLoaded", async function () {
  emailjs.init(CONFIG.emailjs.userId);

  await loadPortfolioData();
  initializeApp();

  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 500);
});

async function loadPortfolioData() {
  try {
    const response = await fetch("./data.json");
    portfolioData = await response.json();
    renderExperience();
    renderProjects();
  } catch (error) {
    console.error("Error loading portfolio data:", error);
  }
}

function renderExperience() {
  const container = document.getElementById("experience-container");
  const experiences = portfolioData.experience;

  const slidesHTML = experiences.map((exp, i) => `
    <div class="exp-slide${i === 0 ? ' active' : ''}" role="tabpanel" aria-label="Experience ${i + 1} of ${experiences.length}">
      <div class="exp-card">
        <div class="exp-img-wrap">
          <img src="${exp.image}" alt="${exp.company}" loading="lazy">
        </div>
        <div class="exp-content">
          <span class="exp-company">${exp.company}</span>
          <p class="rolename">${exp.role}</p>
          <p class="roledesc">${exp.description}</p>
        </div>
      </div>
    </div>
  `).join('');

  const dotsHTML = experiences.map((_, i) => `
    <button class="exp-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>
  `).join('');

  container.innerHTML = `
    <div class="exp-carousel" id="exp-carousel" aria-roledescription="carousel" aria-label="Work Experience">
      <div class="exp-track-wrapper">
        <div class="exp-track" id="exp-track">
          ${slidesHTML}
        </div>
      </div>
      <button class="exp-nav exp-prev" id="exp-prev" aria-label="Previous experience">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button class="exp-nav exp-next" id="exp-next" aria-label="Next experience">
        <i class="bi bi-chevron-right"></i>
      </button>
      <div class="exp-dots" id="exp-dots" role="tablist" aria-label="Experience slides">
        ${dotsHTML}
      </div>
      <div class="exp-counter">
        <span id="exp-current">1</span> / <span id="exp-total">${experiences.length}</span>
      </div>
    </div>
  `;

  initExperienceCarousel();
}

function initExperienceCarousel() {
  const track = document.getElementById('exp-track');
  const slides = track ? track.querySelectorAll('.exp-slide') : [];
  const prevBtn = document.getElementById('exp-prev');
  const nextBtn = document.getElementById('exp-next');
  const dotsContainer = document.getElementById('exp-dots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.exp-dot') : [];
  const currentEl = document.getElementById('exp-current');
  const carousel = document.getElementById('exp-carousel');

  if (!slides.length) return;

  let current = 0;
  let autoPlayTimer = null;
  const INTERVAL = 4000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    if (currentEl) currentEl.textContent = current + 1;
  }

  function startAuto() {
    stopAuto();
    autoPlayTimer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function stopAuto() {
    if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index)); startAuto(); });
  });

  // Pause on hover
  carousel && carousel.addEventListener('mouseenter', stopAuto);
  carousel && carousel.addEventListener('mouseleave', startAuto);

  // Keyboard support
  carousel && carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  carousel && carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel && carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
}

function renderProjects() {
  const container = document.getElementById("projects-container");
  container.innerHTML = "";
  let row = null;

  portfolioData.projects.forEach((project, index) => {
    if (index % 3 === 0) {
      row = document.createElement("div");
      row.className = "row pro";
      container.appendChild(row);
    }

    const card = document.createElement("div");
    card.className = "card col";
    card.innerHTML = `
      <img src="${project.image}" class="card-img-top" alt="${
      project.title
    }" loading="lazy">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${project.title}</h5>
        <p class="card-text flex-grow-1">${project.description}</p>
        <div class="d-flex gap-2 mt-auto">
          <a href="${
            project.link
          }" target="_blank" class="button">${'<i class="bi bi-globe2"></i>'}</a>
          <a href="${
            project.github
          }" target="_blank" class="button">${'<i class="bi bi-github"></i>'}</a>
          <a href="${
            project.huggingface
          }" target="_blank" class="button">${'<a href="https://fontawesome.com/icons/face-smiling-hands?f=classic&s=regular"></a>'}</a>
        </div>
      </div>
    `;
    row.appendChild(card);
  });

  animateProjects();
}

function initializeApp() {
  const navlist = document.getElementById("navlist");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = themeToggleBtn.querySelector("i");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  mobileMenuBtn.addEventListener("click", () => {
    navlist.classList.toggle("show");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navlist.classList.remove("show");
    }
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || !savedTheme) {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    setTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    reloadParticles();
  });

  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill");
    } else {
      document.body.classList.remove("dark-mode");
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill");
    }
  }

  document
    .getElementById("contactForm")
    .addEventListener("submit", handleFormSubmit);

  initTypingAnimation();
  initScrollAnimations();
  initParticles();
  initNavbarScroll();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("number");
  const messageInput = document.getElementById("message");

  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  let isValid = true;

  if (!nameInput.value.trim()) {
    showError(nameInput, "Name is required");
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    showError(emailInput, "Email is required");
    isValid = false;
  } else if (
    !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailInput.value.trim())
  ) {
    showError(emailInput, "Please enter a valid email");
    isValid = false;
  }

  if (
    phoneInput.value.trim() &&
    !/^\+?\d{7,15}$/.test(phoneInput.value.trim())
  ) {
    showError(phoneInput, "Please enter a valid phone number");
    isValid = false;
  }

  if (!messageInput.value.trim()) {
    showError(messageInput, "Message is required");
    isValid = false;
  }

  if (isValid) {
    emailjs
      .sendForm(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, form)
      .then(
        () => {
          showToast(
            "Thank you for contacting us, " + nameInput.value.trim() + "!",
            "success"
          );
          form.reset();
        },
        (error) => {
          showToast("Failed to send message. Please try again later.", "error");
          console.error("EmailJS error:", error);
        }
      );
  }
}

function showError(inputElement, message) {
  const error = document.createElement("div");
  error.className = "error-message text-danger small mt-1";
  error.textContent = message;
  inputElement.parentNode.appendChild(error);
}

function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast-notification show ${type}`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function initTypingAnimation() {
  const texts = [
    " Full Stack Developer",
    " Web Developer",
    " Python Developer",
  ];
  let textIndex = 0;
  let charIndex = 0;
  const typedText = document.getElementById("typed-text");

  function type() {
    if (charIndex < texts[textIndex].length) {
      typedText.textContent += texts[textIndex][charIndex];
      charIndex++;
      setTimeout(type, 70);
    } else {
      setTimeout(erase, 1200);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedText.textContent = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 40);
    } else {
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 400);
    }
  }

  type();
}

function initScrollAnimations() {
  const sections = ["experience", "resume"];

  function checkInView() {
    sections.forEach((id) => {
      const section = document.getElementById(id);
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add(id === "resume" ? "visible1" : "visible");
      }
    });
  }

  window.addEventListener("scroll", checkInView);
  checkInView();
  animateProjects();
  animateContact();
}

function animateProjects() {
  const rows = document.querySelectorAll("#projects .pro");

  function checkProjectsInView() {
    rows.forEach((row, index) => {
      const rect = row.getBoundingClientRect();
      if (
        rect.top < window.innerHeight - 50 &&
        !row.classList.contains("animated")
      ) {
        row.classList.add(
          index % 2 === 0 ? "appear-left" : "appear-right",
          "animated"
        );
      }
    });
  }

  window.addEventListener("scroll", checkProjectsInView);
  checkProjectsInView();
}

function animateContact() {
  const contactSection = document.getElementById("contact");
  const contactCols = contactSection.querySelectorAll(".col-sm");

  function checkContactInView() {
    const rect = contactSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      if (contactCols[0])
        contactCols[0].classList.add("appear-left", "animated");
      if (contactCols[1])
        contactCols[1].classList.add("appear-right", "animated");
    }
  }

  window.addEventListener("scroll", checkContactInView);
  checkContactInView();
}

function initParticles() {
  const isDark = document.body.classList.contains("dark-mode");
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: isDark ? "#ffffff" : "#181825" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: isDark ? "#ffffff" : "#181825",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });
}

function reloadParticles() {
  const oldCanvas = document.querySelector("#particles-js > canvas");
  if (oldCanvas) oldCanvas.remove();
  setTimeout(initParticles, 100);
}

function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-small");
    } else {
      navbar.classList.remove("navbar-small");
    }
  });
}
