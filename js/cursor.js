/* Custom cursor */
(function () {
  'use strict';

  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursorFollower');

  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'cursor';
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
  }

  if (!follower) {
    follower = document.createElement('div');
    follower.id = 'cursorFollower';
    follower.className = 'cursor-follower';
    follower.setAttribute('aria-hidden', 'true');
    document.body.appendChild(follower);
  }

  if (!window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.classList.remove('custom-cursor-active');
    return;
  }

  document.body.classList.add('custom-cursor-active');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var followerX = mouseX;
  var followerY = mouseY;
  var visible = false;
  var isHovering = false;

  function setVisible (state) {
    visible = state;
    cursor.style.opacity = state ? '1' : '0';
    follower.style.opacity = state ? (isHovering ? '0.62' : '0.42') : '0';
  }

  function isInteractive (target) {
    return Boolean(target.closest(
      'a, button, input, textarea, select, label, .btn, .social-link, .nav-link, .mobile-nav__link, .process-step-btn, .showcase-tab, .showcase-flow-card, .showcase-card__link, .project-card, [role="button"]'
    ));
  }

  document.addEventListener('pointermove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (!visible) setVisible(true);

    isHovering = isInteractive(event.target);
    cursor.classList.toggle('hover', isHovering);
    follower.classList.toggle('hover', isHovering);
    follower.style.opacity = visible ? (isHovering ? '0.62' : '0.42') : '0';
  }, { passive: true });

  document.addEventListener('pointerdown', function () {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  }, { passive: true });

  document.addEventListener('pointerup', function (event) {
    isHovering = isInteractive(event.target);
    cursor.classList.toggle('hover', isHovering);
    follower.classList.toggle('hover', isHovering);
    follower.style.opacity = visible ? (isHovering ? '0.62' : '0.42') : '0';
  }, { passive: true });

  document.addEventListener('pointerleave', function () {
    setVisible(false);
  });

  document.addEventListener('pointerenter', function () {
    setVisible(true);
  });

  function render () {
    followerX += (mouseX - followerX) * 0.28;
    followerY += (mouseY - followerY) * 0.28;

    cursor.style.transform = 'translate3d(' + (mouseX - 3) + 'px,' + (mouseY - 3) + 'px,0)';
    follower.style.transform = 'translate3d(' + (followerX - 21) + 'px,' + (followerY - 21) + 'px,0)';

    requestAnimationFrame(render);
  }

  render();
})();
