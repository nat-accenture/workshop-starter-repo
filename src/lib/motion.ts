// Shared motion helper. Anything that animates in JS must respect the user's
// OS "reduce motion" setting, matching the CSS reduced-motion rule in the DLS.
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
