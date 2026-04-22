# 🍜 ResepPedia — Frontend

Aplikasi web platform resep masakan ResepPedia, dibangun dengan React + Vite + Tailwind CSS.

> 🔗 Backend API: [Resep_pedia](https://github.com/ilham269/Resep_pedia)

---

## 🚀 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 19 + Vite 5 |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| Client State | Zustand v5 |
| Styling | Tailwind CSS v3 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios + interceptor JWT |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Animations | CSS Transitions (Tailwind) |

---

## ✨ Fitur

### 🏠 Homepage
- Hero section dengan search bar & quick tags
- Carousel resep unggulan (horizontal scroll)
- Grid kategori dengan icon
- Grid resep trending
- CTA banner submit resep

### 🔍 Explore
- Search real-time dengan debounce 400ms
- Filter by kategori & kesulitan
- Sort by terbaru, terpopuler, rating tertinggi
- Pagination
- Empty state yang informatif

### 📖 Detail Resep
- Cover image full-width dengan gradient overlay
- Meta bar (waktu, porsi, rating)
- Ingredient checklist interaktif (klik untuk coret)
- Step-by-step dengan foto & durasi
- Rating bintang interaktif + form review
- List ulasan dari user lain
- Resep serupa (related recipes)
- Tombol simpan & share (copy link)

### ✍️ Submit Resep (Multi-Step Form)
- Step 1 — Info dasar: judul, deskripsi, kategori, daerah, cover photo
- Step 2 — Bahan-bahan: dynamic add/remove ingredients
- Step 3 — Langkah memasak: dynamic add/remove steps + durasi
- Step 4 — Detail: kesulitan, porsi, waktu, tags
- Step 5 — Preview sebelum submit
- Validasi per step (tidak bisa lanjut kalau ada error)
- Auto-save draft ke localStorage

### 👤 Dashboard
- Profil user dengan stats
- Tab resep saya (dengan status badge + delete)
- Tab resep tersimpan
- Edit profil (nama, bio, lokasi)

### 🛡️ Admin Panel
- Stats card (total resep, user, pending)
- Approve / reject resep pending
- Manajemen user (lihat, ubah role, hapus)

### 🔐 Auth
- Login dengan validasi Zod
- Register dengan password strength check
- Forgot password (kirim email)
- Reset password dengan token
- Protected routes (login required)
- Admin-only routes

### 🔎 Search Modal
- Buka dengan klik icon atau `Ctrl+K`
- Live search results saat mengetik
- Recent searches (tersimpan di localStorage)
- Daftar pencarian populer

### 📂 Halaman Lain
- `/categories` — Grid semua kategori
- `/regions` — Daerah & negara dengan flag
- `/users/:id` — Profil publik user + resep mereka

---

## 📁 Struktur Folder

```
frontend/src/
├── components/
│   ├── home/          # HeroSection, CategoryGrid, FeaturedCarousel
│   ├── layout/        # Navbar, Footer, PageWrapper, ProtectedRoute
│   ├── recipe/        # RecipeCard, RecipeGrid
│   ├── shared/        # RatingStars, RegionBadge, SearchModal
│   └── ui/            # Button, Input, Badge, SkeletonCard, ConfirmDialog
├── hooks/
│   ├── useRecipes.js  # React Query hooks untuk semua data resep
│   ├── useDebounce.js
│   └── useLocalStorage.js
├── pages/
│   ├── HomePage.jsx
│   ├── ExplorePage.jsx
│   ├── RecipeDetailPage.jsx
│   ├── SubmitRecipePage.jsx
│   ├── DashboardPage.jsx
│   ├── AdminPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── CategoriesPage.jsx
│   ├── RegionsPage.jsx
│   └── UserProfilePage.jsx
├── services/
│   ├── api.js          # Axios instance + interceptor JWT
│   ├── authService.js
│   └── recipeService.js
├── stores/
│   ├── authStore.js        # User & token (persist)
│   ├── searchStore.js      # Search state
│   ├── uiStore.js          # Sidebar, confirm dialog
│   └── recipeFormStore.js  # Multi-step form draft (persist)
├── utils/
│   ├── cn.js           # Class name helper
│   ├── constants.js    # DIFFICULTY_COLOR, STATUS_COLOR
│   └── formatDate.js   # formatDate, timeAgo
├── App.jsx             # QueryClient + BrowserRouter + Toaster
├── router.jsx          # Route definitions
└── main.jsx            # Entry point + ErrorBoundary
```

---

## 🛠️ Instalasi & Setup

### 1. Clone & Install

```bash
git clone https://github.com/ilham269/Resep_pedia_frontend.git
cd Resep_pedia_frontend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api

# Opsional — untuk upload gambar langsung dari frontend
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_CLOUD_NAME=
```

### 3. Pastikan Backend Sudah Jalan

Frontend butuh backend API. Jalankan backend dulu di port `3000`.

> Setup backend: [Resep_pedia](https://github.com/ilham269/Resep_pedia)

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka `http://localhost:5173`

---

## 📡 Routing

| Route | Halaman | Akses |
|---|---|---|
| `/` | Homepage | Public |
| `/explore` | Jelajahi resep | Public |
| `/recipes/:slug` | Detail resep | Public |
| `/categories` | Semua kategori | Public |
| `/regions` | Daerah & negara | Public |
| `/users/:id` | Profil publik user | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Lupa password | Public |
| `/reset-password/:token` | Reset password | Public |
| `/submit` | Submit resep | Login required |
| `/dashboard` | Dashboard user | Login required |
| `/admin` | Admin panel | Admin only |

---

## 🗂️ State Management

### Zustand Stores

```js
// Auth state (persisted ke localStorage)
useAuthStore → { user, token, isAuthenticated, login(), logout() }

// Search modal state
useSearchStore → { isOpen, query, openSearch(), closeSearch() }

// UI state
useUIStore → { confirmDialog, openConfirm(), closeConfirm() }

// Multi-step form draft (persisted ke localStorage)
useRecipeFormStore → { formData, currentStep, setStep(), resetForm() }
```

### React Query Keys

```js
['recipes', filters]   // List resep
['recipe', slug]       // Detail resep
['featured']           // Resep unggulan
['trending']           // Resep trending
['categories']         // Semua kategori
['regions']            // Semua daerah
['countries']          // Semua negara
['my-recipes']         // Resep milik user
['saved']              // Resep tersimpan
['ratings', recipeId]  // Rating resep
```

---

## 📦 Scripts

```bash
npm run dev      # Jalankan dev server (port 5173)
npm run build    # Build untuk production
npm run preview  # Preview hasil build
npm run lint     # Lint dengan ESLint
```

---

## 🎨 Design System

- **Primary color**: Red (`#EF4444` / `red-500`)
- **Border radius**: `rounded-xl` untuk cards, `rounded-lg` untuk inputs
- **Shadow**: `shadow-sm` default, `shadow-md` on hover
- **Typography**: System font, bold headings, medium labels
- **Breakpoints**: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

### Komponen UI Reusable

```jsx
<Button variant="primary|secondary|outline|ghost|danger" size="sm|md|lg" loading />
<Input label="..." error="..." />
<Badge variant="default|red|green|yellow|blue" />
<SkeletonCard />   // Loading placeholder
<ConfirmDialog />  // Modal konfirmasi destructive action
```

---

## 🔐 Auth Flow

```
1. User login → dapat JWT token
2. Token disimpan di localStorage + Zustand store
3. Axios interceptor otomatis sisipkan token di setiap request
4. Kalau response 401 → auto redirect ke /login
5. ProtectedRoute cek isAuthenticated dari Zustand
6. AdminRoute cek user.role === 'admin'
```

---

## 🤝 Kontribusi

1. Fork repo ini
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Commit: `git commit -m "feat: tambah fitur X"`
4. Push: `git push origin feat/nama-fitur`
5. Buat Pull Request

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan apapun.

---

<p align="center">Made with ❤️ by <a href="https://github.com/ilham269">ilham269</a></p>
