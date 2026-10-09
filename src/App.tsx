import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { DEFAULT_WORKSHEET, PRESET_WORKSHEETS } from './data/initialWorksheet';
import { WorksheetData } from './types/worksheet';
import { HeaderNav } from './components/HeaderNav';
import { LeftFeatureBar } from './components/LeftFeatureBar';
import { ConfiguratorPanel } from './components/ConfiguratorPanel';
import { A4PaperCanvas } from './components/A4PaperCanvas';
import { FloatingDock } from './components/FloatingDock';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { ImageStudioModal } from './components/ImageStudioModal';
import { SavedWorksheetsModal } from './components/SavedWorksheetsModal';
import { GoogleDriveExportModal } from './components/GoogleDriveExportModal';
import { LandingPage } from './components/LandingPage';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { exportWorksheetToWord, copyWorksheetPlainText, exportCanvasToPDF, generateDirectPdf } from './utils/exportHelpers';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');
  const [worksheet, setWorksheet] = useState<WorksheetData>(() => {
    try {
      const saved = localStorage.getItem('lumina_current_worksheet');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_WORKSHEET;
  });

  const [currentPresetId, setCurrentPresetId] = useState<string>('pai-asmaul-husna-4');
  const [scale, setScale] = useState<number>(0.92);
  const [ecoPrintMode, setEcoPrintMode] = useState<boolean>(false);
  const [showTeacherKey, setShowTeacherKey] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'tools' | 'config' | 'preview'>('config');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState<boolean>(false);
  const [generatedSuccessToast, setGeneratedSuccessToast] = useState<string | null>(null);

  // Modals state
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState<boolean>(false);
  const [aiGeneratorInitialData, setAiGeneratorInitialData] = useState<any>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState<boolean>(false);
  const [isSavedWorksheetsOpen, setIsSavedWorksheetsOpen] = useState<boolean>(false);
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState<boolean>(false);

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_current_worksheet', JSON.stringify(worksheet));
    } catch (e) {
      // ignore
    }
  }, [worksheet]);

  // Adjust default scale on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(0.44);
      } else if (window.innerWidth < 1024) {
        setScale(0.68);
      } else if (window.innerWidth < 1440) {
        setScale(0.85);
      } else {
        setScale(0.95);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_WORKSHEETS.find((p) => p.id === presetId);
    if (found) {
      setWorksheet(found.data);
      setCurrentPresetId(presetId);
    }
  };

  const handleReset = () => {
    const defaultData =
      PRESET_WORKSHEETS.find((p) => p.id === currentPresetId)?.data || DEFAULT_WORKSHEET;
    setWorksheet(defaultData);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(1.4, Number((prev + 0.08).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.4, Number((prev - 0.08).toFixed(2))));
  };

  const handleResetZoom = () => {
    if (window.innerWidth < 1024) {
      setScale(0.68);
    } else {
      setScale(0.92);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      // If canvas is hidden in another mobile tab, switch to preview tab first
      if (activeMobileTab !== 'preview') {
        setActiveMobileTab('preview');
        await new Promise((r) => setTimeout(r, 200));
      }
      const rawChapter = worksheet.chapter || 'Modul';
      const cleanChapter = rawChapter.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `LKPD_${worksheet.grade || 'SD'}_${cleanChapter}.pdf`;
      const success = await exportCanvasToPDF('a4-worksheet-canvas', filename, worksheet);
      if (success) {
        setPdfSuccessToast(true);
        setTimeout(() => setPdfSuccessToast(false), 3500);
      }
    } catch (err) {
      console.warn('Canvas export failed, generating direct vector PDF:', err);
      const rawChapter = worksheet.chapter || 'Modul';
      const cleanChapter = rawChapter.replace(/[^a-zA-Z0-9]/g, '_');
      generateDirectPdf(worksheet, `LKPD_${worksheet.grade || 'SD'}_${cleanChapter}.pdf`);
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 3500);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportWord = () => {
    exportWorksheetToWord(worksheet);
  };

  const handleCopyText = async () => {
    const text = copyWorksheetPlainText(worksheet);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  const handleApplyGenerated = (newWs: WorksheetData) => {
    setWorksheet(newWs);
    try {
      localStorage.setItem('lumina_current_worksheet', JSON.stringify(newWs));
    } catch (e) {
      // ignore
    }
    setCurrentPresetId('custom-ai');
    setViewMode('studio');
    // Ensure mobile devices show the physical paper canvas immediately!
    setActiveMobileTab('preview');
    setGeneratedSuccessToast(newWs.chapter || newWs.title);
    setTimeout(() => setGeneratedSuccessToast(null), 4500);
    setTimeout(() => {
      document.getElementById('a4-worksheet-canvas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleApplyAsLogo = (imageUrl: string) => {
    setWorksheet((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        logoUrl: imageUrl,
      },
    }));
  };

  const handleInsertFromChat = (text: string) => {
    setWorksheet((prev) => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        teacherNotes: text.slice(0, 300),
      },
    }));
  };

  const handleOpenAIGenerator = (metadata?: any) => {
    // Defend against React SyntheticEvents or DOM Events which contain cross-origin window objects
    const isDomEvent =
      metadata &&
      (metadata.nativeEvent ||
        metadata.target ||
        metadata.currentTarget ||
        metadata.bubbles !== undefined ||
        typeof metadata.preventDefault === 'function' ||
        metadata.view);
    const cleanData = !isDomEvent && metadata && typeof metadata === 'object' ? metadata : null;
    setAiGeneratorInitialData(cleanData);
    setIsAIGeneratorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-jakarta">
      {/* Toast Notification for PDF Export */}
      {pdfSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/50 flex items-center gap-3 animate-fade-in ring-1 ring-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-black font-jakarta text-white">Ekspor PDF HD Selesai!</p>
            <p className="text-[11px] text-emerald-200">Presisi 100% tata letak fisik A4 berhasil diunduh.</p>
          </div>
        </div>
      )}

      {/* Toast Notification for AI Worksheet Generation */}
      {generatedSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-sky-400/60 flex items-center gap-3.5 animate-fade-in ring-2 ring-sky-500/30 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold font-jakarta text-white flex items-center gap-1.5">
              <span>LKPD Berhasil Digenerate!</span>
              <span className="text-[9px] bg-sky-500/30 text-sky-200 border border-sky-400/40 px-1.5 py-0.2 rounded font-mono">
                SIAP PAKAI
              </span>
            </p>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              "{generatedSuccessToast}" kini aktif di kanvas & editor.
            </p>
          </div>
        </div>
      )}

      {viewMode === 'landing' ? (
        <LandingPage
          onEnterStudio={() => setViewMode('studio')}
          currentUser={currentUser}
          onOpenSavedWorksheets={() => setIsSavedWorksheetsOpen(true)}
          onOpenAIGenerator={() => handleOpenAIGenerator()}
          onSelectPreset={(presetId) => {
            handleSelectPreset(presetId);
            setViewMode('studio');
          }}
        />
      ) : (
        <>
          {/* Top Application Bar - Clean, Sleek, Professional & Modern */}
          <HeaderNav
            currentPresetId={currentPresetId}
            onSelectPreset={handleSelectPreset}
            currentUser={currentUser}
            onLoginClick={() => setIsSavedWorksheetsOpen(true)}
            onSignOut={() => signOut(auth)}
            activeMobileTab={activeMobileTab}
            onMobileTabChange={setActiveMobileTab}
            worksheet={worksheet}
            onBackToLanding={() => setViewMode('landing')}
          />

          {/* Main Workbench Layout: Left Feature Bar + Configurator Panel + Live Physical A4 Canvas */}
          <main className="flex-1 max-w-[1920px] w-full mx-auto flex flex-col lg:flex-row relative pb-20">
            {/* Left Feature Rail: All Tools Moved to the Left Position */}
            <div
              className={`shrink-0 ${
                activeMobileTab === 'tools' ? 'block w-full' : 'hidden lg:block'
              }`}
            >
              <LeftFeatureBar
                onOpenAIGenerator={() => handleOpenAIGenerator()}
                onOpenChatbot={() => setIsChatbotOpen(true)}
                onOpenImageStudio={() => setIsImageStudioOpen(true)}
                onOpenSavedWorksheets={() => setIsSavedWorksheetsOpen(true)}
                onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
                onExportPDF={handleExportPDF}
                isExportingPDF={isExportingPDF}
                onPrint={handlePrint}
                onExportWord={handleExportWord}
                onCopyText={handleCopyText}
                copied={copied}
                ecoPrintMode={ecoPrintMode}
                onToggleEcoPrint={() => setEcoPrintMode((prev) => !prev)}
                showTeacherKey={showTeacherKey}
                onToggleTeacherKey={() => setShowTeacherKey((prev) => !prev)}
                currentUser={currentUser}
              />
            </div>

            {/* Center-Left: Modular Configurator Panel */}
            <aside
              className={`w-full lg:w-[480px] xl:w-[530px] 2xl:w-[560px] lg:border-r border-slate-200/80 overflow-y-auto lg:h-[calc(100vh-3.75rem)] lg:sticky lg:top-[3.75rem] shrink-0 ${
                activeMobileTab === 'config' ? 'block' : 'hidden lg:block'
              }`}
            >
              <ConfiguratorPanel
                worksheet={worksheet}
                onChange={setWorksheet}
                onReset={handleReset}
                onOpenAIGenerator={handleOpenAIGenerator}
              />
            </aside>

            {/* Right: Live Physical A4 Canvas */}
            <section
              className={`flex-1 flex flex-col items-center justify-start bg-slate-100/60 lg:bg-[#f3f5fd]/70 p-2 sm:p-4 lg:p-6 overflow-y-auto min-h-[calc(100vh-3.75rem)] ${
                activeMobileTab === 'preview' ? 'block' : 'hidden lg:flex'
              }`}
            >
              {/* Canvas Toolbar Info */}
              <div className="no-print w-full max-w-[210mm] flex items-center justify-between px-2 py-1.5 mb-2 text-xs text-slate-500">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7] ring-2 ring-sky-200" />
                  <span>Kanvas Fisik A4 Interaktif</span>
                  <span className="text-[10px] text-slate-400 font-normal">| Kurikulum Merdeka 2026</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] text-slate-500 bg-white border border-slate-200/90 px-2.5 py-0.5 rounded-md shadow-2xs font-semibold">
                    210 × 297 mm (A4)
                  </span>
                </div>
              </div>

              {/* Centered true-to-scale A4 sheet */}
              <A4PaperCanvas
                worksheet={worksheet}
                onUpdateWorksheet={setWorksheet}
                scale={scale}
                ecoPrintMode={ecoPrintMode}
                showTeacherKey={showTeacherKey}
              />
            </section>
          </main>

          {/* Floating Glassmorphic Dock */}
          <FloatingDock
            scale={scale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            ecoPrintMode={ecoPrintMode}
            onToggleEcoPrint={() => setEcoPrintMode((prev) => !prev)}
            showTeacherKey={showTeacherKey}
            onToggleTeacherKey={() => setShowTeacherKey((prev) => !prev)}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            isExportingPDF={isExportingPDF}
            onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
            onExportWord={handleExportWord}
            onCopyText={handleCopyText}
            copied={copied}
          />
        </>
      )}

      {/* AI Curriculum Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onApplyGenerated={handleApplyGenerated}
        initialData={aiGeneratorInitialData}
      />

      {/* Gemini Chatbot (Multi-turn Chat) */}
      <GeminiChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        worksheet={worksheet}
        onInsertToWorksheet={handleInsertFromChat}
      />

      {/* Image Creator & Editor Studio (gemini-3.1-flash-image-preview) */}
      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
        onApplyAsLogo={handleApplyAsLogo}
        currentLogoUrl={worksheet.institution.logoUrl}
      />

      {/* Cloud Firestore & Google Auth Modal */}
      <SavedWorksheetsModal
        isOpen={isSavedWorksheetsOpen}
        onClose={() => setIsSavedWorksheetsOpen(false)}
        currentWorksheet={worksheet}
        onLoadWorksheet={(ws) => {
          setWorksheet(ws);
          setViewMode('studio');
        }}
        currentUser={currentUser}
      />

      {/* Google Drive Export Modal */}
      <GoogleDriveExportModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        worksheet={worksheet}
        currentUser={currentUser}
      />
    </div>
  );
}
