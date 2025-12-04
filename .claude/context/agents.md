# Miyabi Agent System

## 🌸 Overview

AntiGravity IDE uses the **Miyabi Framework** - an autonomous AI development orchestration system with 21 specialized agents working in concert.

**Miyabi** (雅) means "elegance" or "refinement" in Japanese, reflecting the system's goal of achieving beautiful, autonomous development.

## 🎯 Agent Architecture

### Two Agent Categories

1. **Coding Agents (7)** - Direct software development
2. **Business Agents (14)** - Business strategy and operations

### Core Principle: Shikigaku Theory (識学理論)

Based on 5 organizational principles:
1. **Responsibility Clarity** - Each agent owns specific tasks
2. **Authority Delegation** - Agents make autonomous decisions
3. **Hierarchical Design** - Coordinator → Specialized agents
4. **Result Evaluation** - Quality scores, coverage, execution time
5. **Ambiguity Elimination** - DAG dependencies, state labels

## 💻 Coding Agents (7)

### 1. Coordinator Agent (しきろーん) 🎯

**Role**: Task orchestration and parallel execution control

**Capabilities**:
- DAG (Directed Acyclic Graph) task decomposition
- Critical path detection
- Parallel execution planning
- Agent coordination

**Triggers**:
- `issue_created`
- `issue_labeled`

**Priority**: 10 (highest)

**Example Workflow**:
```yaml
Issue #123 created
  ↓
Coordinator analyzes task
  ↓
Creates DAG: [codegen → review → test] || [docs]
  ↓
Assigns agents and monitors progress
```

---

### 2. CodeGen Agent 💻

**Role**: AI-driven code generation

**Capabilities**:
- TypeScript code generation (strict mode)
- Test generation (Jest)
- Documentation generation
- Code refactoring

**Model**: Claude Sonnet 4

**Triggers**:
- `issue_assigned`
- `state:implementing`

**Priority**: 8

**Example**:
```typescript
// CodeGen Agent generates:
export class AgentManager {
  private agents: Map<string, Agent>;

  async executeAgent(name: string): Promise<Result> {
    // Implementation with error handling
  }
}

// + Jest tests
// + JSDoc documentation
```

---

### 3. Review Agent 🔍

**Role**: Code quality assessment

**Capabilities**:
- Static analysis (ESLint, TypeScript compiler)
- Security scanning
- Quality scoring (0-100)
- Best practices check

**Quality Threshold**: 80 points

**Triggers**:
- `pull_request_opened`
- `state:reviewing`

**Priority**: 9

**Scoring System**:
- Code Style: 20 points
- Type Safety: 20 points
- Security: 20 points
- Performance: 20 points
- Maintainability: 20 points

---

### 4. Issue Agent 📝

**Role**: Issue analysis and labeling

**Capabilities**:
- Issue classification
- Complexity estimation (small/medium/large/xlarge)
- Priority assignment (P0-P3)
- Automatic labeling (65-label system)

**Triggers**:
- `issue_created`
- `issue_updated`

**Priority**: 10

**Label Categories**:
- `type:*` - bug, feature, refactor, docs, test, chore, security
- `priority:*` - P0-Critical, P1-High, P2-Medium, P3-Low
- `state:*` - pending, analyzing, implementing, reviewing, testing, deploying, done
- `agent:*` - coordinator, codegen, review, issue, pr, deployment, test
- `complexity:*` - small (1-4h), medium (4-8h), large (1-3d), xlarge (3-7d)

---

### 5. PR Agent 🔀

**Role**: Pull request automation

**Capabilities**:
- PR creation (draft mode)
- Commit message generation (Conventional Commits)
- Description generation
- PR management

**Triggers**:
- `state:done`
- `review_approved`

**Priority**: 7

**Commit Format**:
```
feat(agent): add Coordinator DAG generation

- Implement task dependency analysis
- Add critical path detection
- Support parallel execution

Closes #123
```

---

### 6. Deployment Agent 🚀

**Role**: CI/CD automation

**Capabilities**:
- Auto deployment (Electron builds)
- Health checks
- Auto rollback on failure
- Release management

**Triggers**:
- `pull_request_merged`
- `tag_created`

**Priority**: 6

**Deployment Flow**:
```
PR merged → Build → Test → Deploy → Health Check → Done
                                  ↓ (if failure)
                              Rollback
```

---

### 7. Test Agent 🧪

**Role**: Automated testing

**Capabilities**:
- Unit testing (Jest)
- Integration testing
- Coverage reporting
- Test generation

**Coverage Target**: 80%+

**Triggers**:
- `state:testing`
- `pull_request_opened`

**Priority**: 8

---

## 💼 Business Agents (14)

### Strategy & Planning (4 agents)

1. **Entrepreneur Agent** 💡 - Business plan creation
2. **Self Analysis Agent** 🔬 - Skill and career assessment
3. **Market Research Agent** 📊 - Market trends and competitor analysis
4. **Persona Agent** 👥 - Customer persona creation (3-5 personas)

### Product Development (2 agents)

5. **Product Concept Agent** 🎨 - USP, revenue model, business canvas
6. **Product Design Agent** 🏗️ - 6-month roadmap, tech stack, MVP

### Content & Marketing (3 agents)

7. **Content Creation Agent** 📝 - Video, article, tutorial production
8. **SNS Strategy Agent** 📱 - Twitter/Instagram/YouTube strategy
9. **YouTube Agent** 🎬 - Channel optimization (13 workflows)

### Sales & Customer Success (3 agents)

10. **Funnel Design Agent** 🎯 - Awareness → Purchase → LTV optimization
11. **Marketing Agent** 📢 - Advertising, SEO, growth hacking
12. **Sales Agent** 💼 - Lead → Customer conversion

### Operations (2 agents)

13. **CRM Agent** 🤝 - Customer satisfaction, churn reduction
14. **Analytics Agent** 📈 - Data analysis, PDCA cycle, KPI tracking

## 🔄 Agent Workflows

### Full Automation Workflow

```yaml
1. Issue Created
   ↓ Issue Agent
2. Analyze & Label
   ↓ Coordinator Agent
3. Create Execution Plan (DAG)
   ↓ CodeGen Agent
4. Implement Code
   ↓ Review Agent
5. Quality Check (≥80 points)
   ↓ Test Agent
6. Run Tests (≥80% coverage)
   ↓ PR Agent
7. Create Pull Request
   ↓ Deployment Agent
8. Deploy (if main branch)
```

### Business Launch Workflow

```yaml
1. Self Analysis
   ↓
2. Market Research
   ↓
3. Create Personas
   ↓
4. Design Product Concept
   ↓
5. Create MVP Plan
   ↓
6. Marketing Strategy
   ↓
7. Design Sales Funnel
```

### Content Production Workflow

```yaml
1. Plan Content
   ↓
2. Create SNS Calendar
   ↓
3. Optimize YouTube Channel
   ↓
4. Track Performance
```

## 🎼 Agent Orchestra

### tmux-based Multi-Agent System

Agents run in separate tmux windows for isolation and monitoring:

```bash
# Start orchestra
./scripts/setup-orchestra.sh

# Windows created:
# 0: Conductor     - Main control
# 1: Coordinator   - Task orchestration
# 2: CodeGen       - Code generation
# 3: Review        - Code review
# 4: Issue         - Issue management
# 5: PR            - Pull requests
# 6: Deploy        - Deployment
# 7: Test          - Testing
# 8: IDE-Core      - Frontend (Next.js)
# 9: Service       - Backend (WebSocket)
```

### Agent Communication

**Protocol**: tmux send-keys (sync) + message files (async)

**Channels**:
- `main` - Broadcast to all agents
- `coding` - Coordinator, CodeGen, Review, Test
- `business` - Business agents only

**Message Format**:
```json
{
  "from": "coordinator",
  "to": "codegen",
  "action": "implement",
  "issue": 123,
  "dag": { ... },
  "timestamp": "2025-12-02T16:00:00Z"
}
```

## 🔧 Agent Configuration

### Configuration Files

- **`.miyabi/config.yml`** - Global Miyabi settings
- **`.miyabi/agents.yml`** - All 21 agent definitions
- **`.agent/agents/*.md`** - Individual agent specifications

### Agent Permissions

```yaml
coordinator:
  - read_all
  - write_all
  - execute_agents
  - manage_workflow

codegen:
  - read_code
  - write_code
  - run_tests

review:
  - read_code
  - write_comments
  - approve_pr
  - reject_pr
```

## 📊 Agent Metrics

### Tracked Metrics

- Execution time
- Success rate
- Quality score
- Error count
- Coverage percentage

### Performance Targets

| Agent | Target | Metric |
|-------|--------|--------|
| CodeGen | < 5 min | Execution time |
| Review | ≥ 80 | Quality score |
| Test | ≥ 80% | Coverage |
| PR | < 1 min | Creation time |
| Deploy | < 10 min | Deployment time |

## 🚨 Error Handling

### Escalation Chain

```
Agent Error
  ↓
Retry (max 3 times)
  ↓ (if still failing)
Escalate to Coordinator
  ↓
Coordinator creates Issue
  ↓
Human intervention
```

### Alert Conditions

- Execution failure (3+ times)
- Quality score < 60
- Timeout (> 30 minutes)
- Security vulnerability detected

## 💡 Usage Examples

### Switching Agents

```bash
# In tmux session
source scripts/miyabi-init.sh
ag-agent-switch coordinator

# Or set environment variable
export AGENT_NAME=codegen
```

### Running Specific Agent

```bash
# Via Claude Code slash command
/agent-run

# Via CLI (when implemented)
miyabi run --agent codegen --issue 123
```

### Monitoring Agents

```bash
# View agent status
ag-miyabi-status

# View agent logs (when implemented)
tail -f .miyabi/logs/coordinator.log
```

## 🔗 Related Documentation

- **`development.md`** - Development guidelines for agent implementation
- **`mcp.md`** - MCP server integration for agents
- **`../.miyabi/agents.yml`** - Complete agent definitions
- **`../../CLAUDE.md`** - Main project context

---

**Last Updated**: 2025-12-02
**Agent Count**: 21 (7 coding + 14 business)
**Framework Version**: Miyabi 1.0.0
