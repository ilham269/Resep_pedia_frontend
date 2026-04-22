import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChefHat, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  password: z.string().min(8, 'Min 8 karakter').regex(/[A-Z]/, 'Harus ada huruf besar').regex(/[0-9]/, 'Harus ada angka'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Password tidak cocok', path: ['confirm'] });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token tidak valid atau sudah kadaluarsa.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-2xl">
            <ChefHat className="w-7 h-7" /> ResepPedia
          </div>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-semibold text-gray-900">Password berhasil direset!</h2>
            <p className="text-sm text-gray-500">Kamu akan diarahkan ke halaman login...</p>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-gray-900 mb-1">Buat Password Baru</h2>
            <p className="text-sm text-gray-500 mb-6">Minimal 8 karakter, harus ada huruf besar dan angka.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Password Baru" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <Input label="Konfirmasi Password" type="password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm')} />
              <Button type="submit" className="w-full" loading={isSubmitting}>Reset Password</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
