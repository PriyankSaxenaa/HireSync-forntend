// src/components/fx/ParticleField.jsx
import { useEffect, useRef } from "react";

/**
 * A constellation of drifting nodes that link up when they get close, plus a
 * cursor that pulls nearby nodes toward it. Runs forever on a canvas — this is
 * the "something is always moving" layer that sits behind every page.
 *
 * Colours are read from the active role's CSS variables, so the mesh re-tints
 * itself automatically when you move between dashboards.
 */
const ParticleField = ({
  density = 0.00009, // particles per px² — scales with viewport
  maxParticles = 90,
  linkDistance = 130,
  speed = 0.22,
  opacity = 0.55,
  interactive = true,
}) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pull the live accent triad off the document so the mesh matches the role.
    const readAccents = () => {
      const s = getComputedStyle(canvas);
      return [
        s.getPropertyValue("--hs-a1-rgb").trim() || "99,102,241",
        s.getPropertyValue("--hs-a2-rgb").trim() || "168,85,247",
        s.getPropertyValue("--hs-a3-rgb").trim() || "34,211,238",
      ];
    };

    let accents = readAccents();
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(maxParticles, Math.round(width * height * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.7 + 0.6,
        c: accents[Math.floor(Math.random() * accents.length)],
        // Each node breathes on its own phase so the field never looks uniform.
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — no visible edges to the field.
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (interactive) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170 && dist > 0.5) {
            const pull = (1 - dist / 170) * 0.035;
            p.x += dx * pull;
            p.y += dy * pull;
          }
        }

        const twinkle = 0.55 + Math.sin(t * 0.0013 + p.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${(0.85 * twinkle * opacity).toFixed(3)})`;
        ctx.fill();

        // Link to later particles only, so each pair is drawn once.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDistance * linkDistance) continue;
          const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.32 * opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    build();

    if (reduced) {
      // Still paint one frame so the texture is there — just don't animate it.
      draw(0);
      cancelAnimationFrame(rafRef.current);
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    const onResize = () => {
      accents = readAccents();
      build();
    };
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onPointerLeave = () => {
      pointerRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("resize", onResize);
    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [density, maxParticles, linkDistance, speed, opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};

export default ParticleField;
