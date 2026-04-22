import RecipeCard from './RecipeCard';
import { SkeletonGrid } from '../ui/SkeletonCard';

export default function RecipeGrid({ recipes, loading }) {
  if (loading) return <SkeletonGrid />;
  if (!recipes?.length) return (
    <div className="text-center py-16">
      <p className="text-6xl mb-4">🍽️</p>
      <p className="text-gray-500">Belum ada resep ditemukan.</p>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}
