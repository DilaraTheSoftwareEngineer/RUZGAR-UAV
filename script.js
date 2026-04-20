/* ==========================================
   RÜZGAR UAV — JAVASCRIPT
   ========================================== */

// ==========================================
// LOADER
// ==========================================
(function initLoader() {
  const loader     = document.getElementById('loader');
  const barFill    = document.getElementById('loaderBarFill');
  const percent    = document.getElementById('loaderPercent');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 15 + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        startAnimations();
      }, 400);
    }
    barFill.style.width = pct + '%';
    percent.textContent = Math.floor(pct) + '%';
  }, 80);
  document.body.style.overflow = 'hidden';
})();

function startAnimations() {
  animateCounters();
  initReveal();
  initRadar();
  animateSpecBars();
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', e => {
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .pillar, .system-card, .gallery-item, .contact-info-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width    = '22px';
    cursor.style.height   = '22px';
    cursor.style.background = 'var(--orange)';
    cursorTrail.style.width  = '50px';
    cursorTrail.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width    = '12px';
    cursor.style.height   = '12px';
    cursor.style.background = 'var(--primary)';
    cursorTrail.style.width  = '32px';
    cursorTrail.style.height = '32px';
  });
});

// ==========================================
// NAVBAR
// ==========================================
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburgerBtn');
const navLinks    = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ==========================================
// PARTICLE CANVAS
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NUM = 90;
  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? '#e63229' : '#2a5ba8'
    };
  }
  particles = Array.from({ length: NUM }, mkParticle);

  let mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p = particles[i], q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(42,91,168,${0.15 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      // drift toward mouse slightly
      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 180) {
        p.vx += dx / dist * 0.008;
        p.vy += dy / dist * 0.008;
      }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// HUD LIVE VALUES
// ==========================================
(function hudLive() {
  const hudAlt    = document.getElementById('hudAlt');
  const hudHdg    = document.getElementById('hudHdg');
  const hudSpd    = document.getElementById('hudSpd');

  let alt = 12400, hdg = 274, spd = 348;
  setInterval(() => {
    alt += Math.round((Math.random() - 0.5) * 8);
    hdg  = (hdg + (Math.random() - 0.5) * 1) % 360;
    spd += Math.round((Math.random() - 0.5) * 2);
    if (hudAlt) hudAlt.textContent = alt.toLocaleString('tr-TR') + ' m';
    if (hudHdg) hudHdg.textContent = Math.round(hdg) + '°';
    if (hudSpd) hudSpd.textContent = spd + ' km/s';
  }, 1200);
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
    }, 25);
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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

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
          setTimeout(() => {
            bar.querySelector('.spec-bar-fill').style.width = w + '%';
          }, 200);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  const specsSection = document.getElementById('specs');
  if (specsSection) obs.observe(specsSection);
}

// ==========================================
// RADAR CANVAS
// ==========================================
function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, R = cx - 10;
  let angle = 0;

  // Random blips
  const blips = Array.from({ length: 6 }, () => ({
    r:     Math.random() * (R - 20) + 10,
    theta: Math.random() * Math.PI * 2,
    alpha: 0,
    size:  Math.random() * 3 + 1.5
  }));

  function radarFrame() {
    ctx.fillStyle = 'rgba(3, 10, 20, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // rings
    [0.25, 0.5, 0.75, 1].forEach(f => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26,58,107,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.strokeStyle = 'rgba(26,58,107,0.15)';
    ctx.stroke();

    // sweep gradient
    const sweep = ctx.createConicalGradient
      ? null
      : (() => {
          const g = ctx.createLinearGradient(cx, cy, cx + R, cy);
          return g;
        })();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const sweepGrad = ctx.createLinearGradient(0, 0, R, 0);
    sweepGrad.addColorStop(0,   'rgba(230,50,41,0.4)');
    sweepGrad.addColorStop(0.4, 'rgba(230,50,41,0.10)');
    sweepGrad.addColorStop(1,   'rgba(230,50,41,0)');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, -0.25, 0.01);
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // sweep line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R, 0);
    ctx.strokeStyle = 'rgba(230,50,41,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // blips
    blips.forEach(b => {
      const sweepAngle = angle % (Math.PI * 2);
      const diff = ((b.theta - sweepAngle) + Math.PI * 2) % (Math.PI * 2);
      if (diff < 0.15) b.alpha = 1;
      if (b.alpha > 0) {
        const bx = cx + Math.cos(b.theta) * b.r;
        const by = cy + Math.sin(b.theta) * b.r;
        ctx.beginPath();
        ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,122,${b.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx, by, b.size + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,232,122,${b.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        b.alpha -= 0.003;
        if (b.alpha < 0) b.alpha = 0;
      }
    });

    // occasional new random blip
    if (Math.random() < 0.003) {
      blips.push({
        r: Math.random() * (R - 20) + 10,
        theta: angle,
        alpha: 1,
        size: Math.random() * 3 + 1.5
      });
      if (blips.length > 12) blips.shift();
    }

    angle += 0.018;
    requestAnimationFrame(radarFrame);
  }
  radarFrame();
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
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        text.textContent = 'MESAJı GÖNDER';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });
}

// ==========================================
// SMOOTH SCROLL for anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
