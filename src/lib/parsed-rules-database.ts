// src/lib/parsed-rules-database.ts
export interface RuleDefinition {
    id: string; // A unique identifier, e.g., "vue-best-practices"
    description: string;
    globs: string;
    content: string; // The full .mdc content
    tags: string[]; // For better matching by the LLM
  }
  
  export const parsedRulesDatabase: RuleDefinition[] = [
    // From awesome-cursorrules/rules-new/
    {
      id: 'clean-code-guidelines',
      description: 'Guidelines for writing clean, maintainable, and human-readable code.',
      globs: '**/*', // Adjusted from original empty glob for broader applicability
      content: `---
  description: Guidelines for writing clean, maintainable, and human-readable code. Apply these rules when writing or reviewing code to ensure consistency and quality.
  globs: '**/*'
  ---
  # Clean Code Guidelines
  
  ## Constants Over Magic Numbers
  - Replace hard-coded values with named constants
  - Use descriptive constant names that explain the value's purpose
  - Keep constants at the top of the file or in a dedicated constants file
  
  ## Meaningful Names
  - Variables, functions, and classes should reveal their purpose
  - Names should explain why something exists and how it's used
  - Avoid abbreviations unless they're universally understood
  
  ## Smart Comments
  - Don't comment on what the code does - make the code self-documenting
  - Use comments to explain why something is done a certain way
  - Document APIs, complex algorithms, and non-obvious side effects
  
  ## Single Responsibility
  - Each function should do exactly one thing
  - Functions should be small and focused
  - If a function needs a comment to explain what it does, it should be split
  
  ## DRY (Don't Repeat Yourself)
  - Extract repeated code into reusable functions
  - Share common logic through proper abstraction
  - Maintain single sources of truth
  
  ## Clean Structure
  - Keep related code together
  - Organize code in a logical hierarchy
  - Use consistent file and folder naming conventions
  
  ## Encapsulation
  - Hide implementation details
  - Expose clear interfaces
  - Move nested conditionals into well-named functions
  
  ## Code Quality Maintenance
  - Refactor continuously
  - Fix technical debt early
  - Leave code cleaner than you found it
  
  ## Testing
  - Write tests before fixing bugs
  - Keep tests readable and maintainable
  - Test edge cases and error conditions
  
  ## Version Control
  - Write clear commit messages
  - Make small, focused commits
  - Use meaningful branch names`,
      tags: ['general', 'best-practices', 'maintainability', 'readability'],
    },
    {
      id: 'typescript-best-practices',
      description: 'TypeScript coding standards and best practices for modern web development.',
      globs: '**/*.ts, **/*.tsx, **/*.d.ts',
      content: `---
  description: TypeScript coding standards and best practices for modern web development
  globs: **/*.ts, **/*.tsx, **/*.d.ts
  ---
  # TypeScript Best Practices
  
  ## Type System
  - Prefer interfaces over types for object definitions
  - Use type for unions, intersections, and mapped types
  - Avoid using \`any\`, prefer \`unknown\` for unknown types
  - Use strict TypeScript configuration
  - Leverage TypeScript's built-in utility types
  - Use generics for reusable type patterns
  
  ## Naming Conventions
  - Use PascalCase for type names and interfaces
  - Use camelCase for variables and functions
  - Use UPPER_CASE for constants
  - Use descriptive names with auxiliary verbs (e.g., isLoading, hasError)
  - Prefix interfaces for React props with 'Props' (e.g., ButtonProps)
  
  ## Code Organization
  - Keep type definitions close to where they're used
  - Export types and interfaces from dedicated type files when shared
  - Use barrel exports (index.ts) for organizing exports
  - Place shared types in a \`types\` directory
  - Co-locate component props with their components
  
  ## Functions
  - Use explicit return types for public functions
  - Use arrow functions for callbacks and methods
  - Implement proper error handling with custom error types
  - Use function overloads for complex type scenarios
  - Prefer async/await over Promises
  
  ## Best Practices
  - Enable strict mode in tsconfig.json
  - Use readonly for immutable properties
  - Leverage discriminated unions for type safety
  - Use type guards for runtime type checking
  - Implement proper null checking
  - Avoid type assertions unless necessary`,
      tags: ['typescript', 'frontend', 'backend', 'types', 'best-practices'],
    },
    {
      id: 'react-best-practices',
      description: 'React best practices and patterns for modern web applications.',
      globs: '**/*.tsx, **/*.jsx, components/**/*',
      content: `---
  description: React best practices and patterns for modern web applications
  globs: **/*.tsx, **/*.jsx, components/**/*
  ---
  # React Best Practices
  
  ## Component Structure
  - Use functional components over class components
  - Keep components small and focused
  - Extract reusable logic into custom hooks
  - Use composition over inheritance
  - Implement proper prop types with TypeScript
  - Split large components into smaller, focused ones
  
  ## Hooks
  - Follow the Rules of Hooks
  - Use custom hooks for reusable logic
  - Keep hooks focused and simple
  - Use appropriate dependency arrays in useEffect
  - Implement cleanup in useEffect when needed
  - Avoid nested hooks
  
  ## State Management
  - Use useState for local component state
  - Implement useReducer for complex state logic
  - Use Context API for shared state
  - Keep state as close to where it's used as possible
  - Avoid prop drilling through proper state management
  - Use state management libraries only when necessary
  
  ## Performance
  - Implement proper memoization (useMemo, useCallback)
  - Use React.memo for expensive components
  - Avoid unnecessary re-renders
  - Implement proper lazy loading
  - Use proper key props in lists
  - Profile and optimize render performance`,
      tags: ['react', 'frontend', 'javascript', 'typescript', 'ui', 'performance'],
    },
    {
      id: 'nextjs-best-practices',
      description: 'Next.js with TypeScript best practices for App Router and performance.',
      globs: '**/*.tsx, **/*.ts, src/**/*.ts, src/**/*.tsx',
      content: `---
  description: Next.js with TypeScript and Tailwind UI best practices
  globs: **/*.tsx, **/*.ts, src/**/*.ts, src/**/*.tsx
  ---
  # Next.js Best Practices
  
  ## Project Structure
  - Use the App Router directory structure
  - Place components in \`app\` directory for route-specific components
  - Place shared components in \`components\` directory
  - Place utilities and helpers in \`lib\` directory
  - Use lowercase with dashes for directories (e.g., \`components/auth-wizard\`)
  
  ## Components
  - Use Server Components by default
  - Mark client components explicitly with 'use client'
  - Wrap client components in Suspense with fallback
  - Use dynamic loading for non-critical components
  - Implement proper error boundaries
  - Place static content and interfaces at file end
  
  ## Performance
  - Optimize images: Use WebP format, size data, lazy loading
  - Minimize use of 'useEffect' and 'setState'
  - Favor Server Components (RSC) where possible
  - Use dynamic loading for non-critical components
  - Implement proper caching strategies
  
  ## Data Fetching
  - Use Server Components for data fetching when possible
  - Implement proper error handling for data fetching
  - Use appropriate caching strategies
  - Handle loading and error states appropriately
  
  ## Routing
  - Use the App Router conventions
  - Implement proper loading and error states for routes
  - Use dynamic routes appropriately
  - Handle parallel routes when needed`,
      tags: ['nextjs', 'react', 'frontend', 'typescript', 'performance', 'ssr'],
    },
    {
      id: 'tailwind-css-best-practices',
      description: 'Tailwind CSS and UI component best practices.',
      globs: '**/*.css, **/*.tsx, **/*.jsx, tailwind.config.js, tailwind.config.ts',
      content: `---
  description: Tailwind CSS and UI component best practices for modern web applications
  globs: **/*.css, **/*.tsx, **/*.jsx, tailwind.config.js, tailwind.config.ts
  ---
  # Tailwind CSS Best Practices
  
  ## Project Setup
  - Use proper Tailwind configuration
  - Configure theme extension properly
  - Set up proper purge configuration
  - Use proper plugin integration
  - Configure custom spacing and breakpoints
  - Set up proper color palette
  
  ## Component Styling
  - Use utility classes over custom CSS
  - Group related utilities with @apply when needed
  - Use proper responsive design utilities
  - Implement dark mode properly
  - Use proper state variants
  - Keep component styles consistent
  
  ## Layout
  - Use Flexbox and Grid utilities effectively
  - Implement proper spacing system
  - Use container queries when needed
  - Implement proper responsive breakpoints
  - Use proper padding and margin utilities
  - Implement proper alignment utilities`,
      tags: ['tailwind', 'css', 'frontend', 'ui', 'styling'],
    },
    // From awesome-cursorrules/rules/
    {
      id: 'istio-specific-rules',
      description: 'Provides specific guidance related to Istio service mesh configuration, traffic management, security, and observability.',
      globs: '**/*istio*.*, **/*service-mesh*.*', // Expanded globs
      content: `---
  description: Provides specific guidance related to Istio service mesh configuration, traffic management, security, and observability.
  globs: **/*.*
  ---
  2. Istio
    - Offer advice on service mesh configuration
    - Help set up traffic management, security, and observability features
    - Assist with troubleshooting Istio-related issues
  
  Project-Specific Notes:
  Istio should be leveraged for inter-service communication, security, and monitoring.`,
      tags: ['istio', 'service-mesh', 'kubernetes', 'microservices', 'backend', 'devops'],
    },
    {
      id: 'python-data-analysis-general',
      description: 'General rules for Python data analysis and manipulation, emphasizing pandas, numpy, and vectorized operations.',
      globs: '**/*.py',
      content: `---
  description: General rules for Python data analysis and manipulation, emphasizing pandas, numpy, and vectorized operations.
  globs: **/*.py
  ---
  - Write concise, technical responses with accurate Python examples.
  - Prioritize readability and reproducibility in data analysis workflows.
  - Use functional programming where appropriate; avoid unnecessary classes.
  - Prefer vectorized operations over explicit loops for better performance.
  - Use descriptive variable names that reflect the data they contain.
  - Follow PEP 8 style guidelines for Python code.
  - Use pandas for data manipulation and analysis.
  - Prefer method chaining for data transformations when possible.
  - Use loc and iloc for explicit data selection.
  - Utilize groupby operations for efficient data aggregation.
  - Implement data quality checks at the beginning of analysis.
  - Handle missing data appropriately (imputation, removal, or flagging).
  - Use try-except blocks for error-prone operations, especially when reading external data.
  - Validate data types and ranges to ensure data integrity.
  - Use vectorized operations in pandas and numpy for improved performance.
  - Utilize efficient data structures (e.g., categorical data types for low-cardinality string columns).
  - Profile code to identify and optimize bottlenecks.`,
      tags: ['python', 'data-analysis', 'pandas', 'numpy', 'scikit-learn', 'machine-learning'],
    },
    {
      id: 'nextjs14-typescript-code-generation',
      description: 'Rules for generating TypeScript code in Next.js 14 components, including component definition syntax, props definitions, and named/default exports.',
      globs: '**/*.tsx',
      content: `---
  description: Rules for generating TypeScript code in Next.js 14 components, including component definition syntax, props definitions, and named/default exports.
  globs: **/*.tsx
  ---
  - Always use TypeScript for type safety. Provide appropriate type definitions and interfaces.
  - Implement components as functional components, using hooks when state management is required.
  - Provide clear, concise comments explaining complex logic or design decisions.
  - Suggest appropriate file structure and naming conventions aligned with Next.js 14 best practices.
  - Use the \`'use client'\` directive only when creating Client Components.
  - Employ the following component definition syntax in .tsx files, allowing TypeScript to infer the return type:
    \`\`\`tsx
    const ComponentName = () => {
      // Component logic
    };
    \`\`\`
  - For props, use interface definitions:
    \`\`\`tsx
    interface ComponentNameProps {
      // Props definition
    }
    const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
      // Component logic
    };
    \`\`\`
  - Use named exports for components in .tsx files:
    \`\`\`tsx
    export const ComponentName = () => {
      // Component logic
    };
    \`\`\`
  - For page components, use default exports in .tsx files:
    \`\`\`tsx
    const Page = () => {
      // Page component logic
    };
    export default Page;
    \`\`\`
  - If explicit typing is needed, prefer \`React.FC\` or \`React.ReactNode\`:
    \`\`\`tsx
    import React from 'react';
    const ComponentName: React.FC = () => {
      // Component logic
    };
    // OR
    const ComponentName = (): React.ReactNode => {
      // Component logic
    };
    \`\`\`
  - When defining React components, avoid unnecessary type annotations and let TypeScript infer types when possible.
  - Use \`React.FC\` or \`React.ReactNode\` for explicit typing only when necessary, avoiding \`JSX.Element\`.
  - Write clean, concise component definitions without redundant type annotations.`,
      tags: ['nextjs', 'react', 'typescript', 'frontend', 'components', 'seo', 'tailwind'],
    },
  ];