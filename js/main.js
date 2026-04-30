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
/* CINEMATIC PORTAL ANIMATION    */
/* ============================= */
(function() {
    const portalWrapper = document.getElementById('portal-wrapper');
    const maskGroup = document.getElementById('mask-group');
    const introUi = document.getElementById('intro-ui');
    const progressBar = document.getElementById('portal-progress-bar');

    if (!portalWrapper || !maskGroup) return;

    let portalProgress = 0;
    let smoothProgress = 0;
    let isAutoAdvancing = false;
    let portalComplete = false;

    // Lock body scroll during portal
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Stop Lenis
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }

    // Use AbortController so we can cleanly remove listeners after completion
    const portalAC = new AbortController();
    const signal = portalAC.signal;

    // Smooth cubic easing (lighter than quintic, feels weighted but responsive)
    function ease(t) {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function render() {
        if (portalComplete) return;

        // Lerp — fast enough for responsiveness, smooth enough for cinema
        smoothProgress += (portalProgress - smoothProgress) * 0.15;

        // Snap when very close
        if (Math.abs(portalProgress - smoothProgress) < 0.001) {
            smoothProgress = portalProgress;
        }

        // Clamp
        smoothProgress = Math.max(0, Math.min(1, smoothProgress));

        const t = ease(smoothProgress);
        const scale = 1 + t * 219;

        // SVG setAttribute is GPU-friendly for transforms
        maskGroup.setAttribute('transform',
            `translate(50, 52) scale(${scale}) translate(-50, -52)`
        );

        // Progress bar
        if (progressBar) {
            progressBar.style.width = (smoothProgress * 100) + '%';
        }

        // Intro UI fade
        if (introUi) {
            if (smoothProgress < 0.2) {
                const f = smoothProgress / 0.2;
                introUi.style.opacity = 1 - f;
                introUi.style.transform = `translateX(-50%) translateY(${-f * 60}px)`;
            } else {
                introUi.style.opacity = '0';
            }
        }

        // Curtain fade out after 75%
        if (smoothProgress > 0.75) {
            portalWrapper.style.opacity = 1 - ((smoothProgress - 0.75) / 0.25);
        }

        // Done
        if (smoothProgress >= 0.99) {
            completePortal();
            return;
        }

        requestAnimationFrame(render);
    }

    let rafRunning = false;
    function kick() {
        if (!rafRunning && !portalComplete) {
            rafRunning = true;
            requestAnimationFrame(function loop() {
                render();
                if (!portalComplete) {
                    rafRunning = true;
                    requestAnimationFrame(loop);
                } else {
                    rafRunning = false;
                }
            });
        }
    }

    function completePortal() {
        if (portalComplete) return;
        portalComplete = true;

        // Immediately abort all portal event listeners
        portalAC.abort();

        // Immediately unlock scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Fade out wrapper visually
        portalWrapper.style.transition = 'opacity 0.4s ease';
        portalWrapper.style.opacity = '0';

        setTimeout(() => {
            portalWrapper.style.display = 'none';
            portalWrapper.remove(); // fully remove from DOM for zero interference

            // Restart Lenis
            if (typeof lenis !== 'undefined' && lenis) {
                lenis.start();
            }
        }, 400);
    }

    // Auto-advance to 100%
    function autoAdvance() {
        if (portalComplete) return;
        isAutoAdvancing = true;
        function tick() {
            if (portalProgress < 1 && !portalComplete) {
                portalProgress += 0.012; // ~3.5s from 30% to 100%
                if (portalProgress > 1) portalProgress = 1;
                requestAnimationFrame(tick);
            }
        }
        tick();
    }

    // --- Wheel ---
    window.addEventListener('wheel', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        e.preventDefault();

        const delta = e.deltaY;
        const step = Math.sign(delta) * Math.min(Math.abs(delta), 120) / 120;
        portalProgress = Math.max(0, Math.min(1, portalProgress + step * 0.05));

        kick();

        if (portalProgress > 0.3 && !isAutoAdvancing) autoAdvance();
    }, { passive: false, signal });

    // --- Touch ---
    let lastTouchY = 0;

    window.addEventListener('touchstart', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        lastTouchY = e.touches[0].clientY;
    }, { passive: true, signal });

    window.addEventListener('touchmove', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        e.preventDefault();

        const y = e.touches[0].clientY;
        const delta = lastTouchY - y;
        lastTouchY = y;

        portalProgress = Math.max(0, Math.min(1, portalProgress + delta * 0.004));

        kick();

        if (portalProgress > 0.3 && !isAutoAdvancing) autoAdvance();
    }, { passive: false, signal });

    // Boot
    kick();
})();

