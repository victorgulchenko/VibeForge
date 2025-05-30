'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/types';
import { Send, Bot, User, Copy, Download } from 'lucide-react';
import { CURSOR_SYSTEM_INSTRUCTIONS } from '@/lib/cursor-system-instructions';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your vibecoding assistant. I can help you with:

🎯 **Project Planning** - Discuss your ideas and get structured plans
💡 **Feature Development** - Break down complex features into manageable tasks  
⚙️ **Cursor Rules** - Generate .cursorrules files for your projects
📝 **Development Prompts** - Get specific prompts for implementing features
🚀 **Best Practices** - Learn about modern development approaches

What would you like to work on today?`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('project') && (input.includes('plan') || input.includes('idea'))) {
      return `Great! Let's plan your project. To give you the best guidance, I'd like to know:

1. **What type of application** are you building? (web app, mobile app, desktop, etc.)
2. **What's the main purpose** or problem it solves?
3. **Who are your target users?**
4. **What's your experience level** with the technologies you're considering?
5. **Any specific technologies** you want to use or avoid?

Based on your answers, I can help you create a detailed project plan with:
- Technology stack recommendations
- Development phases and milestones  
- User stories and features
- Estimated timelines
- .cursorrules configuration

What would you like to share about your project idea?`;
    }
    
    if (input.includes('cursorrules') || input.includes('cursor') || input.includes('rules')) {
      return `I can help you create custom .cursorrules files! These are incredibly powerful for:

🎯 **Enforcing coding standards** across your project
⚡ **Optimizing AI assistance** for your specific needs
🔧 **Automating best practices** for your tech stack
📝 **Maintaining consistency** in code style and patterns

To generate the perfect .cursorrules file for you, please tell me:

1. **Programming languages** you're using (TypeScript, Python, etc.)
2. **Frameworks** (React, Next.js, Django, etc.)  
3. **Coding style preferences** (functional vs OOP, indentation, etc.)
4. **Project goals** (performance, readability, testing, etc.)
5. **Any existing rules** you want to modify

Example: "I'm building a Next.js app with TypeScript and Tailwind. I prefer functional components, 2-space indentation, and want to focus on performance and accessibility."

What's your project setup?`;
    }
    
    if (input.includes('prompt') || input.includes('feature') || input.includes('implement')) {
      return `Perfect! I can generate step-by-step prompts for implementing features. This is especially useful for:

🛠️ **Breaking down complex features** into manageable tasks
📋 **Getting structured development guidance** 
⏱️ **Estimating development time** for each step
🔗 **Understanding dependencies** between tasks

To create the best prompts for you, please describe:

1. **The feature** you want to implement
2. **Your tech stack** (React, Node.js, etc.)
3. **Your experience level** (beginner, intermediate, advanced)
4. **Any specific requirements** or constraints
5. **Your preferred explanation style** (concise vs detailed)

Example: "I want to add user authentication to my React app using Firebase. I'm intermediate level and prefer detailed explanations."

What feature are you working on?`;
    }
    
    if (input.includes('help') || input.includes('start') || input.includes('begin')) {
      return `I'm here to help you succeed with vibecoding! Here are the main ways I can assist:

🎯 **Project Planning**
- Turn your ideas into structured development plans
- Technology stack recommendations
- Feature breakdown and user stories

⚙️ **Cursor Rules Generation**  
- Custom .cursorrules files for your projects
- Coding standards enforcement
- AI behavior optimization

📝 **Development Prompts**
- Step-by-step implementation guides
- Feature-specific development tasks
- Best practices integration

💡 **General Guidance**
- Architecture decisions
- Technology choices
- Development workflows

Just describe what you're working on or what you need help with, and I'll provide tailored guidance. What's on your mind?`;
    }
    
    // Default response
    return `I understand you're asking about "${userInput}". 

As your vibecoding assistant, I can help you with project planning, generating .cursorrules files, creating development prompts, and general development guidance.

Could you provide more details about:
- What specific help you need?
- Your project context or goals?
- Your current tech stack or preferences?

The more context you provide, the better I can tailor my assistance to your needs!`;
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add a toast notification here
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'Assistant'} (${msg.timestamp.toLocaleTimeString()}):\n${msg.content}\n\n`
    ).join('');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibeforge-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Chat Assistant
            </CardTitle>
            <Button variant="outline" size="sm" onClick={exportChat}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.content)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me about project planning, .cursorrules generation, or development guidance..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="h-[60px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 