import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect, useState } from 'react';

// Tunggu Zustand selesai hydrate dari localStorage
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Zustand persist butuh 1 tick untuk hydrate
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // Kalau sudah hydrated sebelum effect jalan
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const hydrated = useHydrated();

  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const hydrated = useHydrated();

  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};
