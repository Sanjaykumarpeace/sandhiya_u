/* ── CONTACT FORM ── */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = document.getElementById('name');
    var email   = document.getElementById('email');
    var message = document.getElementById('message');
    var consent = document.getElementById('consent');
    var btn     = form.querySelector('button[type="submit"]');

    // Basic validation
    var errors = [];

    if (!name.value.trim())                        errors.push(name);
    if (!email.value.trim() || !isValidEmail(email.value)) errors.push(email);
    if (!message.value.trim())                     errors.push(message);
    if (!consent.checked)                          errors.push(consent);

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.input-error').forEach(function (el) { el.classList.remove('input-error'); });

    if (errors.length) {
      errors.forEach(function (field) {
        field.classList.add('input-error');
        field.style.borderColor = 'rgba(255,255,255,0.9)';
        field.style.background  = 'rgba(255,255,255,0.2)';
        setTimeout(function () {
          field.style.borderColor = '';
          field.style.background  = '';
        }, 2000);
      });
      errors[0].focus();
      return;
    }

    // Simulate sending
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    btn.style.opacity = '0.7';

    setTimeout(function () {
      // Success state
      form.style.opacity    = '0';
      form.style.transform  = 'translateY(10px)';
      form.style.transition = 'all 0.4s ease';

      setTimeout(function () {
        form.innerHTML = [
          '<div class="form-success show">',
          '<div class="form-success__icon">✓</div>',
          '<h3>Message Sent!</h3>',
          '<p style="color:rgba(255,255,255,0.75);margin-top:8px">Thanks! I\'ll get back to you within 24 hours.</p>',
          '</div>'
        ].join('');
        form.style.opacity   = '1';
        form.style.transform = 'translateY(0)';
      }, 400);
    }, 1600);
  });

  function isValidEmail (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live input border highlight
  var inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement.style.transform = 'translateY(-2px)';
      this.parentElement.style.transition = 'transform 0.3s ease';
    });
    input.addEventListener('blur', function () {
      this.parentElement.style.transform = '';
    });
  });

})();
