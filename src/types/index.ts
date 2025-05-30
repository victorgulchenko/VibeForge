export interface ProjectPlan {
  id: string;
  title: string;
  description: string;
  goals: string[];
  techStack: TechStack;
  userStories: UserStory[];
  folderStructure: string;
  estimatedTimeframe: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface UserStory {
  id: string;
  persona: string;
  action: string;
  benefit: string;
  priority: 'low' | 'medium' | 'high';
  acceptanceCriteria: string[];
}

export interface CursorRules {
  general_rules: Rule[];
  ai_reasoning: Rule[];
  testing: Rule[];
  code_style: CodeStyle;
  project_specific: Rule[];
}

export interface Rule {
  description: string;
  type: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface CodeStyle {
  language: string;
  indentation: 'tabs' | '2spaces' | '4spaces';
  quotes: 'single' | 'double';
  semicolons: boolean;
  trailingCommas: boolean;
  prefer_functional_patterns: boolean;
  naming_convention: 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case';
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: 'setup' | 'feature' | 'styling' | 'testing' | 'deployment' | 'optimization';
  priority: number;
  dependencies: string[];
  estimatedTime: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'plan' | 'rules' | 'prompts';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  techStack: TechStack;
  baseRules: Partial<CursorRules>;
  promptTemplates: GeneratedPrompt[];
} 