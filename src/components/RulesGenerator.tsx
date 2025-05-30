'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CursorAssistant, CursorRulesInput, SystemPromptInput } from '@/lib/cursor-system-instructions';
import { Copy, Download, FileText, Settings, Sparkles } from 'lucide-react';

export function RulesGenerator() {
  const [projectType, setProjectType] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [codingStyle, setCodingStyle] = useState({
    indentation: '2spaces',
    quotes: 'single',
    semicolons: true,
    functionalPatterns: true,
    namingConvention: 'camelCase'
  });
  const [existingRules, setExistingRules] = useState('');
  const [specificRequirements, ] = useState<string[]>([]);
  const [generatedRules, setGeneratedRules] = useState('');
  const [generatedSystemPrompt, setGeneratedSystemPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'rules' | 'prompt'>('rules');

  const cursorAssistant = new CursorAssistant();

  const commonOptions = {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#'],
    frameworks: ['React', 'Next.js', 'Vue.js', 'Angular', 'Express', 'Django', 'FastAPI', 'Spring Boot'],
    goals: ['readability', 'performance', 'testing', 'accessibility', 'security', 'maintainability'],
    projectTypes: ['Web App', 'Mobile App', 'Desktop App', 'API/Backend', 'Library/Package', 'CLI Tool']
  };

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const generateRules = () => {
    const input: CursorRulesInput = {
      projectType,
      languages,
      frameworks,
      codingStyle,
      goals,
      existingRules: existingRules || undefined,
      specificRequirements
    };

    const rules = cursorAssistant.generateCursorRules(input);
    setGeneratedRules(rules);
  };

  const generateSystemPrompt = () => {
    const input: SystemPromptInput = {
      projectType,
      languages,
      frameworks,
      codingStyle: `${codingStyle.functionalPatterns ? 'functional' : 'object-oriented'}`,
      goals,
      aiPreferences: ['detailed'] // Could make this configurable
    };

    const prompt = cursorAssistant.generateSystemPrompt(input);
    setGeneratedSystemPrompt(prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Configuration
          </CardTitle>
          <CardDescription>
            Configure your project settings to generate optimized .cursorrules and system prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Type</label>
            <div className="flex flex-wrap gap-2">
              {commonOptions.projectTypes.map((type) => (
                <Button
                  key={type}
                  variant={projectType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProjectType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium mb-2">Programming Languages</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonOptions.languages.map((lang) => (
                <Button
                  key={lang}
                  variant={languages.includes(lang) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => addItem(setLanguages, lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {languages.map((lang) => (
                <Badge key={lang} variant="default">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <label className="block text-sm font-medium mb-2">Frameworks & Libraries</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonOptions.frameworks.map((framework) => (
                <Button
                  key={framework}
                  variant={frameworks.includes(framework) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => addItem(setFrameworks, framework)}
                >
                  {framework}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {frameworks.map((framework) => (
                <Badge key={framework} variant="default">
                  {framework}
                </Badge>
              ))}
            </div>
          </div>

          {/* Coding Style */}
          <div>
            <label className="block text-sm font-medium mb-3">Coding Style Preferences</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Indentation</label>
                <select
                  value={codingStyle.indentation}
                  onChange={(e) => setCodingStyle(prev => ({ ...prev, indentation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2spaces">2 Spaces</option>
                  <option value="4spaces">4 Spaces</option>
                  <option value="tabs">Tabs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Quotes</label>
                <select
                  value={codingStyle.quotes}
                  onChange={(e) => setCodingStyle(prev => ({ ...prev, quotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Naming Convention</label>
                <select
                  value={codingStyle.namingConvention}
                  onChange={(e) => setCodingStyle(prev => ({ ...prev, namingConvention: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="camelCase">camelCase</option>
                  <option value="PascalCase">PascalCase</option>
                  <option value="snake_case">snake_case</option>
                  <option value="kebab-case">kebab-case</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={codingStyle.semicolons}
                  onChange={(e) => setCodingStyle(prev => ({ ...prev, semicolons: e.target.checked }))}
                  className="mr-2"
                />
                Use Semicolons
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={codingStyle.functionalPatterns}
                  onChange={(e) => setCodingStyle(prev => ({ ...prev, functionalPatterns: e.target.checked }))}
                  className="mr-2"
                />
                Prefer Functional Patterns
              </label>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Goals</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonOptions.goals.map((goal) => (
                <Button
                  key={goal}
                  variant={goals.includes(goal) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => addItem(setGoals, goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {goals.map((goal) => (
                <Badge key={goal} variant="default">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Existing Rules */}
          <div>
            <label className="block text-sm font-medium mb-2">Existing .cursorrules (Optional)</label>
            <Textarea
              value={existingRules}
              onChange={(e) => setExistingRules(e.target.value)}
              placeholder="Paste your existing .cursorrules content here to modify or extend it..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={generateRules} size="lg" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate .cursorrules
        </Button>
        <Button onClick={generateSystemPrompt} size="lg" variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Generate System Prompt
        </Button>
      </div>

      {/* Output */}
      {(generatedRules || generatedSystemPrompt) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Output</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'rules' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('rules')}
                  disabled={!generatedRules}
                >
                  .cursorrules
                </Button>
                <Button
                  variant={activeTab === 'prompt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('prompt')}
                  disabled={!generatedSystemPrompt}
                >
                  System Prompt
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'rules' && generatedRules && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">.cursorrules File</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedRules)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(generatedRules, '.cursorrules')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generatedRules}</code>
                </pre>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Usage:</strong> Save this as a `.cursorrules` file in your project&apos;s root directory to customize Cursor&apos;s AI behavior for this specific project.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'prompt' && generatedSystemPrompt && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">System Prompt (Rules for AI)</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedSystemPrompt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(generatedSystemPrompt, 'cursor-system-prompt.txt')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                  <code>{generatedSystemPrompt}</code>
                </pre>
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    💡 <strong>Usage:</strong> Copy this to Cursor&apos;s &quot;Rules for AI&quot; settings (Cmd/Ctrl + Shift + P → &quot;Cursor Settings&quot; → &quot;Rules for AI&quot;) to apply workspace-wide AI behavior.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 