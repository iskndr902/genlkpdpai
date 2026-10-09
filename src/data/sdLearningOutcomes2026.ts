export interface PAILearningOutcome2026 {
  id: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  faseDescription: string;
  grades: string;
  element: 'Al-Qur\'an Hadis' | 'Akidah' | 'Akhlak' | 'Fikih' | 'Sejarah Peradaban Islam';
  semesterScope?: 'Semester 1' | 'Semester 2' | 'Semester 1 & 2';
  code: string;
  officialCP: string; // Teks Rumusan Resmi CP SK BSKAP 020/H/KR/2026
  coreScope: string[]; // Ruang Lingkup Materi Pokok
  recommendedTP: string; // Rekomendasi Tujuan Pembelajaran
  suggestedChapter: string;
  suggestedDalil: {
    surah: string;
    arabic: string;
    translation: string;
    note: string;
  };
}

export const PAI_LEARNING_OUTCOMES_2026: PAILearningOutcome2026[] = [
  // ==========================================================
  // FASE A (KELAS 1 - 2 SD)
  // ==========================================================
  {
    id: 'fase-a-quran',
    fase: 'Fase A',
    faseDescription: 'Fase A (Usia 6 - 8 Tahun)',
    grades: 'Kelas 1 - 2 SD',
    element: 'Al-Qur\'an Hadis',
    semesterScope: 'Semester 1 & 2',
    code: 'CP 020/2026 - A.1',
    officialCP: 'Peserta didik mengenal huruf hijaiah dan harakatnya, melafalkan huruf hijaiah berharakat secara fasih, serta melafalkan surah-surah pendek Al-Qur\'an (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas) dengan fasih dan berani, serta terbiasa melafalkan basmalah dan hamdalah.',
    coreScope: ['Huruf Hijaiah & Harakat Dasar', 'Surah Pendek Pilihan', 'Kalimah Thayyibah (Basmalah & Hamdalah)'],
    recommendedTP: 'Melafalkan Surah Al-Fatihah dan ayat pendek dengan tartil serta membiasakan membaca basmalah dan hamdalah pada setiap aktivitas baik.',
    suggestedChapter: 'Bab 1: Aku Cinta Al-Qur\'an & Huruf Hijaiyah',
    suggestedDalil: {
      surah: 'QS. Al-Fatihah : 1-2',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: '“Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam.”',
      note: 'Tadabbur: Kita memulai setiap kebaikan dengan basmalah dan bersyukur dengan hamdalah.',
    },
  },
  {
    id: 'fase-a-akidah',
    fase: 'Fase A',
    faseDescription: 'Fase A (Usia 6 - 8 Tahun)',
    grades: 'Kelas 1 - 2 SD',
    element: 'Akidah',
    semesterScope: 'Semester 1',
    code: 'CP 020/2026 - A.2',
    officialCP: 'Peserta didik mengenal Rukun Iman kepada Allah Swt. dan para malaikat-Nya melalui pengamatan ciptaan-Nya di alam semesta, mengenal Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Khaliq), melafalkan dua kalimah syahadat, serta meyakini keesaan Allah Swt.',
    coreScope: ['Rukun Iman Dasar', 'Asmaul Husna Anak', 'Dua Kalimah Syahadat'],
    recommendedTP: 'Menyebutkan Rukun Iman secara berurutan dan membiasakan perilaku taat kepada Allah Swt. serta bersyukur atas ciptaan-Nya.',
    suggestedChapter: 'Bab 2: Mengenal Rukun Iman & Meyakini Allah Maha Esa',
    suggestedDalil: {
      surah: 'QS. Al-Ikhlas : 1',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translation: '“Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa.”',
      note: 'Tadabbur: Allah Maha Esa, tidak beranak dan tidak diperanakkan.',
    },
  },
  {
    id: 'fase-a-akhlak',
    fase: 'Fase A',
    faseDescription: 'Fase A (Usia 6 - 8 Tahun)',
    grades: 'Kelas 1 - 2 SD',
    element: 'Akhlak',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - A.3',
    officialCP: 'Peserta didik terbiasa mempraktikkan nilai-nilai akhlak mulia dalam kehidupan sehari-hari, seperti berkata jujur, santun berbicara, menyayangi keluarga dan teman, menghormati orang tua dan guru, serta menjaga kebersihan diri.',
    coreScope: ['Adab Berbicara & Santun', 'Kasih Sayang Keluarga', 'Kebersihan Diri'],
    recommendedTP: 'Membiasakan 3 kata ajaib (Maaf, Tolong, Terima Kasih) dan menghormati guru serta orang tua di rumah.',
    suggestedChapter: 'Bab 3: Perilaku Santun & Adab Berbakti kepada Orang Tua',
    suggestedDalil: {
      surah: 'QS. Al-Isra : 23',
      arabic: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
      translation: '“Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapak.”',
      note: 'Tadabbur: Berbakti kepada orang tua adalah kunci keberkahan hidup anak shalih.',
    },
  },
  {
    id: 'fase-a-fikih',
    fase: 'Fase A',
    faseDescription: 'Fase A (Usia 6 - 8 Tahun)',
    grades: 'Kelas 1 - 2 SD',
    element: 'Fikih',
    semesterScope: 'Semester 1',
    code: 'CP 020/2026 - A.4',
    officialCP: 'Peserta didik mempraktikkan tata cara bersuci (istinja dan wudhu) secara tertib, mengenal shalat fardhu lima waktu dan bacaannya, serta membiasakan hidup bersih dan tertib dalam ibadah sehari-hari.',
    coreScope: ['Tata Cara Wudhu & Bersuci', 'Shalat Fardhu 5 Waktu', 'Kebersihan Tempat Ibadah'],
    recommendedTP: 'Mempraktikkan rukun wudhu secara berurutan dan menyebutkan nama-nama shalat fardhu beserta jumlah rakaatnya.',
    suggestedChapter: 'Bab 4: Asyiknya Bersuci: Tata Cara Berwudhu & Shalat Tertib',
    suggestedDalil: {
      surah: 'QS. Al-Ma\'idah : 6',
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ',
      translation: '“Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku...”',
      note: 'Tadabbur: Bersuci membersihkan raga dari kotoran dan menyiapkan hati menghadap Allah.',
    },
  },
  {
    id: 'fase-a-spi',
    fase: 'Fase A',
    faseDescription: 'Fase A (Usia 6 - 8 Tahun)',
    grades: 'Kelas 1 - 2 SD',
    element: 'Sejarah Peradaban Islam',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - A.5',
    officialCP: 'Peserta didik mampu menceritakan kisah singkat Nabi Adam a.s., Nabi Nuh a.s., dan masa kanak-kanak Nabi Muhammad saw., serta meneladani sifat amanah, kejujuran, dan kasih sayang mereka dalam kehidupan.',
    coreScope: ['Kisah Nabi Pilihan', 'Masa Kanak-kanak Nabi Muhammad saw.', 'Keteladanan Sifat Shiddiq & Amanah'],
    recommendedTP: 'Menceritakan keteladanan kejujuran Nabi Muhammad saw. saat masih kanak-kanak dan meniru sikap tersebut saat bermain.',
    suggestedChapter: 'Bab 5: Keteladanan Masa Kanak-kanak Nabi Muhammad saw.',
    suggestedDalil: {
      surah: 'QS. Al-Ahzab : 21',
      arabic: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ',
      translation: '“Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu...”',
      note: 'Tadabbur: Rasulullah saw. adalah teladan terbaik dalam berkata jujur dan menyayangi sesama.',
    },
  },

  // ==========================================================
  // FASE B (KELAS 3 - 4 SD)
  // ==========================================================
  {
    id: 'fase-b-quran',
    fase: 'Fase B',
    faseDescription: 'Fase B (Usia 8 - 10 Tahun)',
    grades: 'Kelas 3 - 4 SD',
    element: 'Al-Qur\'an Hadis',
    semesterScope: 'Semester 1 & 2',
    code: 'CP 020/2026 - B.1',
    officialCP: 'Peserta didik mampu membaca surah-surah pendek Al-Qur\'an (At-Tin, Al-Ma\'un, Al-Kautsar, Al-Fil) dengan menerapkan kaidah tajwid dasar (hukum nun sukun dan mim sukun), memahami arti dan pesan pokok ayat, serta mengamalkannya dalam kepedulian sosial.',
    coreScope: ['Tajwid Nun & Mim Sukun', 'Pesan Pokok QS. At-Tin & Al-Ma\'un', 'Kepedulian terhadap Anak Yatim'],
    recommendedTP: 'Membaca QS. At-Tin dan QS. Al-Ma\'un dengan tajwid yang benar dan mengamalkan pesan menyayangi anak yatim dan orang miskin.',
    suggestedChapter: 'Bab 1: Menyelami Pesan Mulia Surah At-Tin & Al-Ma\'un',
    suggestedDalil: {
      surah: 'QS. Al-Ma\'un : 1-3',
      arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
      translation: '“Tahukah kamu (orang) yang mendustakan agama? Maka itulah orang yang menghardik anak yatim...”',
      note: 'Tadabbur: Iman sejati diwujudkan dengan kepedulian nyata kepada mereka yang membutuhkan.',
    },
  },
  {
    id: 'fase-b-akidah',
    fase: 'Fase B',
    faseDescription: 'Fase B (Usia 8 - 10 Tahun)',
    grades: 'Kelas 3 - 4 SD',
    element: 'Akidah',
    semesterScope: 'Semester 1',
    code: 'CP 020/2026 - B.2',
    officialCP: 'Peserta didik memahami arti dan makna Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Aziz, Al-Mu\'min, Al-Wahhab, Al-Kabir) serta mengaktualisasikannya dalam kepemimpinan diri, kebersihan lisan, kedamaian, dan keteguhan akhlak.',
    coreScope: ['Makna 5-7 Asmaul Husna', 'Aktualisasi Asmaul Husna', 'Meneladani Sifat Mulia Allah'],
    recommendedTP: 'Menjelaskan makna 5 Asmaul Husna dan membuat rencana teladan nyata dalam memimpin diri sendiri serta menjaga kedamaian.',
    suggestedChapter: 'Bab 2: Meneladani 5 Asmaul Husna dalam Keseharian',
    suggestedDalil: {
      surah: 'QS. Al-A\'raf : 180',
      arabic: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا ۖ وَذَرُوا الَّذِينَ يُلْحِدُونَ فِي أَسْمَائِهِ',
      translation: '“Hanya milik Allah asma-ul husna (nama-nama yang agung), maka bermohonlah kepada-Nya dengan menyebut nama-nama itu...”',
      note: 'Tadabbur: Menghayati Asmaul Husna melahirkan pribadi mandiri, bersih raga, dan cinta damai.',
    },
  },
  {
    id: 'fase-b-akhlak',
    fase: 'Fase B',
    faseDescription: 'Fase B (Usia 8 - 10 Tahun)',
    grades: 'Kelas 3 - 4 SD',
    element: 'Akhlak',
    semesterScope: 'Semester 1 & 2',
    code: 'CP 020/2026 - B.3',
    officialCP: 'Peserta didik membiasakan perilaku terpuji seperti berbakti kepada orang tua (birrul walidain), menghargai keragaman teman, bersikap rendah hati (tawadhu), serta menjauhi perilaku tercela seperti takabur (sombong) dan riya.',
    coreScope: ['Birrul Walidain', 'Tawadhu vs Takabur', 'Menghargai Keberagaman Teman'],
    recommendedTP: 'Mengidentifikasi contoh sikap tawadhu di sekolah dan menjauhi perilaku sombong serta bersyukur atas nikmat Allah.',
    suggestedChapter: 'Bab 3: Rendah Hati (Tawadhu) & Menjauhi Sikap Sombong',
    suggestedDalil: {
      surah: 'QS. Al-Furqan : 63',
      arabic: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا',
      translation: '“Adapun hamba-hamba Tuhan Yang Maha Pengasih itu adalah orang-orang yang berjalan di bumi dengan rendah hati...”',
      note: 'Tadabbur: Orang yang tawadhu tidak memamerkan kelebihan di hadapan sesamanya.',
    },
  },
  {
    id: 'fase-b-fikih',
    fase: 'Fase B',
    faseDescription: 'Fase B (Usia 8 - 10 Tahun)',
    grades: 'Kelas 3 - 4 SD',
    element: 'Fikih',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - B.4',
    officialCP: 'Peserta didik memahami rukun dan syarat shalat fardhu, keutamaan shalat berjamaah, tanda-tanda usia baligh menurut syariat Islam, serta rukhsah (keringanan) dalam shalat jamak dan qasar saat bepergian.',
    coreScope: ['Shalat Fardhu & Berjamaah', 'Tanda-tanda Usia Baligh', 'Rukhsah Shalat (Jamak & Qasar)'],
    recommendedTP: 'Menjelaskan tata cara shalat berjamaah dan memahami perubahan serta kewajiban saat memasuki usia baligh.',
    suggestedChapter: 'Bab 4: Indahnya Shalat Berjamaah & Menyambut Usia Baligh',
    suggestedDalil: {
      surah: 'QS. Al-Baqarah : 43',
      arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
      translation: '“Dan laksanakanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.”',
      note: 'Tadabbur: Shalat berjamaah melatih persatuan, ketaatan pada pemimpin, dan kedisiplinan.',
    },
  },
  {
    id: 'fase-b-spi',
    fase: 'Fase B',
    faseDescription: 'Fase B (Usia 8 - 10 Tahun)',
    grades: 'Kelas 3 - 4 SD',
    element: 'Sejarah Peradaban Islam',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - B.5',
    officialCP: 'Peserta didik mampu menceritakan peristiwa hijrah Nabi Muhammad saw. ke Yatsrib (Madinah), keteladanan para sahabat utama (Abu Bakar ash-Shiddiq, Umar bin Khattab), dan nilai persaudaraan kaum Muhajirin dan Anshar.',
    coreScope: ['Peristiwa Hijrah ke Madinah', 'Keteladanan Sahabat Utama', 'Persaudaraan Muhajirin-Anshar'],
    recommendedTP: 'Meneladani sikap rela berkorban kaum Anshar dan kejujuran kaum Muhajirin dalam pertemanan sehari-hari.',
    suggestedChapter: 'Bab 5: Kisah Hijrah ke Madinah & Persaudaraan Tanpa Pamrih',
    suggestedDalil: {
      surah: 'QS. Al-Hasyr : 9',
      arabic: 'وَيُؤْثِرُونَ عَلَىٰ أَنفُسِهِمْ وَلَوْ كَانَ بِهِمْ خَصَاصَةٌ',
      translation: '“Dan mereka mengutamakan (orang-orang Muhajirin) atas diri mereka sendiri, sekalipun mereka dalam kesusahan.”',
      note: 'Tadabbur: Solidaritas kaum Anshar mengajarkan pentingnya saling berbagi tanpa pamrih.',
    },
  },

  // ==========================================================
  // FASE C (KELAS 5 - 6 SD)
  // ==========================================================
  {
    id: 'fase-c-quran',
    fase: 'Fase C',
    faseDescription: 'Fase C (Usia 10 - 12 Tahun)',
    grades: 'Kelas 5 - 6 SD',
    element: 'Al-Qur\'an Hadis',
    semesterScope: 'Semester 1 & 2',
    code: 'CP 020/2026 - C.1',
    officialCP: 'Peserta didik mampu membaca, menghafal, dan memahami pesan pokok ayat Al-Qur\'an pilihan (QS. Al-Hujurat: 13, QS. Ali \'Imran: 64, QS. Al-Ma\'idah: 2) tentang keragaman sebagai sunnatullah, toleransi (tasamuh), dan tolong-menolong dalam kebajikan.',
    coreScope: ['Keragaman sebagai Sunnatullah', 'Prinsip Toleransi Tasamuh', 'Tolong-Menolong Ta\'awun'],
    recommendedTP: 'Menganalisis pesan moral QS. Al-Hujurat ayat 13 dan merumuskan komitmen toleransi antarumat beragama dan antarsuku di sekolah.',
    suggestedChapter: 'Bab 1: Menghargai Keragaman Sesuai QS. Al-Hujurat Ayat 13',
    suggestedDalil: {
      surah: 'QS. Al-Hujurat : 13',
      arabic: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا',
      translation: '“Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal...”',
      note: 'Tadabbur: Kemuliaan di hadapan Allah semata-mata diukur dari ketaqwaan, bukan suku atau rupa.',
    },
  },
  {
    id: 'fase-c-akidah',
    fase: 'Fase C',
    faseDescription: 'Fase C (Usia 10 - 12 Tahun)',
    grades: 'Kelas 5 - 6 SD',
    element: 'Akidah',
    semesterScope: 'Semester 1',
    code: 'CP 020/2026 - C.2',
    officialCP: 'Peserta didik memahami rukun iman kepada hari akhir (kiamat) dan qada-qadar, meyakini keadilan Allah Swt., serta dampaknya terhadap keteguhan beramal shalih, tanggung jawab moral, dan optimisme dalam kehidupan.',
    coreScope: ['Iman kepada Hari Akhir', 'Iman kepada Qada dan Qadar', 'Tanggung Jawab Moral Pribadi'],
    recommendedTP: 'Menjelaskan hikmah beriman kepada hari akhir dan qada-qadar dalam menumbuhkan sifat tawakal dan menjauhi keputusasaan.',
    suggestedChapter: 'Bab 2: Menguatkan Iman kepada Hari Akhir & Qada-Qadar',
    suggestedDalil: {
      surah: 'QS. Al-Zalzalah : 7-8',
      arabic: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۝ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
      translation: '“Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya. Dan barangsiapa mengerjakan kejahatan seberat zarrah, niscaya dia akan melihat (balasan)nya.”',
      note: 'Tadabbur: Setiap perbuatan kecil akan dipertanggungjawabkan di hadapan Mahkamah Ilahi.',
    },
  },
  {
    id: 'fase-c-akhlak',
    fase: 'Fase C',
    faseDescription: 'Fase C (Usia 10 - 12 Tahun)',
    grades: 'Kelas 5 - 6 SD',
    element: 'Akhlak',
    semesterScope: 'Semester 1 & 2',
    code: 'CP 020/2026 - C.3',
    officialCP: 'Peserta didik membiasakan sikap toleransi (tasamuh), tolong-menolong (ta\'awun), saling memaafkan, menjaga kelestarian lingkungan hidup (fiqih bi\'ah), serta menjauhi prasangka buruk (su\'udzan), mencari kesalahan orang lain (tajassus), dan ghibah.',
    coreScope: ['Tasamuh & Ta\'awun', 'Kelestarian Lingkungan Hidup', 'Menjauhi Ghibah & Su\'udzan'],
    recommendedTP: 'Membiasakan sikap husnudzan dan aktif berpartisipasi menjaga kebersihan dan kelestarian lingkungan sekolah.',
    suggestedChapter: 'Bab 3: Membina Akhlak Terpuji & Melestarikan Lingkungan Hidup',
    suggestedDalil: {
      surah: 'QS. Ar-Rum : 41',
      arabic: 'ظَهَرَ الْفَسَادُ فِي الْبَرِّ وَالْبَحْرِ بِمَا كَسَبَتْ أَيْدِي النَّاسِ',
      translation: '“Telah tampak kerusakan di darat dan di laut disebabkan perbuatan tangan manusia...”',
      note: 'Tadabbur: Menjaga kebersihan dan pohon adalah amanah khalifah fil ardh.',
    },
  },
  {
    id: 'fase-c-fikih',
    fase: 'Fase C',
    faseDescription: 'Fase C (Usia 10 - 12 Tahun)',
    grades: 'Kelas 5 - 6 SD',
    element: 'Fikih',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - C.4',
    officialCP: 'Peserta didik memahami ketentuan zakat fitrah, zakat mal, infak, sedekah, qurban, dan dasar-dasar ibadah haji/umrah serta hikmah sosialnya dalam memperkokoh kepedulian dan solidaritas kemanusiaan.',
    coreScope: ['Zakat Fitrah & Zakat Mal', 'Infak & Sedekah', 'Qurban & Ibadah Haji'],
    recommendedTP: 'Menghitung kadar zakat fitrah dan menjelaskan perbedaan zakat, infak, dan sedekah dalam kehidupan bermasyarakat.',
    suggestedChapter: 'Bab 4: Membersihkan Harta & Jiwa: Zakat, Infak, dan Sedekah',
    suggestedDalil: {
      surah: 'QS. At-Taubah : 103',
      arabic: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُzَكِّيهِم بِهَا',
      translation: '“Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka...”',
      note: 'Tadabbur: Di dalam setiap rezeki kita ada hak fakir miskin yang wajib ditunaikan.',
    },
  },
  {
    id: 'fase-c-spi',
    fase: 'Fase C',
    faseDescription: 'Fase C (Usia 10 - 12 Tahun)',
    grades: 'Kelas 5 - 6 SD',
    element: 'Sejarah Peradaban Islam',
    semesterScope: 'Semester 2',
    code: 'CP 020/2026 - C.5',
    officialCP: 'Peserta didik mampu meneladani peristiwa Fathu Makkah (pembebasan kota Mekah tanpa pertumpahan darah), kepemimpinan Khulafaur Rasyidin, serta nilai kearifan lokal dakwah damai para ulama di Nusantara.',
    coreScope: ['Peristiwa Fathu Makkah', 'Kepemimpinan Khulafaur Rasyidin', 'Dakwah Damai Ulama Nusantara'],
    recommendedTP: 'Meneladani sifat pemaaf Rasulullah saw. saat Fathu Makkah dan ketegasan membela keadilan Khulafaur Rasyidin.',
    suggestedChapter: 'Bab 5: Fathu Makkah: Kemenangan Mulia Tanpa Balas Dendam',
    suggestedDalil: {
      surah: 'QS. An-Nashr : 1-2',
      arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      translation: '“Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah...”',
      note: 'Tadabbur: Kemenangan sejati adalah saat kita memaafkan dan merangkul sesama dengan damai.',
    },
  },
];
