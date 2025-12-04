# Quick Start Guide

Get up and running with AntiGravity IDE in minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20.x** or later ([download](https://nodejs.org/))
- **npm 9.x** or later (comes with Node.js)
- **Git** for version control
- **VS Code** (optional, for extension development)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition.git
cd AntiGravity_miyabi_edition
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Verify Installation

```bash
npm test
```

All tests should pass (20 tests, 3 test suites).

## Running AntiGravity IDE

### Option 1: Electron App

```bash
npm run dev
```

This launches the full AntiGravity IDE as an Electron application.

### Option 2: VS Code Extension

```bash
npm run dev:extension
```

This opens a new VS Code window with the AntiGravity extension loaded.

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required for GitHub integration
GITHUB_TOKEN=ghp_your_github_token

# Required for AI features
ANTHROPIC_API_KEY=sk-ant-your_api_key

# Optional: Repository for GitHub MCP
REPOSITORY=ShunsukeHayashi/AntiGravity_miyabi_edition
```

### Miyabi Configuration

The Miyabi framework is configured in `.miyabi/config.yml`. Key settings:

```yaml
project:
  name: antigravity-ide
  version: 0.1.0

agents:
  enabled:
    - coordinator
    - codegen
    - review
    - issue
    - pr
    - deployment
    - test
```

## Using with Claude Code

AntiGravity IDE is designed to work with Claude Code. Launch Claude Code in the project directory:

```bash
cd AntiGravity_miyabi_edition
claude
```

### Available Commands

```bash
# Project verification
/verify          # Check environment, build, and tests

# Testing
/test            # Run all tests

# Agent operations
/miyabi-status   # Check agent status
/miyabi-agent    # Run agent pipeline
/create-issue    # Create agent-ready issue
```

## Next Steps

- Read the [Agent Documentation](AGENTS.md) to understand the agent system
- Explore [MCP Integration](MCP-GUIDE.md) for protocol details
- Check [Component Architecture](COMPONENT_ARCHITECTURE.md) for code structure

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:

```bash
npm run typecheck
```

### Test Failures

Check specific test suites:

```bash
npm run test:watch
```

### Extension Not Loading

Ensure VS Code extension is compiled:

```bash
npm run build:extension
```

### MCP Server Issues

Test MCP servers:

```bash
./scripts/test-mcp-servers.sh
```

## Getting Help

- GitHub Issues: [Report a bug](https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition/issues)
- Documentation: Check the `docs/` directory
- Claude Code: Use `/help` for command assistance
