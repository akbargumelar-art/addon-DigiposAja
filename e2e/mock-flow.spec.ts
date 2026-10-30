import { test, expect } from "@playwright/test";

test("login and upload CSV preview flow", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Login berhasil")).toBeVisible();
  await page.goto("/sellout");
  await page.locator("input[type=file]").setInputFiles({ name: "serial.csv", mimeType: "text/csv", buffer: Buffer.from("serial\\nMOCK-OK-001\\nMOCK-FAIL-002\\n") });
  await page.getByRole("button", { name: "Preview & Validasi" }).click();
  await expect(page.getByText("Preview (2 item)")).toBeVisible();
  await expect(page.getByText("MOCK-OK-001")).toBeVisible();
  await page.getByRole("button", { name: "Buat Job" }).click();
  await expect(page.getByText(/Job dibuat:/)).toBeVisible();
});
