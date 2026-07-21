// ================================
// Mouse Glow (Smooth Follow)
// ================================

const glow = document.getElementById("mouseGlow");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;

window.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

});

function animateGlow(){

    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    glow.style.left = currentX + "px";
    glow.style.top = currentY + "px";

    requestAnimationFrame(animateGlow);

}

animateGlow();


// ================================
// Navbar Blur on Scroll
// ================================

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

    if(window.scrollY > 10){

        nav.style.background = "rgba(18,18,18,.72)";
        nav.style.borderColor = "rgba(255,255,255,.08)";
        nav.style.backdropFilter = "blur(24px)";

    }else{

        nav.style.background = "rgba(20,20,20,.45)";
        nav.style.borderColor = "rgba(255,255,255,.06)";
        nav.style.backdropFilter = "blur(18px)";

    }

});


// ================================
// Hero Fade In
// ================================

const hero = document.querySelector(".hero");

hero.style.opacity = "0";
hero.style.transform = "translateY(30px)";

window.addEventListener("load", ()=>{

    setTimeout(()=>{

        hero.style.transition = "all .9s ease";

        hero.style.opacity = "1";
        hero.style.transform = "translateY(0px)";

    },250);

});


// ================================
// Claim Button Hover Glow
// ================================

const claimBtn = document.querySelector(".claim button");

claimBtn.addEventListener("mouseenter",()=>{

    claimBtn.style.boxShadow =
    "0 0 40px rgba(215,182,122,.45)";

});

claimBtn.addEventListener("mouseleave",()=>{

    claimBtn.style.boxShadow = "none";

});


// ================================
// Signup Button Glow
// ================================

const signup = document.querySelector(".signup");

signup.addEventListener("mouseenter",()=>{

    signup.style.transform = "translateY(-2px) scale(1.02)";

});

signup.addEventListener("mouseleave",()=>{

    signup.style.transform = "translateY(0px) scale(1)";

});


// ================================
// Tiny Floating Animation
// ================================

let t = 0;

function floatHero(){

    t += 0.01;

    hero.style.transform =
        `translateY(${Math.sin(t) * 6}px)`;

    requestAnimationFrame(floatHero);

}

setTimeout(floatHero,1200);
