import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearchStore } from '../../stores/searchStore';
import { useDebounce } from '../../hooks/useDebounce';
import { recipeService } from '../../services/recipeService';

const RECENT_KEY = 'recent_searches';

export default function SearchModal() {
  const { isOpen, closeSearch } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
    catch { return []; }
  });
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQ = useDebounce(query, 350);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(''); setResults([]); }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQ.trim()) { setResults([]); return; }
    setLoading(true);
    recipeService.search(debouncedQ, { limit: 5 })
      .then(r => setResults(r.data.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQ]);

  const handleSelect = (q) => {
    const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    closeSearch();
    navigate(`/explore?q=${encodeURIComponent(q)}`);
  };

  const removeRecent = (q, e) => {
    e.stopPropagation();
    const updated = recent.filter(r => r !== q);
    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50" onClick={closeSearch}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 text-base outline-none placeholder-gray-400"
            placeholder="Cari resep, bahan, atau daerah..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && query.trim() && handleSelect(query.trim())}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={closeSearch} className="text-sm text-gray-400 hover:text-gray-600 ml-2">ESC</button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="px-5 py-4 text-sm text-gray-400">Mencari...</div>
          )}

          {/* Search results */}
          {!loading && results.length > 0 && (
            <div className="py-2">
              <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase">Hasil Pencarian</p>
              {results.map(r => (
                <button key={r.id} onClick={() => { closeSearch(); navigate(`/recipes/${r.slug}`); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-left">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {r.cover_image_url
                      ? <img src={r.cover_image_url} className="w-full h-full object-cover" alt={r.title} />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">oleh {r.author?.name}</p>
                  </div>
                </button>
              ))}
              <button onClick={() => handleSelect(query)}
                className="w-full px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition text-left font-medium">
                Lihat semua hasil untuk "{query}" →
              </button>
            </div>
          )}

          {/* No results */}
          {!loading && query && results.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              Tidak ada hasil untuk "{query}"
            </div>
          )}

          {/* Recent & suggestions */}
          {!query && (
            <div className="py-2">
              {recent.length > 0 && (
                <>
                  <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase">Pencarian Terakhir</p>
                  {recent.map(r => (
                    <button key={r} onClick={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition text-left">
                      <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700">{r}</span>
                      <span onClick={e => removeRecent(r, e)} className="text-gray-300 hover:text-gray-500 text-xs">✕</span>
                    </button>
                  ))}
                </>
              )}
              <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase">Populer</p>
              {['Rendang', 'Nasi Goreng', 'Soto Ayam', 'Gado-gado', 'Ayam Betutu'].map(s => (
                <button key={s} onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition text-left">
                  <TrendingUp className="w-4 h-4 text-red-300 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
