# AntiGravity IDE - Miyabi Edition

AI-powered IDE with Agent-First Architecture, powered by the **Miyabi Framework**.

[![CI](https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition/actions/workflows/ci.yml/badge.svg)](https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)

## Overview

AntiGravity IDE is a next-generation development environment inspired by Google AntiGravity, featuring:

- **Agent-First Design** - 7 specialized AI agents working collaboratively
- **Mission Control** - Central command interface for agent orchestration
- **VS Code Integration** - Built on Electron with VS Code extension support
- **Miyabi Framework** - Autonomous operations based on Shikigaku (identification science) principles

## Quick Start

### Prerequisites

- Node.js 20.x or later
- npm 9.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition.git
cd AntiGravity_miyabi_edition

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Development

```bash
# Watch mode (TypeScript compilation)
npm run watch

# Run Electron app
npm run dev

# Launch VS Code extension development
npm run dev:extension
```

## Architecture

### Agent System

AntiGravity IDE features 7 specialized agents:

| Agent | Description |
|-------|-------------|
| **CoordinatorAgent** | Task orchestration and DAG-based parallel execution |
| **CodeGenAgent** | AI-driven code generation using Claude Sonnet 4 |
| **ReviewAgent** | Code quality assessment and security scanning |
| **IssueAgent** | Issue analysis with 65-label classification system |
| **PRAgent** | Automated Pull Request creation (Conventional Commits) |
| **DeploymentAgent** | CI/CD automation with auto-rollback |
| **TestAgent** | Test execution and coverage reporting |

### Project Structure

```
AntiGravity/
├── .claude/               # Claude Code configuration
│   ├── agents/           # Agent definitions
│   ├── commands/         # Slash commands
│   ├── mcp-servers/      # Custom MCP servers
│   └── mcp.json          # MCP configuration
├── .miyabi/              # Miyabi framework config
│   ├── config.yml        # Main configuration
│   └── agents.yml        # 21 agent definitions
├── extensions/           # VS Code extensions
│   └── antigravity-core/ # Core extension
├── src/                  # Source code
│   ├── agent/            # Agent implementations
│   ├── bridge/           # VS Code bridge
│   ├── orchestrator/     # Agent orchestrator
│   └── ui/               # UI components
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## Features

### Mission Control

Central command interface providing:
- Agent status monitoring
- Task inbox management
- Workspace organization
- Real-time progress tracking

### MCP Integration

4 custom MCP (Model Context Protocol) servers:

| Server | Purpose |
|--------|---------|
| `project-context` | Package.json analysis, dependency tracking |
| `ide-integration` | VS Code diagnostics, Jupyter execution |
| `github-enhanced` | Issue/PR management, Projects V2 |
| `miyabi-integration` | Miyabi CLI integration |

### Execution Policies

| Policy | Description |
|--------|-------------|
| **Off** | Manual mode - user confirmation required |
| **Auto** | Balanced - routine tasks automated |
| **Turbo** | Maximum automation - AI-driven decisions |

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [MCP Integration Guide](docs/MCP-GUIDE.md)
- [Agent Documentation](docs/AGENTS.md)
- [Component Architecture](docs/COMPONENT_ARCHITECTURE.md)
- [VS Code Fork Integration](docs/FORK_INTEGRATION.md)
- [Contributing Guide](CONTRIBUTING.md)

## Claude Code Integration

AntiGravity IDE is designed to work seamlessly with Claude Code. Available commands:

```bash
# Development commands
/test           # Run project tests
/verify         # System check (env, build, tests)
/deploy         # Deploy to Firebase/Cloud
/security-scan  # Security vulnerability scan

# Miyabi commands
/miyabi-status  # Check Miyabi status
/miyabi-agent   # Run Miyabi agent
/miyabi-auto    # Full automation mode
/create-issue   # Create agent-ready issue
```

## Development

### Build Commands

```bash
npm run build          # TypeScript compilation
npm run build:extension # Build VS Code extension
npm run build:all      # Build everything
npm run typecheck      # Type checking only
```

### Code Quality

```bash
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier formatting
npm run format:check   # Check formatting
```

### Testing

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

Target: 80%+ code coverage

## Environment Variables

```bash
# Required for Agent execution
GITHUB_TOKEN=ghp_xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Optional
REPOSITORY=owner/repo
```

## License

UNLICENSED - Private repository

## Credits

- Inspired by Google AntiGravity
- Powered by [Miyabi Framework](https://github.com/ShunsukeHayashi/Autonomous-Operations)
- Built with [Claude Code](https://claude.com/claude-code)

---

Made with [Miyabi](https://github.com/ShunsukeHayashi/Autonomous-Operations) - Beauty in Autonomous Development
