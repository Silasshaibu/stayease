'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function AdminHotelsPage() {
  const qc = useQueryClient();

  const { data: pending, isLoading } = useQuery({
    queryKey: ['admin', 'hotels', 'pending'],
    queryFn: () => adminApi.getPendingHotels().then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveHotel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'hotels'] }); toast.success('Hotel approved'); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminApi.rejectHotel(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'hotels'] }); toast.success('Hotel rejected'); },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Hotel Management</h1>

      <div className="mb-6">
        <h2 className="font-semibold text-slate-700 mb-3">Pending Approval ({pending?.length || 0})</h2>
        {isLoading ? (
          <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : pending?.length ? (
          <div className="space-y-3">
            {pending.map((hotel: any) => (
              <div key={hotel.id} className="flex items-center justify-between rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{hotel.name}</p>
                  <p className="text-xs text-slate-500">{hotel.city}, {hotel.country}</p>
                  <p className="text-xs text-slate-400">Owner: {hotel.owner?.firstName} {hotel.owner?.lastName} ({hotel.owner?.email})</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(hotel.id)}
                    isLoading={approveMutation.isPending}
                    className="gap-1"
                  >
                    <CheckCircleIcon className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => rejectMutation.mutate(hotel.id)}
                    isLoading={rejectMutation.isPending}
                    className="gap-1"
                  >
                    <XCircleIcon className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-slate-400 shadow-sm">
            No hotels pending approval.
          </div>
        )}
      </div>
    </div>
  );
}
