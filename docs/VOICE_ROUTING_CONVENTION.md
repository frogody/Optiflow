# Voice Routing Convention Guidelines

This document outlines the required conventions for voice routing in the Optiflow application. Following these standards ensures that all pages and workflows are accessible via voice commands.

## Overview

The Optiflow voice assistant requires standardized identifiers and handlers to navigate between pages and interact with components. Our validation system (`voice-check`) automatically verifies these conventions during CI builds.

## Requirements

### Page Exports

Every page in the application that should be voice-accessible **must** export a `voiceRoute` constant:

```tsx
// src/app/dashboard/page.tsx
export const voiceRoute = "dashboard";

export default function DashboardPage() {
  // ...page component implementation
}
```

This constant serves as a unique identifier that the voice system can use to navigate to this page.

### Intent/Skill Files

Each `voiceRoute` must have a corresponding intent or skill handler file that defines how the voice assistant should interpret and respond to related commands:

```typescript
// src/services/agents/intents/navigateToDashboard.ts
export default {
  name: "navigateToDashboard",
  description: "Navigate to the dashboard page",
  examples: [
    "go to dashboard",
    "show me the dashboard",
    "open dashboard"
  ],
  route: "dashboard",
 
  // Handler function
  handler({ context }) {
    return {
      response: "Opening the dashboard",
      action: "navigate",
      data: { route: "dashboard" }
    };
  }
};
```

The `route` property in the intent/skill file must match a `voiceRoute` exported from a page.

### Workflow Nodes

All workflow nodes must implement an `update` method that allows for programmatic modification via voice commands:

```tsx
// src/components/workflow/nodes/TextNode.tsx
export default function TextNode({ data, ...props }) {
  // ...component implementation
 
  // Required update method for voice control
  const update = (payload) => {
    // Update node data based on payload
    // This is called when voice commands modify this node
    setNodeData({
      ...data,
      ...payload
    });
  };
 
  return (
    <div className="workflow-node">
      {/* Node content */}
    </div>
  );
}
```

## Validation Process

Our validation script (`scripts/validate-voice-routing.ts`) automatically checks:

1. All pages have a `voiceRoute` export (except for layout, loading, error, and API pages)
2. All `voiceRoute` values have a matching intent/skill file
3. All intent/skill files with a `route` property match an existing page
4. All workflow nodes implement an `update` method with correct parameter handling

You can run this validation manually:

```bash
pnpm voice-check
```

The CI pipeline will also run this check and fail if any conventions are violated.

## Exemptions

The following types of pages do not require a `voiceRoute`:

- Layout files (`layout.tsx`)
- Loading states (`loading.tsx`)
- Error boundaries (`error.tsx`)
- Not-found pages (`not-found.tsx`)
- API routes (`/api/**/*.ts`)

## Adding Voice Navigation to New Pages

When creating a new page:

1. Add the `voiceRoute` export with a unique, descriptive ID
2. Create a matching intent file in `src/services/agents/intents/` or skill file in `src/services/agents/skills/`
3. Implement the necessary voice commands and handlers
4. Run `pnpm voice-check` to verify everything is correctly connected

## Best Practices

- Use clear, concise route IDs that reflect the page's purpose
- Provide multiple example phrases in intent files for better voice recognition
- Keep voice responses short and informative
- Test voice navigation flows frequently during development
- Consider accessibility needs when designing voice interactions

## Troubleshooting

If the validation script fails, check:

1. The spelling and casing of your `voiceRoute` matches exactly in both the page and intent files
2. Each `voiceRoute` is unique across the application
3. Intent files properly export the `route` property
4. Workflow nodes implement the `update` method with correct parameter handling
