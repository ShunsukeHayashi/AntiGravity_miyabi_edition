#!/bin/bash
# MCP Server Launcher for AntiGravity IDE
# Manages Model Context Protocol servers

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT="$(pwd)"

MCP_CONFIG="${PROJECT_ROOT}/.agent/mcp.json"
MCP_SERVERS_DIR="${PROJECT_ROOT}/.agent/mcp-servers"

echo -e "${MAGENTA}🔌 MCP Server Launcher${NC}"
echo ""

# ============================================================================
# Check MCP configuration
# ============================================================================

if [ ! -f "$MCP_CONFIG" ]; then
  echo -e "${RED}❌ Error: MCP config not found at ${MCP_CONFIG}${NC}"
  exit 1
fi

if [ ! -d "$MCP_SERVERS_DIR" ]; then
  echo -e "${YELLOW}⚠️  Warning: MCP servers directory not found${NC}"
fi

echo -e "${CYAN}MCP Config: ${MCP_CONFIG}${NC}"
echo -e "${CYAN}MCP Servers: ${MCP_SERVERS_DIR}${NC}"
echo ""

# ============================================================================
# List MCP Servers
# ============================================================================

list_servers() {
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo -e "${MAGENTA}Available MCP Servers${NC}"
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo ""

  if command -v jq &> /dev/null; then
    # Use jq if available
    jq -r '.mcpServers | to_entries[] | "\(.key): \(.value.description // "No description") [\(if .value.disabled then "DISABLED" else "ENABLED" end)]"' "$MCP_CONFIG"
  else
    # Fallback to grep
    echo "Note: Install jq for better output (brew install jq)"
    grep -E '"[a-z-]+":' "$MCP_CONFIG" | sed 's/[",:]//g' | awk '{print $1}'
  fi

  echo ""
}

# ============================================================================
# Check Server Status
# ============================================================================

check_status() {
  local server_name="$1"

  echo -e "${CYAN}Checking ${server_name}...${NC}"

  # Check if server is disabled in config
  if command -v jq &> /dev/null; then
    local disabled=$(jq -r ".mcpServers.\"${server_name}\".disabled // false" "$MCP_CONFIG")
    if [ "$disabled" = "true" ]; then
      echo -e "${YELLOW}⏸️  Server is disabled in config${NC}"
      return 1
    fi
  fi

  # Check if server file exists
  local server_file="${MCP_SERVERS_DIR}/${server_name}.js"
  if [ -f "$server_file" ]; then
    echo -e "${GREEN}✅ Server file exists: ${server_file}${NC}"
  else
    echo -e "${YELLOW}⚠️  Server file not found: ${server_file}${NC}"
  fi

  # Check required environment variables
  if command -v jq &> /dev/null; then
    local env_vars=$(jq -r ".mcpServers.\"${server_name}\".env // {} | keys[]" "$MCP_CONFIG" 2>/dev/null)
    if [ -n "$env_vars" ]; then
      echo -e "${CYAN}Required environment variables:${NC}"
      while IFS= read -r var; do
        if [ -n "${!var}" ]; then
          echo -e "  ${GREEN}✅ ${var}${NC}"
        else
          echo -e "  ${RED}❌ ${var} (not set)${NC}"
        fi
      done <<< "$env_vars"
    fi
  fi

  echo ""
}

# ============================================================================
# Test Server
# ============================================================================

test_server() {
  local server_name="$1"

  echo -e "${CYAN}Testing ${server_name}...${NC}"

  # Get command from config
  if command -v jq &> /dev/null; then
    local command=$(jq -r ".mcpServers.\"${server_name}\".command" "$MCP_CONFIG")
    local args=$(jq -r ".mcpServers.\"${server_name}\".args | join(\" \")" "$MCP_CONFIG")

    echo -e "${BLUE}Command: ${command} ${args}${NC}"

    # Check if command exists
    if ! command -v "$command" &> /dev/null; then
      echo -e "${RED}❌ Command not found: ${command}${NC}"
      return 1
    fi

    echo -e "${GREEN}✅ Command exists${NC}"
  else
    echo -e "${YELLOW}⚠️  Install jq for better testing${NC}"
  fi

  echo ""
}

# ============================================================================
# Launch Server
# ============================================================================

launch_server() {
  local server_name="$1"

  echo -e "${CYAN}Launching ${server_name}...${NC}"

  if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is required to launch servers${NC}"
    echo "Install jq: brew install jq (macOS) or apt install jq (Linux)"
    return 1
  fi

  # Check if disabled
  local disabled=$(jq -r ".mcpServers.\"${server_name}\".disabled // false" "$MCP_CONFIG")
  if [ "$disabled" = "true" ]; then
    echo -e "${YELLOW}⚠️  Server is disabled. Enable it in ${MCP_CONFIG}${NC}"
    return 1
  fi

  # Get command and args
  local command=$(jq -r ".mcpServers.\"${server_name}\".command" "$MCP_CONFIG")
  local args=$(jq -r ".mcpServers.\"${server_name}\".args | join(\" \")" "$MCP_CONFIG")

  # Set environment variables
  local env_vars=$(jq -r ".mcpServers.\"${server_name}\".env // {} | to_entries | .[] | \"export \(.key)=\(.value)\"" "$MCP_CONFIG")
  if [ -n "$env_vars" ]; then
    eval "$env_vars"
  fi

  echo -e "${BLUE}Running: ${command} ${args}${NC}"
  echo ""

  # Launch server
  $command $args
}

# ============================================================================
# Main Menu
# ============================================================================

show_menu() {
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo -e "${MAGENTA}MCP Server Management${NC}"
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo ""
  echo "1. List all servers"
  echo "2. Check server status"
  echo "3. Test server"
  echo "4. Launch server"
  echo "5. Exit"
  echo ""
  read -p "Select option (1-5): " choice
  echo ""

  case $choice in
    1)
      list_servers
      read -p "Press Enter to continue..."
      show_menu
      ;;
    2)
      read -p "Enter server name: " server_name
      check_status "$server_name"
      read -p "Press Enter to continue..."
      show_menu
      ;;
    3)
      read -p "Enter server name: " server_name
      test_server "$server_name"
      read -p "Press Enter to continue..."
      show_menu
      ;;
    4)
      read -p "Enter server name: " server_name
      launch_server "$server_name"
      ;;
    5)
      echo -e "${GREEN}Goodbye!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option${NC}"
      show_menu
      ;;
  esac
}

# ============================================================================
# Command Line Interface
# ============================================================================

if [ $# -eq 0 ]; then
  # Interactive mode
  show_menu
else
  # Command line mode
  case "$1" in
    list)
      list_servers
      ;;
    status)
      if [ -z "$2" ]; then
        echo -e "${RED}Error: Server name required${NC}"
        echo "Usage: $0 status <server-name>"
        exit 1
      fi
      check_status "$2"
      ;;
    test)
      if [ -z "$2" ]; then
        echo -e "${RED}Error: Server name required${NC}"
        echo "Usage: $0 test <server-name>"
        exit 1
      fi
      test_server "$2"
      ;;
    launch)
      if [ -z "$2" ]; then
        echo -e "${RED}Error: Server name required${NC}"
        echo "Usage: $0 launch <server-name>"
        exit 1
      fi
      launch_server "$2"
      ;;
    *)
      echo "Usage: $0 [list|status|test|launch] [server-name]"
      echo ""
      echo "Commands:"
      echo "  list                    - List all MCP servers"
      echo "  status <server-name>    - Check server status"
      echo "  test <server-name>      - Test server configuration"
      echo "  launch <server-name>    - Launch server"
      echo ""
      echo "Run without arguments for interactive mode"
      exit 1
      ;;
  esac
fi
