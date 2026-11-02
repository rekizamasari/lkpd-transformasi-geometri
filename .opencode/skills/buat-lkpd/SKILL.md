---
name: Buat LKPD
description: Membangun LKPD interaktif mandiri (repo GitHub + Pages + Supabase) dengan login NISN, modul bergerbang, praktik auto-check non-koding, kuis berwaktu, dan dashboard guru. Gunakan saat pengguna meminta worksheet/LKPD baru; proyek contoh lkpd-transformasi-geometri.
---

# Membuat LKPD Interaktif Non-Koding

"Panduan membangun aplikasi LKPD (LKPD = Lembar Kerja Peserta Didik / interactive
student worksheet) pendamping pembelajaran. Dua pilot sudah live dan memakai
bentuk ini; gunakan proyek contoh sebagai acuan bentuk nyata:
repo ini (lkpd-transformasi-geometri, non-koding) dan repo induk
lkpdarraypython (array, Pyodide).

## 0. Kumpulkan parameter (tanya user jika belum ada)

| Parameter | Contoh | Ketentuan |
|---|---|---|
| Mata pelajaran & kelas | Matematika, Kelas XI | bebas |
| Judul materi & daftar modul (3–7) | Translasi, Refleksi, … | tiap modul = 1 topik |
| Jenis praktik tiap modul | isian angka, regex teks, kanvas | lihat format checks |
| **Prefix id modul unik** | `g1..g7` | WAJIB unik lintas LKPD yang berbagi satu Supabase (array LKPD: `m1..m5`, kuis akhir `final`; transformasi: `g1..g5`, kuis akhir `<awalan>-final`) |
| Supabase mandiri / bersama | mandiri | bersama = 1 proyek untuk beberapa LKPD, id modul tidak boleh tabrakan |
| Nama repo & domain | `lkpd-<materi>` kebab-case | gh repo create --public |

## 1. Kerangka proyek (10 file, salin dari proyek contoh)

```text
index.html        login (NISN siswa / email guru)
siswa.html        dashboard siswa
guru.html         dashboard guru (4 tab: analitik, nilai, rincian, materi&kunci)
css/style.css     tema gelap
js/supabase-config.js   URL + anon key + initSupabase()
js/auth.js        login/session + mapper NISN→email (nisn.NIS@siswa.lkpd.local)
js/data.js        MODUL[] + KUIS_AKHIR   ← SATU-SATUNYA file yang benar-benar baru
js/siswa.js       kartu modul, gerbang berantai, praktik, kuis berwaktu
js/guru.js        analitik, matriks nilai, CSV (; + BOM), realtime
sql/schema.sql    skema idempotent (kelas, profiles, progress, submissions, quiz_results, policy RLS, trigger, seed)
README.md         setup guru
```

Fondasi (index/siswa/guru/auth/siswa.js/guru.js/style/schema) **disalin** dari
proyek contoh lalu disesuaikan teks yang berkaitan materi; yang ditulis nol
dari awal hanya `data.js` (+ bagian inputs/checks/visual di dalamnya).

## 2. Format `js/data.js` (kontrak utama)

```js
const MODUL = [ { id, nomor, judul, ikon, ringkas, tujuan[], teori, langkah[{judul, penjelasan, kode}],
  praktik: { deskripsi, inputs (HTML string), visual, checks[] }, kuis[6] }, … ];
const KUIS_AKHIR = { id: "<prefix>-final", judul, ikon, durasiMenit: 20, soal[4 × jumlah modul] };
```

Aturan konsistensi (dipakai oleh skrip validasi — lihat references/):

- Kuis tiap modul tepat **6 soal**, 4 opsi, `kunci` 0..3 valid.
- Praktik: total `poin` di `checks` **tepat 100**; setiap
  `checks[].sel` / `visual.baySel` (nested vals arrays) / `visual.kurvaBay.{m,c}`
  **wajib ada di `inputs`**.
- `type:"angka"` → `|parseFloat(isi) − val| ≤ 0.01`; `type:"teks"` →
  `new RegExp(val, "i").test(isi)`. Tulis regex dengan karakter yang aman pada
  JS string (escape backslash: `\\(`).
- Kuis akhir: **4 soal per modul** (3 soal konsep + 1 soal penerapan
  kontekstual), 20 menit, urutan acak saat render, auto-kirim saat waktu habis,
  hanya terbuka setelah SEMUA praktik+kuis modul terkirim.
- Gerbang berantai dibaca otomatis dari `MODUL.length` — Modul N menunggu
  praktik+kuis Modul N−1 terkirim.

## 3. Kanvas non-koding (visual)

Painters bawaan `js/siswa.js`: `vektor`, `refleksi`, `rotasi`, `dilatasi`,
`komposisi`, `fungsi`; semua mendukung overlay
`visual.kurva  = [{ expr:"2*x+6", warna, label }]` (garis/kurva dasar) dan
`visual.kurvaBay = { m:"#id-m", c:"#id-c" }` (garis bayangan `y = m·x + c`
yang mengikuti isian siswa). Pekerjaan hitung pelajar tetap di input
(toleransi 0.01) — kanvas hanya memvisualkan.

Jika pembahasan materi menuntut bentuk tampilan lain (mis. garis bilangan,
histogram), tambah painter baru di `gambarKanvas()` + `case` pada switch di
`renderVisual()`, jangan mengubah painters lama.

## 4. Validasi wajib sebelum commit

1. `node --check js/data.js`, `node --check js/siswa.js`, `node --check js/guru.js`
2. Jalankan skrip validasi (template di references/checklist-validasi.md):
   jumlah/nomor modul, kuis 6 soal × 4 opsi + kunci valid, praktik tepat
   100 poin, selektor checks/baySel/kurvaBay ada di inputs, ekspresi kurva
   valid, distribusi kuis akhir, durasi 20.
3. Regex `teks` diuji pada jawaban benar (pass) & salah (fail).
4. Deploy: buka index/siswa/guru + js data/siswa/guru via Pages, pastikan semua
   HTTP 200 dan console browser bebas error.

## 5. Supabase + deploy

1. Proyek Supabase (bisa mandiri) → isi URL+anon key ke `js/supabase-config.js`.
2. Jalankan `sql/schema.sql` di SQL Editor; ingat blok konstraint pakai cek
   `pg_constraint` agar idempotent (jangan tangkap hanya duplicate_object).
3. Dashboard proyek: Authentication → Email → **Confirm email OFF**.
4. Akun guru: dashboard Add user (Auto Confirm) lalu
   `update public.profiles set role='guru' where id='<UUID>'`.

Deploy:
```sh
gh repo create <nama> --public --source . --remote origin --push
gh api -X POST repos/<org>/<nama>/pages --input pages.json   # {"source":{"branch":"master","path":"/"}}
```

Setelah build, cek HTTP 200 untuk index, siswa, guru, js/data, js/siswa, js/guru
(Invoke-WebRequest / fetch).

## 6. Gaya penulisan

- Bahasa Indonesia santai-edukatif; jargon diperkenalkan sesuai konteks;
  jebakan belajar umum ditandai info-box merah/kuning/hijau.
- Angka & kunci jawaban soal dicek ulang sebelum commit.
- Jangan pernah commit key `service_role` — hanya URL + anon key yang di-commit.
