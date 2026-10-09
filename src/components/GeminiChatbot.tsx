import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Zap,
  Cpu,
  BrainCircuit,
  CornerDownLeft,
  Copy,
  Check,
  PlusCircle,
  Lightbulb,
} from 'lucide-react';
import { WorksheetData } from '../types/worksheet';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  worksheet: WorksheetData;
  onInsertToWorksheet?: (text: string) => void;
}

const QUICK_PROMPTS = [
  'Rancang 3 butir soal bernalar HOTS ramah anak SD untuk materi ini',
  'Ide ice-breaking islami & tepuk anak shalih 5 menit di kelas SD',
  'Jelaskan hikmah tadabbur ayat Al-Qur\'an ini dengan bahasa ramah anak',
  'Rancang proyek P5-PPRA (Profil Pelajar Rahmatan Lil Alamin) fase SD',
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  worksheet,
  onInsertToWorksheet,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Assalamu'alaikum Warahmatullahi Wabarakatuh! 🌿
Saya adalah **Konsultan Ahli Kurikulum & Pedagogi PAI SD (Lumina AI)** berpedoman pada **Standar Capaian Pembelajaran (CP) SK BSKAP No. 020/H/KR/2026**.

Saat ini Anda sedang menyusun modul Sekolah Dasar:
📌 **${worksheet.chapter || 'Pendidikan Agama Islam SD'}** (${worksheet.grade || 'Fase B SD'} • ${worksheet.semester || 'Semester 1 (Ganjil)'}).

Ada yang bisa saya bantu? Misalnya merumuskan Tujuan Pembelajaran (TP) ramah anak, membuat soal HOTS bergambar, mencari asbabun nuzul dalil, atau kegiatan pembiasaan akhlak harian!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelTier, setModelTier] = useState<'complex' | 'general' | 'fast'>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          modelTier,
          customRole: `Anda adalah Konsultan Kurikulum PAI Ahli (Lumina Assistant). Modul yang sedang dikerjakan guru adalah:
- Judul: ${worksheet.title}
- Topik: ${worksheet.chapter}
- Jenjang: ${worksheet.grade}
- Semester: ${worksheet.semester || 'Semester 1 (Ganjil)'}
- Dalil: ${worksheet.dalil.surah} (${worksheet.dalil.arabic})
Jawablah dengan terstruktur, edukatif, bersahabat, dan berikan contoh konkret yang dapat langsung diaplikasikan ke lembar kerja murid.`,
        }),
      });

      if (!res.ok) throw new Error('Gagal menghubungi model AI');

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Tidak ada balasan.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Afwan, terjadi kendala saat menghubungkan ke asisten AI. Silakan coba kembali dalam beberapa saat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/50 backdrop-blur-xs">
      <div className="w-full sm:max-w-xl h-full sm:h-[88vh] bg-white rounded-none sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-right-10 duration-200">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-indigo-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Bot className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm font-jakarta">
                  Lumina PAI Chatbot
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500">
                Konsultan Kurikulum Merdeka & Pedagogi Islami
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Tier Selector */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400" /> Model:
          </span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setModelTier('fast')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold flex items-center gap-1 transition-all ${
                modelTier === 'fast'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-3.1-flash-lite - Respon sangat cepat"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              Cepat
            </button>
            <button
              onClick={() => setModelTier('general')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold flex items-center gap-1 transition-all ${
                modelTier === 'general'
                  ? 'bg-sky-100 text-[#0284c7] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-3.5-flash - Seimbang untuk tugas umum"
            >
              <Sparkles className="w-3 h-3 text-sky-600" />
              Umum
            </button>
            <button
              onClick={() => setModelTier('complex')}
              className={`px-2 py-1 rounded text-[10.5px] font-bold flex items-center gap-1 transition-all ${
                modelTier === 'complex'
                  ? 'bg-purple-100 text-purple-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-3.1-pro-preview - Analisis mendalam & kompleks"
            >
              <BrainCircuit className="w-3 h-3 text-purple-600" />
              Pro
            </button>
          </div>
        </div>

        {/* Messages Thread */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 select-text"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-[#0284c7] text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 relative group shadow-xs ${
                    isUser
                      ? 'bg-[#0284c7] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-jakarta">{msg.content}</div>

                  <div
                    className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                      isUser ? 'border-sky-400/40 text-sky-100' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="p-1 hover:bg-black/10 rounded transition-colors"
                        title="Salin teks"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      {!isUser && onInsertToWorksheet && (
                        <button
                          onClick={() => onInsertToWorksheet(msg.content)}
                          className="p-1 hover:bg-black/10 rounded transition-colors text-sky-600"
                          title="Sisipkan ke LKPD"
                        >
                          <PlusCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-[#0284c7] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#0284c7] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#0284c7] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#0284c7] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 ml-1">
                  Ustadz AI sedang mengetik...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-slate-50 border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar">
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] whitespace-nowrap bg-white border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-[#0284c7] px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan hal seputar modul PAI, dalil, soal HOTS..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3.5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
