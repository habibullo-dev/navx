// PRELOADER CONFIGURATION
const textToType = "NavX Team";
const typingSpeed = 150; // Milliseconds per letter
const delayAfterFinishing = 800; // Delay before showing main content

// Mobile menu toggle
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
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

// Initialize on page load
window.onload = function() {
    initPreloader();
};
