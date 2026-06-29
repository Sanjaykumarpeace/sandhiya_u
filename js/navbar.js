/* ── NAVBAR ── */
(function () {
  'use strict';

  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileNav  = document.getElementById('mobileNav');
  var navLinks   = document.querySelectorAll('.nav-link');
  var mobileLinks = document.querySelectorAll('.mobile-nav__link');

  // Add scroll progress bar to DOM
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // Scroll: add .scrolled class + update progress bar
  window.addEventListener('scroll', function () {
    var scrollTop    = window.scrollY || document.documentElement.scrollTop;
    var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = scrollPct + '%';

    if (scrollTop > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    updateActiveLink();
  }, { passive: true });

  // Active nav link based on scroll position
  var sections = document.querySelectorAll('main section[id]');

  function updateActiveLink () {
    var scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(function (sec) {
      var top    = sec.offsetTop;
      var bottom = top + sec.offsetHeight;

      if (scrollMid >= top && scrollMid < bottom) {
        var id = sec.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for all # links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - 70;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

})();
