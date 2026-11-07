import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Package,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import type { NotificationType } from '../../types/notification';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  return `${diffInDays}d ago`;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'order':
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <ShoppingCart size={16} />
        </div>
      );
    case 'visitor':
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <Users size={16} />
        </div>
      );
    case 'stock':
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <AlertTriangle size={16} />
        </div>
      );
    case 'system':
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
          <CheckCircle2 size={16} />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <Package size={16} />
        </div>
      );
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const displayedNotifications = notifications.filter((item) =>
    filter === 'unread' ? !item.read : true,
  );

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      setIsOpen(false);
      navigate(link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:w-96 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  filter === 'unread'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Check size={20} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {filter === 'unread'
                    ? 'You have no unread notifications.'
                    : 'No store notifications to display.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.link)}
                  className={`group relative flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !notif.read
                      ? 'bg-blue-50/40 dark:bg-blue-950/20'
                      : 'bg-white dark:bg-slate-900'
                  }`}
                >
                  {/* Type Icon */}
                  {getNotificationIcon(notif.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`truncate text-xs font-semibold ${
                          !notif.read
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>

                  {/* Delete individual button */}
                  <button
                    type="button"
                    aria-label="Remove notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="absolute right-2.5 top-3.5 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={clearAll}
                className="flex w-full items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
              >
                <Trash2 size={13} />
                <span>Clear all notifications</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
