'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProjectPlan, TechStack, UserStory } from '@/types';
import { Plus, X, Target, Users, Code2, Clock } from 'lucide-react';

export function ProjectPlanner() {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [techStack, setTechStack] = useState<TechStack>({
    frontend: [],
    backend: [],
    database: [],
    languages: [],
    frameworks: [],
    tools: []
  });
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [estimatedTimeframe, setEstimatedTimeframe] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addTechItem = (category: keyof TechStack, item: string) => {
    if (item.trim()) {
      setTechStack(prev => ({
        ...prev,
        [category]: [...prev[category], item.trim()]
      }));
    }
  };

  const removeTechItem = (category: keyof TechStack, index: number) => {
    setTechStack(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const addUserStory = () => {
    const newStory: UserStory = {
      id: Date.now().toString(),
      persona: '',
      action: '',
      benefit: '',
      priority: 'medium',
      acceptanceCriteria: []
    };
    setUserStories([...userStories, newStory]);
  };

  const updateUserStory = (id: string, field: keyof UserStory, value: any) => {
    setUserStories(prev => prev.map(story => 
      story.id === id ? { ...story, [field]: value } : story
    ));
  };

  const removeUserStory = (id: string) => {
    setUserStories(prev => prev.filter(story => story.id !== id));
  };

  const generateProjectPlan = () => {
    const plan: ProjectPlan = {
      id: Date.now().toString(),
      title: projectTitle,
      description: projectDescription,
      goals,
      techStack,
      userStories,
      folderStructure: generateFolderStructure(),
      estimatedTimeframe,
      complexity,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // This would typically save to state or backend
    console.log('Generated Project Plan:', plan);
    alert('Project plan generated! Check the console for details.');
  };

  const generateFolderStructure = () => {
    const hasReact = techStack.frameworks.includes('React') || techStack.frameworks.includes('Next.js');
    const hasNode = techStack.backend.includes('Node.js');
    
    if (hasReact) {
      return `src/
├── components/
│   ├── ui/
│   └── features/
├── pages/ or app/
├── styles/
├── hooks/
├── utils/
├── types/
└── lib/`;
    }
    
    return `src/
├── components/
├── utils/
├── types/
└── assets/`;
  };

  const commonTechOptions = {
    frontend: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot'],
    database: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Supabase'],
    languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'],
    frameworks: ['React', 'Next.js', 'Express', 'Django', 'FastAPI', 'TailwindCSS'],
    tools: ['Git', 'Docker', 'Webpack', 'Vite', 'ESLint', 'Prettier']
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Overview
          </CardTitle>
          <CardDescription>
            Define your project's core details and objectives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title</label>
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="My Awesome Project"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe what your project does and its main purpose..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Complexity Level</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Timeframe</label>
              <Input
                value={estimatedTimeframe}
                onChange={(e) => setEstimatedTimeframe(e.target.value)}
                placeholder="e.g., 2-3 weeks, 1 month"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Goals
          </CardTitle>
          <CardDescription>
            What do you want to achieve with this project?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a project goal..."
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <Button onClick={addGoal}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {goal}
                <button onClick={() => removeGoal(index)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Select the technologies you plan to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(commonTechOptions).map(([category, options]) => (
            <div key={category}>
              <label className="block text-sm font-medium mb-2 capitalize">
                {category}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {options.map((option) => (
                  <Button
                    key={option}
                    variant={techStack[category as keyof TechStack].includes(option) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (techStack[category as keyof TechStack].includes(option)) {
                        const index = techStack[category as keyof TechStack].indexOf(option);
                        removeTechItem(category as keyof TechStack, index);
                      } else {
                        addTechItem(category as keyof TechStack, option);
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {techStack[category as keyof TechStack].map((item, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    {item}
                    <button onClick={() => removeTechItem(category as keyof TechStack, index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Stories
          </CardTitle>
          <CardDescription>
            Define what users should be able to do with your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={addUserStory} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add User Story
          </Button>
          
          <div className="space-y-4">
            {userStories.map((story) => (
              <Card key={story.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium">User Story</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeUserStory(story.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="User persona (e.g., visitor, admin)"
                    value={story.persona}
                    onChange={(e) => updateUserStory(story.id, 'persona', e.target.value)}
                  />
                  <Input
                    placeholder="Action (e.g., create account)"
                    value={story.action}
                    onChange={(e) => updateUserStory(story.id, 'action', e.target.value)}
                  />
                  <Input
                    placeholder="Benefit (e.g., access features)"
                    value={story.benefit}
                    onChange={(e) => updateUserStory(story.id, 'benefit', e.target.value)}
                  />
                </div>
                
                {story.persona && story.action && story.benefit && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm">
                      <strong>As a</strong> {story.persona}, <strong>I want to</strong> {story.action}, <strong>so that</strong> {story.benefit}.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={generateProjectPlan} 
          size="lg"
          className="w-full md:w-auto"
          disabled={!projectTitle || !projectDescription}
        >
          <Clock className="h-4 w-4 mr-2" />
          Generate Project Plan
        </Button>
      </div>
    </div>
  );
} 