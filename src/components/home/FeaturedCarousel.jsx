import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from '../recipe/RecipeCard';
import { useFeaturedRecipes } from '../../hooks/useRecipes';
import SkeletonCard from '../ui/SkeletonCard';

export default function FeaturedCarousel() {
  const { data: recipes, isLoading } = useFeaturedRecipes();
  const ref = useRef(null);

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition hidden md:flex">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div ref={ref} className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="min-w-[280px] snap-start"><SkeletonCard /></div>)
          : recipes?.map((r) => (
            <div key={r.id} className="min-w-[280px] snap-start"><RecipeCard recipe={r} /></div>
          ))}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition hidden md:flex">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
