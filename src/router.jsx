import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import SubmitRecipePage from './pages/SubmitRecipePage';
import AdminPage from './pages/AdminPage';
import CategoriesPage from './pages/CategoriesPage';
import RegionsPage from './pages/RegionsPage';
import UserProfilePage from './pages/UserProfilePage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/regions" element={<RegionsPage />} />
      <Route path="/users/:id" element={<UserProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/submit" element={<ProtectedRoute><SubmitRecipePage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="text-8xl mb-4">🍽️</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Halaman tidak ditemukan</h1>
          <a href="/" className="mt-4 text-red-500 hover:underline">Kembali ke beranda</a>
        </div>
      } />
    </Routes>
  );
}
