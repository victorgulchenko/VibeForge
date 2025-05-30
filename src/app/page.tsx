'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { Copy, ChevronDown, Sparkles, Code, FolderTree, Settings, Github, Heart, Send, ArrowUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackGenerateKit, trackCopyContent, trackTechStackSelection } from '@/lib/gtag';

interface ExpandableCapsuleProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  onCopy: () => void;
  defaultExpanded?: boolean;
}

function ExpandableCapsule({ title, content, icon, onCopy, defaultExpanded = false }: ExpandableCapsuleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-black">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200 text-left cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-mono text-sm font-medium text-black">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            variant="outline"
            size="sm"
            className="border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 h-6 text-[10px] font-mono px-2 cursor-pointer"
          >
            <Copy className="h-2 w-2 mr-1" />
            Copy
          </Button>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-black" />
          </motion.div>
        </div>
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2 border-t border-black">
              <div className="bg-gray-50 p-3 border border-gray-200 overflow-x-auto max-h-60 overflow-y-auto">
                <ContentRenderer content={content} />
              </div>
              <Button
                onClick={onCopy}
                variant="outline"
                size="sm"
                className="w-full border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 h-8 text-xs font-mono cursor-pointer"
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'];
const backends = ['Node.js', 'Python', 'Go', 'Rust', 'PHP', 'Ruby', 'Frontend Only'];
const databases = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Firebase', 'None'];

interface GeneratedOutputs {
  developmentPrompts: string;
  rulesContent: string;
  projectStructure: string;
}

function ContentRenderer({ content }: { content: string }) {
  const renderContent = (text: string) => {
    // Split content by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const language = lines[0].match(/^[a-zA-Z]+$/) ? lines.shift() : '';
        const code = lines.join('\n');
        
        return (
          <div key={index} className="my-3">
            {language && (
              <div className="text-[10px] font-mono bg-gray-200 px-2 py-1 text-gray-600 border-l-2 border-black">
                {language}
              </div>
            )}
            <pre className="bg-gray-100 p-3 border-l-2 border-black overflow-x-auto text-xs font-mono text-gray-800">
              {code}
            </pre>
          </div>
        );
      } else {
        // Regular content - process line by line
        const lines = part.split('\n');
        return (
          <div key={index}>
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              
              if (trimmedLine.startsWith('# ')) {
                return (
                  <h1 key={lineIndex} className="text-sm font-bold text-black mt-4 mb-2 border-b border-gray-300 pb-1">
                    {trimmedLine.slice(2)}
                  </h1>
                );
              } else if (trimmedLine.startsWith('## ')) {
                return (
                  <h2 key={lineIndex} className="text-xs font-bold text-black mt-3 mb-1">
                    {trimmedLine.slice(3)}
                  </h2>
                );
              } else if (trimmedLine.startsWith('### ')) {
                return (
                  <h3 key={lineIndex} className="text-xs font-semibold text-gray-700 mt-2 mb-1">
                    {trimmedLine.slice(4)}
                  </h3>
                );
              } else if (/^\d+\./.test(trimmedLine)) {
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1 pl-2">
                    <span className="font-mono font-medium text-black">{trimmedLine.match(/^\d+\./)?.[0]}</span>
                    <span className="ml-1">{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                );
              } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1 pl-2">
                    <span className="font-mono text-black">•</span>
                    <span className="ml-2">{trimmedLine.slice(2)}</span>
                  </div>
                );
              } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                return (
                  <div key={lineIndex} className="text-xs font-semibold text-black mb-1">
                    {trimmedLine.slice(2, -2)}
                  </div>
                );
              } else if (trimmedLine === '') {
                return <div key={lineIndex} className="h-2" />;
              } else if (trimmedLine.length > 0) {
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1">
                    {trimmedLine}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="text-xs">
      {renderContent(content)}
    </div>
  );
}

// GitHub Stars Component
function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/VictorGulchenko/vibeforge');
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 animate-pulse" />
        <span className="animate-pulse">...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3" />
      <span>{stars || 0}</span>
    </div>
  );
}

function MainContent() {
  const [description, setDescription] = useState('');
  const [selectedIde, setSelectedIde] = useState<'cursor' | 'windsurf'>('cursor');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [selectedBackend, setSelectedBackend] = useState<string>('');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedOutputs | null>(null);

  const { showToast } = useToast();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const generateContent = async () => {
    if (!description.trim()) {
      showToast("Please describe your project vision before generating.", 'error');
      return;
    }
    if (!selectedFramework) {
      showToast("Please select a frontend framework.", "error");
      return;
    }
     if (!selectedBackend) {
      showToast("Please select a backend option.", "error");
      return;
    }
     if (!selectedDatabase) {
      showToast("Please select a database option.", "error");
      return;
    }

    // Analytics tracking
    trackGenerateKit({
      framework: selectedFramework,
      backend: selectedBackend,
      database: selectedDatabase,
      ide: selectedIde,
    });

    setIsGenerating(true);
    setGeneratedOutputs(null); 
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          ide: selectedIde,
          framework: selectedFramework,
          backend: selectedBackend,
          database: selectedDatabase,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Generation failed with an unknown error."}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.developmentPrompts || !data.rulesContent || !data.projectStructure) {
        console.warn("Received incomplete data from server, some fields might be missing.", data);
        // Fill missing fields with a placeholder message if necessary, or trust the API's fallback for individual keys
        const requiredKeys: (keyof GeneratedOutputs)[] = ["developmentPrompts", "rulesContent", "projectStructure"];
        let allKeysPresent = true;
        for (const key of requiredKeys) {
            if (!data[key]) {
                allKeysPresent = false;
                data[key] = `Content for "${key}" was not generated. This might be due to an API error or content filtering.`;
            }
        }
        if (!allKeysPresent) {
            showToast("Some content parts might be missing.", "error");
        }
      }
      setGeneratedOutputs(data);
      
      showToast("Your AI Kit is ready!", 'success');
    } catch (error: unknown) {
      console.error("Generation error:", error);
      let errorMessage = "Failed to generate content. Please try again.";
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (errorMsg?.includes('429')) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (errorMsg?.includes('500')) {
        errorMessage = "Server error. Our team has been notified.";
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copied to clipboard!`, 'success');
    trackCopyContent(type as 'rules' | 'prompts' | 'structure');
  };

  const TechGroup = ({ 
    title, 
    options, 
    selected, 
    onSelect 
  }: { 
    title: string; 
    options: string[]; 
    selected: string; 
    onSelect: (value: string) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleSelect = (option: string) => {
      onSelect(option);
      trackTechStackSelection(title, option);
    };

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Default State - Category Label */}
        <motion.div
          className={cn(
            "border border-black p-4 bg-white cursor-pointer transition-all duration-300",
            selected ? "bg-black text-white" : "hover:bg-gray-50"
          )}
          initial={false}
          animate={{ 
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.95 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider mb-1">
              {title}
            </h3>
            <p className="text-xs font-mono opacity-70">
              {selected || 'Click to select'}
            </p>
          </div>
        </motion.div>

        {/* Hover State - Options Grid */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 z-10 border border-black bg-white p-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1">
                <h3 className="text-xs font-mono text-black uppercase tracking-wider text-center mb-2">
                  {title}
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {options.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "px-2 py-1 text-[9px] leading-tight font-mono border border-black transition-all duration-200 cursor-pointer", 
                        selected === option
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-black hover:text-white"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="truncate block text-center"> 
                        {option}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col overflow-hidden">
      <motion.header 
        className="border-b border-black py-2 px-4 flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-mono text-xs font-bold">VibeForge</span>
            <span className="font-mono text-[10px] opacity-70">v1.5</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <a 
              href="https://x.com/VictorGulchenko" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-all duration-200"
            >
              @VictorGulchenko
            </a>
            <a
              href="https://github.com/VictorGulchenko/vibeforge" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline transition-all duration-200"
            >
              <Github className="h-3 w-3" />
              <span>GitHub</span>
              <GitHubStars />
            </a>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* Project Description Section */}
        <div className="space-y-3">
          <motion.div 
            className="text-center relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div
              className="relative inline-block cursor-pointer overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-black tracking-tight relative z-10"
              >
                VibeForge
              </motion.h1>
              {isHovering && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="text-3xl md:text-4xl font-black tracking-tight"
                    style={{
                      backgroundImage: `radial-gradient(circle 100px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 30%, rgba(241, 245, 249, 0.6) 60%, transparent 80%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'blur(0.5px)',
                    }}
                  >
                    VibeForge
                  </div>
                </motion.div>
              )}
            </div>
            <motion.p 
              className="text-xs font-mono mt-1 opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Generate custom cursor/windsurf configurations (rules & prompts) in seconds.
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Textarea
              placeholder="Describe your project vision, core problem, and target users..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-3 border border-black bg-white text-black placeholder:text-gray-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
            />
          </motion.div>

          <motion.div 
            className="max-w-2xl mx-auto space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex gap-2">
              {(['cursor', 'windsurf'] as const).map((ide) => (
                <motion.button
                  key={ide}
                  onClick={() => setSelectedIde(ide)}
                  className={cn(
                    "flex-1 px-3 py-2 font-mono text-xs border transition-all duration-200 capitalize cursor-pointer",
                    selectedIde === ide
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-black hover:text-white"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {ide} AI Rules
                </motion.button>
              ))}
            </div>

            <Button
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-black text-white font-mono text-sm hover:bg-white hover:text-black border border-black transition-all duration-200 disabled:opacity-50 h-10 cursor-pointer"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <ArrowUp className="h-3 w-3" />
                </motion.div>
              ) : (
                <Send className="h-3 w-3 mr-2" />
              )}
              {isGenerating ? 'Forging Your AI Kit...' : 'Forge My AI Kit'}
            </Button>
          </motion.div>
        </div>

        {/* Tech Stack Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg font-black tracking-tight">Tech Stack</h2>
            <p className="text-xs font-mono text-gray-600">Hover categories to select technologies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechGroup
              title="Frontend Framework"
              options={frameworks}
              selected={selectedFramework}
              onSelect={setSelectedFramework}
            />
            <TechGroup
              title="Backend Platform"
              options={backends}
              selected={selectedBackend}
              onSelect={setSelectedBackend}
            />
            <TechGroup
              title="Database Solution"
              options={databases}
              selected={selectedDatabase}
              onSelect={setSelectedDatabase}
            />
          </div>
        </div>

        {/* Generated AI Kit Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-lg font-black tracking-tight">Generated AI Kit</h2>
            <p className="text-xs font-mono text-gray-600">Click items to expand & copy</p>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {generatedOutputs ? (
                <motion.div 
                  className="space-y-2" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ExpandableCapsule
                    title="Development Prompts"
                    content={generatedOutputs.developmentPrompts}
                    icon={<Code className="h-3 w-3" />}
                    onCopy={() => copyToClipboard(generatedOutputs.developmentPrompts, "Development Prompts")}
                    defaultExpanded={true}
                  />
                  <ExpandableCapsule
                    title="AI Coding Rules"
                    content={generatedOutputs.rulesContent}
                    icon={<Settings className="h-3 w-3" />}
                    onCopy={() => copyToClipboard(generatedOutputs.rulesContent, "AI Coding Rules")}
                  />
                  <ExpandableCapsule
                    title="Project Structure"
                    content={generatedOutputs.projectStructure}
                    icon={<FolderTree className="h-3 w-3" />}
                    onCopy={() => copyToClipboard(generatedOutputs.projectStructure, "Project Structure")}
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400 text-xs font-mono p-4 text-center border border-gray-200 rounded">
                  {isGenerating ? 'Forging your AI kit, please wait...' : 'Fill in your project vision & tech stack, then click "Forge My AI Kit" to generate your AI assistant rules and prompts.'}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.footer 
        className="border-t border-black py-2 px-4 text-center flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }} 
      >
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span>Built with</span>
          <Heart className="h-3 w-3 fill-red-500 text-red-500" /> 
          <span>for the AI Vibe Coding community</span>
        </div>
      </motion.footer>
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <MainContent />
    </ToastProvider>
  );
}