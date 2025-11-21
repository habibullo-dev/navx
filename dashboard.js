// --- DASHBOARD JAVASCRIPT ---
// This file contains all dashboard-specific functionality

// --- MOBILE MENU TOGGLE ---
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  if (sidebar && toggleBtn) {
    sidebar.classList.toggle('expanded');
    toggleBtn.classList.toggle('active');
    
    // Update button text
    const isExpanded = sidebar.classList.contains('expanded');
    toggleBtn.innerHTML = isExpanded 
      ? '<i class="fas fa-times"></i> CLOSE' 
      : '<i class="fas fa-sliders-h"></i> CONTROLS';
  }
}

// Set route from mobile control strip
function setRouteFromMobile(mode) {
  // Update mobile buttons
  document.querySelectorAll('.mobile-control-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === mode);
  });
  
  // Call main route function
  setRoute(mode);
  
  // Auto-close sidebar if open on mobile
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (sidebar && sidebar.classList.contains('expanded')) {
      sidebar.classList.remove('expanded');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-sliders-h"></i> CONTROLS';
      }
    }
  }
}

// Initialize mobile menu behavior
function initMobileMenu() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const navLinksContainer = document.getElementById('navLinks');
  
  if (!navLinksContainer) return;
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu after clicking a link on mobile
      if (window.innerWidth <= 768) {
        navLinksContainer.classList.remove('active');
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768 && 
        nav && !nav.contains(e.target) && 
        navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
    }
  });
}

// --- CUSTOM CURSOR LOGIC ---
function initCustomCursor() {
  // Only initialize cursor on non-touch devices
  if (!('ontouchstart' in window)) {
    const cursor = document.getElementById('custom-cursor');
    
    if (!cursor) return;

    // Move cursor to mouse position
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .route-card, .wx-btn');
    
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

// --- CONFIGURATION ---
const routes = {
  fastest: {
    id: "path-fastest",
    baseRisk: 6.5,
    speed: 80,
    weatherPenalty: { rain: 2.5, fog: 4.0, snow: 3.2 },
  },
  scenic: {
    id: "path-scenic",
    baseRisk: 1.2,
    speed: 45,
    weatherPenalty: { rain: 1.0, fog: 1.5, snow: 1.8 },
  },
  comfort: {
    id: "path-comfort",
    baseRisk: 2.5,
    speed: 55,
    weatherPenalty: { rain: 1.5, fog: 2.0, snow: 2.2 },
  },
};

// Detailed route + weather conditions for status panel
const routeConditions = {
  fastest: {
    base: "High-speed diagonal trunk route",
    env: "Priority transit corridor",
    features: ["Wide lanes", "Direct vector"],
    sun: "Dry surface / optimal traction",
    rain: "Wet asphalt / longer braking distance",
    fog: "Low visibility / adaptive slowdown",
    snow: "Reduced lane contrast / moderate slip risk"
  },
  scenic: {
    base: "Lateral then vertical scenic sweep",
    env: "Green belt + park corridors",
    features: ["Tree canopy", "View nodes"],
    sun: "Clear view of landscape corridors",
    rain: "Puddling risk near mid spans",
    fog: "Obscured distant markers / moderate caution",
    snow: "Soft snowfall ambience / watch shaded patches"
  },
  comfort: {
    base: "Stable L-shaped climb then traverse",
    env: "Low-stress buffered zone",
    features: ["Soft lighting", "Gentle turns"],
    sun: "Even lighting / smooth turns",
    rain: "Reduced corner speed / gentle acceleration",
    fog: "Maintain lane discipline / extended headway",
    snow: "Calm surface / slightly reduced acceleration"
  }
};

let activeMode = "fastest";
let currentWeather = "sun";
let isAnimating = false;

// --- PRELOADER (for standalone page) ---
window.onload = () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.transform = "translateY(-100%)";
      initDashboard();
    }, 1500);
  } else {
    // If no preloader (embedded in index.html), init directly
    initDashboard();
  }
};

// Initialize dashboard when DOM is loaded
function initDashboard() {
  initMobileMenu();
  initCustomCursor();
  setRoute("fastest");
  setWeather("sun");
  animateAgentLoop();
  log("System Online. Connected to NavX Cloud.", "info");
}

// --- LOGIC: ROUTE SELECTION ---
function setRoute(mode) {
  activeMode = mode;

  // Update UI Buttons
  document
    .querySelectorAll(".route-card")
    .forEach((c) => c.classList.remove("active"));
  const activeCard = document.querySelector(`.route-card[data-type="${mode}"]`);
  if (activeCard) {
    activeCard.classList.add("active");
  }

  // Update Map Paths
  document
    .querySelectorAll(".route-path")
    .forEach((p) => p.classList.remove("active"));
  const path = document.getElementById(routes[mode].id);
  if (path) {
    path.classList.add("active");
  }

  // Recalculate Risk
  updateTelemetry();
  updateRouteStatus();
  updateBuildingHighlights();

  // Log
  log(`Rerouting: ${mode.toUpperCase()} profile active.`, "info");
}

// --- LOGIC: WEATHER INTELLIGENCE ---
function setWeather(type) {
  currentWeather = type;
  const overlay = document.getElementById("weather-fx");
  const icon = document.getElementById("w-icon");
  const temp = document.getElementById("w-temp");
  const desc = document.getElementById("w-desc");

  if (!overlay || !icon || !temp || !desc) return;

  // Reset/activate weather buttons robustly via data attribute
  document.querySelectorAll(".wx-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.wx === type);
  });

  // Body class for mood filters
  document.body.classList.remove("weather-sun", "weather-rain", "weather-fog");
  document.body.classList.add(`weather-${type}`);

  // Helper: clear overlay content when switching weathers
  const clearOverlay = () => { if (overlay) overlay.innerHTML = ""; };

  if (type === "sun") {
    overlay.className = "";
    clearOverlay();
    overlay.style.opacity = 0;
    icon.className = "fas fa-sun weather-icon";
    temp.innerText = "27°";
    desc.innerText = "CLEAR SKY // BRIGHT";
    log("WX: Clear sky. Visibility optimal.", "info");
  } else if (type === "rain") {
    overlay.className = ""; // particle rain overlay
    overlay.style.opacity = 0.38;
    icon.className = "fas fa-cloud-rain weather-icon";
    temp.innerText = "16°";
    desc.innerText = "HEAVY RAIN // LOW TRACTION";
    log("WX: Heavy precipitation. Reduce speed, increase following distance.", "warn");

    // Generate particle rain layers (front/back)
    clearOverlay();
    const front = document.createElement('div');
    front.className = 'rain front-row';
    const back = document.createElement('div');
    back.className = 'rain back-row';

    // Build drops
    const buildDrops = (isBack) => {
      let increment = 0;
      const frag = document.createDocumentFragment();
      while (increment < 100) {
        const randoHundo = Math.floor(Math.random() * 98) + 1; // 1..98
        const randoFiver = Math.floor(Math.random() * 4) + 2;  // 2..5
        increment += randoFiver;

        const drop = document.createElement('div');
        drop.className = 'drop';
        const posProp = isBack ? 'right' : 'left';
        drop.style[posProp] = increment + '%';
        drop.style.bottom = (randoFiver + randoFiver - 1 + 100) + '%';
        drop.style.animationDelay = `0.${randoHundo}s`;
        drop.style.animationDuration = `0.5${randoHundo}s`;

        const stem = document.createElement('div');
        stem.className = 'stem';
        stem.style.animationDelay = `0.${randoHundo}s`;
        stem.style.animationDuration = `0.5${randoHundo}s`;

        const splat = document.createElement('div');
        splat.className = 'splat';
        splat.style.animationDelay = `0.${randoHundo}s`;
        splat.style.animationDuration = `0.5${randoHundo}s`;

        drop.appendChild(stem);
        drop.appendChild(splat);
        frag.appendChild(drop);
      }
      return frag;
    };

    front.appendChild(buildDrops(false));
    back.appendChild(buildDrops(true));
    overlay.appendChild(front);
    overlay.appendChild(back);
  } else if (type === "fog") {
    overlay.className = "";
    clearOverlay();
    overlay.style.opacity = 1;
    icon.className = "fas fa-smog weather-icon";
    temp.innerText = "12°";
    desc.innerText = "DENSE FOG // VIS LOW";
    log("WX: Visibility degraded. Engaging enhanced caution protocols.", "warn");

    // Inject layered fog structure
    const wrapper = document.createElement('div');
    wrapper.className = 'fogwrapper';

    const mkLayer = (id) => {
      const layer = document.createElement('div');
      layer.id = id;
      layer.className = 'fog';
      const img1 = document.createElement('div');
      img1.className = 'image01';
      const img2 = document.createElement('div');
      img2.className = 'image02';
      layer.appendChild(img1);
      layer.appendChild(img2);
      return layer;
    };

    wrapper.appendChild(mkLayer('foglayer_01'));
    wrapper.appendChild(mkLayer('foglayer_02'));
    wrapper.appendChild(mkLayer('foglayer_03'));

    overlay.appendChild(wrapper);
  } else if (type === "snow") {
    overlay.className = "";
    clearOverlay();
    overlay.style.opacity = 0.9;
    icon.className = "fas fa-snowflake weather-icon";
    temp.innerText = "-2°";
    desc.innerText = "LIGHT SNOW // COOL";
    log("WX: Light snowfall. Monitoring surface accumulation.", "warn");

    const snowDiv = document.createElement('div');
    snowDiv.className = 'snow';
    overlay.appendChild(snowDiv);
  }

  updateTelemetry();
  updateRouteStatus();
  updateBuildingHighlights();
}

// --- LOGIC: TELEMETRY & RISK CALC ---
function updateTelemetry() {
  const route = routes[activeMode];
  let risk = route.baseRisk;
  let speed = route.speed;

  // Weather Modifiers
  if (currentWeather !== "sun") {
    risk += route.weatherPenalty[currentWeather];
    speed *= 0.7;
  }

  // Clamp
  risk = Math.min(risk, 10).toFixed(1);

  // Update DOM
  const riskElement = document.getElementById("tele-risk");
  const speedElement = document.getElementById("tele-speed");
  
  if (riskElement) {
    riskElement.innerText = risk;
    riskElement.style.color =
      risk > 7 ? "var(--accent-fast)" : "var(--text-main)";
  }

  if (speedElement) {
    speedElement.innerText = Math.floor(speed);
  }
}

// --- LOGIC: AGENT ANIMATION ---
function animateAgentLoop() {
  const agent = document.getElementById("agent");
  if (!agent) return;
  
  let progress = 0;
  const speedFactor = 0.0005;

  function step(timestamp) {
    const path = document.getElementById(routes[activeMode].id);
    if (!path) return;
    
    const len = path.getTotalLength();

    // Increment progress
    let currentSpeed = routes[activeMode].speed;
    if (currentWeather !== "sun") currentSpeed *= 0.6;
    // Reduced speed factor for calmer navigation feel
    progress += currentSpeed * 0.025;

    if (progress > len) {
      // Smooth loop: hide, wait, reset, then fade back in
      agent.style.opacity = '0';
      setTimeout(() => {
        progress = 0;
        // Keep hidden briefly to avoid visible jump
        setTimeout(() => {
          agent.style.opacity = '1';
        }, 200);
      }, 300);
    }

    // Only render if within path bounds
    if (progress <= len) {
      // Get point coordinates
      const point = path.getPointAtLength(progress);

      // Calculate rotation (look ahead)
      const lookAhead = Math.min(progress + 10, len);
      const nextPoint = path.getPointAtLength(lookAhead);
      const angle =
        (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) /
        Math.PI;

      // Apply Transform
      // Car icon drawn pointing to the right, so use raw angle
      agent.setAttribute("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`);
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Update route status panel text
function updateRouteStatus() {
  const el = document.getElementById('route-status');
  if (!el) return;
  const rc = routeConditions[activeMode];
  if (!rc) { el.textContent = 'No data'; return; }
  const detail = rc[currentWeather] || rc.sun;
  const feat = rc.features ? rc.features.join(', ') : '';
  el.textContent = `${activeMode.toUpperCase()} // ${rc.env}\n${rc.base}\nWX: ${detail}\nFEAT: ${feat}`;
}

// Highlight buildings near current route path
function updateBuildingHighlights() {
  const path = document.getElementById(routes[activeMode].id);
  if (!path) return;
  const len = path.getTotalLength();
  const isMobile = window.innerWidth <= 768;
  const samples = isMobile ? 90 : 180; // reduced resolution on mobile for performance
  const samplePoints = [];
  for (let i = 0; i <= samples; i++) {
    const pt = path.getPointAtLength((len * i) / samples);
    samplePoints.push(pt);
  }
  const threshold = 95; // distance threshold
  document.querySelectorAll('g[data-building]').forEach(b => {
    const x = parseFloat(b.getAttribute('data-x'));
    const y = parseFloat(b.getAttribute('data-y'));
    let minD = Infinity;
    for (let i = 0; i < samplePoints.length; i++) {
      const dx = samplePoints[i].x - x;
      const dy = samplePoints[i].y - y;
      const d = dx * dx + dy * dy;
      if (d < minD) minD = d;
      if (d < threshold * threshold) break; // early exit
    }
    if (minD < threshold * threshold) {
      b.classList.add('building-near-route');
    } else {
      b.classList.remove('building-near-route');
    }
  });
}

// Initial highlight after load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateBuildingHighlights, 1200);

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const svg = document.getElementById('nav-map');
    if (svg) {
      // Zoom out more for better overview
      svg.setAttribute('viewBox', '-600 -300 2000 1600');
    }
    // Reposition markers well within visible area
    const start = document.querySelector('.start-marker');
    const target = document.querySelector('.target-marker');
    if (start) {
      // Move START more to the right to ensure full visibility
      start.setAttribute('transform', 'translate(100,640)');
      const t = start.querySelector('text');
      if (t) t.setAttribute('y','22');
    }
    if (target) {
      target.setAttribute('transform', 'translate(720,100)');
      const tt = target.querySelector('text');
      if (tt) tt.setAttribute('y','-22');
    }
  }
});

// --- LOG HELPER ---
function log(msg, type) {
  const consoleEl = document.getElementById("console");
  if (!consoleEl) return;
  
  const div = document.createElement("div");
  div.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  div.innerText = `[${time}] ${msg}`;
  consoleEl.prepend(div);
}

// Legacy support - also initialize on DOMContentLoaded for embedded usage
if (document.readyState !== "loading") {
  // DOM already loaded (shouldn't happen due to window.onload, but safety check)
  if (!document.getElementById("preloader") && document.getElementById("dashboard")) {
    setTimeout(initDashboard, 100);
  }
}
