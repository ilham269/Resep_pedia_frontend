import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, User, Edit2, Trash2, Eye, Plus } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import RecipeCard from '../components/recipe/RecipeCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { STATUS_COLOR } from '../utils/constants';

const tabs = [
  { id: 'recipes', label: 'Resep Saya', icon: BookOpen },
  { id: 'saved', label: 'Tersimpan', icon: Bookmark },
  { id: 'profile', label: 'Edit Profil', icon: User },
];

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const { openConfirm } = useUIStore();
  const [activeTab, setActiveTab] = useState('recipes');
  const qc = useQueryClient();

  const { data: myRecipes, isLoading: loadingRecipes } = useQuery({
    queryKey: ['my-recipes'],
    queryFn: () => api.get('/users/me/recipes').then(r => r.data.data),
  });

  const { data: saved, isLoading: loadingSaved } = useQuery({
    queryKey: ['saved'],
    queryFn: () => api.get('/users/me/saved').then(r => r.data.data),
    enabled: activeTab === 'saved',
  });

  const deleteRecipe = useMutation({
    mutationFn: (id) => api.delete(`/recipes/${id}`),
    onSuccess: () => { toast.success('Resep dihapus.'); qc.invalidateQueries({ queryKey: ['my-recipes'] }); },
    onError: () => toast.error('Gagal menghapus resep.'),
  });

  const handleDelete = (recipe) => {
    openConfirm({
      title: 'Hapus Resep',
      message: `Yakin ingin menghapus "${recipe.title}"? Aksi ini tidak bisa dibatalkan.`,
      danger: true,
      onConfirm: () => deleteRecipe.mutate(recipe.id),
    });
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-600 overflow-hidden flex-shrink-0">
            {user?.avatar_url
              ? <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.name} />
              : user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user?.role === 'admin' ? 'red' : 'blue'}>{user?.role}</Badge>
              {user?.location && <span className="text-xs text-gray-400">📍 {user.location}</span>}
            </div>
          </div>
          <Link to="/submit">
            <Button size="sm"><Plus className="w-4 h-4" /> Resep Baru</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Resep Saya */}
        {activeTab === 'recipes' && (
          <div>
            {loadingRecipes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />)}
              </div>
            ) : !myRecipes?.length ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-5xl mb-4">🍳</p>
                <p className="text-gray-500 mb-4">Belum ada resep. Yuk bagikan resep pertamamu!</p>
                <Link to="/submit"><Button>Buat Resep</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRecipes.map((r) => (
                  <div key={r.id} className="relative group">
                    <RecipeCard recipe={r} />
                    {/* Status badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={STATUS_COLOR[r.status]}>{r.status}</Badge>
                    </div>
                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition rounded-xl flex items-end justify-end p-3 gap-2 opacity-0 group-hover:opacity-100">
                      <Link to={`/recipes/${r.slug}`}>
                        <button className="bg-white rounded-lg p-2 shadow hover:bg-gray-50 transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(r)} className="bg-white rounded-lg p-2 shadow hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tersimpan */}
        {activeTab === 'saved' && (
          <div>
            {loadingSaved ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />)}
              </div>
            ) : !saved?.length ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-5xl mb-4">🔖</p>
                <p className="text-gray-500 mb-4">Belum ada resep tersimpan.</p>
                <Link to="/explore"><Button variant="outline">Jelajahi Resep</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map((r) => r && <RecipeCard key={r.id} recipe={r} />)}
              </div>
            )}
          </div>
        )}

        {/* Edit Profil */}
        {activeTab === 'profile' && (
          <ProfileEditForm user={user} setUser={setUser} />
        )}
      </div>
    </PageWrapper>
  );
}

function ProfileEditForm({ user, setUser }) {
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', location: user?.location || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/me', form);
      setUser(res.data.data);
      toast.success('Profil berhasil diupdate!');
    } catch {
      toast.error('Gagal mengupdate profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-lg">
      <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Edit2 className="w-5 h-5 text-red-500" /> Edit Profil
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Lengkap"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            rows={3}
            placeholder="Ceritakan sedikit tentang dirimu..."
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <Input
          label="Lokasi"
          placeholder="Jakarta, Indonesia"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        <Button type="submit" loading={loading}>Simpan Perubahan</Button>
      </form>
    </div>
  );
}
