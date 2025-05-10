import { expect, test } from '@playwright/test';

test.describe('Pipedream Connect Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the integrations page on port 3000
    await page.goto('http://localhost:3000/integrations');
  });

  test('should display the Pipedream Connect section', async ({ page }) => {
    // Check if the Pipedream Connect section is visible
    await expect(page.getByText('Pipedream Connect')).toBeVisible();
    await expect(page.getByText('Connect your third-party accounts through Pipedream')).toBeVisible();
    await expect(page.getByText('Connect Account via Pipedream')).toBeVisible();
  });

  test('should show loading state when connecting', async ({ page }) => {
    // Mock the API response
    await page.route('http://localhost:3000/api/pipedream/connect', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'test-token' }),
      });
    });

    // Click the connect button
    await page.getByText('Connect Account via Pipedream').click();

    // Check if loading state is shown
    await expect(page.getByText('Connecting...')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('http://localhost:3000/api/pipedream/connect', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to generate Connect Token' }),
      });
    });

    // Click the connect button
    await page.getByText('Connect Account via Pipedream').click();

    // Check if error toast is shown
    await expect(page.getByText('An unexpected error occurred')).toBeVisible();
  });

  test('should handle successful connection', async ({ page }) => {
    // Mock successful API response
    await page.route('http://localhost:3000/api/pipedream/connect', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          token: 'test-token',
          connect_link_url: 'https://connect.pipedream.com/test'
        }),
      });
    });

    // Mock Pipedream SDK
    await page.addScriptTag({
      content: `
        window.pipedream = {
          connectAccount: (options) => {
            options.onSuccess({ id: 'test-connection' });
          }
        };
      `,
    });

    // Click the connect button
    await page.getByText('Connect Account via Pipedream').click();

    // Check if success toast is shown
    await expect(page.getByText('Account connected successfully!')).toBeVisible();
  });

  test('should handle connection errors', async ({ page }) => {
    // Mock successful API response
    await page.route('http://localhost:3000/api/pipedream/connect', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'test-token' }),
      });
    });

    // Mock Pipedream SDK error
    await page.addScriptTag({
      content: `
        window.pipedream = {
          connectAccount: (options) => {
            options.onError({ message: 'Connection failed' });
          }
        };
      `,
    });

    // Click the connect button
    await page.getByText('Connect Account via Pipedream').click();

    // Check if error toast is shown
    await expect(page.getByText('Failed to connect account. Please try again.')).toBeVisible();
  });
}); 