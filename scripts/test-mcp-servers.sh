#!/bin/bash
# MCP Server Test Script for AntiGravity IDE
# Tests all MCP servers for proper startup

set -e

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT="$(pwd)"

echo -e "${CYAN}🔌 MCP Server Test Suite${NC}"
echo ""

PASSED=0
FAILED=0

test_server() {
  local name=$1
  local script=$2
  local env_vars=$3

  echo -n "Testing $name... "

  if [ ! -f "$script" ]; then
    echo -e "${YELLOW}SKIP${NC} (file not found)"
    return
  fi

  # Test by checking if module loads without errors
  local output
  if [ -n "$env_vars" ]; then
    output=$(eval "$env_vars node -e \"require('./$script')\"" 2>&1) || true
  else
    output=$(node -e "require('./$script')" 2>&1) || true
  fi

  # Check for module load errors
  if echo "$output" | grep -q "Error:"; then
    echo -e "${RED}FAIL${NC}"
    echo "  $output" | head -2
    ((FAILED++))
  else
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
  fi
}

echo -e "${CYAN}Testing MCP Servers...${NC}"
echo ""

# Test each server
test_server "project-context" ".claude/mcp-servers/project-context.js" ""
test_server "ide-integration" ".claude/mcp-servers/ide-integration.js" ""
test_server "github-enhanced" ".claude/mcp-servers/github-enhanced.js" "REPOSITORY=ShunsukeHayashi/AntiGravity_miyabi_edition"

# miyabi-integration is ESM, test differently
echo -n "Testing miyabi-integration... "
if node --input-type=module -e "import('./.claude/mcp-servers/miyabi-integration.js')" 2>&1 | grep -q "Error:"; then
  echo -e "${RED}FAIL${NC}"
  ((FAILED++))
else
  echo -e "${GREEN}PASS${NC}"
  ((PASSED++))
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"

if [ $FAILED -gt 0 ]; then
  exit 1
fi

echo ""
echo -e "${GREEN}✅ All MCP servers passed!${NC}"
