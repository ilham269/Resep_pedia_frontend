import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Mail } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-2xl">
            <ChefHat className="w-7 h-7" /> ResepPedia
          </div>
          <p className="text-gray-500 text-sm mt-1">Reset password akun kamu</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-semibold text-gray-900">Email terkirim!</h2>
            <p className="text-sm text-gray-500">
              Jika email <strong>{email}</strong> terdaftar, link reset password sudah dikirim. Cek inbox kamu.
            </p>
            <Link to="/login" className="block text-red-500 text-sm hover:underline">Kembali ke login</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Masukkan email kamu dan kami akan kirimkan link untuk reset password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Kirim Link Reset
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              <Link to="/login" className="text-red-500 hover:underline">Kembali ke login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
