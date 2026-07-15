import { useRef } from "react";

// Fixed full-viewport ambient gradient layer. Renders behind every route.
// Pointer tracking and breathing animation land in Plan 03.
// Rule 0 clean: no raw hex/rgb/px/rem; colours come from tokens via color-mix()
// in app.css. The ref is attached now so Plan 03 can write --mx/--my without
// re-touching the JSX.
export function GradientBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={layerRef}
      className="gradient-bg"
      data-testid="gradient-bg"
      aria-hidden="true"
    />
  );
}
