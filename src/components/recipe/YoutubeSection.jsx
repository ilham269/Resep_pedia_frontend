import { useState } from 'react';
import { Youtube, ExternalLink, Play } from 'lucide-react';

export default function YoutubeSection({ recipeTitle, youtubeUrl }) {
  const [showEmbed, setShowEmbed] = useState(false);

  const searchQuery = encodeURIComponent(`resep ${recipeTitle} cara memasak`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  // Extract video ID dari embed URL
  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/youtube\.com\/embed\/([^?&]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;
  const embedUrl = videoId
    ? `${youtubeUrl}?rel=0&modestbranding=1&autoplay=1`
    : null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Youtube className="w-6 h-6 text-red-500" />
          Video Tutorial
        </h2>
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-red-500 hover:underline"
        >
          Cari di YouTube <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Content */}
      {embedUrl && videoId ? (
        showEmbed ? (
          // Embed player
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedUrl}
              title={`Tutorial ${recipeTitle}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          // Thumbnail dengan tombol play
          <div className="relative cursor-pointer group" onClick={() => setShowEmbed(true)}>
            <img
              src={thumbnailUrl}
              alt={`Tutorial ${recipeTitle}`}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                // Fallback ke thumbnail kualitas lebih rendah
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
            {/* YouTube badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Youtube className="w-3 h-3 text-red-400" /> YouTube
            </div>
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Klik untuk memutar
            </div>
          </div>
        )
      ) : (
        // Tidak ada video — tampilkan search suggestions
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Temukan video tutorial <strong>{recipeTitle}</strong> di YouTube:
          </p>
          <div className="space-y-2">
            {[
              `Resep ${recipeTitle} mudah`,
              `Cara membuat ${recipeTitle} enak`,
              `${recipeTitle} tradisional`,
              `Tutorial ${recipeTitle} lengkap`,
            ].map((query) => (
              <a
                key={query}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition group"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-red-600 transition flex-1">{query}</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
