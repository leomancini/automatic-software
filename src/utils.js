import { COLORS, LIGHTNING_SEGMENTS } from './constants.js';

export function getFormationTargets(n, type, W, H) {
  const cx = W / 2, cy = H / 2;
  const targets = [];
  const maxR = Math.min(W, H) * 0.32;

  if (type === 'circle') {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      targets.push({ x: cx + Math.cos(a) * maxR, y: cy + Math.sin(a) * maxR });
    }
  } else if (type === 'spiral') {
    for (let i = 0; i < n; i++) {
      const t = i / Math.max(n - 1, 1);
      const a = t * Math.PI * 6;
      targets.push({ x: cx + Math.cos(a) * t * maxR, y: cy + Math.sin(a) * t * maxR });
    }
  } else if (type === 'grid') {
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const spacing = Math.min(W / (cols + 2), H / (rows + 2), 45);
    const sx = cx - ((cols - 1) * spacing) / 2;
    const sy = cy - ((rows - 1) * spacing) / 2;
    for (let i = 0; i < n; i++) {
      targets.push({ x: sx + (i % cols) * spacing, y: sy + Math.floor(i / cols) * spacing });
    }
  } else if (type === 'wave') {
    const amp = Math.min(H * 0.25, 120);
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5;
      targets.push({ x: W * 0.08 + t * W * 0.84, y: cy + Math.sin(t * Math.PI * 3) * amp });
    }
  }

  return targets;
}

export function generateBolt(x1, y1, x2, y2, segments = LIGHTNING_SEGMENTS) {
  const points = [{ x: x1, y: y1 }];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / dist;
  const py = dx / dist;
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const jitter = (Math.random() - 0.5) * dist * 0.15;
    points.push({
      x: x1 + dx * t + px * jitter,
      y: y1 + dy * t + py * jitter,
    });
  }
  points.push({ x: x2, y: y2 });
  return points;
}

export function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  if (isNaN(r)) r = 0;
  if (isNaN(g)) g = 0;
  if (isNaN(b)) b = 0;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s, l];
}

export function hexAlpha(a) {
  return Math.min(255, Math.max(0, Math.round(a))).toString(16).padStart(2, "0");
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function blendHexColors(hexA, hexB, ratio) {
  const [hA, sA, lA] = hexToHsl(hexA);
  const [hB, sB, lB] = hexToHsl(hexB);
  // Blend hue via shortest arc on the color wheel
  let dh = hB - hA;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const h = hA + dh * ratio;
  const s = sA + (sB - sA) * ratio;
  const l = lA + (lB - lA) * ratio;
  return hslToHex(h, s, l);
}

export function easeOutElastic(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const p = 0.4;
  return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}

export function createOrb(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.3 + Math.random() * 0.5;
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 8 + Math.random() * 12,
    color: randomColor(),
    pulsePhase: Math.random() * Math.PI * 2,
    polarity: Math.random() < 0.5 ? 1 : -1,
    born: performance.now(),
  };
}
