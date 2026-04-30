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

    let portalProgress = 0;       // raw accumulated progress (0-1)
    let smoothProgress = 0;       // smoothed/lerped progress for rendering
    let isAutoAdvancing = false;
    let portalComplete = false;
    let animating = false;

    // Disable body scroll during portal
    document.body.style.overflow = 'hidden';

    // Stop Lenis initially
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.stop();
    }

    // Cinematic cubic-bezier easing: heavy feel
    function cinematicEase(t) {
        // Attempt to mimic cubic-bezier(0.77, 0, 0.175, 1) 
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        // Approximation using a quintic
        return t < 0.5
            ? 16 * t * t * t * t * t
            : 1 - Math.pow(-2 * t + 2, 5) / 2;
    }

    function render() {
        if (portalComplete) return;

        // Smooth interpolation (lerp) for buttery animation
        smoothProgress += (portalProgress - smoothProgress) * 0.08;

        // Clamp
        if (smoothProgress > 0.999) smoothProgress = 1;
        if (smoothProgress < 0) smoothProgress = 0;

        let easedProgress = cinematicEase(smoothProgress);

        // Scale from 1 to 220
        let scale = 1 + (easedProgress * 219);

        // Use setAttribute for smooth SVG transforms
        maskGroup.setAttribute('transform', 
            `translate(50, 52) scale(${scale}) translate(-50, -52)`
        );

        // Progress bar
        if (progressBar) {
            progressBar.style.width = `${smoothProgress * 100}%`;
        }

        // Intro UI fade + translate upwards
        if (introUi) {
            if (smoothProgress < 0.2) {
                let uiFade = 1 - (smoothProgress / 0.2);
                let uiShift = -(smoothProgress / 0.2) * 60;
                introUi.style.opacity = uiFade;
                introUi.style.transform = `translateX(-50%) translateY(${uiShift}px)`;
            } else {
                introUi.style.opacity = '0';
                introUi.style.transform = 'translateX(-50%) translateY(-60px)';
            }
        }

        // Fade out the whole curtain after 80%
        if (smoothProgress > 0.8) {
            let fadeAmt = (smoothProgress - 0.8) / 0.2;
            portalWrapper.style.opacity = 1 - fadeAmt;
        } else {
            portalWrapper.style.opacity = '1';
        }

        // Complete
        if (smoothProgress >= 0.999) {
            completePortal();
            return;
        }

        requestAnimationFrame(render);
    }

    function startRenderLoop() {
        if (!animating) {
            animating = true;
            requestAnimationFrame(render);
        }
    }

    function completePortal() {
        portalComplete = true;
        portalWrapper.style.opacity = '0';
        
        setTimeout(() => {
            portalWrapper.style.display = 'none';
            document.body.style.overflow = '';
            
            if (typeof lenis !== 'undefined' && lenis) {
                lenis.start();
            }
        }, 300);
    }

    // Auto-advance: smoothly animate from current to 1.0
    function autoAdvance() {
        if (portalComplete) return;
        isAutoAdvancing = true;

        function tick() {
            if (portalProgress < 1) {
                portalProgress += 0.008; // ~4 seconds from 0.3 to 1.0
                if (portalProgress > 1) portalProgress = 1;
                requestAnimationFrame(tick);
            }
        }
        tick();
    }

    // Wheel handler
    window.addEventListener('wheel', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        e.preventDefault();

        // Normalize delta
        let delta = e.deltaY;
        let normalized = Math.sign(delta) * Math.min(Math.abs(delta), 100) / 100;
        portalProgress += normalized * 0.04;
        
        if (portalProgress < 0) portalProgress = 0;
        if (portalProgress > 1) portalProgress = 1;

        startRenderLoop();

        // Auto advance trigger at 30%
        if (portalProgress > 0.3 && !isAutoAdvancing) {
            autoAdvance();
        }
    }, { passive: false });

    // Touch handlers for mobile
    let touchStartY = 0;
    let lastTouchY = 0;

    window.addEventListener('touchstart', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (portalComplete || isAutoAdvancing) return;
        e.preventDefault();

        let currentY = e.touches[0].clientY;
        let delta = lastTouchY - currentY;
        lastTouchY = currentY;

        portalProgress += delta * 0.002;
        if (portalProgress < 0) portalProgress = 0;
        if (portalProgress > 1) portalProgress = 1;

        startRenderLoop();

        if (portalProgress > 0.3 && !isAutoAdvancing) {
            autoAdvance();
        }
    }, { passive: false });

    // Start the render loop immediately
    startRenderLoop();
})();

