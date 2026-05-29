'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { BellIcon } from 'lucide-react';

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => usersApi.getNotifications().then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: () => usersApi.markNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notifications?.filter((n: any) => !n.isRead).length || 0;

  if (isLoading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-800">
          Notifications {unread > 0 && <span className="ml-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">{unread}</span>}
        </h1>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => markRead.mutate()}>Mark all read</Button>
        )}
      </div>
      {!notifications?.length ? (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <BellIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <div key={n.id} className={`rounded-xl border p-4 transition-colors ${n.isRead ? 'border-slate-100 bg-white' : 'border-primary-100 bg-primary-50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                </div>
                {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary-600 shrink-0 mt-1" />}
              </div>
              <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
