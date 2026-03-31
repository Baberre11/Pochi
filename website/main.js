// Pochi Website JavaScript - Independent from Extension

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  initSmoothScroll();
  
  // Form validation
  initFormValidation();
  
  // Mobile navigation toggle
  initMobileNav();
});

// Smooth scroll for anchor links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Form validation
function initFormValidation() {
  const form = document.getElementById('feature-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      const formspreeId = form.getAttribute('action').includes('YOUR_FORM_ID');
      
      if (formspreeId) {
        e.preventDefault();
        alert('Please configure the form by replacing YOUR_FORM_ID in the form action with your actual Formspree form ID.');
        return false;
      }
      
      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#dc2626';
        } else {
          field.style.borderColor = '#1a1a1a';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
        return false;
      }
    });
  }
}

// Mobile navigation toggle
function initMobileNav() {
  // Add mobile menu functionality if needed in future
  // Currently nav-links are hidden on mobile via CSS
  const header = document.querySelector('.header');
  
  if (header && window.innerWidth <= 768) {
    // Could add hamburger menu here in future
    console.log('Mobile view detected - navigation links hidden via CSS');
  }
}

// Utility: Scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Utility: Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'error' ? '#dc2626' : '#2d5016'};
    color: white;
    font-weight: 600;
    z-index: 1000;
    border: 3px solid #1a1a1a;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Console greeting
console.log('💚 Pochi - Tanzania Fee Calculator');
console.log('🌐 Website: https://pochi.tz');
console.log('⭐ GitHub: https://github.com/Baberre11/Pochi');