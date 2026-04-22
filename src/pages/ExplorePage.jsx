import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import RecipeGrid from '../components/recipe/RecipeGrid';
import { useRecipes, useCategories } from '../hooks/useRecipes';
import { useDebounce } from '../hooks/useDebounce';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    sort: searchParams.get('sort') || 'newest',
    page: 1, limit: 12,
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQ = useDebounce(filters.q, 400);
  const { data, isLoading } = useRecipes({ ...filters, q: debouncedQ });
  const { data: categories } = useCategories();

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));
  const clearFilters = () => setFilters({ q: '', category: '', difficulty: '', sort: 'newest', page: 1, limit: 12 });
  const activeCount = [filters.category, filters.difficulty].filter(Boolean).length;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Jelajahi Resep</h1>

        {/* Search + Filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Cari resep..."
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
            />
          </div>
          <Button variant="outline" size="md" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filter {activeCount > 0 && <Badge variant="red">{activeCount}</Badge>}
          </Button>
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Kategori</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
                <option value="">Semua</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Kesulitan</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={filters.difficulty} onChange={(e) => setFilter('difficulty', e.target.value)}>
                <option value="">Semua</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>
            {activeCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:underline mt-auto">
                <X className="w-4 h-4" /> Reset filter
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">
          {data?.pagination ? `${data.pagination.total} resep ditemukan` : ''}
        </p>
        <RecipeGrid recipes={data?.data} loading={isLoading} />

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${filters.page === p ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
