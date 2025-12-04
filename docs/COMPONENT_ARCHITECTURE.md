# Component Architecture

## 概要

AntiGravity IDEのReactコンポーネント設計。

## 技術スタック

- **React** 18.x
- **TypeScript** 5.x
- **Tailwind CSS** 3.x
- **Zustand** (状態管理)
- **React Query** (データフェッチング)
- **Framer Motion** (アニメーション)

## ディレクトリ構造

```
src/ui/
├── components/          # 再利用可能コンポーネント
│   ├── atoms/          # 最小単位
│   │   ├── Button/
│   │   ├── Icon/
│   │   ├── Badge/
│   │   └── Input/
│   ├── molecules/      # 組み合わせ
│   │   ├── AgentCard/
│   │   ├── TaskItem/
│   │   └── Notification/
│   └── organisms/      # 複雑な組み合わせ
│       ├── AgentPanel/
│       ├── TaskList/
│       └── CodeEditor/
├── layouts/            # レイアウトコンポーネント
│   ├── MainLayout/
│   ├── Sidebar/
│   └── Inspector/
├── views/              # ページコンポーネント
│   ├── Dashboard/
│   ├── Inbox/
│   ├── AgentManager/
│   └── TaskView/
├── hooks/              # カスタムフック
│   ├── useAgent.ts
│   ├── useTask.ts
│   └── useWebSocket.ts
├── stores/             # Zustand stores
│   ├── agentStore.ts
│   ├── taskStore.ts
│   └── uiStore.ts
├── styles/             # グローバルスタイル
│   ├── globals.css
│   └── tailwind.config.js
└── utils/              # ユーティリティ
    ├── cn.ts           # classname utility
    └── format.ts       # formatters
```

## コンポーネント階層

```
App
├── MainLayout
│   ├── MissionControlBar
│   │   ├── Logo
│   │   ├── ExecutionPolicyToggle
│   │   ├── PlanningModeToggle
│   │   ├── NotificationCenter
│   │   └── SettingsButton
│   ├── Sidebar
│   │   ├── NavigationItem (Home)
│   │   ├── NavigationItem (Inbox)
│   │   ├── NavigationItem (Agents)
│   │   ├── NavigationItem (Tasks)
│   │   ├── NavigationItem (Files)
│   │   └── NavigationItem (Search)
│   ├── MainView
│   │   ├── TabBar
│   │   └── ContentArea
│   │       ├── EditorView
│   │       ├── BrowserView
│   │       ├── ArtifactView
│   │       └── TaskListView
│   ├── Inspector
│   │   ├── AgentStatusPanel
│   │   ├── TaskInfoPanel
│   │   ├── ChangesPanel
│   │   └── CommentsPanel
│   ├── AgentPanel
│   │   ├── ProgressTab
│   │   ├── LogsTab
│   │   ├── TerminalTab
│   │   └── BrowserTab
│   └── StatusBar
│       ├── AgentActivity
│       ├── ResourceUsage
│       └── SyncStatus
└── Modals
    ├── TaskCreateModal
    ├── ApprovalModal
    └── SettingsModal
```

## 主要コンポーネント詳細

### 1. MissionControlBar

**Props**:
```typescript
interface MissionControlBarProps {
  executionPolicy: ExecutionPolicy;
  planningMode: PlanningMode;
  onPolicyChange: (policy: ExecutionPolicy) => void;
  onModeChange: (mode: PlanningMode) => void;
  notifications: Notification[];
}
```

**State**:
- 実行ポリシー
- プランニングモード
- 通知数

**Actions**:
- ポリシー切り替え
- モード切り替え
- 通知表示

### 2. Sidebar

**Props**:
```typescript
interface SidebarProps {
  currentRoute: string;
  inboxCount: number;
  onNavigate: (route: string) => void;
}
```

**State**:
- 選択中のルート
- 各セクションのバッジ数

### 3. AgentPanel

**Props**:
```typescript
interface AgentPanelProps {
  agents: AgentStatus[];
  currentTask?: Task;
  logs: LogEntry[];
}
```

**State**:
- アクティブタブ
- エージェント実行状態
- ログバッファ

### 4. Inspector

**Props**:
```typescript
interface InspectorProps {
  activeAgent?: AgentStatus;
  currentTask?: Task;
  changes: FileChange[];
  comments: Comment[];
}
```

**State**:
- 展開パネル
- フィルタ設定

## 状態管理

### Zustand Stores

#### agentStore

```typescript
interface AgentStore {
  agents: Map<AgentType, AgentStatus>;
  activeAgent: AgentType | null;

  // Actions
  updateAgentStatus: (type: AgentType, status: Partial<AgentStatus>) => void;
  setActiveAgent: (type: AgentType | null) => void;
  initializeAgents: () => Promise<void>;
}
```

#### taskStore

```typescript
interface TaskStore {
  tasks: Map<string, Task>;
  activeTasks: string[];
  completedTasks: string[];

  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  fetchTasks: () => Promise<void>;
}
```

#### uiStore

```typescript
interface UiStore {
  sidebarOpen: boolean;
  inspectorOpen: boolean;
  agentPanelOpen: boolean;
  theme: 'light' | 'dark';

  // Actions
  toggleSidebar: () => void;
  toggleInspector: () => void;
  toggleAgentPanel: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

## カスタムフック

### useAgent

```typescript
function useAgent(type: AgentType) {
  const agent = useAgentStore((state) => state.agents.get(type));
  const updateStatus = useAgentStore((state) => state.updateAgentStatus);

  const execute = useCallback(async (task: Task) => {
    // Agent execution logic
  }, [type]);

  return { agent, execute };
}
```

### useTask

```typescript
function useTask(taskId: string) {
  const task = useTaskStore((state) => state.tasks.get(taskId));
  const updateTask = useTaskStore((state) => state.updateTask);

  return { task, updateTask };
}
```

### useWebSocket

```typescript
function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // WebSocket connection logic

  return { connected, messages, send };
}
```

## スタイリング戦略

### Tailwind CSS設定

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        miyabi: {
          pink: {
            50: '#fdf2f8',
            500: '#ec4899',
            700: '#be185d',
          },
        },
        agent: {
          idle: '#6b7280',
          running: '#3b82f6',
          success: '#10b981',
          error: '#ef4444',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### コンポーネントスタイル例

```typescript
// components/atoms/Button/Button.tsx
const buttonVariants = {
  primary: 'bg-miyabi-pink-500 hover:bg-miyabi-pink-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

## データフロー

### Agent実行フロー

```
User Action
    ↓
UI Component
    ↓
Zustand Store (updateAgentStatus)
    ↓
IPC Communication (to Main Process)
    ↓
Agent Execution (src/agent/)
    ↓
WebSocket / IPC Response
    ↓
Zustand Store Update
    ↓
UI Re-render
```

### タスク作成フロー

```
User: Click "New Task"
    ↓
UI: Show TaskCreateModal
    ↓
User: Fill form & Submit
    ↓
Store: addTask()
    ↓
IPC: Send to IssueAgent
    ↓
Agent: Analyze & Label
    ↓
WebSocket: Status updates
    ↓
UI: Update task status
```

## パフォーマンス最適化

### 1. コード分割

```typescript
// Lazy loading
const Dashboard = lazy(() => import('./views/Dashboard'));
const Inbox = lazy(() => import('./views/Inbox'));
const AgentManager = lazy(() => import('./views/AgentManager'));
```

### 2. メモ化

```typescript
// React.memo for expensive components
export const AgentCard = memo(({ agent }: AgentCardProps) => {
  // Component logic
});

// useMemo for expensive calculations
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => a.priority.localeCompare(b.priority));
}, [tasks]);
```

### 3. 仮想化

```typescript
// react-window for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <TaskItem task={tasks[index]} style={style} />
  )}
</FixedSizeList>
```

## テスト戦略

### ユニットテスト

```typescript
// components/atoms/Button/Button.test.tsx
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### インテグレーションテスト

```typescript
// views/Dashboard/Dashboard.integration.test.tsx
describe('Dashboard Integration', () => {
  it('displays agent status correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('CoordinatorAgent')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});
```

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
