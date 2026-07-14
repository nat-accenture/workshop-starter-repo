// Meridian theme controller (shared by every page).
//
// Dark mode is pure token overrides in dls/tokens.css. This module does not
// style anything: it only decides WHICH theme is active, remembers the user's
// choice, and keeps any [data-theme-toggle] buttons in sync. A tiny inline
// script in each page's <head> sets the initial theme before first paint to
// avoid a flash; this module handles toggling and system-preference changes.

const STORAGE_KEY = "meridian-theme";
const root = document.documentElement;

const systemPrefersDark = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

function storedChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function resolvedTheme() {
  const choice = storedChoice();
  if (choice === "light" || choice === "dark") return choice;
  return systemPrefersDark() ? "dark" : "light";
}

// Reflect the active theme onto <html> and every toggle button.
function apply(theme) {
  root.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    btn.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    const sun = btn.querySelector("[data-icon-sun]");
    const moon = btn.querySelector("[data-icon-moon]");
    if (sun && moon) {
      // Show the icon for the theme you would switch TO. SVG elements do not
      // support the HTML `hidden` property, so toggle display directly.
      sun.style.display = theme === "dark" ? "" : "none";
      moon.style.display = theme === "dark" ? "none" : "";
    }
  });
}

function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable, theme still applies for this page load */
  }
  apply(theme);
}

function init() {
  apply(resolvedTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Follow the OS setting live, but only while the user has not chosen explicitly.
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!storedChoice()) apply(systemPrefersDark() ? "dark" : "light");
    });
}
