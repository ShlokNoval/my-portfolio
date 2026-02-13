/* ============================= */
/* CANVAS SETUP */
/* ============================= */

const canvas = document.getElementById("dna-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* ============================= */
/* OPTIMIZED DNA ANIMATION */
/* ============================= */
ctx.lineWidth = 1;
ctx.lineCap = "round";

let time = 0;
let lastTime = 0;
const fps = 45;
const interval = 1000 / fps;

function animateDNA(timestamp) {

    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > interval) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width * 0.7;
        const spacing = 20;
        const radius = 140;

        for (let y = 0; y < canvas.height; y += spacing) {

            const angle = y * 0.018 + time;
            const depth = (Math.sin(angle) + 1) / 2;

            const x1 = centerX + Math.sin(angle) * radius;
            const x2 = centerX - Math.sin(angle) * radius;

            const dotSize = 2 + depth * 2;
            const alpha = 0.2 + depth * 0.8;

            ctx.beginPath();
            ctx.arc(x2, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,122,24,${alpha * 0.5})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x1, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,122,24,${alpha})`;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = `rgba(255,122,24,${alpha * 0.2})`;
            ctx.stroke();
        }

        time += 0.01;
        lastTime = timestamp;
    }

    requestAnimationFrame(animateDNA);
}

/* Start DNA only on larger screens */
if (window.innerWidth > 768) {
    requestAnimationFrame(animateDNA);
}


/* ============================= */
/* SCROLL REVEAL */
/* ============================= */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // animate only once
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach(el => {
    observer.observe(el);
});


/* ============================= */
/* NAVBAR SCROLL EFFECT */
/* ============================= */

const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* ============================= */
/* SMOOTH NAVIGATION SCROLL */
/* ============================= */

document.querySelectorAll("a[href^='#']").forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");

        if (targetId.length > 1) {
            e.preventDefault();

            const targetSection = document.querySelector(targetId);

            if (targetSection) {

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                /* 🔥 Immediately update active nav */
                document.querySelectorAll("nav a").forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === targetId) {
                        link.classList.add("active");
                    }
                });
            }
        }
    });
});

/* ============================= */
/* ACTIVE NAVBAR SECTION */
/* ============================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === "#" + id) {
                    link.classList.add("active");
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));


/* ============================= */
/* TAGLINE TYPING ANIMATION */
/* ============================= */

const taglineText = "Building intelligent systems to solve real-world problems.";
const taglineElement = document.getElementById("typing-tagline");

let taglineIndex = 0;

function typeTagline() {
    if (taglineIndex < taglineText.length) {
        taglineElement.innerHTML += taglineText.charAt(taglineIndex);
        taglineIndex++;
        setTimeout(typeTagline, 40);
    }
}

window.addEventListener("load", () => {
    setTimeout(typeTagline, 600);
});


/* ============================= */
/* SCROLL PROGRESS BAR */
/* ============================= */

const scrollBar = document.getElementById("scrollBar");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollBar.style.width = scrollPercent + "%";
});


/* ============================= */
/* ULTRA PREMIUM CUSTOM CURSOR */
/* ============================= */

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = outlineX + "px";
    cursorOutline.style.top = outlineY + "px";

    requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverElements = document.querySelectorAll("a, button, .project-card");

hoverElements.forEach(el => {

    el.addEventListener("mouseenter", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.8)";
    });

    el.addEventListener("mouseleave", () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        el.style.transform = "translate(0, 0)";
    });

    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - (rect.left + rect.width / 2);
        const offsetY = e.clientY - (rect.top + rect.height / 2);

        el.style.transform = `translate(${offsetX * 0.05}px, ${offsetY * 0.05}px)`;
    });
});

window.addEventListener("mousedown", () => {
    cursorOutline.classList.add("click");
});

window.addEventListener("mouseup", () => {
    cursorOutline.classList.remove("click");
});


/* ============================= */
/* 3D PROJECT CARD TILT */
/* ============================= */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 15;
        const rotateY = (x - centerX) / 15;

        card.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = `
            rotateX(0deg)
            rotateY(0deg)
            translateY(0px)
        `;
    });
});


/* ============================= */
/* HERO PARALLAX */
/* ============================= */

const heroSection = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const heroContent = document.querySelector(".hero-content");

if (window.innerWidth > 992) {

    heroSection.addEventListener("mousemove", (e) => {

        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / 40;
        const moveY = (y - centerY) / 40;

        heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        heroContent.style.transform = `translate(${moveX * 0.6}px, ${moveY * 0.6}px)`;
    });

    heroSection.addEventListener("mouseleave", () => {
        heroImage.style.transform = "translate(0,0)";
        heroContent.style.transform = "translate(0,0)";
    });
}
