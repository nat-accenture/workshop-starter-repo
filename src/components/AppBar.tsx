import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../dls";
import { ThemeToggle } from "./ThemeToggle";
import { BackIcon, BrandMark, GridIcon } from "./icons";

// The sticky top bar, shared by every route. `nav` is the route-specific link
// slot; `user` shows the greeting + avatar (dashboard only).
export function AppBar({ nav, user = false }: { nav?: ReactNode; user?: boolean }) {
  return (
    <header className="app-bar">
      <Link className="app-brand" to="/" aria-label="Meridian home">
        <span className="app-mark">
          <BrandMark />
        </span>
        <span className="app-wordmark">Meridian</span>
      </Link>
      <div className="app-bar__right">
        {nav}
        <ThemeToggle />
        {user && (
          <>
            <span className="app-greeting">Alex Tan</span>
            <Avatar aria-hidden="true">AT</Avatar>
          </>
        )}
      </div>
    </header>
  );
}

// A router Link styled as a ghost DLS button (mrdn- classes only).
export function KitchenSinkLink() {
  return (
    <Link className="mrdn-btn mrdn-btn--ghost" to="/kitchen-sink" aria-label="Kitchen sink">
      <GridIcon />
      <span className="app-bar__label">Kitchen sink</span>
    </Link>
  );
}

export function DashboardLink() {
  return (
    <Link className="mrdn-btn mrdn-btn--ghost" to="/" aria-label="Back to dashboard">
      <BackIcon />
      <span className="app-bar__label">Dashboard</span>
    </Link>
  );
}
