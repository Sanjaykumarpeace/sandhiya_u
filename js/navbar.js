/* ── NAVBAR ── */
(function () {
  'use strict';

  var navbar      = document.getElementById('navbar');
  var hamburger   = document.getElementById('hamburger');
  var mobileNav   = document.getElementById('mobileNav');
  var navLinks    = document.querySelectorAll('.nav-link');
  var mobileLinks = document.querySelectorAll('.mobile-nav__link');
  var allMenuLinks = document.querySelectorAll('.nav-link, .mobile-nav__link');
  var sections    = document.querySelectorAll('main section[id]');
  var ticking     = false;

  // Add scroll progress bar to DOM
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  function setMobileNavState (isOpen) {
    if (!hamburger || !mobileNav) return;

    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  }

  function closeMobileNav () {
    setMobileNavState(false);
  }

  function updateActiveLink () {
    var scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(function (sec) {
      var top    = sec.offsetTop;
      var bottom = top + sec.offsetHeight;

      if (scrollMid >= top && scrollMid < bottom) {
        var id = sec.getAttribute('id');

        allMenuLinks.forEach(function (link) {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  function updateScrollState () {
    var scrollTop    = window.scrollY || document.documentElement.scrollTop;
    var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPct + '%';

    if (navbar && scrollTop > 60) {
      navbar.classList.add('scrolled');
    } else if (navbar) {
      navbar.classList.remove('scrolled');
    }

    updateActiveLink();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      setMobileNavState(!mobileNav.classList.contains('open'));
    });

    mobileNav.addEventListener('click', function (event) {
      if (event.target === mobileNav) {
        closeMobileNav();
      }
    });
  }

  // Close mobile nav on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Smooth scroll for all # links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      var target = href && href.length > 1 ? document.querySelector(href) : null;

      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - 78;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  updateScrollState();

})();
