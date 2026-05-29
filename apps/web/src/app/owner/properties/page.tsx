'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { hotelsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';

export default function OwnerPropertiesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: editing || {},
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => hotelsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['owner', 'hotels'] }); setShowForm(false); reset(); toast.success('Hotel created! Pending approval.'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create hotel'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['owner', 'hotels'] }); toast.success('Hotel deleted'); },
  });

  const onSubmit = (data: any) => {
    const payload = { ...data, starRating: Number(data.starRating) };
    if (editing) {
      hotelsApi.update(editing.id, payload).then(() => {
        qc.invalidateQueries({ queryKey: ['owner', 'hotels'] });
        setEditing(null); setShowForm(false); reset();
        toast.success('Hotel updated');
      }).catch((e) => toast.error(e.response?.data?.message || 'Update failed'));
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-800">My Properties</h1>
        <Button size="sm" onClick={() => { setEditing(null); reset({}); setShowForm(!showForm); }} className="gap-1">
          <PlusIcon className="h-4 w-4" /> Add Hotel
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">{editing ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Hotel Name" {...register('name', { required: true })} />
            <Input label="City" {...register('city', { required: true })} />
            <Input label="Country" {...register('country', { required: true })} />
            <Input label="Address" {...register('address', { required: true })} />
            <Input label="Star Rating (1–5)" type="number" min={1} max={5} {...register('starRating')} />
            <Input label="Check-in Time" placeholder="14:00" {...register('checkInTime')} />
            <Input label="Check-out Time" placeholder="11:00" {...register('checkOutTime')} />
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
              <textarea rows={3} {...register('description')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Describe your hotel..." />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>{editing ? 'Update' : 'Create Hotel'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditing(null); reset(); }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : hotels?.length ? (
        <div className="space-y-3">
          {hotels.map((hotel: any) => (
            <div key={hotel.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-slate-800">{hotel.name}</p>
                <p className="text-xs text-slate-400">{hotel.city}, {hotel.country} · {hotel._count?.rooms || 0} rooms</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  hotel.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  hotel.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                }`}>{hotel.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing(hotel); reset(hotel); setShowForm(true); }} className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-primary-600">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={() => { if (confirm('Delete this hotel?')) deleteMutation.mutate(hotel.id); }} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
          No properties yet. Click <strong>Add Hotel</strong> to get started.
        </div>
      )}
    </div>
  );
}
