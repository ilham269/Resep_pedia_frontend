import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCategories, useRegions, useSubmitRecipe } from '../hooks/useRecipes';
import { useRecipeFormStore } from '../stores/recipeFormStore';

const STEPS = ['Info Dasar', 'Bahan-bahan', 'Langkah Memasak', 'Detail', 'Preview'];

// Field yang divalidasi per step
const STEP_FIELDS = {
  1: ['title'],
  2: ['ingredients'],
  3: ['steps'],
  4: ['difficulty', 'servings'],
};

const schema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  region_id: z.string().optional(),
  difficulty: z.enum(['mudah', 'sedang', 'sulit']),
  servings: z.coerce.number().min(1, 'Porsi minimal 1'),
  prep_time: z.coerce.number().optional(),
  cook_time: z.coerce.number().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1, 'Nama bahan wajib diisi'),
    amount: z.string().optional(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, 'Minimal 1 bahan'),
  steps: z.array(z.object({
    step_number: z.coerce.number(),
    instruction: z.string().min(1, 'Instruksi wajib diisi'),
    duration_minutes: z.coerce.number().optional(),
  })).min(1, 'Minimal 1 langkah'),
  tags: z.string().optional(),
});

export default function SubmitRecipePage() {
  const navigate = useNavigate();
  const { currentStep, setStep } = useRecipeFormStore();
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const { data: categories } = useCategories();
  const { data: regions } = useRegions();
  const { mutate: submitRecipe, isPending } = useSubmitRecipe();

  const { register, handleSubmit, control, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      difficulty: 'mudah',
      servings: 2,
      ingredients: [{ name: '', amount: '', unit: '', notes: '' }],
      steps: [{ step_number: 1, instruction: '', duration_minutes: '' }],
    },
  });

  const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: 'ingredients' });
  const { fields: stepFields, append: addStep, remove: removeStep } = useFieldArray({ control, name: 'steps' });
  const formValues = watch();

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return; // stop jika ada error
    }
    setStep(currentStep + 1);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.append('title', data.title);
    if (data.description) fd.append('description', data.description);
    if (data.category_id) fd.append('category_id', data.category_id);
    if (data.region_id) fd.append('region_id', data.region_id);
    fd.append('difficulty', data.difficulty);
    fd.append('servings', data.servings);
    if (data.prep_time) fd.append('prep_time', data.prep_time);
    if (data.cook_time) fd.append('cook_time', data.cook_time);
    fd.append('ingredients', JSON.stringify(data.ingredients));
    fd.append('steps', JSON.stringify(data.steps));
    if (data.tags) fd.append('tags', JSON.stringify(data.tags.split(',').map(t => t.trim()).filter(Boolean)));
    if (coverFile) fd.append('cover_image', coverFile);

    submitRecipe(fd, { onSuccess: () => { setStep(1); navigate('/dashboard'); } });
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Resep</h1>
        <p className="text-gray-500 mb-8">Bagikan resep kamu ke jutaan pecinta kuliner</p>

        {/* Progress bar */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i + 1 <= currentStep ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`hidden sm:block ml-2 text-xs font-medium ${i + 1 === currentStep ? 'text-red-500' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${i + 1 < currentStep ? 'bg-red-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ── Step 1: Info Dasar ── */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <Input
                label="Judul Resep *"
                placeholder="Contoh: Rendang Padang Asli"
                error={errors.title?.message}
                {...register('title')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={3}
                  placeholder="Ceritakan sedikit tentang resep ini..."
                  {...register('description')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" {...register('category_id')}>
                    <option value="">Pilih kategori</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daerah Asal</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" {...register('region_id')}>
                    <option value="">Pilih daerah</option>
                    {regions?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Cover</label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition overflow-hidden">
                  {coverPreview
                    ? <img src={coverPreview} className="w-full h-full object-cover" alt="preview" />
                    : <div className="flex flex-col items-center gap-2 text-gray-400"><Upload className="w-8 h-8" /><span className="text-sm">Klik untuk upload foto</span></div>
                  }
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>
            </div>
          )}

          {/* ── Step 2: Bahan ── */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Bahan-bahan</h2>
                <span className="text-xs text-gray-400">{ingFields.length} bahan</span>
              </div>
              {errors.ingredients?.root && (
                <p className="text-red-500 text-sm">{errors.ingredients.root.message}</p>
              )}
              {ingFields.map((field, i) => (
                <div key={field.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-2">{i + 1}</span>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="col-span-3 sm:col-span-1">
                      <Input placeholder="Nama bahan *" error={errors.ingredients?.[i]?.name?.message} {...register(`ingredients.${i}.name`)} />
                    </div>
                    <Input placeholder="Jumlah" {...register(`ingredients.${i}.amount`)} />
                    <Input placeholder="Satuan (gram, sdm...)" {...register(`ingredients.${i}.unit`)} />
                    <div className="col-span-3">
                      <Input placeholder="Catatan (opsional)" {...register(`ingredients.${i}.notes`)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeIng(i)} disabled={ingFields.length === 1} className="mt-2 p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addIng({ name: '', amount: '', unit: '', notes: '' })}>
                <Plus className="w-4 h-4" /> Tambah Bahan
              </Button>
            </div>
          )}

          {/* ── Step 3: Langkah ── */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Langkah Memasak</h2>
                <span className="text-xs text-gray-400">{stepFields.length} langkah</span>
              </div>
              {stepFields.map((field, i) => (
                <div key={field.id} className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.steps?.[i]?.instruction ? 'border-red-400' : 'border-gray-300'}`}
                      rows={2}
                      placeholder={`Jelaskan langkah ${i + 1}...`}
                      {...register(`steps.${i}.instruction`)}
                    />
                    {errors.steps?.[i]?.instruction && (
                      <p className="text-red-500 text-xs">{errors.steps[i].instruction.message}</p>
                    )}
                    <Input placeholder="Durasi (menit, opsional)" type="number" min="0" {...register(`steps.${i}.duration_minutes`)} />
                  </div>
                  <button type="button" onClick={() => removeStep(i)} disabled={stepFields.length === 1} className="mt-1 p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => addStep({ step_number: stepFields.length + 1, instruction: '', duration_minutes: '' })}>
                <Plus className="w-4 h-4" /> Tambah Langkah
              </Button>
            </div>
          )}

          {/* ── Step 4: Detail ── */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kesulitan *</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" {...register('difficulty')}>
                    <option value="mudah">😊 Mudah</option>
                    <option value="sedang">😐 Sedang</option>
                    <option value="sulit">😤 Sulit</option>
                  </select>
                </div>
                <Input label="Porsi *" type="number" min="1" error={errors.servings?.message} {...register('servings')} />
                <Input label="Waktu Persiapan (mnt)" type="number" min="0" {...register('prep_time')} />
              </div>
              <Input label="Waktu Memasak (mnt)" type="number" min="0" {...register('cook_time')} />
              <div>
                <Input label="Tags (pisah koma)" placeholder="rendang, daging, padang, spicy" {...register('tags')} />
                <p className="text-xs text-gray-400 mt-1">Contoh: rendang, daging, padang</p>
              </div>
            </div>
          )}

          {/* ── Step 5: Preview ── */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {coverPreview && <img src={coverPreview} className="w-full h-52 object-cover" alt="cover" />}
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">{formValues.title}</h2>
                  {formValues.description && <p className="text-gray-600 text-sm">{formValues.description}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {(formValues.prep_time || formValues.cook_time) && (
                      <span>⏱ {(Number(formValues.prep_time) || 0) + (Number(formValues.cook_time) || 0)} mnt</span>
                    )}
                    <span>👥 {formValues.servings} porsi</span>
                    <span>📊 {formValues.difficulty}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">Bahan-bahan ({formValues.ingredients?.length})</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formValues.ingredients?.map((ing, i) => ing.name && (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                          {ing.amount} {ing.unit} {ing.name}
                          {ing.notes && <span className="text-gray-400">({ing.notes})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">Langkah Memasak ({formValues.steps?.length})</h3>
                    <ol className="text-sm text-gray-600 space-y-2">
                      {formValues.steps?.map((s, i) => s.instruction && (
                        <li key={i} className="flex gap-3">
                          <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                          {s.instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                ⚠️ Resep akan masuk status <strong>pending</strong> dan perlu disetujui admin sebelum tampil ke publik.
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Button>

            {currentStep < 5 ? (
              <Button type="button" onClick={handleNext}>
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" loading={isPending}>
                Submit Resep 🚀
              </Button>
            )}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
