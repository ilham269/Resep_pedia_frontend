import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useRecipes';

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!categories?.length) return (
    <p className="text-center text-gray-400 py-6">Belum ada kategori.</p>
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <Link key={cat.id} to={`/explore?category=${cat.id}`}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center group">
          <span className="text-3xl">{cat.icon || '🍽️'}</span>
          <span className="text-xs font-medium text-gray-700 group-hover:text-red-500 transition">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
