/* ==========================================================================
   vanshi.bio — background canvas + interactions
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- Canvas setup ---------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Pointer tracking ---------- */
  const pointer = { x: W / 2, y: H * 0.35, active: false };
  const glow = { x: pointer.x, y: pointer.y }; // eased/trailing position

  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("pointerdown", () => { pointer.active = true; });

  /* ---------- Ambient drifting orbs ---------- */
  const ORB_COUNT = 5;
  const orbs = Array.from({ length: ORB_COUNT }, (_, i) => ({
    baseX: Math.random() * W,
    baseY: Math.random() * H,
    r: 180 + Math.random() * 220,
    speed: 0.15 + Math.random() * 0.2,
    angle: Math.random() * Math.PI * 2,
    orbit: 60 + Math.random() * 120,
    hue: i % 2 === 0 ? "gold-a" : "gold-b",
    alpha: 0.05 + Math.random() * 0.05
  }));

  /* ---------- Fine particle sparks ---------- */
  const SPARK_COUNT = Math.min(70, Math.floor((W * H) / 22000));
  const sparks = Array.from({ length: SPARK_COUNT }, () => spawnSpark());

  function spawnSpark() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: 0.15 + Math.random() * 0.35,
      twinkleSpeed: 0.4 + Math.random() * 0.8,
      twinklePhase: Math.random() * Math.PI * 2
    };
  }

  let t = 0;

  function draw() {
    t += 0.0032;

    // base gradient wash (repaint clean each frame)
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W * 0.5, H * -0.1, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
    bg.addColorStop(0, "#17140f");
    bg.addColorStop(0.55, "#0b0a08");
    bg.addColorStop(1, "#060504");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ambient drifting gold orbs */
    ctx.globalCompositeOperation = "screen";
    orbs.forEach((o) => {
      o.angle += o.speed * 0.01;
      const x = o.baseX + Math.cos(o.angle) * o.orbit;
      const y = o.baseY + Math.sin(o.angle * 0.8) * o.orbit;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, o.r);
      grad.addColorStop(0, `rgba(212,175,106,${o.alpha})`);
      grad.addColorStop(0.5, `rgba(180,140,80,${o.alpha * 0.4})`);
      grad.addColorStop(1, "rgba(180,140,80,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* fine sparks */
    ctx.globalCompositeOperation = "screen";
    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;
      const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 10 + s.twinklePhase);
      ctx.beginPath();
      ctx.fillStyle = `rgba(230,193,121,${s.alpha * tw})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* cursor-following blurred gold smear */
    const ease = pointer.active ? 0.06 : 0.015;
    glow.x += (pointer.x - glow.x) * ease;
    glow.y += (pointer.y - glow.y) * ease;

    const pulse = 1 + Math.sin(t * 6) * 0.04;
    const baseR = (pointer.active ? 340 : 260) * pulse;

    ctx.globalCompositeOperation = "screen";
    const cursorGrad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, baseR);
    cursorGrad.addColorStop(0, "rgba(245,226,179,0.30)");
    cursorGrad.addColorStop(0.25, "rgba(230,193,121,0.20)");
    cursorGrad.addColorStop(0.55, "rgba(169,128,63,0.10)");
    cursorGrad.addColorStop(1, "rgba(169,128,63,0)");
    ctx.fillStyle = cursorGrad;
    ctx.beginPath();
    ctx.arc(glow.x, glow.y, baseR, 0, Math.PI * 2);
    ctx.fill();

    // trailing smear toward previous glow position (motion blur feel)
    const trailX = glow.x - (pointer.x - glow.x) * 1.4;
    const trailY = glow.y - (pointer.y - glow.y) * 1.4;
    const trailGrad = ctx.createRadialGradient(trailX, trailY, 0, trailX, trailY, baseR * 0.7);
    trailGrad.addColorStop(0, "rgba(212,175,106,0.12)");
    trailGrad.addColorStop(1, "rgba(212,175,106,0)");
    ctx.fillStyle = trailGrad;
    ctx.beginPath();
    ctx.arc(trailX, trailY, baseR * 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  if (prefersReducedMotion) {
    // draw a single static frame
    draw();
  } else {
    requestAnimationFrame(draw);
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 12) nav.style.background = "rgba(11,10,8,0.78)";
    else nav.style.background = "rgba(11,10,8,0.55)";
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Waitlist form (static/demo) ---------- */
  const form = document.getElementById("waitlistForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.textContent = "Danke — du bist auf der Liste. ✦";
      form.reset();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(".about-card, .feature-card, .price-card, .board-row");
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1)";
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => io.observe(el));
})();
