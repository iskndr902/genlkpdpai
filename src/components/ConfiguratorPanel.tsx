import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Building2,
  BookMarked,
  ScrollText,
  GitCommit,
  CheckSquare,
  HelpCircle,
  HeartHandshake,
  QrCode,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  BookOpenCheck,
  Award,
  CheckCircle2,
  Check,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Copy,
  Code,
  ListFilter,
  X,
  ExternalLink,
  SlidersHorizontal,
  Calendar,
} from 'lucide-react';
import {
  WorksheetData,
  MaterialItem,
  MatchingPair,
  MultipleChoiceItem,
  AdabMissionItem,
} from '../types/worksheet';
import {
  PAI_LEARNING_OUTCOMES_2026,
  PAILearningOutcome2026,
} from '../data/sdLearningOutcomes2026';
import {
  SD_ELEMENTS,
  getCurriculumTopic,
  calibrateQuestionsByDifficulty,
} from '../data/sdCurriculum2026';

interface ConfiguratorPanelProps {
  worksheet: WorksheetData;
  onChange: (updated: WorksheetData) => void;
  onReset: () => void;
  onOpenAIGenerator: (metadata?: any) => void;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  worksheet,
  onChange,
  onReset,
  onOpenAIGenerator,
}) => {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    kop: true,
    cp: true,
    dalil: false,
    matching: true,
    hots: false,
    materials: false,
    adab: false,
    rubric: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Main Tab Navigation: 'standards' vs 'editor'
  const [activeMainTab, setActiveMainTab] = useState<'standards' | 'editor'>('standards');

  // Multi-select state for Curriculum Standards tab
  const [selectedOutcomeIds, setSelectedOutcomeIds] = useState<string[]>(() => {
    const matched = PAI_LEARNING_OUTCOMES_2026.find(
      (o) =>
        worksheet.curriculumStandard.includes(o.code) ||
        worksheet.chapter.toLowerCase().includes(o.suggestedChapter.toLowerCase())
    );
    return [matched ? matched.id : 'fase-b-akidah'];
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [dropdownSearch, setDropdownSearch] = useState<string>('');
  const [dropdownFase, setDropdownFase] = useState<'Semua' | 'Fase A' | 'Fase B' | 'Fase C'>('Semua');
  const [dropdownGrade, setDropdownGrade] = useState<string>('Semua');
  const [dropdownSemester, setDropdownSemester] = useState<string>('Semua');
  const [dropdownElement, setDropdownElement] = useState<string>('Semua');
  const [showMetadataInspector, setShowMetadataInspector] = useState<boolean>(false);
  const [copiedMetadata, setCopiedMetadata] = useState<boolean>(false);

  // Difficulty level state for AI Agent & Curriculum (Easy, Medium, Hard)
  const [difficultyLevel, setDifficultyLevel] = useState<'Easy' | 'Medium' | 'Hard'>(() => {
    if (worksheet.difficulty) {
      if (worksheet.difficulty.toLowerCase().includes('easy') || worksheet.difficulty.toLowerCase().includes('mudah')) return 'Easy';
      if (worksheet.difficulty.toLowerCase().includes('hard') || worksheet.difficulty.toLowerCase().includes('hots') || worksheet.difficulty.toLowerCase().includes('menantang')) return 'Hard';
    }
    return 'Medium';
  });

  // Local state for CP selection within sidebar (Standar BSKAP 020/2026)
  const [selectedCPFase, setSelectedCPFase] = useState<'Fase A' | 'Fase B' | 'Fase C'>(() => {
    if (worksheet.grade.includes('Fase A') || worksheet.grade.includes('Kelas 1') || worksheet.grade.includes('Kelas 2')) return 'Fase A';
    if (worksheet.grade.includes('Fase C') || worksheet.grade.includes('Kelas 5') || worksheet.grade.includes('Kelas 6')) return 'Fase C';
    return 'Fase B';
  });
  const [selectedCPElement, setSelectedCPElement] = useState<string>('Semua');
  const [searchCPQuery, setSearchCPQuery] = useState<string>('');
  const [appliedCPId, setAppliedCPId] = useState<string | null>(null);
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  // Filtered outcomes for structured multi-select dropdown
  const dropdownFilteredOutcomes = useMemo(() => {
    return PAI_LEARNING_OUTCOMES_2026.filter((outcome) => {
      if (dropdownFase !== 'Semua' && outcome.fase !== dropdownFase) return false;
      if (dropdownGrade !== 'Semua') {
        if (!outcome.grades.toLowerCase().includes(dropdownGrade.toLowerCase())) return false;
      }
      if (dropdownSemester !== 'Semua') {
        if (
          outcome.semesterScope &&
          !outcome.semesterScope.includes(dropdownSemester) &&
          outcome.semesterScope !== 'Semester 1 & 2'
        ) {
          return false;
        }
      }
      if (dropdownElement !== 'Semua' && outcome.element !== dropdownElement) return false;
      if (dropdownSearch.trim() !== '') {
        const q = dropdownSearch.toLowerCase();
        const str = `${outcome.code} ${outcome.element} ${outcome.fase} ${outcome.grades} ${outcome.suggestedChapter} ${outcome.officialCP} ${outcome.recommendedTP} ${outcome.coreScope.join(' ')}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [dropdownFase, dropdownGrade, dropdownSemester, dropdownElement, dropdownSearch]);

  // Selected outcome objects
  const selectedOutcomes = useMemo(() => {
    const list = PAI_LEARNING_OUTCOMES_2026.filter((o) => selectedOutcomeIds.includes(o.id));
    if (list.length > 0) return list;
    return [PAI_LEARNING_OUTCOMES_2026[1]];
  }, [selectedOutcomeIds]);

  // Derived metadata mapped specifically for AI generator
  const aiGeneratorMetadata = useMemo(() => {
    const primary = selectedOutcomes[0] || PAI_LEARNING_OUTCOMES_2026[1];
    const uniqueElements = Array.from(new Set(selectedOutcomes.map((o) => o.element)));
    const targetFases = Array.from(new Set(selectedOutcomes.map((o) => o.fase)));
    const targetGrades = Array.from(new Set(selectedOutcomes.map((o) => o.grades)));
    const allScopes = Array.from(new Set(selectedOutcomes.flatMap((o) => o.coreScope)));

    let gradeNum = 4;
    if (targetFases.includes('Fase A')) gradeNum = 1;
    else if (targetFases.includes('Fase B')) gradeNum = 4;
    else if (targetFases.includes('Fase C')) gradeNum = 5;

    const currentSemester = dropdownSemester !== 'Semua'
      ? (dropdownSemester === 'Semester 1' ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)')
      : (worksheet.semester || 'Semester 1 (Ganjil)');

    const payload = {
      curriculum_framework: 'SK BSKAP Kemendikbudristek No. 020/H/KR/2026',
      education_level: 'Sekolah Dasar (SD) Kelas 1–6',
      target_fase: targetFases,
      target_grades: targetGrades,
      target_semester: currentSemester,
      integrated_elements: uniqueElements,
      total_cp_selected: selectedOutcomes.length,
      difficulty_level: difficultyLevel,
      difficulty_pedagogical_mode:
        difficultyLevel === 'Easy'
          ? 'LOTS (C1-C2): Soal mengingat dan memahami konsep dasar ramah anak SD awal'
          : difficultyLevel === 'Hard'
          ? 'HOTS (C4-C6): Soal penalaran analitis, studi kasus dilema moral islami di sekolah, dan pemecahan masalah'
          : 'MOTS (C3): Soal aplikasi kontekstual ajaran dalam kehidupan nyata anak SD',
      learning_outcomes: selectedOutcomes.map((o) => ({
        code: o.code,
        element: o.element,
        fase: o.fase,
        grades: o.grades,
        semester_scope: o.semesterScope || 'Semester 1 & 2',
        official_cp_statement: o.officialCP,
        recommended_tp: o.recommendedTP,
        suggested_chapter: o.suggestedChapter,
        core_scope: o.coreScope,
        dalil: {
          surah: o.suggestedDalil.surah,
          arabic: o.suggestedDalil.arabic,
          translation: o.suggestedDalil.translation,
        },
      })),
      ai_agent_instructions: {
        primary_topic: selectedOutcomes.map((o) => o.suggestedChapter).join(' & '),
        dalil_anchor: primary.suggestedDalil,
        semester: currentSemester,
        difficulty: difficultyLevel,
        prompt_focus: `Kesesuaian Standar CP 020/2026 jenjang SD (${targetGrades.join(', ')}) - ${currentSemester}. Tingkat Kesulitan: ${difficultyLevel}. Elemen: ${uniqueElements.join(', ')}. TP: ${selectedOutcomes.map((o) => o.recommendedTP).join('; ')}`,
      },
    };

    return {
      primary,
      uniqueElements,
      targetFases,
      targetGrades,
      allScopes,
      gradeNum,
      currentSemester,
      difficultyLevel,
      payload,
    };
  }, [selectedOutcomes, dropdownSemester, worksheet.semester, difficultyLevel]);

  const toggleOutcomeSelection = (id: string) => {
    setSelectedOutcomeIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAllFiltered = () => {
    const ids = dropdownFilteredOutcomes.map((o) => o.id);
    setSelectedOutcomeIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleSelectForCurrentGrade = () => {
    let targetFase: 'Fase A' | 'Fase B' | 'Fase C' = 'Fase B';
    if (worksheet.grade.includes('Fase A') || worksheet.grade.includes('Kelas 1') || worksheet.grade.includes('Kelas 2')) {
      targetFase = 'Fase A';
    } else if (worksheet.grade.includes('Fase C') || worksheet.grade.includes('Kelas 5') || worksheet.grade.includes('Kelas 6')) {
      targetFase = 'Fase C';
    }
    const matched = PAI_LEARNING_OUTCOMES_2026.filter((o) => o.fase === targetFase).map((o) => o.id);
    setSelectedOutcomeIds(matched);
    setDropdownFase(targetFase);
  };

  const handleSelectElementFilter = (el: string) => {
    setDropdownElement(el);
    if (el !== 'Semua') {
      let targetFase: 'Fase A' | 'Fase B' | 'Fase C' = dropdownFase !== 'Semua' ? dropdownFase : 'Fase B';
      if (dropdownFase === 'Semua') {
        if (worksheet.grade.includes('Fase A') || worksheet.grade.includes('Kelas 1') || worksheet.grade.includes('Kelas 2')) targetFase = 'Fase A';
        else if (worksheet.grade.includes('Fase C') || worksheet.grade.includes('Kelas 5') || worksheet.grade.includes('Kelas 6')) targetFase = 'Fase C';
        else targetFase = 'Fase B';
      }
      const matched =
        PAI_LEARNING_OUTCOMES_2026.find((o) => o.element === el && o.fase === targetFase) ||
        PAI_LEARNING_OUTCOMES_2026.find((o) => o.element === el);

      if (matched) {
        setSelectedOutcomeIds([matched.id]);
        setAppliedFeedback(
          `✓ Elemen "${el}" aktif: Materi Pokok & Indikator Bab otomatis tersinkronisasi dengan CP 020/2026 (${matched.code} - ${matched.suggestedChapter})!`
        );
      }
    }
  };

  const handleSyncElementInEditor = (elem: string) => {
    let gradeNum = 4;
    if (worksheet.grade.includes('Kelas 1')) gradeNum = 1;
    else if (worksheet.grade.includes('Kelas 2')) gradeNum = 2;
    else if (worksheet.grade.includes('Kelas 3')) gradeNum = 3;
    else if (worksheet.grade.includes('Kelas 4')) gradeNum = 4;
    else if (worksheet.grade.includes('Kelas 5')) gradeNum = 5;
    else if (worksheet.grade.includes('Kelas 6')) gradeNum = 6;
    else if (worksheet.grade.includes('Fase A')) gradeNum = 1;
    else if (worksheet.grade.includes('Fase C')) gradeNum = 5;

    const topic = getCurriculumTopic(gradeNum, worksheet.semester || 'Semester 1 (Ganjil)', elem);
    const calibratedMC = calibrateQuestionsByDifficulty(topic, difficultyLevel);

    onChange({
      ...worksheet,
      chapter: topic.chapterTitle,
      curriculumStandard: `${topic.tp} — CP Standar BSKAP No. 020/2026 PAI SD: "${topic.cp020}"`,
      dalil: topic.dalil,
      materials: topic.materials.map((m, idx) => ({
        id: `m_${idx}`,
        term: m.term,
        arabicBadge: m.arabicBadge || '',
        meaning: m.meaning,
        behavior: m.behavior,
      })),
      matchingPairs: topic.matchingPairs.map((p, idx) => ({
        id: `p_${idx}`,
        leftText: p.leftText,
        leftArabic: p.leftArabic || '',
        rightText: p.rightText,
      })),
      multipleChoice: calibratedMC.map((q, idx) => ({
        id: `q_${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      reflectivePrompt: {
        id: 'rf_sd',
        question: topic.reflectivePrompt.question,
        guidingHint: topic.reflectivePrompt.hint,
        lines: 3,
      },
      adabMissions: topic.adabMissions.map((ab, idx) => ({
        id: `ab_${idx}`,
        task: ab.task,
        reflection: ab.reflection,
        checked: idx === 0,
      })),
      difficulty: difficultyLevel,
    });

    setAppliedFeedback(
      `✓ Elemen "${elem}" tersinkronisasi: Materi Pokok, Indikator Bab, Dalil, dan Soal (${difficultyLevel}) berhasil diperbarui sesuai CP 020/2026!`
    );
  };

  const handleApplySelectedToWorksheet = () => {
    const primary = aiGeneratorMetadata.primary;
    const combinedTP = selectedOutcomes.map((o) => `[${o.code}] ${o.recommendedTP}`).join(' • ');
    const combinedChapter = selectedOutcomes.map((o) => o.suggestedChapter).join(' / ');
    const determinedSemester = aiGeneratorMetadata.currentSemester;

    onChange({
      ...worksheet,
      grade: `${primary.fase} (${primary.grades})`,
      semester: determinedSemester,
      difficulty: difficultyLevel,
      chapter: combinedChapter,
      curriculumStandard: `${combinedTP} — CP Standar BSKAP No. 020/2026 PAI SD`,
      dalil: {
        surah: primary.suggestedDalil.surah,
        arabic: primary.suggestedDalil.arabic,
        translation: primary.suggestedDalil.translation,
        note: primary.suggestedDalil.note,
      },
    });

    setAppliedCPId(primary.id);
    setAppliedFeedback(
      `✓ Berhasil menerapkan ${selectedOutcomes.length} Capaian Pembelajaran (${selectedOutcomes.map((o) => o.code).join(', ')}) [${determinedSemester} - Tingkat: ${difficultyLevel}] ke lembar LKPD!`
    );
  };

  const handleTriggerAIGenerator = () => {
    const { primary, uniqueElements, gradeNum, currentSemester } = aiGeneratorMetadata;
    const codes = selectedOutcomes.map((o) => o.code);

    onOpenAIGenerator({
      grade: gradeNum,
      semester: currentSemester,
      difficulty: difficultyLevel,
      element: primary.element,
      topic: selectedOutcomes.map((o) => o.suggestedChapter).join(' & '),
      cpCodes: codes,
      customFocus: `Mengacu pada Standar CP SK BSKAP No. 020/H/KR/2026 Kemendikbudristek (${codes.join(', ')}). Jenjang SD (${aiGeneratorMetadata.targetGrades.join(', ')}) - ${currentSemester}. Tingkat Kesulitan: ${difficultyLevel}. Elemen: ${uniqueElements.join(', ')}. TP Utama: ${selectedOutcomes.map((o) => o.recommendedTP).join('; ')}. Rujukan Dalil: ${primary.suggestedDalil.surah}. Format LKPD SD: Dalil berharakat Amiri, simpul matching, soal ${difficultyLevel === 'Hard' ? 'HOTS C4-C6 penalaran mendalam' : difficultyLevel === 'Easy' ? 'LOTS C1-C2 ramah pemula' : 'MOTS C3 aplikatif'}, dan misi pembiasaan adab.`,
    });
  };

  const handleCopyMetadataJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(aiGeneratorMetadata.payload, null, 2));
      setCopiedMetadata(true);
      setTimeout(() => setCopiedMetadata(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy error', e);
    }
  };

  const getElementBadgeColor = (el: string) => {
    switch (el) {
      case 'Al-Qur\'an Hadis':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Akidah':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Akhlak':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Fikih':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Sejarah Peradaban Islam':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const isOutcomeActive = (outcome: PAILearningOutcome2026) => {
    if (appliedCPId === outcome.id) return true;
    if (worksheet.curriculumStandard.includes(outcome.code)) return true;
    if (
      worksheet.chapter.toLowerCase().trim() === outcome.suggestedChapter.toLowerCase().trim() ||
      outcome.suggestedChapter.toLowerCase().includes(worksheet.chapter.toLowerCase().trim())
    ) {
      return true;
    }
    return false;
  };

  const applyLearningOutcome = (outcome: PAILearningOutcome2026) => {
    onChange({
      ...worksheet,
      grade: `${outcome.fase} (${outcome.grades})`,
      chapter: outcome.suggestedChapter,
      curriculumStandard: `[${outcome.code}] ${outcome.recommendedTP} — CP Standar BSKAP 020/2026: "${outcome.officialCP}"`,
      dalil: {
        surah: outcome.suggestedDalil.surah,
        arabic: outcome.suggestedDalil.arabic,
        translation: outcome.suggestedDalil.translation,
        note: outcome.suggestedDalil.note,
      },
    });
    setAppliedCPId(outcome.id);
    setAppliedFeedback(
      `✓ Capaian ${outcome.code} (${outcome.element}) berhasil diterapkan ke LKPD! Bab, Dalil Al-Qur'an, dan Indikator TP disinkronkan secara otomatis.`
    );
  };

  const filteredOutcomes = PAI_LEARNING_OUTCOMES_2026.filter((outcome) => {
    if (outcome.fase !== selectedCPFase) return false;
    if (selectedCPElement !== 'Semua' && outcome.element !== selectedCPElement) return false;
    if (searchCPQuery.trim() !== '') {
      const q = searchCPQuery.toLowerCase();
      const searchable = (
        outcome.code +
        ' ' +
        outcome.element +
        ' ' +
        outcome.suggestedChapter +
        ' ' +
        outcome.officialCP +
        ' ' +
        outcome.recommendedTP +
        ' ' +
        outcome.coreScope.join(' ')
      ).toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  // Updaters
  const updateInstitution = (field: keyof typeof worksheet.institution, value: string) => {
    onChange({
      ...worksheet,
      institution: {
        ...worksheet.institution,
        [field]: value,
      },
    });
  };

  const updateDalil = (field: keyof typeof worksheet.dalil, value: string) => {
    onChange({
      ...worksheet,
      dalil: {
        ...worksheet.dalil,
        [field]: value,
      },
    });
  };

  // Materials
  const updateMaterialItem = (index: number, field: keyof MaterialItem, value: string) => {
    const updated = [...worksheet.materials];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...worksheet, materials: updated });
  };

  const addMaterialItem = () => {
    const newItem: MaterialItem = {
      id: `m_${Date.now()}`,
      term: 'Istilah Baru',
      meaning: 'Penjelasan makna konsep...',
      behavior: 'Wujud akhlak dalam tindakan...',
    };
    onChange({ ...worksheet, materials: [...worksheet.materials, newItem] });
  };

  const removeMaterialItem = (index: number) => {
    const updated = worksheet.materials.filter((_, i) => i !== index);
    onChange({ ...worksheet, materials: updated });
  };

  // Matching Pairs
  const updateMatchingPair = (index: number, field: keyof MatchingPair, value: string) => {
    const updated = [...worksheet.matchingPairs];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...worksheet, matchingPairs: updated });
  };

  const addMatchingPair = () => {
    const newPair: MatchingPair = {
      id: `p_${Date.now()}`,
      leftText: 'Konsep Kiri',
      leftArabic: '',
      rightText: 'Makna / Definisi Kanan',
    };
    onChange({ ...worksheet, matchingPairs: [...worksheet.matchingPairs, newPair] });
  };

  const removeMatchingPair = (index: number) => {
    const updated = worksheet.matchingPairs.filter((_, i) => i !== index);
    onChange({ ...worksheet, matchingPairs: updated });
  };

  // Multiple Choice
  const updateMCQ = (index: number, updatedItem: MultipleChoiceItem) => {
    const updated = [...worksheet.multipleChoice];
    updated[index] = updatedItem;
    onChange({ ...worksheet, multipleChoice: updated });
  };

  const addMCQ = () => {
    const newItem: MultipleChoiceItem = {
      id: `q_${Date.now()}`,
      question: 'Tuliskan pertanyaan bernalar HOTS kontekstual di sini...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswer: 0,
      explanation: 'Pembahasan kunci jawaban...',
    };
    onChange({ ...worksheet, multipleChoice: [...worksheet.multipleChoice, newItem] });
  };

  const removeMCQ = (index: number) => {
    const updated = worksheet.multipleChoice.filter((_, i) => i !== index);
    onChange({ ...worksheet, multipleChoice: updated });
  };

  // Adab Missions
  const updateAdab = (index: number, field: keyof AdabMissionItem, value: any) => {
    const updated = [...worksheet.adabMissions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...worksheet, adabMissions: updated });
  };

  const addAdab = () => {
    const newItem: AdabMissionItem = {
      id: `ab_${Date.now()}`,
      task: 'Amalan kebaikan baru pekan ini...',
      reflection: 'Tujuan tadabbur akhlak...',
      checked: false,
    };
    onChange({ ...worksheet, adabMissions: [...worksheet.adabMissions, newItem] });
  };

  const removeAdab = (index: number) => {
    const updated = worksheet.adabMissions.filter((_, i) => i !== index);
    onChange({ ...worksheet, adabMissions: updated });
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 lg:p-5">
      {/* Top Banner: Quick AI / Reset bar */}
      <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-sky-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-extrabold text-slate-800">Modul PAI SD Terpadu</h3>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                CP 020/2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Khusus Guru PAI Sekolah Dasar (Kelas 1 - 6)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            title="Kembalikan ke template awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => onOpenAIGenerator()}
            className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-indigo-700 hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Generator LKPD</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher: Standar Kurikulum 2026 vs Editor Konten LKPD */}
      <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 gap-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveMainTab('standards')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'standards'
              ? 'bg-white text-emerald-950 shadow-xs border border-emerald-200 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpenCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Standar CP SK 020/2026</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-extrabold bg-emerald-100 text-emerald-800">
            Regulasi
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('editor')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'editor'
              ? 'bg-white text-sky-950 shadow-xs border border-sky-200 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Editor Modul LKPD</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-slate-200 text-slate-700">
            8 Seksi
          </span>
        </button>
      </div>

      {activeMainTab === 'standards' ? (
        <div className="flex flex-col gap-4">
          {/* Header & National Standard Summary */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-950 font-jakarta">
                    Standar Capaian Pembelajaran (CP) 2026
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Regulasi Resmi BSKAP No. 020/H/KR/2026 • Khusus PAI SD (Kelas 1–6)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full shrink-0">
                15 CP Terstandar
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Gunakan multi-select dropdown di bawah untuk memilih satu atau beberapa Capaian Pembelajaran (CP). Sistem secara otomatis memetakan rumusan CP, Tujuan Pembelajaran (TP), materi bab, dalil Al-Qur'an, dan metadata terstruktur untuk <strong>AI Generator Agent</strong>.
            </p>

            {/* Quick 3 Fase Indicator */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-100 text-[11px]">
              <div className="bg-white/80 border border-emerald-100 p-2 rounded-xl">
                <span className="font-extrabold text-emerald-900 block">Fase A (Kls 1–2)</span>
                <span className="text-[10px] text-slate-500">Huruf Hijaiah & Pondasi Iman</span>
              </div>
              <div className="bg-white/80 border border-emerald-100 p-2 rounded-xl">
                <span className="font-extrabold text-emerald-900 block">Fase B (Kls 3–4)</span>
                <span className="text-[10px] text-slate-500">Asmaul Husna, Shalat & Hijrah</span>
              </div>
              <div className="bg-white/80 border border-emerald-100 p-2 rounded-xl">
                <span className="font-extrabold text-emerald-900 block">Fase C (Kls 5–6)</span>
                <span className="text-[10px] text-slate-500">Tasamuh, Zakat & Akhlak Bi'ah</span>
              </div>
            </div>
          </div>

          {/* Feedback Banner if applied */}
          {appliedFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {appliedFeedback}
              </span>
              <button
                onClick={() => setAppliedFeedback(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          )}

          {/* STRUCTURED MULTI-SELECT DROPDOWN */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
            {/* Dropdown Header / Trigger */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ListFilter className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-jakarta">
                      Dropdown Multi-Select Capaian Pembelajaran (CP)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pilih satu atau lebih rumusan CP untuk dipetakan ke modul & AI
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-xs font-black shadow-xs">
                    {selectedOutcomeIds.length} Dipilih
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                    title={isDropdownOpen ? 'Tutup Dropdown' : 'Buka Dropdown'}
                  >
                    {isDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Selected Pills / Chips Summary Bar */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {selectedOutcomes.map((o) => (
                  <span
                    key={o.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-bold rounded-lg shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{o.code}</span>
                    <span className="text-[10px] text-slate-500">({o.element})</span>
                    {selectedOutcomeIds.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOutcomeSelection(o.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 ml-0.5"
                        title="Hapus pilihan ini"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

                {/* Quick actions right under chips */}
                <button
                  type="button"
                  onClick={handleSelectForCurrentGrade}
                  className="px-2 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors"
                  title="Pilih seluruh CP sesuai jenjang kelas LKPD saat ini"
                >
                  🎯 Sesuai Kelas ({worksheet.grade.split('(')[0].trim() || 'Fase Saat Ini'})
                </button>
                {selectedOutcomeIds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSelectedOutcomeIds([selectedOutcomes[0]?.id || 'fase-b-akidah'])}
                    className="px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-md transition-colors"
                  >
                    Reset ke 1 CP
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Expandable Options Panel */}
            {isDropdownOpen && (
              <div className="p-4 space-y-3.5 bg-white border-t border-slate-100 animate-fade-in">
                {/* Search query input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari CP, elemen, bab, surah, atau kata kunci (contoh: rukun iman, zakat, tasamuh)..."
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  {dropdownSearch && (
                    <button
                      onClick={() => setDropdownSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Controls: Fase & Grade */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Pilih Jenjang / Fase:</span>
                    <span className="text-[10px] text-slate-400">
                      Menampilkan {dropdownFilteredOutcomes.length} dari 15 Capaian
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
                    {(['Semua', 'Fase A', 'Fase B', 'Fase C'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setDropdownFase(f);
                          setDropdownGrade('Semua');
                        }}
                        className={`py-1 rounded-lg transition-all ${
                          dropdownFase === f
                            ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f === 'Semua' ? 'Semua Fase' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade breakdown buttons */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 mb-1">
                    Spesifik Kelas SD (1–6):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDropdownGrade(g)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                          dropdownGrade === g
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semester filter buttons */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 mb-1">
                    Semester Kurikulum SD:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: 'Semua', label: 'Semua Semester' },
                      { key: 'Semester 1', label: 'Semester 1 (Ganjil)' },
                      { key: 'Semester 2', label: 'Semester 2 (Genap)' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDropdownSemester(key)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                          dropdownSemester === key
                            ? 'bg-sky-700 text-white border-sky-700 shadow-2xs font-extrabold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Element filters */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="block text-[11px] font-bold text-slate-600">
                      Elemen Keilmuan PAI:
                    </span>
                    <span className="text-[9.5px] text-emerald-700 font-semibold">
                      Sinkron otomatis ke CP 020/2026
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Semua',
                      'Al-Qur\'an Hadis',
                      'Akidah',
                      'Akhlak',
                      'Fikih',
                      'Sejarah Peradaban Islam',
                    ].map((el) => (
                      <button
                        key={el}
                        type="button"
                        onClick={() => handleSelectElementFilter(el)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                          dropdownElement === el
                            ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {el}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick actions for multi-select */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-md font-bold transition-colors"
                    >
                      ✓ Pilih Semua Sesuai Filter ({dropdownFilteredOutcomes.length})
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOutcomeIds([dropdownFilteredOutcomes[0]?.id || 'fase-b-akidah'])}
                    className="text-slate-500 hover:text-slate-700 text-[10px] font-bold"
                  >
                    Reset Pilihan
                  </button>
                </div>

                {/* Grouped Outcomes List */}
                <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  {dropdownFilteredOutcomes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Tidak ada Capaian Pembelajaran yang cocok dengan filter. Silakan reset filter pencarian.
                    </div>
                  ) : (
                    dropdownFilteredOutcomes.map((outcome) => {
                      const isSelected = selectedOutcomeIds.includes(outcome.id);
                      return (
                        <div
                          key={outcome.id}
                          onClick={() => toggleOutcomeSelection(outcome.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs ring-1 ring-emerald-200'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Checkbox */}
                            <div
                              className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Pill headers */}
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="font-extrabold text-[11px] text-slate-900">
                                  {outcome.code}
                                </span>
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${getElementBadgeColor(
                                    outcome.element
                                  )}`}
                                >
                                  {outcome.element}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {outcome.grades}
                                </span>
                                {outcome.semesterScope && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                    {outcome.semesterScope}
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] font-bold text-slate-800 mb-1">
                                {outcome.suggestedChapter}
                              </div>

                              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 italic mb-1">
                                “{outcome.officialCP}”
                              </p>

                              <div className="text-[10px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">
                                <strong>Rekomendasi TP:</strong> {outcome.recommendedTP}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MAPPING METADATA UNTUK AI GENERATOR SECTION */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-jakarta">
                    Pemetaan Metadata untuk AI Generator
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Struktur kurikulum nasional yang disalurkan langsung ke AI Agent
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                AI Ready
              </span>
            </div>

            {/* Target, Semester & Elements Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                  Jenjang & Usia Target:
                </span>
                <span className="text-xs font-black text-slate-800 block">
                  {aiGeneratorMetadata.targetGrades.join(', ')} ({aiGeneratorMetadata.targetFases.join(', ')})
                </span>
                <span className="text-[10.5px] text-slate-600">
                  Sekolah Dasar (SD) • Usia{' '}
                  {aiGeneratorMetadata.targetFases.includes('Fase A')
                    ? '6–8 Tahun'
                    : aiGeneratorMetadata.targetFases.includes('Fase B')
                    ? '8–10 Tahun'
                    : '10–12 Tahun'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                  Semester Pembelajaran:
                </span>
                <span className="text-xs font-black text-[#0284c7] block">
                  {aiGeneratorMetadata.currentSemester}
                </span>
                <span className="text-[10.5px] text-slate-600">
                  Kalender Pendidikan Nasional
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                  Elemen PAI Terintegrasi:
                </span>
                <div className="flex flex-wrap gap-1">
                  {aiGeneratorMetadata.uniqueElements.map((el) => (
                    <span
                      key={el}
                      className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border ${getElementBadgeColor(
                        el
                      )}`}
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected CP Cards with Official Quote & Dalil Reference */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold text-slate-700 block">
                Detail Rumusan CP & Rujukan Dalil Terpilih ({selectedOutcomes.length}):
              </span>

              {selectedOutcomes.map((outcome) => (
                <div
                  key={outcome.id}
                  className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-emerald-800">{outcome.code}</span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${getElementBadgeColor(
                          outcome.element
                        )}`}
                      >
                        {outcome.element}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{outcome.grades}</span>
                  </div>

                  {/* Official CP Quote */}
                  <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg italic text-[11px] text-slate-700 leading-relaxed">
                    “{outcome.officialCP}”
                  </div>

                  {/* Suggested TP */}
                  <div className="text-[11px] text-slate-700">
                    <strong className="text-slate-800">Tujuan Pembelajaran:</strong> {outcome.recommendedTP}
                  </div>

                  {/* Dalil Anchor */}
                  <div className="p-2.5 bg-white border border-emerald-100 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-800">
                        Dalil: {outcome.suggestedDalil.surah}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">Font Amiri RTL</span>
                    </div>
                    <div className="font-amiri text-sm text-right leading-loose text-slate-900" dir="rtl">
                      {outcome.suggestedDalil.arabic}
                    </div>
                    <p className="text-[10px] text-slate-600 italic">
                      {outcome.suggestedDalil.translation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selector Tingkat Kesulitan Soal AI Agent (Difficulty Level: Easy, Medium, Hard) */}
            <div className="p-3.5 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50/40 rounded-xl border border-indigo-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-jakarta">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tingkat Kesulitan Soal (Difficulty Level):</span>
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  Standar HOTS PAI SD
                </span>
              </div>

              <p className="text-[10.5px] text-slate-600 leading-relaxed">
                Pilihan ini secara langsung memandu AI Agent dalam merancang tingkat bernalar soal pilihan ganda, kompleksitas simpul matching, dan kedalaman refleksi akhlak anak SD:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    level: 'Easy' as const,
                    label: 'Easy (Mudah)',
                    lotsHots: 'LOTS (C1–C2)',
                    desc: 'Mengingat & pemahaman dasar, bahasa ramah anak awal SD, pencocokan konsep lugas.',
                    activeClass: 'border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-200 shadow-2xs',
                    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  },
                  {
                    level: 'Medium' as const,
                    label: 'Medium (Sedang)',
                    lotsHots: 'MOTS (C3)',
                    desc: 'Penerapan konsep & teladan dalam pertemanan, mengaitkan dalil dengan perilaku sehari-hari.',
                    activeClass: 'border-sky-500 bg-sky-50/90 text-sky-950 ring-2 ring-sky-200 shadow-2xs',
                    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
                  },
                  {
                    level: 'Hard' as const,
                    label: 'Hard (Menantang)',
                    lotsHots: 'HOTS (C4–C6)',
                    desc: 'Analisis dilema moral, studi kasus kontekstual sekolah, penalaran kritis bernalar tinggi.',
                    activeClass: 'border-purple-500 bg-purple-50/90 text-purple-950 ring-2 ring-purple-200 shadow-2xs',
                    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
                  },
                ].map((item) => {
                  const isSelected = difficultyLevel === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => {
                        setDifficultyLevel(item.level);
                        onChange({ ...worksheet, difficulty: item.level });
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? `${item.activeClass} font-extrabold`
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11.5px] font-bold block">{item.label}</span>
                        <span className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded border ${item.badgeClass}`}>
                          {item.lotsHots}
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

            {/* Collapsible JSON Metadata Inspector */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowMetadataInspector(!showMetadataInspector)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-slate-500" />
                  <span>Inspeksi Metadata JSON AI Generator</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {showMetadataInspector ? 'Sembunyikan' : 'Tampilkan Payload'}
                </span>
              </button>

              {showMetadataInspector && (
                <div className="p-3 bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">// Payload dikirim ke /api/generate-worksheet</span>
                    <button
                      type="button"
                      onClick={handleCopyMetadataJSON}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] flex items-center gap-1 transition-colors"
                    >
                      {copiedMetadata ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMetadata ? 'Tersalin!' : 'Salin JSON'}</span>
                    </button>
                  </div>
                  <pre className="max-h-60 overflow-y-auto leading-relaxed">
                    {JSON.stringify(aiGeneratorMetadata.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Action Buttons Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={handleApplySelectedToWorksheet}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Terapkan ke LKPD (Live Canvas)</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerAIGenerator}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#0284c7] to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate dengan AI Agent</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyMetadataJSON}
                className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copiedMetadata ? 'Metadata Tersalin ke Clipboard!' : 'Salin Metadata Kurikulum'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMainTab('editor')}
                className="text-[#0284c7] hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Buka Editor Modul LKPD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Active Curriculum Standard Indicator Bar */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-extrabold text-emerald-950">Standar Aktif: </span>
                <span className="text-emerald-800 font-medium truncate">
                  {worksheet.curriculumStandard.slice(0, 75)}...
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMainTab('standards')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 ml-2"
            >
              Ubah CP Standar →
            </button>
          </div>

      {/* Accordion 1: Identitas Modul & Pembelajaran */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('kop')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                1. Identitas Pembelajaran & Modul
              </span>
              <span className="text-xs text-slate-500">Judul LKPD, bab/materi pokok, kelas, & durasi</span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.kop ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.kop && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Judul Lembar Kerja Peserta Didik (LKPD)
              </label>
              <input
                type="text"
                value={worksheet.title}
                onChange={(e) => onChange({ ...worksheet, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-extrabold text-slate-900"
                placeholder="Contoh: LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Bab & Topik Materi Pembelajaran
              </label>
              <input
                type="text"
                value={worksheet.chapter}
                onChange={(e) => onChange({ ...worksheet, chapter: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold text-slate-800"
                placeholder="Contoh: Bab 2: Meneladani 5 Asmaul Husna"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Fase / Jenjang Kelas
                </label>
                <input
                  type="text"
                  value={worksheet.grade}
                  onChange={(e) => onChange({ ...worksheet, grade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Semester
                </label>
                <select
                  value={worksheet.semester || 'Semester 1 (Ganjil)'}
                  onChange={(e) => onChange({ ...worksheet, semester: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold text-slate-800"
                >
                  <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tingkat Kesulitan (Difficulty)
                </label>
                <select
                  value={worksheet.difficulty || difficultyLevel}
                  onChange={(e) => {
                    const diff = e.target.value as 'Easy' | 'Medium' | 'Hard';
                    setDifficultyLevel(diff);
                    onChange({ ...worksheet, difficulty: diff });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold text-slate-800"
                >
                  <option value="Easy">Easy (Mudah - LOTS C1–C2)</option>
                  <option value="Medium">Medium (Sedang - MOTS C3)</option>
                  <option value="Hard">Hard (Menantang - HOTS C4–C6)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={worksheet.duration}
                  onChange={(e) => onChange({ ...worksheet, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Tingkat Kesulitan Soal Selector (Easy, Medium, Hard) in Editor */}
            <div className="p-3 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-sky-50/30 rounded-xl border border-indigo-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 font-jakarta">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tingkat Kesulitan Soal (Difficulty Level):</span>
                </label>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                  difficultyLevel === 'Hard'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : difficultyLevel === 'Easy'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-sky-100 text-sky-900 border-sky-300'
                }`}>
                  {difficultyLevel === 'Hard' ? 'HOTS C4–C6' : difficultyLevel === 'Easy' ? 'LOTS C1–C2' : 'MOTS C3'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { level: 'Easy' as const, label: 'Easy (Mudah)', lots: 'LOTS (C1–C2)', active: 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-300' },
                  { level: 'Medium' as const, label: 'Medium (Sedang)', lots: 'MOTS (C3)', active: 'border-sky-500 bg-sky-50 text-sky-950 ring-1 ring-sky-300' },
                  { level: 'Hard' as const, label: 'Hard (Menantang)', lots: 'HOTS (C4–C6)', active: 'border-purple-500 bg-purple-50 text-purple-950 ring-1 ring-purple-300' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setDifficultyLevel(item.level);
                      onChange({ ...worksheet, difficulty: item.level });
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      difficultyLevel === item.level
                        ? `${item.active} font-extrabold shadow-2xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10.5px] font-semibold'
                    }`}
                  >
                    <span className="block text-[10.5px] leading-tight font-bold">{item.label}</span>
                    <span className="block text-[8.5px] text-slate-500 mt-0.5">{item.lots}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sinkronisasi Cepat Elemen & Indikator CP 020/2026 */}
            <div className="p-3 bg-sky-50/70 border border-sky-200/90 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-sky-900 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  Sinkronisasi Otomatis Elemen (CP 020/2026):
                </span>
                <span className="text-[9.5px] text-sky-700 font-semibold">
                  Semua sub-pilihan otomatis sinkron
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SD_ELEMENTS.map((elem) => (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => handleSyncElementInEditor(elem)}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-100/70 border border-sky-200 text-[10px] font-bold text-sky-950 transition-colors shadow-2xs hover:border-sky-300 active:scale-95"
                  >
                    {elem}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Bab / Tema Pembelajaran
              </label>
              <input
                type="text"
                value={worksheet.chapter}
                onChange={(e) => onChange({ ...worksheet, chapter: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Capaian Pembelajaran (CP) / Indikator TP
              </label>
              <textarea
                rows={2}
                value={worksheet.curriculumStandard}
                onChange={(e) => onChange({ ...worksheet, curriculumStandard: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 resize-none text-slate-700 leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Pilihan Capaian Pembelajaran (CP SK 020/2026) PAI SD */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('cp')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 block font-jakarta">
                  2. Capaian Pembelajaran (CP 2026) PAI SD
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  SK 020/2026
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Pilih rumusan CP resmi BSKAP 2026 untuk sinkronisasi otomatis LKPD
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.cp ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.cp && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4 text-xs">
            {/* National Standard Information Banner */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Standar Nasional Pendidikan BSKAP No. 020/H/KR/2026
                </span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  PAI SD Resmi
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Pilih rumusan Capaian Pembelajaran di bawah ini. Tombol <strong>"Terapkan ke LKPD"</strong> akan secara instan memperbarui Fase Kelas, Judul Bab, Rumusan TP, dan Ayat Dalil pada lembar LKPD Anda.
              </p>
            </div>

            {/* Notification alert if CP was just applied */}
            {appliedFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center justify-between animate-fade-in">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {appliedFeedback}
                </span>
                <button
                  onClick={() => setAppliedFeedback(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Fase Tabs Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Pilih Fase Pendidikan Dasar (SD):
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(['Fase A', 'Fase B', 'Fase C'] as const).map((fase) => (
                  <button
                    key={fase}
                    type="button"
                    onClick={() => setSelectedCPFase(fase)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedCPFase === fase
                        ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div>{fase}</div>
                    <div className="text-[9px] font-normal text-slate-500">
                      {fase === 'Fase A' ? 'Kelas 1-2' : fase === 'Fase B' ? 'Kelas 3-4' : 'Kelas 5-6'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Elemen PAI Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Filter Elemen Keilmuan PAI:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Semua',
                  'Al-Qur\'an Hadis',
                  'Akidah',
                  'Akhlak',
                  'Fikih',
                  'Sejarah Peradaban Islam',
                ].map((elem) => (
                  <button
                    key={elem}
                    type="button"
                    onClick={() => setSelectedCPElement(elem)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold border transition-all ${
                      selectedCPElement === elem
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {elem}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchCPQuery}
                onChange={(e) => setSearchCPQuery(e.target.value)}
                placeholder="Cari topik materi (misal: Asmaul Husna, Wudhu, Shalat, Birrul Walidain)..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              {searchCPQuery && (
                <button
                  onClick={() => setSearchCPQuery('')}
                  className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* List of Learning Outcomes Cards */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredOutcomes.length === 0 ? (
                <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs">Tidak ditemukan capaian pembelajaran yang cocok dengan filter atau kata kunci "{searchCPQuery}".</p>
                  <button
                    onClick={() => { setSelectedCPElement('Semua'); setSearchCPQuery(''); }}
                    className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                filteredOutcomes.map((outcome) => {
                  const isActive = isOutcomeActive(outcome);
                  return (
                    <div
                      key={outcome.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-200/70 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 bg-slate-800 text-white rounded">
                            {outcome.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getElementBadgeColor(
                              outcome.element
                            )}`}
                          >
                            {outcome.element}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {outcome.grades}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3" />
                            Aktif di LKPD
                          </span>
                        )}
                      </div>

                      {/* Suggested Chapter Title */}
                      <h4 className="font-bold text-slate-900 text-xs mb-1.5">
                        {outcome.suggestedChapter}
                      </h4>

                      {/* Official CP Statement */}
                      <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/80 mb-2.5">
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                          Rumusan Resmi CP (BSKAP 020/2026):
                        </span>
                        <p className="text-[11px] text-slate-700 italic leading-relaxed">
                          "{outcome.officialCP}"
                        </p>
                      </div>

                      {/* Core Scope Tags */}
                      <div className="mb-2">
                        <span className="block text-[10px] font-bold text-slate-500 mb-1">
                          Ruang Lingkup Materi Pokok:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {outcome.coreScope.map((scope, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-sky-50 text-sky-800 border border-sky-100 px-2 py-0.5 rounded-md font-medium"
                            >
                              • {scope}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended TP */}
                      <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 mb-2.5">
                        <span className="block text-[9px] font-bold text-indigo-900 uppercase">
                          Rekomendasi Tujuan Pembelajaran (TP):
                        </span>
                        <p className="text-[11px] text-indigo-950 font-medium leading-snug">
                          {outcome.recommendedTP}
                        </p>
                      </div>

                      {/* Suggested Dalil Preview */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 bg-slate-50 px-2 py-1 rounded-md">
                        <span>Dalil Pendukung:</span>
                        <span className="font-semibold text-slate-700">
                          {outcome.suggestedDalil.surah}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => applyLearningOutcome(outcome)}
                          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                            isActive
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isActive ? 'Sinkronkan Ulang ke LKPD' : 'Terapkan ke LKPD'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Active CP Quick Edit / Synchronization details */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Rumusan CP Terpasang pada LKPD Saat Ini:
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  Live Synced
                </span>
              </div>
              <textarea
                rows={2}
                value={worksheet.curriculumStandard}
                onChange={(e) => onChange({ ...worksheet, curriculumStandard: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none font-medium"
                placeholder="Rumusan Capaian Pembelajaran & TP yang tertera di LKPD..."
              />
              <p className="text-[10px] text-slate-500">
                Teks di atas adalah rumusan CP/TP yang otomatis dicetak pada lembar kerja siswa di sisi kanan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Ayat Suci & Dalil (Sacred Script Integration) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('dalil')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center">
              <ScrollText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                3. Kutipan Dalil & Al-Qur'an (Amiri RTL)
              </span>
              <span className="text-xs text-slate-500">Kalam ilahi berharakat & tadabbur karakter</span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.dalil ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.dalil && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nama Surah / Hadits & Nomor Ayat
              </label>
              <input
                type="text"
                value={worksheet.dalil.surah}
                onChange={(e) => updateDalil('surah', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-semibold"
                placeholder="Contoh: QS. Al-A'raf : 180"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">
                  Teks Arab Al-Qur'an (RTL - Font Amiri)
                </label>
                <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-mono">
                  dir="rtl"
                </span>
              </div>
              <textarea
                dir="rtl"
                rows={3}
                value={worksheet.dalil.arabic}
                onChange={(e) => updateDalil('arabic', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 font-amiri text-lg leading-loose text-slate-900 resize-none"
                placeholder="أدخل النص العربي مع الحركات..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Terjemahan Bahasa Indonesia
              </label>
              <textarea
                rows={2}
                value={worksheet.dalil.translation}
                onChange={(e) => updateDalil('translation', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 resize-none text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Catatan Tadabbur / Nilai Hikmah
              </label>
              <textarea
                rows={2}
                value={worksheet.dalil.note}
                onChange={(e) => updateDalil('note', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 resize-none text-slate-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Gamified Match Nodes (Soal Pasangkan Garis) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('matching')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                4. Gamified Match Nodes (Hubungkan Garis)
              </span>
              <span className="text-xs text-slate-500">
                {worksheet.matchingPairs.length} Pasang titik simpul interaktif & cetak
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.matching ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.matching && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Petunjuk Pengerjaan Siswa
              </label>
              <input
                type="text"
                value={worksheet.matchingInstruction}
                onChange={(e) => onChange({ ...worksheet, matchingInstruction: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-3">
              {worksheet.matchingPairs.map((pair, idx) => (
                <div
                  key={pair.id}
                  className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl relative group hover:border-sky-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                        {idx + 1}
                      </span>
                      Pasangan Simpul #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeMatchingPair(idx)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                      title="Hapus baris simpul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Sisi Kiri (Nama / Istilah)
                      </label>
                      <input
                        type="text"
                        value={pair.leftText}
                        onChange={(e) => updateMatchingPair(idx, 'leftText', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:border-sky-500"
                        placeholder="Contoh: Al-Malik"
                      />
                      <input
                        type="text"
                        value={pair.leftArabic || ''}
                        onChange={(e) => updateMatchingPair(idx, 'leftArabic', e.target.value)}
                        dir="rtl"
                        className="w-full mt-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-amiri text-slate-800 focus:border-sky-500"
                        placeholder="العربية (opsional)"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Sisi Kanan (Makna / Penjelasan)
                      </label>
                      <textarea
                        rows={2}
                        value={pair.rightText}
                        onChange={(e) => updateMatchingPair(idx, 'rightText', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:border-sky-500 resize-none"
                        placeholder="Contoh: Maha Merajai seluruh alam semesta"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addMatchingPair}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-300 text-emerald-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pasangan Simpul (Match Node)</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion 5: Soal Bernalar HOTS (Pilihan Ganda) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('hots')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                5. Soal Evaluasi Bernalar (HOTS)
              </span>
              <span className="text-xs text-slate-500">
                {worksheet.multipleChoice.length} Butir soal pilihan ganda & pembahasan
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.hots ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.hots && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            {/* Quick Difficulty Controller */}
            <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-amber-950 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-amber-600" />
                  <span>Tingkat Kesulitan Soal Evaluasi:</span>
                </span>
                <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-white text-amber-800 border border-amber-300">
                  {difficultyLevel === 'Hard' ? 'HOTS (C4–C6)' : difficultyLevel === 'Easy' ? 'LOTS (C1–C2)' : 'MOTS (C3)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {[
                  { level: 'Easy' as const, label: 'Easy (Mudah)', desc: 'LOTS C1-C2' },
                  { level: 'Medium' as const, label: 'Medium (Sedang)', desc: 'MOTS C3' },
                  { level: 'Hard' as const, label: 'Hard (Menantang)', desc: 'HOTS C4-C6' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setDifficultyLevel(item.level);
                      onChange({ ...worksheet, difficulty: item.level });
                    }}
                    className={`py-1 px-2 rounded-lg text-[10.5px] font-extrabold border transition-all ${
                      difficultyLevel === item.level
                        ? 'bg-amber-600 text-white border-amber-700 shadow-2xs ring-1 ring-amber-300'
                        : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {worksheet.multipleChoice.map((item, qIdx) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2.5 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-700 text-xs">
                    Soal #{qIdx + 1}
                  </span>
                  <button
                    onClick={() => removeMCQ(qIdx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Hapus soal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Narasi Soal Kontekstual
                  </label>
                  <textarea
                    rows={2}
                    value={item.question}
                    onChange={(e) => {
                      const updated = { ...item, question: e.target.value };
                      updateMCQ(qIdx, updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {item.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`correct-${item.id}`}
                        checked={item.correctAnswer === optIdx}
                        onChange={() => {
                          updateMCQ(qIdx, { ...item, correctAnswer: optIdx });
                        }}
                        className="text-emerald-600 focus:ring-emerald-500"
                        title="Tandai sebagai kunci jawaban"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...item.options];
                          newOpts[optIdx] = e.target.value;
                          updateMCQ(qIdx, { ...item, options: newOpts });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700"
                        placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-700 mb-0.5">
                    Kunci & Pembahasan Guru
                  </label>
                  <input
                    type="text"
                    value={item.explanation}
                    onChange={(e) => {
                      updateMCQ(qIdx, { ...item, explanation: e.target.value });
                    }}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-600 focus:border-emerald-500"
                    placeholder="Alasan jawaban benar..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addMCQ}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-300 text-amber-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal HOTS</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion 6: Intisari Konsep & Ringkasan Materi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('materials')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                6. Intisari Konsep & Materi Pendukung
              </span>
              <span className="text-xs text-slate-500">
                {worksheet.materials.length} Poin konsep ramah anak & teladan
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.materials ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.materials && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            {worksheet.materials.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">Poin Materi #{idx + 1}</span>
                  <button
                    onClick={() => removeMaterialItem(idx)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={m.term}
                    onChange={(e) => updateMaterialItem(idx, 'term', e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-xs"
                    placeholder="Nama Istilah"
                  />
                  <input
                    type="text"
                    value={m.behavior}
                    onChange={(e) => updateMaterialItem(idx, 'behavior', e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
                    placeholder="Teladan Perilaku Nyata"
                  />
                </div>
                <input
                  type="text"
                  value={m.meaning}
                  onChange={(e) => updateMaterialItem(idx, 'meaning', e.target.value)}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700"
                  placeholder="Makna konsep..."
                />
              </div>
            ))}

            <button
              onClick={addMaterialItem}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-dashed border-indigo-300 text-indigo-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Poin Ringkasan Materi</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion 7: Misi Karakter & Adab Harian */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('adab')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                7. Misi Karakter & Adab Harian Siswa
              </span>
              <span className="text-xs text-slate-500">
                Checklist amalan pembiasaan akhlak mulia
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.adab ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.adab && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            {worksheet.adabMissions.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">Misi Adab #{idx + 1}</span>
                  <button
                    onClick={() => removeAdab(idx)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.task}
                  onChange={(e) => updateAdab(idx, 'task', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-medium text-xs text-slate-800"
                  placeholder="Kegiatan amalan nyata..."
                />
                <input
                  type="text"
                  value={item.reflection}
                  onChange={(e) => updateAdab(idx, 'reflection', e.target.value)}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
                  placeholder="Alasan / hikmah tadabbur..."
                />
              </div>
            ))}

            <button
              onClick={addAdab}
              className="w-full py-2 bg-teal-50 hover:bg-teal-100 border border-dashed border-teal-300 text-teal-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Misi Adab Karakter</span>
            </button>
          </div>
        )}
      </div>

      {/* Accordion 8: Rubrik & QR Audio */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('rubric')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block font-jakarta">
                8. QR Audio Tilawah & Catatan Guru
              </span>
              <span className="text-xs text-slate-500">Murottal interaktif & rubrik penilaian</span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              openSections.rubric ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.rubric && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Catatan & Motivasi Guru
              </label>
              <textarea
                rows={2}
                value={worksheet.rubric.teacherNotes}
                onChange={(e) =>
                  onChange({
                    ...worksheet,
                    rubric: { ...worksheet.rubric, teacherNotes: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Judul QR Audio
                </label>
                <input
                  type="text"
                  value={worksheet.qrAudio.title}
                  onChange={(e) =>
                    onChange({
                      ...worksheet,
                      qrAudio: { ...worksheet.qrAudio, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kode Verifikasi Modul
                </label>
                <input
                  type="text"
                  value={worksheet.qrAudio.code}
                  onChange={(e) =>
                    onChange({
                      ...worksheet,
                      qrAudio: { ...worksheet.qrAudio, code: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};
