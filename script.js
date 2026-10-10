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

// Fundo interativo: malha de pontos que reage ao mouse (só desenha a região ativa)
(() => {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const glow = document.getElementById('glow');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP = 36, R = 170;
  let w, h, cols, dots = [], raf = 0;
  const active = new Set();
  const m = { x: 0, y: 0, sx: 0, sy: 0, on: false };

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = []; active.clear();
    cols = Math.ceil(w / GAP) + 1;
    for (let y = GAP / 2; y < h + GAP; y += GAP)
      for (let x = GAP / 2; x < w + GAP; x += GAP)
        dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, near: 0 });
  }

  function frame() {
    raf = 0;
    m.sx += (m.x - m.sx) * 0.18; m.sy += (m.y - m.sy) * 0.18;
    glow.style.transform = `translate(${m.sx}px,${m.sy}px)`;
    if (m.on) {
      const c0 = Math.max(0, Math.floor((m.sx - R) / GAP)), c1 = Math.min(cols - 1, Math.ceil((m.sx + R) / GAP));
      const r0 = Math.max(0, Math.floor((m.sy - R) / GAP)), r1 = Math.ceil((m.sy + R) / GAP);
      for (let r = r0; r <= r1; r++)
        for (let c = c0; c <= c1; c++) { const d = dots[r * cols + c]; if (d) active.add(d); }
    }
    ctx.clearRect(0, 0, w, h);
    const lit = [];
    for (const d of active) {
      const dx = d.x - m.sx, dy = d.y - m.sy, dist = Math.hypot(dx, dy);
      d.near = m.on && dist < R ? 1 - dist / R : 0;
      if (d.near) { const f = d.near * d.near * 1.6; d.vx += (dx / (dist || 1)) * f; d.vy += (dy / (dist || 1)) * f; }
      d.vx += (d.ox - d.x) * 0.06; d.vy += (d.oy - d.y) * 0.06;
      d.vx *= 0.82; d.vy *= 0.82; d.x += d.vx; d.y += d.vy;
      const moved = Math.abs(d.x - d.ox) + Math.abs(d.y - d.oy) + Math.abs(d.vx) + Math.abs(d.vy);
      if (!d.near && moved < 0.15) { d.x = d.ox; d.y = d.oy; d.vx = d.vy = 0; active.delete(d); continue; }
      ctx.fillStyle = `rgba(255,182,39,${Math.min(0.9, 0.18 + d.near * 0.75)})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.2 + d.near * 1.8, 0, 6.283); ctx.fill();
      if (d.near > 0.15) lit.push(d);
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < lit.length; i++)
      for (let k = i + 1; k < lit.length; k++) {
        const a = lit[i], b = lit[k];
        if (Math.abs(a.ox - b.ox) + Math.abs(a.oy - b.oy) > GAP * 1.5) continue;
        const al = Math.min(a.near, b.near) * 0.4;
        ctx.strokeStyle = `rgba(255,182,39,${al})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    if (m.on || active.size) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  if (!reduce) {
    addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      m.x = e.clientX; m.y = e.clientY;
      if (!m.on) { m.sx = m.x; m.sy = m.y; m.on = true; glow.classList.add('on'); }
      kick();
    }, { passive: true });
    document.addEventListener('pointerleave', () => { m.on = false; glow.classList.remove('on'); kick(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) m.on = false; });
    addEventListener('resize', build);
    build();
  }
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
