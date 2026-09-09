import React, { useState } from 'react';
import {
  PanitiaMember,
  EventGalleryItem,
  OfficialDocument,
  DuaItem
} from '../types';
import {
  Globe,
  Users,
  Image as ImageIcon,
  FileText,
  Heart,
  Download,
  ExternalLink,
  Mail,
  Phone,
  Copy,
  CheckCircle2,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface UmumViewProps {
  panitiaMembers: PanitiaMember[];
  eventGalleries: EventGalleryItem[];
  documentsList: OfficialDocument[];
  duasList: DuaItem[];
  isAdmin: boolean;
  onAddPanitiaMember: (member: PanitiaMember) => void;
  onUpdatePanitiaMember: (member: PanitiaMember) => void;
  onDeletePanitiaMember: (id: string) => void;
  onAddGalleryItem: (item: EventGalleryItem) => void;
  onUpdateGalleryItem: (item: EventGalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onAddDocument: (doc: OfficialDocument) => void;
  onUpdateDocument: (doc: OfficialDocument) => void;
  onDeleteDocument: (id: string) => void;
  onAddDua: (dua: DuaItem) => void;
  onUpdateDua: (dua: DuaItem) => void;
  onDeleteDua: (id: string) => void;
}

export const UmumView: React.FC<UmumViewProps> = ({
  panitiaMembers = [],
  eventGalleries = [],
  documentsList = [],
  duasList = [],
  isAdmin,
  onAddPanitiaMember,
  onUpdatePanitiaMember,
  onDeletePanitiaMember,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onAddDua,
  onUpdateDua,
  onDeleteDua
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'panitia' | 'galeri' | 'dokumen' | 'doa' | 'hubungi'>('panitia');
  const [selectedDuaCategory, setSelectedDuaCategory] = useState('Semua');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Admin Modals
  const [panitiaModalData, setPanitiaModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    member: PanitiaMember;
  }>({
    isOpen: false,
    isEditing: false,
    member: {
      id: '',
      name: '',
      role: 'Ketua Panitia Pendidikan Islam',
      gred: 'DG44',
      email: '',
      phone: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      responsibilities: []
    }
  });
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');

  const [galleryModalData, setGalleryModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    item: EventGalleryItem;
  }>({
    isOpen: false,
    isEditing: false,
    item: {
      id: '',
      title: '',
      date: '12 Rabiulawal 1447H',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      description: '',
      category: 'Sambutan Islamiah'
    }
  });

  const [docModalData, setDocModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    doc: OfficialDocument;
  }>({
    isOpen: false,
    isEditing: false,
    doc: {
      id: '',
      title: '',
      category: 'Surat Pekeliling Ikhtisas (SPI)',
      code: 'SPI Bil. 2/2026',
      date: '2026-01-15',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      downloadUrl: '#'
    }
  });

  const [duaModalData, setDuaModalData] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    dua: DuaItem;
  }>({
    isOpen: false,
    isEditing: false,
    dua: {
      id: '',
      title: '',
      arabic: '',
      transliteration: '',
      translation: '',
      category: 'Doa Harian',
      fadhilat: ''
    }
  });

  const filteredDuas = duasList.filter((d) =>
    selectedDuaCategory === 'Semua' || d.category === selectedDuaCategory
  );

  const handleCopyDua = (dua: DuaItem) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\nMaksud: "${dua.translation}"\n\nFadhilat: ${dua.fadhilat}`;
    navigator.clipboard.writeText(text);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  const handleSavePanitia = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      ...panitiaModalData.member,
      responsibilities: responsibilitiesInput.split(',').map((s) => s.trim()).filter(Boolean)
    };
    if (panitiaModalData.isEditing) {
      onUpdatePanitiaMember(formatted);
    } else {
      onAddPanitiaMember({
        ...formatted,
        id: `pan-${Date.now()}`
      });
    }
    setPanitiaModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryModalData.isEditing) {
      onUpdateGalleryItem(galleryModalData.item);
    } else {
      onAddGalleryItem({
        ...galleryModalData.item,
        id: `gal-${Date.now()}`
      });
    }
    setGalleryModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (docModalData.isEditing) {
      onUpdateDocument(docModalData.doc);
    } else {
      onAddDocument({
        ...docModalData.doc,
        id: `doc-${Date.now()}`
      });
    }
    setDocModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (duaModalData.isEditing) {
      onUpdateDua(duaModalData.dua);
    } else {
      onAddDua({
        ...duaModalData.dua,
        id: `dua-${Date.now()}`
      });
    }
    setDuaModalData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Umum Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-950 via-[#041525] to-emerald-950/80 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-tech tracking-wide">PUSAT MAKLUMAT UMUM & KOMUNITI PENDIDIKAN ISLAM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-tech">
            Modul Umum & Sumber Rujukan <span className="text-cyan-400 text-sm font-mono">[UMUM-SYS]</span>
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 max-w-xl font-sans-custom">
            Direktori Panitia Pendidikan Islam, Galeri Sambutan Kebesaran Islam, Pusat Muat Turun Dokumen SPI KPM, dan Koleksi Doa & Zikir Al-Mathurat.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs relative z-10">
          <span className="px-3.5 py-1.5 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 font-medium font-tech tracking-wide shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            Panitia j-QAF SK Merbau Pulas
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-cyan-500/30 shadow-lg backdrop-blur-md overflow-x-auto">
        {[
          { id: 'panitia', label: 'Direktori Panitia', icon: Users, count: panitiaMembers.length },
          { id: 'galeri', label: 'Galeri Sambutan Islam', icon: ImageIcon, count: eventGalleries.length },
          { id: 'dokumen', label: 'Pusat Dokumen KPM', icon: FileText, count: documentsList.length },
          { id: 'doa', label: 'Koleksi Doa & Mathurat', icon: BookOpen, count: duasList.length },
          { id: 'hubungi', label: 'Tanya Ustaz / Hubungi', icon: HelpCircle, count: null }
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
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-cyan-950/80 text-amber-300 border border-amber-400/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: DIREKTORI PANITIA */}
      {activeSubTab === 'panitia' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 font-tech">
              Carta Organisasi & Ahli Panitia Pendidikan Islam
            </h3>
            {isAdmin && (
              <button
                onClick={() => {
                  setPanitiaModalData({
                    isOpen: true,
                    isEditing: false,
                    member: {
                      id: '',
                      name: '',
                      role: 'Guru Pendidikan Islam',
                      gred: 'DG41',
                      email: '',
                      phone: '',
                      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                      responsibilities: []
                    }
                  });
                  setResponsibilitiesInput('');
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ahli Panitia</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {panitiaMembers.map((member) => {
              const photo = member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
              const memberGred = member.grade || member.gred || 'DG41';
              const memberResponsibilities = member.responsibilities || (member.specialization ? member.specialization.split(', ') : ['Pendidikan Islam']);

              return (
                <div
                  key={member.id}
                  className="bg-slate-950/75 rounded-2xl border border-cyan-500/25 p-5 shadow-lg space-y-4 hover:border-cyan-400/50 transition flex flex-col justify-between group backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={photo}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-100 leading-snug font-tech">{member.name}</h4>
                        <p className="text-xs font-semibold text-cyan-300 mt-0.5 font-tech">{member.role}</p>
                        <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-amber-300 rounded-md font-bold border border-slate-800">
                          Gred: {memberGred}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center space-x-0.5 shrink-0">
                          <button
                            onClick={() => {
                              setPanitiaModalData({
                                isOpen: true,
                                isEditing: true,
                                member: { ...member, photoUrl: photo, grade: memberGred, responsibilities: memberResponsibilities }
                              });
                              setResponsibilitiesInput(memberResponsibilities.join(', '));
                            }}
                            className="p-1 text-slate-400 hover:text-amber-400 rounded"
                            title="Sunting Ahli"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Padam ahli panitia "${member.name}"?`)) {
                                onDeletePanitiaMember(member.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="Padam Ahli"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-cyan-500/20">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-wider block mb-1.5 font-tech">
                        Tanggungjawab Utama:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {memberResponsibilities.map((resp, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 bg-cyan-950/50 text-cyan-300 rounded font-medium border border-cyan-500/30 font-sans-custom"
                          >
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GALERI SAMBUTAN ISLAM */}
      {activeSubTab === 'galeri' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 font-tech">
              Sorotan Aktiviti & Sambutan Hari Kebesaran Islam
            </h3>
            {isAdmin && (
              <button
                onClick={() =>
                  setGalleryModalData({
                    isOpen: true,
                    isEditing: false,
                    item: {
                      id: '',
                      title: '',
                      date: '2026',
                      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
                      description: '',
                      category: 'Sambutan Islamiah'
                    }
                  })
                }
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Gambar Galeri</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventGalleries.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/75 rounded-2xl border border-cyan-500/25 overflow-hidden shadow-lg hover:border-cyan-400/50 transition flex flex-col justify-between group backdrop-blur-sm"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.imageUrl || item.highlightUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm text-cyan-300 font-bold text-[10px] rounded-full border border-cyan-500/40 font-mono">
                        {item.category}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg border border-cyan-500/40">
                        <button
                          onClick={() =>
                            setGalleryModalData({
                              isOpen: true,
                              isEditing: true,
                              item: { ...item }
                            })
                          }
                          className="p-1 text-slate-300 hover:text-amber-400 rounded"
                          title="Sunting Galeri"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Padam gambar galeri "${item.title}"?`)) {
                              onDeleteGalleryItem(item.id);
                            }
                          }}
                          className="p-1 text-slate-300 hover:text-rose-400 rounded"
                          title="Padam Galeri"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 leading-snug font-tech">{item.title}</h4>
                    <p className="text-xs text-cyan-200/70 line-clamp-3 font-sans-custom">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PUSAT DOKUMEN KPM */}
      {activeSubTab === 'dokumen' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-5 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-100 font-tech">
                  Pusat Muat Turun Dokumen Rasmi & Surat Pekeliling
                </h3>
                <p className="text-xs text-cyan-200/70 mt-0.5 font-sans-custom">
                  SPI KPM, Buku Panduan Pengurusan Pendidikan Islam, dan Takwim Peperiksaan.
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() =>
                    setDocModalData({
                      isOpen: true,
                      isEditing: false,
                      doc: {
                        id: '',
                        title: '',
                        category: 'Surat Pekeliling Ikhtisas (SPI)',
                        code: 'SPI Bil. 2026',
                        date: '2026-02-01',
                        fileType: 'PDF',
                        fileSize: '1.5 MB',
                        downloadUrl: '#'
                      }
                    })
                  }
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Dokumen Rasmi</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-cyan-300 uppercase text-[10px] tracking-wider border-b border-cyan-500/30 font-tech">
                  <tr>
                    <th className="p-3">Nama Dokumen</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Kod Rujukan</th>
                    <th className="p-3">Tarikh</th>
                    <th className="p-3">Saiz</th>
                    <th className="p-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-3 font-bold text-slate-100 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{doc.title}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] font-mono">
                          {doc.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-400">{doc.code}</td>
                      <td className="p-3 text-slate-400 font-mono">{doc.date}</td>
                      <td className="p-3 text-slate-400 font-mono">{doc.fileSize}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => alert(`Memuat turun ${doc.title}...`)}
                            className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded font-semibold text-xs flex items-center space-x-1 transition font-tech tracking-wide shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                          >
                            <Download className="w-3 h-3" />
                            <span>Unduh</span>
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() =>
                                  setDocModalData({
                                    isOpen: true,
                                    isEditing: true,
                                    doc: { ...doc }
                                  })
                                }
                                className="p-1 text-slate-400 hover:text-amber-400 rounded"
                                title="Sunting Dokumen"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Padam dokumen "${doc.title}"?`)) {
                                    onDeleteDocument(doc.id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded"
                                title="Padam Dokumen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: KOLEKSI DOA & MATHURAT */}
      {activeSubTab === 'doa' && (
        <div className="space-y-4">
          <div className="bg-slate-950/75 p-4 rounded-xl border border-cyan-500/30 shadow-md backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-300 font-tech">Kategori Doa:</label>
              <select
                value={selectedDuaCategory}
                onChange={(e) => setSelectedDuaCategory(e.target.value)}
                className="bg-slate-900 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="Semua" className="bg-slate-950">Semua Kategori</option>
                <option value="Doa Harian" className="bg-slate-950">Doa Harian</option>
                <option value="Amalan Pembelajaran" className="bg-slate-950">Amalan Pembelajaran</option>
                <option value="Al-Mathurat & Zikir" className="bg-slate-950">Al-Mathurat & Zikir</option>
                <option value="Ketenangan Hati" className="bg-slate-950">Ketenangan Hati</option>
              </select>
            </div>

            {isAdmin && (
              <button
                onClick={() =>
                  setDuaModalData({
                    isOpen: true,
                    isEditing: false,
                    dua: {
                      id: '',
                      title: '',
                      arabic: '',
                      transliteration: '',
                      translation: '',
                      category: 'Doa Harian',
                      fadhilat: ''
                    }
                  })
                }
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-tech tracking-wide"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Doa / Zikir</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-slate-950/75 rounded-2xl border border-cyan-500/25 p-6 shadow-lg space-y-4 hover:border-cyan-400/50 transition flex flex-col justify-between group backdrop-blur-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/40 font-mono">
                      {dua.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCopyDua(dua)}
                        className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold px-2 py-1 rounded hover:bg-slate-900 transition font-tech"
                      >
                        {copiedDuaId === dua.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      {isAdmin && (
                        <div className="flex items-center space-x-0.5 ml-1">
                          <button
                            onClick={() =>
                              setDuaModalData({
                                isOpen: true,
                                isEditing: true,
                                dua: { ...dua }
                              })
                            }
                            className="p-1 text-slate-400 hover:text-amber-400 rounded"
                            title="Sunting Doa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Padam doa "${dua.title}"?`)) {
                                onDeleteDua(dua.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="Padam Doa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100 font-tech">{dua.title}</h4>

                  <div className="p-4 bg-slate-900/90 rounded-xl text-right font-arabic text-xl leading-loose text-amber-300 border border-amber-500/30 shadow-inner">
                    {dua.arabic}
                  </div>

                  <p className="text-xs text-cyan-300/80 italic font-mono">
                    <b className="font-tech text-cyan-400 not-italic">Rumi:</b> {dua.transliteration}
                  </p>

                  <p className="text-xs text-slate-300 font-sans-custom">
                    <b className="font-tech text-cyan-400">Maksud:</b> "{dua.translation}"
                  </p>

                  <div className="p-2.5 bg-cyan-950/40 rounded-lg text-[11px] text-cyan-200 font-medium border border-cyan-500/30">
                    <b className="font-tech text-cyan-300">Fadhilat:</b> {dua.fadhilat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: TANYA USTAZ / HUBUNGI */}
      {activeSubTab === 'hubungi' && (
        <div className="max-w-2xl mx-auto bg-slate-950/80 rounded-2xl border border-cyan-500/40 p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-6 backdrop-blur-md">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-100 font-tech">Ruangan Soal Jawab & Maklum Balas</h3>
            <p className="text-xs text-cyan-200/70 font-sans-custom">
              Ada sebarang kemusykilan agama, soalan berkenaan RPH/PBD, atau pertanyaan ibu bapa?
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-300 font-tech">Mesej Telah Berjaya Dihantar!</h4>
              <p className="text-xs text-emerald-200">
                Jazakallahu khair. Ustaz Syaiful akan membalas e-mel anda secepat mungkin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Penuh:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contoh: Encik Ahmad Fadzil"
                  required
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Alamat E-mel:</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contoh@gmail.com"
                  required
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Kemusykilan / Mesej:</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tuliskan soalan atau mesej anda di sini..."
                  required
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex items-center justify-center space-x-2 text-xs font-tech tracking-wide"
              >
                <Send className="w-4 h-4" />
                <span>Hantar Pertanyaan</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ================= MODAL AHLI PANITIA ================= */}
      {panitiaModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {panitiaModalData.isEditing ? 'Sunting Ahli Panitia' : 'Tambah Ahli Panitia Baru'}
              </h3>
              <button
                onClick={() => setPanitiaModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePanitia} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Nama Penuh & Gelaran:</label>
                <input
                  type="text"
                  value={panitiaModalData.member.name}
                  onChange={(e) =>
                    setPanitiaModalData((prev) => ({
                      ...prev,
                      member: { ...prev.member, name: e.target.value }
                    }))
                  }
                  placeholder="Ustaz Syaiful"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Jawatan / Portfolio:</label>
                  <input
                    type="text"
                    value={panitiaModalData.member.role}
                    onChange={(e) =>
                      setPanitiaModalData((prev) => ({
                        ...prev,
                        member: { ...prev.member, role: e.target.value }
                      }))
                    }
                    placeholder="Ketua Panitia / Penyelaras j-QAF"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Gred Jawatan:</label>
                  <input
                    type="text"
                    value={panitiaModalData.member.gred}
                    onChange={(e) =>
                      setPanitiaModalData((prev) => ({
                        ...prev,
                        member: { ...prev.member, gred: e.target.value }
                      }))
                    }
                    placeholder="DG44"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-mono font-bold text-amber-300 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">E-mel MOE:</label>
                  <input
                    type="email"
                    value={panitiaModalData.member.email}
                    onChange={(e) =>
                      setPanitiaModalData((prev) => ({
                        ...prev,
                        member: { ...prev.member, email: e.target.value }
                      }))
                    }
                    placeholder="g-XXXXX@moe-dl.edu.my"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">No. Telefon:</label>
                  <input
                    type="text"
                    value={panitiaModalData.member.phone}
                    onChange={(e) =>
                      setPanitiaModalData((prev) => ({
                        ...prev,
                        member: { ...prev.member, phone: e.target.value }
                      }))
                    }
                    placeholder="+60 12-345 6789"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">URL Foto Profil:</label>
                <input
                  type="text"
                  value={panitiaModalData.member.photoUrl}
                  onChange={(e) =>
                    setPanitiaModalData((prev) => ({
                      ...prev,
                      member: { ...prev.member, photoUrl: e.target.value }
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Tanggungjawab (Asingkan koma):</label>
                <input
                  type="text"
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Pengurusan DSKP, Penyelaras e-Pelaporan j-QAF"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setPanitiaModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Ahli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL GAMBAR GALERI ================= */}
      {galleryModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {galleryModalData.isEditing ? 'Sunting Gambar Galeri' : 'Tambah Gambar Galeri Baru'}
              </h3>
              <button
                onClick={() => setGalleryModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Tajuk Program / Acara:</label>
                <input
                  type="text"
                  value={galleryModalData.item.title}
                  onChange={(e) =>
                    setGalleryModalData((prev) => ({
                      ...prev,
                      item: { ...prev.item, title: e.target.value }
                    }))
                  }
                  placeholder="Sambutan Maulidur Rasul 1447H"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Tarikh / Hijrah:</label>
                  <input
                    type="text"
                    value={galleryModalData.item.date}
                    onChange={(e) =>
                      setGalleryModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, date: e.target.value }
                      }))
                    }
                    placeholder="12 Rabiulawal 1447H"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kategori:</label>
                  <select
                    value={galleryModalData.item.category}
                    onChange={(e) =>
                      setGalleryModalData((prev) => ({
                        ...prev,
                        item: { ...prev.item, category: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Sambutan Islamiah" className="bg-slate-950">Sambutan Islamiah</option>
                    <option value="Amali Solat & KBS" className="bg-slate-950">Amali Solat & KBS</option>
                    <option value="Aktiviti Surau" className="bg-slate-950">Aktiviti Surau</option>
                    <option value="Pertandingan MQSS" className="bg-slate-950">Pertandingan MQSS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">URL Imej (Unsplash/Direct):</label>
                <input
                  type="text"
                  value={galleryModalData.item.imageUrl}
                  onChange={(e) =>
                    setGalleryModalData((prev) => ({
                      ...prev,
                      item: { ...prev.item, imageUrl: e.target.value }
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Penerangan Ringkas:</label>
                <textarea
                  rows={3}
                  value={galleryModalData.item.description}
                  onChange={(e) =>
                    setGalleryModalData((prev) => ({
                      ...prev,
                      item: { ...prev.item, description: e.target.value }
                    }))
                  }
                  placeholder="Penerangan aktiviti..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setGalleryModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Gambar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DOKUMEN RASMI ================= */}
      {docModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-md shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {docModalData.isEditing ? 'Sunting Dokumen Rasmi' : 'Tambah Dokumen Rasmi Baru'}
              </h3>
              <button
                onClick={() => setDocModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Tajuk Dokumen:</label>
                <input
                  type="text"
                  value={docModalData.doc.title}
                  onChange={(e) =>
                    setDocModalData((prev) => ({
                      ...prev,
                      doc: { ...prev.doc, title: e.target.value }
                    }))
                  }
                  placeholder="Surat Pekeliling Ikhtisas Pelaksanaan KBS"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kategori:</label>
                  <input
                    type="text"
                    value={docModalData.doc.category}
                    onChange={(e) =>
                      setDocModalData((prev) => ({
                        ...prev,
                        doc: { ...prev.doc, category: e.target.value }
                      }))
                    }
                    placeholder="Surat Pekeliling / Panduan"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kod Rujukan:</label>
                  <input
                    type="text"
                    value={docModalData.doc.code}
                    onChange={(e) =>
                      setDocModalData((prev) => ({
                        ...prev,
                        doc: { ...prev.doc, code: e.target.value }
                      }))
                    }
                    placeholder="SPI Bil. 2/2026"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-mono font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Tarikh:</label>
                  <input
                    type="date"
                    value={docModalData.doc.date}
                    onChange={(e) =>
                      setDocModalData((prev) => ({
                        ...prev,
                        doc: { ...prev.doc, date: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-medium text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Saiz Fail:</label>
                  <input
                    type="text"
                    value={docModalData.doc.fileSize}
                    onChange={(e) =>
                      setDocModalData((prev) => ({
                        ...prev,
                        doc: { ...prev.doc, fileSize: e.target.value }
                      }))
                    }
                    placeholder="1.2 MB"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setDocModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KOLEKSI DOA ================= */}
      {duaModalData.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/50 rounded-2xl w-full max-w-lg shadow-[0_0_35px_rgba(6,182,212,0.2)] p-6 space-y-4 text-slate-200 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-bold text-base text-cyan-300 font-tech tracking-wide">
                {duaModalData.isEditing ? 'Sunting Doa / Zikir' : 'Tambah Doa / Zikir Baru'}
              </h3>
              <button
                onClick={() => setDuaModalData((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDua} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Tajuk Doa:</label>
                  <input
                    type="text"
                    value={duaModalData.dua.title}
                    onChange={(e) =>
                      setDuaModalData((prev) => ({
                        ...prev,
                        dua: { ...prev.dua, title: e.target.value }
                      }))
                    }
                    placeholder="Doa Sebelum Masuk Peperiksaan"
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-bold text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1 font-tech">Kategori:</label>
                  <select
                    value={duaModalData.dua.category}
                    onChange={(e) =>
                      setDuaModalData((prev) => ({
                        ...prev,
                        dua: { ...prev.dua, category: e.target.value }
                      }))
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2.5 font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Doa Harian" className="bg-slate-950">Doa Harian</option>
                    <option value="Amalan Pembelajaran" className="bg-slate-950">Amalan Pembelajaran</option>
                    <option value="Al-Mathurat & Zikir" className="bg-slate-950">Al-Mathurat & Zikir</option>
                    <option value="Ketenangan Hati" className="bg-slate-950">Ketenangan Hati</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Teks Bahasa Arab:</label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={duaModalData.dua.arabic}
                  onChange={(e) =>
                    setDuaModalData((prev) => ({
                      ...prev,
                      dua: { ...prev.dua, arabic: e.target.value }
                    }))
                  }
                  placeholder="اللَّهُمَّ..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 font-arabic text-lg leading-relaxed text-right text-amber-300 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Sebutan Rumi (Transliterasi):</label>
                <input
                  type="text"
                  value={duaModalData.dua.transliteration}
                  onChange={(e) =>
                    setDuaModalData((prev) => ({
                      ...prev,
                      dua: { ...prev.dua, transliteration: e.target.value }
                    }))
                  }
                  placeholder="Allahumma inni as'aluka..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 italic text-cyan-200 font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Terjemahan Maksud:</label>
                <textarea
                  rows={2}
                  value={duaModalData.dua.translation}
                  onChange={(e) =>
                    setDuaModalData((prev) => ({
                      ...prev,
                      dua: { ...prev.dua, translation: e.target.value }
                    }))
                  }
                  placeholder="Ya Allah, sesungguhnya aku memohon kepada-Mu..."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1 font-tech">Fadhilat / Khasiat Amalan:</label>
                <input
                  type="text"
                  value={duaModalData.dua.fadhilat}
                  onChange={(e) =>
                    setDuaModalData((prev) => ({
                      ...prev,
                      dua: { ...prev.dua, fadhilat: e.target.value }
                    }))
                  }
                  placeholder="Mendapat kelapangan dada dan kemudahan mengingati ilmu."
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl p-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setDuaModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-tech tracking-wide"
                >
                  Simpan Doa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
