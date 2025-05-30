# VibeForge - AI Project Generator

A sleek, minimalistic interface for generating structured development plans, rules files, and project structures using OpenAI GPT-4o-mini.

## Features

- **Ultra-Compact Design**: Everything fits on screen without scrolling
- **Smart Technology Selection**: Interactive cards for frameworks, backends, and languages
- **Micro-Interactions**: Smooth animations powered by Framer Motion
- **Expandable Output**: Collapsible capsules for generated content
- **Toast Notifications**: Instant feedback for user actions
- **AI-Powered Generation**: Uses OpenAI GPT-4o-mini for intelligent outputs
- **Multi-IDE Support**: Generate files for both Cursor IDE and Windsurf IDE
- **Three Output Types**:
  - Development prompts (step-by-step implementation guide)
  - Rules files (.cursorrules or .windsurfrules)
  - Project structure (markdown format)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the project root:
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Application
Navigate to `http://localhost:3000`

## Design Philosophy

VibeForge follows an ultra-minimalistic approach:

- **Compact Layout**: Everything visible without scrolling
- **Clean Typography**: Professional font stack with optimal readability  
- **Subtle Interactions**: Hover effects and smooth transitions
- **Focused Interface**: No unnecessary elements or distractions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Micro-Animations**: Delightful feedback using Framer Motion

## Technology Selection

### Interactive Framework Cards
- **React**: Component-based architecture
- **Next.js**: Full-stack React framework  
- **Vue**: Progressive framework
- **Angular**: Enterprise-ready
- **Svelte**: Compile-time optimizations

### Backend Options
- **Node.js**: JavaScript runtime with npm ecosystem
- **Python**: Rapid development with extensive libraries
- **Go**: High performance with built-in concurrency
- **Rust**: Memory safety with zero-cost abstractions
- **Java**: Enterprise-grade JVM ecosystem
- **Frontend Only**: Client-side only applications

### Language Support
- **TypeScript**: Type safety and better IDE support
- **JavaScript**: Dynamic and flexible
- **Python**: Simple syntax for rapid development
- **Go**: Fast compilation and deployment
- **Rust**: System-level performance
- **Java**: Cross-platform reliability

## Generated Outputs

### 1. Development Prompts
Numbered, actionable prompts optimized for:
- Step-by-step implementation
- Technology-specific best practices
- Modern development workflows
- Copy-ready for Cursor/Windsurf

### 2. Rules Files
Comprehensive .cursorrules or .windsurfrules containing:
- Code style preferences
- Framework-specific rules
- Performance optimizations
- Accessibility guidelines
- Testing requirements

### 3. Project Structure
Detailed folder/file organization including:
- Technology-appropriate structure
- Best practice layouts
- Configuration files
- Documentation templates

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add: `OPENAI_API_KEY` with your API key value
   - Deploy automatically triggers

4. **Custom Domain (Optional)**:
   - Add your custom domain in Project Settings → Domains

## UI Features

### Micro-Interactions
- **Hover Animations**: Cards lift and scale on hover
- **Selection Feedback**: Blue indicators for active selections
- **Loading States**: Spinning animations during generation
- **Toast Notifications**: Success/error feedback
- **Expandable Content**: Smooth height transitions

### Animation Framework
Built with **Framer Motion** for:
- Page entrance animations
- Component state transitions  
- Gesture-based interactions
- Layout animations
- Exit animations

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Color Contrast**: Optimized for readability
- **Focus States**: Clear focus indicators
- **Semantic HTML**: Proper markup structure

## Development

### Project Structure
```
vibeforge/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/generate/    # OpenAI API integration
│   │   ├── page.tsx         # Main application
│   │   └── layout.tsx       # Root layout
│   ├── components/ui/       # Reusable UI components
│   │   ├── button.tsx       # Button component
│   │   ├── textarea.tsx     # Textarea with proper styling
│   │   └── toast.tsx        # Toast notification system
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
└── docs/                    # Documentation
```

### Tech Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Lucide React**: Beautiful icon system
- **OpenAI API**: GPT-4o-mini for content generation

### Key Components

#### OptionCard
Interactive selection cards with:
- Hover animations
- Selection indicators
- Truncated text for compact display

#### ExpandableCapsule  
Collapsible content containers with:
- Smooth height transitions
- Copy functionality
- Syntax-highlighted code display

#### ToastProvider
Notification system featuring:
- Multiple toast stacking
- Auto-dismiss timers
- Success/error states

## Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional (for development)
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Creator

Built with ❤️ by [@VictorGulchenko](https://x.com/VictorGulchenko)

- **Twitter/X**: [@VictorGulchenko](https://x.com/VictorGulchenko)
- **GitHub**: [Repository](https://github.com/victorgulchenko/vibeforge)

## Troubleshooting

### Common Issues

**"Text not visible in textarea"**
- Ensure proper text color classes are applied
- Check for conflicting CSS styles

**"Failed to generate output"**
- Check your OpenAI API key is valid
- Ensure you have sufficient API credits
- Verify network connectivity

**Build errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

**Deployment issues on Vercel**
- Verify environment variables are set
- Check build logs for specific errors
- Ensure Node.js version compatibility

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Cursor IDE](https://cursor.sh)
- [Windsurf IDE](https://codeium.com/windsurf)
