import React, { useState, useEffect } from 'react';
import {
  MainMenuType,
  MenuItemConfig,
  TeacherProfile,
  TimetableSlot,
  IslamicEventItem,
  HadithItem,
  RPHItem,
  DskpItem,
  PdpcModuleItem,
  PbdStudentRecord,
  TasmikRecord,
  StudentSahsiahRecord,
  SurauDutyItem,
  WelfareItem,
  KokoClubItem,
  MqssCompetition,
  PanitiaMember,
  EventGalleryItem,
  OfficialDocument,
  DuaItem
} from './types';
import {
  defaultTeacherProfile,
  defaultTimetable,
  malaysiaZonesPrayerData,
  dailyHadithList,
  defaultIslamicEvents,
  initialRphList,
  dskpCurriculumData,
  defaultPdpcModules,
  samplePbdStudents,
  sampleTasmikRecords,
  sampleSahsiahRecords,
  surauDutySchedule,
  studentWelfareList,
  kokoClubsData,
  mqssCompetitionsData,
  panitiaMembersList,
  eventGalleries,
  officialDocumentsList,
  duasAndMathuratList,
  defaultMenuItems
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminBar } from './components/AdminBar';
import { MenuEditorModal } from './components/MenuEditorModal';
import { UtamaView } from './components/UtamaView';
import { KurikulumView } from './components/KurikulumView';
import { HemView } from './components/HemView';
import { KokoView } from './components/KokoView';
import { UmumView } from './components/UmumView';
import { PrayerTimesModal } from './components/PrayerTimesModal';
import { RphModal } from './components/RphModal';
import { QuizModal } from './components/QuizModal';
import { FirebaseStatusModal } from './components/FirebaseStatusModal';
import {
  initFirebase,
  isFirebaseConfigured,
  testFirestoreConnection,
  db
} from './firebase/firebase';
import {
  saveRphToFirestore,
  deleteRphFromFirestore,
  subscribeToRph
} from './firebase/firestoreService';
import { saveOrUpdateRptFromRph } from './utils/rptStorage';

const STORAGE_KEY = 'portal_gpi_app_data_v2';

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<MainMenuType>('utama');
  const [selectedZone, setSelectedZone] = useState<string>('WLY01');
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Core Data States with LocalStorage fallback
  const [menuItems, setMenuItems] = useState<MenuItemConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menus`);
      return saved ? JSON.parse(saved) : defaultMenuItems;
    } catch {
      return defaultMenuItems;
    }
  });

  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teacher`);
      return saved ? JSON.parse(saved) : defaultTeacherProfile;
    } catch {
      return defaultTeacherProfile;
    }
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_timetable`);
      return saved ? JSON.parse(saved) : defaultTimetable;
    } catch {
      return defaultTimetable;
    }
  });

  const [hadithList, setHadithList] = useState<HadithItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hadiths`);
      return saved ? JSON.parse(saved) : dailyHadithList;
    } catch {
      return dailyHadithList;
    }
  });

  const [eventsList, setEventsList] = useState<IslamicEventItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      return saved ? JSON.parse(saved) : defaultIslamicEvents;
    } catch {
      return defaultIslamicEvents;
    }
  });

  const [rphList, setRphList] = useState<RPHItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rph`);
      return saved ? JSON.parse(saved) : initialRphList;
    } catch {
      return initialRphList;
    }
  });

  const [dskpList, setDskpList] = useState<DskpItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_dskp`);
      return saved ? JSON.parse(saved) : dskpCurriculumData;
    } catch {
      return dskpCurriculumData;
    }
  });

  const [pdpcModules, setPdpcModules] = useState<PdpcModuleItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pdpc`);
      return saved ? JSON.parse(saved) : defaultPdpcModules;
    } catch {
      return defaultPdpcModules;
    }
  });

  const [pbdStudents, setPbdStudents] = useState<PbdStudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pbd`);
      return saved ? JSON.parse(saved) : samplePbdStudents;
    } catch {
      return samplePbdStudents;
    }
  });

  const [tasmikRecords, setTasmikRecords] = useState<TasmikRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasmik`);
      return saved ? JSON.parse(saved) : sampleTasmikRecords;
    } catch {
      return sampleTasmikRecords;
    }
  });

  const [sahsiahRecords, setSahsiahRecords] = useState<StudentSahsiahRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sahsiah`);
      return saved ? JSON.parse(saved) : sampleSahsiahRecords;
    } catch {
      return sampleSahsiahRecords;
    }
  });

  const [surauSchedule, setSurauSchedule] = useState<SurauDutyItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_surau`);
      return saved ? JSON.parse(saved) : surauDutySchedule;
    } catch {
      return surauDutySchedule;
    }
  });

  const [welfareList, setWelfareList] = useState<WelfareItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_welfare`);
      return saved ? JSON.parse(saved) : studentWelfareList;
    } catch {
      return studentWelfareList;
    }
  });

  const [clubsData, setClubsData] = useState<KokoClubItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clubs`);
      return saved ? JSON.parse(saved) : kokoClubsData;
    } catch {
      return kokoClubsData;
    }
  });

  const [mqssCompetitions, setMqssCompetitions] = useState<MqssCompetition[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mqss`);
      return saved ? JSON.parse(saved) : mqssCompetitionsData;
    } catch {
      return mqssCompetitionsData;
    }
  });

  const [panitiaMembers, setPanitiaMembers] = useState<PanitiaMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_panitia`);
      return saved ? JSON.parse(saved) : panitiaMembersList;
    } catch {
      return panitiaMembersList;
    }
  });

  const [eventGalleriesState, setEventGalleries] = useState<EventGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_galleries`);
      return saved ? JSON.parse(saved) : eventGalleries;
    } catch {
      return eventGalleries;
    }
  });

  const [documentsList, setDocumentsList] = useState<OfficialDocument[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
      return saved ? JSON.parse(saved) : officialDocumentsList;
    } catch {
      return officialDocumentsList;
    }
  });

  const [duasList, setDuasList] = useState<DuaItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_duas`);
      return saved ? JSON.parse(saved) : duasAndMathuratList;
    } catch {
      return duasAndMathuratList;
    }
  });

  // Modal dialog states
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [rphModalData, setRphModalData] = useState<{ isOpen: boolean; rph: RPHItem | null }>({
    isOpen: false,
    rph: null
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_menus`, JSON.stringify(menuItems));
      localStorage.setItem(`${STORAGE_KEY}_teacher`, JSON.stringify(teacher));
      localStorage.setItem(`${STORAGE_KEY}_timetable`, JSON.stringify(timetable));
      localStorage.setItem(`${STORAGE_KEY}_hadiths`, JSON.stringify(hadithList));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(eventsList));
      localStorage.setItem(`${STORAGE_KEY}_rph`, JSON.stringify(rphList));
      localStorage.setItem(`${STORAGE_KEY}_dskp`, JSON.stringify(dskpList));
      localStorage.setItem(`${STORAGE_KEY}_pdpc`, JSON.stringify(pdpcModules));
      localStorage.setItem(`${STORAGE_KEY}_pbd`, JSON.stringify(pbdStudents));
      localStorage.setItem(`${STORAGE_KEY}_tasmik`, JSON.stringify(tasmikRecords));
      localStorage.setItem(`${STORAGE_KEY}_sahsiah`, JSON.stringify(sahsiahRecords));
      localStorage.setItem(`${STORAGE_KEY}_surau`, JSON.stringify(surauSchedule));
      localStorage.setItem(`${STORAGE_KEY}_welfare`, JSON.stringify(welfareList));
      localStorage.setItem(`${STORAGE_KEY}_clubs`, JSON.stringify(clubsData));
      localStorage.setItem(`${STORAGE_KEY}_mqss`, JSON.stringify(mqssCompetitions));
      localStorage.setItem(`${STORAGE_KEY}_panitia`, JSON.stringify(panitiaMembers));
      localStorage.setItem(`${STORAGE_KEY}_galleries`, JSON.stringify(eventGalleriesState));
      localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documentsList));
      localStorage.setItem(`${STORAGE_KEY}_duas`, JSON.stringify(duasList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [
    menuItems,
    teacher,
    timetable,
    hadithList,
    eventsList,
    rphList,
    dskpList,
    pdpcModules,
    pbdStudents,
    tasmikRecords,
    sahsiahRecords,
    surauSchedule,
    welfareList,
    clubsData,
    mqssCompetitions,
    panitiaMembers,
    eventGalleriesState,
    documentsList,
    duasList
  ]);

  // Firebase Boot and Synchronization
  useEffect(() => {
    if (isFirebaseConfigured()) {
      const { db: firestoreDb } = initFirebase();
      if (firestoreDb) {
        testFirestoreConnection(firestoreDb).catch(() => {});

        // Realtime RPH synchronization
        const unsubscribe = subscribeToRph(
          (remoteRphs) => {
            if (remoteRphs && remoteRphs.length > 0) {
              setRphList((prev) => {
                const map = new Map<string, RPHItem>();
                prev.forEach((item) => map.set(item.id, item));
                remoteRphs.forEach((item) => map.set(item.id, item));
                return Array.from(map.values());
              });
            }
          },
          (err) => {
            console.warn('Ralat langganan Firestore RPH:', err);
          }
        );

        return () => unsubscribe();
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const prayerData = malaysiaZonesPrayerData[selectedZone] || malaysiaZonesPrayerData['WLY01'];

  // Reset all to default
  const handleResetAllData = () => {
    setMenuItems(defaultMenuItems);
    setTeacher(defaultTeacherProfile);
    setTimetable(defaultTimetable);
    setHadithList(dailyHadithList);
    setEventsList(defaultIslamicEvents);
    setRphList(initialRphList);
    setDskpList(dskpCurriculumData);
    setPdpcModules(defaultPdpcModules);
    setPbdStudents(samplePbdStudents);
    setTasmikRecords(sampleTasmikRecords);
    setSahsiahRecords(sampleSahsiahRecords);
    setSurauSchedule(surauDutySchedule);
    setWelfareList(studentWelfareList);
    setClubsData(kokoClubsData);
    setMqssCompetitions(mqssCompetitionsData);
    setPanitiaMembers(panitiaMembersList);
    setEventGalleries(eventGalleries);
    setDocumentsList(officialDocumentsList);
    setDuasList(duasAndMathuratList);
    localStorage.clear();
    showToast('Semua data dan menu telah ditetapkan semula kepada data asal.');
  };

  // Export JSON
  const handleExportData = () => {
    const fullBackup = {
      menuItems,
      teacher,
      timetable,
      hadithList,
      eventsList,
      rphList,
      dskpList,
      pdpcModules,
      pbdStudents,
      tasmikRecords,
      sahsiahRecords,
      surauSchedule,
      welfareList,
      clubsData,
      mqssCompetitions,
      panitiaMembers,
      eventGalleries: eventGalleriesState,
      documentsList,
      duasList,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PortalGPI_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Fail sandaran JSON berjaya dimuat turun!');
  };

  // Import JSON
  const handleImportData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.menuItems) setMenuItems(parsed.menuItems);
      if (parsed.teacher) setTeacher(parsed.teacher);
      if (parsed.timetable) setTimetable(parsed.timetable);
      if (parsed.hadithList) setHadithList(parsed.hadithList);
      if (parsed.eventsList) setEventsList(parsed.eventsList);
      if (parsed.rphList) setRphList(parsed.rphList);
      if (parsed.dskpList) setDskpList(parsed.dskpList);
      if (parsed.pdpcModules) setPdpcModules(parsed.pdpcModules);
      if (parsed.pbdStudents) setPbdStudents(parsed.pbdStudents);
      if (parsed.tasmikRecords) setTasmikRecords(parsed.tasmikRecords);
      if (parsed.sahsiahRecords) setSahsiahRecords(parsed.sahsiahRecords);
      if (parsed.surauSchedule) setSurauSchedule(parsed.surauSchedule);
      if (parsed.welfareList) setWelfareList(parsed.welfareList);
      if (parsed.clubsData) setClubsData(parsed.clubsData);
      if (parsed.mqssCompetitions) setMqssCompetitions(parsed.mqssCompetitions);
      if (parsed.panitiaMembers) setPanitiaMembers(parsed.panitiaMembers);
      if (parsed.eventGalleries) setEventGalleries(parsed.eventGalleries);
      if (parsed.documentsList) setDocumentsList(parsed.documentsList);
      if (parsed.duasList) setDuasList(parsed.duasList);
      showToast('Data sandaran berjaya dimuat masuk dan dikemaskini!');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // RPH handlers
  const handleOpenRphModal = (rph: RPHItem | null) => {
    setRphModalData({ isOpen: true, rph });
  };

  const handleSaveRph = (savedRph: RPHItem, silent: boolean = false, options?: { syncRpt?: boolean }) => {
    setRphList((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === savedRph.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = savedRph;
        return updated;
      }
      return [savedRph, ...prev];
    });

    if (options?.syncRpt) {
      saveOrUpdateRptFromRph(savedRph);
    }

    if (isFirebaseConfigured()) {
      saveRphToFirestore(savedRph).catch((err) => {
        console.warn('Ralat menyimpan e-RPH ke Firestore:', err);
      });
    }

    if (!silent) {
      if (options?.syncRpt) {
        showToast(`e-RPH "${savedRph.topic}" & RPT Tahunan berjaya dikemaskini kekal.`);
      } else {
        showToast(`e-RPH "${savedRph.topic}" berjaya disimpan.`);
      }
    }
  };

  const handleSaveRphWithRpt = (savedRph: RPHItem) => {
    saveOrUpdateRptFromRph(savedRph);
    handleSaveRph(savedRph, false, { syncRpt: true });
  };

  const handleDeleteRph = (id: string) => {
    setRphList((prev) => prev.filter((r) => r.id !== id));

    if (isFirebaseConfigured()) {
      deleteRphFromFirestore(id).catch((err) => {
        console.warn('Ralat memadam e-RPH di Firestore:', err);
      });
    }

    showToast('Rekod RPH telah dipadam.');
  };

  // PBD Handlers
  const handleAddPbdStudent = (student: PbdStudentRecord) => {
    setPbdStudents((prev) => [student, ...prev]);
    showToast(`Murid PBD "${student.studentName}" berjaya ditambah.`);
  };

  const handleUpdatePbdStudent = (updatedStudent: PbdStudentRecord) => {
    setPbdStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    showToast(`Pentaksiran PBD "${updatedStudent.studentName}" dikemaskini.`);
  };

  const handleDeletePbdStudent = (id: string) => {
    setPbdStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('Rekod murid PBD telah dipadam.');
  };

  // Tasmik Handlers
  const handleAddTasmik = (record: TasmikRecord) => {
    setTasmikRecords((prev) => [record, ...prev]);
    showToast(`Rekod tasmik "${record.studentName}" berjaya ditambah.`);
  };

  const handleUpdateTasmik = (updatedTasmik: TasmikRecord) => {
    setTasmikRecords((prev) =>
      prev.map((t) => (t.id === updatedTasmik.id ? updatedTasmik : t))
    );
    showToast(`Rekod tasmik "${updatedTasmik.studentName}" dikemaskini.`);
  };

  const handleDeleteTasmik = (id: string) => {
    setTasmikRecords((prev) => prev.filter((t) => t.id !== id));
    showToast('Rekod tasmik telah dipadam.');
  };

  // DSKP Handlers
  const handleAddDskp = (item: DskpItem) => {
    setDskpList((prev) => [item, ...prev]);
    showToast(`DSKP ${item.yearLevel} (${item.area}) ditambah.`);
  };

  const handleUpdateDskp = (item: DskpItem) => {
    setDskpList((prev) => prev.map((d) => (d.id === item.id ? item : d)));
    showToast(`DSKP ${item.yearLevel} (${item.area}) dikemaskini.`);
  };

  const handleDeleteDskp = (id: string) => {
    setDskpList((prev) => prev.filter((d) => d.id !== id));
    showToast('Item DSKP telah dipadam.');
  };

  // Pdpc Modules Handlers
  const handleAddPdpc = (item: PdpcModuleItem) => {
    setPdpcModules((prev) => [item, ...prev]);
    showToast(`Bahan PdP "${item.title}" berjaya ditambah.`);
  };

  const handleUpdatePdpc = (item: PdpcModuleItem) => {
    setPdpcModules((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    showToast(`Bahan PdP "${item.title}" dikemaskini.`);
  };

  const handleDeletePdpc = (id: string) => {
    setPdpcModules((prev) => prev.filter((m) => m.id !== id));
    showToast('Bahan PdP telah dipadam.');
  };

  // Teacher Profile & Timetable Handlers
  const handleUpdateTeacher = (updated: TeacherProfile) => {
    setTeacher(updated);
    showToast('Profil Guru Pendidikan Islam berjaya dikemaskini.');
  };

  const handleAddTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => [...prev, slot]);
    showToast('Waktu jadual mengajar berjaya ditambah.');
  };

  const handleUpdateTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => prev.map((s) => (s.id === slot.id ? slot : s)));
    showToast('Jadual waktu mengajar dikemaskini.');
  };

  const handleDeleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    showToast('Slot jadual waktu telah dipadam.');
  };

  // Hadith & Event Handlers
  const handleAddHadith = (h: HadithItem) => {
    setHadithList((prev) => [h, ...prev]);
    showToast('Hadith harian berjaya ditambah.');
  };

  const handleUpdateHadith = (h: HadithItem) => {
    setHadithList((prev) => prev.map((item) => (item.id === h.id ? h : item)));
    showToast('Hadith harian dikemaskini.');
  };

  const handleDeleteHadith = (id: string) => {
    setHadithList((prev) => prev.filter((h) => h.id !== id));
    showToast('Hadith telah dipadam.');
  };

  const handleAddEvent = (e: IslamicEventItem) => {
    setEventsList((prev) => [...prev, e]);
    showToast(`Takwim aktiviti "${e.name}" ditambah.`);
  };

  const handleUpdateEvent = (e: IslamicEventItem) => {
    setEventsList((prev) => prev.map((item) => (item.id === e.id ? e : item)));
    showToast(`Takwim aktiviti "${e.name}" dikemaskini.`);
  };

  const handleDeleteEvent = (id: string) => {
    setEventsList((prev) => prev.filter((e) => e.id !== id));
    showToast('Aktiviti takwim telah dipadam.');
  };

  // HEM Handlers
  const handleAddGoodDeed = (
    studentId: string,
    title: string,
    category: any,
    points: number
  ) => {
    setSahsiahRecords((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newScore = s.meritScore + points;
          let newBadge = s.badge;
          if (newScore >= 120) newBadge = 'Tokoh Sahsiah Terpuji';
          else if (newScore >= 100) newBadge = 'Bintang Sahsiah Emas';
          else if (newScore >= 80) newBadge = 'Bintang Sahsiah Perak';

          const newDeed = {
            id: `gd-${Date.now()}`,
            title,
            category,
            points,
            date: new Date().toISOString().split('T')[0],
            recordedBy: teacher.name
          };
          return {
            ...s,
            meritScore: newScore,
            badge: newBadge,
            goodDeedsCount: s.goodDeedsCount + 1,
            deeds: [newDeed, ...s.deeds]
          };
        }
        return s;
      })
    );
    showToast('Amalan baik SSDM berjaya direkodkan.');
  };

  const handleAddSahsiahStudent = (student: StudentSahsiahRecord) => {
    setSahsiahRecords((prev) => [student, ...prev]);
    showToast(`Rekod sahsiah "${student.studentName}" ditambah.`);
  };

  const handleUpdateSahsiahStudent = (student: StudentSahsiahRecord) => {
    setSahsiahRecords((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    showToast(`Rekod sahsiah "${student.studentName}" dikemaskini.`);
  };

  const handleDeleteSahsiahStudent = (id: string) => {
    setSahsiahRecords((prev) => prev.filter((s) => s.id !== id));
    showToast('Rekod murid sahsiah dipadam.');
  };

  const handleAddSurauDuty = (duty: SurauDutyItem) => {
    setSurauSchedule((prev) => [...prev, duty]);
    showToast(`Jadual bertugas surau hari ${duty.day} ditambah.`);
  };

  const handleUpdateSurauDuty = (duty: SurauDutyItem) => {
    setSurauSchedule((prev) => prev.map((s) => (s.id === duty.id ? duty : s)));
    showToast(`Jadual bertugas hari ${duty.day} dikemaskini.`);
  };

  const handleDeleteSurauDuty = (id: string) => {
    setSurauSchedule((prev) => prev.filter((s) => s.id !== id));
    showToast('Jadual bertugas surau dipadam.');
  };

  const handleAddWelfare = (item: WelfareItem) => {
    setWelfareList((prev) => [item, ...prev]);
    showToast(`Penerima bantuan asnaf "${item.studentName}" ditambah.`);
  };

  const handleUpdateWelfare = (item: WelfareItem) => {
    setWelfareList((prev) => prev.map((w) => (w.id === item.id ? item : w)));
    showToast(`Rekod kebajikan "${item.studentName}" dikemaskini.`);
  };

  const handleDeleteWelfare = (id: string) => {
    setWelfareList((prev) => prev.filter((w) => w.id !== id));
    showToast('Rekod kebajikan asnaf dipadam.');
  };

  // Koko Handlers
  const handleUpdateClub = (club: KokoClubItem) => {
    setClubsData((prev) => prev.map((c) => (c.id === club.id ? club : c)));
    showToast(`Maklumat "${club.name}" berjaya dikemaskini.`);
  };

  const handleAddMqss = (mqss: MqssCompetition) => {
    setMqssCompetitions((prev) => [mqss, ...prev]);
    showToast(`Rekod pencapaian MQSS "${mqss.title}" ditambah.`);
  };

  const handleUpdateMqss = (mqss: MqssCompetition) => {
    setMqssCompetitions((prev) => prev.map((m) => (m.id === mqss.id ? mqss : m)));
    showToast(`Rekod pencapaian "${mqss.title}" dikemaskini.`);
  };

  const handleDeleteMqss = (id: string) => {
    setMqssCompetitions((prev) => prev.filter((m) => m.id !== id));
    showToast('Rekod MQSS telah dipadam.');
  };

  // Umum Handlers
  const handleAddPanitiaMember = (m: PanitiaMember) => {
    setPanitiaMembers((prev) => [...prev, m]);
    showToast(`Ahli panitia "${m.name}" berjaya ditambah.`);
  };

  const handleUpdatePanitiaMember = (m: PanitiaMember) => {
    setPanitiaMembers((prev) => prev.map((item) => (item.id === m.id ? m : item)));
    showToast(`Maklumat ahli panitia "${m.name}" dikemaskini.`);
  };

  const handleDeletePanitiaMember = (id: string) => {
    setPanitiaMembers((prev) => prev.filter((item) => item.id !== id));
    showToast('Ahli panitia telah dipadam.');
  };

  const handleAddGalleryItem = (g: EventGalleryItem) => {
    setEventGalleries((prev) => [g, ...prev]);
    showToast(`Gambar galeri "${g.title}" berjaya dimuat naik.`);
  };

  const handleUpdateGalleryItem = (g: EventGalleryItem) => {
    setEventGalleries((prev) => prev.map((item) => (item.id === g.id ? g : item)));
    showToast(`Gambar galeri "${g.title}" dikemaskini.`);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setEventGalleries((prev) => prev.filter((item) => item.id !== id));
    showToast('Gambar galeri telah dipadam.');
  };

  const handleAddDocument = (d: OfficialDocument) => {
    setDocumentsList((prev) => [d, ...prev]);
    showToast(`Dokumen rasmi "${d.title}" ditambah.`);
  };

  const handleUpdateDocument = (d: OfficialDocument) => {
    setDocumentsList((prev) => prev.map((item) => (item.id === d.id ? d : item)));
    showToast(`Dokumen rasmi "${d.title}" dikemaskini.`);
  };

  const handleDeleteDocument = (id: string) => {
    setDocumentsList((prev) => prev.filter((item) => item.id !== id));
    showToast('Dokumen rasmi telah dipadam.');
  };

  const handleAddDua = (dua: DuaItem) => {
    setDuasList((prev) => [dua, ...prev]);
    showToast(`Doa "${dua.title}" berjaya ditambah.`);
  };

  const handleUpdateDua = (dua: DuaItem) => {
    setDuasList((prev) => prev.map((item) => (item.id === dua.id ? dua : item)));
    showToast(`Doa "${dua.title}" dikemaskini.`);
  };

  const handleDeleteDua = (id: string) => {
    setDuasList((prev) => prev.filter((item) => item.id !== id));
    showToast('Koleksi doa telah dipadam.');
  };

  // Menu items config update
  const handleSaveMenuItems = (newMenus: MenuItemConfig[]) => {
    setMenuItems(newMenus);
    showToast('Konfigurasi dan susunan menu portal telah dikemaskini!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans-custom bg-[#02080d] bg-islamic-matrix text-slate-100 selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300">
      {/* Admin Top Notification & Toolbar Bar */}
      <div className="print:hidden">
        <AdminBar
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          onOpenMenuEditor={() => setIsMenuEditorOpen(true)}
          onResetAllData={handleResetAllData}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          notification={notification}
        />
      </div>

      {/* Top Main Navigation */}
      <div className="print:hidden">
        <Navbar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          menuItems={menuItems}
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          onOpenMenuEditor={() => setIsMenuEditorOpen(true)}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          prayerData={prayerData}
          allZones={malaysiaZonesPrayerData}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
          onOpenQuickRph={() => handleOpenRphModal(null)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-full">
        {activeMenu === 'utama' && (
          <UtamaView
            teacher={teacher}
            timetable={timetable}
            prayerData={prayerData}
            hadithList={hadithList}
            islamicEvents={eventsList}
            isAdmin={isAdmin}
            setActiveMenu={setActiveMenu}
            onOpenQuickRph={() => handleOpenRphModal(null)}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
            onOpenQuizModal={() => setIsQuizModalOpen(true)}
            onUpdateTeacher={handleUpdateTeacher}
            onAddTimetableSlot={handleAddTimetableSlot}
            onUpdateTimetableSlot={handleUpdateTimetableSlot}
            onDeleteTimetableSlot={handleDeleteTimetableSlot}
            onAddHadith={handleAddHadith}
            onUpdateHadith={handleUpdateHadith}
            onDeleteHadith={handleDeleteHadith}
            onAddIslamicEvent={handleAddEvent}
            onUpdateIslamicEvent={handleUpdateEvent}
            onDeleteIslamicEvent={handleDeleteEvent}
          />
        )}

        {activeMenu === 'kurikulum' && (
          <KurikulumView
            rphList={rphList}
            dskpList={dskpList}
            pdpcModules={pdpcModules}
            pbdStudents={pbdStudents}
            tasmikRecords={tasmikRecords}
            isAdmin={isAdmin}
            onOpenRphModal={handleOpenRphModal}
            onDeleteRph={handleDeleteRph}
            onSaveRph={handleSaveRph}
            onAddPbdStudent={handleAddPbdStudent}
            onUpdatePbdStudent={handleUpdatePbdStudent}
            onDeletePbdStudent={handleDeletePbdStudent}
            onAddTasmik={handleAddTasmik}
            onUpdateTasmik={handleUpdateTasmik}
            onDeleteTasmik={handleDeleteTasmik}
            onAddDskp={handleAddDskp}
            onUpdateDskp={handleUpdateDskp}
            onDeleteDskp={handleDeleteDskp}
            onAddPdpcModule={handleAddPdpc}
            onUpdatePdpcModule={handleUpdatePdpc}
            onDeletePdpcModule={handleDeletePdpc}
            onOpenQuizModal={() => setIsQuizModalOpen(true)}
          />
        )}

        {activeMenu === 'hem' && (
          <HemView
            sahsiahRecords={sahsiahRecords}
            surauSchedule={surauSchedule}
            welfareList={welfareList}
            isAdmin={isAdmin}
            onAddGoodDeed={handleAddGoodDeed}
            onAddSahsiahStudent={handleAddSahsiahStudent}
            onUpdateSahsiahStudent={handleUpdateSahsiahStudent}
            onDeleteSahsiahStudent={handleDeleteSahsiahStudent}
            onAddSurauDuty={handleAddSurauDuty}
            onUpdateSurauDuty={handleUpdateSurauDuty}
            onDeleteSurauDuty={handleDeleteSurauDuty}
            onAddWelfareItem={handleAddWelfare}
            onUpdateWelfareItem={handleUpdateWelfare}
            onDeleteWelfareItem={handleDeleteWelfare}
          />
        )}

        {activeMenu === 'kokurikulum' && (
          <KokoView
            clubsData={clubsData}
            mqssCompetitions={mqssCompetitions}
            isAdmin={isAdmin}
            onUpdateClub={handleUpdateClub}
            onAddMqss={handleAddMqss}
            onUpdateMqss={handleUpdateMqss}
            onDeleteMqss={handleDeleteMqss}
          />
        )}

        {activeMenu === 'umum' && (
          <UmumView
            panitiaMembers={panitiaMembers}
            eventGalleries={eventGalleriesState}
            documentsList={documentsList}
            duasList={duasList}
            isAdmin={isAdmin}
            onAddPanitiaMember={handleAddPanitiaMember}
            onUpdatePanitiaMember={handleUpdatePanitiaMember}
            onDeletePanitiaMember={handleDeletePanitiaMember}
            onAddGalleryItem={handleAddGalleryItem}
            onUpdateGalleryItem={handleUpdateGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onAddDocument={handleAddDocument}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddDua={handleAddDua}
            onUpdateDua={handleUpdateDua}
            onDeleteDua={handleDeleteDua}
          />
        )}
      </main>

      {/* Footer */}
      <div className="print:hidden">
        <Footer setActiveMenu={setActiveMenu} />
      </div>

      {/* Menu Editor Modal for Admin */}
      <MenuEditorModal
        isOpen={isMenuEditorOpen}
        onClose={() => setIsMenuEditorOpen(false)}
        menuItems={menuItems}
        onSaveMenuItems={handleSaveMenuItems}
      />

      {/* Prayer Times Modal */}
      <PrayerTimesModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
        prayerData={prayerData}
        allZones={malaysiaZonesPrayerData}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />

      {/* RPH Generator / Editor Modal */}
      {rphModalData.isOpen && (
        <RphModal
          isOpen={rphModalData.isOpen}
          onClose={() => setRphModalData({ isOpen: false, rph: null })}
          rph={rphModalData.rph}
          onSave={handleSaveRph}
          onSaveWithRpt={handleSaveRphWithRpt}
        />
      )}

      {/* Interactive Quiz / Uji Minda Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* Firebase Cloud Status & Auth Modal */}
      <FirebaseStatusModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onNotify={showToast}
      />
    </div>
  );
}
