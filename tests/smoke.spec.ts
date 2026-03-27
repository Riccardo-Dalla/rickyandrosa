import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

test("Homepage loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);
  await expect(page.locator("text=Rosa").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator("text=Riccardo").first()).toBeVisible({ timeout: 10000 });
  expect(errors).toEqual([]);
});

test("Save the Date loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("/save-the-date", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(200);
  expect(errors).toEqual([]);
});

test("Homepage has video element", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const video = page.locator("video").first();
  await expect(video).toBeAttached({ timeout: 10000 });
});

test("Navigation is visible on homepage", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const nav = page.locator("nav").first();
  await expect(nav).toBeVisible({ timeout: 10000 });
});

const hiddenRoutes = ["/events", "/bologna-guide", "/our-story", "/reverse-registry"];
const showAllPages = process.env.NEXT_PUBLIC_SHOW_ALL_PAGES === "true";

for (const route of hiddenRoutes) {
  if (showAllPages) {
    test(`${route} loads without errors`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
    });
  } else {
    test(`${route} redirects to homepage`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(page.url()).toContain("localhost");
      expect(new URL(page.url()).pathname).toBe("/");
    });
  }
}

test("Unknown route redirects to homepage", async ({ page }) => {
  await page.goto("/some-random-page", { waitUntil: "domcontentloaded" });
  await page.waitForURL("/", { timeout: 5000 });
  expect(new URL(page.url()).pathname).toBe("/");
});

test("API health: GET /api/commitments", async ({ request }) => {
  const response = await request.get("/api/commitments");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
});
