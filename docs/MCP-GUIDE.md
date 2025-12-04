# MCP Integration Guide

AntiGravity IDE uses the Model Context Protocol (MCP) to extend Claude Code's capabilities.

## Overview

MCP (Model Context Protocol) enables Claude Code to interact with external tools and services. AntiGravity provides 4 custom MCP servers:

| Server | Description |
|--------|-------------|
| `project-context` | Package.json analysis, dependency tracking |
| `ide-integration` | VS Code diagnostics, Jupyter execution |
| `github-enhanced` | Issue/PR management, Projects V2 |
| `miyabi-integration` | Miyabi framework CLI |

## Configuration

MCP servers are configured in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "project-context": {
      "command": "node",
      "args": [".claude/mcp-servers/project-context.js"]
    },
    "ide-integration": {
      "command": "node",
      "args": [".claude/mcp-servers/ide-integration.js"]
    },
    "github-enhanced": {
      "command": "node",
      "args": [".claude/mcp-servers/github-enhanced.js"],
      "env": {
        "REPOSITORY": "ShunsukeHayashi/AntiGravity_miyabi_edition"
      }
    },
    "miyabi-integration": {
      "command": "node",
      "args": [".claude/mcp-servers/miyabi-integration.js"]
    }
  }
}
```

## Server Details

### project-context

Provides project metadata and dependency information.

**Tools:**
- `get_package_info` - Read package.json details
- `list_dependencies` - List all dependencies
- `get_scripts` - List npm scripts
- `analyze_structure` - Analyze project structure

**Example:**
```
Claude can use project-context to understand your project's dependencies
and suggest appropriate libraries or detect version conflicts.
```

### ide-integration

Integrates with VS Code APIs for diagnostics and editor features.

**Tools:**
- `get_diagnostics` - Get code diagnostics (errors, warnings)
- `get_workspace_info` - Get workspace configuration
- `execute_command` - Run VS Code commands
- `run_jupyter_cell` - Execute Jupyter notebook cells

**Example:**
```
Claude can access VS Code's diagnostic information to help fix
TypeScript errors or linting issues.
```

### github-enhanced

Extended GitHub integration for the Miyabi workflow.

**Tools:**
- `list_issues` - List repository issues
- `create_issue` - Create new issue
- `update_issue` - Update issue labels/status
- `create_pr` - Create pull request
- `get_pr_diff` - Get PR changes
- `add_pr_comment` - Comment on PR
- `get_projects` - List GitHub Projects V2

**Required Environment:**
```bash
GITHUB_TOKEN=ghp_xxxxx
REPOSITORY=owner/repo
```

**Example:**
```
Claude can automatically create issues with proper labels
following the 65-label Miyabi classification system.
```

### miyabi-integration

CLI integration for the Miyabi autonomous operations framework.

**Tools:**
- `miyabi_status` - Get agent status
- `miyabi_run` - Execute agent pipeline
- `miyabi_config` - Read/update configuration
- `miyabi_logs` - View execution logs

**Example:**
```
Claude can trigger the full Miyabi agent pipeline to
automatically process issues through all 7 agents.
```

## Testing MCP Servers

Run the test script to verify all servers:

```bash
./scripts/test-mcp-servers.sh
```

Expected output:
```
Testing MCP Servers...

Testing project-context... PASS
Testing ide-integration... PASS
Testing github-enhanced... PASS
Testing miyabi-integration... PASS

Results: 4 passed, 0 failed
```

## Manual Testing

Test individual servers:

```bash
# CommonJS servers
node -e "require('./.claude/mcp-servers/project-context.js')"

# ESM server
node --input-type=module -e "import('./.claude/mcp-servers/miyabi-integration.js')"
```

## Launching MCP Servers

Use the MCP launcher script:

```bash
# List all servers
./scripts/mcp-launcher.sh list

# Check server status
./scripts/mcp-launcher.sh status github-enhanced

# Launch a server
./scripts/mcp-launcher.sh launch github-enhanced
```

## Creating Custom MCP Servers

### Basic Structure

```javascript
// .claude/mcp-servers/my-server.js
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const server = new McpServer({
  name: 'my-server',
  version: '1.0.0'
});

// Define tools
server.tool('my_tool', {
  description: 'Description of my tool',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string', description: 'Parameter description' }
    }
  }
}, async ({ param }) => {
  // Implementation
  return { result: 'success' };
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
```

### Register in mcp.json

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": [".claude/mcp-servers/my-server.js"]
    }
  }
}
```

## Troubleshooting

### Server Not Found

Check that the server file exists and is executable:

```bash
ls -la .claude/mcp-servers/
```

### Module Not Found

Install MCP SDK:

```bash
npm install @modelcontextprotocol/sdk
```

### Environment Variables

Ensure required environment variables are set:

```bash
export GITHUB_TOKEN=ghp_xxxxx
export REPOSITORY=owner/repo
```

### Debugging

Enable verbose logging:

```bash
DEBUG=mcp:* node .claude/mcp-servers/github-enhanced.js
```

## Resources

- [MCP SDK Documentation](https://github.com/anthropics/mcp-sdk)
- [Claude Code MCP Guide](https://docs.anthropic.com/claude-code/mcp)
- [AntiGravity MCP Servers](.claude/mcp-servers/)
