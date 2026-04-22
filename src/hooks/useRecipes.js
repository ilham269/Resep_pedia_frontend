import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import toast from 'react-hot-toast';

export const useRecipes = (filters) =>
  useQuery({ queryKey: ['recipes', filters], queryFn: () => recipeService.getAll(filters).then(r => r.data) });

export const useRecipe = (slug) =>
  useQuery({ queryKey: ['recipe', slug], queryFn: () => recipeService.getBySlug(slug).then(r => r.data.data), enabled: !!slug });

export const useFeaturedRecipes = () =>
  useQuery({ queryKey: ['featured'], queryFn: () => recipeService.getFeatured().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useTrendingRecipes = () =>
  useQuery({ queryKey: ['trending'], queryFn: () => recipeService.getTrending().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: () => recipeService.getCategories().then(r => r.data.data), staleTime: 10 * 60 * 1000 });

export const useRegions = () =>
  useQuery({ queryKey: ['regions'], queryFn: () => recipeService.getRegions().then(r => r.data.data), staleTime: 10 * 60 * 1000 });

export const useCountries = () =>
  useQuery({ queryKey: ['countries'], queryFn: () => recipeService.getCountries().then(r => r.data.data), staleTime: 10 * 60 * 1000 });

export const useSaveRecipe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved }) => saved ? recipeService.unsave(id) : recipeService.save(id),
    onSuccess: (_, { saved }) => {
      toast.success(saved ? 'Dihapus dari koleksi' : 'Resep disimpan!');
      qc.invalidateQueries({ queryKey: ['saved'] });
    },
    onError: () => toast.error('Gagal menyimpan resep'),
  });
};

export const useSubmitRecipe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => recipeService.create(data),
    onSuccess: () => { toast.success('Resep berhasil dikirim!'); qc.invalidateQueries({ queryKey: ['recipes'] }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal mengirim resep'),
  });
};

export const useRating = (recipeId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => recipeService.submitRating(recipeId, data),
    onSuccess: () => { toast.success('Rating berhasil dikirim!'); qc.invalidateQueries({ queryKey: ['recipe'] }); },
    onError: () => toast.error('Gagal mengirim rating'),
  });
};
