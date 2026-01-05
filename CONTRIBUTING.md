# Contributing to This Project

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/s23010843/s23010843.github.io.git
   cd home
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed and what behavior you expected
* Include screenshots if relevant
* Include your environment details (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed feature
* Explain why this enhancement would be useful
* List any alternative solutions you've considered

### Pull Requests

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:
   * Write clear, concise commit messages
   * Follow the existing code style
   * Add tests if applicable
   * Update documentation as needed

3. Test your changes:
   ```bash
   pnpm run build
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Submit a pull request:
   * Provide a clear description of the changes
   * Reference any related issues
   * Ensure all CI checks pass

## Code Style Guidelines

### General

* Use consistent indentation (2 spaces)
* Use meaningful variable and function names
* Write comments for complex logic
* Keep functions small and focused

### JavaScript/TypeScript

* Follow modern ES6+ syntax
* Use TypeScript types where applicable
* Prefer `const` over `let`, avoid `var`
* Use arrow functions for callbacks

### Astro Components

* Follow Astro's component structure (frontmatter, markup, scripts, styles)
* Use scoped styles by default
* Keep components focused and reusable

### CSS

* Use semantic class names
* Prefer CSS custom properties for theming
* Follow mobile-first responsive design
* Use modern CSS features (Grid, Flexbox)

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── lib/            # Utility functions
│   └── styles/         # Global styles
├── public/             # Static assets
├── docs/               # Documentation
└── scripts/            # Build and dev scripts
```

## Development Workflow

### Running Locally

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Testing

Before submitting a PR:

1. Test your changes thoroughly
2. Build the project successfully
3. Check for console errors
4. Test on different browsers if applicable
5. Verify responsive design on different screen sizes

## Commit Message Guidelines

Use clear and meaningful commit messages:

* `feat: add new feature`
* `fix: resolve bug in component`
* `docs: update README`
* `style: format code`
* `refactor: restructure component`
* `test: add tests`
* `chore: update dependencies`

## Documentation

When adding new features or making significant changes:

* Update relevant documentation in the `docs/` folder
* Add inline code comments for complex logic
* Update the README if necessary
* Include examples for new APIs or components

## Community

* Be respectful and constructive
* Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
* Help others when you can
* Share your knowledge

## Questions?

If you have questions or need help:

* Check the existing documentation
* Search existing issues
* Create a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉
