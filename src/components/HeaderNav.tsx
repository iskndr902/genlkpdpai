import React from 'react';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Layers,
  LogIn,
  LogOut,
  SlidersHorizontal,
  Eye,
  Wrench,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { PRESET_WORKSHEETS } from '../data/initialWorksheet';
import { WorksheetData } from '../types/worksheet';

interface HeaderNavProps {
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  currentUser: User | null;
  onLoginClick?: () => void;
  onSignOut?: () => void;
  activeMobileTab: 'tools' | 'config' | 'preview';
  onMobileTabChange: (tab: 'tools' | 'config' | 'preview') => void;
  worksheet: WorksheetData;
  onBackToLanding?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentPresetId,
  onSelectPreset,
  currentUser,
  onLoginClick,
  onSignOut,
  activeMobileTab,
  onMobileTabChange,
  worksheet,
  onBackToLanding,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs font-sans">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
        {/* LEFT: Back to Landing, Brand & Document Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all shrink-0 active:scale-95"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-indigo-700 text-white flex items-center justify-center shadow-xs ring-1 ring-sky-200/60 shrink-0">
              <BookOpen className="w-4 h-4 text-sky-100" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-slate-900 font-jakarta">
                  Lumina <span className="text-[#0284c7]">PAI SD</span>
                </span>
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-sky-50 text-[#0284c7] border border-sky-200">
                  SK 020/2026
                </span>
              </div>
            </div>
          </div>

          {/* Document Breadcrumb & Title */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200 min-w-0">
            <div className="min-w-0">
              <span className="text-xs font-black text-slate-800 truncate block max-w-[240px]">
                {worksheet.title || 'Lembar Kerja Peserta Didik'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {worksheet.grade || 'Fase B SD'} • {worksheet.chapter || 'Pendidikan Agama Islam'}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: Clean Minimal Preset Switcher (Kelas 1 - 6 SD) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Jenjang:
          </span>
          {PRESET_WORKSHEETS.map((preset) => {
            const isActive = preset.id === currentPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-[#0284c7] shadow-2xs border border-sky-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {preset.badge}
              </button>
            );
          })}
        </div>

        {/* RIGHT: User Profile / Reassuring Guest Status & Mobile Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile 3-Way Tab Switcher (< 1024px) */}
          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onMobileTabChange('tools')}
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeMobileTab === 'tools'
                  ? 'bg-white text-[#0284c7] shadow-xs'
                  : 'text-slate-600'
              }`}
              title="Menu Alat & Ekspor"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alat</span>
            </button>
            <button
              type="button"
              onClick={() => onMobileTabChange('config')}
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeMobileTab === 'config'
                  ? 'bg-white text-[#0284c7] shadow-xs'
                  : 'text-slate-600'
              }`}
              title="Panel Editor LKPD"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => onMobileTabChange('preview')}
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                activeMobileTab === 'preview'
                  ? 'bg-white text-[#0284c7] shadow-xs'
                  : 'text-slate-600'
              }`}
              title="Pratinjau Lembar A4"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanvas</span>
            </button>
          </div>

          {/* User Account or Guest Mode */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200/90 rounded-xl">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt=""
                    className="w-5 h-5 rounded-lg ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-lg bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.displayName?.[0] || 'G'}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[120px]">
                  {currentUser.displayName || 'Guru PAI'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Akun Cloud Aktif" />
              </div>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Reassuring Guest Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                <span>Mode Bebas (Akses Penuh)</span>
              </div>

              {onLoginClick && (
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all shadow-2xs active:scale-95"
                  title="Masuk dengan Google (Opsional untuk simpan ke Google Cloud & Drive)"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Masuk Google (Opsional)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
