import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, BookOpen } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import RecipeGrid from '../components/recipe/RecipeGrid';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';

export default function UserProfilePage() {
  const { id } = useParams();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => api.get(`/users/${id}`).then(r => r.data.data),
    enabled: !!id,
  });

  const { data: recipesData, isLoading: loadingRecipes } = useQuery({
    queryKey: ['user-recipes', id],
    queryFn: () => api.get('/recipes', { params: { author_id: id, status: 'published' } }).then(r => r.data),
    enabled: !!id,
  });

  if (loadingUser) return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </PageWrapper>
  );

  if (!user) return (
    <PageWrapper>
      <div className="text-center py-20 text-gray-500">User tidak ditemukan.</div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-600 overflow-hidden flex-shrink-0">
            {user.avatar_url
              ? <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.name} />
              : user.name?.[0]?.toUpperCase()
            }
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            {user.bio && <p className="text-gray-600 mt-1 text-sm">{user.bio}</p>}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-400">
              {user.location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />Bergabung {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />{recipesData?.pagination?.total || 0} resep
              </span>
            </div>
          </div>
        </div>

        {/* Recipes */}
        <h2 className="text-xl font-bold text-gray-900 mb-5">Resep dari {user.name}</h2>
        <RecipeGrid recipes={recipesData?.data} loading={loadingRecipes} />
      </div>
    </PageWrapper>
  );
}
