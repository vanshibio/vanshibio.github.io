const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const mouse = {
    x: -9999,
    y: -9999,
    radius: 220
};

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const glow = document.getElementById("mouseGlow");
    glow.style.left = mouse.x + "px";
    glow.style.top = mouse.y + "px";
});

window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
});

const particles = [];

const COUNT = 65;

for (let i = 0; i < COUNT; i++) {

    particles.push({

        x: Math.random() * w,
        y: Math.random() * h,

        ox: Math.random() * w,
        oy: Math.random() * h,

        vx: (Math.random() - .5) * .25,
        vy: (Math.random() - .5) * .25,

        size: Math.random() * 120 + 90

    });

}

function animate() {

    ctx.clearRect(0,0,w,h);

    ctx.globalCompositeOperation = "lighter";

    particles.forEach(p=>{

        p.ox += p.vx;
        p.oy += p.vy;

        if(p.ox < -150) p.ox = w+150;
        if(p.ox > w+150) p.ox = -150;

        if(p.oy < -150) p.oy = h+150;
        if(p.oy > h+150) p.oy = -150;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < mouse.radius){

            const angle = Math.atan2(dy,dx);

            const force = (mouse.radius-dist)/mouse.radius;

            p.x += Math.cos(angle)*force*12;
            p.y += Math.sin(angle)*force*12;

        }

        p.x += (p.ox-p.x)*0.03;
        p.y += (p.oy-p.y)*0.03;

        const g = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size
        );

        g.addColorStop(0,"rgba(215,182,122,.13)");
        g.addColorStop(.45,"rgba(215,182,122,.05)");
        g.addColorStop(1,"rgba(215,182,122,0)");

        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();

    });

    ctx.strokeStyle="rgba(215,182,122,.04)";
    ctx.lineWidth=1;

    for(let i=0;i<particles.length;i++){

        for(let j=i+1;j<particles.length;j++){

            const a=particles[i];
            const b=particles[j];

            const dx=a.x-b.x;
            const dy=a.y-b.y;

            const d=Math.sqrt(dx*dx+dy*dy);

            if(d<240){

                ctx.globalAlpha=1-d/240;

                ctx.beginPath();

                ctx.moveTo(a.x,a.y);

                ctx.lineTo(b.x,b.y);

                ctx.stroke();

            }

        }

    }

    ctx.globalAlpha=1;

    requestAnimationFrame(animate);

}

animate();
