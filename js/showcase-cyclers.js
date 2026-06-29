/* Scroll-activated 3D card flows for skills, projects, and certifications */
(function () {
  'use strict';

  var data = {
    skills: [
      { kicker: 'Markup Foundation', title: 'HTML5', body: 'Semantic page structure, accessible content sections, clean portfolio layouts, and project-ready document hierarchy.', chips: ['Semantic UI', 'Forms', 'Sections'], meter: 92, link: 'https://developer.mozilla.org/en-US/docs/Web/HTML', linkText: 'Explore HTML5' },
      { kicker: 'Visual Engineering', title: 'CSS3', body: 'Responsive layouts, animation, glass effects, 3D transforms, and polished visual systems for modern web interfaces.', chips: ['Responsive', 'Animation', '3D UI'], meter: 90, link: 'https://developer.mozilla.org/en-US/docs/Web/CSS', linkText: 'Explore CSS3' },
      { kicker: 'Browser Logic', title: 'JavaScript ES6+', body: 'Dynamic content rendering, DOM interaction, category filtering, API data handling, and interactive UI behavior.', chips: ['DOM', 'ES6+', 'Interactivity'], meter: 88, link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', linkText: 'Explore JavaScript' },
      { kicker: 'Frontend Craft', title: 'Responsive UI', body: 'Mobile-first layouts that keep buttons, cards, type, and content stable across phone, tablet, and desktop screens.', chips: ['Mobile First', 'Layout', 'Polish'], meter: 86, link: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design', linkText: 'Explore Responsive UI' },
      { kicker: 'Runtime Layer', title: 'Node.js', body: 'Backend JavaScript foundations for API-driven systems, server routes, and structured application logic.', chips: ['Server JS', 'APIs', 'Modules'], meter: 82, link: 'https://nodejs.org/en/learn', linkText: 'Explore Node.js' },
      { kicker: 'API Framework', title: 'Express.js', body: 'REST route design, middleware flow, request validation, and backend structure for inventory-management workflows.', chips: ['Routes', 'Middleware', 'REST'], meter: 82, link: 'https://expressjs.com/', linkText: 'Explore Express.js' },
      { kicker: 'Database Layer', title: 'MongoDB', body: 'Document database basics, schema planning, inventory data storage, and practical NoSQL project foundations.', chips: ['NoSQL', 'Schema', 'CRUD'], meter: 84, link: 'https://www.mongodb.com/docs/', linkText: 'Explore MongoDB' },
      { kicker: 'Security Layer', title: 'JWT Authentication', body: 'Token-based login and authorization patterns for protecting API routes and user-specific backend actions.', chips: ['Auth', 'Tokens', 'Security'], meter: 80, link: 'https://jwt.io/introduction', linkText: 'Explore JWT' },
      { kicker: 'Programming Base', title: 'Python Data Science', body: 'Python foundations strengthened through NPTEL coursework, data handling practice, and analysis-oriented thinking.', chips: ['Python', 'Data', 'NPTEL'], meter: 78, link: 'https://docs.python.org/3/', linkText: 'Explore Python' },
      { kicker: 'Workflow Layer', title: 'Git & GitHub', body: 'Version control, repository workflows, collaboration habits, and project history management for academic builds.', chips: ['Git', 'GitHub', 'Collaboration'], meter: 84, link: 'https://docs.github.com/en/get-started', linkText: 'Explore GitHub' }
    ],
    projects: [
      {
        kicker: 'Frontend Developer',
        title: 'News Landscape - Insight Stream',
        body: 'A responsive news aggregation web app that fetches real-time articles through News API and supports category-based filtering with vanilla JavaScript.',
        chips: ['HTML5', 'CSS3', 'JavaScript', 'News API'],
        link: 'https://github.com/sandhiyaudhaya2006-afk',
        linkText: 'Open GitHub',
        meter: 90
      },
      {
        kicker: 'Backend Developer',
        title: 'Product Inventory Management System',
        body: 'A RESTful backend with complete CRUD operations, JWT authentication, authorization, and MongoDB schema design for inventory data.',
        chips: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
        link: 'https://github.com/sandhiyaudhaya2006-afk',
        linkText: 'Open GitHub',
        meter: 88
      }
    ],
    certifications: [
      {
        kicker: 'NPTEL - IIT Madras',
        title: 'Python for Data Science',
        body: 'Elite Certificate completed during Jan-Feb 2026 with a 67% score, strengthening Python and data science foundations.',
        chips: ['Elite', '67%', 'Python', 'Data Science'],
        meter: 86
      },
      {
        kicker: 'IBM SkillsBuild',
        title: 'Artificial Intelligence Fundamentals',
        body: 'Completed IBM SkillsBuild AI fundamentals credential issued via Credly on Feb 17, 2026.',
        chips: ['AI', 'IBM', 'Credly', '2026'],
        meter: 84
      },
      {
        kicker: 'MongoDB',
        title: 'MongoDB Basics for Students',
        body: 'MongoDB student certification completed on Jun 18, 2025, covering document database basics and schema concepts.',
        chips: ['MongoDB', 'NoSQL', 'Schema', '2025'],
        meter: 82
      }
    ]
  };

  function renderChips (target, chips) {
    target.innerHTML = '';
    chips.forEach(function (chip) {
      var span = document.createElement('span');
      span.textContent = chip;
      target.appendChild(span);
    });
  }

  function makeFlowCard (item, index) {
    var button = document.createElement('button');
    button.className = 'showcase-flow-card';
    button.type = 'button';
    button.dataset.showcaseIndex = String(index);
    button.innerHTML =
      '<span class="showcase-flow-card__num">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="showcase-flow-card__title">' + item.title + '</span>' +
      '<span class="showcase-flow-card__meta">' + item.kicker + '</span>';
    return button;
  }

  function initShowcase (root) {
    var key = root.dataset.showcase;
    var items = data[key];
    if (!items || !items.length) return;

    var card = root.querySelector('[data-showcase-card]');
    var kicker = root.querySelector('[data-showcase-kicker]');
    var title = root.querySelector('[data-showcase-title]');
    var body = root.querySelector('[data-showcase-body]');
    var chips = root.querySelector('[data-showcase-chips]');
    var meter = root.querySelector('[data-showcase-meter]');
    var link = root.querySelector('[data-showcase-link]');
    var controls = root.querySelector('[data-showcase-controls]');
    var ghosts = root.querySelectorAll('.showcase-card--ghost');
    var index = 0;
    var timer;
    var isVisible = false;
    var flowCards = [];

    controls.classList.add('showcase-flow');
    controls.innerHTML = '';
    items.forEach(function (item, itemIndex) {
      var flowCard = makeFlowCard(item, itemIndex);
      controls.appendChild(flowCard);
      flowCards.push(flowCard);
    });

    function setActive (nextIndex) {
      index = (nextIndex + items.length) % items.length;
      var item = items[index];
      var next = items[(index + 1) % items.length];
      var afterNext = items[(index + 2) % items.length];

      card.classList.add('is-changing');
      window.setTimeout(function () {
        kicker.textContent = item.kicker;
        title.textContent = item.title;
        body.textContent = item.body;
        renderChips(chips, item.chips);
        if (meter) meter.style.width = (item.meter || 84) + '%';
        if (link) {
          link.href = item.link || '#';
          link.textContent = item.linkText || 'View';
          link.style.display = item.link ? 'inline-flex' : 'none';
        }
        ghosts[0] && (ghosts[0].textContent = next.title);
        ghosts[1] && (ghosts[1].textContent = afterNext.title);
        flowCards.forEach(function (flowCard, flowIndex) {
          var distance = (flowIndex - index + items.length) % items.length;
          var opacity = Math.max(0.38, 1 - distance * 0.065);
          flowCard.classList.toggle('active', flowIndex === index);
          flowCard.style.setProperty('--flow-distance', distance);
          flowCard.style.setProperty('--flow-opacity', opacity.toFixed(2));
          flowCard.style.setProperty('--flow-z', String(items.length - distance));
        });
        card.classList.remove('is-changing');
      }, key === 'skills' ? 90 : 180);
    }

    function restart () {
      clearInterval(timer);
      if (!isVisible) return;
      timer = setInterval(function () {
        setActive(index + 1);
      }, key === 'skills' ? 1800 : 3300);
    }

    flowCards.forEach(function (flowCard) {
      flowCard.addEventListener('click', function () {
        setActive(parseInt(flowCard.dataset.showcaseIndex, 10));
        restart();
      });
    });

    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);

    if (window.matchMedia('(hover: hover)').matches) {
      root.addEventListener('mousemove', function (event) {
        var rect = root.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(1200px) rotateY(' + (x * -16) + 'deg) rotateX(' + (y * 12) + 'deg) translateZ(38px)';
      });
      root.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        root.classList.toggle('showcase--live', isVisible);
        if (isVisible) {
          setActive(index);
          restart();
        } else {
          clearInterval(timer);
        }
      });
    }, { threshold: 0.32 });

    setActive(0);
    observer.observe(root);
  }

  document.querySelectorAll('[data-showcase]').forEach(initShowcase);
})();
