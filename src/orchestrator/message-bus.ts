/**
 * Message Bus for Agent Communication
 * Provides pub/sub messaging between agents
 */

export type MessageType =
  | 'STATUS_UPDATE'
  | 'TASK_REQUEST'
  | 'TASK_COMPLETE'
  | 'ERROR'
  | 'MISSION_CONTROL_OPEN'
  | 'AGENT_STARTED'
  | 'AGENT_STOPPED'
  | 'CONTEXT_UPDATE'
  | 'LOG';

export interface AgentMessage {
  id: string;
  from: string;
  to: string | 'broadcast';
  type: MessageType;
  payload: Record<string, unknown>;
  timestamp: number;
}

export type MessageHandler = (message: AgentMessage) => void;

/**
 * Message Bus for inter-agent communication
 */
export class MessageBus {
  private subscribers: Map<string, Set<MessageHandler>>;
  private messageHistory: AgentMessage[];
  private maxHistorySize: number;
  private running: boolean;
  private messageQueue: AgentMessage[];
  private processing: boolean;

  constructor(maxHistorySize = 1000) {
    this.subscribers = new Map();
    this.messageHistory = [];
    this.maxHistorySize = maxHistorySize;
    this.running = false;
    this.messageQueue = [];
    this.processing = false;
  }

  /**
   * Start the message bus
   */
  start(): void {
    this.running = true;
    console.log('[MessageBus] Started');
  }

  /**
   * Stop the message bus
   */
  stop(): void {
    this.running = false;
    this.messageQueue = [];
    console.log('[MessageBus] Stopped');
  }

  /**
   * Subscribe to messages for a specific agent
   */
  subscribe(agentId: string, handler: MessageHandler): () => void {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, new Set());
    }
    this.subscribers.get(agentId)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.subscribers.get(agentId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscribers.delete(agentId);
        }
      }
    };
  }

  /**
   * Subscribe to all broadcast messages
   */
  subscribeToBroadcast(handler: MessageHandler): () => void {
    return this.subscribe('__broadcast__', handler);
  }

  /**
   * Publish a message
   */
  publish(message: AgentMessage): void {
    if (!this.running) {
      console.warn('[MessageBus] Cannot publish - bus not running');
      return;
    }

    // Add to history
    this.addToHistory(message);

    // Queue message for processing
    this.messageQueue.push(message);
    this.processQueue();
  }

  /**
   * Process message queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.messageQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.messageQueue.length > 0 && this.running) {
      const message = this.messageQueue.shift()!;
      await this.deliverMessage(message);
    }

    this.processing = false;
  }

  /**
   * Deliver a message to subscribers
   */
  private async deliverMessage(message: AgentMessage): Promise<void> {
    try {
      if (message.to === 'broadcast') {
        // Deliver to all subscribers
        for (const [agentId, handlers] of this.subscribers) {
          if (agentId !== message.from) {
            for (const handler of handlers) {
              try {
                handler(message);
              } catch (error) {
                console.error(`[MessageBus] Error in handler for ${agentId}:`, error);
              }
            }
          }
        }
        // Also deliver to broadcast subscribers
        const broadcastHandlers = this.subscribers.get('__broadcast__');
        if (broadcastHandlers) {
          for (const handler of broadcastHandlers) {
            try {
              handler(message);
            } catch (error) {
              console.error('[MessageBus] Error in broadcast handler:', error);
            }
          }
        }
      } else {
        // Deliver to specific agent
        const handlers = this.subscribers.get(message.to);
        if (handlers) {
          for (const handler of handlers) {
            try {
              handler(message);
            } catch (error) {
              console.error(`[MessageBus] Error in handler for ${message.to}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('[MessageBus] Error delivering message:', error);
    }
  }

  /**
   * Add message to history
   */
  private addToHistory(message: AgentMessage): void {
    this.messageHistory.push(message);
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }
  }

  /**
   * Get message history
   */
  getHistory(filter?: {
    from?: string;
    to?: string;
    type?: MessageType;
    since?: number;
  }): AgentMessage[] {
    let messages = [...this.messageHistory];

    if (filter) {
      if (filter.from) {
        messages = messages.filter((m) => m.from === filter.from);
      }
      if (filter.to) {
        messages = messages.filter((m) => m.to === filter.to);
      }
      if (filter.type) {
        messages = messages.filter((m) => m.type === filter.type);
      }
      if (filter.since !== undefined) {
        const sinceTime = filter.since;
        messages = messages.filter((m) => m.timestamp >= sinceTime);
      }
    }

    return messages;
  }

  /**
   * Clear message history
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  /**
   * Check if agent is subscribed
   */
  isSubscribed(agentId: string): boolean {
    return this.subscribers.has(agentId);
  }
}
