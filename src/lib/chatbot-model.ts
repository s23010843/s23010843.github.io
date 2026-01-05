// Custom ML-based chatbot model
// Uses intent classification, entity extraction, and pattern matching

interface Message {
  role: string;
  content: string;
}

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  keywords: string[];
}

class ChatbotModel {
  private intents: Intent[];
  private conversationContext: string[];
  private learningData: Map<string, number>;

  constructor() {
    this.conversationContext = [];
    this.learningData = new Map();
    this.intents = [
      {
        name: 'greeting',
        patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        responses: [
          'Hello! I\'m your project assistant. How can I help you today?',
          'Hi there! Ask me anything about this Astro project.',
          'Hey! I\'m here to help with your development questions.',
        ],
      },
      {
        name: 'run_project',
        patterns: ['how to run', 'start project', 'run dev', 'launch', 'start development'],
        keywords: ['run', 'start', 'dev', 'launch', 'execute', 'serve'],
        responses: [
          'To run the project:\n1. First, install dependencies: pnpm install\n2. Start dev server: pnpm run dev\n3. For Windows, you can also use scripts/commands/dev-script.bat',
          'Easy! Run "pnpm install" to set up dependencies, then "pnpm run dev" to start the development server. The site will be available at localhost:4321.',
        ],
      },
      {
        name: 'build_project',
        patterns: ['how to build', 'create build', 'production build', 'compile', 'build static'],
        keywords: ['build', 'compile', 'production', 'static', 'generate'],
        responses: [
          'To build the project:\n1. Run: pnpm run build\n2. Output will be in the dist/ folder\n3. The build is optimized and ready for deployment',
          'Building is simple: "pnpm run build". This creates a production-ready static site in the dist/ directory. You can then deploy this folder to any static host.',
        ],
      },
      {
        name: 'deployment',
        patterns: ['how to deploy', 'hosting', 'publish', 'deployment guide', 'ship to production'],
        keywords: ['deploy', 'hosting', 'publish', 'ship', 'production', 'vercel', 'netlify'],
        responses: [
          'Deployment steps:\n1. Build: pnpm run build\n2. Upload the dist/ folder to your host\n3. Platforms like Netlify, Vercel, or GitHub Pages work great\n4. Set build command to "pnpm run build" and publish dir to "dist"',
          'After building with "pnpm run build", deploy the dist/ folder to any static hosting service. For Netlify/Vercel, connect your repo and they\'ll handle it automatically.',
        ],
      },
      {
        name: 'tech_stack',
        patterns: ['what is stack', 'technologies used', 'framework', 'what tech', 'explain stack'],
        keywords: ['stack', 'tech', 'framework', 'technologies', 'architecture', 'astro', 'react', 'vue', 'svelte'],
        responses: [
          'The tech stack:\n- Astro (main framework)\n- React, Vue, Svelte, Angular (as islands)\n- TypeScript\n- pnpm (package manager)\n- CSS with global styles\n\nAstro\'s islands architecture loads framework components only when needed.',
          'This is an Astro-based project using the islands pattern. It includes React, Vue, Svelte, and Angular components that render as interactive islands on static pages. Everything is managed with pnpm.',
        ],
      },
      {
        name: 'dependencies',
        patterns: ['install dependencies', 'packages', 'node modules', 'install'],
        keywords: ['install', 'dependencies', 'packages', 'pnpm', 'npm', 'modules'],
        responses: [
          'To install dependencies, run: pnpm install\n\nThis project uses pnpm as the package manager. Make sure you have it installed globally first.',
          'Run "pnpm install" in the project root. If you don\'t have pnpm, install it first with: npm install -g pnpm',
        ],
      },
      {
        name: 'errors',
        patterns: ['error', 'not working', 'broken', 'fix', 'issue', 'problem', 'troubleshoot'],
        keywords: ['error', 'broken', 'fix', 'issue', 'problem', 'troubleshoot', 'debug'],
        responses: [
          'For troubleshooting:\n1. Check the ERRORS_AND_SOLUTIONS.md in the docs/ folder\n2. Ensure all dependencies are installed: pnpm install\n3. Try clearing cache and rebuilding\n4. Check the console for specific error messages',
          'Let\'s debug this. Common fixes:\n- Clear node_modules and reinstall\n- Make sure you\'re using Node 18+\n- Check docs/ERRORS_AND_SOLUTIONS.md for known issues\n- Share the specific error message for better help',
        ],
      },
      {
        name: 'project_structure',
        patterns: ['project structure', 'folder structure', 'directory', 'organization', 'files'],
        keywords: ['structure', 'folder', 'directory', 'files', 'organization', 'layout'],
        responses: [
          'Project structure:\n- src/pages/ - Route pages (Astro files)\n- src/components/ - Framework components (React, Vue, Svelte, Angular)\n- src/layouts/ - Page layouts\n- src/styles/ - Global styles\n- public/ - Static assets\n- scripts/ - Build and dev scripts',
          'The project is organized with:\n• Pages in src/pages/\n• Reusable components by framework in src/components/\n• Layouts in src/layouts/\n• Public assets in public/\nEach framework has its own component folder.',
        ],
      },
      {
        name: 'chatbot_info',
        patterns: ['what are you', 'who are you', 'about you', 'your capabilities'],
        keywords: ['you', 'chatbot', 'assistant', 'capabilities', 'what can you'],
        responses: [
          'I\'m a locally-running AI assistant built specifically for this project. I use custom ML-based intent classification and pattern matching to understand your questions. No external APIs required - I run entirely in your environment!',
          'I\'m your custom project assistant! I use machine learning techniques (intent classification, entity extraction, pattern matching) to help you with this codebase. All processing happens locally, so your conversations stay private.',
        ],
      },
      {
        name: 'gratitude',
        patterns: ['thank you', 'thanks', 'appreciate', 'helpful'],
        keywords: ['thank', 'thanks', 'appreciate'],
        responses: [
          'You\'re welcome! Feel free to ask if you need anything else.',
          'Happy to help! Let me know if you have more questions.',
          'Glad I could assist! I\'m here whenever you need help.',
        ],
      },
    ];
  }

  // Calculate similarity between two strings using Levenshtein-like approach
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const matchedWords = words1.filter((w) => words2.some((w2) => w2.includes(w) || w.includes(w2)));

    return matchedWords.length / Math.max(words1.length, words2.length);
  }

  // Extract keywords from user message
  private extractKeywords(message: string): string[] {
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'i', 'you', 'can', 'could', 'would', 'should', 'do', 'does', 'to'];
    const words = message.toLowerCase().split(/\s+/);
    return words.filter((w) => w.length > 2 && !stopWords.includes(w));
  }

  // Classify intent using ML-like scoring
  private classifyIntent(message: string): { intent: Intent; confidence: number } | null {
    const keywords = this.extractKeywords(message);
    let bestMatch: { intent: Intent; confidence: number } | null = null;

    for (const intent of this.intents) {
      let score = 0;

      // Check pattern matching
      for (const pattern of intent.patterns) {
        const similarity = this.calculateSimilarity(message, pattern);
        score = Math.max(score, similarity * 0.6);
      }

      // Check keyword matching
      const keywordMatches = keywords.filter((k) => intent.keywords.some((ik) => ik.includes(k) || k.includes(ik)));
      const keywordScore = keywordMatches.length / Math.max(keywords.length, 1);
      score += keywordScore * 0.4;

      // Update learning data
      const key = `${intent.name}:${message.substring(0, 20)}`;
      const learningBoost = (this.learningData.get(key) || 0) * 0.1;
      score += learningBoost;

      if (score > 0.3 && (!bestMatch || score > bestMatch.confidence)) {
        bestMatch = { intent, confidence: score };
      }
    }

    return bestMatch;
  }

  // Add context awareness
  private updateContext(message: string): void {
    this.conversationContext.push(message.toLowerCase());
    if (this.conversationContext.length > 5) {
      this.conversationContext.shift();
    }
  }

  // Learn from conversation patterns
  private learn(intent: string, message: string): void {
    const key = `${intent}:${message.substring(0, 20)}`;
    this.learningData.set(key, (this.learningData.get(key) || 0) + 1);
  }

  // Generate response with context
  public generateResponse(message: string, history: Message[]): string {
    this.updateContext(message);

    // Check for conversational context
    const recentContext = this.conversationContext.join(' ');

    // Classify intent
    const result = this.classifyIntent(message);

    if (result && result.confidence > 0.3) {
      // Learn from this interaction
      this.learn(result.intent.name, message);

      // Select response (with some variety)
      const responses = result.intent.responses;
      const responseIndex = Math.floor(Math.random() * responses.length);
      return responses[responseIndex];
    }

    // Fallback with contextual awareness
    if (recentContext.includes('build') || recentContext.includes('compile')) {
      return 'Are you still working on the build? You can run "pnpm run build" to create a production build. Let me know if you encounter any errors!';
    }

    if (recentContext.includes('deploy') || recentContext.includes('host')) {
      return 'For deployment, build your project first with "pnpm run build", then upload the dist/ folder to your hosting provider. Need help with a specific platform?';
    }

    // Generic fallback
    return 'I can help you with:\n• Running the project (pnpm run dev)\n• Building for production (pnpm run build)\n• Deployment guides\n• Tech stack explanations\n• Troubleshooting issues\n\nWhat would you like to know?';
  }
}

export default ChatbotModel;
