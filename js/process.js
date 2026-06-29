/* ── PROCESS CARD CYCLING ── */
(function () {
  'use strict';

  var stepBtns  = document.querySelectorAll('.process-step-btn');
  var card      = document.getElementById('processCard');
  var stepLabel = document.getElementById('processStep');
  var title     = document.getElementById('processTitle');
  var body      = document.getElementById('processBody');

  if (!card || !stepBtns.length) return;

  var steps = [
    {
      num:   '01',
      title: 'Learn',
      body:  'I start by understanding core computer science and web development concepts deeply, then map them to practical use-cases.'
    },
    {
      num:   '02',
      title: 'Practice',
      body:  'I convert concepts into exercises and mini builds to improve coding fluency and confidence in real project scenarios.'
    },
    {
      num:   '03',
      title: 'Build',
      body:  'I build complete solutions using JavaScript, Node.js, Express, MongoDB, REST APIs, and secure JWT authentication.'
    },
    {
      num:   '04',
      title: 'Collaborate',
      body:  'I collaborate using Git and GitHub, communicate clearly in teams, and stay open to feedback to deliver stronger outcomes.'
    }
  ];

  var currentStep = 0;
  var autoInterval;

  function setStep (idx, fromAuto) {
    currentStep = idx;

    // Update active button
    stepBtns.forEach(function (btn, i) {
      btn.classList.toggle('active', i === idx);
    });

    // Animate card content
    card.classList.add('updating');

    setTimeout(function () {
      stepLabel.textContent = steps[idx].num;
      title.textContent     = steps[idx].title;
      body.textContent      = steps[idx].body;
      card.classList.remove('updating');
    }, 200);

    // Subtle 3D tilt per step
    var tilts = [
      'perspective(1000px) rotateY(-8deg) rotateX(4deg)',
      'perspective(1000px) rotateY(-4deg) rotateX(6deg)',
      'perspective(1000px) rotateY(-10deg) rotateX(2deg)',
      'perspective(1000px) rotateY(-6deg) rotateX(5deg)'
    ];

    card.style.transform = tilts[idx];
  }

  // Manual button clicks
  stepBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      clearInterval(autoInterval);
      setStep(i, false);
      // Restart auto after 6 seconds idle
      autoInterval = setInterval(function () {
        currentStep = (currentStep + 1) % steps.length;
        setStep(currentStep, true);
      }, 3000);
    });
  });

  // Auto-advance
  autoInterval = setInterval(function () {
    currentStep = (currentStep + 1) % steps.length;
    setStep(currentStep, true);
  }, 3000);

  // Pause on hover
  if (card) {
    card.addEventListener('mouseenter', function () {
      clearInterval(autoInterval);
    });
    card.addEventListener('mouseleave', function () {
      autoInterval = setInterval(function () {
        currentStep = (currentStep + 1) % steps.length;
        setStep(currentStep, true);
      }, 3000);
    });
  }

})();
