/* ── SCROLL ANIMATIONS ── */
(function () {
  'use strict';

  // ── Intersection Observer for reveals ──────────
  var revealEls = document.querySelectorAll('.reveal-up, .reveal-text');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger delay from --delay CSS variable
        var delay = entry.target.style.getPropertyValue('--delay') || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Skill Bar Fill ─────────────────────────────
  var skillBars = document.querySelectorAll('.skill-card__fill');

  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var target = entry.target;
        var width  = target.dataset.width || '80';
        target.style.setProperty('--target-w', width + '%');
        target.style.width = width + '%';
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(function (bar) {
    barObserver.observe(bar);
  });

  // ── Animated Counters ─────────────────────────
  var statNums = document.querySelectorAll('.stat__num');

  function animateCounter (el) {
    var target   = parseInt(el.dataset.target, 10);
    var duration = 1800;
    var start    = null;
    var startVal = 0;

    if (el._counterFrame) {
      cancelAnimationFrame(el._counterFrame);
    }

    el.textContent = '0';

    function easeOutQuart (t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step (timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var current  = Math.round(startVal + easeOutQuart(progress) * (target - startVal));

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        el._counterFrame = requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
        el._counterFrame = null;
      }
    }

    el._counterFrame = requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var stat = entry.target.closest('.stat');
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        stat && stat.classList.add('visible');
      } else {
        if (entry.target._counterFrame) {
          cancelAnimationFrame(entry.target._counterFrame);
          entry.target._counterFrame = null;
        }
        entry.target.textContent = '0';
        stat && stat.classList.remove('visible');
      }
    });
  }, { threshold: 0.45 });

  statNums.forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── Marquee: inject duplicate items ───────────
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    var clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentNode.appendChild(clone);
  }

  // ── Parallax on project cards ─────────────────
  var projectCards = document.querySelectorAll('.project-card__img');

  window.addEventListener('scroll', function () {
    projectCards.forEach(function (img) {
      var rect  = img.getBoundingClientRect();
      var center = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.backgroundPositionY = (50 + center * 0.02) + '%';
    });
  }, { passive: true });

})();
