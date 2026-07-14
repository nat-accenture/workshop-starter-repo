// ============================================================
// DLS React primitives
//
// These are thin wrappers. Each one emits the exact `mrdn-` markup defined in
// dls/components.css - it adds NO styling of its own. The DLS stays the single
// source of truth (Rule 0); React just gives us a typed, composable way to
// stamp out that markup. Never add colours/spacing/radii here: use tokens in
// the CSS layer instead.
// ============================================================
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

/* ---- Card ---- */
export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("mrdn-card", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mrdn-card__header">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <span className="mrdn-card__title">{children}</span>;
}

/* ---- Stat ---- */
export function Stat({
  label,
  value,
  delta,
  deltaTone,
  children,
}: {
  label?: ReactNode;
  value?: ReactNode;
  delta?: ReactNode;
  deltaTone?: "positive" | "negative";
  children?: ReactNode;
}) {
  return (
    <div className="mrdn-stat">
      {label != null && <span className="mrdn-stat__label">{label}</span>}
      {value != null && <span className="mrdn-stat__value">{value}</span>}
      {delta != null && (
        <span className={cx("mrdn-stat__delta", deltaTone && `is-${deltaTone}`)}>
          {delta}
        </span>
      )}
      {children}
    </div>
  );
}

/* ---- Amount ---- */
export function Amount({
  tone = "default",
  children,
}: {
  tone?: "default" | "credit" | "over";
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "mrdn-amount",
        tone === "credit" && "is-credit",
        tone === "over" && "is-over",
      )}
    >
      {children}
    </span>
  );
}

/* ---- Button ---- */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  block?: boolean;
}
export function Button({
  variant = "primary",
  block = false,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "mrdn-btn",
        `mrdn-btn--${variant}`,
        block && "mrdn-btn--block",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---- Pill ---- */
export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "positive" | "negative" | "accent";
  children: ReactNode;
}) {
  return (
    <span className={cx("mrdn-pill", tone !== "neutral" && `mrdn-pill--${tone}`)}>
      {children}
    </span>
  );
}

/* ---- Chip (filter / segmented choice) ---- */
export function Chip({
  active = false,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cx("mrdn-chip", active && "is-active", className)}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---- List + Row ---- */
export function List({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("mrdn-list", className)}>{children}</div>;
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="mrdn-row">{children}</div>;
}

export function RowIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mrdn-row__icon" aria-hidden="true">
      {children}
    </div>
  );
}

export function RowBody({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="mrdn-row__body">
      <span className="mrdn-row__primary">{primary}</span>
      {secondary != null && <span className="mrdn-row__secondary">{secondary}</span>}
    </div>
  );
}

export function RowEnd({ children }: { children: ReactNode }) {
  return <div className="mrdn-row__end">{children}</div>;
}

/* ---- Progress ---- */
export function Progress({
  value,
  label,
}: {
  /** 0-100. Clamped. */
  value: number;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="mrdn-progress__track"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="mrdn-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---- Avatar ---- */
export function Avatar({
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="mrdn-avatar" {...rest}>
      {children}
    </span>
  );
}
