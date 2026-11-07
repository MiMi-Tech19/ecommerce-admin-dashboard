import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  NotificationProvider,
  useNotifications,
} from './NotificationContext';

describe('NotificationContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default notifications and correct unread count', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    expect(result.current.notifications.length).toBeGreaterThan(0);
    expect(result.current.unreadCount).toBe(
      result.current.notifications.filter((n) => !n.read).length,
    );
  });

  it('marks a single notification as read', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    const unreadItem = result.current.notifications.find((n) => !n.read);
    expect(unreadItem).toBeDefined();

    const initialUnread = result.current.unreadCount;

    act(() => {
      result.current.markAsRead(unreadItem!.id);
    });

    expect(result.current.unreadCount).toBe(initialUnread - 1);
    const updated = result.current.notifications.find(
      (n) => n.id === unreadItem!.id,
    );
    expect(updated?.read).toBe(true);
  });

  it('marks all notifications as read', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every((n) => n.read)).toBe(true);
  });

  it('removes a specific notification', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    const targetId = result.current.notifications[0].id;
    const initialCount = result.current.notifications.length;

    act(() => {
      result.current.removeNotification(targetId);
    });

    expect(result.current.notifications.length).toBe(initialCount - 1);
    expect(
      result.current.notifications.find((n) => n.id === targetId),
    ).toBeUndefined();
  });

  it('clears all notifications', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications.length).toBe(0);
    expect(result.current.unreadCount).toBe(0);
  });

  it('adds a new notification', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.addNotification({
        title: 'New Customer Registered',
        message: 'David Brown created an account.',
        type: 'user',
      });
    });

    expect(result.current.notifications[0].title).toBe('New Customer Registered');
    expect(result.current.notifications[0].read).toBe(false);
  });
});
