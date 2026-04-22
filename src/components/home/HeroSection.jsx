import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/explore?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 text-8xl grid grid-cols-8 gap-4 p-4 pointer-events-none select-none">
        {['🍜','🍛','🍲','🥘','🍱','🍣','🥗','🍝'].map((e, i) => (
          <span key={i} className="flex items-center justify-center">{e}</span>
        ))}
      </div>
      <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Temukan Resep <span className="text-yellow-300">Terbaik</span>
        </h1>
        <p className="text-lg md:text-xl text-red-100 mb-8">
          Ribuan resep masakan dari seluruh Indonesia & dunia
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Cari resep, bahan, atau daerah..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 rounded-xl transition">
            Cari
          </button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          {['Rendang', 'Soto', 'Nasi Goreng', 'Gado-gado', 'Sushi'].map((tag) => (
            <button key={tag} onClick={() => navigate(`/explore?q=${tag}`)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
