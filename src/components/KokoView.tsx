import React, { useState } from 'react';
import {
  KokoClubItem,
  MqssCompetition
} from '../types';
import {
  Award,
  Users,
  Trophy,
  Calendar,
  Sparkles,
  CheckCircle2,
  Medal,
  Music,
  PenTool,
  Search,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface KokoViewProps {
  clubsData: KokoClubItem[];
  mqssCompetitions: MqssCompetition[];
  isAdmin: boolean;
  onUpdateClub: (club: KokoClubItem) => void;
  onAddMqss: (mqss: MqssCompetition) => void;
  onUpdateMqss: (mqss: MqssCompetition) => void;
  onDeleteMqss: (id: string) => void;
}

export const KokoView: React.FC<KokoViewProps> = ({
  clubsData = [],
  mqssCompetitions = [],
  isAdmin,
  onUpdateClub,
  onAddMqss,
  onUpdateMqss,
  onDeleteMqss
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'persatuan' | 'khat' | 'nasyid' | 'mqss'>('persatuan');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('Semua');

  // Modal States
  const [editingClub, setEditingClub] = useState<KokoClubItem | null>(null);
  const [advisorsInput, setAdvisorsInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');

  const [mqssModalData, setMqssModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    mqss: MqssCompetition;
  }>({
    isOpen: false,
    isEditing: false,
    mqss: {
      id: '',
      title: '',
      level: 'Daerah',
      category: 'Tilawah Al-Quran (Lelaki)',
      participantName: '',
      className: '5 Al-Biruni',
      achievement: 'Johan',
      year: 2026
    }
  });

  const filteredMqss = mqssCompetitions.filter((c) =>
    selectedLevelFilter === 'Semua' || c.level === selectedLevelFilter
  );

  const defaultClubFallback: KokoClubItem = {
    id: 'koko-default',
    name: 'Persatuan Agama Islam (PAI)',
    category: 'Persatuan',
    advisorTeachers: ['Ustaz Muhammad Harith (Ketua)', 'Ustazah Siti Aminah'],
    advisors: ['Ustaz Muhammad Harith (Ketua)', 'Ustazah Siti Aminah'],
    presidentStudent: 'Ahmad Danial bin Zulkifli (4 Ibnu Sina)',
    president: 'Ahmad Danial bin Zulkifli (4 Ibnu Sina)',
    totalMembers: 78,
    meetingDay: 'Setiap Rabu (02:00 - 04:00 Petang)',
    description: 'Memupuk sahsiah islamiah dan kemahiran kepimpinan murid melalui pelbagai aktiviti dakwah.',
    achievements: ['Johan Pertandingan Kuiz Agama Islam Daerah 2025'],
    upcomingActivities: ['Kem Kepimpinan Da\'i Muda Sekolah', 'Program Ziarah Mahabbah']
  };

  const paiClub = clubsData.find((c) => c.id === 'koko-1') || clubsData[0];
  const khatClub = clubsData.find((c) => c.id === 'koko-2') || clubsData[1];
  const nasyidClub = clubsData.find((c) => c.id === 'koko-3') || clubsData[2];

  const rawClub =
    activeSubTab === 'persatuan' ? paiClub :
    activeSubTab === 'khat' ? khatClub :
    activeSubTab === 'nasyid' ? nasyidClub : (clubsData[0] || defaultClubFallback);

  const currentClub: KokoClubItem = rawClub || defaultClubFallback;
  const clubAdvisors = currentClub.advisors || currentClub.advisorTeachers || [];
  const clubPresident = currentClub.president || currentClub.presidentStudent || '-';
  const clubAchievements = currentClub.achievements || [];
  const clubActivities: string[] = (currentClub.upcomingActivities || []).map((act) =>
    typeof act === 'string' ? act : `${act.title || ''}${act.date ? ` (${act.date})` : ''}`
  );

  const handleOpenEditClub = (club: KokoClubItem) => {
    setEditingClub({ ...club });
    const adv = club.advisors || club.advisorTeachers || [];
    const acts = (club.upcomingActivities || []).map((act) =>
      typeof act === 'string' ? act : `${act.title || ''}${act.date ? ` (${act.date})` : ''}`
    );
    const achs = club.achievements || [];
    setAdvisorsInput(adv.join(', '));
    setActivitiesInput(acts.join('\n'));
    setAchievementsInput(achs.join('\n'));
  };

  const handleSaveClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;
    const updated: KokoClubItem = {
      ...editingClub,
      advisors: advisorsInput.split(',').map((s) => s.trim()).filter(Boolean),
      upcomingActivities: activitiesInput.split('\n').map((s) => s.trim()).filter(Boolean),
      achievements: achievementsInput.split('\n').map((s) => s.trim()).filter(Boolean)
    };
    onUpdateClub(updated);
    setEditingClub(null);
  };

  const handleSaveMqss = (e: React.FormEvent) => {
    e.preventDefault();
    if (mqssModalData.isEditing) {
      onUpdateMqss(mqssModalData.mqss);
    } else {
      onAddMqss({
        ...mqssModalData.mqss,
        id: `mqss-${Date.now()}`
      });
    }
    setMqssModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const khatTypes = [
    {
      name: 'Khat Nasakh (خط النسخ)',
      desc: 'Tulisan rasmi mushaf Al-Quran dan buku teks. Jelas, mudah dibaca, dan mempunyai sukatan titik seimbang.',
      exampleText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      level: 'Wajib Dikuasai Semua Murid'
    },
    {
      name: 'Khat Riq\'ah (خط الرقعة)',
      desc: 'Tulisan pantas harian dan nota ringkas. Huruf lebih padat, condong sedikit ke kiri, dan menjimatkan ruang.',
      exampleText: 'الْعِلْمُ نُورٌ وَالْجَهْلُ ضَرَارٌ',
      level: 'Peringkat Menengah & Pengayaan'
    },
    {
      name: 'Khat Thuluth (خط الثلth)',
      desc: 'Raja segala seni khat Islam. Digunakan pada hiasan kubah masjid, ukiran kayu, dan bingkai kaligrafi berprestij.',
      exampleText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      level: 'Peringkat Lanjutan & Pertandingan'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Koko Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-950 via-[#041525] to-emerald-950/80 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-tech tracking-wide">PENGURUSAN KOKURIKULUM AGAMA & KESENIAN ISLAM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-tech">
            Modul Kokurikulum Pendidikan Islam <span className="text-cyan-400 text-sm font-mono">[KOKO-SYS]</span>
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 max-w-xl font-sans-custom">
            Aktiviti Persatuan Agama Islam, Kelab Seni Khat Jawi, Kumpulan Nasyid Soutul Huffaz dan Pengurusan Pertandingan MQSS.
          </p>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          <span className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] font-tech tracking-wide">
            <Trophy className="w-4 h-4 text-slate-950" />
            <span>Johan Keseluruhan MQSS Negeri 2026</span>
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-cyan-500/30 shadow-lg backdrop-blur-md overflow-x-auto">
        {[
          { id: 'persatuan', label: 'Persatuan Agama Islam (PAI)', icon: Users, badge: `${paiClub.totalMembers} Ahli` },
          { id: 'khat', label: 'Kelab Seni Khat & Jawi', icon: PenTool, badge: `${khatClub.totalMembers} Ahli` },
          { id: 'nasyid', label: 'Nasyid & Kompang Selawat', icon: Music, badge: `${nasyidClub.totalMembers} Ahli` },
          { id: 'mqss', label: 'Rekod Pencapaian MQSS', icon: Trophy, badge: `${mqssCompetitions.length} Acara` }
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
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* CLUBS DETAIL (PERSATUAN / KHAT / NASYID) */}
      {(activeSubTab === 'persatuan' || activeSubTab === 'khat' || activeSubTab === 'nasyid') && (
        <div className="space-y-6">
          <div className="bg-slate-950/75 rounded-2xl p-6 border border-cyan-500/30 shadow-lg backdrop-blur-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-tech">{currentClub.name}</h3>
                <p className="text-xs text-cyan-200/70 mt-0.5 font-sans-custom">{currentClub.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-bold font-mono">
                  {currentClub.meetingDay}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleOpenEditClub(currentClub)}
                    className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-bold rounded-lg transition border border-amber-400/40 flex items-center space-x-1 font-tech tracking-wide"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sunting Kelab</span>
                  </button>
                )}
              </div>
            </div>

            {/* Leadership & Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 font-semibold block mb-1 font-tech">Guru Penasihat:</span>
                <p className="font-bold text-slate-200">{clubAdvisors.join(', ')}</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 font-semibold block mb-1 font-tech">Pengerusi Murid:</span>
                <p className="font-bold text-emerald-400">{clubPresident}</p>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 font-semibold block mb-1 font-tech">Jumlah Keahlian:</span>
                <p className="font-bold font-mono text-base text-amber-300">
                  {currentClub.totalMembers} Orang Murid
                </p>
              </div>
            </div>

            {/* Activities & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-tech">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Aktiviti Mingguan & Program Tahunan</span>
                </h4>
                <div className="space-y-2">
                  {clubActivities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/80 rounded-xl border border-cyan-500/20 text-xs text-slate-200 font-medium flex items-center space-x-2 hover:border-cyan-500/40 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-tech">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Pencapaian & Kejayaan Kelab</span>
                </h4>
                <div className="space-y-2">
                  {clubAchievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs text-amber-200 font-semibold flex items-center space-x-2 hover:border-amber-400/50 transition"
                    >
                      <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Khat Galeri Showcase (For Khat Tab) */}
          {activeSubTab === 'khat' && (
            <div className="bg-slate-950/75 rounded-2xl p-6 border border-cyan-500/30 shadow-lg backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-3">
                <PenTool className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100 font-tech">
                  Panduan Kaedah Asas Penulisan Seni Khat Islam
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {khatTypes.map((k, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/20 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                        {k.level}
                      </span>
                      <h4 className="font-bold text-sm text-slate-100 mt-2 font-tech">{k.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-sans-custom">{k.desc}</p>
                    </div>

                    <div className="p-3 bg-slate-950 text-amber-300 border border-amber-500/30 rounded-lg text-center font-arabic text-xl pt-3 shadow-inner">
                      {k.exampleText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: REKOD PENCAPAIAN MQSS */}
      {activeSubTab === 'mqss' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-4 rounded-xl border border-cyan-500/30 shadow-md backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-300 font-tech">Tapis Peringkat:</label>
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="bg-slate-900 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="Semua" className="bg-slate-950">Semua Peringkat</option>
                <option value="Kebangsaan" className="bg-slate-950">Kebangsaan</option>
                <option value="Negeri" className="bg-slate-950">Negeri</option>
                <option value="Daerah" className="bg-slate-950">Daerah</option>
                <option value="Sekolah" className="bg-slate-950">Sekolah</option>
              </select>
            </div>

            {isAdmin && (
              <button
                onClick={() =>
                  setMqssModalData({
                    isOpen: true,
                    isEditing: false,
                    mqss: {
                      id: '',
                      title: '',
                      level: 'Daerah',
                      category: 'Tilawah Al-Quran (Lelaki)',
                      participantName: '',
                      className: '5 Al-Biruni',
                      achievement: 'Johan',
                      year: 2026
                    }
                  })
                }
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Rekod MQSS</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMqss.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/75 rounded-xl border border-cyan-500/25 p-5 shadow-lg space-y-3 flex flex-col justify-between group hover:border-cyan-400/50 transition backdrop-blur-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/40 font-mono">
                      Peringkat {item.level} • {item.year}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-400/40 flex items-center gap-1 font-mono shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        {item.achievement}
                      </span>
                      {isAdmin && (
                        <div className="flex items-center space-x-0.5 ml-1">
                          <button
                            onClick={() =>
                              setMqssModalData({
                                isOpen: true,
                                isEditing: true,
                                mqss: { ...item }
                              })
                            }
                            className="p-1 text-slate-400 hover:text-amber-400 rounded"
                            title="Sunting MQSS"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Padam rekod pertandingan "${item.title}"?`)) {
                                onDeleteMqss(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="Padam MQSS"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100 font-tech">{item.title}</h4>
                  <p className="text-xs text-cyan-400/70 font-medium">Kategori: {item.category}</p>

                  <div className="p-3 bg-slate-900/80 rounded-lg text-xs flex items-center justify-between border border-slate-800">
                    <span className="text-slate-400 font-tech">Peserta / Wakil:</span>
                    <span className="font-bold text-slate-200">{item.participantName} ({item.className})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL SUNTING KELAB ================= */}
      {editingClub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-lg shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                Sunting {editingClub.name}
              </h3>
              <button
                onClick={() => setEditingClub(null)}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClub} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Kelab / Persatuan:</label>
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Penerangan Ringkas:</label>
                <textarea
                  rows={2}
                  value={editingClub.description}
                  onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Pengerusi Murid:</label>
                  <input
                    type="text"
                    value={editingClub.president}
                    onChange={(e) => setEditingClub({ ...editingClub, president: e.target.value })}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Jumlah Ahli:</label>
                  <input
                    type="number"
                    value={editingClub.totalMembers}
                    onChange={(e) => setEditingClub({ ...editingClub, totalMembers: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-bold text-amber-300 font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Guru Penasihat (Asingkan koma):</label>
                <input
                  type="text"
                  value={advisorsInput}
                  onChange={(e) => setAdvisorsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  placeholder="Ustaz Muhammad Harith, Ustazah Noraini"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Waktu Perjumpaan:</label>
                <input
                  type="text"
                  value={editingClub.meetingDay}
                  onChange={(e) => setEditingClub({ ...editingClub, meetingDay: e.target.value })}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  placeholder="Setiap Rabu (02:30 - 04:30 Petang)"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Aktiviti (Satu baris satu aktiviti):</label>
                <textarea
                  rows={3}
                  value={activitiesInput}
                  onChange={(e) => setActivitiesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Pencapaian (Satu baris satu kejayaan):</label>
                <textarea
                  rows={2}
                  value={achievementsInput}
                  onChange={(e) => setAchievementsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setEditingClub(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Kelab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL MQSS ================= */}
      {mqssModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {mqssModalData.isEditing ? 'Sunting Rekod MQSS' : 'Tambah Rekod Pencapaian MQSS'}
              </h3>
              <button
                onClick={() => setMqssModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMqss} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Acara / Pertandingan:</label>
                <input
                  type="text"
                  value={mqssModalData.mqss.title}
                  onChange={(e) =>
                    setMqssModalData((prev) => ({
                      ...prev,
                      mqss: { ...prev.mqss, title: e.target.value }
                    }))
                  }
                  placeholder="Contoh: Majlis Tilawah & Hafazan Al-Quran (MQSS)"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Peringkat:</label>
                  <select
                    value={mqssModalData.mqss.level}
                    onChange={(e) =>
                      setMqssModalData((prev) => ({
                        ...prev,
                        mqss: { ...prev.mqss, level: e.target.value as any }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Sekolah" className="bg-slate-950">Sekolah</option>
                    <option value="Daerah" className="bg-slate-950">Daerah</option>
                    <option value="Negeri" className="bg-slate-950">Negeri</option>
                    <option value="Kebangsaan" className="bg-slate-950">Kebangsaan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Pencapaian:</label>
                  <input
                    type="text"
                    value={mqssModalData.mqss.achievement}
                    onChange={(e) =>
                      setMqssModalData((prev) => ({
                        ...prev,
                        mqss: { ...prev.mqss, achievement: e.target.value }
                      }))
                    }
                    placeholder="Johan / Naib Johan / Ketiga"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-bold text-amber-300 font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Kategori:</label>
                <input
                  type="text"
                  value={mqssModalData.mqss.category}
                  onChange={(e) =>
                    setMqssModalData((prev) => ({
                      ...prev,
                      mqss: { ...prev.mqss, category: e.target.value }
                    }))
                  }
                  placeholder="Tilawah Al-Quran / Hafazan / Da'i Cilik / Seni Khat"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Peserta:</label>
                  <input
                    type="text"
                    value={mqssModalData.mqss.participantName}
                    onChange={(e) =>
                      setMqssModalData((prev) => ({
                        ...prev,
                        mqss: { ...prev.mqss, participantName: e.target.value }
                      }))
                    }
                    placeholder="Nama murid"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kelas:</label>
                  <input
                    type="text"
                    value={mqssModalData.mqss.className}
                    onChange={(e) =>
                      setMqssModalData((prev) => ({
                        ...prev,
                        mqss: { ...prev.mqss, className: e.target.value }
                      }))
                    }
                    placeholder="5 Al-Biruni"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setMqssModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan MQSS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
