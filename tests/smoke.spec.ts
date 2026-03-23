import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", name: "Homepage", mustHave: ["Rosa", "Riccardo"] },
  { path: "/events", name: "Events" },
  { path: "/bologna-guide", name: "Bologna Guide" },
  { path: "/our-story", name: "Our Story" },
  { path: "/reverse-registry", name: "Reverse Registry" },
  { path: "/reverse-registry/activities", name: "Activities" },
  { path: "/reverse-registry/feed", name: "Feed" },
];

for (const page of pages) {
  test(`${page.name} (${page.path}) loads without errors`, async ({
    page: p,
  }) => {
    const errors: string[] = [];
    p.on("pageerror", (err) => errors.push(err.message));

    const response = await p.goto(page.path, { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);

    if (page.mustHave) {
      for (const text of page.mustHave) {
        await expect(p.locator(`text=${text}`).first()).toBeVisible({
          timeout: 10000,
        });
      }
    }

    expect(errors).toEqual([]);
  });
}

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

test("Navigation is visible", async ({ page }) => {
  await page.goto("/events", { waitUntil: "domcontentloaded" });
  const nav = page.locator("nav").first();
  await expect(nav).toBeVisible({ timeout: 10000 });
});

test("API health: GET /api/commitments", async ({ request }) => {
  const response = await request.get("/api/commitments");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
});
