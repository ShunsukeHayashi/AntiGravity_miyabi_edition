#!/bin/bash
# Miyabi Orchestra Setup Script for AntiGravity IDE
# Creates tmux session with 7 agent panes

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SESSION_NAME="antigravity-orchestra"

echo -e "${MAGENTA}🎼 Setting up AntiGravity Agent Orchestra${NC}"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
  echo -e "${RED}❌ Error: tmux is not installed${NC}"
  echo "Install tmux: brew install tmux (macOS) or apt install tmux (Linux)"
  exit 1
fi

# Check if session already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo -e "${YELLOW}⚠️  Session '$SESSION_NAME' already exists${NC}"
  read -p "Do you want to kill and recreate it? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    tmux kill-session -t "$SESSION_NAME"
    echo -e "${GREEN}✅ Old session killed${NC}"
  else
    echo -e "${BLUE}ℹ️  Attaching to existing session${NC}"
    tmux attach-session -t "$SESSION_NAME"
    exit 0
  fi
fi

# Project root
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT="$(pwd)"

echo -e "${CYAN}Project root: ${PROJECT_ROOT}${NC}"
echo ""

# ============================================================================
# Create tmux session
# ============================================================================

echo -e "${BLUE}Creating tmux session: ${SESSION_NAME}${NC}"

# Create session with first window
tmux new-session -d -s "$SESSION_NAME" -n "Conductor" -c "$PROJECT_ROOT"

# Set status bar
tmux set-option -t "$SESSION_NAME" status-style "bg=colour235,fg=colour136"
tmux set-option -t "$SESSION_NAME" status-left "#[fg=colour166,bold]🎼 AntiGravity Orchestra #[fg=colour244]| "
tmux set-option -t "$SESSION_NAME" status-right "#[fg=colour166]%Y-%m-%d %H:%M"

# ============================================================================
# Window 0: Conductor (Main Control)
# ============================================================================

tmux send-keys -t "$SESSION_NAME:0" "clear" C-m
tmux send-keys -t "$SESSION_NAME:0" "echo '🎼 Conductor - Main Control Panel'" C-m
tmux send-keys -t "$SESSION_NAME:0" "export AGENT_NAME=conductor" C-m
tmux send-keys -t "$SESSION_NAME:0" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 1: Coordinator Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:1" -n "Coordinator" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:1" "clear" C-m
tmux send-keys -t "$SESSION_NAME:1" "echo '🎯 Coordinator Agent (しきろーん)'" C-m
tmux send-keys -t "$SESSION_NAME:1" "export AGENT_NAME=coordinator" C-m
tmux send-keys -t "$SESSION_NAME:1" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 2: CodeGen Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:2" -n "CodeGen" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:2" "clear" C-m
tmux send-keys -t "$SESSION_NAME:2" "echo '💻 CodeGen Agent'" C-m
tmux send-keys -t "$SESSION_NAME:2" "export AGENT_NAME=codegen" C-m
tmux send-keys -t "$SESSION_NAME:2" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 3: Review Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:3" -n "Review" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:3" "clear" C-m
tmux send-keys -t "$SESSION_NAME:3" "echo '🔍 Review Agent'" C-m
tmux send-keys -t "$SESSION_NAME:3" "export AGENT_NAME=review" C-m
tmux send-keys -t "$SESSION_NAME:3" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 4: Issue Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:4" -n "Issue" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:4" "clear" C-m
tmux send-keys -t "$SESSION_NAME:4" "echo '📝 Issue Agent'" C-m
tmux send-keys -t "$SESSION_NAME:4" "export AGENT_NAME=issue" C-m
tmux send-keys -t "$SESSION_NAME:4" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 5: PR Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:5" -n "PR" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:5" "clear" C-m
tmux send-keys -t "$SESSION_NAME:5" "echo '🔀 PR Agent'" C-m
tmux send-keys -t "$SESSION_NAME:5" "export AGENT_NAME=pr" C-m
tmux send-keys -t "$SESSION_NAME:5" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 6: Deployment Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:6" -n "Deploy" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:6" "clear" C-m
tmux send-keys -t "$SESSION_NAME:6" "echo '🚀 Deployment Agent'" C-m
tmux send-keys -t "$SESSION_NAME:6" "export AGENT_NAME=deployment" C-m
tmux send-keys -t "$SESSION_NAME:6" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 7: Test Agent
# ============================================================================

tmux new-window -t "$SESSION_NAME:7" -n "Test" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:7" "clear" C-m
tmux send-keys -t "$SESSION_NAME:7" "echo '🧪 Test Agent'" C-m
tmux send-keys -t "$SESSION_NAME:7" "export AGENT_NAME=test" C-m
tmux send-keys -t "$SESSION_NAME:7" "source scripts/miyabi-init.sh" C-m

# ============================================================================
# Window 8: IDE Core (Frontend)
# ============================================================================

tmux new-window -t "$SESSION_NAME:8" -n "IDE-Core" -c "$PROJECT_ROOT/ide-core"
tmux send-keys -t "$SESSION_NAME:8" "clear" C-m
tmux send-keys -t "$SESSION_NAME:8" "echo '🌐 IDE Core (Next.js Frontend)'" C-m
tmux send-keys -t "$SESSION_NAME:8" "# npm run dev" C-m

# ============================================================================
# Window 9: Agent Service (Backend)
# ============================================================================

tmux new-window -t "$SESSION_NAME:9" -n "Service" -c "$PROJECT_ROOT/agent-service"
tmux send-keys -t "$SESSION_NAME:9" "clear" C-m
tmux send-keys -t "$SESSION_NAME:9" "echo '🔧 Agent Service (WebSocket Backend)'" C-m
tmux send-keys -t "$SESSION_NAME:9" "# node server.js" C-m

# ============================================================================
# Select first window and attach
# ============================================================================

tmux select-window -t "$SESSION_NAME:0"

echo ""
echo -e "${GREEN}✅ Orchestra setup complete!${NC}"
echo ""
echo -e "${CYAN}Tmux Windows:${NC}"
echo "  0: Conductor   - Main control panel"
echo "  1: Coordinator - Task orchestration"
echo "  2: CodeGen     - Code generation"
echo "  3: Review      - Code review"
echo "  4: Issue       - Issue analysis"
echo "  5: PR          - Pull requests"
echo "  6: Deploy      - Deployment"
echo "  7: Test        - Testing"
echo "  8: IDE-Core    - Frontend (Next.js)"
echo "  9: Service     - Backend (WebSocket)"
echo ""
echo -e "${YELLOW}Navigation:${NC}"
echo "  Ctrl+b 0-9  - Switch between windows"
echo "  Ctrl+b d    - Detach session"
echo "  Ctrl+b [    - Scroll mode (q to exit)"
echo ""
echo -e "${BLUE}Attaching to session...${NC}"
echo ""

# Attach to session
tmux attach-session -t "$SESSION_NAME"
