import React, { useRef, useEffect, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

const RIPPLE_DURATION = 600; // ms
const BURST_DURATION = 500; // ms
const BURST_PARTICLE_COUNT = 8;

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#fa709a",
  "#feb47b",
];

const CONNECTION_DIST = 160;
const MERGE_DIST_FACTOR = 0.7; // merge when distance < smaller radius * this
const MERGE_FLASH_DURATION = 400;
const STAR_COUNT = 80;
const SHOOTING_STAR_CHANCE = 0.003; // probability per frame
const SHOOTING_STAR_DURATION = 800; // ms
const MOTE_COUNT = 40;
const MOTE_SPEED = 0.15;
const SPLIT_COUNT = 3;
const LONG_PRESS_MS = 500;
const FRICTION = 0.98;
const REPEL_DIST = 50;
const REPEL_FORCE = 0.3;
const ATTRACT_DIST = 180;
const ATTRACT_FORCE = 0.015;
const GRAVITY = 0.12;
const WAVE_SPEED = 5; // px per frame
const WAVE_FORCE = 6;
const WAVE_WIDTH = 40; // thickness of the ring
const WAVE_MAX_RADIUS_FACTOR = 1.2; // expand to 120% of screen diagonal
const WALL_HIT_DURATION = 350; // ms
const WALL_HIT_SPEED_THRESHOLD = 1.5; // minimum pre-bounce speed to trigger
const WELL_RANGE = 250; // gravity well attraction radius
const WELL_GRAVITY = 0.08; // gravity well force
const TRAIL_SPEED_THRESHOLD = 2.0; // min orb speed to shed trail particles
const TRAIL_LIFETIME = 2500; // ms trail particles live
const TRAIL_MAX = 600; // cap trail particle count for performance
const TRAIL_SPAWN_RATE = 0.4; // probability per frame per orb (when fast enough)
const CASCADE_MAX_GEN = 2; // max cascade depth for chain reaction shockwaves
const CASCADE_SPEED_THRESHOLD = 3.5; // orb speed after hit to trigger cascade
const CASCADE_FORCE_DECAY = 0.55; // each generation is 55% as strong
const CASCADE_DELAY_FRAMES = 8; // frames to wait before cascade wave activates
const COLLAPSE_RADIUS = 35; // orbs this big implode into gravity wells

// ── Vortex visual effect ────────────────────────────────────────────
const VORTEX_DURATION = 2000; // ms for spiral arms to fade
const VORTEX_ARMS = 3; // number of spiral arms

// ── Tap streak / combo system ───────────────────────────────────────
const STREAK_WINDOW = 600; // ms between taps to continue a streak
const STREAK_DECAY_DELAY = 1200; // ms after last tap before streak counter fades

// ── Audio engine ──────────────────────────────────────────────────────
let audioCtx = null;
let masterGain = null;
let audioMuted = false;
let lastBounceTime = 0;
let lastMergeTime = 0;

// C major pentatonic across 2 octaves — always sounds musical
const PENTATONIC = [
  261.63, 293.66, 329.63, 392.00, 440.00,
  523.25, 587.33, 659.25, 783.99, 880.00,
];

function ensureAudio() {
  if (audioCtx) return true;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(audioCtx.destination);
    return true;
  } catch {
    return false;
  }
}

function playTone(freq, duration = 0.3, type = "sine", gainVal = 0.15) {
  if (!audioCtx || !masterGain || audioMuted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gainVal, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

function playSpawn(x, screenW) {
  if (!ensureAudio() || audioMuted) return;
  const idx = Math.floor((x / screenW) * PENTATONIC.length);
  const note = PENTATONIC[Math.max(0, Math.min(PENTATONIC.length - 1, idx))];
  playTone(note, 0.4, "sine", 0.1);
  playTone(note * 2, 0.25, "sine", 0.03);
}

function playMergeSound() {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastMergeTime < 0.1) return;
  lastMergeTime = t;
  const base = 180 + Math.random() * 80;
  playTone(base, 0.5, "sine", 0.08);
  playTone(base * 1.5, 0.35, "triangle", 0.04);
}

function playBoom() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(25, t + 0.5);
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.55);
}

function playBounce(intensity) {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastBounceTime < 0.06) return;
  lastBounceTime = t;
  const freq = 600 + Math.random() * 500;
  playTone(freq, 0.06, "sine", 0.03 * Math.min(intensity, 1));
}

function playSwoosh() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(500, t + 0.12);
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.06, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.4);
}

function playBurstSound() {
  if (!ensureAudio() || audioMuted) return;
  playTone(392, 0.35, "sine", 0.06);
  playTone(523.25, 0.3, "sine", 0.05);
  playTone(659.25, 0.25, "sine", 0.04);
}

function playCollapse() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Deep rising rumble (implosion)
  const osc1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(40, t);
  osc1.frequency.exponentialRampToValueAtTime(120, t + 0.6);
  g1.gain.setValueAtTime(0.2, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  osc1.connect(g1);
  g1.connect(masterGain);
  osc1.start(t);
  osc1.stop(t + 0.85);
  // High harmonic shimmer
  const osc2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(200, t);
  osc2.frequency.exponentialRampToValueAtTime(800, t + 0.4);
  g2.gain.setValueAtTime(0, t);
  g2.gain.linearRampToValueAtTime(0.06, t + 0.1);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  osc2.connect(g2);
  g2.connect(masterGain);
  osc2.start(t);
  osc2.stop(t + 0.55);
}

function playStreakTone(streak, x, screenW) {
  if (!ensureAudio() || audioMuted) return;
  // Rising pitch with streak count — climb the pentatonic scale
  const idx = Math.min(streak - 1, PENTATONIC.length - 1);
  const note = PENTATONIC[idx];
  const gain = Math.min(0.06 + streak * 0.015, 0.2);
  playTone(note, 0.3, "sine", gain);
  // Add sparkly overtone at higher streaks
  if (streak >= 4) {
    playTone(note * 2, 0.2, "triangle", gain * 0.4);
  }
  if (streak >= 7) {
    playTone(note * 3, 0.15, "sine", gain * 0.2);
  }
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
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

function hexAlpha(a) {
  return Math.min(255, Math.max(0, Math.round(a))).toString(16).padStart(2, "0");
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function createOrb(x, y) {
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
  };
}

function App() {
  const canvasRef = useRef(null);
  const orbsRef = useRef([]);
  const dragRef = useRef(null);
  const dragHistoryRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);
  const ripplesRef = useRef([]);
  const burstsRef = useRef([]);
  const flashesRef = useRef([]);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const motesRef = useRef([]);
  const wavesRef = useRef([]);
  const wallHitsRef = useRef([]);
  const wellsRef = useRef([]);
  const trailsRef = useRef([]);
  const vortexesRef = useRef([]);
  const shakeRef = useRef(0); // screen shake intensity (decays each frame)
  const [orbCount, setOrbCount] = useState(0);
  const [gravityOn, setGravityOn] = useState(false);
  const gravityRef = useRef(false);
  const [frozen, setFrozen] = useState(false);
  const frozenRef = useRef(false);
  const [paintMode, setPaintMode] = useState(false);
  const paintModeRef = useRef(false);
  const [slowMo, setSlowMo] = useState(false);
  const slowMoRef = useRef(false);
  const [showHelp, setShowHelp] = useState(false);
  const [repelMode, setRepelMode] = useState(false);
  const repelModeRef = useRef(false);
  const [orbitMode, setOrbitMode] = useState(false);
  const orbitModeRef = useRef(false);
  const [colorCycle, setColorCycle] = useState(false);
  const colorCycleRef = useRef(false);
  const [attractMode, setAttractMode] = useState(false);
  const attractModeRef = useRef(false);
  const longPressRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const streakRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const [streakDisplay, setStreakDisplay] = useState(0);
  const streakFadeRef = useRef(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  }, []);

  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const findOrb = useCallback((x, y) => {
    return orbsRef.current.find((o) => {
      const dx = o.x - x;
      const dy = o.y - y;
      return Math.sqrt(dx * dx + dy * dy) < o.radius + 10;
    });
  }, []);

  const splitOrb = useCallback((orb) => {
    const now = performance.now();
    const childRadius = orb.radius / Math.sqrt(SPLIT_COUNT);
    if (childRadius < 4) return; // too small to split
    orbsRef.current = orbsRef.current.filter((o) => o.id !== orb.id);
    for (let i = 0; i < SPLIT_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / SPLIT_COUNT + Math.random() * 0.3;
      const child = createOrb(orb.x, orb.y);
      child.radius = childRadius;
      child.vx = orb.vx + Math.cos(angle) * (2 + Math.random());
      child.vy = orb.vy + Math.sin(angle) * (2 + Math.random());
      orbsRef.current.push(child);
    }
    ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
    setOrbCount(orbsRef.current.length);
  }, []);

  const handleDown = useCallback(
    (e) => {
      const pos = getPos(e);
      const hit = findOrb(pos.x, pos.y);
      if (hit) {
        dragRef.current = hit;
        dragHistoryRef.current = [{ x: pos.x, y: pos.y, t: performance.now() }];
        // start long-press timer for mobile split
        if (e.touches) {
          longPressRef.current = setTimeout(() => {
            dragRef.current = null;
            splitOrb(hit);
            longPressRef.current = null;
          }, LONG_PRESS_MS);
        }
      }
      mouseRef.current = pos;
    },
    [getPos, findOrb, splitOrb]
  );

  const handleMove = useCallback(
    (e) => {
      const pos = getPos(e);
      if (dragRef.current) {
        // cancel long-press if finger moves
        if (longPressRef.current) {
          clearTimeout(longPressRef.current);
          longPressRef.current = null;
        }
        dragRef.current.x = pos.x;
        dragRef.current.y = pos.y;
        dragRef.current.vx = 0;
        dragRef.current.vy = 0;
        const history = dragHistoryRef.current;
        history.push({ x: pos.x, y: pos.y, t: performance.now() });
        // keep only last 5 samples
        if (history.length > 5) history.shift();
      }
      mouseRef.current = pos;
    },
    [getPos]
  );

  const handleUp = useCallback(
    (e) => {
      if (longPressRef.current) {
        clearTimeout(longPressRef.current);
        longPressRef.current = null;
      }
      if (dragRef.current) {
        // fling: compute velocity from recent drag history
        const history = dragHistoryRef.current;
        if (history.length >= 2) {
          const recent = history[history.length - 1];
          const older = history[0];
          const dt = recent.t - older.t;
          if (dt > 0) {
            // convert px/ms to px/frame (~16.67ms per frame)
            const fling = 16.67 / dt;
            dragRef.current.vx = (recent.x - older.x) * fling;
            dragRef.current.vy = (recent.y - older.y) * fling;
          }
        }
        dragHistoryRef.current = [];
        dragRef.current = null;
        return;
      }
      const pos = e.changedTouches
        ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        : getPos(e);
      const now = performance.now();

      // ── Tap streak tracking ──
      const timeSinceLast = now - lastTapTimeRef.current;
      if (timeSinceLast < STREAK_WINDOW) {
        streakRef.current++;
      } else {
        streakRef.current = 1;
      }
      lastTapTimeRef.current = now;
      const streak = streakRef.current;

      // Update visible streak counter
      setStreakDisplay(streak);
      if (streakFadeRef.current) clearTimeout(streakFadeRef.current);
      streakFadeRef.current = setTimeout(() => {
        setStreakDisplay(0);
        streakRef.current = 0;
      }, STREAK_DECAY_DELAY);

      // ── Scale effects by streak ──
      const spawnCount = streak >= 8 ? 4 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
      const radiusBonus = Math.min(streak * 0.8, 8); // orbs get slightly bigger
      const rippleColor = randomColor();

      for (let i = 0; i < spawnCount; i++) {
        const angle = spawnCount > 1 ? (Math.PI * 2 * i) / spawnCount : 0;
        const spread = spawnCount > 1 ? 12 + streak : 0;
        const orb = createOrb(
          pos.x + Math.cos(angle) * spread,
          pos.y + Math.sin(angle) * spread
        );
        orb.radius += radiusBonus;
        if (spawnCount > 1) {
          orb.vx += Math.cos(angle) * (1 + streak * 0.3);
          orb.vy += Math.sin(angle) * (1 + streak * 0.3);
        }
        orbsRef.current.push(orb);
        ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
      }

      // Streak 5+: auto-shockwave from tap point
      if (streak >= 5) {
        wavesRef.current.push({
          cx: pos.x,
          cy: pos.y,
          radius: 0,
          color: rippleColor,
          generation: 1, // weaker than manual shockwave
          hitOrbs: new Set(),
          delay: 0,
        });
        shakeRef.current = Math.max(shakeRef.current, 4 + streak);
      }

      // Streak 8+: spin push on all nearby orbs
      if (streak >= 8) {
        const pushRadius = 200;
        for (const orb of orbsRef.current) {
          const dx = orb.x - pos.x;
          const dy = orb.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < pushRadius && dist > 0) {
            const force = 2 * (1 - dist / pushRadius);
            // tangential push (spin effect)
            orb.vx += (-dy / dist) * force;
            orb.vy += (dx / dist) * force;
          }
        }
      }

      setOrbCount(orbsRef.current.length);
      if (streak >= 2) {
        playStreakTone(streak, pos.x, window.innerWidth);
      } else {
        playSpawn(pos.x, window.innerWidth);
      }
    },
    [getPos]
  );

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      const pos = getPos(e);
      const hit = findOrb(pos.x, pos.y);
      if (hit) {
        splitOrb(hit);
      }
    },
    [getPos, findOrb, splitOrb]
  );

  const handleDblClick = useCallback(
    (e) => {
      const pos = getPos(e);
      const hit = findOrb(pos.x, pos.y);
      if (hit) {
        // spawn burst particles
        const born = performance.now();
        for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
          const angle = (Math.PI * 2 * i) / BURST_PARTICLE_COUNT;
          burstsRef.current.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * (2 + Math.random() * 2),
            vy: Math.sin(angle) * (2 + Math.random() * 2),
            color: hit.color,
            radius: hit.radius * 0.4,
            born,
          });
        }
        orbsRef.current = orbsRef.current.filter((o) => o.id !== hit.id);
        setOrbCount(orbsRef.current.length);
      }
    },
    [getPos, findOrb]
  );

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let time = 0;
    function draw() {
      time += 0.02;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const orbs = orbsRef.current;

      const now = performance.now();

      // screen shake
      const shake = shakeRef.current;
      if (shake > 0.5) {
        const sx = (Math.random() - 0.5) * shake;
        const sy = (Math.random() - 0.5) * shake;
        ctx.save();
        ctx.translate(sx, sy);
        shakeRef.current *= 0.88; // fast decay
      }

      // fade trail background (skip in paint mode for persistent trails)
      if (!paintModeRef.current) {
        ctx.fillStyle = "rgba(15, 15, 26, 0.25)";
        ctx.fillRect(0, 0, W, H);
      }

      // draw twinkling star field
      for (const star of starsRef.current) {
        const twinkle = 0.25 + 0.75 * ((1 + Math.sin(time * star.speed + star.phase)) * 0.5);
        const alpha = twinkle * 0.5;
        ctx.beginPath();
        ctx.arc(star.x * W, star.y * H, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
      }

      // spawn shooting stars
      if (Math.random() < SHOOTING_STAR_CHANCE) {
        const startX = Math.random() * W;
        const startY = Math.random() * H * 0.5;
        const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2; // mostly diagonal down-right
        const speed = W * 0.6 + Math.random() * W * 0.4;
        shootingStarsRef.current.push({
          x: startX, y: startY,
          dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
          born: now,
        });
      }

      // draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((s) => now - s.born < SHOOTING_STAR_DURATION);
      for (const s of shootingStarsRef.current) {
        const progress = (now - s.born) / SHOOTING_STAR_DURATION;
        const headT = Math.min(progress * 2, 1); // head moves fast
        const hx = s.x + s.dx * headT;
        const hy = s.y + s.dy * headT;
        const tailT = Math.max(0, headT - 0.15);
        const tx = s.x + s.dx * tailT;
        const ty = s.y + s.dy * tailT;
        const alpha = progress < 0.7 ? 0.7 : 0.7 * (1 - (progress - 0.7) / 0.3);
        const grad = ctx.createLinearGradient(hx, hy, tx, ty);
        grad.addColorStop(0, `rgba(220, 230, 255, ${alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // update and draw ambient motes
      for (const mote of motesRef.current) {
        mote.y -= MOTE_SPEED * mote.speed;
        mote.x += mote.drift;
        if (mote.y < -5) {
          mote.y = H + 5;
          mote.x = Math.random() * W;
        }
        if (mote.x < -5) mote.x = W + 5;
        if (mote.x > W + 5) mote.x = -5;
        const flicker = 0.15 + 0.15 * Math.sin(time * mote.speed * 2 + mote.phase);
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = mote.color + hexAlpha(flicker * 255);
        ctx.fill();
      }

      // update physics
      for (const orb of orbs) {
        if (orb === dragRef.current) continue;
        if (frozenRef.current) continue;

        // soft repulsion between orbs
        for (const other of orbs) {
          if (other === orb) continue;
          const dx = orb.x - other.x;
          const dy = orb.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_DIST && dist > 0) {
            const force = (REPEL_FORCE * (REPEL_DIST - dist)) / REPEL_DIST;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
          }
        }

        // cursor interaction: attract or repel
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mdx = mx - orb.x;
        const mdy = my - orb.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const effectiveDist = attractModeRef.current ? ATTRACT_DIST * 2.5 : ATTRACT_DIST;
        if (mDist < effectiveDist && mDist > 0) {
          const pull = ATTRACT_FORCE * (1 - mDist / effectiveDist);
          const direction = repelModeRef.current ? -3 : attractModeRef.current ? 8 : 1;
          orb.vx += (mdx / mDist) * pull * direction;
          orb.vy += (mdy / mDist) * pull * direction;
        }

        // gravity
        if (gravityRef.current) {
          orb.vy += GRAVITY;
        }

        // orbit mode: continuous tangential force around screen center
        if (orbitModeRef.current) {
          const ocx = W / 2;
          const ocy = H / 2;
          const odx = orb.x - ocx;
          const ody = orb.y - ocy;
          const oDist = Math.sqrt(odx * odx + ody * ody) || 1;
          // tangential push (perpendicular to radial)
          orb.vx += (-ody / oDist) * 0.15;
          orb.vy += (odx / oDist) * 0.15;
          // gentle inward pull to prevent escape
          orb.vx -= (odx / oDist) * 0.05;
          orb.vy -= (ody / oDist) * 0.05;
        }

        // gravity well attraction
        for (const well of wellsRef.current) {
          const wdx = well.x - orb.x;
          const wdy = well.y - orb.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          if (wDist < WELL_RANGE && wDist > 3) {
            const force = WELL_GRAVITY / (1 + wDist * 0.01);
            orb.vx += (wdx / wDist) * force;
            orb.vy += (wdy / wDist) * force;
          }
        }

        orb.vx *= FRICTION;
        orb.vy *= FRICTION;
        const speed_factor = slowMoRef.current ? 0.3 : 1;
        orb.x += orb.vx * speed_factor;
        orb.y += orb.vy * speed_factor;

        // bounce off walls
        if (orb.x < orb.radius) {
          if (Math.abs(orb.vx) > WALL_HIT_SPEED_THRESHOLD) {
            const hi = Math.min(Math.abs(orb.vx) / 5, 1);
            wallHitsRef.current.push({ x: 0, y: orb.y, color: orb.color, born: now, intensity: hi });
            playBounce(hi);
          }
          orb.x = orb.radius;
          orb.vx *= -0.6;
        }
        if (orb.x > W - orb.radius) {
          if (Math.abs(orb.vx) > WALL_HIT_SPEED_THRESHOLD) {
            const hi = Math.min(Math.abs(orb.vx) / 5, 1);
            wallHitsRef.current.push({ x: W, y: orb.y, color: orb.color, born: now, intensity: hi });
            playBounce(hi);
          }
          orb.x = W - orb.radius;
          orb.vx *= -0.6;
        }
        if (orb.y < orb.radius) {
          if (Math.abs(orb.vy) > WALL_HIT_SPEED_THRESHOLD) {
            const hi = Math.min(Math.abs(orb.vy) / 5, 1);
            wallHitsRef.current.push({ x: orb.x, y: 0, color: orb.color, born: now, intensity: hi });
            playBounce(hi);
          }
          orb.y = orb.radius;
          orb.vy *= -0.6;
        }
        if (orb.y > H - orb.radius) {
          if (Math.abs(orb.vy) > WALL_HIT_SPEED_THRESHOLD) {
            const hi = Math.min(Math.abs(orb.vy) / 5, 1);
            wallHitsRef.current.push({ x: orb.x, y: H, color: orb.color, born: now, intensity: hi });
            playBounce(hi);
          }
          orb.y = H - orb.radius;
          orb.vy *= -0.6;
        }
      }

      // spawn nebula trail particles behind fast-moving orbs
      if (trailsRef.current.length < TRAIL_MAX) {
        for (const orb of orbs) {
          const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (speed > TRAIL_SPEED_THRESHOLD && Math.random() < TRAIL_SPAWN_RATE) {
            const drift_angle = Math.random() * Math.PI * 2;
            const drift_speed = 0.1 + Math.random() * 0.15;
            trailsRef.current.push({
              x: orb.x + (Math.random() - 0.5) * orb.radius * 0.6,
              y: orb.y + (Math.random() - 0.5) * orb.radius * 0.6,
              vx: drift_speed * Math.cos(drift_angle),
              vy: drift_speed * Math.sin(drift_angle),
              color: orb.color,
              size: 1.2 + Math.random() * 2.0,
              born: now,
            });
          }
        }
      }

      // pulse synchronization – connected orbs gradually sync their phases
      if (!frozenRef.current) {
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const a = orbs[i];
            const b = orbs[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DIST) {
              const proximity = 1 - dist / CONNECTION_DIST;
              const syncRate = 0.008 * proximity;
              let diff = b.pulsePhase - a.pulsePhase;
              while (diff > Math.PI) diff -= Math.PI * 2;
              while (diff < -Math.PI) diff += Math.PI * 2;
              a.pulsePhase += diff * syncRate;
              b.pulsePhase -= diff * syncRate;
            }
          }
        }
      }

      // color cycling – shift hue each frame
      if (colorCycleRef.current) {
        for (const orb of orbs) {
          const [h, s, l] = hexToHsl(orb.color);
          orb.color = hslToHex(h + 0.8, s, l);
        }
      }

      // merge overlapping orbs
      const toRemove = new Set();
      for (let i = 0; i < orbs.length; i++) {
        if (toRemove.has(i)) continue;
        for (let j = i + 1; j < orbs.length; j++) {
          if (toRemove.has(j)) continue;
          const a = orbs[i];
          const b = orbs[j];
          if (a === dragRef.current || b === dragRef.current) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const smaller = Math.min(a.radius, b.radius);
          if (dist < smaller * MERGE_DIST_FACTOR) {
            // merge b into a (conserve area)
            const newArea = Math.PI * a.radius * a.radius + Math.PI * b.radius * b.radius;
            const bigger = a.radius >= b.radius ? a : b;
            const lesser = a.radius >= b.radius ? b : a;
            bigger.radius = Math.sqrt(newArea / Math.PI);
            // blend velocity weighted by size
            const totalR = a.radius + b.radius;
            bigger.vx = (a.vx * a.radius + b.vx * b.radius) / totalR;
            bigger.vy = (a.vy * a.radius + b.vy * b.radius) / totalR;
            // position at center of mass
            bigger.x = (a.x * a.radius + b.x * b.radius) / totalR;
            bigger.y = (a.y * a.radius + b.y * b.radius) / totalR;
            bigger.pulsePhase = Math.random() * Math.PI * 2;
            // flash effect
            flashesRef.current.push({
              x: bigger.x,
              y: bigger.y,
              color: bigger.color,
              radius: bigger.radius,
              born: now,
            });
            toRemove.add(a === bigger ? j : i);
          }
        }
      }
      if (toRemove.size > 0) {
        orbsRef.current = orbs.filter((_, idx) => !toRemove.has(idx));
        setOrbCount(orbsRef.current.length);
        playMergeSound();
      }

      // Black hole collapse: massive orbs implode into gravity wells
      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i];
        if (orb.radius > COLLAPSE_RADIUS && orb !== dragRef.current) {
          orbsRef.current.splice(i, 1);
          // Create gravity well
          wellsRef.current.push({
            id: Date.now() + Math.random(),
            x: orb.x, y: orb.y,
            radius: 12,
            color: orb.color,
            born: now,
          });
          // Implosion particles: start far out, move inward
          for (let j = 0; j < 12; j++) {
            const angle = (Math.PI * 2 * j) / 12;
            const dist = 60 + Math.random() * 40;
            burstsRef.current.push({
              x: orb.x + Math.cos(angle) * dist,
              y: orb.y + Math.sin(angle) * dist,
              vx: -Math.cos(angle) * (3 + Math.random() * 2),
              vy: -Math.sin(angle) * (3 + Math.random() * 2),
              color: orb.color,
              radius: 3,
              born: now,
            });
          }
          flashesRef.current.push({
            x: orb.x, y: orb.y,
            color: orb.color,
            radius: orb.radius * 2,
            born: now,
          });
          ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          shakeRef.current = Math.max(shakeRef.current, 25);
          setOrbCount(orbsRef.current.length);
          playCollapse();
        }
      }

      // update and draw shockwaves (with cascade chain reactions)
      const maxWaveRadius = Math.sqrt(W * W + H * H) * WAVE_MAX_RADIUS_FACTOR;
      wavesRef.current = wavesRef.current.filter((w) => w.radius < maxWaveRadius);
      const pendingCascades = [];
      for (const wave of wavesRef.current) {
        // handle delayed cascade waves
        if (wave.delay > 0) {
          wave.delay--;
          continue;
        }
        wave.radius += WAVE_SPEED;
        const gen = wave.generation || 0;
        const genForceMultiplier = Math.pow(CASCADE_FORCE_DECAY, gen);
        const genWidth = WAVE_WIDTH * Math.pow(0.8, gen);
        // push orbs that fall within the ring
        for (const orb of orbs) {
          if (orb === dragRef.current) continue;
          const dx = orb.x - wave.cx;
          const dy = orb.y - wave.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > wave.radius - genWidth && dist < wave.radius + genWidth && dist > 0) {
            const proximity = 1 - Math.abs(dist - wave.radius) / genWidth;
            const force = WAVE_FORCE * genForceMultiplier * proximity * (1 - wave.radius / maxWaveRadius);
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
            // cascade chain reaction: if orb hit hard enough, spawn secondary wave
            if (!wave.hitOrbs) wave.hitOrbs = new Set();
            if (!wave.hitOrbs.has(orb.id) && gen < CASCADE_MAX_GEN) {
              wave.hitOrbs.add(orb.id);
              const orbSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
              if (orbSpeed > CASCADE_SPEED_THRESHOLD) {
                pendingCascades.push({
                  cx: orb.x,
                  cy: orb.y,
                  radius: 0,
                  color: orb.color,
                  generation: gen + 1,
                  hitOrbs: new Set([orb.id]),
                  delay: CASCADE_DELAY_FRAMES,
                });
              }
            }
          }
        }
        // draw the ring
        const alpha = 0.6 * (1 - wave.radius / maxWaveRadius) * Math.pow(0.75, gen);
        if (alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(wave.cx, wave.cy, wave.radius, 0, Math.PI * 2);
          const ringGrad = ctx.createRadialGradient(
            wave.cx, wave.cy, Math.max(0, wave.radius - genWidth),
            wave.cx, wave.cy, wave.radius + genWidth
          );
          ringGrad.addColorStop(0, "transparent");
          ringGrad.addColorStop(0.3, wave.color + hexAlpha(alpha * 0.5 * 255));
          ringGrad.addColorStop(0.5, wave.color + hexAlpha(alpha * 255));
          ringGrad.addColorStop(0.7, wave.color + hexAlpha(alpha * 0.5 * 255));
          ringGrad.addColorStop(1, "transparent");
          ctx.strokeStyle = ringGrad;
          ctx.lineWidth = genWidth * 2;
          ctx.stroke();
        }
      }
      // add cascade waves after iteration to avoid modifying array during loop
      if (pendingCascades.length > 0) {
        // cap cascades per frame to prevent performance issues
        const maxCascadesPerFrame = 6;
        for (let i = 0; i < Math.min(pendingCascades.length, maxCascadesPerFrame); i++) {
          wavesRef.current.push(pendingCascades[i]);
        }
        if (pendingCascades.length > 0) {
          shakeRef.current = Math.max(shakeRef.current, 6 * pendingCascades.length);
        }
      }

      // draw connections (enhanced with harmonic resonance)
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i];
          const b = orbs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST;

            // calculate phase sync (0 = out of sync, 1 = perfectly synced)
            let phaseDiff = Math.abs(a.pulsePhase - b.pulsePhase) % (Math.PI * 2);
            if (phaseDiff > Math.PI) phaseDiff = Math.PI * 2 - phaseDiff;
            const sync = 1 - phaseDiff / Math.PI;
            const syncBoost = sync * sync;

            // synced connections are brighter and thicker
            const lineAlpha = alpha * (0.5 + syncBoost * 0.8);
            const lineWidth = alpha * (2 + syncBoost * 4);

            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, a.color + hexAlpha(lineAlpha * 255));
            grad.addColorStop(1, b.color + hexAlpha(lineAlpha * 255));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            // glow effect for highly synced connections
            if (syncBoost > 0.5) {
              const glowAlpha = (syncBoost - 0.5) * alpha * 0.3;
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const glowGrad = ctx.createRadialGradient(midX, midY, 0, midX, midY, dist * 0.3);
              glowGrad.addColorStop(0, a.color + hexAlpha(glowAlpha * 255));
              glowGrad.addColorStop(1, "transparent");
              ctx.beginPath();
              ctx.arc(midX, midY, dist * 0.3, 0, Math.PI * 2);
              ctx.fillStyle = glowGrad;
              ctx.fill();
            }
          }
        }
      }

      // update and draw nebula trail particles
      trailsRef.current = trailsRef.current.filter((t) => now - t.born < TRAIL_LIFETIME);
      for (const t of trailsRef.current) {
        const age = (now - t.born) / TRAIL_LIFETIME;
        const alpha = (1 - age) * (1 - age) * 0.6; // quadratic fade for soft falloff
        t.x += t.vx;
        t.y += t.vy;
        const r = t.size * (1 + age * 0.5); // gently expand as they age
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r * 2.5);
        grad.addColorStop(0, t.color + hexAlpha(alpha * 255));
        grad.addColorStop(0.4, t.color + hexAlpha(alpha * 0.4 * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(t.x, t.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // draw vortex spiral arms
      vortexesRef.current = vortexesRef.current.filter((v) => now - v.born < VORTEX_DURATION);
      for (const vortex of vortexesRef.current) {
        const progress = (now - vortex.born) / VORTEX_DURATION;
        const fadeAlpha = progress < 0.15
          ? progress / 0.15 // fade in
          : (1 - (progress - 0.15) / 0.85); // fade out
        const rotation = time * 2 * vortex.direction + (now - vortex.born) * 0.002 * vortex.direction;
        const maxR = Math.min(W, H) * 0.42 * (1 - progress * 0.2);

        for (let arm = 0; arm < VORTEX_ARMS; arm++) {
          const armOffset = (Math.PI * 2 * arm) / VORTEX_ARMS;
          const steps = 90;

          ctx.beginPath();
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            // logarithmic spiral: tighter at center, wider at edges
            const theta = t * Math.PI * 3.5 + armOffset + rotation;
            const r = t * t * maxR; // quadratic growth for a natural spiral
            const x = vortex.cx + r * Math.cos(theta);
            const y = vortex.cy + r * Math.sin(theta);
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // width tapers from thick at center to thin at edges
          const lineAlpha = fadeAlpha * 0.45;
          ctx.strokeStyle = vortex.color + hexAlpha(Math.max(0, lineAlpha) * 255);
          ctx.lineWidth = 2.5 * (1 - progress * 0.6);
          ctx.lineCap = "round";
          ctx.stroke();

          // glow layer for the spiral arm
          if (fadeAlpha > 0.2) {
            ctx.beginPath();
            for (let s = 0; s <= steps; s++) {
              const t = s / steps;
              const theta = t * Math.PI * 3.5 + armOffset + rotation;
              const r = t * t * maxR;
              const x = vortex.cx + r * Math.cos(theta);
              const y = vortex.cy + r * Math.sin(theta);
              if (s === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = vortex.color + hexAlpha(Math.max(0, fadeAlpha * 0.12) * 255);
            ctx.lineWidth = 10 * (1 - progress * 0.5);
            ctx.stroke();
          }
        }

        // central glow at vortex center
        const coreAlpha = fadeAlpha * 0.2;
        const coreR = 40 + 20 * Math.sin(time * 3);
        const coreGrad = ctx.createRadialGradient(vortex.cx, vortex.cy, 0, vortex.cx, vortex.cy, coreR);
        coreGrad.addColorStop(0, vortex.color + hexAlpha(coreAlpha * 255));
        coreGrad.addColorStop(0.5, vortex.color + hexAlpha(coreAlpha * 0.3 * 255));
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(vortex.cx, vortex.cy, coreR, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw comet trails
      for (const orb of orbs) {
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed > 0.8) {
          const tailLen = Math.min(speed * 12, 60);
          const nx = orb.vx / speed;
          const ny = orb.vy / speed;
          const tailX = orb.x - nx * tailLen;
          const tailY = orb.y - ny * tailLen;
          const grad = ctx.createLinearGradient(orb.x, orb.y, tailX, tailY);
          const alpha = Math.min((speed - 0.8) / 3, 0.7);
          grad.addColorStop(0, orb.color + hexAlpha(alpha * 255));
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(orb.x, orb.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = orb.radius * 0.8;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      // draw orbs
      for (const orb of orbs) {
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);
        const r = orb.radius * pulse;

        // outer glow
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          r * 3
        );
        grad.addColorStop(0, orb.color + "66");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core
        const coreGrad = ctx.createRadialGradient(
          orb.x - r * 0.3,
          orb.y - r * 0.3,
          0,
          orb.x,
          orb.y,
          r
        );
        coreGrad.addColorStop(0, "#fff");
        coreGrad.addColorStop(0.3, orb.color);
        coreGrad.addColorStop(1, orb.color + "88");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw gravity wells
      for (const well of wellsRef.current) {
        const wellAge = (now - well.born) / 1000;

        // outer gravitational field glow
        const fieldAlpha = 0.04 + 0.02 * Math.sin(time * 2);
        const fieldGrad = ctx.createRadialGradient(well.x, well.y, well.radius * 2, well.x, well.y, WELL_RANGE * 0.6);
        fieldGrad.addColorStop(0, well.color + hexAlpha(fieldAlpha * 255));
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(well.x, well.y, WELL_RANGE * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // rotating accretion rings
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = well.radius * (2.2 + ring * 1.4);
          const rotSpeed = (ring % 2 === 0 ? 1 : -1) * (2.0 - ring * 0.4);
          const rotation = wellAge * rotSpeed;
          const ringAlpha = 0.35 - ring * 0.08;
          ctx.save();
          ctx.translate(well.x, well.y);
          ctx.rotate(rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringRadius, ringRadius * 0.28, 0, 0, Math.PI * 2);
          ctx.strokeStyle = well.color + hexAlpha(ringAlpha * 255);
          ctx.lineWidth = 1.8 - ring * 0.4;
          ctx.stroke();
          ctx.restore();
        }

        // photon sphere edge ring
        const edgePulse = 0.45 + 0.15 * Math.sin(time * 3 + well.born);
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = well.color + hexAlpha(edgePulse * 255);
        ctx.lineWidth = 2;
        ctx.stroke();

        // dark core (event horizon)
        const coreGrad = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, well.radius * 1.3);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.5, "#050510");
        coreGrad.addColorStop(0.8, well.color + "33");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw spawn ripples
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.born < RIPPLE_DURATION);
      for (const ripple of ripplesRef.current) {
        const progress = (now - ripple.born) / RIPPLE_DURATION;
        const radius = 10 + progress * 60;
        const alpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color + hexAlpha(alpha * 0.6 * 255);
        ctx.lineWidth = 2 * (1 - progress);
        ctx.stroke();
      }

      // draw burst particles
      burstsRef.current = burstsRef.current.filter((p) => now - p.born < BURST_DURATION);
      for (const p of burstsRef.current) {
        const progress = (now - p.born) / BURST_DURATION;
        const alpha = 1 - progress;
        const r = p.radius * (1 - progress * 0.5);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
        grad.addColorStop(0, p.color + hexAlpha(alpha * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // draw merge flashes
      flashesRef.current = flashesRef.current.filter((f) => now - f.born < MERGE_FLASH_DURATION);
      for (const f of flashesRef.current) {
        const progress = (now - f.born) / MERGE_FLASH_DURATION;
        const alpha = (1 - progress) * 0.8;
        const r = f.radius * (1.5 + progress * 3);
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, "#ffffff" + hexAlpha(alpha * 255));
        grad.addColorStop(0.4, f.color + hexAlpha(alpha * 0.5 * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // draw cursor influence radius when attract or repel mode is active
      if (attractModeRef.current || repelModeRef.current) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const radius = attractModeRef.current ? ATTRACT_DIST * 2.5 : ATTRACT_DIST;
        const color = attractModeRef.current ? "rgba(240,147,251," : "rgba(250,112,154,";
        const pulse = 1 + 0.06 * Math.sin(now / 400);
        const r = radius * pulse;
        const grad = ctx.createRadialGradient(mx, my, r * 0.85, mx, my, r);
        grad.addColorStop(0, color + "0)");
        grad.addColorStop(0.7, color + "0.07)");
        grad.addColorStop(1, color + "0)");
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // thin ring at edge
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.strokeStyle = color + (0.25 * pulse).toFixed(2) + ")";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // draw wall hit glow effects
      wallHitsRef.current = wallHitsRef.current.filter((h) => now - h.born < WALL_HIT_DURATION);
      for (const hit of wallHitsRef.current) {
        const progress = (now - hit.born) / WALL_HIT_DURATION;
        const alpha = (1 - progress) * 0.5 * hit.intensity;
        const size = 15 + progress * 35;
        const grad = ctx.createRadialGradient(hit.x, hit.y, 0, hit.x, hit.y, size);
        grad.addColorStop(0, hit.color + hexAlpha(alpha * 255));
        grad.addColorStop(0.4, hit.color + hexAlpha(alpha * 0.4 * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(hit.x, hit.y, size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // collective heartbeat – screen-wide pulse when orbs are synchronized
      if (orbs.length > 2) {
        let sumSin = 0, sumCos = 0;
        const pulseFreq = 1.5;
        for (const orb of orbs) {
          const phase = time * pulseFreq + orb.pulsePhase;
          sumCos += Math.cos(phase);
          sumSin += Math.sin(phase);
        }
        const coherence = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / orbs.length;
        if (coherence > 0.5) {
          const intensity = (coherence - 0.5) * 2;
          const avgPhase = Math.atan2(sumSin, sumCos);
          const pulseBright = (1 + Math.sin(avgPhase)) * 0.5;
          const alpha = intensity * pulseBright * 0.08;
          const heartGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
          heartGrad.addColorStop(0, `rgba(102, 126, 234, ${alpha})`);
          heartGrad.addColorStop(1, "transparent");
          ctx.fillStyle = heartGrad;
          ctx.fillRect(0, 0, W, H);
        }
      }

      // draw vignette overlay for cinematic depth
      const vignetteGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.75);
      vignetteGrad.addColorStop(0, "transparent");
      vignetteGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, W, H);

      // restore shake transform
      if (shake > 0.5) {
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // seed initial orbs and stars
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    for (let i = 0; i < 5; i++) {
      orbsRef.current.push(
        createOrb(
          W * 0.2 + Math.random() * W * 0.6,
          H * 0.2 + Math.random() * H * 0.6
        )
      );
    }
    setOrbCount(orbsRef.current.length);
    // generate star field (positions stored as 0-1 fractions so they scale with resize)
    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
    }));
    motesRef.current = Array.from({ length: MOTE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 0.8 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  const handleScatter = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    for (const orb of orbsRef.current) {
      const dx = orb.x - cx;
      const dy = orb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 4 + Math.random() * 4;
      orb.vx += (dx / dist) * strength;
      orb.vy += (dy / dist) * strength;
    }
    shakeRef.current = 12;
  }, []);

  const handleGather = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    for (const orb of orbsRef.current) {
      const dx = cx - orb.x;
      const dy = cy - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 3 + Math.random() * 3;
      orb.vx += (dx / dist) * strength;
      orb.vy += (dy / dist) * strength;
    }
  }, []);

  const handleGravity = useCallback(() => {
    setGravityOn((prev) => {
      gravityRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleFreeze = useCallback(() => {
    setFrozen((prev) => {
      frozenRef.current = !prev;
      return !prev;
    });
  }, []);

  const handlePaintMode = useCallback(() => {
    setPaintMode((prev) => {
      paintModeRef.current = !prev;
      // clear the canvas when exiting paint mode to remove persistent trails
      if (prev) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          const dpr = window.devicePixelRatio || 1;
          ctx.fillStyle = "#0f0f1a";
          ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        }
      }
      return !prev;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    const now = performance.now();
    for (const orb of orbsRef.current) {
      for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / BURST_PARTICLE_COUNT;
        burstsRef.current.push({
          x: orb.x,
          y: orb.y,
          vx: Math.cos(angle) * (2 + Math.random() * 2),
          vy: Math.sin(angle) * (2 + Math.random() * 2),
          color: orb.color,
          radius: orb.radius * 0.4,
          born: now,
        });
      }
    }
    orbsRef.current = [];
    trailsRef.current = [];
    setOrbCount(0);
    shakeRef.current = 20;
  }, []);

  const handleSpin = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    for (const orb of orbsRef.current) {
      const dx = orb.x - cx;
      const dy = orb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 3 + Math.random() * 2;
      // tangential velocity (perpendicular to radial direction)
      orb.vx += (-dy / dist) * strength;
      orb.vy += (dx / dist) * strength;
      // slight inward pull to keep the vortex tight
      orb.vx -= (dx / dist) * 0.5;
      orb.vy -= (dy / dist) * 0.5;
    }
    // spawn visible vortex spiral
    vortexesRef.current.push({
      cx, cy,
      born: performance.now(),
      color: randomColor(),
      direction: Math.random() > 0.5 ? 1 : -1,
    });
    playSwoosh();
  }, []);

  const handleWave = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    // Fire from cursor position, fall back to center if no interaction yet
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    wavesRef.current.push({
      cx,
      cy,
      radius: 0,
      color: randomColor(),
      generation: 0,
      hitOrbs: new Set(),
      delay: 0,
    });
    shakeRef.current = 16;
    playBoom();
  }, []);

  const handleSlowMo = useCallback(() => {
    setSlowMo((prev) => {
      slowMoRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleRepelMode = useCallback(() => {
    setRepelMode((prev) => {
      repelModeRef.current = !prev;
      // disable attract if enabling repel
      if (!prev && attractModeRef.current) {
        attractModeRef.current = false;
        setAttractMode(false);
      }
      return !prev;
    });
  }, []);

  const handleOrbitMode = useCallback(() => {
    setOrbitMode((prev) => {
      orbitModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleColorCycle = useCallback(() => {
    setColorCycle((prev) => {
      colorCycleRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleAttractMode = useCallback(() => {
    setAttractMode((prev) => {
      attractModeRef.current = !prev;
      // disable repel if enabling attract
      if (!prev && repelModeRef.current) {
        repelModeRef.current = false;
        setRepelMode(false);
      }
      return !prev;
    });
  }, []);

  const handleShuffle = useCallback(() => {
    const now = performance.now();
    for (const orb of orbsRef.current) {
      const oldColor = orb.color;
      let newColor;
      do { newColor = randomColor(); } while (newColor === oldColor && COLORS.length > 1);
      orb.color = newColor;
      flashesRef.current.push({
        x: orb.x,
        y: orb.y,
        color: newColor,
        radius: orb.radius,
        born: now,
      });
    }
  }, []);

  const handleBurst = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const count = 6;
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const orb = createOrb(cx, cy);
      orb.vx = Math.cos(angle) * (3 + Math.random() * 2);
      orb.vy = Math.sin(angle) * (3 + Math.random() * 2);
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x: cx, y: cy, color: orb.color, born: now });
    }
    setOrbCount(orbsRef.current.length);
    shakeRef.current = 10;
    playBurstSound();
  }, []);

  const handleFirework = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const launchX = W * 0.2 + Math.random() * W * 0.6;
    const peakY = H * 0.15 + Math.random() * H * 0.25;
    const count = 8;
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const orb = createOrb(launchX, H);
      orb.radius = 5 + Math.random() * 6;
      // launch upward with spread
      orb.vx = Math.cos(angle) * (1.5 + Math.random() * 1.5);
      orb.vy = -(H - peakY) / 60 + Math.sin(angle) * (1 + Math.random());
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x: launchX, y: H, color: orb.color, born: now });
    }
    setOrbCount(orbsRef.current.length);
    shakeRef.current = 8;
  }, []);

  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      audioMuted = prev;
      return !prev;
    });
  }, []);

  const handlePlaceWell = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    // check if near existing well – remove it
    const nearIdx = wellsRef.current.findIndex((w) => {
      const dx = w.x - mx;
      const dy = w.y - my;
      return Math.sqrt(dx * dx + dy * dy) < w.radius + 25;
    });
    if (nearIdx >= 0) {
      const well = wellsRef.current[nearIdx];
      const now = performance.now();
      for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / BURST_PARTICLE_COUNT;
        burstsRef.current.push({
          x: well.x, y: well.y,
          vx: Math.cos(angle) * (1.5 + Math.random() * 1.5),
          vy: Math.sin(angle) * (1.5 + Math.random() * 1.5),
          color: well.color, radius: 3, born: now,
        });
      }
      wellsRef.current.splice(nearIdx, 1);
      shakeRef.current = 5;
      return;
    }
    // place new well
    const color = randomColor();
    wellsRef.current.push({
      id: Date.now() + Math.random(),
      x: mx, y: my,
      radius: 12,
      color,
      born: performance.now(),
    });
    ripplesRef.current.push({ x: mx, y: my, color, born: performance.now() });
    shakeRef.current = 6;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          handleFreeze();
          break;
        case "g":
          handleGravity();
          break;
        case "s":
          handleScatter();
          break;
        case "c":
          handleGather();
          break;
        case "r":
          handleSpin();
          break;
        case "b":
          handleBurst();
          break;
        case "w":
          handleWave();
          break;
        case "x":
          handleClearAll();
          break;
        case "p":
          handlePaintMode();
          break;
        case "h":
          handleShuffle();
          break;
        case "m":
          handleSlowMo();
          break;
        case "f":
          handleFirework();
          break;
        case "d":
          handleRepelMode();
          break;
        case "o":
          handleOrbitMode();
          break;
        case "j":
          handleColorCycle();
          break;
        case "a":
          handleAttractMode();
          break;
        case "n":
          handlePlaceWell();
          break;
        case "v":
          handleToggleAudio();
          break;
        case "?":
          setShowHelp((prev) => !prev);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleFreeze, handleGravity, handleScatter, handleGather, handleSpin, handleBurst, handleWave, handleClearAll, handlePaintMode, handleShuffle, handleSlowMo, handleFirework, handleRepelMode, handleOrbitMode, handleColorCycle, handleAttractMode, handlePlaceWell, handleToggleAudio, setShowHelp]);

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDblClick}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
      <HUD>
        <Title>Automatic Software</Title>
        <Hint>click to create &middot; drag to move &middot; double-click to remove &middot; right-click to split &middot; merge to grow &middot; big orbs collapse</Hint>
        <Hint>keys: space b f n c r w h g d a o j s p m v x &middot; press ? for help</Hint>
        <Count>{orbCount} orb{orbCount !== 1 ? "s" : ""}</Count>
        {streakDisplay >= 2 && (
          <StreakCounter key={streakDisplay} $streak={streakDisplay}>
            {streakDisplay}x
          </StreakCounter>
        )}
        <ModeIndicators>
          {frozen && <ModePill $color="#4facfe">frozen</ModePill>}
          {gravityOn && <ModePill $color="#43e97b">gravity</ModePill>}
          {orbitMode && <ModePill $color="#f093fb">orbit</ModePill>}
          {repelMode && <ModePill $color="#fa709a">repel</ModePill>}
          {attractMode && <ModePill $color="#f093fb">magnet</ModePill>}
          {paintMode && <ModePill $color="#feb47b">paint</ModePill>}
          {slowMo && <ModePill $color="#00f2fe">slow-mo</ModePill>}
          {colorCycle && <ModePill $color="#667eea">rainbow</ModePill>}
        </ModeIndicators>
      </HUD>
      <ButtonGroup>
          <ActionButton onClick={handleBurst} title="Burst spawn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleFirework} title="Firework">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="22" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="4" />
              <line x1="12" y1="8" x2="8" y2="4" />
              <line x1="12" y1="8" x2="16" y2="4" />
              <line x1="12" y1="8" x2="6" y2="8" />
              <line x1="12" y1="8" x2="18" y2="8" />
              <line x1="12" y1="8" x2="8" y2="12" />
              <line x1="12" y1="8" x2="16" y2="12" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handlePlaceWell} title="Place gravity well">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </ActionButton>
        {orbCount > 0 && (
          <>
          <ActionButton onClick={handleGather} title="Gather orbs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="5" x2="12" y2="12" />
              <polyline points="12 8 12 12 8 12" />
              <line x1="19" y1="5" x2="12" y2="12" />
              <polyline points="12 8 12 12 16 12" />
              <line x1="5" y1="19" x2="12" y2="12" />
              <polyline points="8 12 12 12 12 16" />
              <line x1="19" y1="19" x2="12" y2="12" />
              <polyline points="16 12 12 12 12 16" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleSpin} title="Spin orbs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleWave} title="Shockwave">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" opacity="0.6" />
              <circle cx="12" cy="12" r="11" opacity="0.3" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleShuffle} title="Shuffle colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handlePaintMode} title="Paint mode" $active={paintMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleSlowMo} title="Slow motion" $active={slowMo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleRepelMode} title="Repel mode" $active={repelMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleAttractMode} title="Attract mode" $active={attractMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleOrbitMode} title="Orbit mode" $active={orbitMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleColorCycle} title="Color cycle" $active={colorCycle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleGravity} title="Toggle gravity" $active={gravityOn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="18" />
              <polyline points="6 14 12 20 18 14" />
              <line x1="4" y1="22" x2="20" y2="22" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleFreeze} title="Freeze orbs" $active={frozen}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {frozen ? (
                <>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </>
              ) : (
                <>
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </>
              )}
            </svg>
          </ActionButton>
          <ActionButton onClick={handleScatter} title="Scatter orbs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="12" x2="5" y2="5" />
              <polyline points="5 11 5 5 11 5" />
              <line x1="12" y1="12" x2="19" y2="5" />
              <polyline points="13 5 19 5 19 11" />
              <line x1="12" y1="12" x2="5" y2="19" />
              <polyline points="11 19 5 19 5 13" />
              <line x1="12" y1="12" x2="19" y2="19" />
              <polyline points="19 13 19 19 13 19" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleClearAll} title="Clear all orbs" $danger>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </ActionButton>
          </>
        )}
        </ButtonGroup>
      <MuteButton onClick={handleToggleAudio} title="Toggle sound" $muted={!audioEnabled}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {audioEnabled ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
      </MuteButton>
      <HelpButton onClick={() => setShowHelp((prev) => !prev)} title="Keyboard shortcuts">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </HelpButton>
      {showHelp && (
        <HelpOverlay onClick={() => setShowHelp(false)}>
          <HelpPanel onClick={(e) => e.stopPropagation()}>
            <HelpTitle>Keyboard Shortcuts</HelpTitle>
            <ShortcutList>
              <Shortcut><Key>click</Key><span>Create orb</span></Shortcut>
              <Shortcut><Key>drag</Key><span>Move orb</span></Shortcut>
              <Shortcut><Key>dbl-click</Key><span>Remove orb</span></Shortcut>
              <Shortcut><Key>right-click</Key><span>Split orb</span></Shortcut>
              <Shortcut><Key>long-press</Key><span>Split orb (mobile)</span></Shortcut>
              <Shortcut><Key>overlap</Key><span>Merge (big ones collapse!)</span></Shortcut>
              <hr />
              <Shortcut><Key>B</Key><span>Burst spawn</span></Shortcut>
              <Shortcut><Key>F</Key><span>Firework</span></Shortcut>
              <Shortcut><Key>C</Key><span>Gather to center</span></Shortcut>
              <Shortcut><Key>S</Key><span>Scatter outward</span></Shortcut>
              <Shortcut><Key>R</Key><span>Spin / vortex</span></Shortcut>
              <Shortcut><Key>W</Key><span>Shockwave</span></Shortcut>
              <Shortcut><Key>H</Key><span>Shuffle colors</span></Shortcut>
              <Shortcut><Key>G</Key><span>Toggle gravity</span></Shortcut>
              <Shortcut><Key>D</Key><span>Repel mode</span></Shortcut>
              <Shortcut><Key>A</Key><span>Attract mode</span></Shortcut>
              <Shortcut><Key>O</Key><span>Orbit mode</span></Shortcut>
              <Shortcut><Key>J</Key><span>Color cycle</span></Shortcut>
              <Shortcut><Key>N</Key><span>Place / remove gravity well</span></Shortcut>
              <Shortcut><Key>P</Key><span>Paint mode</span></Shortcut>
              <Shortcut><Key>M</Key><span>Slow motion</span></Shortcut>
              <Shortcut><Key>Space</Key><span>Freeze / unfreeze</span></Shortcut>
              <Shortcut><Key>V</Key><span>Toggle sound</span></Shortcut>
              <Shortcut><Key>X</Key><span>Clear all orbs</span></Shortcut>
              <Shortcut><Key>?</Key><span>Toggle this help</span></Shortcut>
            </ShortcutList>
            <HelpClose onClick={() => setShowHelp(false)}>Got it</HelpClose>
          </HelpPanel>
        </HelpOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #0f0f1a;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

const HUD = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  user-select: none;
`;

const Title = styled.h1`
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin: 0 0 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Hint = styled.p`
  font-size: 0.75rem;
  color: rgba(160, 160, 184, 0.6);
  margin: 0 0 4px;
`;

const Count = styled.p`
  font-size: 0.7rem;
  color: rgba(102, 126, 234, 0.5);
  margin: 0;
  font-variant-numeric: tabular-nums;
`;

const ModeIndicators = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ModePill = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$color}44;
  background: ${(p) => p.$color}18;
  animation: pillIn 0.2s ease;

  @keyframes pillIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const streakPop = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  30% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const StreakCounter = styled.div`
  font-size: ${(p) => Math.min(1.4 + p.$streak * 0.15, 3.2)}rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  margin-top: 8px;
  background: linear-gradient(
    135deg,
    ${(p) => p.$streak >= 8 ? "#fa709a" : p.$streak >= 5 ? "#f093fb" : "#4facfe"},
    ${(p) => p.$streak >= 8 ? "#feb47b" : p.$streak >= 5 ? "#667eea" : "#43e97b"}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${streakPop} 0.25s ease-out;
  text-shadow: none;
  filter: drop-shadow(0 0 ${(p) => Math.min(4 + p.$streak * 2, 20)}px ${(p) => p.$streak >= 8 ? "rgba(250, 112, 154, 0.6)" : p.$streak >= 5 ? "rgba(240, 147, 251, 0.5)" : "rgba(79, 172, 254, 0.4)"});
`;

const ButtonGroup = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 10px;

  @media (max-width: 600px) {
    bottom: 16px;
    right: 50%;
    transform: translateX(50%);
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: calc(100vw - 32px);
  }
`;

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.$active ? "rgba(67, 233, 123, 0.6)" : p.$danger ? "rgba(250, 112, 154, 0.3)" : "rgba(102, 126, 234, 0.3)"};
  background: ${(p) => p.$active ? "rgba(67, 233, 123, 0.15)" : "rgba(15, 15, 26, 0.7)"};
  color: ${(p) => p.$active ? "#43e97b" : p.$danger ? "rgba(250, 112, 154, 0.7)" : "rgba(102, 126, 234, 0.7)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => p.$danger ? "rgba(250, 112, 154, 0.15)" : "rgba(102, 126, 234, 0.15)"};
    color: ${(p) => p.$danger ? "#fa709a" : "#667eea"};
    border-color: ${(p) => p.$danger ? "rgba(250, 112, 154, 0.6)" : "rgba(102, 126, 234, 0.6)"};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    width: 44px;
    height: 44px;
  }
`;

const HelpButton = styled.button`
  position: fixed;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(15, 15, 26, 0.7);
  color: rgba(102, 126, 234, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: #667eea;
    border-color: rgba(102, 126, 234, 0.6);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
  }
`;

const MuteButton = styled.button`
  position: fixed;
  top: 24px;
  right: 68px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.$muted ? "rgba(250, 112, 154, 0.4)" : "rgba(102, 126, 234, 0.3)"};
  background: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.1)" : "rgba(15, 15, 26, 0.7)"};
  color: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.8)" : "rgba(102, 126, 234, 0.7)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.2)" : "rgba(102, 126, 234, 0.15)"};
    color: ${(p) => p.$muted ? "#fa709a" : "#667eea"};
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 16px;
    right: 56px;
    width: 32px;
    height: 32px;
  }
`;

const HelpOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const HelpPanel = styled.div`
  background: rgba(20, 20, 36, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 28px 32px;
  max-width: 340px;
  width: calc(100vw - 48px);
  backdrop-filter: blur(12px);
`;

const HelpTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const ShortcutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  hr {
    border: none;
    border-top: 1px solid rgba(102, 126, 234, 0.15);
    margin: 4px 0;
  }
`;

const Shortcut = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(160, 160, 184, 0.8);
`;

const Key = styled.span`
  display: inline-block;
  min-width: 56px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(102, 126, 234, 0.25);
  background: rgba(102, 126, 234, 0.08);
  color: rgba(102, 126, 234, 0.9);
  font-size: 0.75rem;
  font-family: inherit;
  text-align: center;
`;

const HelpClose = styled.button`
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.1);
  color: rgba(102, 126, 234, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
`;

export default App;
