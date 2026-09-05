export type MainMenuType = 'utama' | 'kurikulum' | 'hem' | 'kokurikulum' | 'umum';

export interface MenuItemConfig {
  id: MainMenuType;
  label: string;
  subLabel: string;
  iconName: string;
  badge?: string;
  enabled: boolean;
}

export interface TeacherProfile {
  name: string;
  salutation: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  option: string;
  teachingExperience: number; // in years
  philosophy: string;
  avatarUrl?: string;
  classesTaught: string[];
  roles: string[];
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  className: string;
  subject: string;
  topic: string;
  location: string;
}

export interface PrayerTimeData {
  zone: string;
  zoneName: string;
  imsak: string;
  subuh: string;
  syuruk: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
  date: string;
  hijriDate: string;
}

export interface HadithItem {
  id: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  narrator: string;
  source: string;
  theme: string;
}

export type ScriptType = 'rumi' | 'jawi';

export interface RPHItem {
  id: string;
  week: number;
  day: string;
  date: string;
  time: string;
  className: string;
  subject: string;
  learningArea: 'Al-Quran' | 'Hadis' | 'Akidah' | 'Ibadah' | 'Sirah' | 'Adab' | 'Jawi' | 'Bahasa Arab';
  topic: string;
  contentStandard: string; // Standard Kandungan
  learningStandard: string; // Standard Pembelajaran
  objectives: string[];
  successCriteria: string[];
  inductionActivity: string;
  mainActivities: string[];
  closureActivity: string;
  teachingAids: string[]; // Bahan Bantu Mengajar (BBM)
  crossCurricularElements: string[]; // Elemen Merentas Kurikulum (EMK)
  pbdAssessment: string; // Pentaksiran Bilik Darjah
  reflection: string;
  status: 'Lengkap' | 'Deraf' | 'Disemak PGB';
  preferredScript?: ScriptType;
  jawiOverrides?: {
    day?: string;
    topic?: string;
    contentStandard?: string;
    learningStandard?: string;
    objectives?: string[];
    successCriteria?: string[];
    inductionActivity?: string;
    mainActivities?: string[];
    closureActivity?: string;
    teachingAids?: string[];
    crossCurricularElements?: string[];
    pbdAssessment?: string;
    reflection?: string;
    className?: string;
    learningArea?: string;
    subject?: string;
  };
}

export interface DskpItem {
  id: string;
  yearLevel: string; // e.g. "Tahun 4"
  area: string;
  theme: string;
  code: string;
  contentStandard: string;
  learningStandard: string;
  performanceStandard: string; // Tahap Penguasaan TP1-TP6 summary
  notes?: string;
}

export interface RptItem {
  id: string;
  yearLevel?: string; // 'Tahun 1' | 'Tahun 6'
  week: number;
  timeSlot: string; // e.g. "القرءان (30 مينيت)", "القرءان (1 جم)", "عقيدة (1 جم)", "جاوي (30 مينيت)"
  subjectCategory: 'Al-Quran' | 'Tafsir/Kefahaman' | 'Tadarus/Tasmik' | 'Tajwid' | 'Akidah' | 'Ibadah' | 'Sirah' | 'Adab' | 'Jawi' | 'Hadis' | 'Ulangkaji / PBD' | 'Transisi' | 'Pengurusan';
  topicTitle?: string;
  civicTopic?: string; // e.g. "تاجوق سيؤيك: ڤموڤوقن جاتي ديري"
  contentStandard: string; // ستندرد کاندوڠن
  learningStandard: string; // ستندرد ڤمبلاجرن
  objectives: string[]; // اوبجيکتيف
  activities: string[]; // چادڠن اکتيۏيتي ڤڠاجرن دان ڤمبلاجرن
  emk: string; // EMK
  assessment: string; // ڤنيالين
  kbat: string; // KBAT
  notes?: string;
  kumpADates?: string;
  kumpBDates?: string;
}

export interface PbdStudentRecord {
  id: string;
  studentName: string;
  className: string;
  gender: 'Lelaki' | 'Perempuan';
  tpQuran: number;
  tpHadis: number;
  tpAkidah: number;
  tpIbadah: number;
  tpSirah: number;
  tpAdab: number;
  tpJawi: number;
  overallTp: number;
  teacherRemarks: string;
}

export interface TasmikRecord {
  id: string;
  studentName: string;
  className: string;
  currentStage: 'Iqra 1' | 'Iqra 2' | 'Iqra 3' | 'Iqra 4' | 'Iqra 5' | 'Iqra 6' | 'Al-Quran Juz 1-15' | 'Al-Quran Juz 16-30' | 'Khatam Al-Quran';
  currentSurah: string;
  currentVersePage: string;
  hafazanProgress: string; // e.g. "Surah An-Naba' (1-20)"
  lastTasmikDate: string;
  status: 'Cemerlang' | 'Lancar' | 'Perlu Bimbingan Tajwid';
  tasmikTeacher: string;
}

export interface GoodDeedItem {
  id: string;
  title: string;
  category: 'Solat Berjemaah' | 'Khidmat Surau' | 'Bacaan Al-Quran' | 'Budi Pekerti' | 'Kepimpinan';
  points: number;
  date: string;
  recordedBy: string;
}

export interface StudentSahsiahRecord {
  id: string;
  studentName: string;
  className: string;
  points: number;
  meritScore?: number;
  goodDeeds?: GoodDeedItem[];
  deeds?: GoodDeedItem[];
  goodDeedsCount?: number;
  levelBadge?: string;
  badge?: string;
}

export interface SurauDutyItem {
  id: string;
  day: string;
  prayerName: string;
  imamName: string;
  bilalName: string;
  tazkirahPresenter: string;
  supervisorTeacher: string;
}

export interface WelfareItem {
  id: string;
  studentName: string;
  className: string;
  category: 'Asnaf Zakat' | 'Anak Yatim' | 'B40' | 'Bantuan Kasih';
  assistanceType: string;
  status: 'Diterima' | 'Dalam Proses' | 'Diagihkan';
  sponsor: string;
}

export interface KokoClubItem {
  id: string;
  name: string;
  category: string;
  advisorTeachers?: string[];
  advisors?: string[];
  presidentStudent?: string;
  president?: string;
  totalMembers: number;
  meetingDay: string;
  description?: string;
  achievements: string[];
  upcomingActivities: any[];
}

export interface MqssCompetition {
  id: string;
  title: string;
  level: 'Sekolah' | 'Zon' | 'Daerah' | 'Negeri' | 'Kebangsaan';
  category: 'Tilawah Al-Quran' | 'Hafazan Al-Quran' | 'Da\'i Cilik / Syarahan' | 'Seni Khat' | 'Nasyid';
  participantName: string;
  className: string;
  achievement: string;
  year: number;
}

export interface PanitiaMember {
  id: string;
  name: string;
  salutation: string;
  role: string;
  grade: string;
  email: string;
  phone: string;
  specialization: string;
  responsibilities?: string[];
}

export interface EventGalleryItem {
  id: string;
  title: string;
  date: string;
  hijriDate: string;
  category: 'Maulidur Rasul' | 'Ihya Ramadhan' | 'Israk Mikraj' | 'Kem Bestari Solat' | 'Hari Raya Aidilfitri' | 'Awal Muharram';
  description: string;
  photoCount: number;
  imageUrl?: string;
  highlightUrl?: string;
  tags: string[];
}

export interface OfficialDocument {
  id: string;
  title: string;
  code: string;
  category: 'DSKP & RPT' | 'Surat Pekeliling Ikhtisas (SPI)' | 'Borang j-QAF' | 'Panduan PBD' | 'Bahan Khas';
  fileSize: string;
  dateUploaded: string;
  downloadUrl?: string;
}

export interface IslamicEventItem {
  id: string;
  name: string;
  hijri: string;
  date: string;
  status: 'Baru Selesai' | 'Sedang Berlangsung' | 'Akan Datang';
}

export interface PdpcModuleItem {
  id: string;
  title: string;
  yearLevel: string;
  area: string;
  description: string;
  downloadUrl?: string;
  fileSize: string;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'Doa Harian' | 'Zikir Al-Mathurat' | 'Doa Solat & Wuduk' | 'Doa Menghafaz' | 'Doa Pelindung';
  arabic: string;
  transliteration: string;
  translation: string;
  fadhilat: string;
}
