/**
 * EQUILIBRIO ORGANIZACIONAL - LÓGICA E INTERACTIVIDAD
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. MENÚ MÓVIL RESPONSIVE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // 3. PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros acordeones si se desea comportamiento exclusivo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar el actual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 4. ANIMACIÓN DE CONTADORES DE ESTADÍSTICAS (HERO)
  const statValues = document.querySelectorAll('.stat-value');
  let animated = false;

  const animateStats = () => {
    statValues.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1500; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing out cúbica
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Observador de intersección para activar la animación de estadísticas
  const statsSection = document.getElementById('stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateStats();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 5. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const btnSubmit = document.getElementById('btn-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nombreInput = document.getElementById('form-nombre');
      const empresaInput = document.getElementById('form-empresa');
      const correoInput = document.getElementById('form-correo');

      // Validar Nombre
      if (!nombreInput.value.trim()) {
        showError(nombreInput);
        isValid = false;
      } else {
        clearError(nombreInput);
      }

      // Validar Empresa
      if (!empresaInput.value.trim()) {
        showError(empresaInput);
        isValid = false;
      } else {
        clearError(empresaInput);
      }

      // Validar Correo
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoInput.value.trim() || !emailPattern.test(correoInput.value.trim())) {
        showError(correoInput);
        isValid = false;
      } else {
        clearError(correoInput);
      }

      if (isValid) {
        // Simular envío
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span>Enviando información...</span>`;

        setTimeout(() => {
          formFeedback.style.display = 'block';
          contactForm.reset();
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `
            <span>Solicitar consultoría gratuita</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          `;

          // Desplazar suavemente hasta el mensaje de confirmación
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Ocultar mensaje después de 6 segundos
          setTimeout(() => {
            formFeedback.style.display = 'none';
          }, 6000);
        }, 800);
      }
    });

    // Limpiar errores en tiempo real al escribir
    contactForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        clearError(input);
      });
    });
  }

  function showError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
  }
});
