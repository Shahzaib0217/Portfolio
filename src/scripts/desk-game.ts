// A tiny runner for the empty desktop, in the spirit of Chrome's offline dino:
// my avatar ships to prod while bugs crawl in and fly past.
// ↑ / Space / click to jump, ↓ to duck. Loaded only when the desktop is empty;
// the loop runs only while a game is in progress.

const W = 640;
const H = 170;
const GROUND = 142;
const GRAVITY = 2600;
const JUMP_V = 760;
const STAND_R = 17;
const DUCK_R = 11;
const BEST_KEY = 'desk-game-best';

interface Obstacle { x: number; w: number; h: number; lift: number; fly: boolean }

export interface DeskGame { pause(): void; resume(): void }

export function mountGame(root: HTMLElement): DeskGame {
  const canvas = root.querySelector('canvas')!;
  const hint = root.querySelector<HTMLElement>('[data-game-hint]')!;
  const ctx = canvas.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const face = new Image();
  face.src = '/shahzaib-256.webp';
  face.onload = () => draw();

  let state: 'idle' | 'run' | 'over' = 'idle';
  let y = 0, vy = 0, ducking = false;
  let obstacles: Obstacle[] = [];
  let speed = 0, dist = 0, gap = 0, raf = 0, last = 0, ground = 0;
  let best = 0;
  try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { /* storage blocked */ }

  const score = () => Math.floor(dist / 12);
  const radius = () => (ducking && y === 0 ? DUCK_R : STAND_R);
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  function setHint(text: string) { hint.textContent = text; }

  function start() {
    state = 'run';
    y = 0; vy = 0; obstacles = []; dist = 0; speed = 320; gap = 260;
    setHint('Jump the crawling bugs (↑ or Space) · duck the flying ones (↓)');
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function jump() {
    if (state !== 'run') return start();
    if (y === 0) vy = JUMP_V;
  }

  function over(hit: Obstacle) {
    state = 'over';
    cancelAnimationFrame(raf);
    if (score() > best) {
      best = score();
      try { localStorage.setItem(BEST_KEY, String(best)); } catch { /* storage blocked */ }
    }
    setHint(`${hit.fly ? 'Hit a flying bug: duck under those with ↓' : 'Hit a bug'}. ↑ or Space to ship again`);
    draw();
  }

  function spawn() {
    const fly = score() > 150 && Math.random() < 0.3;
    if (fly) obstacles.push({ x: W + 10, w: 30, h: 16, lift: 26, fly });
    else {
      const two = score() > 300 && Math.random() < 0.3;
      obstacles.push({ x: W + 10, w: two ? 44 : 22, h: 18, lift: 0, fly });
    }
  }

  function hits(o: Obstacle) {
    const r = radius();
    const cx = 64, cy = GROUND - y - r;
    const top = GROUND - o.lift - o.h, bottom = GROUND - o.lift;
    const nx = Math.max(o.x + 3, Math.min(cx, o.x + o.w - 3));
    const ny = Math.max(top + 3, Math.min(cy, bottom - 2));
    return (cx - nx) ** 2 + (cy - ny) ** 2 < (r - 4) ** 2;
  }

  function loop(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    speed = Math.min(speed + 7 * dt, 680);
    dist += speed * dt;
    ground = (ground + speed * dt) % 48;

    if (y > 0 || vy > 0) {
      vy -= (ducking ? GRAVITY * 2.2 : GRAVITY) * dt;
      y = Math.max(0, y + vy * dt);
      if (y === 0) vy = 0;
    }

    for (const o of obstacles) o.x -= speed * dt;
    obstacles = obstacles.filter(o => o.x + o.w > -10);
    gap -= speed * dt;
    if (gap <= 0) { spawn(); gap = rand(speed * 0.75, speed * 1.5) + 120; }

    const hit = obstacles.find(hits);
    if (hit) return over(hit);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function draw() {
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--color-ink').trim() || '#121417';
    const muted = css.getPropertyValue('--color-muted').trim() || '#5F646B';
    const rule = css.getPropertyValue('--color-rule').trim() || '#D9DBD5';
    const signal = css.getPropertyValue('--color-signal').trim() || '#3B2BFF';
    const mono = css.getPropertyValue('--font-mono').trim() || 'monospace';

    ctx.clearRect(0, 0, W, H);

    // Ground with a few ticks that scroll, so the run reads as motion
    ctx.fillStyle = rule;
    ctx.fillRect(0, GROUND, W, 1.5);
    ctx.fillStyle = muted;
    for (let x = -ground; x < W; x += 48) ctx.fillRect(x, GROUND + 7, 6, 1.5);

    // Score
    ctx.font = `500 12px ${mono}`;
    ctx.textAlign = 'right';
    ctx.fillStyle = muted;
    const pad = (n: number) => String(n).padStart(5, '0');
    ctx.fillText(`best ${pad(best)}   ${pad(score())}`, W - 8, 18);

    // Obstacles: bugs on the ground and in the air
    for (const o of obstacles) {
      const top = GROUND - o.lift - o.h;
      if (o.fly) flyingBug(o.x, top, ink);
      else for (let bx = o.x; bx < o.x + o.w; bx += 22) bug(bx, top, ink);
    }

    // Me
    const r = radius();
    const cx = 64, cy = GROUND - y - r;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    if (face.complete && face.naturalWidth) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(face, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = muted;
      ctx.fill();
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = state === 'over' ? '#E5484D' : signal;
    ctx.stroke();
    ctx.restore();

    if (state === 'over') {
      ctx.font = `600 13px ${mono}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ink;
      ctx.fillText('G A M E   O V E R', W / 2, 70);
    }
  }

  function bug(x: number, top: number, color: string) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    const cx = x + 11, cy = top + 11;
    // legs
    for (const dy of [-3, 1, 5]) {
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy + dy); ctx.lineTo(cx + 9, cy + dy);
      ctx.stroke();
    }
    // body and head
    ctx.beginPath(); ctx.ellipse(cx, cy + 1, 5.5, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy - 7, 3.2, 0, Math.PI * 2); ctx.fill();
    // antennae
    ctx.beginPath();
    ctx.moveTo(cx - 1.5, cy - 9); ctx.lineTo(cx - 4, cy - 13);
    ctx.moveTo(cx + 1.5, cy - 9); ctx.lineTo(cx + 4, cy - 13);
    ctx.stroke();
  }

  // A bug seen from the side, wings flapping, flying head-first toward me
  function flyingBug(x: number, top: number, color: string) {
    const cx = x + 15, cy = top + 10;
    const flap = Math.sin(performance.now() / 45) > 0;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    // wings
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(cx + 2, flap ? cy - 7 : cy - 3, 7, flap ? 5 : 3, flap ? -0.5 : -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // body and head
    ctx.beginPath(); ctx.ellipse(cx + 2, cy + 2, 8, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 7.5, cy + 1, 3.4, 0, Math.PI * 2); ctx.fill();
    // legs tucked under, antennae forward
    ctx.beginPath();
    for (const lx of [-1, 3, 7]) { ctx.moveTo(cx + lx, cy + 5); ctx.lineTo(cx + lx + 2, cy + 8.5); }
    ctx.moveTo(cx - 9, cy - 1); ctx.lineTo(cx - 13, cy - 5);
    ctx.moveTo(cx - 8, cy - 2); ctx.lineTo(cx - 10, cy - 7);
    ctx.stroke();
  }

  // Input: only while the game is on screen, and never while typing or on a focused control
  const busy = (e: KeyboardEvent) => {
    if (root.hidden || e.metaKey || e.ctrlKey || e.altKey) return true;
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === canvas) return false;
    if (el.matches('input, textarea, select, [contenteditable]')) return true;
    // Space on a focused link or button belongs to that control
    return e.key === ' ' && !!el.closest('a, button');
  };
  document.addEventListener('keydown', e => {
    if (busy(e)) return;
    if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') {
      e.preventDefault();
      if (!e.repeat || state === 'run') jump();
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      e.preventDefault();
      ducking = true;
      if (state === 'run' && y === 0) draw();
    }
  });
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowDown' || e.key === 's') ducking = false;
  });
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); jump(); });

  function pause() {
    cancelAnimationFrame(raf);
    if (state === 'run') { state = 'idle'; setHint('Paused. ↑ or Space to start over'); }
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  draw();
  return {
    pause,
    resume() {
      if (state !== 'run') draw();
    },
  };
}
