import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChefHat } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await authService.login(data);
      login(res.data.token, res.data.data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-2xl">
            <ChefHat className="w-7 h-7" /> ResepPedia
          </div>
          <p className="text-gray-500 text-sm mt-1">Masuk ke akun kamu</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="email@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <Button type="submit" className="w-full" loading={isSubmitting}>Login</Button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-red-500">Lupa password?</Link>
          <p className="text-sm text-gray-500">Belum punya akun? <Link to="/register" className="text-red-500 font-medium hover:underline">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
}
