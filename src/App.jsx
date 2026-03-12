import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  RIPPLE_DURATION, BURST_DURATION, BURST_PARTICLE_COUNT, COLORS, CONNECTION_DIST,
  MERGE_DIST_FACTOR, MERGE_FLASH_DURATION, STAR_COUNT, SHOOTING_STAR_CHANCE,
  SHOOTING_STAR_DURATION, MOTE_COUNT, MOTE_SPEED, MOTE_ORB_PUSH_RANGE,
  MOTE_ORB_PUSH_FORCE, MOTE_FRICTION, MOTE_DISTURBED_GLOW, SPLIT_COUNT,
  LONG_PRESS_MS, FRICTION, REPEL_DIST, REPEL_FORCE, ATTRACT_DIST, ATTRACT_FORCE, COLOR_AFFINITY_DIST, COLOR_AFFINITY_FORCE,
  GRAVITY, WAVE_SPEED, WAVE_FORCE, WAVE_WIDTH, WAVE_MAX_RADIUS_FACTOR,
  WALL_HIT_DURATION, WALL_HIT_SPEED_THRESHOLD, WALL_SHATTER_SPEED, WALL_SHATTER_CHILD_SCALE, WALL_SHATTER_MIN_RADIUS, WALL_SHATTER_ORB_CAP, WALL_SHATTER_COOLDOWN,
  WELL_RANGE, WELL_GRAVITY, WELL_CRITICAL_MASS, WELL_CRITICAL_MS, WELL_CRITICAL_SCATTER,
  TRAIL_SPEED_THRESHOLD, TRAIL_LIFETIME, TRAIL_MAX, TRAIL_SPAWN_RATE,
  HOLD_CHARGE_DELAY, HOLD_CHARGE_RANGE, HOLD_CHARGE_FORCE, HOLD_CHARGE_MAX_MS,
  CASCADE_MAX_GEN, CASCADE_SPEED_THRESHOLD, CASCADE_FORCE_DECAY, CASCADE_DELAY_FRAMES,
  TAP_IMPULSE_RADIUS, TAP_IMPULSE_FORCE, COLLAPSE_RADIUS, MITOSIS_WOBBLE_START,
  ENERGY_PER_TAP, ENERGY_STREAK_BONUS, ENERGY_PER_EFFECT, ENERGY_DRAIN,
  ENERGY_BAR_HEIGHT, ENERGY_GLOW_HEIGHT,
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
  DOUBLE_TAP_WINDOW, DOUBLE_TAP_RADIUS, DOUBLE_TAP_BURST_COUNT, DOUBLE_TAP_BURST_SPEED,
  STREAK_WINDOW, STREAK_DECAY_DELAY, STREAK_FIREWORK, STREAK_LIGHTNING,
  STREAK_METEOR, STREAK_SUPERNOVA, STREAK_CASCADE, COMBO_FLASH_DURATION,
  STREAK_SUPERMASSIVE, STREAK_NOVA_CHAIN, NOVA_CHAIN_DELAY,
  STRIKE_BEAM_MS, STRIKE_FADE_MS, STRIKE_ORB_COUNT, STRIKE_ORB_SPEED, STRIKE_BEAM_WIDTH,
  IGNITE_SPREAD_DIST, IGNITE_BURN_MS, IGNITE_SPARK_COUNT, IGNITE_SPARK_SPEED,
  IGNITE_SPREAD_CHANCE, EMBER_LIFETIME,
  STORM_DURATION, STORM_ZAP_INTERVAL, STORM_SPIN_FORCE, STORM_RADIAL_FORCE, STORM_ARC_COUNT,
  BOUNCE_RESTITUTION, BOUNCE_SPARK_COUNT, BOUNCE_SPARK_SPEED, BOUNCE_SPARK_LIFETIME,
  BOUNCE_SPARK_SIZE, BOUNCE_SHAKE_THRESHOLD, BOUNCE_SHAKE_INTENSITY,
  IMPACT_NUM_DURATION, IMPACT_NUM_RISE, IMPACT_NUM_MIN_SPEED,
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
  TIDAL_PERIOD, TIDAL_FORCE, TIDAL_DAMPING,
  SWIRL_FORCE, SWIRL_INWARD, SWIRL_SPEED_CAP,
  GALAXY_SPIRAL_MS, GALAXY_SPIN_MS, GALAXY_EXPLODE_MS, GALAXY_ARM_COUNT,
  GALAXY_PULL_FORCE, GALAXY_SPIN_ACCEL, GALAXY_MAX_SPIN, GALAXY_DAMPING,
  GALAXY_EXPLODE_SPEED, GALAXY_RING_COUNT,
  RAIN_SPAWN_INTERVAL, RAIN_ORB_CAP, RAIN_SPEED_MIN, RAIN_SPEED_MAX, RAIN_DRIFT,
  WAVE_FEAR_RANGE, WAVE_FEAR_FORCE,
  EDGE_GLOW_RANGE, EDGE_GLOW_DEPTH, EDGE_GLOW_ALPHA,
  TIDE_SPEED, TIDE_FORCE, TIDE_WIDTH, TIDE_SINE_AMP, TIDE_SINE_FREQ,
  IDLE_DRIFT_DELAY, IDLE_DRIFT_INTERVAL, IDLE_DRIFT_MAX, IDLE_DRIFT_SPEED,
  VELOCITY_STRETCH_THRESHOLD, VELOCITY_STRETCH_MAX, VELOCITY_STRETCH_RAMP,
  LENS_ORB_MIN_RADIUS, LENS_ORB_RANGE_FACTOR, LENS_ORB_STRENGTH,
  LENS_WELL_RANGE, LENS_WELL_STRENGTH,
  LENS_BH_RANGE, LENS_BH_STRENGTH,
  LENS_HOLD_RANGE, LENS_HOLD_STRENGTH,
  VOLATILE_POP_CHANCE, VOLATILE_MIN_RADIUS, VOLATILE_FRAG_COUNT, VOLATILE_FRAG_SPEED,
  FISSION_SPEED_THRESHOLD, FISSION_MIN_RADIUS, FISSION_FRAG_COUNT, FISSION_COOLDOWN,
  SCORCH_DURATION, SCORCH_MAX, SCORCH_SPEED_MIN, SCORCH_RADIUS_MIN, SCORCH_RADIUS_MAX,
  MAELSTROM_SPIRAL_MS, MAELSTROM_RELEASE_MS, MAELSTROM_PULL, MAELSTROM_TANGENT, MAELSTROM_RELEASE_SPEED,
  KING_HEARTBEAT_INTERVAL, KING_HEARTBEAT_RANGE, KING_HEARTBEAT_FORCE,
  KING_HEARTBEAT_RING_DURATION, KING_HEARTBEAT_MIN_RADIUS,
  KING_FLEE_RANGE, KING_FLEE_FORCE, KING_FLEE_RATIO,
} from './constants.js';
import {
  PENTATONIC, ensureAudio, setAudioMuted, playTone, playSpawn, playMergeSound, playBoom, playBounce, playCollisionChime,
  playSwoosh, playBurstSound, playGalaxySound, playCollapse, playMitosis, playStreakTone,
  playWarpSound, playSpray, playLightning, playPortalSound, playMeteorSound,
  playSupernovaSound, playIgniteSound, playStrikeSound, playFirePop,
  playStormSound, playTsunamiSound, playColorWaveSound, playShatterAllSound,
  playBlackHoleSound, playBlackHoleAbsorbSound, playCometSound, playHeartbeat,
} from './audio.js';
import {
  getFormationTargets, generateBolt, randomColor, hexToHsl, hexAlpha, hslToHex,
  blendHexColors, easeOutElastic, createOrb,
} from './utils.js';
import {
  Wrapper, Canvas, HUD, Title, Hint, Count, PaletteLink, ModeIndicators, ModePill,
  StreakCounter, NextCombo, BestStreak, BPMDisplay, ButtonGroup, ButtonRow, ActionButton,
  HelpButton, MuteButton, SaveFlash, ModeStrip, ModeToggle,
  HelpOverlay, HelpPanel, HelpTitle, ShortcutList, Shortcut, Key, HelpClose,
} from './StyledComponents.js';

let lastHarpPluckTime = 0;

// Haptic feedback — makes taps and effects feel tactile on mobile
const haptic = (ms) => {
  try { navigator.vibrate?.(ms); } catch {}
};

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
  const bulletTimeRef = useRef(0); // timestamp when bullet-time ends (brief slow-mo on combo milestones)
  const bloomRef = useRef(null); // offscreen canvas for bloom post-process
  const supernovaRef = useRef(null); // active supernova {cx, cy, born, phase}
  const maelstromRef = useRef(null); // active maelstrom {cx, cy, born, phase}
  const implodeRef = useRef(null); // active implode {cx, cy, born, phase}
  const shatterAllRef = useRef(null); // active shatter-all {born, phase, frozenOrbs}
  const embersRef = useRef([]); // fire ember particles
  const mergeSparksRef = useRef([]); // collision spark particles
  const ghostsRef = useRef([]); // echo ghost copies [{x, y, radius, color, born}]
  const scorchMarksRef = useRef([]); // impact scorch marks from high-speed collisions
  const impactNumsRef = useRef([]); // floating collision force numbers
  const screenFlashesRef = useRef([]); // full-screen radial color flashes from big effects
  const strikesRef = useRef([]); // active orbital strikes
  const stormRef = useRef(null); // active magnetic storm {born, cx, cy, lastZap}
  const tsunamisRef = useRef([]); // active tsunami waves [{x, dir, born, color, foam}]
  const colorWavesRef = useRef([]); // active color waves [{cx, cy, radius, born, hitOrbs}]
  const tsunamiDirRef = useRef(1); // alternates direction each trigger
  const tidesRef = useRef([]); // horizontal sweep waves [{x, dir, born, color}]
  const tideDirRef = useRef(1); // alternates direction each trigger
  const galaxyRef = useRef(null); // active galaxy {cx, cy, born, phase, spinSpeed, arms}
  const tapWavesRef = useRef([]); // concentric pulse waves from taps [{x, y, born, color, streak}]
  const shatterRef = useRef([]); // chain-shatter waves [{x, y, radius, generation, hitOrbs, color, delay}]
  const fountainsRef = useRef([]); // persistent orb spawners [{x, y, color, born, lastSpawn}]
  const cometsRef = useRef([]); // active comets [{x, y, vx, vy, color, born, lastSpawn, spawned, trail}]
  const auroraActivityRef = useRef(0); // smoothed aurora intensity (0-1)
  const auroraFlareRef = useRef(0); // slow-decay energy from explosions (0-1)
  const systemEnergyRef = useRef(0); // smoothed total kinetic energy (0-1)
  const interactionEnergyRef = useRef(0); // player interaction energy bar (0-1)
  const energyReleaseRef = useRef(0); // timestamp of last energy release
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
  const [blackHoleActive, setBlackHoleActive] = useState(false);
  const autoplayModeRef = useRef(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const theaterModeRef = useRef(false);
  const [longExposure, setLongExposure] = useState(false);
  const longExposureRef = useRef(false);
  const [repelMode, setRepelMode] = useState(false);
  const repelModeRef = useRef(false);
  const [magnetCursorMode, setMagnetCursorMode] = useState(false);
  const magnetCursorRef = useRef(false);
  const [attractMode, setAttractMode] = useState(false);
  const attractModeRef = useRef(false);
  const [echoMode, setEchoMode] = useState(false);
  const echoModeRef = useRef(false);
  const [gravityPaintMode, setGravityPaintMode] = useState(false);
  const gravityPaintModeRef = useRef(false);
  const [meshMode, setMeshMode] = useState(false);
  const meshModeRef = useRef(false);
  const [flockingMode, setFlockingMode] = useState(false);
  const flockingModeRef = useRef(false);
  const [trailsMode, setTrailsMode] = useState(false);
  const trailsModeRef = useRef(false);
  const [chainReactMode, setChainReactMode] = useState(false);
  const chainReactModeRef = useRef(false);
  // constellation lines are always-on ambient visual (no toggle needed)
  const gravityDotsRef = useRef([]);
  const dominoRef = useRef(null); // {queue, index, nextTime, respawnCount, phase}
  const longPressRef = useRef(null);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioEnabledRef = useRef(true);
  const streakRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const lastSpinTimeRef = useRef(0); // for double-spin centrifuge detection
  const lastTapPosRef = useRef({ x: 0, y: 0 }); // for double-tap detection
  const tapTimesRef = useRef([]); // recent tap timestamps for beat detection
  const beatRef = useRef({ interval: 0, strength: 0 }); // detected rhythm state
  const [streakDisplay, setStreakDisplay] = useState(0);
  const streakFadeRef = useRef(null);
  const [bestStreak, setBestStreak] = useState(() => {
    try { return parseInt(localStorage.getItem('bestStreak')) || 0; } catch { return 0; }
  });
  const [newBest, setNewBest] = useState(false);
  const newBestTimerRef = useRef(null);
  const [detectedBPM, setDetectedBPM] = useState(0);
  const bpmFadeRef = useRef(null);
  const [tipCycle, setTipCycle] = useState(0);
  const [tipFading, setTipFading] = useState(false);
  const comboFlashRef = useRef([]); // [{text, x, y, born, color}]
  const burstComboRef = useRef({ lastTime: 0, level: 0 }); // burst button combo tracker
  const mouseDownRef = useRef(false);
  const sprayActiveRef = useRef(false);
  const sprayStartRef = useRef({ x: 0, y: 0 });
  const lastSprayPosRef = useRef({ x: 0, y: 0 });
  // showMoreButtons state removed — rarely-used effects culled from UI (still accessible via keyboard)
  const lastMilestoneRef = useRef(0); // last celebrated orb count milestone
  const kingHeartbeatTimerRef = useRef(0); // last king heartbeat pulse time
  const kingHeartbeatRingsRef = useRef([]); // active heartbeat rings [{x, y, born, color}]
  const bigBangRef = useRef(null); // {born, detonated, detonateTime}
  const slingshotRef = useRef(null); // {startX, startY} when flick-aiming
  const [fizzMode, setFizzMode] = useState(false);
  const fizzModeRef = useRef(false);
  const warpRef = useRef(null); // {born} active warp drive
  const [magnetMode, setMagnetMode] = useState(false);
  const magnetModeRef = useRef(false);
  const [nbodyMode, setNbodyMode] = useState(false);
  const nbodyModeRef = useRef(false);
  const vortexStormRef = useRef(null); // {cx, cy, born, exploded}
  const nebulaRef = useRef([]); // ambient nebula glow points
  const tapSparklesRef = useRef([]); // tiny sparkle particles from taps
  const cursorTrailRef = useRef([]); // cursor comet trail points
  const lastMouseShakeRef = useRef(0); // desktop mouse shake cooldown
  const cursorWakeRef = useRef([]); // shimmer particles drifting off cursor trail
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
  const [rainMode, setRainMode] = useState(false);
  const rainModeRef = useRef(false);
  const rainTimerRef = useRef(0);
  const [colorCycle, setColorCycle] = useState(false);
  const colorCycleRef = useRef(false);
  const [kaleidoscopeMode, setKaleidoscopeMode] = useState(false);
  const kaleidoscopeModeRef = useRef(false);
  const [wrapMode, setWrapMode] = useState(false);
  const wrapModeRef = useRef(false);
  const [flowMode, setFlowMode] = useState(false);
  const flowModeRef = useRef(false);
  const [tidalMode, setTidalMode] = useState(false);
  const tidalModeRef = useRef(false);
  const [swirlMode, setSwirlMode] = useState(false);
  const swirlModeRef = useRef(false);
  const [stringMode, setStringMode] = useState(false);
  const stringModeRef = useRef(false);
  const springsRef = useRef([]); // [{idA, idB, restLength}]
  const lastTapOrbIdRef = useRef(null); // last orb created by tap (for string connections)
  const [linksMode, setLinksMode] = useState(false);
  const linksModeRef = useRef(false);
  const [volatileMode, setVolatileMode] = useState(false);
  const volatileModeRef = useRef(false);
  const [fissionMode, setFissionMode] = useState(false);
  const fissionModeRef = useRef(false);
  const [waveMode, setWaveMode] = useState(false);
  const waveModeRef = useRef(false);
  const [bounceMode, setBounceMode] = useState(false);
  const bounceModeRef = useRef(false);
  const [magmaMode, setMagmaMode] = useState(false);
  const magmaModeRef = useRef(false);
  const barriersRef = useRef([]); // user-drawn bounce walls [{x1, y1, x2, y2, color}]
  const [barrierMode, setBarrierMode] = useState(false);
  const barrierModeRef = useRef(false);
  const barrierDrawRef = useRef(null); // {x1, y1, x2, y2} while actively drawing
  const orbitLockRef = useRef(null); // {born, phase, cx, cy, maxRing, spinBorn, releaseBorn}
  const cursorAuraRef = useRef({ alpha: 0, nearCount: 0 }); // cursor glow state
  const idleDriftActiveRef = useRef(false); // ambient drift spawning flag
  const idleEmptySinceRef = useRef(0);      // timestamp when orbs first hit 0
  const lastIdleDriftSpawnRef = useRef(0);  // last idle drift spawn time
  const pinchRef = useRef(null); // multi-touch pinch {startDist, lastDist, startAngle, lastAngle, cx, cy}
  const bgTintRef = useRef({ r: 0, g: 0, b: 0 }); // mood lighting: smoothed dominant orb color
  const [gyroMode, setGyroMode] = useState(false);
  const gyroModeRef = useRef(false);
  const gyroAngleRef = useRef(0);
  const effectChainRef = useRef({ count: 0, lastTime: 0 });
  const catalystRef = useRef(null); // wandering catalyst { x, y, vx, vy, born, lifespan }
  const catalystCooldownRef = useRef(0); // next spawn timestamp
  const finaleActiveRef = useRef(false); // grand finale in progress

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
      // Exit theater mode on any canvas interaction
      if (theaterModeRef.current) {
        theaterModeRef.current = false;
        setTheaterMode(false);
        autoplayModeRef.current = false;
        setAutoPlay(false);
        return;
      }
      // Multi-touch: start pinch gesture
      if (e.touches && e.touches.length >= 2) {
        if (dragRef.current) dragRef.current = null;
        if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
        if (holdChargeTimerRef.current) { clearTimeout(holdChargeTimerRef.current); holdChargeTimerRef.current = null; }
        holdChargeRef.current = null;
        slingshotRef.current = null;
        sprayActiveRef.current = false;
        mouseDownRef.current = false;
        const rect = canvasRef.current.getBoundingClientRect();
        const t0 = e.touches[0], t1 = e.touches[1];
        const x0 = t0.clientX - rect.left, y0 = t0.clientY - rect.top;
        const x1 = t1.clientX - rect.left, y1 = t1.clientY - rect.top;
        const dx = x1 - x0, dy = y1 - y0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        pinchRef.current = { startDist: dist, lastDist: dist, startAngle: angle, lastAngle: angle, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
        return;
      }
      const pos = getPos(e);
      mouseDownRef.current = true;
      slingshotRef.current = null;
      // Stop ambient drift when user interacts
      idleDriftActiveRef.current = false;
      idleEmptySinceRef.current = 0;
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
      // Multi-touch: apply pinch/spread/twist forces continuously
      if (e.touches && e.touches.length >= 2 && pinchRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const t0 = e.touches[0], t1 = e.touches[1];
        const x0 = t0.clientX - rect.left, y0 = t0.clientY - rect.top;
        const x1 = t1.clientX - rect.left, y1 = t1.clientY - rect.top;
        const dx = x1 - x0, dy = y1 - y0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        const pinch = pinchRef.current;
        // Radial force: spread pushes out, pinch pulls in
        const radialForce = (dist - pinch.lastDist) * 0.12;
        // Tangential force: twist spins orbs
        let angleDelta = angle - pinch.lastAngle;
        if (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
        if (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
        const spinForce = angleDelta * 4;
        const orbs = orbsRef.current;
        for (let i = 0; i < orbs.length; i++) {
          const orb = orbs[i];
          const odx = orb.x - cx, ody = orb.y - cy;
          const oDist = Math.sqrt(odx * odx + ody * ody);
          if (oDist < 1) continue;
          orb.vx += (odx / oDist) * radialForce;
          orb.vy += (ody / oDist) * radialForce;
          if (Math.abs(spinForce) > 0.01) {
            orb.vx += (-ody / oDist) * spinForce;
            orb.vy += (odx / oDist) * spinForce;
          }
        }
        pinch.lastDist = dist;
        pinch.lastAngle = angle;
        pinch.cx = cx;
        pinch.cy = cy;
        mouseRef.current = { x: cx, y: cy, onCanvas: true };
        return;
      }
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
      mouseRef.current = { ...pos, onCanvas: true };
      // cursor comet trail: push position samples (throttled by distance)
      const ct = cursorTrailRef.current;
      const last = ct.length > 0 ? ct[ct.length - 1] : null;
      if (!last || Math.abs(pos.x - last.x) + Math.abs(pos.y - last.y) > 3) {
        ct.push({ x: pos.x, y: pos.y, t: performance.now() });
        if (ct.length > 60) ct.shift();
      }
      // ── Desktop mouse shake detection: rapid oscillation → shockwave ──
      if (!e.touches && ct.length >= 6) {
        const nowMs = performance.now();
        if (nowMs - lastMouseShakeRef.current > 800) {
          const recent = [];
          for (let i = ct.length - 1; i >= 0 && recent.length < 8; i--) {
            if (nowMs - ct[i].t < 400) recent.unshift(ct[i]);
            else break;
          }
          if (recent.length >= 5) {
            let reversals = 0, totalDist = 0;
            for (let i = 1; i < recent.length; i++) {
              const dx = recent[i].x - recent[i - 1].x;
              const dy = recent[i].y - recent[i - 1].y;
              totalDist += Math.abs(dx) + Math.abs(dy);
              if (i >= 2) {
                const pdx = recent[i - 1].x - recent[i - 2].x;
                const pdy = recent[i - 1].y - recent[i - 2].y;
                if ((dx * pdx < 0 && Math.abs(dx) > 5) || (dy * pdy < 0 && Math.abs(dy) > 5)) reversals++;
              }
            }
            if (reversals >= 3 && totalDist > 150) {
              lastMouseShakeRef.current = nowMs;
              const color = randomColor();
              wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color, generation: 0, hitOrbs: new Set(), delay: 0 });
              shakeRef.current = Math.max(shakeRef.current, 12);
              comboFlashRef.current.push({ text: "SHAKE!", x: pos.x, y: pos.y - 40, born: nowMs, color });
              ensureAudio();
              playBoom();
            }
          }
        }
      }
    },
    [getPos]
  );

  const handleUp = useCallback(
    (e) => {
      // Multi-touch: finalize pinch gesture
      if (pinchRef.current) {
        const pinch = pinchRef.current;
        const now = performance.now();
        const distRatio = pinch.lastDist / Math.max(pinch.startDist, 1);
        if (distRatio > 1.6) {
          haptic(25);
          // Big spread → shockwave burst
          wavesRef.current.push({ cx: pinch.cx, cy: pinch.cy, radius: 0, color: randomColor(), generation: 0, hitOrbs: new Set(), delay: 0 });
          shakeRef.current = Math.max(shakeRef.current, 12);
          screenFlashesRef.current.push({ cx: pinch.cx, cy: pinch.cy, color: "#4facfe", born: now });
          comboFlashRef.current.push({ text: "SPREAD", x: pinch.cx, y: pinch.cy - 30, born: now, color: "#4facfe" });
          ensureAudio();
          playBoom();
        } else if (distRatio < 0.5) {
          haptic(20);
          // Big pinch → gather implosion
          ripplesRef.current.push({ x: pinch.cx, y: pinch.cy, color: "#43e97b", born: now });
          comboFlashRef.current.push({ text: "GATHER", x: pinch.cx, y: pinch.cy - 30, born: now, color: "#43e97b" });
          ensureAudio();
          playSwoosh();
        }
        pinchRef.current = null;
        if (e.touches && e.touches.length >= 1) return;
        mouseDownRef.current = false;
        return;
      }
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
        haptic(35);
        const charge = holdChargeRef.current;
        holdChargeRef.current = null;
        const chargeDuration = performance.now() - charge.born;
        const power = Math.min(chargeDuration / HOLD_CHARGE_MAX_MS, 1);
        const releaseForce = 3 + power * 12;
        const range = HOLD_CHARGE_RANGE * (0.8 + power * 0.5);
        const releaseNow = performance.now();
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
        // Primary shockwave — color shifts with power
        const waveColor = power >= 0.8 ? "#f093fb" : power >= 0.6 ? "#a78bfa" : "#4facfe";
        wavesRef.current.push({
          cx: charge.x,
          cy: charge.y,
          radius: 0,
          color: waveColor,
          generation: 0,
          hitOrbs: new Set(),
          delay: 0,
        });
        // High power (≥60%): chain lightning to nearby orbs
        if (power >= 0.6) {
          const nearby = orbsRef.current
            .map(o => ({ o, d: Math.sqrt((o.x - charge.x) ** 2 + (o.y - charge.y) ** 2) }))
            .filter(e => e.d < range && e.d > 0)
            .sort((a, b) => a.d - b.d)
            .slice(0, Math.floor(3 + power * 5));
          if (nearby.length > 0) {
            const bolts = [];
            for (const { o } of nearby) {
              bolts.push({ points: generateBolt(charge.x, charge.y, o.x, o.y), color: o.color });
            }
            lightningRef.current.push({ bolts, sparks: [], born: releaseNow });
            playLightning();
          }
        }
        // Max power: second shockwave ring + flash label
        if (power >= 0.95) {
          wavesRef.current.push({
            cx: charge.x, cy: charge.y, radius: 0,
            color: "#fa709a", generation: 0, hitOrbs: new Set(), delay: 4,
          });
          comboFlashRef.current.push({
            text: "SINGULARITY", x: charge.x, y: charge.y - 40,
            born: releaseNow, color: "#f093fb",
          });
        }
        shakeRef.current = Math.max(shakeRef.current, 3 + power * 14);
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
          const now = performance.now();

          // Volley: longer flick = more orbs in a fan spread
          const volleyCount = fDist > 150 ? 5 : fDist > 80 ? 3 : 1;
          const fanSpread = volleyCount > 1 ? 0.35 : 0;
          let firstColor = null;
          let rocketId = null;

          for (let v = 0; v < volleyCount; v++) {
            const spreadAngle = volleyCount > 1
              ? fAngle + fanSpread * ((v / (volleyCount - 1)) * 2 - 1)
              : fAngle;
            const vSpeed = v === Math.floor(volleyCount / 2) ? speed : speed * (0.85 + Math.random() * 0.15);
            const orb = createOrb(sling.startX, sling.startY);
            orb.radius = volleyCount > 1
              ? 6 + Math.min(fDist * 0.02, 5)
              : 10 + Math.min(fDist * 0.03, 8);
            orb.vx = Math.cos(spreadAngle) * vSpeed;
            orb.vy = Math.sin(spreadAngle) * vSpeed;
            orbsRef.current.push(orb);
            if (!firstColor) firstColor = orb.color;
            // Mark center orb of max volley as a rocket
            if (volleyCount === 5 && v === 2) rocketId = orb.id;
          }

          ripplesRef.current.push({ x: sling.startX, y: sling.startY, color: firstColor, born: now });
          // Spawn burst particles in launch direction
          for (let i = 0; i < 3 + volleyCount * 2; i++) {
            const spread = fAngle + (Math.random() - 0.5) * (0.8 + fanSpread);
            burstsRef.current.push({
              x: sling.startX,
              y: sling.startY,
              vx: Math.cos(spread) * (2 + Math.random() * 3),
              vy: Math.sin(spread) * (2 + Math.random() * 3),
              color: firstColor,
              born: now,
            });
          }
          // Directional gust — push existing orbs in the flick direction
          if (fDist > 60) {
            const gustRadius = 100 + fDist * 0.5;
            const gustForce = speed * 0.3;
            const fx = Math.cos(fAngle);
            const fy = Math.sin(fAngle);
            for (const orb of orbsRef.current) {
              if (orb.born > now - 50) continue; // skip just-spawned orbs
              const dx = orb.x - sling.startX;
              const dy = orb.y - sling.startY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0 && dist < gustRadius) {
                const dot = dist > 0 ? (dx * fx + dy * fy) / dist : 0;
                if (dot > -0.2) {
                  const falloff = 1 - dist / gustRadius;
                  const f = gustForce * falloff * Math.max(dot, 0.15);
                  orb.vx += fx * f;
                  orb.vy += fy * f;
                }
              }
            }
          }
          setOrbCount(orbsRef.current.length);
          playSwoosh();
          shakeRef.current = Math.max(shakeRef.current, speed * 0.4 + volleyCount);

          // Rocket flick: center orb of max volley detonates into a firework
          if (rocketId) {
            const capturedId = rocketId;
            setTimeout(() => {
              const idx = orbsRef.current.findIndex(o => o.id === capturedId);
              if (idx === -1) return;
              const rocket = orbsRef.current[idx];
              const rx = rocket.x, ry = rocket.y, rColor = rocket.color;
              orbsRef.current.splice(idx, 1);
              const burstNow = performance.now();
              // Firework burst — ring of orbs
              for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.3;
                const spd = 2 + Math.random() * 3;
                const o = createOrb(rx, ry);
                o.radius = 5 + Math.random() * 6;
                o.vx = Math.cos(angle) * spd;
                o.vy = Math.sin(angle) * spd;
                orbsRef.current.push(o);
              }
              // Visual effects
              screenFlashesRef.current.push({ cx: rx, cy: ry, color: rColor, born: burstNow });
              ripplesRef.current.push({ x: rx, y: ry, color: rColor, born: burstNow });
              flashesRef.current.push({ x: rx, y: ry, color: rColor, radius: 30, born: burstNow });
              for (let i = 0; i < 12; i++) {
                const a = Math.random() * Math.PI * 2;
                burstsRef.current.push({
                  x: rx, y: ry,
                  vx: Math.cos(a) * (1.5 + Math.random() * 3),
                  vy: Math.sin(a) * (1.5 + Math.random() * 3),
                  color: rColor, born: burstNow,
                });
              }
              comboFlashRef.current.push({ text: "ROCKET", x: rx, y: ry - 30, born: burstNow, color: rColor });
              shakeRef.current = Math.max(shakeRef.current, 10);
              setOrbCount(orbsRef.current.length);
              playBurstSound();
            }, 350);
          }
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

      // Beat detection: track tap rhythm
      tapTimesRef.current.push(now);
      if (tapTimesRef.current.length > 8) tapTimesRef.current.shift();
      if (tapTimesRef.current.length >= 3) {
        const tt = tapTimesRef.current;
        const ivs = [];
        for (let i = 1; i < tt.length; i++) ivs.push(tt[i] - tt[i - 1]);
        const sorted = [...ivs].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        if (median >= 150 && median <= 1500) {
          const ok = ivs.filter(iv => Math.abs(iv - median) / median < 0.35).length;
          if (ok >= Math.ceil(ivs.length * 0.6)) {
            beatRef.current.interval = median;
            beatRef.current.strength = Math.min(beatRef.current.strength + 0.15, 1);
            const bpm = Math.round(60000 / median);
            setDetectedBPM(bpm);
            if (bpmFadeRef.current) clearTimeout(bpmFadeRef.current);
            bpmFadeRef.current = setTimeout(() => setDetectedBPM(0), median * 5);
          }
        }
      }

      const streak = streakRef.current;

      // Update visible streak counter
      setStreakDisplay(streak);
      if (streakFadeRef.current) clearTimeout(streakFadeRef.current);
      streakFadeRef.current = setTimeout(() => {
        setStreakDisplay(0);
        streakRef.current = 0;
      }, STREAK_DECAY_DELAY);

      // Personal best tracking
      if (streak > bestStreak) {
        setBestStreak(streak);
        try { localStorage.setItem('bestStreak', streak.toString()); } catch {}
        setNewBest(true);
        if (newBestTimerRef.current) clearTimeout(newBestTimerRef.current);
        newBestTimerRef.current = setTimeout(() => setNewBest(false), 2500);
      }

      // ── Catalyst tap check ──
      if (catalystRef.current) {
        const cat = catalystRef.current;
        const cdx = pos.x - cat.x, cdy = pos.y - cat.y;
        if (cdx * cdx + cdy * cdy < 45 * 45) {
          // Trigger catalyst: mini-burst + shockwave + sparkles
          for (let ci = 0; ci < 6; ci++) {
            const cAngle = (Math.PI * 2 * ci) / 6;
            const catOrb = createOrb(cat.x, cat.y);
            catOrb.vx = Math.cos(cAngle) * 5.5;
            catOrb.vy = Math.sin(cAngle) * 5.5;
            orbsRef.current.push(catOrb);
          }
          wavesRef.current.push({ cx: cat.x, cy: cat.y, radius: 0, color: "#fbbf24", generation: 0, hitOrbs: new Set(), delay: 0 });
          screenFlashesRef.current.push({ cx: cat.x, cy: cat.y, color: "#fbbf24", born: now });
          for (let si = 0; si < 16; si++) {
            const sAngle = Math.random() * Math.PI * 2;
            const sSpeed = TAP_SPARKLE_SPEED * (0.8 + Math.random());
            tapSparklesRef.current.push({ x: cat.x, y: cat.y, vx: Math.cos(sAngle) * sSpeed, vy: Math.sin(sAngle) * sSpeed, color: "#fbbf24", born: now });
          }
          shakeRef.current = Math.max(shakeRef.current, 16);
          playBurstSound();
          comboFlashRef.current.push({ text: "CATALYST!", x: cat.x, y: cat.y - 30, born: now, color: "#fbbf24" });
          catalystRef.current = null;
          catalystCooldownRef.current = now + 25000 + Math.random() * 15000;
          setOrbCount(orbsRef.current.length);
        }
      }

      // ── Double-tap explosion ──
      const dtDx = pos.x - lastTapPosRef.current.x;
      const dtDy = pos.y - lastTapPosRef.current.y;
      const dtDist = Math.sqrt(dtDx * dtDx + dtDy * dtDy);
      const isDoubleTap = timeSinceLast < DOUBLE_TAP_WINDOW && dtDist < DOUBLE_TAP_RADIUS;
      lastTapPosRef.current = { x: pos.x, y: pos.y };

      if (isDoubleTap) {
        haptic([15, 25]);
        // Shockwave from tap point
        wavesRef.current.push({
          cx: pos.x, cy: pos.y, radius: 0,
          color: randomColor(), generation: 0, hitOrbs: new Set(), delay: 0,
        });
        // Ring of orbs bursting outward
        for (let i = 0; i < DOUBLE_TAP_BURST_COUNT; i++) {
          const angle = (Math.PI * 2 * i) / DOUBLE_TAP_BURST_COUNT;
          const orb = createOrb(pos.x + Math.cos(angle) * 15, pos.y + Math.sin(angle) * 15);
          orb.vx = Math.cos(angle) * DOUBLE_TAP_BURST_SPEED;
          orb.vy = Math.sin(angle) * DOUBLE_TAP_BURST_SPEED;
          orb.radius = 5 + Math.random() * 3;
          orbsRef.current.push(orb);
        }
        // Push existing nearby orbs away
        for (const orb of orbsRef.current) {
          const dx = orb.x - pos.x, dy = orb.y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 150) {
            const force = (1 - dist / 150) * 5;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
          }
        }
        // Visual feedback
        screenFlashesRef.current.push({ cx: pos.x, cy: pos.y, color: "#4facfe", born: now });
        shakeRef.current = Math.max(shakeRef.current, 10);
        comboFlashRef.current.push({ text: "BOOM", x: pos.x, y: pos.y - 30, born: now, color: "#4facfe" });
        // Burst particles
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
          burstsRef.current.push({
            x: pos.x, y: pos.y,
            vx: Math.cos(angle) * (3 + Math.random() * 4),
            vy: Math.sin(angle) * (3 + Math.random() * 4),
            color: randomColor(), born: now,
          });
        }
        setOrbCount(orbsRef.current.length);
        ensureAudio();
        playBoom();
        // Still update lastTapPosRef but skip normal spawn
        lastTapPosRef.current = { x: -999, y: -999 }; // prevent triple-tap chain
        return;
      }

      // ── Scale effects by streak ──
      const spawnCount = streak >= 8 ? 4 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
      const radiusBonus = Math.min(streak * 0.8, 8); // orbs get slightly bigger
      const rippleColor = randomColor();
      haptic(streak >= 5 ? 15 : 6);

      for (let i = 0; i < spawnCount; i++) {
        let ox, oy, ovx, ovy;
        // Trail spawn: bonus orbs trace the path between consecutive taps
        const useTrail = i > 0 && dtDist > 30 && dtDist < 500;
        if (useTrail) {
          const t = i / spawnCount;
          ox = pos.x - dtDx * t * 0.6;
          oy = pos.y - dtDy * t * 0.6;
          // Slight perpendicular wobble for organic feel
          const perpX = -dtDy / dtDist;
          const perpY = dtDx / dtDist;
          ox += perpX * (Math.random() - 0.5) * 8;
          oy += perpY * (Math.random() - 0.5) * 8;
          const speed = (1 + streak * 0.2) * (1 - t * 0.4);
          ovx = (dtDx / dtDist) * speed;
          ovy = (dtDy / dtDist) * speed;
        } else {
          const angle = spawnCount > 1 ? (Math.PI * 2 * i) / spawnCount : 0;
          const spread = spawnCount > 1 ? 12 + streak : 0;
          ox = pos.x + Math.cos(angle) * spread;
          oy = pos.y + Math.sin(angle) * spread;
          ovx = spawnCount > 1 ? Math.cos(angle) * (1 + streak * 0.3) : 0;
          ovy = spawnCount > 1 ? Math.sin(angle) * (1 + streak * 0.3) : 0;
        }

        {
          const orb = createOrb(ox, oy);
          orb.radius += radiusBonus;
          orb.vx += ovx;
          orb.vy += ovy;
          // Orbit mode: launch orbs into orbit around nearest existing orb
          if (nbodyModeRef.current && orbsRef.current.length > 0) {
            let nearest = null;
            let nearestDist = Infinity;
            for (const other of orbsRef.current) {
              const ndx = other.x - orb.x;
              const ndy = other.y - orb.y;
              const nd = Math.sqrt(ndx * ndx + ndy * ndy);
              if (nd < nearestDist && nd > 5) { nearestDist = nd; nearest = other; }
            }
            if (nearest && nearestDist < 300) {
              const ndx = orb.x - nearest.x;
              const ndy = orb.y - nearest.y;
              const nd = Math.sqrt(ndx * ndx + ndy * ndy);
              // Orbital speed from circular orbit equation: v = sqrt(G * M / r)
              const mass = nearest.radius * nearest.radius;
              const orbSpeed = Math.sqrt(NBODY_G * mass / Math.max(nd, 15)) * 1.3;
              const dir = Math.random() < 0.5 ? 1 : -1;
              orb.vx = (-ndy / nd) * orbSpeed * dir;
              orb.vy = (ndx / nd) * orbSpeed * dir;
            }
          }
          if (Math.random() < NOVA_CHANCE) {
            orb.isNova = true;
            orb.novaBorn = now;
            orb.novaFuse = NOVA_FUSE_MIN + Math.random() * (NOVA_FUSE_MAX - NOVA_FUSE_MIN);
          }
          orbsRef.current.push(orb);
          ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          // String mode: connect to previous tap orb with elastic spring
          if (stringModeRef.current && i === 0) {
            const prevId = lastTapOrbIdRef.current;
            if (prevId != null) {
              const prevOrb = orbsRef.current.find(o => o.id === prevId);
              if (prevOrb) {
                const sdx = orb.x - prevOrb.x;
                const sdy = orb.y - prevOrb.y;
                const dist = Math.sqrt(sdx * sdx + sdy * sdy);
                springsRef.current.push({ idA: prevId, idB: orb.id, restLength: Math.max(dist * 0.6, 40) });
              }
            }
            lastTapOrbIdRef.current = orb.id;
          }
        }
      }

      // ── Tap impulse: push nearby orbs away with visible splash ──
      for (const orb of orbsRef.current) {
        const idx = orb.x - pos.x;
        const idy = orb.y - pos.y;
        const idist = Math.sqrt(idx * idx + idy * idy);
        if (idist > 0 && idist < TAP_IMPULSE_RADIUS) {
          const falloff = 1 - idist / TAP_IMPULSE_RADIUS;
          const force = TAP_IMPULSE_FORCE * falloff * falloff;
          orb.vx += (idx / idist) * force;
          orb.vy += (idy / idist) * force;
          // Tap splash: flash pushed orbs and emit ripples from closest ones
          orb.hitGlow = Math.max(orb.hitGlow || 0, falloff * 0.9);
          if (falloff > 0.4) {
            ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
          }
        }
      }

      // ── Energy bar: accumulate from taps ──
      interactionEnergyRef.current = Math.min(interactionEnergyRef.current + ENERGY_PER_TAP + streak * ENERGY_STREAK_BONUS, 1.0);

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

      // ── Bullet time: brief slow-mo before big combo effects ──
      if (streak === STREAK_FIREWORK || streak === STREAK_LIGHTNING) {
        bulletTimeRef.current = now + 350;
      } else if (streak === STREAK_METEOR || streak === STREAK_SUPERNOVA) {
        bulletTimeRef.current = now + 500;
      } else if (streak >= STREAK_CASCADE) {
        bulletTimeRef.current = now + 650;
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

      if (streak === STREAK_NOVA_CHAIN && orbsRef.current.length >= 2) {
        // NOVA CHAIN: cascading chain-reaction explosions hop from orb to orb
        handleNovaChain();
        comboFlashRef.current.push({ text: "NOVA CHAIN!", x: pos.x, y: pos.y - 40, born: now, color: "#fbbf24" });
      }

      // ── Tap pulse wave — concentric ripples from every tap ──
      tapWavesRef.current.push({ x: pos.x, y: pos.y, born: now, color: rippleColor, streak, hitOrbs: new Set() });

      // ── Echo mode: delayed repeat spawns at same position ──
      if (echoModeRef.current) {
        const ex = pos.x, ey = pos.y;
        setTimeout(() => {
          const echoOrb = createOrb(ex, ey);
          echoOrb.radius *= 0.75;
          orbsRef.current.push(echoOrb);
          ripplesRef.current.push({ x: ex, y: ey, color: echoOrb.color, born: performance.now() });
          setOrbCount(orbsRef.current.length);
          playSpawn(ex, window.innerWidth);
        }, 300);
        setTimeout(() => {
          const echoOrb = createOrb(ex, ey);
          echoOrb.radius *= 0.55;
          orbsRef.current.push(echoOrb);
          ripplesRef.current.push({ x: ex, y: ey, color: echoOrb.color, born: performance.now() });
          setOrbCount(orbsRef.current.length);
          playSpawn(ex, window.innerWidth);
        }, 550);
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
      } else {
        // Right-click on empty space: trigger a random popular effect at this position
        ensureAudio();
        const now = performance.now();
        const effects = [
          () => {
            // Mini burst at position
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI * 2 * i) / 6;
              const orb = createOrb(pos.x, pos.y);
              orb.radius = 6 + Math.random() * 5;
              orb.vx = Math.cos(angle) * (3 + Math.random() * 2);
              orb.vy = Math.sin(angle) * (3 + Math.random() * 2);
              orbsRef.current.push(orb);
            }
            setOrbCount(orbsRef.current.length);
            comboFlashRef.current.push({ text: "BURST", x: pos.x, y: pos.y - 30, born: now, color: "#667eea" });
            shakeRef.current = Math.max(shakeRef.current, 6);
            playBurstSound();
          },
          () => {
            // Shockwave at position
            wavesRef.current.push({ cx: pos.x, cy: pos.y, radius: 0, color: randomColor(), generation: 0, hitOrbs: new Set(), delay: 0 });
            comboFlashRef.current.push({ text: "SHOCKWAVE", x: pos.x, y: pos.y - 30, born: now, color: "#4facfe" });
            shakeRef.current = Math.max(shakeRef.current, 10);
            playBoom();
          },
          () => {
            // Firework at position
            const count = 8;
            for (let i = 0; i < count; i++) {
              const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
              const orb = createOrb(pos.x, pos.y);
              orb.radius = 4 + Math.random() * 5;
              orb.vx = Math.cos(angle) * (4 + Math.random() * 3);
              orb.vy = Math.sin(angle) * (4 + Math.random() * 3);
              orbsRef.current.push(orb);
              ripplesRef.current.push({ x: pos.x, y: pos.y, color: orb.color, born: now });
            }
            setOrbCount(orbsRef.current.length);
            comboFlashRef.current.push({ text: "FIREWORK", x: pos.x, y: pos.y - 30, born: now, color: "#fa709a" });
            shakeRef.current = Math.max(shakeRef.current, 8);
            playFirePop();
          },
          () => {
            // Lightning from position to nearby orbs
            if (orbsRef.current.length > 0) {
              const visited = new Set();
              const bolts = [];
              const lSparks = [];
              let lcx = pos.x, lcy = pos.y;
              for (let chain = 0; chain < LIGHTNING_MAX_CHAIN; chain++) {
                let nearest = null, nearestDist = LIGHTNING_CHAIN_DIST;
                for (const orb of orbsRef.current) {
                  if (visited.has(orb.id)) continue;
                  const dx = orb.x - lcx, dy = orb.y - lcy;
                  const d = Math.sqrt(dx * dx + dy * dy);
                  if (d < nearestDist) { nearest = orb; nearestDist = d; }
                }
                if (!nearest) break;
                visited.add(nearest.id);
                bolts.push({ points: generateBolt(lcx, lcy, nearest.x, nearest.y), color: nearest.color });
                const force = LIGHTNING_FORCE;
                const dx = nearest.x - lcx, dy = nearest.y - lcy;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                nearest.vx += (dx / d) * force;
                nearest.vy += (dy / d) * force;
                for (let si = 0; si < 3; si++) {
                  lSparks.push({ x: nearest.x, y: nearest.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, color: nearest.color, born: now });
                }
                lcx = nearest.x; lcy = nearest.y;
              }
              if (bolts.length > 0) {
                lightningRef.current.push({ bolts, sparks: lSparks, born: now });
                comboFlashRef.current.push({ text: "LIGHTNING", x: pos.x, y: pos.y - 30, born: now, color: "#00f2fe" });
                shakeRef.current = Math.max(shakeRef.current, 6);
                playLightning();
              }
            } else {
              // No orbs — spawn a burst instead
              for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5;
                const orb = createOrb(pos.x, pos.y);
                orb.vx = Math.cos(angle) * 3;
                orb.vy = Math.sin(angle) * 3;
                orbsRef.current.push(orb);
              }
              setOrbCount(orbsRef.current.length);
              comboFlashRef.current.push({ text: "BURST", x: pos.x, y: pos.y - 30, born: now, color: "#667eea" });
              playBurstSound();
            }
          },
        ];
        effects[Math.floor(Math.random() * effects.length)]();
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

  // ── Rotating contextual tips ─────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setTipFading(true);
      setTimeout(() => {
        setTipCycle(c => c + 1);
        setTipFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Orb count milestone celebrations ──────────────────────────
  useEffect(() => {
    const milestones = [25, 50, 100, 200, 300, 500, 1000];
    const reached = milestones.filter(m => orbCount >= m).pop() || 0;
    if (reached > lastMilestoneRef.current) {
      lastMilestoneRef.current = reached;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const now = performance.now();
      const color = reached >= 500 ? "#f59e0b" : reached >= 200 ? "#f093fb" : reached >= 100 ? "#43e97b" : "#4facfe";
      comboFlashRef.current.push({
        text: `${reached} ORBS!`, x: W / 2, y: H / 2, born: now, color,
      });
      screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color, born: now });
      if (reached >= 100) {
        wavesRef.current.push({
          cx: W / 2, cy: H / 2, radius: 0,
          color, generation: 0, hitOrbs: new Set(), delay: 0,
        });
        shakeRef.current = Math.max(shakeRef.current, 8 + reached * 0.02);
      }
      if (audioEnabledRef.current) {
        playStreakTone(milestones.indexOf(reached));
      }
    }
    if (orbCount < 25) lastMilestoneRef.current = 0;
  }, [orbCount]);

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

  // ── Shake detection: shake phone → shockwave ─────────────────
  useEffect(() => {
    let lastShake = 0;
    let lastAcc = { x: 0, y: 0, z: 0 };
    let hasBaseline = false;
    const SHAKE_THRESHOLD = 25;
    const SHAKE_COOLDOWN = 800;

    const handleMotion = (e) => {
      if (theaterModeRef.current) return;
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null) return;
      if (!hasBaseline) {
        lastAcc = { x: acc.x, y: acc.y, z: acc.z };
        hasBaseline = true;
        return;
      }
      const dx = acc.x - lastAcc.x;
      const dy = acc.y - lastAcc.y;
      const dz = acc.z - lastAcc.z;
      const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);
      lastAcc = { x: acc.x, y: acc.y, z: acc.z };

      const now = performance.now();
      if (delta > SHAKE_THRESHOLD && now - lastShake > SHAKE_COOLDOWN) {
        lastShake = now;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const color = randomColor();
        wavesRef.current.push({
          cx, cy, radius: 0, color,
          generation: 0, hitOrbs: new Set(), delay: 0,
        });
        shakeRef.current = Math.max(shakeRef.current, 12);
        comboFlashRef.current.push({
          text: "SHAKE!", x: cx, y: cy - 40,
          born: now, color,
        });
        haptic(30);
        ensureAudio();
        playBoom();
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // safe gradient wrappers — return dummy gradient for non-finite params instead of throwing
    {
      const _cRG = ctx.createRadialGradient.bind(ctx);
      const _cLG = ctx.createLinearGradient.bind(ctx);
      const _dummyGrad = _cRG(0, 0, 0, 0, 0, 1);
      ctx.createRadialGradient = (x0, y0, r0, x1, y1, r1) =>
        isFinite(x0 + y0 + r0 + x1 + y1 + r1) ? _cRG(x0, y0, r0, x1, y1, r1) : _dummyGrad;
      ctx.createLinearGradient = (x0, y0, x1, y1) =>
        isFinite(x0 + y0 + x1 + y1) ? _cLG(x0, y0, x1, y1) : _dummyGrad;
    }

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

      // ── Gyro mode: rotate gravity direction continuously ──
      if (gyroModeRef.current) {
        gyroAngleRef.current += 0.012; // full rotation ~8.7s at 60fps
      }

      // ── Age and expire sparks ──
      orbsRef.current = orbsRef.current.filter(o => {
        if (!o.spark) return true;
        const age = now - o.sparkBorn;
        if (age >= SPARK_LIFETIME) return false;
        o.radius = o.sparkBaseRadius * (1 - age / SPARK_LIFETIME);
        return o.radius > 0.3;
      });

      const orbs = orbsRef.current;

      // ── Mood lighting: tint background toward dominant orb color ──
      const bgTint = bgTintRef.current;
      if (orbs.length > 0) {
        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        for (let i = 0; i < orbs.length; i++) {
          if (orbs[i].spark) continue;
          const hex = orbs[i].color;
          totalR += parseInt(hex.slice(1, 3), 16);
          totalG += parseInt(hex.slice(3, 5), 16);
          totalB += parseInt(hex.slice(5, 7), 16);
          count++;
        }
        if (count > 0) {
          const sm = 0.02;
          bgTint.r += (totalR / count - bgTint.r) * sm;
          bgTint.g += (totalG / count - bgTint.g) * sm;
          bgTint.b += (totalB / count - bgTint.b) * sm;
        }
      } else {
        bgTint.r *= 0.97; bgTint.g *= 0.97; bgTint.b *= 0.97;
      }

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
        const ts = 0.1;
        ctx.fillStyle = `rgba(${15 + bgTint.r * ts | 0}, ${15 + bgTint.g * ts | 0}, ${26 + bgTint.b * ts | 0}, ${fadeAlpha})`;
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
        // Beat pulse: canvas-wide brightness flash on each detected tap beat
        {
          const beat = beatRef.current;
          if (beat.strength > 0.1 && beat.interval > 0 && tapTimesRef.current.length > 0) {
            const elapsed = now - tapTimesRef.current[tapTimesRef.current.length - 1];
            const fade = Math.max(0, 1 - elapsed / (beat.interval * 6));
            const phase = (elapsed % beat.interval) / beat.interval;
            const beatFlash = Math.exp(-phase * 5) * beat.strength * fade;
            if (beatFlash > 0.01) {
              ctx.fillStyle = `rgba(140, 160, 255, ${(beatFlash * 0.07).toFixed(3)})`;
              ctx.fillRect(0, 0, W, H);
            }
          }
        }
      }

      // ── Aurora: subtle drifting light curtains in the upper sky ──
      if (!paintModeRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        // total kinetic energy drives aurora brightness
        let _auroraEnergy = 0;
        for (let ai = 0; ai < orbs.length; ai++) {
          const o = orbs[ai];
          if (!o.spark) _auroraEnergy += o.vx * o.vx + o.vy * o.vy;
        }
        let _auroraBoost = Math.min(_auroraEnergy / 80, 1);
        // Beat-sync aurora: intensify on each detected beat
        {
          const beat = beatRef.current;
          if (beat.strength > 0.1 && beat.interval > 0 && tapTimesRef.current.length > 0) {
            const elapsed = now - tapTimesRef.current[tapTimesRef.current.length - 1];
            const fade = Math.max(0, 1 - elapsed / (beat.interval * 6));
            const phase = (elapsed % beat.interval) / beat.interval;
            _auroraBoost += Math.exp(-phase * 4) * beat.strength * fade * 0.5;
          }
        }
        const _auroraBands = [
          { hue: 150, yFrac: 0.11, speed: 0.12, freq: 3.0 },
          { hue: 190, yFrac: 0.19, speed: 0.16, freq: 2.5 },
          { hue: 275, yFrac: 0.27, speed: 0.10, freq: 3.5 },
        ];
        const _aSegs = 24;
        for (let _ab = 0; _ab < 3; _ab++) {
          const a = _auroraBands[_ab];
          const yCenter = H * a.yFrac + Math.sin(time * a.speed + _ab * 2.2) * H * 0.03;
          const bh = H * 0.06;
          const alpha = (0.012 + 0.006 * Math.sin(time * 0.35 + _ab * 1.9)) * (0.4 + _auroraBoost * 0.6);

          ctx.beginPath();
          for (let i = 0; i <= _aSegs; i++) {
            const x = (i / _aSegs) * W;
            const y = yCenter - bh + Math.sin(i / _aSegs * a.freq * Math.PI + time * a.speed * 2) * bh * 0.5;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          for (let i = _aSegs; i >= 0; i--) {
            const x = (i / _aSegs) * W;
            const y = yCenter + bh + Math.sin(i / _aSegs * (a.freq - 0.5) * Math.PI + time * a.speed * 1.5 + 1) * bh * 0.4;
            ctx.lineTo(x, y);
          }
          ctx.closePath();

          const g = ctx.createLinearGradient(0, yCenter - bh * 1.5, 0, yCenter + bh * 1.5);
          g.addColorStop(0, `hsla(${a.hue}, 70%, 55%, 0)`);
          g.addColorStop(0.3, `hsla(${a.hue}, 70%, 58%, ${(alpha * 0.5).toFixed(4)})`);
          g.addColorStop(0.5, `hsla(${a.hue}, 75%, 62%, ${alpha.toFixed(4)})`);
          g.addColorStop(0.7, `hsla(${a.hue + 10}, 70%, 58%, ${(alpha * 0.5).toFixed(4)})`);
          g.addColorStop(1, `hsla(${a.hue}, 70%, 55%, 0)`);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.restore();
      }

      // ── Bullet time vignette: radial darkening at edges during combo slow-mo ──
      if (bulletTimeRef.current > now) {
        const btRemaining = bulletTimeRef.current - now;
        const btMax = 650; // max bullet time duration
        const btProgress = Math.min(btRemaining / btMax, 1);
        const btAlpha = btProgress * 0.35;
        const vignetteGrad = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
        vignetteGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        vignetteGrad.addColorStop(1, `rgba(102, 126, 234, ${btAlpha})`);
        ctx.fillStyle = vignetteGrad;
        ctx.fillRect(0, 0, W, H);
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

      // ── Wrap mode portal edges: pulsing border glow signals teleport edges ──
      if (wrapModeRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const portalPulse = 0.25 + 0.15 * Math.sin(time * 3);
        const portalDepth = 6;
        const portalColor = `rgba(56, 189, 254, ${portalPulse})`;
        const portalFade = "rgba(56, 189, 254, 0)";
        // Left
        let pg = ctx.createLinearGradient(0, 0, portalDepth, 0);
        pg.addColorStop(0, portalColor); pg.addColorStop(1, portalFade);
        ctx.fillStyle = pg; ctx.fillRect(0, 0, portalDepth, H);
        // Right
        pg = ctx.createLinearGradient(W, 0, W - portalDepth, 0);
        pg.addColorStop(0, portalColor); pg.addColorStop(1, portalFade);
        ctx.fillStyle = pg; ctx.fillRect(W - portalDepth, 0, portalDepth, H);
        // Top
        pg = ctx.createLinearGradient(0, 0, 0, portalDepth);
        pg.addColorStop(0, portalColor); pg.addColorStop(1, portalFade);
        ctx.fillStyle = pg; ctx.fillRect(0, 0, W, portalDepth);
        // Bottom
        pg = ctx.createLinearGradient(0, H, 0, H - portalDepth);
        pg.addColorStop(0, portalColor); pg.addColorStop(1, portalFade);
        ctx.fillStyle = pg; ctx.fillRect(0, H - portalDepth, W, portalDepth);
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

      // Collect gravitational lensing sources
      const _lensOrbs = [];
      for (let _li = 0; _li < orbs.length; _li++) {
        if (orbs[_li].radius >= LENS_ORB_MIN_RADIUS) _lensOrbs.push(orbs[_li]);
      }
      const _lensWells = wellsRef.current;
      const _lensBH = blackHoleRef.current;
      const _lensHold = holdChargeRef.current;

      for (const star of starsRef.current) {
        let sx = star.x * W, sy = star.y * H;

        // Gravitational lensing — bend starlight around massive objects
        for (let _li = 0; _li < _lensOrbs.length; _li++) {
          const mo = _lensOrbs[_li];
          const dx = sx - mo.x, dy = sy - mo.y;
          const d2 = dx * dx + dy * dy;
          const lr = mo.radius * LENS_ORB_RANGE_FACTOR;
          if (d2 < lr * lr && d2 > 25) {
            const d = Math.sqrt(d2);
            const t = 1 - d / lr;
            const s = (mo.radius / LENS_ORB_MIN_RADIUS) * LENS_ORB_STRENGTH;
            sx -= (dx / d) * t * t * s;
            sy -= (dy / d) * t * t * s;
          }
        }
        for (let _wi = 0; _wi < _lensWells.length; _wi++) {
          const w = _lensWells[_wi];
          const dx = sx - w.x, dy = sy - w.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LENS_WELL_RANGE * LENS_WELL_RANGE && d2 > 25) {
            const d = Math.sqrt(d2);
            const t = 1 - d / LENS_WELL_RANGE;
            sx -= (dx / d) * t * t * LENS_WELL_STRENGTH;
            sy -= (dy / d) * t * t * LENS_WELL_STRENGTH;
          }
        }
        if (_lensBH) {
          const dx = sx - _lensBH.x, dy = sy - _lensBH.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LENS_BH_RANGE * LENS_BH_RANGE && d2 > 25) {
            const d = Math.sqrt(d2);
            const t = 1 - d / LENS_BH_RANGE;
            sx -= (dx / d) * t * t * LENS_BH_STRENGTH;
            sy -= (dy / d) * t * t * LENS_BH_STRENGTH;
          }
        }
        if (_lensHold) {
          const dx = sx - _lensHold.x, dy = sy - _lensHold.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LENS_HOLD_RANGE * LENS_HOLD_RANGE && d2 > 25) {
            const d = Math.sqrt(d2);
            const elapsed = Math.min((now - _lensHold.born) / 1000, 1);
            const t = 1 - d / LENS_HOLD_RANGE;
            sx -= (dx / d) * t * t * LENS_HOLD_STRENGTH * elapsed;
            sy -= (dy / d) * t * t * LENS_HOLD_STRENGTH * elapsed;
          }
        }

        // Decay star flare from shockwaves
        if (star.flare > 0) {
          star.flare *= 0.94;
          if (star.flare < 0.01) star.flare = 0;
        }

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
          // Normal star rendering (with shockwave flare + beat pulse)
          let f = star.flare || 0;
          {
            const beat = beatRef.current;
            if (beat.strength > 0.1 && beat.interval > 0 && tapTimesRef.current.length > 0) {
              const elapsed = now - tapTimesRef.current[tapTimesRef.current.length - 1];
              const fade = Math.max(0, 1 - elapsed / (beat.interval * 6));
              const phase = (elapsed % beat.interval) / beat.interval;
              f += Math.exp(-phase * 4) * beat.strength * fade * 0.3;
            }
          }
          const alpha = Math.min(twinkle * 0.5 + f, 1);
          const sz = star.size * (1 + f * 3);
          if (f > 0.15) {
            // Glow halo for flared stars
            const glowR = sz * 4;
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
            g.addColorStop(0, `rgba(220, 235, 255, ${(f * 0.5).toFixed(3)})`);
            g.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(sx, sy, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${200 + Math.round(f * 55)}, ${210 + Math.round(f * 45)}, 255, ${alpha.toFixed(3)})`;
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

      // ── Comet projectiles: move, spawn trail orbs, render ──
      cometsRef.current = cometsRef.current.filter((c) => {
        const age = now - c.born;
        // move comet
        c.x += c.vx;
        c.y += c.vy;
        // record trail
        c.trail.push({ x: c.x, y: c.y, t: now });
        if (c.trail.length > COMET_TAIL_POINTS) c.trail.shift();
        // spawn orbs along path
        if (c.spawned < COMET_ORB_COUNT && now - c.lastSpawn > COMET_TRAIL_INTERVAL) {
          c.lastSpawn = now;
          c.spawned++;
          const spread = (Math.random() - 0.5) * 1.5;
          const perpX = -c.vy / COMET_SPEED * spread;
          const perpY = c.vx / COMET_SPEED * spread;
          orbs.push({
            x: c.x + perpX * 8, y: c.y + perpY * 8,
            vx: c.vx * 0.15 + perpX * 2, vy: c.vy * 0.15 + perpY * 2,
            radius: 3 + Math.random() * 3, color: c.color,
            opacity: 1, pulsePhase: Math.random() * Math.PI * 2,
            trail: [],
          });
          // trail sparks
          for (let sp = 0; sp < 3; sp++) {
            burstsRef.current.push({
              x: c.x, y: c.y,
              vx: (Math.random() - 0.5) * 3 - c.vx * 0.1,
              vy: (Math.random() - 0.5) * 3 - c.vy * 0.1,
              color: c.color, radius: 0.8 + Math.random(), born: now,
            });
          }
        }
        // despawn when off-screen
        return c.x > -60 && c.x < W + 60 && c.y > -60 && c.y < H + 60;
      });
      // render comets
      for (const c of cometsRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        // tail
        if (c.trail.length > 1) {
          for (let t = 1; t < c.trail.length; t++) {
            const progress = t / c.trail.length;
            const alpha = progress * progress * 0.6;
            const width = progress * COMET_HEAD_RADIUS * 0.8;
            ctx.beginPath();
            ctx.moveTo(c.trail[t - 1].x, c.trail[t - 1].y);
            ctx.lineTo(c.trail[t].x, c.trail[t].y);
            ctx.strokeStyle = c.color + hexAlpha(alpha * 255);
            ctx.lineWidth = Math.max(0.5, width);
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
        // bright head glow
        const headGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, COMET_HEAD_RADIUS * 2.5);
        headGrad.addColorStop(0, "#ffffff" + hexAlpha(220));
        headGrad.addColorStop(0.2, c.color + hexAlpha(180));
        headGrad.addColorStop(0.6, c.color + hexAlpha(60));
        headGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(c.x, c.y, COMET_HEAD_RADIUS * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
        // solid core
        ctx.beginPath();
        ctx.arc(c.x, c.y, COMET_HEAD_RADIUS * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
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
            // gravity pulse (gather then explode)
            () => {
              const cx2 = W / 2, cy2 = H / 2;
              for (const o of orbs) {
                const dx = cx2 - o.x, dy = cy2 - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                o.vx += (dx / dist) * (5 + Math.random() * 3);
                o.vy += (dy / dist) * (5 + Math.random() * 3);
              }
              ripplesRef.current.push({ x: cx2, y: cy2, color: "#a78bfa", born: now });
              shakeRef.current = Math.max(shakeRef.current, 8);
              playSwoosh();
              setTimeout(() => {
                for (const o of orbsRef.current) {
                  const dx = o.x - cx2, dy = o.y - cy2;
                  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                  o.vx += (dx / dist) * (6 + Math.random() * 5);
                  o.vy += (dy / dist) * (6 + Math.random() * 5);
                }
                wavesRef.current.push({ cx: cx2, cy: cy2, radius: 0, color: "#a78bfa", generation: 0, hitOrbs: new Set(), delay: 0 });
                wavesRef.current.push({ cx: cx2, cy: cy2, radius: 0, color: "#c084fc", generation: 1, hitOrbs: new Set(), delay: 6 });
                shakeRef.current = Math.max(shakeRef.current, 20);
                screenFlashesRef.current.push({ cx: cx2, cy: cy2, color: "#a78bfa", born: performance.now() });
                playBoom();
              }, 400);
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
          // Every ~25s trigger a supernova finale, otherwise pick random
          const sinceStart = now - (ap.finaleTime || 0);
          if (sinceStart > 25000 && orbs.length >= 6) {
            ap.finaleTime = now;
            // supernova finale
            const cx2 = W / 2, cy2 = H / 2;
            for (const o of orbs) {
              const dx = o.x - cx2, dy = o.y - cy2;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              o.vx -= (dx / dist) * 3;
              o.vy -= (dy / dist) * 3;
            }
            setTimeout(() => {
              const n2 = performance.now();
              for (const o of orbsRef.current) {
                const dx = o.x - cx2, dy = o.y - cy2;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                o.vx += (dx / dist) * 8;
                o.vy += (dy / dist) * 8;
              }
              const ringCount = 16;
              for (let i = 0; i < ringCount; i++) {
                const angle = (Math.PI * 2 * i) / ringCount;
                const orb2 = createOrb(cx2, cy2);
                orb2.vx = Math.cos(angle) * 6;
                orb2.vy = Math.sin(angle) * 6;
                orbsRef.current.push(orb2);
                ripplesRef.current.push({ x: cx2, y: cy2, color: orb2.color, born: n2 });
              }
              setOrbCount(orbsRef.current.length);
              wavesRef.current.push({ cx: cx2, cy: cy2, radius: 0, color: "#fff", generation: 0, hitOrbs: new Set(), delay: 0 });
              shakeRef.current = Math.max(shakeRef.current, 25);
              screenFlashesRef.current.push({ cx: cx2, cy: cy2, color: "#f0abfc", born: n2 });
              playBoom();
            }, 600);
            shakeRef.current = Math.max(shakeRef.current, 8);
            playSwoosh();
          } else {
            effects[Math.floor(Math.random() * effects.length)]();
          }
          ap.lastEffect = now + (Math.random() - 0.5) * 800; // vary timing
        }
      }

      // ── Rain mode: continuous gentle rain of orbs (follows gravity direction) ──
      if (rainModeRef.current && !frozenRef.current) {
        if (now - rainTimerRef.current >= RAIN_SPAWN_INTERVAL && orbs.length < RAIN_ORB_CAP) {
          const gDir = gravityDirRef.current;
          const spd = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
          const drift = (Math.random() - 0.5) * RAIN_DRIFT;
          let rx, ry, rvx, rvy;
          if (gDir === "up") {
            rx = Math.random() * W; ry = H + 10;
            rvx = drift; rvy = -spd;
          } else if (gDir === "left") {
            rx = W + 10; ry = Math.random() * H;
            rvx = -spd; rvy = drift;
          } else if (gDir === "right") {
            rx = -10; ry = Math.random() * H;
            rvx = spd; rvy = drift;
          } else {
            rx = Math.random() * W; ry = -10;
            rvx = drift; rvy = spd;
          }
          const orb = createOrb(rx, ry);
          orb.radius = 4 + Math.random() * 5;
          orb.vx = rvx;
          orb.vy = rvy;
          orbsRef.current.push(orb);
          rainTimerRef.current = now;
          setOrbCount(orbsRef.current.length);
        }
      }

      // ── Ambient drift: spawn orbs from edges when canvas is empty ──
      {
        const orbLen = orbsRef.current.length;
        if (orbLen === 0 || (idleDriftActiveRef.current && orbLen < IDLE_DRIFT_MAX)) {
          if (orbLen === 0 && !idleDriftActiveRef.current) {
            if (idleEmptySinceRef.current === 0) {
              idleEmptySinceRef.current = now;
            } else if (now - idleEmptySinceRef.current > IDLE_DRIFT_DELAY && !mouseDownRef.current) {
              idleDriftActiveRef.current = true;
            }
          }
          if (idleDriftActiveRef.current && now - lastIdleDriftSpawnRef.current > IDLE_DRIFT_INTERVAL) {
            const edge = Math.floor(Math.random() * 4);
            let sx, sy, svx, svy;
            const margin = 10;
            switch (edge) {
              case 0: // top
                sx = W * 0.1 + Math.random() * W * 0.8; sy = -margin;
                svx = (Math.random() - 0.5) * 0.4; svy = IDLE_DRIFT_SPEED + Math.random() * 0.3; break;
              case 1: // right
                sx = W + margin; sy = H * 0.1 + Math.random() * H * 0.8;
                svx = -(IDLE_DRIFT_SPEED + Math.random() * 0.3); svy = (Math.random() - 0.5) * 0.4; break;
              case 2: // bottom
                sx = W * 0.1 + Math.random() * W * 0.8; sy = H + margin;
                svx = (Math.random() - 0.5) * 0.4; svy = -(IDLE_DRIFT_SPEED + Math.random() * 0.3); break;
              default: // left
                sx = -margin; sy = H * 0.1 + Math.random() * H * 0.8;
                svx = IDLE_DRIFT_SPEED + Math.random() * 0.3; svy = (Math.random() - 0.5) * 0.4; break;
            }
            const driftOrb = createOrb(sx, sy);
            driftOrb.vx = svx;
            driftOrb.vy = svy;
            driftOrb.radius = 5 + Math.random() * 6;
            orbsRef.current.push(driftOrb);
            ripplesRef.current.push({ x: sx, y: sy, color: driftOrb.color, born: now });
            lastIdleDriftSpawnRef.current = now;
            setOrbCount(orbsRef.current.length);
          }
        } else {
          idleDriftActiveRef.current = false;
          idleEmptySinceRef.current = 0;
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

      // ── Heartbeat mode — adaptive rhythmic pulse ──
      if (pulseModeRef.current && !frozenRef.current) {
        // Adaptive tempo: faster with more orbs (1800ms → 900ms)
        const orbFactor = Math.min(orbs.length / 40, 1);
        const interval = PULSE_INTERVAL * (1 - orbFactor * 0.5);
        if (now - pulseTimerRef.current >= interval) {
          pulseTimerRef.current = now;
          const pcx = W / 2;
          const pcy = H / 2;
          wavesRef.current.push({
            cx: pcx,
            cy: pcy,
            radius: 0,
            color: COLORS[Math.floor((now / 300) % COLORS.length)],
            generation: 0,
            hitOrbs: new Set(),
            delay: 0,
          });
          shakeRef.current = Math.max(shakeRef.current, 4);
          flashesRef.current.push({
            x: pcx, y: pcy, color: '#667eea', radius: 40 + orbs.length * 0.5, born: now,
          });
          playHeartbeat();
        }
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

      // precompute hue + RGB for color affinity & contagion
      for (const orb of orbs) {
        orb._hue = hexToHsl(orb.color)[0];
        orb._r = parseInt(orb.color.slice(1, 3), 16) || 0;
        orb._g = parseInt(orb.color.slice(3, 5), 16) || 0;
        orb._b = parseInt(orb.color.slice(5, 7), 16) || 0;
      }

      // fission mode deferred arrays (populated during physics, applied after)
      const fissionFrags = [];
      const fissionRemove = new Set();

      // ── String springs: elastic forces between connected orbs ──
      if (stringModeRef.current || springsRef.current.length > 0) {
        const SPRING_K = 0.04;  // stiffness
        const SPRING_DAMP = 0.02; // damping
        const SPRING_BREAK = 3.5; // break at 3.5x rest length
        const orbById = new Map();
        for (const o of orbs) orbById.set(o.id, o);
        const alive = [];
        for (const sp of springsRef.current) {
          const a = orbById.get(sp.idA);
          const b = orbById.get(sp.idB);
          if (!a || !b) continue; // orb removed
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          if (dist > sp.restLength * SPRING_BREAK) continue; // break spring
          const displacement = dist - sp.restLength;
          const fx = (dx / dist) * displacement * SPRING_K;
          const fy = (dy / dist) * displacement * SPRING_K;
          // relative velocity damping
          const dvx = b.vx - a.vx;
          const dvy = b.vy - a.vy;
          const dampX = dvx * SPRING_DAMP;
          const dampY = dvy * SPRING_DAMP;
          if (a !== dragRef.current && !frozenRef.current) {
            a.vx += fx + dampX;
            a.vy += fy + dampY;
          }
          if (b !== dragRef.current && !frozenRef.current) {
            b.vx -= fx + dampX;
            b.vy -= fy + dampY;
          }
          alive.push(sp);
        }
        springsRef.current = alive;
      }

      // update physics
      for (const orb of orbs) {
        if (orb === dragRef.current) continue;
        if (frozenRef.current) continue;

        // soft repulsion between orbs + color affinity
        for (const other of orbs) {
          if (other === orb) continue;
          const dx = orb.x - other.x;
          const dy = orb.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hueDiff = Math.abs(orb._hue - other._hue);
          const hueCloseness = Math.min(hueDiff, 360 - hueDiff);
          const isSimilar = hueCloseness < 60;
          if (dist < REPEL_DIST && dist > 0) {
            // similar colors repel less, clustering tighter
            const colorFactor = isSimilar ? 0.4 + 0.6 * (hueCloseness / 60) : 1.0;
            const force = (REPEL_FORCE * (REPEL_DIST - dist)) / REPEL_DIST * colorFactor;
            orb.vx += (dx / dist) * force;
            orb.vy += (dy / dist) * force;
            // color contagion: nearby orbs gradually blend colors
            if (!orb.spark && !other.spark) {
              const blend = 0.003 * (1 - dist / REPEL_DIST);
              orb._r += (other._r - orb._r) * blend;
              orb._g += (other._g - orb._g) * blend;
              orb._b += (other._b - orb._b) * blend;
              const cr = Math.max(0, Math.min(255, Math.round(orb._r))) || 0;
              const cg = Math.max(0, Math.min(255, Math.round(orb._g))) || 0;
              const cb = Math.max(0, Math.min(255, Math.round(orb._b))) || 0;
              orb.color = '#' + ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1);
            }
          } else if (dist > 0 && dist < COLOR_AFFINITY_DIST && isSimilar) {
            // gentle attraction between similar-colored orbs at medium range
            const t = (dist - REPEL_DIST) / (COLOR_AFFINITY_DIST - REPEL_DIST);
            const affinity = COLOR_AFFINITY_FORCE * (1 - hueCloseness / 60) * (1 - t);
            orb.vx -= (dx / dist) * affinity;
            orb.vy -= (dy / dist) * affinity;
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

        // gravity (directional or gyro-rotating)
        if (gravityRef.current) {
          if (gyroModeRef.current) {
            orb.vx += Math.sin(gyroAngleRef.current) * GRAVITY;
            orb.vy += Math.cos(gyroAngleRef.current) * GRAVITY;
          } else {
            const gDir = gravityDirRef.current;
            if (gDir === "down") orb.vy += GRAVITY;
            else if (gDir === "up") orb.vy -= GRAVITY;
            else if (gDir === "right") orb.vx += GRAVITY;
            else if (gDir === "left") orb.vx -= GRAVITY;
            else if (gDir === "flow") {
              // convection: circular flow field — down on left, up on right, right at bottom, left at top
              orb.vy += GRAVITY * (1 - 2 * orb.x / W);
              orb.vx += GRAVITY * (2 * orb.y / H - 1);
            }
          }
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

        // magnet cursor: cursor/finger acts as gravity source
        if (magnetCursorRef.current && mouseRef.current.onCanvas) {
          const mcx = mouseRef.current.x;
          const mcy = mouseRef.current.y;
          const mdx = mcx - orb.x;
          const mdy = mcy - orb.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist > 5 && mDist < 300) {
            const strength = 0.12 * (1 - mDist / 300);
            orb.vx += (mdx / mDist) * strength;
            orb.vy += (mdy / mDist) * strength;
          }
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


        // wave mode: sinusoidal force creates undulating motion
        if (waveModeRef.current) {
          const wavePhase = now * 0.002;
          const waveFreq = 0.012;
          const waveForce = 0.35;
          orb.vy += Math.sin(orb.x * waveFreq + wavePhase) * waveForce;
          orb.vx += Math.cos(orb.y * waveFreq + wavePhase * 0.7) * waveForce * 0.3;
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

        // flow field: organic sine-based currents that create lava-lamp movement
        if (flowModeRef.current) {
          const t = now * 0.0003;
          const s1 = 0.008, s2 = 0.015;
          const a1 = Math.sin(orb.x * s1 + t) * Math.cos(orb.y * s1 + t * 0.7);
          const a2 = Math.cos(orb.x * s2 - t * 0.5) * Math.sin(orb.y * s2 + t * 0.9);
          const angle = (a1 + a2) * Math.PI;
          orb.vx += Math.cos(angle) * 0.08;
          orb.vy += Math.sin(angle) * 0.08;
          // gentle speed cap for dreamy movement
          const fSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (fSpeed > 3.5) {
            orb.vx *= 0.97;
            orb.vy *= 0.97;
          }
        }

        // tidal breathing: oscillating radial force (scatter ↔ gather)
        if (tidalModeRef.current) {
          const tidalPhase = Math.sin(now * 0.001 * (Math.PI * 2 / TIDAL_PERIOD));
          const tdx = orb.x - W * 0.5;
          const tdy = orb.y - H * 0.5;
          const tDist = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
          orb.vx += (tdx / tDist) * TIDAL_FORCE * tidalPhase;
          orb.vy += (tdy / tDist) * TIDAL_FORCE * tidalPhase;
          const tSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (tSpeed > TIDAL_DAMPING) {
            orb.vx *= 0.97;
            orb.vy *= 0.97;
          }
        }

        // swirl: persistent tangential vortex around canvas center
        if (swirlModeRef.current) {
          const swdx = orb.x - W * 0.5;
          const swdy = orb.y - H * 0.5;
          const swDist = Math.sqrt(swdx * swdx + swdy * swdy) || 1;
          // tangential force (perpendicular to radius vector)
          orb.vx += (-swdy / swDist) * SWIRL_FORCE;
          orb.vy += (swdx / swDist) * SWIRL_FORCE;
          // gentle inward pull to keep orbs from flying out
          orb.vx -= (swdx / swDist) * SWIRL_INWARD;
          orb.vy -= (swdy / swDist) * SWIRL_INWARD;
          const swSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (swSpeed > SWIRL_SPEED_CAP) {
            orb.vx *= 0.97;
            orb.vy *= 0.97;
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
            // Tap wave resonance: orb emits a colored ripple when the wave passes through
            if (!tw.hitOrbs) tw.hitOrbs = new Set();
            if (!tw.hitOrbs.has(orb.id)) {
              tw.hitOrbs.add(orb.id);
              ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
            }
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

        const fric = bounceModeRef.current ? 0.997 : FRICTION;
        orb.vx *= fric;
        orb.vy *= fric;
        const inBulletTime = bulletTimeRef.current > now;
        const speed_factor = slowMoRef.current ? 0.3 : inBulletTime ? 0.18 : 1;
        orb.x += orb.vx * speed_factor;
        orb.y += orb.vy * speed_factor;

        // sanitize non-finite values from division-by-zero edge cases
        if (!isFinite(orb.vx)) orb.vx = 0;
        if (!isFinite(orb.vy)) orb.vy = 0;
        if (!isFinite(orb.x)) orb.x = W / 2;
        if (!isFinite(orb.y)) orb.y = H / 2;

        // magma mode: orbs heat up over time and emit embers
        if (magmaModeRef.current) {
          orb.magma = Math.min((orb.magma || 0) + 0.0004, 1);
          if (orb.magma > 0.5 && Math.random() < orb.magma * 0.012 && mergeSparksRef.current.length < 400) {
            mergeSparksRef.current.push({
              x: orb.x + (Math.random() - 0.5) * orb.radius,
              y: orb.y - orb.radius * 0.4,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -Math.random() * 2 - 0.3,
              color: orb.magma > 0.8 ? '#ffdd44' : '#ff6600',
              size: 1.2 + Math.random() * 1.8,
              born: now,
            });
          }
        } else if (orb.magma) {
          orb.magma = Math.max(orb.magma - 0.002, 0);
        }

        // track idle time for drowsy eye expression
        {
          const spd = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          orb.idleFrames = spd < 0.5 ? (orb.idleFrames || 0) + 1 : 0;

          // fission mode: speed-triggered splitting
          if (fissionModeRef.current && spd > FISSION_SPEED_THRESHOLD
              && orb.radius > FISSION_MIN_RADIUS
              && (!orb.fissionCooldown || now - orb.fissionCooldown > FISSION_COOLDOWN)
              && orbsRef.current.length < 500
              && orb !== dragRef.current) {
            orb.fissionCooldown = now;
            const fragRadius = orb.radius / Math.sqrt(FISSION_FRAG_COUNT);
            const baseAngle = Math.atan2(orb.vy, orb.vx);
            for (let f = 0; f < FISSION_FRAG_COUNT; f++) {
              const angle = baseAngle + (Math.PI * 2 * f) / FISSION_FRAG_COUNT;
              const fragSpd = spd * 0.6 * (0.8 + Math.random() * 0.4);
              fissionFrags.push({
                id: Date.now() + Math.random() + f,
                x: orb.x + Math.cos(angle) * fragRadius,
                y: orb.y + Math.sin(angle) * fragRadius,
                vx: Math.cos(angle) * fragSpd,
                vy: Math.sin(angle) * fragSpd,
                radius: fragRadius,
                color: orb.color,
                pulsePhase: Math.random() * Math.PI * 2,
                polarity: Math.random() < 0.5 ? 1 : -1,
                fissionCooldown: now,
              });
            }
            flashesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, radius: orb.radius * 1.5, born: now });
            for (let s = 0; s < 4; s++) {
              const sAngle = Math.random() * Math.PI * 2;
              mergeSparksRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(sAngle) * spd * 0.8,
                vy: Math.sin(sAngle) * spd * 0.8,
                color: orb.color,
                size: 2 + Math.random() * 2,
                born: now,
              });
            }
            fissionRemove.add(orb);
            shakeRef.current = Math.max(shakeRef.current, 2);
          }
        }

        // trails mode: record position history
        if (trailsModeRef.current) {
          if (!orb.trail) orb.trail = [];
          orb.trail.push(orb.x, orb.y);
          if (orb.trail.length > 80) orb.trail.splice(0, 2); // keep last 40 positions
        }

        // fizz mode: orbs slowly shrink and pop
        if (fizzModeRef.current && !orb.spark) {
          const shrinkRate = 0.012 * speed_factor;
          orb.radius -= shrinkRate;
          // emit rising bubble particles
          if (Math.random() < 0.08 * speed_factor && mergeSparksRef.current.length < 400) {
            mergeSparksRef.current.push({
              x: orb.x + (Math.random() - 0.5) * orb.radius,
              y: orb.y - orb.radius,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -1.5 - Math.random() * 1.5,
              size: 1 + Math.random() * 1.5,
              color: orb.color,
              born: now,
              lifetime: 600 + Math.random() * 400,
            });
          }
          // pop when too small
          if (orb.radius < 3) {
            // burst of micro-sparks
            for (let sp = 0; sp < 6; sp++) {
              const angle = (Math.PI * 2 * sp) / 6;
              mergeSparksRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                size: 2,
                color: orb.color,
                born: now,
                lifetime: 300 + Math.random() * 200,
              });
            }
            ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
            fissionRemove.add(orb);
          }
        }

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

        // record position for comet trails (skip when trails mode uses its own format)
        if (!trailsModeRef.current) {
          if (!orb.trail) orb.trail = [];
          orb.trail.push({ x: orb.x, y: orb.y });
          if (orb.trail.length > LIGHT_TRAIL_LENGTH) orb.trail.shift();
        }

        // bounce off walls (or wrap around in wrap mode)
        if (wrapModeRef.current) {
          if (orb.x < -orb.radius) { orb.x = W + orb.radius; ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now }); }
          else if (orb.x > W + orb.radius) { orb.x = -orb.radius; ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now }); }
          if (orb.y < -orb.radius) { orb.y = H + orb.radius; ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now }); }
          else if (orb.y > H + orb.radius) { orb.y = -orb.radius; ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now }); }
        } else {
          const preBounceSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
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
            { const si = Math.min(Math.abs(orb.vx) / 5, 1); if (si > 0.1) { orb.squishAmount = si; orb.squishAngle = 0; orb.squishBorn = now; } }
            orb.vx *= bounceModeRef.current ? -1.0 : -0.6;
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
            { const si = Math.min(Math.abs(orb.vx) / 5, 1); if (si > 0.1) { orb.squishAmount = si; orb.squishAngle = 0; orb.squishBorn = now; } }
            orb.vx *= bounceModeRef.current ? -1.0 : -0.6;
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
            { const si = Math.min(Math.abs(orb.vy) / 5, 1); if (si > 0.1) { orb.squishAmount = si; orb.squishAngle = Math.PI / 2; orb.squishBorn = now; } }
            orb.vy *= bounceModeRef.current ? -1.0 : -0.6;
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
            { const si = Math.min(Math.abs(orb.vy) / 5, 1); if (si > 0.1) { orb.squishAmount = si; orb.squishAngle = Math.PI / 2; orb.squishBorn = now; } }
            orb.vy *= bounceModeRef.current ? -1.0 : -0.6;
          }

          // wall shatter — high-speed impacts break the orb into smaller pieces
          if (preBounceSpeed > WALL_SHATTER_SPEED && orb.radius >= WALL_SHATTER_MIN_RADIUS
              && (!orb.shatterBorn || now - orb.shatterBorn > WALL_SHATTER_COOLDOWN)
              && orbs.length < WALL_SHATTER_ORB_CAP) {
            const atWall = orb.x <= orb.radius + 1 || orb.x >= W - orb.radius - 1
                        || orb.y <= orb.radius + 1 || orb.y >= H - orb.radius - 1;
            if (atWall) {
              const childR = orb.radius * WALL_SHATTER_CHILD_SCALE;
              orb.radius = childR;
              orb.shatterBorn = now;
              for (let si = 0; si < 2; si++) {
                const a = Math.random() * Math.PI * 2;
                const sp = 2 + Math.random() * 3;
                const child = createOrb(orb.x, orb.y);
                child.radius = childR;
                child.color = orb.color;
                child.vx = orb.vx + Math.cos(a) * sp;
                child.vy = orb.vy + Math.sin(a) * sp;
                child.shatterBorn = now;
                orbsRef.current.push(child);
              }
              wavesRef.current.push({ cx: orb.x, cy: orb.y, radius: 0, color: orb.color, generation: 1 });
              shakeRef.current = Math.max(shakeRef.current, 8);
              setOrbCount(orbsRef.current.length);
            }
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
          setBlackHoleActive(false);
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

      // ── Cascade pop: burst-spawned orbs spawn mini-orbs after a delay ──
      {
        let popped = false;
        for (const orb of orbs) {
          if (orb.popAt && now > orb.popAt) {
            orb.popAt = null;
            const count = 2 + Math.floor(Math.random() * 2); // 2-3 sub-orbs
            for (let i = 0; i < count; i++) {
              const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
              const spd = 2 + Math.random() * 2;
              const sub = createOrb(orb.x, orb.y);
              sub.radius = Math.max(4, orb.radius * 0.55);
              sub.color = orb.color;
              sub.vx = orb.vx * 0.3 + Math.cos(angle) * spd;
              sub.vy = orb.vy * 0.3 + Math.sin(angle) * spd;
              orbsRef.current.push(sub);
            }
            ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
            for (let s = 0; s < 3; s++) {
              const sAngle = Math.random() * Math.PI * 2;
              mergeSparksRef.current.push({
                x: orb.x, y: orb.y,
                vx: Math.cos(sAngle) * 3,
                vy: Math.sin(sAngle) * 3,
                color: orb.color,
                size: 1.5 + Math.random(),
                born: now,
              });
            }
            shakeRef.current = Math.max(shakeRef.current, 2);
            popped = true;
          }
        }
        if (popped) {
          setOrbCount(orbsRef.current.length);
          playFirePop();
        }
      }

      // merge overlapping orbs
      const toRemove = new Set();
      const volatileFrags = [];
      const volatileRemove = new Set();
      const magmaEruptFrags = [];
      const magmaEruptRemove = new Set();
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
          const touchDist = a.radius + b.radius;
          // elastic bounce — orbs ricochet off each other like billiard balls
          if (dist < touchDist && dist >= smaller * MERGE_DIST_FACTOR && dist > 0.1) {
            const nx = dx / dist;
            const ny = dy / dist;
            // relative velocity along collision normal
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dvn = dvx * nx + dvy * ny;
            // only bounce if approaching (not separating)
            if (dvn > 0) {
              const massA = a.radius * a.radius;
              const massB = b.radius * b.radius;
              const totalMass = massA + massB;
              const restitution = bounceModeRef.current ? 1.0 : BOUNCE_RESTITUTION;
              const impulse = (2 * dvn * restitution) / totalMass;
              a.vx -= impulse * massB * nx;
              a.vy -= impulse * massB * ny;
              b.vx += impulse * massA * nx;
              b.vy += impulse * massA * ny;
              // separate orbs so they don't overlap
              const overlap = touchDist - dist;
              if (overlap > 0) {
                const sep = overlap / 2 + 0.5;
                a.x += nx * sep;
                a.y += ny * sep;
                b.x -= nx * sep;
                b.y -= ny * sep;
              }
              // collision color blending — orbs subtly mix colors on impact
              const blendAmt = 0.08 + Math.min(Math.sqrt(dvx * dvx + dvy * dvy) / 20, 0.12);
              const newColorA = blendHexColors(a.color, b.color, blendAmt);
              const newColorB = blendHexColors(b.color, a.color, blendAmt);
              a.color = newColorA;
              b.color = newColorB;
              // contact point for visual effects
              const cx = (a.x + b.x) / 2;
              const cy = (a.y + b.y) / 2;
              const relSpeed = Math.sqrt(dvx * dvx + dvy * dvy);
              // collision glow — orbs flash bright on impact
              a.hitGlow = Math.max(a.hitGlow || 0, Math.min(relSpeed / 4, 1));
              b.hitGlow = Math.max(b.hitGlow || 0, Math.min(relSpeed / 4, 1));
              // bounce sparks at contact point
              const sparkColors = [a.color, b.color];
              for (let s = 0; s < BOUNCE_SPARK_COUNT; s++) {
                const perpAngle = Math.atan2(ny, nx) + Math.PI / 2;
                const angle = perpAngle + (Math.random() - 0.5) * 2.2;
                const spd = BOUNCE_SPARK_SPEED * (0.5 + Math.random()) * Math.min(relSpeed / 4, 1.5);
                mergeSparksRef.current.push({
                  x: cx, y: cy,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  color: sparkColors[s % 2],
                  size: BOUNCE_SPARK_SIZE * (0.6 + Math.random() * 0.6),
                  born: now,
                  lifetime: BOUNCE_SPARK_LIFETIME,
                });
              }
              // screen shake for energetic bounces
              if (relSpeed > BOUNCE_SHAKE_THRESHOLD) {
                const shakeAmt = Math.min(relSpeed / 10, 1) * BOUNCE_SHAKE_INTENSITY;
                shakeRef.current = Math.max(shakeRef.current, Math.floor(shakeAmt));
              }
              // impact squish on both orbs
              const squishI = Math.min(relSpeed / 8, 1);
              if (squishI > 0.1) {
                const collAngle = Math.atan2(ny, nx);
                a.squishAmount = squishI; a.squishAngle = collAngle; a.squishBorn = now;
                b.squishAmount = squishI; b.squishAngle = collAngle; b.squishBorn = now;
              }
              // collision ripple ring at contact point
              if (relSpeed > 1.5) {
                ripplesRef.current.push({ x: cx, y: cy, color: sparkColors[Math.floor(Math.random() * 2)], born: now });
              }
              // impact scorch mark at collision point
              if (relSpeed > SCORCH_SPEED_MIN) {
                const scorchT = Math.min((relSpeed - SCORCH_SPEED_MIN) / 10, 1);
                const scorchR = SCORCH_RADIUS_MIN + scorchT * (SCORCH_RADIUS_MAX - SCORCH_RADIUS_MIN);
                scorchMarksRef.current.push({ x: cx, y: cy, radius: scorchR, color: blendHexColors(a.color, b.color, 0.5), born: now });
                if (scorchMarksRef.current.length > SCORCH_MAX) scorchMarksRef.current.shift();
              }
              // floating impact number at collision point
              if (relSpeed > IMPACT_NUM_MIN_SPEED && impactNumsRef.current.length < 30) {
                const val = Math.round(relSpeed * 10);
                impactNumsRef.current.push({ x: cx, y: cy, value: val, color: blendHexColors(a.color, b.color, 0.5), born: now });
              }
              // play musical chime on orb-orb collision (pentatonic note mapped to Y)
              if (relSpeed > 2) playCollisionChime(cy, H, Math.min(relSpeed / 6, 1));
              // chain react: energetic bounces emit mini-shockwaves
              if (chainReactModeRef.current && relSpeed > 5) {
                wavesRef.current.push({
                  cx, cy, radius: 0, color: sparkColors[0],
                  generation: 3, hitOrbs: new Set([a.id, b.id]),
                  delay: 3,
                });
              }
              // volatile mode: high-energy bounces shatter orbs into fragments
              if (volatileModeRef.current && relSpeed > 3) {
                const candidates = [a, b];
                for (const orb of candidates) {
                  if (orb.radius > VOLATILE_MIN_RADIUS && Math.random() < VOLATILE_POP_CHANCE && orbsRef.current.length < 500) {
                    const fragRadius = orb.radius / Math.sqrt(VOLATILE_FRAG_COUNT);
                    for (let f = 0; f < VOLATILE_FRAG_COUNT; f++) {
                      const angle = (Math.PI * 2 * f) / VOLATILE_FRAG_COUNT + (Math.random() - 0.5) * 0.8;
                      const spd = VOLATILE_FRAG_SPEED * (0.7 + Math.random() * 0.6);
                      volatileFrags.push({
                        id: Date.now() + Math.random() + f,
                        x: orb.x + Math.cos(angle) * fragRadius,
                        y: orb.y + Math.sin(angle) * fragRadius,
                        vx: orb.vx + Math.cos(angle) * spd,
                        vy: orb.vy + Math.sin(angle) * spd,
                        radius: fragRadius,
                        color: orb.color,
                        pulsePhase: Math.random() * Math.PI * 2,
                        polarity: Math.random() < 0.5 ? 1 : -1,
                      });
                    }
                    // flash + sparks at pop point
                    flashesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, radius: orb.radius * 1.3, born: now });
                    for (let s = 0; s < 6; s++) {
                      const sAngle = Math.random() * Math.PI * 2;
                      mergeSparksRef.current.push({
                        x: orb.x, y: orb.y,
                        vx: Math.cos(sAngle) * VOLATILE_FRAG_SPEED * 1.2,
                        vy: Math.sin(sAngle) * VOLATILE_FRAG_SPEED * 1.2,
                        color: orb.color,
                        size: 2 + Math.random() * 2,
                        born: now,
                      });
                    }
                    shakeRef.current = Math.max(shakeRef.current, 3);
                    volatileRemove.add(orb);
                  }
                }
              }
            }
          } else if (dist < smaller * MERGE_DIST_FACTOR) {
            // magma eruption: two very hot orbs collide and explode into cold fragments
            if (magmaModeRef.current && (a.magma || 0) > 0.75 && (b.magma || 0) > 0.75 && orbsRef.current.length < 500) {
              const cx = (a.x + b.x) / 2;
              const cy = (a.y + b.y) / 2;
              const combinedArea = Math.PI * (a.radius * a.radius + b.radius * b.radius);
              const fragCount = 5 + Math.floor(Math.random() * 4);
              const hotColors = ['#ff4400', '#ff8800', '#ffcc00', '#ffffff'];
              for (let f = 0; f < fragCount; f++) {
                const angle = (Math.PI * 2 * f) / fragCount + (Math.random() - 0.5) * 0.5;
                const spd = 4 + Math.random() * 5;
                magmaEruptFrags.push({
                  id: Date.now() + Math.random() + f,
                  x: cx + Math.cos(angle) * 5,
                  y: cy + Math.sin(angle) * 5,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  radius: Math.sqrt(combinedArea / (fragCount * Math.PI)) * (0.7 + Math.random() * 0.6),
                  color: hotColors[Math.floor(Math.random() * hotColors.length)],
                  pulsePhase: Math.random() * Math.PI * 2,
                  polarity: Math.random() < 0.5 ? 1 : -1,
                  born: now,
                  magma: 0,
                });
              }
              flashesRef.current.push({ x: cx, y: cy, color: '#ff6600', radius: Math.max(a.radius, b.radius) * 3, born: now });
              ripplesRef.current.push({ x: cx, y: cy, color: '#ff8800', born: now });
              shakeRef.current = Math.max(shakeRef.current, 12);
              for (let s = 0; s < 14; s++) {
                const sa = Math.random() * Math.PI * 2;
                const ss = 3 + Math.random() * 5;
                mergeSparksRef.current.push({ x: cx, y: cy, vx: Math.cos(sa) * ss, vy: Math.sin(sa) * ss, color: hotColors[Math.floor(Math.random() * 3)], size: 2.5 + Math.random() * 3, born: now });
              }
              magmaEruptRemove.add(a);
              magmaEruptRemove.add(b);
              playBoom(0.5);
              continue;
            }
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
            bigger.mergedAt = now;
            // merge color blending — absorb lesser orb's color proportionally
            const lesserRatio = lesser.radius / (bigger.radius + lesser.radius);
            bigger.color = blendHexColors(bigger.color, lesser.color, lesserRatio * 0.6);
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
              // merge scorch mark
              const mScorchT = Math.min(collisionSpeed / 12, 1);
              const mScorchR = SCORCH_RADIUS_MIN + mScorchT * (SCORCH_RADIUS_MAX - SCORCH_RADIUS_MIN);
              scorchMarksRef.current.push({ x: bigger.x, y: bigger.y, radius: mScorchR * 1.2, color: bigger.color, born: now });
              if (scorchMarksRef.current.length > SCORCH_MAX) scorchMarksRef.current.shift();
              shakeRef.current = Math.max(shakeRef.current, Math.floor(3 + intensity * 5));
              // chain react: energetic merges spawn a small shockwave ring
              if (chainReactModeRef.current && collisionSpeed > 4) {
                wavesRef.current.push({
                  cx: bigger.x, cy: bigger.y,
                  radius: 0, color: bigger.color,
                  generation: 2, hitOrbs: new Set([bigger.id]),
                  delay: 4,
                });
              }
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
      // volatile mode: apply deferred fission (remove popped orbs, add fragments)
      if (volatileRemove.size > 0) {
        orbsRef.current = orbsRef.current.filter((o) => !volatileRemove.has(o));
        orbsRef.current.push(...volatileFrags);
        setOrbCount(orbsRef.current.length);
      }
      // magma eruption: apply deferred eruptions
      if (magmaEruptRemove.size > 0) {
        orbsRef.current = orbsRef.current.filter((o) => !magmaEruptRemove.has(o));
        orbsRef.current.push(...magmaEruptFrags);
        setOrbCount(orbsRef.current.length);
      }
      // fission mode: apply deferred speed-splits
      if (fissionRemove.size > 0) {
        orbsRef.current = orbsRef.current.filter((o) => !fissionRemove.has(o));
        orbsRef.current.push(...fissionFrags);
        setOrbCount(orbsRef.current.length);
      }

      // ── King's heartbeat: the largest orb periodically pulses, pushing nearby orbs ──
      if (orbs.length >= 2 && !frozenRef.current) {
        let kingOrb = null;
        let maxR = KING_HEARTBEAT_MIN_RADIUS;
        for (const orb of orbs) {
          if (!orb.spark && orb.radius > maxR) {
            maxR = orb.radius;
            kingOrb = orb;
          }
        }
        if (kingOrb && now - kingHeartbeatTimerRef.current >= KING_HEARTBEAT_INTERVAL) {
          kingHeartbeatTimerRef.current = now;
          // push nearby orbs outward
          const strength = KING_HEARTBEAT_FORCE * Math.min(kingOrb.radius / 30, 1.5);
          for (const orb of orbs) {
            if (orb === kingOrb) continue;
            const dx = orb.x - kingOrb.x;
            const dy = orb.y - kingOrb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0 && dist < KING_HEARTBEAT_RANGE) {
              const falloff = 1 - dist / KING_HEARTBEAT_RANGE;
              const push = strength * falloff * falloff;
              orb.vx += (dx / dist) * push;
              orb.vy += (dy / dist) * push;
            }
          }
          // spawn visual ring
          kingHeartbeatRingsRef.current.push({
            x: kingOrb.x, y: kingOrb.y, born: now, color: kingOrb.color,
          });
        }
        // ── Subjects flee the king: small orbs scurry away in fear ──
        if (kingOrb) {
          const fleeThreshold = kingOrb.radius * KING_FLEE_RATIO;
          for (const orb of orbs) {
            if (orb === kingOrb || orb.spark) { orb.nearKing = false; continue; }
            if (orb.radius < fleeThreshold) {
              const dx = orb.x - kingOrb.x;
              const dy = orb.y - kingOrb.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0 && dist < KING_FLEE_RANGE) {
                const falloff = 1 - dist / KING_FLEE_RANGE;
                const force = KING_FLEE_FORCE * falloff * falloff;
                orb.vx += (dx / dist) * force;
                orb.vy += (dy / dist) * force;
                orb.nearKing = true;
                orb.kingAngle = Math.atan2(kingOrb.y - orb.y, kingOrb.x - orb.x);
                continue;
              }
            }
            orb.nearKing = false;
          }
        }
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
        const crDecay = chainReactModeRef.current ? 0.7 : CASCADE_FORCE_DECAY;
        const genForceMultiplier = Math.pow(crDecay, gen);
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
            if (!wave.hitOrbs.has(orb.id)) {
              wave.hitOrbs.add(orb.id);
              orb.waveHit = now;
              const crMaxGen = chainReactModeRef.current ? 5 : CASCADE_MAX_GEN;
              const crThreshold = chainReactModeRef.current ? 1.5 : CASCADE_SPEED_THRESHOLD;
              if (gen < crMaxGen) {
                const orbSpeed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
                if (orbSpeed > crThreshold) {
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
          // scared flee: orbs ahead of the wave scatter away before impact
          const fearEdge = wave.radius + genWidth;
          if (dist > fearEdge && dist < fearEdge + WAVE_FEAR_RANGE && dist > 0) {
            const fearT = 1 - (dist - fearEdge) / WAVE_FEAR_RANGE;
            const fleeForce = WAVE_FEAR_FORCE * fearT * fearT * genForceMultiplier;
            orb.vx += (dx / dist) * fleeForce;
            orb.vy += (dy / dist) * fleeForce;
          }
        }
        // Flare background stars as shockwave passes through them
        for (const star of starsRef.current) {
          const stx = star.x * W, sty = star.y * H;
          const sdx = stx - wave.cx, sdy = sty - wave.cy;
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (sDist > wave.radius - WAVE_SPEED * 3 && sDist < wave.radius + WAVE_SPEED * 3 && wave.radius > 0) {
            const intensity = Math.max(0, 0.8 * (1 - wave.radius / maxWaveRadius));
            star.flare = Math.max(star.flare, intensity);
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
            if (dist > wave.radius - genWidth && dist < wave.radius + genWidth && gen < (chainReactModeRef.current ? 5 : CASCADE_MAX_GEN)) {
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


      // ── Tide (horizontal sweep wave) ────────────────────────────────
      tidesRef.current = tidesRef.current.filter((t) => {
        return t.dir === 1 ? t.x < W + TIDE_WIDTH : t.x > -TIDE_WIDTH;
      });
      for (const tide of tidesRef.current) {
        tide.x += TIDE_SPEED * tide.dir;
        // Apply force to orbs within the sweep band
        for (const orb of orbs) {
          if (orb === dragRef.current) continue;
          const dx = orb.x - tide.x;
          if (Math.abs(dx) < TIDE_WIDTH) {
            const proximity = 1 - Math.abs(dx) / TIDE_WIDTH;
            // Sine modulation based on Y position for wave shape
            const sinMod = Math.sin(orb.y * TIDE_SINE_FREQ + tide.x * 0.02);
            const lift = TIDE_FORCE * proximity * proximity;
            orb.vy -= lift * (0.7 + sinMod * TIDE_SINE_AMP * 0.3);
            orb.vx += tide.dir * lift * 0.3;
          }
        }
        // Draw the sweep band
        const progress = tide.dir === 1 ? tide.x / W : 1 - tide.x / W;
        const alpha = 0.4 * (1 - progress * 0.5);
        if (alpha > 0.01) {
          const grad = ctx.createLinearGradient(
            tide.x - TIDE_WIDTH, 0, tide.x + TIDE_WIDTH, 0
          );
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.3, tide.color + hexAlpha(alpha * 0.4 * 255));
          grad.addColorStop(0.5, tide.color + hexAlpha(alpha * 255));
          grad.addColorStop(0.7, tide.color + hexAlpha(alpha * 0.4 * 255));
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(tide.x - TIDE_WIDTH, 0, TIDE_WIDTH * 2, H);
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
            ? warpColor + hexAlpha(alpha * 255)
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
            ? warpColor + hexAlpha(alpha * 255)
            : `rgba(102, 126, 234, ${alpha})`;
          ctx.stroke();
        }
      }

      // draw trails — smooth gradient fade from tail to head
      if (trailsModeRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        for (const orb of orbs) {
          const t = orb.trail;
          if (!t || t.length < 4) continue;
          const pts = t.length / 2;
          // batch into 4 segments for performance (tail → mid-low → mid-high → head)
          const bands = [
            { from: 0, to: Math.floor(pts * 0.4), alpha: 0.12, width: 0.25 },
            { from: Math.floor(pts * 0.4), to: Math.floor(pts * 0.65), alpha: 0.25, width: 0.4 },
            { from: Math.floor(pts * 0.65), to: Math.floor(pts * 0.85), alpha: 0.45, width: 0.6 },
            { from: Math.floor(pts * 0.85), to: pts - 1, alpha: 0.75, width: 0.8 },
          ];
          for (const band of bands) {
            if (band.from >= band.to) continue;
            ctx.beginPath();
            ctx.moveTo(t[band.from * 2], t[band.from * 2 + 1]);
            for (let i = band.from + 1; i <= band.to; i++) {
              ctx.lineTo(t[i * 2], t[i * 2 + 1]);
            }
            ctx.lineWidth = Math.max(0.5, orb.radius * band.width);
            ctx.strokeStyle = orb.color + hexAlpha(Math.floor(band.alpha * 255));
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // ── Cursor comet trail ──
      {
        const ct = cursorTrailRef.current;
        const TRAIL_LIFE = 600;
        while (ct.length > 0 && now - ct[0].t > TRAIL_LIFE) ct.shift();
        if (ct.length > 1 && mouseRef.current.onCanvas) {
          ctx.save();
          ctx.lineCap = 'round';
          ctx.globalCompositeOperation = 'lighter';
          const colors = PALETTES[paletteIndex].colors;
          for (let i = 1; i < ct.length; i++) {
            const age = now - ct[i].t;
            const life = 1 - age / TRAIL_LIFE;
            const alpha = life * life * 0.45;
            const width = life * 3.5 + 0.5;
            if (alpha <= 0) continue;
            const c = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(ct[i - 1].x, ct[i - 1].y);
            ctx.lineTo(ct[i].x, ct[i].y);
            ctx.strokeStyle = c + hexAlpha(alpha * 255);
            ctx.lineWidth = width;
            ctx.stroke();
            // spawn shimmer particles along trail (sparse)
            if (i % 4 === 0 && life > 0.5 && cursorWakeRef.current.length < 80) {
              const angle = Math.random() * Math.PI * 2;
              const drift = 0.3 + Math.random() * 0.5;
              cursorWakeRef.current.push({
                x: ct[i].x, y: ct[i].y,
                vx: Math.cos(angle) * drift,
                vy: Math.sin(angle) * drift,
                born: now, color: c,
                size: 1 + Math.random() * 1.5,
              });
            }
          }
          // soft glow at cursor head
          const head = ct[ct.length - 1];
          const headAge = now - head.t;
          if (headAge < 150) {
            const ha = (1 - headAge / 150) * 0.25;
            const hg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 18);
            hg.addColorStop(0, `rgba(220, 225, 255, ${ha})`);
            hg.addColorStop(1, 'rgba(220, 225, 255, 0)');
            ctx.beginPath();
            ctx.arc(head.x, head.y, 18, 0, Math.PI * 2);
            ctx.fillStyle = hg;
            ctx.fill();
          }
          ctx.restore();
        }
        // draw cursor wake shimmer particles
        const wake = cursorWakeRef.current;
        const WAKE_LIFE = 900;
        for (let wi = wake.length - 1; wi >= 0; wi--) {
          const p = wake[wi];
          const age = now - p.born;
          if (age > WAKE_LIFE) { wake.splice(wi, 1); continue; }
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.01; // gentle gravity drift
          const life = 1 - age / WAKE_LIFE;
          const alpha = life * life * 0.6;
          const r = p.size * life;
          if (alpha <= 0 || r < 0.3) { wake.splice(wi, 1); continue; }
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
          g.addColorStop(0, p.color + hexAlpha(alpha * 255));
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          ctx.restore();
        }
      }

      // ── Magnet cursor field indicator ──
      if (magnetCursorRef.current && mouseRef.current.onCanvas) {
        const mcx = mouseRef.current.x;
        const mcy = mouseRef.current.y;
        const pulse = 0.5 + 0.5 * Math.sin(time * 3);
        const fieldR = 60 + pulse * 20;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const mg = ctx.createRadialGradient(mcx, mcy, 0, mcx, mcy, fieldR);
        mg.addColorStop(0, `rgba(245, 158, 11, ${0.08 + pulse * 0.04})`);
        mg.addColorStop(0.6, `rgba(245, 158, 11, ${0.03 + pulse * 0.02})`);
        mg.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.beginPath();
        ctx.arc(mcx, mcy, fieldR, 0, Math.PI * 2);
        ctx.fillStyle = mg;
        ctx.fill();
        // thin ring at range boundary
        const ringAlpha = 0.1 + pulse * 0.06;
        ctx.beginPath();
        ctx.arc(mcx, mcy, 300, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${ringAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.restore();
      }

      // echo mode: stroboscopic afterimages at recent positions
      if (echoModeRef.current) {
        for (const orb of orbs) {
          const trail = orb.trail;
          if (!trail || trail.length < 3 || !trail[0].x) continue;
          const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
          if (speed < 0.5) continue;
          const step = Math.max(1, Math.floor(trail.length / 7));
          for (let i = 0; i < trail.length - 1; i += step) {
            const t = trail[i];
            const progress = i / trail.length;
            const alpha = progress * progress * 0.25;
            const scale = 0.4 + progress * 0.5;
            const r = orb.radius * scale;
            const echoGrad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r * 1.8);
            echoGrad.addColorStop(0, orb.color + hexAlpha(alpha * 255));
            echoGrad.addColorStop(0.5, orb.color + hexAlpha(alpha * 100));
            echoGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(t.x, t.y, r * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = echoGrad;
            ctx.fill();
          }
        }
      }

      // draw plasma links between nearby orbs
      if (linksModeRef.current && orbs.length >= 2) {
        const LINK_RANGE = 140;
        const LINK_RANGE_SQ = LINK_RANGE * LINK_RANGE;
        ctx.save();
        ctx.lineCap = "round";
        for (let i = 0; i < orbs.length; i++) {
          const a = orbs[i];
          for (let j = i + 1; j < orbs.length; j++) {
            const b = orbs[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > LINK_RANGE_SQ) continue;
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / LINK_RANGE;
            const alpha = t * t * 0.7;
            // pulse shimmer
            const shimmer = 0.85 + 0.15 * Math.sin(time * 3 + i * 0.7 + j * 1.3);
            const finalAlpha = alpha * shimmer;
            // wide glow layer
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color + hexAlpha(finalAlpha * 0.3 * 255);
            ctx.lineWidth = 6 * t;
            ctx.stroke();
            // bright core line
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = b.color + hexAlpha(finalAlpha * 255);
            ctx.lineWidth = 1.5 * t + 0.5;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // draw string springs as glowing elastic lines
      if (springsRef.current.length > 0) {
        const orbById = new Map();
        for (const o of orbs) orbById.set(o.id, o);
        ctx.save();
        ctx.lineCap = "round";
        for (const sp of springsRef.current) {
          const a = orbById.get(sp.idA);
          const b = orbById.get(sp.idB);
          if (!a || !b) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const stretch = dist / sp.restLength;
          // alpha fades as spring stretches toward breaking
          const tension = Math.min(stretch / 3.5, 1);
          const alpha = (1 - tension * 0.7) * 0.9;
          // color shifts from orb color to warm red when stretched
          const hue = stretch > 1.5 ? `hsl(${Math.max(0, 40 - (stretch - 1.5) * 30)}, 90%, 65%)` : a.color;
          // wide glow
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hue + (hue.startsWith('#') ? hexAlpha(alpha * 0.3 * 255) : '');
          if (!hue.startsWith('#')) ctx.globalAlpha = alpha * 0.3;
          ctx.lineWidth = 6 * (1 - tension * 0.5);
          ctx.stroke();
          ctx.globalAlpha = 1;
          // bright core
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = b.color + hexAlpha(alpha * 255);
          ctx.lineWidth = 2 * (1 - tension * 0.3);
          ctx.stroke();
        }
        ctx.restore();
      }

      // draw gravity threads — show n-body attraction between nearby orbs
      if (nbodyModeRef.current && orbs.length >= 2 && orbs.length < 200) {
        const VIS_RANGE = 140;
        const VIS_RANGE_SQ = VIS_RANGE * VIS_RANGE;
        ctx.save();
        ctx.lineCap = "round";
        for (let i = 0; i < orbs.length; i++) {
          const a = orbs[i];
          if (a.spark) continue;
          for (let j = i + 1; j < orbs.length; j++) {
            const b = orbs[j];
            if (b.spark) continue;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > VIS_RANGE_SQ) continue;
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / VIS_RANGE;
            // gravity ∝ 1/r² — closer orbs get brighter threads
            const alpha = t * t * 0.35;
            if (alpha < 0.02) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color + hexAlpha(alpha * 255);
            ctx.lineWidth = t * 1.5;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // draw impact scorch marks
      scorchMarksRef.current = scorchMarksRef.current.filter((s) => now - s.born < SCORCH_DURATION);
      for (const scorch of scorchMarksRef.current) {
        const age = (now - scorch.born) / SCORCH_DURATION;
        const alpha = (1 - age) * (1 - age); // quadratic fade-out
        const pulse = 1 + 0.08 * Math.sin(now * 0.003 + scorch.x * 0.1); // gentle breathing
        const r = scorch.radius * pulse;
        const grad = ctx.createRadialGradient(scorch.x, scorch.y, 0, scorch.x, scorch.y, r);
        grad.addColorStop(0, scorch.color + hexAlpha(alpha * 0.35 * 255));
        grad.addColorStop(0.5, scorch.color + hexAlpha(alpha * 0.15 * 255));
        grad.addColorStop(1, scorch.color + hexAlpha(0));
        ctx.beginPath();
        ctx.arc(scorch.x, scorch.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // draw echo ghosts
      {
        const ghosts = ghostsRef.current;
        for (let gi = ghosts.length - 1; gi >= 0; gi--) {
          const ghost = ghosts[gi];
          const age = (now - ghost.born) / 2000;
          if (age >= 1) { ghosts.splice(gi, 1); continue; }
          const alpha = (1 - age) * (1 - age) * 0.35;
          const gr = ghost.radius * (1 + age * 0.3);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(ghost.x, ghost.y, gr, 0, Math.PI * 2);
          ctx.fillStyle = ghost.color;
          ctx.fill();
          // soft glow ring
          if (alpha > 0.1) {
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, gr + 4, 0, Math.PI * 2);
            ctx.strokeStyle = ghost.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = alpha * 0.4;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      // ── Gravity shadows: orbs cast soft shadows on the surface they fall toward ──
      if (gravityRef.current && !gyroModeRef.current) {
        const gDir = gravityDirRef.current;
        for (const orb of orbs) {
          let dist, sx, sy, sw, sh;
          if (gDir === "down") {
            dist = H - orb.y;
            sx = orb.x;
            sy = H - 2;
            sw = orb.radius * (0.6 + 0.4 * (1 - dist / H));
            sh = sw * 0.3;
          } else if (gDir === "up") {
            dist = orb.y;
            sx = orb.x;
            sy = 2;
            sw = orb.radius * (0.6 + 0.4 * (1 - dist / H));
            sh = sw * 0.3;
          } else if (gDir === "right") {
            dist = W - orb.x;
            sx = W - 2;
            sy = orb.y;
            sh = orb.radius * (0.6 + 0.4 * (1 - dist / W));
            sw = sh * 0.3;
          } else {
            dist = orb.x;
            sx = 2;
            sy = orb.y;
            sh = orb.radius * (0.6 + 0.4 * (1 - dist / W));
            sw = sh * 0.3;
          }
          const maxDist = (gDir === "down" || gDir === "up") ? H : W;
          const alpha = Math.max(0, 0.18 * (1 - dist / maxDist));
          if (alpha < 0.01 || sw < 0.5 || sh < 0.5) continue;
          ctx.beginPath();
          ctx.ellipse(sx, sy, sw, sh, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // draw orbs
      // pre-compute beat pulse factor for orb size
      let beatOrbPulse = 0;
      {
        const beat = beatRef.current;
        const taps = tapTimesRef.current;
        if (beat.strength > 0.1 && beat.interval > 0 && taps.length > 0) {
          const elapsed = now - taps[taps.length - 1];
          const fade = Math.max(0, 1 - elapsed / (beat.interval * 6));
          const phase = (elapsed % beat.interval) / beat.interval;
          beatOrbPulse = Math.exp(-phase * 4) * beat.strength * fade * 0.08;
        }
      }
      for (const orb of orbs) {
        const pulse = 1 + 0.12 * Math.sin(time * 1.5 + orb.pulsePhase) + beatOrbPulse;

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

        // magma mode: shift orb color toward orange/white as heat increases
        const mc = magmaModeRef.current ? (orb.magma || 0) : 0;
        const orbColor = mc > 0.1 ? blendHexColors(orb.color, mc < 0.7 ? '#ff6600' : '#ffcc44', Math.min(mc * 1.1, 0.85)) : orb.color;

        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);

        // Mitosis wobble: large orbs near split threshold elongate and pulse
        const mitosisProgress = orb.radius > MITOSIS_WOBBLE_START
          ? Math.min((orb.radius - MITOSIS_WOBBLE_START) / (COLLAPSE_RADIUS - MITOSIS_WOBBLE_START), 1)
          : 0;

        // Speed afterimage: fast-moving orbs leave ghostly trail copies
        if (speed > 3 && spawnT >= 1 && !orb.spark) {
          const trailN = Math.min(Math.floor(speed / 2), 5);
          for (let ti = trailN; ti >= 1; ti--) {
            const frac = ti / (trailN + 1);
            const gx = orb.x - orb.vx * ti * 2;
            const gy = orb.y - orb.vy * ti * 2;
            const ga = (1 - frac) * 0.18;
            const gr = r * (1 - frac * 0.3);
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fillStyle = orb.color + hexAlpha(ga * 255);
            ctx.fill();
          }
        }

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

        // impact squish: orbs deform like jello on collision then spring back
        if (orb.squishBorn) {
          const sqElapsed = (now - orb.squishBorn) / 1000;
          const sqDecay = Math.exp(-10 * sqElapsed);
          if (sqDecay > 0.01) {
            const sqOsc = Math.sin(18 * sqElapsed) * sqDecay * orb.squishAmount;
            ctx.rotate(orb.squishAngle);
            ctx.scale(1 - sqOsc * 0.3, 1 + sqOsc * 0.2);
            ctx.rotate(-orb.squishAngle);
          } else {
            orb.squishBorn = 0;
          }
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

        // collision flash: brief bright glow after impact, decays each frame
        const hitGlow = orb.hitGlow || 0;
        if (hitGlow > 0.01) orb.hitGlow = hitGlow * 0.9;
        else orb.hitGlow = 0;

        // outer glow (expands + brightens with speed, collision flash, and magma heat)
        const heat = Math.min(speed / 8 + hitGlow * 0.6 + mc * 0.4, 1);
        const glowR = r * (3 + heat * 3);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        grad.addColorStop(0, orbColor + hexAlpha(0x66 + heat * 0x55));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // speed corona: warm white glow when moving fast or after collision
        if (heat > 0.15 || hitGlow > 0.3) {
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
        coreGrad.addColorStop(0.3, orbColor);
        coreGrad.addColorStop(1, orbColor + "88");
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // ── living eyes: pupils track velocity / cursor ──
        if (r > 5) {
          const eyeR = Math.max(r * 0.18, 1.5);
          const eyeGap = r * 0.3;
          const pupilR = eyeR * 0.55;
          const isFrozen = frozenRef.current;
          const isZooming = speed > 6;
          // periodic eye blink for lifelike feel
          const blinkPeriod = 3.5 + (orb.pulsePhase % 1) * 3.5;
          const blinkT = (time + orb.pulsePhase * 37) % blinkPeriod;
          const isBlinking = blinkT < 0.13 && !isFrozen && !isZooming;
          // happy squint after absorbing another orb
          const isSatisfied = orb.mergedAt && now - orb.mergedAt < 400;
          // surprised wide eyes when hit by shockwave
          const isSurprised = orb.waveHit && now - orb.waveHit < 350;
          // scared: shockwave approaching but hasn't hit yet, or fleeing the king
          let isScared = false;
          let scareLookAng = 0;
          if (!isFrozen && !isSatisfied && !isSurprised) {
            for (let wi = 0; wi < wavesRef.current.length; wi++) {
              const w = wavesRef.current[wi];
              const wdx = orb.x - w.x;
              const wdy = orb.y - w.y;
              const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
              if (wDist > w.radius && wDist < w.radius + WAVE_SPEED * 14) {
                isScared = true;
                scareLookAng = Math.atan2(w.y - orb.y, w.x - orb.x);
                break;
              }
            }
            // small orbs near the king look up at it in fear
            if (!isScared && orb.nearKing) {
              isScared = true;
              scareLookAng = orb.kingAngle;
            }
          }
          // drowsy: orb has been idle for a while
          const isDrowsy = !isScared && !isFrozen && !isSatisfied && !isSurprised && (orb.idleFrames || 0) > 120;
          const drowsyT = isDrowsy ? Math.min(((orb.idleFrames || 0) - 120) / 90, 1) : 0;
          // dizzy after being spun
          const dizzyAge = orb.spunAt ? now - orb.spunAt : Infinity;
          const isDizzy = !isScared && !isFrozen && !isSatisfied && !isSurprised && dizzyAge > 300 && dizzyAge < 4000 && speed < 5;
          const dizzyIntensity = isDizzy ? Math.max(0, 1 - (dizzyAge - 300) / 3700) : 0;
          let lookAng;
          if (speed > 0.8) {
            lookAng = Math.atan2(orb.vy, orb.vx);
          } else {
            // Social gazing: orbs near cursor watch it; far orbs watch nearest neighbor
            let cursorNear = false;
            if (mouseRef.current.onCanvas) {
              const cdx = mouseRef.current.x - orb.x, cdy = mouseRef.current.y - orb.y;
              cursorNear = cdx * cdx + cdy * cdy < 250 * 250;
            }
            if (cursorNear) {
              lookAng = Math.atan2(mouseRef.current.y - orb.y, mouseRef.current.x - orb.x);
            } else if (orbs.length < 250) {
              let bestDist = 200 * 200;
              lookAng = time * 0.3 + orb.pulsePhase;
              for (let ni = 0; ni < orbs.length; ni++) {
                const other = orbs[ni];
                if (other === orb) continue;
                const ndx = other.x - orb.x, ndy = other.y - orb.y;
                const nd2 = ndx * ndx + ndy * ndy;
                if (nd2 < bestDist) {
                  bestDist = nd2;
                  lookAng = Math.atan2(ndy, ndx);
                }
              }
            } else {
              lookAng = time * 0.3 + orb.pulsePhase;
            }
          }
          const perp = lookAng + Math.PI * 0.5;
          const fwd = r * 0.1;
          const cx0 = Math.cos(lookAng) * fwd;
          const cy0 = Math.sin(lookAng) * fwd;
          for (const s of [-1, 1]) {
            const ex = cx0 + Math.cos(perp) * eyeGap * s;
            const ey = cy0 + Math.sin(perp) * eyeGap * s;
            if (isFrozen) {
              // sleepy half-closed eyes: gentle arc
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR, 0.15 * Math.PI, 0.85 * Math.PI);
              ctx.strokeStyle = "rgba(255,255,255,0.8)";
              ctx.lineWidth = Math.max(eyeR * 0.4, 0.8);
              ctx.stroke();
            } else if (isSatisfied) {
              // happy squint after merge: ^_^ upward arcs
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR * 0.7, 1.15 * Math.PI, 1.85 * Math.PI);
              ctx.strokeStyle = "rgba(255,255,255,0.85)";
              ctx.lineWidth = Math.max(eyeR * 0.35, 0.8);
              ctx.stroke();
            } else if (isSurprised) {
              // surprised: wide eyes with tiny pupils
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR * 1.15, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.95)";
              ctx.fill();
              ctx.beginPath();
              ctx.arc(ex, ey, pupilR * 0.45, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(8,8,24,0.9)";
              ctx.fill();
            } else if (isDizzy) {
              // dizzy: spiral eyes spinning in opposite directions per eye
              ctx.beginPath();
              for (let t = 0; t < 5 * Math.PI; t += 0.2) {
                const sr = (t / (5 * Math.PI)) * eyeR * 0.95;
                const sx = ex + sr * Math.cos(t + time * 6 * s);
                const sy = ey + sr * Math.sin(t + time * 6 * s);
                if (t === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
              }
              ctx.strokeStyle = `rgba(255,255,255,${(0.5 + dizzyIntensity * 0.4).toFixed(2)})`;
              ctx.lineWidth = Math.max(eyeR * 0.22, 0.6);
              ctx.stroke();
            } else if (isScared) {
              // scared: wide eyes with pinpoint pupils staring at approaching wave
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR * 1.25, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.95)";
              ctx.fill();
              const sPOff = eyeR * 0.3;
              ctx.beginPath();
              ctx.arc(ex + Math.cos(scareLookAng) * sPOff, ey + Math.sin(scareLookAng) * sPOff, pupilR * 0.3, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(8,8,24,0.9)";
              ctx.fill();
            } else if (isDrowsy) {
              // drowsy: eyelid gradually closes from the top
              const lidClose = drowsyT * eyeR * 1.4;
              ctx.save();
              ctx.beginPath();
              ctx.rect(ex - eyeR - 1, ey - eyeR + lidClose, (eyeR + 1) * 2, eyeR * 2 + 2);
              ctx.clip();
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.85)";
              ctx.fill();
              if (drowsyT < 0.9) {
                const dPOff = eyeR * 0.15;
                ctx.beginPath();
                ctx.arc(ex, ey + dPOff, pupilR * (1 - drowsyT * 0.4), 0, Math.PI * 2);
                ctx.fillStyle = "rgba(8,8,24,0.8)";
                ctx.fill();
              }
              ctx.restore();
            } else if (isBlinking) {
              // blink: curved closed-eye line
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR * 0.7, 0.05 * Math.PI, 0.95 * Math.PI);
              ctx.strokeStyle = "rgba(255,255,255,0.7)";
              ctx.lineWidth = Math.max(eyeR * 0.3, 0.7);
              ctx.stroke();
            } else if (isZooming) {
              // squinting eyes: narrow horizontal ellipse
              ctx.save();
              ctx.translate(ex, ey);
              ctx.rotate(lookAng);
              ctx.scale(1, 0.4);
              ctx.beginPath();
              ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.9)";
              ctx.fill();
              ctx.restore();
              const pOff = eyeR * 0.2;
              ctx.beginPath();
              ctx.arc(ex + Math.cos(lookAng) * pOff, ey + Math.sin(lookAng) * pOff, pupilR * 0.7, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(8,8,24,0.85)";
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.9)";
              ctx.fill();
              const pOff = eyeR * 0.25;
              ctx.beginPath();
              ctx.arc(ex + Math.cos(lookAng) * pOff, ey + Math.sin(lookAng) * pOff, pupilR, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(8,8,24,0.85)";
              ctx.fill();
            }
          }
          // ── tiny mouth: emotional expression ──
          if (r > 7) {
            const mx = cx0 * 0.35;
            const my = cy0 * 0.35;
            const mW = r * 0.13;
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(lookAng);
            if (isSurprised) {
              // shocked "O"
              ctx.beginPath();
              ctx.arc(0, 0, r * 0.07, 0, Math.PI * 2);
              ctx.strokeStyle = "rgba(255,255,255,0.55)";
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            } else if (isScared) {
              // worried "o"
              ctx.beginPath();
              ctx.arc(0, 0, r * 0.055, 0, Math.PI * 2);
              ctx.strokeStyle = "rgba(255,255,255,0.5)";
              ctx.lineWidth = Math.max(r * 0.035, 0.5);
              ctx.stroke();
            } else if (isDizzy) {
              // wobbly confused squiggle
              ctx.beginPath();
              ctx.moveTo(0, -mW * 0.7);
              for (let wt = -0.6; wt <= 0.6; wt += 0.15) {
                ctx.lineTo(Math.sin(time * 8 + wt * 5) * r * 0.035, mW * wt);
              }
              ctx.lineTo(0, mW * 0.7);
              ctx.strokeStyle = `rgba(255,255,255,${(0.3 + dizzyIntensity * 0.2).toFixed(2)})`;
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            } else if (isSatisfied) {
              // big grin after merge
              ctx.beginPath();
              ctx.moveTo(0, -mW);
              ctx.quadraticCurveTo(r * 0.12, 0, 0, mW);
              ctx.strokeStyle = "rgba(255,255,255,0.6)";
              ctx.lineWidth = Math.max(r * 0.05, 0.5);
              ctx.stroke();
            } else if (isFrozen) {
              // neutral straight line
              ctx.beginPath();
              ctx.moveTo(0, -mW * 0.55);
              ctx.lineTo(0, mW * 0.55);
              ctx.strokeStyle = "rgba(255,255,255,0.35)";
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            } else if (isDrowsy) {
              // peaceful, fading with sleep
              const mAlpha = 0.35 * (1 - drowsyT * 0.5);
              ctx.beginPath();
              ctx.moveTo(0, -mW * 0.4);
              ctx.quadraticCurveTo(r * 0.02, 0, 0, mW * 0.4);
              ctx.strokeStyle = `rgba(255,255,255,${mAlpha})`;
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            } else if (isZooming) {
              // determined grimace
              ctx.beginPath();
              ctx.moveTo(0, -mW * 0.45);
              ctx.quadraticCurveTo(-r * 0.03, 0, 0, mW * 0.45);
              ctx.strokeStyle = "rgba(255,255,255,0.35)";
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            } else {
              // default gentle smile
              ctx.beginPath();
              ctx.moveTo(0, -mW * 0.6);
              ctx.quadraticCurveTo(r * 0.05, 0, 0, mW * 0.6);
              ctx.strokeStyle = "rgba(255,255,255,0.3)";
              ctx.lineWidth = Math.max(r * 0.04, 0.5);
              ctx.stroke();
            }
            ctx.restore();
          }
          // Snoring z's for deeply sleeping orbs
          if (drowsyT > 0.8) {
            const zBase = (drowsyT - 0.8) * 5;
            const zT = time * 0.5 + orb.pulsePhase * 7;
            for (let zi = 0; zi < 3; zi++) {
              const zCycle = ((zT + zi * 2.1) % 3) / 3;
              const zFade = zCycle < 0.7 ? 1 : (1 - zCycle) / 0.3;
              const zSz = (5 + zi * 2) * (0.6 + zCycle * 0.4);
              const zX = -r * 0.3 + zi * r * 0.35 + Math.sin(zT + zi) * 3;
              const zY = -r - 4 - zCycle * 18 - zi * 5;
              ctx.globalAlpha = zFade * zBase * 0.5;
              ctx.font = `bold ${zSz}px sans-serif`;
              ctx.fillStyle = orb.color;
              ctx.fillText("z", zX, zY);
            }
            ctx.globalAlpha = 1;
          }
          // floating cartoon stars orbiting above dizzy orbs
          if (isDizzy && dizzyIntensity > 0.15) {
            const starCount = 3;
            const orbitR = r * 0.65;
            const orbitY = -r - r * 0.35;
            for (let si = 0; si < starCount; si++) {
              const angle = time * 3.5 + si * (Math.PI * 2 / starCount);
              const sx = Math.cos(angle) * orbitR;
              const sy = orbitY + Math.sin(angle) * orbitR * 0.3;
              const starSize = Math.max(4, r * 0.22);
              ctx.globalAlpha = dizzyIntensity * 0.75;
              ctx.font = `${starSize}px sans-serif`;
              ctx.fillStyle = '#ffd700';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('\u2605', sx, sy);
            }
            ctx.globalAlpha = 1;
          }
        }

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

      // Crown for the king — the largest orb wears a floating golden crown
      if (orbs.length >= 2) {
        let kingOrb = null;
        let maxRad = 18;
        for (const orb of orbs) {
          if (!orb.spark && orb.radius > maxRad) {
            maxRad = orb.radius;
            kingOrb = orb;
          }
        }
        if (kingOrb) {
          const kPulse = 1 + 0.12 * Math.sin(time * 1.5 + kingOrb.pulsePhase);
          const kr = kingOrb.radius * kPulse;
          const bob = Math.sin(time * 2) * 2;
          const crownX = kingOrb.x;
          const crownY = kingOrb.y - kr - 6 + bob;
          const cw = Math.min(kr * 0.7, 14);
          const ch = Math.min(kr * 0.45, 9);

          ctx.save();
          ctx.globalCompositeOperation = "lighter";

          // Golden glow behind crown
          const glowR = cw * 2;
          const glow = ctx.createRadialGradient(crownX, crownY - ch * 0.3, 0, crownX, crownY - ch * 0.3, glowR);
          glow.addColorStop(0, "rgba(255, 200, 50, 0.12)");
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(crownX, crownY - ch * 0.3, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Crown shape — 3 pointed peaks
          ctx.beginPath();
          ctx.moveTo(crownX - cw, crownY);
          ctx.lineTo(crownX - cw * 0.6, crownY - ch);
          ctx.lineTo(crownX - cw * 0.2, crownY - ch * 0.35);
          ctx.lineTo(crownX, crownY - ch * 1.15);
          ctx.lineTo(crownX + cw * 0.2, crownY - ch * 0.35);
          ctx.lineTo(crownX + cw * 0.6, crownY - ch);
          ctx.lineTo(crownX + cw, crownY);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 215, 0, 0.65)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 245, 200, 0.5)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.restore();
        }
      }

      // ── King's heartbeat rings ──
      kingHeartbeatRingsRef.current = kingHeartbeatRingsRef.current.filter(
        (r) => now - r.born < KING_HEARTBEAT_RING_DURATION
      );
      for (const ring of kingHeartbeatRingsRef.current) {
        const progress = (now - ring.born) / KING_HEARTBEAT_RING_DURATION;
        const radius = 10 + progress * KING_HEARTBEAT_RANGE;
        const alpha = (1 - progress) * (1 - progress); // quadratic fade
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        // outer ring
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 80, ${(alpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = 2.5 * (1 - progress);
        ctx.stroke();
        // inner glow ring
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 245, 200, ${(alpha * 0.15).toFixed(3)})`;
        ctx.lineWidth = 1.5 * (1 - progress);
        ctx.stroke();
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

      // draw merge/bounce collision sparks
      mergeSparksRef.current = mergeSparksRef.current.filter((s) => now - s.born < (s.lifetime || MERGE_SPARK_LIFETIME));
      for (const spark of mergeSparksRef.current) {
        const life = spark.lifetime || MERGE_SPARK_LIFETIME;
        const age = (now - spark.born) / life;
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

        // Color shifts through tiers: blue → purple → pink
        const fieldColor = power >= 0.8 ? "#f093fb" : power >= 0.6 ? "#a78bfa" : "#4facfe";
        const coreColor = power >= 0.8 ? "#fa709a" : power >= 0.6 ? "#c084fc" : "#4facfe";

        // Outer attraction field glow
        const fieldRadius = HOLD_CHARGE_RANGE * (0.3 + power * 0.7);
        const fieldAlpha = 0.06 + power * 0.12 + pulse * 0.03;
        const fieldGrad = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, fieldRadius);
        fieldGrad.addColorStop(0, fieldColor + hexAlpha(fieldAlpha * 2 * 255));
        fieldGrad.addColorStop(0.5, coreColor + hexAlpha(fieldAlpha * 255));
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
          ctx.strokeStyle = fieldColor + hexAlpha(Math.min(ringAlpha, 1) * 255);
          ctx.lineWidth = 2 - ring * 0.3;
          ctx.stroke();
          ctx.restore();
        }

        // Bright core — grows and intensifies at high power
        const coreSize = 4 + power * 8 + (power >= 0.6 ? power * 4 : 0);
        const coreGrad = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, coreSize);
        coreGrad.addColorStop(0, "#ffffff" + hexAlpha((0.7 + power * 0.3) * 255));
        coreGrad.addColorStop(0.5, coreColor + hexAlpha((0.4 + power * 0.3) * 255));
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(hc.x, hc.y, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // At high power, draw crackling arcs around the core
        if (power >= 0.6) {
          const arcCount = Math.floor(2 + power * 4);
          ctx.save();
          ctx.strokeStyle = coreColor + hexAlpha(0.5 * 255);
          ctx.lineWidth = 1;
          for (let ai = 0; ai < arcCount; ai++) {
            const aAngle = time * (2 + ai) + ai * 1.3;
            const aRadius = coreSize + 8 + Math.random() * power * 20;
            const aLen = 0.3 + Math.random() * 0.5;
            ctx.beginPath();
            ctx.arc(hc.x, hc.y, aRadius, aAngle, aAngle + aLen);
            ctx.stroke();
          }
          ctx.restore();
        }
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

      // draw floating impact numbers
      impactNumsRef.current = impactNumsRef.current.filter((n) => now - n.born < IMPACT_NUM_DURATION);
      for (const n of impactNumsRef.current) {
        const progress = (now - n.born) / IMPACT_NUM_DURATION;
        const alpha = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
        const yOff = progress * IMPACT_NUM_RISE;
        const scale = progress < 0.1 ? 0.5 + (progress / 0.1) * 0.5 : 1 - progress * 0.2;
        const fontSize = Math.round(Math.min(12 + n.value * 0.06, 22) * scale);
        if (fontSize < 4) continue;
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillText(n.value, n.x + 1, n.y - yOff + 1);
        ctx.fillStyle = n.color;
        ctx.fillText(n.value, n.x, n.y - yOff);
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

      // ── Maelstrom (whirlpool spiral-in → burst-out) ──
      if (maelstromRef.current) {
        const ml = maelstromRef.current;
        const age = now - ml.born;

        if (ml.phase === "spiral" && age < MAELSTROM_SPIRAL_MS) {
          const progress = age / MAELSTROM_SPIRAL_MS;
          // Pull orbs inward with increasing tangential spin
          const pullStr = MAELSTROM_PULL * (0.5 + progress * 2);
          const tanStr = MAELSTROM_TANGENT * (1 + progress * 3);
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = ml.cx - orb.x;
            const dy = ml.cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;
            // Radial pull toward center
            orb.vx += nx * pullStr;
            orb.vy += ny * pullStr;
            // Tangential spin (perpendicular to radial, clockwise)
            orb.vx += -ny * tanStr;
            orb.vy += nx * tanStr;
            // Damping increases as spiral tightens
            const damp = 0.95 - progress * 0.07;
            orb.vx *= damp;
            orb.vy *= damp;
          }

          // Visual: spinning vortex arms
          const armCount = 4;
          const maxR = Math.min(W, H) * 0.45 * (1 - progress * 0.7);
          const spinAngle = progress * Math.PI * 6; // 3 full rotations
          for (let a = 0; a < armCount; a++) {
            const baseAngle = (Math.PI * 2 * a) / armCount + spinAngle;
            ctx.beginPath();
            for (let t = 0; t < 1; t += 0.02) {
              const r = maxR * t;
              const spiralAngle = baseAngle + t * Math.PI * 1.5;
              const px = ml.cx + Math.cos(spiralAngle) * r;
              const py = ml.cy + Math.sin(spiralAngle) * r;
              if (t === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            const armAlpha = (0.15 + progress * 0.2) * (1 - progress * 0.3);
            ctx.strokeStyle = `rgba(120, 200, 255, ${armAlpha})`;
            ctx.lineWidth = 2 + progress * 3;
            ctx.stroke();
          }

          // Growing core glow
          const coreR = 8 + progress * 40;
          const coreGrad = ctx.createRadialGradient(ml.cx, ml.cy, 0, ml.cx, ml.cy, coreR);
          coreGrad.addColorStop(0, `rgba(180, 230, 255, ${0.3 + progress * 0.4})`);
          coreGrad.addColorStop(0.5, `rgba(80, 160, 255, ${0.15 + progress * 0.2})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(ml.cx, ml.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          shakeRef.current = Math.max(shakeRef.current, 2 + progress * 10);

        } else if (ml.phase === "spiral" && age >= MAELSTROM_SPIRAL_MS) {
          // Transition to release
          ml.phase = "release";
          ml.releaseBorn = now;

          // Fling all orbs outward in a spiral burst
          for (const orb of orbs) {
            const dx = orb.x - ml.cx;
            const dy = orb.y - ml.cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;
            const speed = MAELSTROM_RELEASE_SPEED + Math.random() * 4;
            // Outward + tangential for spiral release
            orb.vx = nx * speed + (-ny) * speed * 0.4;
            orb.vy = ny * speed + nx * speed * 0.4;
          }

          // Explosion wave
          wavesRef.current.push({
            cx: ml.cx, cy: ml.cy, radius: 0,
            color: "#78c8ff", generation: 0,
            hitOrbs: new Set(), delay: 0,
          });

          // Screen flash + shake
          screenFlashesRef.current.push({ cx: ml.cx, cy: ml.cy, color: "#78c8ff", born: now });
          shakeRef.current = 30;
        }

        if (ml.phase === "release") {
          const releaseAge = now - ml.releaseBorn;
          if (releaseAge < MAELSTROM_RELEASE_MS) {
            const progress = releaseAge / MAELSTROM_RELEASE_MS;
            // Expanding ring visual
            const ringR = progress * Math.min(W, H) * 0.5;
            const ringAlpha = (1 - progress) * 0.25;
            const ringGrad = ctx.createRadialGradient(ml.cx, ml.cy, 0, ml.cx, ml.cy, ringR);
            ringGrad.addColorStop(0, `rgba(120, 200, 255, ${ringAlpha * 0.5})`);
            ringGrad.addColorStop(0.7, `rgba(80, 160, 255, ${ringAlpha})`);
            ringGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(ml.cx, ml.cy, ringR, 0, Math.PI * 2);
            ctx.fillStyle = ringGrad;
            ctx.fill();
          } else {
            maelstromRef.current = null;
          }
        }
      }

      // ── Galaxy effect (spiral arms → spin → detonate) ──
      if (galaxyRef.current) {
        const gx = galaxyRef.current;
        const age = now - gx.born;

        if (gx.phase === "spiral") {
          const progress = Math.min(age / GALAXY_SPIRAL_MS, 1);
          // Pull orbs into spiral arm positions
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const arm = orb._galaxyArm || 0;
            const idx = orb._galaxyIndex || 0;
            const armAngle = (Math.PI * 2 * arm) / GALAXY_ARM_COUNT;
            // Target: spiral position (arm angle + offset by index)
            const targetDist = 40 + idx * 22 * (1 - progress * 0.3);
            const targetAngle = armAngle + idx * 0.35 + gx.spinSpeed * age * 0.02;
            const tx = gx.cx + Math.cos(targetAngle) * targetDist;
            const ty = gx.cy + Math.sin(targetAngle) * targetDist;
            const dx = tx - orb.x;
            const dy = ty - orb.y;
            const force = GALAXY_PULL_FORCE * (0.3 + progress * 0.7);
            orb.vx += dx * force * 0.05;
            orb.vy += dy * force * 0.05;
            orb.vx *= GALAXY_DAMPING;
            orb.vy *= GALAXY_DAMPING;
          }
          gx.spinSpeed = Math.min(gx.spinSpeed + GALAXY_SPIN_ACCEL * 30, GALAXY_MAX_SPIN * 0.5);
          shakeRef.current = Math.max(shakeRef.current, 2 * progress);

          if (age >= GALAXY_SPIRAL_MS) {
            gx.phase = "spin";
            gx.spinBorn = now;
          }
        }

        if (gx.phase === "spin") {
          const spinAge = now - gx.spinBorn;
          const progress = Math.min(spinAge / GALAXY_SPIN_MS, 1);
          // Accelerate spin and tighten spiral
          gx.spinSpeed = Math.min(gx.spinSpeed + GALAXY_SPIN_ACCEL * (60 + progress * 200), GALAXY_MAX_SPIN);
          for (const orb of orbs) {
            if (orb === dragRef.current) continue;
            const dx = gx.cx - orb.x;
            const dy = gx.cy - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            // Radial pull (tightening)
            const pull = GALAXY_PULL_FORCE * (0.5 + progress * 1.5);
            orb.vx += (dx / dist) * pull * 0.1;
            orb.vy += (dy / dist) * pull * 0.1;
            // Tangential spin force
            const tx = -dy / dist;
            const ty = dx / dist;
            orb.vx += tx * gx.spinSpeed * 3;
            orb.vy += ty * gx.spinSpeed * 3;
            orb.vx *= GALAXY_DAMPING;
            orb.vy *= GALAXY_DAMPING;
          }
          shakeRef.current = Math.max(shakeRef.current, 4 + progress * 16);

          if (spinAge >= GALAXY_SPIN_MS) {
            gx.phase = "explode";
            gx.explodeBorn = now;
            // Fling all orbs outward with tangential + radial velocity
            for (const orb of orbs) {
              const dx = orb.x - gx.cx;
              const dy = orb.y - gx.cy;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              orb.vx = (dx / dist) * GALAXY_EXPLODE_SPEED * (0.7 + Math.random() * 0.6);
              orb.vy = (dy / dist) * GALAXY_EXPLODE_SPEED * (0.7 + Math.random() * 0.6);
              // Add tangential kick for spiral-out look
              orb.vx += (-dy / dist) * GALAXY_EXPLODE_SPEED * 0.3;
              orb.vy += (dx / dist) * GALAXY_EXPLODE_SPEED * 0.3;
              // Burst particles from each orb
              for (let b = 0; b < 3; b++) {
                const angle = Math.random() * Math.PI * 2;
                burstsRef.current.push({
                  x: orb.x, y: orb.y,
                  vx: Math.cos(angle) * (1 + Math.random() * 2),
                  vy: Math.sin(angle) * (1 + Math.random() * 2),
                  color: orb.color, radius: orb.radius * 0.25, born: now,
                });
              }
            }
            // Spawn ring of new orbs from center
            for (let i = 0; i < GALAXY_RING_COUNT; i++) {
              const angle = (Math.PI * 2 * i) / GALAXY_RING_COUNT;
              const orb = createOrb(gx.cx, gx.cy);
              orb.radius = 6 + Math.random() * 8;
              orb.vx = Math.cos(angle) * (GALAXY_EXPLODE_SPEED * 0.8 + Math.random() * 3);
              orb.vy = Math.sin(angle) * (GALAXY_EXPLODE_SPEED * 0.8 + Math.random() * 3);
              orbsRef.current.push(orb);
            }
            // Massive shockwave
            wavesRef.current.push({
              cx: gx.cx, cy: gx.cy, radius: 0,
              color: "#c084fc", generation: 0,
              hitOrbs: new Set(), delay: 0,
            });
            flashesRef.current.push({ x: gx.cx, y: gx.cy, color: "#c084fc", radius: 70, born: now });
            shakeRef.current = 40;
            setOrbCount(orbsRef.current.length);
            playSupernovaSound();
          }
        }

        // Visual rendering for spiral and spin phases
        if (gx.phase === "spiral" || gx.phase === "spin") {
          const totalAge = now - gx.born;
          const coreProgress = Math.min(totalAge / (GALAXY_SPIRAL_MS + GALAXY_SPIN_MS), 1);
          // Draw spiral arms
          const armOrbs = [];
          for (let a = 0; a < GALAXY_ARM_COUNT; a++) armOrbs.push([]);
          for (const orb of orbs) {
            const arm = orb._galaxyArm || 0;
            if (arm < armOrbs.length) armOrbs[arm].push(orb);
          }
          for (let a = 0; a < GALAXY_ARM_COUNT; a++) {
            const ao = armOrbs[a];
            if (ao.length < 2) continue;
            // Sort by distance from center for smooth line
            ao.sort((p, q) => {
              const da = (p.x - gx.cx) ** 2 + (p.y - gx.cy) ** 2;
              const db = (q.x - gx.cx) ** 2 + (q.y - gx.cy) ** 2;
              return da - db;
            });
            ctx.beginPath();
            ctx.moveTo(ao[0].x, ao[0].y);
            for (let i = 1; i < ao.length; i++) {
              ctx.lineTo(ao[i].x, ao[i].y);
            }
            ctx.strokeStyle = `rgba(192, 132, 252, ${0.15 + coreProgress * 0.2})`;
            ctx.lineWidth = 1.5 + coreProgress * 2;
            ctx.stroke();
          }
          // Glowing core
          const coreR = 15 + coreProgress * 45;
          const coreAlpha = 0.15 + coreProgress * 0.4;
          const coreGrad = ctx.createRadialGradient(gx.cx, gx.cy, 0, gx.cx, gx.cy, coreR);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
          coreGrad.addColorStop(0.3, `rgba(192, 132, 252, ${coreAlpha * 0.6})`);
          coreGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(gx.cx, gx.cy, coreR, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();
          // Rotating light rays during spin phase
          if (gx.phase === "spin") {
            const spinAge = now - gx.spinBorn;
            const sp = Math.min(spinAge / GALAXY_SPIN_MS, 1);
            const rayCount = 6;
            for (let r = 0; r < rayCount; r++) {
              const rayAngle = (Math.PI * 2 * r) / rayCount + totalAge * gx.spinSpeed * 0.5;
              const rayLen = coreR * (1.5 + sp * 2);
              const rayAlpha = sp * 0.12;
              ctx.beginPath();
              ctx.moveTo(gx.cx, gx.cy);
              ctx.lineTo(gx.cx + Math.cos(rayAngle) * rayLen, gx.cy + Math.sin(rayAngle) * rayLen);
              ctx.strokeStyle = `rgba(192, 132, 252, ${rayAlpha})`;
              ctx.lineWidth = 2 + sp * 3;
              ctx.lineCap = "round";
              ctx.stroke();
            }
          }
        }

        // Explosion glow
        if (gx.phase === "explode") {
          const explodeAge = now - gx.explodeBorn;
          if (explodeAge < GALAXY_EXPLODE_MS) {
            const progress = explodeAge / GALAXY_EXPLODE_MS;
            const glowR = 40 + progress * Math.min(W, H) * 0.5;
            const glowAlpha = (1 - progress) * 0.35;
            const glowGrad = ctx.createRadialGradient(gx.cx, gx.cy, 0, gx.cx, gx.cy, glowR);
            glowGrad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha * 0.8})`);
            glowGrad.addColorStop(0.15, `rgba(192, 132, 252, ${glowAlpha * 0.5})`);
            glowGrad.addColorStop(0.4, `rgba(139, 92, 246, ${glowAlpha * 0.3})`);
            glowGrad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(gx.cx, gx.cy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
            // Spiral debris rays
            const rayCount = GALAXY_ARM_COUNT * 4;
            for (let r = 0; r < rayCount; r++) {
              const rayAngle = (Math.PI * 2 * r) / rayCount + progress * 1.5;
              const rayLen = glowR * (0.4 + 0.6 * Math.sin(progress * 8 + r * 2));
              ctx.beginPath();
              ctx.moveTo(gx.cx, gx.cy);
              ctx.lineTo(gx.cx + Math.cos(rayAngle) * rayLen, gx.cy + Math.sin(rayAngle) * rayLen);
              ctx.strokeStyle = `rgba(192, 132, 252, ${(1 - progress) * 0.15})`;
              ctx.lineWidth = 2.5 * (1 - progress);
              ctx.lineCap = "round";
              ctx.stroke();
            }
          } else {
            galaxyRef.current = null;
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

        // Physics-predicted trajectory (curves with gravity + wells)
        // Show fan trajectories for volley (multiple lines for longer flicks)
        const previewVolley = sDist > 150 ? 5 : sDist > 80 ? 3 : 1;
        const previewFan = previewVolley > 1 ? 0.35 : 0;
        if (sDist > 30) {
          const trajectories = previewVolley > 1 ? [0, Math.floor(previewVolley / 2), previewVolley - 1] : [0];
          for (let tv = 0; tv < trajectories.length; tv++) {
            const vi = trajectories[tv];
            const tAngle = previewVolley > 1
              ? sAngle + previewFan * ((vi / (previewVolley - 1)) * 2 - 1)
              : sAngle;
            const isCenter = vi === Math.floor(previewVolley / 2) || previewVolley === 1;
            let sx = sling.startX, sy = sling.startY;
            let svx = Math.cos(tAngle) * sSpeed;
            let svy = Math.sin(tAngle) * sSpeed;
            const steps = 90;
            for (let i = 0; i < steps; i++) {
              if (gravityRef.current) {
                if (gyroModeRef.current) {
                  svx += Math.sin(gyroAngleRef.current + i * 0.012) * GRAVITY;
                  svy += Math.cos(gyroAngleRef.current + i * 0.012) * GRAVITY;
                } else {
                  const gDir = gravityDirRef.current;
                  if (gDir === "down") svy += GRAVITY;
                  else if (gDir === "up") svy -= GRAVITY;
                  else if (gDir === "right") svx += GRAVITY;
                  else if (gDir === "left") svx -= GRAVITY;
                }
              }
              for (const well of wellsRef.current) {
                const wdx = well.x - sx, wdy = well.y - sy;
                const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
                if (wDist < WELL_RANGE && wDist > 3) {
                  let ws = 1;
                  if (well.expiry) { ws = Math.min((well.expiry - now) / 1500, 1); if (ws <= 0) continue; }
                  const f = WELL_GRAVITY * ws / (1 + wDist * 0.01);
                  svx += (wdx / wDist) * f;
                  svy += (wdy / wDist) * f;
                  const of = f * 0.6 * (well.spinDir || 1);
                  svx += (-wdy / wDist) * of;
                  svy += (wdx / wDist) * of;
                }
              }
              svx *= FRICTION;
              svy *= FRICTION;
              sx += svx;
              sy += svy;
              if (sx < 0) { sx = 0; svx *= -0.7; }
              if (sx > W) { sx = W; svx *= -0.7; }
              if (sy < 0) { sy = 0; svy *= -0.7; }
              if (sy > H) { sy = H; svy *= -0.7; }
              if (i % 3 === 0) {
                const progress = i / steps;
                const baseAlpha = isCenter ? 0.45 : 0.25;
                const alpha = baseAlpha * (1 - progress);
                const dotR = (isCenter ? 2.5 : 1.8) * (1 - progress * 0.5);
                ctx.beginPath();
                ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
              }
            }
          }
        }

        // Orb preview glow at start position
        const previewR = previewVolley > 1
          ? 6 + Math.min(sDist * 0.02, 5)
          : 10 + Math.min(sDist * 0.03, 8);
        const glowGrad = ctx.createRadialGradient(sling.startX, sling.startY, 0, sling.startX, sling.startY, previewR * 2.5);
        const powerHue = powerPct > 0.7 ? "250, 112, 154" : powerPct > 0.4 ? "254, 180, 123" : "67, 233, 123";
        glowGrad.addColorStop(0, `rgba(${powerHue}, 0.3)`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(sling.startX, sling.startY, previewR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw preview orbs for volley fan
        if (previewVolley > 1) {
          for (let pv = 0; pv < previewVolley; pv++) {
            const pvAngle = sAngle + previewFan * ((pv / (previewVolley - 1)) * 2 - 1);
            const pvDist = previewR + 8;
            const pvx = sling.startX + Math.cos(pvAngle) * pvDist;
            const pvy = sling.startY + Math.sin(pvAngle) * pvDist;
            ctx.beginPath();
            ctx.arc(pvx, pvy, previewR * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${powerHue}, 0.25)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(sling.startX, sling.startY, previewR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${powerHue}, 0.2)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Power label + volley count
        if (sDist > 30) {
          ctx.save();
          ctx.font = "bold 13px monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(${powerHue}, 0.85)`;
          const label = previewVolley > 1
            ? `x${previewVolley} ${Math.round(powerPct * 100)}%`
            : Math.round(powerPct * 100) + "%";
          ctx.fillText(label, sling.startX, sling.startY - previewR - 10);
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

      // ── Beat sync pulse: rhythm detection drives ambient glow ──
      {
        const beat = beatRef.current;
        const taps = tapTimesRef.current;
        if (beat.strength > 0.01 && beat.interval > 0 && taps.length > 0) {
          const lastTap = taps[taps.length - 1];
          const elapsed = now - lastTap;
          // Fade out after 4 missed beats
          if (elapsed > beat.interval * 4) {
            beat.strength *= 0.96;
          }
          const phase = (elapsed % beat.interval) / beat.interval;
          const pulse = Math.exp(-phase * 5);
          const fade = Math.max(0, 1 - elapsed / (beat.interval * 6));
          const alpha = pulse * beat.strength * fade * 0.14;
          if (alpha > 0.003) {
            const maxDim = Math.max(W, H);
            const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, maxDim * 0.55);
            grad.addColorStop(0, `rgba(167, 139, 250, ${alpha.toFixed(4)})`);
            grad.addColorStop(0.4, `rgba(240, 147, 251, ${(alpha * 0.5).toFixed(4)})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);
          }
        }
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

      // ── Interaction energy bar ──
      {
        const ie = interactionEnergyRef.current;
        // drain
        interactionEnergyRef.current = Math.max(ie - ENERGY_DRAIN, 0);
        // release trigger
        if (ie >= 1.0) {
          interactionEnergyRef.current = 0;
          energyReleaseRef.current = now;
          // spectacular release: shockwave + burst from center
          const cx = W / 2, cy = H / 2;
          wavesRef.current.push({ cx, cy, radius: 0, color: '#f093fb', generation: 0, hitOrbs: new Set(), delay: 0 });
          wavesRef.current.push({ cx, cy, radius: 0, color: '#4facfe', generation: 0, hitOrbs: new Set(), delay: 6 });
          // burst spawn ring of orbs from center
          const burstCount = 8;
          for (let bi = 0; bi < burstCount; bi++) {
            const angle = (Math.PI * 2 * bi) / burstCount;
            const orb = createOrb(cx, cy);
            orb.vx = Math.cos(angle) * 8;
            orb.vy = Math.sin(angle) * 8;
            orbs.push(orb);
          }
          setOrbCount(orbs.length);
          // screen flash + shake
          screenFlashesRef.current.push({ cx, cy, color: '#f093fb', born: now });
          shakeRef.current = Math.max(shakeRef.current, 25);
          playBoom();
          // floating label
          comboFlashRef.current.push({ text: 'ENERGY RELEASE!', x: cx, y: cy * 0.4, born: now, color: '#f093fb' });
        }
        // render bar
        if (ie > 0.005) {
          const barW = W * ie;
          const barY = H - ENERGY_BAR_HEIGHT;
          // glow above bar
          const glowAlpha = 0.15 + ie * 0.35;
          const glow = ctx.createLinearGradient(0, barY - ENERGY_GLOW_HEIGHT, 0, barY + ENERGY_BAR_HEIGHT);
          glow.addColorStop(0, 'transparent');
          glow.addColorStop(0.6, `rgba(240, 147, 251, ${(glowAlpha * 0.3).toFixed(3)})`);
          glow.addColorStop(1, `rgba(240, 147, 251, ${(glowAlpha * 0.6).toFixed(3)})`);
          ctx.fillStyle = glow;
          ctx.fillRect(0, barY - ENERGY_GLOW_HEIGHT, barW, ENERGY_GLOW_HEIGHT + ENERGY_BAR_HEIGHT);
          // bar itself
          const barGrad = ctx.createLinearGradient(0, barY, barW, barY);
          barGrad.addColorStop(0, '#667eea');
          barGrad.addColorStop(0.5, '#f093fb');
          barGrad.addColorStop(1, ie > 0.8 ? '#ffd700' : '#43e97b');
          ctx.fillStyle = barGrad;
          ctx.fillRect(0, barY, barW, ENERGY_BAR_HEIGHT);
          // pulse when nearly full
          if (ie > 0.85) {
            const pulseAlpha = (ie - 0.85) * 6 * (0.5 + 0.5 * Math.sin(time * 8));
            ctx.fillStyle = `rgba(255, 215, 0, ${pulseAlpha.toFixed(3)})`;
            ctx.fillRect(0, barY, barW, ENERGY_BAR_HEIGHT);
          }
        }
        // release flash (white bar flash that fades)
        const relAge = now - energyReleaseRef.current;
        if (relAge < 400) {
          const relAlpha = (1 - relAge / 400) * 0.8;
          ctx.fillStyle = `rgba(255, 255, 255, ${relAlpha.toFixed(3)})`;
          ctx.fillRect(0, H - ENERGY_BAR_HEIGHT * 3, W, ENERGY_BAR_HEIGHT * 3);
        }
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
      flare: 0,
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

  // ── Effect Crescendo: chain multiple effects for escalating bonus ──
  const applyEffectChain = () => {
    interactionEnergyRef.current = Math.min(interactionEnergyRef.current + ENERGY_PER_EFFECT, 1.0);
    const now = performance.now();
    const chain = effectChainRef.current;
    if (now - chain.lastTime < 3000) {
      chain.count++;
    } else {
      chain.count = 1;
    }
    chain.lastTime = now;
    if (chain.count < 2) return;
    const level = Math.min(chain.count, 6);
    const W = window.innerWidth, H = window.innerHeight;
    const label = level >= 5 ? "MEGA CHAIN!" : `${level}X CHAIN!`;
    const color = level >= 5 ? "#ffd700" : level >= 4 ? "#ff6b6b" : level >= 3 ? "#f093fb" : "#4facfe";
    comboFlashRef.current.push({ text: label, x: W / 2, y: H * 0.35, born: now, color });
    shakeRef.current = Math.max(shakeRef.current, 3 * level);
    const particleCount = 6 * level;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1.5 + Math.random() * 2 * level;
      burstsRef.current.push({
        x: W / 2, y: H / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: randomColor(),
        radius: 1 + Math.random() * 1.5,
        born: now,
      });
    }
    if (level >= 3) {
      screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color, born: now });
    }
  };

  const handleScatter = useCallback(() => {
    haptic(12);
    applyEffectChain();
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

  const handleCollide = useCallback(() => {
    haptic(20);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cy = H / 2;
    const count = 7;
    const now = performance.now();
    const spread = Math.min(35, H / (count + 2));

    // Left swarm
    for (let i = 0; i < count; i++) {
      const y = cy + (i - (count - 1) / 2) * spread;
      const orb = createOrb(30, y);
      orb.vx = 7 + Math.random() * 2;
      orb.vy = (Math.random() - 0.5) * 1;
      orbsRef.current.push(orb);
    }
    // Right swarm
    for (let i = 0; i < count; i++) {
      const y = cy + (i - (count - 1) / 2) * spread;
      const orb = createOrb(W - 30, y);
      orb.vx = -(7 + Math.random() * 2);
      orb.vy = (Math.random() - 0.5) * 1;
      orbsRef.current.push(orb);
    }

    setOrbCount(orbsRef.current.length);
    shakeRef.current = Math.max(shakeRef.current, 8);
    screenFlashesRef.current.push({ cx: W / 2, cy, color: "#f093fb", born: now });
    playBoom();
  }, []);

  const handleRebound = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    haptic(20);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    // Reverse all velocities with a punchy speed boost
    for (const orb of orbs) {
      orb.vx = -orb.vx * 1.3;
      orb.vy = -orb.vy * 1.3;
    }

    // Shockwave from center
    wavesRef.current.push({
      cx: W / 2, cy: H / 2, radius: 0,
      color: "#00f2fe", generation: 0, hitOrbs: new Set(), delay: 0,
    });

    // Screen flash
    screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color: "#00f2fe", born: now });

    shakeRef.current = Math.max(shakeRef.current, 12);
    playBoom();
  }, []);

  const handleGravity = useCallback(() => {
    const dirs = ["down", "right", "up", "left", "flow", "spin"];
    if (!gravityRef.current) {
      // off → on (down)
      gravityRef.current = true;
      gravityDirRef.current = "down";
      gyroModeRef.current = false;
      setGyroMode(false);
      setGravityOn(true);
    } else if (gyroModeRef.current) {
      // spin → off
      gravityRef.current = false;
      gyroModeRef.current = false;
      setGyroMode(false);
      setGravityOn(false);
    } else {
      const idx = dirs.indexOf(gravityDirRef.current);
      if (idx < dirs.length - 2) {
        // cycle to next directional (down → right → up → left)
        gravityDirRef.current = dirs[idx + 1];
        setGravityOn(true); // force re-render for pill update
      } else {
        // left → spin (rotating gravity)
        gyroModeRef.current = true;
        setGyroMode(true);
        setGravityOn(true);
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
      const next = !prev;
      flockingModeRef.current = next;
      // auto-populate: boids need density to look good
      if (next && orbsRef.current.filter(o => !o.spark).length < 15) {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const cx = W / 2, cy = H / 2;
        const need = 20 - orbsRef.current.filter(o => !o.spark).length;
        for (let i = 0; i < need; i++) {
          const orb = createOrb(
            cx + (Math.random() - 0.5) * W * 0.4,
            cy + (Math.random() - 0.5) * H * 0.4
          );
          orb.vx = (Math.random() - 0.5) * 3;
          orb.vy = (Math.random() - 0.5) * 3;
          orbsRef.current.push(orb);
        }
        playBurstSound();
      }
      return next;
    });
  }, []);

  const handleMagmaMode = useCallback(() => {
    setMagmaMode((prev) => {
      magmaModeRef.current = !prev;
      if (!prev) {
        // turning on — reset all orb magma heat to 0
        for (const orb of orbsRef.current) orb.magma = 0;
      }
      return !prev;
    });
  }, []);

  const handleTrailsMode = useCallback(() => {
    setTrailsMode((prev) => {
      trailsModeRef.current = !prev;
      if (prev) {
        // turning off — clear stored trails
        for (const orb of orbsRef.current) orb.trail = null;
      }
      return !prev;
    });
  }, []);

  const handleChainReact = useCallback(() => {
    setChainReactMode((prev) => {
      chainReactModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleFizzMode = useCallback(() => {
    setFizzMode((prev) => {
      fizzModeRef.current = !prev;
      return !prev;
    });
  }, []);


  const handleNbodyMode = useCallback(() => {
    setNbodyMode((prev) => {
      nbodyModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleGyroMode = useCallback(() => {
    setGyroMode((prev) => {
      const next = !prev;
      gyroModeRef.current = next;
      if (next && !gravityRef.current) {
        gravityRef.current = true;
        gravityDirRef.current = "down";
        setGravityOn(true);
      }
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    const now = performance.now();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    // Send implosion particles from each orb toward center
    for (const orb of orbs) {
      const dx = cx - orb.x;
      const dy = cy - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const count = Math.min(4, BURST_PARTICLE_COUNT);
      for (let i = 0; i < count; i++) {
        const speed = 8 + Math.random() * 6;
        const spread = (Math.random() - 0.5) * 2;
        burstsRef.current.push({
          x: orb.x, y: orb.y,
          vx: (dx / dist) * speed + spread,
          vy: (dy / dist) * speed + spread,
          color: orb.color,
          radius: orb.radius * 0.35,
          born: now,
        });
      }
    }

    // Supernova at center for the grand detonation
    if (!supernovaRef.current) {
      supernovaRef.current = { cx, cy, born: now, phase: "implode" };
    }

    // Shockwave rings from center
    wavesRef.current.push({ cx, cy, radius: 0, color: "#f093fb", generation: 0, hitOrbs: new Set(), delay: 0 });
    wavesRef.current.push({ cx, cy, radius: 0, color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 4 });

    orbsRef.current = [];
    trailsRef.current = [];
    barriersRef.current = [];
    scorchMarksRef.current = [];
    springsRef.current = [];
    lastTapOrbIdRef.current = null;
    blackHoleRef.current = null;
    setBlackHoleActive(false);
    setOrbCount(0);
    shakeRef.current = 30;
    playSupernovaSound();
  }, []);

  const handleSpin = useCallback(() => {
    haptic(10);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const spinNow = performance.now();
    const doubleSpin = spinNow - lastSpinTimeRef.current < 800;
    lastSpinTimeRef.current = spinNow;

    if (doubleSpin && orbsRef.current.length > 0) {
      // ── Centrifuge: double-spin flings orbs outward in a spiral explosion ──
      haptic(40);
      const centrifugeColor = randomColor();
      for (const orb of orbsRef.current) {
        const dx = orb.x - cx;
        const dy = orb.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        // Strong outward radial push
        const radialForce = 6 + Math.random() * 4;
        orb.vx += (dx / dist) * radialForce;
        orb.vy += (dy / dist) * radialForce;
        // Add tangential spin for spiral trajectory
        const tangentForce = 3 + Math.random() * 2;
        orb.vx += (-dy / dist) * tangentForce;
        orb.vy += (dx / dist) * tangentForce;
        // Flash each orb
        orb.hitGlow = 1;
      }
      // Double shockwave rings
      wavesRef.current.push({ cx, cy, radius: 0, color: centrifugeColor, generation: 0, hitOrbs: new Set(), delay: 0 });
      wavesRef.current.push({ cx, cy, radius: 0, color: randomColor(), generation: 1, hitOrbs: new Set(), delay: 4 });
      // Spiral sparks from center
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
        const spd = 4 + Math.random() * 6;
        mergeSparksRef.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: centrifugeColor,
          size: 2 + Math.random() * 3,
          born: spinNow,
          lifetime: 800,
        });
      }
      // Big vortex visual
      vortexesRef.current.push({ cx, cy, born: spinNow, color: centrifugeColor, direction: 1 });
      vortexesRef.current.push({ cx, cy, born: spinNow, color: randomColor(), direction: -1 });
      shakeRef.current = Math.max(shakeRef.current, 18);
      screenFlashesRef.current.push({ cx, cy, color: centrifugeColor, born: spinNow });
      comboFlashRef.current.push({ text: "CENTRIFUGE", x: cx, y: cy - 40, born: spinNow, color: centrifugeColor });
      playBoom();
      return true; // signals centrifuge was triggered
    }

    // ── Normal spin ──
    const dir = Math.random() > 0.5 ? 1 : -1;
    for (const orb of orbsRef.current) {
      orb.spunAt = spinNow;
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
    haptic(30);
    applyEffectChain();
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
    // Echo pulses — trailing waves that follow the main shockwave
    wavesRef.current.push({
      cx, cy, radius: 0, color: randomColor(),
      generation: 1, hitOrbs: new Set(), delay: 8,
    });
    wavesRef.current.push({
      cx, cy, radius: 0, color: randomColor(),
      generation: 2, hitOrbs: new Set(), delay: 16,
    });
    shakeRef.current = 16;
    screenFlashesRef.current.push({ cx, cy, color: "#4facfe", born: performance.now() });
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
      // disable magnet cursor if enabling repel
      if (!prev && magnetCursorRef.current) {
        magnetCursorRef.current = false;
        setMagnetCursorMode(false);
      }
      return !prev;
    });
  }, []);

  const handleMagnetCursor = useCallback(() => {
    setMagnetCursorMode((prev) => {
      magnetCursorRef.current = !prev;
      // disable repel if enabling magnet
      if (!prev && repelModeRef.current) {
        repelModeRef.current = false;
        setRepelMode(false);
      }
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

  const handleEchoMode = useCallback(() => {
    setEchoMode((prev) => {
      echoModeRef.current = !prev;
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

  const handleFlowMode = useCallback(() => {
    setFlowMode((prev) => {
      flowModeRef.current = !prev;
      return !prev;
    });
  }, []);


  const handleTidalMode = useCallback(() => {
    setTidalMode((prev) => {
      tidalModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleSwirlMode = useCallback(() => {
    setSwirlMode((prev) => {
      swirlModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleStringMode = useCallback(() => {
    setStringMode((prev) => {
      stringModeRef.current = !prev;
      if (prev) {
        // turning off — clear last tap tracking (springs persist until they break)
        lastTapOrbIdRef.current = null;
      }
      return !prev;
    });
  }, []);

  const handleLinksMode = useCallback(() => {
    setLinksMode((prev) => {
      linksModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleVolatileMode = useCallback(() => {
    setVolatileMode((prev) => {
      volatileModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleFissionMode = useCallback(() => {
    setFissionMode((prev) => {
      fissionModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleWaveMode = useCallback(() => {
    setWaveMode((prev) => {
      waveModeRef.current = !prev;
      return !prev;
    });
  }, []);

  const handleRainMode = useCallback(() => {
    setRainMode((prev) => {
      rainModeRef.current = !prev;
      if (!prev) {
        rainTimerRef.current = performance.now();
        // auto-enable gravity so rain falls naturally
        if (!gravityRef.current) {
          gravityRef.current = true;
          gravityDirRef.current = "down";
          setGravityOn(true);
        }
      }
      return !prev;
    });
  }, []);

  const handleBounceMode = useCallback(() => {
    setBounceMode((prev) => {
      bounceModeRef.current = !prev;
      flashLabel(!prev ? "BOUNCE ON" : "BOUNCE OFF", "#f97316");
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
    const canvas = canvasRef.current;
    const W = canvas ? canvas.width : window.innerWidth;
    const H = canvas ? canvas.height : window.innerHeight;
    const cx = W / 2, cy = H / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
    const WAVE_MS = 500; // total time for the color wave to sweep outward

    // Send a shockwave ring from center for visual feedback
    wavesRef.current.push({
      cx, cy, radius: 0, color: "#feb47b",
      generation: 3, hitOrbs: new Set(), delay: 0,
    });

    for (const orb of orbsRef.current) {
      const dist = Math.sqrt((orb.x - cx) ** 2 + (orb.y - cy) ** 2);
      const delay = (dist / maxDist) * WAVE_MS;

      setTimeout(() => {
        const oldColor = orb.color;
        let newColor;
        do { newColor = randomColor(); } while (newColor === oldColor && COLORS.length > 1);
        orb.color = newColor;
        flashesRef.current.push({
          x: orb.x, y: orb.y,
          color: newColor, radius: orb.radius * 1.5,
          born: performance.now(),
        });
        ripplesRef.current.push({ x: orb.x, y: orb.y, color: newColor, born: performance.now() });
      }, delay);
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

  const handleCyclePaletteButton = useCallback(() => {
    handleCyclePalette();
    const nextIndex = (paletteIndex + 1) % PALETTES.length;
    comboFlashRef.current.push({
      text: PALETTES[nextIndex].name.toUpperCase(),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      born: performance.now(),
      color: "#f093fb",
    });
  }, [handleCyclePalette, paletteIndex]);

  const handleBurst = useCallback(() => {
    haptic(20);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    // Burst combo: rapid presses escalate intensity
    const combo = burstComboRef.current;
    if (now - combo.lastTime < 1000) {
      combo.level = Math.min(combo.level + 1, 5);
    } else {
      combo.level = 1;
    }
    combo.lastTime = now;
    const lvl = combo.level;

    // Escalating parameters
    const count = lvl <= 1 ? 6 : lvl === 2 ? 9 : lvl === 3 ? 14 : lvl === 4 ? 20 : 28;
    const speed = lvl <= 1 ? 4 : lvl === 2 ? 5 : lvl === 3 ? 6.5 : lvl === 4 ? 8 : 10;
    const shake = lvl <= 1 ? 10 : lvl === 2 ? 14 : lvl === 3 ? 20 : lvl === 4 ? 28 : 38;

    // Spread spawn points at higher levels
    const cx = W / 2 + (lvl >= 3 ? (Math.random() - 0.5) * W * 0.3 : 0);
    const cy = H / 2 + (lvl >= 3 ? (Math.random() - 0.5) * H * 0.3 : 0);
    screenFlashesRef.current.push({ cx, cy, color: "#43e97b", born: now });

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const orb = createOrb(cx, cy);
      orb.vx = Math.cos(angle) * (speed * (0.7 + Math.random() * 0.6));
      orb.vy = Math.sin(angle) * (speed * (0.7 + Math.random() * 0.6));
      // cascade pop: some burst orbs will mini-burst after a delay
      if (Math.random() < 0.4) {
        orb.popAt = now + 350 + Math.random() * 350;
      }
      orbsRef.current.push(orb);
    }
    ripplesRef.current.push({ x: cx, y: cy, color: randomColor(), born: now });

    // At level 3+, trigger a shockwave from the burst center
    if (lvl >= 3) {
      wavesRef.current.push({ x: cx, y: cy, radius: 0, born: now, color: randomColor() });
    }

    // At level 4+, add a flash
    if (lvl >= 4) {
      flashesRef.current.push({ x: cx, y: cy, color: randomColor(), radius: 40, born: now });
    }

    // At max level, flash label
    if (lvl >= 5) {
      comboFlashRef.current.push({ text: "SUPERBURST", x: cx, y: cy, born: now, color: "#fa709a" });
    }

    setOrbCount(orbsRef.current.length);
    shakeRef.current = shake;
    playBurstSound();
  }, []);

  const handleBarrage = useCallback(() => {
    haptic([20, 30, 40, 30, 20]);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    comboFlashRef.current.push({ text: "BARRAGE", x: W / 2, y: H / 2, born: now, color: "#f093fb" });
    screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color: "#f093fb", born: now });
    shakeRef.current = 10;
    playBurstSound();

    // Fire 10 effects at random positions with staggered timing
    const count = 10;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = W * 0.1 + Math.random() * W * 0.8;
        const y = H * 0.1 + Math.random() * H * 0.8;
        const t = performance.now();

        if (i % 3 === 0) {
          // Mini burst: spawn 5 orbs radially
          for (let j = 0; j < 5; j++) {
            const angle = (j / 5) * Math.PI * 2 + Math.random() * 0.3;
            const speed = 3 + Math.random() * 4;
            const orb = createOrb(x, y);
            orb.vx = Math.cos(angle) * speed;
            orb.vy = Math.sin(angle) * speed;
            orbsRef.current.push(orb);
          }
          ripplesRef.current.push({ x, y, color: randomColor(), born: t });
          playFirePop();
        } else if (i % 3 === 1) {
          // Mini shockwave
          wavesRef.current.push({ x, y, radius: 0, born: t, color: randomColor() });
          playBoom();
        } else {
          // Mini firework
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2;
            const speed = 4 + Math.random() * 5;
            const orb = createOrb(x, y);
            orb.vx = Math.cos(angle) * speed;
            orb.vy = Math.sin(angle) * speed - 2;
            orbsRef.current.push(orb);
          }
          screenFlashesRef.current.push({ cx: x, cy: y, color: randomColor(), born: t });
          playFirePop();
        }

        shakeRef.current = Math.max(shakeRef.current, 4);
        setOrbCount(orbsRef.current.length);
      }, i * 160);
    }
  }, []);


  const handleFirework = useCallback(() => {
    haptic(15);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const launchX = W * 0.2 + Math.random() * W * 0.6;
    const peakY = H * 0.15 + Math.random() * H * 0.25;
    const count = 10;
    const now = performance.now();
    const burstColor = randomColor();

    screenFlashesRef.current.push({ cx: launchX, cy: peakY, color: burstColor, born: now });

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

    // Crackle: delayed secondary pops around the burst area
    const crackleCount = 6 + Math.floor(Math.random() * 3);
    for (let c = 0; c < crackleCount; c++) {
      const delay = 250 + Math.random() * 350;
      const cAngle = Math.random() * Math.PI * 2;
      const cDist = 20 + Math.random() * 50;
      const cx = launchX + Math.cos(cAngle) * cDist;
      const cy = peakY + Math.sin(cAngle) * cDist;
      setTimeout(() => {
        const t = performance.now();
        // Small flash
        flashesRef.current.push({ x: cx, y: cy, color: burstColor, radius: 10 + Math.random() * 8, born: t });
        // Tiny burst particles
        for (let p = 0; p < 4; p++) {
          const pa = Math.random() * Math.PI * 2;
          const ps = 1 + Math.random() * 2;
          burstsRef.current.push({
            x: cx, y: cy,
            vx: Math.cos(pa) * ps, vy: Math.sin(pa) * ps,
            color: burstColor, radius: 0.8 + Math.random() * 1,
            born: t,
          });
        }
        // Crackle sound — short high-pitched pop
        playTone(cx / window.innerWidth, 0.08);
      }, delay);
    }

    setOrbCount(orbsRef.current.length);
    shakeRef.current = 10;
    playBurstSound();
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
    const next = !audioEnabledRef.current;
    audioEnabledRef.current = next;
    setAudioMuted(!next);
    setAudioEnabled(next);
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
    haptic([10, 15, 10]);
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
    haptic(25);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();
    screenFlashesRef.current.push({ cx: W / 2, cy: H * 0.3, color: "#f59e0b", born: now });

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
    haptic([20, 30, 40]);
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
    screenFlashesRef.current.push({ cx, cy, color: "#f093fb", born: performance.now() });
    playSupernovaSound();
  }, []);

  const handleMaelstrom = useCallback(() => {
    haptic([15, 25, 35]);
    if (maelstromRef.current) return;
    if (orbsRef.current.length < 2) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = (mx > 0 || my > 0) ? mx : window.innerWidth / 2;
    const cy = (mx > 0 || my > 0) ? my : window.innerHeight / 2;
    maelstromRef.current = { cx, cy, born: performance.now(), phase: "spiral" };
    screenFlashesRef.current.push({ cx, cy, color: "#78c8ff", born: performance.now() });
    playSwoosh();
  }, []);

  const handleNovaChain = useCallback(() => {
    haptic([20, 30, 40]);
    const orbs = orbsRef.current;
    if (orbs.length < 2) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Build nearest-neighbor chain starting from center
    const chain = [];
    const remaining = orbs.map((o, i) => i);
    let cur = { x: cx, y: cy };
    while (remaining.length > 0) {
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const o = orbs[remaining[i]];
        const d = (o.x - cur.x) ** 2 + (o.y - cur.y) ** 2;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      chain.push(orbs[remaining[best]]);
      cur = orbs[remaining[best]];
      remaining.splice(best, 1);
    }
    // Cascade through chain with staggered timing
    const maxChain = Math.min(chain.length, 80);
    for (let i = 0; i < maxChain; i++) {
      setTimeout(() => {
        const orb = chain[i];
        if (!orb) return;
        const now = performance.now();
        // Mini shockwave at orb position
        wavesRef.current.push({
          cx: orb.x, cy: orb.y, radius: 0,
          color: orb.color, generation: 0, hitOrbs: new Set(), delay: 0,
        });
        ripplesRef.current.push({ x: orb.x, y: orb.y, color: orb.color, born: now });
        // Push nearby orbs outward
        for (const other of orbsRef.current) {
          if (other === orb) continue;
          const dx = other.x - orb.x;
          const dy = other.y - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 120) {
            const force = (1 - dist / 120) * 6;
            other.vx += (dx / dist) * force;
            other.vy += (dy / dist) * force;
          }
        }
        // Lightning bolt to next orb in chain
        if (i < maxChain - 1 && chain[i + 1]) {
          const next = chain[i + 1];
          lightningRef.current.push({
            bolts: [{ points: generateBolt(orb.x, orb.y, next.x, next.y), color: orb.color }],
            sparks: [], born: now,
          });
        }
        // Burst particles
        for (let p = 0; p < 5; p++) {
          const angle = Math.random() * Math.PI * 2;
          burstsRef.current.push({
            x: orb.x, y: orb.y,
            vx: Math.cos(angle) * (2 + Math.random() * 3),
            vy: Math.sin(angle) * (2 + Math.random() * 3),
            color: orb.color, born: now,
          });
        }
        // Kick the orb itself
        const kickAngle = Math.random() * Math.PI * 2;
        orb.vx += Math.cos(kickAngle) * 4;
        orb.vy += Math.sin(kickAngle) * 4;
        shakeRef.current = Math.max(shakeRef.current, 3 + (maxChain - i) * 0.2);
      }, i * NOVA_CHAIN_DELAY);
    }
    // Sound
    screenFlashesRef.current.push({ cx, cy, color: "#fbbf24", born: performance.now() });
    playSupernovaSound();
    setTimeout(() => playLightning(), maxChain * NOVA_CHAIN_DELAY * 0.3);
    setTimeout(() => playBoom(), maxChain * NOVA_CHAIN_DELAY * 0.7);
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

  const handleSlam = useCallback(() => {
    haptic(40);
    ensureAudio();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();
    const orbs = orbsRef.current;
    if (orbs.length < 1) return;

    // Flash from top — gravity wave descending
    screenFlashesRef.current.push({ cx: W / 2, cy: 0, color: "#f59e0b", born: now });

    // Slam all orbs downward
    for (const orb of orbs) {
      orb.vy = 16 + Math.random() * 10;
      orb.vx *= 0.3; // dampen horizontal for dramatic straight-down feel
    }

    // Delayed floor shockwave when orbs impact bottom
    setTimeout(() => {
      wavesRef.current.push({
        cx: W * 0.3, cy: H, radius: 0,
        color: "#f59e0b", generation: 0, hitOrbs: new Set(), delay: 0,
      });
      wavesRef.current.push({
        cx: W * 0.7, cy: H, radius: 0,
        color: "#fa709a", generation: 0, hitOrbs: new Set(), delay: 2,
      });
      wavesRef.current.push({
        cx: W * 0.5, cy: H, radius: 0,
        color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 5,
      });
      shakeRef.current = Math.max(shakeRef.current, 22);
      playBoom();
    }, 350);

    shakeRef.current = Math.max(shakeRef.current, 6);
    playMeteorSound();
    comboFlashRef.current.push({ text: "SLAM!", x: W / 2, y: H / 2 - 30, born: now, color: "#f59e0b" });
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

  const handleStorm = useCallback(() => {
    haptic([20, 30, 40, 50]);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    // Stormy screen flash
    screenFlashesRef.current.push({ cx: W / 2, cy: 0, color: "#4facfe", born: now });

    // Meteors rain down
    for (let i = 0; i < METEOR_COUNT; i++) {
      setTimeout(() => {
        const x = W * 0.05 + Math.random() * W * 0.9;
        const angle = Math.PI * 0.4 + Math.random() * Math.PI * 0.2;
        const speed = 4 + Math.random() * 4;
        const orb = createOrb(x, -20);
        orb.radius = 6 + Math.random() * 8;
        orb.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
        orb.vy = Math.sin(angle) * speed;
        orbsRef.current.push(orb);
        ripplesRef.current.push({ x, y: 0, color: orb.color, born: performance.now() });
        meteorTrailsRef.current.push({
          x: x + (Math.random() - 0.5) * 40,
          y: -60 - Math.random() * 40,
          dx: orb.vx * 25, dy: orb.vy * 25,
          color: orb.color, born: performance.now(),
        });
        setOrbCount(orbsRef.current.length);
      }, i * METEOR_STAGGER);
    }

    // Lightning chains from sky after meteors start landing
    for (let s = 0; s < 3; s++) {
      setTimeout(() => {
        const orbs = orbsRef.current;
        if (orbs.length === 0) return;
        const skyX = W * 0.15 + Math.random() * W * 0.7;
        let cx = skyX, cy = -10;
        const visited = new Set();
        const bolts = [];
        const sparks = [];
        const maxJumps = Math.min(LIGHTNING_MAX_CHAIN, Math.ceil(orbs.length / 3));

        for (let j = 0; j < maxJumps; j++) {
          let nearest = null, nearestDist = LIGHTNING_CHAIN_DIST * 1.5;
          for (const orb of orbs) {
            if (visited.has(orb.id)) continue;
            const dx = orb.x - cx, dy = orb.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < nearestDist) { nearestDist = dist; nearest = orb; }
          }
          if (!nearest) break;
          visited.add(nearest.id);
          bolts.push({ points: generateBolt(cx, cy, nearest.x, nearest.y), color: nearest.color });
          if (Math.random() < 0.3) {
            const pts = bolts[bolts.length - 1].points;
            const bi = Math.floor(pts.length * 0.3 + Math.random() * pts.length * 0.4);
            const bp = pts[bi];
            const ba = Math.random() * Math.PI * 2;
            const bl = 30 + Math.random() * 50;
            bolts.push({ points: generateBolt(bp.x, bp.y, bp.x + Math.cos(ba) * bl, bp.y + Math.sin(ba) * bl, 5), color: nearest.color, branch: true });
          }
          for (let k = 0; k < 4; k++) {
            const a = Math.random() * Math.PI * 2;
            sparks.push({ x: nearest.x, y: nearest.y, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, color: nearest.color });
          }
          nearest.vx += (Math.random() - 0.5) * LIGHTNING_FORCE;
          nearest.vy += LIGHTNING_FORCE * 0.3;
          cx = nearest.x;
          cy = nearest.y;
        }

        if (bolts.length > 0) {
          lightningRef.current.push({ bolts, sparks, born: performance.now() });
          shakeRef.current = Math.max(shakeRef.current, 8);
        }
      }, 200 + s * 250);
    }

    shakeRef.current = Math.max(shakeRef.current, 18);
    playMeteorSound();
    setTimeout(() => playLightning(), 300);
  }, []);

  const handleEcho = useCallback(() => {
    haptic(15);
    const orbs = orbsRef.current;
    if (orbs.length === 0) return;
    const now = performance.now();
    const ghosts = ghostsRef.current;
    for (const orb of orbs) {
      ghosts.push({ x: orb.x, y: orb.y, radius: orb.radius, color: orb.color, born: now });
    }
    // cap ghosts to prevent performance issues
    if (ghosts.length > 400) {
      ghostsRef.current = ghosts.slice(-400);
    }
    // small outward impulse to create visual separation from ghosts
    for (const orb of orbs) {
      const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
      if (speed > 0.5) {
        orb.vx *= 1.15;
        orb.vy *= 1.15;
      } else {
        const angle = Math.random() * Math.PI * 2;
        orb.vx += Math.cos(angle) * 1.5;
        orb.vy += Math.sin(angle) * 1.5;
      }
    }
    shakeRef.current = Math.max(shakeRef.current, 6);
    screenFlashesRef.current.push({ cx: window.innerWidth / 2, cy: window.innerHeight / 2, color: "#a78bfa", born: now });
    playSwoosh();
  }, []);

  const handleSmash = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length < 2) return;
    haptic([20, 30, 50]);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const now = performance.now();
    const speed = 18;
    for (const orb of orbs) {
      const dx = cx - orb.x;
      const dy = cy - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      orb.vx = (dx / dist) * speed;
      orb.vy = (dy / dist) * speed;
    }
    shakeRef.current = 15;
    ripplesRef.current.push({ x: cx, y: cy, color: "#ef4444", born: now });
    comboFlashRef.current.push({ text: "SMASH", x: cx, y: cy, born: now, color: "#ef4444" });
    playSwoosh();
  }, []);



  const handleGalaxy = useCallback(() => {
    if (galaxyRef.current) return;
    const orbs = orbsRef.current;
    if (orbs.length < 3) return;
    // Center of mass
    let cx = 0, cy = 0;
    for (const o of orbs) { cx += o.x; cy += o.y; }
    cx /= orbs.length; cy /= orbs.length;
    // Assign each orb to a spiral arm
    for (let i = 0; i < orbs.length; i++) {
      orbs[i]._galaxyArm = i % GALAXY_ARM_COUNT;
      orbs[i]._galaxyIndex = Math.floor(i / GALAXY_ARM_COUNT);
    }
    galaxyRef.current = {
      cx, cy, born: performance.now(), phase: "spiral", spinSpeed: 0.008,
    };
    playGalaxySound();
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
      setBlackHoleActive(false);
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
    setBlackHoleActive(true);
    ripplesRef.current.push({ x: cx, y: cy, color: "#a855f7", born: performance.now() });
    shakeRef.current = 12;
    playBlackHoleSound();
  }, []);


  const handleFireworkShow = useCallback(() => {
    const count = 5 + Math.floor(Math.random() * 3); // 5-7 fireworks
    comboFlashRef.current.push({ text: "FIREWORK SHOW", x: window.innerWidth / 2, y: window.innerHeight / 2, born: performance.now(), color: "#fa709a" });
    for (let i = 0; i < count; i++) {
      setTimeout(() => handleFirework(), i * 180 + Math.random() * 80);
    }
  }, [handleFirework]);

  const handlePulse = useCallback(() => {
    const orbs = orbsRef.current;
    if (orbs.length < 2) return;
    const W = window.innerWidth, H = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
    // Cap at 25 waves for performance; pick random subset if too many
    const subset = orbs.length > 25
      ? [...orbs].sort(() => Math.random() - 0.5).slice(0, 25)
      : orbs;
    for (const orb of subset) {
      const dx = orb.x - cx, dy = orb.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delayFrames = Math.round((dist / maxDist) * 12);
      wavesRef.current.push({
        cx: orb.x, cy: orb.y,
        radius: 0,
        color: orb.color,
        generation: 1,
        hitOrbs: new Set([orb.id]),
        delay: delayFrames,
      });
    }
    shakeRef.current = Math.max(shakeRef.current, 12);
    playBoom();
  }, []);

  const handleCrossfire = useCallback(() => {
    haptic(25);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();
    const count = 4; // per edge
    const speed = 5 + Math.random() * 3;

    // Left volley → heading right
    for (let i = 0; i < count; i++) {
      const y = H * 0.25 + (H * 0.5 * i) / (count - 1);
      const orb = createOrb(-10, y);
      orb.vx = speed + Math.random() * 2;
      orb.vy = (Math.random() - 0.5) * 1.5;
      orb.radius = 7 + Math.random() * 6;
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x: 0, y, color: orb.color, born: now });
    }

    // Right volley → heading left
    for (let i = 0; i < count; i++) {
      const y = H * 0.25 + (H * 0.5 * i) / (count - 1);
      const orb = createOrb(W + 10, y);
      orb.vx = -(speed + Math.random() * 2);
      orb.vy = (Math.random() - 0.5) * 1.5;
      orb.radius = 7 + Math.random() * 6;
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x: W, y, color: orb.color, born: now });
    }

    // Top volley → heading down
    for (let i = 0; i < count; i++) {
      const x = W * 0.25 + (W * 0.5 * i) / (count - 1);
      const orb = createOrb(x, -10);
      orb.vy = speed + Math.random() * 2;
      orb.vx = (Math.random() - 0.5) * 1.5;
      orb.radius = 7 + Math.random() * 6;
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x, y: 0, color: orb.color, born: now });
    }

    // Bottom volley → heading up
    for (let i = 0; i < count; i++) {
      const x = W * 0.25 + (W * 0.5 * i) / (count - 1);
      const orb = createOrb(x, H + 10);
      orb.vy = -(speed + Math.random() * 2);
      orb.vx = (Math.random() - 0.5) * 1.5;
      orb.radius = 7 + Math.random() * 6;
      orbsRef.current.push(orb);
      ripplesRef.current.push({ x, y: H, color: orb.color, born: now });
    }

    // Delayed shockwave at impact center
    const impactMs = Math.min(W, H) / 2 / speed * (1000 / 60);
    setTimeout(() => {
      wavesRef.current.push({
        cx: W / 2, cy: H / 2, radius: 0,
        color: "#f093fb", generation: 0, hitOrbs: new Set(), delay: 0,
      });
      wavesRef.current.push({
        cx: W / 2, cy: H / 2, radius: 0,
        color: "#4facfe", generation: 0, hitOrbs: new Set(), delay: 3,
      });
      shakeRef.current = Math.max(shakeRef.current, 18);
      playBoom();
    }, impactMs);

    screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color: "#fa709a", born: now });
    setOrbCount(orbsRef.current.length);
    shakeRef.current = Math.max(shakeRef.current, 8);
    playBurstSound();
  }, []);

  const handleEruption = useCallback(() => {
    haptic([30, 20, 50]);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();
    const count = 12 + Math.floor(Math.random() * 6);
    const cx = W * 0.3 + Math.random() * W * 0.4; // random vent position

    // Screen flash at base
    screenFlashesRef.current.push({ cx, cy: H, color: "#f97316", born: now });

    // Staggered eruption bursts
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const spread = (Math.random() - 0.5) * W * 0.25;
        const x = cx + spread;
        const orb = createOrb(x, H + 10);
        orb.radius = 6 + Math.random() * 10;
        // Strong upward velocity with spread
        orb.vy = -(8 + Math.random() * 7);
        orb.vx = (Math.random() - 0.5) * 4 + spread * 0.01;
        orbsRef.current.push(orb);

        // Ember trail from launch point
        for (let j = 0; j < 3; j++) {
          embersRef.current.push({
            x: x + (Math.random() - 0.5) * 10,
            y: H - Math.random() * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -(2 + Math.random() * 4),
            radius: 1.5 + Math.random() * 2,
            color: ["#f97316", "#ef4444", "#fbbf24", "#f59e0b"][Math.floor(Math.random() * 4)],
            born: performance.now(),
            life: 600 + Math.random() * 400,
          });
        }

        ripplesRef.current.push({ x, y: H, color: orb.color, born: performance.now() });
        setOrbCount(orbsRef.current.length);
      }, i * 60 + Math.random() * 40);
    }

    // Ground shake builds up
    shakeRef.current = Math.max(shakeRef.current, 15);
    setTimeout(() => { shakeRef.current = Math.max(shakeRef.current, 10); }, 300);

    // Shockwave from vent after a delay
    setTimeout(() => {
      wavesRef.current.push({
        cx, cy: H, radius: 0,
        color: "#f97316", generation: 0, hitOrbs: new Set(), delay: 0,
      });
      playBoom();
    }, count * 40);

    playMeteorSound();
  }, []);

  const handleFractalBurst = useCallback(() => {
    haptic(25);
    applyEffectChain();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    const now = performance.now();
    screenFlashesRef.current.push({ cx, cy, color: "#c084fc", born: now });
    comboFlashRef.current.push({ text: "FRACTAL", x: cx, y: cy, born: now, color: "#c084fc" });

    const spawns = [];
    const spread = Math.PI / 4.5;
    const maxGen = 2;
    const baseAngle = Math.random() * Math.PI * 2;

    const buildTree = (x, y, angle, gen, delay) => {
      if (gen > maxGen) return;
      const speed = 6 - gen * 0.5;
      spawns.push({ x, y, angle, speed, gen, delay, radius: Math.max(4, 9 - gen * 1.5) });
      if (gen < maxGen) {
        const travel = speed * 7;
        const nx = x + Math.cos(angle) * travel;
        const ny = y + Math.sin(angle) * travel;
        const nextDelay = delay + 120;
        buildTree(nx, ny, angle - spread * (0.8 + Math.random() * 0.4), gen + 1, nextDelay);
        buildTree(nx, ny, angle + spread * (0.8 + Math.random() * 0.4), gen + 1, nextDelay);
      }
    };

    for (let i = 0; i < 3; i++) {
      buildTree(cx, cy, baseAngle + (Math.PI * 2 * i) / 3, 0, i * 60);
    }

    for (const s of spawns) {
      setTimeout(() => {
        const orb = createOrb(s.x, s.y);
        orb.vx = Math.cos(s.angle) * s.speed;
        orb.vy = Math.sin(s.angle) * s.speed;
        orb.radius = s.radius;
        orbsRef.current.push(orb);
        setOrbCount(orbsRef.current.length);
        ripplesRef.current.push({ x: s.x, y: s.y, color: orb.color, born: performance.now() });
      }, s.delay);
    }

    shakeRef.current = Math.max(shakeRef.current, 12);
    playBurstSound();
  }, []);

  const handleGrandFinale = useCallback(() => {
    if (finaleActiveRef.current) return;
    finaleActiveRef.current = true;
    haptic([40, 30, 60, 30, 80]);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const flashLabel = (text, color) => {
      comboFlashRef.current.push({ text, x: W / 2, y: H / 2, born: performance.now(), color });
    };

    // Phase 1: Burst spawn (t=0)
    flashLabel("GRAND FINALE", "#fbbf24");
    handleBurst();
    shakeRef.current = Math.max(shakeRef.current, 6);

    // Phase 2: Shockwave (t=400ms)
    setTimeout(() => {
      flashLabel("SHOCKWAVE", "#00f2fe");
      handleWave();
      shakeRef.current = Math.max(shakeRef.current, 10);
    }, 400);

    // Phase 3: Chain lightning (t=800ms)
    setTimeout(() => {
      flashLabel("LIGHTNING", "#fbbf24");
      handleLightning();
      shakeRef.current = Math.max(shakeRef.current, 12);
    }, 800);

    // Phase 4: Firework (t=1300ms)
    setTimeout(() => {
      flashLabel("FIREWORK", "#f093fb");
      handleFirework();
      shakeRef.current = Math.max(shakeRef.current, 14);
    }, 1300);

    // Phase 5: Meteor shower (t=1900ms)
    setTimeout(() => {
      flashLabel("METEOR STORM", "#fa709a");
      handleMeteorShower();
      shakeRef.current = Math.max(shakeRef.current, 18);
    }, 1900);

    // Phase 6: Supernova climax (t=2600ms)
    setTimeout(() => {
      flashLabel("SUPERNOVA", "#f97316");
      handleSupernova();
      shakeRef.current = Math.max(shakeRef.current, 25);
      bulletTimeRef.current = performance.now() + 600;
      screenFlashesRef.current.push({ cx: W / 2, cy: H / 2, color: "#ffffff", born: performance.now() });
    }, 2600);

    // Unlock re-trigger after sequence completes
    setTimeout(() => { finaleActiveRef.current = false; }, 3500);
  }, [handleBurst, handleWave, handleLightning, handleFirework, handleMeteorShower, handleSupernova]);

  const handleTide = useCallback(() => {
    const dir = tideDirRef.current;
    tideDirRef.current *= -1;
    const W = window.innerWidth;
    tidesRef.current.push({
      x: dir === 1 ? 0 : W,
      dir,
      born: performance.now(),
      color: randomColor(),
    });
    shakeRef.current = Math.max(shakeRef.current, 8);
    playSwoosh();
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
      // Theater mode: Escape toggles in/out, any other key exits
      if (e.key === "Escape") {
        e.preventDefault();
        if (theaterModeRef.current) {
          theaterModeRef.current = false;
          setTheaterMode(false);
          autoplayModeRef.current = false;
          setAutoPlay(false);
        } else {
          theaterModeRef.current = true;
          setTheaterMode(true);
          autoplayModeRef.current = true;
          setAutoPlay(true);
          autoplayTimersRef.current = { lastSpawn: performance.now(), lastEffect: performance.now() + 1500 };
          setShowHelp(false);
        }
        return;
      }
      if (theaterModeRef.current) {
        theaterModeRef.current = false;
        setTheaterMode(false);
        autoplayModeRef.current = false;
        setAutoPlay(false);
        return;
      }
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
          if (!handleSpin()) flashLabel("SPIN", "#f093fb");
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
          handleMagnetCursor();
          break;
        case "t":
          handleTrailsMode();
          break;
        case "n":
          handleWrapMode();
          break;
        case "k":
          handleFlockingMode();
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
        case "y":
          handleCyclePalette();
          flashLabel(PALETTES[(paletteIndex + 1) % PALETTES.length].name.toUpperCase(), "#f093fb");
          break;
        case "z":
          handleRebound();
          flashLabel("REBOUND", "#00f2fe");
          break;
        case "`":
          handleMaelstrom();
          flashLabel("VORTEX", "#78c8ff");
          break;
        case ".":
          handleBounceMode();
          break;
        case "?":
          setShowHelp((prev) => !prev);
          break;
        case "\\":
          handleGravityPulse();
          flashLabel("GRAVITY PULSE", "#a78bfa");
          break;
        case "!":
          handleGrandFinale();
          break;
        case "arrowdown":
        case "arrowup":
        case "arrowleft":
        case "arrowright": {
          e.preventDefault();
          const dirMap = { arrowdown: "down", arrowup: "up", arrowleft: "left", arrowright: "right" };
          const arrowMap = { down: "\u2193", up: "\u2191", left: "\u2190", right: "\u2192" };
          const dir = dirMap[e.key.toLowerCase()];
          if (gravityRef.current && gravityDirRef.current === dir && !gyroModeRef.current) {
            gravityRef.current = false;
            setGravityOn(false);
            flashLabel("GRAVITY OFF", "#43e97b");
          } else {
            gravityRef.current = true;
            gravityDirRef.current = dir;
            gyroModeRef.current = false;
            setGyroMode(false);
            setGravityOn(true);
            flashLabel("GRAVITY " + arrowMap[dir], "#43e97b");
          }
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleFreeze, handleGravity, handleScatter, handleGather, handleSpin, handleBurst, handleWave, handleClearAll, handlePaintMode, handleShuffle, handleSlowMo, handleFirework, handleRepelMode, handleMagnetCursor, handleLightning, handleMeteorShower, handleSupernova, handleToggleAudio, handleCyclePalette, handleGrandFinale, handleTrailsMode, handleBounceMode, handleMaelstrom, handleWrapMode, handleFlockingMode, paletteIndex, setShowHelp]);


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
      <div style={{ opacity: theaterMode ? 0 : 1, pointerEvents: theaterMode ? 'none' : 'auto', transition: 'opacity 0.8s ease' }}>
      <HUD>
        <Title>Automatic Software</Title>
        <Hint style={{ opacity: tipFading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
          {(() => {
            const tips = orbCount === 0
              ? ["tap anywhere to create orbs", "hold to charge \u00b7 release to detonate", "drag to aim & launch", "big flick = rocket firework!", "right-click for a surprise", "shake mouse or phone for a shockwave"]
              : orbCount < 6
              ? ["double-tap for burst spawn", "rapid taps unlock combos", "try shockwave (W) or firework (F)"]
              : ["rapid taps unlock combo streaks", "supernova (E) \u00b7 chain lightning (L)", "scatter (S) \u00b7 gather (C)", "toggle modes in the bottom left", "try vortex (`) \u00b7 spiral in & burst out", "rebound (Z) \u00b7 reverse all velocities", "cycle gravity (G) \u00b7 try spin mode"];
            return tips[tipCycle % tips.length];
          })()}
        </Hint>
        <Count>{orbCount} orb{orbCount !== 1 ? "s" : ""} · <PaletteLink onClick={handleCyclePaletteButton} title="Tap to change palette">{PALETTES[paletteIndex].name}</PaletteLink></Count>
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
               streakDisplay < 45 ? `${STREAK_NOVA_CHAIN}x nova chain` :
               "MAX COMBO"}
            </NextCombo>
            {bestStreak >= 5 && (
              <BestStreak key={newBest ? `best-${bestStreak}` : 'best'} $isNew={newBest}>
                {newBest ? `NEW BEST! ${bestStreak}x` : `best: ${bestStreak}x`}
              </BestStreak>
            )}
          </>
        )}
        {!streakDisplay && bestStreak >= 5 && (
          <BestStreak $isNew={false}>best: {bestStreak}x</BestStreak>
        )}
        {detectedBPM > 0 && (
          <BPMDisplay $interval={Math.round(60000 / detectedBPM)}>
            {detectedBPM} BPM
          </BPMDisplay>
        )}
        <ModeIndicators>
          {frozen && <ModePill $color="#4facfe">frozen</ModePill>}
          {gravityOn && <ModePill $color="#43e97b">gravity {gyroMode ? "↻" : gravityDirRef.current === "down" ? "↓" : gravityDirRef.current === "up" ? "↑" : gravityDirRef.current === "right" ? "→" : gravityDirRef.current === "flow" ? "◎" : "←"}</ModePill>}
          {magnetCursorMode && <ModePill $color="#f59e0b">magnet</ModePill>}
          {attractMode && <ModePill $color="#f093fb">attract</ModePill>}
          {repelMode && <ModePill $color="#fa709a">repel</ModePill>}
          {chainReactMode && <ModePill $color="#f97316">cascade</ModePill>}
          {paintMode && <ModePill $color="#feb47b">paint</ModePill>}
          {wrapMode && <ModePill $color="#38bdf8">wrap</ModePill>}
          {nbodyMode && <ModePill $color="#a78bfa">n-body</ModePill>}
          {flockingMode && <ModePill $color="#22d3ee">flock</ModePill>}
          {flowMode && <ModePill $color="#38bdf8">flow</ModePill>}
          {tidalMode && <ModePill $color="#06b6d4">tidal</ModePill>}
          {swirlMode && <ModePill $color="#818cf8">swirl</ModePill>}
          {stringMode && <ModePill $color="#818cf8">strings</ModePill>}
          {linksMode && <ModePill $color="#f0abfc">links</ModePill>}
          {echoMode && <ModePill $color="#60a5fa">echo</ModePill>}
          {kaleidoscopeMode && <ModePill $color="#f0abfc">mirror</ModePill>}
          {slowMo && <ModePill $color="#00f2fe">slow-mo</ModePill>}
          {pulseMode && <ModePill $color="#667eea">heartbeat</ModePill>}
          {volatileMode && <ModePill $color="#ef4444">volatile</ModePill>}
          {magmaMode && <ModePill $color="#f97316">magma</ModePill>}
          {fissionMode && <ModePill $color="#f43f5e">fission</ModePill>}
          {waveMode && <ModePill $color="#38bdf8">wave</ModePill>}
          {trailsMode && <ModePill $color="#c084fc">trails</ModePill>}
          {bounceMode && <ModePill $color="#f97316">bounce</ModePill>}
          {barrierMode && <ModePill $color="#f59e0b">walls</ModePill>}
          {fizzMode && <ModePill $color="#fbbf24">fizz</ModePill>}
          {tiltMode && <ModePill $color="#e879f9">tilt</ModePill>}
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
          <ActionButton onClick={handleWave} title="Shockwave">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" opacity="0.6" />
              <circle cx="12" cy="12" r="11" opacity="0.3" />
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
          <ActionButton onClick={handleLightning} title="Chain lightning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleShuffle} title="Shuffle colors" $highlight>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </ActionButton>
          {orbCount > 0 && (
            <>
            <ActionButton onClick={handleComet} title="Comet — streaks across leaving orbs behind">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="6" r="3" fill="currentColor" />
                <path d="M16 8 L4 20" />
                <path d="M15 9 L6 18" strokeOpacity="0.5" />
                <path d="M14 10 L8 16" strokeOpacity="0.3" />
              </svg>
            </ActionButton>
<ActionButton onClick={handleSpin} title="Spin orbs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            </ActionButton>
<ActionButton onClick={handleScatter} title="Scatter orbs (S)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="12" x2="5" y2="5" />
                <polyline points="5 9 5 5 9 5" />
                <line x1="12" y1="12" x2="19" y2="5" />
                <polyline points="15 5 19 5 19 9" />
                <line x1="12" y1="12" x2="5" y2="19" />
                <polyline points="9 19 5 19 5 15" />
                <line x1="12" y1="12" x2="19" y2="19" />
                <polyline points="19 15 19 19 15 19" />
              </svg>
            </ActionButton>
<ActionButton onClick={handleGather} title="Gather orbs (C)">
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
        <ModeToggle onClick={handleRepelMode} $active={repelMode} $color="#fa709a" title="Repel mode (D)">
          repel
        </ModeToggle>
        <ModeToggle onClick={handleWrapMode} $active={wrapMode} $color="#38bdf8" title="Wrap — orbs teleport across edges (N)">
          wrap
        </ModeToggle>
        <ModeToggle onClick={handlePaintMode} $active={paintMode} $color="#feb47b" title="Paint mode — orbs leave trails on canvas (P)">
          paint
        </ModeToggle>
        <ModeToggle onClick={handleFlockingMode} $active={flockingMode} $color="#22d3ee" title="Flock — boids swarm, flee your cursor (K)">
          flock
        </ModeToggle>
        <ModeToggle onClick={handleBounceMode} $active={bounceMode} $color="#f97316" title="Bounce — elastic billiard collisions (.)">
          bounce
        </ModeToggle>
        <ModeToggle onClick={handleTrailsMode} $active={trailsMode} $color="#c084fc" title="Trails — orbs leave comet tails (T)">
          trails
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
              <Shortcut><Key>drag</Key><span>Flick to launch (big flick = rocket!)</span></Shortcut>
              <Shortcut><Key>dbl-click</Key><span>Burst (empty) / remove (orb)</span></Shortcut>
              <Shortcut><Key>hold</Key><span>Charge → release to detonate</span></Shortcut>
              <Shortcut><Key>right-click</Key><span>Split orb / random effect</span></Shortcut>
              <Shortcut><Key>rapid taps</Key><span>Combo streaks → bonus effects</span></Shortcut>
              <Shortcut><Key>pinch</Key><span>Gather / spread / spin orbs</span></Shortcut>
              <Shortcut><Key>shake</Key><span>Shockwave (mouse or phone)</span></Shortcut>
              <hr />
              <Shortcut><Key>B</Key><span>Burst spawn</span></Shortcut>
              <Shortcut><Key>Q</Key><span>Meteor shower</span></Shortcut>
              <Shortcut><Key>W</Key><span>Shockwave</span></Shortcut>
              <Shortcut><Key>F</Key><span>Firework</span></Shortcut>
              <Shortcut><Key>E</Key><span>Supernova</span></Shortcut>
              <Shortcut><Key>L</Key><span>Chain lightning</span></Shortcut>
              <Shortcut><Key>R</Key><span>Spin (double-tap: centrifuge!)</span></Shortcut>
              <Shortcut><Key>S / C</Key><span>Scatter / Gather</span></Shortcut>
              <Shortcut><Key>\</Key><span>Gravity pulse (implode → explode)</span></Shortcut>
              <Shortcut><Key>Z</Key><span>Rebound (reverse all velocities)</span></Shortcut>
              <Shortcut><Key>H</Key><span>Shuffle colors</span></Shortcut>
              <Shortcut><Key>!</Key><span>Grand finale (chain all effects)</span></Shortcut>
              <Shortcut><Key>`</Key><span>Vortex (spiral in → burst out)</span></Shortcut>
              <hr />
              <Shortcut><Key>G</Key><span>Cycle gravity (↓→↑←↻)</span></Shortcut>
              <Shortcut><Key>D</Key><span>Repel mode</span></Shortcut>
              <Shortcut><Key>O</Key><span>Magnet cursor</span></Shortcut>
              <Shortcut><Key>P</Key><span>Paint mode</span></Shortcut>
              <Shortcut><Key>M</Key><span>Slow motion</span></Shortcut>
              <Shortcut><Key>T</Key><span>Trails mode</span></Shortcut>
              <Shortcut><Key>N</Key><span>Wrap mode (teleport edges)</span></Shortcut>
              <Shortcut><Key>K</Key><span>Flock mode (boids swarm)</span></Shortcut>
              <Shortcut><Key>.</Key><span>Bounce mode</span></Shortcut>
              <Shortcut><Key>Space</Key><span>Freeze / unfreeze</span></Shortcut>
              <Shortcut><Key>Esc</Key><span>Theater mode (screensaver)</span></Shortcut>
              <Shortcut><Key>V</Key><span>Toggle sound</span></Shortcut>
              <Shortcut><Key>X</Key><span>Clear all</span></Shortcut>
            </ShortcutList>
            <HelpClose onClick={() => setShowHelp(false)}>Got it</HelpClose>
          </HelpPanel>
        </HelpOverlay>
      )}
      </div>
    </Wrapper>
  );
}

export default App;
