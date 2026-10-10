// Menu mobile
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Fundo interativo: malha de pontos (pontos de teste) que reage ao mouse
(() => {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP = 36, R = 170;
  let w, h, dpr, dots = [], t = 0;
  const m = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false };

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = GAP / 2; y < h + GAP; y += GAP)
      for (let x = GAP / 2; x < w + GAP; x += GAP)
        dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, p: Math.random() * 6.28 });
  }

  function draw() {
    t += 0.004;
    ctx.clearRect(0, 0, w, h);
    // brilhos abstratos à deriva
    const blobs = [
      [0.2 + Math.sin(t) * 0.08, 0.25 + Math.cos(t * 0.8) * 0.1, 420, 'rgba(255,182,39,0.055)'],
      [0.8 + Math.cos(t * 0.7) * 0.07, 0.7 + Math.sin(t * 0.9) * 0.1, 480, 'rgba(255,140,40,0.04)'],
    ];
    for (const [bx, by, br, col] of blobs) {
      const g = ctx.createRadialGradient(bx * w, by * h, 0, bx * w, by * h, br);
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,182,39,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    // mouse suavizado
    m.sx += (m.x - m.sx) * 0.12; m.sy += (m.y - m.sy) * 0.12;
    if (m.on) {
      const g = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, 260);
      g.addColorStop(0, 'rgba(255,182,39,0.10)'); g.addColorStop(1, 'rgba(255,182,39,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    for (const d of dots) {
      const dx = d.x - m.sx, dy = d.y - m.sy, dist = Math.hypot(dx, dy);
      let near = 0;
      if (m.on && dist < R) {
        near = 1 - dist / R;
        const f = near * near * 1.6;
        d.vx += (dx / (dist || 1)) * f; d.vy += (dy / (dist || 1)) * f;
      }
      d.vx += (d.ox - d.x) * 0.06; d.vy += (d.oy - d.y) * 0.06;
      d.vx *= 0.82; d.vy *= 0.82;
      d.x += d.vx; d.y += d.vy;
      const base = 0.10 + 0.05 * Math.sin(t * 6 + d.p);
      ctx.fillStyle = near > 0 ? `rgba(255,182,39,${Math.min(0.9, base + near * 0.8)})` : `rgba(210,220,212,${base})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.1 + near * 1.8, 0, 6.283); ctx.fill();
    }
    // linhas finas entre pontos próximos ao cursor
    if (m.on) {
      ctx.lineWidth = 1;
      const act = dots.filter(d => Math.hypot(d.x - m.sx, d.y - m.sy) < R * 0.9);
      for (let i = 0; i < act.length; i++)
        for (let k = i + 1; k < act.length; k++) {
          const a = act[i], b = act[k], dd = Math.hypot(a.x - b.x, a.y - b.y);
          if (dd < GAP * 1.5) {
            const al = (1 - Math.hypot((a.x + b.x) / 2 - m.sx, (a.y + b.y) / 2 - m.sy) / R) * 0.35;
            if (al > 0) { ctx.strokeStyle = `rgba(255,182,39,${al})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
        }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    m.x = e.clientX; m.y = e.clientY;
    if (!m.on) { m.sx = m.x; m.sy = m.y; m.on = true; }
  });
  document.addEventListener('pointerleave', () => { m.on = false; });
  addEventListener('resize', build);
  build(); draw();
})();

// Entrada suave dos blocos ao rolar
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
