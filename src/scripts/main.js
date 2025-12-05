// Migrated from script.js

// PRELOADER CONFIGURATION
const textToType = "NavX Team";
const typingSpeed = 150;
const delayAfterFinishing = 800;

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('active');
}

function initMobileMenu() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const navLinksContainer = document.getElementById('navLinks');
  if (!navLinksContainer) return;
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinksContainer.classList.remove('active');
      }
    });
  });
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    if (window.innerWidth <= 768 && nav && !nav.contains(e.target) && navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
    }
  });
}

function initPreloader() {
  const textElement = document.getElementById('typewriter-text');
  const preloader = document.getElementById('preloader');
  const cursor = document.querySelector('.cursor');
  if (!textElement || !preloader || !cursor) return;
  let charIndex = 0;
  function typeWriter() {
    if (charIndex < textToType.length) {
      textElement.innerHTML += textToType.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, typingSpeed);
    } else {
      setTimeout(finishLoading, delayAfterFinishing);
    }
  }
  function finishLoading() {
    cursor.style.display = 'none';
    preloader.style.transform = "translateY(-100%)";
    document.body.style.overflow = "auto";
  }
  setTimeout(typeWriter, 500);
}

function initCustomCursor() {
  if (!('ontouchstart' in window)) {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    const interactiveElements = document.querySelectorAll('a, button, .team-card, .feature-card, .role-item, .cta-button');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      });
      element.addEventListener('mouseleave', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.backgroundColor = "transparent";
      });
    });
  }
}

function initScrollReveal() {
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.reveal-on-scroll').forEach((element) => {
    observer.observe(element);
  });
}

const paths = {
  speed: "M 50 350 L 200 200 L 300 100 L 450 50 L 550 50",
  safety: "M 50 350 L 100 370 L 200 370 L 350 360 L 450 320 L 500 250 L 520 150 L 540 100 L 550 50",
  comfort: "M 50 350 Q 150 330, 220 280 Q 280 240, 340 210 Q 420 170, 480 120 Q 520 90, 550 50"
};

function initSimulation() {
  const pathElements = {
    speed: document.getElementById('path-speed'),
    safety: document.getElementById('path-safety'),
    comfort: document.getElementById('path-comfort')
  };
  const robots = {
    speed: document.getElementById('robot-speed'),
    safety: document.getElementById('robot-safety'),
    comfort: document.getElementById('robot-comfort')
  };
  Object.keys(paths).forEach(key => {
    const el = pathElements[key];
    if (el) el.setAttribute('d', paths[key]);
  });
  const animState = {
    speed: { progress: 0, speed: 0.006 },
    safety: { progress: 0, speed: 0.004 },
    comfort: { progress: 0, speed: 0.005 }
  };
  function animate() {
    Object.keys(animState).forEach(key => {
      const state = animState[key];
      const pathElem = pathElements[key];
      const robot = robots[key];
      if (!pathElem || !robot) return;
      state.progress += state.speed;
      if (state.progress >= 1) state.progress = 0;
      const pathLength = pathElem.getTotalLength();
      const point = pathElem.getPointAtLength(state.progress * pathLength);
      robot.setAttribute('transform', `translate(${point.x}, ${point.y})`);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

window.onload = function() {
  initPreloader();
  initCustomCursor();
  initScrollReveal();
  initMobileMenu();
  setTimeout(() => { if (document.getElementById('sim-svg')) initSimulation(); }, 100);
};
