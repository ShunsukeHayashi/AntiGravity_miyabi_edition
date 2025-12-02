# AntiGravity IDE - Architecture Diagrams

This directory contains PlantUML diagrams documenting the AntiGravity IDE architecture.

## Diagrams

### 1. System Architecture (`system-architecture.puml`)

**Component diagram** showing the overall system structure:
- Main Process (Electron)
- Renderer Process (UI + Editor)
- Agent Management Layer
- Agent Workers (Code Gen, Testing, Deploy, etc.)
- Browser Sub-Agent
- External integrations

**View online**: [System Architecture](./system-architecture.puml)

### 2. Agent Communication (`agent-communication.puml`)

**Sequence diagram** illustrating how agents communicate:
- Task request flow
- Inter-agent messaging via Message Bus
- Parallel task execution
- Status updates to Mission Control
- Task completion workflow

**View online**: [Agent Communication](./agent-communication.puml)

### 3. Agent Classes (`agent-classes.puml`)

**Class diagram** detailing the agent system design:
- Core `Agent` interface
- Concrete agent implementations (CodeGenerationAgent, TestingAgent, etc.)
- Agent management classes (AgentManager, AgentPool, AgentMessageBus)
- Task and message structures
- Relationships and dependencies

**View online**: [Agent Classes](./agent-classes.puml)

### 4. Deployment Architecture (`deployment.puml`)

**Deployment diagram** showing how AntiGravity is deployed:
- User's local machine (main deployment)
- Optional cloud services (LLM APIs, Agent Marketplace)
- Third-party integrations (GitHub, CI/CD, Cloud platforms)
- Network connections and data flow

**View online**: [Deployment Architecture](./deployment.puml)

### 5. Development Workflow (`workflow.puml`)

**Activity diagram** depicting the development workflow:
- Developer input → Mission Control → Planning Agent
- Task decomposition and parallel execution
- Agent collaboration (Code Gen → Testing → Review → Deployment)
- Execution policy handling (Off/Auto/Turbo)
- Approval gates and feedback loops

**View online**: [Development Workflow](./workflow.puml)

### 6. Mission Control UI (`mission-control.puml`)

**Component diagram** showing Mission Control dashboard:
- Header controls (Policy selector, Planning mode)
- Agent Status Grid (real-time monitoring)
- Task Inbox (pending/in-progress/completed)
- Activity Log (live event stream)
- Resource Monitor (system health)
- Sidebar (workspace switcher, quick actions)

**View online**: [Mission Control UI](./mission-control.puml)

---

## How to View Diagrams

### Option 1: VS Code (Recommended)

1. Install the **PlantUML** extension
2. Install **Graphviz** (required):
   ```bash
   # macOS
   brew install graphviz

   # Ubuntu
   sudo apt-get install graphviz

   # Windows
   choco install graphviz
   ```
3. Open any `.puml` file
4. Press `Alt+D` (or `Option+D` on Mac) to preview

### Option 2: Online Viewer

Visit [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/) and paste the diagram code.

### Option 3: Command Line

```bash
# Install PlantUML
brew install plantuml  # macOS
# or download from https://plantuml.com/download

# Generate PNG
plantuml system-architecture.puml

# Generate SVG (scalable)
plantuml -tsvg system-architecture.puml
```

### Option 4: Export to PNG/SVG

In VS Code with PlantUML extension:
1. Open `.puml` file
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
3. Type "PlantUML: Export Current Diagram"
4. Choose format (PNG, SVG, PDF)

---

## Diagram Conventions

### Colors

- **Blue** (`#E3F2FD`): Main Process components
- **Yellow** (`#FFF9C4`): Renderer Process / UI components
- **Green** (`#C8E6C9`): Agent Workers
- **Orange** (`#FFCCBC`): Browser Sub-Agent
- **Purple** (`#F3E5F5`): External services

### Arrows

- **Solid arrows** (→): Direct communication / control flow
- **Dashed arrows** (⇢): Optional / conditional connections
- **Bold arrows**: Critical path / primary flow

### Stereotypes

- `<<Main>>`: Main process components
- `<<Renderer>>`: Renderer process components
- `<<Agent>>`: Agent workers
- `<<Browser>>`: Browser-related components
- `<<External>>`: External integrations

---

## Updating Diagrams

When updating the architecture:

1. **Update the diagram** in the relevant `.puml` file
2. **Regenerate images** (if PNG/SVG versions are tracked)
3. **Update this README** if new diagrams are added
4. **Commit changes**:
   ```bash
   git add docs/diagrams/
   git commit -m "docs(diagrams): update [diagram-name]"
   ```

---

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md)
- [Technical Details](../TECHNICAL_DETAILS.md)
- [VS Code Comparison](../VSCODE_VS_ANTIGRAVITY.md)

---

**Last Updated**: December 2, 2025
**Author**: Shunsuke Hayashi

Copyright (c) 2025 Shunsuke Hayashi. All rights reserved.
