import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  RIPPLE_DURATION, BURST_DURATION, BURST_PARTICLE_COUNT, COLORS, CONNECTION_DIST,
  MERGE_DIST_FACTOR, MERGE_FLASH_DURATION, STAR_COUNT, SHOOTING_STAR_CHANCE,
  SHOOTING_STAR_DURATION, MOTE_COUNT, MOTE_SPEED, MOTE_ORB_PUSH_RANGE,
  MOTE_ORB_PUSH_FORCE, MOTE_FRICTION, MOTE_DISTURBED_GLOW, SPLIT_COUNT,
  LONG_PRESS_MS, FRICTION, REPEL_DIST, REPEL_FORCE, ATTRACT_DIST, ATTRACT_FORCE,
  GRAVITY, WAVE_SPEED, WAVE_FORCE, WAVE_WIDTH, WAVE_MAX_RADIUS_FACTOR,
  WALL_HIT_DURATION, WALL_HIT_SPEED_THRESHOLD, WELL_RANGE, WELL_GRAVITY, WELL_CRITICAL_MASS, WELL_CRITICAL_MS, WELL_CRITICAL_SCATTER,
  TRAIL_SPEED_THRESHOLD, TRAIL_LIFETIME, TRAIL_MAX, TRAIL_SPAWN_RATE,
  HOLD_CHARGE_DELAY, HOLD_CHARGE_RANGE, HOLD_CHARGE_FORCE, HOLD_CHARGE_MAX_MS,
  CASCADE_MAX_GEN, CASCADE_SPEED_THRESHOLD, CASCADE_FORCE_DECAY, CASCADE_DELAY_FRAMES,
  TAP_IMPULSE_RADIUS, TAP_IMPULSE_FORCE, COLLAPSE_RADIUS, MITOSIS_WOBBLE_START,
  SPARK_LIFETIME, SPARK_SPAWN_DIST, VORTEX_DURATION, VORTEX_ARMS,
  LIGHTNING_DURATION, LIGHTNING_CHAIN_DIST, LIGHTNING_MAX_CHAIN, LIGHTNING_FORCE,
  METEOR_COUNT, METEOR_STAGGER, METEOR_TRAIL_DURATION,
  PORTAL_RADIUS, PORTAL_TELEPORT_DIST, PORTAL_COOLDOWN,
  SUPERNOVA_IMPLODE_MS, SUPERNOVA_RING_COUNT, SUPERNOVA_RING_SPEED, SUPERNOVA_PULL_STRENGTH,
  COMET_SPEED, COMET_TRAIL_INTERVAL, COMET_ORB_COUNT, COMET_HEAD_RADIUS, COMET_TAIL_POINTS,
  WARP_CHARGE_MS, WARP_JUMP_MS, WARP_SETTLE_MS, WARP_PULL, WARP_SCATTER_SPEED,
  TAP_WAVE_DURATION, TAP_WAVE_MAX_RADIUS, TAP_WAVE_PUSH, TAP_WAVE_RINGS,
  PULSE_INTERVAL, PULSE_PULL, PULSE_PULL_RAMP,
  NOVA_CHANCE, NOVA_FUSE_MIN, NOVA_FUSE_MAX, NOVA_WARN_MS,
  NOVA_BLAST_COUNT, NOVA_BLAST_SPEED, NOVA_PUSH_RADIUS, NOVA_PUSH_FORCE,
  SHATTER_WAVE_SPEED, SHATTER_WAVE_MAX_RADIUS, SHATTER_WAVE_WIDTH,
  SHATTER_CHAIN_CHANCE, SHATTER_CHAIN_DECAY, SHATTER_MAX_GEN,
  SHATTER_PARTICLE_COUNT, SHATTER_DELAY_FRAMES,
  SHATTER_ALL_FREEZE_MS, SHATTER_ALL_FRAG_COUNT, SHATTER_ALL_FRAG_SPEED,
  FORMATION_TYPES, FORMATION_SPRING, FORMATION_DAMPING, FORMATION_HOLD_MS,
  AURORA_BAND_COUNT, AURORA_BASE_ALPHA, AURORA_ACTIVITY_BOOST, AURORA_SMOOTHING, AURORA_COLORS,
  TORNADO_DURATION, TORNADO_RADIUS, TORNADO_PULL, TORNADO_SPIN_FORCE,
  TORNADO_FLING_SPEED, TORNADO_DEBRIS_MAX,
  STREAK_WINDOW, STREAK_DECAY_DELAY, STREAK_FIREWORK, STREAK_LIGHTNING,
  STREAK_METEOR, STREAK_SUPERNOVA, STREAK_CASCADE, COMBO_FLASH_DURATION,
  STREAK_SUPERMASSIVE,
  STRIKE_BEAM_MS, STRIKE_FADE_MS, STRIKE_ORB_COUNT, STRIKE_ORB_SPEED, STRIKE_BEAM_WIDTH,
  IGNITE_SPREAD_DIST, IGNITE_BURN_MS, IGNITE_SPARK_COUNT, IGNITE_SPARK_SPEED,
  IGNITE_SPREAD_CHANCE, EMBER_LIFETIME,
  STORM_DURATION, STORM_ZAP_INTERVAL, STORM_SPIN_FORCE, STORM_RADIAL_FORCE, STORM_ARC_COUNT,
  MERGE_SPARK_COUNT, MERGE_SPARK_SPEED, MERGE_SPARK_LIFETIME, MERGE_SPARK_SIZE,
  MERGE_PUSH_RADIUS, MERGE_PUSH_FORCE, MERGE_PUSH_SPEED_MIN,
  MAGNET_RANGE, MAGNET_FORCE,
  TSUNAMI_SPEED, TSUNAMI_WIDTH, TSUNAMI_FORCE, TSUNAMI_TUMBLE, TSUNAMI_FOAM_COUNT,
  GPAINT_DOT_LIFETIME, GPAINT_DOT_RANGE, GPAINT_DOT_FORCE, GPAINT_DOT_INTERVAL, GPAINT_DOT_MAX,
  CONSTELLATION_DIST, CONSTELLATION_NODE_THRESHOLD,
  FOUNTAIN_SPAWN_INTERVAL, FOUNTAIN_SPAWN_SPEED, FOUNTAIN_SPRAY_ANGLE, FOUNTAIN_ORB_CAP, FOUNTAIN_BASE_RADIUS,
  DOMINO_DELAY, DOMINO_RESPAWN_DELAY,
  COLOR_WAVE_SPEED, COLOR_WAVE_WIDTH, COLOR_WAVE_SEGMENTS,
  NBODY_G, NBODY_RANGE, NBODY_MIN_DIST,
  VORTEX_STORM_SPIRAL_MS, VORTEX_STORM_HOLD_MS, VORTEX_STORM_EXPLODE_MS,
  VORTEX_STORM_SPIRAL_FORCE, VORTEX_STORM_TANGENT_FORCE, VORTEX_STORM_EXPLODE_SPEED,
  VORTEX_STORM_ARM_COUNT,
  STREAK_STARFALL,
  LIGHT_TRAIL_LENGTH, TRAIL_SPEED_MIN,
  NEBULA_COUNT, NEBULA_BASE_RADIUS, NEBULA_DRIFT, NEBULA_ORB_PULL, NEBULA_ALPHA, NEBULA_COLORS_RGB,
  TILT_GRAVITY_FORCE, TILT_SMOOTHING,
  TAP_SPARKLE_COUNT, TAP_SPARKLE_SPEED, TAP_SPARKLE_LIFETIME,
  HARP_STRING_COUNT, HARP_VIBRATION_DURATION, HARP_PLUCK_SPEED_THRESHOLD, HARP_PLUCK_COOLDOWN,
  SPAWN_DURATION,
  AUTOPLAY_SPAWN_INTERVAL, AUTOPLAY_SPAWN_COUNT, AUTOPLAY_EFFECT_INTERVAL,
  BLACK_HOLE_RANGE, BLACK_HOLE_GRAVITY, BLACK_HOLE_EVENT_HORIZON,
  BLACK_HOLE_ABSORB_TO_EXPLODE, BLACK_HOLE_RING_COUNT, BLACK_HOLE_RING_SPEED, BLACK_HOLE_DISK_DOTS,
  ERUPTION_COUNT, ERUPTION_SPEED_MIN, ERUPTION_SPEED_MAX, ERUPTION_SPREAD, ERUPTION_EMBER_COUNT,
  GPULSE_BEATS, GPULSE_INTERVAL, GPULSE_PULL_MS,
  GPULSE_PULL_BASE, GPULSE_PULL_GROWTH, GPULSE_PUSH_BASE, GPULSE_PUSH_GROWTH,
  LIGHTNING_SEGMENTS,
  PALETTES,
  IMPLODE_PULL_MS, IMPLODE_PULL_FORCE, IMPLODE_BURST_SPEED,
  ORBIT_LOCK_GATHER_MS, ORBIT_LOCK_SPIN_MS, ORBIT_LOCK_RELEASE_MS, ORBIT_LOCK_RING_GAP, ORBIT_LOCK_SPIN_SPEED,
  MESH_SPACING, MESH_INFLUENCE_RANGE, MESH_MAX_DISPLACEMENT, MESH_BASE_ALPHA, MESH_WARP_ALPHA,
  FLOCK_SEPARATION_DIST, FLOCK_ALIGNMENT_DIST, FLOCK_COHESION_DIST,
  FLOCK_SEPARATION_FORCE, FLOCK_ALIGNMENT_FORCE, FLOCK_COHESION_FORCE,
  FLOCK_MAX_SPEED, FLOCK_CURSOR_FLEE_DIST, FLOCK_CURSOR_FLEE_FORCE,
  CURRENT_STRENGTH, CURRENT_SCALE, CURRENT_SPEED,
  EDGE_GLOW_RANGE, EDGE_GLOW_DEPTH, EDGE_GLOW_ALPHA,
  VELOCITY_STRETCH_THRESHOLD, VELOCITY_STRETCH_MAX, VELOCITY_STRETCH_RAMP,
} from './constants.js';
import {
  PENTATONIC, ensureAudio, setAudioMuted, playTone, playSpawn, playMergeSound, playBoom, playBounce,
  playSwoosh, playBurstSound, playGalaxySound, playCollapse, playMitosis, playStreakTone,
  playWarpSound, playSpray, playLightning, playPortalSound, playMeteorSound,
  playSupernovaSound, playIgniteSound, playStrikeSound, playFirePop,
  playStormSound, playTsunamiSound, playColorWaveSound, playShatterAllSound,
  playBlackHoleSound, playBlackHoleAbsorbSound, playCometSound,
} from './audio.js';
import {
  getFormationTargets, generateBolt, randomColor, hexToHsl, hexAlpha, hslToHex,
  easeOutElastic, createOrb,
} from './utils.js';
import {
  Wrapper, Canvas, HUD, Title, Hint, Count, ModeIndicators, ModePill,
  StreakCounter, NextCombo, ButtonGroup, ButtonRow, ActionButton,
  HelpButton, MuteButton, SaveFlash, ModeStrip, ModeToggle,
  HelpOverlay, HelpPanel, HelpTitle, ShortcutList, Shortcut, Key, HelpClose,
} from './StyledComponents.js';

let lastHarpPluckTime = 0;

function App() {
  const canvasRef = useRef(null);
  const orbsRef = useRef([]);
  const dragRef = useRef(null);
  const dragHistoryRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, onCanvas: false });
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
  const bloomRef = useRef(null); // offscreen canvas for bloom post-process
  const supernovaRef = useRef(null); // active supernova {cx, cy, born, phase}
  const implodeRef = useRef(null); // active implode {cx, cy, born, phase}
  const shatterAllRef = useRef(null); // active shatter-all {born, phase, frozenOrbs}
  const embersRef = useRef([]); // fire ember particles
  const mergeSparksRef = useRef([]); // collision spark particles
  const strikesRef = useRef([]); // active orbital strikes
  const stormRef = useRef(null); // active magnetic storm {born, cx, cy, lastZap}
  const tsunamisRef = useRef([]); // active tsunami waves [{x, dir, born, color, foam}]
  const colorWavesRef = useRef([]); // active color waves [{cx, cy, radius, born, hitOrbs}]
  const tsunamiDirRef = useRef(1); // alternates direction each trigger
  const tapWavesRef = useRef([]); // concentric pulse waves from taps [{x, y, born, color, streak}]
  const shatterRef = useRef([]); // chain-shatter waves [{x, y, radius, generation, hitOrbs, color, delay}]
  const fountainsRef = useRef([]); // persistent orb spawners [{x, y, color, born, lastSpawn}]
  const cometsRef = useRef([]); // active comets [{x, y, vx, vy, color, born, lastSpawn, spawned, trail}]
  const auroraActivityRef = useRef(0); // smoothed aurora intensity (0-1)
  const auroraFlareRef = useRef(0); // slow-decay energy from explosions (0-1)
  const systemEnergyRef = useRef(0); // smoothed total kinetic energy (0-1)
  const [orbCount, setOrbCount] = useState(0);
  const [gravityOn, setGravityOn] = useState(false);
  const gravityRef = useRef(false);
  const gravityDirRef = useRef("down"); // "down" | "right" | "up" | "left"
  const [frozen, setFrozen] = useState(false);
  const frozenRef = useRef(false);
  const [paintMode, setPaintMode] = useState(false);
  const paintModeRef = useRef(false);
  const [slowMo, setSlowMo] = useState(false);
  const slowMoRef = useRef(false);
  const [showHelp, setShowHelp] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoplayModeRef = useRef(false);
  const [longExposure, setLongExposure] = useState(false);
  const longExposureRef = useRef(false);
  const [repelMode, setRepelMode] = useState(false);
  const repelModeRef = useRef(false);
  const [orbitMode, setOrbitMode] = useState(false);
  const orbitModeRef = useRef(false);
  const [attractMode, setAttractMode] = useState(false);
  const attractModeRef = useRef(false);
  const [gravityPaintMode, setGravityPaintMode] = useState(false);
  const gravityPaintModeRef = useRef(false);
  const [meshMode, setMeshMode] = useState(false);
  const meshModeRef = useRef(false);
  const [flockingMode, setFlockingMode] = useState(false);
  const flockingModeRef = useRef(false);
  // constellation lines are always-on ambient visual (no toggle needed)
  const gravityDotsRef = useRef([]);
  const dominoRef = useRef(null); // {queue, index, nextTime, respawnCount, phase}
  const longPressRef = useRef(null);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const streakRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const [streakDisplay, setStreakDisplay] = useState(0);
  const streakFadeRef = useRef(null);
  const comboFlashRef = useRef([]); // [{text, x, y, born, color}]
  const mouseDownRef = useRef(false);
  const sprayActiveRef = useRef(false);
  const sprayStartRef = useRef({ x: 0, y: 0 });
  const lastSprayPosRef = useRef({ x: 0, y: 0 });
  // showMoreButtons state removed — rarely-used effects culled from UI (still accessible via keyboard)
  const bigBangRef = useRef(null); // {born, detonated, detonateTime}
  const slingshotRef = useRef(null); // {startX, startY} when flick-aiming
  const [sparklerMode, setSparklerMode] = useState(false);
  const sparklerModeRef = useRef(false);
  const warpRef = useRef(null); // {born} active warp drive
  const [magnetMode, setMagnetMode] = useState(false);
  const magnetModeRef = useRef(false);
  const [nbodyMode, setNbodyMode] = useState(false);
  const nbodyModeRef = useRef(false);
  const vortexStormRef = useRef(null); // {cx, cy, born, exploded}
  const nebulaRef = useRef([]); // ambient nebula glow points
  const tapSparklesRef = useRef([]); // tiny sparkle particles from taps
  const tapWebRef = useRef([]); // recent tap positions for constellation web [{x, y, color, born}]
  const harpVibrationsRef = useRef([]); // gravity harp string pluck visuals
  const formationRef = useRef(null); // {targets, born, type}
  const formationIndexRef = useRef(0);
  const tornadoRef = useRef(null); // {x, y, born, dir, debris[]}
  const holdChargeRef = useRef(null); // {x, y, born} when hold-to-attract is active
  const holdChargeTimerRef = useRef(null);
  const [pulseMode, setPulseMode] = useState(false);
  const pulseModeRef = useRef(false);
  const pulseTimerRef = useRef(0); // last pulse timestamp
  const [tiltMode, setTiltMode] = useState(false);
  const tiltModeRef = useRef(false);
  const tiltVecRef = useRef({ x: 0, y: 1 }); // normalized gravity direction
  const hasTiltSensorRef = useRef(false);
  const blackHoleRef = useRef(null); // {x, y, born, absorbed, mass, diskDots}
  const autoplayTimersRef = useRef({ lastSpawn: 0, lastEffect: 0 });
  const [colorCycle, setColorCycle] = useState(false);
  const colorCycleRef = useRef(false);
  const [kaleidoscopeMode, setKaleidoscopeMode] = useState(false);
  const kaleidoscopeModeRef = useRef(false);
  const [wrapMode, setWrapMode] = useState(false);
  const wrapModeRef = useRef(false);
  const barriersRef = useRef([]); // user-drawn bounce walls [{x1, y1, x2, y2, color}]
  const [barrierMode, setBarrierMode] = useState(false);
  const barrierModeRef = useRef(false);
  const barrierDrawRef = useRef(null); // {x1, y1, x2, y2} while actively drawing
  const orbitLockRef = useRef(null); // {born, phase, cx, cy, maxRing, spinBorn, releaseBorn}
  const cursorAuraRef = useRef({ alpha: 0, nearCount: 0 }); // cursor glow state

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
      slingshotRef.current = null;
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
      } else if (barrierModeRef.current) {
        barrierDrawRef.current = { x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y };
      } else {
        sprayActiveRef.current = false;
        sprayStartRef.current = { x: pos.x, y: pos.y };
        lastSprayPosRef.current = { x: pos.x, y: pos.y };
        // Start hold-to-attract timer
        if (holdChargeTimerRef.current) clearTimeout(holdChargeTimerRef.current);
        holdChargeTimerRef.current = setTimeout(() => {
          holdChargeRef.current = { x: pos.x, y: pos.y, born: performance.now() };
          holdChargeTimerRef.current = null;
        }, HOLD_CHARGE_DELAY);
      }
      mouseRef.current = { ...pos, onCanvas: true };
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
      } else if (barrierDrawRef.current) {
        barrierDrawRef.current.x2 = pos.x;
        barrierDrawRef.current.y2 = pos.y;
      } else if (mouseDownRef.current) {
        if (sparklerModeRef.current) {
          // Sparkler mode: continuously spawn tiny sparks at cursor
          const sdx = pos.x - lastSprayPosRef.current.x;
          const sdy = pos.y - lastSprayPosRef.current.y;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (sDist > SPARK_SPAWN_DIST && orbsRef.current.length < 500) {
            const sparkCount = Math.min(Math.ceil(sDist / SPARK_SPAWN_DIST), 5);
            const sNow = performance.now();
            for (let si = 0; si < sparkCount; si++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 2 + Math.random() * 5;
              const orb = createOrb(
                pos.x + (Math.random() - 0.5) * 6,
                pos.y + (Math.random() - 0.5) * 6
              );
              orb.radius = 2 + Math.random() * 2.5;
              orb.sparkBaseRadius = orb.radius;
              orb.vx = Math.cos(angle) * speed;
              orb.vy = Math.sin(angle) * speed;
              orb.spark = true;
              orb.sparkBorn = sNow;
              orbsRef.current.push(orb);
            }
            lastSprayPosRef.current = { x: pos.x, y: pos.y };
            setOrbCount(orbsRef.current.length);
          }
        } else {
        const startDx = pos.x - sprayStartRef.current.x;
        const startDy = pos.y - sprayStartRef.current.y;
        const startDist = Math.sqrt(startDx * startDx + startDy * startDy);
        if (startDist > 20) {
          // Cancel hold-to-attract timer if user starts dragging
          if (holdChargeTimerRef.current) {
            clearTimeout(holdChargeTimerRef.current);
            holdChargeTimerRef.current = null;
          }
          if (!paintModeRef.current && !gravityPaintModeRef.current && !holdChargeRef.current) {
            // Flick aiming mode — show trajectory line, launch on release
            slingshotRef.current = { startX: sprayStartRef.current.x, startY: sprayStartRef.current.y };
          } else {
          // spray mode: drag on empty space to paint orb trails
          const dx = pos.x - lastSprayPosRef.current.x;
          const dy = pos.y - lastSprayPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interval = orbsRef.current.length > 200 ? 30 : 18;
          const gpaintInterval = GPAINT_DOT_INTERVAL;
          if (gravityPaintModeRef.current && dist >= gpaintInterval) {
            // gravity paint mode: place gravity dots instead of orbs
            sprayActiveRef.current = true;
            if (gravityDotsRef.current.length < GPAINT_DOT_MAX) {
              gravityDotsRef.current.push({
                x: pos.x, y: pos.y,
                color: randomColor(),
                born: performance.now(),
              });
            }
            lastSprayPosRef.current = { x: pos.x, y: pos.y };
          } else if (!gravityPaintModeRef.current && dist >= interval) {
            sprayActiveRef.current = true;
            const nx = dist > 0 ? -dy / dist : 0;
            const ny = dist > 0 ? dx / dist : 0;
            const svx = nx * (Math.random() - 0.5) * 0.8;
            const svy = ny * (Math.random() - 0.5) * 0.8;

            {
              const orb = createOrb(pos.x, pos.y);
              orb.radius = 4 + Math.random() * 3;
              orb.vx = svx;
              orb.vy = svy;
              orbsRef.current.push(orb);
            }
            lastSprayPosRef.current = { x: pos.x, y: pos.y };
            setOrbCount(orbsRef.current.length);
            playSpray(pos.y, window.innerHeight);
          }
          }
        }
        }
      }
      mouseRef.current = { ...pos, onCanvas: true };
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
      // Cancel hold-to-attract timer
      if (holdChargeTimerRef.current) {
        clearTimeout(holdChargeTimerRef.current);
        holdChargeTimerRef.current = null;
      }
      // ── Barrier drawing finalization ──
      if (barrierDrawRef.current) {
        const bd = barrierDrawRef.current;
        barrierDrawRef.current = null;
        const bdx = bd.x2 - bd.x1;
        const bdy = bd.y2 - bd.y1;
        const bLen = Math.sqrt(bdx * bdx + bdy * bdy);
        if (bLen > 30) {
          // Save barrier
          barriersRef.current.push({ x1: bd.x1, y1: bd.y1, x2: bd.x2, y2: bd.y2, color: randomColor() });
          playBounce(0.4);
        } else {
          // Short tap in barrier mode — remove nearest barrier if close enough
          const tapX = bd.x1, tapY = bd.y1;
          let bestIdx = -1, bestDist = 25;
          for (let bi = 0; bi < barriersRef.current.length; bi++) {
            const bar = barriersRef.current[bi];
            const bex = bar.x2 - bar.x1, bey = bar.y2 - bar.y1;
            const bLen2 = bex * bex + bey * bey;
            if (bLen2 < 1) continue;
            let bt = ((tapX - bar.x1) * bex + (tapY - bar.y1) * bey) / bLen2;
            bt = Math.max(0, Math.min(1, bt));
            const cx = bar.x1 + bt * bex, cy = bar.y1 + bt * bey;
            const d = Math.sqrt((tapX - cx) * (tapX - cx) + (tapY - cy) * (tapY - cy));
            if (d < bestDist) { bestDist = d; bestIdx = bi; }
          }
          if (bestIdx >= 0) {
            barriersRef.current.splice(bestIdx, 1);
          }
        }
        return;
      }
      // Hold-to-attract release — burst orbs outward
      if (holdChargeRef.current) {
        const charge = holdChargeRef.current;
        holdChargeRef.current = null;
        const chargeDuration = performance.now() - charge.born;
        const power = Math.min(chargeDuration / HOLD_CHARGE_MAX_MS, 1);
        const releaseForce = 3 + power * 12;
        const range = HOLD_CHARGE_RANGE * (0.8 + power * 0.5);
        for (const orb of orbsRef.current) {
          const dx = orb.x - charge.x;
          const dy = orb.y - charge.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < range) {
            const falloff = 1 - dist / range;
            const force = releaseForce * falloff;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
          }
        }
        wavesRef.current.push({
          cx: charge.x,
          cy: charge.y,
          radius: 0,
          color: "#4facfe",
          generation: 0,
          hitOrbs: new Set(),
          delay: 0,
        });
        shakeRef.current = Math.max(shakeRef.current, 3 + power * 10);
        playBoom();
        return;
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
      // ── Flick launch ──
      if (slingshotRef.current) {
        const sling = slingshotRef.current;
        slingshotRef.current = null;
        const releasePos = e.changedTouches
          ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
          : getPos(e);
        const fdx = releasePos.x - sling.startX;
        const fdy = releasePos.y - sling.startY;
        const fDist = Math.sqrt(fdx * fdx + fdy * fdy);
        if (fDist > 30) {
          const maxSpeed = 18;
          const speed = Math.min(fDist * 0.12, maxSpeed);
          const fAngle = Math.atan2(fdy, fdx);
          const orb = createOrb(sling.startX, sling.startY);
          orb.radius = 10 + Math.min(fDist * 0.03, 8);
          orb.vx = Math.cos(fAngle) * speed;
          orb.vy = Math.sin(fAngle) * speed;
          orbsRef.current.push(orb);
          const now = performance.now();
          ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          // Spawn burst particles in launch direction
          for (let i = 0; i < 5; i++) {
            const spread = fAngle + (Math.random() - 0.5) * 0.8;
            burstsRef.current.push({
              x: sling.startX,
              y: sling.startY,
              vx: Math.cos(spread) * (2 + Math.random() * 3),
              vy: Math.sin(spread) * (2 + Math.random() * 3),
              color: orb.color,
              born: now,
            });
          }
          setOrbCount(orbsRef.current.length);
          playSwoosh();
          shakeRef.current = Math.max(shakeRef.current, speed * 0.4);
          return;
        }
        // Drag was too short — fall through to normal tap
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
        const ox = pos.x + Math.cos(angle) * spread;
        const oy = pos.y + Math.sin(angle) * spread;
        const ovx = spawnCount > 1 ? Math.cos(angle) * (1 + streak * 0.3) : 0;
        const ovy = spawnCount > 1 ? Math.sin(angle) * (1 + streak * 0.3) : 0;

        {
          const orb = createOrb(ox, oy);
          orb.radius += radiusBonus;
          orb.vx += ovx;
          orb.vy += ovy;
          if (Math.random() < NOVA_CHANCE) {
            orb.isNova = true;
            orb.novaBorn = now;
            orb.novaFuse = NOVA_FUSE_MIN + Math.random() * (NOVA_FUSE_MAX - NOVA_FUSE_MIN);
          }
          orbsRef.current.push(orb);
          ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
        }
      }

      // ── Tap impulse: gently push nearby orbs away from tap ──
      for (const orb of orbsRef.current) {
        const idx = orb.x - pos.x;
        const idy = orb.y - pos.y;
        const idist = Math.sqrt(idx * idx + idy * idy);
        if (idist > 0 && idist < TAP_IMPULSE_RADIUS) {
          const falloff = 1 - idist / TAP_IMPULSE_RADIUS;
          const force = TAP_IMPULSE_FORCE * falloff * falloff;
          orb.vx += (idx / idist) * force;
          orb.vy += (idy / idist) * force;
        }
      }

      // ── Tap sparkle particles ──
      const sparkleCount = TAP_SPARKLE_COUNT + Math.min(streak * 2, 12);
      for (let si = 0; si < sparkleCount; si++) {
        const angle = (Math.PI * 2 * si) / sparkleCount + Math.random() * 0.4;
        const speed = TAP_SPARKLE_SPEED * (0.6 + Math.random() * 0.8);
        tapSparklesRef.current.push({
          x: pos.x, y: pos.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: rippleColor,
          born: now,
        });
      }
      // cap sparkle count
      if (tapSparklesRef.current.length > 200) {
        tapSparklesRef.current = tapSparklesRef.current.slice(-150);
      }

      // ── Tap constellation web ──
      tapWebRef.current.push({ x: pos.x, y: pos.y, color: rippleColor, born: now });
      if (tapWebRef.current.length > 30) tapWebRef.current.shift();

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

      // ── Streak combo rewards — auto-trigger effects at milestones ──
      if (streak === STREAK_FIREWORK) {
        // Radial firework burst centered on tap position
        const fwCount = 10;
        for (let i = 0; i < fwCount; i++) {
          const angle = (Math.PI * 2 * i) / fwCount + Math.random() * 0.3;
          const orb = createOrb(pos.x, pos.y);
          orb.radius = 5 + Math.random() * 6;
          orb.vx = Math.cos(angle) * (4 + Math.random() * 3);
          orb.vy = Math.sin(angle) * (4 + Math.random() * 3);
          orbsRef.current.push(orb);
          ripplesRef.current.push({ x: pos.x, y: pos.y, color: orb.color, born: now });
        }
        comboFlashRef.current.push({ text: "FIREWORK!", x: pos.x, y: pos.y - 40, born: now, color: "#fa709a" });
        shakeRef.current = Math.max(shakeRef.current, 14);
        playBurstSound();
      }

      if (streak === STREAK_LIGHTNING && orbsRef.current.length > 0) {
        // Chain lightning emanating from tap point
        mouseRef.current = pos;
        const visited = new Set();
        const bolts = [];
        const lSparks = [];
        let lcx = pos.x, lcy = pos.y;
        for (let chain = 0; chain < LIGHTNING_MAX_CHAIN; chain++) {
          let nearest = null;
          let nearestDist = LIGHTNING_CHAIN_DIST;
          for (const orb of orbsRef.current) {
            if (visited.has(orb.id)) continue;
            const dx = orb.x - lcx;
            const dy = orb.y - lcy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < nearestDist) { nearestDist = dist; nearest = orb; }
          }
          if (!nearest) break;
          visited.add(nearest.id);
          bolts.push({ points: generateBolt(lcx, lcy, nearest.x, nearest.y), color: nearest.color });
          for (let s = 0; s < 4; s++) {
            const a = Math.random() * Math.PI * 2;
            lSparks.push({ x: nearest.x, y: nearest.y, vx: Math.cos(a) * (1 + Math.random() * 2), vy: Math.sin(a) * (1 + Math.random() * 2), color: nearest.color });
          }
          const dx = nearest.x - lcx;
          const dy = nearest.y - lcy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          nearest.vx += (dx / dist) * LIGHTNING_FORCE * (0.5 + Math.random());
          nearest.vy += (dy / dist) * LIGHTNING_FORCE * (0.5 + Math.random());
          lcx = nearest.x; lcy = nearest.y;
        }
        if (bolts.length > 0) {
          lightningRef.current.push({ bolts, sparks: lSparks, born: now });
          shakeRef.current = Math.max(shakeRef.current, 6 + bolts.length);
          playLightning();
        }
        comboFlashRef.current.push({ text: "LIGHTNING!", x: pos.x, y: pos.y - 40, born: now, color: "#4facfe" });
      }

      if (streak === STREAK_METEOR) {
        // Inline meteor shower to avoid forward-ref issues
        const W = window.innerWidth;
        for (let i = 0; i < METEOR_COUNT; i++) {
          setTimeout(() => {
            const mx = W * 0.05 + Math.random() * W * 0.9;
            const mAngle = Math.PI * 0.4 + Math.random() * Math.PI * 0.2;
            const mSpeed = 4 + Math.random() * 4;
            const mOrb = createOrb(mx, -20);
            mOrb.radius = 6 + Math.random() * 8;
            mOrb.vx = Math.cos(mAngle) * mSpeed * (Math.random() > 0.5 ? 1 : -1);
            mOrb.vy = Math.sin(mAngle) * mSpeed;
            orbsRef.current.push(mOrb);
            ripplesRef.current.push({ x: mx, y: 0, color: mOrb.color, born: performance.now() });
            meteorTrailsRef.current.push({
              x: mx + (Math.random() - 0.5) * 40, y: -60 - Math.random() * 40,
              dx: mOrb.vx * 25, dy: mOrb.vy * 25,
              color: mOrb.color, born: performance.now(),
            });
            setOrbCount(orbsRef.current.length);
          }, i * METEOR_STAGGER);
        }
        shakeRef.current = Math.max(shakeRef.current, 12);
        playMeteorSound();
        comboFlashRef.current.push({ text: "METEOR SHOWER!", x: pos.x, y: pos.y - 40, born: now, color: "#43e97b" });
      }

      if (streak === STREAK_SUPERNOVA && !supernovaRef.current) {
        supernovaRef.current = { cx: pos.x, cy: pos.y, born: now, phase: "implode" };
        playSupernovaSound();
        comboFlashRef.current.push({ text: "SUPERNOVA!", x: pos.x, y: pos.y - 40, born: now, color: "#f093fb" });
      }

      if (streak === STREAK_CASCADE) {
        // Cosmic Cascade: every orb splits into 3 with radial velocity
        const currentOrbs = [...orbsRef.current];
        const newOrbs = [];
        for (const o of currentOrbs) {
          const baseAngle = Math.random() * Math.PI * 2;
          for (let i = 0; i < 2; i++) {
            const angle = baseAngle + (Math.PI * 2 * (i + 1)) / 3;
            const spd = 3 + Math.random() * 4;
            const child = createOrb(o.x, o.y);
            child.radius = Math.max(4, o.radius * 0.6);
            child.color = o.color;
            child.vx = o.vx * 0.5 + Math.cos(angle) * spd;
            child.vy = o.vy * 0.5 + Math.sin(angle) * spd;
            newOrbs.push(child);
            ripplesRef.current.push({ x: o.x, y: o.y, color: o.color, born: now });
          }
          // Original orb also gets a kick
          const kickAngle = baseAngle;
          o.vx += Math.cos(kickAngle) * 4;
          o.vy += Math.sin(kickAngle) * 4;
          o.radius = Math.max(4, o.radius * 0.6);
        }
        orbsRef.current.push(...newOrbs);
        // Massive shockwave from tap point
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#f093fb", generation: 0, hitOrbs: new Set(), delay: 0 });
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 4 });
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#43e97b", generation: 0, hitOrbs: new Set(), delay: 8 });
        shakeRef.current = Math.max(shakeRef.current, 30);
        playSupernovaSound();
        playBoom();
        comboFlashRef.current.push({ text: "COSMIC CASCADE!", x: pos.x, y: pos.y - 40, born: now, color: "#fbbf24" });
        setOrbCount(orbsRef.current.length);
      }

      if (streak === STREAK_STARFALL && orbsRef.current.length > 0) {
        // Starfall: all orbs rain down like meteors
        const W = window.innerWidth;
        for (const o of orbsRef.current) {
          if (o === dragRef.current) continue;
          // Massive downward velocity with slight horizontal scatter
          o.vy = 14 + Math.random() * 6;
          o.vx = (Math.random() - 0.5) * 4;
          // Meteor entry trail for each orb
          meteorTrailsRef.current.push({
            x: o.x + (Math.random() - 0.5) * 20, y: o.y - 30 - Math.random() * 40,
            dx: o.vx * 20, dy: o.vy * 20,
            color: o.color, born: now,
          });
        }
        // Triple shockwave from tap point
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#fbbf24", generation: 0, hitOrbs: new Set(), delay: 0 });
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#fa709a", generation: 0, hitOrbs: new Set(), delay: 3 });
        shakeRef.current = Math.max(shakeRef.current, 25);
        playMeteorSound();
        playBoom();
        comboFlashRef.current.push({ text: "STARFALL!", x: pos.x, y: pos.y - 40, born: now, color: "#fbbf24" });
      }

      if (streak === STREAK_SUPERMASSIVE) {
        // SUPERMASSIVE: simultaneous firework bursts across the screen
        const W = window.innerWidth;
        const H = window.innerHeight;
        const burstPoints = [
          { x: W * 0.2, y: H * 0.3 },
          { x: W * 0.8, y: H * 0.25 },
          { x: pos.x, y: pos.y },
          { x: W * 0.3, y: H * 0.7 },
          { x: W * 0.7, y: H * 0.65 },
        ];
        for (const bp of burstPoints) {
          const fwCount = 8;
          for (let i = 0; i < fwCount; i++) {
            const angle = (Math.PI * 2 * i) / fwCount + Math.random() * 0.4;
            const orb = createOrb(bp.x, bp.y);
            orb.radius = 4 + Math.random() * 5;
            orb.vx = Math.cos(angle) * (5 + Math.random() * 4);
            orb.vy = Math.sin(angle) * (5 + Math.random() * 4);
            orbsRef.current.push(orb);
          }
          ripplesRef.current.push({ x: bp.x, y: bp.y, color: randomColor(), born: now });
          meteorTrailsRef.current.push({
            x: bp.x, y: bp.y - 40,
            dx: (Math.random() - 0.5) * 30, dy: -60 - Math.random() * 40,
            color: randomColor(), born: now,
          });
        }
        // Scatter all existing orbs outward from tap point
        for (const o of orbsRef.current) {
          const dx = o.x - pos.x;
          const dy = o.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          o.vx += (dx / dist) * 12;
          o.vy += (dy / dist) * 12;
        }
        // Triple shockwave
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#fff", generation: 0, hitOrbs: new Set(), delay: 0 });
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#f093fb", generation: 0, hitOrbs: new Set(), delay: 4 });
        wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 8 });
        shakeRef.current = 50;
        playBoom();
        playSupernovaSound();
        playBurstSound();
        comboFlashRef.current.push({ text: "SUPERMASSIVE!", x: pos.x, y: pos.y - 40, born: now, color: "#fff" });
      }

      // ── Tap pulse wave — concentric ripples from every tap ──
      tapWavesRef.current.push({ x: pos.x, y: pos.y, born: now, color: rippleColor, streak });

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
        const born = performance.now();
        // Dramatic shatter: more particles, scaled to orb size
        const particleCount = Math.max(SHATTER_PARTICLE_COUNT, Math.round(hit.radius * 1.2));
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
          const speed = 2.5 + Math.random() * 3.5;
          burstsRef.current.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: hit.color,
            radius: 1.5 + Math.random() * (hit.radius * 0.3),
            born,
          });
        }
        // Bright flash
        flashesRef.current.push({
          x: hit.x, y: hit.y, color: hit.color,
          radius: hit.radius * 1.8, born,
        });
        // Screen shake proportional to orb size
        shakeRef.current = Math.max(shakeRef.current, 6 + hit.radius * 0.5);
        // Shatter chain wave
        shatterRef.current.push({
          x: hit.x, y: hit.y, radius: 0,
          generation: 0, hitOrbs: new Set(),
          color: hit.color, delay: 0,
        });
        orbsRef.current = orbsRef.current.filter((o) => o.id !== hit.id);
        setOrbCount(orbsRef.current.length);
        playBoom();
      } else {
        // Double-tap on empty space: spawn orbiting ring with temporary gravity well
        const now = performance.now();
        const count = 5;
        const orbitRadius = 45;
        const spinDir = Math.random() < 0.5 ? 1 : -1;
        const wellColor = randomColor();
        wellsRef.current.push({
          id: Date.now() + Math.random(),
          x: pos.x, y: pos.y,
          radius: 10,
          color: wellColor,
          born: now,
          spinDir,
          expiry: now + 4000,
        });
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const ox = pos.x + Math.cos(angle) * orbitRadius;
          const oy = pos.y + Math.sin(angle) * orbitRadius;
          const orb = createOrb(ox, oy);
          const speed = 2.5 + Math.random() * 0.5;
          orb.vx = Math.cos(angle + Math.PI / 2 * spinDir) * speed;
          orb.vy = Math.sin(angle + Math.PI / 2 * spinDir) * speed;
          orbsRef.current.push(orb);
          ripplesRef.current.push({ x: ox, y: oy, color: orb.color, born: now });
        }
        setOrbCount(orbsRef.current.length);
        shakeRef.current = Math.max(shakeRef.current, 6);
        playGalaxySound();
      }
    },
    [getPos, findOrb]
  );

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // ── Prevent default touch behavior (React 18 registers touch as passive) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (e) => e.preventDefault();
    canvas.addEventListener("touchstart", prevent, { passive: false });
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", prevent);
      canvas.removeEventListener("touchmove", prevent);
    };
  }, []);

  // ── Tilt/gyroscope gravity ─────────────────────────────────────
  useEffect(() => {
    const handleOrientation = (e) => {
      if (!tiltModeRef.current) return;
      const beta = e.beta || 0;
      const gamma = e.gamma || 0;
      const tx = Math.max(-1, Math.min(1, gamma / 45));
      const ty = Math.max(-1, Math.min(1, beta / 45));
      hasTiltSensorRef.current = true;
      tiltVecRef.current.x += (tx - tiltVecRef.current.x) * TILT_SMOOTHING;
      tiltVecRef.current.y += (ty - tiltVecRef.current.y) * TILT_SMOOTHING;
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let time = 0;
    let prevCursorX = 0, prevCursorY = 0;
    let cursorSpeed = 0;
    function draw() {
      animRef.current = requestAnimationFrame(draw);
      try {
      time += 0.02;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      const now = performance.now();

      // ── Cursor velocity (for wake effect) ──
      const cmx = mouseRef.current.x;
      const cmy = mouseRef.current.y;
      const cdx = cmx - prevCursorX;
      const cdy = cmy - prevCursorY;
      cursorSpeed = Math.sqrt(cdx * cdx + cdy * cdy);
      prevCursorX = cmx;
      prevCursorY = cmy;

      // ── Age and expire sparks ──
      orbsRef.current = orbsRef.current.filter(o => {
        if (!o.spark) return true;
        const age = now - o.sparkBorn;
        if (age >= SPARK_LIFETIME) return false;
        o.radius = o.sparkBaseRadius * (1 - age / SPARK_LIFETIME);
        return o.radius > 0.3;
      });

      const orbs = orbsRef.current;

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
        const fadeAlpha = longExposureRef.current ? 0.035 : 0.25;
        ctx.fillStyle = `rgba(15, 15, 26, ${fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
        // Cinematic vignette: subtle edge darkening for depth
        const edgeAlpha = fadeAlpha * 0.15;
        const vigGrad = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.7);
        vigGrad.addColorStop(0, 'transparent');
        vigGrad.addColorStop(1, `rgba(0, 0, 8, ${edgeAlpha})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, W, H);
        // Impact glow: brief color pulse during screen shake
        if (shake > 1) {
          const pulseAlpha = Math.min(shake * 0.006, 0.05);
          ctx.fillStyle = `rgba(102, 126, 234, ${pulseAlpha})`;
          ctx.fillRect(0, 0, W, H);
        }
      }

      // ── Reactive edge glow: screen borders light up from nearby orbs ──
      if (orbs.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let ei = 0; ei < orbs.length; ei++) {
          const orb = orbs[ei];
          if (orb.spark) continue; // skip tiny spark particles
          const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          const speedMul = 0.5 + Math.min(speed / 4, 1) * 0.5;
          const spread = orb.radius * 3 + 40;
          // Left edge
          if (orb.x < EDGE_GLOW_RANGE) {
            const prox = 1 - orb.x / EDGE_GLOW_RANGE;
            const a = prox * prox * EDGE_GLOW_ALPHA * speedMul;
            const d = EDGE_GLOW_DEPTH * (0.6 + prox * 0.4);
            const eg = ctx.createLinearGradient(0, 0, d, 0);
            eg.addColorStop(0, orb.color + hexAlpha(a * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(0, orb.y - spread, d, spread * 2);
          }
          // Right edge
          if (orb.x > W - EDGE_GLOW_RANGE) {
            const prox = 1 - (W - orb.x) / EDGE_GLOW_RANGE;
            const a = prox * prox * EDGE_GLOW_ALPHA * speedMul;
            const d = EDGE_GLOW_DEPTH * (0.6 + prox * 0.4);
            const eg = ctx.createLinearGradient(W, 0, W - d, 0);
            eg.addColorStop(0, orb.color + hexAlpha(a * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(W - d, orb.y - spread, d, spread * 2);
          }
          // Top edge
          if (orb.y < EDGE_GLOW_RANGE) {
            const prox = 1 - orb.y / EDGE_GLOW_RANGE;
            const a = prox * prox * EDGE_GLOW_ALPHA * speedMul;
            const d = EDGE_GLOW_DEPTH * (0.6 + prox * 0.4);
            const eg = ctx.createLinearGradient(0, 0, 0, d);
            eg.addColorStop(0, orb.color + hexAlpha(a * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(orb.x - spread, 0, spread * 2, d);
          }
          // Bottom edge
          if (orb.y > H - EDGE_GLOW_RANGE) {
            const prox = 1 - (H - orb.y) / EDGE_GLOW_RANGE;
            const a = prox * prox * EDGE_GLOW_ALPHA * speedMul;
            const d = EDGE_GLOW_DEPTH * (0.6 + prox * 0.4);
            const eg = ctx.createLinearGradient(0, H, 0, H - d);
            eg.addColorStop(0, orb.color + hexAlpha(a * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(orb.x - spread, H - d, spread * 2, d);
          }
        }
        ctx.restore();
      }

      // ── Ambient nebula update + render ──
      const nebulae = nebulaRef.current;
      for (const neb of nebulae) {
        neb.x += neb.vx;
        neb.y += neb.vy;
        const pad = neb.radius;
        if (neb.x < -pad) neb.x = W + pad;
        if (neb.x > W + pad) neb.x = -pad;
        if (neb.y < -pad) neb.y = H + pad;
        if (neb.y > H + pad) neb.y = -pad;
        // attract toward nearby orb clusters
        if (orbs.length > 0) {
          let cx = 0, cy = 0, count = 0;
          for (let oi = 0; oi < orbs.length; oi += 3) { // sample every 3rd for perf
            const orb = orbs[oi];
            const dx = orb.x - neb.x;
            const dy = orb.y - neb.y;
            if (dx * dx + dy * dy < 350 * 350) { cx += orb.x; cy += orb.y; count++; }
          }
          if (count > 0) {
            neb.vx += (cx / count - neb.x) * NEBULA_ORB_PULL;
            neb.vy += (cy / count - neb.y) * NEBULA_ORB_PULL;
          }
        }
        neb.vx *= 0.99;
        neb.vy *= 0.99;
        neb.phase += 0.008;
        const pulseR = neb.radius + Math.sin(neb.phase) * 40;
        const [nr, ng, nb] = neb.rgb;
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, pulseR);
        grad.addColorStop(0, `rgba(${nr}, ${ng}, ${nb}, ${NEBULA_ALPHA})`);
        grad.addColorStop(0.5, `rgba(${nr}, ${ng}, ${nb}, ${NEBULA_ALPHA * 0.35})`);
        grad.addColorStop(1, `rgba(${nr}, ${ng}, ${nb}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(neb.x - pulseR, neb.y - pulseR, pulseR * 2, pulseR * 2);
      }

      // draw twinkling star field (with warp streaking)
      const warpActive = warpRef.current;
      const warpElapsed = warpActive ? now - warpActive.born : 0;
      const warpTotal = WARP_CHARGE_MS + WARP_JUMP_MS + WARP_SETTLE_MS;
      const warpCx = W / 2, warpCy = H / 2;

      for (const star of starsRef.current) {
        const sx = star.x * W, sy = star.y * H;
        const twinkle = 0.25 + 0.75 * ((1 + Math.sin(time * star.speed + star.phase)) * 0.5);

        if (warpActive && warpElapsed < WARP_CHARGE_MS + WARP_JUMP_MS) {
          // Stars streak outward from center during charge + jump
          const chargeT = Math.min(warpElapsed / WARP_CHARGE_MS, 1);
          const jumpT = warpElapsed > WARP_CHARGE_MS
            ? (warpElapsed - WARP_CHARGE_MS) / WARP_JUMP_MS : 0;
          const dx = sx - warpCx, dy = sy - warpCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) continue;
          const nx = dx / dist, ny = dy / dist;
          const streakLen = (chargeT * 25 + jumpT * 90) * (dist / (W * 0.4));
          const alpha = (0.3 + chargeT * 0.5) * twinkle;
          const grad = ctx.createLinearGradient(sx, sy, sx - nx * streakLen, sy - ny * streakLen);
          grad.addColorStop(0, `rgba(200, 220, 255, ${alpha})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - nx * streakLen, sy - ny * streakLen);
          ctx.strokeStyle = grad;
          ctx.lineWidth = star.size * (1 + jumpT);
          ctx.lineCap = "round";
          ctx.stroke();
        } else if (warpActive && warpElapsed < warpTotal) {
          // Settle phase: streaks shrink back to dots
          const settleT = (warpElapsed - WARP_CHARGE_MS - WARP_JUMP_MS) / WARP_SETTLE_MS;
          const dx = sx - warpCx, dy = sy - warpCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) continue;
          const nx = dx / dist, ny = dy / dist;
          const streakLen = (1 - settleT) * 40 * (dist / (W * 0.4));
          const alpha = twinkle * 0.5;
          if (streakLen > 2) {
            const grad = ctx.createLinearGradient(sx, sy, sx - nx * streakLen, sy - ny * streakLen);
            grad.addColorStop(0, `rgba(200, 220, 255, ${alpha})`);
            grad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - nx * streakLen, sy - ny * streakLen);
            ctx.strokeStyle = grad;
            ctx.lineWidth = star.size;
            ctx.lineCap = "round";
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
            ctx.fill();
          }
        } else {
          // Normal star rendering
          const alpha = twinkle * 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
          ctx.fill();
        }
      }

      // ── Warp drive: clear when done ──
      if (warpActive && warpElapsed >= warpTotal) {
        warpRef.current = null;
      }

      // ── Warp drive physics: pull orbs during charge, scatter at jump ──
      if (warpActive && warpElapsed < WARP_CHARGE_MS + WARP_JUMP_MS) {
        const orbs = orbsRef.current;
        if (warpElapsed < WARP_CHARGE_MS) {
          // Charge: pull all orbs toward center
          const t = warpElapsed / WARP_CHARGE_MS; // 0→1
          const strength = WARP_PULL * (0.5 + t * 2);
          for (const orb of orbs) {
            const dx = warpCx - orb.x;
            const dy = warpCy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
              orb.vx += (dx / dist) * strength;
              orb.vy += (dy / dist) * strength;
            }
          }
          // Screen shake ramps up
          shakeRef.current = Math.max(shakeRef.current, 3 + t * 10);
        } else if (!warpActive.scattered) {
          // Jump moment: scatter all orbs outward + bright flash
          warpActive.scattered = true;
          for (const orb of orbs) {
            const dx = orb.x - warpCx;
            const dy = orb.y - warpCy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dist > 1 ? dx / dist : (Math.random() - 0.5);
            const ny = dist > 1 ? dy / dist : (Math.random() - 0.5);
            orb.vx = nx * WARP_SCATTER_SPEED * (0.6 + Math.random() * 0.8);
            orb.vy = ny * WARP_SCATTER_SPEED * (0.6 + Math.random() * 0.8);
            // Randomize colors on exit
            orb.color = randomColor();
          }
          shakeRef.current = Math.max(shakeRef.current, 18);
          // Add burst effects at center
          burstsRef.current.push({ x: warpCx, y: warpCy, born: now, color: "#fff" });
          ripplesRef.current.push({ x: warpCx, y: warpCy, color: "#4facfe", born: now });
          // Shockwave from center
          wavesRef.current.push({
            cx: warpCx, cy: warpCy, radius: 0, color: "#00f2fe",
            generation: 0, hitOrbs: new Set(), delay: 0,
          });
        }
      }

      // Warp flash overlay during jump
      if (warpActive && warpElapsed >= WARP_CHARGE_MS && warpElapsed < WARP_CHARGE_MS + WARP_JUMP_MS) {
        const jumpT = (warpElapsed - WARP_CHARGE_MS) / WARP_JUMP_MS;
        const flashAlpha = jumpT < 0.3 ? jumpT / 0.3 * 0.4 : 0.4 * (1 - (jumpT - 0.3) / 0.7);
        ctx.fillStyle = `rgba(200, 220, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Aurora borealis ──
      {
        // Compute activity level from orb velocities (smoothed)
        let rawActivity = 0;
        for (let i = 0; i < orbs.length; i++) {
          const o = orbs[i];
          if (o.spark) continue;
          rawActivity += Math.sqrt(o.vx * o.vx + o.vy * o.vy);
        }
        const orbFactor = Math.min(orbs.length / 20, 1); // 0-1 based on orb count
        const speedFactor = orbs.length > 0
          ? Math.min(rawActivity / orbs.length / 3, 1) // avg speed normalized
          : 0;
        const targetActivity = orbFactor * 0.5 + speedFactor * 0.5;
        auroraActivityRef.current += (targetActivity - auroraActivityRef.current) * AURORA_SMOOTHING;
        const activity = auroraActivityRef.current;

        // Aurora flare: explosions and big effects light up the sky
        auroraFlareRef.current = Math.max(
          auroraFlareRef.current * 0.97, // slow decay (~2s)
          Math.min(shakeRef.current / 12, 1) // feed from screen shake
        );
        const flare = auroraFlareRef.current;
        const alpha = AURORA_BASE_ALPHA + activity * AURORA_ACTIVITY_BOOST + flare * 0.08;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        for (let band = 0; band < AURORA_BAND_COUNT; band++) {
          const color = AURORA_COLORS[band % AURORA_COLORS.length];
          // Each band has a unique vertical position, wave speed, and frequency
          const bandOffset = band / AURORA_BAND_COUNT;
          const baseY = H * (0.08 + bandOffset * 0.22);
          const amplitude = H * (0.03 + activity * 0.025 + flare * 0.04);
          const freq1 = 0.0018 + band * 0.0005;
          const freq2 = 0.0042 + band * 0.0003;
          const speed1 = 0.18 + band * 0.07;
          const speed2 = 0.09 - band * 0.012;
          const bandAlpha = alpha * (0.6 + 0.4 * Math.sin(time * 0.12 + band * 1.7));

          ctx.beginPath();
          ctx.moveTo(0, H);
          for (let x = 0; x <= W; x += 8) {
            const wave1 = Math.sin(x * freq1 + time * speed1 + band * 2.1) * amplitude;
            const wave2 = Math.sin(x * freq2 - time * speed2 + band * 0.7) * amplitude * 0.6;
            const shimmer = Math.sin(x * 0.01 + time * 0.5 + band) * amplitude * 0.15;
            const y = baseY + wave1 + wave2 + shimmer;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H);
          ctx.closePath();

          const curtainHeight = amplitude * 4;
          const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, baseY + curtainHeight);
          grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${bandAlpha * 0.8})`);
          grad.addColorStop(0.15, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${bandAlpha})`);
          grad.addColorStop(0.4, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${bandAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.restore();
      }

      // ── Space-time fabric: background grid that warps around orbs ──
      {
        const SP = 50; // grid spacing
        const RNG = 120; // influence range
        const RNG2 = RNG * RNG;
        const STR = 15; // pull strength
        const baseA = 0.06 + systemEnergyRef.current * 0.04;
        const cols = Math.ceil(W / SP) + 1;
        const rows = Math.ceil(H / SP) + 1;
        const total = rows * cols;

        // Pre-compute displaced grid positions
        const gx = new Float32Array(total);
        const gy = new Float32Array(total);
        const gd = new Float32Array(total);
        const gc = new Array(total);
        const gcdist = new Float32Array(total);
        gcdist.fill(RNG);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const bx = c * SP;
            const by = r * SP;
            let dx = 0, dy = 0;

            for (let oi = 0; oi < orbs.length; oi++) {
              const orb = orbs[oi];
              if (orb.spark) continue;
              const ox = orb.x - bx;
              const oy = orb.y - by;
              const dSq = ox * ox + oy * oy;
              if (dSq >= RNG2 || dSq < 1) continue;
              const d = Math.sqrt(dSq);
              const pull = 1 - d / RNG;
              const f = pull * pull * STR * (orb.radius / 8);
              dx += (ox / d) * f;
              dy += (oy / d) * f;
              if (d < gcdist[idx]) {
                gcdist[idx] = d;
                gc[idx] = orb.color;
              }
            }

            gx[idx] = bx + dx;
            gy[idx] = by + dy;
            gd[idx] = Math.sqrt(dx * dx + dy * dy);
          }
        }

        // Draw mesh lines between displaced neighbors
        ctx.lineWidth = 0.5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            if (gd[idx] < 2) continue;

            const la = Math.min(gd[idx] * 0.018, 0.14);
            const lc = gc[idx]
              ? gc[idx] + hexAlpha(la * 255)
              : `rgba(140, 150, 200, ${la})`;
            ctx.strokeStyle = lc;

            if (c < cols - 1 && gd[idx + 1] > 2) {
              ctx.beginPath();
              ctx.moveTo(gx[idx], gy[idx]);
              ctx.lineTo(gx[idx + 1], gy[idx + 1]);
              ctx.stroke();
            }
            if (r < rows - 1 && gd[idx + cols] > 2) {
              ctx.beginPath();
              ctx.moveTo(gx[idx], gy[idx]);
              ctx.lineTo(gx[idx + cols], gy[idx + cols]);
              ctx.stroke();
            }
          }
        }

        // Draw grid dots
        for (let i = 0; i < total; i++) {
          const alpha = baseA + Math.min(gd[i] * 0.025, 0.25);
          const sz = 1 + Math.min(gd[i] * 0.12, 1.5);
          if (gc[i] && gcdist[i] < RNG * 0.7) {
            ctx.fillStyle = gc[i] + hexAlpha(alpha * 255);
          } else {
            ctx.fillStyle = `rgba(140, 150, 200, ${alpha})`;
          }
          ctx.fillRect(gx[i] - sz * 0.5, gy[i] - sz * 0.5, sz, sz);
        }
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

      // update and draw ambient motes (reactive to nearby orbs)
      for (const mote of motesRef.current) {
        // orb proximity push — motes get swept aside by passing orbs
        for (let oi = 0; oi < orbs.length; oi++) {
          const orb = orbs[oi];
          const dx = mote.x - orb.x;
          const dy = mote.y - orb.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MOTE_ORB_PUSH_RANGE * MOTE_ORB_PUSH_RANGE && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const orbSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
            const proximity = 1 - dist / MOTE_ORB_PUSH_RANGE; // 1 at center, 0 at edge
            const push = proximity * proximity * MOTE_ORB_PUSH_FORCE * (0.5 + orbSpeed * 0.3);
            mote.vx += (dx / dist) * push;
            mote.vy += (dy / dist) * push;
            mote.disturbance = Math.min(mote.disturbance + proximity * 0.3, 1);
          }
        }
        // cosmic currents push motes too (makes flow visible)
        {
          const ct = now * CURRENT_SPEED;
          mote.vx += Math.sin(mote.y * CURRENT_SCALE + ct) * Math.cos(mote.x * CURRENT_SCALE * 0.7 + ct * 0.6) * CURRENT_STRENGTH * 0.5;
          mote.vy += Math.cos(mote.x * CURRENT_SCALE + ct * 0.8) * Math.sin(mote.y * CURRENT_SCALE * 0.7 + ct * 0.3) * CURRENT_STRENGTH * 0.5;
        }
        // apply velocity + friction
        mote.vx *= MOTE_FRICTION;
        mote.vy *= MOTE_FRICTION;
        mote.x += mote.drift + mote.vx;
        mote.y += -MOTE_SPEED * mote.speed + mote.vy;
        // decay disturbance glow
        mote.disturbance *= 0.92;
        // wrap edges
        if (mote.y < -5) { mote.y = H + 5; mote.x = Math.random() * W; }
        if (mote.x < -5) mote.x = W + 5;
        if (mote.x > W + 5) mote.x = -5;
        // draw with disturbance glow
        const baseFlicker = 0.15 + 0.15 * Math.sin(time * mote.speed * 2 + mote.phase);
        const alpha = baseFlicker + mote.disturbance * MOTE_DISTURBED_GLOW;
        const drawSize = mote.baseSize + mote.disturbance * 1.5;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = mote.color + hexAlpha(Math.min(alpha, 1) * 255);
        ctx.fill();
      }

      // ── Tap constellation web ──
      {
        const TAP_WEB_LIFETIME = 3000;
        const TAP_WEB_CONNECT_DIST = 280;
        const tapWeb = tapWebRef.current;
        // expire old points
        while (tapWeb.length > 0 && now - tapWeb[0].born > TAP_WEB_LIFETIME) tapWeb.shift();
        if (tapWeb.length >= 2) {
          ctx.lineCap = "round";
          // draw connections between nearby tap points
          for (let i = 0; i < tapWeb.length; i++) {
            const a = tapWeb[i];
            const ageA = (now - a.born) / TAP_WEB_LIFETIME;
            if (ageA >= 1) continue;
            let connections = 0;
            for (let j = i + 1; j < tapWeb.length; j++) {
              if (connections >= 3) break;
              const b = tapWeb[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > TAP_WEB_CONNECT_DIST) continue;
              const ageB = (now - b.born) / TAP_WEB_LIFETIME;
              if (ageB >= 1) continue;
              connections++;
              const proximity = 1 - dist / TAP_WEB_CONNECT_DIST;
              const freshness = (1 - ageA) * (1 - ageB);
              const alpha = proximity * freshness * 0.35;
              const width = proximity * freshness * 2.5;
              // gradient line between the two tap colors
              const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              grad.addColorStop(0, a.color + hexAlpha(alpha * 255));
              grad.addColorStop(1, b.color + hexAlpha(alpha * 255));
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = grad;
              ctx.lineWidth = Math.max(0.5, width);
              ctx.stroke();
            }
            // glowing node at each tap point
            const nodeAlpha = (1 - ageA) * 0.4;
            const nodeR = 4 + (1 - ageA) * 3;
            const nodeGrad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, nodeR);
            nodeGrad.addColorStop(0, a.color + hexAlpha(nodeAlpha * 255));
            nodeGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(a.x, a.y, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = nodeGrad;
            ctx.fill();
          }
        }
      }

      // expire old gravity paint dots
      gravityDotsRef.current = gravityDotsRef.current.filter((d) => now - d.born < GPAINT_DOT_LIFETIME);

      // fountain spawning
      if (!frozenRef.current) {
        for (const fountain of fountainsRef.current) {
          if (now - fountain.lastSpawn >= FOUNTAIN_SPAWN_INTERVAL && orbs.length < FOUNTAIN_ORB_CAP) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * FOUNTAIN_SPRAY_ANGLE;
            const spd = FOUNTAIN_SPAWN_SPEED * (0.8 + Math.random() * 0.4);
            const orb = createOrb(fountain.x, fountain.y - FOUNTAIN_BASE_RADIUS);
            orb.radius = 5 + Math.random() * 5;
            orb.vx = Math.cos(angle) * spd;
            orb.vy = Math.sin(angle) * spd;
            orbsRef.current.push(orb);
            fountain.lastSpawn = now;
          }
        }
        if (fountainsRef.current.length > 0) setOrbCount(orbsRef.current.length);
      }

      // ── Autoplay light show ──
      if (autoplayModeRef.current && !frozenRef.current) {
        const ap = autoplayTimersRef.current;
        // Auto-spawn orb clusters
        if (now - ap.lastSpawn >= AUTOPLAY_SPAWN_INTERVAL && orbs.length < FOUNTAIN_ORB_CAP) {
          const sx = W * 0.15 + Math.random() * W * 0.7;
          const sy = H * 0.15 + Math.random() * H * 0.7;
          for (let i = 0; i < AUTOPLAY_SPAWN_COUNT; i++) {
            const orb = createOrb(
              sx + (Math.random() - 0.5) * 40,
              sy + (Math.random() - 0.5) * 40
            );
            const angle = (Math.PI * 2 * i) / AUTOPLAY_SPAWN_COUNT + Math.random() * 0.5;
            orb.vx = Math.cos(angle) * (1.5 + Math.random() * 2);
            orb.vy = Math.sin(angle) * (1.5 + Math.random() * 2);
            orbsRef.current.push(orb);
            ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          }
          setOrbCount(orbsRef.current.length);
          ap.lastSpawn = now;
        }
        // Auto-trigger random popular effects
        if (now - ap.lastEffect >= AUTOPLAY_EFFECT_INTERVAL && orbs.length > 0) {
          const effects = [
            // shockwave from random position
            () => {
              const rx = W * 0.2 + Math.random() * W * 0.6;
              const ry = H * 0.2 + Math.random() * H * 0.6;
              wavesRef.current.push({ cx: rx, cy: ry, radius: 0, color: randomColor(), generation: 0, hitOrbs: new Set(), delay: 0 });
              shakeRef.current = Math.max(shakeRef.current, 12);
              playBoom();
            },
            // burst spawn
            () => {
              const bx = W * 0.2 + Math.random() * W * 0.6;
              const by = H * 0.2 + Math.random() * H * 0.6;
              const count = 6;
              for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const orb = createOrb(bx, by);
                orb.vx = Math.cos(angle) * (3 + Math.random() * 2);
                orb.vy = Math.sin(angle) * (3 + Math.random() * 2);
                orbsRef.current.push(orb);
                ripplesRef.current.push({ x: bx, y: by, color: orb.color, born: now });
              }
              setOrbCount(orbsRef.current.length);
              shakeRef.current = Math.max(shakeRef.current, 10);
              playBurstSound();
            },
            // spin
            () => {
              const cx2 = W / 2, cy2 = H / 2;
              for (const o of orbs) {
                const dx = o.x - cx2, dy = o.y - cy2;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const str = 3 + Math.random() * 2;
                o.vx += (-dy / dist) * str;
                o.vy += (dx / dist) * str;
                o.vx -= (dx / dist) * 0.5;
                o.vy -= (dy / dist) * 0.5;
              }
              vortexesRef.current.push({ cx: cx2, cy: cy2, born: now, color: randomColor(), direction: Math.random() > 0.5 ? 1 : -1 });
              playSwoosh();
            },
            // chain lightning
            () => {
              if (orbs.length < 2) return;
              let startOrb = orbs[Math.floor(Math.random() * orbs.length)];
              const visited = new Set([startOrb.id]);
              const bolts = [];
              let current = startOrb;
              for (let step = 0; step < LIGHTNING_MAX_CHAIN; step++) {
                let nearest = null, nearDist = LIGHTNING_CHAIN_DIST;
                for (const o of orbs) {
                  if (visited.has(o.id)) continue;
                  const dx = o.x - current.x, dy = o.y - current.y;
                  const d = Math.sqrt(dx * dx + dy * dy);
                  if (d < nearDist) { nearDist = d; nearest = o; }
                }
                if (!nearest) break;
                visited.add(nearest.id);
                bolts.push({ points: generateBolt(current.x, current.y, nearest.x, nearest.y, LIGHTNING_SEGMENTS), color: current.color, branch: false });
                const angle = Math.atan2(nearest.y - current.y, nearest.x - current.x);
                nearest.vx += Math.cos(angle) * LIGHTNING_FORCE;
                nearest.vy += Math.sin(angle) * LIGHTNING_FORCE;
                current = nearest;
              }
              if (bolts.length > 0) {
                const sparks = [];
                for (const o of visited) {
                  const orb = orbs.find((ob) => ob.id === o);
                  if (orb) for (let s = 0; s < 3; s++) sparks.push({ x: orb.x, y: orb.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, born: now });
                }
                lightningRef.current.push({ bolts, sparks, born: now });
                shakeRef.current = Math.max(shakeRef.current, 8);
                playLightning();
              }
            },
            // scatter
            () => {
              const cx2 = W / 2, cy2 = H / 2;
              for (const o of orbs) {
                const dx = o.x - cx2, dy = o.y - cy2;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const str = 4 + Math.random() * 4;
                o.vx += (dx / dist) * str;
                o.vy += (dy / dist) * str;
              }
              shakeRef.current = Math.max(shakeRef.current, 12);
            },
            // meteor shower
            () => {
              for (let i = 0; i < METEOR_COUNT; i++) {
                const delay = i * METEOR_STAGGER;
                setTimeout(() => {
                  const mx2 = W * 0.1 + Math.random() * W * 0.8;
                  const orb = createOrb(mx2, -20);
                  orb.radius = 6 + Math.random() * 6;
                  orb.vx = (Math.random() - 0.5) * 2;
                  orb.vy = 4 + Math.random() * 4;
                  orbsRef.current.push(orb);
                  meteorTrailsRef.current.push({ x: mx2, y: -20, color: orb.color, born: performance.now() });
                }, delay);
              }
              setOrbCount(orbsRef.current.length);
              shakeRef.current = Math.max(shakeRef.current, 12);
              playMeteorSound();
            },
            // firework
            () => {
              const lx = W * 0.2 + Math.random() * W * 0.6;
              const py = H * 0.15 + Math.random() * H * 0.25;
              const count = 8;
              for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
                const orb = createOrb(lx, H);
                orb.radius = 5 + Math.random() * 4;
                orb.vx = Math.cos(angle) * (2 + Math.random());
                orb.vy = -(6 + Math.random() * 4);
                orbsRef.current.push(orb);
                ripplesRef.current.push({ x: lx, y: H, color: orb.color, born: now });
              }
              setOrbCount(orbsRef.current.length);
              shakeRef.current = Math.max(shakeRef.current, 8);
            },
          ];
          effects[Math.floor(Math.random() * effects.length)]();
          ap.lastEffect = now + (Math.random() - 0.5) * 1000; // vary timing
        }
      }

      // ── Domino cascade processing ──
      const domino = dominoRef.current;
      if (domino) {
        if (domino.phase === "chain") {
          while (domino.index < domino.queue.length && now >= domino.nextTime) {
            const target = domino.queue[domino.index];
            // Remove this orb from the live array
            orbsRef.current = orbsRef.current.filter((o) => o.id !== target.id);
            // Create burst particles
            for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
              const angle = (Math.PI * 2 * i) / BURST_PARTICLE_COUNT;
              burstsRef.current.push({
                x: target.x, y: target.y,
                vx: Math.cos(angle) * (2.5 + Math.random() * 2),
                vy: Math.sin(angle) * (2.5 + Math.random() * 2),
                color: target.color,
                radius: target.radius * 0.35,
                born: now,
              });
            }
            ripplesRef.current.push({ x: target.x, y: target.y, color: target.color, born: now });
            // Draw a connecting line to the next target
            if (domino.index < domino.queue.length - 1) {
              const next = domino.queue[domino.index + 1];
              lightningRef.current.push({
                bolts: [{ points: [{ x: target.x, y: target.y }, { x: next.x, y: next.y }], color: target.color }],
                sparks: [],
                born: now,
              });
            }
            shakeRef.current = Math.max(shakeRef.current, 4);
            domino.index++;
            domino.nextTime = now + DOMINO_DELAY;
          }
          if (domino.index >= domino.queue.length) {
            domino.phase = "wait";
            domino.nextTime = now + DOMINO_RESPAWN_DELAY;
          }
          setOrbCount(orbsRef.current.length);
        } else if (domino.phase === "wait" && now >= domino.nextTime) {
          // Respawn all orbs from center in a radial burst
          const count = domino.respawnCount;
          for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const orb = createOrb(W / 2, H / 2);
            orb.vx = Math.cos(angle) * (3 + Math.random() * 3);
            orb.vy = Math.sin(angle) * (3 + Math.random() * 3);
            orbsRef.current.push(orb);
            ripplesRef.current.push({ x: W / 2, y: H / 2, color: orb.color, born: now });
          }
          shakeRef.current = 20;
          dominoRef.current = null;
          setOrbCount(orbsRef.current.length);
          playBurstSound();
        }
      }

      // ── Pulse mode heartbeat ──
      if (pulseModeRef.current && !frozenRef.current && now - pulseTimerRef.current >= PULSE_INTERVAL) {
        pulseTimerRef.current = now;
        const pcx = W / 2;
        const pcy = H / 2;
        // emit a shockwave from center
        wavesRef.current.push({
          cx: pcx,
          cy: pcy,
          radius: 0,
          color: COLORS[Math.floor((now / 300) % COLORS.length)],
          generation: 0,
          hitOrbs: new Set(),
          delay: 0,
        });
        shakeRef.current = Math.max(shakeRef.current, 8);
        // subtle center glow flash
        flashesRef.current.push({
          x: pcx, y: pcy, color: '#667eea', radius: 40, born: now,
        });
      }

      // formation snap — spring force toward targets
      if (formationRef.current) {
        const fm = formationRef.current;
        const fmElapsed = now - fm.born;
        if (fmElapsed > FORMATION_HOLD_MS) {
          formationRef.current = null;
        } else {
          const fmEase = Math.min(fmElapsed / 400, 1); // ramp up over 400ms
          for (let fi = 0; fi < orbs.length; fi++) {
            const o = orbs[fi];
            if (o === dragRef.current) continue;
            if (fm.targets[fi]) {
              const fdx = fm.targets[fi].x - o.x;
              const fdy = fm.targets[fi].y - o.y;
              o.vx = (o.vx + fdx * FORMATION_SPRING * fmEase) * FORMATION_DAMPING;
              o.vy = (o.vy + fdy * FORMATION_SPRING * fmEase) * FORMATION_DAMPING;
            }
          }
        }
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

        // cursor wake: fast cursor movement gently pushes nearby orbs aside
        if (cursorSpeed > 3 && mouseRef.current.onCanvas && mDist < 90 && mDist > 0) {
          const wakeFalloff = 1 - mDist / 90;
          const wakePush = cursorSpeed * 0.025 * wakeFalloff * wakeFalloff;
          orb.vx -= (mdx / mDist) * wakePush;
          orb.vy -= (mdy / mDist) * wakePush;
        }

        // gravity (directional)
        if (gravityRef.current) {
          const gDir = gravityDirRef.current;
          if (gDir === "down") orb.vy += GRAVITY;
          else if (gDir === "up") orb.vy -= GRAVITY;
          else if (gDir === "right") orb.vx += GRAVITY;
          else if (gDir === "left") orb.vx -= GRAVITY;
        }

        // tilt gravity: directional gravity from device tilt or mouse position
        if (tiltModeRef.current) {
          let gx, gy;
          if (hasTiltSensorRef.current) {
            gx = tiltVecRef.current.x;
            gy = tiltVecRef.current.y;
          } else {
            // Desktop: gravity direction follows mouse relative to center
            const tmx = mouseRef.current.x;
            const tmy = mouseRef.current.y;
            const cdx = tmx - W / 2;
            const cdy = tmy - H / 2;
            const cDist = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
            const maxDist = Math.sqrt(W * W + H * H) / 2;
            const strength = Math.min(cDist / maxDist, 1);
            const rawGx = (cdx / cDist) * strength;
            const rawGy = (cdy / cDist) * strength;
            tiltVecRef.current.x += (rawGx - tiltVecRef.current.x) * TILT_SMOOTHING;
            tiltVecRef.current.y += (rawGy - tiltVecRef.current.y) * TILT_SMOOTHING;
            gx = tiltVecRef.current.x;
            gy = tiltVecRef.current.y;
          }
          orb.vx += gx * TILT_GRAVITY_FORCE;
          orb.vy += gy * TILT_GRAVITY_FORCE;
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

        // pulse mode: gentle center-pull between heartbeat pulses (inhale phase)
        if (pulseModeRef.current) {
          const timeSincePulse = now - pulseTimerRef.current;
          if (timeSincePulse > PULSE_PULL_RAMP) {
            const pcx = W / 2;
            const pcy = H / 2;
            const pdx = orb.x - pcx;
            const pdy = orb.y - pcy;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
            // pull strengthens as we approach next pulse
            const pullProgress = Math.min((timeSincePulse - PULSE_PULL_RAMP) / (PULSE_INTERVAL - PULSE_PULL_RAMP), 1);
            const pullStr = PULSE_PULL * pullProgress;
            orb.vx -= (pdx / pDist) * pullStr * Math.min(pDist / 100, 1);
            orb.vy -= (pdy / pDist) * pullStr * Math.min(pDist / 100, 1);
          }
        }


        // magnetic polarity: opposite polarities attract, same repel
        if (magnetModeRef.current) {
          for (const other of orbs) {
            if (other === orb) continue;
            const mdx = other.x - orb.x;
            const mdy = other.y - orb.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < MAGNET_RANGE && mDist > 3) {
              const polProduct = orb.polarity * other.polarity; // +1 same, -1 opposite
              const proximity = 1 - mDist / MAGNET_RANGE;
              const force = MAGNET_FORCE * proximity * (-polProduct); // attract opposite, repel same
              orb.vx += (mdx / mDist) * force;
              orb.vy += (mdy / mDist) * force;
            }
          }
        }

        // n-body gravity: orbs attract each other based on mass
        if (nbodyModeRef.current) {
          for (const other of orbs) {
            if (other === orb) continue;
            const ndx = other.x - orb.x;
            const ndy = other.y - orb.y;
            const nDist = Math.sqrt(ndx * ndx + ndy * ndy);
            if (nDist < NBODY_RANGE && nDist > NBODY_MIN_DIST) {
              const mass = other.radius * other.radius;
              const force = NBODY_G * mass / (nDist * nDist);
              orb.vx += (ndx / nDist) * force;
              orb.vy += (ndy / nDist) * force;
            }
          }
        }

        // flocking / swarm: boids-style separation + alignment + cohesion
        if (flockingModeRef.current) {
          let sepX = 0, sepY = 0;
          let alignVx = 0, alignVy = 0, alignCount = 0;
          let cohX = 0, cohY = 0, cohCount = 0;
          for (const other of orbs) {
            if (other === orb) continue;
            const fdx = other.x - orb.x;
            const fdy = other.y - orb.y;
            const fDist = Math.sqrt(fdx * fdx + fdy * fdy);
            // separation: steer away from very close neighbors
            if (fDist < FLOCK_SEPARATION_DIST && fDist > 1) {
              const urgency = 1 - fDist / FLOCK_SEPARATION_DIST;
              sepX -= (fdx / fDist) * urgency;
              sepY -= (fdy / fDist) * urgency;
            }
            // alignment: match velocity of nearby neighbors
            if (fDist < FLOCK_ALIGNMENT_DIST) {
              alignVx += other.vx;
              alignVy += other.vy;
              alignCount++;
            }
            // cohesion: steer toward center of nearby group
            if (fDist < FLOCK_COHESION_DIST) {
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
          // flee from cursor when mouse is on canvas
          if (mouseRef.current.onCanvas) {
            const cmx = orb.x - mouseRef.current.x;
            const cmy = orb.y - mouseRef.current.y;
            const cmDist = Math.sqrt(cmx * cmx + cmy * cmy);
            if (cmDist < FLOCK_CURSOR_FLEE_DIST && cmDist > 1) {
              const flee = (1 - cmDist / FLOCK_CURSOR_FLEE_DIST);
              orb.vx += (cmx / cmDist) * flee * FLOCK_CURSOR_FLEE_FORCE;
              orb.vy += (cmy / cmDist) * flee * FLOCK_CURSOR_FLEE_FORCE;
            }
          }
          // cap speed to keep swarm cohesive
          const fSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (fSpeed > FLOCK_MAX_SPEED) {
            orb.vx = (orb.vx / fSpeed) * FLOCK_MAX_SPEED;
            orb.vy = (orb.vy / fSpeed) * FLOCK_MAX_SPEED;
          }
        }

        // black hole gravity (much stronger, wider range)
        if (blackHoleRef.current) {
          const bh = blackHoleRef.current;
          const bdx = bh.x - orb.x;
          const bdy = bh.y - orb.y;
          const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
          if (bDist < BLACK_HOLE_RANGE && bDist > 3) {
            // gravity intensifies closer you get (inverse-ish)
            const pull = BLACK_HOLE_GRAVITY * (1 + bh.mass * 0.1) / (1 + bDist * 0.005);
            orb.vx += (bdx / bDist) * pull;
            orb.vy += (bdy / bDist) * pull;
            // slight spiral (tangential force near event horizon)
            if (bDist < BLACK_HOLE_EVENT_HORIZON * 4) {
              orb.vx += (-bdy / bDist) * pull * 0.3;
              orb.vy += (bdx / bDist) * pull * 0.3;
            }
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

        // gravity well attraction + orbital force
        for (const well of wellsRef.current) {
          const wdx = well.x - orb.x;
          const wdy = well.y - orb.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          if (wDist < WELL_RANGE && wDist > 3) {
            let wellStrength = 1;
            if (well.expiry) {
              wellStrength = Math.min((well.expiry - now) / 1500, 1);
              if (wellStrength <= 0) continue;
            }
            const force = WELL_GRAVITY * wellStrength / (1 + wDist * 0.01);
            // radial attraction
            orb.vx += (wdx / wDist) * force;
            orb.vy += (wdy / wDist) * force;
            // tangential orbital force — orbs spiral around wells
            const orbitalForce = force * 0.6 * (well.spinDir || 1);
            orb.vx += (-wdy / wDist) * orbitalForce;
            orb.vy += (wdx / wDist) * orbitalForce;
          }
        }

        // hold-to-attract pull
        if (holdChargeRef.current) {
          const hc = holdChargeRef.current;
          const chargeDuration = now - hc.born;
          const power = Math.min(chargeDuration / HOLD_CHARGE_MAX_MS, 1);
          const hdx = hc.x - orb.x;
          const hdy = hc.y - orb.y;
          const hDist = Math.sqrt(hdx * hdx + hdy * hdy);
          if (hDist < HOLD_CHARGE_RANGE && hDist > 3) {
            const force = HOLD_CHARGE_FORCE * power / (1 + hDist * 0.008);
            orb.vx += (hdx / hDist) * force;
            orb.vy += (hdy / hDist) * force;
          }
        }

        // gravity paint dot attraction
        for (const dot of gravityDotsRef.current) {
          const gdx = dot.x - orb.x;
          const gdy = dot.y - orb.y;
          const gDist = Math.sqrt(gdx * gdx + gdy * gdy);
          if (gDist < GPAINT_DOT_RANGE && gDist > 3) {
            const fade = 1 - (now - dot.born) / GPAINT_DOT_LIFETIME;
            const force = GPAINT_DOT_FORCE * fade / (1 + gDist * 0.008);
            orb.vx += (gdx / gDist) * force;
            orb.vy += (gdy / gDist) * force;
          }
        }

        // tap pulse wave — gentle push as concentric rings pass through orbs
        for (const tw of tapWavesRef.current) {
          const twAge = now - tw.born;
          if (twAge > TAP_WAVE_DURATION) continue;
          const twProgress = twAge / TAP_WAVE_DURATION;
          const streakMul = 1 + Math.min(tw.streak, 8) * 0.15;
          const waveRadius = twProgress * TAP_WAVE_MAX_RADIUS * streakMul;
          const tdx = orb.x - tw.x;
          const tdy = orb.y - tw.y;
          const tDist = Math.sqrt(tdx * tdx + tdy * tdy);
          // push orbs that are near the expanding wavefront
          const ringWidth = 25 * streakMul;
          if (tDist > 0 && Math.abs(tDist - waveRadius) < ringWidth) {
            const proximity = 1 - Math.abs(tDist - waveRadius) / ringWidth;
            const fadeOut = 1 - twProgress;
            const push = TAP_WAVE_PUSH * proximity * fadeOut * streakMul;
            orb.vx += (tdx / tDist) * push;
            orb.vy += (tdy / tDist) * push;
          }
        }

        // cosmic currents — gentle ambient flow field (layered sine waves)
        {
          const ct = now * CURRENT_SPEED;
          const fx = Math.sin(orb.y * CURRENT_SCALE + ct) * Math.cos(orb.x * CURRENT_SCALE * 0.7 + ct * 0.6);
          const fy = Math.cos(orb.x * CURRENT_SCALE + ct * 0.8) * Math.sin(orb.y * CURRENT_SCALE * 0.7 + ct * 0.3);
          orb.vx += fx * CURRENT_STRENGTH;
          orb.vy += fy * CURRENT_STRENGTH;
        }

        orb.vx *= FRICTION;
        orb.vy *= FRICTION;
        const speed_factor = slowMoRef.current ? 0.3 : 1;
        orb.x += orb.vx * speed_factor;
        orb.y += orb.vy * speed_factor;

        // gravity harp: detect string crossings
        {
          const prevY = orb.y - orb.vy * speed_factor;
          const stringSpacing = H / (HARP_STRING_COUNT + 1);
          const orbSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (orbSpeed > HARP_PLUCK_SPEED_THRESHOLD && !orb.spark) {
            for (let si = 1; si <= HARP_STRING_COUNT; si++) {
              const stringY = si * stringSpacing;
              if ((prevY < stringY && orb.y >= stringY) || (prevY > stringY && orb.y <= stringY)) {
                harpVibrationsRef.current.push({
                  x: orb.x, stringIndex: si - 1, born: now,
                  intensity: Math.min(orbSpeed / 8, 1),
                  color: orb.color,
                });
                // rate-limited pluck sound
                if (now - lastHarpPluckTime > HARP_PLUCK_COOLDOWN) {
                  lastHarpPluckTime = now;
                  const noteIdx = Math.floor((si - 1) * PENTATONIC.length / HARP_STRING_COUNT);
                  playTone(PENTATONIC[Math.min(noteIdx, PENTATONIC.length - 1)], 0.5, "triangle", 0.05 * Math.min(orbSpeed / 5, 1));
                }
                break; // one string per orb per frame
              }
            }
          }
        }

        // record position for comet trails (always-on)
        if (!orb.trail) orb.trail = [];
        orb.trail.push({ x: orb.x, y: orb.y });
        if (orb.trail.length > LIGHT_TRAIL_LENGTH) orb.trail.shift();

        // bounce off walls (or wrap around in wrap mode)
        if (wrapModeRef.current) {
          if (orb.x < -orb.radius) orb.x = W + orb.radius;
          else if (orb.x > W + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = H + orb.radius;
          else if (orb.y > H + orb.radius) orb.y = -orb.radius;
        } else {
          if (orb.x < orb.radius) {
            if (Math.abs(orb.vx) > WALL_HIT_SPEED_THRESHOLD) {
              const hi = Math.min(Math.abs(orb.vx) / 5, 1);
              wallHitsRef.current.push({ x: 0, y: orb.y, color: orb.color, born: now, intensity: hi });
              playBounce(hi);
              // wall bounce sparks — spray rightward from left wall
              const sparkN = Math.ceil(2 + hi * 6);
              for (let ws = 0; ws < sparkN; ws++) {
                const a = (Math.random() - 0.5) * 1.2;
                const sp = 1.5 + Math.random() * 3 * hi;
                burstsRef.current.push({ x: orb.radius, y: orb.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: orb.color, radius: 0.8 + Math.random() * 1.2, born: now });
              }
            }
            orb.x = orb.radius;
            orb.vx *= -0.6;
          }
          if (orb.x > W - orb.radius) {
            if (Math.abs(orb.vx) > WALL_HIT_SPEED_THRESHOLD) {
              const hi = Math.min(Math.abs(orb.vx) / 5, 1);
              wallHitsRef.current.push({ x: W, y: orb.y, color: orb.color, born: now, intensity: hi });
              playBounce(hi);
              // wall bounce sparks — spray leftward from right wall
              const sparkN = Math.ceil(2 + hi * 6);
              for (let ws = 0; ws < sparkN; ws++) {
                const a = Math.PI + (Math.random() - 0.5) * 1.2;
                const sp = 1.5 + Math.random() * 3 * hi;
                burstsRef.current.push({ x: W - orb.radius, y: orb.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: orb.color, radius: 0.8 + Math.random() * 1.2, born: now });
              }
            }
            orb.x = W - orb.radius;
            orb.vx *= -0.6;
          }
          if (orb.y < orb.radius) {
            if (Math.abs(orb.vy) > WALL_HIT_SPEED_THRESHOLD) {
              const hi = Math.min(Math.abs(orb.vy) / 5, 1);
              wallHitsRef.current.push({ x: orb.x, y: 0, color: orb.color, born: now, intensity: hi });
              playBounce(hi);
              // wall bounce sparks — spray downward from top wall
              const sparkN = Math.ceil(2 + hi * 6);
              for (let ws = 0; ws < sparkN; ws++) {
                const a = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
                const sp = 1.5 + Math.random() * 3 * hi;
                burstsRef.current.push({ x: orb.x, y: orb.radius, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: orb.color, radius: 0.8 + Math.random() * 1.2, born: now });
              }
            }
            orb.y = orb.radius;
            orb.vy *= -0.6;
          }
          if (orb.y > H - orb.radius) {
            if (Math.abs(orb.vy) > WALL_HIT_SPEED_THRESHOLD) {
              const hi = Math.min(Math.abs(orb.vy) / 5, 1);
              wallHitsRef.current.push({ x: orb.x, y: H, color: orb.color, born: now, intensity: hi });
              playBounce(hi);
              // wall bounce sparks — spray upward from bottom wall
              const sparkN = Math.ceil(2 + hi * 6);
              for (let ws = 0; ws < sparkN; ws++) {
                const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
                const sp = 1.5 + Math.random() * 3 * hi;
                burstsRef.current.push({ x: orb.x, y: H - orb.radius, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: orb.color, radius: 0.8 + Math.random() * 1.2, born: now });
              }
            }
            orb.y = H - orb.radius;
            orb.vy *= -0.6;
          }
        }

        // bounce off user-drawn barriers
        for (const bar of barriersRef.current) {
          const bex = bar.x2 - bar.x1, bey = bar.y2 - bar.y1;
          const bLen2 = bex * bex + bey * bey;
          if (bLen2 < 1) continue;
          let bt = ((orb.x - bar.x1) * bex + (orb.y - bar.y1) * bey) / bLen2;
          bt = Math.max(0, Math.min(1, bt));
          const cx = bar.x1 + bt * bex, cy = bar.y1 + bt * bey;
          const bdx = orb.x - cx, bdy = orb.y - cy;
          const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
          if (bDist < orb.radius && bDist > 0) {
            const bnx = bdx / bDist, bny = bdy / bDist;
            const bDot = orb.vx * bnx + orb.vy * bny;
            if (bDot < 0) {
              orb.vx -= 2 * bDot * bnx * 0.7;
              orb.vy -= 2 * bDot * bny * 0.7;
              orb.x = cx + bnx * (orb.radius + 0.5);
              orb.y = cy + bny * (orb.radius + 0.5);
              const bSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
              if (bSpeed > WALL_HIT_SPEED_THRESHOLD) {
                const bhi = Math.min(bSpeed / 5, 1);
                wallHitsRef.current.push({ x: cx, y: cy, color: bar.color, born: now, intensity: bhi });
                playBounce(bhi);
                // barrier bounce sparks — spray along reflection normal
                const sparkN = Math.ceil(2 + bhi * 6);
                const baseA = Math.atan2(bny, bnx);
                for (let ws = 0; ws < sparkN; ws++) {
                  const a = baseA + (Math.random() - 0.5) * 1.2;
                  const sp = 1.5 + Math.random() * 3 * bhi;
                  burstsRef.current.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: orb.color, radius: 0.8 + Math.random() * 1.2, born: now });
                }
              }
            }
          }
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

      // ── Gravity well critical mass check ──
      for (let wi = wellsRef.current.length - 1; wi >= 0; wi--) {
        const well = wellsRef.current[wi];
        // Auto-remove expired temporary wells
        if (well.expiry && now >= well.expiry) {
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            burstsRef.current.push({
              x: well.x, y: well.y,
              vx: Math.cos(angle) * (1 + Math.random()),
              vy: Math.sin(angle) * (1 + Math.random()),
              color: well.color, radius: 2, born: now,
            });
          }
          ripplesRef.current.push({ x: well.x, y: well.y, color: well.color, born: now });
          wellsRef.current.splice(wi, 1);
          continue;
        }
        let orbiting = 0;
        for (const orb of orbs) {
          const wdx = well.x - orb.x;
          const wdy = well.y - orb.y;
          if (wdx * wdx + wdy * wdy < WELL_RANGE * WELL_RANGE) orbiting++;
        }
        well.orbitCount = orbiting;
        if (orbiting >= WELL_CRITICAL_MASS) {
          if (!well.criticalSince) well.criticalSince = now;
          if (now - well.criticalSince >= WELL_CRITICAL_MS) {
            // DETONATE — scatter all orbiting orbs outward
            for (const orb of orbs) {
              const wdx = orb.x - well.x;
              const wdy = orb.y - well.y;
              const d = Math.sqrt(wdx * wdx + wdy * wdy);
              if (d < WELL_RANGE && d > 1) {
                orb.vx += (wdx / d) * WELL_CRITICAL_SCATTER;
                orb.vy += (wdy / d) * WELL_CRITICAL_SCATTER;
              }
            }
            // burst particles
            for (let i = 0; i < 16; i++) {
              const angle = (Math.PI * 2 * i) / 16;
              burstsRef.current.push({
                x: well.x, y: well.y,
                vx: Math.cos(angle) * (2 + Math.random() * 3),
                vy: Math.sin(angle) * (2 + Math.random() * 3),
                color: well.color, radius: 3.5, born: now,
              });
            }
            // shockwave
            wavesRef.current.push({ x: well.x, y: well.y, born: now, color: "#ffffff" });
            // flash label
            comboFlashRef.current.push({ text: "CRITICAL MASS", x: well.x, y: well.y - 30, born: now, color: "#ff3366" });
            shakeRef.current = 25;
            playBoom();
            playSupernovaSound();
            wellsRef.current.splice(wi, 1);
          }
        } else {
          well.criticalSince = null;
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

      // ── Black hole absorption ──
      if (blackHoleRef.current) {
        const bh = blackHoleRef.current;
        const horizon = BLACK_HOLE_EVENT_HORIZON + bh.mass * 2;
        let absorbed = false;
        for (let i = orbsRef.current.length - 1; i >= 0; i--) {
          const orb = orbsRef.current[i];
          if (orb === dragRef.current) continue;
          const dx = bh.x - orb.x;
          const dy = bh.y - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < horizon) {
            // absorb: burst particles spiraling in
            for (let j = 0; j < 4; j++) {
              const angle = (Math.PI * 2 * j) / 4 + Math.random();
              burstsRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(angle) * 1.5 + (dx / dist) * 2,
                vy: Math.sin(angle) * 1.5 + (dy / dist) * 2,
                color: orb.color, radius: orb.radius * 0.3, born: now,
              });
            }
            // add to disk visuals
            bh.diskDots.push({
              angle: Math.atan2(orb.y - bh.y, orb.x - bh.x),
              dist: 20 + Math.random() * 25,
              speed: 2 + Math.random() * 2,
              color: orb.color,
              radius: 2 + Math.random() * 2,
            });
            orbsRef.current.splice(i, 1);
            bh.absorbed++;
            bh.mass += 1;
            absorbed = true;
            playBlackHoleAbsorbSound();
          }
        }
        if (absorbed) setOrbCount(orbsRef.current.length);

        // check for explosion threshold
        if (bh.absorbed >= BLACK_HOLE_ABSORB_TO_EXPLODE) {
          // explode! spawn ring of orbs outward
          for (let i = 0; i < BLACK_HOLE_RING_COUNT; i++) {
            const angle = (Math.PI * 2 * i) / BLACK_HOLE_RING_COUNT + (Math.random() - 0.5) * 0.3;
            const orb = createOrb(bh.x, bh.y);
            orb.radius = 10 + Math.random() * 12;
            orb.vx = Math.cos(angle) * (BLACK_HOLE_RING_SPEED + Math.random() * 3);
            orb.vy = Math.sin(angle) * (BLACK_HOLE_RING_SPEED + Math.random() * 3);
            orbsRef.current.push(orb);
            ripplesRef.current.push({ x: bh.x, y: bh.y, color: orb.color, born: now });
          }
          // massive shockwave
          wavesRef.current.push({
            cx: bh.x, cy: bh.y, radius: 0,
            color: "#a855f7", generation: 0,
            hitOrbs: new Set(), delay: 0,
          });
          flashesRef.current.push({
            x: bh.x, y: bh.y, color: "#a855f7",
            radius: 80, born: now,
          });
          shakeRef.current = Math.max(shakeRef.current, 45);
          playBoom();
          blackHoleRef.current = null;
          setOrbCount(orbsRef.current.length);
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

      // ── Nova orb detonation ──
      {
        let novaDetonated = false;
        for (let i = orbsRef.current.length - 1; i >= 0; i--) {
          const orb = orbsRef.current[i];
          if (!orb.isNova) continue;
          const novaAge = now - orb.novaBorn;
          if (novaAge > orb.novaFuse) {
            novaDetonated = true;
            // push nearby orbs outward
            for (const other of orbsRef.current) {
              if (other === orb) continue;
              const dx = other.x - orb.x;
              const dy = other.y - orb.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < NOVA_PUSH_RADIUS && dist > 0) {
                const force = NOVA_PUSH_FORCE * (1 - dist / NOVA_PUSH_RADIUS);
                other.vx += (dx / dist) * force;
                other.vy += (dy / dist) * force;
              }
            }
            // spawn fragment orbs
            for (let f = 0; f < NOVA_BLAST_COUNT; f++) {
              const angle = (Math.PI * 2 * f) / NOVA_BLAST_COUNT + Math.random() * 0.3;
              const fragment = createOrb(orb.x, orb.y);
              fragment.radius = 4 + Math.random() * 4;
              fragment.vx = Math.cos(angle) * (NOVA_BLAST_SPEED + Math.random() * 2);
              fragment.vy = Math.sin(angle) * (NOVA_BLAST_SPEED + Math.random() * 2);
              fragment.color = orb.color;
              orbsRef.current.push(fragment);
            }
            // shockwave
            wavesRef.current.push({
              cx: orb.x, cy: orb.y,
              radius: 0,
              color: orb.color,
              generation: 0,
              hitOrbs: new Set(),
              delay: 0,
            });
            // burst particles
            for (let b = 0; b < 12; b++) {
              const angle = (Math.PI * 2 * b) / 12;
              burstsRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(angle) * (3 + Math.random() * 3),
                vy: Math.sin(angle) * (3 + Math.random() * 3),
                color: orb.color,
                radius: 3 + Math.random() * 2,
                born: now,
              });
            }
            // flash + shake
            flashesRef.current.push({
              x: orb.x, y: orb.y,
              color: "#ffffff",
              radius: orb.radius * 3,
              born: now,
            });
            shakeRef.current = Math.max(shakeRef.current, 8);
            orbsRef.current.splice(i, 1);
            playBoom();
          }
        }
        if (novaDetonated) setOrbCount(orbsRef.current.length);
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
            // capture relative velocity before blend overwrites it
            const collisionVx = a.vx - b.vx;
            const collisionVy = a.vy - b.vy;
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
            // collision sparks
            const sparkColors = [a.color, b.color];
            for (let s = 0; s < MERGE_SPARK_COUNT; s++) {
              const angle = (Math.PI * 2 * s) / MERGE_SPARK_COUNT + (Math.random() - 0.5) * 0.6;
              const speed = MERGE_SPARK_SPEED * (0.5 + Math.random());
              mergeSparksRef.current.push({
                x: bigger.x,
                y: bigger.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: sparkColors[s % 2],
                size: MERGE_SPARK_SIZE * (0.6 + Math.random() * 0.8),
                born: now,
              });
            }
            // merge shockwave: energetic collisions push nearby orbs
            const collisionSpeed = Math.sqrt(collisionVx * collisionVx + collisionVy * collisionVy);
            if (collisionSpeed > MERGE_PUSH_SPEED_MIN) {
              const intensity = Math.min(collisionSpeed / 8, 1);
              for (let k = 0; k < orbs.length; k++) {
                if (toRemove.has(k) || k === i || k === j) continue;
                const other = orbs[k];
                const pdx = other.x - bigger.x;
                const pdy = other.y - bigger.y;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                if (pDist < MERGE_PUSH_RADIUS && pDist > 1) {
                  const falloff = 1 - pDist / MERGE_PUSH_RADIUS;
                  const force = MERGE_PUSH_FORCE * intensity * falloff;
                  other.vx += (pdx / pDist) * force;
                  other.vy += (pdy / pDist) * force;
                }
              }
              ripplesRef.current.push({ x: bigger.x, y: bigger.y, color: bigger.color, born: now });
              shakeRef.current = Math.max(shakeRef.current, Math.floor(3 + intensity * 5));
            }
            toRemove.add(a === bigger ? j : i);
          }
        }
      }
      if (toRemove.size > 0) {
        orbsRef.current = orbs.filter((_, idx) => !toRemove.has(idx));
        setOrbCount(orbsRef.current.length);
        playMergeSound();
      }

      // Mitosis: massive orbs split into two daughter orbs
      for (let i = orbsRef.current.length - 1; i >= 0; i--) {
        const orb = orbsRef.current[i];
        if (orb.radius > COLLAPSE_RADIUS && orb !== dragRef.current) {
          orbsRef.current.splice(i, 1);
          // Split into two daughter orbs (conserve area: each gets r/√2)
          const daughterRadius = orb.radius / Math.SQRT2;
          const splitAngle = Math.random() * Math.PI * 2;
          const splitSpeed = 3 + Math.random() * 2;
          const offset = daughterRadius * 1.2;
          for (let d = 0; d < 2; d++) {
            const dir = d === 0 ? 1 : -1;
            orbsRef.current.push({
              id: Date.now() + Math.random() + d,
              x: orb.x + Math.cos(splitAngle) * offset * dir,
              y: orb.y + Math.sin(splitAngle) * offset * dir,
              vx: orb.vx + Math.cos(splitAngle) * splitSpeed * dir,
              vy: orb.vy + Math.sin(splitAngle) * splitSpeed * dir,
              radius: daughterRadius,
              color: orb.color,
              pulsePhase: Math.random() * Math.PI * 2,
              polarity: d === 0 ? orb.polarity : -orb.polarity,
            });
          }
          // Flash + sparks along split axis
          flashesRef.current.push({
            x: orb.x, y: orb.y,
            color: orb.color,
            radius: orb.radius * 1.5,
            born: now,
          });
          for (let s = 0; s < 8; s++) {
            const angle = splitAngle + (s < 4 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.0;
            const speed = MERGE_SPARK_SPEED * (0.6 + Math.random());
            mergeSparksRef.current.push({
              x: orb.x, y: orb.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: orb.color,
              size: MERGE_SPARK_SIZE * (0.7 + Math.random() * 0.8),
              born: now,
            });
          }
          ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          shakeRef.current = Math.max(shakeRef.current, 10);
          setOrbCount(orbsRef.current.length);
          playMitosis();
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


      // ── Shatter chain reaction ──────────────────────────────────────
      shatterRef.current = shatterRef.current.filter((s) => s.radius < SHATTER_WAVE_MAX_RADIUS);
      const pendingShatters = [];
      for (const s of shatterRef.current) {
        if (s.delay > 0) { s.delay--; continue; }
        s.radius += SHATTER_WAVE_SPEED;
        const halfW = SHATTER_WAVE_WIDTH / 2;
        for (let i = orbs.length - 1; i >= 0; i--) {
          const orb = orbs[i];
          if (orb === dragRef.current) continue;
          if (s.hitOrbs.has(orb.id)) continue;
          const dx = orb.x - s.x;
          const dy = orb.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > s.radius - halfW && dist < s.radius + halfW && dist > 0) {
            s.hitOrbs.add(orb.id);
            const chainChance = SHATTER_CHAIN_CHANCE * Math.pow(SHATTER_CHAIN_DECAY, s.generation);
            if (s.generation < SHATTER_MAX_GEN && Math.random() < chainChance) {
              // Chain shatter: destroy this orb too
              const pCount = Math.max(10, Math.round(orb.radius * 0.9));
              for (let p = 0; p < pCount; p++) {
                const a = (Math.PI * 2 * p) / pCount + (Math.random() - 0.5) * 0.4;
                const spd = 2 + Math.random() * 3;
                burstsRef.current.push({
                  x: orb.x, y: orb.y,
                  vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                  color: orb.color,
                  radius: 1.5 + Math.random() * (orb.radius * 0.25),
                  born: now,
                });
              }
              flashesRef.current.push({
                x: orb.x, y: orb.y, color: orb.color,
                radius: orb.radius * 1.4, born: now,
              });
              pendingShatters.push({
                x: orb.x, y: orb.y, radius: 0,
                generation: s.generation + 1,
                hitOrbs: new Set([orb.id]),
                color: orb.color,
                delay: SHATTER_DELAY_FRAMES,
              });
              orbs.splice(i, 1);
              shakeRef.current = Math.max(shakeRef.current, 4 + (SHATTER_MAX_GEN - s.generation) * 2);
            } else {
              // Just push the orb away
              const force = 3 * (1 - s.radius / SHATTER_WAVE_MAX_RADIUS);
              orb.vx += (dx / dist) * force;
              orb.vy += (dy / dist) * force;
            }
          }
        }
        // Render shatter wave ring
        const progress = s.radius / SHATTER_WAVE_MAX_RADIUS;
        const alpha = 0.7 * (1 - progress) * Math.pow(0.7, s.generation);
        if (alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          const rg = ctx.createRadialGradient(
            s.x, s.y, Math.max(0, s.radius - halfW),
            s.x, s.y, s.radius + halfW
          );
          rg.addColorStop(0, "transparent");
          rg.addColorStop(0.3, s.color + hexAlpha(alpha * 0.4 * 255));
          rg.addColorStop(0.5, "#ffffff" + hexAlpha(alpha * 0.9 * 255));
          rg.addColorStop(0.7, s.color + hexAlpha(alpha * 0.4 * 255));
          rg.addColorStop(1, "transparent");
          ctx.strokeStyle = rg;
          ctx.lineWidth = halfW * 2;
          ctx.stroke();
        }
      }
      // add pending chain-shatters (cap per frame for performance)
      for (let i = 0; i < Math.min(pendingShatters.length, 8); i++) {
        shatterRef.current.push(pendingShatters[i]);
      }
      if (pendingShatters.length > 0) {
        setOrbCount(orbs.length);
      }

      // update and draw color waves
      const maxCWRadius = Math.sqrt(W * W + H * H) * 1.2;
      colorWavesRef.current = colorWavesRef.current.filter((w) => w.radius < maxCWRadius);
      for (const cw of colorWavesRef.current) {
        cw.radius += COLOR_WAVE_SPEED;
        // recolor orbs as the wave front passes
        for (const orb of orbs) {
          if (cw.hitOrbs.has(orb.id)) continue;
          const dx = orb.x - cw.cx;
          const dy = orb.y - cw.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > cw.radius - COLOR_WAVE_WIDTH / 2 && dist < cw.radius + COLOR_WAVE_WIDTH / 2) {
            cw.hitOrbs.add(orb.id);
            const angle = Math.atan2(dy, dx);
            const hue = ((angle * 180 / Math.PI) + 360) % 360;
            orb.color = hslToHex(hue, 0.85, 0.55);
            // tiny flash at recolor point
            flashesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, radius: orb.radius, born: now });
          }
        }
        // render rainbow ring
        const cwAlpha = 0.7 * (1 - cw.radius / maxCWRadius);
        if (cwAlpha > 0.01) {
          const segAngle = (Math.PI * 2) / COLOR_WAVE_SEGMENTS;
          const lineW = COLOR_WAVE_WIDTH * (1 - cw.radius / maxCWRadius * 0.5);
          for (let i = 0; i < COLOR_WAVE_SEGMENTS; i++) {
            const startAngle = i * segAngle;
            const endAngle = (i + 1) * segAngle + 0.02; // slight overlap
            const hue = (i / COLOR_WAVE_SEGMENTS) * 360;
            ctx.beginPath();
            ctx.arc(cw.cx, cw.cy, cw.radius, startAngle, endAngle);
            ctx.strokeStyle = hslToHex(hue, 0.9, 0.6) + hexAlpha(cwAlpha * 255);
            ctx.lineWidth = lineW;
            ctx.stroke();
          }
          // soft white glow
          ctx.beginPath();
          ctx.arc(cw.cx, cw.cy, cw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${cwAlpha * 0.12})`;
          ctx.lineWidth = lineW * 1.6;
          ctx.stroke();
        }
      }

      // ── Comet trails: speed-proportional tails behind every orb ──
      ctx.lineCap = "round";
      for (const orb of orbs) {
        const trail = orb.trail;
        if (!trail || trail.length < 3) continue;
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed < TRAIL_SPEED_MIN) continue;
        // intensity ramps from 0 at threshold to 1 at high speed
        const intensity = Math.min((speed - TRAIL_SPEED_MIN) / 5, 1);
        for (let t = 1; t < trail.length; t++) {
          const progress = t / trail.length; // 0 at tail, 1 at head
          const alpha = progress * progress * 0.45 * intensity;
          const width = progress * orb.radius * 0.6 * intensity;
          ctx.beginPath();
          ctx.moveTo(trail[t - 1].x, trail[t - 1].y);
          ctx.lineTo(trail[t].x, trail[t].y);
          ctx.strokeStyle = orb.color + hexAlpha(alpha * 255);
          ctx.lineWidth = Math.max(0.5, width);
          ctx.stroke();
        }
        // soft glow at trail head for fast-moving orbs
        if (intensity > 0.4 && trail.length > 2) {
          const head = trail[trail.length - 1];
          const glowR = orb.radius * (0.8 + intensity * 0.6);
          const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowR);
          glow.addColorStop(0, orb.color + hexAlpha(intensity * 40));
          glow.addColorStop(1, orb.color + "00");
          ctx.beginPath();
          ctx.arc(head.x, head.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
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

            // vibrating string: sine wave driven by orb speeds & phase sync
            const speedA = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
            const speedB = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            const avgSpeed = (speedA + speedB) / 2;
            const waveAmp = Math.min(avgSpeed * 2.5, 14) * alpha * (0.2 + syncBoost * 0.8);
            const waveFreq = 2 + sync * 4; // 2–6 half-waves
            const nx = -(b.y - a.y) / dist; // perpendicular normal
            const ny = (b.x - a.x) / dist;
            ctx.beginPath();
            const steps = 20;
            for (let s = 0; s <= steps; s++) {
              const t = s / steps;
              const baseX = a.x + (b.x - a.x) * t;
              const baseY = a.y + (b.y - a.y) * t;
              const envelope = Math.sin(t * Math.PI); // zero at endpoints
              const wave = Math.sin(t * Math.PI * waveFreq + now * 0.005) * waveAmp * envelope;
              const px = baseX + nx * wave;
              const py = baseY + ny * wave;
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
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

      // ── Constellation connections ──
      // always-on constellation: subtle ambient lines connecting nearby orbs
      if (orbs.length > 1 && orbs.length < 100) {
        ctx.lineCap = "round";
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const a = orbs[i];
            const b = orbs[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONSTELLATION_DIST) {
              const proximity = 1 - dist / CONSTELLATION_DIST;
              const shimmer = 0.7 + 0.3 * Math.sin(time * 2 + i * 0.5 + j * 0.3);
              const alpha = proximity * proximity * shimmer * 0.25;
              const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              grad.addColorStop(0, a.color + hexAlpha(alpha * 255));
              grad.addColorStop(1, b.color + hexAlpha(alpha * 255));
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.5 + proximity * 1;
              ctx.stroke();
              // small star at connection midpoint for bright connections
              if (proximity > CONSTELLATION_NODE_THRESHOLD) {
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const starAlpha = (proximity - CONSTELLATION_NODE_THRESHOLD) * 1.5 * shimmer * 0.3;
                const starSize = 1 + proximity * 1.5;
                ctx.beginPath();
                ctx.arc(mx, my, starSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
                ctx.fill();
              }
            }
          }
        }
      }

      // n-body gravity field lines
      if (nbodyModeRef.current && orbs.length > 1) {
        ctx.lineCap = "round";
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const a = orbs[i];
            const b = orbs[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < NBODY_RANGE && dist > NBODY_MIN_DIST) {
              const massA = a.radius * a.radius;
              const massB = b.radius * b.radius;
              const totalMass = massA + massB;
              const proximity = 1 - dist / NBODY_RANGE;
              const intensity = Math.min(totalMass / 400, 1);
              const alpha = proximity * proximity * intensity * 0.2;
              if (alpha > 0.01) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
                ctx.lineWidth = 0.5 + proximity * intensity * 1.5;
                ctx.stroke();
              }
            }
          }
        }
      }

      // ── Gravity harp strings + vibrations ──
      {
        const stringSpacing = H / (HARP_STRING_COUNT + 1);
        // draw base strings (very faint)
        for (let si = 0; si < HARP_STRING_COUNT; si++) {
          const y = (si + 1) * stringSpacing;
          ctx.beginPath();
          ctx.setLineDash([4, 12]);
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.strokeStyle = "rgba(102, 126, 234, 0.04)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        // draw vibrations
        harpVibrationsRef.current = harpVibrationsRef.current.filter(v => now - v.born < HARP_VIBRATION_DURATION);
        for (const vib of harpVibrationsRef.current) {
          const age = now - vib.born;
          const progress = age / HARP_VIBRATION_DURATION;
          const y = (vib.stringIndex + 1) * stringSpacing;
          const amplitude = vib.intensity * 10 * (1 - progress);
          const waveWidth = 50 + progress * 250;
          const fadeAlpha = (1 - progress) * 0.6;

          ctx.beginPath();
          const startX = Math.max(0, vib.x - waveWidth);
          const endX = Math.min(W, vib.x + waveWidth);
          ctx.moveTo(startX, y);
          for (let px = startX; px <= endX; px += 4) {
            const relX = px - vib.x;
            const distNorm = Math.abs(relX) / waveWidth;
            const envelope = Math.cos(distNorm * Math.PI * 0.5);
            const dy = Math.sin(relX * 0.12 + age * 0.012) * amplitude * envelope;
            ctx.lineTo(px, y + dy);
          }
          // hex color to rgba with fade
          const r = parseInt(vib.color.slice(1, 3), 16);
          const g = parseInt(vib.color.slice(3, 5), 16);
          const b = parseInt(vib.color.slice(5, 7), 16);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${fadeAlpha})`;
          ctx.lineWidth = 1.5 + vib.intensity;
          ctx.stroke();

          // glow at pluck point
          if (progress < 0.3) {
            const glowAlpha = (1 - progress / 0.3) * 0.25 * vib.intensity;
            const glowR = 15 + vib.intensity * 10;
            const grad = ctx.createRadialGradient(vib.x, y, 0, vib.x, y, glowR);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowAlpha})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.beginPath();
            ctx.arc(vib.x, y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        }
      }

      // ── Speed streaks for fast-moving orbs ──
      for (const orb of orbs) {
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed < 3.0) continue;
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);
        const r = orb.radius * pulse;
        const intensity = Math.min((speed - 3.0) / 12, 1);
        const tailLen = r + speed * 2.5;
        const angle = Math.atan2(orb.vy, orb.vx);
        const tx = orb.x - Math.cos(angle) * tailLen;
        const ty = orb.y - Math.sin(angle) * tailLen;
        const perpX = -Math.sin(angle);
        const perpY = Math.cos(angle);
        const halfW = r * 0.6;

        ctx.beginPath();
        ctx.moveTo(orb.x + perpX * halfW, orb.y + perpY * halfW);
        ctx.lineTo(orb.x - perpX * halfW, orb.y - perpY * halfW);
        ctx.lineTo(tx, ty);
        ctx.closePath();

        const streakGrad = ctx.createLinearGradient(orb.x, orb.y, tx, ty);
        streakGrad.addColorStop(0, orb.color + hexAlpha(intensity * 120));
        streakGrad.addColorStop(1, "transparent");
        ctx.fillStyle = streakGrad;
        ctx.fill();
      }

      // ── Cursor aura ──
      {
        const ca = cursorAuraRef.current;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        // count nearby orbs to modulate glow intensity
        let nearCount = 0;
        for (const orb of orbs) {
          const dx = mx - orb.x, dy = my - orb.y;
          if (dx * dx + dy * dy < 180 * 180) nearCount++;
        }
        ca.nearCount += (nearCount - ca.nearCount) * 0.1; // smooth
        // fade in when cursor is on canvas, fade out when it leaves
        const targetAlpha = mouseRef.current.onCanvas ? 1 : 0;
        ca.alpha += (targetAlpha - ca.alpha) * 0.08;
        if (ca.alpha > 0.005) {
          const baseAlpha = 0.04 + Math.min(ca.nearCount * 0.008, 0.06);
          const pulseAlpha = baseAlpha * (1 + 0.15 * Math.sin(time * 2));
          const glowRadius = 130 + Math.min(ca.nearCount * 4, 50);
          const a = pulseAlpha * ca.alpha;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const cg = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
          cg.addColorStop(0, `rgba(120, 160, 255, ${(a * 1.2).toFixed(4)})`);
          cg.addColorStop(0.3, `rgba(140, 120, 255, ${(a * 0.6).toFixed(4)})`);
          cg.addColorStop(0.7, `rgba(100, 80, 220, ${(a * 0.15).toFixed(4)})`);
          cg.addColorStop(1, "transparent");
          ctx.fillStyle = cg;
          ctx.beginPath();
          ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ── Gravity mesh (spacetime fabric) ──
      if (meshModeRef.current && orbs.length > 0) {
        const cols = Math.ceil(W / MESH_SPACING) + 1;
        const rows = Math.ceil(H / MESH_SPACING) + 1;
        const influSq = MESH_INFLUENCE_RANGE * MESH_INFLUENCE_RANGE;
        ctx.lineWidth = 1;
        // draw horizontal lines
        for (let row = 0; row < rows; row++) {
          const baseY = row * MESH_SPACING;
          ctx.beginPath();
          let maxWarp = 0;
          let warpColor = null;
          for (let col = 0; col <= cols; col++) {
            const baseX = col * MESH_SPACING;
            let dx = 0, dy = 0;
            for (const orb of orbs) {
              const ox = orb.x - baseX;
              const oy = orb.y - baseY;
              const distSq = ox * ox + oy * oy;
              if (distSq < influSq && distSq > 1) {
                const dist = Math.sqrt(distSq);
                const strength = orb.radius * 1.5 * (1 - dist / MESH_INFLUENCE_RANGE);
                const disp = Math.min(strength, MESH_MAX_DISPLACEMENT);
                dx += (ox / dist) * disp;
                dy += (oy / dist) * disp;
                if (disp > maxWarp) { maxWarp = disp; warpColor = orb.color; }
              }
            }
            const px = baseX + dx;
            const py = baseY + dy;
            if (col === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          const warpT = Math.min(maxWarp / MESH_MAX_DISPLACEMENT, 1);
          const alpha = MESH_BASE_ALPHA + warpT * (MESH_WARP_ALPHA - MESH_BASE_ALPHA);
          ctx.strokeStyle = warpColor
            ? hexAlpha(warpColor, alpha)
            : `rgba(102, 126, 234, ${alpha})`;
          ctx.stroke();
        }
        // draw vertical lines
        for (let col = 0; col < cols; col++) {
          const baseX = col * MESH_SPACING;
          ctx.beginPath();
          let maxWarp = 0;
          let warpColor = null;
          for (let row = 0; row <= rows; row++) {
            const baseY = row * MESH_SPACING;
            let dx = 0, dy = 0;
            for (const orb of orbs) {
              const ox = orb.x - baseX;
              const oy = orb.y - baseY;
              const distSq = ox * ox + oy * oy;
              if (distSq < influSq && distSq > 1) {
                const dist = Math.sqrt(distSq);
                const strength = orb.radius * 1.5 * (1 - dist / MESH_INFLUENCE_RANGE);
                const disp = Math.min(strength, MESH_MAX_DISPLACEMENT);
                dx += (ox / dist) * disp;
                dy += (oy / dist) * disp;
                if (disp > maxWarp) { maxWarp = disp; warpColor = orb.color; }
              }
            }
            const px = baseX + dx;
            const py = baseY + dy;
            if (row === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          const warpT = Math.min(maxWarp / MESH_MAX_DISPLACEMENT, 1);
          const alpha = MESH_BASE_ALPHA + warpT * (MESH_WARP_ALPHA - MESH_BASE_ALPHA);
          ctx.strokeStyle = warpColor
            ? hexAlpha(warpColor, alpha)
            : `rgba(102, 126, 234, ${alpha})`;
          ctx.stroke();
        }
      }

      // draw orbs
      for (const orb of orbs) {
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);

        // spawn materialization: scale from 0 → full with elastic bounce
        const spawnAge = orb.born ? now - orb.born : SPAWN_DURATION;
        const spawnT = Math.min(spawnAge / SPAWN_DURATION, 1);
        const spawnScale = easeOutElastic(spawnT);

        // proximity bloom: orbs near cursor swell and glow
        let proximityBoost = 0;
        if (mouseRef.current.onCanvas) {
          const pdx = orb.x - mouseRef.current.x;
          const pdy = orb.y - mouseRef.current.y;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          const pRange = 120;
          if (pDist < pRange) {
            proximityBoost = (1 - pDist / pRange) * (1 - pDist / pRange); // quadratic falloff
          }
        }

        const r = orb.radius * pulse * spawnScale * (1 + proximityBoost * 0.3);
        if (r < 0.5) continue; // skip nearly-invisible orbs

        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);

        // Mitosis wobble: large orbs near split threshold elongate and pulse
        const mitosisProgress = orb.radius > MITOSIS_WOBBLE_START
          ? Math.min((orb.radius - MITOSIS_WOBBLE_START) / (COLLAPSE_RADIUS - MITOSIS_WOBBLE_START), 1)
          : 0;

        ctx.save();
        ctx.translate(orb.x, orb.y);

        // velocity stretch: fast orbs elongate along direction of travel
        if (speed > VELOCITY_STRETCH_THRESHOLD && spawnT >= 1) {
          const stretchAmt = Math.min((speed - VELOCITY_STRETCH_THRESHOLD) / VELOCITY_STRETCH_RAMP, VELOCITY_STRETCH_MAX);
          const velAngle = Math.atan2(orb.vy, orb.vx);
          ctx.rotate(velAngle);
          ctx.scale(1 + stretchAmt, 1 - stretchAmt * 0.35);
          ctx.rotate(-velAngle);
        }

        if (mitosisProgress > 0) {
          const wobbleAmt = mitosisProgress * 0.2 * Math.sin(time * 5 + orb.pulsePhase);
          const wobbleAngle = time * 1.5 + orb.pulsePhase * 2;
          ctx.rotate(wobbleAngle);
          ctx.scale(1 + wobbleAmt, 1 - wobbleAmt);
        }

        // spawn flash: bright wide glow that fades during materialization
        if (spawnT < 1) {
          const flashAlpha = (1 - spawnT) * 0.6;
          const flashR = r * (3 + (1 - spawnT) * 4);
          const flashGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flashR);
          flashGrad.addColorStop(0, orb.color + hexAlpha(flashAlpha * 255));
          flashGrad.addColorStop(0.3, orb.color + hexAlpha(flashAlpha * 0.4 * 255));
          flashGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(0, 0, flashR, 0, Math.PI * 2);
          ctx.fillStyle = flashGrad;
          ctx.fill();
        }

        // outer glow (expands + brightens with speed)
        const heat = Math.min(speed / 8, 1);
        const glowR = r * (3 + heat * 3);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        grad.addColorStop(0, orb.color + hexAlpha(0x66 + heat * 0x55));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // speed corona: warm white glow when moving fast
        if (heat > 0.15) {
          const coronaA = (heat - 0.15) * 0.45;
          const coronaR = r * (1.5 + heat * 1.5);
          const corona = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, coronaR);
          corona.addColorStop(0, `rgba(255, 245, 230, ${coronaA})`);
          corona.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(0, 0, coronaR, 0, Math.PI * 2);
          ctx.fillStyle = corona;
          ctx.fill();
        }

        // core
        const coreGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        coreGrad.addColorStop(0, "#fff");
        coreGrad.addColorStop(0.3, orb.color);
        coreGrad.addColorStop(1, orb.color + "88");
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // firefly blink: brief additive flash at pulse peak — mesmerizing when orbs sync
        const blinkRaw = Math.max(0, Math.sin(time * 1.5 + orb.pulsePhase) - 0.96) / 0.04;
        if (blinkRaw > 0.01) {
          const blinkI = blinkRaw * blinkRaw * blinkRaw;
          const blinkR = r * (2 + blinkI * 3);
          const blinkA = blinkI * 0.25;
          ctx.globalCompositeOperation = "lighter";
          const blinkGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, blinkR);
          blinkGrad.addColorStop(0, `rgba(255, 255, 255, ${blinkA * 0.6})`);
          blinkGrad.addColorStop(0.4, orb.color + hexAlpha(blinkA * 255));
          blinkGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(0, 0, blinkR, 0, Math.PI * 2);
          ctx.fillStyle = blinkGrad;
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }

        // proximity bloom halo: soft bright ring when cursor is near
        if (proximityBoost > 0.05) {
          const bloomR = r * (2 + proximityBoost * 2.5);
          const bloomA = proximityBoost * 0.35;
          const bloomGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, bloomR);
          bloomGrad.addColorStop(0, orb.color + hexAlpha(bloomA * 255));
          bloomGrad.addColorStop(0.4, orb.color + hexAlpha(bloomA * 0.3 * 255));
          bloomGrad.addColorStop(1, "transparent");
          ctx.globalCompositeOperation = "lighter";
          ctx.beginPath();
          ctx.arc(0, 0, bloomR, 0, Math.PI * 2);
          ctx.fillStyle = bloomGrad;
          ctx.fill();
        }

        // chromatic aberration: prismatic RGB split on fast-moving orbs
        if (speed > 3) {
          const ca = Math.min((speed - 3) / 6, 1);
          const off = r * ca * 1.5;
          const tx = -orb.vx / speed;
          const ty = -orb.vy / speed;
          const px = -ty, py = tx;
          ctx.globalCompositeOperation = "lighter";
          ctx.beginPath();
          ctx.arc(tx * off + px * off * 0.35, ty * off + py * off * 0.35, r * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 60, 30, ${ca * 0.18})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tx * off - px * off * 0.35, ty * off - py * off * 0.35, r * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(30, 120, 255, ${ca * 0.18})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // magnetic polarity rings
      if (magnetModeRef.current) {
        for (const orb of orbs) {
          const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);
          const r = orb.radius * pulse;
          const polAlpha = 0.45 + 0.15 * Math.sin(time * 3 + orb.pulsePhase);
          const polColor = orb.polarity > 0
            ? `rgba(255, 80, 80, ${polAlpha})`
            : `rgba(80, 150, 255, ${polAlpha})`;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = polColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // draw nova orb indicators (countdown ring + warning glow)
      for (const orb of orbs) {
        if (!orb.isNova) continue;
        const novaAge = now - orb.novaBorn;
        const progress = Math.min(novaAge / orb.novaFuse, 1);
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase);
        const r = orb.radius * pulse;
        const isWarning = novaAge > orb.novaFuse - NOVA_WARN_MS;

        // timer ring that fills up as detonation approaches
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.strokeStyle = isWarning
          ? `rgba(255, ${100 + Math.floor(Math.sin(time * 12) * 80)}, 50, 0.8)`
          : `rgba(255, 200, 100, ${0.25 + progress * 0.35})`;
        ctx.lineWidth = isWarning ? 2.5 : 1.5;
        ctx.stroke();

        // warning phase: flickering hot glow
        if (isWarning) {
          const warnFlicker = 0.25 + 0.2 * Math.sin(time * 15 + orb.pulsePhase);
          const warnGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r * 4);
          warnGrad.addColorStop(0, `rgba(255, 220, 100, ${warnFlicker})`);
          warnGrad.addColorStop(0.5, `rgba(255, 150, 50, ${warnFlicker * 0.4})`);
          warnGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = warnGrad;
          ctx.fill();
        }

        // subtle warm tint over the orb
        const tintAlpha = 0.08 + progress * 0.15;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 80, ${tintAlpha})`;
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

      // draw merge collision sparks
      mergeSparksRef.current = mergeSparksRef.current.filter((s) => now - s.born < MERGE_SPARK_LIFETIME);
      for (const spark of mergeSparksRef.current) {
        const age = (now - spark.born) / MERGE_SPARK_LIFETIME;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94;
        spark.vy *= 0.94;
        const alpha = (1 - age) * (1 - age); // quadratic fade for snappy pop
        const r = spark.size * (1 - age * 0.4);
        // bright core
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fill();
        // colored glow
        const glowR = r * 3;
        const grad = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, glowR);
        grad.addColorStop(0, spark.color + hexAlpha(alpha * 0.6 * 255));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
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

      // draw hold-to-attract vortex
      if (holdChargeRef.current) {
        const hc = holdChargeRef.current;
        const chargeDuration = now - hc.born;
        const power = Math.min(chargeDuration / HOLD_CHARGE_MAX_MS, 1);
        const pulse = Math.sin(time * 4) * 0.15;

        // Outer attraction field glow
        const fieldRadius = HOLD_CHARGE_RANGE * (0.3 + power * 0.7);
        const fieldAlpha = 0.06 + power * 0.12 + pulse * 0.03;
        const fieldGrad = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, fieldRadius);
        fieldGrad.addColorStop(0, "#4facfe" + hexAlpha(fieldAlpha * 2 * 255));
        fieldGrad.addColorStop(0.5, "#667eea" + hexAlpha(fieldAlpha * 255));
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(hc.x, hc.y, fieldRadius, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // Spinning accretion rings
        const ringCount = 2 + Math.floor(power * 2);
        for (let ring = 0; ring < ringCount; ring++) {
          const ringRadius = 15 + ring * 20 + power * 30;
          const rotSpeed = (ring % 2 === 0 ? 1 : -1) * (3 + power * 2);
          const rotation = time * rotSpeed;
          const ringAlpha = (0.3 + power * 0.4) * (1 - ring * 0.2);
          ctx.save();
          ctx.translate(hc.x, hc.y);
          ctx.rotate(rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringRadius, ringRadius * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "#4facfe" + hexAlpha(Math.min(ringAlpha, 1) * 255);
          ctx.lineWidth = 2 - ring * 0.3;
          ctx.stroke();
          ctx.restore();
        }

        // Bright core
        const coreSize = 4 + power * 8;
        const coreGrad = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, coreSize);
        coreGrad.addColorStop(0, "#ffffff" + hexAlpha((0.7 + power * 0.3) * 255));
        coreGrad.addColorStop(0.5, "#4facfe" + hexAlpha((0.4 + power * 0.3) * 255));
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(hc.x, hc.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw user-drawn barriers
      for (const bar of barriersRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bar.x1, bar.y1);
        ctx.lineTo(bar.x2, bar.y2);
        ctx.strokeStyle = bar.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = bar.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        // subtle inner glow line
        ctx.beginPath();
        ctx.moveTo(bar.x1, bar.y1);
        ctx.lineTo(bar.x2, bar.y2);
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
      }
      // draw barrier being drawn
      if (barrierDrawRef.current) {
        const bd = barrierDrawRef.current;
        const bdx = bd.x2 - bd.x1, bdy = bd.y2 - bd.y1;
        const bLen = Math.sqrt(bdx * bdx + bdy * bdy);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bd.x1, bd.y1);
        ctx.lineTo(bd.x2, bd.y2);
        ctx.strokeStyle = bLen > 30 ? "rgba(255,255,255,0.6)" : "rgba(255,100,100,0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // draw gravity wells
      for (const well of wellsRef.current) {
        const wellAge = (now - well.born) / 1000;
        const charge = Math.min((well.orbitCount || 0) / WELL_CRITICAL_MASS, 1);
        const isCritical = well.criticalSince != null;
        const criticalProg = isCritical ? Math.min((now - well.criticalSince) / WELL_CRITICAL_MS, 1) : 0;

        // Fade out temporary wells approaching expiry
        let wellFade = 1;
        if (well.expiry) {
          wellFade = Math.min((well.expiry - now) / 1500, 1);
          if (wellFade <= 0) continue;
        }
        ctx.save();
        ctx.globalAlpha = wellFade;

        // outer gravitational field glow — intensifies with charge
        const baseFieldAlpha = 0.04 + 0.02 * Math.sin(time * 2);
        const fieldAlpha = baseFieldAlpha + charge * 0.08;
        const fieldGrad = ctx.createRadialGradient(well.x, well.y, well.radius * 2, well.x, well.y, WELL_RANGE * 0.6);
        fieldGrad.addColorStop(0, (isCritical ? "#ff3366" : well.color) + hexAlpha(fieldAlpha * 255));
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(well.x, well.y, WELL_RANGE * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // critical mass warning pulse — expanding/contracting ring
        if (charge > 0.5) {
          const pulseSpeed = 4 + criticalProg * 8;
          const pulseRadius = well.radius * (3 + Math.sin(time * pulseSpeed) * 1.5);
          const pulseAlpha = (charge - 0.5) * 2 * (0.3 + criticalProg * 0.4);
          ctx.beginPath();
          ctx.arc(well.x, well.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "#ff3366" + hexAlpha(pulseAlpha * 255);
          ctx.lineWidth = 2 + criticalProg * 2;
          ctx.stroke();
        }

        // rotating accretion rings — speed up with charge
        const ringSpeedMult = 1 + charge * 2;
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = well.radius * (2.2 + ring * 1.4);
          const rotSpeed = (ring % 2 === 0 ? 1 : -1) * (2.0 - ring * 0.4) * (well.spinDir || 1) * ringSpeedMult;
          const rotation = wellAge * rotSpeed;
          const ringAlpha = 0.35 - ring * 0.08 + charge * 0.15;
          ctx.save();
          ctx.translate(well.x, well.y);
          ctx.rotate(rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringRadius, ringRadius * 0.28, 0, 0, Math.PI * 2);
          ctx.strokeStyle = (isCritical ? "#ff3366" : well.color) + hexAlpha(ringAlpha * 255);
          ctx.lineWidth = 1.8 - ring * 0.4 + charge;
          ctx.stroke();
          ctx.restore();
        }

        // photon sphere edge ring
        const edgePulse = 0.45 + 0.15 * Math.sin(time * 3 + well.born) + charge * 0.3;
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = (isCritical ? "#ff3366" : well.color) + hexAlpha(edgePulse * 255);
        ctx.lineWidth = 2 + charge;
        ctx.stroke();

        // dark core (event horizon)
        const coreGrad = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, well.radius * 1.3);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.5, "#050510");
        coreGrad.addColorStop(0.8, (isCritical ? "#ff3366" : well.color) + "33");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(well.x, well.y, well.radius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
        ctx.restore(); // restore wellFade globalAlpha
      }

      // draw gravity paint dots
      for (const dot of gravityDotsRef.current) {
        const dotAge = now - dot.born;
        const fade = 1 - dotAge / GPAINT_DOT_LIFETIME;
        const pulse = 0.5 + 0.5 * Math.sin(time * 4 + dot.born * 0.01);

        // outer attraction field
        const fieldRadius = GPAINT_DOT_RANGE * 0.5 * fade;
        const fieldGrad = ctx.createRadialGradient(dot.x, dot.y, 2, dot.x, dot.y, fieldRadius);
        fieldGrad.addColorStop(0, dot.color + hexAlpha(fade * pulse * 60));
        fieldGrad.addColorStop(0.6, dot.color + hexAlpha(fade * 15));
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, fieldRadius, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // bright core
        const coreRadius = 3 * fade + pulse * 1.5;
        const coreGrad = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, coreRadius);
        coreGrad.addColorStop(0, "#ffffff" + hexAlpha(fade * 200));
        coreGrad.addColorStop(0.4, dot.color + hexAlpha(fade * 180));
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw fountains
      for (const fountain of fountainsRef.current) {
        const fAge = (now - fountain.born) / 1000;
        const pulse = 0.6 + 0.3 * Math.sin(time * 3 + fountain.born);

        // glow aura
        const auraGrad = ctx.createRadialGradient(fountain.x, fountain.y, 0, fountain.x, fountain.y, FOUNTAIN_BASE_RADIUS * 3);
        auraGrad.addColorStop(0, fountain.color + hexAlpha(pulse * 100));
        auraGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(fountain.x, fountain.y, FOUNTAIN_BASE_RADIUS * 3, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();

        // upward stream particles (visual only)
        for (let p = 0; p < 5; p++) {
          const t = ((fAge * 2 + p * 0.2) % 1);
          const py = fountain.y - t * 40;
          const px = fountain.x + Math.sin(t * 8 + p) * 4;
          const pAlpha = (1 - t) * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, 2 - t, 0, Math.PI * 2);
          ctx.fillStyle = fountain.color + hexAlpha(pAlpha * 255);
          ctx.fill();
        }

        // base ring
        ctx.beginPath();
        ctx.arc(fountain.x, fountain.y, FOUNTAIN_BASE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = fountain.color + hexAlpha(pulse * 200);
        ctx.lineWidth = 2;
        ctx.stroke();

        // inner bright core
        const coreGrad = ctx.createRadialGradient(fountain.x, fountain.y, 0, fountain.x, fountain.y, FOUNTAIN_BASE_RADIUS * 0.7);
        coreGrad.addColorStop(0, fountain.color + hexAlpha(pulse * 180));
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(fountain.x, fountain.y, FOUNTAIN_BASE_RADIUS * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // draw black hole
      if (blackHoleRef.current) {
        const bh = blackHoleRef.current;
        const bhAge = (now - bh.born) / 1000;
        const horizon = BLACK_HOLE_EVENT_HORIZON + bh.mass * 2;
        const massScale = 1 + bh.mass * 0.08;

        // gravitational field (outer glow — purple void)
        const fieldR = BLACK_HOLE_RANGE * 0.5 * massScale;
        const fieldAlpha = 0.06 + 0.03 * Math.sin(time * 1.5);
        const fieldGrad = ctx.createRadialGradient(bh.x, bh.y, horizon, bh.x, bh.y, fieldR);
        fieldGrad.addColorStop(0, `rgba(120, 40, 200, ${fieldAlpha})`);
        fieldGrad.addColorStop(0.5, `rgba(80, 20, 160, ${fieldAlpha * 0.4})`);
        fieldGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, fieldR, 0, Math.PI * 2);
        ctx.fillStyle = fieldGrad;
        ctx.fill();

        // distortion rings (concentric warping rings)
        for (let ring = 0; ring < 4; ring++) {
          const ringR = horizon * (1.8 + ring * 1.2) * massScale;
          const rot = bhAge * (1.5 - ring * 0.3) * (ring % 2 === 0 ? 1 : -1);
          const ringAlpha = 0.15 - ring * 0.03;
          ctx.save();
          ctx.translate(bh.x, bh.y);
          ctx.rotate(rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, ringR, ringR * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha})`;
          ctx.lineWidth = 2 - ring * 0.3;
          ctx.stroke();
          ctx.restore();
        }

        // orbiting accretion disk dots
        for (const dot of bh.diskDots) {
          dot.angle += dot.speed * 0.02;
          const dx = Math.cos(dot.angle) * dot.dist * massScale;
          const dy = Math.sin(dot.angle) * dot.dist * 0.4 * massScale;
          ctx.beginPath();
          ctx.arc(bh.x + dx, bh.y + dy, dot.radius, 0, Math.PI * 2);
          ctx.fillStyle = dot.color + "cc";
          ctx.fill();
        }

        // photon ring (bright edge)
        const edgePulse = 0.5 + 0.2 * Math.sin(time * 4 + bh.born);
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, horizon * 1.1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${edgePulse})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // event horizon core (deep black with purple rim)
        const coreGrad = ctx.createRadialGradient(bh.x, bh.y, 0, bh.x, bh.y, horizon * 1.3);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.6, "#050008");
        coreGrad.addColorStop(0.85, "rgba(120, 40, 200, 0.25)");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, horizon * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // mass indicator (small bright dot that pulses bigger with more mass)
        if (bh.absorbed > 0) {
          const dotR = 3 + bh.absorbed * 1.5;
          const dotAlpha = 0.4 + 0.3 * Math.sin(time * 6);
          const dotGrad = ctx.createRadialGradient(bh.x, bh.y, 0, bh.x, bh.y, dotR);
          dotGrad.addColorStop(0, `rgba(255, 255, 255, ${dotAlpha})`);
          dotGrad.addColorStop(0.5, `rgba(200, 140, 255, ${dotAlpha * 0.5})`);
          dotGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(bh.x, bh.y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = dotGrad;
          ctx.fill();
        }
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

      // draw tap sparkle particles
      tapSparklesRef.current = tapSparklesRef.current.filter((s) => now - s.born < TAP_SPARKLE_LIFETIME);
      for (const sp of tapSparklesRef.current) {
        const age = now - sp.born;
        const t = age / TAP_SPARKLE_LIFETIME;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        const alpha = (1 - t) * (1 - t); // quadratic fade
        const sz = 2.5 * (1 - t * 0.6);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = sp.color + hexAlpha(alpha * 0.9 * 255);
        ctx.fill();
      }

      // draw tap pulse waves — concentric expanding rings
      tapWavesRef.current = tapWavesRef.current.filter((tw) => now - tw.born < TAP_WAVE_DURATION);
      for (const tw of tapWavesRef.current) {
        const twAge = now - tw.born;
        const twProgress = twAge / TAP_WAVE_DURATION;
        const fadeOut = 1 - twProgress;
        const streakMul = 1 + Math.min(tw.streak, 8) * 0.15;
        const maxR = TAP_WAVE_MAX_RADIUS * streakMul;
        for (let ring = 0; ring < TAP_WAVE_RINGS; ring++) {
          // stagger each ring slightly (each starts a bit later)
          const ringDelay = ring * 0.12;
          const ringProgress = Math.max(0, (twProgress - ringDelay) / (1 - ringDelay));
          if (ringProgress <= 0 || ringProgress >= 1) continue;
          const ringRadius = ringProgress * maxR;
          // ease out — rings slow down as they expand
          const ringAlpha = fadeOut * (1 - ringProgress) * (0.5 - ring * 0.12);
          if (ringAlpha <= 0) continue;
          const ringWidth = (3 - ring * 0.6) * (1 - ringProgress * 0.5) * streakMul;
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = tw.color + hexAlpha(Math.min(ringAlpha, 1) * 255);
          ctx.lineWidth = ringWidth;
          ctx.stroke();
        }
        // soft glow at center that fades quickly
        if (twProgress < 0.3) {
          const glowAlpha = (1 - twProgress / 0.3) * 0.25 * streakMul;
          const glowR = 15 * streakMul;
          const glowGrad = ctx.createRadialGradient(tw.x, tw.y, 0, tw.x, tw.y, glowR);
          glowGrad.addColorStop(0, tw.color + hexAlpha(glowAlpha * 255));
          glowGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }
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

      // draw tilt gravity compass
      if (tiltModeRef.current) {
        const compassR = 22;
        const compassX = W - 44;
        const compassY = 44;
        const gx = tiltVecRef.current.x;
        const gy = tiltVecRef.current.y;
        const gLen = Math.sqrt(gx * gx + gy * gy) || 0.001;

        // Background circle
        ctx.beginPath();
        ctx.arc(compassX, compassY, compassR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Cross-hairs
        ctx.beginPath();
        ctx.moveTo(compassX - compassR * 0.5, compassY);
        ctx.lineTo(compassX + compassR * 0.5, compassY);
        ctx.moveTo(compassX, compassY - compassR * 0.5);
        ctx.lineTo(compassX, compassY + compassR * 0.5);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Arrow showing gravity direction
        const arrowLen = compassR * 0.65 * Math.min(gLen * 1.5, 1);
        const nx = gx / gLen;
        const ny = gy / gLen;
        const arrowTipX = compassX + nx * arrowLen;
        const arrowTipY = compassY + ny * arrowLen;
        ctx.beginPath();
        ctx.moveTo(compassX, compassY);
        ctx.lineTo(arrowTipX, arrowTipY);
        ctx.strokeStyle = "rgba(67, 233, 123, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Arrowhead
        const arrowAngle = Math.atan2(ny, nx);
        ctx.beginPath();
        ctx.moveTo(arrowTipX, arrowTipY);
        ctx.lineTo(arrowTipX - 7 * Math.cos(arrowAngle - 0.5), arrowTipY - 7 * Math.sin(arrowAngle - 0.5));
        ctx.lineTo(arrowTipX - 7 * Math.cos(arrowAngle + 0.5), arrowTipY - 7 * Math.sin(arrowAngle + 0.5));
        ctx.closePath();
        ctx.fillStyle = "rgba(67, 233, 123, 0.85)";
        ctx.fill();

        // Dot at center
        ctx.beginPath();
        ctx.arc(compassX, compassY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();

        ctx.lineCap = "butt";
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

      // draw streak aura around cursor during active streaks
      const currentStreak = streakRef.current;
      if (currentStreak >= 3) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        if (mx > 0 || my > 0) {
          const auraT = Math.min(currentStreak / STREAK_SUPERNOVA, 1);
          const auraRadius = 30 + auraT * 55;
          const pulseSpeed = 200 - currentStreak * 5;
          const pulse = 1 + 0.15 * Math.sin(now / Math.max(pulseSpeed, 80));
          const r = auraRadius * pulse;
          const auraAlpha = 0.08 + auraT * 0.25;
          // color shifts toward next milestone
          let ac;
          if (currentStreak >= 20) ac = "240,147,251";      // purple — supernova incoming
          else if (currentStreak >= 16) ac = "67,233,123";   // green — meteor incoming
          else if (currentStreak >= 12) ac = "79,172,254";   // blue — lightning incoming
          else if (currentStreak >= 8) ac = "250,112,154";   // rose
          else ac = "102,126,234";                            // cool blue
          const aGrad = ctx.createRadialGradient(mx, my, r * 0.6, mx, my, r);
          aGrad.addColorStop(0, `rgba(${ac},0)`);
          aGrad.addColorStop(0.7, `rgba(${ac},${(auraAlpha * 0.5).toFixed(3)})`);
          aGrad.addColorStop(1, `rgba(${ac},0)`);
          ctx.beginPath();
          ctx.arc(mx, my, r, 0, Math.PI * 2);
          ctx.fillStyle = aGrad;
          ctx.fill();
          // rotating arc segments — one per streak count
          const segs = Math.min(currentStreak, STREAK_SUPERNOVA);
          const segAngle = (Math.PI * 2) / segs;
          ctx.strokeStyle = `rgba(${ac},${auraAlpha.toFixed(3)})`;
          ctx.lineWidth = 2;
          for (let i = 0; i < segs; i++) {
            const sa = (now / 1800) + i * segAngle;
            ctx.beginPath();
            ctx.arc(mx, my, r, sa, sa + segAngle * 0.55);
            ctx.stroke();
          }
        }
      }

      // draw combo flash text (floating reward labels)
      comboFlashRef.current = comboFlashRef.current.filter((f) => now - f.born < COMBO_FLASH_DURATION);
      for (const f of comboFlashRef.current) {
        const progress = (now - f.born) / COMBO_FLASH_DURATION;
        const alpha = progress < 0.1 ? progress / 0.1 : 1 - (progress - 0.1) / 0.9;
        const yOff = progress * 70;
        const scale = progress < 0.12 ? 0.4 + (progress / 0.12) * 0.6 : 1;
        const fontSize = Math.round(28 * scale);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillText(f.text, f.x + 1, f.y - yOff + 1);
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y - yOff);
        ctx.restore();
      }

      // draw edge-reactive glow (neon edge lighting on wall bounce)
      wallHitsRef.current = wallHitsRef.current.filter((h) => now - h.born < WALL_HIT_DURATION);
      if (wallHitsRef.current.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const hit of wallHitsRef.current) {
          const progress = (now - hit.born) / WALL_HIT_DURATION;
          const fade = 1 - progress;
          const alpha = fade * 0.45 * hit.intensity;
          // bright point glow at impact
          const pointSize = 25 + progress * 45;
          const pg = ctx.createRadialGradient(hit.x, hit.y, 0, hit.x, hit.y, pointSize);
          pg.addColorStop(0, hit.color + hexAlpha(alpha * 255));
          pg.addColorStop(0.35, hit.color + hexAlpha(alpha * 0.35 * 255));
          pg.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(hit.x, hit.y, pointSize, 0, Math.PI * 2);
          ctx.fillStyle = pg;
          ctx.fill();
          // edge band — light spreads along the wall from impact point
          const bandSpread = (60 + progress * 200) * hit.intensity;
          const bandDepth = 18 + hit.intensity * 22;
          const bandAlpha = fade * fade * 0.3 * hit.intensity;
          const isLeft = hit.x <= 1;
          const isRight = hit.x >= W - 1;
          const isTop = hit.y <= 1;
          const isBottom = hit.y >= H - 1;
          if (isLeft || isRight) {
            const ex = isLeft ? 0 : W;
            const eg = ctx.createLinearGradient(ex, 0, ex + (isLeft ? bandDepth : -bandDepth), 0);
            eg.addColorStop(0, hit.color + hexAlpha(bandAlpha * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(isLeft ? 0 : W - bandDepth, hit.y - bandSpread, bandDepth, bandSpread * 2);
          }
          if (isTop || isBottom) {
            const ey = isTop ? 0 : H;
            const eg = ctx.createLinearGradient(0, ey, 0, ey + (isTop ? bandDepth : -bandDepth));
            eg.addColorStop(0, hit.color + hexAlpha(bandAlpha * 255));
            eg.addColorStop(1, "transparent");
            ctx.fillStyle = eg;
            ctx.fillRect(hit.x - bandSpread, isTop ? 0 : H - bandDepth, bandSpread * 2, bandDepth);
          }
        }
        ctx.restore();
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

      // supernova effect (two-phase: implode then explode)
      if (vortexStormRef.current) {
        const vs = vortexStormRef.current;
        const vsAge = now - vs.born;
        const vsTotalDuration = VORTEX_STORM_SPIRAL_MS + VORTEX_STORM_HOLD_MS + VORTEX_STORM_EXPLODE_MS;

        if (vsAge < VORTEX_STORM_SPIRAL_MS) {
          // Phase 1: Spiral in
          const progress = vsAge / VORTEX_STORM_SPIRAL_MS;
          const force = VORTEX_STORM_SPIRAL_FORCE * (0.5 + progress * 2);
          const tangent = VORTEX_STORM_TANGENT_FORCE * (1 + progress);
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = vs.cx - orb.x;
            const dy = vs.cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            orb.vx += (dx / dist) * force * 0.12;
            orb.vy += (dy / dist) * force * 0.12;
            orb.vx += (-dy / dist) * tangent * 0.08;
            orb.vy += (dx / dist) * tangent * 0.08;
            orb.vx *= 0.96;
            orb.vy *= 0.96;
          }
          shakeRef.current = Math.max(shakeRef.current, 2 + progress * 10);
        } else if (vsAge < VORTEX_STORM_SPIRAL_MS + VORTEX_STORM_HOLD_MS) {
          // Phase 2: Hold at center
          for (const orb of orbs) {
            orb.vx *= 0.85;
            orb.vy *= 0.85;
          }
          shakeRef.current = Math.max(shakeRef.current, 15);
        } else if (vsAge < vsTotalDuration) {
          // Phase 3: Spiral explosion
          if (!vs.exploded) {
            vs.exploded = true;
            for (const orb of orbs) {
              const dx = orb.x - vs.cx;
              const dy = orb.y - vs.cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const speed = VORTEX_STORM_EXPLODE_SPEED + Math.random() * 3;
              orb.vx = (dx / dist) * speed + (-dy / dist) * speed * 0.4;
              orb.vy = (dy / dist) * speed + (dx / dist) * speed * 0.4;
            }
            wavesRef.current.push({
              cx: vs.cx, cy: vs.cy, radius: 0,
              color: "#4facfe", generation: 0,
              hitOrbs: new Set(), delay: 0,
            });
            flashesRef.current.push({
              x: vs.cx, y: vs.cy, color: "#4facfe",
              radius: 50, born: now,
            });
            shakeRef.current = 35;
            playBoom();
          }
        } else {
          vortexStormRef.current = null;
        }

        // Visuals: spinning spiral arms + core glow
        if (vsAge < vsTotalDuration) {
          const progress = Math.min(vsAge / VORTEX_STORM_SPIRAL_MS, 1);
          const fadeOut = vsAge > VORTEX_STORM_SPIRAL_MS + VORTEX_STORM_HOLD_MS
            ? 1 - (vsAge - VORTEX_STORM_SPIRAL_MS - VORTEX_STORM_HOLD_MS) / VORTEX_STORM_EXPLODE_MS
            : 1;
          const rotation = vsAge * 0.004;
          const maxR = Math.min(W, H) * 0.4 * (1 - progress * 0.5);

          for (let arm = 0; arm < VORTEX_STORM_ARM_COUNT; arm++) {
            const armAngle = (Math.PI * 2 * arm) / VORTEX_STORM_ARM_COUNT + rotation;
            ctx.beginPath();
            for (let t = 0; t < 1; t += 0.02) {
              const r = maxR * t;
              const spiralAngle = armAngle + t * 4;
              const sx = vs.cx + Math.cos(spiralAngle) * r;
              const sy = vs.cy + Math.sin(spiralAngle) * r;
              if (t === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            const alpha = Math.max(0, fadeOut) * 0.25 * (1 - progress * 0.3);
            ctx.strokeStyle = `rgba(79, 172, 254, ${alpha})`;
            ctx.lineWidth = 2.5 + progress * 2;
            ctx.lineCap = "round";
            ctx.stroke();
          }

          const coreR = 15 + progress * 40;
          const coreAlpha = Math.max(0, fadeOut) * (0.2 + progress * 0.4);
          const coreGrad = ctx.createRadialGradient(vs.cx, vs.cy, 0, vs.cx, vs.cy, coreR);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
          coreGrad.addColorStop(0.3, `rgba(79, 172, 254, ${coreAlpha * 0.6})`);
          coreGrad.addColorStop(0.6, `rgba(102, 126, 234, ${coreAlpha * 0.3})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(vs.cx, vs.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();
        }
      }

      // ── Tornado ──────────────────────────────────────────────────
      if (tornadoRef.current) {
        const tor = tornadoRef.current;
        const torAge = now - tor.born;
        const torProgress = torAge / TORNADO_DURATION;

        if (torProgress >= 1) {
          tornadoRef.current = null;
        } else {
          // Move tornado across screen
          const startX = tor.dir > 0 ? -60 : W + 60;
          const endX = tor.dir > 0 ? W + 60 : -60;
          tor.x = startX + (endX - startX) * torProgress;
          // Slight vertical wobble
          tor.y = H * 0.55 + Math.sin(torAge * 0.003) * 30;

          // Apply forces to nearby orbs
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = tor.x - orb.x;
            const dy = tor.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < TORNADO_RADIUS && dist > 0) {
              const strength = 1 - dist / TORNADO_RADIUS;
              // Pull inward
              orb.vx += (dx / dist) * TORNADO_PULL * strength;
              orb.vy += (dy / dist) * TORNADO_PULL * strength;
              // Spin tangentially
              orb.vx += (-dy / dist) * TORNADO_SPIN_FORCE * strength;
              orb.vy += (dx / dist) * TORNADO_SPIN_FORCE * strength;
              // Lift upward
              orb.vy -= 0.2 * strength;
              // If very close to center, fling outward
              if (dist < 25) {
                const flingAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
                orb.vx = Math.cos(flingAngle) * TORNADO_FLING_SPEED * (0.6 + Math.random() * 0.8);
                orb.vy = Math.sin(flingAngle) * TORNADO_FLING_SPEED * (0.6 + Math.random() * 0.8);
              }
            }
          }

          // Generate debris particles
          if (tor.debris.length < TORNADO_DEBRIS_MAX && Math.random() < 0.4) {
            const angle = Math.random() * Math.PI * 2;
            tor.debris.push({
              angle,
              dist: 20 + Math.random() * TORNADO_RADIUS * 0.8,
              speed: 2 + Math.random() * 3,
              size: 1 + Math.random() * 2,
              alpha: 0.3 + Math.random() * 0.4,
              born: now,
              lifetime: 800 + Math.random() * 600,
            });
          }
          // Cull old debris
          tor.debris = tor.debris.filter(d => now - d.born < d.lifetime);
          for (const d of tor.debris) {
            d.angle += d.speed * 0.05;
            d.dist *= 0.995;
          }

          shakeRef.current = Math.max(shakeRef.current, 2 + torProgress * 6);

          // ── Tornado visual ──
          const fadeIn = Math.min(torAge / 500, 1);
          const fadeOut = torProgress > 0.85 ? (1 - torProgress) / 0.15 : 1;
          const torAlpha = fadeIn * fadeOut;

          // Funnel: swirling vertical lines, wider at top, narrow at bottom
          const funnelH = 180;
          const topW = 70;
          const bottomW = 15;
          const topY = tor.y - funnelH * 0.7;

          ctx.save();
          for (let fi = 0; fi < 8; fi++) {
            const phase = torAge * 0.006 + (Math.PI * 2 * fi) / 8;
            ctx.beginPath();
            for (let ft = 0; ft <= 1; ft += 0.02) {
              const fy = topY + ft * funnelH;
              const fw = topW * (1 - ft) + bottomW * ft;
              const fx = tor.x + Math.sin(phase + ft * 6) * fw;
              if (ft === 0) ctx.moveTo(fx, fy);
              else ctx.lineTo(fx, fy);
            }
            const lineAlpha = torAlpha * (0.1 + 0.15 * (fi / 8));
            ctx.strokeStyle = `rgba(180, 200, 255, ${lineAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Debris particles
          for (const d of tor.debris) {
            const dAge = now - d.born;
            const dAlpha = d.alpha * torAlpha * (1 - dAge / d.lifetime);
            const px = tor.x + Math.cos(d.angle) * d.dist;
            const py = tor.y + Math.sin(d.angle) * d.dist * 0.5;
            ctx.beginPath();
            ctx.arc(px, py, d.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 200, 255, ${Math.max(0, dAlpha)})`;
            ctx.fill();
          }

          // Core glow
          const coreR = 30 + Math.sin(torAge * 0.01) * 5;
          const torGrad = ctx.createRadialGradient(tor.x, tor.y, 0, tor.x, tor.y, coreR);
          torGrad.addColorStop(0, `rgba(200, 220, 255, ${torAlpha * 0.3})`);
          torGrad.addColorStop(0.5, `rgba(120, 160, 255, ${torAlpha * 0.15})`);
          torGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(tor.x, tor.y, coreR, 0, Math.PI * 2);
          ctx.fillStyle = torGrad;
          ctx.fill();
          ctx.restore();
        }
      }

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

      // ── Pulsar effect (rhythmic pulse waves → detonation) ──

      // ── Implode effect (gravity bomb — pull in then explode out) ──
      if (implodeRef.current) {
        const imp = implodeRef.current;
        const impAge = now - imp.born;

        if (imp.phase === "pull" && impAge < IMPLODE_PULL_MS) {
          const progress = impAge / IMPLODE_PULL_MS;
          const force = IMPLODE_PULL_FORCE * (0.5 + progress * 2);
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = imp.cx - orb.x;
            const dy = imp.cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
            orb.vx *= 0.93;
            orb.vy *= 0.93;
          }

          // Contracting rings
          for (let ri = 0; ri < 3; ri++) {
            const phase = (ri / 3 + progress) % 1;
            const maxR = Math.min(W, H) * 0.45;
            const ringR = maxR * (1 - phase);
            const ringAlpha = (1 - progress) * 0.25 * (1 - phase);
            if (ringAlpha > 0.01 && ringR > 5) {
              ctx.beginPath();
              ctx.arc(imp.cx, imp.cy, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(250, 130, 180, ${ringAlpha})`;
              ctx.lineWidth = 2 + phase * 3;
              ctx.stroke();
            }
          }

          // Growing core glow
          const coreR = 8 + progress * 45;
          const coreGrad = ctx.createRadialGradient(imp.cx, imp.cy, 0, imp.cx, imp.cy, coreR);
          coreGrad.addColorStop(0, `rgba(255, 200, 220, ${0.3 + progress * 0.5})`);
          coreGrad.addColorStop(0.4, `rgba(250, 112, 154, ${progress * 0.3})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(imp.cx, imp.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          shakeRef.current = Math.max(shakeRef.current, 2 + progress * 10);
        } else if (imp.phase === "pull") {
          // Explode: fling all orbs outward from epicenter
          for (const orb of orbs) {
            const dx = orb.x - imp.cx;
            const dy = orb.y - imp.cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            orb.vx = (dx / dist) * (IMPLODE_BURST_SPEED + Math.random() * 3);
            orb.vy = (dy / dist) * (IMPLODE_BURST_SPEED + Math.random() * 3);
          }
          wavesRef.current.push({
            cx: imp.cx, cy: imp.cy, radius: 0,
            color: "#fa709a", generation: 0,
            hitOrbs: new Set(), delay: 0,
          });
          flashesRef.current.push({ x: imp.cx, y: imp.cy, color: "#fa709a", radius: 50, born: now });
          shakeRef.current = 30;
          playBoom();
          implodeRef.current = null;
        }
      }

      // ── Orbit Lock effect ──
      if (orbitLockRef.current) {
        const ol = orbitLockRef.current;
        const olAge = now - ol.born;

        if (ol.phase === "gather") {
          const progress = Math.min(olAge / ORBIT_LOCK_GATHER_MS, 1);
          for (const orb of orbs) {
            if (orb._olRing === undefined) continue;
            const tx = ol.cx + Math.cos(orb._olAngle) * orb._olRadius;
            const ty = ol.cy + Math.sin(orb._olAngle) * orb._olRadius;
            const spring = 0.08 + progress * 0.12;
            orb.vx += (tx - orb.x) * spring;
            orb.vy += (ty - orb.y) * spring;
            orb.vx *= 0.75;
            orb.vy *= 0.75;
          }
          if (olAge >= ORBIT_LOCK_GATHER_MS) {
            ol.phase = "spin";
            ol.spinBorn = now;
          }
        }

        if (ol.phase === "spin") {
          const spinAge = now - ol.spinBorn;
          for (const orb of orbs) {
            if (orb._olRing === undefined) continue;
            const dir = orb._olRing % 2 === 0 ? 1 : -1;
            orb._olAngle += ORBIT_LOCK_SPIN_SPEED * dir * (1 / 60);
            const tx = ol.cx + Math.cos(orb._olAngle) * orb._olRadius;
            const ty = ol.cy + Math.sin(orb._olAngle) * orb._olRadius;
            orb.vx = (tx - orb.x) * 0.3;
            orb.vy = (ty - orb.y) * 0.3;
          }
          if (spinAge >= ORBIT_LOCK_SPIN_MS) {
            ol.phase = "release";
            ol.releaseBorn = now;
            shakeRef.current = 25;
            for (const orb of orbs) {
              if (orb._olRing === undefined) continue;
              const dx = orb.x - ol.cx;
              const dy = orb.y - ol.cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              orb.vx = (dx / dist) * 8;
              orb.vy = (dy / dist) * 8;
              delete orb._olRing;
              delete orb._olAngle;
              delete orb._olRadius;
            }
            wavesRef.current.push({
              cx: ol.cx, cy: ol.cy, radius: 0,
              color: "#43e97b", generation: 0,
              hitOrbs: new Set(), delay: 0,
            });
            playBoom();
          }
        }

        // Ring guides (gather + spin)
        if (ol.phase === "gather" || ol.phase === "spin") {
          const guideAlpha = ol.phase === "gather"
            ? Math.min(olAge / ORBIT_LOCK_GATHER_MS, 1) * 0.2
            : 0.2;
          ctx.setLineDash([4, 8]);
          for (let r = 0; r <= ol.maxRing; r++) {
            const rr = (r + 1) * ORBIT_LOCK_RING_GAP;
            ctx.beginPath();
            ctx.arc(ol.cx, ol.cy, rr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(67, 233, 123, ${guideAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.setLineDash([]);
          const coreGrad = ctx.createRadialGradient(ol.cx, ol.cy, 0, ol.cx, ol.cy, 15);
          coreGrad.addColorStop(0, `rgba(67, 233, 123, ${guideAlpha * 1.5})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(ol.cx, ol.cy, 15, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();
        }

        // Fading rings (release)
        if (ol.phase === "release") {
          const rAge = now - ol.releaseBorn;
          const rProg = rAge / ORBIT_LOCK_RELEASE_MS;
          const rAlpha = (1 - rProg) * 0.35;
          for (let r = 0; r <= ol.maxRing; r++) {
            const rr = (r + 1) * ORBIT_LOCK_RING_GAP * (1 + rProg * 0.3);
            ctx.beginPath();
            ctx.arc(ol.cx, ol.cy, rr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(67, 233, 123, ${rAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          if (rAge >= ORBIT_LOCK_RELEASE_MS) {
            orbitLockRef.current = null;
          }
        }
      }

      // ── Flick aiming line ──
      if (slingshotRef.current && mouseDownRef.current) {
        const sling = slingshotRef.current;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const sdx = mx - sling.startX;
        const sdy = my - sling.startY;
        const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
        const sAngle = Math.atan2(sdy, sdx);
        const sSpeed = Math.min(sDist * 0.12, 18);
        const powerPct = Math.min(sSpeed / 18, 1);

        // Elastic band from start to cursor
        const bandGrad = ctx.createLinearGradient(sling.startX, sling.startY, mx, my);
        bandGrad.addColorStop(0, `rgba(255, 255, 255, 0.6)`);
        bandGrad.addColorStop(1, `rgba(255, 255, 255, 0.2)`);
        ctx.beginPath();
        ctx.moveTo(sling.startX, sling.startY);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = bandGrad;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dotted trajectory extension
        if (sDist > 30) {
          const trajLen = sSpeed * 12;
          const trajEndX = sling.startX + Math.cos(sAngle) * trajLen;
          const trajEndY = sling.startY + Math.sin(sAngle) * trajLen;
          ctx.beginPath();
          ctx.setLineDash([5, 7]);
          ctx.moveTo(mx, my);
          ctx.lineTo(trajEndX, trajEndY);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.18)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Orb preview glow at start position
        const previewR = 10 + Math.min(sDist * 0.03, 8);
        const glowGrad = ctx.createRadialGradient(sling.startX, sling.startY, 0, sling.startX, sling.startY, previewR * 2.5);
        const powerHue = powerPct > 0.7 ? "250, 112, 154" : powerPct > 0.4 ? "254, 180, 123" : "67, 233, 123";
        glowGrad.addColorStop(0, `rgba(${powerHue}, 0.3)`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(sling.startX, sling.startY, previewR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sling.startX, sling.startY, previewR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${powerHue}, 0.2)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Power percentage label
        if (sDist > 30) {
          ctx.save();
          ctx.font = "bold 13px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(${powerHue}, 0.85)`;
          ctx.fillText(Math.round(powerPct * 100) + "%", sling.startX, sling.startY - previewR - 10);
          ctx.restore();
        }
      }

      // ── System energy: total kinetic energy drives atmosphere reactivity ──
      let rawEnergy = 0;
      for (const orb of orbs) {
        const speed2 = orb.vx * orb.vx + orb.vy * orb.vy;
        rawEnergy += orb.radius * speed2;
      }
      const energyTarget = Math.min(rawEnergy / 600, 1);
      systemEnergyRef.current += (energyTarget - systemEnergyRef.current) * 0.03;
      const energy = systemEnergyRef.current;

      // draw vignette overlay for cinematic depth — energy-reactive
      const vignetteAlpha = 0.4 - energy * 0.15;
      const vignetteGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.75);
      vignetteGrad.addColorStop(0, "transparent");
      vignetteGrad.addColorStop(1, `rgba(0, 0, 0, ${vignetteAlpha.toFixed(3)})`);
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, W, H);

      // energy glow: warm ambient light at center during high energy
      if (energy > 0.1) {
        const glowAlpha = (energy - 0.1) * 0.06;
        const glowGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
        glowGrad.addColorStop(0, `rgba(100, 80, 140, ${glowAlpha.toFixed(4)})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // streak energy vignette: colored edge glow during active combos
      const streakLevel = streakRef.current;
      if (streakLevel >= 3) {
        const streakT = Math.min((streakLevel - 3) / 22, 1);
        const pulse = 0.8 + 0.2 * Math.sin(now / Math.max(200 - streakLevel * 6, 80));
        let sr, sg, sb;
        if (streakLevel >= 20) { sr = 240; sg = 147; sb = 251; }
        else if (streakLevel >= 16) { sr = 67; sg = 233; sb = 123; }
        else if (streakLevel >= 12) { sr = 79; sg = 172; sb = 254; }
        else if (streakLevel >= 8) { sr = 250; sg = 112; sb = 154; }
        else { sr = 102; sg = 126; sb = 234; }
        const edgeAlpha = (0.05 + streakT * 0.2) * pulse;
        const edgeGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.7);
        edgeGrad.addColorStop(0, "transparent");
        edgeGrad.addColorStop(1, `rgba(${sr}, ${sg}, ${sb}, ${edgeAlpha.toFixed(3)})`);
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // restore shake transform
      if (shake > 0.5) {
        ctx.restore();
      }

      // ── Cinematic bloom post-process ──
      // Downscale to 1/4 res, blur, composite back with additive blending.
      // Intensity scales with scene energy so explosions bloom dramatically.
      {
        if (!bloomRef.current) {
          bloomRef.current = document.createElement('canvas');
          bloomRef.current._ctx = bloomRef.current.getContext('2d');
        }
        const bc = bloomRef.current;
        const bctx = bc._ctx;
        const bw = Math.ceil(W / 4);
        const bh = Math.ceil(H / 4);
        if (bc.width !== bw) bc.width = bw;
        if (bc.height !== bh) bc.height = bh;
        bctx.clearRect(0, 0, bw, bh);
        bctx.filter = 'blur(4px)';
        bctx.drawImage(canvas, 0, 0, bw, bh);
        bctx.filter = 'none';
        const energy = systemEnergyRef.current;
        const bloomAlpha = 0.06 + energy * 0.16 + Math.min(shake * 0.008, 0.06);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = bloomAlpha;
        ctx.drawImage(bc, 0, 0, W, H);
        ctx.restore();
      }

      // ── Kaleidoscope mirror (post-process) ──
      if (kaleidoscopeModeRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.globalCompositeOperation = 'lighter';
        // horizontal mirror
        ctx.setTransform(-1, 0, 0, 1, W, 0);
        ctx.drawImage(canvas, 0, 0);
        // vertical mirror
        ctx.setTransform(1, 0, 0, -1, 0, H);
        ctx.drawImage(canvas, 0, 0);
        // diagonal mirror (both axes)
        ctx.setTransform(-1, 0, 0, -1, W, H);
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }

      } catch (err) {
        console.error("draw error:", err);
      }
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
      baseSize: 0,      // set below
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: 0, vy: 0,     // reactive velocity from orb pushes
      disturbance: 0,    // 0–1 glow factor when pushed
    }));
    for (const m of motesRef.current) m.baseSize = m.size;
    // generate ambient nebula points
    nebulaRef.current = Array.from({ length: NEBULA_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * NEBULA_DRIFT,
      vy: (Math.random() - 0.5) * NEBULA_DRIFT,
      rgb: NEBULA_COLORS_RGB[i % NEBULA_COLORS_RGB.length],
      radius: NEBULA_BASE_RADIUS + Math.random() * 150,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const handleScatter = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const now = performance.now();
    for (const orb of orbsRef.current) {
      const dx = orb.x - cx;
      const dy = orb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 4 + Math.random() * 4;
      orb.vx += (dx / dist) * strength;
      orb.vy += (dy / dist) * strength;
    }
    // explosion ripple from center
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

  const handleGather = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const now = performance.now();
    for (const orb of orbsRef.current) {
      const dx = cx - orb.x;
      const dy = cy - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 3 + Math.random() * 3;
      orb.vx += (dx / dist) * strength;
      orb.vy += (dy / dist) * strength;
    }
    shakeRef.current = 8;
    ripplesRef.current.push({ x: cx, y: cy, color: "#43e97b", born: now });
    playSwoosh();
  }, []);

  const handleGravity = useCallback(() => {
    const dirs = ["down", "right", "up", "left"];
    if (!gravityRef.current) {
      // off → on (down)
      gravityRef.current = true;
      gravityDirRef.current = "down";
      setGravityOn(true);
    } else {
      const idx = dirs.indexOf(gravityDirRef.current);
      if (idx < dirs.length - 1) {
        // cycle to next direction
        gravityDirRef.current = dirs[idx + 1];
        setGravityOn(true); // force re-render for pill update
      } else {
        // after left → off
        gravityRef.current = false;
        setGravityOn(false);
      }
    }
  }, []);

  const handleFreeze = useCallback(() => {
    setFrozen((prev) => {
      frozenRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleLongExposure = useCallback(() => {
    setLongExposure((prev) => {
      longExposureRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleBarrierMode = useCallback(() => {
    setBarrierMode((prev) => {
      barrierModeRef.current = !prev;
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


  const handleMeshMode = useCallback(() => {
    setMeshMode((prev) => {
      meshModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleFlockingMode = useCallback(() => {
    setFlockingMode((prev) => {
      flockingModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleSparklerMode = useCallback(() => {
    setSparklerMode((prev) => {
      sparklerModeRef.current = !prev;
      return !prev;
    });
  }, []);


  const handleNbodyMode = useCallback(() => {
    setNbodyMode((prev) => {
      nbodyModeRef.current = !prev;
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
    barriersRef.current = [];
    blackHoleRef.current = null;
    setOrbCount(0);
    shakeRef.current = 20;
  }, []);

  const handleSpin = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const dir = Math.random() > 0.5 ? 1 : -1;
    for (const orb of orbsRef.current) {
      const dx = orb.x - cx;
      const dy = orb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 3 + Math.random() * 2;
      // tangential velocity (perpendicular to radial direction)
      orb.vx += (-dy / dist) * strength * dir;
      orb.vy += (dx / dist) * strength * dir;
      // slight inward pull to keep the vortex tight
      orb.vx -= (dx / dist) * 0.5;
      orb.vy -= (dy / dist) * 0.5;
    }
    // visible vortex spiral
    vortexesRef.current.push({
      cx,
      cy,
      born: performance.now(),
      color: randomColor(),
      direction: dir,
    });
    shakeRef.current = Math.max(shakeRef.current, 10);
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

  const handlePulseMode = useCallback(() => {
    setPulseMode((prev) => {
      pulseModeRef.current = !prev;
      if (!prev) pulseTimerRef.current = performance.now();
      return !prev;
    });
  }, []);

  const handleTiltMode = useCallback(() => {
    const next = !tiltModeRef.current;
    tiltModeRef.current = next;
    setTiltMode(next);
    if (next) {
      tiltVecRef.current = { x: 0, y: 1 };
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      }
    }
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

  const handleGravityPulse = useCallback(() => {
    if (orbsRef.current.length < 2) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    for (let i = 0; i < GPULSE_BEATS; i++) {
      const pullStr = GPULSE_PULL_BASE * Math.pow(GPULSE_PULL_GROWTH, i);
      const pushStr = GPULSE_PUSH_BASE * Math.pow(GPULSE_PUSH_GROWTH, i);
      // Pull phase
      setTimeout(() => {
        const now = performance.now();
        for (const orb of orbsRef.current) {
          const dx = cx - orb.x;
          const dy = cy - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          orb.vx += (dx / dist) * pullStr;
          orb.vy += (dy / dist) * pullStr;
        }
        ripplesRef.current.push({ x: cx, y: cy, color: "#4facfe", born: now });
        shakeRef.current = 4 + i * 3;
        playSwoosh();
      }, i * GPULSE_INTERVAL);
      // Push phase
      setTimeout(() => {
        const now = performance.now();
        for (const orb of orbsRef.current) {
          const dx = orb.x - cx;
          const dy = orb.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          orb.vx += (dx / dist) * pushStr;
          orb.vy += (dy / dist) * pushStr;
        }
        ripplesRef.current.push({ x: cx, y: cy, color: "#f093fb", born: now });
        if (i === GPULSE_BEATS - 1) {
          // Final beat: big shockwave
          wavesRef.current.push({
            cx, cy, radius: 0, color: "#f093fb",
            generation: 0, hitOrbs: new Set(), delay: 0,
          });
          shakeRef.current = 20;
          playBoom();
        }
      }, i * GPULSE_INTERVAL + GPULSE_PULL_MS);
    }
  }, []);

  const handleKaleidoscopeMode = useCallback(() => {
    setKaleidoscopeMode((prev) => {
      kaleidoscopeModeRef.current = !prev;
      return !prev;
    });
  }, []);


  const handleWrapMode = useCallback(() => {
    setWrapMode((prev) => {
      wrapModeRef.current = !prev;
      return !prev;
    });
  }, []);


  const handleAutoplay = useCallback(() => {
    setAutoPlay((prev) => {
      autoplayModeRef.current = !prev;
      if (!prev) {
        // reset timers when enabling
        autoplayTimersRef.current = { lastSpawn: performance.now(), lastEffect: performance.now() + 1500 };
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

  const handleCyclePalette = useCallback(() => {
    setPaletteIndex(prev => {
      const next = (prev + 1) % PALETTES.length;
      const palette = PALETTES[next];
      // Mutate COLORS array in place so all modules see the change
      COLORS.length = 0;
      COLORS.push(...palette.colors);
      // Mutate NEBULA_COLORS_RGB in place
      NEBULA_COLORS_RGB.length = 0;
      NEBULA_COLORS_RGB.push(...palette.nebula);
      // Recolor existing orbs
      for (const orb of orbsRef.current) {
        orb.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      // Recolor motes
      for (const m of motesRef.current) {
        m.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      return next;
    });
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
    const count = 10;
    const now = performance.now();
    const burstColor = randomColor();

    // Ascending rocket trail — embers from ground to peak
    for (let t = 0; t < 14; t++) {
      const frac = t / 14;
      embersRef.current.push({
        x: launchX + (Math.random() - 0.5) * 4,
        y: H - (H - peakY) * frac,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 2,
        born: now - (14 - t) * 40, // stagger so they fade bottom-to-top
      });
    }

    // Burst orbs from peak position
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      const orb = createOrb(launchX, peakY);
      orb.radius = 5 + Math.random() * 6;
      orb.vx = Math.cos(angle) * speed;
      orb.vy = Math.sin(angle) * speed;
      orbsRef.current.push(orb);
    }

    // Flash + ripple at burst point
    ripplesRef.current.push({ x: launchX, y: peakY, color: burstColor, born: now });
    flashesRef.current.push({ x: launchX, y: peakY, color: burstColor, radius: 30, born: now });

    setOrbCount(orbsRef.current.length);
    shakeRef.current = 10;
    playBurstSound();
  }, []);

  const handleEruption = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H - 10;
    const now = performance.now();

    // Launch orbs upward from screen bottom
    for (let i = 0; i < ERUPTION_COUNT; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * ERUPTION_SPREAD;
      const speed = ERUPTION_SPEED_MIN + Math.random() * (ERUPTION_SPEED_MAX - ERUPTION_SPEED_MIN);
      const orb = createOrb(cx + (Math.random() - 0.5) * 50, cy);
      orb.vx = Math.cos(angle) * speed;
      orb.vy = Math.sin(angle) * speed;
      orb.radius = 5 + Math.random() * 8;
      orbsRef.current.push(orb);
    }

    // Ember trail at eruption base
    for (let i = 0; i < ERUPTION_EMBER_COUNT; i++) {
      embersRef.current.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy - Math.random() * 30,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1 + Math.random() * 3),
        size: 1.5 + Math.random() * 2.5,
        born: now - Math.random() * 200,
      });
    }

    // Ripple + flash at base
    ripplesRef.current.push({ x: cx, y: cy, color: "#fa709a", born: now });
    ripplesRef.current.push({ x: cx, y: cy, color: "#feb47b", born: now + 80 });
    flashesRef.current.push({ x: cx, y: cy, color: "#feb47b", radius: 50, born: now });

    setOrbCount(orbsRef.current.length);
    shakeRef.current = 18;
    playBurstSound();
    playBoom();
  }, []);

  const handleCascade = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();
    const currentOrbs = [...orbs];
    const newOrbs = [];
    for (const o of currentOrbs) {
      const baseAngle = Math.random() * Math.PI * 2;
      for (let i = 0; i < 2; i++) {
        const angle = baseAngle + (Math.PI * 2 * (i + 1)) / 3;
        const spd = 3 + Math.random() * 4;
        const child = createOrb(o.x, o.y);
        child.radius = Math.max(4, o.radius * 0.6);
        child.color = o.color;
        child.vx = o.vx * 0.5 + Math.cos(angle) * spd;
        child.vy = o.vy * 0.5 + Math.sin(angle) * spd;
        newOrbs.push(child);
        ripplesRef.current.push({ x: o.x, y: o.y, color: o.color, born: now });
      }
      o.vx += Math.cos(baseAngle) * 4;
      o.vy += Math.sin(baseAngle) * 4;
      o.radius = Math.max(4, o.radius * 0.6);
    }
    orbsRef.current.push(...newOrbs);
    wavesRef.current.push({ cx: W / 2, cy: H / 2, radius: 0, color: "#f093fb", generation: 0, hitOrbs: new Set(), delay: 0 });
    wavesRef.current.push({ cx: W / 2, cy: H / 2, radius: 0, color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 4 });
    shakeRef.current = Math.max(shakeRef.current, 25);
    setOrbCount(orbsRef.current.length);
    playBoom();
  }, []);

  const handleRicochet = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const margin = 5;

    // Start from a random edge with an inward angle
    const edge = Math.floor(Math.random() * 4);
    let x, y, dvx, dvy;
    if (edge === 0) { // left
      x = margin; y = H * 0.2 + Math.random() * H * 0.6;
      const a = -0.4 + Math.random() * 0.8;
      dvx = Math.cos(a); dvy = Math.sin(a);
    } else if (edge === 1) { // right
      x = W - margin; y = H * 0.2 + Math.random() * H * 0.6;
      const a = Math.PI - 0.4 + Math.random() * 0.8;
      dvx = Math.cos(a); dvy = Math.sin(a);
    } else if (edge === 2) { // top
      x = W * 0.2 + Math.random() * W * 0.6; y = margin;
      const a = Math.PI / 2 - 0.4 + Math.random() * 0.8;
      dvx = Math.cos(a); dvy = Math.sin(a);
    } else { // bottom
      x = W * 0.2 + Math.random() * W * 0.6; y = H - margin;
      const a = -Math.PI / 2 - 0.4 + Math.random() * 0.8;
      dvx = Math.cos(a); dvy = Math.sin(a);
    }

    // Pre-calculate bounce points via ray casting
    const points = [{ x, y }];
    let cx = x, cy = y;
    for (let bounce = 0; bounce < 6; bounce++) {
      const tLeft = dvx < 0 ? (margin - cx) / dvx : Infinity;
      const tRight = dvx > 0 ? (W - margin - cx) / dvx : Infinity;
      const tTop = dvy < 0 ? (margin - cy) / dvy : Infinity;
      const tBottom = dvy > 0 ? (H - margin - cy) / dvy : Infinity;
      const t = Math.min(tLeft, tRight, tTop, tBottom);
      if (!isFinite(t) || t <= 0) break;
      cx += dvx * t;
      cy += dvy * t;
      if (t === tLeft || t === tRight) dvx = -dvx;
      else dvy = -dvy;
      points.push({ x: cx, y: cy });
    }

    // Stagger bursts at each bounce point with lightning connectors
    points.forEach((pt, i) => {
      setTimeout(() => {
        const isLast = i === points.length - 1;
        const count = isLast ? 6 : 3;
        for (let j = 0; j < count; j++) {
          const a = (Math.PI * 2 * j) / count + Math.random() * 0.4;
          const speed = isLast ? 3 + Math.random() * 4 : 1.5 + Math.random() * 2.5;
          const orb = createOrb(pt.x, pt.y);
          orb.radius = isLast ? 6 + Math.random() * 7 : 4 + Math.random() * 5;
          orb.vx = Math.cos(a) * speed;
          orb.vy = Math.sin(a) * speed;
          orbsRef.current.push(orb);
        }
        setOrbCount(orbsRef.current.length);
        const now = performance.now();
        ripplesRef.current.push({ x: pt.x, y: pt.y, color: randomColor(), born: now });

        // Draw lightning bolt connecting to previous bounce point
        if (i > 0) {
          const prev = points[i - 1];
          lightningRef.current.push({
            bolts: [generateBolt(prev.x, prev.y, pt.x, pt.y)],
            sparks: [],
            born: now,
          });
        }

        shakeRef.current = Math.max(shakeRef.current, isLast ? 14 : 6);
        playBurstSound();
      }, i * 150);
    });
  }, []);


  const handleToggleAudio = useCallback(() => {
    try {
      setAudioEnabled((prev) => {
        setAudioMuted(prev);
        return !prev;
      });
    } catch (err) {
      console.error("handleToggleAudio error:", err);
    }
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
      spinDir: Math.random() < 0.5 ? 1 : -1,
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

  const handleImplode = useCallback(() => {
    if (implodeRef.current) return;
    if (orbsRef.current.length < 2) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    implodeRef.current = { cx, cy, born: performance.now(), phase: "pull" };
    playSwoosh();
  }, []);

  const handleOrbitLock = useCallback(() => {
    if (orbitLockRef.current) return;
    const orbs = orbsRef.current;
    if (orbs.length < 3) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    let idx = 0, ring = 0, maxRing = 0;
    while (idx < orbs.length) {
      const capacity = 6 + ring * 6;
      const count = Math.min(capacity, orbs.length - idx);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        orbs[idx]._olRing = ring;
        orbs[idx]._olAngle = angle;
        orbs[idx]._olRadius = (ring + 1) * ORBIT_LOCK_RING_GAP;
        idx++;
      }
      maxRing = ring;
      ring++;
    }
    orbitLockRef.current = {
      born: performance.now(), phase: "gather",
      cx, cy, maxRing, spinBorn: null, releaseBorn: null,
    };
    playGalaxySound();
  }, []);

  const handleComet = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const edge = Math.floor(Math.random() * 4);
    let startX, startY, angle;
    switch (edge) {
      case 0: startX = W * 0.1 + Math.random() * W * 0.8; startY = -20;
        angle = Math.PI * 0.25 + Math.random() * Math.PI * 0.5; break;
      case 1: startX = W + 20; startY = H * 0.1 + Math.random() * H * 0.8;
        angle = Math.PI * 0.75 + Math.random() * Math.PI * 0.5; break;
      case 2: startX = W * 0.1 + Math.random() * W * 0.8; startY = H + 20;
        angle = -Math.PI * 0.75 + Math.random() * Math.PI * 0.5; break;
      default: startX = -20; startY = H * 0.1 + Math.random() * H * 0.8;
        angle = -Math.PI * 0.25 + Math.random() * Math.PI * 0.5; break;
    }
    cometsRef.current.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * COMET_SPEED,
      vy: Math.sin(angle) * COMET_SPEED,
      color: randomColor(),
      born: performance.now(),
      lastSpawn: performance.now(),
      spawned: 0,
      trail: [],
    });
    shakeRef.current = 6;
    playCometSound();
  }, []);

  const handleBlackHole = useCallback(() => {
    // toggle: if one exists, remove it
    if (blackHoleRef.current) {
      const bh = blackHoleRef.current;
      // dismiss with burst particles
      const now = performance.now();
      for (let i = 0; i < BURST_PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / BURST_PARTICLE_COUNT;
        burstsRef.current.push({
          x: bh.x, y: bh.y,
          vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2,
          color: "#a855f7", radius: 3, born: now,
        });
      }
      blackHoleRef.current = null;
      shakeRef.current = 8;
      return;
    }
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    // seed with a few initial disk dots
    const dots = [];
    for (let i = 0; i < BLACK_HOLE_DISK_DOTS; i++) {
      dots.push({
        angle: (Math.PI * 2 * i) / BLACK_HOLE_DISK_DOTS,
        dist: 18 + Math.random() * 30,
        speed: 1.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: 1.5 + Math.random() * 1.5,
      });
    }
    blackHoleRef.current = {
      x: cx, y: cy,
      born: performance.now(),
      absorbed: 0,
      mass: 0,
      diskDots: dots,
    };
    ripplesRef.current.push({ x: cx, y: cy, color: "#a855f7", born: performance.now() });
    shakeRef.current = 12;
    playBlackHoleSound();
  }, []);


  const handleRandomEffect = useCallback(() => {
    const orbs = orbsRef.current;
    const alwaysAvailable = [
      [handleBurst, "BURST"], [handleMeteorShower, "METEOR SHOWER"], [handleFirework, "FIREWORK"],
      [handleRicochet, "RICOCHET"], [handleEruption, "ERUPTION"],
    ];
    const needsOrbs = [
      [handleWave, "SHOCKWAVE"], [handleLightning, "LIGHTNING"], [handleScatter, "SCATTER"],
      [handleSpin, "SPIN"], [handleGather, "GATHER"], [handleSupernova, "SUPERNOVA"],
      [handleCascade, "CASCADE"], [handleOrbitLock, "ORBIT LOCK"],
      [handleImplode, "IMPLODE"], [handleBlackHole, "BLACK HOLE"],
      [handleGravityPulse, "GRAVITY PULSE"],
    ];
    const pool = orbs.length > 0 ? [...alwaysAvailable, ...needsOrbs] : alwaysAvailable;
    const [fn, label] = pool[Math.floor(Math.random() * pool.length)];
    fn();
    const W = window.innerWidth;
    const H = window.innerHeight;
    comboFlashRef.current.push({ text: label, x: W / 2, y: H / 2, born: performance.now(), color: "#f093fb" });
  }, [handleBurst, handleMeteorShower, handleFirework, handleRicochet, handleEruption, handleWave, handleLightning, handleScatter, handleSpin, handleGather, handleSupernova, handleCascade, handleOrbitLock, handleImplode, handleGravityPulse]);

  const handleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  const handleSaveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 400);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbs-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const flashLabel = (text, color) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      comboFlashRef.current.push({ text, x: W / 2, y: H / 2, born: performance.now(), color });
    };
    const handleKey = (e) => {
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          handleFreeze();
          flashLabel(frozenRef.current ? "UNFREEZE" : "FREEZE", "#4facfe");
          break;
        case "g":
          handleGravity();
          break;
        case "s":
          handleScatter();
          flashLabel("SCATTER", "#fa709a");
          break;
        case "c":
          handleGather();
          flashLabel("GATHER", "#43e97b");
          break;
        case "r":
          handleSpin();
          flashLabel("SPIN", "#f093fb");
          break;
        case "b":
          handleBurst();
          flashLabel("BURST", "#667eea");
          break;
        case "w":
          handleWave();
          flashLabel("SHOCKWAVE", "#4facfe");
          break;
        case "x":
          handleClearAll();
          flashLabel("CLEAR", "#fa709a");
          break;
        case "p":
          handlePaintMode();
          break;
        case "h":
          handleShuffle();
          flashLabel("SHUFFLE", "#feb47b");
          break;
        case "m":
          handleSlowMo();
          break;
        case "f":
          handleFirework();
          flashLabel("FIREWORK", "#fa709a");
          break;
        case "d":
          handleRepelMode();
          break;
        case "o":
          handleOrbitMode();
          break;
        case "a":
          handleAttractMode();
          break;
        case "n":
          handlePlaceWell();
          flashLabel("GRAVITY WELL", "#43e97b");
          break;
        case "l":
          handleLightning();
          flashLabel("LIGHTNING", "#4facfe");
          break;
        case "q":
          handleMeteorShower();
          flashLabel("METEOR SHOWER", "#43e97b");
          break;
        case "e":
          handleSupernova();
          flashLabel("SUPERNOVA", "#f093fb");
          break;
        case "v":
          handleToggleAudio();
          break;
        case "z":
          handleAutoPlay();
          break;
        case "k":
          handleSaveCanvas();
          break;
        case "j":
          handleLongExposure();
          break;
        case "y":
          handleCyclePalette();
          flashLabel(PALETTES[(paletteIndex + 1) % PALETTES.length].name.toUpperCase(), "#f093fb");
          break;
        case "1":
          handleRandomEffect();
          break;
        case "u":
          handleMeshMode();
          break;
        case "8":
          handleFlockingMode();
          break;
        case "i":
          handleKaleidoscopeMode();
          break;
        case "?":
          setShowHelp((prev) => !prev);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleFreeze, handleGravity, handleScatter, handleGather, handleSpin, handleBurst, handleWave, handleClearAll, handlePaintMode, handleShuffle, handleSlowMo, handleFirework, handleRepelMode, handleOrbitMode, handleAttractMode, handlePlaceWell, handleLightning, handleMeteorShower, handleSupernova, handleBlackHole, handleToggleAudio, handleAutoPlay, handleSaveCanvas, handleLongExposure, handleCyclePalette, handleRandomEffect, handleBarrierMode, handleCascade, handleOrbitLock, handleImplode, handleRicochet, handleGravityPulse, handleEruption, handleMeshMode, handleFlockingMode, handleKaleidoscopeMode, paletteIndex, setShowHelp]);

  // ── Autoplay timer ──
  useEffect(() => {
    if (!autoPlay) return;
    let timeoutId;
    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 2500;
      timeoutId = setTimeout(() => {
        if (orbsRef.current.length < 5) {
          handleBurst();
        } else {
          handleRandomEffect();
        }
        scheduleNext();
      }, delay);
    };
    if (orbsRef.current.length === 0) handleBurst();
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [autoPlay, handleRandomEffect, handleBurst]);

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
        onTouchEnd={(e) => { handleUp(e); mouseRef.current = { ...mouseRef.current, onCanvas: false }; }}
        onMouseEnter={() => { mouseRef.current = { ...mouseRef.current, onCanvas: true }; }}
        onMouseLeave={() => { mouseRef.current = { ...mouseRef.current, onCanvas: false }; }}
      />
      <HUD>
        <Title>Automatic Software</Title>
        <Hint>tap to create &middot; hold to attract &middot; drag to launch &middot; double-tap to orbit or remove &middot; right-click to split &middot; rapid taps unlock combos</Hint>
        <Count>{orbCount} orb{orbCount !== 1 ? "s" : ""}</Count>
        {streakDisplay >= 2 && (
          <>
            <StreakCounter key={streakDisplay} $streak={streakDisplay}>
              {streakDisplay}x
            </StreakCounter>
            <NextCombo key={`next-${streakDisplay}`}>
              {streakDisplay < 5 ? "5x shockwave" :
               streakDisplay < 8 ? "8x spin" :
               streakDisplay < 12 ? `${STREAK_FIREWORK}x firework` :
               streakDisplay < 16 ? `${STREAK_LIGHTNING}x lightning` :
               streakDisplay < 20 ? `${STREAK_METEOR}x meteors` :
               streakDisplay < 25 ? `${STREAK_SUPERNOVA}x supernova` :
               streakDisplay < 30 ? `${STREAK_CASCADE}x cascade` :
               streakDisplay < 35 ? `${STREAK_STARFALL}x starfall` :
               streakDisplay < 40 ? `${STREAK_SUPERMASSIVE}x supermassive` :
               "MAX COMBO"}
            </NextCombo>
          </>
        )}
        <ModeIndicators>
          {frozen && <ModePill $color="#4facfe">frozen</ModePill>}
          {gravityOn && <ModePill $color="#43e97b">gravity {gravityDirRef.current === "down" ? "↓" : gravityDirRef.current === "up" ? "↑" : gravityDirRef.current === "right" ? "→" : "←"}</ModePill>}
          {orbitMode && <ModePill $color="#f093fb">orbit</ModePill>}
          {repelMode && <ModePill $color="#fa709a">repel</ModePill>}
          {attractMode && <ModePill $color="#f093fb">magnet</ModePill>}
          {paintMode && <ModePill $color="#feb47b">paint</ModePill>}
          {barrierMode && <ModePill $color="#4facfe">walls</ModePill>}
          {slowMo && <ModePill $color="#00f2fe">slow-mo</ModePill>}
          {longExposure && <ModePill $color="#feb47b">long exposure</ModePill>}
          {autoPlay && <ModePill $color="#43e97b">autoplay</ModePill>}
          {kaleidoscopeMode && <ModePill $color="#00f2fe">kaleidoscope</ModePill>}
          {paletteIndex !== 0 && <ModePill $color="#f093fb">{PALETTES[paletteIndex].name.toLowerCase()}</ModePill>}
        </ModeIndicators>
      </HUD>
      <ButtonGroup>
        <ButtonRow>
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
          {orbCount > 0 && (
            <>
            <ActionButton onClick={handleShuffle} title="Shuffle colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
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
            <ActionButton onClick={handleGather} title="Gather orbs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="10" y2="10" />
                <line x1="20" y1="4" x2="14" y2="10" />
                <line x1="4" y1="20" x2="10" y2="14" />
                <line x1="20" y1="20" x2="14" y2="14" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </ActionButton>
<ActionButton onClick={handleSpin} title="Spin orbs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            </ActionButton>
            <ActionButton onClick={() => { handlePlaceWell(); }} title="Place gravity well">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="7" opacity="0.5" />
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <line x1="12" y1="1" x2="12" y2="4" opacity="0.4" />
                <line x1="12" y1="20" x2="12" y2="23" opacity="0.4" />
                <line x1="1" y1="12" x2="4" y2="12" opacity="0.4" />
                <line x1="20" y1="12" x2="23" y2="12" opacity="0.4" />
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
        </ButtonRow>
        </ButtonGroup>
      <ModeStrip>
        <ModeToggle onClick={handleSlowMo} $active={slowMo} $color="#00f2fe" title="Slow motion">
          slow-mo
        </ModeToggle>
        <ModeToggle onClick={handleGravity} $active={gravityOn} $color="#43e97b" title="Toggle gravity">
          gravity
        </ModeToggle>
        <ModeToggle onClick={handleRepelMode} $active={repelMode} $color="#fa709a" title="Repel mode">
          repel
        </ModeToggle>
        <ModeToggle onClick={handleOrbitMode} $active={orbitMode} $color="#764ba2" title="Orbit mode">
          orbit
        </ModeToggle>
        <ModeToggle onClick={handlePaintMode} $active={paintMode} $color="#feb47b" title="Paint mode">
          paint
        </ModeToggle>
        <ModeToggle onClick={handleCyclePalette} $active={paletteIndex !== 0} $color="#f093fb" title="Cycle color palette (Y)">
          {PALETTES[paletteIndex].name.toLowerCase()}
        </ModeToggle>
        <ModeToggle onClick={handleKaleidoscopeMode} $active={kaleidoscopeMode} $color="#00f2fe" title="Kaleidoscope mirror (I)">
          mirror
        </ModeToggle>
      </ModeStrip>
      {saveFlash && <SaveFlash />}
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
              <Shortcut><Key>dbl-click</Key><span>Burst (empty) / remove (orb)</span></Shortcut>
              <Shortcut><Key>hold</Key><span>Attract orbs (release to burst)</span></Shortcut>
              <Shortcut><Key>right-click</Key><span>Split orb</span></Shortcut>
              <Shortcut><Key>long-press</Key><span>Split orb (mobile)</span></Shortcut>
              <Shortcut><Key>overlap</Key><span>Merge (big ones split!)</span></Shortcut>
              <hr />
              <Shortcut><Key>B</Key><span>Burst spawn</span></Shortcut>
              <Shortcut><Key>Q</Key><span>Meteor shower</span></Shortcut>
              <Shortcut><Key>E</Key><span>Supernova (implode + explode)</span></Shortcut>
              <Shortcut><Key>1</Key><span>Random effect (surprise!)</span></Shortcut>
              <Shortcut><Key>F</Key><span>Firework</span></Shortcut>
              <Shortcut><Key>C</Key><span>Gather to center</span></Shortcut>
              <Shortcut><Key>S</Key><span>Scatter outward</span></Shortcut>
              <Shortcut><Key>R</Key><span>Spin / vortex</span></Shortcut>
              <Shortcut><Key>W</Key><span>Shockwave</span></Shortcut>
              <Shortcut><Key>L</Key><span>Chain lightning</span></Shortcut>
              <Shortcut><Key>H</Key><span>Shuffle colors</span></Shortcut>
              <Shortcut><Key>G</Key><span>Cycle gravity (↓ → ↑ ← off)</span></Shortcut>
              <Shortcut><Key>D</Key><span>Repel mode</span></Shortcut>
              <Shortcut><Key>A</Key><span>Attract mode</span></Shortcut>
              <Shortcut><Key>O</Key><span>Orbit mode</span></Shortcut>
              <Shortcut><Key>N</Key><span>Place / remove gravity well</span></Shortcut>
              <Shortcut><Key>P</Key><span>Paint mode</span></Shortcut>
              <Shortcut><Key>Y</Key><span>Cycle color palette</span></Shortcut>
              <Shortcut><Key>M</Key><span>Slow motion</span></Shortcut>
              <Shortcut><Key>Space</Key><span>Freeze / unfreeze</span></Shortcut>
              <Shortcut><Key>I</Key><span>Kaleidoscope mirror</span></Shortcut>
              <Shortcut><Key>J</Key><span>Long exposure (trail mode)</span></Shortcut>
              <Shortcut><Key>Z</Key><span>Autoplay (ambient mode)</span></Shortcut>
              <Shortcut><Key>K</Key><span>Save screenshot</span></Shortcut>
              <Shortcut><Key>V</Key><span>Toggle sound</span></Shortcut>
              <Shortcut><Key>X</Key><span>Clear all orbs</span></Shortcut>
              <Shortcut><Key>rapid taps</Key><span>Streak combos unlock effects at 5×, 12×, 20×, 25×...</span></Shortcut>
              <Shortcut><Key>?</Key><span>Toggle this help</span></Shortcut>
            </ShortcutList>
            <HelpClose onClick={() => setShowHelp(false)}>Got it</HelpClose>
          </HelpPanel>
        </HelpOverlay>
      )}
    </Wrapper>
  );
}

export default App;
