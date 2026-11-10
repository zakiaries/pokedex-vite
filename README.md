# Pokédex Web App

Aplikasi web Pokédex untuk Frontend Technical Assessment. Data diambil dari [PokéAPI](https://pokeapi.co/docs/v2) untuk menampilkan daftar Pokémon, detailnya, pencarian, filter, dan daftar favorit.

## Screenshot

**Home**

<img width="1892" height="957" alt="image" src="https://github.com/user-attachments/assets/60516d30-0710-46f9-b06e-923f39c75e73" />


**Detail**

<img width="1703" height="957" alt="image" src="https://github.com/user-attachments/assets/be6258a1-48aa-4dfb-a02e-a82d34583a50" />


**Favorites**

<img width="1904" height="956" alt="image" src="https://github.com/user-attachments/assets/064bd236-7edb-468e-98b2-e303b9661c3d" />


**Mobile**

<img width="396" height="864" alt="image" src="https://github.com/user-attachments/assets/fa978d3d-8c58-429c-a4d6-c505b1d773af" />


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
- **Axios** dipakai karena mendukung instance dengan base URL dan respons bertipe (generic), sehingga pemanggilan API rapi dan type-safe.

## Batasan dan Pengembangan Lanjutan

- Filter dan halaman belum disinkronkan ke URL, jadi belum bisa dibagikan lewat link.
- Pencarian belum memakai debounce (data sudah di client, jadi tetap ringan).
- Rantai evolusi ditampilkan sebagai daftar datar, sehingga evolusi bercabang (misalnya Eevee) belum divisualisasikan sebagai cabang.
- Belum ada halaman 404 khusus.

## Referensi Desain

Tata letak dan gaya visual terinspirasi dari <https://pokemonconnections.com/id/pokedex>. Seluruh kode dan komponen ditulis sendiri.

## Sumber Data

[PokéAPI](https://pokeapi.co/). Pokémon dan nama terkait adalah milik Nintendo, Game Freak, dan The Pokémon Company. Proyek ini hanya untuk keperluan assessment.
