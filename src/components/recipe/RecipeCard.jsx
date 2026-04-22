import { Link } from 'react-router-dom';
import { Clock, Users, Star, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import { DIFFICULTY_COLOR } from '../../utils/constants';

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="hover:-translate-y-1 transition-transform duration-200">
      <Link to={`/recipes/${recipe.slug}`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {recipe.cover_image_url ? (
            <img src={recipe.cover_image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={DIFFICULTY_COLOR[recipe.difficulty]}>{recipe.difficulty}</Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-red-500 transition">{recipe.title}</h3>
          <p className="text-xs text-gray-500 mb-3">oleh {recipe.author?.name}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {totalTime > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{totalTime} mnt</span>}
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings} porsi</span>
            </div>
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star className="w-3 h-3 fill-yellow-400" />{Number(recipe.rating_avg || 0).toFixed(1)}
            </span>
          </div>
          {(recipe.region || recipe.country) && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
              {recipe.country?.flag_emoji} <MapPin className="w-3 h-3" />
              {recipe.region?.name || recipe.country?.name}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
