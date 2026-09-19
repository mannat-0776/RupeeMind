import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineSyncService, QueuedAction } from '../services/offlineSync';

describe('OfflineSyncService Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty mutation queue', () => {
    expect(OfflineSyncService.getQueue()).toEqual([]);
    expect(OfflineSyncService.getPendingCount()).toBe(0);
  });

  it('enqueues a new transaction creation mutation when offline', () => {
    const mockTx = {
      id: 'tx_offline_123',
      user_id: 'user_1',
      amount: 450,
      type: 'expense' as const,
      category: 'Food & Dining' as const,
      merchant: 'Local Chai Corner',
      source: 'manual' as const,
      created_at: new Date().toISOString(),
    };

    const action = OfflineSyncService.enqueue('create', mockTx);
    expect(action.id).toBeDefined();
    expect(action.action).toBe('create');
    expect(action.payload).toEqual(mockTx);
    expect(OfflineSyncService.getPendingCount()).toBe(1);
  });

  it('dequeues processed actions correctly', () => {
    const action1 = OfflineSyncService.enqueue('create', { id: '1' });
    const action2 = OfflineSyncService.enqueue('update', { id: '2' });

    expect(OfflineSyncService.getPendingCount()).toBe(2);

    OfflineSyncService.dequeue(action1.id);
    const remaining = OfflineSyncService.getQueue();

    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(action2.id);
  });

  it('clears all queued actions completely', () => {
    OfflineSyncService.enqueue('create', { id: '1' });
    OfflineSyncService.enqueue('delete', { id: '2' });
    expect(OfflineSyncService.getPendingCount()).toBe(2);

    OfflineSyncService.clear();
    expect(OfflineSyncService.getPendingCount()).toBe(0);
    expect(OfflineSyncService.getQueue()).toEqual([]);
  });
});
