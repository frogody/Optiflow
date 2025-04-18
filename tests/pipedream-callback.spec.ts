import { test, expect } from '@playwright/test';

/**
 * Test suite for Pipedream OAuth callback handling
 *
 * This tests how the application handles callbacks from Pipedream OAuth
 * process, both successful and unsuccessful cases.
 */

test.describe('Pipedream OAuth Callback', () => {
  test('Handles successful OAuth callback', async ({ page }) => {
    // Simulate a successful callback from Pipedream
    // The format of this URL would match your actual implementation
    await page.goto('/api/pipedream/callback?code=test_auth_code&state=test_state');
    
    // Verify that the application shows success message
    await expect(page.getByText(/success|connected|authorized/i)).toBeVisible({timeout: 10000});
    
    // Verify we get redirected to the appropriate page after success
    await expect(page).toHaveURL(/.*\/workflows|.*\/dashboard/);
    
    // Take a screenshot of success state
    await page.screenshot({ path: 'test-results/oauth-success-callback.png' });
  });
  
  test('Handles OAuth error callback', async ({ page }) => {
    // Simulate a failed callback from Pipedream
    await page.goto('/api/pipedream/callback?error=access_denied&state=test_state');
    
    // Verify that the application shows error message
    await expect(page.getByText(/error|failed|denied|unauthorized|try again/i)).toBeVisible({timeout: 10000});
    
    // Verify error page offers a way to retry or go back
    const retryButton = page.getByRole('button', { name: /retry|try again|back/i });
    await expect(retryButton).toBeVisible();
    
    // Take a screenshot of error state
    await page.screenshot({ path: 'test-results/oauth-error-callback.png' });
  });
  
  test('Handles missing or invalid parameters', async ({ page }) => {
    // Simulate callback with missing parameters
    await page.goto('/api/pipedream/callback');
    
    // Verify error handling for missing parameters
    await expect(page.getByText(/invalid|missing parameters|error/i)).toBeVisible({timeout: 10000});
    
    // Simulate callback with invalid state (potential CSRF attack)
    await page.goto('/api/pipedream/callback?code=test_code&state=invalid_state');
    
    // Verify security error is displayed
    await expect(page.getByText(/security|invalid state|error/i)).toBeVisible({timeout: 10000});
    
    // Take a screenshot of security error state
    await page.screenshot({ path: 'test-results/oauth-security-error.png' });
  });
  
  test('Session persistence after successful connection', async ({ page, context }) => {
    // First simulate a successful login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('securePassword123');
    await page.getByRole('button', { name: /sign in|log in|login/i }).click();
    
    // Then simulate a successful OAuth callback
    await page.goto('/api/pipedream/callback?code=test_auth_code&state=test_state');
    
    // Verify we're redirected to a logged-in state page
    await expect(page).toHaveURL(/.*\/workflows|.*\/dashboard/);
    
    // Navigate to a page that should show connected services
    await page.goto('/settings/integrations');
    
    // Verify the connection appears in the list of connected services
    await expect(page.getByText(/connected service|pipedream|integration/i)).toBeVisible();
    
    // Take a screenshot of the connected services
    await page.screenshot({ path: 'test-results/connected-services.png' });
  });
}); 