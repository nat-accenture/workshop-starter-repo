import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

// Fixed full-viewport ambient gradient layer. Renders behind every route.
// On fine-pointer (mouse) devices: pointer rAF lerp tracking via --mx/--my CSS vars.
// On coarse-pointer (touch) devices: breathing opacity pulse via .gradient-bg--breathing.
// Reduced-motion JS gate: no listener / no rAF when prefers-reduced-motion is set.
// Rule 0 clean: no raw hex/rgb/px/rem; colours come from tokens via color-mix() in app.css.
export function GradientBackground() {
  const [isFinePointer, setIsFinePointer] = useState(
    () => window.matchMedia?.("(pointer: fine)").matches ?? true,
  );
  const layerRef = useRef<HTMLDivElement>(null);

  // Effect A: mode switch -- listen for pointer-type change (e.g. mouse plugged in/out).
  // Analog: ThemeProvider.tsx lines 68-76 (matchMedia change listener).
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(pointer: fine)");
    const onChange = () => setIsFinePointer(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Effect B: pointer rAF lerp loop.
  // On fine-pointer + no reduced-motion: lerp current -> target, write --mx/--my via setProperty.
  // On coarse-pointer or reduced-motion: no listener and no rAF attached (D-09 JS gate).
  useEffect(() => {
    if (prefersReducedMotion()) return;          // D-09 JS gate -- no listener, no loop
    if (!isFinePointer) return;                  // D-08 -- breathing handled by CSS class
    const el = layerRef.current;
    if (!el) return;

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    let frameId = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const FACTOR = 0.06;                         // damped parallax (D-04); keep <= 0.08 (paint cost)

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const tick = () => {
      current.x = lerp(current.x, target.x, FACTOR);
      current.y = lerp(current.y, target.y, FACTOR);
      el.style.setProperty("--mx", `${(current.x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(current.y * 100).toFixed(2)}%`);
      frameId = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frameId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [isFinePointer]);

  const className = ["gradient-bg", !isFinePointer && "gradient-bg--breathing"]
    .filter(Boolean).join(" ");

  return (
    <div
      ref={layerRef}
      className={className}
      data-testid="gradient-bg"
      aria-hidden="true"
    />
  );
}
