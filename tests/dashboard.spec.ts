import { test, expect } from '@playwright/test';

test.describe('Dashboard Security', () => {

    test('should redirect unauthorized user to login', async ({ page }) => {
        // Korumalı bir sayfaya gitmeyi dene
        await page.goto('/dashboard');

        // Auth middleware veya yönlendirme çalışmalı
        // URL login içermeli
        await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect appointments page to login if not authenticated', async ({ page }) => {
        await page.goto('/dashboard/appointments');
        await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect services settings to login if not authenticated', async ({ page }) => {
        await page.goto('/dashboard/settings');
        await expect(page).toHaveURL(/.*login.*/);
    });
});
