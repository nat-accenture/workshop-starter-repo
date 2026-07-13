// @ts-check
const { test, expect } = require("@playwright/test");

// Behaviour contract for the Meridian dashboard.
// Runs at mobile, tablet, and desktop (see playwright.config.js).
// As you build the widget hooks, add checks for them here.

test("shell renders: brand, greeting, balances, quick actions", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".app-wordmark")).toHaveText("Meridian");
  await expect(page.getByRole("heading", { name: /good morning/i })).toBeVisible();

  // Balance summary reads three accounts from the mock API.
  await expect(page.locator("#accounts .account-card")).toHaveCount(3);
  await expect(page.getByText("$8,412.90")).toBeVisible();

  // Quick actions are present.
  await expect(page.getByRole("button", { name: "Transfer" })).toBeVisible();
});

test("layout is responsive: stacked on mobile, side by side otherwise", async ({ page }, testInfo) => {
  await page.goto("/");
  const cards = page.locator("#accounts .account-card");
  await expect(cards.first()).toBeVisible();

  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  if (!first || !second) throw new Error("account cards not found");

  if (testInfo.project.name === "mobile") {
    // single column: the second card sits below the first
    expect(second.y).toBeGreaterThan(first.y + first.height - 1);
  } else {
    // multi column: the second card sits to the right of the first
    expect(second.x).toBeGreaterThan(first.x + 1);
  }
});

test("capture a screenshot for the readout", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByText("$8,412.90").waitFor();
  await page.screenshot({
    path: testInfo.outputPath(`meridian-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
