// ── Audio engine ──────────────────────────────────────────────────────

// C major pentatonic across 2 octaves — always sounds musical
export const PENTATONIC = [
  261.63, 293.66, 329.63, 392.00, 440.00,
  523.25, 587.33, 659.25, 783.99, 880.00,
];

let audioCtx = null;
let masterGain = null;
let audioMuted = false;
let lastBounceTime = 0;
let lastMergeTime = 0;
let lastPopTime = 0;

export function setAudioMuted(val) {
  audioMuted = val;
}

export function ensureAudio() {
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

export function playTone(freq, duration = 0.3, type = "sine", gainVal = 0.15) {
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

export function playSpawn(x, screenW) {
  if (!ensureAudio() || audioMuted) return;
  const idx = Math.floor((x / screenW) * PENTATONIC.length);
  const note = PENTATONIC[Math.max(0, Math.min(PENTATONIC.length - 1, idx))];
  playTone(note, 0.4, "sine", 0.1);
  playTone(note * 2, 0.25, "sine", 0.03);
}

export function playMergeSound() {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastMergeTime < 0.1) return;
  lastMergeTime = t;
  const base = 180 + Math.random() * 80;
  playTone(base, 0.5, "sine", 0.08);
  playTone(base * 1.5, 0.35, "triangle", 0.04);
}

export function playBoom() {
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

export function playBounce(intensity) {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastBounceTime < 0.06) return;
  lastBounceTime = t;
  const freq = 600 + Math.random() * 500;
  playTone(freq, 0.06, "sine", 0.03 * Math.min(intensity, 1));
}

export function playSwoosh() {
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

export function playBurstSound() {
  if (!ensureAudio() || audioMuted) return;
  playTone(392, 0.35, "sine", 0.06);
  playTone(523.25, 0.3, "sine", 0.05);
  playTone(659.25, 0.25, "sine", 0.04);
}

export function playGalaxySound() {
  if (!ensureAudio() || audioMuted) return;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
  notes.forEach((note, i) => {
    setTimeout(() => {
      playTone(note, 0.5 - i * 0.06, "sine", 0.06);
      playTone(note * 1.5, 0.3, "triangle", 0.02);
    }, i * 60);
  });
}

export function playCollapse() {
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

export function playMitosis() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Bubbly ascending pop — two-tone split
  playTone(500, 0.12, "sine", 0.09);
  playTone(750, 0.1, "sine", 0.06);
  // Soft bubble overtone
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.15);
  g.gain.setValueAtTime(0.07, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.25);
}

export function playStreakTone(streak, x, screenW) {
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

export function playWarpSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Rising whoosh
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.7);
  g.gain.setValueAtTime(0.08, t);
  g.gain.linearRampToValueAtTime(0.15, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 1.1);
  // Deep boom at jump point
  const bass = audioCtx.createOscillator();
  const bg = audioCtx.createGain();
  bass.type = "sine";
  bass.frequency.setValueAtTime(60, t + 0.8);
  bass.frequency.exponentialRampToValueAtTime(20, t + 1.6);
  bg.gain.setValueAtTime(0, t);
  bg.gain.setValueAtTime(0.2, t + 0.8);
  bg.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
  bass.connect(bg);
  bg.connect(masterGain);
  bass.start(t);
  bass.stop(t + 2.0);
  // High shimmer on jump
  const shim = audioCtx.createOscillator();
  const sg = audioCtx.createGain();
  shim.type = "triangle";
  shim.frequency.setValueAtTime(1200, t + 0.8);
  shim.frequency.exponentialRampToValueAtTime(400, t + 1.4);
  sg.gain.setValueAtTime(0, t);
  sg.gain.setValueAtTime(0.06, t + 0.8);
  sg.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
  shim.connect(sg);
  sg.connect(masterGain);
  shim.start(t);
  shim.stop(t + 1.6);
}

export function playSpray(y, screenH) {
  if (!audioCtx || audioMuted) return;
  const idx = Math.floor((1 - y / screenH) * PENTATONIC.length);
  const note = PENTATONIC[Math.max(0, Math.min(PENTATONIC.length - 1, idx))];
  playTone(note * 2, 0.1, "sine", 0.015);
}

export function playLightning() {
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

export function playPortalSound() {
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

export function playMeteorSound() {
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

export function playSupernovaSound() {
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

export function playRewindSound() {
  if (!ensureAudio()) return;
  // Descending warble — VHS tape rewind feel
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(600, now);
  o.frequency.exponentialRampToValueAtTime(200, now + 0.3);
  g.gain.setValueAtTime(0.12, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  o.connect(g).connect(masterGain);
  o.start(now);
  o.stop(now + 0.4);
  // second voice — higher whine
  const o2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  o2.type = "sine";
  o2.frequency.setValueAtTime(1200, now);
  o2.frequency.exponentialRampToValueAtTime(400, now + 0.35);
  g2.gain.setValueAtTime(0.06, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  o2.connect(g2).connect(masterGain);
  o2.start(now);
  o2.stop(now + 0.35);
}

export function playIgniteSound() {
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

export function playStrikeSound() {
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

export function playFirePop() {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  if (t - lastPopTime < 0.08) return;
  lastPopTime = t;
  playTone(400 + Math.random() * 300, 0.12, "sine", 0.06);
}

export function playStormSound() {
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

export function playTsunamiSound() {
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


export function playColorWaveSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Rising shimmer arpeggio
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t + i * 0.08);
    g.gain.setValueAtTime(0, t + i * 0.08);
    g.gain.linearRampToValueAtTime(0.06, t + i * 0.08 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.5);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.55);
  });
}

export function playShatterAllSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Phase 1: crystallizing crackle (rising high-frequency)
  const osc1 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  osc1.type = "square";
  osc1.frequency.setValueAtTime(800, t);
  osc1.frequency.exponentialRampToValueAtTime(3000, t + 0.5);
  g1.gain.setValueAtTime(0.04, t);
  g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc1.connect(g1);
  g1.connect(masterGain);
  osc1.start(t);
  osc1.stop(t + 0.65);
  // Phase 2: glass shatter burst (delayed)
  const osc2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  osc2.type = "sawtooth";
  osc2.frequency.setValueAtTime(400, t + 0.6);
  osc2.frequency.exponentialRampToValueAtTime(80, t + 1.2);
  g2.gain.setValueAtTime(0, t);
  g2.gain.setValueAtTime(0.2, t + 0.6);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
  osc2.connect(g2);
  g2.connect(masterGain);
  osc2.start(t);
  osc2.stop(t + 1.35);
  // High shatter tinkle
  const osc3 = audioCtx.createOscillator();
  const g3 = audioCtx.createGain();
  osc3.type = "triangle";
  osc3.frequency.setValueAtTime(2000, t + 0.6);
  osc3.frequency.exponentialRampToValueAtTime(800, t + 1.0);
  g3.gain.setValueAtTime(0, t);
  g3.gain.setValueAtTime(0.08, t + 0.6);
  g3.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
  osc3.connect(g3);
  g3.connect(masterGain);
  osc3.start(t);
  osc3.stop(t + 1.15);
}

export function playBlackHoleSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Deep ominous drone
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(50, t);
  osc.frequency.exponentialRampToValueAtTime(30, t + 1.0);
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 1.25);
  // Eerie harmonic
  playTone(200, 0.8, "triangle", 0.05);
}

export function playCometSound() {
  if (!ensureAudio() || audioMuted) return;
  const t = audioCtx.currentTime;
  // Rising shimmer — a comet streaking past
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);
  osc.frequency.exponentialRampToValueAtTime(200, t + 1.0);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 1.05);
  // Harmonic shimmer
  playTone(600, 0.6, "triangle", 0.04);
  playTone(900, 0.4, "sine", 0.02);
}

export function playBlackHoleAbsorbSound() {
  if (!audioCtx || audioMuted) return;
  const t = audioCtx.currentTime;
  // Quick descending gulp
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t);
  osc.stop(t + 0.25);
}
