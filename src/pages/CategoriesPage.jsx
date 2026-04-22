import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useCategories } from '../hooks/useRecipes';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori Masakan</h1>
        <p className="text-gray-500 mb-8">Temukan resep berdasarkan jenis masakan</p>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !categories?.length ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🍽️</p>
            <p>Belum ada kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center group"
              >
                <span className="text-5xl">{cat.icon || '🍽️'}</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-red-500 transition">{cat.name}</p>
                  {cat.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
