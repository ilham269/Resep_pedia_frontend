import { Link } from 'react-router-dom';
import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <ChefHat className="w-5 h-5 text-red-400" /> ResepPedia
          </div>
          <p className="text-sm leading-relaxed">Platform resep masakan terlengkap dari seluruh Indonesia dan dunia.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Jelajahi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-white transition">Semua Resep</Link></li>
            <li><Link to="/categories" className="hover:text-white transition">Kategori</Link></li>
            <li><Link to="/regions" className="hover:text-white transition">Daerah</Link></li>
            <li><Link to="/explore?sort=popular" className="hover:text-white transition">Trending</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Akun</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Daftar</Link></li>
            <li><Link to="/submit" className="hover:text-white transition">Submit Resep</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Populer</h4>
          <ul className="space-y-2 text-sm">
            {['Rendang', 'Nasi Goreng', 'Soto Ayam', 'Gado-gado'].map(r => (
              <li key={r}>
                <Link to={`/explore?q=${r}`} className="hover:text-white transition">{r}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>© {new Date().getFullYear()} ResepPedia. All rights reserved.</p>
        <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for food lovers</p>
      </div>
    </footer>
  );
}
