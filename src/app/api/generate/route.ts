import { NextRequest, NextResponse } from 'next/server';

const NEW_SYSTEM_PROMPT = `You are an expert AI assistant, VibeForge, designed to empower developers using AI-driven IDEs like Cursor and Windsurf. Your primary function is to generate comprehensive starter kits for new software projects, enabling users to 'vibe code' effectively and securely from day one.

Your goal is to analyze the user's project idea and their selected technology stack to generate a structured JSON response containing the following keys: "developmentPrompts", "rulesContent", "projectStructure".

Key Principles for Generation:
- Context is King: Emphasize creating and maintaining context for the AI.
- AI-First: Encourage delegating 80-90% of coding tasks to the AI.
- Iterative Refinement: Promote a workflow of generating, reviewing, and refining with AI.
- Security by Design: Integrate R.A.I.L.G.U.A.R.D. inspired principles.
- Modularity & Best Practices: Follow modern development standards.

Detailed Instructions for Each Output Field:

1.  "developmentPrompts" (String, Markdown):
    Generate a sequence of actionable, numbered prompts. These should guide the user through:
    - Initial planning (e.g., "Create a markdown checklist for feature X").
    - Project setup and configuration.
    - Step-by-step feature implementation (breaking down complex tasks).
    - Writing tests.
    - Iterative refinement (e.g., "Review the generated code for X and suggest improvements for Y").
    - Deployment.
    The prompts should be ready to be pasted into an AI coding assistant.

2.  "rulesContent" (String, Markdown):
    This content will guide the user in setting up AI rules for their IDE.
    - If Target IDE is Cursor:
        Describe the modern \`.cursor/rules/\` directory structure.
        Provide example content for essential modular \`*.mdc\` files using Markdown code blocks:
        - \`general.mdc\`: Overall project conventions, language versions, AI behavior (e.g., "AI: Explain complex logic").
        - \`{{tech_stack_primary}}.mdc\` (e.g., \`react.mdc\`, \`python.mdc\`): Rules for the primary framework/language.
        - \`security.mdc\`: Incorporate R.A.I.L.G.U.A.R.D. principles (e.g., "Security: Sanitize all external inputs", "Security: Use parameterized queries", "AI: Explicitly consider security vulnerabilities when generating code").
        - \`common_errors.mdc\`: Rules to prevent common bugs or enforce best practices (e.g., "Next.js 15+: Ensure 'await' for cookie/dynamic param functions if Next.js 15+ is used").
        Format this as a single Markdown string, clearly delineating the content for each suggested file using subheadings and code blocks.
    - If Target IDE is Windsurf:
        Generate content for a single \`.windsurfrules\` file (XML or the platform's expected format, typically high-level instructions).
        This file should be comprehensive: coding standards, architecture, preferred libraries for the stack, security guidelines (R.A.I.L.G.U.A.R.D. inspired), and project-specific conventions.
        Mention the v1 (streamlined) vs. v5 (comprehensive) philosophy if appropriate.
    - General for all rules:
        Rules should be high-level principles and constraints.
        No API keys or secrets in rules.
        Rules should be reviewable and encourage periodic pruning.

3.  "projectStructure" (String, Markdown):
    Detail a project folder/file structure optimized for AI comprehension and the chosen tech stack.
    This MUST include a \`docs/ai_context/\` directory with suggestions for:
    - \`PROJECT_OVERVIEW.md\`: High-level goals, target users, core problem.
    - \`ARCHITECTURE.md\`: Key architectural decisions, patterns, data flow.
    - \`CODING_STANDARDS.md\`: Project-specific coding conventions beyond the AI rules.
    - \`SECURITY_GUIDELINES.md\`: Project-specific security measures.
    Clearly show typical folders for source code, tests, static assets, etc., based on the tech stack.

Be specific, practical, and focus on modern best practices. Ensure the output is a single, valid JSON object with the specified keys.
`;

export async function POST(request: NextRequest) {
  try {
    const { description, ide, framework, backend, database } = await request.json();

    if (!description || !ide) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.log('No OpenAI API key found, using fallback generation');
      return NextResponse.json(generateFallbackResponse(description, ide, framework, backend, database));
    }

    const userPromptToLLM = `
User wants to build: ${description}

Technology Stack:
- Framework: ${framework || 'Not specified'}
- Backend: ${backend || 'Not specified'}
- Database: ${database || 'Not specified'}
- Target IDE: ${ide} 

Based on the system instructions, generate the comprehensive starter kit as a JSON object with the keys: "developmentPrompts", "rulesContent", "projectStructure".
Ensure the 'rulesContent' is tailored for the specified Target IDE (${ide}). For Cursor, describe the .cursor/rules/ directory structure and provide content for modular files. For Windsurf, provide content for a single .windsurfrules file.
The project structure must include a 'docs/ai_context/' directory with suggested markdown files.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: NEW_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPromptToLLM
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, 
        response_format: { type: "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API error: ${response.statusText}`, errorBody);
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const aiResponseContent = data.choices[0]?.message?.content;

    if (!aiResponseContent) {
      throw new Error('No response content from OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(aiResponseContent);
      const requiredKeys = ["developmentPrompts", "rulesContent", "projectStructure"];
      for (const key of requiredKeys) {
        if (!(key in parsedResponse) || !parsedResponse[key]) { // Also check if value is empty/null
          console.warn(`OpenAI response missing or empty key: ${key}. Falling back for this key.`);
          const fallback = generateFallbackResponse(description, ide, framework, backend, database);
          // @ts-expect-error - Fallback assignment to parsedResponse with dynamic key access
          parsedResponse[key] = fallback[key] || `Error: Content for ${key} could not be generated or was empty.`;
        }
      }
      return NextResponse.json(parsedResponse);
    } catch (e) {
      console.error('Failed to parse AI response as JSON or missing keys, returning full fallback:', e, aiResponseContent);
      return NextResponse.json(generateFallbackResponse(description, ide, framework, backend, database));
    }

  } catch (error) {
    console.error('Error in POST /api/generate:', error);
    const { description, ide, framework, backend, database } = await request.json().catch(() => ({
        description: 'a web application',
        ide: 'cursor',
        framework: 'React',
        backend: 'Node.js',
        database: 'PostgreSQL'
    }));
    return NextResponse.json(generateFallbackResponse(description, ide, framework, backend, database));
  }
}

// --- Fallback Generation Functions ---

function generateFallbackResponse(description: string, ide: string, framework?: string, backend?: string, database?: string) {
  const tech = {
    framework: framework || 'React',
    backend: backend || 'Node.js',
    database: database || 'PostgreSQL',
    description: description || 'a web application'
  };
  return {
    developmentPrompts: generateFallbackPrompts(tech.description, ide, tech.framework, tech.backend, tech.database),
    rulesContent: generateFallbackRules(tech.description, ide, tech.framework, tech.backend, tech.database),
    projectStructure: generateFallbackStructure(tech.description, tech.framework, tech.backend, tech.database, ide),
  };
}


function generateFallbackPrompts(description: string, ide: string, framework: string, backend: string, database: string): string {
  return `# Development Prompts for: ${description} (Target IDE: ${ide})

## Phase 1: Planning & Setup
1.  **Plan Core Features**: "Based on the project description '${description}', create a detailed markdown checklist of core features and sub-tasks. For each, note dependencies and estimated complexity (simple, medium, hard)."
2.  **Initialize Project**: "Initialize a new ${framework} project with TypeScript. Set up the basic folder structure, install common dependencies like Axios (if needed), and configure ESLint and Prettier for code quality."
3.  **Setup AI Context Directory**: "Create a \`docs/ai_context/\` directory. Populate \`PROJECT_OVERVIEW.md\` with the project description, target audience, and key goals. Create placeholders for \`ARCHITECTURE.md\`, \`CODING_STANDARDS.md\`, and \`SECURITY_GUIDELINES.md\`."
4.  **Basic Layout Component**: "Create the main layout component for the ${framework} app (e.g., \`Layout.tsx\`) including a header, footer, and main content area. Ensure it's responsive."

## Phase 2: Core Feature Implementation (Example: User Authentication)
5.  **Plan Authentication**: "Outline the steps to implement user authentication using ${backend} and ${database} (if applicable, or a service like Firebase/Auth0). Include registration, login, logout, and session management."
6.  **Implement Backend Auth**: "Generate the ${backend} API endpoints for user registration and login. Include password hashing (e.g., bcrypt) and JWT generation for sessions. Define database schemas/models for users in ${database}." (Skip if frontend-only auth or using Next.js API routes for simple cases)
7.  **Implement Frontend Auth UI**: "Create the ${framework} components for registration and login forms. Include input validation and state management for form data and errors."
8.  **Connect Frontend to Backend Auth**: "Implement the frontend logic to call the authentication API endpoints. Handle successful login by storing the JWT and redirecting. Manage loading states and display error messages."
9.  **Protected Routes**: "Implement protected routes in ${framework} that require authentication to access."
10. **Write Auth Tests**: "Write unit tests for the authentication logic (both frontend and backend if applicable) and integration tests for the login flow."

## Phase 3: Iterative Development & Refinement
11. **Implement Next Feature (from checklist in prompt 1)**: "Pick the next uncompleted feature from the checklist. Generate the necessary components, API endpoints, and logic. Remember to break it down if it's complex."
12. **Review and Refine**: "Review the code generated for [feature name]. Are there areas for improvement in terms of readability, performance, or error handling? Refactor the code to address these points."
13. **Add State Management**: "If the application state is becoming complex, integrate a state management library (e.g., Zustand, Redux Toolkit for React, Pinia for Vue). Refactor relevant components to use the global store."

## Phase 4: Testing & Quality Assurance
14. **Expand Test Coverage**: "Increase test coverage for the existing features. Focus on edge cases and critical user flows. Aim for at least 70% coverage."
15. **Cross-Browser Testing**: "Manually test the application on different browsers (Chrome, Firefox, Safari) and devices (desktop, tablet, mobile) to ensure compatibility and responsiveness."

## Phase 5: Deployment
16. **Prepare for Deployment**: "Optimize the application for production (e.g., code splitting, lazy loading, image optimization). Create a production build."
17. **Deploy Application**: "Set up deployment to a platform like Vercel (for frontend/Next.js) or Heroku/AWS (for backend). Configure environment variables for production."

Remember to use your AI assistant iteratively for each step. If the AI's output isn't perfect, provide feedback and ask for revisions.
`;
}

function generateFallbackRules(description: string, ide: string, framework: string, backend: string, database: string): string {
  const commonPreamble = `
<!-- These rules help guide the AI assistant for the project: ${description} -->
<!-- Tech Stack: ${framework}, ${backend}, ${database} -->
<!-- Target IDE: ${ide} -->

<!-- General Principles -->
<!-- Always prioritize code clarity, maintainability, and correctness. -->
<!-- Follow modern best practices for the specified technologies. -->
<!-- Generate code that is secure by default. -->
<!-- Suggest adding comments for complex logic. -->
<!-- Encourage writing unit and integration tests for new features. -->
`;

  if (ide === 'cursor') {
    return `
# AI Coding Rules for Cursor IDE

Based on your selection of Cursor IDE, we recommend a modular rules setup using the \`.cursor/rules/\` directory. This approach helps organize rules logically and makes them easier to manage.

Create the following files within the \`.cursor/rules/\` directory in your project root:

---
**File: \`.cursor/rules/general.mdc\`**
\`\`\`mdc
// General project conventions and AI behavior
"Project Goal: ${description}"
"Primary Language: ${framework.includes('React') || framework.includes('Vue') || framework.includes('Angular') || framework.includes('Svelte') || framework.includes('Next') ? 'TypeScript' : 'JavaScript (or Python/Go if backend is primary)'}"
"Default to modern ECMAScript features (ES2020+) if JavaScript/TypeScript."
"AI: Explain complex code snippets or non-obvious logic if not self-explanatory."
"AI: Suggest improvements for readability, maintainability, and performance."
"AI: Prefer functional programming patterns where appropriate, but use classes if they offer better clarity for the specific problem."
"Code Style: Adhere to Prettier formatting (ensure .prettierrc is configured in the project)."
"Code Style: Use camelCase for variables, functions, and instance members."
"Code Style: Use PascalCase for classes, types, interfaces, and components."
"Error Handling: Implement robust error handling for all I/O operations, API calls, and critical logic paths."
"Logging: Use a structured logging approach for backend services. Avoid logging sensitive information."
"Testing: Always include suggestions for unit and integration tests for new features."
"Testing: For React/Next.js, prefer Jest and React Testing Library."
\`\`\`
---
**File: \`.cursor/rules/${framework.toLowerCase().replace(/[^a-z0-9]/gi, '')}.mdc\`** (e.g., \`react.mdc\`, \`nextjs.mdc\`)
\`\`\`mdc
// Rules specific to ${framework}
${framework.includes('React') || framework.includes('Next') ?
`"Framework: Utilize functional components with Hooks."
"Framework: Ensure all list items have unique and stable \`key\` props."
"Framework: Props - Use TypeScript interfaces/types for prop definitions."
"Framework: State - For local state, use \`useState\`. For complex global state, consider Zustand or Jotai before reaching for Redux."
"Framework: Avoid prop drilling by using Context API or a global state manager where appropriate."
"Framework: Components should be small and focused on a single responsibility."` :
framework.includes('Vue') ?
`"Framework: Use Vue 3 Composition API for new components."
"Framework: Define props with type checking and validation."
"Framework: Use Pinia for state management."` :
`"Framework: Follow idiomatic patterns for ${framework}."`}
${framework.includes('Next') ?
`"Next.js: Prefer App Router over Pages Router for new development."
"Next.js: Utilize Server Components where possible for performance benefits."
"Next.js: Implement route handlers for API endpoints within the App Router."
"Next.js: Manage metadata using the Metadata API."` : ""}
\`\`\`
---
**File: \`.cursor/rules/security.mdc\`**
\`\`\`mdc
// Security Best Practices (R.A.I.L.G.U.A.R.D. Inspired)
"Security: Sanitize all external inputs (user input, API responses, URL parameters) to prevent XSS and other injection attacks."
"Security: Use parameterized queries or well-vetted ORMs to prevent SQL injection when interacting with '${database}'."
"Security: Implement proper authentication and authorization checks for all sensitive operations and data access."
"Security: Avoid exposing sensitive information (API keys, passwords, PII) in logs, error messages, or frontend code."
"Security: Use HTTPS for all communication."
"Security: Keep dependencies up-to-date to patch known vulnerabilities. AI, please highlight if a suggested library has known security issues."
"AI: When generating code, explicitly consider potential security vulnerabilities (e.g., XSS, CSRF, SQLi, SSRF, IDOR) and implement appropriate mitigations."
"AI: Do not include secrets or API keys directly in the codebase; guide the user to use environment variables and secure vault solutions."
"AI: If generating forms, include CSRF protection mechanisms."
\`\`\`
---
**File: \`.cursor/rules/common_errors.mdc\`**
\`\`\`mdc
// Prevent common errors and enforce best practices
"Error Handling: Ensure all Promises have .catch() handlers or are handled in try/catch blocks with async/await."
"Async: Use \`async/await\` for asynchronous operations for better readability."
"Null Checks: Perform null/undefined checks before accessing properties of potentially nullable objects."
"Resource Management: Ensure resources like file streams or database connections are properly closed in finally blocks or using try-with-resources patterns if applicable."
${framework.includes('Next') && (framework.includes('15') || parseFloat(framework.split('Next.js')[1] || '0') >= 15) ? `"Next.js >=15: Remember that cookie(), headers(), and dynamic segment functions (e.g., params in generateMetadata) often require \`await\`."` : ""}
\`\`\`
---
**How to use:**
1. Create a directory named \`.cursor\` in your project's root.
2. Inside \`.cursor\`, create another directory named \`rules\`.
3. Place the \`*.mdc\` files (like \`general.mdc\`, \`${framework.toLowerCase().replace(/[^a-z0-9]/gi, '')}.mdc\`, etc.) with the content above into the \`.cursor/rules/\` directory.
Cursor will automatically pick up these rules to guide its AI assistance for this project. Regularly review and update these rules as your project evolves.
    `;
  } else if (ide === 'windsurf') {
    return `
<!-- .windsurfrules for ${description} -->
<!-- Target IDE: Windsurf -->
<!-- Tech Stack: ${framework}, ${backend}, ${database} -->

<ruleset name="VibeForgeGeneratedWindsurfRules" version="5.0">
  <description>
    Comprehensive rules for developing "${description}" using Windsurf,
    focusing on ${framework}, ${backend}, and ${database}.
    Inspired by R.A.I.L.G.U.A.R.D. for security.
  </description>

  <general>
    <rule priority="high">AI, act as an expert in ${framework}, ${backend}, and ${database}. Your primary goal is to help me vibe code 80-90% of this application.</rule>
    <rule priority="high">Focus on code clarity, maintainability, performance, and security.</rule>
    <rule priority="medium">When generating complex logic, provide a brief explanation of your approach.</rule>
    <rule priority="medium">Use modern ${framework.includes('React') || framework.includes('Vue') || framework.includes('Angular') || framework.includes('Svelte') || framework.includes('Next') ? 'TypeScript (ES2020+)' : 'JavaScript (ES2020+), or latest Python/Go features'} by default.</rule>
    <rule priority="high">Adhere to DRY (Don't Repeat Yourself) and SOLID principles where applicable.</rule>
    <rule priority="medium">Suggest and implement comprehensive error handling for all I/O, API calls, and critical paths.</rule>
    <rule priority="low">Use structured logging for backend services. Avoid logging sensitive data.</rule>
  </general>

  <coding_standards>
    <rule priority="high">Follow project's Prettier configuration for formatting. If not present, use 2 spaces for indentation and single quotes for strings (JS/TS).</rule>
    <rule priority="high">Use camelCase for variables and functions, PascalCase for classes and components/types.</rule>
    <rule priority="medium">Break down long functions/methods into smaller, manageable units.</rule>
    <rule priority="high">Ensure all new code includes relevant tests (unit, integration). For React/Next.js, use Jest and React Testing Library.</rule>
  </coding_standards>

  <technology_specific framework="${framework}" backend="${backend}" database="${database}">
    ${framework.includes('React') || framework.includes('Next') ?
    `<frontend>
      <rule priority="high">Use functional React components with Hooks.</rule>
      <rule priority="high">Define prop types using TypeScript interfaces.</rule>
      <rule priority="medium">For state management, prefer Zustand or Jotai for global state over Redux for simplicity unless project scale dictates otherwise.</rule>
    </frontend>` : ""}
    ${framework.includes('Next') ?
    `<nextjs_specific>
      <rule priority="high">Prefer Next.js App Router.</rule>
      <rule priority="high">Utilize Server Components where appropriate.</rule>
      <rule priority="medium">Implement API routes using Route Handlers.</rule>
    </nextjs_specific>` : ""}
    <!-- Add more rules for other frameworks/backends like Vue, Angular, Node.js, Python, Go -->
    <database>
      <rule priority="high">When interacting with ${database}, use an ORM (like Prisma, TypeORM, SQLAlchemy) or ensure all raw queries are parameterized to prevent SQL injection.</rule>
      <rule priority="medium">Define clear database schemas and consider migrations for schema changes.</rule>
    </database>
  </technology_specific>

  <security section_source="R.A.I.L.G.U.A.R.D. Principles">
    <rule priority="critical">AI, explicitly consider security implications BEFORE generating code. Think like an attacker and a defender.</rule>
    <rule priority="critical">Sanitize ALL inputs from any external source (user, network, file system) to prevent injection attacks (XSS, SQLi, Command Injection).</rule>
    <rule priority="critical">Implement strong authentication and granular authorization. Verify permissions for every sensitive action.</rule>
    <rule priority="high">Do not hardcode secrets (API keys, passwords). Guide to use environment variables and secure configuration methods.</rule>
    <rule priority="high">Regularly update dependencies. Highlight if a suggested package has known vulnerabilities.</rule>
    <rule priority="medium">Implement rate limiting and input validation on API endpoints.</rule>
    <rule priority="medium">Use secure headers (CSP, HSTS, X-Frame-Options).</rule>
  </security>

  <vibecoding_workflow>
    <rule priority="high">When I provide a high-level feature request, break it down into smaller, actionable coding prompts for yourself if needed.</rule>
    <rule priority="medium">After generating a significant piece of code, ask if I want to review, test, or refine it.</rule>
    <rule priority="low">Keep context windows in mind. If a conversation becomes too long or loses focus, suggest starting a new focused thread.</rule>
  </vibecoding_workflow>

</ruleset>
    `;
  }
  return `Error: IDE ${ide} not recognized for specific rules generation. ${commonPreamble}`;
}

function generateFallbackStructure(description: string, framework: string, backend: string, database: string, ide: string): string {
  const isNextJs = framework.toLowerCase().includes('next');
  const srcDir = 'src/';
  const frameworkDirName = framework.toLowerCase().replace(/[^a-z0-9]/gi, '');
  
  return `# Project Structure for: ${description}
This structure is designed for clarity and AI-assisted development.

\`\`\`
${description.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}/
├── .vscode/                     # VSCode specific settings (applies to Cursor)
│   └── settings.json
${ide === 'cursor' ? `├── .cursor/                   # Cursor-specific AI rules and context
│   └── rules/                 # Modular rule files (*.mdc)
│       ├── general.mdc
│       ├── ${frameworkDirName}.mdc
│       └── security.mdc` : ''}
├── docs/
│   └── ai_context/              # Rich context for the AI assistant
│       ├── PROJECT_OVERVIEW.md  # High-level goals, target users, core problem
│       ├── ARCHITECTURE.md      # Key architectural decisions, patterns, data flow
│       ├── CODING_STANDARDS.md  # Project-specific coding conventions
│       └── SECURITY_GUIDELINES.md # Specific security measures for this project
├── public/                      # Static assets (images, fonts, etc.)
│   ├── favicon.ico
│   └── robots.txt
├── ${srcDir}                       # Source code
${isNextJs ?
`│   ├── app/                   # Next.js App Router
│   │   ├── (api)/             # API Route Handlers (if using Next.js for backend)
│   │   │   └── hello/
│   │   │       └── route.ts
│   │   ├── (components)/        # UI Components (shared across routes)
│   │   │   ├── layout/          # Layout components (Navbar, Footer, Sidebar)
│   │   │   └── ui/              # Generic UI elements (Button, Card, Input)
│   │   ├── (features)/          # Feature-specific modules/components
│   │   │   └── example-feature/
│   │   │       ├── components/
│   │   │       └── index.ts
│   │   ├── (lib)/               # Utilities, helpers, constants
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── (providers)/         # React Context providers
│   │   ├── (services)/          # API service integrations (if not using Route Handlers for external APIs)
│   │   ├── (store)/             # Global state management (Zustand, Jotai, Redux)
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root page (homepage)
` :
`│   ├── assets/                # Non-public assets (e.g., svgs imported as components)
│   ├── components/            # Reusable UI components
│   │   ├── layout/
│   │   └── ui/
│   ├── features/              # Feature-specific modules
│   │   └── example-feature/
│   │       ├── components/
│   │       ├── services/
│   │       └── index.ts
│   ├── hooks/                 # Custom React hooks (if applicable)
│   ├── pages/                 # Page components (if not Next.js App Router or similar paradigm)
│   ├── services/              # API service integrations
│   ├── store/                 # Global state management
│   ├── styles/                # CSS modules, global styles
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   └── main.tsx               # Main application entry point (e.g. React root)
`}
${backend !== 'Not specified' && backend !== 'Frontend Only' && !(isNextJs && backend.toLowerCase().includes('next')) ? // Avoid duplicating server if Next.js is the backend
`├── server/                      # Backend source code (${backend})
│   ├── config/                # Configuration files (db connection, env loading)
│   ├── controllers/           # Request handlers (Express, NestJS, etc.)
│   ├── middlewares/           # Custom middlewares (auth, logging, error handling)
│   ├── models/                # Database models/schemas for ${database} (e.g., Prisma, Mongoose)
│   ├── routes/                # API routes definition
│   ├── services/              # Business logic layer
│   ├── utils/                 # Backend utilities
│   └── index.ts               # Backend server entry point (e.g., app.listen())
` : ""}
├── tests/                       # Test files (Jest, Vitest, Pytest)
│   ├── __mocks__/
│   ├── integration/
│   └── unit/
├── .env.example                 # Example environment variables
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Standard git ignore file (see separate content)
├── .prettierrc.json             # Prettier configuration
├── package.json
├── README.md                    # Project README (see separate template)
├── tsconfig.json                # TypeScript configuration (if using TypeScript)
└── ${ide === 'windsurf' ? '.windsurfrules               # Windsurf AI rules file' : (isNextJs ? 'next.config.mjs' : 'vite.config.ts')} # Build tool configuration
\`\`\`
`;
} 