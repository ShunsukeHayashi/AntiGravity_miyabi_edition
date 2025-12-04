# Contributing to AntiGravity IDE

Thank you for your interest in contributing to AntiGravity IDE!

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 9.x or later
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AntiGravity_miyabi_edition.git
   cd AntiGravity_miyabi_edition
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building

```bash
npm run build          # Full build
npm run watch          # Watch mode
npm run typecheck      # Type checking only
```

### Testing

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

**Coverage Target:** 80%+

### Linting

```bash
npm run lint           # Check for issues
npm run lint:fix       # Auto-fix issues
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

## Code Style

### TypeScript

- Use strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use type guards for type narrowing

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

// Avoid
const user: any = { id: '1', name: 'Test' };
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `agent-orchestrator.ts` |
| Classes | PascalCase | `AgentOrchestrator` |
| Functions | camelCase | `executeTask` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `TaskResult` |

### File Organization

```
src/
├── agent/           # Agent implementations
│   └── <name>/
│       ├── <name>.ts
│       └── __tests__/
├── orchestrator/    # Core orchestration
├── bridge/          # VS Code integration
├── ui/              # UI components
│   └── components/
│       └── atoms/
└── utils/           # Shared utilities
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Code style (formatting) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |
| `ci` | CI/CD changes |

### Examples

```bash
feat(agent): add retry logic to CodeGenAgent

fix(orchestrator): handle timeout in task queue

docs: update API documentation

test(review): add unit tests for ReviewAgent
```

## Pull Request Process

### Creating a PR

1. Ensure all tests pass:
   ```bash
   npm run build && npm test
   ```

2. Update documentation if needed

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request with:
   - Clear title following commit conventions
   - Description of changes
   - Link to related issue (if any)

### PR Template

```markdown
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Related Issues
Closes #123
```

### Review Process

1. Automated checks must pass (CI, linting, tests)
2. At least one approval required
3. All conversations resolved
4. Branch up-to-date with main

## Issue Guidelines

### Creating Issues

Use the appropriate issue template:

- **Bug Report**: For bugs and errors
- **Feature Request**: For new features
- **Documentation**: For doc improvements

### Issue Labels

We use the Miyabi 65-label system. Key labels:

| Category | Labels |
|----------|--------|
| Type | `bug`, `feature`, `refactor`, `docs`, `test` |
| Priority | `P0-Critical`, `P1-High`, `P2-Medium`, `P3-Low` |
| State | `pending`, `implementing`, `reviewing`, `done` |
| Complexity | `small`, `medium`, `large`, `xlarge` |

## Agent Development

### Creating a New Agent

1. Create directory structure:
   ```
   src/agent/<name>/
   ├── <name>.ts
   └── __tests__/
       └── <name>.test.ts
   ```

2. Implement the agent:
   ```typescript
   import { BaseAgent } from '../base';

   export class MyAgent extends BaseAgent {
     constructor() {
       super('my-agent', { /* config */ });
     }

     async execute(task: Task): Promise<TaskResult> {
       // Implementation
     }
   }
   ```

3. Register in orchestrator
4. Add tests (80%+ coverage)
5. Update documentation

## Security

### Reporting Vulnerabilities

Please report security issues privately via GitHub Security Advisories.

### Best Practices

- Never commit secrets (`.env`, tokens, keys)
- Use environment variables for sensitive data
- Validate all external inputs
- Follow OWASP guidelines

## Getting Help

- GitHub Issues: For bugs and features
- Discussions: For questions
- Documentation: `docs/` directory

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing!
