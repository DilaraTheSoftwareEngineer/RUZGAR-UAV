/* ==========================================
   RÜZGAR UAV — JAVASCRIPT v5
   ========================================== */

// ==========================================
// LOADER
// ==========================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const barFill = document.getElementById('loaderBarFill');
  const percent = document.getElementById('loaderPercent');
  let pct = 0;
  if (!loader) return;

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
    if (barFill) barFill.style.width = pct + '%';
    if (percent) percent.textContent = Math.floor(pct) + '%';
  }, 60);
})();

function startAnimations() {
  animateCounters();
  initReveal();
  initRadar();
  animateSpecBars();
  if (typeof init3DViewer === 'function') init3DViewer();
}

// ==========================================
// CURSOR
// ==========================================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
}, { passive: true });

function animateCursorTrail() {
  if (cursorTrail) {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
  }
  requestAnimationFrame(animateCursorTrail);
}
animateCursorTrail();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ==========================================
// NAVBAR & SMOOTH SCROLL
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ==========================================
// PARTICLE CANVAS
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const NUM = 80;
  const mkParticle = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.45 + 0.08,
    color: Math.random() > 0.7 ? 'rgba(230,50,41,' : 'rgba(42,91,168,'
  });
  const particles = Array.from({ length: NUM }, mkParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
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
// RADAR & HUD
// ==========================================
function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2, R = cx - 8;
  let angle = 0;
  function frame() {
    ctx.fillStyle = 'rgba(4, 5, 14, 0.22)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(26,58,107,0.28)'; ctx.stroke();
    angle += 0.016;
    requestAnimationFrame(frame);
  }
  frame();
}

(function hudLive() {
  const hudAlt = document.getElementById('hudAlt');
  const hudHdg = document.getElementById('hudHdg');
  const hudSpd = document.getElementById('hudSpd');
  let alt = 12400, hdg = 274, spd = 348;
  setInterval(() => {
    alt += Math.round((Math.random() - 0.5) * 10);
    hdg = (hdg + (Math.random() - 0.5)) % 360;
    spd += Math.round((Math.random() - 0.5) * 2);
    if (hudAlt) hudAlt.textContent = alt.toLocaleString('tr-TR') + ' m';
    if (hudHdg) hudHdg.textContent = Math.round((hdg + 360) % 360) + '°';
    if (hudSpd) hudSpd.textContent = spd + ' km/s';
  }, 1400);
})();

// ==========================================
// COUNTERS & REVEAL
// ==========================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const timer = setInterval(() => {
      cur += target / 60;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = Math.floor(cur);
    }, 22);
  });
}
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => obs.observe(el));
}
function animateSpecBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.spec-bar').forEach(bar => {
          if (bar.querySelector('.spec-bar-fill')) {
            bar.querySelector('.spec-bar-fill').style.width = bar.dataset.width + '%';
          }
        });
      }
    });
  }, { threshold: 0.2 });
  const s = document.getElementById('specs');
  if (s) obs.observe(s);
}

// ==========================================
// 3D UAV VIEWER (Three.js)
// ==========================================
function init3DViewer() {
  const modal = document.getElementById('uavModal');
  const container = document.getElementById('uavCanvasContainer');
  const closeBtn = document.getElementById('closeUavModal');
  if (!modal || !container) return;

  let scene, camera, renderer, drone, animationId;
  let isInitialized = false;

  function initThree() {
    if (typeof THREE === 'undefined') return;
    scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(5, 3, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(10, 10, 10);
    scene.add(dl);

    drone = new THREE.Group();
    // Fuselage
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.3, 4, 12),
      new THREE.MeshPhongMaterial({ color: 0x1a1f2e, shininess: 100 })
    );
    body.rotateX(Math.PI / 2);
    drone.add(body);

    // Wings
    const wings = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.1, 1),
      new THREE.MeshPhongMaterial({ color: 0x0a0f19 })
    );
    wings.position.z = 0.5;
    drone.add(wings);

    // Tail
    const tailMat = new THREE.MeshPhongMaterial({ color: 0x1a1f2e });
    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.5), tailMat);
    tail1.position.set(0.4, 0.5, -1.8);
    tail1.rotation.z = Math.PI / 4;
    drone.add(tail1);
    const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.5), tailMat);
    tail2.position.set(-0.4, 0.5, -1.8);
    tail2.rotation.z = -Math.PI / 4;
    drone.add(tail2);

    scene.add(drone);
    isInitialized = true;
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (drone && !isDragging) drone.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  // INTERACTION LOGIC
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  container.addEventListener('mousedown', e => { isDragging = true; });
  window.addEventListener('mouseup', e => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (isDragging && drone) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      drone.rotation.y += deltaMove.x * 0.01;
      drone.rotation.x += deltaMove.y * 0.01;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
  });

  // Global trigger
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, a');
    if (btn && (btn.id === 'navCtaBtn' || btn.id === 'heroCtaBtn' || btn.innerText.includes('MİSYON'))) {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (!isInitialized) initThree();
      animate();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      cancelAnimationFrame(animationId);
    });
  }
}
