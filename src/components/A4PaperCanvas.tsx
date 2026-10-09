import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  QrCode,
  CheckCircle2,
  BookOpen,
  Volume2,
  Award,
  Layers,
  Check,
  Printer,
  FileCheck,
} from 'lucide-react';
import { WorksheetData, MatchingPair } from '../types/worksheet';

interface A4PaperCanvasProps {
  worksheet: WorksheetData;
  onUpdateWorksheet: (updated: WorksheetData) => void;
  scale: number;
  ecoPrintMode: boolean;
  showTeacherKey: boolean;
}

export const A4PaperCanvas: React.FC<A4PaperCanvasProps> = ({
  worksheet,
  onUpdateWorksheet,
  scale,
  ecoPrintMode,
  showTeacherKey,
}) => {
  // Interactive student matching state: map of leftPairId -> rightPairId
  const [userConnections, setUserConnections] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);

  // Shuffled or preserved right side for matching game to make it fun for students
  const [rightItemsOrder, setRightItemsOrder] = useState<string[]>([]);

  useEffect(() => {
    // Deterministic shuffle of right side so they don't appear in identical parallel order
    const ids = worksheet.matchingPairs.map((p) => p.id);
    // If length >= 4, shift order to make it an actual puzzle
    if (ids.length >= 4) {
      setRightItemsOrder([ids[1], ids[3], ids[0], ids[2], ...ids.slice(4)]);
    } else {
      setRightItemsOrder(ids);
    }
  }, [worksheet.matchingPairs]);

  const handleLeftNodeClick = (leftId: string) => {
    if (selectedLeftId === leftId) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(leftId);
    }
  };

  const handleRightNodeClick = (rightId: string) => {
    if (selectedLeftId) {
      // Create connection
      setUserConnections((prev) => ({
        ...prev,
        [selectedLeftId]: rightId,
      }));
      setSelectedLeftId(null);
    }
  };

  const clearConnection = (leftId: string) => {
    setUserConnections((prev) => {
      const copy = { ...prev };
      delete copy[leftId];
      return copy;
    });
  };

  // Toggle checklist for adab mission directly on canvas
  const toggleAdabChecked = (idx: number) => {
    const updated = [...worksheet.adabMissions];
    updated[idx] = { ...updated[idx], checked: !updated[idx].checked };
    onUpdateWorksheet({ ...worksheet, adabMissions: updated });
  };

  // Render SVG connector paths between left and right nodes
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<{
    lefts: Record<string, { x: number; y: number }>;
    rights: Record<string, { x: number; y: number }>;
  }>({ lefts: {}, rights: {} });

  const updateNodePositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const lefts: Record<string, { x: number; y: number }> = {};
    const rights: Record<string, { x: number; y: number }> = {};

    worksheet.matchingPairs.forEach((pair) => {
      const leftEl = containerRef.current?.querySelector(`[data-left-node="${pair.id}"]`);
      if (leftEl) {
        const rect = leftEl.getBoundingClientRect();
        lefts[pair.id] = {
          x: (rect.right - containerRect.left) / scale,
          y: (rect.top + rect.height / 2 - containerRect.top) / scale,
        };
      }
    });

    rightItemsOrder.forEach((rId) => {
      const rightEl = containerRef.current?.querySelector(`[data-right-node="${rId}"]`);
      if (rightEl) {
        const rect = rightEl.getBoundingClientRect();
        rights[rId] = {
          x: (rect.left - containerRect.left) / scale,
          y: (rect.top + rect.height / 2 - containerRect.top) / scale,
        };
      }
    });

    setNodePositions({ lefts, rights });
  };

  useEffect(() => {
    updateNodePositions();
    const timer = setTimeout(updateNodePositions, 100);
    window.addEventListener('resize', updateNodePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNodePositions);
    };
  }, [worksheet.matchingPairs, rightItemsOrder, scale]);

  return (
    <div className="w-full flex justify-center items-start overflow-x-auto py-4 px-2 select-text">
      {/* A4 Sheet wrapper with scaling */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
        }}
        className="transition-all duration-200"
      >
        <div
          ref={containerRef}
          id="a4-worksheet-canvas"
          className={`a4-paper-canvas relative bg-white text-slate-900 border border-slate-200/90 rounded-xs mx-auto print:rounded-none ${
            ecoPrintMode
              ? 'eco-print-active bg-white'
              : 'shadow-[0_15px_35px_-5px_rgba(2,132,199,0.15),0_0_0_1px_rgba(224,242,254,0.8)]'
          }`}
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '14mm 16mm 14mm 16mm',
            boxSizing: 'border-box',
          }}
        >
          {/* ========================================================= */}
          {/* 1. IDENTITAS LKPD & DATA SISWA                           */}
          {/* ========================================================= */}
          <div className="mb-3.5 pb-2 border-b border-slate-300">
            {/* Top Badge: Standard & Subject */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200 text-[9.5px] font-extrabold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
                <span>Kurikulum Merdeka SD &bull; Standar CP No. 020/H/KR/2026</span>
              </span>
              <span className="text-[10px] font-extrabold text-slate-600 tracking-wider uppercase font-mono">
                PAI & BUDI PEKERTI SD
              </span>
            </div>

            <div className="text-center mb-2">
              <h1 className="text-[14px] font-black text-slate-900 tracking-tight uppercase inline-block border-b-2 border-[#0284c7] pb-0.5 font-jakarta">
                {worksheet.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] text-slate-700 font-semibold mt-1">
                <span className="text-[#0284c7] font-bold">{worksheet.grade}</span>
                {worksheet.semester && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300">
                      {worksheet.semester}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{worksheet.chapter}</span>
                {worksheet.difficulty && (
                  <>
                    <span>•</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-extrabold border ${
                      worksheet.difficulty === 'Hard' || worksheet.difficulty.toLowerCase().includes('hots')
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : worksheet.difficulty === 'Easy' || worksheet.difficulty.toLowerCase().includes('mudah')
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}>
                      Level: {worksheet.difficulty}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>Waktu: {worksheet.duration}</span>
              </div>
            </div>

            {/* Student metadata info box */}
            <div className="grid grid-cols-12 gap-2 text-[10.5px] bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium">
              <div className="col-span-4 flex items-center gap-1.5">
                <span className="text-slate-500 font-bold w-12 flex-shrink-0">Nama:</span>
                <span className="font-semibold text-slate-800 border-b border-dashed border-slate-400 flex-1 h-5 pt-0.5">
                  ................................................
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <span className="text-slate-500 font-bold w-16 flex-shrink-0">Kelas/Smt:</span>
                <span className="font-semibold text-slate-800 border-b border-dashed border-slate-400 flex-1 h-5 pt-0.5">
                  ......................
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <span className="text-slate-500 font-bold w-12 flex-shrink-0">Tgl:</span>
                <span className="font-semibold text-slate-800 border-b border-dashed border-slate-400 flex-1 h-5 pt-0.5">
                  ......................
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1.5 bg-white border border-slate-300 rounded px-2 py-0.5 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Nilai:</span>
                <span className="font-extrabold text-xs text-[#0284c7]">___/100</span>
              </div>
            </div>

            {/* Capaian Pembelajaran Callout Banner */}
            <div className="mt-1.5 px-2.5 py-1 bg-sky-50/60 border-l-3 border-[#0284c7] rounded-r text-[9.5px] text-slate-700 leading-snug">
              <span className="font-bold text-[#0284c7]">Capaian Pembelajaran (CP): </span>
              {worksheet.curriculumStandard}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. DALIL CALLOUT BOX (SACRED SCRIPT / AMIRI RTL)          */}
          {/* ========================================================= */}
          <section className="mb-3.5">
            <div
              className={`rounded-xl border p-3 ${
                ecoPrintMode
                  ? 'border-slate-800 bg-white'
                  : 'border-l-4 border-l-[#0369a1] border-sky-200 bg-[#f0f9ff]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold text-[#0369a1] tracking-wider uppercase flex items-center gap-1.5 font-jakarta">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0369a1]" />
                  Dalil Naqli: {worksheet.dalil.surah}
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-white/80 border border-sky-200 px-2 py-0.5 rounded-full">
                  Kalam Ilahi
                </span>
              </div>

              {/* Amiri Arabic Sacred Script with generous vertical line clearance */}
              <div
                dir="rtl"
                className="font-amiri text-[17px] font-bold text-slate-900 leading-[32px] text-right py-1 tracking-wide"
              >
                {worksheet.dalil.arabic}
              </div>

              {/* Translation */}
              <p className="text-[10px] italic text-slate-700 leading-relaxed font-jakarta mt-1 border-t border-sky-100/80 pt-1">
                {worksheet.dalil.translation}
              </p>

              {/* Tadabbur Character Note */}
              <div className="mt-1.5 text-[9.5px] text-slate-600 bg-white/70 p-1.5 rounded border border-sky-100 flex items-start gap-1.5">
                <span className="text-amber-600 font-extrabold flex-shrink-0">💡 Hikmah:</span>
                <span className="font-medium">{worksheet.dalil.note}</span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 4. INTISARI KONSEP MATERI (COMPACT GRID)                  */}
          {/* ========================================================= */}
          {worksheet.materials.length > 0 && (
            <section className="mb-3.5">
              <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5 font-jakarta">
                <span className="w-4 h-4 rounded bg-[#0284c7] text-white flex items-center justify-center text-[9px] font-black">
                  A
                </span>
                {worksheet.materialsHeading.replace(/^[A-Z]\.\s*/, '')}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {worksheet.materials.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-[10.5px]">
                        {item.term}
                      </span>
                      {item.arabicBadge && (
                        <span className="font-amiri font-bold text-slate-800 text-[11px] px-1.5 bg-white border border-slate-200 rounded">
                          {item.arabicBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-tight text-[9.5px]">{item.meaning}</p>
                    <p className="text-[#0369a1] font-semibold text-[9px] pt-0.5">
                      ✓ Teladan: {item.behavior}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 5. GAMIFIED MATCH NODES (HUBUNGKAN GARIS INTERAKTIF/CETAK)*/}
          {/* ========================================================= */}
          <section className="mb-3.5 relative">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-jakarta">
                <span className="w-4 h-4 rounded bg-[#10b981] text-white flex items-center justify-center text-[9px] font-black">
                  B
                </span>
                {worksheet.matchingHeading.replace(/^[A-Z]\.\s*/, '')}
              </h3>
              {showTeacherKey && (
                <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Kunci Aktif
                </span>
              )}
            </div>

            <p className="text-[9.5px] text-slate-600 italic mb-2">
              {worksheet.matchingInstruction}
            </p>

            {/* SVG Connecting lines overlay for digital preview */}
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full z-10 print:hidden"
              style={{ overflow: 'visible' }}
            >
              {/* Render connected lines */}
              {(() => {
                const connectionsToRender: Record<string, string> = showTeacherKey
                  ? worksheet.matchingPairs.reduce<Record<string, string>>(
                      (acc, p) => ({ ...acc, [p.id]: p.id }),
                      {}
                    )
                  : userConnections;

                return Object.entries(connectionsToRender).map(([lId, rId]) => {
                  const start = nodePositions.lefts[lId];
                  const end = nodePositions.rights[rId];
                  if (!start || !end) return null;

                  const isCorrect = lId === rId;
                  const lineColor = showTeacherKey || isCorrect ? '#059669' : '#0284c7';

                  return (
                    <g key={`${lId}-${rId}`}>
                      <path
                        d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${
                          (start.x + end.x) / 2
                        } ${end.y}, ${end.x} ${end.y}`}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={2.5}
                        strokeDasharray={showTeacherKey ? 'none' : '4 2'}
                      />
                      <circle cx={start.x} cy={start.y} r={4} fill={lineColor} />
                      <circle cx={end.x} cy={end.y} r={4} fill={lineColor} />
                    </g>
                  );
                });
              })()}
            </svg>

            {/* Matching nodes grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 relative">
              {/* Left Column (Items & Outgoing node ⚪) */}
              <div className="space-y-2">
                {worksheet.matchingPairs.map((pair, index) => {
                  const isSelected = selectedLeftId === pair.id;
                  const isConnected = !!userConnections[pair.id];
                  const isKey = showTeacherKey;

                  return (
                    <div
                      key={pair.id}
                      className={`relative flex items-center justify-between p-2 rounded-lg border transition-all text-[10.5px] ${
                        isSelected
                          ? 'border-[#0284c7] bg-sky-50 ring-2 ring-sky-200'
                          : isKey
                          ? 'border-emerald-300 bg-emerald-50/60'
                          : isConnected
                          ? 'border-sky-300 bg-sky-50/40'
                          : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {pair.leftText}
                          </span>
                          {pair.leftArabic && (
                            <span className="text-[10px] font-amiri font-bold text-slate-600 block leading-none mt-0.5">
                              {pair.leftArabic}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Outgoing matching node indicator ⚪ */}
                      <button
                        type="button"
                        data-left-node={pair.id}
                        onClick={() => handleLeftNodeClick(pair.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? 'border-[#0284c7] bg-[#0284c7] text-white scale-110 shadow-xs'
                            : isConnected || isKey
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                            : 'border-slate-400 bg-white text-slate-400 hover:border-[#0284c7] hover:scale-105'
                        }`}
                        title="Klik simpul untuk menyambungkan garis ke makna kanan"
                      >
                        {isConnected || isKey ? (
                          <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                        ) : (
                          <span className="text-[9px]">⚪</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Right Column (Incoming node ⚪ & Definition) */}
              <div className="space-y-2">
                {rightItemsOrder.map((rId, rIndex) => {
                  const pairItem = worksheet.matchingPairs.find((p) => p.id === rId);
                  if (!pairItem) return null;

                  const isTargetConnected = Object.values(userConnections).includes(rId);
                  const isKey = showTeacherKey;

                  return (
                    <div
                      key={rId}
                      className={`relative flex items-center justify-between p-2 rounded-lg border transition-all text-[10.5px] ${
                        isKey
                          ? 'border-emerald-300 bg-emerald-50/60'
                          : isTargetConnected
                          ? 'border-sky-300 bg-sky-50/40'
                          : 'border-slate-200 bg-white hover:border-sky-300'
                      }`}
                    >
                      {/* Incoming matching node indicator ⚪ */}
                      <button
                        type="button"
                        data-right-node={rId}
                        onClick={() => handleRightNodeClick(rId)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isTargetConnected || isKey
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-slate-400 bg-white text-slate-400 hover:border-[#0284c7] hover:scale-105'
                        }`}
                        title="Klik untuk menghubungkan ke simpul kiri yang dipilih"
                      >
                        {isTargetConnected || isKey ? (
                          <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                        ) : (
                          <span className="text-[9px]">⚪</span>
                        )}
                      </button>

                      <div className="flex-1 ml-2 text-left">
                        <span className="text-[10px] text-slate-800 leading-tight block">
                          {pairItem.rightText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick reset connections helper in digital mode */}
            {Object.keys(userConnections).length > 0 && !showTeacherKey && (
              <div className="text-right mt-1 print:hidden">
                <button
                  onClick={() => setUserConnections({})}
                  className="text-[9px] font-semibold text-slate-500 hover:text-red-600 underline"
                >
                  Hapus Garis Sambungan
                </button>
              </div>
            )}
          </section>

          {/* ========================================================= */}
          {/* 6. SOAL EVALUASI HOTS & REFLEKSI DIRI                    */}
          {/* ========================================================= */}
          {worksheet.multipleChoice.length > 0 && (
            <section className="mb-3.5">
              <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5 font-jakarta">
                <span className="w-4 h-4 rounded bg-[#f59e0b] text-white flex items-center justify-center text-[9px] font-black">
                  C
                </span>
                {worksheet.multipleChoiceHeading.replace(/^[A-Z]\.\s*/, '')}
              </h3>

              <div className="space-y-2 text-[10px]">
                {worksheet.multipleChoice.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="font-extrabold text-slate-900 flex-shrink-0">
                        {qIndex + 1}.
                      </span>
                      <p className="text-slate-800 leading-snug">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 text-[9.5px]">
                      {q.options.map((opt, optIndex) => {
                        const isCorrectAnswer = q.correctAnswer === optIndex;
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-1.5 p-1 rounded ${
                              showTeacherKey && isCorrectAnswer
                                ? 'bg-emerald-100 font-bold text-emerald-900 border border-emerald-300'
                                : 'text-slate-700'
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[8.5px] font-bold">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {showTeacherKey && (
                      <div className="text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                        <strong>Kunci {String.fromCharCode(65 + q.correctAnswer)}:</strong>{' '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 7. REFLEKSI KARAKTER & LEMBAR TULISAN SISWA              */}
          {/* ========================================================= */}
          <section className="mb-3.5">
            <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tight mb-1 flex items-center gap-1.5 font-jakarta">
              <span className="w-4 h-4 rounded bg-[#0369a1] text-white flex items-center justify-center text-[9px] font-black">
                D
              </span>
              {worksheet.reflectiveHeading.replace(/^[A-Z]\.\s*/, '')}
            </h3>

            <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/50">
              <p className="text-[10px] font-semibold text-slate-800 mb-1 leading-snug">
                {worksheet.reflectivePrompt.question}
              </p>
              <p className="text-[9px] text-slate-500 italic mb-2">
                * {worksheet.reflectivePrompt.guidingHint}
              </p>

              {/* Hand-writing response lines for students */}
              <div className="space-y-3 pt-1">
                {Array.from({ length: worksheet.reflectivePrompt.lines || 3 }).map((_, lIdx) => (
                  <div
                    key={lIdx}
                    className="w-full border-b border-dashed border-slate-300 h-2"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 8. MISI AKHLAK & AMALAN HARIAN (ADAB MISSION CHECKLIST)   */}
          {/* ========================================================= */}
          {worksheet.adabMissions.length > 0 && (
            <section className="mb-3">
              <h3 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-tight mb-1 flex items-center gap-1.5 font-jakarta">
                <span className="w-4 h-4 rounded bg-[#059669] text-white flex items-center justify-center text-[9px] font-black">
                  E
                </span>
                {worksheet.adabHeading.replace(/^[A-Z]\.\s*/, '')}
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden text-[9.5px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold text-left border-b border-slate-200">
                      <th className="py-1 px-2 w-8 text-center">No</th>
                      <th className="py-1 px-2">Amalan Kebaikan Nyata</th>
                      <th className="py-1 px-2 w-48">Tadabbur Nilai Karakter</th>
                      <th className="py-1 px-2 w-16 text-center">Checklist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worksheet.adabMissions.map((item, mIdx) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-1 px-2 text-center font-bold text-slate-500">
                          {mIdx + 1}
                        </td>
                        <td className="py-1 px-2 font-medium text-slate-900">{item.task}</td>
                        <td className="py-1 px-2 text-slate-600 italic">{item.reflection}</td>
                        <td className="py-1 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleAdabChecked(mIdx)}
                            className={`w-4 h-4 mx-auto rounded border flex items-center justify-center transition-all ${
                              item.checked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-400 bg-white hover:border-emerald-500'
                            }`}
                          >
                            {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 9. FOOTER & RUBRIK PENILAIAN + TANDA TANGAN               */}
          {/* ========================================================= */}
          <footer className="mt-3 pt-2 border-t-2 border-slate-900 text-[9.5px]">
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* QR Audio & Verification Anchor */}
              <div className="col-span-4 flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <div className="w-10 h-10 bg-white border border-slate-300 rounded p-1 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-7 h-7 text-slate-800" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-slate-900 text-[9px]">
                    <Volume2 className="w-3 h-3 text-[#0284c7]" />
                    {worksheet.qrAudio.title}
                  </div>
                  <p className="text-[8px] text-slate-500 leading-tight">
                    {worksheet.qrAudio.subtitle}
                  </p>
                  <span className="font-mono text-[8px] font-bold text-[#0284c7]">
                    {worksheet.qrAudio.code}
                  </span>
                </div>
              </div>

              {/* Rubric Notes */}
              <div className="col-span-4 text-center px-2">
                <p className="text-[8.5px] font-bold text-slate-700 italic leading-snug">
                  "{worksheet.rubric.teacherNotes}"
                </p>
              </div>

              {/* Signatures */}
              <div className="col-span-4 flex justify-around text-center text-[9px] font-medium text-slate-700">
                <div>
                  <p>Orang Tua / Wali,</p>
                  <div className="h-8 border-b border-slate-400 mt-1 w-20" />
                </div>
                <div>
                  <p>Guru PAI-BP,</p>
                  <div className="h-8 border-b border-slate-400 mt-1 w-20" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] text-slate-400 mt-2 font-mono">
              <span>Dicetak via Lumina PAI SD Studio • Standar Kurikulum Merdeka CP No. 020/2026 • ISO 216 A4</span>
              <span>Halaman 1 dari 1</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
