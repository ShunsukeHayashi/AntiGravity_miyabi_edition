/**
 * CoordinatorAgent テスト
 */

import { CoordinatorAgent } from '../coordinator';
import type { Task } from '../../../types/common';

describe('CoordinatorAgent', () => {
  let agent: CoordinatorAgent;

  beforeEach(() => {
    agent = new CoordinatorAgent();
  });

  afterEach(async () => {
    if (agent) {
      await agent.shutdown();
    }
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(agent.initialize()).resolves.not.toThrow();
    });

    it('should have correct type', () => {
      expect(agent.type).toBe('coordinator');
    });

    it('should have valid configuration', () => {
      expect(agent.config.name).toBe('CoordinatorAgent');
      expect(agent.config.enabled).toBe(true);
      expect(agent.config.maxRetries).toBe(3);
    });
  });

  describe('health check', () => {
    it('should pass health check after initialization', async () => {
      await agent.initialize();
      const isHealthy = await agent.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });

  describe('task execution', () => {
    const mockTask: Task = {
      id: 'test-task-1',
      title: 'Test Task',
      description: 'Test Description',
      type: 'feature',
      priority: 'P2-Medium',
      complexity: 'medium',
      dependencies: [],
      assignedAgent: 'coordinator',
      status: 'pending',
      estimatedEffort: '4h',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should execute task successfully', async () => {
      await agent.initialize();
      const result = await agent.execute(mockTask);

      expect(result.success).toBe(true);
      expect(result.taskId).toBe(mockTask.id);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should fail if not initialized', async () => {
      await expect(agent.execute(mockTask)).rejects.toThrow('not initialized');
    });
  });

  describe('shutdown', () => {
    it('should shutdown successfully', async () => {
      await agent.initialize();
      await expect(agent.shutdown()).resolves.not.toThrow();
    });
  });
});
