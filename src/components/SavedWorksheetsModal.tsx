import React, { useState, useEffect } from 'react';
import {
  Cloud,
  X,
  Save,
  FolderOpen,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { User, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  setCachedAccessToken,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { WorksheetData } from '../types/worksheet';

interface SavedWorksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorksheet: WorksheetData;
  onLoadWorksheet: (ws: WorksheetData) => void;
  currentUser: User | null;
}

interface SavedDocItem {
  id: string;
  title: string;
  grade?: string;
  chapter?: string;
  updatedAt?: string;
  worksheetData: string;
}

export const SavedWorksheetsModal: React.FC<SavedWorksheetsModalProps> = ({
  isOpen,
  onClose,
  currentWorksheet,
  onLoadWorksheet,
  currentUser,
}) => {
  const [savedList, setSavedList] = useState<SavedDocItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const path = `users/${currentUser.uid}/worksheets`;
    const colRef = collection(db, 'users', currentUser.uid, 'worksheets');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: SavedDocItem[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as SavedDocItem);
        });
        setSavedList(items);
      },
      (error) => {
        console.error('Snapshot error in worksheets:', error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setCachedAccessToken(credential.accessToken);
      }
      // Sync user profile
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          displayName: user.displayName || 'Guru PAI',
          email: user.email || '',
          photoURL: user.photoURL || '',
          role: 'Pendidik PAI',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Gagal login dengan Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSavedList([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveCurrent = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setErrorMsg(null);

    // Sanitize docId to strictly match Firestore rules regex: ^[a-zA-Z0-9_\-]+$
    const rawId = currentWorksheet.id || `ws_${Date.now()}`;
    const docId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64) || `ws_${Date.now()}`;
    const path = `users/${currentUser.uid}/worksheets/${docId}`;

    try {
      const docRef = doc(db, 'users', currentUser.uid, 'worksheets', docId);
      const now = new Date().toISOString();
      await setDoc(docRef, {
        id: docId,
        userId: currentUser.uid,
        title: (currentWorksheet.title || 'Modul LKPD PAI').slice(0, 255),
        grade: (currentWorksheet.grade || 'Fase B').slice(0, 100),
        chapter: (currentWorksheet.chapter || '').slice(0, 255),
        worksheetData: JSON.stringify(currentWorksheet),
        createdAt: now,
        updatedAt: now,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      console.error('Error saving worksheet:', err);
      setErrorMsg('Gagal menyimpan ke Firestore: ' + (err.message || 'Error'));
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (docId: string, title?: string) => {
    if (!currentUser) return;
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus modul "${title || docId}" dari penyimpanan Cloud? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    const path = `users/${currentUser.uid}/worksheets/${docId}`;
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'worksheets', docId);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.error('Delete error:', err);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleLoad = (item: SavedDocItem) => {
    try {
      const parsed = JSON.parse(item.worksheetData);
      onLoadWorksheet(parsed);
      onClose();
    } catch (e) {
      console.error('Failed to parse worksheet JSON', e);
    }
  };

  const handleDownloadBackup = () => {
    const filename = `Lumina_LKPD_${(currentWorksheet.chapter || currentWorksheet.title || 'Modul').replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const blob = new Blob([JSON.stringify(currentWorksheet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.title || parsed.chapter) {
          onLoadWorksheet(parsed);
          onClose();
        } else {
          setErrorMsg('Format file JSON LKPD tidak sesuai.');
        }
      } catch {
        setErrorMsg('Gagal membaca file JSON LKPD.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-blue-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-blue-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Cloud className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-jakarta">
                Penyimpanan Awan (Firebase Cloud Firestore)
              </h3>
              <p className="text-[11px] text-slate-500">
                Simpan, buka kembali, dan sinkronisasi modul ajar LKPD Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Auth Bar */}
          {!currentUser ? (
            <div className="space-y-3">
              {/* Reassurance Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Akses Bebas Aktif:</strong> Anda dapat membuat, menyunting, dan mengekspor LKPD tanpa wajib mendaftar email.
                </span>
              </div>

              {/* Google Sync Option */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Sinkronisasi Cloud Google (Opsional)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Hubungkan akun Google jika Anda ingin arsip tersimpan otomatis di Firebase Firestore & Google Drive.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 whitespace-nowrap transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#0284c7]" />
                  <span>Masuk Google</span>
                </button>
              </div>

              {/* Local Backup & Restore */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Cadangkan & Muat Berkas Lokal
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      Simpan file konfigurasi LKPD ke perangkat Anda tanpa perlu login
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors"
                    title="Unduh cadangan data lembar kerja saat ini dalam format .json"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-600" />
                    <span>Unduh Cadangan (.json)</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka File Cadangan (.json)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleUploadBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-9 h-9 rounded-full ring-2 ring-sky-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {currentUser.displayName || 'Guru PAI'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                      Terotentikasi
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-none mt-0.5">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action: Save Current Worksheet */}
          {currentUser && (
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Simpan Modul Saat Ini
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-xs block">
                  "{currentWorksheet.chapter || currentWorksheet.title}"
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveCurrent}
                disabled={isSaving}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Cloud'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* List of Saved Worksheets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-[#0284c7]" />
                Koleksi LKPD Tersimpan di Cloud ({savedList.length})
              </span>
            </div>

            {savedList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                {currentUser
                  ? 'Belum ada modul LKPD yang disimpan di akun Anda. Klik tombol "Simpan ke Cloud" di atas.'
                  : 'Silakan masuk dengan akun Google untuk melihat dan mengelola modul Anda.'}
              </div>
            ) : (
              <div className="space-y-2">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-slate-200 hover:border-sky-300 rounded-xl flex items-center justify-between gap-2 transition-all shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-[#0284c7] font-semibold">{item.grade}</span>
                        <span>•</span>
                        <span className="truncate">{item.chapter}</span>
                        {item.updatedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoad(item)}
                        className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284c7] rounded-lg text-xs font-bold transition-colors"
                      >
                        Buka
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
