// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure for the AI's response and the final output
interface AIResponseFormat {
  generatedRules: Record<string, string>; // filename.mdc -> content
  projectStructure: string; // Markdown
  setupInstructions: string; // Markdown
}

const AI_SYSTEM_PROMPT = `You are CursorRulesForge, an expert AI system specializing in crafting high-quality, tailored .cursorrules (.mdc files) for the Cursor AI editor. Your primary objective is to analyze a user's project description and technology stack to generate a comprehensive set of rules, a suitable project structure, and setup instructions that will significantly enhance their AI-assisted development experience.

Core Task:
Based on the user's project description and technology stack (framework, backend, database), you MUST:
1.  DECIDE which rule files (.mdc) are most relevant and beneficial for the project.
2.  GENERATE the complete content for each of these rule files.
3.  Propose a suitable project directory structure in Markdown.
4.  Provide clear setup instructions in Markdown.

Principles for Generating High-Quality .mdc Rule Files:
*   **File Naming:** Use descriptive, kebab-case filenames (e.g., \`react-component-best-practices.mdc\`, \`python-fastapi-routing.mdc\`, \`general-code-quality.mdc\`).
*   **Modularity & Focus:** Generate MULTIPLE, FOCUSED rule files. Avoid a single monolithic rule file. Aim for 3-10 granular rule files, depending on project complexity and tech stack diversity. Each file should cover a distinct aspect (e.g., language-specific, framework-specific, components, styling, testing, security, performance, API design, database interaction, naming conventions, general best practices).
*   **YAML Frontmatter:** Each .mdc file MUST start with a YAML frontmatter block containing:
    *   \`description\`: A concise, impactful summary (under 120 characters) of the rule's purpose and key benefit (e.g., "Enforces TypeScript best practices for type safety and maintainable React components.").
    *   \`globs\`: A list of appropriate file glob patterns (or a single string glob) to which the rule applies. Choose globs meticulously based on the rule's content (e.g., \`["**/*.tsx", "src/components/**/*.jsx"]\`, \`"**/*.py"\`). For general project-wide rules, use \`"**/*"\` or \`"**/*.*"\`.
*   **Rule Body (Markdown Content):** The content following the YAML frontmatter MUST be high-value Markdown.
    *   **Persona Setting (Crucial):** Most rules should begin by establishing an AI persona. This is critical for guiding Cursor's AI. Examples:
        *   "You are an expert in Next.js 14 App Router, React, Shadcn UI, Radix UI and Tailwind."
        *   "You are an elite software developer with extensive expertise in Python, command-line tools, and file system operations."
        *   "You are an AI programming assistant that primarily focuses on producing clear, readable HTML, Tailwind CSS and vanilla JavaScript code."
    *   **Actionable & Specific Guidelines:** Provide concrete, actionable advice. Use bullet points extensively for clarity. Instead of vague statements, offer specific do's and don'ts.
        *   BAD: "Use good variable names."
        *   GOOD: "- Use descriptive variable names with auxiliary verbs (e.g., \`isLoading\`, \`hasPermission\`)."
        *   BAD: "Test your code."
        *   GOOD: "- Write unit tests for all business logic using Jest, aiming for >80% coverage."
                       "- Implement integration tests for API endpoints verifying request/response cycles."
    *   **Best Practices & Conventions:** Codify established best practices, design patterns (SOLID, DRY), and common conventions for the specific technology.
    *   **Code Snippets/Examples (Concise):** Include short, illustrative code snippets where they significantly clarify a rule or demonstrate a specific syntax (e.g., a Next.js server action structure, a Python type hint example, a Tailwind CSS responsive utility). Keep them brief and focused.
    *   **Scope & Relevance:** Ensure the rule content directly aligns with its \`globs\` and \`description\`. A rule for \`"**/*.py"\` shouldn't contain JavaScript advice.
    *   **Completeness for the Topic:** If a rule is about "Python Error Handling," it should cover common strategies like try-except, custom exceptions, logging, etc., not just one aspect.

Project Structure Proposal:
*   Format as Markdown.
*   MUST include a \`.cursor/rules/\` directory populated with the filenames of the rules you generate.
*   Optionally include a \`docs/ai_context/\` directory for storing files like \`PROJECT_OVERVIEW.md\`, \`ARCHITECTURE.md\`.
*   Recommend standard directories (\`src/\`, \`tests/\`, etc.) appropriate for the tech stack. Example: for a Next.js project, suggest \`app/\`, \`components/\`, \`lib/\`.

Setup Instructions:
*   Format as Markdown.
*   Provide clear, step-by-step instructions for the user on how to:
    1.  Create the \`.cursor/rules/\` directory.
    2.  Add the generated .mdc files into this directory.
    3.  Explain how to verify the rules are active in Cursor.
    4.  Suggest testing and iterating on the rules for optimal results.

Mandatory Output Format:
Your entire response MUST be a single, valid JSON object with the following exact structure:
\`\`\`json
{
  "generatedRules": {
    // Example: "python-best-practices.mdc": "---\ndescription: Core Python best practices for clean, readable code.\nglobs: \"**/*.py\"\n---\n- Follow PEP 8 for code style.\n- Use type hints for all function signatures.\n- Write comprehensive docstrings for public modules, classes, and functions."
  },
  "projectStructure": "## Project Structure...",
  "setupInstructions": "## Setup Instructions..."
}
\`\`\`

Key Considerations for "REAAAAAALLLY good" Rule Generation:
*   **Contextual Depth:** Deeply analyze the user's project description AND selected tech stack. A "React" app differs from a "Next.js" app. A "Python API" with "FastAPI" needs different rules than a "Python data script."
*   **Avoid Genericism Where Specificity is Better:** If "TypeScript" and "React" are chosen, a rule like \`typescript-react-props.mdc\` is better than separate, more generic \`typescript.mdc\` and \`react.mdc\` if the advice is specifically about typing React props. However, foundational language rules are still good.
*   **Practicality:** Rules should be genuinely useful and not just theoretical. They should reflect real-world development challenges and solutions.
*   **Globs Accuracy:** Incorrect globs make a rule useless. For example, a rule about Next.js server actions should glob \`app/**/actions.ts\` or similar, not just \`**/*.ts\`.
*   **Default Inclusions (Intelligently):**
    *   \`clean-code-principles.mdc\` (\`globs: "**/*"\`): DRY, SOLID, YAGNI, meaningful names.
    *   \`security-best-practices.mdc\` (\`globs: "**/*"\`): Input validation, secrets management, common vulnerabilities.
    *   \`git-workflow-conventions.mdc\` (\`globs: [".git/**", ".gitignore"]\`): Commit message style, branching strategy.
    *   Language-specific basics: e.g., \`python-pep8.mdc\`, \`typescript-strict-mode.mdc\`.
    *   Framework-specific basics: e.g., \`nextjs-app-router.mdc\`, \`fastapi-pydantic-models.mdc\`.

Do NOT use any predefined internal templates for rule content. Generate all content dynamically and thoughtfully based on your understanding and the user's input. The quality of the generated .mdc file content is paramount.
`;

// The rest of src/app/api/generate/route.ts remains the same as the previous "REAAAAAALLLY good" version you provided.
// Specifically, the POST function, userPromptToLLM, fetch call, and validateAIResponseStructure are well-suited.
// The key change is the enhanced AI_SYSTEM_PROMPT.

// (Paste the rest of the previous src/app/api/generate/route.ts here, starting from `export async function POST(request: NextRequest) { ... }`)
// For brevity, I'm not repeating the entire file, but ensure you use the previous one.
// The crucial modification is the AI_SYSTEM_PROMPT above.

export async function POST(request: NextRequest) {
  try {
    const { description, framework, backend, database } = await request.json();

    if (!description || !framework || !backend || !database) {
      return NextResponse.json(
        { error: 'Project description, framework, backend, and database selections are all required.' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OpenAI API key not found. This is a server-side configuration issue.');
      return NextResponse.json(
        { error: 'AI service is currently unavailable due to a configuration error. Please try again later.' },
        { status: 503 } // Service Unavailable
      );
    }

    const userPromptToLLM = `
User wants to build: ${description}

Selected Technology Stack:
- Frontend Framework: ${framework}
- Backend Platform: ${backend}
- Database Solution: ${database}

Based on this project description and tech stack, please:
1.  Determine an optimal and modular set of .cursorrules files (.mdc) that would best guide an AI code assistant (like Cursor) for this project. Consider aspects like language best practices, framework-specific conventions, UI/component design, API development, data handling, styling, testing, security, performance, and general code quality.
2.  For each rule file you decide to create:
    a.  Invent a descriptive, kebab-case filename (e.g., \`react-hooks-best-practices.mdc\`).
    b.  Generate the complete content for this file. This MUST include:
        i.  A YAML frontmatter block with a concise \`description\` (under 120 chars) and appropriate \`globs\` (e.g., \`"**/*.tsx"\`, \`["src/api/**/*.py", "src/routers/**/*.py"]\`).
        ii. A Markdown body containing actionable guidelines, **often starting with a persona setting** (e.g., "You are an expert in building secure Node.js APIs..."), and using bullet points for specific rules or best practices. Include brief code examples if they significantly clarify a rule. Ensure the content is of high quality, reflecting deep understanding of the technology.
3.  Propose a recommended project directory structure in Markdown format. This structure should include a \`.cursor/rules/\` directory populated with the filenames of the rules you've generated. Also consider including common directories like \`src/\`, \`tests/\`, \`components/\`, \`lib/\`, \`docs/ai_context/\`, etc., tailored to the tech stack.
4.  Provide clear, step-by-step setup instructions in Markdown format for the user on how to implement these rules in their Cursor IDE.

Adhere strictly to the JSON output format and detailed generation principles outlined in your system prompt (CursorRulesForge).
Your response MUST be a single, valid JSON object with the keys: "generatedRules", "projectStructure", and "setupInstructions".
The "generatedRules" value must be an object where each key is the .mdc filename and its value is the full string content of that file.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Ensure using gpt-4o-mini or a capable model
        messages: [
          {
            role: 'system',
            content: AI_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPromptToLLM
          }
        ],
        temperature: 0.4, // Even lower temp for more structured, high-quality rule content
        max_tokens: 4090, 
        response_format: { type: "json_object" }, 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorBody);
      let userFriendlyError = `AI service request failed: ${response.statusText}.`;
      if (response.status === 401) {
        userFriendlyError = "Authentication with AI service failed. Please check API key.";
      } else if (response.status === 429) {
        userFriendlyError = "AI service rate limit exceeded. Please try again in a few moments.";
      } else if (response.status >= 500) {
        userFriendlyError = "AI service is temporarily unavailable. Please try again later.";
      } else if (errorBody.toLowerCase().includes("quota") || errorBody.toLowerCase().includes("billing")) {
        userFriendlyError = "AI service quota exceeded or billing issue. Please check your OpenAI account.";
      }
      return NextResponse.json({ error: userFriendlyError, details: errorBody }, { status: response.status });
    }

    const data = await response.json();
    const aiResponseContent = data.choices[0]?.message?.content;

    if (!aiResponseContent) {
      console.error('No response content from OpenAI.');
      return NextResponse.json({ error: 'AI service returned an empty response. Please try again.' }, { status: 500 });
    }

    try {
      const parsedResponse = JSON.parse(aiResponseContent);
      const validatedResponse = validateAIResponseStructure(parsedResponse);
      return NextResponse.json(validatedResponse);
    } catch (e) {
      console.error('Failed to parse AI response as JSON or validation failed:', e, "\nRaw AI Response:\n", aiResponseContent);
      return NextResponse.json({ error: 'AI response was not in the expected JSON format, or failed validation. Please try again or check server logs.', details: aiResponseContent.substring(0, 500) + "..." }, { status: 500 });
    }

  } catch (error) {
    console.error('Critical error in POST /api/generate:', error);
    let errorMessage = 'An unexpected critical error occurred during rule generation.';
    if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function validateAIResponseStructure(parsedResponse: any): AIResponseFormat {
  const validated: AIResponseFormat = {
    generatedRules: {},
    projectStructure: "## Project Structure\n\n*AI failed to generate project structure. Please verify your input or try generating again.*",
    setupInstructions: "## Setup Instructions\n\n*AI failed to generate setup instructions. Please verify your input or try generating again.*",
  };

  if (parsedResponse.generatedRules && typeof parsedResponse.generatedRules === 'object' && !Array.isArray(parsedResponse.generatedRules)) {
    Object.entries(parsedResponse.generatedRules).forEach(([key, value]) => {
        if (typeof key === 'string' && key.endsWith('.mdc') && typeof value === 'string' && value.trim() !== "") {
            if (value.startsWith('---') && value.includes('description:') && value.includes('globs:')) {
              validated.generatedRules[key] = value;
            } else {
              console.warn(`Rule content for ${key} missing or invalid YAML frontmatter. Content: ${String(value).substring(0,100)}...`);
              validated.generatedRules[key] = `---
description: "Error: Invalid content structure for ${key}"
globs: "**/*"
---
# Invalid Rule Content
The AI generated malformed content for this rule. It should start with a YAML frontmatter (description, globs).

Original (partial) content:
${String(value).substring(0, 200)}...
`;
            }
        } else {
            console.warn(`Invalid rule entry: Key "${key}" (not .mdc or not string) or Value (not string or empty) was skipped.`);
        }
    });
    if (Object.keys(validated.generatedRules).length === 0 && Object.keys(parsedResponse.generatedRules).length > 0) {
        validated.generatedRules['error-generating-rules.mdc'] = `---
description: "Error: AI failed to generate any valid rule files."
globs: "**/*"
---
# Rule Generation Error
The AI did not produce any valid .mdc rule files. This could be due to an issue with the prompt or the AI's response.
Please review the project description and tech stack, then try generating again.
Check server logs for more details if the problem persists.
`;
    }

  } else {
    console.warn("AI response 'generatedRules' is missing, not an object, or is an array.");
     validated.generatedRules['error-no-rules-object.mdc'] = `---
description: "Error: AI response did not contain a valid 'generatedRules' object."
globs: "**/*"
---
# Missing Rules Object
The AI's response structure was incorrect. It should have provided an object for 'generatedRules'.
`;
  }

  if (typeof parsedResponse.projectStructure === 'string' && parsedResponse.projectStructure.trim() !== "") {
    validated.projectStructure = parsedResponse.projectStructure;
  } else {
     console.warn("AI response 'projectStructure' is missing or empty.");
  }

  if (typeof parsedResponse.setupInstructions === 'string' && parsedResponse.setupInstructions.trim() !== "") {
    validated.setupInstructions = parsedResponse.setupInstructions;
  } else {
    console.warn("AI response 'setupInstructions' is missing or empty.");
  }
  
  return validated;
}