'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/services/api';
import { clsx } from 'clsx';

const ROLES = ['GUEST', 'HOTEL_OWNER', 'ADMIN'];

export default function AdminUsersPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers().then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.setUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('Role updated'); },
    onError: () => toast.error('Failed to update role'),
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Users ({data?.total || 0})</h1>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium',
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.role === 'HOTEL_OWNER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs font-medium', user.isVerified ? 'text-green-600' : 'text-slate-400')}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                      className="rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-primary-400"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
