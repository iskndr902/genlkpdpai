import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Cloud,
  SlidersHorizontal,
  Printer,
  FileText,
  ShieldCheck,
  Award,
  Download,
  Layers,
  Compass,
  HeartHandshake,
  ScrollText,
  HelpCircle,
  LogIn,
  LogOut,
  Star,
  Users,
  Check,
  ChevronRight,
  GraduationCap,
  Building2,
  FolderOpen,
} from 'lucide-react';
import { User, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider, setCachedAccessToken } from '../firebase';
import { PAI_LEARNING_OUTCOMES_2026 } from '../data/sdLearningOutcomes2026';
import { SD_ELEMENTS, SD_GRADES } from '../data/sdCurriculum2026';

interface LandingPageProps {
  onEnterStudio: () => void;
  currentUser: User | null;
  onOpenSavedWorksheets: () => void;
  onOpenAIGenerator: () => void;
  onSelectPreset?: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  currentUser,
  onOpenSavedWorksheets,
  onOpenAIGenerator,
  onSelectPreset,
}) => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activePreviewElement, setActivePreviewElement] = useState<string>('Akidah');

  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setCachedAccessToken(credential.accessToken);
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError('Gagal masuk dengan Google: ' + (err.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error', e);
    }
  };

  const benefitsList = [
    {
      icon: Cloud,
      color: 'sky',
      title: 'Penyimpanan Cloud Firestore Tanpa Batas',
      desc: 'Simpan puluhan lembar LKPD dan modul ajar PAI Anda secara aman di cloud Google Firestore. Akses dan edit kembali kapan saja dari laptop sekolah atau komputer rumah.',
      highlight: 'Otomatis Tersimpan',
    },
    {
      icon: ShieldCheck,
      color: 'emerald',
      title: 'Sinkronisasi CP SK No. 020/H/KR/2026',
      desc: 'Standar regulasi resmi terbaru dari Kemendikbudristek & Kemenag RI untuk Fase A, B, dan C (Kelas 1–6 SD). Seluruh tujuan pembelajaran (TP) dan dalil berharakat Amiri siap pakai.',
      highlight: '100% Sesuai Regulasi',
    },
    {
      icon: SlidersHorizontal,
      color: 'indigo',
      title: 'Generator AI Soal HOTS, MOTS & LOTS',
      desc: 'Pengaturan tingkat kesulitan soal (Easy, Medium, Hard) terintegrasi langsung dengan AI Gemini. Soal penalaran kontekstual, analisis dilema moral islami, dan kunci jawaban guru instan.',
      highlight: 'Fleksibilitas Kognitif',
    },
    {
      icon: Building2,
      color: 'amber',
      title: 'KOP Lembaga & Identitas Sekolah Custom',
      desc: 'Simpan nama sekolah, NPSN, akreditasi, dan logo resmi Anda satu kali saja. Setiap kali mencetak LKPD baru, KOP lembaga langsung terpasang rapi dan profesional.',
      highlight: 'Hemat Waktu Administrasi',
    },
    {
      icon: Download,
      color: 'teal',
      title: 'Ekspor PDF HD, Word & Google Drive Langsung',
      desc: 'Simpan berkas LKPD (PDF resolusi tinggi 300 DPI & Word .doc) langsung ke Google Drive pribadi Anda via Google Drive API, atau unduh instan ke perangkat sekolah.',
      highlight: 'Terhubung Google Drive',
    },
    {
      icon: Award,
      color: 'purple',
      title: 'Kunci Jawaban Guru & Rubrik Asesmen Otomatis',
      desc: 'Tidak perlu repot membuat rubrik manual. Setiap LKPD dilengkapi pedoman penskoran objektif, pembiasaan adab pekanan, dan QR Code audio murottal tartil.',
      highlight: 'Terverifikasi Pendidik',
    },
  ];

  const sampleOutcomes = PAI_LEARNING_OUTCOMES_2026.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 font-jakarta selection:bg-sky-500/20 selection:text-sky-900">
      {/* 0. OFFICIAL REGULATION TOP BAR */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 text-white text-xs py-2 px-4 border-b border-sky-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11.5px]">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-extrabold text-[10px] border border-emerald-400/40 shrink-0">
              REGULASI RESMI 2026
            </span>
            <span className="text-slate-200 truncate">
              Tersinkronisasi Standar Capaian Pembelajaran <strong>SK BSKAP No. 020/H/KR/2026</strong> Jenjang SD (Fase A, B, C)
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-slate-300">
            <span className="hidden sm:inline font-medium">✨ Akses Gratis Guru PAI SD</span>
            {!currentUser ? (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="font-extrabold text-sky-300 hover:text-white underline text-[11px]"
              >
                Daftar Sekarang & Nikmati Keuntungannya →
              </button>
            ) : (
              <button
                type="button"
                onClick={onEnterStudio}
                className="font-extrabold text-emerald-300 hover:text-white text-[11px] flex items-center gap-1"
              >
                <span>Masuk Mesin Generator</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. TOP ANNOUNCEMENT & NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-md shadow-sky-500/20 ring-2 ring-sky-100 flex-shrink-0">
              <BookOpen className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-jakarta">
                  Lumina <span className="text-[#0284c7]">PAI SD</span> Studio
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 hidden md:inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Standar SK No. 020 / 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Generator LKPD & Modul Ajar PAI Sekolah Dasar
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#keuntungan" className="hover:text-[#0284c7] transition-colors">
              Keuntungan Guru
            </a>
            <a href="#fitur" className="hover:text-[#0284c7] transition-colors">
              Fitur Studio
            </a>
            <a href="#kurikulum" className="hover:text-[#0284c7] transition-colors">
              Elemen CP 020/2026
            </a>
            <a href="#testimoni" className="hover:text-[#0284c7] transition-colors">
              Testimoni
            </a>
          </nav>

          {/* User Auth & Primary Studio Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenSavedWorksheets}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 rounded-xl text-xs font-bold transition-colors"
                  title="Buka Koleksi LKPD Tersimpan di Cloud"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Koleksi Cloud</span>
                </button>

                <div className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt=""
                      className="w-6 h-6 rounded-lg ring-1 ring-white"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-[10px]">
                      {currentUser.displayName?.[0] || 'G'}
                    </div>
                  )}
                  <span className="hidden md:inline truncate max-w-[110px]">
                    {currentUser.displayName || 'Guru PAI'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-slate-400 hover:text-rose-600 p-0.5 ml-0.5"
                    title="Keluar dari Akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs hover:border-slate-400 active:scale-95"
                title="Hubungkan Akun Google (Opsional jika ingin simpan ke Cloud & Drive)"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>{isAuthLoading ? 'Memproses...' : 'Masuk Google (Opsional)'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onEnterStudio}
              className="animate-aura-glow inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 text-white rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95"
            >
              <span>Mulai Buat LKPD (Akses Langsung)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Auth Error Banner if any */}
      {authError && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-800 text-xs px-4 py-2 text-center font-semibold">
          {authError}
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/70 bg-gradient-to-b from-white via-sky-50/20 to-[#faf8ff]">
        {/* Subtle Decorative Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-tr from-sky-200/40 via-indigo-100/30 to-emerald-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Regulation Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200 text-[11px] font-extrabold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Standar Capaian Pembelajaran SK BSKAP No. 020/H/KR/2026 PAI SD</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-jakarta">
                Platform Generator LKPD PAI SD Cerdas Berbasis{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-indigo-600 to-sky-600">
                  Kurikulum Merdeka 2026
                </span>
              </h1>

              {/* Subheadline description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Rancang modul pembelajaran dan lembar kerja peserta didik (LKPD) Pendidikan Agama Islam
                Kelas 1–6 SD dalam hitungan detik. Tersinkronisasi otomatis dengan dalil Al-Qur'an
                berharakat font Amiri, simpul interaktif gamified match nodes, evaluasi HOTS berkalibrasi
                kesulitan, dan misi pembiasaan akhlak.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={onEnterStudio}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Mulai Buat LKPD Sekarang (Gratis & Tanpa Wajib Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isAuthLoading}
                    className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-extrabold shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-[#0284c7]" />
                    <span>Hubungkan Google (Opsional Simpan Cloud)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenAIGenerator()}
                    className="w-full sm:w-auto px-5 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-sm font-extrabold shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Buka Generator AI Standarisasi</span>
                  </button>
                )}
              </div>

              {/* Frictionless Free Access Guarantee Note */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-3.5 py-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Akses Terbuka:</strong> Tanpa perlu daftar email! Guru langsung dapat membuat, menyunting dalil & soal, mencetak fisik, serta mengekspor PDF/Word secara bebas.
                </span>
              </div>

              {/* Quick Template Picker directly from Landing */}
              <div className="pt-2 text-xs">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  ⚡ Coba Contoh Modul LKPD Siap Pakai:
                </span>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPreset) onSelectPreset('pai-hijaiyah-1');
                      else onEnterStudio();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200 text-[11px] font-semibold transition-all shadow-2xs"
                  >
                    📖 Kelas 1 (Fase A): Huruf Hijaiah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPreset) onSelectPreset('pai-asmaul-husna-4');
                      else onEnterStudio();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 text-[11px] font-bold transition-all shadow-2xs"
                  >
                    ⭐ Kelas 4 (Fase B): Asmaul Husna
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectPreset) onSelectPreset('pai-tasamuh-5');
                      else onEnterStudio();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-[11px] font-semibold transition-all shadow-2xs"
                  >
                    🌿 Kelas 5 (Fase C): Tasamuh & Akhlak
                  </button>
                </div>
              </div>

              {/* Trust & Guarantee bullets */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Siap Cetak Fisik A4 & Ekspor Word
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 100% Mengacu SK No. 020/2026
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Akses Cloud Gratis Pendidik
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Digital Twin Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transition-all hover:shadow-2xl">
                {/* Header Preview Bar */}
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Digital-Physical Twin Canvas (A4)</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded">
                    210 x 297 mm
                  </span>
                </div>

                {/* Simulated Sheet Content */}
                <div className="p-5 space-y-4 bg-white text-xs">
                  {/* KOP Simulation */}
                  <div className="border-b-2 border-slate-900 pb-2 text-center space-y-0.5">
                    <span className="text-[10px] font-black text-slate-900 uppercase block tracking-wider">
                      SD NEGERI TELADAN 01 PAGI
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      DINAS PENDIDIKAN & KEMENTERIAN AGAMA RI • NPSN: 20108921
                    </span>
                    <span className="text-[10px] font-black text-[#0284c7] block uppercase pt-0.5">
                      LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI
                    </span>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-bold">Kelas: </span>
                      <strong className="text-slate-800">Kelas 4 SD (Fase B)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold">Elemen: </span>
                      <strong className="text-indigo-700">Akidah</strong>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 font-extrabold text-[9px] border border-purple-200">
                      Level: Hard (HOTS)
                    </span>
                  </div>

                  {/* Dalil Section preview */}
                  <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-extrabold text-amber-900">
                        Dalil: Q.S. Al-Hasyr: 23
                      </span>
                      <span className="text-[8.5px] text-slate-400 font-mono">Font Amiri</span>
                    </div>
                    <p className="font-amiri text-xs text-right leading-loose text-slate-900" dir="rtl">
                      هُوَ اللّٰهُ الَّذِيْ لَآ اِلٰهَ اِلَّا هُوَ ۚ الْمَلِكُ الْقُدُّوْسُ السَّلٰمُ
                    </p>
                    <p className="text-[9px] text-slate-600 italic">
                      "Dialah Allah yang tidak ada tuhan selain Dia, Maha Raja, Yang Maha Suci, Yang Maha Damai..."
                    </p>
                  </div>

                  {/* Matching nodes preview */}
                  <div className="p-2.5 bg-sky-50/60 rounded-lg border border-sky-200 space-y-1.5">
                    <span className="text-[9.5px] font-extrabold text-sky-950 block">
                      Aktivitas Gamified Match Nodes (Hubungkan Titik Simpul):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div className="space-y-1">
                        <div className="p-1 bg-white border border-slate-200 rounded flex items-center justify-between">
                          <span>Al-Malik</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                        </div>
                        <div className="p-1 bg-white border border-slate-200 rounded flex items-center justify-between">
                          <span>Al-Quddus</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="p-1 bg-white border border-slate-200 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span className="truncate">Maha Merajai</span>
                        </div>
                        <div className="p-1 bg-white border border-slate-200 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span className="truncate">Maha Suci</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA link to studio */}
                  <button
                    type="button"
                    onClick={onEnterStudio}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Buka Lembar Kerja Penuh di Editor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: DAFTAR SEKARANG & NIKMATI KEUNTUNGANNYA (USER'S EXPLICIT EMPHASIS) */}
      <section id="keuntungan" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
              <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Fasilitas Lengkap & Akses Terbuka Pendidik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-jakarta">
              Fitur Lengkap Lumina PAI SD — Langsung Pakai & Bebas Akses
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Didesain khusus untuk Bapak/Ibu Guru Pendidikan Agama Islam Sekolah Dasar di seluruh nusantara.
              Semua fitur pembuatan LKPD, kalibrasi HOTS, dan ekspor dokumen terbuka tanpa syarat registrasi email.
            </p>
          </div>

          {/* 6 Benefit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-[#faf8ff] hover:bg-white hover:border-sky-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0284c7] shadow-2xs group-hover:bg-[#0284c7] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                        {item.highlight}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug font-jakarta">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Akses Penuh Terbuka untuk Semua Guru</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prominent Registration CTA Banner Inside the Benefits Section */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Sinkronisasi Cloud & Google Drive (Opsional)
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-jakarta tracking-tight">
                  Hubungkan Akun Google untuk Simpan Cloud Otomatis
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tidak ada syarat wajib daftar untuk membuat LKPD! Anda dapat langsung menyusun LKPD,
                  mengubah materi, dan mengekspor PDF kapan pun. Masuk dengan akun Google untuk
                  menyimpan arsip lembar kerja ke Google Firestore & Google Drive pribadi.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {!currentUser ? (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isAuthLoading}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-sm font-extrabold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-[#0284c7]" />
                    <span>{isAuthLoading ? 'Menghubungkan...' : 'Daftar / Masuk Google'}</span>
                  </button>
                ) : (
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-sky-200">
                    ✓ Anda telah masuk sebagai {currentUser.displayName || currentUser.email}
                  </div>
                )}

                <button
                  type="button"
                  onClick={onEnterStudio}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-sm font-extrabold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Buka Mesin Generator (Langsung Pakai)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: ELEMEN KURIKULUM MERDEKA PAI SD (SK BSKAP 020/2026) */}
      <section id="kurikulum" className="py-16 sm:py-24 bg-[#faf8ff] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-300 text-xs font-extrabold">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Matriks Capaian Pembelajaran Lengkap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-jakarta">
              5 Elemen Keilmuan PAI SD Tersinkronisasi Penuh
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Setiap kali Anda mengklik salah satu elemen di generator, seluruh materi pokok, indikator bab,
              kutipan dalil Al-Qur'an, dan soal evaluasi otomatis menyesuaikan standar SK No. 020 Tahun 2026.
            </p>
          </div>

          {/* Interactive Element Showcase Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {SD_ELEMENTS.map((el) => {
              const isActive = activePreviewElement === el;
              return (
                <button
                  key={el}
                  type="button"
                  onClick={() => setActivePreviewElement(el)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {el}
                </button>
              );
            })}
          </div>

          {/* Display Cards for the Selected Element across Fases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Fase A (Kelas 1–2)', 'Fase B (Kelas 3–4)', 'Fase C (Kelas 5–6)'].map((faseStr, fIdx) => {
              const targetFase = fIdx === 0 ? 'Fase A' : fIdx === 1 ? 'Fase B' : 'Fase C';
              const outcome = PAI_LEARNING_OUTCOMES_2026.find(
                (o) => o.element === activePreviewElement && o.fase === targetFase
              );

              return (
                <div
                  key={faseStr}
                  className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900">{faseStr}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200">
                      {outcome?.code || 'SK 020/2026'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Materi Pokok Rekomendasi:
                    </span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                      {outcome?.suggestedChapter || 'Materi Inti PAI'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">
                    “{outcome?.officialCP || 'Capaian pembelajaran resmi Kemendikbudristek'}”
                  </div>

                  <div className="text-[10.5px] text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <strong>Indikator TP:</strong> {outcome?.recommendedTP}
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={onEnterStudio}
                      className="text-[11px] font-bold text-[#0284c7] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Buka di Generator LKPD</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION: ALUR KERJA 3 LANGKAH */}
      <section id="fitur" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-jakarta">
              Alur Kerja Cepat & Intuitif
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Cukup 3 langkah mudah untuk menghasilkan lembar kerja berkualitas tinggi siap cetak:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Pilih Kelas, Semester & Elemen PAI',
                desc: 'Tentukan jenjang murid (Kelas 1–6 SD) dan elemen yang ingin diajarkan. Materi pokok serta indikator bab langsung sinkron otomatis.',
              },
              {
                step: '02',
                title: 'Atur Tingkat Kesulitan (Easy, Medium, Hard)',
                desc: 'Tentukan kedalaman bernalar siswa. AI Agent langsung mengalibrasi tingkat kognitif soal (LOTS C1-C2, MOTS C3, hingga HOTS C4-C6).',
              },
              {
                step: '03',
                title: 'Cetak A4, Ekspor Word atau Simpan Cloud',
                desc: 'Periksa tampilan live twin canvas A4. Cetak instan, unduh naskah Word (.docx), atau simpan ke cloud Google Firestore Anda.',
              },
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-2xl bg-[#faf8ff] border border-slate-200 space-y-3">
                <span className="text-3xl font-black text-sky-600/30 font-mono block">
                  {s.step}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-jakarta">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION: TESTIMONI & METRIK */}
      <section id="testimoni" className="py-16 bg-[#faf8ff] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-black uppercase text-[#0284c7] tracking-wider">
                Dipercaya Komunitas Guru
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-jakarta">
                Membantu Guru PAI Menyiapkan Perangkat Ajar Bermutu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Platform Lumina PAI SD dibangun atas aspirasi guru-guru agama Islam yang membutuhkan
                lembar kerja interaktif, ramah anak, dan bebas dari format membosankan.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "Sangat terbantu terutama pada fitur Simpul Matching gamified dan ayat dalil berharakat.
                  Anak-anak kelas 4 sangat antusias saat mengerjakan lembar kerja ini."
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  Ustadzah Rahmawati, S.Pd.I
                  <span className="text-slate-400 font-normal block">Guru PAI SDN Menteng 01 Jakarta</span>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "Penyelarasan dengan SK BSKAP 020/2026 sangat akurat. Saya tidak perlu lagi membuka PDF tebal
                  untuk mencari rumusan CP dan Tujuan Pembelajaran."
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  H. Ahmad Fauzan, M.Pd
                  <span className="text-slate-400 font-normal block">Ketua KKG PAI Kecamatan Bandung</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-10 bg-white text-xs text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0284c7] text-white flex items-center justify-center font-bold text-xs">
              L
            </div>
            <div>
              <span className="font-extrabold text-slate-900 block font-jakarta">
                Lumina Islamic EdTech Studio
              </span>
              <span className="text-[10px] text-slate-400">
                Standar Kurikulum Merdeka PAI SD (SK BSKAP No. 020/H/KR/2026)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={onEnterStudio}
              className="text-[#0284c7] hover:underline font-bold"
            >
              Mesin Generator LKPD →
            </button>
            <span>•</span>
            {!currentUser ? (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="hover:text-slate-800"
              >
                Daftar Akun Guru
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenSavedWorksheets}
                className="hover:text-slate-800"
              >
                Koleksi Cloud
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
