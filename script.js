/* ==========================================
   RÜZGAR UAV — JAVASCRIPT v6
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

  // Show 3D modal as splash screen after animations start
  setTimeout(() => {
    const modal = document.getElementById('uavModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (typeof window.init3DScene === 'function') {
        window.init3DScene();
      }
    }
  }, 1000);
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
  const colorInput = document.getElementById('droneColor');

  if (!modal || !container) return;

  let scene, camera, renderer, drone, animationId;
  let isInitialized = false;
  let materials = [];
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let entryProgress = 0;
  let currentZoom = 1.0;
  const initialPosition = new THREE.Vector3(8, 4, 12);
  const zoomDirection = initialPosition.clone().normalize();

  function updateZoom() {
    if (camera) {
      const distance = 14.96 * currentZoom;
      camera.position.copy(zoomDirection).multiplyScalar(distance);
    }
  }

  function initThree() {
    if (typeof THREE === 'undefined') return;

    // Clear old canvas
    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();

    scene = new THREE.Scene();
    // Arka planı şeffaf bırakıp, CSS ile stüdyo gradient'i veriyoruz
    container.style.background = 'radial-gradient(circle at center, #1e293b 0%, #020617 80%)';

    const w = container.clientWidth;
    const h = container.clientHeight;

    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(8, 4, 12);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const canvas = renderer.domElement;
    container.insertBefore(canvas, container.querySelector('.uav-hud-overlay'));

    // LIGHTING - Derinlik ve çoklu renk
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Derinlik için kısıldı
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x10182a, 0.6);
    scene.add(hemiLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0); // Ana beyaz ışık
    mainLight.position.set(15, 20, 15);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueLight = new THREE.DirectionalLight(0x0088ff, 3.5); // Sol canlı mavi ışık
    blueLight.position.set(-20, 10, 15);
    scene.add(blueLight);

    const pinkLight = new THREE.DirectionalLight(0xff0066, 3.0); // Sağ arka pembe/kırmızı ışık
    pinkLight.position.set(15, 5, -20);
    scene.add(pinkLight);

    // DRONE
    drone = new THREE.Group();
    scene.add(drone);

    // Try to load STL
    const modelPath = 'assets/model.STL';
    let modelLoaded = false;

    if (typeof THREE.STLLoader !== 'undefined') {
      const loader = new THREE.STLLoader();
      loader.load(
        modelPath,
        function (geometry) {
          modelLoaded = true;

          // Center the geometry vertices at (0,0,0) and compute bounds
          geometry.center();
          geometry.computeBoundingBox();

          const size = new THREE.Vector3();
          geometry.boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 9.5 / maxDim;

          const material = new THREE.MeshPhongMaterial({
            color: colorInput?.value || '#e63229',
            shininess: 100,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.scale.set(scale, scale, scale);
          mesh.position.set(0, 0, 0); // Position at 0,0,0 as geometry is already centered

          drone.add(mesh);
          materials.push(material);
          
          entryProgress = 0; // Modeli yükledikten sonra animasyonu tetikle
        },
        undefined,
        function (error) {
          console.warn('STL yüklenemedi:', error);
          if (!modelLoaded) {
            createFallbackDrone(drone);
          }
        }
      );
    } else {
      createFallbackDrone(drone);
    }

    // Fallback after timeout
    setTimeout(() => {
      if (!modelLoaded && drone.children.length === 0) {
        createFallbackDrone(drone);
      }
    }, 3000);

    isInitialized = true;
  }

  function createFallbackDrone(group) {
    const colorHex = colorInput?.value || '#e63229';
    materials = [];

    const baseMaterial = new THREE.MeshPhongMaterial({
      color: colorHex,
      shininess: 120,
      side: THREE.DoubleSide
    });

    // Fuselage
    const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.4, 5, 16);
    const bodyMaterial = baseMaterial.clone();
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotateX(Math.PI / 2);
    group.add(body);
    materials.push(bodyMaterial);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(10, 0.15, 1.5);
    const wingMaterial = baseMaterial.clone();
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.z = 0.5;
    group.add(wings);
    materials.push(wingMaterial);

    // Tail fin vertical
    const tailVGeometry = new THREE.BoxGeometry(0.15, 1.5, 0.8);
    const tailVMaterial = baseMaterial.clone();
    const tailV = new THREE.Mesh(tailVGeometry, tailVMaterial);
    tailV.position.set(0, 0.6, -2);
    group.add(tailV);
    materials.push(tailVMaterial);

    // Tail fin horizontal
    const tailHGeometry = new THREE.BoxGeometry(1.2, 0.15, 0.8);
    const tailHMaterial = baseMaterial.clone();
    const tailH = new THREE.Mesh(tailHGeometry, tailHMaterial);
    tailH.position.set(0, 0, -2.2);
    group.add(tailH);
    materials.push(tailHMaterial);

    entryProgress = 0; // Yedek model için animasyonu tetikle
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (drone) {
      // Entry animation when initialized
      if (entryProgress < 1) {
        entryProgress += 0.015;
        if (entryProgress > 1) entryProgress = 1;
        const ease = 1 - Math.pow(1 - entryProgress, 3); // Cubic ease out
        drone.position.z = 15 * (1 - ease);
        drone.position.y = -5 * (1 - ease);
        drone.rotation.x = (Math.PI / 4) * (1 - ease); // Rotates into place
      } else if (!isDragging) {
        drone.rotation.y += 0.003;
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // CONTROLS
  container.addEventListener('mousedown', () => {
    isDragging = true;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging && drone) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      drone.rotation.y += deltaMove.x * 0.015;
      drone.rotation.x += deltaMove.y * 0.015;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
  });

  // MOUSE WHEEL ZOOM
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.08;
    if (e.deltaY < 0) {
      currentZoom = Math.max(0.2, currentZoom - zoomSpeed); // Zoom in
    } else {
      currentZoom = Math.min(2.5, currentZoom + zoomSpeed); // Zoom out
    }
    updateZoom();
  }, { passive: false });

  // COLOR PICKER
  if (colorInput) {
    const updateColor = (e) => {
      const newColor = e.target.value;
      materials.forEach(mat => {
        if (mat && mat.color) {
          mat.color.set(newColor);
          mat.needsUpdate = true;
        }
      });
    };
    colorInput.addEventListener('input', updateColor);
    colorInput.addEventListener('change', updateColor);
  }

  // CLOSE
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }

  // MODAL TRIGGERS
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (btn && btn.id === 'confirmMissionBtn') return; // Bu butonu atla, kendi eventi var
    
    if (btn && (btn.id === 'navCtaBtn' || btn.id === 'heroCtaBtn' || btn.id === 'modelViewBtn' || (btn.innerText && btn.innerText.includes('MİSYON')))) {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (!isInitialized) {
        initThree();
      } else {
        entryProgress = 0;
      }
      animate();
    }
  });

  // Expose for splash screen
  window.init3DScene = function() {
    if (!isInitialized) {
      initThree();
    } else {
      entryProgress = 0;
    }
    animate();
  };
}

// ==========================================
// CONTACT FORM AJAX SUBMISSION
// ==========================================
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const btn = document.getElementById("submitFormBtn");
    btn.innerHTML = "GÖNDERİLİYOR...";
    btn.disabled = true;

    const data = new FormData(event.target);
    const action = event.target.action;

    if (action.includes("SENIN_FORM_ID_BURAYA")) {
      formStatus.style.display = "block";
      formStatus.style.backgroundColor = "rgba(230, 50, 41, 0.1)";
      formStatus.style.borderColor = "var(--red)";
      formStatus.style.color = "var(--red)";
      formStatus.innerHTML = "Lütfen formun çalışması için index.html içindeki 'SENIN_FORM_ID_BURAYA' kısmını kendi Formspree ID'niz ile değiştirin.";
      btn.innerHTML = "MESAJI GÖNDER";
      btn.disabled = false;
      return;
    }

    try {
      const response = await fetch(action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.style.display = "block";
        formStatus.style.backgroundColor = "rgba(0, 232, 122, 0.1)";
        formStatus.style.borderColor = "var(--green)";
        formStatus.style.color = "var(--green)";
        formStatus.innerHTML = "Mesajınız başarıyla iletildi. Teşekkürler!";
        form.reset();
      } else {
        throw new Error("Ağ hatası");
      }
    } catch (error) {
      formStatus.style.display = "block";
      formStatus.style.backgroundColor = "rgba(230, 50, 41, 0.1)";
      formStatus.style.borderColor = "var(--red)";
      formStatus.style.color = "var(--red)";
      formStatus.innerHTML = "Gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }

    btn.innerHTML = "MESAJI GÖNDER";
    btn.disabled = false;
  });
}

// ==========================================
// MISSION CONTINUE BUTTON
// ==========================================
const confirmMissionBtn = document.getElementById("confirmMissionBtn");
if (confirmMissionBtn) {
  confirmMissionBtn.addEventListener("click", () => {
    const modal = document.getElementById("uavModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfayı yenilemeden en üste kaydır
      history.replaceState(null, null, ' '); // URL hash'i temizle
    }, 300);
  });
}
