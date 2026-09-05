import React, { useState } from 'react';
import {
  StudentSahsiahRecord,
  SurauDutyItem,
  WelfareItem
} from '../types';
import {
  Users,
  Award,
  HeartHandshake,
  Star,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Printer,
  ChevronRight,
  BookOpen,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface HemViewProps {
  sahsiahRecords: StudentSahsiahRecord[];
  surauSchedule: SurauDutyItem[];
  welfareList: WelfareItem[];
  isAdmin: boolean;
  onAddGoodDeed: (studentId: string, title: string, category: any, points: number) => void;
  onAddSahsiahStudent: (student: StudentSahsiahRecord) => void;
  onUpdateSahsiahStudent: (student: StudentSahsiahRecord) => void;
  onDeleteSahsiahStudent: (id: string) => void;
  onAddSurauDuty: (duty: SurauDutyItem) => void;
  onUpdateSurauDuty: (duty: SurauDutyItem) => void;
  onDeleteSurauDuty: (id: string) => void;
  onAddWelfareItem: (item: WelfareItem) => void;
  onUpdateWelfareItem: (item: WelfareItem) => void;
  onDeleteWelfareItem: (id: string) => void;
}

export const HemView: React.FC<HemViewProps> = ({
  sahsiahRecords = [],
  surauSchedule = [],
  welfareList = [],
  isAdmin,
  onAddGoodDeed,
  onAddSahsiahStudent,
  onUpdateSahsiahStudent,
  onDeleteSahsiahStudent,
  onAddSurauDuty,
  onUpdateSurauDuty,
  onDeleteSurauDuty,
  onAddWelfareItem,
  onUpdateWelfareItem,
  onDeleteWelfareItem
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sahsiah' | 'surau' | 'kebajikan' | 'kbs'>('sahsiah');
  const [isAddDeedModalOpen, setIsAddDeedModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(sahsiahRecords?.[0]?.id || '');
  const [deedCategory, setDeedCategory] = useState<'Solat Berjemaah' | 'Khidmat Surau' | 'Bacaan Al-Quran' | 'Budi Pekerti' | 'Kepimpinan'>('Solat Berjemaah');
  const [deedTitle, setDeedTitle] = useState('');
  const [deedPoints, setDeedPoints] = useState(15);
  const [searchMurid, setSearchMurid] = useState('');

  // Admin Modals
  const [studentModalData, setStudentModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    student: StudentSahsiahRecord;
  }>({
    isOpen: false,
    isEditing: false,
    student: {
      id: '',
      studentName: '',
      className: '4 Ibnu Sina',
      meritScore: 100,
      badge: 'Bintang Sahsiah Emas',
      goodDeedsCount: 0,
      deeds: []
    }
  });

  const [surauModalData, setSurauModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    duty: SurauDutyItem;
  }>({
    isOpen: false,
    isEditing: false,
    duty: {
      id: '',
      day: 'Isnin',
      prayerName: 'Solat Zohor Berjemaah',
      imamName: '',
      bilalName: '',
      tazkirahPresenter: '',
      supervisorTeacher: 'Ustaz Muhammad Harith'
    }
  });

  const [welfareModalData, setWelfareModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    item: WelfareItem;
  }>({
    isOpen: false,
    isEditing: false,
    item: {
      id: '',
      studentName: '',
      className: '4 Ibnu Sina',
      category: 'Asnaf Miskin',
      assistanceType: 'Bantuan Pakaian & Mushaf Al-Quran',
      status: 'Selesai Diagih',
      sponsor: 'Panitia Pendidikan Islam'
    }
  });

  const filteredSahsiah = sahsiahRecords.filter((s) =>
    s.studentName.toLowerCase().includes(searchMurid.toLowerCase()) ||
    s.className.toLowerCase().includes(searchMurid.toLowerCase())
  );

  const handleDeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deedTitle.trim()) return;
    onAddGoodDeed(selectedStudentId, deedTitle, deedCategory, deedPoints);
    setDeedTitle('');
    setIsAddDeedModalOpen(false);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentModalData.isEditing) {
      onUpdateSahsiahStudent(studentModalData.student);
    } else {
      onAddSahsiahStudent({
        ...studentModalData.student,
        id: `sstd-${Date.now()}`
      });
    }
    setStudentModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveSurau = (e: React.FormEvent) => {
    e.preventDefault();
    if (surauModalData.isEditing) {
      onUpdateSurauDuty(surauModalData.duty);
    } else {
      onAddSurauDuty({
        ...surauModalData.duty,
        id: `sur-${Date.now()}`
      });
    }
    setSurauModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveWelfare = (e: React.FormEvent) => {
    e.preventDefault();
    if (welfareModalData.isEditing) {
      onUpdateWelfareItem(welfareModalData.item);
    } else {
      onAddWelfareItem({
        ...welfareModalData.item,
        id: `welf-${Date.now()}`
      });
    }
    setWelfareModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEM Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-950 via-[#041525] to-emerald-950/80 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-tech tracking-wide">PENGURUSAN HAL EHWAL MURID (HEM) ISLAMIAH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-tech">
            Modul HEM & Sahsiah Murid <span className="text-cyan-400 text-sm font-mono">[SSDM-HUD]</span>
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 max-w-xl font-sans-custom">
            Pemupukan sahsiah terpuji melalui Sistem Amalan Baik SSDM, pengimarahan Surau An-Nur, Kem Bestari Solat (KBS) dan Kebajikan Asnaf.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={() => setIsAddDeedModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center space-x-1.5 font-tech tracking-wide"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Rekod Amalan Baik SSDM</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-cyan-500/30 shadow-lg backdrop-blur-md overflow-x-auto">
        {[
          { id: 'sahsiah', label: 'Sahsiah Terpuji SSDM', icon: Star, count: sahsiahRecords.length },
          { id: 'surau', label: 'Pengimarahan Surau', icon: ShieldCheck, count: surauSchedule.length },
          { id: 'kbs', label: 'Kem Bestari Solat (KBS)', icon: BookOpen, count: 2 },
          { id: 'kebajikan', label: 'Kebajikan & Asnaf', icon: HeartHandshake, count: welfareList.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-cyan-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span className="font-tech tracking-wide">{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-cyan-950/80 text-amber-300 border border-amber-400/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: SAHSIAH TERPUJI SSDM */}
      {activeSubTab === 'sahsiah' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-4 rounded-xl border border-cyan-500/30 shadow-md backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-cyan-500/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari murid atau kelas..."
                value={searchMurid}
                onChange={(e) => setSearchMurid(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-cyan-500/30 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none font-sans-custom"
              />
            </div>

            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() =>
                    setStudentModalData({
                      isOpen: true,
                      isEditing: false,
                      student: {
                        id: '',
                        studentName: '',
                        className: '4 Ibnu Sina',
                        meritScore: 100,
                        badge: 'Bintang Sahsiah Emas',
                        goodDeedsCount: 0,
                        deeds: []
                      }
                    })
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Murid Sahsiah</span>
                </button>
              )}

              <button
                onClick={() => setIsAddDeedModalOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(251,191,36,0.3)] font-tech tracking-wide"
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
                <span>+ Catat Amalan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSahsiah.map((record) => {
              const deedsList = record.deeds || record.goodDeeds || [];
              const score = record.meritScore ?? record.points ?? 0;
              const badgeName = record.badge || record.levelBadge || 'Bintang Sahsiah';
              const deedsCount = record.goodDeedsCount ?? deedsList.length;

              return (
                <div
                  key={record.id}
                  className="bg-slate-950/75 rounded-2xl border border-cyan-500/25 p-5 shadow-lg space-y-4 hover:border-cyan-400/50 transition backdrop-blur-sm flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition font-tech">{record.studentName}</h3>
                        <p className="text-xs text-cyan-400/70 font-mono mt-0.5">{record.className}</p>
                      </div>

                      <div className="text-right flex items-center space-x-1">
                        <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-400/40 text-amber-300 rounded-lg text-xs font-bold font-mono shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                          {score} Mata
                        </span>

                        {isAdmin && (
                          <div className="flex items-center space-x-0.5">
                            <button
                              onClick={() =>
                                setStudentModalData({
                                  isOpen: true,
                                  isEditing: true,
                                  student: { ...record, points: score, meritScore: score, badge: badgeName, levelBadge: badgeName, goodDeeds: deedsList, deeds: deedsList }
                                })
                              }
                              className="p-1 text-slate-400 hover:text-amber-400 rounded"
                              title="Sunting Murid"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Padam rekod sahsiah murid "${record.studentName}"?`)) {
                                  onDeleteSahsiahStudent(record.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded"
                              title="Padam Murid"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-semibold font-tech">{badgeName}</span>
                      <span className="text-emerald-400 font-bold font-mono">{deedsCount} Amalan Direkod</span>
                    </div>

                    {/* Deeds list */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-wider font-tech">
                        Amalan Baik Terkini:
                      </span>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {deedsList.map((deed) => (
                          <div
                            key={deed.id}
                            className="p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs flex items-center justify-between hover:border-cyan-500/30 transition"
                          >
                            <div className="truncate pr-2">
                              <span className="font-semibold text-slate-200 block truncate">{deed.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{deed.category} • {deed.date}</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-[11px] shrink-0 font-mono">
                              +{deed.points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedStudentId(record.id);
                        setIsAddDeedModalOpen(true);
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-tech tracking-wide transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catat Amalan Baharu</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PENGIMARAHAN SURAU */}
      {activeSubTab === 'surau' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-5 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-100 font-tech">
                  Jadual Bertugas Imam & Bilal Cilik (Surau An-Nur)
                </h3>
                <p className="text-xs text-cyan-200/70 font-sans-custom">
                  Latihan amali kepimpinan solat berjemaah bagi murid Tahun 4, 5 dan 6.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 rounded-full font-mono">
                  Sesi Persekolahan 2026
                </span>

                {isAdmin && (
                  <button
                    onClick={() =>
                      setSurauModalData({
                        isOpen: true,
                        isEditing: false,
                        duty: {
                          id: '',
                          day: 'Isnin',
                          prayerName: 'Solat Zohor Berjemaah',
                          imamName: '',
                          bilalName: '',
                          tazkirahPresenter: '',
                          supervisorTeacher: 'Ustaz Muhammad Harith'
                        }
                      })
                    }
                    className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Slot Bertugas</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-cyan-300 uppercase text-[10px] tracking-wider font-tech border-b border-cyan-500/30">
                  <tr>
                    <th className="p-3">Hari</th>
                    <th className="p-3">Program / Solat</th>
                    <th className="p-3">Imam Cilik</th>
                    <th className="p-3">Bilal Cilik</th>
                    <th className="p-3">Penyampai Tazkirah</th>
                    <th className="p-3">Guru Pembimbing</th>
                    {isAdmin && <th className="p-3 text-right">Tindakan</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {surauSchedule.map((duty) => (
                    <tr key={duty.id} className="hover:bg-cyan-950/20 transition">
                      <td className="p-3 font-bold text-cyan-400 font-tech">{duty.day}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px] font-mono">
                          {duty.prayerName}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{duty.imamName}</td>
                      <td className="p-3 font-medium text-slate-200">{duty.bilalName}</td>
                      <td className="p-3 text-slate-400">{duty.tazkirahPresenter}</td>
                      <td className="p-3 text-slate-300 font-medium">{duty.supervisorTeacher}</td>
                      {isAdmin && (
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() =>
                                setSurauModalData({
                                  isOpen: true,
                                  isEditing: true,
                                  duty: { ...duty }
                                })
                              }
                              className="p-1 text-slate-400 hover:text-amber-400 rounded"
                              title="Sunting Slot"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Padam jadual bertugas hari ${duty.day}?`)) {
                                  onDeleteSurauDuty(duty.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded"
                              title="Padam Slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: KEM BESTARI SOLAT (KBS) & KCJ */}
      {activeSubTab === 'kbs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-950/75 rounded-2xl border border-cyan-500/30 p-5 shadow-lg space-y-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-cyan-300">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm font-tech">Kem Bestari Solat (KBS) Tahap 1 & 2</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans-custom">
                Program intensif j-QAF memastikan semua murid menguasai wuduk sempurna, tertib rukun 13, bacaan dalam solat, dan penghayatan solat fardhu 5 waktu.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pelaksanaan Siri 1:</span>
                  <span className="font-bold text-emerald-400 font-mono">April 2026 (Selesai - 98% Lulus)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pelaksanaan Siri 2:</span>
                  <span className="font-bold text-emerald-400 font-mono">Ogos 2026 (Selesai - 100% Lulus)</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-xl text-xs text-cyan-200">
                <b className="text-cyan-300 font-tech">Modul Ujian Amali:</b> Niat solat 5 waktu, bacaan Tahiyyat Akhir, Doa Qunut, Sujud Sahwi, dan Solat Jenazah asas.
              </div>
            </div>

            <div className="bg-slate-950/75 rounded-2xl border border-cyan-500/30 p-5 shadow-lg space-y-3 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-teal-300">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm font-tech">Kem Cemerlang Jawi (KCJ)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans-custom">
                Program pemulihan dan pengukuhan Jawi untuk murid yang belum menguasai kemahiran menyambung huruf dan membaca petikan teks Jawi.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bilangan Murid Terlibat:</span>
                  <span className="font-bold text-slate-200 font-mono">18 Orang (Tahap 1 & 2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Pencapaian:</span>
                  <span className="font-bold text-teal-400 font-mono">15 Orang Berjaya Lepas Ujian Pos</span>
                </div>
              </div>

              <div className="p-3 bg-teal-950/50 border border-teal-500/30 rounded-xl text-xs text-teal-200">
                <b className="text-teal-300 font-tech">Kaedah Pengajaran:</b> Kad Imbasan Padanan Huruf, Papan Tulis Mini, dan Modul Didik Hibur "Jawi Itu Mudah".
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: KEBAJIKAN & ASNAF */}
      {activeSubTab === 'kebajikan' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-5 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-100 font-tech">
                  Skim Bantuan Kasih & Tabung Kebajikan Asnaf
                </h3>
                <p className="text-xs text-cyan-200/70 font-sans-custom">
                  Agihan bantuan kelengkapan solat, pek persekolahan dan mushaf Al-Quran bagi murid yang memerlukan.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-3 py-1 bg-amber-950/60 border border-amber-400/40 text-amber-300 rounded-full font-mono">
                  {welfareList.length} Murid Menerima Bantuan
                </span>

                {isAdmin && (
                  <button
                    onClick={() =>
                      setWelfareModalData({
                        isOpen: true,
                        isEditing: false,
                        item: {
                          id: '',
                          studentName: '',
                          className: '4 Ibnu Sina',
                          category: 'Asnaf Miskin',
                          assistanceType: 'Bantuan Pakaian & Mushaf Al-Quran',
                          status: 'Selesai Diagih',
                          sponsor: 'Panitia Pendidikan Islam'
                        }
                      })
                    }
                    className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Penerima Bantuan</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {welfareList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-100 font-tech">{item.studentName}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono">
                        {item.category}
                      </span>
                      {isAdmin && (
                        <div className="flex items-center space-x-0.5">
                          <button
                            onClick={() =>
                              setWelfareModalData({
                                isOpen: true,
                                isEditing: true,
                                item: { ...item }
                              })
                            }
                            className="p-1 text-slate-400 hover:text-amber-400 rounded"
                            title="Sunting Penerima"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Padam rekod bantuan "${item.studentName}"?`)) {
                                onDeleteWelfareItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="Padam Penerima"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    <b className="text-slate-300">Kelas:</b> {item.className}
                  </p>

                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                    <span className="font-semibold text-cyan-300 block font-tech">Bentuk Bantuan:</span>
                    <p className="text-slate-300 mt-0.5">{item.assistanceType}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">Penaja: {item.sponsor}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Status Agihan:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH AMALAN BAIK SSDM ================= */}
      {isAddDeedModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div>
                <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                  Rekod Amalan Baik Murid (SSDM Digital)
                </h3>
                <p className="text-xs text-slate-400 font-sans-custom">
                  Pemberian mata merit sahsiah terpuji & akhlak Islamiah
                </p>
              </div>
              <button
                onClick={() => setIsAddDeedModalOpen(false)}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1 font-tech">Pilih Murid:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-xs text-slate-200 font-semibold focus:border-cyan-400 focus:outline-none"
                >
                  {sahsiahRecords.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-slate-200">
                      {s.studentName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1 font-tech">Kategori Amalan Terpuji:</label>
                <select
                  value={deedCategory}
                  onChange={(e) => setDeedCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-xs text-slate-200 font-semibold focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Solat Berjemaah" className="bg-slate-950 text-slate-200">Solat Berjemaah / Azan / Iqamah</option>
                  <option value="Khidmat Surau" className="bg-slate-950 text-slate-200">Khidmat Kebersihan Surau & Rehal</option>
                  <option value="Bacaan Al-Quran" className="bg-slate-950 text-slate-200">Membaca & Membimbing Tasmik Al-Quran</option>
                  <option value="Budi Pekerti" className="bg-slate-950 text-slate-200">Budi Pekerti / Menghormati Guru & Rakan</option>
                  <option value="Kepimpinan" className="bg-slate-950 text-slate-200">Kepimpinan Program / Da'i Cilik</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1 font-tech">Perincian Amalan Baik:</label>
                <input
                  type="text"
                  placeholder="Contoh: Mengimamkan Solat Zohor dengan tertib..."
                  value={deedTitle}
                  onChange={(e) => setDeedTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1 font-tech">Mata Merit Diberi:</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={deedPoints}
                  onChange={(e) => setDeedPoints(parseInt(e.target.value) || 10)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-xs font-bold text-amber-300 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setIsAddDeedModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Amalan Baik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL MURID SAHSIAH ================= */}
      {studentModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {studentModalData.isEditing ? 'Sunting Murid Sahsiah' : 'Tambah Murid Sahsiah Baru'}
              </h3>
              <button
                onClick={() => setStudentModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Penuh Murid:</label>
                <input
                  type="text"
                  value={studentModalData.student.studentName}
                  onChange={(e) =>
                    setStudentModalData((prev) => ({
                      ...prev,
                      student: { ...prev.student, studentName: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Muhammad Harith bin Zulkifli"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kelas:</label>
                  <input
                    type="text"
                    value={studentModalData.student.className}
                    onChange={(e) =>
                      setStudentModalData((prev) => ({
                        ...prev,
                        student: { ...prev.student, className: e.target.value }
                      }))
                    }
                    placeholder="4 Ibnu Sina"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Mata Merit Sahsiah:</label>
                  <input
                    type="number"
                    value={studentModalData.student.meritScore}
                    onChange={(e) =>
                      setStudentModalData((prev) => ({
                        ...prev,
                        student: { ...prev.student, meritScore: parseInt(e.target.value) || 0 }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-amber-300 font-bold font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Anugerah / Lencana Sahsiah:</label>
                <select
                  value={studentModalData.student.badge}
                  onChange={(e) =>
                    setStudentModalData((prev) => ({
                      ...prev,
                      student: { ...prev.student, badge: e.target.value }
                    }))
                  }
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-semibold focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Bintang Sahsiah Emas" className="bg-slate-950 text-slate-200">Bintang Sahsiah Emas</option>
                  <option value="Bintang Sahsiah Perak" className="bg-slate-950 text-slate-200">Bintang Sahsiah Perak</option>
                  <option value="Tokoh Sahsiah Terpuji" className="bg-slate-950 text-slate-200">Tokoh Sahsiah Terpuji</option>
                  <option value="Da'i Cilik Harapan" className="bg-slate-950 text-slate-200">Da'i Cilik Harapan</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setStudentModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Rekod Murid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL JADUAL SURAU ================= */}
      {surauModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {surauModalData.isEditing ? 'Sunting Jadual Bertugas Surau' : 'Tambah Slot Bertugas Surau'}
              </h3>
              <button
                onClick={() => setSurauModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurau} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Hari:</label>
                  <select
                    value={surauModalData.duty.day}
                    onChange={(e) =>
                      setSurauModalData((prev) => ({
                        ...prev,
                        duty: { ...prev.duty, day: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-bold focus:border-cyan-400 focus:outline-none"
                  >
                    {['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'].map((d) => (
                      <option key={d} value={d} className="bg-slate-950 text-slate-200">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Program / Solat:</label>
                  <input
                    type="text"
                    value={surauModalData.duty.prayerName}
                    onChange={(e) =>
                      setSurauModalData((prev) => ({
                        ...prev,
                        duty: { ...prev.duty, prayerName: e.target.value }
                      }))
                    }
                    placeholder="Solat Zohor / Solat Hajat"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Imam Cilik:</label>
                  <input
                    type="text"
                    value={surauModalData.duty.imamName}
                    onChange={(e) =>
                      setSurauModalData((prev) => ({
                        ...prev,
                        duty: { ...prev.duty, imamName: e.target.value }
                      }))
                    }
                    placeholder="Nama murid imam"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Bilal Cilik:</label>
                  <input
                    type="text"
                    value={surauModalData.duty.bilalName}
                    onChange={(e) =>
                      setSurauModalData((prev) => ({
                        ...prev,
                        duty: { ...prev.duty, bilalName: e.target.value }
                      }))
                    }
                    placeholder="Nama murid bilal"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Penyampai Tazkirah:</label>
                <input
                  type="text"
                  value={surauModalData.duty.tazkirahPresenter}
                  onChange={(e) =>
                    setSurauModalData((prev) => ({
                      ...prev,
                      duty: { ...prev.duty, tazkirahPresenter: e.target.value }
                    }))
                  }
                  placeholder="Nama murid tazkirah"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Guru Pembimbing:</label>
                <input
                  type="text"
                  value={surauModalData.duty.supervisorTeacher}
                  onChange={(e) =>
                    setSurauModalData((prev) => ({
                      ...prev,
                      duty: { ...prev.duty, supervisorTeacher: e.target.value }
                    }))
                  }
                  placeholder="Ustaz / Ustazah"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setSurauModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Jadual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KEBAJIKAN & ASNAF ================= */}
      {welfareModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {welfareModalData.isEditing ? 'Sunting Rekod Bantuan Asnaf' : 'Tambah Penerima Bantuan Baru'}
              </h3>
              <button
                onClick={() => setWelfareModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWelfare} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Penuh Murid:</label>
                <input
                  type="text"
                  value={welfareModalData.item.studentName}
                  onChange={(e) =>
                    setWelfareModalData((prev) => ({
                      ...prev,
                      item: { ...prev.item, studentName: e.target.value }
                    }))
                  }
                  placeholder="Nama murid"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kelas:</label>
                  <input
                    type="text"
                    value={welfareModalData.item.className}
                    onChange={(e) =>
                      setWelfareModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, className: e.target.value }
                      }))
                    }
                    placeholder="4 Ibnu Sina"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kategori:</label>
                  <select
                    value={welfareModalData.item.category}
                    onChange={(e) =>
                      setWelfareModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, category: e.target.value as any }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-semibold focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Asnaf Fakir" className="bg-slate-950 text-slate-200">Asnaf Fakir</option>
                    <option value="Asnaf Miskin" className="bg-slate-950 text-slate-200">Asnaf Miskin</option>
                    <option value="Anak Yatim" className="bg-slate-950 text-slate-200">Anak Yatim</option>
                    <option value="Mualaf" className="bg-slate-950 text-slate-200">Mualaf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Bentuk Bantuan:</label>
                <input
                  type="text"
                  value={welfareModalData.item.assistanceType}
                  onChange={(e) =>
                    setWelfareModalData((prev) => ({
                      ...prev,
                      item: { ...prev.item, assistanceType: e.target.value }
                    }))
                  }
                  placeholder="Pek Persekolahan & Wang Zakat"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Penaja / Sumber:</label>
                  <input
                    type="text"
                    value={welfareModalData.item.sponsor}
                    onChange={(e) =>
                      setWelfareModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, sponsor: e.target.value }
                      }))
                    }
                    placeholder="Panitia / PIBG / MAIWP"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-medium focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Status Agihan:</label>
                  <select
                    value={welfareModalData.item.status}
                    onChange={(e) =>
                      setWelfareModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, status: e.target.value as any }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 text-slate-200 font-semibold focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Selesai Diagih" className="bg-slate-950 text-slate-200">Selesai Diagih</option>
                    <option value="Dalam Proses" className="bg-slate-950 text-slate-200">Dalam Proses</option>
                    <option value="Menunggu Kelulusan" className="bg-slate-950 text-slate-200">Menunggu Kelulusan</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setWelfareModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Bantuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
