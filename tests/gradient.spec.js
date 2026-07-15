// @ts-check
const { test, expect } = require("@playwright/test");

// Smoke suite for the ambient gradient background layer (Phase 4, Plan 01).
// Covers D-03 (full-viewport fixed layer), D-10 (pointer-events:none, z-index),
// D-11 (both routes), and a D-09 scaffold (no animation under reduced motion).
// Runs on mobile, tablet, and desktop. No screenshot test needed.
//
// On the `mobile` project (pointer: fine) === false — noted for Plan 03
// when .gradient-bg--breathing assertions need project-name branching.
// For this plan the five tests below are project-agnostic and must pass
// on all three projects unchanged.

test("gradient layer exists and covers the full viewport", async ({ page }) => {
  await page.goto("/");

  const layer = page.locator('[data-testid="gradient-bg"]');
  await expect(layer).toBeVisible();

  const vp = page.viewportSize();
  const box = await layer.boundingBox();
  if (!box) throw new Error("gradient-bg bounding box not found");

  expect(box.x).toBe(0);
  expect(box.y).toBe(0);
  expect(Math.round(box.width)).toBe(vp.width);
  expect(Math.round(box.height)).toBe(vp.height);
});

test("gradient layer does not block clicks", async ({ page }) => {
  await page.goto("/");

  // The layer must not intercept pointer events: clicking Transfer must resolve.
  await page.getByRole("button", { name: "Transfer" }).click();
});

test("gradient layer sits below the app-bar", async ({ page }) => {
  await page.goto("/");

  const layer = page.locator('[data-testid="gradient-bg"]');
  const z = await layer.evaluate((el) => getComputedStyle(el).zIndex);

  // .app-bar is z-index: 10; the gradient layer must be below it (D-10).
  expect(Number(z)).toBeLessThan(10);
});

test("gradient layer renders on both routes", async ({ page }) => {
  const layer = page.locator('[data-testid="gradient-bg"]');

  await page.goto("/");
  await expect(layer).toBeVisible();

  await page.goto("/kitchen-sink");
  await expect(layer).toBeVisible();
});

test("gradient layer is static under reduced motion (D-09 scaffold)", async ({ page }) => {
  // emulateMedia must be called before goto to affect the first page load.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const layer = page.locator('[data-testid="gradient-bg"]');
  const dur = await layer.evaluate((el) => getComputedStyle(el).animationDuration);

  // The DLS global reset (components.css) forces animation-duration to 0.001ms
  // under prefers-reduced-motion. The base layer has no animation yet, so this
  // passes trivially now and stays green after Plan 03 adds breathing.
  expect(parseFloat(dur)).toBeLessThan(1);
});

test("breathing fallback: present on touch, absent on fine pointer", async ({ page }, testInfo) => {
  await page.goto("/");
  const layer = page.locator('[data-testid="gradient-bg"]');
  await expect(layer).toBeVisible();
  if (testInfo.project.name === "mobile") {
    // coarse pointer → breathing mode
    await expect(layer).toHaveClass(/gradient-bg--breathing/);
  } else {
    // fine pointer → pointer-tracking mode, no breathing class
    await expect(layer).not.toHaveClass(/gradient-bg--breathing/);
  }
});
