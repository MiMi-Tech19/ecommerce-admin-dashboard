export type NotificationType =
  | 'order'
  | 'stock'
  | 'visitor'
  | 'system'
  | 'user';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (
    notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>,
  ) => void;
}
