// DLS layout primitives - the mrdn- grid and flow helpers from
// dls/components.css. Wrappers only; the responsive behaviour (12 -> 6 -> 1
// column) lives entirely in the CSS and is what the behaviour contract checks.
import type { HTMLAttributes, ReactNode } from "react";

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

export type ColSpan = 4 | 6 | 8 | 12;

export function Grid({ children }: { children: ReactNode }) {
  return <div className="mrdn-grid">{children}</div>;
}

export function Col({
  span,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { span: ColSpan }) {
  return (
    <section className={cx(`mrdn-col-${span}`, className)} {...rest}>
      {children}
    </section>
  );
}

export function Stack({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("mrdn-stack", className)}>{children}</div>;
}

export function Cluster({ children }: { children: ReactNode }) {
  return <div className="mrdn-cluster">{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mrdn-section-title">{children}</h2>;
}
