import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Users, BookOpen, Clock, BarChart2, Trash2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import api from '../services/api';
import toast from 'react-hot-toast';
import { timeAgo } from '../utils/formatDate';

const tabs = [
  { id: 'pending', label: 'Pending Resep', icon: Clock },
  { id: 'users', label: 'Manajemen User', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const qc = useQueryClient();

  const { data: pending, isLoading: loadingPending } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: () => api.get('/admin/recipes/pending').then(r => r.data.data),
    enabled: activeTab === 'pending',
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data.data),
    enabled: activeTab === 'users',
  });

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data.data),
  });

  const approve = useMutation({
    mutationFn: (id) => api.put(`/admin/recipes/${id}/approve`),
    onSuccess: () => { toast.success('Resep dipublish!'); qc.invalidateQueries({ queryKey: ['admin-pending'] }); },
  });

  const reject = useMutation({
    mutationFn: (id) => api.put(`/admin/recipes/${id}/reject`),
    onSuccess: () => { toast.success('Resep ditolak.'); qc.invalidateQueries({ queryKey: ['admin-pending'] }); },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { toast.success('User dihapus.'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { toast.success('Role diupdate.'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
  });

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-500 mb-8">Kelola resep, user, dan konten ResepPedia</p>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Resep', value: analytics.totalRecipes, icon: BookOpen, color: 'text-blue-500' },
              { label: 'Total User', value: analytics.totalUsers, icon: Users, color: 'text-green-500' },
              { label: 'Pending Review', value: analytics.pendingRecipes, icon: Clock, color: 'text-yellow-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Pending Recipes */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {loadingPending && <p className="text-gray-400">Memuat...</p>}
            {!loadingPending && !pending?.length && (
              <div className="text-center py-16 text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p>Tidak ada resep yang perlu direview</p>
              </div>
            )}
            {pending?.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl p-5 shadow-sm flex gap-4 items-start">
                {recipe.cover_image_url && (
                  <img src={recipe.cover_image_url} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt={recipe.title} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    oleh <span className="font-medium">{recipe.author?.name}</span> · {timeAgo(recipe.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" onClick={() => approve.mutate(recipe.id)} loading={approve.isPending}>
                    <CheckCircle className="w-4 h-4" /> Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => reject.mutate(recipe.id)} loading={reject.isPending}>
                    <XCircle className="w-4 h-4" /> Tolak
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Nama', 'Email', 'Role', 'Bergabung', 'Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingUsers && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>}
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        value={user.role}
                        onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value })}
                      >
                        <option value="user">user</option>
                        <option value="contributor">contributor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{timeAgo(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteUser.mutate(user.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-400">
            <BarChart2 className="w-12 h-12 mx-auto mb-3" />
            <p>Chart analytics akan hadir segera.</p>
            <p className="text-sm mt-1">Data sudah tersedia di tab lain.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
