// Vectron Robotics - FTC Team 17873

// Preload team member images right after DOM ready
function preloadTeamImages() {
  const teamImages = [
    'img/team/Group.jpeg',
    'img/school-logo.png',
    'img/team/Proiectare/Aris Mășcășan.jpeg',
    'img/team/Proiectare/Darius Beldean.jpeg',
    'img/team/Proiectare/Razvan Hodrea.jpeg',
    'img/team/Proiectare/Tudor Pop.jpeg',
    'img/team/Programare/Luca Danciu.jpeg',
    'img/team/Programare/Sofia Muncelean.jpeg',
    'img/team/Programare/Alex Pop.jpeg',
    'img/team/Media & Design/Cristina Hozan.jpeg',
    'img/team/Media & Design/Ariana Nemeș.jpeg',
    'img/team/Media & Design/Bianca Oros.jpeg',
    'img/team/Media & Design/Maria Criste.jpeg',
    'img/team/Media & Design/Sarah Cîmpean.jpeg',
    'img/team/Media & Design/Sonia Marchiș.jpeg',
    'img/team/Media & Design/Ștefania Feșteu.jpeg',
  ];
  teamImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Start preloading as soon as script runs
preloadTeamImages();

// Nav
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['about', 'team', 'robot', 'stats', 'competitions', 'contact'];

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const scrollY = window.scrollY;
  const viewportH = window.innerHeight;
  let activeId = null;
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= viewportH * 0.35 && rect.bottom > viewportH * 0.2) {
      activeId = id;
    }
  });
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle?.setAttribute('aria-expanded', isOpen);
  navToggle?.setAttribute('aria-label', isOpen ? 'Închide meniul' : 'Deschide meniul');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Deschide meniul');
  });
});

// Logo click: smooth scroll to top
document.querySelectorAll('a[href="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (a.closest('.nav') || a.closest('.footer')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// Initial active nav state
updateActiveNavLink();

// Parallax - scroll-only, single global background
function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const parallaxSections = document.querySelectorAll('.parallax-section');
  const parallaxCards = document.querySelectorAll('.parallax-card, .parallax-layer');
  const pageBgElements = document.querySelectorAll('.page-bg [data-speed]');
  const teamValues = document.querySelectorAll('.value-item');
  const heroCtas = document.querySelector('.hero-cta');
  const contactLinks = document.querySelectorAll('.social-link');
  const footerContent = document.querySelector('.footer-content');
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;

    // Page background elements - scroll parallax + floating animation for orbs
    const t = Date.now() / 1000;
    pageBgElements.forEach((el, i) => {
      const speed = parseFloat(el.dataset.speed) || 0.15;
      const y = scrollY * speed;
      let floatX = 0, floatY = 0;
      if (el.classList.contains('page-bg-orb')) {
        const phase = (i % 4) * 0.5;
        floatX = Math.sin(t + phase) * 8 + Math.cos(t * 0.7 + phase) * 4;
        floatY = Math.cos(t * 0.8 + phase) * -12 + Math.sin(t * 0.6 + phase) * 5;
      }
      if (el.classList.contains('page-bg-geo')) {
        const phase = (i % 4) * 1.2;
        floatX = Math.sin(t * 0.5 + phase) * 5;
        floatY = Math.cos(t * 0.4 + phase) * -8;
      }
      const base = el.classList.contains('page-bg-glow')
        ? `translate(-50%, -50%) translate3d(${floatX}px, ${y + floatY}px, 0)`
        : `translate3d(${floatX}px, ${y + floatY}px, 0)`;
      el.style.transform = base;
    });

    // Hero content - no X/Y movement (static)
    if (heroContent) {
      heroContent.style.transform = 'none';
    }

    // Hero logo - smooth Y rotation tied directly to scroll (no jump)
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
      if (scrollY <= 15) {
        heroLogo.style.removeProperty('transform');
      } else {
        // Rotation increases smoothly with scroll: 360° per ~600px, opposite direction
        const rotation = -scrollY * 0.6;
        heroLogo.style.setProperty('transform', `perspective(600px) rotateY(${rotation}deg)`, 'important');
      }
    }

    // Hero CTA buttons - no parallax movement
    if (heroCtas) {
      heroCtas.querySelectorAll('.btn').forEach((btn) => {
        btn.style.transform = '';
      });
    }

    // Section parallax - subtle depth
    parallaxSections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < viewportH && rect.bottom > 0;
      if (inView) {
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        const factor = 0.03 + (i % 3) * 0.01;
        section.style.transform = `translate3d(0, ${centerY * factor}px, 0)`;
      } else {
        section.style.transform = '';
      }
    });

    // Card parallax - subtle individual speeds + cursor tilt for depth
    parallaxCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const inView = rect.top < viewportH * 1.1 && rect.bottom > -100;
      if (inView) {
        const speed = parseFloat(card.dataset.speed) || 0.018;
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        const y = centerY * speed;
        const tilt = card.classList.contains('cursor-tilt');
        const tiltX = tilt ? mouseParallaxY * -5 : 0;
        const tiltY = tilt ? mouseParallaxX * 5 : 0;
        card.style.transform = tilt
          ? `translate3d(0, ${y}px, 0) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
          : `translate3d(0, ${y}px, 0)`;
      } else {
        card.style.transform = '';
      }
    });

    // Team values - staggered parallax
    teamValues.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < viewportH && rect.bottom > 0;
      if (inView) {
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        const offset = (i % 2 === 0 ? 1 : -1) * 12;
        item.style.transform = `translate3d(${offset * 0.5}px, ${centerY * 0.035}px, 0)`;
      } else {
        item.style.transform = '';
      }
    });

    // Contact social links - subtle parallax (no stagger, all aligned)
    contactLinks.forEach((link) => {
      const rect = link.getBoundingClientRect();
      const inView = rect.top < viewportH && rect.bottom > 0;
      if (inView) {
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        link.style.transform = `translate3d(0, ${centerY * 0.02}px, 0)`;
      } else {
        link.style.transform = '';
      }
    });

    // Footer - subtle upward parallax
    if (footerContent) {
      const rect = footerContent.getBoundingClientRect();
      const inView = rect.top < viewportH * 1.2;
      if (inView) {
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        footerContent.style.transform = `translate3d(0, ${centerY * 0.015}px, 0)`;
      } else {
        footerContent.style.transform = '';
      }
    }

    // Content scroll parallax - section headers and content move/rotate slightly
    document.querySelectorAll('.content-scroll').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < viewportH && rect.bottom > 0;
      if (inView) {
        const centerY = rect.top + rect.height / 2 - viewportH / 2;
        const moveY = centerY * 0.04;
        const rotate = centerY * 0.0012;
        el.style.transform = `translate3d(0, ${moveY}px, 0) rotate(${rotate}deg)`;
      } else {
        el.style.transform = '';
      }
    });

  }

  function scheduleUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('mousemove', scheduleUpdate, { passive: true });
  update();
  // Continuous loop for floating orbs
  function loop() {
    scheduleUpdate();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// Mouse position for hero parallax + cursor tilt
let mouseParallaxX = 0, mouseParallaxY = 0;
document.addEventListener('mousemove', (e) => {
  mouseParallaxX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseParallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Team by departments - mirrors img/team/ folder structure
function initTeamDepartments() {
  const container = document.getElementById('team-departments');
  if (!container) return;

  const departments = [
    {
      id: 'design',
      name: 'Proiectare',
      members: [
        { file: 'Proiectare/Aris Mășcășan.jpeg', name: 'Aris Mășcășan', title: 'Lead proiectare' },
        { file: 'Proiectare/Darius Beldean.jpeg', name: 'Darius Beldean' },
        { file: 'Proiectare/Razvan Hodrea.jpeg', name: 'Razvan Hodrea' },
        { file: 'Proiectare/Tudor Pop.jpeg', name: 'Tudor Pop' },
      ],
    },
    {
      id: 'programming',
      name: 'Programming',
      members: [
        { file: 'Programare/Luca Danciu.jpeg', name: 'Luca Danciu', title: 'Team lead • Programming lead' },
        { file: 'Programare/Sofia Muncelean.jpeg', name: 'Sofia Muncelean' },
        { file: 'Programare/Alex Pop.jpeg', name: 'Alex Pop' },
      ],
    },
    {
      id: 'media-design',
      name: 'Media & Design',
      members: [
        { file: 'Media & Design/Cristina Hozan.jpeg', name: 'Cristina Hozan', title: 'Media & Design lead' },
        { file: 'Media & Design/Ariana Nemeș.jpeg', name: 'Ariana Nemeș' },
        { file: 'Media & Design/Bianca Oros.jpeg', name: 'Bianca Oros' },
        { file: 'Media & Design/Maria Criste.jpeg', name: 'Maria Criste' },
        { file: 'Media & Design/Sarah Cîmpean.jpeg', name: 'Sarah Cîmpean' },
        { file: 'Media & Design/Sonia Marchiș.jpeg', name: 'Sonia Marchiș' },
        { file: 'Media & Design/Ștefania Feșteu.jpeg', name: 'Ștefania Feșteu' },
      ],
    },
  ];

  departments.forEach((dept) => {
    const section = document.createElement('div');
    section.className = 'team-dept';
    section.dataset.dept = dept.id;

    const heading = document.createElement('h3');
    heading.className = 'team-dept-title';
    heading.textContent = dept.name;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'team-dept-grid';

    dept.members.forEach((m) => {
      const wrap = document.createElement('div');
      wrap.className = 'team-photo-wrap team-card parallax-card cursor-tilt';
      wrap.dataset.speed = (0.012 + Math.random() * 0.014).toFixed(3);
      wrap.dataset.dept = dept.name;

      const cardInner = document.createElement('div');
      cardInner.className = 'team-card-inner';

      const img = document.createElement('img');
      img.src = `img/team/${encodeURI(m.file)}`;
      img.alt = m.name;

      const cap = document.createElement('div');
      cap.className = 'team-photo-caption';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'team-photo-name';
      nameSpan.textContent = m.name;
      cap.appendChild(nameSpan);
      if (m.title) {
        const titleSpan = document.createElement('span');
        titleSpan.className = 'team-photo-title';
        titleSpan.textContent = m.title;
        cap.appendChild(titleSpan);
      }

      cardInner.appendChild(img);
      cardInner.appendChild(cap);
      wrap.appendChild(cardInner);
      grid.appendChild(wrap);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function wrapWithSkeleton(img) {
  if (img.closest('.img-skeleton-wrap')) return;
  const wrap = document.createElement('span');
  wrap.className = 'img-skeleton-wrap';
  const placeholder = document.createElement('span');
  placeholder.className = 'skeleton-img-placeholder';
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(placeholder);
  wrap.appendChild(img);
  if (img.complete) {
    wrap.classList.add('loaded');
  } else {
    img.addEventListener('load', () => wrap.classList.add('loaded'));
    img.addEventListener('error', () => wrap.classList.add('loaded'));
  }
}

function initImageSkeletons() {
  const selectors = '.team-group-photo img, .sponsor-card img, .about-school-link img, .team-photo-wrap img';
  document.querySelectorAll(selectors).forEach(wrapWithSkeleton);
}

initTeamDepartments();
initImageSkeletons();
initParallax();
initTeamReveal();
initScrollReveal();
initStatCounters();

function initTeamReveal() {
  const teamSection = document.getElementById('team');
  const aboutSection = document.getElementById('about');
  const cards = [
    ...(teamSection?.querySelectorAll('.team-photo-wrap') ?? []),
    ...(aboutSection?.querySelectorAll('.team-group-photo') ?? []),
  ];
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = [...cards].indexOf(el);
        el.style.transitionDelay = `${Math.min(idx * 50, 400)}ms`;
        el.classList.add('revealed');
      }
    });
  }, { threshold: 0, rootMargin: '80px 0px 80px 0px' });
  cards.forEach((card) => io.observe(card));
}

// Scroll reveal for section headers, stats, comp cards, about, contact, robot viewer
function initScrollReveal() {
  const revealSelectors = [
    '.section-header',
    '.stat-card',
    '.comp-card',
    '.sponsor-card',
    '.robot-viewer',
    '.about-content',
    '.about-school-link',
    '.about-team-intro .team-lead',
  ];
  const elements = revealSelectors.flatMap((sel) => [...document.querySelectorAll(sel)]).filter(Boolean);
  const socialLinks = document.querySelectorAll('.social-link');
  const opts = { threshold: 0, rootMargin: '100px 0px 100px 0px' };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, opts);
  elements.forEach((el) => io.observe(el));

  socialLinks.forEach((link, i) => {
    const w = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.style.transitionDelay = `${i * 60}ms`; },
      opts
    );
    w.observe(link);
  });
  const socialIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, opts);
  socialLinks.forEach((l) => socialIo.observe(l));
}

// Stat counter animation when in view
function initStatCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  let animated = new Set();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const valEl = card.querySelector('.stat-value');
      if (!valEl || animated.has(valEl)) return;
      animated.add(valEl);
      const text = valEl.textContent;
      const match = text.match(/([\d,]+)(\D*)/);
      if (!match) return;
      const end = parseFloat(match[1].replace(',', '.'));
      const suffix = match[2] || '';
      const isDecimal = end % 1 !== 0;
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        const n = isDecimal ? Math.round(ease * end * 100) / 100 : Math.round(ease * end);
        valEl.textContent = (isDecimal ? n.toFixed(2).replace('.', ',') : n) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0, rootMargin: '80px 0px 80px 0px' });
  statCards.forEach((c) => io.observe(c));
}

// 3D Robot Viewer
async function initRobotViewer() {
  const container = document.getElementById('robot-canvas');
  if (!container) return;

  const { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, HemisphereLight, SpotLight, Box3, Vector3 } = await import('three');

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 16/9, 0.1, 1000);
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0d0d0d, 1);
  renderer.domElement.style.opacity = '0';
  renderer.domElement.style.transition = 'opacity 0.4s';
  container.appendChild(renderer.domElement);

  // Lighting: ambient + team-colored spotlights (Vectron blue #4a4aff)
  const TEAM_BLUE = 0x4a4aff;
  const TEAM_NAVY = 0x000080;
  const TEAM_LIGHT = 0x8b8bff;

  scene.add(new HemisphereLight(0x6688aa, 0x223344, 0.9));
  scene.add(new AmbientLight(0x4455aa, 0.5));

  const keyLight = new DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 10, 6);
  scene.add(keyLight);
  const fillLight = new DirectionalLight(0xaaccff, 0.9);
  fillLight.position.set(-4, 5, -3);
  scene.add(fillLight);

  // Team-colored spotlights for dramatic accents
  const spot1 = new SpotLight(TEAM_BLUE, 2.2, 0, Math.PI / 8, 0.8);
  spot1.position.set(6, 8, 8);
  spot1.target.position.set(0, 0, 0);
  scene.add(spot1);
  scene.add(spot1.target);

  const spot2 = new SpotLight(TEAM_LIGHT, 1.6, 0, Math.PI / 6, 0.7);
  spot2.position.set(-6, 6, 6);
  spot2.target.position.set(0, 0, 0);
  scene.add(spot2);
  scene.add(spot2.target);

  const spot3 = new SpotLight(TEAM_NAVY, 1.2, 0, Math.PI / 10, 0.9);
  spot3.position.set(0, 12, 4);
  spot3.target.position.set(0, 0, 0);
  scene.add(spot3);
  scene.add(spot3.target);

  const spot4 = new SpotLight(TEAM_BLUE, 1.1, 0, Math.PI / 6, 0.6);
  spot4.position.set(4, 4, -6);
  spot4.target.position.set(0, 0, 0);
  scene.add(spot4);
  scene.add(spot4.target);

  const rimWarm = new SpotLight(0xffcc88, 0.65, 0, Math.PI / 8, 0.5);
  rimWarm.position.set(-5, 3, 5);
  rimWarm.target.position.set(0, 0, 0);
  scene.add(rimWarm);
  scene.add(rimWarm.target);

  async function loadFBX() {
    try {
      const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');
      const loader = new FBXLoader();
      const loadWithTimeout = (url, ms = 12000) =>
        Promise.race([
          loader.loadAsync(url),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
        ]);
      let model;
      try {
        model = await loadWithTimeout('https://firebasestorage.googleapis.com/v0/b/vectron-storage.firebasestorage.app/o/robot.fbx?alt=media&token=01f6ed2d-4300-472a-8d69-783320b5689e');
      } catch {
        try {
          model = await loadWithTimeout('Robot.fbx');
        } catch {
          return null;
        }
      }
      const box = new Box3().setFromObject(model);
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      const targetSize = 0.04;
      const scale = Math.min(targetSize / maxDim, 50);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      return model;
    } catch {
      return null;
    }
  }

  const loadingEl = document.getElementById('robot-loading');
  const hideLoading = () => {
    loadingEl?.classList.add('hidden');
    renderer.domElement.style.opacity = '1';
  };

  const robotModel = await loadFBX();
  if (!robotModel) {
    hideLoading();
    const viewerEl = document.querySelector('.robot-viewer');
    if (viewerEl) {
      const msg = document.createElement('div');
      msg.className = 'robot-unavailable';
      msg.textContent = '3D model unavailable. Add robot.fbx or Robot.fbx to view.';
      viewerEl.appendChild(msg);
    }
    return;
  }
  robotModel.rotation.x = -Math.PI / 2;
  scene.add(robotModel);
  // Keep loading visible until first frame with model is rendered
  renderer.render(scene, camera);
  requestAnimationFrame(() => {
    hideLoading();
  });

  const target = new Vector3(0, 0, 0);

  // Orbit controls: camera orbits around robot, robot stays upright (wheels down)
  // azimuth = Math.PI puts camera in front of robot
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let azimuth = Math.PI;
  let elevation = 0.3;
  let orbitRadius = 120;

  function updateCameraPosition() {
    const x = orbitRadius * Math.cos(elevation) * Math.sin(azimuth);
    const y = orbitRadius * Math.sin(elevation);
    const z = orbitRadius * Math.cos(elevation) * Math.cos(azimuth);
    camera.position.set(x, y, z);
    camera.lookAt(target);
  }

  updateCameraPosition();

  container.addEventListener('mousedown', (e) => {
    if (e.button === 0) { isDragging = true; prevX = e.clientX; prevY = e.clientY; }
  });
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; }
  }, { passive: true });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    azimuth -= (e.clientX - prevX) * 0.005;
    elevation += (e.clientY - prevY) * 0.005;
    elevation = Math.max(-0.4, Math.min(1.2, elevation));
    prevX = e.clientX;
    prevY = e.clientY;
    updateCameraPosition();
  });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    azimuth -= (e.touches[0].clientX - prevX) * 0.005;
    elevation += (e.touches[0].clientY - prevY) * 0.005;
    elevation = Math.max(-0.4, Math.min(1.2, elevation));
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    updateCameraPosition();
  }, { passive: true });

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.05 : 1 / 1.05;
    orbitRadius = Math.max(20, Math.min(400, orbitRadius * delta));
    updateCameraPosition();
  }, { passive: false });

  document.getElementById('reset-view')?.addEventListener('click', () => {
    azimuth = Math.PI;
    elevation = 0.3;
    orbitRadius = 120;
    updateCameraPosition();
  });

  const scale = 0.08;

  function animate() {
    requestAnimationFrame(animate);
    robotModel.scale.setScalar(scale);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Load 3D model after page is fully loaded
function scheduleRobotViewer() {
  function init() {
    if (window._robotViewerInit) return;
    window._robotViewerInit = true;
    initRobotViewer().catch(() => {
      document.getElementById('robot-loading')?.classList.add('hidden');
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
}

scheduleRobotViewer();
