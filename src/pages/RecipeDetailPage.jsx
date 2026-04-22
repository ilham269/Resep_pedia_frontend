import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, Bookmark, Share2, Star, MapPin, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageWrapper from '../components/layout/PageWrapper';
import RatingStars from '../components/shared/RatingStars';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RecipeCard from '../components/recipe/RecipeCard';
import { useRecipe, useSaveRecipe, useRating, useRecipes } from '../hooks/useRecipes';
import { useAuthStore } from '../stores/authStore';
import { DIFFICULTY_COLOR } from '../utils/constants';
import { timeAgo } from '../utils/formatDate';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: recipe, isLoading } = useRecipe(slug);
  const { isAuthenticated } = useAuthStore();
  const { mutate: toggleSave, isPending: saving } = useSaveRecipe();
  const { mutate: submitRating, isPending: ratingPending } = useRating(recipe?.id);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [saved, setSaved] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Related recipes (same category)
  const { data: related } = useRecipes({
    category: recipe?.category_id,
    limit: 3,
    page: 1,
  });

  // Ratings list
  const { data: ratingsData } = useQuery({
    queryKey: ['ratings', recipe?.id],
    queryFn: () => api.get(`/recipes/${recipe.id}/ratings`).then(r => r.data.data),
    enabled: !!recipe?.id,
  });

  const handleSave = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    toggleSave({ id: recipe.id, saved }, {
      onSuccess: () => setSaved(!saved),
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast.success('Link disalin!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleRating = () => {
    if (!userRating) return;
    submitRating({ score: userRating, review_text: review || undefined }, {
      onSuccess: () => { setUserRating(0); setReview(''); },
    });
  };

  if (isLoading) return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-72 bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </PageWrapper>
  );

  if (!recipe) return (
    <PageWrapper>
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🍽️</p>
        <p className="text-gray-500">Resep tidak ditemukan.</p>
        <Link to="/explore" className="text-red-500 hover:underline mt-2 block">Jelajahi resep lain</Link>
      </div>
    </PageWrapper>
  );

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const relatedFiltered = related?.data?.filter(r => r.slug !== slug).slice(0, 3);

  return (
    <PageWrapper>
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-gray-200 overflow-hidden">
        {recipe.cover_image_url
          ? <img src={recipe.cover_image_url} alt={recipe.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-red-50 to-orange-50">🍽️</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={DIFFICULTY_COLOR[recipe.difficulty]}>{recipe.difficulty}</Badge>
            {recipe.category && <Badge variant="blue">{recipe.category.name}</Badge>}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">{recipe.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-200 flex-wrap">
            <Link to={`/users/${recipe.author?.id}`} className="hover:text-white flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center text-xs font-bold overflow-hidden">
                {recipe.author?.avatar_url
                  ? <img src={recipe.author.avatar_url} className="w-full h-full object-cover" alt="" />
                  : recipe.author?.name?.[0]}
              </div>
              {recipe.author?.name}
            </Link>
            <span>·</span>
            <span>{timeAgo(recipe.createdAt)}</span>
            {(recipe.region || recipe.country) && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  {recipe.country?.flag_emoji} <MapPin className="w-3 h-3" />
                  {recipe.region?.name || recipe.country?.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Meta bar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-wrap items-center gap-6">
          {recipe.prep_time > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Persiapan</p>
              <p className="font-bold text-gray-900 flex items-center gap-1"><Clock className="w-4 h-4 text-red-400" />{recipe.prep_time} mnt</p>
            </div>
          )}
          {recipe.cook_time > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Memasak</p>
              <p className="font-bold text-gray-900 flex items-center gap-1"><ChefHat className="w-4 h-4 text-red-400" />{recipe.cook_time} mnt</p>
            </div>
          )}
          {totalTime > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Total</p>
              <p className="font-bold text-gray-900">{totalTime} mnt</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">Porsi</p>
            <p className="font-bold text-gray-900 flex items-center gap-1"><Users className="w-4 h-4 text-red-400" />{recipe.servings}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">Rating</p>
            <p className="font-bold text-gray-900 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {Number(recipe.rating_avg || 0).toFixed(1)}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant={saved ? 'primary' : 'outline'} size="sm" loading={saving} onClick={handleSave}>
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
              {saved ? 'Tersimpan' : 'Simpan'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {linkCopied ? 'Disalin!' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-gray-600 leading-relaxed mb-8">{recipe.description}</p>
        )}

        <div className="grid md:grid-cols-5 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bahan-bahan</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <ul className="space-y-3">
                {recipe.ingredients?.map((ing) => (
                  <li key={ing.id}
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => setCheckedIngredients(p => ({ ...p, [ing.id]: !p[ing.id] }))}>
                    <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${checkedIngredients[ing.id] ? 'bg-red-500 border-red-500' : 'border-gray-300 group-hover:border-red-300'}`}>
                      {checkedIngredients[ing.id] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm leading-relaxed transition ${checkedIngredients[ing.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {ing.amount && <span className="font-medium">{ing.amount} {ing.unit} </span>}
                      {ing.name}
                      {ing.notes && <span className="text-gray-400 text-xs"> ({ing.notes})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cara Memasak</h2>
            <ol className="space-y-5">
              {recipe.steps?.sort((a, b) => a.step_number - b.step_number).map((step) => (
                <li key={step.id} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{step.step_number}</div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                    {step.duration_minutes > 0 && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{step.duration_minutes} menit
                      </p>
                    )}
                    {step.image_url && (
                      <img src={step.image_url} alt={`Step ${step.step_number}`} className="mt-3 rounded-xl w-full max-h-48 object-cover" />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {recipe.tags.map(tag => (
              <Link key={tag.id} to={`/explore?tag=${tag.slug}`}>
                <Badge className="hover:bg-red-100 hover:text-red-700 cursor-pointer transition">#{tag.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Rating section */}
        <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Rating & Ulasan</h2>

          {/* Summary */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">{Number(recipe.rating_avg || 0).toFixed(1)}</p>
              <RatingStars value={Math.round(recipe.rating_avg || 0)} size="sm" />
              <p className="text-xs text-gray-400 mt-1">{ratingsData?.length || 0} ulasan</p>
            </div>
          </div>

          {/* Submit rating */}
          {isAuthenticated ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-3">Beri penilaianmu:</p>
              <RatingStars value={userRating} onChange={setUserRating} size="lg" />
              <textarea
                className="w-full mt-3 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                rows={3}
                placeholder="Tulis ulasanmu (opsional)..."
                value={review}
                onChange={e => setReview(e.target.value)}
              />
              <Button className="mt-3" size="sm" onClick={handleRating} loading={ratingPending} disabled={!userRating}>
                Kirim Ulasan
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              <Link to="/login" className="text-red-500 font-medium hover:underline">Login</Link> untuk memberi rating.
            </p>
          )}

          {/* Reviews list */}
          {ratingsData?.length > 0 && (
            <div className="space-y-4">
              {ratingsData.map(r => (
                <div key={r.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600 flex-shrink-0">
                    {r.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{r.user?.name}</span>
                      <RatingStars value={r.score} size="sm" />
                    </div>
                    {r.review_text && <p className="text-sm text-gray-600">{r.review_text}</p>}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(r.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related recipes */}
        {relatedFiltered?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Resep Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedFiltered.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
