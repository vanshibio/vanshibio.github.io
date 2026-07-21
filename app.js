/* ==========================================
   vanshi.bio
   app.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       Elements
    ------------------------- */

    const nav = document.querySelector("nav");
    const hero = document.querySelector(".hero");
    const glow = document.querySelector(".hero-glow");

    const cards = document.querySelectorAll(".card");
    const socials = document.querySelectorAll(".socials a");
    const button = document.querySelector("button");

    /* -------------------------
       Navbar Scroll
    ------------------------- */

    function updateNavbar() {

        if (window.scrollY > 40) {

            nav.style.background = "rgba(10,10,10,.72)";
            nav.style.borderColor = "rgba(245,210,122,.18)";
            nav.style.backdropFilter = "blur(35px)";
            nav.style.boxShadow =
                "0 20px 70px rgba(0,0,0,.55)";

        } else {

            nav.style.background = "";
            nav.style.borderColor = "";
            nav.style.backdropFilter = "";
            nav.style.boxShadow = "";

        }

    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar);

    /* -------------------------
       Mouse Parallax
    ------------------------- */

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", e => {

        mouseX = (e.clientX / window.innerWidth - .5);
        mouseY = (e.clientY / window.innerHeight - .5);

    });

    function animateGlow() {

        currentX += (mouseX - currentX) * .06;
        currentY += (mouseY - currentY) * .06;

        glow.style.transform =
            `translate(${currentX * 80}px, ${currentY * 80}px)`;

        requestAnimationFrame(animateGlow);

    }

    animateGlow();

    /* -------------------------
       Reveal Animation
    ------------------------- */

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = 1;
                entry.target.style.transform =
                    "translateY(0px)";

            }

        });

    }, {

        threshold: .15

    });

    document
        .querySelectorAll(".card,.hero-content")
        .forEach(el => {

            el.style.opacity = 0;
            el.style.transform = "translateY(50px)";
            el.style.transition =
                "all .9s cubic-bezier(.2,.9,.2,1)";

            observer.observe(el);

        });

    /* -------------------------
       Button Glow
    ------------------------- */

    button.addEventListener("mousemove", e => {

        const rect = button.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.background =
            `radial-gradient(circle at ${x}px ${y}px,
            #fff5cf 0%,
            #f5d27a 20%,
            #d8af57 65%,
            #b8872f 100%)`;

    });

    button.addEventListener("mouseleave", () => {

        button.style.background =
            "linear-gradient(135deg,#F5D27A,#D8AF57)";

    });

    /* -------------------------
       Card Tilt
    ------------------------- */

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - .5) * 10;

            const rotateX =
                ((y / rect.height) - .5) * -10;

            card.style.transform =
                `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                `;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(900px) rotateX(0deg) rotateY(0deg)";

        });

    });

    /* -------------------------
       Social Hover Rotation
    ------------------------- */

    socials.forEach(icon => {

        icon.addEventListener("mouseenter", () => {

            icon.style.transform =
                "translateY(-6px) rotate(10deg) scale(1.08)";

        });

        icon.addEventListener("mouseleave", () => {

            icon.style.transform = "";

        });

    });

    /* -------------------------
       Hero Float
    ------------------------- */

    let t = 0;

    function floatHero() {

        t += 0.01;

        hero.style.transform =
            `translateY(${Math.sin(t) * 4}px)`;

        requestAnimationFrame(floatHero);

    }

    floatHero();

    /* -------------------------
       Gold Cursor Glow
    ------------------------- */

    const cursorGlow = document.createElement("div");

    cursorGlow.style.position = "fixed";
    cursorGlow.style.width = "220px";
    cursorGlow.style.height = "220px";
    cursorGlow.style.borderRadius = "50%";
    cursorGlow.style.pointerEvents = "none";
    cursorGlow.style.left = "0";
    cursorGlow.style.top = "0";
    cursorGlow.style.zIndex = "1";
    cursorGlow.style.mixBlendMode = "screen";
    cursorGlow.style.filter = "blur(55px)";
    cursorGlow.style.background =
        "radial-gradient(circle,#F5D27A55 0%,transparent 70%)";

    document.body.appendChild(cursorGlow);

    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;

    let targetX = glowX;
    let targetY = glowY;

    document.addEventListener("mousemove", e => {

        targetX = e.clientX;
        targetY = e.clientY;

    });

    function animateCursor() {

        glowX += (targetX - glowX) * .12;
        glowY += (targetY - glowY) * .12;

        cursorGlow.style.transform =
            `translate(${glowX - 110}px,${glowY - 110}px)`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

});
