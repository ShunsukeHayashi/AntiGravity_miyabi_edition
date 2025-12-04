/**
 * Task Queue for Agent Task Management
 * Priority-based task queue with dependency tracking
 */

export type TaskPriority = 'critical' | 'high' | 'normal' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface Task {
  id: string;
  description: string;
  priority: TaskPriority;
  dependencies: string[];
  assignedAgent?: string;
  status: TaskStatus;
  createdAt?: number;
  startedAt?: number;
  completedAt?: number;
  result?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  result?: unknown;
  error?: string;
  duration: number;
}

/**
 * Priority-based Task Queue with dependency management
 */
export class TaskQueue {
  private queue: Task[];
  private completedTasks: Map<string, TaskResult>;
  private maxCompletedHistory: number;

  constructor(maxCompletedHistory = 100) {
    this.queue = [];
    this.completedTasks = new Map();
    this.maxCompletedHistory = maxCompletedHistory;
  }

  /**
   * Get priority value for sorting
   */
  private priorityValue(priority: TaskPriority): number {
    const values: Record<TaskPriority, number> = {
      critical: 4,
      high: 3,
      normal: 2,
      low: 1,
    };
    return values[priority];
  }

  /**
   * Check if all dependencies are satisfied
   */
  private dependenciesSatisfied(task: Task): boolean {
    return task.dependencies.every((depId) => {
      const result = this.completedTasks.get(depId);
      return result?.success === true;
    });
  }

  /**
   * Enqueue a new task
   */
  enqueue(task: Task): void {
    const taskWithTimestamp: Task = {
      ...task,
      createdAt: task.createdAt || Date.now(),
    };

    this.queue.push(taskWithTimestamp);
    this.sortQueue();
  }

  /**
   * Sort queue by priority
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff = this.priorityValue(b.priority) - this.priorityValue(a.priority);
      if (priorityDiff !== 0) return priorityDiff;

      // Then by creation time (older first)
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  }

  /**
   * Dequeue the highest priority task with satisfied dependencies
   */
  dequeue(): Task | undefined {
    const index = this.queue.findIndex(
      (task) =>
        task.status === 'pending' && this.dependenciesSatisfied(task)
    );

    if (index !== -1) {
      const task = this.queue[index];
      task.status = 'in_progress';
      task.startedAt = Date.now();
      return task;
    }

    return undefined;
  }

  /**
   * Dequeue tasks for a specific agent
   */
  dequeueForAgent(agentType: string): Task | undefined {
    const index = this.queue.findIndex(
      (task) =>
        task.status === 'pending' &&
        task.assignedAgent === agentType &&
        this.dependenciesSatisfied(task)
    );

    if (index !== -1) {
      const task = this.queue[index];
      task.status = 'in_progress';
      task.startedAt = Date.now();
      return task;
    }

    return undefined;
  }

  /**
   * Mark a task as completed
   */
  complete(taskId: string, result?: unknown): void {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = Date.now();
      task.result = result;

      const taskResult: TaskResult = {
        taskId,
        success: true,
        result,
        duration: task.completedAt - (task.startedAt || task.createdAt || 0),
      };

      this.addToCompletedHistory(taskResult);
      this.removeFromQueue(taskId);
    }
  }

  /**
   * Mark a task as failed
   */
  fail(taskId: string, error: string): void {
    const task = this.queue.find((t) => t.id === taskId);
    if (task) {
      task.status = 'failed';
      task.completedAt = Date.now();
      task.error = error;

      const taskResult: TaskResult = {
        taskId,
        success: false,
        error,
        duration: task.completedAt - (task.startedAt || task.createdAt || 0),
      };

      this.addToCompletedHistory(taskResult);
    }
  }

  /**
   * Cancel a task
   */
  cancel(taskId: string): boolean {
    const task = this.queue.find((t) => t.id === taskId);
    if (task && task.status === 'pending') {
      task.status = 'cancelled';
      this.removeFromQueue(taskId);
      return true;
    }
    return false;
  }

  /**
   * Remove a task from the queue
   */
  private removeFromQueue(taskId: string): void {
    const index = this.queue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  /**
   * Add to completed history
   */
  private addToCompletedHistory(result: TaskResult): void {
    this.completedTasks.set(result.taskId, result);

    // Trim history if needed
    if (this.completedTasks.size > this.maxCompletedHistory) {
      const firstKey = this.completedTasks.keys().next().value;
      if (firstKey) {
        this.completedTasks.delete(firstKey);
      }
    }
  }

  /**
   * Get pending task count
   */
  getPendingCount(): number {
    return this.queue.filter((t) => t.status === 'pending').length;
  }

  /**
   * Get in-progress task count
   */
  getInProgressCount(): number {
    return this.queue.filter((t) => t.status === 'in_progress').length;
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return [...this.queue];
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.queue.filter((t) => t.status === status);
  }

  /**
   * Get tasks by agent
   */
  getTasksByAgent(agentType: string): Task[] {
    return this.queue.filter((t) => t.assignedAgent === agentType);
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.queue.find((t) => t.id === taskId);
  }

  /**
   * Get completed task result
   */
  getCompletedResult(taskId: string): TaskResult | undefined {
    return this.completedTasks.get(taskId);
  }

  /**
   * Clear all tasks
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    byPriority: Record<TaskPriority, number>;
    byAgent: Record<string, number>;
  } {
    const stats = {
      total: this.queue.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      failed: 0,
      byPriority: {
        critical: 0,
        high: 0,
        normal: 0,
        low: 0,
      } as Record<TaskPriority, number>,
      byAgent: {} as Record<string, number>,
    };

    for (const task of this.queue) {
      switch (task.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'in_progress':
          stats.inProgress++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'failed':
          stats.failed++;
          break;
      }

      stats.byPriority[task.priority]++;

      if (task.assignedAgent) {
        stats.byAgent[task.assignedAgent] =
          (stats.byAgent[task.assignedAgent] || 0) + 1;
      }
    }

    return stats;
  }
}
