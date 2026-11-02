/* =====================================================================
 * KONFIGURASI SUPABASE
 * Ganti dua nilai di bawah dengan milik proyek Anda:
 *   1. Buka https://supabase.com → dashboard → pilih proyek
 *   2. Menu "Settings" → "API"
 *   3. Salin "Project URL" dan "anon public key" ke sini
 * ===================================================================== */
const SUPABASE_URL = "https://yyiywofgghmldbxtajbh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aXl3b2ZnZ2htbGRieHRhamJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NzExMjQsImV4cCI6MjEwOTE0NzEyNH0.t4fkWQOmwebm6UyrdnwvBr0zuJ8eRWHjX9DiqfBeBtg";

// ---------------------------------------------------------------------------
// Profil guru default yang dibuat via SQL (lihat README bagian 6).
// ---------------------------------------------------------------------------
const CONFIG = {
  app: {
    namaApp: "LKPD Interaktif — Transformasi Geometri",
    mapel: "Matematika",
    kelas: "XI",
    satuanPenilaian: "SPSS", // skor sementara (0-100), dipakai guru saat input rapor
  },
};

// ------------------------------------------------------------------
// Inisialisasi client (script supabasejs dimuat lewat CDN di HTML)
// ------------------------------------------------------------------
let db = null;
function initSupabase() {
  if (db) return db;
  db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    { realtime: { params: { eventsPerSecond: 5 } } }
  );
  return db;
}
