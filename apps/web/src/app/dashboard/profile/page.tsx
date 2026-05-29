'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => usersApi.updateProfile(data),
    onSuccess: ({ data }) => {
      const token = localStorage.getItem('token') || '';
      setAuth({ ...user!, ...data }, token);
      toast.success('Profile updated');
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">My Profile</h1>
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm max-w-lg">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" value={user?.email || ''} disabled className="bg-slate-50 cursor-not-allowed" />
          <Input label="Phone" type="tel" placeholder="+1 234 567 8900" {...register('phone')} />
          <Input label="Avatar URL" type="url" placeholder="https://..." error={errors.avatar?.message} {...register('avatar')} />
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
