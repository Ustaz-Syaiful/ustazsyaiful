import React, { useState, useEffect } from 'react';
import { RPHItem, ScriptType } from '../types';
import {
  X,
  Printer,
  Save,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  FileCheck,
  Award,
  CheckCircle,
  Copy,
  RefreshCw,
  Languages,
  Table,
  CheckSquare,
  Square,
  FileText,
  Info,
  Maximize2,
  Minimize2,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  convertRumiToJawi,
  getJawiRph,
  SCRIPT_LABELS,
  JAWI_DICTIONARY
} from '../utils/jawiConverter';
import {
  isTasmikRph,
  applyTasmikTemplate,
  createTasmikRph,
  TASMIK_OFFICIAL_DATA
} from '../data/tasmikConstants';
import { saveOrUpdateRptFromRph } from '../utils/rptStorage';

interface RphModalProps {
  isOpen: boolean;
  onClose: () => void;
  rph: RPHItem | null;
  onSave: (savedRph: RPHItem, options?: { syncRpt?: boolean }) => void;
  onSaveWithRpt?: (savedRph: RPHItem) => void;
}

export const RphModal: React.FC<RphModalProps> = ({
  isOpen,
  onClose,
  rph,
  onSave,
  onSaveWithRpt
}) => {
  const isEditing = Boolean(rph?.id);

  // Active script selection: 'rumi' or 'jawi'
  const [activeScript, setActiveScript] = useState<ScriptType>(rph?.preferredScript || 'jawi');
  const [isFitToScreen, setIsFitToScreen] = useState<boolean>(true);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const [formData, setFormData] = useState<RPHItem>(
    rph || {
      id: `rph-${Date.now()}`,
      week: 33,
      day: 'Isnin',
      date: new Date().toISOString().split('T')[0],
      time: '08:00 - 09:00 (60 Minit)',
      className: '4 Ibnu Sina',
      subject: 'Pendidikan Islam',
      learningArea: 'Al-Quran',
      topic: 'Tilawah: Membaca Surah Al-Balad dengan Bertajwid',
      contentStandard: '1.1 Membaca Surah Al-Balad dengan betul dan bertajwid secara beradab dan istiqamah.',
      learningStandard: '1.1.1 Membaca potongan ayat 1-10 Surah Al-Balad dengan sebutan makhraj yang betul.',
      objectives: [
        'Menyebut dan membaca ayat 1 hingga 10 Surah Al-Balad dengan makhraj yang betul selepas bimbingan guru.',
        'Mengenal pasti hukum nun sakinah dalam petikan ayat yang dibaca.'
      ],
      successCriteria: [
        'Murid membaca sekurang-kurangnya 5 ayat dengan lancar tanpa teragak-agak.',
        'Murid menandakan hukum tajwid pada lembaran kerja digital.'
      ],
      inductionActivity: 'Guru menayangkan video qari membaca surah dan bersoal jawab dengan murid tentang mesej pembukaan surah.',
      mainActivities: [
        'Guru memperdengarkan bacaan contoh ayat demi ayat (Kaedah Talaqqi Musyafahah).',
        'Murid mengikut bacaan guru secara kelas, kumpulan dan individu.',
        'Aktiviti berpasangan (Peer Tutoring): Murid memperdengarkan bacaan kepada rakan sebaya (Tasmik rakan).'
      ],
      closureActivity: 'Guru membuat penilaian lisan rawak dan merumuskan kepentingan istiqamah membaca Al-Quran setiap hari.',
      teachingAids: ['Mushaf Al-Quran Resam Uthmani', 'Slaid Canva / TV Pintar', 'Buku Teks Pendidikan Islam'],
      crossCurricularElements: ['Nilai Murni (Tawaduk)', 'Bahasa', 'Kelestarian Global'],
      pbdAssessment: 'Pentaksiran Lisan & Bacaan Bertajwid (Tahap Penguasaan TP3 & TP4)',
      reflection: '33/35 orang murid berjaya membaca ayat 1-10 dengan betul. 2 orang murid diberi bimbingan tasmik pemulihan.',
      status: 'Lengkap',
      preferredScript: 'jawi'
    }
  );

  // Dedicated state for Jawi fields to allow direct manual edits & fine-tuning
  const [jawiState, setJawiState] = useState(() => {
    const defaultJawi = getJawiRph(rph || formData);
    return {
      day: rph?.jawiOverrides?.day || defaultJawi.day,
      className: rph?.jawiOverrides?.className || defaultJawi.className,
      subject: rph?.jawiOverrides?.subject || defaultJawi.subject,
      topic: rph?.jawiOverrides?.topic || defaultJawi.topic,
      contentStandard: rph?.jawiOverrides?.contentStandard || defaultJawi.contentStandard,
      learningStandard: rph?.jawiOverrides?.learningStandard || defaultJawi.learningStandard,
      objectives: rph?.jawiOverrides?.objectives || defaultJawi.objectives,
      successCriteria: rph?.jawiOverrides?.successCriteria || defaultJawi.successCriteria,
      inductionActivity: rph?.jawiOverrides?.inductionActivity || defaultJawi.inductionActivity,
      mainActivities: rph?.jawiOverrides?.mainActivities || defaultJawi.mainActivities,
      closureActivity: rph?.jawiOverrides?.closureActivity || defaultJawi.closureActivity,
      teachingAids: rph?.jawiOverrides?.teachingAids || defaultJawi.teachingAids,
      crossCurricularElements: rph?.jawiOverrides?.crossCurricularElements || defaultJawi.crossCurricularElements,
      pbdAssessment: rph?.jawiOverrides?.pbdAssessment || defaultJawi.pbdAssessment,
      reflection: rph?.jawiOverrides?.reflection || defaultJawi.reflection
    };
  });

  // Tasmik-specific states
  const isTasmik = isTasmikRph(formData) || formData.subject.toLowerCase().includes('tasmik');
  const [tasmikViewMode, setTasmikViewMode] = useState<'jadual' | 'borang'>('jadual');
  const [masteredCount, setMasteredCount] = useState<number>(32);
  const [unmasteredCount, setUnmasteredCount] = useState<number>(2);
  const [totalStudents, setTotalStudents] = useState<number>(34);
  const [selectedTangguhReasons, setSelectedTangguhReasons] = useState<string[]>([]);

  useEffect(() => {
    if (rph) {
      setFormData(rph);
      setActiveScript(rph.preferredScript || (isTasmikRph(rph) ? 'jawi' : 'jawi'));
      const defaultJawi = getJawiRph(rph);
      setJawiState({
        day: rph.jawiOverrides?.day || defaultJawi.day,
        className: rph.jawiOverrides?.className || defaultJawi.className,
        subject: rph.jawiOverrides?.subject || defaultJawi.subject,
        topic: rph.jawiOverrides?.topic || defaultJawi.topic,
        contentStandard: rph.jawiOverrides?.contentStandard || defaultJawi.contentStandard,
        learningStandard: rph.jawiOverrides?.learningStandard || defaultJawi.learningStandard,
        objectives: rph.jawiOverrides?.objectives || defaultJawi.objectives,
        successCriteria: rph.jawiOverrides?.successCriteria || defaultJawi.successCriteria,
        inductionActivity: rph.jawiOverrides?.inductionActivity || defaultJawi.inductionActivity,
        mainActivities: rph.jawiOverrides?.mainActivities || defaultJawi.mainActivities,
        closureActivity: rph.jawiOverrides?.closureActivity || defaultJawi.closureActivity,
        teachingAids: rph.jawiOverrides?.teachingAids || defaultJawi.teachingAids,
        crossCurricularElements: rph.jawiOverrides?.crossCurricularElements || defaultJawi.crossCurricularElements,
        pbdAssessment: rph.jawiOverrides?.pbdAssessment || defaultJawi.pbdAssessment,
        reflection: rph.jawiOverrides?.reflection || defaultJawi.reflection
      });

      if (isTasmikRph(rph)) {
        setTasmikViewMode('jadual');
      }
    }
  }, [rph]);

  const [copyFeedback, setCopyFeedback] = useState(false);
  const [convertFeedback, setConvertFeedback] = useState(false);

  if (!isOpen) return null;

  // Enforce/Apply official Tasmik standardized format
  const handleApplyTasmik = () => {
    const updated = applyTasmikTemplate(formData);
    setFormData(updated);
    if (updated.jawiOverrides) {
      setJawiState(updated.jawiOverrides as any);
    }
    setActiveScript('jawi');
    setTasmikViewMode('jadual');
    setConvertFeedback(true);
    setTimeout(() => setConvertFeedback(false), 2000);
  };

  // Toggle tangguh reason
  const toggleTangguh = (reason: string) => {
    setSelectedTangguhReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  // Auto-generate fresh Jawi translation from current Rumi form data
  const handleAutoConvertToJawi = () => {
    const converted = getJawiRph(formData);
    setJawiState({
      day: converted.day,
      className: converted.className,
      subject: converted.subject,
      topic: converted.topic,
      contentStandard: converted.contentStandard,
      learningStandard: converted.learningStandard,
      objectives: converted.objectives,
      successCriteria: converted.successCriteria,
      inductionActivity: converted.inductionActivity,
      mainActivities: converted.mainActivities,
      closureActivity: converted.closureActivity,
      teachingAids: converted.teachingAids,
      crossCurricularElements: converted.crossCurricularElements,
      pbdAssessment: converted.pbdAssessment,
      reflection: converted.reflection
    });
    setConvertFeedback(true);
    setTimeout(() => setConvertFeedback(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const el = document.getElementById('rph-modal-printable-content');
      if (el) {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, Math.min(pageHeight - margin * 2, imgHeight));
        pdf.save(`e-RPH_${formData.className.replace(/[^a-zA-Z0-9]/g, '_')}_M${formData.week}.pdf`);
      } else {
        window.print();
      }
    } catch (e) {
      console.error('PDF export error:', e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const labels = SCRIPT_LABELS[activeScript];
  const isJawi = activeScript === 'jawi';

  const handleCopyText = () => {
    let textFormat = '';

    if (isTasmik) {
      if (isJawi) {
        textFormat = `
${TASMIK_OFFICIAL_DATA.jawi.title}
=====================================================
${TASMIK_OFFICIAL_DATA.jawi.subject} | ${TASMIK_OFFICIAL_DATA.jawi.learningArea}
ميڠݢو: ${formData.week} | هاري: ${jawiState.day} (${formData.date}) | ماس: ${formData.time} | كلس: ${formData.className}
تاجوق: ${TASMIK_OFFICIAL_DATA.jawi.topic}

اوبجيکتيف ڤمبلاجرن:
${TASMIK_OFFICIAL_DATA.jawi.objectives.join('\n')}

كريتيريا كجاياءن:
${TASMIK_OFFICIAL_DATA.jawi.successCriteria.join('\n')}

اكتيۏيتي:
${TASMIK_OFFICIAL_DATA.jawi.mainActivities.join('\n')}

ڤنيالين: ${TASMIK_OFFICIAL_DATA.jawi.penilaian}
KBAT: ${TASMIK_OFFICIAL_DATA.jawi.kbat}
باهن بنتو مڠاجر: ${TASMIK_OFFICIAL_DATA.jawi.teachingAids.join('، ')} | ڤنتكسيرن: ${TASMIK_OFFICIAL_DATA.jawi.pbdAssessment}

ريفليكسي:
${masteredCount} / ${totalStudents} اورغ موريد دافت مغواساءي أوجبيكتيف فمبالجرن دان دبري التيهن فغايأن / فغوكوهن.
${unmasteredCount} / ${totalStudents} اورغ موريد تيدق دافت مغواساءي اوجبيكتيف فمبالجرن دان دبري التيهن فموليهن.

${selectedTangguhReasons.length > 0 ? `تڠݢوه: ${selectedTangguhReasons.join('، ')}` : ''}
${TASMIK_OFFICIAL_DATA.jawi.checkedBy}
        `.trim();
      } else {
        textFormat = `
${TASMIK_OFFICIAL_DATA.rumi.title}
=====================================================
${TASMIK_OFFICIAL_DATA.rumi.subject} | ${TASMIK_OFFICIAL_DATA.rumi.learningArea}
Minggu: ${formData.week} | Hari: ${formData.day} (${formData.date}) | Masa: ${formData.time} | Kelas: ${formData.className}
Tajuk: ${TASMIK_OFFICIAL_DATA.rumi.topic}

Objektif Pembelajaran:
${TASMIK_OFFICIAL_DATA.rumi.objectives.join('\n')}

Kriteria Kejayaan:
${TASMIK_OFFICIAL_DATA.rumi.successCriteria.join('\n')}

Aktiviti:
${TASMIK_OFFICIAL_DATA.rumi.mainActivities.join('\n')}

Penilaian: ${TASMIK_OFFICIAL_DATA.rumi.penilaian}
KBAT: ${TASMIK_OFFICIAL_DATA.rumi.kbat}
BBM: ${TASMIK_OFFICIAL_DATA.rumi.teachingAids.join(', ')} | Pentaksiran: ${TASMIK_OFFICIAL_DATA.rumi.pbdAssessment}

Refleksi:
${masteredCount} / ${totalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan / pengukuhan.
${unmasteredCount} / ${totalStudents} orang murid tidak dapat menguasai objektif pembelajaran dan diberi latihan pemulihan.

${selectedTangguhReasons.length > 0 ? `Tangguh: ${selectedTangguhReasons.join(', ')}` : ''}
${TASMIK_OFFICIAL_DATA.rumi.checkedBy}
        `.trim();
      }
    } else if (isJawi) {
      textFormat = `
${labels.title}
=====================================================
${labels.ministry} • ${labels.school}
${labels.week}: ${formData.week} | ${labels.dayDate}: ${jawiState.day} (${formData.date}) | ${labels.time}: ${formData.time}
${labels.class}: ${jawiState.className} | ${labels.area}: ${JAWI_DICTIONARY[formData.learningArea.toLowerCase()] || formData.learningArea}
${labels.topic}: ${jawiState.topic}

1. ${labels.contentStandard}:
${jawiState.contentStandard}

2. ${labels.learningStandard}:
${jawiState.learningStandard}

3. ${labels.objectives}:
${(jawiState.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}

4. ${labels.successCriteria}:
${(jawiState.successCriteria || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

5. ${labels.activitiesHeading}:
- ${labels.induction} ${jawiState.inductionActivity}
- ${labels.main}
${(jawiState.mainActivities || []).map((a, i) => `  ${i + 1}) ${a}`).join('\n')}
- ${labels.closure} ${jawiState.closureActivity}

6. ${labels.teachingAids}: ${(jawiState.teachingAids || []).join('، ')}
7. ${labels.emk}: ${(jawiState.crossCurricularElements || []).join('، ')}
8. ${labels.pbd}: ${jawiState.pbdAssessment}
9. ${labels.reflection}: ${jawiState.reflection}
      `.trim();
    } else {
      textFormat = `
${labels.title}
=====================================================
${labels.ministry} • ${labels.school}
${labels.week}: ${formData.week} | ${labels.dayDate}: ${formData.day} (${formData.date}) | ${labels.time}: ${formData.time}
${labels.class}: ${formData.className} | ${labels.area}: ${formData.learningArea}
${labels.topic}: ${formData.topic}

1. ${labels.contentStandard}:
${formData.contentStandard}

2. ${labels.learningStandard}:
${formData.learningStandard}

3. ${labels.objectives}:
${(formData.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}

4. ${labels.successCriteria}:
${(formData.successCriteria || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

5. ${labels.activitiesHeading}:
- ${labels.induction} ${formData.inductionActivity}
- ${labels.main}
${(formData.mainActivities || []).map((a, i) => `  ${i + 1}) ${a}`).join('\n')}
- ${labels.closure} ${formData.closureActivity}

6. ${labels.teachingAids}: ${(formData.teachingAids || []).join(', ')}
7. ${labels.emk}: ${(formData.crossCurricularElements || []).join(', ')}
8. ${labels.pbd}: ${formData.pbdAssessment}
9. ${labels.reflection}: ${formData.reflection}
      `.trim();
    }

    navigator.clipboard.writeText(textFormat);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const buildFinalRph = (): RPHItem => {
    let updatedReflection = formData.reflection;
    let updatedJawiReflection = jawiState.reflection;

    if (isTasmik) {
      updatedReflection = `${masteredCount} / ${totalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan / pengukuhan.\n${unmasteredCount} / ${totalStudents} orang murid tidak dapat menguasai objektif pembelajaran dan diberi latihan pemulihan.${selectedTangguhReasons.length > 0 ? `\nTangguh: ${selectedTangguhReasons.join(', ')}` : ''}`;
      updatedJawiReflection = `${masteredCount} / ${totalStudents} اورغ موريد دافت مغواساءي أوجبيكتيف فمبالجرن دان دبري التيهن فغايأن / فغوكوهن.\n${unmasteredCount} / ${totalStudents} اورغ موريد تيدق دافت مغواساءي اوجبيكتيف فمبالجرن دان دبري التيهن فموليهن.${selectedTangguhReasons.length > 0 ? `\nتڠݢوه: ${selectedTangguhReasons.join('، ')}` : ''}`;
    }

    const isCurrentlyJawi = activeScript === 'jawi';

    const finalTopic = isCurrentlyJawi ? (jawiState.topic || formData.topic) : formData.topic;
    const finalContentStandard = isCurrentlyJawi ? (jawiState.contentStandard || formData.contentStandard) : formData.contentStandard;
    const finalLearningStandard = isCurrentlyJawi ? (jawiState.learningStandard || formData.learningStandard) : formData.learningStandard;
    const finalObjectives = isCurrentlyJawi && jawiState.objectives && jawiState.objectives.length > 0 ? jawiState.objectives : formData.objectives;
    const finalSuccessCriteria = isCurrentlyJawi && jawiState.successCriteria && jawiState.successCriteria.length > 0 ? jawiState.successCriteria : formData.successCriteria;
    const finalInduction = isCurrentlyJawi ? (jawiState.inductionActivity || formData.inductionActivity) : formData.inductionActivity;
    const finalMainActivities = isCurrentlyJawi && jawiState.mainActivities && jawiState.mainActivities.length > 0 ? jawiState.mainActivities : formData.mainActivities;
    const finalClosure = isCurrentlyJawi ? (jawiState.closureActivity || formData.closureActivity) : formData.closureActivity;
    const finalTeachingAids = isCurrentlyJawi && jawiState.teachingAids && jawiState.teachingAids.length > 0 ? jawiState.teachingAids : formData.teachingAids;
    const finalEmk = isCurrentlyJawi && jawiState.crossCurricularElements && jawiState.crossCurricularElements.length > 0 ? jawiState.crossCurricularElements : formData.crossCurricularElements;
    const finalPbd = isCurrentlyJawi ? (jawiState.pbdAssessment || formData.pbdAssessment) : formData.pbdAssessment;

    return {
      ...formData,
      topic: finalTopic,
      contentStandard: finalContentStandard,
      learningStandard: finalLearningStandard,
      objectives: finalObjectives,
      successCriteria: finalSuccessCriteria,
      inductionActivity: finalInduction,
      mainActivities: finalMainActivities,
      closureActivity: finalClosure,
      teachingAids: finalTeachingAids,
      crossCurricularElements: finalEmk,
      pbdAssessment: finalPbd,
      reflection: updatedReflection,
      preferredScript: activeScript,
      jawiOverrides: {
        ...jawiState,
        topic: finalTopic,
        contentStandard: finalContentStandard,
        learningStandard: finalLearningStandard,
        objectives: finalObjectives,
        successCriteria: finalSuccessCriteria,
        inductionActivity: finalInduction,
        mainActivities: finalMainActivities,
        closureActivity: finalClosure,
        teachingAids: finalTeachingAids,
        crossCurricularElements: finalEmk,
        pbdAssessment: finalPbd,
        reflection: updatedJawiReflection
      }
    };
  };

  // 1. Simpan di e-RPH Sahaja
  const handleSaveOnly = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const finalRph = buildFinalRph();
    window.dispatchEvent(new CustomEvent('rph_saved', { detail: finalRph }));
    onSave(finalRph, { syncRpt: false });
    onClose();
  };

  // 2. Simpan di e-RPH dan di RPT (Kekal)
  const handleSaveWithRpt = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const finalRph = buildFinalRph();
    // Simpan ke RPT secara kekal
    saveOrUpdateRptFromRph(finalRph);
    window.dispatchEvent(new CustomEvent('rph_saved', { detail: finalRph }));
    if (onSaveWithRpt) {
      onSaveWithRpt(finalRph);
    } else {
      onSave(finalRph, { syncRpt: true });
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleSaveOnly(e);
  };

  const currentTasmikData = isJawi ? TASMIK_OFFICIAL_DATA.jawi : TASMIK_OFFICIAL_DATA.rumi;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center ${
        isFitToScreen ? 'p-0' : 'p-2 sm:p-4'
      }`}
    >
      <div
        className={`bg-white text-slate-800 overflow-hidden flex flex-col transition-all ${
          isFitToScreen
            ? 'w-full h-full rounded-none border-0'
            : 'rounded-2xl w-full max-w-4xl shadow-2xl max-h-[94vh] border border-cyan-500/40'
        }`}
      >
        
        {/* Header bar (no-print) */}
        <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/30 no-print">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-700 flex items-center justify-center font-bold text-white shadow-md">
              <BookOpen className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white font-tech tracking-wide">
                  {isTasmik
                    ? 'e-RPH TASMIK AL-QURAN (FORMAT RASMI 2025/2026)'
                    : (isEditing ? 'KEMASKINI e-RPH DIGITAL' : 'PENYEDIA & PENJANA e-RPH KPM')}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isJawi ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-jawi' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-tech'
                }`}>
                  {isJawi ? 'جاوي (JAWI)' : 'RUMI'}
                </span>
                {isTasmik && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-tech">
                    PIAWAI SEMUA MINGGU/KELAS
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-200/80 font-sans-custom">
                {isTasmik
                  ? 'Garis Panduan Rasmi BPK / KPM: Tajuk, Objektif, Kriteria, Aktiviti, Penilaian, KBAT, BBM & Pentaksiran adalah piawai & sama sepanjang tahun.'
                  : 'Format Standard Bahagian Pembangunan Kurikulum (BPK) Kementerian Pendidikan Malaysia'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isTasmik && (
              <button
                type="button"
                onClick={handleApplyTasmik}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shadow font-tech"
                title="Terapkan Format Rasmi e-RPH Tasmik Piawai (Kekal Setiap Minggu/Kelas)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Format Tasmik</span>
              </button>
            )}

            {/* Fit to Screen Button */}
            <button
              type="button"
              onClick={() => setIsFitToScreen(!isFitToScreen)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-cyan-500/30 font-tech"
              title={isFitToScreen ? 'Keluar Mod Muat Skrin' : 'Buka Paparan Muat Skrin Penuh (Fit to Screen)'}
            >
              {isFitToScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isFitToScreen ? 'Saiz Piawai' : 'Fit to Screen'}</span>
            </button>

            {/* Muat Turun Format PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-md font-tech disabled:opacity-50"
              title="Muat Turun e-RPH dalam format dokumen PDF rasmi"
            >
              <FileDown className="w-3.5 h-3.5 text-white" />
              <span>{isExportingPdf ? 'Menjana PDF...' : 'Muat Turun (PDF)'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 border border-slate-700 font-tech"
              title="Salin Teks Lengkap RPH Mengikut Skrip Semasa"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copyFeedback ? 'Disalin!' : 'Salin Teks'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-md font-tech"
              title="Cetak Dokumen Rasmi e-RPH KPM"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Cetak Rasmi</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCRIPT SELECTOR & TASMIK NOTICE BAR (no-print) */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-cyan-500/30 flex flex-col gap-2 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider font-tech">
                PILIHAN SKRIP TULISAN e-RPH:
              </span>
              <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setActiveScript('rumi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition font-tech flex items-center space-x-1.5 ${
                    activeScript === 'rumi'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇲🇾 TULISAN RUMI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScript('jawi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    activeScript === 'jawi'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow font-jawi text-sm'
                      : 'text-slate-400 hover:text-white font-jawi'
                  }`}
                >
                  <span>🕌 توليسن جاوي (JAWI)</span>
                </button>
              </div>
            </div>

            {/* If Tasmik: Toggle View Mode */}
            {isTasmik ? (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-cyan-300 font-tech">PAPARAN:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-cyan-500/30">
                  <button
                    type="button"
                    onClick={() => setTasmikViewMode('jadual')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 font-tech ${
                      tasmikViewMode === 'jadual'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Jadual PDF Rasmi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTasmikViewMode('borang')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 font-tech ${
                      tasmikViewMode === 'borang'
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Borang Lengkap</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleApplyTasmik}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded border border-amber-400/40 transition flex items-center space-x-1 font-tech"
                  title="Muat semula nilai rasmi Tasmik"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Muat Semula</span>
                </button>
              </div>
            ) : (
              activeScript === 'jawi' && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleAutoConvertToJawi}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-950 to-emerald-950 hover:from-cyan-900 hover:to-emerald-900 text-cyan-300 text-xs font-semibold rounded-lg transition border border-cyan-500/40 flex items-center space-x-1.5 font-tech shadow"
                    title="Tukar teks Rumi ke Jawi secara automatik mengikut Sistem Ejaan Jawi Baharu Dewan Bahasa dan Pustaka (DBP)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{convertFeedback ? '✓ Teks Jawi Diselaraskan!' : '✨ Auto-Tukar Rumi ➡️ Jawi DBP'}</span>
                  </button>
                </div>
              )
            )}
          </div>

          {/* DBP & Tasmik Guidance Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
            {isTasmik ? (
              <div className="flex items-center space-x-2 text-emerald-300 font-sans-custom">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
                <span>
                  <b>Peringatan KPM:</b> Bagi e-RPH Tasmik, <b>Tajuk, Objektif, Kriteria Kejayaan, Aktiviti, Penilaian, KBAT, BBM dan Pentaksiran</b> adalah <b>sama bagi setiap minggu, tahun dan kelas</b> tiada sebarang perubahan.
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-300/90 font-jawi" dir="rtl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1.5"></span>
                <span>ڤياواين سيستم ايجاءن جاوي بهارو ديوان بهاس دان ڤوستاک (DBP) • ڤدومن ايجاءن جاوي يڠ دسمڤورناکن (PEJYD)</span>
              </div>
            )}

            {isJawi && !isTasmik && (
              <div className="flex items-center space-x-1 font-jawi" title="Klik aksara untuk salin pantas">
                <span className="text-slate-400 text-[10px] font-tech mr-1">AKSARA KHAS:</span>
                {['ء', 'أ', 'ڠ', 'ڤ', 'ݢ', 'چ', 'ڽ', 'ۏ', '٢', '،', '؛', '؟', 'ﷺ'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(char);
                    }}
                    className="px-1.5 py-0.5 bg-slate-900 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 rounded border border-slate-700 text-xs transition"
                    title={`Salin aksara '${char}'`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Body with printable layout */}
        <form
          id="rph-modal-printable-content"
          onSubmit={handleSubmit}
          className={`overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 bg-slate-50 text-sm sm:text-base text-slate-800 ${
            isJawi ? 'font-jawi text-right' : 'font-sans-custom text-left'
          }`}
          dir={isJawi ? 'rtl' : 'ltr'}
        >
          {/* ========================================================================= */}
          {/* OFFICIAL TASMIK PDF-STYLE TABLE VIEW (Shown when isTasmik & in Jadual mode) */}
          {/* ========================================================================= */}
          {isTasmik && tasmikViewMode === 'jadual' ? (
            <div className="space-y-4">
              {/* Informational Guidance Alert */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3.5 flex items-start space-x-3 rtl:space-x-reverse no-print">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-sans-custom">
                  <p className="font-bold text-emerald-900">
                    Ketetapan Piawai e-RPH Tasmik KSSR (2025/2026):
                  </p>
                  <p className="mt-0.5">
                    Kandungan <b>Tajuk</b>, <b>Objektif (1-3)</b>, <b>Kriteria Kejayaan</b>, <b>Aktiviti (1-4)</b>, <b>Penilaian (PBD)</b>, <b>KBAT</b>, <b>Bahan Bantu Mengajar (Al-Quran)</b> dan <b>Pentaksiran (Lisan)</b> adalah <b>kekal sama untuk semua minggu, tahun dan kelas</b>. Anda hanya perlu menyelaraskan maklumat sesi (Minggu, Hari, Tarikh, Masa, Kelas), bilangan murid dalam Refleksi, dan menandakan sebab Tangguh (jika PdPc ditangguhkan).
                  </p>
                </div>
              </div>

              {/* Editable Session Controls Bar (no-print) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-3 no-print font-sans-custom">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">{labels.week}:</label>
                  <input
                    type="number"
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-sm sm:text-base font-bold text-slate-800"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">{labels.dayDate}:</label>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    {isJawi ? (
                      <input
                        type="text"
                        value={jawiState.day}
                        onChange={(e) => setJawiState({ ...jawiState, day: e.target.value })}
                        className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-800 font-jawi"
                      />
                    ) : (
                      <select
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-sm sm:text-base font-semibold"
                      >
                        <option>Isnin</option>
                        <option>Selasa</option>
                        <option>Rabu</option>
                        <option>Khamis</option>
                        <option>Jumaat</option>
                      </select>
                    )}
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded px-1.5 py-1.5 text-sm sm:text-base"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">{labels.time}:</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-sm sm:text-base font-medium"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">{labels.class}:</label>
                  {isJawi ? (
                    <input
                      type="text"
                      value={jawiState.className}
                      onChange={(e) => setJawiState({ ...jawiState, className: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-800 font-jawi"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-sm sm:text-base font-bold text-slate-800"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">Status PdPc:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-sm sm:text-base font-bold text-emerald-800"
                  >
                    <option value="Lengkap">Lengkap / Disahkan</option>
                    <option value="Deraf">Deraf Awal</option>
                    <option value="Disemak PGB">Disemak PGB</option>
                  </select>
                </div>
              </div>

              {/* Exact Paper PDF Layout Container */}
              <div className="bg-white border-2 border-slate-900 p-4 sm:p-6 text-slate-900 shadow-lg rounded-none print:m-0 print:p-2 print:border-2 print:border-black print:w-full">
                {/* Header Banner matching PDF */}
                <div className="border border-slate-900 p-2.5 mb-3 bg-purple-50/70 flex items-center justify-between">
                  <div className="border border-slate-900 px-3 py-1 font-bold text-xs sm:text-sm bg-white text-slate-900 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span>{isJawi ? 'ميڠݢو' : 'Minggu'}</span>
                    <span className="font-mono font-black text-base px-1">[{formData.week}]</span>
                  </div>
                  <div className={`text-center font-bold text-base sm:text-lg text-purple-950 flex-1 mx-2 tracking-wide ${isJawi ? 'font-jawi text-lg sm:text-xl' : ''}`}>
                    {isJawi ? 'راخنغن فغاجرن هارين ( تسميع ) 2026/2025' : 'RANCANGAN PENGAJARAN HARIAN (TASMIK) 2025/2026'}
                  </div>
                  <div className="border border-slate-900 w-8 h-8 flex items-center justify-center bg-white">
                    <CheckSquare className="w-5 h-5 text-emerald-700" />
                  </div>
                </div>

                {/* Table matching PDF strictly with enlarged legible text in all boxes */}
                <table className="w-full border-collapse border-2 border-slate-900 text-sm sm:text-base">
                  <tbody>
                    {/* Row 1: Subjek & Bidang */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 w-36 text-center text-sm sm:text-base">
                        {isJawi ? 'مات ڤالجرن' : 'Mata Pelajaran'}
                      </td>
                      <td className={`border-r border-slate-900 p-3 font-bold text-center text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'فنديديقن إسلام ( تسميع )' : 'Pendidikan Islam (Tasmik)'}
                      </td>
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 w-32 text-center text-sm sm:text-base">
                        {isJawi ? 'بيدڠ' : 'Bidang'}
                      </td>
                      <td className={`p-3 font-bold text-center text-emerald-950 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'القرأن' : 'Al-Quran'}
                      </td>
                    </tr>

                    {/* Row 2: Hari, Tarikh, Masa, Kelas */}
                    <tr className="border-b border-slate-900 bg-amber-50/20">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'هاري' : 'Hari'}
                      </td>
                      <td className={`border-r border-slate-900 p-3 text-center font-bold text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg'}`}>
                        {isJawi ? jawiState.day : formData.day}
                      </td>
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'تاريـخ' : 'Tarikh'}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-900 text-sm sm:text-base">
                        {formData.date}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-900 bg-amber-50/20">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'ماس' : 'Masa'}
                      </td>
                      <td className="border-r border-slate-900 p-3 text-center font-bold text-slate-900 text-sm sm:text-base">
                        {formData.time}
                      </td>
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'كلس' : 'Kelas'}
                      </td>
                      <td className={`p-3 text-center font-bold text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg'}`}>
                        {isJawi ? jawiState.className : formData.className}
                      </td>
                    </tr>

                    {/* Row 3: Tajuk (Piawai) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
                          <span>{isJawi ? 'تاجوق' : 'Tajuk'}</span>
                        </div>
                      </td>
                      <td colSpan={3} className={`p-3 font-bold text-slate-950 text-center ${isJawi ? 'font-jawi text-xl sm:text-2xl leading-relaxed' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'سورة / اقرا مغيكوت تاهف باجأن' : 'Surah / Iqra mengikut tahap bacaan'}
                      </td>
                    </tr>

                    {/* Row 4: Objektif Pembelajaran (Piawai 1-3) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        {isJawi ? 'اوجبيكتيف فمبالجرن' : 'Objektif Pembelajaran'}
                      </td>
                      <td colSpan={3} className="p-3 space-y-2 leading-relaxed">
                        {isJawi ? (
                          <>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.1 ممباخ كلمة / اية دان سورة/ اقرا دغن بيمبيغن ضورو.</p>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.2 ممباخ اية درفد سورة دغن بتول.</p>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.3 ممباخ سورة دغن بتول دان مغيكوت مخرج سرتا برتجويد.</p>
                          </>
                        ) : (
                          <>
                            <p className="text-base sm:text-lg font-medium">1. Membaca kalimah / ayat dan surah / iqra dengan bimbingan guru.</p>
                            <p className="text-base sm:text-lg font-medium">2. Membaca ayat daripada surah dengan betul.</p>
                            <p className="text-base sm:text-lg font-medium">3. Membaca surah dengan betul dan mengikut makhraj serta bertajwid.</p>
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Row 5: Kriteria Kejayaan (Piawai) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        {isJawi ? 'كريترييا كجايأن' : 'Kriteria Kejayaan'}
                      </td>
                      <td colSpan={3} className="p-3 font-semibold text-slate-950">
                        {isJawi ? (
                          <span className="font-jawi text-lg sm:text-xl leading-loose">ممباخ سخارا كلس كومفولن دان اينديؤيدو</span>
                        ) : (
                          <span className="text-base sm:text-lg font-medium">Membaca secara kelas kumpulan dan individu</span>
                        )}
                      </td>
                    </tr>

                    {/* Row 6: Aktiviti (Piawai 1-4) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        {isJawi ? 'اكتيؤيتي' : 'Aktiviti'}
                      </td>
                      <td colSpan={3} className="p-3 space-y-2.5 leading-relaxed">
                        {isJawi ? (
                          <>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.1 ضورو مندغر باخاءن سورة / اقرا مغيكوت تاهف باجأن موريد سخارا اينديؤيدو</p>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.2 التيه توبي مثبوت/ممباخ كلمة، فوتوغن اية سورة / اقرا مغيكوت تاهف باجأن موريد سخارا اينديؤيدو دغن بتول دان برتجويد.</p>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.3 تسميع باخاءن سخارا اينديؤيدو (think pair share) دان دامل كومفولن (round robin).</p>
                            <p className="font-jawi text-lg sm:text-xl leading-loose">.4 ممفردغركن باخاءن سورة / اقرا مغيكوت تاهف باجأن موريد سخارا تلقي مشافهة</p>
                          </>
                        ) : (
                          <>
                            <p className="text-base sm:text-lg font-medium">1. Guru mendengar bacaan surah / iqra mengikut tahap bacaan murid secara individu.</p>
                            <p className="text-base sm:text-lg font-medium">2. Latih tubi menyebut/membaca kalimah, potongan ayat surah / iqra mengikut tahap bacaan murid secara individu dengan betul dan bertajwid.</p>
                            <p className="text-base sm:text-lg font-medium">3. Tasmik bacaan secara individu (think pair share) dan dalam kumpulan (round robin).</p>
                            <p className="text-base sm:text-lg font-medium">4. Memperdengarkan bacaan surah / iqra mengikut tahap bacaan murid secara talaqqi musyafahah.</p>
                          </>
                        )}
                      </td>
                    </tr>

                    {/* Row 7: Penilaian (Piawai) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        {isJawi ? 'فنيالين' : 'Penilaian'}
                      </td>
                      <td colSpan={3} className={`p-3 font-semibold ${isJawi ? 'font-jawi text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg'}`}>
                        {isJawi ? '-منرغكن مقصود. / -مثبوتكن صيفت.٢ / - التيهن برتوليس. (PBD)' : '-Menerangkan maksud. / -Menyebutkan sifat-sifat. / - Latihan bertulis. (PBD)'}
                      </td>
                    </tr>

                    {/* Row 8: KBAT (Piawai) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        KBAT
                      </td>
                      <td colSpan={3} className={`p-3 font-semibold text-slate-950 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'مغفليكسي - اناليسيس حكوم تجويد دان اية.' : 'Mengaplikasi - Analisis hukum tajwid dan ayat.'}
                      </td>
                    </tr>

                    {/* Row 9: BBM & Pentaksiran (Piawai) */}
                    <tr className="border-b border-slate-900">
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'باهن بنتو مغاجر' : 'Bahan Bantu Mengajar'}
                      </td>
                      <td className={`border-r border-slate-900 p-3 font-bold text-center text-emerald-950 ${isJawi ? 'font-jawi text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'القرأن' : 'Al-Quran'}
                      </td>
                      <td className="border-r border-slate-900 p-3 font-bold bg-slate-100/90 text-center text-sm sm:text-base">
                        {isJawi ? 'فنتكسرين' : 'Pentaksiran'}
                      </td>
                      <td className={`p-3 font-bold text-center text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'ليسن' : 'Lisan'}
                      </td>
                    </tr>

                    {/* Row 10: Refleksi Guru */}
                    <tr className="border-b border-slate-900 bg-amber-50/20">
                      <td className="border-r border-slate-900 p-3.5 font-bold bg-slate-100/90 text-center align-middle text-sm sm:text-base">
                        {isJawi ? 'ريفليكسي' : 'Refleksi'}
                      </td>
                      <td colSpan={3} className="p-3.5 space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-lg">
                          <input
                            type="number"
                            value={masteredCount}
                            onChange={(e) => setMasteredCount(parseInt(e.target.value) || 0)}
                            className="w-16 text-center font-bold border border-slate-400 bg-white rounded-lg px-2 py-1.5 text-slate-950 text-base sm:text-lg shadow-sm"
                            dir="ltr"
                          />
                          <span className="font-bold text-slate-400 text-lg">/</span>
                          <input
                            type="number"
                            value={totalStudents}
                            onChange={(e) => setTotalStudents(parseInt(e.target.value) || 0)}
                            className="w-16 text-center font-bold border border-slate-400 bg-white rounded-lg px-2 py-1.5 text-slate-950 text-base sm:text-lg shadow-sm"
                            dir="ltr"
                          />
                          <span className={`font-semibold text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg'}`}>
                            {isJawi ? 'اورغ موريد دافت مغواساءي أوجبيكتيف فمبالجرن دان دبري التيهن فغايأن / فغوكوهن' : 'orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan / pengukuhan.'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-lg">
                          <input
                            type="number"
                            value={unmasteredCount}
                            onChange={(e) => setUnmasteredCount(parseInt(e.target.value) || 0)}
                            className="w-16 text-center font-bold border border-slate-400 bg-white rounded-lg px-2 py-1.5 text-slate-950 text-base sm:text-lg shadow-sm"
                            dir="ltr"
                          />
                          <span className="font-bold text-slate-400 text-lg">/</span>
                          <span className="font-bold text-slate-950 px-2 text-lg">{totalStudents}</span>
                          <span className={`font-semibold text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl leading-loose' : 'text-base sm:text-lg'}`}>
                            {isJawi ? 'اورغ موريد تيدق دافت مغواساءي اوجبيكتيف فمبالجرن دان دبري التيهن فموليهن' : 'orang murid tidak dapat menguasai objektif pembelajaran dan diberi latihan pemulihan.'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 11: Tangguh */}
                    <tr className="border-b border-slate-900 bg-cyan-50/20">
                      <td colSpan={4} className="p-3.5">
                        <div className="text-base sm:text-lg font-bold mb-2.5 text-cyan-950 flex items-center justify-between">
                          <span className={isJawi ? 'font-jawi text-lg sm:text-xl' : ''}>{isJawi ? 'تغضوه : أكتيؤييت تيدق دافت دجالنكن كران -:' : 'Tangguh : Aktiviti tidak dapat dijalankan kerana -:'}</span>
                          <span className="text-xs sm:text-sm font-normal text-slate-600 font-sans-custom no-print">Tandakan jika berkaitan</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm sm:text-base">
                          {currentTasmikData.tangguhOptions.map((opt) => {
                            const isChecked = selectedTangguhReasons.includes(opt);
                            return (
                              <label
                                key={opt}
                                className={`flex items-center space-x-2 rtl:space-x-reverse cursor-pointer p-2 rounded-lg border transition ${
                                  isChecked ? 'bg-cyan-100 border-cyan-500 font-bold text-cyan-950' : 'border-transparent hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleTangguh(opt)}
                                  className="w-4 h-4 rounded text-cyan-700 border-slate-400"
                                />
                                <span className={isJawi ? 'font-jawi text-base sm:text-lg' : 'text-sm sm:text-base'}>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      </td>
                    </tr>

                    {/* Row 12: Disemak Oleh */}
                    <tr>
                      <td colSpan={4} className={`p-3 bg-slate-100/90 text-center font-bold text-slate-900 ${isJawi ? 'font-jawi text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
                        {isJawi ? 'د سيمق أوليه -: ضورو بسر @ فنولوغ کانن' : 'Disemak oleh -: Guru Besar @ Penolong Kanan'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Print Signatures */}
                <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-400 text-xs">
                  <div className="space-y-8">
                    <p className="font-bold">{isJawi ? 'تانداتاڠن ݢورو تسميع:' : 'Tandatangan Guru Tasmik:'}</p>
                    <div className="border-t border-slate-400 pt-1">
                      <p className="font-semibold">{isJawi ? 'نام ݢورو: استاد محمد حارث بن عبدالله' : 'Nama Guru: Ustaz Muhammad Harith bin Abdullah'}</p>
                      <p className="text-[10px] text-slate-600">{isJawi ? 'تاريخ: ........................................' : 'Tarikh: ........................................'}</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <p className="font-bold">{isJawi ? 'ڤڠسهن ڤنتدبير / ݢورو بسر (PGB):' : 'Pengesahan Pentadbir / Guru Besar (PGB):'}</p>
                    <div className="border-t border-slate-400 pt-1">
                      <p className="font-semibold">{isJawi ? 'چوڤ دان تانداتاڠن رسمي' : 'Cop & Tandatangan Rasmi'}</p>
                      <p className="text-[10px] text-slate-600">{isJawi ? 'تاريخ: ........................................' : 'Tarikh: ........................................'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* STANDARD / EDITABLE FORM VIEW (For general subjects or detailed inspection)*/
            /* ========================================================================= */
            <>
              {/* Official Document Header for Printing & Viewing */}
              <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
                  {labels.ministry}
                </h2>
                <h3 className="text-xs sm:text-sm font-bold text-emerald-800 uppercase">
                  {isTasmik ? (isJawi ? TASMIK_OFFICIAL_DATA.jawi.title : TASMIK_OFFICIAL_DATA.rumi.title) : labels.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                  {labels.school}
                </p>
              </div>

              {/* Grid Meta Information */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.week}:
                  </label>
                  <input
                    type="number"
                    value={formData.week}
                    onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-1 focus:ring-emerald-500 font-bold"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.dayDate}:
                  </label>
                  <div className="flex space-x-1.5 rtl:space-x-reverse">
                    {isJawi ? (
                      <input
                        type="text"
                        value={jawiState.day}
                        onChange={(e) => setJawiState({ ...jawiState, day: e.target.value })}
                        className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-base sm:text-lg font-bold text-emerald-900 font-jawi"
                        placeholder="هاري"
                      />
                    ) : (
                      <select
                        value={formData.day}
                        onChange={(e) => {
                          const newDay = e.target.value;
                          setFormData({ ...formData, day: newDay });
                          setJawiState({ ...jawiState, day: JAWI_DICTIONARY[newDay.toLowerCase()] || newDay });
                        }}
                        className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-sm sm:text-base font-semibold"
                      >
                        <option>Isnin</option>
                        <option>Selasa</option>
                        <option>Rabu</option>
                        <option>Khamis</option>
                        <option>Jumaat</option>
                      </select>
                    )}
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-sm sm:text-base font-semibold"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.time}:
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base font-semibold"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.class}:
                  </label>
                  {isJawi ? (
                    <input
                      type="text"
                      value={jawiState.className}
                      onChange={(e) => setJawiState({ ...jawiState, className: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-base sm:text-lg font-bold font-jawi text-slate-900"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base font-semibold"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.area}:
                  </label>
                  <select
                    value={formData.learningArea}
                    onChange={(e) => {
                      const newArea = e.target.value as any;
                      setFormData({ ...formData, learningArea: newArea });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm sm:text-base font-bold text-emerald-850"
                  >
                    <option value="Al-Quran">Al-Quran (القرءان)</option>
                    <option value="Hadis">Hadis (حديث)</option>
                    <option value="Akidah">Akidah (عقيدة)</option>
                    <option value="Ibadah">Ibadah (عبادة)</option>
                    <option value="Sirah">Sirah (سيرة)</option>
                    <option value="Adab">Adab Islamiah (ادب اسلاميه)</option>
                    <option value="Jawi">Jawi (جاوي)</option>
                    <option value="Bahasa Arab">Bahasa Arab (بهاس عرب)</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-3">
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.topic}:
                  </label>
                  {isJawi ? (
                    <input
                      type="text"
                      value={jawiState.topic}
                      onChange={(e) => setJawiState({ ...jawiState, topic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xl sm:text-2xl font-bold text-slate-900 font-jawi leading-relaxed"
                      dir="rtl"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-base sm:text-lg font-bold text-slate-900"
                      dir="ltr"
                    />
                  )}
                </div>
              </div>

              {/* Standard Kandungan & Pembelajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1.5">
                    {labels.contentStandard}:
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={3}
                      value={jawiState.contentStandard}
                      onChange={(e) => setJawiState({ ...jawiState, contentStandard: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={formData.contentStandard}
                      onChange={(e) => setFormData({ ...formData, contentStandard: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1.5">
                    {labels.learningStandard}:
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={3}
                      value={jawiState.learningStandard}
                      onChange={(e) => setJawiState({ ...jawiState, learningStandard: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={formData.learningStandard}
                      onChange={(e) => setFormData({ ...formData, learningStandard: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
              </div>

              {/* Objektif & Kriteria Kejayaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1.5 text-emerald-800">
                    {labels.objectives}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={3}
                      value={(jawiState.objectives || []).join('\n')}
                      onChange={(e) => setJawiState({ ...jawiState, objectives: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      placeholder="ساتو اوبجيکتيف ڤر باريس..."
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={(formData.objectives || []).join('\n')}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg font-sans-custom leading-relaxed font-medium"
                      placeholder="Satu objektif per baris..."
                      dir="ltr"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1.5 text-amber-800">
                    {labels.successCriteria}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={3}
                      value={(jawiState.successCriteria || []).join('\n')}
                      onChange={(e) => setJawiState({ ...jawiState, successCriteria: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      placeholder="ساتو کريتيريا ڤر باريس..."
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={(formData.successCriteria || []).join('\n')}
                      onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg font-sans-custom leading-relaxed font-medium"
                      placeholder="Satu kriteria per baris..."
                      dir="ltr"
                    />
                  )}
                </div>
              </div>

              {/* Aktiviti Pengajaran */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base uppercase tracking-wider text-slate-700">
                  {labels.activitiesHeading}
                </h4>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.induction}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={2}
                      value={jawiState.inductionActivity}
                      onChange={(e) => setJawiState({ ...jawiState, inductionActivity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={formData.inductionActivity}
                      onChange={(e) => setFormData({ ...formData, inductionActivity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.main}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={3}
                      value={(jawiState.mainActivities || []).join('\n')}
                      onChange={(e) => setJawiState({ ...jawiState, mainActivities: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      placeholder="ماسوقکن اکتيۏيتي ڤر باريس..."
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={(formData.mainActivities || []).join('\n')}
                      onChange={(e) => setFormData({ ...formData, mainActivities: e.target.value.split('\n') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      placeholder="Masukkan setiap langkah aktiviti per baris..."
                      dir="ltr"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                    {labels.closure}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={2}
                      value={jawiState.closureActivity}
                      onChange={(e) => setJawiState({ ...jawiState, closureActivity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={formData.closureActivity}
                      onChange={(e) => setFormData({ ...formData, closureActivity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
              </div>

              {/* BBM, EMK & PBD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1">
                    {labels.teachingAids}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={2}
                      value={(jawiState.teachingAids || []).join('، ')}
                      onChange={(e) => setJawiState({ ...jawiState, teachingAids: e.target.value.split('، ') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={(formData.teachingAids || []).join(', ')}
                      onChange={(e) => setFormData({ ...formData, teachingAids: e.target.value.split(', ') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1">
                    {labels.emk}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={2}
                      value={(jawiState.crossCurricularElements || []).join('، ')}
                      onChange={(e) => setJawiState({ ...jawiState, crossCurricularElements: e.target.value.split('، ') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={(formData.crossCurricularElements || []).join(', ')}
                      onChange={(e) => setFormData({ ...formData, crossCurricularElements: e.target.value.split(', ') })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-900 block mb-1">
                    {labels.pbd}
                  </label>
                  {isJawi ? (
                    <textarea
                      rows={2}
                      value={jawiState.pbdAssessment}
                      onChange={(e) => setJawiState({ ...jawiState, pbdAssessment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-lg sm:text-xl font-jawi leading-loose font-medium"
                      dir="rtl"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={formData.pbdAssessment}
                      onChange={(e) => setFormData({ ...formData, pbdAssessment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-base sm:text-lg leading-relaxed font-medium"
                      dir="ltr"
                    />
                  )}
                </div>
              </div>

              {/* Refleksi Guru */}
              <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-xl border border-emerald-200">
                <label className="text-xs sm:text-sm font-bold text-emerald-950 block mb-1.5 flex items-center justify-between">
                  <span>{labels.reflection}</span>
                  <span className="text-xs text-emerald-700 font-sans-custom">{labels.reflectionNote}</span>
                </label>
                {isJawi ? (
                  <textarea
                    rows={2}
                    value={jawiState.reflection}
                    onChange={(e) => setJawiState({ ...jawiState, reflection: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-3 text-lg sm:text-xl text-slate-900 font-jawi leading-loose font-medium"
                    dir="rtl"
                  />
                ) : (
                  <textarea
                    rows={2}
                    value={formData.reflection}
                    onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-3 text-base sm:text-lg text-slate-900 font-sans-custom leading-relaxed font-medium"
                    dir="ltr"
                  />
                )}
              </div>
            </>
          )}

          {/* Status & Action Bar (no-print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 no-print" dir="ltr">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-800 font-tech">{labels.status}</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 font-tech"
              >
                <option value="Lengkap">Lengkap / لڠکڤ (Sedia Dihantar)</option>
                <option value="Deraf">Deraf Awal / دراف اول</option>
                <option value="Disemak PGB">Disemak PGB / دسمق ڤݢب</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow font-tech disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>{isExportingPdf ? 'Menjana PDF...' : 'Muat Turun (Format PDF)'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition font-tech"
              >
                {labels.cancelBtn}
              </button>
              
              {/* 1. Butang Simpan Sedia Ada: Simpan Perubahan di e-RPH Sahaja */}
              <button
                type="button"
                onClick={handleSaveOnly}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-md font-tech"
                title="Simpan perubahan pada rekod e-RPH sahaja"
              >
                <Save className="w-4 h-4" />
                <span>{labels.saveOnlyBtn || labels.saveBtn} ({activeScript.toUpperCase()})</span>
              </button>

              {/* 2. Butang Simpan Baharu: Simpan Perubahan di e-RPH dan di RPT (Kekal) */}
              <button
                type="button"
                onClick={handleSaveWithRpt}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-md font-tech ring-2 ring-cyan-400/40"
                title={labels.saveWithRptDesc || 'Simpan perubahan di e-RPH dan di Rancangan Pengajaran Tahunan (RPT) secara kekal'}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{labels.saveWithRptBtn || 'Simpan e-RPH & RPT'} ({activeScript.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
