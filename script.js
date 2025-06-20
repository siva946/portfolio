(function(){
  emailjs.init("meg4J4AQQC2cLw0IZ"); // Replace with your EmailJS user ID
})();

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleMenuBtn');
  const navlist = document.getElementById('navlist');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn.querySelector('i');

  toggleBtn.addEventListener('click', function() {
    navlist.classList.toggle('show');
  });

  // Optional: Close menu when a link is clicked (mobile only)
  navlist.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 730) {
        navlist.classList.remove('show');
      }
    });
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

    // Clear previous error messages
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

    if (isValid) {
      // Send email using emailjs
      emailjs.sendForm('service_2siva', 'template_ey45d3k', contactForm)
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

  // Dark/light mode toggle logic
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
  if (savedTheme === 'dark') {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const texts = [" Full Stack Developer", " Web developer"," Python Developer"];
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
