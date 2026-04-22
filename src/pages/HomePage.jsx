import PageWrapper from '../components/layout/PageWrapper';
import HeroSection from '../components/home/HeroSection';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import RecipeGrid from '../components/recipe/RecipeGrid';
import { useTrendingRecipes } from '../hooks/useRecipes';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { data: trending, isLoading } = useTrendingRecipes();

  return (
    <PageWrapper>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">
        {/* Kategori */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Kategori</h2>
            <Link to="/categories" className="text-sm text-red-500 hover:underline">Lihat semua</Link>
          </div>
          <CategoryGrid />
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">⭐ Resep Unggulan</h2>
            <Link to="/explore?sort=rating" className="text-sm text-red-500 hover:underline">Lihat semua</Link>
          </div>
          <FeaturedCarousel />
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Minggu Ini</h2>
            <Link to="/explore?sort=popular" className="text-sm text-red-500 hover:underline">Lihat semua</Link>
          </div>
          <RecipeGrid recipes={trending} loading={isLoading} />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-red-500 to-red-700 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Punya resep rahasia?</h2>
          <p className="text-red-100 mb-6">Bagikan ke jutaan pecinta kuliner di seluruh Indonesia</p>
          <Link to="/submit" className="bg-white text-red-600 font-semibold px-8 py-3 rounded-xl hover:bg-red-50 transition inline-block">
            Bagikan Sekarang
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
