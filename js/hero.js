/* ── HERO ── */
(function () {
  'use strict';

  // ── Typewriter ──────────────────────────────
  var titles = [
    'BCA Student Developer',
    'Frontend Developer',
    'Node.js Backend Learner',
    'API Builder',
    'Problem Solver'
  ];

  var titleEl  = document.getElementById('typedTitle');
  var cursorEl = document.querySelector('.hero__title-cursor');
  var titleIdx = 0;
  var charIdx  = 0;
  var deleting = false;
  var delay    = 0;

  function typeLoop () {
    var current = titles[titleIdx];

    if (!deleting) {
      // Type forward
      charIdx++;
      titleEl.textContent = current.substring(0, charIdx);

      if (charIdx === current.length) {
        delay = 1800; // pause at end
        deleting = true;
        setTimeout(typeLoop, delay);
        return;
      }
      setTimeout(typeLoop, 80);
    } else {
      // Delete backward
      charIdx--;
      titleEl.textContent = current.substring(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }

  // Start typewriter after loader
  setTimeout(typeLoop, 3050);

  // ── Pose Cycling (SVG shape swap) ───────────
  var poseDots  = document.querySelectorAll('.pose-dot');
  var avatarSvg = document.querySelector('.hero__avatar-svg');
  var poseIndex = 0;
  var poseInterval;

  // Four SVG body poses (different arm/head positions)
  var poses = [
    // Pose 0: leaning on laptop, chin on hands
    {
      body:  'M70,340 Q160,400 250,340 L260,420 Q160,460 60,420 Z',
      head:  'cx="160" cy="160" r="68"',
      arms:  'M90,280 Q160,310 230,280 Q240,320 230,350 Q160,380 90,350 Z',
      label: 'chill'
    },
    // Pose 1: sitting up, hands on keyboard
    {
      body:  'M80,320 Q160,380 240,320 L250,420 Q160,450 70,420 Z',
      head:  'cx="160" cy="155" r="68"',
      arms:  'M85,285 Q160,295 235,285 Q245,330 235,360 Q160,370 85,360 Z',
      label: 'typing'
    },
    // Pose 2: headphones on ear, looking up
    {
      body:  'M75,330 Q160,390 245,330 L255,420 Q160,455 65,420 Z',
      head:  'cx="160" cy="150" r="70"',
      arms:  'M88,280 Q160,300 232,280 Q240,325 230,355 Q160,375 90,355 Z',
      label: 'listening'
    },
    // Pose 3: crossed arms thinking
    {
      body:  'M72,335 Q160,395 248,335 L258,420 Q160,458 62,420 Z',
      head:  'cx="163" cy="158" r="67"',
      arms:  'M82,278 Q120,265 160,268 Q200,265 238,278 Q240,330 238,358 Q160,382 82,358 Z',
      label: 'thinking'
    }
  ];

  function switchPose () {
    if (!avatarSvg || !poseDots.length) return;
    poseIndex = (poseIndex + 1) % poses.length;

    // Fade out
    avatarSvg.style.opacity = '0';
    avatarSvg.style.transform = 'scale(0.95) translateY(6px)';
    avatarSvg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(function () {
      // Update dot indicators
      poseDots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === poseIndex);
      });

      // Fade back in
      avatarSvg.style.opacity   = '1';
      avatarSvg.style.transform = 'scale(1) translateY(0)';
    }, 350);
  }

  // Auto-cycle poses every 3.5 seconds
  if (avatarSvg && poseDots.length) {
    poseInterval = setInterval(switchPose, 3500);
  }

  // Manual pose select via dot click
  poseDots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(poseInterval);
      poseIndex = i;

      poseDots.forEach(function (d, j) {
        d.classList.toggle('active', j === i);
      });

      avatarSvg.style.opacity = '0';
      avatarSvg.style.transition = 'opacity 0.3s ease';
      setTimeout(function () {
        avatarSvg.style.opacity = '1';
      }, 320);

      // Restart auto cycle
      poseInterval = setInterval(switchPose, 3500);
    });
  });

  // ── Parallax on hero bg text ──
  var heroBgText = document.querySelector('.hero__bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      heroBgText.style.transform = 'translateX(-50%) translateY(' + (scrollY * 0.2) + 'px)';
    }, { passive: true });
  }

})();
