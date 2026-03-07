import React, { useRef, useEffect, useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

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
const FRICTION = 0.98;
const REPEL_DIST = 50;
const REPEL_FORCE = 0.3;
const ATTRACT_DIST = 180;
const ATTRACT_FORCE = 0.015;

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
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
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);
  const [orbCount, setOrbCount] = useState(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

  const handleDown = useCallback(
    (e) => {
      const pos = getPos(e);
      const hit = findOrb(pos.x, pos.y);
      if (hit) {
        dragRef.current = hit;
      }
      mouseRef.current = pos;
    },
    [getPos, findOrb]
  );

  const handleMove = useCallback(
    (e) => {
      const pos = getPos(e);
      if (dragRef.current) {
        dragRef.current.x = pos.x;
        dragRef.current.y = pos.y;
        dragRef.current.vx = 0;
        dragRef.current.vy = 0;
      }
      mouseRef.current = pos;
    },
    [getPos]
  );

  const handleUp = useCallback(
    (e) => {
      if (!dragRef.current) {
        const pos = e.changedTouches
          ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
          : getPos(e);
        orbsRef.current.push(createOrb(pos.x, pos.y));
        setOrbCount(orbsRef.current.length);
      }
      dragRef.current = null;
    },
    [getPos]
  );

  const handleDblClick = useCallback(
    (e) => {
      const pos = getPos(e);
      const hit = findOrb(pos.x, pos.y);
      if (hit) {
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
      const W = canvas.width;
      const H = canvas.height;
      const orbs = orbsRef.current;

      // fade trail background
      ctx.fillStyle = "rgba(15, 15, 26, 0.25)";
      ctx.fillRect(0, 0, W, H);

      // update physics
      for (const orb of orbs) {
        if (orb === dragRef.current) continue;

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

        // gentle attraction toward cursor
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mdx = mx - orb.x;
        const mdy = my - orb.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < ATTRACT_DIST && mDist > 0) {
          const pull = ATTRACT_FORCE * (1 - mDist / ATTRACT_DIST);
          orb.vx += (mdx / mDist) * pull;
          orb.vy += (mdy / mDist) * pull;
        }

        orb.vx *= FRICTION;
        orb.vy *= FRICTION;
        orb.x += orb.vx;
        orb.y += orb.vy;

        // bounce off walls
        if (orb.x < orb.radius) {
          orb.x = orb.radius;
          orb.vx *= -0.6;
        }
        if (orb.x > W - orb.radius) {
          orb.x = W - orb.radius;
          orb.vx *= -0.6;
        }
        if (orb.y < orb.radius) {
          orb.y = orb.radius;
          orb.vy *= -0.6;
        }
        if (orb.y > H - orb.radius) {
          orb.y = H - orb.radius;
          orb.vy *= -0.6;
        }
      }

      // draw connections
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i];
          const b = orbs[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, a.color + Math.round(alpha * 0.5 * 255).toString(16).padStart(2, "0"));
            grad.addColorStop(1, b.color + Math.round(alpha * 0.5 * 255).toString(16).padStart(2, "0"));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = alpha * 2;
            ctx.stroke();
          }
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

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // seed a few initial orbs
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
  }, []);

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onDoubleClick={handleDblClick}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
      <HUD>
        <Title>Automatic Software</Title>
        <Hint>click to create &middot; drag to move &middot; double-click to remove</Hint>
        <Count>{orbCount} orb{orbCount !== 1 ? "s" : ""}</Count>
      </HUD>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0f0f1a;
  position: relative;
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

export default App;
