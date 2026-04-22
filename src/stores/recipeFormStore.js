import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialForm = {
  title: '', description: '', category_id: '', region_id: '', country_id: '',
  difficulty: 'mudah', servings: 2, prep_time: '', cook_time: '',
  ingredients: [{ name: '', amount: '', unit: '', notes: '' }],
  steps: [{ step_number: 1, instruction: '', duration_minutes: '' }],
  tags: [], cover_image: null,
};

export const useRecipeFormStore = create(
  persist(
    (set) => ({
      formData: initialForm,
      currentStep: 1,
      setField: (key, value) => set((s) => ({ formData: { ...s.formData, [key]: value } })),
      setStep: (step) => set({ currentStep: step }),
      saveDraft: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
      resetForm: () => set({ formData: initialForm, currentStep: 1 }),
    }),
    { name: 'recipe-draft', partialize: (s) => ({ formData: s.formData, currentStep: s.currentStep }) }
  )
);
