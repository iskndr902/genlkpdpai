import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Cloud,
  Download,
  Printer,
  FileDown,
  Copy,
  Check,
  Leaf,
  Key,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  User,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface LeftFeatureBarProps {
  onOpenAIGenerator: () => void;
  onOpenChatbot: () => void;
  onOpenImageStudio: () => void;
  onOpenSavedWorksheets: () => void;
  onOpenGoogleDrive: () => void;
  onExportPDF: () => void;
  isExportingPDF?: boolean;
  onPrint: () => void;
  onExportWord: () => void;
  onCopyText: () => void;
  copied: boolean;
  ecoPrintMode: boolean;
  onToggleEcoPrint: () => void;
  showTeacherKey: boolean;
  onToggleTeacherKey: () => void;
  currentUser: FirebaseUser | null;
}

export const LeftFeatureBar: React.FC<LeftFeatureBarProps> = ({
  onOpenAIGenerator,
  onOpenChatbot,
  onOpenImageStudio,
  onOpenSavedWorksheets,
  onOpenGoogleDrive,
  onExportPDF,
  isExportingPDF = false,
  onPrint,
  onExportWord,
  onCopyText,
  copied,
  ecoPrintMode,
  onToggleEcoPrint,
  showTeacherKey,
  onToggleTeacherKey,
  currentUser,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <aside
      className={`no-print transition-all duration-200 border-r border-slate-200/90 bg-white shadow-xs flex flex-col z-30 lg:sticky lg:top-[3.75rem] lg:h-[calc(100vh-3.75rem)] ${
        isExpanded ? 'w-full lg:w-64' : 'w-full lg:w-[78px]'
      }`}
    >
      {/* Top Header of Left Rail: Expand / Collapse Toggle */}
      <div className="hidden lg:flex items-center justify-between px-3 py-2.5 border-b border-slate-100 bg-slate-50/70">
        <span
          className={`text-[10px] font-black uppercase tracking-wider text-slate-400 transition-opacity ${
            isExpanded ? 'opacity-100' : 'opacity-0 hidden'
          }`}
        >
          Menu & Fitur Kiri
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors ${
            !isExpanded ? 'mx-auto' : ''
          }`}
          title={isExpanded ? 'Ciutkan Menu Kiri' : 'Perluas Menu Kiri'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Scrollable Action List */}
      <div className="flex-1 overflow-y-auto px-1.5 sm:px-2 py-3 space-y-4">
        {/* GROUP 1: FITUR AI PINTAR */}
        <div>
          {isExpanded && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5 font-jakarta">
              Kecerdasan AI
            </span>
          )}
          <div className="space-y-1">
            {/* 1. AI Standarisasi (Hero Action) */}
            <button
              type="button"
              onClick={() => onOpenAIGenerator()}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/5 hover:from-sky-500/15 hover:to-indigo-500/15 border border-sky-300/80 shadow-2xs'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-sky-50/80'
              }`}
              title="Generator AI Standarisasi SK 020/2026 (Susun TP, Dalil & Evaluasi)"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      AI Standarisasi
                    </span>
                    <span className="text-[9px] font-extrabold bg-[#0284c7] text-white px-1.5 py-0.2 rounded-md">
                      SK 2026
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Susun TP, dalil & evaluasi
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-extrabold text-slate-700 text-center leading-tight mt-1 block">
                  AI Modul
                </span>
              )}
            </button>

            {/* 2. Ustadz AI (Gemini Chatbot) */}
            <button
              type="button"
              onClick={onOpenChatbot}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-indigo-50/80'
              }`}
              title="Tanya Ustadz AI (Konsultan Kurikulum & Pedagogi PAI SD)"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-900 block truncate font-jakarta">
                    Ustadz AI
                  </span>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Konsultan Kurikulum PAI
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Ustadz
                </span>
              )}
            </button>

            {/* 3. Gambar AI (Studio Generator Logo & Ilustrasi) */}
            <button
              type="button"
              onClick={onOpenImageStudio}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-teal-50/80 border border-transparent hover:border-teal-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-teal-50/80'
              }`}
              title="Studio Gambar AI (Buat Logo Sekolah & Ilustrasi Materi)"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5 text-teal-600" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-900 block truncate font-jakarta">
                    Gambar AI
                  </span>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Logo sekolah & ilustrasi
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Gambar
                </span>
              )}
            </button>
          </div>
        </div>

        {/* GROUP 2: PENYIMPANAN CLOUD & DRIVE */}
        <div className="pt-2 border-t border-slate-100">
          {isExpanded && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5 font-jakarta">
              Penyimpanan & Sinkron
            </span>
          )}
          <div className="space-y-1">
            {/* 4. Cloud Firestore */}
            <button
              type="button"
              onClick={onOpenSavedWorksheets}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-sky-50/80 border border-transparent hover:border-sky-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-sky-50/80'
              }`}
              title="Penyimpanan Cloud Firestore & Arsip Modul"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] border border-sky-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Cloud className="w-5 h-5 text-[#0284c7]" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      Cloud LKPD
                    </span>
                    {currentUser && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    )}
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    {currentUser ? 'Arsip online aktif' : 'Masuk akun cloud'}
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Cloud
                </span>
              )}
            </button>

            {/* 5. Google Drive */}
            <button
              type="button"
              onClick={onOpenGoogleDrive}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-emerald-50/80'
              }`}
              title="Simpan Berkas Langsung ke Google Drive"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 87.3 78" className="w-full h-full">
                  <path
                    d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                    fill="#0066da"
                  />
                  <path
                    d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
                    fill="#00ac47"
                  />
                  <path
                    d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z"
                    fill="#ea4335"
                  />
                  <path
                    d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                    fill="#00832d"
                  />
                  <path
                    d="m59.8 53h-32.2l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                    fill="#2684fc"
                  />
                  <path
                    d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.1 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                    fill="#ffba00"
                  />
                </svg>
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-900 block truncate font-jakarta">
                    Google Drive
                  </span>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Simpan berkas ke Drive
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Drive
                </span>
              )}
            </button>
          </div>
        </div>

        {/* GROUP 3: EKSPOR & CETAK */}
        <div className="pt-2 border-t border-slate-100">
          {isExpanded && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5 font-jakarta">
              Ekspor & Cetak
            </span>
          )}
          <div className="space-y-1">
            {/* 6. Ekspor PDF HD */}
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className={`w-full group rounded-xl transition-all flex relative disabled:opacity-60 ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-sky-50/80 border border-transparent hover:border-sky-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-sky-50/80'
              }`}
              title="Unduh Lembar Kerja PDF Kualitas Tinggi (300 DPI Physical A4)"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-[#0284c7] border border-sky-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {isExportingPDF ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0284c7]" />
                ) : (
                  <Download className="w-5 h-5 text-[#0284c7]" />
                )}
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      Ekspor PDF HD
                    </span>
                    <span className="text-[9px] font-mono text-sky-800 bg-sky-100 px-1 py-0.2 rounded">
                      .pdf
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    {isExportingPDF ? 'Merender PDF...' : 'Presisi cetak 300 DPI'}
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  PDF HD
                </span>
              )}
            </button>

            {/* 7. Cetak A4 */}
            <button
              type="button"
              onClick={onPrint}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-slate-100 border border-transparent hover:border-slate-300'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-slate-100'
              }`}
              title="Cetak Fisik A4 Langsung (Print Browser)"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5 text-slate-700" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-900 block truncate font-jakarta">
                    Cetak Fisik A4
                  </span>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Langsung ke printer kertas
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Cetak A4
                </span>
              )}
            </button>

            {/* 8. Unduh Word (.doc) */}
            <button
              type="button"
              onClick={onExportWord}
              className={`w-full group rounded-xl transition-all flex relative ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left hover:bg-blue-50/80 border border-transparent hover:border-blue-200'
                  : 'flex-col items-center justify-center p-2 text-center hover:bg-blue-50/80'
              }`}
              title="Unduh Dokumen Microsoft Word (.doc)"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileDown className="w-5 h-5 text-blue-600" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      Dokumen Word
                    </span>
                    <span className="text-[9px] font-mono text-blue-800 bg-blue-100 px-1 py-0.2 rounded">
                      .doc
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Bisa diedit di MS Word
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  Word
                </span>
              )}
            </button>
          </div>
        </div>

        {/* GROUP 4: FITUR KANVAS & TOGGLE */}
        <div className="pt-2 border-t border-slate-100">
          {isExpanded && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1.5 font-jakarta">
              Opsi Kanvas
            </span>
          )}
          <div className="space-y-1">
            {/* 9. Mode Eco-Print (Hemat Tinta) */}
            <button
              type="button"
              onClick={onToggleEcoPrint}
              className={`w-full group rounded-xl transition-all flex relative ${
                ecoPrintMode
                  ? 'bg-emerald-50 border border-emerald-300'
                  : isExpanded
                  ? 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  : 'hover:bg-slate-50'
              } ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left'
                  : 'flex-col items-center justify-center p-2 text-center'
              }`}
              title={
                ecoPrintMode
                  ? 'Mode Hemat Tinta Aktif (Latar putih)'
                  : 'Aktifkan Mode Hemat Tinta Printer'
              }
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                  ecoPrintMode
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Leaf className="w-5 h-5" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      Hemat Tinta
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        ecoPrintMode
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ecoPrintMode ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Putihkan latar untuk cetak
                  </span>
                </div>
              ) : (
                <span
                  className={`text-[9.5px] font-bold text-center leading-tight mt-1 block ${
                    ecoPrintMode ? 'text-emerald-700 font-black' : 'text-slate-700'
                  }`}
                >
                  Eco {ecoPrintMode ? 'ON' : ''}
                </span>
              )}
            </button>

            {/* 10. Kunci Jawaban Guru */}
            <button
              type="button"
              onClick={onToggleTeacherKey}
              className={`w-full group rounded-xl transition-all flex relative ${
                showTeacherKey
                  ? 'bg-amber-50 border border-amber-300'
                  : isExpanded
                  ? 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  : 'hover:bg-slate-50'
              } ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left'
                  : 'flex-col items-center justify-center p-2 text-center'
              }`}
              title={
                showTeacherKey
                  ? 'Sembunyikan Kunci Jawaban'
                  : 'Tampilkan Kunci Jawaban & Rubrik Guru'
              }
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                  showTeacherKey
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Key className="w-5 h-5" />
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate font-jakarta">
                      Kunci Guru
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        showTeacherKey
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {showTeacherKey ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Rubrik & kunci penilaian
                  </span>
                </div>
              ) : (
                <span
                  className={`text-[9.5px] font-bold text-center leading-tight mt-1 block ${
                    showTeacherKey ? 'text-amber-800 font-black' : 'text-slate-700'
                  }`}
                >
                  Kunci {showTeacherKey ? 'ON' : ''}
                </span>
              )}
            </button>

            {/* 11. Salin Teks */}
            <button
              type="button"
              onClick={onCopyText}
              className={`w-full group rounded-xl transition-all flex relative ${
                copied
                  ? 'bg-emerald-50 border border-emerald-300'
                  : isExpanded
                  ? 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  : 'hover:bg-slate-50'
              } ${
                isExpanded
                  ? 'flex-row items-center gap-3 p-2.5 text-left'
                  : 'flex-col items-center justify-center p-2 text-center'
              }`}
              title="Salin Isi Teks LKPD ke Clipboard"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </div>
              {isExpanded ? (
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-slate-900 block truncate font-jakarta">
                    {copied ? 'Teks Tersalin!' : 'Salin Teks'}
                  </span>
                  <span className="text-[10.5px] text-slate-500 block truncate">
                    Tempel ke WhatsApp/Catatan
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-bold text-slate-700 text-center leading-tight mt-1 block">
                  {copied ? 'Tersalin' : 'Salin'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info in Sidebar */}
      {isExpanded ? (
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[10.5px] text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Akses Penuh Terbuka</span>
          </div>
          <p className="leading-snug text-slate-500">
            {currentUser
              ? `Terhubung: ${currentUser.displayName || currentUser.email}`
              : 'Mode Bebas: Guru dapat membuat & unduh LKPD tanpa syarat login.'}
          </p>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex justify-center">
          <div
            className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"
            title="Akses Penuh Bebas Terbuka"
          />
        </div>
      )}
    </aside>
  );
};
