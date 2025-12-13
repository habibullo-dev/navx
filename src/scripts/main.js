// PRELOADER CONFIGURATION
const textToType = "NavX Team";
const typingSpeed = 150; // Milliseconds per letter
const delayAfterFinishing = 800; // Delay before showing main content

// Mobile menu toggle with smooth closing
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function initMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navLinksContainer = document.getElementById('navLinks');
    
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
            !nav.contains(e.target) && 
            navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
}

// Preloader typewriter effect & Progress Bar
function initPreloader() {
    const textElement = document.getElementById('typewriter-text');
    const preloader = document.getElementById('preloader');
    const cursor = document.querySelector('.cursor');
    const progressBar = document.getElementById('progress-bar');
    const loadingPercent = document.getElementById('loading-percent');
    const loadingStatus = document.getElementById('loading-status');
    
    let charIndex = 0;
    let progress = 0;

    // Typewriter Logic
    function typeWriter() {
        if (charIndex < textToType.length) {
            textElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Progress Bar Logic
    function updateProgress() {
        if (progress < 100) {
            // Randomize increment for "real" feel
            const increment = Math.random() * 5 + 1; 
            progress = Math.min(progress + increment, 100);
            
            if (progressBar && loadingPercent) {
                progressBar.style.width = `${progress}%`;
                loadingPercent.innerText = `${Math.floor(progress)}%`;
            }

            if (loadingStatus) {
                if (progress < 30) loadingStatus.innerText = "INITIALIZING_SYSTEM...";
                else if (progress < 60) loadingStatus.innerText = "LOADING_ASSETS...";
                else if (progress < 85) loadingStatus.innerText = "OPTIMIZING_ROUTES...";
                else loadingStatus.innerText = "READY_TO_LAUNCH...";
            }

            // Variable speed
            const timeout = Math.random() * 100 + 50;
            
            if (progress < 100) {
                setTimeout(updateProgress, timeout);
            } else {
                setTimeout(finishLoading, delayAfterFinishing);
            }
        }
    }

    function finishLoading() {
        if(cursor) cursor.style.display = 'none';
        if(preloader) preloader.style.transform = "translateY(-100%)";
        document.body.style.overflow = "auto";
    }

    // Start sequences
    setTimeout(typeWriter, 500);
    setTimeout(updateProgress, 500);
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

// --- SCROLL OBSERVER LOGIC ---
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select all elements with the reveal class
    document.querySelectorAll('.reveal-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

// --- INTERACTIVE SIMULATION LOGIC ---

// Defined paths (SVG Coordinates) - Three distinct non-overlapping routes
const paths = {
    // Speed: Direct route cutting through hazard zone (top route)
    speed: "M 50 350 L 200 200 L 300 100 L 450 50 L 550 50",
    
    // Safety: Wide detour around hazard (bottom route)
    safety: "M 50 350 L 100 370 L 200 370 L 350 360 L 450 320 L 500 250 L 520 150 L 540 100 L 550 50",
    
    // Comfort: Smooth curved middle route
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

    // Set paths
    Object.keys(paths).forEach(key => {
        pathElements[key].setAttribute('d', paths[key]);
    });

    // Animation state for each robot
    const animState = {
        speed: { progress: 0, speed: 0.006 },
        safety: { progress: 0, speed: 0.004 },
        comfort: { progress: 0, speed: 0.005 }
    };

    let animationFrameId;

    function animate() {
        Object.keys(animState).forEach(key => {
            const state = animState[key];
            const pathElem = pathElements[key];
            const robot = robots[key];

            // Update progress
            state.progress += state.speed;
            
            // Loop back to start
            if (state.progress >= 1) {
                state.progress = 0;
            }

            // Get position along path
            const pathLength = pathElem.getTotalLength();
            const point = pathElem.getPointAtLength(state.progress * pathLength);

            // Move robot
            robot.setAttribute('transform', `translate(${point.x}, ${point.y})`);
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}

// --- TEAM CAROUSEL LOGIC ---
function initTeamCarousel() {
    const track = document.getElementById('teamTrack');
    if (!track) return;

    // Clone all children to create a seamless loop
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}

// --- ARCHITECTURE INTERACTIVITY LOGIC ---
const nodeDetails = {
    hardware: {
        title: "HARDWARE_LAYER",
        desc: "The physical foundation. <strong>Razer Kiyo</strong> provides a 720p 60FPS video stream for vision processing. <strong>TurtleBot3</strong> executes velocity commands. Integrated via ROS 2 drivers."
    },
    hazard: {
        title: "HAZARD_SCORING",
        desc: "<strong>Fusion Matrix Engine</strong>. Consumes bounding boxes from YOLOv8. Calculates a 'Risk Score' for each potential path sector (Left, Center, Right) based on object density, proximity, and class weight."
    },
    router: {
        title: "ROUTER (A*)",
        desc: "Multi-criteria pathfinding algorithm. Solves for the optimal path minimizing the cost function: <code>C = w_t*T + w_r*R + w_c*C</code>. Re-evaluates continuously based on new hazard data."
    },
    waypoint: {
        title: "WAYPOINT_CLIENT",
        desc: "Action client interface. Sends computed waypoints to the Nav2 stack. Manages mission status (Success/Failure/Preemption) and handles user cancellation requests."
    },
    nav2: {
        title: "ROS2 NAV_STACK",
        desc: "Standard <strong>Nav2</strong> stack. Handles local trajectory planning (DWB Controller), global global planning costmaps, and obstacle avoidance at the motor control level."
    },
    gateway: {
        title: "FASTAPI_GATEWAY",
        desc: "Python-based backend server. Bridges ROS 2 topics (WebSockets) to the REST API consumed by the frontend. buffers real-time state for smooth UI updates."
    },
    ui: {
        title: "USER_INTERFACE",
        desc: "React + Tailwind dashboard. Visualizes robot state, camera feeds, and active route. Allows users to switch driving profiles (Velocity/Security/Comfort) in real-time."
    }
};

function initArchitectureInteractivity() {
    const nodes = document.querySelectorAll('.interactive-node');
    const modal = document.getElementById('node-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    if (!modal) return;

    // Open Modal
    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeId = node.getAttribute('data-node-id');
            const data = nodeDetails[nodeId];

            if (data) {
                modalTitle.innerHTML = "> " + data.title;
                modalDesc.innerHTML = data.desc;
                modal.classList.remove('hidden');
            }
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.classList.add('hidden');
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// --- EXPOSE TO WINDOW ---
window.toggleMenu = toggleMenu;

// Initialize all features on page load
window.onload = function() {
    initPreloader();
    initCustomCursor();
    initScrollReveal();
    initMobileMenu();
    initTeamCarousel();
    initArchitectureInteractivity();
    
    // Initialize simulation after a short delay
    setTimeout(() => {
        if (document.getElementById('sim-svg')) {
            initSimulation();
        }
    }, 100);
};
