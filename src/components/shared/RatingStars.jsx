import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RatingStars({ value = 0, onChange, size = 'md' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={cn('transition', onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default')}
        >
          <Star className={cn(sizes[size], star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
        </button>
      ))}
    </div>
  );
}
