# Model Context Protocol (MCP) Integration

## 🔌 Overview

The Model Context Protocol (MCP) enables standardized communication between Claude Code and external tools/services. AntiGravity IDE integrates 5 MCP servers for enhanced AI capabilities.

## 📋 Available MCP Servers

### 1. ide-integration ✅

**Status**: Enabled
**Purpose**: VS Code diagnostics and Jupyter notebook execution

**Capabilities**:
- Get VS Code diagnostics
- Execute Jupyter notebook cells
- Read notebook outputs
- Language server integration

**Command**:
```bash
node .claude/mcp-servers/ide-integration.js
```

**Usage Example**:
```typescript
// Get TypeScript diagnostics
const diagnostics = await mcp.call('ide-integration', 'getDiagnostics', {
  file: 'src/agent/manager.ts'
});

// Execute notebook cell
const result = await mcp.call('ide-integration', 'executeCell', {
  notebook: 'analysis.ipynb',
  cellIndex: 0
});
```

---

### 2. github-enhanced ✅

**Status**: Enabled
**Purpose**: Enhanced GitHub operations for Issue/PR management

**Required Environment Variables**:
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `REPOSITORY` - Repository in format `owner/repo`

**Capabilities**:
- Create/update/close issues
- Create/merge pull requests
- Manage labels and milestones
- GitHub Projects V2 integration
- Workflow management

**Command**:
```bash
GITHUB_TOKEN=$GITHUB_TOKEN REPOSITORY=$REPOSITORY \
  node .claude/mcp-servers/github-enhanced.js
```

**Usage Examples**:

**Create Issue**:
```typescript
const issue = await mcp.call('github-enhanced', 'createIssue', {
  title: 'Add Coordinator Agent',
  body: 'Implement DAG-based task orchestration',
  labels: ['type:feature', 'agent:coordinator', 'P1-High'],
  assignees: ['shunsukedev']
});
```

**Create Pull Request**:
```typescript
const pr = await mcp.call('github-enhanced', 'createPullRequest', {
  title: 'feat(agent): add Coordinator Agent',
  body: 'Closes #123',
  head: 'feature/issue-123-coordinator',
  base: 'main',
  draft: true
});
```

**Add Labels**:
```typescript
await mcp.call('github-enhanced', 'addLabels', {
  issueNumber: 123,
  labels: ['state:implementing', 'complexity:medium']
});
```

---

### 3. project-context ✅

**Status**: Enabled
**Purpose**: Project-specific context and dependency information

**Capabilities**:
- Parse `package.json`
- Analyze dependencies
- Detect project structure
- Extract metadata

**Command**:
```bash
node .claude/mcp-servers/project-context.js
```

**Usage Example**:
```typescript
// Get project dependencies
const deps = await mcp.call('project-context', 'getDependencies', {});

// Analyze project structure
const structure = await mcp.call('project-context', 'getStructure', {});

// Get package.json info
const pkg = await mcp.call('project-context', 'getPackageInfo', {});
```

**Response Format**:
```json
{
  "name": "antigravity-ide",
  "version": "0.1.0",
  "dependencies": {
    "electron": "^28.0.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "build": "tsc -p ./",
    "test": "jest"
  }
}
```

---

### 4. filesystem ✅

**Status**: Enabled
**Purpose**: Safe filesystem access for project files

**Capabilities**:
- Read files
- Write files
- List directories
- Check file existence
- Get file metadata

**Command**:
```bash
npx -y @modelcontextprotocol/server-filesystem .
```

**Usage Examples**:

**Read File**:
```typescript
const content = await mcp.call('filesystem', 'readFile', {
  path: 'src/agent/manager.ts'
});
```

**Write File**:
```typescript
await mcp.call('filesystem', 'writeFile', {
  path: 'src/agent/new-agent.ts',
  content: 'export class NewAgent { ... }'
});
```

**List Directory**:
```typescript
const files = await mcp.call('filesystem', 'listDirectory', {
  path: 'src/agent'
});
```

---

### 5. context-engineering ⏸️

**Status**: Disabled (external dependency not installed)
**Purpose**: AI-powered context analysis and optimization

**Required**:
- External AI Guides API server
- `AI_GUIDES_API_URL` environment variable

**Capabilities** (when enabled):
- Semantic search across codebase
- Context optimization
- Code relationship analysis
- Documentation generation

**Command** (when enabled):
```bash
AI_GUIDES_API_URL=http://localhost:8888 \
  node external/context-engineering-mcp/mcp-server/index.js
```

**Note**: This server is disabled by default. To enable:
1. Install AI Guides API dependency
2. Update `AI_GUIDES_API_URL` in environment
3. Set `"disabled": false` in `.agent/mcp.json`

---

## 🔧 MCP Configuration

### Configuration File: `.agent/mcp.json`

```json
{
  "mcpServers": {
    "ide-integration": {
      "command": "node",
      "args": [".claude/mcp-servers/ide-integration.js"],
      "disabled": false,
      "description": "VS Code diagnostics and Jupyter execution integration"
    },
    "github-enhanced": {
      "command": "node",
      "args": [".claude/mcp-servers/github-enhanced.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "REPOSITORY": "${REPOSITORY}"
      },
      "disabled": false,
      "description": "Enhanced GitHub operations for Issue/PR management"
    },
    "project-context": {
      "command": "node",
      "args": [".claude/mcp-servers/project-context.js"],
      "disabled": false,
      "description": "Project-specific context and dependency information"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "disabled": false,
      "description": "Filesystem access for project files"
    },
    "context-engineering": {
      "command": "node",
      "args": ["external/context-engineering-mcp/mcp-server/index.js"],
      "env": {
        "AI_GUIDES_API_URL": "http://localhost:8888"
      },
      "disabled": true,
      "description": "Context Engineering (disabled: external dependency not installed)"
    }
  }
}
```

## 🚀 Using MCP Servers

### Launch MCP Servers

**Interactive Mode**:
```bash
./scripts/mcp-launcher.sh
```

**Command Line**:
```bash
# List all servers
./scripts/mcp-launcher.sh list

# Check server status
./scripts/mcp-launcher.sh status github-enhanced

# Test server
./scripts/mcp-launcher.sh test github-enhanced

# Launch server
./scripts/mcp-launcher.sh launch github-enhanced
```

### From Claude Code

Claude Code automatically loads MCP servers from `.agent/mcp.json`. No manual setup required.

**Example Usage in Task**:
```typescript
// Claude Code automatically has access to MCP tools

// Create GitHub issue
await tools.call('github-enhanced', 'createIssue', {
  title: 'New feature',
  body: 'Description'
});

// Read project file
const content = await tools.call('filesystem', 'readFile', {
  path: 'package.json'
});

// Get VS Code diagnostics
const diagnostics = await tools.call('ide-integration', 'getDiagnostics', {
  file: 'src/agent/manager.ts'
});
```

## 🔐 Environment Variables

### Required Variables

```bash
# GitHub Personal Access Token (required for github-enhanced)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxx"

# Repository name (required for github-enhanced)
export REPOSITORY="owner/repo"

# Anthropic API Key (required for Claude Code)
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxx"
```

### Optional Variables

```bash
# AI Guides API URL (for context-engineering)
export AI_GUIDES_API_URL="http://localhost:8888"

# Slack webhook (for notifications)
export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."

# Discord webhook (for notifications)
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Setting Environment Variables

**Method 1: .env file**
```bash
# Create .env file (add to .gitignore)
cat > .env << 'EOF'
GITHUB_TOKEN=ghp_xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
REPOSITORY=owner/repo
EOF

# Load in shell
source .env
```

**Method 2: Shell profile**
```bash
# Add to ~/.zshrc or ~/.bashrc
echo 'export GITHUB_TOKEN="ghp_xxxxx"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.zshrc

# Reload
source ~/.zshrc
```

**Method 3: Miyabi init script**
```bash
# Already loaded by scripts/miyabi-init.sh
source scripts/miyabi-init.sh
```

## 🧪 Testing MCP Servers

### Test Server Availability

```bash
# Check if server file exists
ls -la .claude/mcp-servers/github-enhanced.js

# Test server command
node .claude/mcp-servers/github-enhanced.js --help

# Check environment variables
echo $GITHUB_TOKEN
echo $REPOSITORY
```

### Test Server Functionality

**github-enhanced**:
```bash
# Test GitHub API connection
gh auth status

# Test repository access
gh repo view $REPOSITORY
```

**ide-integration**:
```bash
# Check VS Code is running
ps aux | grep "Visual Studio Code"

# Check TypeScript compiler
tsc --version
```

**project-context**:
```bash
# Check package.json exists
cat package.json | jq '.name, .version'
```

**filesystem**:
```bash
# Check filesystem access
ls -la src/agent/
```

## 🔄 MCP Server Lifecycle

### Server States

1. **Configured** - Defined in `.agent/mcp.json`
2. **Enabled** - `"disabled": false`
3. **Running** - Process active
4. **Connected** - Claude Code can communicate
5. **Idle** - No active requests
6. **Busy** - Processing requests
7. **Error** - Failed to start or crashed
8. **Stopped** - Intentionally terminated

### Server Management

**Enable Server**:
```json
// In .agent/mcp.json
"server-name": {
  "disabled": false  // Change to false
}
```

**Disable Server**:
```json
// In .agent/mcp.json
"server-name": {
  "disabled": true   // Change to true
}
```

**Restart Server**:
```bash
# Kill process if running
pkill -f "mcp-servers/github-enhanced.js"

# Restart via launcher
./scripts/mcp-launcher.sh launch github-enhanced
```

## 📊 MCP Server Priorities

Server priorities (1-10, higher = more important):

| Server | Priority | Use Case |
|--------|----------|----------|
| github-enhanced | 10 | Critical for GitHub automation |
| ide-integration | 8 | Important for diagnostics |
| project-context | 7 | Useful for project info |
| filesystem | 6 | Basic file operations |
| context-engineering | 5 | Optional enhancement |

## 🚨 Troubleshooting

### Common Issues

**Server Not Starting**:
```bash
# Check command exists
which node

# Check server file
ls .claude/mcp-servers/server-name.js

# Check permissions
chmod +x .claude/mcp-servers/*.js
```

**Environment Variable Not Set**:
```bash
# Check variable
echo $GITHUB_TOKEN

# Set temporarily
export GITHUB_TOKEN="ghp_xxxxx"

# Set permanently
echo 'export GITHUB_TOKEN="ghp_xxxxx"' >> ~/.zshrc
```

**GitHub API Rate Limit**:
```bash
# Check rate limit
gh api rate_limit

# Wait for reset or use authenticated token
```

**Connection Timeout**:
- Check network connection
- Verify API endpoints are accessible
- Increase timeout in server code

## 🔗 Related Documentation

- **`agents.md`** - How agents use MCP servers
- **`development.md`** - Development guidelines
- **`../../.miyabi/config.yml`** - Miyabi MCP configuration
- **MCP Protocol**: https://modelcontextprotocol.io/

---

**Last Updated**: 2025-12-02
**MCP Servers**: 5 (4 enabled, 1 disabled)
**Framework**: Model Context Protocol 1.0
