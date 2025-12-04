#!/bin/bash
# Miyabi Initialization Script for AntiGravity IDE
# Loads environment variables and aliases for Agent Orchestra

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}🌸 Miyabi Initialization for AntiGravity IDE${NC}"
echo ""

# Project root detection
if [ -f "package.json" ] && [ -f "CLAUDE.md" ]; then
  export ANTIGRAVITY_ROOT="$(pwd)"
  echo -e "${GREEN}✅ Project root: ${ANTIGRAVITY_ROOT}${NC}"
else
  echo -e "${RED}❌ Error: Not in AntiGravity project root${NC}"
  return 1
fi

# Miyabi configuration
export MIYABI_CONFIG="${ANTIGRAVITY_ROOT}/.miyabi/config.yml"
export MIYABI_AGENTS="${ANTIGRAVITY_ROOT}/.miyabi/agents.yml"

# Agent environment
export AGENT_NAME="${AGENT_NAME:-coordinator}"
export AGENT_MODE="${AGENT_MODE:-development}"

# MCP Servers
export MCP_CONFIG="${ANTIGRAVITY_ROOT}/.agent/mcp.json"

# GitHub
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}⚠️  GITHUB_TOKEN not set${NC}"
fi

# Anthropic
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not set${NC}"
fi

# ============================================================================
# Aliases - Navigation
# ============================================================================

alias ag='cd $ANTIGRAVITY_ROOT'
alias ag-root='cd $ANTIGRAVITY_ROOT'
alias ag-src='cd $ANTIGRAVITY_ROOT/src'
alias ag-agent='cd $ANTIGRAVITY_ROOT/src/agent'
alias ag-ide='cd $ANTIGRAVITY_ROOT/ide-core'
alias ag-service='cd $ANTIGRAVITY_ROOT/agent-service'
alias ag-docs='cd $ANTIGRAVITY_ROOT/docs'
alias ag-scripts='cd $ANTIGRAVITY_ROOT/scripts'

# ============================================================================
# Aliases - Development
# ============================================================================

alias ag-build='npm run build'
alias ag-watch='npm run watch'
alias ag-dev='npm run dev'
alias ag-test='npm test'
alias ag-lint='npm run lint'
alias ag-format='npm run format'

# ============================================================================
# Aliases - Git
# ============================================================================

alias ag-git='cd $ANTIGRAVITY_ROOT && git status'
alias ag-log='git log --oneline -10'
alias ag-diff='git diff'
alias ag-branch='git branch'

# ============================================================================
# Aliases - Agent Orchestra
# ============================================================================

alias ag-orchestra='$ANTIGRAVITY_ROOT/scripts/setup-orchestra.sh'
alias ag-mcp='$ANTIGRAVITY_ROOT/scripts/mcp-launcher.sh'
alias ag-status='echo "Agent: $AGENT_NAME | Mode: $AGENT_MODE | Root: $ANTIGRAVITY_ROOT"'

# ============================================================================
# Aliases - IDE Components
# ============================================================================

alias ag-ide-dev='cd $ANTIGRAVITY_ROOT/ide-core && npm run dev'
alias ag-service-start='cd $ANTIGRAVITY_ROOT/agent-service && node server.js'

# ============================================================================
# Functions
# ============================================================================

# Switch agent context
ag-agent-switch() {
  if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ag-agent-switch [coordinator|codegen|review|issue|pr|deployment|test]${NC}"
    return 1
  fi

  export AGENT_NAME="$1"
  echo -e "${GREEN}✅ Agent switched to: ${AGENT_NAME}${NC}"

  # Agent-specific setup
  case "$AGENT_NAME" in
    coordinator)
      echo -e "${BLUE}🎯 Coordinator (しきろーん) - Task orchestration${NC}"
      ;;
    codegen)
      echo -e "${BLUE}💻 CodeGen Agent - AI-powered code generation${NC}"
      ;;
    review)
      echo -e "${BLUE}🔍 Review Agent - Code quality assessment${NC}"
      ;;
    issue)
      echo -e "${BLUE}📝 Issue Agent - Issue analysis and labeling${NC}"
      ;;
    pr)
      echo -e "${BLUE}🔀 PR Agent - Pull request automation${NC}"
      ;;
    deployment)
      echo -e "${BLUE}🚀 Deployment Agent - CI/CD automation${NC}"
      ;;
    test)
      echo -e "${BLUE}🧪 Test Agent - Automated testing${NC}"
      ;;
    *)
      echo -e "${YELLOW}⚠️  Unknown agent: ${AGENT_NAME}${NC}"
      ;;
  esac
}

# Show Miyabi status
ag-miyabi-status() {
  echo -e "${CYAN}═══════════════════════════════════════${NC}"
  echo -e "${MAGENTA}🌸 AntiGravity Miyabi Status${NC}"
  echo -e "${CYAN}═══════════════════════════════════════${NC}"
  echo ""
  echo -e "${GREEN}Project:${NC} AntiGravity IDE"
  echo -e "${GREEN}Root:${NC} $ANTIGRAVITY_ROOT"
  echo -e "${GREEN}Agent:${NC} $AGENT_NAME"
  echo -e "${GREEN}Mode:${NC} $AGENT_MODE"
  echo ""
  echo -e "${GREEN}Git Branch:${NC} $(git branch --show-current 2>/dev/null || echo 'N/A')"
  echo -e "${GREEN}Git Status:${NC}"
  git status -s 2>/dev/null | head -5 || echo "  N/A"
  echo ""
  echo -e "${GREEN}Node Version:${NC} $(node --version 2>/dev/null || echo 'N/A')"
  echo -e "${GREEN}npm Version:${NC} $(npm --version 2>/dev/null || echo 'N/A')"
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════${NC}"
}

# Quick project info
ag-info() {
  echo -e "${MAGENTA}🌸 AntiGravity IDE${NC}"
  echo ""
  echo "Version: $(cat package.json | grep version | head -1 | awk -F: '{print $2}' | sed 's/[", ]//g')"
  echo "Agents: 7 (Coordinator, CodeGen, Review, Issue, PR, Deployment, Test)"
  echo "MCP Servers: 5"
  echo ""
  echo "Commands:"
  echo "  ag-build          - Build TypeScript"
  echo "  ag-dev            - Run Electron app"
  echo "  ag-test           - Run tests"
  echo "  ag-orchestra      - Setup Agent Orchestra"
  echo "  ag-mcp            - Launch MCP servers"
  echo "  ag-miyabi-status  - Show full status"
}

# ============================================================================
# Initialization Complete
# ============================================================================

echo ""
echo -e "${GREEN}✅ Miyabi initialization complete${NC}"
echo -e "${CYAN}Type 'ag-info' for quick help${NC}"
echo ""

# Display current agent
if [ -n "$AGENT_NAME" ]; then
  ag-agent-switch "$AGENT_NAME" > /dev/null
  echo -e "${BLUE}🎯 Current Agent: ${AGENT_NAME}${NC}"
fi

echo ""
