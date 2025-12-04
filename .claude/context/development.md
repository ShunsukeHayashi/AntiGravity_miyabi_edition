# Development Guidelines

## 🎯 Overview

This document defines the development standards, coding practices, and workflows for the AntiGravity IDE project.

## 📐 Coding Standards

### TypeScript

**Configuration**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

**Style Guide**:
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes preferred
- **Semicolons**: Required
- **Max Line Length**: 100 characters
- **Naming**:
  - `PascalCase` for classes, interfaces, types
  - `camelCase` for variables, functions
  - `UPPER_SNAKE_CASE` for constants
  - Descriptive names (avoid abbreviations)

**Good Examples**:
```typescript
// ✅ Good
export class AgentManager {
  private activeAgents: Map<string, Agent>;

  async executeAgent(agentName: string): Promise<AgentResult> {
    // Implementation
  }
}

const MAX_RETRY_COUNT = 3;
```

**Bad Examples**:
```typescript
// ❌ Bad
export class AM {
  private aa: Map<string, Agent>;

  async exec(n: string): Promise<any> {
    // Implementation
  }
}

const mrc = 3;
```

### ESLint Rules

**Configuration**: `.eslintrc.json`

**Key Rules**:
- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/explicit-function-return-type`: warn
- `no-console`: warn (allowed in CLI tools)
- `prefer-const`: error
- `no-var`: error

### Prettier

**Configuration**: `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Usage**:
```bash
npm run format          # Format all files
npm run format:check    # Check without modifying
```

## 🧪 Testing Standards

### Test Framework: Jest

**Configuration**: `jest.config.js`

**Coverage Target**: 80%+ for all modules

**Test Structure**:
```typescript
// src/agent/manager.ts
export class AgentManager {
  // Implementation
}

// src/agent/__tests__/manager.test.ts
import { AgentManager } from '../manager';

describe('AgentManager', () => {
  let manager: AgentManager;

  beforeEach(() => {
    manager = new AgentManager();
  });

  describe('executeAgent', () => {
    it('should execute agent successfully', async () => {
      const result = await manager.executeAgent('coordinator');
      expect(result.success).toBe(true);
    });

    it('should handle agent not found error', async () => {
      await expect(
        manager.executeAgent('nonexistent')
      ).rejects.toThrow('Agent not found');
    });

    it('should retry on transient errors', async () => {
      // Test retry logic
    });
  });

  afterEach(() => {
    // Cleanup
  });
});
```

**Test Categories**:
1. **Unit Tests** - Individual functions/classes
2. **Integration Tests** - Component interactions
3. **E2E Tests** - Full workflow testing

**Test Commands**:
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Generate coverage report
npm run pretest         # Build + Lint before tests
```

### Test Best Practices

- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Arrange-Act-Assert pattern
- ✅ Mock external dependencies
- ✅ Test both success and error paths
- ❌ Don't test implementation details
- ❌ Don't make tests dependent on each other

## 🔄 Git Workflow

### Branch Strategy

**Main Branches**:
- `main` - Production-ready code
- `develop` - Integration branch (if needed)

**Feature Branches**:
- Format: `feature/issue-<number>-<description>`
- Example: `feature/issue-7-miyabi-infrastructure`

**Other Branches**:
- `fix/issue-<number>-<description>` - Bug fixes
- `chore/<description>` - Maintenance tasks
- `docs/<description>` - Documentation updates

### Commit Messages

**Format**: Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Tests
- `chore` - Maintenance
- `style` - Code style (formatting)
- `perf` - Performance improvement
- `ci` - CI/CD changes

**Examples**:
```
feat(agent): add Coordinator DAG generation

- Implement task dependency analysis
- Add critical path detection
- Support parallel execution planning

Closes #123

---

fix(mcp): resolve connection timeout in github-enhanced

The github-enhanced MCP server was timing out after 30 seconds.
Increased timeout to 60 seconds and added retry logic.

Fixes #456

---

docs(miyabi): update agent documentation

- Add 21 agent descriptions
- Document workflows
- Add usage examples
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/issue-7-miyabi-infrastructure
   ```

2. **Make Changes**
   ```bash
   # Write code
   npm run build
   npm test
   npm run lint
   ```

3. **Commit**
   ```bash
   git add .
   git commit -m "feat(miyabi): add infrastructure"
   ```

4. **Push**
   ```bash
   git push -u origin feature/issue-7-miyabi-infrastructure
   ```

5. **Create PR**
   ```bash
   gh pr create --title "feat: add Miyabi infrastructure" \
                --body "Closes #7"
   ```

6. **Review & Merge**
   - Wait for CI checks
   - Address review comments
   - Merge when approved

## 📁 Project Structure

```
AntiGravity/
├── src/                    # TypeScript source code
│   ├── agent/             # Agent implementations
│   │   ├── coordinator/
│   │   ├── codegen/
│   │   ├── review/
│   │   ├── issue/
│   │   ├── pr/
│   │   ├── deployment/
│   │   └── test/
│   ├── ui/                # UI components
│   ├── utils/             # Utilities
│   └── types/             # Type definitions
│
├── out/                   # Compiled JavaScript
├── dist/                  # Packaged application
│
├── ide-core/              # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── public/
│
├── agent-service/         # WebSocket backend
│   └── server.js
│
├── .agent/                # Claude Code configuration
│   ├── agents/
│   ├── commands/
│   ├── rules/
│   └── mcp-servers/
│
├── .miyabi/               # Miyabi framework
│   ├── config.yml
│   └── agents.yml
│
├── scripts/               # Utility scripts
│   ├── miyabi-init.sh
│   ├── setup-orchestra.sh
│   └── mcp-launcher.sh
│
└── docs/                  # Documentation
    ├── CLAUDE.md
    └── ...
```

### File Naming Conventions

- **TypeScript**: `camelCase.ts` (e.g., `agentManager.ts`)
- **Tests**: `<name>.test.ts` (e.g., `agentManager.test.ts`)
- **Types**: `index.ts` or `types.ts`
- **Config**: `kebab-case.json` (e.g., `tsconfig.json`)
- **Scripts**: `kebab-case.sh` (e.g., `setup-orchestra.sh`)

## 🔧 Development Commands

### Build & Run

```bash
# Build TypeScript
npm run build           # Compile to out/
npm run watch           # Watch mode

# Run application
npm run dev             # Start Electron app

# Type checking only
npm run typecheck
```

### Code Quality

```bash
# Linting
npm run lint            # Check with ESLint
npm run lint:fix        # Auto-fix issues

# Formatting
npm run format          # Format with Prettier
npm run format:check    # Check formatting
```

### Testing

```bash
# Run tests
npm test                # All tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Pre-test (build + lint)
npm run pretest
```

### Packaging

```bash
# Package application
npm run package         # Create distributable
```

## 🚀 Agent Development

### Creating New Agent

1. **Create Agent Specification**
   ```bash
   touch .agent/agents/my-agent.md
   ```

2. **Define Agent in Miyabi**
   Edit `.miyabi/agents.yml`:
   ```yaml
   - name: my_agent
     display_name: My Agent
     emoji: 🎨
     role: custom_role
     description: What this agent does
     capabilities:
       - capability_1
       - capability_2
     triggers:
       - event_type
     priority: 5
     max_concurrent: 1
   ```

3. **Implement Agent**
   ```typescript
   // src/agent/my-agent/index.ts
   export class MyAgent {
     async execute(input: AgentInput): Promise<AgentResult> {
       // Implementation
     }
   }
   ```

4. **Write Tests**
   ```typescript
   // src/agent/my-agent/__tests__/index.test.ts
   import { MyAgent } from '../index';

   describe('MyAgent', () => {
     it('should execute successfully', async () => {
       const agent = new MyAgent();
       const result = await agent.execute({});
       expect(result.success).toBe(true);
     });
   });
   ```

5. **Register Agent**
   ```typescript
   // src/agent/index.ts
   export { MyAgent } from './my-agent';
   ```

## 🔒 Security Guidelines

### Secrets Management

- ❌ **NEVER** commit secrets to Git
- ✅ Use environment variables
- ✅ Use `.env` files (add to `.gitignore`)
- ✅ Document required env vars in README

**Example**:
```bash
# .env (not committed)
GITHUB_TOKEN=ghp_xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# .env.example (committed)
GITHUB_TOKEN=your_github_token_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Dependencies

- Run `npm audit` regularly
- Update dependencies carefully
- Review dependency licenses
- Avoid unmaintained packages

### Code Review Checklist

- [ ] No hardcoded secrets
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper input validation
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies are up to date

## 📊 Performance Guidelines

- Avoid blocking the main thread (Electron)
- Use async/await for I/O operations
- Lazy load large modules
- Profile before optimizing
- Measure performance impact

## 📝 Documentation

### Code Documentation

**JSDoc for Public APIs**:
```typescript
/**
 * Executes an agent with the given input.
 *
 * @param agentName - Name of the agent to execute
 * @param input - Input data for the agent
 * @returns Promise resolving to agent execution result
 * @throws {AgentNotFoundError} If agent doesn't exist
 *
 * @example
 * ```typescript
 * const result = await manager.executeAgent('coordinator', {
 *   issue: 123,
 *   action: 'analyze'
 * });
 * ```
 */
async executeAgent(
  agentName: string,
  input: AgentInput
): Promise<AgentResult> {
  // Implementation
}
```

### README Files

- Each major module should have a README.md
- Include purpose, usage, examples
- Document APIs and interfaces

## 🎯 Quality Gates

Before merging a PR, ensure:
- [ ] All tests pass (`npm test`)
- [ ] Coverage ≥ 80% for new code
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format:check`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)

## 🔗 Related Documentation

- **`agents.md`** - Agent system architecture
- **`mcp.md`** - MCP server integration
- **`../../CLAUDE.md`** - Main project context
- **`../.miyabi/config.yml`** - Miyabi configuration

---

**Last Updated**: 2025-12-02
**Maintained By**: AntiGravity Development Team
