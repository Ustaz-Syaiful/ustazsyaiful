import { RPHItem, ScriptType } from '../types';

export interface TasmikRphOptions {
  id?: string;
  week?: number;
  day?: string;
  date?: string;
  time?: string;
  className?: string;
  preferredScript?: ScriptType;
  masteredCount?: number;
  unmasteredCount?: number;
  totalStudents?: number;
  postponedReason?: string;
}

export const TASMIK_OFFICIAL_DATA = {
  jawi: {
    title: 'راخنغن فغاجرن هارين ( تسميع ) 2025/2026',
    subject: 'فنديديقن إسلام (تسميع)',
    learningArea: 'القرأن',
    topic: 'سورة / اقرا مغيكوت تاهف باجأن',
    contentStandard: 'تسميع القرءان / اقرا مڠيكوت تاهڤ باچاءن موريد (KSSR Semakan)',
    learningStandard: 'ممباچ كلمة / اية درڤد سورة اتاو اقرا دڠن بتول دان برتجويد',
    objectives: [
      '1. ممباخ كلمة / اية دان سورة/ اقرا دغن بيمبيغن ضورو.',
      '2. ممباخ اية درفد سورة دغن بتول.',
      '3. ممباخ سورة دغن بتول دان مغيكوت مخرج سرتا برجتويد.'
    ],
    successCriteria: [
      'ممباخ سخارا كلس كومفولن دان اينديؤيدو'
    ],
    inductionActivity: 'ضورو ممڤردڠركن چونتوه باچاءن سورة / اقرا دان ممبري موتيۏاسي باچاءن القرءان.',
    mainActivities: [
      '1. ضورو مندغر باخاءن سورة / اقرا مغيكوت تاهف باجأن موريد سخارا اينديؤيدو.',
      '2. التيه توبي مثبوت/ممباخ كلمة، فوتوغن اية سورة / اقرا مغيكوت تاهف باجأن موريد سخارا اينديؤيدو دغن بتول دان برجتويد.',
      '3. تسميع باخاءن سخارا اينديؤيدو (think pair share) دان دامل كومفولن (round robin).',
      '4. ممفردغركن باخاءن سورة / اقرا مغيكوت تاهف باجأن موريد سخارا تلقي مشافهة.'
    ],
    closureActivity: 'ضورو مپيمق ريکود کماجوان باچاءن، ممبري فوجين سرتا نصيحت استقامة ممباچ القرءان.',
    penilaian: '-منرغكن مقصود. / -مثبوتكن صيفت٢. / - التيهن برتوليس. (PBD)',
    kbat: 'مغفليكسي - اناليسيس حكوم تجويد دان اية.',
    teachingAids: ['القرأن'],
    crossCurricularElements: ['مغفليكسي - اناليسيس حكوم تجويد دان اية.'],
    pbdAssessment: 'ليسن',
    reflectionTemplate: '__ / __ اورغ موريد دافت مغواساءي أوجبيكتيف فمبالجرن دان دبري التيهن فغايأن / فغوكوهن.\n__ / __ اورغ موريد تيدق دافت مغواساءي اوجبيكتيف فمبالجرن دان دبري التيهن فموليهن.',
    tangguhHeading: 'تغضوه : أكتيؤييت تيدق دافت دجالنكن كران -:',
    tangguhOptions: [
      'مشوارت',
      'اكتيؤييت لوار',
      'خوتي رحيت / خوتي ساكيت',
      'فروضرام سكوله',
      'كورسوس',
      'ضورو فغرييغ'
    ],
    checkedBy: 'د سيمق أوليه -: ضورو بسر @ فنولوغ کانن'
  },
  rumi: {
    title: 'RANCANGAN PENGAJARAN HARIAN (TASMIK) 2025/2026',
    subject: 'Pendidikan Islam (Tasmik)',
    learningArea: 'Al-Quran',
    topic: 'Surah / Iqra mengikut tahap bacaan',
    contentStandard: 'Tasmik Al-Quran / Iqra mengikut tahap bacaan murid (KSSR Semakan)',
    learningStandard: 'Membaca kalimah / ayat daripada surah atau iqra dengan betul dan bertajwid',
    objectives: [
      '1. Membaca kalimah / ayat dan surah/ iqra dengan bimbingan guru.',
      '2. Membaca ayat daripada surah dengan betul.',
      '3. Membaca surah dengan betul dan mengikut makhraj serta bertajwid.'
    ],
    successCriteria: [
      'Membaca secara kelas kumpulan dan individu'
    ],
    inductionActivity: 'Guru memperdengarkan contoh bacaan surah / iqra dan memberi motivasi kelancaran Al-Quran.',
    mainActivities: [
      '1. Guru mendengar bacaan surah / iqra mengikut tahap bacaan murid secara individu.',
      '2. Latih tubi menyebut/membaca kalimah, potongan ayat surah / iqra mengikut tahap bacaan murid secara individu dengan betul dan bertajwid.',
      '3. Tasmik bacaan secara individu (think pair share) dan dalam kumpulan (round robin).',
      '4. Memperdengarkan bacaan surah / iqra mengikut tahap bacaan murid secara talaqqi musyafahah.'
    ],
    closureActivity: 'Guru menyemak rekod kemajuan buku tasmik dan merumus kepentingan istiqamah bertadarus.',
    penilaian: '-Menerangkan maksud. / -Menyebutkan sifat-sifat. / - Latihan bertulis. (PBD)',
    kbat: 'Mengaplikasi - Analisis hukum tajwid dan ayat.',
    teachingAids: ['Al-Quran'],
    crossCurricularElements: ['Mengaplikasi - Analisis hukum tajwid dan ayat.'],
    pbdAssessment: 'Lisan',
    reflectionTemplate: '__ / __ orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan / pengukuhan.\n__ / __ orang murid tidak dapat menguasai objektif pembelajaran dan diberi latihan pemulihan.',
    tangguhHeading: 'Tangguh : Aktiviti tidak dapat dijalankan kerana -:',
    tangguhOptions: [
      'Mesyuarat',
      'Aktiviti Luar',
      'Cuti Rehat / Cuti Sakit',
      'Program Sekolah',
      'Kursus',
      'Guru Pengiring'
    ],
    checkedBy: 'Disemak oleh -: Guru Besar @ Penolong Kanan'
  }
};

/**
 * Checks if a given RPH item represents a Tasmik session
 */
export function isTasmikRph(rph: Partial<RPHItem> | null | undefined): boolean {
  if (!rph) return false;
  const topic = (rph.topic || '').toLowerCase();
  const subject = (rph.subject || '').toLowerCase();
  const cs = (rph.contentStandard || '').toLowerCase();
  const rawJawiTopic = rph.jawiOverrides?.topic || '';

  return (
    topic.includes('tasmik') ||
    topic.includes('iqra') ||
    topic.includes('سورة / اقرا') ||
    rawJawiTopic.includes('سورة / اقرا') ||
    rawJawiTopic.includes('تسميع') ||
    subject.includes('tasmik') ||
    subject.includes('تسميع') ||
    cs.includes('tasmik') ||
    cs.includes('تسميع')
  );
}

/**
 * Creates or applies the standardized Tasmik e-RPH
 * Fixed attributes: tajuk, objektif, kriteria kejayaan, aktiviti, penilaian, KBAT, BBM, pentaksiran
 */
export function createTasmikRph(options: TasmikRphOptions = {}): RPHItem {
  const week = options.week || 33;
  const day = options.day || 'Isnin';
  const date = options.date || new Date().toISOString().split('T')[0];
  const time = options.time || '11:00 - 12:00 (60 Minit)';
  const className = options.className || '4 Ibnu Sina';
  const preferredScript = options.preferredScript || 'jawi';

  const jData = TASMIK_OFFICIAL_DATA.jawi;
  const rData = TASMIK_OFFICIAL_DATA.rumi;

  const jawiDayMap: Record<string, string> = {
    'Isnin': 'اثنين',
    'Selasa': 'ثالثاء',
    'Rabu': 'رابو',
    'Khamis': 'خميس',
    'Jumaat': 'جمعة'
  };

  const jawiDay = jawiDayMap[day] || 'اثنين';

  const defaultReflectionJawi = options.totalStudents
    ? `${options.masteredCount ?? options.totalStudents} / ${options.totalStudents} اورغ موريد دافت مغواساءي أوجبيكتيف فمبالجرن دان دبري التيهن فغايأن / فغوكوهن.\n${options.unmasteredCount ?? 0} / ${options.totalStudents} اورغ موريد تيدق دافت مغواساءي اوجبيكتيف فمبالجرن دان دبري التيهن فموليهن.`
    : jData.reflectionTemplate;

  const defaultReflectionRumi = options.totalStudents
    ? `${options.masteredCount ?? options.totalStudents} / ${options.totalStudents} orang murid dapat menguasai objektif pembelajaran dan diberi latihan pengayaan / pengukuhan.\n${options.unmasteredCount ?? 0} / ${options.totalStudents} orang murid tidak dapat menguasai objektif pembelajaran dan diberi latihan pemulihan.`
    : rData.reflectionTemplate;

  return {
    id: options.id || `rph-tasmik-${Date.now()}`,
    week,
    day,
    date,
    time,
    className,
    subject: 'Pendidikan Islam (Tasmik)',
    learningArea: 'Al-Quran',
    topic: rData.topic,
    contentStandard: rData.contentStandard,
    learningStandard: rData.learningStandard,
    objectives: [...rData.objectives],
    successCriteria: [...rData.successCriteria],
    inductionActivity: rData.inductionActivity,
    mainActivities: [...rData.mainActivities],
    closureActivity: rData.closureActivity,
    teachingAids: [...rData.teachingAids],
    crossCurricularElements: [rData.kbat],
    pbdAssessment: rData.pbdAssessment,
    reflection: defaultReflectionRumi,
    status: 'Lengkap',
    preferredScript,
    jawiOverrides: {
      day: jawiDay,
      className,
      subject: jData.subject,
      topic: jData.topic,
      contentStandard: jData.contentStandard,
      learningStandard: jData.learningStandard,
      objectives: [...jData.objectives],
      successCriteria: [...jData.successCriteria],
      inductionActivity: jData.inductionActivity,
      mainActivities: [...jData.mainActivities],
      closureActivity: jData.closureActivity,
      teachingAids: [...jData.teachingAids],
      crossCurricularElements: [jData.kbat],
      pbdAssessment: jData.pbdAssessment,
      reflection: defaultReflectionJawi
    }
  };
}

/**
 * Enforces the standardized Tasmik template onto an existing RPH while keeping its week, date, time & class
 */
export function applyTasmikTemplate(baseRph: RPHItem): RPHItem {
  return createTasmikRph({
    id: baseRph.id,
    week: baseRph.week,
    day: baseRph.day,
    date: baseRph.date,
    time: baseRph.time,
    className: baseRph.className,
    preferredScript: baseRph.preferredScript || 'jawi'
  });
}
