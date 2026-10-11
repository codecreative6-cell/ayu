/* ═══════════════════════════════════════════════
   script.js — Dark Starry Birthday Theme
   Features:
     • SVG star field with twinkling (animate opacity + scale)
     • Shooting stars
     • Constellations (SVG lines between random stars)
     • Sparkle cursor trail (canvas)
     • Bokeh circles
     • Floating petals
     • Rising hearts
     • Fairy lights
     • Confetti burst on candle blow
   ═══════════════════════════════════════════════ */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const R = (a, b) => Math.random() * (b - a) + a;
const RI = (a, b) => Math.floor(R(a, b));

/* ─── Device capability detection ─── */
const isMobile = /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent) || innerWidth < 768;
const isLowEnd = (navigator.hardwareConcurrency || 2) <= 4 || (navigator.deviceMemory || 4) <= 2;
const perfTier = isLowEnd ? 'low' : isMobile ? 'mid' : 'high'; // low=budget phone, mid=decent phone/tablet, high=desktop

const sky = $('#sky');
const starSVG = $('#star-field');

/* ─── Helper: create multiple elements ─── */
function mk(parent, cls, n, fn) {
  for (let i = 0; i < n; i++) {
    const e = document.createElement('i');
    e.className = cls;
    fn(e, i);
    parent.append(e);
  }
}

/* ══════════════════════════════
   1. SVG STAR FIELD WITH TWINKLING
   ══════════════════════════════ */
function createStarField() {
  const W = innerWidth, H = innerHeight;
  let svg = '';

  // Adapt star counts based on device capability
  const starCount = perfTier === 'low' ? 50 : perfTier === 'mid' ? 80 : 120;
  const brightStarCount = perfTier === 'low' ? 5 : perfTier === 'mid' ? 10 : 15;

  // --- Small static twinkling stars ---
  for (let i = 0; i < starCount; i++) {
    const cx = R(0, W), cy = R(0, H);
    const r = R(0.4, 1.8);
    const dur = R(2, 6).toFixed(1);
    const delay = R(0, 5).toFixed(1);
    const fill = ['#fff', '#e0e7ff', '#c4b5fd', '#fbcfe8', '#fde68a'][RI(0, 5)];
    // Skip scale animation on low-end — opacity only is much cheaper
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="0.6">
      <animate attributeName="opacity" values="0.2;0.9;0.2" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
      ${perfTier !== 'low' ? `<animateTransform attributeName="transform" type="scale" values="1;1.4;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite" additive="sum"/>` : ''}
    </circle>`;
  }

  // --- Larger "bright" stars with 4-point sparkle shape ---
  for (let i = 0; i < brightStarCount; i++) {
    const cx = R(20, W - 20), cy = R(20, H - 20);
    const size = R(4, 8);
    const dur = R(3, 7).toFixed(1);
    const delay = R(0, 4).toFixed(1);
    svg += `<g transform="translate(${cx},${cy})">
      <path d="M0,-${size} ${size * 0.25},-${size * 0.25} ${size},0 ${size * 0.25},${size * 0.25} 0,${size} -${size * 0.25},${size * 0.25} -${size},0 -${size * 0.25},-${size * 0.25}z" fill="#fde68a" opacity="0.7">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
        ${perfTier === 'high' ? `<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${(parseFloat(dur) * 3).toFixed(1)}s" repeatCount="indefinite"/>` : ''}
      </path>
    </g>`;
  }

  // --- Constellation lines (connect some random points) ---
  const constellationStars = [];
  for (let i = 0; i < 8; i++) {
    constellationStars.push({ x: R(W * 0.1, W * 0.9), y: R(H * 0.05, H * 0.5) });
  }
  for (let i = 0; i < constellationStars.length - 1; i++) {
    const a = constellationStars[i], b = constellationStars[i + 1];
    const lineLen = Math.hypot(b.x - a.x, b.y - a.y);
    svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(192,132,252,0.15)" stroke-width="0.8" stroke-dasharray="${lineLen}" stroke-dashoffset="${lineLen}">
      <animate attributeName="stroke-dashoffset" from="${lineLen}" to="0" dur="3s" begin="${i * 0.5}s" fill="freeze"/>
    </line>`;
    // dot at each point
    svg += `<circle cx="${a.x}" cy="${a.y}" r="2" fill="#c084fc" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>`;
  }

  starSVG.innerHTML = svg;
}

/* ══════════════════════════════
   2. SHOOTING STARS (DOM elements)
   ══════════════════════════════ */
function createShootingStars() {
  const count = perfTier === 'low' ? 2 : perfTier === 'mid' ? 3 : 4;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'shooting-star';
    el.style.cssText = `--x:${R(60, 100)}%;--y:${R(2, 40)}%;--d:${R(3, 7)}s;--dl:${R(0, 12)}s`;
    sky.append(el);
  }
}

/* ══════════════════════════════
   3. BOKEH, PETALS, HEARTS
   ══════════════════════════════ */
const P = ['#f472b6', '#c084fc', '#a78bfa', '#fde68a'];

const bokehCount = perfTier === 'low' ? 4 : perfTier === 'mid' ? 6 : 9;
const heartCount = perfTier === 'low' ? 6 : perfTier === 'mid' ? 8 : 12;
const petalCount = perfTier === 'low' ? 10 : perfTier === 'mid' ? 16 : 24;

mk(sky, 'bk', bokehCount, e => e.style.cssText = `--x:${R(-5, 95)}%;--y:${R(0, 90)}%;--s:${R(70, 170)}px;--d:${R(9, 16)}s;--dl:${R(-16, 0)}s`);
mk(sky, 'hrt', heartCount, e => { e.textContent = '♥'; e.style.cssText = `--x:${R(0, 96)}%;--s:${R(12, 24)}px;--dx:${R(-8, 8)}vw;--d:${R(10, 18)}s;--dl:${R(-18, 0)}s`; });

function petals(n, burst) {
  mk(sky, 'pt', n, (e, i) => {
    e.style.cssText = `--x:${R(0, 100)}%;--pw:${R(9, 17)}px;--dx:${R(-22, 22)}vw;--c:${P[i % 4]};--d:${burst ? R(3, 6) : R(10, 17)}s;--dl:${burst ? 0 : R(-17, 0)}s`;
    if (burst) { e.style.animationIterationCount = 1; e.onanimationend = () => e.remove(); }
  });
}
petals(petalCount, 0);

/* ══════════════════════════════
   4. CONFETTI BURST (on candle blow)
   ══════════════════════════════ */
function confettiBurst(count = 60) {
  const colors = ['#f472b6', '#c084fc', '#fbbf24', '#34d399', '#60a5fa', '#fb923c', '#fff'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('i');
    c.className = 'confetti-piece';
    const angle = R(0, 360) * Math.PI / 180;
    const dist = R(80, 280);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - R(60, 200); // bias upward
    const rot = R(0, 720);
    const size = R(5, 10);
    c.style.cssText = `
      position:fixed;left:50%;top:55%;width:${size}px;height:${size * R(1.2, 2.5)}px;
      background:${colors[RI(0, colors.length)]};
      border-radius:${R(0, 1) > 0.5 ? '50%' : '2px'};
      z-index:100;pointer-events:none;
      animation:confettiFly ${R(1, 2.2)}s cubic-bezier(.15,.8,.3,1) forwards;
      --dx:${dx}px;--dy:${dy}px;--rot:${rot}deg;
    `;
    document.body.append(c);
    c.onanimationend = () => c.remove();
  }

  // inject keyframes once
  if (!document.getElementById('confetti-kf')) {
    const style = document.createElement('style');
    style.id = 'confetti-kf';
    style.textContent = `@keyframes confettiFly{
      0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1}
      100%{transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.3);opacity:0}
    }`;
    document.head.append(style);
  }
}

/* ══════════════════════════════
   5. FAIRY LIGHTS
   ══════════════════════════════ */
function lights() {
  const W = innerWidth, n = Math.round(W / 70) | 1;
  const cs = ['#fde68a', '#f9a8d4', '#c4b5fd', '#67e8f9'];
  let s = `<path d="M0 6Q${W / 2} 62 ${W} 6" fill="none" stroke="rgba(192,132,252,0.25)" stroke-width="1.5"/>`;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = W * t, y = 16 + 112 * t * (1 - t);
    s += `<g class="bulb" fill="${cs[i % 4]}" style="--dl:${-i * .7}s">
      <circle cx="${x}" cy="${y}" r="11" opacity=".25"/>
      <circle cx="${x}" cy="${y}" r="5"/>
    </g>`;
  }
  const l = $('#lt');
  l.setAttribute('width', W);
  l.setAttribute('viewBox', `0 0 ${W} 60`);
  l.innerHTML = s;
}

/* ══════════════════════════════
   6. SPARKLE CURSOR TRAIL (Canvas)
   ══════════════════════════════ */
function setupSparkleTrail() {
  const canvas = $('#sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let particles = [];
  let mouse = { x: -100, y: -100 };
  let dpr = 1;

  // Performance tuning per device tier
  const maxParticles = perfTier === 'low' ? 30 : perfTier === 'mid' ? 50 : 80;
  const spawnEvery = perfTier === 'low' ? 4 : perfTier === 'mid' ? 3 : 2; // frames between spawns
  const useShadow = perfTier !== 'low'; // shadowBlur is very expensive on mobile GPUs

  function resize() {
    // Low-end: use dpr 1 to cut pixel count in half
    dpr = perfTier === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('orientationchange', () => setTimeout(resize, 150));

  function setPos(e) {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  }

  document.addEventListener('mousemove', setPos);
  document.addEventListener('touchstart', setPos, { passive: true });
  document.addEventListener('touchmove', setPos, { passive: true });
  document.addEventListener('touchend', () => { mouse.x = -100; mouse.y = -100; }, { passive: true });

  function Particle(x, y) {
    this.x = x + R(-8, 8);
    this.y = y + R(-8, 8);
    this.size = R(1.5, 4);
    this.life = 1;
    this.decay = R(0.02, 0.05);
    this.vx = R(-1, 1);
    this.vy = R(-2, 0);
    this.color = ['#f472b6', '#c084fc', '#fbbf24', '#fff'][RI(0, 4)];
  }

  let frameCount = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    frameCount++;

    // Spawn new particle (throttled)
    if (frameCount % spawnEvery === 0 && mouse.x > 0 && particles.length < maxParticles) {
      particles.push(new Particle(mouse.x, mouse.y));
    }

    // Update + render all particles in one pass
    let writeIdx = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) continue;
      particles[writeIdx++] = p;

      const s = p.size * p.life;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (useShadow) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
      }

      // Draw simple circle on low-end, star shape otherwise
      if (perfTier === 'low') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, 6.283);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.closePath();
        ctx.fill();
      }
    }
    particles.length = writeIdx; // trim dead particles without splice

    if (useShadow) { ctx.shadowBlur = 0; }
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }
  loop();
}

/* ══════════════════════════════
   7. MESSAGE WORD ANIMATION
   ══════════════════════════════ */
function animateMessage() {
  const msg = $('.msg');
  if (!msg) return;
  msg.innerHTML = msg.textContent.split(' ').map((w, i) => `<span style="--i:${i}">${w}</span>`).join('');
}

/* ══════════════════════════════
   8. CAKE BLOW + CONFETTI
   ══════════════════════════════ */
function setupCake() {
  const bl = $('#bl');
  if (!bl) return;
  bl.onclick = e => {
    const off = $('#cake').classList.toggle('off');
    e.target.textContent = off ? 'Light them again 🕯️' : 'Blow the candles 🎂';
    if (off) {
      const burstPetals = perfTier === 'low' ? 30 : perfTier === 'mid' ? 50 : 90;
      const burstConfetti = perfTier === 'low' ? 30 : perfTier === 'mid' ? 50 : 80;
      petals(burstPetals, 1);
      confettiBurst(burstConfetti);
    }
  };
}

/* ══════════════════════════════
   9. ENVELOPES
   ══════════════════════════════ */
function setupEnvelopes() {
  $$('.env').forEach(e => {
    e.onclick = () => e.classList.toggle('open');
    e.onkeydown = k => { if (k.key == 'Enter' || k.key == ' ') { k.preventDefault(); e.click(); } };
  });
}

/* ══════════════════════════════
   10. MUSIC & LOADING PAGE
   ══════════════════════════════ */
function setupAudio() {
  const m = $('#bg-music');
  const mt = $('#music-toggle');
  if (!m || !mt) return;

  function updateState() {
    if (m.paused) {
      mt.classList.remove('playing');
      mt.classList.add('paused');
    } else {
      mt.classList.remove('paused');
      mt.classList.add('playing');
    }
  }

  mt.onclick = () => {
    if (m.paused) {
      m.play().then(updateState).catch(() => {});
    } else {
      m.pause();
      updateState();
    }
  };

  m.addEventListener('play', updateState);
  m.addEventListener('pause', updateState);
}

function setupLoading() {
  const lp = $('#loading-page'), eb = $('#enter-btn'), m = $('#bg-music'), mt = $('#music-toggle');
  if (!eb) return;
  eb.onclick = () => {
    lp.classList.add('hidden');
    document.body.classList.add('loaded');
    if (m) {
      m.play().then(() => {
        if (mt) {
          mt.classList.add('playing');
          mt.classList.remove('paused');
        }
      }).catch(() => {
        if (mt) {
          mt.classList.add('paused');
          mt.classList.remove('playing');
        }
      });
    }
    setTimeout(() => lp.remove(), 800);
  };
}

/* ══════════════════════════════
   INIT
   ══════════════════════════════ */
createStarField();
createShootingStars();
lights();

// Debounced resize — prevents lag from rapid resize/orientation events
let resizeTimer;
function onViewportChange() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    lights();
    createStarField();
  }, 200);
}
addEventListener('resize', onViewportChange);
addEventListener('orientationchange', () => setTimeout(onViewportChange, 300));

animateMessage();
setupCake();
setupEnvelopes();
setupAudio();
setupLoading();
setupSparkleTrail();

console.log(`🎂 Birthday site loaded | Device tier: ${perfTier} | Cores: ${navigator.hardwareConcurrency || '?'} | DPR: ${devicePixelRatio}`);
