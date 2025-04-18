# Testing Guide for Optiflow

This project has a comprehensive testing setup with unit tests, component tests, and end-to-end tests.

## Testing Stack

- **Unit & Component Testing**: Jest + React Testing Library
- **API Mocking**: Mock Service Worker (MSW)
- **End-to-End Testing**: Playwright
- **OAuth Mocking**: Custom Express server for OAuth flow testing

## Running Tests

### Unit and Component Tests

```bash
# Run all unit and component tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests (exclude e2e)
npm run test:unit

# Run tests with coverage report
npm run test:coverage

# Run tests in debug mode
npm run test:debug

# Run a specific test file
npm test -- src/components/__tests__/Header.test.tsx
```

### End-to-End Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run in UI mode (with visual test runner)
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium

# Test against the Vercel deployment
# (Make sure TEST_BASE_URL is set in .env.test)
npm run test:e2e
```

## Testing Pipedream Integration

The application integrates with Pipedream for connecting to external services. Testing these OAuth flows requires special handling.

### Testing OAuth Flows

#### Automated Testing with Mock OAuth Server

For automated CI/CD testing, we use a mock OAuth server that simulates the Pipedream OAuth flow:

```bash
# Run the mock OAuth server
npm run mock:oauth

# Run E2E tests with mock OAuth server
npm run test:e2e:with-mock

# Run only the Pipedream integration tests
npx playwright test tests/pipedream-integration.spec.ts
```

The mock OAuth server simulates:
- OAuth authorization screens
- Token exchanges
- API responses for connected services

#### Manual Testing of Real OAuth Flows

For manual testing against real Pipedream services:

```bash
# Set environment variable to enable real OAuth flows
npm run test:oauth-flow
```

This will run the tests without skipping the OAuth flow steps, allowing for manual interaction during testing.

### Configuration

OAuth testing settings are in `.env.test`:

```
# OAuth testing configuration
ENABLE_REAL_OAUTH=false
MOCK_OAUTH_PROVIDER_URL=http://localhost:3001/mock-oauth
USE_MOCK_OAUTH_SERVER=true
```

## Test Structure

- **Unit/Component Tests**: Located in `__tests__` folders next to the components they test
- **E2E Tests**: Located in the `/tests` directory
- **API Mocks**: Located in the `/mocks` directory
- **Test Configuration**: 
  - `jest.config.js` - Jest configuration
  - `playwright.config.ts` - Playwright configuration
  - `.env.test` - Test environment variables
  - `babel.config.js` - Babel configuration for tests
- **OAuth Mocking**: `tests/mock-oauth-server.js` - Mock server for OAuth flows

## Testing Vercel Deployments

The E2E tests can target your Vercel deployment by setting the `TEST_BASE_URL` environment variable in `.env.test`:

```
TEST_BASE_URL=https://your-app.vercel.app
```

When this URL is set, the tests will run against the deployed application instead of starting a local development server.

## Mocking External APIs

We use MSW (Mock Service Worker) to intercept and mock API calls during tests:

- `mocks/handlers.ts` - API route definitions
- `mocks/server.ts` - Server setup for Node.js environment (Jest)
- `mocks/browser.ts` - Browser setup for browser environment

## Writing Tests

### Component Tests Example

```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### API Mock Example

```tsx
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

beforeEach(() => {
  // Override default handlers for specific test
  server.use(
    http.post('https://api.anthropic.com/v1/messages', () => {
      return HttpResponse.json({ content: 'Custom response' });
    })
  );
});
```

## Best Practices

1. **Mock external dependencies**: Use MSW to mock API calls to Anthropic and other external services
2. **Test user interactions**: Focus on how users interact with components, not implementation details
3. **Use data-testid attributes**: Add `data-testid` attributes for stable test selectors
4. **Keep tests isolated**: Each test should be independent and not rely on other tests
5. **Use meaningful assertions**: Verify behavior that's important to users and business requirements

## CI/CD Integration

Tests automatically run in CI/CD pipelines using GitHub Actions, ensuring quality before deployment to Vercel. 