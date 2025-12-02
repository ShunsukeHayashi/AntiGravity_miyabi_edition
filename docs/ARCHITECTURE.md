# AntiGravity IDE Architecture

## Overview

AntiGravity IDE is built on a modular, agent-first architecture designed for extensibility and autonomous operation.

## Core Components

### 1. Main Process (Electron)

The main process manages the application lifecycle, native OS integration, and window management.

```typescript
src/main.ts              // Entry point
src/app/                 // Application core
  ├── lifecycle.ts       // App lifecycle management
  ├── menu.ts            // Menu bar
  └── window.ts          // Window management
```

### 2. Agent System

The agent system is the heart of AntiGravity, enabling autonomous AI-driven workflows.

```typescript
src/agent/
  ├── manager.ts         // Agent orchestration
  ├── mission-control.ts // Mission Control interface
  ├── inbox.ts           // Task inbox
  ├── workspace.ts       // Workspace management
  └── types.ts           // Agent type definitions
```

### 3. Browser Sub-Agent

Chrome integration for web automation and testing.

```typescript
src/browser/
  ├── controller.ts      // Browser control
  ├── automation.ts      // Web automation
  └── scraper.ts         // Web scraping
```

### 4. Editor Core

Advanced code editing with AI assistance.

```typescript
src/editor/
  ├── core.ts            // Editor core
  ├── commands.ts        // Inline commands
  ├── suggestions.ts     // AI suggestions
  └── highlighting.ts    // Syntax highlighting
```

### 5. UI Layer

User interface components built with modern web technologies.

```typescript
src/ui/
  ├── components/        // React components
  ├── views/             // View definitions
  └── styles/            // Styling
```

## Execution Policies

AntiGravity supports three execution policies:

1. **Off**: Manual control - user confirms all actions
2. **Auto**: Balanced - AI executes routine tasks, asks for confirmation on critical operations
3. **Turbo**: Maximum automation - AI operates with minimal user intervention

## Planning Modes

1. **Planning**: Detailed step-by-step planning before execution
2. **Fast**: Quick execution with lightweight planning

## Data Flow

```
User Input
    ↓
Mission Control
    ↓
Agent Manager
    ↓
├── Code Editor Agent
├── Browser Sub-Agent
└── Testing Agent
    ↓
Execution
    ↓
Result → Inbox → User
```

## Extension System

AntiGravity supports extensions to add custom functionality:

```typescript
extensions/
  ├── api/               // Extension API
  ├── marketplace/       // Extension marketplace
  └── loader.ts          // Extension loader
```

## Security Model

- Sandboxed execution for untrusted code
- Permission system for agent actions
- Secure communication between processes

## Performance Considerations

- Lazy loading of non-critical components
- Worker threads for CPU-intensive tasks
- Efficient IPC between main and renderer processes
- Caching strategies for frequently accessed data
