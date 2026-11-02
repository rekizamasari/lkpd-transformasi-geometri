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
| 6 📈 | Transformasi Fungsi (Translasi & Refleksi) — y = f(x−a)+b, y = −f(x), y = f(−x) |
| 7 🎚️ | Transformasi Fungsi (Dilatasi & Komposisi) — y = k·f(x), y = f(kx), y = a(x−b)²+c |

Kuis terpadu: **21 soal acak (3 dari tiap modul), 20 menit** (`geo-final`), terbuka setelah semua modul tuntas.

## Setup (guru)

1. **Supabase** — memakai proyek Supabase yang **sama** dengan LKPD Array (URL + anon key sudah terisi di `js/supabase-config.js`). Skema database tetap `sql/schema.sql` di repo induk.
   > Bila memakai proyek Supabase baru/terpisah, jalankan sekali `sql/schema.sql` (di repo induk) di SQL Editor → Table Editor, dan pastikan **Authentication → Email → "Confirm email" = OFF**.
2. **Akun guru** — daftar lewat Supabase Dashboard (Authentication → Users → Add user, Auto Confirm), lalu di SQL Editor:
   ```sql
   update public.profiles set role='guru' where id='<UUID>';
   ```
3. **GitHub Pages** — repo ini di-deploy sendiri; URL:
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
```

## Format praktik non-koding (untuk penulis LKPD berikutnya)

```js
praktik: {
  deskripsi: "…",
  inputs: `<div class="input-row">…<input id="m-a-x" type="number" />…</div>`, // HTML form
  // Untuk materi "transformasi fungsi":
  //   visual: { jenis:"fungsi", kurva:[{expr:"x*x",warna,label},…], titik:[…] }
  //   expr dikembalikan lewat new Function("x", …) oleh painter js/siswa.js
  visual: { jenis: "vektor|refleksi|rotasi|dilatasi|komposisi|fungsi", … },
  checks: [
    { poin: 25, desc: "…", type: "angka", sel: "#m-a-x", val: 5 },     // |isi−val| ≤ 0.01
    { poin: 25, desc: "…", type: "teks",  sel: "#m-sel", val: "regex" } // regex (i)
  ]
}
```
Painter `jenis:"fungsi"` menggambar kurva dasar + kurva hasil transformasi + legenda di kanvas −8..8; tambahkan bentuk visual lain dalam `renderVisual()` / painter `js/siswa.js` bila materi butuh tampilan baru. Kuis akhir: 3 soal per modul (awali teks soal dengan `<JudulModul> — `).
