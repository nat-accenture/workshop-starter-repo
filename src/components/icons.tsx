// Inline icons. Line icons inherit `currentColor` so they follow the DLS text
// tokens automatically. BrandMark is Meridian's own (fictional) wordmark glyph,
// authored for this app - not a third-party logo.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const line = (props: IconProps): IconProps => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

export function BrandMark(props: IconProps) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx={14} cy={14} r={13} fill="var(--color-brand)" />
      <line x1={2} y1={14} x2={26} y2={14} stroke="#fff" strokeWidth={1.4} opacity={0.6} />
      <path d="M14 1.5 C 8 7, 8 21, 14 26.5" stroke="#fff" strokeWidth={1.6} />
      <path d="M14 1.5 C 20 7, 20 21, 14 26.5" stroke="#fff" strokeWidth={1.6} opacity={0.6} />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...line(props)}>
      <rect x={3} y={3} width={7} height={7} rx={1.5} />
      <rect x={14} y={3} width={7} height={7} rx={1.5} />
      <rect x={3} y={14} width={7} height={7} rx={1.5} />
      <rect x={14} y={14} width={7} height={7} rx={1.5} />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg {...line(props)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...line(props)}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...line(props)}>
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
