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
        name: 'math',
        patterns: [
          'calculate', 'what is', 'solve', 'compute', 'find', 'how much',
          'square root', 'factorial', 'percentage', 'equation', 'add', 'subtract',
          'multiply', 'divide', 'power', 'log', 'sin', 'cos', 'tan'
        ],
        keywords: ['calculate', 'solve', 'compute', 'math', 'equation', 'number', 'result'],
        responses: [], // Will be dynamically generated
      },
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

  // Advanced math solver with full calculator functionality
  private solveMath(message: string): string | null {
    try {
      // Remove common words to extract the math expression
      let expr = message.toLowerCase()
        .replace(/what is|calculate|solve|compute|find|how much is|equals|equal to|\?/gi, '')
        .trim();

      // Handle special math operations

      // ========== LINEAR ALGEBRA ==========
      
      // Vector magnitude/length
      if (/magnitude|length|norm/.test(expr) && /vector/.test(expr)) {
        const match = expr.match(/\[?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)(?:\s*,\s*(-?\d+\.?\d*))?\s*\]?/);
        if (match) {
          const components = [parseFloat(match[1]), parseFloat(match[2])];
          if (match[3]) components.push(parseFloat(match[3]));
          const magnitude = Math.sqrt(components.reduce((sum, val) => sum + val * val, 0));
          return `|v| = √(${components.map(c => c + '²').join(' + ')}) = ${magnitude.toFixed(6)}`;
        }
      }

      // Dot product
      if (/dot product/.test(expr)) {
        const vectors = expr.match(/\[(-?\d+\.?\d*(?:\s*,\s*-?\d+\.?\d*)*)\]/g);
        if (vectors && vectors.length === 2) {
          const v1 = vectors[0].match(/-?\d+\.?\d*/g)?.map(n => parseFloat(n)) || [];
          const v2 = vectors[1].match(/-?\d+\.?\d*/g)?.map(n => parseFloat(n)) || [];
          if (v1.length === v2.length) {
            const dotProd = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
            return `[${v1.join(', ')}] · [${v2.join(', ')}] = ${dotProd}`;
          }
        }
      }

      // Cross product (3D vectors only)
      if (/cross product/.test(expr)) {
        const vectors = expr.match(/\[(-?\d+\.?\d*(?:\s*,\s*-?\d+\.?\d*)*)\]/g);
        if (vectors && vectors.length === 2) {
          const v1 = vectors[0].match(/-?\d+\.?\d*/g)?.map(n => parseFloat(n)) || [];
          const v2 = vectors[1].match(/-?\d+\.?\d*/g)?.map(n => parseFloat(n)) || [];
          if (v1.length === 3 && v2.length === 3) {
            const cross = [
              v1[1] * v2[2] - v1[2] * v2[1],
              v1[2] * v2[0] - v1[0] * v2[2],
              v1[0] * v2[1] - v1[1] * v2[0]
            ];
            return `[${v1.join(', ')}] × [${v2.join(', ')}] = [${cross.map(c => c.toFixed(4)).join(', ')}]`;
          }
        }
      }

      // Matrix determinant (2x2)
      if (/determinant|det/.test(expr) && /2x2|2\s*x\s*2/.test(expr)) {
        const nums = expr.match(/-?\d+\.?\d*/g);
        if (nums && nums.length === 4) {
          const [a, b, c, d] = nums.map(n => parseFloat(n));
          const det = a * d - b * c;
          return `det([${a}, ${b}; ${c}, ${d}]) = ${a}(${d}) - ${b}(${c}) = ${det}`;
        }
      }

      // Matrix determinant (3x3)
      if (/determinant|det/.test(expr) && /3x3|3\s*x\s*3/.test(expr)) {
        const nums = expr.match(/-?\d+\.?\d*/g);
        if (nums && nums.length === 9) {
          const m = nums.map(n => parseFloat(n));
          const det = m[0] * (m[4] * m[8] - m[5] * m[7]) -
                      m[1] * (m[3] * m[8] - m[5] * m[6]) +
                      m[2] * (m[3] * m[7] - m[4] * m[6]);
          return `det(3×3 matrix) = ${det.toFixed(4)}`;
        }
      }

      // Matrix transpose
      if (/transpose/.test(expr)) {
        // Try to parse matrix dimensions and values
        const match = expr.match(/(\d+)\s*x\s*(\d+)/);
        if (match) {
          const rows = parseInt(match[1]);
          const cols = parseInt(match[2]);
          const nums = expr.match(/-?\d+\.?\d*/g)?.slice(2); // Skip dimension numbers
          if (nums && nums.length === rows * cols) {
            const matrix = nums.map(n => parseFloat(n));
            const transposed: number[] = [];
            for (let j = 0; j < cols; j++) {
              for (let i = 0; i < rows; i++) {
                transposed.push(matrix[i * cols + j]);
              }
            }
            return `Transpose (${rows}×${cols} → ${cols}×${rows}):\n[${transposed.join(', ')}]`;
          }
        }
      }

      // ========== CALCULUS - DERIVATIVES ==========
      
      // Derivative of polynomial terms
      if (/derivative|derive|differentiate|d\/dx/.test(expr)) {
        // Power rule: d/dx(x^n) = n*x^(n-1)
        const powerMatch = expr.match(/x\^(\d+)|x\*\*(\d+)/);
        if (powerMatch) {
          const n = parseInt(powerMatch[1] || powerMatch[2]);
          if (n === 0) return "d/dx(x⁰) = 0";
          if (n === 1) return "d/dx(x) = 1";
          return `d/dx(x^${n}) = ${n}x^${n - 1}`;
        }
        
        // Coefficient with power: d/dx(ax^n)
        const coeffMatch = expr.match(/(-?\d+\.?\d*)\s*\*?\s*x\^(\d+)/);
        if (coeffMatch) {
          const a = parseFloat(coeffMatch[1]);
          const n = parseInt(coeffMatch[2]);
          const newCoeff = a * n;
          const newPow = n - 1;
          if (newPow === 0) return `d/dx(${a}x^${n}) = ${newCoeff}`;
          if (newPow === 1) return `d/dx(${a}x^${n}) = ${newCoeff}x`;
          return `d/dx(${a}x^${n}) = ${newCoeff}x^${newPow}`;
        }

        // Linear: d/dx(ax + b)
        const linearMatch = expr.match(/(-?\d+\.?\d*)\s*\*?\s*x/);
        if (linearMatch) {
          const a = parseFloat(linearMatch[1]);
          return `d/dx(${a}x) = ${a}`;
        }

        // Special functions
        if (/sin\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(sin(x)) = cos(x)";
        if (/cos\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(cos(x)) = -sin(x)";
        if (/tan\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(tan(x)) = sec²(x)";
        if (/e\^x|exp\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(e^x) = e^x";
        if (/ln\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(ln(x)) = 1/x";
        if (/log\s*\(?\s*x\s*\)?/.test(expr)) return "d/dx(log(x)) = 1/(x·ln(10))";
      }

      // ========== CALCULUS - INTEGRALS ==========
      
      // Integration of polynomial terms
      if (/integrate|integral|antiderivative/.test(expr)) {
        // Power rule: ∫x^n dx = x^(n+1)/(n+1) + C
        const powerMatch = expr.match(/x\^(\d+)|x\*\*(\d+)/);
        if (powerMatch) {
          const n = parseInt(powerMatch[1] || powerMatch[2]);
          const newN = n + 1;
          return `∫x^${n} dx = x^${newN}/${newN} + C`;
        }

        // Coefficient with power: ∫ax^n dx
        const coeffMatch = expr.match(/(-?\d+\.?\d*)\s*\*?\s*x\^(\d+)/);
        if (coeffMatch) {
          const a = parseFloat(coeffMatch[1]);
          const n = parseInt(coeffMatch[2]);
          const newN = n + 1;
          const newCoeff = a / newN;
          return `∫${a}x^${n} dx = ${newCoeff.toFixed(4)}x^${newN} + C`;
        }

        // Linear: ∫ax dx
        const linearMatch = expr.match(/(-?\d+\.?\d*)\s*\*?\s*x(?!\^)/);
        if (linearMatch) {
          const a = parseFloat(linearMatch[1]);
          const result = a / 2;
          return `∫${a}x dx = ${result}x² + C`;
        }

        // Constant: ∫a dx
        const constMatch = expr.match(/^(-?\d+\.?\d*)(?:\s|$)/);
        if (constMatch) {
          const a = parseFloat(constMatch[1]);
          return `∫${a} dx = ${a}x + C`;
        }

        // Special functions
        if (/sin\s*\(?\s*x\s*\)?/.test(expr)) return "∫sin(x) dx = -cos(x) + C";
        if (/cos\s*\(?\s*x\s*\)?/.test(expr)) return "∫cos(x) dx = sin(x) + C";
        if (/sec\^2|sec\*\*2/.test(expr)) return "∫sec²(x) dx = tan(x) + C";
        if (/e\^x|exp\s*\(?\s*x\s*\)?/.test(expr)) return "∫e^x dx = e^x + C";
        if (/1\/x/.test(expr) || expr.includes('x^-1')) return "∫1/x dx = ln|x| + C";
        
        // Definite integral using Simpson's rule
        const defMatch = expr.match(/from\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/);
        if (defMatch) {
          const a = parseFloat(defMatch[1]);
          const b = parseFloat(defMatch[2]);
          
          // Try to identify the function
          if (/x\^2/.test(expr)) {
            const result = (Math.pow(b, 3) / 3) - (Math.pow(a, 3) / 3);
            return `∫[${a} to ${b}] x² dx = [x³/3] = ${result.toFixed(6)}`;
          }
          if (/x\^3/.test(expr)) {
            const result = (Math.pow(b, 4) / 4) - (Math.pow(a, 4) / 4);
            return `∫[${a} to ${b}] x³ dx = [x⁴/4] = ${result.toFixed(6)}`;
          }
          if (/\bx\b/.test(expr) && !/x\^/.test(expr)) {
            const result = (Math.pow(b, 2) / 2) - (Math.pow(a, 2) / 2);
            return `∫[${a} to ${b}] x dx = [x²/2] = ${result.toFixed(6)}`;
          }
        }
      }

      // ========== BASIC CALCULATOR FUNCTIONS ==========
      
      // Absolute value
      if (expr.includes('abs') || expr.includes('absolute')) {
        const match = expr.match(/abs\s*\(?\s*(-?\d+\.?\d*)\s*\)?|absolute value of\s+(-?\d+\.?\d*)/);
        if (match) {
          const num = parseFloat(match[1] || match[2]);
          return `|${num}| = ${Math.abs(num)}`;
        }
      }

      // Ceiling
      if (expr.includes('ceil') || expr.includes('ceiling')) {
        const match = expr.match(/ceil(?:ing)?\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1]);
          return `⌈${num}⌉ = ${Math.ceil(num)}`;
        }
      }

      // Floor
      if (expr.includes('floor')) {
        const match = expr.match(/floor\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1]);
          return `⌊${num}⌋ = ${Math.floor(num)}`;
        }
      }

      // Round
      if (expr.includes('round')) {
        const match = expr.match(/round\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1]);
          return `round(${num}) = ${Math.round(num)}`;
        }
      }

      // Cube root
      if (expr.includes('cube root') || expr.includes('cbrt')) {
        const match = expr.match(/cube root of\s+(\d+\.?\d*)|cbrt\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1] || match[2]);
          const result = Math.cbrt(num);
          return `∛${num} = ${result}`;
        }
      }

      // Nth root
      if (expr.includes('root')) {
        const match = expr.match(/(\d+)(?:st|nd|rd|th)?\s+root of\s+(\d+\.?\d*)/);
        if (match) {
          const n = parseInt(match[1]);
          const num = parseFloat(match[2]);
          const result = Math.pow(num, 1/n);
          return `${n}√${num} = ${result}`;
        }
      }

      // Factorial: n!
      if (expr.includes('!') || /factorial of (\d+)/.test(expr)) {
        const match = expr.match(/(\d+)\s*!|factorial of (\d+)/);
        if (match) {
          const n = parseInt(match[1] || match[2]);
          if (n >= 0 && n <= 170) {
            const result = this.factorial(n);
            return `${n}! = ${result}`;
          }
        }
      }

      // Permutation: nPr
      if (expr.includes('permutation') || /\d+p\d+/.test(expr)) {
        const match = expr.match(/(\d+)\s*p\s*(\d+)|permutation\s+(\d+)\s+(\d+)/);
        if (match) {
          const n = parseInt(match[1] || match[3]);
          const r = parseInt(match[2] || match[4]);
          const result = this.factorial(n) / this.factorial(n - r);
          return `P(${n},${r}) = ${result}`;
        }
      }

      // Combination: nCr
      if (expr.includes('combination') || /\d+c\d+/.test(expr)) {
        const match = expr.match(/(\d+)\s*c\s*(\d+)|combination\s+(\d+)\s+(\d+)/);
        if (match) {
          const n = parseInt(match[1] || match[3]);
          const r = parseInt(match[2] || match[4]);
          const result = this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
          return `C(${n},${r}) = ${result}`;
        }
      }

      // Square root
      if (expr.includes('square root') || expr.includes('sqrt')) {
        const match = expr.match(/square root of\s+(\d+\.?\d*)|sqrt\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1] || match[2]);
          const result = Math.sqrt(num);
          return `√${num} = ${result}`;
        }
      }

      // Power: x^y or x to the power of y
      if (expr.includes('^') || expr.includes('power')) {
        const match = expr.match(/(-?\d+\.?\d*)\s*\^\s*(-?\d+\.?\d*)|(-?\d+\.?\d*)\s+(?:to the)?\s*power\s+(?:of\s+)?(-?\d+\.?\d*)/);
        if (match) {
          const base = parseFloat(match[1] || match[3]);
          const exp = parseFloat(match[2] || match[4]);
          const result = Math.pow(base, exp);
          return `${base}^${exp} = ${result}`;
        }
      }

      // Exponent (e^x)
      if (expr.includes('e^') || /exp\s*\(/.test(expr)) {
        const match = expr.match(/e\^(\d+\.?\d*)|exp\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const x = parseFloat(match[1] || match[2]);
          const result = Math.exp(x);
          return `e^${x} = ${result}`;
        }
      }

      // Percentage: x% of y
      if (expr.includes('%') || expr.includes('percent')) {
        const match = expr.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)|(\d+\.?\d*)\s*percent\s*of\s*(\d+\.?\d*)/);
        if (match) {
          const percent = parseFloat(match[1] || match[3]);
          const value = parseFloat(match[2] || match[4]);
          const result = (percent / 100) * value;
          return `${percent}% of ${value} = ${result}`;
        }
      }

      // Percentage increase/decrease
      if (/percent(?:age)?\s+(?:increase|decrease)/.test(expr)) {
        const match = expr.match(/(\d+\.?\d*)\s+to\s+(\d+\.?\d*)/);
        if (match) {
          const from = parseFloat(match[1]);
          const to = parseFloat(match[2]);
          const change = ((to - from) / from) * 100;
          return `Change from ${from} to ${to}: ${change.toFixed(2)}%`;
        }
      }

      // Trigonometric functions (sin, cos, tan)
      if (/sin|cos|tan/.test(expr) && !/asin|acos|atan/.test(expr)) {
        const match = expr.match(/(sin|cos|tan)\s*\(?\s*(-?\d+\.?\d*)\s*\)?/);
        if (match) {
          const func = match[1];
          const angle = parseFloat(match[2]);
          const radians = (angle * Math.PI) / 180;
          let result;
          if (func === 'sin') result = Math.sin(radians);
          else if (func === 'cos') result = Math.cos(radians);
          else result = Math.tan(radians);
          return `${func}(${angle}°) = ${result.toFixed(8)}`;
        }
      }

      // Inverse trigonometric functions
      if (/asin|acos|atan|arcsin|arccos|arctan/.test(expr)) {
        const match = expr.match(/(asin|acos|atan|arcsin|arccos|arctan)\s*\(?\s*(-?\d+\.?\d*)\s*\)?/);
        if (match) {
          const func = match[1].replace('arc', 'a');
          const value = parseFloat(match[2]);
          let result;
          if (func === 'asin') result = Math.asin(value) * (180 / Math.PI);
          else if (func === 'acos') result = Math.acos(value) * (180 / Math.PI);
          else result = Math.atan(value) * (180 / Math.PI);
          return `${func}(${value}) = ${result.toFixed(6)}°`;
        }
      }

      // Hyperbolic functions
      if (/sinh|cosh|tanh/.test(expr)) {
        const match = expr.match(/(sinh|cosh|tanh)\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const func = match[1];
          const x = parseFloat(match[2]);
          let result;
          if (func === 'sinh') result = Math.sinh(x);
          else if (func === 'cosh') result = Math.cosh(x);
          else result = Math.tanh(x);
          return `${func}(${x}) = ${result.toFixed(8)}`;
        }
      }

      // Logarithm base 10
      if (/\blog10?/.test(expr)) {
        const match = expr.match(/log10?\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1]);
          const result = Math.log10(num);
          return `log₁₀(${num}) = ${result}`;
        }
      }

      // Natural log
      if (/\bln\b/.test(expr)) {
        const match = expr.match(/ln\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const num = parseFloat(match[1]);
          const result = Math.log(num);
          return `ln(${num}) = ${result}`;
        }
      }

      // Logarithm with custom base
      if (/log\s*\d+/.test(expr)) {
        const match = expr.match(/log\s*(\d+)\s*\(?\s*(\d+\.?\d*)\s*\)?/);
        if (match) {
          const base = parseFloat(match[1]);
          const num = parseFloat(match[2]);
          const result = Math.log(num) / Math.log(base);
          return `log₍${base}₎(${num}) = ${result}`;
        }
      }

      // GCD (Greatest Common Divisor)
      if (/gcd|greatest common divisor/.test(expr)) {
        const match = expr.match(/gcd\s*\(?\s*(\d+)\s*,\s*(\d+)\s*\)?|greatest common divisor\s+(\d+)\s+(?:and\s+)?(\d+)/);
        if (match) {
          const a = parseInt(match[1] || match[3]);
          const b = parseInt(match[2] || match[4]);
          const result = this.gcd(a, b);
          return `GCD(${a}, ${b}) = ${result}`;
        }
      }

      // LCM (Least Common Multiple)
      if (/lcm|least common multiple/.test(expr)) {
        const match = expr.match(/lcm\s*\(?\s*(\d+)\s*,\s*(\d+)\s*\)?|least common multiple\s+(\d+)\s+(?:and\s+)?(\d+)/);
        if (match) {
          const a = parseInt(match[1] || match[3]);
          const b = parseInt(match[2] || match[4]);
          const result = this.lcm(a, b);
          return `LCM(${a}, ${b}) = ${result}`;
        }
      }

      // Prime check
      if (/is\s+\d+\s+prime|prime\s+\d+/.test(expr)) {
        const match = expr.match(/(\d+)/);
        if (match) {
          const num = parseInt(match[1]);
          const isPrime = this.isPrime(num);
          return `${num} is ${isPrime ? '' : 'not '}a prime number`;
        }
      }

      // Average/Mean
      if (/average|mean/.test(expr)) {
        const numbers = expr.match(/-?\d+\.?\d*/g);
        if (numbers && numbers.length > 0) {
          const nums = numbers.map(n => parseFloat(n));
          const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
          return `Average of [${nums.join(', ')}] = ${avg}`;
        }
      }

      // Median
      if (/median/.test(expr)) {
        const numbers = expr.match(/-?\d+\.?\d*/g);
        if (numbers && numbers.length > 0) {
          const nums = numbers.map(n => parseFloat(n)).sort((a, b) => a - b);
          const mid = Math.floor(nums.length / 2);
          const median = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
          return `Median of [${nums.join(', ')}] = ${median}`;
        }
      }

      // Standard Deviation
      if (/standard deviation|std/.test(expr)) {
        const numbers = expr.match(/-?\d+\.?\d*/g);
        if (numbers && numbers.length > 0) {
          const nums = numbers.map(n => parseFloat(n));
          const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
          const variance = nums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / nums.length;
          const std = Math.sqrt(variance);
          return `Standard Deviation of [${nums.join(', ')}] = ${std.toFixed(4)}`;
        }
      }

      // Distance formula
      if (/distance/.test(expr)) {
        const match = expr.match(/\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?\s+(?:to|and)\s+\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?/);
        if (match) {
          const x1 = parseFloat(match[1]), y1 = parseFloat(match[2]);
          const x2 = parseFloat(match[3]), y2 = parseFloat(match[4]);
          const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          return `Distance from (${x1}, ${y1}) to (${x2}, ${y2}) = ${dist.toFixed(4)}`;
        }
      }

      // Quadratic equation: ax^2 + bx + c = 0
      const quadMatch = message.match(/(-?\d+\.?\d*)\s*x\^?2\s*([+-]\s*\d+\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)\s*=\s*0/);
      if (quadMatch) {
        const a = parseFloat(quadMatch[1]);
        const b = parseFloat(quadMatch[2].replace(/\s/g, ''));
        const c = parseFloat(quadMatch[3].replace(/\s/g, ''));
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          return `Quadratic equation ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\nSolutions:\nx₁ = ${x1.toFixed(6)}\nx₂ = ${x2.toFixed(6)}`;
        } else if (discriminant === 0) {
          const x = -b / (2 * a);
          return `Quadratic equation ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\nOne solution: x = ${x.toFixed(6)}`;
        } else {
          const real = -b / (2 * a);
          const imag = Math.sqrt(-discriminant) / (2 * a);
          return `Quadratic equation ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0\nComplex solutions:\nx₁ = ${real.toFixed(4)} + ${imag.toFixed(4)}i\nx₂ = ${real.toFixed(4)} - ${imag.toFixed(4)}i`;
        }
      }

      // Basic arithmetic: Clean and evaluate
      expr = expr
        .replace(/x/g, '*')
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/\s+/g, '');

      // Check if it's a valid math expression
      if (/^[\d+\-*/().\s]+$/.test(expr)) {
        const result = this.safeEval(expr);
        if (result !== null) {
          return `${expr} = ${result}`;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Factorial calculator
  private factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // GCD (Greatest Common Divisor)
  private gcd(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return Math.abs(a);
  }

  // LCM (Least Common Multiple)
  private lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  // Prime number checker
  private isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  // Safe expression evaluator (avoids eval security issues)
  private safeEval(expr: string): number | null {
    try {
      // Remove any potentially dangerous characters
      if (/[a-zA-Z]/.test(expr.replace(/[eE]/g, ''))) return null;
      
      // Use Function constructor as safer alternative to eval
      const func = new Function('return (' + expr + ')');
      const result = func();
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 1e10) / 1e10; // Round to 10 decimal places
      }
      return null;
    } catch {
      return null;
    }
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

    // First, try to solve math problems
    const mathResult = this.solveMath(message);
    if (mathResult) {
      return mathResult;
    }

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
    return 'I can help you with:\n• Math problems (calculations, equations, trigonometry, etc.)\n• Running the project (pnpm run dev)\n• Building for production (pnpm run build)\n• Deployment guides\n• Tech stack explanations\n• Troubleshooting issues\n\nWhat would you like to know?';
  }
}

export default ChatbotModel;
