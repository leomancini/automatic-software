// ── Constants ────────────────────────────────────────────────────────

export const RIPPLE_DURATION = 600; // ms
export const BURST_DURATION = 500; // ms
export const BURST_PARTICLE_COUNT = 8;

export const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#fa709a",
  "#feb47b",
];

export const CONNECTION_DIST = 160;
export const MERGE_DIST_FACTOR = 0.7; // merge when distance < smaller radius * this
export const MERGE_FLASH_DURATION = 400;
export const STAR_COUNT = 80;
export const SHOOTING_STAR_CHANCE = 0.003; // probability per frame
export const SHOOTING_STAR_DURATION = 800; // ms
export const MOTE_COUNT = 60;
export const MOTE_SPEED = 0.15;
export const MOTE_ORB_PUSH_RANGE = 90;     // px — orbs push motes within this distance
export const MOTE_ORB_PUSH_FORCE = 0.35;   // push strength (scales with orb speed)
export const MOTE_FRICTION = 0.94;         // velocity damping per frame
export const MOTE_DISTURBED_GLOW = 0.5;    // extra brightness when pushed
export const SPLIT_COUNT = 3;
export const LONG_PRESS_MS = 500;
export const FRICTION = 0.98;
export const REPEL_DIST = 50;
export const REPEL_FORCE = 0.3;
export const ATTRACT_DIST = 180;
export const ATTRACT_FORCE = 0.015;
export const GRAVITY = 0.12;
export const WAVE_SPEED = 5; // px per frame
export const WAVE_FORCE = 6;
export const WAVE_WIDTH = 40; // thickness of the ring
export const WAVE_MAX_RADIUS_FACTOR = 1.2; // expand to 120% of screen diagonal
export const WALL_HIT_DURATION = 350; // ms
export const WALL_HIT_SPEED_THRESHOLD = 1.5; // minimum pre-bounce speed to trigger
export const WELL_RANGE = 250; // gravity well attraction radius
export const WELL_GRAVITY = 0.08; // gravity well force
export const TRAIL_SPEED_THRESHOLD = 2.0; // min orb speed to shed trail particles
export const TRAIL_LIFETIME = 2500; // ms trail particles live
export const TRAIL_MAX = 600; // cap trail particle count for performance
export const TRAIL_SPAWN_RATE = 0.4; // probability per frame per orb (when fast enough)

export const HOLD_CHARGE_DELAY = 400; // ms before hold-to-attract activates
export const HOLD_CHARGE_RANGE = 220; // px attraction radius
export const HOLD_CHARGE_FORCE = 0.12; // base attraction force per frame
export const HOLD_CHARGE_MAX_MS = 2500; // ms to reach full charge power
export const CASCADE_MAX_GEN = 2; // max cascade depth for chain reaction shockwaves
export const CASCADE_SPEED_THRESHOLD = 3.5; // orb speed after hit to trigger cascade
export const CASCADE_FORCE_DECAY = 0.55; // each generation is 55% as strong
export const CASCADE_DELAY_FRAMES = 8; // frames to wait before cascade wave activates
export const TAP_IMPULSE_RADIUS = 120; // px — push nearby orbs when tapping
export const TAP_IMPULSE_FORCE = 1.8; // strength of the tap push (quadratic falloff)
export const COLLAPSE_RADIUS = 35; // orbs this big undergo mitosis (split into two)
export const MITOSIS_WOBBLE_START = COLLAPSE_RADIUS * 0.8; // visual wobble begins here

// ── Sparkler mode ──────────────────────────────────────────────────
export const SPARK_LIFETIME = 2000; // ms before spark fades out
export const SPARK_SPAWN_DIST = 8; // min cursor movement to spawn sparks

// ── Vortex visual effect ────────────────────────────────────────────
export const VORTEX_DURATION = 2000; // ms for spiral arms to fade
export const VORTEX_ARMS = 3; // number of spiral arms

// ── Chain lightning effect ─────────────────────────────────────────
export const LIGHTNING_DURATION = 800; // ms for bolts to fade
export const LIGHTNING_CHAIN_DIST = 250; // max jump distance between orbs
export const LIGHTNING_MAX_CHAIN = 20; // max orbs per chain
export const LIGHTNING_FORCE = 3; // velocity boost on struck orbs
export const LIGHTNING_SEGMENTS = 10; // jagged segments per bolt

// ── Meteor shower ────────────────────────────────────────────────
export const METEOR_COUNT = 14; // orbs per shower
export const METEOR_STAGGER = 60; // ms between each meteor spawn
export const METEOR_TRAIL_DURATION = 600; // ms for entry trail to fade

// ── Wormhole portals ─────────────────────────────────────────────
export const PORTAL_RADIUS = 22;
export const PORTAL_TELEPORT_DIST = 28; // orb enters portal at this distance
export const PORTAL_COOLDOWN = 500; // ms before orb can re-enter a portal

// ── Supernova ──────────────────────────────────────────────────────
export const SUPERNOVA_IMPLODE_MS = 600; // ms for implosion phase
export const SUPERNOVA_RING_COUNT = 16; // orbs spawned in explosion ring
export const SUPERNOVA_RING_SPEED = 8; // outward velocity of ring orbs
export const SUPERNOVA_PULL_STRENGTH = 12; // how hard orbs pull inward

// ── Maelstrom ────────────────────────────────────────────────────
export const MAELSTROM_SPIRAL_MS = 1400;   // ms for inward spiral phase
export const MAELSTROM_RELEASE_MS = 600;   // ms for explosive release visual
export const MAELSTROM_PULL = 0.09;        // inward radial force per frame
export const MAELSTROM_TANGENT = 0.14;     // tangential spin force per frame
export const MAELSTROM_RELEASE_SPEED = 10; // outward burst velocity on release

// ── Comet ─────────────────────────────────────────────────────────
export const COMET_SPEED = 7;            // px per frame
export const COMET_TRAIL_INTERVAL = 100; // ms between trail orb spawns
export const COMET_ORB_COUNT = 10;       // total trail orbs spawned
export const COMET_HEAD_RADIUS = 12;     // visual radius of comet head
export const COMET_TAIL_POINTS = 30;     // positions stored for tail rendering

// ── Warp drive ────────────────────────────────────────────────────
export const WARP_CHARGE_MS = 800;   // pull-in phase
export const WARP_JUMP_MS = 400;     // flash + scatter phase
export const WARP_SETTLE_MS = 800;   // stars return to normal
export const WARP_PULL = 0.06;       // inward acceleration during charge
export const WARP_SCATTER_SPEED = 10; // outward velocity on jump

// ── Tap pulse wave (concentric ripple on every tap) ────────────────
export const TAP_WAVE_DURATION = 900; // ms for full expansion
export const TAP_WAVE_MAX_RADIUS = 140; // max ring expansion in px
export const TAP_WAVE_PUSH = 0.6; // gentle outward push on orbs
export const TAP_WAVE_RINGS = 3; // concentric rings per tap

// ── Pulse mode (rhythmic heartbeat) ──────────────────────────────────
export const PULSE_INTERVAL = 1800; // ms between heartbeat pulses
export const PULSE_PULL = 0.03; // gentle center-pull between pulses (inhale)
export const PULSE_PULL_RAMP = 600; // ms after pulse before pull begins (exhale grace period)

// ── Nova orbs (time-bomb orbs that detonate) ────────────────────────
export const NOVA_CHANCE = 0.12; // probability per tap-spawn
export const NOVA_FUSE_MIN = 5000; // minimum ms before detonation
export const NOVA_FUSE_MAX = 9000; // maximum ms before detonation
export const NOVA_WARN_MS = 2000; // ms before detonation when flickering starts
export const NOVA_BLAST_COUNT = 6; // fragment orbs on detonation
export const NOVA_BLAST_SPEED = 5; // outward velocity of fragments
export const NOVA_PUSH_RADIUS = 160; // force push radius on detonation
export const NOVA_PUSH_FORCE = 4; // force push strength

// ── Shatter chain (double-click cascade) ─────────────────────────
export const SHATTER_WAVE_SPEED = 5;        // px per frame
export const SHATTER_WAVE_MAX_RADIUS = 180; // how far the shatter ring expands
export const SHATTER_WAVE_WIDTH = 25;       // ring thickness for hit detection
export const SHATTER_CHAIN_CHANCE = 0.65;   // base probability of chain per hit
export const SHATTER_CHAIN_DECAY = 0.55;    // chance multiplier per generation
export const SHATTER_MAX_GEN = 5;           // max cascade depth
export const SHATTER_PARTICLE_COUNT = 14;   // fragments per shatter
export const SHATTER_DELAY_FRAMES = 6;      // frames before chain-shatter detonates

// ── Shatter All (crystallize + explode) ──────────────────────
export const SHATTER_ALL_FREEZE_MS = 700;   // ms for crystallization phase
export const SHATTER_ALL_FRAG_COUNT = 3;    // fragments per orb
export const SHATTER_ALL_FRAG_SPEED = 5;    // outward velocity of fragments

// ── Formation snap ────────────────────────────────────────────────
export const FORMATION_TYPES = ['circle', 'spiral', 'grid', 'wave'];
export const FORMATION_SPRING = 0.08;
export const FORMATION_DAMPING = 0.82;
export const FORMATION_HOLD_MS = 3000;

// ── Aurora borealis ─────────────────────────────────────────────────
export const AURORA_BAND_COUNT = 5;         // number of overlapping curtain bands
export const AURORA_BASE_ALPHA = 0.018;     // minimum opacity (visible even with 0 orbs)
export const AURORA_ACTIVITY_BOOST = 0.035; // extra opacity from orb activity
export const AURORA_SMOOTHING = 0.015;      // how fast aurora responds to activity changes
export const AURORA_COLORS = [
  [67, 233, 123],   // green
  [79, 172, 254],   // blue
  [118, 75, 162],   // purple
  [0, 242, 254],    // cyan
  [240, 147, 251],  // pink
];

// ── Tornado ─────────────────────────────────────────────────────────
export const TORNADO_DURATION = 4500; // ms to cross the screen
export const TORNADO_RADIUS = 120; // pull/capture radius
export const TORNADO_PULL = 0.3; // inward pull strength
export const TORNADO_SPIN_FORCE = 0.15; // tangential spin
export const TORNADO_FLING_SPEED = 10; // ejection speed when orbs reach center
export const TORNADO_DEBRIS_MAX = 80; // max visual debris particles

// ── Tap streak / combo system ───────────────────────────────────────
export const STREAK_WINDOW = 600; // ms between taps to continue a streak
export const STREAK_DECAY_DELAY = 1200; // ms after last tap before streak counter fades

// ── Streak combo rewards (auto-trigger effects at milestones) ──────
export const STREAK_FIREWORK = 12;       // radial burst from tap point
export const STREAK_LIGHTNING = 16;      // chain lightning from tap point
export const STREAK_METEOR = 20;         // meteor shower
export const STREAK_SUPERNOVA = 25;      // supernova at tap point
export const STREAK_CASCADE = 30;        // cosmic cascade — every orb splits
export const STREAK_STARFALL = 35;       // starfall — all orbs rain down as meteors
export const STREAK_SUPERMASSIVE = 40;   // supermassive — simultaneous firework bursts + shockwaves + scatter
export const COMBO_FLASH_DURATION = 1400; // ms for floating reward text

// ── Orbital strike ─────────────────────────────────────────────────
export const STRIKE_BEAM_MS = 400; // beam descent duration
export const STRIKE_FADE_MS = 600; // post-impact fade
export const STRIKE_ORB_COUNT = 8; // orbs spawned in explosion ring
export const STRIKE_ORB_SPEED = 5; // outward velocity of ring orbs
export const STRIKE_BEAM_WIDTH = 6; // beam core width

// ── Chain combustion ────────────────────────────────────────────────
export const IGNITE_SPREAD_DIST = 65; // fire spreads within this distance
export const IGNITE_BURN_MS = 1800; // ms before orb pops
export const IGNITE_SPARK_COUNT = 5; // sparks per pop
export const IGNITE_SPARK_SPEED = 4; // initial spark velocity
export const IGNITE_SPREAD_CHANCE = 0.04; // per-frame probability of spreading
export const EMBER_LIFETIME = 700; // ms for ember particles

// ── Magnetic storm ───────────────────────────────────────────────────
export const STORM_DURATION = 3000; // ms total storm length
export const STORM_ZAP_INTERVAL = 140; // ms between auto-lightning arcs
export const STORM_SPIN_FORCE = 0.35; // tangential chaos force
export const STORM_RADIAL_FORCE = 0.2; // oscillating push/pull
export const STORM_ARC_COUNT = 6; // visual energy arcs from epicenter


// ── Merge sparks (collision particles) ──────────────────────────────
export const MERGE_SPARK_COUNT = 10;     // particles per merge event
export const MERGE_SPARK_SPEED = 3.5;    // initial outward velocity
export const MERGE_SPARK_LIFETIME = 450; // ms before spark fades
export const MERGE_SPARK_SIZE = 2.5;     // base radius

// ── Merge shockwave (high-speed collisions push nearby orbs) ────────
export const MERGE_PUSH_RADIUS = 110;     // radius of outward push
export const MERGE_PUSH_FORCE = 2.2;      // max outward force
export const MERGE_PUSH_SPEED_MIN = 3.0;  // min relative collision speed to trigger

// ── Magnetic polarity ────────────────────────────────────────────────
export const MAGNET_RANGE = 160;      // interaction range between orb pairs
export const MAGNET_FORCE = 0.045;    // base force strength (opposites attract, likes repel)


// ── Tsunami wave ────────────────────────────────────────────────────
export const TSUNAMI_SPEED = 10; // px per frame — fast sweep
export const TSUNAMI_WIDTH = 100; // wall thickness in px
export const TSUNAMI_FORCE = 7; // horizontal push on orbs

// ── Gravity painter ─────────────────────────────────────────────────
export const GPAINT_DOT_LIFETIME = 4000; // ms before dot fades
export const GPAINT_DOT_RANGE = 100; // attraction radius per dot
export const GPAINT_DOT_FORCE = 0.05; // attraction strength per dot
export const GPAINT_DOT_INTERVAL = 22; // px between dots when dragging
export const GPAINT_DOT_MAX = 150; // max active dots
export const TSUNAMI_TUMBLE = 2.5; // random vertical scatter
export const TSUNAMI_FOAM_COUNT = 18; // foam particles at leading edge

// ── Constellation mode ──────────────────────────────────────────────
export const CONSTELLATION_DIST = 200; // max distance for constellation lines
export const CONSTELLATION_NODE_THRESHOLD = 0.55; // proximity threshold for midpoint stars

// ── Particle fountain ──────────────────────────────────────────────
export const FOUNTAIN_SPAWN_INTERVAL = 180; // ms between spawns
export const FOUNTAIN_SPAWN_SPEED = 4.5; // initial upward velocity
export const FOUNTAIN_SPRAY_ANGLE = 0.5; // radians of spray spread
export const FOUNTAIN_ORB_CAP = 200; // won't spawn if total orbs exceed this
export const FOUNTAIN_BASE_RADIUS = 10; // visual base size

// ── Domino cascade ──────────────────────────────────────────────
export const DOMINO_DELAY = 70; // ms between each detonation in the chain
export const DOMINO_RESPAWN_DELAY = 350; // ms after last detonation before respawn burst

// ── Color wave ──────────────────────────────────────────────────
export const COLOR_WAVE_SPEED = 3.5; // px per frame
export const COLOR_WAVE_WIDTH = 55; // visual width of the ring
export const COLOR_WAVE_SEGMENTS = 36; // arc segments for rainbow rendering

// ── N-body gravity (mutual gravitational attraction) ────────────
export const NBODY_G = 0.06;         // gravitational constant
export const NBODY_RANGE = 400;      // max interaction range
export const NBODY_MIN_DIST = 18;    // softening distance to prevent infinite force


// ── Vortex storm ───────────────────────────────────────────────────
export const VORTEX_STORM_SPIRAL_MS = 2000;    // spiral-in phase duration
export const VORTEX_STORM_HOLD_MS = 400;       // brief hold at center
export const VORTEX_STORM_EXPLODE_MS = 1200;   // spiral-out explosion
export const VORTEX_STORM_SPIRAL_FORCE = 0.12; // radial inward pull
export const VORTEX_STORM_TANGENT_FORCE = 0.15; // tangential spin force
export const VORTEX_STORM_EXPLODE_SPEED = 8;   // outward velocity on release
export const VORTEX_STORM_ARM_COUNT = 5;       // visible spiral arms

// ── Light trails (comet tails behind orbs) ──────────────────────────
export const LIGHT_TRAIL_LENGTH = 24; // positions stored per orb trail
export const TRAIL_SPEED_MIN = 1.5;   // min speed for visible trail

// ── Ambient nebula (responsive background glow) ─────────────────────
export const NEBULA_COUNT = 5;
export const NEBULA_BASE_RADIUS = 250;
export const NEBULA_DRIFT = 0.15;        // px per frame drift speed
export const NEBULA_ORB_PULL = 0.002;    // attraction toward orb clusters
export const NEBULA_ALPHA = 0.035;       // per-frame opacity (steady-state ~4x)
export const NEBULA_COLORS_RGB = [
  [80, 100, 220],   // soft indigo
  [110, 60, 160],   // deep purple
  [200, 100, 220],  // orchid
  [50, 180, 120],   // emerald
  [60, 140, 230],   // cerulean
];

// ── Tilt gravity ──────────────────────────────────────────────────
export const TILT_GRAVITY_FORCE = 0.18;  // directional gravity strength
export const TILT_SMOOTHING = 0.12;      // lerp factor for smooth transitions

// ── Time rewind ─────────────────────────────────────────────────────
export const REWIND_BUFFER_SIZE = 180; // ~3 seconds at 60fps
export const REWIND_STEP_RATE = 3; // play back 3 frames per animation frame (fast rewind)

// ── Tap sparkle particles ───────────────────────────────────────────
export const TAP_SPARKLE_COUNT = 8;       // particles per tap
export const TAP_SPARKLE_SPEED = 2.5;     // outward velocity
export const TAP_SPARKLE_LIFETIME = 600;  // ms before fade

// ── Gravity harp strings ────────────────────────────────────────────
export const HARP_STRING_COUNT = 7;              // horizontal strings across canvas
export const HARP_VIBRATION_DURATION = 1200;     // ms for vibration to fade
export const HARP_PLUCK_SPEED_THRESHOLD = 1.8;   // min orb speed to pluck
export const HARP_PLUCK_COOLDOWN = 50;           // ms between pluck sounds

// ── Spawn animation ───────────────────────────────────────────────
export const SPAWN_DURATION = 400; // ms for materialization

// ── Autoplay ────────────────────────────────────────────────────────
export const AUTOPLAY_SPAWN_INTERVAL = 2000; // ms between autoplay spawns
export const AUTOPLAY_SPAWN_COUNT = 3;       // orbs per autoplay spawn
export const AUTOPLAY_EFFECT_INTERVAL = 5000; // ms between random autoplay effects

// ── Black hole ──────────────────────────────────────────────────────
export const BLACK_HOLE_RANGE = 200;           // gravitational pull range
export const BLACK_HOLE_GRAVITY = 0.15;        // pull strength
export const BLACK_HOLE_EVENT_HORIZON = 30;    // point of no return radius
export const BLACK_HOLE_ABSORB_TO_EXPLODE = 8; // orbs absorbed before explosion
export const BLACK_HOLE_RING_COUNT = 12;       // orbs in explosion ring
export const BLACK_HOLE_RING_SPEED = 6;        // outward velocity
export const BLACK_HOLE_DISK_DOTS = 40;        // accretion disk particles

// ── Flock mode (boid behavior) ──────────────────────────────────────
export const FLOCK_SEPARATION_DIST = 30;       // min distance between orbs
export const FLOCK_NEIGHBOR_DIST = 100;        // awareness range
export const FLOCK_SEPARATION_FORCE = 0.05;    // push away force
export const FLOCK_ALIGNMENT_FORCE = 0.03;     // match velocity force
export const FLOCK_COHESION_FORCE = 0.02;      // pull toward center force
export const FLOCK_MAX_SPEED = 4;              // speed cap

// ── Pulsar ─────────────────────────────────────────────────────────
export const PULSAR_PULSE_COUNT = 6;           // total pulses before detonation
export const PULSAR_PULSE_INTERVAL = 450;      // ms between pulses (speeds up)
export const PULSAR_DETONATION_COUNT = 14;     // orbs spawned in final explosion
export const PULSAR_DETONATION_SPEED = 9;      // explosion orb velocity

// ── Color palettes ──────────────────────────────────────────────────
export const PALETTES = [
  {
    name: "Cosmic",
    colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe", "#43e97b", "#fa709a", "#feb47b"],
    nebula: [[80,100,220], [110,60,160], [200,100,220], [50,180,120], [60,140,230]],
  },
  {
    name: "Ocean",
    colors: ["#0077b6", "#0096c7", "#00b4d8", "#48cae4", "#90e0ef", "#ade8f4", "#5bc0be", "#3a86ff"],
    nebula: [[0,80,140], [0,120,170], [0,150,200], [60,160,170], [40,100,200]],
  },
  {
    name: "Sunset",
    colors: ["#ff6b35", "#ff8c42", "#ffd166", "#f7c59f", "#e63946", "#ff006e", "#ff85a1", "#fb5607"],
    nebula: [[200,80,30], [200,50,60], [220,120,40], [180,40,80], [200,100,60]],
  },
  {
    name: "Neon",
    colors: ["#39ff14", "#ff073a", "#00fff7", "#ff6ec7", "#ffff00", "#7b2dff", "#ff3131", "#0ff0fc"],
    nebula: [[40,200,20], [200,10,50], [0,200,200], [200,80,160], [100,30,200]],
  },
  {
    name: "Mono",
    colors: ["#e0e0e0", "#c0c0c0", "#a0b4c8", "#8899a8", "#c8d6e5", "#b0c4d8", "#d4e4f7", "#9bb5cf"],
    nebula: [[140,150,170], [100,120,150], [120,140,170], [90,110,140], [130,145,165]],
  },
];
