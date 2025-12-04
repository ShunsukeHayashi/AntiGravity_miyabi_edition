# Agent Documentation

AntiGravity IDE features a multi-agent system based on the Miyabi framework.

## Overview

The agent system follows **Shikigaku (identification science) principles**:

1. **Responsibility Clarity** - Each agent owns specific tasks
2. **Authority Delegation** - Agents make autonomous decisions
3. **Hierarchy Design** - CoordinatorAgent leads specialized agents
4. **Result Evaluation** - Quality scores, coverage, execution time
5. **Ambiguity Elimination** - DAG dependencies, state labels

## Agent Architecture

```
                    ┌─────────────────┐
                    │  Coordinator    │
                    │     Agent       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐
   │ CodeGen │         │   Review  │        │   Test  │
   │  Agent  │         │   Agent   │        │  Agent  │
   └─────────┘         └───────────┘        └─────────┘
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐
   │  Issue  │         │    PR     │        │ Deploy  │
   │  Agent  │         │   Agent   │        │  Agent  │
   └─────────┘         └───────────┘        └─────────┘
```

## Core Agents (7)

### 1. CoordinatorAgent

**Role:** Task orchestration and parallel execution control

**Capabilities:**
- DAG (Directed Acyclic Graph) task decomposition
- Critical path identification
- Parallel execution optimization
- Resource allocation

**Implementation:** `src/agent/coordinator/`

**Example Workflow:**
```
Issue #123 "Add user authentication"
    │
    ├─► Parse requirements
    ├─► Create DAG
    │     ├─ [1] Design schema (IssueAgent)
    │     ├─ [2] Generate code (CodeGenAgent) - depends on [1]
    │     ├─ [3] Write tests (TestAgent) - depends on [2]
    │     └─ [4] Review code (ReviewAgent) - depends on [2,3]
    └─► Execute with parallelization where possible
```

### 2. CodeGenAgent

**Role:** AI-driven code generation

**Capabilities:**
- Claude Sonnet 4 powered generation
- TypeScript strict mode compliance
- Pattern-aware code synthesis
- Test generation

**Implementation:** `src/agent/codegen/codegen.ts`

**Configuration:**
```yaml
ai:
  model: claude-sonnet-4
  temperature: 0.1
  max_tokens: 4096
```

### 3. ReviewAgent

**Role:** Code quality assessment

**Capabilities:**
- Static analysis (ESLint, TypeScript)
- Security scanning
- Code smell detection
- Quality scoring (100-point scale)

**Implementation:** `src/agent/review/review.ts`

**Quality Thresholds:**
- Pass: 80+ points
- Warning: 60-79 points
- Fail: <60 points

### 4. IssueAgent

**Role:** Issue analysis and classification

**Capabilities:**
- 65-label classification system
- Complexity estimation (S/M/L/XL)
- Automatic labeling
- Priority inference

**Implementation:** `src/agent/issue/issue.ts`

**Label Categories:**
```
type:      bug, feature, refactor, docs, test, chore, security
priority:  P0-Critical, P1-High, P2-Medium, P3-Low
state:     pending, analyzing, implementing, reviewing, testing, done
agent:     codegen, review, deployment, test, coordinator, issue, pr
complexity: small, medium, large, xlarge
phase:     planning, design, implementation, testing, deployment
impact:    breaking, major, minor, patch
category:  frontend, backend, infra, dx, security
effort:    1h, 4h, 1d, 3d, 1w, 2w
blocked:   waiting-review, waiting-deployment, waiting-feedback
```

### 5. PRAgent

**Role:** Pull Request automation

**Capabilities:**
- Conventional Commits compliance
- Draft PR generation
- Change summarization
- Reviewer assignment

**Implementation:** `src/agent/pr/pr.ts`

**PR Format:**
```markdown
## Summary
- [bullet points of changes]

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification

Generated with [Claude Code](https://claude.com/claude-code)
```

### 6. DeploymentAgent

**Role:** CI/CD automation

**Capabilities:**
- Auto-deployment on merge
- Health checks
- Auto-rollback on failure
- Environment management

**Implementation:** `src/agent/deployment/deployment.ts`

**Deployment Stages:**
1. Pre-deploy validation
2. Build & package
3. Deploy to staging
4. Health check
5. Promote to production
6. Post-deploy verification

### 7. TestAgent

**Role:** Test execution and coverage

**Capabilities:**
- Test suite execution
- Coverage reporting
- Flaky test detection
- Performance benchmarks

**Implementation:** `src/agent/test/test.ts`

**Coverage Target:** 80%+

## Communication Protocol

Agents communicate via the MessageBus using pub/sub messaging:

```typescript
interface AgentMessage {
  id: string;
  from: string;
  to: string | 'broadcast';
  type: MessageType;
  payload: Record<string, unknown>;
  timestamp: number;
}

type MessageType =
  | 'TASK_REQUEST'
  | 'TASK_COMPLETE'
  | 'ERROR'
  | 'STATUS_UPDATE'
  | 'CONTEXT_UPDATE';
```

**Example Communication:**

```
[Orchestrator] → [CodeGenAgent] TASK_REQUEST
{
  taskId: "abc123",
  description: "Implement user login",
  priority: "high",
  context: { files: [...], requirements: [...] }
}

[CodeGenAgent] → [Orchestrator] TASK_COMPLETE
{
  taskId: "abc123",
  result: { filesCreated: ["src/auth/login.ts"], linesAdded: 150 }
}
```

## Task Queue

Tasks are managed in a priority queue with dependency tracking:

```typescript
interface Task {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  dependencies: string[];
  assignedAgent?: AgentType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: number;
}
```

**Priority Weights:**
- Critical: 1000
- High: 100
- Normal: 10
- Low: 1

## Agent Orchestrator

The `AgentOrchestrator` class manages the agent lifecycle:

```typescript
const orchestrator = new AgentOrchestrator({
  autoStart: true,
  defaultAgents: ['coordinator'],
  taskTimeout: 300000,  // 5 minutes
  maxRetries: 3
});

// Initialize
await orchestrator.initialize(messageBus);

// Execute task
const taskId = await orchestrator.executeTask(
  "Implement feature X",
  "codegen"  // optional: specific agent
);

// Get status
const status = orchestrator.getStatus();
```

## Business Agents (14)

In addition to the 7 core coding agents, Miyabi supports 14 business agents:

| Agent | Purpose |
|-------|---------|
| EntrepreneurAgent | Business strategy |
| SelfAnalysisAgent | SWOT analysis |
| MarketResearchAgent | Market analysis |
| PersonaAgent | Customer personas |
| ProductConceptAgent | Product ideation |
| ProductDesignAgent | UX/UI design |
| ContentCreationAgent | Content generation |
| FunnelDesignAgent | Sales funnel |
| SNSStrategyAgent | Social media |
| MarketingAgent | Marketing campaigns |
| SalesAgent | Sales automation |
| CRMAgent | Customer relations |
| AnalyticsAgent | Data analysis |
| YouTubeAgent | Video content |

See `.miyabi/agents.yml` for full configuration.

## Extending Agents

### Creating a Custom Agent

1. Create agent file in `src/agent/<name>/`:

```typescript
// src/agent/custom/custom.ts
import { BaseAgent, AgentConfig } from '../base';

export class CustomAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super('custom', config);
  }

  async execute(task: Task): Promise<TaskResult> {
    // Implementation
    return { success: true, output: {...} };
  }
}
```

2. Register in orchestrator:

```typescript
// src/orchestrator/agent-orchestrator.ts
const agentTypes: AgentType[] = [
  'coordinator',
  'codegen',
  // ...
  'custom'  // Add new agent
];
```

3. Update configuration:

```yaml
# .miyabi/agents.yml
custom:
  enabled: true
  config:
    timeout: 60000
```

## Monitoring

### Agent Status

```typescript
const status = orchestrator.getStatus();
// {
//   initialized: true,
//   agents: [
//     { type: 'coordinator', status: 'running', completedTasks: 5 },
//     { type: 'codegen', status: 'running', currentTask: 'task-123' },
//     ...
//   ],
//   taskQueue: { pending: 3, running: 1, completed: 10 }
// }
```

### CLI Commands

```bash
# Check status via Claude Code
/miyabi-status

# View agent logs
./scripts/miyabi-init.sh
ag-miyabi-status
```

## Best Practices

1. **Task Granularity** - Keep tasks focused and measurable
2. **Clear Dependencies** - Define explicit task dependencies
3. **Timeout Handling** - Set appropriate timeouts per agent
4. **Error Recovery** - Implement retry logic for transient failures
5. **Logging** - Log all agent actions for debugging

## Resources

- [Orchestrator Source](../src/orchestrator/)
- [Agent Implementations](../src/agent/)
- [Miyabi Configuration](../.miyabi/)
- [Message Bus](../src/orchestrator/message-bus.ts)
- [Task Queue](../src/orchestrator/task-queue.ts)
