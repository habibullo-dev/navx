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

// Initialize all features on page load
window.onload = function() {
    initPreloader();
    initCustomCursor();
    initScrollReveal();
    initMobileMenu();
};
