import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display main heading', async ({ page }) => {
        // Ana başlığın veya logonun varlığını kontrol et
        const heading = page.getByText('Randevulu');
        await expect(heading).toBeVisible();
    });

    test('should have a working search or explore link', async ({ page }) => {
        // Keşfet veya randevu al butonunun varlığını kontrol et
        const exploreBtn = page.getByRole('link', { name: /keşfet/i }).first();
        if (await exploreBtn.isVisible()) {
            await expect(exploreBtn).toHaveAttribute('href', '/explore');
        }
    });

    test('navigaton links should be present', async ({ page }) => {
        const loginLink = page.getByRole('link', { name: /giriş/i });
        const registerLink = page.getByRole('link', { name: /kayıt/i });

        await expect(loginLink).toBeVisible();
        await expect(registerLink).toBeVisible();
    });
});
