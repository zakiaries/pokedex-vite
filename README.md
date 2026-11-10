# Pokédex Web App

Aplikasi web Pokédex untuk Frontend Technical Assessment. Data diambil dari [PokéAPI](https://pokeapi.co/docs/v2) untuk menampilkan daftar Pokémon, detailnya, pencarian, filter, dan daftar favorit.

## Screenshot

**Home**

<img width="1896" height="954" alt="image" src="https://github.com/user-attachments/assets/cd5b10a0-81f7-4f3f-ab50-840a8df1207c" />

**Detail**

<img width="1893" height="958" alt="image" src="https://github.com/user-attachments/assets/efd2ab25-62f1-4d3a-9ef7-23b1c1acef5e" />

**Favorites**

<img width="1910" height="962" alt="image" src="https://github.com/user-attachments/assets/59f13ff7-7242-4801-b848-71652e5399f8" />

**Mobile**

<img width="396" height="863" alt="image" src="https://github.com/user-attachments/assets/dd628b40-5a54-4c04-9470-3ce989c3b048" />

## Fitur

- **Listing:** grid Pokémon dengan pagination (20 data per halaman).
- **Search & Filter:** cari berdasarkan nama atau nomor, filter berdasarkan Tipe dan Generasi, serta urutkan (nomor atau nama). Semua filter digabung (logika AND) dan diproses di client.
- **Detail:** tipe, abilities, tinggi, berat, base stats, info spesies, dan rantai evolusi.
- **Favorites:** tambah atau hapus favorit dari card dan halaman detail, ada halaman `/favorites`, dan data tetap ada setelah refresh (localStorage).
- **UI/UX:** responsive desktop dan mobile, loading spinner, empty state, dan error state dengan tombol coba lagi.

## Tech Stack

- React + TypeScript, Vite
- Tailwind CSS
- React Router
- Zustand (client state)
- TanStack Query (server state)
- Axios

## Menjalankan Aplikasi

Prasyarat: Node.js 20.19 atau lebih baru (syarat Vite 8).

```bash
git clone https://github.com/zakiaries/pokedex-vite.git
cd pokedex-vite
npm install
npm run dev
```

Buka http://localhost:5173.

Perintah lain:

```bash
npm run build     # type-check + build produksi
npm run preview   # preview hasil build
npm run lint      # cek lint
```

## Struktur Proyek

```
src/
  api/          # fungsi fetch ke PokéAPI (satu-satunya tempat yang memanggil axios)
  components/   # komponen UI reusable (PokemonCard, FilterPanel, FilterSelect, Pagination, Navbar, LoadingSpinner)
  hooks/        # custom hooks: usePokemon (TanStack Query), useFilteredPokemon (logika search/filter/sort)
  pages/        # HomePage, DetailPage, FavoritesPage
  store/        # Zustand store (filter, halaman aktif, favorit)
  types/        # TypeScript types
  utils/        # helper (format ID, rentang generasi, terjemahan dan warna tipe)
```

Alur data: `api` → `hooks` (TanStack Query) → `pages`/`components`. Halaman tidak memanggil axios langsung.

## Pendekatan State Management

State dipisah berdasarkan sumber dan cakupannya.

1. **Server state: TanStack Query.** Semua data dari PokéAPI dikelola di sini (caching, loading, error, retry). Daftar tipe, detail, dan daftar per tipe di-cache sehingga tidak di-fetch ulang saat pindah halaman. Data API tidak disalin ke store global.
2. **Client state global: Zustand.** Menyimpan filter aktif (search, tipe, generasi, urutan), halaman aktif, dan daftar favorit. Zustand dipilih karena setup sederhana dan minim boilerplate dibanding Redux. Store memakai middleware `persist` (localStorage), jadi favorit bertahan setelah refresh. Favorit hanya menyimpan ID Pokémon, bukan seluruh objek.
3. **Local state: `useState`.** Untuk state yang hanya dipakai satu komponen, misalnya buka/tutup dropdown dan highlight opsi.

Nilai turunan (daftar hasil filter, data halaman aktif) dihitung dari state yang ada, tidak disimpan ulang, supaya tidak ada duplikasi.

## Keputusan Teknis

- **Search dan filter di client:** PokéAPI tidak punya endpoint pencarian. Daftar lengkap (`/pokemon?limit=1025`) diambil sekali dan di-cache. Filter tipe memakai `/type/{name}`. Hasil search, tipe, dan generasi diiriskan lalu dipaginasi di client.
- **Generasi:** memakai rentang ID tetap per generasi, tanpa request tambahan.
- **Card:** gambar memakai URL yang dibuat dari ID. Tipe dan BST pada card diambil per card lewat `/pokemon/{id}` (di-cache TanStack Query), jadi ada sekitar 20 request per halaman pada kunjungan pertama.
- **Dropdown buatan sendiri:** tampilan konsisten dan dukungan keyboard dan ARIA, tanpa library UI tambahan.
- **Layer API terpisah:** semua pemanggilan axios ada di `src/api`, hook hanya membungkusnya dengan TanStack Query.

## Batasan dan Pengembangan Lanjutan

- Filter dan halaman belum disinkronkan ke URL, jadi belum bisa dibagikan lewat link.
- Pencarian belum memakai debounce (data sudah di client, jadi tetap ringan).
- Rantai evolusi ditampilkan sebagai daftar datar, sehingga evolusi bercabang (misalnya Eevee) belum divisualisasikan sebagai cabang.
- Belum ada halaman 404 khusus.

## Referensi Desain

Tata letak dan gaya visual terinspirasi dari <https://pokemonconnections.com/id/pokedex>. Seluruh kode dan komponen ditulis sendiri.

## Sumber Data

[PokéAPI](https://pokeapi.co/). Pokémon dan nama terkait adalah milik Nintendo, Game Freak, dan The Pokémon Company. Proyek ini hanya untuk keperluan assessment.
