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

// ── Chain lightning effect ─────────────────────────────────────────
const LIGHTNING_DURATION = 800; // ms for bolts to fade
const LIGHTNING_CHAIN_DIST = 250; // max jump distance between orbs
const LIGHTNING_MAX_CHAIN = 20; // max orbs per chain
const LIGHTNING_FORCE = 3; // velocity boost on struck orbs
const LIGHTNING_SEGMENTS = 10; // jagged segments per bolt

// ── Meteor shower ────────────────────────────────────────────────
const METEOR_COUNT = 14; // orbs per shower
const METEOR_STAGGER = 60; // ms between each meteor spawn
const METEOR_TRAIL_DURATION = 600; // ms for entry trail to fade

// ── Wormhole portals ─────────────────────────────────────────────
const PORTAL_RADIUS = 22;
const PORTAL_TELEPORT_DIST = 28; // orb enters portal at this distance
const PORTAL_COOLDOWN = 500; // ms before orb can re-enter a portal

// ── Supernova ──────────────────────────────────────────────────────
const SUPERNOVA_IMPLODE_MS = 600; // ms for implosion phase
const SUPERNOVA_RING_COUNT = 16; // orbs spawned in explosion ring
const SUPERNOVA_RING_SPEED = 8; // outward velocity of ring orbs
const SUPERNOVA_PULL_STRENGTH = 12; // how hard orbs pull inward

// ── Tap streak / combo system ───────────────────────────────────────
const STREAK_WINDOW = 600; // ms between taps to continue a streak
const STREAK_DECAY_DELAY = 1200; // ms after last tap before streak counter fades

// ── Orbital strike ─────────────────────────────────────────────────
const STRIKE_BEAM_MS = 400; // beam descent duration
const STRIKE_FADE_MS = 600; // post-impact fade
const STRIKE_ORB_COUNT = 8; // orbs spawned in explosion ring
const STRIKE_ORB_SPEED = 5; // outward velocity of ring orbs
const STRIKE_BEAM_WIDTH = 6; // beam core width

// ── Chain combustion ────────────────────────────────────────────────
const IGNITE_SPREAD_DIST = 65; // fire spreads within this distance
const IGNITE_BURN_MS = 1800; // ms before orb pops
const IGNITE_SPARK_COUNT = 5; // sparks per pop
const IGNITE_SPARK_SPEED = 4; // initial spark velocity
const IGNITE_SPREAD_CHANCE = 0.04; // per-frame probability of spreading
const EMBER_LIFETIME = 700; // ms for ember particles

// ── Magnetic storm ───────────────────────────────────────────────────
const STORM_DURATION = 3000; // ms total storm length
const STORM_ZAP_INTERVAL = 140; // ms between auto-lightning arcs
const STORM_SPIN_FORCE = 0.35; // tangential chaos force
const STORM_RADIAL_FORCE = 0.2; // oscillating push/pull
const STORM_ARC_COUNT = 6; // visual energy arcs from epicenter

// ── Flock mode (boid swarm behavior) ──────────────────────────────────
const FLOCK_NEIGHBOR_DIST = 120; // radius to consider neighbors
const FLOCK_SEPARATION_DIST = 40; // minimum comfortable distance
const FLOCK_SEPARATION_FORCE = 0.15; // push away from too-close neighbors
const FLOCK_ALIGNMENT_FORCE = 0.05; // match neighbor velocity direction
const FLOCK_COHESION_FORCE = 0.02; // steer toward neighbor center of mass
const FLOCK_MAX_SPEED = 4; // speed cap to keep flock coherent

// ── Tsunami wave ────────────────────────────────────────────────────
const TSUNAMI_SPEED = 10; // px per frame — fast sweep
const TSUNAMI_WIDTH = 100; // wall thickness in px
const TSUNAMI_FORCE = 7; // horizontal push on orbs
const TSUNAMI_TUMBLE = 2.5; // random vertical scatter
const TSUNAMI_FOAM_COUNT = 18; // foam particles at leading edge

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

function playSpray(y, screenH) {
  if (!audioCtx || audioMuted) return;
  const idx = Math.floor((1 - y / screenH) * PENTATONIC.length);
  const note = PENTATONIC[Math.max(0, Math.min(PENTATONIC.length - 1, idx))];
  playTone(note * 2, 0.1, "sine", 0.015);
}

function playLightning() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // High-frequency descending zap
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(2000, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
  g.gain.setValueAtTime(0.1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.25);
  // Lower crackle
  playTone(150, 0.25, "square", 0.05);
}

function playPortalSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.3);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.45);
  playTone(600, 0.25, "triangle", 0.04);
}

function playWarpSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
  g.gain.setValueAtTime(0.1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.3);
}

function playMeteorSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Descending whistle (falling from sky)
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.4);
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.55);
  // Rumble undertone
  playTone(60, 0.6, "sine", 0.08);
}

function playSupernovaSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Phase 1: deep implosion rumble (rising pitch)
  const osc1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(30, t);
  osc1.frequency.exponentialRampToValueAtTime(200, t + 0.5);
  g1.gain.setValueAtTime(0.2, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc1.connect(g1);
  g1.connect(masterGain);
  osc1.start(t);
  osc1.stop(t + 0.65);
  // Phase 2: massive detonation boom (delayed)
  const osc2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(120, t + 0.5);
  osc2.frequency.exponentialRampToValueAtTime(20, t + 1.3);
  g2.gain.setValueAtTime(0, t);
  g2.gain.setValueAtTime(0.25, t + 0.5);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
  osc2.connect(g2);
  g2.connect(masterGain);
  osc2.start(t);
  osc2.stop(t + 1.55);
  // High shimmer overtones
  const osc3 = audioCtx.createOscillator();
  const g3 = audioCtx.createGain();
  osc3.type = "triangle";
  osc3.frequency.setValueAtTime(600, t + 0.5);
  osc3.frequency.exponentialRampToValueAtTime(1800, t + 0.8);
  osc3.frequency.exponentialRampToValueAtTime(400, t + 1.2);
  g3.gain.setValueAtTime(0, t);
  g3.gain.setValueAtTime(0.08, t + 0.5);
  g3.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
  osc3.connect(g3);
  g3.connect(masterGain);
  osc3.start(t);
  osc3.stop(t + 1.35);
}

function playIgniteSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Whooshing flame ignition
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.55);
  // Crackling overtone
  playTone(800 + Math.random() * 400, 0.15, "square", 0.03);
}

function playStrikeSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Descending beam whistle (high → low)
  const osc1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(2000, t);
  osc1.frequency.exponentialRampToValueAtTime(150, t + 0.35);
  g1.gain.setValueAtTime(0.1, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc1.connect(g1);
  g1.connect(masterGain);
  osc1.start(t);
  osc1.stop(t + 0.45);
  // Impact boom (delayed to match beam arrival)
  const osc2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(100, t + 0.35);
  osc2.frequency.exponentialRampToValueAtTime(25, t + 0.9);
  g2.gain.setValueAtTime(0, t);
  g2.gain.setValueAtTime(0.22, t + 0.35);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc2.connect(g2);
  g2.connect(masterGain);
  osc2.start(t);
  osc2.stop(t + 1.05);
  // Shimmer overtone on impact
  playTone(900 + Math.random() * 300, 0.3, "triangle", 0.04);
}

let lastPopTime = 0;
function playFirePop() {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastPopTime < 0.08) return;
  lastPopTime = t;
  playTone(400 + Math.random() * 300, 0.12, "sine", 0.06);
}

function playStormSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // deep rumbling bass
  const bass = audioCtx.createOscillator();
  const bg = audioCtx.createGain();
  bass.type = "sawtooth";
  bass.frequency.setValueAtTime(55, t);
  bass.frequency.linearRampToValueAtTime(40, t + 2.5);
  bass.frequency.linearRampToValueAtTime(80, t + 3);
  bg.gain.setValueAtTime(0, t);
  bg.gain.linearRampToValueAtTime(0.08, t + 0.3);
  bg.gain.setValueAtTime(0.08, t + 2.5);
  bg.gain.linearRampToValueAtTime(0, t + 3.2);
  bass.connect(bg);
  bg.connect(masterGain);
  bass.start(t);
  bass.stop(t + 3.3);
  // crackling high noise
  const noise = audioCtx.createOscillator();
  const ng = audioCtx.createGain();
  noise.type = "square";
  noise.frequency.setValueAtTime(120, t);
  noise.frequency.linearRampToValueAtTime(200, t + 1.5);
  noise.frequency.linearRampToValueAtTime(80, t + 3);
  ng.gain.setValueAtTime(0, t);
  ng.gain.linearRampToValueAtTime(0.04, t + 0.2);
  ng.gain.setValueAtTime(0.04, t + 2.6);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
  noise.connect(ng);
  ng.connect(masterGain);
  noise.start(t);
  noise.stop(t + 3.3);
}

function playTsunamiSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // deep rushing sweep
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, t);
  osc.frequency.linearRampToValueAtTime(110, t + 0.6);
  osc.frequency.exponentialRampToValueAtTime(30, t + 1.8);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.1, t + 0.15);
  g.gain.setValueAtTime(0.1, t + 1.0);
  g.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 2.1);
  // high foamy hiss
  const hiss = audioCtx.createOscillator();
  const hg = audioCtx.createGain();
  hiss.type = "square";
  hiss.frequency.setValueAtTime(250, t);
  hiss.frequency.linearRampToValueAtTime(500, t + 0.4);
  hiss.frequency.exponentialRampToValueAtTime(120, t + 1.8);
  hg.gain.setValueAtTime(0, t);
  hg.gain.linearRampToValueAtTime(0.025, t + 0.1);
  hg.gain.setValueAtTime(0.025, t + 0.8);
  hg.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
  hiss.connect(hg);
  hg.connect(masterGain);
  hiss.start(t);
  hiss.stop(t + 2.1);
}

function generateBolt(x1, y1, x2, y2, segments = LIGHTNING_SEGMENTS) {
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
  const lightningRef = useRef([]);
  const portalsRef = useRef([]);
  const meteorTrailsRef = useRef([]);
  const shakeRef = useRef(0); // screen shake intensity (decays each frame)
  const supernovaRef = useRef(null); // active supernova {cx, cy, born, phase}
  const embersRef = useRef([]); // fire ember particles
  const strikesRef = useRef([]); // active orbital strikes
  const stormRef = useRef(null); // active magnetic storm {born, cx, cy, lastZap}
  const tsunamisRef = useRef([]); // active tsunami waves [{x, dir, born, color, foam}]
  const tsunamiDirRef = useRef(1); // alternates direction each trigger
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
  const [flockMode, setFlockMode] = useState(false);
  const flockModeRef = useRef(false);
  const longPressRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const streakRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const [streakDisplay, setStreakDisplay] = useState(0);
  const streakFadeRef = useRef(null);
  const mouseDownRef = useRef(false);
  const sprayActiveRef = useRef(false);
  const sprayStartRef = useRef({ x: 0, y: 0 });
  const lastSprayPosRef = useRef({ x: 0, y: 0 });

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
      mouseDownRef.current = true;
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
      } else {
        sprayActiveRef.current = false;
        sprayStartRef.current = { x: pos.x, y: pos.y };
        lastSprayPosRef.current = { x: pos.x, y: pos.y };
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
      } else if (mouseDownRef.current) {
        // spray mode: drag on empty space to paint orb trails
        const startDx = pos.x - sprayStartRef.current.x;
        const startDy = pos.y - sprayStartRef.current.y;
        const startDist = Math.sqrt(startDx * startDx + startDy * startDy);
        if (startDist > 20) {
          const dx = pos.x - lastSprayPosRef.current.x;
          const dy = pos.y - lastSprayPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interval = orbsRef.current.length > 200 ? 30 : 18;
          if (dist >= interval) {
            sprayActiveRef.current = true;
            const orb = createOrb(pos.x, pos.y);
            orb.radius = 4 + Math.random() * 3;
            const nx = dist > 0 ? -dy / dist : 0;
            const ny = dist > 0 ? dx / dist : 0;
            orb.vx = nx * (Math.random() - 0.5) * 0.8;
            orb.vy = ny * (Math.random() - 0.5) * 0.8;
            orbsRef.current.push(orb);
            lastSprayPosRef.current = { x: pos.x, y: pos.y };
            setOrbCount(orbsRef.current.length);
            playSpray(pos.y, window.innerHeight);
          }
        }
      }
      mouseRef.current = pos;
    },
    [getPos]
  );

  const handleUp = useCallback(
    (e) => {
      mouseDownRef.current = false;
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
      if (sprayActiveRef.current) {
        sprayActiveRef.current = false;
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

      // draw meteor entry trails
      meteorTrailsRef.current = meteorTrailsRef.current.filter((m) => now - m.born < METEOR_TRAIL_DURATION);
      for (const m of meteorTrailsRef.current) {
        const progress = (now - m.born) / METEOR_TRAIL_DURATION;
        const alpha = (1 - progress) * 0.9;
        // head position moves down
        const hx = m.x + m.dx * progress;
        const hy = m.y + m.dy * progress;
        // tail lags behind
        const tailProgress = Math.max(0, progress - 0.3);
        const tx = m.x + m.dx * tailProgress;
        const ty = m.y + m.dy * tailProgress;
        const grad = ctx.createLinearGradient(hx, hy, tx, ty);
        grad.addColorStop(0, m.color + hexAlpha(alpha * 255));
        grad.addColorStop(0.3, m.color + hexAlpha(alpha * 0.6 * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
        // bright head glow
        if (progress < 0.5) {
          const headAlpha = (1 - progress * 2) * 0.4;
          const headGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 8);
          headGrad.addColorStop(0, "#ffffff" + hexAlpha(headAlpha * 255));
          headGrad.addColorStop(0.5, m.color + hexAlpha(headAlpha * 0.5 * 255));
          headGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(hx, hy, 8, 0, Math.PI * 2);
          ctx.fillStyle = headGrad;
          ctx.fill();
        }
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

        // flock mode: boid-like swarm behavior
        if (flockModeRef.current) {
          let sepX = 0, sepY = 0;
          let alignVx = 0, alignVy = 0, alignCount = 0;
          let cohX = 0, cohY = 0, cohCount = 0;
          for (const other of orbs) {
            if (other === orb) continue;
            const fdx = other.x - orb.x;
            const fdy = other.y - orb.y;
            const fDist = Math.sqrt(fdx * fdx + fdy * fdy);
            if (fDist < FLOCK_SEPARATION_DIST && fDist > 0) {
              sepX -= (fdx / fDist) * (1 - fDist / FLOCK_SEPARATION_DIST);
              sepY -= (fdy / fDist) * (1 - fDist / FLOCK_SEPARATION_DIST);
            }
            if (fDist < FLOCK_NEIGHBOR_DIST && fDist > 0) {
              alignVx += other.vx;
              alignVy += other.vy;
              alignCount++;
              cohX += other.x;
              cohY += other.y;
              cohCount++;
            }
          }
          orb.vx += sepX * FLOCK_SEPARATION_FORCE;
          orb.vy += sepY * FLOCK_SEPARATION_FORCE;
          if (alignCount > 0) {
            orb.vx += (alignVx / alignCount - orb.vx) * FLOCK_ALIGNMENT_FORCE;
            orb.vy += (alignVy / alignCount - orb.vy) * FLOCK_ALIGNMENT_FORCE;
          }
          if (cohCount > 0) {
            orb.vx += (cohX / cohCount - orb.x) * FLOCK_COHESION_FORCE;
            orb.vy += (cohY / cohCount - orb.y) * FLOCK_COHESION_FORCE;
          }
          // cap speed for coherent flocking
          const fSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (fSpeed > FLOCK_MAX_SPEED) {
            orb.vx = (orb.vx / fSpeed) * FLOCK_MAX_SPEED;
            orb.vy = (orb.vy / fSpeed) * FLOCK_MAX_SPEED;
          }
          // give stationary orbs a nudge so the flock moves
          if (fSpeed < 0.5) {
            orb.vx += (Math.random() - 0.5) * 0.8;
            orb.vy += (Math.random() - 0.5) * 0.8;
          }
        }

        // magnetic storm chaos forces
        if (stormRef.current) {
          const storm = stormRef.current;
          const stormAge = now - storm.born;
          const stormProgress = stormAge / STORM_DURATION;
          const intensity = stormProgress < 0.15 ? stormProgress / 0.15
            : stormProgress > 0.85 ? (1 - stormProgress) / 0.15
            : 1;
          const sdx = orb.x - storm.cx;
          const sdy = orb.y - storm.cy;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
          // tangential spin (alternates direction with time)
          const spinDir = Math.sin(stormAge * 0.003) > 0 ? 1 : -1;
          orb.vx += (-sdy / sDist) * STORM_SPIN_FORCE * intensity * spinDir;
          orb.vy += (sdx / sDist) * STORM_SPIN_FORCE * intensity * spinDir;
          // oscillating radial push/pull
          const radialPhase = Math.sin(stormAge * 0.005 + sDist * 0.02);
          orb.vx += (sdx / sDist) * STORM_RADIAL_FORCE * radialPhase * intensity;
          orb.vy += (sdy / sDist) * STORM_RADIAL_FORCE * radialPhase * intensity;
          // random jitter
          orb.vx += (Math.random() - 0.5) * 0.5 * intensity;
          orb.vy += (Math.random() - 0.5) * 0.5 * intensity;
        }

        // tsunami wave forces
        for (const tsunami of tsunamisRef.current) {
          const wallX = tsunami.x;
          const leading = wallX;
          const trailing = wallX - TSUNAMI_WIDTH * tsunami.dir;
          const minX = Math.min(leading, trailing);
          const maxX = Math.max(leading, trailing);
          if (orb.x > minX - orb.radius && orb.x < maxX + orb.radius) {
            // proximity to leading edge (0 at trailing, 1 at leading)
            const proximity = 1 - Math.abs(orb.x - leading) / TSUNAMI_WIDTH;
            const force = TSUNAMI_FORCE * Math.max(0, proximity);
            orb.vx += tsunami.dir * force;
            orb.vy += (Math.random() - 0.5) * TSUNAMI_TUMBLE;
          }
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

        // portal teleportation
        const portals = portalsRef.current;
        if (portals.length === 2) {
          for (let pi = 0; pi < 2; pi++) {
            const portal = portals[pi];
            const partner = portals[1 - pi];
            const pdx = portal.x - orb.x;
            const pdy = portal.y - orb.y;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pDist < PORTAL_TELEPORT_DIST && (!orb._portalCooldown || now - orb._portalCooldown > PORTAL_COOLDOWN)) {
              const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
              const nvx = speed > 0.1 ? orb.vx / speed : 0;
              const nvy = speed > 0.1 ? orb.vy / speed : 0;
              orb.x = partner.x + nvx * (PORTAL_TELEPORT_DIST + 5);
              orb.y = partner.y + nvy * (PORTAL_TELEPORT_DIST + 5);
              orb.vx *= 1.2;
              orb.vy *= 1.2;
              orb._portalCooldown = now;
              ripplesRef.current.push({ x: portal.x, y: portal.y, color: portal.color, born: now });
              ripplesRef.current.push({ x: partner.x, y: partner.y, color: partner.color, born: now });
              playWarpSound();
              break;
            }
          }
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

      // ── Chain combustion: fire spread + pop ──
      {
        const pendingIgnitions = [];
        let orbsPopped = false;
        for (let i = orbsRef.current.length - 1; i >= 0; i--) {
          const orb = orbsRef.current[i];
          if (!orb.igniteTime) continue;
          const burnAge = now - orb.igniteTime;

          // spread fire to nearby orbs
          for (const other of orbsRef.current) {
            if (other.igniteTime || other === orb) continue;
            const dx = orb.x - other.x;
            const dy = orb.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < IGNITE_SPREAD_DIST && Math.random() < IGNITE_SPREAD_CHANCE) {
              pendingIgnitions.push(other);
            }
          }

          // emit ember particles
          if (embersRef.current.length < 400 && Math.random() < 0.35) {
            embersRef.current.push({
              x: orb.x + (Math.random() - 0.5) * orb.radius,
              y: orb.y + (Math.random() - 0.5) * orb.radius,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -1 - Math.random() * 2,
              size: 1 + Math.random() * 2.5,
              born: now,
            });
          }

          // pop after burn time
          if (burnAge > IGNITE_BURN_MS) {
            for (let s = 0; s < IGNITE_SPARK_COUNT; s++) {
              const angle = (Math.PI * 2 * s) / IGNITE_SPARK_COUNT + Math.random() * 0.3;
              burstsRef.current.push({
                x: orb.x,
                y: orb.y,
                vx: Math.cos(angle) * (IGNITE_SPARK_SPEED + Math.random() * 2),
                vy: Math.sin(angle) * (IGNITE_SPARK_SPEED + Math.random() * 2),
                color: "#feb47b",
                radius: 2 + Math.random() * 2,
                born: now,
                isFireSpark: true,
              });
            }
            flashesRef.current.push({
              x: orb.x, y: orb.y,
              color: "#feb47b",
              radius: orb.radius * 1.5,
              born: now,
            });
            orbsRef.current.splice(i, 1);
            orbsPopped = true;
            shakeRef.current = Math.max(shakeRef.current, 3);
            playFirePop();
          }
        }
        // apply pending ignitions
        for (const orb of pendingIgnitions) {
          if (!orb.igniteTime) orb.igniteTime = now;
        }
        // fire sparks can ignite orbs they fly near
        for (const burst of burstsRef.current) {
          if (!burst.isFireSpark) continue;
          for (const orb of orbsRef.current) {
            if (orb.igniteTime) continue;
            const dx = burst.x - orb.x;
            const dy = burst.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < orb.radius + 15 && Math.random() < 0.08) {
              orb.igniteTime = now;
            }
          }
        }
        if (orbsPopped) setOrbCount(orbsRef.current.length);
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
        // shockwave portal transmission
        if (portalsRef.current.length === 2) {
          for (let pi = 0; pi < 2; pi++) {
            const portal = portalsRef.current[pi];
            const partner = portalsRef.current[1 - pi];
            const dx = portal.x - wave.cx;
            const dy = portal.y - wave.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > wave.radius - genWidth && dist < wave.radius + genWidth && gen < CASCADE_MAX_GEN) {
              if (!wave._portalHits) wave._portalHits = new Set();
              if (!wave._portalHits.has(pi)) {
                wave._portalHits.add(pi);
                pendingCascades.push({
                  cx: partner.x, cy: partner.y,
                  radius: 0, color: partner.color,
                  generation: gen + 1,
                  hitOrbs: new Set(), delay: CASCADE_DELAY_FRAMES,
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

      // draw chain lightning
      lightningRef.current = lightningRef.current.filter((l) => now - l.born < LIGHTNING_DURATION);
      for (const lightning of lightningRef.current) {
        const progress = (now - lightning.born) / LIGHTNING_DURATION;
        const alpha = progress < 0.1 ? progress / 0.1 : Math.pow(1 - (progress - 0.1) / 0.9, 2);

        for (const bolt of lightning.bolts) {
          const pts = bolt.points;
          const isBranch = bolt.branch;

          // Wide glow layer
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = bolt.color + hexAlpha(alpha * 0.3 * 255);
          ctx.lineWidth = isBranch ? 6 : 12;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();

          // Colored inner glow
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = bolt.color + hexAlpha(alpha * 0.7 * 255);
          ctx.lineWidth = isBranch ? 3 : 5;
          ctx.stroke();

          // Bright white core
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = "#ffffff" + hexAlpha(alpha * 0.9 * 255);
          ctx.lineWidth = isBranch ? 1.5 : 2.5;
          ctx.stroke();
        }

        // Draw sparks
        for (const spark of lightning.sparks) {
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.95;
          spark.vy *= 0.95;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff" + hexAlpha(alpha * 0.8 * 255);
          ctx.fill();
        }
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

      // draw fire effects on ignited orbs
      for (const orb of orbs) {
        if (!orb.igniteTime) continue;
        const burnAge = (now - orb.igniteTime) / IGNITE_BURN_MS;
        const intensity = Math.min(burnAge * 3, 1);
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);
        const r = orb.radius * pulse;

        // fire glow (orange to white)
        const fireGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r * 3.5);
        const fa = 0.4 * intensity;
        fireGrad.addColorStop(0, `rgba(255, 255, 200, ${fa})`);
        fireGrad.addColorStop(0.3, `rgba(255, 180, 60, ${fa * 0.7})`);
        fireGrad.addColorStop(0.6, `rgba(255, 100, 30, ${fa * 0.4})`);
        fireGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = fireGrad;
        ctx.fill();

        // white-hot core overlay
        const coreAlpha = 0.3 * intensity + 0.1 * Math.sin(time * 8);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${Math.max(0, coreAlpha)})`;
        ctx.fill();
      }

      // draw ember particles
      embersRef.current = embersRef.current.filter((e) => now - e.born < EMBER_LIFETIME);
      for (const ember of embersRef.current) {
        const age = (now - ember.born) / EMBER_LIFETIME;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vy -= 0.02;
        ember.vx *= 0.98;
        const alpha = (1 - age) * 0.9;
        const r = ember.size * (1 - age * 0.5);
        const gColor = Math.floor(200 * (1 - age * 0.7));
        const bColor = Math.floor(50 * (1 - age));
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${gColor}, ${bColor}, ${alpha})`;
        ctx.fill();
        if (age < 0.5) {
          const glowGrad = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, r * 3);
          glowGrad.addColorStop(0, `rgba(255, ${gColor}, 0, ${alpha * 0.2})`);
          glowGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }
      }

      // draw orbital strikes
      const totalStrikeMs = STRIKE_BEAM_MS + STRIKE_FADE_MS;
      strikesRef.current = strikesRef.current.filter((s) => now - s.born < totalStrikeMs);
      for (const strike of strikesRef.current) {
        const age = now - strike.born;
        const beamProgress = Math.min(age / STRIKE_BEAM_MS, 1); // 0→1 as beam descends

        // beam head Y position (descends from above screen to target)
        const beamHeadY = -60 + (strike.ty + 60) * beamProgress;
        const beamTopY = -60;

        if (beamProgress < 1) {
          // ── Descending beam ──
          // Wide outer glow
          const glowGrad = ctx.createLinearGradient(strike.tx, beamTopY, strike.tx, beamHeadY);
          glowGrad.addColorStop(0, "transparent");
          glowGrad.addColorStop(0.6, `rgba(120, 180, 255, ${0.08 * beamProgress})`);
          glowGrad.addColorStop(1, `rgba(180, 220, 255, ${0.15 * beamProgress})`);
          ctx.beginPath();
          ctx.moveTo(strike.tx, beamTopY);
          ctx.lineTo(strike.tx, beamHeadY);
          ctx.strokeStyle = glowGrad;
          ctx.lineWidth = 40 * beamProgress;
          ctx.lineCap = "round";
          ctx.stroke();

          // Bright core beam
          const coreGrad = ctx.createLinearGradient(strike.tx, beamTopY, strike.tx, beamHeadY);
          coreGrad.addColorStop(0, "transparent");
          coreGrad.addColorStop(0.5, `rgba(200, 230, 255, ${0.4 * beamProgress})`);
          coreGrad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * beamProgress})`);
          ctx.beginPath();
          ctx.moveTo(strike.tx, beamTopY);
          ctx.lineTo(strike.tx, beamHeadY);
          ctx.strokeStyle = coreGrad;
          ctx.lineWidth = STRIKE_BEAM_WIDTH;
          ctx.stroke();

          // Beam head glow
          const headGrad = ctx.createRadialGradient(strike.tx, beamHeadY, 0, strike.tx, beamHeadY, 25 * beamProgress);
          headGrad.addColorStop(0, `rgba(255, 255, 255, ${0.8 * beamProgress})`);
          headGrad.addColorStop(0.4, `rgba(150, 200, 255, ${0.3 * beamProgress})`);
          headGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(strike.tx, beamHeadY, 25 * beamProgress, 0, Math.PI * 2);
          ctx.fillStyle = headGrad;
          ctx.fill();
        }

        // ── Impact phase ──
        if (beamProgress >= 1) {
          const fadeAge = age - STRIKE_BEAM_MS;
          const fadeProgress = fadeAge / STRIKE_FADE_MS; // 0→1 as impact fades

          // Spawn orbs + shockwave on first impact frame
          if (!strike.spawned) {
            strike.spawned = true;
            for (let i = 0; i < STRIKE_ORB_COUNT; i++) {
              const angle = (Math.PI * 2 * i) / STRIKE_ORB_COUNT;
              const orb = createOrb(strike.tx, strike.ty);
              orb.vx = Math.cos(angle) * STRIKE_ORB_SPEED;
              orb.vy = Math.sin(angle) * STRIKE_ORB_SPEED;
              orb.radius = 6 + Math.random() * 8;
              orbsRef.current.push(orb);
            }
            // Push existing nearby orbs outward
            for (const orb of orbs) {
              const dx = orb.x - strike.tx;
              const dy = orb.y - strike.ty;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              if (dist < 200) {
                const force = (1 - dist / 200) * 8;
                orb.vx += (dx / dist) * force;
                orb.vy += (dy / dist) * force;
              }
            }
            // Shockwave from impact
            wavesRef.current.push({
              cx: strike.tx, cy: strike.ty,
              radius: 0, color: "#78b4ff",
              generation: 0, hitOrbs: new Set(), delay: 0,
            });
            shakeRef.current = Math.max(shakeRef.current, 22);
            setOrbCount(orbsRef.current.length);
          }

          const alpha = 1 - fadeProgress;

          // Impact flash
          if (fadeProgress < 0.3) {
            const flashAlpha = (1 - fadeProgress / 0.3) * 0.9;
            const flashR = 60 + fadeProgress * 200;
            const flashGrad = ctx.createRadialGradient(strike.tx, strike.ty, 0, strike.tx, strike.ty, flashR);
            flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
            flashGrad.addColorStop(0.3, `rgba(150, 200, 255, ${flashAlpha * 0.5})`);
            flashGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(strike.tx, strike.ty, flashR, 0, Math.PI * 2);
            ctx.fillStyle = flashGrad;
            ctx.fill();
          }

          // Lingering beam column (fading out)
          if (alpha > 0.1) {
            ctx.beginPath();
            ctx.moveTo(strike.tx, -60);
            ctx.lineTo(strike.tx, strike.ty);
            ctx.strokeStyle = `rgba(150, 200, 255, ${alpha * 0.15})`;
            ctx.lineWidth = 20 * alpha;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(strike.tx, -60);
            ctx.lineTo(strike.tx, strike.ty);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.lineWidth = 3 * alpha;
            ctx.stroke();
          }

          // Ground scorch glow
          const scorchAlpha = alpha * 0.3;
          const scorchGrad = ctx.createRadialGradient(strike.tx, strike.ty, 0, strike.tx, strike.ty, 80);
          scorchGrad.addColorStop(0, `rgba(120, 180, 255, ${scorchAlpha})`);
          scorchGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(strike.tx, strike.ty, 80, 0, Math.PI * 2);
          ctx.fillStyle = scorchGrad;
          ctx.fill();
        }
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

      // draw portals
      for (let pi = 0; pi < portalsRef.current.length; pi++) {
        const portal = portalsRef.current[pi];
        const age = (now - portal.born) / 1000;
        const isA = pi === 0;
        const baseColor = isA ? "#00f2fe" : "#fa709a";
        const pulse = 1 + 0.08 * Math.sin(time * 3 + pi * Math.PI);
        const r = PORTAL_RADIUS * pulse;

        // Outer pull field
        const fieldGrad = ctx.createRadialGradient(portal.x, portal.y, r, portal.x, portal.y, r * 3);
        fieldGrad.addColorStop(0, baseColor + "30");
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(portal.x, portal.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // Rotating ring 1
        ctx.save();
        ctx.translate(portal.x, portal.y);
        ctx.rotate(age * 2 * (isA ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor + "cc";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Rotating ring 2 (counter)
        ctx.save();
        ctx.translate(portal.x, portal.y);
        ctx.rotate(-age * 1.3 * (isA ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor + "88";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Swirling particles
        for (let sp = 0; sp < 6; sp++) {
          const theta = (Math.PI * 2 * sp) / 6 + age * 3 * (isA ? 1 : -1);
          const orbitR = r * (0.5 + 0.4 * Math.sin(age * 2 + sp));
          const px = portal.x + Math.cos(theta) * orbitR;
          const py = portal.y + Math.sin(theta) * orbitR;
          const pAlpha = 0.4 + 0.3 * Math.sin(age * 4 + sp * 1.5);
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = baseColor + hexAlpha(pAlpha * 255);
          ctx.fill();
        }

        // Inner core glow
        const coreGrad = ctx.createRadialGradient(portal.x, portal.y, 0, portal.x, portal.y, r * 0.6);
        coreGrad.addColorStop(0, "#ffffff4d");
        coreGrad.addColorStop(0.5, baseColor + "33");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(portal.x, portal.y, r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // Connection line between paired portals
      if (portalsRef.current.length === 2) {
        const pA = portalsRef.current[0];
        const pB = portalsRef.current[1];
        const linkAlpha = 0.08 + 0.04 * Math.sin(time * 2);
        const linkGrad = ctx.createLinearGradient(pA.x, pA.y, pB.x, pB.y);
        linkGrad.addColorStop(0, "#00f2fe" + hexAlpha(linkAlpha * 255));
        linkGrad.addColorStop(0.5, "#ffffff" + hexAlpha(linkAlpha * 0.5 * 255));
        linkGrad.addColorStop(1, "#fa709a" + hexAlpha(linkAlpha * 255));
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = linkGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
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

      // ── Magnetic storm effect ──
      if (stormRef.current) {
        const storm = stormRef.current;
        const stormAge = now - storm.born;
        const stormProgress = stormAge / STORM_DURATION;

        if (stormAge >= STORM_DURATION) {
          // Storm ends — final shockwave burst
          wavesRef.current.push({
            cx: storm.cx, cy: storm.cy,
            radius: 0, color: "#4facfe",
            generation: 0, hitOrbs: new Set(), delay: 0,
          });
          shakeRef.current = Math.max(shakeRef.current, 25);
          playBoom();
          stormRef.current = null;
        } else {
          const intensity = stormProgress < 0.15 ? stormProgress / 0.15
            : stormProgress > 0.85 ? (1 - stormProgress) / 0.15
            : 1;

          // Continuous screen shake
          shakeRef.current = Math.max(shakeRef.current, 4 + intensity * 10);

          // Auto-lightning between random orb pairs
          if (now - storm.lastZap > STORM_ZAP_INTERVAL && orbs.length >= 2) {
            storm.lastZap = now;
            const a = orbs[Math.floor(Math.random() * orbs.length)];
            let b = orbs[Math.floor(Math.random() * orbs.length)];
            let tries = 0;
            while (b === a && tries < 5) { b = orbs[Math.floor(Math.random() * orbs.length)]; tries++; }
            if (b !== a) {
              const bolt = generateBolt(a.x, a.y, b.x, b.y);
              const color = a.color;
              lightningRef.current.push({
                bolts: [{ points: bolt, color }],
                sparks: [
                  { x: b.x, y: b.y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, color },
                  { x: b.x, y: b.y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, color },
                ],
                born: now,
              });
              // Small push on struck orb
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              b.vx += (dx / dist) * 1.5;
              b.vy += (dy / dist) * 1.5;
            }
          }

          // Visual: pulsing electromagnetic field rings
          const ringCount = 4;
          for (let ri = 0; ri < ringCount; ri++) {
            const phase = (ri / ringCount + stormProgress * 3) % 1;
            const maxR = Math.min(W, H) * 0.45;
            const ringR = maxR * phase;
            const ringAlpha = intensity * 0.2 * (1 - phase);
            if (ringAlpha > 0.01 && ringR > 5) {
              ctx.beginPath();
              ctx.arc(storm.cx, storm.cy, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(79, 172, 254, ${ringAlpha})`;
              ctx.lineWidth = 2 + (1 - phase) * 3;
              ctx.stroke();
            }
          }

          // Visual: energy arcs radiating from epicenter
          for (let ai = 0; ai < STORM_ARC_COUNT; ai++) {
            const arcAngle = (Math.PI * 2 * ai) / STORM_ARC_COUNT + stormAge * 0.002;
            const arcLen = 60 + intensity * 120 + Math.sin(stormAge * 0.008 + ai * 2) * 40;
            const arcAlpha = intensity * (0.15 + 0.1 * Math.sin(stormAge * 0.01 + ai));
            const endX = storm.cx + Math.cos(arcAngle) * arcLen;
            const endY = storm.cy + Math.sin(arcAngle) * arcLen;
            // Jagged arc line
            ctx.beginPath();
            ctx.moveTo(storm.cx, storm.cy);
            const segs = 5;
            for (let si = 1; si <= segs; si++) {
              const t = si / segs;
              const jx = (Math.random() - 0.5) * 20 * intensity;
              const jy = (Math.random() - 0.5) * 20 * intensity;
              ctx.lineTo(
                storm.cx + (endX - storm.cx) * t + jx,
                storm.cy + (endY - storm.cy) * t + jy
              );
            }
            ctx.strokeStyle = `rgba(102, 126, 234, ${arcAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.stroke();
          }

          // Visual: glowing core
          const coreR = 15 + intensity * 25 + Math.sin(stormAge * 0.01) * 8;
          const coreGrad = ctx.createRadialGradient(storm.cx, storm.cy, 0, storm.cx, storm.cy, coreR);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.4})`);
          coreGrad.addColorStop(0.3, `rgba(79, 172, 254, ${intensity * 0.2})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(storm.cx, storm.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();
        }
      }

      // supernova effect (two-phase: implode then explode)
      if (supernovaRef.current) {
        const sn = supernovaRef.current;
        const age = now - sn.born;

        if (sn.phase === "implode" && age < SUPERNOVA_IMPLODE_MS) {
          // Phase 1: pull all orbs toward center with accelerating force
          const progress = age / SUPERNOVA_IMPLODE_MS;
          const force = SUPERNOVA_PULL_STRENGTH * (0.3 + progress * 2);
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = sn.cx - orb.x;
            const dy = sn.cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            orb.vx += (dx / dist) * force * 0.15;
            orb.vy += (dy / dist) * force * 0.15;
            orb.vx *= 0.92;
            orb.vy *= 0.92;
          }

          // Imploding visual: concentric rings closing in
          const ringCount = 3;
          for (let ri = 0; ri < ringCount; ri++) {
            const phase = (ri / ringCount + progress) % 1;
            const maxR = Math.min(W, H) * 0.5;
            const ringR = maxR * (1 - phase);
            const ringAlpha = (1 - progress) * 0.3 * (1 - phase);
            if (ringAlpha > 0.01 && ringR > 5) {
              ctx.beginPath();
              ctx.arc(sn.cx, sn.cy, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(200, 180, 255, ${ringAlpha})`;
              ctx.lineWidth = 2 + phase * 3;
              ctx.stroke();
            }
          }

          // Growing core glow
          const coreR = 10 + progress * 50;
          const coreAlpha = progress * 0.5;
          const coreGrad = ctx.createRadialGradient(sn.cx, sn.cy, 0, sn.cx, sn.cy, coreR);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
          coreGrad.addColorStop(0.3, `rgba(200, 160, 255, ${coreAlpha * 0.5})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(sn.cx, sn.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          shakeRef.current = Math.max(shakeRef.current, 3 + progress * 12);
        } else if (sn.phase === "implode" && age >= SUPERNOVA_IMPLODE_MS) {
          // Transition to explosion phase
          sn.phase = "explode";
          sn.explodeBorn = now;

          // Destroy all existing orbs with burst particles
          for (const orb of orbsRef.current) {
            for (let i = 0; i < 4; i++) {
              const angle = (Math.PI * 2 * i) / 4;
              burstsRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2),
                color: orb.color, radius: orb.radius * 0.3, born: now,
              });
            }
          }
          orbsRef.current = [];

          // Spawn explosion ring of new orbs
          for (let i = 0; i < SUPERNOVA_RING_COUNT; i++) {
            const angle = (Math.PI * 2 * i) / SUPERNOVA_RING_COUNT + (Math.random() - 0.5) * 0.2;
            const orb = createOrb(sn.cx, sn.cy);
            orb.radius = 8 + Math.random() * 10;
            orb.vx = Math.cos(angle) * (SUPERNOVA_RING_SPEED + Math.random() * 3);
            orb.vy = Math.sin(angle) * (SUPERNOVA_RING_SPEED + Math.random() * 3);
            orbsRef.current.push(orb);
            ripplesRef.current.push({ x: sn.cx, y: sn.cy, color: orb.color, born: now });
          }

          // Massive flash
          flashesRef.current.push({
            x: sn.cx, y: sn.cy, color: "#c8a0ff",
            radius: 60, born: now,
          });

          // Massive shockwave
          wavesRef.current.push({
            cx: sn.cx, cy: sn.cy, radius: 0,
            color: "#c8a0ff", generation: 0,
            hitOrbs: new Set(), delay: 0,
          });

          shakeRef.current = 40;
          setOrbCount(orbsRef.current.length);
        }

        if (sn.phase === "explode") {
          const explodeAge = now - sn.explodeBorn;

          // Expanding supernova glow (lasts 1.5 seconds)
          if (explodeAge < 1500) {
            const progress = explodeAge / 1500;
            const glowR = 30 + progress * Math.min(W, H) * 0.6;
            const glowAlpha = (1 - progress) * 0.3;
            const glowGrad = ctx.createRadialGradient(sn.cx, sn.cy, 0, sn.cx, sn.cy, glowR);
            glowGrad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha * 0.8})`);
            glowGrad.addColorStop(0.15, `rgba(200, 160, 255, ${glowAlpha * 0.5})`);
            glowGrad.addColorStop(0.4, `rgba(118, 75, 162, ${glowAlpha * 0.3})`);
            glowGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(sn.cx, sn.cy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();

            // Radial light rays
            const rayCount = 12;
            for (let r = 0; r < rayCount; r++) {
              const rayAngle = (Math.PI * 2 * r) / rayCount + progress * 0.5;
              const rayLen = glowR * (0.5 + 0.5 * Math.sin(progress * 10 + r));
              const rayAlpha = (1 - progress) * 0.15;
              ctx.beginPath();
              ctx.moveTo(sn.cx, sn.cy);
              ctx.lineTo(
                sn.cx + Math.cos(rayAngle) * rayLen,
                sn.cy + Math.sin(rayAngle) * rayLen
              );
              ctx.strokeStyle = `rgba(200, 180, 255, ${rayAlpha})`;
              ctx.lineWidth = 2.5 * (1 - progress);
              ctx.lineCap = "round";
              ctx.stroke();
            }
          } else {
            // Supernova complete
            supernovaRef.current = null;
          }
        }
      }

      // ── Tsunami wave update & render ──
      tsunamisRef.current = tsunamisRef.current.filter((t) => {
        return t.dir > 0 ? t.x < W + TSUNAMI_WIDTH : t.x > -TSUNAMI_WIDTH;
      });
      for (const tsunami of tsunamisRef.current) {
        const speedFactor = slowMoRef.current ? 0.3 : 1;
        tsunami.x += TSUNAMI_SPEED * tsunami.dir * speedFactor;

        // update foam particles
        for (const foam of tsunami.foam) {
          foam.x += foam.vx * speedFactor;
          foam.y += foam.vy * speedFactor;
          foam.vy += 0.05; // slight gravity
          foam.life -= 16;
        }
        tsunami.foam = tsunami.foam.filter((f) => f.life > 0);

        // spawn new foam at leading edge
        if (Math.random() < 0.6) {
          tsunami.foam.push({
            x: tsunami.x + (Math.random() - 0.5) * 10,
            y: Math.random() * H,
            vx: tsunami.dir * (2 + Math.random() * 3),
            vy: (Math.random() - 0.5) * 4,
            life: 300 + Math.random() * 400,
            maxLife: 700,
            radius: 1.5 + Math.random() * 3,
          });
        }

        // screen shake while active
        shakeRef.current = Math.max(shakeRef.current, 6);

        // ── Draw the wall ──
        const age = now - tsunami.born;
        const fadeIn = Math.min(age / 200, 1);
        const offScreenProgress = tsunami.dir > 0
          ? Math.max(0, (tsunami.x - W) / TSUNAMI_WIDTH)
          : Math.max(0, -tsunami.x / TSUNAMI_WIDTH);
        const fadeOut = Math.max(0, 1 - offScreenProgress);
        const alpha = fadeIn * fadeOut;

        if (alpha > 0.01) {
          // main wall gradient
          const grad = ctx.createLinearGradient(
            tsunami.x - TSUNAMI_WIDTH * tsunami.dir, 0,
            tsunami.x, 0
          );
          const col = tsunami.color;
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.3, col + hexAlpha(alpha * 0.15 * 255));
          grad.addColorStop(0.7, col + hexAlpha(alpha * 0.35 * 255));
          grad.addColorStop(0.9, `rgba(255, 255, 255, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`);
          ctx.fillStyle = grad;
          ctx.fillRect(
            Math.min(tsunami.x, tsunami.x - TSUNAMI_WIDTH * tsunami.dir),
            0,
            TSUNAMI_WIDTH,
            H
          );

          // leading edge bright line
          ctx.beginPath();
          ctx.moveTo(tsunami.x, 0);
          ctx.lineTo(tsunami.x, H);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // secondary glow line
          ctx.beginPath();
          ctx.moveTo(tsunami.x - 6 * tsunami.dir, 0);
          ctx.lineTo(tsunami.x - 6 * tsunami.dir, H);
          ctx.strokeStyle = col + hexAlpha(alpha * 0.4 * 255);
          ctx.lineWidth = 2;
          ctx.stroke();

          // foam particles
          for (const foam of tsunami.foam) {
            const foamAlpha = (foam.life / foam.maxLife) * alpha;
            if (foamAlpha > 0.01) {
              ctx.beginPath();
              ctx.arc(foam.x, foam.y, foam.radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${foamAlpha * 0.6})`;
              ctx.fill();
            }
          }
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

  const handleFlockMode = useCallback(() => {
    setFlockMode((prev) => {
      flockModeRef.current = !prev;
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

  const handleLightning = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    let cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    let cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;

    const visited = new Set();
    const bolts = [];
    const sparks = [];

    for (let chain = 0; chain < LIGHTNING_MAX_CHAIN; chain++) {
      let nearest = null;
      let nearestDist = LIGHTNING_CHAIN_DIST;

      for (const orb of orbs) {
        if (visited.has(orb.id)) continue;
        const dx = orb.x - cx;
        const dy = orb.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = orb;
        }
      }

      if (!nearest) break;
      visited.add(nearest.id);

      const color = nearest.color;
      bolts.push({ points: generateBolt(cx, cy, nearest.x, nearest.y), color });

      // Random branch bolt (30% chance)
      if (Math.random() < 0.3) {
        const pts = bolts[bolts.length - 1].points;
        const branchIdx = Math.floor(pts.length * 0.3 + Math.random() * pts.length * 0.4);
        const bp = pts[branchIdx];
        const branchAngle = Math.random() * Math.PI * 2;
        const branchLen = 30 + Math.random() * 50;
        bolts.push({
          points: generateBolt(bp.x, bp.y, bp.x + Math.cos(branchAngle) * branchLen, bp.y + Math.sin(branchAngle) * branchLen, 5),
          color,
          branch: true,
        });
      }

      // Sparks at hit point
      for (let s = 0; s < 4; s++) {
        const angle = Math.random() * Math.PI * 2;
        sparks.push({
          x: nearest.x, y: nearest.y,
          vx: Math.cos(angle) * (1 + Math.random() * 2),
          vy: Math.sin(angle) * (1 + Math.random() * 2),
          color,
        });
      }

      // Push the struck orb outward along the chain direction
      const dx = nearest.x - cx;
      const dy = nearest.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      nearest.vx += (dx / dist) * LIGHTNING_FORCE * (0.5 + Math.random());
      nearest.vy += (dy / dist) * LIGHTNING_FORCE * (0.5 + Math.random());

      cx = nearest.x;
      cy = nearest.y;
    }

    if (bolts.length > 0) {
      lightningRef.current.push({ bolts, sparks, born: performance.now() });
      shakeRef.current = Math.max(shakeRef.current, 6 + bolts.length);
      playLightning();
    }
  }, []);

  const handlePortal = useCallback(() => {
    if (portalsRef.current.length >= 2) {
      const now = performance.now();
      for (const portal of portalsRef.current) {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6;
          burstsRef.current.push({
            x: portal.x, y: portal.y,
            vx: Math.cos(angle) * (1 + Math.random()),
            vy: Math.sin(angle) * (1 + Math.random()),
            color: portal.color, radius: 2.5, born: now,
          });
        }
      }
      portalsRef.current = [];
      shakeRef.current = 4;
      return;
    }
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const x = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const y = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    const isA = portalsRef.current.length === 0;
    const color = isA ? "#00f2fe" : "#fa709a";
    portalsRef.current.push({
      id: Date.now() + Math.random(),
      x, y, color,
      born: performance.now(),
    });
    ripplesRef.current.push({ x, y, color, born: performance.now() });
    shakeRef.current = 6;
    playPortalSound();
  }, []);

  const handleMeteorShower = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    for (let i = 0; i < METEOR_COUNT; i++) {
      setTimeout(() => {
        const x = W * 0.05 + Math.random() * W * 0.9;
        const angle = Math.PI * 0.4 + Math.random() * Math.PI * 0.2; // mostly downward
        const speed = 4 + Math.random() * 4;
        const orb = createOrb(x, -20);
        orb.radius = 6 + Math.random() * 8;
        orb.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
        orb.vy = Math.sin(angle) * speed;
        orbsRef.current.push(orb);
        ripplesRef.current.push({ x, y: 0, color: orb.color, born: performance.now() });

        // meteor entry trail
        meteorTrailsRef.current.push({
          x: x + (Math.random() - 0.5) * 40,
          y: -60 - Math.random() * 40,
          dx: orb.vx * 25,
          dy: orb.vy * 25,
          color: orb.color,
          born: performance.now(),
        });

        setOrbCount(orbsRef.current.length);
      }, i * METEOR_STAGGER);
    }

    shakeRef.current = Math.max(shakeRef.current, 12);
    playMeteorSound();
  }, []);

  const handleSupernova = useCallback(() => {
    if (supernovaRef.current) return; // already in progress
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    supernovaRef.current = {
      cx, cy,
      born: performance.now(),
      phase: "implode",
    };
    playSupernovaSound();
  }, []);

  const handleIgnite = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    const now = performance.now();
    const available = orbs.filter((o) => !o.igniteTime);
    if (available.length === 0) return;
    const count = Math.min(available.length, 1 + Math.floor(Math.random() * 3));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * available.length);
      available[idx].igniteTime = now;
      available.splice(idx, 1);
    }
    playIgniteSound();
  }, []);

  const handleStrike = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const tx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const ty = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    strikesRef.current.push({
      tx, ty,
      born: performance.now(),
      spawned: false,
    });
    playStrikeSound();
  }, []);

  const handleStorm = useCallback(() => {
    if (stormRef.current) return; // already active
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    stormRef.current = {
      cx, cy,
      born: performance.now(),
      lastZap: 0,
    };
    shakeRef.current = Math.max(shakeRef.current, 15);
    playStormSound();
  }, []);

  const handleTsunami = useCallback(() => {
    const dir = tsunamiDirRef.current;
    tsunamiDirRef.current = -dir; // alternate direction each time
    const startX = dir > 0 ? -TSUNAMI_WIDTH : window.innerWidth + TSUNAMI_WIDTH;
    tsunamisRef.current.push({
      x: startX,
      dir,
      born: performance.now(),
      color: randomColor(),
      foam: [],
    });
    shakeRef.current = Math.max(shakeRef.current, 20);
    playTsunamiSound();
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
        case "l":
          handleLightning();
          break;
        case "t":
          handlePortal();
          break;
        case "q":
          handleMeteorShower();
          break;
        case "e":
          handleSupernova();
          break;
        case "i":
          handleIgnite();
          break;
        case "k":
          handleStrike();
          break;
        case "z":
          handleStorm();
          break;
        case "y":
          handleTsunami();
          break;
        case "u":
          handleFlockMode();
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
  }, [handleFreeze, handleGravity, handleScatter, handleGather, handleSpin, handleBurst, handleWave, handleClearAll, handlePaintMode, handleShuffle, handleSlowMo, handleFirework, handleRepelMode, handleOrbitMode, handleColorCycle, handleAttractMode, handleFlockMode, handlePlaceWell, handleLightning, handlePortal, handleMeteorShower, handleSupernova, handleIgnite, handleStrike, handleStorm, handleTsunami, handleToggleAudio, setShowHelp]);

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
        <Hint>tap to create &middot; drag to spray &middot; drag orb to move &middot; double-click to remove &middot; right-click to split &middot; merge to grow</Hint>
        <Hint>keys: space b q e i k z y f t n c r w l h g d a o u j s p m v x &middot; press ? for help</Hint>
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
          {flockMode && <ModePill $color="#43e97b">flock</ModePill>}
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
          <ActionButton onClick={handleMeteorShower} title="Meteor shower">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="2" x2="10" y2="14" />
              <line x1="12" y1="1" x2="14" y2="11" />
              <line x1="20" y1="3" x2="16" y2="13" />
              <circle cx="10" cy="15" r="1.5" fill="currentColor" />
              <circle cx="14" cy="12" r="1.5" fill="currentColor" />
              <circle cx="16" cy="14" r="1.5" fill="currentColor" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleSupernova} title="Supernova">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
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
          <ActionButton onClick={handleIgnite} title="Ignite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c-4-3-8-7.5-8-12a8 8 0 0 1 14-5.3" />
              <path d="M12 22c2-2 4-5 4-8a4 4 0 0 0-7-2.6" />
              <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleStrike} title="Orbital strike">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="11" />
              <line x1="8" y1="5" x2="12" y2="11" />
              <line x1="16" y1="5" x2="12" y2="11" />
              <circle cx="12" cy="15" r="4" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="5" y1="15" x2="1" y2="15" />
              <line x1="23" y1="15" x2="19" y2="15" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleStorm} title="Magnetic storm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" opacity="0.6" transform="scale(0.5) translate(12, 12)" />
              <path d="M2 12c0-5.52 4.48-10 10-10" strokeDasharray="3 3" />
              <path d="M22 12c0 5.52-4.48 10-10 10" strokeDasharray="3 3" />
              <path d="M12 2c5.52 0 10 4.48 10 10" strokeDasharray="3 3" opacity="0.5" />
              <path d="M12 22c-5.52 0-10-4.48-10-10" strokeDasharray="3 3" opacity="0.5" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleTsunami} title="Tsunami wave">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16c2-3 4-4 6-3s4 3 6 2 4-4 6-3" />
              <path d="M2 11c2-3 4-4 6-3s4 3 6 2 4-4 6-3" opacity="0.6" />
              <path d="M2 21c2-3 4-4 6-3s4 3 6 2 4-4 6-3" opacity="0.3" />
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
          <ActionButton onClick={handleLightning} title="Chain lightning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handlePortal} title="Wormhole portal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="12" r="5" />
              <circle cx="17" cy="12" r="5" />
              <line x1="12" y1="9" x2="12" y2="15" strokeDasharray="2 2" />
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
          <ActionButton onClick={handleFlockMode} title="Flock mode" $active={flockMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17c1-2 3-3 5-2s3 3 5 2" />
              <circle cx="6" cy="8" r="1.5" fill="currentColor" />
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              <circle cx="18" cy="9" r="1.5" fill="currentColor" />
              <circle cx="9" cy="12" r="1.5" fill="currentColor" />
              <circle cx="15" cy="13" r="1.5" fill="currentColor" />
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
              <Shortcut><Key>drag</Key><span>Spray orbs (empty space)</span></Shortcut>
              <Shortcut><Key>drag orb</Key><span>Move orb</span></Shortcut>
              <Shortcut><Key>dbl-click</Key><span>Remove orb</span></Shortcut>
              <Shortcut><Key>right-click</Key><span>Split orb</span></Shortcut>
              <Shortcut><Key>long-press</Key><span>Split orb (mobile)</span></Shortcut>
              <Shortcut><Key>overlap</Key><span>Merge (big ones collapse!)</span></Shortcut>
              <hr />
              <Shortcut><Key>B</Key><span>Burst spawn</span></Shortcut>
              <Shortcut><Key>Q</Key><span>Meteor shower</span></Shortcut>
              <Shortcut><Key>E</Key><span>Supernova (implode + explode)</span></Shortcut>
              <Shortcut><Key>I</Key><span>Ignite (chain combustion)</span></Shortcut>
              <Shortcut><Key>K</Key><span>Orbital strike</span></Shortcut>
              <Shortcut><Key>Z</Key><span>Magnetic storm</span></Shortcut>
              <Shortcut><Key>Y</Key><span>Tsunami wave (alternates dir)</span></Shortcut>
              <Shortcut><Key>F</Key><span>Firework</span></Shortcut>
              <Shortcut><Key>C</Key><span>Gather to center</span></Shortcut>
              <Shortcut><Key>S</Key><span>Scatter outward</span></Shortcut>
              <Shortcut><Key>R</Key><span>Spin / vortex</span></Shortcut>
              <Shortcut><Key>W</Key><span>Shockwave</span></Shortcut>
              <Shortcut><Key>L</Key><span>Chain lightning</span></Shortcut>
              <Shortcut><Key>T</Key><span>Wormhole portal (x2, then clear)</span></Shortcut>
              <Shortcut><Key>H</Key><span>Shuffle colors</span></Shortcut>
              <Shortcut><Key>G</Key><span>Toggle gravity</span></Shortcut>
              <Shortcut><Key>D</Key><span>Repel mode</span></Shortcut>
              <Shortcut><Key>A</Key><span>Attract mode</span></Shortcut>
              <Shortcut><Key>O</Key><span>Orbit mode</span></Shortcut>
              <Shortcut><Key>U</Key><span>Flock mode (boid swarm)</span></Shortcut>
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
