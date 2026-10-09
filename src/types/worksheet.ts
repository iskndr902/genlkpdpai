export interface InstitutionInfo {
  name: string;
  subname: string;
  npsn: string;
  address: string;
  logoUrl: string;
  badgeText: string;
}

export interface DalilData {
  surah: string;
  arabic: string;
  translation: string;
  note: string;
}

export interface MaterialItem {
  id: string;
  term: string;
  arabicBadge?: string;
  meaning: string;
  behavior: string;
}

export interface MatchingPair {
  id: string;
  leftText: string;
  leftArabic?: string;
  rightText: string;
}

export interface MultipleChoiceItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ReflectivePrompt {
  id: string;
  question: string;
  guidingHint: string;
  lines: number;
}

export interface AdabMissionItem {
  id: string;
  task: string;
  reflection: string;
  checked?: boolean;
}

export interface TeacherRubric {
  aspects: { name: string; score: number }[];
  teacherNotes: string;
}

export interface QRAudioData {
  title: string;
  subtitle: string;
  code: string;
  targetUrl: string;
}

export interface WorksheetData {
  id: string;
  institution: InstitutionInfo;
  title: string;
  subject: string;
  grade: string;
  semester?: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)' | string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mudah' | 'Sedang' | 'HOTS / Menantang' | string;
  chapter: string;
  duration: string;
  curriculumStandard: string;
  studentHeader: {
    nameLabel: string;
    classLabel: string;
    dateLabel: string;
    scoreLabel: string;
  };
  dalil: DalilData;
  materialsHeading: string;
  materials: MaterialItem[];
  matchingHeading: string;
  matchingInstruction: string;
  matchingPairs: MatchingPair[];
  multipleChoiceHeading: string;
  multipleChoice: MultipleChoiceItem[];
  reflectiveHeading: string;
  reflectivePrompt: ReflectivePrompt;
  adabHeading: string;
  adabMissions: AdabMissionItem[];
  rubric: TeacherRubric;
  qrAudio: QRAudioData;
}
