# PROMPT-TEMPLATE — LKPD Interaktif Non-Koding (Supabase + GitHub Pages)

> Master prompt untuk men-generate LKPD web mandiri **yang praktiknya tidak
> memakai editor kode**: siswa mengisi angka/teks + melihat visual di kanvas,
> dinilai otomatis. Contoh proyek live yang dihasilkan template ini:
> [lkpd-transformasi-geometri](https://github.com/rekizamasari/lkpd-transformasi-geometri)
> → `https://rekizamasari.github.io/lkpd-transformasi-geometri/`
> (LKPD koding/Pyodide memakai template terpisah `PROMPT-TEMPLATE-LKPD.md` di repo induk).

---

## 🧾 PROMPT — salin & isi bagian `[…]`

```
Buatkan LKPD interaktif web mandiri "LKPD Interaktif — [JUDUL MATERI]
([MAPEL] Kelas [KELAS])" sebagai repo GitHub Pages mandiri bernama
[lkpd-<materi-kebab-case>]. CIRI UTAMA: praktik NON-KODING — siswa menyelesaikan
soal/isian di kolom input dan melihat visualnya di kanvas, nilai dihitung
otomatis; TIDAK ada editor kode, TIDAK ada Pyodide.

=== 1. FITUR SISWA ===
- Login TANPA email: siswa daftar dengan NISN + Nama + Kelas + Kata Sandi;
  secara internal NISN dipetakan ke email sintetis nisn.<nis>@siswa.lkpd.local.
  Guru login dengan email+password. Halaman login = index.html (2 tab).
- Modul: [DAFTAR MODUL 3-7 TOPIK]. Setiap modul berisi halaman:
  Materi (teori, satu tabel aturan + info-box hijau/kuning/merah untuk
  tips/jebakan) → Contoh langkah [4-5] blok `judul/penjelasan/kode` monospace
  → Praktik (form isian + tombol 👁️ Lihat Visual kanvas + 📤 Kirim, dinilai
  0-100) → Kuis (6 soal pilihan ganda, 4 opsi, dinilai otomatis).
- Gerbang berantai: Modul N terbuka hanya setelah praktik+kuis Modul N-1
  terkirim. Kartu modul menampilkan ikon, ringkasan, chip nilai praktik
  dan status kuis.
- KUIS AKHIR: [4× jumlah modul, mis. 20] soal mencampur semua modul
  ([3] soal konsep + [1] soal penerapan/kontekstual per modul; awali teks
  soal dengan "<NamaModul> — "), urutan ACAK saat render, durasi 20 menit
  dengan countdown, auto-submit saat waktu habis, hanya terbuka setelah
  SEMUA praktik+kuis modul selesai, menyimpan nilai terbaik.
- Identitas tiap konten: id modul <PREFIX>1..<PREFIX>N dengan <PREFIX> unik
  (tidak boleh sama dengan LKPD lain yang berbagi Supabase; array = m1..m5,
  transformasi = g1..g5), kuis akhir id "<PREFIX>-final".

=== 2. FORMAT PRAKTIK (di js/data.js) ===
praktik: { deskripsi, inputs: HTML string, visual, checks }
- checks: [{ poin, desc, type:"angka", sel:"#id", val: angka },
           { poin, desc, type:"teks",  sel:"#id", val: regex }].
  angka: |parseFloat(isi) − val| ≤ 0.01. teks: regex flag "i".
  TOTAL poin semua checks tiap modul = 100 PERSIS.
- bisa 4-6 checks: 1-2 koordinat per objek cukup (pilih koordinat paling
  informatif), plus pertanyaan konsep bertipe select/teks.
- visual: { jenis, … } — kanvas koordinat −8..8. Painter tersedia:
  vektor/refleksi/rotasi/dilatasi/komposisi/fungsi; SEMUA jenis juga
  mendukung overlay garis/kurva dasar `kurva:[{expr:"2*x+6",warna,label}]`
  dan garis bayangan mengikuti isian siswa `kurvaBay:{m:"#id-m", c:"#id-c"}`.
- setiap id yang dirujuk checks/baySel/kurvaBay WAJIB ada di inputs.

=== 3. DASHBOARD GURU (guru.html) ===
4 tab: (1) Analitik statistik kelas; (2) nilai per siswa × modul
(matriks praktik+kuis+kuis akhir, realtime debounce 800ms + tombol 🔄 +
auto-refresh 90 detik); (3) rincian jawaban; (4) Materi & Kunci (semua
teori + kunci praktik + opsi kunci kuis). Export CSV delimiter ";" dengan
BOM \ufeff, filename rekap-nilai-lkpd-<materi>.csv. Realtime channel
"dashboard-guru-<prefix>". Akses bukan-guru → redirect siswa.html.

=== 4. TEKNIS ===
- Vanilla JS + supabase-js CDN (global script, bukan module import).
- js/data.js = satu file berisi const MODUL + const KUIS_AKHIR; js/siswa.js
  & js/guru.js membacanya (script biasa, urut load di HTML).
- Penyimpanan Supabase: tables kelas, profiles, progress, submissions
  (jsonb `checks`, `nilai`), quiz_results (jsonb `answers`); sql/schema.sql
  idempotent; RLS; trigger handle_new_user dari user_metadata; publication
  realtime untuk 3 tabel akhir.
- Konfirmasi email mati; pembuatan akun guru via dashboard + SQL role update
  (didokumentasikan di README).
- Deploy: repo GitHub mandiri public, Pages dari branch master root.

=== 5. KUALITAS KONTEN ===
- Bahasa Indonesia yang ramah pelajar; setiap UI berlabel emoji simbolis
  (🟢/🔄/✅/⚠️/🔒); info-box edukasi.
- Soal harus punya jawaban tunggal benar; kunci dicek ulang; komentar //
  di data.js menjelaskan setiap check.
- Sertakan README.md setup guru (Supabase, Confirm email OFF, akun guru +
  SQL role update, Pages), dan catatan id modul unik.

Validasi wajib SEBELUM commit: node --check semua js; skrip validasi membuktikan
tiap modul kuis 6 soal & praktik 100 poin & semua sel ada di inputs; regex
diuji benar/salah; lalu commit terpisah (1 commit konten, 1 commit setup).
Deploy + verifikasi HTTP 200 untuk index, siswa, guru, js/data, js/siswa, js/guru.
```

---

## 📌 Catatan pemakaian

- ✅ **Contoh nyata penuh** yang sudah live: repo
  [`lkpd-transformasi-geometri`](https://github.com/rekizamasari/lkpd-transformasi-geometri).
  Salin strukturnya, ganti konten sesuai bagian [dalam kurung siku].
- ⚙️ Di OpenCode, skill `buat-lkpd` (folder `.opencode/skills/buat-lkpd/` di repo
  ini — salin ke `~/.config/opencode/skills/` agar jadi global) membawa
  workflow + skrip validasi yang sama; file ini berguna saat membawa prompt
  ke AI lain (ChatGPT/Claude/dll.) yang tidak bisa membaca skill OpenCode.
- ⚠️ Bila beberapa LKPD berbagi SATU proyek Supabase, jaga prefix id modul &
  id kuis akhir tetap unik; jika proyek Supabase mandiri, tetap gunakan prefix
  unik untuk kebersihan analitik guru.
