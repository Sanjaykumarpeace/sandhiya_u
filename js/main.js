/* ── MAIN ── */
(function () {
  'use strict';

  // ── Insert marquee section between hero and about ──
  var heroSection  = document.getElementById('home');
  var aboutSection = document.getElementById('about');

  if (heroSection && aboutSection) {
    var marquee = document.createElement('div');
    marquee.className = 'marquee-section';
    marquee.setAttribute('aria-hidden', 'true');

    var items = ['BCA', 'JAVASCRIPT', 'NODE.JS', 'MONGODB', 'CHENNAI', 'INTERNSHIP READY'];
    var track = document.createElement('div');
    track.className = 'marquee-track';

    // Duplicate for seamless loop
    [items, items].forEach(function (group) {
      group.forEach(function (text) {
        var span = document.createElement('span');
        span.className = 'marquee-item';
        span.innerHTML = text + '<span class="dot"> ✦ </span>';
        track.appendChild(span);
      });
    });

    marquee.appendChild(track);
    heroSection.insertAdjacentElement('afterend', marquee);
  }

  // ── Insert gradient divider before contact ──
  var contactSection = document.getElementById('contact');
  if (contactSection) {
    var divider = document.createElement('div');
    divider.className = 'gradient-divider';
    contactSection.insertAdjacentElement('beforebegin', divider);
  }

  // ── Card 3D tilt on mouse move (about section) ──
  var processCard = document.getElementById('processCard');

  if (processCard && window.matchMedia('(hover: hover)').matches) {
    var cardWrap = processCard.parentElement;

    cardWrap.addEventListener('mousemove', function (e) {
      var rect    = cardWrap.getBoundingClientRect();
      var x       = (e.clientX - rect.left) / rect.width;
      var y       = (e.clientY - rect.top)  / rect.height;
      var rotateY = (x - 0.5) * -16;
      var rotateX = (y - 0.5) *  10;

      processCard.style.transform =
        'perspective(1000px) rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg)';
    });

    cardWrap.addEventListener('mouseleave', function () {
      processCard.style.transform =
        'perspective(1000px) rotateY(-8deg) rotateX(4deg)';
      processCard.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });

    cardWrap.addEventListener('mouseenter', function () {
      processCard.style.transition = 'transform 0.1s linear';
    });
  }

  // ── Footer year ──
  var footerYear = document.querySelector('.footer__year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ── Keyboard nav: close mobile nav on Escape ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var mobileNav = document.getElementById('mobileNav');
      var hamburger = document.getElementById('hamburger');
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger && hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ── Log credit ──
  console.log(
    '%c Sandhiya Portfolio %c Built with consistency and curiosity — Chennai ',
    'background:#D62828;color:#fff;padding:4px 8px;font-weight:bold;',
    'background:#111;color:#fff;padding:4px 8px;'
  );

})();
