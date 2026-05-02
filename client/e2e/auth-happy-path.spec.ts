import { test, expect } from '@playwright/test';

function createMockJwt(role: 'user' | 'admin' = 'user') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, role })).toString('base64url');
  return `${header}.${payload}.signature`;
}

test('registration followed by login reaches the dashboard', async ({ page }) => {
  const suffix = `${Date.now()}`;
  const email = `e2e-${suffix}@example.com`;
  const password = 'Password123!';
  const name = `E2E User ${suffix}`;

  await page.route('**/api/auth/register', async route => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Registration successful' })
    });
  });

  await page.route('**/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Login successful',
        token: createMockJwt('user'),
        user: {
          id: 'mock-user-id',
          email,
          role: 'user'
        }
      })
    });
  });

  await page.route('**/api/measurement-categories**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]'
    });
  });

  await page.route('**/api/measurements**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]'
    });
  });

  await page.route('**/api/daily-lists**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ categories: [] })
    });
  });

  await page.route('**/api/daily-food-lists**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]'
    });
  });

  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: 'Health Dashboard' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toContainText('Logout');
});