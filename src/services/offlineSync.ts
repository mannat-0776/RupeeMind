import { Transaction } from '../types';

export interface PendingSyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: string;
  retryCount: number;
}

export type QueuedAction = PendingSyncItem;

const OFFLINE_QUEUE_KEY = 'rupeemind_offline_sync_queue';

export const OfflineSyncService = {
  getQueue(): PendingSyncItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQueue(queue: PendingSyncItem[]): void {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  },

  enqueue(action: 'create' | 'update' | 'delete', payload: any): PendingSyncItem {
    const queue = this.getQueue();
    const item: PendingSyncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    this.saveQueue(queue);
    return item;
  },

  remove(id: string): void {
    const queue = this.getQueue().filter((item) => item.id !== id);
    this.saveQueue(queue);
  },

  dequeue(id: string): void {
    this.remove(id);
  },

  getPendingCount(): number {
    return this.getQueue().length;
  },

  clear(): void {
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {
      console.error('Failed to clear offline queue', e);
    }
  },

  async processQueue(
    onItemProcessed?: (item: PendingSyncItem, success: boolean) => void
  ): Promise<{ processed: number; failed: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { processed: 0, failed: 0 };

    let processed = 0;
    let failed = 0;
    const remaining: PendingSyncItem[] = [];

    for (const item of queue) {
      try {
        // In local state architecture, actions are already optimistically applied
        // Here we simulate or execute backend verification sync
        await new Promise((resolve) => setTimeout(resolve, 80));
        processed++;
        if (onItemProcessed) onItemProcessed(item, true);
      } catch (err) {
        failed++;
        item.retryCount += 1;
        if (item.retryCount < 5) {
          remaining.push(item);
        }
        if (onItemProcessed) onItemProcessed(item, false);
      }
    }

    this.saveQueue(remaining);
    return { processed, failed };
  },
};
