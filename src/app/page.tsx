// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { Copy, ChevronDown, Code, FolderTree, Settings, Github, Heart, Send, ArrowUp, Star, Download, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackGenerateKit, trackCopyContent, trackTechStackSelection } from '@/lib/gtag';
import Image from 'next/image';

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
      <motion.div
        className="w-full px-3 py-2 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div 
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
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
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-black" />
          </motion.div>
        </div>
      </motion.div>
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

interface RuleFileProps {
  filename: string; // Full filename e.g., "react-hooks.mdc"
  content: string;
  onCopy: () => void;
}

function RuleFile({ filename, content, onCopy }: RuleFileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-300 bg-white">
      <motion.div
        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.001 }}
        whileTap={{ scale: 0.999 }}
      >
        <div 
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Code className="h-4 w-4 text-blue-600" />
          <span className="font-mono text-sm font-medium text-gray-700">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            variant="outline"
            size="sm"
            className="border-gray-400 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 h-6 text-[10px] font-mono px-2 cursor-pointer"
          >
            <Copy className="h-2 w-2 mr-1" />
            Copy
          </Button>
          <motion.div
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2 border-t border-gray-200">
              <div className="bg-gray-50 p-3 border border-gray-200 overflow-x-auto max-h-80 overflow-y-auto">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{content}</pre>
              </div>
              <Button
                onClick={onCopy}
                variant="outline"
                size="sm"
                className="w-full border-gray-400 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 h-8 text-xs font-mono cursor-pointer"
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy {filename}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'SolidJS', 'Qwik', 'Astro', 'HTMX', 'Other/None'];
const backends = ['Node.js', 'Python', 'Go', 'Rust', 'PHP', 'Ruby', 'Java', 'C#/.NET', 'Elixir', 'FastAPI', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Frontend Only'];
const databases = ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Supabase', 'Firebase', 'DynamoDB', 'Cassandra', 'Neo4j', 'None'];

interface GeneratedOutputs {
  generatedRules: Record<string, string>; // Filename -> Content
  projectStructure: string;
  setupInstructions: string;
}

function ContentRenderer({ content }: { content: string }) {
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        // Allow more diverse lang tags, including those with hyphens or special chars
        const languageMatch = lines[0].match(/^[a-zA-Z0-9\-_+#.]+$/); 
        const language = languageMatch && lines[0].length < 20 ? lines.shift() : ''; // Check length to avoid misinterpreting code as lang
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
              } else if (/^\d+\.\s/.test(trimmedLine)) { // Ensure space after digit+dot for ordered lists
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1 pl-2">
                    <span className="font-mono font-medium text-black">{trimmedLine.match(/^\d+\./)?.[0]}</span>
                    <span className="ml-1">{trimmedLine.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                );
              } else if ((trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) && trimmedLine.length > 2) { // Ensure content after bullet
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1 pl-2">
                    <span className="font-mono text-black">•</span>
                    <span className="ml-2">{trimmedLine.slice(2)}</span>
                  </div>
                );
              } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length > 4) {
                return (
                  <div key={lineIndex} className="text-xs font-semibold text-black mb-1">
                    {trimmedLine.slice(2, -2)}
                  </div>
                );
              } else if (trimmedLine === '') {
                return <div key={lineIndex} className="h-2" />;
              } else if (trimmedLine.length > 0) {
                const segments = trimmedLine.split(/(`[^`]+`)/g); // Match inline code
                return (
                  <div key={lineIndex} className="text-xs text-gray-700 mb-1 leading-relaxed">
                    {segments.map((segment, segIndex) => {
                      if (segment.startsWith('`') && segment.endsWith('`') && segment.length > 2) {
                        return <code key={segIndex} className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[11px] font-mono">{segment.slice(1, -1)}</code>;
                      }
                      return <span key={segIndex}>{segment}</span>;
                    })}
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
        } else {
          console.warn(`Failed to fetch GitHub stars: ${response.status}`);
          setStars(0); // Fallback to 0 on API error
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
        setStars(0); // Fallback to 0 on network error
      } finally {
        setLoading(false);
      }
    };
    fetchStars();
  }, []);

  if (loading) {
    return <div className="flex items-center gap-1"><Star className="h-3 w-3 animate-pulse text-gray-400" /><span className="animate-pulse text-gray-400">...</span></div>;
  }
  return <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /><span>{stars ?? 'N/A'}</span></div>;
}

function StarRepoPopup({ shouldShow, onDismiss }: { shouldShow: boolean; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (shouldShow) {
      timer = setTimeout(() => setIsVisible(true), 1500);
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timer);
  }, [shouldShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleStarClick = () => {
    window.open('https://github.com/VictorGulchenko/vibeforge', '_blank');
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ duration: 0.3, ease: "backOut" }}
        className="fixed top-16 right-4 z-[60] bg-white border-2 border-black p-4 shadow-lg max-w-64"
      >
        {/* Arrow pointing up to GitHub link */}
        <div className="absolute -top-2 right-12 w-4 h-4 bg-white border-l-2 border-t-2 border-black transform rotate-45"></div>
        <div className="relative">
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-mono text-xs font-bold">Hey there!</span>
            </div>
            <p className="text-xs font-mono text-gray-700 leading-relaxed">
              If VibeForge helped you generate some awesome Cursor rules, how about giving us a star? ⭐
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleStarClick}
                size="sm"
                className="flex-1 bg-black text-white hover:bg-gray-800 border border-black font-mono text-xs h-7 cursor-pointer"
              >
                <Star className="h-3 w-3 mr-1" />
                Star it!
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="px-2 border-black text-black hover:bg-gray-50 font-mono text-xs h-7 cursor-pointer"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function MainContent() {
  const [description, setDescription] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [selectedBackend, setSelectedBackend] = useState<string>('');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [generatedOutputs, setGeneratedOutputs] = useState<GeneratedOutputs | null>(null);
  const [showStarPopup, setShowStarPopup] = useState(false);

  const { showToast } = useToast();

  const handleMouseMoveTitle = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const generateContent = async () => {
    if (!description.trim()) {
      showToast("⚠️ Please describe your project vision.", 'error'); return;
    }
    if (!selectedFramework) {
      showToast("⚠️ Please select a frontend framework.", "error"); return;
    }
    if (!selectedBackend) {
      showToast("⚠️ Please select a backend option.", "error"); return;
    }
    if (!selectedDatabase) {
      showToast("⚠️ Please select a database option.", "error"); return;
    }

    trackGenerateKit({ framework: selectedFramework, backend: selectedBackend, database: selectedDatabase, ide: 'cursor' });
    setIsGenerating(true);
    setGeneratedOutputs(null); 
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, framework: selectedFramework, backend: selectedBackend, database: selectedDatabase }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        console.error("API Error Data:", responseBody);
        const errorDetail = responseBody.details ? `: ${responseBody.details.substring(0,100)}...` : '';
        throw new Error(responseBody.error || `Generation failed with status ${response.status}${errorDetail}`);
      }
      
      // Validate the structure of the successful response
      if (!responseBody.generatedRules || typeof responseBody.generatedRules !== 'object' ||
          !responseBody.projectStructure || typeof responseBody.projectStructure !== 'string' ||
          !responseBody.setupInstructions || typeof responseBody.setupInstructions !== 'string') {
        console.error("Received malformed data from server:", responseBody);
        showToast("AI returned an unexpected response format. Some parts might be missing or incorrect.", "error");
        // Provide a more informative fallback
        const fallbackData: GeneratedOutputs = {
            generatedRules: responseBody.generatedRules && typeof responseBody.generatedRules === 'object' ? responseBody.generatedRules : { 
              'error.mdc': `---
description: "Failed to load rules from AI."
globs: "**/*"
---
# AI Response Error
The AI returned data in an unexpected format for the rules. Please try generating again.
If the issue persists, check the server logs for more details.`
            },
            projectStructure: responseBody.projectStructure && typeof responseBody.projectStructure === 'string' ? responseBody.projectStructure : "## Project Structure\n\n*Error: AI failed to generate project structure content.*",
            setupInstructions: responseBody.setupInstructions && typeof responseBody.setupInstructions === 'string' ? responseBody.setupInstructions : "## Setup Instructions\n\n*Error: AI failed to generate setup instructions content.*",
        };
        setGeneratedOutputs(fallbackData);
      } else {
        setGeneratedOutputs(responseBody);
        showToast("✅ Your Cursor Rules are forged!", 'success');
        // Show star popup after successful generation
        console.log('Generation successful, setting showStarPopup to true');
        setShowStarPopup(true);
      }

    } catch (error: unknown) {
      console.error("Generation error:", error);
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred during generation.";
      showToast(`❌ ${errorMsg.substring(0, 200)}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(`📋 ${type} copied!`, 'success');
        trackCopyContent(type as 'rules' | 'prompts' | 'structure');
      })
      .catch(err => {
        showToast(`❌ Failed to copy: ${err.message}`, 'error');
      });
  };

  const downloadAllRules = () => {
    if (!generatedOutputs?.generatedRules || Object.keys(generatedOutputs.generatedRules).length === 0) {
      showToast("🤷 No rules to download.", 'error');
      return;
    }
    
    Object.entries(generatedOutputs.generatedRules).forEach(([filename, content]) => {
      if (typeof content !== 'string') {
        console.warn(`Skipping download for ${filename} due to invalid content type.`);
        return;
      }
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' }); // Use markdown type
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // filename should already include .mdc
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    showToast("💾 All rule files downloaded!", 'success');
  };

  const TechGroup = ({ title, options, selected, onSelect }: { title: string; options: string[]; selected: string; onSelect: (value: string) => void; }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleSelect = (option: string) => { onSelect(option); trackTechStackSelection(title, option); };

    return (
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <motion.div className={cn("border border-black p-4 bg-white cursor-pointer transition-all duration-300 h-24 flex flex-col justify-center items-center", selected ? "bg-black text-white" : "hover:bg-gray-50")} initial={false} animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.95 : 1 }} transition={{ duration: 0.2 }}>
          <div className="text-center"><h3 className="text-sm font-mono font-bold uppercase tracking-wider mb-1">{title}</h3><p className="text-xs font-mono opacity-70 line-clamp-2">{selected || 'Click to select'}</p></div>
        </motion.div>
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute top-0 left-0 right-0 z-10 border border-black bg-white p-2 overflow-y-auto max-h-48" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1"><h3 className="text-xs font-mono text-black uppercase tracking-wider text-center mb-1 sticky top-0 bg-white py-0.5">{title}</h3>
                <div className="grid grid-cols-2 gap-1">
                  {options.map((option) => (
                    <motion.button key={option} onClick={() => handleSelect(option)} className={cn("px-2 py-0.5 text-[9px] leading-tight font-mono border border-black transition-all duration-200 cursor-pointer text-center break-words h-4 flex items-center justify-center", selected === option ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <span className="truncate block">{option}</span>
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

  console.log('MainContent render: showStarPopup =', showStarPopup);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <StarRepoPopup shouldShow={showStarPopup} onDismiss={() => setShowStarPopup(false)} />
      <motion.header className="sticky top-0 z-40 border-b border-black py-2 px-4 flex-shrink-0 bg-white" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2"><Image src="/vibeforge.svg" alt="VibeForge Logo" width={16} height={16} className="text-yellow-500" /><span className="font-mono text-xs font-bold">VibeForge</span><span className="font-mono text-[10px] opacity-70">v1.7</span></div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <a href="https://x.com/VictorGulchenko" target="_blank" rel="noopener noreferrer" className="hover:underline transition-all duration-200">@VictorGulchenko</a>
            <a href="https://github.com/VictorGulchenko/vibeforge" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline transition-all duration-200"><Github className="h-3 w-3" /><span>GitHub</span><GitHubStars /></a>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-3">
          <motion.div className="text-center relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
             <div className="relative inline-block cursor-pointer overflow-hidden" onMouseMove={handleMouseMoveTitle} onMouseEnter={() => setIsHoveringTitle(true)} onMouseLeave={() => setIsHoveringTitle(false)}>
              <motion.h1 className="text-3xl md:text-4xl font-black tracking-tight relative z-10">VibeForge</motion.h1>
              {isHoveringTitle && (<motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="text-3xl md:text-4xl font-black tracking-tight" style={{ backgroundImage: `radial-gradient(circle 100px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 30%, rgba(241, 245, 249, 0.6) 60%, transparent 80%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'blur(0.5px)', }}>VibeForge</div>
                </motion.div>)}
            </div>
            <motion.p className="text-xs font-mono mt-1 opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>Generate custom Cursor AI rules (.mdc files) for your project in seconds.</motion.p>
          </motion.div>

          <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
            <Textarea placeholder="Describe your project vision, core problem, and target users... (e.g., A social media platform for pet owners, using Next.js, Supabase, and focusing on real-time chat features.)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-3 border border-black bg-white text-black placeholder:text-gray-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200" />
          </motion.div>

          <motion.div className="max-w-2xl mx-auto space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
            <Button onClick={generateContent} disabled={isGenerating} className="w-full px-4 py-2 bg-black text-white font-mono text-sm hover:bg-white hover:text-black border border-black transition-all duration-200 disabled:opacity-50 h-10 cursor-pointer">
              {isGenerating ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-2"><ArrowUp className="h-3 w-3 animate-ping" /></motion.div>) : (<Send className="h-3 w-3 mr-2" />)}
              {isGenerating ? 'Forging Cursor Rules...' : 'Forge Cursor Rules'}
            </Button>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6"><h2 className="text-lg font-black tracking-tight">Tech Stack</h2><p className="text-xs font-mono text-gray-600">Select your technologies to customize the generated rules</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechGroup title="Frontend Framework" options={frameworks} selected={selectedFramework} onSelect={setSelectedFramework} />
            <TechGroup title="Backend Platform" options={backends} selected={selectedBackend} onSelect={setSelectedBackend} />
            <TechGroup title="Database Solution" options={databases} selected={selectedDatabase} onSelect={setSelectedDatabase} />
          </div>
        </div>

        <AnimatePresence>
        {generatedOutputs && (
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <div className="text-center mb-4"><h2 className="text-lg font-black tracking-tight">Generated Cursor Rules Kit</h2><p className="text-xs font-mono text-gray-600">Click items to expand & copy • Download individual files or all at once</p></div>
            <div className="space-y-2">
              <ExpandableCapsule title="Setup Instructions" content={generatedOutputs.setupInstructions} icon={<Settings className="h-3 w-3" />} onCopy={() => copyToClipboard(generatedOutputs.setupInstructions, "Setup Instructions")} defaultExpanded={true} />
              
              {Object.keys(generatedOutputs.generatedRules).length > 0 && (
                <motion.div className="flex justify-center my-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Button onClick={downloadAllRules} variant="outline" className="border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 font-mono text-sm cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Rules ({Object.keys(generatedOutputs.generatedRules).length} files)
                  </Button>
                </motion.div>
              )}

              {Object.keys(generatedOutputs.generatedRules).length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-center text-gray-700 font-mono">Cursor Rule Files (.mdc)</h3>
                  {Object.entries(generatedOutputs.generatedRules).map(([filename, content]) => (
                    <RuleFile key={filename} filename={filename} content={content as string} onCopy={() => copyToClipboard(content as string, filename)} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-orange-600 bg-orange-50 border border-orange-200 rounded-md text-xs font-mono p-4 text-center">
                  <AlertTriangle className="h-4 w-4 mr-2" /> No specific rule files were generated. This might be an issue with the AI response. You can still use the Setup Instructions and Project Structure.
                </div>
              )}

              <ExpandableCapsule title="Recommended Project Structure" content={generatedOutputs.projectStructure} icon={<FolderTree className="h-3 w-3" />} onCopy={() => copyToClipboard(generatedOutputs.projectStructure, "Project Structure")} />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        
        <AnimatePresence>
        {!generatedOutputs && !isGenerating && (
          <motion.div 
            className="flex items-center justify-center h-32 text-gray-400 text-xs font-mono p-4 text-center border border-dashed border-gray-300 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Fill in your project description &amp; tech stack, then click &quot;Forge Cursor Rules&quot; to create custom .mdc files for your project.
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <motion.footer className="border-t border-black py-2 px-4 text-center flex-shrink-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <span>Built with</span><Heart className="h-3 w-3 fill-red-500 text-red-500" /> <span>for the Cursor AI community</span><span>•</span>
          <a href="https://github.com/PatrickJS/awesome-cursorrules" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><Github className="h-3 w-3" />awesome-cursorrules</a>
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