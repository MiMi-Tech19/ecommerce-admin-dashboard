import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  Smartphone,
  Tablet,
  ShieldCheck,
  LogOut,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useActiveSessions } from '../../hooks/useActiveSessions';
import { useSessionHistory } from '../../hooks/useSessionHistory';
import { useRevokeSession } from '../../hooks/useRevokeSession';

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function getDeviceInfo(userAgent: string | null) {
  if (!userAgent) {
    return { name: 'Unknown device', Icon: Monitor };
  }

  const isTablet = /ipad|tablet/i.test(userAgent);
  const isMobile = /mobile|android|iphone/i.test(userAgent);

  const browser = /edg/i.test(userAgent)
    ? 'Microsoft Edge'
    : /chrome/i.test(userAgent)
      ? 'Google Chrome'
      : /firefox/i.test(userAgent)
        ? 'Mozilla Firefox'
        : /safari/i.test(userAgent)
          ? 'Safari'
          : 'Unknown browser';

  const device = isTablet
    ? 'Tablet'
    : isMobile
      ? 'Mobile device'
      : 'Desktop';

  const Icon = isTablet ? Tablet : isMobile ? Smartphone : Monitor;

  return {
    name: `${device} · ${browser}`,
    Icon,
  };
}

export function SessionManagement() {
  const navigate = useNavigate();
  const { logoutAll } = useAuth();

  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
    error: sessionsErrorMessage,
    refetch: refetchSessions,
    isFetching: sessionsFetching,
  } = useActiveSessions();

  const {
    data: history = [],
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrorMessage,
    refetch: refetchHistory,
    isFetching: historyFetching,
  } = useSessionHistory();

  const revokeSessionMutation = useRevokeSession();

  const [actionError, setActionError] = useState('');

  async function handleRevokeSession(sessionId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to terminate this session? That device will need to sign in again.',
    );

    if (!confirmed) return;

    setActionError('');
    revokeSessionMutation.reset();

    try {
      await revokeSessionMutation.mutateAsync(sessionId);
    } catch {
      // The mutation error is displayed below.
    }
  }

  async function handleLogoutAll() {
    const confirmed = window.confirm(
      'This will sign you out of every device, including this one. Continue?',
    );

    if (!confirmed) return;

    setActionError('');

    try {
      await logoutAll();
      navigate('/login', { replace: true });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Unable to terminate all sessions. Please try again.',
      );
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Session Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review devices signed into your account and manage your login
          activity.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">
              Active Sessions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Devices currently signed into your account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={sessions.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={16} />
            Log out all devices
          </button>
        </div>

        {actionError && (
          <p role="alert" className="px-5 pt-4 text-sm text-red-600">
            {actionError}
          </p>
        )}

        {revokeSessionMutation.isError && (
          <p role="alert" className="px-5 pt-4 text-sm text-red-600">
            {revokeSessionMutation.error instanceof Error
              ? revokeSessionMutation.error.message
              : 'Unable to terminate session.'}
          </p>
        )}

        {sessionsLoading && (
          <p className="p-6 text-center text-sm text-slate-500">
            Loading active sessions...
          </p>
        )}

        {sessionsError && (
          <div className="p-6 text-center" role="alert">
            <p className="text-sm text-red-600">
              {sessionsErrorMessage instanceof Error
                ? sessionsErrorMessage.message
                : 'Unable to load active sessions.'}
            </p>
            <button
              type="button"
              onClick={() => void refetchSessions()}
              disabled={sessionsFetching}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={14} />
              {sessionsFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        )}

        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            No active sessions found.
          </p>
        )}

        {!sessionsLoading && !sessionsError && sessions.length > 0 && (
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const { name, Icon } = getDeviceInfo(session.userAgent);

              return (
                <article
                  key={session.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {name}
                        </p>

                        {session.isCurrent && (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            Current device
                          </span>
                        )}
                      </div>

                      <p className="mt-1 break-all text-sm text-slate-500">
                        IP address: {session.ipAddress || 'Unavailable'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Signed in: {formatDate(session.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Last active: {formatDate(session.lastActive)}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      type="button"
                      onClick={() => void handleRevokeSession(session.id)}
                      disabled={revokeSessionMutation.isPending}
                      className="self-start rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                    >
                      {revokeSessionMutation.isPending &&
                      revokeSessionMutation.variables === session.id
                        ? 'Terminating...'
                        : 'Terminate session'}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} />
            <h3 className="font-semibold text-slate-900">
              Login History
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review recent sessions associated with your account.
          </p>
        </div>

        {historyLoading && (
          <p className="p-6 text-center text-sm text-slate-500">
            Loading login history...
          </p>
        )}

        {historyError && (
          <div className="p-6 text-center" role="alert">
            <p className="text-sm text-red-600">
              {historyErrorMessage instanceof Error
                ? historyErrorMessage.message
                : 'Unable to load login history.'}
            </p>
            <button
              type="button"
              onClick={() => void refetchHistory()}
              disabled={historyFetching}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={14} />
              {historyFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        )}

        {!historyLoading && !historyError && history.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            No login history found.
          </p>
        )}

        {!historyLoading && !historyError && history.length > 0 && (
          <div className="divide-y divide-slate-100">
            {history.map((session) => {
              const { name, Icon } = getDeviceInfo(session.userAgent);

              return (
                <article key={session.id} className="flex gap-3 p-5">
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{name}</p>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      IP address: {session.ipAddress || 'Unavailable'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Signed in: {formatDate(session.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {session.loggedOutAt
                        ? `Logged out: ${formatDate(session.loggedOutAt)}`
                        : session.revokedAt
                          ? `Terminated: ${formatDate(session.revokedAt)}`
                          : `Last active: ${formatDate(session.lastActive)}`}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}