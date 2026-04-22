import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChefHat } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Min 8 karakter').regex(/[A-Z]/, 'Harus ada huruf besar').regex(/[0-9]/, 'Harus ada angka'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    try {
      await authService.register(data);
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-2xl">
            <ChefHat className="w-7 h-7" /> ResepPedia
          </div>
          <p className="text-gray-500 text-sm mt-1">Buat akun baru</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nama Lengkap" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" placeholder="email@example.com" error={errors.email?.message} {...register('email')} />
          <div>
            <Input label="Password" type="password" placeholder="Min 8 karakter, huruf besar & angka" error={errors.password?.message} {...register('password')} />
            <p className="text-xs text-gray-400 mt-1">Minimal 8 karakter, harus ada huruf besar dan angka</p>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>Daftar</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun? <Link to="/login" className="text-red-500 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
