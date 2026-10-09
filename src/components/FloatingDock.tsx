import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  FileDown,
  FileCheck2,
  Leaf,
  Copy,
  Check,
  Download,
  Loader2,
} from 'lucide-react';

interface FloatingDockProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  ecoPrintMode: boolean;
  onToggleEcoPrint: () => void;
  showTeacherKey: boolean;
  onToggleTeacherKey: () => void;
  onPrint: () => void;
  onExportWord: () => void;
  onExportPDF: () => void;
  isExportingPDF?: boolean;
  onOpenGoogleDrive?: () => void;
  onCopyText: () => void;
  copied: boolean;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  ecoPrintMode,
  onToggleEcoPrint,
  showTeacherKey,
  onToggleTeacherKey,
  onPrint,
  onExportWord,
  onExportPDF,
  isExportingPDF = false,
  onOpenGoogleDrive,
  onCopyText,
  copied,
}) => {
  const percentage = Math.round(scale * 100);

  return (
    <div className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_12px_30px_-5px_rgba(2,132,199,0.2),0_4px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/5 text-slate-700">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 pr-1.5 sm:pr-2 border-r border-slate-200">
          <button
            onClick={onZoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Perkecil Kanvas (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-100 font-mono transition-colors"
            title="Reset ke Ukuran Pas Layar (100%)"
          >
            {percentage}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={scale >= 1.4}
            className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Perbesar Kanvas (Zoom In)"
          >
            <ZoomIn className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Eco-Print Switch */}
        <button
          onClick={onToggleEcoPrint}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            ecoPrintMode
              ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Mode Hemat Tinta untuk fotokopi atau printer hitam putih"
        >
          <Leaf className={`w-3.5 h-3.5 ${ecoPrintMode ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">Eco-Print</span>
        </button>

        {/* Teacher Key Switch */}
        <button
          onClick={onToggleTeacherKey}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            showTeacherKey
              ? 'bg-amber-100/90 text-amber-900 border border-amber-300'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Tampilkan kunci jawaban guru"
        >
          <FileCheck2 className={`w-3.5 h-3.5 ${showTeacherKey ? 'text-amber-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">Kunci</span>
        </button>

        {/* Copy Text */}
        <button
          onClick={onCopyText}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 text-slate-600 transition-colors"
          title="Salin isi teks LKPD ke clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline text-emerald-700">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Salin</span>
            </>
          )}
        </button>

        {/* Export to Word .doc */}
        <button
          onClick={onExportWord}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 text-slate-700 transition-colors"
          title="Ekspor ke dokumen Microsoft Word (.doc)"
        >
          <FileDown className="w-3.5 h-3.5 text-[#0284c7]" />
          <span className="hidden sm:inline">Word</span>
        </button>

        {/* Dedicated Client-Side High-Quality PDF Export Button */}
        <button
          onClick={onExportPDF}
          disabled={isExportingPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-[#0284c7] hover:bg-sky-100 border border-sky-200 transition-all shadow-2xs disabled:opacity-60 active:scale-95"
          title="Unduh langsung file PDF resolusi tinggi (Layout Asli Presisi 100%)"
        >
          {isExportingPDF ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0284c7]" />
              <span className="hidden sm:inline font-extrabold">Merender PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline font-extrabold">Ekspor PDF</span>
            </>
          )}
        </button>

        {/* Save to Google Drive Button */}
        {onOpenGoogleDrive && (
          <button
            onClick={onOpenGoogleDrive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-all shadow-2xs active:scale-95"
            title="Simpan berkas LKPD langsung ke Google Drive Anda"
          >
            <svg viewBox="0 0 87.3 78" className="w-3.5 h-3.5 shrink-0">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.2l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.1 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="hidden md:inline font-extrabold">Drive</span>
          </button>
        )}

        {/* Primary CTA: Print to A4 PDF */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:shadow-md hover:from-sky-600 hover:to-sky-700 transition-all shadow-xs active:scale-95"
          title="Cetak A4 / Dialog Printer Browser"
        >
          <Printer className="w-3.5 h-3.5 text-white" />
          <span>Cetak</span>
        </button>
      </div>
    </div>
  );
};
