import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {
  NotificationContextType,
  NotificationItem,
} from '../types/notification';

const STORAGE_KEY = 'shopadmin_notifications';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Order Received',
    message: 'Order #ORD-1049 ($189.50) placed by Sarah Jenkins.',
    type: 'order',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    link: '/orders',
  },
  {
    id: 'notif-2',
    title: 'Store Traffic Spike',
    message: 'Live visitors reached 52 active shoppers browsing your store.',
    type: 'visitor',
    read: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    link: '/analytics',
  },
  {
    id: 'notif-3',
    title: 'Low Inventory Warning',
    message: 'Wireless Headphones has only 3 units left in stock.',
    type: 'stock',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: '/products',
  },
  {
    id: 'notif-4',
    title: 'Order Status Updated',
    message: 'Order #ORD-1042 was marked as delivered.',
    type: 'order',
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    link: '/orders',
  },
  {
    id: 'notif-5',
    title: 'System Backup Success',
    message: 'Daily automated database snapshot completed.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    link: '/settings',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

function loadInitialNotifications(): NotificationItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default notifications if parsing fails
  }
  return DEFAULT_NOTIFICATIONS;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    loadInitialNotifications,
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Storage might be unavailable
    }
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
      const newNotification: NotificationItem = {
        ...item,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    [],
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
}
