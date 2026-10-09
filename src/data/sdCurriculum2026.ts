import { WorksheetData } from '../types/worksheet';

export interface SDCurriculumTopic {
  id: string;
  grade: string; // 'Kelas 1 SD', 'Kelas 2 SD', etc.
  gradeLevel: number; // 1 to 6
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  element: 'Al-Qur\'an Hadis' | 'Akidah' | 'Akhlak' | 'Fikih' | 'Sejarah Peradaban Islam';
  chapterTitle: string;
  semester: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)';
  cp020: string; // Kutipan CP SK No. 020 Tahun 2026
  tp: string; // Tujuan Pembelajaran
  dalil: {
    surah: string;
    arabic: string;
    translation: string;
    note: string;
  };
  materials: {
    term: string;
    arabicBadge?: string;
    meaning: string;
    behavior: string;
  }[];
  matchingPairs: {
    leftText: string;
    leftArabic?: string;
    rightText: string;
  }[];
  multipleChoice: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  reflectivePrompt: {
    question: string;
    hint: string;
  };
  adabMissions: {
    task: string;
    reflection: string;
  }[];
}

export const SD_SEMESTERS = [
  'Semester 1 (Ganjil)',
  'Semester 2 (Genap)',
] as const;

export const SD_ELEMENTS = [
  'Al-Qur\'an Hadis',
  'Akidah',
  'Akhlak',
  'Fikih',
  'Sejarah Peradaban Islam',
] as const;

export const SD_GRADES = [
  { level: 1, label: 'Kelas 1 SD', fase: 'Fase A', desc: 'Fase A (Usia 6-7 Tahun)' },
  { level: 2, label: 'Kelas 2 SD', fase: 'Fase A', desc: 'Fase A (Usia 7-8 Tahun)' },
  { level: 3, label: 'Kelas 3 SD', fase: 'Fase B', desc: 'Fase B (Usia 8-9 Tahun)' },
  { level: 4, label: 'Kelas 4 SD', fase: 'Fase B', desc: 'Fase B (Usia 9-10 Tahun)' },
  { level: 5, label: 'Kelas 5 SD', fase: 'Fase C', desc: 'Fase C (Usia 10-11 Tahun)' },
  { level: 6, label: 'Kelas 6 SD', fase: 'Fase C', desc: 'Fase C (Usia 11-12 Tahun)' },
] as const;

export const SD_CURRICULUM_DATABASE: SDCurriculumTopic[] = [
  // ==========================================
  // KELAS 1 SD (FASE A)
  // ==========================================
  {
    id: 'sd-1-quran',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Al-Qur\'an Hadis',
    chapterTitle: 'Bab 1: Aku Cinta Al-Qur\'an (Surah Al-Fatihah & Huruf Hijaiyah)',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mengenal huruf hijaiah dan harakatnya, serta melafalkan surah-surah pendek Al-Qur\'an dengan fasih dan berani.',
    tp: 'Melafalkan Surah Al-Fatihah ayat 1-7 dengan tartil dan menyebutkan artinya sebagai Ummul Kitab.',
    dalil: {
      surah: 'QS. Al-Fatihah : 1-2',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: '“Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam.”',
      note: 'Tadabbur: Kita memulai setiap kebaikan dengan Basmalah dan bersyukur dengan Hamdalah.',
    },
    materials: [
      {
        term: 'Bismillah (Basmalah)',
        arabicBadge: 'بِسْمِ اللَّهِ',
        meaning: 'Ucapan mulia sebelum memulai makan, minum, dan belajar.',
        behavior: 'Selalu membaca Basmalah saat memakai seragam dan makan.',
      },
      {
        term: 'Alhamdulillah (Hamdalah)',
        arabicBadge: 'الْحَمْدُ لِلَّهِ',
        meaning: 'Ucapan pujian dan rasa syukur kepada Allah Swt.',
        behavior: 'Mengucapkan Hamdalah saat selesai makan dan bersin.',
      },
      {
        term: 'Ar-Rahman (Maha Pengasih)',
        arabicBadge: 'الرَّحْمَٰنُ',
        meaning: 'Kasih sayang Allah kepada seluruh makhluk di bumi.',
        behavior: 'Menyayangi binatang kucing dan merawat tanaman di sekolah.',
      },
      {
        term: 'Ar-Rahim (Maha Penyayang)',
        arabicBadge: 'الرَّحِيمُ',
        meaning: 'Kasih sayang Allah yang istimewa kepada orang yang beriman.',
        behavior: 'Suka menolong teman yang menangis dan berbagi bekal makanan.',
      },
    ],
    matchingPairs: [
      { leftText: 'Bismillah', leftArabic: 'بِسْمِ اللَّهِ', rightText: 'Dibaca Setiap Memulai Kegiatan Kebaikan' },
      { leftText: 'Alhamdulillah', leftArabic: 'الْحَمْدُ لِلَّهِ', rightText: 'Ungkapan Rasa Syukur dan Pujian kepada Allah' },
      { leftText: 'Ar-Rahman', leftArabic: 'الرَّحْمَٰنُ', rightText: 'Allah Maha Pengasih kepada Semua Ciptaan-Nya' },
      { leftText: 'Ar-Rahim', leftArabic: 'الرَّحِيمُ', rightText: 'Allah Maha Penyayang kepada Orang yang Beriman' },
    ],
    multipleChoice: [
      {
        question: 'Sebelum mulai makan bersama di kelas, Bu Guru mengajak Ananda membaca...',
        options: ['Astaghfirullah', 'Basmalah (Bismillah)', 'Allahu Akbar', 'Innalillahi'],
        correctAnswer: 1,
        explanation: 'Setiap perbuatan baik disunnahkan diawali dengan membaca Basmalah.',
      },
      {
        question: 'Surah Al-Fatihah terdiri dari ... ayat.',
        options: ['3', '5', '7', '10'],
        correctAnswer: 2,
        explanation: 'Surah Al-Fatihah terdiri atas 7 ayat dan wajib dibaca dalam setiap rakaat shalat.',
      },
    ],
    reflectivePrompt: {
      question: 'Kapan saja kamu membaca ucapan Bismillah dan Alhamdulillah hari ini?',
      hint: 'Tuliskan kegiatan baik yang kamu awali dan akhiri dengan doa.',
    },
    adabMissions: [
      { task: 'Membaca Bismillah sebelum makan dan minum bekal sekolah', reflection: 'Mendapat berkah dari Allah' },
      { task: 'Mengucapkan Alhamdulillah saat selesai belajar', reflection: 'Tanda bersyukur atas ilmu' },
      { task: 'Tersenyum dan menyapa teman baru di kelas 1', reflection: 'Meneladani sifat kasih sayang' },
    ],
  },
  {
    id: 'sd-1-akidah',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Akidah',
    chapterTitle: 'Bab 2: Mengenal Rukun Iman & Meyakini Allah Maha Esa',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik meyakini adanya Allah Swt. Yang Maha Esa melalui pengamatan ciptaan-Nya dan mengenal Rukun Iman.',
    tp: 'Menyebutkan 6 Rukun Iman secara berurutan dan membiasakan perilaku taat kepada Allah Swt.',
    dalil: {
      surah: 'QS. Al-Ikhlas : 1',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: '“Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa.”',
      note: 'Tadabbur: Allah itu satu (Esa), tidak beranak dan tidak diperanakkan.',
    },
    materials: [
      {
        term: 'Iman kepada Allah',
        meaning: 'Meyakini dengan hati bahwa Allah adalah Pencipta alam semesta.',
        behavior: 'Melihat keindahan langit dan mengucapkan Subhanallah.',
      },
      {
        term: 'Iman kepada Malaikat',
        meaning: 'Meyakini adanya malaikat yang patuh mencatat amal kita.',
        behavior: 'Selalu berbuat jujur karena ada malaikat yang mencatat.',
      },
      {
        term: 'Iman kepada Kitab Allah',
        meaning: 'Meyakini Al-Qur\'an adalah pedoman hidup mulia.',
        behavior: 'Rajin mengaji Iqro atau Al-Qur\'an setiap sore.',
      },
      {
        term: 'Iman kepada Rasul Allah',
        meaning: 'Mencintai Nabi Muhammad saw. dan meneladani akhlaknya.',
        behavior: 'Berbicara santun dan tidak memukul teman.',
      },
    ],
    matchingPairs: [
      { leftText: 'Rukun Iman ke-1', leftArabic: 'الإيمان بالله', rightText: 'Iman kepada Allah Swt.' },
      { leftText: 'Rukun Iman ke-2', leftArabic: 'الملائكة', rightText: 'Iman kepada Malaikat Allah' },
      { leftText: 'Rukun Iman ke-3', leftArabic: 'الكتب', rightText: 'Iman kepada Kitab-Kitab Allah' },
      { leftText: 'Rukun Iman ke-4', leftArabic: 'الرسل', rightText: 'Iman kepada Rasul-Rasul Allah' },
    ],
    multipleChoice: [
      {
        question: 'Rukun Iman yang pertama adalah beriman kepada...',
        options: ['Malaikat', 'Allah Swt.', 'Hari Kiamat', 'Takdir'],
        correctAnswer: 1,
        explanation: 'Pondasi utama rukun iman adalah meyakini keesaan Allah Swt.',
      },
      {
        question: 'Allah Swt. menciptakan matahari, bulan, dan bumi. Ini membuktikan bahwa Allah Maha...',
        options: ['Lemah', 'Pencipta (Al-Khaliq)', 'Tidur', 'Lupa'],
        correctAnswer: 1,
        explanation: 'Alam semesta yang indah adalah bukti kebesaran Allah Al-Khaliq.',
      },
    ],
    reflectivePrompt: {
      question: 'Apa bukti bahwa Allah Swt. menyayangi kita setiap hari?',
      hint: 'Pikirkan tentang anggota tubuh yang sehat dan keluarga yang menyayangi.',
    },
    adabMissions: [
      { task: 'Menghafalkan 6 urutan Rukun Iman bersama ayah/ibu', reflection: 'Menguatkan keyakinan hati' },
      { task: 'Merapikan mainan sendiri sebagai rasa syukur', reflection: 'Belajar mandiri dan disiplin' },
      { task: 'Mencium tangan orang tua sebelum berangkat sekolah', reflection: 'Adab berbakti kepada orang tua' },
    ],
  },

  // ==========================================
  // KELAS 2 SD (FASE A)
  // ==========================================
  {
    id: 'sd-2-fikih',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Fikih',
    chapterTitle: 'Bab 3: Asyiknya Berwudhu & Shalat Bersama Keluarga',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mempraktikkan tata cara bersuci (wudhu) secara tertib dan mengenal tata cara shalat fardhu lima waktu.',
    tp: 'Mempraktikkan rukun wudhu secara urut dan tertib serta menjelaskan syarat sah shalat.',
    dalil: {
      surah: 'QS. Al-Ma\'idah : 6',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
      translation: '“Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku...”',
      note: 'Tadabbur: Wudhu membersihkan anggota tubuh dari kotoran dan mensucikan hati dari dosa.',
    },
    materials: [
      {
        term: 'Niat Wudhu',
        arabicBadge: 'النية',
        meaning: 'Menyengaja bersuci karena Allah di dalam hati saat membasuh wajah.',
        behavior: 'Fokus dan tidak bercanda saat berada di tempat wudhu.',
      },
      {
        term: 'Membasuh Wajah',
        meaning: 'Membasuh seluruh bagian wajah dari batas rambut sampai dagu.',
        behavior: 'Meratakan air dengan lembut dan tertib.',
      },
      {
        term: 'Membasuh Tangan ke Siku',
        meaning: 'Membasuh tangan kanan lalu tangan kiri hingga melewati siku.',
        behavior: 'Mendahulukan anggota tubuh bagian kanan.',
      },
      {
        term: 'Tertib',
        meaning: 'Melakukan gerakan wudhu secara berurutan tanpa melompati rukun.',
        behavior: 'Mengantre giliran kran air dengan sopan di sekolah.',
      },
    ],
    matchingPairs: [
      { leftText: 'Rukun Wudhu 1', leftArabic: 'النية', rightText: 'Niat Bersuci di Dalam Hati' },
      { leftText: 'Rukun Wudhu 2', leftArabic: 'غسل الوجه', rightText: 'Membasuh Seluruh Muka / Wajah' },
      { leftText: 'Rukun Wudhu 3', leftArabic: 'غسل اليدين', rightText: 'Membasuh Kedua Tangan Hingga Siku' },
      { leftText: 'Rukun Wudhu 4', leftArabic: 'مسح الرأس', rightText: 'Mengusap Sebagian Kepala / Rambut' },
    ],
    multipleChoice: [
      {
        question: 'Saat berwudhu, kita disunnahkan untuk mendahulukan anggota badan sebelah...',
        options: ['Kiri', 'Kanan', 'Tengah', 'Belakang'],
        correctAnswer: 1,
        explanation: 'Rasulullah saw. menyukai mendahulukan yang kanan dalam bersuci dan kebaikan.',
      },
      {
        question: 'Shalat fardhu yang dikerjakan pada pagi hari sebelum terbit matahari adalah shalat...',
        options: ['Zuhur', 'Isya', 'Subuh (2 Rakaat)', 'Maghrib'],
        correctAnswer: 2,
        explanation: 'Shalat Subuh berjumlah 2 rakaat dilaksanakan di waktu fajar.',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana perasaanmu setelah selesai berwudhu dengan air yang sejuk dan bersih?',
      hint: 'Kaitkan dengan kesiapanmu untuk menghadap Allah Swt. dalam shalat.',
    },
    adabMissions: [
      { task: 'Berwudhu secara tertib dan hemat air (tidak membuang-buang kran)', reflection: 'Menjaga kelestarian air' },
      { task: 'Ikut shalat berjamaah di masjid atau bersama orang tua di rumah', reflection: 'Mendapat pahala 27 derajat' },
      { task: 'Merapikan sajadah dan peci/mukena setelah shalat', reflection: 'Mencintai kerapian tempat ibadah' },
    ],
  },

  // ==========================================
  // KELAS 3 SD (FASE B)
  // ==========================================
  {
    id: 'sd-3-akhlak',
    grade: 'Kelas 3 SD',
    gradeLevel: 3,
    fase: 'Fase B',
    element: 'Akhlak',
    chapterTitle: 'Bab 4: Perilaku Terpuji: Rendah Hati (Tawadhu) & Santun',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase B: Peserta didik membiasakan akhlak mulia dalam hubungan antarsesama, seperti rendah hati (tawadhu), santun berbicara, dan menjauhi sifat sombong.',
    tp: 'Menunjukkan contoh perilaku tawadhu dan bertutur kata yang baik dalam pergaulan di sekolah dan rumah.',
    dalil: {
      surah: 'QS. Al-Furqan : 63',
      arabic: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا',
      translation: '“Adapun hamba-hamba Tuhan Yang Maha Pengasih itu adalah orang-orang yang berjalan di bumi dengan rendah hati dan apabila orang jahil menyapa mereka, mereka mengucapkan kata-kata yang baik (damai).”',
      note: 'Tadabbur: Orang yang tawadhu tidak memamerkan kekayaan atau kepintarannya di hadapan orang lain.',
    },
    materials: [
      {
        term: 'Tawadhu (Rendah Hati)',
        arabicBadge: 'التواضع',
        meaning: 'Sikap tidak menyombongkan diri meski memiliki banyak kelebihan.',
        behavior: 'Mau berteman dengan siapa saja tanpa memandang status sosial.',
      },
      {
        term: 'Santun (Adab Berbicara)',
        meaning: 'Berbicara dengan suara lembut, tidak membentak, dan memilih kata yang baik.',
        behavior: 'Mengucapkan kata tolong, maaf, dan terima kasih setiap hari.',
      },
      {
        term: 'Menghargai Teman',
        meaning: 'Mendengarkan pendapat teman dan tidak memotong pembicaraan.',
        behavior: 'Memberikan kesempatan kawan menyampaikan pendapatnya di kelompok.',
      },
      {
        term: 'Menjauhi Takabur (Sombong)',
        arabicBadge: 'الكبر',
        meaning: 'Meremehkan orang lain dan menolak kebenaran, sifat yang dibenci Allah.',
        behavior: 'Tidak memamerkan nilai ulangan 100 dengan nada mengejek kawan.',
      },
    ],
    matchingPairs: [
      { leftText: 'Tawadhu', leftArabic: 'التواضع', rightText: 'Rendah Hati dan Tidak Membanggakan Diri' },
      { leftText: 'Santun', leftArabic: 'أدب اللسان', rightText: 'Tutur Kata Lembut dan Menyejukkan Hati' },
      { leftText: 'Takabur', leftArabic: 'الكبر', rightText: 'Sombong Merasa Lebih Hebat dari Orang Lain' },
      { leftText: 'Tasamuh', leftArabic: 'التسامح', rightText: 'Toleran dan Pemaaf Terhadap Kesalahan Teman' },
    ],
    multipleChoice: [
      {
        question: 'Rizki mendapat juara 1 lomba kaligrafi di sekolah. Sikap tawadhu yang sebaiknya ditunjukkan Rizki adalah...',
        options: [
          'Mengejek teman yang tidak mendapat juara',
          'Bersyukur kepada Allah dan tetap ramah kepada semua teman',
          'Menolak berbicara dengan teman sekelas',
          'Meminta uang jajan kepada teman-temannya',
        ],
        correctAnswer: 1,
        explanation: 'Sikap rendah hati mengajarkan kita untuk bersyukur dan tidak jumawa atas prestasi yang diraih.',
      },
      {
        question: 'Nabi Muhammad saw. bersabda: “Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau...”',
        options: ['Tertawa keras', 'Diam', 'Menyanyi', 'Marah'],
        correctAnswer: 1,
        explanation: 'Hadits riwayat Bukhari & Muslim: berkata yang baik atau lebih baik diam.',
      },
    ],
    reflectivePrompt: {
      question: 'Tuliskan satu ucapan santun yang paling sering kamu katakan kepada orang tuamu saat meminta bantuan!',
      hint: 'Contoh: “Ibu, tolong bantu Ananda belajar ya, terima kasih Ibu.”',
    },
    adabMissions: [
      { task: 'Membiasakan 3 kata ajaib: Maaf, Tolong, dan Terima Kasih', reflection: 'Menghormati hak sesama' },
      { task: 'Menghargai teman yang belum lancar membaca tanpa menertawakannya', reflection: 'Mengamalkan sikap rendah hati' },
      { task: 'Menundukkan pandangan dan berjalan tenang saat lewat di depan guru', reflection: 'Adab santun kepada pendidik' },
    ],
  },

  // ==========================================
  // KELAS 4 SD (FASE B) - FLAGSHIP
  // ==========================================
  {
    id: 'sd-4-akidah',
    grade: 'Kelas 4 SD',
    gradeLevel: 4,
    fase: 'Fase B',
    element: 'Akidah',
    chapterTitle: 'Bab 2: Meneladani 5 Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Aziz, Al-Mu\'min)',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase B: Peserta didik memahami arti dan makna 5 Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Aziz, Al-Mu\'min) serta mengaktualisasikannya dalam akhlak mulia sehari-hari.',
    tp: 'Mengidentifikasi makna 5 Asmaul Husna dan membuat rencana teladan nyata dalam kepemimpinan diri serta menjaga kedamaian.',
    dalil: {
      surah: 'QS. Al-A\'raf : 180',
      arabic: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا ۖ وَذَرُوا الَّذِينَ يُلْحِدُونَ فِي أَسْمَائِهِ',
      translation: '“Hanya milik Allah asma-ul husna (nama-nama yang agung), maka bermohonlah kepada-Nya dengan menyebut nama-nama itu dan tinggalkanlah orang-orang yang menyimpang...”',
      note: 'Tadabbur: Menghayati Asmaul Husna melahirkan pribadi mandiri, bersih, dan cinta damai.',
    },
    materials: [
      {
        term: 'Al-Malik (الْمَلِكُ)',
        arabicBadge: 'الْمَلِكُ',
        meaning: 'Allah Maha Merajai dan Menguasai seluruh alam semesta tanpa batas.',
        behavior: 'Menahan diri dari perbuatan curang & memimpin diri sendiri dengan tertib.',
      },
      {
        term: 'Al-Quddus (الْقُدُّوسُ)',
        arabicBadge: 'الْقُدُّوسُ',
        meaning: 'Allah Maha Suci dari segala bentuk kekurangan dan cacat.',
        behavior: 'Menjaga kesucian badan, kebersihan lingkungan kelas, dan kebersihan lisan.',
      },
      {
        term: 'As-Salam (السَّلَامُ)',
        arabicBadge: 'السَّلَامُ',
        meaning: 'Allah Maha Pemberi Keselamatan, Kedamaian, dan Kesejahteraan.',
        behavior: 'Menebarkan salam, menghindari pertengkaran, dan mendamaikan teman.',
      },
      {
        term: 'Al-Aziz (الْعَزِيزُ)',
        arabicBadge: 'الْعَزِيزُ',
        meaning: 'Allah Maha Perkasa, Maha Mulia, dan Tak Tertandingi.',
        behavior: 'Percaya diri membela kebenaran, pantang menyerah, dan berani berbuat jujur.',
      },
    ],
    matchingPairs: [
      { leftText: 'Al-Malik', leftArabic: 'الْمَلِكُ', rightText: 'Maha Merajai dan Menguasai Seluruh Alam Semesta' },
      { leftText: 'Al-Quddus', leftArabic: 'الْقُدُّوسُ', rightText: 'Maha Suci dari Segala Cacat dan Cela' },
      { leftText: 'As-Salam', leftArabic: 'السَّلَامُ', rightText: 'Maha Memberi Keselamatan, Damai, dan Sejahtera' },
      { leftText: 'Al-Aziz', leftArabic: 'الْعَزِيزُ', rightText: 'Maha Perkasa, Maha Mulia, dan Tidak Terkalahkan' },
    ],
    multipleChoice: [
      {
        question: 'Ahmad selalu berhati-hati saat berbicara dan tidak pernah mengejek teman sekelasnya. Ahmad juga rajin mencuci tangan serta menjaga kebersihan tempat shalat. Sikap Ahmad ini mencerminkan pengamalan Asmaul Husna...',
        options: ['Al-Malik', 'Al-Quddus', 'As-Salam', 'Al-Aziz'],
        correctAnswer: 1,
        explanation: 'Al-Quddus berarti Maha Suci. Meneladani sifat ini diwujudkan dengan menjaga kesucian hati, kebersihan lisan, dan kebersihan raga.',
      },
      {
        question: 'Ketika melihat dua temannya berselisih paham saat bermain bola di halaman sekolah, Fatimah dengan santun mengajak mereka berbaikan dan saling memaafkan. Nilai Asmaul Husna yang diteladani Fatimah adalah...',
        options: ['Al-Aziz', 'Al-Malik', 'As-Salam', 'Al-Quddus'],
        correctAnswer: 2,
        explanation: 'As-Salam berarti Maha Pemberi Keselamatan & Kedamaian. Teladannya adalah menjadi juru damai dan menyebarkan ketenangan.',
      },
    ],
    reflectivePrompt: {
      question: 'Tuliskan satu pengalaman nyatamu di sekolah atau di rumah saat kamu berhasil menahan amarah atau bersikap mandiri!',
      hint: 'Kaitkan dengan teladan Asmaul Husna yang kamu pilih (contoh: Al-Malik dalam memimpin diri sendiri).',
    },
    adabMissions: [
      { task: 'Menebarkan salam dan senyum ramah kepada guru, orang tua, dan teman', reflection: 'Meneladani As-Salam untuk menciptakan suasana damai' },
      { task: 'Membuang sampah pada tempatnya dan merapikan alat shalat setelah digunakan', reflection: 'Meneladani Al-Quddus dalam menjaga kebersihan fisik dan batin' },
      { task: 'Berani mengakui kesalahan dan meminta maaf tanpa gengsi atau takut', reflection: 'Meneladani Al-Aziz dengan kemuliaan jiwa yang berani berbuat jujur' },
    ],
  },

  // ==========================================
  // KELAS 5 SD (FASE C)
  // ==========================================
  {
    id: 'sd-5-akhlak',
    grade: 'Kelas 5 SD',
    gradeLevel: 5,
    fase: 'Fase C',
    element: 'Akhlak',
    chapterTitle: 'Bab 3: Hidup Damai dalam Keberagaman (Tasamuh & Menghargai Sesama)',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase C: Peserta didik menghargai keragaman sebagai sunnatullah (ketetapan Allah), menerapkan sikap saling menghormati (tasamuh), tolong-menolong, dan persaudaraan antarsesama manusia.',
    tp: 'Menganalisis pesan moral QS. Al-Hujurat ayat 13 dan merumuskan aksi nyata toleransi di lingkungan multikultural.',
    dalil: {
      surah: 'QS. Al-Hujurat : 13',
      arabic: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
      translation: '“Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal...”',
      note: 'Tadabbur: Kemuliaan di sisi Allah bukan diukur dari suku atau warna kulit, melainkan dari ketakwaan.',
    },
    materials: [
      {
        term: 'Tasamuh (Toleransi)',
        arabicBadge: 'التسامح',
        meaning: 'Sikap lapang dada menghargai perbedaan latar belakang, suku, dan pandangan.',
        behavior: 'Menghormati teman yang sedang menjalankan ibadahnya dengan tenang.',
      },
      {
        term: 'Ta\'aruf (Saling Mengenal)',
        arabicBadge: 'التعارف',
        meaning: 'Saling mengenal secara mendalam kelebihan dan keunikan budaya sesama kawan.',
        behavior: 'Mengajak berkenalan teman pindahan baru tanpa diskriminasi.',
      },
      {
        term: 'Ta\'awun (Tolong Menolong)',
        arabicBadge: 'التعاون',
        meaning: 'Saling bekerja sama dalam kebajikan dan ketaqwaan kepada Allah Swt.',
        behavior: 'Membantu mengumpulkan donasi saat terjadi musibah bencana alam.',
      },
      {
        term: 'Husnudzan (Prasangka Baik)',
        arabicBadge: 'حسن الظن',
        meaning: 'Menjaga kejernihan hati dengan tidak mencurigai teman tanpa bukti.',
        behavior: 'Menghindari menyebarkan gosip atau berita bohong di kelas.',
      },
    ],
    matchingPairs: [
      { leftText: 'Tasamuh', leftArabic: 'التسامح', rightText: 'Sikap Lapang Dada & Toleransi Menghargai Perbedaan' },
      { leftText: 'Ta\'aruf', leftArabic: 'التعارف', rightText: 'Saling Mengenal Kebaikan Sesama Teman' },
      { leftText: 'Ta\'awun', leftArabic: 'التعاون', rightText: 'Tolong-Menolong dalam Kebaikan & Taqwa' },
      { leftText: 'Husnudzan', leftArabic: 'حسن الظن', rightText: 'Berprasangka Baik kepada Allah dan Sesama Manusia' },
    ],
    multipleChoice: [
      {
        question: 'Tujuan utama Allah Swt. menciptakan manusia bersuku-suku dan berbangsa-bangsa sesuai QS. Al-Hujurat ayat 13 adalah agar...',
        options: [
          'Saling bermusuhan dan berperang',
          'Saling mengenal dan bersinergi dalam kebaikan (Li-ta\'arafu)',
          'Merasa suku bangsanya paling unggul',
          'Memisahkan diri dari pergaulan',
        ],
        correctAnswer: 1,
        explanation: 'Kata "Lita\'arafu" berarti agar saling mengenal, memahami, dan berkolaborasi dalam kebajikan.',
      },
      {
        question: 'Dalam berteman dengan kawan yang berbeda agama atau suku di sekolah, batasan toleransi (tasamuh) yang benar adalah...',
        options: [
          'Ikut merayakan ritual ibadahnya di tempat ibadahnya',
          'Menghormati hak ibadahnya tanpa mencampuri urusan akidah (Lakum dinukum waliyadin)',
          'Memaksa mereka mengikuti keyakinan kita',
          'Tidak mau berbicara sama sekali',
        ],
        correctAnswer: 1,
        explanation: 'Prinsip toleransi Islam: menghormati tanpa mencampuradukkan aqidah ibadah (QS. Al-Kafirun).',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana caramu menjaga keharmonisan pertemanan saat ada teman yang berbeda pendapat denganmu saat kerja kelompok?',
      hint: 'Gunakan prinsip musyawarah, lapang dada, dan saling menghargai.',
    },
    adabMissions: [
      { task: 'Menjenguk atau mendoakan teman kelas yang sedang sakit tanpa memandang latar belakang', reflection: 'Mempererat tali persaudaraan insaniyah' },
      { task: 'Tidak mengejek logat atau bahasa daerah teman di sekolah', reflection: 'Menghargai keragaman sebagai sunnatullah' },
      { task: 'Berpartisipasi aktif dalam kegiatan kerja bakti kebersihan kelas', reflection: 'Mengamalkan gotong royong ta\'awun' },
    ],
  },

  // ==========================================
  // KELAS 6 SD (FASE C)
  // ==========================================
  {
    id: 'sd-6-fikih',
    grade: 'Kelas 6 SD',
    gradeLevel: 6,
    fase: 'Fase C',
    element: 'Fikih',
    chapterTitle: 'Bab 4: Membersihkan Harta & Jiwa: Zakat, Infak, dan Sedekah',
    semester: 'Semester 1 (Ganjil)',
    cp020: 'CP No. 020/2026 - Fase C: Peserta didik memahami ketentuan zakat fitrah, infak, dan sedekah serta hikmah penerapannya dalam menumbuhkan empati dan kepedulian sosial.',
    tp: 'Membedakan konsep zakat fitrah, zakat mal, infak, dan sedekah serta menghitung kadar zakat fitrah secara tepat.',
    dalil: {
      surah: 'QS. At-Taubah : 103',
      arabic: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ',
      translation: '“Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka dan berdoalah untuk mereka...”',
      note: 'Tadabbur: Di dalam setiap rezeki kita, terdapat hak saudara kita yang membutuhkan bantuan.',
    },
    materials: [
      {
        term: 'Zakat Fitrah',
        arabicBadge: 'زكاة الفطر',
        meaning: 'Zakat berupa bahan makanan pokok (2,5 kg beras) untuk mensucikan jiwa di bulan Ramadhan.',
        behavior: 'Menunaikan zakat fitrah bersama keluarga sebelum shalat Idul Fitri.',
      },
      {
        term: 'Zakat Mal',
        arabicBadge: 'زكاة المال',
        meaning: 'Zakat harta benda yang telah mencapai nisab (batas minimal) dan haul (1 tahun kepemilikan).',
        behavior: 'Menghitung tabungan dan mengeluarkan 2,5% hak mustahik.',
      },
      {
        term: 'Infak',
        arabicBadge: 'إنفاق',
        meaning: 'Mengeluarkan sebagian harta kekayaan untuk kebaikan tanpa batasan nisab dan waktu.',
        behavior: 'Menyisihkan uang saku untuk kotak infak pembangunan masjid sekolah.',
      },
      {
        term: 'Sedekah',
        arabicBadge: 'صدقة',
        meaning: 'Pemberian sukarela berupa materi maupun non-materi (senyuman, tenaga, dan nasihat baik).',
        behavior: 'Tersenyum ramah kepada adik kelas dan menyingkirkan duri di jalanan.',
      },
    ],
    matchingPairs: [
      { leftText: 'Zakat Fitrah', leftArabic: 'زكاة الفطر', rightText: 'Beras 2,5 Kg untuk Mensucikan Jiwa Menjelang Idul Fitri' },
      { leftText: 'Zakat Mal', leftArabic: 'زكاة المال', rightText: 'Zakat Harta yang Telah Mencapai Batas Nisab & Haul 1 Tahun' },
      { leftText: 'Infak', leftArabic: 'إنفاق', rightText: 'Pemberian Harta Sukarela untuk Kepentingan Agama/Umum' },
      { leftText: 'Sedekah', leftArabic: 'صدقة', rightText: 'Kebaikan Materi Maupun Non-Materi (Termasuk Senyuman)' },
    ],
    multipleChoice: [
      {
        question: 'Kadar zakat fitrah yang wajib dikeluarkan oleh setiap jiwa muslim berupa makanan pokok beras adalah seberat...',
        options: ['1 kg', '2,5 kg atau 3,5 liter', '5 kg', '10 kg'],
        correctAnswer: 1,
        explanation: 'Kadar zakat fitrah menurut mayoritas ulama dan ketetapan BAZNAS adalah 2,5 kg atau 3,5 liter beras berkualitas baik.',
      },
      {
        question: 'Orang yang berhak menerima zakat (mustahik) terbagi menjadi ... golongan (asnaf) sesuai QS. At-Taubah ayat 60.',
        options: ['4 golongan', '6 golongan', '8 golongan', '10 golongan'],
        correctAnswer: 2,
        explanation: 'Mustahik zakat ada 8 asnaf: fakir, miskin, amil, mualaf, riqab, gharim, fisabilillah, dan ibnu sabil.',
      },
    ],
    reflectivePrompt: {
      question: 'Mengapa Islam sangat menganjurkan kita untuk gemar bersedekah meskipun dengan hal yang sederhana?',
      hint: 'Kaitkan dengan rasa syukur, membersihkan hati dari sifat kikir, dan membahagiakan orang lain.',
    },
    adabMissions: [
      { task: 'Menyisihkan uang saku untuk sedekah Subuh atau infak Jumat di sekolah', reflection: 'Melatih kedermawanan sejak dini' },
      { task: 'Membantu membawakan barang belanjaan orang tua tanpa diminta upah', reflection: 'Sedekah tenaga dan bakti keluarga' },
      { task: 'Tersenyum ikhlas dan bertegur sapa saat berpapasan dengan teman', reflection: 'Senyuman adalah sedekah' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 1 SD (FASE A)
  // ==========================================
  {
    id: 'sd-1-akhlak-sem2',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Akhlak',
    chapterTitle: 'Bab 3: Indahnya Kasih Sayang & Sikap Santun (Adab kepada Orang Tua & Guru)',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik terbiasa mempraktikkan nilai-nilai akhlak mulia dalam kehidupan sehari-hari, santun berbicara, menyayangi keluarga dan teman, serta menghormati orang tua dan guru.',
    tp: 'Membiasakan 3 kata ajaib (Maaf, Tolong, Terima Kasih) dan mencium tangan orang tua serta guru dengan takzim.',
    dalil: {
      surah: 'QS. Al-Isra : 23',
      arabic: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
      translation: '“Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapak.”',
      note: 'Tadabbur: Berbakti dan bersikap santun kepada orang tua mendatangkan ridha Allah Swt.',
    },
    materials: [
      {
        term: 'Birrul Walidain (Berbakti)',
        arabicBadge: 'بر الوالدين',
        meaning: 'Sikap menyayangi, mematuhi nasihat baik, dan membahagiakan ayah dan ibu.',
        behavior: 'Mendengarkan perkataan orang tua dan tidak membantah dengan suara keras.',
      },
      {
        term: 'Hormat kepada Guru',
        meaning: 'Memuliakan bapak dan ibu guru yang membimbing dan memberi ilmu di sekolah.',
        behavior: 'Menyapa guru dengan ramah serta memperhatikan pelajaran di kelas.',
      },
      {
        term: 'Kata Maaf & Tolong',
        meaning: 'Ucapan santun saat meminta bantuan dan ketika berbuat kesalahan.',
        behavior: 'Segera meminta maaf jika tidak sengaja menyenggol kawan di kelas.',
      },
      {
        term: 'Terima Kasih',
        meaning: 'Ungkapan rasa syukur dan menghargai kebaikan yang diberikan orang lain.',
        behavior: 'Mengucapkan terima kasih saat dipinjami pensil atau dibantu teman.',
      },
    ],
    matchingPairs: [
      { leftText: 'Birrul Walidain', leftArabic: 'بر الوالدين', rightText: 'Berbakti dan Berbuat Baik kepada Kedua Orang Tua' },
      { leftText: 'Ucapan Tolong', leftArabic: 'طلب المساعدة', rightText: 'Kata Santun Diucapkan saat Membutuhkan Bantuan' },
      { leftText: 'Ucapan Maaf', leftArabic: 'طلب العفو', rightText: 'Diucapkan dengan Ikhlas saat Berbuat Salah' },
      { leftText: 'Terima Kasih', leftArabic: 'الشكر', rightText: 'Ungkapan Menghargai Bantuan dan Kebaikan Teman' },
    ],
    multipleChoice: [
      {
        question: 'Ketika Ananda membutuhkan bantuan Bu Guru untuk mengambil buku di rak tinggi, kata yang sebaiknya diucapkan adalah...',
        options: ['“Cepat ambilkan!”', '“Bu Guru, tolong bantu Ananda ya.”', '“Biar saja di situ.”', '“Ambil sendiri.”'],
        correctAnswer: 1,
        explanation: 'Kata "Tolong" adalah adab santun meminta bantuan dalam Islam.',
      },
      {
        question: 'Cara menunjukkan sikap birrul walidain (berbakti kepada orang tua) di rumah adalah...',
        options: [
          'Membantu merapikan tempat tidur sendiri dan mendoakan orang tua',
          'Bermain seharian tanpa belajar',
          'Marah-marah jika tidak dibelikan mainan',
          'Pura-pura tidur saat dipanggil ibu',
        ],
        correctAnswer: 0,
        explanation: 'Membantu pekerjaan rumah dan mendoakan orang tua merupakan wujud nyata berbakti.',
      },
    ],
    reflectivePrompt: {
      question: 'Kebaikan apa yang sudah kamu lakukan hari ini untuk membuat ayah dan ibumu tersenyum bangga?',
      hint: 'Tuliskan tindakan kecil seperti merapikan sepatu atau mencium tangan mereka.',
    },
    adabMissions: [
      { task: 'Mencium tangan kedua orang tua sebelum melangkah berangkat ke sekolah', reflection: 'Mendapat ridha dan doa keselamatan' },
      { task: 'Mengucapkan 3 kata santun: Maaf, Tolong, dan Terima Kasih di kelas', reflection: 'Menjaga kerukunan sesama kawan' },
      { task: 'Mendoakan orang tua: Rabbighfirli waliwalidayya warhamhuma...', reflection: 'Kewajiban anak shalih setiap shalat' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 2 SD (FASE A)
  // ==========================================
  {
    id: 'sd-2-quran-sem2',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Al-Qur\'an Hadis',
    chapterTitle: 'Bab 4: Senangnya Membaca Surah An-Nas & Menghafalkannya',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik melafalkan surah-surah pendek Al-Qur\'an (An-Nas, Al-Falaq, Al-Ikhlas) dengan fasih dan berani, serta memahami arti penting memohon perlindungan hanya kepada Allah Swt.',
    tp: 'Melafalkan Surah An-Nas ayat 1-6 dengan fasih berani dan menjelaskan pesan memohon perlindungan dari bisikan jahat.',
    dalil: {
      surah: 'QS. An-Nas : 1-3',
      arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ',
      translation: '“Katakanlah: Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia...”',
      note: 'Tadabbur: Hanya Allah Swt. Yang Maha Kuasa melindungi kita dari rasa takut dan godaan keburukan.',
    },
    materials: [
      {
        term: 'Rabbun Nas (Tuhan Manusia)',
        arabicBadge: 'رَبِّ النَّاسِ',
        meaning: 'Allah adalah Pencipta, Pemelihara, dan Penjaga seluruh umat manusia.',
        behavior: 'Hanya meminta pertolongan dan berdoa kepada Allah Swt.',
      },
      {
        term: 'Malikin Nas (Raja Manusia)',
        arabicBadge: 'مَلِكِ النَّاسِ',
        meaning: 'Allah Maha Merajai seluruh alam dan tiada sekutu bagi-Nya.',
        behavior: 'Tunduk dan patuh menjalankan perintah Allah dalam shalat.',
      },
      {
        term: 'Ilahin Nas (Sembahan Manusia)',
        arabicBadge: 'إِلَٰهِ النَّاسِ',
        meaning: 'Satu-satunya sesembahan yang berhak disembah dan ditaati.',
        behavior: 'Tidak menyekutukan Allah dengan benda apa pun.',
      },
      {
        term: 'Waswas (Bisikan Jahat)',
        meaning: 'Godaan setan atau nafsu yang membujuk anak untuk malas dan berbuat curang.',
        behavior: 'Segera membaca ta\'awwudz saat merasa takut atau ingin berbohong.',
      },
    ],
    matchingPairs: [
      { leftText: 'Rabbun Nas', leftArabic: 'رَبِّ النَّاسِ', rightText: 'Allah Tuhan Pencipta dan Pemelihara Manusia' },
      { leftText: 'Malikin Nas', leftArabic: 'مَلِكِ النَّاسِ', rightText: 'Allah Maha Merajai Seluruh Kehidupan Manusia' },
      { leftText: 'Ilahin Nas', leftArabic: 'إِلَٰهِ النَّاسِ', rightText: 'Satu-satunya Sembahan yang Benar bagi Manusia' },
      { leftText: 'Waswasil Khannas', leftArabic: 'الْوَسْوَاسِ الْخَنَّاسِ', rightText: 'Bisikan Jahat Setan yang Bersembunyi' },
    ],
    multipleChoice: [
      {
        question: 'Surah An-Nas diturunkan untuk mengajarkan kita agar senantiasa berlindung hanya kepada...',
        options: ['Manusia sakti', 'Allah Swt.', 'Patung', 'Pohon besar'],
        correctAnswer: 1,
        explanation: 'Surah An-Nas adalah surah perlindungan (Al-Mu\'awwidzatain) yang ditujukan hanya kepada Allah.',
      },
      {
        question: 'Surah An-Nas terdiri dari ... ayat.',
        options: ['4 ayat', '5 ayat', '6 ayat', '7 ayat'],
        correctAnswer: 2,
        explanation: 'Surah An-Nas terdiri dari 6 ayat dan merupakan surah penutup Al-Qur\'an (ke-114).',
      },
    ],
    reflectivePrompt: {
      question: 'Kapan saja kamu biasanya membaca Surah An-Nas untuk menenangkan hatimu?',
      hint: 'Contoh: Sebelum tidur malam atau saat merasa cemas dan takut sendirian.',
    },
    adabMissions: [
      { task: 'Membaca Surah An-Nas, Al-Falaq, dan Al-Ikhlas sebelum tidur malam', reflection: 'Mendapat perlindungan dari Allah hingga fajar' },
      { task: 'Membaca ta\'awwudz saat merasa malas untuk shalat atau belajar', reflection: 'Menangkal bisikan waswas setan' },
      { task: 'Melafalkan hafalan Surah An-Nas dengan suara jelas di hadapan orang tua', reflection: 'Melatih keberanian dan tartil' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 3 SD (FASE B)
  // ==========================================
  {
    id: 'sd-3-fikih-sem2',
    grade: 'Kelas 3 SD',
    gradeLevel: 3,
    fase: 'Fase B',
    element: 'Fikih',
    chapterTitle: 'Bab 5: Asyiknya Shalat Fardhu Berjamaah di Sekolah dan Masjid',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase B: Peserta didik memahami rukun dan syarat sah shalat fardhu, keutamaan shalat berjamaah, tata tertib merapikan shaf, serta membiasakan shalat berjamaah tepat waktu.',
    tp: 'Menjelaskan tata cara shalat fardhu berjamaah, fungsi imam dan makmum, serta keutamaan pahala 27 derajat.',
    dalil: {
      surah: 'QS. Al-Baqarah : 43',
      arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
      translation: '“Dan laksanakanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.”',
      note: 'Tadabbur: Rukuk bersama orang-orang yang rukuk bermakna anjuran shalat berjamaah.',
    },
    materials: [
      {
        term: 'Shalat Berjamaah',
        arabicBadge: 'صلاة الجماعة',
        meaning: 'Shalat yang dikerjakan sekurang-kurangnya dua orang, satu sebagai imam dan yang lain sebagai makmum.',
        behavior: 'Menjawab ajakan teman untuk shalat Zuhur berjamaah di musholla sekolah.',
      },
      {
        term: 'Imam & Makmum',
        meaning: 'Imam memimpin shalat di depan, sedangkan makmum mengikuti gerakan imam tanpa mendahuluinya.',
        behavior: 'Tertib mengikuti ruku dan sujud imam tanpa tergesa-gesa.',
      },
      {
        term: 'Pahala 27 Derajat',
        meaning: 'Keutamaan pahala shalat berjamaah yang berlipat ganda dibanding shalat sendirian.',
        behavior: 'Bersemangat berangkat ke masjid saat mendengar suara adzan berkumandang.',
      },
      {
        term: 'Merapikan Shaf',
        arabicBadge: 'تسوية الصف',
        meaning: 'Meluruskan dan merapatkan barisan shalat dari ujung ke ujung.',
        behavior: 'Merapatkan pundak dan kaki saat berdiri dalam barisan shalat.',
      },
    ],
    matchingPairs: [
      { leftText: 'Imam', leftArabic: 'الإمام', rightText: 'Pemimpin Shalat Berjamaah yang Wajib Diikuti Gerakannya' },
      { leftText: 'Makmum', leftArabic: 'المأموم', rightText: 'Orang yang Mengikuti Gerakan Imam di Belakang' },
      { leftText: 'Pahala Berjamaah', leftArabic: '٢٧ درجة', rightText: 'Kelipatan 27 Derajat Dibanding Shalat Sendirian' },
      { leftText: 'Taswiyatus Shaf', leftArabic: 'تسوية الصفوف', rightText: 'Meluruskan dan Merapatkan Barisan Sebelum Takbiratul Ihram' },
    ],
    multipleChoice: [
      {
        question: 'Pahala shalat berjamaah menurut hadits Rasulullah saw. dilipatgandakan sebanyak...',
        options: ['10 derajat', '17 derajat', '27 derajat', '70 derajat'],
        correctAnswer: 2,
        explanation: 'Hadits shahih Bukhari & Muslim: Shalat berjamaah lebih utama 27 derajat dibanding shalat sendirian.',
      },
      {
        question: 'Sikap seorang makmum yang benar ketika imam sedang membaca Al-Fatihah atau rukuk adalah...',
        options: [
          'Mendahului imam agar cepat selesai',
          'Mendengarkan dengan tenang dan mengikuti gerakan setelah imam',
          'Bercanda dan menyenggol teman di samping',
          'Keluar dari barisan shalat',
        ],
        correctAnswer: 1,
        explanation: 'Makmum wajib mengikuti imam dan dilarang mendahului gerakan imam.',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana perasaanmu ketika berdiri rapi bersama teman-teman dalam shalat berjamaah di musholla sekolah?',
      hint: 'Kaitkan dengan rasa persaudaraan sesama muslim dan kedisiplinan hidup.',
    },
    adabMissions: [
      { task: 'Mengambil wudhu dengan tenang dan hemat air saat adzan berkumandang', reflection: 'Menyambut panggilan Allah Swt.' },
      { task: 'Merapatkan dan meluruskan shaf shalat bersama kawan sekelas', reflection: 'Menjaga kesempurnaan shalat jamaah' },
      { task: 'Tidak berbicara atau bergurau saat berada di dalam musholla/masjid', reflection: 'Menjaga kesucian rumah ibadah' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 4 SD (FASE B)
  // ==========================================
  {
    id: 'sd-4-baligh-sem2',
    grade: 'Kelas 4 SD',
    gradeLevel: 4,
    fase: 'Fase B',
    element: 'Fikih',
    chapterTitle: 'Bab 4: Menyambut Usia Baligh & Menjalankan Kewajiban Syariat',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase B: Peserta didik memahami tanda-tanda usia baligh menurut pandangan ilmu fikih dan ilmu biologi, memahami konsep mukallaf, tata cara mandi wajib (thaharah), serta menutup aurat.',
    tp: 'Mengidentifikasi tanda-tanda usia baligh dan mempraktikkan tata cara mandi wajib bersuci secara tepat menurut tuntunan syariat.',
    dalil: {
      surah: 'QS. An-Nur : 59',
      arabic: 'وَإِذَا بَلَغَ الْأَطْفَالُ مِنكُمُ الْحُلُمَ فَلْيَسْتَأْذِنُوا كَمَا اسْتَأْذَنَ الَّذِينَ مِن قَبْلِهِمْ',
      translation: '“Dan apabila anak-anakmu telah sampai umur baligh, maka hendaklah mereka meminta izin, seperti orang-orang sebelum mereka meminta izin...”',
      note: 'Tadabbur: Usia baligh adalah gerbang kedewasaan dan awal pertanggungjawaban amal shalih secara mandiri.',
    },
    materials: [
      {
        term: 'Baligh',
        arabicBadge: 'الْبُلُوغُ',
        meaning: 'Taraf kedewasaan seseorang yang ditandai dengan perubahan fisik dan biologis.',
        behavior: 'Menyiapkan diri untuk rajin shalat 5 waktu tanpa perlu disuruh orang tua.',
      },
      {
        term: 'Mukallaf',
        meaning: 'Orang muslim yang telah baligh dan berakal sehingga wajib mematuhi seluruh hukum syariat.',
        behavior: 'Bertanggung jawab penuh atas setiap ucapan dan perbuatan sendiri.',
      },
      {
        term: 'Mandi Wajib (Ghusl)',
        arabicBadge: 'الغسل الواجب',
        meaning: 'Membasuh seluruh badan dari ujung rambut hingga kaki dengan air suci untuk menghilangkan hadas besar.',
        behavior: 'Mempelajari niat dan rukun mandi wajib dengan teliti.',
      },
      {
        term: 'Menjaga Aurat & Malu',
        meaning: 'Menutup bagian tubuh yang wajib ditutup syariat dan memiliki rasa malu berbuat dosa.',
        behavior: 'Mengenakan pakaian sopan dan menjaga pandangan mata dalam pergaulan.',
      },
    ],
    matchingPairs: [
      { leftText: 'Baligh', leftArabic: 'الْبُلُوغُ', rightText: 'Batas Usia Kedewasaan dan Titik Awal Kewajiban Syariat' },
      { leftText: 'Mukallaf', leftArabic: 'المكلف', rightText: 'Muslim Baligh & Berakal yang Dikenai Beban Hukum Syariat' },
      { leftText: 'Hadas Besar', leftArabic: 'الحدث الأكبر', rightText: 'Keadaan yang Mensyaratkan Mandi Wajib untuk Sahnya Shalat' },
      { leftText: 'Haya\' (Rasa Malu)', leftArabic: 'الحياء', rightText: 'Benteng Akhlak Mulia yang Menjaga Anak Shalih dari Maksiat' },
    ],
    multipleChoice: [
      {
        question: 'Seorang muslim yang telah memasuki usia baligh dan berakal sehat disebut sebagai...',
        options: ['Muallaf', 'Mukallaf', 'Musafir', 'Munafik'],
        correctAnswer: 1,
        explanation: 'Mukallaf adalah orang yang telah terbebani kewajiban syariat (shalat, puasa, menutup aurat).',
      },
      {
        question: 'Rukun mandi wajib yang paling mendasar adalah membaca niat di dalam hati dan...',
        options: [
          'Memakai sabun wangi yang banyak',
          'Mengalirkan air suci ke seluruh anggota tubuh dari kepala hingga kaki',
          'Berwudhu saja tanpa membasahi rambut',
          'Mengeringkan badan dengan handuk',
        ],
        correctAnswer: 1,
        explanation: 'Rukun mandi wajib adalah niat dan meratakan air suci ke seluruh permukaan tubuh tanpa ada yang terlewat.',
      },
    ],
    reflectivePrompt: {
      question: 'Tanggung jawab apa yang berubah dalam dirimu ketika kamu bertambah besar dan beranjak dewasa?',
      hint: 'Pikirkan tentang shalat 5 waktu tepat waktu, belajar mandiri, dan menjaga adab pergaulan.',
    },
    adabMissions: [
      { task: 'Menjaga shalat 5 waktu secara disiplin tanpa harus diingatkan orang tua', reflection: 'Menunaikan amanah sebagai calon mukallaf' },
      { task: 'Mengenakan pakaian yang menutup aurat dan sopan di luar rumah', reflection: 'Menjaga kehormatan diri dan rasa malu' },
      { task: 'Membaca doa masuk dan keluar kamar mandi serta membiasakan bersuci', reflection: 'Adab thaharah anak shalih' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 5 SD (FASE C)
  // ==========================================
  {
    id: 'sd-5-puasa-sem2',
    grade: 'Kelas 5 SD',
    gradeLevel: 5,
    fase: 'Fase C',
    element: 'Fikih',
    chapterTitle: 'Bab 4: Menjalankan Ibadah Puasa Ramadhan & Meraih Derajat Taqwa',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase C: Peserta didik memahami ketentuan, syarat, rukun, hal yang membatalkan, dan hikmah ibadah puasa Ramadhan dalam melatih kesabaran, empati sosial, dan meraih derajat taqwa.',
    tp: 'Menganalisis ketentuan rukun puasa Ramadhan dan membiasakan amalan sunnah di bulan Ramadhan seperti tadarus dan sedekah.',
    dalil: {
      surah: 'QS. Al-Baqarah : 183',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
      translation: '“Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertaqwa.”',
      note: 'Tadabbur: Puncak tujuan ibadah puasa adalah melahirkan pribadi muslim yang bertaqwa (la\'allakum tattaqun).',
    },
    materials: [
      {
        term: 'Shiyam (Puasa Ramadhan)',
        arabicBadge: 'الصِّيَامُ',
        meaning: 'Menahan diri dari makan, minum, dan segala hal yang membatalkan dari terbit fajar hingga terbenam matahari dengan niat ibadah.',
        behavior: 'Menjalankan puasa Ramadhan penuh dengan sabar dan gembira.',
      },
      {
        term: 'Niat Puasa Ramadhan',
        arabicBadge: 'النية',
        meaning: 'Menyengaja berpuasa Ramadhan di malam hari sebelum fajar menyingsing.',
        behavior: 'Membaca niat puasa Ramadhan setelah shalat tarawih atau saat sahur.',
      },
      {
        term: 'Empati Sosial',
        meaning: 'Merasakan rasa lapar dan dahaga yang dialami kaum dhuafa agar terdorong rajin bersedekah.',
        behavior: 'Menyisihkan uang saku untuk berbagi takjil kepada orang yang membutuhkan.',
      },
      {
        term: 'Taqwa',
        arabicBadge: 'التَّقْوَى',
        meaning: 'Menjalankan segala perintah Allah dan menjauhi segala larangan-Nya.',
        behavior: 'Jujur berpuasa meskipun sedang sendirian di kamar dan tidak ada orang yang melihat.',
      },
    ],
    matchingPairs: [
      { leftText: 'Syarat Wajib Puasa', leftArabic: 'شروط الوجوب', rightText: 'Islam, Baligh, Berakal Sehat, dan Mampu Melaksanakannya' },
      { leftText: 'Rukun Puasa', leftArabic: 'أركان الصيام', rightText: 'Niat di Malam Hari & Menahan Diri dari Pembatal Puasa' },
      { leftText: 'Sunnah Puasa', leftArabic: 'سنن الصيام', rightText: 'Mengakhirkan Sahur, Menyegerakan Berbuka, & Tadarus Al-Qur\'an' },
      { leftText: 'Tujuan Akhir Puasa', leftArabic: 'لَعَلَّكُمْ تَتَّقُونَ', rightText: 'Meraih Derajat Kemuliaan Taqwa di Sisi Allah Swt.' },
    ],
    multipleChoice: [
      {
        question: 'Tujuan utama diwajibkannya ibadah puasa Ramadhan sesuai QS. Al-Baqarah ayat 183 adalah agar kita...',
        options: ['Menjadi kurus', 'Dipuji teman sekelas', 'Meraih derajat taqwa (La\'allakum tattaqun)', 'Menghemat uang jajan'],
        correctAnswer: 2,
        explanation: 'Ayat 183 menegaskan tujuan puasa adalah membentuk insan yang bertaqwa kepada Allah.',
      },
      {
        question: 'Waktu yang tepat dan sah untuk berniat puasa fardhu Ramadhan adalah...',
        options: [
          'Pada waktu siang hari pukul 12.00',
          'Pada malam hari sejak maghrib hingga sebelum fajar Subuh',
          'Setelah selesai makan siang',
          'Saat matahari terbenam esok harinya',
        ],
        correctAnswer: 1,
        explanation: 'Puasa fardhu Ramadhan wajib berniat pada malam hari (Tabyitun Niyyah) sebelum waktu Subuh tiba.',
      },
    ],
    reflectivePrompt: {
      question: 'Pelajaran berharga apa tentang kesabaran dan kejujuran yang kamu rasakan saat berpuasa satu hari penuh?',
      hint: 'Kaitkan dengan kesadaran bahwa Allah Maha Melihat perbuatan kita di mana saja.',
    },
    adabMissions: [
      { task: 'Menjaga lisan dari perkataan bohong, mengejek, dan bertengkar saat berpuasa', reflection: 'Menjaga pahala puasa dari kesia-siaan' },
      { task: 'Mengikuti tadarus Al-Qur\'an bersama keluarga atau di musholla terdekat', reflection: 'Menghidupkan malam-malam Ramadhan yang mulia' },
      { task: 'Membantu ibu menyiapkan hidangan berbuka puasa di dapur', reflection: 'Berbakti dan meraih berkah sedekah takjil' },
    ],
  },

  // ==========================================
  // SEMESTER 2 (GENAP) - KELAS 6 SD (FASE C)
  // ==========================================
  {
    id: 'sd-6-spi-sem2',
    grade: 'Kelas 6 SD',
    gradeLevel: 6,
    fase: 'Fase C',
    element: 'Sejarah Peradaban Islam',
    chapterTitle: 'Bab 5: Meneladani Kepemimpinan Bijaksana Khulafaur Rasyidin',
    semester: 'Semester 2 (Genap)',
    cp020: 'CP No. 020/2026 - Fase C: Peserta didik mampu meneladani nilai-nilai kepemimpinan mulia Khulafaur Rasyidin (Abu Bakar, Umar, Utsman, Ali), musyawarah, keadilan sosial, dan kesederhanaan dalam kehidupan bermasyarakat.',
    tp: 'Menganalisis karakter kepemimpinan 4 Khulafaur Rasyidin dan menerapkan prinsip musyawarah serta keadilan dalam kepemimpinan kelas.',
    dalil: {
      surah: 'QS. Ali \'Imran : 159',
      arabic: 'فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ',
      translation: '“Maka berkat rahmat Allah engkau (Muhammad) berlaku lemah lembut terhadap mereka... dan bermusyawarahlah dengan mereka dalam urusan itu...”',
      note: 'Tadabbur: Pemimpin muslim sejati mengedepankan kelemahlembutan, musyawarah, dan keadilan.',
    },
    materials: [
      {
        term: 'Abu Bakar Ash-Shiddiq',
        arabicBadge: 'أبو بكر الصديق',
        meaning: 'Khalifah pertama yang teguh, jujur, membenarkan ajaran Rasulullah, dan berjiwa dermawan.',
        behavior: 'Berani membela kebenaran dan jujur dalam bertutur kata.',
      },
      {
        term: 'Umar bin Khattab (Al-Faruq)',
        arabicBadge: 'عمر بن الخطاب',
        meaning: 'Khalifah kedua yang pemberani, tegas membedakan hak dan batil, serta sangat adil dan merakyat.',
        behavior: 'Menegakkan aturan piket kelas dengan adil tanpa pilih kasih.',
      },
      {
        term: 'Utsman bin Affan (Dzun Nurain)',
        arabicBadge: 'عثمان بن عفان',
        meaning: 'Khalifah ketiga yang sangat santun, pemalu, dermawan mendanai Al-Qur\'an dan membeli sumur umat.',
        behavior: 'Suka berbagi bekal makanan dan merawat fasilitas sekolah.',
      },
      {
        term: 'Ali bin Abi Thalib (Babul \'Ilmi)',
        arabicBadge: 'علي بن أبي طالب',
        meaning: 'Khalifah keempat yang cerdas, pemberani sejak usia belia, dan luas ilmunya bagai pintu gerbang ilmu.',
        behavior: 'Gemar membaca buku dan bertanya ilmu dengan santun kepada guru.',
      },
    ],
    matchingPairs: [
      { leftText: 'Abu Bakar Ash-Shiddiq', leftArabic: 'الصديق', rightText: 'Khalifah yang Membenarkan Kebenaran dan Berhati Lembut' },
      { leftText: 'Umar bin Khattab', leftArabic: 'الفاروق', rightText: 'Khalifah yang Tegas Memisahkan Hak dari Kebatilan & Sangat Adil' },
      { leftText: 'Utsman bin Affan', leftArabic: 'ذو النورين', rightText: 'Khalifah yang Pemalu, Dermawan, dan Membukukan Mushaf Al-Qur\'an' },
      { leftText: 'Ali bin Abi Thalib', leftArabic: 'باب العلم', rightText: 'Khalifah yang Cerdas, Pemberani, dan Gerbang Ilmu Pengetahuan' },
    ],
    multipleChoice: [
      {
        question: 'Gelar "Al-Faruq" yang disandang oleh Khalifah Umar bin Khattab r.a. memiliki arti...',
        options: ['Pemilik dua cahaya', 'Pembeda antara yang benar (hak) dan yang salah (batil)', 'Pintu gerbang ilmu', 'Yang membenarkan'],
        correctAnswer: 1,
        explanation: 'Al-Faruq bermakna orang yang mampu memisahkan dan membedakan dengan tegas antara kebenaran dan kebatilan.',
      },
      {
        question: 'Keteladanan mulia yang ditunjukkan oleh Khalifah Utsman bin Affan r.a. yang patut kita tiru adalah...',
        options: [
          'Menimbun kekayaan untuk diri sendiri',
          'Sifat pemalu, dermawan menyumbang hartanya untuk kepentingan umat, dan lemah lembut',
          'Suka memamerkan pakaian mewah',
          'Enggan bergaul dengan orang miskin',
        ],
        correctAnswer: 1,
        explanation: 'Utsman bin Affan terkenal dengan sifat dermawan tanpa batas dan rasa malu yang sangat tinggi.',
      },
    ],
    reflectivePrompt: {
      question: 'Sifat kepemimpinan dari Khalifah siapa yang paling ingin kamu teladani saat kamu menjadi ketua kelompok belajar di kelas?',
      hint: 'Jelaskan apakah kejujuran Abu Bakar, keadilan Umar, kedermawanan Utsman, atau kecerdasan Ali.',
    },
    adabMissions: [
      { task: 'Menghargai pendapat teman saat musyawarah kelompok belajar di kelas', reflection: 'Meneladani prinsip syura Khulafaur Rasyidin' },
      { task: 'Bersikap adil dan tidak pilih kasih saat bermain bersama teman', reflection: 'Meneladani keadilan Khalifah Umar bin Khattab' },
      { task: 'Menyisihkan uang saku untuk membantu kawan yang sedang terkena musibah', reflection: 'Meneladani kedermawanan Khalifah Utsman bin Affan' },
    ],
  },
];

// ============================================================================
// EXTENDED CURRICULUM MATRIX (Mencakup Semua 5 Elemen untuk Seluruh Kelas 1-6 & Semester 1-2)
// Sesuai Standar Capaian Pembelajaran SK BSKAP No. 020/H/KR/2026
// ============================================================================
export const SD_CURRICULUM_EXTENDED_MATRIX: SDCurriculumTopic[] = [
  // --- KELAS 1 SD - SEMESTER 1 ---
  {
    id: 'mat-1-akhlak-s1',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Akhlak',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 3: Berperilaku Santun, Mengucap 3 Kata Ajaib, & Menghormati Orang Tua',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik terbiasa mempraktikkan nilai-nilai akhlak mulia dalam kehidupan sehari-hari, santun berbicara, menyayangi keluarga dan teman, serta menghormati orang tua dan guru.',
    tp: 'Membiasakan mengucap kata Maaf, Tolong, dan Terima Kasih serta bersikap santun saat berbicara kepada guru dan orang tua.',
    dalil: {
      surah: 'QS. Al-Baqarah : 83',
      arabic: 'وَقُولُوا لِلنَّاسِ حُسْنًا',
      translation: '“Dan bertutur katalah yang baik kepada manusia.”',
      note: 'Tadabbur: Bertutur kata lemah lembut adalah tanda anak shalih yang disayang Allah.',
    },
    materials: [
      { term: 'Kata Tolong', meaning: 'Diucapkan ketika memerlukan pertolongan teman atau guru.', behavior: 'Meminta tolong dengan sopan tanpa berteriak.' },
      { term: 'Kata Maaf', meaning: 'Diucapkan dengan tulus saat berbuat salah atau khilaf.', behavior: 'Segera meminta maaf jika tidak sengaja menjatuhkan pensil teman.' },
      { term: 'Terima Kasih', meaning: 'Ungkapan syukur dan terima kasih atas pertolongan orang lain.', behavior: 'Mengucap terima kasih kepada ibu yang membawakan bekal.' },
    ],
    matchingPairs: [
      { leftText: 'Membutuhkan bantuan', rightText: 'Ucapkan "Tolong"' },
      { leftText: 'Berbuat kesalahan', rightText: 'Ucapkan "Maaf"' },
      { leftText: 'Menerima kebaikan', rightText: 'Ucapkan "Terima Kasih"' },
      { leftText: 'Bertemu bapak/ibu guru', rightText: 'Ucapkan Salam & Senyum' },
    ],
    multipleChoice: [
      {
        question: 'Ketika tidak sengaja menginjak kaki teman saat berbaris, sikap kita yang benar adalah...',
        options: ['Pura-pura tidak tahu', 'Segera meminta maaf dengan tulus', 'Menertawakan teman', 'Menyalahkan teman'],
        correctAnswer: 1,
        explanation: 'Meminta maaf dengan segera adalah adab akhlak terpuji anak muslim.',
      },
    ],
    reflectivePrompt: {
      question: 'Apakah kamu sudah mengucap kata tolong dan terima kasih kepada orang tuamu hari ini?',
      hint: 'Tuliskan contoh perbuatan baik yang kamu lakukan di rumah.',
    },
    adabMissions: [
      { task: 'Mengucapkan terima kasih kepada orang tua setelah sarapan', reflection: 'Tanda anak shalih bersyukur' },
      { task: 'Menyapa guru dengan ucapan Assalamu\'alaikum dan senyuman', reflection: 'Menyebarkan kedamaian di sekolah' },
    ],
  },
  {
    id: 'mat-1-fikih-s1',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Fikih',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 4: Belajar Bersuci: Mengenal Tata Cara Istinja & Wudhu yang Benar',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mempraktikkan tata cara bersuci (istinja dan wudhu) secara tertib, mengenal rukun wudhu, serta membiasakan hidup bersih dan tertib dalam ibadah sehari-hari.',
    tp: 'Menyebutkan rukun wudhu secara berurutan dan mempraktikkan adab bersuci (istinja) dengan air bersih.',
    dalil: {
      surah: 'QS. Al-Ma\'idah : 6',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
      translation: '“Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku...”',
      note: 'Tadabbur: Kesucian badan adalah syarat sah shalat dan dicintai oleh Allah Swt.',
    },
    materials: [
      { term: 'Thaharah (Bersuci)', arabicBadge: 'الطَّهَارَةُ', meaning: 'Membersihkan badan dan pakaian dari kotoran dan najis.', behavior: 'Selalu mencuci tangan dengan sabun setelah buang air.' },
      { term: 'Wudhu', arabicBadge: 'الْوُضُوءُ', meaning: 'Bersuci menggunakan air bersih sebelum melaksanakan ibadah shalat.', behavior: 'Berwudhu dengan tertib tanpa membuang-buang air.' },
      { term: 'Istinja', meaning: 'Membersihkan kotoran setelah buang air kecil atau buang air besar.', behavior: 'Menggunakan air bersih dan tangan kiri saat istinja.' },
    ],
    matchingPairs: [
      { leftText: 'Membasuh Wajah', rightText: 'Rukun Wudhu setelah Niat' },
      { leftText: 'Membasuh Tangan', rightText: 'Sampai ke Siku Kanan & Kiri' },
      { leftText: 'Mengusap Kepala', rightText: 'Sebagian Rambut / Kepala' },
      { leftText: 'Membasuh Kaki', rightText: 'Sampai ke Mata Kaki' },
    ],
    multipleChoice: [
      {
        question: 'Sebelum shalat, seorang muslim wajib menyucikan diri dari hadas kecil dengan cara...',
        options: ['Tidur siang', 'Berwudhu', 'Makan kenyang', 'Bermain'],
        correctAnswer: 1,
        explanation: 'Berwudhu adalah cara bersuci dari hadas kecil untuk melaksanakan shalat.',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana perasaanmu setelah berwudhu dengan air yang sejuk dan bersih?',
      hint: 'Ceritakan kesegaran dan ketenangan saat berwudhu.',
    },
    adabMissions: [
      { task: 'Membaca doa sebelum masuk kamar mandi dengan mendahulukan kaki kiri', reflection: 'Meneladani sunnah Rasulullah' },
      { task: 'Menutup keran air wudhu agar tidak boros', reflection: 'Hemat air dan menjaga lingkungan' },
    ],
  },
  {
    id: 'mat-1-spi-s1',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Sejarah Peradaban Islam',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 5: Mengenal Kisah Nabi Adam a.s. Ciptaan Pertama Allah Swt.',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mampu menceritakan kisah singkat Nabi Adam a.s. sebagai manusia pertama dan khalifah fil ardh, serta meneladani sikap taubat dan kepatuhan kepada Allah Swt.',
    tp: 'Menceritakan secara sederhana kisah penciptaan Nabi Adam a.s. dan meneladani sikap segera bertaubat jika berbuat salah.',
    dalil: {
      surah: 'QS. Al-Baqarah : 30',
      arabic: 'إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً',
      translation: '“Sungguh, Aku hendak menjadikan khalifah (pemimpin/pemakmur) di bumi.”',
      note: 'Tadabbur: Manusia diciptakan Allah untuk menjaga dan memakmurkan bumi dengan kebaikan.',
    },
    materials: [
      { term: 'Nabi Adam a.s.', meaning: 'Manusia dan nabi pertama yang diciptakan oleh Allah Swt. dari tanah.', behavior: 'Menyadari bahwa kita semua bersaudara dari satu keturunan.' },
      { term: 'Taubat', meaning: 'Memohon ampun kepada Allah dan berjanji tidak mengulangi kesalahan.', behavior: 'Segera membaca istighfar saat melakukan kekeliruan.' },
      { term: 'Khalifah di Bumi', meaning: 'Pemimpin yang bertugas merawat alam dan ciptaan Allah.', behavior: 'Tidak memetik daun sembarangan dan menjaga kebersihan kelas.' },
    ],
    matchingPairs: [
      { leftText: 'Nabi Pertama', rightText: 'Nabi Adam \'Alaihissalam' },
      { leftText: 'Istri Nabi Adam', rightText: 'Siti Hawa' },
      { leftText: 'Tempat Awal Adam', rightText: 'Surga Penuh Kenikmatan' },
      { leftText: 'Tugas Manusia', rightText: 'Merawat Bumi dengan Damai' },
    ],
    multipleChoice: [
      {
        question: 'Nabi dan manusia pertama yang diciptakan oleh Allah Swt. adalah...',
        options: ['Nabi Nuh a.s.', 'Nabi Ibrahim a.s.', 'Nabi Adam a.s.', 'Nabi Isa a.s.'],
        correctAnswer: 2,
        explanation: 'Nabi Adam a.s. adalah bapak seluruh umat manusia (Abul Basyar).',
      },
    ],
    reflectivePrompt: {
      question: 'Apa yang kamu lakukan jika berbuat kesalahan seperti Nabi Adam yang segera memohon ampun?',
      hint: 'Tuliskan sikap meminta maaf dan berjanji jadi anak baik.',
    },
    adabMissions: [
      { task: 'Membaca doa istighfar Astaghfirullahal \'Azhim', reflection: 'Memohon ampunan Allah setiap hari' },
      { task: 'Menyayangi sesama teman karena kita semua bersaudara', reflection: 'Meneladani anak cucu Nabi Adam yang rukun' },
    ],
  },

  // --- KELAS 1 SD - SEMESTER 2 ---
  {
    id: 'mat-1-quran-s2',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Al-Qur\'an Hadis',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 6: Senangnya Melafalkan Surah Al-Fatihah & Al-Ikhlas dengan Tartil',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik melafalkan surah-surah pendek Al-Qur\'an (Al-Fatihah, Al-Ikhlas) dengan fasih dan berani, serta meyakini bahwa Allah Swt. adalah Tuhan Yang Maha Esa.',
    tp: 'Melafalkan Surah Al-Ikhlas ayat 1-4 secara tartil dan menjelaskan makna Allah Maha Esa.',
    dalil: {
      surah: 'QS. Al-Ikhlas : 1-4',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translation: '“Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat meminta. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.”',
      note: 'Tadabbur: Kita hanya menyembah Allah dan hanya memohon pertolongan kepada-Nya.',
    },
    materials: [
      { term: 'Al-Ahad (Maha Esa)', meaning: 'Allah itu tunggal, tidak ada sekutu atau tandingan bagi-Nya.', behavior: 'Tidak takut pada hal-hal mistis karena Allah Maha Kuasa.' },
      { term: 'Ash-Shamad', meaning: 'Allah adalah tempat bergantung dan memohon segala hajat.', behavior: 'Selalu berdoa kepada Allah sebelum belajar dan tidur.' },
      { term: 'Tartil', meaning: 'Membaca Al-Qur\'an dengan perlahan, jelas hurufnya, dan benar harakatnya.', behavior: 'Mengaji setiap sore di TPA/rumah dengan tekun.' },
    ],
    matchingPairs: [
      { leftText: 'Qul Huwallahu Ahad', rightText: 'Katakanlah: Dialah Allah Yang Maha Esa' },
      { leftText: 'Allahush Shamad', rightText: 'Allah Tempat Meminta Segala Sesuatu' },
      { leftText: 'Surah Al-Ikhlas', rightText: 'Terdiri atas 4 Ayat Mulia' },
      { leftText: 'Tauhid', rightText: 'Mengesakan Allah Swt.' },
    ],
    multipleChoice: [
      {
        question: 'Arti dari lafal "Al-Ahad" dalam Surah Al-Ikhlas adalah...',
        options: ['Maha Pengasih', 'Maha Esa (Satu)', 'Maha Melihat', 'Maha Mengetahui'],
        correctAnswer: 1,
        explanation: 'Al-Ahad berarti Allah itu Maha Esa dan tiada tandingan bagi-Nya.',
      },
    ],
    reflectivePrompt: {
      question: 'Kapan kamu biasanya membaca Surah Al-Ikhlas?',
      hint: 'Apakah saat shalat, sebelum tidur malam, atau saat belajar mengaji?',
    },
    adabMissions: [
      { task: 'Membaca Surah Al-Ikhlas 3 kali sebelum tidur malam', reflection: 'Mendapat pahala sepertiga Al-Qur\'an' },
      { task: 'Mendengarkan tilawah Al-Qur\'an dengan tenang dan tidak bercanda', reflection: 'Menghormati firman Allah Swt.' },
    ],
  },
  {
    id: 'mat-1-akidah-s2',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Akidah',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 7: Mengenal Asmaul Husna: Ar-Rahman, Ar-Rahim, & Al-Khaliq',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mengenal Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Khaliq) melalui pengamatan ciptaan-Nya di alam semesta, serta meneladani sifat kasih sayang dalam pergaulan.',
    tp: 'Menyebutkan arti Ar-Rahman, Ar-Rahim, dan Al-Khaliq serta menunjukkan contoh perilaku kasih sayang kepada teman.',
    dalil: {
      surah: 'QS. Al-An\'am : 102',
      arabic: 'ذَٰلِكُمُ اللَّهُ رَبُّكُمْ ۖ لَا إِلَٰهَ إِلَّا هُوَ ۖ خَالِقُ كُلِّ شَيْءٍ فَاعْبُدُوهُ',
      translation: '“Itulah Allah, Tuhan kamu; tidak ada tuhan selain Dia; Pencipta segala sesuatu, maka sembahlah Dia...”',
      note: 'Tadabbur: Allah menciptakan matahari, air, dan pepohonan dengan penuh kasih sayang untuk kita.',
    },
    materials: [
      { term: 'Ar-Rahman', meaning: 'Allah Maha Pengasih kepada seluruh makhluk di alam semesta.', behavior: 'Menyayangi binatang peliharaan dan tidak menyakitinya.' },
      { term: 'Ar-Rahim', meaning: 'Allah Maha Penyayang khusus kepada hamba-hamba-Nya yang beriman.', behavior: 'Suka menolong teman yang kesusahan dan berbagi mainan.' },
      { term: 'Al-Khaliq', meaning: 'Allah Maha Pencipta segala sesuatu yang ada di langit dan bumi.', behavior: 'Mengagumi keindahan alam ciptaan Allah dengan berucap Subhanallah.' },
    ],
    matchingPairs: [
      { leftText: 'Ar-Rahman', rightText: 'Maha Pengasih kepada Semua Makhluk' },
      { leftText: 'Ar-Rahim', rightText: 'Maha Penyayang kepada Orang Beriman' },
      { leftText: 'Al-Khaliq', rightText: 'Maha Pencipta Alam Semesta' },
      { leftText: 'Subhanallah', rightText: 'Maha Suci Allah atas Ciptaan-Nya' },
    ],
    multipleChoice: [
      {
        question: 'Asmaul Husna "Al-Khaliq" memiliki arti bahwa Allah adalah...',
        options: ['Maha Raja', 'Maha Pencipta', 'Maha Adil', 'Maha Pemaaf'],
        correctAnswer: 1,
        explanation: 'Al-Khaliq artinya Maha Pencipta seluruh alam semesta.',
      },
    ],
    reflectivePrompt: {
      question: 'Ciptaan Allah apa saja di sekitarmu yang membuatmu kagum dan bersyukur?',
      hint: 'Sebutkan seperti pelangi, burung, tanaman bunga, atau udara segar.',
    },
    adabMissions: [
      { task: 'Menyiram tanaman bunga di halaman rumah atau sekolah', reflection: 'Menyayangi makhluk ciptaan Al-Khaliq' },
      { task: 'Memberi makan kucing atau burung dengan penuh kasih sayang', reflection: 'Meneladani sifat Ar-Rahman' },
    ],
  },
  {
    id: 'mat-1-fikih-s2',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Fikih',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 9: Mengenal Shalat Fardhu 5 Waktu & Waktu Pelaksanaannya',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mengenal shalat fardhu lima waktu, jumlah rakaatnya, dan waktu pelaksanaannya, serta membiasakan diri mengikuti shalat bersama keluarga.',
    tp: 'Menyebutkan nama-nama shalat fardhu lima waktu beserta jumlah rakaatnya secara tepat.',
    dalil: {
      surah: 'QS. Al-Baqarah : 43',
      arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
      translation: '“Dan laksanakanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.”',
      note: 'Tadabbur: Shalat adalah tiang agama dan bentuk rasa cinta kita kepada Allah Swt.',
    },
    materials: [
      { term: 'Shalat Subuh', meaning: '2 rakaat dilaksanakan pada waktu fajar sebelum terbit matahari.', behavior: 'Bangun pagi dan shalat Subuh berjamaah bersama ayah ibu.' },
      { term: 'Shalat Dzuhur & Ashar', meaning: 'Masing-masing 4 rakaat dilaksanakan siang dan sore hari.', behavior: 'Segera berwudhu ketika mendengar azan berkumandang.' },
      { term: 'Shalat Maghrib & Isya', meaning: 'Maghrib 3 rakaat dan Isya 4 rakaat pada malam hari.', behavior: 'Merapikan sajadah dan peci setelah shalat.' },
    ],
    matchingPairs: [
      { leftText: 'Subuh', rightText: '2 Rakaat di Waktu Fajar' },
      { leftText: 'Dzuhur & Ashar', rightText: 'Masing-masing 4 Rakaat' },
      { leftText: 'Maghrib', rightText: '3 Rakaat saat Matahari Terbenam' },
      { leftText: 'Isya', rightText: '4 Rakaat di Awal Malam' },
    ],
    multipleChoice: [
      {
        question: 'Berapa jumlah rakaat shalat fardhu dalam sehari semalam?',
        options: ['10 Rakaat', '15 Rakaat', '17 Rakaat', '20 Rakaat'],
        correctAnswer: 2,
        explanation: 'Total rakaat 5 shalat fardhu: Subuh (2) + Dzuhur (4) + Ashar (4) + Maghrib (3) + Isya (4) = 17 rakaat.',
      },
    ],
    reflectivePrompt: {
      question: 'Shalat fardhu apa saja yang berhasil kamu kerjakan tepat waktu kemarin?',
      hint: 'Tuliskan pengalamanmu shalat di rumah atau di mushalla.',
    },
    adabMissions: [
      { task: 'Menjawab azan dengan khusyuk dan tidak mengobrol saat azan berkumandang', reflection: 'Menghormati panggilan shalat' },
      { task: 'Belajar memakai pakaian shalat yang bersih dan wangi', reflection: 'Menjaga adab menghadap Allah' },
    ],
  },
  {
    id: 'mat-1-spi-s2',
    grade: 'Kelas 1 SD',
    gradeLevel: 1,
    fase: 'Fase A',
    element: 'Sejarah Peradaban Islam',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 10: Kisah Teladan Masa Kanak-kanak Nabi Muhammad saw. yang Jujur',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mampu menceritakan kisah masa kanak-kanak Nabi Muhammad saw., sifat Al-Amin (terpercaya), dan meneladani kejujuran serta kemandirian beliau sejak kecil.',
    tp: 'Menceritakan kembali gelar Al-Amin yang dimiliki Nabi Muhammad saw. dan mempraktikkan sikap jujur saat bermain di sekolah.',
    dalil: {
      surah: 'QS. Al-Ahzab : 21',
      arabic: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ',
      translation: '“Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu...”',
      note: 'Tadabbur: Nabi Muhammad saw. sejak kecil terkenal mandiri, rajin menggembala domba, dan tidak pernah berbohong.',
    },
    materials: [
      { term: 'Nabi Muhammad saw.', meaning: 'Nabi dan rasul terakhir panutan seluruh umat Islam sepanjang zaman.', behavior: 'Menjadikan Rasulullah sebagai idola dan meniru akhlak beliau.' },
      { term: 'Gelar Al-Amin', meaning: 'Artinya orang yang sangat terpercaya dan jujur perkataannya.', behavior: 'Mengembalikan barang temuan kepada pemiliknya.' },
      { term: 'Kemandirian Beliau', meaning: 'Rajin membantu kakek dan pamannya menggembalakan domba.', behavior: 'Merapikan mainan dan sepatu sendiri tanpa disuruh orang tua.' },
    ],
    matchingPairs: [
      { leftText: 'Nabi Terakhir', rightText: 'Nabi Muhammad Shallallahu \'Alaihi Wasallam' },
      { leftText: 'Gelar Kejujuran', rightText: 'Al-Amin (Yang Terpercaya)' },
      { leftText: 'Pekerjaan Masa Kecil', rightText: 'Menggembala Domba dengan Sabar' },
      { leftText: 'Ibu Susu Beliau', rightText: 'Halimah As-Sa\'diyah' },
    ],
    multipleChoice: [
      {
        question: 'Gelar "Al-Amin" yang diberikan masyarakat Mekah kepada Nabi Muhammad saw. bermakna...',
        options: ['Orang yang kaya raya', 'Orang yang terpercaya dan jujur', 'Pemberani di medan perang', 'Pemimpin yang gagah'],
        correctAnswer: 1,
        explanation: 'Al-Amin bermakna terpercaya karena kejujuran beliau yang luar biasa.',
      },
    ],
    reflectivePrompt: {
      question: 'Mengapa kita harus selalu berkata jujur seperti keteladanan Nabi Muhammad saw.?',
      hint: 'Kaitkan dengan rasa dipercaya oleh teman, guru, dan orang tua.',
    },
    adabMissions: [
      { task: 'Mengucapkan shalawat Nabi saat mendengar nama Rasulullah disebut', reflection: 'Tanda cinta kepada nabi kita' },
      { task: 'Berkata jujur saat ulangan dan bermain bersama teman', reflection: 'Meneladani sifat mulia Al-Amin' },
    ],
  },

  // --- KELAS 2 SD - SEMESTER 1 ---
  {
    id: 'mat-2-quran-s1',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Al-Qur\'an Hadis',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 1: Asyiknya Belajar dan Membaca Surah An-Nas & Al-Falaq',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik melafalkan surah-surah pendek Al-Qur\'an (An-Nas, Al-Falaq) dengan fasih dan berani, serta memahami arti penting memohon perlindungan hanya kepada Allah Swt.',
    tp: 'Membaca Surah Al-Falaq ayat 1-5 dengan makharijul huruf yang tepat dan menyebutkan pesan memohon perlindungan dari kejahatan.',
    dalil: {
      surah: 'QS. Al-Falaq : 1-2',
      arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ',
      translation: '“Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk yang Dia ciptakan...”',
      note: 'Tadabbur: Kita memohon perlindungan dari bisikan rasa dengki, takut gelap, dan segala marabahaya.',
    },
    materials: [
      { term: 'Al-Falaq (Waktu Subuh)', meaning: 'Surah ke-113 yang berisi permohonan perlindungan kepada Allah Sang Penguasa fajar.', behavior: 'Membaca surah Al-Falaq saat rasa takut datang.' },
      { term: 'Isti\'adzah', meaning: 'Permohonan perlindungan diri dari segala godaan dan marabahaya.', behavior: 'Membaca Ta\'awudz sebelum memulai mengaji Al-Qur\'an.' },
      { term: 'Menjauhi Iri Dengki', meaning: 'Tidak boleh dengki atau cemburu melihat teman mendapat mainan baru.', behavior: 'Ikut senang dan mengucap Masya Allah saat kawan berprestasi.' },
    ],
    matchingPairs: [
      { leftText: 'Qul A\'udzu bi Rabbil Falaq', rightText: 'Aku Berlindung kepada Tuhan Pemilik Subuh' },
      { leftText: 'Min Syarri Ma Khalaq', rightText: 'Dari Kejahatan Makhluk yang Diciptakan-Nya' },
      { leftText: 'Al-Mu\'awwidzatain', rightText: 'Surah Al-Falaq dan Surah An-Nas' },
      { leftText: 'Sifat Dengki', rightText: 'Penyakit Hati yang Harus Dijauhi' },
    ],
    multipleChoice: [
      {
        question: 'Surah Al-Falaq mengajarkan kita untuk memohon perlindungan hanya kepada...',
        options: ['Benda keramat', 'Pohon besar', 'Allah Subhanahu wa Ta\'ala', 'Manusia sakti'],
        correctAnswer: 2,
        explanation: 'Hanya Allah Swt. Yang Maha Kuasa melindungi hamba-Nya dari segala marabahaya.',
      },
    ],
    reflectivePrompt: {
      question: 'Kapan kamu membaca Surah Al-Falaq dan An-Nas untuk menenangkan hatimu?',
      hint: 'Ceritakan bagaimana doa membuat hatimu merasa aman dan berani.',
    },
    adabMissions: [
      { task: 'Membaca Surah Al-Falaq dan An-Nas sebelum berangkat ke sekolah', reflection: 'Memohon perlindungan sepanjang jalan' },
      { task: 'Menghilangkan rasa iri dengan mendoakan kebaikan bagi teman', reflection: 'Menjaga kebersihan hati dari dengki' },
    ],
  },
  {
    id: 'mat-2-akidah-s1',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Akidah',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 2: Mengenal 10 Malaikat Allah Swt. dan Tugas-Tugas Mulianya',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mengenal Rukun Iman kepada Malaikat Allah Swt., menyebutkan nama dan tugas sepuluh malaikat, serta meyakini bahwa amal perbuatan manusia selalu diawasi.',
    tp: 'Menyebutkan nama 10 malaikat dan tugasnya serta membiasakan sikap disiplin karena merasa selalu diawasi oleh malaikat Raqib dan Atid.',
    dalil: {
      surah: 'QS. Al-Anbiya : 19-20',
      arabic: 'وَلَهُ مَن فِي السَّمَاوَاتِ وَالْأَرْضِ ۚ وَمَنْ عِندَهُ لَا يَسْتَكْبِرُونَ عَنْ عِبَادَتِهِ وَلَا يَسْتَحْسِرُونَ ۝ يُسَبِّحُونَ اللَّيْلَ وَالنَّهَارَ لَا يَفْتُرُونَ',
      translation: '“Dan milik-Nya siapa yang di langit dan di bumi. Dan (malaikat-malaikat) yang di sisi-Nya, tidak mempunyai rasa angkuh untuk menyembah-Nya... Mereka senantiasa bertasbih malam dan siang...”',
      note: 'Tadabbur: Malaikat adalah makhluk taat ciptaan Allah dari cahaya (nur) yang selalu patuh menjalankan tugas.',
    },
    materials: [
      { term: 'Malaikat Jibril', meaning: 'Malaikat yang bertugas menyampaikan wahyu kepada nabi dan rasul.', behavior: 'Mencintai Al-Qur\'an yang dibawa oleh Malaikat Jibril.' },
      { term: 'Malaikat Mikail', meaning: 'Malaikat yang bertugas membagikan rezeki dan menurunkan air hujan.', behavior: 'Bersyukur atas rezeki makanan sehat setiap hari.' },
      { term: 'Raqib & Atid', meaning: 'Malaikat pencatat amal kebaikan dan amal keburukan manusia.', behavior: 'Takut berbohong karena ada malaikat yang mencatat amal.' },
    ],
    matchingPairs: [
      { leftText: 'Malaikat Jibril', rightText: 'Menyampaikan Wahyu Ilahi' },
      { leftText: 'Malaikat Mikail', rightText: 'Membagikan Rezeki & Hujan' },
      { leftText: 'Malaikat Raqib', rightText: 'Mencatat Amal Kebaikan' },
      { leftText: 'Malaikat Atid', rightText: 'Mencatat Amal Keburukan' },
    ],
    multipleChoice: [
      {
        question: 'Malaikat yang bertugas mencatat segala amal perbuatan baik yang kita kerjakan adalah...',
        options: ['Malaikat Israfil', 'Malaikat Raqib', 'Malaikat Malik', 'Malaikat Ridwan'],
        correctAnswer: 1,
        explanation: 'Malaikat Raqib mencatat amal baik, sedangkan Malaikat Atid mencatat amal buruk.',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana perasaanmu mengetahui malaikat Raqib dan Atid selalu mencatat amal perbuatanmu?',
      hint: 'Jelaskan mengapa hal itu membuatmu semakin rajin berbuat baik.',
    },
    adabMissions: [
      { task: 'Menjaga lisan dari kata-kata kotor agar dicatat baik oleh malaikat', reflection: 'Merasa diawasi oleh Allah dan malaikat' },
      { task: 'Menghafal nama 10 malaikat melalui senandung lagu edukasi islami', reflection: 'Memperkuat hafalan rukun iman kedua' },
    ],
  },
  {
    id: 'mat-2-akhlak-s1',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Akhlak',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 3: Membiasakan Perilaku Jujur (Shiddiq) dalam Berbicara dan Bermain',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik membiasakan perilaku jujur (shiddiq) dan adil dalam kehidupan sehari-hari, berani mengakui kesalahan, serta menjauhi perilaku dusta.',
    tp: 'Menunjukkan contoh perilaku jujur saat mengerjakan tugas mandiri dan berani mengatakan hal yang sebenarnya.',
    dalil: {
      surah: 'QS. At-Taubah : 119',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ',
      translation: '“Wahai orang-orang yang beriman! Bertakwalah kepada Allah, dan bersamalah kamu dengan orang-orang yang benar (jujur).”',
      note: 'Tadabbur: Kejujuran membawa ketenangan dan membimbing pelakunya menuju surga.',
    },
    materials: [
      { term: 'Shiddiq (Jujur)', arabicBadge: 'الصِّدْقُ', meaning: 'Kesesuaian antara ucapan dan perbuatan yang sebenarnya.', behavior: 'Tidak menyontek saat ulangan dan mengakui jika lupa membawa buku.' },
      { term: 'Amanah', meaning: 'Dapat dipercaya memegang pesan, tugas, dan barang titipan.', behavior: 'Menjaga uang infak kelas dan menyampaikannya kepada guru.' },
      { term: 'Menjauhi Dusta', meaning: 'Tidak berbicara bohong atau mengarang cerita palsu.', behavior: 'Selalu menceritakan fakta yang sebenarnya dengan sopan.' },
    ],
    matchingPairs: [
      { leftText: 'Sikap Shiddiq', rightText: 'Berkata Benar dan Tidak Curang' },
      { leftText: 'Sikap Amanah', rightText: 'Dapat Dipercaya Memegang Tanggung Jawab' },
      { leftText: 'Menyontek Ulangan', rightText: 'Perilaku Tercela yang Merugikan Diri' },
      { leftText: 'Mengakui Kesalahan', rightText: 'Ciri Anak Berani dan Bertanggung Jawab' },
    ],
    multipleChoice: [
      {
        question: 'Ketika Ananda menemukan pensil warna terjatuh di lantai kelas, tindakan yang paling jujur adalah...',
        options: ['Memasukkannya ke dalam tas sendiri', 'Menyerahkannya kepada bapak/ibu guru untuk diumumkan', 'Membuangnya ke tempat sampah', 'Menyembunyikannya di laci'],
        correctAnswer: 1,
        explanation: 'Menyerahkan barang temuan kepada guru adalah perwujudan sifat jujur dan amanah.',
      },
    ],
    reflectivePrompt: {
      question: 'Pernahkah kamu berani berkata jujur meskipun kamu merasa malu atau takut?',
      hint: 'Ceritakan bagaimana kejujuran tersebut akhirnya membuat hatimu lega.',
    },
    adabMissions: [
      { task: 'Mengerjakan tugas lembar kerja mandiri tanpa menyontek pekerjaan teman', reflection: 'Melatih integritas sejak dini' },
      { task: 'Segera mengembalikan penghapus atau penggaris yang dipinjam dari teman', reflection: 'Menjaga amanah pertemanan' },
    ],
  },
  {
    id: 'mat-2-spi-s1',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Sejarah Peradaban Islam',
    semester: 'Semester 1 (Ganjil)',
    chapterTitle: 'Bab 5: Kisah Ketabahan Nabi Nuh a.s. Membangun Bahtera Penyelamat',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mampu menceritakan kisah ketabahan Nabi Nuh a.s. dalam berdakwah, kepatuhan membuat bahtera atas perintah Allah, dan meneladani sifat pantang menyerah.',
    tp: 'Menceritakan secara runtut kisah Nabi Nuh a.s. membuat bahtera dan meneladani sikap sabar menghadapi ejekan kawan.',
    dalil: {
      surah: 'QS. Hud : 41',
      arabic: 'وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ',
      translation: '“Dan dia berkata: Naiklah kamu semua ke dalamnya dengan menyebut nama Allah pada waktu berlayar dan berlabuhnya. Sungguh, Tuhanku Maha Pengampun, Maha Penyayang.”',
      note: 'Tadabbur: Kesabaran dan ketaatan kepada Allah akan selalu mendatangkan pertolongan dan keselamatan.',
    },
    materials: [
      { term: 'Nabi Nuh a.s.', meaning: 'Salah satu Rasul Ulul \'Azmi yang luar biasa sabar berdakwah ratusan tahun.', behavior: 'Tidak mudah menyerah saat belajar hal yang baru dan sulit.' },
      { term: 'Bahtera Nuh', meaning: 'Kapal besar yang dibuat atas wahyu Allah untuk menyelamatkan kaum beriman dan hewan-hewan.', behavior: 'Patuh dan taat menjalankan instruksi guru dan orang tua.' },
      { term: 'Ketabahan Hati', meaning: 'Tetap teguh berbuat baik meskipun diejek oleh orang-orang yang ingkar.', behavior: 'Tetap tersenyum dan fokus berbuat baik meski ada yang menggoda.' },
    ],
    matchingPairs: [
      { leftText: 'Rasul Ulul \'Azmi', rightText: 'Nabi Nuh \'Alaihissalam' },
      { leftText: 'Bahtera Besar', rightText: 'Kapal Penyelamat Kaum Beriman' },
      { leftText: 'Anak yang Ingkar', rightText: 'Kan\'an yang Tidak Mau Naik Kapal' },
      { leftText: 'Sikap Nabi Nuh', rightText: 'Sabar dan Pantang Menyerah' },
    ],
    multipleChoice: [
      {
        question: 'Sifat terpuji dari Nabi Nuh a.s. yang patut kita teladani saat menghadapi kesulitan adalah...',
        options: ['Suka mengeluh dan marah', 'Sabar, tabah, dan pantang menyerah', 'Cepat putus asa', 'Membalas kejahatan dengan kekerasan'],
        correctAnswer: 1,
        explanation: 'Nabi Nuh a.s. sangat terkenal dengan ketabahan dan kesabarannya yang luar biasa.',
      },
    ],
    reflectivePrompt: {
      question: 'Apa yang akan kamu lakukan jika tugas sekolah terasa sulit? Apakah kamu bersabar seperti Nabi Nuh?',
      hint: 'Tuliskan komitmen untuk terus mencoba sampai bisa.',
    },
    adabMissions: [
      { task: 'Membaca Bismillah setiap kali naik kendaraan roda dua atau empat', reflection: 'Meneladani doa Nabi Nuh saat naik bahtera' },
      { task: 'Membantu teman yang lambat memahami pelajaran tanpa mengejeknya', reflection: 'Menunjukkan kasih sayang antarsesama' },
    ],
  },

  // --- KELAS 2 SD - SEMESTER 2 ---
  {
    id: 'mat-2-akidah-s2',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Akidah',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 7: Meneladani Asmaul Husna Al-Khaliq (Allah Maha Pencipta Semesta)',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mengenal Asmaul Husna Al-Khaliq dan Al-Quddus, mengagumi keteraturan alam semesta, serta membiasakan menjaga kebersihan diri dan lingkungan.',
    tp: 'Menjelaskan bukti-bukti ciptaan Al-Khaliq di bumi dan membuat daftar karya menjaga kelestarian alam.',
    dalil: {
      surah: 'QS. Al-Hasyr : 24',
      arabic: 'هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ',
      translation: '“Dialah Allah Yang Menciptakan, Yang Mengadakan, Yang Membentuk Rupa, Dia memiliki nama-nama yang indah...”',
      note: 'Tadabbur: Allah menciptakan tubuh kita dengan sangat sempurna, maka rawatlah dengan makanan halal dan bersih.',
    },
    materials: [
      { term: 'Al-Khaliq', meaning: 'Allah Maha Pencipta dari yang tiada menjadi ada.', behavior: 'Mengucap Masya Allah saat melihat pemandangan alam yang indah.' },
      { term: 'Al-Quddus', meaning: 'Allah Maha Suci dari segala kekurangan dan cela.', behavior: 'Menjaga kebersihan pakaian shalat dan lisan dari perkataan kotor.' },
      { term: 'Merawat Ciptaan', meaning: 'Kewajiban manusia memelihara hewan dan tumbuhan sekitar.', behavior: 'Tidak membuang bungkus snack sembarangan di selokan sekolah.' },
    ],
    matchingPairs: [
      { leftText: 'Al-Khaliq', rightText: 'Maha Menciptakan Seluruh Makhluk' },
      { leftText: 'Al-Quddus', rightText: 'Maha Suci dari Segala Kekurangan' },
      { leftText: 'Bukti Al-Khaliq', rightText: 'Peredaran Matahari, Bulan, & Bintang' },
      { leftText: 'Adab Al-Quddus', rightText: 'Menjaga Kesucian Badan dan Tempat Ibadah' },
    ],
    multipleChoice: [
      {
        question: 'Sebagai wujud syukur atas nikmat mata dan telinga yang diciptakan oleh Al-Khaliq, kita harus menggunakannya untuk...',
        options: ['Melihat hal buruk dan mendengar gosip', 'Melihat kebaikan dan mendengarkan nasihat guru', 'Bermain gadget seharian', 'Menonton video yang tidak pantas'],
        correctAnswer: 1,
        explanation: 'Indera tubuh kita adalah amanah dari Allah yang harus digunakan untuk hal-hal yang diridhai-Nya.',
      },
    ],
    reflectivePrompt: {
      question: 'Bagaimana caramu menjaga kebersihan badan dan kerapian pakaian agar mencerminkan sifat Al-Quddus?',
      hint: 'Sebutkan kegiatan mandi teratur, potong kuku, dan wudhu.',
    },
    adabMissions: [
      { task: 'Membuang sampah pada tempatnya di area sekolah', reflection: 'Menjaga kebersihan ciptaan Al-Khaliq' },
      { task: 'Memotong kuku tangan dan kaki setiap hari Jumat', reflection: 'Meneladani kesucian sunnah Rasulullah' },
    ],
  },
  {
    id: 'mat-2-akhlak-s2',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Akhlak',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 8: Sikap Santun, Menyayangi Hewan, dan Merawat Tanaman Sekitar',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mempraktikkan sikap kasih sayang kepada sesama makhluk hidup (hewan dan tumbuhan), merawat lingkungan sekitar, serta menjauhi perbuatan merusak alam.',
    tp: 'Mendemonstrasikan cara menyayangi binatang dan merawat tanaman di lingkungan rumah atau sekolah.',
    dalil: {
      surah: 'QS. Al-Anbiya : 107',
      arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
      translation: '“Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam.”',
      note: 'Tadabbur: Islam adalah agama pembawa kasih sayang tidak hanya untuk manusia, tapi juga untuk hewan dan alam.',
    },
    materials: [
      { term: 'Rahmatan lil \'Alamin', meaning: 'Islam sebagai pembawa rahmat dan kasih sayang untuk seluruh semesta.', behavior: 'Berbuat baik kepada semua makhluk hidup tanpa kecuali.' },
      { term: 'Menyayangi Hewan', meaning: 'Memberi makan minum hewan peliharaan dan tidak menyiksanya.', behavior: 'Memberi sisa makanan yang layak kepada kucing jalanan.' },
      { term: 'Merawat Tanaman', meaning: 'Menyiram bunga dan menanam bibit pohon agar lingkungan asri.', behavior: 'Menjaga tanaman hias di teras kelas agar tidak layu.' },
    ],
    matchingPairs: [
      { leftText: 'Rahmatan lil \'Alamin', rightText: 'Rahmat Kasih Sayang bagi Semesta Alam' },
      { leftText: 'Kucing Peliharaan', rightText: 'Diberi Makan dan Disayangi' },
      { leftText: 'Tanaman Sekolah', rightText: 'Disiram Teratur dan Dirawat' },
      { leftText: 'Merusak Pohon', rightText: 'Perbuatan Buruk yang Dilarang Agama' },
    ],
    multipleChoice: [
      {
        question: 'Kisah sahabat Rasulullah saw. Abu Hurairah mengajarkan kita untuk...',
        options: ['Mengurung hewan tanpa makan', 'Menyayangi anak kucing dengan penuh kelembutan', 'Memukul hewan yang lewat', 'Menakut-nakuti burung'],
        correctAnswer: 1,
        explanation: 'Abu Hurairah dijuluki "Bapak Kucing Kecil" karena kecintaan dan kasih sayangnya pada anak kucing.',
      },
    ],
    reflectivePrompt: {
      question: 'Ceritakan pengalamanmu saat merawat hewan peliharaan atau menyiram tanaman di rumah!',
      hint: 'Tuliskan rasa senang saat melihat tanaman bertumbuh subur.',
    },
    adabMissions: [
      { task: 'Menaruh wadah air minum untuk burung atau kucing di luar rumah', reflection: 'Sedekah kepada makhluk bernyawa' },
      { task: 'Menjaga tanaman di taman sekolah agar tidak terinjak saat bermain', reflection: 'Menjaga keasrian bumi Allah' },
    ],
  },
  {
    id: 'mat-2-fikih-s2',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Fikih',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 9: Mempraktikkan Urutan Gerakan dan Bacaan Shalat Fardhu',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mempraktikkan urutan gerakan shalat fardhu secara tertib, melafalkan takbiratul ihram hingga salam, serta terbiasa shalat dengan tuma\'ninah.',
    tp: 'Mempraktikkan gerakan takbir, ruku\', i\'tidal, sujud, dan duduk tasyahud secara benar dan tuma\'ninah.',
    dalil: {
      surah: 'QS. Al-Baqarah : 110',
      arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ ۚ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ',
      translation: '“Dan laksanakanlah shalat dan tunaikanlah zakat. Dan segala kebaikan yang kamu kerjakan untuk dirimu, kamu akan mendapatkannya di sisi Allah...”',
      note: 'Tadabbur: Gerakan shalat yang tertib menyehatkan raga dan menenteramkan jiwa yang beriman.',
    },
    materials: [
      { term: 'Takbiratul Ihram', meaning: 'Mengangkat kedua tangan sejajar telinga sambil mengucap Allahu Akbar.', behavior: 'Fokus dan niat ikhlas menghadap Allah Swt.' },
      { term: 'Ruku\' & Sujud', meaning: 'Membungkukkan badan dan meletakkan dahi di atas sajadah.', behavior: 'Membaca doa ruku\' dan sujud dengan khusyuk.' },
      { term: 'Tuma\'ninah', meaning: 'Berhenti sejenak dengan tenang pada setiap perpindahan gerakan shalat.', behavior: 'Tidak terburu-buru saat shalat seperti ayam mematuk.' },
    ],
    matchingPairs: [
      { leftText: 'Takbir Awal Shalat', rightText: 'Takbiratul Ihram' },
      { leftText: 'Posisi Dahi di Sajadah', rightText: 'Sujud dengan 7 Anggota Tubuh' },
      { leftText: 'Duduk Akhir Shalat', rightText: 'Tasyahud Akhir' },
      { leftText: 'Penutup Shalat', rightText: 'Mengucap Salam ke Kanan & Kiri' },
    ],
    multipleChoice: [
      {
        question: 'Sikap tenang dan berhenti sejenak dalam setiap gerakan shalat disebut...',
        options: ['Istiqamah', 'Tuma\'ninah', 'Tadabbur', 'Munajat'],
        correctAnswer: 1,
        explanation: 'Tuma\'ninah adalah syarat sah shalat yaitu tenang sejenak saat ruku, sujud, dan iktidal.',
      },
    ],
    reflectivePrompt: {
      question: 'Apakah kamu sudah mempraktikkan gerakan shalat dengan tenang dan tidak tergesa-gesa?',
      hint: 'Jelaskan mengapa shalat yang tenang terasa lebih damai.',
    },
    adabMissions: [
      { task: 'Merapikan shaf sajadah saat shalat berjamaah bersama keluarga', reflection: 'Menyempurnakan keutamaan shalat jamaah' },
      { task: 'Membaca doa tasyahud dengan suara perlahan dan khusyuk', reflection: 'Menghadirkan rasa hormat kepada Allah' },
    ],
  },
  {
    id: 'mat-2-spi-s2',
    grade: 'Kelas 2 SD',
    gradeLevel: 2,
    fase: 'Fase A',
    element: 'Sejarah Peradaban Islam',
    semester: 'Semester 2 (Genap)',
    chapterTitle: 'Bab 10: Kisah Perjuangan dan Keteguhan Hati Nabi Ibrahim a.s.',
    cp020: 'CP No. 020/2026 - Fase A: Peserta didik mampu menceritakan kisah keteguhan Nabi Ibrahim a.s. dalam mencari kebenaran Tuhan, keberanian menolak berhala, dan meneladani ketaatan beliau kepada Allah Swt.',
    tp: 'Menceritakan secara singkat keteladanan Nabi Ibrahim a.s. saat mencari Tuhan dan membiasakan berpikir kritis bernalar sehat.',
    dalil: {
      surah: 'QS. Al-An\'am : 79',
      arabic: 'إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا ۖ وَمَا أَنَا مِنَ الْمُشْرِكِينَ',
      translation: '“Aku hadapkan wajahku kepada (Allah) yang menciptakan langit dan bumi dengan penuh kepatuhan, dan aku bukanlah termasuk orang-orang musyrik.”',
      note: 'Tadabbur: Nabi Ibrahim a.s. menggunakan akal sehatnya mengamati bintang dan matahari untuk meyakini keesaan Allah.',
    },
    materials: [
      { term: 'Khalilullah', meaning: 'Gelar kehormatan Nabi Ibrahim a.s. yang bermakna Sahabat Kekasih Allah.', behavior: 'Selalu mendekatkan diri kepada Allah dengan doa dan ketaatan.' },
      { term: 'Akal Sehat & Bernalar', meaning: 'Mengamati alam semesta untuk menyimpulkan bahwa alam ini ada penciptanya.', behavior: 'Suka bertanya hal-hal yang bermanfaat tentang kebesaran Allah.' },
      { term: 'Keteguhan Iman', meaning: 'Tidak goyah dalam iman meskipun diancam oleh Raja Namrud.', behavior: 'Berani mempertahankan kebenaran dan menolak ajakan yang salah.' },
    ],
    matchingPairs: [
      { leftText: 'Nabi Ibrahim a.s.', rightText: 'Khalilullah (Kekasih Allah)' },
      { leftText: 'Raja yang Sombong', rightText: 'Raja Namrud dari Babilonia' },
      { leftText: 'Mukjizat Api', rightText: 'Api Menjadi Dingin dan Menyelamatkan' },
      { leftText: 'Pembangun Ka\'bah', rightText: 'Nabi Ibrahim dan Nabi Ismail \'Alaihimassalam' },
    ],
    multipleChoice: [
      {
        question: 'Ketika Nabi Ibrahim a.s. dilemparkan ke dalam kobaran api oleh Raja Namrud, Allah memerintahkan api untuk...',
        options: ['Membakar lebih besar', 'Menjadi dingin dan menyelamatkan Ibrahim', 'Padam seketika karena angin', 'Berpindah ke tempat lain'],
        correctAnswer: 1,
        explanation: 'Allah berfirman: "Wahai api, jadilah dingin dan penyelamat bagi Ibrahim!" (QS. Al-Anbiya: 69).',
      },
    ],
    reflectivePrompt: {
      question: 'Kapan kamu harus memiliki keberanian seperti Nabi Ibrahim a.s. untuk membela hal yang benar?',
      hint: 'Misalnya berani menegur teman yang mengambil pensil orang lain.',
    },
    adabMissions: [
      { task: 'Membaca doa perlindungan saat melihat hal yang menakutkan', reflection: 'Meneladani kepasrahan Nabi Ibrahim' },
      { task: 'Menghargai tempat ibadah masjid dan menjaga kebersihannya', reflection: 'Meneladani pembangun Ka\'bah yang mulia' },
    ],
  },
];

// Helper functions for universal curriculum access
export function getCurriculumTopic(
  gradeLevel: number,
  semester: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)' | string,
  element: 'Al-Qur\'an Hadis' | 'Akidah' | 'Akhlak' | 'Fikih' | 'Sejarah Peradaban Islam' | string
): SDCurriculumTopic {
  const isSem2 = semester.includes('2') || semester.toLowerCase().includes('genap');
  const semNorm = isSem2 ? 'Semester 2 (Genap)' : 'Semester 1 (Ganjil)';

  // 1. Search in main database (exact match: grade + semester + element)
  const exact = SD_CURRICULUM_DATABASE.find(
    (item) => item.gradeLevel === gradeLevel && item.semester === semNorm && item.element === element
  );
  if (exact) return exact;

  // 2. Search in extended matrix (exact match: grade + semester + element)
  const exactMatrix = SD_CURRICULUM_EXTENDED_MATRIX.find(
    (item) => item.gradeLevel === gradeLevel && item.semester === semNorm && item.element === element
  );
  if (exactMatrix) return exactMatrix;

  // 3. Search in main database by grade + element (adjust semester label)
  const byGradeAndElement = SD_CURRICULUM_DATABASE.find(
    (item) => item.gradeLevel === gradeLevel && item.element === element
  );
  if (byGradeAndElement) {
    return { ...byGradeAndElement, semester: semNorm };
  }

  // 4. Search in extended matrix by grade + element
  const byGradeMatrix = SD_CURRICULUM_EXTENDED_MATRIX.find(
    (item) => item.gradeLevel === gradeLevel && item.element === element
  );
  if (byGradeMatrix) {
    return { ...byGradeMatrix, semester: semNorm };
  }

  // 5. Search by fase + element across both datasets
  const currentFase = gradeLevel <= 2 ? 'Fase A' : gradeLevel <= 4 ? 'Fase B' : 'Fase C';
  const byFase =
    SD_CURRICULUM_DATABASE.find((item) => item.fase === currentFase && item.element === element) ||
    SD_CURRICULUM_EXTENDED_MATRIX.find((item) => item.fase === currentFase && item.element === element) ||
    SD_CURRICULUM_DATABASE.find((item) => item.element === element) ||
    SD_CURRICULUM_EXTENDED_MATRIX.find((item) => item.element === element);

  if (byFase) {
    return {
      ...byFase,
      gradeLevel,
      grade: `Kelas ${gradeLevel} SD`,
      semester: semNorm,
    };
  }

  return SD_CURRICULUM_DATABASE[0];
}

export function getTopicsForElement(
  gradeLevel: number,
  semester: string,
  element: string
): SDCurriculumTopic[] {
  const isSem2 = semester.includes('2') || semester.toLowerCase().includes('genap');
  const semNorm = isSem2 ? 'Semester 2 (Genap)' : 'Semester 1 (Ganjil)';

  const all = [...SD_CURRICULUM_DATABASE, ...SD_CURRICULUM_EXTENDED_MATRIX];
  const matched = all.filter(
    (item) => item.gradeLevel === gradeLevel && item.semester === semNorm && item.element === element
  );
  if (matched.length > 0) return matched;

  const fallbackTopic = getCurriculumTopic(gradeLevel, semester, element);
  return [fallbackTopic];
}

/**
 * Calibrate worksheet questions based on difficulty level (Easy, Medium, Hard)
 * - Easy: LOTS (C1-C2) direct recall and foundational definition
 * - Medium: MOTS (C3) contextual application in elementary school daily life
 * - Hard: HOTS (C4-C6) analytical reasoning, ethical dilemmas, and moral problem solving
 */
export function calibrateQuestionsByDifficulty(
  topic: SDCurriculumTopic,
  difficulty: 'Easy' | 'Medium' | 'Hard' | string
): {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}[] {
  const norm = (difficulty || 'Medium').toLowerCase();
  const baseQuestions = topic.multipleChoice;

  if (norm.includes('easy') || norm.includes('mudah')) {
    // LOTS (C1-C2): Mengingat & memahami konsep dasar ramah anak SD
    return baseQuestions.map((q, idx) => {
      const mat = topic.materials[idx % topic.materials.length];
      if (idx === 0 && mat) {
        return {
          question: `Apa arti atau makna dasar dari ${mat.term} yang kita pelajari pada bab ini?`,
          options: [
            mat.meaning,
            'Melakukan tindakan yang merugikan sesama kawan',
            'Menyerah dan enggan memohon pertolongan Allah',
            'Hanya mengingat Allah ketika sedang susah',
          ],
          correctAnswer: 0,
          explanation: `[LOTS - C1/C2 Pemahaman Dasar] ${mat.term} artinya: ${mat.meaning}.`,
        };
      }
      return {
        ...q,
        question: `[Dasar LOTS] ${q.question.replace(/^\[HOTS[^\]]*\]\s*/i, '').replace(/^\[[^\]]+\]\s*/i, '')}`,
        explanation: `[LOTS - Konsep Inti] ${q.explanation}`,
      };
    });
  }

  if (norm.includes('hard') || norm.includes('hots') || norm.includes('menantang')) {
    // HOTS (C4-C6): Penalaran analitis, studi kasus dilema moral islami di sekolah
    return baseQuestions.map((q, idx) => {
      const mat = topic.materials[idx % topic.materials.length];
      if (idx === 0 && mat) {
        return {
          question: `[HOTS - Studi Kasus] Di sekolah, seorang kawan tidak sengaja merusak alat tulis dan merasa sangat ketakutan. Berdasarkan teladan materi "${topic.chapterTitle}", sikap bernalar kritis dan akhlak terpuji yang paling bijak kita ambil adalah...`,
          options: [
            `Menenangkan kawannya, memaafkan dengan lapang dada, dan menerapkan keteladanan ${mat.term} (${mat.behavior})`,
            'Memarahinya di depan seluruh teman kelas agar dia jera',
            'Menyuruh teman lain untuk menjauhinya selama satu pekan',
            'Meminta ganti rugi berkali-kali lipat tanpa mendengarkan penjelasannya',
          ],
          correctAnswer: 0,
          explanation: `[HOTS - C5 Evaluasi Nilai Moral] Sikap tepat adalah mengamalkan ${mat.term} melalui tindakan: ${mat.behavior}.`,
        };
      }
      return {
        ...q,
        question: q.question.startsWith('[HOTS') ? q.question : `[HOTS - Penalaran Kasus] ${q.question}`,
        explanation: `[HOTS - C4-C6 Analisis Mendalam] ${q.explanation}`,
      };
    });
  }

  // Medium: MOTS (C3) Penerapan Kontekstual
  return baseQuestions.map((q) => ({
    ...q,
    question: q.question.startsWith('[Aplikasi') ? q.question : `[Aplikasi MOTS] ${q.question.replace(/^\[HOTS[^\]]*\]\s*/i, '').replace(/^\[[^\]]+\]\s*/i, '')}`,
    explanation: `[MOTS - Penerapan Kontekstual C3] ${q.explanation}`,
  }));
}

