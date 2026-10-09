import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Loader2,
  ExternalLink,
  ShieldCheck,
  FolderUp,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { WorksheetData } from '../types/worksheet';
import {
  signInWithGoogleDrive,
  getCachedAccessToken,
} from '../firebase';
import {
  uploadFileToGoogleDrive,
  GoogleDriveUploadResult,
} from '../utils/googleDriveService';
import {
  generateCanvasPDFBlob,
  generateWordDocBlob,
} from '../utils/exportHelpers';

interface GoogleDriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  worksheet: WorksheetData;
  currentUser: User | null;
}

export const GoogleDriveExportModal: React.FC<GoogleDriveExportModalProps> = ({
  isOpen,
  onClose,
  worksheet,
  currentUser,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'doc'>('pdf');
  const [fileNameInput, setFileNameInput] = useState<string>(() => {
    return worksheet.id || 'LKPD-PAI-SD';
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<GoogleDriveUploadResult | null>(null);

  if (!isOpen) return null;

  const currentToken = getCachedAccessToken();

  const handleConnectGoogleDrive = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      await signInWithGoogleDrive();
    } catch (err: any) {
      console.error('Failed to authenticate Google Drive:', err);
      setErrorMsg(err.message || 'Gagal menghubungkan Google Drive.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUpload = async () => {
    setErrorMsg(null);
    setUploadResult(null);

    let token = getCachedAccessToken();
    if (!token) {
      try {
        const authRes = await signInWithGoogleDrive();
        token = authRes.accessToken;
      } catch (err: any) {
        setErrorMsg('Silakan hubungkan akun Google Drive Anda terlebih dahulu.');
        return;
      }
    }

    setIsUploading(true);

    try {
      let fileBlob: Blob;
      let finalName = fileNameInput.trim() || 'LKPD-PAI-SD';
      let mimeType: string;

      if (selectedFormat === 'pdf') {
        if (!finalName.toLowerCase().endsWith('.pdf')) {
          finalName += '.pdf';
        }
        mimeType = 'application/pdf';
        fileBlob = await generateCanvasPDFBlob('a4-worksheet-canvas', worksheet);
      } else {
        if (!finalName.toLowerCase().endsWith('.doc')) {
          finalName += '.doc';
        }
        mimeType = 'application/msword';
        fileBlob = generateWordDocBlob(worksheet);
      }

      const desc = `LKPD PAI & Budi Pekerti - ${worksheet.title} (${worksheet.grade}). Standar SK BSKAP No. 020/H/KR/2026.`;

      const result = await uploadFileToGoogleDrive(
        finalName,
        mimeType,
        fileBlob,
        token,
        desc
      );

      setUploadResult(result);
    } catch (err: any) {
      console.error('Google Drive upload error:', err);
      setErrorMsg(err.message || 'Gagal mengunggah berkas ke Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetAndClose = () => {
    setErrorMsg(null);
    setUploadResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-jakarta">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Drive Official Colors Icon */}
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2">
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
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 font-jakarta">
                Simpan ke Google Drive
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Simpan berkas LKPD langsung ke Google Drive pribadi Anda
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Gagal Menyimpan:</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Success Card State */}
          {uploadResult ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950 font-jakarta">
                    Berkas Berhasil Tersimpan!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Tersimpan di Google Drive Anda sebagai:{' '}
                    <strong>{uploadResult.name}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {uploadResult.webViewLink && (
                  <a
                    href={uploadResult.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>Buka Berkas di Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setUploadResult(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl hover:bg-emerald-100/50 transition-colors"
                >
                  Unggah Format Lain
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Account Connection Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Akun Google Terhubung
                  </span>
                  {currentToken ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Izin Drive Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Perlu Izin Drive
                    </span>
                  )}
                </div>

                {currentUser ? (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5 truncate">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt=""
                          className="w-7 h-7 rounded-lg ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#0284c7] text-white flex items-center justify-center text-xs font-bold">
                          {currentUser.displayName?.[0] || 'G'}
                        </div>
                      )}
                      <div className="truncate text-left">
                        <span className="font-bold text-slate-900 block truncate leading-tight">
                          {currentUser.displayName || 'Guru PAI'}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate leading-tight">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>

                    {!currentToken && (
                      <button
                        type="button"
                        onClick={handleConnectGoogleDrive}
                        disabled={isAuthenticating}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
                      >
                        {isAuthenticating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                        ) : (
                          <FolderUp className="w-3.5 h-3.5 text-[#0284c7]" />
                        )}
                        <span>Hubungkan Drive</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600">Belum masuk akun Google.</span>
                    <button
                      type="button"
                      onClick={handleConnectGoogleDrive}
                      disabled={isAuthenticating}
                      className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      {isAuthenticating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>Masuk dengan Google</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Format Selection (PDF vs Word) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Format Berkas:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('pdf')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedFormat === 'pdf'
                        ? 'bg-sky-50/90 border-[#0284c7] ring-2 ring-sky-200 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#0284c7]" />
                        Dokumen PDF HD
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                        .pdf
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Presisi fisik A4 (300 DPI), font Arab Amiri berharakat, dan garis simpul terpasang sempurna.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('doc')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedFormat === 'doc'
                        ? 'bg-sky-50/90 border-[#0284c7] ring-2 ring-sky-200 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Dokumen Word
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                        .doc
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Format Microsoft Word yang siap disunting teks, tabel, dan rubriknya secara leluasa.
                    </p>
                  </button>
                </div>
              </div>

              {/* File Name Configuration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Berkas di Google Drive:
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-sky-500 transition-colors">
                  <input
                    type="text"
                    value={fileNameInput}
                    onChange={(e) => setFileNameInput(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                    placeholder="Contoh: LKPD-PAI-Kelas-4-Asmaul-Husna"
                  />
                  <span className="text-xs font-mono font-bold text-slate-400 pl-2">
                    .{selectedFormat}
                  </span>
                </div>
              </div>

              {/* Summary Info */}
              <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Judul LKPD:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[240px]">
                    {worksheet.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Kelas / Fase:</span>
                  <span className="font-bold text-slate-800">{worksheet.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Regulasi:</span>
                  <span className="font-bold text-emerald-700">SK BSKAP No. 020/2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Lokasi Simpan:</span>
                  <span className="font-bold text-[#0284c7]">Google Drive Saya (My Drive)</span>
                </div>
              </div>

              {/* Mandatory User Confirmation Notice */}
              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-[10.5px] text-sky-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Izin Pengguna:</strong> Berkas akan diunggah langsung ke akun Google Drive pribadi Anda dengan izin Anda. Berkas tetap menjadi milik Anda sepenuhnya dan tidak dapat diakses pihak lain.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {uploadResult ? 'Selesai' : 'Batal'}
          </button>

          {!uploadResult && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || isAuthenticating}
              className="px-5 py-2.5 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Mengunggah ke Drive...</span>
                </>
              ) : (
                <>
                  <FolderUp className="w-4 h-4 text-sky-200" />
                  <span>Simpan ke Google Drive</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
