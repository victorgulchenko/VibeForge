export const CURSOR_SYSTEM_INSTRUCTIONS = `You are an expert AI assistant specialized in generating System Prompts ("Rules for AI") and .cursorrules files for the Cursor code editor. Your goal is to help users maximize their productivity and code quality by creating tailored instructions that optimize Cursor's AI's behavior for their specific needs and projects.

Core Principles:

1. User-Centricity: Always prioritize the user's goals, preferences, and project context. Understand their intent before generating prompts or rules.
2. Clarity and Precision: Generate prompts and rules that are clear, concise, and unambiguous. Avoid jargon or overly technical language unless necessary.
3. Effectiveness: Focus on prompts and rules that will demonstrably improve the user's workflow, code quality, and overall experience with Cursor.
4. Cursor Expertise: Demonstrate a deep understanding of Cursor's features, including Chat, inline editing, codebase indexing, and Composer. Leverage this knowledge to create highly relevant and impactful prompts.
5. Best Practices: Promote coding best practices, maintainability, and efficiency through your generated prompts and rules.
6. Safety and Security: Ensure that generated prompts do not encourage or enable harmful, unethical, or insecure coding practices.

Input Information:

To generate effective prompts and rules, you should gather the following information from the user (or infer it when possible):

- Project Type: (e.g., Web app, mobile app, data science, game, library, etc.)
- Programming Languages: (e.g., Python, JavaScript, TypeScript, Java, C++, Rust, etc.)
- Frameworks/Libraries: (e.g., React, Angular, Vue, Node.js, Django, Flask, TensorFlow, PyTorch, etc.)
- Coding Style Preferences: (e.g., functional, object-oriented, specific linters or formatters)
- Specific Goals: (e.g., improve code readability, optimize performance, automate testing, generate documentation, enforce specific coding standards)
- Desired AI Behavior: (e.g., verbose explanations, concise code, step-by-step guidance, creative solutions)
- Existing .cursorrules file: (if any) used to keep consistent with other rules

Output Format:

System Prompts ("Rules for AI"):
- Think of these as workspace-wide rules for the Cursor AI.
- Provide a clear and concise set of instructions suitable for pasting into Cursor's "Rules for AI" settings.
- Use imperative language (e.g., "Always use...", "Never do...", "Prefer...", "Explain your reasoning...").
- Cover aspects like coding style, language preferences, framework-specific instructions, and general AI behavior.

.cursorrules Files:
- Think of these as project-specific rules that tailor the AI to the specific needs of a particular project.
- Output a well-formatted .cursorrules file that adheres to Cursor's specifications.
- The file should contain a single top-level object.
- Rules should be represented as key-value pairs within this object, where the key is a string describing the rule enclosed in double quotes, and the value is always set to true.
- You may use comments (starting with //) within the .cursorrules file to explain sections or rules. However, do not use comments as keys or within a key-value pair. Comments should be placed on separate lines above the rules they describe.
- Do not repeat rules. Each rule should appear only once in the file.
- Group related rules together logically and use comments to explain each section.

Handling Existing .cursorrules Files:

- If the user provides an existing .cursorrules file, you MUST treat it as the highest priority. Correctly incorporate its rules into the generated output, preserving the original intent and formatting as much as possible.
- The existing .cursorrules file is considered the source of truth. Do not remove or alter existing rules unless specifically instructed to do so by the user.
- If the user requests modifications to existing rules (e.g., changing the formatting or style), you MUST implement those changes accurately, and add a comment next to the modified rule using the format: // Modified from: [Original Rule] to clearly indicate the change.
- If there are conflicts between existing rules and generated rules, explain the conflict to the user and ask for clarification on how to proceed. Prioritize the existing rules unless the user explicitly states otherwise.
- When incorporating existing rules, ensure that they are integrated seamlessly with any new rules generated, maintaining a consistent and logical structure in the output .cursorrules file.

Handling Non-Standard Practices:

- If a user requests a non-standard practice (e.g., type hints in Python 2.7 using comments), implement it as requested if it's technically feasible and doesn't violate safety or security principles.
- Provide a comment in the generated .cursorrules file explaining the non-standard practice and any potential implications.

Error Handling:

- If the user provides insufficient information or the request is too vague, ask clarifying questions.
- If the user requests conflicting rules or rules that violate best practices, explain the conflict or potential issues and suggest alternatives. Only implement them if the user insists and provides a strong justification.
- If you are unable to generate a .cursorrules file due to any reason (e.g., conflicting user input, technical limitations), respond with a clear error message explaining the issue and suggest potential solutions or workarounds.

Constraints:

- Do not generate more than 20 rules in a single .cursorrules file without explicit user request. Prioritize the most impactful rules.
- Do not generate rules that contradict standard best practices for the specified languages and frameworks, unless explicitly requested by the user and accompanied by a clear justification.
- Do not generate overly specific rules that would only apply to a very small portion of the codebase, unless the user explicitly requests rules for a specific file or code section.
- Do not generate placeholder comments or rules. Every rule must have a clear and defined purpose.
- Do not generate rules that would demonstrably harm code security or performance without a strong, user-provided justification.

Meta-Instructions:

- When creating prompts and cursorrules, maintain a balance. Too many rules can become overwhelming, while too few might not provide enough guidance.
- If a user asks for something that contradicts best practices, gently explain why it might be problematic and suggest alternatives.
- Continuously update your knowledge base with new Cursor features and best practices to remain a cutting-edge assistant.

By adhering to these system instructions, you will be a highly effective assistant for creating Cursor System Prompts and .cursorrules files, helping users unlock the full potential of Cursor's AI-powered coding experience.`;

export interface CursorRulesGenerator {
  generateSystemPrompt(input: SystemPromptInput): string;
  generateCursorRules(input: CursorRulesInput): string;
  generateProjectPrompts(input: ProjectPromptInput): GeneratedPrompt[];
}

export interface SystemPromptInput {
  projectType: string;
  languages: string[];
  frameworks: string[];
  codingStyle: string;
  goals: string[];
  aiPreferences: string[];
}

export interface CursorRulesInput {
  projectType: string;
  languages: string[];
  frameworks: string[];
  codingStyle: {
    indentation: string;
    quotes: string;
    semicolons: boolean;
    functionalPatterns: boolean;
    namingConvention: string;
  };
  goals: string[];
  existingRules?: string;
  specificRequirements: string[];
}

export interface ProjectPromptInput {
  projectPlan: {
    title: string;
    description: string;
    techStack: {
      frontend: string[];
      backend: string[];
      languages: string[];
      frameworks: string[];
    };
    features: string[];
    complexity: string;
  };
  userPreferences: {
    explanationLevel: 'minimal' | 'detailed' | 'comprehensive';
    codeStyle: string;
    prioritization: string[];
  };
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  priority: number;
  dependencies: string[];
  estimatedTime: string;
}

export class CursorAssistant implements CursorRulesGenerator {
  generateSystemPrompt(input: SystemPromptInput): string {
    const prompts = [];
    
    // Language and framework specific rules
    if (input.languages.includes('TypeScript') || input.languages.includes('JavaScript')) {
      prompts.push("Always use TypeScript when possible for better type safety and developer experience.");
      prompts.push("Prefer modern ES6+ syntax and features.");
    }
    
    if (input.frameworks.includes('React')) {
      prompts.push("Always use functional React components with hooks.");
      prompts.push("Prefer arrow functions for component definitions.");
      prompts.push("Use descriptive names for components, props, and state variables.");
    }
    
    if (input.frameworks.includes('Next.js')) {
      prompts.push("Use Next.js App Router when building new features.");
      prompts.push("Implement proper SEO practices with metadata API.");
      prompts.push("Utilize Server Components when possible for better performance.");
    }
    
    // Coding style preferences
    if (input.codingStyle.includes('functional')) {
      prompts.push("Prefer functional programming patterns over object-oriented when appropriate.");
      prompts.push("Use pure functions and avoid side effects when possible.");
    }
    
    // Goals-based rules
    if (input.goals.includes('readability')) {
      prompts.push("Prioritize code readability and maintainability.");
      prompts.push("Add clear comments for complex logic.");
      prompts.push("Use descriptive variable and function names.");
    }
    
    if (input.goals.includes('performance')) {
      prompts.push("Consider performance implications of all code suggestions.");
      prompts.push("Suggest optimizations when appropriate.");
    }
    
    if (input.goals.includes('testing')) {
      prompts.push("Always suggest appropriate tests for new functionality.");
      prompts.push("Follow testing best practices for the specific framework.");
    }
    
    // AI behavior preferences
    if (input.aiPreferences.includes('detailed')) {
      prompts.push("Provide detailed explanations for the code you generate, including the reasoning behind your choices.");
    }
    
    if (input.aiPreferences.includes('concise')) {
      prompts.push("Keep explanations concise but informative.");
    }
    
    // General best practices
    prompts.push("Follow consistent indentation and formatting.");
    prompts.push("Suggest appropriate error handling and edge case considerations.");
    prompts.push("Recommend security best practices relevant to the technology stack.");
    
    return prompts.join('\n');
  }

  generateCursorRules(input: CursorRulesInput): string {
    const rules: Record<string, boolean> = {};
    
    // Language-specific rules
    if (input.languages.includes('TypeScript')) {
      rules["Always use TypeScript for new files"] = true;
      rules["Include proper type annotations"] = true;
      rules["Use strict TypeScript configuration"] = true;
    }
    
    if (input.languages.includes('Python')) {
      rules["Use type hints for function parameters and return values"] = true;
      rules["Follow PEP 8 style guidelines"] = true;
      rules["Include docstrings for functions and classes"] = true;
    }
    
    // Framework-specific rules
    if (input.frameworks.includes('React')) {
      rules["Use functional components with hooks"] = true;
      rules["Implement proper key props for list items"] = true;
      rules["Use React.memo for performance optimization when appropriate"] = true;
    }
    
    if (input.frameworks.includes('Next.js')) {
      rules["Use Next.js App Router for new routes"] = true;
      rules["Implement proper metadata for SEO"] = true;
      rules["Use Server Components when possible"] = true;
    }
    
    // Code style rules
    rules[`Use ${input.codingStyle.indentation} for indentation`] = true;
    rules[`Use ${input.codingStyle.quotes} quotes for strings`] = true;
    
    if (input.codingStyle.semicolons) {
      rules["Always include semicolons"] = true;
    } else {
      rules["Omit semicolons where possible"] = true;
    }
    
    if (input.codingStyle.functionalPatterns) {
      rules["Prefer functional programming patterns"] = true;
      rules["Use immutable data structures when appropriate"] = true;
    }
    
    rules[`Use ${input.codingStyle.namingConvention} naming convention`] = true;
    
    // Goal-specific rules
    if (input.goals.includes('performance')) {
      rules["Consider performance implications of all changes"] = true;
      rules["Use lazy loading for heavy components"] = true;
    }
    
    if (input.goals.includes('accessibility')) {
      rules["Include proper ARIA attributes"] = true;
      rules["Ensure keyboard navigation support"] = true;
      rules["Use semantic HTML elements"] = true;
    }
    
    if (input.goals.includes('testing')) {
      rules["Write unit tests for new functions"] = true;
      rules["Include integration tests for components"] = true;
      rules["Test edge cases and error conditions"] = true;
    }
    
    // Specific requirements
    input.specificRequirements.forEach(requirement => {
      rules[requirement] = true;
    });
    
    // Format as JSON with comments
    let output = "{\n";
    output += "  // Code Style Rules\n";
    
    const sections: Record<string, string[]> = {
      "Code Style Rules": [],
      "Framework Specific Rules": [],
      "Quality and Testing Rules": [],
      "Performance Rules": [],
      "Accessibility Rules": [],
      "Custom Requirements": []
    };
    
    // Categorize rules
    Object.keys(rules).forEach(rule => {
      if (rule.includes('indentation') || rule.includes('quotes') || rule.includes('semicolons') || rule.includes('naming')) {
        sections["Code Style Rules"].push(rule);
      } else if (rule.includes('React') || rule.includes('Next.js') || rule.includes('Vue') || rule.includes('Angular')) {
        sections["Framework Specific Rules"].push(rule);
      } else if (rule.includes('test') || rule.includes('quality') || rule.includes('lint')) {
        sections["Quality and Testing Rules"].push(rule);
      } else if (rule.includes('performance') || rule.includes('optimization') || rule.includes('lazy')) {
        sections["Performance Rules"].push(rule);
      } else if (rule.includes('ARIA') || rule.includes('accessibility') || rule.includes('semantic')) {
        sections["Accessibility Rules"].push(rule);
      } else {
        sections["Custom Requirements"].push(rule);
      }
    });
    
    let isFirst = true;
    Object.entries(sections).forEach(([sectionName, sectionRules]) => {
      if (sectionRules.length > 0) {
        if (!isFirst) output += ",\n";
        output += `  // ${sectionName}\n`;
        sectionRules.forEach((rule, index) => {
          if (!isFirst || index > 0) output += ",\n";
          output += `  "${rule}": true`;
          isFirst = false;
        });
      }
    });
    
    output += "\n}";
    
    return output;
  }

  generateProjectPrompts(input: ProjectPromptInput): GeneratedPrompt[] {
    const prompts: GeneratedPrompt[] = [];
    let promptId = 1;
    
    // Setup prompts
    prompts.push({
      id: (promptId++).toString(),
      title: "Project Initialization",
      prompt: `Initialize a new ${input.projectPlan.title} project using ${input.projectPlan.techStack.frontend.join(', ')}. Set up the basic project structure with proper configuration files, dependencies, and initial folder structure.`,
      category: "setup",
      priority: 1,
      dependencies: [],
      estimatedTime: "30-45 minutes"
    });
    
    if (input.projectPlan.techStack.frontend.includes('Next.js')) {
      prompts.push({
        id: (promptId++).toString(),
        title: "Next.js Configuration",
        prompt: "Configure Next.js with TypeScript, Tailwind CSS, and ESLint. Set up the app directory structure and create a basic layout component with proper metadata.",
        category: "setup",
        priority: 2,
        dependencies: ["1"],
        estimatedTime: "20-30 minutes"
      });
    }
    
    // Feature-based prompts
    input.projectPlan.features.forEach((feature, index) => {
      prompts.push({
        id: (promptId++).toString(),
        title: `Implement ${feature}`,
        prompt: `Create the ${feature} functionality for the ${input.projectPlan.title} project. Include proper TypeScript types, error handling, and follow the established code style. ${input.userPreferences.explanationLevel === 'detailed' ? 'Provide detailed explanations for the implementation approach and any design decisions.' : ''}`,
        category: "feature",
        priority: index + 3,
        dependencies: index === 0 ? ["1", "2"] : [(promptId - 1).toString()],
        estimatedTime: input.projectPlan.complexity === 'beginner' ? "45-60 minutes" : input.projectPlan.complexity === 'intermediate' ? "1-2 hours" : "2-4 hours"
      });
    });
    
    // Testing prompts
    if (input.userPreferences.prioritization.includes('testing')) {
      prompts.push({
        id: (promptId++).toString(),
        title: "Unit Testing Setup",
        prompt: "Set up comprehensive unit testing for the project using Jest and React Testing Library. Create test files for the main components and functions with good coverage.",
        category: "testing",
        priority: prompts.length + 1,
        dependencies: prompts.slice(-2).map(p => p.id),
        estimatedTime: "1-2 hours"
      });
    }
    
    // Styling prompts
    if (input.projectPlan.techStack.frontend.includes('Tailwind')) {
      prompts.push({
        id: (promptId++).toString(),
        title: "UI Styling and Design System",
        prompt: "Create a cohesive design system using Tailwind CSS. Implement responsive design, dark mode support, and reusable component variants. Focus on modern UI patterns and accessibility.",
        category: "styling",
        priority: prompts.length + 1,
        dependencies: prompts.slice(0, 3).map(p => p.id),
        estimatedTime: "2-3 hours"
      });
    }
    
    // Optimization prompts
    if (input.userPreferences.prioritization.includes('performance')) {
      prompts.push({
        id: (promptId++).toString(),
        title: "Performance Optimization",
        prompt: "Optimize the application for performance. Implement code splitting, lazy loading, image optimization, and bundle analysis. Add performance monitoring and lighthouse optimizations.",
        category: "optimization",
        priority: prompts.length + 1,
        dependencies: prompts.slice(-3).map(p => p.id),
        estimatedTime: "1-2 hours"
      });
    }
    
    // Deployment prompt
    prompts.push({
      id: (promptId++).toString(),
      title: "Deployment Setup",
      prompt: "Set up deployment configuration for Vercel or similar platform. Include environment variables, build optimization, and CI/CD pipeline if needed.",
      category: "deployment",
      priority: prompts.length + 1,
      dependencies: [prompts[prompts.length - 1].id],
      estimatedTime: "30-45 minutes"
    });
    
    return prompts;
  }
} 