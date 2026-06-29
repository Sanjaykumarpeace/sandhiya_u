/* ── LOADER ── */
(function () {
  'use strict';

  const loader   = document.getElementById('loader');
  const loaderBg = loader.querySelector('.loader__bg');
  const letters  = loader.querySelectorAll('.loader__letter');
  const bar      = loader.querySelector('.loader__bar');
  const hero     = document.getElementById('home');
  const exitStart = 2000;

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';

  // Step 1: letters drop in
  letters.forEach(function (el, i) {
    setTimeout(function () {
      el.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform  = 'translateY(0)';
    }, 80 + i * 70);
  });

  // Step 2: bar fills
  setTimeout(function () {
    bar.style.transition = 'width 0.8s cubic-bezier(0.16,1,0.3,1)';
    bar.style.width      = '100%';
  }, 320);

  // Step 3: letters leave + bg slides up
  setTimeout(function () {
    letters.forEach(function (el) {
      el.style.transition = 'transform 0.35s cubic-bezier(0.7,0,0.84,0)';
      el.style.transform  = 'translateY(-120%)';
    });

    setTimeout(function () {
      loaderBg.style.transition     = 'transform 0.4s cubic-bezier(0.87,0,0.13,1)';
      loaderBg.style.transformOrigin = 'top';
      loaderBg.style.transform       = 'scaleY(0)';

      setTimeout(function () {
        loader.style.display    = 'none';
        loader.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        hero && hero.classList.add('loaded');
      }, 800);
    }, 180);
  }, exitStart);

})();
