'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2 } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: res } = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      setAuth(res.user, res.token);
      toast.success('Account created! Welcome to StayEase.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <Building2 className="h-10 w-10 text-primary-600 mb-2" />
          <h1 className="text-2xl font-bold text-slate-800">Create Your Account</h1>
          <p className="text-sm text-slate-500 mt-1">Start booking hotels worldwide.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Phone (optional)" type="tel" placeholder="+1 234 567 8900" {...register('phone')} />
          <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
