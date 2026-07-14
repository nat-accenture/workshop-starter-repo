import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

// Animates a number from 0 to `target` once on mount, easing out. Returns the
// current value and lands EXACTLY on `target` on the final frame (so formatted
// money/percent figures resolve to their true value). Static under reduced
// motion. Used for balance and progress figures so they feel alive on load.
export function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState<number>(() =>
    prefersReducedMotion() ? target : 0,
  );
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    startRef.current = null;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / durationMs);
      if (t >= 1) {
        setValue(target); // exact final value, no interpolation error
        return;
      }
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(target * eased);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return value;
}
