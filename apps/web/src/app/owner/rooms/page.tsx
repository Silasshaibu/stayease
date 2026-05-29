'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { hotelsApi, roomsApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PlusIcon, TrashIcon } from 'lucide-react';

export default function OwnerRoomsPage() {
  const qc = useQueryClient();
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: hotels } = useQuery({
    queryKey: ['owner', 'hotels'],
    queryFn: () => hotelsApi.getMyHotels().then((r) => r.data),
  });

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', 'hotel', selectedHotelId],
    queryFn: () => roomsApi.getByHotel(selectedHotelId).then((r) => r.data),
    enabled: !!selectedHotelId,
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data: any) => roomsApi.create({ ...data, hotelId: selectedHotelId, pricePerNight: Number(data.pricePerNight), capacity: Number(data.capacity) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms', 'hotel', selectedHotelId] }); setShowForm(false); reset(); toast.success('Room added'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to add room'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms', 'hotel', selectedHotelId] }); toast.success('Room deleted'); },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">Room Management</h1>

      {/* Hotel selector */}
      <div className="mb-5">
        <label className="text-sm font-medium text-slate-700 block mb-1">Select Property</label>
        <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-72">
          <option value="">— choose a hotel —</option>
          {hotels?.map((h: any) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {selectedHotelId && (
        <>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
              <PlusIcon className="h-4 w-4" /> Add Room
            </Button>
          </div>

          {showForm && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-5">
              <h2 className="font-semibold text-slate-800 mb-4">New Room</h2>
              <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Room Name" {...register('name', { required: true })} />
                <Input label="Price Per Night ($)" type="number" min={1} {...register('pricePerNight', { required: true })} />
                <Input label="Capacity (guests)" type="number" min={1} {...register('capacity')} />
                <Input label="Bed Type" placeholder="e.g. King, Twin" {...register('bedType')} />
                <Input label="Size (m²)" type="number" {...register('size')} />
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                  <textarea rows={2} {...register('description')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit" isLoading={isSubmitting}>Add Room</Button>
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
          ) : rooms?.length ? (
            <div className="space-y-3">
              {rooms.map((room: any) => (
                <div key={room.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-slate-800">{room.name}</p>
                    <p className="text-xs text-slate-400">{room.bedType} · {room.capacity} guests · ${Number(room.pricePerNight).toFixed(0)}/night</p>
                  </div>
                  <button onClick={() => { if (confirm('Delete this room?')) deleteMutation.mutate(room.id); }} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">No rooms for this property yet.</p>
          )}
        </>
      )}
    </div>
  );
}
