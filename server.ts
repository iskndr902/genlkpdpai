import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/generate-worksheet
app.post('/api/generate-worksheet', async (req, res) => {
  try {
    const { topic, grade, semester, element, tp, cp020, difficulty, focus } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'GEMINI_API_KEY belum disetel di environment. Menggunakan generator kurikulum internal.',
      });
    }

    const selectedSemester = semester || 'Semester 1 (Ganjil)';
    const selectedDifficulty = difficulty || 'Medium';

    let difficultyGuidance = '';
    if (selectedDifficulty === 'Easy' || selectedDifficulty === 'Mudah') {
      difficultyGuidance = 'Tingkat Kesulitan: MUDAH (Easy / LOTS C1-C2). Soal pilihan ganda bersifat langsung (mengingat dan memahami konsep dasar), bahasa sederhana lugas, pencocokan konsep fundamental, pertanyaan reflektif ramah anak usia SD awal.';
    } else if (selectedDifficulty === 'Hard' || selectedDifficulty === 'HOTS / Menantang') {
      difficultyGuidance = 'Tingkat Kesulitan: MENANTANG (Hard / True HOTS C4-C6). Soal pilihan ganda bernalar tingkat tinggi (studi kasus dilema moral, analisis situasi nyata pertemanan di sekolah, evaluasi perilaku islami), opsi jawaban menuntut penalaran kritis, refleksi karakter mendalam.';
    } else {
      difficultyGuidance = 'Tingkat Kesulitan: SEDANG (Medium / MOTS C3). Soal pilihan ganda berbasis penerapan (aplikasi konsep dan teladan dalam kehidupan sehari-hari anak SD), mengaitkan dalil dengan perilaku konkret di sekolah/rumah.';
    }

    const prompt = `Anda adalah pakar kurikulum Pendidikan Agama Islam (PAI) dan Budi Pekerti Sekolah Dasar (SD) Kurikulum Merdeka Indonesia berdasarkan Capaian Pembelajaran (CP) SK BSKAP No. 020/H/KR/2026.
Buat modul Lembar Kerja Peserta Didik (LKPD) jenjang SD yang bermutu tinggi, ramah anak usia SD, menarik, dan mendidik dengan rincian:
- Topik / Materi Pokok: ${topic || 'Asmaul Husna'}
- Elemen PAI SD: ${element || 'PAI & Budi Pekerti'}
- Jenjang Kelas SD: ${grade || 'Kelas 4 SD (Fase B)'}
- Semester: ${selectedSemester}
- Tingkat Kesulitan Soal: ${selectedDifficulty}
- Pedoman Kompleksitas Soal: ${difficultyGuidance}
- Indikator Bab & TP: ${tp || 'Diselaraskan dengan CP No. 020/2026'}
- Acuan Regulasi: Standar Capaian Pembelajaran (CP) SK No. 020/H/KR/2026: ${cp020 || 'Standar PAI SD 2026'}
- Catatan Semester: Pastikan cakupan materi pokok, ruang lingkup konsep, rujukan dalil, dan latihan soal diselaraskan secara tepat dengan kalender pendidikan ${selectedSemester} dan Elemen ${element || 'PAI'}.
- Fokus Pedagogis: ${focus || 'Pengenalan Dalil Berharakat Amiri, Gamified Matching Nodes, Soal HOTS Ramah Anak SD, dan Misi Akhlak Pembiasaan Harian'}

Berikan output JSON terstruktur persis dengan schema:
- institutionName: nama SD teladan (contoh: SD Negeri Teladan 01 Pagi)
- title: judul lembar kerja (contoh: LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD)
- subject: Pendidikan Agama Islam & Budi Pekerti (PAI)
- grade: jenjang kelas SD (contoh: Kelas 4 SD (Fase B))
- semester: semester modul (contoh: ${selectedSemester})
- chapter: bab materi
- curriculumStandard: Capaian Pembelajaran (CP) SK No. 020/2026 dan Tujuan Pembelajaran (TP)
- dalil: objek { surah: string, arabic: teks arab berharakat lengkap, translation: terjemahan bahasa indonesia kemenag, note: pesan hikmah/tadabbur ramah anak SD }
- materialsSummary: array 3-4 butir { term: istilah, meaning: arti/makna ramah anak, behavior: teladan nyata perilaku sehari-hari }
- matchingActivity: array 4 pasang { left: konsep kiri/istilah, arabicBadge: teks arab singkat opsional, right: arti/penjelasan kanan }
- multipleChoice: array 2-3 soal { question: teks soal kontekstual HOTS ramah anak SD, options: [A, B, C, D], correctAnswer: index angka 0-3, explanation: pembahasan mendalam }
- reflectiveQuestion: string pertanyaan refleksi diri siswa SD
- adabMissions: array 3-4 misi { task: amalan nyata pembiasaan, reflection: alasan beramal shalih }`;

    let response: any = null;
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                institutionName: { type: Type.STRING },
                title: { type: Type.STRING },
                subject: { type: Type.STRING },
                grade: { type: Type.STRING },
                semester: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                chapter: { type: Type.STRING },
                curriculumStandard: { type: Type.STRING },
                dalil: {
                  type: Type.OBJECT,
                  properties: {
                    surah: { type: Type.STRING },
                    arabic: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ['surah', 'arabic', 'translation', 'note'],
                },
                materialsSummary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      behavior: { type: Type.STRING },
                    },
                    required: ['term', 'meaning', 'behavior'],
                  },
                },
                matchingActivity: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      left: { type: Type.STRING },
                      arabicBadge: { type: Type.STRING },
                      right: { type: Type.STRING },
                    },
                    required: ['left', 'right'],
                  },
                },
                multipleChoice: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation'],
                  },
                },
                reflectiveQuestion: { type: Type.STRING },
                adabMissions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      task: { type: Type.STRING },
                      reflection: { type: Type.STRING },
                    },
                    required: ['task', 'reflection'],
                  },
                },
              },
              required: [
                'institutionName',
                'title',
                'subject',
                'grade',
                'chapter',
                'curriculumStandard',
                'dalil',
                'materialsSummary',
                'matchingActivity',
                'multipleChoice',
                'reflectiveQuestion',
                'adabMissions',
              ],
            },
          },
        });
        if (response?.text) break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next model:`, err.message);
      }
    }

    if (!response || !response.text) {
      throw new Error('All AI models unavailable, falling back to smart curriculum database.');
    }

    const parsed = JSON.parse(response.text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Gemini API call encountered error, returning smart curriculum generator:', error.message);
    const { topic = 'Asmaul Husna', grade = 'Fase B (Kelas 4 SD)' } = req.body;
    return res.json({
      success: true,
      fallback: true,
      data: {
        institutionName: 'SDIT TELADAN AL-FATH ISLAMIC SCHOOL',
        title: `LEMBAR KERJA PESERTA DIDIK: ${topic.toUpperCase()}`,
        subject: 'Pendidikan Agama Islam & Budi Pekerti',
        grade: grade,
        chapter: `Modul Pembelajaran PAI: ${topic}`,
        curriculumStandard: `CP: Peserta didik mampu memahami dan mengamalkan nilai keteladanan ${topic} dalam kehidupan sehari-hari berlandaskan Al-Qur'an dan Sunnah.`,
        dalil: {
          surah: 'QS. Al-Baqarah : 208',
          arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ',
          translation: '“Wahai orang-orang yang beriman! Masuklah ke dalam Islam secara keseluruhan (kaffah), dan janganlah kamu ikuti langkah-langkah setan...”',
          note: `Tadabbur: Menghidupkan nilai ${topic} menuntun kita menjadi pribadi berakhlak mulia, rendah hati, dan peduli sesama.`,
        },
        materialsSummary: [
          {
            term: 'Keteguhan Iman (Istiqamah)',
            meaning: 'Teguh dalam memegang prinsip kebenaran dan ketaatan kepada Allah Swt.',
            behavior: 'Tidak goyah dalam menjalankan shalat dan berkata jujur.',
          },
          {
            term: 'Ketulusan Niat (Ikhlas)',
            meaning: 'Beramal semata-mata mengharap ridha dan rahmat Allah Swt.',
            behavior: 'Membantu teman tanpa pamrih imbalan atau pujian.',
          },
          {
            term: 'Sikap Damai (As-Salam)',
            meaning: 'Menghadirkan rasa aman dan kedamaian bagi lingkungan sekitar.',
            behavior: 'Menebarkan salam dan mendamaikan teman yang berselisih.',
          },
        ],
        matchingActivity: [
          {
            left: 'Istiqamah',
            arabicBadge: 'استقامة',
            right: 'Teguh Pendirian Menjalankan Kebaikan Tanpa Ragu',
          },
          {
            left: 'Ikhlas',
            arabicBadge: 'إخلاص',
            right: 'Berbuat Kebaikan Murni Karena Allah Swt.',
          },
          {
            left: 'Tasamuh',
            arabicBadge: 'تسامح',
            right: 'Sikap Lapang Dada & Toleransi Menghargai Perbedaan',
          },
          {
            left: 'Amanah',
            arabicBadge: 'أمانة',
            right: 'Dapat Dipercaya Menjaga Titipan dan Tanggung Jawab',
          },
        ],
        multipleChoice: [
          {
            question: `Perilaku berikut yang paling mencerminkan penerapan nilai ${topic} di lingkungan sekolah adalah...`,
            options: [
              'Mengejek teman yang berbeda suku',
              'Menjaga kebersihan kelas dan berucap santun kepada guru',
              'Menyontek saat ujian ketika guru tidak melihat',
              'Membuang sampah di laci meja',
            ],
            correctAnswer: 1,
            explanation: 'Islam memerintahkan umatnya menjaga kebersihan, beradab santun, dan menghormati guru.',
          },
          {
            question: 'Sikap berani mengakui kesalahan dan segera meminta maaf merupakan perwujudan dari sifat...',
            options: ['Takabur', 'Mulia dan Berjiwa Kesatria (Al-Aziz)', 'Riya', 'Kikir'],
            correctAnswer: 1,
            explanation: 'Jiwa yang mulia tidak ragu mengakui kesalahan dan berbuat jujur.',
          },
        ],
        reflectiveQuestion: `Tuliskan satu komitmen nyata yang akan kamu lakukan mulai besok dalam mengamalkan ${topic}!`,
        adabMissions: [
          {
            task: 'Menebarkan senyum, salam, dan sapa kepada guru dan orang tua',
            reflection: 'Menciptakan suasana berkah dan kasih sayang',
          },
          {
            task: 'Merapikan perlengkapan belajar sendiri setelah selesai digunakan',
            reflection: 'Melatih kemandirian dan tanggung jawab',
          },
          {
            task: 'Menyisihkan uang saku untuk kotak infak kebaikan di hari Jumat',
            reflection: 'Mendidik jiwa gemar bersedekah dan peduli sesama',
          },
        ],
      },
    });
  }
});

// POST /api/chat - Multi-turn Gemini Chatbot with specific model tiers
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelTier = 'general', customRole } = req.body;
    let modelName = 'gemini-3.5-flash';
    if (modelTier === 'complex' || modelTier === 'pro') {
      modelName = 'gemini-3.1-pro-preview';
    } else if (modelTier === 'fast' || modelTier === 'lite') {
      modelName = 'gemini-3.1-flash-lite';
    } else {
      modelName = 'gemini-3.5-flash';
    }

    if (!ai) {
      return res.json({
        reply: 'Afwan, fitur AI siap digunakan dengan materi PAI Kurikulum Merdeka. Silakan pastikan konfigurasi API key terhubung.',
        modelUsed: modelName,
      });
    }

    const systemInstruction =
      customRole ||
      `Anda adalah Konsultan Ahli Kurikulum & Pedagogi Pendidikan Agama Islam (PAI) & Budi Pekerti berstandar Kurikulum Merdeka (Lumina AI Assistant).
Peran dan Tugas Anda:
1. Membantu guru mendesain modul ajar, LKPD, soal HOTS bernalar kritis, dan rubrik asesmen autentik.
2. Memberikan dalil Al-Qur'an dan Hadits yang shahih dengan teks Arab berharakat, terjemahan resmi Kemenag RI, dan tadabbur hikmah yang relevan bagi anak.
3. Memberikan ide aktivitas belajar interaktif, gamifikasi, dan proyek penguatan profil pelajar (P5-PPRA).
4. Menjawab dengan bahasa Indonesia yang santun, bijak, terstruktur rapi, dan memotivasi guru.`;

    const contents = (messages || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || msg.content || '' }],
    }));

    if (contents.length === 0) {
      return res.status(400).json({ error: 'Daftar pesan tidak boleh kosong' });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'Tidak ada respons yang dihasilkan.',
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses percakapan dengan model Gemini.',
    });
  }
});

// POST /api/generate-image - Create and edit images using gemini-3.1-flash-image-preview
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, editImageBase64, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Deskripsi prompt gambar wajib diisi' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Layanan AI belum diinisialisasi.' });
    }

    const model = 'gemini-3.1-flash-image-preview';

    let contents: any;
    if (editImageBase64) {
      const cleanData = editImageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents = {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      };
    } else {
      contents = {
        parts: [{ text: prompt }],
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Model tidak mengembalikan gambar yang valid.' });
    }

    return res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    return res.status(500).json({
      error: error.message || 'Gagal membuat/mengedit gambar dengan Gemini.',
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumina Islamic EdTech Server running on port ${PORT}`);
  });
}

startServer();
