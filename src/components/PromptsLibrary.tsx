'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CursorAssistant, ProjectPromptInput, GeneratedPrompt } from '@/lib/cursor-system-instructions';
import { Copy, Download, FileText, Zap, Clock, Link } from 'lucide-react';

export function PromptsLibrary() {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [techStack, setTechStack] = useState({
    frontend: [] as string[],
    backend: [] as string[],
    languages: [] as string[],
    frameworks: [] as string[]
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [explanationLevel, setExplanationLevel] = useState<'minimal' | 'detailed' | 'comprehensive'>('detailed');
  const [prioritization, setPrioritization] = useState<string[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);

  const cursorAssistant = new CursorAssistant();

  const techOptions = {
    frontend: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot'],
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'],
    frameworks: ['React', 'Next.js', 'Express', 'TailwindCSS', 'Material-UI', 'Bootstrap']
  };

  const priorityOptions = ['testing', 'performance', 'accessibility', 'security', 'documentation'];

  const addToTechStack = (category: keyof typeof techStack, item: string) => {
    setTechStack(prev => ({
      ...prev,
      [category]: prev[category].includes(item) 
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const togglePriority = (priority: string) => {
    setPrioritization(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const generatePrompts = () => {
    const input: ProjectPromptInput = {
      projectPlan: {
        title: projectTitle,
        description: projectDescription,
        techStack,
        features,
        complexity
      },
      userPreferences: {
        explanationLevel,
        codeStyle: 'modern',
        prioritization
      }
    };

    const prompts = cursorAssistant.generateProjectPrompts(input);
    setGeneratedPrompts(prompts);
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const copyAllPrompts = () => {
    const allPrompts = generatedPrompts
      .sort((a, b) => a.priority - b.priority)
      .map((prompt, index) => 
        `### ${index + 1}. ${prompt.title}\n\n**Category:** ${prompt.category}\n**Estimated Time:** ${prompt.estimatedTime}\n\n${prompt.prompt}\n\n---\n\n`
      ).join('');
    
    navigator.clipboard.writeText(allPrompts);
  };

  const downloadPrompts = () => {
    const content = generatedPrompts
      .sort((a, b) => a.priority - b.priority)
      .map((prompt, index) => 
        `${index + 1}. ${prompt.title}\n${'='.repeat(prompt.title.length + 3)}\n\nCategory: ${prompt.category}\nEstimated Time: ${prompt.estimatedTime}\nDependencies: ${prompt.dependencies.length > 0 ? prompt.dependencies.join(', ') : 'None'}\n\n${prompt.prompt}\n\n`
      ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup': return '🛠️';
      case 'feature': return '✨';
      case 'styling': return '🎨';
      case 'testing': return '🧪';
      case 'deployment': return '🚀';
      case 'optimization': return '⚡';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'feature': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'styling': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'testing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'deployment': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'optimization': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Project Setup
          </CardTitle>
          <CardDescription>
            Define your project to generate structured development prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="My Awesome Project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Complexity Level</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Description</label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe what your project does..."
              rows={3}
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technology Stack</h3>
            {Object.entries(techOptions).map(([category, options]) => (
              <div key={category}>
                <label className="block text-sm font-medium mb-2 capitalize">{category}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {options.map((option) => (
                    <Button
                      key={option}
                      variant={techStack[category as keyof typeof techStack].includes(option) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => addToTechStack(category as keyof typeof techStack, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {techStack[category as keyof typeof techStack].map((item) => (
                    <Badge key={item} variant="default">{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">Features to Implement</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., User Authentication, Shopping Cart)"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature}>Add</Button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <span>{feature}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Explanation Level</label>
              <select
                value={explanationLevel}
                onChange={(e) => setExplanationLevel(e.target.value as 'minimal' | 'detailed' | 'comprehensive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="minimal">Minimal - Just the essentials</option>
                <option value="detailed">Detailed - Step-by-step guidance</option>
                <option value="comprehensive">Comprehensive - In-depth explanations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prioritize</label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority) => (
                  <Button
                    key={priority}
                    variant={prioritization.includes(priority) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePriority(priority)}
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={generatePrompts} 
          size="lg"
          disabled={!projectTitle || !projectDescription || features.length === 0}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Generate Development Prompts
        </Button>
      </div>

      {/* Generated Prompts */}
      {generatedPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Development Prompts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAllPrompts}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPrompts}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <CardDescription>
              {generatedPrompts.length} prompts generated • Follow them in order for best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedPrompts
                .sort((a, b) => a.priority - b.priority)
                .map((prompt, index) => (
                  <Card key={prompt.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full font-medium text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{prompt.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getCategoryColor(prompt.category)}>
                                {getCategoryIcon(prompt.category)} {prompt.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                {prompt.estimatedTime}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPrompt(prompt.prompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3">
                        <p className="whitespace-pre-wrap">{prompt.prompt}</p>
                      </div>
                      
                      {prompt.dependencies.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Link className="h-3 w-3" />
                          <span>Depends on:</span>
                          <div className="flex gap-1">
                            {prompt.dependencies.map((dep, i) => (
                              <span key={dep}>
                                Step {dep}{i < prompt.dependencies.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-medium">
                  💡
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">How to Use These Prompts</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Copy each prompt and paste it into Cursor&apos;s chat or composer. Follow them in the numbered order for best results. 
                    Each prompt is designed to build upon the previous ones, creating a logical development flow.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              Don&apos;t forget to save your work! Your generated prompts deserve a home.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 