# 📐 LKPD Interaktif — Transformasi Geometri (Matematika Kelas XI)

Repo mandiri — contoh penerapan dari template `PROMPT-TEMPLATE-LKPD.md` yang ada di repo induk [`lkpdarraypython`](https://github.com/rekizamasari/lkpdarraypython) dan sebagai **LKPD non-koding**: praktik berupa **isian koordinat + kanvas koordinat interaktif** (tanpa Pyodide/Python).

## Materi

| Modul | Topik |
|---|---|
| 1 ➡️ | Translasi (pergeseran) — vektor T = (a, b) |
| 2 🪞 | Refleksi — sumbu X, sumbu Y, y = x, y = −x |
| 3 🔄 | Rotasi — 90°/180°/270°, searah & berlawanan jarum jam |
| 4 🔍 | Dilatasi — faktor k, luas ×k², sifat invarian pusat |
| 5 🧩 | Komposisi transformasi — (T ∘ R), urutan penting, studi kasus batik & animasi |

Setiap modul juga membahas **penerapan transformasi pada persamaan garis & kurva** (y = mx + c, y = x²): cara substitusi (x → x−a, y → y−b dll.), contoh langkah, dan praktik isian gradien/konstanta dengan kanvas yang menggambar garis asal + garis bayangan versi siswa.

Kuis terpadu: **20 soal acak (4 dari tiap modul, termasuk 1 soal garis/kurva), 20 menit** (`geo-final`), terbuka setelah kelima modul tuntas.

## Setup database (guru) — proyek Supabase mandiri

Repo ini memakai **proyek Supabase sendiri** (terpisah dari LKPD Array). Skema DB ada di repo ini: `sql/schema.sql`.

1. **Buat proyek Supabase** baru di https://supabase.com (gratis). Salin **Project URL** dan **anon public key** dari *Settings → API*, lalu isi ke `js/supabase-config.js`.
2. **Nonaktifkan konfirmasi email** di proyek baru: *Authentication → Sign In / Providers → Email* → matikan **"Confirm email"**. (Tanpa ini siswa tidak bisa login setelah daftar.)
3. **Jalankan skema**: *SQL Editor → paste seluruh isi `sql/schema.sql` → Run*. Skrip ini idempotent (aman diulang).
4. **Kelola kelas**: edit bagian `SEED` di `sql/schema.sql` sebelum dijalankan (nama kelas XI kamu), atau tambah/ubah lewat *Table Editor → kelas* kapan saja (tombol ➕ Tambah Kelas di dashboard guru juga bisa).
5. **Akun guru** — daftarkan lewat Supabase Dashboard (*Authentication → Users → Add user*, Auto Confirm) dengan email + password guru, lalu di SQL Editor:
   ```sql
   update public.profiles set role='guru' where id='<UUID user tersebut>';
   ```
6. **GitHub Pages** — repo ini di-deploy sendiri; URL:
   `https://<username>.github.io/lkpd-transformasi-geometri/`   (aktif untuk repo ini: `https://rekizamasari.github.io/lkpd-transformasi-geometri/`)

## Cara pakai siswa

- Daftar/login **tanpa email**: NISN + Nama + Kelas + Kata Sandi (tab 🎓 Siswa).
- Tiap modul: Materi → Langkah contoh → **Praktik isian** (👁️ Lihat Visual menampilkan hasil transformasi di kanvas; 📤 Kirim dinilai otomatis 0–100) → **Kuis 6 soal**.
- Gerbang berantai: Modul N terbuka setelah praktik+kuis Modul N−1 terkirim.

## Struktur

```
index.html        login (NISN siswa / email guru)
siswa.html        dashboard siswa
guru.html         dashboard guru (analitik, nilai, rincian, materi & kunci)
css/style.css     tema gelap (sama dengan LKPD induk)
js/supabase-config.js   URL & anon key
js/auth.js        login/session + mapper NISN→email
js/data.js        5 modul g1–g5 + KUIS_AKHIR (geo-final)
js/siswa.js       praktik isian + kanvas + gerbang + kuis berwaktu
js/guru.js        analitik, CSV, realtime, materi & kunci
sql/schema.sql    skema Supabase (jalankan 1× di SQL Editor proyek)
```

## Format praktik non-koding (untuk penulis LKPD berikutnya)

```js
praktik: {
  deskripsi: "…",
  inputs: `<div class="input-row">…<input id="m-a-x" type="number" />…</div>`,
           // + baris isian garis: gradien m &amp; konstanta c
  // Garis/kurva di kanvas (opsional, semua jenis visual mendukung):
  //   visual.kurva    : [{ expr:"2*x+6", warna:"#f472b6", label:"y = 2x + 6 (asal)" }]
  //   visual.kurvaBay : { m:"#m-gl-m", c:"#m-gl-c" }  → y = m·x + c dari isian siswa
  visual: { jenis: "vektor|refleksi|rotasi|dilatasi|komposisi", … },
  checks: [
    { poin: 20, desc: "…", type: "angka", sel: "#m-a-x", val: 5 },      // |isi−val| ≤ 0.01
    { poin: 20, desc: "…", type: "teks",  sel: "#m-sel", val: "regex" } // regex (i)
  ]
  // total poin semua checks = 100
}
```

Painter `js/siswa.js` menggambar `vis.kurva` (garis/kurva asal) pada semua jenis visual, plus `vis.kurvaBay` (garis bayangan y = m·x + c yang mengikuti isian siswa, untuk 📤 Kirim dinilai via `checks` angkanya). Untuk materi yang butuh tampilan baru, tambahkan painter di `renderVisual()` / `js/siswa.js`. Kuis akhir: 4 soal per modul (awali teks soal dengan `<JudulModul> — `).
