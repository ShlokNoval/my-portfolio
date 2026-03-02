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
