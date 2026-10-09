import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Image as ImageIcon,
  Wand2,
  Download,
  Check,
  Upload,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAsLogo: (imageUrl: string) => void;
  currentLogoUrl: string;
}

const PRESET_PROMPTS = [
  {
    label: 'Insignia Lambang Sekolah',
    prompt: 'Emblem logo lencana sekolah Islam terpadu dengan ornamen geometris bintang islami segi delapan, warna biru safir dan emas, desain vektor elegan minimalis, latar belakang transparan atau putih bersih.',
  },
  {
    label: 'Ilustrasi Anak Muslim',
    prompt: 'Ilustrasi anak muslim dan muslimah berseragam sekolah dasar sedang membaca buku dan tersenyum ramah di bawah pohon rindang, gaya kartun edukatif lembut berkarakter ramah.',
  },
  {
    label: 'Ornamen Kubah & Kaligrafi',
    prompt: 'Kubah masjid dengan siluet arsitektur Islam modern, kubah biru safir bercahaya lembut dan kaligrafi arab dekoratif islami berstandar kurikulum.',
  },
  {
    label: 'Lencana Bintang Karakter Adab',
    prompt: 'Lencana medali bintang penghargaan karakter siswa berprestasi beradab mulia, pita zamrud hijau dan emas, gaya flat icon modern 3D mengkilap.',
  },
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyAsLogo,
  currentLogoUrl,
}) => {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9'>('1:1');
  const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setApplied(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          editImageBase64,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan gambar');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal memproses gambar dengan Gemini');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLogo = () => {
    if (generatedImageUrl) {
      onApplyAsLogo(generatedImageUrl);
      setApplied(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const a = document.createElement('a');
      a.href = generatedImageUrl;
      a.download = `lumina-image-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-teal-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-teal-700 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <ImageIcon className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-jakarta">
                Studio Gambar & Logo AI (Gemini 3.1 Flash Image)
              </h3>
              <p className="text-[11px] text-slate-500">
                Buat ilustrasi modul, lambang insignia sekolah, dan ikon edukasi
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

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Preset Chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Ide Desain Siap Pakai:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p.prompt)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    prompt === p.prompt
                      ? 'bg-sky-50 border-sky-300 text-[#0284c7] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Prompt Visual
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tuliskan deskripsi detail gambar yang ingin Anda buat atau edit..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none text-slate-800"
            />
          </div>

          {/* Configuration: Aspect Ratio & Optional Image Edit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aspek Rasio Gambar
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1:1', '4:3', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-sky-50 border-sky-300 text-[#0284c7]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Edit Gambar Acuan (Opsional)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer text-xs font-semibold text-slate-600 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{editImageBase64 ? 'Gambar Dipilih' : 'Unggah Foto Acuan'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {editImageBase64 && (
                  <button
                    type="button"
                    onClick={() => setEditImageBase64(null)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                    title="Hapus acuan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedImageUrl && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center gap-3">
              <span className="text-[11px] font-bold text-slate-600">Hasil Gambar AI:</span>
              <div className="max-w-xs rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white p-1">
                <img
                  src={generatedImageUrl}
                  alt="AI Generated"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PNG
                </button>
                <button
                  type="button"
                  onClick={handleApplyLogo}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {applied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Terpasang di LKPD!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Pasang Jadi Logo KOP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#0284c7] to-teal-600 hover:opacity-95 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Merender Gambar AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buat / Edit Gambar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
