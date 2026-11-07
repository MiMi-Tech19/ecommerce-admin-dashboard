
import { useMemo } from 'react';
import { Users, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useUpdateUserRole } from '../hooks/useUpdateUserRole';

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function UsersPage() {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsers();

  const updateUserRole = useUpdateUserRole();

  const adminCount = useMemo(
    () => users.filter((user) => user.role === 'ADMIN').length,
    [users],
  );

  const staffCount = users.length - adminCount;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="mt-2 text-slate-600">
          Manage registered users and administrator permissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <Users className="text-blue-600" size={20} />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Administrators</p>
            <ShieldCheck className="text-emerald-600" size={20} />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {adminCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Staff Members</p>
            <UserCheck className="text-amber-600" size={20} />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {staffCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Registered Users</h2>
          <p className="mt-1 text-sm text-slate-500">
            Promote staff members to administrator access.
          </p>
        </div>

        {isLoading && (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : 'Unable to load users. Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        )}

        {updateUserRole.isError && (
          <p role="alert" className="px-5 py-3 text-sm text-red-600">
            {updateUserRole.error instanceof Error
              ? updateUserRole.error.message
              : 'Unable to update user role. Please try again.'}
          </p>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No registered users found.
          </div>
        )}

        {!isLoading && !isError && users.length > 0 && (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {users.map((user) => (
                <article key={user.id} className="space-y-3 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="break-all text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {user.role === 'ADMIN' ? 'Administrator' : 'Staff'}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">
                        Joined {formatDate(user.createdAt)}
                      </p>
                    </div>

                    {user.role === 'STAFF' && (
                      <button
                        type="button"
                        disabled={updateUserRole.isPending}
                        onClick={() => {
                          updateUserRole.reset();
                          updateUserRole.mutate({
                            id: user.id,
                            role: 'ADMIN',
                          });
                        }}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updateUserRole.isPending &&
                        updateUserRole.variables?.id === user.id
                          ? 'Promoting...'
                          : 'Promote to Admin'}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">User</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Date Joined</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {user.role === 'ADMIN' ? 'Administrator' : 'Staff'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {user.role === 'STAFF' ? (
                          <button
                            type="button"
                            disabled={updateUserRole.isPending}
                            onClick={() => {
                              updateUserRole.reset();
                              updateUserRole.mutate({
                                id: user.id,
                                role: 'ADMIN',
                              });
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <UserPlus size={14} />
                            {updateUserRole.isPending &&
                            updateUserRole.variables?.id === user.id
                              ? 'Promoting...'
                              : 'Promote to Admin'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Administrator
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
