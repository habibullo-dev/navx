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

// Preloader typewriter effect
function initPreloader() {
    const textElement = document.getElementById('typewriter-text');
    const preloader = document.getElementById('preloader');
    const cursor = document.querySelector('.cursor');
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

    // Start typing after small delay
    setTimeout(typeWriter, 500);
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

// Defined paths (SVG Coordinates)
// Grid is roughly 600x400. Start: 50,350. End: 550,50. Obstacle center: 300,200
const paths = {
    speed: {
        // Direct diagonal line (Straight through hazard)
        d: "M 50 350 L 550 50",
        color: "#ffffff", // White
        label: "STATUS: HIGH_VELOCITY >> RISK_ACCEPTED"
    },
    safety: {
        // Go AROUND the hazard (Squarish movement)
        d: "M 50 350 L 150 350 L 150 100 L 550 100 L 550 50",
        color: "#888888", // Grey
        label: "STATUS: OBSTACLE_AVOIDANCE >> ACTIVE"
    },
    comfort: {
        // Smooth Bezier curve (Wide turn)
        d: "M 50 350 Q 100 350, 200 300 T 400 150 T 550 50",
        color: "#aaaaaa", // Light Grey
        label: "STATUS: G_FORCE_LIMITER >> ENGAGED"
    }
};

let animationFrameId;

function runSim(mode) {
    // 1. UI Updates
    document.querySelectorAll('.sim-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');
    
    const pathData = paths[mode];
    const statusDiv = document.getElementById('sim-status');
    const coordsDiv = document.getElementById('sim-coords');
    const pathEl = document.getElementById('active-path');
    const robotEl = document.getElementById('sim-robot');

    statusDiv.innerText = pathData.label;
    statusDiv.style.color = 'white';

    // 2. Set Path Properties
    pathEl.setAttribute('d', pathData.d);
    pathEl.setAttribute('stroke', pathData.color);
    
    // 3. Animate the Line Drawing
    const length = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = length;
    pathEl.style.strokeDashoffset = length;
    
    let startTime = null;
    const duration = 2000; // 2 seconds for travel

    function animate(time) {
        if (!startTime) startTime = time;
        const progress = (time - startTime) / duration;

        if (progress < 1) {
            // Draw Line
            const drawLength = length * progress;
            pathEl.style.strokeDashoffset = length - drawLength;

            // Move Robot
            const point = pathEl.getPointAtLength(drawLength);
            robotEl.setAttribute('transform', `translate(${point.x}, ${point.y})`);

            // Update Coords Text
            coordsDiv.innerText = `POS: ${Math.round(point.x).toString().padStart(3, '0')}, ${Math.round(point.y).toString().padStart(3, '0')}`;

            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Finish
            pathEl.style.strokeDashoffset = 0;
            robotEl.setAttribute('transform', `translate(550, 50)`);
            coordsDiv.innerText = `POS: 550, 050 [ARRIVED]`;
        }
    }

    // Cancel previous animation if running
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
}

// Initialize all features on page load
window.onload = function() {
    initPreloader();
    initCustomCursor();
    initScrollReveal();
    initMobileMenu();
    
    // Initialize simulation with default mode after a short delay
    setTimeout(() => {
        if (document.getElementById('sim-svg')) {
            runSim('speed');
        }
    }, 100);
};
