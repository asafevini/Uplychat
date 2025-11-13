document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initFAQ();
  initContactForm();
  initHeaderScroll();
});

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });
}

function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');

  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const benefitCards = document.querySelectorAll('.benefit-card');
  benefitCards.forEach(card => {
    observer.observe(card);
  });

  const stepCards = document.querySelectorAll('.step-card');
  stepCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');

      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const company = document.getElementById('company').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !company) {
      showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('Por favor, informe um e-mail válido.', 'error');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, company, message })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o formulário');
      }

      const data = await response.json();

      if (data.success) {
        showFormMessage('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.', 'success');
        form.reset();
      } else {
        showFormMessage('Ocorreu um erro ao enviar sua mensagem. Tente novamente.', 'error');
      }
    } catch (error) {
      console.error(error);
      showFormMessage('Ocorreu um erro ao enviar sua mensagem. Tente novamente.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Enviar Solicitação';

      setTimeout(() => {
        hideFormMessage();
      }, 5000);
    }
  });
}


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function hideFormMessage() {
  const formMessage = document.getElementById('formMessage');
  formMessage.className = 'form-message';
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}