import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  Wand2,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Layers,
  GraduationCap,
  ScrollText,
  GitCommit,
  HelpCircle,
  HeartHandshake,
  QrCode,
  Lightbulb,
  Cpu,
  Compass,
  Calendar,
  SlidersHorizontal,
  Download,
  FileDown,
  RotateCcw,
  FileText,
  Loader2,
} from 'lucide-react';
import { WorksheetData } from '../types/worksheet';
import {
  SD_GRADES,
  SD_ELEMENTS,
  SD_SEMESTERS,
  SD_CURRICULUM_DATABASE,
  SDCurriculumTopic,
  getCurriculumTopic,
  getTopicsForElement,
  calibrateQuestionsByDifficulty,
} from '../data/sdCurriculum2026';
import { exportCanvasToPDF, exportWorksheetToWord } from '../utils/exportHelpers';

export interface AIGeneratorInitialMetadata {
  grade?: number;
  semester?: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)' | string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
  element?: string;
  topic?: string;
  cpCodes?: string[];
  customFocus?: string;
}

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (newWorksheet: WorksheetData) => void;
  initialData?: AIGeneratorInitialMetadata | null;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated,
  initialData,
}) => {
  // Step 1: Grade Selection (1 - 6 SD) & Semester
  const [selectedGrade, setSelectedGrade] = useState<number>(4);
  const [selectedSemester, setSelectedSemester] = useState<'Semester 1 (Ganjil)' | 'Semester 2 (Genap)'>(
    'Semester 1 (Ganjil)'
  );
  // Step 2: Element Selection
  const [selectedElement, setSelectedElement] = useState<string>('Akidah');
  // Step 3: Chapter / Topic
  const [selectedTopic, setSelectedTopic] = useState<string>(
    'Bab 2: Meneladani 5 Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Aziz, Al-Mu\'min)'
  );
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [useCustomTopic, setUseCustomTopic] = useState<boolean>(false);
  // Step 4: Difficulty Level
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      if (initialData.grade && initialData.grade >= 1 && initialData.grade <= 6) {
        setSelectedGrade(initialData.grade);
      }
      if (initialData.semester) {
        if (initialData.semester.includes('2') || initialData.semester.toLowerCase().includes('genap')) {
          setSelectedSemester('Semester 2 (Genap)');
        } else {
          setSelectedSemester('Semester 1 (Ganjil)');
        }
      }
      if (initialData.difficulty) {
        const diffLower = initialData.difficulty.toLowerCase();
        if (diffLower.includes('easy') || diffLower.includes('mudah')) {
          setSelectedDifficulty('Easy');
        } else if (diffLower.includes('hard') || diffLower.includes('hots') || diffLower.includes('menantang')) {
          setSelectedDifficulty('Hard');
        } else {
          setSelectedDifficulty('Medium');
        }
      }
      if (initialData.element) {
        setSelectedElement(initialData.element);
      }
      if (initialData.topic) {
        setSelectedTopic(initialData.topic);
        setCustomTopicInput(initialData.topic);
        setUseCustomTopic(true);
      }
    }
  }, [isOpen, initialData]);

  // Step 4: Components checklist
  const [includedComponents, setIncludedComponents] = useState({
    dalil: true,
    matching: true,
    hots: true,
    reflective: true,
    adab: true,
    qrAudio: true,
    rubric: true,
  });

  // Generation & Animation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<WorksheetData | null>(null);
  const [isExportingPDFInModal, setIsExportingPDFInModal] = useState(false);

  // Reset states when modal is toggled
  useEffect(() => {
    if (!isOpen) {
      setGeneratedResult(null);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const GENERATION_STAGES = [
    { title: 'Menelaah SK BSKAP No. 020/H/KR/2026', desc: 'Menyelaraskan Capaian Pembelajaran resmi PAI SD Fase terkait...' },
    { title: 'Merumuskan Tujuan Pembelajaran (TP)', desc: 'Menurunkan indikator pemahaman konsep & teladan budi pekerti...' },
    { title: 'Mengintegrasikan Ayat Suci & Dalil', desc: 'Menyusun teks Arab berharakat font Amiri, terjemahan, dan tadabbur...' },
    { title: 'Membangun Gamified Match Nodes & Soal HOTS', desc: 'Merancang simpul pasangan interaktif dan soal bernalar kontekstual...' },
    { title: 'Finalisasi Tata Letak A4 Digital Twin', desc: 'Mengompilasi modul LKPD siap cetak dan pembelajaran...' },
  ];

  // Auto-select corresponding topic and synchronize when grade, element, or semester changes
  useEffect(() => {
    if (!useCustomTopic) {
      const matched = getCurriculumTopic(selectedGrade, selectedSemester, selectedElement);
      setSelectedTopic(matched.chapterTitle);
    }
  }, [selectedGrade, selectedElement, selectedSemester, useCustomTopic]);

  if (!isOpen) return null;

  const currentGradeObj = SD_GRADES.find((g) => g.level === selectedGrade) || SD_GRADES[3];
  const availableTopicsForElement = getTopicsForElement(selectedGrade, selectedSemester, selectedElement);

  const matchedCurriculum = (() => {
    if (useCustomTopic && customTopicInput.trim() !== '') {
      const base = getCurriculumTopic(selectedGrade, selectedSemester, selectedElement);
      return {
        ...base,
        chapterTitle: customTopicInput.trim(),
      };
    }
    const found = availableTopicsForElement.find((t) => t.chapterTitle === selectedTopic);
    if (found) return found;
    return getCurriculumTopic(selectedGrade, selectedSemester, selectedElement);
  })();

  const handleToggleComponent = (key: keyof typeof includedComponents) => {
    setIncludedComponents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate animated generation steps for transparent, satisfying UX
    const stageInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    const topicFinal = useCustomTopic && customTopicInput.trim()
      ? customTopicInput.trim()
      : selectedTopic;

    try {
      const res = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicFinal,
          grade: `${currentGradeObj.label} (${currentGradeObj.fase})`,
          semester: selectedSemester,
          element: selectedElement,
          difficulty: selectedDifficulty,
          tp: matchedCurriculum.tp,
          cp020: matchedCurriculum.cp020,
          focus:
            initialData?.customFocus ||
            `Kesesuaian Standar SK BSKAP No. 020/H/KR/2026 Elemen ${selectedElement}. Jenjang ${currentGradeObj.label} ${selectedSemester}. Tingkat Kesulitan: ${selectedDifficulty}. Indikator TP: ${matchedCurriculum.tp}.`,
        }),
      });

      let generatedData: WorksheetData;

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          generatedData = {
            id: `sd-pai-${selectedGrade}-${Date.now()}`,
            institution: {
              name: d.institutionName || 'SD NEGERI TELADAN 01 PAGI',
              subname: 'DINAS PENDIDIKAN DAN KEBUDAYAAN - KEMENTERIAN AGAMA RI',
              npsn: 'NPSN: 20108921 | AKREDITASI A (UNGGUL)',
              address: 'Jl. Merdeka Pendidikan No. 10, Jakarta Selatan. Telp: (021) 7890123',
              logoUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=120&q=80',
              badgeText: `KURIKULUM MERDEKA SD • CP 020/2026 (${currentGradeObj.fase.toUpperCase()})`,
            },
            title: d.title || `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD`,
            subject: 'Pendidikan Agama Islam & Budi Pekerti (PAI)',
            grade: `${currentGradeObj.label} (${currentGradeObj.fase})`,
            semester: selectedSemester,
            difficulty: d.difficulty || selectedDifficulty,
            chapter: d.chapter || topicFinal,
            duration: '2 x 35 Menit (Pertemuan Tatap Muka)',
            curriculumStandard: `CP SK No. 020/2026 (${currentGradeObj.fase}): ${
              d.curriculumStandard || matchedCurriculum.cp020
            }`,
            studentHeader: {
              nameLabel: 'Nama Lengkap Siswa',
              classLabel: 'Kelas / No. Absen',
              dateLabel: 'Hari / Tanggal',
              scoreLabel: 'Nilai & Paraf Guru',
            },
            dalil: includedComponents.dalil
              ? {
                  surah: d.dalil?.surah || matchedCurriculum.dalil.surah,
                  arabic: d.dalil?.arabic || matchedCurriculum.dalil.arabic,
                  translation: d.dalil?.translation || matchedCurriculum.dalil.translation,
                  note: d.dalil?.note || matchedCurriculum.dalil.note,
                }
              : { surah: '', arabic: '', translation: '', note: '' },
            materialsHeading: 'A. Ringkasan Konsep & Pemahaman Kunci',
            materials: (d.materialsSummary || matchedCurriculum.materials).map((m: any, idx: number) => ({
              id: `m_${idx}`,
              term: m.term,
              arabicBadge: m.arabicBadge || '',
              meaning: m.meaning,
              behavior: m.behavior,
            })),
            matchingHeading: 'B. Aktivitas Gamified Match Nodes (Hubungkan Titik Simpul)',
            matchingInstruction:
              'Tariklah garis lurus untuk menghubungkan titik simpul putih (⚪) dari nama konsep di sisi kiri ke artinya yang tepat di sisi kanan!',
            matchingPairs: includedComponents.matching
              ? (d.matchingActivity || matchedCurriculum.matchingPairs).map((p: any, idx: number) => ({
                  id: `p_${idx}`,
                  leftText: p.left || p.leftText,
                  leftArabic: p.arabicBadge || p.leftArabic || '',
                  rightText: p.right || p.rightText,
                }))
              : [],
            multipleChoiceHeading:
              selectedDifficulty === 'Hard'
                ? 'C. Evaluasi Pemahaman HOTS C4–C6 (Pilihan Ganda Penalaran SD)'
                : selectedDifficulty === 'Easy'
                ? 'C. Evaluasi Pemahaman LOTS C1–C2 (Pilihan Ganda Dasar Ramah SD)'
                : 'C. Evaluasi Pemahaman MOTS C3 (Pilihan Ganda Aplikasi Kontekstual)',
            multipleChoice: includedComponents.hots
              ? (d.multipleChoice || calibrateQuestionsByDifficulty(matchedCurriculum, selectedDifficulty)).map((q: any, idx: number) => ({
                  id: `q_${idx}`,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer ?? 0,
                  explanation: q.explanation || 'Pembahasan kunci jawaban',
                }))
              : [],
            reflectiveHeading: 'D. Lembar Refleksi Karakter & Pengamalan Murid',
            reflectivePrompt: includedComponents.reflective
              ? {
                  id: 'rf_sd',
                  question:
                    d.reflectiveQuestion || matchedCurriculum.reflectivePrompt.question,
                  guidingHint: matchedCurriculum.reflectivePrompt.hint,
                  lines: 3,
                }
              : { id: 'rf_sd', question: '', guidingHint: '', lines: 0 },
            adabHeading: 'E. Misi Karakter & Pembiasaan Akhlak (Amalan Pekan Ini)',
            adabMissions: includedComponents.adab
              ? (d.adabMissions || matchedCurriculum.adabMissions).map((ab: any, idx: number) => ({
                  id: `ab_${idx}`,
                  task: ab.task,
                  reflection: ab.reflection,
                  checked: idx === 0,
                }))
              : [],
            rubric: includedComponents.rubric
              ? {
                  aspects: [
                    { name: 'Kerapian & Ketepatan Gamified Match Nodes', score: 30 },
                    { name: 'Ketepatan Jawaban Soal Evaluasi', score: 40 },
                    { name: 'Refleksi Karakter & Kejujuran Misi Adab', score: 30 },
                  ],
                  teacherNotes: `Ananda telah mempelajari materi ${topicFinal} dengan sungguh-sungguh. Pertahankan adab santun dan shalat tepat waktu!`,
                }
              : { aspects: [], teacherNotes: '' },
            qrAudio: includedComponents.qrAudio
              ? {
                  title: 'Audio Tilawah & Murottal Tartil SD',
                  subtitle: `Pindai untuk menyimak tartil surah ramah anak`,
                  code: `LUMINA-SD${selectedGrade}-${Date.now().toString().slice(-4)}`,
                  targetUrl: 'https://quran.kemenag.go.id',
                }
              : { title: '', subtitle: '', code: '', targetUrl: '' },
          };
        } else {
          generatedData = buildLocalFallback(topicFinal, currentGradeObj, matchedCurriculum, selectedDifficulty);
        }
      } else {
        generatedData = buildLocalFallback(topicFinal, currentGradeObj, matchedCurriculum, selectedDifficulty);
      }

      // Finish with brief smooth transition and reveal result preview
      setGenerationStep(GENERATION_STAGES.length - 1);
      setTimeout(() => {
        clearInterval(stageInterval);
        setIsGenerating(false);
        setGeneratedResult(generatedData);
      }, 400);
    } catch (e) {
      clearInterval(stageInterval);
      const generatedData = buildLocalFallback(topicFinal, currentGradeObj, matchedCurriculum, selectedDifficulty);
      setIsGenerating(false);
      setGeneratedResult(generatedData);
    }
  };

  const handleApplyAndOpen = () => {
    if (generatedResult) {
      onApplyGenerated(generatedResult);
      onClose();
    }
  };

  const handleDownloadPdfFromModal = async () => {
    if (!generatedResult) return;
    try {
      setIsExportingPDFInModal(true);
      const rawChapter = generatedResult.chapter || 'Modul';
      const cleanChapter = rawChapter.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `LKPD_${generatedResult.grade || 'SD'}_${cleanChapter}.pdf`;
      await exportCanvasToPDF('a4-worksheet-canvas', filename, generatedResult);
    } finally {
      setIsExportingPDFInModal(false);
    }
  };

  const handleDownloadWordFromModal = () => {
    if (!generatedResult) return;
    exportWorksheetToWord(generatedResult);
  };

  const buildLocalFallback = (
    topicTitle: string,
    gradeObj: (typeof SD_GRADES)[number],
    curriculum: SDCurriculumTopic,
    diffLevel: 'Easy' | 'Medium' | 'Hard' = selectedDifficulty
  ): WorksheetData => {
    const calibratedMC = calibrateQuestionsByDifficulty(curriculum, diffLevel);
    return {
      id: `sd-pai-${selectedGrade}-${Date.now()}`,
      institution: {
        name: 'SD NEGERI TELADAN 01 PAGI',
        subname: 'DINAS PENDIDIKAN DAN KEBUDAYAAN - KEMENTERIAN AGAMA RI',
        npsn: 'NPSN: 20108921 | AKREDITASI A (UNGGUL)',
        address: 'Jl. Merdeka Pendidikan No. 10, Jakarta Selatan. Telp: (021) 7890123',
        logoUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=120&q=80',
        badgeText: `KURIKULUM MERDEKA SD • CP 020/2026 (${gradeObj.fase.toUpperCase()})`,
      },
      title: `LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD`,
      subject: 'Pendidikan Agama Islam & Budi Pekerti (PAI)',
      grade: `${gradeObj.label} (${gradeObj.fase})`,
      semester: selectedSemester,
      difficulty: diffLevel,
      chapter: topicTitle,
      duration: '2 x 35 Menit (Pertemuan Tatap Muka)',
      curriculumStandard: `CP SK No. 020/2026 (${gradeObj.fase}): ${curriculum.cp020}`,
      studentHeader: {
        nameLabel: 'Nama Lengkap Siswa',
        classLabel: 'Kelas / No. Absen',
        dateLabel: 'Hari / Tanggal',
        scoreLabel: 'Nilai & Paraf Guru',
      },
      dalil: curriculum.dalil,
      materialsHeading: 'A. Ringkasan Konsep: Intisari Materi PAI SD',
      materials: curriculum.materials.map((m, idx) => ({
        id: `m_${idx}`,
        term: m.term,
        arabicBadge: m.arabicBadge || '',
        meaning: m.meaning,
        behavior: m.behavior,
      })),
      matchingHeading: 'B. Aktivitas Gamified Match Nodes (Hubungkan Titik Simpul)',
      matchingInstruction:
        'Tariklah garis lurus untuk menghubungkan titik simpul putih (⚪) dari nama konsep di sisi kiri ke artinya yang tepat di sisi kanan!',
      matchingPairs: curriculum.matchingPairs.map((p, idx) => ({
        id: `p_${idx}`,
        leftText: p.leftText,
        leftArabic: p.leftArabic || '',
        rightText: p.rightText,
      })),
      multipleChoiceHeading:
        diffLevel === 'Hard'
          ? 'C. Evaluasi Pemahaman HOTS C4–C6 (Pilihan Ganda Penalaran Siswa SD)'
          : diffLevel === 'Easy'
          ? 'C. Evaluasi Pemahaman LOTS C1–C2 (Pilihan Ganda Dasar Ramah Siswa SD)'
          : 'C. Evaluasi Pemahaman MOTS C3 (Pilihan Ganda Aplikasi Kontekstual Siswa SD)',
      multipleChoice: calibratedMC.map((q, idx) => ({
        id: `q_${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      reflectiveHeading: 'D. Lembar Refleksi Karakter & Pengamalan Murid',
      reflectivePrompt: {
        id: 'rf_sd',
        question: curriculum.reflectivePrompt.question,
        guidingHint: curriculum.reflectivePrompt.hint,
        lines: 3,
      },
      adabHeading: 'E. Misi Karakter & Pembiasaan Akhlak (Amalan Pekan Ini)',
      adabMissions: curriculum.adabMissions.map((ab, idx) => ({
        id: `ab_${idx}`,
        task: ab.task,
        reflection: ab.reflection,
        checked: idx === 0,
      })),
      rubric: {
        aspects: [
          { name: 'Kerapian & Ketepatan Gamified Match Nodes', score: 30 },
          { name: 'Ketepatan Jawaban Soal HOTS', score: 40 },
          { name: 'Refleksi Karakter & Kejujuran Misi Adab', score: 30 },
        ],
        teacherNotes: `Ananda telah mempelajari materi ${topicTitle} dengan tekun. Pertahankan adab santun dan shalat berjamaah!`,
      },
      qrAudio: {
        title: 'Audio Tilawah & Murottal Tartil SD',
        subtitle: `Pindai untuk menyimak tartil surah dan penjelasan ramah anak`,
        code: `LUMINA-SD${selectedGrade}-${Date.now().toString().slice(-4)}`,
        targetUrl: 'https://quran.kemenag.go.id',
      },
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-indigo-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 font-jakarta">
                  Generator LKPD PAI SD
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  CP No. 020 / 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perancang Lembar Kerja Peserta Didik SD Terstandar Nasional & Terpandu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area: Result Preview vs Wizard Form vs Live Animated Generation */}
        {!isGenerating && generatedResult ? (
          /* Step 5: Pratinjau Hasil Generate LKPD Siap Pakai */
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Success Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-700 text-white shadow-lg flex items-start gap-3.5 border border-emerald-400/40">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-extrabold font-jakarta tracking-tight text-white">
                    LKPD Berhasil Dirancang & Siap Pakai!
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                    Standar CP No. 020/2026
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 mt-0.5 leading-relaxed">
                  Modul pembelajaran materi <strong>{generatedResult.chapter}</strong> telah lengkap dengan dalil naqli berharakat, gamified match nodes, soal HOTS, dan misi pembiasaan akhlak.
                </p>
              </div>
            </div>

            {/* Generated Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Card 1: Identitas & Capaian */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs">
                  <BookOpen className="w-4 h-4 text-[#0284c7]" />
                  <span>Identitas Modul & Kurikulum</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p><strong className="text-slate-800">Judul:</strong> {generatedResult.title}</p>
                  <p><strong className="text-slate-800">Bab/Materi:</strong> {generatedResult.chapter}</p>
                  <p><strong className="text-slate-800">Sasaran:</strong> {generatedResult.grade} &bull; {generatedResult.semester}</p>
                  <p><strong className="text-slate-800">Tingkat / Level:</strong> {generatedResult.difficulty || 'Sedang (MOTS C3)'}</p>
                </div>
              </div>

              {/* Card 2: Dalil Naqli */}
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sky-900 font-extrabold text-xs">
                    <ScrollText className="w-4 h-4 text-sky-600" />
                    <span>Dalil Naqli Rujukan</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                    {generatedResult.dalil?.surah || 'Dalil PAI'}
                  </span>
                </div>
                {generatedResult.dalil?.arabic && (
                  <p dir="rtl" className="font-serif text-sm text-sky-950 font-bold leading-relaxed text-right line-clamp-2">
                    {generatedResult.dalil.arabic}
                  </p>
                )}
                <p className="text-[10.5px] italic text-slate-600 line-clamp-2">
                  “{generatedResult.dalil?.translation}”
                </p>
              </div>
            </div>

            {/* Card 3: Struktur Komponen Aktivitas */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Rincian Komponen Lembar Kerja:</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <span className="block text-[10px] text-slate-500">Ringkasan Konsep</span>
                  <span className="block text-sm font-extrabold text-slate-800 mt-0.5">
                    {generatedResult.materials?.length || 0} Materi
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-center">
                  <span className="block text-[10px] text-indigo-700">Match Nodes</span>
                  <span className="block text-sm font-extrabold text-indigo-900 mt-0.5">
                    {generatedResult.matchingPairs?.length || 0} Pasang
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-center">
                  <span className="block text-[10px] text-amber-700">Soal HOTS</span>
                  <span className="block text-sm font-extrabold text-amber-900 mt-0.5">
                    {generatedResult.multipleChoice?.length || 0} Butir
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-center">
                  <span className="block text-[10px] text-emerald-700">Misi Karakter</span>
                  <span className="block text-sm font-extrabold text-emerald-900 mt-0.5">
                    {generatedResult.adabMissions?.length || 0} Amalan
                  </span>
                </div>
              </div>

              {/* Sample Question Preview */}
              {generatedResult.multipleChoice && generatedResult.multipleChoice.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                  <strong className="text-slate-900">Contoh Soal HOTS: </strong>
                  <span>{generatedResult.multipleChoice[0].question}</span>
                </div>
              )}
            </div>

            {/* Direct Action Guidance Box */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Klik <strong>"Buka di Kanvas A4"</strong> untuk melihat fisik kertas & menyunting, atau pilih <strong>"Unduh PDF / Word"</strong> untuk menyimpan berkas.
                </span>
              </div>
            </div>
          </div>
        ) : !isGenerating ? (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Step 1: Pilih Kelas SD & Semester */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  Pilih Jenjang Kelas & Semester:
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {currentGradeObj.fase}
                  </span>
                </div>
              </div>

              {/* Semester Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedSemester('Semester 1 (Ganjil)')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedSemester === 'Semester 1 (Ganjil)'
                      ? 'bg-white text-[#0284c7] shadow-xs border border-slate-200/80 ring-2 ring-sky-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Semester 1 (Ganjil)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSemester('Semester 2 (Genap)')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedSemester === 'Semester 2 (Genap)'
                      ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 ring-2 ring-emerald-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Semester 2 (Genap)</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {SD_GRADES.map((g) => {
                  const isSelected = selectedGrade === g.level;
                  return (
                    <button
                      key={g.level}
                      type="button"
                      onClick={() => setSelectedGrade(g.level)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#0284c7] bg-sky-50/80 text-[#0284c7] font-extrabold shadow-xs ring-2 ring-sky-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-700 font-semibold'
                      }`}
                    >
                      <span className="block text-xs">{g.label}</span>
                      <span className="block text-[9.5px] text-slate-400 font-normal mt-0.5">
                        {g.fase}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pilih Elemen PAI SD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  Pilih Elemen Pembelajaran PAI SD:
                </label>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                  Materi & Indikator otomatis sinkron dengan elemen
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {SD_ELEMENTS.map((elem) => {
                  const isSelected = selectedElement === elem;
                  const previewTopic = getCurriculumTopic(selectedGrade, selectedSemester, elem);
                  return (
                    <button
                      key={elem}
                      type="button"
                      onClick={() => {
                        setSelectedElement(elem);
                        const nextTopic = getCurriculumTopic(selectedGrade, selectedSemester, elem);
                        setSelectedTopic(nextTopic.chapterTitle);
                        setUseCustomTopic(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 text-indigo-950 font-extrabold ring-2 ring-indigo-300 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold block">{elem}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <span
                        className="block text-[9.5px] text-slate-500 font-normal truncate mt-0.5"
                        title={previewTopic.chapterTitle}
                      >
                        {previewTopic.chapterTitle.split(':')[0]}: {previewTopic.chapterTitle.split(':')[1]?.trim() || previewTopic.chapterTitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Synchronization Notification Banner */}
              <div className="flex items-center justify-between p-2 px-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl text-[10.5px]">
                <div className="flex items-center gap-1.5 text-emerald-900 font-semibold truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Tersinkronisasi otomatis dengan CP 020/2026: <strong className="font-extrabold text-emerald-950">{selectedElement}</strong>
                  </span>
                </div>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-white border border-emerald-300 text-emerald-700 shrink-0">
                  {selectedSemester}
                </span>
              </div>
            </div>

            {/* Step 3: Topik Materi Kurikulum Merdeka */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  Materi Pokok & Indikator Bab (SK No. 020/2026):
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomTopic(!useCustomTopic)}
                  className="text-[10.5px] text-[#0284c7] hover:underline font-semibold"
                >
                  {useCustomTopic ? 'Pilih Materi Standar' : '+ Tulis Topik Kustom'}
                </button>
              </div>

              {!useCustomTopic ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  {/* Materi Pokok Header / Dropdown if multiple */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-600" />
                        Materi Pokok & Bab Terpilih:
                      </span>
                      <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-[#0284c7] border border-sky-300 shrink-0">
                        {matchedCurriculum.semester}
                      </span>
                    </div>

                    {availableTopicsForElement.length > 1 ? (
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                      >
                        {availableTopicsForElement.map((t) => (
                          <option key={t.id} value={t.chapterTitle}>
                            {t.chapterTitle}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="font-bold text-slate-900 text-xs leading-snug">
                        {selectedTopic}
                      </div>
                    )}
                  </div>

                  {/* Indikator Bab & Tujuan Pembelajaran (TP) */}
                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 text-[10.5px] text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Indikator Bab & Tujuan Pembelajaran (TP):</span>
                    </div>
                    <p className="font-medium text-emerald-950 pl-5">
                      {matchedCurriculum.tp}
                    </p>
                  </div>

                  {/* Capaian Pembelajaran (CP) SK No. 020/2026 */}
                  <div className="text-[10px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed space-y-1">
                    <span className="font-extrabold text-slate-800 block">
                      Capaian Pembelajaran (CP SK 020/2026 - {currentGradeObj.fase}):
                    </span>
                    <p className="text-slate-600 italic">
                      "{matchedCurriculum.cp020}"
                    </p>
                  </div>

                  {/* Rujukan Dalil & Sub-Pilihan Ruang Lingkup Materi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/80">
                      <span className="font-bold text-amber-900 block flex items-center gap-1">
                        <ScrollText className="w-3 h-3 text-amber-700" />
                        Rujukan Dalil:
                      </span>
                      <span className="font-semibold text-amber-950 block mt-0.5 truncate">
                        {matchedCurriculum.dalil.surah}
                      </span>
                      <span className="text-slate-600 block line-clamp-1 italic text-[9.5px]">
                        {matchedCurriculum.dalil.translation}
                      </span>
                    </div>

                    <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-200/80">
                      <span className="font-bold text-sky-900 block flex items-center gap-1">
                        <Layers className="w-3 h-3 text-sky-700" />
                        Sub-Pilihan Konsep Inti:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchedCurriculum.materials.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-white text-sky-950 border border-sky-200 text-[9px] font-semibold"
                          >
                            {m.term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Sinkronisasi CP 020/2026 */}
                  <div className="flex items-center justify-between p-2 px-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Semua sub-pilihan tersinkronisasi otomatis dengan CP 020/2026 sebelum di-generate!
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-300">
                      Tersinkron
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="Contoh: Bab 1: Mengenal Rukun Islam & Dua Kalimah Syahadat..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                  <p className="text-[10px] text-slate-500 italic">
                    AI Agent akan secara otomatis memformatkan CP, dalil, soal, dan aktivitas sesuai topik di atas.
                  </p>
                </div>
              )}
            </div>

            {/* Step 4: Tingkat Kesulitan Soal AI Agent (Difficulty Level: Easy, Medium, Hard) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs font-jakarta">
                  <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black">
                    4
                  </span>
                  Tingkat Kesulitan Soal (Difficulty Level):
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Kompleksitas AI Agent
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    level: 'Easy' as const,
                    label: 'Easy (Mudah)',
                    badge: 'LOTS (C1–C2)',
                    desc: 'Mengingat & pemahaman dasar, bahasa ramah anak awal SD, pencocokan konsep lugas.',
                    activeClass: 'border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-200 shadow-2xs',
                    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  },
                  {
                    level: 'Medium' as const,
                    label: 'Medium (Sedang)',
                    badge: 'MOTS (C3)',
                    desc: 'Aplikasi konsep teladan islami kontekstual di sekolah, pertemanan, dan keluarga.',
                    activeClass: 'border-sky-500 bg-sky-50/90 text-sky-950 ring-2 ring-sky-200 shadow-2xs',
                    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
                  },
                  {
                    level: 'Hard' as const,
                    label: 'Hard (Menantang)',
                    badge: 'HOTS (C4–C6)',
                    desc: 'Analisis dilema moral, studi kasus kontekstual sekolah, penalaran kritis bernalar tinggi.',
                    activeClass: 'border-purple-500 bg-purple-50/90 text-purple-950 ring-2 ring-purple-200 shadow-2xs',
                    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
                  },
                ].map((item) => {
                  const isSelected = selectedDifficulty === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setSelectedDifficulty(item.level)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? `${item.activeClass} font-extrabold`
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11.5px] font-bold block">{item.label}</span>
                        <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded border ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[9.5px] leading-relaxed text-slate-500 font-normal">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Komponen LKPD yang Dikehendaki Guru */}
            <div>
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black">
                  5
                </span>
                Pilih Komponen Lembar Kerja yang Disertakan:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { key: 'dalil', label: 'Dalil Al-Qur\'an / Hadis', icon: ScrollText },
                  { key: 'matching', label: 'Gamified Match Nodes', icon: GitCommit },
                  { key: 'hots', label: 'Soal HOTS Bernalar SD', icon: HelpCircle },
                  { key: 'reflective', label: 'Refleksi Karakter Diri', icon: Lightbulb },
                  { key: 'adab', label: 'Misi Adab & Karakter', icon: HeartHandshake },
                  { key: 'qrAudio', label: 'QR Audio Tartil Tilawah', icon: QrCode },
                ].map(({ key, label, icon: Icon }) => {
                  const isChecked = includedComponents[key as keyof typeof includedComponents];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleComponent(key as keyof typeof includedComponents)}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-400 font-medium'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] ${
                          isChecked ? 'bg-emerald-600' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[10.5px] leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Live Animated Generation Stages */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0284c7] via-sky-500 to-indigo-700 flex items-center justify-center shadow-xl animate-pulse">
                <Wand2 className="w-10 h-10 text-amber-300 animate-spin" />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase shadow-xs">
                AI Agent
              </span>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base font-extrabold text-slate-900 font-jakarta">
                {GENERATION_STAGES[generationStep].title}
              </h3>
              <p className="text-xs text-slate-500">
                {GENERATION_STAGES[generationStep].desc}
              </p>
            </div>

            {/* Progress indicators */}
            <div className="w-full max-w-sm space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#0284c7] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((generationStep + 1) / GENERATION_STAGES.length) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
                <span>Tahap {generationStep + 1} dari {GENERATION_STAGES.length}</span>
                <span>Standar CP 020/2026 SD</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {!isGenerating && generatedResult ? (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setGeneratedResult(null)}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Sesuaikan / Generate Ulang</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDownloadPdfFromModal}
                disabled={isExportingPDFInModal}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                title="Unduh langsung lembar kerja dalam format PDF A4"
              >
                {isExportingPDFInModal ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0284c7]" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#0284c7]" />
                )}
                <span>Unduh PDF A4</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWordFromModal}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                title="Unduh dalam format dokumen Microsoft Word (.doc) rapi"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                <span>Unduh Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handleApplyAndOpen}
                className="w-full sm:w-auto px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ring-2 ring-sky-300/50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buka di Kanvas A4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : !isGenerating && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Target: <strong className="text-slate-800">{currentGradeObj.label}</strong> • <strong className="text-[#0284c7]">{selectedSemester}</strong> • Elemen <strong className="text-indigo-700">{selectedElement}</strong> • Tingkat <strong className="text-emerald-700">{selectedDifficulty}</strong>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartGeneration}
                className="animate-aura-glow px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate LKPD Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
