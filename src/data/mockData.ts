import {
  TeacherProfile,
  TimetableSlot,
  PrayerTimeData,
  HadithItem,
  RPHItem,
  DskpItem,
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
  DuaItem,
  IslamicEventItem,
  PdpcModuleItem,
  MenuItemConfig
} from '../types';
import { createTasmikRph } from './tasmikConstants';

export const defaultTeacherProfile: TeacherProfile = {
  name: 'Muhammad Harith bin Abdullah',
  salutation: 'Ustaz',
  email: 'g-77071151@moe-dl.edu.my',
  phone: '019-3456789',
  school: 'SK Seri Saujana (SBT)',
  grade: 'DG44 (Guru Cemerlang Pendidikan Islam)',
  option: 'Pendidikan Islam & Bahasa Arab (j-QAF)',
  teachingExperience: 14,
  philosophy: 'Mendidik Murid Berilmu, Beramal dan Berakhlak Mulia Menuju Keredhaan Ilahi berteraskan Falsafah Pendidikan Islam.',
  classesTaught: ['4 Ibnu Sina', '4 Al-Farabi', '5 Al-Biruni', '5 Al-Khawarizmi', '6 Al-Ghazali'],
  roles: [
    'Ketua Panitia Pendidikan Islam',
    'Penyelaras Program j-QAF & Tasmik',
    'Pengerusi Jawatankuasa Surau An-Nur',
    'Jurulatih Utama (JU) Pentaksiran Bilik Darjah (PBD) Daerah',
    'Penasihat Persatuan Agama Islam & Kelab Seni Khat'
  ]
};

export const defaultTimetable: TimetableSlot[] = [
  { id: '1', day: 'Isnin', time: '08:00 - 09:00', className: '4 Ibnu Sina', subject: 'Pendidikan Islam', topic: 'Bidang Al-Quran: Hukum Tajwid (Mad Asli)', location: 'Bilik j-QAF 1' },
  { id: '2', day: 'Isnin', time: '10:30 - 11:30', className: '5 Al-Biruni', subject: 'Pendidikan Islam', topic: 'Bidang Akidah: Beriman Kepada Hari Akhirat', location: 'Kelas 5 Al-Biruni' },
  { id: '3', day: 'Isnin', time: '12:00 - 01:00', className: '6 Al-Ghazali', subject: 'e-Tasmik Al-Quran', topic: 'Tasmik Juzuk 28 & Hafazan Surah As-Sajdah', location: 'Surau An-Nur' },
  { id: '4', day: 'Selasa', time: '08:30 - 09:30', className: '4 Al-Farabi', subject: 'Pendidikan Islam', topic: 'Bidang Ibadah: Solat Jamak & Qasar', location: 'Bilik j-QAF 2' },
  { id: '5', day: 'Selasa', time: '10:00 - 11:00', className: '5 Al-Khawarizmi', subject: 'Bahasa Arab', topic: 'Al-Hayawanat Fi Hadiqah (Haiwan di Taman)', location: 'Makmal Bahasa' },
  { id: '6', day: 'Rabu', time: '07:30 - 08:30', className: '4 Ibnu Sina', subject: 'Pendidikan Islam', topic: 'Bidang Jawi: Imbuhan Awalan & Akhiran', location: 'Kelas 4 Ibnu Sina' },
  { id: '7', day: 'Rabu', time: '02:00 - 04:00', className: 'Semua Ahli', subject: 'Kokurikulum', topic: 'Perjumpaan Persatuan Agama Islam & Seni Khat', location: 'Bilik Seni & Surau' },
  { id: '8', day: 'Khamis', time: '09:00 - 10:00', className: '5 Al-Biruni', subject: 'Pendidikan Islam', topic: 'Bidang Sirah: Peristiwa Hijrah Rasulullah SAW', location: 'Bilik j-QAF 1' },
  { id: '9', day: 'Khamis', time: '11:00 - 12:00', className: '4 Ibnu Sina', subject: 'e-Tasmik Al-Quran', topic: 'Bimbingan Bacaan Murid & Iqra', location: 'Surau An-Nur' },
  { id: '10', day: 'Jumaat', time: '07:30 - 08:30', className: 'Semua Murid', subject: 'Program Rohani', topic: 'Bacaan Surah Al-Kahfi & Tazkirah Jumaat', location: 'Dewan Gemilang' },
  { id: '11', day: 'Jumaat', time: '09:30 - 10:30', className: '6 Al-Ghazali', subject: 'Pendidikan Islam', topic: 'Bidang Adab: Adab Bergaul Dengan Jiran', location: 'Kelas 6 Al-Ghazali' }
];

export const malaysiaZonesPrayerData: Record<string, PrayerTimeData> = {
  'WLY01': {
    zone: 'WLY01',
    zoneName: 'Kuala Lumpur & Putrajaya',
    imsak: '05:52',
    subuh: '06:02',
    syuruk: '07:15',
    zohor: '13:24',
    asar: '16:34',
    maghrib: '19:28',
    isyak: '20:38',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'SGR01': {
    zone: 'SGR01',
    zoneName: 'Shah Alam, Petaling, Gombak, Klang',
    imsak: '05:53',
    subuh: '06:03',
    syuruk: '07:16',
    zohor: '13:25',
    asar: '16:35',
    maghrib: '19:29',
    isyak: '20:39',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'JHR02': {
    zone: 'JHR02',
    zoneName: 'Johor Bahru, Kulai, Kota Tinggi',
    imsak: '05:44',
    subuh: '05:54',
    syuruk: '07:06',
    zohor: '13:16',
    asar: '16:24',
    maghrib: '19:19',
    isyak: '20:29',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'PNG01': {
    zone: 'PNG01',
    zoneName: 'Pulau Pinang & Seberang Perai',
    imsak: '05:58',
    subuh: '06:08',
    syuruk: '07:22',
    zohor: '13:30',
    asar: '16:42',
    maghrib: '19:35',
    isyak: '20:45',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'KDH01': {
    zone: 'KDH01',
    zoneName: 'Alor Setar, Kota Setar, Kubang Pasu',
    imsak: '05:59',
    subuh: '06:09',
    syuruk: '07:23',
    zohor: '13:31',
    asar: '16:43',
    maghrib: '19:36',
    isyak: '20:47',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'KTN01': {
    zone: 'KTN01',
    zoneName: 'Kota Bharu, Bachok, Pasir Puteh, Tumpat',
    imsak: '05:48',
    subuh: '05:58',
    syuruk: '07:11',
    zohor: '13:20',
    asar: '16:31',
    maghrib: '19:24',
    isyak: '20:34',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'TRG01': {
    zone: 'TRG01',
    zoneName: 'Kuala Terengganu, Marang, Kuala Nerus',
    imsak: '05:46',
    subuh: '05:56',
    syuruk: '07:09',
    zohor: '13:17',
    asar: '16:28',
    maghrib: '19:21',
    isyak: '20:32',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'SBH01': {
    zone: 'SBH01',
    zoneName: 'Kota Kinabalu, Penampang, Tuaran',
    imsak: '04:54',
    subuh: '05:04',
    syuruk: '06:17',
    zohor: '12:23',
    asar: '15:29',
    maghrib: '18:27',
    isyak: '19:37',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  },
  'SWK08': {
    zone: 'SWK08',
    zoneName: 'Kuching, Bau, Lundu, Samarahan',
    imsak: '05:12',
    subuh: '05:22',
    syuruk: '06:33',
    zohor: '12:43',
    asar: '15:47',
    maghrib: '18:46',
    isyak: '19:55',
    date: '15 September 2026',
    hijriDate: '23 Rabiul Awal 1448H'
  }
};

export const dailyHadithList: HadithItem[] = [
  {
    id: 'h1',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    transliteration: "Khayrukum man ta'allamal Qur'aana wa 'allamah.",
    translation: 'Sebaik-baik kamu ialah orang yang mempelajari Al-Quran dan mengajarkannya kepada orang lain.',
    narrator: 'Uthman bin Affan R.A',
    source: 'Hadis Riwayat Sahih Al-Bukhari (No. 5027)',
    theme: 'Keutamaan Al-Quran & Menuntut Ilmu'
  },
  {
    id: 'h2',
    arabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ',
    transliteration: "Innama bu'ithtu li-utammima saalihal akhlaaq.",
    translation: 'Sesungguhnya aku diutuskan hanyalah untuk menyempurnakan akhlak yang mulia.',
    narrator: 'Abu Hurairah R.A',
    source: 'Hadis Riwayat Al-Bukhari dalam Al-Adab Al-Mufrad & Imam Ahmad',
    theme: 'Pendidikan Akhlak & Sahsiah'
  },
  {
    id: 'h3',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    transliteration: "Man salaka tareeqan yaltamisu feehi 'ilman sahhalallaahu lahu bihi tareeqan ilal jannah.",
    translation: 'Sesiapa yang menempuh satu jalan untuk mencari ilmu, nescaya Allah akan mempermudahkan baginya jalan menuju ke syurga.',
    narrator: 'Abu Hurairah R.A',
    source: 'Hadis Riwayat Sahih Muslim (No. 2699)',
    theme: 'Kelebihan Murid & Guru Menuntut Ilmu'
  }
];

export const initialRphList: RPHItem[] = [
  createTasmikRph({
    id: 'rph-tasmik-w32-6ag',
    week: 32,
    day: 'Isnin',
    date: '2026-09-14',
    time: '12:00 - 01:00 (60 Minit)',
    className: '6 Al-Ghazali',
    preferredScript: 'jawi',
    totalStudents: 34,
    masteredCount: 32,
    unmasteredCount: 2
  }),
  createTasmikRph({
    id: 'rph-tasmik-w33-4is',
    week: 33,
    day: 'Khamis',
    date: '2026-09-24',
    time: '11:00 - 12:00 (60 Minit)',
    className: '4 Ibnu Sina',
    preferredScript: 'jawi',
    totalStudents: 35,
    masteredCount: 33,
    unmasteredCount: 2
  }),
  {
    id: 'rph-101',
    week: 32,
    day: 'Isnin',
    date: '2026-09-14',
    time: '08:00 - 09:00 (60 Minit)',
    className: '4 Ibnu Sina',
    subject: 'Pendidikan Islam',
    learningArea: 'Al-Quran',
    topic: 'Tilawah & Tajwid: Hukum Bacaan Mad Asli',
    contentStandard: '1.4 Membaca ayat yang mengandungi bacaan Mad Asli dengan betul dan bertajwid secara beradab dan istiqamah.',
    learningStandard: '1.4.1 Mengenal pasti kalimah dan potongan ayat yang mengandungi bacaan Mad Asli.\n1.4.2 Membaca kalimah dan potongan ayat yang mengandungi Mad Asli dengan kadar 2 harakat.',
    objectives: [
      'Menyatakan maksud Mad Asli dan 3 huruf mad (Alif, Wau, Ya) dengan tepat selepas penerangan guru.',
      'Mengenal pasti dan menyebut sekurang-kurangnya 5 kalimah Mad Asli dalam petikan Surah Al-Balad dengan betul.',
      'Membaca ayat yang mengandungi Mad Asli dengan kadar panjang 2 harakat secara bertajwid.'
    ],
    successCriteria: [
      'Murid dapat menyenaraikan 3 huruf Mad Asli di papan putih mini.',
      'Murid dapat menandakan warna pada hukum Mad Asli dalam lembaran kerja digital.',
      'Murid membaca ayat pilihan di hadapan kelas/rakan sebaya dengan sebutan 2 harakat yang tepat.'
    ],
    inductionActivity: 'Guru memperdengarkan rakaman audio dua bacaan berbeza (1 harakat vs 2 harakat) menggunakan pembesar suara dan meminta murid membuat perbandingan tempo sebutan.',
    mainActivities: [
      'Penerangan Konsep: Guru menerangkan kaedah mengenal huruf Mad Asli (Alif didahului baris Fathah, Wau didahului baris Dhommah, Ya didahului baris Kasrah) menggunakan paparan slaid interaktif.',
      'Aktiviti Kumpulan (Traffic Lights & Mini Whiteboard): Setiap kumpulan murid diberi kad ayat Surah Al-Balad untuk mengesan dan membulatkan kalimah Mad Asli.',
      'Aplikasi Tasmik Berpasangan (Think-Pair-Share): Murid membaca potongan ayat secara bergilir-gilir bersama rakan sambil menyemak kadar 2 harakat.'
    ],
    closureActivity: 'Guru membuat rumusan dan menjalankan kuiz ringkas "Kahoot Tajwid Cerdas". Murid melafazkan ikrar membaca Al-Quran bertajwid.',
    teachingAids: ['Slaid Interaktif Canva / PowerPoint', 'Mushaf Al-Quran Resam Uthmani', 'Kad Kalimah Tajwid Berwarna', 'Speaker Audio', 'Mini Whiteboard'],
    crossCurricularElements: ['Nilai Murni (Ketelitian, Tawaduk)', 'Teknologi Maklumat dan Komunikasi (TMK)', 'Bahasa (Sebutan Fonetik)'],
    pbdAssessment: 'Pentaksiran Lisan (Bacaan bertajwid) dan Pentaksiran Bertulis (Lembaran Pengecaman Huruf Mad) - Tahap Penguasaan TP3 & TP4.',
    reflection: '32 daripada 35 orang murid telah mencapai objektif pembelajaran dengan membaca Mad Asli 2 harakat dengan tepat. 3 orang murid diberi bimbingan tasmik secara individu.',
    status: 'Lengkap',
    preferredScript: 'rumi',
    jawiOverrides: {
      day: 'اثنين',
      className: '٤ ابن سينا',
      subject: 'ڤنديديقن اسلام',
      topic: 'تلاوة دان تجويد: حکوم باچاءن مد اصلي',
      contentStandard: '1.4 ممباچ اية يڠ مڠاندوڠي باچاءن مد اصلي دڠن بتول دان برتجويد سچارا برادب دان استقامة.',
      learningStandard: '1.4.1 مڠنل ڤستي کليمه دان ڤوتوڠن اية يڠ مڠاندوڠي باچاءن مد اصلي.\n1.4.2 ممباچ کليمه دان ڤوتوڠن اية يڠ مڠاندوڠي مد اصلي دڠن قدر 2 حرکة.',
      objectives: [
        'مڽاتاکن مقصود مد اصلي دان 3 حروف مد (الف، واو، ياء) دڠن تڤت سلڤس ڤنرڠن ݢورو.',
        'مڠنل ڤستي دان مڽبوت سکورڠ-کورڠڽ 5 کليمه مد اصلي دالم ڤتيقن سورة البلد دڠن بتول.',
        'ممباچ اية يڠ مڠاندوڠي مد اصلي دڠن قدر ڤنجڠ 2 حرکة سچارا برتجويد.'
      ],
      successCriteria: [
        'موريد داڤت مڽنارايکن 3 حروف مد اصلي دڤاڤن ڤوتيه ميني.',
        'موريد داڤت مننداکن ورنا ڤد حکوم مد اصلي دالم لمبارن کرجا ديݢيتل.',
        'موريد ممباچ اية ڤيليهن دهادڤن کلس/راکن سباي دڠن سبوتن 2 حرکة يڠ تڤت.'
      ],
      inductionActivity: 'ݢورو ممڤردڠرکن راقمن اوديو دوا باچاءن بربيذا (1 حرکة دان 2 حرکة) مڠݢوناکن ڤمبسر سوارا دان ممينتا موريد ممبوات ڤربنديڠن تيمڤو سبوتن.',
      mainActivities: [
        'ڤنرڠن کونسيڤ: ݢورو منرڠکن قاعده مڠنل حروف مد اصلي (الف ددهولوءي باريس فتحة، واو ددهولوءي باريس ضمة، ياء ددهولوءي باريس کسرة) مڠݢوناکن ڤاڤرن سلاءيد اينتراکتيف.',
        'اکتيۏيتي کومڤولن (Traffic Lights & Mini Whiteboard): ستياڤ کومڤولن موريد دبري کد اية سورة البلد اونتوق مڠسن دان ممبولتکن کليمه مد اصلي.',
        'اڤليکاسي تسميع برڤاسڠن (Think-Pair-Share): موريد ممباچ ڤوتوڠن اية سچارا برݢيلير-ݢيلير برسام راکن سمبيل مڽيمق قدر 2 حرکة.'
      ],
      closureActivity: 'ݢورو ممبوات روموسن دان منجالنکن کوءيز ريڠکس "Kahoot تجويد چردس". موريد ملافظکن اقرار ممباچ القرءان برتجويد.',
      teachingAids: ['سلاءيد اينتراکتيف Canva / PowerPoint', 'مصحف القرءان رسم عثماني', 'کد کليمه تجويد برورنا', 'ڤمبسر سوارا (Speaker)', 'ڤاڤن ڤوتيه ميني'],
      crossCurricularElements: ['نيلاي مورني (کتليتين، تواضع)', 'تيکنولوݢي معلومت دان کومونيکاسي (TMK)', 'بهاس (سبوتن فونيتيک)'],
      pbdAssessment: 'ڤنتکسيرن ليسن (باچاءن برتجويد) دان ڤنتکسيرن برتوليس (لمبارن ڤڠچمن حروف مد) - تاهڤ ڤڠواسأن TP3 دان TP4.',
      reflection: '32 درڤد 35 اورڠ موريد تله منچاڤاي اوبجيکتيف ڤمبلاجرن دڠن ممباچ مد اصلي 2 حرکة دڠن تڤت. 3 اورڠ موريد دبري بيمبيڠن تسميع سچارا اينديۏيدو.'
    }
  },
  {
    id: 'rph-102',
    week: 32,
    day: 'Selasa',
    date: '2026-09-15',
    time: '08:30 - 09:30 (60 Minit)',
    className: '4 Al-Farabi',
    subject: 'Pendidikan Islam',
    learningArea: 'Ibadah',
    topic: 'Solat Jamak & Qasar (Rukhsah Solat)',
    contentStandard: '3.3 Merumus konsep Solat Jamak dan Qasar serta mengamalkannya sebagai rukhsah solat.',
    learningStandard: '3.3.1 Menyatakan konsep dan syarat rukhsah Solat Jamak dan Qasar.\n3.3.2 Menjelaskan perbezaan Jamak Taqdim dan Jamak Takhir.\n3.3.3 Mengaplikasikan kaedah niat dan pelaksanaan Solat Jamak Qasar.',
    objectives: [
      'Menyatakan maksud rukhsah, Jamak Taqdim, Jamak Takhir dan Solat Qasar dengan jelas.',
      'Menerangkan sekurang-kurangnya 4 syarat sah Solat Jamak dan Qasar.',
      'Melakukan simulasi niat dan perlakuan Solat Jamak Qasar bagi musafir.'
    ],
    successCriteria: [
      'Murid dapat memadankan kad niat Jamak Taqdim dan Takhir dengan tepat.',
      'Murid dapat menyusun carta alir syarat musafir (lebih 2 marhalah / ~81km).',
      'Murid berjaya mempraktikkan simulasi solat Jamak Zohor & Asar di hadapan kelas.'
    ],
    inductionActivity: 'Guru menayangkan video animasi simulasi keluarga bermusafir menaiki kereta dari Kuala Lumpur ke Pulau Pinang dan menghadapi situasi waktu solat.',
    mainActivities: [
      'Sumbang saran tentang kemudahan (rukhsah) yang dikurniakan oleh Allah SWT kepada umat Islam.',
      'Pembelajaran Koperatif (Round Robin): Murid membincangkan perbezaan Jamak Taqdim (himpun awal) dan Jamak Takhir (himpun lewat).',
      'Amali Simulasi: Murid melakukan amali lafaz niat dan tertib perlakuan solat Jamak Qasar Zohor dan Asar di sudut surau kelas.'
    ],
    closureActivity: 'Murid menyanyikan nasyid rumus "Syarat Jamak Qasar" dan guru memberi peneguhan tentang kewajipan solat walau di mana jua berada.',
    teachingAids: ['Video Animasi Musafir', 'Peta Marhalah Malaysia', 'Carta Niat Bergambar', 'Sejadah Praktikal'],
    crossCurricularElements: ['Pendidikan Sivik (Tanggungjawab Solat)', 'Sains Sosial & Geografi (Kiraan Jarak Marhalah)', 'Kelestarian Global'],
    pbdAssessment: 'Pemerhatian amali niat dan tertib solat (TP4 & TP5).',
    reflection: '30 daripada 32 orang murid menguasai konsep rukhsah solat dan boleh melafazkan niat Jamak Taqdim serta Takhir dengan lancar.',
    status: 'Disemak PGB',
    preferredScript: 'rumi',
    jawiOverrides: {
      day: 'ثلاث',
      className: '٤ الفارابي',
      subject: 'ڤنديديقن اسلام',
      topic: 'صلاة جمع دان قصر (رخصة صلاة)',
      contentStandard: '3.3 مروموس کونسيڤ صلاة جمع دان قصر سرتا مڠعملکنڽ سباݢاي رخصة صلاة.',
      learningStandard: '3.3.1 مڽاتاکن کونسيڤ دان شرط رخصة صلاة جمع دان قصر.\n3.3.2 منجلسکن ڤربيذاءن جمع تقديم دان جمع تأخير.\n3.3.3 مڠاڤليکاسيکن قاعده نية دان ڤلقساناءن صلاة جمع قصر.',
      objectives: [
        'مڽاتاکن مقصود رخصة، جمع تقديم، جمع تأخير دان صلاة قصر دڠن جلس.',
        'منرڠکن سکورڠ-کورڠڽ 4 شرط صح صلاة جمع دان قصر.',
        'ملاکوکن سيمولاسي نية دان ڤرلاکوان صلاة جمع قصر باݢي مسافر.'
      ],
      successCriteria: [
        'موريد داڤت ممادنکن کد نية جمع تقديم دان تأخير دڠن تڤت.',
        'موريد داڤت مڽوسون چارتا الير شرط مسافر (لبيه 2 مرحلة / 81 کيلوميتر).',
        'موريد برجاي ممڤريکتيککن سيمولاسي صلاة جمع ظهر دان عصر دهادڤن کلس.'
      ],
      inductionActivity: 'ݢورو منايڠکن ۏيديو انيماسي سيمولاسي کلوارݢ برمسافر مناءيقي کريتا دري کوالا لومڤور ک ڤولاو ڤينڠ دان مڠهادڤي سيتواسي وقتو صلاة.',
      mainActivities: [
        'سومبڠ سارن تنتڠ کمودهن (رخصة) يڠ دکورنياکن اوليه الله سبحانه وتعالى کڤد اومت اسلام.',
        'ڤمبلاجرن کوڤراتيف (Round Robin): موريد ممبينچڠکن ڤربيذاءن جمع تقديم (هيمڤون اول) دان جمع تأخير (هيمڤون ليوات).',
        'عملي سيمولاسي: موريد ملاکوکن عملي لفظ نية دان ترتيب ڤرلاکوان صلاة جمع قصر ظهر دان عصر د سودوت سوراو کلس.'
      ],
      closureActivity: 'موريد مڽاڽيکن نشيد روموس "شرط جمع قصر" دان ݢورو ممبري ڤنݢوهن تنتڠ کواجبن صلاة والاو د مان جوا براد.',
      teachingAids: ['ۏيديو انيماسي مسافر', 'ڤيتا مرحلة مليسيا', 'چارتا نية برݢمبر', 'سجاده ڤريکتيکل'],
      crossCurricularElements: ['ڤنديديقن سيۏيک (تڠݢوڠجواب صلاة)', 'ساءينس سوسيال دان ݢيوݢرافي (کيرأن جارق مرحلة)', 'کلستارين ݢلوبل'],
      pbdAssessment: 'ڤمرهاتين عملي نية دان ترتيب صلاة (TP4 دان TP5).',
      reflection: '30 درڤد 32 اورڠ موريد مڠواساءي کونسيڤ رخصة صلاة دان بوليه ملافظکن نية جمع تقديم سرتا تأخير دڠن لنچر.'
    }
  },
  {
    id: 'rph-103',
    week: 32,
    day: 'Khamis',
    date: '2026-09-17',
    time: '09:00 - 10:00 (60 Minit)',
    className: '5 Al-Biruni',
    subject: 'Pendidikan Islam',
    learningArea: 'Sirah',
    topic: 'Peristiwa Hijrah Rasulullah SAW ke Madinah',
    contentStandard: '5.2 Mengambil iktibar daripada peristiwa Hijrah Rasulullah SAW ke Madinah.',
    learningStandard: '5.2.1 Menceritakan kronologi peristiwa sebelum dan semasa Hijrah Rasulullah SAW.\n5.2.2 Mengkaji faktor dan strategi kejayaan Hijrah.\n5.2.3 Mengaplikasikan iktibar peristiwa hijrah dalam kehidupan seharian sebagai murid.',
    objectives: [
      'Menceritakan sekurang-kurangnya 3 peristiwa penting semasa perjalanan Hijrah (Gua Thur, peranan Saidina Abu Bakar dan Ali R.A, Singgah di Quba\').',
      'Menyenaraikan 3 strategi Rasulullah SAW dalam menjayakan misi Hijrah.',
      'Mengeluarkan 2 iktibar hijrah ke arah perubahan sahsiah diri yang lebih cemerlang.'
    ],
    successCriteria: [
      'Murid dapat menyusun kad garis masa kronologi Hijrah dengan tepat.',
      'Murid menghasilkan peta pemikiran i-Think (Peta Buih Berganda) faktor kejayaan Hijrah.',
      'Murid menulis azam "Hijrah Akhlakku" pada kad refleksi peribadi.'
    ],
    inductionActivity: 'Guru memainkan alunan nasyid "Tala\'al Badru \'Alayna" dan bertanya mengapa penduduk Madinah menyambut ketibaan Baginda SAW dengan begitu gembira.',
    mainActivities: [
      'Peta Minda Digital: Guru menerangkan laluan perjalanan Nabi dari Mekah ke Madinah melalui peta interaktif Semenanjung Arab.',
      'Stesen Pembelajaran (Gallery Walk): 4 stesen dibuka merangkumi Stesen Perjanjian Aqabah, Stesen Gua Thur, Stesen Masjid Quba\', dan Stesen Persaudaraan Muhajirin & Ansar.',
      'Pembentangan Kumpulan: Setiap kumpulan membentangkan iktibar daripada stesen masing-masing.'
    ],
    closureActivity: 'Guru membimbing murid merumuskan bahawa Hijrah menuntut pengorbanan, perancangan teliti, dan kebergantungan mutlak kepada Allah.',
    teachingAids: ['Peta Laluan Hijrah', 'Audio Nasyid Klasik', 'Kad Stesen Gallery Walk', 'Borang Refleksi Azam Hijrah'],
    crossCurricularElements: ['Patriotisme & Cintakan Perpaduan', 'Kemahiran Berfikir Aras Tinggi (KBAT)', 'Kreativiti dan Inovasi'],
    pbdAssessment: 'Pembentangan lisan, peta i-Think dan refleksi kendiri (TP4).',
    reflection: 'Semua murid memberikan penglibatan yang sangat aktif semasa Gallery Walk dan berjaya merumuskan nilai pengorbanan sahabat.',
    status: 'Lengkap',
    preferredScript: 'rumi',
    jawiOverrides: {
      day: 'خميس',
      className: '٥ البيروني',
      subject: 'ڤنديديقن اسلام',
      topic: 'ڤريستيوا هجرة رسول الله صلى الله عليه وسلم ک مدينة',
      contentStandard: '5.2 مڠمبيل عبرة درڤد ڤريستيوا هجرة رسول الله صلى الله عليه وسلم ک مدينة.',
      learningStandard: '5.2.1 منچريتاکن کرونولوݢي ڤريستيوا سبلوم دان سماس هجرة رسول الله صلى الله عليه وسلم.\n5.2.2 مڠکاجي فکتور دان ستراتيݢي کجايأن هجرة.\n5.2.3 مڠاڤليکاسيکن عبرة ڤريستيوا هجرة دالم کهيدوڤن سهارين سباݢاي موريد.',
      objectives: [
        'منچريتاکن سکورڠ-کورڠڽ 3 ڤريستيوا ڤنتيڠ سماس ڤرجالنن هجرة (ݢوا ثور، ڤرانن سيدنا ابو بکر دان علي رضي الله عنه، سيڠݢه د قباء).',
        'مڽنارايکن 3 ستراتيݢي رسول الله صلى الله عليه وسلم دالم منجاياکن ميسي هجرة.',
        'مڠلوارکن 2 عبرة هجرة ک اره ڤروبهن شخصية ديري يڠ لبيه چمرلڠ.'
      ],
      successCriteria: [
        'موريد داڤت مڽوسون کد ݢاريس ماس کرونولوݢي هجرة دڠن تڤت.',
        'موريد مڠحاصيلکن ڤيتا ڤميکيرن i-Think (ڤيتا بوءيه برݢندا) فکتور کجايأن هجرة.',
        'موريد منوليس عزم "هجرة اخلاقکو" ڤد کد ريفليکسي ڤريبادي.'
      ],
      inductionActivity: 'ݢورو مماءينکن الونن نشيد "طلع البدر علينا" دان برتاڽ مڠاڤ ڤندودوق مدينة مڽمبوت کتيباءن بݢيندا صلى الله عليه وسلم دڠن بݢيتو ݢمبيرا.',
      mainActivities: [
        'ڤيتا ميندا ديݢيتل: ݢورو منرڠکن لالوان ڤرجالنن نبي دري مكة ک مدينة ملالوءي ڤيتا اينتراکتيف سمننجوڠ عرب.',
        'ستيسين ڤمبلاجرن (Gallery Walk): 4 ستيسين دبوک مرڠکومي ستيسين ڤرجنجين عقبة، ستيسين ݢوا ثور، ستيسين مسجد قباء، دان ستيسين ڤرساوداراءن مهاجرين دان انصار.',
        'ڤمبنتڠن کومڤولن: ستياڤ کومڤولن ممبنتڠکن عبرة درڤد ستيسين ماسيڠ-ماسيڠ.'
      ],
      closureActivity: 'ݢورو ممبيمبيڠ موريد مروموسکن بهاوا هجرة منونتوت ڤڠوربانن، ڤرانچڠن تليتي، دان کبرݢنتوڠن مطلق کڤد الله.',
      teachingAids: ['ڤيتا لالوان هجرة', 'اوديو نشيد کلاسيک', 'کد ستيسين Gallery Walk', 'بورڠ ريفليکسي عزم هجرة'],
      crossCurricularElements: ['ڤاتريوتيسمى دان چينتاکن ڤرڤادوان', 'کماهيرن برفيکير ارس تيڠݢي (KBAT)', 'کرياتيۏيتي دان اينوۏاسي'],
      pbdAssessment: 'ڤمبنتڠن ليسن، ڤيتا i-Think دان ريفليکسي کنديري (TP4).',
      reflection: 'سموا موريد ممبريکن ڤڠليبتن يڠ ساڠت اکتيف سماس Gallery Walk دان برجاي مروموسکن نيلاي ڤڠوربانن صحابت.'
    }
  }
];

export const dskpCurriculumData: DskpItem[] = [
  {
    id: 'dskp-quran-1',
    yearLevel: 'Tahun 4',
    area: 'Al-Quran (Tilawah & Hafazan)',
    theme: 'Bacaan & Hafazan Surah Pilihan',
    code: '1.1 & 1.2',
    contentStandard: '1.1 Membaca Surah Al-Balad dan Surah At-Tin dengan betul dan bertajwid.\n1.2 Menghafaz Surah Al-Qari\'ah dan Surah At-Takathur.',
    learningStandard: 'Membaca potongan ayat dan surah dengan sebutan makhraj huruf yang fasih serta memelihara hukum wakaf dan ibtida\'.',
    performanceStandard: 'TP1: Tahu huruf & sebutan | TP3: Membaca dengan tajwid asas | TP6: Membaca & menghafaz secara fasih, bertajwid serta istiqamah membimbing rakan.',
    notes: 'Penekanan j-QAF Model Khatam Al-Quran.'
  },
  {
    id: 'dskp-tajwid-1',
    yearLevel: 'Tahun 4',
    area: 'Al-Quran (Tajwid)',
    theme: 'Hukum Nun Sakinah & Mad',
    code: '1.4',
    contentStandard: '1.4 Membaca ayat yang mengandungi hukum Izhar Halqi, Idgham Ma\'al Ghunnah, Idgham Bila Ghunnah, Iqlab dan Ikhfa\' Haqiqi serta Mad Asli.',
    learningStandard: 'Mengenal pasti hukum tajwid dalam mashaf Resam Uthmani dan membacanya dengan harakat dan dengung yang tepat.',
    performanceStandard: 'TP1: Menyebut nama hukum | TP4: Mengaplikasikan hukum tajwid dalam bacaan | TP6: Menjadi rujukan bacaan tajwid murid lain.',
    notes: 'Ujian Lisan Tasmik Mingguan.'
  },
  {
    id: 'dskp-hadis-1',
    yearLevel: 'Tahun 4',
    area: 'Hadis',
    theme: 'Memuliakan Tetamu & Hubungan Kejiranan',
    code: '2.1',
    contentStandard: '2.1 Membaca dan memahami hadis Memuliakan Tetamu serta mengamalkan tuntutannya.',
    learningStandard: 'Membaca hadis dengan lancar, menyatakan terjemahan, dan menyenaraikan adab menyambut serta melayan tetamu.',
    performanceStandard: 'TP1: Membaca teks hadis | TP3: Menjelaskan maksud | TP5: Mengamalkan adab memuliakan tetamu dalam kehidupan.',
    notes: 'Kaitkan dengan adab sivik Malaysia.'
  },
  {
    id: 'dskp-akidah-1',
    yearLevel: 'Tahun 4',
    area: 'Akidah',
    theme: 'Kufur, Nifaq dan Riddah',
    code: '3.1',
    contentStandard: '3.1 Merumus konsep Kufur dan Nifaq serta menjauhinya secara beradab dan istiqamah.',
    learningStandard: 'Menyatakan maksud kufur dan nifaq, bahagian kufur (kufur hakiki & kufur nikmat), kesan terhadap individu dan masyarakat.',
    performanceStandard: 'TP2: Menjelaskan contoh perbuatan nifaq | TP5: Menjaga lisan dan perbuatan daripada ciri-ciri munafik.',
    notes: 'Pengukuhan Akidah Ahli Sunnah Wal Jamaah (ASWJ).'
  },
  {
    id: 'dskp-ibadah-1',
    yearLevel: 'Tahun 4',
    area: 'Ibadah',
    theme: 'Solat Jumaat & Rukhsah Solat',
    code: '4.2',
    contentStandard: '4.2 Merumus kewajipan Solat Jumaat dan melaksanakannya dengan sempurna.',
    learningStandard: 'Menyatakan syarat wajib, syarat sah, amalan sunat hari Jumaat, serta adab mendengar khutbah.',
    performanceStandard: 'TP3: Melakukan amali solat Jumaat | TP6: Sentiasa istiqamah hadir awal ke masjid untuk solat Jumaat.',
    notes: 'Amali di Surau An-Nur Sekolah.'
  },
  {
    id: 'dskp-sirah-1',
    yearLevel: 'Tahun 4',
    area: 'Sirah',
    theme: 'Perjanjian Hudaibiyah & Pembukaan Kota Mekah',
    code: '5.1',
    contentStandard: '5.1 Mengambil iktibar daripada peristiwa Perjanjian Hudaibiyah.',
    learningStandard: 'Menerangkan rentetan peristiwa, isi kandungan perjanjian, dan kebijaksanaan strategi dakwah Rasulullah SAW.',
    performanceStandard: 'TP3: Menceritakan peristiwa | TP5: Mencontohi sifat sabar dan diplomasi Rasulullah SAW.',
    notes: 'Integrasi EMK Patriotisme dan Perpaduan.'
  },
  {
    id: 'dskp-adab-1',
    yearLevel: 'Tahun 4',
    area: 'Adab Islamiah',
    theme: 'Adab Berpakaian & Menutup Aurat',
    code: '6.1',
    contentStandard: '6.1 Merumus adab berpakaian mengikut syariat Islam serta mengamalkannya.',
    learningStandard: 'Menyatakan batas aurat lelaki dan perempuan, ciri pakaian menepati syariat, dan hikmah menutup aurat.',
    performanceStandard: 'TP3: Menerangkan batas aurat | TP6: Sentiasa berpakaian sopan dan menutup aurat dengan sempurna.',
    notes: 'Kaitkan dengan etika pakaian sekolah KPM.'
  },
  {
    id: 'dskp-jawi-1',
    yearLevel: 'Tahun 4',
    area: 'Jawi',
    theme: 'Teks Jawi: Imbuhan & Kata Pinjaman',
    code: '7.1',
    contentStandard: '7.1 Membaca, membina dan menulis perenggan teks Jawi dengan betul.',
    learningStandard: 'Mengeja perkataan berimbuhan pinjaman bahasa Arab dan bahasa Inggeris mengikut kaedah DBP terkini.',
    performanceStandard: 'TP3: Membaca teks bertulisan Jawi | TP6: Menulis khat dan karangan Jawi yang kemas serta berseni.',
    notes: 'Program Kem Cemerlang Jawi (KCJ).'
  }
];

export const samplePbdStudents: PbdStudentRecord[] = [
  {
    id: 'std-001',
    studentName: 'Ahmad Danial bin Zulkifli',
    className: '4 Ibnu Sina',
    gender: 'Lelaki',
    tpQuran: 5,
    tpHadis: 5,
    tpAkidah: 5,
    tpIbadah: 6,
    tpSirah: 4,
    tpAdab: 6,
    tpJawi: 5,
    overallTp: 5,
    teacherRemarks: 'Murid sangat cemerlang dalam bacaan tajwid Al-Quran dan sering menjadi Bilal di surau sekolah.'
  },
  {
    id: 'std-002',
    studentName: 'Nur Aisyah Humaira binti Mohd Fairuz',
    className: '4 Ibnu Sina',
    gender: 'Perempuan',
    tpQuran: 6,
    tpHadis: 6,
    tpAkidah: 6,
    tpIbadah: 5,
    tpSirah: 5,
    tpAdab: 6,
    tpJawi: 6,
    overallTp: 6,
    teacherRemarks: 'Penguasaan khatam Al-Quran yang fasih, tulisan Jawi amat berseni, dan sahsiah terpuji.'
  },
  {
    id: 'std-003',
    studentName: 'Muhammad Faris Aiman bin Syamsul',
    className: '4 Ibnu Sina',
    gender: 'Lelaki',
    tpQuran: 4,
    tpHadis: 4,
    tpAkidah: 4,
    tpIbadah: 4,
    tpSirah: 4,
    tpAdab: 5,
    tpJawi: 3,
    overallTp: 4,
    teacherRemarks: 'Menunjukkan peningkatan yang baik. Perlu diberi latih tubi tambahan dalam sambungan huruf Jawi.'
  },
  {
    id: 'std-004',
    studentName: 'Siti Nur Safiyyah binti Kamaruddin',
    className: '4 Ibnu Sina',
    gender: 'Perempuan',
    tpQuran: 5,
    tpHadis: 5,
    tpAkidah: 5,
    tpIbadah: 5,
    tpSirah: 5,
    tpAdab: 5,
    tpJawi: 5,
    overallTp: 5,
    teacherRemarks: 'Konsisten dalam setiap bidang, aktif bertanya dan menyiapkan tugasan modul dengan kemas.'
  },
  {
    id: 'std-005',
    studentName: 'Adam Hariz bin Khairul Anuar',
    className: '4 Ibnu Sina',
    gender: 'Lelaki',
    tpQuran: 3,
    tpHadis: 4,
    tpAkidah: 3,
    tpIbadah: 4,
    tpSirah: 3,
    tpAdab: 4,
    tpJawi: 3,
    overallTp: 3,
    teacherRemarks: 'Sedang mengikuti program bimbingan khas Iqra Jilid 5 dan bimbingan asas akidah.'
  },
  {
    id: 'std-006',
    studentName: 'Nur Imanina binti Abdul Hadi',
    className: '4 Ibnu Sina',
    gender: 'Perempuan',
    tpQuran: 5,
    tpHadis: 5,
    tpAkidah: 6,
    tpIbadah: 5,
    tpSirah: 5,
    tpAdab: 6,
    tpJawi: 5,
    overallTp: 5,
    teacherRemarks: 'Mempunyai daya kepimpinan Islamiah yang tinggi, mengetuai bacaan doa harian di kelas.'
  }
];

export const sampleTasmikRecords: TasmikRecord[] = [
  {
    id: 'tas-01',
    studentName: 'Ahmad Danial bin Zulkifli',
    className: '4 Ibnu Sina',
    currentStage: 'Al-Quran Juz 16-30',
    currentSurah: 'Surah Maryam',
    currentVersePage: 'Ayat 1 - 25 (Halaman 305)',
    hafazanProgress: 'Surah An-Naba & An-Nazi\'at (Hafaz Penuh)',
    lastTasmikDate: '2026-09-14',
    status: 'Cemerlang',
    tasmikTeacher: 'Ustaz Muhammad Harith'
  },
  {
    id: 'tas-02',
    studentName: 'Nur Aisyah Humaira binti Mohd Fairuz',
    className: '4 Ibnu Sina',
    currentStage: 'Khatam Al-Quran',
    currentSurah: 'Khatam Juzuk 30 (Al-Baqarah ulangan)',
    currentVersePage: 'Halaman 585 - Khatam',
    hafazanProgress: 'Juz Amma (37 Surah Hafaz Lengkap)',
    lastTasmikDate: '2026-09-14',
    status: 'Cemerlang',
    tasmikTeacher: 'Ustazah Siti Aminah'
  },
  {
    id: 'tas-03',
    studentName: 'Muhammad Faris Aiman bin Syamsul',
    className: '4 Ibnu Sina',
    currentStage: 'Al-Quran Juz 1-15',
    currentSurah: 'Surah Al-An\'am',
    currentVersePage: 'Ayat 45 - 60 (Halaman 133)',
    hafazanProgress: 'Surah Al-A\'la & Al-Ghasyiyah',
    lastTasmikDate: '2026-09-11',
    status: 'Lancar',
    tasmikTeacher: 'Ustaz Muhammad Harith'
  },
  {
    id: 'tas-04',
    studentName: 'Adam Hariz bin Khairul Anuar',
    className: '4 Ibnu Sina',
    currentStage: 'Iqra 5',
    currentSurah: 'Iqra Jilid 5',
    currentVersePage: 'Halaman 18 (Hukum Waqaf & Tanwin)',
    hafazanProgress: 'Surah Al-Kafirun & An-Nasr',
    lastTasmikDate: '2026-09-10',
    status: 'Perlu Bimbingan Tajwid',
    tasmikTeacher: 'Ustaz Muhammad Harith'
  },
  {
    id: 'tas-05',
    studentName: 'Siti Nur Safiyyah binti Kamaruddin',
    className: '4 Ibnu Sina',
    currentStage: 'Al-Quran Juz 16-30',
    currentSurah: 'Surah Yasin',
    currentVersePage: 'Ayat 1 - 40 (Halaman 440)',
    hafazanProgress: 'Surah Al-Mulk & As-Sajdah',
    lastTasmikDate: '2026-09-12',
    status: 'Cemerlang',
    tasmikTeacher: 'Ustazah Norhafizah'
  }
];

export const sampleSahsiahRecords: StudentSahsiahRecord[] = [
  {
    id: 'sah-01',
    studentName: 'Ahmad Danial bin Zulkifli',
    className: '4 Ibnu Sina',
    points: 145,
    meritScore: 145,
    levelBadge: 'Bintang Sahsiah Emas',
    badge: 'Bintang Sahsiah Emas',
    goodDeedsCount: 3,
    goodDeeds: [
      { id: 'gd-1', title: 'Imam Solat Zohor Berjemaah Surau An-Nur', category: 'Solat Berjemaah', points: 20, date: '2026-09-14', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-2', title: 'Membantu Mengemas & Menyusun Rehal Surau', category: 'Khidmat Surau', points: 15, date: '2026-09-13', recordedBy: 'Ustaz Ahmad Fauzi' },
      { id: 'gd-3', title: 'Membimbing Rakan Dalam Tasmik Iqra', category: 'Bacaan Al-Quran', points: 15, date: '2026-09-10', recordedBy: 'Ustaz Muhammad Harith' }
    ],
    deeds: [
      { id: 'gd-1', title: 'Imam Solat Zohor Berjemaah Surau An-Nur', category: 'Solat Berjemaah', points: 20, date: '2026-09-14', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-2', title: 'Membantu Mengemas & Menyusun Rehal Surau', category: 'Khidmat Surau', points: 15, date: '2026-09-13', recordedBy: 'Ustaz Ahmad Fauzi' },
      { id: 'gd-3', title: 'Membimbing Rakan Dalam Tasmik Iqra', category: 'Bacaan Al-Quran', points: 15, date: '2026-09-10', recordedBy: 'Ustaz Muhammad Harith' }
    ]
  },
  {
    id: 'sah-02',
    studentName: 'Nur Aisyah Humaira binti Mohd Fairuz',
    className: '4 Ibnu Sina',
    points: 160,
    meritScore: 160,
    levelBadge: 'Bintang Sahsiah Emas',
    badge: 'Bintang Sahsiah Emas',
    goodDeedsCount: 3,
    goodDeeds: [
      { id: 'gd-4', title: 'Mendapat Johan Pertandingan Hafazan MQSS', category: 'Kepimpinan', points: 30, date: '2026-09-08', recordedBy: 'Ustazah Siti Aminah' },
      { id: 'gd-5', title: 'Istiqamah Membaca Al-Quran Pagi Jumaat', category: 'Bacaan Al-Quran', points: 20, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-6', title: 'Membantu Mengajar Tulisan Khat kepada Murid Tahap 1', category: 'Budi Pekerti', points: 20, date: '2026-09-05', recordedBy: 'Ustaz Muhammad Harith' }
    ],
    deeds: [
      { id: 'gd-4', title: 'Mendapat Johan Pertandingan Hafazan MQSS', category: 'Kepimpinan', points: 30, date: '2026-09-08', recordedBy: 'Ustazah Siti Aminah' },
      { id: 'gd-5', title: 'Istiqamah Membaca Al-Quran Pagi Jumaat', category: 'Bacaan Al-Quran', points: 20, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-6', title: 'Membantu Mengajar Tulisan Khat kepada Murid Tahap 1', category: 'Budi Pekerti', points: 20, date: '2026-09-05', recordedBy: 'Ustaz Muhammad Harith' }
    ]
  },
  {
    id: 'sah-03',
    studentName: 'Muhammad Faris Aiman bin Syamsul',
    className: '4 Ibnu Sina',
    points: 95,
    meritScore: 95,
    levelBadge: 'Bintang Sahsiah Perak',
    badge: 'Bintang Sahsiah Perak',
    goodDeedsCount: 2,
    goodDeeds: [
      { id: 'gd-7', title: 'Bilal Azan Zohor di Surau An-Nur', category: 'Solat Berjemaah', points: 15, date: '2026-09-12', recordedBy: 'Ustaz Ahmad Fauzi' },
      { id: 'gd-8', title: 'Menyusun Kasut & Selipar Jemaah Surau', category: 'Khidmat Surau', points: 10, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' }
    ],
    deeds: [
      { id: 'gd-7', title: 'Bilal Azan Zohor di Surau An-Nur', category: 'Solat Berjemaah', points: 15, date: '2026-09-12', recordedBy: 'Ustaz Ahmad Fauzi' },
      { id: 'gd-8', title: 'Menyusun Kasut & Selipar Jemaah Surau', category: 'Khidmat Surau', points: 10, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' }
    ]
  },
  {
    id: 'sah-04',
    studentName: 'Adam Hariz bin Khairul Anuar',
    className: '4 Ibnu Sina',
    points: 70,
    meritScore: 70,
    levelBadge: 'Bintang Sahsiah Gangsa',
    badge: 'Bintang Sahsiah Gangsa',
    goodDeedsCount: 2,
    goodDeeds: [
      { id: 'gd-9', title: 'Hadir Awal Program Solat Hajat & Yasin', category: 'Solat Berjemaah', points: 15, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-10', title: 'Mengutip Sampah di Koridor Blok Agama', category: 'Budi Pekerti', points: 10, date: '2026-09-09', recordedBy: 'Ustazah Norhafizah' }
    ],
    deeds: [
      { id: 'gd-9', title: 'Hadir Awal Program Solat Hajat & Yasin', category: 'Solat Berjemaah', points: 15, date: '2026-09-11', recordedBy: 'Ustaz Muhammad Harith' },
      { id: 'gd-10', title: 'Mengutip Sampah di Koridor Blok Agama', category: 'Budi Pekerti', points: 10, date: '2026-09-09', recordedBy: 'Ustazah Norhafizah' }
    ]
  }
];

export const surauDutySchedule: SurauDutyItem[] = [
  { id: 'sd-1', day: 'Isnin', prayerName: 'Solat Zohor', imamName: 'Ahmad Danial (4 Ibnu Sina)', bilalName: 'Muhammad Faris (4 Ibnu Sina)', tazkirahPresenter: 'Nur Aisyah Humaira', supervisorTeacher: 'Ustaz Muhammad Harith' },
  { id: 'sd-2', day: 'Selasa', prayerName: 'Solat Zohor', imamName: 'Muhammad Rayyan (5 Al-Biruni)', bilalName: 'Irfan Naufal (5 Al-Biruni)', tazkirahPresenter: 'Siti Nur Safiyyah', supervisorTeacher: 'Ustaz Ahmad Fauzi' },
  { id: 'sd-3', day: 'Rabu', prayerName: 'Solat Zohor', imamName: 'Harith Iskandar (6 Al-Ghazali)', bilalName: 'Muizuddin (6 Al-Ghazali)', tazkirahPresenter: 'Adam Harith (6 Al-Ghazali)', supervisorTeacher: 'Ustaz Razali bin Omar' },
  { id: 'sd-4', day: 'Khamis', prayerName: 'Solat Zohor', imamName: 'Amirul Asyraf (5 Al-Khawarizmi)', bilalName: 'Hazim Daniel (5 Al-Khawarizmi)', tazkirahPresenter: 'Nur Imanina', supervisorTeacher: 'Ustazah Siti Aminah' },
  { id: 'sd-5', day: 'Jumaat', prayerName: 'Program Yasin & Kahfi', imamName: 'Ustaz Muhammad Harith', bilalName: 'Ahmad Danial', tazkirahPresenter: 'Ustaz Ahmad Fauzi', supervisorTeacher: 'Semua Guru GPI' }
];

export const studentWelfareList: WelfareItem[] = [
  { id: 'wf-1', studentName: 'Muhammad Haziq bin Roslan', className: '4 Al-Farabi', category: 'Anak Yatim', assistanceType: 'Set Lengkap Baju Melayu Sekolah & Songkok', status: 'Diagihkan', sponsor: 'Tabung Kebajikan Panitia PI' },
  { id: 'wf-2', studentName: 'Nur Zulaikha binti Zamri', className: '5 Al-Khawarizmi', category: 'Asnaf Zakat', assistanceType: 'Bantuan Telekung Solat & Beg Sekolah', status: 'Diagihkan', sponsor: 'Zakat MAIWP / Baitulmal' },
  { id: 'wf-3', studentName: 'Muhammad Hafiz bin Ismail', className: '4 Ibnu Sina', category: 'B40', assistanceType: 'Kupon Makanan RMT & Mushaf Al-Quran Terjemahan', status: 'Diterima', sponsor: 'PIBG SK Seri Saujana' },
  { id: 'wf-4', studentName: 'Siti Sarah binti Osman', className: '6 Al-Ghazali', category: 'Bantuan Kasih', assistanceType: 'Pakej Peralatan Tulisan Khat & Buku Rujukan', status: 'Dalam Proses', sponsor: 'Kelab Guru & Staf' }
];

export const kokoClubsData: KokoClubItem[] = [
  {
    id: 'koko-1',
    name: 'Persatuan Agama Islam (PAI)',
    category: 'Persatuan',
    advisorTeachers: ['Ustaz Muhammad Harith (Ketua)', 'Ustazah Siti Aminah', 'Ustaz Razali bin Omar'],
    advisors: ['Ustaz Muhammad Harith (Ketua)', 'Ustazah Siti Aminah', 'Ustaz Razali bin Omar'],
    presidentStudent: 'Ahmad Danial bin Zulkifli (4 Ibnu Sina)',
    president: 'Ahmad Danial bin Zulkifli (4 Ibnu Sina)',
    totalMembers: 78,
    meetingDay: 'Setiap Rabu (02:00 - 04:00 Petang)',
    description: 'Memupuk sahsiah islamiah dan kemahiran kepimpinan murid melalui pelbagai aktiviti dakwah.',
    achievements: [
      'Johan Pertandingan Kuiz Agama Islam Daerah 2025',
      'Anugerah Persatuan Paling Aktif Peringkat Sekolah 2025',
      'Penyertaan Karnival Dakwah Sekolah Rendah Negeri'
    ],
    upcomingActivities: [
      'Kem Kepimpinan Da\'i Muda Sekolah (25 September 2026)',
      'Program Ziarah Mahabbah & Khidmat Komuniti Masjid (10 Oktober 2026)'
    ]
  },
  {
    id: 'koko-2',
    name: 'Kelab Seni Khat & Tulisan Jawi',
    category: 'Kelab',
    advisorTeachers: ['Ustaz Muhammad Harith', 'Ustazah Norhafizah binti Yusof'],
    advisors: ['Ustaz Muhammad Harith', 'Ustazah Norhafizah binti Yusof'],
    presidentStudent: 'Nur Aisyah Humaira binti Mohd Fairuz',
    president: 'Nur Aisyah Humaira binti Mohd Fairuz',
    totalMembers: 45,
    meetingDay: 'Setiap Rabu (02:00 - 04:00 Petang)',
    description: 'Mengasah bakat kaligrafi khat Arab dan memperkasakan penguasaan tulisan Jawi.',
    achievements: [
      'Johan Pertandingan Seni Khat Festival Kesenian Islam Peringkat Negeri 2025',
      'Tempat Ketiga Pertandingan Kaligrafi Islam Kebangsaan',
      'Penerbitan Kalendar Meja Seni Khat Karya Murid 2026'
    ],
    upcomingActivities: [
      'Bengkel Asas Kaedah Khat Nasakh & Thuluth (28 September 2026)',
      'Pameran & Jualan Amal Seni Khat Murid (15 November 2026)'
    ]
  },
  {
    id: 'koko-3',
    name: 'Kumpulan Nasyid "Soutul Huffaz" & Kompang Selawat',
    category: 'Kesenian',
    advisorTeachers: ['Ustaz Ahmad Fauzi bin Daud', 'Ustaz Razali bin Omar'],
    advisors: ['Ustaz Ahmad Fauzi bin Daud', 'Ustaz Razali bin Omar'],
    presidentStudent: 'Harith Iskandar (6 Al-Ghazali)',
    president: 'Harith Iskandar (6 Al-Ghazali)',
    totalMembers: 32,
    meetingDay: 'Setiap Rabu & Jumaat Petang',
    description: 'Mengembangkan bakat seni suara nasyid kontemporari dan paluan kompang selawat.',
    achievements: [
      'Naib Johan Festival Nasyid Sekolah Rendah (FNSR) Zon Barat',
      'Persembahan Utama Majlis Sambutan Maulidur Rasul Peringkat Daerah',
      'Anugerah Lirik Lagu Kontemporari Terbaik'
    ],
    upcomingActivities: [
      'Latihan Intensif Rakaman Single Nasyid Sekolah (02 Oktober 2026)',
      'Persembahan Iringan Majlis Anugerah Cemerlang (20 November 2026)'
    ]
  }
];

export const mqssCompetitionsData: MqssCompetition[] = [
  { id: 'mq-1', title: 'Majlis Tilawah Al-Quran (MQSS)', level: 'Negeri', category: 'Tilawah Al-Quran', participantName: 'Muhammad Rayyan bin Hisham', className: '5 Al-Biruni', achievement: 'Johan (Emas) - Wakili Negeri ke Kebangsaan', year: 2026 },
  { id: 'mq-2', title: 'Pertandingan Hafazan Al-Quran (MQSS)', level: 'Negeri', category: 'Hafazan Al-Quran', participantName: 'Nur Aisyah Humaira binti Mohd Fairuz', className: '4 Ibnu Sina', achievement: 'Johan (Emas)', year: 2026 },
  { id: 'mq-3', title: 'Pertandingan Da\'i Cilik Sekolah Rendah', level: 'Daerah', category: 'Da\'i Cilik / Syarahan', participantName: 'Ahmad Danial bin Zulkifli', className: '4 Ibnu Sina', achievement: 'Naib Johan', year: 2026 },
  { id: 'mq-4', title: 'Festival Seni Khat & Jawi MQSS', level: 'Daerah', category: 'Seni Khat', participantName: 'Siti Nur Safiyyah binti Kamaruddin', className: '4 Ibnu Sina', achievement: 'Johan Kategori Sekolah Rendah', year: 2026 },
  { id: 'mq-5', title: 'Festival Nasyid Sekolah Rendah (FNSR)', level: 'Zon', category: 'Nasyid', participantName: 'Kumpulan Soutul Huffaz SK Seri Saujana', className: 'Tahun 4, 5 & 6', achievement: 'Johan & Persembahan Terbaik', year: 2026 }
];

export const panitiaMembersList: PanitiaMember[] = [
  { id: 'p-1', name: 'Muhammad Harith bin Abdullah', salutation: 'Ustaz', role: 'Ketua Panitia Pendidikan Islam', grade: 'DG44 (Guru Cemerlang)', email: 'g-77071151@moe-dl.edu.my', phone: '019-3456789', specialization: 'Al-Quran, Tajwid & Seni Khat', responsibilities: ['Pengurusan Panitia', 'e-RPH & DSKP', 'Penyelarasan Peperiksaan', 'Bimbingan Guru Baharu'] },
  { id: 'p-2', name: 'Siti Aminah binti Haji Hassan', salutation: 'Ustazah', role: 'Setiausaha Panitia & Penyelaras j-QAF', grade: 'DG44', email: 'g-22345678@moe-dl.edu.my', phone: '013-9876543', specialization: 'Bahasa Arab & Ulum Syariah', responsibilities: ['Minit Mesyuarat', 'Data j-QAF & KCJ', 'Penyelaras Bahasa Arab'] },
  { id: 'p-3', name: 'Ahmad Fauzi bin Daud', salutation: 'Ustaz', role: 'Penyelaras Surau An-Nur & Dakwah', grade: 'DG41', email: 'g-33456789@moe-dl.edu.my', phone: '017-6543210', specialization: 'Ibadah, Kem Bestari Solat & Nasyid', responsibilities: ['Pengimarahan Surau', 'Jadual Imam & Bilal', 'Jurulatih Nasyid Sekolah'] },
  { id: 'p-4', name: 'Norhafizah binti Yusof', salutation: 'Ustazah', role: 'Penyelaras Program e-Tasmik & Khatam Al-Quran', grade: 'DG44', email: 'g-44567890@moe-dl.edu.my', phone: '012-3456711', specialization: 'Al-Quran & Pemulihan Jawi (KCJ)', responsibilities: ['Rekod e-Tasmik', 'Majlis Khatam Quran', 'Pemulihan Jawi'] },
  { id: 'p-5', name: 'Razali bin Omar', salutation: 'Ustaz', role: 'Penyelaras Penilaian PBD & UASA Pendidikan Islam', grade: 'DG42', email: 'g-55678901@moe-dl.edu.my', phone: '018-9012345', specialization: 'Sirah Nabawiyyah & Akidah', responsibilities: ['Pengurusan PBD', 'Bank Soalan UASA', 'Penyelaras PAI Koko'] }
];

export const eventGalleries: EventGalleryItem[] = [
  {
    id: 'eg-1',
    title: 'Sambutan Maulidur Rasul 1448H Peringkat Sekolah',
    date: '10 September 2026',
    hijriDate: '18 Rabiul Awal 1448H',
    category: 'Maulidur Rasul',
    description: 'Perarakan selawat sejauh 2km mengelilingi kawasan kejiranan sekolah, persembahan nasyid, pertandingan sepanduk tercantik dan ceramah khas kecintaan kepada Nabi Muhammad SAW.',
    photoCount: 48,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    highlightUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    tags: ['Perarakan Selawat', 'Ceramah Perdana', 'Pertandingan Sepanduk', 'Ukhuwah']
  },
  {
    id: 'eg-2',
    title: 'Kem Bestari Solat (KBS) Siri 2/2026',
    date: '22 Ogos 2026',
    hijriDate: '28 Safar 1448H',
    category: 'Kem Bestari Solat',
    description: 'Latihan intensif amali wuduk sempurna, tertib rukun solat 13, bacaan dalam solat serta praktikal solat jenazah untuk semua murid Tahun 1 hingga Tahun 6.',
    photoCount: 65,
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    highlightUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    tags: ['Amali Wuduk', 'Rukun 13', 'Bacaan Solat', 'Tasmik Amali']
  },
  {
    id: 'eg-3',
    title: 'Program Ihya\' Ramadhan & Majlis Khatam Al-Quran Perdana',
    date: '18 Mac 2026',
    hijriDate: '20 Ramadhan 1447H',
    category: 'Ihya Ramadhan',
    description: 'Tadarus Al-Quran harian guru dan murid, agihan bubur lambuk kepada komuniti setempat, sumbangan zakat asnaf dan majlis meraikan 85 orang murid khatam Al-Quran.',
    photoCount: 82,
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    highlightUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    tags: ['Khatam Al-Quran', 'Tadarus', 'Infaq Ramadhan', 'Bubur Lambuk']
  },
  {
    id: 'eg-4',
    title: 'Kem Cemerlang Jawi (KCJ) Murid j-QAF',
    date: '15 Julai 2026',
    hijriDate: '20 Muharram 1448H',
    category: 'Kem Bestari Solat',
    description: 'Modul bimbingan pantas mengeja, menyambung huruf dan membaca teks Jawi menggunakan kaedah interaktif, kad imbasan dan permainan didik hibur.',
    photoCount: 36,
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
    highlightUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80',
    tags: ['Celik Jawi', 'Didik Hibur', 'Bengkel Tulisan', 'j-QAF']
  }
];

export const officialDocumentsList: OfficialDocument[] = [
  { id: 'doc-1', title: 'DSKP KSSR Semakan Pendidikan Islam Tahun 4 Rasmi KPM', code: 'BPK-DSKP-PI-T4', category: 'DSKP & RPT', fileSize: '2.4 MB PDF', dateUploaded: '2026-01-10' },
  { id: 'doc-2', title: 'Rancangan Pengajaran Tahunan (RPT) Pendidikan Islam 2026', code: 'RPT-PI-2026-PANITIA', category: 'DSKP & RPT', fileSize: '1.1 MB DOCX', dateUploaded: '2026-01-12' },
  { id: 'doc-3', title: 'Surat Pekeliling Ikhtisas Pelaksanaan Program j-QAF dan Tasmik', code: 'SPI KPM Bil. 2/2020', category: 'Surat Pekeliling Ikhtisas (SPI)', fileSize: '850 KB PDF', dateUploaded: '2026-02-05' },
  { id: 'doc-4', title: 'Borang Rekod Pentaksiran Bilik Darjah (PBD) Excel Format KPM', code: 'BORANG-PBD-PI-2026', category: 'Panduan PBD', fileSize: '1.8 MB XLSX', dateUploaded: '2026-03-01' },
  { id: 'doc-5', title: 'Buku Panduan Perlaksanaan Kem Bestari Solat (KBS) Lengkap', code: 'BPK-KBS-GPI', category: 'Bahan Khas', fileSize: '4.2 MB PDF', dateUploaded: '2026-04-18' },
  { id: 'doc-6', title: 'Borang Rekod Bacaan e-Tasmik Model Khatam Al-Quran', code: 'BORANG-TASMIK-JQAF', category: 'Borang j-QAF', fileSize: '650 KB PDF', dateUploaded: '2026-02-20' }
];

export const duasAndMathuratList: DuaItem[] = [
  {
    id: 'dua-1',
    title: 'Doa Menuntut Ilmu & Terang Hati',
    category: 'Doa Menghafaz',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    transliteration: 'Rabbisy-rah lii sodrii, wa yassir lii amrii, wahlul \'uqdatam-mil-lisaanii, yafqahuu qawlii.',
    translation: 'Wahai Tuhanku, lapangkanlah dadaku, permudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka faham perkataanku.',
    fadhilat: 'Doa Nabi Musa A.S (Surah Taha: 25-28) yang sangat dianjurkan dibaca oleh guru sebelum mengajar dan murid sebelum memulakan sesi pembelajaran.'
  },
  {
    id: 'dua-2',
    title: 'Doa Tambahan Ilmu Yang Bermanfaat',
    category: 'Doa Harian',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allaahumma innii as-aluka \'ilman naafi\'an, wa rizqan toyyiban, wa \'amalan mutaqabbalaa.',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amalan yang diterima.',
    fadhilat: 'Hadis Riwayat Ibnu Majah (No. 925), dibaca setiap pagi selepas Solat Subuh untuk memohon keberkatan hari.'
  },
  {
    id: 'dua-3',
    title: 'Ayat Al-Kursi (Sayyidul Ayat Al-Quran)',
    category: 'Doa Pelindung',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khuzuhuu sinatuw-walaa nawm, lahuu maa fis-samaawaati wa maa fil-ardh...",
    translation: 'Allah, tiada Tuhan melainkan Dia, Yang Tetap Hidup, Yang Kekal selama-lamanya Mentadbirkan sekalian makhluk. Tiada mengantuk dan tiada tidur...',
    fadhilat: 'Surah Al-Baqarah: 255. Perlindungan daripada syaitan, gangguan, dan pembuka pintu ketenangan rohani.'
  },
  {
    id: 'dua-4',
    title: 'Sayyidul Istighfar (Penghulu Segala Istighfar)',
    category: 'Zikir Al-Mathurat',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allaahumma anta Rabbii laa ilaaha illaa anta khalaqtanii wa ana 'abduka wa ana 'alaa 'ahdika wa wa'dika mastatha'tu...",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tiada Tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu...',
    fadhilat: 'Hadis Sahih Al-Bukhari. Sesiapa membacanya pada petang hari lalu meninggal dunia malam itu, nescaya dia tergolong dalam ahli syurga.'
  },
  {
    id: 'dua-5',
    title: 'Doa Ibu Bapa & Kesejahteraan Keluarga',
    category: 'Doa Harian',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii soghiiraa.',
    translation: 'Wahai Tuhanku! Ampunkanlah dosaku dan dosa kedua ibu bapaku, dan kasihanilah mereka berdua sebagaimana mereka telah mendidikku semasa kecil.',
    fadhilat: 'Kewajipan berbakti dan mendoakan ibu bapa sepanjang hayat.'
  }
];

export const defaultIslamicEvents: IslamicEventItem[] = [
  { id: 'evt-1', name: 'Maulidur Rasul 1448H', hijri: '12 Rabiul Awal 1448H', date: '04 September 2026', status: 'Baru Selesai' },
  { id: 'evt-2', name: 'Israk & Mikraj 1448H', hijri: '27 Rejab 1448H', date: '06 Januari 2027', status: 'Akan Datang' },
  { id: 'evt-3', name: 'Awal Ramadhan 1448H', hijri: '1 Ramadhan 1448H', date: '08 Februari 2027', status: 'Akan Datang' },
  { id: 'evt-4', name: 'Hari Raya Aidilfitri', hijri: '1 Syawal 1448H', date: '10 Mac 2027', status: 'Akan Datang' },
  { id: 'evt-5', name: 'Hari Raya Aidiladha 1448H', hijri: '10 Zulhijjah 1448H', date: '17 Mei 2027', status: 'Akan Datang' }
];

export const defaultPdpcModules: PdpcModuleItem[] = [
  {
    id: 'mod-1',
    title: 'Modul Latihan Intensif Tajwid (Hukum Mad & Nun Sakinah)',
    yearLevel: 'Tahun 4 & 5',
    area: 'Al-Quran & Tajwid',
    description: 'Lembaran kerja pengukuhan mengandungi 50 soalan diagnostik hukum mad asli, mad far\'i, dan nun mati beserta skema jawapan.',
    fileSize: '3.4 MB PDF'
  },
  {
    id: 'mod-2',
    title: 'Kad Imbasan Interaktif Rukun Solat 13 & Bacaan Wajib',
    yearLevel: 'Tahun 1 - 6',
    area: 'Ibadah & Kem Bestari Solat',
    description: 'Bahan bantu visual berserta infografik panduan pergerakan solat sempurna, syarat sah, dan amalan sunat ab\'ad serta hai\'at.',
    fileSize: '5.1 MB PDF'
  },
  {
    id: 'mod-3',
    title: 'Siri Celik Jawi: Modul Bimbingan Pantas Menyambung Huruf',
    yearLevel: 'Tahun 2 - 4 (j-QAF)',
    area: 'Jawi & Seni Khat',
    description: 'Latihan ansur maju penguasaan asas abjad jawi, padanan suku kata terbuka & tertutup, dan petikan cerita pendek bertulisan jawi.',
    fileSize: '2.8 MB PDF'
  },
  {
    id: 'mod-4',
    title: 'Modul Hayati Sirah Nabi: Siri Pengorbanan di Kota Madinah',
    yearLevel: 'Tahun 5 & 6',
    area: 'Sirah Nabawiyyah',
    description: 'Bahan komik berilustrasi dan peta minda kronologi pembinaan masjid pertama, persaudaraan Muhajirin & Ansar, serta Piagam Madinah.',
    fileSize: '4.6 MB PDF'
  }
];

export const quickQuizQuestions = [
  {
    id: 1,
    question: 'Berapakah bilangan huruf Mad Asli dalam ilmu Tajwid?',
    options: ['2 huruf (Alif dan Ya)', '3 huruf (Alif, Wau, Ya)', '4 huruf', '6 huruf'],
    correctIndex: 1,
    explanation: 'Huruf Mad Asli ada tiga iaitu Alif (didahului baris Fathah), Wau (didahului baris Dhommah), dan Ya (didahului baris Kasrah).'
  },
  {
    id: 2,
    question: 'Berapakah jarak minimum perjalanan (marhalah) yang membolehkan solat Jamak dan Qasar?',
    options: ['1 Marhalah (~40km)', '2 Marhalah (~81km - 89km)', '3 Marhalah (~120km)', '5 Marhalah (~200km)'],
    correctIndex: 1,
    explanation: 'Jarak 2 marhalah dianggarkan sekitar 81km hingga 89km perjalanan keluar dari kawasan sempadan tempat tinggal.'
  },
  {
    id: 3,
    question: 'Apakah hukum membaca Al-Quran dengan memelihara hukum Tajwid?',
    options: ['Fardhu Ain', 'Fardhu Kifayah', 'Sunat Muakkad', 'Harus'],
    correctIndex: 0,
    explanation: 'Membaca Al-Quran secara bertajwid adalah Fardhu Ain bagi setiap Muslim, manakala mendalami teori ilmu tajwid secara terperinci adalah Fardhu Kifayah.'
  },
  {
    id: 4,
    question: 'Apakah nama gua tempat persembunyian Rasulullah SAW dan Saidina Abu Bakar R.A semasa Hijrah?',
    options: ['Gua Hira\'', 'Gua Thur', 'Gua Uhud', 'Gua Nur'],
    correctIndex: 1,
    explanation: 'Gua Thur (Jabal Thur) adalah tempat perlindungan Rasulullah SAW dan Saidina Abu Bakar R.A selama 3 malam daripada buruan kaum Musyrikin Mekah.'
  }
];

export const defaultMenuItems: MenuItemConfig[] = [
  {
    id: 'utama',
    label: 'Utama',
    subLabel: 'Profil & Jadual',
    iconName: 'Home',
    enabled: true
  },
  {
    id: 'kurikulum',
    label: 'Kurikulum',
    subLabel: 'RPH & PBD',
    iconName: 'BookOpen',
    enabled: true
  },
  {
    id: 'hem',
    label: 'HEM',
    subLabel: 'Sahsiah & Surau',
    iconName: 'Users',
    badge: 'SSDM',
    enabled: true
  },
  {
    id: 'kokurikulum',
    label: 'Kokurikulum',
    subLabel: 'Persatuan & MQSS',
    iconName: 'Award',
    badge: 'Johan',
    enabled: true
  },
  {
    id: 'umum',
    label: 'Umum',
    subLabel: 'Panitia & Galeri',
    iconName: 'Globe',
    enabled: true
  }
];



