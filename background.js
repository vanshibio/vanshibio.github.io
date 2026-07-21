/* ==========================================
   vanshi.bio
   background.js
   Animated Golden Spotlights
========================================== */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w;
let h;
let dpr;

function resize() {

    dpr = window.devicePixelRatio || 1;

    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

resize();

window.addEventListener("resize", resize);

/* ========================================== */

const beams = [];

const beamCount = 14;

for (let i = 0; i < beamCount; i++) {

    beams.push({

        x: Math.random() * w,

        width: 120 + Math.random() * 240,

        angle: (Math.random() - .5) * .45,

        alpha: .02 + Math.random() * .045,

        speed: .00025 + Math.random() * .0005,

        phase: Math.random() * Math.PI * 2,

        offset: Math.random() * 200

    });

}

/* ========================================== */

const particles = [];

for (let i = 0; i < 180; i++) {

    particles.push({

        x: Math.random() * w,

        y: Math.random() * h,

        r: Math.random() * 1.8 + .2,

        a: Math.random() * .25,

        vy: .08 + Math.random() * .4,

        vx: (Math.random() - .5) * .15

    });

}

/* ========================================== */

let mouseX = w / 2;
let mouseY = h / 2;

document.addEventListener("mousemove", e => {

    mouseX = e.clientX;
    mouseY = e.clientY;

});

/* ========================================== */

function spotlight(beam, time) {

    const sway =
        Math.sin(time * beam.speed + beam.phase) * 120;

    const x =
        beam.x + sway;

    ctx.save();

    ctx.translate(x, -150);

    ctx.rotate(beam.angle);

    const grad = ctx.createLinearGradient(
        0,
        0,
        0,
        h + 300
    );

    grad.addColorStop(0,
        `rgba(245,210,122,${beam.alpha})`);

    grad.addColorStop(.25,
        `rgba(245,210,122,${beam.alpha * .45})`);

    grad.addColorStop(1,
        "rgba(245,210,122,0)");

    ctx.fillStyle = grad;

    ctx.beginPath();

    ctx.moveTo(-beam.width / 2, 0);

    ctx.lineTo(beam.width / 2, 0);

    ctx.lineTo(beam.width * 2.8, h + 300);

    ctx.lineTo(-beam.width * 2.8, h + 300);

    ctx.closePath();

    ctx.fill();

    ctx.restore();

}

/* ========================================== */

function drawGlow() {

    const g = ctx.createRadialGradient(

        mouseX,
        mouseY,

        0,

        mouseX,
        mouseY,

        350

    );

    g.addColorStop(0,
        "rgba(245,210,122,.12)");

    g.addColorStop(.4,
        "rgba(245,210,122,.04)");

    g.addColorStop(1,
        "rgba(245,210,122,0)");

    ctx.fillStyle = g;

    ctx.fillRect(0, 0, w, h);

}

/* ========================================== */

function drawParticles() {

    particles.forEach(p => {

        p.y -= p.vy;
        p.x += p.vx;

        if (p.y < -20) {

            p.y = h + 20;
            p.x = Math.random() * w;

        }

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,236,180,${p.a})`;

        ctx.fill();

    });

}

/* ========================================== */

function topGlow() {

    const grad =
        ctx.createRadialGradient(

            w / 2,
            -120,

            0,

            w / 2,
            -120,

            800

        );

    grad.addColorStop(
        0,
        "rgba(245,210,122,.18)"
    );

    grad.addColorStop(
        .45,
        "rgba(245,210,122,.06)"
    );

    grad.addColorStop(
        1,
        "rgba(245,210,122,0)"
    );

    ctx.fillStyle = grad;

    ctx.fillRect(0, 0, w, h);

}

/* ========================================== */

function animate(time) {

    ctx.clearRect(0, 0, w, h);

    topGlow();

    ctx.globalCompositeOperation = "lighter";

    beams.forEach(b => spotlight(b, time));

    drawGlow();

    drawParticles();

    ctx.globalCompositeOperation = "source-over";

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);
