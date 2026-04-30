/* ============================= */
/* PRELOADER */
/* ============================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 500);
    }
});

/* ============================= */
/* LENIS SMOOTH SCROLLING */
/* ============================= */
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

/* ============================= */
/* SPOTLIGHT EFFECT ON CARDS */
/* ============================= */
const spotlightCards = document.querySelectorAll(
    '.experience-card, .skill-card, .project-card, .about-card, .timeline-card'
);

spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouseX', `${x}px`);
        card.style.setProperty('--mouseY', `${y}px`);
    });
});

/* ============================= */
/* MAGNETIC BUTTONS & LINKS */
/* ============================= */
const magneticElements = document.querySelectorAll('.btn, .social-links a, .footer-social a, nav ul li a');

// Only apply on non-touch devices
if (window.matchMedia("(pointer: fine)").matches) {
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const h = rect.width / 2;
            const v = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - v;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });
}

/* ============================= */
/* CINEMATIC PORTAL ANIMATION */
/* ============================= */
document.addEventListener("DOMContentLoaded", () => {
    const portalWrapper = document.getElementById('portal-wrapper');
    const maskGroup = document.getElementById('mask-group');
    const introUi = document.getElementById('intro-ui');
    const progressBar = document.getElementById('portal-progress-bar');
    const mainContent = document.getElementById('main-content');
    const mistyCard = document.querySelector('.misty-card');
    
    if (!portalWrapper || !maskGroup) return;

    let portalProgress = 0;
    let isAutoAdvancing = false;
    let portalComplete = false;

    // Stop Lenis initially so user can't scroll past the portal
    if (typeof lenis !== 'undefined') {
        lenis.stop();
    }

    // Cubic easing function
    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function updatePortal() {
        if (portalProgress > 1) portalProgress = 1;
        if (portalProgress < 0) portalProgress = 0;

        // Exponential scale from 1 to 220
        // We use easing for the visual effect
        let easedProgress = easeInOutCubic(portalProgress);
        let scale = 1 + (easedProgress * 219);
        
        maskGroup.style.transform = `scale(${scale})`;
        progressBar.style.width = `${portalProgress * 100}%`;

        // Intro UI fade and translate
        if (portalProgress < 0.2) {
            let uiOpacity = 1 - (portalProgress / 0.2);
            let uiY = -(portalProgress / 0.2) * 60;
            introUi.style.opacity = uiOpacity;
            introUi.style.transform = `translateX(-50%) translateY(${uiY}px)`;
            introUi.style.pointerEvents = 'none';
        } else {
            introUi.style.opacity = 0;
        }

        // Curtain fade out after 85%
        if (portalProgress > 0.85) {
            let fadeProgress = (portalProgress - 0.85) / 0.15;
            portalWrapper.style.opacity = 1 - fadeProgress;
        } else {
            portalWrapper.style.opacity = 1;
        }

        // Auto advance if > 30%
        if (portalProgress > 0.3 && !isAutoAdvancing && !portalComplete) {
            isAutoAdvancing = true;
            autoAdvance();
        }

        // Complete
        if (portalProgress === 1 && !portalComplete) {
            portalComplete = true;
            portalWrapper.style.display = 'none';
            mainContent.classList.remove('locked');
            if (mistyCard) {
                mistyCard.classList.add('revealed');
            }
            if (typeof lenis !== 'undefined') {
                lenis.start();
            }
        }
    }

    function autoAdvance() {
        if (portalProgress < 1) {
            portalProgress += 0.015; // roughly 3-4 seconds to reach 1 at 60fps
            updatePortal();
            requestAnimationFrame(autoAdvance);
        }
    }

    window.addEventListener('wheel', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        
        // Increase progress based on wheel delta
        // Sensitivity might need tuning
        if (e.deltaY > 0) {
            portalProgress += 0.02;
        } else {
            portalProgress -= 0.02;
        }
        
        updatePortal();
    }, { passive: false });

    // Handle touch for mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        let touchEndY = e.touches[0].clientY;
        let deltaY = touchStartY - touchEndY;
        
        if (deltaY > 10) {
            portalProgress += 0.03;
            touchStartY = touchEndY;
        } else if (deltaY < -10) {
            portalProgress -= 0.03;
            touchStartY = touchEndY;
        }
        updatePortal();
    }, { passive: false });
});
