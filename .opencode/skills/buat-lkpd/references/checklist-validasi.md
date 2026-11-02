# Checklist & skrip validasi data.js

Template skrip Node sekali-pakai (jangan di-commit — hapus setelah pakai).
Menjalankan isi `js/data.js` via `vm.runInContext` tanpa browser.

```js
// _validate.data.cjs
const fs = require("fs"), vm = require("vm"), c = {};
vm.createContext(c);
const { MODUL, KUIS_AKHIR } = vm.runInContext(
  fs.readFileSync("js/data.js", "utf8") + ";({MODUL, KUIS_AKHIR});", c);
let gagal = 0;
const err = m => (console.log("❌ " + m), gagal++);

if (MODUL.length !== <JUMLAH_MODUL>) err("MODUL=" + MODUL.length);
MODUL.forEach((m, i) => {
  if (m.nomor !== i + 1) err(m.id + ": nomor");
  if (m.kuis.length !== 6) err(m.id + ": kuis " + m.kuis.length);
  m.kuis.forEach((s, j) => { if (s.opsi.length !== 4) err(m.id + " kuis" + j); });
  const tot = m.praktik.checks.reduce((a, x) => a + x.poin, 0);
  if (tot !== 100) err(m.id + ": praktik poin " + tot);
  m.praktik.checks.forEach(x => {
    if (!m.praktik.inputs.includes(x.sel.replace("#", "")))
      err(m.id + ": sel " + x.sel + " tidak ada di inputs");
  });
  (m.praktik.visual.kurva || []).forEach(k => {
    try { new Function("x", "return (" + k.expr + ")")(1); }
    catch (e) { err(m.id + ": expr " + k.expr); }
  });
  if (m.praktik.visual.kurvaBay) ["m", "c"].forEach(p => {
    const s = m.praktik.visual.kurvaBay[p];
    if (!m.praktik.inputs.includes(s.replace("#", "")))
      err(m.id + ": kurvaBay." + p + " " + s + " tidak ada di inputs");
  });
  if (m.praktik.visual.baySel) m.praktik.visual.baySel.flat().forEach(s => {
    if (!m.praktik.inputs.includes(s.replace("#", "")))
      err(m.id + ": baySel " + s + " tidak ada di inputs");
  });
  console.log("✅ " + m.id + " — kuis 6, praktik " + tot + " poin");
});

if (KUIS_AKHIR.soal.length !== 4 * <JUMLAH_MODUL>) err("KUIS_AKHIR=" + KUIS_AKHIR.soal.length);
if (KUIS_AKHIR.durasiMenit !== 20) err("durasi " + KUIS_AKHIR.durasiMenit);
KUIS_AKHIR.soal.forEach((s, j) => {
  if (s.opsi.length !== 4 || !(s.kunci >= 0 && s.kunci < 4)) err("final " + j);
});
console.log(gagal ? "\n" + gagal + " MASALAH" : "\nSEMUA VALID ✔");
process.exit(gagal ? 1 : 0);
```

## Uji regex tipe "teks" (jawaban benar & salah)

```js
const cek = m.praktik.checks.find(x => x.type === "teks");
const re = new RegExp(cek.val, "i");
console.log("benar:", re.test("<JAWABAN_BENAR_TEPAT>"));   // harus true
console.log("salah:", re.test("<JAWABAN_SALAH>"), "…");    // harus false
```

## Daftar cek manual sebelum push

- [ ] `node --check` lolos untuk data.js / siswa.js / guru.js / auth.js
- [ ] Kuis akhir terkunci sampai semua modul tuntas (gerbang berantai)
- [ ] Label jumlah soal pada UI kuis akhir dinamis (bukan angka hard 20)
- [ ] CSV guru pakai delimiter `;`, filename `rekap-nilai-lkpd-<materi>.csv`, BOM `\ufeff`
- [ ] Semua id modul unik lintas LKPD yang berbagi Supabase
- [ ] `sql/schema.sql` idempotent (konstraint dicek via pg_constraint)
- [ ] Confirm email OFF di proyek Supabase; akun guru dibuat + role='guru'
- [ ] 5+ URL utama Pages HTTP 200; console browser bebas error
