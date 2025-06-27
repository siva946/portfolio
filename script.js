(function(){
  emailjs.init("meg4J4AQQC2cLw0IZ"); // Replace with your EmailJS user ID
})();

document.addEventListener('DOMContentLoaded', function() {
  const navlist = document.getElementById('navlist');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn.querySelector('i');

  themeToggleBtn.addEventListener('click', function() {
    navlist.classList.toggle('show');
  });


  // Optional: Hide navList if window is resized above 730px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 730) {
      navlist.classList.remove('show');
    }
  });

  // Contact form submission handling
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear error messages
    const errorElements = contactForm.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());

    let isValid = true;

    // Validate name
    const nameInput = document.getElementById('name');
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Name is required');
      isValid = false;
    }

    // Validate email
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email');
      isValid = false;
    }

    // Validate phone number (optional)
    const phoneInput = document.getElementById('number');
    if (phoneInput.value.trim() !== '' && !validatePhone(phoneInput.value.trim())) {
      showError(phoneInput, 'Please enter a valid phone number');
      isValid = false;
    }

    // Validate message
    const messageInput = document.getElementById('message');
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Message is required');
      isValid = false;
    }
    console.log("Name:", nameInput.value);
console.log("Email:", emailInput.value);
console.log("Phone:", phoneInput.value);
console.log("Message:", messageInput.value);
      
    // Send email using emailjs
    if (isValid) {
      emailjs.sendForm('service_2siva', 'template_km0s0xk', contactForm)
        .then(function() {
          alert('Thank you for contacting us, ' + nameInput.value.trim() + '!');
          contactForm.reset();
        }, function(error) {
          alert('Failed to send message. Please try again later.');
          console.error('EmailJS error:', error);
        });
    }
  });

  function showError(inputElement, message) {
    const error = document.createElement('div');
    error.className = 'error-message text-danger small mt-1';
    error.textContent = message;
    inputElement.parentNode.appendChild(error);
  }

  function validateEmail(email) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^\+?\d{7,15}$/;
    return re.test(phone);
  }

  // Dark/light mode toggle
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('bi-moon-fill');
      themeIcon.classList.add('bi-sun-fill');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('bi-sun-fill');
      themeIcon.classList.add('bi-moon-fill');
    }
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || !savedTheme) {
    setTheme(true);
    localStorage.setItem('theme','dark');
  } else {
    setTheme(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});

//Typing animation
document.addEventListener("DOMContentLoaded", function() {
  const texts = [" Full Stack Developer", " Web Developer"," Python Developer"];
  let textIndex = 0;
  let charIndex = 0;
  let typing = true;
  const typedText = document.getElementById("typed-text");

  function type() {
    if (charIndex < texts[textIndex].length) {
      typedText.textContent += texts[textIndex][charIndex];
      charIndex++;
      setTimeout(type, 70);
    } else {
      typing = false;
      setTimeout(erase, 1200);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedText.textContent = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 40);
    } else {
      typing = true;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 400);
    }
  }

  type();

});

  // Scroll animation for experience
document.addEventListener('DOMContentLoaded', function () {
  const expSection = document.getElementById('experience');
  function checkExperienceInView() {
    const rect = expSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      expSection.classList.add('visible');
      window.removeEventListener('scroll', checkExperienceInView);
    }
  }
  window.addEventListener('scroll', checkExperienceInView);
  checkExperienceInView();
});

//scroll animation for projects
document.addEventListener('DOMContentLoaded', function () {
  const row1 = document.getElementById('projects-row-1');
  const row2 = document.getElementById('projects-row-2');

  function animateProjectsRows() {
    const row1Rect = row1.getBoundingClientRect();
    const row2Rect = row2.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (row1Rect.top < windowHeight - 50 && !row1.classList.contains('animated')) {
      row1.classList.add('appear-left', 'animated');
    }
    if (row2Rect.top < windowHeight - 50 && !row2.classList.contains('animated')) {
      row2.classList.add('appear-right', 'animated');
    }
  }

  window.addEventListener('scroll', animateProjectsRows);
  animateProjectsRows();
});


  // Scroll animation for resume
document.addEventListener('DOMContentLoaded', function () {
  
  const expSection = document.getElementById('resume');
  function checkExperienceInView() {
    const rect = expSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      expSection.classList.add('visible1');
      window.removeEventListener('scroll', checkExperienceInView);
    }
  }
  window.addEventListener('scroll', checkExperienceInView);
  checkExperienceInView();
});

  // Scroll animation for contact
document.addEventListener('DOMContentLoaded', function () {
  const contactSection = document.getElementById('contact');
  const contactCols = contactSection.querySelectorAll('.col-sm');
  function animateContactCols() {
    const rect = contactSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      if (contactCols[0]) contactCols[0].classList.add('appear-left', 'animated');
      if (contactCols[1]) contactCols[1].classList.add('appear-right', 'animated');
      window.removeEventListener('scroll', animateContactCols);
    }
  }
  window.addEventListener('scroll', animateContactCols);
  animateContactCols();
});

window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('navbar-small');
  } else {
    navbar.classList.remove('navbar-small');
  }
});