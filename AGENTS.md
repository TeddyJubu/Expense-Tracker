# AGENTS.md - Expense Tracker App

## Build/Lint/Test Commands
```bash
# Development
npm start              # Start Expo development server
npm run android        # Start Android development
npm run ios           # Start iOS development
npm run web           # Start web development

# Code Quality
npm run lint          # Run ESLint (expo lint)
```

## Code Style Guidelines

### Technology Stack
- **Framework**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **TypeScript**: Strict mode enabled with path aliases `@/*`
- **State**: Context API with hooks pattern

### Import Conventions
```typescript
// React and React Native imports first
import React from 'react';
import { View, Text } from 'react-native';

// Third-party library imports
import { Ionicons } from '@expo/vector-icons';

// Local imports with @ alias
import { Button } from '@/components/ui/Button';
import { useExpense } from '@/hooks/useExpense';
```

### Component Patterns
- Use functional components with TypeScript interfaces for props
- Follow the pattern: `Component: React.FC<Props>`
- Default props should be handled in destructuring
- Use consistent prop naming: `variant`, `size`, `className`, `disabled`, `loading`

### Styling Conventions
- Use NativeWind classes for styling (Tailwind for React Native)
- Dark mode first approach with `dark:` prefix
- Color system: `bg-primary`, `text-foreground`, `border-border`
- Custom color palette in `tailwind.config.js` with lime accents
- Component variants: `elevated` | `outlined` | `flat`

### Naming Conventions
- Components: PascalCase (e.g., `ExpenseItem`, `AddExpenseModal`)
- Hooks: camelCase with `use` prefix (e.g., `useExpense`, `useThemeColor`)
- Files: PascalCase for components, camelCase for utilities
- Types/Interfaces: PascalCase (e.g., `ButtonProps`, `Expense`)

### Error Handling
- Use try-catch blocks for async operations
- Log errors with context: `console.error('Error loading data:', error)`
- Handle loading states with explicit `loading` prop/boolean
- Graceful fallbacks for missing data

### File Structure
```
components/
  ui/           # Reusable UI components
  feature/      # Feature-specific components
hooks/          # Custom React hooks
contexts/       # React Context providers
services/       # API and database services
constants/      # App constants and configuration
app/            # Expo Router pages and navigation
```