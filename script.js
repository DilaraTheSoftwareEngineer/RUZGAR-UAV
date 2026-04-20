/* ==========================================
   RÜZGAR UAV — JAVASCRIPT v3
   ========================================== */

// ==========================================
// LOADER
// ==========================================
(function initLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('loaderBarFill');
  const percent = document.getElementById('loaderPercent');
  let pct = 0;
  document.body.style.overflow = 'hidden';
  const interval = setInterval(() => {
    pct += Math.random() * 14 + 3;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        startAnimations();
      }, 350);
    }
    barFill.style.width = pct + '%';
    percent.textContent = Math.floor(pct) + '%';
  }, 60);
})();

function startAnimations() {
  animateCounters();
  initReveal();
  initRadar();
  animateSpecBars();
}

// ==========================================
// CURSOR — fast RAF-based, max z-index
// ==========================================
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX  = 0, trailY  = 0;

// Direct pixel-precise cursor tracking
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Move primary cursor immediately (no lag)
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
}, { passive: true });

// Trail follows with smooth lerp via RAF
function animateCursorTrail() {
  trailX += (mouseX - trailX) * 0.18;
  trailY += (mouseY - trailY) * 0.18;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateCursorTrail);
}
animateCursorTrail();

// Hover enlargement via class on body
document.querySelectorAll('a, button, .pillar, .system-card, .gallery-item, .contact-info-card, .team-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ==========================================
// NAVBAR
// ==========================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburgerBtn');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ==========================================
// PARTICLE CANVAS
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NUM = 80;
  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.08,
      // 70% navy-light, 30% red
      color: Math.random() > 0.7 ? 'rgba(230,50,41,' : 'rgba(42,91,168,'
    };
  }
  const particles = Array.from({ length: NUM }, mkParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p = particles[i], q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(42,91,168,${0.12 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      // subtle pull toward mouse
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 160 && dist > 0) {
        p.vx += dx / dist * 0.006;
        p.vy += dy / dist * 0.006;
      }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx;  p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// HUD LIVE VALUES
// ==========================================
(function hudLive() {
  const hudAlt = document.getElementById('hudAlt');
  const hudHdg = document.getElementById('hudHdg');
  const hudSpd = document.getElementById('hudSpd');
  let alt = 12400, hdg = 274, spd = 348;
  setInterval(() => {
    alt += Math.round((Math.random() - 0.5) * 10);
    hdg  = (hdg + (Math.random() - 0.5)) % 360;
    spd += Math.round((Math.random() - 0.5) * 2);
    if (hudAlt) hudAlt.textContent = alt.toLocaleString('tr-TR') + ' m';
    if (hudHdg) hudHdg.textContent = Math.round((hdg + 360) % 360) + '°';
    if (hudSpd) hudSpd.textContent = spd + ' km/s';
  }, 1400);
})();

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = Math.floor(cur);
    }, 22);
  });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => obs.observe(el));
}

// ==========================================
// SPEC BARS
// ==========================================
function animateSpecBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.spec-bar').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.querySelector('.spec-bar-fill').style.width = w + '%'; }, 200);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const s = document.getElementById('specs');
  if (s) obs.observe(s);
}

// ==========================================
// RADAR CANVAS
// ==========================================
function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, R = cx - 8;
  let angle = 0;

  const blips = Array.from({ length: 6 }, () => ({
    r: Math.random() * (R - 20) + 10,
    theta: Math.random() * Math.PI * 2,
    alpha: 0, size: Math.random() * 2.5 + 1.5
  }));

  function frame() {
    ctx.fillStyle = 'rgba(4, 5, 14, 0.22)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // rings
    [0.25, 0.5, 0.75, 1].forEach(f => {
      ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26,58,107,0.28)'; ctx.lineWidth = 1; ctx.stroke();
    });

    // crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.strokeStyle = 'rgba(26,58,107,0.18)'; ctx.stroke();

    // sweep
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(angle);
    const g = ctx.createLinearGradient(0, 0, R, 0);
    g.addColorStop(0,   'rgba(230,50,41,0.42)');
    g.addColorStop(0.5, 'rgba(230,50,41,0.08)');
    g.addColorStop(1,   'rgba(230,50,41,0)');
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, -0.28, 0.01);
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0);
    ctx.strokeStyle = 'rgba(230,50,41,0.85)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // blips
    blips.forEach(b => {
      const sa = angle % (Math.PI * 2);
      const diff = ((b.theta - sa) + Math.PI * 2) % (Math.PI * 2);
      if (diff < 0.18) b.alpha = 1;
      if (b.alpha > 0) {
        const bx = cx + Math.cos(b.theta) * b.r;
        const by = cy + Math.sin(b.theta) * b.r;
        ctx.beginPath(); ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,122,${b.alpha})`; ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, b.size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,232,122,${b.alpha * 0.35})`;
        ctx.lineWidth = 1; ctx.stroke();
        b.alpha = Math.max(0, b.alpha - 0.003);
      }
    });

    if (Math.random() < 0.004) {
      blips.push({ r: Math.random()*(R-20)+10, theta: angle, alpha: 1, size: Math.random()*2.5+1.5 });
      if (blips.length > 14) blips.shift();
    }

    angle += 0.016;
    requestAnimationFrame(frame);
  }
  frame();
}

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = document.getElementById('submitFormBtn');
    const text = document.getElementById('submitBtnText');
    btn.disabled = true;
    text.textContent = 'GÖNDERİLİYOR...';
    setTimeout(() => {
      text.textContent = '✓ MESAJ İLETİLDİ';
      btn.style.background = 'var(--navy-light)';
      setTimeout(() => {
        text.textContent = 'MESAJI GÖNDER';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
