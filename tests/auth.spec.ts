import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test.describe('Login Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/login');
        });

        test('should show validation errors for empty fields', async ({ page }) => {
            await page.getByRole('button', { name: /giriş yap/i }).click();

            // Zod hata mesajlarını kontrol et
            await expect(page.getByText('E-posta adresi gereklidir')).toBeVisible();
            await expect(page.getByText('Şifre gereklidir')).toBeVisible();
        });

        test('should show error for invalid email format', async ({ page }) => {
            await page.fill('input[name="email"]', 'invalid-email');
            await page.getByRole('button', { name: /giriş yap/i }).click();

            await expect(page.getByText('Geçerli bir e-posta adresi giriniz')).toBeVisible();
        });

        test('should have a link to forgot password', async ({ page }) => {
            const forgotLink = page.getByRole('link', { name: /şifrenizi mi unuttunuz/i });
            await expect(forgotLink).toBeVisible();
            await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
        });
    });

    test.describe('Register Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/register');
        });

        test('should show validation indicators for password', async ({ page }) => {
            const passwordInput = page.locator('input[type="password"]');
            await passwordInput.fill('123');

            // Şifre kriterlerini kontrol et (kırmızı/gri olmalı)
            await expect(page.getByText('En az 6 karakter')).toBeVisible();

            await passwordInput.fill('ABC123abc');
            // Hepsi yeşil olmalı (visual check zor ama metin orada olmalı)
            await expect(page.getByText('En az 1 büyük harf')).toBeVisible();
        });

        test('should toggle account type', async ({ page }) => {
            const businessBtn = page.getByText('İşletme');
            const individualBtn = page.getByText('Bireysel');

            await individualBtn.click();
            // Kontrol et (UI state değişimi)
            await expect(individualBtn).toHaveClass(/bg-blue-600/);

            await businessBtn.click();
            await expect(businessBtn).toHaveClass(/bg-blue-600/);
        });
    });

    test.describe('Forgot Password Page', () => {
        test('should navigate and show forgot password form', async ({ page }) => {
            await page.goto('/forgot-password');
            await expect(page.getByText('Şifrenizi mi unuttunuz?')).toBeVisible();
            await expect(page.locator('input[name="email"]')).toBeVisible();
        });
    });
});
