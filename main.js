import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/* ============================================================
   1. CUSTOM CURSOR (dot + trailing ring, eased)
   ============================================================ */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorRing = document.querySelector('[data-cursor-ring]');
const isTouch = window.matchMedia('(hover: none)').matches;

const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const ring = { x: mouse.x, y: mouse.y };

if (!isTouch) {
  cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;
  cursorRing.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%)`;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%,-50%)`;
  });

  document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });

  (function tickCursor() {
    ring.x += (mouse.x - ring.x) * 0.15;
    ring.y += (mouse.y - ring.y) * 0.15;
    cursorRing.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%)`;
    requestAnimationFrame(tickCursor);
  })();
}

/* ============================================================
   2. HERO SPOTLIGHT — CSS custom properties track the cursor
   ============================================================ */
const heroOverlay = document.querySelector('[data-spotlight]');
const hero = document.getElementById('hero');

hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  heroOverlay.style.setProperty('--x', `${x}%`);
  heroOverlay.style.setProperty('--y', `${y}%`);
});

/* ============================================================
   3. MAGNETIC BUTTONS / CARDS
   ============================================================ */
if (!isTouch) {
  document.querySelectorAll('.magnetic, .magnetic-card').forEach((el) => {
    const strength = el.classList.contains('magnetic-card') ? 0.15 : 0.35;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* ============================================================
   4. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ============================================================
   5. NAV BACKGROUND ON SCROLL + MARQUEE PARALLAX
   ============================================================ */
const nav = document.querySelector('[data-nav]');
const marquee = document.querySelector('.marquee-track');
let marqueeOffset = 0;

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
});

(function tickMarquee() {
  const speed = parseFloat(marquee.dataset.speed) || 0.25;
  marqueeOffset -= speed;
  if (Math.abs(marqueeOffset) >= marquee.scrollWidth / 2) marqueeOffset = 0;
  marquee.style.transform = `translateX(${marqueeOffset}px)`;
  requestAnimationFrame(tickMarquee);
})();

/* ============================================================
   6. COUNT-UP STATS
   ============================================================ */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => counterObserver.observe(el));

/* ============================================================
   7. THREE.JS INTERACTIVE PARTICLE FIELD (hero background)
   ============================================================ */
const canvas = document.getElementById('particle-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const PARTICLE_COUNT = 260;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const basePositions = new Float32Array(PARTICLE_COUNT * 3);
const velocities = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const x = (Math.random() - 0.5) * 14;
  const y = (Math.random() - 0.5) * 8;
  const z = (Math.random() - 0.5) * 6;
  positions.set([x, y, z], i * 3);
  basePositions.set([x, y, z], i * 3);
  velocities.set(
    [(Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.004],
    i * 3
  );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Soft circular sprite drawn on a canvas, used as the particle texture.
const spriteCanvas = document.createElement('canvas');
spriteCanvas.width = 64;
spriteCanvas.height = 64;
const sctx = spriteCanvas.getContext('2d');
const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
grad.addColorStop(0, 'rgba(255,255,255,1)');
grad.addColorStop(0.4, 'rgba(180,150,255,0.7)');
grad.addColorStop(1, 'rgba(180,150,255,0)');
sctx.fillStyle = grad;
sctx.fillRect(0, 0, 64, 64);
const sprite = new THREE.CanvasTexture(spriteCanvas);

const material = new THREE.PointsMaterial({
  size: 0.22,
  map: sprite,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  opacity: 0.85,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Mouse position projected into the same 3D space as the particles.
const mouse3D = new THREE.Vector3(9999, 9999, 0);
const planeZ = 0;

window.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  if (e.clientY < rect.top || e.clientY > rect.bottom) {
    mouse3D.set(9999, 9999, 0);
    return;
  }
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -(e.clientY / window.innerHeight) * 2 + 1;
  const vector = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = (planeZ - camera.position.z) / dir.z;
  mouse3D.copy(camera.position).add(dir.multiplyScalar(distance));
});

function resizeThree() {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeThree);
resizeThree();

function animateParticles() {
  const posAttr = geometry.attributes.position;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ix = i * 3;
    let x = posAttr.array[ix] + velocities[ix];
    let y = posAttr.array[ix + 1] + velocities[ix + 1];
    let z = posAttr.array[ix + 2] + velocities[ix + 2];

    // gentle pull back toward each particle's home position
    x += (basePositions[ix] - x) * 0.003;
    y += (basePositions[ix + 1] - y) * 0.003;
    z += (basePositions[ix + 2] - z) * 0.003;

    // repel from cursor
    const dx = x - mouse3D.x;
    const dy = y - mouse3D.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 2.2;
    if (dist < repelRadius) {
      const force = (1 - dist / repelRadius) * 0.06;
      x += (dx / (dist || 1)) * force;
      y += (dy / (dist || 1)) * force;
    }

    posAttr.array[ix] = x;
    posAttr.array[ix + 1] = y;
    posAttr.array[ix + 2] = z;
  }
  posAttr.needsUpdate = true;

  points.rotation.y += 0.0006;
  renderer.render(scene, camera);
  requestAnimationFrame(animateParticles);
}
animateParticles();
